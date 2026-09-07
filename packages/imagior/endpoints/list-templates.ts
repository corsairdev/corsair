import { logEventFromContext } from 'corsair/core';
import type { ImagiorEndpoints } from '..';
import { makeImagiorRequest } from '../client';
import {
	ImagiorEndpointInputSchemas,
	ImagiorEndpointOutputSchemas,
} from './types';

export const listTemplates: ImagiorEndpoints['listTemplates'] = async (
	ctx,
	input,
) => {
	const parsedInput = ImagiorEndpointInputSchemas.listTemplates.parse(input);
	const raw = await makeImagiorRequest('templates/all', ctx.key, {
		method: 'GET',
		query: {
			...(parsedInput.sort ? { sort: parsedInput.sort } : {}),
			...(parsedInput.order ? { order: parsedInput.order } : {}),
		},
	});
	const response = ImagiorEndpointOutputSchemas.listTemplates.parse(raw);

	await logEventFromContext(
		ctx,
		'imagior.templates.list',
		parsedInput,
		'completed',
	);
	return response;
};
