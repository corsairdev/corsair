import { logEventFromContext } from 'corsair/core';
import { makeResendRequest } from '../client';
import type { ResendBoundEndpoints, ResendEndpoints } from '../index';
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
		scheduled_at,
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
	if (scheduled_at) body.scheduled_at = scheduled_at;
	if (attachments) body.attachments = attachments;
	if (tags) body.tags = tags;
	if (headers) body.headers = headers;

	const response = await makeResendRequest<ResendEndpointOutputs['emailsSend']>(
		'emails',
		ctx.key,
		{
			method: 'POST',
			body,
		},
	);

	if (response.id) {
		const endpoints = ctx.endpoints as ResendBoundEndpoints;
		await endpoints.emails.get({ id: response.id });
	}

	await logEventFromContext(
		ctx,
		'resend.emails.send',
		{ ...input },
		'completed',
	);
	return response;
};

export const batch: ResendEndpoints['emailsBatch'] = async (ctx, input) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['emailsBatch']
	>('emails/batch', ctx.key, {
		method: 'POST',
		body: input.emails as unknown as Record<string, unknown>,
	});

	// Batch response only returns IDs, not full email objects
	// Individual emails can be fetched via emails.get if needed

	await logEventFromContext(
		ctx,
		'resend.emails.batch',
		{ ...input },
		'completed',
	);
	return response;
};

export const cancel: ResendEndpoints['emailsCancel'] = async (ctx, input) => {
	const response = await makeResendRequest<
		ResendEndpointOutputs['emailsCancel']
	>(`emails/${input.id}/cancel`, ctx.key, {
		method: 'POST',
	});

	if ((response.cancelled || response.id) && ctx.db?.emails) {
		try {
			await ctx.db?.emails.deleteByEntityId(input.id);
		} catch (error) {
			console.warn('Failed to delete email from database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.emails.cancel',
		{ ...input },
		'completed',
	);
	return response;
};

export const get: ResendEndpoints['emailsGet'] = async (ctx, input) => {
	const response = await makeResendRequest<ResendEndpointOutputs['emailsGet']>(
		`emails/${input.id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	if (response.id && ctx.db?.emails) {
		try {
			await ctx.db?.emails.upsertByEntityId(response.id, {
				...response,
			});
		} catch (error) {
			console.warn('Failed to save email to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.emails.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: ResendEndpoints['emailsList'] = async (ctx, input) => {
	const query: Record<string, string | number | undefined> = {};
	if (input?.limit) query.limit = input.limit;
	if (input?.cursor) query.cursor = input.cursor;

	const response = await makeResendRequest<ResendEndpointOutputs['emailsList']>(
		'emails',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);

	if (response.data && ctx.db?.emails) {
		try {
			for (const email of response.data) {
				await ctx.db?.emails.upsertByEntityId(email.id, {
					...email,
				});
			}
		} catch (error) {
			console.warn('Failed to save emails to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'resend.emails.list',
		{ ...input },
		'completed',
	);
	return response;
};
