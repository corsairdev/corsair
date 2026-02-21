import { logEventFromContext } from '../../utils/events';
import type { GmailWebhooks } from '..';
import { makeGmailRequest } from '../client';
import type { HistoryListResponse, Message, MessagePart } from '../types';
import { createGmailWebhookMatcher, decodePubSubMessage } from './types';

const HISTORY_MAX_RESULTS = 100;
const RECENT_MESSAGES_LIMIT = 10;
const HISTORY_ID_MATCH_THRESHOLD = 10;

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

function extractMessageIds(history: HistoryListResponse['history']): {
	added: string[];
	deleted: string[];
	modified: string[];
} {
	const added: string[] = [];
	const deleted: string[] = [];
	const modified: string[] = [];

	if (!history) {
		return { added, deleted, modified };
	}

	for (const historyItem of history) {
		if (historyItem.messagesAdded) {
			for (const msg of historyItem.messagesAdded) {
				if (msg.message?.id) {
					added.push(msg.message.id);
				}
			}
		}
		if (historyItem.messagesDeleted) {
			for (const msg of historyItem.messagesDeleted) {
				if (msg.message?.id) {
					deleted.push(msg.message.id);
				}
			}
		}
		if (historyItem.labelsAdded || historyItem.labelsRemoved) {
			if (historyItem.labelsAdded) {
				for (const labelChange of historyItem.labelsAdded) {
					if (labelChange.message?.id) {
						modified.push(labelChange.message.id);
					}
				}
			}
			if (historyItem.labelsRemoved) {
				for (const labelChange of historyItem.labelsRemoved) {
					if (labelChange.message?.id) {
						modified.push(labelChange.message.id);
					}
				}
			}
		}
	}

	return {
		added: [...new Set(added)],
		deleted: [...new Set(deleted)],
		modified: [...new Set(modified)],
	};
}

async function fetchFullMessage(
	credentials: string,
	userId: string,
	messageId: string,
): Promise<Message> {
	const [fullMessage, rawMessage] = await Promise.all([
		makeGmailRequest<Message>(
			`/users/${userId}/messages/${messageId}`,
			credentials,
			{
				method: 'GET',
				query: { format: 'full' },
			},
		),
		makeGmailRequest<Message>(
			`/users/${userId}/messages/${messageId}`,
			credentials,
			{
				method: 'GET',
				query: { format: 'raw' },
			},
		).catch(() => null),
	]);

	return { ...fullMessage, raw: rawMessage?.raw };
}

async function fetchAttachment(
	credentials: string,
	userId: string,
	messageId: string,
	attachmentId: string,
): Promise<{ data: string; size: number }> {
	return makeGmailRequest<{ data: string; size: number }>(
		`/users/${userId}/messages/${messageId}/attachments/${attachmentId}`,
		credentials,
		{ method: 'GET' },
	);
}

async function enrichMessageWithAttachments(
	credentials: string,
	userId: string,
	message: Message,
): Promise<Message> {
	if (!message.payload) {
		return message;
	}

	const enrichPart = async (
		part: MessagePart | undefined,
	): Promise<MessagePart | undefined> => {
		if (!part) {
			return part;
		}

		if (part.body?.attachmentId) {
			try {
				const attachment = await fetchAttachment(
					credentials,
					userId,
					message.id!,
					part.body.attachmentId,
				);
				return {
					...part,
					body: {
						...part.body,
						data: attachment.data,
						size: attachment.size,
					},
				};
			} catch (error) {
				console.warn(
					`Failed to fetch attachment ${part.body.attachmentId} for message ${message.id}:`,
					error,
				);
				return part;
			}
		}

		if (part.parts && part.parts.length > 0) {
			const enrichedParts = await Promise.all(part.parts.map(enrichPart));
			return {
				...part,
				parts: enrichedParts.filter((p): p is MessagePart => p !== undefined),
			};
		}

		return part;
	};

	const enrichedPayload = await enrichPart(message.payload);
	return { ...message, payload: enrichedPayload };
}

function computePreviousHistoryId(historyId: string): string {
	const num = Number(historyId);
	return num > 1 ? String(num - 1) : historyId;
}

