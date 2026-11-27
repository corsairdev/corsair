import { ApiError } from 'corsair/http';
import {
	MARITIME_RATE_LIMIT_CONFIG,
	maritimeErrorMessage,
	routeUrl,
	withoutRequestData,
} from './client';
import { maritimeEndpointsNested } from './endpoints/catalog';
import { maritimeDefinitions, maritimeOperations } from './endpoints/manifest';
import {
	dataPlaneOf,
	fileNameFor,
	isUsableFile,
	queryEntries,
	rawBodyOf,
} from './endpoints/operations';
import type { MaritimeContext } from './index';

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

const KEY = 'mk_test_key_0000000000';
const SECRET = 'sbx_secret_1111111111';
const DATA_PLANE = 'https://api-sbx-k3m7q2ab.h7.sb.mtm.sh/v1';

function ctx(): MaritimeContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options: {},
		keys: { get_api_key: () => Promise.resolve(KEY) },
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as MaritimeContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: MaritimeContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = maritimeEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const SANDBOX = {
	id: 'sbx-k3m7q2ab',
	state: 'running',
	dataPlaneUrl: DATA_PLANE,
	secret: SECRET,
};

const BASE = 'https://api.maritime.sh';

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
		schema = maritimeDefinitions[String(schema.$ref)];
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
		for (const operation of maritimeOperations) {
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
			if (operation.plane === 'data') {
				replies({ status: 200, body: SANDBOX }, answer);
			} else {
				replies(answer);
			}
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
			const expectedOrigin =
				operation.plane === 'data' ? new URL(DATA_PLANE).origin : BASE;
			const path =
				operation.plane === 'data'
					? url.pathname.replace(/^\/v1/, '')
					: url.pathname;
			if (url.origin !== expectedOrigin) {
				failures.push(`${operation.id}: origin ${url.origin}`);
			}
			if (!pattern.test(decodeURIComponent(path))) {
				failures.push(`${operation.id}: path ${path}`);
			}
			if (call?.method !== operation.method) {
				failures.push(`${operation.id}: method ${call?.method}`);
			}
			if (operation.plane === 'data') {
				if (call?.headers['x-maritime-token'] !== SECRET)
					failures.push(`${operation.id}: no data plane token`);
				if (call?.headers.authorization)
					failures.push(`${operation.id}: account key sent to the data plane`);
			} else if (call?.headers.authorization !== `Bearer ${KEY}`) {
				failures.push(`${operation.id}: no bearer key`);
			}
			jest.restoreAllMocks();
		}
		expect(failures).toEqual([]);
	});
});

