import * as client from '../client';
import type { ZoominfoSubscribeContext } from './subscribe';
import { zoominfoSubscribe } from './subscribe';

const requestSpy = jest.spyOn(client, 'makeZoominfoRequest');

const WEBHOOK_URL = 'https://hub.example.com/zoominfo';

// Shapes below are ZoomInfo's own documented Monitoring API responses.
const createdWebhook = {
	id: '967763288',
	title: 'Corsair',
	enabled: false,
	targetUrl: WEBHOOK_URL,
	createdDate: '02-15-2021T11:56:11.000Z',
	verificationToken: 'i7MOAD4/44zzgsru6toJyiFRJhFqaiYU',
	subscriptions: [
		{
			createdDate: '02-15-2021T11:56:11.000Z',
			modifiedDate: '02-15-2021T11:56:11.000Z',
			eventType: 'Update',
			objectType: 'Contact',
			fullPayload: true,
			subscriptionId: '908986303',
		},
	],
};

/** GET /webhooks lists webhooks without ever repeating their tokens. */
const { verificationToken: _token, ...listedWebhook } = createdWebhook;

function makeCtx(overrides: Record<string, unknown> = {}) {
	const keys = {
		get_access_token: jest.fn().mockResolvedValue('cached-jwt'),
		get_expires_at: jest
			.fn()
			.mockResolvedValue(String(Date.now() + 30 * 60 * 1000)),
		get_integration_credentials: jest.fn().mockResolvedValue({}),
		set_access_token: jest.fn().mockResolvedValue(undefined),
		set_expires_at: jest.fn().mockResolvedValue(undefined),
		set_webhook_signature: jest.fn().mockResolvedValue(undefined),
		...overrides,
	};
	return {
		ctx: { tenantId: 't1', keys } as unknown as ZoominfoSubscribeContext,
		keys,
	};
}

/** Routes each call by path so the order of assertions does not matter. */
function route(handlers: Record<string, unknown>) {
	requestSpy.mockImplementation(async (path: string) => {
		if (!(path in handlers)) throw new Error(`unexpected path: ${path}`);
		return handlers[path] as never;
	});
}

beforeEach(() => {
	requestSpy.mockReset();
});

afterAll(() => {
	requestSpy.mockRestore();
});

describe('creating the webhook', () => {
	it('links the account on the id ZoomInfo assigns', async () => {
		route({ webhooks: createdWebhook, 'webhooks/967763288': {} });
		const { ctx } = makeCtx();

		const result = await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(result).toEqual({
			webhookLink: {
				linkType: 'tenant_external_id',
				externalId: '967763288',
			},
			webhookSecret: createdWebhook.verificationToken,
		});
	});

	it('subscribes to Update for both object types', async () => {
		route({ webhooks: createdWebhook, 'webhooks/967763288': {} });
		const { ctx } = makeCtx();

		await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		const create = requestSpy.mock.calls.find(
			([path, , options]) => path === 'webhooks' && options?.method === 'POST',
		);
		expect(create?.[2]?.body).toEqual({
			title: 'Corsair',
			enabled: false,
			targetUrl: WEBHOOK_URL,
			subscriptions: [
				{ eventType: 'Update', objectType: 'Contact', fullPayload: true },
				{ eventType: 'Update', objectType: 'Company', fullPayload: true },
			],
		});
	});

	// The docs recommend creating disabled so the token is in place before any
	// delivery can arrive; enabling is a separate call.
	it('creates the webhook disabled and enables it afterwards', async () => {
		route({ webhooks: createdWebhook, 'webhooks/967763288': {} });
		const { ctx } = makeCtx();

		await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		const methods = requestSpy.mock.calls.map(
			([path, , options]) => `${options?.method} ${path}`,
		);
		expect(methods).toEqual([
			'GET webhooks',
			'POST webhooks',
			'PUT webhooks/967763288',
		]);
	});

	it('stores the verification token before the webhook goes live', async () => {
		const order: string[] = [];
		const { ctx, keys } = makeCtx({
			set_webhook_signature: jest.fn(async () => {
				order.push('stored token');
			}),
		});
		requestSpy.mockImplementation(async (path: string, _key, options) => {
			order.push(`${options?.method} ${path}`);
			return (
				path === 'webhooks' && options?.method === 'POST' ? createdWebhook : {}
			) as never;
		});

		await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(keys.set_webhook_signature).toHaveBeenCalledWith(
			createdWebhook.verificationToken,
		);
		expect(order.indexOf('stored token')).toBeLessThan(
			order.indexOf('PUT webhooks/967763288'),
		);
	});
});

describe('reconnecting', () => {
	// ZoomInfo has no upsert, so a second connect would otherwise leave two
	// webhooks firing at the same URL.
	it('reuses the webhook already pointing at this URL', async () => {
		route({
			webhooks: { webhooks: [{ ...listedWebhook, enabled: true }] },
			'webhooks/967763288': {},
			'webhooks/967763288/token': { verificationToken: 'rotated-token' },
		});
		const { ctx } = makeCtx();

		const result = await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(
			requestSpy.mock.calls.some(
				([path, , options]) =>
					path === 'webhooks' && options?.method === 'POST',
			),
		).toBe(false);
		expect(result?.webhookSecret).toBe('rotated-token');
	});

	// The listing never repeats an existing webhook's token, so reuse has to
	// rotate to one both sides know.
	it('rotates a fresh token for the reused webhook', async () => {
		route({
			webhooks: { webhooks: [listedWebhook] },
			'webhooks/967763288': {},
			'webhooks/967763288/token': { verificationToken: 'rotated-token' },
		});
		const { ctx, keys } = makeCtx();

		await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(keys.set_webhook_signature).toHaveBeenCalledWith('rotated-token');
	});

	it('creates a new webhook when none targets this URL', async () => {
		route({
			webhooks: {
				webhooks: [{ ...listedWebhook, targetUrl: 'https://elsewhere.test' }],
			},
			'webhooks/967763288': {},
		});
		const { ctx } = makeCtx();

		// The create call answers on the same path, so re-route it once listed.
		requestSpy.mockImplementation(async (path: string, _key, options) => {
			if (path === 'webhooks' && options?.method === 'GET') {
				return {
					webhooks: [{ ...listedWebhook, targetUrl: 'https://elsewhere.test' }],
				} as never;
			}
			if (path === 'webhooks') return createdWebhook as never;
			return {} as never;
		});

		const result = await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(result?.webhookLink.externalId).toBe('967763288');
	});
});

describe('authentication', () => {
	it('reuses the account token rather than minting a new JWT', async () => {
		route({ webhooks: createdWebhook, 'webhooks/967763288': {} });
		const { ctx, keys } = makeCtx();

		await zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL });

		expect(keys.set_access_token).not.toHaveBeenCalled();
		expect(requestSpy.mock.calls[0]?.[1]).toBe('cached-jwt');
	});

	it('fails when the account has no usable credentials', async () => {
		const { ctx } = makeCtx({
			get_access_token: jest.fn().mockResolvedValue(null),
			get_expires_at: jest.fn().mockResolvedValue(null),
		});

		await expect(
			zoominfoSubscribe(ctx, { webhookUrl: WEBHOOK_URL }),
		).rejects.toThrow();
		expect(requestSpy).not.toHaveBeenCalled();
	});
});
