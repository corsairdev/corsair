import type { IssuesListInput } from './types';
import { buildLinearIssueFilter, LinearEndpointInputSchemas } from './types';

describe('buildLinearIssueFilter', () => {
	it('returns undefined for empty input', () => {
		expect(buildLinearIssueFilter({})).toBeUndefined();
		expect(
			buildLinearIssueFilter({ keywords: [], label: [], assignee: ' ' }),
		).toBeUndefined();
		expect(
			buildLinearIssueFilter({ first: 10, orderBy: 'createdAt' }),
		).toBeUndefined();
	});

	it('passes a raw filter through unchanged when alone', () => {
		const filter = { updatedAt: { gte: '2026-08-17T00:00:00.000Z' } };
		expect(buildLinearIssueFilter({ filter })).toBe(filter);
	});

	it('keeps the teamId + filter shape from before', () => {
		const filter = { updatedAt: { gte: '2026-08-17T00:00:00.000Z' } };
		expect(buildLinearIssueFilter({ teamId: 't1', filter })).toEqual({
			and: [{ team: { id: { eq: 't1' } } }, filter],
		});
		expect(buildLinearIssueFilter({ teamId: 't1' })).toEqual({
			team: { id: { eq: 't1' } },
		});
	});

	it.each<[Partial<IssuesListInput>, object]>([
		[
			{ keywords: ['login'] },
			{
				or: [
					{ title: { containsIgnoreCase: 'login' } },
					{ description: { containsIgnoreCase: 'login' } },
				],
			},
		],
		[{ assignee: 'me' }, { assignee: { isMe: { eq: true } } }],
		[{ assignee: 'Me' }, { assignee: { isMe: { eq: true } } }],
		[{ assignee: 'jo@x.com' }, { assignee: { email: { eq: 'jo@x.com' } } }],
		[
			{ assignee: 'Jo Smith' },
			{ assignee: { name: { containsIgnoreCase: 'Jo Smith' } } },
		],
		[{ creator: 'me' }, { creator: { isMe: { eq: true } } }],
		[{ creator: 'jo@x.com' }, { creator: { email: { eq: 'jo@x.com' } } }],
		[
			{ stateName: 'In Progress' },
			{ state: { name: { eqIgnoreCase: 'In Progress' } } },
		],
		[{ stateType: 'started' }, { state: { type: { eq: 'started' } } }],
		[{ teamKey: 'eng' }, { team: { key: { eq: 'ENG' } } }],
		[
			{ label: ['Bug'] },
			{ labels: { some: { name: { eqIgnoreCase: 'Bug' } } } },
		],
		[{ priority: 1 }, { priority: { eq: 1 } }],
		[{ priority: 0 }, { priority: { eq: 0 } }],
		[{ createdAfter: '2025-01-31' }, { createdAt: { gte: '2025-01-31' } }],
		[{ createdBefore: '2025-02-28' }, { createdAt: { lte: '2025-02-28' } }],
		[
			{ updatedAfter: '2025-01-01', updatedBefore: '2025-01-31' },
			{ updatedAt: { gte: '2025-01-01', lte: '2025-01-31' } },
		],
	])('%j -> %j', (input, expected) => {
		expect(buildLinearIssueFilter(input)).toEqual(expected);
	});

	it('ANDs each keyword and each label separately', () => {
		expect(
			buildLinearIssueFilter({ keywords: ['a b', 'c'], label: ['Bug', 'UI'] }),
		).toEqual({
			and: [
				{
					or: [
						{ title: { containsIgnoreCase: 'a b' } },
						{ description: { containsIgnoreCase: 'a b' } },
					],
				},
				{
					or: [
						{ title: { containsIgnoreCase: 'c' } },
						{ description: { containsIgnoreCase: 'c' } },
					],
				},
				{ labels: { some: { name: { eqIgnoreCase: 'Bug' } } } },
				{ labels: { some: { name: { eqIgnoreCase: 'UI' } } } },
			],
		});
	});

	it('combines fields and the raw filter in one and', () => {
		const filter = { project: { name: { eq: 'Launch' } } };
		expect(
			buildLinearIssueFilter({
				teamKey: 'ENG',
				assignee: 'me',
				stateType: 'started',
				filter,
			}),
		).toEqual({
			and: [
				{ team: { key: { eq: 'ENG' } } },
				{ assignee: { isMe: { eq: true } } },
				{ state: { type: { eq: 'started' } } },
				filter,
			],
		});
	});

	it('produces a filter the input schema accepts', () => {
		const filter = buildLinearIssueFilter({
			keywords: ['x'],
			assignee: 'me',
			creator: 'a@b.c',
			stateName: 'Todo',
			teamKey: 'ENG',
			label: ['Bug'],
			priority: 2,
			createdAfter: '2025-01-01',
		});
		expect(
			LinearEndpointInputSchemas.issuesList.parse({ filter }).filter,
		).toEqual(filter);
	});
});
