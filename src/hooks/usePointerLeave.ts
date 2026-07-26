import { useEffect, useRef, type RefObject } from 'react';
import { containsTarget } from '../core/containsTarget';
import { useLatest } from '../core/useLatest';
import { normalizeRefs } from '../core/normalizeRefs';

type UsePointerLeaveOptions = {
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  onLeave: (event :PointerEvent) => void;
  ignore?: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[];
  delay?: number;
  enabled?: boolean;
};

export function usePointerLeave({
  ref,
  onLeave,
  ignore,
  delay = 0,
  enabled = true,
}: UsePointerLeaveOptions): void {

  const timeoutRef = useRef<number | null>(null);
  const wasInsideRef = useRef(false);

  const onLeaveRef = useLatest(onLeave)
  const refsRef = useLatest(ref)
  const ignoresRef = useLatest(ignore)

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
      const ignores = normalizeRefs(ignoresRef.current)

      const isInsideRef = refs.some((ref) => containsTarget(ref, event));
      const isInsideIgnore = ignores.some((ignore) => containsTarget(ignore, event));

      if (isInsideRef || isInsideIgnore) {
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
        onLeaveRef.current(event);
      }, delay);
    };

    document.addEventListener('pointermove', handlePointerMove);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      clearPendingTimeout();
    };

  }, [enabled, delay]);
}