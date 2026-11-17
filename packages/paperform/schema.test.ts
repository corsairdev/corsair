import { PaperformSchema } from './schema';
import { PaperformFormEntity } from './schema/database';

describe('Paperform schema', () => {
	it('declares forms, spaces, translations and submissions', () => {
		expect(PaperformSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PaperformSchema.entities).sort()).toEqual([
			'forms',
			'spaces',
			'submissions',
			'translations',
		]);
	});

	it('rejects a form with no id', () => {
		expect(PaperformFormEntity.safeParse({ title: 'Contact' }).success).toBe(
			false,
		);
	});
});
