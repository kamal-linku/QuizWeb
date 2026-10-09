import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import QuizReady from './pages/QuizReady';
import TakeQuiz from './pages/TakeQuiz';
import Result from './pages/Result';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0b0f19] text-slate-100 selection:bg-purple-500 selection:text-white antialiased">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateQuiz />} />
            <Route path="/ready/:shareCode" element={<QuizReady />} />
            <Route path="/quiz/:shareCode" element={<TakeQuiz />} />
            <Route path="/quiz/:shareCode/result" element={<Result />} />
            <Route path="/dashboard/:shareCode" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
