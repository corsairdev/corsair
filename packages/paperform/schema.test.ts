import { PaperformSchema } from './schema';
import { PaperformFormEntity } from './schema/database';

describe('Paperform schema', () => {
	it('declares forms, spaces, and translations', () => {
		expect(PaperformSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(PaperformSchema.entities).sort()).toEqual([
			'forms',
			'spaces',
			'translations',
		]);
	});

	it('rejects a form with no id', () => {
		expect(PaperformFormEntity.safeParse({ title: 'Contact' }).success).toBe(
			false,
		);
	});
});
