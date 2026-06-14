import { logEventFromContext } from 'corsair/core';
import { makeGmailRequest } from '../client';
import type { GmailWebhooks } from '../index';
import type { GmailMessage } from '../schema/database';
import type { HistoryListResponse, Message, MessagePart } from '../types';
import { createGmailWebhookMatcher, decodePubSubMessage } from './types';

const HISTORY_MAX_RESULTS = 100;
const RECENT_MESSAGES_LIMIT = 10;
const HISTORY_ID_MATCH_THRESHOLD = 10n;

type GmailWebhookOptions = {
	syncLabelChanges: boolean;
	useHistoryFallback: boolean;
};

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

async function fetchMessageForWebhook(
	credentials: string,
	userId: string,
	messageId: string,
): Promise<Message> {
	return makeGmailRequest<Message>(
		`/users/${userId}/messages/${messageId}`,
		credentials,
		{
			method: 'GET',
			query: { format: 'full' },
		},
	);
}

function parseHistoryId(historyId: string): bigint {
	return BigInt(historyId);
}

function isHistoryIdLessThanOrEqual(left: string, right: string): boolean {
	return parseHistoryId(left) <= parseHistoryId(right);
}

function computePreviousHistoryId(historyId: string): string {
	const num = parseHistoryId(historyId);
	return num > 1n ? String(num - 1n) : historyId;
}

type MessageChangedContext = Parameters<
	GmailWebhooks['messageChanged']['handler']
>[0];

function getWebhookOptions(ctx: MessageChangedContext): GmailWebhookOptions {
	return {
		syncLabelChanges: ctx.options?.webhooks?.syncLabelChanges ?? false,
		useHistoryFallback: ctx.options?.webhooks?.useHistoryFallback ?? false,
	};
}

function slimMessageForEventLog(message: Message | null | undefined) {
	if (!message?.id) {
		return {};
	}

	return {
		id: message.id,
		threadId: message.threadId,
		subject: extractSubject(message),
		from: extractFrom(message),
		snippet: message.snippet,
	};
}

function toStorableMessage(message: Message): GmailMessage {
	return {
		id: message.id!,
		threadId: message.threadId,
		labelIds: message.labelIds,
		snippet: message.snippet,
		historyId: message.historyId,
		internalDate: message.internalDate,
		sizeEstimate: message.sizeEstimate,
		subject: extractSubject(message),
		body: extractBody(message),
		from: extractFrom(message),
		to: extractTo(message),
		createdAt: new Date(),
	};
}

async function getLastHistoryId(
	ctx: MessageChangedContext,
): Promise<string | null> {
	// TODO(corsair-compat, ~2026-07-14): remove guard once corsair with history_id is required.
	if (typeof ctx.keys.get_history_id !== 'function') {
		return null;
	}
	return ctx.keys.get_history_id();
}

async function persistHistoryId(
	ctx: MessageChangedContext,
	historyId: string,
): Promise<void> {
	// TODO(corsair-compat, ~2026-07-14): remove guard once corsair with history_id is required.
	if (typeof ctx.keys.set_history_id !== 'function') {
		return;
	}
	await ctx.keys.set_history_id(historyId);
}

async function fetchHistoryDelta(
	credentials: string,
	emailAddress: string,
	startHistoryId: string,
): Promise<{
	history: NonNullable<HistoryListResponse['history']>;
	historyId?: string;
}> {
	const history: NonNullable<HistoryListResponse['history']> = [];
	let pageToken: string | undefined;
	let currentHistoryId: string | undefined;

	do {
		const response = await makeGmailRequest<HistoryListResponse>(
			`/users/${emailAddress}/history`,
			credentials,
			{
				method: 'GET',
				query: {
					startHistoryId,
					maxResults: HISTORY_MAX_RESULTS,
					pageToken,
				},
			},
		);

		if (response.history?.length) {
			history.push(...response.history);
		}
		currentHistoryId = response.historyId ?? currentHistoryId;
		pageToken = response.nextPageToken;
	} while (pageToken);

	return { history, historyId: currentHistoryId };
}

