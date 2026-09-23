import { request } from 'corsair/http';
import { makeSnapchatRequest, requireString, SnapchatAPIError } from './client';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
}));

const requestMock = request as jest.MockedFunction<typeof request>;

describe('makeSnapchatRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		requestMock.mockResolvedValue({ ok: true });
	});

	it('calls the Snapchat Ads API base URL with Bearer auth', async () => {
		await makeSnapchatRequest('/me', 'snap_token_123');

		expect(requestMock).toHaveBeenCalledTimes(1);
		const [config, requestOptions] = requestMock.mock.calls[0]!;
		expect(config.BASE).toBe('https://adsapi.snapchat.com/v1');
		expect(config.TOKEN).toBe('snap_token_123');
		expect(requestOptions.method).toBe('GET');
		expect(requestOptions.url).toBe('/me');
	});

	it('sends POST body for write operations', async () => {
		await makeSnapchatRequest('/adaccounts/123/campaigns', 'token', {
			method: 'POST',
			body: { campaigns: [{ name: 'test' }] },
		});

		const [, requestOptions] = requestMock.mock.calls[0]!;
		expect(requestOptions.method).toBe('POST');
		expect(requestOptions.body).toEqual({ campaigns: [{ name: 'test' }] });
	});

	it('does not send body for GET requests', async () => {
		await makeSnapchatRequest('/me/organizations', 'token', {
			method: 'GET',
			body: { should: 'be ignored' },
		});

		const [, requestOptions] = requestMock.mock.calls[0]!;
		expect(requestOptions.body).toBeUndefined();
	});

	it('forwards query params', async () => {
		await makeSnapchatRequest('/targeting/carriers', 'token', {
			query: { country_code: 'US' },
		});

		const [, requestOptions] = requestMock.mock.calls[0]!;
		expect(requestOptions.query).toEqual({ country_code: 'US' });
	});

	it('uses override base URL when provided', async () => {
		await makeSnapchatRequest('/pixels/px_123/events/validate', 'token', {
			base: 'https://tr.snapchat.com/v2',
			method: 'POST',
			body: { events: [] },
		});

		const [config] = requestMock.mock.calls[0]!;
		expect(config.BASE).toBe('https://tr.snapchat.com/v2');
	});

	it('sets multipart content-type header when multipart=true', async () => {
		await makeSnapchatRequest('/media/media_123/upload', 'token', {
			method: 'POST',
			multipart: true,
			body: {},
		});

		const [config] = requestMock.mock.calls[0]!;
		expect(
			(config.HEADERS as Record<string, string>)['Content-Type'],
		).toBeUndefined();
	});

	it('forwards timeoutMs to OpenAPIConfig', async () => {
		await makeSnapchatRequest('/me', 'token', { timeoutMs: 5000 });
		const [config] = requestMock.mock.calls[0]!;
		expect(config.TIMEOUT).toBe(5000);
	});

	it('cancels request when abort signal is triggered', async () => {
		const cancel = jest.fn();
		const cancelable = Object.assign(Promise.resolve({ ok: true }), { cancel });
		requestMock.mockReturnValueOnce(
			cancelable as unknown as ReturnType<typeof request>,
		);

		const controller = new AbortController();
		const promise = makeSnapchatRequest('/me', 'token', {
			signal: controller.signal,
		});

		controller.abort();
		await promise;

		expect(cancel).toHaveBeenCalledTimes(1);
	});
});

describe('requireString', () => {
	it('returns a trimmed string when valid', () => {
		expect(requireString('  hello  ', 'name')).toBe('hello');
	});

	it('throws SnapchatAPIError when empty', () => {
		expect(() => requireString('   ', 'access_token')).toThrow(
			SnapchatAPIError,
		);
		expect(() => requireString('   ', 'access_token')).toThrow(
			'[snapchat] access_token is required',
		);
	});

	it('throws SnapchatAPIError when not a string', () => {
		expect(() => requireString(null, 'token')).toThrow(SnapchatAPIError);
	});
});
