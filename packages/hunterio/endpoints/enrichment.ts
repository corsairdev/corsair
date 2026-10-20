import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const person: HunterioEndpoints['enrichmentPerson'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.enrichmentPerson.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['enrichmentPerson']
	>('/people/find', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.enrichmentPerson.parse(response);

	// The enriched person's email is PII; the event carries no payload.
	await logEventFromContext(ctx, 'hunterio.enrichment.person', {}, 'completed');

	return parsedResponse;
};

export const company: HunterioEndpoints['enrichmentCompany'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.enrichmentCompany.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['enrichmentCompany']
	>('/companies/find', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.enrichmentCompany.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.enrichment.company',
		{},
		'completed',
	);

	return parsedResponse;
};

export const combined: HunterioEndpoints['enrichmentCombined'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.enrichmentCombined.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['enrichmentCombined']
	>('/combined/find', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.enrichmentCombined.parse(response);

	// The enriched person's email is PII; the event carries no payload.
	await logEventFromContext(
		ctx,
		'hunterio.enrichment.combined',
		{},
		'completed',
	);

	return parsedResponse;
};
