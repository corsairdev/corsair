import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { CurrencyScoopContext } from './context';
import {
	convertQuote,
	historicalQuotes,
	latestQuotes,
	listCurrencies,
	timeseriesQuotes,
} from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: CurrencyScoopContext['db'],
): CurrencyScoopContext {
	return { key, db } as unknown as CurrencyScoopContext;
}

describe('currencyscoop reads', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores currencies and sends the key as a query param', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			response: [
				{ short_code: 'usd', name: 'US Dollar', symbol: '$', precision: 2 },
				{ name: 'Missing code' },
			],
		});
		const result = await listCurrencies(
			context('sekrit', {
				currencies: { upsertByEntityId: upsert },
			} as unknown as CurrencyScoopContext['db']),
			{},
		);
		expect(result.currencies).toEqual([
			{ id: 'USD', name: 'US Dollar', symbol: '$' },
		]);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('precision');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://api.currencybeacon.com/v1');
		expect(config?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/currencies',
			query: { api_key: 'sekrit' },
		});
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('sekrit');
	});

	it('stores one quote per rate', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			response: {
				date: '2024-01-01',
				base: 'USD',
				rates: { EUR: 0.9, nope: 'x' },
			},
		});
		const result = await latestQuotes(
			context('sekrit', {
				quotes: { upsertByEntityId: upsert },
			} as unknown as CurrencyScoopContext['db']),
			{ base: 'usd', symbols: 'EUR' },
		);
		expect(result.quotes).toEqual([
			{
				id: '2024-01-01:USD:EUR',
				date: '2024-01-01',
				base: 'USD',
				code: 'EUR',
				rate: 0.9,
			},
		]);
		expect(upsert).toHaveBeenCalledWith('2024-01-01:USD:EUR', result.quotes[0]);
	});

	it('returns a conversion and does not store it', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({
			response: {
				from: 'USD',
				to: 'EUR',
				amount: 2,
				value: 1.8,
				date: '2024-01-01',
			},
		});
		const result = await convertQuote(
			context('sekrit', {
				quotes: { upsertByEntityId: upsert },
			} as unknown as CurrencyScoopContext['db']),
			{ from: 'USD', to: 'EUR', amount: 2 },
		);
		expect(result.value).toBe(1.8);
		expect(upsert).not.toHaveBeenCalled();
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
	});

	it('stores a timeseries quote per day', async () => {
		mockRequest.mockResolvedValue({
			response: {
				base: 'USD',
				rates: { '2024-01-01': { EUR: 0.91 }, 'bad-date': { EUR: 1 } },
			},
		});
		const result = await timeseriesQuotes(context('sekrit'), {
			start_date: '2024-01-01',
			end_date: '2024-01-02',
			base: 'USD',
		});
		expect(result.quotes.map((row) => row.id)).toEqual(['2024-01-01:USD:EUR']);
	});

	it('reads historical rates for one date and stores them', async () => {
		// Trimmed from a live GET /v1/historical on 11-17.
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			meta: { code: 200 },
			response: { date: '2024-01-02', base: 'USD', rates: { EUR: 0.91239926 } },
		});
		const result = await historicalQuotes(
			context('sekrit', {
				quotes: { upsertByEntityId: upsert },
			} as unknown as CurrencyScoopContext['db']),
			{ date: '2024-01-02', base: 'usd', symbols: 'EUR' },
		);
		expect(result.quotes).toEqual([
			{
				id: '2024-01-02:USD:EUR',
				date: '2024-01-02',
				base: 'USD',
				code: 'EUR',
				rate: 0.91239926,
			},
		]);
		expect(upsert).toHaveBeenCalledWith('2024-01-02:USD:EUR', result.quotes[0]);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/historical',
			query: {
				date: '2024-01-02',
				base: 'USD',
				symbols: 'EUR',
				api_key: 'sekrit',
			},
		});
	});

	it('rejects a historical read with no date before calling the API', async () => {
		await expect(
			historicalQuotes(context('sekrit'), {} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads the live timeseries shape (dates directly under response)', async () => {
		// Trimmed from a live GET /v1/timeseries on 11-17: no base and no rates wrapper.
		mockRequest.mockResolvedValue({
			meta: { code: 200 },
			response: {
				'2024-01-01': { EUR: 0.90753227 },
				'2024-01-02': { EUR: 0.91239926 },
			},
			'2024-01-01': { EUR: 0.90753227 },
			'2024-01-02': { EUR: 0.91239926 },
		});
		const result = await timeseriesQuotes(context('sekrit'), {
			start_date: '2024-01-01',
			end_date: '2024-01-02',
			base: 'usd',
			symbols: 'EUR',
		});
		expect(result.quotes).toEqual([
			{
				id: '2024-01-01:USD:EUR',
				date: '2024-01-01',
				base: 'USD',
				code: 'EUR',
				rate: 0.90753227,
			},
			{
				id: '2024-01-02:USD:EUR',
				date: '2024-01-02',
				base: 'USD',
				code: 'EUR',
				rate: 0.91239926,
			},
		]);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/timeseries',
			query: {
				base: 'USD',
				symbols: 'EUR',
				start_date: '2024-01-01',
				end_date: '2024-01-02',
			},
		});
	});

	it('defaults the timeseries base to USD when neither side names one', async () => {
		mockRequest.mockResolvedValue({
			response: { '2024-01-01': { EUR: 0.9 } },
		});
		const result = await timeseriesQuotes(context('sekrit'), {
			start_date: '2024-01-01',
			end_date: '2024-01-01',
		});
		expect(result.quotes.map((row) => row.id)).toEqual(['2024-01-01:USD:EUR']);
	});

	it('rejects a bad date before calling the API', async () => {
		await expect(
			timeseriesQuotes(context('sekrit'), {
				start_date: 'yesterday',
				end_date: '2024-01-02',
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws when the key is missing', async () => {
		await expect(listCurrencies(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/latest' },
			{
				url: 'https://api.currencybeacon.com/v1/latest',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { meta: { error_type: 'auth failed' } },
			},
			'auth failed',
		);
		mockRequest.mockRejectedValue(error);
		await expect(latestQuotes(context('sekrit'), {})).rejects.toBe(error);
	});

	it('returns quotes when the database write fails', async () => {
		mockRequest.mockResolvedValue({
			response: { date: '2024-01-01', base: 'USD', rates: { EUR: 0.9 } },
		});
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await latestQuotes(
			context('sekrit', {
				quotes: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db')),
				},
			} as unknown as CurrencyScoopContext['db']),
			{},
		);
		expect(result.quotes).toHaveLength(1);
		expect(warn).toHaveBeenCalledWith('Failed to save CurrencyScoop quote');
		warn.mockRestore();
	});
});
