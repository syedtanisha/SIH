import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { documentApi, quizApi, competencyApi } from '../services/api';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  Play,
  Layers,
  BookOpen,
  Cpu,
  Zap
} from 'lucide-react';

export const StudioPage = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || '';
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'generate', 'quizzes'
  const [documents, setDocuments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [competencies, setCompetencies] = useState([]);

  // Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState('');

  // Generation State
  const [genTopic, setGenTopic] = useState(initialTopic || 'Sampling Weights & Multipliers in PLFS');
  const [genDocId, setGenDocId] = useState('');
  const [genNumQuestions, setGenNumQuestions] = useState(5);
  const [genDifficulty, setGenDifficulty] = useState('Intermediate');
  const [genCompId, setGenCompId] = useState('');
  const [customText, setCustomText] = useState('');
  const [aiProvider, setAiProvider] = useState('groq'); // 'groq', 'gemini', 'auto'
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (initialTopic) {
      setGenTopic(initialTopic);
      setActiveTab('generate');
    }
  }, [initialTopic]);

  const fetchInitialData = async () => {
    try {
      const [docsRes, quizzesRes, compsRes] = await Promise.all([
        documentApi.getAll(),
        quizApi.getAll(),
        competencyApi.getAll()
      ]);
      setDocuments(docsRes.data);
      setQuizzes(quizzesRes.data);
      setCompetencies(compsRes.data);
    } catch (err) {
      console.error("Error loading studio data:", err);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    setUploadError('');
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const res = await documentApi.upload(formData);
      setUploadResult(res.data);
      setGenDocId(res.data.id);
      setGenTopic(uploadFile.name.replace(/\.[^/.]+$/, ""));
      setActiveTab('generate');
      fetchInitialData();
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.response?.data?.detail || "Failed to process document. Please ensure valid PDF, DOCX, PPTX, or TXT format.");
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setGenError('');

    try {
      const payload = {
        topic: genTopic,
        document_id: genDocId ? parseInt(genDocId) : null,
        num_questions: parseInt(genNumQuestions),
        difficulty: genDifficulty,
        competency_id: genCompId ? parseInt(genCompId) : null,
        custom_text: customText || null
      };

      const res = await quizApi.generate(payload);
      fetchInitialData();
      navigate(`/quiz/${res.data.id}`);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setGenError(err.response?.data?.detail || "Failed to generate quiz. Please check document contents and topic.");
    } finally {
      setGenerating(false);
    }
  };

  const presetTopics = [
    'Periodic Labour Force Survey (PLFS) UPSS & CWS Concepts',
    'National Accounts SNA 2008 GVA Estimation by Industry',
    'Consumer Price Index (CPI) Laspeyres Formula & Basket Weights',
    'Survey Sampling FSUs & Multiplier Weight Expansion',
    'Microdata Anonymization & Data Governance on eSankhyiki',
    'Annual Survey of Industries (ASI) Net Value Added Calculation'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-mospi-900 via-mospi-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg border border-mospi-700/50 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
          <Sparkles className="w-4 h-4" />
          <span>AI Learning Studio • Powered by Groq AI & Google Gemini</span>
        </div>
        <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
          AI Pedagogical Quiz Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Upload official MoSPI survey reports, NSSTA manuals, and methodological briefs (PDF, DOCX, PPTX, TXT) or enter custom statistical prompts to generate schema-enforced verification MCQs with detailed explanations.
        </p>
      </div>

      {/* Mode Navigation */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'upload' ? 'bg-white text-mospi-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>1. Upload Learning Material</span>
        </button>

        <button
          onClick={() => setActiveTab('generate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'generate' ? 'bg-white text-mospi-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>2. Generate AI Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('quizzes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
            activeTab === 'quizzes' ? 'bg-white text-mospi-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Saved Quizzes ({quizzes.length})</span>
        </button>
      </div>

      {/* Tab 1: Upload Material */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Official Document</h2>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, PPTX, or TXT up to 25MB.</p>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-mospi-500 rounded-2xl p-8 text-center transition bg-slate-50/50">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-[11px] text-slate-400 mb-4">
                  e.g., PLFS_Methodology_Note.pdf, National_Accounts_Guide.docx, CPI_Technical_Manual.pdf
                </p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.pptx,.ppt,.txt"
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-mospi-900 file:text-white hover:file:bg-mospi-800"
                />
              </div>

              {uploadFile && (
                <div className="bg-mospi-50 p-3 rounded-lg border border-mospi-200 text-xs flex items-center justify-between">
                  <span className="font-semibold text-mospi-900">{uploadFile.name}</span>
                  <span className="text-slate-500">{(uploadFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!uploadFile || uploading}
                className="w-full py-3 bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {uploading ? 'Extracting Text & Processing...' : (
                  <>
                    <span>Upload & Continue to AI Quiz Generation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recently Ingested Documents */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Your Document Repository</h3>
            {documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{doc.filename}</p>
                      <p className="text-[11px] text-slate-500">{doc.character_count.toLocaleString()} characters • {doc.file_type.toUpperCase()}</p>
                    </div>
                    <button
                      onClick={() => {
                        setGenDocId(doc.id);
                        setGenTopic(doc.filename.replace(/\.[^/.]+$/, ""));
                        setActiveTab('generate');
                      }}
                      className="px-2.5 py-1 bg-mospi-900 text-white rounded text-[11px] font-semibold hover:bg-mospi-800 transition"
                    >
                      Generate Quiz
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No documents uploaded yet. Upload a file to test AI extraction.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Generate AI Quiz */}
      {activeTab === 'generate' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-mospi-800 mb-1">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Prompt-Driven & Grounded MCQ Generation Engine</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Configure AI Quiz Generation</h2>
            <p className="text-xs text-slate-500">Grounded in official MoSPI methodologies with detailed pedagogical rationales.</p>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Official Statistical Topic Presets:</label>
            <div className="flex flex-wrap gap-1.5">
              {presetTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setGenTopic(topic)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                    genTopic === topic
                      ? 'bg-mospi-900 text-white border-mospi-900 font-semibold'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {genError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{genError}</span>
            </div>
          )}

          <form onSubmit={handleGenerateQuiz} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Assessment Topic</label>
              <input
                type="text"
                required
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                placeholder="e.g. Sampling Weights & Variances in PLFS"
                className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-mospi-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Source Document</label>
                <select
                  value={genDocId}
                  onChange={(e) => setGenDocId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  <option value="">-- Use Topic Concepts (No File) --</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>{d.filename}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Competency</label>
                <select
                  value={genCompId}
                  onChange={(e) => setGenCompId(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  <option value="">-- Auto-Map from Topic --</option>
                  {competencies.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Number of Questions</label>
                <select
                  value={genNumQuestions}
                  onChange={(e) => setGenNumQuestions(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  <option value="3">3 Questions (Quick Knowledge Check)</option>
                  <option value="5">5 Questions (Standard Evaluation)</option>
                  <option value="8">8 Questions (Deep Cadre Assessment)</option>
                  <option value="10">10 Questions (Comprehensive Examination)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Difficulty Tier</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  <option value="Foundational">Foundational</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced (Cadre Induction)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Custom Prompt Focus or Statistical Excerpt (Optional)
              </label>
              <textarea
                rows={3}
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. Emphasize Laspeyres price index formula calculations, Paasche comparisons, and basket revision protocols..."
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-mospi-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3.5 bg-mospi-900 hover:bg-mospi-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {generating ? 'AI Generating Schema-Enforced MCQs...' : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate AI Quiz & Launch Examination</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Saved Quizzes */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Your AI Generated Quizzes ({quizzes.length})</h2>
            <button
              onClick={() => setActiveTab('generate')}
              className="px-3.5 py-1.5 bg-mospi-900 text-white text-xs font-bold rounded-lg shadow-sm"
            >
              + Create New Quiz
            </button>
          </div>

          {quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((q) => (
                <div key={q.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">{q.difficulty}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {q.time_limit_mins}m</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-1">{q.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">Topic: {q.topic}</p>
                    <p className="text-xs font-semibold text-mospi-800 mt-2">{q.total_questions} Questions</p>
                  </div>

                  <Link
                    to={`/quiz/${q.id}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-mospi-900 hover:bg-mospi-800 text-white rounded-lg text-xs font-bold shadow-sm transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Take Quiz Now</span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              No quizzes generated yet. Switch to "Upload Learning Material" or "Generate AI Quiz" to create your first assessment.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
