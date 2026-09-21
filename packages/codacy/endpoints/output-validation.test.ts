import {
	CodacyEndpointInputSchemas,
	CodacyEndpointOutputSchemas,
} from './types';

const ORGANIZATION = {
	remoteIdentifier: '123',
	name: 'test-org',
	provider: 'gh',
	singleProviderLogin: false,
	type: 'organization',
	hasDastAccess: false,
	hasScaEnabled: true,
	imageSbomEnabled: false,
};

const REPOSITORY = {
	provider: 'gh',
	owner: 'test-org',
	name: 'test-repo',
	languages: ['TypeScript'],
};

const TOOL = {
	uuid: '847feb32-9ff2-11ea-bb37-0242ac130002',
	name: 'ESLint',
};

const PATTERN = {
	id: 'accessor-pairs',
	category: 'Best Practices',
	level: 'Warning',
	severityLevel: 'medium',
};

describe('runtime output validation rejects malformed provider responses', () => {
	it('accepts a well-formed account response envelope', () => {
		const parsed = CodacyEndpointOutputSchemas.accountGet.parse({
			data: {
				id: 1,
				name: 'Test User',
				mainEmail: 'test@example.com',
				otherEmails: [],
				isAdmin: false,
				isActive: true,
				created: '2024-01-01T00:00:00Z',
			},
		});
		expect(parsed.data.id).toBe(1);
	});

	it('rejects an account response missing the data envelope', () => {
		expect(() =>
			CodacyEndpointOutputSchemas.accountGet.parse({ id: 1 }),
		).toThrow();
	});

	it('accepts a well-formed organizations list with pagination', () => {
		const parsed = CodacyEndpointOutputSchemas.organizationList.parse({
			data: [ORGANIZATION],
			pagination: { cursor: 'abc', limit: 10, total: 1 },
		});
		expect(parsed.data).toHaveLength(1);
		expect(parsed.pagination?.cursor).toBe('abc');
	});

	it('accepts an organizations list without pagination (last page)', () => {
		const parsed = CodacyEndpointOutputSchemas.organizationList.parse({
			data: [ORGANIZATION],
		});
		expect(parsed.data).toHaveLength(1);
		expect(parsed.pagination).toBeUndefined();
	});

	it('rejects an organization record without a name', () => {
		expect(() =>
			CodacyEndpointOutputSchemas.organizationGet.parse({
				data: { provider: 'gh' },
			}),
		).toThrow();
	});

	it('accepts extra unknown fields on an organization record (loose parsing)', () => {
		const parsed = CodacyEndpointOutputSchemas.organizationGet.parse({
			data: { ...ORGANIZATION, some_future_field: 'kept' },
		});
		expect(parsed.data.name).toBe('test-org');
	});

	it('accepts a well-formed repositories list', () => {
		const parsed = CodacyEndpointOutputSchemas.repositoryList.parse({
			data: [REPOSITORY],
			pagination: { limit: 10, total: 1 },
		});
		expect(parsed.data[0]?.name).toBe('test-repo');
	});

	it('rejects a repository record without an owner', () => {
		expect(() =>
			CodacyEndpointOutputSchemas.repositoryGet.parse({
				data: { provider: 'gh', name: 'test-repo' },
			}),
		).toThrow();
	});

	it('accepts repository language settings', () => {
		const parsed = CodacyEndpointOutputSchemas.repositoryLanguages.parse({
			languages: [
				{
					name: 'TypeScript',
					codacyDefaults: ['.ts'],
					extensions: ['.ts'],
					defaultFiles: [],
					enabled: true,
					detected: true,
				},
			],
		});
		expect(parsed.languages).toHaveLength(1);
	});

	it('accepts repository analysis configuration', () => {
		const parsed = CodacyEndpointOutputSchemas.analysisConfigGet.parse({
			data: [
				{
					uuid: '847feb32-9ff2-11ea-bb37-0242ac130002',
					name: 'ESLint',
					isClientSide: false,
				},
			],
		});
		expect(parsed.data).toHaveLength(1);
	});

	it('accepts a tools list', () => {
		const parsed = CodacyEndpointOutputSchemas.toolList.parse({
			data: [TOOL],
		});
		expect(parsed.data[0]?.uuid).toBe(TOOL.uuid);
	});

	it('accepts a patterns list', () => {
		const parsed = CodacyEndpointOutputSchemas.patternList.parse({
			data: [PATTERN],
			pagination: { total: 1 },
		});
		expect(parsed.data).toHaveLength(1);
	});

	it('accepts a single pattern definition', () => {
		const parsed = CodacyEndpointOutputSchemas.patternGet.parse({
			data: PATTERN,
		});
		expect(parsed.data.id).toBe('accessor-pairs');
	});

	it('rejects a pattern definition without severityLevel', () => {
		expect(() =>
			CodacyEndpointOutputSchemas.patternGet.parse({
				data: { id: 'x', category: 'Best Practices', level: 'Warning' },
			}),
		).toThrow();
	});
});

describe('input validation rejects malformed agent inputs', () => {
	it('requires provider and organization for repository operations', () => {
		expect(() => CodacyEndpointInputSchemas.repositoryList.parse({})).toThrow();
		expect(() =>
			CodacyEndpointInputSchemas.repositoryList.parse({
				provider: 'gh',
				organization_name: 'test-org',
			}),
		).not.toThrow();
	});

	it('requires provider and organization name to get an organization', () => {
		expect(() =>
			CodacyEndpointInputSchemas.organizationGet.parse({
				provider: 'gh',
			}),
		).toThrow();
	});

	it('clamps limit to a max of 1000', () => {
		expect(() =>
			CodacyEndpointInputSchemas.toolList.parse({ limit: 5000 }),
		).toThrow();
		expect(() =>
			CodacyEndpointInputSchemas.toolList.parse({ limit: 50 }),
		).not.toThrow();
	});

	it('requires a tool uuid to list patterns', () => {
		expect(() => CodacyEndpointInputSchemas.patternList.parse({})).toThrow();
	});

	it('requires tool uuid and pattern id to get a pattern', () => {
		expect(() =>
			CodacyEndpointInputSchemas.patternGet.parse({ tool_uuid: 'abc' }),
		).toThrow();
		expect(() =>
			CodacyEndpointInputSchemas.patternGet.parse({
				tool_uuid: 'abc',
				pattern_id: 'def',
			}),
		).not.toThrow();
	});

	it('requires provider, organization, and repository for language settings', () => {
		expect(() =>
			CodacyEndpointInputSchemas.repositoryLanguages.parse({
				provider: 'gh',
				organization_name: 'test-org',
			}),
		).toThrow();
	});
});
