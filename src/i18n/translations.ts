import { Language } from '../types';

export interface Translations {
  appName: string;
  subtitle: string;
  desktopApp: string;
  webPreview: string;
  testModeActive: string;
  testModeDesc: string;
  
  // Modes & Inactivity
  modeCountdown: string;
  modeInactivity: string;
  idleThreshold: string;
  systemActive: string;
  systemIdle: string;
  idleRemainingUntil: string;
  idleExplanation: string;
  idlePresets: string;
  inactivityStatusActive: string;
  inactivityStatusIdle: string;

  // Statuses
  statusReady: string;
  statusRunning: string;
  statusPaused: string;
  statusWarning: string;
  statusShuttingDown: string;
  statusCompleted: string;
  statusCancelled: string;

  // Time Units
  hours: string;
  minutes: string;
  seconds: string;
  hoursShort: string;
  minutesShort: string;
  secondsShort: string;
  timeRemaining: string;

  // Actions
  actionShutdown: string;
  actionRestart: string;
  actionSleep: string;
  actionHibernate: string;
  actionLock: string;
  selectAction: string;
  actionDescShutdown: string;
  actionDescRestart: string;
  actionDescSleep: string;
  actionDescHibernate: string;
  actionDescLock: string;

  // Buttons
  startTimer: string;
  pause: string;
  resume: string;
  cancel: string;
  reset: string;
  shutdownNow: string;
  settings: string;
  logs: string;
  exportPackager: string;

  // Confirmation modal
  confirmTitle: string;
  confirmWarning: string;
  confirmWarningUnsaved: string;
  confirmCountdownInfo: string;
  confirmTargetTime: string;
  confirmButton: string;
  cancelButton: string;
  shutdownNowConfirmTitle: string;
  shutdownNowConfirmWarning: string;
  shutdownNowButton: string;

  // Urgent warning overlay
  warningImminentTitle: string;
  warningImminentMessage: string;
  abortShutdownNow: string;

  // Presets
  presets: string;
  preset5m: string;
  preset15m: string;
  preset30m: string;
  preset1h: string;
  preset2h: string;
  preset4h: string;

  // Settings
  settingsTitle: string;
  audioAlerts: string;
  soundVolume: string;
  warningBuffer: string;
  testModeToggle: string;
  testModeExplanation: string;
  forceShutdownLabel: string;
  forceShutdownDesc: string;
  closeToTrayLabel: string;
  minimizeOnStartLabel: string;
  desktopNotificationsLabel: string;
  desktopNotificationsDesc: string;
  languageSelect: string;
  close: string;

  // Notifications & Logs
  timerStartedNotify: string;
  timerPausedNotify: string;
  timerResumedNotify: string;
  timerCancelledNotify: string;
  shutdownInitiatedNotify: string;
  shutdownAbortedNotify: string;
  logTitle: string;
  clearLogs: string;
  noLogsYet: string;
  windowsCommandPreview: string;

  // Error messages
  errorInvalidTime: string;
  errorZeroTime: string;
  errorFailedExecution: string;
  retry: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Windows Auto Shutdown Timer',
    subtitle: 'Automated PC Power Management & Precision Countdown',
    desktopApp: 'Windows Desktop App',
    webPreview: 'Web Preview (Simulation Mode)',
    testModeActive: 'Safe Test Mode (Dry Run)',
    testModeDesc: 'Commands are simulated and logged without shutting down your computer.',

    modeCountdown: 'Countdown Timer',
    modeInactivity: 'Inactivity / Idle Auto-Off',
    idleThreshold: 'Inactivity Threshold',
    systemActive: 'User Active',
    systemIdle: 'System Idle',
    idleRemainingUntil: 'Remaining until auto action',
    idleExplanation: 'If no mouse movement or keyboard input is detected across Windows for this duration, the selected action will execute automatically.',
    idlePresets: 'Inactivity Presets',
    inactivityStatusActive: 'ACTIVE (Mouse/Keys in use)',
    inactivityStatusIdle: 'IDLE (No activity detected)',
    
    statusReady: 'READY',
    statusRunning: 'COUNTING DOWN',
    statusPaused: 'PAUSED',
    statusWarning: 'SHUTDOWN IMMINENT',
    statusShuttingDown: 'EXECUTING SHUTDOWN',
    statusCompleted: 'COMPLETED',
    statusCancelled: 'CANCELLED',

    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    hoursShort: 'HH',
    minutesShort: 'MM',
    secondsShort: 'SS',
    timeRemaining: 'Time Remaining',

