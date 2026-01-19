import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from '../../../core/webhooks';
import type { GmailContext, GmailWebhooks } from '..';
import type {
	GmailPushNotification,
	MessageDeletedEvent,
	MessageLabelChangedEvent,
	MessageReceivedEvent,
	PubSubNotification,
} from './types';
import { makeGmailRequest } from '../client';
import type { HistoryListResponse } from '../types';

function decodePubSubMessage(data: string): GmailPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

async function fetchHistory(
	credentials: {
		clientId: string;
		clientSecret: string;
		accessToken: string;
		refreshToken: string;
	},
	userId: string,
	startHistoryId: string,
): Promise<HistoryListResponse> {
	return await makeGmailRequest<HistoryListResponse>(
		`/users/${userId}/history`,
		credentials,
		{
			method: 'GET',
			query: {
				startHistoryId,
				maxResults: 100,
			},
		},
	);
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

	handler: async (ctx: GmailContext, request: WebhookRequest<PubSubNotification>) => {
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

		const credentials = {
			clientId: ctx.options.clientId,
			clientSecret: ctx.options.clientSecret,
			accessToken: ctx.options.accessToken,
			refreshToken: ctx.options.refreshToken,
		};

		try {
			const historyResponse = await fetchHistory(
				credentials,
				pushNotification.emailAddress!,
				pushNotification.historyId!,
			);

			if (historyResponse.history) {
				for (const historyItem of historyResponse.history) {
					if (historyItem.messagesAdded && historyItem.messagesAdded.length > 0) {
						for (const added of historyItem.messagesAdded) {
							if (added.message) {
								const event: MessageReceivedEvent = {
									type: 'messageReceived',
									emailAddress: pushNotification.emailAddress!,
									historyId: pushNotification.historyId!,
									message: added.message!,
								};

								if (ctx.db.messages && added.message.id) {
									try {
										await ctx.db.messages.upsert(added.message.id, {
											id: added.message.id,
											threadId: added.message.threadId,
											labelIds: added.message.labelIds,
											snippet: added.message.snippet,
											historyId: added.message.historyId,
											internalDate: added.message.internalDate,
											sizeEstimate: added.message.sizeEstimate,
											createdAt: new Date(),
										});
									} catch (error) {
										console.warn('Failed to save message to database:', error);
									}
								}
							}
						}
					}
				}
			}

			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: { success: false },
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

	handler: async (ctx: GmailContext, request: WebhookRequest<PubSubNotification>) => {
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

		const credentials = {
			clientId: ctx.options.clientId,
			clientSecret: ctx.options.clientSecret,
			accessToken: ctx.options.accessToken,
			refreshToken: ctx.options.refreshToken,
		};

		try {
			const historyResponse = await fetchHistory(
				credentials,
				pushNotification.emailAddress!,
				pushNotification.historyId!,
			);

			if (historyResponse.history) {
				for (const historyItem of historyResponse.history) {
					if (
						historyItem.messagesDeleted &&
						historyItem.messagesDeleted.length > 0
					) {
						for (const deleted of historyItem.messagesDeleted) {
							if (deleted.message) {
								const event: MessageDeletedEvent = {
									type: 'messageDeleted',
									emailAddress: pushNotification.emailAddress!,
									historyId: pushNotification.historyId!,
									message: deleted.message!,
								};

								if (ctx.db.messages && deleted.message.id) {
									try {
										await ctx.db.messages.deleteByResourceId(deleted.message.id);
									} catch (error) {
										console.warn(
											'Failed to delete message from database:',
											error,
										);
									}
								}
							}
						}
					}
				}
			}

			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: { success: false },
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

	handler: async (ctx: GmailContext, request: WebhookRequest<PubSubNotification>) => {
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

		const credentials = {
			clientId: ctx.options.clientId,
			clientSecret: ctx.options.clientSecret,
			accessToken: ctx.options.accessToken,
			refreshToken: ctx.options.refreshToken,
		};

		try {
			const historyResponse = await fetchHistory(
				credentials,
				pushNotification.emailAddress!,
				pushNotification.historyId!,
			);

			if (historyResponse.history) {
				for (const historyItem of historyResponse.history) {
					if (historyItem.labelsAdded && historyItem.labelsAdded.length > 0) {
						for (const labelChange of historyItem.labelsAdded) {
							if (labelChange.message) {
								const event: MessageLabelChangedEvent = {
									type: 'messageLabelChanged',
									emailAddress: pushNotification.emailAddress!,
									historyId: pushNotification.historyId!,
									message: labelChange.message!,
									labelsAdded: labelChange.labelIds,
								};

								if (ctx.db.messages && labelChange.message.id) {
									try {
										await ctx.db.messages.upsert(labelChange.message.id, {
											id: labelChange.message.id,
											threadId: labelChange.message.threadId,
											labelIds: labelChange.message.labelIds,
											snippet: labelChange.message.snippet,
											historyId: labelChange.message.historyId,
											internalDate: labelChange.message.internalDate,
											sizeEstimate: labelChange.message.sizeEstimate,
											createdAt: new Date(),
										});
									} catch (error) {
										console.warn(
											'Failed to update message in database:',
											error,
										);
									}
								}
							}
						}
					}

					if (
						historyItem.labelsRemoved &&
						historyItem.labelsRemoved.length > 0
					) {
						for (const labelChange of historyItem.labelsRemoved) {
							if (labelChange.message) {
								const event: MessageLabelChangedEvent = {
									type: 'messageLabelChanged',
									emailAddress: pushNotification.emailAddress!,
									historyId: pushNotification.historyId!,
									message: labelChange.message!,
									labelsRemoved: labelChange.labelIds,
								};

								if (ctx.db.messages && labelChange.message.id) {
									try {
										await ctx.db.messages.upsert(labelChange.message.id, {
											id: labelChange.message.id,
											threadId: labelChange.message.threadId,
											labelIds: labelChange.message.labelIds,
											snippet: labelChange.message.snippet,
											historyId: labelChange.message.historyId,
											internalDate: labelChange.message.internalDate,
											sizeEstimate: labelChange.message.sizeEstimate,
											createdAt: new Date(),
										});
									} catch (error) {
										console.warn(
											'Failed to update message in database:',
											error,
										);
									}
								}
							}
						}
					}
				}
			}

			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
				data: { success: false },
			};
		}
	},
};
