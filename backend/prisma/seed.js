const { PrismaClient, ProductCategory, JobRoleType, JobPostingStatus } = require('@prisma/client');

const prisma = new PrismaClient();

/** BERC FY 2026-27 LT Industrial LTIS-I (without govt subsidy) — statewide NBPDCL/SBPDCL */
const BERC_LT_ENERGY_RSVAH = 7.79;
const BERC_LT_FIXED_RSKVA = 278.0;
/** BERC FY 2024-25 HT Industrial HTS-I 11kV — for large plants reference */
const BERC_HT_ENERGY_RSKVAH = 7.98;
const BERC_HT_FIXED_RSKVA = 550.0;

const TARIFF_NOTE =
  'BERC approved retail tariff without govt subsidy. LT Industrial LTIS-I: Rs 278/kVA/month fixed + Rs 7.79/kVAh energy (FY 2026-27). HT Industrial HTS-I (11kV): Rs 550/kVA/month + Rs 7.98/kVAh (FY 2024-25). TODO: replace land cost with local circle rates; highway km with site survey.';

const PLACEHOLDER_LAND = 850000; // Rs/acre placeholder

const minerals = {
  Rohtas: ['Limestone', 'Pyrite'],
  'Kaimur (Bhabhua)': ['Limestone'],
  Munger: ['Bauxite', 'Slate Stone', 'Steatite (Soapstone)'],
  Nawada: ['Mica'],
  Jamui: ['Gold', 'Magnetite (Iron Ore)'],
  Gaya: ['Gold'],
};

const agricultural = {
  Rohtas: ['Rice', 'Wheat'],
  Aurangabad: ['Rice', 'Wheat', 'Pulses'],
  'West Champaran': ['Rice', 'Banana', 'Vegetables'],
  Madhubani: ['Rice'],
  'Kaimur (Bhabhua)': ['Wheat', 'Pulses'],
  Siwan: ['Wheat'],
  'East Champaran': ['Wheat', 'Vegetables'],
  Kishanganj: ['Jute', 'Tea', 'Banana'],
  Purnia: ['Jute', 'Banana'],
  Muzaffarpur: ['Litchi', 'Vegetables'],
  Bhagalpur: ['Mango (Zardalu)', 'Banana', 'Vegetables'],
  Patna: ['Pulses', 'Vegetables'],
  Nalanda: ['Pulses', 'Vegetables'],
  Vaishali: ['Banana', 'Vegetables'],
  Begusarai: ['Vegetables'],
  Katihar: ['Banana', 'Vegetables'],
};

const dairyUnions = {
  'Mithila Milk Union': ['Samastipur', 'Darbhanga', 'Madhubani'],
  'Bhagalpur Milk Union': ['Bhagalpur', 'Munger', 'Banka', 'Jamui'],
  'Magadh Dairy Project': ['Gaya', 'Jehanabad', 'Arwal', 'Nawada'],
  'Kosi Dairy Project': [
    'Saharsa',
    'Supaul',
    'Madhepura',
    'Kishanganj',
    'Katihar',
    'Purnia',
    'Araria',
  ],
  'Biharsharif Dairy Project': ['Nalanda', 'Sheikhpura'],
};

const infrastructure = {
  Aurangabad: { nh: 'NH 19 (GT Road)', water: 'Sone River' },
  Bhagalpur: { nh: 'NH 80 / NH 31', water: 'Ganga River' },
  Darbhanga: { nh: 'NH 27', water: 'Bagmati River' },
  'East Champaran': { nh: 'NH 28A / NH 727', water: 'Gandak River' },
  Gaya: { nh: 'NH 83 / NH 82 / NH 20', water: 'Falgu River' },
  Jamui: { nh: 'NH 333', water: 'Kiul River' },
  'Kaimur (Bhabhua)': { nh: 'NH 19 / NH 30', water: 'Sone River / Karamnasa River' },
  Katihar: { nh: 'NH 31', water: 'Mahananda River' },
  Kishanganj: { nh: 'NH 27 / NH 31', water: 'Mahananda River' },
  Madhubani: { nh: 'NH 57 / NH 27', water: 'Kamla Balan River' },
  Munger: { nh: 'NH 80 / NH 333', water: 'Ganga River' },
  Muzaffarpur: { nh: 'NH 28 / NH 322', water: 'Bagmati River / Gandak River' },
  Nalanda: { nh: 'NH 20 / NH 82', water: 'Panchane River' },
  Nawada: { nh: 'NH 31 / NH 20', water: 'Local streams' },
  Patna: { nh: 'NH 19 / NH 30 / NH 31 / NH 139', water: 'Ganga River / Sone River' },
  Purnia: { nh: 'NH 27 / NH 31', water: 'Kosi River / Mahananda River' },
  Rohtas: { nh: 'NH 19 / NH 757', water: 'Sone River' },
  Siwan: { nh: 'NH 531 / NH 27', water: 'Daha River' },
  Vaishali: { nh: 'NH 103 / NH 322', water: 'Ganga River / Gandak River' },
  'West Champaran': { nh: 'NH 28A / NH 727', water: 'Gandak River' },
};

