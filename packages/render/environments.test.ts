import type { ApiRequestOptions, OpenAPIConfig } from 'corsair/http';
import { request } from 'corsair/http';
import { removeResourcesFromEnvironment } from './endpoints/environments';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

describe('Render environment operations', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('forwards selected resource IDs in the environment removal DELETE query', async () => {
		mockRequest.mockResolvedValue({});

		await removeResourcesFromEnvironment({ key: 'secret' } as never, {
			environmentId: 'env-1',
			resourceIds: ['srv-1', 'pg-1'],
		});

		const call = mockRequest.mock.calls.at(-1);
		if (!call) throw new Error('request() was never called');
		const [, options] = call as unknown as [OpenAPIConfig, ApiRequestOptions];

		expect(options).toMatchObject({
			method: 'DELETE',
			url: '/v1/environments/env-1/resources',
			query: { resourceIds: ['srv-1', 'pg-1'] },
		});
	});
});
