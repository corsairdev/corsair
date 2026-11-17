import { EchtpostSchema } from './schema';
import { EchtpostTemplateEntity } from './schema/database';

describe('Echtpost schema', () => {
	it('declares a semver version and the documented entity', () => {
		expect(EchtpostSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(EchtpostSchema.entities)).toEqual(['templates']);
	});

	it('accepts a template and rejects one with no id', () => {
		const parsed = EchtpostTemplateEntity.parse({
			id: '12',
			motive_id: 3,
			content: 'Hello',
			source: 'regular',
			font: { family: 'special_elite', size: 12, color: 'black' },
		});
		expect(parsed.id).toBe('12');
		expect(EchtpostTemplateEntity.safeParse({ content: 'Hello' }).success).toBe(
			false,
		);
	});
});
