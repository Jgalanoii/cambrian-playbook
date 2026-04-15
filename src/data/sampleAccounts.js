// src/data/sampleAccounts.js
//
// 100 sample accounts spanning ~18 industries — enough distribution to
// test the v106 cohort cap (top 9 + "Other"). No `acv` field: Annual
// Contract Value is a salesperson input captured in Account Review, not
// an attribute of the account itself.
//
// Fields:
//   company, industry, lead_source, outcome, company_url, employees, publicPrivate

export const SAMPLE_ROWS = [
  // ── Banking (11) ─────────────────────────────────────────────────────────
  {company:"JPMorgan Chase",            industry:"Banking", lead_source:"Outbound",   outcome:"Digital transformation",          company_url:"jpmorganchase.com",  employees:"~310,000", publicPrivate:"Public (NYSE: JPM)"},
  {company:"Bank of America",           industry:"Banking", lead_source:"Partner",    outcome:"Fraud reduction",                 company_url:"bankofamerica.com",  employees:"~213,000", publicPrivate:"Public (NYSE: BAC)"},
  {company:"Wells Fargo",               industry:"Banking", lead_source:"Referral",   outcome:"Compliance modernization",        company_url:"wellsfargo.com",     employees:"~227,000", publicPrivate:"Public (NYSE: WFC)"},
  {company:"Citigroup",                 industry:"Banking", lead_source:"Conference", outcome:"Commercial lending growth",       company_url:"citigroup.com",      employees:"~240,000", publicPrivate:"Public (NYSE: C)"},
  {company:"Goldman Sachs",             industry:"Banking", lead_source:"Referral",   outcome:"Advisor productivity",            company_url:"goldmansachs.com",   employees:"~49,000",  publicPrivate:"Public (NYSE: GS)"},
  {company:"U.S. Bank",                 industry:"Banking", lead_source:"Outbound",   outcome:"Retail banking modernization",    company_url:"usbank.com",         employees:"~77,000",  publicPrivate:"Public (NYSE: USB)"},
  {company:"PNC Financial Services",    industry:"Banking", lead_source:"Partner",    outcome:"Commercial banking growth",       company_url:"pnc.com",            employees:"~56,000",  publicPrivate:"Public (NYSE: PNC)"},
  {company:"KeyBank",                   industry:"Banking", lead_source:"Referral",   outcome:"Middle-market expansion",         company_url:"key.com",            employees:"~17,000",  publicPrivate:"Public (NYSE: KEY)"},
  {company:"Huntington Bancshares",     industry:"Banking", lead_source:"Outbound",   outcome:"SMB lending growth",              company_url:"huntington.com",     employees:"~20,000",  publicPrivate:"Public (NASDAQ: HBAN)"},
  {company:"M&T Bank",                  industry:"Banking", lead_source:"Conference", outcome:"Regional expansion",              company_url:"mtb.com",            employees:"~22,000",  publicPrivate:"Public (NYSE: MTB)"},
  {company:"First Business Financial",  industry:"Banking", lead_source:"Referral",   outcome:"Commercial lending growth",       company_url:"firstbusiness.com",  employees:"~700",     publicPrivate:"Public (NASDAQ: FBIZ)"},

  // ── Insurance (9) ────────────────────────────────────────────────────────
  {company:"State Farm Insurance",      industry:"Insurance", lead_source:"Outbound",   outcome:"Agent productivity",            company_url:"statefarm.com",      employees:"~54,000",  publicPrivate:"Private (Mutual)"},
  {company:"USAA",                      industry:"Insurance", lead_source:"Referral",   outcome:"Member retention",              company_url:"usaa.com",           employees:"~36,000",  publicPrivate:"Private (Mutual)"},
  {company:"Allstate",                  industry:"Insurance", lead_source:"Outbound",   outcome:"Claims automation",             company_url:"allstate.com",       employees:"~54,000",  publicPrivate:"Public (NYSE: ALL)"},
  {company:"Progressive",               industry:"Insurance", lead_source:"Partner",    outcome:"Underwriting efficiency",       company_url:"progressive.com",    employees:"~61,000",  publicPrivate:"Public (NYSE: PGR)"},
  {company:"Travelers",                 industry:"Insurance", lead_source:"Conference", outcome:"Commercial lines growth",       company_url:"travelers.com",      employees:"~30,000",  publicPrivate:"Public (NYSE: TRV)"},
  {company:"Liberty Mutual",            industry:"Insurance", lead_source:"Referral",   outcome:"Digital claims",                company_url:"libertymutual.com",  employees:"~45,000",  publicPrivate:"Private (Mutual)"},
  {company:"Nationwide",                industry:"Insurance", lead_source:"Outbound",   outcome:"Agent enablement",              company_url:"nationwide.com",     employees:"~25,000",  publicPrivate:"Private (Mutual)"},
  {company:"Chubb",                     industry:"Insurance", lead_source:"Conference", outcome:"Specialty underwriting",        company_url:"chubb.com",          employees:"~34,000",  publicPrivate:"Public (NYSE: CB)"},
  {company:"Prudential Financial",      industry:"Insurance", lead_source:"Referral",   outcome:"Retirement platform",           company_url:"prudential.com",     employees:"~40,000",  publicPrivate:"Public (NYSE: PRU)"},

  // ── Health Insurance (7) ────────────────────────────────────────────────
  {company:"UnitedHealth Group",        industry:"Health Insurance", lead_source:"Outbound",   outcome:"Member engagement",       company_url:"unitedhealthgroup.com", employees:"~400,000", publicPrivate:"Public (NYSE: UNH)"},
  {company:"Elevance Health",           industry:"Health Insurance", lead_source:"Partner",    outcome:"Care navigation",         company_url:"elevancehealth.com",    employees:"~104,000", publicPrivate:"Public (NYSE: ELV)"},
  {company:"Cigna",                     industry:"Health Insurance", lead_source:"Conference", outcome:"Pharmacy benefit ops",    company_url:"cigna.com",             employees:"~70,000",  publicPrivate:"Public (NYSE: CI)"},
  {company:"Humana Inc.",               industry:"Health Insurance", lead_source:"Referral",   outcome:"Medicare Advantage growth",company_url:"humana.com",            employees:"~60,000",  publicPrivate:"Public (NYSE: HUM)"},
  {company:"Aflac",                     industry:"Health Insurance", lead_source:"Outbound",   outcome:"Digital claims",          company_url:"aflac.com",             employees:"~10,000",  publicPrivate:"Public (NYSE: AFL)"},
  {company:"Kaiser Permanente",         industry:"Health Insurance", lead_source:"Partner",    outcome:"Integrated care ops",     company_url:"kp.org",                employees:"~220,000", publicPrivate:"Private (Non-profit)"},
  {company:"Centene",                   industry:"Health Insurance", lead_source:"Referral",   outcome:"Medicaid ops",            company_url:"centene.com",           employees:"~75,000",  publicPrivate:"Public (NYSE: CNC)"},

  // ── Healthcare Providers (6) ────────────────────────────────────────────
  {company:"HCA Healthcare",            industry:"Healthcare Providers", lead_source:"Outbound",   outcome:"Hospital ops efficiency",     company_url:"hcahealthcare.com",  employees:"~280,000", publicPrivate:"Public (NYSE: HCA)"},
  {company:"CVS Health",                industry:"Healthcare Providers", lead_source:"Partner",    outcome:"Clinical workflow",           company_url:"cvshealth.com",      employees:"~300,000", publicPrivate:"Public (NYSE: CVS)"},
  {company:"Tenet Healthcare",          industry:"Healthcare Providers", lead_source:"Conference", outcome:"Revenue cycle modernization", company_url:"tenethealth.com",    employees:"~106,000", publicPrivate:"Public (NYSE: THC)"},
  {company:"DaVita",                    industry:"Healthcare Providers", lead_source:"Outbound",   outcome:"Clinical ops",                company_url:"davita.com",         employees:"~70,000",  publicPrivate:"Public (NYSE: DVA)"},
  {company:"Inland Empire Health Plan", industry:"Healthcare Providers", lead_source:"Referral",   outcome:"Member services",             company_url:"iehp.org",           employees:"~3,000",   publicPrivate:"Private (Non-profit)"},
  {company:"LifeStance Health",         industry:"Healthcare Providers", lead_source:"Outbound",   outcome:"Clinical ops",                company_url:"lifestance.com",     employees:"~8,000",   publicPrivate:"Public (NASDAQ: LFST)"},

  // ── Retail & E-commerce (9) ─────────────────────────────────────────────
  {company:"Walmart",                   industry:"Retail & E-commerce", lead_source:"Outbound",   outcome:"Workforce productivity", company_url:"walmart.com",   employees:"~2,100,000", publicPrivate:"Public (NYSE: WMT)"},
  {company:"Amazon",                    industry:"Retail & E-commerce", lead_source:"Partner",    outcome:"Last-mile ops",           company_url:"amazon.com",    employees:"~1,500,000", publicPrivate:"Public (NASDAQ: AMZN)"},
  {company:"Target Corporation",        industry:"Retail & E-commerce", lead_source:"Partner",    outcome:"Operational efficiency",  company_url:"target.com",    employees:"~400,000",   publicPrivate:"Public (NYSE: TGT)"},
  {company:"Costco Wholesale",          industry:"Retail & E-commerce", lead_source:"Referral",   outcome:"Member loyalty",          company_url:"costco.com",    employees:"~310,000",   publicPrivate:"Public (NASDAQ: COST)"},
  {company:"The Home Depot",            industry:"Retail & E-commerce", lead_source:"Conference", outcome:"Pro-customer growth",     company_url:"homedepot.com", employees:"~475,000",   publicPrivate:"Public (NYSE: HD)"},
  {company:"Lowe's",                    industry:"Retail & E-commerce", lead_source:"Outbound",   outcome:"Omnichannel ops",         company_url:"lowes.com",     employees:"~290,000",   publicPrivate:"Public (NYSE: LOW)"},
  {company:"Best Buy",                  industry:"Retail & E-commerce", lead_source:"Partner",    outcome:"Services revenue growth", company_url:"bestbuy.com",   employees:"~85,000",    publicPrivate:"Public (NYSE: BBY)"},
  {company:"Publix Super Markets",      industry:"Retail & E-commerce", lead_source:"Referral",   outcome:"Workforce productivity",  company_url:"publix.com",    employees:"~240,000",   publicPrivate:"Private (Employee-owned)"},
  {company:"The Kroger Co.",            industry:"Retail & E-commerce", lead_source:"Outbound",   outcome:"Supply chain efficiency", company_url:"kroger.com",    employees:"~420,000",   publicPrivate:"Public (NYSE: KR)"},

  // ── Consumer Goods (6) ──────────────────────────────────────────────────
  {company:"Procter & Gamble",          industry:"Consumer Goods", lead_source:"Conference", outcome:"DTC expansion",              company_url:"pg.com",             employees:"~107,000", publicPrivate:"Public (NYSE: PG)"},
  {company:"Unilever",                  industry:"Consumer Goods", lead_source:"Partner",    outcome:"Brand loyalty",              company_url:"unilever.com",       employees:"~128,000", publicPrivate:"Public (NYSE: UL)"},
  {company:"Estée Lauder",              industry:"Consumer Goods", lead_source:"Referral",   outcome:"Digital channel growth",     company_url:"elcompanies.com",    employees:"~62,000",  publicPrivate:"Public (NYSE: EL)"},
  {company:"Kimberly-Clark",            industry:"Consumer Goods", lead_source:"Outbound",   outcome:"Supply chain modernization", company_url:"kimberly-clark.com", employees:"~39,000",  publicPrivate:"Public (NYSE: KMB)"},
  {company:"Nike Inc.",                 industry:"Consumer Goods", lead_source:"Outbound",   outcome:"Digital transformation",     company_url:"nike.com",           employees:"~80,000",  publicPrivate:"Public (NYSE: NKE)"},
  {company:"Cargill",                   industry:"Consumer Goods", lead_source:"Referral",   outcome:"Supply chain efficiency",    company_url:"cargill.com",        employees:"~160,000", publicPrivate:"Private"},

  // ── Technology / SaaS (8) ───────────────────────────────────────────────
  {company:"Microsoft",                 industry:"Technology / SaaS", lead_source:"Partner",    outcome:"Enterprise AI adoption",  company_url:"microsoft.com",    employees:"~228,000", publicPrivate:"Public (NASDAQ: MSFT)"},
  {company:"Oracle",                    industry:"Technology / SaaS", lead_source:"Conference", outcome:"Cloud migration",         company_url:"oracle.com",       employees:"~164,000", publicPrivate:"Public (NYSE: ORCL)"},
  {company:"Salesforce",                industry:"Technology / SaaS", lead_source:"Partner",    outcome:"Platform expansion",      company_url:"salesforce.com",   employees:"~72,000",  publicPrivate:"Public (NYSE: CRM)"},
  {company:"Adobe",                     industry:"Technology / SaaS", lead_source:"Outbound",   outcome:"Digital experience ops",  company_url:"adobe.com",        employees:"~30,000",  publicPrivate:"Public (NASDAQ: ADBE)"},
  {company:"ServiceNow",                industry:"Technology / SaaS", lead_source:"Referral",   outcome:"Workflow automation",     company_url:"servicenow.com",   employees:"~22,000",  publicPrivate:"Public (NYSE: NOW)"},
  {company:"Workday",                   industry:"Technology / SaaS", lead_source:"Conference", outcome:"HR analytics adoption",   company_url:"workday.com",      employees:"~19,000",  publicPrivate:"Public (NASDAQ: WDAY)"},
  {company:"Atlassian",                 industry:"Technology / SaaS", lead_source:"Partner",    outcome:"Enterprise expansion",    company_url:"atlassian.com",    employees:"~12,000",  publicPrivate:"Public (NASDAQ: TEAM)"},
  {company:"Bloomberg L.P.",            industry:"Technology / SaaS", lead_source:"Referral",   outcome:"Terminal-adjacent growth", company_url:"bloomberg.com",   employees:"~21,000",  publicPrivate:"Private"},

  // ── Fintech (8) ─────────────────────────────────────────────────────────
  {company:"Stripe",                    industry:"Fintech", lead_source:"Partner",    outcome:"Platform revenue growth",   company_url:"stripe.com",    employees:"~8,000",   publicPrivate:"Private (VC-backed)"},
  {company:"Block (Square)",            industry:"Fintech", lead_source:"Conference", outcome:"SMB expansion",             company_url:"block.xyz",     employees:"~13,000",  publicPrivate:"Public (NYSE: SQ)"},
  {company:"PayPal",                    industry:"Fintech", lead_source:"Outbound",   outcome:"Checkout conversion",       company_url:"paypal.com",    employees:"~27,000",  publicPrivate:"Public (NASDAQ: PYPL)"},
  {company:"Adyen",                     industry:"Fintech", lead_source:"Referral",   outcome:"Unified commerce growth",   company_url:"adyen.com",     employees:"~4,200",   publicPrivate:"Public (AMS: ADYEN)"},
  {company:"Plaid",                     industry:"Fintech", lead_source:"Partner",    outcome:"Partnership expansion",     company_url:"plaid.com",     employees:"~900",     publicPrivate:"Private (VC Series D)"},
  {company:"Brex",                      industry:"Fintech", lead_source:"Referral",   outcome:"Revenue acceleration",      company_url:"brex.com",      employees:"~1,200",   publicPrivate:"Private (VC Series D)"},
  {company:"Ramp",                      industry:"Fintech", lead_source:"Outbound",   outcome:"Expansion revenue",         company_url:"ramp.com",      employees:"~900",     publicPrivate:"Private (VC-backed, YC)"},
  {company:"Carta",                     industry:"Fintech", lead_source:"Conference", outcome:"Enterprise growth",         company_url:"carta.com",     employees:"~1,800",   publicPrivate:"Private (VC Series G)"},

  // ── Hospitality & Travel (6) ────────────────────────────────────────────
  {company:"Marriott International",    industry:"Hospitality & Travel", lead_source:"Conference", outcome:"Customer experience",     company_url:"marriott.com",        employees:"~120,000", publicPrivate:"Public (NASDAQ: MAR)"},
  {company:"Hilton Worldwide",          industry:"Hospitality & Travel", lead_source:"Partner",    outcome:"Loyalty program growth",  company_url:"hilton.com",          employees:"~178,000", publicPrivate:"Public (NYSE: HLT)"},
  {company:"Hyatt Hotels",              industry:"Hospitality & Travel", lead_source:"Outbound",   outcome:"Owner partnerships",      company_url:"hyatt.com",           employees:"~53,000",  publicPrivate:"Public (NYSE: H)"},
  {company:"Delta Air Lines",           industry:"Hospitality & Travel", lead_source:"Referral",   outcome:"Premium cabin revenue",   company_url:"delta.com",           employees:"~100,000", publicPrivate:"Public (NYSE: DAL)"},
  {company:"American Airlines",         industry:"Hospitality & Travel", lead_source:"Conference", outcome:"Operational reliability", company_url:"aa.com",              employees:"~130,000", publicPrivate:"Public (NASDAQ: AAL)"},
  {company:"United Airlines",           industry:"Hospitality & Travel", lead_source:"Partner",    outcome:"Hub network optimization",company_url:"united.com",          employees:"~103,000", publicPrivate:"Public (NASDAQ: UAL)"},

  // ── Manufacturing (6) ───────────────────────────────────────────────────
  {company:"3M",                        industry:"Manufacturing", lead_source:"Outbound",   outcome:"Industrial ops efficiency",  company_url:"3m.com",           employees:"~85,000",  publicPrivate:"Public (NYSE: MMM)"},
  {company:"Honeywell",                 industry:"Manufacturing", lead_source:"Partner",    outcome:"Connected industrial ops",   company_url:"honeywell.com",    employees:"~97,000",  publicPrivate:"Public (NASDAQ: HON)"},
  {company:"Illinois Tool Works",       industry:"Manufacturing", lead_source:"Referral",   outcome:"Segment margin growth",      company_url:"itw.com",          employees:"~46,000",  publicPrivate:"Public (NYSE: ITW)"},
  {company:"Parker Hannifin",           industry:"Manufacturing", lead_source:"Conference", outcome:"Aftermarket services",       company_url:"parker.com",       employees:"~60,000",  publicPrivate:"Public (NYSE: PH)"},
  {company:"Emerson Electric",          industry:"Manufacturing", lead_source:"Outbound",   outcome:"Automation adoption",        company_url:"emerson.com",      employees:"~68,000",  publicPrivate:"Public (NYSE: EMR)"},
  {company:"Caterpillar",               industry:"Manufacturing", lead_source:"Partner",    outcome:"Dealer network growth",      company_url:"caterpillar.com",  employees:"~109,000", publicPrivate:"Public (NYSE: CAT)"},

  // ── Media & Entertainment (4) ───────────────────────────────────────────
  {company:"The Walt Disney Company",   industry:"Media & Entertainment", lead_source:"Conference", outcome:"DTC subscriber growth",  company_url:"disney.com",          employees:"~220,000", publicPrivate:"Public (NYSE: DIS)"},
  {company:"Warner Bros. Discovery",    industry:"Media & Entertainment", lead_source:"Referral",   outcome:"Streaming margin growth",company_url:"wbd.com",             employees:"~35,000",  publicPrivate:"Public (NASDAQ: WBD)"},
  {company:"Comcast",                   industry:"Media & Entertainment", lead_source:"Partner",    outcome:"Broadband + media ops",  company_url:"comcast.com",         employees:"~186,000", publicPrivate:"Public (NASDAQ: CMCSA)"},
  {company:"Netflix",                   industry:"Media & Entertainment", lead_source:"Outbound",   outcome:"Ad-tier launch",         company_url:"netflix.com",         employees:"~13,000",  publicPrivate:"Public (NASDAQ: NFLX)"},

  // ── Transportation & Logistics (4) ──────────────────────────────────────
  {company:"UPS",                       industry:"Transportation & Logistics", lead_source:"Outbound",   outcome:"Route optimization",        company_url:"ups.com",             employees:"~495,000", publicPrivate:"Public (NYSE: UPS)"},
  {company:"FedEx",                     industry:"Transportation & Logistics", lead_source:"Partner",    outcome:"Ground network efficiency", company_url:"fedex.com",           employees:"~500,000", publicPrivate:"Public (NYSE: FDX)"},
  {company:"Union Pacific",             industry:"Transportation & Logistics", lead_source:"Conference", outcome:"Rail ops reliability",      company_url:"up.com",              employees:"~30,000",  publicPrivate:"Public (NYSE: UNP)"},
  {company:"C.H. Robinson",             industry:"Transportation & Logistics", lead_source:"Referral",   outcome:"Digital freight growth",    company_url:"chrobinson.com",      employees:"~15,000",  publicPrivate:"Public (NASDAQ: CHRW)"},

  // ── Professional Services (4) ───────────────────────────────────────────
  {company:"Deloitte",                  industry:"Professional Services", lead_source:"Referral",   outcome:"Advisory practice growth", company_url:"deloitte.com", employees:"~460,000", publicPrivate:"Private (Partnership)"},
  {company:"PwC",                       industry:"Professional Services", lead_source:"Conference", outcome:"Digital services expansion",company_url:"pwc.com",     employees:"~370,000", publicPrivate:"Private (Partnership)"},
  {company:"EY",                        industry:"Professional Services", lead_source:"Partner",    outcome:"Managed services",         company_url:"ey.com",       employees:"~395,000", publicPrivate:"Private (Partnership)"},
  {company:"KPMG",                      industry:"Professional Services", lead_source:"Outbound",   outcome:"Audit transformation",     company_url:"kpmg.com",     employees:"~273,000", publicPrivate:"Private (Partnership)"},

  // ── Energy & Utilities (3) ──────────────────────────────────────────────
  {company:"NextEra Energy",            industry:"Energy & Utilities", lead_source:"Outbound",   outcome:"Renewables buildout",      company_url:"nexteraenergy.com", employees:"~15,000", publicPrivate:"Public (NYSE: NEE)"},
  {company:"Exxon Mobil",               industry:"Energy & Utilities", lead_source:"Conference", outcome:"Operations digitization",  company_url:"corporate.exxonmobil.com", employees:"~62,000", publicPrivate:"Public (NYSE: XOM)"},
  {company:"Duke Energy",               industry:"Energy & Utilities", lead_source:"Referral",   outcome:"Grid modernization",       company_url:"duke-energy.com",   employees:"~28,000", publicPrivate:"Public (NYSE: DUK)"},

  // ── Real Estate (3) ─────────────────────────────────────────────────────
  {company:"Prologis",                  industry:"Real Estate", lead_source:"Partner",    outcome:"Logistics REIT growth",   company_url:"prologis.com", employees:"~2,600", publicPrivate:"Public (NYSE: PLD)"},
  {company:"Simon Property Group",      industry:"Real Estate", lead_source:"Conference", outcome:"Mall reinvention",        company_url:"simon.com",    employees:"~3,000", publicPrivate:"Public (NYSE: SPG)"},
  {company:"Equity Residential",        industry:"Real Estate", lead_source:"Outbound",   outcome:"Resident experience",     company_url:"equityapartments.com", employees:"~2,400", publicPrivate:"Public (NYSE: EQR)"},

  // ── Education (2) ───────────────────────────────────────────────────────
  {company:"Coursera",                  industry:"Education", lead_source:"Partner",    outcome:"Enterprise learning",       company_url:"coursera.org", employees:"~1,100", publicPrivate:"Public (NYSE: COUR)"},
  {company:"2U",                        industry:"Education", lead_source:"Referral",   outcome:"University partnerships",   company_url:"2u.com",       employees:"~4,000", publicPrivate:"Public (NASDAQ: TWOU)"},

  // ── Telecom (2) ─────────────────────────────────────────────────────────
  {company:"Verizon Communications",    industry:"Telecom", lead_source:"Outbound",   outcome:"5G monetization",          company_url:"verizon.com", employees:"~117,000", publicPrivate:"Public (NYSE: VZ)"},
  {company:"AT&T",                      industry:"Telecom", lead_source:"Conference", outcome:"Fiber expansion",          company_url:"att.com",     employees:"~150,000", publicPrivate:"Public (NYSE: T)"},

  // ── Automotive (1) ──────────────────────────────────────────────────────
  {company:"Ford Motor Company",        industry:"Automotive", lead_source:"Referral",   outcome:"EV transition",         company_url:"ford.com",    employees:"~177,000", publicPrivate:"Public (NYSE: F)"},

  // ── Aerospace & Defense (1) ─────────────────────────────────────────────
  {company:"Boeing",                    industry:"Aerospace & Defense", lead_source:"Conference", outcome:"Manufacturing quality",  company_url:"boeing.com",  employees:"~170,000", publicPrivate:"Public (NYSE: BA)"},
];
