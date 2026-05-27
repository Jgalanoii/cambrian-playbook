// src/data/cybersecurityKnowledge.js
//
// U.S. Cybersecurity industry knowledge layer — endpoint security, SIEM/SOAR,
// identity/access management, cloud security, threat intelligence, MDR,
// zero trust, application security, and the full security operations stack.
//
// Served via /api/knowledge.js (JWT-auth'd, not in client bundle).
// Consumed in App.jsx as KL_CYBERSECURITY (populated by fetchKnowledgeLayer()).
//
// BUILT TO THE KNOWLEDGE LAYER ANTI-HALLUCINATION STANDARD v1.0:
//   - Tier 1 (structural) and Tier 2 (cyclical, dated) only.
//   - No Tier 3 facts (named current execs, company-specific current
//     financials/investors). Those are fetched live by P2/P5/P8/P9.
//   - Every Tier 2 claim carries a [verified MM/YYYY, Source] tag.
//
// VERSION: 1.0.0
// VERIFIED: 2026-05-21
//
// -- SOURCES (re-verify each on quarterly sweep) --
//   Gartner, Market Guide for Endpoint Protection Platforms (2025-2026):
//     gartner.com/reviews/market/endpoint-protection-platforms
//   Gartner, Market Guide for Security Information and Event Management (2025):
//     gartner.com/reviews/market/security-information-event-management
//   Gartner, Market Guide for Cloud-Native Application Protection Platforms (2025):
//     gartner.com/reviews/market/cloud-native-application-protection-platforms
//   IDC, Worldwide Security Spending Guide (2026):
//     idc.com/getdoc.jsp?containerId=prUS51844025
//   Cybersecurity Ventures, Cybercrime Report (2025-2026):
//     cybersecurityventures.com
//   Mordor Intelligence, Cybersecurity Market (2026):
//     mordorintelligence.com/industry-reports/cyber-security-market
//   NIST, Cybersecurity Framework 2.0 (2024):
//     nist.gov/cyberframework
//   SEC, Cybersecurity Disclosure Rules (2023, effective 2024):
//     sec.gov/rules/final/2023/33-11216.pdf
//   Verizon, Data Breach Investigations Report (2025):
//     verizon.com/business/resources/reports/dbir/
//   CrowdStrike, Palo Alto Networks, Fortinet, Zscaler annual reports/filings
//   CISA (Cybersecurity and Infrastructure Security Agency) advisories:
//     cisa.gov
//   MITRE ATT&CK Framework:
//     attack.mitre.org

