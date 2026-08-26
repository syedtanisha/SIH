from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..db.database import get_db
from ..models.models import User
from ..schemas.resource import RecommendationResponse
from ..core.security import get_current_user
from ..services.recommendation_service import get_personalized_recommendations

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.get("/for-you", response_model=RecommendationResponse)
def get_for_you_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_personalized_recommendations(current_user.id, db)
