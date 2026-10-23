import { KeyboardLayoutData, KeyboardButtonData, KeyboardRowData } from '../types/keyboard';

/**
 * Generates Swift code conforming to Cem Olcay's KeyboardLayoutEngine repository:
 * https://github.com/cemolcay/KeyboardLayoutEngine
 */
export function generateSwiftCode(layout: KeyboardLayoutData): string {
  const isDark = layout.style.theme === 'dark';

  let code = `//
//  CustomKeyboardLayout.swift
//  Generated for Cem Olcay's KeyboardLayoutEngine
//  Repository: https://github.com/cemolcay/KeyboardLayoutEngine
//

import UIKit
import KeyboardLayoutEngine

public class CustomKeyboardProvider {

  public static func createKeyboardLayout(target: Any?, action: Selector) -> KeyboardLayout {
    // 1. Configure Keyboard Layout Style
    var layoutStyle = KeyboardLayoutStyle()
    layoutStyle.backgroundColor = ${isDark ? 'UIColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1.0)' : 'UIColor(red: 0.82, green: 0.84, blue: 0.86, alpha: 1.0)'}
    layoutStyle.topPadding = ${layout.style.topPadding}
    layoutStyle.bottomPadding = ${layout.style.bottomPadding}
    layoutStyle.leftPadding = ${layout.style.leftPadding}
    layoutStyle.rightPadding = ${layout.style.rightPadding}

    // 2. Build Keyboard Rows
    var rows = [KeyboardRow]()
\n`;

  layout.rows.forEach((row: KeyboardRowData, rowIndex: number) => {
    code += `    // Row ${rowIndex + 1}\n`;
    code += `    var row${rowIndex + 1}Style = KeyboardRowStyle()\n`;
    code += `    row${rowIndex + 1}Style.rowHeight = ${row.style.rowHeight}\n`;
    code += `    row${rowIndex + 1}Style.buttonPadding = ${row.style.buttonPadding}\n`;
    code += `    var row${rowIndex + 1}Buttons = [KeyboardButton]()\n\n`;

    row.items.forEach((btn: KeyboardButtonData) => {
      // Determine button width representation in Swift
      let widthSwift = '.dynamic';
      if (btn.width.type === 'static') {
        widthSwift = `.static(width: ${btn.width.points})`;
      } else if (btn.width.type === 'relative') {
        widthSwift = `.relative(percent: ${btn.width.percent})`;
      }

      // Determine button type in Swift
      let typeSwift = '';
      if (btn.type.kind === 'key') {
        typeSwift = `.key("${btn.type.char.replace(/"/g, '\\"')}")`;
      } else if (btn.type.kind === 'text') {
        typeSwift = `.text("${btn.type.text.replace(/"/g, '\\"')}")`;
      } else if (btn.type.kind === 'image') {
        typeSwift = `.image(UIImage(named: "${btn.type.iconName}"))`;
      }

      // Determine button style
      const isModifier = btn.style?.isModifier;
      const isAction = btn.style?.isAction;
      let styleSwift = 'defaultButtonStyle';
      if (isAction) {
        styleSwift = 'actionButtonStyle';
      } else if (isModifier) {
        styleSwift = 'modifierButtonStyle';
      }

      code += `    let btn_${btn.id.replace(/[^a-zA-Z0-9_]/g, '_')} = KeyboardButton(\n`;
      code += `      type: ${typeSwift},\n`;
      code += `      style: ${styleSwift},\n`;
      code += `      width: ${widthSwift}\n`;
      code += `    )\n`;
      code += `    btn_${btn.id.replace(/[^a-zA-Z0-9_]/g, '_')}.addTarget(target, action: action, for: .touchUpInside)\n`;
      code += `    row${rowIndex + 1}Buttons.append(btn_${btn.id.replace(/[^a-zA-Z0-9_]/g, '_')})\n\n`;
    });

    code += `    rows.append(KeyboardRow(style: row${rowIndex + 1}Style, items: row${rowIndex + 1}Buttons))\n\n`;
  });

  code += `    // 3. Assemble and return KeyboardLayout instance
    let keyboardLayout = KeyboardLayout(style: layoutStyle, rows: rows)
    return keyboardLayout
  }

  // Pre-configured iOS button styles
  private static var defaultButtonStyle: KeyboardButtonStyle {
    var style = KeyboardButtonStyle()
    style.backgroundColor = ${isDark ? 'UIColor(white: 0.38, alpha: 1.0)' : 'UIColor.white'}
    style.highlightedBackgroundColor = ${isDark ? 'UIColor(white: 0.25, alpha: 1.0)' : 'UIColor(white: 0.85, alpha: 1.0)'}
    style.textColor = ${isDark ? 'UIColor.white' : 'UIColor.black'}
    style.cornerRadius = 5.0
    return style
  }

  private static var modifierButtonStyle: KeyboardButtonStyle {
    var style = KeyboardButtonStyle()
    style.backgroundColor = ${isDark ? 'UIColor(white: 0.22, alpha: 1.0)' : 'UIColor(red: 0.67, green: 0.70, blue: 0.74, alpha: 1.0)'}
    style.highlightedBackgroundColor = ${isDark ? 'UIColor(white: 0.35, alpha: 1.0)' : 'UIColor.white'}
    style.textColor = ${isDark ? 'UIColor.white' : 'UIColor.black'}
    style.cornerRadius = 5.0
    return style
  }

  private static var actionButtonStyle: KeyboardButtonStyle {
    var style = KeyboardButtonStyle()
    style.backgroundColor = UIColor(red: 0.0, green: 0.48, blue: 1.0, alpha: 1.0) // iOS System Blue
    style.highlightedBackgroundColor = UIColor(red: 0.0, green: 0.38, blue: 0.85, alpha: 1.0)
    style.textColor = UIColor.white
    style.cornerRadius = 5.0
    return style
  }
}
`;

  return code;
}
