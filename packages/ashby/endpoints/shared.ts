import { AuthMissingError } from 'corsair/core';
import { makeAshbyRequest } from '../client';
import type { AshbyContext } from '../index';
import { AshbyEndpointInputSchemas, AshbyEndpointOutputSchemas } from './types';

const ENDPOINT_KEY_MAP: Record<string, keyof typeof AshbyEndpointInputSchemas> =
	{
		'interviewSchedule.info': 'interview.scheduleInfo',
		'interviewSchedule.list': 'interview.scheduleList',
		'interviewStage.list': 'interview.stageList',
	};

/**
 * Resolves the API key from plugin options or context keys.
 */
export async function getAshbyApiKey(ctx: AshbyContext): Promise<string> {
	if (ctx.options.key) {
		return ctx.options.key;
	}

	const key = await ctx.keys.get_api_key();
	if (!key) {
		throw new AuthMissingError('ashby', 'api_key');
	}
	return key;
}

/**
 * Dispatches an Ashby RPC request with key resolution and schema validation.
 */
export async function ashbyCall<T>(
	ctx: AshbyContext,
	endpoint: string,
	body: Record<string, unknown> = {},
): Promise<T> {
	const apiKey = await getAshbyApiKey(ctx);
	const schemaKey =
		ENDPOINT_KEY_MAP[endpoint] ??
		(endpoint as keyof typeof AshbyEndpointInputSchemas);

	const inputSchema = AshbyEndpointInputSchemas[schemaKey];
	const outputSchema = AshbyEndpointOutputSchemas[schemaKey];

	const parsedInput = inputSchema
		? (inputSchema.parse(body) as Record<string, unknown>)
		: body;

	const raw = await makeAshbyRequest<unknown>(endpoint, apiKey, {
		body: parsedInput,
	});

	const parsedOutput = outputSchema ? outputSchema.parse(raw) : raw;
	return parsedOutput as T;
}
