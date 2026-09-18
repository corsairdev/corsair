import { describe, expect, it } from '@jest/globals';
import { SpokiApiError } from './client';
import { errorHandlers } from './error-handlers';

const readContext: any = {
	pluginId: 'spoki',
	operation: 'accounts.listAccounts',
};

const writeContext: any = {
	pluginId: 'spoki',
	operation: 'messaging.sendMessage',
};

describe('Spoki error handlers', () => {
	it('RATE_LIMIT_ERROR matches a 429 SpokiApiError and retries reads', async () => {
		const err = new SpokiApiError(429, 'rate limited');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err, readContext)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
			err,
			readContext,
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('SERVER_ERROR matches 5xx SpokiApiErrors and retries reads', async () => {
		for (const status of [500, 502, 503]) {
			const err = new SpokiApiError(status, `status ${status}`);
			expect(errorHandlers.SERVER_ERROR.match(err, readContext)).toBe(true);
			const strategy = await errorHandlers.SERVER_ERROR.handler(
				err,
				readContext,
			);
			expect(strategy.maxRetries).toBeGreaterThan(0);
		}
	});

	it('does not retry non-replayable write operations', async () => {
		const rateLimited = new SpokiApiError(429, 'rate limited');
		const serverError = new SpokiApiError(502, 'status 502');
		const networkError = new Error('fetch failed');

		expect(
			(await errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited, writeContext))
				.maxRetries,
		).toBe(0);
		expect(
			(await errorHandlers.SERVER_ERROR.handler(serverError, writeContext))
				.maxRetries,
		).toBe(0);
		expect(
			(await errorHandlers.NETWORK_ERROR.handler(networkError, writeContext))
				.maxRetries,
		).toBe(0);
	});

	it('does not retry automation triggers either', async () => {
		const automationContext: any = {
			pluginId: 'spoki',
			operation: 'automation.triggerAutomation',
		};
		const err = new SpokiApiError(500, 'status 500');
		const strategy = await errorHandlers.SERVER_ERROR.handler(
			err,
			automationContext,
		);
		expect(strategy.maxRetries).toBe(0);
	});

	it('RATE_LIMIT_ERROR does not match plain server errors', async () => {
		const err = new SpokiApiError(500, 'status 500');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err, readContext)).toBe(false);
	});

	it('AUTH_ERROR matches a 401 SpokiApiError without retries', async () => {
		const err = new SpokiApiError(401, 'unauthorized');
		expect(errorHandlers.AUTH_ERROR.match(err, readContext)).toBe(true);
		const strategy = await errorHandlers.AUTH_ERROR.handler(err, readContext);
		expect(strategy.maxRetries).toBe(0);
	});

	it('PERMISSION_ERROR matches a 403 SpokiApiError', async () => {
		const err = new SpokiApiError(403, 'forbidden');
		expect(errorHandlers.PERMISSION_ERROR.match(err, readContext)).toBe(true);
	});

	it('NOT_FOUND_ERROR matches a 404 SpokiApiError', async () => {
		const err = new SpokiApiError(404, 'not found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(err, readContext)).toBe(true);
	});

	it('NETWORK_ERROR matches connection failures and retries reads', async () => {
		const err = new Error('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(err, readContext)).toBe(true);
		const strategy = await errorHandlers.NETWORK_ERROR.handler(
			err,
			readContext,
		);
		expect(strategy.maxRetries).toBeGreaterThan(0);
	});

	it('DEFAULT catches any unhandled error without retries', async () => {
		const err = new Error('something unexpected');
		expect(errorHandlers.DEFAULT.match(err, readContext)).toBe(true);
		const strategy = await errorHandlers.DEFAULT.handler(err, readContext);
		expect(strategy.maxRetries).toBe(0);
	});
});
