import { z } from 'zod';
import type { NeonOperation } from './operations';
import { neonOperations } from './operations';

const QuerySchema = z.record(z.string(), z.unknown());

export const NeonEndpointInputBaseSchema = z.object({
	project_id: z.string().min(1).optional(),
	branch_id: z.string().min(1).optional(),
	database_name: z.string().min(1).optional(),
	role_name: z.string().min(1).optional(),
	endpoint_id: z.string().min(1).optional(),
	operation_id: z.string().min(1).optional(),
	permission_id: z.string().min(1).optional(),
	request_id: z.string().min(1).optional(),
	jwks_id: z.string().min(1).optional(),
	key_id: z.string().min(1).optional(),
	org_id: z.string().min(1).optional(),
	member_id: z.string().min(1).optional(),
	oauth_provider_id: z.string().min(1).optional(),
	auth_user_id: z.string().min(1).optional(),
	source_org_id: z.string().min(1).optional(),
	region_id: z.string().min(1).optional(),
	vpc_endpoint_id: z.string().min(1).optional(),
	snapshot_id: z.string().min(1).optional(),
	// request bodies are operation-specific json; the neon api validates
	// their shape, so they intentionally stay unknown at this layer
	body: z.unknown().optional(),
	query: QuerySchema.optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().url().optional(),
});

export type NeonEndpointInput = z.infer<typeof NeonEndpointInputBaseSchema> & {
	[key: string]: unknown;
};

// responses are operation-specific json passed through to callers; they
// intentionally stay unknown here and callers narrow them as needed
export type NeonEndpointOutput = unknown;

export type NeonEndpointInputs = Record<string, NeonEndpointInput>;

export type NeonEndpointOutputs = Record<string, NeonEndpointOutput>;

export const NeonEndpointOutputSchema = z.unknown();

function inputSchemaForOperation(operation: NeonOperation) {
	const requiredParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	return NeonEndpointInputBaseSchema.extend(requiredParams);
}

// Object.fromEntries infers a value type union across all entries; assert
// to the homogeneous record the entries are built as (one zod schema per
// operation key from neonOperations)
export const NeonEndpointInputSchemas = Object.fromEntries(
	neonOperations.map((operation) => [
		operation.key,
		inputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

// same rationale as NeonEndpointInputSchemas above
export const NeonEndpointOutputSchemas = Object.fromEntries(
	neonOperations.map((operation) => [operation.key, NeonEndpointOutputSchema]),
) as Record<string, z.ZodTypeAny>;
