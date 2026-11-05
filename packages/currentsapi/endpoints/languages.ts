import { logEventFromContext } from 'corsair/core';
import type { CurrentsApiEndpoints } from '..';
import { makeCurrentsApiRequest } from '../client';
import type { LanguagesResponse } from './types';
import { CurrentsApiEndpointOutputSchemas } from './types';

export const get: CurrentsApiEndpoints['languages'] = async (ctx) => {
	const response = await makeCurrentsApiRequest<LanguagesResponse>(
		'/available/languages',
		ctx.key,
		{},
	);

	const validated = CurrentsApiEndpointOutputSchemas.languages.parse(response);

	await logEventFromContext(ctx, 'currentsapi.languages.get', {}, 'completed');

	return validated;
};
