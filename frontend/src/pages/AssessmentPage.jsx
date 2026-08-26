import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi } from '../services/api';
import { Award, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const AssessmentPage = () => {
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const res = await assessmentApi.getBaseline();
        setAssessment(res.data);
      } catch (err) {
        console.error("Error loading baseline assessment:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, []);

  const handleSelectOption = (questionId, key) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: key,
    });
  };

  const handleSubmit = async () => {
    if (!assessment) return;
    setSubmitting(true);
    try {
      const answersPayload = assessment.questions.map((q) => ({
        question_id: q.id,
        selected_option: selectedAnswers[q.id] || '',
      }));

      const res = await assessmentApi.submitBaseline(answersPayload);
      setResult(res.data);
    } catch (err) {
      console.error("Error submitting baseline test:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading baseline diagnostic questions...
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Baseline Assessment Complete!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            {result.feedback_summary}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Overall Score</span>
              <p className="text-2xl font-black text-slate-900">{result.overall_score}%</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-500 font-medium">Correct Answers</span>
              <p className="text-2xl font-black text-emerald-600">{result.total_correct} / {result.total_questions}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-medium">Competencies Calibrated</span>
              <p className="text-2xl font-black text-mospi-800">{result.initialized_competencies_count}</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => navigate('/gap-analysis')}
              className="px-6 py-3 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow transition flex items-center justify-center gap-2"
            >
              <span>View Competency Gap Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIdx];
  const progressPct = Math.round(((currentIdx + 1) / questions.length) * 100);
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
          <Award className="w-4 h-4 text-mospi-800" />
          <span>Baseline Diagnostic Test</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-slate-500 font-medium">
            Question {currentIdx + 1} of {questions.length}
          </span>
          <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200 font-semibold flex items-center gap-1">
            <Clock className="w-3 h-3" /> 20 Mins
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-mospi-900 h-full transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-mospi-700 bg-mospi-50 px-2.5 py-1 rounded border border-mospi-200">
              {currentQ.domain} • {currentQ.competency_name}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              Difficulty: {currentQ.difficulty}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
            {currentIdx + 1}. {currentQ.question_text}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
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

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition"
            >
              Previous
            </button>

            <div className="flex items-center gap-2">
              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  className="px-5 py-2.5 bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold rounded-lg shadow-sm transition"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting || answeredCount === 0}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                >
                  {submitting ? 'Evaluating...' : 'Submit Baseline Assessment'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
