import { logEventFromContext } from 'corsair/core';
import type { WinstonaiEndpoints } from '..';
import { makeWinstonaiRequest } from '../client';
import {
	WinstonaiEndpointInputSchemas,
	WinstonaiEndpointOutputSchemas,
} from './types';

export const textCompare: WinstonaiEndpoints['textCompare'] = async (
	ctx,
	input,
) => {
	const parsed = WinstonaiEndpointInputSchemas.textCompare.parse(input);

	const response = await makeWinstonaiRequest('/text-compare', ctx.key, {
		schema: WinstonaiEndpointOutputSchemas.textCompare,
		body: {
			first_text: parsed.first_text,
			second_text: parsed.second_text,
		},
	});

	await logEventFromContext(
		ctx,
		'winstonai.text.compare',
		{
			firstTextLength: parsed.first_text.length,
			secondTextLength: parsed.second_text.length,
		},
		'completed',
	);

	return response;
};
