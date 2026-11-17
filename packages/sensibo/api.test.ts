import { makeSensiboRequest } from './client';
import { ListDevicesResponseSchema } from './endpoints/types';

const KEY = process.env.SENSIBO_API_KEY;
const describeLive = KEY ? describe : describe.skip;

if (!KEY) {
	console.warn('SENSIBO_API_KEY is not set; the live Sensibo suite is skipped');
}

describeLive('Sensibo live', () => {
	it('lists pods', async () => {
		// unknown: the live reply is checked by the schema below.
		const response = await makeSensiboRequest<unknown>(KEY as string, {
			path: '/users/me/pods',
			query: { fields: '*' },
		});
		const parsed = ListDevicesResponseSchema.parse(response);
		expect(parsed.status).toBe('success');
		expect(Array.isArray(parsed.result)).toBe(true);
	});
});
