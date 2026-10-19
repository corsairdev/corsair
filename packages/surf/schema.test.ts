import { SurfResponse } from './endpoints/types';
import { SurfSchema } from './schema';

describe('surf schema', () => {
	it('keeps an empty entity map and a credit envelope', () => {
		expect(SurfSchema.version).toBe('1.0.0');
		expect(SurfSchema.entities).toEqual({});
		expect(
			SurfResponse.parse({ data: null, meta: { credits_used: 0 } }).data,
		).toBeNull();
	});
});
