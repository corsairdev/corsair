import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core/webhooks';
import { logEventFromContext } from '../../utils/events';
import type { GmailContext } from '..';
import { makeGmailRequest } from '../client';
import type { HistoryListResponse, Message, MessagePart } from '../types';
import type {
	GmailPushNotification,
	MessageDeletedEvent,
	MessageLabelChangedEvent,
	MessageReceivedEvent,
	PubSubNotification,
} from './types';

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

function decodePubSubMessage(data: string): GmailPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
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
				query: {
					format: 'full',
				},
			},
		),
		makeGmailRequest<Message>(
			`/users/${userId}/messages/${messageId}`,
			credentials,
			{
				method: 'GET',
				query: {
					format: 'raw',
				},
			},
		).catch(() => null),
	]);

	return {
		...fullMessage,
		raw: rawMessage?.raw,
	};
}

async function fetchAttachment(
	credentials: string,
	userId: string,
	messageId: string,
	attachmentId: string,
): Promise<{ data: string; size: number }> {
	return await makeGmailRequest<{ data: string; size: number }>(
		`/users/${userId}/messages/${messageId}/attachments/${attachmentId}`,
		credentials,
		{
			method: 'GET',
		},
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
	return {
		...message,
		payload: enrichedPayload,
	};
}

export const messageReceived = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.historyId && !!pushNotification.emailAddress;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GmailContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;

		try {
			const historyIdNum = Number(pushNotification.historyId);
			const previousHistoryId =
				historyIdNum > 1
					? String(historyIdNum - 1)
					: pushNotification.historyId;

			const historyResponse = await makeGmailRequest<HistoryListResponse>(
				`/users/${pushNotification.emailAddress}/history`,
				credentials,
				{
					method: 'GET',
					query: {
						startHistoryId: previousHistoryId,
						maxResults: 100,
					},
				},
			);

			const { added } = extractMessageIds(historyResponse.history);

			if (added.length === 0 && !ctx.db?.messages) {
				console.warn(
					'⚠️ No messages found in history and database not available',
				);
			}

			if (added.length === 0) {
				const messagesResponse = await makeGmailRequest<{
					messages?: Array<{ id?: string }>;
				}>(`/users/${pushNotification.emailAddress}/messages`, credentials, {
					method: 'GET',
					query: {
						maxResults: 10,
					},
				});

				if (messagesResponse.messages && messagesResponse.messages.length > 0) {
					const targetHistoryIdNum = Number(pushNotification.historyId);
					for (const msg of messagesResponse.messages) {
						if (msg.id) {
							try {
								const fullMessage = await fetchFullMessage(
									credentials,
									pushNotification.emailAddress!,
									msg.id,
								);

								const messageHistoryIdNum = fullMessage.historyId
									? Number(fullMessage.historyId)
									: 0;
								if (messageHistoryIdNum >= targetHistoryIdNum - 10) {
									added.push(msg.id);
									break;
								}
							} catch {}
						}
					}
				}
			}

			let firstProcessedMessage: Message | null = null;
			let corsairEntityId = '';

			for (const messageId of added) {
				try {
					const fullMessage = await fetchFullMessage(
						credentials,
						pushNotification.emailAddress!,
						messageId,
					);

					const enrichedMessage = await enrichMessageWithAttachments(
						credentials,
						pushNotification.emailAddress!,
						fullMessage,
					);

					if (!firstProcessedMessage) {
						firstProcessedMessage = enrichedMessage;
					}

					if (!ctx.db?.messages) {
						console.warn(
							'⚠️ ctx.db.messages is not available - database may not be configured',
						);
						continue;
					}

					if (!enrichedMessage.id) {
						console.warn('⚠️ Message has no ID, skipping database save');
						continue;
					}

					try {
						const subject = extractSubject(enrichedMessage);
						const bodyText = extractBody(enrichedMessage);
						const from = extractFrom(enrichedMessage);
						const to = extractTo(enrichedMessage);
						const entity = await ctx.db.messages.upsertByEntityId(
							enrichedMessage.id,
							{
								id: enrichedMessage.id,
								threadId: enrichedMessage.threadId,
								labelIds: enrichedMessage.labelIds,
								snippet: enrichedMessage.snippet,
								historyId: enrichedMessage.historyId,
								internalDate: enrichedMessage.internalDate,
								sizeEstimate: enrichedMessage.sizeEstimate,
								payload: enrichedMessage.payload,
								raw: enrichedMessage.raw,
								subject,
								body: bodyText,
								from,
								to,
								createdAt: new Date(),
							},
						);

						if (!corsairEntityId && entity) {
							corsairEntityId = entity.id;
						}
					} catch (dbError) {
						console.error(
							`❌ Failed to save message ${enrichedMessage.id} to database:`,
							dbError,
						);
						throw dbError;
					}
				} catch (error) {
					console.warn(`Failed to process message ${messageId}:`, error);
				}
			}

			const event: MessageReceivedEvent = {
				type: 'messageReceived',
				emailAddress: pushNotification.emailAddress!,
				historyId: pushNotification.historyId!,
				message: firstProcessedMessage || ({} as Message),
			};

			await logEventFromContext(
				ctx,
				'gmail.webhook.messageReceived',
				{ ...event },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		} catch (error) {
			const event: MessageReceivedEvent = {
				type: 'messageReceived',
				emailAddress: pushNotification.emailAddress || '',
				historyId: pushNotification.historyId || '',
				message: {} as Message,
			};
			await logEventFromContext(
				ctx,
				'gmail.webhook.messageReceived',
				{ ...event },
				'failed',
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: event,
			};
		}
	},
};

