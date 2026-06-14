import { z } from 'zod';
import type { SupabaseOperation } from './operations';
import { supabaseOperations } from './operations';

const QuerySchema = z.record(z.string(), z.unknown());

export const SupabaseEndpointInputBaseSchema = z.object({
	ref: z.string().min(1).optional(),
	id: z.string().min(1).optional(),
	slug: z.string().min(1).optional(),
	name: z.string().min(1).optional(),
	version: z.string().min(1).optional(),
	runId: z.string().min(1).optional(),
	tpaId: z.string().min(1).optional(),
	providerId: z.string().min(1).optional(),
	branchId: z.string().min(1).optional(),
	functionSlug: z.string().min(1).optional(),
	uploadId: z.string().min(1).optional(),
	schema: z.string().min(1).optional(),
	table: z.string().min(1).optional(),
	columns: z.array(z.string().min(1)).optional(),
	limit: z.number().int().positive().max(1000).optional(),
	offset: z.number().int().nonnegative().optional(),
	body: z.unknown().optional(),
	query: QuerySchema.optional(),
	headers: z.record(z.string(), z.string()).optional(),
	mediaType: z.string().optional(),
	baseUrl: z.string().url().optional(),
});

export type SupabaseEndpointInput = z.infer<
	typeof SupabaseEndpointInputBaseSchema
> & { [key: string]: unknown };

export type SupabaseEndpointOutput = unknown;

export type SupabaseEndpointInputs = Record<string, SupabaseEndpointInput>;

export type SupabaseEndpointOutputs = Record<string, SupabaseEndpointOutput>;

export const SupabaseEndpointOutputSchema = z.unknown();

function inputSchemaForOperation(operation: SupabaseOperation) {
	const requiredParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	return SupabaseEndpointInputBaseSchema.extend(requiredParams);
}

export const SupabaseEndpointInputSchemas = Object.fromEntries(
	supabaseOperations.map((operation) => [
		operation.key,
		inputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

export const SupabaseEndpointOutputSchemas = Object.fromEntries(
	supabaseOperations.map((operation) => [
		operation.key,
		SupabaseEndpointOutputSchema,
	]),
) as Record<string, z.ZodTypeAny>;