/** North Bihar (NBPDCL) vs South (SBPDCL) — same BERC LT rate; HT reference stored in notes */
const northBiharDistricts = new Set([
  'West Champaran',
  'East Champaran',
  'Sitamarhi',
  'Madhubani',
  'Supaul',
  'Araria',
  'Kishanganj',
  'Purnia',
  'Katihar',
  'Madhepura',
  'Saharsa',
  'Darbhanga',
  'Muzaffarpur',
  'Samastipur',
  'Begusarai',
  'Khagaria',
  'Bhagalpur',
  'Banka',
  'Munger',
  'Jamui',
  'Lakhisarai',
  'Sheikhpura',
  'Nalanda',
  'Patna',
  'Vaishali',
  'Saran',
  'Siwan',
  'Gopalganj',
]);

function electricityForDistrict(name) {
  const discom = northBiharDistricts.has(name) ? 'NBPDCL' : 'SBPDCL';
  return {
    energy: BERC_LT_ENERGY_RSVAH,
    fixed: BERC_LT_FIXED_RSKVA,
    notes: `${TARIFF_NOTE} Discom: ${discom}. HT reference: ${BERC_HT_ENERGY_RSKVAH} Rs/kVAh + ${BERC_HT_FIXED_RSKVA} Rs/kVA/month.`,
  };
}

const placeholderPrice = {
  mineral: { Limestone: 450, Pyrite: 1200, Bauxite: 2800, 'Slate Stone': 600, 'Steatite (Soapstone)': 900, Mica: 3500, Gold: 0, 'Magnetite (Iron Ore)': 2200 },
  agricultural: { Rice: 28, Wheat: 26, Pulses: 85, Banana: 18, Vegetables: 22, Jute: 45, Tea: 180, 'Litchi': 120, 'Mango (Zardalu)': 65 },
  dairy: { Milk: 42 },
};

const jobRoles = [
  { name: 'Mining Engineer', type: JobRoleType.technical },
  { name: 'Agricultural Scientist', type: JobRoleType.technical },
  { name: 'Dairy Technologist', type: JobRoleType.technical },
  { name: 'Quality Control Inspector', type: JobRoleType.technical },
  { name: 'Electrician', type: JobRoleType.technical },
  { name: 'Labour', type: JobRoleType.non_technical },
  { name: 'Farm Worker', type: JobRoleType.non_technical },
  { name: 'Driver', type: JobRoleType.non_technical },
  { name: 'Packaging Staff', type: JobRoleType.non_technical },
  { name: 'Security Guard', type: JobRoleType.non_technical },
];

function collectDistrictNames() {
  const set = new Set();
  Object.keys(minerals).forEach((d) => set.add(d));
  Object.keys(agricultural).forEach((d) => set.add(d));
  Object.values(dairyUnions)
    .flat()
    .forEach((d) => set.add(d));
  Object.keys(infrastructure).forEach((d) => set.add(d));
  return [...set].sort();
}

