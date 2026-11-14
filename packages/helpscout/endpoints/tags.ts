import { logEventFromContext } from 'corsair/core';
import { makeHelpscoutRequest } from '../client';
import type { HelpScoutEndpoints } from '../index';
import type { HelpScoutEndpointOutputs } from './types';
import {
	HelpScoutEndpointInputSchemas,
	HelpScoutEndpointOutputSchemas,
} from './types';

export const list: HelpScoutEndpoints['tags.list'] = async (ctx, input) => {
	const parsedInput = HelpScoutEndpointInputSchemas['tags.list'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['tags.list']
	>('/tags', ctx.key, {
		method: 'GET',
		query: {
			page: parsedInput.page,
		},
	});

	const parsed = HelpScoutEndpointOutputSchemas['tags.list'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.tags.list',
		{ count: parsed._embedded.tags.length },
		'completed',
	);

	return parsed;
};

export const get: HelpScoutEndpoints['tags.get'] = async (ctx, input) => {
	const parsedInput = HelpScoutEndpointInputSchemas['tags.get'].parse(input);
	const response = await makeHelpscoutRequest<
		HelpScoutEndpointOutputs['tags.get']
	>(`/tags/${encodeURIComponent(String(parsedInput.tagId))}`, ctx.key, {
		method: 'GET',
	});

	const parsed = HelpScoutEndpointOutputSchemas['tags.get'].parse(response);

	await logEventFromContext(
		ctx,
		'helpscout.tags.get',
		{ tagId: parsed.id },
		'completed',
	);

	return parsed;
};
