import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodTypeAny } from 'zod';
import type { BasecampAuthContext } from '../client';
import {
	BASECAMP_DEFAULT_USER_AGENT,
	BasecampSchemaError,
	compactObject,
	makeAuthenticatedBasecampRequest,
} from '../client';
import type { BasecampContext } from '../index';
import { basecampAuditPayload } from './logging';
import type { BasecampEndpointKey, BasecampOperation } from './operations';
import { basecampOperationByKey } from './operations';
import { evictBasecampResult, mirrorBasecampResult } from './persist';
import { resolveBasecampAccountId } from './shared';
import type { BasecampEndpointInputs, BasecampEndpointOutputs } from './types';
import {
	BasecampEndpointInputSchemas,
	BasecampEndpointOutputSchemas,
} from './types';

/**
 * Applies the registered schema, turning zod failures into a BasecampSchemaError
 * the plugin error handlers classify as VALIDATION_ERROR. Inputs are checked
 * before the request is built so malformed calls never reach Basecamp; outputs
 * are checked so callers get the types the endpoint advertises.
 */
function parseWithSchema<T>(
	schema: ZodTypeAny,
	value: unknown,
	direction: 'input' | 'output',
	path: string,
): T {
	const result = schema.safeParse(value);
	if (result.success) return result.data as T;
	const issues = result.error.issues.map((issue) => ({
		path: issue.path.join('.') || '(root)',
		message: issue.message,
	}));
	throw new BasecampSchemaError(
		'[BASECAMP] Invalid ' +
			direction +
			' for ' +
			path +
			': ' +
			issues.map((issue) => issue.path + ' — ' + issue.message).join('; '),
		direction,
		issues,
	);
}

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
		const definition = basecampOperationByKey[key];
		const input = parseWithSchema<Record<string, unknown>>(
			BasecampEndpointInputSchemas[key],
			typedInput,
			'input',
			definition.path,
		);
		const accountId = await resolveBasecampAccountId(ctx);
		const wire = buildBasecampWireRequest(definition, input, accountId);
		const raw = await makeAuthenticatedBasecampRequest<unknown>(
			wire.url,
			ctx as unknown as BasecampAuthContext,
			ctx.options.userAgent ?? BASECAMP_DEFAULT_USER_AGENT,
			wire,
		);
		const response = parseWithSchema<BasecampEndpointOutputs[K]>(
			BasecampEndpointOutputSchemas[key],
			raw,
			'output',
			definition.path,
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
