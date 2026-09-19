/**
 * @jest-environment jsdom
 */

// Provider-level regression locks for the two properties a static review flags on
// the reconnect flow:
//   1. call() never re-runs the operation unless a connect-request is pending —
//      an auth-missing failure records the request only after failing at the auth
//      gate (the privileged op never ran), so a rejection with no pending request
//      rethrows without a retry and can't double-fire a side effect.
//   2. A pending connect() resolves (false) instead of hanging when the provider
//      unmounts mid-flow.
// The concurrency logic itself is unit-tested in connect-controller.test.ts; these
// exercise the wiring through a mounted provider.

import { act, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { CorsairProvider, useCorsair } from '../client/react/provider';
import type { CorsairManagementClient } from '../client/types';

jest.mock('../client/index', () => ({
	createCorsairClient: jest.fn(),
}));

import { createCorsairClient } from '../client/index';

const mockCreateClient = createCorsairClient as jest.MockedFunction<
	typeof createCorsairClient
>;

function makeClient(): CorsairManagementClient {
	return {
		ok: jest.fn(),
		tenants: { list: jest.fn(), create: jest.fn(), get: jest.fn() },
		plugins: { list: jest.fn(), get: jest.fn() },
		connectionStatus: { get: jest.fn().mockResolvedValue({}) },
		permissions: { get: jest.fn() },
		connect: {
			createLink: jest.fn(),
			resolve: jest.fn(),
			oauthCallback: jest.fn(),
		},
		connectRequest: {
			get: jest.fn(),
			clear: jest.fn().mockResolvedValue({ ok: true }),
		},
	} as unknown as CorsairManagementClient;
}

let client: CorsairManagementClient;
let ctx: ReturnType<typeof useCorsair> | undefined;

function Capture(): null {
	ctx = useCorsair();
	return null;
}

function mountProvider() {
	return render(
		createElement(CorsairProvider, {
			captureUnhandled: false,
			children: createElement(Capture),
		}),
	);
}

beforeEach(() => {
	// jsdom has no matchMedia; the overlay reads prefers-color-scheme for 'auto'.
	window.matchMedia = jest.fn().mockReturnValue({
		matches: false,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	}) as unknown as typeof window.matchMedia;
	client = makeClient();
	mockCreateClient.mockReturnValue(client);
	ctx = undefined;
});

afterEach(() => {
	jest.clearAllMocks();
});

it('call() rethrows without re-running the op when no connect-request is pending', async () => {
	(client.connectRequest.get as jest.Mock).mockResolvedValue({ request: null });
	mountProvider();
	await waitFor(() => expect(ctx).toBeDefined());

	const fn = jest.fn().mockRejectedValue(new Error('auth boom'));
	await expect(ctx!.call(fn)).rejects.toThrow('auth boom');
	// Ran exactly once: no pending request → no retry → no duplicated side effect.
	expect(fn).toHaveBeenCalledTimes(1);
});

it('a pending connect() resolves false when the provider unmounts mid-flow', async () => {
	(client.connect.createLink as jest.Mock).mockResolvedValue({
		connectUrl: 'https://hub/connect/tok',
		tenantId: 'default',
	});
	const { unmount } = mountProvider();
	await waitFor(() => expect(ctx).toBeDefined());

	let pending: Promise<boolean>;
	await act(async () => {
		pending = ctx!.connect('linear');
		// let createLink resolve and openDialog register the waiter
		await new Promise((r) => setTimeout(r, 0));
	});

	act(() => unmount());
	await expect(pending!).resolves.toBe(false);
});
