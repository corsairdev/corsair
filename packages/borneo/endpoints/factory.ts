import { logEventFromContext } from 'corsair/core';
import { executeBorneoTool } from '../client';
import type { BorneoEndpoints, BorneoKeyBuilderContext } from '../index';
import type { BorneoOperationId, BorneoOperationName } from '../operations';
import {
	BorneoEndpointInputSchemas,
	BorneoEndpointOutputSchemas,
} from './types';

async function resolveComposioApiKey(
	ctx: BorneoKeyBuilderContext & { key?: string },
): Promise<string> {
	const fromOptions = ctx.options?.composioApiKey?.trim();
	if (fromOptions) return fromOptions;

	const fromKey = ctx.key?.trim();
	if (fromKey) return fromKey;

	throw new Error(
		'[borneo] composioApiKey is required to execute the complete Borneo tool surface',
	);
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

		const composioApiKey = await resolveComposioApiKey(
			ctx as unknown as BorneoKeyBuilderContext & { key?: string },
		);

		const response = await executeBorneoTool<unknown>(toolSlug, input, {
			composioApiKey,
			connectedAccountId: ctx.options?.connectedAccountId,
			userId: ctx.options?.userId,
			composioBaseUrl: ctx.options?.composioBaseUrl,
			borneoCredential: ctx.options?.borneoCredential,
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
