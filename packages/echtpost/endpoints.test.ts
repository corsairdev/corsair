import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { EchtpostContext } from './context';
import { listTemplates } from './endpoints/list';

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

function context(key: string, db?: EchtpostContext['db']): EchtpostContext {
	return { key, db } as unknown as EchtpostContext;
}

const TEMPLATE = {
	id: 12,
	motive_id: 4,
	content: 'Hello from the card',
	content_ps: 'PS',
	content_vertical: null,
	font: { family: 'special_elite', size: 12, color: 'black', extra: 'no' },
	qr_code_url: 'https://example.com/qr',
	preview_url: 'https://example.com/preview.png',
	source: 'regular',
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-01-02T00:00:00Z',
	secret_field: 'do-not-store',
};

describe('templates.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores documented template fields and sends X-Api-Key', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue([TEMPLATE, { content: 'no id' }]);
		const result = await listTemplates(
			context('sekrit', {
				templates: { upsertByEntityId: upsert },
			} as unknown as EchtpostContext['db']),
			{ page: 1, per_page: 50 },
		);
		expect(result.templates).toEqual([
			{
				id: '12',
				motive_id: 4,
				content: 'Hello from the card',
				content_ps: 'PS',
				font: { family: 'special_elite', size: 12, color: 'black' },
				qr_code_url: 'https://example.com/qr',
				preview_url: 'https://example.com/preview.png',
				source: 'regular',
				created_at: '2024-01-01T00:00:00Z',
				updated_at: '2024-01-02T00:00:00Z',
			},
		]);
		expect(upsert).toHaveBeenCalledWith('12', result.templates[0]);
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('do-not-store');
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('"extra"');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://api.echtpost.de/v2');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toEqual(
			expect.objectContaining({
				Accept: 'application/json',
				'X-Api-Key': 'sekrit',
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/templates',
			query: { page: '1', per_page: '50' },
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1, page: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain(
			'Hello from the card',
		);
	});

	it('rejects a body that is not an array', async () => {
		mockRequest.mockResolvedValue({ templates: [] });
		await expect(listTemplates(context('sekrit'), {})).rejects.toThrow(
			'Echtpost templates response was not an array',
		);
	});

	it('rejects a page below 1 before calling the API', async () => {
		await expect(
			listTemplates(context('sekrit'), { page: 0 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listTemplates(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/templates' },
			{
				url: 'https://api.echtpost.de/v2/templates',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { title: 'Authentication required' },
			},
			'Authentication required',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listTemplates(context('sekrit'), {})).rejects.toBe(error);
	});

	it('returns the templates when the database write fails', async () => {
		mockRequest.mockResolvedValue([TEMPLATE]);
		const upsert = jest.fn().mockRejectedValue(new Error('db down'));
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await listTemplates(
			context('sekrit', {
				templates: { upsertByEntityId: upsert },
			} as unknown as EchtpostContext['db']),
			{},
		);
		expect(result.templates).toHaveLength(1);
		expect(warn).toHaveBeenCalledWith('Failed to save Echtpost template');
		warn.mockRestore();
	});
});
