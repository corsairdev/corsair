import {
	describeMoreTreesError,
	MORETREES_HOSTS,
	MoreTreesAPIError,
	makeMoreTreesRequest,
} from './client';
import { account, badRequest } from './test-fixtures';

const callContext = (
	overrides: Partial<Parameters<typeof makeMoreTreesRequest>[0]> = {},
) => ({
	key: 'mt-key-123',
	options: { accountCode: 'AC1C2C' },
	keys: { get_account_code: jest.fn().mockResolvedValue('AC1C2C') },
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

describe('MORETREES_HOSTS', () => {
	it('builds each service host', () => {
		expect(MORETREES_HOSTS.user_management).toBe(
			'https://user-management-service.platform.moretrees.eco/user-management-api/external',
		);
		expect(MORETREES_HOSTS.project_management).toBe(
			'https://project-management-service.platform.moretrees.eco/project-management-api/external',
		);
		expect(MORETREES_HOSTS.transaction_management).toBe(
			'https://transaction-management-service.platform.moretrees.eco/transaction-management-api/external',
		);
	});
});

describe('makeMoreTreesRequest', () => {
	it('sends the X-API-KEY header on the right host', async () => {
		respond(account);

		await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/accounts/AC1C2C',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://user-management-service.platform.moretrees.eco/user-management-api/external/accounts/AC1C2C',
		);
		expect(new Headers(init.headers).get('x-api-key')).toBe('mt-key-123');
	});

	it('wraps a 400 with the JSON envelope', async () => {
		respond(badRequest, 400);

		const error = await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/accounts/AC1C2C',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoreTreesAPIError);
		expect(error).toMatchObject({
			status: 400,
			moreTreesError: 'Bad Request',
			message2: 'Bad Request',
			path: '/external/accounts/TEST',
		});
		expect((error as MoreTreesAPIError).message).toContain('Bad Request');
	});

	it('never prints the key in the error message or JSON', async () => {
		respond(badRequest, 401);

		const error = await makeMoreTreesRequest(
			callContext({ key: 'mt-secret-key' }),
			{
				service: 'user_management',
				method: 'GET',
				path: '/accounts/AC1C2C',
			},
		).catch((caught: unknown) => caught);

		const printed = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(printed).not.toContain('mt-secret-key');
	});

	it('wraps a transport failure with the replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/accounts/AC1C2C',
			replayable: true,
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(MoreTreesAPIError);
		expect(error).toMatchObject({ replayable: true, status: undefined });
	});
});

describe('describeMoreTreesError', () => {
	it('prefers the message field over the error field', () => {
		expect(describeMoreTreesError(400, badRequest, 'fallback')).toBe(
			'More Trees 400: Bad Request',
		);
	});

	it('falls back when nothing is readable', () => {
		expect(describeMoreTreesError(500, { unexpected: true }, 'boom')).toBe(
			'More Trees 500: boom',
		);
	});
});
