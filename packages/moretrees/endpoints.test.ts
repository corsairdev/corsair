import { logEventFromContext } from 'corsair/core';
import { Account, Forest, Projects, Trees } from './endpoints';
import {
	account,
	forest,
	plantOthersResponse,
	plantSelfResponse,
	projects,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'mt-key-123';

const ctx = {
	key: API_KEY,
	options: {},
	keys: { get_account_code: jest.fn().mockResolvedValue('AC1C2C') },
};

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('account.get', () => {
	it('GETs the account with the API key header and host', async () => {
		respond(account);

		const result = await invoke(Account.getAccount, { accountCode: 'AC1C2C' });

		const sent = lastRequest();
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
			{ accountCode: 'AC1C2C' },
			'completed',
		);
	});
});

describe('forest.get', () => {
	it('GETs the forest by slug or account code', async () => {
		respond(forest);

		const result = await invoke(Forest.get, {
			forestSlugOrAccountCode: 'AC1C2C',
		});

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/user-management-api/external/forest/AC1C2C',
		});
		expect(result).toEqual(forest);
	});
});

describe('projects.list', () => {
	it('GETs the project list from the project service', async () => {
		respond(projects);

		const result = await invoke(Projects.list, {});

		expect(lastRequest()).toMatchObject({
			origin: 'https://project-management-service.platform.moretrees.eco',
			method: 'GET',
			path: '/project-management-api/external/projects',
		});
		expect(result).toEqual(projects);
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

		const sent = lastRequest();
		expect(sent).toMatchObject({
			origin: 'https://transaction-management-service.platform.moretrees.eco',
			method: 'POST',
			path: '/transaction-management-api/external/plant',
		});
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.body).toEqual({
			payment_account_code: 'AC1C2C',
			test: false,
			plant_for_others: false,
			quantity: 2,
			project_id: 1,
			tree_id: 1,
			recipients: undefined,
		});
		expect(result).toEqual(plantSelfResponse);
	});

	it('POSTs plant-for-others with recipients', async () => {
		respond(plantOthersResponse, 201);

		const result = await invoke(Trees.plant, {
			payment_account_code: 'AC1C2C',
			test: true,
			plant_for_others: true,
			recipients: [{ email: 'jane@example.com', name: 'Frank', quantity: 1 }],
		});

		expect(lastRequest().body).toEqual({
			payment_account_code: 'AC1C2C',
			test: true,
			plant_for_others: true,
			quantity: undefined,
			project_id: undefined,
			tree_id: undefined,
			recipients: [
				{
					account_code: undefined,
					email: 'jane@example.com',
					name: 'Frank',
					quantity: 1,
				},
			],
		});
		expect(result).toEqual(plantOthersResponse);
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

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		// Zod object schemas drop keys the input schema does not declare, so
		// a self plant silently ignores recipients.
		expect(sent.body).not.toHaveProperty('recipients');
		expect(sent.body).toMatchObject({ plant_for_others: false, quantity: 1 });
	});
});
