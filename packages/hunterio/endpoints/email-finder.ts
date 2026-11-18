import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const find: HunterioEndpoints['emailFinderFind'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailFinderFind.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailFinderFind']
	>('/email-finder', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailFinderFind.parse(response);

	// The found address is PII; only the fact that a finder call completed
	// is recorded.
	await logEventFromContext(ctx, 'hunterio.emailFinder.find', {}, 'completed');

	return parsedResponse;
};

export const findFound: HunterioEndpoints['emailFinderFindFound'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.emailFinderFindFound.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['emailFinderFindFound']
	>('/email-finder/found', ctx.key, { method: 'GET', query: parsed });

	const parsedResponse =
		HunterioEndpointOutputSchemas.emailFinderFindFound.parse(response);

	await logEventFromContext(
		ctx,
		'hunterio.emailFinder.findFound',
		{},
		'completed',
	);

	return parsedResponse;
};

export const findFoundPost: HunterioEndpoints['emailFinderFindFoundPost'] =
	async (ctx, input) => {
		const parsed =
			HunterioEndpointInputSchemas.emailFinderFindFoundPost.parse(input);

		const response = await makeHunterioRequest<
			HunterioEndpointOutputs['emailFinderFindFoundPost']
		>('/email-finder/found', ctx.key, { method: 'POST', body: parsed });

		const parsedResponse =
			HunterioEndpointOutputSchemas.emailFinderFindFoundPost.parse(response);

		await logEventFromContext(
			ctx,
			'hunterio.emailFinder.findFoundPost',
			{},
			'completed',
		);

		return parsedResponse;
	};
