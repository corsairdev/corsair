import { createCorsair } from 'corsair';
import { laposta } from './index';

const LIVE_KEY = process.env.LAPOSTA_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping live Laposta API tests because LAPOSTA_API_KEY is not set. Set LAPOSTA_API_KEY to run live tests.',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Laposta live API (env-gated)', () => {
	it('GET /list returns lists for the live key', async () => {
		const corsair = createCorsair({
			plugins: [laposta({ key: LIVE_KEY })],
		});
		const result = await corsair.laposta.api.lists.list({});
		expect(Array.isArray(result.data)).toBe(true);
	});
});
