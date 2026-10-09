from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

# Creator Creation Schemas
class QuestionCreate(BaseModel):
    question_text: str
    question_number: int
    options: List[str] # Array of 4 option text strings
    correct_option_index: int # Index (0-3) of the chosen correct option

class QuizCreate(BaseModel):
    creator_name: str = Field(..., min_length=1, max_length=100)
    title: Optional[str] = None
    questions: List[QuestionCreate] = Field(..., min_length=1)

class QuizCreateResponse(BaseModel):
    id: int
    share_code: str
    creator_token: str
    title: str
    creator_name: str
    total_questions: int

# Public Schemas for Quiz Taker (Security Rule: NO correct answers here!)
class PublicOption(BaseModel):
    id: int
    text: str
    index: int

class PublicQuestion(BaseModel):
    id: int
    question_number: int
    question_text: str
    options: List[PublicOption]

class PublicQuiz(BaseModel):
    share_code: str
    title: str
    creator_name: str
    total_questions: int
    questions: List[PublicQuestion]

# Submission Schemas
class SubmitAttemptRequest(BaseModel):
    friend_name: str = Field(..., min_length=1, max_length=100)
    answers: Dict[str, int] # question_id (as str/int key) -> selected option_id

class QuestionBreakdown(BaseModel):
    question_id: int
    question_number: int
    question_text: str
    user_option_id: Optional[int] = None
    user_option_text: Optional[str] = None
    correct_option_id: int
    correct_option_text: str
    is_correct: bool

class LeaderboardEntry(BaseModel):
    rank: int
    friend_name: str
    score: int
    total_questions: int
    percentage: float
    created_at: datetime

class SubmitAttemptResponse(BaseModel):
    attempt_id: int
    friend_name: str
    creator_name: str
    score: int
    total_questions: int
    percentage: float
    feedback_message: str
    breakdown: List[QuestionBreakdown]
    leaderboard: List[LeaderboardEntry]

# Dashboard Schemas
class QuestionStat(BaseModel):
    question_number: int
    question_text: str
    correct_count: int
    total_answered: int
    accuracy_percentage: float

class QuizDashboardResponse(BaseModel):
    quiz_id: int
    creator_name: str
    title: str
    share_code: str
    total_attempts: int
    average_score: float
    highest_score: int
    perfect_score_count: int
    leaderboard: List[LeaderboardEntry]
    question_stats: List[QuestionStat]

