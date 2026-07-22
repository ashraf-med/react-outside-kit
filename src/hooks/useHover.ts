import { useCallback, useEffect, useRef } from "react";

type UseHoverOptions = {
  onEnter: (event: PointerEvent) => void;
  onLeave: (event: PointerEvent) => void;
  enterDelay?: number;
  leaveDelay?: number;
  enabled?: boolean;
};

export function useHover({
  onEnter,
  onLeave,
  enterDelay = 0,
  leaveDelay = 0,
  enabled = true,
}: UseHoverOptions) {

  const nodeRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const onEnterRef = useRef(onEnter);
  const onLeaveRef = useRef(onLeave);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onEnterRef.current = onEnter;
    onLeaveRef.current = onLeave;
  }, [onEnter, onLeave]);

  const ref = useCallback((node: HTMLElement | null) => {
    
    cleanupRef.current?.();
    cleanupRef.current = null;

    nodeRef.current = node;

    if (!node || !enabled) return;

    const clear = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleEnter = (event: PointerEvent) => {
      clear();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        onEnterRef.current(event);
      }, enterDelay);
    };

    const handleLeave = (event: PointerEvent) => {
      clear();
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        onLeaveRef.current(event);
      }, leaveDelay);
    };

    node.addEventListener("pointerenter", handleEnter);
    node.addEventListener("pointerleave", handleLeave);

    cleanupRef.current = () => {
      clear();
      node.removeEventListener("pointerenter", handleEnter);
      node.removeEventListener("pointerleave", handleLeave);
    };
  }, [enabled, enterDelay, leaveDelay]);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  return ref;
}