import { makeCuttlyRequest } from './client';
import { CuttlyEndpointOutputSchemas } from './endpoints/types';

// Live verification against the official Cutt.ly Regular API
// (https://cutt.ly/api-documentation/regular-api). The key is read from the
// environment so no secret is ever committed (R6); CI without a key skips.
const apiKey = process.env.CUTTLY_API_KEY;

describe('Cutt.ly live API', () => {
	it('shortens a URL and reads its stats when CUTTLY_API_KEY is set', async () => {
		if (!apiKey) {
			console.warn('Skipping: CUTTLY_API_KEY not set');
			return;
		}

		const target = `https://example.com/corsair-cuttly-verify?run=${Date.now()}`;

		const shortened = CuttlyEndpointOutputSchemas.shorten.parse(
			await makeCuttlyRequest(apiKey, { short: target }),
		);

		expect(shortened.url.status).toBe(7);
		expect(shortened.url.shortLink).toMatch(/^https:\/\//);
		expect(shortened.url.fullLink).toContain('example.com');

		const shortLink = shortened.url.shortLink;
		if (shortLink === undefined) {
			throw new Error('Live shorten response omitted shortLink');
		}

		const stats = CuttlyEndpointOutputSchemas.analytics.parse(
			await makeCuttlyRequest(apiKey, { stats: shortLink }),
		);

		expect(stats.stats.status).toBe(1);
		expect(stats.stats.shortLink).toBe(shortLink);
	});
});
