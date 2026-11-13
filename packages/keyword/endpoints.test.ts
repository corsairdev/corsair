import { logEventFromContext } from 'corsair/core';
import { KeywordAPIError } from './client';
import {
	Account,
	Keywords,
	Mindshare,
	Projects,
	Ranking,
	Sharing,
} from './endpoints';
import {
	account,
	alerts,
	competitors,
	deleted,
	forbidden,
	keyword,
	keywords,
	metrics,
	mindshareHistory,
	mindshareLatest,
	notFound,
	project,
	projects,
	quotaExceeded,
	rankChart,
	rankingUrls,
	refreshed,
	regions,
	sharing,
	unauthorized,
	unprocessable,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'kw-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(status === 204 ? null : JSON.stringify(body), {
			status,
			headers: status === 204 ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.keyword.com');
	expect(sent.path.startsWith('/api/v2/')).toBe(true);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('projects.list', () => {
	it('GETs every project and strips the project auth key', async () => {
		respond(projects);

		const result = (await invoke(Projects.list, {})) as typeof projects;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/active',
		});
		expect(result.data).toHaveLength(2);
		// The project's own API key is a credential, so it never reaches a caller.
		expect(result.data[0]?.attributes).not.toHaveProperty('auth');
		expect(JSON.stringify(result)).not.toContain('PROJECT-AUTH-KEY');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keyword.projects.list',
			{ count: 2 },
			'completed',
		);
	});

	it('reads a subproject whose crawl time is a Unix timestamp', async () => {
		respond({
			data: [
				{
					...project,
					id: 'Disney[sub]Disney Classics',
					attributes: { ...project.attributes, crawled_at: 1681467537 },
				},
			],
		});

		await expect(invoke(Projects.list, {})).resolves.toMatchObject({
			data: [{ attributes: { crawled_at: 1681467537 } }],
		});
	});

	it('keeps fields it does not know', async () => {
		respond({
			data: [{ type: 'group', id: 'X', attributes: { brandNew: 'kept' } }],
		});

		await expect(invoke(Projects.list, {})).resolves.toMatchObject({
			data: [{ attributes: { brandNew: 'kept' } }],
		});
	});

	it('rejects a body that is not a project list', async () => {
		respond({ unexpected: true });

		await expect(invoke(Projects.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('projects.get', () => {
	it('GETs one project by name', async () => {
		respond({ data: project });

		await expect(
			invoke(Projects.get, { projectName: 'Disney' }),
		).resolves.toMatchObject({
			data: { id: 'Disney', attributes: { project_id: 3057417 } },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/Disney',
		});
	});

	it('keeps the [sub] marker readable in the path', async () => {
		respond({ data: project });

		await invoke(Projects.get, { projectName: 'Disney[sub]Disney Classics' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			'https://app.keyword.com/api/v2/groups/Disney[sub]Disney%20Classics',
		);
	});

	it('surfaces an unknown project', async () => {
		respond(notFound, 404);

		await expect(
			invoke(Projects.get, { projectName: 'nope' }),
		).rejects.toMatchObject({
			status: 404,
			message: 'Keyword 404: The requested resource was not found',
		});
	});

	it.each([[{}], [{ projectName: '' }], [{ projectName: 42 }]])(
		'rejects %j before calling Keyword',
		async (input) => {
			await expect(invoke(Projects.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('projects.create', () => {
	it('POSTs a JSON:API group document', async () => {
		respond({ data: project }, 201);

		await expect(
			invoke(Projects.create, {
				category: 'Disney',
				currency_code: 'USD',
				url: 'disney.com',
			}),
		).resolves.toMatchObject({ data: { id: 'Disney' } });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/groups',
			body: {
				data: {
					type: 'group',
					attributes: {
						category: 'Disney',
						currency_code: 'USD',
						url: 'disney.com',
					},
				},
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
	});

	it('reads a new project, whose keyword count is an empty array', async () => {
		respond(
			{
				data: {
					...project,
					attributes: {
						...project.attributes,
						keywords_count: [],
						crawled_at: null,
					},
				},
			},
			201,
		);

		await expect(
			invoke(Projects.create, { category: 'Disney' }),
		).resolves.toMatchObject({ data: { attributes: { keywords_count: [] } } });
	});

	it('sends only the required field when that is all it is given', async () => {
		respond({ data: project }, 201);

		await invoke(Projects.create, { category: 'Pixar' });

		expect(lastRequest().body).toEqual({
			data: { type: 'group', attributes: { category: 'Pixar' } },
		});
	});

	it('surfaces a token that cannot create across the account', async () => {
		respond(forbidden, 403);

		await expect(
			invoke(Projects.create, { category: 'Pixar' }),
		).rejects.toMatchObject({ status: 403, isPermissionError: true });
	});

	it.each([[{}], [{ category: '' }]])(
		'rejects %j before calling Keyword',
		async (input) => {
			await expect(invoke(Projects.create, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('projects.archive', () => {
	it('PUTs status 2 on the group and returns the meta title', async () => {
		respond({ meta: { title: 'Group has been archived', code: '1003' } });

		await expect(
			invoke(Projects.archive, { projectName: 'Disney' }),
		).resolves.toMatchObject({ meta: { title: 'Group has been archived' } });
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v2/groups/Disney',
			body: { data: { type: 'group', attributes: { status: 2 } } },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keyword.projects.archive',
			{ projectName: 'Disney' },
			'completed',
		);
	});

	it.each([[{}], [{ projectName: '' }]])(
		'rejects %j before calling Keyword',
		async (input) => {
			await expect(invoke(Projects.archive, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('projects.delete', () => {
	it('DELETEs the project and returns the meta title', async () => {
		respond({ meta: { title: 'Project deleted' } });

		await expect(
			invoke(Projects.remove, { projectName: 'Disney' }),
		).resolves.toMatchObject({ meta: { title: 'Project deleted' } });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/groups/Disney',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keyword.projects.delete',
			{ projectName: 'Disney' },
			'completed',
		);
	});
});

describe('projects.restore', () => {
	it('GETs the undo/archive route and returns the meta title', async () => {
		respond({ meta: { title: 'Group has been restored', code: '1004' } });

		await expect(
			invoke(Projects.restore, { projectName: 'Disney' }),
		).resolves.toMatchObject({ meta: { title: 'Group has been restored' } });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/Disney/undo/archive',
		});
	});
});

describe('sharing', () => {
	it('GETs the sharing settings, which sit at the root of the body', async () => {
		respond(sharing);

		await expect(
			invoke(Sharing.get, { projectId: 3057417 }),
		).resolves.toMatchObject({
			project_id: 3057417,
			is_active: true,
			share_hash: 'HUPjoqIyYIoYwlaf',
			visibility: { hide_overview: false },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects/3057417/sharing-settings',
		});
	});

	it('PATCHes the settings as top-level fields', async () => {
		respond({ ...sharing, is_active: false, share_hash: null });

		await expect(
			invoke(Sharing.update, { projectId: 3057417, is_active: false }),
		).resolves.toMatchObject({ is_active: false, share_hash: null });
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/projects/3057417/sharing-settings',
		});
		expect(lastRequest().body).toEqual({ is_active: false });
	});

	it('keeps a null password, which removes the protection', async () => {
		respond(sharing);

		await invoke(Sharing.update, {
			projectId: 3057417,
			password: null,
			visibility: { hide_overview: true },
		});

		expect(lastRequest().body).toEqual({
			password: null,
			visibility: { hide_overview: true },
		});
	});

	it.each([
		[{ projectId: 3057417 }],
		[{ projectId: 0, is_active: true }],
		[{ projectId: 3057417, is_public: true }],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Sharing.update, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.list', () => {
	it('GETs the keywords and strips the project auth key', async () => {
		respond(keywords);

		const result = (await invoke(Keywords.list, { projectName: 'Disney' })) as {
			data: (typeof keywords.data)[number][];
		};

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/Disney/keywords',
			query: {},
		});
		expect(result.data[0]?.attributes.kw).toBe('disneyland');
		expect(result.data[0]?.attributes).not.toHaveProperty('auth');
		expect(JSON.stringify(result)).not.toContain('PROJECT-AUTH-KEY');
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keyword.keywords.list',
			{ projectName: 'Disney', count: 2 },
			'completed',
		);
	});

	it('sends paging and the date', async () => {
		respond(keywords);

		await invoke(Keywords.list, {
			projectName: 'Disney',
			page: 2,
			per_page: 250,
			date: '2026-11-01',
		});

		expect(lastRequest().query).toEqual({
			page: '2',
			per_page: '250',
			date: '2026-11-01',
		});
	});

	it.each([
		[{ projectName: 'Disney', page: 0 }],
		[{ projectName: 'Disney', per_page: 0 }],
		[{ projectName: 'Disney', per_page: 1001 }],
		[{ projectName: 'Disney', date: '01/11/2026' }],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Keywords.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.get', () => {
	it('GETs one keyword, with a date', async () => {
		respond({ data: keyword });

		await expect(
			invoke(Keywords.get, {
				projectName: 'Disney',
				keywordId: '272678916',
				date: '2026-11-01',
			}),
		).resolves.toMatchObject({ data: { id: '187181871' } });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/Disney/keywords/272678916',
			query: { date: '2026-11-01' },
		});
	});
});

describe('keywords.add', () => {
	it('reads a just-added keyword, whose competition is still a label', async () => {
		respond(
			{
				data: [
					{
						...keyword,
						attributes: {
							...keyword.attributes,
							competition: 'Low',
							rankingurl: 'NOT FOUND',
							grank: null,
							crawled_at: null,
						},
					},
				],
				meta: {
					title: '1 keyword has been added',
					counts: { duplicates: 0, added: 1 },
				},
			},
			201,
		);

		await expect(
			invoke(Keywords.add, {
				projectName: 'Disney',
				keywords: [{ kw: 'jungle book', url: 'disney.com' }],
			}),
		).resolves.toMatchObject({
			data: [{ attributes: { competition: 'Low' } }],
		});
	});

	it('POSTs a JSON:API keyword document with the project category', async () => {
		respond({ data: [keyword] }, 201);

		await expect(
			invoke(Keywords.add, {
				projectName: 'Disney',
				keywords: [
					{
						kw: 'Jungle Book',
						url: 'disney.com',
						region: 'google.com',
						language: 'en',
						type: 'se',
						url_tracking_method: 'broad',
					},
				],
			}),
		).resolves.toMatchObject({ data: [{ id: '187181871' }] });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/groups/Disney/keywords',
			body: {
				data: [
					{
						type: 'keyword',
						attributes: {
							category: 'Disney',
							kw: 'Jungle Book',
							url: 'disney.com',
							region: 'google.com',
							language: 'en',
							type: 'se',
							url_tracking_method: 'broad',
						},
					},
				],
			},
		});
	});

	it('adds several keywords in one request', async () => {
		respond({ data: [keyword, keyword] }, 201);

		await invoke(Keywords.add, {
			projectName: 'Disney',
			keywords: [
				{ kw: 'one', url: 'disney.com' },
				{ kw: 'two', url: 'disney.com' },
			],
		});

		const body = lastRequest().body as { data: unknown[] };
		expect(body.data).toHaveLength(2);
	});

	it.each([
		[{ projectName: 'Disney' }],
		[{ projectName: 'Disney', keywords: [] }],
		[{ projectName: 'Disney', keywords: [{ url: 'disney.com' }] }],
		[{ projectName: 'Disney', keywords: [{ kw: 'x' }] }],
		[
			{
				projectName: 'Disney',
				keywords: [{ kw: 'x', url: 'd.com', type: 'video' }],
			},
		],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Keywords.add, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.update', () => {
	it('PATCHes the changed attributes', async () => {
		respond({ data: keyword });

		await invoke(Keywords.update, {
			projectName: 'Disney',
			keywordId: '272678916',
			url: 'disney.com',
			tags: ['Brand', 'Priority'],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/groups/Disney/keywords/272678916',
			body: {
				data: {
					type: 'keyword',
					attributes: { url: 'disney.com', tags: ['Brand', 'Priority'] },
				},
			},
		});
	});

	it.each([
		[{ projectName: 'Disney', keywordId: '1' }],
		[{ projectName: 'Disney', keywordId: '1', status: 'DONE' }],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Keywords.update, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.delete', () => {
	it('DELETEs one keyword', async () => {
		respond({ meta: { title: 'Keyword deleted' } });

		await invoke(Keywords.remove, {
			projectName: 'Disney',
			keywordId: '272678916',
		});

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/groups/Disney/keywords/272678916',
		});
	});
});

describe('keywords.bulkDelete', () => {
	it('DELETEs by project ID with the keyword IDs in the body', async () => {
		respond(deleted);

		await expect(
			invoke(Keywords.bulkRemove, {
				projectId: 3057417,
				keywordIds: ['272678916', '272678917'],
			}),
		).resolves.toMatchObject({ meta: { title: 'Keywords have been deleted' } });
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v2/projects/3057417/keywords',
			body: {
				data: { type: 'keyword', ids: ['272678916', '272678917'] },
			},
		});
	});

	it('rejects an empty keyword list', async () => {
		await expect(
			invoke(Keywords.bulkRemove, { projectId: 3057417, keywordIds: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.bulkUpdate', () => {
	it('PATCHes many keywords in one project', async () => {
		respond({ meta: { title: 'Keywords updated' } });

		await invoke(Keywords.bulkUpdate, {
			projectId: 3057417,
			keywordIds: ['267540882'],
			changes: { url: 'dell.com', region: 'google.ca', language: 'en-ca' },
		});

		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: '/api/v2/projects/3057417/keywords',
			body: {
				data: {
					ids: ['267540882'],
					type: 'keyword',
					attributes: {
						url: 'dell.com',
						region: 'google.ca',
						language: 'en-ca',
					},
				},
			},
		});
	});

	it('rejects a change set with nothing in it', async () => {
		await expect(
			invoke(Keywords.bulkUpdate, {
				projectId: 3057417,
				keywordIds: ['1'],
				changes: {},
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('keywords.refresh', () => {
	it('POSTs the keyword IDs and returns the quota message', async () => {
		respond(refreshed);

		await expect(
			invoke(Keywords.refresh, { keywordIds: ['267540882', '267540883'] }),
		).resolves.toEqual({
			message: 'You have 3934 keyword refreshes left.',
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/keywords/refresh',
			body: { data: { keyword_ids: ['267540882', '267540883'] } },
		});
	});

	it('surfaces a refresh that would exceed the daily quota', async () => {
		respond(
			{
				errors: [
					{
						code: '403',
						title: 'Quota exceeded',
						message:
							'The refresh would exceed the plan’s daily on-demand refresh quota.',
					},
				],
			},
			403,
		);

		await expect(
			invoke(Keywords.refresh, { keywordIds: ['1'] }),
		).rejects.toMatchObject({ status: 403 });
	});
});

describe('metrics.get', () => {
	it('GETs the movement buckets for a project', async () => {
		respond(metrics);

		await expect(
			invoke(Ranking.metrics, { projectName: 'Disney', timeframe: 30 }),
		).resolves.toMatchObject({
			data: {
				attributes: { ranges: [{ title: 'Top 3' }, { title: 'Top 5' }] },
			},
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/groups/Disney/metrics',
			query: { timeframe: '30' },
		});
	});

	it('sends the tag filter', async () => {
		respond(metrics);

		await invoke(Ranking.metrics, { projectName: 'Disney', tagId: 27727 });

		expect(lastRequest().query).toEqual({ tagId: '27727' });
	});
});

describe('metrics.competitors', () => {
	it('GETs the competing URLs for one keyword', async () => {
		respond(competitors);

		await expect(
			invoke(Ranking.competitors, {
				projectName: 'Disney',
				keywordId: '272678916',
				dateRange: '2026-11-01.2026-11-12',
			}),
		).resolves.toMatchObject({
			data: [{ rank: 7, results: [{ resultType: 'organic' }] }],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/metrics/Disney/competitors/272678916/history',
			query: { dateRange: '2026-11-01.2026-11-12' },
		});
	});

	it.each([
		[{ projectName: 'Disney', keywordId: '1', dateRange: '2026-11-01' }],
		[{ projectName: 'Disney', keywordId: '1' }],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Ranking.competitors, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('rankChart.get', () => {
	it('POSTs the keyword IDs with the day range in the query', async () => {
		respond(rankChart);

		await expect(
			invoke(Ranking.rankChart, { keywordIds: ['272678916'], limit: 30 }),
		).resolves.toMatchObject({ data: [{ kwid: 196465030 }] });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/keywords/chart',
			query: { action: 'bulkChart', limit: '30' },
			body: { kwid: ['272678916'] },
		});
	});

	it('keeps a null rank, which means the keyword was not found that day', async () => {
		respond(rankChart);

		const result = (await invoke(Ranking.rankChart, {
			keywordIds: ['1'],
		})) as typeof rankChart;

		const points = result.data[0]?.data?.[0]?.[0]?.data ?? [];
		expect(points.at(-1)).toEqual(['2026-04-12', null]);
	});

	it('asks for more than 180 days, which Keyword allows', async () => {
		respond(rankChart);

		await invoke(Ranking.rankChart, { keywordIds: ['1'], limit: 365 });

		expect(lastRequest().query).toEqual({ action: 'bulkChart', limit: '365' });
	});

	it.each([[{}], [{ keywordIds: [] }], [{ keywordIds: ['1'], limit: 0 }]])(
		'rejects %j before calling Keyword',
		async (input) => {
			await expect(invoke(Ranking.rankChart, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('regions.list', () => {
	it('GETs the tracked regions', async () => {
		respond(regions);

		const result = (await invoke(Ranking.regions, {
			projectName: 'Disney',
		})) as typeof regions;

		expect(result.data[0]).toMatchObject({
			region: 'google.com',
			lang: 'en',
			total: 6,
		});
		expect(result.data.map(({ region }) => region)).toEqual([
			'google.com',
			'google.com.au',
			'google.es',
		]);
	});
});

describe('rankingUrls.list', () => {
	it('GETs the top-performing pages', async () => {
		respond(rankingUrls);

		await expect(
			invoke(Ranking.rankingUrls, { projectName: 'Disney' }),
		).resolves.toMatchObject({
			data: [
				{
					current_ranking_url: 'https://movies.disney.com/a-z',
					average_current_rank: 81,
				},
			],
		});
		expect(lastRequest().query).toEqual({});
	});

	it('asks for a later page', async () => {
		respond(rankingUrls);

		await invoke(Ranking.rankingUrls, { projectName: 'Disney', page: 2 });

		expect(lastRequest()).toMatchObject({
			path: '/api/v2/groups/Disney/keywords/ranking-urls',
			query: { page: '2' },
		});
	});
});

describe('mindshare', () => {
	it('GETs the latest Share of Voice', async () => {
		respond(mindshareLatest);

		await expect(
			invoke(Mindshare.latest, { projectName: 'Disney' }),
		).resolves.toMatchObject({
			data: [{ title: 'Tinker Bell', percentage: 28.85809668022449 }],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/metrics/Disney/mindshare/latest',
		});
	});

	it('GETs the history by project ID, keyed by date', async () => {
		respond(mindshareHistory);

		await expect(
			invoke(Mindshare.history, {
				projectId: 3057417,
				start_date: '2026-11-01',
				end_date: '2026-11-12',
			}),
		).resolves.toMatchObject({
			data: {
				latest: [{ url: 'en.wikipedia.org', domain_exist_in_project: false }],
				'2026-11-08': [{ percentage: 24.55 }],
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'keyword.mindshare.history',
			{ projectId: 3057417, points: 2 },
			'completed',
		);

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/projects/3057417/mindshare/from-cache',
			query: { start_date: '2026-11-01', end_date: '2026-11-12' },
		});
	});
});

describe('alerts.list', () => {
	it('GETs the alerts with the view type', async () => {
		respond(alerts);

		await expect(
			invoke(Account.list, {
				view_type: 'All alerts',
				page: 1,
				per_page: 100,
				sort_field: 'created_at',
				sort_direction: 'desc',
			}),
		).resolves.toMatchObject({ data: [{ attributes: { kw: 'Donald Duck' } }] });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/alerts',
		});
		expect(lastRequest().query).toEqual({
			view_type: 'All alerts',
			page: '1',
			per_page: '100',
			sort_field: 'created_at',
			sort_direction: 'desc',
		});
	});

	it('sends last as a boolean', async () => {
		respond(alerts);

		await invoke(Account.list, { last: false });

		expect(lastRequest().query).toEqual({ last: 'false' });
	});

	it.each([
		[{ view_type: 'Everything' }],
		[{ per_page: 101 }],
		[{ sort_direction: 'newest' }],
	])('rejects %j before calling Keyword', async (input) => {
		await expect(invoke(Account.list, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.get', () => {
	it('GETs the token’s own user without its API token', async () => {
		respond(account);

		const result = await invoke(Account.account, {});

		expect(result).toMatchObject({
			data: { attributes: { user_id: 252725, name: 'George' } },
		});
		expect(JSON.stringify(result)).not.toContain('ACCOUNT-API-TOKEN');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/users/self',
		});
	});

	it('asks for the subscription block', async () => {
		respond(account);

		await invoke(Account.account, { include: ['subscriptions'] });

		expect(lastRequest().query).toEqual({ include: 'subscriptions' });
	});
});

describe('error envelopes', () => {
	it('reads the message out of a 401', async () => {
		respond(unauthorized, 401);

		await expect(invoke(Projects.list, {})).rejects.toMatchObject({
			status: 401,
			code: '401',
			isAuthError: true,
			message: 'Keyword 401: Unauthenticated.',
			method: 'GET',
		});
	});

	it('reads a plan that is full as a quota error, not a rate limit', async () => {
		respond(quotaExceeded, 402);

		const error = await caught(
			invoke(Keywords.add, {
				projectName: 'Disney',
				keywords: [{ kw: 'x', url: 'd.com' }],
			}),
		);

		expect(error).toBeInstanceOf(KeywordAPIError);
		expect(error).toMatchObject({
			status: 402,
			isQuotaError: true,
			isRateLimit: false,
		});
	});

	it('reads a refused field', async () => {
		respond(unprocessable, 422);

		await expect(
			invoke(Keywords.add, {
				projectName: 'Disney',
				keywords: [{ kw: 'x', url: 'd.com' }],
			}),
		).rejects.toMatchObject({
			status: 422,
			message: 'Keyword 422: The url field is required.',
		});
	});

	it('keeps the key out of the error', async () => {
		respond(unauthorized, 401);

		const error = await caught(invoke(Projects.list, {}));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps no body on the error, so a project auth key cannot follow it into a log', async () => {
		respond(unprocessable, 422);

		const error = await caught(invoke(Projects.list, {}));

		expect(error).not.toHaveProperty('body');
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			invoke(Keywords.add, {
				projectName: 'Disney',
				keywords: [{ kw: 'x', url: 'd.com' }],
			}),
		).rejects.toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
	});
});
