import { logEventFromContext } from 'corsair/core';
import { Agent, Extractor, Scrapers } from './endpoints';
import {
	agentTaskCompleted,
	agentTaskPending,
	createdScraper,
	extractionResult,
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

// unknown: a rejection can be any value until the message check narrows it.
async function rejects(
	endpoint: AnyEndpoint,
	input: unknown,
	match: string,
): Promise<void> {
	await expect(invoke(endpoint, input)).rejects.toThrow(match);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('output parsing', () => {
	it('parses an extraction result as an open record', async () => {
		respond(extractionResult);
		const result = (await invoke(Extractor.extract, {
			url: 'https://example.com',
			attributes: [{ name: 'title', description: 'The title' }],
			// unknown: extraction results are caller-defined open records, so
			// the test narrows to the fields it asserts on.
		})) as Record<string, unknown>;
		expect(result['title']).toBe('Show HN: A new approach to web scraping');
	});

	it('parses an empty extraction result', async () => {
		respond({});
		const result = (await invoke(Extractor.parse, {
			content: 'nothing here',
			prompt: 'Extract whatever exists',
			attributes: [{ name: 'title', description: 'The title' }],
			// unknown: extraction results are caller-defined open records.
		})) as Record<string, unknown>;
		expect(Object.keys(result)).toHaveLength(0);
	});

	it('parses a 202 agent task as pending', async () => {
		respond(agentTaskPending, 202);
		const task = (await invoke(Agent.extract, {
			url: 'https://example.com',
			prompt: 'Extract the titles',
		})) as { status: string };
		expect(task.status).toBe('pending');
	});

	it('parses a completed agent task with its data', async () => {
		respond(agentTaskCompleted);
		const task = (await invoke(Agent.getTask, {
			taskId: 'agent-extract-abc123',
			// unknown: task data records are provider-defined, so the cast
			// keeps them open.
		})) as { data?: Array<Record<string, unknown>> };
		expect(task.data?.[0]?.['score']).toBe('142');
	});

	it('parses a created scraper', async () => {
		respond(createdScraper);
		const scraper = (await invoke(Agent.createScraper, {})) as {
			template_id: string;
		};
		expect(scraper.template_id).toBe('abc123');
	});
});

describe('input validation', () => {
	it('rejects an extract or parse without attributes (the API answers 422 to a prompt alone)', async () => {
		await rejects(
			Extractor.extract,
			{ url: 'https://example.com', prompt: 'Get the title' },
			'attributes',
		);
		await rejects(
			Extractor.parse,
			{ content: '<p>hi</p>', prompt: 'Get the text' },
			'attributes',
		);
	});

	it('rejects an agent extract or generate without a prompt', async () => {
		await rejects(
			Agent.extract,
			{
				url: 'https://example.com',
				attributes: [{ name: 't', description: 'title' }],
			},
			'prompt',
		);
		await rejects(
			Agent.generateScraper,
			{ url: 'https://example.com' },
			'prompt',
		);
	});

	it('rejects a run without a template id', async () => {
		await rejects(Scrapers.run, { url: 'https://example.com' }, 'template_id');
	});
});

describe('message-shaped responses', () => {
	it('rejects a delete that answers no message string, without copying the body into the error', async () => {
		respond({ ok: true, customer: 'secret customer data' });
		await expect(
			invoke(Extractor.deleteScraper, { scraperId: 'x' }),
		).rejects.not.toThrow('secret customer data');
		respond({ ok: true });
		await rejects(
			Extractor.deleteScraper,
			{ scraperId: 'x' },
			'unexpected answer',
		);
	});

	it('rejects a delete that answers an empty body', async () => {
		respond(undefined, 204);
		await rejects(Agent.deleteScraper, { scraperId: 'x' }, 'unexpected answer');
	});

	it('rejects a getScraper whose status is not a documented value', async () => {
		respond({ template_id: 'abc123', type: 'agentic', status: 'mysterious' });
		await rejects(Agent.getScraper, { scraperId: 'abc123' }, 'status');
	});
});
