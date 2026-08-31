import { createCorsair } from '../core';
import type { CorsairPlugin } from '../core/plugins';
import { setupCorsair } from '../setup';
import { createTestDatabase } from './setup-db';

jest.mock('../hub/config', () => ({
	getHubConfig: jest.fn(() => ({ hub: 'stub' })),
}));
jest.mock('../hub/managed-auth', () => ({
	getManagedAccessToken: jest.fn(async () => ({
		accessToken: 'refreshed-token',
		expiresAt: 0,
		refreshed: true,
	})),
}));

import { getManagedAccessToken } from '../hub/managed-auth';
import {
	chunk,
	collectReportableAccounts,
	parseReportResponse,
	reportAccounts,
	reportPersonalDataForPlugin,
	startPersonalDataReporting,
} from '../oauth/personal-data-reporting';

const JIRA_CONFIG = {
	entityAccountIdFields: {
		users: ['accountId'],
		issues: ['reporterAccountId', 'assigneeAccountId'],
		comments: ['authorAccountId'],
		projects: ['leadAccountId'],
	},
};

describe('collectReportableAccounts', () => {
	it('collects distinct accountIds across entity types, keeping latest updatedAt', () => {
		const rows = [
			{
				entity_type: 'users',
				data: { accountId: 'a1' },
				updated_at: new Date('2026-01-01T00:00:00Z'),
			},
			{
				entity_type: 'issues',
				data: { reporterAccountId: 'a1', assigneeAccountId: 'a2' },
				updated_at: new Date('2026-02-01T00:00:00Z'),
			},
			{
				entity_type: 'comments',
				data: { authorAccountId: 'a3' },
				updated_at: new Date('2026-01-15T00:00:00Z'),
			},
			{
				entity_type: 'issues',
				data: {},
				updated_at: new Date('2026-03-01T00:00:00Z'),
			},
		];
		const result = collectReportableAccounts(rows, JIRA_CONFIG);
		const byId = Object.fromEntries(
			result.map((r) => [r.accountId, r.updatedAt]),
		);
		expect(Object.keys(byId).sort()).toEqual(['a1', 'a2', 'a3']);
		// a1 appears on both a users row (Jan) and an issues row (Feb) — latest wins.
		expect(byId.a1).toBe('2026-02-01T00:00:00.000Z');
		expect(byId.a2).toBe('2026-02-01T00:00:00.000Z');
		expect(byId.a3).toBe('2026-01-15T00:00:00.000Z');
	});

	it('ignores entity types not in the config and empty fields', () => {
		const rows = [
			{
				entity_type: 'sprints',
				data: { name: 'x' },
				updated_at: new Date(),
			},
			{ entity_type: 'users', data: {}, updated_at: new Date() },
		];
		expect(collectReportableAccounts(rows, JIRA_CONFIG)).toEqual([]);
	});
});

describe('chunk', () => {
	it('splits into batches of at most size', () => {
		const items = Array.from({ length: 190 }, (_, i) => i);
		const batches = chunk(items, 90);
		expect(batches.map((b) => b.length)).toEqual([90, 90, 10]);
	});

	it('returns an empty array for empty input', () => {
		expect(chunk([], 90)).toEqual([]);
	});
});

describe('parseReportResponse', () => {
	it('204 means nothing to erase', () => {
		expect(parseReportResponse(204, null)).toEqual([]);
	});

	it('200 returns accountIds with status closed only', () => {
		const body = {
			accounts: [
				{ accountId: 'a1', status: 'closed' },
				{ accountId: 'a2', status: 'updated' },
				{ accountId: 'a3', status: 'closed' },
			],
		};
		expect(parseReportResponse(200, body).sort()).toEqual(['a1', 'a3']);
	});

	it('tolerates a malformed body', () => {
		expect(parseReportResponse(200, undefined)).toEqual([]);
		expect(parseReportResponse(200, { accounts: 'nope' })).toEqual([]);
	});
});

