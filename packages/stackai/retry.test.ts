import { createCorsair } from 'corsair/core';
import type { StackAIContext } from './index';
import { StackAIAPIError, stackai } from './index';

describe('bound write retries', () => {
	it('does not replay a write when a root handler matches its failure', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ detail: ['busy'] }), { status: 500 }),
			);
		const client = createCorsair({
			plugins: [stackai({ key: 'test-key' })],
			errorHandlers: {
				CUSTOM: {
					match: () => true,
					handler: async () => ({ maxRetries: 1 }),
				},
			},
		});
		try {
			await expect(
				client.stackai.api.runs.start({ project_id: 'p', input: {} }),
			).rejects.toBeInstanceOf(StackAIAPIError);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it('keeps simultaneous writes independent even with a retrying root handler', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(
				async () =>
					new Response(JSON.stringify({ detail: ['busy'] }), { status: 500 }),
			);
		const client = createCorsair({
			plugins: [stackai({ key: 'test-key' })],
			errorHandlers: {
				CUSTOM: { match: () => true, handler: async () => ({ maxRetries: 1 }) },
			},
		});
		try {
			const results = await Promise.allSettled([
				client.stackai.api.runs.start({ project_id: 'same', input: {} }),
				client.stackai.api.runs.start({ project_id: 'same', input: {} }),
			]);
			expect(
				results.every(
					(result) =>
						result.status === 'rejected' &&
						result.reason instanceof StackAIAPIError,
				),
			).toBe(true);
			expect(fetchMock).toHaveBeenCalledTimes(2);
		} finally {
			fetchMock.mockRestore();
		}
	});

	it.each(['cancel', 'resume'] as const)(
		'does not replay %s after a transport failure',
		async (operation) => {
			const transportError = new TypeError('network unavailable');
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockRejectedValue(transportError);
			const client = createCorsair({
				plugins: [stackai({ key: 'test-key' })],
				errorHandlers: {
					CUSTOM: {
						match: () => true,
						handler: async () => ({ maxRetries: 1 }),
					},
				},
			});
			const run_id = '00000000-0000-4000-8000-000000000000';
			try {
				const call =
					operation === 'cancel'
						? client.stackai.api.runs.cancel({ run_id })
						: client.stackai.api.runs.resume({
								run_id,
								resume_token: 'token',
								response: 'yes',
							});
				await expect(call).rejects.toBe(transportError);
				expect(fetchMock).toHaveBeenCalledTimes(1);
			} finally {
				fetchMock.mockRestore();
			}
		},
	);

	it('preserves user hooks and allows separate calls when the before hook reuses a context', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async () => new Response('{}', { status: 202 }));
		let reused: StackAIContext | undefined;
		const before = jest.fn((ctx: StackAIContext, args: { run_id: string }) => ({
			ctx: (reused ??= ctx),
			args,
			passToAfter: 'marker',
		}));
		// Hooks accept context and result values supplied by Corsair; this test
		// checks invocation only and does not assume their runtime shapes.
		const after = jest.fn(
			(_ctx: unknown, _result: unknown, _marker?: string) => undefined,
		);
		const client = createCorsair({
			plugins: [
				stackai({
					key: 'test-key',
					hooks: { runs: { cancel: { before, after } } },
				}),
			],
		});
		try {
			const run_id = '00000000-0000-4000-8000-000000000000';
			await client.stackai.api.runs.cancel({ run_id });
			await client.stackai.api.runs.cancel({ run_id });
			expect(fetchMock).toHaveBeenCalledTimes(2);
			expect(before).toHaveBeenCalledTimes(2);
			expect(after).toHaveBeenCalledTimes(2);
			expect(after.mock.calls[0]?.[2]).toBe('marker');
		} finally {
			fetchMock.mockRestore();
		}
	});
});
