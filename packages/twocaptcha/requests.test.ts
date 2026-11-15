import { AccountEndpoints, TasksEndpoints } from './endpoints';
import {
	badParameters,
	balance,
	reported,
	taskCreated,
	taskNotReady,
	taskSolved,
	unsolvable,
	wrongKeyFormat,
	zeroBalance,
} from './test-fixtures';
import { captureError, invoke } from './test-helpers';

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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const body = init.body instanceof FormData ? init.body : undefined;
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		form: body
			? Object.fromEntries(
					Array.from(body.entries()).map(([k, v]) => [k, String(v)]),
				)
			: undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('tasks', () => {
	it('tasks.create POSTs the flattened task body', async () => {
		respond(taskCreated);

		const result = (await invoke(TasksEndpoints.create, {
			type: 'RecaptchaV2TaskProxyless',
			task: {
				websiteURL: 'https://example.com/login',
				websiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
			},
		})) as { status: number; request?: string | number | null };

		const sent = lastRequest();
		expect(sent.origin).toBe('https://2captcha.com');
		expect(sent.path).toBe('/createTask');
		expect(sent.method).toBe('POST');
		expect(sent.form).toEqual({
			method: 'post',
			task: 'task',
			type: 'RecaptchaV2TaskProxyless',
			websiteURL: 'https://example.com/login',
			websiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
			key: 'a'.repeat(32),
		});
		expect(result.request).toBe('734920165');
	});

	it('tasks.create sends the captcha kind and the callback', async () => {
		respond(taskCreated);

		await invoke(TasksEndpoints.create, {
			type: 'TurnstileTaskProxyless',
			task: { websiteURL: 'https://x.test', websiteKey: '0x4AAA' },
			callback: 'https://hooks.acme.com/captcha',
			soft_id: 1234,
		});

		expect(lastRequest().form?.callback).toBe('https://hooks.acme.com/captcha');
		expect(lastRequest().form?.soft_id).toBe('1234');
		expect(lastRequest().form?.type).toBe('TurnstileTaskProxyless');
	});

	it('tasks.create JSON-encodes a nested value such as enterprisePayload', async () => {
		respond(taskCreated);

		await invoke(TasksEndpoints.create, {
			type: 'RecaptchaV2EnterpriseTaskProxyless',
			task: {
				websiteURL: 'https://x.test',
				websiteKey: '0x4AAA',
				enterprisePayload: { s: 'abc' },
			},
		});

		expect(lastRequest().form?.enterprisePayload).toBe('{"s":"abc"}');
	});

	it('tasks.create rejects a body with no websiteURL', async () => {
		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteKey: '0x4AAA' },
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tasks.create rejects a body with no site key', async () => {
		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteURL: 'https://x.test' },
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tasks.create rejects a captcha kind it does not know', async () => {
		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'NotARealCaptcha',
				task: { websiteURL: 'https://x.test', websiteKey: '0x4AAA' },
			}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('tasks.create throws when the provider refuses the task', async () => {
		respond(zeroBalance);

		const error = await captureError(
			invoke(TasksEndpoints.create, {
				type: 'RecaptchaV2TaskProxyless',
				task: { websiteURL: 'https://x.test', websiteKey: '0x4AAA' },
			}),
		);

		expect((error as Error).message).toContain('ERROR_ZERO_BALANCE');
		expect((error as { code?: string }).code).toBe('ERROR_ZERO_BALANCE');
	});

	it('tasks.result returns the not-ready state rather than throwing', async () => {
		respond(taskNotReady);

		const result = (await invoke(TasksEndpoints.result, {
			task_id: '734920165',
		})) as { status: number; request?: string | number | null };

		expect(lastRequest()).toMatchObject({
			path: '/getTaskResult',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({
			taskId: '734920165',
			key: 'a'.repeat(32),
			json: '1',
		});
		// A caller polls again; this is not an error.
		expect(result.status).toBe(0);
		expect(result.request).toBe('CAPCHA_NOT_READY');
	});

	it('tasks.result returns the token once solved', async () => {
		respond(taskSolved);

		const result = (await invoke(TasksEndpoints.result, {
			task_id: '734920165',
		})) as { status: number; request?: string | number | null };

		expect(result.status).toBe(1);
		expect(result.request).toBe('03AGdBq26_abcdefghijklmnop');
	});

	it('tasks.result throws a real failure such as an unsolvable captcha', async () => {
		respond(unsolvable);

		const error = await captureError(
			invoke(TasksEndpoints.result, { task_id: '734920165' }),
		);

		expect((error as Error).message).toContain('ERROR_CAPTCHA_UNSOLVABLE');
	});

	it('tasks.result throws a bad-parameter error', async () => {
		respond(badParameters);

		const error = await captureError(
			invoke(TasksEndpoints.result, { task_id: 'x' }),
		);

		expect((error as { code?: string }).code).toBe('ERROR_BAD_PARAMETERS');
	});

	it('tasks.result requires a task id', async () => {
		const error = await captureError(invoke(TasksEndpoints.result, {}));

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account', () => {
	it('account.balance GETs getBalance and reads the amount', async () => {
		respond(balance);

		const result = (await invoke(AccountEndpoints.balance, {})) as {
			status: number;
			request?: string | number | null;
		};

		expect(lastRequest()).toMatchObject({
			path: '/getBalance',
			method: 'GET',
		});
		expect(result.request).toBe(12.3456);
	});

	it('account.balance throws on a wrong key', async () => {
		respond(wrongKeyFormat);

		const error = await captureError(invoke(AccountEndpoints.balance, {}));

		expect((error as { code?: string }).code).toBe('ERROR_WRONG_USER_KEY');
	});

	it('account.reportCorrect GETs reportCorrect with the task id', async () => {
		respond(reported);

		await invoke(AccountEndpoints.reportCorrect, { task_id: '734920165' });

		expect(lastRequest()).toMatchObject({
			path: '/reportCorrect',
			method: 'GET',
		});
		expect(lastRequest().params.taskId).toBe('734920165');
	});

	it('account.reportIncorrect GETs reportIncorrect with the task id', async () => {
		respond(reported);

		await invoke(AccountEndpoints.reportIncorrect, { task_id: '734920165' });

		expect(lastRequest()).toMatchObject({
			path: '/reportIncorrect',
			method: 'GET',
		});
		expect(lastRequest().params.taskId).toBe('734920165');
	});

	it('a report requires a task id', async () => {
		const error = await captureError(
			invoke(AccountEndpoints.reportCorrect, {}),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
