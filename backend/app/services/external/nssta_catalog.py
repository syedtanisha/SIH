from typing import List, Dict, Any

NSSTA_CURRICULUM_CATALOG = [
    {
        "title": "NSSTA ISS Induction: Survey Sampling & Frame Design",
        "description": "Core curriculum for probationers on multi-stage sampling, selection probabilities, multiplier derivation, and estimation procedures.",
        "url": "https://nssta.gov.in/courses/survey-sampling",
        "duration_hours": 20.0,
        "aligned_competency": "STAT_SURVEY"
    },
    {
        "title": "NSSTA Digital Data Lab: Official Statistics with R and Python",
        "description": "Practical computer laboratory modules for processing large-scale survey datasets, automating statistical tables, and quality verification.",
        "url": "https://nssta.gov.in/courses/digital-data-lab",
        "duration_hours": 30.0,
        "aligned_competency": "STAT_COMPUTE"
    },
    {
        "title": "NSSTA Specialized Workshop: Quality Auditing in Official Statistics",
        "description": "Operational guidelines for applying the UN Fundamental Principles of Official Statistics and National Quality Assurance Framework (NQAF).",
        "url": "https://nssta.gov.in/courses/statistical-quality",
        "duration_hours": 15.0,
        "aligned_competency": "STAT_QUALITY"
    }
]

def get_nssta_catalog() -> List[Dict[str, Any]]:
    return NSSTA_CURRICULUM_CATALOG
