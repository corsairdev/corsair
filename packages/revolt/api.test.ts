/**
 * Live tests against a real Stoat (Revolt) instance. CI skips this file by name,
 * and it skips itself without a bot token. Every call goes through the plugin's
 * client and its output schema.
 *
 * Env: REVOLT_BOT_TOKEN, REVOLT_SERVER_ID and REVOLT_CHANNEL_ID (a server and
 * channel the bot is in). REVOLT_BASE_URL targets a self-hosted instance.
 * REVOLT_SESSION_TOKEN (the server owner's session) adds the channel edit and
 * delete round trip, which a bot without ManageChannel cannot run.
 *
 * Run with `pnpm --filter @corsair-dev/revolt test:live`.
 */

import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { REVOLT_API_BASE } from './client';
import { revolt } from './index';

const botToken = process.env.REVOLT_BOT_TOKEN;
const sessionToken = process.env.REVOLT_SESSION_TOKEN;
const baseUrl = process.env.REVOLT_BASE_URL ?? REVOLT_API_BASE;
const serverId = process.env.REVOLT_SERVER_ID ?? '';
const channelId = process.env.REVOLT_CHANNEL_ID ?? '';

const describeIfKey =
	botToken && serverId && channelId ? describe : describe.skip;

if (botToken && !(serverId && channelId)) {
	// A token means a live run was asked for; without the ids it would skip
	// every check and still finish green.
	throw new Error(
		'REVOLT_BOT_TOKEN is set but REVOLT_SERVER_ID or REVOLT_CHANNEL_ID is not: the live Revolt suite needs all three.',
	);
}

if (!botToken) {
	// A skipped run must not read as a green one.
	console.warn(
		'REVOLT_BOT_TOKEN is not set: the live Revolt suite is skipped, not passing.',
	);
}

