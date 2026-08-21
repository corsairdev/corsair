/**
 * Checks the zod schemas against two independent sources of truth: the
 * provider's documentation, and responses captured from the live API.
 *
 * The documentation says which parameters an endpoint accepts and which fields
 * it returns; a captured response says what it actually sent. A schema has to
 * satisfy both, and the two disagree often enough on this API that checking
 * only one would miss real gaps - the free tier returns prose where the
 * documentation promises a number, and several endpoints return fields the
 * documentation never mentions.
 */
import { z } from 'zod';
import { DOCUMENTED_OPERATIONS } from './docs-contract';
import {
	ApiNinjasEndpointInputSchemas,
	ApiNinjasEndpointOutputSchemas,
} from './endpoints/types';
import { CAPTURED_RESPONSES } from './fixtures';
import { ApiNinjasSchema } from './schema';

type AnySchema = z.ZodType;

/**
 * Unwraps optional, nullable, array and union wrappers to reach the object at
 * the centre of a schema, so its declared keys can be read.
 */
function objectShape(schema: AnySchema): Record<string, AnySchema> | undefined {
	let current: AnySchema | undefined = schema;

	for (let depth = 0; current && depth < 10; depth++) {
		if (current instanceof z.ZodObject) {
			return current.shape as Record<string, AnySchema>;
		}
		if (current instanceof z.ZodArray) {
			current = current.element as AnySchema;
			continue;
		}
		if (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
			current = current.unwrap() as AnySchema;
			continue;
		}
		if (current instanceof z.ZodUnion) {
			const objectMember: AnySchema | undefined = (
				current.options as AnySchema[]
			).find((option) => objectShape(option) !== undefined);
			if (!objectMember) return undefined;
			current = objectMember;
			continue;
		}
		return undefined;
	}

	return undefined;
}

/** True when a schema accepts `undefined`, which is how zod models optional. */
function isOptional(schema: AnySchema): boolean {
	return schema.safeParse(undefined).success;
}

const OPERATIONS = Object.keys(DOCUMENTED_OPERATIONS);

/** Reads a documented operation, failing loudly rather than skipping silently. */
function documentedFor(key: string) {
	const documented = DOCUMENTED_OPERATIONS[key];
	if (!documented) throw new Error(`no documented contract for ${key}`);
	return documented;
}

describe('documented parameters', () => {
	it('covers every operation in the registry', () => {
		expect(OPERATIONS.sort()).toEqual(
			Object.keys(ApiNinjasEndpointInputSchemas).sort(),
		);
		expect(OPERATIONS).toHaveLength(129);
	});

	test.each(OPERATIONS)('%s accepts every documented parameter', (key) => {
		const documented = documentedFor(key);
		const schema = ApiNinjasEndpointInputSchemas[
			key as keyof typeof ApiNinjasEndpointInputSchemas
		] as AnySchema;
		const shape = objectShape(schema);

		expect(shape).toBeDefined();
		const declared = Object.keys(shape ?? {});

		for (const param of documented.params) {
			expect(declared).toContain(param.name);
		}
	});

	test.each(OPERATIONS)('%s declares no undocumented parameter', (key) => {
		const documented = documentedFor(key);
		const shape = objectShape(
			ApiNinjasEndpointInputSchemas[
				key as keyof typeof ApiNinjasEndpointInputSchemas
			] as AnySchema,
		);
		const documentedNames = documented.params.map((param) => param.name);

		for (const declared of Object.keys(shape ?? {})) {
			expect(documentedNames).toContain(declared);
		}
	});

	test.each(OPERATIONS)(
		'%s requires what the documentation requires',
		(key) => {
			const documented = documentedFor(key);
			const shape = objectShape(
				ApiNinjasEndpointInputSchemas[
					key as keyof typeof ApiNinjasEndpointInputSchemas
				] as AnySchema,
			);

			for (const param of documented.params) {
				const field = shape?.[param.name];
				if (!field) continue;

				// A premium parameter cannot be required of a free-tier caller, and a
				// documented combination is validated by the provider rather than
				// here, so both stay optional whatever the parameter table says.
				//
				// `enforced: false` marks the three parameters the table calls
				// required and the provider accepts as missing - the QR code format,
				// and two of the three car filters. The schema follows the provider
				// there, because demanding a parameter the API does not need would
				// reject calls that work.
				const shouldBeRequired =
					param.required &&
					!param.premium &&
					!documented.combination &&
					param.enforced !== false;

				expect({ name: param.name, optional: isOptional(field) }).toEqual({
					name: param.name,
					optional: !shouldBeRequired,
				});
			}
		},
	);
});

