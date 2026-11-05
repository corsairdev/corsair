import { ZohoDeskSchema } from './schema';

describe('ZohoDesk schema', () => {
	it('declares a semver version', () => {
		expect(ZohoDeskSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores tickets and contacts only', () => {
		expect(Object.keys(ZohoDeskSchema.entities).sort()).toEqual([
			'contacts',
			'tickets',
		]);
	});

	it('requires an ID on a ticket and allows everything else to be missing', () => {
		const { tickets } = ZohoDeskSchema.entities;
		expect(tickets.parse({ id: '1' })).toEqual({ id: '1' });
		expect(tickets.safeParse({ subject: 'No ID' }).success).toBe(false);
	});

	it('accepts the nulls Zoho sends for empty ticket fields', () => {
		const { tickets } = ZohoDeskSchema.entities;
		expect(
			tickets.safeParse({ id: '1', assigneeId: null, closedTime: null })
				.success,
		).toBe(true);
	});

	it('requires an ID on a contact and allows everything else to be missing', () => {
		const { contacts } = ZohoDeskSchema.entities;
		expect(contacts.parse({ id: '1', email: null })).toEqual({
			id: '1',
			email: null,
		});
		expect(contacts.safeParse({ email: 'a@b.example' }).success).toBe(false);
	});
});
