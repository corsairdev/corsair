import { logEventFromContext } from 'corsair/core';
import {
	downloadCapsuleCrmAttachment,
	makeCapsuleCrmRequest,
	uploadCapsuleCrmAttachment,
} from '../client';
import type { CapsuleCrmEndpoints } from '../index';

type Input = Record<string, unknown>;

function pathFrom(template: string, input: Input): string {
	let out = '';
	let i = 0;
	while (i < template.length) {
		const open = template.indexOf('{', i);
		if (open === -1) {
			out += template.slice(i);
			break;
		}
		out += template.slice(i, open);
		const close = template.indexOf('}', open + 1);
		if (close === -1) {
			out += template.slice(open);
			break;
		}
		const key = template.slice(open + 1, close);
		out += encodeURIComponent(String(input[key] ?? ''));
		i = close + 1;
	}
	return out;
}

function pick(input: Input, keys: string[]) {
	const out: Record<string, string | number | boolean | undefined> = {};
	for (const key of keys) {
		const value = input[key];
		if (value !== undefined) out[key] = value as string | number | boolean;
	}
	return out;
}

function omit(input: Input, keys: string[]): Record<string, unknown> {
	const out = { ...input };
	for (const key of keys) delete out[key];
	return out;
}

async function invoke(
	ctx: Parameters<CapsuleCrmEndpoints['partiesList']>[0],
	event: string,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	template: string,
	input: Input,
	opts: {
		pathKeys?: string[];
		queryKeys?: string[];
		wrap?: string;
		empty?: boolean;
	} = {},
) {
	const pathKeys = opts.pathKeys ?? [];
	const queryKeys = opts.queryKeys ?? [];
	const path = pathFrom(template, input);
	const query = pick(input, queryKeys);
	const rest = omit(input, [...pathKeys, ...queryKeys]);
	let body: Record<string, unknown> | undefined;
	if (method === 'POST' || method === 'PUT') {
		if (opts.wrap === 'filter')
			body = { filter: { conditions: rest.conditions } };
		else if (opts.wrap) body = { [opts.wrap]: rest };
		else if (Object.keys(rest).length > 0) body = rest;
	}
	const response = await makeCapsuleCrmRequest(path, ctx.key, {
		method,
		query,
		body,
	});
	await logEventFromContext(
		ctx,
		`capsulecrm.${event}`,
		pick(input, pathKeys),
		'completed',
	);
	if (response === undefined || opts.empty) return { success: true as const };
	return response;
}

