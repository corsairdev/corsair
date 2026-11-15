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
		// `unknown` because live provider JSON is untrusted until the output schema validates it.
		const response = await makeJobNimbusRequest<unknown>(
			'/account/settings',
			KEY,
			{ method: 'GET' },
		);
		const parsed = AccountSettingsResponseSchema.parse(response);

		expect(parsed).toBeDefined();
		expect(typeof parsed).toBe('object');
	});
});
