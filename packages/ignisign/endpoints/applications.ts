import { logEventFromContext } from 'corsair/core';
import type { IgnisignEndpoint } from '..';
import { makeIgnisignRequest, resolveAppId } from '../client';
import type { ApplicationContext } from './types';
import {
	IgnisignEndpointInputSchemas,
	IgnisignEndpointOutputSchemas,
} from './types';

export const getContext: IgnisignEndpoint<'applications.getContext'> = async (
	ctx,
	input,
) => {
	const parsedInput =
		IgnisignEndpointInputSchemas['applications.getContext'].parse(input);
	const appId = resolveAppId(ctx.key, parsedInput.appId);
	const endpoint = `/v4/applications/${encodeURIComponent(appId)}/context`;
	const response = await makeIgnisignRequest<ApplicationContext>(
		endpoint,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const parsed =
		IgnisignEndpointOutputSchemas['applications.getContext'].parse(response);
	await logEventFromContext(
		ctx,
		'ignisign.applications.getContext',
		{ appId, appType: parsed.appType },
		'completed',
	);
	return parsed;
};

export const ApplicationsEndpoints = {
	getContext,
} as const;
