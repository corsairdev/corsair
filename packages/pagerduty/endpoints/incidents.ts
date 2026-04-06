import { logEventFromContext } from 'corsair/core';
import type { PagerdutyEndpoints } from '..';
import { makePagerdutyRequest } from '../client';
import type { PagerdutyEndpointOutputs } from './types';

export const create: PagerdutyEndpoints['incidentsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makePagerdutyRequest<
		PagerdutyEndpointOutputs['incidentsCreate']
	>('incidents', ctx.key, {
		method: 'POST',
		from: input.from,
		body: {
			incident: {
				type: 'incident',
				...input,
			},
		},
	});

	if (result.incident && ctx.db.incidents) {
		try {
			await ctx.db.incidents.upsertByEntityId(result.incident.id, {
				...result.incident,
				created_at: result.incident.created_at
					? new Date(result.incident.created_at)
					: new Date(),
				updated_at: result.incident.updated_at
					? new Date(result.incident.updated_at)
					: new Date(),
				resolved_at: result.incident.resolved_at
					? new Date(result.incident.resolved_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save incident to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pagerduty.incidents.create',
		{ title: input.title },
		'completed',
	);
	return result;
};

export const get: PagerdutyEndpoints['incidentsGet'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<
		PagerdutyEndpointOutputs['incidentsGet']
	>(`incidents/${input.id}`, ctx.key);

	await logEventFromContext(
		ctx,
		'pagerduty.incidents.get',
		{ id: input.id },
		'completed',
	);
	return result;
};

export const list: PagerdutyEndpoints['incidentsList'] = async (ctx, input) => {
	const result = await makePagerdutyRequest<
		PagerdutyEndpointOutputs['incidentsList']
	>('incidents', ctx.key, {
		query: {
			limit: input.limit,
			offset: input.offset,
			since: input.since,
			until: input.until,
			sort_by: input.sort_by,
			...(input.statuses && { 'statuses[]': input.statuses.join(',') }),
			...(input.urgencies && { 'urgencies[]': input.urgencies.join(',') }),
			...(input.service_ids && {
				'service_ids[]': input.service_ids.join(','),
			}),
			...(input.team_ids && { 'team_ids[]': input.team_ids.join(',') }),
		},
	});

	await logEventFromContext(
		ctx,
		'pagerduty.incidents.list',
		{ limit: input.limit, offset: input.offset },
		'completed',
	);
	return result;
};

export const update: PagerdutyEndpoints['incidentsUpdate'] = async (
	ctx,
	input,
) => {
	const { id, ...fields } = input;
	const result = await makePagerdutyRequest<
		PagerdutyEndpointOutputs['incidentsUpdate']
	>(`incidents/${id}`, ctx.key, {
		method: 'PUT',
		body: {
			incident: {
				type: 'incident',
				...fields,
			},
		},
	});

	if (result.incident && ctx.db.incidents) {
		try {
			await ctx.db.incidents.upsertByEntityId(result.incident.id, {
				...result.incident,
				created_at: result.incident.created_at
					? new Date(result.incident.created_at)
					: new Date(),
				updated_at: result.incident.updated_at
					? new Date(result.incident.updated_at)
					: new Date(),
				resolved_at: result.incident.resolved_at
					? new Date(result.incident.resolved_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to update incident in database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'pagerduty.incidents.update',
		{ id, ...fields },
		'completed',
	);
	return result;
};
