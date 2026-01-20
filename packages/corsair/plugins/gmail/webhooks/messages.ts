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
import type { HistoryListResponse, Message, MessagePart } from '../types';

function getHeaderValue(part: MessagePart | undefined, headerName: string): string | undefined {
	if (!part?.headers) {
		return undefined;
	}
	const header = part.headers.find((h) => h.name?.toLowerCase() === headerName.toLowerCase());
	return header?.value;
}

function extractSubject(message: Message): string | undefined {
	if (!message.payload) {
		return undefined;
	}
	return getHeaderValue(message.payload, 'Subject');
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
		} catch {
		}
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

async function fetchFullMessage(
	credentials: {
		clientId: string;
		clientSecret: string;
		accessToken: string;
		refreshToken: string;
	},
	userId: string,
	messageId: string,
): Promise<Message> {
	const [fullMessage, rawMessage] = await Promise.all([
		makeGmailRequest<Message>(`/users/${userId}/messages/${messageId}`, credentials, {
			method: 'GET',
			query: {
				format: 'full',
			},
		}),
		makeGmailRequest<Message>(`/users/${userId}/messages/${messageId}`, credentials, {
			method: 'GET',
			query: {
				format: 'raw',
			},
		}).catch(() => null),
	]);

	return {
		...fullMessage,
		raw: rawMessage?.raw,
	};
}

