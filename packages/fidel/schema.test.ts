import { FidelEndpointInputSchemas } from './endpoints/types';
import { fidel, fidelEndpointSchemas } from './index';
import { FidelSchema } from './schema';

jest.mock('./client', () => ({
	makeFidelRequest: jest.fn(),
}));

import { makeFidelRequest } from './client';

// unknown: zod v4 field internals are read to derive type-appropriate
// boundary values; stricter typing would couple the tests to zod internals.
type ZodField = {
	isOptional: () => boolean;
	_zod: {
		def: {
			type: string;
			element?: ZodField;
			entries?: Record<string, string>;
		};
	};
};

function scalarFor(field: ZodField, key: string): unknown {
	const type = field._zod.def.type;
	if (type === 'number') {
		return 1;
	}
	if (type === 'boolean') {
		return true;
	}
	if (type === 'record') {
		// An empty object is the smallest valid open-shaped value.
		return {};
	}
	if (type === 'enum') {
		// unknown: zod v4 enum defs store the allowed members in entries; the
		// first documented member satisfies the contract.
		const entries = field._zod.def.entries;
		return entries ? Object.values(entries)[0] : 'test-' + key;
	}
	if (type === 'array') {
		// unknown: zod v4 array element defs are read structurally to build a
		// type-appropriate scalar; stricter typing would couple the test to
		// zod internals.
		const element = field._zod.def.element;
		return [element ? scalarFor(element, key) : 'test-' + key];
	}
	return 'test-' + key;
}

function buildValidInput(schema: {
	shape: Record<string, ZodField>;
}): Record<string, unknown> {
	// Minimal valid input: only required fields get values. Optional fields
	// stay absent — placeholder strings would violate enum and array
	// contracts and test nothing about the required-field boundary.
	const input: Record<string, unknown> = {};
	for (const [key, field] of Object.entries(schema.shape)) {
		if (field.isOptional()) continue;
		input[key] = scalarFor(field, key);
	}
	return input;
}

