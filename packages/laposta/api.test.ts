import { makeLapostaRequest } from './client';
import { GetListsOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.LAPOSTA_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Laposta live API (env-gated)', () => {
	it('GET /list returns lists for the live key', async () => {
		const res = await makeLapostaRequest<unknown>('/list', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = GetListsOutputSchema.parse(res);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
