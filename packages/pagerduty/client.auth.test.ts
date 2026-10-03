import { request } from 'corsair/http';
import { makePagerdutyRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn().mockResolvedValue({}),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const authOf = () =>
	(mockRequest.mock.calls[0]![0].HEADERS as Record<string, string>)
		.Authorization;

beforeEach(() => mockRequest.mockClear());

describe('makePagerdutyRequest auth header', () => {
	it('sends api keys with the Token scheme', async () => {
		await makePagerdutyRequest('incidents', 'secret', { authType: 'api_key' });
		expect(authOf()).toBe('Token token=secret');
	});

	it('sends oauth tokens as a bearer token', async () => {
		await makePagerdutyRequest('incidents', 'token', { authType: 'oauth_2' });
		expect(authOf()).toBe('Bearer token');
	});

	it('sends managed tokens as a bearer token', async () => {
		await makePagerdutyRequest('incidents', 'token', { authType: 'managed' });
		expect(authOf()).toBe('Bearer token');
	});
});
