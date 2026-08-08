import { z } from 'zod';
import type { CanvasOperation, CanvasOperationName } from './operations';
import { canvasOperations } from './operations';

type ExtractPathParams<Path extends string> =
	Path extends `${string}{${infer Param}}${infer Rest}`
		? Param | ExtractPathParams<Rest>
		: never;

type HasPathParams<Path extends string> = [ExtractPathParams<Path>] extends [
	never,
]
	? false
	: true;

type PathParamsFor<Path extends string> = HasPathParams<Path> extends true
	? { [K in ExtractPathParams<Path>]: string }
	: Record<string, string>;

type CanvasRequestFields = {
	/** Query string parameters */
	query?: Record<string, string | number | boolean | string[] | undefined>;
	/** Request body for POST/PUT/PATCH */
	body?: Record<string, unknown>;
};

/** Shared request shape used by the factory; pathParams required when the path has placeholders. */
export type CanvasRequestInput = CanvasRequestFields & {
	pathParams?: Record<string, string>;
};

export type CanvasResponse = unknown;

export type CanvasEndpointInputs = {
	[K in CanvasOperationName]: CanvasRequestFields &
		(HasPathParams<(typeof canvasOperations)[K]['path']> extends true
			? { pathParams: PathParamsFor<(typeof canvasOperations)[K]['path']> }
			: { pathParams?: Record<string, string> });
};

export type CanvasEndpointOutputs = {
	[K in CanvasOperationName]: CanvasResponse;
};

const queryValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
]);

const querySchema = z.record(z.string(), queryValueSchema.optional());
const bodySchema = z.record(z.string(), z.unknown());

function pathParamNames(path: string): string[] {
	return [...path.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}

function createRequestInputSchema(operation: CanvasOperation): z.ZodTypeAny {
	const method: string = operation.method;
	const isMutation =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const names = pathParamNames(operation.path);

	// Neon-style: each `{placeholder}` becomes a required non-empty string.
	const requiredPathParams = Object.fromEntries(
		names.map((name) => [name, z.string().min(1)]),
	) as Record<string, z.ZodString>;

	const pathParamsSchema =
		names.length === 0
			? z.record(z.string(), z.string().min(1)).optional()
			: z.object(requiredPathParams).passthrough();

	const base = {
		pathParams: pathParamsSchema,
		query: querySchema.optional(),
	};

	if (!isMutation) {
		return z.object({
			...base,
			body: bodySchema.optional(),
		});
	}

	if (operation.bodyless === true) {
		return z.object({
			...base,
			body: bodySchema.optional().default({}),
		});
	}

	return z.object({
		...base,
		body: bodySchema.refine(
			(value) => Object.keys(value).length > 0,
			'Request body is required for this Canvas mutation',
		),
	});
}

export const CanvasEndpointInputSchemas = Object.fromEntries(
	Object.entries(canvasOperations).map(([name, operation]) => [
		name,
		createRequestInputSchema(operation),
	]),
) as { [K in CanvasOperationName]: z.ZodTypeAny };

// Canvas REST resources usually carry an id; keep unknown fields via passthrough.
// Full per-field OpenAPI mapping is out of scope for the registry (same as neon /
// digitalocean / activetrail — Zod on every endpoint, shapes stay loose).
const canvasResourceSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();

const canvasListSchema = z.array(
	z.union([canvasResourceSchema, z.record(z.string(), z.unknown())]),
);

const canvasGraphqlSchema = z
	.object({
		data: z.unknown().optional(),
		errors: z.array(z.unknown()).optional(),
	})
	.passthrough();

function createResponseSchema(operation: CanvasOperation): z.ZodTypeAny {
	if (operation.path === '/api/graphql') {
		return canvasGraphqlSchema;
	}
	if (operation.method === 'DELETE') {
		return z.union([
			canvasResourceSchema,
			canvasListSchema,
			z.undefined(),
			z.null(),
		]);
	}
	// CSV / text templates only — do not accept bare strings for general REST ops.
	if (operation.path.includes('/upload')) {
		return z.union([z.string(), canvasResourceSchema, z.undefined()]);
	}
	return z.union([canvasResourceSchema, canvasListSchema]);
}

export const CanvasEndpointOutputSchemas = Object.fromEntries(
	Object.entries(canvasOperations).map(([name, operation]) => [
		name,
		createResponseSchema(operation),
	]),
) as { [K in CanvasOperationName]: z.ZodTypeAny };
