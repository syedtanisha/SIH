import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  FileText, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Building2, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  Layers,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { finalInterviewApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function FinalInterviewPage() {
  const { user } = useAuth();
  const [readiness, setReadiness] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [evaluating, setEvaluating] = useState(false);
  const [answers, setAnswers] = useState([]);

  // Final Report State
  const [report, setReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    try {
      setLoading(true);
      const response = await finalInterviewApi.getReadiness();
      setReadiness(response.data);
    } catch (err) {
      console.error('Final interview readiness error:', err);
      setError('Unable to load final interview readiness.');
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    try {
      setGenerating(true);
      setError('');
      const response = await finalInterviewApi.generateQuestions();
      if (response.data.eligible) {
        setQuestions(response.data.questions || []);
        setCurrentQuestion(0);
        setAnswer('');
        setEvaluation(null);
        setAnswers([]);
        setReport(null);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Final interview generation error:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Unable to generate the final interview.');
      }
    } finally {
      setGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) {
      setError('Please provide a substantive answer before submitting for AI evaluation.');
      return;
    }

    const q = questions[currentQuestion];

    try {
      setEvaluating(true);
      setError('');
      setEvaluation(null);

      const response = await finalInterviewApi.evaluateAnswer({
        question: q.question,
        answer: answer.trim(),
        competency: q.competency_code || q.code || 'STAT_SURVEY',
        domain: q.domain || 'Official Statistics',
        difficulty: q.difficulty || 'Intermediate',
      });

      const evalData = response.data;
      setEvaluation(evalData);

      const newRecord = {
        question: q.question,
        answer: answer.trim(),
        competency: q.competency_code || q.code || 'STAT_SURVEY',
        domain: q.domain || 'Official Statistics',
        score: evalData.score || 7,
        evaluation: evalData.evaluation || '',
        strengths: evalData.strengths || [],
        weaknesses: evalData.weaknesses || []
      };

      setAnswers((prev) => [...prev, newRecord]);
    } catch (err) {
      console.error('Answer evaluation error:', err);
      setError('Unable to evaluate your answer at this moment.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextOrFinish = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setAnswer('');
      setEvaluation(null);
      setError('');
    } else {
      // Final question answered -> Generate Comprehensive AI Report!
      await generateFinalReport();
    }
  };

  const generateFinalReport = async () => {
    try {
      setGeneratingReport(true);
      setError('');
      const res = await finalInterviewApi.generateReport({ results: answers });
      setReport(res.data);
    } catch (err) {
      console.error('Report generation error:', err);
      setError('Failed to generate full AI interview synthesis report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const restartInterview = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswer('');
    setEvaluation(null);
    setAnswers([]);
    setReport(null);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-2">
          <RefreshCw className="w-8 h-8 text-mospi-800 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">
            Verifying official competency benchmarks...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: COMPREHENSIVE AI FINAL INTERVIEW REPORT & AUDIT
  // -------------------------------------------------------------
  if (report) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Certificate Header Banner */}
        <div className="bg-gradient-to-r from-mospi-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-amber-400/30">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Award className="w-80 h-80" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 px-3 py-1 rounded-full">
                MoSPI • NSSTA Official Cadre Certification
              </span>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Assessment Complete
              </span>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save Report
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Final Interview Evaluation & Capacity Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Evaluated Candidate: <strong className="text-amber-300">{user?.full_name || 'Statistical Officer'}</strong> • {user?.designation || 'Statistical Cadre'} ({user?.department || 'MoSPI'})
            </p>
          </div>

          {/* Rating Summary Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Overall Rating</span>
              <p className="text-3xl font-black text-amber-400 mt-0.5">
                {report.overall_score_out_of_10} <span className="text-sm font-normal text-slate-400">/ 10</span>
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Cadre Grade</span>
              <p className="text-sm sm:text-base font-bold text-white mt-1.5">
                {report.cadre_grade.split('—')[0]}
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Readiness Index</span>
              <p className="text-3xl font-black text-emerald-400 mt-0.5">
                {report.readiness_percentage}%
              </p>
            </div>
            <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Questions Evaluated</span>
              <p className="text-3xl font-black text-blue-300 mt-0.5">
                {report.total_questions}
              </p>
            </div>
          </div>
        </div>

        {/* AI Executive Synthesis Narrative */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-mospi-800">
            <Sparkles className="w-4 h-4 text-amber-500" /> AI Executive Synthesis & Capacity Diagnosis
          </div>
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-5 text-slate-800 text-xs sm:text-sm leading-relaxed space-y-2">
            <p className="font-medium">
              {report.ai_executive_synthesis}
            </p>
          </div>
        </div>

        {/* Domain-by-Domain Mastery Progress */}
        {report.domain_breakdown?.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-mospi-800" /> Domain Competency Mastery Breakdown
              </h2>
              <span className="text-xs text-slate-500">Ministry Benchmark: ≥ 70%</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {report.domain_breakdown.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span>{item.domain}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      item.score >= 80 ? 'bg-emerald-100 text-emerald-900' : 'bg-blue-100 text-blue-900'
                    }`}>
                      {item.score}% • {item.status}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        item.score >= 80 ? 'bg-emerald-600' : 'bg-mospi-800'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths and Action Items 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Master Strengths */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Verified Cadre Strengths
            </h2>
            <ul className="space-y-2.5">
              {report.master_strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                  <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Priority Action Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Priority Capacity Recommendations
            </h2>
            <ul className="space-y-2.5">
              {report.master_areas_to_improve.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-amber-50/40 p-3 rounded-lg border border-amber-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                  <span className="leading-snug">{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Question-by-Question Transcript */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-mospi-800" /> Comprehensive Interview Question Transcript
          </h2>

          <div className="space-y-3 pt-2">
            {answers.map((rec, idx) => {
              const isExpanded = expandedQuestion === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-mospi-900 text-white flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-mospi-700 bg-white px-2 py-0.5 rounded border border-slate-200 uppercase">
                          {rec.domain}
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                          {rec.question}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        {rec.score}/10
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 space-y-3 text-xs border-t border-slate-200 bg-white">
                      <div>
                        <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Your Response:</span>
                        <p className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 mt-1 italic leading-relaxed">
                          "{rec.answer}"
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-blue-900 uppercase tracking-wider text-[10px]">AI Evaluation:</span>
                        <p className="text-slate-700 mt-0.5 leading-relaxed">
                          {rec.evaluation}
                        </p>
                      </div>

                      {rec.strengths?.length > 0 && (
                        <div>
                          <span className="font-bold text-emerald-800 uppercase tracking-wider text-[10px]">Recognized Strengths:</span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5 mt-1">
                            {rec.strengths.map((s, sIdx) => <li key={sIdx}>{s}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <button
            onClick={restartInterview}
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
          >
            Retake Interview
          </button>

          <div className="flex items-center gap-3">
            <Link
              to="/learning-path"
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition cursor-pointer"
            >
              Return to Learning Path
            </Link>
            <Link
              to="/progress"
              className="px-6 py-2.5 rounded-xl bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              View Progress Dashboard →
            </Link>
          </div>
        </div>

      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: INTERVIEW QUESTION WORKFLOW
  // -------------------------------------------------------------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-mospi-800 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Official Cadre Assessment
          </span>
          {readiness && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              Readiness: {readiness.readiness_score}%
            </span>
          )}
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          AI Adaptive Final Interview
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Demonstrate comprehensive competency mastery across India's Official Statistical System in this AI-evaluated interview. Answers are assessed in real-time on methodology, precision, and practical governance application.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Welcome / Start Interview */}
      {!questions.length && (
        <div className="bg-gradient-to-br from-slate-900 via-mospi-900 to-indigo-950 rounded-2xl p-8 text-white space-y-6 shadow-xl">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-amber-300">
              Ready to Begin Your Capstone Assessment?
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              The AI will generate 5 adaptive interview questions across National Accounts, Survey Sampling, Price Indices, Official Microdata Computing, and UN NQAF standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-amber-300">1. Adaptive Questions</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Calibrated to your designated division and level.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-amber-300">2. Instant AI Feedback</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Actionable evaluation on strengths and methodology.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
              <span className="font-bold text-amber-300">3. Full Cadre Report</span>
              <p className="text-[11px] text-slate-400 mt-0.5">Certified rating out of 10 and domain audit.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startInterview}
              disabled={generating}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Calibrated Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Start AI Final Interview</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Question Box */}
      {questions.length > 0 && currentQuestion < questions.length && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-mospi-800 uppercase tracking-wider">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-slate-500">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-mospi-900 h-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-mospi-900 text-white px-2 py-0.5 rounded">
                {questions[currentQuestion].domain || 'Official Statistics'}
              </span>
              <span className="text-[10px] font-semibold bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded">
                {questions[currentQuestion].difficulty || 'Intermediate'}
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {questions[currentQuestion].question}
            </h3>
          </div>

          {/* Answer Input */}
          {!evaluation && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Professional Explanation / Answer:
              </label>

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                placeholder="Explain the concepts, standard definitions, formulas, and practical MoSPI application as you would in a senior cadre interview..."
                className="w-full rounded-xl border border-slate-300 p-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-mospi-800 resize-none shadow-inner"
                disabled={evaluating}
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Word count: {answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span>
                <span>Provide specific definitions and formulas for maximum score</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={submitAnswer}
                  disabled={evaluating || !answer.trim()}
                  className="px-6 py-3 rounded-xl bg-mospi-900 hover:bg-mospi-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {evaluating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>AI Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Submit Answer for AI Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* AI Evaluation Box */}
          {evaluation && (
            <div className="space-y-4 pt-2 animate-in fade-in duration-150">
              <div className={`p-5 rounded-2xl border space-y-3 ${
                evaluation.score <= 3
                  ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                  : evaluation.score >= 8
                  ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                  : 'bg-blue-50/90 border-blue-200 text-blue-950'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    evaluation.score <= 3 ? 'text-rose-900' : (evaluation.score >= 8 ? 'text-emerald-900' : 'text-blue-900')
                  }`}>
                    {evaluation.score <= 3 ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>AI Diagnostic: Needs Remediation</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>AI Evaluation Feedback</span>
                      </>
                    )}
                  </span>
                  <span className={`text-sm font-black px-3 py-1 rounded-full ${
                    evaluation.score <= 3
                      ? 'bg-rose-100 text-rose-950 border border-rose-300'
                      : evaluation.score >= 8
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-blue-100 text-blue-950 border border-blue-300'
                  }`}>
                    {evaluation.score} / 10 Score
                  </span>
                </div>

                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  {evaluation.evaluation}
                </p>

                {/* Next Difficulty Hint */}
                {evaluation.next_difficulty && (
                  <div className="text-[11px] font-semibold bg-white/80 px-2.5 py-1 rounded-md border border-slate-200 text-slate-800 inline-block">
                    Adaptive Question Level: <span className="font-bold">{evaluation.next_difficulty}</span>
                  </div>
                )}
              </div>

              {/* Strengths */}
              {evaluation.strengths?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Specific Technical Strengths:
                  </span>
                  <div className="space-y-1.5">
                    {evaluation.strengths.map((str, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100 text-xs text-slate-800 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas to Improve */}
              {evaluation.weaknesses?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Points for Further Precision:
                  </span>
                  <div className="space-y-1.5">
                    {evaluation.weaknesses.map((weak, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100 text-xs text-slate-800 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                        <span>{weak}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Advance Button */}
              <div className="pt-3">
                <button
                  onClick={handleNextOrFinish}
                  disabled={generatingReport}
                  className="px-6 py-3 rounded-xl bg-mospi-900 hover:bg-mospi-800 text-white font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  {generatingReport ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                      <span>Synthesizing Full AI Report...</span>
                    </>
                  ) : currentQuestion < questions.length - 1 ? (
                    <>
                      <span>Proceed to Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Complete Interview & Generate AI Capacity Report</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