type MessageChangedContext = Parameters<
	GmailWebhooks['messageChanged']['handler']
>[0];

async function upsertMessageToDb(
	ctx: MessageChangedContext,
	message: Message,
): Promise<string> {
	if (!ctx.db?.messages || !message.id) {
		return '';
	}

	const entity = await ctx.db.messages.upsertByEntityId(message.id, {
		...message,
		id: message.id,
		subject: extractSubject(message),
		body: extractBody(message),
		from: extractFrom(message),
		to: extractTo(message),
		createdAt: new Date(),
	});

	return entity?.id ?? '';
}

async function resolveAndCategorizeMessageIds(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	historyId: string,
): Promise<{
	added: string[];
	modified: string[];
}> {
	const messagesResponse = await makeGmailRequest<{
		messages?: Array<{ id?: string }>;
	}>(`/users/${emailAddress}/messages`, credentials, {
		method: 'GET',
		query: { maxResults: RECENT_MESSAGES_LIMIT },
	});

	const added: string[] = [];
	const modified: string[] = [];

	if (!messagesResponse.messages?.length) {
		return { added, modified };
	}

	const targetHistoryIdNum = Number(historyId);

	for (const msg of messagesResponse.messages) {
		if (!msg.id) continue;

		try {
			const fullMessage = await fetchFullMessage(
				credentials,
				emailAddress,
				msg.id,
			);
			const messageHistoryIdNum = fullMessage.historyId
				? Number(fullMessage.historyId)
				: 0;

			if (
				messageHistoryIdNum >=
				targetHistoryIdNum - HISTORY_ID_MATCH_THRESHOLD
			) {
				if (ctx.db?.messages) {
					const existingEntity = await ctx.db.messages.findByEntityId(msg.id);
					if (existingEntity) {
						modified.push(msg.id);
					} else {
						added.push(msg.id);
					}
				} else {
					added.push(msg.id);
				}
			}
		} catch {}
	}

	return { added, modified };
}

async function processAddedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	messageIds: string[],
): Promise<{ message: Message | null; corsairEntityId: string }> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';

	for (const messageId of messageIds) {
		try {
			const fullMessage = await fetchFullMessage(
				credentials,
				emailAddress,
				messageId,
			);
			const enrichedMessage = await enrichMessageWithAttachments(
				credentials,
				emailAddress,
				fullMessage,
			);

			if (!firstMessage) {
				firstMessage = enrichedMessage;
			}

			try {
				const entityId = await upsertMessageToDb(ctx, enrichedMessage);
				if (!corsairEntityId && entityId) {
					corsairEntityId = entityId;
				}
			} catch (dbError) {
				console.error(
					`Failed to save message ${enrichedMessage.id} to database:`,
					dbError,
				);
				throw dbError;
			}
		} catch (error) {
			console.warn(`Failed to process message ${messageId}:`, error);
		}
	}

	return { message: firstMessage, corsairEntityId };
}

async function processDeletedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	deletedIds: string[],
): Promise<{ message: Message | null; corsairEntityId: string }> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';

	if (!ctx.db?.messages) {
		return { message: null, corsairEntityId };
	}

	for (const messageId of deletedIds) {
		try {
			let message: Message | null = null;

			try {
				message = await makeGmailRequest<Message>(
					`/users/${emailAddress}/messages/${messageId}`,
					credentials,
					{
						method: 'GET',
						query: { format: 'full' },
					},
				);
			} catch (fetchError: any) {
				// Using 'any' because Gmail API error shape varies and we only check statusCode
				if (fetchError?.statusCode === 404) {
					continue;
				}
			}

			if (!firstMessage && message) {
				firstMessage = message;
			}

			if (!corsairEntityId) {
				const entity = await ctx.db.messages.findByEntityId(messageId);
				if (entity) {
					corsairEntityId = entity.id;
				}
			}

			await ctx.db.messages.deleteByEntityId(messageId);
		} catch (deleteError) {
			console.warn(
				`Failed to delete message ${messageId} from database:`,
				deleteError,
			);
		}
	}

	return { message: firstMessage, corsairEntityId };
}

