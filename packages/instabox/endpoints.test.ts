import { ApiError } from 'corsair/http';
import {
	errorCodeOf,
	INSTABOX_RATE_LIMIT_CONFIG,
	instaboxErrorMessage,
	routeUrl,
	withoutRequestData,
} from './client';
import { instaboxEndpointsNested } from './endpoints/catalog';
import { instaboxDefinitions, instaboxOperations } from './endpoints/manifest';
import {
	fileNameFor,
	isUsableFile,
	queryEntries,
	rawBodyOf,
} from './endpoints/operations';
import type { InstaboxContext } from './index';

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

function reply(status: number, body?: unknown, contentType?: string) {
	replies({ status, body, contentType });
}

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

const KEY = 'ibk_test_key_0000000000';
const MID = 'm_k3m7q2abx5wr4hj6zpcnfa2etd';

function ctx(): InstaboxContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options: {},
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as InstaboxContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: InstaboxContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = instaboxEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const BASE = 'https://api.instabox.sh';

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
		schema = instaboxDefinitions[String(schema.$ref)];
	}
	if (!schema) return {};
	if (schema.type === 'array') return [];
	if (Array.isArray(schema.anyOf)) return minimalBody(schema.anyOf[0]);
	if (schema.type === 'string') return '';
	if (schema.type === 'integer' || schema.type === 'number') return 0;
	if (schema.type === 'boolean') return true;
	return {};
}

