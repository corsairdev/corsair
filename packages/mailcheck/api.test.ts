import { ApiError } from 'corsair/http';
import { makeMailcheckRequest } from './client';
import { MailcheckEndpointOutputSchemas } from './endpoints/types';

const API_KEY = process.env.MAILCHECK_API_KEY;
const describeLive = API_KEY ? describe : describe.skip;
const SINGLE_CHECK_PATH = '/v1/singleEmail:check';

jest.setTimeout(30_000);

describeLive('Mailcheck live API (requires MAILCHECK_API_KEY)', () => {
	const key = API_KEY as string;

	it('verifies a single email', async () => {
		const email = 'hello@gmail.com';
		const result = await makeMailcheckRequest<unknown>(SINGLE_CHECK_PATH, key, {
			method: 'POST',
			body: { email },
		});
		const parsed = MailcheckEndpointOutputSchemas.verifyEmail.parse(result);
		expect(parsed.email).toBe(email);
		expect(parsed.trustRate).toBeGreaterThanOrEqual(0);
		expect(parsed.trustRate).toBeLessThanOrEqual(100);
	});

	it('rejects an invalid API key with a 401 ApiError', async () => {
		try {
			await makeMailcheckRequest(SINGLE_CHECK_PATH, 'invalid-key', {
				method: 'POST',
				body: { email: 'a@b.com' },
			});
			throw new Error('expected request to fail');
		} catch (error) {
			expect(error).toBeInstanceOf(ApiError);
			expect((error as ApiError).status).toBe(401);
		}
	});
});
