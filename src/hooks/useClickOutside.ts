import { useEffect, type RefObject } from 'react';
import { containsTarget } from '../core/containsTarget';
import { useLatest } from '../core/useLatest';
import { normalizeRefs } from '../core/normalizeRefs';


type UseClickOutsideOptions = {
    ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
    onOutside: (event: MouseEvent | TouchEvent | KeyboardEvent) => void,
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

    useEffect(() => {

        if (!enabled) return

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {

            const targetRefs = normalizeRefs(ref)
            const ignoreRefs = normalizeRefs(ignore)

            const isTargetHit = targetRefs.some((ref) => containsTarget(ref, event))
            const isIgnoretHit = ignoreRefs.some((ignore) => containsTarget(ignore, event))

            if (!isIgnoretHit && !isTargetHit) {
                onOutsideRef.current(event)
            }
        };

        document.addEventListener(event, handleClickOutside, capture);

        return () => {

            console.log("removing listener")
            document.removeEventListener(event, handleClickOutside, capture);
        }

    }, [ignore, enabled, capture])
}