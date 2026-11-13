import { MistralAiAPIError, makeMistralAiRequest } from './client';
import { jsonResponse, mockFetch } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = mockFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
	jest.useRealTimers();
});

describe('makeMistralAiRequest', () => {
	it('makes one attempt on a 429 and leaves retries to the error handlers', async () => {
		jest.useFakeTimers();
		fetchMock.mockImplementation(async () =>
			jsonResponse({ message: 'Requests rate limit exceeded' }, 429, {
				'Retry-After': '2',
			}),
		);

		const pending = makeMistralAiRequest('/v1/models', 'k');
		const settled = expect(pending).rejects.toMatchObject({
			name: 'MistralAiAPIError',
			status: 429,
			retryAfter: 2000,
		});
		await jest.advanceTimersByTimeAsync(10_000);
		await settled;
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('turns a 422 HTTPValidationError into one line per rejected field', async () => {
		const body = {
			detail: [
				{ loc: ['body', 'model'], msg: 'Field required', type: 'missing' },
				{
					loc: ['query', 'page_size'],
					msg: 'Input should be greater than or equal to 1',
					type: 'greater_than_equal',
				},
			],
		};
		fetchMock.mockResolvedValueOnce(jsonResponse(body, 422));

		const request = makeMistralAiRequest('/v1/chat/completions', 'k', {
			method: 'POST',
			body: {},
		});
		// unknown: a rejection can carry any value; the checks below narrow it.
		const error = await request.catch((e: unknown) => e);

		expect(error).toBeInstanceOf(MistralAiAPIError);
		expect(error).toMatchObject({ status: 422, method: 'POST', body });
		expect((error as Error).message).toBe(
			'Mistral AI rejected the request: body.model: Field required; query.page_size: Input should be greater than or equal to 1',
		);
	});

	it("keeps Mistral's own message on other errors instead of the bare status text", async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse(
				{
					object: 'error',
					message: 'Invalid model: mistral-nope',
					type: 'invalid_model',
					code: '1500',
				},
				400,
			),
		);
		await expect(
			makeMistralAiRequest('/v1/chat/completions', 'k', {
				method: 'POST',
				body: { model: 'mistral-nope' },
			}),
		).rejects.toThrow('400 Invalid model: mistral-nope');
	});

	it('URI-encodes path values, so an id cannot change the route', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ url: 'https://x' }));
		await makeMistralAiRequest('/v1/files/{file_id}/url', 'k', {
			path: { file_id: '../models?x=1' },
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://api.mistral.ai/v1/files/..%2Fmodels%3Fx%3D1/url',
		);
	});

	it('sends a FormData body as is, without a JSON content type', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));
		const form = new FormData();
		form.append('purpose', 'batch');
		await makeMistralAiRequest('/v1/files', 'k', {
			method: 'POST',
			formData: form,
		});
		const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
		expect(init.body).toBe(form);
		expect(new Headers(init.headers).get('Content-Type')).toBeNull();
		expect(new Headers(init.headers).get('Authorization')).toBe('Bearer k');
	});
});
