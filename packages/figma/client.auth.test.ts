import { request } from 'corsair/http';
import { makeFigmaRequest } from './client';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn().mockResolvedValue({}),
}));

const mockRequest = request as jest.MockedFunction<typeof request>;

const configOf = () => mockRequest.mock.calls[0]![0];

beforeEach(() => mockRequest.mockClear());

describe('makeFigmaRequest auth header', () => {
	it('sends api keys via X-Figma-Token', async () => {
		await makeFigmaRequest('v1/me', 'secret', { authType: 'api_key' });
		const config = configOf();
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS).toMatchObject({ 'X-Figma-Token': 'secret' });
	});

	it('sends oauth tokens as a bearer token', async () => {
		await makeFigmaRequest('v1/me', 'token', { authType: 'oauth_2' });
		const config = configOf();
		expect(config.TOKEN).toBe('token');
		expect(config.HEADERS).not.toHaveProperty('X-Figma-Token');
	});

	it('sends managed tokens as a bearer token', async () => {
		await makeFigmaRequest('v1/me', 'token', { authType: 'managed' });
		expect(configOf().TOKEN).toBe('token');
	});
});
