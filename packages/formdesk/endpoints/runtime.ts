import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { FormdeskEndpoint } from '..';
import type { FormdeskRequestOptions } from '../client';
import { FORMDESK_API_HOST, makeFormdeskRequest } from '../client';
import type {
	FormdeskEndpointInputs,
	FormdeskEndpointOutputs,
	FormdeskJson,
} from './types';

export type FormdeskRequestPlan = Omit<FormdeskRequestOptions, 'apiKey'> & {
	host: string;
	public?: boolean;
};

export function defineOperation<K extends keyof FormdeskEndpointInputs>(
	name: K,
	inputSchema: z.ZodType<FormdeskEndpointInputs[K]>,
	outputSchema: z.ZodType<FormdeskEndpointOutputs[K]>,
	plan: (input: FormdeskEndpointInputs[K]) => FormdeskRequestPlan,
): FormdeskEndpoint<K> {
	return async (ctx, input) => {
		const parsedInput = inputSchema.parse(input);
		const requestPlan = plan(parsedInput);
		const { host, public: publicRequest, ...requestOptions } = requestPlan;
		const response = await makeFormdeskRequest(host, {
			...requestOptions,
			apiKey: publicRequest ? undefined : ctx.key,
		});
		const parsedOutput = outputSchema.parse(response.payload);
		await logEventFromContext(
			ctx,
			`formdesk.${name}`,
			{ creditsRemaining: response.creditsRemaining },
			'completed',
		);
		return parsedOutput;
	};
}

export function tenantPlan(
	input: { host: string; domain: string },
	method: FormdeskRequestOptions['method'],
	path: string,
	options: Partial<
		Omit<FormdeskRequestOptions, 'host' | 'method' | 'path'>
	> = {},
): FormdeskRequestPlan {
	return {
		host: input.host,
		domain: input.domain,
		method,
		path,
		retryable: method === 'GET',
		...options,
	};
}

/**
 * Builds a JSON request body from a flat input object. TypeScript callers can
 * pass an optional field as `undefined`; JSON has no such value, so the field is
 * left out rather than failing JSON validation.
 */
export function jsonBody(value: Record<string, unknown>): FormdeskJson {
	// `unknown` because the callers' field schemas already validated each value;
	// z.json() below re-checks that what remains is plain JSON.
	return z
		.json()
		.parse(
			Object.fromEntries(
				Object.entries(value).filter(([, entry]) => entry !== undefined),
			),
		);
}

export function encodePathSegment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export function connectHost(): string {
	return FORMDESK_API_HOST;
}
