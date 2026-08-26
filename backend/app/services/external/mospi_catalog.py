from typing import List, Dict, Any

MOSPI_PUBLICATIONS_CATALOG = [
    {
        "title": "National Accounts Statistics (NAS) 2024",
        "category": "Macroeconomic Aggregates",
        "description": "Comprehensive statistical tables on Gross Domestic Product, Gross Capital Formation, and Private Final Consumption Expenditure with 2011-12 base.",
        "url": "https://mospi.gov.in/publication/national-accounts-statistics-2024",
        "aligned_competency": "STAT_NAT_ACC"
    },
    {
        "title": "Periodic Labour Force Survey (PLFS) Annual Report",
        "category": "Socio-Economic Surveys",
        "description": "Estimates of key employment and unemployment indicators in both rural and urban areas for India.",
        "url": "https://mospi.gov.in/publication/periodic-labour-force-survey-annual-report",
        "aligned_competency": "STAT_LABOUR"
    },
    {
        "title": "Annual Survey of Industries (ASI) Summary Results",
        "category": "Industrial Statistics",
        "description": "Factory sector growth, capital invested, output, and net value added in registered manufacturing units.",
        "url": "https://mospi.gov.in/publication/annual-survey-industries",
        "aligned_competency": "STAT_IND_AGRI"
    },
    {
        "title": "eSankhyiki Data Catalogue & Macro Indicators Module",
        "category": "Digital Data Portal",
        "description": "The official one-stop data platform for discovering, filtering, and downloading microdata and time-series indicators.",
        "url": "https://esankhyiki.mospi.gov.in",
        "aligned_competency": "STAT_DATA_GOV"
    },
    {
        "title": "Consumer Price Index (CPI) Technical Manual",
        "category": "Price Statistics",
        "description": "Methodology for collecting rural and urban retail prices, item weighting, and compiling state and all-India CPI (Rural/Urban/Combined).",
        "url": "https://mospi.gov.in/publication/cpi-manual",
        "aligned_competency": "STAT_PRICE_IND"
    }
]

def get_mospi_catalog() -> List[Dict[str, Any]]:
    return MOSPI_PUBLICATIONS_CATALOG
