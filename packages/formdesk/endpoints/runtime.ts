import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FormdeskEndpoint } from '..';
import type { FormdeskRequestOptions } from '../client';
import { FORMDESK_API_HOST, makeFormdeskRequest } from '../client';
import type { FormdeskEndpointInputs, FormdeskEndpointOutputs } from './types';

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

export function encodePathSegment(value: string | number): string {
	return encodeURIComponent(String(value));
}

export function connectHost(): string {
	return FORMDESK_API_HOST;
}
