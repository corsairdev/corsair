import type { VaquillEndpoints } from '..';
import { makeVaquillRequest } from '../client';
import { callVaquill } from './call';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './types';

export const search: VaquillEndpoints['search'] = async (ctx, input) => {
	const result = await callVaquill(
		ctx,
		'vaquill.statutes.search',
		VaquillEndpointInputSchemas.search,
		VaquillEndpointOutputSchemas.search,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/search', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(validated, response) => ({
			query: validated.query,
			resultCount: response.results?.length ?? 0,
		}),
	);

	if (result.results && ctx.db.searchResults) {
		try {
			for (const hit of result.results) {
				if (!hit.actId) continue;
				// Upsert replaces the whole row, so carry saved keys like a
				// section body through hits that omit them.
				const existing = await ctx.db.searchResults.findByEntityId(
					hit.actId,
				);
				await ctx.db.searchResults.upsertByEntityId(hit.actId, {
					...existing?.data,
					...hit,
					query: input.query,
					createdAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save search results to database:', error);
		}
	}

	return result;
};

export const count: VaquillEndpoints['count'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.count',
		VaquillEndpointInputSchemas.count,
		VaquillEndpointOutputSchemas.count,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/count', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(_validated, response) => ({ count: response.count }),
	);
};

export const coverage: VaquillEndpoints['coverage'] = async (ctx) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.coverage',
		VaquillEndpointInputSchemas.coverage,
		VaquillEndpointOutputSchemas.coverage,
		{},
		() =>
			makeVaquillRequest('/us/statutes/coverage', ctx.key, { method: 'GET' }),
		() => ({}),
	);
};

export const divisions: VaquillEndpoints['divisions'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.divisions',
		VaquillEndpointInputSchemas.divisions,
		VaquillEndpointOutputSchemas.divisions,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/divisions', ctx.key, {
				method: 'GET',
				query: validated as Record<
					string,
					string | number | boolean | undefined
				>,
			}),
		(validated, response) => ({
			corpusType: validated.corpusType,
			level: response.level,
			count: response.divisions?.length ?? 0,
		}),
	);
};

export const resolve: VaquillEndpoints['resolve'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.resolve',
		VaquillEndpointInputSchemas.resolve,
		VaquillEndpointOutputSchemas.resolve,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/resolve', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(validated, response) => ({
			citations: validated.citations.length,
			resolvedCount: response.resolvedCount,
		}),
	);
};

export const resolveCitation: VaquillEndpoints['resolveCitation'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.resolveCitation',
		VaquillEndpointInputSchemas.resolveCitation,
		VaquillEndpointOutputSchemas.resolveCitation,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/resolve', ctx.key, {
				method: 'GET',
				query: {
					cite: validated.cite,
					state: validated.state,
					corpusType: validated.corpusType,
				},
			}),
		(validated, response) => ({
			cite: validated.cite,
			resolved: response.resolved,
		}),
	);
};

export const enactments: VaquillEndpoints['enactments'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.enactments',
		VaquillEndpointInputSchemas.enactments,
		VaquillEndpointOutputSchemas.enactments,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/statutes/section/${encodeURIComponent(validated.act_id)}/enactments`,
				ctx.key,
				{ method: 'GET' },
			),
		(validated, response) => ({
			act_id: validated.act_id,
			count: response.count,
		}),
	);
};

export const extractCitations: VaquillEndpoints['extractCitations'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.statutes.extractCitations',
		VaquillEndpointInputSchemas.extractCitations,
		VaquillEndpointOutputSchemas.extractCitations,
		input,
		(validated) =>
			makeVaquillRequest('/us/statutes/extract-citations', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(_validated, response) => ({
			textChars: response.textChars,
			found: response.counts
				? (response.counts as { found?: number }).found
				: undefined,
		}),
	);
};
