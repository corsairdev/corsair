import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { listProjects } from './endpoints/projects';
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

const SAMPLE = {
	projects: [{ token: 'project-1', title: 'Example' }],
	total_projects: 1,
};

function context(key: string, upsert?: jest.Mock): ParsehubContext {
	return {
		key,
		db: upsert ? { projects: { upsertByEntityId: upsert } } : undefined,
	} as unknown as ParsehubContext;
}

describe('projects.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns projects and sends api_key', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		const result = await listProjects(context('test-key'), {
			offset: 0,
			limit: 20,
			include_options: true,
		});
		expect(result).toEqual(SAMPLE);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://www.parsehub.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(options).toMatchObject({
			method: 'GET',
			url: '/api/v2/projects',
			query: {
				api_key: 'test-key',
				offset: 0,
				limit: 20,
				include_options: 1,
			},
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'parsehub.projects.list',
			{ offset: 0 },
			'completed',
		);
		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload.api_key).toBeUndefined();
	});

	it('omits optional query fields when the caller does', async () => {
		mockRequest.mockResolvedValue(SAMPLE);
		await listProjects(context('test-key'), {});
		const options = mockRequest.mock.calls[0]?.[1];
		expect(options?.query).toMatchObject({
			api_key: 'test-key',
			offset: undefined,
			limit: undefined,
			include_options: undefined,
		});
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listProjects(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
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
		await expect(listProjects(context('test-key'), {})).rejects.toBe(error);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a page size outside 1 to 20 before calling the API', async () => {
		await expect(
			listProjects(context('test-key'), { limit: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that has no projects array', async () => {
		mockRequest.mockResolvedValue({ total_projects: 1 });
		await expect(listProjects(context('test-key'), {})).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('stores each project that has a token and not the API key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			projects: [
				{ token: 'project-1', title: 'Example' },
				{ title: 'Missing token' },
			],
			total_projects: 2,
		});
		const result = await listProjects(context('test-key', upsert), {});
		expect(result.projects).toHaveLength(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('project-1', {
			token: 'project-1',
			title: 'Example',
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('test-key');
	});

	it('returns the list when the database write fails', async () => {
		const upsert = jest.fn().mockRejectedValue(new Error('disk full'));
		mockRequest.mockResolvedValue(SAMPLE);
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			listProjects(context('test-key', upsert), {}),
		).resolves.toEqual(SAMPLE);
		warn.mockRestore();
	});
});
