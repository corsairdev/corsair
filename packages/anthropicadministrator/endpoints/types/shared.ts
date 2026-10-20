import { z } from 'zod';

export const OrganizationRoleSchema = z.enum([
	'admin',
	'billing',
	'claude_code_user',
	'developer',
	'managed',
	'membership_admin',
	'owner',
	'primary_owner',
	'user',
]);

export const AssignableOrganizationRoleSchema = z.enum([
	'billing',
	'claude_code_user',
	'developer',
	'user',
	'admin',
]);

export const WorkspaceRoleSchema = z.enum([
	'workspace_admin',
	'workspace_billing',
	'workspace_developer',
	'workspace_restricted_developer',
	'workspace_user',
]);

export const paginationFields = {
	after_id: z
		.string()
		.optional()
		.describe('Cursor: return the page immediately after this object ID'),
	before_id: z
		.string()
		.optional()
		.describe('Cursor: return the page immediately before this object ID'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Items per page (1-1000, default 20)'),
};

export function listResponse<T extends z.ZodTypeAny>(item: T) {
	return z
		.object({
			data: z.array(item),
			first_id: z.string().nullable(),
			has_more: z.boolean(),
			last_id: z.string().nullable(),
		})
		.loose();
}

export const InferenceGeoSchema = z.enum(['global', 'us']);

export const AllowedInferenceGeosSchema = z.union([
	z.array(InferenceGeoSchema),
	z.literal('unrestricted'),
]);

/** Workspace data residency as returned by the Admin API. */
export const DataResidencySchema = z.object({
	allowed_inference_geos: AllowedInferenceGeosSchema,
	default_inference_geo: InferenceGeoSchema,
	workspace_geo: z.literal('us'),
});

/** Data residency on create; every field defaults server-side when omitted. */
export const DataResidencyCreateSchema = z.object({
	allowed_inference_geos: AllowedInferenceGeosSchema.nullable().optional(),
	default_inference_geo: InferenceGeoSchema.nullable().optional(),
	workspace_geo: z.literal('us').nullable().optional(),
});

/** Data residency on update; `workspace_geo` is immutable after creation. */
export const DataResidencyUpdateSchema = z.object({
	allowed_inference_geos: AllowedInferenceGeosSchema.nullable().optional(),
	default_inference_geo: InferenceGeoSchema.nullable().optional(),
});
