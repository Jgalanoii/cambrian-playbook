// src/data/sampleAccounts.js
//
// 150 sample accounts spanning 35 industries — covers every vertical in
// our knowledge layer inventory. Mix of enterprise, mid-market, and SMB
// across public, private, PE-backed, government, and nonprofit.
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

  // ── Government / SLED (4) ──────────────────────────────────────────────
  {company:"General Services Administration", industry:"Government", lead_source:"RFP",      outcome:"IT modernization",        company_url:"gsa.gov",             employees:"~12,000",  publicPrivate:"Government"},
  {company:"Department of Veterans Affairs",  industry:"Government", lead_source:"RFP",      outcome:"Healthcare IT",           company_url:"va.gov",              employees:"~400,000", publicPrivate:"Government"},
  {company:"City of Austin",                  industry:"Government", lead_source:"RFP",      outcome:"Digital services",        company_url:"austintexas.gov",     employees:"~14,000",  publicPrivate:"Government (Municipal)"},
  {company:"State of Ohio",                   industry:"Government", lead_source:"RFP",      outcome:"Benefits modernization",  company_url:"ohio.gov",            employees:"~50,000",  publicPrivate:"Government (State)"},

  // ── Cybersecurity (3) ──────────────────────────────────────────────────
  {company:"CrowdStrike",              industry:"Cybersecurity", lead_source:"Outbound",   outcome:"Endpoint detection",       company_url:"crowdstrike.com",    employees:"~8,500",   publicPrivate:"Public (NASDAQ: CRWD)"},
  {company:"Palo Alto Networks",       industry:"Cybersecurity", lead_source:"Partner",    outcome:"SASE adoption",            company_url:"paloaltonetworks.com", employees:"~15,000", publicPrivate:"Public (NASDAQ: PANW)"},
  {company:"Fortinet",                 industry:"Cybersecurity", lead_source:"Conference", outcome:"SD-WAN expansion",         company_url:"fortinet.com",       employees:"~13,000",  publicPrivate:"Public (NASDAQ: FTNT)"},

  // ── AI / ML (3) ────────────────────────────────────────────────────────
  {company:"Palantir Technologies",    industry:"AI / ML", lead_source:"Outbound",   outcome:"Data platform expansion",  company_url:"palantir.com",       employees:"~3,800",   publicPrivate:"Public (NYSE: PLTR)"},
  {company:"C3.ai",                    industry:"AI / ML", lead_source:"Conference", outcome:"Enterprise AI adoption",   company_url:"c3.ai",              employees:"~900",     publicPrivate:"Public (NYSE: AI)"},
  {company:"DataRobot",               industry:"AI / ML", lead_source:"Referral",   outcome:"ML operationalization",    company_url:"datarobot.com",      employees:"~1,200",   publicPrivate:"Private (VC-backed)"},

  // ── Cannabis (3) ───────────────────────────────────────────────────────
  {company:"Curaleaf Holdings",        industry:"Cannabis", lead_source:"Outbound",   outcome:"Multi-state compliance",   company_url:"curaleaf.com",       employees:"~5,500",   publicPrivate:"Public (CSE: CURA)"},
  {company:"Trulieve Cannabis",        industry:"Cannabis", lead_source:"Referral",   outcome:"Retail operations",        company_url:"trulieve.com",       employees:"~10,000",  publicPrivate:"Public (CSE: TRUL)"},
  {company:"Dutchie",                  industry:"Cannabis", lead_source:"Partner",    outcome:"Point-of-sale modernization", company_url:"dutchie.com",     employees:"~500",     publicPrivate:"Private (VC-backed)"},

  // ── Crypto / Stablecoin (3) ────────────────────────────────────────────
  {company:"Coinbase",                 industry:"Crypto", lead_source:"Outbound",   outcome:"Compliance automation",    company_url:"coinbase.com",       employees:"~3,400",   publicPrivate:"Public (NASDAQ: COIN)"},
  {company:"Circle",                   industry:"Crypto", lead_source:"Conference", outcome:"USDC infrastructure",      company_url:"circle.com",         employees:"~1,000",   publicPrivate:"Private (VC-backed)"},
  {company:"Fireblocks",              industry:"Crypto", lead_source:"Partner",    outcome:"Digital asset custody",    company_url:"fireblocks.com",     employees:"~800",     publicPrivate:"Private (VC-backed)"},

  // ── Gaming / Sports Betting (3) ────────────────────────────────────────
  {company:"DraftKings",              industry:"Gaming", lead_source:"Outbound",   outcome:"Multi-state licensing",    company_url:"draftkings.com",     employees:"~5,000",   publicPrivate:"Public (NASDAQ: DKNG)"},
  {company:"FanDuel",                 industry:"Gaming", lead_source:"Partner",    outcome:"Responsible gaming",       company_url:"fanduel.com",        employees:"~4,500",   publicPrivate:"Private (Flutter subsidiary)"},
  {company:"Penn Entertainment",      industry:"Gaming", lead_source:"Conference", outcome:"Digital transformation",   company_url:"pennentertainment.com", employees:"~24,000", publicPrivate:"Public (NASDAQ: PENN)"},

  // ── Prediction Markets (2) ─────────────────────────────────────────────
  {company:"Kalshi",                  industry:"Prediction Markets", lead_source:"Outbound",   outcome:"Regulatory compliance",  company_url:"kalshi.com",   employees:"~100", publicPrivate:"Private (VC-backed)"},
  {company:"Polymarket",              industry:"Prediction Markets", lead_source:"Conference", outcome:"Market integrity",       company_url:"polymarket.com", employees:"~50",  publicPrivate:"Private (VC-backed)"},

  // ── QSR / Restaurants (3) ──────────────────────────────────────────────
  {company:"McDonald's Corporation",   industry:"QSR / Restaurants", lead_source:"Outbound",   outcome:"Digital ordering",       company_url:"mcdonalds.com",      employees:"~150,000", publicPrivate:"Public (NYSE: MCD)"},
  {company:"Chipotle Mexican Grill",   industry:"QSR / Restaurants", lead_source:"Conference", outcome:"Loyalty program",        company_url:"chipotle.com",       employees:"~115,000", publicPrivate:"Public (NYSE: CMG)"},
  {company:"Sweetgreen",              industry:"QSR / Restaurants", lead_source:"Referral",   outcome:"Tech-enabled operations", company_url:"sweetgreen.com",     employees:"~5,000",   publicPrivate:"Public (NYSE: SG)"},

  // ── BaaS / Sponsor Banking (3) ─────────────────────────────────────────
  {company:"The Bancorp",             industry:"BaaS / Sponsor Banking", lead_source:"Outbound",   outcome:"Partner risk management",  company_url:"thebancorp.com",   employees:"~500",   publicPrivate:"Public (NASDAQ: TBBK)"},
  {company:"Cross River Bank",        industry:"BaaS / Sponsor Banking", lead_source:"Referral",   outcome:"Fintech partnerships",     company_url:"crossriver.com",   employees:"~800",   publicPrivate:"Private"},
  {company:"Synapse Financial",       industry:"BaaS / Sponsor Banking", lead_source:"Partner",    outcome:"Embedded banking",         company_url:"synapsefi.com",    employees:"~200",   publicPrivate:"Private (VC-backed)"},

  // ── HR Tech (3) ────────────────────────────────────────────────────────
  {company:"Workday",                 industry:"HR Tech", lead_source:"Partner",    outcome:"HCM consolidation",        company_url:"workday.com",        employees:"~18,800",  publicPrivate:"Public (NASDAQ: WDAY)"},
  {company:"Gusto",                   industry:"HR Tech", lead_source:"Outbound",   outcome:"SMB payroll growth",       company_url:"gusto.com",          employees:"~2,500",   publicPrivate:"Private (VC-backed)"},
  {company:"Rippling",                industry:"HR Tech", lead_source:"Conference", outcome:"Workforce platform",       company_url:"rippling.com",       employees:"~3,000",   publicPrivate:"Private (VC-backed)"},

  // ── Charitable / Nonprofit (3) ─────────────────────────────────────────
  {company:"United Way Worldwide",     industry:"Nonprofit", lead_source:"Outbound",   outcome:"Donor engagement",       company_url:"unitedway.org",      employees:"~1,200",   publicPrivate:"Nonprofit"},
  {company:"Feeding America",          industry:"Nonprofit", lead_source:"Referral",   outcome:"Operations efficiency",  company_url:"feedingamerica.com", employees:"~500",     publicPrivate:"Nonprofit"},
  {company:"American Red Cross",       industry:"Nonprofit", lead_source:"Conference", outcome:"Disaster response tech", company_url:"redcross.org",       employees:"~18,000",  publicPrivate:"Nonprofit"},

  // ── Digital Incentives (3) ─────────────────────────────────────────────
  {company:"Blackhawk Network",        industry:"Digital Incentives", lead_source:"Outbound",   outcome:"B2B rewards platform",   company_url:"blackhawknetwork.com", employees:"~3,500",  publicPrivate:"Private (Silver Lake)"},
  {company:"Tango Card",              industry:"Digital Incentives", lead_source:"Partner",    outcome:"Employee recognition",   company_url:"tangocard.com",        employees:"~200",    publicPrivate:"Private"},
  {company:"Tremendous",              industry:"Digital Incentives", lead_source:"Referral",   outcome:"Payout automation",      company_url:"tremendous.com",       employees:"~150",    publicPrivate:"Private (VC-backed)"},

  // ── Medical Payments (2) ───────────────────────────────────────────────
  {company:"NationsBenefits",          industry:"Medical Payments", lead_source:"Outbound",   outcome:"Supplemental benefits",  company_url:"nationsbenefits.com",  employees:"~2,000",  publicPrivate:"Private (PE-backed)"},
  {company:"Soda Health",             industry:"Medical Payments", lead_source:"Referral",   outcome:"Flex card platform",     company_url:"sodahealth.com",       employees:"~300",    publicPrivate:"Private (VC-backed)"},

  // ── Rewards / Incentives (2) ───────────────────────────────────────────
  {company:"Wyndham Hotels & Resorts", industry:"Rewards / Incentives", lead_source:"Outbound",  outcome:"Loyalty modernization", company_url:"wyndhamhotels.com",   employees:"~2,000",  publicPrivate:"Public (NYSE: WH)"},
  {company:"IHG Hotels & Resorts",     industry:"Rewards / Incentives", lead_source:"Partner",   outcome:"Points program",        company_url:"ihg.com",             employees:"~11,000", publicPrivate:"Public (NYSE: IHG)"},

  // ── Investor / PE (3) ──────────────────────────────────────────────────
  {company:"Blackstone",              industry:"Private Equity", lead_source:"Referral",   outcome:"Portfolio intelligence",  company_url:"blackstone.com",     employees:"~4,700",   publicPrivate:"Public (NYSE: BX)"},
  {company:"KKR & Co.",               industry:"Private Equity", lead_source:"Conference", outcome:"Deal sourcing",          company_url:"kkr.com",            employees:"~2,400",   publicPrivate:"Public (NYSE: KKR)"},
  {company:"Vista Equity Partners",   industry:"Private Equity", lead_source:"Outbound",   outcome:"Value creation",         company_url:"vistaequitypartners.com", employees:"~600", publicPrivate:"Private"},

  // ── SMB / Mid-Market (3) ───────────────────────────────────────────────
  {company:"Acme Widgets LLC",         industry:"SMB Manufacturing", lead_source:"Outbound",   outcome:"Operational efficiency",  company_url:"acmewidgets.com",  employees:"~75",     publicPrivate:"Private (Bootstrapped)"},
  {company:"Brightpath Consulting",    industry:"SMB Professional Services", lead_source:"Referral", outcome:"Growth strategy",   company_url:"brightpathconsulting.com", employees:"~30", publicPrivate:"Private (Bootstrapped)"},
  {company:"GreenLeaf Solar",          industry:"SMB Energy", lead_source:"Partner",    outcome:"Installation scaling",    company_url:"greenleafsolar.com", employees:"~120",    publicPrivate:"Private"},

  // ── Payments (2) ───────────────────────────────────────────────────────
  {company:"Stripe",                   industry:"Payments", lead_source:"Outbound",   outcome:"Platform payments",       company_url:"stripe.com",         employees:"~8,000",   publicPrivate:"Private (VC-backed)"},
  {company:"Block (Square)",           industry:"Payments", lead_source:"Partner",    outcome:"SMB payments growth",     company_url:"block.xyz",          employees:"~12,000",  publicPrivate:"Public (NYSE: XYZ)"},

  // ── Compliance / RegTech (2) ───────────────────────────────────────────
  {company:"Chainalysis",             industry:"Compliance / RegTech", lead_source:"Conference", outcome:"AML compliance",    company_url:"chainalysis.com",    employees:"~900",    publicPrivate:"Private (VC-backed)"},
  {company:"Alloy",                   industry:"Compliance / RegTech", lead_source:"Referral",   outcome:"Identity verification", company_url:"alloy.com",       employees:"~500",    publicPrivate:"Private (VC-backed)"},
];
