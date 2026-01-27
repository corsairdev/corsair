import { logEventFromContext } from '../../utils/events';
import type { GmailEndpoints } from '..';
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
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['messagesList']>(
			`/users/${input.userId || 'me'}/messages`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
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
						await ctx.db.messages.upsert(message.id, {
							id: message.id,
							threadId: message.threadId,
							labelIds: message.labelIds,
							snippet: message.snippet,
							historyId: message.historyId,
							internalDate: message.internalDate,
							sizeEstimate: message.sizeEstimate,
							createdAt: new Date(),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to save messages to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.messages.list',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEventFromContext(ctx, 'gmail.messages.list', { ...input }, 'failed');
		throw error;
	}
};

export const get: GmailEndpoints['messagesGet'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['messagesGet']>(
			`/users/${input.userId || 'me'}/messages/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
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
				await ctx.db.messages.upsert(result.id, {
					id: result.id,
					threadId: result.threadId,
					labelIds: result.labelIds,
					snippet: result.snippet,
					historyId: result.historyId,
					internalDate: result.internalDate,
					sizeEstimate: result.sizeEstimate,
					payload: result.payload,
					raw: result.raw,
					subject,
					body,
					from,
					to,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.messages.get',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEventFromContext(ctx, 'gmail.messages.get', { ...input }, 'failed');
		throw error;
	}
};

export const send: GmailEndpoints['messagesSend'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<GmailEndpointOutputs['messagesSend']>(
			`/users/${input.userId || 'me'}/messages/send`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
				body: {
					raw: input.raw,
					threadId: input.threadId,
				},
			},
		);

		if (result.id && ctx.db.messages) {
			try {
				const subject = extractSubject(result);
				const body = extractBody(result);
				const from = extractFrom(result);
				const to = extractTo(result);
				await ctx.db.messages.upsert(result.id, {
					id: result.id,
					threadId: result.threadId,
					labelIds: result.labelIds,
					snippet: result.snippet,
					historyId: result.historyId,
					internalDate: result.internalDate,
					sizeEstimate: result.sizeEstimate,
					payload: result.payload,
					raw: result.raw,
					subject,
					body,
					from,
					to,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to save message to database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.messages.send',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEventFromContext(ctx, 'gmail.messages.send', { ...input }, 'failed');
		throw error;
	}
};

export const deleteMessage: GmailEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	try {
		await makeGmailRequest<GmailEndpointOutputs['messagesDelete']>(
			`/users/${input.userId || 'me'}/messages/${input.id}`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
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

		await logEvent(
			ctx.database,
			'gmail.messages.delete',
			{ ...input },
			'completed',
		);
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.messages.delete',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const modify: GmailEndpoints['messagesModify'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<
			GmailEndpointOutputs['messagesModify']
		>(
			`/users/${input.userId || 'me'}/messages/${input.id}/modify`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
				body: {
					addLabelIds: input.addLabelIds,
					removeLabelIds: input.removeLabelIds,
				},
			},
		);

		if (result.id && ctx.db.messages) {
			try {
				const subject = extractSubject(result);
				const body = extractBody(result);
				const from = extractFrom(result);
				const to = extractTo(result);
				await ctx.db.messages.upsert(result.id, {
					id: result.id,
					threadId: result.threadId,
					labelIds: result.labelIds,
					snippet: result.snippet,
					historyId: result.historyId,
					internalDate: result.internalDate,
					sizeEstimate: result.sizeEstimate,
					payload: result.payload,
					raw: result.raw,
					subject,
					body,
					from,
					to,
					createdAt: new Date(),
				});
			} catch (error) {
				console.warn('Failed to update message in database:', error);
			}
		}

		await logEvent(
			ctx.database,
			'gmail.messages.modify',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.messages.modify',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const batchModify: GmailEndpoints['messagesBatchModify'] = async (
	ctx,
	input,
) => {
	try {
		await makeGmailRequest<GmailEndpointOutputs['messagesBatchModify']>(
			`/users/${input.userId || 'me'}/messages/batchModify`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
				body: {
					ids: input.ids,
					addLabelIds: input.addLabelIds,
					removeLabelIds: input.removeLabelIds,
				},
			},
		);

		await logEvent(
			ctx.database,
			'gmail.messages.batchModify',
			{ ...input },
			'completed',
		);
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.messages.batchModify',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const trash: GmailEndpoints['messagesTrash'] = async (ctx, input) => {
	try {
		const result = await makeGmailRequest<
			GmailEndpointOutputs['messagesTrash']
		>(
			`/users/${input.userId || 'me'}/messages/${input.id}/trash`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
			},
		);

		await logEvent(
			ctx.database,
			'gmail.messages.trash',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.messages.trash',
			{ ...input },
			'failed',
		);
		throw error;
	}
};

export const untrash: GmailEndpoints['messagesUntrash'] = async (
	ctx,
	input,
) => {
	try {
		const result = await makeGmailRequest<
			GmailEndpointOutputs['messagesUntrash']
		>(
			`/users/${input.userId || 'me'}/messages/${input.id}/untrash`,
			{
				clientId: ctx.options.clientId,
				clientSecret: ctx.options.clientSecret,
				accessToken: ctx.options.accessToken,
				refreshToken: ctx.options.refreshToken,
			},
			{
				method: 'POST',
			},
		);

		await logEvent(
			ctx.database,
			'gmail.messages.untrash',
			{ ...input },
			'completed',
		);
		return result;
	} catch (error) {
		await logEvent(
			ctx.database,
			'gmail.messages.untrash',
			{ ...input },
			'failed',
		);
		throw error;
	}
};
