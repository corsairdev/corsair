// import * as dotenv from 'dotenv';
// import { ApiError } from '../async-core/ApiError';
// import type { ApiRequestOptions } from '../async-core/ApiRequestOptions';
// import type { OpenAPIConfig } from '../async-core/OpenAPI';
// import {
// 	DEFAULT_RATE_LIMIT_CONFIG,
// 	extractRateLimitInfo,
// } from '../async-core/rate-limit';
// import { request } from '../async-core/request';
// import { handleCorsairError } from '../core/errors/handler';
// import { errorHandlers } from '../plugins/slack/error-handlers';

// dotenv.config();

// const originalFetch = global.fetch;

// describe('Slack Rate Limit Integration Tests', () => {
// 	beforeEach(() => {
// 		jest.clearAllMocks();
// 		global.fetch = originalFetch;
// 	});

// 	afterEach(() => {
// 		global.fetch = originalFetch;
// 	});

// 	describe('Real-time rate limit header extraction', () => {
// 		it('should extract retry-after header from Slack 429 response (mocked fetch)', async () => {
// 			const mockRetryAfterSeconds = 60;
// 			const mockBody = JSON.stringify({
// 				ok: false,
// 				error: 'rate_limited',
// 			});

// 			global.fetch = jest.fn().mockImplementation(() => {
// 				return Promise.resolve(
// 					new Response(mockBody, {
// 						status: 429,
// 						statusText: 'Too Many Requests',
// 						headers: {
// 							'retry-after': String(mockRetryAfterSeconds),
// 							'content-type': 'application/json',
// 						},
// 					}),
// 				);
// 			});

// 			const config: OpenAPIConfig = {
// 				BASE: 'https://slack.com/api',
// 				VERSION: '1.0.0',
// 				WITH_CREDENTIALS: false,
// 				CREDENTIALS: 'omit',
// 				TOKEN: 'xoxb-test-token',
// 			};

// 			const requestOptions: ApiRequestOptions = {
// 				method: 'GET',
// 				url: 'conversations.list',
// 				query: { token: 'xoxb-test-token' },
// 			};

// 			let capturedError: ApiError | null = null;

// 			try {
// 				await request(config, requestOptions, {
// 					rateLimitConfig: {
// 						enabled: true,
// 						maxRetries: 0,
// 						initialRetryDelay: 1000,
// 						backoffMultiplier: 2,
// 						headerNames: {
// 							retryAfter: 'retry-after',
// 						},
// 					},
// 				});
// 			} catch (error) {
// 				capturedError = error as ApiError;
// 			}

// 			expect(capturedError).toBeInstanceOf(ApiError);
// 			expect(capturedError?.status).toBe(429);
// 			expect(capturedError?.retryAfter).toBe(mockRetryAfterSeconds * 1000);

// 			const result = await handleCorsairError(
// 				capturedError!,
// 				'slack',
// 				'conversations.list',
// 				{},
// 				errorHandlers,
// 			);

// 			expect(result.maxRetries).toBe(5);
// 			expect(result.headersRetryAfterMs).toBe(mockRetryAfterSeconds * 1000);
// 		});

// 		it('should verify extractRateLimitInfo extracts retry-after correctly', () => {
// 			const mockResponse = new Response(
// 				JSON.stringify({ ok: false, error: 'rate_limited' }),
// 				{
// 					status: 429,
// 					headers: {
// 						'retry-after': '45',
// 					},
// 				},
// 			);

// 			const rateLimitInfo = extractRateLimitInfo(
// 				mockResponse,
// 				DEFAULT_RATE_LIMIT_CONFIG,
// 			);

// 			expect(rateLimitInfo.retryAfter).toBe(45000);
// 		});

// 		it('should handle retry-after header in seconds (Slack format)', async () => {
// 			const testCases = [
// 				{ seconds: 1, expectedMs: 1000 },
// 				{ seconds: 30, expectedMs: 30000 },
// 				{ seconds: 60, expectedMs: 60000 },
// 				{ seconds: 120, expectedMs: 120000 },
// 			];

