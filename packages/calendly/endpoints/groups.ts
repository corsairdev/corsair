import { logEventFromContext } from 'corsair/core';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const get: CalendlyEndpoints['groupsGet'] = async (ctx, input) => {
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['groupsGet']
	>(`groups/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource && ctx.db.groups) {
		try {
			const uriParts = result.resource.uri.split('/');
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.groups.upsertByEntityId(id, {
				id,
				...result.resource,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save group to database:', error);
		}
	}

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
		const { uuid, ...query } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['groupsGetRelationship']
		>(`group_relationships/${uuid}`, ctx.key, {
			query,
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
		query: input,
	});

	if (result.collection && ctx.db.groups) {
		try {
			for (const group of result.collection) {
				const uriParts = group.uri.split('/');
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.groups.upsertByEntityId(id, {
					id,
					...group,
					created_at: group.created_at ? new Date(group.created_at) : null,
					updated_at: group.updated_at ? new Date(group.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save groups to database:', error);
		}
	}

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
			query: input,
		});

		await logEventFromContext(
			ctx,
			'calendly.groups.listRelationships',
			{ ...input },
			'completed',
		);
		return result;
	};
