import { isArray } from './_internals/isArray.js';
import { curry } from './curry.js';

function swapArrayOrString(indexA, indexB, iterable) {
	const actualIndexA = indexA < 0 ? iterable.length + indexA : indexA;
	const actualIndexB = indexB < 0 ? iterable.length + indexB : indexB;
	if (
		actualIndexA === actualIndexB ||
		Math.min(actualIndexA, actualIndexB) < 0 ||
		Math.max(actualIndexA, actualIndexB) >= iterable.length
	)
		return iterable;
	if (typeof iterable === 'string') {
		return (
			iterable.slice(0, actualIndexA) +
			iterable[actualIndexB] +
			iterable.slice(actualIndexA + 1, actualIndexB) +
			iterable[actualIndexA] +
			iterable.slice(actualIndexB + 1)
		);
	}
	const clone = iterable.slice();
	const temp = clone[actualIndexA];
	clone[actualIndexA] = clone[actualIndexB];
	clone[actualIndexB] = temp;
	return clone;
}
function swapFn(indexA, indexB, iterable) {
	if (isArray(iterable) || typeof iterable === 'string')
		return swapArrayOrString(indexA, indexB, iterable);

	const aVal = iterable[indexA];
	const bVal = iterable[indexB];
	if (aVal === undefined || bVal === undefined) return iterable;
	return {
		...iterable,
		[indexA]: iterable[indexB],
		[indexB]: iterable[indexA],
	};
}

export const swap = curry(swapFn);
