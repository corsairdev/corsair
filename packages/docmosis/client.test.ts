import { ApiError, request } from 'corsair/http';
import { DocmosisAPIError, makeDocmosisRequest } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

describe('makeDocmosisRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it.each([
		['us1', 'https://us1.dws4.docmosis.com/api'],
		['eu1', 'https://eu1.dws4.docmosis.com/api'],
		['au1', 'https://au1.dws4.docmosis.com/api'],
	] as const)('uses %s region base URL', async (region, base) => {
		mockRequest.mockResolvedValue({ succeeded: true });

		await makeDocmosisRequest('listTemplates', 'key-1', {
			method: 'POST',
			region,
			formData: {},
		});

		const [config] = mockRequest.mock.calls[0]!;
		expect(config.BASE).toBe(base);
		const headers = config.HEADERS as Record<string, string>;
		expect(headers.accessKey).toBe('key-1');
		expect(config.TOKEN).toBeUndefined();
	});

	it('sends endpoint and form data exactly as provided', async () => {
		mockRequest.mockResolvedValue({ succeeded: true });

		await makeDocmosisRequest('getTemplateDetails', 'key-2', {
			method: 'POST',
			formData: { templateName: '/t.docx', stringify: 'true' },
		});

		const [, requestOptions] = mockRequest.mock.calls[0]!;
		expect(requestOptions.url).toBe('getTemplateDetails');
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.formData).toEqual({
			templateName: '/t.docx',
			stringify: 'true',
		});
		expect(requestOptions.mediaType).toBe('application/x-www-form-urlencoded');
	});

	it('preserves ApiError status/retryAfter for downstream handlers', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'listTemplates' },
			{
				url: 'https://us1.dws4.docmosis.com/api/listTemplates',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 1200 },
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeDocmosisRequest('listTemplates', 'key-3', {
				method: 'POST',
				formData: {},
			}),
		).rejects.toMatchObject({
			name: 'DocmosisAPIError',
			status: 429,
			retryAfter: 1200,
		});
	});

	it('wraps non-ApiError failures in DocmosisAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('network down'));

		try {
			await makeDocmosisRequest('ping', 'key-4', { method: 'GET' });
			throw new Error('expected failure');
		} catch (error) {
			expect(error).toBeInstanceOf(DocmosisAPIError);
			expect((error as DocmosisAPIError).message).toBe('network down');
			expect((error as DocmosisAPIError).status).toBeUndefined();
		}
	});

	it('fetches binary responses without using the JSON transport', async () => {
		const bytes = new Uint8Array([1, 2, 3, 4]).buffer;
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
			ok: true,
			arrayBuffer: async () => bytes,
		} as Response);

		const result = await makeDocmosisRequest('getImage', 'key-5', {
			method: 'POST',
			formData: { imageName: '/logo.png' },
			responseType: 'arrayBuffer',
		});

		expect(result).toBe(bytes);
		expect(fetchMock).toHaveBeenCalledWith(
			'https://us1.dws4.docmosis.com/api/getImage',
			expect.objectContaining({
				method: 'POST',
				headers: { accessKey: 'key-5' },
			}),
		);
		expect(mockRequest).not.toHaveBeenCalled();
		fetchMock.mockRestore();
	});
});
