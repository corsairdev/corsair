import { makeFingertipPingRequest } from './client';
import { PingGetResponseSchema } from './endpoints/types';

const LIVE_API_KEY = process.env.FINGERTIP_API_KEY ?? '';
if (!LIVE_API_KEY) {
	console.warn(
		'Skipping Fingertip live test: set FINGERTIP_API_KEY to run the read-only ping check.',
	);
}
const describeLive = LIVE_API_KEY ? describe : describe.skip;

describeLive('Fingertip live API (env-gated)', () => {
	it('checks the authenticated REST API ping', async () => {
		const response = await makeFingertipPingRequest(LIVE_API_KEY);
		const parsed = PingGetResponseSchema.parse(response);
		expect(typeof parsed.message).toBe('string');
		expect(parsed.message.length).toBeGreaterThan(0);
	});
});
