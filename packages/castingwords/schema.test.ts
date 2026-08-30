import {
	CastingwordsEndpointInputSchemas,
	CastingwordsEndpointOutputSchemas,
} from './endpoints/types';
import { CastingwordsSchema } from './schema';

const validOrder = {
	url: 'https://example.com/audio.mp3',
	sku: ['TRANS14'] as const,
};

describe('CastingWords schemas', () => {
	it('declares a semver schema version', () => {
		expect(CastingwordsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('validates order input', () => {
		expect(
			CastingwordsEndpointInputSchemas.createOrder.safeParse(validOrder)
				.success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.createOrder.safeParse({
				...validOrder,
				url: 'not-url',
			}).success,
		).toBe(false);
	});

	it('validates all endpoint input shapes', () => {
		expect(
			CastingwordsEndpointInputSchemas.getPrepayBalance.safeParse({}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.getAudiofileDetails.safeParse({
				audiofileId: 101,
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.getTranscript.safeParse({
				audiofileId: 101,
				extension: 'txt',
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.orderUpgrade.safeParse({
				audiofileId: 101,
				sku: ['TSTMP1'],
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.refundAudiofile.safeParse({
				audiofileId: 101,
			}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.getInvoice.safeParse({ invoiceId: 10 })
				.success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.getWebhook.safeParse({}).success,
		).toBe(true);
		expect(
			CastingwordsEndpointInputSchemas.setWebhook.safeParse({
				webhook: 'https://example.com/webhook',
			}).success,
		).toBe(true);
	});

	it('validates documented order output', () => {
		const parsed = CastingwordsEndpointOutputSchemas.createOrder.parse({
			audiofiles: [101, 102],
			order: 'order-1',
			message: 'success',
		});
		expect(parsed.audiofiles).toEqual([101, 102]);
	});

	it('validates documented balance and audiofile output', () => {
		expect(
			CastingwordsEndpointOutputSchemas.getPrepayBalance.parse({
				balance: 12.5,
			}).balance,
		).toBe(12.5);
		expect(
			CastingwordsEndpointOutputSchemas.getAudiofileDetails.parse({
				audiofile: { id: 101, statename: 'Delivered' },
			}).audiofile?.statename,
		).toBe('Delivered');
	});

	it('validates transcript and invoice output', () => {
		expect(
			CastingwordsEndpointOutputSchemas.getTranscript.parse('hello transcript'),
		).toBe('hello transcript');
		expect(
			CastingwordsEndpointOutputSchemas.getInvoice.parse({
				id: 5,
				state: 'PAID',
				items: [{ sku: 'TRANS14', quantity: 1, price: 2.5, total: 2.5 }],
			}).state,
		).toBe('PAID');
	});
});
