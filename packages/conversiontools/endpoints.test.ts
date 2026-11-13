import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import { CONVERSIONTOOLS_API_BASE } from './client';
import { Account, Conversions, Files, Tasks } from './endpoints';
import type { ConversiontoolsContext } from './index';
import { conversiontools, conversiontoolsEndpointSchemas } from './index';
import { DEFAULT_TRANSFER_TIMEOUT_MS } from './limits';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeConversiontoolsRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeConversiontoolsRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);
type Ctx = Parameters<typeof Account.verify>[0];

function buildCtx(): Ctx {
	const ctx: ConversiontoolsContext = {
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
	};
	return ctx;
}

const ctx = buildCtx();
const conversion = {
	type: 'convert.xml_to_json',
	title: 'XML to JSON',
	input_format: 'xml',
	output_format: 'json',
};
const uploadUrl =
	'https://api.conversiontools.io/v1/upload-sessions/session-id';
const FILE_ID = '0123456789abcdef0123456789abcdef';
const TASK_ID = 'fedcba9876543210fedcba9876543210';
const DOWNLOAD_ID = 'abcdef0123456789abcdef0123456789';

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('account endpoints', () => {
	it('verifies the API token at the API root', async () => {
		mockedRequest.mockResolvedValue({ error: null });
		const result = await Account.verify(ctx, {});

		expect(result).toEqual({ error: null });
		expect(mockedRequest).toHaveBeenCalledWith('/', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.account.verify',
			{ count: 1 },
			'completed',
		);
	});

	it('returns account info but never logs the email', async () => {
		mockedRequest.mockResolvedValue({
			error: null,
			email: 'private@example.com',
		});
		const result = await Account.getInfo(ctx, {});

		expect(result.email).toBe('private@example.com');
		expect(mockedRequest).toHaveBeenCalledWith('/auth', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.account.getInfo',
			{ count: 1 },
			'completed',
		);
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'private@example.com',
		);
	});

	it('gets account converter configuration from the live data envelope', async () => {
		// Live GET /v1/config shape (11-13): converters sit under `data`.
		const response = {
			error: null,
			data: {
				conversions: [{ type: 'convert.custom_xml', title: 'Custom XML' }],
				subscriptionStatus: 'active',
			},
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Account.getConfig(ctx, {});

		expect(result.data.conversions).toEqual([
			{ type: 'convert.custom_xml', title: 'Custom XML' },
		]);
		expect(mockedRequest).toHaveBeenCalledWith('/config', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.account.getConfig',
			{ count: 1 },
			'completed',
		);
	});
});

