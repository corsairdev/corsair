import { request } from 'corsair/http';
import { ComposioEndpointInputSchemas } from './endpoints/types';
import { composio } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

const mockRequest = request as jest.Mock;

type Handler = (
	ctx: { key: string },
	input: Record<string, unknown>,
) => Promise<unknown>;
type EndpointTree = Record<string, Record<string, Handler | undefined>>;

describe('Composio v3 endpoint paths', () => {
	const plugin = composio({ key: 'ak_test' });
	const endpoints = plugin.endpoints as unknown as EndpointTree;
	const ctx = { key: 'ak_test' };

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ items: [], total_items: 0 });
	});

	function lastUrl(): string {
		const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
		return call?.[1]?.url as string;
	}

	it('hits v3 toolkits / tools / connected_accounts paths', async () => {
		await endpoints.apps?.list?.(ctx, {});
		expect(lastUrl()).toBe('/v3/toolkits');

		await endpoints.tools?.list?.(ctx, { toolkit_slug: 'gmail' });
		expect(lastUrl()).toBe('/v3/tools');

		await endpoints.tools?.get?.(ctx, { tool_slug: 'GMAIL_SEND_EMAIL' });
		expect(lastUrl()).toBe('/v3/tools/GMAIL_SEND_EMAIL');

		await endpoints.actions?.get?.(ctx, { tool_slug: 'GMAIL_SEND_EMAIL' });
		expect(lastUrl()).toBe('/v3/tools/GMAIL_SEND_EMAIL');

		mockRequest.mockResolvedValue({ successful: true, data: {} });
		await endpoints.actions?.execute?.(ctx, {
			tool_slug: 'GMAIL_SEND_EMAIL',
			arguments: { to: 'a@b.com' },
		});
		expect(lastUrl()).toBe('/v3/tools/execute/GMAIL_SEND_EMAIL');

		mockRequest.mockResolvedValue({ items: [] });
		await endpoints.connections?.list?.(ctx, {});
		expect(lastUrl()).toBe('/v3/connected_accounts');

		mockRequest.mockResolvedValue({ redirect_url: 'https://x' });
		await endpoints.connections?.create?.(ctx, {
			auth_config_id: 'ac_1',
			user_id: 'user_1',
		});
		expect(lastUrl()).toBe('/v3/connected_accounts/link');

		mockRequest.mockResolvedValue({ success: true });
		await endpoints.connections?.delete?.(ctx, {
			connected_account_id: 'ca_1',
		});
		expect(lastUrl()).toBe('/v3/connected_accounts/ca_1');
	});

	it('never uses removed /v1 paths', async () => {
		await endpoints.apps?.list?.(ctx, {});
		await endpoints.tools?.list?.(ctx, {});
		await endpoints.actions?.list?.(ctx, { toolkit_slug: 'github' });
		await endpoints.actions?.get?.(ctx, { tool_slug: 'github' });
		for (const call of mockRequest.mock.calls) {
			const url = call?.[1]?.url as string;
			expect(url.startsWith('/v1/')).toBe(false);
			expect(url.startsWith('/v3/')).toBe(true);
		}
	});

	it('matches Composio Standard Webhooks headers', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: {
					'webhook-signature': 'v1,x',
					'webhook-id': 'msg_1',
					'webhook-timestamp': '1',
				},
			} as never),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-composio-signature': 'x' },
			} as never),
		).toBe(false);
	});

	it('rejects actionExecute input missing both slug fields', () => {
		// A bare {} must fail schema validation instead of reaching the handler
		// and throwing an opaque Error.
		const result = ComposioEndpointInputSchemas.actionExecute.safeParse({});
		expect(result.success).toBe(false);
	});

	it('accepts actionExecute input with a tool_slug', () => {
		const result = ComposioEndpointInputSchemas.actionExecute.safeParse({
			tool_slug: 'GMAIL_SEND_EMAIL',
			arguments: { to: 'a@b.com' },
		});
		expect(result.success).toBe(true);
	});
});
