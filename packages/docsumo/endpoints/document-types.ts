import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const getEnabled: DocsumoEndpoints['documentTypesGetEnabled'] = async (
	ctx,
	input,
) => {
	DocsumoEndpointInputSchemas.documentTypesGetEnabled.parse(input);

	const response = DocsumoEndpointOutputSchemas.documentTypesGetEnabled.parse(
		await makeDocsumoRequest('/api/v1/mew/apikey/documents/summary/', ctx.key, {
			method: 'GET',
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.documentTypes.getEnabled',
		{},
		'completed',
	);

	return response;
};

export const listEnabled: DocsumoEndpoints['documentTypesListEnabled'] = async (
	ctx,
	input,
) => {
	DocsumoEndpointInputSchemas.documentTypesListEnabled.parse(input);

	const response = DocsumoEndpointOutputSchemas.documentTypesListEnabled.parse(
		await makeDocsumoRequest('/api/v1/mew/documents/types/', ctx.key, {
			method: 'GET',
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.documentTypes.listEnabled',
		{},
		'completed',
	);

	return response;
};
