const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const LIVE_STATE = "Bihar";

const DISTRICTS = [
  { id: "araria", name: "Araria", products: ["Maize", "Milk"], notes: "High-yield maize; Kosi Dairy Union", highway: "NH 27", water: "Kosi River" },
  { id: "arwal", name: "Arwal", products: ["Milk"], notes: "Magadh Dairy Union", highway: "NH 139", water: "Sone River" },
  { id: "aurangabad", name: "Aurangabad", products: ["Rice", "Wheat", "Pulses"], notes: "", highway: "NH 19 (GT Road)", water: "Sone River" },
  { id: "banka", name: "Banka", products: ["Tasar Silk", "Milk"], notes: "Bhagalpur Dairy Union", highway: "NH 133", water: "Chandan River" },
  { id: "begusarai", name: "Begusarai", products: ["Maize", "Wheat", "Soybean", "Vegetables"], notes: "Top-yield wheat district", highway: "NH 31", water: "Ganga River" },
  { id: "bhagalpur", name: "Bhagalpur", products: ["Mango", "Tasar Silk", "Banana", "Vegetables", "Milk"], notes: "Zardalu mango; India's premier tussar belt; Bhagalpur Dairy Union", highway: "NH 80 / NH 31", water: "Ganga River" },
  { id: "bhojpur", name: "Bhojpur (Ara)", products: ["Rice"], notes: "Top-3 rice producing district", highway: "NH 922", water: "Ganga River / Sone River" },
  { id: "buxar", name: "Buxar", products: ["Wheat", "Rice"], notes: "", highway: "NH 922", water: "Ganga River" },
  { id: "darbhanga", name: "Darbhanga", products: ["Maize", "Milk"], notes: "Mithila Dairy Union", highway: "NH 27", water: "Bagmati River" },
  { id: "east-champaran", name: "East Champaran (Motihari)", products: ["Wheat", "Sugarcane", "Vegetables"], notes: "", highway: "NH 28A / NH 727", water: "Gandak River" },
  { id: "gaya", name: "Gaya", products: ["Gold"], notes: "Mineral / gold belt", highway: "NH 83 / NH 82 / NH 20", water: "Falgu River" },
  { id: "gopalganj", name: "Gopalganj", products: ["Sugarcane"], notes: "~10% of state sugarcane production", highway: "NH 27", water: "Gandak River" },
  { id: "jamui", name: "Jamui", products: ["Gold", "Magnetite", "Tasar Silk"], notes: "Magnetite (iron ore)", highway: "NH 333 (GT Road link)", water: "Kiul River" },
  { id: "jehanabad", name: "Jehanabad", products: ["Pulses", "Milk"], notes: "Highest pulse yield in state; Magadh Dairy Union", highway: "NH 83", water: "Falgu River" },
  { id: "kaimur", name: "Kaimur (Bhabhua)", products: ["Limestone", "Wheat", "Pulses", "Tasar Silk"], notes: "", highway: "NH 19 / NH 30", water: "Sone River / Karamnasa River" },
  { id: "katihar", name: "Katihar", products: ["Maize", "Banana", "Vegetables", "Milk"], notes: "Top maize district; Kosi Dairy Union", highway: "NH 31", water: "Mahananda River" },
  { id: "khagaria", name: "Khagaria", products: ["Maize", "Soybean"], notes: "", highway: "NH 31", water: "Ganga River / Kosi River" },
  { id: "kishanganj", name: "Kishanganj", products: ["Jute", "Tea", "Banana", "Mulberry Silk", "Milk"], notes: "Kosi Dairy Union", highway: "NH 27 / NH 31", water: "Mahananda River" },
  { id: "lakhisarai", name: "Lakhisarai", products: ["Quartzite"], notes: "", highway: "NH 33", water: "Kiul River" },
  { id: "madhepura", name: "Madhepura", products: ["Maize", "Milk"], notes: "Kosi Dairy Union", highway: "NH 131", water: "Kosi River" },
  { id: "madhubani", name: "Madhubani", products: ["Rice", "Milk"], notes: "Mithila Dairy Union", highway: "NH 57 / NH 27", water: "Kamla Balan River" },
  { id: "munger", name: "Munger", products: ["Bauxite", "Slate Stone", "Steatite", "Tasar Silk", "Milk"], notes: "Bhagalpur Dairy Union", highway: "NH 80 / NH 333", water: "Ganga River" },
  { id: "muzaffarpur", name: "Muzaffarpur", products: ["Litchi", "Rice", "Vegetables", "Eri Silk"], notes: "Top-2 rice district; Shahi litchi GI", highway: "NH 28 / NH 322", water: "Bagmati River / Gandak River" },
  { id: "nalanda", name: "Nalanda", products: ["Pulses", "Vegetables", "Quartzite", "Milk"], notes: "Biharsharif Dairy Union", highway: "NH 20 / NH 82", water: "Panchane River" },
  { id: "nawada", name: "Nawada", products: ["Mica", "Tasar Silk", "Milk"], notes: "Magadh Dairy Union", highway: "NH 31 / NH 20", water: "Local streams (no major river)" },
  { id: "patna", name: "Patna", products: ["Pulses", "Vegetables"], notes: "Top-producing pulses district", highway: "NH 19 / NH 30 / NH 31 / NH 139", water: "Ganga River / Sone River" },
  { id: "purnia", name: "Purnia (Purnea)", products: ["Maize", "Jute", "Banana", "Mulberry Silk", "Milk"], notes: "Kosi Dairy Union", highway: "NH 27 / NH 31", water: "Kosi River / Mahananda River" },
  { id: "rohtas", name: "Rohtas", products: ["Limestone", "Pyrite", "Rice", "Wheat"], notes: "Top rice producing district", highway: "NH 19 / NH 757", water: "Sone River" },
  { id: "saharsa", name: "Saharsa", products: ["Maize", "Mulberry Silk", "Milk"], notes: "High-yield maize; Kosi Dairy Union", highway: "NH 231", water: "Kosi River" },
  { id: "samastipur", name: "Samastipur", products: ["Maize", "Soybean", "Milk"], notes: "High-yield maize; Mithila Dairy Union", highway: "NH 122", water: "Burhi Gandak River" },
  { id: "saran", name: "Saran (Chapra)", products: ["Wheat"], notes: "Top-2 wheat yield district", highway: "NH 31", water: "Ganga River / Gandak River" },
  { id: "sheikhpura", name: "Sheikhpura", products: ["Milk"], notes: "Biharsharif Dairy Union", highway: "NH 333A", water: "Local streams" },
  { id: "sheohar", name: "Sheohar", products: [], notes: "No investment-grade data found", highway: "NH 104", water: "Bagmati River" },
  { id: "sitamarhi", name: "Sitamarhi", products: [], notes: "No investment-grade data found", highway: "NH 104", water: "Bagmati River" },
  { id: "siwan", name: "Siwan", products: ["Wheat"], notes: "", highway: "NH 531 / NH 27", water: "Daha River" },
  { id: "supaul", name: "Supaul", products: ["Maize", "Mulberry Silk", "Milk"], notes: "High-yield maize; Kosi Dairy Union", highway: "NH 57", water: "Kosi River" },
  { id: "vaishali", name: "Vaishali", products: ["Banana", "Vegetables"], notes: "", highway: "NH 103 / NH 322", water: "Ganga River / Gandak River" },
  { id: "west-champaran", name: "West Champaran (Bettiah)", products: ["Sugarcane", "Rice", "Banana", "Vegetables"], notes: "~53% of state sugarcane — largest", highway: "NH 28A / NH 727", water: "Gandak River" }
];

