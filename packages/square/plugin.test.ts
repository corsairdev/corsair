import {
	square,
	squareAuthConfig,
	squareEndpointMeta,
	squareEndpointSchemas,
} from './index';

// unknown: only the function's existence is checked, not what it returns.
type Leaf = (...args: never[]) => unknown;

/** Dot paths of every function in the endpoint tree. */
function endpointPaths(tree: object, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		return value && typeof value === 'object' ? endpointPaths(value, path) : [];
	});
}

const plugin = square();
const meta = squareEndpointMeta;
const paths = endpointPaths(plugin.endpoints ?? {}).sort();

const DESTRUCTIVE = [
	'cards.disable',
	'catalog.delete',
	'customAttributeDefinitions.customer.delete',
	'customAttributeDefinitions.location.delete',
	'customAttributeDefinitions.merchant.delete',
	'customAttributes.customer.delete',
	'customAttributes.location.bulkDelete',
	'customAttributes.location.delete',
	'customAttributes.merchant.bulkDelete',
	'customAttributes.merchant.delete',
	'customerGroups.delete',
	'customers.bulkDelete',
	'customers.delete',
	'disputes.accept',
	'disputes.deleteEvidence',
	'disputes.submitEvidence',
	'invoices.cancel',
	'invoices.delete',
	'invoices.deleteAttachment',
	'paymentLinks.delete',
	'payments.cancel',
	'payments.cancelByIdempotencyKey',
	'payments.refund',
	'webhookSubscriptions.delete',
];

const MONEY_MOVING = [
	'disputes.accept',
	'invoices.publish',
	'orders.pay',
	'payments.cancel',
	'payments.cancelByIdempotencyKey',
	'payments.complete',
	'payments.create',
	'payments.refund',
	'payments.update',
];

const by = (level: string) =>
	Object.entries(meta)
		.filter(([, entry]) => entry.riskLevel === level)
		.map(([op]) => op)
		.sort();

describe('Square plugin definition', () => {
	it('has metadata and schemas for every endpoint, and nothing else', () => {
		expect(paths).toHaveLength(123);
		expect(Object.keys(meta).sort()).toEqual(paths);
		expect(Object.keys(squareEndpointSchemas).sort()).toEqual(paths);
		for (const { input, output } of Object.values(squareEndpointSchemas)) {
			expect(input).toBeDefined();
			expect(output).toBeDefined();
		}
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('classifies operations as the API inventory does', () => {
		expect(by('read')).toHaveLength(56);
		expect(by('write')).toHaveLength(43);
		expect(by('destructive')).toEqual(DESTRUCTIVE);
	});

	it('marks irreversible only destructive operations', () => {
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => 'irreversible' in entry && entry.irreversible)
			.map(([op]) => op)
			.sort();
		expect(irreversible).toEqual(DESTRUCTIVE);
		// Each has a way back, so it is a write.
		expect(meta['customers.removeGroup'].riskLevel).toBe('write');
		expect('irreversible' in meta['customers.addGroup']).toBe(false);
		expect('irreversible' in meta['invoices.publish']).toBe(false);
		expect('irreversible' in meta['locations.create']).toBe(false);
		expect(
			'irreversible' in meta['webhookSubscriptions.updateSignatureKey'],
		).toBe(false);
	});

	it('says which operations move money, and only those', () => {
		const saying = Object.entries(meta)
			.filter(([, entry]) => entry.description.includes('Moves money.'))
			.map(([op]) => op)
			.sort();
		expect(saying).toEqual(MONEY_MOVING);
		// Storing a card moves nothing; later charges are payments.create.
		expect(meta['cards.create'].riskLevel).toBe('write');
	});

	it('carries the facts an agent needs before it acts', () => {
		expect(meta['invoices.publish'].description).toContain(
			'Sends the invoice to the customer and may charge the card on file; cancel with invoices.cancel.',
		);
		expect(meta['locations.create'].description).toContain(
			"Locations can't be deleted; deactivate with locations.update.",
		);
		expect(
			meta['webhookSubscriptions.updateSignatureKey'].description,
		).toContain(
			'The old signature key stops verifying as soon as the new one is issued.',
		);
		expect(meta['payments.cancelByIdempotencyKey'].description).toContain(
			"Voids a payment by the idempotency_key of the payments.create call that made it; use when that call's response was lost.",
		);
	});

	it('names the idempotency_key on every operation that takes one', () => {
		for (const op of [
			'payments.create',
			'payments.update',
			'payments.refund',
			'orders.pay',
			'cards.create',
			'catalog.upsert',
			'disputes.createEvidenceText',
		] as const) {
			expect(meta[op].description).toContain('idempotency_key');
		}
	});

	it('offers an access token and OAuth, and needs nothing else', () => {
		expect(Object.keys(squareAuthConfig).sort()).toEqual([
			'api_key',
			'oauth_2',
		]);
		expect(squareAuthConfig.api_key.account).toEqual([]);
		expect(plugin.authConfig).toBe(squareAuthConfig);
		expect(plugin.endpointMeta).toBe(squareEndpointMeta);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://connect.squareup.com/oauth2/token',
		);
	});

	it('keeps DEFAULT the last error handler whatever the caller adds', () => {
		const custom = square({
			errorHandlers: {
				NOT_FOUND_ERROR: {
					match: () => true,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names[names.length - 1]).toBe('DEFAULT');
		expect(names).toContain('NOT_FOUND_ERROR');
		expect(names.indexOf('PAYMENT_METHOD_ERROR')).toBe(0);
	});

	it('lets the caller replace DEFAULT itself', () => {
		const DEFAULT = {
			match: () => true,
			handler: async () => ({ maxRetries: 1 }),
		};
		const custom = square({ errorHandlers: { DEFAULT } });
		expect(custom.errorHandlers?.DEFAULT).toBe(DEFAULT);
	});

	it('exposes only functions at the leaves', () => {
		const leaves: Leaf[] = [];
		const walk = (node: object) => {
			for (const value of Object.values(node)) {
				if (typeof value === 'function') leaves.push(value);
				else if (value && typeof value === 'object') walk(value);
			}
		};
		walk(plugin.endpoints ?? {});
		expect(leaves).toHaveLength(123);
	});
});
