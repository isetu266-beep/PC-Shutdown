import React from 'react';
import { TimerMode, Language } from '../types';
import { translations } from '../i18n/translations';
import { Clock, MousePointerClick } from 'lucide-react';
import { sound } from '../utils/sound';

interface ModeSelectorProps {
  currentMode: TimerMode;
  onChangeMode: (mode: TimerMode) => void;
  disabled: boolean;
  language: Language;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onChangeMode,
  disabled,
  language,
}) => {
  const t = translations[language];

  const handleSelect = (mode: TimerMode) => {
    if (disabled || mode === currentMode) return;
    sound.playClick(0.2);
    onChangeMode(mode);
  };

  return (
    <div className="w-full bg-slate-900/60 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
      <button
        type="button"
        disabled={disabled}
        onClick={() => handleSelect('countdown')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          currentMode === 'countdown'
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Clock className="w-4 h-4" />
        <span className="truncate">{t.modeCountdown}</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => handleSelect('inactivity')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          currentMode === 'inactivity'
            ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400/40'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <MousePointerClick className="w-4 h-4" />
        <span className="truncate">{t.modeInactivity}</span>
      </button>
    </div>
  );
};
