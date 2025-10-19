import { mergeDeepRight } from './mergeDeepRight.js';

export function mergeDeepLeft(newProps, target) {
	return mergeDeepRight(target, newProps);
}
