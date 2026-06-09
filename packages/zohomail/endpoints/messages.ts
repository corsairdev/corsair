import { logEventFromContext } from 'corsair/core';
import {
	makeAuthenticatedZohoRequest,
	resolveAccountId,
	resolveInboxFolderId,
} from '../client';
import type { ZohoMailEndpoints } from '../index';
import type { ZohoMessage, ZohoMessageDetail, ZohoResponse } from '../types';
import { zohoEntityId } from '../webhooks/types';

export const list: ZohoMailEndpoints['messagesList'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);
	const folderId = await resolveInboxFolderId(
		ctx,
		region,
		accountId,
		input.folderId,
	);

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoMessage[]>>(
		`/accounts/${accountId}/messages/view`,
		ctx,
		{
			method: 'GET',
			region,
			query: {
				folderId,
				start: input.start,
				limit: input.limit,
				status: input.status,
				sortBy: input.sortBy,
				sortorder: input.sortorder,
				includeto: input.includeto,
			},
		},
	);

	const messages = res.data ?? [];

	if (ctx.db.messages) {
		try {
			for (const message of messages) {
				const messageId = zohoEntityId(message.messageId);
				if (messageId) {
					await ctx.db.messages.upsertByEntityId(messageId, {
						...message,
						id: messageId,
						messageId,
						createdAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zohomail.messages.list',
		{ ...input },
		'completed',
	);
	return { messages };
};

export const get: ZohoMailEndpoints['messagesGet'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	// `/details` returns the email metadata (subject, from/to, dates) with a
	// string messageId; `/content` returns only the body (with a numeric
	// messageId). Fetch both and merge so the result carries headers + body.
	const path = `/accounts/${accountId}/folders/${input.folderId}/messages/${input.messageId}`;
	const [details, content] = await Promise.all([
		makeAuthenticatedZohoRequest<ZohoResponse<ZohoMessageDetail>>(
			`${path}/details`,
			ctx,
			{ method: 'GET', region },
		),
		makeAuthenticatedZohoRequest<ZohoResponse<{ content?: string }>>(
			`${path}/content`,
			ctx,
			{ method: 'GET', region },
		).catch(() => null),
	]);

	const message: ZohoMessageDetail = {
		...(details.data ?? {}),
		content: content?.data?.content,
	};

	const messageId = zohoEntityId(message.messageId ?? input.messageId);
	if (messageId && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(messageId, {
				...message,
				id: messageId,
				messageId,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zohomail.messages.get',
		{ ...input },
		'completed',
	);
	return message;
};

export const send: ZohoMailEndpoints['messagesSend'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	const res = await makeAuthenticatedZohoRequest<ZohoResponse<ZohoMessage>>(
		`/accounts/${accountId}/messages`,
		ctx,
		{
			method: 'POST',
			region,
			body: {
				fromAddress: input.fromAddress,
				toAddress: input.toAddress,
				ccAddress: input.ccAddress,
				bccAddress: input.bccAddress,
				subject: input.subject,
				content: input.content,
				mailFormat: input.mailFormat,
				askReceipt: input.askReceipt,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'zohomail.messages.send',
		{ ...input },
		'completed',
	);
	return res.data ?? {};
};

export const deleteMessage: ZohoMailEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/folders/${input.folderId}/messages/${input.messageId}`,
		ctx,
		{ method: 'DELETE', region },
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(input.messageId);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'zohomail.messages.delete',
		{ ...input },
		'completed',
	);
};

export const move: ZohoMailEndpoints['messagesMove'] = async (ctx, input) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/updatemessage`,
		ctx,
		{
			method: 'PUT',
			region,
			body: {
				mode: 'moveMessage',
				destfolderId: input.destfolderId,
				messageId: input.messageId,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'zohomail.messages.move',
		{ ...input },
		'completed',
	);
};

export const markRead: ZohoMailEndpoints['messagesMarkRead'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/updatemessage`,
		ctx,
		{
			method: 'PUT',
			region,
			body: { mode: 'markAsRead', messageId: input.messageId },
		},
	);

	await logEventFromContext(
		ctx,
		'zohomail.messages.markRead',
		{ ...input },
		'completed',
	);
};

export const markUnread: ZohoMailEndpoints['messagesMarkUnread'] = async (
	ctx,
	input,
) => {
	const region = ctx.options.region;
	const accountId = await resolveAccountId(ctx, region, input.accountId);

	await makeAuthenticatedZohoRequest<ZohoResponse<unknown>>(
		`/accounts/${accountId}/updatemessage`,
		ctx,
		{
			method: 'PUT',
			region,
			body: { mode: 'markAsUnread', messageId: input.messageId },
		},
	);

	await logEventFromContext(
		ctx,
		'zohomail.messages.markUnread',
		{ ...input },
		'completed',
	);
};
