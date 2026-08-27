# Official Competencies, Baseline Questions, and Resources Data for India's Statistical System

COMPETENCIES_SEED = [
    {
        "code": "STAT_SURVEY",
        "name": "Survey Methodology & Sampling Design",
        "domain": "Survey Operations",
        "description": "Techniques of probability sampling, stratified multistage sampling design, sampling frames, weighting procedures, and non-sampling error minimization in large-scale national socioeconomic surveys.",
        "required_level": 80.0,
        "weight": 1.2
    },
    {
        "code": "STAT_NAT_ACC",
        "name": "National Accounts Statistics & Macro Aggregates",
        "domain": "Macroeconomic Statistics",
        "description": "System of National Accounts (SNA 2008), Gross Domestic Product (GDP), Gross Value Added (GVA), Supply and Use Tables (SUT), institutional sector accounts, and capital formation estimation.",
        "required_level": 85.0,
        "weight": 1.3
    },
    {
        "code": "STAT_COMPUTE",
        "name": "Statistical Computing & Data Science",
        "domain": "Computing & Informatics",
        "description": "Statistical programming using Python, R, STATA, and SQL for data transformation, unit-level microdata processing, econometric modeling, automated report pipelines, and reproducible research.",
        "required_level": 80.0,
        "weight": 1.2
    },
    {
        "code": "STAT_PRICE_IND",
        "name": "Price Statistics & Index Numbers",
        "domain": "Price & Industrial Statistics",
        "description": "Compilation methodology of Consumer Price Index (CPI), Index of Industrial Production (IIP), Wholesale Price Index (WPI), Laspeyres/Paasche index formulations, and basket revision protocols.",
        "required_level": 75.0,
        "weight": 1.0
    },
    {
        "code": "STAT_LABOUR",
        "name": "Labour & Demographic Statistics",
        "domain": "Socioeconomic Statistics",
        "description": "Periodic Labour Force Survey (PLFS) concepts, Usual Principal & Subsidiary Status (UPSS), Current Weekly Status (CWS), Labour Force Participation Rate (LFPR), Worker Population Ratio (WPR), and unemployment metrics.",
        "required_level": 80.0,
        "weight": 1.1
    },
    {
        "code": "STAT_DATA_GOV",
        "name": "Data Management & eSankhyiki Governance",
        "domain": "Data Governance",
        "description": "MoSPI National Metadata Standards, eSankhyiki portal data architecture, microdata anonymization, FAIR data principles, API-based dissemination, and open government data security.",
        "required_level": 75.0,
        "weight": 1.0
    },
    {
        "code": "STAT_QUALITY",
        "name": "Statistical Quality Assurance & Audit",
        "domain": "Quality & Standards",
        "description": "United Nations Fundamental Principles of Official Statistics, National Quality Assurance Frameworks (NQAF), data consistency auditing, imputation methods, and field survey supervision protocols.",
        "required_level": 80.0,
        "weight": 1.1
    },
    {
        "code": "STAT_VIZ_COMM",
        "name": "Data Visualization & Official Communication",
        "domain": "Dissemination",
        "description": "Visual storytelling for policy makers, interactive dashboard development, Sustainable Development Goal (SDG) National Indicator reporting, statistical press release drafting, and public data literacy.",
        "required_level": 70.0,
        "weight": 0.9
    },
    {
        "code": "STAT_IND_AGRI",
        "name": "Industrial & Enterprise Statistics",
        "domain": "Enterprise Statistics",
        "description": "Annual Survey of Industries (ASI) factory frame, NIC/NPC classifications, invested capital estimation, Gross Output, Net Value Added calculation in organized manufacturing, and service sector enterprise surveys.",
        "required_level": 75.0,
        "weight": 1.0
    }
]

