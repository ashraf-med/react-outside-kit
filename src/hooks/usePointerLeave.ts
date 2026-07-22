import { useEffect, useRef, type RefObject } from 'react';
import { containsTarget } from '../core/containsTarget';
import { useLatest } from '../core/useLatest';
import { normalizeRefs } from '../core/normalizeRefs';

type UsePointerLeaveOptions = {
  ref:
  | RefObject<HTMLElement | null>
  |RefObject<HTMLElement | null>[];
  onLeave: () => void;
  delay?: number;
  enabled?: boolean;
};

export function usePointerLeave({
  ref,
  onLeave,
  delay = 0,
  enabled = true,
}: UsePointerLeaveOptions): void {

  const timeoutRef = useRef<number | null>(null);
  const wasInsideRef = useRef(false);

  const onLeaveRef = useLatest(onLeave)
  const refsRef = useLatest(ref)

  useEffect(() => {

    if (!enabled) return;

    const clearPendingTimeout = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {

      const refs = normalizeRefs(refsRef.current)

      const isInside = refs.some((ref) => containsTarget(ref, event));

      if (isInside) {
        wasInsideRef.current = true;
        clearPendingTimeout();
        return;
      }

      // Ignore movements while already outside.
      if (!wasInsideRef.current) {
        return;
      }

      // Transition: inside -> outside.
      wasInsideRef.current = false;

      clearPendingTimeout();

      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        onLeaveRef.current();
      }, delay);
    };

    document.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      clearPendingTimeout();
    };

  }, [enabled, delay]);
}