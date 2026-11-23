import {
	describeMoneybirdError,
	MoneybirdAPIError,
	makeMoneybirdRequest,
	resolveAdministrationId,
} from './client';
import { unauthorized } from './test-fixtures';

const callContext = (
	overrides: Partial<Parameters<typeof makeMoneybirdRequest>[0]> = {},
) => ({
	key: 'mb-token-123',
	options: { administrationId: '107693607045039116' },
	keys: { get_administration_id: jest.fn().mockResolvedValue(null) },
	...overrides,
});

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('resolveAdministrationId', () => {
	it('prefers the inline option over the stored field', async () => {
		const ctx = callContext({
			options: { administrationId: '111' },
			keys: { get_administration_id: jest.fn().mockResolvedValue('222') },
		});
		await expect(resolveAdministrationId(ctx)).resolves.toBe('111');
		expect(ctx.keys.get_administration_id).not.toHaveBeenCalled();
	});

	it('reads the stored account field', async () => {
		const ctx = callContext({
			options: {},
			keys: { get_administration_id: jest.fn().mockResolvedValue('222') },
		});
		await expect(resolveAdministrationId(ctx)).resolves.toBe('222');
	});

	it.each([null, undefined, '', 'not-digits'])(
		'throws when the administration id is %p',
		async (stored) => {
			const ctx = callContext({
				options: {},
				keys: { get_administration_id: jest.fn().mockResolvedValue(stored) },
			});
			await expect(resolveAdministrationId(ctx)).rejects.toThrow(
				'administration_id is required',
			);
		},
	);
});

describe('makeMoneybirdRequest', () => {
	it('prefixes the administration id and sends the Bearer token', async () => {
		respond([{}]);

		await makeMoneybirdRequest(callContext(), {
			method: 'GET',
			path: '/contacts.json',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://moneybird.com/api/v2/107693607045039116/contacts.json',
		);
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Bearer mb-token-123',
		);
	});

	it('omits the administration prefix for global resources', async () => {
		respond([{}]);

		await makeMoneybirdRequest(callContext(), {
			global: true,
			method: 'GET',
			path: '/administrations.json',
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://moneybird.com/api/v2/administrations.json');
	});

	it('wraps a 401 with the error field', async () => {
		respond(unauthorized, 401);

		const error = await makeMoneybirdRequest(callContext(), {
			method: 'GET',
			path: '/contacts.json',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoneybirdAPIError);
		expect(error).toMatchObject({
			status: 401,
			code: 'access token invalid',
			replayable: true,
		});
		expect((error as MoneybirdAPIError).message).toContain(
			'access token invalid',
		);
	});

	it('never prints the token in the error message or JSON', async () => {
		respond(unauthorized, 401);

		const error = await makeMoneybirdRequest(
			callContext({ key: 'super-secret' }),
			{ method: 'GET', path: '/contacts.json' },
		).catch((caught: unknown) => caught);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('super-secret');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeMoneybirdRequest(callContext(), {
			method: 'GET',
			path: '/contacts.json',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoneybirdAPIError);
		expect(error).toMatchObject({ replayable: true, status: undefined });
	});
});

describe('describeMoneybirdError', () => {
	it('uses the error field', () => {
		expect(describeMoneybirdError(401, unauthorized, 'fallback')).toBe(
			'Moneybird 401: access token invalid',
		);
	});

	it('falls back when nothing is readable', () => {
		expect(describeMoneybirdError(500, { unexpected: true }, 'boom')).toBe(
			'Moneybird 500: boom',
		);
	});
});
