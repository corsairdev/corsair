import { logEventFromContext } from 'corsair/core';
import type { PostHogApiOptions } from '../client';
import { makePostHogApiRequest, unpackPostHogCredentials } from '../client';
import type { PostHogEndpoints } from '../index';

type PostHogEndpointContext = Parameters<PostHogEndpoints['queryRun']>[0];

/**
 * One private-API call with the connection's personal key, logged under
 * `eventType` with a small payload (ids and filters, never results).
 */
export async function callPostHogApi<T>(
	ctx: PostHogEndpointContext,
	eventType: string,
	path: string,
	options: PostHogApiOptions,
	logPayload: Record<string, unknown>,
): Promise<T> {
	const response = await makePostHogApiRequest<T>(
		unpackPostHogCredentials(ctx.key),
		path,
		options,
	);
	await logEventFromContext(ctx, eventType, logPayload, 'completed');
	return response;
}
