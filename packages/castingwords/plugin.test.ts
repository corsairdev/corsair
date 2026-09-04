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

const fetchMock = jest.fn();
const ctx = { key: 'test-key' };

function jsonResponse(body: unknown, status = 200) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('CastingWords', () => {
	const originalFetch = globalThis.fetch;

	beforeEach(() => {
		fetchMock.mockReset();
		globalThis.fetch = fetchMock as typeof fetch;
	});

	afterAll(() => {
		globalThis.fetch = originalFetch;
	});

	it('uses the documented API v4 base URL', () => {
		expect(CASTINGWORDS_API_BASE).toBe('https://castingwords.com/store/API4');
	});

	it('sends api_key on GET and JSON POST without following redirects', async () => {
		fetchMock.mockResolvedValue(jsonResponse({ balance: 10 }));
		await makeCastingwordsRequest('prepay_balance', 'secret');
		expect(String(fetchMock.mock.calls[0]?.[0])).toContain(
			'prepay_balance?api_key=secret',
		);
		expect(fetchMock.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({ method: 'GET', redirect: 'error' }),
		);

		fetchMock.mockResolvedValue(jsonResponse({ message: 'ok' }));
		await makeCastingwordsRequest('order_url', 'secret', {
			method: 'POST',
			body: { url: 'https://example.com/a.mp3', sku: ['TRANS14'] },
		});
		expect(fetchMock.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				redirect: 'error',
				body: JSON.stringify({
					api_key: 'secret',
					url: 'https://example.com/a.mp3',
					sku: ['TRANS14'],
				}),
			}),
		);
	});

	it('does not follow a redirect with the api_key', async () => {
		fetchMock.mockImplementation((_url, init) => {
			expect(init.redirect).toBe('error');
			return Promise.reject(new TypeError('redirect'));
		});
		await expect(
			makeCastingwordsRequest('prepay_balance', 'secret'),
		).rejects.toThrow('redirect');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(String(fetchMock.mock.calls[0]?.[0])).not.toContain('evil.test');
	});

	it('creates an order and lists SKUs', async () => {
		fetchMock.mockResolvedValue(
			jsonResponse({
				audiofiles: [101],
				order: 'order-1',
				message: 'ok',
			}),
		);
		await expect(
			createOrder(ctx, { url: 'https://example.com/a.mp3', sku: ['TRANS14'] }),
		).resolves.toMatchObject({ order: 'order-1' });

		fetchMock.mockReset();
		const skus = await listSkus(ctx);
		expect(skus.skus.some((row) => row.sku === 'TRANS14')).toBe(true);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('covers the remaining API4 operations', async () => {
		fetchMock.mockResolvedValue(jsonResponse({ balance: 4.5 }));
		await expect(getPrepayBalance(ctx)).resolves.toEqual({ balance: 4.5 });

		fetchMock.mockResolvedValue(
			jsonResponse({ audiofile: { id: 101, statename: 'Delivered' } }),
		);
		await expect(
			getAudiofileDetails(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ audiofile: { statename: 'Delivered' } });

		fetchMock.mockResolvedValue(new Response('transcript text'));
		await expect(
			getTranscript(ctx, { audiofileId: 101, extension: 'txt' }),
		).resolves.toBe('transcript text');

		fetchMock.mockImplementation(() =>
			Promise.resolve(jsonResponse({ message: 'success' })),
		);
		await expect(
			orderUpgrade(ctx, { audiofileId: 101, sku: ['TSTMP1'] }),
		).resolves.toMatchObject({ message: 'success' });
		await expect(
			refundAudiofile(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ message: 'success' });

		fetchMock.mockResolvedValue(
			jsonResponse({ id: 55, state: 'PAID', items: [] }),
		);
		await expect(getInvoice(ctx, { invoiceId: 55 })).resolves.toMatchObject({
			state: 'PAID',
		});

		fetchMock.mockImplementation(() =>
			Promise.resolve(jsonResponse({ webhook: 'https://example.com/hook' })),
		);
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
				url: 'ftp://example.com/a.mp3',
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

	it('rejects invalid identifiers and non-http webhook URLs', () => {
		const idCases = [
			{ audiofileId: 101, ok: true },
			{ audiofileId: '101', ok: true },
			{ audiofileId: '', ok: false },
			{ audiofileId: '   ', ok: false },
			{ audiofileId: 0, ok: false },
			{ audiofileId: -1, ok: false },
			{ audiofileId: 1.5, ok: false },
			{ audiofileId: '1.5', ok: false },
		] as const;
		for (const { audiofileId, ok } of idCases) {
			expect(
				CastingwordsEndpointInputSchemas.getAudiofileDetails.safeParse({
					audiofileId,
				}).success,
			).toBe(ok);
			expect(
				CastingwordsEndpointInputSchemas.getInvoice.safeParse({
					invoiceId: audiofileId,
				}).success,
			).toBe(ok);
		}
		expect(
			CastingwordsEndpointInputSchemas.registerWebhook.safeParse({
				webhook: 'https://example.com/hook',
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.registerWebhook.safeParse({
				webhook: 'ftp://example.com/hook',
			}).success,
		).toBe(false);
	});
});
