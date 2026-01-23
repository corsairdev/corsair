import { createCorsair } from '../core';
import { slack } from '../plugins/slack';
import { createTestDatabase } from './setup-db';
import { makeSlackRequest } from '../plugins/slack/client';

jest.mock('../plugins/slack/client', () => ({
	makeSlackRequest: jest.fn(),
}));

const mockedMakeSlackRequest = makeSlackRequest as jest.MockedFunction<
	typeof makeSlackRequest
>;

describe('Endpoint Hooks', () => {
	let testDb: ReturnType<typeof createTestDatabase>;
	let capturedRequestBody: Record<string, unknown> | null = null;

	beforeEach(() => {
		testDb = createTestDatabase();
		capturedRequestBody = null;
		jest.clearAllMocks();

		mockedMakeSlackRequest.mockImplementation(async (endpoint, token, options) => {
			if (options?.body) {
				capturedRequestBody = { ...options.body };
			}
			return {
				ok: true,
				channel: 'C123456',
				ts: '1234567890.123456',
				message: {
					text: (options?.body as any)?.text || '',
					user: 'U123456',
					type: 'message',
				},
			} as any;
		});
	});

	afterEach(() => {
		testDb.cleanup();
	});

	describe('Before Hook', () => {
		it('should modify args in before hook and pass modified args to endpoint', async () => {
			const originalText = 'Original message';
			const modifiedText = 'Modified by before hook';

			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										if (args && typeof args === 'object' && 'text' in args) {
											(args as any).text = modifiedText;
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: originalText,
			});

			expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(1);
			expect(capturedRequestBody).not.toBeNull();
			expect(capturedRequestBody?.text).toBe(modifiedText);
			expect(capturedRequestBody?.text).not.toBe(originalText);
		});

		it('should modify multiple args in before hook', async () => {
			const originalChannel = 'C123456';
			const originalText = 'Original message';
			const modifiedChannel = 'C999999';
			const modifiedText = 'Modified text';

			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										if (args && typeof args === 'object') {
											(args as any).channel = modifiedChannel;
											(args as any).text = modifiedText;
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			await corsair.slack.api.messages.post({
				channel: originalChannel,
				text: originalText,
			});

			expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(1);
			expect(capturedRequestBody).not.toBeNull();
			expect(capturedRequestBody?.channel).toBe(modifiedChannel);
			expect(capturedRequestBody?.text).toBe(modifiedText);
			expect(capturedRequestBody?.channel).not.toBe(originalChannel);
			expect(capturedRequestBody?.text).not.toBe(originalText);
		});

		it('should allow before hook to add new properties to args', async () => {
			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										if (args && typeof args === 'object') {
											(args as any).username = 'custom-bot';
											(args as any).icon_emoji = ':robot_face:';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Test message',
			});

			expect(mockedMakeSlackRequest).toHaveBeenCalledTimes(1);
			expect(capturedRequestBody).not.toBeNull();
			expect(capturedRequestBody?.username).toBe('custom-bot');
			expect(capturedRequestBody?.icon_emoji).toBe(':robot_face:');
		});
	});

	describe('After Hook', () => {
		it('should modify response in after hook', async () => {
			const originalResponse = {
				ok: true,
				channel: 'C123456',
				ts: '1234567890.123456',
				message: {
					text: 'Original response',
					user: 'U123456',
					type: 'message',
				},
			};

			mockedMakeSlackRequest.mockResolvedValueOnce(originalResponse as any);

			let capturedResponse: any = null;

			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									after: async (ctx, res) => {
										if (res && typeof res === 'object' && 'message' in res) {
											(res as any).message.text = 'Modified by after hook';
											(res as any).customField = 'added by hook';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Test message',
			});

			expect(result).not.toBeNull();
			if (result && typeof result === 'object' && 'message' in result) {
				expect((result as any).message.text).toBe('Modified by after hook');
				expect((result as any).customField).toBe('added by hook');
			}
		});

		it('should allow after hook to modify multiple response properties', async () => {
			const originalResponse = {
				ok: true,
				channel: 'C123456',
				ts: '1234567890.123456',
				message: {
					text: 'Original',
					user: 'U123456',
					type: 'message',
				},
			};

			mockedMakeSlackRequest.mockResolvedValueOnce(originalResponse as any);

			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									after: async (ctx, res) => {
										if (res && typeof res === 'object') {
											(res as any).channel = 'C999999';
											if ('message' in res && res.message) {
												(res.message as any).text = 'Modified text';
												(res.message as any).user = 'U999999';
											}
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Test message',
			});

			expect(result).not.toBeNull();
			if (result && typeof result === 'object') {
				expect((result as any).channel).toBe('C999999');
				if ('message' in result && result.message) {
					expect((result.message as any).text).toBe('Modified text');
					expect((result.message as any).user).toBe('U999999');
				}
			}
		});
	});

	describe('Before and After Hooks Together', () => {
		it('should execute before hook, then endpoint, then after hook in correct order', async () => {
			const executionOrder: string[] = [];

			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										executionOrder.push('before');
										if (args && typeof args === 'object') {
											(args as any).text = 'Modified by before hook';
										}
									},
									after: async (ctx, res) => {
										executionOrder.push('after');
										if (res && typeof res === 'object') {
											(res as any).executionOrder = executionOrder.slice();
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			mockedMakeSlackRequest.mockImplementation(async (endpoint, token, options) => {
				executionOrder.push('endpoint');
				if (options?.body) {
					capturedRequestBody = { ...options.body };
				}
				return {
					ok: true,
					channel: 'C123456',
					ts: '1234567890.123456',
					message: {
						text: 'Response',
						user: 'U123456',
						type: 'message',
					},
				} as any;
			});

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original message',
			});

			expect(executionOrder).toEqual(['before', 'endpoint', 'after']);
			expect(capturedRequestBody?.text).toBe('Modified by before hook');
		});

		it('should allow both hooks to modify their respective data', async () => {
			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										if (args && typeof args === 'object') {
											(args as any).text = 'Before hook modified';
										}
									},
									after: async (ctx, res) => {
										if (res && typeof res === 'object' && 'message' in res) {
											(res as any).message.text = 'After hook modified';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original',
			});

			expect(capturedRequestBody?.text).toBe('Before hook modified');
			if (result && typeof result === 'object' && 'message' in result) {
				expect((result as any).message.text).toBe('After hook modified');
			}
		});
	});

	describe('Nested Endpoint Hooks', () => {
		it('should work with nested endpoint paths', async () => {
			const corsair = createCorsair({
				plugins: [
					slack({
						authType: 'bot_token',
						credentials: {
							botToken: 'xoxb-test-token',
						},
						hooks: {
							messages: {
								post: {
									before: async (ctx, args) => {
										if (args && typeof args === 'object') {
											(args as any).text = 'Nested hook modified';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.adapter,
			});

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original',
			});

			expect(capturedRequestBody?.text).toBe('Nested hook modified');
		});
	});
});
