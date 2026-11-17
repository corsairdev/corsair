import { ApiError, request } from 'corsair/http';
import type { PaperformContext } from './context';
import { listForms, listTranslations } from './endpoints/read';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});
jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

function context(key?: string): PaperformContext {
	return { key } as unknown as PaperformContext;
}

describe('paperform', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores forms and sends a Bearer token', async () => {
		mockRequest.mockResolvedValue({
			results: { forms: [{ id: 'abc123', title: 'Contact', slug: 'contact' }] },
		});
		const result = await listForms(context('sekrit'), {});
		expect(result.forms[0]).toEqual({
			id: 'abc123',
			title: 'Contact',
			slug: 'contact',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.HEADERS).toEqual({
			Accept: 'application/json',
			Authorization: 'Bearer sekrit',
		});
		expect(mockRequest.mock.calls[0]?.[0]?.TOKEN).toBeUndefined();
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/v1/forms',
		});
	});

	it('stores a translation and drops the mapping', async () => {
		mockRequest.mockResolvedValue({
			results: {
				translations: [
					{ id: 'tr1', name: 'English', mapping: { hello: 'secret' } },
				],
			},
		});
		const result = await listTranslations(context(), {});
		expect(result.translations[0]).toEqual({ id: 'tr1', name: 'English' });
		expect(JSON.stringify(result.translations)).not.toContain('secret');
	});

	it('lets an HTTP 401 through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/v1/forms' },
			{
				url: 'https://api.paperform.co/v1/forms',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { error_type: 'authentication' },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listForms(context(), {})).rejects.toBe(error);
	});
});
