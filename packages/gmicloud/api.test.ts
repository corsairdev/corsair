import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { GmicloudAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { gmicloud } from './index';
import { LIVE_RESPONSES, SPEC_CASES } from './test-samples';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const CONSOLE = 'https://console.gmicloud.ai/api';
const INFERENCE = 'https://api.gmi-serving.com';
const SANDBOX = 'https://sbx-7f3a.sandbox.gmicloud.ai';

const plugin = gmicloud();
// unknown: walks the nested endpoint tree by "group.name".
const endpoint = (op: string): AnyEndpoint => {
	const [group, name] = op.split('.') as [string, string];
	const groups = plugin.endpoints as unknown as Record<
		string,
		Record<string, AnyEndpoint>
	>;
	return groups[group]![name]!;
};

const fetchMock = jest.fn<Promise<Response>, [string, RequestInit]>();

function respond(
	status: number,
	// unknown: a JSON body, a text body, or nothing.
	body: unknown,
	headers: Record<string, string> = {},
) {
	fetchMock.mockImplementation(async () => {
		if (body === null) return new Response(null, { status, headers });
		const text = typeof body === 'string' ? body : JSON.stringify(body);
		return new Response(text, {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		});
	});
}

function table() {
	return {
		findByEntityId: jest.fn().mockResolvedValue(null),
		upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		deleteByEntityId: jest.fn().mockResolvedValue(true),
	};
}

function createContext(options: Record<string, string> = {}) {
	return {
		key: 'gmi-test-key',
		options,
		db: {
			models: table(),
			mediaRequests: table(),
			containers: table(),
			baremetals: table(),
			elasticIps: table(),
			firewalls: table(),
			sandboxes: table(),
			sandboxTemplates: table(),
		},
	};
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
	return {
		url: new URL(url),
		method: init.method,
		headers: new Headers(init.headers),
		init,
		body: typeof init.body === 'string' ? JSON.parse(init.body) : init.body,
	};
}

// unknown: a rejection can carry any value; each test asserts the error it expects.
const rejectionOf = (promise: Promise<unknown>): Promise<unknown> =>
	promise.then(
		() => {
			throw new Error('expected the call to reject');
		},
		(error: unknown) => error,
	);

beforeAll(() => {
	// unknown: the jest mock lacks fetch's static members, so it needs a two-step cast.
	global.fetch = fetchMock as unknown as typeof fetch;
});

beforeEach(() => {
	fetchMock.mockReset();
	jest.mocked(logEventFromContext).mockClear();
});

describe('every spec endpoint', () => {
	it('covers all 62 spec operations', () => {
		expect(Object.keys(SPEC_CASES)).toHaveLength(62);
	});

	it.each(Object.entries(SPEC_CASES))(
		'%s sends the documented request and parses the response',
		async (op, sample) => {
			respond(200, sample.response, { 'Content-Type': sample.contentType });
			const ctx = createContext();

			const result = await endpoint(op)(ctx, sample.input);

			const call = lastCall();
			const dataPlane = op.startsWith('sandboxExec.');
			expect(call.method).toBe(sample.request.method);
			expect(`${call.url.origin}${call.url.pathname}`).toBe(
				`${dataPlane ? SANDBOX : CONSOLE}/${sample.request.url}`,
			);
			const query = Object.fromEntries(
				[...call.url.searchParams.keys()].map((k) => {
					const all = call.url.searchParams.getAll(k);
					return [k, all];
				}),
			);
			for (const [k, v] of Object.entries(sample.request.query ?? {})) {
				expect(query[k]).toEqual((Array.isArray(v) ? v : [v]).map(String));
			}
			for (const [k, v] of Object.entries(sample.request.headers ?? {})) {
				expect(call.headers.get(k)).toBe(String(v));
			}
			if (dataPlane) {
				expect(call.headers.get('x-access-token')).toBe('sat-test');
				expect(call.headers.get('authorization')).toBeNull();
			} else {
				expect(call.headers.get('authorization')).toBe('Bearer gmi-test-key');
			}
			expect(call.body).toEqual(sample.request.body);

			if (sample.response === null) {
				expect(result).toEqual({ success: true });
			} else if (sample.contentType === 'text/plain') {
				expect(result).toEqual({ text: sample.response });
			} else {
				expect(result).toEqual(sample.response);
			}
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`gmicloud.${op}`,
				expect.any(Object),
				'completed',
			);
		},
	);
});

