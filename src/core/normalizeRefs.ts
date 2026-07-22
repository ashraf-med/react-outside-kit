import {type RefObject } from 'react';

type OneOrManyRefs<T> = RefObject<T | null> | RefObject<T | null>[] | undefined;

export function normalizeRefs<T extends HTMLElement>(ref : OneOrManyRefs<T> ){

    return ref ? Array.isArray(ref) ? ref : [ref] : []

}
