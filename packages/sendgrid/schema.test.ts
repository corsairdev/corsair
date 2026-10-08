import { SendGridSchema } from './schema';
import {
	SendGridBounce,
	SendGridContact,
	SendGridList,
	SendGridVerifiedSender,
} from './schema/database';

describe('SendGrid schema', () => {
	it('declares a semver version', () => {
		expect(SendGridSchema.version).toBeDefined();
		expect(SendGridSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official entity maps', () => {
		expect(Object.keys(SendGridSchema.entities).sort()).toEqual(
			['bounces', 'contacts', 'lists', 'senders'].sort(),
		);
	});

	it('parses official VerifiedSenderResponse example', () => {
		const sender = SendGridVerifiedSender.parse({
			id: 1234,
			nickname: 'Example Orders',
			from_email: 'orders@example.com',
			from_name: 'Example Orders',
			reply_to: 'orders@example.com',
			reply_to_name: 'Example Orders',
			address: '1234 Fake St.',
			address2: 'PO Box 1234',
			state: 'CA',
			city: 'San Francisco',
			country: 'USA',
			zip: '94105',
			verified: true,
			locked: false,
		});
		expect(sender.from_email).toBe('orders@example.com');
	});

	it('parses official bounce suppression record', () => {
		const bounce = SendGridBounce.parse({
			created: 1251606766,
			email: 'test@example.com',
			reason: '500 unknown recipient',
			status: '5.0.0',
		});
		expect(bounce.email).toBe('test@example.com');
	});

	it('parses official marketing list and contact request', () => {
		const list = SendGridList.parse({
			id: 'e1',
			name: 'Newsletter',
			contact_count: 12,
		});
		expect(list.contact_count).toBe(12);

		const contact = SendGridContact.parse({
			email: 'alex@example.com',
			first_name: 'Alex',
			last_name: 'Bloggs',
			city: 'Port Douglas',
			country: 'AU',
		});
		expect(contact.email).toBe('alex@example.com');
	});
});