DIVISION_PROFILES = {
    "MoSPI National Accounts Division (NAD)": {
        "division_code": "NAD",
        "description": "Compilation of GDP, GVA, Supply and Use Tables, and capital formation accounts under SNA 2008 framework.",
        "core_competencies": ["STAT_NAT_ACC", "STAT_COMPUTE", "STAT_PRICE_IND", "STAT_QUALITY", "STAT_DATA_GOV"],
        "benchmarks": {
            "STAT_NAT_ACC": 90.0,
            "STAT_COMPUTE": 85.0,
            "STAT_PRICE_IND": 80.0,
            "STAT_QUALITY": 80.0,
            "STAT_DATA_GOV": 75.0,
            "STAT_SURVEY": 70.0,
            "STAT_LABOUR": 70.0,
            "STAT_VIZ_COMM": 75.0,
            "STAT_IND_AGRI": 75.0
        },
        "weights": {
            "STAT_NAT_ACC": 1.5,
            "STAT_COMPUTE": 1.3,
            "STAT_PRICE_IND": 1.2,
            "STAT_QUALITY": 1.1,
            "STAT_DATA_GOV": 1.0,
            "STAT_SURVEY": 0.9,
            "STAT_LABOUR": 0.9,
            "STAT_VIZ_COMM": 1.0,
            "STAT_IND_AGRI": 1.0
        }
    },
    "MoSPI Field Operations Division (FOD)": {
        "division_code": "FOD",
        "description": "Execution of nationwide socioeconomic sample surveys (PLFS, HCES), ASI field visits, and data collection.",
        "core_competencies": ["STAT_SURVEY", "STAT_LABOUR", "STAT_QUALITY", "STAT_IND_AGRI", "STAT_DATA_GOV"],
        "benchmarks": {
            "STAT_SURVEY": 92.0,
            "STAT_LABOUR": 88.0,
            "STAT_QUALITY": 85.0,
            "STAT_IND_AGRI": 80.0,
            "STAT_DATA_GOV": 75.0,
            "STAT_COMPUTE": 75.0,
            "STAT_PRICE_IND": 75.0,
            "STAT_NAT_ACC": 70.0,
            "STAT_VIZ_COMM": 70.0
        },
        "weights": {
            "STAT_SURVEY": 1.5,
            "STAT_LABOUR": 1.4,
            "STAT_QUALITY": 1.3,
            "STAT_IND_AGRI": 1.2,
            "STAT_DATA_GOV": 1.0,
            "STAT_COMPUTE": 1.0,
            "STAT_PRICE_IND": 1.0,
            "STAT_NAT_ACC": 0.8,
            "STAT_VIZ_COMM": 0.8
        }
    },
    "MoSPI Economic Statistics Division (ESD)": {
        "division_code": "ESD",
        "description": "Compilation of Consumer Price Index (CPI), Index of Industrial Production (IIP), and Annual Survey of Industries.",
        "core_competencies": ["STAT_PRICE_IND", "STAT_IND_AGRI", "STAT_COMPUTE", "STAT_QUALITY", "STAT_NAT_ACC"],
        "benchmarks": {
            "STAT_PRICE_IND": 92.0,
            "STAT_IND_AGRI": 88.0,
            "STAT_COMPUTE": 82.0,
            "STAT_QUALITY": 82.0,
            "STAT_NAT_ACC": 80.0,
            "STAT_DATA_GOV": 78.0,
            "STAT_SURVEY": 75.0,
            "STAT_LABOUR": 72.0,
            "STAT_VIZ_COMM": 75.0
        },
        "weights": {
            "STAT_PRICE_IND": 1.5,
            "STAT_IND_AGRI": 1.4,
            "STAT_COMPUTE": 1.2,
            "STAT_QUALITY": 1.2,
            "STAT_NAT_ACC": 1.1,
            "STAT_DATA_GOV": 1.0,
            "STAT_SURVEY": 0.9,
            "STAT_LABOUR": 0.9,
            "STAT_VIZ_COMM": 0.9
        }
    },
    "MoSPI Survey Design & Research Division (SDRD)": {
        "division_code": "SDRD",
        "description": "Design of sampling frames, questionnaire formulation, estimation procedures, and survey research manuals.",
        "core_competencies": ["STAT_SURVEY", "STAT_COMPUTE", "STAT_QUALITY", "STAT_LABOUR", "STAT_VIZ_COMM"],
        "benchmarks": {
            "STAT_SURVEY": 95.0,
            "STAT_COMPUTE": 88.0,
            "STAT_QUALITY": 88.0,
            "STAT_LABOUR": 82.0,
            "STAT_VIZ_COMM": 80.0,
            "STAT_DATA_GOV": 80.0,
            "STAT_NAT_ACC": 72.0,
            "STAT_PRICE_IND": 72.0,
            "STAT_IND_AGRI": 72.0
        },
        "weights": {
            "STAT_SURVEY": 1.6,
            "STAT_COMPUTE": 1.3,
            "STAT_QUALITY": 1.3,
            "STAT_LABOUR": 1.1,
            "STAT_VIZ_COMM": 1.0,
            "STAT_DATA_GOV": 1.0,
            "STAT_NAT_ACC": 0.8,
            "STAT_PRICE_IND": 0.8,
            "STAT_IND_AGRI": 0.8
        }
    },
    "MoSPI Data Quality & Dissemination Division (DQDD)": {
        "division_code": "DQDD",
        "description": "eSankhyiki management, open microdata dissemination, SDG indicators, metadata standards, and data auditing.",
        "core_competencies": ["STAT_DATA_GOV", "STAT_VIZ_COMM", "STAT_QUALITY", "STAT_COMPUTE", "STAT_SURVEY"],
        "benchmarks": {
            "STAT_DATA_GOV": 92.0,
            "STAT_VIZ_COMM": 90.0,
            "STAT_QUALITY": 88.0,
            "STAT_COMPUTE": 85.0,
            "STAT_SURVEY": 78.0,
            "STAT_NAT_ACC": 75.0,
            "STAT_PRICE_IND": 75.0,
            "STAT_LABOUR": 75.0,
            "STAT_IND_AGRI": 72.0
        },
        "weights": {
            "STAT_DATA_GOV": 1.5,
            "STAT_VIZ_COMM": 1.4,
            "STAT_QUALITY": 1.3,
            "STAT_COMPUTE": 1.2,
            "STAT_SURVEY": 1.0,
            "STAT_NAT_ACC": 0.9,
            "STAT_PRICE_IND": 0.9,
            "STAT_LABOUR": 0.9,
            "STAT_IND_AGRI": 0.8
        }
    },
    "State DES (Directorate of Economics & Statistics)": {
        "division_code": "DES",
        "description": "State domestic product (GSDP), district-level statistics, local price collection, and state statistical coordination.",
        "core_competencies": ["STAT_SURVEY", "STAT_PRICE_IND", "STAT_NAT_ACC", "STAT_DATA_GOV", "STAT_IND_AGRI"],
        "benchmarks": {
            "STAT_SURVEY": 85.0,
            "STAT_PRICE_IND": 85.0,
            "STAT_NAT_ACC": 82.0,
            "STAT_DATA_GOV": 78.0,
            "STAT_IND_AGRI": 78.0,
            "STAT_QUALITY": 78.0,
            "STAT_COMPUTE": 75.0,
            "STAT_LABOUR": 75.0,
            "STAT_VIZ_COMM": 72.0
        },
        "weights": {
            "STAT_SURVEY": 1.3,
            "STAT_PRICE_IND": 1.3,
            "STAT_NAT_ACC": 1.2,
            "STAT_DATA_GOV": 1.1,
            "STAT_IND_AGRI": 1.1,
            "STAT_QUALITY": 1.0,
            "STAT_COMPUTE": 1.0,
            "STAT_LABOUR": 0.9,
            "STAT_VIZ_COMM": 0.9
        }
    },
    "Ministry Line Department / NITI Aayog": {
        "division_code": "POLICY",
        "description": "Policy analytics, Sustainable Development Goal tracking, inter-ministerial data coordination, and official reporting.",
        "core_competencies": ["STAT_VIZ_COMM", "STAT_DATA_GOV", "STAT_NAT_ACC", "STAT_QUALITY", "STAT_COMPUTE"],
        "benchmarks": {
            "STAT_VIZ_COMM": 90.0,
            "STAT_DATA_GOV": 85.0,
            "STAT_NAT_ACC": 85.0,
            "STAT_QUALITY": 82.0,
            "STAT_COMPUTE": 80.0,
            "STAT_SURVEY": 75.0,
            "STAT_PRICE_IND": 75.0,
            "STAT_LABOUR": 75.0,
            "STAT_IND_AGRI": 72.0
        },
        "weights": {
            "STAT_VIZ_COMM": 1.5,
            "STAT_DATA_GOV": 1.3,
            "STAT_NAT_ACC": 1.3,
            "STAT_QUALITY": 1.1,
            "STAT_COMPUTE": 1.1,
            "STAT_SURVEY": 0.9,
            "STAT_PRICE_IND": 0.9,
            "STAT_LABOUR": 0.9,
            "STAT_IND_AGRI": 0.8
        }
    }
}

