import { logEventFromContext } from 'corsair/core';
import {
	Cohorts,
	Events,
	Export,
	Funnels,
	Insights,
	Profiles,
	Retention,
} from './endpoints';
import { parseExportLines } from './endpoints/types';
import {
	cohort,
	engageFailedBody,
	engageResponse,
	exportedEventLine,
	funnelsList,
	importOk,
	insightsResponse,
	retentionResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sa-user:sa-secret';

const ctx = {
	key: API_KEY,
	options: { region: 'us' as const, projectId: 3141592 },
	keys: { get_project_id: jest.fn().mockResolvedValue('3141592') },
};

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read.
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or JSONL text.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	const payload = typeof body === 'string' ? body : JSON.stringify(body);
	fetchMock.mockResolvedValueOnce(
		new Response(payload, {
			status,
			headers: { 'Content-Type': contentType },
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
		rawBody: init.body ? String(init.body) : undefined,
	};
}

// unknown: the success body was JSON-parsed by the client, so a test that
// asserts on the request body narrows the type itself.
function bodyAsJson(): unknown {
	const { rawBody } = lastRequest();
	return rawBody === undefined ? undefined : JSON.parse(rawBody);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('events.import', () => {
	const event = {
		event: 'Signed up',
		properties: {
			time: 1618716477000,
			distinct_id: '91304156-cafc-4673-a237-623d1129c801',
			$insert_id: '29fc2962-6d9c-455d-95ad-95b84f09b9e4',
			'Referred by': 'Friend',
		},
	};

	it('POSTs the batch to the ingestion host with strict and the project id', async () => {
		respond(importOk);

		const result = await invoke(Events.importEvents, { events: [event] });

		expect(lastRequest()).toMatchObject({
			origin: 'https://api.mixpanel.com',
			method: 'POST',
			path: '/import',
			query: { strict: '1', project_id: '3141592' },
		});
		expect(new Headers(lastRequest().headers).get('authorization')).toBe(
			`Basic ${API_KEY}`,
		);
		expect(bodyAsJson()).toEqual([event]);
		expect(result).toEqual(importOk);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mixpanel.events.import',
			{ imported: 2 },
			'completed',
		);
	});

	it('sends strict=0 when asked and keeps unknown event properties', async () => {
		respond(importOk);

		await invoke(Events.importEvents, {
			strict: '0',
			events: [
				{ ...event, properties: { ...event.properties, brand_new: 'kept' } },
			],
		});

		expect(lastRequest().query.strict).toBe('0');
		expect(bodyAsJson()).toEqual([
			{ ...event, properties: { ...event.properties, brand_new: 'kept' } },
		]);
	});

	it.each([
		['an empty batch', { events: [] }],
		['more than 2000 events', { events: Array(2001).fill(event) }],
		['a batch with a duplicate $insert_id', { events: [event, event] }],
		[
			'an event without $insert_id',
			{
				events: [
					{
						event: 'Signed up',
						properties: { time: 1618716477000, distinct_id: 'user-1' },
					},
				],
			},
		],
		[
			'a disallowed distinct_id',
			{
				events: [
					{
						event: 'Signed up',
						properties: {
							time: 1,
							distinct_id: 'anonymous',
							$insert_id: 'abc',
						},
					},
				],
			},
		],
		[
			'an $insert_id with invalid characters',
			{
				events: [
					{
						event: 'Signed up',
						properties: {
							time: 1,
							distinct_id: 'user-1',
							$insert_id: 'not ok!',
						},
					},
				],
			},
		],
	])('rejects %s before sending', async (_name, input) => {
		await expect(invoke(Events.importEvents, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('profiles.query', () => {
	it('POSTs the engage form with JSON-encoded arrays and the project id', async () => {
		respond(engageResponse);

		const result = await invoke(Profiles.query, {
			where: 'properties["$email"] == "jordan@example.com"',
			output_properties: ['$email', '$last_seen'],
		});

		const sent = lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://mixpanel.com',
			method: 'POST',
			path: '/api/query/engage',
			query: { project_id: '3141592' },
		});
		const form = new URLSearchParams(sent.rawBody);
		expect(form.get('where')).toBe(
			'properties["$email"] == "jordan@example.com"',
		);
		expect(form.get('output_properties')).toBe('["$email","$last_seen"]');
		expect(result).toEqual({ ...engageResponse, next_page: null });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mixpanel.profiles.query',
			{ profiles: 1 },
			'completed',
		);
	});

	it('encodes the cohort filter object and pages with the session id', async () => {
		respond({ ...engageResponse, page: 1 });

		await invoke(Profiles.query, {
			filter_by_cohort: 1000,
			session_id: engageResponse.session_id,
			page: 1,
			include_all_users: false,
		});

		const form = new URLSearchParams(lastRequest().rawBody);
		expect(form.get('filter_by_cohort')).toBe('{"id":1000}');
		expect(form.get('session_id')).toBe('1774390200-EXAMPL');
		expect(form.get('page')).toBe('1');
		expect(form.get('include_all_users')).toBe('false');
	});

	it('derives next_page while the page comes back full', async () => {
		respond({
			...engageResponse,
			results: Array(1000).fill(engageResponse.results[0]),
		});

		const result = await invoke(Profiles.query, {});

		expect(result).toMatchObject({ next_page: 1 });
	});

	it('rejects a page above 0 without a session_id', async () => {
		await expect(invoke(Profiles.query, { page: 2 })).rejects.toThrow(
			'session_id',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects behaviors together with filter_by_cohort', async () => {
		await expect(
			invoke(Profiles.query, { behaviors: 1, filter_by_cohort: 1000 }),
		).rejects.toThrow('mutually exclusive');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails a 200 body that says error', async () => {
		respond(engageFailedBody);

		await expect(invoke(Profiles.query, {})).rejects.toThrow(
			'Invalid selector',
		);
	});
});

describe('cohorts.list', () => {
	it('POSTs to the query host and wraps the bare array', async () => {
		respond([cohort]);

		const result = await invoke(Cohorts.list, {});

		expect(lastRequest()).toMatchObject({
			origin: 'https://mixpanel.com',
			method: 'POST',
			path: '/api/query/cohorts/list',
			query: { project_id: '3141592' },
		});
		expect(lastRequest().rawBody).toBeUndefined();
		expect(result).toEqual({ cohorts: [cohort] });
	});

	it('sends the workspace id when given', async () => {
		respond([cohort]);

		await invoke(Cohorts.list, { workspace_id: 7 });

		expect(lastRequest().query).toEqual({
			project_id: '3141592',
			workspace_id: '7',
		});
	});
});

describe('insights.query', () => {
	it('GETs the saved report by bookmark id', async () => {
		respond(insightsResponse);

		const result = await invoke(Insights.query, { bookmark_id: 12345 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/query/insights',
			query: { bookmark_id: '12345', project_id: '3141592' },
		});
		expect(result).toEqual(insightsResponse);
	});

	it('requires the bookmark id', async () => {
		await expect(invoke(Insights.query, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('keeps a series shape it does not know', async () => {
		respond({
			computed_at: '2026-04-21T16:35:41.252314+00:00',
			headers: ['$event', '$city'],
			series: { 'Logged in': { breakdown: { Berlin: 5 } } },
		});

		await expect(
			invoke(Insights.query, { bookmark_id: 12345 }),
		).resolves.toMatchObject({
			series: { 'Logged in': { breakdown: { Berlin: 5 } } },
		});
	});
});

describe('funnels.list', () => {
	it('GETs the funnel list and wraps the bare array', async () => {
		respond(funnelsList);

		const result = await invoke(Funnels.list, {});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/query/funnels/list',
			query: { project_id: '3141592' },
		});
		expect(result).toEqual({ funnels: funnelsList });
	});
});

describe('retention.query', () => {
	it('GETs retention with the date range and born event', async () => {
		respond(retentionResponse);

		const result = await invoke(Retention.query, {
			from_date: '2026-04-01',
			to_date: '2026-04-03',
			born_event: 'Signed up',
			event: 'Viewed report',
			unit: 'week',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/query/retention',
			query: {
				from_date: '2026-04-01',
				to_date: '2026-04-03',
				born_event: 'Signed up',
				event: 'Viewed report',
				unit: 'week',
				project_id: '3141592',
			},
		});
		expect(result).toEqual(retentionResponse);
	});

	it.each([
		[
			'a malformed date',
			{ from_date: '04/2026/01', to_date: '2026-04-03', born_event: 'x' },
		],
		[
			'birth retention without a born event',
			{ from_date: '2026-04-01', to_date: '2026-04-03' },
		],
		[
			'an interval above 90 days',
			{
				from_date: '2026-04-01',
				to_date: '2026-04-03',
				born_event: 'x',
				interval: 91,
			},
		],
		[
			'an unknown retention_type',
			{
				from_date: '2026-04-01',
				to_date: '2026-04-03',
				born_event: 'x',
				retention_type: 'weekly',
			},
		],
	])('rejects %s before sending', async (_name, input) => {
		await expect(invoke(Retention.query, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('allows an interval above 90 in weeks', async () => {
		respond(retentionResponse);

		await expect(
			invoke(Retention.query, {
				from_date: '2026-04-01',
				to_date: '2026-04-03',
				born_event: 'Signed up',
				unit: 'week',
				interval: 120,
			}),
		).resolves.toBeDefined();
	});
});

describe('export.events', () => {
	it('GETs the export host and parses the JSONL body', async () => {
		respond(`${exportedEventLine}\n${exportedEventLine}`, 200, 'text/plain');

		const result = await invoke(Export.events, {
			from_date: '2026-04-01',
			to_date: '2026-04-02',
			event_names: ['Signed up', 'Purchase'],
			limit: 100,
			time_in_ms: true,
		});

		expect(lastRequest()).toMatchObject({
			origin: 'https://data.mixpanel.com',
			method: 'GET',
			path: '/api/2.0/export',
			query: {
				from_date: '2026-04-01',
				to_date: '2026-04-02',
				event: '["Signed up","Purchase"]',
				limit: '100',
				time_in_ms: 'true',
				project_id: '3141592',
			},
		});
		expect(result).toEqual({
			events: [JSON.parse(exportedEventLine), JSON.parse(exportedEventLine)],
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mixpanel.export.events',
			{ fromDate: '2026-04-01', toDate: '2026-04-02', events: 2 },
			'completed',
		);
	});

	it('treats an empty body as an empty page', async () => {
		respond('', 200, 'text/plain');

		await expect(
			invoke(Export.events, { from_date: '2026-04-01', to_date: '2026-04-02' }),
		).resolves.toEqual({ events: [] });
	});

	it.each([
		[
			'a limit above 100000',
			{ from_date: '2026-04-01', to_date: '2026-04-02', limit: 100001 },
		],
		['an inverted range', { from_date: '2026-04-03', to_date: '2026-04-01' }],
	])('rejects %s before sending', async (_name, input) => {
		await expect(invoke(Export.events, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('parseExportLines', () => {
	it('throws on a malformed line instead of returning a partial page', () => {
		const html = '<html>not found</html>';
		expect(() => parseExportLines(html)).toThrow(/not valid JSON/);
	});

	it('throws when the body is not text', () => {
		expect(() => parseExportLines({ object: 'body' })).toThrow(
			/expected newline-delimited JSON/,
		);
	});
});
