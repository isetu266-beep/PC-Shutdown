import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, RotateCcw, Sparkles } from 'lucide-react';
import { TimeUnits, Language, PresetTimer } from '../types';
import { translations, Translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface TimeInputsProps {
  timeUnits: TimeUnits;
  onChange: (units: TimeUnits) => void;
  disabled: boolean;
  language: Language;
}

export const TimeInputs: React.FC<TimeInputsProps> = ({
  timeUnits,
  onChange,
  disabled,
  language,
}) => {
  const t = translations[language];

  // Local string states to allow seamless typing (including deleting or typing 0)
  const [hoursStr, setHoursStr] = useState<string>(timeUnits.hours.toString());
  const [minutesStr, setMinutesStr] = useState<string>(timeUnits.minutes.toString());
  const [secondsStr, setSecondsStr] = useState<string>(timeUnits.seconds.toString());

  // Synchronize when external props change (e.g. Preset click, Reset click)
  useEffect(() => {
    setHoursStr(timeUnits.hours.toString());
  }, [timeUnits.hours]);

  useEffect(() => {
    setMinutesStr(timeUnits.minutes.toString());
  }, [timeUnits.minutes]);

  useEffect(() => {
    setSecondsStr(timeUnits.seconds.toString());
  }, [timeUnits.seconds]);

  const presets: PresetTimer[] = [
    { id: '5m', labelKey: 'preset5m', defaultLabel: '5 Min', hours: 0, minutes: 5, seconds: 0 },
    { id: '15m', labelKey: 'preset15m', defaultLabel: '15 Min', hours: 0, minutes: 15, seconds: 0 },
    { id: '30m', labelKey: 'preset30m', defaultLabel: '30 Min', hours: 0, minutes: 30, seconds: 0 },
    { id: '1h', labelKey: 'preset1h', defaultLabel: '1 Hour', hours: 1, minutes: 0, seconds: 0 },
    { id: '2h', labelKey: 'preset2h', defaultLabel: '2 Hours', hours: 2, minutes: 0, seconds: 0 },
    { id: '4h', labelKey: 'preset4h', defaultLabel: '4 Hours', hours: 4, minutes: 0, seconds: 0 },
  ];

  const handleHoursInput = (valStr: string) => {
    if (disabled) return;
    setHoursStr(valStr);
    const parsed = parseInt(valStr, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(999, parsed));
    onChange({ ...timeUnits, hours: clamped });
  };

  const handleMinutesInput = (valStr: string) => {
    if (disabled) return;
    setMinutesStr(valStr);
    const parsed = parseInt(valStr, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(59, parsed));
    onChange({ ...timeUnits, minutes: clamped });
  };

  const handleSecondsInput = (valStr: string) => {
    if (disabled) return;
    setSecondsStr(valStr);
    const parsed = parseInt(valStr, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(59, parsed));
    onChange({ ...timeUnits, seconds: clamped });
  };

  const handleStep = (unit: 'hours' | 'minutes' | 'seconds', delta: number) => {
    if (disabled) return;
    sound.playClick(0.2);
    if (unit === 'hours') {
      const nextH = Math.max(0, Math.min(999, timeUnits.hours + delta));
      onChange({ ...timeUnits, hours: nextH });
    } else if (unit === 'minutes') {
      let nextM = timeUnits.minutes + delta;
      if (nextM > 59) nextM = 0;
      if (nextM < 0) nextM = 59;
      onChange({ ...timeUnits, minutes: nextM });
    } else if (unit === 'seconds') {
      let nextS = timeUnits.seconds + delta;
      if (nextS > 59) nextS = 0;
      if (nextS < 0) nextS = 59;
      onChange({ ...timeUnits, seconds: nextS });
    }
  };

  const applyPreset = (preset: PresetTimer) => {
    if (disabled) return;
    sound.playClick(0.25);
    onChange({
      hours: preset.hours,
      minutes: preset.minutes,
      seconds: preset.seconds,
    });
  };

  const handleClear = () => {
    if (disabled) return;
    sound.playClick(0.2);
    onChange({ hours: 0, minutes: 0, seconds: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Three Numeric Input Fields with Stepper Controls */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Hours Field */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            {t.hours} (0-999)
          </label>
          <div className="flex items-center gap-1 w-full justify-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              value={hoursStr}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onBlur={() => setHoursStr(timeUnits.hours.toString())}
              onChange={(e) => handleHoursInput(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl font-bold font-mono bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg py-2 text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('hours', 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Increment Hours"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('hours', -1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Decrement Hours"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Minutes Field */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            {t.minutes} (0-59)
          </label>
          <div className="flex items-center gap-1 w-full justify-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              value={minutesStr}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onBlur={() => setMinutesStr(timeUnits.minutes.toString())}
              onChange={(e) => handleMinutesInput(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl font-bold font-mono bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg py-2 text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('minutes', 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Increment Minutes"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('minutes', -1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Decrement Minutes"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Seconds Field */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col items-center">
          <label className="text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
            {t.seconds} (0-59)
          </label>
          <div className="flex items-center gap-1 w-full justify-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              value={secondsStr}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onBlur={() => setSecondsStr(timeUnits.seconds.toString())}
              onChange={(e) => handleSecondsInput(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-2xl font-bold font-mono bg-slate-950/80 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-lg py-2 text-white placeholder-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('seconds', 1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Increment Seconds"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleStep('seconds', -1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Decrement Seconds"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-medium">{t.presets}:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => {
            const label = (t as unknown as Record<string, string>)[p.labelKey] || p.defaultLabel;
            return (
              <button
                key={p.id}
                type="button"
                disabled={disabled}
                onClick={() => applyPreset(p)}
                className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {label}
              </button>
            );
          })}

          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="px-2 py-1 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer"
            title="Clear Inputs (00:00:00)"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[11px]">{t.reset}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