const PRODUCT_ALIASES = {
  "Milk": ["Milk", "Dairy"],
  "Dairy": ["Milk", "Dairy"],
  "Tasar Silk": ["Tasar Silk", "Tussar Silk"],
  "Tussar Silk": ["Tasar Silk", "Tussar Silk"],
  "Magnetite": ["Magnetite", "Iron Ore"],
  "Mango": ["Mango", "Zardalu Mango"]
};

const PRODUCTS = [
  "Milk / Dairy", "Maize", "Rice", "Wheat", "Pulses", "Vegetables", "Sugarcane",
  "Banana", "Soybean", "Jute", "Tea", "Mango", "Litchi", "Tasar Silk",
  "Mulberry Silk", "Eri Silk", "Gold", "Magnetite", "Limestone", "Quartzite",
  "Bauxite", "Slate Stone", "Steatite", "Mica", "Pyrite"
];

function productKey(label) {
  if (label === "Milk / Dairy") return "Milk";
  return label;
}

function districtHasProduct(district, productLabel) {
  const key = productKey(productLabel);
  const aliases = PRODUCT_ALIASES[key] || [key];
  return district.products.some((p) => aliases.includes(p) || p === key);
}

const ELECTRICITY = {
  source: "BERC approved retail tariff FY 2026-27 (NBPDCL & SBPDCL) — uniform across Bihar",
  investorFocus: [
    { name: "IAS-I Irrigation (Metered)", fixed: "₹100 / HP / month", energy: "₹6.74 / unit" },
    { name: "IAS-I Irrigation (Unmetered)", fixed: "₹1,350 / HP / month", energy: "—" },
    { name: "IAS-II Irrigation (Demand)", fixed: "₹500 / kVA / month", energy: "₹7.17 / kVAh" },
    { name: "LTIS-I Low Tension Industrial", fixed: "₹275 / kVA / month", energy: "₹7.79 / kVAh" },
    { name: "LTIS-II Low Tension Industrial", fixed: "₹350 / kVA / month", energy: "₹7.79 / kVAh" },
    { name: "HTS-I Industrial (11 kV)", fixed: "₹550 / kVA / month", energy: "₹7.98 / kVAh" },
    { name: "HTS-II Industrial (33 kV)", fixed: "₹550 / kVA / month", energy: "₹7.92 / kVAh" },
    { name: "HTSS (11/33 kV)", fixed: "₹800 / kVA / month", energy: "₹4.94 / kVAh" }
  ],
  other: [
    { name: "Kutir Jyoti (Domestic)", fixed: "₹20 / connection / month", energy: "₹7.42 / unit (0–50)" },
    { name: "DS-I Rural", fixed: "₹40 / kW / month", energy: "₹7.42 / unit" },
    { name: "DS-II Demand based", fixed: "₹80 / kW / month", energy: "₹7.42 / unit" },
    { name: "NDS-I Rural", fixed: "₹60 / kW / month", energy: "₹7.79 / kVAh" },
    { name: "NDS-II up to 0.5 kW", fixed: "₹150 / connection / month", energy: "₹7.71 / unit" },
    { name: "NDS-II above 0.5 kW", fixed: "₹350 / kW / month", energy: "₹7.73 / kVAh" },
    { name: "Public Water Works", fixed: "₹650 / kVA / month", energy: "₹6.72 / kVAh" },
    { name: "Har Ghar Nal", fixed: "₹100 / HP / month", energy: "₹8.16 / unit" },
    { name: "LT EV charging", fixed: "—", energy: "₹8.71 / unit" }
  ]
};

