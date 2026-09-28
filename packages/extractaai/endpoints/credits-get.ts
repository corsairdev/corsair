import type { ExtractaaiEndpoints } from '..';
import { makeExtractaaiRequest } from '../client';
import type { ExtractaaiEndpointOutputs } from './types';
import { ExtractaaiEndpointOutputSchemas } from './types';

export const get: ExtractaaiEndpoints['creditsGet'] = async (ctx, _input) => {
	const response = await makeExtractaaiRequest<
		ExtractaaiEndpointOutputs['creditsGet']
	>('credits', ctx.key, {
		method: 'GET',
	});

	const parsed = ExtractaaiEndpointOutputSchemas.creditsGet.safeParse(response);
	if (parsed.success === false) {
		throw new Error(
			`Extracta.ai credits.get response failed schema validation: ${parsed.error.message}`,
		);
	}
	return parsed.data;
};