describe('requests', () => {
	it('sends a GET with Bearer auth', async () => {
		reply(200, { plan: 'scale', machines: 0 });
		const out = await endpointFor('account.limits')(ctx(), {});
		expect(out).toEqual({ plan: 'scale', machines: 0 });
		expect(calls[0]?.url).toBe(`${BASE}/api/v1/account/limits`);
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${KEY}`);
	});

	it('sends path values encoded, so a value cannot reach another route', async () => {
		reply(200, {});
		await endpointFor('agents.get')(ctx(), { agent_id: 'ag 1/../keys' });
		expect(calls[0]?.url).toBe(`${BASE}/api/agents/ag%201%2F..%2Fkeys`);
		await expect(
			endpointFor('agents.get')(ctx(), { agent_id: '..' }),
		).rejects.toThrow(/Invalid Maritime path value/);
	});

	it('sends a JSON body with only the body fields', async () => {
		reply(200, { response: 'done' });
		await endpointFor('agents.chat.send')(ctx(), {
			agent_id: 'ag_1',
			message: 'summarize today',
			conversation_id: 'u_481:c_9',
		});
		expect(calls[0]?.url).toBe(`${BASE}/api/agents/ag_1/chat`);
		expect(calls[0]?.method).toBe('POST');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			message: 'summarize today',
			conversation_id: 'u_481:c_9',
		});
	});

	it('sends a fresh Idempotency-Key unless the caller gives one', async () => {
		reply(200, { response: 'ok' });
		await endpointFor('agents.chat.send')(ctx(), {
			agent_id: 'ag_1',
			message: 'a',
		});
		await endpointFor('agents.chat.send')(ctx(), {
			agent_id: 'ag_1',
			message: 'b',
			idempotency_key: 'k-1',
			chat_result: 'turns-v1',
		});
		expect(calls[0]?.headers['idempotency-key']).toMatch(/^[0-9a-f-]{36}$/);
		expect(calls[1]?.headers['idempotency-key']).toBe('k-1');
		expect(calls[1]?.headers['x-maritime-chat-result']).toBe('turns-v1');
		expect(JSON.parse(String(calls[1]?.body))).toEqual({ message: 'b' });
	});

	it('writes list filters as repeated keys and metadata as metadata[key]', async () => {
		expect(queryEntries('metadata', { job: '42' }, true)).toEqual({
			'metadata[job]': '42',
		});
		expect(queryEntries('state', ['running'], false)).toEqual({
			state: ['running'],
		});
		reply(200, { data: [], nextCursor: null });
		await endpointFor('sandboxes.list')(ctx(), {
			state: ['running', 'paused'],
			metadata: { job: '42' },
			limit: 10,
		});
		const url = new URL(calls[0]?.url ?? '');
		expect(url.pathname).toBe('/v1/sandboxes');
		expect(url.searchParams.getAll('state')).toEqual(['running', 'paused']);
		expect(url.searchParams.get('metadata[job]')).toBe('42');
		expect(url.searchParams.get('limit')).toBe('10');
	});

	it('refuses fields an operation without a body does not take', async () => {
		reply(200, {});
		await expect(
			endpointFor('agents.get')(ctx(), { agent_id: 'ag_1', extra: 1 }),
		).rejects.toThrow(/Invalid input for maritime agents.get/);
		expect(calls).toHaveLength(0);
	});

	it('checks the documented limits before sending', async () => {
		reply(201, {});
		await expect(
			endpointFor('sandboxes.create')(ctx(), { memoryMib: 1500 }),
		).rejects.toThrow(/memoryMib/);
		await expect(
			endpointFor('sandboxes.ephemeral.create')(ctx(), { idleMinutes: 90 }),
		).rejects.toThrow(/idleMinutes/);
		expect(calls).toHaveLength(0);
	});

	it('passes an open body through (agents.invoke)', async () => {
		reply(202, { accepted: true });
		await endpointFor('agents.invoke')(ctx(), {
			agent_id: 'ag_1',
			token: 'tok',
			event: 'order.created',
			order: { id: 7 },
		});
		expect(new URL(calls[0]?.url ?? '').searchParams.get('token')).toBe('tok');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			event: 'order.created',
			order: { id: 7 },
		});
	});

	it('uploads a file as multipart', async () => {
		reply(200, { ok: true, path: '/data/inbox/notes.md' });
		await endpointFor('agents.files.upload')(ctx(), {
			agent_id: 'ag_1',
			file: { base64: 'aGVsbG8=', filename: 'notes.md' },
			dest_dir: '/data/inbox',
		});
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('dest_dir')).toBe('/data/inbox');
		const file = form.get('file') as File;
		expect(file.name).toBe('notes.md');
		expect(new TextDecoder().decode(await file.arrayBuffer())).toBe('hello');
	});

	it('returns a download as a file named after its path', async () => {
		reply(200, new Uint8Array([104, 105]), 'text/plain');
		const out = (await endpointFor('agents.files.download')(ctx(), {
			agent_id: 'ag_1',
			path: '/data/report.txt',
		})) as { filename?: string; base64?: string };
		expect(out.filename).toBe('report.txt');
		expect(calls[0]?.url).toBe(
			`${BASE}/api/agents/ag_1/files/download?path=%2Fdata%2Freport.txt`,
		);
	});

	it('returns an install script as text', async () => {
		reply(200, 'curl https://x | sh', 'text/plain');
		const out = await endpointFor('network.install.unixScript')(ctx(), {
			token: 'tok',
		});
		expect(out).toEqual({ text: 'curl https://x | sh' });
	});

	it('answers a bodiless 204 with success', async () => {
		reply(204);
		const out = await endpointFor('agents.delete')(ctx(), { agent_id: 'ag_1' });
		expect(out).toEqual({ success: true });
	});

	it('writes a computer file as the raw body', async () => {
		reply(200, { ok: true });
		await endpointFor('computers.files.write')(ctx(), {
			computer_id: 'cmp_1',
			path: '/home/user/a.bin',
			content: 'AAEC',
			encoding: 'base64',
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.headers['content-type']).toBe('application/octet-stream');
		const body = calls[0]?.body as Blob;
		expect([...new Uint8Array(await body.arrayBuffer())]).toEqual([0, 1, 2]);
	});
});

describe('the data plane', () => {
	it('reads the sandbox, then runs the command with its secret only', async () => {
		replies(
			{ status: 200, body: SANDBOX },
			{
				status: 200,
				body: {
					id: 'cmd_1',
					state: 'exited',
					exitCode: 0,
					stdout: 'Linux\n',
					stderr: '',
				},
			},
		);
		const out = await endpointFor('sandboxes.commands.run')(ctx(), {
			sandbox_id: 'sbx-k3m7q2ab',
			cmd: 'uname',
			timeoutSeconds: 30,
		});
		expect(out).toEqual(
			expect.objectContaining({ exitCode: 0, stdout: 'Linux\n' }),
		);
		expect(calls[0]?.url).toBe(`${BASE}/v1/sandboxes/sbx-k3m7q2ab`);
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${KEY}`);
		expect(calls[1]?.url).toBe(`${DATA_PLANE}/commands`);
		expect(calls[1]?.headers['x-maritime-token']).toBe(SECRET);
		expect(calls[1]?.headers.authorization).toBeUndefined();
		expect(JSON.parse(String(calls[1]?.body))).toEqual({
			cmd: 'uname',
			timeoutSeconds: 30,
		});
	});

	it('writes a file as bytes and reads it back as a file', async () => {
		replies({ status: 200, body: SANDBOX }, { status: 204 });
		await endpointFor('sandboxes.files.write')(ctx(), {
			sandbox_id: 'sbx-k3m7q2ab',
			path: '/home/user/notes.md',
			content: 'hello',
		});
		expect(calls[1]?.url).toBe(
			`${DATA_PLANE}/files?path=%2Fhome%2Fuser%2Fnotes.md`,
		);
		expect(calls[1]?.method).toBe('PUT');
		const body = calls[1]?.body as Blob;
		expect(await body.text()).toBe('hello');

		calls = [];
		jest.restoreAllMocks();
		replies(
			{ status: 200, body: SANDBOX },
			{
				status: 200,
				body: new Uint8Array([104, 105]),
				contentType: 'application/octet-stream',
			},
		);
		const file = (await endpointFor('sandboxes.files.read')(ctx(), {
			sandbox_id: 'sbx-k3m7q2ab',
			path: '/home/user/notes.md',
		})) as { filename?: string };
		expect(file.filename).toBe('notes.md');
	});

	it('refuses a sandbox without a secret, before any data plane call', async () => {
		reply(200, { ...SANDBOX, secret: null });
		await expect(
			endpointFor('sandboxes.files.list')(ctx(), {
				sandbox_id: 'sbx-k3m7q2ab',
				path: '/home/user',
			}),
		).rejects.toThrow(/no data plane secret/);
		expect(calls).toHaveLength(1);
	});

	it('never sends the secret outside sb.mtm.sh', async () => {
		reply(200, { ...SANDBOX, dataPlaneUrl: 'https://evil.example.com/v1' });
		await expect(
			endpointFor('sandboxes.files.list')(ctx(), {
				sandbox_id: 'sbx-k3m7q2ab',
				path: '/home/user',
			}),
		).rejects.toThrow(/outside sb.mtm.sh/);
		expect(calls).toHaveLength(1);
		expect(() => dataPlaneOf({ dataPlaneUrl: DATA_PLANE, secret: '' })).toThrow(
			/no data plane secret/,
		);
	});

	it('removes the secret from a data plane error', async () => {
		replies(
			{ status: 200, body: SANDBOX },
			{
				status: 401,
				body: { code: 'unauthenticated', message: `bad token ${SECRET}` },
			},
		);
		const error = (await endpointFor('sandboxes.commands.get')(ctx(), {
			sandbox_id: 'sbx-k3m7q2ab',
			command_id: 'cmd_1',
		}).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(JSON.stringify(error.body)).not.toContain(SECRET);
		expect(error.message).not.toContain(SECRET);
		expect(error.url).toBe(
			'https://api-{sandbox}.sb.mtm.sh/v1/commands/{command_id}',
		);
	});
});

