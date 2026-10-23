import * as Messages from './endpoints/messages';
import {
	ActionRowSchema,
	AllowedMentionsSchema,
	AutoSelectComponentSchema,
	ButtonComponentSchema,
	ButtonStyle,
	DiscordEndpointInputSchemas,
	DiscordEndpointOutputSchemas,
	MessageComponentsSchema,
	StringSelectComponentSchema,
} from './endpoints/types';

const linkRow = {
	type: 1 as const,
	components: [
		{
			type: 2 as const,
			style: ButtonStyle.Link,
			label: 'Post on X',
			url: 'https://x.com/intent/post?text=hi',
		},
	],
};

const sentMessage = {
	id: '1',
	channel_id: 'C1',
	author: {
		id: 'B1',
		username: 'Corsair',
		discriminator: '0',
		global_name: null,
		avatar: null,
		bot: true,
	},
	content: '',
	timestamp: '2026-10-23T00:00:00.000Z',
	edited_timestamp: null,
	tts: false,
	mention_everyone: false,
	mentions: [],
	mention_roles: [],
	attachments: [],
	embeds: [],
	pinned: false,
	type: 0,
	components: [
		{ type: 1, components: [{ type: 2, style: 5, url: 'https://x.com' }] },
	],
};

describe('message components and allowed mentions: schemas', () => {
	it('accepts link buttons, interactive buttons and allowed_mentions on send', () => {
		const parsed = DiscordEndpointInputSchemas.messagesSend.parse({
			channel_id: 'C1',
			content: '<@123> shipped it',
			components: [
				linkRow,
				{
					type: 1,
					components: [
						{
							type: 2,
							style: ButtonStyle.Primary,
							label: 'Claim',
							custom_id: 'claim:coassemble',
						},
						{
							type: 2,
							style: ButtonStyle.Secondary,
							label: 'Details',
							custom_id: 'details',
						},
					],
				},
			],
			allowed_mentions: { parse: [], users: ['123'] },
		});
		expect(parsed.components).toHaveLength(2);
		expect(parsed.allowed_mentions).toEqual({ parse: [], users: ['123'] });
	});

	it('keeps components and allowed_mentions on reply and edit', () => {
		const reply = DiscordEndpointInputSchemas.messagesReply.parse({
			channel_id: 'C1',
			message_id: 'M1',
			components: [linkRow],
			allowed_mentions: { replied_user: false },
		});
		const edit = DiscordEndpointInputSchemas.messagesEdit.parse({
			channel_id: 'C1',
			message_id: 'M1',
			components: [],
			allowed_mentions: { parse: ['users'] },
		});
		expect(reply.components).toEqual([linkRow]);
		expect(reply.allowed_mentions).toEqual({ replied_user: false });
		expect(edit.components).toEqual([]);
		expect(edit.allowed_mentions).toEqual({ parse: ['users'] });
	});

	it('rejects a link button without a url, or with a custom_id', () => {
		expect(
			ButtonComponentSchema.safeParse({
				type: 2,
				style: ButtonStyle.Link,
				label: 'x',
			}).success,
		).toBe(false);
		expect(
			ButtonComponentSchema.safeParse({
				type: 2,
				style: ButtonStyle.Link,
				url: 'https://a.b',
				custom_id: 'c',
			}).success,
		).toBe(false);
	});

	it('rejects an interactive button without a custom_id and a premium button without a sku_id', () => {
		expect(
			ButtonComponentSchema.safeParse({
				type: 2,
				style: ButtonStyle.Primary,
				label: 'Go',
			}).success,
		).toBe(false);
		expect(
			ButtonComponentSchema.safeParse({ type: 2, style: ButtonStyle.Premium })
				.success,
		).toBe(false);
	});

	it('allows at most 5 buttons per row and a select menu only on its own', () => {
		const button = {
			type: 2 as const,
			style: ButtonStyle.Primary,
			custom_id: 'b',
		};
		const select = {
			type: 3 as const,
			custom_id: 's',
			options: [{ label: 'A', value: 'a' }],
		};
		expect(
			ActionRowSchema.safeParse({ type: 1, components: Array(5).fill(button) })
				.success,
		).toBe(true);
		expect(
			ActionRowSchema.safeParse({ type: 1, components: Array(6).fill(button) })
				.success,
		).toBe(false);
		expect(
			ActionRowSchema.safeParse({ type: 1, components: [select] }).success,
		).toBe(true);
		expect(
			ActionRowSchema.safeParse({ type: 1, components: [select, button] })
				.success,
		).toBe(false);
		expect(ActionRowSchema.safeParse({ type: 1, components: [] }).success).toBe(
			false,
		);
	});

	it('rejects unknown allowed_mentions parse values', () => {
		expect(
			DiscordEndpointInputSchemas.messagesSend.safeParse({
				channel_id: 'C1',
				allowed_mentions: { parse: ['here'] },
			}).success,
		).toBe(false);
	});

	it('rejects fields a button style does not allow', () => {
		// unknown on purpose: these inputs are invalid buttons, so they can't be typed as ButtonComponent.
		const ok = (v: unknown) => ButtonComponentSchema.safeParse(v).success;
		expect(
			ok({
				type: 2,
				style: ButtonStyle.Primary,
				custom_id: 'a',
				url: 'https://x.com',
			}),
		).toBe(false);
		expect(
			ok({
				type: 2,
				style: ButtonStyle.Link,
				url: 'https://x.com',
				sku_id: '1',
			}),
		).toBe(false);
		expect(
			ok({ type: 2, style: ButtonStyle.Premium, sku_id: '1', label: 'Buy' }),
		).toBe(false);
		expect(ok({ type: 2, style: ButtonStyle.Premium, sku_id: '1' })).toBe(true);
	});

	it('rejects empty ids and labels', () => {
		expect(
			StringSelectComponentSchema.safeParse({
				type: 3,
				custom_id: '',
				options: [{ label: 'A', value: 'a' }],
			}).success,
		).toBe(false);
		expect(
			StringSelectComponentSchema.safeParse({
				type: 3,
				custom_id: 's',
				options: [{ label: '', value: '' }],
			}).success,
		).toBe(false);
	});

	it('checks select value counts', () => {
		const options = [
			{ label: 'A', value: 'a' },
			{ label: 'B', value: 'b' },
		];
		const ok = (v: object) =>
			StringSelectComponentSchema.safeParse({
				type: 3,
				custom_id: 's',
				options,
				...v,
			}).success;
		expect(ok({ min_values: 2, max_values: 1 })).toBe(false);
		expect(ok({ max_values: 3 })).toBe(false);
		expect(ok({ min_values: 1, max_values: 2 })).toBe(true);
		expect(
			AutoSelectComponentSchema.safeParse({
				type: 5,
				custom_id: 'u',
				min_values: 3,
				max_values: 2,
			}).success,
		).toBe(false);
	});

	it('allows channel_types only on channel selects', () => {
		expect(
			AutoSelectComponentSchema.safeParse({
				type: 8,
				custom_id: 'c',
				channel_types: [0],
			}).success,
		).toBe(true);
		expect(
			AutoSelectComponentSchema.safeParse({
				type: 5,
				custom_id: 'u',
				channel_types: [0],
			}).success,
		).toBe(false);
	});

	it('rejects a custom_id used twice in one message', () => {
		const button = (id: string) => ({
			type: 2 as const,
			style: ButtonStyle.Primary,
			custom_id: id,
		});
		expect(
			MessageComponentsSchema.safeParse([
				{ type: 1, components: [button('a'), button('a')] },
			]).success,
		).toBe(false);
		expect(
			MessageComponentsSchema.safeParse([
				{ type: 1, components: [button('a')] },
				{ type: 1, components: [button('a')] },
			]).success,
		).toBe(false);
		expect(
			MessageComponentsSchema.safeParse([
				{ type: 1, components: [button('a'), button('b')] },
			]).success,
		).toBe(true);
	});

	it('rejects a parse type together with an explicit list of the same type', () => {
		expect(
			AllowedMentionsSchema.safeParse({ parse: ['users'], users: ['1'] })
				.success,
		).toBe(false);
		expect(
			AllowedMentionsSchema.safeParse({ parse: ['roles'], roles: ['1'] })
				.success,
		).toBe(false);
		expect(
			AllowedMentionsSchema.safeParse({ parse: ['roles'], users: ['1'] })
				.success,
		).toBe(true);
	});

	it('parses components returned on a message', () => {
		const parsed = DiscordEndpointOutputSchemas.messagesSend.parse(sentMessage);
		expect(parsed.components?.[0]?.type).toBe(1);
	});
});

