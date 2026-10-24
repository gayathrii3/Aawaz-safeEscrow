import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../utils/translations';
import { AawazLogo } from './AawazLogo';
import { 
  EyeOff, 
  FileText, 
  Scale, 
  Users2, 
  LogOut,
  Menu,
  X,
  Lock,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    view, 
    setView, 
    setDisguiseActive, 
    triggerQuickExit, 
    currentUser, 
    matches,
    language,
    setLanguage
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[language];

  const handleNavClick = (newView: any) => {
    setView(newView);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 border-b border-rose-500/80 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.25)] transition-all">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* FAR LEFT: App Name & Logo */}
          <div className="flex-1 flex items-center justify-start">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center space-x-3.5 cursor-pointer group select-none shrink-0"
            >
              <AawazLogo size="md" withEcho={true} className="mr-0.5" />
              <div className="flex flex-col">
                <span className="font-serif text-2xl tracking-tight text-white font-normal group-hover:text-rose-100 transition-colors leading-none">
                  Aawaz
                </span>
                <span className="text-[10px] tracking-wide text-rose-100/90 font-medium mt-1.5 hidden sm:block">
                  {t.appSubtitle}
                </span>
              </div>
            </div>
          </div>

          {/* DEAD CENTER: Navigation Bar */}
          <div className="hidden lg:flex flex-none items-center justify-center px-4 xl:px-8">
            <nav className="flex items-center space-x-1 sm:space-x-1.5 px-3 py-1.5 bg-black/15 backdrop-blur-md rounded-full border border-white/20 shadow-inner">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  view === 'dashboard'
                    ? 'bg-white text-rose-700 shadow-sm font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {t.myReports}
              </button>

              <button
                onClick={() => handleNavClick('report_builder')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  view === 'report_builder'
                    ? 'bg-white text-rose-700 shadow-sm font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${view === 'report_builder' ? 'text-rose-600' : 'text-rose-200'}`} />
                <span>{t.recordIncident}</span>
              </button>

              <button
                onClick={() => handleNavClick('matches')}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  view === 'matches'
                    ? 'bg-white text-rose-700 shadow-sm font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <Users2 className={`w-3.5 h-3.5 ${view === 'matches' ? 'text-rose-600' : 'text-rose-200'}`} />
                <span>{t.escrowMatches}</span>
                {matches.length > 0 && (
                  <span className="flex h-2 w-2 relative ml-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNavClick('rights')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                  view === 'rights'
                    ? 'bg-white text-rose-700 shadow-sm font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                <Scale className={`w-3.5 h-3.5 ${view === 'rights' ? 'text-rose-600' : 'text-rose-200'}`} />
                <span>{t.knowYourRights}</span>
              </button>

              <button
                onClick={() => handleNavClick('reviewer')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  view === 'reviewer'
                    ? 'bg-white text-rose-700 shadow-sm font-bold'
                    : 'text-white/85 hover:text-white hover:bg-white/15'
                }`}
              >
                {t.icReviewer}
              </button>
            </nav>
          </div>

          {/* FAR RIGHT: Language & Quick Exit */}
          <div className="flex-1 flex items-center justify-end space-x-3 sm:space-x-4 pl-8 lg:pl-12 xl:pl-16 shrink-0">
            
            {/* Segmented Language Pill */}
            <div className="flex items-center bg-black/15 p-0.5 rounded-full border border-white/20 shadow-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  language === 'en'
                    ? 'bg-white text-rose-700 shadow-xs font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  language === 'te'
                    ? 'bg-white text-rose-700 shadow-xs font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
                title="తెలుగు"
              >
                తె
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-white text-rose-700 shadow-xs font-bold'
                    : 'text-white/80 hover:text-white'
                }`}
                title="हिन्दी"
              >
                हि
              </button>
            </div>

            {/* Subtle Divider before Quick Exit */}
            <span className="hidden sm:inline-block w-px h-5 bg-white/30" />

            {/* Quick Exit Button (High-Contrast White Button) */}
            <button
              onClick={() => setDisguiseActive(true)}
              title="Instantly switch to student notes disguise"
              className="flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-bold text-rose-800 bg-white hover:bg-rose-50 shadow-md border border-white/80 active:scale-95 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              <span>{t.quickExit}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full text-white hover:bg-white/15 transition-colors ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-rose-500/80 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                view === 'dashboard' ? 'bg-white text-rose-700 font-bold' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <span>{t.myReports}</span>
            </button>

            <button
              onClick={() => handleNavClick('report_builder')}
              className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                view === 'report_builder' ? 'bg-white text-rose-700 font-bold' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <FileText className="w-4 h-4 text-white" />
              <span>{t.recordIncident}</span>
            </button>

            <button
              onClick={() => handleNavClick('matches')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                view === 'matches' ? 'bg-white text-rose-700 font-bold' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users2 className="w-4 h-4 text-white" />
                <span>{t.escrowMatches}</span>
              </div>
              {matches.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-rose-700">
                  {matches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => handleNavClick('rights')}
              className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                view === 'rights' ? 'bg-white text-rose-700 font-bold' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <Scale className="w-4 h-4 text-white" />
              <span>{t.knowYourRights}</span>
            </button>

            <button
              onClick={() => handleNavClick('reviewer')}
              className={`w-full flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                view === 'reviewer' ? 'bg-white text-rose-700 font-bold' : 'text-white/90 hover:bg-white/15'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-white" />
              <span>{t.icReviewer}</span>
            </button>

            {/* Mobile Vault ID badge */}
            <div className="pt-2 px-4 flex items-center space-x-2 text-[11px] text-rose-100 font-mono border-t border-rose-500/80 mt-2">
              <Lock className="w-3.5 h-3.5 text-white" />
              <span>Vault: {currentUser.pseudonym}</span>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
