import { BrowserUseAPIError, requestBrowserUse } from './client';
import { BrowsersListOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.BROWSER_USE_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Browser Use live API', () => {
	it('rejects an invalid key on GET /browsers', async () => {
		const err = await requestBrowserUse('/browsers', 'bu_invalid_live_check', {
			query: { pageSize: 1 },
			// unknown: catch is untyped. The next line checks the class.
		}).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BrowserUseAPIError);
		// as: toBeInstanceOf already proved this is BrowserUseAPIError.
		expect((err as BrowserUseAPIError).status).toBe(401);
	});
});

// Read-only: listing browsers does not start a paid session.
describeIfKey('Browser Use live API (authenticated)', () => {
	it('lists browsers', async () => {
		const page = BrowsersListOutputSchema.parse(
			// as: describeIfKey only runs when LIVE_KEY is a non-empty string.
			await requestBrowserUse('/browsers', LIVE_KEY as string, {
				query: { pageSize: 1 },
			}),
		);
		expect(page.pageSize).toBe(1);
	});
});