describe('message components and allowed mentions: request bodies', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{
		url: string;
		method: string;
		// The captured body is whatever JSON the client sent; the tests check specific keys on it.
		body: Record<string, unknown>;
	}> = [];

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({
				url: String(url),
				method: init?.method ?? 'GET',
				body: typeof init?.body === 'string' ? JSON.parse(init.body) : {},
			});
			return new Response(JSON.stringify(sentMessage), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	// The endpoint only reads key and db here. Building the full plugin context
	// (keys, logger, tenant helpers) would test core, not this plugin, so the
	// partial object is cast to the context type.
	const ctx = {
		key: 'test-token',
		db: {},
		$getAccountId: async () => 'test-account',
		database: undefined,
	} as unknown as Parameters<typeof Messages.send>[0];

	it('send forwards components and allowed_mentions to Discord', async () => {
		await Messages.send(ctx, {
			channel_id: 'C1',
			content: '<@123> shipped it',
			components: [linkRow],
			allowed_mentions: { parse: [], users: ['123'] },
		});
		expect(calls).toHaveLength(1);
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url).toContain('/channels/C1/messages');
		expect(calls[0]?.body.components).toEqual([linkRow]);
		expect(calls[0]?.body.allowed_mentions).toEqual({
			parse: [],
			users: ['123'],
		});
		expect(calls[0]?.body.channel_id).toBeUndefined();
	});

	it('reply forwards components and allowed_mentions next to the message reference', async () => {
		await Messages.reply(ctx, {
			channel_id: 'C1',
			message_id: 'M1',
			components: [linkRow],
			allowed_mentions: { replied_user: false },
		});
		expect(calls[0]?.body.components).toEqual([linkRow]);
		expect(calls[0]?.body.allowed_mentions).toEqual({ replied_user: false });
		expect(calls[0]?.body.message_reference).toMatchObject({
			message_id: 'M1',
		});
	});

	it('edit can replace or clear components', async () => {
		await Messages.edit(ctx, {
			channel_id: 'C1',
			message_id: 'M1',
			components: [],
		});
		expect(calls[0]?.method).toBe('PATCH');
		expect(calls[0]?.url).toContain('/channels/C1/messages/M1');
		expect(calls[0]?.body.components).toEqual([]);
	});
});
