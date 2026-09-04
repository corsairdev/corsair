import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { FacebookPageSchema } from '../schema/database';
import { GetFacebookPages } from './meta-data-endpoints';
import type { InstagramEndpointOutputs } from './types';

export const list: InstagramEndpoints['GetInstagramConversations'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetInstagramConversations']
	>(
		`${input.page_id}/conversations`,
		ctx,
		{
			method: 'GET',
			query: {
				platform: 'instagram',
				fields: input.q,
				after: input.after,
				before: input.before,
			},
		},
		async (userToken) => {
			const key = userToken ?? ctx.key;
			const res: FacebookPageSchema = await GetFacebookPages(
				key,
				'access_token',
				input.page_id,
			);
			if (!res.access_token) {
				throw new Error(`No page access token found for page`);
			}
			return res.access_token;
		},
	);

	if (result.data) {
		for (const con of result.data) {
			try {
				await ctx.db.conversations.upsertByEntityId(con.id, {
					conversationId: con.id,
					pageId: input.page_id,
				});
			} catch (err) {
				console.warn('failed to save conversations into database', err);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.conversations.list',
		{ ...input },
		'completed',
	);

	return result;
};

export const get: InstagramEndpoints['GetConversationMessages'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetConversationMessages']
	>(
		`/${input.conversation_id}/messages`,
		ctx,
		{
			method: 'GET',
			query: {
				fields: input.q,
				after: input.after,
				before: input.before,
			},
		},
		async (userToken) => {
			const key = userToken ?? ctx.key;
			const res: FacebookPageSchema = await GetFacebookPages(
				key,
				'access_token',
				input.page_id,
			);
			if (!res.access_token) {
				throw new Error(`No page access token found for page`);
			}
			return res.access_token;
		},
	);

	if (result.data) {
		for (const msg of result.data) {
			try {
				await ctx.db.messages.upsertByEntityId(msg.id, {
					messageId: msg.id,
					conversationId: input.conversation_id,
					senderId: msg.from?.id,
					senderName: msg.from?.username,
					message: msg.message,
				});
			} catch (err) {
				console.warn('failed to save conversations into database', err);
			}
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.conversations.get',
		{ ...input },
		'completed',
	);

	return result;
};

export const getConversation: InstagramEndpoints['GetConversation'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetConversation']
	>(
		`/${input.conversation_id}`,
		ctx,
		{
			method: 'GET',
			query: {
				fields: input.fields,
			},
		},
		async (userToken) => {
			const key = userToken ?? ctx.key;
			const res: FacebookPageSchema = await GetFacebookPages(
				key,
				'access_token',
				input.page_id,
			);
			if (!res.access_token) {
				throw new Error(`No page access token found for page`);
			}
			return res.access_token;
		},
	);

	await logEventFromContext(
		ctx,
		'instagram.conversations.getConversation',
		{ ...input },
		'completed',
	);

	return result;
};

export const pageConversations: InstagramEndpoints['GetPageConversations'] =
	async (ctx, input) => {
		const result = await makeAuthenticatedInstagramRequest<
			InstagramEndpointOutputs['GetPageConversations']
		>(
			`/${input.page_id}/conversations`,
			ctx,
			{
				method: 'GET',
				query: {
					platform: input.platform ?? 'instagram',
					after: input.after,
					before: input.before,
				},
			},
			async (userToken) => {
				const key = userToken ?? ctx.key;
				const res: FacebookPageSchema = await GetFacebookPages(
					key,
					'access_token',
					input.page_id,
				);
				if (!res.access_token) {
					throw new Error(`No page access token found for page`);
				}
				return res.access_token;
			},
		);

		await logEventFromContext(
			ctx,
			'instagram.conversations.pageConversations',
			{ ...input },
			'completed',
		);

		return result;
	};

export const listAll: InstagramEndpoints['ListAllConversations'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['ListAllConversations']
	>(
		`/${input.page_id}/conversations`,
		ctx,
		{
			method: 'GET',
			query: {
				platform: 'instagram',
				after: input.after,
				before: input.before,
			},
		},
		async (userToken) => {
			const key = userToken ?? ctx.key;
			const res: FacebookPageSchema = await GetFacebookPages(
				key,
				'access_token',
				input.page_id,
			);
			if (!res.access_token) {
				throw new Error(`No page access token found for page`);
			}
			return res.access_token;
		},
	);

	await logEventFromContext(
		ctx,
		'instagram.conversations.listAll',
		{ ...input },
		'completed',
	);

	return result;
};
