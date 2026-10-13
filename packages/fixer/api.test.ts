import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { FixerAPIError } from './client';
import { fixer } from './index';

const KEY = 'fixer-test-key';
const BASE = 'https://data.fixer.io/api';

type Stub = { status?: number; body: object; headers?: Record<string, string> };

let fetchSpy: jest.SpiedFunction<typeof fetch>;
let cleanup: () => void;

function stubFetch(...stubs: Stub[]) {
	let call = 0;
	fetchSpy = jest.spyOn(globalThis, 'fetch').mockImplementation(async () => {
		const stub = stubs[Math.min(call++, stubs.length - 1)]!;
		return new Response(JSON.stringify(stub.body), {
			status: stub.status ?? 200,
			headers: { 'Content-Type': 'application/json', ...stub.headers },
		});
	});
}

function requested(index = 0) {
	const [url, init] = fetchSpy.mock.calls[index]!;
	return { url: String(url), method: init?.method };
}

let fixerDb: Awaited<ReturnType<typeof setup>>['db'];

async function createFixer() {
	const { api, db } = await setup();
	fixerDb = db;
	return api;
}

async function setup() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'fixer', 'default');
	cleanup = testDb.cleanup;
	const corsair = createCorsair({
		plugins: [fixer({ key: KEY })],
		database: testDb.db,
		kek: '0123456789abcdef0123456789abcdef',
	});
	return { api: corsair.fixer.api, db: corsair.fixer.db };
}

afterEach(() => {
	jest.restoreAllMocks();
	cleanup?.();
});