// 			for (const testCase of testCases) {
// 				const mockBody = JSON.stringify({
// 					ok: false,
// 					error: 'rate_limited',
// 				});

// 				global.fetch = jest.fn().mockImplementation(() => {
// 					return Promise.resolve(
// 						new Response(mockBody, {
// 							status: 429,
// 							statusText: 'Too Many Requests',
// 							headers: {
// 								'retry-after': String(testCase.seconds),
// 								'content-type': 'application/json',
// 							},
// 						}),
// 					);
// 				});

// 				const config: OpenAPIConfig = {
// 					BASE: 'https://slack.com/api',
// 					VERSION: '1.0.0',
// 					WITH_CREDENTIALS: false,
// 					CREDENTIALS: 'omit',
// 					TOKEN: 'xoxb-test-token',
// 				};

// 				const requestOptions: ApiRequestOptions = {
// 					method: 'GET',
// 					url: 'conversations.list',
// 					query: { token: 'xoxb-test-token' },
// 				};

// 				let capturedError: ApiError | null = null;

// 				try {
// 					await request(config, requestOptions, {
// 						rateLimitConfig: {
// 							enabled: true,
// 							maxRetries: 0,
// 							initialRetryDelay: 1000,
// 							backoffMultiplier: 2,
// 							headerNames: {
// 								retryAfter: 'retry-after',
// 							},
// 						},
// 					});
// 				} catch (error) {
// 					capturedError = error as ApiError;
// 				}

// 				expect(capturedError?.retryAfter).toBe(testCase.expectedMs);

// 				const result = await handleCorsairError(
// 					capturedError!,
// 					'slack',
// 					'conversations.list',
// 					{},
// 					errorHandlers,
// 				);

// 				expect(result.headersRetryAfterMs).toBe(testCase.expectedMs);
// 			}
// 		});

// 		it('should handle missing retry-after header gracefully', async () => {
// 			const mockBody = JSON.stringify({
// 				ok: false,
// 				error: 'rate_limited',
// 			});

// 			global.fetch = jest.fn().mockImplementation(() => {
// 				return Promise.resolve(
// 					new Response(mockBody, {
// 						status: 429,
// 						statusText: 'Too Many Requests',
// 						headers: {
// 							'content-type': 'application/json',
// 						},
// 					}),
// 				);
// 			});

// 			const config: OpenAPIConfig = {
// 				BASE: 'https://slack.com/api',
// 				VERSION: '1.0.0',
// 				WITH_CREDENTIALS: false,
// 				CREDENTIALS: 'omit',
// 				TOKEN: 'xoxb-test-token',
// 			};

// 			const requestOptions: ApiRequestOptions = {
// 				method: 'GET',
// 				url: 'conversations.list',
// 				query: { token: 'xoxb-test-token' },
// 			};

// 			let capturedError: ApiError | null = null;

// 			try {
// 				await request(config, requestOptions);
// 			} catch (error) {
// 				capturedError = error as ApiError;
// 			}

// 			expect(capturedError).toBeInstanceOf(ApiError);
// 			expect(capturedError?.status).toBe(429);
// 			expect(capturedError?.retryAfter).toBeUndefined();

// 			const result = await handleCorsairError(
// 				capturedError!,
// 				'slack',
// 				'conversations.list',
// 				{},
// 				errorHandlers,
// 			);

// 			expect(result.maxRetries).toBe(5);
// 			expect(result.headersRetryAfterMs).toBeUndefined();
// 		});

// 		it('should handle case-insensitive retry-after header', async () => {
// 			const mockBody = JSON.stringify({
// 				ok: false,
// 				error: 'rate_limited',
// 			});

