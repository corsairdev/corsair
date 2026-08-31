import { request } from 'corsair/http';
import { makeDropboxSignRequest } from './client';

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockedRequest = request as jest.MockedFunction<typeof request>;

describe('makeDropboxSignRequest', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({ account: { account_id: 'a' } });
	});

	it('uses Basic auth and does not set TOKEN for API keys', async () => {
		await makeDropboxSignRequest('account', 'test_key', { method: 'GET' });
		const [config, options] = mockedRequest.mock.calls[0] ?? [];
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toMatchObject({
			Authorization: `Basic ${Buffer.from('test_key:').toString('base64')}`,
		});
		expect(options).toMatchObject({
			method: 'GET',
			url: '/account',
		});
	});

	it('uses Bearer auth for oauth_2', async () => {
		await makeDropboxSignRequest('account', {
			key: 'tok',
			authType: 'oauth_2',
		});
		const [config] = mockedRequest.mock.calls[0] ?? [];
		expect(config?.HEADERS).toMatchObject({
			Authorization: 'Bearer tok',
		});
	});

	it('sends JSON on POST and omits mediaType for FormData', async () => {
		await makeDropboxSignRequest('account', 'k', {
			method: 'POST',
			body: { locale: 'en-US' },
		});
		expect(mockedRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'POST',
			mediaType: 'application/json; charset=utf-8',
			body: { locale: 'en-US' },
		});

		const form = new FormData();
		form.append('title', 'x');
		await makeDropboxSignRequest('signature_request/send', 'k', {
			method: 'POST',
			body: form,
		});
		expect(mockedRequest.mock.calls[1]?.[1]?.mediaType).toBeUndefined();
		expect(mockedRequest.mock.calls[1]?.[1]?.body).toBe(form);
	});
});
