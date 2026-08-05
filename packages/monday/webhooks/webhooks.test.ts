import * as crypto from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import type { MondayContext } from '../index';
import { columnValueChanged } from './column-value-changed';
import { itemCreated } from './item-created';
import { statusChanged } from './status-changed';
import { verifyMondayWebhookSignature } from './types';

const WEBHOOK_SECRET = 'monday-webhook-secret';

function sign(rawBody: string, secret: string): string {
	return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

function makeWebhookRequest(
	event: Record<string, unknown>,
	options?: { signature?: string; secret?: string },
): WebhookRequest<Record<string, unknown>> {
	const payload = { event };
	const rawBody = JSON.stringify(payload);
	const signature =
		options?.signature ?? sign(rawBody, options?.secret ?? WEBHOOK_SECRET);

	return {
		payload,
		rawBody,
		headers: { authorization: signature },
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
		// The regression: an empty secret returned { valid: true }, so a
		// deployment with no secret configured accepted forged events.
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('should return invalid when the Authorization header is missing', () => {
		const request = {
			payload: { event: createPulseEvent },
			rawBody: JSON.stringify({ event: createPulseEvent }),
			headers: {},
		} as unknown as WebhookRequest<unknown>;

		const result = verifyMondayWebhookSignature(request, WEBHOOK_SECRET);
		expect(result).toEqual({
			valid: false,
			error: 'Missing Authorization header',
		});
	});

	it('should return invalid when the raw body is missing', () => {
		const request = {
			payload: { event: createPulseEvent },
			headers: { authorization: 'whatever' },
		} as unknown as WebhookRequest<unknown>;

		const result = verifyMondayWebhookSignature(request, WEBHOOK_SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/raw body/i);
	});

	it('should return valid for a correctly signed request', () => {
		const result = verifyMondayWebhookSignature(
			makeWebhookRequest(createPulseEvent),
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
