import { ApiError, request } from 'corsair/http';
import { DocusignApiError, DocusignClient } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function makeClient(baseUri?: string) {
	return new DocusignClient({
		accessToken: 'mock_token',
		accountId: '12345',
		...(baseUri === undefined ? {} : { baseUri }),
	});
}

function lastCall() {
	const calls = mockRequest.mock.calls;
	const last = calls[calls.length - 1];
	if (!last) {
		throw new Error('expected corsair/http request to be called');
	}
	return { config: last[0], options: last[1] };
}

function frameworkError(status: number, body: unknown, message: string) {
	return new ApiError(
		{ method: 'GET', url: '/templates' },
		{
			url: 'https://demo.docusign.net/restapi/v2.1/accounts/12345/templates',
			ok: false,
			status,
			statusText: 'Error',
			body,
		},
		message,
	);
}

describe('DocusignClient', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends requests through corsair/http with bearer auth', async () => {
		const client = makeClient();
		await client.request('/templates');
		const { config, options } = lastCall();
		expect(config.BASE).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345',
		);
		expect(config.HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer mock_token' }),
		);
		expect(options).toEqual(
			expect.objectContaining({ method: 'GET', url: '/templates' }),
		);
	});

	it('normalizes a bare production host', async () => {
		const client = makeClient('na4.docusign.net');
		await client.request('/templates');
		expect(lastCall().config.BASE).toBe(
			'https://na4.docusign.net/restapi/v2.1/accounts/12345',
		);
	});

	it('rejects untrusted base URI hosts', () => {
		expect(() => makeClient('https://evil.example.com')).toThrow(
			'Untrusted DocuSign baseUri host',
		);
	});

	it('rejects non-HTTPS base URIs', () => {
		expect(() => makeClient('http://demo.docusign.net')).toThrow(
			'DocuSign baseUri must use HTTPS',
		);
	});

	it('sends JSON bodies with a JSON media type', async () => {
		const client = makeClient();
		await client.request('/envelopes', {
			method: 'POST',
			body: JSON.stringify({ status: 'sent' }),
		});
		const { options } = lastCall();
		expect(options.method).toBe('POST');
		expect(options.body).toEqual({ status: 'sent' });
		expect(options.mediaType).toBe('application/json');
	});

	it('wraps framework errors with the DocuSign error code', async () => {
		mockRequest.mockRejectedValueOnce(
			frameworkError(
				429,
				{ errorCode: 'RATE_LIMIT_EXCEEDED', message: 'Slow down' },
				'Too Many Requests',
			),
		);
		const client = makeClient();
		const failure = client.request('/templates');
		await expect(failure).rejects.toBeInstanceOf(DocusignApiError);
		await expect(failure).rejects.toMatchObject({
			name: 'DocusignApiError',
			status: 429,
			errorCode: 'RATE_LIMIT_EXCEEDED',
		});
	});

	it('calls the demo userinfo endpoint for demo accounts', async () => {
		const client = makeClient();
		await client.userInfo();
		const { config, options } = lastCall();
		expect(config.BASE).toBe('https://account-d.docusign.com');
		expect(options).toEqual(
			expect.objectContaining({ method: 'GET', url: '/oauth/userinfo' }),
		);
		expect(config.HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer mock_token' }),
		);
	});

	it('calls the production userinfo endpoint for production accounts', async () => {
		const client = makeClient('https://eu.docusign.com/restapi/v2.1');
		await client.userInfo();
		expect(lastCall().config.BASE).toBe('https://account.docusign.com');
	});

	it('rejects untrusted auth server hosts', async () => {
		const client = makeClient();
		await expect(client.userInfo('https://evil.example.com')).rejects.toThrow(
			'Untrusted DocuSign auth server host',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects path traversal segments without calling the api', async () => {
		const client = makeClient();
		await expect(client.request('/templates/../accounts')).rejects.toThrow(
			'path traversal segments are not allowed',
		);
		await expect(client.request('/templates/%2e%2e/accounts')).rejects.toThrow(
			'path traversal segments are not allowed',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});
});
