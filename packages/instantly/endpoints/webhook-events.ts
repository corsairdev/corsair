import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const list: InstantlyEndpoints['webhookEventsList'] = (ctx, input) =>
	call(
		ctx,
		'webhookEventsList',
		'webhookEvents.list',
		input,
		(query) => ({ method: 'GET', path: '/webhook-events', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const get: InstantlyEndpoints['webhookEventsGet'] = (ctx, input) =>
	call(
		ctx,
		'webhookEventsGet',
		'webhookEvents.get',
		input,
		({ id }) => ({ method: 'GET', path: `/webhook-events/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const getSummary: InstantlyEndpoints['webhookEventsGetSummary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'webhookEventsGetSummary',
		'webhookEvents.getSummary',
		input,
		(query) => ({ method: 'GET', path: '/webhook-events/summary', query }),
		{},
	);

export const getSummaryByDate: InstantlyEndpoints['webhookEventsGetSummaryByDate'] =
	(ctx, input) =>
		call(
			ctx,
			'webhookEventsGetSummaryByDate',
			'webhookEvents.getSummaryByDate',
			input,
			(query) => ({
				method: 'GET',
				path: '/webhook-events/summary-by-date',
				query,
			}),
			{ log: (_, result) => ({ count: result.items.length }) },
		);