async function processModifiedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	modifiedIds: string[],
): Promise<{ message: Message | null; corsairEntityId: string }> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';

	if (!ctx.db?.messages) {
		return { message: null, corsairEntityId };
	}

	for (const messageId of modifiedIds) {
		try {
			const fullMessage = await fetchFullMessage(
				credentials,
				emailAddress,
				messageId,
			);
			const enrichedMessage = await enrichMessageWithAttachments(
				credentials,
				emailAddress,
				fullMessage,
			);

			if (!firstMessage) {
				firstMessage = enrichedMessage;
			}

			try {
				const entityId = await upsertMessageToDb(ctx, enrichedMessage);
				if (!corsairEntityId && entityId) {
					corsairEntityId = entityId;
				}
			} catch (dbError) {
				console.error(
					`Failed to update message ${enrichedMessage.id} in database:`,
					dbError,
				);
				throw dbError;
			}
		} catch (error) {
			console.warn(`Failed to process message ${messageId}:`, error);
		}
	}

	return { message: firstMessage, corsairEntityId };
}

export const messageChanged: GmailWebhooks['messageChanged'] = {
	match: createGmailWebhookMatcher('messageChanged'),
	handler: async (ctx, request) => {
		const body = request.payload;

		if (!body.message?.data) {
			return { success: false, error: 'No message data in notification' };
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return { success: false, error: 'Invalid push notification format' };
		}

		const credentials = ctx.key;
		const emailAddress = pushNotification.emailAddress;
		const historyId = pushNotification.historyId;

		try {
			const previousHistoryId = computePreviousHistoryId(historyId);

			const historyResponse = await makeGmailRequest<HistoryListResponse>(
				`/users/${emailAddress}/history`,
				credentials,
				{
					method: 'GET',
					query: {
						startHistoryId: previousHistoryId,
						maxResults: HISTORY_MAX_RESULTS,
					},
				},
			);

			const {
				added: historyAdded,
				deleted,
				modified: historyModified,
			} = extractMessageIds(historyResponse.history);

			if (historyModified.length > 0) {
				const result = await processModifiedMessages(
					ctx,
					credentials,
					emailAddress,
					historyModified,
				);

				const eventData = {
					type: 'messageLabelChanged' as const,
					emailAddress,
					historyId,
					message: result.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageLabelChanged',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: eventData,
				};
			}

			if (historyAdded.length > 0) {
				const result = await processAddedMessages(
					ctx,
					credentials,
					emailAddress,
					historyAdded,
				);

				const eventData = {
					type: 'messageReceived' as const,
					emailAddress,
					historyId,
					message: result.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageReceived',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: eventData,
				};
			}

			if (deleted.length > 0) {
				const result = await processDeletedMessages(
					ctx,
					credentials,
					emailAddress,
					deleted,
				);

				const eventData = {
					type: 'messageDeleted' as const,
					emailAddress,
					historyId,
					message: result.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageDeleted',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: eventData,
				};
			}

			const { added, modified } = await resolveAndCategorizeMessageIds(
				ctx,
				credentials,
				emailAddress,
				historyId,
			);

			if (modified.length > 0) {
				const result = await processModifiedMessages(
					ctx,
					credentials,
					emailAddress,
					modified,
				);

				const eventData = {
					type: 'messageLabelChanged' as const,
					emailAddress,
					historyId,
					message: result.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageLabelChanged',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: eventData,
				};
			}

			if (added.length > 0) {
				const result = await processAddedMessages(
					ctx,
					credentials,
					emailAddress,
					added,
				);

				const eventData = {
					type: 'messageReceived' as const,
					emailAddress,
					historyId,
					message: result.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageReceived',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: eventData,
				};
			}

			return {
				success: true,
				corsairEntityId: '',
				data: {
					type: 'messageReceived' as const,
					emailAddress,
					historyId,
					message: {},
				},
			};
		} catch (error) {
			console.error('Failed to process Gmail webhook:', error);
			return {
				success: false,
				error: `Failed to process message: ${error instanceof Error ? error.message : 'Unknown error'}`,
			};
		}
	},
};
