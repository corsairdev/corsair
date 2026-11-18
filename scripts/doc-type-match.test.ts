import assert from 'node:assert/strict';
import { test } from 'node:test';
import { topLevelUnionMembers, valueMatchesDocType } from './doc-type-match.ts';

test('splits a type on its top-level unions only', () => {
	assert.deepEqual(topLevelUnionMembers('a | b | { c: d | e } | null'), [
		'a',
		'b',
		'{ c: d | e }',
		'null',
	]);
});

test('accepts enum members, which the docs render without quotes', () => {
	const sortBy = 'qualityScore | newestFirst | ratingHigh | ratingLow | null';
	assert.equal(valueMatchesDocType('newestFirst', sortBy), true);
	assert.equal(valueMatchesDocType(null, sortBy), true);
	assert.equal(valueMatchesDocType('oldestFirst', sortBy), false);
	assert.equal(valueMatchesDocType(10, '10 | 25 | 50 | 100'), true);
	assert.equal(valueMatchesDocType(11, '10 | 25 | 50 | 100'), false);
	assert.equal(valueMatchesDocType(6, '1 | 2 | 5 | 6 | 11 | null'), true);
	assert.equal(valueMatchesDocType(true, 'true'), true);
});

test('does not treat a type name as an enum member', () => {
	assert.equal(valueMatchesDocType('number', 'number'), false);
	assert.equal(valueMatchesDocType('string', 'string'), true);
	assert.equal(valueMatchesDocType('boolean', 'boolean | null'), false);
});

test('keeps the primitive, array and object checks', () => {
	assert.equal(valueMatchesDocType('x', 'string'), true);
	assert.equal(valueMatchesDocType(1, 'string'), false);
	assert.equal(valueMatchesDocType([1], 'number[]'), true);
	assert.equal(valueMatchesDocType({ a: 1 }, '{ a: number }'), true);
	assert.equal(valueMatchesDocType({ a: 1 }, 'JsonValue'), true);
	assert.equal(valueMatchesDocType('x', 'JsonValue[]'), false);
});

test('matches an enum member only with a value of its own kind', () => {
	// Review on #2626 (CodeRabbit, Greptile): quoted numbers and booleans.
	assert.equal(valueMatchesDocType('10', '10 | 25 | 50 | 100'), false);
	assert.equal(valueMatchesDocType('false', 'false'), false);
	assert.equal(valueMatchesDocType('true', 'true | null'), false);
	assert.equal(valueMatchesDocType(false, 'false'), true);
	assert.equal(valueMatchesDocType(1.5, '1.5 | 2'), true);
});

test('never matches a string against a structural type', () => {
	assert.equal(valueMatchesDocType('JsonValue[]', 'JsonValue[]'), false);
	assert.equal(valueMatchesDocType('number[]', 'number[]'), false);
	assert.equal(valueMatchesDocType([1, 2], 'number[]'), true);
});
