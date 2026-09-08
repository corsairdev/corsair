import { BreatheHrAPIError, makeBreatheHrRequest } from './client';

const LIVE_KEY = process.env.BREATHEHR_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Breathe HR live API (unauthenticated)', () => {
	it('rejects an invalid key on GET /account', async () => {
		const err = await makeBreatheHrRequest(
			'/account',
			'sandbox-invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BreatheHrAPIError);
		expect((err as BreatheHrAPIError).status).toBe(401);
	});
});

describeIfKey('Breathe HR live API (authenticated)', () => {
	it('gets the account', async () => {
		const raw = await makeBreatheHrRequest('/account', LIVE_KEY as string);
		expect(raw).toBeDefined();
		expect(typeof raw).toBe('object');
	});

	it('lists employees', async () => {
		const raw = await makeBreatheHrRequest('/employees', LIVE_KEY as string, {
			query: { page: 1, per_page: 1 },
		});
		expect(raw).toBeDefined();
		expect(typeof raw).toBe('object');
	});
});
