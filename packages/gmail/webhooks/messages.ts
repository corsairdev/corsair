import { logEventFromContext } from 'corsair/core';
import { makeGmailRequest } from '../client';
import type { GmailWebhooks } from '../index';
import type { HistoryListResponse, Message, MessagePart } from '../types';
import type { GmailPushNotification, GmailWebhookEventType } from './types';
import { createGmailWebhookMatcher, decodePubSubMessage } from './types';

const HISTORY_MAX_RESULTS = 100;
const RECENT_MESSAGES_LIMIT = 10;
const HISTORY_ID_MATCH_THRESHOLD = 10;

function isWebhookEventEnabled(
	ctx: MessageChangedContext,
	eventType: GmailWebhookEventType,
): boolean {
	const configured = ctx.options?.webhookEvents;
	if (!configured) {
		return true;
	}
	return configured.includes(eventType);
}

async function fetchHistory(
	credentials: string,
	emailAddress: string,
	startHistoryId: string,
): Promise<NonNullable<HistoryListResponse['history']>> {
	const allHistory: NonNullable<HistoryListResponse['history']> = [];
	let pageToken: string | undefined;

	do {
		const historyResponse = await makeGmailRequest<HistoryListResponse>(
			`/users/${emailAddress}/history`,
			credentials,
			{
				method: 'GET',
				query: {
					startHistoryId,
					maxResults: HISTORY_MAX_RESULTS,
					...(pageToken ? { pageToken } : {}),
				},
			},
		);

		if (historyResponse.history) {
			allHistory.push(...historyResponse.history);
		}

		pageToken = historyResponse.nextPageToken;
	} while (pageToken);

	return allHistory;
}

async function fetchMessageMetadata(
	credentials: string,
	userId: string,
	messageId: string,
): Promise<Message> {
	return makeGmailRequest<Message>(
		`/users/${userId}/messages/${messageId}`,
		credentials,
		{
			method: 'GET',
			query: { format: 'minimal' },
		},
	);
}

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

function isNotFoundError(error: unknown): boolean {
	if (typeof error !== 'object' || error === null) {
		return false;
	}
	if ('status' in error && error.status === 404) {
		return true;
	}
	return 'statusCode' in error && error.statusCode === 404;
}

async function getStoredHistoryId(
	ctx: MessageChangedContext,
): Promise<string | null> {
	try {
		const stored = await ctx.keys?.get_last_history_id?.();
		return stored || null;
	} catch {
		// The keys manager is unavailable without a database + kek; treat the
		// cursor as absent and fall back to scanning from the push itself.
		return null;
	}
}

async function advanceHistoryCursor(
	ctx: MessageChangedContext,
	nextHistoryId: string,
	storedHistoryId: string | null,
): Promise<void> {
	const nextNum = Number(nextHistoryId);
	const storedNum = storedHistoryId ? Number(storedHistoryId) : Number.NaN;
	if (
		Number.isFinite(nextNum) &&
		Number.isFinite(storedNum) &&
		nextNum <= storedNum
	) {
		// Never move the cursor backwards (concurrent pushes can finish out of
		// order); re-processing older ranges is redundant but idempotent.
		return;
	}

	try {
		await ctx.keys?.set_last_history_id?.(nextHistoryId);
	} catch (error) {
		console.warn('Failed to persist Gmail webhook history cursor:', error);
	}
}

function maxHistoryRecordId(
	history: NonNullable<HistoryListResponse['history']>,
): string | null {
	let max = 0;
	for (const record of history) {
		const recordId = record.id ? Number(record.id) : Number.NaN;
		if (Number.isFinite(recordId) && recordId > max) {
			max = recordId;
		}
	}
	return max > 0 ? String(max) : null;
}

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
			const minimalMessage = await fetchMessageMetadata(
				credentials,
				emailAddress,
				msg.id,
			);
			const messageHistoryIdNum = minimalMessage.historyId
				? Number(minimalMessage.historyId)
				: 0;

			if (
				messageHistoryIdNum >=
				targetHistoryIdNum - HISTORY_ID_MATCH_THRESHOLD
			) {
				if (ctx.db?.messages) {
					const exists = await ctx.db.messages.existsByEntityId(msg.id);
					if (exists) {
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

type ProcessResult = {
	message: Message | null;
	corsairEntityId: string;
	/** Messages that could not be fetched or persisted; holds the cursor back so the next push retries them. */
	failedCount: number;
};

async function processAddedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	messageIds: string[],
): Promise<ProcessResult> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';
	let failedCount = 0;

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
			failedCount++;
			console.warn(`Failed to process message ${messageId}:`, error);
		}
	}

	return { message: firstMessage, corsairEntityId, failedCount };
}

