import { ApiError } from 'corsair/http';
import { makeBonsaiRequest } from './client';
import { Clusters } from './endpoints/clusters';
import { Spaces } from './endpoints/spaces';

jest.mock('corsair/http', () => ({
	request: jest.fn(),
	ApiError: class extends Error {
		constructor(
			request: any,
			response: any,
			message: string,
			rateLimitInfo?: any,
		) {
			super(message);
			this.name = 'ApiError';
			this.url = response.url;
			this.status = response.status;
			this.statusText = response.statusText;
			this.body = response.body;
			this.request = request;
			this.retryAfter = rateLimitInfo?.retryAfter;
		}
		url: string;
		status: number;
		statusText: string;
		body: any;
		request: any;
		retryAfter?: number;
	},
}));

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

describe('Bonsai Endpoints - Behavioral Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('clusters.get', () => {
		it('should make GET request to /clusters/:slug with correct credentials', async () => {
			const mockResponse = {
				cluster: {
					slug: 'test-cluster',
					name: 'Test Cluster',
					uri: 'https://api.bonsai.io/clusters/test-cluster',
					plan: {
						slug: 'sandbox-aws-us-east-1',
						uri: 'https://api.bonsai.io/plans/sandbox-aws-us-east-1',
					},
					release: {
						version: '7.2.0',
						slug: 'elasticsearch-7.2.0',
						package_name: '7.2.0',
						service_type: 'elasticsearch',
						uri: 'https://api.bonsai.io/releases/elasticsearch-7.2.0',
					},
					space: {
						path: 'omc/bonsai/us-east-1/common',
						region: 'aws-us-east-1',
						uri: 'https://api.bonsai.io/spaces/omc/bonsai/us-east-1/common',
					},
					stats: {
						docs: 0,
						shards_used: 0,
						data_bytes_used: 0,
					},
					access: {
						host: 'test-cluster.us-east-1.bonsaisearch.net',
						port: 443,
						scheme: 'https',
					},
					state: 'PROVISIONED',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'test-key', apiSecret: 'test-secret' }),
			} as never;

			const result = await Clusters.get(mockCtx, { slug: 'test-cluster' });

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const callArgs = mockRequest.mock.calls[0];
			expect(callArgs).toBeDefined();
			expect(callArgs![0]).toMatchObject({
				BASE: 'https://api.bonsai.io',
				USERNAME: 'test-key',
				PASSWORD: 'test-secret',
			});
			expect(callArgs![1]).toMatchObject({
				method: 'GET',
				url: '/clusters/test-cluster',
			});
			expect(result).toEqual(mockResponse);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				mockCtx,
				'bonsai.clusters.get',
				{ slug: 'test-cluster' },
				'completed',
			);
		});

		it('should map response to correct schema', async () => {
			const mockResponse = {
				cluster: {
					slug: 'my-cluster',
					name: 'My Cluster',
					uri: 'https://api.bonsai.io/clusters/my-cluster',
					plan: {
						slug: 'sandbox-aws-eu-west-1',
						uri: 'https://api.bonsai.io/plans/sandbox-aws-eu-west-1',
					},
					release: {
						version: '7.10.0',
						slug: 'elasticsearch-7.10.0',
						package_name: '7.10.0',
						service_type: 'elasticsearch',
						uri: 'https://api.bonsai.io/releases/elasticsearch-7.10.0',
					},
					space: {
						path: 'omc/bonsai/eu-west-1/common',
						region: 'aws-eu-west-1',
						uri: 'https://api.bonsai.io/spaces/omc/bonsai/eu-west-1/common',
					},
					stats: {
						docs: 100,
						shards_used: 5,
						data_bytes_used: 1024000,
					},
					access: {
						host: 'my-cluster.eu-west-1.bonsaisearch.net',
						port: 443,
						scheme: 'https',
					},
					state: 'PROVISIONING',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const result = await Clusters.get(mockCtx, { slug: 'my-cluster' });

			expect(result.cluster.slug).toBe('my-cluster');
			expect(result.cluster.name).toBe('My Cluster');
			expect(result.cluster.plan.slug).toBe('sandbox-aws-eu-west-1');
			expect(result.cluster.space.region).toBe('aws-eu-west-1');
			expect(result.cluster.state).toBe('PROVISIONING');
			expect(result.cluster.stats.docs).toBe(100);
		});

		it('rejects an empty cluster slug before calling the API', async () => {
			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			await expect(Clusters.get(mockCtx, { slug: '' })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('rejects a cluster payload that fails the output schema', async () => {
			mockRequest.mockResolvedValue({ cluster: { slug: 'incomplete' } });
			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			await expect(
				Clusters.get(mockCtx, { slug: 'incomplete' }),
			).rejects.toThrow();
		});

		it('should handle API errors with preserved status and retry metadata', async () => {
			const errorRequest = {
				method: 'GET' as const,
				url: '/clusters/test-cluster',
			};
			const errorResponse = {
				url: '/clusters/test-cluster',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { error: 'rate_limited' },
			};
			const apiError = new ApiError(
				errorRequest,
				errorResponse,
				'Rate limit exceeded',
				{ retryAfter: 60 },
			);
			mockRequest.mockRejectedValue(apiError);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const error = await Clusters.get(mockCtx, { slug: 'test-cluster' }).catch(
				(e) => e,
			);
			expect(error.name).toBe('BonsaiAPIError');
			expect(error.status).toBe(429);
			expect(error.statusText).toBe('Too Many Requests');
			expect(error.body).toEqual({ error: 'rate_limited' });
			expect(error.retryAfter).toBe(60);
			expect(error.message).toBe('Rate limit exceeded');
		});
	});

	describe('spaces.list', () => {
		it('should make GET request to /spaces with correct credentials', async () => {
			const mockResponse = {
				spaces: [
					{
						path: 'omc/bonsai/us-east-1/common',
						private_network: false,
						cloud: {
							provider: 'aws',
							region: 'aws-us-east-1',
						},
					},
					{
						path: 'omc/bonsai/eu-west-1/common',
						private_network: false,
						cloud: {
							provider: 'aws',
							region: 'aws-eu-west-1',
						},
					},
				],
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'test-key', apiSecret: 'test-secret' }),
			} as never;

			const result = await Spaces.list(mockCtx, {});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const callArgs = mockRequest.mock.calls[0];
			expect(callArgs).toBeDefined();
			expect(callArgs![0]).toMatchObject({
				BASE: 'https://api.bonsai.io',
				USERNAME: 'test-key',
				PASSWORD: 'test-secret',
			});
			expect(callArgs![1]).toMatchObject({
				method: 'GET',
				url: '/spaces',
			});
			expect(result).toEqual(mockResponse);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				mockCtx,
				'bonsai.spaces.list',
				{},
				'completed',
			);
		});

		it('should map response to correct schema', async () => {
			const mockResponse = {
				spaces: [
					{
						path: 'omc/bonsai/ap-southeast-2/common',
						private_network: false,
						cloud: {
							provider: 'aws',
							region: 'aws-ap-southeast-2',
						},
					},
				],
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const result = await Spaces.list(mockCtx, {});

			expect(Array.isArray(result.spaces)).toBe(true);
			expect(result.spaces).toHaveLength(1);
			expect(result.spaces[0]).toBeDefined();
			expect(result.spaces[0]!.path).toBe('omc/bonsai/ap-southeast-2/common');
			expect(result.spaces[0]!.private_network).toBe(false);
			expect(result.spaces[0]!.cloud.provider).toBe('aws');
			expect(result.spaces[0]!.cloud.region).toBe('aws-ap-southeast-2');
		});

		it('should handle empty spaces list', async () => {
			const mockResponse = { spaces: [] };
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const result = await Spaces.list(mockCtx, {});

			expect(result.spaces).toEqual([]);
			expect(Array.isArray(result.spaces)).toBe(true);
		});
	});

	describe('spaces.get', () => {
		it('should make GET request to /spaces/:path with correct credentials', async () => {
			const mockResponse = {
				path: 'omc/bonsai/us-east-1/common',
				private_network: false,
				cloud: {
					provider: 'aws',
					region: 'aws-us-east-1',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'test-key', apiSecret: 'test-secret' }),
			} as never;

			const result = await Spaces.get(mockCtx, { path: 'my-space' });

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const callArgs = mockRequest.mock.calls[0];
			expect(callArgs).toBeDefined();
			expect(callArgs![0]).toMatchObject({
				BASE: 'https://api.bonsai.io',
				USERNAME: 'test-key',
				PASSWORD: 'test-secret',
			});
			expect(callArgs![1]).toMatchObject({
				method: 'GET',
				url: '/spaces/my-space',
			});
			expect(result).toEqual(mockResponse);
			expect(mockLogEventFromContext).toHaveBeenCalledWith(
				mockCtx,
				'bonsai.spaces.get',
				{ path: 'my-space' },
				'completed',
			);
		});

		it('keeps slashes in a documented space path', async () => {
			const mockResponse = {
				path: 'omc/bonsai/us-east-1/common',
				private_network: false,
				cloud: {
					provider: 'aws',
					region: 'aws-us-east-1',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);
			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			await Spaces.get(mockCtx, { path: 'omc/bonsai/us-east-1/common' });

			expect(mockRequest).toHaveBeenCalledWith(
				expect.anything(),
				expect.objectContaining({
					method: 'GET',
					url: '/spaces/omc/bonsai/us-east-1/common',
				}),
			);
		});

		it('rejects an empty space path before calling the API', async () => {
			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			await expect(Spaces.get(mockCtx, { path: '' })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('should map response to correct schema', async () => {
			const mockResponse = {
				path: 'omc/bonsai/eu-west-1/common',
				private_network: false,
				cloud: {
					provider: 'aws',
					region: 'aws-eu-west-1',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const result = await Spaces.get(mockCtx, { path: 'production' });

			expect(result.path).toBe('omc/bonsai/eu-west-1/common');
			expect(result.private_network).toBe(false);
			expect(result.cloud.provider).toBe('aws');
			expect(result.cloud.region).toBe('aws-eu-west-1');
		});

		it('should handle space without description', async () => {
			const mockResponse = {
				path: 'omc/bonsai/us-west-2/common',
				private_network: true,
				cloud: {
					provider: 'aws',
					region: 'aws-us-west-2',
				},
			};
			mockRequest.mockResolvedValue(mockResponse);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const result = await Spaces.get(mockCtx, { path: 'test-space' });

			expect(result.path).toBe('omc/bonsai/us-west-2/common');
			expect(result.private_network).toBe(true);
			expect(result.cloud.provider).toBe('aws');
			expect(result.cloud.region).toBe('aws-us-west-2');
		});

		it('should handle 404 errors for non-existent spaces', async () => {
			const errorRequest = {
				method: 'GET' as const,
				url: '/spaces/non-existent',
			};
			const errorResponse = {
				url: '/spaces/non-existent',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { error: 'not_found' },
			};
			const apiError = new ApiError(
				errorRequest,
				errorResponse,
				'Space not found',
			);
			mockRequest.mockRejectedValue(apiError);

			const mockCtx = {
				key: JSON.stringify({ apiKey: 'key', apiSecret: 'secret' }),
			} as never;

			const error = await Spaces.get(mockCtx, { path: 'non-existent' }).catch(
				(e) => e,
			);
			expect(error.name).toBe('BonsaiAPIError');
			expect(error.status).toBe(404);
			expect(error.statusText).toBe('Not Found');
			expect(error.message).toBe('Space not found');
		});
	});

	describe('makeBonsaiRequest - credential handling', () => {
		it('should parse JSON credentials string', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({
				apiKey: 'key123',
				apiSecret: 'secret456',
			});
			await makeBonsaiRequest('/test', credentials, { method: 'GET' });

			const callArgs = mockRequest.mock.calls[0];
			expect(callArgs).toBeDefined();
			expect(callArgs![0].USERNAME).toBe('key123');
			expect(callArgs![0].PASSWORD).toBe('secret456');
		});

		it('should reject plain API key (no fallback)', async () => {
			mockRequest.mockResolvedValue({});

			await expect(
				makeBonsaiRequest('/test', 'plain-key', { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject empty api_key or api_secret', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({ apiKey: '', apiSecret: 'secret' });
			await expect(
				makeBonsaiRequest('/test', credentials, { method: 'GET' }),
			).rejects.toThrow('API key and secret must not be empty');

			const credentials2 = JSON.stringify({ apiKey: 'key', apiSecret: '' });
			await expect(
				makeBonsaiRequest('/test', credentials2, { method: 'GET' }),
			).rejects.toThrow('API key and secret must not be empty');
		});

		it('should reject null credentials', async () => {
			mockRequest.mockResolvedValue({});

			await expect(
				makeBonsaiRequest('/test', 'null', { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject array credentials', async () => {
			mockRequest.mockResolvedValue({});

			await expect(
				makeBonsaiRequest('/test', '[]', { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject primitive string credentials', async () => {
			mockRequest.mockResolvedValue({});

			await expect(
				makeBonsaiRequest('/test', '"just-a-string"', { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject number credentials', async () => {
			mockRequest.mockResolvedValue({});

			await expect(
				makeBonsaiRequest('/test', '123', { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject credentials missing apiKey', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({ apiSecret: 'secret' });
			await expect(
				makeBonsaiRequest('/test', credentials, { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject credentials missing apiSecret', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({ apiKey: 'key' });
			await expect(
				makeBonsaiRequest('/test', credentials, { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject non-string apiKey', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({ apiKey: 123, apiSecret: 'secret' });
			await expect(
				makeBonsaiRequest('/test', credentials, { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});

		it('should reject non-string apiSecret', async () => {
			mockRequest.mockResolvedValue({});

			const credentials = JSON.stringify({ apiKey: 'key', apiSecret: 456 });
			await expect(
				makeBonsaiRequest('/test', credentials, { method: 'GET' }),
			).rejects.toThrow(
				'Invalid Bonsai credentials: both api_key and api_secret are required',
			);
		});
	});
});
