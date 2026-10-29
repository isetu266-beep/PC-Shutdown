import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Package, ShieldCheck, Download, Folder, Monitor } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface PackageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PackageGuideModal: React.FC<PackageGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    sound.playClick(0.2);
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: 'Option A: One-Click Windows Batch Script (Easiest)',
      desc: 'Double-click the included batch script in the root folder. It checks Node.js, installs dependencies, builds Vite, and generates the .exe installer automatically.',
      command: '"Build windows exe.bat"'
    },
    {
      title: 'Option B: Terminal Command - Install & Build Installer (.exe)',
      desc: 'Builds production bundle and generates NSIS Windows installer in release/ directory.',
      command: 'npm run build:exe'
    },
    {
      title: 'Option C: Build Portable Standalone (.exe) without Installation',
      desc: 'Generates a standalone portable .exe file that runs immediately without admin setup.',
      command: 'npm run build:portable'
    },
    {
      title: 'Option D: Run in Local Development Mode',
      desc: 'Launches the native Electron desktop application with hot reload on your desktop.',
      command: 'npm run electron:dev'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Windows Executable (.EXE) Packaging & Build Guide
              </h3>
              <p className="text-xs text-slate-400">
                Official guide to package and run this application on Windows 10 & 11
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4 flex-1 pr-1 text-xs">
          {/* Output location banner */}
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 flex items-start gap-3">
            <Folder className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-blue-200">Where to find your generated .EXE:</span>
              <p className="text-slate-300">
                After running the build, your Windows installer and portable files will be generated at:
              </p>
              <div className="font-mono text-cyan-400 bg-slate-950/90 p-2 rounded border border-slate-800 select-all space-y-1">
                <div>release/Windows Auto Shutdown Timer Setup 1.0.0.exe (Installer)</div>
                <div>release/Windows Auto Shutdown Timer 1.0.0.exe (Portable)</div>
              </div>
            </div>
          </div>

          {/* Safe testing notice */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300">
              <span className="font-bold text-amber-200">How to Test Safely:</span>
              <p>
                1. <strong>Use Safe Test Mode</strong> (toggle in Settings or Title bar) to verify the countdown and alarm sounds without turning off your PC.
              </p>
              <p>
                2. To verify a real shutdown, set a short 10-second timer with Test Mode disabled. <strong>Warning:</strong> Ensure you save all work first!
              </p>
              <p>
                3. The <strong>CANCEL</strong> button will immediately abort both the internal timer and any OS shutdown (<code className="text-amber-300">shutdown /a</code>).
              </p>
            </div>
          </div>

          {/* Step by step build commands */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Terminal Build Commands
            </span>

            {steps.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{step.title}</span>
                  <button
                    onClick={() => copyToClipboard(step.command, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-400 text-[11px]">{step.desc}</p>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded font-mono text-cyan-300 text-[11px] overflow-x-auto">
                  $ {step.command}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