DESIGNATION_MODIFIERS = {
    "Director": {"benchmark_delta": 6.0, "weight_multiplier": 1.15, "seniority": "Senior Leadership"},
    "Joint Director": {"benchmark_delta": 5.0, "weight_multiplier": 1.12, "seniority": "Senior Leadership"},
    "Dy. Director": {"benchmark_delta": 4.0, "weight_multiplier": 1.10, "seniority": "Middle Management"},
    "Assistant Director": {"benchmark_delta": 2.0, "weight_multiplier": 1.05, "seniority": "Junior Cadre Leadership"},
    "Senior Statistical Officer": {"benchmark_delta": 2.0, "weight_multiplier": 1.05, "seniority": "Technical Supervisory"},
    "Junior Statistical Officer": {"benchmark_delta": 0.0, "weight_multiplier": 1.00, "seniority": "Technical Operations"},
    "Statistical Investigator": {"benchmark_delta": -2.0, "weight_multiplier": 0.95, "seniority": "Field Execution"},
    "Data Analyst": {"benchmark_delta": 2.0, "weight_multiplier": 1.05, "seniority": "Analytical Technical"}
}

BASELINE_QUESTIONS = [
    {
        "id": 1,
        "competency_code": "STAT_SURVEY",
        "competency_name": "Survey Methodology & Sampling Design",
        "domain": "Survey Operations",
        "difficulty": "Intermediate",
        "question_text": "In the National Sample Survey (NSS) multi-stage sampling design for rural areas, what generally serves as the First Stage Unit (FSU)?",
        "options": [
            {"key": "A", "text": "Individual Households"},
            {"key": "B", "text": "Census Villages (or Panchayat Wards)"},
            {"key": "C", "text": "Districts (Administrative boundaries)"},
            {"key": "D", "text": "Agricultural parcels of land"}
        ],
        "correct_option": "B",
        "explanation": "In large-scale rural sample surveys in India (such as NSS / PLFS), census villages (or sub-units in large villages) are selected as First Stage Units (FSUs), followed by households as Ultimate Stage Units (USUs)."
    },
    {
        "id": 2,
        "competency_code": "STAT_NAT_ACC",
        "competency_name": "National Accounts Statistics & Macro Aggregates",
        "domain": "Macroeconomic Statistics",
        "difficulty": "Intermediate",
        "question_text": "According to the SNA 2008 framework adopted by MoSPI, what is the exact relationship between Gross Value Added (GVA) at Basic Prices and Gross Domestic Product (GDP) at Market Prices?",
        "options": [
            {"key": "A", "text": "GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies"},
            {"key": "B", "text": "GDP at Market Prices = GVA at Basic Prices - Production Taxes + Production Subsidies"},
            {"key": "C", "text": "GDP at Market Prices = GVA at Factor Cost + Direct Taxes"},
            {"key": "D", "text": "GDP at Market Prices = GVA at Basic Prices + Net Factor Income from Abroad"}
        ],
        "correct_option": "A",
        "explanation": "Under the current National Accounts series (Base 2011-12 onwards aligned with SNA 2008), GDP at Market Prices is derived by adding Product Taxes and subtracting Product Subsidies from GVA at Basic Prices."
    },
    {
        "id": 3,
        "competency_code": "STAT_COMPUTE",
        "competency_name": "Statistical Computing & Data Science",
        "domain": "Computing & Informatics",
        "difficulty": "Intermediate",
        "question_text": "When analyzing microdata survey weights (multiplier) in Python using pandas to compute estimated population totals, which operation is methodologically correct?",
        "options": [
            {"key": "A", "text": "df['variable'].mean() directly on the unweighted sample"},
            {"key": "B", "text": "(df['variable'] * df['weight']).sum() / df['weight'].sum() for weighted mean, and (df['variable'] * df['weight']).sum() for total"},
            {"key": "C", "text": "df['variable'].sum() multiplied by total sample size"},
            {"key": "D", "text": "Standardizing the weights using z-score before calculating sum"}
        ],
        "correct_option": "B",
        "explanation": "In survey analysis with sampling multipliers/weights, the estimated population total is the sum of weighted values (value * weight), and the estimated weighted mean is the weighted sum divided by the sum of weights."
    },
    {
        "id": 4,
        "competency_code": "STAT_PRICE_IND",
        "competency_name": "Price Statistics & Index Numbers",
        "domain": "Price & Industrial Statistics",
        "difficulty": "Intermediate",
        "question_text": "Which formula is predominantly utilized for the compilation of the all-India Consumer Price Index (CPI) and Index of Industrial Production (IIP) by MoSPI?",
        "options": [
            {"key": "A", "text": "Paasche's Current Weighted Formula"},
            {"key": "B", "text": "Fisher's Ideal Index Formula"},
            {"key": "C", "text": "Laspeyres Base Weighted Formula"},
            {"key": "D", "text": "Marshall-Edgeworth Formula"}
        ],
        "correct_option": "C",
        "explanation": "India's official CPI and IIP are compiled using the Laspeyres index formulation with fixed base year weights to ensure monthly comparability across commodity baskets."
    },
    {
        "id": 5,
        "competency_code": "STAT_LABOUR",
        "competency_name": "Labour & Demographic Statistics",
        "domain": "Socioeconomic Statistics",
        "difficulty": "Intermediate",
        "question_text": "In the Periodic Labour Force Survey (PLFS), how is a person classified as 'Employed' under the Current Weekly Status (CWS) approach?",
        "options": [
            {"key": "A", "text": "Worked for at least 183 days during the preceding 365 days"},
            {"key": "B", "text": "Worked for at least 1 hour on any 1 day during the 7-day reference period"},
            {"key": "C", "text": "Worked for at least 8 hours every day during the reference month"},
            {"key": "D", "text": "Was actively seeking work throughout the preceding 30 days"}
        ],
        "correct_option": "B",
        "explanation": "Under the Current Weekly Status (CWS) methodology in PLFS, a person is considered employed if they performed economic activity for at least 1 hour on any one day during the 7-day reference period."
    },
    {
        "id": 6,
        "competency_code": "STAT_DATA_GOV",
        "competency_name": "Data Management & eSankhyiki Governance",
        "domain": "Data Governance",
        "difficulty": "Intermediate",
        "question_text": "What is the primary function of the 'Macro Indicators Module' on the official MoSPI eSankhyiki portal?",
        "options": [
            {"key": "A", "text": "Downloading raw un-anonymized personal survey schedules"},
            {"key": "B", "text": "Providing programmatic API and interactive time-series access for core macroeconomic data (NAS, CPI, IIP, ASI)"},
            {"key": "C", "text": "Managing civil servant transfers and cadre postings"},
            {"key": "D", "text": "Hosting general public opinion polls"}
        ],
        "correct_option": "B",
        "explanation": "The Macro Indicators Module of eSankhyiki (esankhyiki.mospi.gov.in) provides filtered time-series data and official REST APIs for major statistical datasets including National Accounts, CPI, and IIP."
    },
    {
        "id": 7,
        "competency_code": "STAT_QUALITY",
        "competency_name": "Statistical Quality Assurance & Audit",
        "domain": "Quality & Standards",
        "difficulty": "Intermediate",
        "question_text": "Which principle from the UN Fundamental Principles of Official Statistics emphasizes that official statistical agencies must maintain professional independence from political interference?",
        "options": [
            {"key": "A", "text": "Principle 1: Relevance, Impartiality, and Equal Access"},
            {"key": "B", "text": "Principle 2: Professional Standards and Ethics"},
            {"key": "C", "text": "Principle 5: Sources of Official Statistics"},
            {"key": "D", "text": "Principle 8: National Coordination"}
        ],
        "correct_option": "B",
        "explanation": "Principle 2 dictates that statistical agencies decide according to strictly professional considerations, scientific principles, and professional ethics on the methods and procedures for the collection and dissemination of data."
    },
    {
        "id": 8,
        "competency_code": "STAT_IND_AGRI",
        "competency_name": "Industrial & Enterprise Statistics",
        "domain": "Enterprise Statistics",
        "difficulty": "Intermediate",
        "question_text": "In the Annual Survey of Industries (ASI), how is Net Value Added (NVA) computed from Gross Output and Total Inputs?",
        "options": [
            {"key": "A", "text": "NVA = Gross Output - Total Inputs - Depreciation"},
            {"key": "B", "text": "NVA = Gross Output + Rent + Interest"},
            {"key": "C", "text": "NVA = Total Inputs - Fuel Consumption"},
            {"key": "D", "text": "NVA = Gross Fixed Capital / Working Capital"}
        ],
        "correct_option": "A",
        "explanation": "In the Annual Survey of Industries (ASI), Net Value Added (NVA) is derived as Gross Output minus Total Inputs minus Depreciation."
    },
    {
        "id": 9,
        "competency_code": "STAT_VIZ_COMM",
        "competency_name": "Data Visualization & Official Communication",
        "domain": "Dissemination",
        "difficulty": "Intermediate",
        "question_text": "In the National Indicator Framework (NIF) for Sustainable Development Goals (SDGs) coordinated by MoSPI, what is the primary role of official interactive dashboards?",
        "options": [
            {"key": "A", "text": "To replace official gazette notifications completely"},
            {"key": "B", "text": "To enable transparent, interactive tracking of baseline targets and progress across States and Union Territories for policy makers"},
            {"key": "C", "text": "To store encrypted raw census files exclusively"},
            {"key": "D", "text": "To restrict public viewing of administrative metrics"}
        ],
        "correct_option": "B",
        "explanation": "MoSPI's SDG National Indicator Framework dashboard visualizes indicator progress across goals and states to support evidence-based policy making and public transparency."
    }
]

