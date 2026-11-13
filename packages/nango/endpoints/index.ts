import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { NangoContext } from '..';
import { NangoError, nangoRequest } from '../client';
import {
	EndpointInputSchemas as input,
	EndpointOutputSchemas as output,
} from './types';

function operation<I extends z.ZodType, O extends z.ZodType>(
	inputSchema: I,
	outputSchema: O,
	request: (ctx: NangoContext, args: z.output<I>) => Promise<unknown>,
): CorsairEndpoint<NangoContext, z.input<I>, z.output<O>> {
	return async (ctx, raw) => {
		const args = inputSchema.parse(raw);
		const result = outputSchema.safeParse(await request(ctx, args));
		if (!result.success)
			throw new NangoError('Nango returned an invalid response');
		return result.data;
	};
}

export const endpoints = {
	connections: {
		import: operation(
			input['connections.import'],
			output['connections.import'],
			(ctx, args) => nangoRequest(ctx.key, 'POST', '/connections', {}, args),
		),
		list: operation(
			input['connections.list'],
			output['connections.list'],
			(ctx, args) => {
				const { tags, ...query } = args;
				const tagQuery = Object.fromEntries(
					Object.entries(tags ?? {}).map(([key, value]) => [
						`tags[${key}]`,
						value,
					]),
				);
				return nangoRequest(ctx.key, 'GET', '/connections', {
					...query,
					...tagQuery,
				});
			},
		),
		get: operation(
			input['connections.get'],
			output['connections.get'],
			(ctx, args) => {
				const { connectionId, ...query } = args;
				return nangoRequest(
					ctx.key,
					'GET',
					`/connections/${encodeURIComponent(connectionId)}`,
					query,
				);
			},
		),
		patch: operation(
			input['connections.patch'],
			output['connections.patch'],
			(ctx, args) =>
				nangoRequest(
					ctx.key,
					'PATCH',
					`/connections/${encodeURIComponent(args.connectionId)}`,
					{ provider_config_key: args.provider_config_key },
					args.body,
				),
		),
		setMetadata: operation(
			input['connections.setMetadata'],
			output['connections.setMetadata'],
			(ctx, args) =>
				nangoRequest(ctx.key, 'POST', '/connections/metadata', {}, args),
		),
		updateMetadata: operation(
			input['connections.updateMetadata'],
			output['connections.updateMetadata'],
			(ctx, args) =>
				nangoRequest(ctx.key, 'PATCH', '/connections/metadata', {}, args),
		),
		delete: operation(
			input['connections.delete'],
			output['connections.delete'],
			(ctx, args) =>
				nangoRequest(
					ctx.key,
					'DELETE',
					`/connections/${encodeURIComponent(args.connectionId)}`,
					{ provider_config_key: args.provider_config_key },
				),
		),
	},
	sessions: {
		create: operation(
			input['sessions.create'],
			output['sessions.create'],
			(ctx, args) =>
				nangoRequest(ctx.key, 'POST', '/connect/sessions', {}, args),
		),
		reconnect: operation(
			input['sessions.reconnect'],
			output['sessions.reconnect'],
			(ctx, args) =>
				nangoRequest(ctx.key, 'POST', '/connect/sessions/reconnect', {}, args),
		),
		get: operation(
			input['sessions.get'],
			output['sessions.get'],
			(_ctx, args) =>
				nangoRequest(args.session_token, 'GET', '/connect/session'),
		),
		delete: operation(
			input['sessions.delete'],
			output['sessions.delete'],
			(_ctx, args) =>
				nangoRequest(args.session_token, 'DELETE', '/connect/session'),
		),
	},
} as const;