describe('errors', () => {
	it('reads the three error shapes Maritime sends', () => {
		expect(
			maritimeErrorMessage(400, 'Bad Request', {
				code: 'invalid_request',
				message: 'from is required.',
				hint: 'Fix the field.',
				field: 'from',
			}),
		).toBe(
			'Maritime 400: invalid_request: from is required. (field from) Fix the field.',
		);
		expect(
			maritimeErrorMessage(404, 'Not Found', {
				detail: 'Agent nope not found',
			}),
		).toBe('Maritime 404: Agent nope not found');
		expect(
			maritimeErrorMessage(422, 'x', {
				detail: [
					{ loc: ['body', 'message'], msg: 'Input should be a valid string' },
				],
			}),
		).toBe('Maritime 422: message: Input should be a valid string');
		expect(
			maritimeErrorMessage(409, 'x', {
				detail: { code: 'vm_not_ready', state: 'starting' },
			}),
		).toBe('Maritime 409: vm_not_ready: starting');
		expect(
			maritimeErrorMessage(404, 'x', {
				error: 'not_found',
				message: 'No such computer.',
			}),
		).toBe('Maritime 404: not_found: No such computer.');
		expect(maritimeErrorMessage(502, 'Bad Gateway', '<html>')).toBe(
			'Maritime 502: Bad Gateway',
		);
	});

	it('drops what was sent from an error, keeping the status', async () => {
		reply(422, {
			detail: [
				{
					loc: ['body', 'message'],
					msg: 'bad',
					input: 'private chat text',
				},
			],
		});
		const error = (await endpointFor('agents.chat.send')(ctx(), {
			agent_id: 'ag_1',
			message: 'private chat text',
		}).then(
			() => undefined,
			(e: unknown) => e,
		)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(422);
		expect(JSON.stringify(error.body)).not.toContain('private chat text');
		expect(error.request.body).toBe('[REDACTED]');
		expect(error.request.headers).toBeUndefined();
		expect(error.url).toBe(`${BASE}/api/agents/{agent_id}/chat`);
	});

	it('keeps the key out of a body that echoes it', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v1/keys' },
			{
				url: `${BASE}/api/v1/keys`,
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: { detail: `key ${KEY} lacks manage` },
			},
			'x',
		);
		const clean = withoutRequestData(error, [KEY]);
		expect(clean.message).toBe('Maritime 403: key [REDACTED] lacks manage');
		expect(routeUrl(`${BASE}/api/v1/keys?x=1`, '/api/v1/keys')).toBe(
			`${BASE}/api/v1/keys?[REDACTED]`,
		);
	});

	it('honours Retry-After on a 429 through core', () => {
		expect(MARITIME_RATE_LIMIT_CONFIG.headerNames.retryAfter).toBe(
			'retry-after',
		);
		expect(MARITIME_RATE_LIMIT_CONFIG.maxRetries).toBe(3);
	});

	it('refuses a response that does not match its documented schema', async () => {
		reply(200, { data: 'not a list' });
		await expect(
			endpointFor('sandboxes.files.list')(ctx(), {
				sandbox_id: 'sbx-k3m7q2ab',
				path: '/home/user',
			}),
		).rejects.toThrow();
	});
});

