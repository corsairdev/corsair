import type { VaquillEndpoints } from '..';
import { makeVaquillRequest } from '../client';
import { callVaquill } from './call';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './types';

export const changes: VaquillEndpoints['sessionLawsChanges'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.changes',
		VaquillEndpointInputSchemas.sessionLawsChanges,
		VaquillEndpointOutputSchemas.sessionLawsChanges,
		input,
		(validated) =>
			makeVaquillRequest('/us/session-laws/changes', ctx.key, {
				method: 'GET',
				query: {
					sinceId: validated.sinceId,
					jurisdiction: validated.jurisdiction,
					limit: validated.limit,
				},
			}),
		(_validated, response) => ({
			changeCount: response.changes?.length ?? 0,
			hasMore: response.hasMore,
		}),
	);
};

export const batch: VaquillEndpoints['sessionLawsBatch'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.batch',
		VaquillEndpointInputSchemas.sessionLawsBatch,
		VaquillEndpointOutputSchemas.sessionLawsBatch,
		input,
		(validated) =>
			makeVaquillRequest('/us/session-laws/batch', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(validated, response) => ({
			requested: validated.ids.length,
			found: response.laws?.length ?? 0,
			notFound: response.notFound?.length ?? 0,
		}),
	);
};

export const search: VaquillEndpoints['sessionLawsSearch'] = async (
	ctx,
	input,
) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.search',
		VaquillEndpointInputSchemas.sessionLawsSearch,
		VaquillEndpointOutputSchemas.sessionLawsSearch,
		input,
		(validated) =>
			makeVaquillRequest('/us/session-laws/search', ctx.key, {
				method: 'POST',
				body: validated as Record<string, unknown>,
			}),
		(validated, response) => ({
			query: validated.query,
			resultCount: response.results?.length ?? 0,
		}),
	);
};

export const list: VaquillEndpoints['sessionLawsList'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.list',
		VaquillEndpointInputSchemas.sessionLawsList,
		VaquillEndpointOutputSchemas.sessionLawsList,
		input,
		(validated) =>
			makeVaquillRequest('/us/session-laws/list', ctx.key, {
				method: 'GET',
				query: {
					jurisdiction: validated.jurisdiction,
					session: validated.session,
					series: validated.series,
					instrumentType: validated.instrumentType,
					approvedFrom: validated.approvedFrom,
					approvedTo: validated.approvedTo,
					effectiveFrom: validated.effectiveFrom,
					effectiveTo: validated.effectiveTo,
					hasText: validated.hasText,
					textStatus: validated.textStatus,
					isLaw: validated.isLaw,
					enactmentOutcome: validated.enactmentOutcome,
					updatedSince: validated.updatedSince,
					q: validated.q,
					cursor: validated.cursor,
					limit: validated.limit,
				},
			}),
		(validated, response) => ({
			jurisdiction: validated.jurisdiction,
			count: response.results?.length ?? 0,
			hasMore: response.hasMore,
		}),
	);
};

export const body: VaquillEndpoints['sessionLawBody'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.body',
		VaquillEndpointInputSchemas.sessionLawBody,
		VaquillEndpointOutputSchemas.sessionLawBody,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/session-laws/${encodeURIComponent(validated.session_law_id)}/body`,
				ctx.key,
				{
					method: 'GET',
					query: {
						cursor: validated.cursor,
						startChar: validated.startChar,
						expectTextSha256: validated.expectTextSha256,
					},
				},
			),
		(validated, response) => ({
			session_law_id: validated.session_law_id,
			available: response.available,
			textStatus: response.textStatus,
		}),
	);
};

export const get: VaquillEndpoints['sessionLaw'] = async (ctx, input) => {
	return callVaquill(
		ctx,
		'vaquill.sessionLaws.get',
		VaquillEndpointInputSchemas.sessionLaw,
		VaquillEndpointOutputSchemas.sessionLaw,
		input,
		(validated) =>
			makeVaquillRequest(
				`/us/session-laws/${encodeURIComponent(validated.session_law_id)}`,
				ctx.key,
				{
					method: 'GET',
					query: { jurisdiction: validated.jurisdiction },
				},
			),
		(_validated, response) => ({ citation: response.citation }),
	);
};
