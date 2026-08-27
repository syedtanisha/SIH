import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  BrainCircuit, 
  BookOpen, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  X,
  Building2,
  Award,
  Layers
} from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Gap Analysis', path: '/gap-analysis', icon: BrainCircuit },
    { name: 'For You', path: '/recommendations', icon: Compass },
    { name: 'Learning Path', path: '/learning-path', icon: Layers },
    { name: 'Govt Hub', path: '/hub', icon: Building2 },
    { name: 'AI Studio', path: '/studio', icon: Sparkles },
    { name: 'My Progress', path: '/progress', icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-slate-200">
      {/* Tricolor top indicator */}
      <div className="tricolor-stripe w-full" />

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-mospi-900 flex items-center justify-center text-white font-bold shadow-md group-hover:bg-mospi-800 transition">
              <span className="text-amber-400 text-lg">सं</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-mospi-700 bg-mospi-50 px-1.5 py-0.5 rounded border border-mospi-200">
                  MoSPI • NSSTA
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-1 rounded">
                  Official Cadre Platform
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                StatLearn AI <span className="text-xs font-normal text-slate-500 hidden sm:inline">| Official Statistical Capacity</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition ${
                      isActive
                        ? 'bg-mospi-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-mospi-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Profile / Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-800 hover:bg-slate-200 transition"
                >
                  <div className="w-5 h-5 rounded-full bg-mospi-700 text-white flex items-center justify-center font-bold text-[10px]">
                    {user?.full_name?.charAt(0) || 'O'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold leading-tight line-clamp-1">{user?.full_name}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{user?.designation || 'Officer'}</p>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:text-mospi-900 transition"
                >
                  Officer Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-mospi-900 hover:bg-mospi-800 rounded-md shadow-sm transition"
                >
                  Register Cadre
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {isAuthenticated ? (
            <>
              <div className="py-2 mb-2 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-mospi-900 text-white flex items-center justify-center font-bold text-sm">
                  {user?.full_name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{user?.full_name}</p>
                  <p className="text-xs text-slate-500">{user?.designation} • {user?.department}</p>
                </div>
              </div>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-mospi-50 hover:text-mospi-900"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-slate-100 mt-2 flex justify-between">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-slate-600 hover:text-mospi-900 flex items-center gap-1"
                >
                  <User className="w-3.5 h-3.5" /> Profile Settings
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="text-xs text-red-600 flex items-center gap-1 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md"
              >
                Officer Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-white bg-mospi-900 rounded-md"
              >
                Register Cadre
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
