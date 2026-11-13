import { logEventFromContext } from 'corsair/core';
import { makeGoDialRequest } from '../client';
import type { GoDialEndpoints } from '../index';
import {
	GoDialEndpointInputSchemas,
	GoDialEndpointOutputSchemas,
} from './types';

export const list: GoDialEndpoints['listsList'] = async (ctx, input) => {
	GoDialEndpointInputSchemas.listsList.parse(input);
	const response = await makeGoDialRequest('/meta/api/externals/lists/list', {
		method: 'GET',
		apiKey: ctx.key,
	});
	const parsedResponse = GoDialEndpointOutputSchemas.listsList.parse(response);
	await logEventFromContext(ctx, 'godial.lists.list', {}, 'completed');
	return parsedResponse;
};