async function upsertMessageToDb(
	ctx: MessageChangedContext,
	message: Message,
): Promise<string> {
	if (!ctx.db?.messages || !message.id) {
		return '';
	}

	const entity = await ctx.db.messages.upsertByEntityId(
		message.id,
		toStorableMessage(message),
	);

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

	const targetHistoryId = parseHistoryId(historyId);

	for (const msg of messagesResponse.messages) {
		if (!msg.id) continue;

		try {
			const fullMessage = await fetchMessageForWebhook(
				credentials,
				emailAddress,
				msg.id,
			);
			const messageHistoryId = fullMessage.historyId
				? parseHistoryId(fullMessage.historyId)
				: 0n;

			if (messageHistoryId >= targetHistoryId - HISTORY_ID_MATCH_THRESHOLD) {
				if (ctx.db?.messages) {
					// Fallback for corsair versions before existsByEntityId shipped (avoids
					// loading full message JSONB on old core). TODO(corsair-compat, ~2026-07-14):
					// remove this ternary and use only:
					//   const exists = await ctx.db.messages.existsByEntityId(msg.id);
					const exists = ctx.db.messages.existsByEntityId
						? await ctx.db.messages.existsByEntityId(msg.id)
						: !!(await ctx.db.messages.findByEntityId(msg.id));
					if (exists) {
						modified.push(msg.id);
					} else {
						added.push(msg.id);
					}
				} else {
					added.push(msg.id);
				}
			}
		} catch (error) {
			throw new Error(
				`Failed to resolve recent Gmail message ${msg.id}: ${
					error instanceof Error ? error.message : String(error)
				}`,
			);
		}
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
			const fullMessage = await fetchMessageForWebhook(
				credentials,
				emailAddress,
				messageId,
			);

			if (!firstMessage) {
				firstMessage = fullMessage;
			}

			try {
				const entityId = await upsertMessageToDb(ctx, fullMessage);
				if (!corsairEntityId && entityId) {
					corsairEntityId = entityId;
				}
			} catch (dbError) {
				console.error(
					`Failed to save message ${fullMessage.id} to database:`,
					dbError,
				);
				throw dbError;
			}
		} catch (error) {
			console.warn(`Failed to process message ${messageId}:`, error);
			throw error;
		}
	}

	return { message: firstMessage, corsairEntityId };
}

async function processDeletedMessages(
	ctx: MessageChangedContext,
	messageIds: string[],
): Promise<{ message: Message | null; corsairEntityId: string }> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';

	if (!ctx.db?.messages) {
		return { message: null, corsairEntityId };
	}

	for (const messageId of messageIds) {
		try {
			if (!firstMessage) {
				firstMessage = { id: messageId };
			}

			if (!corsairEntityId) {
				// Fallback for corsair versions before findIdByEntityId shipped. TODO(corsair-compat, ~2026-07-14):
				// remove this ternary and use only:
				//   const entityId = await ctx.db.messages.findIdByEntityId(messageId);
				const entityId = ctx.db.messages.findIdByEntityId
					? await ctx.db.messages.findIdByEntityId(messageId)
					: ((await ctx.db.messages.findByEntityId(messageId))?.id ?? null);
				if (entityId) {
					corsairEntityId = entityId;
				}
			}

			await ctx.db.messages.deleteByEntityId(messageId);
		} catch (deleteError) {
			console.warn(
				`Failed to delete message ${messageId} from database:`,
				deleteError,
			);
			throw deleteError;
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
			const fullMessage = await fetchMessageForWebhook(
				credentials,
				emailAddress,
				messageId,
			);

			if (!firstMessage) {
				firstMessage = fullMessage;
			}

			try {
				const entityId = await upsertMessageToDb(ctx, fullMessage);
				if (!corsairEntityId && entityId) {
					corsairEntityId = entityId;
				}
			} catch (dbError) {
				console.error(
					`Failed to update message ${fullMessage.id} in database:`,
					dbError,
				);
				throw dbError;
			}
		} catch (error) {
			console.warn(`Failed to process message ${messageId}:`, error);
			throw error;
		}
	}

	return { message: firstMessage, corsairEntityId };
}

