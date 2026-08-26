from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .core.config import settings
from .db.database import engine, Base, SessionLocal
from .models.models import Competency, LearningResource, ResourceCompetencyMapping
from .data.seed_data import COMPETENCIES_SEED, RESOURCES_SEED
from .routers import (
    auth,
    competencies,
    assessments,
    recommendations,
    resources,
    documents,
    quizzes,
    progress,
    admin,
    final_interview
)

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def seed_initial_data():
    db: Session = SessionLocal()
    try:
        # 1. Seed Competencies
        comp_count = db.query(Competency).count()
        if comp_count == 0:
            for c_data in COMPETENCIES_SEED:
                comp = Competency(
                    code=c_data["code"],
                    name=c_data["name"],
                    domain=c_data["domain"],
                    description=c_data["description"],
                    required_level=c_data["required_level"],
                    weight=c_data.get("weight", 1.0)
                )
                db.add(comp)
            db.commit()
            print("[Startup] Seeded 9 official statistical competencies.")

        # 2. Seed Resources
        res_count = db.query(LearningResource).count()
        if res_count == 0:
            all_comps = {c.code: c for c in db.query(Competency).all()}
            for r_data in RESOURCES_SEED:
                res = LearningResource(
                    title=r_data["title"],
                    description=r_data["description"],
                    source=r_data["source"],
                    official_url=r_data["official_url"],
                    resource_type=r_data["resource_type"],
                    difficulty=r_data["difficulty"],
                    estimated_duration_mins=r_data["estimated_duration_mins"]
                )
                db.add(res)
                db.commit()
                db.refresh(res)

                comp_code = r_data.get("competency_code")
                if comp_code and comp_code in all_comps:
                    mapping = ResourceCompetencyMapping(
                        resource_id=res.id,
                        competency_id=all_comps[comp_code].id,
                        relevance_score=1.0
                    )
                    db.add(mapping)
                    db.commit()
            print("[Startup] Seeded official iGOT, NSSTA, and MoSPI resources.")
    except Exception as e:
        print(f"[Startup] Error seeding initial data: {e}")
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    seed_initial_data()

# Mount API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(competencies.router, prefix=settings.API_V1_STR)
app.include_router(assessments.router, prefix=settings.API_V1_STR)
app.include_router(recommendations.router, prefix=settings.API_V1_STR)
app.include_router(resources.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(quizzes.router, prefix=settings.API_V1_STR)
app.include_router(progress.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)
app.include_router(
    final_interview.router,
    prefix=settings.API_V1_STR
)
@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "ecosystem": "MoSPI / NSSTA / iGOT Karmayogi Capacity Building",
        "docs_url": "/docs",
        "status": "Online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
