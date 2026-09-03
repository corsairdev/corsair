import { ApiError, request } from 'corsair/http';
import {
	assertSafePathParam,
	makePostmanRequest,
	POSTMAN_API_BASE,
	PostmanAPIError,
	tryGetStoredKey,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function apiError(status: number, statusText: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'collections' },
		{
			url: 'https://api.getpostman.com/collections',
			ok: false,
			status,
			statusText,
			body: { error: { name: 'error', message: statusText } },
		},
		statusText,
	);
}

describe('Postman client', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('makePostmanRequest', () => {
		it('targets the Postman v1 base with the X-Api-Key header', async () => {
			mockRequest.mockResolvedValueOnce({ collections: [] });

			await makePostmanRequest('collections', 'test-key', { method: 'GET' });

			const [config] = mockRequest.mock.calls[0] ?? [];
			expect(config?.BASE).toBe(POSTMAN_API_BASE);
			expect(config?.BASE).toBe('https://api.getpostman.com');
			expect(config?.HEADERS).toMatchObject({
				'Content-Type': 'application/json',
				'X-Api-Key': 'test-key',
			});
		});

		it('omits the body on GET and passes it through on POST and PUT', async () => {
			mockRequest.mockResolvedValue({ id: 'col_1' });

			await makePostmanRequest('collections/col_1', 'tok', { method: 'GET' });
			await makePostmanRequest('collections', 'tok', {
				method: 'POST',
				body: { collection: { info: { name: 'C' } } },
			});
			await makePostmanRequest('collections/col_1', 'tok', {
				method: 'PUT',
				body: { collection: { info: { name: 'C2' } } },
			});

			const [, getOptions] = mockRequest.mock.calls[0] ?? [];
			expect(getOptions?.body).toBeUndefined();

			const [, postOptions] = mockRequest.mock.calls[1] ?? [];
			expect(postOptions?.body).toEqual({
				collection: { info: { name: 'C' } },
			});

			const [, putOptions] = mockRequest.mock.calls[2] ?? [];
			expect(putOptions?.body).toEqual({
				collection: { info: { name: 'C2' } },
			});
		});

		it('forwards path params and query params to the transport', async () => {
			mockRequest.mockResolvedValueOnce({ collection: { id: 'col_1' } });

			await makePostmanRequest('/collections/{collectionId}', 'tok', {
				method: 'GET',
				path: { collectionId: 'col_1' },
				query: { workspace: 'ws_1' },
			});

			const [, options] = mockRequest.mock.calls[0] ?? [];
			expect(options?.url).toBe('/collections/{collectionId}');
			expect(options?.path).toEqual({ collectionId: 'col_1' });
			expect(options?.query).toEqual({ workspace: 'ws_1' });
		});

		it('keeps ApiError status and body on PostmanAPIError', async () => {
			mockRequest.mockRejectedValueOnce(apiError(429, 'Too Many Requests'));

			await expect(
				makePostmanRequest('collections', 'tok', { method: 'GET' }),
			).rejects.toMatchObject({
				name: 'PostmanAPIError',
				status: 429,
			});
		});

		it('rethrows PostmanAPIErrors without rewrapping', async () => {
			const original = new PostmanAPIError('already wrapped');
			mockRequest.mockRejectedValueOnce(original);

			await expect(
				makePostmanRequest('collections', 'tok', { method: 'GET' }),
			).rejects.toBe(original);
		});

		it('wraps plain errors with their message', async () => {
			mockRequest.mockRejectedValueOnce(new Error('socket hang up'));

			await expect(
				makePostmanRequest('collections', 'tok', { method: 'GET' }),
			).rejects.toMatchObject({
				name: 'PostmanAPIError',
				message: 'socket hang up',
			});
		});

		it('wraps unknown throws as an unknown error', async () => {
			mockRequest.mockRejectedValueOnce('bang');

			await expect(
				makePostmanRequest('collections', 'tok', { method: 'GET' }),
			).rejects.toMatchObject({
				name: 'PostmanAPIError',
				message: 'Unknown error',
			});
		});
	});

	describe('assertSafePathParam', () => {
		it('accepts plain ids and nested paths', () => {
			expect(() => assertSafePathParam('filePath', 'spec.json')).not.toThrow();
			expect(() =>
				assertSafePathParam('filePath', 'components/schemas.json'),
			).not.toThrow();
		});

		it('rejects dot, dot-dot, empty, and encoded traversal segments', () => {
			for (const unsafe of [
				'..',
				'.',
				'../secret',
				'a/../../b',
				'%2e%2e/secret',
				'a//b',
			]) {
				expect(() => assertSafePathParam('filePath', unsafe)).toThrow(
					PostmanAPIError,
				);
			}
		});
	});

	describe('tryGetStoredKey', () => {
		it('returns the stored key when present', async () => {
			await expect(tryGetStoredKey(async () => 'stored-key')).resolves.toBe(
				'stored-key',
			);
		});

		it('returns null when no key is stored', async () => {
			await expect(tryGetStoredKey(async () => null)).resolves.toBeNull();
		});

		it('returns null when the account has no key manager state', async () => {
			const noDek = async (): Promise<string | null> => {
				throw new Error('No DEK found for account');
			};

			await expect(tryGetStoredKey(noDek)).resolves.toBeNull();
		});

		it('rethrows operational failures', async () => {
			const failing = async (): Promise<string | null> => {
				throw new Error('decryption failure');
			};

			await expect(tryGetStoredKey(failing)).rejects.toThrow(
				'decryption failure',
			);
		});
	});
});