describe('reportAccounts', () => {
	const config = JIRA_CONFIG;

	const rowFor = (accountId: string, entities: unknown[]) => ({
		accountId,
		tenantId: `t-${accountId}`,
		entities: entities as {
			entity_type: string;
			data: Record<string, unknown>;
			updated_at: Date;
		}[],
	});

	it('reports collected account ids with the tenant token and erases closed ones', async () => {
		const reported: { token: string; ids: string[] }[] = [];
		const erased: { accountId: string; closedIds: string[] }[] = [];

		const rows = [
			rowFor('acc-1', [
				{
					entity_type: 'users',
					data: { accountId: 'atl-a' },
					updated_at: new Date('2026-01-01T00:00:00Z'),
				},
				{
					entity_type: 'issues',
					data: { reporterAccountId: 'atl-b' },
					updated_at: new Date('2026-01-02T00:00:00Z'),
				},
			]),
		];

		const result = await reportAccounts({
			config,
			rows,
			getToken: async (row) => `token-${row.accountId}`,
			report: async (token, accounts) => {
				reported.push({ token, ids: accounts.map((a) => a.accountId) });
				return {
					status: 200,
					body: {
						accounts: [{ accountId: 'atl-a', status: 'closed' }],
					},
				};
			},
			eraseAccount: async (row, closedIds) => {
				erased.push({ accountId: row.accountId, closedIds });
			},
		});

		expect(reported).toHaveLength(1);
		expect(reported[0].token).toBe('token-acc-1');
		expect(reported[0].ids.sort()).toEqual(['atl-a', 'atl-b']);
		expect(erased).toEqual([{ accountId: 'acc-1', closedIds: ['atl-a'] }]);
		expect(result).toEqual({ reported: 2, erased: ['atl-a'], failed: [] });
	});

	it('skips accounts with no stored personal data and accounts with no token', async () => {
		const report = jest.fn(async () => ({ status: 204, body: null }));
		const result = await reportAccounts({
			config,
			rows: [
				rowFor('empty', [
					{
						entity_type: 'sprints',
						data: { name: 'x' },
						updated_at: new Date(),
					},
				]),
				rowFor('no-token', [
					{
						entity_type: 'users',
						data: { accountId: 'atl-z' },
						updated_at: new Date(),
					},
				]),
			],
			getToken: async (row) => (row.accountId === 'no-token' ? null : 'tok'),
			report,
			eraseAccount: async () => {},
		});

		expect(report).not.toHaveBeenCalled();
		expect(result).toEqual({ reported: 0, erased: [], failed: [] });
	});

	it('batches into groups of at most 90 accounts per report call', async () => {
		const sizes: number[] = [];
		const entities = Array.from({ length: 190 }, (_, i) => ({
			entity_type: 'users',
			data: { accountId: `atl-${i}` },
			updated_at: new Date(),
		}));
		await reportAccounts({
			config,
			rows: [rowFor('big', entities)],
			getToken: async () => 'tok',
			report: async (_t, accounts) => {
				sizes.push(accounts.length);
				return { status: 204, body: null };
			},
			eraseAccount: async () => {},
		});
		expect(sizes).toEqual([90, 90, 10]);
	});

	it('isolates per-account failures and tallies them', async () => {
		const result = await reportAccounts({
			config,
			rows: [
				rowFor('bad', [
					{
						entity_type: 'users',
						data: { accountId: 'atl-bad' },
						updated_at: new Date(),
					},
				]),
				rowFor('good', [
					{
						entity_type: 'users',
						data: { accountId: 'atl-good' },
						updated_at: new Date(),
					},
				]),
			],
			getToken: async () => 'tok',
			report: async (_t, accounts) => {
				if (accounts.some((a) => a.accountId === 'atl-bad')) {
					throw new Error('provider 500');
				}
				return { status: 204, body: null };
			},
			eraseAccount: async () => {},
		});

		expect(result.reported).toBe(1);
		expect(result.failed).toEqual(['bad']);
	});
});

