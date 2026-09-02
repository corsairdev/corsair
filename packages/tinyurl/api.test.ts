import 'dotenv/config';
import { makeTinyurlRequest } from './client';
import type { TinyurlApiResponseEnvelope } from './endpoints/types';
import {
	CreateUrlInputSchema,
	CreateUrlResponseSchema,
	TinyurlApiResponseEnvelopeSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.TINYURL_API_KEY;

const skipWithoutKey = !TEST_API_KEY
	? () => {
			console.warn('Skipping: TINYURL_API_KEY not set');
		}
	: null;

describe('TinyURL API Schema & Type Contract', () => {
	it('validates a valid CreateUrlInput object against schema', () => {
		const input = {
			url: 'https://example.com/some/article',
			domain: 'tinyurl.com',
			alias: 'custom-link-test',
			tags: ['test', 'ci'],
			expires_at: '2026-12-31 23:59:59',
			description: 'Test link description',
		};

		const parsed = CreateUrlInputSchema.parse(input);
		expect(parsed.url).toBe('https://example.com/some/article');
		expect(parsed.domain).toBe('tinyurl.com');
		expect(parsed.alias).toBe('custom-link-test');
		expect(parsed.tags).toEqual(['test', 'ci']);
	});

	it('validates a valid TinyURL response envelope against schema', () => {
		const rawApiResponse = {
			data: {
				domain: 'tinyurl.com',
				alias: 'xyz789',
				deleted: false,
				archived: false,
				tags: ['marketing'],
				created_at: '2026-01-01T00:00:00.000Z',
				expires_at: null,
				tiny_url: 'https://tinyurl.com/xyz789',
				url: 'https://example.com/destination',
				description: 'Campaign link',
			},
			code: 0,
			errors: [],
		};

		const envelope = TinyurlApiResponseEnvelopeSchema.parse(rawApiResponse);
		expect(envelope.data.tiny_url).toBe('https://tinyurl.com/xyz789');

		const link = CreateUrlResponseSchema.parse(envelope.data);
		expect(link.tiny_url).toBe('https://tinyurl.com/xyz789');
		expect(link.url).toBe('https://example.com/destination');
		expect(link.alias).toBe('xyz789');
		expect(link.domain).toBe('tinyurl.com');
	});

	it('performs live URL creation when TINYURL_API_KEY is provided', async () => {
		if (skipWithoutKey) return skipWithoutKey();

		const uniqueAlias = `corsair-test-${Date.now()}`;
		const response = await makeTinyurlRequest<TinyurlApiResponseEnvelope>(
			'/create',
			TEST_API_KEY!,
			{
				method: 'POST',
				body: {
					url: 'https://example.com/corsair-test',
					alias: uniqueAlias,
				},
			},
		);

		const envelope = TinyurlApiResponseEnvelopeSchema.parse(response);
		const link = CreateUrlResponseSchema.parse(envelope.data);

		expect(link.tiny_url).toBeTruthy();
		expect(link.alias).toBe(uniqueAlias);
	});
});
