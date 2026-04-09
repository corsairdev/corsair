import { logEventFromContext } from 'corsair/core';
import type { OutlookEndpoints } from '..';
import { makeOutlookRequest } from '../client';
import type { OutlookEndpointOutputs } from './types';

const userPath = (userId?: string) => (userId ? `/users/${userId}` : '/me');

// ── DB record helper ──────────────────────────────────────────────────────────

const toMessageRecord = (msg: OutlookEndpointOutputs['messagesGet']) => ({
	// id is asserted non-null — all callers guard with `if (result.id)` before invoking this helper
	id: msg.id!,
	subject: msg.subject,
	bodyPreview: msg.bodyPreview,
	from: msg.from ? JSON.stringify(msg.from) : undefined,
	toRecipients: msg.toRecipients?.length
		? JSON.stringify(msg.toRecipients)
		: undefined,
	ccRecipients: msg.ccRecipients?.length
		? JSON.stringify(msg.ccRecipients)
		: undefined,
	isRead: msg.isRead,
	isDraft: msg.isDraft,
	hasAttachments: msg.hasAttachments,
	importance: msg.importance,
	conversationId: msg.conversationId,
	parentFolderId: msg.parentFolderId,
	sentDateTime: msg.sentDateTime ? new Date(msg.sentDateTime) : undefined,
	receivedDateTime: msg.receivedDateTime
		? new Date(msg.receivedDateTime)
		: undefined,
	createdAt: msg.createdDateTime ? new Date(msg.createdDateTime) : undefined,
	webLink: msg.webLink,
});

// ── Endpoints ─────────────────────────────────────────────────────────────────

export const send: OutlookEndpoints['messagesSend'] = async (ctx, input) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesSend']
	>(`${userPath(input.user_id)}/sendMail`, ctx.key, {
		method: 'POST',
		body: {
			message: {
				subject: input.subject,
				body: {
					contentType: input.is_html ? 'HTML' : 'Text',
					content: input.body,
				},
				toRecipients: [
					{ emailAddress: { address: input.to, name: input.to_name } },
				],
				...(input.cc_emails?.length && {
					ccRecipients: input.cc_emails.map((email) => ({
						emailAddress: { address: email },
					})),
				}),
				...(input.bcc_emails?.length && {
					bccRecipients: input.bcc_emails.map((email) => ({
						emailAddress: { address: email },
					})),
				}),
				...(input.from_address && {
					from: { emailAddress: { address: input.from_address } },
				}),
			},
			saveToSentItems: input.save_to_sent_items ?? true,
		},
	});

	await logEventFromContext(
		ctx,
		'outlook.messages.send',
		{ to: input.to, subject: input.subject },
		'completed',
	);
	return result;
};

export const createDraft: OutlookEndpoints['messagesCreateDraft'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesCreateDraft']
	>(`${userPath()}/messages`, ctx.key, {
		method: 'POST',
		body: {
			subject: input.subject,
			body: {
				contentType: input.is_html ? 'HTML' : 'Text',
				content: input.body,
			},
			...(input.to_recipients?.length && {
				toRecipients: input.to_recipients.map((address) => ({
					emailAddress: { address },
				})),
			}),
			...(input.cc_recipients?.length && {
				ccRecipients: input.cc_recipients.map((address) => ({
					emailAddress: { address },
				})),
			}),
			...(input.bcc_recipients?.length && {
				bccRecipients: input.bcc_recipients.map((address) => ({
					emailAddress: { address },
				})),
			}),
		},
	});

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save draft to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.createDraft',
		{ subject: input.subject },
		'completed',
	);
	return result;
};

export const getMessage: OutlookEndpoints['messagesGet'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesGet']
	>(`${userPath(input.user_id)}/messages/${input.message_id}`, ctx.key, {
		query: {
			...(input.select?.length && { $select: input.select.join(',') }),
		},
	});

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result),
			);
		} catch (error) {
			console.warn('Failed to save message to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.get',
		{ message_id: input.message_id },
		'completed',
	);
	return result;
};

