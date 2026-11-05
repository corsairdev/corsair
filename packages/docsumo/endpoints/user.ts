import { logEventFromContext } from 'corsair/core';
import { makeDocsumoRequest } from '../client';
import type { DocsumoEndpoints } from '../index';
import {
	DocsumoEndpointInputSchemas,
	DocsumoEndpointOutputSchemas,
} from './types';

export const getDocumentTypes: DocsumoEndpoints['userGetDocumentTypes'] =
	async (ctx, input) => {
		DocsumoEndpointInputSchemas.userGetDocumentTypes.parse(input);

		const response = DocsumoEndpointOutputSchemas.userGetDocumentTypes.parse(
			await makeDocsumoRequest('/api/v1/eevee/apikey/limit/', ctx.key, {
				method: 'GET',
			}),
		);

		await logEventFromContext(
			ctx,
			'docsumo.user.getDocumentTypes',
			{ user_id: response.data?.user_id },
			'completed',
		);

		return response;
	};
