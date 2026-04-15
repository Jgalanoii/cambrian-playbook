// src/data/rfpSources.js
// Global RFP database registry + signal detection logic
// Used in: fit scoring (buying signal detection), RFP resource widget

export const RFP_SOURCES = {

  usa: {
    region: "North America",
    country: "United States",
    sources: [
      {
        name: "SAM.gov",
        url: "https://sam.gov/api/prod/sgs/v1/search/",
        apiUrl: "https://api.sam.gov/opportunities/v2/search",
        authRequired: true,
        authType: "API key — register at sam.gov",
        coverage: "All federal opportunities >$25K",
        updateFrequency: "Real-time",
        freeAccess: true,
        fields: ["title","description","naicsCode","placeOfPerformance","responseDeadLine","baseType","typeOfSetAsideDescription","estimatedTotalValue"],
        bestFor: ["Federal agencies","Defense","Healthcare","IT"],
        signalValue: "HIGH — active federal buying"
      },
      {
        name: "FPDS-NG",
        url: "https://www.fpds.gov/fpdsng_cms/index.php/en/",
        apiUrl: "https://api.fpds.gov/web/feeds/",
        authRequired: false,
        coverage: "All awarded federal contracts since 1993",
        updateFrequency: "Daily",
        freeAccess: true,
        bestFor: ["Competitive intelligence","Incumbent identification","Contract values"],
        signalValue: "HIGH — shows what agencies actually bought and from whom"
      },
      {
        name: "USASpending.gov",
        url: "https://www.usaspending.gov/",
        apiUrl: "https://api.usaspending.gov/api/v2/",
        authRequired: false,
        coverage: "All federal spending — contracts, grants, loans",
        updateFrequency: "Daily",
        freeAccess: true,
        bestFor: ["Budget intelligence","Agency spend patterns","Incumbent vendors"],
        signalValue: "HIGH — shows budget allocation and vendor relationships"
      },
      {
        name: "DemandStar",
        url: "https://www.demandstar.com/",
        authRequired: true,
        coverage: "State, local, municipal RFPs across all 50 states",
        updateFrequency: "Real-time",
        freeAccess: false,
        cost: "Subscription",
        bestFor: ["State/local government","Municipalities","School districts"],
        signalValue: "MED — state/local buying cycles longer but less competitive"
      }
    ]
  },

  europe: {
    region: "Europe",
    sources: [
      {
        name: "TED — Tenders Electronic Daily",
        url: "https://ted.europa.eu",
        apiUrl: "https://api.ted.europa.eu/v3/",
        authRequired: false,
        authType: "Anonymous search available. EU Login for submission.",
        coverage: "All EU member states + EEA — 27 countries, back to 1993",
        updateFrequency: "Daily — ~700 new notices/day",
        freeAccess: true,
        bulkDownload: "ftp://ted.europa.eu — guest/guest",
        sparqlEndpoint: "https://data.ted.europa.eu/",
        bestFor: ["EU public sector","Government agencies","NGOs","Multilaterals"],
        signalValue: "HIGH — most structured procurement data in the world",
        cpvCodes: "Common Procurement Vocabulary — 8-digit industry codes",
        notes: "Data includes: who bought what from whom, for how much, which procedure, award criteria"
      },
      {
        name: "Find a Tender (UK)",
        url: "https://www.find-tender.service.gov.uk/",
        apiUrl: "https://www.find-tender.service.gov.uk/api/1.0/ocds/",
        authRequired: false,
        coverage: "UK public sector post-Brexit",
        updateFrequency: "Real-time",
        freeAccess: true,
        bestFor: ["UK central government","NHS","Local authorities"],
        signalValue: "HIGH"
      },
      {
        name: "Contracts Finder (UK)",
        url: "https://www.contractsfinder.service.gov.uk/",
        apiUrl: "https://www.contractsfinder.service.gov.uk/Published/Notices/PublicSearch/",
        authRequired: false,
        coverage: "UK contracts >£10K central, >£25K local",
        freeAccess: true,
        signalValue: "MED-HIGH"
      }
    ]
  },

  latam: {
    region: "Latin America",
    sources: [
      {
        name: "CompraNet (Mexico)",
        url: "https://compranet.hacienda.gob.mx/",
        authRequired: false,
        coverage: "All Mexican federal procurement",
        freeAccess: true,
        signalValue: "MED"
      },
      {
        name: "Mercado Público (Chile)",
        url: "https://www.mercadopublico.cl/",
        apiUrl: "https://api.mercadopublico.cl/",
        authRequired: true,
        authType: "Free API key",
        coverage: "All Chilean public procurement",
        freeAccess: true,
        signalValue: "MED"
      },
      {
        name: "SEACE (Peru)",
        url: "https://www.seace.gob.pe/",
        authRequired: false,
        coverage: "All Peruvian public procurement",
        freeAccess: true,
        signalValue: "MED"
      },
      {
        name: "SICE (Colombia)",
        url: "https://www.colombiacompra.gov.co/",
        authRequired: false,
        coverage: "Colombian public procurement",
        freeAccess: true,
        signalValue: "MED"
      },
      {
        name: "UNOPS",
        url: "https://www.unops.org/business-with-us/procurement-notices",
        authRequired: false,
        coverage: "UN-funded projects across LatAm + global",
        freeAccess: true,
        signalValue: "HIGH — large contracts, fast decisions"
      }
    ]
  },

  apac: {
    region: "Asia Pacific",
    sources: [
      {
        name: "AusTender (Australia)",
        url: "https://www.tenders.gov.au/",
        apiUrl: "https://www.tenders.gov.au/Home/Api",
        authRequired: false,
        coverage: "All Australian federal procurement",
        freeAccess: true,
        signalValue: "HIGH"
      },
      {
        name: "GeBIZ (Singapore)",
        url: "https://www.gebiz.gov.sg/",
        authRequired: false,
        coverage: "Singapore government procurement",
        freeAccess: true,
        signalValue: "HIGH — Singapore is APAC's most tech-forward buyer"
      },
      {
        name: "GETS (New Zealand)",
        url: "https://www.gets.govt.nz/",
        authRequired: false,
        coverage: "New Zealand government procurement",
        freeAccess: true,
        signalValue: "MED"
      },
      {
        name: "MERX (Canada)",
        url: "https://www.merx.com/",
        authRequired: false,
        coverage: "Canadian federal + provincial procurement",
        freeAccess: true,
        signalValue: "HIGH"
      }
    ]
  },

  multilateral: {
    region: "Global — Multilateral",
    sources: [
      {
        name: "World Bank eProcurement",
        url: "https://projects.worldbank.org/en/projects-operations/procurement",
        apiUrl: "https://search.worldbank.org/api/v2/projects",
        authRequired: false,
        coverage: "All World Bank-funded projects globally — $50B+/year",
        freeAccess: true,
        signalValue: "HIGH — large budgets, established procurement process"
      },
      {
        name: "UNGM — UN Global Marketplace",
        url: "https://www.ungm.org/Public/Notice",
        authRequired: false,
        coverage: "All UN agency procurement — WHO, UNICEF, WFP, UNDP, etc.",
        freeAccess: true,
        signalValue: "HIGH — predictable cycles, large contracts"
      },
      {
        name: "IFC / ADB / IDB",
        url: "https://www.ifc.org/",
        authRequired: false,
        coverage: "Development finance institution procurement",
        freeAccess: true,
        signalValue: "MED-HIGH — large infrastructure + tech contracts"
      },
      {
        name: "RFPMart",
        url: "https://www.rfpmart.com/",
        authRequired: false,
        coverage: "Global aggregator — USA, EU, NGOs, private sector",
        freeAccess: true,
        signalValue: "MED — aggregated, less structured"
      },
      {
        name: "RFPdb",
        url: "https://www.rfpdb.com/",
        authRequired: false,
        coverage: "US-focused aggregator, some global",
        freeAccess: true,
        signalValue: "LOW-MED — quality varies"
      }
    ]
  }
};

