import { z } from 'zod';
import type { WebflowOperation } from './operations';
import { webflowOperations } from './operations';

const QuerySchema = z.record(z.string(), z.unknown());

export const WebflowEndpointInputBaseSchema = z.object({
	site_id: z.string().min(1).optional(),
	collection_id: z.string().min(1).optional(),
	field_id: z.string().min(1).optional(),
	item_id: z.string().min(1).optional(),
	asset_id: z.string().min(1).optional(),
	asset_folder_id: z.string().min(1).optional(),
	page_id: z.string().min(1).optional(),
	component_id: z.string().min(1).optional(),
	order_id: z.string().min(1).optional(),
	webhook_id: z.string().min(1).optional(),
	// request bodies are operation-specific json; the webflow api validates
	// their shape, so they intentionally stay unknown at this layer
	body: z.unknown().optional(),
	query: QuerySchema.optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().url().optional(),
});

export type WebflowEndpointInput = z.infer<
	typeof WebflowEndpointInputBaseSchema
> & {
	[key: string]: unknown;
};

// responses are operation-specific json passed through to callers; they
// intentionally stay unknown here and callers narrow them as needed
export type WebflowEndpointOutput = unknown;

export type WebflowEndpointInputs = Record<string, WebflowEndpointInput>;

export type WebflowEndpointOutputs = Record<string, WebflowEndpointOutput>;

export const WebflowEndpointOutputSchema = z.unknown();

function inputSchemaForOperation(operation: WebflowOperation) {
	const requiredParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	return WebflowEndpointInputBaseSchema.extend(requiredParams);
}

// Object.fromEntries infers a value type union across all entries; assert
// to the homogeneous record the entries are built as (one zod schema per
// operation key from webflowOperations)
export const WebflowEndpointInputSchemas = Object.fromEntries(
	webflowOperations.map((operation) => [
		operation.key,
		inputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

// same rationale as WebflowEndpointInputSchemas above
export const WebflowEndpointOutputSchemas = Object.fromEntries(
	webflowOperations.map((operation) => [
		operation.key,
		WebflowEndpointOutputSchema,
	]),
) as Record<string, z.ZodTypeAny>;
