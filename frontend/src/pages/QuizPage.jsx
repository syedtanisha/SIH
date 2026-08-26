import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, Flag, HelpCircle } from 'lucide-react';
import { CompetencyDeltaBanner } from '../components/CompetencyDeltaBanner';

export const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await quizApi.getById(id);
        setQuiz(res.data);
      } catch (err) {
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectOption = (questionId, key) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: key });
  };

  const toggleFlag = (questionId) => {
    setFlagged({ ...flagged, [questionId]: !flagged[questionId] });
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const answersPayload = quiz.questions.map((q) => ({
        question_id: q.id,
        selected_option: selectedAnswers[q.id] || '',
      }));

      const res = await quizApi.submit(id, answersPayload);
      setResult(res.data);
    } catch (err) {
      console.error("Error submitting quiz:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading AI Generated Assessment...
      </div>
    );
  }

  // Result View
  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Delta Gain Banner */}
        <CompetencyDeltaBanner
          competencyName={result.competency_name}
          beforeScore={result.competency_score_before}
          afterScore={result.competency_score_after}
          delta={result.competency_delta}
          quizTitle={result.quiz_title}
        />

        {/* Score Breakdown Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{result.quiz_title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">Evaluation Results & Pedagogical Explanations</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                {result.score}%
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                {result.total_correct} of {result.total_questions} Correct
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/70 leading-relaxed">
            {result.ai_qualitative_feedback}
          </p>

          {/* Question Review List */}
          <div className="space-y-4 pt-4">
            <h3 className="text-sm font-bold text-slate-900">Question-by-Question Analysis</h3>
            {result.question_results.map((q, idx) => (
              <div
                key={q.question_id}
                className={`p-5 rounded-xl border text-xs space-y-2 ${
                  q.is_correct
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-rose-50/40 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 leading-snug">
                    {idx + 1}. {q.question_text}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    q.is_correct ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {q.is_correct ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500">Your Selection: </span>
                    <strong className={q.is_correct ? 'text-emerald-700' : 'text-rose-700'}>
                      Option {q.user_selected}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Correct Option: </span>
                    <strong className="text-emerald-700">Option {q.correct_option}</strong>
                  </div>
                </div>

                <div className="bg-white/80 p-3 rounded-lg border border-slate-200/60 mt-2 text-slate-700 leading-relaxed text-[11px]">
                  <strong className="text-slate-900">Pedagogical Explanation:</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-3 justify-end">
            <button
              onClick={() => navigate('/progress')}
              className="px-5 py-2.5 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow-sm transition"
            >
              View Progress Delta
            </button>
            <button
              onClick={() => navigate('/studio')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Back to AI Studio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const questions = quiz?.questions || [];
  const currentQ = questions[currentIdx];
  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-mospi-700 tracking-wider">AI Evaluation</span>
          <h2 className="text-sm font-bold text-slate-900">{quiz.title}</h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> {quiz.time_limit_mins}m
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div className="bg-mospi-900 h-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Question Box */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {currentQ && (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Difficulty: {currentQ.difficulty}
                </span>
                <button
                  onClick={() => toggleFlag(currentQ.id)}
                  className={`text-xs flex items-center gap-1 font-semibold transition ${
                    flagged[currentQ.id] ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>{flagged[currentQ.id] ? 'Flagged for Review' : 'Flag Question'}</span>
                </button>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
                {currentIdx + 1}. {currentQ.question_text}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {[
                  { key: 'A', text: currentQ.option_a },
                  { key: 'B', text: currentQ.option_b },
                  { key: 'C', text: currentQ.option_c },
                  { key: 'D', text: currentQ.option_d },
                ].map((opt) => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(currentQ.id, opt.key)}
                      className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition flex items-start gap-3 ${
                        isSelected
                          ? 'border-mospi-900 bg-mospi-50/70 text-mospi-950 shadow-sm ring-1 ring-mospi-900'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          isSelected
                            ? 'bg-mospi-900 text-white'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="mt-0.5 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  disabled={currentIdx === 0}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-2">
                  {currentIdx < questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentIdx(currentIdx + 1)}
                      className="px-5 py-2.5 bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting || answeredCount === 0}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                      {submitting ? 'Evaluating Quiz...' : 'Submit & Recalibrate Competency'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Question Palette */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Question Palette</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const isAnswered = !!selectedAnswers[q.id];
              const isFlag = !!flagged[q.id];
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-9 rounded-lg text-xs font-bold transition flex items-center justify-center relative ${
                    isCurrent
                      ? 'ring-2 ring-mospi-900 bg-mospi-900 text-white'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                  {isFlag && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Answered ({answeredCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" /> Unanswered ({questions.length - answeredCount})
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400" /> Flagged for Review
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
