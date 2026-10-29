import { CapsuleCrmAPIError, makeCapsuleCrmRequest } from './client';

const LIVE_KEY = process.env.CAPSULE_CRM_TOKEN;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Capsule CRM live API v2', () => {
	it('rejects an invalid token on GET /site', async () => {
		const err = await makeCapsuleCrmRequest('site', 'invalid-token').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(CapsuleCrmAPIError);
		expect((err as CapsuleCrmAPIError).status).toBe(401);
	});
});

describeIfKey('Capsule CRM live API v2 (authenticated)', () => {
	it('reads site and current user', async () => {
		const site = await makeCapsuleCrmRequest('site', LIVE_KEY as string);
		expect(site).toEqual(
			expect.objectContaining({
				site: expect.objectContaining({ subdomain: expect.any(String) }),
			}),
		);
		const user = await makeCapsuleCrmRequest(
			'users/current',
			LIVE_KEY as string,
		);
		expect(user).toEqual(
			expect.objectContaining({
				user: expect.objectContaining({ id: expect.any(Number) }),
			}),
		);
	});

	it('lists parties with pagination', async () => {
		const raw = await makeCapsuleCrmRequest('parties', LIVE_KEY as string, {
			query: { page: 1, perPage: 1 },
		});
		expect(raw).toEqual(
			expect.objectContaining({ parties: expect.any(Array) }),
		);
	});
});
