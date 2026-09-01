import { ConnecteamEndpointInputSchemas } from './types';

describe('Connecteam endpoint input schemas', () => {
	it('accepts valid getUsers input', () => {
		const result = ConnecteamEndpointInputSchemas.getUsers.safeParse({
			limit: 50,
			offset: 0,
			userStatus: 'active',
		});

		expect(result.success).toBe(true);
	});

	it('rejects invalid getUsers limit', () => {
		const result = ConnecteamEndpointInputSchemas.getUsers.safeParse({
			limit: 0,
		});

		expect(result.success).toBe(false);
	});

	it('accepts valid archiveUsers input', () => {
		const result = ConnecteamEndpointInputSchemas.archiveUsers.safeParse({
			userIds: [123, 456],
			deletionType: 'archive',
		});

		expect(result.success).toBe(true);
	});

	it('rejects archiveUsers with no user IDs', () => {
		const result = ConnecteamEndpointInputSchemas.archiveUsers.safeParse({
			userIds: [],
		});

		expect(result.success).toBe(false);
	});

	it('accepts valid createUsers input', () => {
		const result = ConnecteamEndpointInputSchemas.createUsers.safeParse({
			users: [
				{
					firstName: 'Test',
					lastName: 'User',
					email: 'test@example.com',
				},
			],
		});

		expect(result.success).toBe(true);
	});

	it('rejects createUsers with no users', () => {
		const result = ConnecteamEndpointInputSchemas.createUsers.safeParse({
			users: [],
		});

		expect(result.success).toBe(false);
	});

	it('accepts valid updateUsers input', () => {
		const result = ConnecteamEndpointInputSchemas.updateUsers.safeParse({
			users: [
				{
					userId: 123,
					firstName: 'Updated',
				},
			],
		});

		expect(result.success).toBe(true);
	});

	it('rejects updateUsers with no users', () => {
		const result = ConnecteamEndpointInputSchemas.updateUsers.safeParse({
			users: [],
		});

		expect(result.success).toBe(false);
	});
});
