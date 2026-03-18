import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['groupsGet'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['groupsGet']
	>(`groups/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'calendly.groups.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const getRelationship: CalendlyEndpoints['groupsGetRelationship'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['groupsGetRelationship']
		>(`group_relationships/${input.uuid}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'calendly.groups.getRelationship',
			{ ...input },
			'completed',
		);
		return result;
	};

export const list: CalendlyEndpoints['groupsList'] = async (ctx, input) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['groupsList']
	>('groups', ctx.key, {
		method: 'GET',
		query: {
			organization: input.organization,
			count: input.count,
			page_token: input.page_token,
			sort: input.sort,
		},
	});

	await logEventFromContext(
		ctx,
		'calendly.groups.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const listRelationships: CalendlyEndpoints['groupsListRelationships'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['groupsListRelationships']
		>('group_relationships', ctx.key, {
			method: 'GET',
			query: {
				group: input.group,
				count: input.count,
				page_token: input.page_token,
			},
		});

		await logEventFromContext(
			ctx,
			'calendly.groups.listRelationships',
			{ ...input },
			'completed',
		);
		return result;
	};
