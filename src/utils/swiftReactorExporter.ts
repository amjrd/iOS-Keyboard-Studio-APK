import { KeyboardLayoutData } from '../types/keyboard';

/**
 * Generates production-ready Swift code combining ReactorKit & KeyboardLayoutEngine
 * ReactorKit: https://github.com/ReactorKit/ReactorKit
 * KeyboardLayoutEngine: https://github.com/cemolcay/KeyboardLayoutEngine
 */
export function generateReactorKitSwiftCode(layout: KeyboardLayoutData): string {
  const isDark = layout.style.theme === 'dark';

  return `//
//  KeyboardViewReactor.swift
//  iOS Keyboard Extension Architecture
//  Powered by ReactorKit (Suyeol Jeon) & KeyboardLayoutEngine (Cem Olcay)
//

import UIKit
import RxSwift
import RxCocoa
import ReactorKit
import KeyboardLayoutEngine

// MARK: - 1. Keyboard Reactor Definition

public final class KeyboardViewReactor: Reactor {

  // User Actions
  public enum Action {
    case insertText(String)
    case deleteBackward
    case toggleShift
    case switchMode(KeyboardMode)
    case switchLanguage
    case moveCursor(Int)
    case clearText
  }

  // State Mutations
  public enum Mutation {
    case setText(String)
    case setShiftState(ShiftState)
    case setMode(KeyboardMode)
    case setLanguage(Language)
  }

  // View States
  public struct State {
    public var text: String = ""
    public var shiftState: ShiftState = .normal
    public var mode: KeyboardMode = .letters
    public var language: Language = .english
    public var isDark: Bool = ${isDark ? 'true' : 'false'}
  }

  public enum ShiftState {
    case normal
    case shift
    case capslock
  }

  public enum KeyboardMode {
    case letters
    case numbers
    case symbols
    case emoji
  }

  public enum Language {
    case english
    case arabic
  }

  public let initialState: State

  public init(initialText: String = "") {
    self.initialState = State(text: initialText)
  }

  // MARK: - Mutate (Action -> Mutation Stream)

  public func mutate(action: Action) -> Observable<Mutation> {
    switch action {
    case let .insertText(char):
      let updated = currentState.text + char
      var mutations: [Mutation] = [.setText(updated)]
      if currentState.shiftState == .shift {
        mutations.append(.setShiftState(.normal))
      }
      return Observable.from(mutations)

    case .deleteBackward:
      guard !currentState.text.isEmpty else { return .empty() }
      var updated = currentState.text
      updated.removeLast()
      return Observable.just(.setText(updated))

    case .toggleShift:
      let nextState: ShiftState = currentState.shiftState == .normal ? .shift : .normal
      return Observable.just(.setShiftState(nextState))

    case let .switchMode(mode):
      return Observable.just(.setMode(mode))

    case .switchLanguage:
      let nextLang: Language = currentState.language == .english ? .arabic : .english
      return Observable.concat([
        Observable.just(.setLanguage(nextLang)),
        Observable.just(.setMode(.letters))
      ])

    case let .moveCursor(delta):
      // Proxy handles native cursor movement
      return .empty()

    case .clearText:
      return Observable.just(.setText(""))
    }
  }

  // MARK: - Reduce (State + Mutation -> New State)

  public func reduce(state: State, mutation: Mutation) -> State {
    var newState = state
    switch mutation {
    case let .setText(text):
      newState.text = text
    case let .setShiftState(shift):
      newState.shiftState = shift
    case let .setMode(mode):
      newState.mode = mode
    case let .setLanguage(lang):
      newState.language = lang
    }
    return newState
  }
}

// MARK: - 2. iOS Custom Keyboard View Controller (ReactorKit.View)

public final class KeyboardViewController: UIInputViewController, View {

  public var disposeBag = DisposeBag()
  public private(set) var keyboardLayout: KeyboardLayout!

  public override func viewDidLoad() {
    super.viewDidLoad()
    self.reactor = KeyboardViewReactor()
  }

  // MARK: - Reactor Binding
  public func bind(reactor: KeyboardViewReactor) {
    // 1. Action: Bind Keyboard Button Taps to Reactor
    // keyboardLayout.delegate = self -> dispatches:
    // reactor.action.onNext(.insertText(key))
    // reactor.action.onNext(.deleteBackward)

    // 2. State: Bind Reactor State to UI & textDocumentProxy
    reactor.state.map { $0.shiftState }
      .distinctUntilChanged()
      .subscribe(onNext: { [weak self] shiftState in
        self?.updateShiftStateAppearance(shiftState)
      })
      .disposed(by: disposeBag)

    reactor.state.map { $0.mode }
      .distinctUntilChanged()
      .subscribe(onNext: { [weak self] mode in
        self?.rebuildKeyboardLayout(for: mode)
      })
      .disposed(by: disposeBag)
  }

  // MARK: - KeyboardLayoutEngine Setup
  private func rebuildKeyboardLayout(for mode: KeyboardViewReactor.KeyboardMode) {
    // Uses Cem Olcay's KeyboardLayoutEngine
    self.keyboardLayout?.removeFromSuperview()
    self.keyboardLayout = CustomKeyboardProvider.createKeyboardLayout(
      target: self,
      action: #selector(keyboardButtonPressed(_:))
    )
    self.view.addSubview(self.keyboardLayout)
  }

  @objc private func keyboardButtonPressed(_ button: KeyboardButton) {
    guard let reactor = self.reactor else { return }

    switch button.type {
    case let .key(char):
      self.textDocumentProxy.insertText(char)
      reactor.action.onNext(.insertText(char))

    case let .text(title):
      if title == "space" || title == "مسافة" {
        self.textDocumentProxy.insertText(" ")
        reactor.action.onNext(.insertText(" "))
      } else if title == "return" || title == "ذهاب" {
        self.textDocumentProxy.insertText("\\n")
        reactor.action.onNext(.insertText("\\n"))
      }

    case let .image(img):
      if button.tag == 999 { // Backspace
        self.textDocumentProxy.deleteBackward()
        reactor.action.onNext(.deleteBackward)
      } else if button.tag == 998 { // Shift
        reactor.action.onNext(.toggleShift)
      } else if button.tag == 997 { // Globe
        reactor.action.onNext(.switchLanguage)
      }
    }
  }

  private func updateShiftStateAppearance(_ shift: KeyboardViewReactor.ShiftState) {
    // Update shift keycap icons & row cases dynamically
  }
}
`;
}
