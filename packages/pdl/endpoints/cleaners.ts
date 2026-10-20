import type { PdlEndpoints } from '..';
import { makePDLRequest, pdlQuery } from '../client';
import { callPdl } from './call';
import { PdlEndpointInputSchemas, PdlEndpointOutputSchemas } from './types';

export const company: PdlEndpoints['companyClean'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.company.clean',
		PdlEndpointInputSchemas.companyClean,
		PdlEndpointOutputSchemas.companyClean,
		input,
		(validated) =>
			makePDLRequest('/v5/company/clean', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			input: validated.name ?? validated.website ?? validated.profile,
			cleaned: response.name,
		}),
	);
};

export const school: PdlEndpoints['schoolClean'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.school.clean',
		PdlEndpointInputSchemas.schoolClean,
		PdlEndpointOutputSchemas.schoolClean,
		input,
		(validated) =>
			makePDLRequest('/v5/school/clean', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			input: validated.name ?? validated.website ?? validated.profile,
			cleaned: response.name,
		}),
	);
};

export const location: PdlEndpoints['locationClean'] = async (ctx, input) => {
	return callPdl(
		ctx,
		'pdl.location.clean',
		PdlEndpointInputSchemas.locationClean,
		PdlEndpointOutputSchemas.locationClean,
		input,
		(validated) =>
			makePDLRequest('/v5/location/clean', ctx.key, {
				query: pdlQuery(validated),
				baseUrl: ctx.options?.baseUrl,
			}),
		(validated, response) => ({
			input: validated.location,
			cleaned: response.name,
		}),
	);
};