describe('every operation', () => {
	it('sends its docs example to the documented route', async () => {
		const failures: string[] = [];
		for (const operation of instaboxOperations) {
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
			replies(answer);
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
			const path = url.pathname;
			if (url.origin !== BASE) {
				failures.push(`${operation.id}: origin ${url.origin}`);
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
	it('sends a GET with Bearer auth', async () => {
		reply(200, { machines: [] });
		await endpointFor('machines.list')(ctx(), { limit: 5 });
		expect(calls[0]?.url).toBe(`${BASE}/v1/machines?limit=5`);
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${KEY}`);
	});

	it('refuses an id that does not match its documented pattern', async () => {
		reply(200, {});
		await expect(
			endpointFor('machines.get')(ctx(), { id: 'm_../../keys' }),
		).rejects.toThrow(/Invalid input for instabox machines.get/);
		expect(calls).toHaveLength(0);
	});

	it('sends a fresh Idempotency-Key on lifecycle calls unless one is given', async () => {
		reply(202, { id: 'op_1', kind: 'start' });
		await endpointFor('machines.start')(ctx(), { id: MID });
		await endpointFor('machines.start')(ctx(), {
			id: MID,
			idempotency_key: 'k-1',
		});
		expect(calls[0]?.url).toBe(`${BASE}/v1/machines/${MID}/start`);
		expect(calls[0]?.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
		expect(calls[1]?.headers['idempotency-key']).toBe('k-1');
	});

	it('confirms a delete with the id unless the caller names it', async () => {
		reply(202, { id: 'op_2', kind: 'delete' });
		await endpointFor('machines.delete')(ctx(), { id: MID });
		await endpointFor('machines.delete')(ctx(), {
			id: MID,
			confirm_delete: 'build-42',
		});
		expect(calls[0]?.headers['x-confirm-delete']).toBe(MID);
		expect(calls[1]?.headers['x-confirm-delete']).toBe('build-42');
	});

	it('sends the stop switch in the body, not the query', async () => {
		reply(202, { id: 'op_3' });
		await endpointFor('machines.stop')(ctx(), { id: MID, now: true });
		expect(calls[0]?.url).toBe(`${BASE}/v1/machines/${MID}/stop`);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ now: true });
	});

	it('runs exec with a body and waits as long as its timeout', async () => {
		reply(200, { exitCode: 0, stdout: 'Linux\n', stderr: '' });
		const out = await endpointFor('machines.exec')(ctx(), {
			id: MID,
			argv: ['uname'],
			timeoutSeconds: 30,
		});
		expect(out).toEqual(expect.objectContaining({ exitCode: 0 }));
		expect(calls[0]?.headers.accept).toBe('application/json');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			argv: ['uname'],
			timeoutSeconds: 30,
		});
	});

	it('writes a file as the raw body', async () => {
		reply(200, { path: '/data/home/a.bin', size: 3 });
		await endpointFor('machines.files.write')(ctx(), {
			id: MID,
			path: '/data/home/a.bin',
			content: 'AAEC',
			encoding: 'base64',
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.headers['content-type']).toBe('application/octet-stream');
		expect(new URL(calls[0]?.url ?? '').searchParams.get('path')).toBe(
			'/data/home/a.bin',
		);
		const body = calls[0]?.body as Blob;
		expect([...new Uint8Array(await body.arrayBuffer())]).toEqual([0, 1, 2]);
	});

	it('returns a download as a file named after its path', async () => {
		reply(200, new Uint8Array([104, 105]), 'application/octet-stream');
		const out = (await endpointFor('machines.files.download')(ctx(), {
			id: MID,
			path: '/data/home/report.txt',
			range: 'bytes=0-1',
		})) as { filename?: string };
		expect(out.filename).toBe('report.txt');
		expect(calls[0]?.headers.range).toBe('bytes=0-1');
	});

	it('answers a bodiless 204 with success', async () => {
		reply(204);
		const out = await endpointFor('snapshots.delete')(ctx(), {
			id: 'ss_0123456789abcdef01234567',
		});
		expect(out).toEqual({ success: true });
	});
});

describe('responses', () => {
	it('refuses a 200 whose body is not JSON', async () => {
		reply(200, 'not json', 'application/json');
		await expect(
			endpointFor('machines.get')(ctx(), { id: MID }),
		).rejects.toThrow(/answered without a JSON body/);
	});

	it('scrubs a path value the error body echoes', async () => {
		reply(404, { error: { code: 'not_found', message: `no machine ${MID}` } });
		const error = (await endpointFor('machines.get')(ctx(), { id: MID }).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(error.message).toBe(
			'InstaBox 404: not_found: no machine [REDACTED]',
		);
	});
});

describe('errors', () => {
	it("reads InstaBox's error body", () => {
		expect(
			instaboxErrorMessage(429, 'Too Many Requests', {
				error: {
					code: 'quota_exceeded',
					message: 'sandbox limit reached (1 of 1)',
					hint: 'Delete a sandbox first.',
				},
			}),
		).toBe(
			'InstaBox 429: quota_exceeded: sandbox limit reached (1 of 1) Delete a sandbox first.',
		);
		expect(
			instaboxErrorMessage(400, 'x', {
				error: 'invalid_request',
				error_description: 'bad redirect',
			}),
		).toBe('InstaBox 400: invalid_request: bad redirect');
		expect(instaboxErrorMessage(502, 'Bad Gateway', '<html>')).toBe(
			'InstaBox 502: Bad Gateway',
		);
	});

	it('retries a short burst 429 through the transport', async () => {
		replies(
			{
				status: 429,
				body: { error: { code: 'rate_limited' } },
				headers: { 'retry-after': '0' },
			},
			{ status: 200, body: { machines: [] } },
		);
		await expect(endpointFor('machines.list')(ctx(), {})).resolves.toEqual({
			machines: [],
		});
		expect(calls).toHaveLength(2);
	});

	it('never waits out a daily quota or a long Retry-After', async () => {
		replies({
			status: 429,
			body: { error: { code: 'rate_limited', reason: 'creates_per_day' } },
			headers: { 'retry-after': '0' },
		});
		await expect(endpointFor('machines.list')(ctx(), {})).rejects.toThrow(
			/InstaBox 429/,
		);
		expect(calls).toHaveLength(1);
		calls = [];
		jest.restoreAllMocks();
		replies({
			status: 429,
			body: { error: { code: 'rate_limited' } },
			headers: { 'retry-after': '3600' },
		});
		await expect(endpointFor('machines.list')(ctx(), {})).rejects.toThrow(
			/InstaBox 429/,
		);
		expect(calls).toHaveLength(1);
	});

	it('retries a burst 429 but never a plan quota', () => {
		const isRateLimit = INSTABOX_RATE_LIMIT_CONFIG.isRateLimitError;
		expect(isRateLimit?.(429, { error: { code: 'rate_limited' } })).toBe(true);
		expect(isRateLimit?.(429, { error: { code: 'quota_exceeded' } })).toBe(
			false,
		);
		expect(
			isRateLimit?.(429, {
				error: { code: 'rate_limited', reason: 'creates_per_day' },
			}),
		).toBe(false);
		expect(
			isRateLimit?.(429, {
				error: { code: 'rate_limited', reason: 'starts_per_minute' },
			}),
		).toBe(true);
		expect(
			isRateLimit?.(429, {
				error: { code: 'quota_exceeded', retryable: true },
			}),
		).toBe(true);
		expect(errorCodeOf({ error: { code: 'x' } })).toBe('x');
		expect(errorCodeOf('nope')).toBeUndefined();
	});

	it('drops what was sent from an error, keeping the status', async () => {
		reply(400, {
			error: { code: 'bad_request', message: 'bad cmd: rm -rf secret-dir' },
		});
		const error = (await endpointFor('machines.exec')(ctx(), {
			id: MID,
			cmd: 'rm -rf secret-dir',
		}).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(400);
		expect(JSON.stringify(error.body)).not.toContain('secret-dir');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(error.url).toBe(`${BASE}/v1/machines/{id}/exec`);
	});

	it('scrubs a sent value used as a key in an error body', async () => {
		reply(400, {
			error: {
				code: 'bad_request',
				details: { 'ls secret-dir-name': 'not allowed' },
			},
		});
		const error = (await endpointFor('machines.exec')(ctx(), {
			id: MID,
			cmd: 'ls secret-dir-name',
		}).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(JSON.stringify(error.body)).not.toContain('secret-dir-name');
		expect(JSON.stringify(error.body)).toContain('not allowed');
	});

	it('keeps the key out of a body that echoes it', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/machines' },
			{
				url: `${BASE}/v1/machines`,
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error: { code: 'invalid_key', message: `bad key ${KEY}` } },
			},
			'x',
		);
		const clean = withoutRequestData(error, [KEY]);
		expect(clean.message).toBe('InstaBox 401: invalid_key: bad key [REDACTED]');
		expect(routeUrl(`${BASE}/v1/machines?x=1`, '/v1/machines')).toBe(
			`${BASE}/v1/machines?[REDACTED]`,
		);
	});
});

describe('helpers', () => {
	it('names files after their path, else the operation and id', () => {
		expect(
			fileNameFor('machines.files.download', { path: '/data/a.pdf' }),
		).toBe('a.pdf');
		expect(
			fileNameFor('exports.download', { id: 'exp_1' }, 'application/gzip'),
		).toBe('instabox-exports-download-exp_1.tar.gz');
	});

	it('takes any bytes from a machine file and refuses an HTML page for an export', () => {
		const html = new TextEncoder().encode('<!doctype html><p>login</p>');
		expect(isUsableFile('machines.files.download', html, 'text/html')).toBe(
			true,
		);
		expect(isUsableFile('exports.download', html, 'text/html')).toBe(false);
	});

	it('writes map query values as name[key] and lists as repeated keys', () => {
		expect(queryEntries('metadata', { a: '1' }, true)).toEqual({
			'metadata[a]': '1',
		});
		expect(queryEntries('metadata', ['team=ml'], false)).toEqual({
			metadata: ['team=ml'],
		});
	});

	it('decodes base64 content and refuses what is not base64', async () => {
		expect(await rawBodyOf('aGk=', 'base64').text()).toBe('hi');
		expect(() => rawBodyOf('not base64!', 'base64')).toThrow(/base64/);
	});
});
