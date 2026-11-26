import { logEventFromContext } from 'corsair/core';
import { Account, Forest, Projects, Trees } from './endpoints';
import { MoreTreesEndpointOutputSchemas as Outputs } from './endpoints/types';
import {
	account,
	BIG_TREE_ID,
	forest,
	insufficientCreditsBody,
	plantOthersResponse,
	plantSelfResponse,
	projectsBody,
	totalCo2,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'mt-key-123';
const getAccountCode = jest.fn().mockResolvedValue('AC1C2C');

const ctx = {
	key: API_KEY,
	options: {},
	keys: { get_account_code: getAccountCode },
};

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown, context: object = ctx) {
	// The fake context only carries what the endpoints read.
	return endpoint(context as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or raw JSON text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

async function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const raw = init.body ? await new Response(init.body).text() : undefined;
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		search: parsed.searchParams,
		method: init.method,
		headers: new Headers(init.headers),
		raw,
		// unknown: the request body is whatever the endpoint serialized.
		body: raw ? (JSON.parse(raw) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
	getAccountCode.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('GETs the account with the API key header and host', async () => {
		respond(account);

		const result = await invoke(Account.getAccount, { accountCode: 'AC1C2C' });

		const sent = await lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://user-management-service.platform.moretrees.eco',
			method: 'GET',
			path: '/user-management-api/external/accounts/AC1C2C',
		});
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(result).toEqual(account);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'moretrees.account.get',
			{},
			'completed',
		);
	});

	it('falls back to the stored account code', async () => {
		respond(account);

		await invoke(Account.getAccount, {});

		expect(getAccountCode).toHaveBeenCalled();
		expect((await lastRequest()).path).toBe(
			'/user-management-api/external/accounts/AC1C2C',
		);
	});

	it('prefers the accountCode plugin option over the stored field', async () => {
		respond(account);

		await invoke(
			Account.getAccount,
			{},
			{ ...ctx, options: { accountCode: 'OPT123' } },
		);

		expect(getAccountCode).not.toHaveBeenCalled();
		expect((await lastRequest()).path).toBe(
			'/user-management-api/external/accounts/OPT123',
		);
	});

	it('says how to set the account code when none is available', async () => {
		await expect(
			invoke(
				Account.getAccount,
				{},
				{
					...ctx,
					keys: { get_account_code: jest.fn().mockResolvedValue(null) },
				},
			),
		).rejects.toThrow('account code is required');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('encodes the account code as one path segment', async () => {
		respond(account);

		await invoke(Account.getAccount, { accountCode: '../a b' });

		expect((await lastRequest()).path).toBe(
			'/user-management-api/external/accounts/..%2Fa%20b',
		);
	});
});

describe('forest.get', () => {
	it('GETs the forest by slug or account code', async () => {
		respond(forest);

		const result = await invoke(Forest.get, {
			forestSlugOrAccountCode: 'beachy',
		});

		expect(await lastRequest()).toMatchObject({
			method: 'GET',
			path: '/user-management-api/external/forest/beachy',
		});
		expect(result).toEqual(forest);
	});

	it('falls back to the stored account code', async () => {
		respond(forest);

		await invoke(Forest.get, {});

		expect((await lastRequest()).path).toBe(
			'/user-management-api/external/forest/AC1C2C',
		);
	});
});

describe('projects.list', () => {
	it('GETs the projects and reads the data envelope', async () => {
		respond(projectsBody);

		const result = (await invoke(Projects.list, {})) as {
			data: { id: string; trees: { id: string; tonnes_co2: number }[] }[];
			total: number;
		};

		expect(await lastRequest()).toMatchObject({
			origin: 'https://project-management-service.platform.moretrees.eco',
			method: 'GET',
			path: '/project-management-api/external/projects',
		});
		expect(result.total).toBe(2);
		expect(result.data.map((p) => p.id)).toEqual(['24', '20']);
		expect(result.data[0]?.trees[0]?.tonnes_co2).toBe(0.3);
	});

	it('keeps every digit of a 64-bit tree ID', async () => {
		respond(projectsBody);

		const result = (await invoke(Projects.list, {})) as {
			data: { trees: { id: string }[] }[];
		};

		// JSON.parse would have returned 1212386588741402600.
		expect(result.data[0]?.trees[0]?.id).toBe(BIG_TREE_ID);
	});

	it('rejects the bare array the guide shows, which the API does not send', () => {
		expect(Outputs.projectsList.safeParse([]).success).toBe(false);
	});
});

