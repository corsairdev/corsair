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

function context(key: string): ParsehubContext {
	return { key } as ParsehubContext;
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
	});
});
