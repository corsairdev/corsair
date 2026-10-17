import { createHmac } from 'node:crypto';
import { makeSaperlyRequest } from './client';
import type { SaperlyContext } from './index';
import { delivery } from './webhooks/events';

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return { ...original, makeSaperlyRequest: jest.fn() };
});

const mockRequest = jest.mocked(makeSaperlyRequest);

const call = {
	id: 'call_1',
	numberId: 'num_1',
	direction: 'inbound',
	to: '+14155550100',
	from: '+14155550123',
	status: 'completed',
	rateCentsPerMin: 2,
	durationSec: 10,
	costCents: 1,
	hasRecording: false,
	hasTranscript: true,
	createdAt: '2026-01-01T00:00:00.000Z',
};

function sign(rawBody: string, secret: string, timestamp: string) {
	const hex = createHmac('sha256', secret)
		.update(`${timestamp}.${rawBody}`)
		.digest('hex');
	return `v1=${hex}`;
}

// The handler reads key, options, and database. The rest of the context is unused.
function ctx(): SaperlyContext {
	return {
		key: 'whsec_test',
		options: { key: 'x_key_test' },
		database: undefined,
	} as SaperlyContext;
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('saperly webhooks', () => {
	it('drops a delivery when the signing secret is missing', async () => {
		// Empty key stands in for a context whose key builder found no secret.
		const bare = { key: '', options: {} } as SaperlyContext;
		const result = await delivery.handler(bare, {
			payload: {
				deliveryId: 'del_0',
				eventType: 'call.completed',
				payload: { callId: 'call_1' },
			},
			headers: {},
			rawBody: '{}',
		});
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(409);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a bad signature before calling the API', async () => {
		const rawBody = JSON.stringify({
			deliveryId: 'del_1',
			eventType: 'call.completed',
			payload: { callId: 'call_1' },
		});
		const result = await delivery.handler(ctx(), {
			payload: JSON.parse(rawBody),
			headers: {
				'x-saperly-timestamp': '1700000000',
				'x-saperly-signature': 'v1=deadbeef',
			},
			rawBody,
		});
		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('returns the confirmed call, not the delivery body', async () => {
		const now = Math.floor(Date.now() / 1000).toString();
		const rawBody = JSON.stringify({
			deliveryId: 'del_2',
			eventType: 'call.completed',
			payload: { callId: 'call_1', costCents: 999999 },
		});
		mockRequest.mockResolvedValue(call);
		const result = await delivery.handler(ctx(), {
			payload: JSON.parse(rawBody),
			headers: {
				'x-saperly-timestamp': now,
				'x-saperly-signature': sign(rawBody, 'whsec_test', now),
			},
			rawBody,
		});
		expect(result.success).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			'/calls/{id}',
			'x_key_test',
			expect.objectContaining({ path: { id: 'call_1' } }),
		);
		if (!result.success) throw new Error('expected success');
		expect(result.data?.resource).toMatchObject({ id: 'call_1', costCents: 1 });
	});
});
