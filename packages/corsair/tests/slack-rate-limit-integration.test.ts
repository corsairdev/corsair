import { ApiError } from '../async-core/ApiError';
import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
import type { ApiResult } from '../async-core/ApiResult';
import { request } from '../async-core/request';
import type { OpenAPIConfig } from '../async-core/OpenAPI';
import { makeSlackRequest } from '../plugins/slack/client';
import { errorHandlers } from '../plugins/slack/error-handlers';
import { handleCorsairError } from '../core/errors/handler';
import { extractRateLimitInfo, DEFAULT_RATE_LIMIT_CONFIG } from '../async-core/rate-limit';

const originalFetch = global.fetch;

describe('Slack Rate Limit Integration Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		global.fetch = originalFetch;
	});

	afterEach(() => {
		global.fetch = originalFetch;
	});

	describe('Real-time rate limit header extraction', () => {
		it('should extract retry-after header from Slack 429 response (mocked fetch)', async () => {
			const mockRetryAfterSeconds = 60;
			const mockBody = JSON.stringify({
				ok: false,
				error: 'rate_limited',
			});

			global.fetch = jest.fn().mockImplementation(() => {
				return Promise.resolve(
					new Response(mockBody, {
						status: 429,
						statusText: 'Too Many Requests',
						headers: {
							'retry-after': String(mockRetryAfterSeconds),
							'content-type': 'application/json',
						},
					}),
				);
			});

			const config: OpenAPIConfig = {
				BASE: 'https://slack.com/api',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TOKEN: 'xoxb-test-token',
			};

			const requestOptions: ApiRequestOptions = {
				method: 'GET',
				url: 'conversations.list',
				query: { token: 'xoxb-test-token' },
			};

			let capturedError: ApiError | null = null;

			try {
				await request(config, requestOptions, {
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 1000,
						backoffMultiplier: 2,
						headerNames: {
							retryAfter: 'retry-after',
						},
					},
				});
			} catch (error) {
				capturedError = error as ApiError;
			}

			expect(capturedError).toBeInstanceOf(ApiError);
			expect(capturedError?.status).toBe(429);
			expect(capturedError?.retryAfter).toBe(mockRetryAfterSeconds * 1000);

			const result = await handleCorsairError(
				capturedError!,
				'slack',
				'conversations.list',
				{},
				errorHandlers,
			);

			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(mockRetryAfterSeconds * 1000);
		});

		it('should verify extractRateLimitInfo extracts retry-after correctly', () => {
			const mockResponse = new Response(
				JSON.stringify({ ok: false, error: 'rate_limited' }),
				{
					status: 429,
					headers: {
						'retry-after': '45',
					},
				},
			);

			const rateLimitInfo = extractRateLimitInfo(
				mockResponse,
				DEFAULT_RATE_LIMIT_CONFIG,
			);

			expect(rateLimitInfo.retryAfter).toBe(45000);
		});

		it('should handle retry-after header in seconds (Slack format)', async () => {
			const testCases = [
				{ seconds: 1, expectedMs: 1000 },
				{ seconds: 30, expectedMs: 30000 },
				{ seconds: 60, expectedMs: 60000 },
				{ seconds: 120, expectedMs: 120000 },
			];

			for (const testCase of testCases) {
				const mockBody = JSON.stringify({
					ok: false,
					error: 'rate_limited',
				});

				global.fetch = jest.fn().mockImplementation(() => {
					return Promise.resolve(
						new Response(mockBody, {
							status: 429,
							statusText: 'Too Many Requests',
							headers: {
								'retry-after': String(testCase.seconds),
								'content-type': 'application/json',
							},
						}),
					);
				});

				const config: OpenAPIConfig = {
					BASE: 'https://slack.com/api',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					TOKEN: 'xoxb-test-token',
				};

				const requestOptions: ApiRequestOptions = {
					method: 'GET',
					url: 'conversations.list',
					query: { token: 'xoxb-test-token' },
				};

				let capturedError: ApiError | null = null;

				try {
					await request(config, requestOptions, {
						rateLimitConfig: {
							enabled: true,
							maxRetries: 0,
							initialRetryDelay: 1000,
							backoffMultiplier: 2,
							headerNames: {
								retryAfter: 'retry-after',
							},
						},
					});
				} catch (error) {
					capturedError = error as ApiError;
				}

				expect(capturedError?.retryAfter).toBe(testCase.expectedMs);

				const result = await handleCorsairError(
					capturedError!,
					'slack',
					'conversations.list',
					{},
					errorHandlers,
				);

				expect(result.headersRetryAfterMs).toBe(testCase.expectedMs);
			}
		});

		it('should handle missing retry-after header gracefully', async () => {
			const mockBody = JSON.stringify({
				ok: false,
				error: 'rate_limited',
			});

			global.fetch = jest.fn().mockImplementation(() => {
				return Promise.resolve(
					new Response(mockBody, {
						status: 429,
						statusText: 'Too Many Requests',
						headers: {
							'content-type': 'application/json',
						},
					}),
				);
			});

			const config: OpenAPIConfig = {
				BASE: 'https://slack.com/api',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TOKEN: 'xoxb-test-token',
			};

			const requestOptions: ApiRequestOptions = {
				method: 'GET',
				url: 'conversations.list',
				query: { token: 'xoxb-test-token' },
			};

			let capturedError: ApiError | null = null;

			try {
				await request(config, requestOptions);
			} catch (error) {
				capturedError = error as ApiError;
			}

			expect(capturedError).toBeInstanceOf(ApiError);
			expect(capturedError?.status).toBe(429);
			expect(capturedError?.retryAfter).toBeUndefined();

			const result = await handleCorsairError(
				capturedError!,
				'slack',
				'conversations.list',
				{},
				errorHandlers,
			);

			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBeUndefined();
		});

		it('should handle case-insensitive retry-after header', async () => {
			const mockBody = JSON.stringify({
				ok: false,
				error: 'rate_limited',
			});

			global.fetch = jest.fn().mockImplementation(() => {
				return Promise.resolve(
					new Response(mockBody, {
						status: 429,
						statusText: 'Too Many Requests',
						headers: {
							'Retry-After': '45',
							'content-type': 'application/json',
						},
					}),
				);
			});

			const config: OpenAPIConfig = {
				BASE: 'https://slack.com/api',
				VERSION: '1.0.0',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit',
				TOKEN: 'xoxb-test-token',
			};

			const requestOptions: ApiRequestOptions = {
				method: 'GET',
				url: 'conversations.list',
				query: { token: 'xoxb-test-token' },
			};

			let capturedError: ApiError | null = null;

			try {
				await request(config, requestOptions, {
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 1000,
						backoffMultiplier: 2,
						headerNames: {
							retryAfter: 'retry-after',
						},
					},
				});
			} catch (error) {
				capturedError = error as ApiError;
			}

			expect(capturedError?.retryAfter).toBe(45000);

			const result = await handleCorsairError(
				capturedError!,
				'slack',
				'conversations.list',
				{},
				errorHandlers,
			);

			expect(result.headersRetryAfterMs).toBe(45000);
		});
	});

	describe('Real Slack API integration (requires SLACK_BOT_TOKEN)', () => {
        const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
        console.log('SLACK_BOT_TOKEN', SLACK_BOT_TOKEN);

		beforeAll(() => {
			if (!SLACK_BOT_TOKEN) {
				console.warn(
					'SLACK_BOT_TOKEN not set. Skipping real API integration tests.',
				);
			}
		});

		const testFn = SLACK_BOT_TOKEN
			? it
			: it.skip;

		testFn('should handle actual Slack rate limit response', async () => {
				const config: OpenAPIConfig = {
					BASE: 'https://slack.com/api',
					VERSION: '1.0.0',
					WITH_CREDENTIALS: false,
					CREDENTIALS: 'omit',
					TOKEN: SLACK_BOT_TOKEN,
				};

				const requestOptions: ApiRequestOptions = {
					method: 'GET',
					url: 'conversations.list',
					query: { token: SLACK_BOT_TOKEN },
				};

				const requests: Promise<any>[] = [];

				for (let i = 0; i < 1000; i++) {
					requests.push(
						request(config, requestOptions).catch((error) => error),
					);
				}

				const results = await Promise.all(requests);

				const rateLimitErrors = results.filter(
					(error) => error instanceof ApiError && error.status === 429,
                ) as ApiError[];
            
                console.log('rateLimitErrors', rateLimitErrors);

				if (rateLimitErrors.length > 0) {
					const firstRateLimitError = rateLimitErrors[0];
					if (!firstRateLimitError) {
						throw new Error('Expected rate limit error but got undefined');
					}

					console.log('Rate limit triggered!');
					console.log('Retry-After (ms):', firstRateLimitError.retryAfter);
					console.log('Retry-After (seconds):', firstRateLimitError.retryAfter ? firstRateLimitError.retryAfter / 1000 : 'N/A');

					expect(firstRateLimitError).toBeInstanceOf(ApiError);
					expect(firstRateLimitError.status).toBe(429);

					if (firstRateLimitError.retryAfter !== undefined) {
						expect(firstRateLimitError.retryAfter).toBeGreaterThan(0);
						expect(typeof firstRateLimitError.retryAfter).toBe('number');

						const result = await handleCorsairError(
							firstRateLimitError,
							'slack',
							'conversations.list',
							{},
							errorHandlers,
						);

						expect(result.maxRetries).toBe(5);
						expect(result.headersRetryAfterMs).toBe(
							firstRateLimitError.retryAfter,
						);
					}
				} else {
					console.log('Rate limit not triggered in this test run');
					console.log('Note: This test requires triggering a rate limit to verify header extraction');
				}
			},
			60000,
		);
	});
});
