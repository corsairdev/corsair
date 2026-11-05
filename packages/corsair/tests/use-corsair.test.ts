/**
 * @jest-environment jsdom
 */

import { act, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { CorsairProvider, useCorsair } from '../client/react';
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
		call: jest.fn(),
	} as unknown as CorsairManagementClient;
}

let client: CorsairManagementClient;
let latest: ReturnType<ReturnType<typeof useCorsair>['useApi']> | undefined;

function Capture(): null {
	const { useApi } = useCorsair();
	latest = useApi('notion.pages.searchPage', { query: 'roadmap' });
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
	window.matchMedia = jest.fn().mockReturnValue({
		matches: false,
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
	}) as unknown as typeof window.matchMedia;
	client = makeClient();
	mockCreateClient.mockReturnValue(client);
	latest = undefined;
});

afterEach(() => {
	jest.clearAllMocks();
});

describe('useCorsair — useApi', () => {
	it('splits pluginOp into plugin/op, posts through the client, and resolves data', async () => {
		const result = { title: 'Roadmap' };
		(client.call as jest.Mock).mockResolvedValue(result);

		act(() => {
			mountProvider();
		});

		expect(latest?.loading).toBe(true);
		expect(latest?.data).toBeNull();

		await waitFor(() => expect(latest?.loading).toBe(false));

		expect(client.call).toHaveBeenCalledWith(
			'notion',
			'pages.searchPage',
			'default',
			{ query: 'roadmap' },
		);
		expect(latest?.data).toEqual(result);
		expect(latest?.error).toBeNull();
	});

	it('transitions to error when the call rejects', async () => {
		(client.call as jest.Mock).mockRejectedValue(new Error('not_connected'));

		act(() => {
			mountProvider();
		});

		await waitFor(() => expect(latest?.loading).toBe(false));

		expect(latest?.data).toBeNull();
		expect(latest?.error?.message).toBe('not_connected');
	});

	it('db is a reserved placeholder', () => {
		function CaptureDb(): null {
			const { db } = useCorsair();
			expect(db).toBeUndefined();
			return null;
		}
		render(
			createElement(CorsairProvider, {
				captureUnhandled: false,
				children: createElement(CaptureDb),
			}),
		);
	});
});