    actionShutdown: 'Shut Down',
    actionRestart: 'Restart',
    actionSleep: 'Sleep',
    actionHibernate: 'Hibernate',
    actionLock: 'Lock PC',
    selectAction: 'Select Action',
    actionDescShutdown: 'Turns off the computer completely (shutdown.exe /s /t 0)',
    actionDescRestart: 'Reboots the computer (shutdown.exe /r /t 0)',
    actionDescSleep: 'Puts system into low-power sleep state',
    actionDescHibernate: 'Saves memory state to disk and powers down (shutdown.exe /h)',
    actionDescLock: 'Locks the current Windows user session',

    startTimer: 'START TIMER',
    pause: 'PAUSE',
    resume: 'RESUME',
    cancel: 'CANCEL',
    reset: 'RESET',
    shutdownNow: 'SHUTDOWN NOW',
    settings: 'Settings',
    logs: 'Diagnostics & Logs',
    exportPackager: 'Packaging & .EXE',

    confirmTitle: 'Confirm Automatic Shutdown',
    confirmWarning: 'The computer will automatically execute this power action when the timer reaches 00:00:00.',
    confirmWarningUnsaved: 'Important: Any unsaved work, active downloads, or open documents may be lost.',
    confirmCountdownInfo: 'Scheduled Duration:',
    confirmTargetTime: 'Expected Execution Time:',
    confirmButton: 'Confirm & Start Timer',
    cancelButton: 'Cancel',
    shutdownNowConfirmTitle: 'Confirm Immediate Shutdown',
    shutdownNowConfirmWarning: 'Are you sure you want to shut down this Windows PC immediately? Unsaved work will be closed.',
    shutdownNowButton: 'Yes, Shut Down Now',

    warningImminentTitle: 'Windows Shutdown Imminent!',
    warningImminentMessage: 'The timer is about to reach zero. Save your work immediately or click Cancel to abort.',
    abortShutdownNow: 'ABORT / CANCEL NOW',

    presets: 'Quick Presets',
    preset5m: '5 Minutes',
    preset15m: '15 Minutes',
    preset30m: '30 Minutes',
    preset1h: '1 Hour',
    preset2h: '2 Hours',
    preset4h: '4 Hours',

    settingsTitle: 'Application Preferences',
    audioAlerts: 'Play Audible Warnings & Chimes',
    soundVolume: 'Audio Alert Volume',
    warningBuffer: 'Final Warning Alert Window',
    testModeToggle: 'Safe Test Mode (Dry Run)',
    testModeExplanation: 'When enabled, the timer counts down and beeps but DOES NOT issue the Windows shutdown command. Ideal for testing short 10s countdowns safely.',
    forceShutdownLabel: 'Force Close Apps (/f flag)',
    forceShutdownDesc: 'Forces running applications to close without prompting (use with caution).',
    closeToTrayLabel: 'Minimize to System Tray on Close',
    minimizeOnStartLabel: 'Minimize Window When Timer Starts',
    desktopNotificationsLabel: 'Show Windows Desktop Notifications',
    desktopNotificationsDesc: 'Shows brief popups in the corner of your screen when timer events occur.',
    languageSelect: 'Display Language',
    close: 'Close',

    timerStartedNotify: 'Countdown timer started.',
    timerPausedNotify: 'Countdown timer paused.',
    timerResumedNotify: 'Countdown timer resumed.',
    timerCancelledNotify: 'Timer cancelled. Pending shutdown aborted.',
    shutdownInitiatedNotify: 'Automatic shutdown command executed.',
    shutdownAbortedNotify: 'Windows shutdown command cancelled (shutdown /a).',
    logTitle: 'Activity & Command Log',
    clearLogs: 'Clear Logs',
    noLogsYet: 'No system activity logged yet.',
    windowsCommandPreview: 'Windows Command Target:',

