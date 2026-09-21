import 'dotenv/config';
import { AuthMissingError } from 'corsair/core';
import { makeWaboxappRequest } from './client';
import {
	AccountsGetStatusInputSchema,
	MessagesSendChatInputSchema,
	MessagesSendImageInputSchema,
	MessagesSendLinkInputSchema,
	MessagesSendMediaInputSchema,
	WaboxappEndpointOutputSchemas,
} from './endpoints/types';
import type { WaboxappKeyBuilderContext, WaboxappPluginOptions } from './index';
import { waboxapp, waboxappAuthConfig } from './index';
import {
	createWaboxappMatch,
	parseWaboxappWebhookBody,
	verifyWaboxappWebhookToken,
} from './webhooks/types';

function stubKeys(
	getApiKey: () => Promise<string | null>,
	getUid?: () => Promise<string | null>,
) {
	return {
		get_dek: async () => 'test-dek',
		issue_new_dek: async () => 'test-dek',
		get_api_key: getApiKey,
		set_api_key: async (_value: string | null): Promise<void> => undefined,
		get_uid: getUid ?? (async () => '34666123456'),
		set_uid: async (_value: string | null): Promise<void> => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async (_value: string | null): Promise<void> =>
			undefined,
	};
}

function stubKeyCtx(
	getApiKey: () => Promise<string | null>,
	overrides?: { key?: string; uid?: string },
): WaboxappKeyBuilderContext {
	return {
		authType: 'api_key',
		options: { authType: 'api_key', ...overrides },
		keys: stubKeys(getApiKey),
		tenantId: 'default',
	};
}

describe('Waboxapp Endpoint Schemas & Setup', () => {
	it('validates messagesSendChat input schema', () => {
		const input = {
			to: '34666789123',
			text: 'Hello from Corsair',
		};
		const parsed = MessagesSendChatInputSchema.parse(input);
		expect(parsed.to).toBe('34666789123');
		expect(parsed.text).toBe('Hello from Corsair');
	});

	it('validates messagesSendImage input schema', () => {
		const input = {
			to: '34666789123',
			url: 'https://example.com/image.png',
			caption: 'Photo caption',
		};
		const parsed = MessagesSendImageInputSchema.parse(input);
		expect(parsed.url).toBe('https://example.com/image.png');
		expect(parsed.caption).toBe('Photo caption');
	});

	it('validates messagesSendLink input schema', () => {
		const input = {
			to: '34666789123',
			url: 'https://example.com',
			description: 'Link description',
		};
		const parsed = MessagesSendLinkInputSchema.parse(input);
		expect(parsed.url).toBe('https://example.com');
		expect(parsed.description).toBe('Link description');
	});

	it('validates messagesSendMedia input schema', () => {
		const input = {
			to: '34666789123',
			url: 'https://example.com/doc.pdf',
		};
		const parsed = MessagesSendMediaInputSchema.parse(input);
		expect(parsed.url).toBe('https://example.com/doc.pdf');
	});

	it('validates accountsGetStatus input schema', () => {
		const input = { uid: '34666123456' };
		const parsed = AccountsGetStatusInputSchema.parse(input);
		expect(parsed.uid).toBe('34666123456');
	});

	it('validates messages output schema', () => {
		const output = {
			success: true,
			custom_uid: 'msg-custom-1',
		};
		const parsed = WaboxappEndpointOutputSchemas.messagesSendChat.parse(output);
		expect(parsed.success).toBe(true);
		expect(parsed.custom_uid).toBe('msg-custom-1');
	});

	it('validates accounts output schema', () => {
		const output = {
			success: true,
			uid: '34666123456',
			alias: 'desk',
			battery: '95',
			plugged: 'true',
		};
		const parsed =
			WaboxappEndpointOutputSchemas.accountsGetStatus.parse(output);
		expect(parsed.success).toBe(true);
		expect(parsed.alias).toBe('desk');
	});

	it('instantiates plugin with correct id and authConfig', () => {
		const plugin = waboxapp();
		expect(plugin.id).toBe('waboxapp');
		expect(waboxappAuthConfig.api_key.account).toContain('uid');
		expect(plugin.endpoints?.messages.sendChat).toBeDefined();
		expect(plugin.endpoints?.messages.sendImage).toBeDefined();
		expect(plugin.endpoints?.messages.sendLink).toBeDefined();
		expect(plugin.endpoints?.messages.sendMedia).toBeDefined();
		expect(plugin.endpoints?.accounts.getStatus).toBeDefined();
		expect(plugin.webhooks?.message.received).toBeDefined();
		expect(plugin.webhooks?.message.ack).toBeDefined();
	});

	it('resolves explicit key from options in keyBuilder', async () => {
		const plugin = waboxapp<WaboxappPluginOptions>({
			authType: 'api_key',
			key: 'explicit-token-123',
		});
		const ctx = stubKeyCtx(async () => 'vault-token', {
			key: 'explicit-token-123',
		});
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('explicit-token-123');
	});

	it('resolves key from keys manager when options.key is omitted', async () => {
		const plugin = waboxapp<WaboxappPluginOptions>({ authType: 'api_key' });
		const ctx = stubKeyCtx(async () => 'stored-vault-token');
		const key = await plugin.keyBuilder?.(ctx, 'endpoint');
		expect(key).toBe('stored-vault-token');
	});

	it('throws AuthMissingError when no key is found', async () => {
		const plugin = waboxapp<WaboxappPluginOptions>({ authType: 'api_key' });
		const ctx = stubKeyCtx(async () => '');
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('parses form webhook and validates secret token', () => {
		const body =
			'event=message&token=test_tok&uid=34666123456&contact%5Buid%5D=123&message%5Bbody%5D%5Btext%5D=Hi';
		const parsed = parseWaboxappWebhookBody(body);
		expect(parsed).toMatchObject({
			event: 'message',
			token: 'test_tok',
			uid: '34666123456',
		});
		expect(createWaboxappMatch('message')({ body, headers: {} })).toBe(true);
		expect(createWaboxappMatch('ack')({ body, headers: {} })).toBe(false);

		const valid = verifyWaboxappWebhookToken(
			{ payload: { token: 'test_tok' } },
			'test_tok',
		);
		expect(valid.valid).toBe(true);
	});
});

// Live tests run only when WABOXAPP_TOKEN is provided in the environment.
const LIVE_TOKEN =
	process.env.WABOXAPP_TOKEN ?? process.env.WABOXAPP_API_KEY ?? '';
const LIVE_UID = process.env.WABOXAPP_UID ?? '';

const describeLive = LIVE_TOKEN && LIVE_UID ? describe : describe.skip;

describeLive('Waboxapp Live API Integration', () => {
	it('retrieves live account status', async () => {
		const response = await makeWaboxappRequest<{
			success: boolean;
			uid?: string;
		}>(`status/${LIVE_UID}`, {
			method: 'GET',
			fields: { token: LIVE_TOKEN },
		});
		expect(response.success).toBe(true);
	});
});
