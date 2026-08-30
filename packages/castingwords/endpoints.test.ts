import { request } from 'corsair/http';
import {
	createOrder,
	getAudiofileDetails,
	getInvoice,
	getPrepayBalance,
	getTranscript,
	getWebhook,
	orderUpgrade,
	refundAudiofile,
	setWebhook,
} from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	ApiError: class ApiError extends Error {},
	request: jest.fn(),
}));

const requestMock = request as unknown as jest.Mock;
const ctx = { key: 'test-key' } as never;

describe('CastingWords endpoints', () => {
	beforeEach(() => requestMock.mockReset());

	it('creates an order', async () => {
		requestMock.mockResolvedValue({
			audiofiles: [101],
			order: 'order-1',
			message: 'ok',
		});
		await expect(
			createOrder(ctx, { url: 'https://example.com/a.mp3', sku: ['TRANS14'] }),
		).resolves.toMatchObject({ order: 'order-1' });
	});

	it('gets prepaid balance', async () => {
		requestMock.mockResolvedValue({ balance: 4.5 });
		await expect(getPrepayBalance(ctx, {})).resolves.toEqual({ balance: 4.5 });
	});

	it('gets audiofile details', async () => {
		requestMock.mockResolvedValue({
			audiofile: { id: 101, statename: 'Delivered' },
		});
		await expect(
			getAudiofileDetails(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ audiofile: { statename: 'Delivered' } });
	});

	it('gets a transcript', async () => {
		requestMock.mockResolvedValue('transcript text');
		await expect(
			getTranscript(ctx, { audiofileId: 101, extension: 'txt' }),
		).resolves.toBe('transcript text');
	});

	it('orders an upgrade', async () => {
		requestMock.mockResolvedValue({ message: 'success' });
		await expect(
			orderUpgrade(ctx, { audiofileId: 101, sku: ['TSTMP1'] }),
		).resolves.toMatchObject({ message: 'success' });
	});

	it('refunds an audiofile', async () => {
		requestMock.mockResolvedValue({ message: 'success' });
		await expect(
			refundAudiofile(ctx, { audiofileId: 101 }),
		).resolves.toMatchObject({ message: 'success' });
	});

	it('gets an invoice', async () => {
		requestMock.mockResolvedValue({ id: 55, state: 'PAID', items: [] });
		await expect(getInvoice(ctx, { invoiceId: 55 })).resolves.toMatchObject({
			id: 55,
			state: 'PAID',
		});
	});

	it('gets the registered webhook', async () => {
		requestMock.mockResolvedValue({ webhook: 'https://example.com/hook' });
		await expect(getWebhook(ctx, {})).resolves.toEqual({
			webhook: 'https://example.com/hook',
		});
	});

	it('sets the registered webhook', async () => {
		requestMock.mockResolvedValue({ webhook: 'https://example.com/hook' });
		await expect(
			setWebhook(ctx, { webhook: 'https://example.com/hook' }),
		).resolves.toEqual({ webhook: 'https://example.com/hook' });
	});
});
