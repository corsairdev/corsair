import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const listExternal: DocsumoEndpoints['agentsListExternal'] = async (
	ctx,
	input,
) => {
	const query = DocsumoEndpointInputSchemas.agentsListExternal.parse(input);

	const response = DocsumoEndpointOutputSchemas.agentsListExternal.parse(
		await makeDocsumoRequest('/api/v1/external/agents', ctx.key, {
			method: 'GET',
			query,
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.agents.listExternal',
		{ type: query.type ?? 'all' },
		'completed',
	);

	return response;
};

export const listCases: DocsumoEndpoints['agentsListCases'] = async (
	ctx,
	input,
) => {
	const { casetype_id, ...query } =
		DocsumoEndpointInputSchemas.agentsListCases.parse(input);

	const response = DocsumoEndpointOutputSchemas.agentsListCases.parse(
		await makeDocsumoRequest(
			`/api/v1/external/agents/${encodeURIComponent(casetype_id)}/cases`,
			ctx.key,
			{ method: 'GET', query },
		),
	);

	await logEventFromContext(
		ctx,
		'docsumo.agents.listCases',
		{
			casetype_id,
			limit: query.limit,
			offset: query.offset,
			total: response.data?.pagination?.total,
		},
		'completed',
	);

	return response;
};
