import React from 'react';
import { TrendingUp, Award, CheckCircle2, ArrowRight } from 'lucide-react';

export const CompetencyDeltaBanner = ({
  competencyName,
  beforeScore,
  afterScore,
  delta,
  quizTitle,
}) => {
  return (
    <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 shadow-lg border border-mospi-700/50 mb-8 relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 bottom-0 w-32 h-32 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-mospi-700/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400 text-slate-900 font-bold">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                Measurable Capacity Gain Verified
              </span>
              <h2 className="text-base font-bold text-white">
                Competency Progression: {competencyName || 'Statistical Discipline'}
              </h2>
            </div>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" /> Evaluated via {quizTitle || 'AI Quiz'}
          </span>
        </div>

        {/* Delta Progression Numbers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center my-2">
          {/* Before */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-3.5 border border-white/10">
            <p className="text-xs text-slate-300 font-medium mb-1">Pre-Learning Benchmark</p>
            <p className="text-2xl font-black text-slate-200">{beforeScore}%</p>
            <span className="text-[10px] text-slate-400">Initial Assessment</span>
          </div>

          {/* Delta Gain */}
          <div className="bg-amber-500/20 backdrop-blur rounded-xl p-3.5 border border-amber-400/40 relative">
            <p className="text-xs text-amber-300 font-bold mb-1">Learning Delta Gain</p>
            <p className="text-3xl font-black text-amber-400">+{delta}%</p>
            <span className="text-[10px] text-amber-200 font-medium">Demonstrated Improvement</span>
          </div>

          {/* After */}
          <div className="bg-emerald-500/10 backdrop-blur rounded-xl p-3.5 border border-emerald-400/30">
            <p className="text-xs text-emerald-300 font-medium mb-1">Updated Competency Level</p>
            <p className="text-2xl font-black text-emerald-400">{afterScore}%</p>
            <span className="text-[10px] text-emerald-200 font-medium">Calibrated in Profile</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-4 leading-relaxed text-center sm:text-left">
          💡 <strong>Continuous Learning Loop Active:</strong> Your official competency profile has been updated. Your competency gap analysis and personalized training recommendations will automatically reflect these gains.
        </p>
      </div>
    </div>
  );
};
