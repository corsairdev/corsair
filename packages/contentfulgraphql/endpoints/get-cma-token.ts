import { logEventFromContext } from 'corsair/core';
import type { ContentfulGraphqlEndpoints } from '..';
import type { GetCmaTokenResponse } from './types';

export const getCmaToken: ContentfulGraphqlEndpoints['getCmaToken'] = async (
	ctx,
	_input,
) => {
	const [spaceId, environmentId] = await Promise.all([
		ctx.keys.get_space_id(),
		ctx.keys.get_environment_id(),
	]);

	const response: GetCmaTokenResponse = {
		space_id: spaceId ?? '',
		...(environmentId ? { environment_id: environmentId } : {}),
	};

	await logEventFromContext(
		ctx,
		'contentfulgraphql.getCmaToken',
		{ space_id: response.space_id },
		'completed',
	);

	return response;
};
