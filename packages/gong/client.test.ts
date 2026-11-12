import { createServer } from 'node:http';
import { request } from 'corsair/http';
import * as client from './client';
import { gongRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));
const mockedRequest = jest.mocked(request);

describe('Gong HTTP transport', () => {
	it('rejects an insecure base URL before dispatching credentials', async () => {
		await expect(
			gongRequest({
				baseUrl: 'http://gong.example.test',
				credentials: {
					type: 'basic',
					accessKey: 'key',
					accessKeySecret: 'secret',
				},
				method: 'GET',
				path: '/v2/users',
			}),
		).rejects.toThrow('HTTPS');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	const basic = {
		type: 'basic' as const,
		accessKey: 'key',
		accessKeySecret: 'secret',
	};

	it.each([
		['https://evil.example.com'],
		['https://api.gong.io.example.com'],
		['https://us-123.api.gong.io.example.com'],
		['https://example.com/.api.gong.io'],
		['https://us-123.api.gong.io@example.com'],
		['https://user:pass@us-123.api.gong.io'],
		['https://us-123.api.gong.io:8443'],
		['https://us-123.api.gong.io/other/path'],
		['https://us-123.api.gong.io?x=1'],
		['https://a.b.api.gong.io'],
		['https://127.0.0.1'],
		['https://localhost'],
		['localhost:8443'],
		['example.com'],
		['-bad'],
	])('sends nothing when baseUrl is %s', async (baseUrl) => {
		mockedRequest.mockReset();
		await expect(
			gongRequest({
				baseUrl,
				credentials: basic,
				method: 'GET',
				path: '/v2/users',
			}),
		).rejects.toThrow('Gong baseUrl');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it.each([
		[undefined, 'https://api.gong.io'],
		['', 'https://api.gong.io'],
		['https://api.gong.io', 'https://api.gong.io'],
		['https://api.gong.io/v2', 'https://api.gong.io'],
		['us-123', 'https://us-123.api.gong.io'],
		['us-123.api.gong.io', 'https://us-123.api.gong.io'],
		['https://US-123.api.gong.io/', 'https://us-123.api.gong.io'],
		['https://us-123.api.gong.io/v2/', 'https://us-123.api.gong.io'],
	])('builds the host for baseUrl %s as %s', async (baseUrl, expected) => {
		mockedRequest.mockReset();
		mockedRequest.mockResolvedValue({ requestId: 'r' });
		expect(client.gongBaseUrl(baseUrl)).toBe(expected);
		await gongRequest({
			baseUrl,
			credentials: basic,
			method: 'GET',
			path: '/v2/users',
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({ BASE: expected }),
			expect.objectContaining({ url: '/v2/users' }),
		);
	});

	it('sends Gong’s GET JSON body through a transport that supports it', async () => {
		let requestMethod = '';
		let requestAuthorization = '';
		let requestBody = '';
		const server = createServer((request, response) => {
			requestMethod = request.method ?? '';
			requestAuthorization = request.headers.authorization ?? '';
			request.on('data', (chunk: Buffer) => {
				requestBody += chunk.toString();
			});
			request.on('end', () => {
				response.writeHead(200, { 'content-type': 'application/json' });
				response.end(JSON.stringify({ requestId: 'r', crmObjectsMap: {} }));
			});
		});
		await new Promise<void>((resolve) =>
			server.listen(0, '127.0.0.1', resolve),
		);
		const address = server.address();
		if (!address || typeof address === 'string')
			throw new Error('No server port');
		const requestGetWithBody = Reflect.get(client, 'requestGetWithBody');

		try {
			const response = await Reflect.apply(requestGetWithBody, undefined, [
				`http://127.0.0.1:${address.port}/v2/crm/entities?integrationId=12&objectType=DEAL`,
				{ objectsCrmIds: ['crm-1'] },
				{ Authorization: 'Basic test-credentials', Accept: 'application/json' },
			]);

			expect(requestMethod).toBe('GET');
			expect(requestAuthorization).toBe('Basic test-credentials');
			expect(requestBody).toBe(JSON.stringify({ objectsCrmIds: ['crm-1'] }));
			expect(response).toEqual({ requestId: 'r', crmObjectsMap: {} });
		} finally {
			await new Promise<void>((resolve, reject) =>
				server.close((error) => (error ? reject(error) : resolve())),
			);
		}
	});
});
