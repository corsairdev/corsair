import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { created, deleted, updated } from './records';
import type { AttioWebhookPayload, RecordCreatedEvent } from './types';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const SECRET = 'attio-webhook-secret';

const event: RecordCreatedEvent = {
	event_type: 'record.created',
	id: {
		workspace_id: 'ws-1',
		object_id: 'obj-1',
		record_id: 'rec-1',
	},
};

function sign(body: string): string {
	return createHmac('sha256', SECRET).update(body).digest('hex');
}

function makeRequest<T extends AttioWebhookPayload>(
	payload: T,
	headerSig?: string,
): WebhookRequest<T> {
	const rawBody = JSON.stringify(payload);
	return {
		payload,
		rawBody,
		headers: { 'attio-signature': headerSig ?? sign(rawBody) },
	};
}

function makeCtx(overrides?: { upsert?: jest.Mock; remove?: jest.Mock }) {
	return {
		key: SECRET,
		db: {
			records: {
				upsertByEntityId:
					overrides?.upsert ?? jest.fn().mockResolvedValue({ id: 'rec-1' }),
				deleteByEntityId:
					overrides?.remove ?? jest.fn().mockResolvedValue(undefined),
			},
		},
		database: {},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
	} as never;
}

describe('attio record webhooks', () => {
	it('upserts a created record by record_id', async () => {
		const upsert = jest.fn().mockResolvedValue({ id: 'rec-1' });
		const result = await created.handler(
			makeCtx({ upsert }),
			makeRequest(event),
		);
		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('rec-1');
		expect(upsert).toHaveBeenCalledWith(
			'rec-1',
			expect.objectContaining({ id: event.id }),
		);
	});

	it('upserts every matching event from an Attio events envelope', async () => {
		const upsert = jest.fn().mockResolvedValue({ id: 'rec-1' });
		const envelope = {
			webhook_id: 'wh-1',
			events: [
				event,
				{
					event_type: 'record.created',
					id: {
						workspace_id: 'ws-1',
						object_id: 'obj-1',
						record_id: 'rec-2',
					},
				},
				{
					event_type: 'record.updated',
					id: {
						workspace_id: 'ws-1',
						object_id: 'obj-1',
						record_id: 'rec-3',
					},
				},
			],
		};
		const result = await created.handler(
			makeCtx({ upsert }),
			makeRequest(envelope as never),
		);
		expect(result.success).toBe(true);
		expect(result.corsairEntityId).toBe('rec-1');
		expect(upsert).toHaveBeenCalledTimes(2);
		expect(upsert).toHaveBeenNthCalledWith(
			1,
			'rec-1',
			expect.objectContaining({ id: event.id }),
		);
		expect(upsert).toHaveBeenNthCalledWith(
			2,
			'rec-2',
			expect.objectContaining({
				id: {
					workspace_id: 'ws-1',
					object_id: 'obj-1',
					record_id: 'rec-2',
				},
			}),
		);
	});

	it('returns 400 when the envelope has no matching record events', async () => {
		const result = await created.handler(
			makeCtx(),
			makeRequest({
				webhook_id: 'wh-1',
				events: [
					{
						event_type: 'record.updated',
						id: event.id,
					},
				],
			} as never),
		);
		expect(result).toEqual(
			expect.objectContaining({
				success: false,
				statusCode: 400,
			}),
		);
	});

	it('returns 401 when the signature is invalid', async () => {
		const result = await created.handler(
			makeCtx(),
			makeRequest(event, 'deadbeef'),
		);
		expect(result).toEqual(
			expect.objectContaining({
				success: false,
				statusCode: 401,
			}),
		);
	});

	it('returns 500 when the database upsert fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('db down'));
		const result = await created.handler(
			makeCtx({ upsert }),
			makeRequest(event),
		);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(500);
	});

	it('updates a record by record_id', async () => {
		const upsert = jest.fn().mockResolvedValue({ id: 'rec-1' });
		const payload = { ...event, event_type: 'record.updated' as const };
		const result = await updated.handler(
			makeCtx({ upsert }),
			makeRequest(payload),
		);
		expect(result.success).toBe(true);
		expect(upsert).toHaveBeenCalledWith(
			'rec-1',
			expect.objectContaining({ id: payload.id }),
		);
	});

	it('deletes a record by record_id', async () => {
		const remove = jest.fn().mockResolvedValue(undefined);
		const payload = { ...event, event_type: 'record.deleted' as const };
		const result = await deleted.handler(
			makeCtx({ remove }),
			makeRequest(payload),
		);
		expect(result.success).toBe(true);
		expect(remove).toHaveBeenCalledWith('rec-1');
	});

	it('returns 500 when the database delete fails', async () => {
		const remove = jest.fn().mockRejectedValue(new Error('db down'));
		const payload = { ...event, event_type: 'record.deleted' as const };
		const result = await deleted.handler(
			makeCtx({ remove }),
			makeRequest(payload),
		);
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(500);
	});
});
