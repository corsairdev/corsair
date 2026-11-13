import { ApiError } from 'corsair/http';
import { Messages, Sounds } from './endpoints';
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
