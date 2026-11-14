import type { PostmarkEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PostmarkEndpointInputSchemas as Inputs,
	PostmarkEndpointOutputSchemas as Outputs,
} from './types';

export const list: PostmarkEndpoints['bouncesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bounces.list',
			input: Inputs.bouncesList,
			output: Outputs.bouncesList,
		},
		input,
		({
			Count,
			Offset,
			Type,
			Inactive,
			EmailFilter,
			Tag,
			MessageID,
			FromDate,
			ToDate,
			MessageStream,
		}) => ({
			method: 'GET',
			path: '/bounces',
			query: {
				// Postmark requires both, so a call without them gets the first page.
				count: Count ?? 100,
				offset: Offset ?? 0,
				type: Type,
				inactive: Inactive,
				emailFilter: EmailFilter,
				tag: Tag,
				messageID: MessageID,
				fromdate: FromDate,
				todate: ToDate,
				messagestream: MessageStream,
			},
		}),
		{ log: (_, result) => ({ count: result.Bounces.length }) },
	);

export const get: PostmarkEndpoints['bouncesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bounces.get',
			input: Inputs.bouncesGet,
			output: Outputs.bouncesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/bounces/${segment(id)}` }),
		{ log: ({ id }) => ({ bounceId: id }) },
	);

export const activate: PostmarkEndpoints['bouncesActivate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'bounces.activate',
			input: Inputs.bouncesActivate,
			output: Outputs.bouncesActivate,
		},
		input,
		({ id }) => ({
			method: 'PUT',
			path: `/bounces/${segment(id)}/activate`,
		}),
		{ log: ({ id }) => ({ bounceId: id }) },
	);

export const delivery: PostmarkEndpoints['statsDelivery'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.delivery',
			input: Inputs.statsDelivery,
			output: Outputs.statsDelivery,
		},
		input,
		() => ({ method: 'GET', path: '/deliverystats' }),
		{ log: (_, result) => ({ bounces: result.Bounces?.length ?? 0 }) },
	);

export const overview: PostmarkEndpoints['statsOverview'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.overview',
			input: Inputs.statsOverview,
			output: Outputs.statsOverview,
		},
		input,
		({ Tag, FromDate, ToDate, MessageStream }) => ({
			method: 'GET',
			path: '/stats/outbound',
			query: {
				tag: Tag,
				fromdate: FromDate,
				todate: ToDate,
				messagestream: MessageStream,
			},
		}),
		{ log: (_, result) => ({ sent: result.Sent ?? undefined }) },
	);

export const sends: PostmarkEndpoints['statsSends'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.sends',
			input: Inputs.statsSends,
			output: Outputs.statsSends,
		},
		input,
		({ Tag, FromDate, ToDate, MessageStream }) => ({
			method: 'GET',
			path: '/stats/outbound/sends',
			query: {
				tag: Tag,
				fromdate: FromDate,
				todate: ToDate,
				messagestream: MessageStream,
			},
		}),
		{ log: (_, result) => ({ days: result.Days.length }) },
	);
