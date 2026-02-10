import { logEventFromContext } from '../../utils/events';
import type { GmailBoundEndpoints, GmailEndpoints } from '..';
import { makeGmailRequest } from '../client';
import type { Message, MessagePart } from '../types';
import type { GmailEndpointOutputs } from './types';

function getHeaderValue(
	part: MessagePart | undefined,
	headerName: string,
): string | undefined {
	if (!part?.headers) {
		return undefined;
	}
	const header = part.headers.find(
		(h) => h.name?.toLowerCase() === headerName.toLowerCase(),
	);
	return header?.value;
}

function extractSubject(message: Message): string | undefined {
	if (!message.payload) {
		return undefined;
	}
	return getHeaderValue(message.payload, 'Subject');
}

function extractFrom(message: Message): string | undefined {
	if (!message.payload) {
		return undefined;
	}
	return getHeaderValue(message.payload, 'From');
}

function extractTo(message: Message): string | undefined {
	if (!message.payload) {
		return undefined;
	}
	return getHeaderValue(message.payload, 'To');
}

function extractBodyText(part: MessagePart | undefined): string | undefined {
	if (!part) {
		return undefined;
	}

	let plainText: string | undefined;
	let htmlText: string | undefined;

	if (part.body?.data) {
		try {
			const decoded = Buffer.from(part.body.data, 'base64').toString('utf-8');
			if (part.mimeType === 'text/plain') {
				plainText = decoded;
			} else if (part.mimeType === 'text/html') {
				htmlText = decoded;
			}
		} catch {}
	}

	if (part.parts && part.parts.length > 0) {
		for (const subPart of part.parts) {
			const bodyText = extractBodyText(subPart);
			if (bodyText) {
				if (subPart.mimeType === 'text/plain') {
					plainText = bodyText;
				} else if (subPart.mimeType === 'text/html' && !plainText) {
					htmlText = bodyText;
				}
			}
		}
	}

	return plainText || htmlText;
}

function extractBody(message: Message): string | undefined {
	if (!message.payload) {
		return undefined;
	}
	return extractBodyText(message.payload);
}

export const list: GmailEndpoints['messagesList'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['messagesList']>(
		`/users/${input.userId || 'me'}/messages`,
		ctx.key,
		{
			method: 'GET',
			query: {
				q: input.q,
				maxResults: input.maxResults,
				pageToken: input.pageToken,
				labelIds: input.labelIds?.join(','),
				includeSpamTrash: input.includeSpamTrash,
			},
		},
	);

	if (result.messages && ctx.db.messages) {
		try {
			for (const message of result.messages) {
				if (message.id) {
					await ctx.db.messages.upsertByEntityId(message.id, {
						...message,
						id: message.id,
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
		'gmail.messages.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: GmailEndpoints['messagesGet'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['messagesGet']>(
		`/users/${input.userId || 'me'}/messages/${input.id}`,
		ctx.key,
		{
			method: 'GET',
			query: {
				format: input.format,
				metadataHeaders: input.metadataHeaders?.join(','),
			},
		},
	);

	if (result.id && ctx.db.messages) {
		try {
			const subject = extractSubject(result);
			const body = extractBody(result);
			const from = extractFrom(result);
			const to = extractTo(result);
			await ctx.db.messages.upsertByEntityId(result.id, {
				...result,
				subject,
				body,
				from,
				to,
				id: result.id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const send: GmailEndpoints['messagesSend'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['messagesSend']>(
		`/users/${input.userId || 'me'}/messages/send`,
		ctx.key,
		{
			method: 'POST',
			body: {
				raw: input.raw,
				threadId: input.threadId,
			},
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.messages.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.send',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteMessage: GmailEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	await makeGmailRequest<GmailEndpointOutputs['messagesDelete']>(
		`/users/${input.userId || 'me'}/messages/${input.id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.delete',
		{ ...input },
		'completed',
	);
};

export const modify: GmailEndpoints['messagesModify'] = async (ctx, input) => {
	const body: {
		addLabelIds?: string[];
		removeLabelIds?: string[];
	} = {};
	
	if (input.addLabelIds && input.addLabelIds.length > 0) {
		body.addLabelIds = input.addLabelIds;
	}
	
	if (input.removeLabelIds && input.removeLabelIds.length > 0) {
		body.removeLabelIds = input.removeLabelIds;
	}

	const result = await makeGmailRequest<GmailEndpointOutputs['messagesModify']>(
		`/users/${input.userId || 'me'}/messages/${input.id}/modify`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.messages.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.modify',
		{ ...input },
		'completed',
	);
	return result;
};

export const batchModify: GmailEndpoints['messagesBatchModify'] = async (
	ctx,
	input,
) => {
	const body: {
		ids?: string[];
		addLabelIds?: string[];
		removeLabelIds?: string[];
	} = {
		ids: input.ids,
	};
	
	if (input.addLabelIds && input.addLabelIds.length > 0) {
		body.addLabelIds = input.addLabelIds;
	}
	
	if (input.removeLabelIds && input.removeLabelIds.length > 0) {
		body.removeLabelIds = input.removeLabelIds;
	}

	await makeGmailRequest<GmailEndpointOutputs['messagesBatchModify']>(
		`/users/${input.userId || 'me'}/messages/batchModify`,
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	await logEventFromContext(
		ctx,
		'gmail.messages.batchModify',
		{ ...input },
		'completed',
	);
};

export const trash: GmailEndpoints['messagesTrash'] = async (ctx, input) => {
	const result = await makeGmailRequest<GmailEndpointOutputs['messagesTrash']>(
		`/users/${input.userId || 'me'}/messages/${input.id}/trash`,
		ctx.key,
		{
			method: 'POST',
		},
	);

	if (result.id) {
		const endpoints = ctx.endpoints as any;
		await endpoints.messages?.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.trash',
		{ ...input },
		'completed',
	);
	return result;
};

export const untrash: GmailEndpoints['messagesUntrash'] = async (
	ctx,
	input,
) => {
	const result = await makeGmailRequest<
		GmailEndpointOutputs['messagesUntrash']
	>(`/users/${input.userId || 'me'}/messages/${input.id}/untrash`, ctx.key, {
		method: 'POST',
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.messages.get({ id: result.id, userId: input.userId });
	}

	await logEventFromContext(
		ctx,
		'gmail.messages.untrash',
		{ ...input },
		'completed',
	);
	return result;
};
