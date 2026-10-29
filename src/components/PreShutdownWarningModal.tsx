import React from 'react';
import { AlertTriangle, XCircle, Power } from 'lucide-react';
import { Language, PowerAction } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface PreShutdownWarningModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  action: PowerAction;
  onAbort: () => void;
  language: Language;
  timerMode?: 'countdown' | 'inactivity';
}

export const PreShutdownWarningModal: React.FC<PreShutdownWarningModalProps> = ({
  isOpen,
  remainingSeconds,
  action,
  onAbort,
  language,
  timerMode = 'countdown',
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const handleAbort = () => {
    sound.playCancel(0.5);
    onAbort();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-950 border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)] p-6 text-center overflow-hidden">
        {/* Pulsing hazard glow */}
        <div className="absolute inset-0 bg-red-500/10 pointer-events-none animate-pulse" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-red-500/20 border-2 border-red-500/60 flex items-center justify-center text-red-500 mb-4 animate-bounce">
            <AlertTriangle className="w-9 h-9" />
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase">
            {t.warningImminentTitle}
          </h2>

          <p className="text-xs sm:text-sm text-red-200 mt-2 max-w-sm">
            {t.warningImminentMessage}
          </p>

          {/* Huge final seconds display */}
          <div className="my-6 px-6 py-3 rounded-2xl bg-red-950/60 border border-red-600/50 shadow-inner">
            <span className="text-6xl sm:text-7xl font-extrabold font-mono text-red-400 tabular-nums tracking-wider drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]">
              00:{remainingSeconds.toString().padStart(2, '0')}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            Action: <strong className="text-white uppercase">{action}</strong> will trigger at 00:00:00
          </p>

          {/* Big Abort button */}
          <button
            type="button"
            onClick={handleAbort}
            className="w-full py-4 px-6 rounded-xl font-extrabold text-base tracking-wider bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-xl shadow-red-600/50 border border-red-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <XCircle className="w-5 h-5 fill-current" />
            <span>{t.abortShutdownNow}</span>
          </button>

          {timerMode === 'inactivity' && (
            <p className="mt-3 text-[11px] text-amber-300/90 bg-amber-950/40 border border-amber-800/60 rounded-lg px-3 py-1.5 leading-tight">
              {language === 'bn'
                ? '💡 যেকোনো মুহূর্তে মাউস নাড়াচাড়া বা কীবোর্ড চাপলে এটি নিজে থেকেই বন্ধ হয়ে যাবে।'
                : '💡 Moving your mouse or pressing any key will immediately dismiss this and reset the timer.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
