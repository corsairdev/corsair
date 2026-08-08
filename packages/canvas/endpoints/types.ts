import { z } from 'zod';
import type { CanvasOperation, CanvasOperationName } from './operations';
import { canvasOperations } from './operations';

export type CanvasRequestInput = {
	/** Path parameters as key-value pairs (e.g. { course_id: '123', assignment_id: '456' }) */
	pathParams?: Record<string, string>;
	/** Query string parameters */
	query?: Record<string, string | number | boolean | string[] | undefined>;
	/** Request body for POST/PUT/PATCH */
	body?: Record<string, unknown>;
};

export type CanvasResponse = unknown;

export type CanvasEndpointInputs = {
	[K in CanvasOperationName]: CanvasRequestInput;
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

function pathParamsSchemaFor(operation: CanvasOperation) {
	const names = pathParamNames(operation.path);
	if (names.length === 0) {
		return z.record(z.string(), z.string().min(1)).optional();
	}
	return z
		.object(
			Object.fromEntries(
				names.map((name) => [name, z.string().min(1)]),
			) as Record<string, z.ZodString>,
		)
		.passthrough();
}

function createRequestInputSchema(
	operation: CanvasOperation,
): z.ZodType<CanvasRequestInput> {
	const method: string = operation.method;
	const isMutation =
		method === 'POST' || method === 'PUT' || method === 'PATCH';
	const pathParams = pathParamsSchemaFor(operation);

	if (!isMutation) {
		return z.object({
			pathParams,
			query: querySchema.optional(),
			body: bodySchema.optional(),
		});
	}

	if (operation.bodyless === true) {
		return z.object({
			pathParams,
			query: querySchema.optional(),
			body: bodySchema.optional().default({}),
		});
	}

	// Body-required mutations reject omitted / empty payloads.
	return z.object({
		pathParams,
		query: querySchema.optional(),
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
) as { [K in CanvasOperationName]: z.ZodType<CanvasRequestInput> };

// Canvas returns JSON objects/arrays, empty/string bodies (CSV templates),
// or undefined for 204 DELETE-style responses.
const canvasResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
	z.string(),
	z.undefined(),
]);

export const CanvasEndpointOutputSchemas = Object.fromEntries(
	Object.keys(canvasOperations).map((name) => [name, canvasResponseSchema]),
) as { [K in CanvasOperationName]: typeof canvasResponseSchema };
