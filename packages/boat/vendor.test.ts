import { ApiError } from 'corsair/http';
import {
	boatEndpointsNested as api,
	boatEndpointMeta,
} from './endpoints/catalog';
import type { BoatContext } from './index';

// Boat routes written by hand from https://docs.boat.dev/api/v1.md and the
// v1 OpenAPI spec, not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string.
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	// `unknown` because each case answers its own JSON body.
	body: unknown,
	status = 200,
	contentType = 'application/json',
	extraHeaders: Record<string, string> = {},
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: new URL(String(input)),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'content-type': contentType, ...extraHeaders } },
		);
	});
}

const KEY = 'boat_test_key';
const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: KEY,
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as BoatContext;

const SANDBOX = 'bx_23456789';
const sent = (i = 0) => JSON.parse(String(calls[i]?.body));

beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

describe('boat routes', () => {
	it('creates a sandbox with a bearer key and an idempotency key', async () => {
		reply(
			{
				ok: true,
				type: 'sandbox.created',
				sandbox: { id: SANDBOX, state: 'provisioning', type: 'small' },
			},
			202,
		);
		const out = await api.sandboxes.create(ctx, {
			type: 'small',
			ttlSeconds: 600,
			labels: { job: 'nightly' },
			idempotencyKey: '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
		});
		expect(out).toMatchObject({ sandbox: { id: SANDBOX } });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe('https://boat.dev/api/v1/sandboxes');
		expect(calls[0]?.headers.authorization).toBe(`Bearer ${KEY}`);
		expect(calls[0]?.headers['idempotency-key']).toBe(
			'6f9619ff-8b86-d011-b42d-00cf4fc964ff',
		);
		expect(sent()).toEqual({
			type: 'small',
			ttlSeconds: 600,
			labels: { job: 'nightly' },
		});
	});

	it('sends a start once when the start window is full', async () => {
		reply(
			{
				ok: false,
				type: 'sandbox.error',
				status: 429,
				code: 'rate_limited',
				message: 'Start limit reached for this day.',
				requestId: 'req_1',
			},
			429,
			'application/json',
			{ 'retry-after': '3600' },
		);
		const error = await api.sandboxes
			.create(ctx, { type: 'small' })
			.catch((e: unknown) => e);
		expect(calls).toHaveLength(1);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).message).toBe(
			'Boat 429: Start limit reached for this day.',
		);
	});

	it('keeps Boat’s reason from its error envelope', async () => {
		reply(
			{
				ok: false,
				type: 'sandbox.error',
				status: 403,
				code: 'api_key_org_forbidden',
				message:
					'An organization API key cannot read or change account settings. Use the dashboard or an account key.',
				requestId: 'req_2',
			},
			403,
		);
		await expect(api.webhooks.list(ctx, {})).rejects.toThrow(
			/^Boat 403: An organization API key cannot read/,
		);
	});

	it('deletes a sandbox with the confirm header Boat requires', async () => {
		reply({ ok: true, type: 'sandbox.deleting' }, 202);
		await api.sandboxes.delete(ctx, { sandboxId: SANDBOX, confirm: SANDBOX });
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url.pathname).toBe(`/api/v1/sandboxes/${SANDBOX}`);
		expect(calls[0]?.headers['x-ascii-confirm-delete']).toBe(SANDBOX);
		await expect(
			api.sandboxes.delete(ctx, { sandboxId: SANDBOX } as never),
		).rejects.toThrow(/confirm/);
		expect(calls).toHaveLength(1);
	});

	it('runs a command synchronously and never asks for a stream', async () => {
		reply({
			ok: true,
			type: 'command.completed',
			exitCode: 0,
			stdout: 'hi\n',
			stderr: '',
		});
		const out = await api.sandboxes.commands.run(ctx, {
			sandboxId: SANDBOX,
			command: 'echo hi',
			timeoutSeconds: 30,
		});
		expect(out).toMatchObject({ exitCode: 0, stdout: 'hi\n' });
		expect(calls[0]?.url.pathname).toBe(
			`/api/v1/sandboxes/${SANDBOX}/commands`,
		);
		expect(sent()).toEqual({ command: 'echo hi', timeoutSeconds: 30 });
		await expect(
			api.sandboxes.commands.run(ctx, {
				sandboxId: SANDBOX,
				command: 'echo hi',
				stream: true,
			} as never),
		).rejects.toThrow(/unknown field/);
	});

	it('reads a command stream as newline-delimited JSON text', async () => {
		const frames =
			'{"type":"stdout","data":"hi\\n"}\n{"type":"exit","exitCode":0}\n';
		reply(frames, 200, 'application/x-ndjson');
		const out = await api.sandboxes.commands.attach(ctx, {
			sandboxId: SANDBOX,
			processId: 4242,
		});
		expect(out).toEqual({ text: frames, contentType: 'application/x-ndjson' });
		expect(calls[0]?.url.pathname).toBe(
			`/api/v1/sandboxes/${SANDBOX}/commands/4242/stream`,
		);
		expect(calls[0]?.headers.accept).toContain('application/x-ndjson');
	});

	it('sends If-None-Match on the events page and filters lists by label', async () => {
		reply({ ok: true, type: 'events', events: [] });
		await api.sandboxes.agent.listEvents(ctx, {
			sandboxId: SANDBOX,
			ifNoneMatch: '"etag-1"',
		});
		expect(calls[0]?.headers['if-none-match']).toBe('"etag-1"');
		reply({ ok: true, type: 'sandbox.list', sandboxes: [], pageInfo: {} });
		await api.sandboxes.list(ctx, {
			label: ['job=nightly', 'team=infra'],
			limit: 5,
		});
		expect(calls[1]?.url.searchParams.getAll('label')).toEqual([
			'job=nightly',
			'team=infra',
		]);
		expect(calls[1]?.url.searchParams.get('limit')).toBe('5');
	});

	it('writes a file and an environment variable on their own routes', async () => {
		reply({ ok: true, type: 'file.written' });
		await api.sandboxes.files.write(ctx, {
			sandboxId: SANDBOX,
			path: 'notes/today.txt',
			content: 'hello',
		});
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.url.pathname).toBe(`/api/v1/sandboxes/${SANDBOX}/files`);
		reply({ ok: true, type: 'environment.var.set' });
		await api.environments.setVar(ctx, {
			environmentId: 'env-1',
			key: 'NODE_ENV',
			value: 'production',
		});
		expect(calls[1]?.url.pathname).toBe(
			'/api/v1/environments/env-1/vars/NODE_ENV',
		);
		expect(sent(1)).toMatchObject({ value: 'production' });
	});

	it('marks spending and irreversible operations destructive', () => {
		for (const id of [
			'sandboxes.create',
			'sandboxes.fork',
			'sandboxes.resume',
			'sandboxes.commands.run',
			'sandboxes.agent.prompt',
			'sandboxes.delete',
			'apiKeys.createScoped',
			'apiKeys.revoke',
			'apiKeys.rotate',
			'webhooks.rotateSecret',
		] as const) {
			expect(boatEndpointMeta[id].riskLevel).toBe('destructive');
		}
		expect(boatEndpointMeta['sandboxes.stop'].riskLevel).toBe('write');
		expect(boatEndpointMeta['sandboxes.list'].riskLevel).toBe('read');
		expect(
			boatEndpointMeta['sandboxes.files.createDownloadUrl'].riskLevel,
		).toBe('read');
	});
});