    errorInvalidTime: 'Please enter a valid duration greater than 00:00:00.',
    errorZeroTime: 'Duration must be at least 1 second.',
    errorFailedExecution: 'Failed to execute power action command.',
    retry: 'Retry'
  },
  bn: {
    appName: 'উইন্ডোজ অটো শাটডাউন টাইমার',
    subtitle: 'স্বয়ংক্রিয় পিসি পাওয়ার ম্যানেজমেন্ট এবং সুনির্দিষ্ট কাউন্টডাউন',
    desktopApp: 'উইন্ডোজ ডেস্কটপ অ্যাপ',
    webPreview: 'ওয়েব প্রিভিউ (সিমুলেশন মোড)',
    testModeActive: 'নিরাপদ টেস্ট মোড (ড্রাই রান)',
    testModeDesc: 'কম্পিউটার বন্ধ না করেই কমান্ডগুলো পরীক্ষা এবং লগ করা হচ্ছে।',

    modeCountdown: 'কাউন্টডাউন টাইমার',
    modeInactivity: 'নিষ্ক্রিয় থাকলে অটো বন্ধ (মাউস/টাস্ক)',
    idleThreshold: 'নিষ্ক্রিয়তার সময়সীমা',
    systemActive: 'ব্যবহারকারী সক্রিয়',
    systemIdle: 'পিসি নিষ্ক্রিয়',
    idleRemainingUntil: 'অটো অ্যাকশন কার্যকর হতে বাকি',
    idleExplanation: 'নির্ধারিত সময় ধরে পিসির কোথাও মাউস নড়াচড়া বা কিবোর্ড স্পর্শ না করলে স্বয়ংক্রিয়ভাবে অ্যাকশন কার্যকর হবে।',
    idlePresets: 'জনপ্রিয় নিষ্ক্রিয় সময়',
    inactivityStatusActive: 'সক্রিয় (মাউস/কিবোর্ড ব্যবহৃত হচ্ছে)',
    inactivityStatusIdle: 'নিষ্ক্রিয় (কোনো কাজ হচ্ছে না)',
    
    statusReady: 'প্রস্তুত',
    statusRunning: 'কাউন্টডাউন চলছে',
    statusPaused: 'স্থগিত (পজ)',
    statusWarning: 'শাটডাউন আসন্ন!',
    statusShuttingDown: 'শাটডাউন কার্যকর হচ্ছে',
    statusCompleted: 'সম্পন্ন',
    statusCancelled: 'বাতিল করা হয়েছে',

    hours: 'ঘণ্টা',
    minutes: 'মিনিট',
    seconds: 'সেকেন্ড',
    hoursShort: 'ঘণ্টা',
    minutesShort: 'মিনিট',
    secondsShort: 'সেকেন্ড',
    timeRemaining: 'অবশিষ্ট সময়',

    actionShutdown: 'শাট ডাউন',
    actionRestart: 'রিস্টার্ট',
    actionSleep: 'স্লিপ',
    actionHibernate: 'হাইবারনেট',
    actionLock: 'পিসি লক করুন',
    selectAction: 'অ্যাকশন নির্বাচন করুন',
    actionDescShutdown: 'কম্পিউটার সম্পূর্ণ বন্ধ করে (shutdown.exe /s /t 0)',
    actionDescRestart: 'কম্পিউটার পুনরায় চালু করে (shutdown.exe /r /t 0)',
    actionDescSleep: 'সিস্টেমকে কম শক্তিসম্পন্ন স্লিপ অবস্থায় নেয়',
    actionDescHibernate: 'মেমরি ডিস্কে সংরক্ষণ করে পিসি বন্ধ করে (shutdown.exe /h)',
    actionDescLock: 'বর্তমান উইন্ডোজ সেশন লক করে',

    startTimer: 'টাইমার শুরু করুন',
    pause: 'পজ করুন',
    resume: 'পুনরায় চালু',
    cancel: 'বাতিল করুন',
    reset: 'রিসেট',
    shutdownNow: 'এখনই শাট ডাউন',
    settings: 'সেটিংস',
    logs: 'লগ ও ডায়াগনস্টিক',
    exportPackager: 'প্যাকেজিং ও .EXE',

    confirmTitle: 'স্বয়ংক্রিয় শাটডাউন নিশ্চিতকরণ',
    confirmWarning: 'টাইমার ০০:০০:০০ এ পৌঁছালে কম্পিউটার স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে।',
    confirmWarningUnsaved: 'সতর্কতা: অসংরক্ষিত কোনো কাজ বা খোলা ফাইল নষ্ট হতে পারে।',
    confirmCountdownInfo: 'নির্ধারিত সময়কাল:',
    confirmTargetTime: 'সম্ভাব্য কার্যকর সময়:',
    confirmButton: 'নিশ্চিত করুন এবং শুরু করুন',
    cancelButton: 'বাতিল',
    shutdownNowConfirmTitle: 'তাত্ক্ষণিক শাটডাউন নিশ্চিত করুন',
    shutdownNowConfirmWarning: 'আপনি কি নিশ্চিত যে আপনি এখনই এই উইন্ডোজ পিসি বন্ধ করতে চান? অসংরক্ষিত সব কাজ বন্ধ হয়ে যাবে।',
    shutdownNowButton: 'হ্যাঁ, এখনই শাট ডাউন করুন',

    warningImminentTitle: 'উইন্ডোজ শাটডাউন আসন্ন!',
    warningImminentMessage: 'টাইমার প্রায় শূন্যে পৌঁছে গেছে। কাজ দ্রুত সংরক্ষণ করুন অথবা বন্ধ করতে বাতিল বোতাম চাপুন।',
    abortShutdownNow: 'এখনই বাতিল করুন',

    presets: 'দ্রুত প্রিসেট',
    preset5m: '৫ মিনিট',
    preset15m: '১৫ মিনিট',
    preset30m: '৩০ মিনিট',
    preset1h: '১ ঘণ্টা',
    preset2h: '২ ঘণ্টা',
    preset4h: '৪ ঘণ্টা',

    settingsTitle: 'অ্যাপ্লিকেশন সেটিংস',
    audioAlerts: 'শব্দ ও সতর্কতা সংকেত বাজান',
    soundVolume: 'শব্দের মাত্রা',
    warningBuffer: 'চূড়ান্ত সতর্কতা সময়',
    testModeToggle: 'নিরাপদ টেস্ট মোড (ড্রাই রান)',
    testModeExplanation: 'সক্রিয় থাকলে টাইমার কাউন্টডাউন করবে এবং বিপ শব্দ করবে, কিন্তু পিসি শাটডাউন কমান্ড চালাবে না। নিরাপদ পরীক্ষার জন্য উপযুক্ত।',
    forceShutdownLabel: 'জোরপূর্বক অ্যাপ বন্ধ (/f ফ্ল্যাগ)',
    forceShutdownDesc: 'প্রয়োজনে কোনো প্রম্পট ছাড়াই অ্যাপ বন্ধ করতে বাধ্য করে।',
    closeToTrayLabel: 'ক্লোজ করার সময় সিস্টেম ট্রেতে মিনিমাইজ রাখুন',
    minimizeOnStartLabel: 'টাইমার শুরু হলে উইন্ডো মিনিমাইজ করুন',
    desktopNotificationsLabel: 'উইন্ডোজ ডেস্কটপ নোটিফিকেশন প্রদর্শন',
    desktopNotificationsDesc: 'টাইমার শুরু, পজ বা বাতিল হলে স্ক্রিনের কোণায় উইন্ডোজ পপআপ নোটিফিকেশন দেখায়।',
    languageSelect: 'ভাষা নির্বাচন করুন',
    close: 'বন্ধ করুন',

    timerStartedNotify: 'কাউন্টডাউন টাইমার শুরু হয়েছে।',
    timerPausedNotify: 'কাউন্টডাউন সাময়িক স্থগিত করা হয়েছে।',
    timerResumedNotify: 'কাউন্টডাউন পুনরায় শুরু করা হয়েছে।',
    timerCancelledNotify: 'টাইমার বাতিল করা হয়েছে। শাটডাউন প্রক্রিয়া স্থগিত।',
    shutdownInitiatedNotify: 'স্বয়ংক্রিয় শাটডাউন কমান্ড কার্যকর হয়েছে।',
    shutdownAbortedNotify: 'উইন্ডোজ শাটডাউন কমান্ড বাতিল করা হয়েছে (shutdown /a)।',
    logTitle: 'অ্যাক্টিভিটি ও কমান্ড হিস্ট্রি',
    clearLogs: 'লগ মুছুন',
    noLogsYet: 'এখনও কোনো লগ রেকর্ড নেই।',
    windowsCommandPreview: 'উইন্ডোজ কমান্ড টার্গেট:',

    errorInvalidTime: 'অনুগ্রহ করে ০০:০০:০০ এর চেয়ে বেশি সময় প্রবেশ করান।',
    errorZeroTime: 'সময়কাল কমপক্ষে ১ সেকেন্ড হতে হবে।',
    errorFailedExecution: 'কমান্ড পরিচালনায় ত্রুটি ঘটেছে।',
    retry: 'পুনরায় চেষ্টা'
  }
};
