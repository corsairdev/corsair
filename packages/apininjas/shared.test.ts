/**
 * The helpers every endpoint module leans on.
 *
 * These are small, but three of them decide whether a value reaches the cache
 * or the event log at all - so their edge cases are worth stating explicitly
 * rather than covering incidentally through an endpoint test.
 */
import { auditPayload, withCount } from './endpoints/logging';
import {
	asArray,
	asNumber,
	entityId,
	imageContentType,
	imageEncoding,
	isMaskedValue,
	keyed,
	unmasked,
} from './endpoints/shared';

describe('isMaskedValue', () => {
	it.each([
		'This field is for premium subscribers only.',
		'this field is for premium subscribers only',
		'Only available for premium subscribers.',
		'Available for premium subscribers only.',
		'premium subscription required.',
		'Bank name is for premium subscribers only.',
		'No Data',
	])('recognises %j as withheld rather than as data', (prose) => {
		// The wording differs between endpoints, which is why this matches a stem
		// rather than a phrase.
		expect(isMaskedValue(prose)).toBe(true);
	});

	it.each([
		['a real string value', 'London Heathrow Airport'],
		['a number', 306.04],
		['a boolean', true],
		['null', null],
		['undefined', undefined],
		['an object', { premium: true }],
		['an array', ['premium']],
	])('treats %s as data', (_label, value) => {
		expect(isMaskedValue(value)).toBe(false);
	});

	it.each([
		'Premium Economy',
		'Vanguard Premium Fund',
		'premium unleaded',
		'No data available for this region yet',
	])('does not mistake %j for a placeholder', (realValue) => {
		// A false positive here silently drops real data from the mirror, which is
		// why the matcher names the subscription rather than the word "premium",
		// and anchors the bare "No Data" form.
		expect(isMaskedValue(realValue)).toBe(false);
	});
});

describe('unmasked', () => {
	it('passes real values through unchanged', () => {
		expect(unmasked('EGLL')).toBe('EGLL');
		expect(unmasked(42)).toBe(42);
		expect(unmasked(null)).toBeNull();
	});

	it('drops a masked value so it cannot be stored as data', () => {
		expect(
			unmasked('This field is for premium subscribers only.'),
		).toBeUndefined();
	});
});

describe('asNumber', () => {
	it('returns a finite number as itself', () => {
		expect(asNumber(51.5074)).toBe(51.5074);
		expect(asNumber(0)).toBe(0);
		expect(asNumber(-1)).toBe(-1);
	});

	it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
		'rejects the non-finite number %p',
		(value) => {
			expect(asNumber(value)).toBeUndefined();
		},
	);

	it('parses a numeric string, which is how most of this API sends numbers', () => {
		// Aircraft speeds, star magnitudes and motorcycle displacements all arrive
		// as strings.
		expect(asNumber('547')).toBe(547);
		expect(asNumber('0.03')).toBe(0.03);
		expect(asNumber('-71.1347')).toBe(-71.1347);
	});

	it('strips thousands separators before parsing', () => {
		expect(asNumber('8,500')).toBe(8500);
		expect(asNumber('1,234,567')).toBe(1234567);
	});

	it('takes the leading number when a string carries a unit', () => {
		// "271.0 ccm (16.54 cubic inches)" is a real motorcycle displacement.
		expect(asNumber('271.0 ccm (16.54 cubic inches)')).toBe(271);
	});

	it('refuses a masked value rather than parsing prose', () => {
		expect(
			asNumber('This field is for premium subscribers only.'),
		).toBeUndefined();
	});

	it.each([
		['unparseable text', 'not a number'],
		['an empty string', ''],
		['null', null],
		['undefined', undefined],
		['a boolean', true],
		['an object', {}],
	])('returns undefined for %s', (_label, value) => {
		expect(asNumber(value)).toBeUndefined();
	});
});

describe('entityId', () => {
	it('joins the parts of a natural key', () => {
		expect(entityId('Boeing', '737 Max 7')).toBe('boeing|737 max 7');
	});

	it('lowercases and trims so the same row always keys the same', () => {
		// The provider is inconsistent about casing between endpoints - `cars`
		// returns "toyota" while `sp500` returns "Microsoft".
		expect(entityId('  EGLL  ')).toBe('egll');
		expect(entityId('London', 'GB')).toBe(entityId('LONDON ', ' gb'));
	});

	it('keeps a missing part as an empty segment rather than collapsing it', () => {
		// Collapsing would let two different rows share a key.
		expect(entityId('car', null, 'corolla', undefined)).toBe('car||corolla|');
		expect(entityId('car', 'toyota', 'corolla', 1993)).not.toBe(
			entityId('car', null, 'corolla', 1993),
		);
	});

	it('accepts numbers, which is how years arrive on some endpoints', () => {
		expect(entityId('car', 'toyota', 'corolla', 1993)).toBe(
			'car|toyota|corolla|1993',
		);
	});

	it('produces an empty string when nothing identifies the row', () => {
		// The cache helpers check for this and skip the row.
		expect(entityId(undefined)).toBe('');
		expect(entityId(null)).toBe('');
	});
});

