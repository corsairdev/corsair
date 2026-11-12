import { makeSvixRequest } from '../client';
import type { SvixContext } from '../index';
import type {
	SvixEndpointInputs,
	SvixEndpointOutputs,
	SvixOperationName,
} from './types';
import {
	SvixEndpointInputSchemas,
	SvixEndpointOutputSchemas,
	svixRoutes,
} from './types';

export function endpoint<K extends SvixOperationName>(name: K) {
	return async (
		ctx: SvixContext,
		input: SvixEndpointInputs[K],
	): Promise<SvixEndpointOutputs[K]> => {
		// Each operation has different parsed path, query, and body fields; the dynamic
		// route registry requires a common unknown-valued map rather than one fixed shape.
		const data: Record<string, unknown> = {
			...SvixEndpointInputSchemas[name].parse(input),
		};
		const route: {
			method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
			path: string;
			query: readonly string[];
			hasBody: boolean;
		} = svixRoutes[name];
		const path = route.path.replace(/\{(\w+)\}/g, (_match, key: string) => {
			const value = data[key];
			delete data[key];
			if (typeof value !== 'string')
				throw new Error(`Missing path parameter ${key}`);
			return encodeURIComponent(value);
		});
		// Query value types differ by operation and have already been schema-validated.
		const query: Record<string, unknown> = {};
		for (const key of route.query) {
			if (data[key] !== undefined && data[key] !== null) query[key] = data[key];
		}
		const result = await makeSvixRequest(
			ctx.options?.region ?? 'eu',
			path,
			ctx.key,
			{
				method: route.method,
				query: Object.keys(query).length ? query : undefined,
				body: route.hasBody ? data.body : undefined,
				idempotencyKey:
					typeof data.idempotencyKey === 'string'
						? data.idempotencyKey
						: undefined,
			},
		);
		return SvixEndpointOutputSchemas[name].parse(
			result,
		) as SvixEndpointOutputs[K];
	};
}
