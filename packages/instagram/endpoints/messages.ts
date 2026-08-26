import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedInstagramRequest } from '../client';
import type { InstagramEndpoints } from '../index';
import type { FacebookPageSchema } from '../schema/database';
import { GetFacebookPages } from './meta-data-endpoints';
import type { InstagramEndpointOutputs } from './types';

export const get: InstagramEndpoints['GetMessage'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['GetMessage']
	>(
		`/${input.message_id}`,
		ctx,
		{
			method: 'GET',
			query: {
				fields: input.q,
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

	if (result.id) {
		try {
			await ctx.db.messages.upsertByEntityId(result.id, {
				messageId: result.id,
				senderId: result.from?.id,
				senderName: result.from?.username,
				message: result.message,
			});
		} catch (err) {
			console.warn('failed to save messages into database', err);
		}
	}

	await logEventFromContext(
		ctx,
		'instagram.messages.get',
		{ ...input },
		'completed',
	);

	return result;
};

export const send: InstagramEndpoints['SendMessage'] = async (ctx, input) => {
	const body: Record<string, unknown> = {
		recipient: {
			id: input.recipient,
		},
		message: input.message,
	};

	if (input.messaging_type) {
		body.messaging_type = input.messaging_type;
	}

	if (input.tag) {
		body.tag = input.tag;
	}

	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['SendMessage']
	>(
		`/me/messages`,
		ctx,
		{
			method: 'POST',
			body,
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
		'instagram.messages.send',
		{ ...input },
		'completed',
	);

	return result;
};

export const listAll: InstagramEndpoints['ListAllMessages'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['ListAllMessages']
	>(
		`/${input.conversation_id}/messages`,
		ctx,
		{
			method: 'GET',
			query: {
				fields: input.fields,
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
		'instagram.messages.listAll',
		{ ...input },
		'completed',
	);

	return result;
};

export const markSeen: InstagramEndpoints['MarkSeen'] = async (ctx, input) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['MarkSeen']
	>(
		`/me/messages`,
		ctx,
		{
			method: 'POST',
			body: {
				recipient: {
					id: input.recipient_id,
				},
				sender_action: 'mark_seen',
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
		'instagram.messages.markSeen',
		{ ...input },
		'completed',
	);

	return result;
};

export const sendImage: InstagramEndpoints['SendImage'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['SendImage']
	>(
		`/me/messages`,
		ctx,
		{
			method: 'POST',
			body: {
				recipient: {
					id: input.recipient_id,
				},
				message: {
					attachment: {
						type: 'image',
						payload: {
							url: input.image_url,
						},
					},
				},
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
		'instagram.messages.sendImage',
		{ ...input },
		'completed',
	);

	return result;
};

export const sendTextMessage: InstagramEndpoints['SendTextMessage'] = async (
	ctx,
	input,
) => {
	const result = await makeAuthenticatedInstagramRequest<
		InstagramEndpointOutputs['SendTextMessage']
	>(
		`/me/messages`,
		ctx,
		{
			method: 'POST',
			body: {
				recipient: {
					id: input.recipient_id,
				},
				message: {
					text: input.message,
				},
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
		'instagram.messages.sendTextMessage',
		{ ...input },
		'completed',
	);

	return result;
};
