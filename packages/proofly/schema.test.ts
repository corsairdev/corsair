import { ProoflySchema } from './schema';
import { ProoflyCampaignEntity, ProoflyUserEntity } from './schema/database';

describe('Proofly schema', () => {
	it('declares a semver version and the documented entities', () => {
		expect(ProoflySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(ProoflySchema.entities).sort()).toEqual([
			'campaigns',
			'users',
		]);
	});

	it('accepts a campaign and rejects one with no id', () => {
		const parsed = ProoflyCampaignEntity.parse({
			id: '464014',
			name: 'Example',
			domain: 'example.com',
			subdomains: true,
			enabled: true,
			created: '1970-01-01 00:00:00',
		});
		expect(parsed.id).toBe('464014');
		expect(ProoflyCampaignEntity.safeParse({ name: 'Example' }).success).toBe(
			false,
		);
	});

	it('accepts a user and rejects one with no email', () => {
		const parsed = ProoflyUserEntity.parse({
			email: 'info@example.com',
			name: 'John Doe',
			logins: 36,
		});
		expect(parsed.email).toBe('info@example.com');
		expect(ProoflyUserEntity.safeParse({ name: 'John Doe' }).success).toBe(
			false,
		);
	});
});
