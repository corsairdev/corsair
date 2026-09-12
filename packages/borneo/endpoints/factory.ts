import { logEventFromContext } from 'corsair/core';
import { executeBorneoTool } from '../client';
import type { BorneoEndpoints } from '../index';
import { BORNEO_TOOL_RISK } from '../operation-risk';
import type { BorneoOperationId, BorneoOperationName } from '../operations';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './types';

/**
 * Resolves the Composio project API key independently from the provider
 * credential.
 */
function resolveComposioApiKey(options: { composioApiKey?: string }): string {
	const key = options.composioApiKey?.trim();

	if (!key) {
		throw new Error(
			'[borneo] composioApiKey is required separately from the Borneo provider credential',
		);
	}

	return key;
}

/**
 * Creates a schema-validating Corsair endpoint for one canonical Borneo
 * operation and forwards its safety classification to the transport.
 */
export function createBorneoEndpoint<K extends BorneoOperationName>(
	name: K,
	toolSlug: BorneoOperationId,
	eventPath: string,
): BorneoEndpoints[K] {
	return (async (ctx, rawInput) => {
		const input = BorneoEndpointInputSchemas[name].parse(rawInput ?? {});

		const composioApiKey = resolveComposioApiKey(ctx.options ?? {});

		const providerCredential =
			ctx.options?.borneoCredential?.trim() || ctx.key?.trim();

		let status: 'completed' | 'failed' = 'failed';

		try {
			const response = await executeBorneoTool(toolSlug, input, {
				composioApiKey,
				connectedAccountId: ctx.options?.connectedAccountId,
				userId: ctx.options?.userId,
				composioBaseUrl: ctx.options?.composioBaseUrl,
				borneoCredential: providerCredential,
				borneoBaseUrl: ctx.options?.baseUrl,
				credentialHeaderName: ctx.options?.credentialHeaderName,
				credentialPrefix: ctx.options?.credentialPrefix,
				riskLevel: BORNEO_TOOL_RISK[toolSlug],
				timeoutMs: ctx.options?.timeoutMs,
				signal: ctx.options?.signal,
			});

			const output = BorneoEndpointOutputSchemas[name].parse(response);
			status = 'completed';
			return output;
		} finally {
			await logEventFromContext(
				ctx,
				eventPath,
				{ provider: 'composio', tool: toolSlug },
				status,
			);
		}
	}) as BorneoEndpoints[K];
}
