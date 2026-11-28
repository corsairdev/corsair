import { AuthMissingError } from 'corsair/core';
import {
	checkN8nStoredPairing,
	normalizeN8nInstanceUrl,
	resolveN8nTarget,
} from './auth';
import { n8nEndpointMeta, n8nEndpointsNested } from './endpoints/catalog';
import type { N8nContext } from './index';
import { n8n } from './index';

// n8n specifics on top of the generic suites: the per-instance base URL, the
// key header, string booleans, idempotency keys, list bodies and uploads.

type Captured = {
	url: string;
	method: string;
	headers: Headers;
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	status: number,
	body: unknown,
	contentType = 'application/json',
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		calls.push({
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: init?.body,
		});
		return new Response(
			body instanceof Uint8Array ? body : JSON.stringify(body),
			{ status, headers: { 'content-type': contentType } },
		);
	});
}

const KEY = 'n8n_api_live_like_key';

function ctx(
	options: Record<string, string> = {},
	stored?: string,
): N8nContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: KEY,
		options,
		keys: {
			get_api_key: () => Promise.resolve(KEY),
			get_instance_url: () => Promise.resolve(stored ?? null),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as N8nContext;
}

beforeEach(() => {
	calls = [];
});
afterEach(() => {
	jest.restoreAllMocks();
});

describe('instance URL', () => {
	it('adds /api/v1 and keeps a path prefix', () => {
		expect(normalizeN8nInstanceUrl('https://n8n.example.com')).toBe(
			'https://n8n.example.com/api/v1',
		);
		expect(normalizeN8nInstanceUrl('https://n8n.example.com/api/v1/')).toBe(
			'https://n8n.example.com/api/v1',
		);
		expect(normalizeN8nInstanceUrl('https://example.com/n8n/')).toBe(
			'https://example.com/n8n/api/v1',
		);
		expect(normalizeN8nInstanceUrl('http://localhost:5678')).toBe(
			'http://localhost:5678/api/v1',
		);
	});

	it('refuses plain http to another host, credentials and queries', () => {
		expect(() => normalizeN8nInstanceUrl('http://n8n.example.com')).toThrow(
			/https/,
		);
		expect(() => normalizeN8nInstanceUrl('http://n8n.local')).toThrow(/https/);
		expect(() =>
			normalizeN8nInstanceUrl('https://user:pw@n8n.example.com'),
		).toThrow(/credentials/);
		expect(() =>
			normalizeN8nInstanceUrl('https://n8n.example.com/?x=1'),
		).toThrow(/query/);
		expect(() => normalizeN8nInstanceUrl('ftp://n8n.example.com')).toThrow(
			/http/,
		);
	});

	it('reads the stored instance and asks to connect without one', async () => {
		await expect(
			resolveN8nTarget({
				key: KEY,
				options: {},
				keys: ctx({}, 'https://a.example.com').keys,
			}),
		).resolves.toMatchObject({
			base: 'https://a.example.com/api/v1',
			headers: { 'X-N8N-API-KEY': KEY },
		});
		await expect(
			resolveN8nTarget({ key: KEY, options: {}, keys: {} }),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('keeps a stored key on its own instance', async () => {
		const keys = ctx({}, 'https://a.example.com').keys;
		await expect(
			checkN8nStoredPairing(
				{ instanceUrl: 'https://a.example.com/api/v1' },
				keys,
			),
		).resolves.toBeUndefined();
		await expect(
			checkN8nStoredPairing({ instanceUrl: 'https://b.example.com' }, keys),
		).rejects.toBeInstanceOf(AuthMissingError);
		const plugin = n8n({ instanceUrl: 'https://b.example.com' });
		await expect(
			(
				plugin.keyBuilder as unknown as (
					c: unknown,
					s: string,
				) => Promise<string>
			)({ keys }, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('requests', () => {
	it('sends the key header to the stored instance with boolean queries as text', async () => {
		reply(200, { data: [], nextCursor: null });
		await n8nEndpointsNested.workflows.list(
			ctx({}, 'https://n8n.example.com'),
			{
				active: true,
				limit: 10,
				cursor: 'abc',
			},
		);
		const url = new URL(calls[0]?.url ?? '');
		expect(url.origin + url.pathname).toBe(
			'https://n8n.example.com/api/v1/workflows',
		);
		expect(url.searchParams.get('active')).toBe('true');
		expect(url.searchParams.get('cursor')).toBe('abc');
		expect(calls[0]?.headers.get('x-n8n-api-key')).toBe(KEY);
		expect(calls[0]?.headers.get('authorization')).toBeNull();
	});

	it('sends an idempotency key as a header, not in the body', async () => {
		reply(201, { id: 't1', name: 'reports' });
		await n8nEndpointsNested.tags.create(
			ctx({ instanceUrl: 'https://n8n.example.com' }),
			{ name: 'reports', idempotencyKey: 'tag-create-1' },
		);
		expect(calls[0]?.headers.get('idempotency-key')).toBe('tag-create-1');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ name: 'reports' });
	});

	it('sends a list body for tags and invites', async () => {
		reply(200, [{ id: 't1', name: 'reports' }]);
		await n8nEndpointsNested.workflows.setTags(
			ctx({ instanceUrl: 'https://n8n.example.com' }),
			{ workflowId: 'w1', tags: [{ id: 't1' }] },
		);
		expect(calls[0]?.method).toBe('PUT');
		expect(JSON.parse(String(calls[0]?.body))).toEqual([{ id: 't1' }]);
	});

	it('uploads a package as multipart form data', async () => {
		reply(200, { workflows: [] });
		await n8nEndpointsNested.packages.import(
			ctx({ instanceUrl: 'https://n8n.example.com' }),
			{
				package: {
					base64: Buffer.from([31, 139, 8, 0]).toString('base64'),
					filename: 'export.n8np',
					contentType: 'application/gzip',
				},
				conflictPolicy: 'skip',
			},
		);
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('conflictPolicy')).toBe('skip');
		expect(form.get('package')).toBeInstanceOf(Blob);
	});

	it('returns an export as a file', async () => {
		reply(200, new Uint8Array([31, 139, 8, 0]), 'application/gzip');
		const file = await n8nEndpointsNested.packages.export(
			ctx({ instanceUrl: 'https://n8n.example.com' }),
			{ workflowIds: ['w1'] },
		);
		expect(file).toMatchObject({
			contentType: 'application/gzip',
			byteLength: 4,
		});
	});

	it('keeps the key out of an error', async () => {
		reply(401, { message: `bad key ${KEY}` });
		const error = await n8nEndpointsNested.tags
			.list(ctx({ instanceUrl: 'https://n8n.example.com' }), {})
			.catch((e: unknown) => e as Error);
		expect(String(error)).toMatch(/n8n 401/);
		expect(String(error)).not.toContain(KEY);
	});
});

describe('risk levels', () => {
	it('marks running, installing and deleting as destructive', () => {
		for (const id of [
			'workflows.run',
			'workflows.activate',
			'executions.retry',
			'agents.run',
			'communityPackages.install',
			'users.invite',
			'workflows.delete',
			'credentials.delete',
		] as const) {
			expect([id, n8nEndpointMeta[id].riskLevel]).toEqual([id, 'destructive']);
		}
		expect(n8nEndpointMeta['workflows.list'].riskLevel).toBe('read');
		expect(n8nEndpointMeta['audit.generate'].riskLevel).toBe('read');
		expect(n8nEndpointMeta['tags.create'].riskLevel).toBe('write');
	});
});