const STATEWIDE_SUBSIDIES = [
  {
    title: "Bihar Industrial Investment Promotion Policy",
    body: "Capital investment subsidy (typically 15–30% of eligible plant & machinery, category-linked), interest subvention, 100% stamp-duty reimbursement on land/lease, and electricity-duty exemption for a defined period for eligible manufacturing units."
  },
  {
    title: "PM Formalisation of Micro Food Processing Enterprises (PMFME)",
    body: "Credit-linked subsidy for micro food processing (typically ~35% of eligible project cost, capped), plus branding and cluster support for rice mills, dairy, fruits, vegetables and spices."
  },
  {
    title: "Agriculture Infrastructure Fund / cold chain",
    body: "Interest subvention and credit guarantee for warehouses, pack-houses, ripening chambers and primary processing near production clusters."
  },
  {
    title: "Electricity duty & industrial power incentives (Bihar)",
    body: "Eligible new industrial units may claim electricity-duty exemption/reimbursement as notified. Irrigation pumpsets under IAS tariffs are separate from industrial LTIS/HTS."
  }
];

function subsidiesFor(productLabel, district) {
  const key = productKey(productLabel);
  const extra = [];
  if (key === "Milk") {
    extra.push({
      title: "Dairy — COMFED / NPDD / DEDS-type support",
      body: `${district.name} is linked to organised dairy unions. Investors can align with milk procurement, bulk coolers, BMC and processing. Central dairy infrastructure schemes plus state cooperative offtake reduce offtake risk.`
    });
  }
  if (["Rice", "Wheat", "Maize", "Pulses", "Soybean"].includes(key)) {
    extra.push({
      title: "Crop cluster & MSP procurement ecosystem",
      body: `Bihar Agriculture Roadmap and procurement/FCI–state channels support raw-material security for ${key} processing. Input subsidy and farm-mechanisation schemes sit with growers; processors use PMFME / industrial policy.`
    });
  }
  if (["Tasar Silk", "Mulberry Silk", "Eri Silk"].includes(key)) {
    extra.push({
      title: "Silk Samagra / state sericulture",
      body: "Support for rearing, reeling, twisting and weaving; Bihar’s tussar belt (Bhagalpur–Banka–Jamui–Munger) is a recognised production cluster."
    });
  }
  if (["Mango", "Litchi", "Banana", "Vegetables", "Tea"].includes(key)) {
    extra.push({
      title: "MIDH / horticulture mission",
      body: "Assistance for pack-houses, ripening, primary processing and GI produce (e.g. Shahi litchi, Zardalu mango) plus export-oriented clusters."
    });
  }
  if (key === "Sugarcane") {
    extra.push({
      title: "Sugar / ethanol industrial route",
      body: "West Champaran holds ~53% of Bihar cane. Distillery/ethanol and crushing projects map to industrial policy plus DFPD/MoPNG ethanol blending offtake."
    });
  }
  if (["Gold", "Magnetite", "Limestone", "Quartzite", "Bauxite", "Mica", "Pyrite", "Slate Stone", "Steatite"].includes(key)) {
    extra.push({
      title: "Mineral & mining-linked industry",
      body: "District mineral endowment is investment-grade. Processing units follow mining lease, environment clearance and Bihar industrial incentives — not farm subsidies."
    });
  }
  if (["Jute"].includes(key)) {
    extra.push({
      title: "Jute packaging / NJB ecosystem",
      body: "National Jute Board quality and diversification support plus industrial policy for jute-based manufacturing in Kosi–Seemanchal districts."
    });
  }
  extra.push({
    title: "District logistics note",
    body: `Nearest corridor: ${district.highway}. Water: ${district.water}. Use this for siting plants, ETPs and irrigation-linked units.`
  });
  return [...STATEWIDE_SUBSIDIES, ...extra];
}

