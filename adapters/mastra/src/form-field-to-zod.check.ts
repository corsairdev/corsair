import assert from 'node:assert/strict';
import type { FormFieldSchema } from 'corsair';
import { formFieldToZod } from './form-field-to-zod.js';

function ok(schema: FormFieldSchema, value: unknown) {
	return formFieldToZod(schema).safeParse(value).success;
}

// string: optional + enum
assert.equal(ok({ kind: 'string', optional: false }, 'x'), true);
assert.equal(ok({ kind: 'string', optional: false }, 5), false);
assert.equal(ok({ kind: 'string', optional: true }, undefined), true);
assert.equal(ok({ kind: 'string', optional: false }, undefined), false);
assert.equal(
	ok({ kind: 'string', optional: false, enum: ['a', 'b'] }, 'a'),
	true,
);
assert.equal(
	ok({ kind: 'string', optional: false, enum: ['a', 'b'] }, 'c'),
	false,
);

// number / boolean / literal
assert.equal(ok({ kind: 'number', optional: false }, 5), true);
assert.equal(ok({ kind: 'number', optional: false }, 'x'), false);
assert.equal(ok({ kind: 'boolean', optional: false }, true), true);
assert.equal(ok({ kind: 'literal', optional: false, value: 'v' }, 'v'), true);
assert.equal(ok({ kind: 'literal', optional: false, value: 'v' }, 'w'), false);

// object with a required and an optional field
const obj: FormFieldSchema = {
	kind: 'object',
	optional: false,
	fields: {
		channel: { kind: 'string', optional: false },
		limit: { kind: 'number', optional: true },
	},
};
assert.equal(ok(obj, { channel: 'general' }), true);
assert.equal(ok(obj, { limit: 10 }), false); // channel missing
assert.equal(ok(obj, { channel: 'general', limit: 'x' }), false);

// array + nesting
assert.equal(
	ok(
		{
			kind: 'array',
			optional: false,
			items: { kind: 'string', optional: false },
		},
		['a', 'b'],
	),
	true,
);
assert.equal(
	ok(
		{
			kind: 'array',
			optional: false,
			items: { kind: 'number', optional: false },
		},
		['a'],
	),
	false,
);

// unknown accepts anything
assert.equal(ok({ kind: 'unknown', optional: false }, { anything: [1] }), true);

// description is carried onto the zod type
assert.equal(
	formFieldToZod({
		kind: 'string',
		optional: false,
		description: 'a channel id',
	}).description,
	'a channel id',
);

console.log('form-field-to-zod.check: all assertions passed');
