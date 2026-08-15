import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import {
	BASECAMP_DEFAULT_USER_AGENT,
	compactObject,
	makeBasecampRequest,
} from '../client';
import type { BasecampContext } from '../index';
import { basecampAuditPayload } from './logging';
import type { BasecampEndpointKey, BasecampOperation } from './operations';
import { basecampOperationByKey } from './operations';
import { evictBasecampResult, mirrorBasecampResult } from './persist';
import { resolveBasecampAccountId } from './shared';
import type { BasecampEndpointInputs, BasecampEndpointOutputs } from './types';

function pathValue(value: unknown, name: string): string {
	if (typeof value !== 'string' && typeof value !== 'number') {
		throw new Error('[BASECAMP] Missing required path parameter: ' + name);
	}
	return encodeURIComponent(String(value));
}

export function buildBasecampWireRequest(
	definition: BasecampOperation,
	input: Record<string, unknown>,
	accountId: string,
) {
	const values: Record<string, unknown> = { ...input, accountId };
	const url = definition.apiPath.replace(/\{([^}]+)\}/g, (_match, name) =>
		pathValue(values[name], name),
	);
	const query = Object.fromEntries(
		definition.queryFields
			.map((name) => [name, input[name]])
			.filter(([, value]) => value !== undefined),
	) as Record<string, string | number | boolean | undefined>;

	let body: Record<string, unknown> | Blob | undefined;
	if (definition.binaryField) {
		const encoded = input[definition.binaryField];
		if (typeof encoded !== 'string') {
			throw new Error('[BASECAMP] Missing base64 attachment content');
		}
		body = new Blob([Uint8Array.from(Buffer.from(encoded, 'base64'))], {
			type: 'application/octet-stream',
		});
	} else if (definition.bodyFields.length > 0) {
		body = compactObject(
			Object.fromEntries(
				definition.bodyFields.map((name) => [name, input[name]]),
			),
		);
		if (
			definition.providerOperationId === 'PostChatbotLine' &&
			typeof input.content_param === 'string' &&
			input.content_param
		) {
			body = { [input.content_param]: input.content };
		}
	}

	return {
		url,
		method: definition.httpMethod,
		query,
		body,
		mediaType: definition.mediaType,
		retrySafe: definition.riskLevel === 'read',
		authenticated: !definition.chatbotAuth,
	} as const;
}

export function createBasecampEndpoint<K extends BasecampEndpointKey>(
	key: K,
): CorsairEndpoint<
	BasecampContext,
	BasecampEndpointInputs[K],
	BasecampEndpointOutputs[K]
> {
	return async (ctx, typedInput) => {
		const input = typedInput as Record<string, unknown>;
		const definition = basecampOperationByKey[key];
		const accountId = await resolveBasecampAccountId(ctx);
		const wire = buildBasecampWireRequest(definition, input, accountId);
		const response = await makeBasecampRequest<BasecampEndpointOutputs[K]>(
			wire.url,
			ctx.key,
			ctx.options.userAgent ?? BASECAMP_DEFAULT_USER_AGENT,
			wire,
		);
		await mirrorBasecampResult(
			ctx.db,
			definition.providerOperationId,
			response,
		);
		await evictBasecampResult(ctx.db, definition.providerOperationId, input);
		await logEventFromContext(
			ctx,
			'basecamp.' + definition.path,
			basecampAuditPayload(input),
			'completed',
		);
		return response;
	};
}
