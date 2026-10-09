# 🌟 How Well Do You Know Me? — Full-Stack Buddy Quiz Platform

A modern, full-stack web application where anyone can create a personalized 10-question quiz about themselves, share a unique link with friends, and find out who really knows them best through live leaderboards and analytics!

---

## ✨ Features

### 👤 1. Quiz Creator Experience
- **Name Entry & Setup**: Fast and simple onboarding.
- **10 Pre-loaded Questions**: Includes 10 buddy questions with emojis (and customization support).
- **Text & Emoji Options**: Options are pure, interactive text cards with responsive grid layout (as specified: no image upload complexity).
- **Correct Answer Picker**: Creator selects their true answer for each question.
- **Unique Shareable Link**: Generates short 6-character unique codes (e.g., `a8K29x`) and copyable links.
- **Instant WhatsApp Sharing**: Pre-formatted WhatsApp share link to challenge friend circles.
- **Creator Dashboard**: Private access via secret creator token to monitor:
  - Total Attempts
  - Average Score & Highest Score
  - 10/10 Perfect matches
  - Full friends leaderboard
  - Question-by-question accuracy %

### 👥 2. Friend / Quiz Taker Experience
- **Sleek Intro Screen**: Welcome hero stating "How well do you know [Name]? Let's find out 👀".
- **Step-by-Step Question Interface**: Smooth animated cards, progress bar, and 1..10 step indicators.
- **🔐 Strict Security Rule**: Correct answers are **NEVER** sent to the client during the quiz. Friends cannot inspect the browser payload to cheat.
- **Instant Result & Confetti**:
  - Score Badge & percentage (e.g. `8 / 10 = 80%`).
  - Humorous score-based quotes (10/10 Twin, 8-9/10 Best friend, 6-7/10 Good buddy, 4-5/10 Do you even talk?, 0-3/10 Stranger danger).
  - WhatsApp share button ("I scored 8/10 on How Well Do You Know Kamal? Think you can beat me?").
  - Detailed breakdown revealing what they answered vs actual correct answers.
  - Live Ranked Leaderboard (🥇, 🥈, 🥉 medals).

---

## 🛠️ Technology Stack

- **Frontend**:
  - [React](https://react.dev/) + [Vite](https://vitejs.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/) (Smooth slide transitions)
  - [Lucide React](https://lucide.dev/) (Icons)
  - [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
  - [Axios](https://axios-http.com/)
  - [React Router DOM v7](https://reactrouter.com/)

- **Backend**:
  - [Python 3.10+](https://www.python.org/)
  - [FastAPI](https://fastapi.tiangolo.com/)
  - [SQLAlchemy 2.0](https://www.sqlalchemy.org/)
  - [SQLite](https://sqlite.org/) (Zero-setup database)
  - [Pydantic v2](https://docs.pydantic.dev/)
  - [Uvicorn](https://www.uvicorn.org/)

---

## 📁 Project Structure

```
QuizWeb/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py         # App configuration & CORS
│   │   │   └── database.py       # SQLAlchemy engine & session
│   │   ├── models/
│   │   │   └── models.py         # Quiz, Question, Option, Attempt ORM models
│   │   ├── schemas/
│   │   │   └── schemas.py        # Pydantic schemas (with security separation)
│   │   ├── routes/
│   │   │   ├── quizzes.py        # Quiz creation & public viewing endpoints
│   │   │   ├── attempts.py       # Submission scoring & public leaderboards
│   │   │   └── dashboard.py      # Creator analytics dashboard endpoint
│   │   ├── services/
│   │   │   ├── quiz_service.py   # Business logic, score calculations
│   │   │   └── default_questions.py # 10 default questions & funny quotes
│   │   └── main.py               # FastAPI entry point
│   ├── tests/
│   │   └── test_quiz_flow.py     # E2E integration test suite
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, OptionCard, ProgressBar, LeaderboardTable, ConfettiEffect
│   │   ├── pages/                # Home, CreateQuiz, QuizReady, TakeQuiz, Result, Dashboard
│   │   ├── services/             # api.js Axios client
│   │   ├── data/                 # defaultTemplates.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Port 8000)
```bash
# In the root directory (D:\MyProjects\QuizWeb)
.\venv\Scripts\uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```
API will run at `http://localhost:8000` (Interactive API docs at `http://localhost:8000/docs`).

### 2. Start the Frontend App (Port 5173)
```bash
# In another terminal
cd frontend
npm run dev
```
Frontend will run at `http://localhost:5173`.

### 3. Run Integration Tests
```bash
.\venv\Scripts\python backend\tests\test_quiz_flow.py
```

---

## 🔒 Security Architecture
- The public quiz endpoint (`GET /api/quizzes/{share_code}`) strips `correct_option_id` before returning to the browser.
- Submissions (`POST /api/quizzes/{share_code}/submit`) are scored exclusively on the server against the database.
- Private creator dashboards require the `creator_token` provided during quiz creation.