describe('documented response fields', () => {
	const withFields = OPERATIONS.filter(
		(key) => documentedFor(key).responseFields.length > 0,
	);

	it('has documented response fields to check', () => {
		expect(withFields.length).toBeGreaterThan(80);
	});

	test.each(withFields)('%s declares every documented field', (key) => {
		const documented = documentedFor(key);
		const shape = objectShape(
			ApiNinjasEndpointOutputSchemas[
				key as keyof typeof ApiNinjasEndpointOutputSchemas
			] as AnySchema,
		);

		expect(shape).toBeDefined();
		const declared = Object.keys(shape ?? {});

		for (const field of documented.responseFields) {
			expect(declared).toContain(field);
		}
	});
});

describe('captured responses', () => {
	const captured = Object.keys(CAPTURED_RESPONSES);

	it('has a capture for most operations', () => {
		// Nine operations are premium-gated or quota-exhausted on the free tier and
		// could not be captured; their schemas come from the documentation alone.
		expect(captured).toHaveLength(120);
	});

	test.each(Object.keys(CAPTURED_RESPONSES))(
		'%s parses the response the provider actually sent',
		(key) => {
			const schema = ApiNinjasEndpointOutputSchemas[
				key as keyof typeof ApiNinjasEndpointOutputSchemas
			] as AnySchema;

			const result = schema.safeParse(
				CAPTURED_RESPONSES[key as keyof typeof CAPTURED_RESPONSES],
			);
			if (!result.success) {
				throw new Error(
					`${key} rejected its own captured response: ${JSON.stringify(
						result.error.issues.slice(0, 3),
					)}`,
				);
			}
			expect(result.success).toBe(true);
		},
	);

	/**
	 * The three image operations return a wrapper this plugin builds - the
	 * content type plus the payload - rather than a provider object, so there is
	 * no such thing as a field the provider might add to them.
	 */
	const PLUGIN_SHAPED = new Set([
		'utilityQrCode',
		'utilityBarcode',
		'utilityRandomImage',
	]);

	test.each(
		Object.keys(CAPTURED_RESPONSES).filter((key) => !PLUGIN_SHAPED.has(key)),
	)('%s keeps fields it does not declare', (key) => {
		const captured = CAPTURED_RESPONSES[key as keyof typeof CAPTURED_RESPONSES];
		const row = Array.isArray(captured) ? captured[0] : captured;
		if (!row || typeof row !== 'object') return;

		const schema = ApiNinjasEndpointOutputSchemas[
			key as keyof typeof ApiNinjasEndpointOutputSchemas
		] as AnySchema;

		// Loose objects pass unknown keys through. An endpoint that dropped them
		// would silently lose data the provider added after this was written.
		const withExtra = Array.isArray(captured)
			? [{ ...row, corsair_unknown_field: 'kept' }]
			: { ...row, corsair_unknown_field: 'kept' };

		const parsed = schema.parse(withExtra) as
			| Record<string, unknown>
			| Record<string, unknown>[];
		const parsedRow = Array.isArray(parsed) ? parsed[0] : parsed;

		expect(parsedRow?.corsair_unknown_field).toBe('kept');
	});
});

