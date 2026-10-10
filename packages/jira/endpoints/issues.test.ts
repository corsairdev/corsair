import { makeJiraRequest } from '../client';
import type { JiraContext } from '../index';
import type { JiraIssue } from '../schema/database';
import { bulkFetch, get, search } from './issues';
import { JiraEndpointInputSchemas, JiraEndpointOutputSchemas } from './types';

jest.mock('../client', () => ({
	makeJiraRequest: jest.fn(),
}));

jest.mock(
	'corsair/core',
	() => ({
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	}),
	{ virtual: true },
);

const requestMock = jest.mocked(makeJiraRequest);
const cloudUrl = 'https://example.atlassian.net';
const created = '2020-05-01T10:20:30.000+0530';

const makeContext = () => {
	const upsertByEntityId = jest
		.fn<Promise<void>, [string, Partial<JiraIssue>]>()
		.mockResolvedValue(undefined);

	// This partial fixture supplies only the services these endpoints use.
	// Event logging is mocked above; the unknown bridge deliberately omits unused
	// JiraContext services such as endpoints and the other database collections.
	const ctx = {
		key: 'test-key',
		keys: { get_cloud_url: jest.fn().mockResolvedValue(cloudUrl) },
		db: { issues: { upsertByEntityId } },
	} as unknown as JiraContext;

	return { ctx, upsertByEntityId };
};

const makeIssue = (fields: { summary?: string; created?: string } = {}) => ({
	id: '10001',
	key: 'TEST-1',
	fields,
});

beforeEach(() => {
	jest.clearAllMocks();
	requestMock.mockReset();
});

describe('issues.search pagination', () => {
	it('omits the continuation token and unsupported offset on the first page', async () => {
		const { ctx } = makeContext();
		requestMock.mockResolvedValue({ issues: [], isLast: true });

		await search(ctx, { jql: 'project = TEST', max_results: 1 });

		expect(requestMock).toHaveBeenCalledWith(
			'search/jql',
			'test-key',
			cloudUrl,
			{
				method: 'GET',
				query: {
					jql: 'project = TEST',
					maxResults: 1,
					fields: undefined,
					expand: undefined,
				},
			},
		);
	});

	it('uses the returned continuation token to request the next page', async () => {
		const { ctx } = makeContext();
		requestMock
			.mockResolvedValueOnce({
				issues: [],
				nextPageToken: 'page-two',
				isLast: false,
			})
			.mockResolvedValueOnce({ issues: [], isLast: true });

		const firstPage = await search(ctx, { jql: 'project = TEST' });
		const lastPage = await search(ctx, {
			jql: 'project = TEST',
			next_page_token: firstPage.nextPageToken,
		});

		expect(firstPage.nextPageToken).toBe('page-two');
		expect(firstPage.isLast).toBe(false);
		expect(requestMock).toHaveBeenNthCalledWith(
			2,
			'search/jql',
			'test-key',
			cloudUrl,
			{
				method: 'GET',
				query: {
					jql: 'project = TEST',
					nextPageToken: 'page-two',
					maxResults: undefined,
					fields: undefined,
					expand: undefined,
				},
			},
		);
		expect(lastPage.isLast).toBe(true);
	});

	it('omits an empty continuation token', async () => {
		const { ctx } = makeContext();
		requestMock.mockResolvedValue({ issues: [] });
		await search(ctx, { jql: 'project = TEST', next_page_token: '' });
		expect(requestMock.mock.calls[0]?.[3]?.query).not.toHaveProperty(
			'nextPageToken',
		);
	});

	it('preserves token pagination fields when parsing schemas', () => {
		expect(
			JiraEndpointInputSchemas.issuesSearch.parse({
				jql: 'project = TEST',
				next_page_token: 'page-two',
			}),
		).toEqual({ jql: 'project = TEST', next_page_token: 'page-two' });
		expect(
			JiraEndpointOutputSchemas.issuesSearch.parse({
				issues: [],
				nextPageToken: 'page-two',
				isLast: false,
			}),
		).toEqual({ issues: [], nextPageToken: 'page-two', isLast: false });
		expect(
			JiraEndpointOutputSchemas.issuesSearch.parse({
				issues: [],
				isLast: true,
			}),
		).toEqual({ issues: [], isLast: true });
	});
});

describe('synced issue creation dates', () => {
	it('get saves the creation date supplied by Jira', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		const issue = makeIssue({ summary: 'Existing issue', created });
		requestMock.mockResolvedValue(issue);

		expect(await get(ctx, { issue_id_or_key: issue.key })).toEqual(issue);
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId).toHaveBeenCalledWith(
			issue.id,
			expect.objectContaining({ createdAt: new Date(created) }),
		);
	});

	it('get omits createdAt when Jira does not return created', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		requestMock.mockResolvedValue(makeIssue({ summary: 'Existing issue' }));
		await get(ctx, { issue_id_or_key: 'TEST-1', fields: 'summary' });
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId.mock.calls[0]?.[1]).not.toHaveProperty('createdAt');
	});

	it('search saves the creation date supplied by Jira', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		requestMock.mockResolvedValue({ issues: [makeIssue({ created })] });
		await search(ctx, { jql: 'project = TEST', fields: 'created' });
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'10001',
			expect.objectContaining({ createdAt: new Date(created) }),
		);
	});

	it('search omits createdAt when Jira does not return created', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		requestMock.mockResolvedValue({ issues: [makeIssue()] });
		await search(ctx, { jql: 'project = TEST' });
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId.mock.calls[0]?.[1]).not.toHaveProperty('createdAt');
	});

	it('bulkFetch saves the creation date supplied by Jira', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		const response = { issues: [makeIssue({ created })] };
		requestMock.mockResolvedValue(response);

		expect(
			await bulkFetch(ctx, {
				issue_ids_or_keys: ['TEST-1'],
				fields: ['created'],
			}),
		).toEqual(response);
		expect(requestMock).toHaveBeenCalledWith(
			'issue/bulkfetch',
			'test-key',
			cloudUrl,
			{
				method: 'POST',
				body: { issueIdsOrKeys: ['TEST-1'], fields: ['created'] },
			},
		);
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'10001',
			expect.objectContaining({ createdAt: new Date(created) }),
		);
	});

	it('bulkFetch omits createdAt when Jira does not return created', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		requestMock.mockResolvedValue({
			issues: [makeIssue({ summary: 'Existing issue' })],
		});
		await bulkFetch(ctx, {
			issue_ids_or_keys: ['TEST-1'],
			fields: ['summary'],
		});
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId.mock.calls[0]?.[1]).not.toHaveProperty('createdAt');
	});

	it('bulkFetch omits createdAt when the whole fields object is absent', async () => {
		const { ctx, upsertByEntityId } = makeContext();
		requestMock.mockResolvedValue({ issues: [{ id: '10001', key: 'TEST-1' }] });
		await bulkFetch(ctx, { issue_ids_or_keys: ['TEST-1'] });
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(upsertByEntityId.mock.calls[0]?.[1]).not.toHaveProperty('createdAt');
	});
});
