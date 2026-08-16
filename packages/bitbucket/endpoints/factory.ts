import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ZodType } from 'zod';
import type { BitbucketAuthContext } from '../client';
import {
	BitbucketSchemaError,
	makeAuthenticatedBitbucketRequest,
} from '../client';
import type { BitbucketContext } from '../index';
import { bitbucketAuditPayload } from './logging';
import type { BitbucketEndpointKey, BitbucketOperation } from './operations';
import { bitbucketOperationByKey } from './operations';
import type {
	BitbucketEndpointInputs,
	BitbucketEndpointOutputs,
} from './types';
import {
	BitbucketEndpointInputSchemas,
	BitbucketEndpointOutputSchemas,
} from './types';

function parseWithSchema<T>(
	schema: ZodType,
	value: unknown,
	direction: 'input' | 'output',
	endpointPath: string,
): T {
	const result = schema.safeParse(value);
	if (result.success) return result.data as T;
	const issues = result.error.issues.map((issue) => ({
		path: issue.path.join('.') || '(root)',
		message: issue.message,
	}));
	throw new BitbucketSchemaError(
		'[BITBUCKET] Invalid ' +
			direction +
			' for ' +
			endpointPath +
			': ' +
			issues.map((issue) => issue.path + ' — ' + issue.message).join('; '),
		direction,
		issues,
	);
}
function pathValue(value: unknown, name: string): string {
	if (typeof value !== 'string' && typeof value !== 'number')
		throw new Error('[BITBUCKET] Missing required path parameter: ' + name);
	return encodeURIComponent(String(value)).replaceAll('%2F', '/');
}
export function buildBitbucketWireRequest(
	definition: BitbucketOperation,
	input: Record<string, unknown>,
) {
	const values = { ...input, ...definition.fixedPathValues } as Record<
		string,
		unknown
	>;
	const url = definition.apiPath.replace(/\{([^}]+)\}/g, (_match, name) =>
		pathValue(values[name], name),
	);
	const query = Object.fromEntries(
		definition.queryFields
			.map((name) => [name, input[name]])
			.filter(([, value]) => value !== undefined),
	);
	if (definition.projectFilterField) {
		const projectKey = input[definition.projectFilterField];
		if (typeof projectKey !== 'string' || !projectKey)
			throw new Error('[BITBUCKET] Missing project key');
		const escaped = projectKey.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
		const projectQuery = 'project.key="' + escaped + '"';
		query.q =
			typeof query.q === 'string' && query.q
				? '(' + query.q + ') AND ' + projectQuery
				: projectQuery;
	}
	return {
		url,
		method: definition.httpMethod,
		query,
		body: definition.acceptsBody ? input.body : undefined,
		mediaType: definition.mediaType,
		retrySafe: definition.riskLevel === 'read',
	} as const;
}
export function createBitbucketEndpoint<K extends BitbucketEndpointKey>(
	key: K,
): CorsairEndpoint<
	BitbucketContext,
	BitbucketEndpointInputs[K],
	BitbucketEndpointOutputs[K]
> {
	return async (ctx, typedInput) => {
		const definition = bitbucketOperationByKey[key];
		const input = parseWithSchema<Record<string, unknown>>(
			BitbucketEndpointInputSchemas[key],
			typedInput,
			'input',
			definition.path,
		);
		const wire = buildBitbucketWireRequest(definition, input);
		const raw = await makeAuthenticatedBitbucketRequest<unknown>(
			wire.url,
			ctx as unknown as BitbucketAuthContext,
			wire,
		);
		const response = parseWithSchema<BitbucketEndpointOutputs[K]>(
			BitbucketEndpointOutputSchemas[key],
			raw,
			'output',
			definition.path,
		);
		await logEventFromContext(
			ctx,
			'bitbucket.' + definition.path,
			bitbucketAuditPayload(input),
			'completed',
		);
		return response;
	};
}
