import assert from 'node:assert/strict';
import { orderForPublish } from './publish-order.mjs';

const order = (entries) => orderForPublish(entries).map((e) => e.name);

// A dependency publishes before its dependent, even when the dependent sorts
// first alphabetically — the real `cli` -> `corsair` case.
assert.deepEqual(
	order([
		{ name: 'cli', deps: ['corsair'] },
		{ name: 'corsair', deps: [] },
	]),
	['corsair', 'cli'],
);

// Transitive chain: corsair -> cli -> studio.
assert.deepEqual(
	order([
		{ name: 'studio', deps: ['cli', 'corsair'] },
		{ name: 'cli', deps: ['corsair'] },
		{ name: 'corsair', deps: [] },
	]),
	['corsair', 'cli', 'studio'],
);

// Independent leaves (the ~700 plugins) keep input order.
assert.deepEqual(
	order([
		{ name: 'attio', deps: [] },
		{ name: 'openrouter', deps: [] },
	]),
	['attio', 'openrouter'],
);

// A cycle must not hang and must still emit every node exactly once.
const cyc = order([
	{ name: 'a', deps: ['b'] },
	{ name: 'b', deps: ['a'] },
]);
assert.deepEqual([...cyc].sort(), ['a', 'b']);

console.log('publish-order: all assertions passed');
