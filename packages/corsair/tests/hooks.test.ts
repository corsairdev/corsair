import { slack } from '@corsair-dev/slack';
import { makeSlackRequest } from '@corsair-dev/slack/client';
import { createCorsair } from '../core';
import { createTestDatabase } from './setup-db';

jest.mock('@corsair-dev/slack/client', () => {
	const original = jest.requireActual('@corsair-dev/slack/client');
	return {
		...original,
		makeSlackRequest: jest.fn(),
	};
});

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

		mockedMakeSlackRequest.mockImplementation(
			async (
				endpoint: any /* MockedFunction callback; full Slack types not needed in test scope */,
				token: any /* MockedFunction callback; full Slack types not needed in test scope */,
				options: any /* MockedFunction callback; full Slack types not needed in test scope */,
			) => {
				if (options?.body) {
					capturedRequestBody = { ...options.body };
				}
				return {
					ok: true,
					channel: 'C123456',
					ts: '1234567890.123456',
					message: {
						text:
							(
								options?.body as any
							) /* MockedFunction callback; full Slack types not needed in test scope */
								?.text || '',
						user: 'U123456',
						type: 'message',
					},
				} as any /* MockedFunction callback; full Slack types not needed in test scope */;
			},
		);
	});

	afterEach(() => {
		testDb.cleanup();
	});

	describe('Before Hook', () => {
		it('should modify args in before hook and pass modified args to endpoint', async () => {
			const originalText = 'Original message';
			const modifiedText = 'Modified by before hook';

			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',
						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (args && typeof args === 'object' && 'text' in args) {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.text =
												modifiedText;
										}

										return { ctx, args };
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
				multiTenancy: false,
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
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',
						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (args && typeof args === 'object') {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.channel =
												modifiedChannel;
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.text =
												modifiedText;
										}

										return { ctx, args };
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
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
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (args && typeof args === 'object') {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.username =
												'custom-bot';
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.icon_emoji =
												':robot_face:';
										}

										return { args, ctx };
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
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

			mockedMakeSlackRequest.mockResolvedValueOnce(
				originalResponse as any /* MockedFunction callback; full Slack types not needed in test scope */,
			);

			let capturedResponse: any /* MockedFunction callback; full Slack types not needed in test scope */ =
				null;

			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									after: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										res: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (res && typeof res === 'object' && 'message' in res) {
											(
												res as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.message.text =
												'Modified by after hook';
											(
												res as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.customField =
												'added by hook';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Test message',
			});

			expect(result).not.toBeNull();
			if (result && typeof result === 'object' && 'message' in result) {
				expect(
					(
						result as any
					) /* MockedFunction callback; full Slack types not needed in test scope */
						.message.text,
				).toBe('Modified by after hook');
				expect(
					(
						result as any
					) /* MockedFunction callback; full Slack types not needed in test scope */
						.customField,
				).toBe('added by hook');
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

			mockedMakeSlackRequest.mockResolvedValueOnce(
				originalResponse as any /* MockedFunction callback; full Slack types not needed in test scope */,
			);

			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									after: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										res: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (res && typeof res === 'object') {
											(
												res as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.channel =
												'C999999';
											if ('message' in res && res.message) {
												(
													res.message as any
												) /* MockedFunction callback; full Slack types not needed in test scope */.text =
													'Modified text';
												(
													res.message as any
												) /* MockedFunction callback; full Slack types not needed in test scope */.user =
													'U999999';
											}
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Test message',
			});

			expect(result).not.toBeNull();
			if (result && typeof result === 'object') {
				expect(
					(
						result as any
					) /* MockedFunction callback; full Slack types not needed in test scope */
						.channel,
				).toBe('C999999');
				if ('message' in result && result.message) {
					expect(
						(
							result.message as any
						) /* MockedFunction callback; full Slack types not needed in test scope */
							.text,
					).toBe('Modified text');
					expect(
						(
							result.message as any
						) /* MockedFunction callback; full Slack types not needed in test scope */
							.user,
					).toBe('U999999');
				}
			}
		});
	});

	describe('Before and After Hooks Together', () => {
		it('should execute before hook, then endpoint, then after hook in correct order', async () => {
			const executionOrder: string[] = [];

			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										executionOrder.push('before');
										if (args && typeof args === 'object') {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.text =
												'Modified by before hook';
										}

										return { ctx, args };
									},
									after: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										res: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										executionOrder.push('after');
										if (res && typeof res === 'object') {
											(
												res as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.executionOrder =
												executionOrder.slice();
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			mockedMakeSlackRequest.mockImplementation(
				async (
					endpoint: any /* MockedFunction callback; full Slack types not needed in test scope */,
					token: any /* MockedFunction callback; full Slack types not needed in test scope */,
					options: any /* MockedFunction callback; full Slack types not needed in test scope */,
				) => {
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
					} as any /* MockedFunction callback; full Slack types not needed in test scope */;
				},
			);

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original message',
			});

			expect(executionOrder).toEqual(['before', 'endpoint', 'after']);
			expect(capturedRequestBody?.text).toBe('Modified by before hook');
		});

		it('should allow both hooks to modify their respective data', async () => {
			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (args && typeof args === 'object') {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.text =
												'Before hook modified';
										}

										return { ctx, args };
									},
									after: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										res: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (res && typeof res === 'object' && 'message' in res) {
											(
												res as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.message.text =
												'After hook modified';
										}
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			const result = await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original',
			});

			expect(capturedRequestBody?.text).toBe('Before hook modified');
			if (result && typeof result === 'object' && 'message' in result) {
				expect(
					(
						result as any
					) /* MockedFunction callback; full Slack types not needed in test scope */
						.message.text,
				).toBe('After hook modified');
			}
		});
	});

	describe('Nested Endpoint Hooks', () => {
		it('should work with nested endpoint paths', async () => {
			const corsair = createCorsair({
				kek: '',
				plugins: [
					slack({
						authType: 'api_key',
						key: 'fake-key',

						hooks: {
							messages: {
								post: {
									before: async (
										ctx: any /* MockedFunction callback; full Slack types not needed in test scope */,
										args: any /* MockedFunction callback; full Slack types not needed in test scope */,
									) => {
										if (args && typeof args === 'object') {
											(
												args as any
											) /* MockedFunction callback; full Slack types not needed in test scope */.text =
												'Nested hook modified';
										}

										return { ctx, args };
									},
								},
							},
						},
					}),
				],
				database: testDb.db,
			});

			await corsair.slack.api.messages.post({
				channel: 'C123456',
				text: 'Original',
			});

			expect(capturedRequestBody?.text).toBe('Nested hook modified');
		});
	});
});
