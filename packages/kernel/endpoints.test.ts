import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { kernelEndpointsNested } from './endpoints/catalog';
import type { KernelOperationDefinition } from './endpoints/manifest';
import { kernelDefinitions, kernelOperations } from './endpoints/manifest';
import { kernelInputFields } from './endpoints/openapi-schema';
import { fileNameFor, timeoutFor } from './endpoints/operations';
import type { KernelContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeKernelRequest: jest.fn(),
		makeKernelPagedRequest: jest.fn(),
	};
});

// The real resolveFileInput, with every public link served from memory instead of the network.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		// unknown: a pass-through to the real resolveFileInput, which checks its own arguments.
		resolveFileInput: (input: unknown, options: unknown, deps?: unknown) =>
			actual.resolveFileInput(input, options, deps ?? mockLinks.deps),
	};
});

const mockLinks = {
	fetched: [] as string[],
	deps: {
		resolve: async () => ['93.184.216.34'],
		transport: async (url: URL) => {
			mockLinks.fetched.push(url.toString());
			return {
				status: 200,
				headers: { 'content-type': 'application/zip' },
				body: (async function* () {
					yield new Uint8Array([80, 75, 3, 4]);
				})(),
			};
		},
	},
};

const mockedRequest = jest.mocked(client.makeKernelRequest);
const mockedPagedRequest = jest.mocked(client.makeKernelPagedRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

function buildCtx(): KernelContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read, not the whole plugin context.
	} as unknown as KernelContext;
}

const ctx = buildCtx();

