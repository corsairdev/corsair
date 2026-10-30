import { logEventFromContext } from 'corsair/core';
import { makeTinyFishRawRequest, makeTinyFishRequest } from './client';
import {
	Agent,
	Browser,
	Fetch,
	Profiles,
	Research,
	Search,
	Vault,
	Wallet,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	TinyFishError: class TinyFishError extends Error {},
	makeTinyFishRequest: jest.fn(),
	makeTinyFishRawRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeTinyFishRequest);
const mockRawRequest = jest.mocked(makeTinyFishRawRequest);
const mockLog = jest.mocked(logEventFromContext);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Promise<unknown> is the shared return; each
// endpoint's output differs, so a stricter shared type is not practical.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

type TestContext = ReturnType<typeof createContext>;

function invoke(
	endpoint: AnyEndpoint,
	ctx: TestContext,
	// Negative tests pass values no schema accepts, so a stricter input is
	// not practical.
	input: unknown,
) {
	// The fake context is not TinyFishContext. A stricter argument type is
	// not practical at this boundary.
	return endpoint(ctx as never, input as never);
}

function createContext() {
	return {
		database: {},
		key: 'tf_key_test',
		options: {},
		db: {
			agentRuns: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
		},
	};
}

beforeEach(() => {
	mockRequest.mockReset().mockResolvedValue({});
	mockRawRequest.mockReset();
	mockLog.mockClear();
});

const searchResponse = {
	query: 'corsair',
	results: [],
	total_results: 0,
	page: 0,
};

const usagePage = {
	items: [],
	total: 0,
	limit: 20,
	page: 1,
	total_pages: 0,
	has_more: false,
};

const fetchResponse = { results: [], errors: [] };

const browserSession = {
	session_id: 'sess-1',
	cdp_url: 'wss://cdp.tinyfish.ai/sess-1',
	base_url: 'https://browser.tinyfish.ai/sess-1',
};

const runAccepted = { run_id: 'run-1', error: null };

const syncRun = {
	run_id: 'run-1',
	status: 'COMPLETED',
	started_at: null,
	finished_at: null,
	num_of_steps: 1,
	result: null,
	error: null,
};

const runSummary = {
	run_id: 'run-1',
	status: 'COMPLETED',
	goal: 'Get the title',
	created_at: '2026-01-02T00:00:00.000Z',
	started_at: null,
	finished_at: null,
	num_of_steps: 1,
	result: null,
	output_schema: null,
	profile_attached: false,
	profile_id: null,
	error: null,
	streaming_url: null,
	browser_config: null,
};

const agentRun = { ...runSummary, video_url: null, steps: [] };

const runtimeCancel = {
	run_id: 'run-1',
	status: 'CANCELLED',
	cancelled_at: null,
	message: null,
};

const researchRun = {
	research_run_id: 'rr-1',
	status: 'RUNNING',
	query: 'latest ai papers',
	quick_result: null,
	quick_result_summary: null,
	deep_result: null,
	run_ids: [],
	created_at: null,
	completed_at: null,
	error: null,
};

const profile = {
	id: 'p-1',
	name: 'Work',
	created_at: '2026-01-02T00:00:00.000Z',
};

const profileDetail = { ...profile, domains: [] };

const wallet = {
	available_balance: '12.50',
	currency: 'USD',
	as_of: '2026-01-02T00:00:00.000Z',
	auto_reload: null,
	pending_top_up: null,
	rates: null,
};

