import { logEventFromContext } from 'corsair/core';
import type { BubbleEndpoints } from '../index';
import { bubbleCall } from './shared';
import type { BubbleEndpointOutputs } from './types';

/**
 * GET /api/1.1/meta/swagger.json — auto-generated Swagger 2.0 for enabled APIs.
 * https://manual.bubble.io/help-guides/integrations/api/the-bubble-api
 */
export const getSwagger: BubbleEndpoints['metaGetSwagger'] = async (
	ctx,
	_input,
) => {
	const result = await bubbleCall<BubbleEndpointOutputs['metaGetSwagger']>(
		ctx,
		'meta/swagger.json',
	);
	await logEventFromContext(ctx, 'bubble.meta.getSwagger', {}, 'completed');
	return result;
};
