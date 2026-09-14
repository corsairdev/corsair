import { logEventFromContext } from 'corsair/core';
import type { CodyEndpoints } from '..';
import { makeCodyRequest } from '../client';
import type { ViewerResponse } from './types';
import { CodyEndpointInputSchemas, CodyEndpointOutputSchemas } from './types';

const VIEWER_QUERY = `query {
	currentUser {
		username
		displayName
		siteAdmin
	}
}`;

export const get: CodyEndpoints['viewer'] = async (ctx) => {
	CodyEndpointInputSchemas.viewer.parse({});
	const response = await makeCodyRequest<ViewerResponse>(
		'/.api/graphql',
		ctx.key,
		{
			method: 'POST',
			authScheme: ctx.options.authType === 'oauth_2' ? 'Bearer' : 'token',
			body: { query: VIEWER_QUERY },
		},
	);

	const validated = CodyEndpointOutputSchemas.viewer.parse(response);

	await logEventFromContext(ctx, 'cody.viewer.get', {}, 'completed');

	return validated;
};