// 			global.fetch = jest.fn().mockImplementation(() => {
// 				return Promise.resolve(
// 					new Response(mockBody, {
// 						status: 429,
// 						statusText: 'Too Many Requests',
// 						headers: {
// 							'Retry-After': '45',
// 							'content-type': 'application/json',
// 						},
// 					}),
// 				);
// 			});

// 			const config: OpenAPIConfig = {
// 				BASE: 'https://slack.com/api',
// 				VERSION: '1.0.0',
// 				WITH_CREDENTIALS: false,
// 				CREDENTIALS: 'omit',
// 				TOKEN: 'xoxb-test-token',
// 			};

// 			const requestOptions: ApiRequestOptions = {
// 				method: 'GET',
// 				url: 'conversations.list',
// 				query: { token: 'xoxb-test-token' },
// 			};

// 			let capturedError: ApiError | null = null;

// 			try {
// 				await request(config, requestOptions, {
// 					rateLimitConfig: {
// 						enabled: true,
// 						maxRetries: 0,
// 						initialRetryDelay: 1000,
// 						backoffMultiplier: 2,
// 						headerNames: {
// 							retryAfter: 'retry-after',
// 						},
// 					},
// 				});
// 			} catch (error) {
// 				capturedError = error as ApiError;
// 			}

// 			expect(capturedError?.retryAfter).toBe(45000);

// 			const result = await handleCorsairError(
// 				capturedError!,
// 				'slack',
// 				'conversations.list',
// 				{},
// 				errorHandlers,
// 			);

// 			expect(result.headersRetryAfterMs).toBe(45000);
// 		});

// 		it('should handle rate limit with retry-after header using intercepted fetch (simulated real API)', async () => {
// 			const mockRetryAfterSeconds = 2;
// 			let requestCount = 0;

// 			global.fetch = jest.fn().mockImplementation((url: string) => {
// 				requestCount++;
// 				if (requestCount <= 2) {
// 					return Promise.resolve(
// 						new Response(
// 							JSON.stringify({
// 								ok: false,
// 								error: 'rate_limited',
// 							}),
// 							{
// 								status: 429,
// 								statusText: 'Too Many Requests',
// 								headers: {
// 									'retry-after': String(mockRetryAfterSeconds),
// 									'content-type': 'application/json',
// 								},
// 							},
// 						),
// 					);
// 				}
// 				return Promise.resolve(
// 					new Response(
// 						JSON.stringify({
// 							ok: true,
// 							channels: [],
// 						}),
// 						{
// 							status: 200,
// 							headers: {
// 								'content-type': 'application/json',
// 							},
// 						},
// 					),
// 				);
// 			});

// 			const config: OpenAPIConfig = {
// 				BASE: 'https://slack.com/api',
// 				VERSION: '1.0.0',
// 				WITH_CREDENTIALS: false,
// 				CREDENTIALS: 'omit',
// 				TOKEN: 'xoxb-test-token',
// 			};

// 			const requestOptions: ApiRequestOptions = {
// 				method: 'GET',
// 				url: 'conversations.list',
// 				query: { token: 'xoxb-test-token' },
// 			};

// 			let capturedError: ApiError | null = null;

// 			try {
// 				await request(config, requestOptions, {
// 					rateLimitConfig: {
// 						enabled: true,
// 						maxRetries: 1,
// 						initialRetryDelay: 100,
// 						backoffMultiplier: 2,
// 						headerNames: {
// 							retryAfter: 'retry-after',
// 						},
// 					},
// 				});
// 			} catch (error) {
// 				capturedError = error as ApiError;
// 			}

// 			expect(capturedError).toBeInstanceOf(ApiError);
// 			expect(capturedError?.status).toBe(429);
// 			expect(capturedError?.retryAfter).toBe(mockRetryAfterSeconds * 1000);

// 			const result = await handleCorsairError(
// 				capturedError!,
// 				'slack',
// 				'conversations.list',
// 				{},
// 				errorHandlers,
// 			);

