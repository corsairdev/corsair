import type { PdlEndpoints } from '..';
import { pdlQuery, requestPdlEnrichment } from '../client';
import { callPdl } from './call';
import { PdlEndpointInputSchemas, PdlEndpointOutputSchemas } from './types';

export const enrich: PdlEndpoints['ipEnrich'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.ip.enrich',
		PdlEndpointInputSchemas.ipEnrich,
		PdlEndpointOutputSchemas.ipEnrich,
		input,
		async (validated) => {
			const response = await requestPdlEnrichment<{
				status: number;
				data: {
					ip: { address: string };
					// Same open company record as company.enrich.
					company?: Record<string, unknown>;
					// Same open person profile as person.enrich.
					person?: Record<string, unknown>;
				};
				dataset_version?: string | number;
			}>('/v5/ip/enrich', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			});
			return response === null
				? { found: false }
				: { found: true, ...response };
		},
		(validated, response) => ({
			found: response.found,
			ip: validated.ip,
			hasCompany: response.found && response.data.company !== undefined,
			hasPerson: response.found && response.data.person !== undefined,
		}),
	);
};
