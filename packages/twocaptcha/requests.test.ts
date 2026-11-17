import { ApiError } from 'corsair/http';
import { TwoCaptchaAPIError } from './client';
import { AccountEndpoints, TasksEndpoints } from './endpoints';
import {
	balance,
	keyDoesNotExist,
	reported,
	taskCreated,
	taskProcessing,
	taskReady,
	unsolvable,
	zeroBalance,
} from './test-fixtures';
import { API_KEY, captureError, invoke } from './test-helpers';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function sent(index = 0) {
	const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	const headers = new Headers(init.headers);
	return {
		url: String(url),
		method: init.method,
		contentType: headers.get('Content-Type'),
		// unknown: the JSON body each method sends.
		body: JSON.parse(String(init.body)) as Record<string, unknown>,
	};
}

beforeEach(() => {
	// A call no test queued a response for throws, so nothing reaches the API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('tasks.create', () => {
	it('POSTs JSON to api.2captcha.com/createTask with a nested task', async () => {
		respond(taskCreated);
		const result = await invoke(TasksEndpoints.create, {
			type: 'RecaptchaV2TaskProxyless',
			task: {
				websiteURL: 'https://2captcha.com/demo/recaptcha-v2',
				websiteKey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
				isInvisible: false,
			},
			soft_id: 123,
			language_pool: 'en',
		});
		const request = sent();
		expect(request.url).toBe('https://api.2captcha.com/createTask');
		expect(request.method).toBe('POST');
		expect(request.contentType).toContain('application/json');
		expect(request.body).toEqual({
			clientKey: API_KEY,
			task: {
				type: 'RecaptchaV2TaskProxyless',
				websiteURL: 'https://2captcha.com/demo/recaptcha-v2',
				websiteKey: '6LfD3PIbAAAAAJs_eEHvoOl75_83eXSqpPSRFJ_u',
				isInvisible: false,
			},
			languagePool: 'en',
			softId: 123,
		});
		expect(result).toMatchObject({ errorId: 0, taskId: 72345678901 });
	});

	it('passes kind-specific fields through, such as GeeTest gt and challenge', async () => {
		respond(taskCreated);
		await invoke(TasksEndpoints.create, {
			type: 'GeeTestTaskProxyless',
			task: {
				websiteURL: 'https://example.com',
				gt: '81388ea1fc187e0c335c0a8907ff2625',
				challenge: '12345678abc90123d45678ef90123a456b',
				version: 3,
			},
		});
		expect(sent().body.task).toEqual({
			type: 'GeeTestTaskProxyless',
			websiteURL: 'https://example.com',
			gt: '81388ea1fc187e0c335c0a8907ff2625',
			challenge: '12345678abc90123d45678ef90123a456b',
			version: 3,
		});
	});

	it('sends a callback URL as callbackUrl', async () => {
		respond(taskCreated);
		await invoke(TasksEndpoints.create, {
			type: 'ImageToTextTask',
			task: { body: 'R0lGODlhAQABAAAAACw=' },
			callback: 'https://example.com/hook',
		});
		expect(sent().body.callbackUrl).toBe('https://example.com/hook');
	});

	it('throws the zero-balance code instead of returning', async () => {
		respond(zeroBalance);
		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'TurnstileTaskProxyless',
				task: { websiteURL: 'https://example.com', websiteKey: '0x4AAA' },
			}),
		);
		expect(error).toBeInstanceOf(TwoCaptchaAPIError);
		expect(error).toMatchObject({
			code: 'ERROR_ZERO_BALANCE',
			errorId: 10,
			isInsufficientBalance: true,
		});
	});

	it('rejects a missing type before sending anything', async () => {
		const error = await captureError(
			invoke(TasksEndpoints.create, { task: { websiteURL: 'x' } }),
		);
		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('tasks.result', () => {
	it('POSTs the task id as an integer', async () => {
		respond(taskProcessing);
		await invoke(TasksEndpoints.result, { task_id: '72345678901' });
		const request = sent();
		expect(request.url).toBe('https://api.2captcha.com/getTaskResult');
		expect(request.method).toBe('POST');
		expect(request.body).toEqual({ clientKey: API_KEY, taskId: 72345678901 });
	});

	it('returns the processing state rather than throwing', async () => {
		respond(taskProcessing);
		await expect(
			invoke(TasksEndpoints.result, { task_id: 1 }),
		).resolves.toMatchObject({ status: 'processing' });
	});

	it('returns the solution and cost once ready', async () => {
		respond(taskReady);
		const result = await invoke(TasksEndpoints.result, { task_id: 1 });
		expect(result).toMatchObject({
			status: 'ready',
			solution: { token: '03ADUVZw...UWxTAe6ncIa' },
			cost: '0.00299',
		});
	});

	it('throws an unsolvable task with its code', async () => {
		respond(unsolvable);
		const error = await captureError(
			invoke(TasksEndpoints.result, { task_id: 1 }),
		);
		expect(error).toMatchObject({
			code: 'ERROR_CAPTCHA_UNSOLVABLE',
			isUnsolved: true,
		});
	});

	it('refuses a task id that is not a number', async () => {
		const error = await captureError(
			invoke(TasksEndpoints.result, { task_id: 'abc' }),
		);
		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account', () => {
	it('reads the balance with only the key in the body', async () => {
		respond(balance);
		const result = await invoke(AccountEndpoints.balance, {});
		expect(sent().url).toBe('https://api.2captcha.com/getBalance');
		expect(sent().body).toEqual({ clientKey: API_KEY });
		expect(result).toMatchObject({ errorId: 0, balance: 0.93958 });
	});

	it.each([
		['reportCorrect', AccountEndpoints.reportCorrect],
		['reportIncorrect', AccountEndpoints.reportIncorrect],
	] as const)('%s POSTs the task id', async (method, endpoint) => {
		respond(reported);
		const result = await invoke(endpoint, { task_id: '74455221488' });
		expect(sent().url).toBe(`https://api.2captcha.com/${method}`);
		expect(sent().body).toEqual({ clientKey: API_KEY, taskId: 74455221488 });
		expect(result).toMatchObject({ status: 'success' });
	});

	it('throws a wrong key as an auth error without the key in the message', async () => {
		respond(keyDoesNotExist);
		const error = await captureError(invoke(AccountEndpoints.balance, {}));
		expect(error).toMatchObject({
			code: 'ERROR_KEY_DOES_NOT_EXIST',
			isAuthError: true,
		});
		expect(String((error as Error).message)).not.toContain(API_KEY);
	});

	it('treats a body without errorId as a failure', async () => {
		respond({ hello: 'proxy page' });
		const error = await captureError(invoke(AccountEndpoints.balance, {}));
		expect(error).toBeInstanceOf(TwoCaptchaAPIError);
	});
});

describe('HTTP errors', () => {
	it('lets core ApiError through with the key and captcha fields dropped', async () => {
		respond({ message: 'maintenance' }, 503);
		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteURL: 'https://secret-site.example', websiteKey: 'k' },
			}),
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(503);
		const serialized = JSON.stringify({
			request: (error as ApiError).request,
			message: (error as Error).message,
		});
		expect(serialized).not.toContain(API_KEY);
		expect(serialized).not.toContain('secret-site');
	});
});
