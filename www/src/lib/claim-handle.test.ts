import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { handleProblem, linkProblem, tidyTyped } from './claim-handle';

// Ported from lug.dev (hub apps/lug/src/lib/handle.test.ts). lug.dev also
// reserves brand names and runs a blocklist locally; here Hub's availability
// check answers for those (see /api/lug-handle).

describe('handleProblem', () => {
	for (const h of ['a', 'yuvraj', 'a1', 'team-7', 'x'.repeat(32), '0day']) {
		it(`accepts ${h}`, () => {
			assert.equal(handleProblem(h), null);
		});
	}

	for (const [h, label] of [
		['', 'empty'],
		['-yuv', 'leading hyphen'],
		['yuv-', 'trailing hyphen'],
		['Yuv', 'uppercase'],
		['yu_v', 'underscore'],
		['yu.v', 'dot'],
		['x'.repeat(33), '33 chars'],
		['xn--80ak6aa92e', 'punycode'],
		['ab--cd', '-- at 2–3'],
	] as const) {
		it(`rejects ${h} (${label}) as format`, () => {
			assert.equal(handleProblem(h), 'format');
		});
	}

	it('allows -- past positions 2–3', () => {
		assert.equal(handleProblem('abc--d'), null);
	});

	it("reserves Corsair's own names", () => {
		for (const h of ['www', 'api', 'hub', 'admin', 'corsair', 'billing']) {
			assert.equal(handleProblem(h), 'reserved', h);
		}
	});

	it('treats _box as a format problem, since it can never be typed validly', () => {
		assert.equal(handleProblem('_box'), 'format');
	});
});

describe('linkProblem', () => {
	it('uses the handle format without the reserved list', () => {
		assert.equal(linkProblem('work'), null);
		assert.equal(linkProblem('api'), null);
		assert.equal(linkProblem('-work'), 'format');
		assert.equal(linkProblem(''), 'format');
	});
});

describe('tidyTyped', () => {
	it('lowercases and turns spaces into hyphens', () => {
		assert.equal(tidyTyped('Yuvraj Singh'), 'yuvraj-singh');
		assert.equal(tidyTyped(' A\tB '), '-a-b-');
	});

	it('leaves other characters for the validator to flag', () => {
		assert.equal(tidyTyped('yu_v.1'), 'yu_v.1');
	});
});