async function fetchAttachment(
	credentials: {
		clientId: string;
		clientSecret: string;
		accessToken: string;
		refreshToken: string;
	},
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
	credentials: {
		clientId: string;
		clientSecret: string;
		accessToken: string;
		refreshToken: string;
	},
	userId: string,
	message: Message,
): Promise<Message> {
	if (!message.payload) {
		return message;
	}

	const enrichPart = async (part: MessagePart | undefined): Promise<MessagePart | undefined> => {
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

	handler: async (ctx: GmailContext, request: WebhookRequest<PubSubNotification>) => {
		console.log('\n🔵 Gmail webhook handler called - messageReceived');
		console.log('   Database available:', !!ctx.db);
		console.log('   Messages service available:', !!ctx.db?.messages);
		
		const body = request.payload as PubSubNotification;

		if (!body.message?.data) {
			console.warn('   ⚠️ No message data in notification');
			return {
				success: false,
				error: 'No message data in notification',
				data: { success: false },
			};
		}

		const pushNotification = decodePubSubMessage(body.message.data!);
		console.log('   Email Address:', pushNotification.emailAddress);
		console.log('   History ID:', pushNotification.historyId);

		if (!pushNotification.historyId || !pushNotification.emailAddress) {
			console.warn('   ⚠️ Invalid push notification format');
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
			console.log('   📥 Fetching history from Gmail API...');
			const historyResponse = await fetchHistory(
				credentials,
				pushNotification.emailAddress!,
				pushNotification.historyId!,
			);

			console.log('   📊 History response received');
			console.log('   History items count:', historyResponse.history?.length || 0);

			if (historyResponse.history) {
				for (const historyItem of historyResponse.history) {
					console.log('   🔍 Processing history item...');
					if (historyItem.messagesAdded && historyItem.messagesAdded.length > 0) {
						console.log(`   ✉️ Found ${historyItem.messagesAdded.length} message(s) added`);
						for (const added of historyItem.messagesAdded) {
							if (added.message?.id) {
								console.log(`   📧 Processing message ID: ${added.message.id}`);
								try {
									console.log(`   🔄 Fetching full message for ${added.message.id}...`);
									const fullMessage = await fetchFullMessage(
										credentials,
										pushNotification.emailAddress!,
										added.message.id,
									);
									console.log(`   ✅ Full message fetched, enriching with attachments...`);

									const enrichedMessage = await enrichMessageWithAttachments(
										credentials,
										pushNotification.emailAddress!,
										fullMessage,
									);
									console.log(`   ✅ Message enriched, storing in database...`);

									const event: MessageReceivedEvent = {
										type: 'messageReceived',
										emailAddress: pushNotification.emailAddress!,
										historyId: pushNotification.historyId!,
										message: enrichedMessage,
									};

									if (ctx.db.messages && enrichedMessage.id) {
										try {
											const subject = extractSubject(enrichedMessage);
											const body = extractBody(enrichedMessage);
											const dataToStore = {
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
												body,
												createdAt: new Date(),
											};
											console.log(`   💾 Attempting to store message ${enrichedMessage.id}...`);
											console.log(`   Data keys: ${Object.keys(dataToStore).join(', ')}`);
											console.log(`   Has payload: ${!!dataToStore.payload}`);
											console.log(`   Has raw: ${!!dataToStore.raw}`);
											console.log(`   Payload type: ${typeof dataToStore.payload}`);
											console.log(`   Raw length: ${dataToStore.raw?.length || 0}`);
											
											try {
												const result = await ctx.db.messages.upsert(enrichedMessage.id, dataToStore);
												
												console.log(`   ✅ Upsert completed for message ${enrichedMessage.id}`);
												console.log(`   Result ID: ${result?.id || 'no id'}`);
												console.log(`   Result resource_id: ${result?.resource_id || 'no resource_id'}`);
												console.log(`   Result tenant_id: ${result?.tenant_id || 'no tenant_id'}`);
												console.log(`   Result resource: ${result?.resource || 'no resource'}`);
												console.log(`   Result service: ${result?.service || 'no service'}`);
												
												if (result) {
													console.log(`✅ Successfully stored message ${enrichedMessage.id} in resources table`);
												} else {
													console.error(`❌ Upsert returned null/undefined for message ${enrichedMessage.id}`);
												}
											} catch (validationError) {
												console.error(`❌ Validation or database error for message ${enrichedMessage.id}:`, validationError);
												if (validationError instanceof Error) {
													console.error('   Error name:', validationError.name);
													console.error('   Error message:', validationError.message);
													if ('issues' in validationError && Array.isArray((validationError as any).issues)) {
														console.error('   Validation issues:', JSON.stringify((validationError as any).issues, null, 2));
													}
												}
												throw validationError;
											}
										} catch (error) {
											console.error('❌ Failed to save message to database:', error);
											if (error instanceof Error) {
												console.error('Error message:', error.message);
												console.error('Error stack:', error.stack);
											}
											if (error && typeof error === 'object' && 'cause' in error) {
												console.error('Error cause:', error.cause);
											}
										}
									} else {
										console.warn('⚠️ ctx.db.messages is not available - database may not be configured');
									}
								} catch (error) {
									console.warn(
										`Failed to fetch full message ${added.message.id}:`,
										error,
									);
									if (ctx.db.messages && added.message.id) {
										try {
											const subject = extractSubject(added.message);
											const body = extractBody(added.message);
											await ctx.db.messages.upsert(added.message.id, {
												id: added.message.id,
												threadId: added.message.threadId,
												labelIds: added.message.labelIds,
												snippet: added.message.snippet,
												historyId: added.message.historyId,
												internalDate: added.message.internalDate,
												sizeEstimate: added.message.sizeEstimate,
												payload: added.message.payload,
												raw: added.message.raw,
												subject,
												body,
												createdAt: new Date(),
											});
										} catch (dbError) {
											console.warn('Failed to save message to database:', dbError);
										}
									}
								}
							}
						}
					}
				}
			} else {
				console.log('   ⚠️ No history items found in response');
			}

			console.log('   ✅ Handler completed successfully');
			return {
				success: true,
				data: { success: true },
			};
		} catch (error) {
			console.error('   ❌ Handler error:', error);
			if (error instanceof Error) {
				console.error('   Error message:', error.message);
				console.error('   Error stack:', error.stack);
			}
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
							if (labelChange.message?.id) {
								try {
									const fullMessage = await fetchFullMessage(
										credentials,
										pushNotification.emailAddress!,
										labelChange.message.id,
									);

									const enrichedMessage = await enrichMessageWithAttachments(
										credentials,
										pushNotification.emailAddress!,
										fullMessage,
									);

									const event: MessageLabelChangedEvent = {
										type: 'messageLabelChanged',
										emailAddress: pushNotification.emailAddress!,
										historyId: pushNotification.historyId!,
										message: enrichedMessage,
										labelsAdded: labelChange.labelIds,
									};

									if (ctx.db.messages && enrichedMessage.id) {
										try {
											const subject = extractSubject(enrichedMessage);
											const body = extractBody(enrichedMessage);
											const result = await ctx.db.messages.upsert(enrichedMessage.id, {
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
												body,
												createdAt: new Date(),
											});
											console.log(`✅ Successfully stored message ${enrichedMessage.id} in resources table`);
										} catch (error) {
											console.error('❌ Failed to update message in database:', error);
											if (error instanceof Error) {
												console.error('Error message:', error.message);
												console.error('Error stack:', error.stack);
											}
										}
									} else {
										console.warn('⚠️ ctx.db.messages is not available - database may not be configured');
									}
								} catch (error) {
									console.warn(
										`Failed to fetch full message ${labelChange.message.id}:`,
										error,
									);
									if (ctx.db.messages && labelChange.message.id) {
										try {
											const subject = extractSubject(labelChange.message);
											const body = extractBody(labelChange.message);
											await ctx.db.messages.upsert(labelChange.message.id, {
												id: labelChange.message.id,
												threadId: labelChange.message.threadId,
												labelIds: labelChange.message.labelIds,
												snippet: labelChange.message.snippet,
												historyId: labelChange.message.historyId,
												internalDate: labelChange.message.internalDate,
												sizeEstimate: labelChange.message.sizeEstimate,
												payload: labelChange.message.payload,
												raw: labelChange.message.raw,
												subject,
												body,
												createdAt: new Date(),
											});
										} catch (dbError) {
											console.warn(
												'Failed to update message in database:',
												dbError,
											);
										}
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
							if (labelChange.message?.id) {
								try {
									const fullMessage = await fetchFullMessage(
										credentials,
										pushNotification.emailAddress!,
										labelChange.message.id,
									);

									const enrichedMessage = await enrichMessageWithAttachments(
										credentials,
										pushNotification.emailAddress!,
										fullMessage,
									);

									const event: MessageLabelChangedEvent = {
										type: 'messageLabelChanged',
										emailAddress: pushNotification.emailAddress!,
										historyId: pushNotification.historyId!,
										message: enrichedMessage,
										labelsRemoved: labelChange.labelIds,
									};

									if (ctx.db.messages && enrichedMessage.id) {
										try {
											const subject = extractSubject(enrichedMessage);
											const body = extractBody(enrichedMessage);
											const result = await ctx.db.messages.upsert(enrichedMessage.id, {
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
												body,
												createdAt: new Date(),
											});
											console.log(`✅ Successfully stored message ${enrichedMessage.id} in resources table`);
										} catch (error) {
											console.error('❌ Failed to update message in database:', error);
											if (error instanceof Error) {
												console.error('Error message:', error.message);
												console.error('Error stack:', error.stack);
											}
										}
									} else {
										console.warn('⚠️ ctx.db.messages is not available - database may not be configured');
									}
								} catch (error) {
									console.warn(
										`Failed to fetch full message ${labelChange.message.id}:`,
										error,
									);
									if (ctx.db.messages && labelChange.message.id) {
										try {
											const subject = extractSubject(labelChange.message);
											const body = extractBody(labelChange.message);
											await ctx.db.messages.upsert(labelChange.message.id, {
												id: labelChange.message.id,
												threadId: labelChange.message.threadId,
												labelIds: labelChange.message.labelIds,
												snippet: labelChange.message.snippet,
												historyId: labelChange.message.historyId,
												internalDate: labelChange.message.internalDate,
												sizeEstimate: labelChange.message.sizeEstimate,
												payload: labelChange.message.payload,
												raw: labelChange.message.raw,
												subject,
												body,
												createdAt: new Date(),
											});
										} catch (dbError) {
											console.warn(
												'Failed to update message in database:',
												dbError,
											);
										}
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
