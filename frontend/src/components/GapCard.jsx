import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

export const GapCard = ({ gapItem }) => {
  const {
    name,
    domain,
    current_level,
    required_level,
    gap,
    priority,
    recommended_focus_action,
  } = gapItem;

  const getPriorityStyle = (p) => {
    switch (p) {
      case 'High':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          bar: 'bg-rose-500',
          text: 'text-rose-700',
        };
      case 'Medium':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          bar: 'bg-amber-500',
          text: 'text-amber-700',
        };
      case 'Low':
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          bar: 'bg-blue-500',
          text: 'text-blue-700',
        };
      default:
        return {
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          bar: 'bg-emerald-500',
          text: 'text-emerald-700',
        };
    }
  };

  const style = getPriorityStyle(priority);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {domain}
              </span>
              {gapItem.is_role_core && (
                <span className="text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded">
                  Core Role Requirement
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug mt-0.5">
              {name}
            </h3>
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${style.badge}`}>
            {priority === 'Met' ? 'Benchmark Met' : `${priority} Priority`}
          </span>
        </div>

        {/* Progress Bar & Gap Math */}
        <div className="space-y-2 my-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600 font-medium">Current Proficiency</span>
            <span className="font-bold text-slate-900">{current_level}%</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
              style={{ width: `${Math.min(100, current_level)}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
            <span>Required Benchmark: <strong className="text-slate-700">{required_level}%</strong></span>
            {gap > 0 ? (
              <span className={`font-bold ${style.text}`}>
                Competency Gap: {gap}%
              </span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Fully Met
              </span>
            )}
          </div>
        </div>

        {/* Action Recommendation */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          <strong className="text-slate-800">Action:</strong> {recommended_focus_action}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
        <Link
          to={`/recommendations?gap=${encodeURIComponent(name)}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-medium transition shadow-sm"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Recommended Training</span>
        </Link>
        <Link
          to={`/studio?topic=${encodeURIComponent(name)}`}
          className="inline-flex items-center justify-center p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-medium transition"
          title="Generate AI Quiz"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
