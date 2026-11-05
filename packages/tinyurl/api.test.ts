import { makeTinyurlRequest } from './client';
import type { TinyurlApiResponseEnvelope } from './endpoints/types';
import {
	CreateUrlResponseSchema,
	ListUrlsResponseSchema,
	TinyurlApiResponseEnvelopeSchema,
} from './endpoints/types';

const TEST_API_KEY = process.env.TINYURL_API_KEY;

const skipWithoutKey = !TEST_API_KEY
	? () => {
			console.warn('Skipping: TINYURL_API_KEY not set');
		}
	: null;

describe('TinyURL live API', () => {
	it('creates and lists a URL when TINYURL_API_KEY is set', async () => {
		if (skipWithoutKey) return skipWithoutKey();

		const created = await makeTinyurlRequest<TinyurlApiResponseEnvelope>(
			'/create',
			TEST_API_KEY!,
			{
				method: 'POST',
				body: { url: 'https://example.com/corsair-tinyurl-verify' },
			},
		);

		const envelope = TinyurlApiResponseEnvelopeSchema.parse(created);
		const link = CreateUrlResponseSchema.parse(envelope.data);
		expect(link.tiny_url).toMatch(/^https:\/\//);
		expect(link.url).toBe('https://example.com/corsair-tinyurl-verify');

		const listed = await makeTinyurlRequest<unknown>(
			'/urls/available',
			TEST_API_KEY!,
			{
				method: 'GET',
				query: { page: 1, limit: 10 },
			},
		);

		const page = ListUrlsResponseSchema.parse(listed);
		expect(page.data.some((item) => item.alias === link.alias)).toBe(true);
	});
});
