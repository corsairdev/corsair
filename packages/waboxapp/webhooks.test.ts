import { processWebhook } from 'corsair';
import type { RawWebhookRequest } from 'corsair/core';
import { waboxapp } from './index';
import { matchWaboxappTenantWebhook } from './webhooks/tenant-matcher';
import {
	createWaboxappMatch,
	parseWaboxappWebhookBody,
	verifyWaboxappWebhookToken,
} from './webhooks/types';

const MESSAGE_BODY =
	'event=message&token=abcd1234&uid=34666123456' +
	'&contact%5Buid%5D=34666789123&contact%5Bname%5D=Peter&contact%5Btype%5D=user' +
	'&message%5Bdtm%5D=1487082303&message%5Buid%5D=62397B58E3E0B' +
	'&message%5Bdir%5D=i&message%5Btype%5D=chat' +
	'&message%5Bbody%5D%5Btext%5D=Hey%21+How+are+you+doing%3F&message%5Back%5D=3';

const ACK_BODY =
	'event=ack&token=abcd1234&uid=34666123456&muid=62397B58E3E0B&ack=3';

const formRequest = (body: string): RawWebhookRequest => ({
	headers: { 'content-type': 'application/x-www-form-urlencoded' },
	body,
});

describe('parseWaboxappWebhookBody', () => {
	it('parses a form-encoded message and nests bracket keys', () => {
		const parsed = parseWaboxappWebhookBody(MESSAGE_BODY);
		expect(parsed).not.toBeNull();
		expect(parsed).toMatchObject({
			event: 'message',
			token: 'abcd1234',
			uid: '34666123456',
			contact: {
				uid: '34666789123',
				name: 'Peter',
			},
			message: {
				uid: '62397B58E3E0B',
				type: 'chat',
				body: {
					text: 'Hey! How are you doing?',
				},
			},
		});
	});

	it('accepts an already nested object', () => {
		const parsed = parseWaboxappWebhookBody({
			event: 'ack',
			token: 't',
			uid: '1',
		});
		expect(parsed).toMatchObject({
			event: 'ack',
		});
	});

	it('nests flat bracket keys on an already-parsed object', () => {
		const parsed = parseWaboxappWebhookBody({
			event: 'message',
			token: 't',
			uid: '1',
			'contact[uid]': '2',
		});
		expect(parsed).toMatchObject({
			contact: {
				uid: '2',
			},
		});
	});

	it('returns null for empty or non-object bodies', () => {
		expect(parseWaboxappWebhookBody('')).toBeNull();
		expect(parseWaboxappWebhookBody(null)).toBeNull();
		expect(parseWaboxappWebhookBody(42)).toBeNull();
	});
});

describe('createWaboxappMatch', () => {
	it('matches message events and rejects ack', () => {
		expect(createWaboxappMatch('message')(formRequest(MESSAGE_BODY))).toBe(
			true,
		);
		expect(createWaboxappMatch('ack')(formRequest(MESSAGE_BODY))).toBe(false);
		expect(createWaboxappMatch('ack')(formRequest(ACK_BODY))).toBe(true);
	});
});

describe('pluginWebhookMatcher', () => {
	const plugin = waboxapp();

	it('accepts waboxapp message and ack payloads', () => {
		expect(plugin.pluginWebhookMatcher?.(formRequest(MESSAGE_BODY))).toBe(true);
		expect(plugin.pluginWebhookMatcher?.(formRequest(ACK_BODY))).toBe(true);
	});

	it('rejects a generic event field without uid and token', () => {
		expect(
			plugin.pluginWebhookMatcher?.(formRequest('event=push&ref=main')),
		).toBe(false);
	});
});

describe('matchWaboxappTenantWebhook', () => {
	it('routes by account uid, not the API token', () => {
		expect(matchWaboxappTenantWebhook(formRequest(MESSAGE_BODY))).toEqual({
			linkType: 'uid',
			externalId: '34666123456',
		});
	});
});

describe('verifyWaboxappWebhookToken', () => {
	it('accepts a token that matches the stored secret', () => {
		expect(
			verifyWaboxappWebhookToken(
				{ payload: { token: 'abcd1234' } },
				'abcd1234',
			),
		).toEqual({ valid: true });
	});

	it('rejects a mismatched token', () => {
		const result = verifyWaboxappWebhookToken(
			{ payload: { token: 'nope' } },
			'abcd1234',
		);
		expect(result.valid).toBe(false);
	});
});

