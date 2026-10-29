export type TimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'warning'
  | 'shutting_down'
  | 'completed'
  | 'cancelled';

export type PowerAction = 'shutdown' | 'restart' | 'sleep' | 'hibernate' | 'lock';

export type TimerMode = 'countdown' | 'inactivity';

export type Language = 'en' | 'bn';

export interface TimeUnits {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  details?: string;
}

export interface SystemInfo {
  platform: string;
  arch?: string;
  isElectron: boolean;
  isWindows: boolean;
  appVersion?: string;
  nodeVersion?: string;
  electronVersion?: string;
  isPackaged?: boolean;
}

export interface AppSettings {
  playAlertSound: boolean;
  soundVolume: number; // 0 to 1
  warningBufferSeconds: number; // e.g., 30s final visual & audio warning
  isDryRun: boolean; // Safe Test Mode: logs & beeps without actual OS shutdown
  closeToTray: boolean;
  minimizeOnStart: boolean;
  forceShutdown: boolean;
  showDesktopNotifications: boolean;
  language: Language;
}

export interface PresetTimer {
  id: string;
  labelKey: string;
  defaultLabel: string;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface ShutdownExecutionResult {
  success: boolean;
  command: string;
  action?: string;
  message?: string;
  error?: string;
  dryRun?: boolean;
  nonWindowsDev?: boolean;
  timestamp?: string;
}

export interface ElectronAPI {
  isElectron: boolean;
  executeShutdown: (options: {
    action: PowerAction;
    force?: boolean;
    isDryRun?: boolean;
  }) => Promise<ShutdownExecutionResult>;
  abortShutdown: () => Promise<{
    success: boolean;
    command?: string;
    message?: string;
    noPendingShutdown?: boolean;
  }>;
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<boolean>;
  closeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  getSystemInfo: () => Promise<SystemInfo>;
  getSystemIdleTime?: () => Promise<number>;
  showNotification: (payload: { title: string; body: string }) => Promise<boolean>;
  onWindowStateChanged: (callback: (data: { isMaximized: boolean }) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
