import { makeSymplaRequest } from './client';
import { ListEventsResponseSchema } from './endpoints/types';

const KEY = process.env.SYMPLA_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn('SYMPLA_API_KEY is not set; the live Sympla suite is skipped');
}

describeLive('Sympla live', () => {
	it('lists events', async () => {
		const response = await makeSymplaRequest<unknown>(KEY as string, {});
		const parsed = ListEventsResponseSchema.parse(response);
		expect(Array.isArray(parsed.data)).toBe(true);
	});
});
