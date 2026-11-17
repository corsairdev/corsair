import type { CorsairErrorHandler, RetryStrategy } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { SquareNetworkError, squareErrors } from './client';
import { square, squareReplayableOperations } from './index';

const handlers: CorsairErrorHandler = square().errorHandlers ?? {};

/**
 * Picks a handler the way core does (core/errors/handler.ts): the first named
 * handler, in key order, whose match passes; DEFAULT only when none does.
 */
async function strategyFor(
	error: Error,
	operation: string,
): Promise<RetryStrategy> {
	const context = {
		pluginId: 'square',
		operation,
		input: {},
		originalError: error,
	};
	const name = Object.keys(handlers).find(
		(key) => key !== 'DEFAULT' && handlers[key]?.match(error, context),
	);
	const chosen = handlers[name ?? 'DEFAULT'];
	if (!chosen) throw new Error('no handler matched');
	return chosen.handler(error, context);
}

// unknown: the error body is arbitrary JSON, as Square sends it.
function apiError(status: number, body: unknown = {}): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/v2/payments' },
		{
			url: 'https://connect.squareup.com/v2/payments',
			ok: false,
			status,
			statusText: '',
			body,
		},
		'Square said no',
	);
}

const serverError = apiError(500, {
	errors: [{ category: 'API_ERROR', code: 'INTERNAL_SERVER_ERROR' }],
});
const dropped = new SquareNetworkError(new TypeError('fetch failed'));

describe('Square retry policy on a 5xx or a dropped connection', () => {
	it.each([
		['payments.create', 'its spec requires idempotency_key'],
		['payments.refund', 'its spec requires idempotency_key'],
		['disputes.createEvidenceFile', 'its spec requires idempotency_key'],
		['locations.list', 'it is a read'],
		['orders.search', 'it is a read-only POST'],
	])('retries %s: %s', async (operation) => {
		expect(await strategyFor(serverError, operation)).toMatchObject({
			maxRetries: 2,
		});
		expect(await strategyFor(dropped, operation)).toMatchObject({
			maxRetries: 2,
		});
	});

	it.each([
		['customers.create', 'a keyless POST'],
		['invoices.createAttachment', 'a POST whose key is optional'],
		['customers.update', 'a PUT'],
		['customers.delete', 'a DELETE'],
		['payments.cancel', 'a destructive keyless POST'],
	])('does not retry %s (%s): it may have run', async (operation) => {
		expect(await strategyFor(serverError, operation)).toEqual({
			maxRetries: 0,
		});
		expect(await strategyFor(dropped, operation)).toEqual({ maxRetries: 0 });
	});

	it('treats an operation it does not know as not replayable', async () => {
		expect(await strategyFor(serverError, 'square.unknown')).toEqual({
			maxRetries: 0,
		});
	});
});

describe('Square 429', () => {
	it('leaves the 429 to core’s request(), which has already retried it', async () => {
		for (const operation of ['customers.create', 'locations.list']) {
			expect(
				await strategyFor(
					apiError(429, {
						errors: [{ category: 'RATE_LIMIT_ERROR', code: 'RATE_LIMITED' }],
					}),
					operation,
				),
			).toEqual({ maxRetries: 0 });
		}
	});
});

describe('Square errors that are never retried', () => {
	it('treats a declined card as Square answering, not a fault', async () => {
		const declined = apiError(402, {
			errors: [
				{
					category: 'PAYMENT_METHOD_ERROR',
					code: 'CARD_DECLINED',
					detail: 'Card declined.',
				},
			],
		});
		expect(await strategyFor(declined, 'payments.create')).toEqual({
			maxRetries: 0,
		});
	});

	it.each([401, 403])('does not retry a %i, even on a read', async (status) => {
		expect(await strategyFor(apiError(status), 'locations.list')).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry a 400 on a keyed write', async () => {
		const reused = apiError(400, {
			errors: [
				{ category: 'INVALID_REQUEST_ERROR', code: 'IDEMPOTENCY_KEY_REUSED' },
			],
		});
		expect(await strategyFor(reused, 'payments.create')).toEqual({
			maxRetries: 0,
		});
	});

	it('does not retry an error the plugin raised before sending', async () => {
		expect(
			await strategyFor(
				new Error('file_base64 is not valid base64.'),
				'disputes.createEvidenceFile',
			),
		).toEqual({ maxRetries: 0 });
	});
});

describe('Square replayable operations', () => {
	it('are the reads plus the operations whose spec requires idempotency_key', () => {
		const reads = Object.entries(square().endpointMeta ?? {})
			.filter(([, meta]) => meta.riskLevel === 'read')
			.map(([op]) => op);
		expect([...squareReplayableOperations].sort()).toEqual(
			[
				...reads,
				'cards.create',
				'catalog.upsert',
				'disputes.createEvidenceFile',
				'disputes.createEvidenceText',
				'orders.pay',
				'payments.cancelByIdempotencyKey',
				'payments.create',
				'payments.refund',
				'payments.update',
			].sort(),
		);
	});
});

describe('squareErrors', () => {
	it('reads Square’s errors[] from an ApiError without changing it', () => {
		const error = apiError(400, {
			errors: [
				{
					category: 'INVALID_REQUEST_ERROR',
					code: 'MISSING_REQUIRED_PARAMETER',
					detail: "Missing required parameter 'source_id'.",
					field: 'source_id',
				},
			],
		});
		expect(squareErrors(error)).toEqual([
			{
				category: 'INVALID_REQUEST_ERROR',
				code: 'MISSING_REQUIRED_PARAMETER',
				detail: "Missing required parameter 'source_id'.",
				field: 'source_id',
			},
		]);
		expect(error.message).toBe('Square said no');
	});

	it('returns no entries for a body that is not Square’s shape, or a non-ApiError', () => {
		expect(squareErrors(apiError(502, '<html>Bad gateway</html>'))).toEqual([]);
		expect(squareErrors(new Error('boom'))).toEqual([]);
		expect(squareErrors(undefined)).toEqual([]);
	});
});
