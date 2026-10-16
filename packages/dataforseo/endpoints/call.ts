import { logEventFromContext } from 'corsair/core';
import type { DataForSeoContext } from '..';
import { makeDataForSeoRequest } from '../client';
import type {
	DataForSeoEndpointInputs,
	DataForSeoEndpointOutputs,
} from './types';
import {
	DataForSeoEndpointInputSchemas,
	DataForSeoEndpointOutputSchemas,
} from './types';

type Operation = keyof DataForSeoEndpointInputs;

type Route =
	| { method: 'POST'; path: string }
	| {
			method: 'GET';
			path: string;
			pathParams?: (input: never) => Record<string, string>;
	  };

/**
 * POST routes send the validated input as the request's single task; GET
 * routes take their parameters from the path.
 */
export async function call<K extends Operation>(
	ctx: DataForSeoContext,
	operation: K,
	event: string,
	route: Route,
	input: unknown,
): Promise<DataForSeoEndpointOutputs[K]> {
	const parsed = DataForSeoEndpointInputSchemas[operation].parse(input ?? {});
	const raw = await makeDataForSeoRequest<unknown>(route.path, ctx.key, {
		method: route.method,
		sandbox: ctx.options.sandbox,
		...(route.method === 'POST'
			? { task: parsed }
			: { path: route.pathParams?.(parsed as never) }),
	});
	const result = DataForSeoEndpointOutputSchemas[operation].parse(
		raw,
	) as DataForSeoEndpointOutputs[K];

	await logEventFromContext(
		ctx,
		`dataforseo.${event}`,
		{ cost: result.cost ?? 0, taskId: result.tasks?.[0]?.id },
		'completed',
	);
	return result;
}

/** The first task's result array, which is where each operation's data lives. */
export function results<T>(response: {
	tasks?: { result?: T[] | null }[] | null;
}): T[] {
	return response.tasks?.[0]?.result ?? [];
}
