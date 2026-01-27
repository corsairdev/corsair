import { logEvent } from '../../utils/events';
import type { ResendEndpoints } from '..';
import { makeResendRequest } from '../client';
import type { ResendEndpointOutputs } from './types';

export const send: ResendEndpoints['emailsSend'] = async (ctx, input) => {
	const {
		from,
		to,
		subject,
		html,
		text,
		cc,
		bcc,
		reply_to,
		attachments,
		tags,
		headers,
	} = input;

	const body: Record<string, unknown> = {
		from,
		to: Array.isArray(to) ? to : [to],
		subject,
	};

	if (html) body.html = html;
	if (text) body.text = text;
	if (cc) body.cc = Array.isArray(cc) ? cc : [cc];
	if (bcc) body.bcc = Array.isArray(bcc) ? bcc : [bcc];
	if (reply_to) body.reply_to = Array.isArray(reply_to) ? reply_to : [reply_to];
	if (attachments) body.attachments = attachments;
	if (tags) body.tags = tags;
	if (headers) body.headers = headers;

	const response = await makeResendRequest<ResendEndpointOutputs['emailsSend']>(
		'emails',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body,
		},
	);

	if (ctx.db.emails && response.id) {
		try {
			await ctx.db.emails.upsert(response.id, {
				id: response.id,
				from: input.from,
				to: Array.isArray(input.to) ? input.to : [input.to],
				subject: input.subject,
				created_at: new Date().toISOString(),
			});
		} catch (error) {
			console.warn('Failed to save email to database:', error);
		}
	}

	await logEvent(ctx.database, 'resend.emails.send', { ...input }, 'completed');
	return response;
};

export const get: ResendEndpoints['emailsGet'] = async (ctx, input) => {
	const response = await makeResendRequest<ResendEndpointOutputs['emailsGet']>(
		`emails/${input.id}`,
		ctx.options.credentials.apiKey,
		{
			method: 'GET',
		},
	);

	if (ctx.db.emails && response.id) {
		try {
			await ctx.db.emails.upsert(response.id, {
				id: response.id,
				from: response.from,
				to: response.to,
				subject: response.subject,
				created_at: response.created_at,
			});
		} catch (error) {
			console.warn('Failed to save email to database:', error);
		}
	}

	await logEvent(ctx.database, 'resend.emails.get', { ...input }, 'completed');
	return response;
};

export const list: ResendEndpoints['emailsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.cursor) query.cursor = input.cursor;

	const response = await makeResendRequest<ResendEndpointOutputs['emailsList']>(
		'emails',
		ctx.options.credentials.apiKey,
		{
			method: 'GET',
			query,
		},
	);

	if (ctx.db.emails && response.data) {
		try {
			for (const email of response.data) {
				await ctx.db.emails.upsert(email.id, {
					id: email.id,
					from: email.from,
					to: email.to,
					subject: email.subject,
					created_at: email.created_at,
				});
			}
		} catch (error) {
			console.warn('Failed to save emails to database:', error);
		}
	}

	await logEvent(ctx.database, 'resend.emails.list', { ...input }, 'completed');
	return response;
};