const JOBS = {
  technical: [
    "Dairy Plant Operator",
    "Quality Control Analyst",
    "Electrical Maintenance Technician",
    "Irrigation & Pump Technician",
    "Food Processing Technician",
    "Sericulture Technical Assistant",
    "Cold Storage Technician",
    "Agronomist",
    "Boiler Operator",
    "GIS / Farm Data Analyst"
  ],
  "non-technical": [
    "Farm Supervisor",
    "Milk Collection Agent",
    "Packaging Worker",
    "Warehouse Helper",
    "Sales & Procurement Executive",
    "Logistics Coordinator",
    "Field Enumerator",
    "Security Staff",
    "Office Assistant",
    "Harvest Labour Supervisor"
  ]
};

const SEED_SEEKERS = [
  { name: "Anjali Kumari", age: 26, phone: "9876500101", email: "anjali.k@example.com", districtId: "patna", education: "B.Sc Food Technology", experience: "2 years QC lab", workType: "technical", job: "Quality Control Analyst" },
  { name: "Ravi Ranjan", age: 31, phone: "9876500102", email: "ravi.r@example.com", districtId: "patna", education: "ITI Electrician", experience: "5 years plant maintenance", workType: "technical", job: "Electrical Maintenance Technician" },
  { name: "Sunita Devi", age: 29, phone: "9876500103", email: "sunita.d@example.com", districtId: "patna", education: "12th pass", experience: "3 years packaging line", workType: "non-technical", job: "Packaging Worker" },
  { name: "Manoj Singh", age: 34, phone: "9876500104", email: "manoj.s@example.com", districtId: "muzaffarpur", education: "Diploma Horticulture", experience: "6 years pack-house", workType: "technical", job: "Food Processing Technician" },
  { name: "Priya Jha", age: 24, phone: "9876500105", email: "priya.j@example.com", districtId: "muzaffarpur", education: "Graduate", experience: "1 year procurement", workType: "non-technical", job: "Sales & Procurement Executive" },
  { name: "Amit Kumar", age: 28, phone: "9876500106", email: "amit.k@example.com", districtId: "bhagalpur", education: "Sericulture certificate", experience: "4 years reeling unit", workType: "technical", job: "Sericulture Technical Assistant" },
  { name: "Neha Sharma", age: 27, phone: "9876500107", email: "neha.s@example.com", districtId: "gaya", education: "B.Tech Electrical", experience: "3 years industrial", workType: "technical", job: "Electrical Maintenance Technician" },
  { name: "Sanjay Yadav", age: 36, phone: "9876500108", email: "sanjay.y@example.com", districtId: "west-champaran", education: "Diploma Mechanical", experience: "8 years sugar mill", workType: "technical", job: "Boiler Operator" },
  { name: "Kavita Das", age: 22, phone: "9876500109", email: "kavita.d@example.com", districtId: "katihar", education: "12th pass", experience: "Fresh — dairy collection", workType: "non-technical", job: "Milk Collection Agent" },
  { name: "Rahul Paswan", age: 30, phone: "9876500110", email: "rahul.p@example.com", districtId: "samastipur", education: "B.Sc Agriculture", experience: "4 years farm extension", workType: "technical", job: "Agronomist" },
  { name: "Pooja Sinha", age: 25, phone: "9876500111", email: "pooja.s@example.com", districtId: "nalanda", education: "Diploma Dairy Tech", experience: "2 years BMC operations", workType: "technical", job: "Dairy Plant Operator" }
];