async function client(credential: 'bot' | 'user', key: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'revolt', 'default');
	const corsair = createCorsair({
		plugins: [revolt({ key, credential, base_url: baseUrl })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { api: corsair.revolt.api, cleanup: () => testDb.cleanup() };
}

describeIfKey('live Revolt API', () => {
	let bot: Awaited<ReturnType<typeof client>>;
	let messageId = '';

	beforeAll(async () => {
		bot = await client('bot', botToken ?? '');
	});

	afterAll(() => bot.cleanup());

	it('users.me reads the bot behind the token', async () => {
		const result = await bot.api.users.me({});
		expect(result.user._id).toBeTruthy();
		expect(result.user.bot?.owner).toBeTruthy();
	});

	it('users.get reads a user by id', async () => {
		const me = await bot.api.users.me({});
		const result = await bot.api.users.get({ user_id: me.user._id ?? '' });
		expect(result.user.username).toBe(me.user.username);
	});

	it('users.dms lists the DM channels', async () => {
		const result = await bot.api.users.dms({});
		expect(Array.isArray(result.channels)).toBe(true);
	});

	it('channels.get reads a server channel', async () => {
		const result = await bot.api.channels.get({ channel_id: channelId });
		expect(result.channel._id).toBe(channelId);
		expect(result.channel.channel_type).toBe('TextChannel');
	});

	it('servers.get reads the server with channel ids, then objects', async () => {
		const ids = await bot.api.servers.get({ server_id: serverId });
		expect(ids.server.channels).toContain(channelId);

		const objects = await bot.api.servers.get({
			server_id: serverId,
			include_channels: true,
		});
		expect(objects.server.channels?.[0]).toMatchObject({ server: serverId });
	});

	it('servers.members lists members with their composite ids', async () => {
		const result = await bot.api.servers.members({ server_id: serverId });
		expect(result.members.length).toBeGreaterThan(0);
		expect(result.members[0]?._id?.server).toBe(serverId);
		expect(result.users.length).toBe(result.members.length);
	});

	it('messages.send posts a message', async () => {
		const result = await bot.api.messages.send({
			channel_id: channelId,
			content: 'corsair-plugin-test',
		});
		messageId = result.message._id ?? '';
		expect(messageId).toBeTruthy();
		expect(result.message.member?._id?.server).toBe(serverId);
	});

	it('messages.send replies to it, mention left out', async () => {
		const result = await bot.api.messages.send({
			channel_id: channelId,
			content: 'corsair-plugin-test reply',
			replies: [{ id: messageId }],
		});
		expect(result.message.replies).toEqual([messageId]);
		await bot.api.messages.delete({
			channel_id: channelId,
			message_id: result.message._id ?? '',
		});
	});

	it('messages.list returns messages with their authors', async () => {
		const result = await bot.api.messages.list({
			channel_id: channelId,
			limit: 5,
		});
		expect(result.messages.some((m) => m._id === messageId)).toBe(true);
		expect(result.users?.length).toBeGreaterThan(0);
	});

	it('messages.list reads the bare array without include_users', async () => {
		const result = await bot.api.messages.list({
			channel_id: channelId,
			limit: 5,
			include_users: false,
		});
		expect(result.messages.length).toBeGreaterThan(0);
		expect(result.users).toBeUndefined();
	});

	it('messages.get reads the message', async () => {
		const result = await bot.api.messages.get({
			channel_id: channelId,
			message_id: messageId,
		});
		expect(result.message.content).toBe('corsair-plugin-test');
	});

	it('messages.edit replaces the content', async () => {
		const result = await bot.api.messages.edit({
			channel_id: channelId,
			message_id: messageId,
			content: 'corsair-plugin-test edited',
		});
		expect(result.message.content).toBe('corsair-plugin-test edited');
		expect(result.message.edited).toBeTruthy();
	});

	it('reactions.add puts a reaction on the message', async () => {
		const result = await bot.api.reactions.add({
			channel_id: channelId,
			message_id: messageId,
			emoji: '👍',
		});
		expect(result.success).toBe(true);
		const read = await bot.api.messages.get({
			channel_id: channelId,
			message_id: messageId,
		});
		expect(Object.keys(read.message.reactions ?? {})).toContain('👍');
	});

	it('messages.delete removes the message', async () => {
		const result = await bot.api.messages.delete({
			channel_id: channelId,
			message_id: messageId,
		});
		expect(result.success).toBe(true);
		await expect(
			bot.api.messages.get({ channel_id: channelId, message_id: messageId }),
		).rejects.toThrow('Revolt 404: NotFound');
	});

	it('channels.edit without ManageChannel names the missing permission', async () => {
		await expect(
			bot.api.channels.edit({
				channel_id: channelId,
				description: 'corsair-plugin-test',
			}),
		).rejects.toThrow(
			'Revolt 403: MissingPermission (permission: ManageChannel)',
		);
	});

	const itIfSession = sessionToken ? it : it.skip;

	itIfSession(
		'channels.edit and channels.delete round trip as the owner',
		async () => {
			// The plugin has no channel create, so the test channel is made here.
			const created = await fetch(`${baseUrl}/servers/${serverId}/channels`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Session-Token': sessionToken ?? '',
				},
				body: JSON.stringify({ name: 'corsair-plugin-test' }),
			});
			const { _id: newChannel } = (await created.json()) as { _id: string };

			const owner = await client('user', sessionToken ?? '');
			let removed = false;
			try {
				const edited = await owner.api.channels.edit({
					channel_id: newChannel,
					name: 'corsair-plugin-test-2',
					description: 'corsair-plugin-test',
				});
				expect(edited.channel.name).toBe('corsair-plugin-test-2');
				expect(edited.channel.description).toBe('corsair-plugin-test');

				const deleted = await owner.api.channels.delete({
					channel_id: newChannel,
				});
				expect(deleted.success).toBe(true);
				removed = true;
				await expect(
					owner.api.channels.get({ channel_id: newChannel }),
				).rejects.toThrow('Revolt 404');
			} finally {
				// Leave no test channel behind when an edit or assertion failed;
				// a cleanup error must not hide the original failure.
				if (!removed) {
					await owner.api.channels
						.delete({ channel_id: newChannel })
						.catch(() => undefined);
				}
				owner.cleanup();
			}
		},
	);
});
