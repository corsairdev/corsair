import { makeParsehubRequest } from './client';
import { ListProjectsResponseSchema } from './endpoints/types';

const KEY = process.env.PARSEHUB_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn(
		'PARSEHUB_API_KEY is not set; the live ParseHub suite is skipped',
	);
}

describeLive('ParseHub live', () => {
	it('lists projects', async () => {
		const response = await makeParsehubRequest<unknown>(KEY as string, {
			path: '/projects',
		});
		const parsed = ListProjectsResponseSchema.parse(response);
		expect(Array.isArray(parsed.projects)).toBe(true);
	});
});
