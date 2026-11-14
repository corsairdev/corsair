import { makeCompanyEnrichRequest } from './client';
import type { AccountMeResponse } from './endpoints/types';
import { AccountMeResponseSchema } from './endpoints/types';

const KEY = process.env.COMPANYENRICH_API_KEY ?? '';
if (KEY.length === 0) {
	console.warn(
		'Skipping CompanyEnrich live tests: set COMPANYENRICH_API_KEY to run them.',
	);
}
const describeLive = KEY.length > 0 ? describe : describe.skip;

describeLive('CompanyEnrich live API (env-gated)', () => {
	it('GET /v2/me returns the authenticated account shape', async () => {
		const response = await makeCompanyEnrichRequest<AccountMeResponse>(
			'/v2/me',
			KEY,
			{ method: 'GET' },
		);
		const parsed = AccountMeResponseSchema.parse(response);

		expect(parsed.userId.length).toBeGreaterThan(0);
		expect(typeof parsed.credits.used).toBe('number');
		expect(typeof parsed.credits.total).toBe('number');
		expect(typeof parsed.capabilities.lists).toBe('boolean');
		expect(typeof parsed.capabilities.previews).toBe('boolean');
	});
});
