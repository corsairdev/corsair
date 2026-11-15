import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const search: HunterioEndpoints['multiDomainSearchSearch'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.multiDomainSearchSearch.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['multiDomainSearchSearch']
	>('/multi-domain-search', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.multiDomainSearchSearch.parse(response);

	// Masked rows carry no PII; only the row count is recorded.
	await logEventFromContext(
		ctx,
		'hunterio.multiDomainSearch.search',
		{ rowCount: parsedResponse.data.length },
		'completed',
	);

	return parsedResponse;
};

export const reveal: HunterioEndpoints['multiDomainSearchReveal'] = async (
	ctx,
	input,
) => {
	const parsed =
		HunterioEndpointInputSchemas.multiDomainSearchReveal.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['multiDomainSearchReveal']
	>('/multi-domain-search/reveal', ctx.key, {
		method: 'POST',
		body: { handles: parsed.handles },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.multiDomainSearchReveal.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.multiDomainSearch.reveal',
		{ handleCount: parsed.handles.length },
		'completed',
	);

	return parsedResponse;
};