const cases: Array<{
	name: string;
	endpoint: AnyEndpoint;
	// Each row is a different endpoint input, including ones the schema must
	// reject, so a stricter input type is not practical.
	input: unknown;
	base: string;
	path: string;
	method: string;
	// Minimal body that passes the endpoint's output schema. Outputs differ
	// per row, so a stricter type is not practical.
	response?: unknown;
	// Raw-fetch endpoints bypass the JSON client; the table carries the
	// mocked transport payload and the endpoint's literal output instead.
	raw?: {
		accept: string;
		response: { contentType: string; bytes: Buffer };
		// Expected endpoint output. Shapes differ, so a stricter type is not
		// practical.
		result: unknown;
	};
}> = [
	{
		name: 'search.search',
		endpoint: Search.search,
		input: { query: 'corsair' },
		base: 'search',
		path: '/',
		method: 'GET',
		response: searchResponse,
	},
	{
		name: 'search.usage',
		endpoint: Search.usage,
		input: { limit: 10 },
		base: 'search',
		path: '/usage',
		method: 'GET',
		response: usagePage,
	},
	{
		name: 'fetch.fetch',
		endpoint: Fetch.fetch,
		input: { urls: ['https://example.com'] },
		base: 'fetch',
		path: '/',
		method: 'POST',
		response: fetchResponse,
	},
	{
		name: 'fetch.usage',
		endpoint: Fetch.usage,
		input: {},
		base: 'fetch',
		path: '/usage',
		method: 'GET',
		response: usagePage,
	},
	{
		name: 'browser.createSession',
		endpoint: Browser.createSession,
		input: { url: 'https://example.com' },
		base: 'browser',
		path: '/',
		method: 'POST',
		response: browserSession,
	},
	{
		name: 'browser.terminateSession',
		endpoint: Browser.terminateSession,
		input: { sessionId: 'sess-1' },
		base: 'browser',
		path: '/sess-1',
		method: 'DELETE',
	},
	{
		name: 'browser.usage',
		endpoint: Browser.usage,
		input: {},
		base: 'browser',
		path: '/usage',
		method: 'GET',
		response: usagePage,
	},
	{
		name: 'agent.run',
		endpoint: Agent.run,
		input: { url: 'https://example.com', goal: 'Get the title' },
		base: 'agent',
		path: '/v1/automation/run',
		method: 'POST',
		response: syncRun,
	},
	{
		name: 'agent.runAsync',
		endpoint: Agent.runAsync,
		input: { url: 'https://example.com', goal: 'Get the title' },
		base: 'agent',
		path: '/v1/automation/run-async',
		method: 'POST',
		response: runAccepted,
	},
	{
		name: 'agent.runBatch',
		endpoint: Agent.runBatch,
		input: { runs: [{ url: 'https://example.com', goal: 'Get the title' }] },
		base: 'agent',
		path: '/v1/automation/run-batch',
		method: 'POST',
		response: { run_ids: ['run-1'], error: null },
	},
	{
		name: 'agent.listRuns',
		endpoint: Agent.listRuns,
		input: {},
		base: 'agent',
		path: '/v1/runs',
		method: 'GET',
		response: {
			data: [],
			pagination: { total: 0, next_cursor: null, has_more: false },
		},
	},
	{
		name: 'agent.getRun',
		endpoint: Agent.getRun,
		input: { runId: 'run-1' },
		base: 'agent',
		path: '/v1/runs/run-1',
		method: 'GET',
		response: agentRun,
	},
	{
		name: 'agent.getRuns',
		endpoint: Agent.getRuns,
		input: { run_ids: ['run-1'] },
		base: 'agent',
		path: '/v1/runs/batch',
		method: 'POST',
		response: { data: [agentRun], not_found: null },
	},
	{
		name: 'agent.cancelRun',
		endpoint: Agent.cancelRun,
		input: { runId: 'run-1' },
		base: 'agent',
		path: '/v1/runs/run-1/cancel',
		method: 'POST',
		response: runtimeCancel,
	},
	{
		name: 'agent.cancelRuns',
		endpoint: Agent.cancelRuns,
		input: { run_ids: ['run-1'] },
		base: 'agent',
		path: '/v1/runs/batch/cancel',
		method: 'POST',
		response: { results: [runtimeCancel], not_found: null },
	},
	{
		name: 'agent.getStepScreenshot',
		endpoint: Agent.getStepScreenshot,
		input: { runId: 'run-1', stepId: 'evt_1' },
		base: 'agent',
		path: '/v1/runs/run-1/steps/evt_1/screenshot',
		method: 'GET',
		raw: {
			accept: 'image/jpeg',
			response: {
				contentType: 'image/jpeg',
				bytes: Buffer.from([0x89, 0x50, 0x4e, 0x47]),
			},
			result: {
				contentType: 'image/jpeg',
				base64: 'iVBORw==',
				sizeBytes: 4,
			},
		},
	},
	{
		name: 'agent.getStepHtml',
		endpoint: Agent.getStepHtml,
		input: { runId: 'run-1', stepId: 'evt_1' },
		base: 'agent',
		path: '/v1/runs/run-1/steps/evt_1/html',
		method: 'GET',
		raw: {
			accept: 'text/html',
			response: {
				contentType: 'text/html; charset=utf-8',
				bytes: Buffer.from('<html><body>hi</body></html>', 'utf8'),
			},
			result: {
				contentType: 'text/html; charset=utf-8',
				html: '<html><body>hi</body></html>',
			},
		},
	},
	{
		name: 'research.start',
		endpoint: Research.start,
		input: { query: 'latest ai papers' },
		base: 'agent',
		path: '/v1/automation/run-research-async',
		method: 'POST',
		response: { research_run_id: 'rr-1', error: null },
	},
	{
		name: 'research.list',
		endpoint: Research.list,
		input: {},
		base: 'agent',
		path: '/v1/research-run',
		method: 'GET',
		response: {
			data: [],
			pagination: { total: 0, next_cursor: null, has_more: false },
		},
	},
	{
		name: 'research.get',
		endpoint: Research.get,
		input: { researchRunId: 'rr-1' },
		base: 'agent',
		path: '/v1/research-run/rr-1',
		method: 'GET',
		response: researchRun,
	},
	{
		name: 'research.cancel',
		endpoint: Research.cancel,
		input: { researchRunId: 'rr-1' },
		base: 'agent',
		path: '/v1/research-run/rr-1/cancel',
		method: 'POST',
		response: {
			research_run_id: 'rr-1',
			status: 'CANCELLED',
			cancelled: true,
		},
	},
	{
		name: 'profiles.list',
		endpoint: Profiles.list,
		input: {},
		base: 'agent',
		path: '/v1/profiles',
		method: 'GET',
		response: { profiles: [] },
	},
	{
		name: 'profiles.create',
		endpoint: Profiles.create,
		input: { name: 'Work' },
		base: 'agent',
		path: '/v1/profiles',
		method: 'POST',
		response: profile,
	},
	{
		name: 'profiles.get',
		endpoint: Profiles.get,
		input: { profileId: 'p-1' },
		base: 'agent',
		path: '/v1/profiles/p-1',
		method: 'GET',
		response: profileDetail,
	},
	{
		name: 'profiles.update',
		endpoint: Profiles.update,
		input: { profileId: 'p-1', name: 'Work' },
		base: 'agent',
		path: '/v1/profiles/p-1',
		method: 'PATCH',
		response: profileDetail,
	},
	{
		name: 'profiles.delete',
		endpoint: Profiles.delete,
		input: { profileId: 'p-1' },
		base: 'agent',
		path: '/v1/profiles/p-1',
		method: 'DELETE',
		response: { deleted: true },
	},
	{
		name: 'wallet.get',
		endpoint: Wallet.get,
		input: {},
		base: 'agent',
		path: '/v1/wallet',
		method: 'GET',
		response: wallet,
	},
	{
		name: 'vault.list',
		endpoint: Vault.list,
		input: {},
		base: 'agent',
		path: '/v1/vault/items',
		method: 'GET',
		response: { items: [] },
	},
];

