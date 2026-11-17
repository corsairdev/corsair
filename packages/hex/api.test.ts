import { makeHexRequest } from './client';
import type { UsersMeOutput } from './endpoints/types';
import { usersMeOutputSchema } from './endpoints/types';

const KEY = process.env.HEX_API_KEY ?? '';
if (KEY.length === 0) {
	console.warn('Skipping Hex live tests: set HEX_API_KEY to run them.');
}
const describeLive = KEY.length > 0 ? describe : describe.skip;

describeLive('Hex live API (env-gated)', () => {
	it('GET /v1/users/me returns the authenticated user shape', async () => {
		const response = await makeHexRequest<UsersMeOutput>('/v1/users/me', KEY, {
			method: 'GET',
		});
		const parsed = usersMeOutputSchema.parse(response);

		expect(typeof parsed.org.id).toBe('string');
		expect(parsed.org.id.length).toBeGreaterThan(0);
		if ('id' in parsed && typeof parsed.id === 'string') {
			expect(parsed.id.length).toBeGreaterThan(0);
		}
		if ('email' in parsed && typeof parsed.email === 'string') {
			expect(parsed.email.length).toBeGreaterThan(0);
		}
	});
});
