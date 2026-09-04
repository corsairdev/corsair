import { logEventFromContext } from 'corsair/core';
import type { WisepopsEndpoints } from '..';
import { makeWisepopsRequest } from '../client';
import type { WisepopsEndpointOutputs } from './types';
import {
	WisepopsEndpointInputSchemas,
	WisepopsEndpointOutputSchemas,
} from './types';

export const createWebhook: WisepopsEndpoints['webhookCreate'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		WisepopsEndpointInputSchemas.webhookCreate.parse(input);
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['webhookCreate']
	>('api2/hooks', ctx.key, { method: 'POST', body: validatedInput });

	await logEventFromContext(
		ctx,
		'wisepops.webhook.create',
		{ ...validatedInput },
		'completed',
	);
	return WisepopsEndpointOutputSchemas.webhookCreate.parse(response);
};

export const deleteWebhook: WisepopsEndpoints['webhookDelete'] = async (
	ctx,
	input,
) => {
	const validatedInput =
		WisepopsEndpointInputSchemas.webhookDelete.parse(input);
	const response = await makeWisepopsRequest<
		WisepopsEndpointOutputs['webhookDelete']
	>('api2/hooks', ctx.key, {
		method: 'DELETE',
		query: { hook_id: validatedInput.hook_id },
	});

	await logEventFromContext(
		ctx,
		'wisepops.webhook.delete',
		{ ...validatedInput },
		'completed',
	);
	return WisepopsEndpointOutputSchemas.webhookDelete.parse(response);
};
