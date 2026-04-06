import { logEventFromContext } from 'corsair/core';
import type { FacebookEndpoints } from '..';
import { makeFacebookRequest } from '../client';
import type {
	FacebookEndpointOutputs,
	GetPageDetailsResponse,
	ListConversationsResponse,
} from './types';

const DEFAULT_PAGE_FIELDS = [
	'id',
	'name',
	'about',
	'category',
	'description',
	'website',
	'phone',
	'fan_count',
	'followers_count',
	'verification_status',
	'is_verified',
	'link',
	'username',
].join(',');

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export const getPageDetails: FacebookEndpoints['getPageDetails'] = async (
	ctx,
	input,
) => {
	const fields = input.fields?.length ? input.fields.join(',') : DEFAULT_PAGE_FIELDS;

	const result = await makeFacebookRequest<FacebookEndpointOutputs['getPageDetails']>(
		`/${input.pageId}`,
		ctx.key,
		{
			query: {
				fields,
			},
		},
	);

	if (ctx.db.pages) {
		try {
			await ctx.db.pages.upsertByEntityId(result.id, {
				...result,
				createdAt: result.createdAt ?? new Date(),
				raw: result,
			});
		} catch (error) {
			console.warn('Failed to save Facebook page details:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'facebook.pages.getPageDetails',
		{ pageId: input.pageId, fields: input.fields },
		'completed',
	);

	return result;
};

export const listConversations: FacebookEndpoints['listConversations'] = async (
	ctx,
	input,
) => {
	const response = await makeFacebookRequest<{
		data?: Array<Record<string, unknown>>;
		paging?: Record<string, unknown>;
	}>(`/${input.pageId}/conversations`, ctx.key, {
		query: {
			platform: input.platform,
			user_id: input.userId,
			folder: input.folder,
			limit: input.limit,
			after: input.after,
			before: input.before,
			fields: 'id,link,updated_time,message_count,unread_count,snippet,can_reply,senders,participants',
		},
	});

	const conversations = (response.data ?? []).map((conversation) => ({
		id: typeof conversation.id === 'string' ? conversation.id : '',
		page_id: input.pageId,
		link: typeof conversation.link === 'string' ? conversation.link : undefined,
		updated_time:
			typeof conversation.updated_time === 'string'
				? conversation.updated_time
				: undefined,
		message_count:
			typeof conversation.message_count === 'number'
				? conversation.message_count
				: undefined,
		unread_count:
			typeof conversation.unread_count === 'number'
				? conversation.unread_count
				: undefined,
		snippet:
			typeof conversation.snippet === 'string' ? conversation.snippet : undefined,
		can_reply:
			typeof conversation.can_reply === 'boolean'
				? conversation.can_reply
				: undefined,
		senders: Array.isArray(conversation.senders)
			? (conversation.senders as Array<Record<string, unknown>>)
			: undefined,
		participants: Array.isArray(conversation.participants)
			? (conversation.participants as Array<Record<string, unknown>>)
			: undefined,
		createdAt: new Date(),
		raw: conversation,
	})).filter((conversation) => conversation.id);

	if (input.persist !== false && ctx.db.conversations) {
		try {
			for (const conversation of conversations) {
				await ctx.db.conversations.upsertByEntityId(conversation.id, conversation);
			}
		} catch (error) {
			console.warn('Failed to save Facebook conversations:', error);
		}
	}

	const pagingRecord = isRecord(response.paging) ? response.paging : undefined;
	const cursorsRecord = isRecord(pagingRecord?.cursors) ? pagingRecord.cursors : undefined;

	const paging = pagingRecord
		? {
			cursors: cursorsRecord
				? {
					before:
						typeof cursorsRecord.before === 'string' ? cursorsRecord.before : undefined,
					after:
						typeof cursorsRecord.after === 'string' ? cursorsRecord.after : undefined,
				}
				: undefined,
			next: typeof pagingRecord.next === 'string' ? pagingRecord.next : undefined,
			previous:
				typeof pagingRecord.previous === 'string' ? pagingRecord.previous : undefined,
		}
		: undefined;

	const result: ListConversationsResponse = {
		conversations,
		count: conversations.length,
		paging,
	};

	await logEventFromContext(
		ctx,
		'facebook.pages.listConversations',
		{ ...input },
		'completed',
	);

	return result;
};
