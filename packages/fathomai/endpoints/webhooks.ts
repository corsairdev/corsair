import { logEventFromContext } from 'corsair/core';
import type { FathomAiEndpoints } from '..';
import { makeFathomAiRequest } from '../client';
import {
	FathomAiEndpointInputSchemas,
	FathomAiEndpointOutputSchemas,
} from './types';

export const create: FathomAiEndpoints['webhooksCreate'] = async (
	ctx,
	input,
) => {
	const body = FathomAiEndpointInputSchemas.webhooksCreate.parse(input);
	const response = FathomAiEndpointOutputSchemas.webhooksCreate.parse(
		await makeFathomAiRequest('/webhooks', ctx.key, { method: 'POST', body }),
	);
	// The response carries the signing secret, so only the id and triggers are logged.
	await logEventFromContext(
		ctx,
		'fathomai.webhooks.create',
		{ id: response.id, triggered_for: response.triggered_for },
		'completed',
	);
	return response;
};

export const remove: FathomAiEndpoints['webhooksDelete'] = async (
	ctx,
	input,
) => {
	const { id } = FathomAiEndpointInputSchemas.webhooksDelete.parse(input);
	await makeFathomAiRequest('/webhooks/{id}', ctx.key, {
		method: 'DELETE',
		path: { id },
	});
	await logEventFromContext(
		ctx,
		'fathomai.webhooks.delete',
		{ id },
		'completed',
	);
	return FathomAiEndpointOutputSchemas.webhooksDelete.parse({
		id,
		deleted: true,
	});
};
