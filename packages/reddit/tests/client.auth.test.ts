import { request } from 'corsair/http';
import { makeRedditRequest } from '../client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn().mockResolvedValue({}),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const configOf = () => mockRequest.mock.calls[0]![0];

beforeEach(() => mockRequest.mockClear());

describe('makeRedditRequest auth', () => {
	it('stays anonymous against www.reddit.com for api_key usage', async () => {
		await makeRedditRequest('/r/all.json', {
			token: 'ignored',
			authType: 'api_key',
		});
		const config = configOf();
		expect(config.BASE).toBe('https://www.reddit.com');
		expect(config.TOKEN).toBeUndefined();
	});

	it('uses oauth.reddit.com with a bearer token for oauth', async () => {
		await makeRedditRequest('/r/all.json', {
			token: 'token',
			authType: 'oauth_2',
		});
		const config = configOf();
		expect(config.BASE).toBe('https://oauth.reddit.com');
		expect(config.TOKEN).toBe('token');
	});

	it('uses oauth.reddit.com with a bearer token for managed', async () => {
		await makeRedditRequest('/r/all.json', {
			token: 'token',
			authType: 'managed',
		});
		expect(configOf().BASE).toBe('https://oauth.reddit.com');
		expect(configOf().TOKEN).toBe('token');
	});
});
