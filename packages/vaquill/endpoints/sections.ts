import type { VaquillEndpoints } from '..';
import { makeVaquillRequest } from '../client';
import { callVaquill } from './call';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './types';

export const section: VaquillEndpoints['section'] = async (ctx, input) => {
	const result = await callVaquill(
		ctx,
		'vaquill.statutes.section',
		VaquillEndpointInputSchemas.section,
		VaquillEndpointOutputSchemas.section,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}`,
				ctx.key,
				{ method: 'GET' },
			),
		(validated) => ({ act_id: validated.act_id }),
	);

	if (result.section?.actId && ctx.db.searchResults) {
		try {
			// Upsert replaces the whole row, so carry saved keys like the
			// search query through sections that omit them.
			const existing = await ctx.db.searchResults.findByEntityId(
				result.section.actId,
			);
			await ctx.db.searchResults.upsertByEntityId(result.section.actId, {
				...existing?.data,
				...result.section,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save section to database:', error);
		}
	}

	return result;
};

export const sections: VaquillEndpoints['sections'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sections',
		VaquillEndpointInputSchemas.sections,
		VaquillEndpointOutputSchemas.sections,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/sections', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(validated, response) => ({
			requested: validated.actIds.length,
			found: response.sections?.length ?? 0,
			notFound: response.notFound?.length ?? 0,
		}),
	);
};

export const sectionBody: VaquillEndpoints['sectionBody'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sectionBody',
		VaquillEndpointInputSchemas.sectionBody,
		VaquillEndpointOutputSchemas.sectionBody,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/body`,
				ctx.key,
				{
					method: 'GET',
					query: {
						format: validated.format,
						structured: validated.structured,
						asOf: validated.asOf,
					},
				},
			),
		(validated, response) => ({
			act_id: validated.act_id,
			available: response.available,
		}),
	);
};

export const sectionChanges: VaquillEndpoints['sectionChanges'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sectionChanges',
		VaquillEndpointInputSchemas.sectionChanges,
		VaquillEndpointOutputSchemas.sectionChanges,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/changes`,
				ctx.key,
				{
					method: 'GET',
					query: {
						limit: validated.limit,
						sinceId: validated.sinceId,
						beforeId: validated.beforeId,
						changeKind: validated.changeKind,
						order: validated.order,
					},
				},
			),
		(validated, response) => ({
			act_id: validated.act_id,
			changeCount: response.changes?.length ?? 0,
		}),
	);
};

export const sectionCitedBy: VaquillEndpoints['sectionCitedBy'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sectionCitedBy',
		VaquillEndpointInputSchemas.sectionCitedBy,
		VaquillEndpointOutputSchemas.sectionCitedBy,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/cited-by`,
				ctx.key,
				{ method: 'GET', query: { limit: validated.limit } },
			),
		(validated, response) => ({
			act_id: validated.act_id,
			total: response.total,
		}),
	);
};

export const sectionCrossState: VaquillEndpoints['sectionCrossState'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sectionCrossState',
		VaquillEndpointInputSchemas.sectionCrossState,
		VaquillEndpointOutputSchemas.sectionCrossState,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/cross-state`,
				ctx.key,
				{ method: 'GET', query: { limit: validated.limit } },
			),
		(validated, response) => ({
			act_id: validated.act_id,
			statesCovered: response.statesCovered,
		}),
	);
};

export const sectionDefinitions: VaquillEndpoints['sectionDefinitions'] =
	async (ctx, input) => {
		return callVaquill(
			ctx,
			'vaquill.statutes.sectionDefinitions',
			VaquillEndpointInputSchemas.sectionDefinitions,
			VaquillEndpointOutputSchemas.sectionDefinitions,
			input,
			(validated) =>
				makeVaquillRequest(
					`/us/statutes/section/${encodeURIComponent(validated.act_id)}/definitions`,
					ctx.key,
					{ method: 'GET' },
				),
			(validated, response) => ({
				act_id: validated.act_id,
				terms: response.total,
			}),
		);
	};

export const sectionRelated: VaquillEndpoints['sectionRelated'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.sectionRelated',
		VaquillEndpointInputSchemas.sectionRelated,
		VaquillEndpointOutputSchemas.sectionRelated,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/related`,
				ctx.key,
				{ method: 'GET', query: { limit: validated.limit } },
			),
		(validated, response) => ({
			act_id: validated.act_id,
			previous: response.previous?.length ?? 0,
			next: response.next?.length ?? 0,
		}),
	);
};