describe('inference', () => {
	it('models.list reads the OpenAI-compatible catalog and caches each model', async () => {
		respond(200, LIVE_RESPONSES.modelsList);
		const ctx = createContext();

		const result = (await endpoint('models.list')(ctx, {})) as {
			// unknown: overrides is a list of tiered prices; the test only checks it is kept.
			data: { id: string; pricing?: { overrides?: unknown } }[];
		};

		const call = lastCall();
		expect(call.method).toBe('GET');
		expect(call.url.href).toBe(`${INFERENCE}/v1/models`);
		expect(call.headers.get('authorization')).toBe('Bearer gmi-test-key');
		expect(result.data.map((m) => m.id)).toEqual([
			'deepseek-ai/deepseek-v4.1-flash-1017',
			'x-ai/grok-4.5',
		]);
		// Tiered pricing overrides are kept, not rejected.
		expect(result.data[1]!.pricing?.overrides).toBeDefined();
		expect(ctx.db.models.upsertByEntityId).toHaveBeenCalledWith(
			'deepseek-ai/deepseek-v4.1-flash-1017',
			expect.objectContaining({
				context_length: 1048575,
				owned_by: 'GMI Cloud',
			}),
		);
	});

	it('chat.createCompletion forces stream: false and keeps reasoning_content', async () => {
		respond(200, LIVE_RESPONSES.chatCreateCompletion);

		const result = (await endpoint('chat.createCompletion')(createContext(), {
			model: 'deepseek-ai/DeepSeek-V4-Flash',
			messages: [{ role: 'user', content: 'Reply with the single word: pong' }],
			max_tokens: 64,
		})) as {
			choices: { message: { content: string; reasoning_content?: string } }[];
		};

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(`${INFERENCE}/v1/chat/completions`);
		expect(call.body).toEqual({
			model: 'deepseek-ai/DeepSeek-V4-Flash',
			messages: [{ role: 'user', content: 'Reply with the single word: pong' }],
			max_tokens: 64,
			stream: false,
		});
		expect(result.choices[0]!.message.content).toBe('pong');
		expect(result.choices[0]!.message.reasoning_content).toBe(
			'We need to reply with single word "pong".',
		);
	});

	it('chat.createCompletion accepts a tool-call history without assistant content', async () => {
		respond(200, LIVE_RESPONSES.chatCreateCompletion);
		const messages = [
			{ role: 'user', content: 'What is the weather in Denver?' },
			{
				role: 'assistant',
				tool_calls: [
					{
						id: 'call_1',
						type: 'function',
						function: { name: 'get_weather', arguments: '{"city":"Denver"}' },
					},
				],
			},
			{ role: 'tool', tool_call_id: 'call_1', content: '{"temp_f":61}' },
		];
		const tools = [
			{
				type: 'function',
				function: {
					name: 'get_weather',
					parameters: {
						type: 'object',
						properties: { city: { type: 'string' } },
					},
				},
			},
		];

		await endpoint('chat.createCompletion')(createContext(), {
			model: 'deepseek-ai/DeepSeek-V4-Flash',
			messages,
			tools,
			tool_choice: 'auto',
		});

		expect(lastCall().body).toEqual({
			model: 'deepseek-ai/DeepSeek-V4-Flash',
			messages,
			tools,
			tool_choice: 'auto',
			stream: false,
		});
	});

	it('chat.createCompletion rejects a temperature above 2 before calling the API', async () => {
		await expect(
			endpoint('chat.createCompletion')(createContext(), {
				model: 'm',
				messages: [{ role: 'user', content: 'hi' }],
				temperature: 3,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('router.autoroute posts to the recommendation API without streaming', async () => {
		respond(200, LIVE_RESPONSES.routerAutoroute);

		const result = (await endpoint('router.autoroute')(createContext(), {
			messages: [{ role: 'user', content: 'Say hi in two words.' }],
			mode: 'cost',
		})) as { model: string; message: { content: string } };

		const call = lastCall();
		expect(call.url.href).toBe(`${CONSOLE}/v1/ie/recommendation/autoroute`);
		expect(call.body).toEqual({
			messages: [{ role: 'user', content: 'Say hi in two words.' }],
			mode: 'cost',
			stream: false,
		});
		expect(result.model).toBe('deepseek-ai/DeepSeek-V4-Flash-0731');
		expect(result.message.content).toBe('Hi there.');
	});

	it('mediaModels.list and mediaModels.get read the request queue catalog', async () => {
		respond(200, LIVE_RESPONSES.mediaModelsList);
		const list = (await endpoint('mediaModels.list')(createContext(), {})) as {
			model_ids: string[];
		};
		expect(lastCall().url.href).toBe(
			`${CONSOLE}/v1/ie/requestqueue/apikey/models`,
		);
		expect(list.model_ids).toHaveLength(5);

		respond(200, {
			model: 'Z-Image-Turbo',
			brief_description: 'Fast text-to-image',
			parameters: [{ name: 'prompt', type: 'string', required: true }],
		});
		const detail = (await endpoint('mediaModels.get')(createContext(), {
			model_id: 'Z-Image-Turbo',
		})) as { parameters: { name: string }[] };
		expect(lastCall().url.href).toBe(
			`${CONSOLE}/v1/ie/requestqueue/apikey/models/Z-Image-Turbo`,
		);
		expect(detail.parameters[0]!.name).toBe('prompt');
	});

	it('mediaRequests.create queues a job and caches it', async () => {
		respond(200, {
			request_id: '57aa4ff5-9ce4-4d83-9993-45f8f05a66b5',
			model: 'Z-Image-Turbo',
			status: 'queued',
			created_at: 1793011410,
			updated_at: 1793011410,
			queued_at: 1793011410,
		});
		const ctx = createContext();
		const payload = {
			prompt: 'a small red paper boat',
			width: 512,
			height: 512,
		};

		const result = (await endpoint('mediaRequests.create')(ctx, {
			model: 'Z-Image-Turbo',
			payload,
		})) as { request_id: string; status: string };

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(`${CONSOLE}/v1/ie/requestqueue/apikey/requests`);
		expect(call.body).toEqual({ model: 'Z-Image-Turbo', payload });
		expect(result.status).toBe('queued');
		expect(ctx.db.mediaRequests.upsertByEntityId).toHaveBeenCalledWith(
			'57aa4ff5-9ce4-4d83-9993-45f8f05a66b5',
			{
				requestId: '57aa4ff5-9ce4-4d83-9993-45f8f05a66b5',
				model: 'Z-Image-Turbo',
				status: 'queued',
				payload,
				createdAt: 1793011410,
				updatedAt: 1793011410,
			},
		);
	});

	it('mediaRequests.get saves only a final status, with the outcome URLs', async () => {
		const ctx = createContext();
		respond(200, LIVE_RESPONSES.mediaRequestsGet);
		await endpoint('mediaRequests.get')(ctx, {
			request_id: LIVE_RESPONSES.mediaRequestsGet.request_id,
		});
		expect(lastCall().url.href).toBe(
			`${CONSOLE}/v1/ie/requestqueue/apikey/requests/${LIVE_RESPONSES.mediaRequestsGet.request_id}`,
		);
		expect(ctx.db.mediaRequests.upsertByEntityId).not.toHaveBeenCalled();

		const outcome = {
			video_url: 'https://storage.googleapis.com/bucket/sample_0.mp4',
			thumbnail_image_url: 'https://storage.googleapis.com/bucket/sample_0.png',
		};
		respond(200, {
			...LIVE_RESPONSES.mediaRequestsGet,
			status: 'success',
			outcome,
		});
		const result = (await endpoint('mediaRequests.get')(ctx, {
			request_id: LIVE_RESPONSES.mediaRequestsGet.request_id,
		})) as { outcome: typeof outcome };
		expect(result.outcome).toEqual(outcome);
		expect(ctx.db.mediaRequests.upsertByEntityId).toHaveBeenCalledWith(
			LIVE_RESPONSES.mediaRequestsGet.request_id,
			expect.objectContaining({ status: 'success', outcome }),
		);
	});

	it('uploads.createUrl returns the pre-signed and public URLs', async () => {
		respond(200, LIVE_RESPONSES.uploadsCreateUrl);
		const result = (await endpoint('uploads.createUrl')(createContext(), {
			file_type: 'png',
		})) as { public_url: string };
		expect(lastCall().body).toEqual({ file_type: 'png' });
		expect(result.public_url).toBe(LIVE_RESPONSES.uploadsCreateUrl.public_url);
		await expect(
			endpoint('uploads.createUrl')(createContext(), { file_type: 'gif' }),
		).rejects.toThrow();
	});
});

describe('persistence', () => {
	it('list results merge into cached records instead of replacing them', async () => {
		const sample = SPEC_CASES['sandboxes.list']!;
		respond(200, sample.response);
		const ctx = createContext();
		ctx.db.sandboxes.findByEntityId.mockResolvedValue({
			data: {
				id: '6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
				domain: 'sandbox.gmicloud.ai',
			},
		});

		await endpoint('sandboxes.list')(ctx, {});

		const [id, saved] = ctx.db.sandboxes.upsertByEntityId.mock.calls[0]!;
		expect(id).toBe('6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c');
		// domain only comes from sandboxes.get, so the cached value survives a list.
		expect(saved.domain).toBe('sandbox.gmicloud.ai');
		expect(saved.state).toBe(
			(sample.response as { items: { state: string }[] }).items[0]!.state,
		);
	});

	it.each([
		['containers.delete', 'containers'],
		['baremetals.delete', 'baremetals'],
		['elasticIps.release', 'elasticIps'],
		['firewalls.delete', 'firewalls'],
		['sandboxes.delete', 'sandboxes'],
		['sandboxTemplates.delete', 'sandboxTemplates'],
	] as const)('%s removes the cached record', async (op, entity) => {
		respond(200, SPEC_CASES[op]!.response);
		const ctx = createContext();
		await endpoint(op)(ctx, SPEC_CASES[op]!.input);
		expect(ctx.db[entity].deleteByEntityId).toHaveBeenCalledWith(
			'6f1c2b9e-4d3a-4f6b-9c1e-2a7d8e5f4b3c',
		);
	});

	it('a database failure never fails the API call', async () => {
		respond(200, SPEC_CASES['containers.get']!.response);
		const ctx = createContext();
		ctx.db.containers.upsertByEntityId.mockRejectedValue(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

		await expect(
			endpoint('containers.get')(ctx, SPEC_CASES['containers.get']!.input),
		).resolves.toEqual(SPEC_CASES['containers.get']!.response);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('sandbox files', () => {
	const target = {
		sandbox_key: 'sbx-7f3a',
		domain: 'sandbox.gmicloud.ai',
		access_token: 'sat-test',
	};

	it('download returns the raw bytes as base64', async () => {
		const bytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]);
		fetchMock.mockImplementation(
			async () =>
				new Response(bytes, {
					status: 200,
					headers: { 'Content-Type': 'image/png' },
				}),
		);

		const result = await endpoint('sandboxFiles.download')(createContext(), {
			...target,
			path: '/home/user/out.png',
			range: 'bytes=0-5',
		});

		const call = lastCall();
		expect(call.url.href).toBe(
			`${SANDBOX}/files?path=%2Fhome%2Fuser%2Fout.png`,
		);
		expect(call.headers.get('x-access-token')).toBe('sat-test');
		expect(call.headers.get('range')).toBe('bytes=0-5');
		expect(result).toEqual({
			path: '/home/user/out.png',
			contentType: 'image/png',
			size: 6,
			contentBase64: 'iVBORwD/',
		});
	});

	it('download maps an error body to GmicloudAPIError', async () => {
		respond(404, { code: 'File.NotFound', message: 'no such file' });
		const error = await rejectionOf(
			endpoint('sandboxFiles.download')(createContext(), {
				...target,
				path: '/missing',
			}),
		);
		expect(error).toBeInstanceOf(GmicloudAPIError);
		expect(error).toMatchObject({
			status: 404,
			code: 'File.NotFound',
			message: '404 no such file',
		});
	});

	it('upload sends multipart form data with the decoded file', async () => {
		respond(200, [{ name: 'run.sh', path: '/home/user/run.sh', type: 'file' }]);

		const result = await endpoint('sandboxFiles.upload')(createContext(), {
			...target,
			path: '/home/user/run.sh',
			content: Buffer.from('echo hi\n').toString('base64'),
			encoding: 'base64',
		});

		const call = lastCall();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(`${SANDBOX}/files?path=%2Fhome%2Fuser%2Frun.sh`);
		expect(call.headers.get('authorization')).toBeNull();
		const form = call.init.body as FormData;
		expect(form).toBeInstanceOf(FormData);
		expect(await (form.get('file') as Blob).text()).toBe('echo hi\n');
		expect(result).toEqual([
			{ name: 'run.sh', path: '/home/user/run.sh', type: 'file' },
		]);
	});
});

describe('sandboxes.list filters', () => {
	it('sends metadata as metadata[key]=value and repeats state', async () => {
		respond(200, SPEC_CASES['sandboxes.list']!.response);

		await endpoint('sandboxes.list')(createContext(), {
			page: 2,
			page_size: 10,
			state: ['running', 'failed'],
			metadata: { team: 'blue', env: 'prod' },
		});

		expect(lastCall().url.search).toBe(
			'?page=2&page_size=10&state=running&state=failed&metadata%5Bteam%5D=blue&metadata%5Benv%5D=prod',
		);
	});
});

describe('sandbox exec', () => {
	it('runs a command on the sandbox host with its access token', async () => {
		respond(200, SPEC_CASES['sandboxExec.run']!.response);

		await endpoint('sandboxExec.run')(createContext(), {
			sandbox_key: 'sbx-7f3a',
			domain: 'us-denver-1.sandbox.gmicloud.ai',
			access_token: 'sat-test',
			wait: true,
			parameters: { command: 'echo hi', cwd: '/home/user' },
		});

		const call = lastCall();
		expect(call.url.href).toBe(
			'https://sbx-7f3a.us-denver-1.sandbox.gmicloud.ai/executions?wait=true',
		);
		expect(call.headers.get('x-access-token')).toBe('sat-test');
		expect(call.headers.get('authorization')).toBeNull();
		expect(call.body).toEqual({
			action: 'exec',
			parameters: { command: 'echo hi', cwd: '/home/user' },
		});
	});

	it('rejects a domain that is not a hostname', async () => {
		await expect(
			endpoint('sandboxExec.get')(createContext(), {
				sandbox_key: 'sbx-7f3a',
				domain: 'evil.example.com/steal?x=',
				access_token: 'sat-test',
				execution_id: '0b8d6c1e-2f4a-4b7c-9d3e-5a6f7b8c9d0e',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('client', () => {
	it('sends X-Organization-ID and honors base URL overrides', async () => {
		respond(200, LIVE_RESPONSES.idcsList);
		await endpoint('idcs.list')(
			createContext({
				organizationId: 'org-123',
				consoleBaseUrl: 'https://console.staging.gmicloud.ai/api/',
			}),
			{},
		);
		const call = lastCall();
		expect(call.url.href).toBe(
			'https://console.staging.gmicloud.ai/api/v1/idcs',
		);
		expect(call.headers.get('x-organization-id')).toBe('org-123');
	});

	it('surfaces the IAM error message and status', async () => {
		respond(401, { code: 200, group: 'api-key', message: 'Invalid API key.' });
		const error = await rejectionOf(
			endpoint('containers.list')(createContext(), {}),
		);
		expect(error).toBeInstanceOf(GmicloudAPIError);
		expect(error).toMatchObject({
			status: 401,
			code: '200',
			message: '401 Invalid API key.',
		});
	});

	it('surfaces compute { reason } and inference { error: { message } } bodies', async () => {
		respond(400, { reason: 'resources.CPU is a required property' });
		await expect(
			endpoint('containers.list')(createContext(), {}),
		).rejects.toThrow('400 resources.CPU is a required property');

		respond(503, { error: { message: 'Max retries (2) exhausted for model' } });
		await expect(endpoint('models.list')(createContext(), {})).rejects.toThrow(
			'503 Max retries (2) exhausted for model',
		);
	});

	it('reads Retry-After from a 429 and makes a single attempt', async () => {
		respond(
			429,
			{
				code: 'RateLimit.Exceeded',
				message: 'Too many requests',
				request_id: 'req-1',
			},
			{ 'Retry-After': '3' },
		);
		const error = await rejectionOf(
			endpoint('sandboxes.list')(createContext(), {}),
		);
		expect(error).toMatchObject({
			status: 429,
			retryAfter: 3000,
			code: 'RateLimit.Exceeded',
			requestId: 'req-1',
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('rejects a malformed response with a zod error', async () => {
		respond(200, { not: 'a list' });
		await expect(
			endpoint('containers.list')(createContext(), {}),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('error handlers', () => {
	const apiError = (status: number, retryAfter?: number) =>
		new GmicloudAPIError(`${status}`, undefined, { status, retryAfter });

	const classify = (error: Error) =>
		Object.entries(errorHandlers).find(([, h]) => h.match(error))?.[0];

	it.each([
		[400, 'VALIDATION_ERROR'],
		[409, 'VALIDATION_ERROR'],
		[422, 'VALIDATION_ERROR'],
		[401, 'AUTH_ERROR'],
		[403, 'PERMISSION_ERROR'],
		[404, 'NOT_FOUND_ERROR'],
		[410, 'NOT_FOUND_ERROR'],
		[429, 'RATE_LIMIT_ERROR'],
		[500, 'SERVER_ERROR'],
		[503, 'SERVER_ERROR'],
	])('maps %i to %s', (status, name) => {
		expect(classify(apiError(status))).toBe(name);
	});

	it('retries 429 using Retry-After and never replays a 5xx', async () => {
		expect(
			await errorHandlers.RATE_LIMIT_ERROR.handler(apiError(429, 3000)),
		).toEqual({
			maxRetries: 3,
			headersRetryAfterMs: 3000,
			retryStrategy: 'exponential_backoff',
		});
		expect(await errorHandlers.SERVER_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
});

describe('auth', () => {
	it('uses the key option, then the stored api key, and otherwise throws', async () => {
		const withKey = gmicloud({ key: 'from-options' });
		// unknown: the key builder only reads keys and authType from its context.
		const build = (p: typeof withKey, ctx: unknown) =>
			p.keyBuilder!(ctx as never, 'endpoint');

		await expect(build(withKey, {})).resolves.toBe('from-options');
		await expect(
			build(gmicloud(), {
				authType: 'api_key',
				keys: { get_api_key: async () => 'stored-key' },
			}),
		).resolves.toBe('stored-key');
		await expect(
			build(gmicloud(), {
				authType: 'api_key',
				keys: { get_api_key: async () => null },
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
