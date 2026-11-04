import { logEventFromContext } from 'corsair/core';
import crypto from 'crypto';
import { WebhookEventTypes } from './endpoints/types';
import { events, signedHeaders, WEBHOOK_SECRET } from './test-fixtures';
import {
	AccountWebhooks,
	CalendarEventWebhooks,
	CalendarWebhooks,
	ChatWebhooks,
	EmailDraftWebhooks,
	EmailFolderWebhooks,
	EmailWebhooks,
	FollowerWebhooks,
	MessageWebhooks,
	matchUnipilePluginWebhook,
	matchUnipileTenantWebhook,
	parseUnipileSignatureHeader,
	RelationWebhooks,
	signUnipilePayload,
	TrackingWebhooks,
	verifyUnipileWebhookSignature,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

beforeEach(() => {
	mockLog.mockClear();
});

const NOW = 1_793_000_000;

function signedRequest(
	// unknown: any event object, serialized as Unipile would send it.
	body: unknown,
	options: { secret?: string; timestamp?: number } = {},
) {
	const rawBody = JSON.stringify(body);
	return {
		payload: body,
		rawBody,
		headers: signedHeaders(
			rawBody,
			options.secret ?? WEBHOOK_SECRET,
			options.timestamp ?? NOW,
		),
	};
}

describe('verifyUnipileWebhookSignature', () => {
	const body = events['message.new'];

	it('accepts the documented t=…,v0=… HMAC-SHA256 signature', () => {
		const request = signedRequest(body);
		expect(
			verifyUnipileWebhookSignature(request, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}),
		).toEqual({ valid: true });
	});

	it('matches the reference computation from the Unipile docs', () => {
		// HMAC_SHA256(secret, "${t}.${raw_body}").hex()
		expect(signUnipilePayload('secret', '1710662400', '{"a":1}')).toBe(
			crypto
				.createHmac('sha256', 'secret')
				.update('1710662400.{"a":1}')
				.digest('hex'),
		);
	});

	it('rejects a signature made with another secret', () => {
		const request = signedRequest(body, { secret: 'someone-else' });
		expect(
			verifyUnipileWebhookSignature(request, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}),
		).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('rejects a body changed after signing', () => {
		const request = signedRequest(body);
		const tampered = {
			...request,
			rawBody: request.rawBody.replace('Thanks', 'Thank'),
		};
		expect(
			verifyUnipileWebhookSignature(tampered, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}).valid,
		).toBe(false);
	});

	it('rejects a delivery older than five minutes', () => {
		const request = signedRequest(body, { timestamp: NOW - 301 });
		expect(
			verifyUnipileWebhookSignature(request, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}),
		).toEqual({
			valid: false,
			error: 'Webhook timestamp is too old or invalid',
		});
	});

	it('fails closed without a configured secret', () => {
		const request = signedRequest(body);
		for (const secret of ['', undefined]) {
			const result = verifyUnipileWebhookSignature(request, secret, {
				nowSeconds: NOW,
			});
			expect(result.valid).toBe(false);
			expect(result.error).toMatch(/no unipile webhook secret/i);
		}
	});

	it.each([
		['a missing header', {}],
		['a header with no v0', { 'unipile-signature': `t=${NOW}` }],
		['a header with no timestamp', { 'unipile-signature': 'v0=abc' }],
	])('rejects %s', (_label, headers) => {
		const request = { payload: body, rawBody: JSON.stringify(body), headers };
		expect(
			verifyUnipileWebhookSignature(request, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}).valid,
		).toBe(false);
	});

	it('rejects a request without the raw body', () => {
		const { rawBody: _raw, ...request } = signedRequest(body);
		expect(
			verifyUnipileWebhookSignature(request, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}),
		).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('accepts any listed v0, so a rotated secret still verifies', () => {
		// processWebhook lowercases header names before handlers see them.
		const request = signedRequest(body);
		const header = request.headers['unipile-signature'];
		const rotated = {
			...request,
			headers: { 'unipile-signature': `v0=${'0'.repeat(64)},${header}` },
		};
		expect(
			verifyUnipileWebhookSignature(rotated, WEBHOOK_SECRET, {
				nowSeconds: NOW,
			}).valid,
		).toBe(true);
		expect(
			parseUnipileSignatureHeader(rotated.headers['unipile-signature']),
		).toMatchObject({ timestamp: String(NOW) });
	});

	it('trusts a Hub-verified delivery, which carries no plugin key', () => {
		expect(
			verifyUnipileWebhookSignature(
				{ payload: body, headers: {}, hubVerified: true },
				undefined,
			),
		).toEqual({ valid: true });
	});
});

