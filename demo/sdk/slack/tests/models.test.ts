import {
	ChannelSchema,
	ChatPostMessageArgsSchema,
	ChatUpdateArgsSchema,
	ConversationsArchiveArgsSchema,
	ConversationsCreateArgsSchema,
	ConversationsHistoryArgsSchema,
	ConversationsListArgsSchema,
	FilesInfoArgsSchema,
	FilesListArgsSchema,
	MessageSchema,
	ReactionsAddArgsSchema,
	SlackResponseSchema,
	StarsAddArgsSchema,
	UsergroupsCreateArgsSchema,
	UserSchema,
	UsersInfoArgsSchema,
	UsersListArgsSchema,
} from '../models';

describe('Zod Schema Validation - Request Arguments', () => {
	describe('ConversationsArchiveArgsSchema', () => {
		it('should validate valid archive args', () => {
			const validArgs = { channel: 'C0123456789' };
			const result = ConversationsArchiveArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should reject missing channel', () => {
			const invalidArgs = {};
			const result = ConversationsArchiveArgsSchema.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});

		it('should accept optional token', () => {
			const validArgs = { channel: 'C0123456789', token: 'xoxb-token' };
			const result = ConversationsArchiveArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('ConversationsCreateArgsSchema', () => {
		it('should validate valid create args', () => {
			const validArgs = { name: 'my-channel' };
			const result = ConversationsCreateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept optional is_private', () => {
			const validArgs = { name: 'my-channel', is_private: true };
			const result = ConversationsCreateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept optional team_id', () => {
			const validArgs = { name: 'my-channel', team_id: 'T0123456789' };
			const result = ConversationsCreateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should reject missing name', () => {
			const invalidArgs = { is_private: true };
			const result = ConversationsCreateArgsSchema.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});
	});

	describe('ConversationsHistoryArgsSchema', () => {
		it('should validate valid history args', () => {
			const validArgs = { channel: 'C0123456789' };
			const result = ConversationsHistoryArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept pagination params', () => {
			const validArgs = {
				channel: 'C0123456789',
				cursor: 'dGVhbTpDMDYxRkE1UEI=',
				limit: 100,
				latest: '1234567890.123456',
				oldest: '1234567890.000000',
			};
			const result = ConversationsHistoryArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('ConversationsListArgsSchema', () => {
		it('should validate empty args', () => {
			const validArgs = {};
			const result = ConversationsListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept all optional params', () => {
			const validArgs = {
				exclude_archived: true,
				types: 'public_channel,private_channel',
				cursor: 'dGVhbTpDMDYxRkE1UEI=',
				limit: 50,
			};
			const result = ConversationsListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('ChatPostMessageArgsSchema', () => {
		it('should validate message with text', () => {
			const validArgs = { channel: 'C0123456789', text: 'Hello, world!' };
			const result = ChatPostMessageArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should validate message with blocks', () => {
			const validArgs = {
				channel: 'C0123456789',
				blocks: [{ type: 'section', block_id: 'section1' }],
			};
			const result = ChatPostMessageArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept thread_ts for replies', () => {
			const validArgs = {
				channel: 'C0123456789',
				text: 'Reply',
				thread_ts: '1234567890.123456',
			};
			const result = ChatPostMessageArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept metadata', () => {
			const validArgs = {
				channel: 'C0123456789',
				text: 'Hello',
				metadata: {
					event_type: 'test_event',
					event_payload: { key: 'value' },
				},
			};
			const result = ChatPostMessageArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should reject missing channel', () => {
			const invalidArgs = { text: 'Hello' };
			const result = ChatPostMessageArgsSchema.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});
	});

	describe('ChatUpdateArgsSchema', () => {
		it('should validate update args', () => {
			const validArgs = {
				channel: 'C0123456789',
				ts: '1234567890.123456',
				text: 'Updated message',
			};
			const result = ChatUpdateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should reject missing ts', () => {
			const invalidArgs = { channel: 'C0123456789', text: 'Hello' };
			const result = ChatUpdateArgsSchema.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});
	});

	describe('UsersInfoArgsSchema', () => {
		it('should validate user info args', () => {
			const validArgs = { user: 'U0123456789' };
			const result = UsersInfoArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept include_locale', () => {
			const validArgs = { user: 'U0123456789', include_locale: true };
			const result = UsersInfoArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('UsersListArgsSchema', () => {
		it('should validate empty args', () => {
			const validArgs = {};
			const result = UsersListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept pagination params', () => {
			const validArgs = { cursor: 'abc', limit: 100 };
			const result = UsersListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('UsergroupsCreateArgsSchema', () => {
		it('should validate usergroup create args', () => {
			const validArgs = { name: 'My Usergroup' };
			const result = UsergroupsCreateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept optional params', () => {
			const validArgs = {
				name: 'My Usergroup',
				handle: 'my-usergroup',
				description: 'A test usergroup',
				channels: 'C0123456789,C9876543210',
			};
			const result = UsergroupsCreateArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('FilesInfoArgsSchema', () => {
		it('should validate file info args', () => {
			const validArgs = { file: 'F0123456789' };
			const result = FilesInfoArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('FilesListArgsSchema', () => {
		it('should validate empty args', () => {
			const validArgs = {};
			const result = FilesListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should accept filter params', () => {
			const validArgs = {
				channel: 'C0123456789',
				user: 'U0123456789',
				types: 'images,pdfs',
			};
			const result = FilesListArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});

	describe('ReactionsAddArgsSchema', () => {
		it('should validate reaction add args', () => {
			const validArgs = {
				channel: 'C0123456789',
				timestamp: '1234567890.123456',
				name: 'thumbsup',
			};
			const result = ReactionsAddArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should reject missing name', () => {
			const invalidArgs = {
				channel: 'C0123456789',
				timestamp: '1234567890.123456',
			};
			const result = ReactionsAddArgsSchema.safeParse(invalidArgs);
			expect(result.success).toBe(false);
		});
	});

	describe('StarsAddArgsSchema', () => {
		it('should validate star add args with channel', () => {
			const validArgs = {
				channel: 'C0123456789',
				timestamp: '1234567890.123456',
			};
			const result = StarsAddArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});

		it('should validate star add args with file', () => {
			const validArgs = { file: 'F0123456789' };
			const result = StarsAddArgsSchema.safeParse(validArgs);
			expect(result.success).toBe(true);
		});
	});
});

describe('Zod Schema Validation - Response Objects', () => {
	describe('ChannelSchema', () => {
		it('should validate channel object', () => {
			const validChannel = {
				id: 'C0123456789',
				name: 'general',
				is_channel: true,
				is_private: false,
				created: 1234567890,
			};
			const result = ChannelSchema.safeParse(validChannel);
			expect(result.success).toBe(true);
		});

		it('should validate minimal channel', () => {
			const minimalChannel = { id: 'C0123456789' };
			const result = ChannelSchema.safeParse(minimalChannel);
			expect(result.success).toBe(true);
		});

		it('should allow extra properties', () => {
			const channelWithExtra = {
				id: 'C0123456789',
				custom_field: 'value',
			};
			const result = ChannelSchema.safeParse(channelWithExtra);
			expect(result.success).toBe(true);
		});
	});

	describe('UserSchema', () => {
		it('should validate user object', () => {
			const validUser = {
				id: 'U0123456789',
				name: 'john.doe',
				real_name: 'John Doe',
				is_admin: false,
				is_bot: false,
			};
			const result = UserSchema.safeParse(validUser);
			expect(result.success).toBe(true);
		});

		it('should validate user with profile', () => {
			const userWithProfile = {
				id: 'U0123456789',
				name: 'john.doe',
				profile: {
					real_name: 'John Doe',
					email: 'john@example.com',
					display_name: 'John',
				},
			};
			const result = UserSchema.safeParse(userWithProfile);
			expect(result.success).toBe(true);
		});
	});

	describe('MessageSchema', () => {
		it('should validate message object', () => {
			const validMessage = {
				type: 'message',
				text: 'Hello, world!',
				ts: '1234567890.123456',
				user: 'U0123456789',
			};
			const result = MessageSchema.safeParse(validMessage);
			expect(result.success).toBe(true);
		});

		it('should validate threaded message', () => {
			const threadedMessage = {
				type: 'message',
				text: 'Hello',
				ts: '1234567890.123456',
				thread_ts: '1234567890.000000',
				reply_count: 5,
				reply_users: ['U1', 'U2'],
			};
			const result = MessageSchema.safeParse(threadedMessage);
			expect(result.success).toBe(true);
		});

		it('should validate message with reactions', () => {
			const messageWithReactions = {
				type: 'message',
				text: 'Great!',
				ts: '1234567890.123456',
				reactions: [{ name: 'thumbsup', count: 3, users: ['U1', 'U2', 'U3'] }],
			};
			const result = MessageSchema.safeParse(messageWithReactions);
			expect(result.success).toBe(true);
		});
	});

	describe('SlackResponseSchema', () => {
		it('should validate successful response', () => {
			const successResponse = { ok: true };
			const result = SlackResponseSchema.safeParse(successResponse);
			expect(result.success).toBe(true);
		});

		it('should validate error response', () => {
			const errorResponse = {
				ok: false,
				error: 'channel_not_found',
			};
			const result = SlackResponseSchema.safeParse(errorResponse);
			expect(result.success).toBe(true);
		});

		it('should validate response with metadata', () => {
			const responseWithMeta = {
				ok: true,
				response_metadata: {
					next_cursor: 'dGVhbTpDMDYxRkE1UEI=',
				},
			};
			const result = SlackResponseSchema.safeParse(responseWithMeta);
			expect(result.success).toBe(true);
		});
	});
});