// 			expect(result.maxRetries).toBe(5);
// 			expect(result.headersRetryAfterMs).toBe(mockRetryAfterSeconds * 1000);

// 			expect(global.fetch).toHaveBeenCalled();
// 			expect(requestCount).toBeGreaterThan(1);
// 		}, 10000);
// 	});

// 	describe('Real Slack API integration (requires SLACK_BOT_TOKEN)', () => {
// 		const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

// 		beforeAll(() => {
// 			if (!SLACK_BOT_TOKEN) {
// 				console.warn(
// 					'SLACK_BOT_TOKEN not set. Skipping real API integration tests.',
// 				);
// 			} else {
// 				console.log('SLACK_BOT_TOKEN is configured');
// 			}
// 		});

// 		const testFn = SLACK_BOT_TOKEN ? it : it.skip;

// 		testFn(
// 			'should handle actual Slack rate limit response and verify retry-after header',
// 			async () => {
// 				if (!SLACK_BOT_TOKEN) {
// 					throw new Error('SLACK_BOT_TOKEN is required for this test');
// 				}

// 				const TEST_SLACK_CHANNEL =
// 					process.env.TEST_SLACK_CHANNEL || 'C0A3ZTB9X7X';

// 				if (!TEST_SLACK_CHANNEL) {
// 					throw new Error('TEST_SLACK_CHANNEL is required for this test');
// 				}

// 				const config: OpenAPIConfig = {
// 					BASE: 'https://slack.com/api',
// 					VERSION: '1.0.0',
// 					WITH_CREDENTIALS: false,
// 					CREDENTIALS: 'omit',
// 					TOKEN: SLACK_BOT_TOKEN,
// 				};

// 				console.log(
// 					'100% REAL TEST - No mocking, attempting to trigger actual Slack rate limits',
// 				);
// 				console.log(`Using chat.postMessage to channel ${TEST_SLACK_CHANNEL}`);
// 				console.log(
// 					'chat.postMessage has stricter rate limits than read endpoints...',
// 				);

// 				const requestsPerSecond = 20;
// 				const durationSeconds = 60;
// 				const totalRequests = requestsPerSecond * durationSeconds;

// 				console.log(
// 					`Sending ${totalRequests} messages over ${durationSeconds} seconds (${requestsPerSecond} msg/sec)...`,
// 				);
// 				console.log(
// 					'This should trigger rate limits as chat.postMessage is rate-limited per channel...',
// 				);

// 				const allRequests: Promise<any>[] = [];
// 				let requestCount = 0;
// 				const startTime = Date.now();

// 				for (let second = 0; second < durationSeconds; second++) {
// 					const secondStart = Date.now();

// 					for (let i = 0; i < requestsPerSecond; i++) {
// 						requestCount++;
// 						const messageText = `Rate limit test #${requestCount}`;

// 						allRequests.push(
// 							request(
// 								config,
// 								{
// 									method: 'POST',
// 									url: 'chat.postMessage',
// 									body: {
// 										token: SLACK_BOT_TOKEN,
// 										channel: TEST_SLACK_CHANNEL,
// 										text: messageText,
// 									},
// 									mediaType: 'application/json',
// 								},
// 								{
// 									rateLimitConfig: {
// 										enabled: true,
// 										maxRetries: 0,
// 										initialRetryDelay: 1000,
// 										backoffMultiplier: 2,
// 										headerNames: {
// 											retryAfter: 'retry-after',
// 										},
// 									},
// 								},
// 							).catch((error) => error),
// 						);
// 					}

// 					if ((second + 1) % 10 === 0) {
// 						console.log(
// 							`Sent ${requestCount} messages over ${second + 1} seconds...`,
// 						);
// 					}

// 					const secondElapsed = Date.now() - secondStart;
// 					if (secondElapsed < 1000 && second < durationSeconds - 1) {
// 						await new Promise((resolve) =>
// 							setTimeout(resolve, 1000 - secondElapsed),
// 						);
// 					}
// 				}

