import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
	type ViewsGetResponse,
	type ViewsListResponse,
} from './types';

export const list: GigasheetEndpoints['views.list'] = async (ctx, input) => {
	const parsedInput =
		GigasheetEndpointInputSchemas['views.list'].parse(input);
	const response = await makeGigasheetRequest<ViewsListResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/views`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = GigasheetEndpointOutputSchemas['views.list'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.views.list',
		{ handle: parsedInput.handle, viewCount: parsed.length },
		'completed',
	);

	return parsed;
};

export const get: GigasheetEndpoints['views.get'] = async (ctx, input) => {
	const parsedInput = GigasheetEndpointInputSchemas['views.get'].parse(input);
	const response = await makeGigasheetRequest<ViewsGetResponse>(
		`/dataset/${encodeURIComponent(parsedInput.handle)}/views/${encodeURIComponent(parsedInput.view)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed = GigasheetEndpointOutputSchemas['views.get'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.views.get',
		{ handle: parsedInput.handle, viewId: parsed.id },
		'completed',
	);

	return parsed;
};

export const Views = {
	list,
	get,
};
