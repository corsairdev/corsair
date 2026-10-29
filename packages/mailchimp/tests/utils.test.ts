import { createHash } from 'node:crypto';

import { resolveMailchimpBaseUrl } from '../client';
import {
	basicAuthHeader,
	bearerAuthHeader,
	dataCenterFromApiKey,
	mailchimpBaseUrl,
	normalizeListQuery,
	subscriberHash,
} from '../utils';

describe('subscriberHash', () => {
	// MD5 of the lowercase email — Mailchimp's documented subscriber_hash rule.
	it('C-9: hashes the lowercase email (MD5)', () => {
		expect(subscriberHash('foo@bar.com')).toBe(
			'f3ada405ce890b6f8204094deb12d8a8',
		);
		expect(subscriberHash('summer@example.com')).toBe(
			'ab2aa0449e908991c43e29ac2e406742',
		);
	});

	it('C-9: lowercases before hashing (case-insensitive)', () => {
		expect(subscriberHash('Foo@Bar.COM')).toBe(
			'f3ada405ce890b6f8204094deb12d8a8',
		);
	});

	it('C-10: trims surrounding whitespace before hashing', () => {
		expect(subscriberHash('  foo@bar.com  ')).toBe(
			'f3ada405ce890b6f8204094deb12d8a8',
		);
	});

	it('C-10: is stable for an already-lowercase email', () => {
		expect(subscriberHash('foo@bar.com')).toBe(subscriberHash('foo@bar.com'));
	});

	it('C-11: passes through an existing 32-char hex hash (lowercased)', () => {
		const hash = createHash('md5').update('a@b.com').digest('hex');
		expect(subscriberHash(hash)).toBe(hash);
		expect(subscriberHash(hash.toUpperCase())).toBe(hash);
	});

	it('produces a 32-char lowercase hex string', () => {
		expect(subscriberHash('anyone@example.com')).toMatch(/^[a-f0-9]{32}$/);
	});
});

describe('dataCenterFromApiKey', () => {
	it('C-2: derives the data center from the key suffix', () => {
		expect(dataCenterFromApiKey('abc123def456-us19')).toBe('us19');
		expect(dataCenterFromApiKey('key-us21')).toBe('us21');
	});

	it('C-3: throws when the key has no "-<dc>" suffix', () => {
		expect(() => dataCenterFromApiKey('nodcsuffix')).toThrow(/data center/i);
	});

	it('C-3: throws when the suffix is empty', () => {
		expect(() => dataCenterFromApiKey('trailingdash-')).toThrow(/data center/i);
	});
});

describe('mailchimpBaseUrl', () => {
	it('C-1: builds the versioned base URL for a data center', () => {
		expect(mailchimpBaseUrl('us19')).toBe('https://us19.api.mailchimp.com/3.0');
	});

	it('throws when no data center is provided', () => {
		expect(() => mailchimpBaseUrl('')).toThrow(/data center/i);
	});
});

describe('auth headers', () => {
	it('C-7: API key → HTTP Basic (anystring:key)', () => {
		const expected = `Basic ${Buffer.from('anystring:key-us19').toString('base64')}`;
		expect(basicAuthHeader('key-us19')).toBe(expected);
	});

	it('C-6: access token → Bearer', () => {
		expect(bearerAuthHeader('tok_abc')).toBe('Bearer tok_abc');
	});

	it('C-8: throws on empty key/token', () => {
		expect(() => basicAuthHeader('')).toThrow(/API key/i);
		expect(() => bearerAuthHeader('')).toThrow(/access token/i);
	});
});

describe('resolveMailchimpBaseUrl (client)', () => {
	it('C-4: OAuth uses the provided data center', () => {
		expect(
			resolveMailchimpBaseUrl('tok_abc', {
				authType: 'oauth_2',
				dataCenter: 'us20',
			}),
		).toBe('https://us20.api.mailchimp.com/3.0');
	});

	it('C-2: API key derives the data center from the key', () => {
		expect(resolveMailchimpBaseUrl('key-us7', { authType: 'api_key' })).toBe(
			'https://us7.api.mailchimp.com/3.0',
		);
	});

	it('N-6: OAuth without a data center throws (never silently defaults)', () => {
		expect(() =>
			resolveMailchimpBaseUrl('tok_abc', { authType: 'oauth_2' }),
		).toThrow(/data center/i);
	});
});

describe('normalizeListQuery', () => {
	it('C-12: forwards count and offset', () => {
		expect(normalizeListQuery({ count: 10, offset: 20 })).toEqual({
			count: 10,
			offset: 20,
		});
	});

	it('C-13: joins fields and exclude_fields as comma-separated strings', () => {
		expect(
			normalizeListQuery({
				fields: ['lists.id', 'lists.name'],
				excludeFields: ['_links'],
			}),
		).toEqual({
			fields: 'lists.id,lists.name',
			exclude_fields: '_links',
		});
	});

	it('omits empty/undefined options', () => {
		expect(normalizeListQuery({})).toEqual({});
		expect(normalizeListQuery({ fields: [], excludeFields: [] })).toEqual({});
	});
});
