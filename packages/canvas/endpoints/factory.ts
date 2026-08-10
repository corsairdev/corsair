import { logEventFromContext } from 'corsair/core';
import type { CanvasEndpoints, CanvasKeyBuilderContext } from '..';
import { makeCanvasRequest } from '../client';
import { syncCanvasOperationCache } from './cache-sync';
import type { CanvasOperationName } from './operations';
import { canvasOperations } from './operations';
import { getCanvasRoute } from './routes';
import type { CanvasEndpointInputs, CanvasEndpointOutputs } from './types';
import {
	CanvasEndpointInputSchemas,
	CanvasEndpointOutputSchemas,
} from './types';

async function resolveCanvasBaseUrl(
	ctx: Pick<CanvasKeyBuilderContext, 'options'> & {
		keys?: CanvasKeyBuilderContext['keys'];
	},
): Promise<string> {
	const fromOptions = ctx.options?.baseUrl?.trim();
	if (fromOptions) return fromOptions;

	const fromAccount = await ctx.keys?.get_base_url?.();
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
		const baseUrl = await resolveCanvasBaseUrl(ctx);

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
		await syncCanvasOperationCache(ctx, getCanvasRoute(name), input, parsed);
		// Avoid logging raw input (may include tokens / PII in body/query/pathParams).
		await logEventFromContext(
			ctx,
			eventPath,
			{ method: operation.method, path: operation.path },
			'completed',
		);
		return parsed;
	}) as CanvasEndpoints[K];
}
