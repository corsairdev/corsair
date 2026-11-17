import { ParsehubSchema } from './schema';
import { ParsehubProjectEntity } from './schema/database';

describe('ParseHub schema', () => {
	it('declares a semver version and the projects entity', () => {
		expect(ParsehubSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(ParsehubSchema.entities)).toEqual(['projects']);
	});

	it('accepts a project row and rejects one with no token', () => {
		const parsed = ParsehubProjectEntity.parse({
			token: 'project-1',
			title: 'Example',
		});
		expect(parsed).toEqual({ token: 'project-1', title: 'Example' });
		expect(ParsehubProjectEntity.safeParse({ title: 'Example' }).success).toBe(
			false,
		);
		expect(ParsehubProjectEntity.safeParse({ token: '' }).success).toBe(false);
	});
});
