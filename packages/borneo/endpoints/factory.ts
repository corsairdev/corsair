import { logEventFromContext } from 'corsair/core';
import { executeBorneoTool } from '../client';
import type { BorneoEndpoints } from '../index';
import type { BorneoOperationId, BorneoOperationName } from '../operations';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './types';

function resolveComposioApiKey(options: { composioApiKey?: string }): string {
	const key = options.composioApiKey?.trim();

	if (!key) {
		throw new Error(
			'[borneo] composioApiKey is required separately from the Borneo provider credential',
		);
	}

	return key;
}

export function createBorneoEndpoint<K extends BorneoOperationName>(
	name: K,
	toolSlug: BorneoOperationId,
	eventPath: string,
): BorneoEndpoints[K] {
	return (async (ctx, rawInput) => {
		const input = BorneoEndpointInputSchemas[name].parse(
			rawInput ?? {},
		) as Record<string, unknown>;

		// Composio's project key and the provider credential are two
		// completely different credentials. Never fall back between them.
		const composioApiKey = resolveComposioApiKey(ctx.options ?? {});

		const providerCredential =
			ctx.options?.borneoCredential?.trim() ||
			(ctx as unknown as { key?: string }).key?.trim();

		const response = await executeBorneoTool<unknown>(toolSlug, input, {
			composioApiKey,
			connectedAccountId: ctx.options?.connectedAccountId,
			userId: ctx.options?.userId,
			composioBaseUrl: ctx.options?.composioBaseUrl,
			borneoCredential: providerCredential,
			borneoBaseUrl: ctx.options?.baseUrl,
			credentialHeaderName: ctx.options?.credentialHeaderName,
			credentialPrefix: ctx.options?.credentialPrefix,
		});

		const parsed = BorneoEndpointOutputSchemas[name].parse(response);

		await logEventFromContext(
			ctx,
			eventPath,
			{ provider: 'composio', tool: toolSlug },
			'completed',
		);

		return parsed;
	}) as BorneoEndpoints[K];
}
