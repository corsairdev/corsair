import { makeLangbaseRequest } from './client';
import { ListPipesOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.LANGBASE_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping live Langbase API tests because LANGBASE_API_KEY is not set. Set LANGBASE_API_KEY to run live tests.',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Langbase live API (env-gated)', () => {
	it('GET /pipes returns pipes list for live key', async () => {
		// unknown because raw API response is parsed and validated by Zod schema below.
		const res = await makeLangbaseRequest<unknown>('/pipes', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = ListPipesOutputSchema.parse(res);
		expect(Array.isArray(parsed.pipes)).toBe(true);
	});
});
