import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const create: InstantlyEndpoints['leadLabelsCreate'] = (ctx, input) =>
	call(
		ctx,
		'leadLabelsCreate',
		'leadLabels.create',
		input,
		(body) => ({ method: 'POST', path: '/lead-labels', body }),
		{},
	);

export const list: InstantlyEndpoints['leadLabelsList'] = (ctx, input) =>
	call(
		ctx,
		'leadLabelsList',
		'leadLabels.list',
		input,
		(query) => ({ method: 'GET', path: '/lead-labels', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const get: InstantlyEndpoints['leadLabelsGet'] = (ctx, input) =>
	call(
		ctx,
		'leadLabelsGet',
		'leadLabels.get',
		input,
		({ id }) => ({ method: 'GET', path: `/lead-labels/${segment(id)}` }),
		{ log: ({ id }) => ({ id }) },
	);

export const update: InstantlyEndpoints['leadLabelsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'leadLabelsUpdate',
		'leadLabels.update',
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/lead-labels/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const remove: InstantlyEndpoints['leadLabelsDelete'] = (ctx, input) =>
	call(
		ctx,
		'leadLabelsDelete',
		'leadLabels.delete',
		input,
		({ id, ...body }) => ({
			method: 'DELETE',
			path: `/lead-labels/${segment(id)}`,
			body,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const testAiReplyLabel: InstantlyEndpoints['leadLabelsTestAiReplyLabel'] =
	(ctx, input) =>
		call(
			ctx,
			'leadLabelsTestAiReplyLabel',
			'leadLabels.testAiReplyLabel',
			input,
			(body) => ({ method: 'POST', path: '/lead-labels/ai-reply-label', body }),
			{},
		);
