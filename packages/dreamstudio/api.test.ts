import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	DreamstudioAPIError,
	DreamstudioRateLimitError,
	initImageBlob,
	makeDreamstudioRequest,
} from './client';
import { generateImageFromImage } from './endpoints/generation';
import {
	DreamstudioEndpointInputSchemas,
	DreamstudioEndpointOutputSchemas,
} from './endpoints/types';
import { listEngines, userAccount, userBalance } from './endpoints/user';
import { dreamstudio } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

const mockFetch = jest.fn();
const PIXEL_PNG =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const originalFetch = globalThis.fetch;

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

afterAll(() => {
	globalThis.fetch = originalFetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	const headers = new Headers({
		'Content-Type': 'application/json',
		...(init?.headers as Record<string, string>),
	});
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers,
	});
}

function lastCall(): { url: string; auth: string | null; init: RequestInit } {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string | URL | Request,
		RequestInit | undefined,
	];
	const url =
		typeof input === 'string'
			? input
			: input instanceof URL
				? input.toString()
				: input.url;
	const headers = new Headers(init?.headers);
	return { url, auth: headers.get('Authorization'), init: init ?? {} };
}

const mockCtx = {
	key: 'sk-test',
	$getAccountId: async () => 'test-account',
} as never;

const officialAccount = {
	id: 'user-1234',
	email: 'example@stability.ai',
	organizations: [
		{
			id: 'org-5678',
			name: 'Another Organization',
			role: 'MEMBER',
			is_default: true,
		},
	],
	profile_picture: 'https://api.stability.ai/example.png',
};

const officialEngine = {
	id: 'stable-diffusion-xl-1024-v1-0',
	name: 'Stable Diffusion XL v1.0',
	description: 'Stability-AI Stable Diffusion XL v1.0',
	type: 'PICTURE',
};

describe('Dreamstudio plugin & client tests', () => {
	it('creates plugin instance with the four official ops', () => {
		const plugin = dreamstudio({ key: 'sk-test' });
		expect(plugin.id).toBe('dreamstudio');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(plugin.endpoints?.user.balance).toBeDefined();
		expect(plugin.endpoints?.user.account).toBeDefined();
		expect(plugin.endpoints?.engines.list).toBeDefined();
		expect(plugin.endpoints?.generation.imageFromImage).toBeDefined();
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const plugin = dreamstudio();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});

	it('gets user balance from GET /v1/user/balance', async () => {
		mockFetch.mockResolvedValue(jsonResponse({ credits: 0.41122252265928866 }));

		const input = DreamstudioEndpointInputSchemas.userBalance.parse({});
		const result = await userBalance(mockCtx, input);
		expect(result).toEqual({ credits: 0.41122252265928866 });
		DreamstudioEndpointOutputSchemas.userBalance.parse(result);

		const req = lastCall();
		expect(req.url).toBe('https://api.stability.ai/v1/user/balance');
		expect(req.auth).toBe('Bearer sk-test');
	});

	it('gets user account from GET /v1/user/account', async () => {
		mockFetch.mockResolvedValue(jsonResponse(officialAccount));

		const result = await userAccount(mockCtx, {});
		expect(result.id).toBe('user-1234');
		expect(result.organizations[0]?.is_default).toBe(true);
		DreamstudioEndpointOutputSchemas.userAccount.parse(result);

		expect(lastCall().url).toBe('https://api.stability.ai/v1/user/account');
	});

	it('lists engines from GET /v1/engines/list', async () => {
		mockFetch.mockResolvedValue(jsonResponse([officialEngine]));

		const result = await listEngines(mockCtx, {});
		expect(result.engines).toEqual([officialEngine]);
		DreamstudioEndpointOutputSchemas.listEngines.parse(result);
		expect(lastCall().url).toBe('https://api.stability.ai/v1/engines/list');
	});

	it('posts image-to-image multipart without deprecated width/height', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({
				artifacts: [
					{
						base64: PIXEL_PNG,
						finishReason: 'SUCCESS',
						seed: 1050625087,
					},
				],
			}),
		);

		const input = DreamstudioEndpointInputSchemas.generateImageFromImage.parse({
			engine_id: 'stable-diffusion-xl-1024-v1-0',
			init_image: PIXEL_PNG,
			text_prompts: [{ text: 'A lighthouse on a cliff', weight: 1 }],
			cfg_scale: 7,
			steps: 30,
		});
		const result = await generateImageFromImage(mockCtx, input);
		expect(result.artifacts[0]?.finishReason).toBe('SUCCESS');
		DreamstudioEndpointOutputSchemas.generateImageFromImage.parse(result);

		const req = lastCall();
		expect(req.url).toBe(
			'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
		);
		expect(req.init.method).toBe('POST');
		expect(req.init.body).toBeInstanceOf(FormData);
		const form = req.init.body as FormData;
		expect(form.get('text_prompts[0][text]')).toBe('A lighthouse on a cliff');
		expect(form.get('init_image_mode')).toBe('IMAGE_STRENGTH');
		expect(form.has('width')).toBe(false);
		expect(form.has('height')).toBe(false);
	});

	it('rejects unofficial engine payloads', async () => {
		mockFetch.mockResolvedValue(jsonResponse([{ id: 'missing-fields' }]));
		await expect(listEngines(mockCtx, {})).rejects.toThrow();
	});

	it('maps official Error JSON on 401', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{
					id: '296a972f-666a-44a1-a3df-c9c28a1f56c0',
					name: 'unauthorized',
					message: 'Header parameter Authorization is required, but not found',
				},
				{ status: 401 },
			),
		);

		await expect(
			makeDreamstudioRequest('/user/balance', 'bad-key'),
		).rejects.toMatchObject({
			name: 'DreamstudioAPIError',
			status: 401,
			code: 'unauthorized',
		});
	});

	it('maps 429 to DreamstudioRateLimitError', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse(
				{ name: 'rate_limited', message: 'Too many requests' },
				{
					status: 429,
					headers: { 'Retry-After': '2' },
				},
			),
		);

		const err = await makeDreamstudioRequest('/user/balance', 'sk-test').catch(
			(e: unknown) => e,
		);
		expect(err).toBeInstanceOf(DreamstudioRateLimitError);
		expect((err as DreamstudioRateLimitError).retryAfterMs).toBe(2000);
	});

	it('rejects http(s) init_image values', async () => {
		await expect(initImageBlob('https://example.com/x.png')).rejects.toThrow(
			DreamstudioAPIError,
		);
	});

	it('rejects empty success bodies', async () => {
		mockFetch.mockResolvedValue(new Response('', { status: 200 }));
		await expect(
			makeDreamstudioRequest('/user/balance', 'sk-test'),
		).rejects.toThrow(DreamstudioAPIError);
	});

	it('rejects non-JSON success bodies', async () => {
		mockFetch.mockResolvedValue(new Response('ok', { status: 200 }));
		await expect(
			makeDreamstudioRequest('/user/balance', 'sk-test'),
		).rejects.toThrow(DreamstudioAPIError);
	});
});
