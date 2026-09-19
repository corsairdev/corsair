import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const create: DocsumoEndpoints['foldersCreate'] = async (ctx, input) => {
	const body = DocsumoEndpointInputSchemas.foldersCreate.parse(input);

	const response = DocsumoEndpointOutputSchemas.foldersCreate.parse(
		await makeDocsumoRequest('/api/v1/mew/folder/add/', ctx.key, {
			method: 'POST',
			body,
		}),
	);

	await logEventFromContext(
		ctx,
		'docsumo.folders.create',
		{ folder_name: body.folder_name, type: body.type },
		'completed',
	);

	return response;
};
