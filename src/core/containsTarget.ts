import { type RefObject } from 'react';

export function containsTarget<T extends HTMLElement>(
    ref: RefObject<T | null>,
    event: Event
): Boolean {

    const element = ref.current

    if (!element) {
        return false;
    }

    if (typeof event.composedPath === 'function') {
        return event.composedPath().includes(element)
    }

    return element.contains(event.target as Node)
}