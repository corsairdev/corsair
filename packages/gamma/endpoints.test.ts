import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { GammaAPIError, gammaErrorInfo } from './client';
import { Gammas, Generations, Workspace } from './endpoints';
import {
	agentCompleted,
	agentFailed,
	agentNoCredits,
	agentStarted,
	analyticsForbidden,
	archived,
	completed,
	completedWithPages,
	concurrencyLimited,
	created,
	createdWithWarnings,
	deleted,
	editInProgress,
	exportCompleted,
	exportStarted,
	failed,
	folders,
	gamma,
	invalidKey,
	noCredits,
	pending,
	searchResults,
	serviceBusy,
	themes,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'gamma-test-key';

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
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
	expect(sent.origin).toBe('https://public-api.gamma.app');
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
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

describe('generations.create', () => {
	it('POSTs an inputText generation and returns the ID', async () => {
		respond(created);

		await expect(
			invoke(Generations.create, {
				inputText: 'Create a presentation about renewable energy',
				textMode: 'generate',
			}),
		).resolves.toEqual(created);
		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1.0/generations',
			body: {
				inputText: 'Create a presentation about renewable energy',
				textMode: 'generate',
			},
		});
	});

	it('sends the theme, cards, export and sharing options', async () => {
		respond(created);

		await invoke(Generations.create, {
			inputText: 'Quarterly review',
			format: 'presentation',
			numCards: 12,
			themeId: 'thm_1',
			exportAs: 'pptx',
			cardOptions: { dimensions: '16x9' },
			textOptions: { amount: 'detailed', language: 'en', tone: 'formal' },
			sharingOptions: { externalAccess: 'view' },
		});

		expect(lastRequest().body).toMatchObject({
			format: 'presentation',
			numCards: 12,
			themeId: 'thm_1',
			exportAs: 'pptx',
			cardOptions: { dimensions: '16x9' },
			textOptions: { amount: 'detailed', language: 'en', tone: 'formal' },
			sharingOptions: { externalAccess: 'view' },
		});
	});

	it('accepts a pages array for a multi-page gamma', async () => {
		respond(createdWithWarnings);

		const result = (await invoke(Generations.create, {
			pages: [
				{ inputText: 'Page one', title: 'Intro' },
				{ inputText: 'Page two', path: 'details' },
			],
			publish: true,
		})) as typeof createdWithWarnings;

		expect(lastRequest().body).toMatchObject({
			pages: [
				{ inputText: 'Page one', title: 'Intro' },
				{ inputText: 'Page two', path: 'details' },
			],
			publish: true,
		});
		// A warning means Gamma ignored part of the request.
		expect(result.warnings).toBe('sharingOptions was ignored');
		expect(result.pageWarnings).toEqual([null, 'page 2 had no title']);
	});

	it('logs the generation and page count, never the prompt', async () => {
		respond(created);

		await invoke(Generations.create, {
			inputText: 'Confidential merger plan for Acme',
			textMode: 'preserve',
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gamma.generations.create',
			{ generationId: 'gen_abc123', pages: 1, warnings: 0 },
			'completed',
		);
		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('Confidential');
		}
	});

	it.each([
		[{}],
		[{ inputText: 'x', pages: [{ inputText: 'y' }] }],
		[{ inputText: '' }],
		[{ inputText: 'x', publish: true }],
		[{ pages: [] }],
		[{ inputText: 'x', format: 'video' }],
		[{ inputText: 'x', exportAs: 'docx' }],
		[
			{
				pages: Array.from({ length: 51 }, () => ({ inputText: 'a' })),
			},
		],
		[{ inputText: 'x', cardOptions: { dimensions: '11x17' } }],
	])('rejects %j before calling Gamma', async (input) => {
		await expect(invoke(Generations.create, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('generations.get', () => {
	it('reads a pending job', async () => {
		respond(pending);

		await expect(
			invoke(Generations.get, { generationId: 'gen_abc123' }),
		).resolves.toMatchObject({ status: 'pending' });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/generations/gen_abc123',
		});
	});

	it('reads a completed job with its gamma and export URL', async () => {
		respond(completed);

		const result = (await invoke(Generations.get, {
			generationId: 'gen_abc123',
		})) as typeof completed;

		expect(result.gammaId).toBe('gam_xyz789');
		expect(result.exportUrl).toBe(
			'https://gamma.app/exports/secret-token/file.pdf',
		);
		expect(result.credits).toEqual({ deducted: 40, remaining: 960 });
	});

	it('never logs the export URL, which works for anyone holding it', async () => {
		respond(completed);

		await invoke(Generations.get, { generationId: 'gen_abc123' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gamma.generations.get',
			{
				status: 'completed',
				gammaId: 'gam_xyz789',
				exported: 1,
				credits: 40,
			},
			'completed',
		);
		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('secret-token');
		}
	});

	it('keeps the per-page results of a multi-page generation', async () => {
		respond(completedWithPages);

		const result = (await invoke(Generations.get, {
			generationId: 'gen_abc123',
		})) as typeof completedWithPages;

		expect(result.pages).toHaveLength(2);
		expect(result.pages[1]?.gammaId).toBe('gam_p2');
	});

	it('surfaces a failed generation with its error', async () => {
		respond(failed);

		await expect(
			invoke(Generations.get, { generationId: 'gen_abc123' }),
		).resolves.toMatchObject({
			status: 'failed',
			error: { message: 'The input text was rejected' },
		});
	});

	it('encodes the ID into one path segment', async () => {
		respond(pending);

		await invoke(Generations.get, { generationId: '../../v1.0/themes' });

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toBe(
			'https://public-api.gamma.app/v1.0/generations/..%2F..%2Fv1.0%2Fthemes',
		);
	});

	it.each([[{}], [{ generationId: '' }]])(
		'rejects %j before calling Gamma',
		async (input) => {
			await expect(invoke(Generations.get, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
});

describe('agent.generate', () => {
	it('POSTs a prompt-only brief', async () => {
		respond(agentStarted, 202);

		await expect(
			invoke(Generations.agentCreate, { prompt: 'A deck about solar power' }),
		).resolves.toMatchObject({ generationId: 'gen_agent1' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1.0/agent/generations',
			body: { prompt: 'A deck about solar power' },
		});
	});

	it('sends the source URLs, quality and template', async () => {
		respond(agentStarted, 202);

		await invoke(Generations.agentCreate, {
			prompt: 'Summarise these',
			sourceUrls: ['https://acme.example/report', 'https://acme.example/data'],
			quality: 'max',
			templateId: 'tpl_1',
			disableConnectors: true,
		});

		expect(lastRequest().body).toMatchObject({
			sourceUrls: ['https://acme.example/report', 'https://acme.example/data'],
			quality: 'max',
			templateId: 'tpl_1',
			disableConnectors: true,
		});
	});

	it('never logs the prompt', async () => {
		respond(agentStarted, 202);

		await invoke(Generations.agentCreate, {
			prompt: 'Internal reorg announcement',
		});

		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('Internal reorg');
		}
	});

	it.each([
		[{}],
		[{ prompt: '' }],
		[{ prompt: 'x', quality: 'ultra' }],
		// The agent makes presentations, documents and social posts; a webpage
		// is Classic only.
		[{ prompt: 'x', format: 'webpage' }],
		[{ prompt: 'x', sourceUrls: ['not-a-url'] }],
		[
			{
				prompt: 'x',
				sourceUrls: Array.from(
					{ length: 11 },
					(_, i) => `https://a.example/${i}`,
				),
			},
		],
	])('rejects %j before calling Gamma', async (input) => {
		await expect(invoke(Generations.agentCreate, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a 202 without the generationId it needs to poll', async () => {
		respond({ status: 'pending', warnings: [] }, 202);

		await expect(
			invoke(Generations.agentCreate, { prompt: 'x' }),
		).rejects.toThrow();
	});

	it('keeps the warnings Gamma returns on create', async () => {
		respond(
			{
				...agentStarted,
				warnings: [{ code: 'ignored_folder_id', message: 'Folder ignored' }],
			},
			202,
		);

		await expect(
			invoke(Generations.agentCreate, { prompt: 'x', folderId: 'fld_9' }),
		).resolves.toMatchObject({
			warnings: [{ code: 'ignored_folder_id' }],
		});
	});
});

describe('agent.get', () => {
	it('reads the agent status with the gamma nested under `gamma`', async () => {
		respond(agentCompleted);

		await expect(
			invoke(Generations.agentGet, { generationId: 'gen_agent1' }),
		).resolves.toMatchObject({
			status: 'completed',
			gamma: {
				gammaId: 'gam_agent1',
				gammaUrl: 'https://gamma.app/docs/agent1',
			},
			result: { summary: 'A five-card deck on solar power.' },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/agent/generations/gen_agent1',
		});
	});

	it('logs the gamma ID from the nested object', async () => {
		respond(agentCompleted);

		await invoke(Generations.agentGet, { generationId: 'gen_agent1' });

		expect(mockLog.mock.calls.at(-1)?.[2]).toMatchObject({
			gammaId: 'gam_agent1',
		});
	});

	it('keeps the reason of a failed agent run', async () => {
		respond(agentFailed);

		await expect(
			invoke(Generations.agentGet, { generationId: 'gen_agent1' }),
		).resolves.toMatchObject({
			status: 'failed',
			error: { reason: 'insufficient_credits' },
		});
	});
});

describe('gammas.get', () => {
	it('reads one gamma with its author, theme and folder', async () => {
		respond(gamma);

		await expect(
			invoke(Gammas.get, { gammaId: 'gam_xyz789' }),
		).resolves.toMatchObject({
			id: 'gam_xyz789',
			author: { name: 'Priya Raman' },
			themeId: 'thm_1',
			folderId: 'fld_1',
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/gammas/gam_xyz789',
		});
	});
});

describe('gammas.search', () => {
	it('GETs the hits with the query and filters', async () => {
		respond(searchResults);

		await expect(
			invoke(Gammas.search, {
				q: 'renewable',
				includeArchived: true,
				limit: 10,
			}),
		).resolves.toMatchObject({
			hits: [{ id: 'gam_xyz789', highlight: expect.any(String) }],
		});
		expect(lastRequest().query).toEqual({
			q: 'renewable',
			includeArchived: 'true',
			limit: '10',
		});
	});

	it('searches by a filter alone, with no query', async () => {
		respond(searchResults);

		await invoke(Gammas.search, { createdBy: 'me' });

		expect(lastRequest().query).toEqual({ createdBy: 'me' });
	});

	// Gamma takes no `q` only when a filter narrows the search, and caps
	// `limit` at 25.
	it.each([
		[{}],
		[{ includeArchived: true, limit: 10 }],
		[{ q: 'x', limit: 26 }],
	])('rejects %j before calling Gamma', async (input) => {
		await expect(invoke(Gammas.search, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('gammas.archive', () => {
	it('POSTs the archive and reports what Gamma confirmed', async () => {
		respond(archived);

		await expect(
			invoke(Gammas.archive, { gammaId: 'gam_xyz789' }),
		).resolves.toEqual({ success: true, gamma_id: 'gam_xyz789' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1.0/gammas/gam_xyz789/archive',
		});
	});

	it('does not report an archive Gamma did not confirm', async () => {
		respond({ gammaId: 'gam_xyz789', archived: false });

		await expect(
			invoke(Gammas.archive, { gammaId: 'gam_xyz789' }),
		).rejects.toThrow();
	});

	it('surfaces a web app slug sent where a file ID belongs', async () => {
		respond(analyticsForbidden, 403);

		const error = await caught(
			invoke(Gammas.archive, { gammaId: 'my-deck-slug' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(gammaErrorInfo(error)).toMatchObject({
			status: 403,
			code: 'individual_analytics_required',
			isPermissionError: true,
		});
	});

	// R8: a malformed reply is not turned into a made-up success.
	it.each([
		[{ archived: true }],
		[{ gammaId: '', archived: true }],
		[{ gammaId: 7, archived: true }],
	])(
		'does not report an archive whose reply carries no gamma ID: %j',
		async (body) => {
			respond(body);

			await expect(
				invoke(Gammas.archive, { gammaId: 'gam_xyz789' }),
			).rejects.toThrow();
		},
	);
});

describe('gammas.delete', () => {
	it('DELETEs the gamma', async () => {
		respond(deleted);

		await expect(
			invoke(Gammas.remove, { gammaId: 'gam_xyz789' }),
		).resolves.toMatchObject({ status: 'deleted', gammaId: 'gam_xyz789' });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1.0/gammas/gam_xyz789',
		});
	});
});

describe('exports', () => {
	it('starts an export and returns its ID', async () => {
		respond(exportStarted);

		await expect(
			invoke(Gammas.exportGamma, { gammaId: 'gam_xyz789', format: 'pptx' }),
		).resolves.toMatchObject({ exportId: 'exp_1' });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1.0/gammas/gam_xyz789/export',
			// Gamma's body field is `exportAs`, and it is required.
			body: { exportAs: 'pptx' },
		});
	});

	it('reads a completed export with its download link', async () => {
		respond(exportCompleted);

		await expect(
			invoke(Gammas.exportStatus, { exportId: 'exp_1' }),
		).resolves.toMatchObject({ status: 'completed' });
	});

	it('never logs the download link', async () => {
		respond(exportCompleted);

		await invoke(Gammas.exportStatus, { exportId: 'exp_1' });

		const payloads = mockLog.mock.calls.map((call) => JSON.stringify(call[2]));
		for (const payload of payloads) {
			expect(payload).not.toContain('secret-token');
		}
	});

	it.each([
		[{ gammaId: 'gam', format: 'docx' }],
		[{ format: 'pdf' }],
		[{ gammaId: 'gam' }],
	])('rejects %j before calling Gamma', async (input) => {
		await expect(invoke(Gammas.exportGamma, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('workspace', () => {
	it('lists the themes with the cursor', async () => {
		respond(themes);

		await expect(
			invoke(Workspace.themes, { type: 'standard', limit: 10 }),
		).resolves.toMatchObject({
			data: [{ id: 'thm_1' }, { id: 'thm_2' }],
			hasMore: false,
			nextCursor: null,
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/themes',
			query: { type: 'standard', limit: '10' },
		});
	});

	// Gamma filters themes by `standard` or `custom` and pages at most 50.
	it.each([[{ type: 'official' }], [{ type: 'all' }], [{ limit: 51 }]])(
		'rejects the theme filter %j before calling Gamma',
		async (input) => {
			await expect(invoke(Workspace.themes, input)).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('lists the folders', async () => {
		respond(folders);

		const result = (await invoke(Workspace.folders, {})) as typeof folders;

		expect(result.data[1]?.name).toBe('Q4');
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1.0/folders',
		});
	});
});

describe('error envelopes', () => {
	it('reads the message out of a 401', async () => {
		respond(invalidKey, 401);

		const error = await caught(invoke(Gammas.get, { gammaId: 'gam' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 401,
			message: 'Gamma 401: Invalid API key.',
			request: { method: 'GET' },
		});
		expect(gammaErrorInfo(error)).toMatchObject({
			isAuthError: true,
			method: 'GET',
		});
	});

	it('reads a spent workspace as a quota error, not a rate limit', async () => {
		respond(noCredits, 402);

		const error = await caught(invoke(Generations.create, { inputText: 'x' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(gammaErrorInfo(error)).toMatchObject({
			status: 402,
			isQuotaError: true,
			isRateLimit: false,
		});
	});

	it('reads an agent route out of credits as a quota error, not a permission one', async () => {
		respond(agentNoCredits, 403);

		const error = await caught(
			invoke(Generations.agentCreate, { prompt: 'x' }),
		);

		expect(gammaErrorInfo(error)).toMatchObject({
			status: 403,
			code: 'insufficient_credits',
			isQuotaError: true,
			isPermissionError: false,
		});
	});

	it('keeps the code on a 429, which covers in-flight jobs as well as rate', async () => {
		respond(concurrencyLimited, 429);

		const error = await caught(invoke(Generations.create, { inputText: 'x' }));

		expect(error).toBeInstanceOf(ApiError);
		expect(gammaErrorInfo(error)).toMatchObject({
			status: 429,
			code: 'workspace_concurrency_limit_exceeded',
			isRateLimit: true,
		});
	});

	it('reads an edit already in progress as a conflict', async () => {
		respond(editInProgress, 409);

		const error = await caught(invoke(Generations.create, { inputText: 'x' }));

		expect(gammaErrorInfo(error)).toMatchObject({
			status: 409,
			code: 'edit_in_progress',
			isConflict: true,
		});
	});

	it('reads a 503 as the service being busy', async () => {
		respond(serviceBusy, 503);

		const error = await caught(
			invoke(Generations.agentCreate, { prompt: 'x' }),
		);

		expect(gammaErrorInfo(error)).toMatchObject({
			status: 503,
			isServiceBusy: true,
		});
	});

	it('keeps the key out of the error', async () => {
		respond(invalidKey, 401);

		const error = await caught(invoke(Gammas.get, { gammaId: 'gam' }));

		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(String(error)).not.toContain(API_KEY);
	});

	it('keeps the prompt off the error, so it cannot follow the error into a log', async () => {
		respond(noCredits, 402);

		const error = await caught(
			invoke(Generations.create, { inputText: 'secret quarterly numbers' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(JSON.stringify(error)).not.toContain('secret quarterly numbers');
		expect((error as ApiError).request.body).toBeUndefined();
		// Only Gamma's error envelope stays on the body.
		expect((error as ApiError).body).toEqual({
			message: 'Insufficient credits remaining',
			statusCode: 402,
		});
	});

	it('keeps a search query off the error', async () => {
		respond(serviceBusy, 503);

		const error = await caught(
			invoke(Gammas.search, { q: 'acme layoffs plan' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(JSON.stringify(error)).not.toContain('layoffs');
		expect((error as ApiError).url).not.toContain('layoffs');
		expect((error as ApiError).request.query).toBeUndefined();
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await caught(invoke(Generations.create, { inputText: 'x' }));

		expect(error).toBeInstanceOf(GammaAPIError);
		expect(error).toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
	});
});
