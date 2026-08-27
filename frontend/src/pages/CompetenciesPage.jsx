import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { competencyApi } from '../services/api';
import { Layers, Search, Filter, BookOpen, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const CompetenciesPage = () => {
  const [profile, setProfile] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await competencyApi.getProfile();
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading competencies:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-500 text-xs">
        Loading competency matrix...
      </div>
    );
  }

  const competencies = profile?.competencies || [];
  const domains = ['All', ...new Set(competencies.map(c => c.domain))];

  const filtered = competencies.filter((c) => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-mospi-800 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> Official Framework
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Official Statistical Competencies Matrix
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mt-1">
            Standardized benchmarks aligned with MoSPI divisions, NSSTA Greater Noida modules, and official statistical cadre requirements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/gap-analysis"
            className="px-4 py-2 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow-sm transition"
          >
            Prioritized Gap Analysis
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Domain Tabs */}
        <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                selectedDomain === d
                  ? 'bg-mospi-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search competencies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-mospi-500 outline-none"
          />
        </div>
      </div>

      {/* Competency Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Competency Name & Description</th>
                <th className="py-3.5 px-4">Domain</th>
                <th className="py-3.5 px-4 text-center">Current Level</th>
                <th className="py-3.5 px-4 text-center">Required Target</th>
                <th className="py-3.5 px-4 text-center">Gap</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const isMet = c.gap === 0;
                return (
                  <tr key={c.competency_id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 max-w-xs sm:max-w-md">
                      <p className="font-bold text-slate-900 leading-snug">{c.name}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{c.description}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                        {c.domain}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-900 whitespace-nowrap">
                      {c.current_level}%
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-500 whitespace-nowrap">
                      {c.required_level}%
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      {c.gap > 0 ? (
                        <span className="font-extrabold text-rose-600">
                          {c.gap}%
                        </span>
                      ) : (
                        <span className="font-bold text-emerald-600 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Met
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        c.priority === 'High' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                        c.priority === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        c.priority === 'Low' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {c.priority === 'Met' ? 'Benchmark Met' : `${c.priority} Priority`}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/recommendations?gap=${encodeURIComponent(c.name)}`}
                          className="p-1.5 rounded-md text-slate-600 hover:text-mospi-900 hover:bg-slate-100"
                          title="View NSSTA & MoSPI Modules"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/studio?topic=${encodeURIComponent(c.name)}`}
                          className="p-1.5 rounded-md text-amber-700 hover:text-amber-900 hover:bg-amber-50"
                          title="Generate Quiz in AI Studio"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