export const partiesList: CapsuleCrmEndpoints['partiesList'] = (ctx, input) =>
	invoke(ctx, 'parties.list', 'GET', 'parties', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'since', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesList']>;

export const partiesGet: CapsuleCrmEndpoints['partiesGet'] = (ctx, input) =>
	invoke(ctx, 'parties.get', 'GET', 'parties/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesGet']>;

export const partiesCreate: CapsuleCrmEndpoints['partiesCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'parties.create', 'POST', 'parties', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'party',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesCreate']>;

export const partiesUpdate: CapsuleCrmEndpoints['partiesUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'parties.update', 'PUT', 'parties/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'party',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesUpdate']>;

export const partiesDelete: CapsuleCrmEndpoints['partiesDelete'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'parties.delete', 'DELETE', 'parties/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['partiesDelete']>;

export const partiesSearch: CapsuleCrmEndpoints['partiesSearch'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'parties.search', 'GET', 'parties/search', input as Input, {
		pathKeys: [],
		queryKeys: ['q', 'page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesSearch']>;

export const partiesListDeleted: CapsuleCrmEndpoints['partiesListDeleted'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'parties.listDeleted', 'GET', 'parties/deleted', input as Input, {
		pathKeys: [],
		queryKeys: ['since', 'page', 'perPage'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['partiesListDeleted']>;

export const partiesListEmployees: CapsuleCrmEndpoints['partiesListEmployees'] =
	(ctx, input) =>
		invoke(
			ctx,
			'parties.listEmployees',
			'GET',
			'parties/{id}/people',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['partiesListEmployees']>;

export const partiesListOpportunities: CapsuleCrmEndpoints['partiesListOpportunities'] =
	(ctx, input) =>
		invoke(
			ctx,
			'parties.listOpportunities',
			'GET',
			'parties/{id}/opportunities',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['partiesListOpportunities']>;

export const partiesListProjects: CapsuleCrmEndpoints['partiesListProjects'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'parties.listProjects',
		'GET',
		'parties/{id}/kases',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: ['page', 'perPage', 'embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['partiesListProjects']>;

export const opportunitiesList: CapsuleCrmEndpoints['opportunitiesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'opportunities.list', 'GET', 'opportunities', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'since', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['opportunitiesList']>;

export const opportunitiesGet: CapsuleCrmEndpoints['opportunitiesGet'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'opportunities.get',
		'GET',
		'opportunities/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: ['embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['opportunitiesGet']>;

export const opportunitiesCreate: CapsuleCrmEndpoints['opportunitiesCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'opportunities.create', 'POST', 'opportunities', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'opportunity',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['opportunitiesCreate']>;

export const opportunitiesUpdate: CapsuleCrmEndpoints['opportunitiesUpdate'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'opportunities.update',
		'PUT',
		'opportunities/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: 'opportunity',
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['opportunitiesUpdate']>;

export const opportunitiesDelete: CapsuleCrmEndpoints['opportunitiesDelete'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'opportunities.delete',
		'DELETE',
		'opportunities/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['opportunitiesDelete']>;

export const opportunitiesSearch: CapsuleCrmEndpoints['opportunitiesSearch'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'opportunities.search',
		'GET',
		'opportunities/search',
		input as Input,
		{
			pathKeys: [],
			queryKeys: ['q', 'page', 'perPage', 'embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['opportunitiesSearch']>;

export const opportunitiesListDeleted: CapsuleCrmEndpoints['opportunitiesListDeleted'] =
	(ctx, input) =>
		invoke(
			ctx,
			'opportunities.listDeleted',
			'GET',
			'opportunities/deleted',
			input as Input,
			{
				pathKeys: [],
				queryKeys: ['since', 'page', 'perPage'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['opportunitiesListDeleted']>;

export const opportunitiesListParties: CapsuleCrmEndpoints['opportunitiesListParties'] =
	(ctx, input) =>
		invoke(
			ctx,
			'opportunities.listParties',
			'GET',
			'opportunities/{id}/parties',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['opportunitiesListParties']>;

export const opportunitiesAddParty: CapsuleCrmEndpoints['opportunitiesAddParty'] =
	(ctx, input) =>
		invoke(
			ctx,
			'opportunities.addParty',
			'POST',
			'opportunities/{id}/parties/{partyId}',
			input as Input,
			{
				pathKeys: ['id', 'partyId'],
				queryKeys: [],
				wrap: undefined,
				empty: true,
			},
		) as ReturnType<CapsuleCrmEndpoints['opportunitiesAddParty']>;

export const opportunitiesDeleteParty: CapsuleCrmEndpoints['opportunitiesDeleteParty'] =
	(ctx, input) =>
		invoke(
			ctx,
			'opportunities.deleteParty',
			'DELETE',
			'opportunities/{id}/parties/{partyId}',
			input as Input,
			{
				pathKeys: ['id', 'partyId'],
				queryKeys: [],
				wrap: undefined,
				empty: true,
			},
		) as ReturnType<CapsuleCrmEndpoints['opportunitiesDeleteParty']>;

export const opportunitiesListProjects: CapsuleCrmEndpoints['opportunitiesListProjects'] =
	(ctx, input) =>
		invoke(
			ctx,
			'opportunities.listProjects',
			'GET',
			'opportunities/{id}/kases',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['opportunitiesListProjects']>;

export const projectsList: CapsuleCrmEndpoints['projectsList'] = (ctx, input) =>
	invoke(ctx, 'projects.list', 'GET', 'kases', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'since', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsList']>;

export const projectsGet: CapsuleCrmEndpoints['projectsGet'] = (ctx, input) =>
	invoke(ctx, 'projects.get', 'GET', 'kases/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsGet']>;

export const projectsCreate: CapsuleCrmEndpoints['projectsCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'projects.create', 'POST', 'kases', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'kase',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsCreate']>;

export const projectsUpdate: CapsuleCrmEndpoints['projectsUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'projects.update', 'PUT', 'kases/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'kase',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsUpdate']>;

export const projectsDelete: CapsuleCrmEndpoints['projectsDelete'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'projects.delete', 'DELETE', 'kases/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['projectsDelete']>;

export const projectsSearch: CapsuleCrmEndpoints['projectsSearch'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'projects.search', 'GET', 'kases/search', input as Input, {
		pathKeys: [],
		queryKeys: ['q', 'page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsSearch']>;

export const projectsListDeleted: CapsuleCrmEndpoints['projectsListDeleted'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'projects.listDeleted', 'GET', 'kases/deleted', input as Input, {
		pathKeys: [],
		queryKeys: ['since', 'page', 'perPage'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['projectsListDeleted']>;

export const projectsListParties: CapsuleCrmEndpoints['projectsListParties'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'projects.listParties',
		'GET',
		'kases/{id}/parties',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: ['page', 'perPage', 'embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['projectsListParties']>;

export const projectsAddParty: CapsuleCrmEndpoints['projectsAddParty'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'projects.addParty',
		'POST',
		'kases/{id}/parties/{partyId}',
		input as Input,
		{
			pathKeys: ['id', 'partyId'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['projectsAddParty']>;

export const projectsDeleteParty: CapsuleCrmEndpoints['projectsDeleteParty'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'projects.deleteParty',
		'DELETE',
		'kases/{id}/parties/{partyId}',
		input as Input,
		{
			pathKeys: ['id', 'partyId'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['projectsDeleteParty']>;

export const tasksList: CapsuleCrmEndpoints['tasksList'] = (ctx, input) =>
	invoke(ctx, 'tasks.list', 'GET', 'tasks', input as Input, {
		pathKeys: [],
		queryKeys: ['status', 'page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tasksList']>;

export const tasksGet: CapsuleCrmEndpoints['tasksGet'] = (ctx, input) =>
	invoke(ctx, 'tasks.get', 'GET', 'tasks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tasksGet']>;

export const tasksCreate: CapsuleCrmEndpoints['tasksCreate'] = (ctx, input) =>
	invoke(ctx, 'tasks.create', 'POST', 'tasks', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'task',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tasksCreate']>;

export const tasksUpdate: CapsuleCrmEndpoints['tasksUpdate'] = (ctx, input) =>
	invoke(ctx, 'tasks.update', 'PUT', 'tasks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'task',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tasksUpdate']>;

export const tasksDelete: CapsuleCrmEndpoints['tasksDelete'] = (ctx, input) =>
	invoke(ctx, 'tasks.delete', 'DELETE', 'tasks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['tasksDelete']>;

export const entriesListByDate: CapsuleCrmEndpoints['entriesListByDate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'entries.listByDate', 'GET', 'entries', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['entriesListByDate']>;

export const entriesListForEntity: CapsuleCrmEndpoints['entriesListForEntity'] =
	(ctx, input) =>
		invoke(
			ctx,
			'entries.listForEntity',
			'GET',
			'{entity}/{id}/entries',
			input as Input,
			{
				pathKeys: ['entity', 'id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['entriesListForEntity']>;

export const entriesGet: CapsuleCrmEndpoints['entriesGet'] = (ctx, input) =>
	invoke(ctx, 'entries.get', 'GET', 'entries/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['entriesGet']>;

export const entriesCreate: CapsuleCrmEndpoints['entriesCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'entries.create', 'POST', 'entries', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'entry',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['entriesCreate']>;

export const entriesUpdate: CapsuleCrmEndpoints['entriesUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'entries.update', 'PUT', 'entries/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'entry',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['entriesUpdate']>;

export const entriesDelete: CapsuleCrmEndpoints['entriesDelete'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'entries.delete', 'DELETE', 'entries/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['entriesDelete']>;

export const categoriesList: CapsuleCrmEndpoints['categoriesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'categories.list', 'GET', 'categories', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['categoriesList']>;

export const categoriesGet: CapsuleCrmEndpoints['categoriesGet'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'categories.get', 'GET', 'categories/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['categoriesGet']>;

export const categoriesCreate: CapsuleCrmEndpoints['categoriesCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'categories.create', 'POST', 'categories', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'category',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['categoriesCreate']>;

export const categoriesUpdate: CapsuleCrmEndpoints['categoriesUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'categories.update', 'PUT', 'categories/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'category',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['categoriesUpdate']>;

export const categoriesDelete: CapsuleCrmEndpoints['categoriesDelete'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'categories.delete',
		'DELETE',
		'categories/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['categoriesDelete']>;

export const milestonesList: CapsuleCrmEndpoints['milestonesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'milestones.list', 'GET', 'milestones', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['milestonesList']>;

export const milestonesGet: CapsuleCrmEndpoints['milestonesGet'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'milestones.get', 'GET', 'milestones/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['milestonesGet']>;

export const milestonesCreate: CapsuleCrmEndpoints['milestonesCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'milestones.create', 'POST', 'milestones', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'milestone',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['milestonesCreate']>;

export const milestonesUpdate: CapsuleCrmEndpoints['milestonesUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'milestones.update', 'PUT', 'milestones/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'milestone',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['milestonesUpdate']>;

export const milestonesDelete: CapsuleCrmEndpoints['milestonesDelete'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'milestones.delete',
		'DELETE',
		'milestones/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['milestonesDelete']>;

export const titlesList: CapsuleCrmEndpoints['titlesList'] = (ctx, input) =>
	invoke(ctx, 'titles.list', 'GET', 'titles', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['titlesList']>;

export const titlesCreate: CapsuleCrmEndpoints['titlesCreate'] = (ctx, input) =>
	invoke(ctx, 'titles.create', 'POST', 'titles', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'title',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['titlesCreate']>;

export const titlesDelete: CapsuleCrmEndpoints['titlesDelete'] = (ctx, input) =>
	invoke(ctx, 'titles.delete', 'DELETE', 'titles/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['titlesDelete']>;

export const customFieldsList: CapsuleCrmEndpoints['customFieldsList'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'customFields.list',
		'GET',
		'{entity}/fields/definitions',
		input as Input,
		{
			pathKeys: ['entity'],
			queryKeys: [],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['customFieldsList']>;

export const customFieldsGet: CapsuleCrmEndpoints['customFieldsGet'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'customFields.get',
		'GET',
		'{entity}/fields/definitions/{id}',
		input as Input,
		{
			pathKeys: ['entity', 'id'],
			queryKeys: [],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['customFieldsGet']>;

export const customFieldsCreate: CapsuleCrmEndpoints['customFieldsCreate'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'customFields.create',
		'POST',
		'{entity}/fields/definitions',
		input as Input,
		{
			pathKeys: ['entity'],
			queryKeys: [],
			wrap: 'definition',
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['customFieldsCreate']>;

export const customFieldsUpdate: CapsuleCrmEndpoints['customFieldsUpdate'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'customFields.update',
		'PUT',
		'{entity}/fields/definitions/{id}',
		input as Input,
		{
			pathKeys: ['entity', 'id'],
			queryKeys: [],
			wrap: 'definition',
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['customFieldsUpdate']>;

export const customFieldsDelete: CapsuleCrmEndpoints['customFieldsDelete'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'customFields.delete',
		'DELETE',
		'{entity}/fields/definitions/{id}',
		input as Input,
		{
			pathKeys: ['entity', 'id'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['customFieldsDelete']>;

export const lostReasonsList: CapsuleCrmEndpoints['lostReasonsList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'lostReasons.list', 'GET', 'lostreasons', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['lostReasonsList']>;

export const lostReasonsGet: CapsuleCrmEndpoints['lostReasonsGet'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'lostReasons.get', 'GET', 'lostreasons/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['lostReasonsGet']>;

export const lostReasonsCreate: CapsuleCrmEndpoints['lostReasonsCreate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'lostReasons.create', 'POST', 'lostreasons', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'lostReason',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['lostReasonsCreate']>;

export const lostReasonsUpdate: CapsuleCrmEndpoints['lostReasonsUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'lostReasons.update', 'PUT', 'lostreasons/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'lostReason',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['lostReasonsUpdate']>;

export const lostReasonsDelete: CapsuleCrmEndpoints['lostReasonsDelete'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'lostReasons.delete',
		'DELETE',
		'lostreasons/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: undefined,
			empty: true,
		},
	) as ReturnType<CapsuleCrmEndpoints['lostReasonsDelete']>;

export const stagesList: CapsuleCrmEndpoints['stagesList'] = (ctx, input) =>
	invoke(ctx, 'stages.list', 'GET', 'stages', input as Input, {
		pathKeys: [],
		queryKeys: ['status', 'page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['stagesList']>;

export const stagesGet: CapsuleCrmEndpoints['stagesGet'] = (ctx, input) =>
	invoke(ctx, 'stages.get', 'GET', 'stages/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['stagesGet']>;

export const stagesCreate: CapsuleCrmEndpoints['stagesCreate'] = (ctx, input) =>
	invoke(ctx, 'stages.create', 'POST', 'stages', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: 'stage',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['stagesCreate']>;

export const stagesUpdate: CapsuleCrmEndpoints['stagesUpdate'] = (ctx, input) =>
	invoke(ctx, 'stages.update', 'PUT', 'stages/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'stage',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['stagesUpdate']>;

export const stagesDelete: CapsuleCrmEndpoints['stagesDelete'] = (ctx, input) =>
	invoke(ctx, 'stages.delete', 'DELETE', 'stages/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['stagesDelete']>;

export const tracksGet: CapsuleCrmEndpoints['tracksGet'] = (ctx, input) =>
	invoke(ctx, 'tracks.get', 'GET', 'tracks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tracksGet']>;

export const tracksCreate: CapsuleCrmEndpoints['tracksCreate'] = (ctx, input) =>
	invoke(ctx, 'tracks.create', 'POST', 'tracks', input as Input, {
		pathKeys: [],
		queryKeys: ['embed'],
		wrap: 'track',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tracksCreate']>;

export const tracksUpdate: CapsuleCrmEndpoints['tracksUpdate'] = (ctx, input) =>
	invoke(ctx, 'tracks.update', 'PUT', 'tracks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: 'track',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tracksUpdate']>;

export const tracksDelete: CapsuleCrmEndpoints['tracksDelete'] = (ctx, input) =>
	invoke(ctx, 'tracks.delete', 'DELETE', 'tracks/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['tracksDelete']>;

export const tracksListForEntity: CapsuleCrmEndpoints['tracksListForEntity'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'tracks.listForEntity',
		'GET',
		'{entity}/{id}/tracks',
		input as Input,
		{
			pathKeys: ['entity', 'id'],
			queryKeys: ['page', 'perPage', 'embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['tracksListForEntity']>;

export const trackDefinitionsList: CapsuleCrmEndpoints['trackDefinitionsList'] =
	(ctx, input) =>
		invoke(
			ctx,
			'trackDefinitions.list',
			'GET',
			'trackdefinitions',
			input as Input,
			{
				pathKeys: [],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['trackDefinitionsList']>;

export const trackDefinitionsGet: CapsuleCrmEndpoints['trackDefinitionsGet'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'trackDefinitions.get',
		'GET',
		'trackdefinitions/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: ['embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['trackDefinitionsGet']>;

export const trackDefinitionsCreate: CapsuleCrmEndpoints['trackDefinitionsCreate'] =
	(ctx, input) =>
		invoke(
			ctx,
			'trackDefinitions.create',
			'POST',
			'trackdefinitions',
			input as Input,
			{
				pathKeys: [],
				queryKeys: [],
				wrap: 'trackDefinition',
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['trackDefinitionsCreate']>;

export const trackDefinitionsUpdate: CapsuleCrmEndpoints['trackDefinitionsUpdate'] =
	(ctx, input) =>
		invoke(
			ctx,
			'trackDefinitions.update',
			'PUT',
			'trackdefinitions/{id}',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: [],
				wrap: 'trackDefinition',
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['trackDefinitionsUpdate']>;

export const trackDefinitionsDelete: CapsuleCrmEndpoints['trackDefinitionsDelete'] =
	(ctx, input) =>
		invoke(
			ctx,
			'trackDefinitions.delete',
			'DELETE',
			'trackdefinitions/{id}',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: [],
				wrap: undefined,
				empty: true,
			},
		) as ReturnType<CapsuleCrmEndpoints['trackDefinitionsDelete']>;

export const boardsList: CapsuleCrmEndpoints['boardsList'] = (ctx, input) =>
	invoke(ctx, 'boards.list', 'GET', 'boards', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['boardsList']>;

export const boardsGet: CapsuleCrmEndpoints['boardsGet'] = (ctx, input) =>
	invoke(ctx, 'boards.get', 'GET', 'boards/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['boardsGet']>;

export const boardsUpdate: CapsuleCrmEndpoints['boardsUpdate'] = (ctx, input) =>
	invoke(ctx, 'boards.update', 'PUT', 'boards/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'board',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['boardsUpdate']>;

export const boardsDelete: CapsuleCrmEndpoints['boardsDelete'] = (ctx, input) =>
	invoke(ctx, 'boards.delete', 'DELETE', 'boards/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['boardsDelete']>;

export const boardsRestore: CapsuleCrmEndpoints['boardsRestore'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'boards.restore', 'POST', 'boards/{id}/restore', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['boardsRestore']>;

export const boardsListStages: CapsuleCrmEndpoints['boardsListStages'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'boards.listStages',
		'GET',
		'boards/{id}/stages',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: ['status', 'page', 'perPage', 'embed'],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['boardsListStages']>;

export const pipelinesList: CapsuleCrmEndpoints['pipelinesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'pipelines.list', 'GET', 'pipelines', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['pipelinesList']>;

export const pipelinesGet: CapsuleCrmEndpoints['pipelinesGet'] = (ctx, input) =>
	invoke(ctx, 'pipelines.get', 'GET', 'pipelines/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['pipelinesGet']>;

export const pipelinesUpdate: CapsuleCrmEndpoints['pipelinesUpdate'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'pipelines.update', 'PUT', 'pipelines/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: [],
		wrap: 'pipeline',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['pipelinesUpdate']>;

export const pipelinesListMilestones: CapsuleCrmEndpoints['pipelinesListMilestones'] =
	(ctx, input) =>
		invoke(
			ctx,
			'pipelines.listMilestones',
			'GET',
			'pipelines/{id}/milestones',
			input as Input,
			{
				pathKeys: ['id'],
				queryKeys: ['page', 'perPage', 'embed'],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['pipelinesListMilestones']>;

export const usersList: CapsuleCrmEndpoints['usersList'] = (ctx, input) =>
	invoke(ctx, 'users.list', 'GET', 'users', input as Input, {
		pathKeys: [],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['usersList']>;

export const usersGetCurrent: CapsuleCrmEndpoints['usersGetCurrent'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'users.getCurrent', 'GET', 'users/current', input as Input, {
		pathKeys: [],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['usersGetCurrent']>;

export const usersGet: CapsuleCrmEndpoints['usersGet'] = (ctx, input) =>
	invoke(ctx, 'users.get', 'GET', 'users/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['usersGet']>;

export const usersUpdate: CapsuleCrmEndpoints['usersUpdate'] = (ctx, input) =>
	invoke(ctx, 'users.update', 'PUT', 'users/{id}', input as Input, {
		pathKeys: ['id'],
		queryKeys: ['embed'],
		wrap: 'user',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['usersUpdate']>;

export const teamsList: CapsuleCrmEndpoints['teamsList'] = (ctx, input) =>
	invoke(ctx, 'teams.list', 'GET', 'teams', input as Input, {
		pathKeys: [],
		queryKeys: ['embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['teamsList']>;

export const siteGet: CapsuleCrmEndpoints['siteGet'] = (ctx, input) =>
	invoke(ctx, 'site.get', 'GET', 'site', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['siteGet']>;

export const restHooksList: CapsuleCrmEndpoints['restHooksList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'restHooks.list', 'GET', 'resthooks', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['restHooksList']>;

export const attachmentsGet: CapsuleCrmEndpoints['attachmentsGet'] = async (
	ctx,
	input,
) => {
	const result = await downloadCapsuleCrmAttachment(input.id, ctx.key);
	await logEventFromContext(
		ctx,
		'capsulecrm.attachments.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const attachmentsUpload: CapsuleCrmEndpoints['attachmentsUpload'] =
	async (ctx, input) => {
		const result = await uploadCapsuleCrmAttachment(ctx.key, input);
		await logEventFromContext(
			ctx,
			'capsulecrm.attachments.upload',
			{ filename: input.filename },
			'completed',
		);
		return result;
	};

export const activityTypesList: CapsuleCrmEndpoints['activityTypesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'activityTypes.list', 'GET', 'activitytypes', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['activityTypesList']>;

export const activityTypesGet: CapsuleCrmEndpoints['activityTypesGet'] = (
	ctx,
	input,
) =>
	invoke(
		ctx,
		'activityTypes.get',
		'GET',
		'activitytypes/{id}',
		input as Input,
		{
			pathKeys: ['id'],
			queryKeys: [],
			wrap: undefined,
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['activityTypesGet']>;

export const activityTypesListIcons: CapsuleCrmEndpoints['activityTypesListIcons'] =
	(ctx, input) =>
		invoke(
			ctx,
			'activityTypes.listIcons',
			'GET',
			'activitytypes/icons',
			input as Input,
			{
				pathKeys: [],
				queryKeys: [],
				wrap: undefined,
				empty: false,
			},
		) as ReturnType<CapsuleCrmEndpoints['activityTypesListIcons']>;

export const countriesList: CapsuleCrmEndpoints['countriesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'countries.list', 'GET', 'countries', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['countriesList']>;

export const currenciesList: CapsuleCrmEndpoints['currenciesList'] = (
	ctx,
	input,
) =>
	invoke(ctx, 'currencies.list', 'GET', 'currencies', input as Input, {
		pathKeys: [],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['currenciesList']>;

export const goalsList: CapsuleCrmEndpoints['goalsList'] = (ctx, input) =>
	invoke(ctx, 'goals.list', 'GET', 'goals', input as Input, {
		pathKeys: [],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['goalsList']>;

export const tagsList: CapsuleCrmEndpoints['tagsList'] = (ctx, input) =>
	invoke(ctx, 'tags.list', 'GET', '{entity}/tags', input as Input, {
		pathKeys: ['entity'],
		queryKeys: ['page', 'perPage', 'embed'],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tagsList']>;

export const tagsGet: CapsuleCrmEndpoints['tagsGet'] = (ctx, input) =>
	invoke(ctx, 'tags.get', 'GET', '{entity}/tags/{id}', input as Input, {
		pathKeys: ['entity', 'id'],
		queryKeys: [],
		wrap: undefined,
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tagsGet']>;

export const tagsUpdate: CapsuleCrmEndpoints['tagsUpdate'] = (ctx, input) =>
	invoke(ctx, 'tags.update', 'PUT', '{entity}/tags/{id}', input as Input, {
		pathKeys: ['entity', 'id'],
		queryKeys: [],
		wrap: 'tag',
		empty: false,
	}) as ReturnType<CapsuleCrmEndpoints['tagsUpdate']>;

export const tagsDelete: CapsuleCrmEndpoints['tagsDelete'] = (ctx, input) =>
	invoke(ctx, 'tags.delete', 'DELETE', '{entity}/tags/{id}', input as Input, {
		pathKeys: ['entity', 'id'],
		queryKeys: [],
		wrap: undefined,
		empty: true,
	}) as ReturnType<CapsuleCrmEndpoints['tagsDelete']>;

export const filtersRun: CapsuleCrmEndpoints['filtersRun'] = (ctx, input) =>
	invoke(
		ctx,
		'filters.run',
		'POST',
		'{entity}/filters/results',
		input as Input,
		{
			pathKeys: ['entity'],
			queryKeys: ['page', 'perPage', 'embed'],
			wrap: 'filter',
			empty: false,
		},
	) as ReturnType<CapsuleCrmEndpoints['filtersRun']>;
