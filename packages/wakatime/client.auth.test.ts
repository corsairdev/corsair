import { request } from 'corsair/http';
import { makeWakaTimeRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn().mockResolvedValue({}),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const authOf = () =>
	(mockRequest.mock.calls[0]![0].HEADERS as Record<string, string>)
		.Authorization;

beforeEach(() => mockRequest.mockClear());

describe('makeWakaTimeRequest auth header', () => {
	it('sends api keys via the Base64 Basic scheme', async () => {
		await makeWakaTimeRequest('users/current', 'secret', {
			authType: 'api_key',
		});
		expect(authOf()).toBe(`Basic ${Buffer.from('secret').toString('base64')}`);
	});

	it('sends oauth tokens as a bearer token', async () => {
		await makeWakaTimeRequest('users/current', 'token', {
			authType: 'oauth_2',
		});
		expect(authOf()).toBe('Bearer token');
	});

	it('sends managed tokens as a bearer token', async () => {
		await makeWakaTimeRequest('users/current', 'token', {
			authType: 'managed',
		});
		expect(authOf()).toBe('Bearer token');
	});
});
