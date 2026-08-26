import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, ArrowRight, Lock, Mail, User, Building2, Briefcase } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    designation: 'Statistical Investigator',
    department: 'MoSPI Field Operations Division (FOD)',
    organization: 'Government of India',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const designations = [
    'Indian Statistical Service (ISS) - Director / Dy. Director',
    'Indian Statistical Service (ISS) - Assistant Director',
    'Subordinate Statistical Service (SSS) - Senior Statistical Officer (SSO)',
    'Subordinate Statistical Service (SSS) - Junior Statistical Officer (JSO)',
    'Statistical Investigator Grade I/II',
    'State Directorate of Economics & Statistics (DES) Officer',
    'Data Analyst / Research Scholar',
  ];

  const departments = [
    'MoSPI Field Operations Division (FOD)',
    'MoSPI National Accounts Division (NAD)',
    'MoSPI Economic Statistics Division (ESD)',
    'MoSPI Survey Design & Research Division (SDRD)',
    'MoSPI Data Quality & Dissemination Division (DQDD)',
    'State DES (Directorate of Economics & Statistics)',
    'Ministry Line Department / NITI Aayog',
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      <div className="max-w-lg w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="tricolor-stripe w-full" />

        <div className="p-8">
          <div className="text-center mb-6 space-y-1">
            <div className="w-12 h-12 rounded-xl bg-mospi-900 text-amber-400 flex items-center justify-center font-bold text-xl mx-auto shadow-md">
              सं
            </div>
            <h2 className="text-xl font-bold text-slate-900">Officer Cadre Registration</h2>
            <p className="text-xs text-slate-500">
              Create your official capacity building profile for India's Statistical System.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Title</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="full_name"
                  required
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="e.g. Dr. Rajesh Kumar"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-mospi-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="officer@mospi.gov.in"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-mospi-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-mospi-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cadre / Designation</label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  {designations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Division / Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-mospi-500"
                >
                  {departments.map((dep) => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-mospi-900 hover:bg-mospi-800 text-white text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Profile...' : (
                <>
                  <span>Complete Registration & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
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