describe('Fixer endpoints', () => {
	it('rates.latest sends base and comma-joined symbols', async () => {
		const body = {
			success: true,
			timestamp: 1700000000,
			base: 'EUR',
			date: '2026-10-12',
			rates: { USD: 1.08, GBP: 0.85 },
		};
		stubFetch({ body });
		const api = await createFixer();

		const result = await api.rates.latest({
			base: 'EUR',
			symbols: ['USD', 'GBP'],
		});

		expect(requested()).toEqual({
			url: `${BASE}/latest?access_key=${KEY}&base=EUR&symbols=USD%2CGBP`,
			method: 'GET',
		});
		expect(result).toEqual(body);
	});

	it('rates.historical puts the date in the path', async () => {
		const body = {
			success: true,
			historical: true,
			date: '2026-01-01',
			base: 'EUR',
			rates: { USD: 1.04 },
		};
		stubFetch({ body });
		const api = await createFixer();

		const result = await api.rates.historical({
			date: '2026-01-01',
			symbols: ['USD'],
		});

		expect(requested()).toEqual({
			url: `${BASE}/2026-01-01?access_key=${KEY}&symbols=USD`,
			method: 'GET',
		});
		expect(result).toEqual(body);
	});

	it('rates.historical rejects an impossible date without a request', async () => {
		stubFetch({ body: {} });
		const api = await createFixer();

		await expect(
			api.rates.historical({ date: '2025-02-29' }),
		).rejects.toThrow();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('rates.convert sends from, to, amount and date', async () => {
		const body = {
			success: true,
			query: { from: 'USD', to: 'EUR', amount: 100 },
			info: { timestamp: 1700000000, rate: 0.92 },
			date: '2026-01-01',
			result: 92,
		};
		stubFetch({ body });
		const api = await createFixer();

		const result = await api.rates.convert({
			from: 'USD',
			to: 'EUR',
			amount: 100,
			date: '2026-01-01',
		});

		expect(requested()).toEqual({
			url: `${BASE}/convert?access_key=${KEY}&from=USD&to=EUR&amount=100&date=2026-01-01`,
			method: 'GET',
		});
		expect(result).toEqual(body);
	});

	it('currencies.getAll calls /symbols', async () => {
		const body = {
			success: true,
			symbols: { USD: 'United States Dollar', EUR: 'Euro' },
		};
		stubFetch({ body });
		const api = await createFixer();

		const result = await api.currencies.getAll({});

		expect(requested()).toEqual({
			url: `${BASE}/symbols?access_key=${KEY}`,
			method: 'GET',
		});
		expect(result).toEqual(body);
	});
});

describe('Fixer entity persistence', () => {
	it('rates.latest stores a snapshot keyed by base and date', async () => {
		stubFetch({
			body: {
				success: true,
				timestamp: 1700000000,
				base: 'EUR',
				date: '2026-10-12',
				rates: { USD: 1.08, GBP: 0.85 },
			},
		});
		const api = await createFixer();

		await api.rates.latest({});

		const row = await fixerDb.rates.findByEntityId('EUR:2026-10-12');
		expect(row?.data).toMatchObject({
			base: 'EUR',
			date: '2026-10-12',
			timestamp: 1700000000,
			historical: false,
			rates: { USD: 1.08, GBP: 0.85 },
		});
	});

	it('rates.historical stores a historical snapshot', async () => {
		stubFetch({
			body: {
				success: true,
				historical: true,
				date: '2026-01-01',
				base: 'GBP',
				rates: { USD: 1.25 },
			},
		});
		const api = await createFixer();

		await api.rates.historical({ date: '2026-01-01', base: 'GBP' });

		const row = await fixerDb.rates.findByEntityId('GBP:2026-01-01');
		expect(row?.data).toMatchObject({ historical: true, rates: { USD: 1.25 } });
	});

	it('a symbols-filtered fetch keeps rates stored earlier for the same base and date', async () => {
		const day = {
			success: true,
			historical: true,
			date: '2026-01-01',
			base: 'EUR',
		};
		stubFetch(
			{ body: { ...day, rates: { USD: 1.04 } } },
			{ body: { ...day, rates: { GBP: 0.85 } } },
		);
		const api = await createFixer();

		await api.rates.historical({ date: '2026-01-01', symbols: ['USD'] });
		await api.rates.historical({ date: '2026-01-01', symbols: ['GBP'] });

		const row = await fixerDb.rates.findByEntityId('EUR:2026-01-01');
		expect(row?.data.rates).toEqual({ USD: 1.04, GBP: 0.85 });
	});

	it('rates.convert stores the conversion', async () => {
		stubFetch({
			body: {
				success: true,
				query: { from: 'USD', to: 'EUR', amount: 100 },
				info: { timestamp: 1700000000, rate: 0.92 },
				date: '2026-01-01',
				result: 92,
			},
		});
		const api = await createFixer();

		await api.rates.convert({
			from: 'USD',
			to: 'EUR',
			amount: 100,
			date: '2026-01-01',
		});

		const row = await fixerDb.conversions.findByEntityId(
			'USD:EUR:100:2026-01-01',
		);
		expect(row?.data).toMatchObject({
			from: 'USD',
			to: 'EUR',
			amount: 100,
			rate: 0.92,
			result: 92,
			date: '2026-01-01',
		});
	});

	it('currencies.getAll stores one row per symbol', async () => {
		stubFetch({
			body: {
				success: true,
				symbols: { USD: 'United States Dollar', EUR: 'Euro' },
			},
		});
		const api = await createFixer();

		await api.currencies.getAll({});

		const usd = await fixerDb.currencies.findByEntityId('USD');
		const eur = await fixerDb.currencies.findByEntityId('EUR');
		expect(usd?.data).toMatchObject({
			code: 'USD',
			name: 'United States Dollar',
		});
		expect(eur?.data).toMatchObject({ code: 'EUR', name: 'Euro' });
	});
});

describe('Fixer errors', () => {
	it('turns an HTTP 200 error envelope into FixerAPIError without retrying', async () => {
		stubFetch({
			body: {
				success: false,
				error: {
					code: 101,
					type: 'invalid_access_key',
					info: 'You have not supplied a valid API Access Key.',
				},
			},
		});
		const api = await createFixer();

		const error = await api.currencies.getAll({}).catch((e: Error) => e);

		expect(error).toBeInstanceOf(FixerAPIError);
		expect(error).toMatchObject({
			code: 101,
			type: 'invalid_access_key',
			message: 'You have not supplied a valid API Access Key.',
		});
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('does not retry when the monthly quota is used up', async () => {
		stubFetch({
			body: {
				success: false,
				error: { code: 104, type: 'usage_limit_reached' },
			},
		});
		const api = await createFixer();

		await expect(api.rates.latest({})).rejects.toMatchObject({ code: 104 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('does not retry an HTTP 401', async () => {
		stubFetch({ status: 401, body: { message: 'Unauthorized' } });
		const api = await createFixer();

		const error = await api.rates.latest({}).catch((e: Error) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 401 });
		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	it('retries an HTTP 429 after the Retry-After delay', async () => {
		const body = { success: true, symbols: { EUR: 'Euro' } };
		stubFetch(
			{
				status: 429,
				body: { message: 'Too Many Requests' },
				headers: { 'Retry-After': '1' },
			},
			{ body },
		);
		const api = await createFixer();

		const started = Date.now();
		const result = await api.currencies.getAll({});

		expect(result).toEqual(body);
		expect(fetchSpy).toHaveBeenCalledTimes(2);
		expect(Date.now() - started).toBeGreaterThanOrEqual(1000);
	});
});
