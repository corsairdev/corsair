import { logEventFromContext } from 'corsair/core';
import { Agent, Extractor, Scrapers } from './endpoints';
import {
	agentScraperReady,
	agentTaskCompleted,
	agentTaskPending,
	agentTaskStopped,
	asyncRunCompleted,
	asyncRunQueued,
	createdScraper,
	deferredRun,
	deleteMessage,
	extractionResult,
	extractorScraper,
	syncRunResult,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'prs-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: each endpoint returns its own output type, so the shared return
// has no narrower type.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: decodeURIComponent(parsed.pathname),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body === undefined ? undefined : String(init.body),
	};
}

function expectAuthenticated(path: string, method = 'POST') {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.parsera.org');
	expect(sent.path).toBe(path);
	expect(sent.method).toBe(method);
	expect(sent.headers.get('x-api-key')).toBe(API_KEY);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('extractor', () => {
	it('extract POSTs the attributes payload', async () => {
		respond(extractionResult);
		await invoke(Extractor.extract, {
			url: 'https://news.ycombinator.com/',
			attributes: [
				{ name: 'title', description: 'News title' },
				{ name: 'points', description: 'Number of points' },
			],
			proxy_country: 'Germany',
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/extractor/extract');
		expect(JSON.parse(sent.body as string)).toEqual({
			url: 'https://news.ycombinator.com/',
			attributes: [
				{ name: 'title', description: 'News title' },
				{ name: 'points', description: 'Number of points' },
			],
			proxy_country: 'Germany',
		});
	});

	it('parse POSTs the content payload', async () => {
		respond(extractionResult);
		await invoke(Extractor.parse, {
			content: '<h1>Hello</h1>',
			prompt: 'Extract the heading',
			attributes: [{ name: 'heading', description: 'The heading' }],
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/extractor/parse');
		expect(JSON.parse(sent.body as string)).toEqual({
			content: '<h1>Hello</h1>',
			prompt: 'Extract the heading',
			attributes: [{ name: 'heading', description: 'The heading' }],
		});
	});

	it('createScraper POSTs no body', async () => {
		respond(createdScraper, 200);
		await invoke(Extractor.createScraper, {});
		expectAuthenticated('/v1/extractor/new');
		expect(lastRequest().body).toBeUndefined();
	});

	it('getScraper GETs the scraper', async () => {
		respond(extractorScraper);
		await invoke(Extractor.getScraper, { scraperId: 'abc123' });
		expectAuthenticated('/v1/extractor/abc123', 'GET');
	});

	it('deleteScraper DELETEs the scraper', async () => {
		respond(deleteMessage);
		const result = (await invoke(Extractor.deleteScraper, {
			scraperId: 'abc123',
		})) as { message: string };
		expect(result.message).toBe('Scraper deleted successfully.');
		expectAuthenticated('/v1/extractor/abc123', 'DELETE');
	});
});

describe('agent', () => {
	it('extract POSTs the agent payload', async () => {
		respond(agentTaskPending, 202);
		await invoke(Agent.extract, {
			url: 'https://news.ycombinator.com/',
			prompt: 'Extract the top 10 news titles',
			callback_url: 'https://example.com/callback',
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/agent/extract');
		expect(JSON.parse(sent.body as string)).toEqual({
			url: 'https://news.ycombinator.com/',
			prompt: 'Extract the top 10 news titles',
			callback_url: 'https://example.com/callback',
		});
	});

	it('getTask redacts URL credentials in a failed task error (seen live)', async () => {
		respond({
			task_id: 'agent-ext-1',
			status: 'failed',
			error:
				'connect_over_cdp: WebSocket error: wss://made-up-user:made-up-pass@proxy.example.com:9222/ 403',
		});
		const task = (await invoke(Agent.getTask, { taskId: 'agent-ext-1' })) as {
			error?: string;
		};
		expect(task.error).not.toContain('made-up-pass');
		expect(task.error).toContain('wss://[redacted]@proxy.example.com');
	});

	it('getTask GETs the task status', async () => {
		respond(agentTaskCompleted);
		const task = (await invoke(Agent.getTask, {
			taskId: 'agent-extract-abc123',
		})) as { status: string };
		expect(task.status).toBe('completed');
		expectAuthenticated('/v1/agent/extract/agent-extract-abc123', 'GET');
	});

	it('stopTask POSTs to the stop route', async () => {
		respond(agentTaskStopped);
		const task = (await invoke(Agent.stopTask, {
			taskId: 'agent-extract-abc123',
		})) as { status: string };
		expect(task.status).toBe('stopped');
		expectAuthenticated('/v1/agent/extract/agent-extract-abc123/stop');
	});

	it('generateScraper POSTs the build payload', async () => {
		respond({ template_id: 'abc123', status: 'generating' }, 202);
		await invoke(Agent.generateScraper, {
			url: 'https://news.ycombinator.com/',
			prompt: 'Extract news titles with their scores',
		});
		expectAuthenticated('/v1/agent/generate');
	});

	it('createScraper POSTs no body', async () => {
		respond(createdScraper);
		await invoke(Agent.createScraper, {});
		expectAuthenticated('/v1/agent/new');
	});

	it('getScraper GETs the scraper with its build status', async () => {
		respond(agentScraperReady);
		const scraper = (await invoke(Agent.getScraper, {
			scraperId: 'abc123',
		})) as { status: string };
		expect(scraper.status).toBe('ready');
		expectAuthenticated('/v1/agent/abc123', 'GET');
	});

	it('deleteScraper DELETEs the scraper', async () => {
		respond(deleteMessage);
		const result = (await invoke(Agent.deleteScraper, {
			scraperId: 'abc123',
		})) as { message: string };
		expect(result.message).toBe('Scraper deleted successfully.');
		expectAuthenticated('/v1/agent/abc123', 'DELETE');
	});
});

describe('scrapers', () => {
	it('run POSTs the run payload', async () => {
		respond(syncRunResult);
		await invoke(Scrapers.run, {
			template_id: 'abc123',
			url: 'https://example.com/page1',
		});
		const sent = lastRequest();
		expectAuthenticated('/v1/scrapers/run');
		expect(JSON.parse(sent.body as string)).toEqual({
			template_id: 'abc123',
			url: 'https://example.com/page1',
		});
	});

	it('runAsync POSTs the run payload', async () => {
		respond(asyncRunQueued, 202);
		const run = (await invoke(Scrapers.runAsync, {
			template_id: 'abc123',
			url: 'https://example.com/page1',
		})) as { run_id?: string; status: string };
		expect(run.run_id).toBe('run-abc123');
		expect(run.status).toBe('queued');
		expectAuthenticated('/v1/scrapers/run_async');
	});

	it('getRun GETs the run status', async () => {
		respond(asyncRunCompleted);
		const run = (await invoke(Scrapers.getRun, {
			runId: 'run-abc123',
			// unknown: run data is keyed by scraped URL, so the cast keeps it
			// open.
		})) as { status: string; data?: Record<string, unknown> };
		expect(run.status).toBe('completed');
		expect(Object.keys(run.data ?? {})).toHaveLength(2);
		expectAuthenticated('/v1/scrapers/run_async/run-abc123', 'GET');
	});

	it('run models the 202 deferral past five minutes', async () => {
		respond(deferredRun, 202);
		const run = (await invoke(Scrapers.run, {
			template_id: 'abc123',
		})) as { run_id?: string; status: string };
		expect(run.run_id).toBe('run-abc123');
		expect(run.status).toBe('running');
	});
});
