import { z } from 'zod';

export const CurrencySchema = z.object({
	id: z.string().describe('Currency code (ISO 4217)'),
	name: z.string().describe('Currency display name'),
	symbol: z.string().describe('Currency symbol'),
});

export const CountrySchema = z.object({
	id: z.string().describe('Country identifier (code)'),
	name: z.string().describe('Country name'),
});

export const OrganisationSchema = z.object({
	name: z.string().describe('Organisation name'),
	domain: z.string().describe('Organisation domain'),
	currency: CurrencySchema.describe('Default customer currency'),
	address: z.string().describe('Organisation address (default branch)'),
	country: CountrySchema.describe('Organisation country'),
});

export const RoleSchema = z.object({
	id: z.number().int().describe('The ID of the role'),
	name: z.string().describe('The name of the role'),
	active: z.boolean().describe('Whether the role is active or archived'),
});

export const SavedSegmentTypeSchema = z.object({
	id: z.number().int().describe('Saved Segment Type ID'),
	name: z.string().optional().describe('Saved Segment Type Name'),
});

export const SavedSegmentSchema = z.object({
	id: z.number().int().nullable().optional().describe('Saved segment ID'),
	userId: z.number().int().describe('User ID who owns the segment'),
	savedSegmentType: SavedSegmentTypeSchema.describe(
		'Type of the saved segment',
	),
	name: z.string().describe('Segment name'),
	value: z.string().describe('Segment value or query (serialized)'),
});

export const GetOrganisationInputSchema = z.object({});
export type GetOrganisationInput = z.infer<typeof GetOrganisationInputSchema>;
export const GetOrganisationResponseSchema = OrganisationSchema;
export type GetOrganisationResponse = z.infer<
	typeof GetOrganisationResponseSchema
>;

export const GetRoleInputSchema = z.object({
	role_id: z.number().int().positive().describe('Role ID'),
});
export type GetRoleInput = z.infer<typeof GetRoleInputSchema>;
export const GetRoleResponseSchema = RoleSchema;
export type GetRoleResponse = z.infer<typeof GetRoleResponseSchema>;

export const ListRolesInputSchema = z.object({});
export type ListRolesInput = z.infer<typeof ListRolesInputSchema>;
export const ListRolesResponseSchema = z.array(RoleSchema);
export type ListRolesResponse = z.infer<typeof ListRolesResponseSchema>;

export const ListSavedSegmentsInputSchema = z.object({
	user_id: z.number().int().positive().describe('User ID'),
});
export type ListSavedSegmentsInput = z.infer<
	typeof ListSavedSegmentsInputSchema
>;
export const ListSavedSegmentsResponseSchema = z.array(SavedSegmentSchema);
export type ListSavedSegmentsResponse = z.infer<
	typeof ListSavedSegmentsResponseSchema
>;

export type StreamtimeEndpointInputs = {
	getOrganisation: GetOrganisationInput;
	getRole: GetRoleInput;
	listRoles: ListRolesInput;
	listSavedSegments: ListSavedSegmentsInput;
};

export type StreamtimeEndpointOutputs = {
	getOrganisation: GetOrganisationResponse;
	getRole: GetRoleResponse;
	listRoles: ListRolesResponse;
	listSavedSegments: ListSavedSegmentsResponse;
};

export const StreamtimeEndpointInputSchemas = {
	getOrganisation: GetOrganisationInputSchema,
	getRole: GetRoleInputSchema,
	listRoles: ListRolesInputSchema,
	listSavedSegments: ListSavedSegmentsInputSchema,
} as const;

export const StreamtimeEndpointOutputSchemas = {
	getOrganisation: GetOrganisationResponseSchema,
	getRole: GetRoleResponseSchema,
	listRoles: ListRolesResponseSchema,
	listSavedSegments: ListSavedSegmentsResponseSchema,
} as const;
