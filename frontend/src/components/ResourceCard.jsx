import React, { useState } from 'react';
import { ExternalLink, Clock, BookOpen, Layers, Award, Sparkles } from 'lucide-react';
import { ModuleReaderModal } from './ModuleReaderModal';

export const ResourceCard = ({ resource, relevanceReason, matchScore }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    title,
    description,
    source,
    official_url,
    resource_type,
    difficulty,
    estimated_duration_mins,
    aligned_competencies,
  } = resource;

  const getSourceBadge = (s) => {
    switch (s) {
      case 'NSSTA':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          label: 'NSSTA Academy Module',
        };
      case 'MoSPI':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          label: 'MoSPI Official Publication',
        };
      case 'eSankhyiki':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          label: 'eSankhyiki Portal Data',
        };
      case 'State_DES':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          label: 'State DES Curriculum',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          label: s || 'Official Resource',
        };
    }
  };

  const badge = getSourceBadge(source);

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
        <div>
          {/* Source & Type Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${badge.bg}`}>
              {badge.label}
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {difficulty}
              </span>
              {estimated_duration_mins && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {estimated_duration_mins}m
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setIsModalOpen(true)}
            className="text-sm font-bold text-slate-900 leading-snug mb-2 hover:text-mospi-800 transition cursor-pointer"
          >
            {title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
            {description}
          </p>

          {/* Match Reason if provided */}
          {relevanceReason && (
            <div className="mb-4 bg-mospi-50/70 p-2.5 rounded-lg border border-mospi-100 text-[11px] text-mospi-900">
              <span className="font-semibold">AI Gap Fit: </span>{relevanceReason}
            </div>
          )}
        </div>

        {/* Action CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[10px] text-slate-400 font-mono">
            {resource_type ? resource_type.replace('_', ' ') : 'Module'}
          </span>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-mospi-900 hover:bg-mospi-800 text-white rounded-md text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <BookOpen className="w-3 h-3 text-amber-300" />
            <span>Access Resource</span>
          </button>
        </div>
      </div>

      {/* Interactive Reader Modal */}
      <ModuleReaderModal
        resource={resource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
