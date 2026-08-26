import React, { useEffect, useState } from 'react';
import { finalInterviewApi } from '../services/api';

export function FinalInterviewPage() {
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
      setError('Please provide an answer before continuing.');
      return;
    }

    const question = questions[currentQuestion];

    try {
      setEvaluating(true);
      setError('');
      setEvaluation(null);

      const response = await finalInterviewApi.evaluateAnswer({
        question: question.question,
        answer: answer.trim(),
        competency:
          question.competency_code ||
          question.code ||
          '',
        domain: question.domain || '',
        difficulty: question.difficulty || '',
      });

      setEvaluation(response.data);

      setAnswers((prev) => [
        ...prev,
        {
          question: question.question,
          answer: answer.trim(),
          evaluation: response.data,
        },
      ]);
    } catch (err) {
      console.error('Answer evaluation error:', err);

      if (err.response?.status === 404) {
        setError(
          'The answer evaluation endpoint is not available in the backend yet.'
        );
      } else if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError('Unable to evaluate your answer.');
      }
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
    setAnswer('');
    setEvaluation(null);
    setError('');
  };

  const restartInterview = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswer('');
    setEvaluation(null);
    setAnswers([]);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">
          Preparing your final assessment...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          FINAL ASSESSMENT
        </p>

        <h1 className="text-3xl font-bold text-slate-900 mt-2">
          AI Final Interview
        </h1>

        <p className="text-slate-600 mt-2 max-w-2xl">
          Complete your learning journey and demonstrate your overall
          statistical competency through an AI-powered professional
          interview.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Readiness Cards */}
      {readiness && !questions.length && (
        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">
              Overall Readiness
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {readiness.readiness_score}%
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">
              Competencies
            </p>

            <p className="text-3xl font-bold text-slate-900 mt-2">
              {readiness.competencies_to_assess?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <p className="text-sm text-slate-500">
              Interview Status
            </p>

            <p className="text-lg font-semibold text-slate-900 mt-3">
              {readiness.eligible
                ? 'Ready to Start'
                : 'Learning Required'}
            </p>
          </div>

        </div>
      )}

      {/* Competencies */}
      {readiness?.competencies_to_assess?.length > 0 &&
        !questions.length && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8">

            <h2 className="text-lg font-semibold text-slate-900">
              Competencies to be assessed
            </h2>

            <div className="mt-4 space-y-3">
              {readiness.competencies_to_assess
                .slice(0, 5)
                .map((competency) => (
                  <div
                    key={competency.competency_id}
                    className="flex items-center justify-between border-b border-slate-100 pb-3"
                  >
                    <div>
                      <p className="font-medium text-slate-800">
                        {competency.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {competency.domain}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {competency.current_score}%
                      </p>

                      <p className="text-xs text-slate-500">
                        Gap: {competency.gap}%
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

      {/* Start Interview */}
      {!questions.length && (
        <div className="bg-slate-900 rounded-2xl p-8 text-white">

          <h2 className="text-2xl font-semibold">
            Ready for your final assessment?
          </h2>

          <p className="text-slate-300 mt-2 max-w-2xl">
            The AI will generate professional interview questions based
            on your competency profile and learning gaps.
          </p>

          <button
            onClick={startInterview}
            disabled={!readiness?.eligible || generating}
            className="mt-6 px-6 py-3 rounded-lg bg-white text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating
              ? 'Generating Interview...'
              : 'Start AI Interview'}
          </button>

        </div>
      )}

      {/* Active Interview */}
      {questions.length > 0 &&
        currentQuestion < questions.length && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">

            {/* Interview Header */}
            <div className="flex items-center justify-between mb-6">

              <div>
                <p className="text-sm font-semibold text-blue-600">
                  AI FINAL INTERVIEW
                </p>

                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
              </div>

              <span className="text-sm font-medium text-slate-500">
                {Math.round(
                  ((currentQuestion + 1) / questions.length) * 100
                )}
                % Complete
              </span>

            </div>

            {/* Progress */}
            <div className="w-full h-2 bg-slate-100 rounded-full mb-8">
              <div
                className="h-2 bg-blue-600 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>

            {/* Question */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">

              <div className="flex items-start gap-4">

                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">
                  {currentQuestion + 1}
                </span>

                <div className="flex-1">

                  <p className="text-lg font-semibold text-slate-900 leading-relaxed">
                    {questions[currentQuestion].question}
                  </p>

                  <div className="flex gap-3 mt-4 text-xs text-slate-500">

                    <span>
                      {questions[currentQuestion].domain}
                    </span>

                    <span>•</span>

                    <span>
                      {questions[currentQuestion].difficulty}
                    </span>

                  </div>

                </div>
              </div>

              {/* Answer */}
              {!evaluation && (
                <div className="mt-8">

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Your Answer
                  </label>

                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    rows={7}
                    placeholder="Explain your answer as you would in a professional interview..."
                    className="w-full rounded-xl border border-slate-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    disabled={evaluating}
                  />

                  <button
                    onClick={submitAnswer}
                    disabled={evaluating || !answer.trim()}
                    className="mt-4 px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {evaluating
                      ? 'AI Evaluating...'
                      : 'Submit Answer'}
                  </button>

                </div>
              )}

              {/* Evaluation */}
              {evaluation && (
                <div className="mt-8 space-y-5">

                  <div className="rounded-xl bg-blue-50 border border-blue-200 p-5">

                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                      AI Evaluation
                    </p>

                    {evaluation.score !== undefined && (
                      <div className="flex items-center gap-3 mt-2">

                        <span className="text-3xl font-bold text-slate-900">
                          {evaluation.score}/10
                        </span>

                        <span className="text-sm text-slate-500">
                          Interview Score
                        </span>

                      </div>
                    )}

                    {evaluation.evaluation && (
                      <p className="text-sm text-slate-700 mt-4 leading-relaxed">
                        {evaluation.evaluation}
                      </p>
                    )}

                    {evaluation.feedback && (
                      <p className="text-sm text-slate-700 mt-4 leading-relaxed">
                        {evaluation.feedback}
                      </p>
                    )}

                  </div>

                  {/* Strengths */}
                  {evaluation.strengths?.length > 0 && (
                    <div>

                      <h3 className="font-semibold text-emerald-700">
                        Strengths
                      </h3>

                      <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                        {evaluation.strengths.map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>

                    </div>
                  )}

                  {/* Weaknesses */}
                  {evaluation.weaknesses?.length > 0 && (
                    <div>

                      <h3 className="font-semibold text-red-700">
                        Areas to Improve
                      </h3>

                      <ul className="mt-2 list-disc list-inside text-sm text-slate-600 space-y-1">
                        {evaluation.weaknesses.map((item, index) => (
                          <li key={index}>
                            {item}
                          </li>
                        ))}
                      </ul>

                    </div>
                  )}

                  {/* Next */}
                  {currentQuestion < questions.length - 1 ? (
                    <button
                      onClick={nextQuestion}
                      className="px-6 py-3 rounded-lg bg-slate-900 text-white font-semibold"
                    >
                      Next Question
                    </button>
                  ) : (
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5">

                      <h3 className="font-semibold text-emerald-800">
                        Interview Completed
                      </h3>

                      <p className="text-sm text-emerald-700 mt-1">
                        You have completed all interview questions.
                      </p>

                      <button
                        onClick={restartInterview}
                        className="mt-4 px-5 py-2 rounded-lg bg-emerald-700 text-white text-sm font-semibold"
                      >
                        Start Again
                      </button>

                    </div>
                  )}

                </div>
              )}

            </div>
          </div>
        )}

    </div>
  );
}