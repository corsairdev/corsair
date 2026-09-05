import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeBlackbaudRequest } from './client';
import { addGiftsToBatch } from './endpoints/batch';
import { getGiftById } from './endpoints/gifts';
import { getMembershipDetails } from './endpoints/membership';
import { oneRosterOAuth2BaseApi } from './endpoints/oneroster';
import { getPaymentTransaction } from './endpoints/payments';
import type { OneRosterOAuth2BaseApiInput } from './endpoints/types';
import type { BlackbaudContext } from './index';

jest.mock('./client', () => ({
	__esModule: true,
	...jest.requireActual('./client'),
	makeBlackbaudRequest: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn(),
	};
});

const mockRequest = makeBlackbaudRequest as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

function testCtx(subscriptionKey = 'test-sub-key'): BlackbaudContext {
	return {
		key: 'test-access-token',
		options: { subscriptionKey },
	} as unknown as BlackbaudContext;
}

beforeEach(() => {
	jest.clearAllMocks();
});

describe('Blackbaud endpoints', () => {
	it('getGiftById requests the gift path with auth headers', async () => {
		mockRequest.mockResolvedValue({ id: 'g1' });

		const result = await getGiftById(testCtx(), { gift_id: 'g1' });

		expect(mockRequest).toHaveBeenCalledWith(
			'gift/v1/gifts/g1',
			'test-access-token',
			expect.objectContaining({
				method: 'GET',
				subscriptionKey: 'test-sub-key',
			}),
		);
		expect(result).toEqual({ id: 'g1' });
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.gifts.get',
			{ gift_id: 'g1' },
			'completed',
		);
	});

	it('getGiftById encodes identifiers to a single path segment', async () => {
		mockRequest.mockResolvedValue({ id: 'x' });

		await getGiftById(testCtx(), { gift_id: 'a/b c' });

		expect(mockRequest).toHaveBeenCalledWith(
			'gift/v1/gifts/a%2Fb%20c',
			expect.anything(),
			expect.anything(),
		);
	});

	it('getMembershipDetails requests the membership path', async () => {
		mockRequest.mockResolvedValue({ id: 'm1' });

		const result = await getMembershipDetails(testCtx(), {
			member_junction_id: 'm1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'membership/v1/memberships/m1',
			'test-access-token',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(result).toEqual({ id: 'm1' });
	});

	it('getPaymentTransaction confines the id to one path segment', async () => {
		mockRequest.mockResolvedValue({ id: 't1' });

		await getPaymentTransaction(testCtx(), {
			transaction_id: '../other?x=1',
		});

		const calledUrl: string = mockRequest.mock.calls[0][0];
		expect(calledUrl).toBe(
			`payments/v1/transactions/${encodeURIComponent('../other?x=1')}`,
		);
		expect(calledUrl).not.toContain('?x=1');
	});

	it('addGiftsToBatch posts gifts and logs completion', async () => {
		mockRequest.mockResolvedValue({ batch: 'ok' });

		const result = await addGiftsToBatch(testCtx(), {
			batch_id: 'b1',
			gifts: [{ constituent_id: 'c1' }],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'gift/v1/giftbatches/b1/gifts',
			'test-access-token',
			expect.objectContaining({
				method: 'POST',
				body: { gifts: [{ constituent_id: 'c1' }] },
			}),
		);
		expect(result.status_code).toBe(200);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.gifts.add_to_batch',
			{ batch_id: 'b1', count: 1 },
			'completed',
		);
	});

	it('addGiftsToBatch rethrows upstream errors for binder retries and logs failure', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'gift/v1/giftbatches/b1/gifts' },
			{
				url: 'gift/v1/giftbatches/b1/gifts',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'rate limited' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			addGiftsToBatch(testCtx(), {
				batch_id: 'b1',
				gifts: [{ constituent_id: 'c1' }],
			}),
		).rejects.toBe(apiError);
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.gifts.add_to_batch',
			expect.anything(),
			'failed',
		);
	});

	it('oneRoster routes openid-configuration to the discovery URL', async () => {
		mockRequest.mockResolvedValue({ issuer: 'https://example' });

		await oneRosterOAuth2BaseApi(testCtx(), {
			operation: 'openid-configuration',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'https://oauth2.sky.blackbaud.com/.well-known/openid-configuration',
			'test-access-token',
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('oneRoster routes publickeys to the JWKS URL', async () => {
		mockRequest.mockResolvedValue({ keys: [] });

		await oneRosterOAuth2BaseApi(testCtx(), { operation: 'publickeys' });

		expect(mockRequest).toHaveBeenCalledWith(
			'https://oauth2.sky.blackbaud.com/publickeys',
			expect.anything(),
			expect.anything(),
		);
	});

	it('oneRoster rejects unsupported operations', async () => {
		await expect(
			oneRosterOAuth2BaseApi(testCtx(), {
				operation: 'token',
			} as unknown as OneRosterOAuth2BaseApiInput),
		).rejects.toThrow('Unsupported OneRoster operation');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
