import { CoassembleSchema } from './schema';

describe('CoassembleSchema', () => {
	it('registers clients, courses, trackings and users', () => {
		expect(CoassembleSchema.version).toBe('1.0.0');
		expect(Object.keys(CoassembleSchema.entities).sort()).toEqual([
			'clients',
			'courses',
			'trackings',
			'users',
		]);
	});

	it('keeps API timestamps as-is and tolerates nulls', () => {
		const user = CoassembleSchema.entities.users.parse({
			identifier: 'u1',
			avatar: null,
			created: '2026-01-01T00:00:00Z',
			updated: null,
		});
		expect(user.created).toBe('2026-01-01T00:00:00Z');
		expect(user.updated).toBeNull();
	});

	it('keeps extra fields from the API response', () => {
		const course = CoassembleSchema.entities.courses.parse({
			id: 1,
			title: 'Course',
			screens: [],
		});
		expect(course).toHaveProperty('screens');
	});

	it('requires the identifying field on clients, courses and trackings', () => {
		expect(() => CoassembleSchema.entities.clients.parse({})).toThrow();
		expect(() => CoassembleSchema.entities.courses.parse({})).toThrow();
		expect(() => CoassembleSchema.entities.trackings.parse({})).toThrow();
	});
});