// 				console.log(
// 					`All ${requestCount} requests fired, waiting for responses...`,
// 				);
// 				const results = await Promise.all(allRequests);
// 				const endTime = Date.now();

// 				console.log(`All requests completed in ${endTime - startTime}ms`);

// 				const rateLimitErrors = results.filter(
// 					(error) => error instanceof ApiError && error.status === 429,
// 				) as ApiError[];

// 				const successCount = results.filter(
// 					(result) => !(result instanceof ApiError),
// 				).length;
// 				const otherErrors = results.filter(
// 					(error) => error instanceof ApiError && error.status !== 429,
// 				) as ApiError[];

// 				console.log(
// 					`Results: ${successCount} successful, ${rateLimitErrors.length} rate limit errors, ${otherErrors} other errors`,
// 				);

// 				if (rateLimitErrors.length > 0) {
// 					const firstRateLimitError = rateLimitErrors[0];
// 					if (!firstRateLimitError) {
// 						throw new Error('Expected rate limit error but got undefined');
// 					}

// 					console.log('🎉 REAL RATE LIMIT TRIGGERED!');
// 					console.log('Error status:', firstRateLimitError.status);
// 					console.log('Retry-After (ms):', firstRateLimitError.retryAfter);
// 					console.log(
// 						'Retry-After (seconds):',
// 						firstRateLimitError.retryAfter
// 							? firstRateLimitError.retryAfter / 1000
// 							: 'N/A',
// 					);

// 					expect(firstRateLimitError).toBeInstanceOf(ApiError);
// 					expect(firstRateLimitError.status).toBe(429);

// 					if (firstRateLimitError.retryAfter !== undefined) {
// 						expect(firstRateLimitError.retryAfter).toBeGreaterThan(0);
// 						expect(typeof firstRateLimitError.retryAfter).toBe('number');

// 						const result = await handleCorsairError(
// 							firstRateLimitError,
// 							'slack',
// 							'chat.postMessage',
// 							{},
// 							errorHandlers,
// 						);

// 						expect(result.maxRetries).toBe(5);
// 						expect(result.headersRetryAfterMs).toBe(
// 							firstRateLimitError.retryAfter,
// 						);

// 						console.log('✓ Retry-after header extraction verified');
// 						console.log('✓ Error handling verified');
// 						console.log('✓ All rate limit handling verified successfully!');
// 					} else {
// 						console.warn(
// 							'Rate limit error occurred but retry-after header was not extracted',
// 						);
// 						console.warn('This might indicate an issue with header extraction');
// 					}
// 				} else {
// 					console.warn(
// 						`Rate limit not triggered even with ${requestCount} requests over ${durationSeconds} seconds.`,
// 					);
// 					console.warn('Your Slack workspace has extremely high rate limits.');
// 					console.warn('Slack rate limits are typically:');
// 					console.warn('  - Tier 1: 1 request per minute');
// 					console.warn('  - Tier 2: 20 requests per minute');
// 					console.warn('  - Tier 3: 50+ requests per minute');
// 					console.warn('Your workspace appears to be on a very high tier.');
// 					console.warn('To test rate limits, you could:');
// 					console.warn(
// 						'1. Create a new Slack workspace (often starts with lower limits)',
// 					);
// 					console.warn(
// 						'2. Use a workspace that has been rate-limited recently',
// 					);
// 					console.warn('3. Contact Slack support about rate limit testing');
// 					console.warn(
// 						'4. The simulated test above verifies retry-after header functionality',
// 					);

// 					throw new Error(
// 						'Could not trigger real rate limits. Your workspace rate limits are too high for testing. ' +
// 							'Consider using the simulated test or a workspace with lower limits.',
// 					);
// 				}
// 			},
// 			300000,
// 		);
// 	});
// });
