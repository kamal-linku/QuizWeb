from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from backend.app.core.database import get_db
from backend.app.models.models import Quiz
from backend.app.schemas.schemas import (
    SubmitAttemptRequest,
    SubmitAttemptResponse,
    LeaderboardEntry
)
from backend.app.services.quiz_service import QuizService

router = APIRouter(prefix="/quizzes", tags=["Attempts & Submissions"])

@router.post("/{share_code}/submit", response_model=SubmitAttemptResponse)
def submit_quiz_attempt(
    share_code: str,
    submission: SubmitAttemptRequest,
    db: Session = Depends(get_db)
):
    """
    Submits answers for a quiz, verifies score against correct answers on backend,
    saves attempt, and returns score, breakdown, feedback, and leaderboard.
    """
    return QuizService.submit_attempt(db, share_code, submission)

@router.get("/{share_code}/results", response_model=List[LeaderboardEntry])
def get_quiz_leaderboard(share_code: str, db: Session = Depends(get_db)):
    """
    Returns public leaderboard for a quiz.
    """
    quiz = db.query(Quiz).filter(Quiz.share_code == share_code).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return QuizService.get_leaderboard(db, quiz.id)

