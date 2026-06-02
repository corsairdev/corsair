import 'dotenv/config';
import { makeDiscordRequest } from './client';
import type {
	Channel,
	DiscordUser,
	Guild,
	GuildMember,
	Message,
	PartialGuild,
	SuccessResponse,
} from './endpoints/types';
import { DiscordEndpointOutputSchemas } from './endpoints/types';

const TEST_TOKEN = process.env.DISCORD_BOT_TOKEN!;

describe('Discord API Type Tests', () => {
	let testGuildId: string;
	let testChannelId: string;

	beforeAll(async () => {
		const guildsListResponse = await makeDiscordRequest<PartialGuild[]>(
			'users/@me/guilds',
			TEST_TOKEN,
			{ query: { limit: 1 } },
		);
		const guildId = guildsListResponse[0]?.id;
		if (!guildId) {
			throw new Error('No guilds found');
		}
		testGuildId = guildId;

		const channelsListResponse = await makeDiscordRequest<Channel[]>(
			`guilds/${testGuildId}/channels`,
			TEST_TOKEN,
		);
		const channelId = channelsListResponse.find((ch) => ch.type === 0)?.id;
		if (!channelId) {
			throw new Error('No text channels found');
		}
		testChannelId = channelId;
	});
	describe('guilds', () => {
		it('guildsList returns correct type', async () => {
			const response = await makeDiscordRequest<PartialGuild[]>(
				'users/@me/guilds',
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			DiscordEndpointOutputSchemas.guildsList.parse(result);
		});

		it('guildsGet returns correct type', async () => {
			const response = await makeDiscordRequest<Guild>(
				`guilds/${testGuildId}`,
				TEST_TOKEN,
			);
			const result = response;

			DiscordEndpointOutputSchemas.guildsGet.parse(result);
		});
	});

	describe('channels', () => {
		it('channelsList returns correct type', async () => {
			const response = await makeDiscordRequest<Channel[]>(
				`guilds/${testGuildId}/channels`,
				TEST_TOKEN,
			);
			const result = response;

			DiscordEndpointOutputSchemas.channelsList.parse(result);
		});
	});

	describe('members', () => {
		it('membersList returns correct type', async () => {
			const response = await makeDiscordRequest<GuildMember[]>(
				`guilds/${testGuildId}/members`,
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			DiscordEndpointOutputSchemas.membersList.parse(result);
		});

		it('membersGet returns correct type', async () => {
			const membersListResponse = await makeDiscordRequest<GuildMember[]>(
				`guilds/${testGuildId}/members`,
				TEST_TOKEN,
				{ query: { limit: 1 } },
			);
			const userId = membersListResponse[0]?.user?.id;
			if (!userId) {
				throw new Error('No members found');
			}

			const response = await makeDiscordRequest<GuildMember>(
				`guilds/${testGuildId}/members/${userId}`,
				TEST_TOKEN,
			);
			const result = response;

			DiscordEndpointOutputSchemas.membersGet.parse(result);
		});
	});

	describe('messages', () => {
		let testMessageId: string | undefined;

		it('messagesSend returns correct type', async () => {
			const response = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						content: `Test message from API test - ${Date.now()}`,
					},
				},
			);
			const result = response;

			if (result.id) {
				testMessageId = result.id;
			}

			DiscordEndpointOutputSchemas.messagesSend.parse(result);
		});

		it('messagesGet returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for get',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			const response = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages/${testMessageId}`,
				TEST_TOKEN,
			);
			const result = response;

			DiscordEndpointOutputSchemas.messagesGet.parse(result);
		});

		it('messagesList returns correct type', async () => {
			const response = await makeDiscordRequest<Message[]>(
				`channels/${testChannelId}/messages`,
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			DiscordEndpointOutputSchemas.messagesList.parse(result);
		});

		it('messagesReply returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for reply',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			const response = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						content: 'Test reply from API test',
						message_reference: {
							type: 0,
							message_id: testMessageId,
							channel_id: testChannelId,
							fail_if_not_exists: true,
						},
					},
				},
			);
			const result = response;

			DiscordEndpointOutputSchemas.messagesReply.parse(result);
		});

		it('messagesEdit returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for edit',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			const response = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages/${testMessageId}`,
				TEST_TOKEN,
				{
					method: 'PATCH',
					body: {
						content: 'Updated message from API test',
					},
				},
			);
			const result = response;

			DiscordEndpointOutputSchemas.messagesEdit.parse(result);
		});

		it('messagesDelete returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for delete',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			await makeDiscordRequest<void>(
				`channels/${testChannelId}/messages/${testMessageId}`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);

			const result: SuccessResponse = { success: true };

			DiscordEndpointOutputSchemas.messagesDelete.parse(result);
		});
	});

	describe('threads', () => {
		let testMessageId: string | undefined;

		beforeAll(async () => {
			const sendResponse = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						content: 'Test message for thread creation',
					},
				},
			);
			if (sendResponse.id) {
				testMessageId = sendResponse.id;
			}
		});

		it('threadsCreate returns correct type', async () => {
			const response = await makeDiscordRequest<Channel>(
				`channels/${testChannelId}/threads`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `test-thread-${Date.now()}`,
						auto_archive_duration: 60,
					},
				},
			);
			const result = response;

			DiscordEndpointOutputSchemas.threadsCreate.parse(result);
		});

		it('threadsCreateFromMessage returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for thread from message',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			const response = await makeDiscordRequest<Channel>(
				`channels/${testChannelId}/messages/${testMessageId}/threads`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						name: `test-thread-from-message-${Date.now()}`,
						auto_archive_duration: 60,
					},
				},
			);
			const result = response;

			DiscordEndpointOutputSchemas.threadsCreateFromMessage.parse(result);
		});
	});

	describe('reactions', () => {
		let testMessageId: string | undefined;

		beforeAll(async () => {
			const sendResponse = await makeDiscordRequest<Message>(
				`channels/${testChannelId}/messages`,
				TEST_TOKEN,
				{
					method: 'POST',
					body: {
						content: 'Test message for reactions',
					},
				},
			);
			if (sendResponse.id) {
				testMessageId = sendResponse.id;
			}
		});

		it('reactionsAdd returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for adding reaction',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			await makeDiscordRequest<void>(
				`channels/${testChannelId}/messages/${testMessageId}/reactions/👍/@me`,
				TEST_TOKEN,
				{ method: 'PUT' },
			);

			const result: SuccessResponse = { success: true };

			DiscordEndpointOutputSchemas.reactionsAdd.parse(result);
		});

		it('reactionsList returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for listing reactions',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			const response = await makeDiscordRequest<DiscordUser[]>(
				`channels/${testChannelId}/messages/${testMessageId}/reactions/👍`,
				TEST_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			DiscordEndpointOutputSchemas.reactionsList.parse(result);
		});

		it('reactionsRemove returns correct type', async () => {
			if (!testMessageId) {
				const sendResponse = await makeDiscordRequest<Message>(
					`channels/${testChannelId}/messages`,
					TEST_TOKEN,
					{
						method: 'POST',
						body: {
							content: 'Test message for removing reaction',
						},
					},
				);
				if (!sendResponse.id) {
					throw new Error('Failed to create test message');
				}
				testMessageId = sendResponse.id;
			}

			await makeDiscordRequest<void>(
				`channels/${testChannelId}/messages/${testMessageId}/reactions/👍/@me`,
				TEST_TOKEN,
				{ method: 'PUT' },
			);

			await makeDiscordRequest<void>(
				`channels/${testChannelId}/messages/${testMessageId}/reactions/👍/@me`,
				TEST_TOKEN,
				{ method: 'DELETE' },
			);

			const result: SuccessResponse = { success: true };

			DiscordEndpointOutputSchemas.reactionsRemove.parse(result);
		});
	});
});
