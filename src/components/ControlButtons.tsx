import React from 'react';
import { Play, Pause, XCircle, RotateCcw, Power } from 'lucide-react';
import { TimerStatus, Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface ControlButtonsProps {
  status: TimerStatus;
  canStart: boolean;
  onStartClick: () => void;
  onPauseClick: () => void;
  onResumeClick: () => void;
  onCancelClick: () => void;
  onResetClick: () => void;
  onImmediateShutdownClick: () => void;
  language: Language;
}

export const ControlButtons: React.FC<ControlButtonsProps> = ({
  status,
  canStart,
  onStartClick,
  onPauseClick,
  onResumeClick,
  onCancelClick,
  onResetClick,
  onImmediateShutdownClick,
  language,
}) => {
  const t = translations[language];
  const isRunning = status === 'running' || status === 'warning';
  const isPaused = status === 'paused';
  const isIdleOrCancelled = status === 'idle' || status === 'cancelled' || status === 'completed';

  const handleStart = () => {
    sound.playClick(0.3);
    onStartClick();
  };

  const handlePause = () => {
    sound.playClick(0.3);
    onPauseClick();
  };

  const handleResume = () => {
    sound.playClick(0.3);
    onResumeClick();
  };

  const handleCancel = () => {
    sound.playCancel(0.35);
    onCancelClick();
  };

  const handleReset = () => {
    sound.playClick(0.25);
    onResetClick();
  };

  const handleShutdownNow = () => {
    sound.playWarningAlert(0.4);
    onImmediateShutdownClick();
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Primary Action Controls */}
      <div>
        {/* State 1: Idle / Cancelled / Completed */}
        {isIdleOrCancelled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              disabled={!canStart}
              onClick={handleStart}
              className="sm:col-span-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold tracking-wide text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.startTimer}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Reset all inputs and timer to 00:00:00"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>{t.reset}</span>
            </button>
          </div>
        )}

        {/* State 2: Running / Countdown active */}
        {isRunning && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handlePause}
              className="sm:col-span-2 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold tracking-wide text-sm bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-lg shadow-amber-600/30 border border-amber-400/30 transition-all cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>{t.pause}</span>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold tracking-wide text-sm bg-red-950/80 hover:bg-red-900/90 active:bg-red-950 text-red-200 border border-red-700/60 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.cancel}</span>
            </button>
          </div>
        )}

        {/* State 3: Paused - shows Resume, Cancel, and Reset */}
        {isPaused && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleResume}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold tracking-wide text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t.resume}</span>
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold tracking-wide text-sm bg-red-950/80 hover:bg-red-900/90 active:bg-red-950 text-red-200 border border-red-700/60 shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>{t.cancel}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
              title="Reset all inputs and timer to 00:00:00"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>{t.reset}</span>
            </button>
          </div>
        )}
      </div>

      {/* Secondary Bottom Strip: Emergency Immediate Shutdown */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
        <div className="text-xs text-slate-400 hidden sm:block">
          <span>Windows command is dispatched only when countdown reaches 00:00:00.</span>
        </div>

        <button
          type="button"
          onClick={handleShutdownNow}
          className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/50 hover:border-red-600/60 transition-colors cursor-pointer"
          title="Requires confirmation dialog"
        >
          <Power className="w-3.5 h-3.5 text-red-400" />
          <span>{t.shutdownNow}</span>
        </button>
      </div>
    </div>
  );
};
