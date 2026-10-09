from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.app.core.database import get_db
from backend.app.schemas.schemas import QuizDashboardResponse
from backend.app.services.quiz_service import QuizService

router = APIRouter(prefix="/quizzes", tags=["Creator Dashboard"])

@router.get("/{share_code}/dashboard", response_model=QuizDashboardResponse)
def get_creator_dashboard(
    share_code: str,
    token: str = Query(..., description="Secret Creator Token"),
    db: Session = Depends(get_db)
):
    """
    Returns private analytics dashboard for the quiz creator.
    Requires the secret creator_token generated during quiz creation.
    """
    return QuizService.get_dashboard(db, share_code, token)

