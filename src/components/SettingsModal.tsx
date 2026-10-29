import React from 'react';
import { X, Volume2, VolumeX, ShieldAlert, Sliders, Bell, Globe, Check } from 'lucide-react';
import { AppSettings, Language } from '../types';
import { translations } from '../i18n/translations';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onClose: () => void;
  language: Language;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onClose,
  language,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const handleToggleSound = () => {
    const nextVal = !settings.playAlertSound;
    onUpdateSettings({ ...settings, playAlertSound: nextVal });
    if (nextVal) sound.playClick(0.3);
  };

  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ ...settings, soundVolume: vol });
    sound.playTick(vol);
  };

  const handleToggleDryRun = () => {
    sound.playClick(0.3);
    onUpdateSettings({ ...settings, isDryRun: !settings.isDryRun });
  };

  const handleToggleForce = () => {
    sound.playClick(0.2);
    onUpdateSettings({ ...settings, forceShutdown: !settings.forceShutdown });
  };

  const handleToggleMinimizeOnStart = () => {
    sound.playClick(0.2);
    onUpdateSettings({ ...settings, minimizeOnStart: !settings.minimizeOnStart });
  };

  const handleToggleCloseToTray = () => {
    sound.playClick(0.2);
    onUpdateSettings({ ...settings, closeToTray: !settings.closeToTray });
  };

  const handleToggleNotifications = () => {
    sound.playClick(0.2);
    onUpdateSettings({
      ...settings,
      showDesktopNotifications: !settings.showDesktopNotifications,
    });
  };

  const handleWarningBufferChange = (seconds: number) => {
    sound.playClick(0.2);
    onUpdateSettings({ ...settings, warningBufferSeconds: seconds });
  };

  const handleLanguageChange = (lang: Language) => {
    sound.playClick(0.2);
    onUpdateSettings({ ...settings, language: lang });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold tracking-tight">{t.settingsTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto py-4 space-y-5 flex-1 pr-1">
          {/* Safe Test Mode (Dry Run) */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-bold text-white">{t.testModeToggle}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {t.testModeExplanation}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleDryRun}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.isDryRun ? 'bg-amber-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.isDryRun ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sound & Audio Alerts */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.playAlertSound ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-sm font-bold text-white">{t.audioAlerts}</span>
              </div>
              <button
                type="button"
                onClick={handleToggleSound}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.playAlertSound ? 'bg-blue-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.playAlertSound ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.playAlertSound && (
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4 text-xs text-slate-300">
                <span>{t.soundVolume}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.1}
                    value={settings.soundVolume}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-28 accent-blue-500 cursor-pointer"
                  />
                  <span className="font-mono text-cyan-400 text-xs w-8 text-right">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Final Warning Alert Window */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-bold text-white">{t.warningBuffer}</span>
            </div>
            <p className="text-xs text-slate-400">
              Shows an urgent countdown modal with audible alerts before the final shutdown execution.
            </p>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {[10, 30, 60, 0].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => handleWarningBufferChange(sec)}
                  className={`py-1.5 px-2 text-xs rounded-lg border font-medium transition-all ${
                    settings.warningBufferSeconds === sec
                      ? 'bg-purple-950/80 border-purple-500/70 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {sec === 0 ? 'Disabled' : `${sec}s`}
                </button>
              ))}
            </div>
          </div>

          {/* Behavior Toggles */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            {/* Force shutdown flag */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">{t.forceShutdownLabel}</span>
                <p className="text-[11px] text-slate-400">{t.forceShutdownDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings.forceShutdown}
                onChange={handleToggleForce}
                className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Minimize on Start */}
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">{t.minimizeOnStartLabel}</span>
                <p className="text-[11px] text-slate-400">Timer will continue accurately in the background.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.minimizeOnStart}
                onChange={handleToggleMinimizeOnStart}
                className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Close to tray */}
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">{t.closeToTrayLabel}</span>
                <p className="text-[11px] text-slate-400">Keeps running in Windows notification area.</p>
              </div>
              <input
                type="checkbox"
                checked={settings.closeToTray}
                onChange={handleToggleCloseToTray}
                className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>

            {/* Desktop Toast Notifications */}
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-0.5">
                <span className="text-xs font-semibold text-white">{t.desktopNotificationsLabel}</span>
                <p className="text-[11px] text-slate-400">{t.desktopNotificationsDesc}</p>
              </div>
              <input
                type="checkbox"
                checked={settings.showDesktopNotifications}
                onChange={handleToggleNotifications}
                className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Language Selection */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">{t.languageSelect}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`py-2 px-3 text-xs rounded-lg border font-semibold flex items-center justify-between transition-all ${
                  language === 'en'
                    ? 'bg-blue-950/80 border-blue-500/70 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>English (US)</span>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('bn')}
                className={`py-2 px-3 text-xs rounded-lg border font-semibold flex items-center justify-between transition-all ${
                  language === 'bn'
                    ? 'bg-blue-950/80 border-blue-500/70 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>বাংলা (Bengali)</span>
                {language === 'bn' && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            </div>
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