describe('projects.calculateCo2', () => {
	it('POSTs the tree counts to /external/projects/total-co2', async () => {
		respond(totalCo2);

		const body = {
			totalTreesByProjectTree: {
				'1212386588741402700': {
					receivedAndPlantedTrees: 2,
					giftedAndPlantedTrees: 1,
				},
			},
		};
		const result = await invoke(Projects.calculateCo2, body);

		const sent = await lastRequest();
		expect(sent).toMatchObject({
			method: 'POST',
			path: '/project-management-api/external/projects/total-co2',
			body,
		});
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(totalCo2);
	});

	it('refuses a key that is not a project tree ID', async () => {
		await expect(
			invoke(Projects.calculateCo2, {
				totalTreesByProjectTree: { abc: { receivedAndPlantedTrees: 1 } },
			}),
		).rejects.toThrow('project tree IDs');
	});
});

describe('trees.plant', () => {
	it('POSTs plant-for-self with credits result', async () => {
		respond(plantSelfResponse, 201);

		const result = await invoke(Trees.plant, {
			payment_account_code: 'AC1C2C',
			test: false,
			plant_for_others: false,
			quantity: 2,
			project_id: 1,
			tree_id: 1,
		});

		const sent = await lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://transaction-management-service.platform.moretrees.eco',
			method: 'POST',
			path: '/transaction-management-api/external/plant',
		});
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({
			payment_account_code: 'AC1C2C',
			test: false,
			plant_for_others: false,
			quantity: 2,
			project_id: 1,
			tree_id: 1,
		});
		expect(result).toEqual({
			...plantSelfResponse,
			project_id: '1',
			tree_id: '1',
		});
	});

	it('sends a 64-bit tree ID as an exact JSON number', async () => {
		respond(plantSelfResponse, 201);

		await invoke(Trees.plant, {
			test: true,
			plant_for_others: false,
			quantity: 1,
			project_id: '24',
			tree_id: BIG_TREE_ID,
		});

		const { raw } = await lastRequest();
		expect(raw).toContain(`"project_id":24`);
		expect(raw).toContain(`"tree_id":${BIG_TREE_ID}`);
	});

	it('rejects a leading-zero ID before anything is sent', async () => {
		await expect(
			invoke(Trees.plant, {
				test: true,
				plant_for_others: false,
				quantity: 1,
				project_id: '00024',
			}),
		).rejects.toThrow('leading zero');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('takes the payment account from the stored account code', async () => {
		respond(plantSelfResponse, 201);

		await invoke(Trees.plant, {
			test: true,
			plant_for_others: false,
			quantity: 1,
		});

		expect((await lastRequest()).body).toMatchObject({
			payment_account_code: 'AC1C2C',
		});
	});

	it('POSTs plant-for-others with recipients', async () => {
		respond(plantOthersResponse, 201);

		await invoke(Trees.plant, {
			payment_account_code: 'AC1C2C',
			test: true,
			plant_for_others: true,
			recipients: [{ email: 'jane@example.com', name: 'Frank', quantity: 1 }],
		});

		expect((await lastRequest()).body).toEqual({
			payment_account_code: 'AC1C2C',
			test: true,
			plant_for_others: true,
			recipients: [{ email: 'jane@example.com', name: 'Frank', quantity: 1 }],
		});
	});

	it('surfaces the balance check a test-mode plant still runs', async () => {
		respond(insufficientCreditsBody, 400);

		const error = await invoke(Trees.plant, {
			test: true,
			plant_for_others: false,
			quantity: 1,
		}).catch((e: unknown) => e);

		expect(error).toMatchObject({ status: 400 });
		expect(String((error as Error).message)).toContain(
			'More Trees 400: Insufficient credits.',
		);
		expect(String((error as Error).message)).toContain('(MTT-6006)');
		// A planting is never replayed.
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('logs the requested test mode when the response leaves it out', async () => {
		respond({ credits_used: 1 }, 201);

		await invoke(Trees.plant, {
			test: true,
			plant_for_others: false,
			quantity: 1,
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'moretrees.trees.plant',
			{ creditsUsed: 1, test: true },
			'completed',
		);
	});

	it('rejects a recipient without account_code and email', async () => {
		await expect(
			invoke(Trees.plant, {
				payment_account_code: 'AC1C2C',
				plant_for_others: true,
				recipients: [{ name: 'Frank', quantity: 1 }],
			}),
		).rejects.toThrow('account_code or an email');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a quantity of 0 for plant-for-self', async () => {
		await expect(
			invoke(Trees.plant, {
				payment_account_code: 'AC1C2C',
				plant_for_others: false,
				quantity: 0,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('strips recipients from a plant-for-self request', async () => {
		respond(plantSelfResponse, 201);

		await invoke(Trees.plant, {
			payment_account_code: 'AC1C2C',
			plant_for_others: false,
			quantity: 1,
			recipients: [{ email: 'a@example.com', name: 'A', quantity: 1 }],
		});

		const sent = await lastRequest();
		expect(sent.body).not.toHaveProperty('recipients');
		expect(sent.body).toMatchObject({ plant_for_others: false, quantity: 1 });
	});
});
