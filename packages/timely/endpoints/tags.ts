import type { TimelyEndpoints } from '..';
import {
	bodyFields,
	idPath,
	resolveTimelyAccountId,
	timelyCall,
} from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

// Timely's API calls tags "labels".

export const list: TimelyEndpoints['tagsList'] = async (ctx, input) => {
	const parsed = In.tagsList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.tags.list',
		input: parsed,
		path: `/${accountId}/labels`,
		query: {
			limit: parsed.limit,
			offset: parsed.offset,
			filter: parsed.filter,
			parent_id: parsed.parent_id,
		},
		output: Out.tagsList,
	});
};

export const get: TimelyEndpoints['tagsGet'] = async (ctx, input) => {
	const parsed = In.tagsGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.tags.get',
		input: parsed,
		path: `/${accountId}/labels/${idPath(parsed.id)}`,
		output: Out.tagsGet,
	});
};

export const create: TimelyEndpoints['tagsCreate'] = async (ctx, input) => {
	const parsed = In.tagsCreate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.tags.create',
		input: parsed,
		path: `/${accountId}/labels`,
		method: 'POST',
		body: { label: bodyFields(parsed) },
		output: Out.tagsCreate,
	});
};

export const update: TimelyEndpoints['tagsUpdate'] = async (ctx, input) => {
	const parsed = In.tagsUpdate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.tags.update',
		input: parsed,
		path: `/${accountId}/labels/${idPath(parsed.id)}`,
		method: 'PUT',
		body: { label: bodyFields(parsed) },
		output: Out.tagsUpdate,
	});
};

export const remove: TimelyEndpoints['tagsDelete'] = async (ctx, input) => {
	const parsed = In.tagsDelete.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	const id = idPath(parsed.id);
	return timelyCall(ctx, {
		event: 'timely.tags.delete',
		input: parsed,
		path: `/${accountId}/labels/${id}`,
		method: 'DELETE',
		output: Out.tagsDelete,
		transform: () => ({ id, deleted: true }),
	});
};
