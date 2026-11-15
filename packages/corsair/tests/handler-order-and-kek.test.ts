import { createCorsair } from '../core';
import { CorsairKekMissingError } from '../core/auth/errors/kek-missing';
import type { CorsairErrorHandler } from '../core/errors';
import { handleCorsairError } from '../core/errors/handler';
import type { CorsairPlugin } from '../core/plugins';
import { createTestDatabase } from './setup-db';

class RateLimited extends Error {
	status = 429;
}

const isRateLimit = (error: Error) => error instanceof RateLimited;

// Most plugins' DEFAULT matches everything; it is the fallback, so the named
// handlers after it must still get their turn.
const pluginHandlers: CorsairErrorHandler = {
	DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
	RATE_LIMIT_ERROR: {
		match: isRateLimit,
		handler: async () => ({ maxRetries: 5 }),
	},
};

describe('handleCorsairError order', () => {
	it('tries named handlers before a match-all DEFAULT listed first', async () => {
		const strategy = await handleCorsairError(
			new RateLimited('429'),
			'probe',
			'items.list',
			{},
			pluginHandlers,
		);
		expect(strategy.maxRetries).toBe(5);
	});

	it('falls back to DEFAULT when no named handler matches', async () => {
		const strategy = await handleCorsairError(
			new Error('boom'),
			'probe',
			'items.list',
			{},
			pluginHandlers,
		);
		expect(strategy.maxRetries).toBe(0);
	});
});

// A one-endpoint plugin whose endpoint answers 429 a set number of times.
function probePlugin(calls: { n: number }, failures: number): CorsairPlugin {
	return {
		id: 'probe',
		options: { authType: 'api_key' },
		endpoints: {
			items: {
				list: async () => {
					calls.n += 1;
					if (calls.n <= failures) throw new RateLimited('429');
					return { ok: true };
				},
			},
		},
		errorHandlers: {
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
			RATE_LIMIT_ERROR: {
				match: isRateLimit,
				handler: async () => ({
					maxRetries: 2,
					retryStrategy: 'linear_1s',
					headersRetryAfterMs: 1,
				}),
			},
		},
		keyBuilder: async () => 'k',
		// CorsairPlugin's generics are inferred from a real plugin's schema and
		// endpoint tree; this one-endpoint stand-in has neither, so it is cast.
	} as unknown as CorsairPlugin;
}

type ProbeClient = {
	probe: {
		api: {
			items: { list: (a: Record<string, never>) => Promise<{ ok: boolean }> };
		};
	};
};

const rootCases: [string, CorsairErrorHandler | undefined][] = [
	['no root handlers', undefined],
	[
		'a root DEFAULT',
		{
			DEFAULT: { match: () => true, handler: async () => ({ maxRetries: 0 }) },
		},
	],
	[
		// A name the plugin doesn't define, so only the root has it.
		'a root-only handler that also matches',
		{
			AUTH_ERROR: {
				match: isRateLimit,
				handler: async () => ({ maxRetries: 0 }),
			},
		},
	],
];

describe('root and plugin handlers through createCorsair', () => {
	it.each(rootCases)(
		'with %s, the plugin retries its own 429',
		async (_label, root) => {
			const calls = { n: 0 };
			const corsair = createCorsair({
				plugins: [probePlugin(calls, 2)],
				...(root ? { errorHandlers: root } : {}),
				// The client type is built from registered plugin ids; 'probe' is not
				// one, so the test names the one route it calls.
			}) as unknown as ProbeClient;

			await expect(corsair.probe.api.items.list({})).resolves.toEqual({
				ok: true,
			});
			expect(calls.n).toBe(3);
		},
	);
});

describe('encryptDataAtRest without a kek', () => {
	it('refuses the call before the endpoint runs', async () => {
		const { database, cleanup } = createTestDatabase();
		try {
			const calls = { n: 0 };
			const corsair = createCorsair({
				plugins: [probePlugin(calls, 0)],
				database: database.db,
				encryptDataAtRest: true,
				// The client type is built from registered plugin ids; 'probe' is
				// not one, so the test names the one route it calls.
			}) as unknown as ProbeClient;

			await expect(corsair.probe.api.items.list({})).rejects.toBeInstanceOf(
				CorsairKekMissingError,
			);
			expect(calls.n).toBe(0);
		} finally {
			cleanup();
		}
	});
});
