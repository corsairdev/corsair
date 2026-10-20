import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const listAll: DocsumoEndpoints['documentsListAll'] = async (
	ctx,
	input,
) => {
	const query = DocsumoEndpointInputSchemas.documentsListAll.parse(input);

	const response = DocsumoEndpointOutputSchemas.documentsListAll.parse(
		await makeDocsumoRequest('/api/v1/eevee/apikey/documents/all/', ctx.key, {
			method: 'GET',
			query,
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.documents.listAll',
		{
			limit: query.limit,
			offset: query.offset,
			total: response.data?.total,
		},
		'completed',
	);

	return response;
};
