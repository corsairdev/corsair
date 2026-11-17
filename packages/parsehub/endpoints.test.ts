import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	getLastReadyData,
	getProject,
	listProjects,
	runProject,
} from './endpoints/projects';
import { cancelRun, deleteRun, getRun, getRunData } from './endpoints/runs';
import type { ParsehubContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: { upsert?: jest.Mock; find?: jest.Mock },
): ParsehubContext {
	return {
		key,
		db: db
			? {
					projects: {
						upsertByEntityId: db.upsert ?? jest.fn(),
						findByEntityId: db.find ?? jest.fn().mockResolvedValue(null),
					},
				}
			: undefined,
	} as unknown as ParsehubContext;
}

function lastCall() {
	return {
		config: mockRequest.mock.calls.at(-1)?.[0],
		options: mockRequest.mock.calls.at(-1)?.[1],
	};
}

// From the ParseHub API reference.
const RUN = {
	project_token: 't-0WMEZ-Bc9sWGHAMsYvP7y4',
	run_token: 'tCcB4hfFP6wvBRe2gwZv9aJp',
	status: 'initialized',
	data_ready: false,
	start_time: '2015-02-03T23:09:38',
	end_time: null,
	pages: 0,
	md5sum: null,
	start_url: 'http://www.example.com',
	start_template: 'main_template',
	start_value: '{"query": "San Francisco"}',
};
const PROJECT = {
	token: 't-0WMEZ-Bc9sWGHAMsYvP7y4',
	title: 'My Project',
	templates_json: '{}',
	main_template: 'main_template',
	main_site: 'http://www.example.com',
	options_json: '{"loadJs":true}',
	last_run: { ...RUN, status: 'complete', data_ready: true },
	last_ready_run: { ...RUN, status: 'complete', data_ready: true },
	run_list: [{ ...RUN, status: 'complete', data_ready: true }],
};

beforeEach(() => {
	jest.clearAllMocks();
});