async function processDeletedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	deletedIds: string[],
): Promise<ProcessResult> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';
	let failedCount = 0;

	if (!ctx.db?.messages) {
		return { message: null, corsairEntityId, failedCount };
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
				// Using 'any' because Gmail API error shape varies and we only check status.
				// A 404 here means Gmail no longer has the message, which is exactly
				// the case where we still need to delete the local row. Fall through
				// to deleteByEntityId below instead of skipping (the prior continue
				// left stale rows in the DB and let the cursor advance past the
				// unapplied deletion).
				if (!isNotFoundError(fetchError)) {
					throw fetchError;
				}
			}

			if (!firstMessage && message) {
				firstMessage = message;
			}

			if (!corsairEntityId) {
				const entityId = await ctx.db.messages.findIdByEntityId(messageId);
				if (entityId) {
					corsairEntityId = entityId;
				}
			}

			await ctx.db.messages.deleteByEntityId(messageId);
		} catch (deleteError) {
			failedCount++;
			console.warn(
				`Failed to delete message ${messageId} from database:`,
				deleteError,
			);
		}
	}

	return { message: firstMessage, corsairEntityId, failedCount };
}

async function processModifiedMessages(
	ctx: MessageChangedContext,
	credentials: string,
	emailAddress: string,
	modifiedIds: string[],
): Promise<ProcessResult> {
	let firstMessage: Message | null = null;
	let corsairEntityId = '';
	let failedCount = 0;

	if (!ctx.db?.messages) {
		return { message: null, corsairEntityId, failedCount };
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
			failedCount++;
			console.warn(`Failed to process message ${messageId}:`, error);
		}
	}

	return { message: firstMessage, corsairEntityId, failedCount };
}

