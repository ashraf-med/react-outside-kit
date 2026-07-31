# react-outside-kit

A lightweight collection of React hooks for handling outside interactions and UI dismissal.

Handle common patterns like outside clicks, pointer boundaries, hover states, and Escape key dismissal for dialogs, dropdowns, popovers, tooltips, and context menus.

### Features

- ⚡ Lightweight ~5kb 
- 🌳 Tree-shakeable
- 📦 TypeScript support
- ⚛️ React 18 & 19
- 🚫 Zero dependencies

## Installation

```bash
npm install react-outside-kit
```

## Hooks
| Hook | Description |
|------|-------------|
| **useClickOutside**  | Detect interactions outside one or more elements |
| **usePointerLeave** | Detect when the pointer leaves a monitored area |
| **useHover** | Manage hover state with optional delays |
| **useEscapeKey** | Handle Escape key dismissal |



## Usage

### useClickOutside

```typescript
import { useState, useRef } from 'react'
import { useClickOutside } from "react-outside-kit";

function Modal() {

  const [open, setOpen] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null)

  useClickOutside({
     ref: modalRef,
     onOutside: () => setOpen(false),
     enabled: open
  });

  return (
    <div>
      <button onClick={() => setOpen(true)}>
        open
      </button>
      {open && <div ref={modalRef} >Modal content</div>}
    </div>
  );
}
```

### usePointerLeave

```typescript
import { useState, useRef } from 'react'
import { usePointerLeave } from "react-outside-kit";

export default function Dropdown() {

  const [open, setOpen] = useState<boolean>(true);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);


  usePointerLeave({
    ref: [triggerRef, menuRef],
    ignore: tooltipRef,
    enabled: open,
    onLeave: () => {setOpen(false);}
  });

  return (
    <>
      <button ref={triggerRef}>
        Open Menu
      </button>

      {open && (
        <>
          <div ref={menuRef}>
            Menu Content
          </div>

          <div ref={tooltipRef}>
            Tooltip (ignored)
          </div>
        </>
      )}
    </>
  );
}
```

### useHover

```typescript
import { useState } from 'react'
import { useHover } from "react-outside-kit";

export function Tooltip() {

  const [open, setOpen] = useState<boolean>(false);

  const triggerRef = useHover({
    enterDelay: 200,
    leaveDelay: 100,
    onEnter: () => setOpen(true),
    onLeave: () => setOpen(false),
  });

  return (
    <div>
      <button ref={triggerRef}>Hover me</button>

      {open && (
        <div role="tooltip">
          Tooltip content
        </div>
      )}
    </div>
  );
}
```

### useEscapeKey

```typescript
import { useState } from 'react'
import { useEscapeKey } from "react-outside-kit";

export function Example() {

  const [open, setOpen] = useState<boolean>(true);

  useEscapeKey({
    onEscape: () => setOpen(false),
    enabled: open,
  });

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>

      {open && <div>Press Escape to close.</div>}
    </>
  );
}
```


## API Reference

### useClickOutside

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ref` | `RefObject<HTMLElement \| null>` \| `RefObject<HTMLElement \| null>[]` | **Required** | The element or elements to monitor for outside interactions. |
| `onOutside` | `(event: MouseEvent \| TouchEvent \| PointerEvent) => void` | **Required** | Callback invoked when an interaction occurs outside the monitored element(s). Receives the triggering event as its argument. |
| `ignore` | `RefObject<HTMLElement \| null>` \| `RefObject<HTMLElement \| null>[]` | `undefined` | Element or elements to exclude from outside interaction detection. |
| `capture` | `boolean` | `false` | Attaches the event listener during the capture phase instead of the bubbling phase. |
| `event` | `"pointerdown"` \| `"mousedown"` \| `"touchstart"` \| `"click"` | `"pointerdown"` | The DOM event used to detect outside interactions. |
| `enabled` | `boolean` | `true` | Enables or disables the hook. |


### usePointerLeave

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ref` | `RefObject<HTMLElement \| null>` \| `RefObject<HTMLElement \| null>[]` | **Required** | The element or elements to monitor for pointer leave interactions. |
| `onLeave` | `(event: PointerEvent) => void` | **Required** | Callback invoked when the pointer leaves the monitored element(s). |
| `ignore` | `RefObject<HTMLElement \| null>` \| `RefObject<HTMLElement \| null>[]` | `undefined` | Element or elements to exclude when determining whether the pointer has left the monitored area. |
| `delay` | `number` | `0` | Delay, in milliseconds, before invoking `onLeave`. |
| `enabled` | `boolean` | `true` | Enables or disables the hook. |

> **Note:**

If `delay` is greater than `0` and the pointer re-enters the monitored area before the delay expires, the pending `onLeave` callback is canceled.


### useHover 

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onEnter` | `(event: PointerEvent) => void` | **Required** | Callback invoked when the pointer enters the monitored element. Receives the triggering `PointerEvent` as its argument. |
| `onLeave` | `(event: PointerEvent) => void` | `undefined` | Callback invoked when the pointer leaves the monitored element. Receives the triggering `PointerEvent` as its argument. |
| `enterDelay` | `number` | `0` | Delay, in milliseconds, before invoking `onEnter`. |
| `leaveDelay` | `number` | `0` | Delay, in milliseconds, before invoking `onLeave`. |
| `enabled` | `boolean` | `true` | Enables or disables the hook. |

> **Note:** 

`useHover` uses a callback ref instead of accepting a `RefObject`. Attach the returned ref directly to the element you want to monitor for hover interactions.

| Return | Type | Description |
|--------|------|-------------|
| Callback ref | `RefCallback<HTMLElement>` | Attach this ref to the element you want to monitor for hover interactions. |


### useEscapeKey

| Option     | Type                             | Default      | Description                                                                                                 |
| ---------- | -------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------- |
| `onEscape` | `(event: KeyboardEvent) => void` | **Required** | Callback invoked when the `Escape` key is pressed. Receives the triggering `KeyboardEvent` as its argument. |
| `enabled`  | `boolean`                        | `true`       | Enables or disables the hook.                                                                               |


## License

MIT