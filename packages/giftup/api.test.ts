import { makeGiftUpRequest } from './client';
import { PingGetResponseSchema } from './endpoints/types';

const LIVE_KEY = process.env.GIFTUP_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn('Skipping Gift Up! live API tests: GIFTUP_API_KEY is not set.');
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('giftup live API (env-gated)', () => {
	it('GET /ping returns pong with valid credentials', async () => {
		const res = await makeGiftUpRequest<string>('/ping', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = PingGetResponseSchema.parse(res);
		expect(parsed).toBe('pong');
	});
});
