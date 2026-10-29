import React from 'react';
import { Power, RotateCcw, Moon, Lock, ShieldCheck } from 'lucide-react';
import { PowerAction, Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface ActionSelectorProps {
  currentAction: PowerAction;
  onChange: (action: PowerAction) => void;
  disabled: boolean;
  language: Language;
}

export const ActionSelector: React.FC<ActionSelectorProps> = ({
  currentAction,
  onChange,
  disabled,
  language,
}) => {
  const t = translations[language];

  const actions: { id: PowerAction; label: string; desc: string; icon: React.ReactNode; cmd: string }[] = [
    {
      id: 'shutdown',
      label: t.actionShutdown,
      desc: t.actionDescShutdown,
      icon: <Power className="w-4 h-4 text-red-400" />,
      cmd: 'shutdown.exe /s /t 0'
    },
    {
      id: 'restart',
      label: t.actionRestart,
      desc: t.actionDescRestart,
      icon: <RotateCcw className="w-4 h-4 text-blue-400" />,
      cmd: 'shutdown.exe /r /t 0'
    },
    {
      id: 'sleep',
      label: t.actionSleep,
      desc: t.actionDescSleep,
      icon: <Moon className="w-4 h-4 text-amber-400" />,
      cmd: 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0'
    },
    {
      id: 'hibernate',
      label: t.actionHibernate,
      desc: t.actionDescHibernate,
      icon: <Moon className="w-4 h-4 text-purple-400" />,
      cmd: 'shutdown.exe /h'
    },
    {
      id: 'lock',
      label: t.actionLock,
      desc: t.actionDescLock,
      icon: <Lock className="w-4 h-4 text-emerald-400" />,
      cmd: 'rundll32.exe user32.dll,LockWorkStation'
    }
  ];

  const handleSelect = (action: PowerAction) => {
    if (disabled) return;
    sound.playClick(0.2);
    onChange(action);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>{t.selectAction}</span>
        </label>
        <span className="text-[11px] font-mono text-slate-400 truncate max-w-[260px]">
          Target: <code className="text-cyan-400">{actions.find((a) => a.id === currentAction)?.cmd}</code>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {actions.map((act) => {
          const isSelected = currentAction === act.id;
          return (
            <button
              key={act.id}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(act.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                isSelected
                  ? 'bg-blue-950/60 border-blue-500/70 text-white shadow-sm ring-1 ring-blue-500/40'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              } disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
            >
              <div className="mb-1">{act.icon}</div>
              <span className="text-xs font-semibold whitespace-nowrap">{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