describe('keyed', () => {
	it('accepts a key with any part present', () => {
		expect(keyed('toyota', null, undefined)).toBe(true);
		expect(keyed(null, 'corolla')).toBe(true);
		expect(keyed(undefined, undefined, 1993)).toBe(true);
	});

	it('rejects a key with nothing in any part', () => {
		expect(keyed(null, undefined)).toBe(false);
		expect(keyed()).toBe(false);
	});

	it('treats whitespace as absent, matching entityId trimming', () => {
		expect(keyed('   ', '')).toBe(false);
	});

	it('is independent of how many parts the key has', () => {
		// Comparing entityId's output against '|' only catches a two-part key.
		expect(keyed(null, null, null)).toBe(false);
		expect(entityId(null, null, null)).toBe('||');
	});
});

describe('imageContentType', () => {
	it.each([
		['png', 'image/png'],
		['jpg', 'image/jpeg'],
		['jpeg', 'image/jpeg'],
		['svg', 'image/svg+xml'],
		['eps', 'application/postscript'],
	])('maps %s to %s', (format, expected) => {
		expect(imageContentType(format)).toBe(expected);
	});

	it('is case-insensitive, because the parameter is free text', () => {
		expect(imageContentType('SVG')).toBe('image/svg+xml');
		expect(imageContentType('PNG')).toBe('image/png');
	});

	it('defaults to PNG when no format is given, matching the provider', () => {
		expect(imageContentType(undefined)).toBe('image/png');
		expect(imageContentType('')).toBe('image/png');
	});

	it('falls back to octet-stream for a format it does not know', () => {
		// Better than claiming a content type the payload does not have.
		expect(imageContentType('webp')).toBe('application/octet-stream');
	});
});

describe('imageEncoding', () => {
	it.each(['svg', 'eps', 'SVG'])(
		'reports %s as exact, because the payload is text',
		(format) => {
			expect(imageEncoding(format)).toBe('text');
		},
	);

	it.each(['png', 'jpg', 'jpeg', 'webp', undefined, ''])(
		'reports %s as lossy, because the transport decodes bytes as text',
		(format) => {
			// The caller needs to know the difference: one of these can be written
			// back out as an image and the other cannot.
			expect(imageEncoding(format)).toBe('lossy-text');
		},
	);
});

describe('asArray', () => {
	it('passes an array through', () => {
		const rows = [{ id: 1 }, { id: 2 }];
		expect(asArray(rows)).toBe(rows);
	});

	it('wraps a bare object, which some endpoints return instead of a list', () => {
		expect(asArray({ icao: 'EGLL' })).toEqual([{ icao: 'EGLL' }]);
	});

	it('returns an empty list for nothing, so a caller can always iterate', () => {
		expect(asArray(null)).toEqual([]);
		expect(asArray(undefined)).toEqual([]);
	});

	it('keeps an empty array empty', () => {
		expect(asArray([])).toEqual([]);
	});
});

describe('auditPayload', () => {
	it('records named identifiers by value', () => {
		expect(auditPayload({ ticker: 'AAPL', year: 2026 }, ['ticker'])).toEqual({
			ticker: 'AAPL',
			supplied_fields: ['ticker', 'year'],
		});
	});

	it('lists supplied field names even when they are not identifiers', () => {
		// An operator can see what a call attempted to change without seeing the
		// values it used.
		const payload = auditPayload({ city: 'London', state: 'England' }, []);

		expect(payload.supplied_fields).toEqual(['city', 'state']);
		expect(payload.city).toBeUndefined();
	});

	it('ignores an identifier that was not supplied', () => {
		expect(
			auditPayload({ ticker: undefined, limit: 5 }, ['ticker', 'limit']),
		).toEqual({ limit: 5, supplied_fields: ['limit'] });
	});

	it('omits the fields list entirely when nothing was supplied', () => {
		expect(auditPayload({}, [])).toEqual({});
		expect(auditPayload({ ticker: undefined }, ['ticker'])).toEqual({});
	});

	it.each([
		['text', 'a sentence the caller wrote'],
		['email', 'someone@example.com'],
		['number', '+15550100'],
		['address', '203.0.113.7'],
		['url', 'https://internal.example.com/private'],
		['query', '1lb brisket and fries'],
	])('reduces %s to a length instead of a value', (key, value) => {
		const payload = auditPayload({ [key]: value }, [key]);

		expect(payload[key]).toBeUndefined();
		expect(payload[`${key}_length`]).toBe(value.length);
		expect(JSON.stringify(payload)).not.toContain(value);
	});

	it('reduces a structured input to its length rather than its contents', () => {
		const payload = auditPayload(
			{
				puzzle: [
					[0, 1],
					[1, 0],
				],
			},
			['puzzle'],
		);

		expect(payload.puzzle).toBeUndefined();
		expect(payload.puzzle_length).toBe(2);
	});

	it('leaves a sensitive field with no measurable size out entirely', () => {
		const payload = auditPayload({ data: 42 }, ['data']);

		expect(payload.data).toBeUndefined();
		expect(payload.data_length).toBeUndefined();
		expect(payload.supplied_fields).toEqual(['data']);
	});
});

describe('withCount', () => {
	it('adds the row count for a collection', () => {
		expect(withCount({ name: 'London' }, [{ a: 1 }, { b: 2 }])).toEqual({
			name: 'London',
			result_count: 2,
		});
	});

	it('counts an empty collection as zero rather than omitting it', () => {
		// "No rows" and "not a collection" are different facts.
		expect(withCount({}, [])).toEqual({ result_count: 0 });
	});

	it('leaves a single-object response alone', () => {
		expect(withCount({ ticker: 'AAPL' }, { price: 1 })).toEqual({
			ticker: 'AAPL',
		});
	});
});
