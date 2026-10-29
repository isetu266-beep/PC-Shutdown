import React from 'react';
import { AlertTriangle, Power, Clock, X, ShieldAlert } from 'lucide-react';
import { PowerAction, Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface ConfirmationModalProps {
  isOpen: boolean;
  isImmediateShutdown: boolean;
  action: PowerAction;
  durationSeconds: number;
  onConfirm: () => void;
  onCancel: () => void;
  language: Language;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  isImmediateShutdown,
  action,
  durationSeconds,
  onConfirm,
  onCancel,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.floor((durationSeconds % 3600) / 60);
  const seconds = durationSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  const durationText = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  const targetDate = new Date(Date.now() + durationSeconds * 1000);
  const targetTimeText = targetDate.toLocaleTimeString(language === 'bn' ? 'bn-BD' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const getActionName = () => {
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

  const handleConfirm = () => {
    sound.playClick(0.3);
    onConfirm();
  };

  const handleCancel = () => {
    sound.playClick(0.2);
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Accent top gradient stripe */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isImmediateShutdown
              ? 'bg-gradient-to-r from-red-600 to-amber-500'
              : 'bg-gradient-to-r from-blue-600 via-cyan-500 to-sky-400'
          }`}
        />

        {/* Close cross */}
        <button
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isImmediateShutdown
                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}
          >
            {isImmediateShutdown ? (
              <Power className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isImmediateShutdown ? t.shutdownNowConfirmTitle : t.confirmTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Operation: <strong className="text-slate-200">{getActionName()}</strong>
            </p>
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="rounded-xl bg-slate-950/80 border border-slate-800 p-4 space-y-3 mb-5">
          <p className="text-sm text-slate-200 leading-relaxed">
            {isImmediateShutdown ? t.shutdownNowConfirmWarning : t.confirmWarning}
          </p>

          <div className="flex items-start gap-2 text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/40 rounded-lg p-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <span>{t.confirmWarningUnsaved}</span>
          </div>

          {!isImmediateShutdown && (
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px] font-sans">{t.confirmCountdownInfo}</span>
                <span className="text-base font-bold text-cyan-400 tabular-nums">{durationText}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px] font-sans">{t.confirmTargetTime}</span>
                <span className="text-base font-bold text-white tabular-nums">{targetTimeText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
          >
            {t.cancelButton}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white shadow-lg transition-all cursor-pointer ${
              isImmediateShutdown
                ? 'bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-red-600/30'
                : 'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            {isImmediateShutdown ? t.shutdownNowButton : t.confirmButton}
          </button>
        </div>
      </div>
    </div>
  );
};
