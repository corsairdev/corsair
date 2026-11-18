import type { CeligoEndpoints } from '../index';
import { callCeligo } from './call';
import {
	CeligoEndpointInputSchemas as In,
	CeligoEndpointOutputSchemas as Out,
} from './types';

export const list: CeligoEndpoints['tagsList'] = (ctx, input) =>
	callCeligo(ctx, 'tags.list', In.tagsList, Out.tagsList, input, (i) => ({
		method: 'GET',
		save: 'tags',
		path: ['tags'],
		query: { limit: i.limit, after: i.after },
		empty: [],
	}));

export const get: CeligoEndpoints['tagsGet'] = (ctx, input) =>
	callCeligo(ctx, 'tags.get', In.tagsGet, Out.tagsGet, input, (i) => ({
		method: 'GET',
		save: 'tags',
		path: ['tags', i.id],
	}));

export const create: CeligoEndpoints['tagsCreate'] = (ctx, input) =>
	callCeligo(ctx, 'tags.create', In.tagsCreate, Out.tagsCreate, input, (i) => ({
		method: 'POST',
		save: 'tags',
		path: ['tags'],
		body: i,
	}));

export const update: CeligoEndpoints['tagsUpdate'] = (ctx, input) =>
	callCeligo(
		ctx,
		'tags.update',
		In.tagsUpdate,
		Out.tagsUpdate,
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			save: 'tags',
			path: ['tags', id],
			body,
		}),
	);

export const remove: CeligoEndpoints['tagsDelete'] = (ctx, input) =>
	callCeligo(ctx, 'tags.delete', In.tagsDelete, Out.tagsDelete, input, (i) => ({
		method: 'DELETE',
		drop: 'tags',
		path: ['tags', i.id],
		empty: { success: true },
	}));
