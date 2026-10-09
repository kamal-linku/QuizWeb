from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from backend.app.core.database import get_db
from backend.app.schemas.schemas import (
    QuizCreate,
    QuizCreateResponse,
    PublicQuiz
)
from backend.app.services.quiz_service import QuizService
from backend.app.services.default_questions import get_default_question_templates

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router.get("/templates")
def get_templates(name: str = Query("Friend", description="Creator name to populate templates")):
    """Returns preset 10 questions with customized creator name"""
    return {
        "creator_name": name,
        "questions": get_default_question_templates(name)
    }

@router.post("", response_model=QuizCreateResponse)
def create_quiz(data: QuizCreate, db: Session = Depends(get_db)):
    """Creates a new personalized 10-question quiz"""
    if len(data.questions) == 0:
        raise HTTPException(status_code=400, detail="Quiz must contain at least 1 question")
    
    quiz = QuizService.create_quiz(db, data)
    return QuizCreateResponse(
        id=quiz.id,
        share_code=quiz.share_code,
        creator_token=quiz.creator_token,
        title=quiz.title,
        creator_name=quiz.creator_name,
        total_questions=len(quiz.questions)
    )

@router.get("/{share_code}", response_model=PublicQuiz)
def get_quiz_for_taker(share_code: str, db: Session = Depends(get_db)):
    """
    Public endpoint for friends taking the quiz.
    CRITICAL SECURITY: Correct answers are strictly omitted.
    """
    return QuizService.get_public_quiz(db, share_code)

