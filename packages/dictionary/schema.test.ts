import { DictionarySchema } from './schema';
import { DictionaryEntryEntity } from './schema/database';

describe('Dictionary schema', () => {
	it('declares a semver version', () => {
		expect(DictionarySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares docs-labeled entries from official Merriam-Webster JSON', () => {
		expect(Object.keys(DictionarySchema.entities)).toEqual(['entries']);
		expect(typeof DictionarySchema.entities.entries.parse).toBe('function');
		const parsed = DictionaryEntryEntity.parse({
			id: 'pencil:1',
			uuid: 'f4eb8724-7273-4f25-8dbe-297b1012e949',
			src: 'sd2',
			section: 'alpha',
			stems: ['pencil', 'pencils'],
			offensive: false,
			hw: 'pen*cil',
			fl: 'noun',
			shortdef: ['a device for writing or drawing'],
			captured_at: new Date('2026-08-27T00:00:00.000Z'),
		});
		expect(parsed.id).toBe('pencil:1');
		expect(parsed.hw).toBe('pen*cil');
	});
});
