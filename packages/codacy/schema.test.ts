import { CodacySchema } from './schema';
import {
	CodacyAccount,
	CodacyOrganization,
	CodacyPattern,
	CodacyRepository,
	CodacyTool,
} from './schema/database';

describe('Codacy schema', () => {
	it('declares a semver version', () => {
		expect(CodacySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(CodacySchema.entities).toBeDefined();
		expect(typeof CodacySchema.entities).toBe('object');
	});

	it('registers the primary resources as database entities', () => {
		expect(CodacySchema.entities).toHaveProperty('accounts');
		expect(CodacySchema.entities).toHaveProperty('organizations');
		expect(CodacySchema.entities).toHaveProperty('repositories');
		expect(CodacySchema.entities).toHaveProperty('tools');
		expect(CodacySchema.entities).toHaveProperty('patterns');
	});

	it('requires an id and email on the account entity', () => {
		const valid = {
			id: 1,
			name: 'Test User',
			mainEmail: 'test@example.com',
			otherEmails: [],
			isAdmin: false,
			isActive: true,
			created: '2024-01-01T00:00:00Z',
		};
		expect(() => CodacyAccount.parse(valid)).not.toThrow();

		const invalid = { name: 'Test User' };
		expect(() => CodacyAccount.parse(invalid)).toThrow();
	});

	it('accepts extra unknown fields on entities (loose parsing)', () => {
		const withExtra = {
			id: 1,
			name: 'Test User',
			mainEmail: 'test@example.com',
			otherEmails: [],
			isAdmin: false,
			isActive: true,
			created: '2024-01-01T00:00:00Z',
			extra_field: 'should be preserved',
		};
		const parsed = CodacyAccount.parse(withExtra);
		expect(parsed).toMatchObject({ id: 1 });
	});

	it('parses an organization entity', () => {
		const org = {
			remoteIdentifier: '123',
			name: 'test-org',
			provider: 'gh',
			singleProviderLogin: false,
			type: 'organization',
			hasDastAccess: false,
			hasScaEnabled: true,
			imageSbomEnabled: false,
		};
		expect(() => CodacyOrganization.parse(org)).not.toThrow();
	});

	it('parses a repository entity', () => {
		const repo = {
			provider: 'gh',
			owner: 'test-org',
			name: 'test-repo',
			languages: ['TypeScript'],
		};
		expect(() => CodacyRepository.parse(repo)).not.toThrow();
	});

	it('parses a tool entity', () => {
		const tool = {
			uuid: '847feb32-9ff2-11ea-bb37-0242ac130002',
			name: 'ESLint',
		};
		expect(() => CodacyTool.parse(tool)).not.toThrow();
	});

	it('parses a pattern entity', () => {
		const pattern = {
			id: 'accessor-pairs',
			category: 'Best Practices',
			level: 'Warning',
			severityLevel: 'medium',
		};
		expect(() => CodacyPattern.parse(pattern)).not.toThrow();
	});
});
