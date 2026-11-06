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

export const list: TimelyEndpoints['projectsList'] = async (ctx, input) => {
	const parsed = In.projectsList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.projects.list',
		input: parsed,
		path: `/${accountId}/projects`,
		query: {
			limit: parsed.limit,
			offset: parsed.offset,
			order: parsed.order,
			state: parsed.state,
			relation: parsed.relation,
			updated_after: parsed.updated_after,
			totals: parsed.totals,
		},
		output: Out.projectsList,
	});
};

export const get: TimelyEndpoints['projectsGet'] = async (ctx, input) => {
	const parsed = In.projectsGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.projects.get',
		input: parsed,
		path: `/${accountId}/projects/${idPath(parsed.id)}`,
		output: Out.projectsGet,
	});
};

export const create: TimelyEndpoints['projectsCreate'] = async (ctx, input) => {
	const parsed = In.projectsCreate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.projects.create',
		input: parsed,
		path: `/${accountId}/projects`,
		method: 'POST',
		body: { project: bodyFields(parsed) },
		output: Out.projectsCreate,
	});
};

export const update: TimelyEndpoints['projectsUpdate'] = async (ctx, input) => {
	const parsed = In.projectsUpdate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.projects.update',
		input: parsed,
		path: `/${accountId}/projects/${idPath(parsed.id)}`,
		method: 'PUT',
		body: { project: bodyFields(parsed) },
		output: Out.projectsUpdate,
	});
};

export const remove: TimelyEndpoints['projectsDelete'] = async (ctx, input) => {
	const parsed = In.projectsDelete.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	const id = idPath(parsed.id);
	return timelyCall(ctx, {
		event: 'timely.projects.delete',
		input: parsed,
		path: `/${accountId}/projects/${id}`,
		method: 'DELETE',
		output: Out.projectsDelete,
		transform: () => ({ id, deleted: true }),
	});
};
