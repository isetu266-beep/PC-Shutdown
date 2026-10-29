import React from 'react';
import { MousePointer, Activity, Info, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface InactivityInputsProps {
  thresholdMinutes: number;
  onChangeThreshold: (mins: number) => void;
  disabled: boolean;
  currentIdleSeconds: number;
  isUserActive: boolean;
  language: Language;
}

export const InactivityInputs: React.FC<InactivityInputsProps> = ({
  thresholdMinutes,
  onChangeThreshold,
  disabled,
  currentIdleSeconds,
  isUserActive,
  language,
}) => {
  const t = translations[language];

  const presets = [
    { mins: 5, label: '5 Min' },
    { mins: 10, label: '10 Min' },
    { mins: 15, label: '15 Min' },
    { mins: 30, label: '30 Min' },
    { mins: 60, label: '1 Hour' },
  ];

  const handleSelectPreset = (mins: number) => {
    if (disabled) return;
    sound.playClick(0.2);
    onChangeThreshold(mins);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
    const clamped = isNaN(val) ? 1 : Math.max(1, Math.min(720, val));
    onChangeThreshold(clamped);
  };

  const formatIdle = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3.5">
      {/* Live System Activity Monitor Banner */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-3 h-3 rounded-full transition-colors ${
              isUserActive
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
            }`}
          />
          <div>
            <span className="text-xs font-semibold text-slate-200">
              {isUserActive ? t.inactivityStatusActive : t.inactivityStatusIdle}
            </span>
            <span className="text-[11px] text-slate-400 block font-mono">
              Idle time: <strong className="text-cyan-400">{formatIdle(currentIdleSeconds)}</strong> / {thresholdMinutes}m
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Win32 Input API</span>
        </div>
      </div>

      {/* Preset Inactivity Options */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <MousePointer className="w-3.5 h-3.5 text-blue-400" />
            <span>{t.idleThreshold}</span>
          </label>
          <span className="text-xs text-slate-400">
            Current: <strong className="text-cyan-400">{thresholdMinutes} min</strong>
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {presets.map((p) => {
            const isSelected = thresholdMinutes === p.mins;
            return (
              <button
                key={p.mins}
                type="button"
                disabled={disabled}
                onClick={() => handleSelectPreset(p.mins)}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-950/80 border-blue-500/80 text-white shadow-sm ring-1 ring-blue-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-900'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {p.label}
              </button>
            );
          })}

          {/* Custom Input */}
          <div className="col-span-1 relative">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              value={thresholdMinutes}
              onChange={handleCustomChange}
              onFocus={(e) => e.target.select()}
              placeholder="Min"
              className="w-full text-center py-2 px-1 text-xs font-mono font-bold bg-slate-950/80 border border-slate-800 rounded-lg text-white focus:border-blue-500 focus:outline-none disabled:opacity-40"
              title="Custom Inactivity Minutes"
            />
          </div>
        </div>
      </div>

      {/* Explanatory Info Box */}
      <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40 text-[11px] text-blue-200/90 flex items-start gap-2">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.idleExplanation} Moving the mouse or pressing any key instantly resets the idle timer back to 0.
        </p>
      </div>
    </div>
  );
};
