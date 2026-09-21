import { getCodacyCredentials, makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import { Endpoints } from './index';

jest.mock('../client', () => {
	const actual = jest.requireActual('../client');
	return {
		...actual,
		getCodacyCredentials: jest.fn(),
		makeCodacyRequest: jest.fn(),
	};
});

const mockGetCredentials = getCodacyCredentials as unknown as jest.Mock;
const mockRequest = makeCodacyRequest as unknown as jest.Mock;

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

function makeCtx() {
	const upserts = {
		accounts: jest.fn(),
		organizations: jest.fn(),
		repositories: jest.fn(),
		tools: jest.fn(),
		patterns: jest.fn(),
	};
	const db: Record<string, { upsertByEntityId: jest.Mock }> = {};
	for (const [key, fn] of Object.entries(upserts)) {
		db[key] = { upsertByEntityId: fn };
	}
	const ctx = {
		key: 'test-token',
		db,
		$getAccountId: async () => 'test-account',
	} as unknown as CodacyContext;
	return { ctx, upserts };
}

beforeEach(() => {
	mockGetCredentials.mockResolvedValue('test-token');
	mockRequest.mockReset();
});

describe('account handlers', () => {
	it('gets the account from GET /user and persists it', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: {
				id: 1,
				mainEmail: 'test@example.com',
				otherEmails: [],
				isAdmin: false,
				isActive: true,
				created: '2024-01-01T00:00:00Z',
			},
		});

		const result = await Endpoints.accountGet(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith('/user', 'test-token');
		expect(result.data.id).toBe(1);
		expect(upserts.accounts).toHaveBeenCalledWith(
			'1',
			expect.objectContaining({ id: 1 }),
		);
	});
});

describe('organization handlers', () => {
	it('lists organizations from GET /user/organizations with cursor pagination', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: [ORGANIZATION],
			pagination: { cursor: 'next', limit: 5, total: 1 },
		});

		const result = await Endpoints.organizationList(ctx, { limit: 5 });

		expect(mockRequest).toHaveBeenCalledWith(
			'/user/organizations',
			'test-token',
			{ query: { cursor: undefined, limit: 5 } },
		);
		expect(result.data).toHaveLength(1);
		expect(result.pagination?.cursor).toBe('next');
		expect(upserts.organizations).toHaveBeenCalledWith(
			'gh/test-org',
			expect.objectContaining({ name: 'test-org' }),
		);
	});

	it('lists organizations for one provider from GET /user/organizations/{provider}', async () => {
		const { ctx } = makeCtx();
		mockRequest.mockResolvedValueOnce({ data: [ORGANIZATION] });

		await Endpoints.organizationList(ctx, { provider: 'gh' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/user/organizations/gh',
			'test-token',
			{ query: { cursor: undefined, limit: undefined } },
		);
	});

	it('gets an organization and persists it', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({ data: ORGANIZATION });

		const result = await Endpoints.organizationGet(ctx, {
			provider: 'gh',
			organization_name: 'test-org',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/organizations/gh/test-org',
			'test-token',
		);
		expect(result.data.name).toBe('test-org');
		expect(upserts.organizations).toHaveBeenCalledWith(
			'gh/test-org',
			expect.objectContaining({ name: 'test-org' }),
		);
	});
});

describe('repository handlers', () => {
	it('lists repositories with search and persists them', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: [REPOSITORY],
			pagination: { limit: 10, total: 1 },
		});

		const result = await Endpoints.repositoryList(ctx, {
			provider: 'gh',
			organization_name: 'test-org',
			limit: 10,
			search: 'test',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/organizations/gh/test-org/repositories',
			'test-token',
			{ query: { cursor: undefined, limit: 10, search: 'test' } },
		);
		expect(result.data).toHaveLength(1);
		expect(upserts.repositories).toHaveBeenCalledWith(
			'gh/test-org/test-repo',
			expect.objectContaining({ name: 'test-repo' }),
		);
	});

	it('gets a repository and persists it', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({ data: REPOSITORY });

		const result = await Endpoints.repositoryGet(ctx, {
			provider: 'gh',
			organization_name: 'test-org',
			repository_name: 'test-repo',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/organizations/gh/test-org/repositories/test-repo',
			'test-token',
		);
		expect(result.data.name).toBe('test-repo');
		expect(upserts.repositories).toHaveBeenCalledWith(
			'gh/test-org/test-repo',
			expect.objectContaining({ name: 'test-repo' }),
		);
	});

	it('gets repository language settings', async () => {
		const { ctx } = makeCtx();
		mockRequest.mockResolvedValueOnce({
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

		const result = await Endpoints.repositoryLanguages(ctx, {
			provider: 'gh',
			organization_name: 'test-org',
			repository_name: 'test-repo',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/organizations/gh/test-org/repositories/test-repo/settings/languages',
			'test-token',
		);
		expect(result.languages[0]?.name).toBe('TypeScript');
	});
});

describe('analysis handlers', () => {
	it('gets repository analysis configuration and persists tools', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: [{ uuid: TOOL.uuid, name: 'ESLint', isClientSide: false }],
		});

		const result = await Endpoints.analysisConfigGet(ctx, {
			provider: 'gh',
			organization_name: 'test-org',
			repository_name: 'test-repo',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/analysis/organizations/gh/test-org/repositories/test-repo/tools',
			'test-token',
		);
		expect(result.data).toHaveLength(1);
		expect(upserts.tools).toHaveBeenCalledWith(
			TOOL.uuid,
			expect.objectContaining({ name: 'ESLint' }),
		);
	});
});

describe('tool handlers', () => {
	it('lists tools with cursor pagination and persists them', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: [TOOL],
			pagination: { total: 1 },
		});

		const result = await Endpoints.toolList(ctx, { limit: 5 });

		expect(mockRequest).toHaveBeenCalledWith('/tools', 'test-token', {
			query: { cursor: undefined, limit: 5 },
		});
		expect(result.data[0]?.uuid).toBe(TOOL.uuid);
		expect(upserts.tools).toHaveBeenCalledWith(
			TOOL.uuid,
			expect.objectContaining({ name: 'ESLint' }),
		);
	});
});

describe('pattern handlers', () => {
	it('lists patterns with filters and persists them', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({
			data: [PATTERN],
			pagination: { total: 1 },
		});

		const result = await Endpoints.patternList(ctx, {
			tool_uuid: TOOL.uuid,
			enabled: true,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			`/tools/${TOOL.uuid}/patterns`,
			'test-token',
			{
				query: {
					cursor: undefined,
					limit: undefined,
					enabled: true,
					search: undefined,
				},
			},
		);
		expect(result.data).toHaveLength(1);
		expect(upserts.patterns).toHaveBeenCalledWith(
			`${TOOL.uuid}/accessor-pairs`,
			expect.objectContaining({ id: 'accessor-pairs' }),
		);
	});

	it('gets a single pattern definition and persists it', async () => {
		const { ctx, upserts } = makeCtx();
		mockRequest.mockResolvedValueOnce({ data: PATTERN });

		const result = await Endpoints.patternGet(ctx, {
			tool_uuid: TOOL.uuid,
			pattern_id: 'accessor-pairs',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			`/tools/${TOOL.uuid}/patterns/accessor-pairs`,
			'test-token',
		);
		expect(result.data.id).toBe('accessor-pairs');
		expect(upserts.patterns).toHaveBeenCalledWith(
			`${TOOL.uuid}/accessor-pairs`,
			expect.objectContaining({ id: 'accessor-pairs' }),
		);
	});
});
