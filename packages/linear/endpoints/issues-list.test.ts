import { request } from 'corsair/http';
import { LinearIssue } from '../schema/database';
import { get, list } from './issues';
import { LinearEndpointInputSchemas } from './types';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

// `never` cast: `list` only reads key and db here; building the full endpoint context adds nothing.
const ctx = { key: 'k', db: {} } as never;

beforeEach(() => {
	mockRequest.mockReset();
	mockRequest.mockResolvedValue({ data: { issues: { nodes: [] } } });
});

// The mocked request records its options as unknown; the second argument is the GraphQL body.
const sent = () =>
	(
		mockRequest.mock.calls[0]?.[1] as {
			body: {
				query: string;
				variables: { first?: number; filter?: object; orderBy?: string };
			};
		}
	).body;

describe('linear issues.list filter and orderBy', () => {
	const filter = { updatedAt: { gte: '2026-08-17T00:00:00.000Z' } };

	it('passes filter and orderBy without a team', async () => {
		await list(ctx, { filter, orderBy: 'updatedAt' });
		const { query, variables } = sent();
		expect(variables.filter).toEqual(filter);
		expect(variables.orderBy).toBe('updatedAt');
		expect(query).toContain('$filter: IssueFilter');
		expect(query).toContain('$orderBy: PaginationOrderBy');
	});

	it('ands the team into the filter', async () => {
		await list(ctx, { teamId: 't1', filter, orderBy: 'updatedAt' });
		const { query, variables } = sent();
		expect(variables.filter).toEqual({
			and: [{ team: { id: { eq: 't1' } } }, filter],
		});
		expect(variables.orderBy).toBe('updatedAt');
		expect(query).toContain('$filter: IssueFilter');
	});

	it('keeps the team-only behaviour unchanged', async () => {
		await list(ctx, { teamId: 't1' });
		expect(sent().variables).toEqual({
			first: 50,
			filter: { team: { id: { eq: 't1' } } },
		});
	});

	it('sends no filter or orderBy by default', async () => {
		await list(ctx, {});
		expect(sent().variables).toEqual({ first: 50 });
	});
});

// `never` casts: these inputs are invalid on purpose, so they can't match the input type.
describe('linear issues.list parses its input', () => {
	it('rejects an unsupported filter before calling Linear', async () => {
		await expect(
			list(ctx, { filter: { title: { like: 'x' } } } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an unsupported orderBy before calling Linear', async () => {
		await expect(list(ctx, { orderBy: 'priority' } as never)).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('linear issues.list input schema', () => {
	const parse = (input: object) =>
		LinearEndpointInputSchemas.issuesList.safeParse(input);

	it('accepts nested and/or filters', () => {
		const filter = {
			and: [
				{ updatedAt: { gte: '2026-08-17T00:00:00.000Z' } },
				{
					or: [
						{ title: { containsIgnoreCase: 'bug' } },
						{ description: { contains: 'x' } },
					],
				},
				{ team: { id: { eq: 't1' } } },
			],
		};
		expect(parse({ filter, orderBy: 'createdAt' }).success).toBe(true);
	});

	it.each([
		['a non-object filter', { filter: false }],
		['a string filter', { filter: 'team' }],
		['an array filter', { filter: [] }],
		['an unsupported key', { filter: { assignee: { id: { eq: 'a' } } } }],
		['an unknown comparator', { filter: { title: { like: 'a' } } }],
		['a non-string comparator value', { filter: { updatedAt: { gte: 5 } } }],
		['a bad nested filter', { filter: { and: [{ title: { eq: 1 } }] } }],
		['an unsupported orderBy', { orderBy: 'priority' }],
	])('rejects %s', (_name, input) => {
		expect(parse(input).success).toBe(false);
	});
});

describe('linear issue rows keep assignee and state', () => {
	const node = {
		id: 'i1',
		title: 'T',
		priority: 1,
		number: 1,
		identifier: 'ENG-1',
		url: 'u',
		state: { id: 's1', name: 'In Progress', type: 'started', color: 'x' },
		team: { id: 't1' },
		assignee: { id: 'u1', name: 'Ada', email: 'ada@x.dev', avatarUrl: 'x' },
		creator: { id: 'u2' },
		createdAt: '2026-01-01T00:00:00.000Z',
		updatedAt: '2026-01-02T00:00:00.000Z',
	};
	const upsert = jest.fn();
	// `never` cast: list/get only read key and db.issues here.
	const dbCtx = {
		key: 'k',
		db: { issues: { upsertByEntityId: upsert } },
	} as never;
	const stored = () => LinearIssue.parse(upsert.mock.calls[0]?.[1]);

	beforeEach(() => upsert.mockReset());

	it('list stores assignee and state as nested objects', async () => {
		mockRequest.mockResolvedValue({ data: { issues: { nodes: [node] } } });
		await list(dbCtx, {});
		expect(stored().assignee).toEqual({
			id: 'u1',
			name: 'Ada',
			email: 'ada@x.dev',
		});
		expect(stored().state).toEqual({
			id: 's1',
			name: 'In Progress',
			type: 'started',
		});
		expect(stored().assigneeId).toBe('u1');
	});

	it('list and get request the same issue fields', async () => {
		mockRequest.mockResolvedValue({ data: { issues: { nodes: [] } } });
		await list(dbCtx, {});
		mockRequest.mockResolvedValue({ data: { issue: null } });
		await get(dbCtx, { id: 'i1' });
		// Each recorded call's second argument is the GraphQL body (typed unknown by the mock).
		const [listQ, getQ] = mockRequest.mock.calls.map((c) =>
			(c[1] as { body: { query: string } }).body.query.replace(/\s+/g, ' '),
		);
		for (const field of [
			'assignee { id name displayName email',
			'completedAt',
			'dueDate',
			'cycle {',
			'project {',
		]) {
			expect(listQ).toContain(field);
			expect(getQ).toContain(field);
		}
	});

	it('parses old rows and payloads without assignee or state', () => {
		const row = LinearIssue.parse({
			id: 'i1',
			title: 'T',
			priority: 0,
			number: 1,
			identifier: 'ENG-1',
			url: 'u',
			stateId: 's',
			teamId: 't',
			creatorId: 'c',
		});
		expect(row.assignee).toBeUndefined();
		expect(row.state).toBeUndefined();
		expect(
			LinearIssue.parse({ ...row, assignee: null, state: null }).assignee,
		).toBeNull();
	});
});
