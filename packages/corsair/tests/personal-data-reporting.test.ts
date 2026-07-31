import {
	chunk,
	collectReportableAccounts,
	parseReportResponse,
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
