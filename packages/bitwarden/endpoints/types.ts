import { z } from 'zod';

// Organizations Endpoints
const OrganizationsListInputSchema = z.object({}).optional();
export type OrganizationsListInput = z.infer<typeof OrganizationsListInputSchema>;

const OrganizationsListResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			billingEmail: z.string(),
		})
	),
});
export type OrganizationsListResponse = z.infer<typeof OrganizationsListResponseSchema>;

const OrganizationsGetInputSchema = z.object({
	id: z.string(),
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsGetResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	billingEmail: z.string(),
	businessName: z.string().nullable(),
	businessAddress1: z.string().nullable(),
	businessAddress2: z.string().nullable(),
	businessAddress3: z.string().nullable(),
	businessCountry: z.string().nullable(),
	businessTaxNumber: z.string().nullable(),
});
export type OrganizationsGetResponse = z.infer<typeof OrganizationsGetResponseSchema>;

// Collections Endpoints
const CollectionsListInputSchema = z.object({
	organizationId: z.string(),
});
export type CollectionsListInput = z.infer<typeof CollectionsListInputSchema>;

const CollectionsListResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			organizationId: z.string(),
			name: z.string(),
			externalId: z.string().nullable(),
		})
	),
});
export type CollectionsListResponse = z.infer<typeof CollectionsListResponseSchema>;

const CollectionsGetInputSchema = z.object({
	organizationId: z.string(),
	id: z.string(),
});
export type CollectionsGetInput = z.infer<typeof CollectionsGetInputSchema>;

const CollectionsGetResponseSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	name: z.string(),
	externalId: z.string().nullable(),
});
export type CollectionsGetResponse = z.infer<typeof CollectionsGetResponseSchema>;

// Members Endpoints
const MembersListInputSchema = z.object({
	organizationId: z.string(),
});
export type MembersListInput = z.infer<typeof MembersListInputSchema>;

const MembersListResponseSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			organizationId: z.string(),
			email: z.string(),
			name: z.string(),
			status: z.number(),
			type: z.number(),
			twoFactorEnabled: z.boolean(),
			accessAll: z.boolean(),
		})
	),
});
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;

const MembersGetInputSchema = z.object({
	organizationId: z.string(),
	id: z.string(),
});
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;

const MembersGetResponseSchema = z.object({
	id: z.string(),
	organizationId: z.string(),
	email: z.string(),
	name: z.string(),
	status: z.number(),
	type: z.number(),
	twoFactorEnabled: z.boolean(),
	accessAll: z.boolean(),
});
export type MembersGetResponse = z.infer<typeof MembersGetResponseSchema>;

export type BitwardenEndpointInputs = {
	organizationsList: OrganizationsListInput;
	organizationsGet: OrganizationsGetInput;
	collectionsList: CollectionsListInput;
	collectionsGet: CollectionsGetInput;
	membersList: MembersListInput;
	membersGet: MembersGetInput;
};

export type BitwardenEndpointOutputs = {
	organizationsList: OrganizationsListResponse;
	organizationsGet: OrganizationsGetResponse;
	collectionsList: CollectionsListResponse;
	collectionsGet: CollectionsGetResponse;
	membersList: MembersListResponse;
	membersGet: MembersGetResponse;
};

export const BitwardenEndpointInputSchemas = {
	organizationsList: OrganizationsListInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	collectionsList: CollectionsListInputSchema,
	collectionsGet: CollectionsGetInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
} as const;

export const BitwardenEndpointOutputSchemas = {
	organizationsList: OrganizationsListResponseSchema,
	organizationsGet: OrganizationsGetResponseSchema,
	collectionsList: CollectionsListResponseSchema,
	collectionsGet: CollectionsGetResponseSchema,
	membersList: MembersListResponseSchema,
	membersGet: MembersGetResponseSchema,
} as const;
