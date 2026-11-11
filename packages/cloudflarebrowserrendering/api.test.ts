import { makeCloudflareBrowserRenderingRequest } from './client';
import { CloudflareBrowserRenderingEndpointOutputSchemas } from './endpoints/types';

const KEY = process.env.CLOUDFLAREBROWSERRENDERING_API_KEY ?? '';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID ?? '';
const describeLive =
	KEY.length > 0 && ACCOUNT_ID.length > 0 ? describe : describe.skip;

describeLive('Cloudflare Browser Run live API (env-gated)', () => {
	it('fetches rendered HTML for a public example page', async () => {
		const result = await makeCloudflareBrowserRenderingRequest(
			`/accounts/${encodeURIComponent(ACCOUNT_ID)}/browser-run/content`,
			KEY,
			{
				method: 'POST',
				body: { url: 'https://example.com' },
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.contentFetch.parse(
				result,
			);
		expect(typeof parsed).toBe('string');
	});
});
