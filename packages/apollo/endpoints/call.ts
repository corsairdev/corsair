import { logEventFromContext } from 'corsair/core';
import type { ApolloContext } from '..';
import { makeApolloRequest, toApolloQuery } from '../client';
import type { ApolloEndpointInputs, ApolloEndpointOutputs } from './types';
import {
	ApolloEndpointInputSchemas,
	ApolloEndpointOutputSchemas,
} from './types';

type Operation = keyof ApolloEndpointInputs;

/**
 * Apollo takes every parameter in the query string, POST endpoints included.
 * Path parameters named in `pathKeys` are moved into the URL instead.
 */
export async function call<K extends Operation>(
	ctx: ApolloContext,
	operation: K,
	event: string,
	method: 'GET' | 'POST',
	path: string,
	input: unknown,
	pathKeys: readonly string[] = [],
): Promise<ApolloEndpointOutputs[K]> {
	const parsed: Record<string, unknown> = ApolloEndpointInputSchemas[
		operation
	].parse(input ?? {});
	const pathParams: Record<string, string> = {};
	const params: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (pathKeys.includes(key)) pathParams[key] = String(value);
		else params[key] = value;
	}

	const raw = await makeApolloRequest<unknown>(path, ctx.key, {
		method,
		path: pathParams,
		query: toApolloQuery(params),
	});
	const result = ApolloEndpointOutputSchemas[operation].parse(
		raw,
	) as ApolloEndpointOutputs[K];

	await logEventFromContext(ctx, `apollo.${event}`, {}, 'completed');
	return result;
}
