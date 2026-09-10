import { FaradayAPIError, makeFaradayRequest } from './client';

const LIVE_KEY = process.env.FARADAY_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Faraday live REST API v1', () => {
	it('rejects an invalid API key on GET /accounts/current', async () => {
		const err = await makeFaradayRequest(
			'accounts/current',
			'fdy_sk_invalid',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(FaradayAPIError);
		expect((err as FaradayAPIError).status).toBe(401);
	});
});

describeIfKey('Faraday live REST API v1 (authenticated)', () => {
	it('retrieves the current account', async () => {
		const raw = await makeFaradayRequest<Record<string, unknown>>(
			'accounts/current',
			LIVE_KEY as string,
		);
		expect(raw).toBeDefined();
		expect(typeof raw).toBe('object');
		expect(typeof raw.id).toBe('string');
		expect(typeof raw.name).toBe('string');
		expect(raw.resource_type).toBeDefined();
	});

	it('lists accounts', async () => {
		const raw = await makeFaradayRequest('accounts', LIVE_KEY as string);
		expect(Array.isArray(raw)).toBe(true);
	});
});