RESOURCES_SEED = [
    {
        "title": "NSSTA Induction Module: Foundations of Official Statistics in India",
        "description": "Official academy curriculum covering the organizational structure of MoSPI, the Indian Statistical System, National Statistical Commission (NSC) guidelines, and administrative data flows.",
        "source": "NSSTA",
        "official_url": "https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta",
        "resource_type": "Training_Module",
        "difficulty": "Foundational",
        "estimated_duration_mins": 180,
        "competency_code": "STAT_SURVEY"
    },
    {
        "title": "NSSTA Digital Data Lab: Data Analytics with Python for Statistical Officers",
        "description": "Applied laboratory course on microdata wrangling, descriptive statistics, automated data validation pipelines, and visual reporting using Python pandas, numpy, and matplotlib.",
        "source": "NSSTA",
        "official_url": "https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta",
        "resource_type": "Training_Module",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 240,
        "competency_code": "STAT_COMPUTE"
    },
    {
        "title": "MoSPI NAD: National Accounts Statistics (SNA 2008) Framework & Estimation",
        "description": "Official National Accounts Division training manual on GDP/GVA estimation methodologies, sequence of accounts, Supply and Use Tables (SUT), and capital asset measurement.",
        "source": "MoSPI",
        "official_url": "https://www.mospi.gov.in/national-accounts-division-nad",
        "resource_type": "Publication",
        "difficulty": "Advanced",
        "estimated_duration_mins": 300,
        "competency_code": "STAT_NAT_ACC"
    },
    {
        "title": "NSSTA Advanced Curriculum: Survey Sampling & Multi-Stage Design",
        "description": "Official academy curriculum on stratified multistage sampling, allocation of sample sizes across strata, circular systematic sampling, and variance estimation in household surveys.",
        "source": "NSSTA",
        "official_url": "https://www.mospi.gov.in/survey-design-and-research-division-sdrd",
        "resource_type": "Training_Module",
        "difficulty": "Advanced",
        "estimated_duration_mins": 210,
        "competency_code": "STAT_SURVEY"
    },
    {
        "title": "NSSTA Digital Data Lab: Microdata Processing & Anonymization Standards",
        "description": "Hands-on laboratory manual on statistical disclosure control (SDC), k-anonymity, top-coding, and noise addition for open statistical datasets on eSankhyiki.",
        "source": "NSSTA",
        "official_url": "https://esankhyiki.mospi.gov.in/",
        "resource_type": "Training_Module",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 150,
        "competency_code": "STAT_DATA_GOV"
    },
    {
        "title": "MoSPI ESD: Consumer Price Index (CPI) & IIP Compilation Handbook",
        "description": "Standard operating procedures for price quote validation, geometric mean aggregation at item level, and chained Laspeyres index number calculations.",
        "source": "MoSPI",
        "official_url": "https://www.mospi.gov.in/economic-statistics-division-esd",
        "resource_type": "Publication",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 120,
        "competency_code": "STAT_PRICE_IND"
    },
    {
        "title": "MoSPI eSankhyiki Portal: Data Catalogue & Macro Indicators Guide",
        "description": "Official documentation for accessing core data products on eSankhyiki, utilizing REST endpoints, and integrating national data with state directorates.",
        "source": "MoSPI",
        "official_url": "https://esankhyiki.mospi.gov.in/",
        "resource_type": "Dataset",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 90,
        "competency_code": "STAT_DATA_GOV"
    },
    {
        "title": "MoSPI Periodic Labour Force Survey (PLFS) Annual Report & Methodology",
        "description": "Official technical report detailing sampling design, rotation scheme, activity definitions, UPSS vs CWS estimation formulas, and key labour indicators.",
        "source": "MoSPI",
        "official_url": "https://www.mospi.gov.in/publication/all-india-annual-report-plfs",
        "resource_type": "Publication",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 180,
        "competency_code": "STAT_LABOUR"
    },
    {
        "title": "MoSPI Annual Survey of Industries (ASI) Concepts & Operational Manual",
        "description": "Comprehensive reference handbook for industrial classification (NIC-2008), frame maintenance, schedule canvassing, and value added estimation.",
        "source": "MoSPI",
        "official_url": "https://www.mospi.gov.in/annual-survey-industries",
        "resource_type": "Publication",
        "difficulty": "Foundational",
        "estimated_duration_mins": 140,
        "competency_code": "STAT_IND_AGRI"
    },
    {
        "title": "MoSPI Sustainable Development Goals (SDG) National Indicator Report",
        "description": "Guidelines on metadata construction, baseline-to-target tracking, data visualization dashboards, and state progress comparison reports.",
        "source": "MoSPI",
        "official_url": "https://www.mospi.gov.in/sustainable-development-goals-sdg",
        "resource_type": "Publication",
        "difficulty": "Intermediate",
        "estimated_duration_mins": 130,
        "competency_code": "STAT_VIZ_COMM"
    },
    {
        "title": "NSSTA Quality Assurance & Audit Handbook for Official Statistics",
        "description": "Practical implementation of UN NQAF standards, data validation checklists, non-sampling error auditing, and field supervision manuals.",
        "source": "NSSTA",
        "official_url": "https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta",
        "resource_type": "Training_Module",
        "difficulty": "Advanced",
        "estimated_duration_mins": 160,
        "competency_code": "STAT_QUALITY"
    }
]
