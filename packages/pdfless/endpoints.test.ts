import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { PdfLessContext } from './context';
import { listTemplates } from './endpoints/templates';
import { getWorkspace } from './endpoints/workspace';

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

function context(key: string, db?: PdfLessContext['db']): PdfLessContext {
	return { key, db } as unknown as PdfLessContext;
}

describe('workspace.get', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores a named workspace and sends the apikey header', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			name: 'Main',
			active: true,
			created: '2024-01-01T00:00:00Z',
			modified: '2024-02-01T00:00:00Z',
			quota: 100,
			remainingQuota: 80,
		});
		const result = await getWorkspace(
			context('ak_test', {
				workspaces: { upsertByEntityId: upsert },
			} as unknown as PdfLessContext['db']),
			{},
		);
		expect(result.name).toBe('Main');
		expect(upsert).toHaveBeenCalledWith('Main', {
			name: 'Main',
			active: true,
			created: '2024-01-01T00:00:00Z',
			modified: '2024-02-01T00:00:00Z',
			quota: 100,
			remainingQuota: 80,
		});
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.BASE).toBe('https://api.pdfless.com');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({ apikey: 'ak_test' });
		expect(options).toMatchObject({ method: 'GET', url: '/v1/workspaces' });
		expect(mockLog.mock.calls[0]?.[2]).toEqual({});
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('ak_test');
	});

	it('does not store a workspace that has no name', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({ active: true, quota: 10 });
		const result = await getWorkspace(
			context('ak_test', {
				workspaces: { upsertByEntityId: upsert },
			} as unknown as PdfLessContext['db']),
			{},
		);
		expect(result.active).toBe(true);
		expect(upsert).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(getWorkspace(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets the documented HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/workspaces' },
			{
				url: 'https://api.pdfless.com/v1/workspaces',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { message: 'No API key found in request' },
			},
			'No API key found in request',
		);
		mockRequest.mockRejectedValue(error);
		await expect(getWorkspace(context('ak_test'), {})).rejects.toBe(error);
	});
});

describe('templates.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores templates that have an id and sends Page and PageSize', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue([
			{
				id: 'tpl_1',
				name: 'Invoice',
				imagePreviewUrl: 'https://cdn.pdfless.com/preview.png',
				pdfPreviewUrl: 'https://cdn.pdfless.com/sample.pdf',
				created: '2024-05-10T14:22:31Z',
				modified: '2024-06-03T09:15:44Z',
			},
			{ name: 'Missing id' },
		]);
		const result = await listTemplates(
			context('ak_test', {
				templates: { upsertByEntityId: upsert },
			} as unknown as PdfLessContext['db']),
			{ page: 1, pageSize: 25 },
		);
		expect(result.templates).toHaveLength(2);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('tpl_1', {
			id: 'tpl_1',
			name: 'Invoice',
			imagePreviewUrl: 'https://cdn.pdfless.com/preview.png',
			pdfPreviewUrl: 'https://cdn.pdfless.com/sample.pdf',
			created: '2024-05-10T14:22:31Z',
			modified: '2024-06-03T09:15:44Z',
		});
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/document-templates',
			query: { Page: 1, PageSize: 25 },
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ page: 1, pageSize: 25 });
	});

	it('rejects page 0 before calling the API', async () => {
		await expect(
			listTemplates(context('ak_test'), { page: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a body that is not an array before writing', async () => {
		const upsert = jest.fn();
		mockRequest.mockResolvedValue({ templates: [] });
		await expect(
			listTemplates(
				context('ak_test', {
					templates: { upsertByEntityId: upsert },
				} as unknown as PdfLessContext['db']),
				{},
			),
		).rejects.toThrow();
		expect(upsert).not.toHaveBeenCalled();
	});
});
