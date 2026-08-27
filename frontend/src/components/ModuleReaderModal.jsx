import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Award, 
  FileText, 
  Calculator, 
  ShieldCheck, 
  Building2 
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
    competency_code
  } = resource;

  const handleLaunchQuiz = () => {
    onClose();
    navigate(`/studio?topic=${encodeURIComponent(title)}`);
  };

  // Generate enriched pedagogical content based on topic & competency
  const getDetailedContent = () => {
    const titleLower = (title || '').toLowerCase();
    
    if (titleLower.includes('python') || titleLower.includes('comput')) {
      return {
        subtitle: 'NSSTA Digital Laboratory • Practical Python for Official Microdata',
        modules: [
          { title: '1. Microdata Ingestion & Anonymization', desc: 'Loading multi-gigabyte survey schedules (.txt/.csv) using pandas chunking, schema validation, and masking direct identifiers.' },
          { title: '2. Applying Sampling Multipliers & Weights', desc: 'Implementing multiplier expansion formulas to compute estimated population totals: Total = Sum(Variable * Multiplier).' },
          { title: '3. Data Validation & Audit Scripts', desc: 'Automating consistency checks across household rosters, economic activity codes, and income brackets.' },
          { title: '4. Automated Dissemination Pipelines', desc: 'Generating reproducible statistical bulletins and tables using NumPy, SciPy, and Matplotlib.' }
        ],
        formulas: [
          'Weighted Total: \\hat{Y} = \\sum_{i=1}^{n} w_i \\cdot y_i',
          'Weighted Mean: \\bar{y}_w = \\frac{\\sum_{i=1}^{n} w_i \\cdot y_i}{\\sum_{i=1}^{n} w_i}',
          'Multiplier Expansion: w_i = \\text{Design Weight} \\times \\text{Non-response Adjustment}'
        ],
        guidelines: 'Always verify unit multiplier sums against the Projected Population figures published by the Technical Group on Population Projections.'
      };
    }
    
    if (titleLower.includes('national accounts') || titleLower.includes('sna') || titleLower.includes('gdp')) {
      return {
        subtitle: 'National Accounts Division (NAD) • Macroeconomic Compilation Standards',
        modules: [
          { title: '1. SNA 2008 Conceptual Framework', desc: 'Production boundaries, institutional sectors (General Government, Financial/Non-Financial Corporations, NPISH, Households).' },
          { title: '2. GVA Estimation by Economic Activity', desc: 'Compiling Gross Output and Intermediate Consumption across agriculture, manufacturing, and services.' },
          { title: '3. Supply and Use Tables (SUT)', desc: 'Balancing commodity supply (domestic production + imports) with domestic absorption and exports.' },
          { title: '4. Sequence of Accounts & Capital Formation', desc: 'Estimating Gross Fixed Capital Formation (GFCF), Change in Stocks, and Net Foreign Factor Income.' }
        ],
        formulas: [
          'GVA at Basic Prices = Gross Output (at basic prices) - Intermediate Consumption',
          'GDP at Market Prices = GVA at Basic Prices + Product Taxes - Product Subsidies',
          'GFCF = Gross Additions to Fixed Assets - Disposals of Fixed Assets + Improvements'
        ],
        guidelines: 'Incorporate MCA-21 electronic filings for organized private corporate sector and PLFS labor coefficients for unincorporated enterprises.'
      };
    }

    if (titleLower.includes('cpi') || titleLower.includes('iip') || titleLower.includes('price')) {
      return {
        subtitle: 'Economic Statistics Division (ESD) • Index Numbers Compilation Manual',
        modules: [
          { title: '1. Price Quotation & Frame Maintenance', desc: 'Collection protocols across rural and urban price markets with regular sample basket monitoring.' },
          { title: '2. Laspeyres Base-Weighted Aggregation', desc: 'Computing item relatives and sub-group indices using fixed base year expenditure shares.' },
          { title: '3. Factory Production Tracking for IIP', desc: 'Monthly data canvassing from registered factories across 23 NIC 2-digit industry groups.' },
          { title: '4. Chain Indexing & Splicing', desc: 'Methodology for linking historical price series when new base year weighting is introduced.' }
        ],
        formulas: [
          'Laspeyres Price Index: I_{0t} = \\frac{\\sum (P_t \\cdot Q_0)}{\\sum (P_0 \\cdot Q_0)} \\times 100',
          'Geometric Mean Item Relative: R_i = \\left(\\prod_{j=1}^{k} \\frac{P_{tj}}{P_{0j}}\\right)^{1/k}',
          'Sub-Group Index: I_{sub} = \\sum w_i \\cdot R_i'
        ],
        guidelines: 'Ensure price quotes are scrutinized for seasonal spikes, missing quotations are imputed via cell-mean, and outliers are flagged before monthly release.'
      };
    }

    // Default Survey & Quality Module
    return {
      subtitle: 'NSSTA & MoSPI Official Curriculum • Official Statistical Methodology',
      modules: [
        { title: '1. Sampling Frame & Multi-Stage Design', desc: 'Selection of Census Villages/UFS blocks as FSUs and households as USUs with circular systematic sampling.' },
        { title: '2. Questionnaire Design & Field Canvassing', desc: 'Structured schedules, reference periods (UPSS, CWS), and non-sampling error control protocols.' },
        { title: '3. National Quality Assurance (UN NQAF)', desc: 'Verification of impartiality, transparency, sound methodology, and confidentiality safeguards.' },
        { title: '4. Dissemination & eSankhyiki FAIR Metadata', desc: 'Open data publishing, Data Documentation Initiative (DDI) standards, and API catalog maintenance.' }
      ],
      formulas: [
        'Stratified Sample Variance: V(\\bar{y}_{st}) = \\sum W_h^2 \\frac{S_h^2}{n_h} (1 - f_h)',
        'Design Effect: \\text{Deff} = 1 + (\\bar{m} - 1) \\cdot \\rho',
        'Response Rate: R = \\frac{\\text{Completed Interviews}}{\\text{Eligible Sample Units}} \\times 100'
      ],
      guidelines: 'Follow United Nations Fundamental Principles of Official Statistics to ensure scientific rigor and policy independence.'
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
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
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
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'curriculum'
                ? 'border-mospi-900 text-mospi-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Syllabus</span>
          </button>

          <button
            onClick={() => setActiveTab('methodology')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'methodology'
                ? 'border-mospi-900 text-mospi-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Formulas & SOPs</span>
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'practice'
                ? 'border-mospi-900 text-mospi-900'
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
              <h3 className="font-bold text-slate-900 text-sm">Core Mathematical Formulations & Definitions</h3>
              <div className="space-y-2.5">
                {details.formulas.map((f, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900 text-amber-300 font-mono text-xs shadow-inner">
                    <code>{f}</code>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-xs text-blue-950 space-y-1.5">
                <h4 className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Building2 className="w-4 h-4" /> MoSPI Implementation Note
                </h4>
                <p className="leading-relaxed">
                  All estimators are audited under UN NQAF standards. Data submitted through official cadres must conform to the latest National Quality Assurance Framework released by MoSPI.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRACTICE & VERIFICATION */}
          {activeTab === 'practice' && (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900">Generate AI Quiz from this Module</h3>
                <p className="text-xs text-slate-500">
                  Validate your comprehension of "{title}" by generating an AI-evaluated MCQ examination with instant demonstrable competency gains.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleLaunchQuiz}
                  className="px-6 py-3 bg-mospi-900 hover:bg-mospi-800 text-white rounded-xl text-xs font-bold shadow-lg shadow-mospi-900/20 transition inline-flex items-center gap-2"
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
          <a
            href={official_url || "https://www.mospi.gov.in"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition"
          >
            <span>Visit MoSPI Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <button
            onClick={handleLaunchQuiz}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate AI Quiz</span>
          </button>
        </div>

      </div>
    </div>
  );
};
