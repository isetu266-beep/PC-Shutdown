import React from 'react';
import { TimerStatus, PowerAction, Language } from '../types';
import { translations } from '../i18n/translations';
import { Power, RotateCcw, Moon, Lock, ShieldAlert, Clock } from 'lucide-react';

interface DigitalDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: TimerStatus;
  action: PowerAction;
  targetTimestamp: number | null;
  language: Language;
}

export const DigitalDisplay: React.FC<DigitalDisplayProps> = ({
  remainingSeconds,
  totalSeconds,
  status,
  action,
  targetTimestamp,
  language,
}) => {
  const t = translations[language];

  // Calculate HH, MM, SS
  const hours = Math.floor(remainingSeconds / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formattedHours = hours > 99 ? hours.toString() : pad(hours);
  const formattedMinutes = pad(minutes);
  const formattedSeconds = pad(seconds);

  // Calculate percentage
  const progressPercent =
    totalSeconds > 0
      ? Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
      : 0;

  // Status badge styling
  const getStatusBadge = () => {
    switch (status) {
      case 'running':
        return {
          text: t.statusRunning,
          bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40',
          dot: 'bg-blue-400 animate-pulse'
        };
      case 'paused':
        return {
          text: t.statusPaused,
          bg: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          dot: 'bg-amber-400'
        };
      case 'warning':
        return {
          text: t.statusWarning,
          bg: 'bg-red-950/90 text-red-300 border-red-500/60 animate-pulse',
          dot: 'bg-red-500'
        };
      case 'shutting_down':
        return {
          text: t.statusShuttingDown,
          bg: 'bg-purple-950/90 text-purple-300 border-purple-500/60',
          dot: 'bg-purple-400 animate-ping'
        };
      case 'completed':
        return {
          text: t.statusCompleted,
          bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
          dot: 'bg-emerald-400'
        };
      case 'cancelled':
        return {
          text: t.statusCancelled,
          bg: 'bg-slate-800 text-slate-400 border-slate-700',
          dot: 'bg-slate-500'
        };
      case 'idle':
      default:
        return {
          text: t.statusReady,
          bg: 'bg-slate-900/90 text-slate-400 border-slate-800',
          dot: 'bg-slate-500'
        };
    }
  };

  const statusBadge = getStatusBadge();

  // Action Icon
  const getActionIcon = () => {
    switch (action) {
      case 'shutdown':
        return <Power className="w-4 h-4 text-red-400" />;
      case 'restart':
        return <RotateCcw className="w-4 h-4 text-blue-400" />;
      case 'sleep':
      case 'hibernate':
        return <Moon className="w-4 h-4 text-amber-400" />;
      case 'lock':
        return <Lock className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getActionLabel = () => {
    switch (action) {
      case 'shutdown':
        return t.actionShutdown;
      case 'restart':
        return t.actionRestart;
      case 'sleep':
        return t.actionSleep;
      case 'hibernate':
        return t.actionHibernate;
      case 'lock':
        return t.actionLock;
    }
  };

  // Expected target execution time string
  const targetTimeString = targetTimestamp
    ? new Date(targetTimestamp).toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    : null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-800 p-6 shadow-2xl flex flex-col items-center justify-center">
      {/* Subtle radial glow behind timer */}
      <div
        className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          status === 'warning'
            ? 'bg-red-500/15 opacity-100'
            : status === 'running'
            ? 'bg-blue-500/15 opacity-100'
            : status === 'paused'
            ? 'bg-amber-500/10 opacity-70'
            : 'bg-slate-800/20 opacity-40'
        }`}
      />

      {/* Top row: Status Badge & Target Action */}
      <div className="w-full flex items-center justify-between gap-4 mb-4 z-10">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border ${statusBadge.bg}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
          <span>{statusBadge.text}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
          {getActionIcon()}
          <span>{getActionLabel()}</span>
        </div>
      </div>

      {/* Central Big Digital Countdown: HH : MM : SS */}
      <div className="my-2 flex items-center justify-center gap-2 sm:gap-4 font-mono select-none z-10">
        {/* Hours block */}
        <div className="flex flex-col items-center">
          <div className="px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-inner flex items-center justify-center min-w-[70px] sm:min-w-[100px]">
            <span className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white tabular-nums drop-shadow-[0_0_24px_rgba(56,189,248,0.25)]">
              {formattedHours}
            </span>
          </div>
          <span className="mt-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            {t.hours}
          </span>
        </div>

        {/* Colon separator */}
        <div className="text-3xl sm:text-5xl font-bold text-slate-600 mb-6 select-none animate-pulse">
          :
        </div>

        {/* Minutes block */}
        <div className="flex flex-col items-center">
          <div className="px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl bg-slate-950/80 border border-slate-800/90 shadow-inner flex items-center justify-center min-w-[70px] sm:min-w-[100px]">
            <span className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white tabular-nums drop-shadow-[0_0_24px_rgba(56,189,248,0.25)]">
              {formattedMinutes}
            </span>
          </div>
          <span className="mt-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            {t.minutes}
          </span>
        </div>

        {/* Colon separator */}
        <div className="text-3xl sm:text-5xl font-bold text-slate-600 mb-6 select-none animate-pulse">
          :
        </div>

        {/* Seconds block */}
        <div className="flex flex-col items-center">
          <div
            className={`px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl border shadow-inner flex items-center justify-center min-w-[70px] sm:min-w-[100px] transition-colors ${
              remainingSeconds <= 30 && remainingSeconds > 0 && status === 'running'
                ? 'bg-red-950/50 border-red-500/50'
                : 'bg-slate-950/80 border-slate-800/90'
            }`}
          >
            <span
              className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight tabular-nums transition-colors ${
                remainingSeconds <= 30 && remainingSeconds > 0 && status === 'running'
                  ? 'text-red-400 drop-shadow-[0_0_24px_rgba(239,68,68,0.4)]'
                  : 'text-cyan-400 drop-shadow-[0_0_24px_rgba(56,189,248,0.25)]'
              }`}
            >
              {formattedSeconds}
            </span>
          </div>
          <span className="mt-2 text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
            {t.seconds}
          </span>
        </div>
      </div>

      {/* Progress Bar & Target Time info */}
      <div className="w-full mt-6 z-10">
        <div className="w-full h-2 rounded-full bg-slate-950 border border-slate-800/80 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-300 rounded-full ${
              status === 'warning'
                ? 'bg-gradient-to-r from-red-600 to-amber-500'
                : status === 'paused'
                ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-mono">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            {targetTimeString ? (
              <span>
                {t.confirmTargetTime} <strong className="text-slate-200">{targetTimeString}</strong>
              </span>
            ) : (
              <span>{t.timeRemaining}</span>
            )}
          </span>
          <span>{Math.round(progressPercent)}% elapsed</span>
        </div>
      </div>
    </div>
  );
};
