import { logEventFromContext } from 'corsair/core';
import type { CanvasEndpoints } from '..';
import { makeCanvasRequest } from '../client';
import type { CanvasOperationName } from './operations';
import { canvasOperations } from './operations';
import type { CanvasEndpointInputs, CanvasEndpointOutputs } from './types';
import {
	CanvasEndpointInputSchemas,
	CanvasEndpointOutputSchemas,
} from './types';

async function resolveCanvasBaseUrl(ctx: {
	options?: { baseUrl?: string };
	keys?: object;
}): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return fromOptions;

	const keys = ctx.keys as
		| { get_base_url?: () => Promise<string | null | undefined> }
		| undefined;
	const fromAccount = await keys?.get_base_url?.();
	if (fromAccount?.trim()) return fromAccount.trim();

	throw new Error(
		'[canvas] baseUrl is required — set plugin options.baseUrl or account base_url',
	);
}

export function createCanvasEndpoint<K extends CanvasOperationName>(
	name: K,
	eventPath: string,
): CanvasEndpoints[K] {
	return (async (ctx, rawInput) => {
		const input = CanvasEndpointInputSchemas[name].parse(
			rawInput ?? {},
		) as CanvasEndpointInputs[K];
		const operation = canvasOperations[name];
		const baseUrl = await resolveCanvasBaseUrl(
			ctx as {
				options?: { baseUrl?: string };
				keys?: object;
			},
		);

		const response = await makeCanvasRequest<unknown>(operation.path, ctx.key, {
			method: operation.method,
			path: input.pathParams,
			query: input.query,
			body: input.body,
			baseUrl,
		});

		const parsed = CanvasEndpointOutputSchemas[name].parse(
			response,
		) as CanvasEndpointOutputs[K];
		await logEventFromContext(ctx, eventPath, input, 'completed');
		return parsed;
	}) as CanvasEndpoints[K];
}