async function emitGmailWebhookEvent(
	ctx: MessageChangedContext,
	eventType:
		| 'gmail.webhook.messageReceived'
		| 'gmail.webhook.messageDeleted'
		| 'gmail.webhook.messageLabelChanged',
	eventData: {
		type: 'messageReceived' | 'messageDeleted' | 'messageLabelChanged';
		emailAddress: string;
		historyId: string;
		message: Message | null;
	},
): Promise<void> {
	await logEventFromContext(
		ctx,
		eventType,
		{
			type: eventData.type,
			emailAddress: eventData.emailAddress,
			historyId: eventData.historyId,
			message: slimMessageForEventLog(eventData.message),
		},
		'completed',
	);
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
		const webhookOptions = getWebhookOptions(ctx);

		try {
			const lastHistoryId = await getLastHistoryId(ctx);
			if (
				lastHistoryId &&
				isHistoryIdLessThanOrEqual(historyId, lastHistoryId)
			) {
				return {
					success: true,
					corsairEntityId: '',
					data: {
						type: 'messageReceived' as const,
						emailAddress,
						historyId,
						message: {},
						skipped: 'duplicate-history-id' as const,
					},
				};
			}

			const startHistoryId =
				lastHistoryId ?? computePreviousHistoryId(historyId);

			const historyResponse = await fetchHistoryDelta(
				credentials,
				emailAddress,
				startHistoryId,
			);
			const cursorToPersist = historyResponse.historyId ?? historyId;

			const {
				added: historyAdded,
				deleted,
				modified: historyModified,
			} = extractMessageIds(historyResponse.history);

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
					message: result.message,
				};

				await emitGmailWebhookEvent(
					ctx,
					'gmail.webhook.messageReceived',
					eventData,
				);
				await persistHistoryId(ctx, cursorToPersist);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: {
						...eventData,
						message: result.message ?? {},
					},
				};
			}

			if (deleted.length > 0) {
				const result = await processDeletedMessages(ctx, deleted);

				const eventData = {
					type: 'messageDeleted' as const,
					emailAddress,
					historyId,
					message: result.message,
				};

				await emitGmailWebhookEvent(
					ctx,
					'gmail.webhook.messageDeleted',
					eventData,
				);
				await persistHistoryId(ctx, cursorToPersist);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: {
						...eventData,
						message: result.message ?? {},
					},
				};
			}

			if (historyModified.length > 0) {
				if (!webhookOptions.syncLabelChanges) {
					await persistHistoryId(ctx, cursorToPersist);
					return {
						success: true,
						corsairEntityId: '',
						data: {
							type: 'messageLabelChanged' as const,
							emailAddress,
							historyId,
							message: {},
							skipped: 'label-only' as const,
						},
					};
				}

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
					message: result.message,
				};

				await emitGmailWebhookEvent(
					ctx,
					'gmail.webhook.messageLabelChanged',
					eventData,
				);
				await persistHistoryId(ctx, cursorToPersist);

				return {
					success: true,
					corsairEntityId: result.corsairEntityId,
					data: {
						...eventData,
						message: result.message ?? {},
					},
				};
			}

			if (webhookOptions.useHistoryFallback) {
				const { added, modified } = await resolveAndCategorizeMessageIds(
					ctx,
					credentials,
					emailAddress,
					historyId,
				);

				if (modified.length > 0) {
					if (!webhookOptions.syncLabelChanges) {
						await persistHistoryId(ctx, cursorToPersist);
						return {
							success: true,
							corsairEntityId: '',
							data: {
								type: 'messageLabelChanged' as const,
								emailAddress,
								historyId,
								message: {},
								skipped: 'label-only' as const,
							},
						};
					}

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
						message: result.message,
					};

					await emitGmailWebhookEvent(
						ctx,
						'gmail.webhook.messageLabelChanged',
						eventData,
					);
					await persistHistoryId(ctx, cursorToPersist);

					return {
						success: true,
						corsairEntityId: result.corsairEntityId,
						data: {
							...eventData,
							message: result.message ?? {},
						},
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
						message: result.message,
					};

					await emitGmailWebhookEvent(
						ctx,
						'gmail.webhook.messageReceived',
						eventData,
					);
					await persistHistoryId(ctx, cursorToPersist);

					return {
						success: true,
						corsairEntityId: result.corsairEntityId,
						data: {
							...eventData,
							message: result.message ?? {},
						},
					};
				}
			}

			await persistHistoryId(ctx, cursorToPersist);

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