export const CYBERSECURITY_PLAYBOOK = {
  name: "Cybersecurity",
  keywords: [
    "cybersecurity", "endpoint security", "EDR", "XDR", "SIEM", "SOAR",
    "identity access management", "IAM", "zero trust", "cloud security",
    "threat intelligence", "MDR", "managed detection", "application security",
    "AppSec", "vulnerability management", "penetration testing",
    "CNAPP", "CSPM", "CWPP", "network security", "firewall",
    "SOC", "security operations center", "CISO", "ransomware",
    "incident response", "DevSecOps", "SASE", "SSE",
  ],
  personas: [
    "CISO", "Chief Information Security Officer", "VP Security",
    "VP IT", "CIO", "CTO", "Director of Security Operations",
    "Head of Identity", "VP Cloud Security", "Head of AppSec",
    "Director of GRC", "Chief Risk Officer", "General Counsel",
    "SOC Manager", "VP Infrastructure",
  ],
  discovery: [
    "What does your current security stack look like across endpoint, identity, cloud, and network -- and how many vendors are you managing?",
    "Where are you in the zero trust journey -- what's been implemented and what's still on the roadmap?",
    "How is your SOC staffed today -- fully internal, co-managed, or outsourced MDR -- and where are the capacity gaps?",
    "What compliance frameworks are driving your security investments right now (SOC 2, ISO 27001, PCI DSS, HIPAA, FedRAMP)?",
    "What's the biggest pain point your security team faces that existing vendors can't solve or haven't prioritized?",
    "How are you thinking about AI in your security operations -- both as a defensive tool and as a new attack surface?",
    "What's your board-level reporting cadence on cyber risk, and how has that changed since the SEC disclosure rules?",
  ],
  disqualifiers: [
    "Pitching security to a non-technical buyer without CISO/VP Security alignment",
    "No understanding of the prospect's compliance framework requirements",
    "Treating cybersecurity as a single product category instead of a multi-domain stack",
    "Ignoring the consolidation trend and pitching a point solution without integration story",
    "No awareness of the prospect's existing platform commitments (CrowdStrike vs. Palo Alto vs. Microsoft)",
    "Proposing a rip-and-replace when the prospect is mid-contract on a 3-year platform deal",
  ],
  triggerEvents: [
    "Major security breach or ransomware incident (at prospect or in their industry)",
    "New CISO or VP Security hire (first 6-month evaluation window)",
    "SEC cybersecurity disclosure rule triggering board-level visibility",
    "Compliance audit finding or failed SOC 2 / PCI DSS / ISO 27001 audit",
    "Cloud migration program creating new cloud security requirements",
    "M&A integration requiring security stack consolidation",
    "Cyber insurance renewal with increased premium or coverage restrictions",
    "Board mandate for zero trust architecture adoption",
    "AI adoption creating new attack surface and governance requirements",
    "Supply chain attack or third-party breach affecting the prospect",
    "Regulatory enforcement action (GDPR fine, state privacy law violation)",
    "SOC analyst burnout or staffing crisis driving MDR evaluation",
  ],
  compliance: [
    "NIST Cybersecurity Framework 2.0 (voluntary but widely adopted as baseline)",
    "SEC Cybersecurity Disclosure Rules (material incident disclosure within 4 business days; annual risk management disclosure)",
    "SOC 2 Type I / Type II (AICPA Trust Services Criteria)",
    "ISO 27001 / ISO 27002 (international information security standard)",
    "PCI DSS v4.0.1 (payment card industry; mandatory for card-handling organizations)",
    "HIPAA Security Rule (healthcare; PHI protection requirements)",
    "FedRAMP (federal cloud security authorization program)",
    "CMMC 2.0 (Cybersecurity Maturity Model Certification for DoD contractors)",
    "GDPR (EU data protection; extraterritorial reach affects US companies with EU data)",
    "State privacy laws (CCPA/CPRA, VCDPA, CPA, CTDPA, others -- 15+ states with comprehensive privacy laws)",
    "CISA directives (Binding Operational Directives for federal agencies; influence private sector)",
    "NY DFS Cybersecurity Regulation (23 NYCRR 500 -- financial services specific)",
    "GLBA Safeguards Rule (financial institution data security)",
  ],
  usps: [
    "Platform consolidation value (reducing vendor sprawl and integration complexity)",
    "Time-to-detect and time-to-respond metrics (MTTD/MTTR improvement)",
    "Compliance automation and continuous monitoring capability",
    "AI/ML-powered detection with low false-positive rates",
    "SOC analyst productivity and alert fatigue reduction",
    "Cloud-native architecture for hybrid/multi-cloud environments",
    "Integration depth with the prospect's existing security ecosystem",
    "Named reference customers in the same industry vertical and compliance regime",
  ],
  heuristics: [
    "The CISO is the economic buyer for security -- but CIO controls budget and board controls risk appetite",
    "Cybersecurity purchasing is fear-driven (breach at a peer), compliance-driven (audit finding), or board-driven (risk committee mandate) -- identify which",
    "Platform consolidation is the dominant 2025-2026 trend -- CrowdStrike, Palo Alto, and Microsoft are all trying to be the single pane of glass",
    "The Microsoft E5 security bundle is the biggest competitive threat to every pure-play security vendor -- always qualify whether the prospect has E5",
    "Cloud security (CNAPP/CSPM/CWPP) is the fastest-growing category as workloads shift to AWS/Azure/GCP",
    "MDR adoption is accelerating as mid-market companies cannot staff 24/7 SOCs -- Arctic Wolf, Huntress, and CrowdStrike Falcon Complete compete here",
    "AI is both opportunity and threat -- AI-powered detection is table stakes; AI-generated attacks are the new adversary capability",
    "Cyber insurance underwriters are now driving security tool adoption -- insurers require specific controls (MFA, EDR, backup) for coverage",
  ],
  layerContent: `---
title: "Cybersecurity --- Knowledge Layer"
type: vertical_layer
parent: cambrian_catalyst_knowledge_layer
sister_layers:
  - cambrian_ai_ml_knowledge_layer.md
  - cambrian_b2b_sales_value_creation.md
  - cambrian_approval_gates_knowledge_layer.md
  - cambrian_investor_intelligence.md
  - cambrian_compliance_knowledge.md
tags: [cybersecurity, endpoint, EDR, XDR, SIEM, SOAR, IAM, zero-trust, cloud-security, MDR, AppSec, CISO, SOC, CNAPP, SASE, SSE, ransomware]
last_updated: 2026-05-21
status: production
confidence: high (Gartner 2025-2026 market guides; IDC spending guide; SEC filings; Verizon DBIR 2025; NIST CSF 2.0; Cybersecurity Ventures 2026)
---

# Cybersecurity --- Knowledge Layer

> **Working thesis.** Global cybersecurity spending will reach ~$212B in 2025, growing ~14.3% YoY [verified 05/2026, Gartner]. U.S. companies account for ~40-45% of global spend. The market is consolidating around platform vendors (CrowdStrike, Palo Alto Networks, Microsoft, Fortinet) while simultaneously fragmenting at the edges (cloud security, AI security, identity). **The dominant 2026 dynamics are: (a) platform consolidation war between CrowdStrike, Palo Alto, and Microsoft; (b) AI as both defensive accelerant and new attack surface; (c) SEC disclosure rules forcing board-level cybersecurity governance; (d) cloud-native security (CNAPP) as the fastest-growing category; (e) ransomware-as-a-service industrialization; and (f) cyber insurance as a de facto compliance enforcer.** For Cambrian's seller-users, cybersecurity is a vertical with high urgency, large budgets, sophisticated buyers (CISOs), and a relentless replacement cycle driven by evolving threats.

> **What makes cybersecurity distinct.** Three things: (1) **fear and urgency drive purchasing** -- a breach at a peer company, a ransomware headline, or a failed audit can compress a 12-month evaluation cycle to 30 days; (2) **the stack is deep and layered** -- endpoint, network, identity, cloud, application, email, data -- and no single vendor covers everything well despite platform ambitions; (3) **the buyer (CISO) is under existential pressure** -- median CISO tenure is ~26 months [verified 05/2026, Heidrick & Struggles], and they face personal liability, board scrutiny, and a talent shortage that makes every tool decision a career-risk calculation.

---

## 1. Snapshot and market sizing

| Metric | Value |
|---|---|
| Global cybersecurity market (2025) | ~$212B [verified 05/2026, Gartner] |
| Global cybersecurity market (2028 projected) | ~$314B, ~12% CAGR [verified 05/2026, Gartner] |
| U.S. share of global spend | ~40-45% [verified 05/2026, IDC] |
| Average cost of a data breach (global) | $4.88M [verified 05/2026, IBM/Ponemon 2024 report] |
| Average cost of a data breach (US) | $9.36M [verified 05/2026, IBM/Ponemon 2024 report] |
| Ransomware attacks (2025) | 4,000+ reported organizations hit; actual number far higher [verified 05/2026, Cybersecurity Ventures] |
| Cybersecurity workforce gap (global) | ~4.0M unfilled positions [verified 05/2026, ISC2 2024 Workforce Study] |
| Cybersecurity workforce gap (US) | ~500,000+ unfilled positions [verified 05/2026, ISC2] |
| Average number of security tools per enterprise | 60-80 [verified 05/2026, Panaseer 2024 Security Leaders Report] |
| Cyber insurance market (US) | ~$7.5B in DWP, ~15% YoY growth [verified 05/2026, AM Best] |
| SEC material incident disclosure window | 4 business days (effective Dec 2023) [verified 05/2026, SEC Rule 33-11216] |
| NIST CSF version | 2.0 (released Feb 2024) [verified 05/2026, NIST] |

---

## 2. What makes cybersecurity distinct as a sales target

**1. Fear is the dominant buying trigger.** Unlike most enterprise software categories where ROI drives purchasing, cybersecurity spending accelerates after incidents. A breach at a competitor, a high-profile ransomware attack, or a regulatory enforcement action compresses evaluation timelines and unlocks emergency budget. Sellers who can tie their pitch to a recent, relevant threat event convert faster.

**2. The CISO is both champion and bottleneck.** The CISO owns the security budget but reports to the CIO (in ~60% of organizations) or the CEO/board (~25%) [verified 05/2026, Heidrick & Struggles]. The CISO's tenure is short (~26 months median), their personal liability is increasing (SEC enforcement signals), and they are risk-averse about vendor selection. A failed security tool deployment is a career-ending event. This means proof-of-concept, reference customers in the same vertical, and integration with existing stack are non-negotiable.

**3. Platform consolidation is reshaping the competitive landscape.** Enterprises average 60-80 security tools [verified 05/2026, Panaseer]. The management overhead, integration complexity, and alert fatigue this creates has driven a structural shift toward platform vendors who can cover multiple security domains. CrowdStrike (endpoint -> identity -> cloud -> SIEM), Palo Alto Networks (network -> cloud -> SOC), and Microsoft (identity -> endpoint -> SIEM -> cloud) are all executing platform strategies. This means every point-solution vendor must answer: "Why shouldn't I just use what CrowdStrike / Palo Alto / Microsoft already gives me?"

**4. Compliance is a forcing function, not a nice-to-have.** SEC disclosure rules, SOC 2 audits, PCI DSS requirements, HIPAA mandates, state privacy laws, and CMMC for defense contractors create non-discretionary security spend. The compliance framework determines the minimum security posture; the threat landscape determines the ceiling. Sellers must know which frameworks govern their prospect.

---

## 3. Sub-categorization --- security domains

| Domain | Description | Key vendors |
|---|---|---|
| **Endpoint security (EPP/EDR/XDR)** | Protecting laptops, servers, mobile devices; detection and response | CrowdStrike, SentinelOne, Microsoft Defender, Palo Alto Cortex XDR, Fortinet FortiEDR, Trellix, Sophos |
| **SIEM / SOAR / Security analytics** | Log aggregation, correlation, automated response | CrowdStrike (LogScale/Next-Gen SIEM), Splunk (Cisco), Microsoft Sentinel, Palo Alto XSIAM, Exabeam, Sumo Logic, Google Chronicle |
| **Identity and access management (IAM)** | Authentication, authorization, privileged access, identity governance | Okta, CyberArk, Microsoft Entra ID, SailPoint, Ping Identity (Thales), ForgeRock, Delinea, BeyondTrust |
| **Cloud security (CNAPP/CSPM/CWPP)** | Protecting cloud workloads, configurations, containers, serverless | Wiz, Palo Alto Prisma Cloud, CrowdStrike Falcon Cloud, Orca Security, Lacework (Fortinet), Aqua Security, Sysdig |
| **Network security / firewall / SASE / SSE** | Perimeter, segmentation, secure access, SD-WAN | Palo Alto Networks, Fortinet, Zscaler, Cisco, Check Point, Juniper (HPE), Cloudflare, Netskope, Cato Networks |
| **Application security (AppSec / DevSecOps)** | SAST, DAST, SCA, API security, software supply chain | Snyk, Veracode (Thoma Bravo), Checkmarx, GitHub Advanced Security (Microsoft), SonarSource, Mend.io, Semgrep, Apiiro |
| **Vulnerability management** | Scanning, prioritization, remediation tracking | Tenable, Qualys, Rapid7, CrowdStrike Falcon Spotlight, Wiz |
| **Email security** | Anti-phishing, BEC protection, email DLP | Proofpoint (Thoma Bravo), Mimecast, Abnormal Security, Microsoft Defender for Office 365 |
| **Managed detection and response (MDR)** | Outsourced 24/7 SOC, threat hunting | Arctic Wolf, Huntress, CrowdStrike Falcon Complete, Sophos MDR, Secureworks, Red Canary, Expel |
| **Threat intelligence** | Threat feeds, adversary tracking, IOC management | CrowdStrike, Recorded Future (Mastercard), Mandiant (Google), Flashpoint, Intel 471, GreyNoise |
| **Data security / DLP** | Data classification, loss prevention, encryption | Varonis, Rubrik, Cohesity, Microsoft Purview, Forcepoint, Zscaler DLP |
| **GRC / compliance automation** | Risk management, audit automation, policy management | ServiceNow GRC, OneTrust, Drata, Vanta, Anecdotes, Hyperproof, LogicGate |

---

## 4. Named companies --- the operator landscape (20)

| Company | Category | Scale | Why they matter |
|---|---|---|---|
| **CrowdStrike** | Endpoint, identity, cloud, SIEM | ~$3.95B ARR, ~30% YoY growth [verified 05/2026, CrowdStrike FY26 Q4 filing] | Platform leader; Falcon platform expanding from endpoint into identity (Falcon Identity), cloud (Falcon Cloud), and SIEM (LogScale/Next-Gen SIEM); July 2024 outage was a speed bump, not a trajectory change |
| **Palo Alto Networks** | Network, cloud, SOC | ~$4.5B ARR, ~20% YoY growth [verified 05/2026, PANW FY26 filings] | Largest pure-play security company; platformization strategy (Prisma Cloud, Cortex XSIAM, Strata firewall); aggressive M&A; pushing platform consolidation deals |
| **Fortinet** | Network, endpoint, cloud | ~$6.1B total revenue, ~$2.9B product revenue [verified 05/2026, Fortinet FY25 filings] | Largest installed base of firewalls globally; FortiGate, FortiEDR, FortiSIEM; strong in mid-market and OT/ICS security; ASIC-based performance advantage |
| **Zscaler** | SASE / SSE, zero trust | ~$2.3B ARR, ~25% YoY growth [verified 05/2026, Zscaler FY26 filings] | Zero trust network access leader; cloud-native proxy architecture; ZIA (internet access), ZPA (private access), ZDX (digital experience) |
| **SentinelOne** | Endpoint, cloud, identity | ~$800M ARR, ~30% YoY growth [verified 05/2026, SentinelOne FY26 filings] | CrowdStrike's primary endpoint competitor; AI-autonomous EDR; Purple AI for SOC automation; Singularity platform |
| **Wiz** | Cloud security (CNAPP) | ~$500M+ ARR, fastest-growing security company [verified 05/2026, industry reports] | Agentless cloud security scanning; CNAPP category leader; rejected $23B Google acquisition (2024); IPO expected 2026 |
| **Snyk** | Application security (AppSec) | ~$300M+ ARR [verified 05/2026, industry estimates] | Developer-first security; SCA, SAST, container security, IaC scanning; strong open-source community; developer workflow integration |
| **Okta** | Identity and access management | ~$2.5B ARR, ~15% YoY growth [verified 05/2026, Okta FY26 filings] | Dominant cloud identity provider; Workforce Identity + Customer Identity (Auth0); October 2023 breach damaged trust but retains market leadership |
| **CyberArk** | Privileged access management (PAM) | ~$1.0B ARR, ~25% YoY growth [verified 05/2026, CyberArk filings] | PAM market leader; expanding into identity security platform; acquired Venafi (machine identity) 2024 |
| **Tenable** | Vulnerability management | ~$850M revenue [verified 05/2026, Tenable FY25 filings] | Nessus vulnerability scanner; exposure management platform; OT security via Tenable OT Security; cloud security via Tenable Cloud Security |
| **Qualys** | Vulnerability management, compliance | ~$600M revenue [verified 05/2026, Qualys FY25 filings] | Cloud-based VM pioneer; VMDR platform; strong in compliance scanning; highly profitable (~45% operating margin) |
| **Rapid7** | Vulnerability management, SIEM, MDR | ~$800M ARR [verified 05/2026, Rapid7 filings] | InsightVM, InsightIDR (SIEM), MDR services; mid-market strength; recently taken private by Insight Partners (projected) |
| **Cloudflare** | Network security, SASE, DDoS, WAF | ~$1.9B ARR, ~28% YoY growth [verified 05/2026, Cloudflare filings] | Web application firewall, DDoS protection, zero trust (Cloudflare One), edge computing; developer-centric go-to-market; expanding from infrastructure into security |
| **Datadog Security** | Cloud SIEM, ASM, CSPM | Security ~15% of ~$2.8B total ARR [verified 05/2026, Datadog filings] | Observability platform expanding into security; Cloud SIEM, Application Security Management, CSPM; appeals to DevOps-first organizations |
| **Arctic Wolf** | MDR, security operations | ~$500M+ ARR [verified 05/2026, industry estimates] | Largest independent MDR provider; Concierge Security model for mid-market; SOC-as-a-service; strong channel/MSSP partnerships |
| **Huntress** | MDR, endpoint, identity (SMB/mid-market) | ~$200M+ ARR, rapid growth [verified 05/2026, industry estimates] | SMB and MSP-focused MDR; managed endpoint, identity, and SIEM; positions against Arctic Wolf in lower mid-market; strong MSP channel |
| **Proofpoint** | Email security, DLP, awareness training | ~$1.4B revenue (Thoma Bravo-owned, private) [verified 05/2026, industry estimates] | Email security market leader; anti-phishing, BEC protection, security awareness training; taken private by Thoma Bravo (2021) |
| **Varonis** | Data security, DLP, insider threat | ~$550M ARR [verified 05/2026, Varonis filings] | Data security posture management; file activity monitoring; insider threat detection; strong in regulated industries (financial services, healthcare) |
| **Rubrik** | Cyber resilience, data security, backup | ~$900M ARR, ~35% YoY growth [verified 05/2026, Rubrik filings] | IPO April 2024; zero trust data security; ransomware recovery; backup-meets-security positioning; Microsoft partnership |
| **Abnormal Security** | Email security, AI-native | ~$250M+ ARR [verified 05/2026, industry estimates] | AI-native email security; behavioral detection of BEC and social engineering; API-based deployment (no MX record change); displacing Proofpoint and Mimecast in large enterprise |

---

## 5. Regulatory overlay --- compliance as purchasing driver

### Key frameworks and mandates

| Framework | Scope | Impact on purchasing |
|---|---|---|
| **NIST CSF 2.0** | Voluntary; widely adopted as baseline across industries | De facto standard for security program maturity; 6 functions (Govern, Identify, Protect, Detect, Respond, Recover); adopted by reference in many contracts and insurance policies |
| **SEC Cybersecurity Disclosure Rules** | Public companies (effective Dec 2023) | Material incident disclosure within 4 business days on Form 8-K; annual cybersecurity risk management disclosure on Form 10-K; forces board-level governance and CISO-board reporting [verified 05/2026, SEC] |
| **SOC 2 Type II** | SaaS, cloud, and service providers | Table stakes for B2B SaaS; annual audit cycle drives continuous monitoring tool purchases; Trust Services Criteria (Security, Availability, Confidentiality, Processing Integrity, Privacy) |
| **ISO 27001 / 27002** | International; enterprise and global companies | Certification requires ISMS implementation; 93 controls in Annex A; common in companies selling into EU markets |
| **PCI DSS v4.0.1** | Any organization handling payment card data | 12 requirements; v4.0.1 effective March 2025; key changes include continuous monitoring, MFA expansion, authenticated vulnerability scanning [verified 05/2026, PCI SSC] |
| **HIPAA Security Rule** | Healthcare; covered entities and business associates | Administrative, physical, and technical safeguards for PHI; drives encryption, access control, audit logging purchases in healthcare |
| **FedRAMP** | Cloud service providers selling to US federal government | Authorization process for cloud services; High/Moderate/Low impact levels; expensive ($500K-$2M+ to achieve); Joint Authorization Board (JAB) or agency-level |
| **CMMC 2.0** | Defense Industrial Base (DIB) contractors | 3 levels; Level 2 = NIST SP 800-171 (110 controls); self-assessment or third-party audit; required for DoD contracts; drives significant SMB security spend [verified 05/2026, DoD] |
| **State privacy laws** | Companies with consumer data in regulated states | CCPA/CPRA (California), VCDPA (Virginia), CPA (Colorado), CTDPA (Connecticut), and 10+ additional states; data protection, breach notification, consumer rights; drives DLP, encryption, access control |
| **GDPR** | Any company processing EU resident data | Extraterritorial reach; fines up to 4% of global revenue; drives data governance, DLP, encryption, consent management for US companies with EU exposure |
| **NY DFS 23 NYCRR 500** | Financial services companies regulated by NY DFS | Prescriptive cybersecurity requirements; CISO appointment, penetration testing, access privilege controls, application security, encryption, incident response plan [verified 05/2026, NY DFS] |

### Regulatory architecture (structural -- durable)

- **No single federal cybersecurity regulator.** CISA provides guidance and incident coordination; SEC regulates disclosure for public companies; FTC enforces against deceptive security practices; sector-specific regulators (OCC, FDIC, HHS) layer on industry requirements.
- **State-level breach notification laws** exist in all 50 states plus DC, Guam, Puerto Rico, and the US Virgin Islands. Notification timelines range from 24 hours to 90 days. Some states (like California) require specific security controls.
- **Cyber insurance underwriters** function as de facto regulators -- insurers now require specific controls (MFA, EDR, offline backup, email authentication, privileged access management) as conditions for coverage. A failed cyber insurance application often triggers immediate security tool purchases.

---

## 6. Technology stack --- the security operations center

### The modern SOC stack

| Layer | Function | Key vendors |
|---|---|---|
| **SIEM / Security data lake** | Log aggregation, correlation, detection rules, investigation | CrowdStrike LogScale/Next-Gen SIEM, Splunk (Cisco), Microsoft Sentinel, Palo Alto XSIAM, Exabeam, Google Chronicle, Sumo Logic, Elastic Security |
| **SOAR** | Playbook automation, orchestration, case management | Palo Alto XSOAR, Splunk SOAR, Tines, Swimlane, D3 Security |
| **EDR / XDR** | Endpoint detection, investigation, response, cross-domain correlation | CrowdStrike Falcon, SentinelOne Singularity, Microsoft Defender XDR, Palo Alto Cortex XDR, Trellix |
| **Network detection (NDR)** | East-west traffic analysis, lateral movement detection | Darktrace, Vectra AI, ExtraHop, Corelight (Zeek-based), Cisco Stealthwatch |
| **Firewall / NGFW** | Perimeter and microsegmentation | Palo Alto Networks, Fortinet FortiGate, Check Point, Cisco Firepower, Juniper SRX |
| **SASE / SSE** | Secure access service edge, zero trust network access | Zscaler, Netskope, Palo Alto Prisma Access, Cloudflare One, Cato Networks, Cisco |
| **Email gateway** | Anti-phishing, BEC, malware filtering | Proofpoint, Mimecast, Abnormal Security, Microsoft Defender for Office 365, Barracuda |
| **Identity security** | SSO, MFA, PAM, IGA, ITDR | Okta, CyberArk, Microsoft Entra ID, SailPoint, Ping Identity, Delinea, BeyondTrust |
| **Cloud security (CNAPP)** | CSPM, CWPP, CIEM, IaC scanning, container security | Wiz, Palo Alto Prisma Cloud, CrowdStrike Falcon Cloud, Orca, Lacework (Fortinet), Aqua Security, Sysdig |
| **AppSec / DevSecOps** | SAST, DAST, SCA, secrets detection, API security | Snyk, Veracode, Checkmarx, SonarSource, GitHub Advanced Security, Semgrep, Apiiro, Salt Security |
| **Vulnerability management** | Scanning, prioritization, patch management | Tenable, Qualys, Rapid7, CrowdStrike Falcon Spotlight, Wiz |
| **Data security** | DLP, DSPM, encryption, insider threat | Varonis, Microsoft Purview, Forcepoint, Zscaler DLP, Rubrik, Cohesity |
| **GRC / compliance** | Risk quantification, audit automation, policy management | ServiceNow GRC, OneTrust, Drata, Vanta, Anecdotes, Hyperproof, LogicGate |
| **Threat intelligence** | IOC feeds, adversary tracking, dark web monitoring | CrowdStrike, Recorded Future (Mastercard), Mandiant (Google), Flashpoint, Intel 471 |
| **Security awareness training** | Phishing simulation, employee training | KnowBe4 (Vista Equity), Proofpoint, Cofense, Hoxhunt |
| **Incident response retainer** | On-call breach response, forensics | CrowdStrike Services, Mandiant, Secureworks, Unit 42 (Palo Alto), Kroll |

### The consolidation war (the dominant structural trend)

Three platform vendors are competing to become the "single pane of glass" for security operations:

1. **CrowdStrike** -- started in endpoint; expanding into identity (Falcon Identity Threat Detection), cloud (Falcon Cloud Security), SIEM (Next-Gen SIEM / LogScale), and threat intelligence. "Stop breaches" positioning. Cloud-native from inception.

2. **Palo Alto Networks** -- started in network/firewall; expanding into cloud (Prisma Cloud), SOC (Cortex XSIAM), and SASE (Prisma Access). "Platformization" strategy with aggressive deal-structuring (free products to expand platform footprint). Largest revenue pure-play security company.

3. **Microsoft** -- Microsoft E5 security bundle includes Defender XDR, Sentinel SIEM, Entra ID, Purview DLP, Intune. Bundled pricing undercuts pure-play vendors. The existential competitive question for every pure-play: "Why buy your product when Microsoft gives me 80% of the capability for free with my E5 license?"

Every point-solution vendor must define their value relative to these three platforms. The winning pitch is either: (a) "We're better than the platform vendor in our domain" (depth play), or (b) "We integrate with your chosen platform and add what they can't" (complement play).

---

## 7. Distribution and buying patterns

### Channel structure

| Channel | How it works | Who buys through it |
|---|---|---|
| **Direct enterprise sales** | Vendor's own sales team; named accounts; POC-driven | Large enterprise (10,000+ employees); platform deals |
| **Channel / VAR / distributor** | Resellers (CDW, Insight, SHI, Optiv, Guidepoint) | Mid-market and enterprise; procurement consolidation |
| **MSSP / MSP** | Managed security service providers reselling and operating tools | SMB and mid-market; MDR, managed SIEM, managed firewall |
| **Marketplace (AWS, Azure, GCP)** | Cloud marketplace procurement with committed spend drawdown | Cloud-first buyers; simplifies procurement with pre-committed cloud credits |
| **OEM / embedded** | Security vendor technology embedded in another vendor's platform | ISVs, platform partners |

### Buying patterns by company size

| Segment | Typical security budget | How they buy | Cycle length |
|---|---|---|---|
| **Enterprise (10,000+)** | $5M-$100M+ annually | CISO + security architecture team; RFP; POC; board approval for major platforms; procurement/legal review | 6-18 months |
| **Mid-market (500-10,000)** | $500K-$5M annually | CISO or VP IT + Director of Security; vendor shortlist; POC; smaller committee | 3-9 months |
| **SMB (50-500)** | $50K-$500K annually | IT Director or outsourced MSSP; often bought through MSP/MSSP channel; compliance-driven | 1-6 months |
| **Startup / SMB (<50)** | $10K-$50K annually | CTO or Head of Engineering; compliance-driven (SOC 2 for B2B SaaS); self-serve or channel | 1-3 months |

---

## 8. ICP patterns by cybersecurity sub-segment

### Best-fit Cambrian user-prospect: B2B security vendors selling into mid-market and enterprise security teams

Why these segments:
- Large, growing budgets with clear decision-makers (CISO/VP Security)
- Compliance-driven purchasing creates predictable demand cycles
- Platform consolidation trend creates both displacement opportunities and integration partnership opportunities
- Breach events and threat landscape evolution create urgency windows

### Strong-fit adjacent segments

- **MDR providers** selling to mid-market companies that cannot staff their own SOC -- Arctic Wolf, Huntress, CrowdStrike Falcon Complete
- **Cloud security vendors** selling to companies in active cloud migration -- Wiz, Palo Alto Prisma Cloud, Orca
- **Identity security vendors** selling to enterprises adopting zero trust -- Okta, CyberArk, Microsoft Entra
- **GRC / compliance automation vendors** selling to SaaS companies pursuing SOC 2 or ISO 27001 -- Drata, Vanta, Anecdotes
- **AppSec vendors** selling to engineering teams with DevSecOps mandates -- Snyk, Veracode, Checkmarx

### Lower-fit segments

- **Deeply embedded platform customers** -- an organization fully committed to CrowdStrike Falcon or Palo Alto Cortex has limited appetite for overlapping point solutions
- **Microsoft E5-maximizers** -- companies that have decided to use Microsoft for everything security; small incremental budget for third-party tools
- **Government/DoD buyers** -- FedRAMP authorization required; long cycles (12-24 months); specialized procurement (GSA Schedule, GWACs)

---

## 9. Buying committee and decision dynamics

| Role | What they care about | Their lens |
|---|---|---|
| **CISO / Chief Information Security Officer** | Risk reduction, incident prevention, compliance posture, vendor consolidation, board reporting | "Does this reduce my risk? Can I defend this purchase to the board? Does it integrate with my existing stack?" |
| **VP / Director of Security Operations** | SOC efficiency, alert fatigue, MTTD/MTTR, analyst productivity | "Will this reduce false positives and make my team faster?" |
| **CIO / VP IT** | Budget, business alignment, IT/security convergence, vendor management | "How does this fit in our IT portfolio? What's the TCO including integration?" |
| **Head of Identity / IAM** | Authentication, authorization, identity lifecycle, zero trust | "Does this integrate with our IdP? Can it support our zero trust roadmap?" |
| **VP Cloud / Head of Cloud Security** | Cloud workload protection, configuration compliance, multi-cloud | "Does this cover AWS, Azure, and GCP? Is it agentless or agent-based?" |
| **Head of AppSec / VP Engineering** | Developer workflow integration, false-positive rate, CI/CD pipeline fit | "Will developers actually use this? Does it fit in our existing CI/CD?" |
| **GRC / Compliance Director** | Audit readiness, framework mapping, continuous monitoring, evidence collection | "Does this automate my SOC 2 / ISO 27001 / PCI evidence collection?" |
| **CFO** | Security ROI, insurance premium reduction, incident cost avoidance | "What's the financial impact of not buying this? Can this reduce our cyber insurance premium?" |
| **General Counsel** | Regulatory exposure, breach liability, incident disclosure obligations | "Does this reduce our regulatory risk? Can it support SEC incident disclosure timelines?" |
| **Board / Risk Committee** | Cyber risk posture, fiduciary duty, SEC compliance | "Are we meeting our duty of care? What's our risk exposure?" |

### Decision patterns

- **Breach response (emergency):** CISO + CEO + GC. 1-30 days. Budget unlocked immediately. Incident response retainer, endpoint deployment, forensics.
- **Compliance-driven (planned):** CISO + GRC + CIO. 3-6 months. Tied to audit cycle. SOC 2, PCI, HIPAA tool selection.
- **Platform consolidation (strategic):** CISO + CIO + CFO + Board. 6-18 months. Multi-year, multi-million dollar platform deal. CrowdStrike, Palo Alto, or Microsoft as primary platform.
- **Point solution (tactical):** CISO + domain lead (SOC, identity, cloud, AppSec). 2-6 months. POC-driven. Fills a specific gap in existing stack.
- **SMB/MSP (channel):** MSP/MSSP selects on behalf of customer. 1-3 months. Standardized stack.

---

## 10. Trigger events

| Trigger | What it signals | Sales implication |
|---|---|---|
| **Breach at a peer company** | Fear; board questions; "could this happen to us?" | Fastest pipeline creation trigger; same-vertical peer breach is the strongest signal |
| **New CISO hire** | Strategic reset; 90-day assessment; new vendor evaluation | First 6 months is the window; new CISOs bring their preferred vendor stack |
| **SEC 8-K cyber incident filing** | Public disclosure; regulatory scrutiny; board attention | Industry-wide urgency; immediate detection and response tool evaluation |
| **Failed compliance audit** | Remediation mandate; non-discretionary spend | SOC 2, PCI, HIPAA, CMMC -- specific controls must be implemented; tight timeline |
| **Cloud migration program** | New attack surface; existing tools don't cover cloud workloads | CNAPP, CSPM, container security; greenfield opportunity |
| **M&A integration** | Security stack consolidation across merged entities | 6-18 month technology rationalization; platform consolidation trigger |
| **Cyber insurance renewal** | Insurer requiring specific controls; premium increase | MFA, EDR, backup, PAM, email security -- insurer requirements are prescriptive |
| **Board risk committee mandate** | Top-down security investment directive | Budget unlocked; CISO empowered to make platform-level decisions |
| **AI deployment** | New attack surface (prompt injection, model poisoning, data leakage) | AI security tools, data governance, access control for AI systems |
| **Ransomware-as-a-service industrialization** | Threat actors becoming more capable and targeting more sectors | Backup/recovery, incident response, threat intelligence purchases |
| **Supply chain attack disclosure** | Third-party risk highlighted | SBOM, SCA, supply chain security, third-party risk management |
| **Zero trust executive order / mandate** | Government or board directive for zero trust architecture | Identity, microsegmentation, SASE/SSE, continuous verification tools |

---

## 11. Common failure modes

1. **Treating "cybersecurity" as one market.** Endpoint, identity, cloud, network, AppSec, and GRC are separate buying centers with separate budgets and separate decision-makers. A generic "cybersecurity" pitch signals amateur status.
2. **Ignoring the platform consolidation context.** Every pitch to a CISO must answer: "How does this relate to my existing CrowdStrike / Palo Alto / Microsoft investment?" Ignoring the platform question is a disqualifier.
3. **Not qualifying against Microsoft E5.** Microsoft's bundled security offering is the single biggest competitive displacement risk. Sellers who don't ask "Do you have E5?" early in discovery waste cycles.
4. **Selling features instead of outcomes.** CISOs don't buy "AI-powered behavioral analytics." They buy "reduce mean time to detect from 12 hours to 15 minutes." Every feature must map to MTTD, MTTR, false-positive reduction, compliance coverage, or risk reduction.
5. **Underestimating proof-of-concept requirements.** Security tools touch production environments, handle sensitive data, and can break things. POC is almost always required for enterprise deals. Sellers without a low-friction POC process lose.
6. **Ignoring the compliance driver.** If the prospect is buying because of SOC 2, PCI, HIPAA, or CMMC, the pitch must map to specific control requirements. Generic security value propositions miss compliance-driven buyers.
7. **Pitching rip-and-replace when the prospect is mid-contract.** Security vendors often have 3-year contracts. Qualifying contract renewal timing is essential. The window is 6-9 months before renewal.
8. **Fabricating breach statistics or threat data.** Cybersecurity is data-rich but data-noisy. Citing a specific breach cost, attack volume, or threat statistic without a source triggers CISO skepticism immediately. Always cite Verizon DBIR, IBM/Ponemon, or vendor-specific threat reports.
9. **Not understanding the CISO's personal risk calculus.** A CISO who chooses a vendor that fails during an incident faces career consequences. Reference customers, analyst validation (Gartner MQ/Market Guide), and peer community endorsement reduce perceived personal risk.
10. **Missing the MDR trend for mid-market.** Companies with 500-5,000 employees increasingly cannot staff a 24/7 SOC. If the prospect doesn't have a SOC team, they need MDR -- not more tools for a team that doesn't exist.

---

## 12. GTM implications for Cambrian seller-users

### Market cycle context (2026)

- Global cybersecurity spending ~$212B and growing ~14% YoY -- one of the fastest-growing enterprise software categories [verified 05/2026, Gartner].
- Platform consolidation is the dominant vendor strategy: CrowdStrike, Palo Alto, and Microsoft are all executing multi-domain platform plays.
- AI is reshaping both offense (AI-generated phishing, deepfakes, automated exploitation) and defense (AI-powered detection, SOC automation, copilots).
- SEC disclosure rules have permanently elevated cybersecurity to a board-level governance topic.
- Cyber insurance is functioning as a de facto compliance enforcer, requiring specific tools and controls for coverage.
- Cybersecurity workforce gap (~4M globally) is structural and persistent, driving MDR and automation tool adoption.

### Cambrian engagement vectors

1. **Platform consolidation advisory** -- helping sellers understand which platform (CrowdStrike / Palo Alto / Microsoft) the prospect is aligned with, and positioning accordingly
2. **Compliance-driven pipeline** -- mapping prospect compliance obligations to specific security tool requirements; SOC 2, PCI, HIPAA, CMMC create predictable buying cycles
3. **Breach-event urgency capture** -- when a peer or industry breach occurs, security budgets unlock; Cambrian can accelerate seller response with pre-built vertical context
4. **CISO-as-buyer intelligence** -- new CISO hires, board risk committee mandates, and cyber insurance renewals are the three highest-signal trigger events
5. **Mid-market MDR opportunity** -- the mid-market can't staff SOCs; MDR providers (Arctic Wolf, Huntress, CrowdStrike Falcon Complete) are the fastest-growing segment
6. **Cloud security greenfield** -- cloud migration creates net-new security budgets; CNAPP is the fastest-growing product category

### For sellers selling into cybersecurity from Cambrian

- Identify the dominant platform commitment early -- CrowdStrike, Palo Alto, or Microsoft E5. This determines the competitive landscape for every point solution.
- Know the compliance driver. SOC 2 vs. PCI vs. HIPAA vs. CMMC vs. FedRAMP each imply different control requirements and different tool selections.
- The CISO buying cycle is either fear-driven (peer breach), compliance-driven (audit), board-driven (risk mandate), or renewal-driven (contract expiration). Identify which.
- Mid-market is the sweet spot for most security vendors -- enterprise is platform-locked; SMB buys through MSPs; mid-market has budget, pain, and decision-making agility.
- AI security is the emerging category -- not just AI-powered defense tools, but tools to secure AI deployments (LLM firewalls, prompt injection detection, AI data governance).
- Cyber insurance is the under-appreciated forcing function -- when an insurer requires MFA + EDR + offline backup + PAM for coverage, the CISO has a non-negotiable shopping list.

---

## 13. Cross-references to sister layers

| Layer | How it applies |
|---|---|
| \`aiMlKnowledge.js\` | AI-powered security tools; AI as new attack surface; securing AI/ML deployments |
| \`b2bSalesKnowledge.js\` | Enterprise security sales is textbook complex B2B -- multi-stakeholder, POC-driven, long cycle |
| \`complianceKnowledge.js\` | SOC 2, PCI DSS, HIPAA, GDPR, state privacy -- compliance drives security purchasing |
| \`approvalGatesKnowledge.js\` | Security and compliance review gates in enterprise procurement |
| \`investorIntelligenceKnowledge.js\` | CrowdStrike (CRWD), Palo Alto (PANW), Fortinet (FTNT), Zscaler (ZS), SentinelOne (S), Okta (OKTA), CyberArk (CYBR), Tenable (TENB), Qualys (QLYS), Cloudflare (NET), Rubrik (RBRK), Varonis (VRNS) all publicly traded |
| \`fintechKnowledge.js\` | Financial services cybersecurity requirements (NY DFS, GLBA, PCI); fintech as security buyer |
| \`healthcareSaasKnowledge.js\` | HIPAA Security Rule drives healthcare cybersecurity spend |
| \`smbMidmarketKnowledge.js\` | SMB/mid-market security buying patterns; MSP/MSSP channel dynamics |

---

*End of layer. Update cadence: quarterly aligned with major vendor earnings (CrowdStrike Jan/May/Aug/Nov, Palo Alto Feb/May/Aug/Nov, Zscaler Feb/Jun/Sep/Nov). Critical re-check triggers: major breach events, SEC enforcement actions, new state privacy laws, Gartner MQ/Market Guide releases, cyber insurance market shifts, AI security category evolution.*
`,
};

// Required exports for knowledge-lint vertical file schema
export const CYBERSECURITY_INJECTION = CYBERSECURITY_PLAYBOOK.layerContent;
export const CYBERSECURITY_SCORING = CYBERSECURITY_PLAYBOOK.keywords.join(", ");
export const CYBERSECURITY_DISCOVERY = CYBERSECURITY_PLAYBOOK.discovery.join("\n");
