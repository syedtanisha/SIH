import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Layers, 
  Calculator, 
  ShieldCheck, 
  Building2,
  Info,
  ChevronRight
} from 'lucide-react';

export const ModuleReaderModal = ({ resource, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum', 'methodology', 'practice'

  if (!isOpen || !resource) return null;

  const {
    title,
    description,
    source,
    official_url,
    resource_type,
    difficulty,
    estimated_duration_mins,
  } = resource;

  const targetUrl = official_url && official_url.startsWith('http') 
    ? official_url 
    : 'https://www.mospi.gov.in/';

  const handleOpenPortal = (e) => {
    e.preventDefault();
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleLaunchQuiz = () => {
    onClose();
    navigate(`/studio?topic=${encodeURIComponent(title)}`);
  };

  // Structured pedagogical data tailored to the topic
  const getDetailedContent = () => {
    const titleLower = (title || '').toLowerCase();
    
    if (titleLower.includes('python') || titleLower.includes('comput')) {
      return {
        subtitle: 'NSSTA Digital Data Laboratory • Practical Microdata Analytics',
        modules: [
          { title: '1. Microdata Ingestion & Chunking', desc: 'Loading multi-gigabyte survey schedules using pandas chunking, data typing, and memory optimization.' },
          { title: '2. Multiplier Expansion & Estimation', desc: 'Applying sampling weights to unit records to estimate population counts, totals, and ratios.' },
          { title: '3. Automated Quality Validation', desc: 'Writing automated assertion scripts to detect outliers and roster code inconsistencies.' },
          { title: '4. Dissemination & Reporting', desc: 'Generating automated summary bulletins and visualizations with NumPy and Matplotlib.' }
        ],
        formulas: [
          {
            name: 'Weighted Population Total Estimator',
            display: 'Ŷ = Σ (w_i × y_i)',
            variables: [
              { sym: 'Ŷ', desc: 'Estimated population aggregate total' },
              { sym: 'w_i', desc: 'Sampling multiplier / design weight for sample unit i' },
              { sym: 'y_i', desc: 'Observed value of the variable (e.g. household consumption, income)' }
            ],
            note: 'Applied to every unit record in NSS and PLFS microdata to expand sample observations to national population totals.'
          },
          {
            name: 'Weighted Mean Estimator',
            display: 'ȳ_w = [ Σ (w_i × y_i) ] / [ Σ w_i ]',
            variables: [
              { sym: 'ȳ_w', desc: 'Weighted average per unit record' },
              { sym: 'Σ w_i', desc: 'Sum of multipliers (estimated total population size)' }
            ],
            note: 'Ensures sample means are unbiased even under non-proportional multi-stage sample allocation.'
          },
          {
            name: 'Composite Multiplier Calculation',
            display: 'w_i = (1 / P_i) × (1 / R_h)',
            variables: [
              { sym: 'P_i', desc: 'Probability of selecting unit i across all sampling stages' },
              { sym: 'R_h', desc: 'Response rate in stratum h (non-response adjustment factor)' }
            ],
            note: 'Adjusts design weights for non-contact and non-response to prevent sample attrition bias.'
          }
        ],
        guidelines: 'Verify that multiplier totals align with population projections from the MoSPI Technical Group before bulletin release.'
      };
    }
    
    if (titleLower.includes('national accounts') || titleLower.includes('sna') || titleLower.includes('gdp') || titleLower.includes('nad')) {
      return {
        subtitle: 'National Accounts Division (NAD) • Macroeconomic Compilation Standards',
        modules: [
          { title: '1. SNA 2008 Conceptual Framework', desc: 'Production boundaries, institutional sectors (General Govt, Corporations, NPISH, Households).' },
          { title: '2. Gross Value Added (GVA) by Economic Activity', desc: 'Compiling Gross Output and Intermediate Consumption across agriculture, industry, and services.' },
          { title: '3. Supply and Use Tables (SUT)', desc: 'Balancing domestic production, imports, intermediate absorption, final consumption, and exports.' },
          { title: '4. Capital Formation & Sequence of Accounts', desc: 'Compiling Gross Fixed Capital Formation (GFCF), change in inventories, and consumption of fixed capital.' }
        ],
        formulas: [
          {
            name: 'Gross Value Added (GVA) at Basic Prices',
            display: 'GVA (Basic Prices) = Gross Output (Basic Prices) - Intermediate Consumption',
            variables: [
              { sym: 'Gross Output', desc: 'Total market and non-market production value generated during the accounting year' },
              { sym: 'Intermediate Consumption', desc: 'Cost of goods and raw materials used up or transformed in production' }
            ],
            note: 'Primary measure of sectoral economic contribution under India’s National Accounts 2011-12 base series.'
          },
          {
            name: 'Gross Domestic Product (GDP) at Market Prices',
            display: 'GDP (Market Prices) = GVA (Basic Prices) + Product Taxes - Product Subsidies',
            variables: [
              { sym: 'Product Taxes', desc: 'GST, custom duties, excise duties, and stamp duties' },
              { sym: 'Product Subsidies', desc: 'Food subsidies, fertilizer subsidies, and petroleum subsidies' }
            ],
            note: 'The official headline economic growth indicator published in quarterly and annual GDP estimates.'
          },
          {
            name: 'Gross Fixed Capital Formation (GFCF)',
            display: 'GFCF = Net Acquisition of Fixed Assets + Cost of Ownership Transfer',
            variables: [
              { sym: 'Fixed Assets', desc: 'Dwellings, other buildings, machinery & equipment, intellectual property' },
              { sym: 'Ownership Transfer', desc: 'Legal and delivery fees associated with asset creation' }
            ],
            note: 'Represents the investment rate in the economy as a percentage of GDP.'
          }
        ],
        guidelines: 'Incorporate MCA-21 filings for the private corporate sector and PLFS labor input estimates for informal enterprises.'
      };
    }

    if (titleLower.includes('cpi') || titleLower.includes('iip') || titleLower.includes('price') || titleLower.includes('esd')) {
      return {
        subtitle: 'Economic Statistics Division (ESD) • Index Numbers Compilation Manual',
        modules: [
          { title: '1. Price Quotation & Basket Maintenance', desc: 'Standard operating procedures for monthly canvassing across 1,181 village and 1,114 urban markets.' },
          { title: '2. Laspeyres Base-Weighted Aggregation', desc: 'Computing item price relatives and subgroup indices using fixed base year expenditure shares.' },
          { title: '3. Factory Production Tracking for IIP', desc: 'Canvassing production volume across 407 item groups from registered manufacturing units.' },
          { title: '4. Chain Indexing & Base Revisions', desc: 'Updating weighting baskets and splicing historical series during periodic base year updates.' }
        ],
        formulas: [
          {
            name: 'Laspeyres Price Index Formula',
            display: 'I_{0t} = [ Σ (P_t × Q_0) / Σ (P_0 × Q_0) ] × 100',
            variables: [
              { sym: 'P_t', desc: 'Price of the item in the current comparison month t' },
              { sym: 'P_0', desc: 'Price of the item in the base year (2012 = 100)' },
              { sym: 'Q_0', desc: 'Base year consumption basket quantity' }
            ],
            note: 'Headline Consumer Price Index (CPI-Combined) is compiled monthly using this base-weighted formula.'
          },
          {
            name: 'Geometric Mean Item Price Relative',
            display: 'R_i = ( (P_{t,1}/P_{0,1}) × (P_{t,2}/P_{0,2}) × ... × (P_{t,k}/P_{0,k}) ) ^ (1/k)',
            variables: [
              { sym: 'R_i', desc: 'Elementary price relative for item i across k sample quotation markets' },
              { sym: 'k', desc: 'Number of validated price quotes received in the reference month' }
            ],
            note: 'Geometric averaging prevents upward bias caused by extreme localized price fluctuations.'
          },
          {
            name: 'Index of Industrial Production (IIP)',
            display: 'IIP_t = [ Σ ( (q_{it} / q_{i0}) × W_i ) / Σ W_i ] × 100',
            variables: [
              { sym: 'q_{it}', desc: 'Physical production volume of item i in current month t' },
              { sym: 'q_{i0}', desc: 'Average monthly production volume of item i in base year' },
              { sym: 'W_i', desc: 'GVA weight of item i derived from Annual Survey of Industries (ASI)' }
            ],
            note: 'Monitors short-term industrial momentum across Mining (14.37%), Manufacturing (77.63%), and Electricity (7.99%).'
          }
        ],
        guidelines: 'Ensure price quotes are scrutinized for missing quotes and seasonal out-of-stock items are imputed via cell-mean.'
      };
    }

    // Default Survey & Quality Module
    return {
      subtitle: 'NSSTA & MoSPI Official Curriculum • Official Survey Design',
      modules: [
        { title: '1. Multi-Stage Stratified Sampling Frame', desc: 'Selection of Census Villages/UFS blocks as FSUs and households as USUs with circular systematic sampling.' },
        { title: '2. Questionnaire Design & Reference Periods', desc: 'Canvassing structured schedules under Usual Principal and Subsidiary Status (UPSS) and Current Weekly Status (CWS).' },
        { title: '3. National Quality Assurance (UN NQAF)', desc: 'Validating impartiality, methodology, transparent metadata, and respondent confidentiality safeguards.' },
        { title: '4. Dissemination & eSankhyiki Standards', desc: 'Publishing open microdata with Data Documentation Initiative (DDI) standards and statistical disclosure control.' }
      ],
      formulas: [
        {
          name: 'Stratified Sample Variance Formula',
          display: 'Var(ȳ_st) = Σ [ W_h² × (S_h² / n_h) × (1 - f_h) ]',
          variables: [
            { sym: 'W_h', desc: 'Stratum population weight (N_h / N)' },
            { sym: 'S_h²', desc: 'Variance of the variable in stratum h' },
            { sym: 'n_h', desc: 'Number of sample units allocated to stratum h' },
            { sym: 'f_h', desc: 'Sampling fraction (n_h / N_h), where (1 - f_h) is the Finite Population Correction (FPC)' }
          ],
          note: 'Used in PLFS and NSS rounds to compute standard errors and relative standard error (RSE) for published domain estimates.'
        },
        {
          name: 'Design Effect (Deff)',
          display: 'Deff = 1 + (m̄ - 1) × ρ',
          variables: [
            { sym: 'Deff', desc: 'Ratio of complex design variance to simple random sampling variance' },
            { sym: 'm̄', desc: 'Average cluster size (households per primary sampling unit)' },
            { sym: 'ρ', desc: 'Intra-cluster correlation coefficient' }
          ],
          note: 'Quantifies efficiency loss due to clustering; guide for determining optimal cluster sizes in nationwide surveys.'
        },
        {
          name: 'Survey Response Rate',
          display: 'Response Rate (%) = [ Number of Completed Schedules / Total Allocated Sample Units ] × 100',
          variables: [
            { sym: 'Numerator', desc: 'Successfully canvassed and audited household schedules' },
            { sym: 'Denominator', desc: 'Total sample units originally selected in the frame' }
          ],
          note: 'Key quality indicator monitored under UN NQAF standards. MoSPI household surveys maintain response rates above 95%.'
        }
      ],
      guidelines: 'Adhere to United Nations Fundamental Principles of Official Statistics to ensure scientific rigor and policy independence.'
    };
  };

  const details = getDetailedContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Close module"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
              {source}
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-slate-200 border border-white/20">
              {difficulty}
            </span>
            {estimated_duration_mins && (
              <span className="text-[11px] text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {estimated_duration_mins} Mins Study
              </span>
            )}
          </div>

          <h2 className="text-lg sm:text-xl font-extrabold leading-snug">
            {title}
          </h2>
          <p className="text-xs text-amber-200 mt-1 font-medium">
            {details.subtitle}
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'curriculum'
                ? 'border-mospi-900 text-mospi-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Syllabus</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'methodology'
                ? 'border-mospi-900 text-mospi-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Formulas & SOPs</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'practice'
                ? 'border-mospi-900 text-mospi-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Practice & Verification</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm text-slate-700">
          
          {/* TAB 1: CURRICULUM */}
          {activeTab === 'curriculum' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                <h3 className="font-bold text-slate-900 mb-1">Executive Summary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {description}
                </p>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">Key Learning Modules:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {details.modules.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-mospi-400 transition space-y-1 shadow-sm">
                    <h4 className="font-bold text-xs text-mospi-900">{m.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950">
                  <span className="font-bold">Official Standard: </span>
                  {details.guidelines}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: METHODOLOGY & FORMULAS */}
          {activeTab === 'methodology' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Core Mathematical Formulations & Standard Definitions</h3>
                <span className="text-[11px] text-slate-500 font-medium">MoSPI Official Methodology</span>
              </div>

              <div className="space-y-4">
                {details.formulas.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                    {/* Formula Header */}
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900">{item.name}</span>
                      <span className="text-[10px] uppercase font-bold text-mospi-700 bg-mospi-100 px-2 py-0.5 rounded">Formula {idx + 1}</span>
                    </div>

                    {/* Equation Banner */}
                    <div className="bg-slate-900 text-amber-300 p-4 font-mono text-sm sm:text-base font-bold text-center tracking-wide overflow-x-auto">
                      {item.display}
                    </div>

                    {/* Variable Definitions */}
                    <div className="p-4 bg-white space-y-2 text-xs">
                      <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Where:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.variables.map((v, vIdx) => (
                          <div key={vIdx} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                            <span className="font-mono font-bold text-mospi-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px] flex-shrink-0">{v.sym}</span>
                            <span className="text-slate-600 text-[11px] leading-tight">{v.desc}</span>
                          </div>
                        ))}
                      </div>

                      {/* Takeaway / Operational Note */}
                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-600">
                        <Info className="w-3.5 h-3.5 text-mospi-700 flex-shrink-0 mt-0.5" />
                        <span><strong className="text-slate-800">Operational Application:</strong> {item.note}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 space-y-1.5">
                <h4 className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Building2 className="w-4 h-4" /> MoSPI National Quality Assurance Note
                </h4>
                <p className="leading-relaxed">
                  All estimators and formulas above are certified under UN NQAF standards. Data submitted through official cadres must conform to the latest methodology published in MoSPI Annual Survey Manuals.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRACTICE & VERIFICATION */}
          {activeTab === 'practice' && (
            <div className="space-y-4 text-center py-6">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">Generate AI Quiz from this Module</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Validate your comprehension of <span className="font-semibold text-slate-800">"{title}"</span> by generating an AI-evaluated MCQ examination powered by Groq and Google Gemini AI.
                </p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleLaunchQuiz}
                  className="px-6 py-3 bg-mospi-900 hover:bg-mospi-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-mospi-900/20 transition inline-flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch AI Quiz Studio on this Topic</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenPortal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm"
          >
            <span>Visit MoSPI Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={handleLaunchQuiz}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate AI Quiz</span>
          </button>
        </div>

      </div>
    </div>
  );
};
