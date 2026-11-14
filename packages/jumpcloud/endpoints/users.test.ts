import { JumpCloudAPIError } from '../client';
import type { JumpCloudContext } from '../index';
import {
	usersCreate,
	usersDelete,
	usersEnforceMfa,
	usersExpirePassword,
	usersGet,
	usersList,
	usersListSshKeys,
	usersResetMfa,
	usersSetPassword,
	usersSyncMfa,
	usersUnlock,
	usersUpdate,
} from './users';

jest.mock('corsair/core', () => {
	// unknown: core's export surface is intentionally opaque to plugin
	// tests; the record cast only preserves requireActual while stubbing
	// the event logger.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

// The shared HTTP boundary of this plugin is the client's fetch transport.
const fetchMock = jest.fn<
	Promise<Response>,
	Parameters<typeof globalThis.fetch>
>();

// unknown: fixtures intentionally cover every family's documented response
// shapes; the endpoint output schemas, not this helper, enforce the contract.
function jsonResponse(
	body: unknown,
	headers: Record<string, string> = {},
	status = 200,
): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json', ...headers },
	});
}

const mockCtx = { key: 'jc-test-key' } as never as JumpCloudContext;

beforeEach(() => {
	fetchMock.mockReset();
	globalThis.fetch = fetchMock as typeof globalThis.fetch;
});

describe('users family (mocked JumpCloud transport)', () => {
	it('users.list calls API v1 GET /systemusers with pagination query', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse(
					{ results: [{ _id: 'u1', username: 'alice' }], totalCount: 1 },
					{ 'x-total-count': '1' },
				),
			),
		);

		const result = await usersList(mockCtx, { limit: 25, skip: 50 });

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers?limit=25&skip=50',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(init?.headers).toMatchObject({ 'x-api-key': 'jc-test-key' });

		expect(result).toEqual({
			results: [{ _id: 'u1', username: 'alice' }],
			totalCount: 1,
		});
	});

	it('users.get encodes the path parameter safely', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ _id: 'u1', username: 'alice' })),
		);

		await usersGet(mockCtx, { id: 'u-1_abc' });

		const [url] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u-1_abc',
		);
	});

	it('users.setPassword models the empty 2xx body as void', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 200 })),
		);

		const result = await usersSetPassword(mockCtx, {
			id: 'u1',
			body: { password: 'S3cretValue!' },
		});

		const init = fetchMock.mock.calls[0]?.[1];
		expect(init).toMatchObject({ method: 'POST' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			password: 'S3cretValue!',
		});
		expect(result).toBeUndefined();
	});

	it('rejects unsafe path parameters before any request', async () => {
		await expect(usersGet(mockCtx, { id: '../admin' })).rejects.toThrow(
			/traversal/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('maps HTTP 429 with Retry-After onto the error', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				new Response('rate limited', {
					status: 429,
					headers: { 'retry-after': '3' },
				}),
			),
		);

		let caught: unknown;
		try {
			await usersList(mockCtx, {});
		} catch (error) {
			caught = error;
		}

		expect(caught).toBeInstanceOf(JumpCloudAPIError);
		const apiError = caught as JumpCloudAPIError;
		expect(apiError.status).toBe(429);
		expect(apiError.retryAfter).toBe(3000);
	});

	it('users.create posts the documented user body to API v1 /systemusers', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({
					_id: 'u9',
					username: 'bob',
					email: 'bob@example.com',
					firstname: 'Bob',
				}),
			),
		);

		const result = await usersCreate(mockCtx, {
			body: {
				username: 'bob',
				email: 'bob@example.com',
				firstname: 'Bob',
				state: 'ACTIVATED',
			},
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe('https://console.jumpcloud.com/api/systemusers');
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({
			'x-api-key': 'jc-test-key',
			'Content-Type': 'application/json',
		});
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			username: 'bob',
			email: 'bob@example.com',
			firstname: 'Bob',
			state: 'ACTIVATED',
		});
		expect(result).toEqual({
			_id: 'u9',
			username: 'bob',
			email: 'bob@example.com',
			firstname: 'Bob',
		});
	});

	it('users.update puts the partial user body to the interpolated path', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse({ _id: 'u1', username: 'alice', department: 'Platform' }),
			),
		);

		const result = await usersUpdate(mockCtx, {
			id: 'u1',
			body: { department: 'Platform' },
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1',
		);
		expect(init).toMatchObject({ method: 'PUT' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			department: 'Platform',
		});
		expect(result).toEqual({
			_id: 'u1',
			username: 'alice',
			department: 'Platform',
		});
	});

	it('users.delete issues DELETE with the cascade_manager query forwarded', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse({ _id: 'u1', username: 'alice' })),
		);

		const result = await usersDelete(mockCtx, {
			id: 'u1',
			cascade_manager: 'null',
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1?cascade_manager=null',
		);
		expect(init).toMatchObject({ method: 'DELETE' });
		expect(init?.body).toBeUndefined();
		expect(result).toEqual({ _id: 'u1', username: 'alice' });
	});

	it('users.unlock posts to the unlock path and parses the documented JSON string body', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse('User has been unlocked')),
		);

		const result = await usersUnlock(mockCtx, { id: 'u1' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/unlock',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.body).toBeUndefined();
		expect(result).toBe('User has been unlocked');
	});

	it('users.expirePassword posts to the expire path and parses the documented JSON string body', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse('Password expired')),
		);

		const result = await usersExpirePassword(mockCtx, { id: 'u1' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/expire',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(result).toBe('Password expired');
	});

	it('users.resetMfa posts the exclusion body to the resetmfa path and parses the JSON string body', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(jsonResponse('MFA reset')),
		);

		const result = await usersResetMfa(mockCtx, {
			id: 'u1',
			body: { exclusionDays: 30 },
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/resetmfa',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			exclusionDays: 30,
		});
		expect(result).toBe('MFA reset');
	});

	it('users.enforceMfa posts the mfa body to the enforce path and models the empty 2xx body as void', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 200 })),
		);

		const result = await usersEnforceMfa(mockCtx, {
			id: 'u1',
			body: { enable_user_portal_multifactor: true },
		});

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/mfa/enforce',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(JSON.parse(String(init?.body) ?? '{}')).toEqual({
			enable_user_portal_multifactor: true,
		});
		expect(result).toBeUndefined();
	});

	it('users.syncMfa posts bodyless to the mfasync path and models the empty 2xx body as void', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(new Response(null, { status: 200 })),
		);

		const result = await usersSyncMfa(mockCtx, { id: 'u1' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/mfasync',
		);
		expect(init).toMatchObject({ method: 'POST' });
		expect(init?.body).toBeUndefined();
		expect(init?.headers).not.toHaveProperty('Content-Type');
		expect(result).toBeUndefined();
	});

	it('users.listSshKeys calls API v1 GET on the sshkeys path and parses the key array', async () => {
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse([
					{
						_id: 'k1',
						name: 'laptop',
						public_key: 'ssh-ed25519 AAAA',
						create_date: '2026-01-01T00:00:00.000Z',
					},
				]),
			),
		);

		const result = await usersListSshKeys(mockCtx, { id: 'u1' });

		const [url, init] = fetchMock.mock.calls[0]!;
		expect(String(url)).toBe(
			'https://console.jumpcloud.com/api/systemusers/u1/sshkeys',
		);
		expect(init).toMatchObject({ method: 'GET' });
		expect(result).toEqual([
			{
				_id: 'k1',
				name: 'laptop',
				public_key: 'ssh-ed25519 AAAA',
				create_date: '2026-01-01T00:00:00.000Z',
			},
		]);
	});
});
