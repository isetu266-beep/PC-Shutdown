/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TitleBar } from './components/TitleBar';
import { DigitalDisplay } from './components/DigitalDisplay';
import { TimeInputs } from './components/TimeInputs';
import { ControlButtons } from './components/ControlButtons';
import { ActionSelector } from './components/ActionSelector';
import { ModeSelector } from './components/ModeSelector';
import { InactivityInputs } from './components/InactivityInputs';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PreShutdownWarningModal } from './components/PreShutdownWarningModal';
import { SettingsModal } from './components/SettingsModal';
import { TerminalLogs } from './components/TerminalLogs';
import { PackageGuideModal } from './components/PackageGuideModal';
import { ShutdownService } from './utils/shutdownService';
import { sound } from './utils/sound';
import { translations } from './i18n/translations';
import {
  TimerStatus,
  PowerAction,
  TimerMode,
  TimeUnits,
  LogEntry,
  SystemInfo,
  AppSettings,
  Language,
} from './types';

export default function App() {
  // Settings with LocalStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('autoshutdown_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default
      }
    }
    return {
      playAlertSound: true,
      soundVolume: 0.6,
      warningBufferSeconds: 30,
      isDryRun: false,
      closeToTray: true,
      minimizeOnStart: false,
      forceShutdown: false,
      showDesktopNotifications: true,
      language: 'en' as Language,
    };
  });

  const language = settings.language;
  const t = translations[language];

  // System & Environment Info
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    platform: 'unknown',
    isElectron: false,
    isWindows: false,
  });

  // Operating Mode: 'countdown' (Fixed duration) vs 'inactivity' (Auto-Off on mouse/task idle)
  const [timerMode, setTimerMode] = useState<TimerMode>('countdown');

  // Inactivity Mode Settings (default: 10 minutes)
  const [inactivityMinutes, setInactivityMinutes] = useState<number>(10);
  const [currentIdleSeconds, setCurrentIdleSeconds] = useState<number>(0);
  const [isUserActive, setIsUserActive] = useState<boolean>(true);

  // Time Units input state (HH, MM, SS) for Countdown Mode
  const [timeUnits, setTimeUnits] = useState<TimeUnits>({
    hours: 0,
    minutes: 30,
    seconds: 0,
  });

  // Active Countdown & State
  const [totalSeconds, setTotalSeconds] = useState<number>(1800);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(1800);
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [action, setAction] = useState<PowerAction>('shutdown');
  const [targetTimestamp, setTargetTimestamp] = useState<number | null>(null);

  // Modals & Drawers
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isImmediateConfirm, setIsImmediateConfirm] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPackageGuide, setShowPackageGuide] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Activity Logs
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Timer interval & deadline references
  const timerRef = useRef<number | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const lastSoundTickRef = useRef<number | null>(null);

  // Add Log Entry helper
  const addLog = useCallback(
    (message: string, level: LogEntry['level'] = 'info', details?: string) => {
      const entry: LogEntry = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        level,
        message,
        details,
      };
      setLogs((prev) => [entry, ...prev.slice(0, 99)]);
    },
    []
  );

  // Fetch host system info on initial mount
  useEffect(() => {
    ShutdownService.getSystemInfo().then((info) => {
      setSystemInfo(info);
      addLog(
        `Environment initialized: ${info.isElectron ? 'Electron Desktop' : 'Web Browser Preview'}`,
        'info',
        `Platform: ${info.platform} | Node: ${info.nodeVersion || 'N/A'}`
      );
    });
  }, [addLog]);

  // Save settings when changed
  useEffect(() => {
    localStorage.setItem('autoshutdown_settings', JSON.stringify(settings));
  }, [settings]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Live Idle Monitor for UI feedback (samples every 800ms)
  useEffect(() => {
    const idleCheckInterval = window.setInterval(async () => {
      const idleSec = await ShutdownService.getSystemIdleTime();
      setCurrentIdleSeconds(idleSec);
      setIsUserActive(idleSec < 2);
    }, 800);

    return () => clearInterval(idleCheckInterval);
  }, []);

  // Switch between Countdown and Inactivity modes
  const handleModeChange = (newMode: TimerMode) => {
    if (status === 'running' || status === 'warning') return;
    setTimerMode(newMode);
    setErrorMessage(null);

    if (newMode === 'countdown') {
      const total = timeUnits.hours * 3600 + timeUnits.minutes * 60 + timeUnits.seconds;
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setTargetTimestamp(null);
    } else {
      const total = inactivityMinutes * 60;
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setTargetTimestamp(null);
    }
  };

  // Update Inactivity threshold
  const handleInactivityMinutesChange = (mins: number) => {
    setInactivityMinutes(mins);
    if (timerMode === 'inactivity' && (status === 'idle' || status === 'paused')) {
      const total = mins * 60;
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setTargetTimestamp(null);
    }
  };

  // Update totalSeconds and remainingSeconds when user changes inputs while idle or paused
  const handleTimeUnitsChange = (units: TimeUnits) => {
    setTimeUnits(units);
    if (timerMode === 'countdown' && (status === 'idle' || status === 'cancelled' || status === 'completed' || status === 'paused')) {
      const total = units.hours * 3600 + units.minutes * 60 + units.seconds;
      setTotalSeconds(total);
      setRemainingSeconds(total);
      setTargetTimestamp(null);
    }
  };

  // Switch display language
  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'bn' : 'en';
    setSettings((prev) => ({ ...prev, language: nextLang }));
  };

  // Perform the actual shutdown execution when countdown reaches 00:00:00
  const triggerShutdown = useCallback(
    async (targetAction: PowerAction) => {
      setStatus('shutting_down');

      if (settings.playAlertSound) {
        sound.playFinalAlarm(settings.soundVolume);
      }

      addLog(`Countdown finished. Executing ${targetAction} command...`, 'warn');
      ShutdownService.showNotification(
        t.appName,
        `${targetAction.toUpperCase()} command initiated by timer.`
      );

      try {
        const result = await ShutdownService.executeAction(targetAction, {
          force: settings.forceShutdown,
          isDryRun: settings.isDryRun,
        });

        if (result.success) {
          setStatus('completed');
          addLog(
            `Action executed successfully: ${result.command}`,
            'success',
            result.message
          );

          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch {
            // Ignore confetti failure
          }
        } else {
          setStatus('idle');
          const err = result.error || t.errorFailedExecution;
          setErrorMessage(err);
          addLog(`Execution error: ${err}`, 'error', result.command);
        }
      } catch (err: unknown) {
        setStatus('idle');
        const msg = err instanceof Error ? err.message : String(err);
        setErrorMessage(msg);
        addLog(`Execution exception: ${msg}`, 'error');
      }
    },
    [settings, t, addLog]
  );

  // Core Tick Function using absolute deadline for Countdown Mode
  const tickCountdown = useCallback(() => {
    if (!deadlineRef.current) return;

    const now = Date.now();
    const remainingMs = deadlineRef.current - now;
    const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

    setRemainingSeconds(remainingSec);

    // Audio & Warning triggers
    if (remainingSec <= settings.warningBufferSeconds && remainingSec > 0) {
      setStatus('warning');

      if (settings.playAlertSound) {
        if (
          remainingSec === settings.warningBufferSeconds &&
          lastSoundTickRef.current !== remainingSec
        ) {
          sound.playWarningAlert(settings.soundVolume);
          lastSoundTickRef.current = remainingSec;
        } else if (remainingSec === 10 && lastSoundTickRef.current !== 10) {
          sound.playWarningAlert(settings.soundVolume);
          lastSoundTickRef.current = 10;
        } else if (remainingSec <= 5 && lastSoundTickRef.current !== remainingSec) {
          sound.playTick(settings.soundVolume);
          lastSoundTickRef.current = remainingSec;
        }
      }
    }

    // Countdown reached 0
    if (remainingSec <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      deadlineRef.current = null;
      triggerShutdown(action);
    }
  }, [action, settings, triggerShutdown]);

  // Core Tick Function for Inactivity Mode (tracks Win32 idle time)
  const tickInactivity = useCallback(async () => {
    const idleSec = await ShutdownService.getSystemIdleTime();
    setCurrentIdleSeconds(idleSec);
    setIsUserActive(idleSec < 2);

    const totalAllowedSec = inactivityMinutes * 60;
    const remainingSec = Math.max(0, totalAllowedSec - idleSec);
    setRemainingSeconds(remainingSec);

    // If remaining time is within warning buffer
    if (remainingSec <= settings.warningBufferSeconds && remainingSec > 0) {
      setStatus('warning');

      if (settings.playAlertSound) {
        if (
          remainingSec === settings.warningBufferSeconds &&
          lastSoundTickRef.current !== remainingSec
        ) {
          sound.playWarningAlert(settings.soundVolume);
          lastSoundTickRef.current = remainingSec;
        } else if (remainingSec === 10 && lastSoundTickRef.current !== 10) {
          sound.playWarningAlert(settings.soundVolume);
          lastSoundTickRef.current = 10;
        } else if (remainingSec <= 5 && lastSoundTickRef.current !== remainingSec) {
          sound.playTick(settings.soundVolume);
          lastSoundTickRef.current = remainingSec;
        }
      }
    } else if (remainingSec > settings.warningBufferSeconds && status === 'warning') {
      // User moved mouse while warning was visible! Restore to running!
      setStatus('running');
      addLog(
        language === 'bn'
          ? 'মাউসের নড়াচড়া শনাক্ত হয়েছে — সতর্কতা পপআপ বন্ধ এবং টাইমার রিসেট।'
          : 'Mouse activity detected — warning popup dismissed & countdown reset.',
        'info'
      );
    }

    // Inactivity threshold reached 0
    if (remainingSec <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      triggerShutdown(action);
    }
  }, [action, inactivityMinutes, settings, status, triggerShutdown]);

  // Request to Start Timer (opens safety confirmation dialog)
  const handleRequestStart = () => {
    if (timerMode === 'countdown') {
      const total = timeUnits.hours * 3600 + timeUnits.minutes * 60 + timeUnits.seconds;
      if (total <= 0) {
        setErrorMessage(t.errorZeroTime);
        return;
      }
      setTotalSeconds(total);
      setRemainingSeconds(total);
    } else {
      if (inactivityMinutes <= 0) {
        setErrorMessage(t.errorZeroTime);
        return;
      }
      const total = inactivityMinutes * 60;
      setTotalSeconds(total);
      setRemainingSeconds(total);
    }

    setErrorMessage(null);
    setIsImmediateConfirm(false);
    setShowConfirmModal(true);
  };

  // Confirmed Start from dialog
  const handleConfirmStart = () => {
    setShowConfirmModal(false);

    // Prevent duplicate intervals
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerMode === 'countdown') {
      const currentDuration = remainingSeconds > 0 ? remainingSeconds : totalSeconds;
      const deadline = Date.now() + currentDuration * 1000;
      deadlineRef.current = deadline;
      setTargetTimestamp(deadline);
      setStatus('running');

      addLog(
        `Countdown started for ${currentDuration}s (${action.toUpperCase()})`,
        'info',
        `Target: ${new Date(deadline).toLocaleTimeString()}`
      );

      timerRef.current = window.setInterval(tickCountdown, 200);
    } else {
      // Inactivity mode
      const totalAllowed = inactivityMinutes * 60;
      setTotalSeconds(totalAllowed);
      setStatus('running');

      addLog(
        `Inactivity monitor started: ${inactivityMinutes} min idle threshold (${action.toUpperCase()})`,
        'info',
        'PC will automatically execute action if mouse/keyboard are untouched.'
      );

      timerRef.current = window.setInterval(tickInactivity, 500);
    }

    if (settings.showDesktopNotifications) {
      ShutdownService.showNotification(
        t.appName,
        `Timer started for ${action.toUpperCase()}.`
      );
    }

    // Minimize window if configured in settings
    if (settings.minimizeOnStart && window.electronAPI?.minimizeWindow) {
      window.electronAPI.minimizeWindow();
    }
  };

  // Pause Countdown
  const handlePause = () => {
    if (status !== 'running' && status !== 'warning') return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerMode === 'countdown' && deadlineRef.current) {
      const exactRemaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setRemainingSeconds(exactRemaining);
    }
    deadlineRef.current = null;
    setTargetTimestamp(null);
    setStatus('paused');

    addLog(`Timer paused with ${remainingSeconds}s remaining.`, 'warn');
  };

  // Resume Countdown
  const handleResume = () => {
    if (status !== 'paused' || remainingSeconds <= 0) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timerMode === 'countdown') {
      const newDeadline = Date.now() + remainingSeconds * 1000;
      deadlineRef.current = newDeadline;
      setTargetTimestamp(newDeadline);
      setStatus('running');
      timerRef.current = window.setInterval(tickCountdown, 200);
    } else {
      setStatus('running');
      timerRef.current = window.setInterval(tickInactivity, 500);
    }

    addLog(`Timer resumed from ${remainingSeconds}s.`, 'info');
  };

  // Cancel Countdown & abort any queued OS shutdown
  const handleCancel = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    deadlineRef.current = null;
    setTargetTimestamp(null);
    setStatus('cancelled');

    // Call Windows shutdown /a to ensure no pending OS task is lingering
    const abortResult = await ShutdownService.abortShutdown();
    addLog('Timer cancelled by user.', 'warn', abortResult.message);

    if (settings.showDesktopNotifications) {
      ShutdownService.showNotification(
        t.appName,
        t.timerCancelledNotify
      );
    }

    // Reset remaining time back to configured inputs
    if (timerMode === 'countdown') {
      const currentInputTotal = timeUnits.hours * 3600 + timeUnits.minutes * 60 + timeUnits.seconds;
      setRemainingSeconds(currentInputTotal);
      setTotalSeconds(currentInputTotal);
    } else {
      const total = inactivityMinutes * 60;
      setRemainingSeconds(total);
      setTotalSeconds(total);
    }
    setStatus('idle');
  };

  // Reset all inputs and countdown back to clean initial state (00:00:00)
  const handleReset = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    deadlineRef.current = null;
    setTargetTimestamp(null);
    setStatus('idle');
    setErrorMessage(null);

    // Abort any pending OS shutdown
    await ShutdownService.abortShutdown();

    if (timerMode === 'countdown') {
      setTimeUnits({ hours: 0, minutes: 0, seconds: 0 });
      setRemainingSeconds(0);
      setTotalSeconds(0);
      addLog('Timer and inputs reset to 00:00:00.', 'info');
    } else {
      setInactivityMinutes(10);
      setRemainingSeconds(600);
      setTotalSeconds(600);
      addLog('Inactivity timer reset to 10 minutes.', 'info');
    }
  };

  // Immediate Shutdown Request
  const handleImmediateShutdownRequest = () => {
    setIsImmediateConfirm(true);
    setShowConfirmModal(true);
  };

  // Confirmed Immediate Shutdown
  const handleConfirmImmediateShutdown = () => {
    setShowConfirmModal(false);
    triggerShutdown(action);
  };

  // Editing inputs is disabled only while actively counting down (running or warning), permitted when idle or paused
  const isInputDisabled = status === 'running' || status === 'warning';
  const isWarningOverlayOpen = status === 'warning' && remainingSeconds <= settings.warningBufferSeconds && remainingSeconds > 0;

  const canStartTimer =
    timerMode === 'countdown'
      ? timeUnits.hours > 0 || timeUnits.minutes > 0 || timeUnits.seconds > 0
      : inactivityMinutes > 0;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 select-none overflow-hidden font-sans">
      {/* Windows 11 Title Bar */}
      <TitleBar
        systemInfo={systemInfo}
        isDryRun={settings.isDryRun}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenSettings={() => setShowSettingsModal(true)}
        onToggleLogs={() => setShowLogs((prev) => !prev)}
        onOpenPackageGuide={() => setShowPackageGuide(true)}
        showLogs={showLogs}
      />

      {/* Main Workspace Scroll Area */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-xs flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-red-400 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Mode Selector: Countdown vs Inactivity Auto-Off */}
          <ModeSelector
            currentMode={timerMode}
            onChangeMode={handleModeChange}
            disabled={isInputDisabled}
            language={language}
          />

          {/* Large Digital Countdown Display */}
          <DigitalDisplay
            remainingSeconds={remainingSeconds}
            totalSeconds={totalSeconds}
            status={status}
            action={action}
            targetTimestamp={targetTimestamp}
            language={language}
          />

          {/* Power Action Selector */}
          <ActionSelector
            currentAction={action}
            onChange={setAction}
            disabled={isInputDisabled}
            language={language}
          />

          {/* Inputs Section based on selected mode */}
          {timerMode === 'countdown' ? (
            <TimeInputs
              timeUnits={timeUnits}
              onChange={handleTimeUnitsChange}
              disabled={isInputDisabled}
              language={language}
            />
          ) : (
            <InactivityInputs
              thresholdMinutes={inactivityMinutes}
              onChangeThreshold={handleInactivityMinutesChange}
              disabled={isInputDisabled}
              currentIdleSeconds={currentIdleSeconds}
              isUserActive={isUserActive}
              language={language}
            />
          )}

          {/* Main Control Buttons */}
          <ControlButtons
            status={status}
            canStart={canStartTimer}
            onStartClick={handleRequestStart}
            onPauseClick={handlePause}
            onResumeClick={handleResume}
            onCancelClick={handleCancel}
            onResetClick={handleReset}
            onImmediateShutdownClick={handleImmediateShutdownRequest}
            language={language}
          />

          {/* Activity / Diagnostic Logs Drawer */}
          {showLogs && (
            <TerminalLogs
              isOpen={showLogs}
              logs={logs}
              onClear={() => setLogs([])}
              onClose={() => setShowLogs(false)}
              language={language}
            />
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        isImmediateShutdown={isImmediateConfirm}
        action={action}
        durationSeconds={
          isImmediateConfirm
            ? 0
            : timerMode === 'countdown'
            ? remainingSeconds > 0
              ? remainingSeconds
              : timeUnits.hours * 3600 + timeUnits.minutes * 60 + timeUnits.seconds
            : inactivityMinutes * 60
        }
        onConfirm={isImmediateConfirm ? handleConfirmImmediateShutdown : handleConfirmStart}
        onCancel={() => setShowConfirmModal(false)}
        language={language}
      />

      {/* Pre-Shutdown Urgent Warning Overlay (last 30s) */}
      <PreShutdownWarningModal
        isOpen={isWarningOverlayOpen}
        remainingSeconds={remainingSeconds}
        action={action}
        onAbort={handleCancel}
        language={language}
        timerMode={timerMode}
      />

      {/* Application Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        settings={settings}
        onUpdateSettings={setSettings}
        onClose={() => setShowSettingsModal(false)}
        language={language}
      />

      {/* Windows Executable Packaging Guide Modal */}
      <PackageGuideModal
        isOpen={showPackageGuide}
        onClose={() => setShowPackageGuide(false)}
        language={language}
      />
    </div>
  );
}
