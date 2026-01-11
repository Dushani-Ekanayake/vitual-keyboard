# vitual-keyboard


Live Demo: [https://dushani-ekanayake.github.io/vitual-keyboard/](https://dushani-ekanayake.github.io/vitual-keyboard/)

---

## Overview

This project implements a **virtual on-screen keyboard** in plain JavaScript, HTML, and CSS. It supports:

* Alphabetic and numeric layouts
* Shift (capital letters)
* Backspace and enter
* Mode toggling (ABC ↔ 123)
* Hide keyboard
* Works on both desktop and mobile
* Minimalist dark theme

Users interact with the keyboard by focusing on inputs marked with `data-keyboard` attributes.

---

## Features

| Feature                     | Supported |
| --------------------------- | --------- |
| Alphabet (QWERTY)           | Yes       |
| Numeric keypad              | Yes       |
| Shift key                   | Yes       |
| Input insertion             | Yes       |
| Backspace                   | Yes       |
| Enter / Submit              | Yes       |
| Responsive layout           | Yes       |
| Dark minimalist theme       | Yes       |
| Works with input & textarea | Yes       |

---

## Errors Faced & How They Were Resolved

Here are the major issues encountered while building the keyboard and the solutions applied:

---

### 1. **Text Not Appearing in Input**

**Problem:**
Typing letters on the keyboard did not insert text into the input field.

**Cause:**
The virtual keyboard was capturing clicks and stealing focus from the input.
Without input focus, `selectionStart` and `selectionEnd` were `null`, so insertText failed silently.

**Fix:**

* Force-focus the input before inserting text.
* Ensure fallback values when caret position is unavailable.
* Update `insertText()` accordingly.

---

### 2. **Backspace Not Removing Text Correctly**

**Problem:**
Backspace did not always delete characters, especially with selection ranges.

**Cause:**
Incorrect handling of selection ranges and focus loss before deletion.

**Fix:**

* Call `el.focus()` before running deletion.
* Use safe checks for `selectionStart` and `selectionEnd`.

---

### 3. **Keyboard Hiding Unexpectedly**

**Problem:**
Clicking a key caused the keyboard to disappear before input happened.

**Cause:**
Focusout from the input triggered the hide logic when clicking keyboard buttons.

**Fix:**

* Block default `mousedown` on the keyboard container so focus does not leave the input prematurely.
* Only hide when focus moves outside of both input and keyboard.

---

### 4. **Shift Key Misbehavior**

**Problem:**
Shift toggling did not reset properly, and characters were not capitalizing correctly.

**Cause:**
Shift state was not consistently being updated or reset after a character.

**Fix:**

* Update shift logic so that shift switches off after one character in alpha mode.
* Update keyboard rendering accordingly.

---

### 5. **Mode Toggle (Alpha ↔ Numeric) Confusion**

**Problem:**
Switching between numeric and alphabet layouts caused label mismatches.

**Cause:**
Layout logic used dynamic rendering, but labels were not updated during mode switch.

**Fix:**

* Clean separation of layout logic via static `LAYOUTS` object.
* Use coherent labels and update render on mode change.

---

## File Structure

```
/
├── index.html
├── keyboard.css
└── keyboard.js
```

---

## Code Snippet — Input Handling (Key Fix)

```js
const insertText = (el, text) => {
  el.focus()

  const start =
    typeof el.selectionStart === 'number'
      ? el.selectionStart
      : el.value.length

  const end =
    typeof el.selectionEnd === 'number'
      ? el.selectionEnd
      : el.value.length

  el.value =
    el.value.slice(0, start) +
    text +
    el.value.slice(end)

  const pos = start + text.length
  el.setSelectionRange(pos, pos)

  el.dispatchEvent(new Event('input', { bubbles: true }))
}
```

This ensures text always inserts correctly.

---

## Technologies Used

* Vanilla JavaScript
* Semantic HTML
* Modern, responsive CSS
* No external dependencies

---

## Future Improvements

If expanded, this virtual keyboard can support:

* Emoji sets
* Long-press letters (accented characters)
* Sound and haptic feedback
* Themes (light / dark / custom)
* Floating or draggable behavior

  ##Screenshots
<img width="768" height="507" alt="image" src="https://github.com/user-attachments/assets/84559189-3407-4b48-b7e5-c9c48a12effc" />
<img width="884" height="988" alt="image" src="https://github.com/user-attachments/assets/96972588-4fa8-44b6-a048-4186cd4bc4cf" />


