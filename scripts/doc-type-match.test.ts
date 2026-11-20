import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	fieldSchemaCheck,
	topLevelUnionMembers,
	valueMatchesDocType,
	zodObjectFields,
} from './doc-type-match.ts';

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

test('text fallback: numbers and booleans match only their own members', () => {
	assert.equal(valueMatchesDocType(false, 'false'), true);
	assert.equal(valueMatchesDocType(1.5, '1.5 | 2'), true);
	assert.equal(valueMatchesDocType(3, '1.5 | 2'), false);
	// A rendered `1` may be the string '1' (Bolt IoT's state enum), so the
	// text fallback lets a string match it; fieldSchemaCheck knows the kind.
	assert.equal(valueMatchesDocType('1', 'HIGH | LOW | 1 | 0'), true);
});

// Stand-ins with zod's surface (safeParse, _def), so this file runs under
// plain node without the workspace's zod.
const literalEnum = (values: unknown[]) => ({
	safeParse: (value: unknown) =>
		values.includes(value)
			? { success: true }
			: {
					success: false,
					error: {
						issues: [{ code: 'invalid_value', message: 'Invalid option' }],
					},
				},
});

test('the plugin schema decides an example: string 1 vs number 1', () => {
	// Review on #2626 (Greptile): z.enum(['HIGH', 'LOW', '1', '0']) and a
	// numeric enum both render as `... | 1 | 0`.
	const stringEnum = literalEnum(['HIGH', 'LOW', '1', '0']);
	const numberEnum = literalEnum([10, 25, 50, 100]);
	const booleanLiteral = literalEnum([false]);
	assert.equal(fieldSchemaCheck(stringEnum, '1'), undefined);
	assert.equal(fieldSchemaCheck(stringEnum, 1), 'Invalid option');
	assert.equal(fieldSchemaCheck(numberEnum, 10), undefined);
	assert.equal(fieldSchemaCheck(numberEnum, '10'), 'Invalid option');
	assert.equal(fieldSchemaCheck(booleanLiteral, 'false'), 'Invalid option');
});

test('placeholder text that only breaks a length or format rule passes', () => {
	// Sympla's example: "<130-132 character signature from the QR code>".
	const minLength = {
		safeParse: (value: unknown) =>
			typeof value === 'string' && value.length >= 130
				? { success: true }
				: typeof value === 'string'
					? {
							success: false,
							error: { issues: [{ code: 'too_small', message: 'Too small' }] },
						}
					: {
							success: false,
							error: {
								issues: [{ code: 'invalid_type', message: 'Expected string' }],
							},
						},
	};
	assert.equal(
		fieldSchemaCheck(minLength, '<130-132 character signature>'),
		undefined,
	);
	assert.equal(fieldSchemaCheck(minLength, 42), 'Expected string');
});

test('a union is the wrong kind only when every branch is', () => {
	// Review on #2626 (CodeRabbit): z.union([z.string().length(130),
	// z.string().length(132)]) reports a short placeholder as invalid_union.
	const lengthOnly = (code: string) => ({
		safeParse: () => ({
			success: false,
			error: {
				issues: [
					{
						code: 'invalid_union',
						message: 'Invalid input',
						errors: [[{ code }], [{ code }]],
					},
				],
			},
		}),
	});
	assert.equal(fieldSchemaCheck(lengthOnly('too_small'), ''), undefined);
	assert.equal(
		fieldSchemaCheck(lengthOnly('invalid_type'), 42),
		'Invalid input',
	);
	const mixed = {
		safeParse: () => ({
			success: false,
			error: {
				issues: [
					{
						code: 'invalid_union',
						message: 'Invalid input',
						errors: [[{ code: 'invalid_type' }], [{ code: 'too_small' }]],
					},
				],
			},
		}),
	};
	assert.equal(fieldSchemaCheck(mixed, 'short'), undefined);
});

test('finds the object fields through optional, pipe and lazy wrappers', () => {
	const state = literalEnum(['HIGH', 'LOW', '1', '0']);
	const object = { safeParse: () => ({ success: true }), shape: { state } };
	const optional = {
		safeParse: () => ({ success: true }),
		_def: { innerType: object },
	};
	const lazy = {
		safeParse: () => ({ success: true }),
		_def: { getter: () => optional },
	};
	assert.equal(zodObjectFields(lazy)?.state, state);
	assert.equal(zodObjectFields(undefined), undefined);
	assert.equal(zodObjectFields(literalEnum(['a'])), undefined);
});

test('never matches a string against a structural type', () => {
	assert.equal(valueMatchesDocType('JsonValue[]', 'JsonValue[]'), false);
	assert.equal(valueMatchesDocType('number[]', 'number[]'), false);
	assert.equal(valueMatchesDocType([1, 2], 'number[]'), true);
});
