import sys
import os

# Set utf-8 stdout encoding for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.default_questions import get_default_question_templates

client = TestClient(app)

def test_full_quiz_workflow():
    print("--- 1. Testing Default Question Templates ---")
    res = client.get("/api/quizzes/templates?name=Kamal")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    templates_data = res.json()
    assert templates_data["creator_name"] == "Kamal"
    assert len(templates_data["questions"]) == 10
    print("Templates fetched successfully: 10 questions verified.")

    print("\n--- 2. Creating Quiz for Kamal ---")
    quiz_payload = {
        "creator_name": "Kamal",
        "title": "How Well Do You Know Kamal?",
        "questions": [
            {
                "question_text": q["question_text"],
                "question_number": q["question_number"],
                "options": q["options"],
                "correct_option_index": q["correct_option_index"]
            }
            for q in templates_data["questions"]
        ]
    }
    res = client.post("/api/quizzes", json=quiz_payload)
    assert res.status_code == 200, f"Create quiz failed: {res.text}"
    created_quiz = res.json()
    share_code = created_quiz["share_code"]
    creator_token = created_quiz["creator_token"]
    assert share_code is not None
    assert creator_token is not None
    print(f"Quiz created! Share Code: {share_code}, Token: {creator_token}")

    print("\n--- 3. Verifying Public Quiz for Friend (Security Check) ---")
    res = client.get(f"/api/quizzes/{share_code}")
    assert res.status_code == 200, f"Get public quiz failed: {res.text}"
    public_quiz = res.json()
    assert public_quiz["creator_name"] == "Kamal"
    assert len(public_quiz["questions"]) == 10
    
    # Verify SECURITY RULE: None of the options or questions leak the correct answer
    for q in public_quiz["questions"]:
        assert "correct_option_id" not in q
        assert "correct_option_index" not in q
        for opt in q["options"]:
            assert "correct" not in opt
            assert "is_correct" not in opt
    print("Security check passed! No answers leaked in public quiz endpoint.")

    print("\n--- 4. Friend 1 (Sioli) Submitting Perfect 10/10 Answers ---")
    sioli_answers = {}
    for q_idx, q in enumerate(public_quiz["questions"]):
        correct_idx = templates_data["questions"][q_idx]["correct_option_index"]
        chosen_opt_id = q["options"][correct_idx]["id"]
        sioli_answers[str(q["id"])] = chosen_opt_id

    res = client.post(
        f"/api/quizzes/{share_code}/submit",
        json={"friend_name": "Sioli", "answers": sioli_answers}
    )
    assert res.status_code == 200, f"Submission failed: {res.text}"
    sioli_result = res.json()
    assert sioli_result["score"] == 10
    assert sioli_result["percentage"] == 100.0
    assert "twin" in sioli_result["feedback_message"].lower()
    print(f"Sioli score: {sioli_result['score']}/{sioli_result['total_questions']}")

    print("\n--- 5. Friend 2 (Rahul) Submitting 8/10 Answers ---")
    rahul_answers = {}
    for q_idx, q in enumerate(public_quiz["questions"]):
        if q_idx < 8:
            correct_idx = templates_data["questions"][q_idx]["correct_option_index"]
            chosen_opt_id = q["options"][correct_idx]["id"]
        else:
            # Pick wrong option
            correct_idx = templates_data["questions"][q_idx]["correct_option_index"]
            wrong_idx = (correct_idx + 1) % 4
            chosen_opt_id = q["options"][wrong_idx]["id"]
        rahul_answers[str(q["id"])] = chosen_opt_id

    res = client.post(
        f"/api/quizzes/{share_code}/submit",
        json={"friend_name": "Rahul", "answers": rahul_answers}
    )
    assert res.status_code == 200
    rahul_result = res.json()
    assert rahul_result["score"] == 8
    assert rahul_result["percentage"] == 80.0
    print(f"Rahul score: {rahul_result['score']}/{rahul_result['total_questions']}")

    print("\n--- 6. Checking Public Leaderboard ---")
    res = client.get(f"/api/quizzes/{share_code}/results")
    assert res.status_code == 200
    leaderboard = res.json()
    assert len(leaderboard) == 2
    assert leaderboard[0]["friend_name"] == "Sioli"
    assert leaderboard[0]["rank"] == 1
    assert leaderboard[1]["friend_name"] == "Rahul"
    assert leaderboard[1]["rank"] == 2
    print(f"Leaderboard verified: Rank 1: {leaderboard[0]['friend_name']} (Score: {leaderboard[0]['score']}), Rank 2: {leaderboard[1]['friend_name']} (Score: {leaderboard[1]['score']})")

    print("\n--- 7. Checking Creator Dashboard Analytics ---")
    res = client.get(f"/api/quizzes/{share_code}/dashboard?token={creator_token}")
    assert res.status_code == 200
    dashboard = res.json()
    assert dashboard["total_attempts"] == 2
    assert dashboard["highest_score"] == 10
    assert dashboard["perfect_score_count"] == 1
    assert dashboard["average_score"] == 9.0
    assert len(dashboard["question_stats"]) == 10
    print(f"Creator Dashboard verified: Total Attempts: {dashboard['total_attempts']}, Average: {dashboard['average_score']}, Highest: {dashboard['highest_score']}")

    print("\nALL WORKFLOW TESTS PASSED SUCCESSFULLY! 🚀")

if __name__ == "__main__":
    test_full_quiz_workflow()

