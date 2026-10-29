import React from 'react';
import { Terminal, Trash2, X, CheckCircle, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { LogEntry, Language } from '../types';
import { translations } from '../i18n/translations';

interface TerminalLogsProps {
  isOpen: boolean;
  logs: LogEntry[];
  onClear: () => void;
  onClose: () => void;
  language: Language;
}

export const TerminalLogs: React.FC<TerminalLogsProps> = ({
  isOpen,
  logs,
  onClear,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="rounded-xl bg-slate-950/90 border border-slate-800 p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">{t.logTitle}</span>
          <span className="text-[10px] text-slate-500 font-sans">({logs.length} events)</span>
        </div>

        <div className="flex items-center gap-2">
          {logs.length > 0 && (
            <button
              onClick={onClear}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-red-400 px-2 py-0.5 rounded hover:bg-slate-900 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearLogs}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2 pr-1 select-text">
        {logs.length === 0 ? (
          <div className="py-6 text-center text-slate-500 font-sans text-xs">
            {t.noLogsYet}
          </div>
        ) : (
          logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            });

            const getIcon = () => {
              switch (log.level) {
                case 'success':
                  return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
                case 'error':
                  return <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />;
                case 'warn':
                  return <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
                case 'info':
                default:
                  return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
              }
            };

            return (
              <div
                key={log.id}
                className="flex items-start gap-2 p-1.5 rounded bg-slate-900/50 border border-slate-800/60 text-slate-300"
              >
                {getIcon()}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[10px] text-slate-500 tabular-nums">[{timeStr}]</span>
                    <span
                      className={`font-semibold ${
                        log.level === 'error'
                          ? 'text-red-300'
                          : log.level === 'warn'
                          ? 'text-amber-300'
                          : log.level === 'success'
                          ? 'text-emerald-300'
                          : 'text-slate-200'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                  {log.details && (
                    <div className="text-[11px] text-cyan-400/90 mt-0.5 break-all pl-2 border-l border-slate-700">
                      {log.details}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
