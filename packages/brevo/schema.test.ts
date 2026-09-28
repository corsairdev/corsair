import { BrevoCampaign, BrevoContact, BrevoSchema } from './schema';

describe('Brevo schema', () => {
	it('declares a semver version', () => {
		expect(BrevoSchema.version).toBeDefined();
		expect(BrevoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with contacts and campaigns', () => {
		expect(typeof BrevoSchema.entities).toBe('object');
		expect(BrevoSchema.entities).not.toBeNull();
		expect(Object.keys(BrevoSchema.entities)).toContain('contacts');
		expect(Object.keys(BrevoSchema.entities)).toContain('campaigns');
		for (const entity of Object.values(BrevoSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates BrevoContact schema', () => {
		const validContact = {
			id: 123,
			email: 'user@example.com',
			emailBlacklisted: false,
			smsBlacklisted: false,
			createdAt: new Date().toISOString(),
			attributes: {
				FIRSTNAME: 'John',
				LASTNAME: 'Doe',
			},
		};

		const parsed = BrevoContact.parse(validContact);
		expect(parsed.id).toBe(123);
		expect(parsed.email).toBe('user@example.com');
	});

	it('validates BrevoCampaign schema', () => {
		const validCampaign = {
			id: 456,
			name: 'Summer Newsletter',
			subject: 'Hot Deals Inside',
			type: 'classic',
			status: 'draft',
		};

		const parsed = BrevoCampaign.parse(validCampaign);
		expect(parsed.id).toBe(456);
		expect(parsed.name).toBe('Summer Newsletter');
	});
});
