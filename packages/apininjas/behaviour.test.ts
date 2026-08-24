/**
 * Exercises what the endpoints do with a response once they have it: which rows
 * they mirror, which values they refuse to mirror, what reaches the audit log,
 * and how the image operations wrap a non-JSON payload.
 */
import {
	Economics,
	Internet,
	Location,
	Markets,
	Reference,
	Text,
	Transport,
	Utility,
	Validation,
} from './endpoints';
import { auditPayload, withCount } from './endpoints/logging';
import { CAPTURED_RESPONSES } from './fixtures';

const TEST_KEY = 'test-api-key-not-a-real-credential';

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof Text.sentiment>[0];

function makeCtx() {
	const db = {
		airports: makeStore(),
		airlines: makeStore(),
		aircraft: makeStore(),
		vehicles: makeStore(),
		countries: makeStore(),
		cities: makeStore(),
		universities: makeStore(),
		stockExchanges: makeStore(),
		sp500: makeStore(),
		emoji: makeStore(),
		animals: makeStore(),
		planets: makeStore(),
		stars: makeStore(),
	};
	const ctx = {
		key: TEST_KEY,
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

function mockResponse(body: unknown, contentType = 'application/json') {
	global.fetch = (async (url: string) => ({
		ok: true,
		status: 200,
		statusText: 'OK',
		url,
		headers: new Headers({ 'Content-Type': contentType }),
		json: async () => body,
		text: async () =>
			contentType.includes('json') ? JSON.stringify(body) : String(body),
	})) as unknown as typeof global.fetch;
}

/** The captured response for an operation, as the provider sent it. */
function captured(key: keyof typeof CAPTURED_RESPONSES): unknown {
	const body = CAPTURED_RESPONSES[key];
	if (body === undefined) throw new Error(`no captured response for ${key}`);
	return body;
}

describe('mirroring reference data', () => {
	it('stores an airport under its ICAO identifier', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(captured('transportAirports'));

		await Transport.airports(ctx, { iata: 'LHR' });

		expect(db.airports.upsertByEntityId).toHaveBeenCalledTimes(1);
		const [id, row] = db.airports.upsertByEntityId.mock.calls[0] as [
			string,
			Record<string, unknown>,
		];
		expect(id).toBe('egll');
		expect(row.iata).toBe('LHR');
		expect(row.captured_at).toBeInstanceOf(Date);
	});

	it('stores a country under its ISO code and keeps the official currency object', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(captured('locationCountry'));

		await Location.country(ctx, { name: 'Germany' });

		const [id, row] = db.countries.upsertByEntityId.mock.calls[0] as [
			string,
			Record<string, unknown>,
		];
		expect(id).toBe('de');
		expect((row.currency as { code: string }).code).toBe('EUR');
	});

	it('keeps the three vehicle endpoints apart in one store', async () => {
		const { ctx, db } = makeCtx();

		mockResponse(captured('transportCars'));
		await Transport.cars(ctx, { model: 'corolla' });
		mockResponse(captured('transportMotorcycles'));
		await Transport.motorcycles(ctx, { make: 'Kawasaki' });
		mockResponse(captured('transportElectricVehicles'));
		await Transport.electricVehicles(ctx, { make: 'Tesla' });

		const kinds = db.vehicles.upsertByEntityId.mock.calls.map(
			(call) => (call[1] as { kind: string }).kind,
		);
		const ids = db.vehicles.upsertByEntityId.mock.calls.map((call) => call[0]);

		expect(kinds).toEqual(['car', 'motorcycle', 'electric']);
		// The natural keys collide across the three endpoints without the prefix.
		expect(
			ids.every((id, index) => id.startsWith(kinds[index] as string)),
		).toBe(true);
	});

	it('does not mirror a premium placeholder as if it were data', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([
			{
				manufacturer: 'Boeing',
				model: '737 Max 7',
				engine_type: 'This field is for premium subscribers only.',
			},
		]);

		await Transport.aircraft(ctx, { manufacturer: 'Boeing' });

		const [, row] = db.aircraft.upsertByEntityId.mock.calls[0] as [
			string,
			Record<string, unknown>,
		];
		// Storing the sentence would leave a row that outlives the plan that
		// produced it, and reads as data to anything downstream.
		expect(row.engine_type).toBeUndefined();
		expect(row.manufacturer).toBe('Boeing');
	});

	it('skips a row with no identifier rather than storing a blank key', async () => {
		const { ctx, db } = makeCtx();
		mockResponse([{ name: null, country: null }]);

		await Location.cities(ctx, { name: 'Nowhere' });

		expect(db.cities.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('mirrors nothing for a lookup that is not reference data', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(captured('marketsStockPrice'));

		await Markets.stockPrice(ctx, { ticker: 'AAPL' });

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});

	it('never evicts on a read', async () => {
		const { ctx, db } = makeCtx();
		mockResponse(captured('referenceAnimals'));

		await Reference.animals(ctx, { name: 'cheetah' });

		for (const store of Object.values(db)) {
			expect(store.deleteByEntityId).not.toHaveBeenCalled();
		}
	});

	it('survives a cache store that throws', async () => {
		const { ctx, db } = makeCtx();
		db.planets.upsertByEntityId.mockRejectedValueOnce(new Error('disk full'));
		mockResponse(captured('referencePlanets'));

		// A lookup must not fail because the local mirror could not be written.
		await expect(
			Reference.planets(ctx, { name: 'Mars' }),
		).resolves.toBeDefined();
	});
});

describe('audit payloads', () => {
	it('records the length of caller text, never the text', () => {
		const payload = auditPayload(
			{ text: 'a sentence a caller wrote' },
			[] as const,
		);

		expect(payload).toEqual({
			supplied_fields: ['text'],
			text_length: 25,
		});
		expect(JSON.stringify(payload)).not.toContain('sentence');
	});

	it('drops an email even when it is named as an identifier', () => {
		const payload = auditPayload({ email: 'someone@example.com' }, [
			'email',
		] as const);

		expect(payload.email).toBeUndefined();
		expect(JSON.stringify(payload)).not.toContain('example.com');
	});

	it('drops a phone number and an IP address', () => {
		const phone = auditPayload({ number: '+15550100' }, ['number'] as const);
		const ip = auditPayload({ address: '203.0.113.7' }, ['address'] as const);

		expect(JSON.stringify({ phone, ip })).not.toContain('15550100');
		expect(JSON.stringify({ phone, ip })).not.toContain('203.0.113.7');
	});

	it('keeps impersonal lookup keys, which are the point of the log', () => {
		const payload = auditPayload({ ticker: 'AAPL', limit: 5 }, [
			'ticker',
			'limit',
		] as const);

		expect(payload).toEqual({
			ticker: 'AAPL',
			limit: 5,
			supplied_fields: ['ticker', 'limit'],
		});
	});

	it('counts rows returned without recording them', () => {
		const payload = withCount({ ticker: 'AAPL' }, [{ a: 1 }, { b: 2 }]);

		expect(payload).toEqual({ ticker: 'AAPL', result_count: 2 });
	});
});

describe('operations that take caller data', () => {
	/**
	 * Captures the rows the core would write to `corsair_events`.
	 *
	 * `logEventFromContext` resolves an account id and then calls `logEvent`,
	 * which inserts through `ctx.database`. Watching that insert is the only way
	 * to see what would actually be stored - an earlier version of this test
	 * stubbed a `ctx.logEvent` method that the core never calls, so its array
	 * stayed empty and the assertion passed no matter what leaked.
	 */
	function makeEventLog() {
		const rows: Record<string, unknown>[] = [];
		const database = {
			db: {
				insertInto: (table: string) => ({
					values: (row: Record<string, unknown>) => ({
						execute: async () => {
							rows.push({ table, ...row });
						},
					}),
				}),
			},
		};
		return { database, rows };
	}

	it.each([
		[
			'text.sentiment',
			async (ctx: Ctx) => Text.sentiment(ctx, { text: 'private words here' }),
			'private words here',
		],
		[
			'validation.email',
			async (ctx: Ctx) =>
				Validation.email(ctx, { email: 'someone@example.com' }),
			'someone@example.com',
		],
		[
			'internet.ipLookup',
			async (ctx: Ctx) => Internet.ipLookup(ctx, { address: '203.0.113.7' }),
			'203.0.113.7',
		],
		[
			'validation.iban',
			async (ctx: Ctx) =>
				Validation.iban(ctx, { iban: 'DE89370400440532013000' }),
			'DE89370400440532013000',
		],
		[
			'economics.incomeTaxCalculator',
			async (ctx: Ctx) =>
				Economics.incomeTaxCalculator(ctx, {
					country: 'us',
					region: 'California',
					income: 125000,
					filing_status: 'single',
				}),
			'125000',
		],
	])('%s keeps its input out of the event log', async (_name, run, secret) => {
		const { ctx } = makeCtx();
		const { database, rows } = makeEventLog();
		const loggingCtx = {
			...(ctx as unknown as Record<string, unknown>),
			database,
		} as unknown as Ctx;
		mockResponse({});

		await run(loggingCtx);

		// Assert the row was written before asserting what is not in it, or the
		// check below passes on an empty list.
		expect(rows).toHaveLength(1);
		expect(rows[0]?.event_type).toBe(`apininjas.${_name}`);
		expect(JSON.stringify(rows[0]?.payload)).not.toContain(secret);
	});

	it('still records the operation and its impersonal arguments', async () => {
		// Redaction has to leave the log useful: an operator needs to see which
		// operation ran and what kind of thing it asked for.
		const { ctx } = makeCtx();
		const { database, rows } = makeEventLog();
		const loggingCtx = {
			...(ctx as unknown as Record<string, unknown>),
			database,
		} as unknown as Ctx;
		mockResponse([{ ticker: 'AAPL' }]);

		await Markets.secFilings(loggingCtx, { ticker: 'AAPL', filing: '10-K' });

		expect(rows).toHaveLength(1);
		expect(rows[0]?.event_type).toBe('apininjas.markets.secFilings');
		expect(rows[0]?.payload).toMatchObject({
			ticker: 'AAPL',
			filing: '10-K',
			supplied_fields: ['ticker', 'filing'],
		});
	});
});

describe('image operations', () => {
	it('defaults the QR code format to the one that survives the transport', async () => {
		const { ctx } = makeCtx();
		let requested = '';
		global.fetch = (async (url: string) => {
			requested = url;
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'image/svg+xml' }),
				json: async () => ({}),
				text: async () => '<svg></svg>',
			};
		}) as unknown as typeof global.fetch;

		const result = await Utility.qrCode(ctx, { data: 'https://example.com' });

		expect(requested).toContain('format=svg');
		expect(result).toEqual({
			content_type: 'image/svg+xml',
			// SVG is text, so what came back is exactly what the provider sent.
			encoding: 'text',
			data: '<svg></svg>',
		});
	});

	it('passes a caller-chosen raster format through and says so', async () => {
		const { ctx } = makeCtx();
		global.fetch = (async (url: string) => ({
			ok: true,
			status: 200,
			statusText: 'OK',
			url,
			headers: new Headers({ 'Content-Type': 'image/png' }),
			json: async () => ({}),
			text: async () => 'binary-ish',
		})) as unknown as typeof global.fetch;

		const result = await Utility.barcode(ctx, {
			text: '012345678905',
			format: 'png',
		});

		expect(result.content_type).toBe('image/png');
		// The bytes did not survive the transport's text decode, and the result
		// says so rather than presenting them as a usable PNG.
		expect(result.encoding).toBe('lossy-text');
	});

	it('honours an explicit QR format instead of the safe default', async () => {
		const { ctx } = makeCtx();
		let requested = '';
		global.fetch = (async (url: string) => {
			requested = url;
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'image/png' }),
				json: async () => ({}),
				text: async () => 'png-bytes-as-text',
			};
		}) as unknown as typeof global.fetch;

		const result = await Utility.qrCode(ctx, {
			data: 'https://example.com',
			format: 'png',
			size: 300,
			fg_color: '000000',
			bg_color: 'ffffff',
		});

		expect(requested).toContain('format=png');
		expect(requested).toContain('size=300');
		expect(result.content_type).toBe('image/png');
		expect(result.encoding).toBe('lossy-text');
	});

	it('defaults the barcode format the same way as the QR code', async () => {
		const { ctx } = makeCtx();
		let requested = '';
		global.fetch = (async (url: string) => {
			requested = url;
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'image/svg+xml' }),
				json: async () => ({}),
				text: async () => '<svg>barcode</svg>',
			};
		}) as unknown as typeof global.fetch;

		const result = await Utility.barcode(ctx, {
			text: 'hello',
			type: 'code128',
			include_text: true,
		});

		expect(requested).toContain('format=svg');
		expect(requested).toContain('type=code128');
		expect(result.data).toBe('<svg>barcode</svg>');
		expect(result.encoding).toBe('text');
	});

	it('labels the random image as JPEG, the only format it returns', async () => {
		const { ctx } = makeCtx();
		let requested = '';
		global.fetch = (async (url: string) => {
			requested = url;
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({ 'Content-Type': 'image/jpeg' }),
				json: async () => ({}),
				text: async () => 'jpeg-bytes-as-text',
			};
		}) as unknown as typeof global.fetch;

		const result = await Utility.randomImage(ctx, {
			category: 'nature',
			width: 640,
			height: 480,
		});

		expect(requested).toContain('category=nature');
		expect(result).toEqual({
			content_type: 'image/jpeg',
			// JPEG is the only format this endpoint offers, so it is always lossy
			// until the core transport can carry binary responses.
			encoding: 'lossy-text',
			data: 'jpeg-bytes-as-text',
		});
	});

	it.each([
		[
			'the QR code',
			(ctx: Ctx) => Utility.qrCode(ctx, { data: 'x', format: 'svg' }),
		],
		[
			'the barcode',
			(ctx: Ctx) => Utility.barcode(ctx, { text: 'x', format: 'svg' }),
		],
		['the random image', (ctx: Ctx) => Utility.randomImage(ctx, {})],
	])(
		'returns an empty payload rather than "undefined" when %s body is missing',
		async (_label, run) => {
			// The core transport yields `undefined` when a response carries no
			// content type at all. Without the fallback that would be stringified
			// into the literal text "undefined" and handed back as if it were an
			// image.
			const { ctx } = makeCtx();
			global.fetch = (async (url: string) => ({
				ok: true,
				status: 200,
				statusText: 'OK',
				url,
				headers: new Headers({}),
				json: async () => undefined,
				text: async () => '',
			})) as unknown as typeof global.fetch;

			const result = (await run(ctx)) as { data: string };

			expect(result.data).toBe('');
		},
	);
});
