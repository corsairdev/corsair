import { z } from 'zod';
import type { BrexRoute, BrexRouteKey } from './routes';
import { BREX_ROUTES } from './routes';

const OptionalScalar = z
	.union([z.string(), z.number(), z.boolean()])
	.optional();

function fieldSchema(key: string, route: BrexRoute) {
	if (key === 'values' || key === 'event_types' || key === 'webhook_ids') {
		return z.array(z.unknown());
	}
	if (key === 'owner' || key === 'authorization_settings') {
		return z.record(z.string(), z.unknown());
	}
	if (key === 'monthly_limit') return z.number().nullable();
	if (key === 'min_amount' || key === 'max_amount' || key === 'limit') {
		return z.number();
	}
	if (key === 'action') {
		return z.enum([
			'lock',
			'unlock',
			'terminate',
			'LOCK',
			'UNLOCK',
			'TERMINATE',
		]);
	}
	if (route.required.includes(key) || route.pathParams.includes(key)) {
		return z.string();
	}
	return OptionalScalar;
}

function inputSchema(route: BrexRoute) {
	const keys = new Set<string>([
		...route.pathParams,
		...route.queryParams,
		...route.required,
	]);
	if (route.filter === 'transactionAmount') {
		keys.add('posted_at_start');
		keys.add('posted_at_end');
	}
	if (route.filter === 'transactionDescription') {
		keys.add('posted_at_start');
		keys.add('posted_at_end');
	}
	if (route.filter === 'cardStatus') {
		keys.add('lock_reason');
		keys.add('reason');
		keys.add('description');
	}
	if (route.op === 'setLimit') keys.add('monthly_limit');
	if (route.idempotency) keys.add('idempotency_key');
	keys.add('body');
	keys.add('query');
	const shape: Record<string, z.ZodTypeAny> = {};
	for (const key of keys) {
		if (key === 'body') {
			shape.body = z.record(z.string(), z.unknown()).optional();
			continue;
		}
		if (key === 'query') {
			shape.query = z.record(z.string(), OptionalScalar).optional();
			continue;
		}
		const schema = fieldSchema(key, route);
		shape[key] =
			route.required.includes(key) || route.pathParams.includes(key)
				? schema
				: schema.optional();
	}
	return z.object(shape).passthrough();
}

export const BrexResponseSchema = z.object({}).passthrough();

export const BrexEndpointInputSchemas = Object.fromEntries(
	Object.entries(BREX_ROUTES).map(([key, route]) => [key, inputSchema(route)]),
) as unknown as { [K in BrexRouteKey]: z.ZodType };

export const BrexEndpointOutputSchemas = Object.fromEntries(
	Object.keys(BREX_ROUTES).map((key) => [key, BrexResponseSchema]),
) as unknown as { [K in BrexRouteKey]: typeof BrexResponseSchema };

export type BrexEndpointInputs = {
	[K in BrexRouteKey]: z.infer<(typeof BrexEndpointInputSchemas)[K]>;
};

export type BrexEndpointOutputs = {
	[K in BrexRouteKey]: z.infer<(typeof BrexEndpointOutputSchemas)[K]>;
};

export type BrexEndpointInput = Record<string, unknown>;
