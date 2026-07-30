import { useEffect, type RefObject } from 'react';
import { containsTarget } from '../core/containsTarget';
import { useLatest } from '../core/useLatest';
import { normalizeRefs } from '../core/normalizeRefs';


type UseClickOutsideOptions = {
    ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
    onOutside: (event: MouseEvent | TouchEvent | PointerEvent) => void,
    ignore?: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
    capture?: boolean,
    event?: "pointerdown" | "mousedown" | "touchstart" | "click"
    enabled?: boolean,
}

export function useClickOutside({
    ref,
    onOutside,
    ignore,
    capture = false,
    event = "pointerdown",
    enabled = true,

}: UseClickOutsideOptions): void {

    const onOutsideRef = useLatest(onOutside)
    const refsRef = useLatest(normalizeRefs(ref))
    const ignoreRef = useLatest(normalizeRefs(ignore))

    useEffect(() => {

        if (!enabled) return

        const handleClickOutside = (event: MouseEvent | TouchEvent | PointerEvent) => {

            const targetRefs = refsRef.current
            const ignoreRefs = ignoreRef.current

            // make sure targetRefs have atleast one non null ref 
            if (targetRefs.every(ref => ref.current == null)) {
                return;
            }

            const isTargetHit = targetRefs.some((ref) => containsTarget(ref, event))
            const isIgnoretHit = ignoreRefs.some((ignore) => containsTarget(ignore, event))

            if (!isIgnoretHit && !isTargetHit) {
                onOutsideRef.current(event)
            }
        };

        document.addEventListener(event, handleClickOutside, capture);

        return () => {

            document.removeEventListener(event, handleClickOutside, capture);
        }

    }, [event, enabled, capture])
}