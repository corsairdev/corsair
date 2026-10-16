import type { PdlEndpoints } from '..';
import { makePDLRequest, pdlQuery, requestPdlEnrichment } from '../client';
import { callPdl } from './call';
import { PdlEndpointInputSchemas, PdlEndpointOutputSchemas } from './types';

export const enrich: PdlEndpoints['personEnrich'] = async (ctx, input) => {
	const result = await callPdl(
		ctx,
		'pdl.person.enrich',
		PdlEndpointInputSchemas.personEnrich,
		PdlEndpointOutputSchemas.personEnrich,
		input,
		async (validated) => {
			const response = await requestPdlEnrichment<{
				status: number;
				likelihood: number;
				data: Record<string, unknown> | null;
				matched?: string[];
			}>('/v5/person/enrich', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			});
			return response === null
				? { found: false }
				: { found: true, ...response };
		},
		(validated, response) => ({
			found: response.found,
			likelihood: response.found ? response.likelihood : undefined,
			input: validated.name ?? validated.email ?? validated.profile,
		}),
	);

	if (result.found && result.data?.pdl_id && ctx.db.people) {
		try {
			const data = result.data as {
				pdl_id: string;
				full_name?: string;
				job_title?: string;
				job_company_name?: string;
				work_email?: string;
				personal_emails?: string[];
				mobile_phone?: string;
				location_country?: string;
				location_locality?: string;
			};
			await ctx.db.people.upsertByEntityId(data.pdl_id, {
				pdlId: data.pdl_id,
				name: data.full_name,
				jobTitle: data.job_title,
				jobCompanyName: data.job_company_name,
				email: data.work_email ?? data.personal_emails?.[0],
				phone: data.mobile_phone,
				country: data.location_country,
				locality: data.location_locality,
				likelihood: result.likelihood,
				enrichedAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save PDL person to database:', error);
		}
	}

	return result;
};

export const search: PdlEndpoints['personSearch'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.person.search',
		PdlEndpointInputSchemas.personSearch,
		PdlEndpointOutputSchemas.personSearch,
		input,
		(validated) =>
			makePDLRequest('/v5/person/search', ctx.key, {
				// PDL's documented POST variant: the search body travels as JSON
				// with no URL-length limit (their "Using POST Requests" section).
				method: 'POST',
				body: validated,
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			total: response.total,
			resultCount: response.data.length,
			hasMore: response.scroll_token !== undefined,
			mode: validated.query ? 'query' : 'sql',
		}),
	);
};

export const identify: PdlEndpoints['personIdentify'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.person.identify',
		PdlEndpointInputSchemas.personIdentify,
		PdlEndpointOutputSchemas.personIdentify,
		input,
		async (validated) => {
			const response = await requestPdlEnrichment<{
				status: number;
				matches: Array<{
					match_score: number;
					data: Record<string, unknown>[];
					matched_on?: string[];
				}>;
			}>('/v5/person/identify', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			});
			return response === null
				? { found: false }
				: { found: true, ...response };
		},
		(_validated, response) => ({
			found: response.found,
			matchCount: response.found ? response.matches.length : 0,
		}),
	);
};

export const bulk: PdlEndpoints['personBulk'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.person.bulk',
		PdlEndpointInputSchemas.personBulk,
		PdlEndpointOutputSchemas.personBulk,
		input,
		(validated) =>
			makePDLRequest('/v5/person/bulk', ctx.key, {
				method: 'POST',
				body: validated,
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			requestCount: validated.requests.length,
			matched: response.filter((item) => item.status === 200).length,
			failed: response.filter((item) => item.status !== 200).length,
		}),
	);
};
