import type { PdlEndpoints } from '..';
import { makePDLRequest, pdlQuery, requestPdlEnrichment } from '../client';
import { callPdl } from './call';
import {
	PdlEndpointInputSchemas,
	PdlEndpointOutputSchemas,
	readNumber,
	readString,
} from './types';

export const enrich: PdlEndpoints['companyEnrich'] = async (ctx, input) => {
	const result = await callPdl(
		ctx,
		'pdl.company.enrich',
		PdlEndpointInputSchemas.companyEnrich,
		PdlEndpointOutputSchemas.companyEnrich,
		input,
		async (validated) => {
			const response = await requestPdlEnrichment<
				Record<string, unknown> & {
					status: number;
					likelihood: number;
				}
			>('/v5/company/enrich', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			});
			if (response === null) {
				return { found: false };
			}
			const { status, likelihood, ...company } = response;
			return { found: true, status, likelihood, company };
		},
		(validated, response) => ({
			found: response.found,
			likelihood: response.found ? response.likelihood : undefined,
			input: validated.name ?? validated.website ?? validated.ticker,
		}),
	);

	if (result.found && ctx.db.companies) {
		try {
			const company = result.company;
			const companyId = readString(company.id);
			const website = readString(company.website);
			const entityId = companyId ?? website ?? input.website;
			if (entityId) {
				await ctx.db.companies.upsertByEntityId(entityId, {
					companyId,
					name: readString(company.name) ?? readString(company.display_name),
					website: website ?? input.website,
					ticker: readString(company.ticker),
					industry: readString(company.industry),
					employeeCount: readNumber(company.employee_count),
					foundedYear: readNumber(company.founded_year),
					likelihood: result.likelihood,
					enrichedAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('Failed to save PDL company to database:', error);
		}
	}

	return result;
};

export const search: PdlEndpoints['companySearch'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.company.search',
		PdlEndpointInputSchemas.companySearch,
		PdlEndpointOutputSchemas.companySearch,
		input,
		(validated) =>
			makePDLRequest('/v5/company/search', ctx.key, {
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
