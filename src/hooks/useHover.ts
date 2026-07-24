import { useCallback, useEffect, useRef } from "react";
import { useLatest } from "../core/useLatest";

type UseHoverOptions = {
  onEnter: (event: PointerEvent) => void;
  onLeave?: (event: PointerEvent) => void;
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

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnterRef = useLatest(onEnter)
  const onLeaveRef = useLatest(onLeave)

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
        onLeaveRef.current?.(event);
      }, leaveDelay);
    };

    node.addEventListener("pointerenter", handleEnter);

    if(onLeave){
      node.addEventListener("pointerleave", handleLeave);
    }

    cleanupRef.current = () => {
      clear();
      node.removeEventListener("pointerenter", handleEnter);

      if(onLeave){
        node.removeEventListener("pointerleave", handleLeave);
      }
    };
  }, [enabled, enterDelay, leaveDelay]);

  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  return ref;
}