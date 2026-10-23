# iOS Keyboard Studio (ReactorKit + KeyboardLayoutEngine) & APK Build

A professional iOS Keyboard Simulator and dynamic Layout Engine combining:
1. **[ReactorKit](https://github.com/ReactorKit/ReactorKit)**: Suyeol Jeon's famous unidirectional reactive Swift architecture (`Action` &rarr; `mutate()` &rarr; `Mutation` &rarr; `reduce()` &rarr; `State` &rarr; `View`).
2. **[KeyboardLayoutEngine](https://github.com/cemolcay/KeyboardLayoutEngine)**: Cem Olcay's dynamic iOS keyboard row layout engine with `.Dynamic`, `.Static`, and `.Relative` button widths.
3. **Automated Android APK CI/CD**: Pre-configured GitHub Actions workflow compiling native debug APKs (`app-debug.apk`) via Gradle with Java 21 & Android SDK 35.

---

## ⚡ Architecture: ReactorKit + KeyboardLayoutEngine

```
[ User Interaction / Key Press ]
               │
               ▼
   View (UIInputViewController)
               │  reactor.action.onNext(.insertText("A"))
               ▼
             Action
               │
               ▼
     Reactor.mutate(action:) ────> Network / TextProxy
               │
               ▼
            Mutation (.setText, .setShiftState)
               │
               ▼
 Reactor.reduce(state:mutation:)
               │
               ▼
         New State (Immutable)
               │
               ▼
   View.bind(reactor:) (DistinctUntilChanged)
```

---

## 📱 Features

- **ReactorKit Unidirectional Architecture**:
  - Live Reactor stream visualizer in the UI showing `Action` &rarr; `Mutation` &rarr; `State`.
  - Immutable state updates for cursor position, text, mode, shift, and language.
- **Cem Olcay KeyboardLayoutEngine**:
  - `KeyboardLayout`, `KeyboardRow`, `KeyboardButton`
  - `.Dynamic`, `.Static(points)`, and `.Relative(percent)` key widths.
- **iOS Physics & Experience**:
  - Key Magnifier Popover Bubble on touch down
  - Long-press accents & diacritics flyout (Latin accents & Arabic Tashkeel/Hamza)
  - Spacebar Trackpad Mode: slide cursor across document
  - Real-time Web Audio API synthesized key clicks & modifier haptics
  - QuickType predictive suggestions bar
  - Native iOS Emoji drawer with categories and search
- **Swift Code Generator**:
  - Generates both `KeyboardViewReactor.swift` (ReactorKit) and `CustomKeyboardLayout.swift` (KeyboardLayoutEngine) ready for Xcode.
- **Automated GitHub Actions APK Build**:
  - Workflow at `.github/workflows/build-apk.yml`
  - Java JDK 21, Android SDK 35, license acceptance, Gradle assembleDebug, and APK artifact upload.

---

## 🚀 How to Build the APK on GitHub

1. **Push this project to your GitHub repository**:
   ```bash
   git add .
   git commit -m "feat: iOS Keyboard Studio with ReactorKit and GitHub APK CI"
   git push origin main
   ```

2. **Download APK**:
   - Go to your repository on GitHub and click on the **Actions** tab.
   - Click the workflow run **"Build Android APK"**.
   - Download the artifact **`iOS-Keyboard-Studio-APK`**.