/**
 * End-to-end test for processWebhook using a lightweight mock corsair.
 *
 * Framework adapters (Express body-parser, Next.js, Hono, etc.) always
 * pre-parse `application/x-www-form-urlencoded` bodies into objects before
 * they reach `processWebhook`. Core's `processWebhook` calls JSON.parse on
 * string bodies, which would throw for form-encoded strings — this is a
 * known core limitation, not a plugin bug. The Corsair Hub tunnel likewise
 * delivers payloads inside a JSON envelope, so the body is already an
 * object.
 *
 * This test uses a minimal mock corsair object (same pattern used by
 * packages/corsair/tests/process-webhook-plugin-hint.test.ts) to avoid the
 * better-sqlite3 native addon dependency.
 */

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

describe('processWebhook end-to-end', () => {
	const plugin = waboxapp({ key: 'abcd1234', uid: '34666123456' });

	/**
	 * Build a minimal mock corsair with bound webhooks (single-arg handlers).
	 * processWebhook calls `matched.webhook.handler(webhookRequest)` where
	 * the context is already captured. We inject a mock context with the
	 * token key so webhook verification succeeds.
	 */
	// unknown justified: processWebhook accepts a loose CorsairInstance record type.
	function makeMockCorsair(): unknown {
		// unknown justified: minimal mock context supplying key for webhook token verification.
		const mockCtx: unknown = { key: 'abcd1234' };
		const wh = plugin.webhooks;
		if (!wh) throw new Error('plugin.webhooks must be defined');
		const messageReceived = wh.message.received;
		const messageAck = wh.message.ack;
		return {
			waboxapp: {
				webhooks: {
					message: {
						received: {
							match: messageReceived.match,
							handler: (request: Record<string, unknown>) =>
								messageReceived.handler(
									// unknown justified: mock context satisfying WaboxappContext shape for test.
									mockCtx as Parameters<typeof messageReceived.handler>[0],
									// unknown justified: webhook request forwarded from processWebhook.
									request as Parameters<typeof messageReceived.handler>[1],
								),
						},
						ack: {
							match: messageAck.match,
							handler: (request: Record<string, unknown>) =>
								messageAck.handler(
									// unknown justified: mock context satisfying WaboxappContext shape for test.
									mockCtx as Parameters<typeof messageAck.handler>[0],
									// unknown justified: webhook request forwarded from processWebhook.
									request as Parameters<typeof messageAck.handler>[1],
								),
						},
					},
				},
				pluginWebhookMatcher: plugin.pluginWebhookMatcher,
			},
		};
	}

	it('matches and handles a pre-parsed form-encoded message webhook', async () => {
		// Framework adapters pre-parse form bodies into objects (e.g. Express
		// body-parser urlencoded middleware). Simulate that here.
		const parsedBody = parseWaboxappWebhookBody(MESSAGE_BODY);
		expect(parsedBody).not.toBeNull();

		const corsair = makeMockCorsair();
		const result = await processWebhook(
			// unknown justified: lightweight mock corsair satisfying CorsairInstance shape.
			corsair as Parameters<typeof processWebhook>[0],
			{ 'content-type': 'application/x-www-form-urlencoded' },
			parsedBody as Parameters<typeof processWebhook>[2],
		);

		expect(result.plugin).toBe('waboxapp');
		expect(result.action).toBe('message.received');
		expect(result.response?.success).toBe(true);
		expect(result.body).toMatchObject({
			event: 'message',
			uid: '34666123456',
			token: 'abcd1234',
		});
	});

	it('matches and handles a pre-parsed ack webhook', async () => {
		const parsedBody = parseWaboxappWebhookBody(ACK_BODY);
		expect(parsedBody).not.toBeNull();

		const corsair = makeMockCorsair();
		const result = await processWebhook(
			// unknown justified: lightweight mock corsair satisfying CorsairInstance shape.
			corsair as Parameters<typeof processWebhook>[0],
			{ 'content-type': 'application/x-www-form-urlencoded' },
			parsedBody as Parameters<typeof processWebhook>[2],
		);

		expect(result.plugin).toBe('waboxapp');
		expect(result.action).toBe('message.ack');
		expect(result.response?.success).toBe(true);
	});

	it('returns null plugin when body does not match waboxapp shape', async () => {
		const corsair = makeMockCorsair();
		const result = await processWebhook(
			// unknown justified: lightweight mock corsair satisfying CorsairInstance shape.
			corsair as Parameters<typeof processWebhook>[0],
			{ 'content-type': 'application/json' },
			{ type: 'push', ref: 'main' },
		);

		expect(result.plugin).toBeNull();
	});
});
