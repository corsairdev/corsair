import { ApiError } from 'corsair/http';
import {
	describeMoreTreesError,
	getRequestFacts,
	MORETREES_HOSTS,
	makeMoreTreesRequest,
	parseMoreTreesJson,
	quoteUnsafeIntegers,
	RawJsonNumber,
	serializeMoreTreesBody,
} from './client';
import { account, badRequest, notFound } from './test-fixtures';

const KEY = 'mt-key-123';

const callContext = () => ({
	key: KEY,
	options: { accountCode: 'AC1C2C' },
	keys: { get_account_code: jest.fn().mockResolvedValue('AC1C2C') },
});

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === '' ? '' : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

// The bound client and core both retry; these calls stop on the first 429.
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: (
			config: unknown,
			options: unknown,
			requestOptions: { rateLimitConfig?: object } = {},
		) =>
			actual.request(config, options, {
				...requestOptions,
				rateLimitConfig: {
					enabled: false,
					maxRetries: 0,
					initialRetryDelay: 0,
					backoffMultiplier: 1,
				},
			}),
	};
});

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

describe('lossless JSON', () => {
	it('quotes integers JSON.parse would round, outside strings only', () => {
		expect(
			quoteUnsafeIntegers(
				'{"id":1212386588741402633,"n":-9007199254740993,"ok":42,"f":1.5,"e":1e30,"s":"1212386588741402633 \\" 99999999999999999"}',
			),
		).toBe(
			'{"id":"1212386588741402633","n":"-9007199254740993","ok":42,"f":1.5,"e":1e30,"s":"1212386588741402633 \\" 99999999999999999"}',
		);
	});

	it('returns every ID field as a string and leaves other numbers alone', () => {
		expect(
			parseMoreTreesJson(
				'{"id":24,"project_id":1212386588741402633,"treeId":7,"quantity":3,"trees":[{"id":28}]}',
			),
		).toEqual({
			id: '24',
			project_id: '1212386588741402633',
			treeId: '7',
			quantity: 3,
			trees: [{ id: '28' }],
		});
	});

	it('reads an empty body as undefined', () => {
		expect(parseMoreTreesJson('')).toBeUndefined();
	});

	it('writes RawJsonNumber values as bare digits', () => {
		expect(
			serializeMoreTreesBody({
				tree_id: new RawJsonNumber('1212386588741402633'),
				name: 'a "quoted" name',
				skip: undefined,
			}),
		).toBe('{"tree_id":1212386588741402633,"name":"a \\"quoted\\" name"}');
	});
});

describe('makeMoreTreesRequest', () => {
	it('sends the X-API-KEY header on the right host', async () => {
		respond(account);

		const result = await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/accounts/AC1C2C',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${MORETREES_HOSTS.user_management}/accounts/AC1C2C`);
		expect(new Headers(init.headers).get('x-api-key')).toBe(KEY);
		expect(result).toEqual(account);
	});

	it('throws core ApiError with the provider message and status', async () => {
		respond(notFound, 404);

		const error = await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/forest/zz-not-a-forest',
			replayable: true,
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 404,
			body: notFound,
			message:
				'More Trees 404: The requested resource does not exist. (MTC-0004)',
		});
		expect(getRequestFacts(error as Error)).toEqual({
			method: 'GET',
			replayable: true,
		});
	});

	it('keeps Retry-After on a rebuilt 429', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"status":429}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			}),
		);

		const error = (await makeMoreTreesRequest(callContext(), {
			service: 'project_management',
			method: 'GET',
			path: '/projects',
			replayable: true,
		}).catch((e: unknown) => e)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(429);
		expect(error.isRateLimitError()).toBe(true);
	});

	it('drops the request body (gift recipients) from the error', async () => {
		respond(badRequest, 400);

		const error = (await makeMoreTreesRequest(callContext(), {
			service: 'transaction_management',
			method: 'POST',
			path: '/plant',
			body: {
				plant_for_others: true,
				recipients: [{ email: 'jane@example.com', name: 'Jane', quantity: 1 }],
			},
			replayable: false,
		}).catch((e: unknown) => e)) as ApiError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.request.body).toBeUndefined();
		expect(error.request.method).toBe('POST');
		const dump = JSON.stringify({ ...error, message: error.message });
		expect(dump).not.toContain('jane@example.com');
		expect(dump).not.toContain('Jane');
		expect(getRequestFacts(error)?.replayable).toBe(false);
	});

	it('never puts the key in the error', async () => {
		respond('', 401);

		const error = (await makeMoreTreesRequest(callContext(), {
			service: 'user_management',
			method: 'GET',
			path: '/accounts/AC1C2C',
			replayable: true,
		}).catch((e: unknown) => e)) as ApiError;

		expect(error.status).toBe(401);
		expect(error.message).toBe('More Trees 401: Unauthorized');
		expect(JSON.stringify({ ...error, message: error.message })).not.toContain(
			KEY,
		);
	});

	it('records the replay flag on a transport failure and rethrows it', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await makeMoreTreesRequest(callContext(), {
			service: 'project_management',
			method: 'GET',
			path: '/projects',
			replayable: true,
		}).catch((e: unknown) => e)) as Error;

		expect(error).toBeInstanceOf(TypeError);
		expect(getRequestFacts(error)).toEqual({ method: 'GET', replayable: true });
	});
});

describe('describeMoreTreesError', () => {
	it('joins message and code when they differ', () => {
		expect(describeMoreTreesError(404, notFound, 'x')).toBe(
			'More Trees 404: The requested resource does not exist. (MTC-0004)',
		);
	});

	it('uses one field when message and error match', () => {
		expect(describeMoreTreesError(400, badRequest, 'x')).toBe(
			'More Trees 400: Bad Request',
		);
	});

	it('falls back when nothing is readable', () => {
		expect(describeMoreTreesError(undefined, null, 'socket hang up')).toBe(
			'More Trees: socket hang up',
		);
	});
});
