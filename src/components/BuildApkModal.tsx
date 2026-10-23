import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Github, 
  FileCode, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { KeyboardLayoutData } from '../types/keyboard';
import { generateSwiftCode } from '../utils/swiftExporter';

interface BuildApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: KeyboardLayoutData;
  isArabicUI?: boolean;
}

export const BuildApkModal: React.FC<BuildApkModalProps> = ({
  isOpen,
  onClose,
  layout,
  isArabicUI = false,
}) => {
  const [activeTab, setActiveTab] = useState<'github-apk' | 'capacitor' | 'all-code'>('github-apk');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const githubWorkflowCode = `name: Build Android APK

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Install NPM Dependencies
        run: npm install --legacy-peer-deps

      - name: Build Web Production Assets
        run: npm run build

      - name: Configure Capacitor Android Project
        run: |
          if [ ! -d "android" ]; then
            npx cap add android
          fi
          npx cap sync android

      - name: Build Debug APK via Gradle
        run: |
          cd android
          chmod +x ./gradlew
          ./gradlew assembleDebug --no-daemon --stacktrace

      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: iOS-Keyboard-Studio-APK
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14`;

  const capacitorConfig = `{
  "appId": "com.ioskeyboard.engine",
  "appName": "iOS Keyboard Studio",
  "webDir": "dist",
  "bundledWebRuntime": false
}`;

  const bashCommands = `# 1. رفع المشروع إلى مستودع GitHub الخاص بك
git init
git add .
git commit -m "feat: iOS Keyboard Studio with GitHub APK Workflow"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main

# 2. بمجرد الرفع، سيبدأ GitHub Actions تلقائياً ببناء ملف الـ APK!
# 3. اذهب إلى تبويب Actions في GitHub وقم بتحميل ملف: iOS-Keyboard-Studio-APK.zip`;

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      //
    }
  };

  const swiftCode = generateSwiftCode(layout);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <span>{isArabicUI ? 'تجميع الأكواد وبناء APK عبر GitHub' : 'Bundle Codes & Build APK via GitHub'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  CI/CD Ready
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isArabicUI 
                  ? 'ملفات التكوين و سير عمل GitHub Actions لبناء ملف الـ APK تلقائياً'
                  : 'Automated GitHub Actions workflow & Capacitor configs to compile APK'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-6 border-b border-slate-800 bg-slate-950/40 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('github-apk')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'github-apk'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'سير عمل GitHub Actions (APK)' : 'GitHub Actions Workflow (.yml)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('capacitor')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'capacitor'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'أوامر الرفع والتكوين' : 'Capacitor & Push Commands'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all-code')}
            className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'all-code'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>{isArabicUI ? 'كود Swift و بنية المشروع' : 'Swift & Project Structure'}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
          {activeTab === 'github-apk' && (
            <div className="flex flex-col gap-4">
              {/* Steps explanation card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5">
                <h4 className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isArabicUI ? 'كيف يعمل البناء التلقائي لملف APK على GitHub؟' : 'How automated APK build works on GitHub'}</span>
                </h4>
                <ol className="text-xs text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>
                    {isArabicUI 
                      ? 'تم إنشاء الملف في مشروعك بالفعل: `.github/workflows/build-apk.yml`'
                      : 'Workflow file is already generated at: `.github/workflows/build-apk.yml`'}
                  </li>
                  <li>
                    {isArabicUI
                      ? 'بمجرد دفع الكود (`git push origin main`) إلى مستودع GitHub الخاص بك، سيعمل السيرفر السحابي تلقائياً.'
                      : 'Once pushed to your GitHub repo, GitHub Actions runner starts automatically on Ubuntu.'}
                  </li>
                  <li>
                    {isArabicUI
                      ? 'يقوم ببناء كود React و تثبيت محرك Android و Gradle وتجميع ملف `app-debug.apk`.'
                      : 'It builds the web app, configures Android Capacitor Gradle project, and compiles `app-debug.apk`.'}
                  </li>
                  <li>
                    {isArabicUI
                      ? 'تجد ملف APK جاهزاً للتحميل مباشرة من صفحة Actions في حسابك على GitHub!'
                      : 'Download the compiled APK directly from GitHub Actions "Artifacts" section.'}
                  </li>
                </ol>
              </div>

              {/* Workflow Code Block */}
              <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">.github/workflows/build-apk.yml</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(githubWorkflowCode, 'workflow')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-medium transition-all"
                  >
                    {copiedKey === 'workflow' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'workflow' ? (isArabicUI ? 'تم النسخ!' : 'Copied!') : (isArabicUI ? 'نسخ الملف' : 'Copy YAML')}</span>
                  </button>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto max-h-72">
                  <pre>{githubWorkflowCode}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'capacitor' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <h4 className="text-xs font-semibold text-white">
                  {isArabicUI ? 'أوامر Git ورفع المشروع إلى GitHub لبدء البناء:' : 'Git push commands to trigger GitHub build:'}
                </h4>
                <div className="relative p-3 rounded-lg bg-slate-900 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto">
                  <pre>{bashCommands}</pre>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(bashCommands, 'commands')}
                    className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px]"
                  >
                    {copiedKey === 'commands' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'commands' ? 'تم!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* capacitor.config.json */}
              <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">capacitor.config.json</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(capacitorConfig, 'cap')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px]"
                  >
                    {copiedKey === 'cap' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'cap' ? 'تم!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto">
                  <pre>{capacitorConfig}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'all-code' && (
            <div className="flex flex-col gap-4">
              {/* Full Project File Tree */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-col gap-2">
                <h4 className="font-semibold text-white">
                  {isArabicUI ? 'شجرة ملفات المشروع المتكاملة' : 'Complete Project Code Tree'}
                </h4>
                <div className="font-mono text-slate-400 text-xs space-y-1">
                  <div>📁 .github/workflows/build-apk.yml &larr; <span className="text-emerald-400">GitHub Actions CI/CD for APK</span></div>
                  <div>📄 capacitor.config.json &larr; <span className="text-blue-400">Android Capacitor Setup</span></div>
                  <div>📁 src/types/keyboard.ts &larr; <span className="text-slate-300">Cem Olcay KeyboardLayoutEngine Types</span></div>
                  <div>📁 src/audio/iosSoundEngine.ts &larr; <span className="text-slate-300">Web Audio API Key Clicks Synthesizer</span></div>
                  <div>📁 src/layouts/presets.ts &larr; <span className="text-slate-300">English, Arabic, Numbers, Symbols & Emojis</span></div>
                  <div>📁 src/utils/swiftExporter.ts &larr; <span className="text-orange-400">Swift Code Generator</span></div>
                  <div>📁 src/components/KeyButtonView.tsx &larr; <span className="text-slate-300">iOS Keycap, Bubble Magnifier, Accents</span></div>
                  <div>📁 src/components/KeyboardRowView.tsx &larr; <span className="text-slate-300">Dynamic/Static/Relative Row Engine</span></div>
                  <div>📁 src/components/KeyboardLayoutView.tsx &larr; <span className="text-slate-300">Keyboard Controller & QuickType Bar</span></div>
                  <div>📁 src/components/IPhoneDeviceFrame.tsx &larr; <span className="text-slate-300">iPhone 16 Pro Device Frame</span></div>
                  <div>📁 src/App.tsx &larr; <span className="text-slate-300">Main Studio Application</span></div>
                </div>
              </div>

              {/* Swift Code Snippet */}
              <div className="flex flex-col rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
                  <span className="font-mono text-slate-400">CustomKeyboardLayout.swift</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(swiftCode, 'swift')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px]"
                  >
                    {copiedKey === 'swift' ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'swift' ? 'تم!' : 'Copy Swift'}</span>
                  </button>
                </div>
                <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 overflow-x-auto max-h-56">
                  <pre>{swiftCode}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{isArabicUI ? 'كل الأكواد جاهزة للبناء المباشر على GitHub' : 'All codebase files prepared for direct GitHub APK build'}</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            {isArabicUI ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
