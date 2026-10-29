import { PowerAction, ShutdownExecutionResult, SystemInfo } from '../types';

/**
 * Service to execute or abort Windows power management operations
 * Seamlessly interfaces with Electron IPC or Web Preview diagnostic mode
 */

let lastWebActivity = Date.now();
if (typeof window !== 'undefined') {
  const markActive = () => {
    lastWebActivity = Date.now();
  };
  window.addEventListener('mousemove', markActive, { passive: true });
  window.addEventListener('keydown', markActive, { passive: true });
  window.addEventListener('mousedown', markActive, { passive: true });
  window.addEventListener('touchstart', markActive, { passive: true });
  window.addEventListener('scroll', markActive, { passive: true });
}

export class ShutdownService {
  /**
   * Check if running inside Electron desktop container
   */
  public static isElectron(): boolean {
    return typeof window !== 'undefined' && Boolean(window.electronAPI?.isElectron);
  }

  /**
   * Get host system information
   */
  public static async getSystemInfo(): Promise<SystemInfo> {
    if (this.isElectron() && window.electronAPI?.getSystemInfo) {
      try {
        return await window.electronAPI.getSystemInfo();
      } catch (e) {
        console.warn('Failed to retrieve Electron system info', e);
      }
    }

    // Web Browser fallback info
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isWindows = ua.includes('Windows');

    return {
      platform: isWindows ? 'win32' : (ua.includes('Mac') ? 'darwin' : 'linux'),
      isElectron: false,
      isWindows,
      appVersion: '1.0.0',
      isPackaged: false
    };
  }

  /**
   * Get system idle time in seconds
   * Uses Windows GetLastInputInfo in Electron, or event listener in Web
   */
  public static async getSystemIdleTime(): Promise<number> {
    if (this.isElectron() && window.electronAPI?.getSystemIdleTime) {
      try {
        const idle = await window.electronAPI.getSystemIdleTime();
        if (typeof idle === 'number') return Math.max(0, idle);
      } catch (e) {
        console.warn('Failed to get idle time from Electron', e);
      }
    }

    return Math.max(0, Math.floor((Date.now() - lastWebActivity) / 1000));
  }

  /**
   * Get exact Windows command string for a power action
   */
  public static getCommandString(action: PowerAction, force = false): string {
    switch (action) {
      case 'shutdown':
        return force ? 'shutdown.exe /s /f /t 0' : 'shutdown.exe /s /t 0';
      case 'restart':
        return force ? 'shutdown.exe /r /f /t 0' : 'shutdown.exe /r /t 0';
      case 'hibernate':
        return 'shutdown.exe /h';
      case 'sleep':
        return 'rundll32.exe powrprof.dll,SetSuspendState 0,1,0';
      case 'lock':
        return 'rundll32.exe user32.dll,LockWorkStation';
      default:
        return 'shutdown.exe /s /t 0';
    }
  }

  /**
   * Execute real or dry-run power action
   */
  public static async executeAction(
    action: PowerAction,
    options: { force?: boolean; isDryRun?: boolean } = {}
  ): Promise<ShutdownExecutionResult> {
    const { force = false, isDryRun = false } = options;
    const command = this.getCommandString(action, force);

    // If running in Electron Desktop
    if (this.isElectron() && window.electronAPI?.executeShutdown) {
      try {
        return await window.electronAPI.executeShutdown({
          action,
          force,
          isDryRun
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          success: false,
          command,
          action,
          error: message,
          timestamp: new Date().toISOString()
        };
      }
    }

    // Running in Web Preview environment: simulate with full diagnostic fidelity
    return {
      success: true,
      dryRun: true,
      nonWindowsDev: true,
      command,
      action,
      timestamp: new Date().toISOString(),
      message: `[Web Preview Environment] Simulated execution of: ${command}. In the packaged desktop app on Windows, this calls shutdown.exe.`
    };
  }

  /**
   * Abort scheduled shutdown (Windows shutdown /a)
   */
  public static async abortShutdown(): Promise<{ success: boolean; command?: string; message?: string }> {
    if (this.isElectron() && window.electronAPI?.abortShutdown) {
      try {
        return await window.electronAPI.abortShutdown();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
          success: false,
          command: 'shutdown.exe /a',
          message: `Failed to abort shutdown: ${message}`
        };
      }
    }

    return {
      success: true,
      command: 'shutdown.exe /a',
      message: 'Shutdown cancellation processed (Web Preview).'
    };
  }

  /**
   * Dispatch desktop or web notification
   */
  public static async showNotification(title: string, body: string): Promise<boolean> {
    if (this.isElectron() && window.electronAPI?.showNotification) {
      try {
        return await window.electronAPI.showNotification({ title, body });
      } catch {
        // Fallback to web notification
      }
    }

    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, { body, icon: '/icon.svg' });
          return true;
        } catch {
          return false;
        }
      } else if (Notification.permission !== 'denied') {
        try {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            new Notification(title, { body, icon: '/icon.svg' });
            return true;
          }
        } catch {
          return false;
        }
      }
    }

    return false;
  }
}
