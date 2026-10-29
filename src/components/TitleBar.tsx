import React, { useState, useEffect } from 'react';
import { Minus, Square, Copy, X, ShieldAlert, Monitor, Globe, Settings, Terminal, PackageCheck } from 'lucide-react';
import { Language, SystemInfo } from '../types';
import { translations } from '../i18n/translations';

interface TitleBarProps {
  systemInfo: SystemInfo;
  isDryRun: boolean;
  language: Language;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
  onToggleLogs: () => void;
  onOpenPackageGuide: () => void;
  showLogs: boolean;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  systemInfo,
  isDryRun,
  language,
  onToggleLanguage,
  onOpenSettings,
  onToggleLogs,
  onOpenPackageGuide,
  showLogs,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const t = translations[language];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI?.onWindowStateChanged) {
      const cleanup = window.electronAPI.onWindowStateChanged((data) => {
        setIsMaximized(data.isMaximized);
      });
      return cleanup;
    }
  }, []);

  const handleMinimize = () => {
    if (window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI?.maximizeWindow) {
      const maximized = await window.electronAPI.maximizeWindow();
      setIsMaximized(maximized);
    }
  };

  const handleClose = () => {
    if (window.electronAPI?.closeWindow) {
      window.electronAPI.closeWindow();
    }
  };

  return (
    <header className="h-10 bg-slate-950/90 backdrop-blur border-b border-slate-800/80 flex items-center justify-between px-3 select-none z-40 relative">
      {/* Left: App icon & Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-600/20 border border-blue-500/40 text-blue-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <path d="M12 2v6" strokeLinecap="round" />
            <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" />
          </svg>
        </div>
        <span className="text-xs font-semibold tracking-wide text-slate-200">
          {t.appName}
        </span>

        {/* Environment & Safety Indicators */}
        <div className="hidden sm:flex items-center gap-1.5 ml-2 text-[11px]">
          {systemInfo.isElectron ? (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 font-medium">
              <Monitor className="w-3 h-3" />
              <span>{t.desktopApp}</span>
            </span>
          ) : (
            <button
              onClick={onOpenPackageGuide}
              title="Click to view Windows .EXE packaging instructions"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-950/50 border border-blue-800/60 text-blue-300 hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>{t.webPreview}</span>
            </button>
          )}

          {isDryRun && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-medium">
              <ShieldAlert className="w-3 h-3" />
              <span>{t.testModeActive}</span>
            </span>
          )}
        </div>
      </div>

      {/* Right: Quick Tools & Window Controls */}
      <div className="flex items-center gap-1">
        {/* Packaging Guide CTA */}
        <button
          onClick={onOpenPackageGuide}
          className="flex items-center gap-1 px-2 py-1 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 rounded transition-colors"
          title="Windows .EXE Build Guide"
        >
          <PackageCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden md:inline text-[11px] font-medium">{t.exportPackager}</span>
        </button>

        {/* Diagnostics & Logs Toggle */}
        <button
          onClick={onToggleLogs}
          className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
            showLogs
              ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
          }`}
          title={t.logs}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px] font-medium">{t.logs}</span>
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLanguage}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded transition-colors"
          title="Switch Language (English / বাংলা)"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] font-semibold">{language === 'en' ? 'বাংলা' : 'EN'}</span>
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/70 rounded transition-colors"
          title={t.settings}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>

        {/* Native Electron Window Controls */}
        {systemInfo.isElectron && (
          <div className="flex items-center ml-1 border-l border-slate-800 pl-1">
            <button
              onClick={handleMinimize}
              className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-sm transition-colors"
              title="Minimize"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleMaximize}
              className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 rounded-sm transition-colors"
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? <Copy className="w-3.5 h-3.5" /> : <Square className="w-3 h-3" />}
            </button>
            <button
              onClick={handleClose}
              className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-red-600 rounded-sm transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
