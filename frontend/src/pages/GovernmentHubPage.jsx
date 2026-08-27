import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { resourceApi } from '../services/api';
import { ResourceCard } from '../components/ResourceCard';
import { Building2, Search, ExternalLink, ShieldCheck, Database, Award } from 'lucide-react';

export const GovernmentHubPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        let sourceFilter = undefined;
        if (activeTab === 'nssta') sourceFilter = 'NSSTA';
        if (activeTab === 'mospi') sourceFilter = 'MoSPI';
        if (activeTab === 'esankhyiki') sourceFilter = 'eSankhyiki';

        const res = await resourceApi.getAll({ source: sourceFilter });
        setResources(res.data);
      } catch (err) {
        console.error("Error loading resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [activeTab]);

  const filtered = resources.filter((r) => {
    return (
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Building2 className="w-4 h-4" />
          <span>Official Statistical Learning Repository</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          Government Learning Hub: NSSTA & MoSPI
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Access verified official academy modules, survey manuals, eSankhyiki data assets, and technical publications. Every resource is mapped to specific statistical competencies.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        {/* Source Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 overflow-x-auto">
          {[
            { key: 'all', label: 'All Resources' },
            { key: 'nssta', label: 'NSSTA Academy Modules' },
            { key: 'mospi', label: 'MoSPI Technical Manuals' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setActiveTab(t.key);
                setSearchParams(t.key === 'all' ? {} : { tab: t.key });
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === t.key
                  ? 'bg-white text-mospi-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-mospi-500 outline-none"
          />
        </div>
      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 text-xs">
          Loading verified government resources...
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
          No resources found matching your search query.
        </div>
      )}
    </div>
  );
};
