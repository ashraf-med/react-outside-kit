import { useEffect } from 'react';
import { useLatest } from '../core/useLatest';

type UseEscapeKeyOptions = {
    onEscape: (event: KeyboardEvent) => void,
    enabled?: boolean,
}

export function useEscapeKey({
    onEscape,
    enabled = true,
}: UseEscapeKeyOptions): void {

    const onEscapeRef = useLatest(onEscape)

    useEffect(() => {

        if (!enabled) return

        const handleEscPress = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            onEscapeRef.current(event)
        }

        document.addEventListener('keydown', handleEscPress)

        return () => {
            document.removeEventListener('keydown', handleEscPress)
        }

    }, [enabled])
}