export const messageDeleted = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.historyId && !!pushNotification.emailAddress;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GmailContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;

		try {
			const historyIdNum = Number(pushNotification.historyId);
			const previousHistoryId =
				historyIdNum > 1
					? String(historyIdNum - 1)
					: pushNotification.historyId;

			const historyResponse = await makeGmailRequest<HistoryListResponse>(
				`/users/${pushNotification.emailAddress}/history`,
				credentials,
				{
					method: 'GET',
					query: {
						startHistoryId: previousHistoryId,
						maxResults: 100,
					},
				},
			);

			const { deleted } = extractMessageIds(historyResponse.history);

			let firstDeletedMessage: Message | null = null;
			let corsairEntityId = '';

			if (!ctx.db?.messages) {
				console.warn(
					'⚠️ ctx.db.messages is not available - database may not be configured',
				);
				const event: MessageDeletedEvent = {
					type: 'messageDeleted',
					emailAddress: pushNotification.emailAddress!,
					historyId: pushNotification.historyId!,
					message: {} as Message,
				};
				return {
					success: true,
					data: event,
				};
			}

			for (const messageId of deleted) {
				try {
					let message: Message | null = null;
					try {
						message = await makeGmailRequest<Message>(
							`/users/${pushNotification.emailAddress}/messages/${messageId}`,
							credentials,
							{
								method: 'GET',
								query: {
									format: 'full',
								},
							},
						);
					} catch (fetchError: any) {
						if (fetchError?.statusCode === 404) {
							console.log(
								`Message ${messageId} not found in Gmail (already deleted), skipping DB delete`,
							);
							continue;
						}
					}

					if (!firstDeletedMessage && message) {
						firstDeletedMessage = message;
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

			const event: MessageDeletedEvent = {
				type: 'messageDeleted',
				emailAddress: pushNotification.emailAddress!,
				historyId: pushNotification.historyId!,
				message: firstDeletedMessage || ({} as Message),
			};

			await logEventFromContext(
				ctx,
				'gmail.webhook.messageDeleted',
				{ ...event },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		} catch (error) {
			const event: MessageDeletedEvent = {
				type: 'messageDeleted',
				emailAddress: pushNotification.emailAddress || '',
				historyId: pushNotification.historyId || '',
				message: {} as Message,
			};
			await logEventFromContext(
				ctx,
				'gmail.webhook.messageDeleted',
				{ ...event },
				'failed',
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: event,
			};
		}
	},
};

export const messageLabelChanged = {
	match: ((request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.historyId && !!pushNotification.emailAddress;
		} catch {
			return false;
		}
	}) as CorsairWebhookMatcher,

	handler: async (
		ctx: GmailContext,
		request: WebhookRequest<PubSubNotification>,
	) => {
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			return {
				success: false,
				error: 'Invalid push notification format',
				data: { success: false },
			};
		}

		const credentials = ctx.key;

		try {
			const historyIdNum = Number(pushNotification.historyId);
			const previousHistoryId =
				historyIdNum > 1
					? String(historyIdNum - 1)
					: pushNotification.historyId;

			const historyResponse = await makeGmailRequest<HistoryListResponse>(
				`/users/${pushNotification.emailAddress}/history`,
				credentials,
				{
					method: 'GET',
					query: {
						startHistoryId: previousHistoryId,
						maxResults: 100,
					},
				},
			);

			const { modified } = extractMessageIds(historyResponse.history);

			let firstModifiedMessage: Message | null = null;
			let labelsAdded: string[] = [];
			let labelsRemoved: string[] = [];
			let corsairEntityId = '';

			if (!ctx.db?.messages) {
				console.warn(
					'⚠️ ctx.db.messages is not available - database may not be configured',
				);
				const event: MessageLabelChangedEvent = {
					type: 'messageLabelChanged',
					emailAddress: pushNotification.emailAddress!,
					historyId: pushNotification.historyId!,
					message: {} as Message,
					labelsAdded,
					labelsRemoved,
				};
				return {
					success: true,
					data: event,
				};
			}

			for (const messageId of modified) {
				try {
					const fullMessage = await fetchFullMessage(
						credentials,
						pushNotification.emailAddress!,
						messageId,
					);

					const enrichedMessage = await enrichMessageWithAttachments(
						credentials,
						pushNotification.emailAddress!,
						fullMessage,
					);

					if (!firstModifiedMessage) {
						firstModifiedMessage = enrichedMessage;
					}

					if (!enrichedMessage.id) {
						console.warn('⚠️ Message has no ID, skipping database update');
						continue;
					}

					const subject = extractSubject(enrichedMessage);
					const bodyText = extractBody(enrichedMessage);
					const from = extractFrom(enrichedMessage);
					const to = extractTo(enrichedMessage);

					try {
						const entity = await ctx.db.messages.upsertByEntityId(
							enrichedMessage.id,
							{
								id: enrichedMessage.id,
								threadId: enrichedMessage.threadId,
								labelIds: enrichedMessage.labelIds,
								snippet: enrichedMessage.snippet,
								historyId: enrichedMessage.historyId,
								internalDate: enrichedMessage.internalDate,
								sizeEstimate: enrichedMessage.sizeEstimate,
								payload: enrichedMessage.payload,
								raw: enrichedMessage.raw,
								subject,
								body: bodyText,
								from,
								to,
								createdAt: new Date(),
							},
						);

						if (!corsairEntityId && entity) {
							corsairEntityId = entity.id;
						}
					} catch (dbError) {
						console.error(
							`❌ Failed to update message ${enrichedMessage.id} in database:`,
							dbError,
						);
						throw dbError;
					}
				} catch (error) {
					console.warn(`Failed to process message ${messageId}:`, error);
				}
			}

			const event: MessageLabelChangedEvent = {
				type: 'messageLabelChanged',
				emailAddress: pushNotification.emailAddress!,
				historyId: pushNotification.historyId!,
				message: firstModifiedMessage || ({} as Message),
				labelsAdded,
				labelsRemoved,
			};

			await logEventFromContext(
				ctx,
				'gmail.webhook.messageLabelChanged',
				{ ...event },
				'completed',
			);

			return {
				success: true,
				corsairEntityId,
				data: event,
			};
		} catch (error) {
			const event: MessageLabelChangedEvent = {
				type: 'messageLabelChanged',
				emailAddress: pushNotification.emailAddress || '',
				historyId: pushNotification.historyId || '',
				message: {} as Message,
			};
			await logEventFromContext(
				ctx,
				'gmail.webhook.messageLabelChanged',
				{ ...event },
				'failed',
			);
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: event,
			};
		}
	},
};
