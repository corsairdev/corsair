import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { MondayContext } from '../index';
import { columnValueChanged } from './column-value-changed';
import { itemCreated } from './item-created';
import { statusChanged } from './status-changed';
import { verifyMondayWebhookSignature } from './types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const WEBHOOK_SECRET = 'monday-webhook-secret';

function base64UrlEncode(buf: Buffer): string {
	return buf
		.toString('base64')
		.replace(/=+$/g, '')
		.replace(/\+/g, '-')
		.replace(/\//g, '_');
}

function signMondayJwt(
	payload: Record<string, unknown>,
	secret: string,
): string {
	const header = base64UrlEncode(
		Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
	);
	const body = base64UrlEncode(Buffer.from(JSON.stringify(payload)));
	const signature = base64UrlEncode(
		crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest(),
	);
	return `${header}.${body}.${signature}`;
}

function makeWebhookRequest(
	event: Record<string, unknown>,
	options?: {
		secret?: string;
		authorization?: string;
		omitAuthorization?: boolean;
		payloadExtra?: Record<string, unknown>;
		expired?: boolean;
	},
): WebhookRequest<Record<string, unknown>> {
	const payload = { event, ...options?.payloadExtra };
	const rawBody = JSON.stringify(payload);
	const now = Math.floor(Date.now() / 1000);
	const jwtPayload = {
		accountId: 1825529,
		userId: 4012689,
		aud: 'https://example.com/monday/webhook',
		iat: now,
		exp: options?.expired ? now - 60 : now + 5 * 60,
	};

	const authorization = options?.omitAuthorization
		? undefined
		: (options?.authorization ??
			signMondayJwt(jwtPayload, options?.secret ?? WEBHOOK_SECRET));

	return {
		payload,
		rawBody,
		headers: authorization ? { authorization } : {},
	} as unknown as WebhookRequest<Record<string, unknown>>;
}

function makeCtx(): MondayContext {
	return {
		key: WEBHOOK_SECRET,
		db: {
			items: {
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'entity-1' }),
			},
		},
		database: {},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
	} as unknown as MondayContext;
}

const createPulseEvent = {
	type: 'create_pulse',
	pulseId: 123,
	pulseName: 'A task',
	boardId: 456,
	groupId: 'topics',
	triggerTime: '2026-05-22T00:00:00Z',
	userId: 789,
};

describe('verifyMondayWebhookSignature', () => {
	it('should fail closed when the secret is missing', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('should return invalid when the Authorization header is missing', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent, { omitAuthorization: true }),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing Authorization header',
		});
	});

	it('should return invalid for a forged JWT', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent, { secret: 'a-different-secret' }),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid signature' });
	});

	it('should return invalid for an expired JWT', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent, { expired: true }),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: false, error: 'Token expired' });
	});

	it('should return valid for a correctly signed JWT', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should accept Bearer-prefixed Authorization JWTs', () => {
		const token = signMondayJwt(
			{
				accountId: 1,
				exp: Math.floor(Date.now() / 1000) + 60,
			},
			WEBHOOK_SECRET,
		);
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent, {
				authorization: `Bearer ${token}`,
			}),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: true });
	});

	it('should accept lowercase bearer-prefixed Authorization JWTs', () => {
		const token = signMondayJwt(
			{
				accountId: 1,
				exp: Math.floor(Date.now() / 1000) + 60,
			},
			WEBHOOK_SECRET,
		);
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent, {
				authorization: `bearer ${token}`,
			}),
			WEBHOOK_SECRET,
		);
		expect(result).toEqual({ valid: true });
	});
});

describe('monday webhook handlers verify signatures', () => {
	it('itemCreated rejects a forged signature with 401 and writes nothing', async () => {
		const ctx = makeCtx();
		const result = await itemCreated.handler(
			ctx,
			makeWebhookRequest(createPulseEvent, {
				secret: 'a-different-secret',
			}) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
		expect(ctx.db.items?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('itemCreated rejects when no secret is configured, and writes nothing', async () => {
		const ctx = { ...makeCtx(), key: '' } as MondayContext;
		const result = await itemCreated.handler(
			ctx,
			makeWebhookRequest(createPulseEvent) as never,
		);

		expect(result.success).toBe(false);
		expect(ctx.db.items?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('itemCreated accepts a correctly signed request and persists the item', async () => {
		const ctx = makeCtx();
		const result = await itemCreated.handler(
			ctx,
			makeWebhookRequest(createPulseEvent) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.items?.upsertByEntityId).toHaveBeenCalledWith(
			'123',
			expect.objectContaining({ id: '123', name: 'A task' }),
		);
	});

	it('statusChanged rejects a forged signature with 401', async () => {
		const result = await statusChanged.handler(
			makeCtx(),
			makeWebhookRequest(
				{ type: 'change_status_column_value', pulseId: 1, boardId: 2 },
				{ secret: 'a-different-secret' },
			) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
	});

	it('columnValueChanged rejects a forged signature with 401', async () => {
		const result = await columnValueChanged.handler(
			makeCtx(),
			makeWebhookRequest(
				{ type: 'change_column_value', pulseId: 1, boardId: 2 },
				{ secret: 'a-different-secret' },
			) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
	});
});