describe('Fidel schema', () => {
	it('declares a semver version', () => {
		expect(FidelSchema.version).toBeDefined();
		expect(FidelSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FidelSchema.entities).toBe('object');
		expect(FidelSchema.entities).not.toBeNull();
	});

	it('registers the full current Fidel operation catalog', () => {
		expect(Object.keys(fidelEndpointSchemas).length).toBeGreaterThanOrEqual(55);
	});

	it('provides executable input and output contracts for every operation', () => {
		for (const schemas of Object.values(fidelEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('requires required fields at the schema boundary for every operation', () => {
		for (const [, rawSchema] of Object.entries(FidelEndpointInputSchemas)) {
			// unknown: zod v4 schema objects are accessed structurally to derive
			// the required-field table; stricter typing would couple the test to
			// zod internals.
			const schema = rawSchema as unknown as {
				shape: Record<string, ZodField>;
				safeParse: (value: unknown) => { success: boolean };
			};
			const required = Object.keys(schema.shape).filter(
				// unknown: zod v4 field records are read structurally; optional
				// chaining guards the indexed access under noUncheckedIndexedAccess.
				(key) => schema.shape[key]?.isOptional() === false,
			);
			if (!required.length) continue;
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse(buildValidInput(schema)).success).toBe(true);
		}
	});

	it('rejects unsafe path identifiers at the endpoint boundary', async () => {
		const plugin = fidel({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		const unsafe = '../programs';
		// unknown: only two representative tree leaves are exercised here and
		// the plugin tree nests every family recursively, so the test narrows
		// the two accessed leaves instead of naming the full recursive type.
		await expect(
			(
				plugin.endpoints as unknown as {
					brands: {
						retrieveBrand: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).brands.retrieveBrand(ctx, { brandId: unsafe }),
		).rejects.toThrow('Invalid Fidel brandId');
		await expect(
			(
				plugin.endpoints as unknown as {
					cards: {
						deleteCard: (ctx: unknown, input: unknown) => Promise<unknown>;
					};
				}
			).cards.deleteCard(ctx, { cardId: '.' }),
		).rejects.toThrow('Invalid Fidel cardId');
	});

	// Per the plugin endpoint-test rule, this table-driven traversal invokes
	// every registered operation and asserts one request plus response parsing.
	it('exercises every registered operation through its public boundary', async () => {
		const request = jest.mocked(makeFidelRequest);
		request.mockClear();
		const plugin = fidel({ key: 'secret' });
		// never: the fixture provides exactly the context fields these
		// handlers read (key, options, $getAccountId); omitted runtime
		// services are not exercised by this plugin endpoints.
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		// unknown: spec-derived mocks, one per operation, keyed by operation path.
		const fixedOutputs: Record<string, unknown> = {
			'brands.createBrand': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/brands',
				status: 200,
			},
			'brands.retrieveBrand': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/brands',
				status: 200,
			},
			'brands.listBrands': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/brands',
				status: 200,
			},
			'brands.updateBrand': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/brands',
				status: 200,
			},
			'brands.deleteBrand': undefined,
			'programs.listPrograms': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/programs',
				status: 200,
			},
			'programs.createProgram': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/programs',
				status: 200,
			},
			'programs.updateProgram': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/programs',
				status: 200,
			},
			'programs.retrieveProgram': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/programs',
				status: 200,
			},
			'locations.createLocation': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.retrieveLocation': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.updateLocation': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.listLocations': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.listLocationsByBrand': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.listLocationsByOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/locations',
				status: 200,
			},
			'locations.deleteLocation': undefined,
			'cards.retrieveCard': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/cards',
				status: 200,
			},
			'cards.listCards': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/cards',
				status: 200,
			},
			'cards.listCardsFromMetadataId': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/cards',
				status: 200,
			},
			'cards.deleteCard': undefined,
			'cards.updateCardMetadata': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/cards',
				status: 200,
			},
			'webhooks.createBrandWebhook': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/webhooks',
				status: 200,
			},
			'webhooks.createProgramWebhook': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/webhooks',
				status: 200,
			},
			'webhooks.retrieveWebhook': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/webhooks',
				status: 200,
			},
			'webhooks.updateWebhook': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/webhooks',
				status: 200,
			},
			'webhooks.listWebhooks': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/webhooks',
				status: 200,
			},
			'webhooks.deleteWebhook': undefined,
			'offers.createOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.updateOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.retrieveOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.listOffers': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.deleteOffer': undefined,
			'offers.linkLocationToOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.linkAllBrandLocationsToOffer': { status: 'accepted' },
			'offers.unlinkLocationToOffer': undefined,
			'offers.sendOfferToBrand': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.activateOfferOnCard': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.unlinkCardFromOffer': undefined,
			'offers.retrieveActiveOfferOnCard': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'offers.listCardsWithActiveOffer': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/offers',
				status: 200,
			},
			'transactions.createTransactionTest': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/transactions',
				status: 200,
			},
			'transactions.retrieveTransaction': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/transactions',
				status: 200,
			},
			'transactions.listTransactions': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/transactions',
				status: 200,
			},
			'transactions.listTransactionsByCard': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/transactions',
				status: 200,
			},
			'mids.listMids': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mids',
				status: 200,
			},
			'mids.retrieveMid': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mids',
				status: 200,
			},
			'mid-requests.retrieveMidRequest': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mid-requests',
				status: 200,
			},
			'mid-requests.listMidRequests': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mid-requests',
				status: 200,
			},
			'mid-requests.createMidRequest': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mid-requests',
				status: 200,
			},
			'marketplace.listMarketplaceOffers': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/marketplace',
				status: 200,
			},
			'marketplace.createOfferFromMarketplaceOffer': { status: 'accepted' },
			'missing-transaction-requests.createMissingTransactionRequest': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/missing-transaction-requests',
				status: 200,
			},
			'missing-transaction-requests.retrieveMissingTransactionRequest': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/missing-transaction-requests',
				status: 200,
			},
			'missing-transaction-requests.listMissingTransactionRequests': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/missing-transaction-requests',
				status: 200,
			},
			'mid-insights.listMidInsights': {
				items: [
					{
						id: 'rec-1',
						created: '2024-01-01T00:00:00.000Z',
						updated: '2024-01-01T00:00:00.000Z',
					},
				],
				resource: '/v1/mid-insights',
				status: 200,
			},
		};
		let invokedOperations = 0;
		// unknown: the walk covers functions and group objects across the
		// plugin tree; the contract resolves only after the path joins.
		const visit = async (value: unknown, prefix: string[] = []) => {
			if (typeof value === 'function') {
				invokedOperations += 1;
				const path = prefix.join('.') as keyof typeof fidelEndpointSchemas;
				const contract = fidelEndpointSchemas[path];
				if (!contract) throw new Error(`Missing contract for ${path}`);
				if (!contract.input || !contract.output) {
					throw new Error(`Missing input or output contract for ${path}`);
				}
				// unknown: zod v4 schema objects are read structurally to build a
				// valid input; stricter typing would couple the test to zod.
				const shape = (
					contract.input as unknown as {
						shape: Record<string, ZodField>;
					}
				).shape;
				const input: Record<string, unknown> = {};
				for (const [key, field] of Object.entries(shape)) {
					if (field.isOptional()) continue;
					input[key] = scalarFor(field, key);
				}
				if (!(path in fixedOutputs)) {
					throw new Error(
						'No fixed provider-shaped response registered for ' + String(path),
					);
				}
				const output = fixedOutputs[path];
				request.mockResolvedValue(output);
				const result =
					await // unknown: walked leaf invoked at the boundary under test
					(value as (context: unknown, args: unknown) => Promise<unknown>)(
						ctx,
						input,
					);
				if (output === undefined) {
					expect(result).toBeUndefined();
				} else {
					expect(result).toEqual(output);
				}
				return;
			}
			if (value && typeof value === 'object') {
				for (const [key, child] of Object.entries(value)) {
					await visit(child, [...prefix, key]);
				}
			}
		};

		await visit(plugin.endpoints);
		expect(invokedOperations).toBe(Object.keys(fidelEndpointSchemas).length);
		expect(request).toHaveBeenCalledTimes(invokedOperations);
	});

	it('exposes the key builder and forwards hooks and error handlers', async () => {
		const plugin = fidel({ key: 'sk_test_fidel' });
		// unknown: the factory contract is exercised structurally; the plugin
		// type derives from the core CorsairPlugin mapping.
		const wired = plugin as unknown as {
			keyBuilder: (ctx: unknown, source: string) => Promise<string | undefined>;
			hooks: unknown;
			errorHandlers: Record<string, unknown>;
		};
		expect(typeof wired.keyBuilder).toBe('function');
		const key = await wired.keyBuilder({ authType: 'api_key' }, 'endpoint');
		expect(key).toBe('sk_test_fidel');
		const unkeyed = fidel({}) as unknown as {
			keyBuilder: (ctx: unknown, source: string) => Promise<string | undefined>;
		};
		await expect(
			unkeyed.keyBuilder(
				{ authType: 'api_key', keys: { get_api_key: async () => undefined } },
				'endpoint',
			),
		).rejects.toThrow();
		const hooks = { operation: {} };
		const hooked = fidel({ hooks: hooks as never });
		expect((hooked as unknown as { hooks: unknown }).hooks).toBe(hooks);
		const customDefault = {
			match: () => true,
			handler: async () => ({ maxRetries: 0 }),
		};
		const merged = fidel({ errorHandlers: { DEFAULT: customDefault } });
		const mergedHandlers = (
			merged as unknown as {
				errorHandlers: Record<string, unknown>;
			}
		).errorHandlers;
		expect(mergedHandlers.DEFAULT).toBe(customDefault);
		expect(mergedHandlers.RATE_LIMIT_ERROR).toBeDefined();
	});
});