describe('tinyfish endpoint routing', () => {
	it.each(cases)(
		'$name calls $method $base:$path',
		async ({ endpoint, input, base, path, method, response, raw }) => {
			const ctx = createContext();
			// Raw endpoints return different envelopes, so a stricter result
			// type is not practical.
			let result: unknown;
			if (raw) {
				mockRawRequest.mockResolvedValueOnce(raw.response);
				result = await invoke(endpoint, ctx, input);
			} else {
				mockRequest.mockResolvedValueOnce(response ?? {});
				await invoke(endpoint, ctx, input);
			}

			if (raw) {
				expect(mockRequest).not.toHaveBeenCalled();
				expect(mockRawRequest).toHaveBeenCalledTimes(1);
				const [calledBase, calledPath, calledKey, accept] =
					mockRawRequest.mock.calls[0] ?? [];
				expect(calledBase).toBe(base);
				expect(calledPath).toBe(path);
				expect(calledKey).toBe('tf_key_test');
				expect(accept).toBe(raw.accept);
				expect(result).toEqual(raw.result);
				return;
			}

			expect(mockRawRequest).not.toHaveBeenCalled();
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [calledBase, calledPath, calledKey, options] =
				mockRequest.mock.calls[0] ?? [];
			expect(calledBase).toBe(base);
			expect(calledPath).toBe(path);
			expect(calledKey).toBe('tf_key_test');
			expect(options?.method ?? 'GET').toBe(method);
		},
	);

	it('search sends the filters as query parameters', async () => {
		mockRequest.mockResolvedValueOnce(searchResponse);
		const ctx = createContext();
		await invoke(Search.search, ctx, {
			query: 'due process',
			purpose: 'case research',
			domain_type: 'news',
			after_date: '2026-01-01',
			page: 2,
			include_thumbnail: 'true',
		});

		expect(mockRequest.mock.calls[0]?.[3]?.query).toEqual({
			query: 'due process',
			purpose: 'case research',
			domain_type: 'news',
			after_date: '2026-01-01',
			page: 2,
			include_thumbnail: 'true',
			location: undefined,
			language: undefined,
			include_domains: undefined,
			exclude_domains: undefined,
			before_date: undefined,
			recency_minutes: undefined,
			pub_year_min: undefined,
			pub_year_max: undefined,
			fetch: undefined,
		});
	});

	it('getRun encodes the run id and forwards artifact switches', async () => {
		mockRequest.mockResolvedValueOnce(agentRun);
		const ctx = createContext();
		await invoke(Agent.getRun, ctx, {
			runId: 'run/1',
			screenshots: 'base64',
			html: 'none',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toBe('/v1/runs/run%2F1');
		expect(mockRequest.mock.calls[0]?.[3]?.query).toEqual({
			screenshots: 'base64',
			html: 'none',
		});
	});

	it('getStepScreenshot rejects a non-image body instead of returning it', async () => {
		mockRawRequest.mockResolvedValueOnce({
			contentType: 'application/json',
			bytes: Buffer.from('{"error":{}}'),
		});
		const ctx = createContext();
		await expect(
			invoke(Agent.getStepScreenshot, ctx, {
				runId: 'run-1',
				stepId: 'evt_1',
			}),
		).rejects.toThrow('non-image response');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('getStepHtml rejects a non-html body instead of returning it', async () => {
		mockRawRequest.mockResolvedValueOnce({
			contentType: 'application/json',
			bytes: Buffer.from('{"error":{}}'),
		});
		const ctx = createContext();
		await expect(
			invoke(Agent.getStepHtml, ctx, {
				runId: 'run-1',
				stepId: 'evt_1',
			}),
		).rejects.toThrow('non-HTML response');
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('returns the provider run when saving it fails', async () => {
		mockRequest.mockResolvedValueOnce(syncRun);
		const ctx = createContext();
		ctx.db.agentRuns.upsertByEntityId.mockRejectedValueOnce(
			new Error('db down'),
		);
		jest.spyOn(console, 'error').mockImplementation(() => {});

		await expect(
			invoke(Agent.run, ctx, {
				url: 'https://example.com',
				goal: 'Get the title',
			}),
		).resolves.toEqual(syncRun);
		expect(console.error).toHaveBeenCalled();
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.agent.run',
			expect.objectContaining({ runId: 'run-1', status: 'COMPLETED' }),
			'completed',
		);
	});

	it('run stores the finished run with its goal', async () => {
		mockRequest.mockResolvedValueOnce(syncRun);
		const ctx = createContext();
		await invoke(Agent.run, ctx, {
			url: 'https://example.com',
			goal: 'Get the title',
		});

		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({
				status: 'COMPLETED',
				goal: 'Get the title',
				// Jest's asymmetric matcher. This is not a TypeScript any; a
				// stricter expected Date is not practical for a fresh timestamp.
				updatedAt: expect.any(Date),
			}),
		);
	});

	it('runAsync stores the queued run as PENDING', async () => {
		mockRequest.mockResolvedValueOnce(runAccepted);
		const ctx = createContext();
		await invoke(Agent.runAsync, ctx, {
			url: 'https://example.com',
			goal: 'Get the title',
		});

		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({ status: 'PENDING', goal: 'Get the title' }),
		);
	});

	it('getRun refreshes the stored row', async () => {
		mockRequest.mockResolvedValueOnce(agentRun);
		const ctx = createContext();
		await invoke(Agent.getRun, ctx, { runId: 'run-1' });

		expect(ctx.db.agentRuns.upsertByEntityId).toHaveBeenCalledWith(
			'run-1',
			expect.objectContaining({
				status: 'COMPLETED',
				createdAt: new Date('2026-01-02T00:00:00.000Z'),
			}),
		);
	});

	it('runAsync does not store a failed creation', async () => {
		mockRequest.mockResolvedValueOnce({
			run_id: null,
			error: { code: 'SITE_BLOCKED', message: 'Blocked' },
		});
		const ctx = createContext();
		await invoke(Agent.runAsync, ctx, {
			url: 'https://example.com',
			goal: 'x',
		});

		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('terminateSession turns the 204 into a local confirmation', async () => {
		const ctx = createContext();
		const result = await invoke(Browser.terminateSession, ctx, {
			sessionId: 'sess-1',
		});

		expect(result).toEqual({ terminated: true, session_id: 'sess-1' });
		expect(ctx.db.agentRuns.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('search logs the completed call with result counts', async () => {
		mockRequest.mockResolvedValueOnce({
			...searchResponse,
			results: [
				{
					position: 1,
					site_name: 'example.com',
					snippet: 's',
					title: 't',
					url: 'https://example.com',
				},
			],
			total_results: 1,
		});
		const ctx = createContext();
		await invoke(Search.search, ctx, { query: 'corsair' });

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'tinyfish.search.search',
			expect.objectContaining({ query: 'corsair', resultCount: 1 }),
			'completed',
		);
	});

	it('rejects an invalid input before any request is made', async () => {
		const ctx = createContext();
		await expect(invoke(Search.search, ctx, { query: '' })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects unknown input keys before any request is made', async () => {
		const ctx = createContext();
		await expect(
			invoke(Search.search, ctx, { query: 'x', oiseau: true }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty batch before any request is made', async () => {
		const ctx = createContext();
		await expect(invoke(Agent.runBatch, ctx, { runs: [] })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a malformed vendor response', async () => {
		const ctx = createContext();
		mockRequest.mockResolvedValueOnce({ items: 'lots' });
		await expect(invoke(Search.usage, ctx, {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});
});