describe('reportPersonalDataForPlugin (through the entity mirror)', () => {
	const jiraLike = {
		id: 'jira',
		options: { authType: 'managed' as const },
		authConfig: { managed: { account: [] as const } },
		personalData: {
			entityAccountIdFields: {
				users: ['accountId'],
				issues: ['reporterAccountId', 'assigneeAccountId'],
			},
		},
	} as unknown as CorsairPlugin;

	let env: ReturnType<typeof createTestDatabase>;
	afterEach(() => env?.cleanup?.());

	async function seed(env: ReturnType<typeof createTestDatabase>) {
		const now = new Date();
		await env.db
			.insertInto('corsair_integrations')
			.values({
				id: 'int-1',
				created_at: now,
				updated_at: now,
				name: 'jira',
				config: {},
			} as never)
			.execute();
		await env.db
			.insertInto('corsair_accounts')
			.values({
				id: 'acc-1',
				created_at: now,
				updated_at: now,
				tenant_id: 'default',
				integration_id: 'int-1',
				config: {},
				dek: 'dek-1',
			} as never)
			.execute();
		const entity = (
			id: string,
			entity_type: string,
			data: Record<string, unknown>,
		) =>
			env.db
				.insertInto('corsair_entities')
				.values({
					id,
					created_at: now,
					updated_at: now,
					account_id: 'acc-1',
					entity_id: id,
					entity_type,
					version: '1.0.0',
					data,
				} as never)
				.execute();
		await entity('u-open', 'users', { accountId: 'atl-open' });
		await entity('u-closed', 'users', { accountId: 'atl-closed' });
		await entity('i-1', 'issues', {
			reporterAccountId: 'atl-closed',
			assigneeAccountId: 'atl-open',
		});
	}

	it('reports mirror account ids and purges rows the provider closed', async () => {
		env = createTestDatabase();
		await seed(env);
		const corsair = createCorsair({
			plugins: [jiraLike],
			database: env.db,
			kek: 'k'.repeat(64),
		} as never);
		await setupCorsair(corsair);

		const reported: string[] = [];
		const result = await reportPersonalDataForPlugin(corsair, jiraLike, {
			getToken: async () => 'token',
			report: async (_token, accounts) => {
				reported.push(...accounts.map((a) => a.accountId));
				return {
					status: 200,
					body: { accounts: [{ accountId: 'atl-closed', status: 'closed' }] },
				};
			},
		});

		expect(reported.sort()).toEqual(['atl-closed', 'atl-open']);
		expect(result.erased).toEqual(['atl-closed']);

		const remaining = await env.db
			.selectFrom('corsair_entities')
			.select('id')
			.execute();
		// u-closed (references atl-closed) and i-1 (reporter atl-closed) purged;
		// u-open survives.
		expect(remaining.map((r) => r.id).sort()).toEqual(['u-open']);
	});

	it('reports with a freshly-refreshed managed token (default token path)', async () => {
		env = createTestDatabase();
		await seed(env);
		const corsair = createCorsair({
			plugins: [jiraLike],
			database: env.db,
			kek: 'k'.repeat(64),
		} as never);
		await setupCorsair(corsair);
		(getManagedAccessToken as jest.Mock).mockClear();

		let usedToken: string | undefined;
		// Only override `report` — exercise the real getToken → getManagedAccessToken path.
		await reportPersonalDataForPlugin(corsair, jiraLike, {
			report: async (token) => {
				usedToken = token;
				return { status: 204, body: null };
			},
		});

		expect(getManagedAccessToken).toHaveBeenCalledTimes(1);
		const ctx = (getManagedAccessToken as jest.Mock).mock.calls[0][0];
		expect(ctx.plugin).toBe('jira');
		expect(ctx.tenantId).toBe('default');
		expect(usedToken).toBe('refreshed-token');
	});
});

describe('startPersonalDataReporting', () => {
	it('returns a stop function and does not throw without a database', () => {
		const corsair = createCorsair({
			plugins: [],
			kek: 'k'.repeat(64),
		} as never);
		const stop = startPersonalDataReporting(corsair, { intervalHours: 24 });
		expect(typeof stop).toBe('function');
		stop();
	});
});
