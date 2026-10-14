require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { prisma } = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

function decimalToNumber(value) {
  if (value == null) return null;
  return typeof value === 'object' && value.toNumber ? value.toNumber() : Number(value);
}

function mapDistrictInfo(info) {
  if (!info) return null;
  return {
    ...info,
    avgLandCost: decimalToNumber(info.avgLandCost),
    electricityRateIndustrial: decimalToNumber(info.electricityRateIndustrial),
    electricityFixedCharge: decimalToNumber(info.electricityFixedCharge),
    highwayDistanceKm: decimalToNumber(info.highwayDistanceKm),
  };
}

function mapDistrictProduct(dp) {
  return {
    ...dp,
    avgPrice: decimalToNumber(dp.avgPrice),
  };
}

// --- Public read API (investor & employee flows) ---

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/states', async (_req, res) => {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { districts: true } } },
    });
    res.json(
      states.map((s) => ({
        id: s.id,
        name: s.name,
        active: s.name === 'Bihar',
        districtCount: s._count.districts,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/states/:stateId/districts', async (req, res) => {
  try {
    const stateId = Number(req.params.stateId);
    const districts = await prisma.district.findMany({
      where: { stateId },
      orderBy: { name: 'asc' },
    });
    res.json(districts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const { category, stateId } = req.query;
    const where = {};
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    if (!stateId) {
      return res.json(products);
    }

    const sid = Number(stateId);
    const withAvailability = await Promise.all(
      products.map(async (p) => {
        const count = await prisma.districtProduct.count({
          where: { productId: p.id, district: { stateId: sid } },
        });
        return { ...p, districtCount: count };
      })
    );
    res.json(withAvailability.filter((p) => p.districtCount > 0));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/products/:productId/districts', async (req, res) => {
  try {
    const productId = Number(req.params.productId);
    const { stateId } = req.query;

    const rows = await prisma.districtProduct.findMany({
      where: {
        productId,
        ...(stateId ? { district: { stateId: Number(stateId) } } : {}),
      },
      include: { district: true, product: true },
      orderBy: { avgPrice: 'asc' },
    });
    res.json(rows.map(mapDistrictProduct));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/districts/:districtId', async (req, res) => {
  try {
    const districtId = Number(req.params.districtId);
    const district = await prisma.district.findUnique({
      where: { id: districtId },
      include: {
        state: true,
        districtInfo: true,
        districtProducts: { include: { product: true } },
        subsidies: { include: { product: true } },
        dairyUnions: { include: { dairyUnion: true } },
      },
    });
    if (!district) return res.status(404).json({ error: 'District not found' });

    res.json({
      ...district,
      districtInfo: mapDistrictInfo(district.districtInfo),
      districtProducts: district.districtProducts.map(mapDistrictProduct),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/districts/:districtId/detail', async (req, res) => {
  try {
    const districtId = Number(req.params.districtId);
    const productId = req.query.productId ? Number(req.query.productId) : null;

    const district = await prisma.district.findUnique({
      where: { id: districtId },
      include: {
        state: true,
        districtInfo: true,
        subsidies: {
          where: productId
            ? { OR: [{ productId }, { productId: null }] }
            : undefined,
          include: { product: true },
        },
        dairyUnions: { include: { dairyUnion: true } },
      },
    });
    if (!district) return res.status(404).json({ error: 'District not found' });

    let productCost = null;
    if (productId) {
      const dp = await prisma.districtProduct.findUnique({
        where: { districtId_productId: { districtId, productId } },
        include: { product: true },
      });
      if (dp) productCost = mapDistrictProduct(dp);
    }

    res.json({
      district: { id: district.id, name: district.name, state: district.state },
      info: mapDistrictInfo(district.districtInfo),
      productCost,
      subsidies: district.subsidies,
      dairyUnions: district.dairyUnions.map((du) => du.dairyUnion),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/job-roles', async (req, res) => {
  try {
    const { type } = req.query;
    const roles = await prisma.jobRole.findMany({
      where: type ? { type } : undefined,
      orderBy: { name: 'asc' },
    });
    res.json(roles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/job-roles/:roleId/postings', async (req, res) => {
  try {
    const jobRoleId = Number(req.params.roleId);
    const postings = await prisma.companyJobPosting.findMany({
      where: { jobRoleId },
      include: { district: true, jobRole: true },
      orderBy: [{ status: 'asc' }, { companyName: 'asc' }],
    });
    res.json(postings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/job-postings', async (req, res) => {
  try {
    const { companyName, districtId, jobRoleId, status, contactInfo } = req.body;
    if (!companyName || !districtId || !jobRoleId || !status || !contactInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const posting = await prisma.companyJobPosting.create({
      data: {
        companyName,
        districtId: Number(districtId),
        jobRoleId: Number(jobRoleId),
        status,
        contactInfo,
      },
      include: { district: true, jobRole: true },
    });
    res.status(201).json(posting);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// --- Admin CRUD (no auth — MVP only) ---

app.get('/api/admin/district-info', async (_req, res) => {
  try {
    const rows = await prisma.districtInfo.findMany({
      include: { district: true },
      orderBy: { district: { name: 'asc' } },
    });
    res.json(
      rows.map((row) => ({
        ...mapDistrictInfo(row),
        district: row.district,
      }))
    );
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/district-info/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updated = await prisma.districtInfo.update({
      where: { id },
      data: req.body,
      include: { district: true },
    });
    res.json(mapDistrictInfo(updated));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/district-products', async (req, res) => {
  try {
    const { districtId, productId, avgPrice, notes } = req.body;
    const row = await prisma.districtProduct.create({
      data: {
        districtId: Number(districtId),
        productId: Number(productId),
        avgPrice,
        notes,
      },
      include: { district: true, product: true },
    });
    res.status(201).json(mapDistrictProduct(row));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/district-products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.districtProduct.update({
      where: { id },
      data: req.body,
      include: { district: true, product: true },
    });
    res.json(mapDistrictProduct(row));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, category } = req.body;
    const p = await prisma.product.create({ data: { name, category } });
    res.status(201).json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const p = await prisma.product.update({ where: { id }, data: req.body });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/job-postings', async (_req, res) => {
  try {
    const rows = await prisma.companyJobPosting.findMany({
      include: { district: true, jobRole: true },
      orderBy: { id: 'desc' },
    });
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/admin/job-postings/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await prisma.companyJobPosting.update({
      where: { id },
      data: req.body,
      include: { district: true, jobRole: true },
    });
    res.json(row);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/admin/job-postings/:id', async (req, res) => {
  try {
    await prisma.companyJobPosting.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
