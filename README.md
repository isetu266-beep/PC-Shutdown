# Windows Auto Shutdown Timer

A professional, fully functional Windows desktop application built with Electron, React, and TypeScript. It provides a precision countdown timer with Hours, Minutes, and Seconds (HH:MM:SS) that automatically executes a genuine Windows PC shutdown, restart, sleep, hibernate, or workstation lock upon reaching 00:00:00.

---

## 1. Key Features

- **Accurate Countdown Engine**: Uses an absolute deadline (`Date.now() + duration`) and high-frequency delta calculation, preventing timer drift during window minimization, focus loss, or background throttling.
- **Large Digital Display**: High-contrast digital clock readout (`01 : 30 : 45`) with animated progress bar and status badges (`READY`, `COUNTING DOWN`, `PAUSED`, `SHUTDOWN IMMINENT`, `COMPLETED`, `CANCELLED`).
- **Input Controls**: Three dedicated numeric input fields for Hours (0–999), Minutes (0–59), and Seconds (0–59) with quick stepper buttons and manual keyboard entry.
- **One-Click Presets**: Fast timer selection for 5 minutes, 15 minutes, 30 minutes, 1 hour, 2 hours, and 4 hours.
- **Comprehensive Power Actions**:
  - **Shut Down**: `shutdown.exe /s /t 0` (or `shutdown.exe /s /f /t 0` with force flag)
  - **Restart**: `shutdown.exe /r /t 0`
  - **Sleep**: `rundll32.exe powrprof.dll,SetSuspendState 0,1,0`
  - **Hibernate**: `shutdown.exe /h`
  - **Lock Workstation**: `rundll32.exe user32.dll,LockWorkStation`
- **Safe Pause & Cancel Architecture**: Operating system shutdown commands are issued **only** when the timer reaches zero. Pausing and cancelling work reliably at any point, and cancelling automatically issues `shutdown.exe /a` to abort any pending OS requests.
- **Safety First**:
  - Prominent confirmation dialog before activating the timer, warning about unsaved work.
  - Urgent pre-shutdown warning overlay during the final 30 seconds with a prominent emergency **ABORT / CANCEL NOW** button.
  - Safe Test Mode (Dry Run) toggle allowing users to test countdowns and audio chimes safely without powering down the PC.
  - Immediate **Shutdown Now** button protected by a mandatory confirmation modal.
- **Audible Alerts**: Built-in Web Audio API sound synthesizer with warning beeps, countdown ticks, and completion chimes.
- **Bilingual Interface**: Full support for both **English** and **Bengali (বাংলা)** with instant language toggling.
- **Diagnostics & Command Logs**: Built-in terminal log viewer showing timestamped execution events, command lines, and IPC status.

---

## 2. Security Architecture

This application adheres to strict Electron security best practices:

- **Context Isolation Enabled**: `contextIsolation: true` in `BrowserWindow` web preferences.
- **Node Integration Disabled**: `nodeIntegration: false` in the renderer process.
- **Restricted Preload Script**: Renderer can only access strictly validated IPC methods exposed through `contextBridge.exposeInMainWorld('electronAPI', { ... })`.
- **Whitelisted Fixed Commands**: The Electron main process uses `child_process.execFile` with hardcoded command arrays (`shutdown.exe`, `['/s', '/t', '0']`). No arbitrary shell commands, string concatenation, or `eval` are ever permitted.

---

## 3. Technology Stack

- **Desktop Framework**: Electron
- **Frontend Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Windows 11 Dark Fluent Theme
- **Icons**: Lucide React
- **Packaging & Installer**: electron-builder (NSIS Installer + Standalone Portable EXE)

---

## 4. Installation & Setup

### Prerequisites

- Windows 10 or Windows 11 (64-bit recommended)
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher

### Install Dependencies

```bash
git clone <repository-url>
cd windows-auto-shutdown-timer
npm install
```

---

## 5. Running in Development Mode

### Web Browser Preview Mode

```bash
npm run dev
```

Runs the Vite development server on `http://localhost:3000`. In the browser, commands run in simulation/diagnostic mode with full logging.

### Electron Desktop Mode (with Live Reload)

```bash
npm run electron:dev
```

Compiles the frontend and launches the native Electron desktop application with Windows title bar, window controls, and real IPC bridges.

---

## 6. Building Windows Installers and Executables

### Option 1: One-Click Windows Batch File (Recommended)
On your Windows PC, simply double-click:
```
Build windows exe.bat
```
This batch script automatically verifies Node.js, installs dependencies, compiles Vite assets, and packages both the installer and portable `.exe`.

### Option 2: Terminal Build Commands

- **Build NSIS Windows Installer (`.exe`)**:
  ```bash
  npm run build:exe
  ```
- **Build Standalone Portable Executable (`.exe`)**:
  ```bash
  npm run build:portable
  ```
- **Build Both Targets**:
  ```bash
  npm run dist
  ```

### Output Location

The generated Windows installer and portable binary will be saved in the `release/` folder:

- **Installer**: `release/Windows Auto Shutdown Timer Setup 1.0.0.exe`
- **Portable**: `release/Windows Auto Shutdown Timer 1.0.0.exe`

---

## 7. How to Test Safely

### Step 1: Testing with Safe Test Mode (Dry Run)

1. Click the **Settings** gear or the **Test Mode** badge on the title bar.
2. Ensure **Safe Test Mode (Dry Run)** is enabled.
3. Set a short countdown (e.g., 10 seconds).
4. Click **START TIMER** and confirm the dialog.
5. Watch the countdown:
   - At 10s, audible warning alert sounds.
   - At 5s, 4s, 3s, 2s, 1s, ticks sound.
   - At 00:00:00, the completion chime sounds and the command `shutdown.exe /s /t 0` is logged in the diagnostics drawer without shutting down your computer.

### Step 2: Testing Pause, Resume, and Cancel

1. Set a 30-second timer and start it.
2. Click **PAUSE** at 20 seconds. Verify that remaining time is preserved.
3. Click **RESUME**. Verify the countdown resumes exactly from 20 seconds.
4. Click **CANCEL**. Verify that the countdown terminates immediately, `shutdown.exe /a` is dispatched, and the display resets to the initial setup screen.

### Step 3: Testing Real Windows Shutdown (Live Test)

> ⚠️ **Warning**: Ensure all open work in other programs (documents, spreadsheets, browser tabs) is saved before performing this test!

1. In Settings, turn **Safe Test Mode OFF**.
2. Set a **10-second timer** (0 Hours, 0 Minutes, 10 Seconds).
3. Click **START TIMER** and confirm.
4. At 00:00:00, the application will notify Windows to shut down via `shutdown.exe /s /t 0`.

---

## 8. Web Preview vs Packaged Desktop App

- In the **AI Studio Web Preview environment** (which runs in a secure sandboxed container), the application operates in **Simulation / Diagnostic Mode**. It executes and verifies all countdown intervals, audio cues, and logs the exact Windows commands that will execute.
- In the **Packaged Electron Desktop App on Windows**, it communicates via secure IPC directly with the Windows operating system to execute `shutdown.exe /s /t 0` and `shutdown.exe /a`.

---

## 9. License

Apache-2.0
