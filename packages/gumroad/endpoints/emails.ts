import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['emailsList'] = (ctx, input) =>
	call(ctx, 'emailsList', 'emails.list', '/emails', input, {
		toQuery: (parsed) => ({
			type: parsed.type,
			page_key: parsed.page_key,
		}),
	});

export const get: GumroadEndpoints['emailsGet'] = (ctx, input) =>
	call(
		ctx,
		'emailsGet',
		'emails.get',
		`/emails/${encodeURIComponent(input.id)}`,
		input,
	);

export const create: GumroadEndpoints['emailsCreate'] = (ctx, input) =>
	call(ctx, 'emailsCreate', 'emails.create', '/emails', input, {
		method: 'POST',
		toForm: (parsed) =>
			formEntries({
				subject: parsed.subject,
				body: parsed.body,
				audience: parsed.audience,
				product_id: parsed.product_id,
				link_id: parsed.link_id,
				publish: parsed.publish,
				draft: parsed.draft,
			}),
	});

export const preview: GumroadEndpoints['emailsPreview'] = (ctx, input) =>
	call(
		ctx,
		'emailsPreview',
		'emails.preview',
		`/emails/${encodeURIComponent(input.id)}/preview`,
		input,
		{ method: 'POST' },
	);

export const send: GumroadEndpoints['emailsSend'] = (ctx, input) =>
	call(
		ctx,
		'emailsSend',
		'emails.send',
		`/emails/${encodeURIComponent(input.id)}/send`,
		input,
		{ method: 'POST' },
	);

export const schedule: GumroadEndpoints['emailsSchedule'] = (ctx, input) =>
	call(
		ctx,
		'emailsSchedule',
		'emails.schedule',
		`/emails/${encodeURIComponent(input.id)}/schedule`,
		input,
		{
			method: 'POST',
			toForm: (parsed) =>
				formEntries({ to_be_published_at: parsed.to_be_published_at }),
		},
	);

export const unschedule: GumroadEndpoints['emailsUnschedule'] = (ctx, input) =>
	call(
		ctx,
		'emailsUnschedule',
		'emails.unschedule',
		`/emails/${encodeURIComponent(input.id)}/unschedule`,
		input,
		{ method: 'POST' },
	);

export const remove: GumroadEndpoints['emailsDelete'] = (ctx, input) =>
	call(
		ctx,
		'emailsDelete',
		'emails.delete',
		`/emails/${encodeURIComponent(input.id)}`,
		input,
		{ method: 'DELETE' },
	);
