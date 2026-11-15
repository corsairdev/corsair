import { makeJobNimbusRequest } from './client';
import { AccountSettingsResponseSchema } from './endpoints/types';

const KEY = process.env.JOBNIMBUS_API_KEY ?? '';
if (KEY.length === 0) {
	console.warn(
		'Skipping JobNimbus live tests: set JOBNIMBUS_API_KEY to run them.',
	);
}
const describeLive = KEY.length > 0 ? describe : describe.skip;

describeLive('JobNimbus live API (env-gated)', () => {
	it('GET /account/settings returns the account configuration', async () => {
		const response = await makeJobNimbusRequest<unknown>(
			'/account/settings',
			KEY,
			{ method: 'GET' },
		);
		// `unknown` because response is untrusted live data; Zod schema narrows it.
		const parsed = AccountSettingsResponseSchema.parse(response);

		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});
});
