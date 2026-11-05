import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const list: HunterioEndpoints['discoverViewsList'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverViewsList.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverViewsList']
	>('/discover/views', ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverViewsList.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discoverViews.list',
		{},
		'completed',
	);

	return parsedResponse;
};

export const create: HunterioEndpoints['discoverViewsCreate'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverViewsCreate.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverViewsCreate']
	>('/discover/views', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverViewsCreate.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discoverViews.create',
		{},
		'completed',
	);

	return parsedResponse;
};

export const get: HunterioEndpoints['discoverViewsGet'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverViewsGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverViewsGet']
	>(`/discover/views/${parsed.id}`, ctx.key, { method: 'GET' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverViewsGet.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discoverViews.get',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};

export const remove: HunterioEndpoints['discoverViewsDelete'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.discoverViewsDelete.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['discoverViewsDelete']
	>(`/discover/views/${parsed.id}`, ctx.key, { method: 'DELETE' });

	const parsedResponse =
		HunterioEndpointOutputSchemas.discoverViewsDelete.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.discoverViews.delete',
		{ id: parsed.id },
		'completed',
	);

	return parsedResponse;
};
