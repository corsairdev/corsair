import { ApiError } from 'corsair/http';
import { makeJobNimbusRequest } from './client';
import { accountGetSettings } from './endpoints/account';
import { contactsList } from './endpoints/contacts';
import { errorHandlers } from './error-handlers';
import type { JobNimbusContext } from './index';

// `unknown` cast because the endpoints only read `key` and the event logger's optional fields here.
const ctx = { key: 'test-key' } as unknown as JobNimbusContext;

// `unknown` because each test passes a provider-shaped body.
function jsonResponse(value: unknown, status = 200): Response {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}

describe('JobNimbus regressions', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends sorting as sort_field and sort_direction', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({ count: 0, results: [] }));
		await contactsList(ctx, {
			size: 10,
			sort: 'date_updated',
			direction: 'asc',
		});
		const url = new URL(String(fetchMock.mock.calls[0]?.[0]));
		expect(url.searchParams.get('sort_field')).toBe('date_updated');
		expect(url.searchParams.get('sort_direction')).toBe('asc');
		expect(url.searchParams.has('sort')).toBe(false);
		expect(url.searchParams.has('direction')).toBe(false);
	});

	it('accepts the bare array account settings returns for a list field', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				jsonResponse([{ name: 'Sales', managers: [], members: ['u1'] }]),
			);
		const settings = await accountGetSettings(ctx, { field: 'groups' });
		expect(Array.isArray(settings)).toBe(true);
	});

	it('keeps customer data out of the thrown error', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(jsonResponse({ message: 'Invalid payload' }, 400));
		const failure = await makeJobNimbusRequest('/contacts', 'test-key', {
			method: 'POST',
			body: { first_name: 'Private', email: 'private@example.com' },
		}).catch((caught: unknown) => caught);
		if (!(failure instanceof ApiError)) throw new Error('Expected ApiError');
		expect(failure.status).toBe(400);
		expect(failure.request.body).toBeUndefined();
		expect(JSON.stringify(failure.request)).not.toContain(
			'private@example.com',
		);
	});

	it('only treats HTTP 429 as a rate limit for ApiError', () => {
		const gatewayTimeout = new ApiError(
			{ method: 'POST', url: '/jobs' },
			{
				url: 'https://app.jobnimbus.com/api1/jobs',
				ok: false,
				status: 504,
				statusText: 'Gateway Timeout',
				body: { message: 'rate limit service timed out' },
			},
			'rate limit service timed out',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(gatewayTimeout)).toBe(false);
		expect(errorHandlers.SERVER_ERROR.match(gatewayTimeout)).toBe(true);
	});
});
