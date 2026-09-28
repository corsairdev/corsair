import type { UploadcareAPIError } from './client';
import { makeUploadcareRequest } from './client';

const TEST_API_KEY = 'test_public_key:test_secret_key';

describe('makeUploadcareRequest', () => {
	it('sends Uploadcare.Simple auth and v0.7 Accept', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => ({ name: 'Test Project', pub_key: 'test_pk' }),
			text: async () =>
				JSON.stringify({ name: 'Test Project', pub_key: 'test_pk' }),
		});
		global.fetch = fetchMock as typeof fetch;

		const result = await makeUploadcareRequest<{ name: string }>(
			'/project/',
			TEST_API_KEY,
			{ method: 'GET' },
		);

		expect(result.name).toBe('Test Project');
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('https://api.uploadcare.com/project/');
		const headers = init.headers as Headers;
		expect(headers.get('Authorization')).toBe(
			`Uploadcare.Simple ${TEST_API_KEY}`,
		);
		expect(headers.get('Accept')).toBe('application/vnd.uploadcare-v0.7+json');
	});

	it('preserves DELETE bodies for batch delete', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			json: async () => ({ status: 'ok', result: [] }),
			text: async () => JSON.stringify({ status: 'ok', result: [] }),
		});
		global.fetch = fetchMock as typeof fetch;

		await makeUploadcareRequest('/files/storage/', TEST_API_KEY, {
			method: 'DELETE',
			body: ['uuid-1', 'uuid-2'],
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(init.method).toBe('DELETE');
		expect(init.body).toBe(JSON.stringify(['uuid-1', 'uuid-2']));
	});

	it('keeps status and provider detail on ApiError', async () => {
		const fetchMock = jest.fn().mockResolvedValue({
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			headers: new Headers({
				'content-type': 'application/json',
			}),
			json: async () => ({ detail: 'Invalid authorization header' }),
			text: async () =>
				JSON.stringify({ detail: 'Invalid authorization header' }),
		});
		global.fetch = fetchMock as typeof fetch;

		await expect(
			makeUploadcareRequest('/project/', TEST_API_KEY, { method: 'GET' }),
		).rejects.toMatchObject({
			name: 'UploadcareAPIError',
			status: 401,
			message: 'Invalid authorization header',
		} satisfies Partial<UploadcareAPIError>);
	});
});
