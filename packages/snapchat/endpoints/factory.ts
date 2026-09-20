import { logEventFromContext } from 'corsair/core';
import { makeSnapchatRequest, requireString } from '../client';
import type { SnapchatEndpoints } from '../index';
import type { SnapchatOperationName } from '../operations';
import {
	SnapchatEndpointInputSchemas,
	SnapchatEndpointOutputSchemas,
} from './types';

export type SnapchatEndpointFactory<K extends SnapchatOperationName> =
	SnapchatEndpoints[K];

// Generic endpoint builder: resolves path and options from per-operation config
export type EndpointConfig = {
	path: (input: Record<string, unknown>) => string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	body?: (
		input: Record<string, unknown>,
	) => Record<string, unknown> | undefined;
	query?: (
		input: Record<string, unknown>,
	) => Record<string, string | number | boolean | undefined> | undefined;
	base?: string;
	multipart?: boolean;
};

export function createEndpoint<K extends SnapchatOperationName>(
	name: K,
	config: EndpointConfig,
): SnapchatEndpoints[K] {
	return (async (ctx, rawInput) => {
		const input = SnapchatEndpointInputSchemas[name].parse(
			rawInput ?? {},
		) as Record<string, unknown>;

		const accessToken = requireString(ctx.key, 'access_token');

		const path = config.path(input);
		const method = config.method ?? 'GET';
		const body = config.body
			? config.body(input)
			: (input as Record<string, unknown>);
		const query = config.query ? config.query(input) : undefined;

		const response = await makeSnapchatRequest(path, accessToken, {
			base: config.base,
			method,
			body,
			query,
			multipart: config.multipart,
		});

		const parsed = SnapchatEndpointOutputSchemas[name].parse(response);

		await logEventFromContext(
			ctx,
			`snapchat.actions.${name}`,
			input,
			'completed',
		);

		return parsed;
	}) as SnapchatEndpoints[K];
}
