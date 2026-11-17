import { LinkupSchema } from './schema';
import { LinkupSourceEntity } from './schema/database';

describe('Linkup schema', () => {
	it('declares credits, sources, and responses', () => {
		expect(LinkupSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(LinkupSchema.entities).sort()).toEqual([
			'credits',
			'responses',
			'sources',
		]);
	});

	it('rejects a source with no id', () => {
		expect(LinkupSourceEntity.safeParse({ name: 'Example' }).success).toBe(
			false,
		);
	});
});