export const listMessages: OutlookEndpoints['messagesList'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);
	const folderPath = input.folder ? `/mailFolders/${input.folder}` : '';

	const filters: string[] = [
		...(input.is_read !== undefined ? [`isRead eq ${input.is_read}`] : []),
		...(input.subject ? [`subject eq '${input.subject}'`] : []),
		...(input.subject_contains
			? [`contains(subject,'${input.subject_contains}')`]
			: []),
		...(input.subject_startswith
			? [`startsWith(subject,'${input.subject_startswith}')`]
			: []),
		...(input.subject_endswith
			? [`endsWith(subject,'${input.subject_endswith}')`]
			: []),
		...(input.from_address
			? [`from/emailAddress/address eq '${input.from_address}'`]
			: []),
		...(input.has_attachments !== undefined
			? [`hasAttachments eq ${input.has_attachments}`]
			: []),
		...(input.importance ? [`importance eq '${input.importance}'`] : []),
		...(input.conversationId
			? [`conversationId eq '${input.conversationId}'`]
			: []),
		...(input.sent_date_time_gt
			? [`sentDateTime gt ${input.sent_date_time_gt}`]
			: []),
		...(input.sent_date_time_lt
			? [`sentDateTime lt ${input.sent_date_time_lt}`]
			: []),
		...(input.received_date_time_ge
			? [`receivedDateTime ge ${input.received_date_time_ge}`]
			: []),
		...(input.received_date_time_gt
			? [`receivedDateTime gt ${input.received_date_time_gt}`]
			: []),
		...(input.received_date_time_le
			? [`receivedDateTime le ${input.received_date_time_le}`]
			: []),
		...(input.received_date_time_lt
			? [`receivedDateTime lt ${input.received_date_time_lt}`]
			: []),
	];

	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesList']
	>(`${base}${folderPath}/messages`, ctx.key, {
		query: {
			...(input.top && { $top: input.top }),
			...(input.skip && { $skip: input.skip }),
			...(input.select?.length && { $select: input.select.join(',') }),
			...(input.orderby?.length && { $orderby: input.orderby.join(',') }),
			...(filters.length && { $filter: filters.join(' and ') }),
		},
	});

	if (result.value?.length && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				if (msg.id) {
					await ctx.db.messages.upsertByEntityId(msg.id, toMessageRecord(msg));
				}
			}
		} catch (error) {
			console.warn('Failed to save messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const queryEmails: OutlookEndpoints['messagesQuery'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);
	const folderPath = input.folder ? `/mailFolders/${input.folder}` : '';

	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesQuery']
	>(`${base}${folderPath}/messages`, ctx.key, {
		query: {
			...(input.top && { $top: input.top }),
			...(input.skip && { $skip: input.skip }),
			...(input.filter && { $filter: input.filter }),
			...(input.select?.length && { $select: input.select.join(',') }),
			...(input.orderby && { $orderby: input.orderby }),
		},
	});

	if (result.value?.length && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				if (msg.id) {
					await ctx.db.messages.upsertByEntityId(msg.id, toMessageRecord(msg));
				}
			}
		} catch (error) {
			console.warn('Failed to save queried messages to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.query',
		{ ...input },
		'completed',
	);
	return result;
};

export const searchMessages: OutlookEndpoints['messagesSearch'] = async (
	ctx,
	input,
) => {
	const searchTerms: string[] = [
		...(input.query ? [input.query] : []),
		...(input.subject ? [`subject:${input.subject}`] : []),
		...(input.fromEmail ? [`from:${input.fromEmail}`] : []),
		...(input.hasAttachments ? ['hasAttachments:true'] : []),
	];

	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesSearch']
	>('/me/messages', ctx.key, {
		query: {
			...(searchTerms.length && { $search: `"${searchTerms.join(' ')}"` }),
			...(input.size && { $top: input.size }),
			...(input.from_index && { $skip: input.from_index }),
			...(input.enable_top_results && { $orderby: 'relevanceScore desc' }),
		},
	});

	if (result.value?.length && ctx.db.messages) {
		try {
			for (const msg of result.value) {
				if (msg.id) {
					await ctx.db.messages.upsertByEntityId(msg.id, toMessageRecord(msg));
				}
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.search',
		{ ...input },
		'completed',
	);
	return result;
};

export const replyEmail: OutlookEndpoints['messagesReply'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesReply']
	>(`${userPath(input.user_id)}/messages/${input.message_id}/reply`, ctx.key, {
		method: 'POST',
		body: {
			comment: input.comment,
			...(input.cc_emails?.length || input.bcc_emails?.length
				? {
						message: {
							...(input.cc_emails?.length && {
								ccRecipients: input.cc_emails.map((email) => ({
									emailAddress: { address: email },
								})),
							}),
							...(input.bcc_emails?.length && {
								bccRecipients: input.bcc_emails.map((email) => ({
									emailAddress: { address: email },
								})),
							}),
						},
					}
				: {}),
		},
	});

	await logEventFromContext(
		ctx,
		'outlook.messages.reply',
		{ message_id: input.message_id },
		'completed',
	);
	return result;
};

export const forwardMessage: OutlookEndpoints['messagesForward'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/messages/${input.message_id}/forward`,
		ctx.key,
		{
			method: 'POST',
			body: {
				comment: input.comment ?? '',
				toRecipients: input.to_recipients.map((email) => ({
					emailAddress: { address: email },
				})),
			},
		},
	);

	await logEventFromContext(
		ctx,
		'outlook.messages.forward',
		{ message_id: input.message_id },
		'completed',
	);
	return { success: true };
};

export const deleteMessage: OutlookEndpoints['messagesDelete'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/messages/${input.message_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.deleteByEntityId(input.message_id);
		} catch (error) {
			console.warn('Failed to delete message from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.delete',
		{ message_id: input.message_id },
		'completed',
	);
	return { success: true };
};

export const moveMessage: OutlookEndpoints['messagesMove'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesMove']
	>(`${userPath(input.user_id)}/messages/${input.message_id}/move`, ctx.key, {
		method: 'POST',
		body: { destinationId: input.destination_id },
	});

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result),
			);
		} catch (error) {
			console.warn('Failed to update moved message in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.move',
		{ message_id: input.message_id, destination_id: input.destination_id },
		'completed',
	);
	return result;
};

export const updateEmail: OutlookEndpoints['messagesUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeOutlookRequest<
		OutlookEndpointOutputs['messagesUpdate']
	>(`${userPath(input.user_id)}/messages/${input.message_id}`, ctx.key, {
		method: 'PATCH',
		body: {
			...(input.is_read !== undefined && { isRead: input.is_read }),
			...(input.subject && { subject: input.subject }),
			...(input.importance && { importance: input.importance }),
			...(input.categories && { categories: input.categories }),
			...(input.to_recipients && { toRecipients: input.to_recipients }),
			...(input.cc_recipients && { ccRecipients: input.cc_recipients }),
			...(input.bcc_recipients && { bccRecipients: input.bcc_recipients }),
			...(input.reply_to && { replyTo: input.reply_to }),
			...(input.flag && { flag: input.flag }),
			...(input.inference_classification && {
				inferenceClassification: input.inference_classification,
			}),
			...(input.is_read_receipt_requested !== undefined && {
				isReadReceiptRequested: input.is_read_receipt_requested,
			}),
			...(input.is_delivery_receipt_requested !== undefined && {
				isDeliveryReceiptRequested: input.is_delivery_receipt_requested,
			}),
		},
	});

	if (result.id && ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(
				result.id,
				toMessageRecord(result),
			);
		} catch (error) {
			console.warn('Failed to update message in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.update',
		{ message_id: input.message_id },
		'completed',
	);
	return result;
};

export const sendDraft: OutlookEndpoints['messagesSendDraft'] = async (
	ctx,
	input,
) => {
	await makeOutlookRequest<void>(
		`${userPath(input.user_id)}/messages/${input.message_id}/send`,
		ctx.key,
		{ method: 'POST', body: {} },
	);

	if (ctx.db.messages) {
		try {
			await ctx.db.messages.upsertByEntityId(input.message_id, {
				id: input.message_id,
				isDraft: false,
			});
		} catch (error) {
			console.warn('Failed to update sent draft in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'outlook.messages.sendDraft',
		{ message_id: input.message_id },
		'completed',
	);
	return { success: true };
};

export const batchMoveMessages: OutlookEndpoints['messagesBatchMove'] = async (
	ctx,
	input,
) => {
	const base = userPath(input.user_id);

	const requests = input.message_ids.map((messageId, index) => ({
		id: String(index + 1),
		method: 'POST',
		url: `${base}/messages/${messageId}/move`,
		body: { destinationId: input.destination_id },
		headers: { 'Content-Type': 'application/json' },
	}));

	const batchResult = await makeOutlookRequest<{
		responses: Array<{
			id: string;
			status: number;
			body?: { id?: string; error?: { message?: string } };
		}>;
	}>('/$batch', ctx.key, { method: 'POST', body: { requests } });

	const results = input.message_ids.map((messageId, index) => {
		const response = batchResult.responses?.find(
			(r) => r.id === String(index + 1),
		);
		const success = response
			? response.status >= 200 && response.status < 300
			: false;
		return {
			original_message_id: messageId,
			moved_message_id: success ? response?.body?.id : undefined,
			success,
			status: response?.status,
			error_message: !success ? response?.body?.error?.message : undefined,
		};
	});

	if (ctx.db.messages) {
		try {
			for (const r of results) {
				if (r.success && r.moved_message_id) {
					await ctx.db.messages.upsertByEntityId(r.moved_message_id, {
						id: r.moved_message_id,
						parentFolderId: input.destination_id,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to update moved messages in database:', error);
		}
	}

	const total_succeeded = results.filter((r) => r.success).length;

	await logEventFromContext(
		ctx,
		'outlook.messages.batchMove',
		{ count: input.message_ids.length, destination_id: input.destination_id },
		'completed',
	);
	return {
		total_requested: input.message_ids.length,
		total_succeeded,
		total_failed: input.message_ids.length - total_succeeded,
		results,
	};
};

export const batchUpdateMessages: OutlookEndpoints['messagesBatchUpdate'] =
	async (ctx, input) => {
		const base = userPath(input.user_id);

		const requests = input.updates.map((update, index) => ({
			id: String(index + 1),
			method: 'PATCH',
			url: `${base}/messages/${update.message_id}`,
			body: update.patch,
			headers: { 'Content-Type': 'application/json' },
		}));

		const batchResult = await makeOutlookRequest<{
			responses: Array<{
				id: string;
				status: number;
				body?: { error?: { message?: string } };
			}>;
		}>('/$batch', ctx.key, { method: 'POST', body: { requests } });

		const results = input.updates.map((update, index) => {
			const response = batchResult.responses?.find(
				(r) => r.id === String(index + 1),
			);
			const success = response
				? response.status >= 200 && response.status < 300
				: false;
			return {
				message_id: update.message_id,
				success,
				status: response?.status,
				error_message: !success ? response?.body?.error?.message : undefined,
			};
		});

		if (ctx.db.messages) {
			try {
				for (const { message_id, patch } of input.updates) {
					const r = results.find((res) => res.message_id === message_id);
					if (r?.success) {
						await ctx.db.messages.upsertByEntityId(message_id, {
							id: message_id,
							...(typeof patch.isRead === 'boolean' && {
								isRead: patch.isRead,
							}),
							...(typeof patch.importance === 'string' && {
								importance: patch.importance,
							}),
						});
					}
				}
			} catch (error) {
				console.warn('Failed to update batch messages in database:', error);
			}
		}

		const total_succeeded = results.filter((r) => r.success).length;

		await logEventFromContext(
			ctx,
			'outlook.messages.batchUpdate',
			{ count: input.updates.length },
			'completed',
		);
		return {
			total_requested: input.updates.length,
			total_succeeded,
			total_failed: input.updates.length - total_succeeded,
			results,
		};
	};

export const addMailAttachment: OutlookEndpoints['messagesAddAttachment'] =
	async (ctx, input) => {
		const result = await makeOutlookRequest<
			OutlookEndpointOutputs['messagesAddAttachment']
		>(
			`${userPath(input.user_id)}/messages/${input.message_id}/attachments`,
			ctx.key,
			{
				method: 'POST',
				body: {
					'@odata.type': input.odata_type ?? '#microsoft.graph.fileAttachment',
					...(input.name && { name: input.name }),
					...(input.contentBytes && { contentBytes: input.contentBytes }),
					...(input.contentType && { contentType: input.contentType }),
					...(input.contentId && { contentId: input.contentId }),
					...(input.contentLocation && {
						contentLocation: input.contentLocation,
					}),
					...(input.isInline !== undefined && { isInline: input.isInline }),
					...(input.item && { item: input.item }),
				},
			},
		);

		await logEventFromContext(
			ctx,
			'outlook.messages.addAttachment',
			{ message_id: input.message_id },
			'completed',
		);
		return result;
	};
