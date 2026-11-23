import {
	describeMocoError,
	MocoAPIError,
	makeMocoRequest,
	mocoBase,
	resolveSubdomain,
} from './client';
import { unauthorized, validationErrors } from './test-fixtures';

const callContext = (
	overrides: Partial<Parameters<typeof makeMocoRequest>[0]> = {},
) => ({
	key: 'moco-key-123',
	options: { subdomain: 'beachy' },
	keys: { get_subdomain: jest.fn().mockResolvedValue(null) },
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

describe('mocoBase', () => {
	it('builds the per-account API host', () => {
		expect(mocoBase('beachy')).toBe('https://beachy.mocoapp.com/api/v1');
	});
});

describe('resolveSubdomain', () => {
	it('prefers the inline option over the stored field', async () => {
		const ctx = callContext({ options: { subdomain: 'inline' } });
		await expect(resolveSubdomain(ctx)).resolves.toBe('inline');
		expect(ctx.keys.get_subdomain).not.toHaveBeenCalled();
	});

	it('reads the stored account field', async () => {
		const ctx = callContext({
			options: {},
			keys: { get_subdomain: jest.fn().mockResolvedValue('stored') },
		});
		await expect(resolveSubdomain(ctx)).resolves.toBe('stored');
	});

	it.each([null, undefined, ''])(
		'throws when the subdomain is %p',
		async (stored) => {
			const ctx = callContext({
				options: {},
				keys: { get_subdomain: jest.fn().mockResolvedValue(stored) },
			});
			await expect(resolveSubdomain(ctx)).rejects.toThrow(
				'subdomain is required',
			);
		},
	);

	it('rejects a value that is not a DNS label', async () => {
		const ctx = callContext({ options: { subdomain: 'not a domain!' } });
		await expect(resolveSubdomain(ctx)).rejects.toThrow('DNS label');
	});
});

describe('makeMocoRequest', () => {
	it('sends the key as a Token header on the account host', async () => {
		respond({ ok: true });

		await makeMocoRequest(callContext(), {
			method: 'GET',
			path: '/session',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://beachy.mocoapp.com/api/v1/session');
		expect(new Headers(init.headers).get('authorization')).toBe(
			'Token token=moco-key-123',
		);
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
	});

	it('serializes a JSON body', async () => {
		respond({ id: 1 });

		await makeMocoRequest(callContext(), {
			method: 'POST',
			path: '/activities',
			body: { date: '2026-04-09', seconds: 1800 },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBe(
			JSON.stringify({ date: '2026-04-09', seconds: 1800 }),
		);
	});

	it('wraps a 401 with the message body', async () => {
		respond(unauthorized, 401);

		const error = await makeMocoRequest(callContext(), {
			method: 'GET',
			path: '/session',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MocoAPIError);
		expect(error).toMatchObject({ status: 401, replayable: true });
		expect((error as MocoAPIError).message).toContain(
			'Subdomain does not exist',
		);
	});

	it('carries 422 field errors on the error', async () => {
		respond(validationErrors, 422);

		const error = await makeMocoRequest(callContext(), {
			method: 'POST',
			path: '/companies',
			body: {},
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MocoAPIError);
		expect((error as MocoAPIError).errors).toEqual({
			name: ["can't be blank"],
		});
		expect((error as MocoAPIError).message).toContain("name: can't be blank");
	});

	it('never prints the key in the error message or JSON', async () => {
		respond(unauthorized, 401);

		const error = await makeMocoRequest(callContext({ key: 'super-secret' }), {
			method: 'GET',
			path: '/session',
		}).catch((caught: unknown) => caught);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('super-secret');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeMocoRequest(callContext(), {
			method: 'GET',
			path: '/users',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MocoAPIError);
		expect(error).toMatchObject({ replayable: true, status: undefined });
	});
});

describe('describeMocoError', () => {
	it('uses the message body', () => {
		expect(describeMocoError(401, unauthorized, 'fallback')).toBe(
			'Moco 401: Subdomain does not exist.',
		);
	});

	it('joins field errors', () => {
		expect(describeMocoError(422, validationErrors, 'fallback')).toBe(
			`Moco 422: name: can't be blank`,
		);
	});

	it('falls back when nothing is readable', () => {
		expect(describeMocoError(500, { unexpected: true }, 'boom')).toBe(
			'Moco 500: boom',
		);
	});
});