// `unknown` is necessary because the table drives all 183 operations, each with its own input and output type, through one signature.
type AnyEndpoint = (context: KernelContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` is necessary because the nested endpoint tree is indexed by strings from the manifest, which its literal type cannot express.
	let node: unknown = kernelEndpointsNested;
	for (const part of id.split('.')) {
		node = (node as Record<string, unknown>)[part];
	}
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

// `unknown` because a schema reference resolves to any provider schema document.
function resolve(schema: unknown): Record<string, unknown> {
	let current = schema as Record<string, unknown>;
	while (typeof current?.$ref === 'string') {
		current = kernelDefinitions[current.$ref] as Record<string, unknown>;
	}
	return current ?? {};
}

/** The smallest body the documented response schema accepts (every field is optional). */
// `unknown` because the sample is shaped per operation.
function sampleBody(operation: KernelOperationDefinition): unknown {
	const output = resolve(operation.output);
	const members = (output.anyOf ?? output.oneOf) as unknown[] | undefined;
	const shape = members ? resolve(members[0]) : output;
	if (shape.type === 'array') return [];
	if (shape.type === 'string') return 'value';
	return {};
}

/** The URLs an example passes in its file fields (`file`, `zip_file`), at any depth. */
// `unknown` because example args are free-form YAML values.
function fileUrlsIn(value: unknown, key?: string): string[] {
	if (typeof value === 'string') {
		return key === 'file' || key === 'zip_file' ? [value] : [];
	}
	if (Array.isArray(value))
		return value.flatMap((item) => fileUrlsIn(item, key));
	if (typeof value === 'object' && value !== null) {
		return Object.entries(value).flatMap(([name, inner]) =>
			fileUrlsIn(inner, name),
		);
	}
	return [];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedPagedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('every manifest operation', () => {
	it.each(kernelOperations.map((operation) => [operation.id, operation]))(
		'%s sends its validated example to its route and parses the response',
		async (id, operation) => {
			const args = docs.apiExamples[id]?.args ?? {};
			const binary = {
				bytes: new Uint8Array([1, 2, 3, 4]),
				contentType: 'application/octet-stream',
			};
			if (operation.paging) {
				mockedPagedRequest.mockResolvedValue({
					body: operation.response === 'file' ? binary : [],
					headers: new Headers({ 'x-has-more': 'false' }),
				});
			} else {
				mockedRequest.mockResolvedValue(
					operation.response === 'file'
						? binary
						: operation.response === 'empty'
							? undefined
							: sampleBody(operation),
				);
			}

			const result = await endpointFor(id)(ctx, args);

			const transport = operation.paging ? mockedPagedRequest : mockedRequest;
			expect(transport).toHaveBeenCalledTimes(1);
			const sent = transport.mock.calls[0]?.[0];
			expect(sent?.apiKey).toBe('test-api-key');
			expect(sent?.method).toBe(operation.method);
			expect(sent?.path).toBe(operation.path);
			for (const field of kernelInputFields(id)) {
				const given = args[field.name];
				if (field.in === 'path') {
					expect(sent?.pathParameters?.[field.name]).toBe(String(given));
				} else if (field.in === 'query' && given !== undefined) {
					expect(sent?.query?.[field.name]).toBeDefined();
				}
				if (field.in !== 'body' && sent?.body && !(sent.body instanceof Blob)) {
					// A path, query or header field never rides in the body.
					if (!(sent.body instanceof FormData)) {
						expect(sent.body).not.toHaveProperty(field.name);
					}
				}
			}
			if (operation.request === 'none') expect(sent?.body).toBeUndefined();
			if (operation.request === 'multipart') {
				expect(sent?.body).toBeInstanceOf(FormData);
				// Every file the example passes as a URL arrives as a file part, never as text.
				const form = sent?.body as FormData;
				const urls = fileUrlsIn(args);
				const parts = [...form.values()];
				expect(parts.filter((value) => value instanceof Blob)).toHaveLength(
					urls.length,
				);
				for (const url of urls) expect(parts).not.toContain(url);
			}
			if (operation.request === 'binary')
				expect(sent?.body).toBeInstanceOf(Blob);
			if (operation.response === 'file') {
				expect(sent?.responseType).toBe('binary');
				expect(result).toMatchObject({ byteLength: 4 });
			}
			if (operation.response === 'empty') {
				expect(result).toEqual({ success: true });
			}
			if (operation.paging && operation.response === 'json') {
				expect(result).toMatchObject({ items: [], has_more: false });
			}
			expect(sent?.timeoutMs).toBeGreaterThanOrEqual(30_000);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'kernel.operation',
				{ operationId: id },
				'completed',
			);
		},
	);
});

describe('inputs', () => {
	it('splits path, query, header and body fields', async () => {
		mockedRequest.mockResolvedValue({
			success: true,
			result: 'Example Domain',
		});
		await endpointFor('browsers.playwright.execute')(ctx, {
			id_or_name: 'abc',
			code: 'return 1;',
			idempotency_key: 'retry-1',
			timeout_sec: 90,
		});
		const sent = mockedRequest.mock.calls[0]?.[0];
		expect(sent?.pathParameters).toEqual({ id_or_name: 'abc' });
		expect(sent?.headers).toEqual({ 'Idempotency-Key': 'retry-1' });
		expect(sent?.body).toEqual({ code: 'return 1;', timeout_sec: 90 });
		// Kernel's deadline (90 s) plus the margin for the answer.
		expect(sent?.timeoutMs).toBe(120_000);
	});

	it('scopes every call to the projectId option through X-Kernel-Project-Id', async () => {
		mockedRequest.mockResolvedValue({ success: true, result: 'ok' });
		const scoped = {
			...buildCtx(),
			options: { projectId: 'proj_abc123' },
		} as unknown as KernelContext;
		await endpointFor('browsers.playwright.execute')(scoped, {
			id_or_name: 'abc',
			code: 'return 1;',
			idempotency_key: 'retry-1',
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.headers).toEqual({
			'X-Kernel-Project-Id': 'proj_abc123',
			'Idempotency-Key': 'retry-1',
		});

		mockedRequest.mockClear();
		await endpointFor('browsers.playwright.execute')(ctx, {
			id_or_name: 'abc',
			code: 'return 1;',
		});
		expect(mockedRequest.mock.calls[0]?.[0]?.headers).toEqual({});
	});

	it('refuses an invalid input before any request, naming the field but not the value', async () => {
		await expect(
			endpointFor('browsers.computer.clickMouse')(ctx, {
				id_or_name: 'abc',
				x: 'secret-value',
				y: 1,
			}),
		).rejects.toThrow(
			/^Invalid input for kernel browsers.computer.clickMouse: x: Invalid input: expected number, received string$/,
		);
		await expect(
			endpointFor('browsers.computer.clickMouse')(ctx, {
				id_or_name: 'abc',
				x: 'secret-value',
				y: 1,
			}),
		).rejects.not.toThrow(/secret-value/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('requires the y coordinate the published spec names "true"', async () => {
		await expect(
			endpointFor('browsers.computer.clickMouse')(ctx, {
				id_or_name: 'a',
				x: 1,
			}),
		).rejects.toThrow(/y: /);
	});

	it('rejects an unknown key on an operation without a body', async () => {
		await expect(
			endpointFor('browsers.get')(ctx, { id_or_name: 'a', nmae: 'typo' }),
		).rejects.toThrow(/Unrecognized key/);
	});

	it('keeps an unknown body key so a field Kernel adds still reaches it', async () => {
		mockedRequest.mockResolvedValue({ session_id: 'abc' });
		await endpointFor('browsers.create')(ctx, { headless: true, new_field: 1 });
		expect(mockedRequest.mock.calls[0]?.[0].body).toEqual({
			headless: true,
			new_field: 1,
		});
	});

	it('sends an explode:false query array as one comma-separated value', async () => {
		mockedPagedRequest.mockResolvedValue({
			body: [],
			headers: new Headers({ 'x-has-more': 'false' }),
		});
		await endpointFor('auditLogs.list')(ctx, {
			start: '2026-11-19T00:00:00Z',
			end: '2026-11-20T00:00:00Z',
			exclude_method: ['GET', 'HEAD'],
		});
		expect(mockedPagedRequest.mock.calls[0]?.[0].query?.exclude_method).toBe(
			'GET,HEAD',
		);
	});
});

describe('files', () => {
	it('builds fs.upload as files[0][file] and files[0][dest_path]', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await endpointFor('browsers.fs.upload')(ctx, {
			id_or_name: 'abc',
			files: [
				{
					dest_path: '/tmp/a.txt',
					file: {
						base64: Buffer.from('hello').toString('base64'),
						filename: 'a.txt',
					},
				},
			],
		});
		const form = mockedRequest.mock.calls[0]?.[0].body as FormData;
		expect([...form.keys()]).toEqual(['files[0][dest_path]', 'files[0][file]']);
		const file = form.get('files[0][file]') as File;
		expect(file.name).toBe('a.txt');
		expect(await file.text()).toBe('hello');
	});

	it('builds loadExtensions as consecutive extensions.name / extensions.zip_file pairs', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await endpointFor('browsers.loadExtensions')(ctx, {
			id_or_name: 'abc',
			extensions: [
				{ name: 'one', zip_file: { base64: 'UEsFBg==', filename: 'one.zip' } },
				{ name: 'two', zip_file: { base64: 'UEsFBg==', filename: 'two.zip' } },
			],
		});
		const form = mockedRequest.mock.calls[0]?.[0].body as FormData;
		expect([...form.keys()]).toEqual([
			'extensions.name',
			'extensions.zip_file',
			'extensions.name',
			'extensions.zip_file',
		]);
		expect(form.getAll('extensions.name')).toEqual(['one', 'two']);
	});

	it('flattens deployment env_vars into env_vars[KEY]', async () => {
		mockedRequest.mockResolvedValue({ id: 'dep_1' });
		await endpointFor('deployments.create')(ctx, {
			entrypoint_rel_path: 'src/index.ts',
			file: { base64: 'UEsFBg==', filename: 'app.zip' },
			env_vars: { API_URL: 'https://example.com' },
		});
		const form = mockedRequest.mock.calls[0]?.[0].body as FormData;
		expect(form.get('env_vars[API_URL]')).toBe('https://example.com');
		expect(form.get('file')).toBeInstanceOf(File);
	});

	it('sends fs.writeFile as raw bytes with path and mode in the query', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await endpointFor('browsers.fs.writeFile')(ctx, {
			id_or_name: 'abc',
			path: '/tmp/notes.txt',
			mode: '0644',
			file: { base64: Buffer.from('notes').toString('base64') },
		});
		const sent = mockedRequest.mock.calls[0]?.[0];
		expect(sent?.query).toEqual({ path: '/tmp/notes.txt', mode: '0644' });
		expect(await (sent?.body as Blob).text()).toBe('notes');
	});

	it('returns a screenshot as a PNG file output', async () => {
		const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
		mockedRequest.mockResolvedValue({ bytes: png, contentType: 'image/png' });
		const result = await endpointFor('browsers.computer.captureScreenshot')(
			ctx,
			{
				id_or_name: 'abc',
			},
		);
		expect(result).toEqual({
			contentType: 'image/png',
			byteLength: 4,
			filename: 'screenshot.png',
			contentBase64: Buffer.from(png).toString('base64'),
		});
	});

	it('returns a text file read from the VM as text', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new TextEncoder().encode('a,b\n1,2\n'),
			contentType: 'application/octet-stream',
		});
		const result = await endpointFor('browsers.fs.readFile')(ctx, {
			id_or_name: 'abc',
			path: '/tmp/downloads/report.csv',
		});
		expect(result).toMatchObject({
			filename: 'report.csv',
			text: 'a,b\n1,2\n',
		});
	});

	it('says a replay is still being prepared when Kernel answers 202 with no body', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new Uint8Array(0),
			contentType: null,
		});
		await expect(
			endpointFor('browsers.replays.download')(ctx, {
				id_or_name: 'abc',
				replay_id: 'r1',
			}),
		).rejects.toThrow(/still preparing/);
	});

	it('names downloads after what they are', () => {
		expect(
			fileNameFor('browsers.fs.downloadDirZip', { path: '/tmp/out/' }),
		).toBe('out.zip');
		expect(
			fileNameFor('profiles.download', { id_or_name: 'p', format: 'tar' }),
		).toBe('profile-p.tar');
		// A legacy profile answers JSON whatever format was asked for.
		expect(
			fileNameFor(
				'profiles.download',
				{ id_or_name: 'p', format: 'tar' },
				'application/json',
			),
		).toBe('profile-p.json');
		expect(fileNameFor('auditLogs.exportChunk', {})).toBe(
			'audit-logs.jsonl.gz',
		);
	});
});

describe('outputs', () => {
	it('reads paging from the response headers', async () => {
		mockedPagedRequest.mockResolvedValue({
			body: [{ session_id: 'a' }, { session_id: 'b' }],
			headers: new Headers({ 'x-has-more': 'true', 'x-next-offset': '2' }),
		});
		const result = await endpointFor('browsers.list')(ctx, { limit: 2 });
		expect(result).toEqual({
			items: [{ session_id: 'a' }, { session_id: 'b' }],
			has_more: true,
			next_offset: 2,
		});
	});

	it('reads a page token for the audit log', async () => {
		mockedPagedRequest.mockResolvedValue({
			body: [],
			headers: new Headers({
				'x-has-more': 'true',
				'x-next-page-token': 'tok',
			}),
		});
		const result = await endpointFor('auditLogs.list')(ctx, {
			start: '2026-11-19T00:00:00Z',
			end: '2026-11-20T00:00:00Z',
		});
		expect(result).toEqual({
			items: [],
			has_more: true,
			next_page_token: 'tok',
		});
	});

	it('returns the next audit export cursor with the chunk', async () => {
		mockedPagedRequest.mockResolvedValue({
			body: {
				bytes: new TextEncoder().encode('{}\n'),
				contentType: 'application/x-ndjson',
			},
			headers: new Headers({ 'x-has-more': 'true', 'x-next-cursor': 'c2' }),
		});
		const result = await endpointFor('auditLogs.exportChunk')(ctx, {
			start: '2026-11-19T00:00:00Z',
			end: '2026-11-20T00:00:00Z',
			format: 'jsonl',
		});
		expect(result).toMatchObject({
			has_more: true,
			next_cursor: 'c2',
			text: '{}\n',
		});
	});

	it('returns null from browserPools.acquire when no browser freed up (204)', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await expect(
			endpointFor('browserPools.acquire')(ctx, { id_or_name: 'pool' }),
		).resolves.toBeNull();
	});

	it('keeps fields Kernel adds and accepts nulls it documents', async () => {
		mockedRequest.mockResolvedValue({
			session_id: 'abc',
			deleted_at: null,
			brand_new_field: { nested: true },
		});
		await expect(
			endpointFor('browsers.get')(ctx, { id_or_name: 'abc' }),
		).resolves.toEqual({
			session_id: 'abc',
			deleted_at: null,
			brand_new_field: { nested: true },
		});
	});

	it('fails a response whose declared types are wrong instead of passing it on', async () => {
		mockedRequest.mockResolvedValue({ session_id: 42 });
		await expect(
			endpointFor('browsers.get')(ctx, { id_or_name: 'abc' }),
		).rejects.toThrow(/did not match its documented schema: session_id/);
	});

	it('fails an empty body where JSON is documented', async () => {
		mockedRequest.mockResolvedValue(undefined);
		await expect(
			endpointFor('browsers.get')(ctx, { id_or_name: 'abc' }),
		).rejects.toThrow(/did not match/);
	});
});

describe('timeouts', () => {
	it("waits for an operation's own deadline plus a margin", () => {
		expect(timeoutFor('browsers.playwright.execute', {})).toBe(90_000);
		expect(
			timeoutFor('browsers.playwright.execute', { timeout_sec: 300 }),
		).toBe(330_000);
		expect(timeoutFor('browsers.curl', { timeout_ms: 60_000 })).toBe(90_000);
		expect(timeoutFor('search.contents.fetch', {})).toBe(90_000);
		expect(timeoutFor('vaults.items.get', { wait: 60 })).toBe(90_000);
	});

	it('waits out a 1Password approval poll instead of aborting at 30 s', () => {
		// timeout_seconds plus up to 20 s for the first scheduled check, plus the margin.
		expect(
			timeoutFor('vaults.items.performOperation', {
				type: '1pw_access_request_status',
				timeout_seconds: 120,
			}),
		).toBe(170_000);
		expect(
			timeoutFor('vaults.items.performOperation', {
				type: 'webmcp_invoke',
				timeout_sec: 120,
			}),
		).toBe(150_000);
		expect(
			timeoutFor('vaults.items.performOperation', { type: 'authorize' }),
		).toBe(120_000);
	});

	it('gives slow calls two minutes and the rest thirty seconds', () => {
		expect(timeoutFor('browsers.create', {})).toBe(120_000);
		expect(timeoutFor('auth.connections.login', {})).toBe(120_000);
		expect(timeoutFor('profiles.list', {})).toBe(30_000);
	});
});