// ── SIGNAL DETECTION RULES ────────────────────────────────────────────────
// Applied when cross-referencing account names against RFP databases

export const RFP_SIGNAL_RULES = {
  activeRFP: {
    scoreBoost: 20,
    label: "Active RFP",
    description: "Account has an open RFP matching seller's category — they are actively buying NOW",
    urgency: "IMMEDIATE"
  },
  recentAward: {
    scoreBoost: 10,
    label: "Recent Award",
    description: "Account awarded a contract in seller's category in last 12 months — budget exists",
    urgency: "HIGH"
  },
  historicalBuyer: {
    scoreBoost: 5,
    label: "Historical Buyer",
    description: "Account has purchased in seller's category before — established budget line",
    urgency: "MED"
  },
  incumbentRisk: {
    scorePenalty: -10,
    label: "Incumbent Risk",
    description: "Account awarded long-term contract to competitor — displacement will be hard",
    urgency: "LOW"
  }
};

// ── CPV CODE MAPPING (EU TED) ─────────────────────────────────────────────
// Maps seller categories to EU Common Procurement Vocabulary codes

export const CPV_CATEGORY_MAP = {
  "Fintech/Payments": ["66000000", "66100000", "66110000", "72000000"],
  "Digital Rewards/Incentives": ["79342200", "79342300", "72212000"],
  "SaaS/Software": ["72000000", "72200000", "72260000", "48000000"],
  "AI/ML": ["72212000", "72316000", "48311000"],
  "Data Analytics": ["72316000", "72300000", "72322000"],
  "Compliance/RegTech": ["79100000", "72316000", "66171000"],
  "Healthcare IT": ["72000000", "85000000", "72212000"],
  "HR/Workforce": ["79600000", "72512000", "79212000"]
};

// ── NAICS CODE MAPPING (USA SAM.gov) ─────────────────────────────────────
export const NAICS_CATEGORY_MAP = {
  "Fintech/Payments": ["522320", "522390", "523130", "523999"],
  "SaaS/Software": ["511210", "541511", "541512", "541519"],
  "AI/ML": ["541715", "541511", "541512"],
  "Data Analytics": ["541511", "541519", "518210"],
  "Compliance/RegTech": ["541611", "541690", "522320"],
  "Digital Rewards": ["541613", "541810", "454111"],
  "Healthcare IT": ["621111", "621610", "541512"],
  "HR/Workforce": ["561311", "541612", "561320"]
};
