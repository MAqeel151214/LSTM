import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Layout() {
  const location = useLocation();
  const isDark = location.pathname !== '/blog';
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={isDark ? 'theme-dark min-h-screen bg-[#0a0e1a]' : 'theme-light min-h-screen bg-[#fafaf9]'}>
      {/* Top Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b transition-colors duration-300 ${
        isDark
          ? 'bg-[#0a0e1a]/85 border-slate-800/80 text-white'
          : 'bg-[#fafaf9]/85 border-[#e7e5e4] text-[#1c1917]'
      }`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <NavLink to="/" className={`font-semibold text-sm tracking-tight flex items-center gap-2 ${
            isDark ? 'text-white' : 'text-[#1c1917]'
          }`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span>LSTM Deep Dive</span>
          </NavLink>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1.5">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-all font-medium ${
                  isActive
                    ? isDark ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-blue-100/70 text-blue-700'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-[#78716c] hover:text-[#1c1917] hover:bg-black/5'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-all font-medium flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-[#78716c] hover:text-[#1c1917] hover:bg-black/5'
                }`
              }
            >
              <span>🎬</span>
              <span>Interactive Explorer</span>
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm transition-all font-medium flex items-center gap-1.5 ${
                  isActive
                    ? isDark ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-amber-100/70 text-amber-800 font-semibold'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-[#78716c] hover:text-[#1c1917] hover:bg-black/5'
                }`
              }
            >
              <span>📝</span>
              <span>Numerical Walkthrough</span>
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-[#78716c] hover:bg-slate-200'
            }`}
            aria-label="Toggle navigation menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className={`md:hidden border-t px-4 py-3 space-y-1 ${
            isDark ? 'bg-[#0a0e1a] border-slate-800' : 'bg-[#fafaf9] border-[#e7e5e4]'
          }`}>
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-[#44403c] hover:bg-slate-200/60'
              }`}
            >
              Overview
            </NavLink>
            <NavLink
              to="/explore"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-[#44403c] hover:bg-slate-200/60'
              }`}
            >
              🎬 Interactive Explorer
            </NavLink>
            <NavLink
              to="/blog"
              onClick={() => setMobileOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-[#44403c] hover:bg-slate-200/60'
              }`}
            >
              📝 Numerical Walkthrough
            </NavLink>
          </div>
        )}
      </nav>

      {/* Page content with top padding for fixed nav */}
      <div className="pt-14">
        <Outlet />
      </div>
    </div>
  );
}
