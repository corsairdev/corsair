import { BrowserUseAPIError, requestBrowserUse } from './client';
import { BrowsersListOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.BROWSER_USE_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Browser Use live API', () => {
	it('rejects an invalid key on GET /browsers', async () => {
		let err: Error | undefined;
		try {
			await requestBrowserUse('/browsers', 'bu_invalid_live_check', {
				query: { pageSize: 1 },
			});
		} catch (error) {
			if (error instanceof Error) err = error;
		}
		expect(err).toBeInstanceOf(BrowserUseAPIError);
		if (!(err instanceof BrowserUseAPIError)) {
			throw new Error('expected BrowserUseAPIError');
		}
		expect(err.status).toBe(401);
	});
});

// Read-only: listing browsers does not start a paid session.
describeIfKey('Browser Use live API (authenticated)', () => {
	it('lists browsers', async () => {
		const key = LIVE_KEY ?? '';
		const page = BrowsersListOutputSchema.parse(
			await requestBrowserUse('/browsers', key, {
				query: { pageSize: 1 },
			}),
		);
		expect(page.pageSize).toBe(1);
	});
});
