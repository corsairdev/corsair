import { request } from 'corsair/http';
import { CASTINGWORDS_API_BASE, makeCastingwordsRequest } from './client';
import {
	createOrder,
	getAudiofileDetails,
	getInvoice,
	getPrepayBalance,
	getTranscript,
	getWebhook,
	listSkus,
	orderUpgrade,
	refundAudiofile,
	registerWebhook,
	testWebhook,
} from './endpoints/handlers';
import {
	CASTINGWORDS_SKU_CATALOG,
	CastingwordsEndpointInputSchemas,
	CastingwordsEndpointOutputSchemas,
} from './endpoints/types';
import { CastingwordsSchema } from './schema';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const requestMock = request as unknown as jest.Mock;
const ctx = { key: 'test-key' };

describe('CastingWords', () => {
	beforeEach(() => requestMock.mockReset());

	it('uses the documented API v4 base URL', () => {
		expect(CASTINGWORDS_API_BASE).toBe('https://castingwords.com/store/API4');
	});

	it('sends api_key on GET and JSON POST', async () => {
		requestMock.mockResolvedValue({ balance: 10 });
		await makeCastingwordsRequest('prepay_balance', 'secret');
		expect(requestMock).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: CASTINGWORDS_API_BASE }),
			expect.objectContaining({ method: 'GET', query: { api_key: 'secret' } }),
		);

		requestMock.mockResolvedValue({ message: 'ok' });
		await makeCastingwordsRequest('order_url', 'secret', {
			method: 'POST',
			body: { url: 'https://example.com/a.mp3', sku: ['TRANS14'] },
		});
		expect(requestMock).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				body: {
					api_key: 'secret',
					url: 'https://example.com/a.mp3',
					sku: ['TRANS14'],
				},
				mediaType: 'application/json',
			}),
		);
	});

	it('creates an order and lists SKUs', async () => {
		requestMock.mockResolvedValue({
			audiofiles: [101],
			order: 'order-1',
			message: 'ok',
		});
		await expect(
			createOrder(ctx, { url: 'https://example.com/a.mp3', sku: ['TRANS14'] }),
		).resolves.toMatchObject({ order: 'order-1' });

		requestMock.mockReset();
		const skus = await listSkus(ctx);
		expect(skus.skus.some((row) => row.sku === 'TRANS14')).toBe(true);
		expect(requestMock).not.toHaveBeenCalled();
	});

	it('covers the remaining API4 operations', async () => {
		requestMock.mockResolvedValue({ balance: 4.5 });
		await expect(getPrepayBalance(ctx)).resolves.toEqual({ balance: 4.5 });

		requestMock.mockResolvedValue({
			audiofile: { id: 101, statename: 'Delivered' },
		});
		await expect(
			getAudiofileDetails(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ audiofile: { statename: 'Delivered' } });

		requestMock.mockResolvedValue('transcript text');
		await expect(
			getTranscript(ctx, { audiofileId: 101, extension: 'txt' }),
		).resolves.toBe('transcript text');

		requestMock.mockResolvedValue({ message: 'success' });
		await expect(
			orderUpgrade(ctx, { audiofileId: 101, sku: ['TSTMP1'] }),
		).resolves.toMatchObject({ message: 'success' });
		await expect(
			refundAudiofile(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ message: 'success' });

		requestMock.mockResolvedValue({ id: 55, state: 'PAID', items: [] });
		await expect(getInvoice(ctx, { invoiceId: 55 })).resolves.toMatchObject({
			state: 'PAID',
		});

		requestMock.mockResolvedValue({ webhook: 'https://example.com/hook' });
		await expect(getWebhook(ctx)).resolves.toEqual({
			webhook: 'https://example.com/hook',
		});
		await expect(
			registerWebhook(ctx, { webhook: 'https://example.com/hook' }),
		).resolves.toEqual({ webhook: 'https://example.com/hook' });
		await expect(
			testWebhook(ctx, { event: 'TRANSCRIPT_COMPLETE' }),
		).resolves.toEqual({ webhook: 'https://example.com/hook' });
	});

	it('validates official input and output schemas', () => {
		expect(CastingwordsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(
			CastingwordsEndpointInputSchemas.createOrder.safeParse({
				url: 'https://example.com/a.mp3',
				sku: ['TRANS14'],
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.createOrder.safeParse({
				url: 'not-url',
				sku: ['TRANS14'],
			}).success,
		).toBe(false);
		expect(
			CastingwordsEndpointOutputSchemas.createOrder.parse({
				audiofiles: [101],
				order: 'order-1',
				hold: 'billing',
			}).hold,
		).toBe('billing');
		expect(CASTINGWORDS_SKU_CATALOG.some((row) => row.sku === 'UPGRD3')).toBe(
			true,
		);
	});
});