describe('wire format of every operation', () => {
	type Case = {
		name: string;
		run: (ctx: ParsehubContext) => Promise<unknown>;
		reply: unknown;
		method: string;
		url: string;
		query?: Record<string, unknown>;
		form?: Record<string, string>;
		event: string;
	};

	const cases: Case[] = [
		{
			name: 'projects.list',
			run: (ctx) =>
				listProjects(ctx, { offset: 20, limit: 5, include_options: true }),
			reply: { projects: [PROJECT], total_projects: 21 },
			method: 'GET',
			url: '/api/v2/projects',
			query: { offset: 20, limit: 5, include_options: 1 },
			event: 'parsehub.projects.list',
		},
		{
			name: 'projects.get',
			run: (ctx) =>
				getProject(ctx, {
					project_token: 'p1',
					offset: 20,
					include_options: false,
				}),
			reply: PROJECT,
			method: 'GET',
			url: '/api/v2/projects/p1',
			query: { offset: 20, include_options: 0 },
			event: 'parsehub.projects.get',
		},
		{
			name: 'projects.run',
			run: (ctx) =>
				runProject(ctx, {
					project_token: 'p1',
					start_url: 'http://www.example.com',
					start_template: 'main_template',
					start_value_override: { query: 'San Francisco' },
					send_email: false,
				}),
			reply: RUN,
			method: 'POST',
			url: '/api/v2/projects/p1/run',
			form: {
				api_key: 'test-key',
				start_url: 'http://www.example.com',
				start_template: 'main_template',
				start_value_override: '{"query":"San Francisco"}',
				send_email: '0',
			},
			event: 'parsehub.projects.run',
		},
		{
			name: 'projects.getLastReadyData',
			run: (ctx) =>
				getLastReadyData(ctx, { project_token: 'p1', format: 'json' }),
			reply: { questions: [{ title: 'This is a title' }] },
			method: 'GET',
			url: '/api/v2/projects/p1/last_ready_run/data',
			query: { format: 'json' },
			event: 'parsehub.projects.getLastReadyData',
		},
		{
			name: 'runs.get',
			run: (ctx) => getRun(ctx, { run_token: 'r1' }),
			reply: { ...RUN, status: 'running' },
			method: 'GET',
			url: '/api/v2/runs/r1',
			event: 'parsehub.runs.get',
		},
		{
			name: 'runs.getData',
			run: (ctx) => getRunData(ctx, { run_token: 'r1', format: 'csv' }),
			reply:
				'"questions_title","questions_text"\n"This is a title","This is some text"\n',
			method: 'GET',
			url: '/api/v2/runs/r1/data',
			query: { format: 'csv' },
			event: 'parsehub.runs.getData',
		},
		{
			name: 'runs.cancel',
			run: (ctx) => cancelRun(ctx, { run_token: 'r1' }),
			reply: { ...RUN, status: 'cancelled', pages: 52 },
			method: 'POST',
			url: '/api/v2/runs/r1/cancel',
			form: { api_key: 'test-key' },
			event: 'parsehub.runs.cancel',
		},
		{
			name: 'runs.delete',
			run: (ctx) => deleteRun(ctx, { run_token: 'r1' }),
			reply: { run_token: 'r1' },
			method: 'DELETE',
			url: '/api/v2/runs/r1',
			event: 'parsehub.runs.delete',
		},
	];

	it.each(cases)('$name sends $method $url', async (c) => {
		mockRequest.mockResolvedValue(c.reply);
		const result = await c.run(context('test-key'));
		expect(result).toEqual(c.reply);
		const { config, options } = lastCall();
		expect(config?.BASE).toBe('https://www.parsehub.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options?.method).toBe(c.method);
		expect(options?.url).toBe(c.url);
		if (c.form) {
			// POST takes the key and fields form-encoded, nothing in the query.
			expect(options?.mediaType).toBe(
				'application/x-www-form-urlencoded; charset=utf-8',
			);
			expect(
				Object.fromEntries(new URLSearchParams(String(options?.body))),
			).toEqual(c.form);
			expect(JSON.stringify(options?.query ?? {})).not.toContain('test-key');
		} else {
			expect(options?.query).toEqual({
				api_key: 'test-key',
				...(c.query ?? {}),
			});
			expect(options?.body).toBeUndefined();
		}
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			c.event,
			expect.any(Object),
			'completed',
		);
		expect(
			JSON.stringify(mockLog.mock.calls.map((call) => call[2])),
		).not.toContain('test-key');
		// Core's own 429 retries stay on: no rate-limit override is passed.
		expect(mockRequest.mock.calls.at(-1)?.[2]).toBeUndefined();
	});

	it.each(cases)('$name throws AuthMissingError without a key', async (c) => {
		await expect(c.run(context(''))).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('inputs', () => {
	it('encodes tokens so they cannot add path segments', async () => {
		mockRequest.mockResolvedValue({ run_token: 'x' });
		await deleteRun(context('k'), { run_token: '../projects?x' });
		expect(lastCall().options?.url).toBe('/api/v2/runs/..%2Fprojects%3Fx');
	});

	it('leaves optional run fields out of the form', async () => {
		mockRequest.mockResolvedValue(RUN);
		await runProject(context('k'), { project_token: 'p1' });
		expect(
			Object.fromEntries(new URLSearchParams(String(lastCall().options?.body))),
		).toEqual({ api_key: 'k' });
	});

	it('rejects a limit above 20 and a bad start_url before calling the API', async () => {
		await expect(listProjects(context('k'), { limit: 21 })).rejects.toThrow();
		await expect(
			runProject(context('k'), { project_token: 'p1', start_url: 'not a url' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('omits optional list parameters when the caller does', async () => {
		mockRequest.mockResolvedValue({ projects: [] });
		await listProjects(context('k'), {});
		expect(lastCall().options?.query).toEqual({
			api_key: 'k',
			offset: undefined,
			limit: undefined,
			include_options: undefined,
		});
	});
});

describe('responses', () => {
	it('rejects a project whose token or title has the wrong type', async () => {
		mockRequest.mockResolvedValue({ projects: [{ token: 17, title: false }] });
		await expect(listProjects(context('k'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a response without a projects array', async () => {
		mockRequest.mockResolvedValue({ total_projects: 0 });
		await expect(listProjects(context('k'), {})).rejects.toThrow();
	});

	it('accepts a numeric data_ready and extra run fields', async () => {
		const reply = { ...RUN, data_ready: 1, new_run: { run_token: 'r2' } };
		mockRequest.mockResolvedValue(reply);
		await expect(getRun(context('k'), { run_token: 'r1' })).resolves.toEqual(
			reply,
		);
	});

	it('rejects a delete reply without the run token', async () => {
		mockRequest.mockResolvedValue({});
		await expect(
			deleteRun(context('k'), { run_token: 'r1' }),
		).rejects.toThrow();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v2/projects' },
			{
				url: 'https://www.parsehub.com/api/v2/projects',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: 'Unauthorized',
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listProjects(context('k'), {})).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});
});

describe('stored projects', () => {
	it('stores each project token and title', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({ projects: [PROJECT] });
		await listProjects(context('test-key', { upsert }), {});
		expect(upsert).toHaveBeenCalledWith(PROJECT.token, {
			token: PROJECT.token,
			title: 'My Project',
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('keeps the stored title when a response has none', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		const find = jest
			.fn()
			.mockResolvedValue({ data: { token: 'p1', title: 'Old' } });
		mockRequest.mockResolvedValue({ token: 'p1', title: null });
		await getProject(context('k', { upsert, find }), { project_token: 'p1' });
		expect(upsert).toHaveBeenCalledWith('p1', { token: 'p1', title: 'Old' });
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		const reply = { projects: [PROJECT] };
		mockRequest.mockResolvedValue(reply);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(listProjects(context('k', { upsert }), {})).resolves.toEqual(
			reply,
		);
		warn.mockRestore();
	});
});
