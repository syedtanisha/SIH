import React from 'react';
import { ExternalLink, ShieldCheck, Database, Award } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Mandate */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <span className="w-6 h-6 rounded bg-amber-500 text-slate-900 flex items-center justify-center font-black text-xs">
                सं
              </span>
              <span>AI-Enabled Capacity Building for India's Official Statistical System</span>
            </div>
            <p className="text-slate-400 leading-relaxed pr-6">
              Developed to strengthen institutional capacity across the Ministry of Statistics and Programme Implementation (MoSPI), National Statistical Systems Training Academy (NSSTA), State Directorates of Economics & Statistics (DES), and Indian Statistical Service (ISS/SSS) cadres through adaptive competency modeling, AI quiz synthesis, and NSSTA academy alignment.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> UN Fundamental Principles</span>
              <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5 text-blue-400" /> eSankhyiki Data Standards</span>
              <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> MoSPI Cadre Framework</span>
            </div>
          </div>

          {/* Col 2: Official Portals */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Official Portals</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  MoSPI Official Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.mospi.gov.in/national-statistical-systems-training-academy-nssta" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  NSSTA Greater Noida <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://esankhyiki.mospi.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  eSankhyiki Data Portal <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.nscindia.gov.in" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  National Statistical Commission <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Competency Domains */}
          <div>
            <h3 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Core Domains</h3>
            <ul className="space-y-1.5 text-slate-400">
              <li>Survey Methodology (NSSO)</li>
              <li>National Accounts (SNA 2008)</li>
              <li>Price Indices (CPI / IIP)</li>
              <li>Labour & Demographics (PLFS)</li>
              <li>Enterprise Statistics (ASI)</li>
              <li>Statistical Computing (Python / R)</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-[11px] gap-4">
          <p>© {new Date().getFullYear()} India's Official Statistical System • MoSPI & NSSTA Capacity Building.</p>
          <div className="flex gap-6">
            <span>National Quality Assurance Framework</span>
            <span>Metadata & Data Governance</span>
            <span>Mission Karmayogi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
