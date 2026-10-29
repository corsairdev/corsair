import { logEventFromContext } from 'corsair/core';
import { makeFlexisignRequest } from '../client';
import type { FlexisignEndpoints } from '../index';
import {
	FlexisignEndpointInputSchemas,
	FlexisignEndpointOutputSchemas,
} from './types';

export const listTemplates: FlexisignEndpoints['ListTemplates'] = async (
	ctx,
	input,
) => {
	const parsed = FlexisignEndpointInputSchemas.ListTemplates.parse(input);
	const query: Record<string, string | number | boolean | undefined> = {};
	if (parsed?.page !== undefined) query.page = parsed.page;
	if (parsed?.limit !== undefined) query.limit = parsed.limit;

	// Raw transport payload typed unknown, then validated against the zod
	// output schema below — no narrower static type exists for it.
	const raw = await makeFlexisignRequest<unknown>(
		'/v1/templates/all',
		ctx.key,
		{
			method: 'GET',
			query,
		},
	);
	const response = FlexisignEndpointOutputSchemas.ListTemplates.parse(raw);

	await logEventFromContext(ctx, 'flexisign.list.templates', {}, 'completed');

	return response;
};
