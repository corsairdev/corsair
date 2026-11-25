import { logEventFromContext } from 'corsair/core';
import { ApiError, toFileOutput } from 'corsair/http';
import { makeAuthenticatedGmailRequest } from '../client';
import type { GmailBoundEndpoints, GmailEndpoints } from '../index';
import type { Message, MessagePart } from '../types';
import type { GmailEndpointOutputs } from './types';
import { buildGmailQuery } from './types';

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
	const q = buildGmailQuery(input) || undefined;
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesList']
	>(`/users/${input.userId || 'me'}/messages`, ctx, {
		method: 'GET',
		query: {
			q,
			maxResults: input.maxResults,
			pageToken: input.pageToken,
			labelIds: input.labelIds,
			includeSpamTrash: input.includeSpamTrash,
		},
	});

	if (result.messages && ctx.db.messages) {
		try {
			for (const message of result.messages) {
				// List entries carry only id and threadId, and upsert replaces the
				// stored row, so only insert messages that are not stored yet.
				if (
					message.id &&
					!(await ctx.db.messages.existsByEntityId(message.id))
				) {
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
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesGet']
	>(`/users/${input.userId || 'me'}/messages/${input.id}`, ctx, {
		method: 'GET',
		query: {
			format: input.format,
			metadataHeaders: input.metadataHeaders,
		},
	});

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
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesSend']
	>(`/users/${input.userId || 'me'}/messages/send`, ctx, {
		method: 'POST',
		body: {
			raw: input.raw,
			threadId: input.threadId,
		},
	});

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

	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesModify']
	>(`/users/${input.userId || 'me'}/messages/${input.id}/modify`, ctx, {
		method: 'POST',
		body,
	});

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

	await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesBatchModify']
	>(`/users/${input.userId || 'me'}/messages/batchModify`, ctx, {
		method: 'POST',
		body,
	});

	await logEventFromContext(
		ctx,
		'gmail.messages.batchModify',
		{ ...input },
		'completed',
	);
};

export const trash: GmailEndpoints['messagesTrash'] = async (ctx, input) => {
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesTrash']
	>(`/users/${input.userId || 'me'}/messages/${input.id}/trash`, ctx, {
		method: 'POST',
	});

	if (result.id) {
		const endpoints = ctx.endpoints as GmailBoundEndpoints;
		await endpoints.messages.get({ id: result.id, userId: input.userId });
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
	const result = await makeAuthenticatedGmailRequest<
		GmailEndpointOutputs['messagesUntrash']
	>(`/users/${input.userId || 'me'}/messages/${input.id}/untrash`, ctx, {
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

function findPart(
	part: MessagePart | undefined,
	partId: string,
): MessagePart | undefined {
	if (!part) return undefined;
	if (part.partId === partId) return part;
	for (const child of part.parts ?? []) {
		const found = findPart(child, partId);
		if (found) return found;
	}
	return undefined;
}

function attachmentError(url: string, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url },
		{ url, ok: false, status: 404, statusText: 'Not Found', body: { message } },
		message,
	);
}

export const getAttachment: GmailEndpoints['messagesGetAttachment'] = async (
	ctx,
	input,
) => {
	const base = `/users/${input.userId || 'me'}/messages/${input.messageId}`;
	if (input.partId === undefined && input.attachmentId === undefined) {
		throw attachmentError(base, 'Give partId or attachmentId.');
	}

	let attachmentId = input.attachmentId;
	let part: MessagePart | undefined;
	if (input.partId !== undefined) {
		// Attachment ids change between reads, so the part is resolved fresh.
		const message = await makeAuthenticatedGmailRequest<Message>(base, ctx, {
			method: 'GET',
			query: { format: 'full' },
		});
		part = findPart(message.payload, input.partId);
		if (!part) {
			throw attachmentError(
				base,
				`Message ${input.messageId} has no part ${input.partId}.`,
			);
		}
		attachmentId = part.body?.attachmentId;
		if (!attachmentId && part.body?.data === undefined) {
			throw attachmentError(
				base,
				`Part ${input.partId} of message ${input.messageId} has no attachment.`,
			);
		}
	}

	const data = attachmentId
		? (
				await makeAuthenticatedGmailRequest<{ data?: string }>(
					`${base}/attachments/${attachmentId}`,
					ctx,
					{ method: 'GET' },
				)
			).data
		: part?.body?.data;

	await logEventFromContext(
		ctx,
		'gmail.messages.getAttachment',
		{ ...input },
		'completed',
	);
	return toFileOutput(
		Buffer.from(data ?? '', 'base64url'),
		part?.mimeType,
		part?.filename ? { filename: part.filename } : {},
	);
};
