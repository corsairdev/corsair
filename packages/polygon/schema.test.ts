import {
	CustomerSchema,
	CustomersCreateInputSchema,
	POLYGON_CRYPTO_NETWORKS,
	POLYGON_TRANSACTION_STATUSES,
	QuotesCreateInputSchema,
	TransactionsCreateInputSchema,
	WebhookSchema,
	WebhooksCreateInputSchema,
} from './endpoints/types';
import { PolygonSchema } from './schema';

describe('Polygon plugin schema', () => {
	it('declares a semver version', () => {
		expect(PolygonSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing locally', () => {
		expect(PolygonSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PolygonSchema.entities)).toBe(false);
	});
});

describe('customer schemas', () => {
	it('parses a customer with a null hold and a null failure', () => {
		expect(
			CustomerSchema.safeParse({
				id: 'cst_01H9Xa8F5dN6mP3q',
				type: 'individual',
				name: 'Jane Smith',
				status: 'active',
				hold: null,
				failure: null,
				signedAgreement: true,
				endorsements: ['basic'],
				createdAt: '2026-01-01T00:00:00Z',
			}).success,
		).toBe(true);
	});

	it('parses an actionRequired customer with a hold code', () => {
		expect(
			CustomerSchema.safeParse({
				id: 'cst_1',
				status: 'actionRequired',
				hold: { code: 'kycDocumentNeeded', reason: 'Upload an ID' },
			}).success,
		).toBe(true);
	});

	it('keeps the status a string so an unseen value cannot fail a read', () => {
		expect(
			CustomerSchema.safeParse({ id: 'cst_1', status: 'someFutureStatus' })
				.success,
		).toBe(true);
	});

	it('accepts an individual with a name and no optional fields', () => {
		expect(
			CustomersCreateInputSchema.safeParse({
				type: 'individual',
				firstName: 'Jane',
				lastName: 'Smith',
			}).success,
		).toBe(true);
	});

	it('accepts a business with a legal name and email', () => {
		expect(
			CustomersCreateInputSchema.safeParse({
				type: 'business',
				companyLegalName: 'Acme Logistics',
				email: 'ops@acme.example',
			}).success,
		).toBe(true);
	});

	it('rejects a country code that is not two letters', () => {
		expect(
			CustomersCreateInputSchema.safeParse({
				type: 'individual',
				firstName: 'Jane',
				lastName: 'Smith',
				nationality: 'USA',
			}).success,
		).toBe(false);
	});
});

describe('network schemas', () => {
	it('pins the documented network vocabulary', () => {
		expect(POLYGON_CRYPTO_NETWORKS).toEqual([
			'ethereum',
			'polygon',
			'base',
			'solana',
			'tron',
			'bnb',
		]);
	});
});

describe('transaction schemas', () => {
	it('pins the documented lifecycle statuses', () => {
		expect(POLYGON_TRANSACTION_STATUSES).toEqual([
			'processing',
			'awaitingAction',
			'completed',
			'failed',
		]);
	});

	it('requires only a quote id on create', () => {
		expect(
			TransactionsCreateInputSchema.safeParse({ quoteId: 'qt_1' }).success,
		).toBe(true);
		expect(TransactionsCreateInputSchema.safeParse({}).success).toBe(false);
	});

	it('accepts a web session id, which a card-funded quote requires', () => {
		expect(
			TransactionsCreateInputSchema.safeParse({
				quoteId: 'qt_1',
				webSessionId: 'sess_abc',
				deviceFingerprint: 'fp_abc',
			}).success,
		).toBe(true);
	});
});

describe('quote amount rules', () => {
	const base = {
		customerId: 'cst_1',
		source: {
			type: 'walletCrypto' as const,
			details: { id: 'wlt_1', asset: 'usdc', network: 'polygon' as const },
		},
		destination: {
			type: 'bankUs' as const,
			details: { id: 'ext_1', asset: 'usd' as const },
		},
	};

	it('accepts the amount on the source side only', () => {
		expect(
			QuotesCreateInputSchema.safeParse({
				...base,
				source: { ...base.source, amount: '100.00' },
			}).success,
		).toBe(true);
	});

	it('accepts the amount on the destination side only', () => {
		expect(
			QuotesCreateInputSchema.safeParse({
				...base,
				destination: { ...base.destination, amount: '100.00' },
			}).success,
		).toBe(true);
	});

	it('rejects an amount on both sides and on neither', () => {
		expect(
			QuotesCreateInputSchema.safeParse({
				...base,
				source: { ...base.source, amount: '100.00' },
				destination: { ...base.destination, amount: '100.00' },
			}).success,
		).toBe(false);
		expect(QuotesCreateInputSchema.safeParse(base).success).toBe(false);
	});

	it('caps a cash amount at the documented 400.00 maximum by rule, not by type', () => {
		// The spec states the limit in prose, so the schema documents it and the
		// provider enforces it; a 500.00 amount must still be sendable to be rejected.
		expect(
			QuotesCreateInputSchema.safeParse({
				customerId: 'cst_1',
				source: { ...base.source, amount: '500.00' },
				destination: {
					type: 'cash',
					details: {
						asset: 'usd',
						cashLocationId: 'loc_CVS10804',
						cashLocationReference: 'ref_1',
						amount: '500.00',
					},
				},
			}).success,
		).toBe(true);
	});
});

describe('webhook schemas', () => {
	it('parses a webhook with the wildcard subscription', () => {
		expect(
			WebhookSchema.safeParse({
				id: 'whk_1',
				object: 'webhook',
				url: 'https://partner.example/webhooks',
				status: 'enabled',
				subscriptions: ['*'],
				timeoutMs: 5000,
				mode: 'sandbox',
				createdAt: '2026-01-01T00:00:00Z',
			}).success,
		).toBe(true);
	});

	it('requires a url and at least one subscription', () => {
		expect(
			WebhooksCreateInputSchema.safeParse({
				url: 'https://partner.example/webhooks',
				subscriptions: ['transaction.settled'],
			}).success,
		).toBe(true);
		expect(
			WebhooksCreateInputSchema.safeParse({
				url: 'https://partner.example/webhooks',
				subscriptions: [],
			}).success,
		).toBe(false);
		expect(
			WebhooksCreateInputSchema.safeParse({ subscriptions: ['*'] }).success,
		).toBe(false);
	});

	it('pins the notify threshold to the documented 600 to 86400 seconds', () => {
		const base = {
			url: 'https://partner.example/webhooks',
			subscriptions: ['*'],
		};
		expect(
			WebhooksCreateInputSchema.safeParse({
				...base,
				notifyThresholdSecs: 600,
			}).success,
		).toBe(true);
		expect(
			WebhooksCreateInputSchema.safeParse({
				...base,
				notifyThresholdSecs: 599,
			}).success,
		).toBe(false);
		expect(
			WebhooksCreateInputSchema.safeParse({
				...base,
				notifyThresholdSecs: 86_401,
			}).success,
		).toBe(false);
	});
});
