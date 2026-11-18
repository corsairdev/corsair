import { makeLangbaseRequest } from './client';
import { ListPipesOutputSchema } from './endpoints/types';

const LIVE_KEY = process.env.LANGBASE_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('Langbase live API (env-gated)', () => {
	it('GET /pipes returns pipes list for live key', async () => {
		const res = await makeLangbaseRequest<unknown>('/pipes', LIVE_KEY, {
			method: 'GET',
		});
		const parsed = ListPipesOutputSchema.parse(res);
		expect(Array.isArray(parsed.pipes)).toBe(true);
	});
});
