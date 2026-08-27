import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, ArrowRight, Lock, Mail, User, Building2, Briefcase } from 'lucide-react';
import { SearchableDropdown } from '../components/SearchableDropdown';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    designation: '',
    department: '',
    organization: 'Government of India',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const designations = [
    'Indian Statistical Service (ISS) - Director / Dy. Director',
    'Indian Statistical Service (ISS) - Joint Director',
    'Indian Statistical Service (ISS) - Assistant Director',
    'Indian Statistical Service (ISS) - Deputy Director General (DDG)',
    'Indian Statistical Service (ISS) - Additional Director General (ADG)',
    'Director General (DG) - MoSPI / CSO / NSSO',
    'Subordinate Statistical Service (SSS) - Senior Statistical Officer (SSO)',
    'Subordinate Statistical Service (SSS) - Junior Statistical Officer (JSO)',
    'Statistical Investigator Grade I - MoSPI / FOD',
    'Statistical Investigator Grade II - MoSPI / FOD',
    'State Directorate of Economics & Statistics (DES) - Director / Joint Director',
    'State Directorate of Economics & Statistics (DES) - Assistant Director / Research Officer',
    'State Directorate of Economics & Statistics (DES) - Statistical Officer / Inspector',
    'Data Analyst / Senior Data Scientist - eSankhyiki / Digital Lab',
    'Research Scholar / Statistical Consultant - MoSPI Projects',
  ];

  const departments = [
    'MoSPI Field Operations Division (FOD) - Socioeconomic Surveys',
    'MoSPI National Accounts Division (NAD) - Macroeconomic & GDP Statistics',
    'MoSPI Economic Statistics Division (ESD) - CPI, IIP, ASI Indices',
    'MoSPI Survey Design & Research Division (SDRD) - Sampling & Methodology',
    'MoSPI Data Quality & Dissemination Division (DQDD) - eSankhyiki & Open Data',
    'MoSPI Coordination & Administration Division (CAD) - Cadre Management',
    'National Statistical Systems Training Academy (NSSTA), Greater Noida',
    'National Sample Survey Office (NSSO) - Regional & Zonal Offices',
    'State DES (Directorate of Economics & Statistics) - Andhra Pradesh',
    'State DES (Directorate of Economics & Statistics) - Bihar',
    'State DES (Directorate of Economics & Statistics) - Delhi (NCT)',
    'State DES (Directorate of Economics & Statistics) - Gujarat',
    'State DES (Directorate of Economics & Statistics) - Karnataka',
    'State DES (Directorate of Economics & Statistics) - Kerala',
    'State DES (Directorate of Economics & Statistics) - Madhya Pradesh',
    'State DES (Directorate of Economics & Statistics) - Maharashtra',
    'State DES (Directorate of Economics & Statistics) - Punjab',
    'State DES (Directorate of Economics & Statistics) - Rajasthan',
    'State DES (Directorate of Economics & Statistics) - Tamil Nadu',
    'State DES (Directorate of Economics & Statistics) - Uttar Pradesh',
    'State DES (Directorate of Economics & Statistics) - West Bengal',
    'Ministry Line Department / NITI Aayog - Statistical Cell',
    'Reserve Bank of India (RBI) - Department of Statistics & Information Management',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.designation.trim()) {
      setError('Please enter or select your Cadre / Designation');
      return;
    }
    if (!formData.department.trim()) {
      setError('Please enter or select your Division / Department');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      navigate('/onboarding');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl border border-slate-200 shadow-2xl relative">
        <div className="tricolor-stripe w-full rounded-t-2xl" />

        <div className="p-6 sm:p-10">
          <div className="text-center mb-8 space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-mospi-900 text-amber-400 flex items-center justify-center font-bold text-2xl mx-auto shadow-lg shadow-mospi-900/20">
              सं
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">Officer Cadre Registration</h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Create your official capacity building profile for India's Statistical System.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">Full Name & Title</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-mospi-500 focus:border-mospi-500 outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="officer@mospi.gov.in"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-mospi-500 focus:border-mospi-500 outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1.5">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-mospi-500 focus:border-mospi-500 outline-none transition shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <SearchableDropdown
                  label="Cadre / Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  options={designations}
                  placeholder="Enter or select your designation..."
                  icon={Briefcase}
                  required
                />
              </div>

              <div>
                <SearchableDropdown
                  label="Division / Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departments}
                  placeholder="Enter or select your department..."
                  icon={Building2}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-mospi-900 hover:bg-mospi-800 text-white text-sm font-bold rounded-xl shadow-lg shadow-mospi-900/20 transition flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
            >
              {loading ? 'Creating Profile...' : (
                <>
                  <span>Complete Registration & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Already registered?{' '}
              <Link to="/login" className="text-mospi-900 font-bold hover:underline">
                Sign In to your Dashboard
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
