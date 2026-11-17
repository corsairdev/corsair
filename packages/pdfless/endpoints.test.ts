import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { PdfLessContext } from './context';
import { generatePdf } from './endpoints/pdfs';
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
	// unknown: a partial test double of the plugin context.
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
				// unknown: a partial test double of the plugin database.
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
				// unknown: a partial test double of the plugin database.
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
				// unknown: a partial test double of the plugin database.
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
					// unknown: a partial test double of the plugin database.
				} as unknown as PdfLessContext['db']),
				{},
			),
		).rejects.toThrow();
		expect(upsert).not.toHaveBeenCalled();
	});
});

describe('documented nulls', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('accepts a workspace with modified null', async () => {
		const reply = {
			name: 'Main',
			active: true,
			created: '2024-01-01T00:00:00Z',
			modified: null,
			quota: 100,
			remainingQuota: 80,
		};
		mockRequest.mockResolvedValue(reply);
		await expect(getWorkspace(context('ak_test'), {})).resolves.toEqual(reply);
	});

	it('accepts templates with null previews, name and modified', async () => {
		mockRequest.mockResolvedValue([
			{
				id: '6f9619ff-8b86-d011-b42d-00cf4fc964ff',
				name: null,
				imagePreviewUrl: null,
				pdfPreviewUrl: null,
				created: '2024-01-01T00:00:00Z',
				modified: null,
			},
		]);
		const result = await listTemplates(context('ak_test'), {});
		expect(result.templates).toHaveLength(1);
	});
});

describe('pdfs.generate', () => {
	const TEMPLATE = '6f9619ff-8b86-d011-b42d-00cf4fc964ff';
	const REPLY = {
		status: 'success',
		data: {
			reference_id: 'inv-42',
			template_id: TEMPLATE,
			download_url: 'https://files.pdfless.com/x.pdf',
			expires: '2026-11-18T00:00:00Z',
			created_at: '2026-11-17T00:00:00Z',
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockRequest.mockReset();
	});

	it('POSTs the template, payload and options and returns the download link', async () => {
		mockRequest.mockResolvedValue(REPLY);
		const input = {
			template_id: TEMPLATE,
			payload: { customer: { name: 'Ada' }, total: 42 },
			reference_id: 'inv-42',
			encryption_user_password: 'open-sesame',
			encryption_allow_printing: true,
		};
		await expect(generatePdf(context('ak_test'), input)).resolves.toEqual(
			REPLY,
		);
		const config = mockRequest.mock.calls[0]?.[0];
		const options = mockRequest.mock.calls[0]?.[1];
		expect(config?.HEADERS).toMatchObject({ apikey: 'ak_test' });
		expect(options).toMatchObject({
			method: 'POST',
			url: '/v1/pdfs',
			body: input,
			mediaType: 'application/json',
		});
		// Core's own 429 retries stay on: no rate-limit override is passed.
		expect(mockRequest.mock.calls[0]?.[2]).toBeUndefined();
		const logged = JSON.stringify(mockLog.mock.calls.map((call) => call[2]));
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'pdfless.pdfs.generate',
			{ template_id: TEMPLATE },
			'completed',
		);
		expect(logged).not.toMatch(/Ada|open-sesame|ak_test/);
	});

	it('throws AuthMissingError without a key', async () => {
		await expect(
			generatePdf(context(''), { template_id: TEMPLATE, payload: {} }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a template id that is not a UUID before calling the API', async () => {
		await expect(
			generatePdf(context('k'), { template_id: 'nope', payload: {} }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('accepts the documented null download_url', async () => {
		const reply = {
			status: 'success',
			data: { ...REPLY.data, download_url: null },
		};
		mockRequest.mockResolvedValue(reply);
		await expect(
			generatePdf(context('k'), { template_id: TEMPLATE, payload: {} }),
		).resolves.toEqual(reply);
	});

	it('rejects a reply without a download_url', async () => {
		mockRequest.mockResolvedValue({ status: 'success', data: {} });
		await expect(
			generatePdf(context('k'), { template_id: TEMPLATE, payload: {} }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('keeps template data and passwords out of a failed request error', async () => {
		// unknown/never: the mock ignores the config and rejects the way core's request() does on a 403.
		mockRequest.mockImplementation(((_config: unknown, options: never) => {
			throw new ApiError(
				options,
				{
					url: 'https://api.pdfless.com/v1/pdfs',
					ok: false,
					status: 403,
					statusText: 'Forbidden',
					body: { message: 'Quota exceeded', error_code: 'quota' },
				},
				'Forbidden',
				{ retryAfter: 7 },
			);
		}) as never);
		const error = await generatePdf(context('k'), {
			template_id: TEMPLATE,
			payload: { customer: { email: 'ada@example.com' } },
			encryption_owner_password: 'owner-secret',
			// unknown: whatever the call throws is checked below.
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(403);
		expect(apiError.retryAfter).toBe(7);
		expect(apiError.body).toEqual({
			message: 'Quota exceeded',
			error_code: 'quota',
		});
		expect(JSON.stringify(apiError.request)).not.toMatch(
			/ada@example|owner-secret/,
		);
	});
});
