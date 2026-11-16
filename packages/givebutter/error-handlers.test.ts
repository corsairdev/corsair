import { ApiError } from 'corsair/http';
import { Funds } from './endpoints';
import { errorHandlers } from './error-handlers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const ctx = { key: 'givebutter-test-key' };
let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

afterEach(() => fetchMock.mockRestore());

function reply(
	status: number,
	body: object,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

it('lets core ApiError through with its status', async () => {
	reply(401, { message: 'Unauthenticated.' });
	const error = await Funds.get(ctx as never, { fund: 1 }).catch((e) => e);
	expect(error).toBeInstanceOf(ApiError);
	expect(error.status).toBe(401);
	expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
});

it('retries a 429 in core before the operation fails', async () => {
	reply(429, { message: 'Too Many Attempts.' }, { 'Retry-After': '0' });
	reply(200, { id: 'fund_1', name: 'General', code: null });
	await expect(Funds.get(ctx as never, { fund: 1 })).resolves.toMatchObject({
		id: 'fund_1',
	});
	expect(fetchMock).toHaveBeenCalledTimes(2);
});

it('does not replay an operation again after core gave up on a 429', async () => {
	reply(429, { message: 'Too Many Attempts.' }, { 'Retry-After': '0' });
	reply(429, { message: 'Too Many Attempts.' }, { 'Retry-After': '0' });
	reply(429, { message: 'Too Many Attempts.' }, { 'Retry-After': '0' });
	reply(429, { message: 'Too Many Attempts.' }, { 'Retry-After': '0' });
	const error = await Funds.get(ctx as never, { fund: 1 }).catch((e) => e);
	expect(error).toBeInstanceOf(ApiError);
	expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
	await expect(errorHandlers.RATE_LIMIT_ERROR.handler()).resolves.toEqual({
		maxRetries: 0,
	});
});
