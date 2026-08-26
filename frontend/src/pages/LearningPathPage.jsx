import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layers, CheckCircle2, Circle, ArrowRight, BookOpen, Sparkles, Award } from 'lucide-react';

export const LearningPathPage = () => {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: "Step 1: Baseline Diagnostic Assessment",
      domain: "Calibration",
      desc: "Complete the 8-question calibrated diagnostic test to establish initial benchmark levels across all 9 statistical competencies.",
      link: "/assessment",
      linkText: "Take Assessment",
      completed: true,
    },
    {
      id: 2,
      title: "Step 2: Review Competency Gap Analysis",
      domain: "Diagnostics",
      desc: "Inspect priority-ranked gaps ($Required - Current = Gap$) and review the AI capacity prescription for your cadre.",
      link: "/gap-analysis",
      linkText: "View Gap Matrix",
      completed: true,
    },
    {
      id: 3,
      title: "Step 3: iGOT Karmayogi Competency Building Products (CBPs)",
      domain: "Foundations",
      desc: "Enroll and complete the recommended online modules for Survey Methodology and National Accounts on iGOT Karmayogi.",
      link: "/hub?tab=igot",
      linkText: "Browse iGOT Courses",
      completed: false,
    },
    {
      id: 4,
      title: "Step 4: NSSTA Digital Data Lab & Practical Computing",
      domain: "Applied Skills",
      desc: "Review laboratory manuals on Python/R for microdata weight expansion, variance estimation, and statistical disclosure control.",
      link: "/hub?tab=nssta",
      linkText: "Access NSSTA Modules",
      completed: false,
    },
    {
      id: 5,
      title: "Step 5: AI Learning Studio Document Quiz Ingestion",
      domain: "AI Assessment",
      desc: "Upload MoSPI survey reports or PLFS methodology notes to generate schema-enforced verification quizzes.",
      link: "/studio",
      linkText: "Open AI Studio",
      completed: false,
    },
    {
      id: 6,
      title: "Step 6: Verified Competency Delta Calibration",
      domain: "Outcome",
      desc: "Score ≥ 75% on generated quizzes to trigger the closed-loop delta update and record demonstrable skill growth (+26%).",
      link: "/progress",
      linkText: "Check Progress Delta",
      completed: false,
    },
    {
  id: 7,
  title: "Step 7: AI Final Interview",
  domain: "Final Assessment",
  desc: "Complete an AI-powered professional interview to demonstrate your overall statistical competency after completing the learning journey.",
  link: "/final-interview",
  linkText: "Start Final Interview",
  completed: false,
},
  ]);

  const toggleComplete = (id) => {
    setMilestones(
      milestones.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPct = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-mospi-800 uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Capacity Roadmap
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
            {progressPct}% Completed
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Structured Official Statistical Learning Path
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
          Follow this 6-stage milestone progression to systematically bridge identified competency gaps and demonstrate verified skill gains across India's Official Statistical System.
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
          <div
            className="bg-mospi-900 h-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className={`rounded-2xl border p-6 transition flex flex-col sm:flex-row items-start justify-between gap-4 ${
              m.completed
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleComplete(m.id)}
                className="mt-1 flex-shrink-0 text-slate-400 hover:text-emerald-600 transition"
              >
                {m.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-mospi-700 bg-mospi-50 px-2 py-0.5 rounded border border-mospi-200">
                  {m.domain}
                </span>
                <h3 className={`text-sm font-bold ${m.completed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                  {m.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                  {m.desc}
                </p>
              </div>
            </div>

            <Link
              to={m.link}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                m.completed
                  ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                  : 'bg-mospi-900 text-white hover:bg-mospi-800 shadow-sm'
              }`}
            >
              <span>{m.linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
