import { request } from 'corsair/http';
import { list } from './issues';
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
