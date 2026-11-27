import { ApiError } from 'corsair/http';
import {
	DAYTONA_RATE_LIMIT_CONFIG,
	daytonaErrorMessage,
	routeUrl,
	withoutRequestData,
} from './client';
import { daytonaEndpointsNested } from './endpoints/catalog';
import { daytonaDefinitions, daytonaOperations } from './endpoints/manifest';
import {
	fileNameFor,
	isUsableFile,
	queryEntries,
	rawBodyOf,
} from './endpoints/operations';
import type { DaytonaContext } from './index';

// Every call goes through the real client and core transport; only fetch is fake.

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string, a Blob or a FormData.
	body: unknown;
};

let calls: Captured[] = [];

type Reply = {
	status: number;
	// `unknown` because each case answers its own JSON body.
	body?: unknown;
	contentType?: string;
	headers?: Record<string, string>;
};

/** Answers each fetch with the next reply (the last one repeats). */
function replies(...queue: Reply[]) {
	let index = 0;
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const next = queue[Math.min(index, queue.length - 1)] ?? { status: 200 };
		index++;
		const payload =
			next.body instanceof Uint8Array
				? next.body
				: next.body === undefined
					? null
					: typeof next.body === 'string'
						? next.body
						: JSON.stringify(next.body);
		return new Response(payload, {
			status: next.status,
			headers: {
				...(next.body === undefined
					? {}
					: { 'content-type': next.contentType ?? 'application/json' }),
				...next.headers,
			},
		});
	});
}

/** Answers each fetch by its URL. */
function routeReplies(pick: (url: string) => Reply) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const next = pick(String(input));
		const payload =
			next.body instanceof Uint8Array
				? next.body
				: next.body === undefined
					? null
					: typeof next.body === 'string'
						? next.body
						: JSON.stringify(next.body);
		return new Response(payload, {
			status: next.status,
			headers:
				next.body === undefined
					? {}
					: { 'content-type': next.contentType ?? 'application/json' },
		});
	});
}

function reply(status: number, body?: unknown, contentType?: string) {
	replies({ status, body, contentType });
}

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

const KEY = 'dtn_test_key_0000000000';
const SBX = 'my-sandbox';
const PROXY = 'https://proxy.app.daytona.io/toolbox';
const ANALYTICS = 'https://analytics.app.daytona.io';

function ctx(): DaytonaContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options: {},
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as DaytonaContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: DaytonaContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = daytonaEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const BASE = 'https://app.daytona.io/api';

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

/** The smallest body an operation's documented output accepts. */
// `unknown` because the output is raw JSON Schema from the manifest.
function minimalBody(output: unknown): unknown {
	let schema = output as Record<string, unknown> | undefined;
	for (let depth = 0; depth < 10 && schema && '$ref' in schema; depth++) {
		schema = daytonaDefinitions[String(schema.$ref)];
	}
	if (!schema) return {};
	if (schema.type === 'array') return [];
	if (Array.isArray(schema.anyOf)) return minimalBody(schema.anyOf[0]);
	// Already JSON: the fake fetch sends a string body as it is.
	if (schema.type === 'string') return JSON.stringify('x');
	if (schema.type === 'integer' || schema.type === 'number') return 0;
	if (schema.type === 'boolean') return true;
	return {};
}

describe('every operation', () => {
	it('sends its docs example to the documented route', async () => {
		const failures: string[] = [];
		for (const operation of daytonaOperations) {
			calls = [];
			const answer: Reply =
				operation.response === 'file'
					? {
							status: 200,
							body: new Uint8Array([1, 2, 3]),
							contentType: 'image/png',
						}
					: operation.response === 'text'
						? { status: 200, body: 'echo hi', contentType: 'text/plain' }
						: operation.response === 'empty'
							? { status: 204 }
							: { status: 200, body: minimalBody(operation.output) };
			routeReplies((url) =>
				url.endsWith('/toolbox-proxy-url')
					? { status: 200, body: { url: PROXY } }
					: url === `${BASE}/config` && operation.plane === 'analytics'
						? { status: 200, body: { analyticsApiUrl: ANALYTICS } }
						: answer,
			);
			const args = docs.apiExamples[operation.id]?.args ?? {};
			try {
				await endpointFor(operation.id)(ctx(), args);
			} catch (error) {
				failures.push(`${operation.id}: ${(error as Error).message}`);
				jest.restoreAllMocks();
				continue;
			}
			const call = calls[calls.length - 1];
			const pattern = new RegExp(
				`^${operation.path
					.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
					.replace(/\{[^}]+\}/g, '[^/]+')}$`,
			);
			const url = new URL(call?.url ?? 'https://x');
			const prefix =
				operation.plane === 'toolbox'
					? `${PROXY}/${encodeURIComponent(String(args.sandbox_id))}`
					: operation.plane === 'analytics'
						? ANALYTICS
						: BASE;
			const path = url.toString().split('?')[0]?.slice(prefix.length) ?? '';
			if (!url.toString().startsWith(prefix)) {
				failures.push(`${operation.id}: base ${url.toString()}`);
			}
			if (!pattern.test(decodeURIComponent(path))) {
				failures.push(`${operation.id}: path ${path}`);
			}
			if (call?.method !== operation.method) {
				failures.push(`${operation.id}: method ${call?.method}`);
			}
			if (call?.headers.authorization !== `Bearer ${KEY}`) {
				failures.push(`${operation.id}: no bearer key`);
			}
			jest.restoreAllMocks();
		}
		expect(failures).toEqual([]);
	});
});

