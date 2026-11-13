import { ApiError } from 'corsair/http';
import { Messages, Sounds, Teams } from './endpoints';
import { errorHandlers } from './error-handlers';

const ctx = { key: 'secret-token' } as never;
const originalFetch = global.fetch;

afterEach(() => {
	global.fetch = originalFetch;
});

test('uses JSON and the provider token in the final write request', async () => {
	const fetchMock = jest.fn().mockResolvedValue(
		new Response(JSON.stringify({ status: 1, request: 'r' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
	global.fetch = fetchMock;
	await expect(
		Messages.send(ctx, {
			user: 'u',
			message: 'hello',
			attachment_base64: 'AA==',
			attachment_type: 'image/png',
		}),
	).resolves.toEqual({ status: 1, request: 'r' });
	const [url, options] = fetchMock.mock.calls[0];
	expect(url).toBe('https://api.pushover.net/1/messages.json');
	expect(options.method).toBe('POST');
	expect(options.headers.get('content-type')).toBe('application/json');
	expect(JSON.parse(options.body)).toEqual({
		token: 'secret-token',
		user: 'u',
		message: 'hello',
		attachment_base64: 'AA==',
		attachment_type: 'image/png',
	});
});

test('propagates a quota 429 with retry metadata without replaying the request', async () => {
	const fetchMock = jest.fn().mockResolvedValue(
		new Response(
			JSON.stringify({ status: 0, errors: ['quota exceeded'], request: 'r' }),
			{
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '45' },
			},
		),
	);
	global.fetch = fetchMock;
	// JavaScript may throw any value, so narrow it before inspection.
	let caught: unknown;
	try {
		await Messages.send(ctx, { user: 'u', message: 'hello' });
	} catch (error) {
		caught = error;
	}
	expect(caught).toBeInstanceOf(ApiError);
	if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
	expect(caught.status).toBe(429);
	expect(caught.retryAfter).toBe(45000);
	expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
	expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
		maxRetries: 0,
	});
	expect(fetchMock).toHaveBeenCalledTimes(1);
});

test('uses query token and redacts it from error URLs', async () => {
	global.fetch = jest
		.fn()
		.mockResolvedValue(
			new Response(
				JSON.stringify({ status: 0, errors: ['bad token'], request: 'r' }),
				{ status: 400, headers: { 'Content-Type': 'application/json' } },
			),
		);
	// JavaScript may throw any value, so narrow it before inspection.
	let caught: unknown;
	try {
		await Sounds.list(ctx, {});
	} catch (error) {
		caught = error;
	}
	expect(caught).toBeInstanceOf(ApiError);
	if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
	expect(caught.url).not.toContain('secret-token');
	expect(caught.request.query?.token).toBe('[REDACTED]');
});

test('redacts failed write bodies while preserving the provider error', async () => {
	const fetchMock = jest.fn().mockResolvedValue(
		new Response(
			JSON.stringify({
				status: 0,
				errors: ['invalid team request'],
				request: 'r',
			}),
			{ status: 400, headers: { 'Content-Type': 'application/json' } },
		),
	);
	global.fetch = fetchMock;
	// JavaScript may throw any value; narrow it to ApiError before inspecting it.
	let caught: unknown;
	try {
		await Teams.addUser(ctx, {
			email: 'user@example.test',
			password: 'private-password',
		});
	} catch (error) {
		caught = error;
	}
	expect(caught).toBeInstanceOf(ApiError);
	if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
	expect(caught.status).toBe(400);
	expect(caught.body).toEqual({
		status: 0,
		errors: ['invalid team request'],
		request: 'r',
	});
	expect(caught.request.body).toEqual('[REDACTED]');
	expect(JSON.stringify(caught)).not.toContain('secret-token');
	expect(JSON.stringify(caught)).not.toContain('private-password');
	expect(JSON.stringify(caught)).not.toContain('user@example.test');
	expect(fetchMock).toHaveBeenCalledTimes(1);
});
