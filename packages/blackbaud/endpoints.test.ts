import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeBlackbaudRequest } from './client';
import { addGiftsToBatch } from './endpoints/batch';
import { getGiftById } from './endpoints/gifts';
import { listMemberships } from './endpoints/membership';
import { oneRosterOAuth2BaseApi } from './endpoints/oneroster';
import { getPaymentTransaction } from './endpoints/payments';
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
	// Test-only minimal context: handlers read only key/options while
	// logEventFromContext is mocked above, so no other context members are
	// touched - the assertion is safe.
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

	it('listMemberships requests the constituent memberships path', async () => {
		mockRequest.mockResolvedValue({ count: 1, value: [{ id: 'm1' }] });

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'constituent/v1/constituents/c1/memberships',
			'test-access-token',
			expect.objectContaining({ method: 'GET' }),
		);
		expect(result).toEqual({ count: 1, value: [{ id: 'm1' }] });
		expect(mockLogEvent).toHaveBeenCalledWith(
			expect.anything(),
			'blackbaud.memberships.list',
			{ constituent_id: 'c1', count: 1 },
			'completed',
		);
	});

	it('listMemberships forwards limit/offset pagination', async () => {
		mockRequest.mockResolvedValue({ count: 0, value: [] });

		await listMemberships(testCtx(), {
			constituent_id: 'c1',
			limit: 50,
			offset: 100,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({
				query: { limit: 50, offset: 100 },
			}),
		);
	});

	it('listMemberships filters by member junction id on one page', async () => {
		mockRequest.mockResolvedValue({
			count: 2,
			value: [{ id: 'm1' }, { id: 'm2', member_junction_id: 'j2' }],
		});

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
			member_junction_id: 'j2',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result).toEqual({
			count: 1,
			value: [{ id: 'm2', member_junction_id: 'j2' }],
		});
	});

	it('listMemberships finds a junction id on a later page', async () => {
		const firstPage = Array.from({ length: 500 }, (_, index) => ({
			id: `m${index}`,
		}));
		mockRequest
			.mockResolvedValueOnce({ count: 500, value: firstPage })
			.mockResolvedValueOnce({
				count: 1,
				value: [{ id: 'm500', member_junction_id: 'j500' }],
			});

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
			member_junction_id: 'j500',
		});

		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'constituent/v1/constituents/c1/memberships',
			expect.anything(),
			expect.objectContaining({ query: { limit: 500, offset: 500 } }),
		);
		expect(result).toEqual({
			count: 1,
			value: [{ id: 'm500', member_junction_id: 'j500' }],
		});
	});

	it('listMemberships ignores a small caller limit when scanning', async () => {
		mockRequest.mockResolvedValueOnce({ count: 1, value: [{ id: 'j1' }] });

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
			member_junction_id: 'j1',
			limit: 1,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({ query: { limit: 500, offset: 0 } }),
		);
		expect(result.count).toBe(1);
	});

	it('listMemberships returns empty only after all pages are scanned', async () => {
		const fullPage = Array.from({ length: 500 }, (_, index) => ({
			id: `m${index}`,
		}));
		mockRequest
			.mockResolvedValueOnce({ count: 500, value: fullPage })
			.mockResolvedValueOnce({ count: 0, value: [{ id: 'm500' }] });

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
			member_junction_id: 'missing',
		});

		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(result).toEqual({ count: 0, value: [] });
	});

	it('listMemberships throws instead of reporting absence past the cap', async () => {
		const fullPage = Array.from({ length: 500 }, (_, index) => ({
			id: `m${index}`,
		}));
		mockRequest.mockResolvedValue({ count: 100000, value: fullPage });

		await expect(
			listMemberships(testCtx(), {
				constituent_id: 'c1',
				member_junction_id: 'missing',
			}),
		).rejects.toThrow('absence beyond that range is unknown');
		// 20 full pages plus the confirmatory fetch, which is also full here
		// so records genuinely remain beyond the cap.
		expect(mockRequest).toHaveBeenCalledTimes(21);
	});

	it('listMemberships reports absence when exactly 10,000 memberships were scanned', async () => {
		const fullPage = Array.from({ length: 500 }, (_, index) => ({
			id: `m${index}`,
		}));
		for (let page = 0; page < 20; page++) {
			mockRequest.mockResolvedValueOnce({ count: 10000, value: fullPage });
		}
		mockRequest.mockResolvedValueOnce({ count: 10000, value: [] });

		const result = await listMemberships(testCtx(), {
			constituent_id: 'c1',
			member_junction_id: 'missing',
		});

		expect(mockRequest).toHaveBeenCalledTimes(21);
		expect(result).toEqual({ count: 0, value: [] });
	});

	it('listMemberships confines the constituent id to one path segment', async () => {
		mockRequest.mockResolvedValue({ count: 0, value: [] });

		await listMemberships(testCtx(), {
			constituent_id: '../other?x=1',
		});

		const calledUrl: string = mockRequest.mock.calls[0][0];
		expect(calledUrl).toBe(
			`constituent/v1/constituents/${encodeURIComponent('../other?x=1')}/memberships`,
		);
		expect(calledUrl).not.toContain('?x=1');
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
		// Test-only invalid input to verify runtime guard - static type rejects it.
		await expect(
			oneRosterOAuth2BaseApi(testCtx(), {
				// @ts-expect-error - intentionally invalid operation for runtime-guard test
				operation: 'token',
			}),
		).rejects.toThrow('Unsupported OneRoster operation');
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
