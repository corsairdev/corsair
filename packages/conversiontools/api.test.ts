import { makeConversiontoolsRequest } from './client';
import type { AccountVerifyResponse } from './endpoints/types';
import { AccountVerifyResponseSchema } from './endpoints/types';

const KEY = process.env.CONVERSIONTOOLS_API_KEY ?? '';
const describeLive = KEY.length > 0 ? describe : describe.skip;
if (KEY.length === 0) {
	console.warn(
		'Skipping Conversion Tools live tests: CONVERSIONTOOLS_API_KEY not set',
	);
}

describeLive('Conversion Tools live API (env-gated)', () => {
	it('GET /v1/ verifies the configured token without changing provider data', async () => {
		const response = await makeConversiontoolsRequest<AccountVerifyResponse>(
			'/',
			KEY,
			{ method: 'GET' },
		);
		const parsed = AccountVerifyResponseSchema.parse(response);

		expect(parsed.error).toBeNull();
	});
});
