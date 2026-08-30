import { BeaconstacAPIError, makeBeaconstacRequest } from './client';

const LIVE_KEY = process.env.BEACONSTAC_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Beaconstac live Uniqode API (unauthenticated)', () => {
	it('rejects an invalid token on GET /organizations/', async () => {
		const err = await makeBeaconstacRequest(
			'/api/2.0/organizations/',
			'invalid-live-check',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BeaconstacAPIError);
		expect((err as BeaconstacAPIError).status).toBe(401);
	});
});

describeIfKey('Beaconstac live Uniqode API (authenticated)', () => {
	it('lists organizations', async () => {
		const raw = await makeBeaconstacRequest(
			'/api/2.0/organizations/',
			LIVE_KEY as string,
			{ query: { page: 1, page_size: 5 } },
		);
		expect(raw).toBeDefined();
		expect(typeof raw).toBe('object');
	});
});