describe('Unipile webhook matchers', () => {
	const webhooks = {
		'relation.new': RelationWebhooks.new,
		'follower.new': FollowerWebhooks.new,
		'message.new': MessageWebhooks.new,
		'message.update': MessageWebhooks.update,
		'message.delete': MessageWebhooks.delete,
		'message.receipt.read': MessageWebhooks.receiptRead,
		'message.receipt.delivery': MessageWebhooks.receiptDelivery,
		'message.reaction.new': MessageWebhooks.reactionNew,
		'message.reaction.delete': MessageWebhooks.reactionDelete,
		'chat.update': ChatWebhooks.update,
		'chat.delete': ChatWebhooks.delete,
		'account.status.running': AccountWebhooks.statusRunning,
		'account.status.partial': AccountWebhooks.statusPartial,
		'account.status.degraded': AccountWebhooks.statusDegraded,
		'account.status.errored': AccountWebhooks.statusErrored,
		'account.status.disconnected': AccountWebhooks.statusDisconnected,
		'account.add': AccountWebhooks.add,
		'account.reconnect': AccountWebhooks.reconnect,
		'account.remove': AccountWebhooks.remove,
		'account.locked': AccountWebhooks.locked,
		'account.unlocked': AccountWebhooks.unlocked,
		'account.initial_sync.running': AccountWebhooks.initialSyncRunning,
		'account.initial_sync.completed': AccountWebhooks.initialSyncCompleted,
		'account.initial_sync.failed': AccountWebhooks.initialSyncFailed,
		'email.new': EmailWebhooks.new,
		'email.new.bounce': EmailWebhooks.bounce,
		'email.delete': EmailWebhooks.delete,
		'email.draft.new': EmailDraftWebhooks.new,
		'email.draft.delete': EmailDraftWebhooks.delete,
		'email.folder.create': EmailFolderWebhooks.create,
		'email.folder.update': EmailFolderWebhooks.update,
		'email.folder.delete': EmailFolderWebhooks.delete,
		'calendar.create': CalendarWebhooks.create,
		'calendar.update': CalendarWebhooks.update,
		'calendar.delete': CalendarWebhooks.delete,
		'calendar.event.new': CalendarEventWebhooks.new,
		'calendar.event.update': CalendarEventWebhooks.update,
		'calendar.event.delete': CalendarEventWebhooks.delete,
		'tracking.open': TrackingWebhooks.open,
		'tracking.click': TrackingWebhooks.click,
	} as const;

	const types = Object.keys(webhooks) as Array<keyof typeof webhooks>;

	it('has a webhook for every Unipile event type', () => {
		expect([...types].sort()).toEqual([...WebhookEventTypes].sort());
	});

	it.each(types)('%s matches only its own event type', (type) => {
		for (const other of types) {
			const request = { headers: {}, body: JSON.stringify(events[other]) };
			expect(webhooks[type].match(request)).toBe(type === other);
		}
	});

	it.each(types)('%s handles a signed delivery', async (type) => {
		const request = signedRequest(events[type], {
			timestamp: Math.floor(Date.now() / 1000),
		});

		// The fake context only carries what handlers read (key) plus what the
		// mocked logger receives.
		const result = await webhooks[type].handler(
			{ key: WEBHOOK_SECRET } as never,
			request as never,
		);

		expect(result).toMatchObject({
			success: true,
			data: { type, account_id: events[type].account_id },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			expect.stringMatching(/^unipile\.webhook\./),
			{ event_id: 'evt_0001', type, account_id: events[type].account_id },
			'completed',
		);
	});

	it('answers 401 to an unsigned delivery and logs nothing', async () => {
		const result = await MessageWebhooks.new.handler(
			{ key: WEBHOOK_SECRET } as never,
			{
				payload: events['message.new'],
				rawBody: JSON.stringify(events['message.new']),
				headers: {},
			} as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('answers 400 to a signed but malformed payload', async () => {
		const broken = {
			...events['relation.new'],
			payload: { object: 'UserRelation' },
		};
		const result = await RelationWebhooks.new.handler(
			{ key: WEBHOOK_SECRET } as never,
			signedRequest(broken, {
				timestamp: Math.floor(Date.now() / 1000),
			}) as never,
		);
		expect(result).toMatchObject({ success: false, statusCode: 400 });
	});

	it('keeps the auth link state on account.add', async () => {
		const result = await AccountWebhooks.add.handler(
			{ key: WEBHOOK_SECRET } as never,
			signedRequest(events['account.add'], {
				timestamp: Math.floor(Date.now() / 1000),
			}) as never,
		);
		expect(result.data?.payload.state).toBe('user_123');
		expect(result.data?.payload.account.provider).toBe('linkedin');
	});

	it('claims only signed Unipile event envelopes at plugin level', () => {
		const body = JSON.stringify(events['message.new']);
		expect(
			matchUnipilePluginWebhook({
				headers: { 'unipile-signature': `t=${NOW},v0=abc` },
				body,
			}),
		).toBe(true);
		// No signature header: not Unipile.
		expect(matchUnipilePluginWebhook({ headers: {}, body })).toBe(false);
		// Signed but another provider's shape.
		expect(
			matchUnipilePluginWebhook({
				headers: { 'unipile-signature': 'x' },
				body: { type: 'email.sent', data: {} },
			}),
		).toBe(false);
	});

	it('routes to a tenant by application_id', () => {
		expect(
			matchUnipileTenantWebhook({
				headers: {},
				body: events['relation.new'],
			}),
		).toEqual({ linkType: 'application_id', externalId: 'app_1a2b3c' });
		expect(
			matchUnipileTenantWebhook({ headers: {}, body: { type: 'x' } }),
		).toBeNull();
	});

	it('reads a JSON-string body the same way in every matcher', () => {
		const body = JSON.stringify(events['message.new']);
		const headers = { 'unipile-signature': `t=${NOW},v0=abc` };
		expect(matchUnipileTenantWebhook({ headers: {}, body })).toEqual({
			linkType: 'application_id',
			externalId: 'app_1a2b3c',
		});
		expect(matchUnipilePluginWebhook({ headers, body })).toBe(true);
		expect(MessageWebhooks.new.match({ headers, body })).toBe(true);
		for (const broken of ['not json', '[1,2]', 'null']) {
			expect(
				matchUnipileTenantWebhook({ headers: {}, body: broken }),
			).toBeNull();
			expect(matchUnipilePluginWebhook({ headers, body: broken })).toBe(false);
			expect(MessageWebhooks.new.match({ headers, body: broken })).toBe(false);
		}
	});
});
