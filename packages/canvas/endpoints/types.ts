import { z } from 'zod';
import type { CanvasOperationName } from './operations';
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
const pathParamsSchema = z.record(z.string(), z.string());

function createRequestInputSchema(
	operation: (typeof canvasOperations)[CanvasOperationName],
): z.ZodType<CanvasRequestInput> {
	const method: string = operation.method;
	const needsBody = method === 'POST' || method === 'PUT' || method === 'PATCH';

	if (needsBody) {
		// Optional: Canvas has many bodyless POST/PUT actions (e.g. favorites).
		// Default {} so callers can omit body without failing Zod.
		return z.object({
			pathParams: pathParamsSchema.optional(),
			query: querySchema.optional(),
			body: bodySchema.optional().default({}),
		});
	}

	return z.object({
		pathParams: pathParamsSchema.optional(),
		query: querySchema.optional(),
		body: bodySchema.optional(),
	});
}

export const CanvasEndpointInputSchemas = Object.fromEntries(
	Object.entries(canvasOperations).map(([name, operation]) => [
		name,
		createRequestInputSchema(operation),
	]),
) as { [K in CanvasOperationName]: z.ZodType<CanvasRequestInput> };

// Canvas returns either a JSON object or a JSON array depending on the
// endpoint (and sometimes the same op can return either). Accept both so
// list responses are not rejected by an object-only schema.
const canvasResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
]);

export const CanvasEndpointOutputSchemas = Object.fromEntries(
	Object.keys(canvasOperations).map((name) => [name, canvasResponseSchema]),
) as { [K in CanvasOperationName]: typeof canvasResponseSchema };