describe('premium masking', () => {
	it('accepts prose in the fields the free tier withholds', () => {
		// This is a real free-tier stock quote: the price and volume arrive as
		// numbers, while the company name, exchange and currency arrive as a
		// sentence explaining they are premium. A schema that typed those three as
		// strings only, or as numbers only, would be wrong on one plan or the
		// other.
		const freeTier = {
			ticker: 'AAPL',
			name: 'This field is for premium subscribers only.',
			price: 305.79,
			exchange: 'This field is for premium subscribers only.',
			updated: 1786733311,
			currency: 'This field is for premium subscribers only.',
			volume: 16020092.94593,
		};

		expect(
			ApiNinjasEndpointOutputSchemas.marketsStockPrice.safeParse(freeTier)
				.success,
		).toBe(true);
	});

	it('accepts a numeric field that a paid plan fills in', () => {
		// The nutrition endpoint masks every macro on the free tier, so each one
		// has to accept the sentence and the number it replaces.
		const masked = ApiNinjasEndpointOutputSchemas.healthNutrition.safeParse([
			{
				name: 'brisket',
				calories: 'Only available for premium subscribers.',
				fat_total_g: 'Only available for premium subscribers.',
			},
		]);
		const real = ApiNinjasEndpointOutputSchemas.healthNutrition.safeParse([
			{ name: 'brisket', calories: 1312.3, fat_total_g: 82.9 },
		]);

		expect({ masked: masked.success, real: real.success }).toEqual({
			masked: true,
			real: true,
		});
	});

	it('accepts the same row with real values on a paid plan', () => {
		const paid = {
			ticker: 'AAPL',
			name: 'Apple Inc.',
			price: 305.79,
			exchange: 'NASDAQ',
			updated: 1786733311,
			currency: 'USD',
			volume: 16020092.94593,
		};

		expect(
			ApiNinjasEndpointOutputSchemas.marketsStockPrice.safeParse(paid).success,
		).toBe(true);
	});

	it('accepts a row that carries only its identifying field', () => {
		// Rows arrive with different field sets by plan, by record and by
		// endpoint, so a row stripped to one field still has to parse.
		expect(
			ApiNinjasEndpointOutputSchemas.transportAirports.safeParse([
				{ icao: 'EGLL' },
			]).success,
		).toBe(true);
	});
});

describe('persisted entities', () => {
	const entities = Object.keys(ApiNinjasSchema.entities);

	it('mirrors reference data only', () => {
		expect(entities.sort()).toEqual(
			[
				'aircraft',
				'airlines',
				'airports',
				'animals',
				'cities',
				'countries',
				'emoji',
				'planets',
				'sp500',
				'stars',
				'stockExchanges',
				'universities',
				'vehicles',
			].sort(),
		);
	});

	it('mirrors nothing that is a price, a generated value or caller data', () => {
		// A cached price is wrong rather than merely old, a cached random value is
		// not random, and caller data does not belong in a shared mirror.
		const forbidden = [
			'stockPrice',
			'cryptoPrice',
			'bitcoin',
			'commodityPrice',
			'exchangeRate',
			'marketCap',
			'mortgageRate',
			'interestRate',
			'jokes',
			'quotes',
			'facts',
			'randomUser',
			'password',
			'sentiment',
			'ipLookup',
			'email',
		];

		for (const name of forbidden) {
			expect(entities).not.toContain(name);
		}
	});

	it('gives every entity a primary key and a capture time', () => {
		for (const [name, entity] of Object.entries(ApiNinjasSchema.entities)) {
			const shape = objectShape(entity as AnySchema);
			expect({ name, hasId: Boolean(shape?.id) }).toEqual({
				name,
				hasId: true,
			});
			expect({ name, hasCapturedAt: Boolean(shape?.captured_at) }).toEqual({
				name,
				hasCapturedAt: true,
			});
			// Only the key is required: a row that arrives with nothing else must
			// still be storable.
			expect({ name, idRequired: !isOptional(shape?.id as AnySchema) }).toEqual(
				{
					name,
					idRequired: true,
				},
			);
		}
	});
});
