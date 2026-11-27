import {
	supermemoryEndpointsNested as api,
	supermemoryEndpointMeta,
} from './endpoints/catalog';
import type { SupermemoryContext } from './index';

// Routes and shapes written by hand from Supermemory's API reference and the
// live run (11-27), not read from the manifest, so a wrong route in the
// manifest fails here.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};
let calls: Captured[] = [];

// `unknown` because each case answers its own JSON body.
function reply(body: unknown, status = 200, contentType = 'application/json') {
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
			{ status, headers: { 'content-type': contentType } },
		);
	});
}

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'sm_test_key',
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as SupermemoryContext;

beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

function json(index = 0) {
	return JSON.parse(String(calls[index]?.body));
}

describe('v5 routes', () => {
	it('adds a document to a namespace', async () => {
		reply({ id: 'ada_notes', status: 'queued' });
		const out = await api.documents.add(ctx, {
			namespace: 'user_ada',
			id: 'ada_notes',
			content: 'Ada prefers morning meetings.',
			metadata: { source: 'onboarding' },
		});
		expect(out).toEqual({ id: 'ada_notes', status: 'queued' });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe(
			'https://api.supermemory.ai/ns/user_ada/document',
		);
		expect(calls[0]?.headers.authorization).toBe('Bearer sm_test_key');
		expect(json()).toEqual({
			id: 'ada_notes',
			content: 'Ada prefers morning meetings.',
			metadata: { source: 'onboarding' },
		});
	});

	it('sends include as one comma-joined value', async () => {
		reply({ id: 'ada_notes', chunks: [], memories: [] });
		await api.documents.get(ctx, {
			namespace: 'user_ada',
			id: 'ada_notes',
			include: ['chunks', 'memories'],
		});
		expect(calls[0]?.url.pathname).toBe('/ns/user_ada/document/ada_notes');
		expect(calls[0]?.url.searchParams.getAll('include')).toEqual([
			'chunks,memories',
		]);
	});

	it('searches a namespace', async () => {
		reply({ results: [], searchTime: 12 });
		await api.search.query(ctx, {
			namespace: 'user_ada',
			query: 'When does Ada meet?',
			limit: 5,
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe('/ns/user_ada/search');
		expect(json()).toEqual({ query: 'When does Ada meet?', limit: 5 });
	});

	it('forgets matching memories with a DELETE and a JSON body', async () => {
		// The live run answered this shape for a dry run.
		reply({ count: 0, errors: [], matches: [] });
		const out = await api.memories.forgetMatching(ctx, {
			namespace: 'user_ada',
			query: 'green tea',
			dryRun: true,
		});
		expect(out).toEqual({ count: 0, errors: [], matches: [] });
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url.pathname).toBe('/ns/user_ada/memories/semantic');
		expect(json()).toEqual({ query: 'green tea', dryRun: true });
	});

	it('moves a namespace on delete with moveTo in the query string', async () => {
		// Supermemory ignores a body on this route: a moveTo there would delete instead.
		reply({ status: 'queued', namespace: 'old', moveTo: 'new' });
		await api.namespaces.delete(ctx, { namespace: 'old', moveTo: 'new' });
		expect(calls[0]?.method).toBe('DELETE');
		expect(calls[0]?.url.pathname).toBe('/ns/old');
		expect(calls[0]?.url.searchParams.get('moveTo')).toBe('new');
		expect(calls[0]?.body).toBeUndefined();
	});

	it('uploads a file as multipart', async () => {
		reply({ id: 'file_1', status: 'queued' });
		await api.documents.uploadFile(ctx, {
			namespace: 'user_ada',
			file: {
				base64: Buffer.from('hello').toString('base64'),
				filename: 'notes.txt',
				contentType: 'text/plain',
			},
			metadata: '{"source":"upload"}',
		});
		expect(calls[0]?.url.pathname).toBe('/ns/user_ada/document/file');
		const form = calls[0]?.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect((form.get('file') as File).name).toBe('notes.txt');
		expect(form.get('metadata')).toBe('{"source":"upload"}');
	});

	it('refuses a namespace with characters Supermemory does not allow', async () => {
		reply({});
		await expect(
			api.documents.add(ctx, { namespace: 'user/ada', content: 'x' }),
		).rejects.toThrow(/Invalid input/);
		expect(calls).toHaveLength(0);
	});
});

describe('legacy routes', () => {
	it('adds a v3 document with a container tag', async () => {
		reply({ id: 'abc', status: 'queued' });
		await api.legacy.documents.add(ctx, {
			content: 'Grace wrote the first compiler.',
			containerTag: 'user_grace',
		});
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe('https://api.supermemory.ai/v3/documents');
		expect(json()).toEqual({
			content: 'Grace wrote the first compiler.',
			containerTag: 'user_grace',
		});
	});

	it('merges container tags (exactly two, found live)', async () => {
		reply({ success: true, status: 'queued', mergeId: 'm1' });
		await api.legacy.containerTags.merge(ctx, {
			containerTags: ['into', 'from'],
			targetContainerTag: 'into',
		});
		expect(calls[0]?.url.pathname).toBe('/v3/container-tags/merge');
		expect(json()).toEqual({
			containerTags: ['into', 'from'],
			targetContainerTag: 'into',
		});
	});

	it('returns the text an import answers with', async () => {
		reply('Import started', 202, 'text/plain');
		const out = await api.legacy.connections.sync(ctx, {
			provider: 'notion',
			containerTags: ['user_ada'],
		});
		expect(out).toEqual({
			text: 'Import started',
			contentType: 'text/plain',
		});
		expect(calls[0]?.url.pathname).toBe('/v3/connections/notion/import');
	});
});

describe('risk levels', () => {
	it.each([
		'documents.delete',
		'memories.forget',
		'memories.forgetMatching',
		'namespaces.delete',
		'legacy.settings.reset',
		'legacy.containerTags.merge',
		'legacy.memories.forgetMatching',
	] as const)('%s is destructive', (id) => {
		expect(supermemoryEndpointMeta[id].riskLevel).toBe('destructive');
	});

	it.each([
		'search.query',
		'profiles.get',
		'resources.list',
		'legacy.documents.search',
		'legacy.memories.search',
	] as const)('%s, a POST that only reads, is read', (id) => {
		expect(supermemoryEndpointMeta[id].riskLevel).toBe('read');
	});
});
