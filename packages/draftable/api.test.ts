import { makeDraftableRequest } from './client';
import { ListComparisonsResponseSchema } from './endpoints/types';

const KEY = process.env.DRAFTABLE_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'DRAFTABLE_API_KEY is not set; the live Draftable suite is skipped',
	);
}

describeLive('Draftable live', () => {
	it('lists comparisons', async () => {
		const response = await makeDraftableRequest<unknown>(KEY as string, {});
		const parsed = ListComparisonsResponseSchema.parse(response);
		expect(typeof parsed.count).toBe('number');
		expect(Array.isArray(parsed.results)).toBe(true);
	});
});
