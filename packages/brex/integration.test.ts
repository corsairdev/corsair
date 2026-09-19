import { BrexAPIError, makeBrexRequest } from './client';

const LIVE_KEY = process.env.BREX_API_TOKEN;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describeIfKey('Brex live Team API', () => {
	it('rejects an invalid user token on GET /v2/company', async () => {
		const err = await makeBrexRequest('/v2/company', 'invalid-token').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(BrexAPIError);
		expect((err as BrexAPIError).status).toBe(401);
	});
});

describeIfKey('Brex live Team API (authenticated)', () => {
	it('gets the company for the token', async () => {
		const company = await makeBrexRequest<Record<string, unknown>>(
			'/v2/company',
			LIVE_KEY as string,
		);
		expect(company).toEqual(
			expect.objectContaining({ id: expect.any(String) }),
		);
	});

	it('gets the current user', async () => {
		const user = await makeBrexRequest<Record<string, unknown>>(
			'/v2/users/me',
			LIVE_KEY as string,
		);
		expect(user).toEqual(expect.objectContaining({ id: expect.any(String) }));
	});
});
