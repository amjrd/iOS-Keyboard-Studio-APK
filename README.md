# iOS Keyboard Layout Studio & APK Build (GitHub Actions)

A professional iOS Keyboard Simulator and dynamic Layout Engine based on Cem Olcay's [`KeyboardLayoutEngine`](https://github.com/cemolcay/KeyboardLayoutEngine) architecture, with full bilingual support (Arabic & English), Web Audio mechanical key clicks, Swift code generator, and an automated GitHub Actions CI/CD workflow to compile and export Android APKs.

---

## 📱 Features

- **Cem Olcay KeyboardLayoutEngine Architecture**:
  - `KeyboardLayout`, `KeyboardRow`, `KeyboardButton`
  - Dynamic width calculation: `.Dynamic`, `.Static(points)`, `.Relative(percent)`
  - Key types: `.Key(String)`, `.Text(String)`, `.Image(UIImage)`
- **iOS Physics & Experience**:
  - Key Magnifier Popover Bubble on touch down
  - Long-press accents & diacritics flyout (Latin accents & Arabic Tashkeel/Hamza)
  - Spacebar Trackpad Mode: slide cursor across document
  - Real-time Web Audio API synthesized key clicks & modifier haptics
  - QuickType predictive suggestions bar
  - Native iOS Emoji drawer with categories and search
- **Swift Code Generator**:
  - 100% compatible Swift export for Xcode `UIInputViewController` custom keyboard extensions
- **Automated GitHub Actions APK Build**:
  - Pre-configured `.github/workflows/build-apk.yml`
  - Automated compilation to Android APK (`app-debug.apk`) upon push

---

## 🚀 How to Build the APK on GitHub

1. **Push this project to your GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "feat: iOS Keyboard Studio with GitHub APK Workflow"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Automated Cloud Build**:
   - Go to your repository on GitHub and click on the **Actions** tab.
   - The workflow **"Build Android APK"** will execute automatically.
   - Once completed (~2 minutes), download the artifact **`iOS-Keyboard-Studio-APK`** containing your `app-debug.apk`!

---

## 📂 Project Structure

```
├── .github/workflows/
│   └── build-apk.yml             # GitHub Actions automated APK compilation
├── capacitor.config.json         # Android Capacitor configuration
├── src/
│   ├── audio/
│   │   └── iosSoundEngine.ts     # Web Audio API key clicks synthesizer
│   ├── components/
│   │   ├── BuildApkModal.tsx     # APK & GitHub Actions inspector modal
│   │   ├── EmojiKeyboardView.tsx # iOS Emoji keyboard drawer
│   │   ├── IPhoneDeviceFrame.tsx # iPhone 16 Pro mockup frame
│   │   ├── KeyButtonView.tsx     # 3D iOS keycap with bubble & accents
│   │   ├── KeyboardLayoutView.tsx# Keyboard container & QuickType bar
│   │   ├── KeyboardRowView.tsx   # Dynamic/Static/Relative row layout
│   │   ├── LayoutEditorModal.tsx # Custom layout architect & row editor
│   │   └── SwiftCodeModal.tsx    # Swift code exporter modal
│   ├── layouts/
│   │   └── presets.ts            # English, Arabic, Numbers & Symbols presets
│   ├── types/
│   │   └── keyboard.ts           # Cem Olcay LayoutEngine TypeScript models
│   └── utils/
│       └── swiftExporter.ts      # Swift code generation for Xcode
└── package.json
```
