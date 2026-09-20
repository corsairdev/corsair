import {
	CreateUrlInputSchema,
	CreateUrlResponseSchema,
	ListUrlsInputSchema,
	ListUrlsResponseSchema,
	TinyurlApiResponseEnvelopeSchema,
} from './endpoints/types';
import { TinyurlSchema } from './schema';

describe('Tinyurl schema', () => {
	it('declares a semver version', () => {
		expect(TinyurlSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares docs-labeled links from official TinyURL create/list payloads', () => {
		expect(Object.keys(TinyurlSchema.entities)).toEqual(['links']);
		expect(typeof TinyurlSchema.entities.links.parse).toBe('function');

		const created = TinyurlSchema.entities.links.parse({
			domain: 'tinyurl.com',
			alias: 'hna348w4',
			deleted: false,
			archived: false,
			analytics: { enabled: true, public: false },
			tags: [],
			created_at: '2026-09-02T12:16:27+00:00',
			expires_at: null,
			tiny_url: 'https://tinyurl.com/hna348w4',
			url: 'https://example.com/corsair-tinyurl-verify',
		});
		expect(created.tiny_url).toBe('https://tinyurl.com/hna348w4');
		expect(created.url).toBe('https://example.com/corsair-tinyurl-verify');
	});
});

describe('official docs fixtures', () => {
	it('accepts POST /create body from TinyURL helpdesk', () => {
		const parsed = CreateUrlInputSchema.parse({
			url: 'https://mybranded.link/my-really-long-link-that-I-need-to-shorten/84378949',
			domain: 'tinyurl.com',
			alias: 'enterYourCustomAliasHere',
			tags: 'example,link',
			expires_at: '2028-12-30 00:00:00',
			description: 'string',
		});
		expect(parsed.expires_at).toBe('2028-12-30 00:00:00');
	});

	it('rejects expires_at values that are not a real YYYY-MM-DD HH:MM:SS', () => {
		const invalid = [
			'tomorrow',
			'2026-04-31 00:00:00',
			'2023-02-29 00:00:00',
			'2026-13-01 00:00:00',
			'2026-01-01 24:00:00',
			'2026-01-01 00:60:00',
			'2026-01-01 00:00:60',
		];
		for (const expires_at of invalid) {
			expect(
				CreateUrlInputSchema.safeParse({
					url: 'https://example.com',
					expires_at,
				}).success,
			).toBe(false);
		}
		expect(
			CreateUrlInputSchema.safeParse({
				url: 'https://example.com',
				expires_at: '2024-02-29 23:59:59',
			}).success,
		).toBe(true);
	});

	it('rejects malformed create response URLs', () => {
		expect(
			CreateUrlResponseSchema.safeParse({
				domain: 'tinyurl.com',
				alias: 'x',
				tiny_url: 'not-a-url',
				url: 'https://example.com',
			}).success,
		).toBe(false);
		expect(
			CreateUrlResponseSchema.safeParse({
				domain: 'tinyurl.com',
				alias: 'x',
				tiny_url: 'https://tinyurl.com/x',
				url: 'not-a-url',
			}).success,
		).toBe(false);
	});

	it('parses live POST /create envelope', () => {
		const envelope = TinyurlApiResponseEnvelopeSchema.parse({
			data: {
				domain: 'tinyurl.com',
				alias: 'hna348w4',
				deleted: false,
				archived: false,
				analytics: { enabled: true, public: false },
				tags: [],
				created_at: '2026-09-02T12:16:27+00:00',
				expires_at: null,
				tiny_url: 'https://tinyurl.com/hna348w4',
				url: 'https://example.com/corsair-tinyurl-verify',
			},
			code: 0,
			errors: [],
		});
		expect(CreateUrlResponseSchema.parse(envelope.data).alias).toBe('hna348w4');
	});

	it('requires type available|archived for GET /urls/{type}', () => {
		expect(ListUrlsInputSchema.safeParse({}).success).toBe(false);
		expect(ListUrlsInputSchema.safeParse({ type: 'available' }).success).toBe(
			true,
		);
		expect(ListUrlsInputSchema.safeParse({ type: 'other' }).success).toBe(
			false,
		);
	});

	it('parses live GET /urls/available list (destination url omitted)', () => {
		const listed = ListUrlsResponseSchema.parse({
			code: 0,
			data: [
				{
					domain: 'tinyurl.com',
					alias: 'hna348w4',
					deleted: false,
					archived: false,
					analytics: { enabled: true, public: false },
					tags: [],
					created_at: '2026-09-02T12:16:27+00:00',
					expires_at: null,
					tiny_url: 'https://tinyurl.com/hna348w4',
				},
			],
			errors: [],
		});
		expect(listed.data[0]?.tiny_url).toBe('https://tinyurl.com/hna348w4');
		expect(listed.data[0]?.url).toBeUndefined();
	});
});
