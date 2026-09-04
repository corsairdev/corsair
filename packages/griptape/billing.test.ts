import { request } from 'corsair/http';
import * as billing from './endpoints/billing';
import { GriptapeEndpointInputSchemas } from './endpoints/types';
import type { GriptapeContext } from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('griptape billing endpoints', () => {
	const apiKey = 'test-api-key';
	const ctx = { key: apiKey } as unknown as GriptapeContext;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('billing.managementUrl sends POST /billing/management-url', async () => {
		const payload = { url: 'https://example.com/billing/session' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.managementUrl(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({
				method: 'POST',
				url: 'billing/management-url',
			}),
		);
		expect(result).toEqual(payload);
	});

	it('billing.creditBalance sends GET /credits/balance', async () => {
		const payload = { balance: 1250, currency: 'credits' };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.creditBalance(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'credits/balance' }),
		);
		expect(result).toEqual(payload);
	});

	it('billing.usage sends GET /usage', async () => {
		const payload = { period: '2026-08', total_runs: 42 };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.usage(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'usage' }),
		);
		expect(result).toEqual(payload);
	});

	it('billing.config sends GET /config', async () => {
		const payload = { billing_enabled: true };
		mockRequest.mockResolvedValueOnce(payload);

		const result = await billing.config(ctx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: 'https://cloud.griptape.ai/api' }),
			expect.objectContaining({ method: 'GET', url: 'config' }),
		);
		expect(result).toEqual(payload);
	});

	it('accepts empty billingManagementUrl input', () => {
		const parsed = GriptapeEndpointInputSchemas.billingManagementUrl.safeParse(
			{},
		);

		expect(parsed.success).toBe(true);
	});

	it('accepts empty creditsBalance input', () => {
		const parsed = GriptapeEndpointInputSchemas.creditsBalance.safeParse({});

		expect(parsed.success).toBe(true);
	});
});
