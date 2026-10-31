import { parseManagedPricingCredentialsResponse } from '../hub/contracts/managed-pricing-api';
import {
	answeredFailed,
	describeAnsweredFailure,
} from '../hub/managed-pricing-auth';

// Whether a managed call gets its credits back turns on these three, so each
// branch is pinned here: what Hub may send, and what a result must hold.

// unknown: failed_when as it arrives in Hub's JSON, valid or not.
const parse = (failedWhen: unknown) =>
	parseManagedPricingCredentialsResponse({
		api_key: 'k',
		failed_when: failedWhen,
	}).failed_when;

describe("Hub's failed_when", () => {
	it.each([
		['a boolean', { path: 'success', equals: false }],
		['a string', { path: 'status', equals: 'failed' }],
		['a number', { path: 'status_code', equals: 40501 }],
		['a nested path', { path: 'data.metadata.status', equals: 'error' }],
	])('keeps %s', (_label, value) => {
		expect(parse(value)).toEqual(value);
	});

	it.each([
		['no field', undefined],
		['a string instead of an object', 'success'],
		['no path', { equals: false }],
		['a path that is not a string', { path: 1, equals: false }],
		['an empty path', { path: '', equals: false }],
		['a path with an empty step', { path: 'data..success', equals: false }],
		['a path starting with a digit', { path: '1success', equals: false }],
		['a path with a space', { path: 'suc cess', equals: false }],
		['no value', { path: 'success' }],
		['null', { path: 'success', equals: null }],
		['an object', { path: 'success', equals: { ok: false } }],
		['an array', { path: 'success', equals: [false] }],
		['NaN', { path: 'status_code', equals: Number.NaN }],
		['Infinity', { path: 'status_code', equals: Number.POSITIVE_INFINITY }],
	])('drops one with %s', (_label, value) => {
		expect(parse(value)).toBeUndefined();
	});

	it('keeps only path and equals', () => {
		expect(parse({ path: 'success', equals: false, extra: 'x' })).toEqual({
			path: 'success',
			equals: false,
		});
	});
});

describe('a result that says the call failed', () => {
	const firecrawl = { path: 'success', equals: false };

	it.each([
		['the flag at the top', firecrawl, { success: false }, true],
		['the flag set the other way', firecrawl, { success: true }, false],
		['no flag', firecrawl, { data: {} }, false],
		['0 where false is meant', firecrawl, { success: 0 }, false],
		['an empty string where false is meant', firecrawl, { success: '' }, false],
		['"false" as text', firecrawl, { success: 'false' }, false],
		[
			'a nested flag',
			{ path: 'data.metadata.status', equals: 'error' },
			{ data: { metadata: { status: 'error' } } },
			true,
		],
		[
			'a path through a value that is not an object',
			{ path: 'data.metadata.status', equals: 'error' },
			{ data: 'error' },
			false,
		],
		[
			'the same text in another case',
			{ path: 'status', equals: 'failed' },
			{ status: 'FAILED' },
			false,
		],
		[
			'a number',
			{ path: 'status_code', equals: 40501 },
			{ status_code: 40501 },
			true,
		],
		[
			'the number as text',
			{ path: 'status_code', equals: 40501 },
			{ status_code: '40501' },
			false,
		],
		['no result', firecrawl, null, false],
		['a result that is text', firecrawl, 'success', false],
	])('reads %s', (_label, failedWhen, result, failed) => {
		expect(answeredFailed(result, failedWhen)).toBe(failed);
	});
});

describe('the reason Hub records', () => {
	const firecrawl = { path: 'success', equals: false };

	it.each([
		[
			"the provider's code",
			{
				success: false,
				code: 'SCRAPE_DNS_RESOLUTION_ERROR',
				error: 'DNS failed',
			},
			'success was false: SCRAPE_DNS_RESOLUTION_ERROR',
		],
		[
			'its message when there is no code',
			{ success: false, error: 'DNS failed' },
			'success was false: DNS failed',
		],
		['the flag alone', { success: false }, 'success was false'],
		[
			'the flag alone when code and error are not text',
			{ success: false, code: 7, error: { message: 'x' } },
			'success was false',
		],
		[
			'the flag alone for a result that is not an object',
			'x',
			'success was false',
		],
	])('names %s', (_label, result, reason) => {
		expect(describeAnsweredFailure(result, firecrawl)).toBe(reason);
	});
});