export const messageChanged: GmailWebhooks['messageChanged'] = {
	match: createGmailWebhookMatcher('messageChanged'),
	handler: async (ctx, request) => {
		const body = request.payload;
		const messageData = body.message?.data;

		if (!messageData) {
			return { success: false, error: 'No message data in notification' };
		}

		let pushNotification: GmailPushNotification;
		try {
			pushNotification = decodePubSubMessage(messageData);
		} catch {
			return { success: false, error: 'Invalid push notification format' };
		}

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return { success: false, error: 'Invalid push notification format' };
		}

		const credentials = ctx.key;
		const emailAddress = pushNotification.emailAddress;
		const historyId = pushNotification.historyId;

		try {
			// Scan from the last processed history record when a cursor exists.
			// Deriving the start from `historyId - 1` alone races Gmail's history
			// indexing and silently misses messages (#445), so the cursor is
			// persisted across pushes and only the first push falls back to it.
			const storedHistoryId = await getStoredHistoryId(ctx);
			const startHistoryId =
				storedHistoryId ?? computePreviousHistoryId(historyId);

			let history: NonNullable<HistoryListResponse['history']>;
			try {
				history = await fetchHistory(credentials, emailAddress, startHistoryId);
			} catch (error) {
				if (storedHistoryId && isNotFoundError(error)) {
					// Gmail rejects startHistoryId values outside its retention
					// window (~1 week) with a 404; rescan from this push instead.
					history = await fetchHistory(
						credentials,
						emailAddress,
						computePreviousHistoryId(historyId),
					);
				} else {
					throw error;
				}
			}

			const extracted = extractMessageIds(history);
			const addedSet = new Set(extracted.added);
			const deletedSet = new Set(extracted.deleted);

			let added = extracted.added;
			const deleted = extracted.deleted;
			// A message added or deleted in this batch may also carry label
			// records; the add/delete already captures its latest state.
			let modified = extracted.modified.filter(
				(id) => !addedSet.has(id) && !deletedSet.has(id),
			);

			const historyHadChanges =
				added.length > 0 || deleted.length > 0 || modified.length > 0;

			let usedFallback = false;
			if (!historyHadChanges && !storedHistoryId) {
				// First push for this account: the history record may not be
				// queryable yet, so inspect recent messages directly.
				const fallback = await resolveAndCategorizeMessageIds(
					ctx,
					credentials,
					emailAddress,
					historyId,
				);
				added = fallback.added;
				modified = fallback.modified;
				usedFallback = true;
			}

			// Sync every category to the database. Returning after the first
			// non-empty category (as before) dropped the other categories from
			// the sync entirely.
			const addedResult =
				added.length > 0 && isWebhookEventEnabled(ctx, 'messageReceived')
					? await processAddedMessages(ctx, credentials, emailAddress, added)
					: null;
			const deletedResult =
				deleted.length > 0 && isWebhookEventEnabled(ctx, 'messageDeleted')
					? await processDeletedMessages(
							ctx,
							credentials,
							emailAddress,
							deleted,
						)
					: null;
			const modifiedResult =
				modified.length > 0 && isWebhookEventEnabled(ctx, 'messageLabelChanged')
					? await processModifiedMessages(
							ctx,
							credentials,
							emailAddress,
							modified,
						)
					: null;

			const failedCount =
				(addedResult?.failedCount ?? 0) +
				(deletedResult?.failedCount ?? 0) +
				(modifiedResult?.failedCount ?? 0);

			if (failedCount > 0) {
				// A fetch, upsert, or delete failed: hold the cursor back so the
				// next push re-scans this history range and retries. Re-processing
				// the successful entries is idempotent (upsert / delete by entity
				// id). Without a cursor yet, park it just before this push so the
				// retry range stays covered.
				if (!storedHistoryId) {
					await advanceHistoryCursor(
						ctx,
						computePreviousHistoryId(historyId),
						storedHistoryId,
					);
				}
			} else {
				const latestRecordId = maxHistoryRecordId(history);
				if (latestRecordId) {
					await advanceHistoryCursor(ctx, latestRecordId, storedHistoryId);
				} else if (usedFallback && (added.length > 0 || modified.length > 0)) {
					// The fallback already handled everything up to this push.
					await advanceHistoryCursor(ctx, historyId, storedHistoryId);
				} else if (!storedHistoryId) {
					// Nothing visible yet: start the cursor just before this push so
					// the next one re-scans anything Gmail had not indexed in time.
					await advanceHistoryCursor(
						ctx,
						computePreviousHistoryId(historyId),
						storedHistoryId,
					);
				}
				// With a cursor and no new records, the cursor stays put so a
				// lagging record is picked up by the next push.
			}

			// The response carries a single event: a received message is the most
			// significant outcome of a batch, then a deletion, then a label change.
			if (addedResult) {
				const eventData = {
					type: 'messageReceived' as const,
					emailAddress,
					historyId,
					message: addedResult.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageReceived',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: addedResult.corsairEntityId,
					data: eventData,
				};
			}

			if (deletedResult) {
				const eventData = {
					type: 'messageDeleted' as const,
					emailAddress,
					historyId,
					message: deletedResult.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageDeleted',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: deletedResult.corsairEntityId,
					data: eventData,
				};
			}

			if (modifiedResult) {
				const eventData = {
					type: 'messageLabelChanged' as const,
					emailAddress,
					historyId,
					message: modifiedResult.message ?? {},
				};

				await logEventFromContext(
					ctx,
					'gmail.webhook.messageLabelChanged',
					{ ...eventData },
					'completed',
				);

				return {
					success: true,
					corsairEntityId: modifiedResult.corsairEntityId,
					data: eventData,
				};
			}

			return {
				success: true,
				corsairEntityId: '',
				data: undefined,
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
