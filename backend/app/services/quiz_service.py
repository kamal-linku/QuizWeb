import json
import secrets
import string
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException

from backend.app.models.models import Quiz, Question, Option, Attempt
from backend.app.schemas.schemas import (
    QuizCreate,
    PublicQuiz,
    PublicQuestion,
    PublicOption,
    SubmitAttemptRequest,
    SubmitAttemptResponse,
    QuestionBreakdown,
    LeaderboardEntry,
    QuizDashboardResponse,
    QuestionStat
)
from backend.app.services.default_questions import get_feedback_message

def generate_share_code(length: int = 6) -> str:
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_creator_token(length: int = 16) -> str:
    return secrets.token_urlsafe(length)

class QuizService:
    @staticmethod
    def create_quiz(db: Session, data: QuizCreate) -> Quiz:
        # Generate unique share code
        for _ in range(10):
            code = generate_share_code(6)
            existing = db.query(Quiz).filter(Quiz.share_code == code).first()
            if not existing:
                break
        else:
            code = generate_share_code(8)
            
        creator_token = generate_creator_token()
        title = data.title if data.title and data.title.strip() else f"How Well Do You Know {data.creator_name}?"

        quiz = Quiz(
            creator_name=data.creator_name.strip(),
            title=title.strip(),
            share_code=code,
            creator_token=creator_token
        )
        db.add(quiz)
        db.flush() # get quiz.id

        for q_data in data.questions:
            question = Question(
                quiz_id=quiz.id,
                question_text=q_data.question_text.strip(),
                question_number=q_data.question_number
            )
            db.add(question)
            db.flush() # get question.id

            options_to_add = []
            for idx, opt_text in enumerate(q_data.options):
                opt = Option(
                    question_id=question.id,
                    option_text=opt_text.strip(),
                    option_index=idx
                )
                db.add(opt)
                options_to_add.append(opt)

            db.flush()

            # Set correct option id based on correct_option_index
            if 0 <= q_data.correct_option_index < len(options_to_add):
                question.correct_option_id = options_to_add[q_data.correct_option_index].id
            elif len(options_to_add) > 0:
                question.correct_option_id = options_to_add[0].id

        db.commit()
        db.refresh(quiz)
        return quiz

    @staticmethod
    def get_public_quiz(db: Session, share_code: str) -> PublicQuiz:
        quiz = db.query(Quiz).filter(Quiz.share_code == share_code).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        public_questions: List[PublicQuestion] = []
        for q in quiz.questions:
            options: List[PublicOption] = [
                PublicOption(id=opt.id, text=opt.option_text, index=opt.option_index)
                for opt in q.options
            ]
            public_questions.append(
                PublicQuestion(
                    id=q.id,
                    question_number=q.question_number,
                    question_text=q.question_text,
                    options=options
                )
            )

        return PublicQuiz(
            share_code=quiz.share_code,
            title=quiz.title,
            creator_name=quiz.creator_name,
            total_questions=len(quiz.questions),
            questions=public_questions
        )

    @staticmethod
    def submit_attempt(db: Session, share_code: str, submission: SubmitAttemptRequest) -> SubmitAttemptResponse:
        quiz = db.query(Quiz).filter(Quiz.share_code == share_code).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        score = 0
        total_questions = len(quiz.questions)
        breakdowns: List[QuestionBreakdown] = []

        # Map option_id -> option object for quick lookup
        options_dict = {}
        for q in quiz.questions:
            for opt in q.options:
                options_dict[opt.id] = opt

        # Evaluate answers
        for q in quiz.questions:
            # submission.answers keys can be str or int
            chosen_option_id = submission.answers.get(str(q.id))
            if chosen_option_id is None:
                chosen_option_id = submission.answers.get(q.id)

            chosen_opt = options_dict.get(chosen_option_id)
            correct_opt = options_dict.get(q.correct_option_id)

            is_correct = False
            if chosen_option_id is not None and chosen_option_id == q.correct_option_id:
                is_correct = True
                score += 1

            breakdowns.append(
                QuestionBreakdown(
                    question_id=q.id,
                    question_number=q.question_number,
                    question_text=q.question_text,
                    user_option_id=chosen_option_id,
                    user_option_text=chosen_opt.option_text if chosen_opt else "No answer",
                    correct_option_id=q.correct_option_id,
                    correct_option_text=correct_opt.option_text if correct_opt else "Unknown",
                    is_correct=is_correct
                )
            )

        percentage = round((score / total_questions * 100), 1) if total_questions > 0 else 0.0

        # Save Attempt in DB
        attempt = Attempt(
            quiz_id=quiz.id,
            friend_name=submission.friend_name.strip(),
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            answers_json=json.dumps(submission.answers)
        )
        db.add(attempt)
        db.commit()
        db.refresh(attempt)

        feedback = get_feedback_message(score, total_questions, quiz.creator_name)
        leaderboard = QuizService.get_leaderboard(db, quiz.id)

        return SubmitAttemptResponse(
            attempt_id=attempt.id,
            friend_name=attempt.friend_name,
            creator_name=quiz.creator_name,
            score=score,
            total_questions=total_questions,
            percentage=percentage,
            feedback_message=feedback,
            breakdown=breakdowns,
            leaderboard=leaderboard
        )

    @staticmethod
    def get_leaderboard(db: Session, quiz_id: int) -> List[LeaderboardEntry]:
        attempts = (
            db.query(Attempt)
            .filter(Attempt.quiz_id == quiz_id)
            .order_by(Attempt.score.desc(), Attempt.created_at.asc())
            .all()
        )
        leaderboard: List[LeaderboardEntry] = []
        for idx, att in enumerate(attempts):
            leaderboard.append(
                LeaderboardEntry(
                    rank=idx + 1,
                    friend_name=att.friend_name,
                    score=att.score,
                    total_questions=att.total_questions,
                    percentage=att.percentage,
                    created_at=att.created_at
                )
            )
        return leaderboard

    @staticmethod
    def get_dashboard(db: Session, share_code: str, creator_token: str) -> QuizDashboardResponse:
        quiz = db.query(Quiz).filter(Quiz.share_code == share_code).first()
        if not quiz:
            raise HTTPException(status_code=404, detail="Quiz not found")

        if quiz.creator_token != creator_token:
            raise HTTPException(status_code=403, detail="Invalid creator credentials")

        attempts = quiz.attempts
        total_attempts = len(attempts)
        avg_score = round(sum(a.score for a in attempts) / total_attempts, 2) if total_attempts > 0 else 0.0
        max_score = max((a.score for a in attempts), default=0)
        perfect_count = sum(1 for a in attempts if a.score == a.total_questions and a.total_questions > 0)

        leaderboard = QuizService.get_leaderboard(db, quiz.id)

        # Question analytics
        question_stats: List[QuestionStat] = []
        # Pre-parse attempts answers
        attempts_answers = []
        for a in attempts:
            if a.answers_json:
                try:
                    attempts_answers.append(json.loads(a.answers_json))
                except Exception:
                    pass

        for q in quiz.questions:
            correct_count = 0
            total_ans = 0
            for ans_dict in attempts_answers:
                chosen = ans_dict.get(str(q.id)) or ans_dict.get(q.id)
                if chosen is not None:
                    total_ans += 1
                    if chosen == q.correct_option_id:
                        correct_count += 1

            accuracy = round((correct_count / total_ans * 100), 1) if total_ans > 0 else 0.0
            question_stats.append(
                QuestionStat(
                    question_number=q.question_number,
                    question_text=q.question_text,
                    correct_count=correct_count,
                    total_answered=total_ans,
                    accuracy_percentage=accuracy
                )
            )

        return QuizDashboardResponse(
            quiz_id=quiz.id,
            creator_name=quiz.creator_name,
            title=quiz.title,
            share_code=quiz.share_code,
            total_attempts=total_attempts,
            average_score=avg_score,
            highest_score=max_score,
            perfect_score_count=perfect_count,
            leaderboard=leaderboard,
            question_stats=question_stats
        )