async function main() {
  await prisma.companyJobPosting.deleteMany();
  await prisma.subsidy.deleteMany();
  await prisma.districtProduct.deleteMany();
  await prisma.districtDairyUnion.deleteMany();
  await prisma.districtInfo.deleteMany();
  await prisma.district.deleteMany();
  await prisma.product.deleteMany();
  await prisma.dairyUnion.deleteMany();
  await prisma.jobRole.deleteMany();
  await prisma.state.deleteMany();

  const bihar = await prisma.state.create({ data: { name: 'Bihar' } });

  const otherStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
  ];
  for (const name of otherStates) {
    await prisma.state.create({ data: { name } });
  }

  const districtMap = {};
  for (const name of collectDistrictNames()) {
    const d = await prisma.district.create({
      data: { name, stateId: bihar.id },
    });
    districtMap[name] = d.id;
  }

  const productRecords = {};
  async function ensureProduct(name, category) {
    if (productRecords[name]) return productRecords[name];
    const p = await prisma.product.create({ data: { name, category } });
    productRecords[name] = p;
    return p;
  }

  for (const [district, products] of Object.entries(minerals)) {
    for (const prod of products) {
      const p = await ensureProduct(prod, ProductCategory.mineral);
      const price = placeholderPrice.mineral[prod] ?? 500;
      await prisma.districtProduct.create({
        data: {
          districtId: districtMap[district],
          productId: p.id,
          avgPrice: price,
          notes: price === 0 ? 'Contact DM for auction rates' : 'Placeholder avg price — TODO: market survey',
        },
      });
    }
  }

  for (const [district, products] of Object.entries(agricultural)) {
    for (const prod of products) {
      const p = await ensureProduct(prod, ProductCategory.agricultural);
      await prisma.districtProduct.create({
        data: {
          districtId: districtMap[district],
          productId: p.id,
          avgPrice: placeholderPrice.agricultural[prod] ?? 30,
          notes: 'Placeholder mandi avg — TODO: Agmark/local mandi data',
        },
      });
    }
  }

  const milk = await ensureProduct('Milk', ProductCategory.dairy);
  for (const unionName of Object.keys(dairyUnions)) {
    for (const district of dairyUnions[unionName]) {
      if (!districtMap[district]) {
        const d = await prisma.district.create({
          data: { name: district, stateId: bihar.id },
        });
        districtMap[district] = d.id;
      }
      await prisma.districtProduct.upsert({
        where: {
          districtId_productId: {
            districtId: districtMap[district],
            productId: milk.id,
          },
        },
        create: {
          districtId: districtMap[district],
          productId: milk.id,
          avgPrice: placeholderPrice.dairy.Milk,
          notes: 'Cooperative procurement rate placeholder',
        },
        update: {},
      });
    }
  }

  for (const [unionName, districts] of Object.entries(dairyUnions)) {
    const union = await prisma.dairyUnion.create({ data: { name: unionName } });
    for (const district of districts) {
      await prisma.districtDairyUnion.create({
        data: { districtId: districtMap[district], dairyUnionId: union.id },
      });
    }
  }

  for (const [district, info] of Object.entries(infrastructure)) {
    if (!districtMap[district]) continue;
    const elec = electricityForDistrict(district);
    await prisma.districtInfo.create({
      data: {
        districtId: districtMap[district],
        avgLandCost: PLACEHOLDER_LAND,
        electricityRateIndustrial: elec.energy,
        electricityFixedCharge: elec.fixed,
        electricityTariffNotes: elec.notes,
        nearestWaterSource: info.water,
        nearestNationalHighway: info.nh,
        highwayDistanceKm: null,
      },
    });
  }

  for (const name of collectDistrictNames()) {
    if (!districtMap[name]) continue;
    const existing = await prisma.districtInfo.findUnique({
      where: { districtId: districtMap[name] },
    });
    if (!existing) {
      const elec = electricityForDistrict(name);
      await prisma.districtInfo.create({
        data: {
          districtId: districtMap[name],
          avgLandCost: PLACEHOLDER_LAND,
          electricityRateIndustrial: elec.energy,
          electricityFixedCharge: elec.fixed,
          electricityTariffNotes: elec.notes,
          nearestWaterSource: 'TODO: hydrology lookup',
          nearestNationalHighway: 'TODO: NH lookup',
          highwayDistanceKm: null,
        },
      });
    }
  }

  for (const role of jobRoles) {
    await prisma.jobRole.create({ data: role });
  }

  const sampleSubsidies = [
    {
      district: 'Patna',
      product: 'Vegetables',
      schemeName: 'Bihar Horticulture Mission',
      description: 'Support for vegetable cultivation infrastructure and inputs.',
      link: 'https://horticulture.bihar.gov.in/',
    },
    {
      district: 'Rohtas',
      product: 'Limestone',
      schemeName: 'Industrial Investment Promotion',
      description: 'State incentives for mineral-based industries in Rohtas belt.',
      link: null,
    },
    {
      district: 'Samastipur',
      product: 'Milk',
      schemeName: 'Dairy Entrepreneurship Development',
      description: 'Subsidy on dairy equipment for cooperative members.',
      link: null,
    },
  ];

  for (const s of sampleSubsidies) {
    const product = productRecords[s.product];
    await prisma.subsidy.create({
      data: {
        districtId: districtMap[s.district],
        productId: product?.id ?? null,
        schemeName: s.schemeName,
        description: s.description,
        link: s.link,
      },
    });
  }

  const roles = await prisma.jobRole.findMany();
  const labour = roles.find((r) => r.name === 'Labour');
  const mining = roles.find((r) => r.name === 'Mining Engineer');

  await prisma.companyJobPosting.createMany({
    data: [
      {
        companyName: 'Rohtas Cement Ltd',
        districtId: districtMap.Rohtas,
        jobRoleId: mining.id,
        status: JobPostingStatus.hiring_now,
        contactInfo: 'hr@rohtascement.example | +91-9876543210',
      },
      {
        companyName: 'Patna Agro Pack',
        districtId: districtMap.Patna,
        jobRoleId: labour.id,
        status: JobPostingStatus.hiring_now,
        contactInfo: 'jobs@patnaagro.example | +91-9123456780',
      },
      {
        companyName: 'Mithila Dairy Co-op',
        districtId: districtMap.Samastipur,
        jobRoleId: roles.find((r) => r.name === 'Dairy Technologist').id,
        status: JobPostingStatus.upcoming,
        contactInfo: 'careers@mithilamilk.example',
      },
    ],
  });

  console.log('Seed completed: Bihar districts, products, BERC electricity rates, job roles.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
