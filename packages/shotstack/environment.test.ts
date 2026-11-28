import { ApiError } from 'corsair/http';
import {
	configuredEnvironment,
	parseShotstackEnvironment,
	resetShotstackEnvironmentCache,
	shotstackRequest,
} from './client';
import { Generations, Templates } from './endpoints';
import { templateList } from './test-fixtures';
import { captureError } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// What Shotstack answers a sandbox key on the production paths (live 11-28).
const unauthorized = {
	errors: [
		{
			status: '403',
			title: 'Forbidden',
			detail:
				'Invalid or disabled API key for the Production API. Check that your key is active, and that you are using your Production key rather than your Sandbox key. Both keys are available in your dashboard.',
		},
	],
};

function urls(): string[] {
	return fetchMock.mock.calls.map((call) => String(call[0]));
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	resetShotstackEnvironmentCache();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('parseShotstackEnvironment', () => {
	it.each([
		['v1', 'v1'],
		['production', 'v1'],
		[' Live ', 'v1'],
		['stage', 'stage'],
		['sandbox', 'stage'],
		['STAGING', 'stage'],
	])('reads %p as %p', (raw, expected) => {
		expect(parseShotstackEnvironment(raw)).toBe(expected);
	});

	it.each([undefined, null, '', '   '])('leaves %p unset', (raw) => {
		expect(parseShotstackEnvironment(raw)).toBeUndefined();
	});

	it('throws on anything else', () => {
		expect(() => parseShotstackEnvironment('eu')).toThrow(
			'environment must be v1 (production) or stage (sandbox)',
		);
	});
});

describe('configuredEnvironment', () => {
	it('prefers the plugin option over the stored account value', async () => {
		const get_environment = jest.fn().mockResolvedValue('stage');
		await expect(
			configuredEnvironment({
				key: 'k',
				options: { environment: 'v1' },
				keys: { get_environment },
			}),
		).resolves.toBe('v1');
		expect(get_environment).not.toHaveBeenCalled();
	});

	it('reads the stored account environment', async () => {
		await expect(
			configuredEnvironment({
				key: 'k',
				keys: { get_environment: async () => 'sandbox' },
			}),
		).resolves.toBe('stage');
	});

	it('treats an account with no DEK as unset', async () => {
		await expect(
			configuredEnvironment({
				key: 'k',
				keys: {
					get_environment: async () => {
						throw new Error('No DEK found for account');
					},
				},
			}),
		).resolves.toBeUndefined();
	});
});

describe('environment routing', () => {
	it('sends a stage account to the /stage paths', async () => {
		respond(templateList);
		await Templates.list(
			{
				key: 'sandbox-key',
				options: {},
				keys: { get_environment: async () => 'stage' },
			} as never,
			{} as never,
		);
		expect(urls()).toEqual(['https://api.shotstack.io/edit/stage/templates']);
	});

	it('tries production first, then the sandbox when production refuses the key, and remembers the answer', async () => {
		respond(unauthorized, 403);
		respond(templateList);
		respond(templateList);
		const ctx = { key: 'sandbox-key', options: {} } as never;

		await Templates.list(ctx, {} as never);
		await Templates.list(ctx, {} as never);

		expect(urls()).toEqual([
			'https://api.shotstack.io/edit/v1/templates',
			'https://api.shotstack.io/edit/stage/templates',
			'https://api.shotstack.io/edit/stage/templates',
		]);
	});

	it('keeps production for a key production accepts', async () => {
		respond(templateList);
		await Templates.list(
			{ key: 'prod-key', options: {} } as never,
			{} as never,
		);
		expect(urls()).toEqual(['https://api.shotstack.io/edit/v1/templates']);
	});

	it('also falls back on a plain 401', async () => {
		respond({ message: 'Unauthorized' }, 401);
		respond(templateList);
		await Templates.list({ key: 'k401', options: {} } as never, {} as never);
		expect(urls()).toEqual([
			'https://api.shotstack.io/edit/v1/templates',
			'https://api.shotstack.io/edit/stage/templates',
		]);
	});

	it('does not try the sandbox after a plan-gated 403', async () => {
		respond({ error: 'Your plan does not include this.' }, 403);
		const error = await captureError(
			Generations.listModels(
				{ key: 'prod-key', options: {} } as never,
				{} as never,
			),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect(urls()).toHaveLength(1);
	});

	it('throws the last refusal when neither environment takes the key', async () => {
		respond(unauthorized, 403);
		respond(unauthorized, 403);
		const error = await captureError(
			shotstackRequest(
				{ key: 'wrong-key' },
				{ method: 'GET', service: 'edit', path: '/templates' },
			),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(403);
		expect((error as ApiError).url).toContain('/edit/stage/');
		expect(urls()).toHaveLength(2);
	});

	it('never retries a configured environment when the key is refused', async () => {
		respond(unauthorized, 403);
		await captureError(
			shotstackRequest(
				{ key: 'k', options: { environment: 'v1' } },
				{ method: 'POST', service: 'edit', path: '/render', body: {} },
			),
		);
		expect(urls()).toEqual(['https://api.shotstack.io/edit/v1/render']);
	});
});

describe('generations.listModels expand', () => {
	it('sends expand=options only when asked', async () => {
		respond({ models: [] });
		respond({ models: [] });
		const ctx = { key: 'k', options: { environment: 'v1' } } as never;
		await Generations.listModels(ctx, { expand: 'options' } as never);
		await Generations.listModels(ctx, {} as never);
		expect(urls()).toEqual([
			'https://api.shotstack.io/edit/v1/models?expand=options',
			'https://api.shotstack.io/edit/v1/models',
		]);
	});
});
