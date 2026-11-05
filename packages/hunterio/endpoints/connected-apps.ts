import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['connectedAppsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.connectedAppsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['connectedAppsList']
	>('/connected-apps', ctx.key, {
		method: 'GET',
		query: { limit: parsed.limit, offset: parsed.offset },
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.connectedAppsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.connectedApps.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['connectedAppsGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.connectedAppsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['connectedAppsGet']
	>(`/connected-apps/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.connectedAppsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.connectedApps.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const push: HunterioEndpoints['connectedAppsPush'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.connectedAppsPush.parse(input);
	const { id, ...body } = parsed;

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['connectedAppsPush']
	>(`/connected-apps/${id}/push`, ctx.key, { method: 'POST', body });

	const parsedResponse =
		HunterioEndpointOutputSchemas.connectedAppsPush.parse(response);

	// Only the pushed lead count and target app are recorded; lead emails
	// never enter logs.
	await logEventFromContext(
		ctx,
		'hunterio.connectedApps.push',
		{
			id,
			leadCount: parsed.lead_ids?.length,
		},
		'completed',
	);

	return parsedResponse;
};
