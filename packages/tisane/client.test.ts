import * as httpModule from 'corsair/http';
import { makeTisaneRequest, TISANE_API_BASE, TisaneAPIError } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

describe('makeTisaneRequest', () => {
	const mockRequest = httpModule.request as jest.MockedFunction<
		typeof httpModule.request
	>;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('sends POST request to Tisane API with Ocp-Apim-Subscription-Key header', async () => {
		mockRequest.mockResolvedValueOnce({ text: 'parsed result' });

		const result = await makeTisaneRequest<{ text: string }>(
			'parse',
			'test-key-123',
			{
				method: 'POST',
				body: { content: 'hello world', language: 'en' },
			},
		);

		expect(result).toEqual({ text: 'parsed result' });
		expect(mockRequest).toHaveBeenCalledTimes(1);
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('Expected mockRequest to be called');
		const [config, requestOptions] = call;

		expect(config.BASE).toBe(TISANE_API_BASE);
		const headers = config.HEADERS as Record<string, string>;
		expect(headers?.['Ocp-Apim-Subscription-Key']).toBe('test-key-123');
		expect(config.TOKEN).toBeUndefined();
		expect(requestOptions.url).toBe('parse');
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.body).toEqual({
			content: 'hello world',
			language: 'en',
		});
	});

	it('wraps errors in TisaneAPIError', async () => {
		mockRequest.mockRejectedValueOnce(new Error('Network drop'));

		await expect(
			makeTisaneRequest('parse', 'test-key', { method: 'POST' }),
		).rejects.toThrow(TisaneAPIError);
	});
});
