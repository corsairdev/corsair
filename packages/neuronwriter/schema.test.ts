import { NeuronwriterSchema } from './schema';
import { NeuronwriterImportEntity } from './schema/database';

describe('NeuronWriter schema', () => {
	it('declares imports', () => {
		expect(NeuronwriterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(NeuronwriterSchema.entities)).toEqual(['imports']);
	});

	it('rejects an import with no id', () => {
		expect(NeuronwriterImportEntity.safeParse({ status: 'ok' }).success).toBe(
			false,
		);
	});
});