describe('helpers', () => {
	it('names files after their path, else the operation', () => {
		expect(fileNameFor('agents.files.download', { path: '/data/a.pdf' })).toBe(
			'a.pdf',
		);
		expect(
			fileNameFor(
				'computers.screenshot',
				{ computer_id: 'cmp_1' },
				'image/png',
			),
		).toBe('maritime-computers-screenshot-cmp_1.png');
	});

	it('takes any bytes from a disk read and refuses an HTML page elsewhere', () => {
		const html = new TextEncoder().encode('<!doctype html><p>login</p>');
		expect(isUsableFile('sandboxes.files.read', html, 'text/html')).toBe(true);
		expect(isUsableFile('sandboxes.files.read', new Uint8Array(), null)).toBe(
			true,
		);
		expect(isUsableFile('computers.screenshot', html, 'text/html')).toBe(false);
		expect(isUsableFile('computers.screenshot', new Uint8Array(), null)).toBe(
			false,
		);
	});

	it('decodes base64 content and refuses what is not base64', async () => {
		expect(await rawBodyOf('aGk=', 'base64').text()).toBe('hi');
		expect(await rawBodyOf('hi', 'utf8').text()).toBe('hi');
		expect(() => rawBodyOf('not base64!', 'base64')).toThrow(/base64/);
	});
});
