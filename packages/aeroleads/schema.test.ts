import { AeroleadsEndpointOutputSchemas } from './endpoints/types';
import { AeroleadsSchema } from './schema';

describe('Aeroleads schema', () => {
	it('declares a semver version', () => {
		expect(AeroleadsSchema.version).toBeDefined();
		expect(AeroleadsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares db schema entities aligned to Aeroleads resources', () => {
		expect(Object.keys(AeroleadsSchema.entities)).toEqual(['linkedinDetails']);
	});
	it('accepts valid linkedin details response', () => {
		const live = {
			full_name: 'Ayushi Mathur',
			linkedin_url: 'https://www.linkedin.com/in/ayushi-mathur-061b9010b/',
			job_title: 'Software Engineer',
			emails: 'test@example.com',
		};
		expect(
			AeroleadsEndpointOutputSchemas.linkedinDetailsGet.parse(live),
		).toMatchObject(live);
	});
});