describe('requests', () => {
	it('sends a GET with Bearer auth to Daytona Cloud', async () => {
		reply(200, { items: [] });
		await endpointFor('sandboxes.list')(ctx(), { limit: 5 });
		expect(calls[0]?.url).toBe(`${BASE}/sandbox?limit=5`);
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${KEY}`);
	});

	it('goes to a self-hosted Daytona and sends the organization option', async () => {
		reply(200, []);
		const selfHosted = {
			...ctx(),
			options: {
				apiUrl: 'https://daytona.example.com/api/',
				organizationId: 'org-1',
			},
		} as unknown as DaytonaContext;
		await endpointFor('apiKeys.list')(selfHosted, {});
		await endpointFor('apiKeys.list')(selfHosted, { organization_id: 'org-2' });
		expect(calls[0]?.url).toBe('https://daytona.example.com/api/api-keys');
		expect(calls[0]?.headers['x-daytona-organization-id']).toBe('org-1');
		expect(calls[1]?.headers['x-daytona-organization-id']).toBe('org-2');
		await expect(
			endpointFor('apiKeys.list')(
				{
					...ctx(),
					options: { apiUrl: 'http://daytona.example.com/api' },
				} as unknown as DaytonaContext,
				{},
			),
		).rejects.toThrow(/must be https/);
	});

	it('runs a toolbox command through the sandbox proxy URL', async () => {
		replies(
			{ status: 200, body: { url: `${PROXY}/` } },
			{ status: 200, body: { exitCode: 0, result: 'Linux' } },
		);
		const out = await endpointFor('toolbox.process.executeCommand')(ctx(), {
			sandbox_id: SBX,
			command: 'uname',
			timeout: 30,
		});
		expect(out).toEqual({ exitCode: 0, result: 'Linux' });
		expect(calls[0]?.url).toBe(`${BASE}/sandbox/${SBX}/toolbox-proxy-url`);
		expect(calls[1]?.url).toBe(`${PROXY}/${SBX}/process/execute`);
		expect(calls[1]?.headers.authorization).toBe(`Bearer ${KEY}`);
		expect(JSON.parse(String(calls[1]?.body))).toEqual({
			command: 'uname',
			timeout: 30,
		});
	});

	it('returns session command logs sent as plain text', async () => {
		// The daemon sends JSON only to SDKs with a recent X-Daytona-SDK-Version.
		replies(
			{ status: 200, body: { url: `${PROXY}/` } },
			{ status: 200, body: 'session-ok\n', contentType: 'text/plain' },
		);
		const out = await endpointFor('toolbox.process.getSessionCommandLogs')(
			ctx(),
			{ sandbox_id: SBX, sessionId: 'corsair', commandId: 'cmd-1' },
		);
		expect(out).toBe('session-ok\n');
		expect(calls[1]?.url).toBe(
			`${PROXY}/${SBX}/process/session/corsair/command/cmd-1/logs`,
		);
	});

	it('refuses a toolbox proxy URL that is not https', async () => {
		reply(200, { url: 'http://proxy.example.com/toolbox' });
		await expect(
			endpointFor('toolbox.info.getVersion')(ctx(), { sandbox_id: SBX }),
		).rejects.toThrow(/not https/);
		expect(calls).toHaveLength(1);
	});

	it('reads analytics from the host GET /config names', async () => {
		replies(
			{
				status: 200,
				body: { analyticsApiUrl: 'https://analytics.example.com' },
			},
			{ status: 200, body: {} },
		);
		const selfHosted = {
			...ctx(),
			options: { apiUrl: 'https://daytona-analytics-test.example.com/api' },
		} as unknown as DaytonaContext;
		await endpointFor('analytics.usage.aggregated')(selfHosted, {
			organizationId: 'org-1',
			from: '2026-11-01T00:00:00Z',
			to: '2026-11-27T00:00:00Z',
		});
		expect(calls[0]?.url).toBe(
			'https://daytona-analytics-test.example.com/api/config',
		);
		expect(calls[1]?.url).toBe(
			'https://analytics.example.com/organization/org-1/usage/aggregated?from=2026-11-01T00%3A00%3A00Z&to=2026-11-27T00%3A00%3A00Z',
		);
	});

	it('uploads a file as multipart into the sandbox', async () => {
		replies({ status: 200, body: { url: PROXY } }, { status: 200, body: {} });
		await endpointFor('toolbox.files.upload')(ctx(), {
			sandbox_id: SBX,
			path: '/home/daytona/notes.md',
			file: { base64: 'aGVsbG8=', filename: 'notes.md' },
		});
		const form = calls[1]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect((form.get('file') as File).name).toBe('notes.md');
	});

	it('returns a download as a file named after its path', async () => {
		replies(
			{ status: 200, body: { url: PROXY } },
			{
				status: 200,
				body: new Uint8Array([104, 105]),
				contentType: 'application/octet-stream',
			},
		);
		const out = (await endpointFor('toolbox.files.download')(ctx(), {
			sandbox_id: SBX,
			path: '/home/daytona/report.txt',
		})) as { filename?: string };
		expect(out.filename).toBe('report.txt');
	});

	it('refuses a 200 whose body is not JSON', async () => {
		reply(200, 'not json', 'application/json');
		await expect(
			endpointFor('sandboxes.get')(ctx(), { sandboxIdOrName: SBX }),
		).rejects.toThrow(/answered without a JSON body/);
	});
});

describe('errors', () => {
	it("reads Daytona's error bodies", () => {
		expect(
			daytonaErrorMessage(404, 'Not Found', {
				statusCode: 404,
				message: 'Sandbox not found',
				error: 'Not Found',
			}),
		).toBe('Daytona 404: Sandbox not found');
		expect(
			daytonaErrorMessage(400, 'x', {
				message: ['name must be a string', 'cpu must be > 0'],
			}),
		).toBe('Daytona 400: name must be a string; cpu must be > 0');
		expect(daytonaErrorMessage(502, 'Bad Gateway', '<html>')).toBe(
			'Daytona 502: Bad Gateway',
		);
	});

	it('honours Retry-After on a 429 through core', () => {
		expect(DAYTONA_RATE_LIMIT_CONFIG.headerNames.retryAfter).toBe(
			'retry-after',
		);
	});

	it('drops what was sent from an error, keeping the status', async () => {
		reply(400, { message: 'bad name: secret-project-x' });
		const error = (await endpointFor('sandboxes.create')(ctx(), {
			name: 'secret-project-x',
		}).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(JSON.stringify(error.body)).not.toContain('secret-project-x');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.url).toBe(`${BASE}/sandbox`);
	});

	it('keeps the key out of a body that echoes it', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api-keys' },
			{
				url: `${BASE}/api-keys`,
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: `bad key ${KEY}` },
			},
			'x',
		);
		const clean = withoutRequestData(error, [KEY]);
		expect(clean.message).toBe('Daytona 401: bad key [REDACTED]');
		expect(routeUrl(`${BASE}/api-keys?x=1`, '/api-keys')).toBe(
			`${BASE}/api-keys?[REDACTED]`,
		);
	});
});

describe('helpers', () => {
	it('names files after their path, else the operation and id', () => {
		expect(fileNameFor('toolbox.files.download', { path: '/data/a.pdf' })).toBe(
			'a.pdf',
		);
		expect(
			fileNameFor(
				'toolbox.computerUse.downloadRecording',
				{ id: 'rec_1' },
				'video/mp4',
			),
		).toBe('daytona-toolbox-computer-use-download-recording-rec_1.mp4');
	});

	it('takes any bytes from a sandbox file and refuses an HTML page for a recording', () => {
		const html = new TextEncoder().encode('<!doctype html><p>login</p>');
		expect(isUsableFile('toolbox.files.download', html, 'text/html')).toBe(
			true,
		);
		expect(
			isUsableFile('toolbox.computerUse.downloadRecording', html, 'text/html'),
		).toBe(false);
	});

	it('writes map query values as name[key] and lists as repeated keys', () => {
		expect(queryEntries('labels', { a: '1' }, true)).toEqual({
			'labels[a]': '1',
		});
		expect(queryEntries('states', ['started'], false)).toEqual({
			states: ['started'],
		});
	});

	it('decodes base64 content and refuses what is not base64', async () => {
		expect(await rawBodyOf('aGk=', 'base64').text()).toBe('hi');
		expect(() => rawBodyOf('not base64!', 'base64')).toThrow(/base64/);
	});
});
