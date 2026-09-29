import { ChMeetingsSchema } from './schema';
import { ChMeetingsPerson } from './schema/database';

describe('ChMeetings schema', () => {
	it('declares a semver version', () => {
		expect(ChMeetingsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores official person, organization, and event entities', () => {
		expect(ChMeetingsSchema.entities.people).toBeDefined();
		expect(ChMeetingsSchema.entities.organizations).toBeDefined();
		expect(ChMeetingsSchema.entities.events).toBeDefined();
		expect(
			ChMeetingsPerson.parse({
				id: 1,
				first_name: 'Ada',
				last_name: 'Lovelace',
			}),
		).toMatchObject({ id: 1, first_name: 'Ada' });
	});
});
