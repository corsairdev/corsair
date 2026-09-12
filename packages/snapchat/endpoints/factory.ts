import { logEventFromContext } from 'corsair/core';
import { executeSnapchatTool } from '../client';
import type { SnapchatEndpoints } from '../index';
import type { SnapchatOperationId, SnapchatOperationName } from '../operations';
import {
	SnapchatEndpointInputSchemas,
	SnapchatEndpointOutputSchemas,
} from './types';

function resolveComposioApiKey(options: { composioApiKey?: string }): string {
	const key = options.composioApiKey?.trim();

	if (!key) {
		throw new Error('[snapchat] composioApiKey is required');
	}

	return key;
}

export function createSnapchatEndpoint<K extends SnapchatOperationName>(
	name: K,
	toolSlug: SnapchatOperationId,
): SnapchatEndpoints[K] {
	return (async (ctx, rawInput) => {
		const input = SnapchatEndpointInputSchemas[name].parse(rawInput ?? {});
		const composioApiKey = resolveComposioApiKey(ctx.options ?? {});
		const output = await executeSnapchatTool(toolSlug, input, {
			composioApiKey,
			snapchatAccessToken: ctx.key,
			connectedAccountId: ctx.options?.connectedAccountId,
			userId: ctx.options?.userId,
			composioBaseUrl: ctx.options?.composioBaseUrl,
			timeoutMs: ctx.options?.timeoutMs,
			signal: ctx.options?.signal,
		});

		const parsed = SnapchatEndpointOutputSchemas[name].parse(output);

		await logEventFromContext(
			ctx,
			`snapchat.actions.${name}`,
			input,
			'completed',
		);
		return parsed;
	}) as SnapchatEndpoints[K];
}
