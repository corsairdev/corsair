import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { makeRocketlaneRequest, ROCKETLANE_API_BASE } from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function lastCall(): [OpenAPIConfig, ApiRequestOptions] {
	const call = mockRequest.mock.calls.at(-1);
	if (!call) throw new Error('request() was never called');
	return call as unknown as [OpenAPIConfig, ApiRequestOptions];
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('makeRocketlaneRequest', () => {
	it('uses the documented API origin and api-key header', async () => {
		mockRequest.mockResolvedValue({});

		await makeRocketlaneRequest('1.0/projects', 'secret-api-key');

		const [config] = lastCall();
		expect(config.BASE).toBe(ROCKETLANE_API_BASE);
		expect(config.HEADERS).toMatchObject({ 'api-key': 'secret-api-key' });
		expect(config.HEADERS).not.toHaveProperty('Authorization');
	});

	it('forwards page-token queries and JSON bodies without changing wire names', async () => {
		mockRequest.mockResolvedValue({});

		await makeRocketlaneRequest('1.0/projects/42', 'key', {
			method: 'PUT',
			query: { includeAllFields: true },
			body: { projectName: 'Apollo' },
		});

		const [, options] = lastCall();
		expect(options).toMatchObject({
			method: 'PUT',
			url: '1.0/projects/42',
			query: { includeAllFields: true },
			body: { projectName: 'Apollo' },
		});
	});

	it('preserves provider errors for Corsair error handlers', async () => {
		const providerError = new Error('rate limited');
		mockRequest.mockRejectedValue(providerError);

		await expect(makeRocketlaneRequest('1.0/projects', 'key')).rejects.toBe(
			providerError,
		);
	});
});
