import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { forgetEmails, saveEmails } from './store';

// Limited to 20 requests a minute (the rest of the API allows 6,000).
export const list: InstantlyEndpoints['emailsList'] = (ctx, input) =>
	call(
		ctx,
		'emailsList',
		'emails.list',
		input,
		(query) => ({ method: 'GET', path: '/emails', query }),
		{
			log: ({ email_type, campaign_id }, result) => ({
				emailType: email_type,
				campaignId: campaign_id,
				count: result.items.length,
			}),
			after: (result) => saveEmails(ctx, result.items),
		},
	);

export const get: InstantlyEndpoints['emailsGet'] = (ctx, input) =>
	call(
		ctx,
		'emailsGet',
		'emails.get',
		input,
		({ id }) => ({ method: 'GET', path: `/emails/${segment(id)}` }),
		{
			log: ({ id }) => ({ emailId: id }),
			after: (result) => saveEmails(ctx, [result]),
		},
	);

// Sends a real email. Never retried: a failed or timed-out reply may have
// gone out.
export const reply: InstantlyEndpoints['emailsReply'] = (ctx, input) =>
	call(
		ctx,
		'emailsReply',
		'emails.reply',
		input,
		(body) => ({ method: 'POST', path: '/emails/reply', body }),
		{
			log: ({ reply_to_uuid, eaccount }, result) => ({
				replyTo: reply_to_uuid,
				account: eaccount,
				emailId: result.id,
			}),
		},
	);

export const markThreadRead: InstantlyEndpoints['emailsMarkThreadRead'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailsMarkThreadRead',
		'emails.markThreadRead',
		input,
		({ thread_id }) => ({
			method: 'POST',
			path: `/emails/threads/${segment(thread_id)}/mark-as-read`,
		}),
		{ log: ({ thread_id }) => ({ threadId: thread_id }) },
	);

export const countUnread: InstantlyEndpoints['emailsCountUnread'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'emailsCountUnread',
		'emails.countUnread',
		input,
		() => ({ method: 'GET', path: '/emails/unread/count' }),
		{ log: (_, result) => ({ count: result.count }) },
	);

export const sendTest: InstantlyEndpoints['emailsSendTest'] = (ctx, input) =>
	call(
		ctx,
		'emailsSendTest',
		'emails.sendTest',
		input,
		(body) => ({ method: 'POST', path: '/emails/test', body }),
		{},
	);

export const forward: InstantlyEndpoints['emailsForward'] = (ctx, input) =>
	call(
		ctx,
		'emailsForward',
		'emails.forward',
		input,
		(body) => ({ method: 'POST', path: '/emails/forward', body }),
		{},
	);

export const update: InstantlyEndpoints['emailsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'emailsUpdate',
		'emails.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/emails/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const remove: InstantlyEndpoints['emailsDelete'] = (ctx, input) =>
	call(
		ctx,
		'emailsDelete',
		'emails.delete',
		input,
		({ id }) => ({ method: 'DELETE', path: `/emails/${segment(id)}` }),
		{
			log: ({ id }) => ({ emailId: id }),
			onSuccess: ({ id }) => forgetEmails(ctx, [id]),
		},
	);
