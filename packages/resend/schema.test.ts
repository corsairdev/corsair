import { ResendSchema } from './schema';
import { ResendContact, ResendDomain, ResendEmail } from './schema/database';

describe('Resend schema', () => {
	it('declares a semver version', () => {
		expect(ResendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with all registered entities', () => {
		expect(Object.keys(ResendSchema.entities).sort()).toEqual([
			'contacts',
			'domains',
			'emails',
		]);
	});

	describe('entity parsing and key requirements', () => {
		it('parses an Email record carrying required fields', () => {
			const email = ResendEmail.parse({
				id: 'email_123',
				from: 'sender@example.com',
				to: ['recipient@example.com'],
				subject: 'Test email',
				created_at: new Date('2026-08-24T00:00:00Z'),
			});
			expect(email.id).toBe('email_123');
			expect(email.from).toBe('sender@example.com');
			expect(email.to).toEqual(['recipient@example.com']);
		});

		it('parses a Domain record carrying required fields', () => {
			const domain = ResendDomain.parse({
				id: 'domain_123',
				name: 'example.com',
				status: 'verified',
				created_at: new Date('2026-08-24T00:00:00Z'),
				region: 'us-east-1',
			});
			expect(domain.id).toBe('domain_123');
			expect(domain.name).toBe('example.com');
			expect(domain.status).toBe('verified');
		});

		it('parses a Contact record carrying required fields', () => {
			const contact = ResendContact.parse({
				id: 'contact_123',
				email: 'contact@example.com',
				first_name: 'John',
				last_name: 'Doe',
				created_at: new Date('2026-08-24T00:00:00Z'),
				unsubscribed: false,
			});
			expect(contact.id).toBe('contact_123');
			expect(contact.email).toBe('contact@example.com');
			expect(contact.unsubscribed).toBe(false);
		});
	});

	describe('unrecognised fields are tolerated', () => {
		it('keeps extra unknown fields on email', () => {
			const email = ResendEmail.parse({
				id: 'email_123',
				from: 'sender@example.com',
				to: ['recipient@example.com'],
				extra_custom_metadata: 'xyz',
			});
			expect((email as any).extra_custom_metadata).toBe('xyz');
		});

		it('keeps extra unknown fields on domain', () => {
			const domain = ResendDomain.parse({
				id: 'domain_123',
				name: 'example.com',
				status: 'ready',
				dns_records: [{ type: 'TXT', value: 'resend' }],
			});
			expect((domain as any).dns_records).toEqual([
				{ type: 'TXT', value: 'resend' },
			]);
		});

		it('keeps extra unknown fields on contact', () => {
			const contact = ResendContact.parse({
				id: 'contact_123',
				email: 'contact@example.com',
				tags: ['vip'],
			});
			expect((contact as any).tags).toEqual(['vip']);
		});
	});
});
