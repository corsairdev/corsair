import { AuthMissingError } from 'corsair/core';
import type { MondayMcpAPIError } from './client';
import { errorHandlers } from './error-handlers';
import { mondaymcp } from './index';

function collectEndpointPaths(
	nested: Record<string, unknown>,
	prefix = '',
): string[] {
	return Object.entries(nested).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		return typeof value === 'function'
			? [path]
			: collectEndpointPaths(value as Record<string, unknown>, path);
	});
}

describe('mondaymcp plugin registry', () => {
	const plugin = mondaymcp();
	const endpointPaths = collectEndpointPaths(
		plugin.endpoints as unknown as Record<string, unknown>,
	);

	it('registers exactly the 60 documented Platform MCP tools', () => {
		expect(endpointPaths.length).toBe(60);
		expect(new Set(endpointPaths).size).toBe(60);
	});

	it('aligns endpointMeta and endpointSchemas with the endpoint map', () => {
		const metaKeys = Object.keys(
			plugin.endpointMeta as Record<string, unknown>,
		);
		const schemaKeys = Object.keys(
			plugin.endpointSchemas as Record<string, unknown>,
		);
		expect(metaKeys.sort()).toEqual([...endpointPaths].sort());
		expect(schemaKeys.sort()).toEqual([...endpointPaths].sort());
	});

	it('classifies every op with a valid risk level', () => {
		const valid = new Set(['read', 'write', 'destructive']);
		for (const [, meta] of Object.entries(
			plugin.endpointMeta as Record<
				string,
				{ riskLevel: string; description: string }
			>,
		)) {
			expect(valid.has(meta.riskLevel)).toBe(true);
			expect(meta.description.length).toBeGreaterThan(0);
		}
	});

	it('marks read, write and destructive ops correctly', () => {
		const meta = plugin.endpointMeta as Record<string, { riskLevel: string }>;
		expect(meta['boards.getInfo']?.riskLevel).toBe('read');
		expect(meta['boards.create']?.riskLevel).toBe('write');
		expect(meta['automations.manage']?.riskLevel).toBe('destructive');
		expect(meta['agents.manage']?.riskLevel).toBe('destructive');
		expect(meta['schema.executeQuery']?.riskLevel).toBe('destructive');
	});

	it('registers as an api_key plugin with no webhooks', () => {
		expect(plugin.id).toBe('mondaymcp');
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.authConfig ?? {})).toEqual(['api_key']);
	});
});

describe('mondaymcp key builder', () => {
	it('prefers an explicitly configured key', async () => {
		const plugin = mondaymcp({ key: 'explicit-token' });
		const key = await plugin.keyBuilder?.(
			{ authType: 'api_key' } as never,
			'endpoint',
		);
		expect(key).toBe('explicit-token');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const plugin = mondaymcp();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => null },
				} as never,
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('mondaymcp error handlers', () => {
	function apiError(partial: Partial<MondayMcpAPIError>): MondayMcpAPIError {
		// Real thrown errors always carry a message; default it so partial
		// fixtures still exercise the message-matching branches.
		return { message: '', ...partial } as unknown as MondayMcpAPIError;
	}

	it('matches HTTP 429 and rate-limit messages', () => {
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(apiError({ status: 429 })),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too many requests')),
		).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('not found'))).toBe(
			false,
		);
	});

	it('carries Retry-After through to the handler result', async () => {
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
			apiError({ retryAfter: 5000 }),
		);
		expect(result).toEqual({ maxRetries: 0, headersRetryAfterMs: 5000 });
	});

	it('matches auth errors by status and message', () => {
		expect(errorHandlers.AUTH_ERROR.match(apiError({ status: 401 }))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(apiError({ status: 403 }))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(new Error('Unauthorized'))).toBe(
			true,
		);
		expect(errorHandlers.AUTH_ERROR.match(apiError({ status: 500 }))).toBe(
			false,
		);
	});

	it('matches server errors by status', () => {
		expect(errorHandlers.SERVER_ERROR.match(apiError({ status: 502 }))).toBe(
			true,
		);
		expect(errorHandlers.SERVER_ERROR.match(new Error('boom'))).toBe(false);
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});
