import {
	CodacyAccount,
	CodacyOrganization,
	CodacyRepository,
} from './schema/database';

describe('Codacy schema', () => {
	it('declares a semver version', () => {
		const { CodacySchema } = require('./schema');
		expect(CodacySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		const { CodacySchema } = require('./schema');
		expect(CodacySchema.entities).toBeDefined();
		expect(typeof CodacySchema.entities).toBe('object');
	});

	it('registers the primary resources as database entities', () => {
		const { CodacySchema } = require('./schema');
		expect(CodacySchema.entities).toHaveProperty('account');
		expect(CodacySchema.entities).toHaveProperty('organization');
		expect(CodacySchema.entities).toHaveProperty('repository');
		expect(CodacySchema.entities).toHaveProperty('tool');
		expect(CodacySchema.entities).toHaveProperty('commit');
		expect(CodacySchema.entities).toHaveProperty('issue');
	});

	it('requires an id and name on the account entity', () => {
		const valid = {
			id: 1,
			name: 'Test User',
			email: 'test@example.com',
			avatar_url: null,
			plan: 'free',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
		};
		expect(() => CodacyAccount.parse(valid)).not.toThrow();

		const invalid = { ...valid, id: -1 };
		expect(() => CodacyAccount.parse(invalid)).toThrow();
	});

	it('accepts extra unknown fields on entities (loose parsing)', () => {
		const withExtra = {
			id: 1,
			name: 'Test User',
			email: 'test@example.com',
			avatar_url: null,
			plan: 'free',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
			extra_field: 'should be ignored',
		};
		expect(() => CodacyAccount.parse(withExtra)).not.toThrow();
	});

	it('parses organization entity', () => {
		const org = {
			id: 1,
			name: 'test-org',
			display_name: 'Test Org',
			avatar_url: null,
			plan: 'premium',
			is_premium: true,
			provider: 'github',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
		};
		expect(() => CodacyOrganization.parse(org)).not.toThrow();
	});

	it('parses repository entity', () => {
		const repo = {
			id: 1,
			name: 'test-repo',
			display_name: 'Test Repo',
			description: 'A test repository',
			clone_url: 'https://github.com/test/repo.git',
			ssh_url: 'git@github.com:test/repo.git',
			language: 'TypeScript',
			is_private: false,
			is_archived: false,
			is_fork: false,
			default_branch: 'main',
			organization_id: 1,
			organization_name: 'test-org',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
		};
		expect(() => CodacyRepository.parse(repo)).not.toThrow();
	});
});