describe('conversion catalog endpoints', () => {
	it('lists converters with documented filters without credentials', async () => {
		const response = { error: null, count: 1, conversions: [conversion] };
		mockedRequest.mockResolvedValue(response);
		const result = await Conversions.list(ctx, {
			input: 'xml',
			output: 'json',
			ai: false,
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/conversions', undefined, {
			method: 'GET',
			query: { input: 'xml', output: 'json', ai: false },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.conversions.list',
			{ count: 1 },
			'completed',
		);
	});

	it('gets a converter by dynamic type without credentials', async () => {
		const response = { error: null, conversion };
		mockedRequest.mockResolvedValue(response);
		const result = await Conversions.get(ctx, { type: 'convert.xml_to_json' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/conversions/convert.xml_to_json',
			undefined,
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.conversions.get',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects an empty converter type before making a request', async () => {
		await expect(Conversions.get(ctx, { type: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('file endpoints', () => {
	it('uploads the documented multipart file field', async () => {
		const file = new Blob(['xml'], { type: 'application/xml' });
		const response = { error: null, file_id: FILE_ID };
		mockedRequest.mockResolvedValue(response);
		const result = await Files.upload(ctx, { file });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/files', 'test-api-key', {
			method: 'POST',
			formData: { file },
			timeoutMs: DEFAULT_TRANSFER_TIMEOUT_MS,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.upload',
			{ count: 1 },
			'completed',
		);
	});

	it('parses the upload response the API labels text/html', async () => {
		// Live POST /v1/files answers with Content-Type text/html, so the shared
		// request parser hands the JSON body back as a string.
		const file = new Blob(['xml'], { type: 'application/xml' });
		mockedRequest.mockResolvedValue(
			JSON.stringify({ error: null, file_id: FILE_ID }),
		);

		await expect(Files.upload(ctx, { file })).resolves.toEqual({
			error: null,
			file_id: FILE_ID,
		});
	});

	it('fails an upload whose body is not JSON', async () => {
		const file = new Blob(['xml'], { type: 'application/xml' });
		mockedRequest.mockResolvedValue('<html>Bad gateway</html>');

		await expect(Files.upload(ctx, { file })).rejects.toThrow(
			'Conversion Tools returned a response that is not JSON',
		);
	});

	it('gets file metadata by id', async () => {
		const response = { preview: false, size: 12, name: 'result.txt' };
		mockedRequest.mockResolvedValue(response);
		const result = await Files.getInfo(ctx, { file_id: FILE_ID });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/files/${FILE_ID}/info`,
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.getInfo',
			{ count: 1 },
			'completed',
		);
	});

	it('mints a temporary download link without logging its secret id', async () => {
		const response = { file_id: FILE_ID, download_id: DOWNLOAD_ID };
		mockedRequest.mockResolvedValue(response);
		const result = await Files.createDownloadLink(ctx, {
			file_id: FILE_ID,
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/files/${FILE_ID}/download`,
			'test-api-key',
			{ method: 'POST' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.createDownloadLink',
			{ count: 1 },
			'completed',
		);
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			DOWNLOAD_ID,
		);
	});

	it('downloads a file by ID with auth and keeps the binary response out of logs', async () => {
		const bytes = new Uint8Array([0x00, 0x80, 0xff]);
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(bytes, {
				headers: {
					'content-type': 'application/pdf',
					'content-disposition': 'attachment; filename="result.pdf"',
				},
			}),
		);

		const result = await Files.downloadById(ctx, { file_id: FILE_ID });

		expect(fetchSpy).toHaveBeenCalledWith(
			`${CONVERSIONTOOLS_API_BASE}/files/${FILE_ID}`,
			expect.objectContaining({
				method: 'GET',
				headers: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
		);
		expect(result).toEqual({
			contentBase64: 'AID/',
			contentType: 'application/pdf',
			contentDisposition: 'attachment; filename="result.pdf"',
			size: 3,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.downloadById',
			{ count: 1 },
			'completed',
		);
		const logPayload = JSON.stringify(mockedLogEvent.mock.calls[0]?.[2]);
		expect(logPayload).not.toContain('AID/');
		expect(logPayload).not.toContain('result.pdf');
	});

	it('downloads with a temporary ID without auth or logging the ID or bytes', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(new Uint8Array([0x41]), {
				headers: {
					'content-type': 'text/plain',
					'content-disposition': 'attachment; filename="secret-name.txt"',
				},
			}),
		);

		const result = await Files.downloadFromLink(ctx, {
			download_id: DOWNLOAD_ID,
		});

		expect(fetchSpy).toHaveBeenCalledWith(
			`${CONVERSIONTOOLS_API_BASE}/files/${DOWNLOAD_ID}/download`,
			expect.objectContaining({
				method: 'GET',
				headers: { Accept: 'application/octet-stream' },
			}),
		);
		expect(fetchSpy.mock.calls[0]?.[1]?.headers).not.toHaveProperty(
			'Authorization',
		);
		expect(result).toEqual({
			contentBase64: 'QQ==',
			contentType: 'text/plain',
			contentDisposition: 'attachment; filename="secret-name.txt"',
			size: 1,
		});
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.downloadFromLink',
			{ count: 1 },
			'completed',
		);
		const logPayload = JSON.stringify(mockedLogEvent.mock.calls[0]?.[2]);
		expect(logPayload).not.toContain(DOWNLOAD_ID);
		expect(logPayload).not.toContain('QQ==');
		expect(logPayload).not.toContain('secret-name.txt');
	});

	it('creates an upload session with the required filename', async () => {
		const response = {
			upload_url: uploadUrl,
			file_id: FILE_ID,
			expires_in: 300,
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Files.createUploadSession(ctx, {
			filename: 'source.xml',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/upload-sessions',
			'test-api-key',
			{
				method: 'POST',
				body: { filename: 'source.xml' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.createUploadSession',
			{ count: 1 },
			'completed',
		);
	});

	it('uploads raw bytes to the returned same-origin upload URL without auth', async () => {
		const file = new Blob(['xml']);
		const response = {
			file_id: FILE_ID,
			filename: 'source.xml',
			size: 3,
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Files.uploadToSession(ctx, {
			upload_url: uploadUrl,
			file,
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/upload-sessions/session-id',
			undefined,
			{
				method: 'PUT',
				body: file,
				baseUrl: 'https://api.conversiontools.io',
				timeoutMs: DEFAULT_TRANSFER_TIMEOUT_MS,
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.files.uploadToSession',
			{ count: 1 },
			'completed',
		);
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			'session-id',
		);
	});

	it('rejects an upload URL outside the provider API origin', async () => {
		await expect(
			Files.uploadToSession(ctx, {
				upload_url: 'https://example.com/v1/upload-sessions/session-id',
				file: new Blob(['xml']),
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an empty file id before making a request', async () => {
		await expect(Files.getInfo(ctx, { file_id: '' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('task endpoints', () => {
	it('creates an asynchronous task without logging task input', async () => {
		const response = { error: null, task_id: TASK_ID };
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.create(ctx, {
			type: 'convert.xml_to_json',
			options: { file_id: FILE_ID },
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/tasks', 'test-api-key', {
			method: 'POST',
			body: {
				type: 'convert.xml_to_json',
				options: { file_id: FILE_ID },
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.tasks.create',
			{ count: 1 },
			'completed',
		);
		expect(JSON.stringify(mockedLogEvent.mock.calls[0]?.[2])).not.toContain(
			FILE_ID,
		);
	});

	it('lists up to 50 tasks with the optional status filter', async () => {
		const response = {
			error: null,
			data: [{ id: TASK_ID, status: 'RUNNING' }],
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.list(ctx, { status: 'RUNNING' });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/tasks', 'test-api-key', {
			method: 'GET',
			query: { status: 'RUNNING' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.tasks.list',
			{ count: 1 },
			'completed',
		);
	});

	it('pages tasks with page and limit and returns the pagination block', async () => {
		// Live GET /v1/tasks?limit=1&page=2 shape (11-13), trimmed.
		const response = {
			error: null,
			data: [{ id: TASK_ID, status: 'SUCCESS', type: 'xml_to_json' }],
			pagination: { page: 2, limit: 1, total: 2, totalPages: 2 },
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.list(ctx, { page: 2, limit: 1 });

		expect(result.pagination).toEqual({
			page: 2,
			limit: 1,
			total: 2,
			totalPages: 2,
		});
		expect(mockedRequest).toHaveBeenCalledWith('/tasks', 'test-api-key', {
			method: 'GET',
			query: { page: 2, limit: 1 },
		});
	});

	it('rejects a tasks page size above the API cap of 100', async () => {
		await expect(Tasks.list(ctx, { limit: 101 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('gets task status without polling autonomously', async () => {
		const response = { error: null, status: 'PENDING', file_id: null };
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.get(ctx, { task_id: TASK_ID });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/tasks/${TASK_ID}`,
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.tasks.get',
			{ count: 1 },
			'completed',
		);
	});

	it('updates retention using a documented retention mode', async () => {
		const response = {
			error: null,
			retentionMode: 'ttl_15m',
			dateExpires: '2026-11-11T12:00:00.000Z',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.updateRetention(ctx, {
			task_id: TASK_ID,
			retentionMode: 'ttl_15m',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/tasks/${TASK_ID}/retention`,
			'test-api-key',
			{ method: 'PATCH', body: { retentionMode: 'ttl_15m' } },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.tasks.updateRetention',
			{ count: 1 },
			'completed',
		);
	});

	it('deletes task files via the documented destructive operation', async () => {
		const response = {
			error: null,
			message: 'File deletion scheduled',
			dateDeleted: '2026-11-11T12:00:00.000Z',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Tasks.remove(ctx, { task_id: TASK_ID });

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/tasks/${TASK_ID}/delete`,
			'test-api-key',
			{ method: 'POST' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'conversiontools.tasks.remove',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects task creation without a documented source', async () => {
		await expect(
			Tasks.create(ctx, { type: 'convert.xml_to_json', options: {} }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('conversiontools plugin shape', () => {
	it('exposes all compatible operations and no webhook handlers', () => {
		const plugin = conversiontools({});
		expect(plugin.endpoints?.account.verify).toBeDefined();
		expect(plugin.endpoints?.account.getInfo).toBeDefined();
		expect(plugin.endpoints?.account.getConfig).toBeDefined();
		expect(plugin.endpoints?.conversions.list).toBeDefined();
		expect(plugin.endpoints?.conversions.get).toBeDefined();
		expect(plugin.endpoints?.files.upload).toBeDefined();
		expect(plugin.endpoints?.files.getInfo).toBeDefined();
		expect(plugin.endpoints?.files.createDownloadLink).toBeDefined();
		expect(plugin.endpoints?.files.downloadById).toBeDefined();
		expect(plugin.endpoints?.files.downloadFromLink).toBeDefined();
		expect(plugin.endpoints?.files.createUploadSession).toBeDefined();
		expect(plugin.endpoints?.files.uploadToSession).toBeDefined();
		expect(plugin.endpoints?.tasks.create).toBeDefined();
		expect(plugin.endpoints?.tasks.list).toBeDefined();
		expect(plugin.endpoints?.tasks.get).toBeDefined();
		expect(plugin.endpoints?.tasks.updateRetention).toBeDefined();
		expect(plugin.endpoints?.tasks.remove).toBeDefined();
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('allows token-free operations without a credential store', async () => {
		const plugin = conversiontools({});
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('Conversion Tools keyBuilder is missing');
		for (const operation of [
			'conversions.list',
			'conversions.get',
			'files.downloadFromLink',
			'files.uploadToSession',
		]) {
			// Core omits ctx.keys when no database and KEK are configured.
			const context = {
				authType: 'api_key',
				options: {},
				tenantId: 'acme',
				meteredOperationId: operation,
			};
			await expect(
				Reflect.apply(keyBuilder, undefined, [context, 'endpoint']),
			).resolves.toBe('');
		}
	});

	it('keeps authenticated operations on the connect flow without a credential store', async () => {
		const plugin = conversiontools({});
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder) throw new Error('Conversion Tools keyBuilder is missing');
		// Core omits ctx.keys when no database and KEK are configured.
		const context = {
			authType: 'api_key',
			options: {},
			tenantId: 'acme',
			meteredOperationId: 'tasks.create',
		};

		await expect(
			Reflect.apply(keyBuilder, undefined, [context, 'endpoint']),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('bounds the configurable transfer timeout', () => {
		expect(() => conversiontools({ transferTimeoutMs: 20_000 })).not.toThrow();
		expect(() => conversiontools({ transferTimeoutMs: 600_000 })).not.toThrow();
		expect(() => conversiontools({ transferTimeoutMs: 19_999 })).toThrow(
			RangeError,
		);
		expect(() => conversiontools({ transferTimeoutMs: 600_001 })).toThrow(
			RangeError,
		);
	});

	it('registers input and output schemas for all implemented operations', () => {
		for (const schema of Object.values(conversiontoolsEndpointSchemas)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
		expect(Object.keys(conversiontoolsEndpointSchemas)).toHaveLength(17);
	});
});
