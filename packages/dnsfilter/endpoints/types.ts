import { z } from 'zod';
import * as Models from './models';

// Create
const AgentLocalUserBulkDeletesCreateInputSchema = z.object({
	block_page: Models.StringContainsOpSchema.optional(),
	collection_id: Models.ArrayIntegerIsOpSchema.optional(),
	friendly_name: Models.StringContainsOpSchema.optional(),
	name_search: z.string().optional(),
	policy_schedule: Models.StringContainsOpSchema.optional(),
	search: z.string().optional(),
	user_login: Models.StringContainsOpSchema.optional(),
	user_name: Models.StringContainsOpSchema.optional(),
	ids: z.array(z.number().int()).optional(),
	exclude_ids: z.array(z.number().int()).optional(),
});
export type AgentLocalUserBulkDeletesCreateInput = z.infer<
	typeof AgentLocalUserBulkDeletesCreateInputSchema
>;

const AgentLocalUserBulkDeletesCreateResponseSchema = z.object({
	data: Models.AgentLocalUserBulkDeletesSchema.optional(),
});
export type AgentLocalUserBulkDeletesCreateResponse = z.infer<
	typeof AgentLocalUserBulkDeletesCreateResponseSchema
>;

// Show bulk delete
const AgentLocalUserBulkDeletesGetInputSchema = z.object({
	id: z.number().int(),
});
export type AgentLocalUserBulkDeletesGetInput = z.infer<
	typeof AgentLocalUserBulkDeletesGetInputSchema
>;

const AgentLocalUserBulkDeletesGetResponseSchema = z.object({
	data: Models.AgentLocalUserBulkDeletesSchema.optional(),
});
export type AgentLocalUserBulkDeletesGetResponse = z.infer<
	typeof AgentLocalUserBulkDeletesGetResponseSchema
>;

// Count
const AgentLocalUserBulkDeletesCountsInputSchema = z.object({
	id: z.number().int().optional(),
});
export type AgentLocalUserBulkDeletesCountsInput = z.infer<
	typeof AgentLocalUserBulkDeletesCountsInputSchema
>;

const AgentLocalUserBulkDeletesCountsResponseSchema =
	Models.AgentLocalUserBulkDeletesCountsSchema;
export type AgentLocalUserBulkDeletesCountsResponse = z.infer<
	typeof AgentLocalUserBulkDeletesCountsResponseSchema
>;

// Gets extant users
const AgentLocalUsersListInputSchema = z.object({
	block_page: Models.StringContainsOpSchema.optional(),
	collection_id: Models.ArrayIntegerIsOpSchema.optional(),
	cybersight_enabled: z.boolean().optional(),
	end_at: z.string().optional(),
	friendly_name: Models.StringContainsOpSchema.optional(),
	ids: z.array(z.number().int()).optional(),
	in_a_collection: z.boolean().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	policy_schedule: Models.StringContainsOpSchema.optional(),
	search: z.string().optional(),
	sort: z.string().optional(),
	start_at: z.string().optional(),
	user_agent_uuids: z.array(z.string()).optional(),
	user_login: Models.StringContainsOpSchema.optional(),
	user_name: Models.StringContainsOpSchema.optional(),
	user_policy_override: z.boolean().optional(),
	uuids: z.array(z.string()).optional(),
});
export type AgentLocalUsersListInput = z.infer<
	typeof AgentLocalUsersListInputSchema
>;

const AgentLocalUsersListResponseSchema = z.object({
	data: z.array(Models.AgentLocalUserSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type AgentLocalUsersListResponse = z.infer<
	typeof AgentLocalUsersListResponseSchema
>;

// Gets ALL users
const AgentLocalUsersListAllInputSchema = z.object({
	cybersight_enabled: z.boolean().optional(),
	end_at: z.string().optional(),
	in_a_collection: z.boolean().optional(),
	name: z.string().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	sort: z.string().optional(),
	start_at: z.string().optional(),
	user_agent_uuids: z.array(z.string()).optional(),
	user_policy_override: z.boolean().optional(),
});
export type AgentLocalUsersListAllInput = z.infer<
	typeof AgentLocalUsersListAllInputSchema
>;

const AgentLocalUsersListAllResponseSchema = z.object({
	data: z.array(Models.AgentLocalUserSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type AgentLocalUsersListAllResponse = z.infer<
	typeof AgentLocalUsersListAllResponseSchema
>;

// Show extant user
const AgentLocalUsersGetInputSchema = z.object({
	id: z.number().int(),
});
export type AgentLocalUsersGetInput = z.infer<
	typeof AgentLocalUsersGetInputSchema
>;

const AgentLocalUsersGetResponseSchema = z.object({
	data: Models.AgentLocalUserSpecSchema.optional(),
});
export type AgentLocalUsersGetResponse = z.infer<
	typeof AgentLocalUsersGetResponseSchema
>;

// Update
const AgentLocalUsersUpdateInputSchema = z.object({
	id: z.number().int(),
	agent_local_user: Models.AgentLocalUserUpdateSchema,
});
export type AgentLocalUsersUpdateInput = z.infer<
	typeof AgentLocalUsersUpdateInputSchema
>;

const AgentLocalUsersUpdateResponseSchema = z.object({
	data: Models.AgentLocalUserSpecSchema.optional(),
});
export type AgentLocalUsersUpdateResponse = z.infer<
	typeof AgentLocalUsersUpdateResponseSchema
>;

// Delete
const AgentLocalUsersDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type AgentLocalUsersDeleteInput = z.infer<
	typeof AgentLocalUsersDeleteInputSchema
>;

const AgentLocalUsersDeleteResponseSchema = z.undefined();
export type AgentLocalUsersDeleteResponse = z.infer<
	typeof AgentLocalUsersDeleteResponseSchema
>;

// Create
const ApiKeysCreateInputSchema = z.object({
	name: z.string().optional(),
	expiry: z.string().optional(),
});
export type ApiKeysCreateInput = z.infer<typeof ApiKeysCreateInputSchema>;

const ApiKeysCreateResponseSchema = z.object({
	data: Models.ApiKeySpecSchema.optional(),
});
export type ApiKeysCreateResponse = z.infer<typeof ApiKeysCreateResponseSchema>;

// List
const ApiKeysListInputSchema = z.object({
	expired: z.boolean().optional(),
	id: z.number().int().optional(),
	last_four: z.string().optional(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
});
export type ApiKeysListInput = z.infer<typeof ApiKeysListInputSchema>;

const ApiKeysListResponseSchema = z.object({
	data: z.array(Models.ApiKeySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type ApiKeysListResponse = z.infer<typeof ApiKeysListResponseSchema>;

// Show
const ApiKeysGetInputSchema = z.object({
	id: z.number().int(),
});
export type ApiKeysGetInput = z.infer<typeof ApiKeysGetInputSchema>;

const ApiKeysGetResponseSchema = z.object({
	data: Models.ApiKeySpecSchema.optional(),
});
export type ApiKeysGetResponse = z.infer<typeof ApiKeysGetResponseSchema>;

// Delete
const ApiKeysDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type ApiKeysDeleteInput = z.infer<typeof ApiKeysDeleteInputSchema>;

const ApiKeysDeleteResponseSchema = z.undefined();
export type ApiKeysDeleteResponse = z.infer<typeof ApiKeysDeleteResponseSchema>;

// Revoke
const ApiKeysRevokeInputSchema = z.object({
	id: z.number().int(),
});
export type ApiKeysRevokeInput = z.infer<typeof ApiKeysRevokeInputSchema>;

const ApiKeysRevokeResponseSchema = z.object({
	data: Models.ApiKeySpecSchema.optional(),
});
export type ApiKeysRevokeResponse = z.infer<typeof ApiKeysRevokeResponseSchema>;

// Get extant
const ApplicationCategoriesListInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type ApplicationCategoriesListInput = z.infer<
	typeof ApplicationCategoriesListInputSchema
>;

const ApplicationCategoriesListResponseSchema = z.object({
	data: z.array(Models.ApplicationCategorySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type ApplicationCategoriesListResponse = z.infer<
	typeof ApplicationCategoriesListResponseSchema
>;

// Show category
const ApplicationCategoriesGetInputSchema = z.object({
	id: z.number().int(),
});
export type ApplicationCategoriesGetInput = z.infer<
	typeof ApplicationCategoriesGetInputSchema
>;

const ApplicationCategoriesGetResponseSchema = z.object({
	data: Models.ApplicationCategorySpecSchema.optional(),
});
export type ApplicationCategoriesGetResponse = z.infer<
	typeof ApplicationCategoriesGetResponseSchema
>;

// Get extant
const ApplicationsListInputSchema = z.object({
	category_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type ApplicationsListInput = z.infer<typeof ApplicationsListInputSchema>;

const ApplicationsListResponseSchema = z.object({
	data: z.array(Models.ApplicationSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type ApplicationsListResponse = z.infer<
	typeof ApplicationsListResponseSchema
>;

// Get all
const ApplicationsListAllInputSchema = z.object({
	category_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type ApplicationsListAllInput = z.infer<
	typeof ApplicationsListAllInputSchema
>;

const ApplicationsListAllResponseSchema = z.object({
	data: z.array(Models.ApplicationSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type ApplicationsListAllResponse = z.infer<
	typeof ApplicationsListAllResponseSchema
>;

// Show
const ApplicationsGetInputSchema = z.object({
	id: z.number().int(),
});
export type ApplicationsGetInput = z.infer<typeof ApplicationsGetInputSchema>;

const ApplicationsGetResponseSchema = z.object({
	data: Models.ApplicationSpecSchema.optional(),
});
export type ApplicationsGetResponse = z.infer<
	typeof ApplicationsGetResponseSchema
>;

// Show
const BillingsGetInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type BillingsGetInput = z.infer<typeof BillingsGetInputSchema>;

const BillingsGetResponseSchema = Models.PaymentMethodSchema;
export type BillingsGetResponse = z.infer<typeof BillingsGetResponseSchema>;

// Create
const BillingsCreateInputSchema = z.object({
	organization_id: z.number().int(),
	payment_token: z.string(),
});
export type BillingsCreateInput = z.infer<typeof BillingsCreateInputSchema>;

const BillingsCreateResponseSchema = z.undefined();
export type BillingsCreateResponse = z.infer<
	typeof BillingsCreateResponseSchema
>;

// Show address
const BillingsAddressShowInputSchema = z.object({
	organization_id: z.number().int(),
});
export type BillingsAddressShowInput = z.infer<
	typeof BillingsAddressShowInputSchema
>;

const BillingsAddressShowResponseSchema = Models.Billing_BillingAddressSchema;
export type BillingsAddressShowResponse = z.infer<
	typeof BillingsAddressShowResponseSchema
>;

// Update address
const BillingsAddressUpdateInputSchema = z.object({
	organization_id: z.number().int(),
	billing_address: Models.Billing_BillingAddressSchema,
});
export type BillingsAddressUpdateInput = z.infer<
	typeof BillingsAddressUpdateInputSchema
>;

const BillingsAddressUpdateResponseSchema = Models.Billing_BillingAddressSchema;
export type BillingsAddressUpdateResponse = z.infer<
	typeof BillingsAddressUpdateResponseSchema
>;

// Get extant
const BlockPagesListInputSchema = z.object({
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type BlockPagesListInput = z.infer<typeof BlockPagesListInputSchema>;

const BlockPagesListResponseSchema = z.array(Models.BlockPageSchema);
export type BlockPagesListResponse = z.infer<
	typeof BlockPagesListResponseSchema
>;

// Create
const BlockPagesCreateInputSchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	block_org_name: z.string().optional(),
	block_email_addr: z.string().optional(),
	block_logo_uuid: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type BlockPagesCreateInput = z.infer<typeof BlockPagesCreateInputSchema>;

const BlockPagesCreateResponseSchema = Models.BlockPageSchema;
export type BlockPagesCreateResponse = z.infer<
	typeof BlockPagesCreateResponseSchema
>;

// Get all
const BlockPagesListAllInputSchema = z.object({
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type BlockPagesListAllInput = z.infer<
	typeof BlockPagesListAllInputSchema
>;

const BlockPagesListAllResponseSchema = z.array(Models.BlockPageSchema);
export type BlockPagesListAllResponse = z.infer<
	typeof BlockPagesListAllResponseSchema
>;

// Show page
const BlockPagesGetInputSchema = z.object({
	id: z.number().int(),
	include_relationships: z.boolean().optional(),
});
export type BlockPagesGetInput = z.infer<typeof BlockPagesGetInputSchema>;

const BlockPagesGetResponseSchema = Models.BlockPageSchema;
export type BlockPagesGetResponse = z.infer<typeof BlockPagesGetResponseSchema>;

// Update
const BlockPagesUpdateInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	block_org_name: z.string().optional(),
	block_email_addr: z.string().optional(),
	block_logo_uuid: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type BlockPagesUpdateInput = z.infer<typeof BlockPagesUpdateInputSchema>;

const BlockPagesUpdateResponseSchema = Models.BlockPageSchema;
export type BlockPagesUpdateResponse = z.infer<
	typeof BlockPagesUpdateResponseSchema
>;

// Delete
const BlockPagesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type BlockPagesDeleteInput = z.infer<typeof BlockPagesDeleteInputSchema>;

const BlockPagesDeleteResponseSchema = Models.BlockPageSchema;
export type BlockPagesDeleteResponse = z.infer<
	typeof BlockPagesDeleteResponseSchema
>;

// Get extant
const CategoriesListInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type CategoriesListInput = z.infer<typeof CategoriesListInputSchema>;

const CategoriesListResponseSchema = z.object({
	data: z.array(Models.CategorySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type CategoriesListResponse = z.infer<
	typeof CategoriesListResponseSchema
>;

// Get all
const CategoriesListAllInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type CategoriesListAllInput = z.infer<
	typeof CategoriesListAllInputSchema
>;

const CategoriesListAllResponseSchema = z.object({
	data: z.array(Models.CategorySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type CategoriesListAllResponse = z.infer<
	typeof CategoriesListAllResponseSchema
>;

// Show category
const CategoriesGetInputSchema = z.object({
	id: z.number().int(),
});
export type CategoriesGetInput = z.infer<typeof CategoriesGetInputSchema>;

const CategoriesGetResponseSchema = z.object({
	data: Models.CategorySpecSchema.optional(),
});
export type CategoriesGetResponse = z.infer<typeof CategoriesGetResponseSchema>;

// Gets collection users
const CollectionUsersListInputSchema = z.object({
	collection_id: z.number().int(),
	name: z.string().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	sort: z.string().optional(),
});
export type CollectionUsersListInput = z.infer<
	typeof CollectionUsersListInputSchema
>;

const CollectionUsersListResponseSchema = z.object({
	data: Models.CollectionUserSpecSchema.optional(),
});
export type CollectionUsersListResponse = z.infer<
	typeof CollectionUsersListResponseSchema
>;

// Update
const CollectionUsersCreateInputSchema = z.object({
	collection_id: z.number().int(),
	body: Models.CollectionUserCreateSpecSchema,
});
export type CollectionUsersCreateInput = z.infer<
	typeof CollectionUsersCreateInputSchema
>;

const CollectionUsersCreateResponseSchema = z.object({
	data: Models.CollectionUserSpecSchema.optional(),
});
export type CollectionUsersCreateResponse = z.infer<
	typeof CollectionUsersCreateResponseSchema
>;

// Show user
const CollectionUsersGetInputSchema = z.object({
	collection_id: z.number().int(),
	id: z.number().int(),
});
export type CollectionUsersGetInput = z.infer<
	typeof CollectionUsersGetInputSchema
>;

const CollectionUsersGetResponseSchema = z.object({
	data: Models.CollectionUserSpecSchema.optional(),
});
export type CollectionUsersGetResponse = z.infer<
	typeof CollectionUsersGetResponseSchema
>;

// Delete user
const CollectionUsersDeleteInputSchema = z.object({
	collection_id: z.number().int(),
	id: z.number().int(),
});
export type CollectionUsersDeleteInput = z.infer<
	typeof CollectionUsersDeleteInputSchema
>;

const CollectionUsersDeleteResponseSchema = z.undefined();
export type CollectionUsersDeleteResponse = z.infer<
	typeof CollectionUsersDeleteResponseSchema
>;

// Get
const CurrentUsersGetInputSchema = z.object({}).optional();
export type CurrentUsersGetInput = z.infer<typeof CurrentUsersGetInputSchema>;

const CurrentUsersGetResponseSchema = z.object({
	data: Models.UserSpecSchema.optional(),
});
export type CurrentUsersGetResponse = z.infer<
	typeof CurrentUsersGetResponseSchema
>;

// Update
const CurrentUsersUpdateInputSchema = z.object({
	user: z
		.object({
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			phone: z.string().optional(),
		})
		.optional(),
});
export type CurrentUsersUpdateInput = z.infer<
	typeof CurrentUsersUpdateInputSchema
>;

const CurrentUsersUpdateResponseSchema = z.object({
	data: Models.UserSpecSchema.optional(),
});
export type CurrentUsersUpdateResponse = z.infer<
	typeof CurrentUsersUpdateResponseSchema
>;

// List QP Methods
const DictionaryQpMethodsInputSchema = z.object({}).optional();
export type DictionaryQpMethodsInput = z.infer<
	typeof DictionaryQpMethodsInputSchema
>;

const DictionaryQpMethodsResponseSchema = z.array(
	z.object({
		id: z.number().int().optional(),
		allow: z.boolean().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
	}),
);
export type DictionaryQpMethodsResponse = z.infer<
	typeof DictionaryQpMethodsResponseSchema
>;

// Show
const DomainNotesGetInputSchema = z.object({
	domain: z.string(),
	id: z.number().int(),
	resource: z.enum(['policies', 'msps', 'organizations']),
});
export type DomainNotesGetInput = z.infer<typeof DomainNotesGetInputSchema>;

const DomainNotesGetResponseSchema = z.record(z.string(), z.unknown());
export type DomainNotesGetResponse = z.infer<
	typeof DomainNotesGetResponseSchema
>;

// Update
const DomainNotesUpdateInputSchema = z.object({
	domain: z.string(),
	id: z.number().int(),
	resource: z.enum(['policies', 'msps', 'organizations']),
	body: Models.DomainNotesCreateSpecSchema,
});
export type DomainNotesUpdateInput = z.infer<
	typeof DomainNotesUpdateInputSchema
>;

const DomainNotesUpdateResponseSchema = z.record(z.string(), z.unknown());
export type DomainNotesUpdateResponse = z.infer<
	typeof DomainNotesUpdateResponseSchema
>;

// Bulk update
const DomainNotesBatchUpdateInputSchema = z.object({
	id: z.number().int(),
	resource: z.enum(['policies', 'msps', 'organizations']),
	append: z.boolean().optional(),
	notes: z
		.array(
			z.object({
				domain: z.string().optional(),
				note: z.string().optional(),
			}),
		)
		.optional(),
	organization_ids: z.array(z.number().int()).optional(),
	single_note: z.string().optional(),
	type: z.enum(['allow', 'block']).optional(),
});
export type DomainNotesBatchUpdateInput = z.infer<
	typeof DomainNotesBatchUpdateInputSchema
>;

const DomainNotesBatchUpdateResponseSchema = z.record(z.string(), z.unknown());
export type DomainNotesBatchUpdateResponse = z.infer<
	typeof DomainNotesBatchUpdateResponseSchema
>;

// Delete
const DomainNotesDeleteInputSchema = z.object({
	domain: z.string(),
	id: z.number().int(),
	resource: z.enum(['policies', 'msps', 'organizations']),
});
export type DomainNotesDeleteInput = z.infer<
	typeof DomainNotesDeleteInputSchema
>;

const DomainNotesDeleteResponseSchema = z.record(z.string(), z.unknown());
export type DomainNotesDeleteResponse = z.infer<
	typeof DomainNotesDeleteResponseSchema
>;

// Batch destroy
const DomainNotesBatchDestroyInputSchema = z.object({
	id: z.number().int(),
	resource: z.enum(['policies', 'msps', 'organizations']),
	domains: z.string().optional(),
});
export type DomainNotesBatchDestroyInput = z.infer<
	typeof DomainNotesBatchDestroyInputSchema
>;

const DomainNotesBatchDestroyResponseSchema = z.record(z.string(), z.unknown());
export type DomainNotesBatchDestroyResponse = z.infer<
	typeof DomainNotesBatchDestroyResponseSchema
>;

// Lookup
const DomainsUserLookupInputSchema = z.object({
	fqdn: z.string().optional(),
});
export type DomainsUserLookupInput = z.infer<
	typeof DomainsUserLookupInputSchema
>;

const DomainsUserLookupResponseSchema = z.object({
	data: Models.DomainSpecSchema.optional(),
});
export type DomainsUserLookupResponse = z.infer<
	typeof DomainsUserLookupResponseSchema
>;

// Bulk lookup
const DomainsBulkLookupInputSchema = z.object({
	fqdns: z.string().optional(),
});
export type DomainsBulkLookupInput = z.infer<
	typeof DomainsBulkLookupInputSchema
>;

const DomainsBulkLookupResponseSchema = z.object({
	data: z.array(Models.DomainSpecSchema).optional(),
});
export type DomainsBulkLookupResponse = z.infer<
	typeof DomainsBulkLookupResponseSchema
>;

// Suggest threat
const DomainsSuggestThreatInputSchema = z.object({
	categories: z.string().optional(),
	fqdn: z.string().optional(),
	notes: z.string().optional(),
});
export type DomainsSuggestThreatInput = z.infer<
	typeof DomainsSuggestThreatInputSchema
>;

const DomainsSuggestThreatResponseSchema = Models.SuccessSchema;
export type DomainsSuggestThreatResponse = z.infer<
	typeof DomainsSuggestThreatResponseSchema
>;

// Get extant
const EnterpriseConnectionsListInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type EnterpriseConnectionsListInput = z.infer<
	typeof EnterpriseConnectionsListInputSchema
>;

const EnterpriseConnectionsListResponseSchema = z.object({
	data: z
		.array(
			z.object({
				attributes: Models.EnterpriseConnectionSchema.optional(),
			}),
		)
		.optional(),
});
export type EnterpriseConnectionsListResponse = z.infer<
	typeof EnterpriseConnectionsListResponseSchema
>;

// Create
const EnterpriseConnectionsCreateInputSchema = z.object({
	organization_id: z.number().int(),
	default_organization_id: z.number().int().optional(),
	strategy: z.enum(['oidc']),
	display_name: z.string().optional(),
	role_default: z
		.enum([
			'administrator',
			'read_only',
			'owner',
			'technical',
			'accountant',
			'policies_only',
			'super_administrator',
		])
		.optional(),
	role_map: z.array(Models.EnterpriseConnectionRoleMapSchema).optional(),
	options: Models.EnterpriseConnectionOptionsSchema,
	idp: z.enum(['openid', 'okta', 'azure', 'google']).optional(),
	authorized_domains: z.array(z.string()).optional(),
});
export type EnterpriseConnectionsCreateInput = z.infer<
	typeof EnterpriseConnectionsCreateInputSchema
>;

const EnterpriseConnectionsCreateResponseSchema = z.object({
	data: z
		.object({
			attributes: Models.EnterpriseConnectionSchema.optional(),
		})
		.optional(),
});
export type EnterpriseConnectionsCreateResponse = z.infer<
	typeof EnterpriseConnectionsCreateResponseSchema
>;

// Show connection
const EnterpriseConnectionsGetInputSchema = z.object({
	id: z.number().int(),
});
export type EnterpriseConnectionsGetInput = z.infer<
	typeof EnterpriseConnectionsGetInputSchema
>;

const EnterpriseConnectionsGetResponseSchema = z.object({
	data: z
		.object({
			attributes: Models.EnterpriseConnectionSchema.optional(),
		})
		.optional(),
});
export type EnterpriseConnectionsGetResponse = z.infer<
	typeof EnterpriseConnectionsGetResponseSchema
>;

// Update
const EnterpriseConnectionsUpdateInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int().optional(),
	default_organization_id: z.number().int().optional(),
	display_name: z.string().optional(),
	role_default: z
		.enum([
			'administrator',
			'read_only',
			'owner',
			'technical',
			'accountant',
			'policies_only',
			'super_administrator',
		])
		.optional(),
	role_map: z.array(Models.EnterpriseConnectionRoleMapSchema).optional(),
	options: Models.EnterpriseConnectionOptionsSchema,
	idp: z.enum(['openid', 'okta', 'azure', 'google']).optional(),
	authorized_domains: z.array(z.string()).optional(),
});
export type EnterpriseConnectionsUpdateInput = z.infer<
	typeof EnterpriseConnectionsUpdateInputSchema
>;

const EnterpriseConnectionsUpdateResponseSchema = z.object({
	data: z
		.object({
			attributes: Models.EnterpriseConnectionSchema.optional(),
		})
		.optional(),
});
export type EnterpriseConnectionsUpdateResponse = z.infer<
	typeof EnterpriseConnectionsUpdateResponseSchema
>;

// Delete
const EnterpriseConnectionsDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type EnterpriseConnectionsDeleteInput = z.infer<
	typeof EnterpriseConnectionsDeleteInputSchema
>;

const EnterpriseConnectionsDeleteResponseSchema = z.undefined();
export type EnterpriseConnectionsDeleteResponse = z.infer<
	typeof EnterpriseConnectionsDeleteResponseSchema
>;

// Get current invoice
const InvoicesCurrentInputSchema = z.object({}).optional();
export type InvoicesCurrentInput = z.infer<typeof InvoicesCurrentInputSchema>;

const InvoicesCurrentResponseSchema = z.object({
	month_to_date: Models.InvoiceSchema.optional(),
	estimated: Models.InvoiceSchema.optional(),
});
export type InvoicesCurrentResponse = z.infer<
	typeof InvoicesCurrentResponseSchema
>;

// Get invoices
const InvoicesListInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

const InvoicesListResponseSchema = z.array(Models.InvoiceSchema);
export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

// Get invoice
const InvoicesGetInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int().optional(),
});
export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;

const InvoicesGetResponseSchema = Models.InvoiceSchema;
export type InvoicesGetResponse = z.infer<typeof InvoicesGetResponseSchema>;

// Get extant
const IpAddressesListInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	search: z.string().optional(),
});
export type IpAddressesListInput = z.infer<typeof IpAddressesListInputSchema>;

const IpAddressesListResponseSchema = z.object({
	data: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type IpAddressesListResponse = z.infer<
	typeof IpAddressesListResponseSchema
>;

// Create
const IpAddressesCreateInputSchema = z.object({
	ip_address: Models.IpAddressCreateSchema,
});
export type IpAddressesCreateInput = z.infer<
	typeof IpAddressesCreateInputSchema
>;

const IpAddressesCreateResponseSchema = z.object({
	data: Models.IpAddressSpecSchema.optional(),
});
export type IpAddressesCreateResponse = z.infer<
	typeof IpAddressesCreateResponseSchema
>;

// Get all
const IpAddressesListAllInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type IpAddressesListAllInput = z.infer<
	typeof IpAddressesListAllInputSchema
>;

const IpAddressesListAllResponseSchema = z.object({
	data: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type IpAddressesListAllResponse = z.infer<
	typeof IpAddressesListAllResponseSchema
>;

// Show IP
const IpAddressesGetInputSchema = z.object({
	id: z.number().int(),
});
export type IpAddressesGetInput = z.infer<typeof IpAddressesGetInputSchema>;

const IpAddressesGetResponseSchema = z.object({
	data: Models.IpAddressSpecSchema.optional(),
});
export type IpAddressesGetResponse = z.infer<
	typeof IpAddressesGetResponseSchema
>;

// Update
const IpAddressesUpdateInputSchema = z.object({
	id: z.number().int(),
	ip_address: Models.IpAddressCreateSchema,
});
export type IpAddressesUpdateInput = z.infer<
	typeof IpAddressesUpdateInputSchema
>;

const IpAddressesUpdateResponseSchema = z.object({
	data: Models.IpAddressSpecSchema.optional(),
});
export type IpAddressesUpdateResponse = z.infer<
	typeof IpAddressesUpdateResponseSchema
>;

// Delete
const IpAddressesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type IpAddressesDeleteInput = z.infer<
	typeof IpAddressesDeleteInputSchema
>;

const IpAddressesDeleteResponseSchema = z.object({
	data: Models.IpAddressSpecSchema.optional(),
});
export type IpAddressesDeleteResponse = z.infer<
	typeof IpAddressesDeleteResponseSchema
>;

// Verify IP
const IpAddressesVerifyInputSchema = z.object({
	ip_address: Models.IpAddressCreateSchema,
});
export type IpAddressesVerifyInput = z.infer<
	typeof IpAddressesVerifyInputSchema
>;

const IpAddressesVerifyResponseSchema = z.union([
	z.object({
		status: z.string().optional(),
	}),
	z.object({
		data: z.array(Models.IpAddressSpecSchema).optional(),
	}),
]);
export type IpAddressesVerifyResponse = z.infer<
	typeof IpAddressesVerifyResponseSchema
>;

// Get my IP
const IpAddressesMyipInputSchema = z.object({}).optional();
export type IpAddressesMyipInput = z.infer<typeof IpAddressesMyipInputSchema>;

const IpAddressesMyipResponseSchema = z.object({
	myip: z.string().optional(),
});
export type IpAddressesMyipResponse = z.infer<
	typeof IpAddressesMyipResponseSchema
>;

// Get extant
const MacAddressesListInputSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type MacAddressesListInput = z.infer<typeof MacAddressesListInputSchema>;

const MacAddressesListResponseSchema = z.object({
	data: z.array(Models.MacAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type MacAddressesListResponse = z.infer<
	typeof MacAddressesListResponseSchema
>;

// Create
const MacAddressesCreateInputSchema = z.object({
	mac_address: Models.MacAddressCreateSchema,
});
export type MacAddressesCreateInput = z.infer<
	typeof MacAddressesCreateInputSchema
>;

const MacAddressesCreateResponseSchema = z.object({
	data: Models.MacAddressSpecSchema.optional(),
});
export type MacAddressesCreateResponse = z.infer<
	typeof MacAddressesCreateResponseSchema
>;

// Get all
const MacAddressesListAllInputSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type MacAddressesListAllInput = z.infer<
	typeof MacAddressesListAllInputSchema
>;

const MacAddressesListAllResponseSchema = z.object({
	data: z.array(Models.MacAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type MacAddressesListAllResponse = z.infer<
	typeof MacAddressesListAllResponseSchema
>;

// Show address
const MacAddressesGetInputSchema = z.object({
	id: z.number().int(),
});
export type MacAddressesGetInput = z.infer<typeof MacAddressesGetInputSchema>;

const MacAddressesGetResponseSchema = z.object({
	data: Models.MacAddressSpecSchema.optional(),
});
export type MacAddressesGetResponse = z.infer<
	typeof MacAddressesGetResponseSchema
>;

// Update
const MacAddressesUpdateInputSchema = z.object({
	id: z.number().int(),
	mac_address: Models.MacAddressCreateSchema,
});
export type MacAddressesUpdateInput = z.infer<
	typeof MacAddressesUpdateInputSchema
>;

const MacAddressesUpdateResponseSchema = z.object({
	data: Models.MacAddressSpecSchema.optional(),
});
export type MacAddressesUpdateResponse = z.infer<
	typeof MacAddressesUpdateResponseSchema
>;

// Delete
const MacAddressesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type MacAddressesDeleteInput = z.infer<
	typeof MacAddressesDeleteInputSchema
>;

const MacAddressesDeleteResponseSchema = z.object({
	data: Models.MacAddressSpecSchema.optional(),
});
export type MacAddressesDeleteResponse = z.infer<
	typeof MacAddressesDeleteResponseSchema
>;

// Get usage
const MetricsOrganizationUsageInputSchema = z.object({
	id: z.number().int(),
	from: z.string().optional(),
	to: z.string().optional(),
});
export type MetricsOrganizationUsageInput = z.infer<
	typeof MetricsOrganizationUsageInputSchema
>;

const MetricsOrganizationUsageResponseSchema = z.object({
	data: z
		.object({
			organization_id: z.number().int().optional(),
			plan: z.string().optional(),
			term: z.string().optional(),
			user_count: z.number().int().optional(),
			wifi_count: z.number().int().optional(),
			total_requests: z.number().int().optional(),
			estimated_users: z.number().int().optional(),
			from: z.string().optional(),
			to: z.string().optional(),
			days_in_period: z.number().int().optional(),
		})
		.optional(),
	meta: z
		.object({
			queries_per_user: z.number().int().optional(),
		})
		.optional(),
});
export type MetricsOrganizationUsageResponse = z.infer<
	typeof MetricsOrganizationUsageResponseSchema
>;

// Get usage detailed
const MetricsOrganizationUsageDetailedInputSchema = z.object({
	id: z.number().int(),
	from: z.string().optional(),
	to: z.string().optional(),
});
export type MetricsOrganizationUsageDetailedInput = z.infer<
	typeof MetricsOrganizationUsageDetailedInputSchema
>;

const MetricsOrganizationUsageDetailedResponseSchema = z.object({
	data: z
		.object({
			organization_id: z.number().int().optional(),
			plan: z.string().optional(),
			term: z.string().optional(),
			user_count: z.number().int().optional(),
			wifi_count: z.number().int().optional(),
			roaming_client_count: z.number().int().optional(),
			mobile_roaming_client_count: z.number().int().optional(),
			total_requests: z.number().int().optional(),
			estimated_users: z.number().int().optional(),
			from: z.string().optional(),
			to: z.string().optional(),
			days_in_period: z.number().int().optional(),
		})
		.optional(),
	meta: z
		.object({
			queries_per_user: z.number().int().optional(),
		})
		.optional(),
});
export type MetricsOrganizationUsageDetailedResponse = z.infer<
	typeof MetricsOrganizationUsageDetailedResponseSchema
>;

// Get
const NetworkLanIpsListInputSchema = z.object({
	id: z.number().int(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type NetworkLanIpsListInput = z.infer<
	typeof NetworkLanIpsListInputSchema
>;

const NetworkLanIpsListResponseSchema = z.object({
	data: z.array(Models.NetworkLanIpSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworkLanIpsListResponse = z.infer<
	typeof NetworkLanIpsListResponseSchema
>;

// Show Lan IP
const NetworkLanIpsGetInputSchema = z.object({
	id: z.number().int(),
	lan_ip_id: z.number().int(),
});
export type NetworkLanIpsGetInput = z.infer<typeof NetworkLanIpsGetInputSchema>;

const NetworkLanIpsGetResponseSchema = z.object({
	data: Models.NetworkLanIpSpecSchema.optional(),
});
export type NetworkLanIpsGetResponse = z.infer<
	typeof NetworkLanIpsGetResponseSchema
>;

// Update
const NetworkLanIpsUpdateInputSchema = z.object({
	id: z.number().int(),
	lan_ip_id: z.number().int(),
	network_lan_ip: Models.NetworkLanIpUpdateSchema,
});
export type NetworkLanIpsUpdateInput = z.infer<
	typeof NetworkLanIpsUpdateInputSchema
>;

const NetworkLanIpsUpdateResponseSchema = z.object({
	data: Models.NetworkLanIpSpecSchema.optional(),
});
export type NetworkLanIpsUpdateResponse = z.infer<
	typeof NetworkLanIpsUpdateResponseSchema
>;

// Get all
const NetworkSubnetsListAllInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type NetworkSubnetsListAllInput = z.infer<
	typeof NetworkSubnetsListAllInputSchema
>;

const NetworkSubnetsListAllResponseSchema = z.object({
	data: z.array(Models.NetworkSubnetSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworkSubnetsListAllResponse = z.infer<
	typeof NetworkSubnetsListAllResponseSchema
>;

// Get extant
const NetworkSubnetsListInputSchema = z.object({
	id: z.number().int(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type NetworkSubnetsListInput = z.infer<
	typeof NetworkSubnetsListInputSchema
>;

const NetworkSubnetsListResponseSchema = z.object({
	data: z.array(Models.NetworkSubnetSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworkSubnetsListResponse = z.infer<
	typeof NetworkSubnetsListResponseSchema
>;

// Create
const NetworkSubnetsCreateInputSchema = z.object({
	id: z.number().int(),
	network_subnet: Models.NetworkSubnetCreateSchema,
});
export type NetworkSubnetsCreateInput = z.infer<
	typeof NetworkSubnetsCreateInputSchema
>;

const NetworkSubnetsCreateResponseSchema = z.object({
	data: Models.NetworkSubnetSpecSchema.optional(),
});
export type NetworkSubnetsCreateResponse = z.infer<
	typeof NetworkSubnetsCreateResponseSchema
>;

// Show subnet
const NetworkSubnetsGetInputSchema = z.object({
	id: z.number().int(),
	subnet_id: z.number().int(),
});
export type NetworkSubnetsGetInput = z.infer<
	typeof NetworkSubnetsGetInputSchema
>;

const NetworkSubnetsGetResponseSchema = z.object({
	data: Models.NetworkSubnetSpecSchema.optional(),
});
export type NetworkSubnetsGetResponse = z.infer<
	typeof NetworkSubnetsGetResponseSchema
>;

// Update
const NetworkSubnetsUpdateInputSchema = z.object({
	id: z.number().int(),
	subnet_id: z.number().int(),
	network_subnet: Models.NetworkSubnetCreateSchema,
});
export type NetworkSubnetsUpdateInput = z.infer<
	typeof NetworkSubnetsUpdateInputSchema
>;

const NetworkSubnetsUpdateResponseSchema = z.object({
	data: Models.NetworkSubnetSpecSchema.optional(),
});
export type NetworkSubnetsUpdateResponse = z.infer<
	typeof NetworkSubnetsUpdateResponseSchema
>;

// Delete
const NetworkSubnetsDeleteInputSchema = z.object({
	id: z.number().int(),
	subnet_id: z.number().int(),
});
export type NetworkSubnetsDeleteInput = z.infer<
	typeof NetworkSubnetsDeleteInputSchema
>;

const NetworkSubnetsDeleteResponseSchema = z.object({
	data: Models.NetworkSubnetSpecSchema.optional(),
});
export type NetworkSubnetsDeleteResponse = z.infer<
	typeof NetworkSubnetsDeleteResponseSchema
>;

// Get extant
const NetworksListInputSchema = z.object({
	basic_info: z.boolean().optional(),
	count_network_ips: z.boolean().optional(),
	force_truncate_ips: z.boolean().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	protected: z.boolean().optional(),
	search: z.string().optional(),
	unprotected: z.boolean().optional(),
});
export type NetworksListInput = z.infer<typeof NetworksListInputSchema>;

const NetworksListResponseSchema = z.object({
	data: z.array(Models.NetworkSpecSchema).optional(),
	included: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworksListResponse = z.infer<typeof NetworksListResponseSchema>;

// Create
const NetworksCreateInputSchema = z.object({
	network: Models.NetworkCreateSchema,
});
export type NetworksCreateInput = z.infer<typeof NetworksCreateInputSchema>;

const NetworksCreateResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksCreateResponse = z.infer<
	typeof NetworksCreateResponseSchema
>;

// Get all
const NetworksListAllInputSchema = z.object({
	basic_info: z.boolean().optional(),
	count_network_ips: z.boolean().optional(),
	force_truncate_ips: z.boolean().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	protected: z.boolean().optional(),
	search: z.string().optional(),
	unprotected: z.boolean().optional(),
});
export type NetworksListAllInput = z.infer<typeof NetworksListAllInputSchema>;

const NetworksListAllResponseSchema = z.object({
	data: z.array(Models.NetworkSpecSchema).optional(),
	included: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworksListAllResponse = z.infer<
	typeof NetworksListAllResponseSchema
>;

// Counts
const NetworksCountsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
});
export type NetworksCountsInput = z.infer<typeof NetworksCountsInputSchema>;

const NetworksCountsResponseSchema = Models.NetworkCountsSchema;
export type NetworksCountsResponse = z.infer<
	typeof NetworksCountsResponseSchema
>;

// Get extant MSP
const NetworksMspInputSchema = z.object({
	basic_info: z.boolean().optional(),
	count_network_ips: z.boolean().optional(),
	force_truncate_ips: z.boolean().optional(),
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	protected: z.boolean().optional(),
	unprotected: z.boolean().optional(),
});
export type NetworksMspInput = z.infer<typeof NetworksMspInputSchema>;

const NetworksMspResponseSchema = z.object({
	data: z.array(Models.NetworkSpecSchema).optional(),
	included: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworksMspResponse = z.infer<typeof NetworksMspResponseSchema>;

// Get all MSP
const NetworksMspAllInputSchema = z.object({
	count_network_ips: z.boolean().optional(),
	force_truncate_ips: z.boolean().optional(),
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	protected: z.boolean().optional(),
	unprotected: z.boolean().optional(),
});
export type NetworksMspAllInput = z.infer<typeof NetworksMspAllInputSchema>;

const NetworksMspAllResponseSchema = z.object({
	data: z.array(Models.NetworkSpecSchema).optional(),
	included: z.array(Models.IpAddressSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type NetworksMspAllResponse = z.infer<
	typeof NetworksMspAllResponseSchema
>;

// Get Geo
const NetworksGeoInputSchema = z.object({}).optional();
export type NetworksGeoInput = z.infer<typeof NetworksGeoInputSchema>;

const NetworksGeoResponseSchema = z.array(Models.NetworkGeoSchema);
export type NetworksGeoResponse = z.infer<typeof NetworksGeoResponseSchema>;

// Get by IP
const NetworksLookupInputSchema = z.object({
	requesting_ip_address: z.string().optional(),
});
export type NetworksLookupInput = z.infer<typeof NetworksLookupInputSchema>;

const NetworksLookupResponseSchema = Models.NetworkLookupSchema;
export type NetworksLookupResponse = z.infer<
	typeof NetworksLookupResponseSchema
>;

// Show network
const NetworksGetInputSchema = z.object({
	id: z.number().int(),
	count_network_ips: z.boolean().optional(),
});
export type NetworksGetInput = z.infer<typeof NetworksGetInputSchema>;

const NetworksGetResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksGetResponse = z.infer<typeof NetworksGetResponseSchema>;

// Update
const NetworksUpdateInputSchema = z.object({
	id: z.number().int(),
	network: Models.NetworkUpdateSchema,
});
export type NetworksUpdateInput = z.infer<typeof NetworksUpdateInputSchema>;

const NetworksUpdateResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksUpdateResponse = z.infer<
	typeof NetworksUpdateResponseSchema
>;

// Delete
const NetworksDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type NetworksDeleteInput = z.infer<typeof NetworksDeleteInputSchema>;

const NetworksDeleteResponseSchema = z.undefined();
export type NetworksDeleteResponse = z.infer<
	typeof NetworksDeleteResponseSchema
>;

// Bulk create
const NetworksBulkCreateInputSchema = z.object({
	Network: z
		.object({
			networks: z.array(Models.NetworkCreateSpecSchema).optional(),
		})
		.optional(),
});
export type NetworksBulkCreateInput = z.infer<
	typeof NetworksBulkCreateInputSchema
>;

const NetworksBulkCreateResponseSchema = z.object({
	id: z.string().optional(),
});
export type NetworksBulkCreateResponse = z.infer<
	typeof NetworksBulkCreateResponseSchema
>;

// Bulk create status
const NetworksBulkCreateStatusInputSchema = z.object({
	id: z.string(),
});
export type NetworksBulkCreateStatusInput = z.infer<
	typeof NetworksBulkCreateStatusInputSchema
>;

const NetworksBulkCreateStatusResponseSchema = z.object({
	total: z.number().int().optional(),
	successful: z.number().int().optional(),
	failed: z.number().int().optional(),
	skipped: z.number().int().optional(),
	failed_ids: z.string().optional(),
	skipped_ids: z.string().optional(),
	done: z.boolean().optional(),
});
export type NetworksBulkCreateStatusResponse = z.infer<
	typeof NetworksBulkCreateStatusResponseSchema
>;

// Bulk update
const NetworksBulkUpdateInputSchema = z.object({
	ids: z.string(),
	organization_id: z.number().int().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
	is_legacy_vpn_active: z.boolean().optional(),
});
export type NetworksBulkUpdateInput = z.infer<
	typeof NetworksBulkUpdateInputSchema
>;

const NetworksBulkUpdateResponseSchema = z.object({
	id: z.string().optional(),
});
export type NetworksBulkUpdateResponse = z.infer<
	typeof NetworksBulkUpdateResponseSchema
>;

// Bulk update status
const NetworksBulkUpdateStatusInputSchema = z.object({
	id: z.string(),
});
export type NetworksBulkUpdateStatusInput = z.infer<
	typeof NetworksBulkUpdateStatusInputSchema
>;

const NetworksBulkUpdateStatusResponseSchema = z.object({
	total: z.number().int().optional(),
	successful: z.number().int().optional(),
	failed: z.number().int().optional(),
	skipped: z.number().int().optional(),
	failed_ids: z.string().optional(),
	skipped_ids: z.string().optional(),
	done: z.boolean().optional(),
});
export type NetworksBulkUpdateStatusResponse = z.infer<
	typeof NetworksBulkUpdateStatusResponseSchema
>;

// Bulk Delete
const NetworksBulkDestroyInputSchema = z.object({
	ids: z.string(),
	organization_id: z.number().int().optional(),
});
export type NetworksBulkDestroyInput = z.infer<
	typeof NetworksBulkDestroyInputSchema
>;

const NetworksBulkDestroyResponseSchema = z.object({
	id: z.string().optional(),
});
export type NetworksBulkDestroyResponse = z.infer<
	typeof NetworksBulkDestroyResponseSchema
>;

// Bulk delete status
const NetworksBulkDestroyStatusInputSchema = z.object({
	id: z.string(),
});
export type NetworksBulkDestroyStatusInput = z.infer<
	typeof NetworksBulkDestroyStatusInputSchema
>;

const NetworksBulkDestroyStatusResponseSchema = z.object({
	total: z.number().int().optional(),
	successful: z.number().int().optional(),
	failed: z.number().int().optional(),
	skipped: z.number().int().optional(),
	failed_ids: z.string().optional(),
	skipped_ids: z.string().optional(),
	done: z.boolean().optional(),
});
export type NetworksBulkDestroyStatusResponse = z.infer<
	typeof NetworksBulkDestroyStatusResponseSchema
>;

// Create Key
const NetworksGenerateSecretKeyInputSchema = z.object({
	id: z.number().int(),
});
export type NetworksGenerateSecretKeyInput = z.infer<
	typeof NetworksGenerateSecretKeyInputSchema
>;

const NetworksGenerateSecretKeyResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksGenerateSecretKeyResponse = z.infer<
	typeof NetworksGenerateSecretKeyResponseSchema
>;

// Delete Key
const NetworksRevokeSecretKeyInputSchema = z.object({
	id: z.number().int(),
});
export type NetworksRevokeSecretKeyInput = z.infer<
	typeof NetworksRevokeSecretKeyInputSchema
>;

const NetworksRevokeSecretKeyResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksRevokeSecretKeyResponse = z.infer<
	typeof NetworksRevokeSecretKeyResponseSchema
>;

// Rotate key
const NetworksRotateSecretKeyInputSchema = z.object({
	id: z.number().int(),
});
export type NetworksRotateSecretKeyInput = z.infer<
	typeof NetworksRotateSecretKeyInputSchema
>;

const NetworksRotateSecretKeyResponseSchema = z.object({
	data: Models.NetworkSpecSchema.optional(),
});
export type NetworksRotateSecretKeyResponse = z.infer<
	typeof NetworksRotateSecretKeyResponseSchema
>;

// Get
const OrganizationUsersListInputSchema = z.object({
	organization_id: z.number().int(),
	include_auth_providers: z.boolean().optional(),
});
export type OrganizationUsersListInput = z.infer<
	typeof OrganizationUsersListInputSchema
>;

const OrganizationUsersListResponseSchema = z.object({
	users: z.array(Models.OrganizationUserSchema).optional(),
});
export type OrganizationUsersListResponse = z.infer<
	typeof OrganizationUsersListResponseSchema
>;

// Create
const OrganizationUsersCreateInputSchema = z.object({
	organization_id: z.number().int(),
	user: Models.OrganizationUserCreateSchema,
});
export type OrganizationUsersCreateInput = z.infer<
	typeof OrganizationUsersCreateInputSchema
>;

const OrganizationUsersCreateResponseSchema = z.object({
	user: Models.OrganizationUserSchema.optional(),
});
export type OrganizationUsersCreateResponse = z.infer<
	typeof OrganizationUsersCreateResponseSchema
>;

// Show user
const OrganizationUsersGetInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int(),
	include_auth_providers: z.boolean().optional(),
});
export type OrganizationUsersGetInput = z.infer<
	typeof OrganizationUsersGetInputSchema
>;

const OrganizationUsersGetResponseSchema = z.object({
	user: Models.OrganizationUserSchema.optional(),
});
export type OrganizationUsersGetResponse = z.infer<
	typeof OrganizationUsersGetResponseSchema
>;

// Update
const OrganizationUsersUpdateInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int(),
	user: Models.OrganizationUserCreateSchema,
});
export type OrganizationUsersUpdateInput = z.infer<
	typeof OrganizationUsersUpdateInputSchema
>;

const OrganizationUsersUpdateResponseSchema = z.object({
	user: Models.OrganizationUserSchema.optional(),
});
export type OrganizationUsersUpdateResponse = z.infer<
	typeof OrganizationUsersUpdateResponseSchema
>;

// Delete
const OrganizationUsersDeleteInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int(),
});
export type OrganizationUsersDeleteInput = z.infer<
	typeof OrganizationUsersDeleteInputSchema
>;

const OrganizationUsersDeleteResponseSchema = z.undefined();
export type OrganizationUsersDeleteResponse = z.infer<
	typeof OrganizationUsersDeleteResponseSchema
>;

// Resend Invite
const OrganizationUsersResendInviteInputSchema = z.object({
	id: z.number().int(),
	organization_id: z.number().int(),
});
export type OrganizationUsersResendInviteInput = z.infer<
	typeof OrganizationUsersResendInviteInputSchema
>;

const OrganizationUsersResendInviteResponseSchema = z.undefined();
export type OrganizationUsersResendInviteResponse = z.infer<
	typeof OrganizationUsersResendInviteResponseSchema
>;

// Get extant
const OrganizationsListInputSchema = z.object({
	basic_info: z.boolean().optional(),
	exclude_inherit_privacy_mode: z.boolean().optional(),
	managed_by_msp_id: z.number().int().optional(),
	name: z.string().optional(),
	owned_msp_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	pii_grid_search: z.string().optional(),
	type: z.enum(['normal', 'msp', 'sub_organization']).optional(),
});
export type OrganizationsListInput = z.infer<
	typeof OrganizationsListInputSchema
>;

const OrganizationsListResponseSchema = z.object({
	data: z.array(Models.OrganizationSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type OrganizationsListResponse = z.infer<
	typeof OrganizationsListResponseSchema
>;

// Create
const OrganizationsCreateInputSchema = z.object({
	organization: Models.OrganizationCreateSchema,
});
export type OrganizationsCreateInput = z.infer<
	typeof OrganizationsCreateInputSchema
>;

const OrganizationsCreateResponseSchema = z.object({
	data: Models.OrganizationSpecSchema.optional(),
});
export type OrganizationsCreateResponse = z.infer<
	typeof OrganizationsCreateResponseSchema
>;

// Get all
const OrganizationsListAllInputSchema = z.object({
	basic_info: z.boolean().optional(),
	managed_by_msp_id: z.number().int().optional(),
	name: z.string().optional(),
	owned_msp_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	type: z.enum(['normal', 'msp', 'sub_organization']).optional(),
});
export type OrganizationsListAllInput = z.infer<
	typeof OrganizationsListAllInputSchema
>;

const OrganizationsListAllResponseSchema = z.object({
	data: z.array(Models.OrganizationSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type OrganizationsListAllResponse = z.infer<
	typeof OrganizationsListAllResponseSchema
>;

// Show organization
const OrganizationsGetInputSchema = z.object({
	id: z.number().int(),
	include_current_mrr: z.boolean().optional(),
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsGetResponseSchema = z.object({
	data: Models.OrganizationSpecSchema.optional(),
});
export type OrganizationsGetResponse = z.infer<
	typeof OrganizationsGetResponseSchema
>;

// Update
const OrganizationsUpdateInputSchema = z.object({
	id: z.number().int(),
	organization: Models.OrganizationCreateSchema,
});
export type OrganizationsUpdateInput = z.infer<
	typeof OrganizationsUpdateInputSchema
>;

const OrganizationsUpdateResponseSchema = z.object({
	data: Models.OrganizationSpecSchema.optional(),
});
export type OrganizationsUpdateResponse = z.infer<
	typeof OrganizationsUpdateResponseSchema
>;

// Delete MSP
const OrganizationsDeleteInputSchema = z.object({
	id: z.number().int(),
	clear_subscription_info: z.boolean().optional(),
});
export type OrganizationsDeleteInput = z.infer<
	typeof OrganizationsDeleteInputSchema
>;

const OrganizationsDeleteResponseSchema = z.undefined();
export type OrganizationsDeleteResponse = z.infer<
	typeof OrganizationsDeleteResponseSchema
>;

// Get settings
const OrganizationsSettingsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.string().optional(),
});
export type OrganizationsSettingsInput = z.infer<
	typeof OrganizationsSettingsInputSchema
>;

const OrganizationsSettingsResponseSchema = z.object({
	data: Models.OrganizationSpecSchema.optional(),
});
export type OrganizationsSettingsResponse = z.infer<
	typeof OrganizationsSettingsResponseSchema
>;

// Bulk update
const OrganizationsBulkUpdateInputSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	msp_id: z.number().int().optional(),
	exclude_organization_ids: z.array(z.number().int()).optional(),
	send_uninstall_notifications_to_admin_users: z.boolean().optional(),
	user_agent_uninstall_notification: z.boolean().optional(),
	user_agent_uninstall_notification_recipient_emails: z
		.array(z.string())
		.optional(),
	user_agents_auto_update: z.boolean().optional(),
	vpn_settings_organization_attributes: z
		.object({
			vpn_settings_state_type_id: z.number().int().optional(),
		})
		.optional(),
});
export type OrganizationsBulkUpdateInput = z.infer<
	typeof OrganizationsBulkUpdateInputSchema
>;

const OrganizationsBulkUpdateResponseSchema = z.object({
	success: z.boolean().optional(),
});
export type OrganizationsBulkUpdateResponse = z.infer<
	typeof OrganizationsBulkUpdateResponseSchema
>;

// Cancel
const OrganizationsCancelInputSchema = z.object({
	id: z.number().int(),
});
export type OrganizationsCancelInput = z.infer<
	typeof OrganizationsCancelInputSchema
>;

const OrganizationsCancelResponseSchema = z.undefined();
export type OrganizationsCancelResponse = z.infer<
	typeof OrganizationsCancelResponseSchema
>;

// Promote
const OrganizationsPromoteToMspInputSchema = z.object({
	plan: z.string().optional(),
	zapier_params: z.record(z.string(), z.unknown()).optional(),
});
export type OrganizationsPromoteToMspInput = z.infer<
	typeof OrganizationsPromoteToMspInputSchema
>;

const OrganizationsPromoteToMspResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type OrganizationsPromoteToMspResponse = z.infer<
	typeof OrganizationsPromoteToMspResponseSchema
>;

// Bulk add allow
const PoliciesBulkActionsAddAllowlistDomainsInputSchema = z.object({
	domains: z.array(z.string()).optional(),
	notes: z
		.object({
			string: z.string().optional(),
		})
		.optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PoliciesBulkActionsAddAllowlistDomainsInput = z.infer<
	typeof PoliciesBulkActionsAddAllowlistDomainsInputSchema
>;

const PoliciesBulkActionsAddAllowlistDomainsResponseSchema =
	Models.PolicyBulkActionsListDomainsResponseSchema;
export type PoliciesBulkActionsAddAllowlistDomainsResponse = z.infer<
	typeof PoliciesBulkActionsAddAllowlistDomainsResponseSchema
>;

// Bulk delete allow
const PoliciesBulkActionsRemoveAllowlistDomainsInputSchema = z.object({
	domains: z.array(z.string()).optional(),
	notes: z
		.object({
			string: z.string().optional(),
		})
		.optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PoliciesBulkActionsRemoveAllowlistDomainsInput = z.infer<
	typeof PoliciesBulkActionsRemoveAllowlistDomainsInputSchema
>;

const PoliciesBulkActionsRemoveAllowlistDomainsResponseSchema =
	Models.PolicyBulkActionsListDomainsResponseSchema;
export type PoliciesBulkActionsRemoveAllowlistDomainsResponse = z.infer<
	typeof PoliciesBulkActionsRemoveAllowlistDomainsResponseSchema
>;

// Bulk add block
const PoliciesBulkActionsAddBlocklistDomainsInputSchema = z.object({
	domains: z.array(z.string()).optional(),
	notes: z
		.object({
			string: z.string().optional(),
		})
		.optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PoliciesBulkActionsAddBlocklistDomainsInput = z.infer<
	typeof PoliciesBulkActionsAddBlocklistDomainsInputSchema
>;

const PoliciesBulkActionsAddBlocklistDomainsResponseSchema =
	Models.PolicyBulkActionsListDomainsResponseSchema;
export type PoliciesBulkActionsAddBlocklistDomainsResponse = z.infer<
	typeof PoliciesBulkActionsAddBlocklistDomainsResponseSchema
>;

// Bulk delete block
const PoliciesBulkActionsRemoveBlocklistDomainsInputSchema = z.object({
	domains: z.array(z.string()).optional(),
	notes: z
		.object({
			string: z.string().optional(),
		})
		.optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PoliciesBulkActionsRemoveBlocklistDomainsInput = z.infer<
	typeof PoliciesBulkActionsRemoveBlocklistDomainsInputSchema
>;

const PoliciesBulkActionsRemoveBlocklistDomainsResponseSchema =
	Models.PolicyBulkActionsListDomainsResponseSchema;
export type PoliciesBulkActionsRemoveBlocklistDomainsResponse = z.infer<
	typeof PoliciesBulkActionsRemoveBlocklistDomainsResponseSchema
>;

// Get extant
const PoliciesListInputSchema = z.object({
	include_global_policies: z.boolean().optional(),
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type PoliciesListInput = z.infer<typeof PoliciesListInputSchema>;

const PoliciesListResponseSchema = z.object({
	data: z.array(Models.PolicySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type PoliciesListResponse = z.infer<typeof PoliciesListResponseSchema>;

// Create
const PoliciesCreateInputSchema = z.object({
	policy: Models.PolicyCreateSchema,
	include_relationships: z.boolean().optional(),
	append_domains: z.boolean().optional(),
});
export type PoliciesCreateInput = z.infer<typeof PoliciesCreateInputSchema>;

const PoliciesCreateResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesCreateResponse = z.infer<
	typeof PoliciesCreateResponseSchema
>;

// Get all
const PoliciesListAllInputSchema = z.object({
	include_global_policies: z.boolean().optional(),
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type PoliciesListAllInput = z.infer<typeof PoliciesListAllInputSchema>;

const PoliciesListAllResponseSchema = z.object({
	data: z.array(Models.PolicySpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type PoliciesListAllResponse = z.infer<
	typeof PoliciesListAllResponseSchema
>;

// Show policy
const PoliciesGetInputSchema = z.object({
	id: z.number().int(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesGetInput = z.infer<typeof PoliciesGetInputSchema>;

const PoliciesGetResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesGetResponse = z.infer<typeof PoliciesGetResponseSchema>;

// Update
const PoliciesUpdateInputSchema = z.object({
	id: z.number().int(),
	policy: Models.PolicyCreateSchema,
	include_relationships: z.boolean().optional(),
	append_domains: z.boolean().optional(),
});
export type PoliciesUpdateInput = z.infer<typeof PoliciesUpdateInputSchema>;

const PoliciesUpdateResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesUpdateResponse = z.infer<
	typeof PoliciesUpdateResponseSchema
>;

// Delete
const PoliciesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type PoliciesDeleteInput = z.infer<typeof PoliciesDeleteInputSchema>;

const PoliciesDeleteResponseSchema = z.undefined();
export type PoliciesDeleteResponse = z.infer<
	typeof PoliciesDeleteResponseSchema
>;

// Get application
const PoliciesApplicationInputSchema = z.object({
	application_id: z.number().int().optional(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PoliciesApplicationInput = z.infer<
	typeof PoliciesApplicationInputSchema
>;

const PoliciesApplicationResponseSchema = z.object({
	data: Models.PolicyApplicationSpecSchema.optional(),
});
export type PoliciesApplicationResponse = z.infer<
	typeof PoliciesApplicationResponseSchema
>;

// Update application
const PoliciesApplicationUpdateInputSchema = z.object({
	allow_policies: z.array(z.number().int()).optional(),
	application_id: z.number().int().optional(),
	block_policies: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
});
export type PoliciesApplicationUpdateInput = z.infer<
	typeof PoliciesApplicationUpdateInputSchema
>;

const PoliciesApplicationUpdateResponseSchema = z.object({
	data: Models.PolicyApplicationSpecSchema.optional(),
});
export type PoliciesApplicationUpdateResponse = z.infer<
	typeof PoliciesApplicationUpdateResponseSchema
>;

// Add block domain
const PoliciesAddBlacklistDomainInputSchema = z.object({
	id: z.number().int(),
	domain: z.string(),
	note: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesAddBlacklistDomainInput = z.infer<
	typeof PoliciesAddBlacklistDomainInputSchema
>;

const PoliciesAddBlacklistDomainResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesAddBlacklistDomainResponse = z.infer<
	typeof PoliciesAddBlacklistDomainResponseSchema
>;

// Remove block domain
const PoliciesRemoveBlacklistDomainInputSchema = z.object({
	id: z.number().int(),
	domain: z.string(),
	note: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesRemoveBlacklistDomainInput = z.infer<
	typeof PoliciesRemoveBlacklistDomainInputSchema
>;

const PoliciesRemoveBlacklistDomainResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesRemoveBlacklistDomainResponse = z.infer<
	typeof PoliciesRemoveBlacklistDomainResponseSchema
>;

// Add allow domain
const PoliciesAddWhitelistDomainInputSchema = z.object({
	id: z.number().int(),
	domain: z.string(),
	note: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesAddWhitelistDomainInput = z.infer<
	typeof PoliciesAddWhitelistDomainInputSchema
>;

const PoliciesAddWhitelistDomainResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesAddWhitelistDomainResponse = z.infer<
	typeof PoliciesAddWhitelistDomainResponseSchema
>;

// Remove allow domain
const PoliciesRemoveWhitelistDomainInputSchema = z.object({
	id: z.number().int(),
	domain: z.string(),
	note: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesRemoveWhitelistDomainInput = z.infer<
	typeof PoliciesRemoveWhitelistDomainInputSchema
>;

const PoliciesRemoveWhitelistDomainResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesRemoveWhitelistDomainResponse = z.infer<
	typeof PoliciesRemoveWhitelistDomainResponseSchema
>;

// Add block category
const PoliciesAddBlacklistCategoryInputSchema = z.object({
	id: z.number().int(),
	category_id: z.number().int(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesAddBlacklistCategoryInput = z.infer<
	typeof PoliciesAddBlacklistCategoryInputSchema
>;

const PoliciesAddBlacklistCategoryResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesAddBlacklistCategoryResponse = z.infer<
	typeof PoliciesAddBlacklistCategoryResponseSchema
>;

// Remove block category
const PoliciesRemoveBlacklistCategoryInputSchema = z.object({
	id: z.number().int(),
	category_id: z.number().int(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesRemoveBlacklistCategoryInput = z.infer<
	typeof PoliciesRemoveBlacklistCategoryInputSchema
>;

const PoliciesRemoveBlacklistCategoryResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesRemoveBlacklistCategoryResponse = z.infer<
	typeof PoliciesRemoveBlacklistCategoryResponseSchema
>;

// Add allow category
const PoliciesAddAllowedApplicationInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesAddAllowedApplicationInput = z.infer<
	typeof PoliciesAddAllowedApplicationInputSchema
>;

const PoliciesAddAllowedApplicationResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesAddAllowedApplicationResponse = z.infer<
	typeof PoliciesAddAllowedApplicationResponseSchema
>;

// Remove allow category
const PoliciesRemoveAllowedApplicationInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesRemoveAllowedApplicationInput = z.infer<
	typeof PoliciesRemoveAllowedApplicationInputSchema
>;

const PoliciesRemoveAllowedApplicationResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesRemoveAllowedApplicationResponse = z.infer<
	typeof PoliciesRemoveAllowedApplicationResponseSchema
>;

// Add block application
const PoliciesAddBlockedApplicationInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesAddBlockedApplicationInput = z.infer<
	typeof PoliciesAddBlockedApplicationInputSchema
>;

const PoliciesAddBlockedApplicationResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesAddBlockedApplicationResponse = z.infer<
	typeof PoliciesAddBlockedApplicationResponseSchema
>;

// Remove block application
const PoliciesRemoveBlockedApplicationInputSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PoliciesRemoveBlockedApplicationInput = z.infer<
	typeof PoliciesRemoveBlockedApplicationInputSchema
>;

const PoliciesRemoveBlockedApplicationResponseSchema = z.object({
	data: Models.PolicySpecSchema.optional(),
});
export type PoliciesRemoveBlockedApplicationResponse = z.infer<
	typeof PoliciesRemoveBlockedApplicationResponseSchema
>;

// Get permissive mode
const PoliciesGetPermissiveModeInputSchema = z.object({
	id: z.number().int(),
});
export type PoliciesGetPermissiveModeInput = z.infer<
	typeof PoliciesGetPermissiveModeInputSchema
>;

const PoliciesGetPermissiveModeResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type PoliciesGetPermissiveModeResponse = z.infer<
	typeof PoliciesGetPermissiveModeResponseSchema
>;

// Update permissive mode
const PoliciesUpdatePermissiveModeInputSchema = z.object({
	id: z.number().int(),
	permissive_mode: z.boolean().optional(),
});
export type PoliciesUpdatePermissiveModeInput = z.infer<
	typeof PoliciesUpdatePermissiveModeInputSchema
>;

const PoliciesUpdatePermissiveModeResponseSchema = z.record(
	z.string(),
	z.unknown(),
);
export type PoliciesUpdatePermissiveModeResponse = z.infer<
	typeof PoliciesUpdatePermissiveModeResponseSchema
>;

// Get
const PolicyIpsListInputSchema = z.object({}).optional();
export type PolicyIpsListInput = z.infer<typeof PolicyIpsListInputSchema>;

const PolicyIpsListResponseSchema = z.object({
	data: z.array(Models.PolicyIpSpecSchema).optional(),
});
export type PolicyIpsListResponse = z.infer<typeof PolicyIpsListResponseSchema>;

// Show IP
const PolicyIpsGetInputSchema = z.object({
	id: z.number().int(),
});
export type PolicyIpsGetInput = z.infer<typeof PolicyIpsGetInputSchema>;

const PolicyIpsGetResponseSchema = z.object({
	data: Models.PolicyIpSpecSchema.optional(),
});
export type PolicyIpsGetResponse = z.infer<typeof PolicyIpsGetResponseSchema>;

// Create link
const PsaIntegrationsRedirectLinkInputSchema = z.object({
	organization_id: z.number().int().optional(),
	psa_name: z.string().optional(),
});
export type PsaIntegrationsRedirectLinkInput = z.infer<
	typeof PsaIntegrationsRedirectLinkInputSchema
>;

const PsaIntegrationsRedirectLinkResponseSchema = z.string();
export type PsaIntegrationsRedirectLinkResponse = z.infer<
	typeof PsaIntegrationsRedirectLinkResponseSchema
>;

// Get extant
const ScheduledPoliciesListInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type ScheduledPoliciesListInput = z.infer<
	typeof ScheduledPoliciesListInputSchema
>;

const ScheduledPoliciesListResponseSchema = z.array(
	Models.ScheduledPolicySchema,
);
export type ScheduledPoliciesListResponse = z.infer<
	typeof ScheduledPoliciesListResponseSchema
>;

// Create
const ScheduledPoliciesCreateInputSchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
	timezone: z.string().optional(),
});
export type ScheduledPoliciesCreateInput = z.infer<
	typeof ScheduledPoliciesCreateInputSchema
>;

const ScheduledPoliciesCreateResponseSchema = Models.ScheduledPolicySchema;
export type ScheduledPoliciesCreateResponse = z.infer<
	typeof ScheduledPoliciesCreateResponseSchema
>;

// Get all
const ScheduledPoliciesListAllInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type ScheduledPoliciesListAllInput = z.infer<
	typeof ScheduledPoliciesListAllInputSchema
>;

const ScheduledPoliciesListAllResponseSchema = z.array(
	Models.ScheduledPolicySchema,
);
export type ScheduledPoliciesListAllResponse = z.infer<
	typeof ScheduledPoliciesListAllResponseSchema
>;

// Show policy
const ScheduledPoliciesGetInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledPoliciesGetInput = z.infer<
	typeof ScheduledPoliciesGetInputSchema
>;

const ScheduledPoliciesGetResponseSchema = Models.ScheduledPolicySchema;
export type ScheduledPoliciesGetResponse = z.infer<
	typeof ScheduledPoliciesGetResponseSchema
>;

// Update
const ScheduledPoliciesUpdateInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
	timezone: z.string().optional(),
});
export type ScheduledPoliciesUpdateInput = z.infer<
	typeof ScheduledPoliciesUpdateInputSchema
>;

const ScheduledPoliciesUpdateResponseSchema = Models.ScheduledPolicySchema;
export type ScheduledPoliciesUpdateResponse = z.infer<
	typeof ScheduledPoliciesUpdateResponseSchema
>;

// Delete
const ScheduledPoliciesDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledPoliciesDeleteInput = z.infer<
	typeof ScheduledPoliciesDeleteInputSchema
>;

const ScheduledPoliciesDeleteResponseSchema = z.undefined();
export type ScheduledPoliciesDeleteResponse = z.infer<
	typeof ScheduledPoliciesDeleteResponseSchema
>;

// Show preview
const ScheduledReportPreviewsGetInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledReportPreviewsGetInput = z.infer<
	typeof ScheduledReportPreviewsGetInputSchema
>;

const ScheduledReportPreviewsGetResponseSchema = z.object({
	data: Models.ScheduledReportPreviewSpecSchema.optional(),
});
export type ScheduledReportPreviewsGetResponse = z.infer<
	typeof ScheduledReportPreviewsGetResponseSchema
>;

// Create
const ScheduledReportPreviewsCreateInputSchema = z.object({
	scheduled_report_preview:
		Models.ScheduledReportPreviewCreateSchema.optional(),
});
export type ScheduledReportPreviewsCreateInput = z.infer<
	typeof ScheduledReportPreviewsCreateInputSchema
>;

const ScheduledReportPreviewsCreateResponseSchema = z.object({
	data: Models.ScheduledReportPreviewSpecSchema.optional(),
});
export type ScheduledReportPreviewsCreateResponse = z.infer<
	typeof ScheduledReportPreviewsCreateResponseSchema
>;

// Get
const ScheduledReportsListInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type ScheduledReportsListInput = z.infer<
	typeof ScheduledReportsListInputSchema
>;

const ScheduledReportsListResponseSchema = z.object({
	data: z.array(Models.ScheduledReportSpecSchema).optional(),
});
export type ScheduledReportsListResponse = z.infer<
	typeof ScheduledReportsListResponseSchema
>;

// Create
const ScheduledReportsCreateInputSchema = z.object({
	scheduled_report: Models.ScheduledReportSchema.optional(),
});
export type ScheduledReportsCreateInput = z.infer<
	typeof ScheduledReportsCreateInputSchema
>;

const ScheduledReportsCreateResponseSchema = z.object({
	data: Models.ScheduledReportSpecSchema.optional(),
});
export type ScheduledReportsCreateResponse = z.infer<
	typeof ScheduledReportsCreateResponseSchema
>;

// Show report
const ScheduledReportsGetInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledReportsGetInput = z.infer<
	typeof ScheduledReportsGetInputSchema
>;

const ScheduledReportsGetResponseSchema = z.object({
	data: Models.ScheduledReportSpecSchema.optional(),
});
export type ScheduledReportsGetResponse = z.infer<
	typeof ScheduledReportsGetResponseSchema
>;

// Update
const ScheduledReportsUpdateInputSchema = z.object({
	id: z.number().int(),
	scheduled_report: Models.ScheduledReportSchema.optional(),
});
export type ScheduledReportsUpdateInput = z.infer<
	typeof ScheduledReportsUpdateInputSchema
>;

const ScheduledReportsUpdateResponseSchema = z.object({
	data: Models.ScheduledReportSpecSchema.optional(),
});
export type ScheduledReportsUpdateResponse = z.infer<
	typeof ScheduledReportsUpdateResponseSchema
>;

// Delete
const ScheduledReportsDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledReportsDeleteInput = z.infer<
	typeof ScheduledReportsDeleteInputSchema
>;

const ScheduledReportsDeleteResponseSchema = z.object({
	data: Models.ScheduledReportSpecSchema.optional(),
});
export type ScheduledReportsDeleteResponse = z.infer<
	typeof ScheduledReportsDeleteResponseSchema
>;

// Total requests/time
const TrafficReportsTotalRequestsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_networks: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalRequestsInput = z.infer<
	typeof TrafficReportsTotalRequestsInputSchema
>;

const TrafficReportsTotalRequestsResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsSchema.optional(),
});
export type TrafficReportsTotalRequestsResponse = z.infer<
	typeof TrafficReportsTotalRequestsResponseSchema
>;

// Total requests geo
const TrafficReportsTotalRequestsGeoInputSchema = z.object({
	from: z.string().optional(),
	limit: z.number().int().optional(),
	msp_id: z.number().int().optional(),
	organization_ids: z.string().optional(),
	to: z.string().optional(),
});
export type TrafficReportsTotalRequestsGeoInput = z.infer<
	typeof TrafficReportsTotalRequestsGeoInputSchema
>;

const TrafficReportsTotalRequestsGeoResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsGeoSchema.optional(),
});
export type TrafficReportsTotalRequestsGeoResponse = z.infer<
	typeof TrafficReportsTotalRequestsGeoResponseSchema
>;

// Total requests/organizations
const TrafficReportsTotalRequestsOrganizationsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_organizations: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalRequestsOrganizationsInput = z.infer<
	typeof TrafficReportsTotalRequestsOrganizationsInputSchema
>;

const TrafficReportsTotalRequestsOrganizationsResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsOrganizationsSchema.optional(),
});
export type TrafficReportsTotalRequestsOrganizationsResponse = z.infer<
	typeof TrafficReportsTotalRequestsOrganizationsResponseSchema
>;

// Total requests clients
const TrafficReportsTotalRequestsAgentsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_agents: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalRequestsAgentsInput = z.infer<
	typeof TrafficReportsTotalRequestsAgentsInputSchema
>;

const TrafficReportsTotalRequestsAgentsResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsAgentsSchema.optional(),
});
export type TrafficReportsTotalRequestsAgentsResponse = z.infer<
	typeof TrafficReportsTotalRequestsAgentsResponseSchema
>;

// Total requests users
const TrafficReportsTotalRequestsUsersInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_users: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalRequestsUsersInput = z.infer<
	typeof TrafficReportsTotalRequestsUsersInputSchema
>;

const TrafficReportsTotalRequestsUsersResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsUsersSchema.optional(),
});
export type TrafficReportsTotalRequestsUsersResponse = z.infer<
	typeof TrafficReportsTotalRequestsUsersResponseSchema
>;

// Total requests collections
const TrafficReportsTotalRequestsCollectionsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_collections: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalRequestsCollectionsInput = z.infer<
	typeof TrafficReportsTotalRequestsCollectionsInputSchema
>;

const TrafficReportsTotalRequestsCollectionsResponseSchema = z.object({
	data: Models.TrafficReportsTotalRequestsCollectionsResultSchema.optional(),
});
export type TrafficReportsTotalRequestsCollectionsResponse = z.infer<
	typeof TrafficReportsTotalRequestsCollectionsResponseSchema
>;

// Total threats/time
const TrafficReportsTotalThreatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	show_individual_networks: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalThreatsInput = z.infer<
	typeof TrafficReportsTotalThreatsInputSchema
>;

const TrafficReportsTotalThreatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalThreatsSchema.optional(),
});
export type TrafficReportsTotalThreatsResponse = z.infer<
	typeof TrafficReportsTotalThreatsResponseSchema
>;

// Total threats organizations
const TrafficReportsTotalThreatsOrganizationsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	show_individual_organizations: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalThreatsOrganizationsInput = z.infer<
	typeof TrafficReportsTotalThreatsOrganizationsInputSchema
>;

const TrafficReportsTotalThreatsOrganizationsResponseSchema = z.object({
	data: Models.TrafficReportsTotalThreatsOrganizationsSchema.optional(),
});
export type TrafficReportsTotalThreatsOrganizationsResponse = z.infer<
	typeof TrafficReportsTotalThreatsOrganizationsResponseSchema
>;

// Total threats users
const TrafficReportsTotalThreatsUsersInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	show_individual_users: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalThreatsUsersInput = z.infer<
	typeof TrafficReportsTotalThreatsUsersInputSchema
>;

const TrafficReportsTotalThreatsUsersResponseSchema = z.object({
	data: Models.TrafficReportsTotalThreatsUsersSchema.optional(),
});
export type TrafficReportsTotalThreatsUsersResponse = z.infer<
	typeof TrafficReportsTotalThreatsUsersResponseSchema
>;

// Total category requests
const TrafficReportsTotalCategoriesInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_networks: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalCategoriesInput = z.infer<
	typeof TrafficReportsTotalCategoriesInputSchema
>;

const TrafficReportsTotalCategoriesResponseSchema = z.object({
	data: Models.TrafficReportsTotalCategoriesSchema.optional(),
});
export type TrafficReportsTotalCategoriesResponse = z.infer<
	typeof TrafficReportsTotalCategoriesResponseSchema
>;

// Category reqs organizations
const TrafficReportsTotalCategoriesOrganizationsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_organizations: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalCategoriesOrganizationsInput = z.infer<
	typeof TrafficReportsTotalCategoriesOrganizationsInputSchema
>;

const TrafficReportsTotalCategoriesOrganizationsResponseSchema = z.object({
	data: Models.TrafficReportsTotalCategoriesOrganizationsSchema.optional(),
});
export type TrafficReportsTotalCategoriesOrganizationsResponse = z.infer<
	typeof TrafficReportsTotalCategoriesOrganizationsResponseSchema
>;

// Total domain reqs
const TrafficReportsTotalDomainsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	category_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_networks: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalDomainsInput = z.infer<
	typeof TrafficReportsTotalDomainsInputSchema
>;

const TrafficReportsTotalDomainsResponseSchema = z.object({
	data: Models.TrafficReportsTotalDomainsSchema.optional(),
});
export type TrafficReportsTotalDomainsResponse = z.infer<
	typeof TrafficReportsTotalDomainsResponseSchema
>;

// Domain reqs organizations
const TrafficReportsTotalDomainsOrganizationsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	category_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_organizations: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalDomainsOrganizationsInput = z.infer<
	typeof TrafficReportsTotalDomainsOrganizationsInputSchema
>;

const TrafficReportsTotalDomainsOrganizationsResponseSchema = z.object({
	data: Models.TrafficReportsTotalDomainsOrganizationsSchema.optional(),
});
export type TrafficReportsTotalDomainsOrganizationsResponse = z.infer<
	typeof TrafficReportsTotalDomainsOrganizationsResponseSchema
>;

// Domain reqs users
const TrafficReportsTotalDomainsUsersInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	category_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_users: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalDomainsUsersInput = z.infer<
	typeof TrafficReportsTotalDomainsUsersInputSchema
>;

const TrafficReportsTotalDomainsUsersResponseSchema = z.object({
	data: Models.TrafficReportsTotalDomainsUsersSchema.optional(),
});
export type TrafficReportsTotalDomainsUsersResponse = z.infer<
	typeof TrafficReportsTotalDomainsUsersResponseSchema
>;

// Queries per second
const TrafficReportsQpsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	show_individual_networks: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsQpsInput = z.infer<
	typeof TrafficReportsQpsInputSchema
>;

const TrafficReportsQpsResponseSchema = z.object({
	data: Models.TrafficReportsQpsSchema.optional(),
});
export type TrafficReportsQpsResponse = z.infer<
	typeof TrafficReportsQpsResponseSchema
>;

// QPS organizations
const TrafficReportsQpsActiveOrganizationsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z.enum(['all', 'agents', 'proxies']).optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsQpsActiveOrganizationsInput = z.infer<
	typeof TrafficReportsQpsActiveOrganizationsInputSchema
>;

const TrafficReportsQpsActiveOrganizationsResponseSchema = z.object({
	data: Models.TrafficReportsQpsActiveOrganizationsSchema.optional(),
});
export type TrafficReportsQpsActiveOrganizationsResponse = z.infer<
	typeof TrafficReportsQpsActiveOrganizationsResponseSchema
>;

// QPS clients
const TrafficReportsQpsActiveAgentsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z.enum(['all', 'agents', 'proxies']).optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsQpsActiveAgentsInput = z.infer<
	typeof TrafficReportsQpsActiveAgentsInputSchema
>;

const TrafficReportsQpsActiveAgentsResponseSchema = z.object({
	data: Models.TrafficReportsQpsActiveAgentsSchema.optional(),
});
export type TrafficReportsQpsActiveAgentsResponse = z.infer<
	typeof TrafficReportsQpsActiveAgentsResponseSchema
>;

// Top domains
const TrafficReportsTopDomainsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	category_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	fqdn: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.enum(['all', 'true', 'false']).optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopDomainsInput = z.infer<
	typeof TrafficReportsTopDomainsInputSchema
>;

const TrafficReportsTopDomainsResponseSchema = z.object({
	data: Models.TrafficReportsTopDomainsSchema.optional(),
});
export type TrafficReportsTopDomainsResponse = z.infer<
	typeof TrafficReportsTopDomainsResponseSchema
>;

// Top categories
const TrafficReportsTopCategoriesInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.enum(['all', 'true', 'false']).optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopCategoriesInput = z.infer<
	typeof TrafficReportsTopCategoriesInputSchema
>;

const TrafficReportsTopCategoriesResponseSchema = z.object({
	data: Models.TrafficReportsTopCategoriesSchema.optional(),
});
export type TrafficReportsTopCategoriesResponse = z.infer<
	typeof TrafficReportsTopCategoriesResponseSchema
>;

// Top application categories
const TrafficReportsTopApplicationCategoriesInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.enum(['all', 'true', 'false']).optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopApplicationCategoriesInput = z.infer<
	typeof TrafficReportsTopApplicationCategoriesInputSchema
>;

const TrafficReportsTopApplicationCategoriesResponseSchema = z.object({
	data: Models.TrafficReportsTopCategoriesSchema.optional(),
});
export type TrafficReportsTopApplicationCategoriesResponse = z.infer<
	typeof TrafficReportsTopApplicationCategoriesResponseSchema
>;

// Top networks
const TrafficReportsTopNetworksInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopNetworksInput = z.infer<
	typeof TrafficReportsTopNetworksInputSchema
>;

const TrafficReportsTopNetworksResponseSchema = z.object({
	data: Models.TrafficReportsTopNetworksSchema.optional(),
});
export type TrafficReportsTopNetworksResponse = z.infer<
	typeof TrafficReportsTopNetworksResponseSchema
>;

// Top agents
const TrafficReportsTopAgentsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopAgentsInput = z.infer<
	typeof TrafficReportsTopAgentsInputSchema
>;

const TrafficReportsTopAgentsResponseSchema = z.object({
	data: Models.TrafficReportsTopAgentsSchema.optional(),
});
export type TrafficReportsTopAgentsResponse = z.infer<
	typeof TrafficReportsTopAgentsResponseSchema
>;

// Top users
const TrafficReportsTopUsersInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopUsersInput = z.infer<
	typeof TrafficReportsTopUsersInputSchema
>;

const TrafficReportsTopUsersResponseSchema = z.object({
	data: Models.TrafficReportsTopUsersSchema.optional(),
});
export type TrafficReportsTopUsersResponse = z.infer<
	typeof TrafficReportsTopUsersResponseSchema
>;

// Top collections
const TrafficReportsTopCollectionsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTopCollectionsInput = z.infer<
	typeof TrafficReportsTopCollectionsInputSchema
>;

const TrafficReportsTopCollectionsResponseSchema = z.object({
	data: Models.TrafficReportsTopCollectionsSchema.optional(),
});
export type TrafficReportsTopCollectionsResponse = z.infer<
	typeof TrafficReportsTopCollectionsResponseSchema
>;

// Query Logs
const TrafficReportsQueryLogsInputSchema = z.object({
	agent_id: z.string().optional(),
	agent_ids: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	category_ids: z.string().optional(),
	collection_id: z.number().int().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	exclude_category_ids: z.string().optional(),
	exclude_domain: z.string().optional(),
	fqdn: z.string().optional(),
	from: z.string().optional(),
	mac_addresses: z.string().optional(),
	nat_ips: z.string().optional(),
	network_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
	page: z
		.union([
			Models.TrafficReportsPaginationRequestSchema,
			Models.TrafficReportsCursorPaginationRequestSchema,
		])
		.optional(),
	policy_ids: z.string().optional(),
	private_ip: z.string().optional(),
	private_ip_from: z.string().optional(),
	private_ip_to: z.string().optional(),
	question_type: z.string().optional(),
	result: z.enum(['all', 'allowed', 'blocked']).optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	user_id: z.number().int().optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsQueryLogsInput = z.infer<
	typeof TrafficReportsQueryLogsInputSchema
>;

const TrafficReportsQueryLogsResponseSchema = z.object({
	data: Models.TrafficReportsQueryLogsSchema.optional(),
});
export type TrafficReportsQueryLogsResponse = z.infer<
	typeof TrafficReportsQueryLogsResponseSchema
>;

// Organization stats
const TrafficReportsTotalOrganizationsStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	security_report: z.boolean().optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalOrganizationsStatsInput = z.infer<
	typeof TrafficReportsTotalOrganizationsStatsInputSchema
>;

const TrafficReportsTotalOrganizationsStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalOrganizationsStatsSchema.optional(),
});
export type TrafficReportsTotalOrganizationsStatsResponse = z.infer<
	typeof TrafficReportsTotalOrganizationsStatsResponseSchema
>;

// Domain stats
const TrafficReportsTotalDomainStatsInputSchema = z.object({
	domain: z.string().optional(),
	fqdn: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
	to: z.string().optional(),
});
export type TrafficReportsTotalDomainStatsInput = z.infer<
	typeof TrafficReportsTotalDomainStatsInputSchema
>;

const TrafficReportsTotalDomainStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalDomainStatsSchema.optional(),
});
export type TrafficReportsTotalDomainStatsResponse = z.infer<
	typeof TrafficReportsTotalDomainStatsResponseSchema
>;

// Category stats
const TrafficReportsTotalCategoryStatsInputSchema = z.object({
	category_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
	to: z.string().optional(),
});
export type TrafficReportsTotalCategoryStatsInput = z.infer<
	typeof TrafficReportsTotalCategoryStatsInputSchema
>;

const TrafficReportsTotalCategoryStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalCategoryStatsSchema.optional(),
});
export type TrafficReportsTotalCategoryStatsResponse = z.infer<
	typeof TrafficReportsTotalCategoryStatsResponseSchema
>;

// Total Org Requests
const TrafficReportsTotalOrganizationsRequestsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_ids: z.string().optional(),
	bucket_size: z.string().optional(),
	category_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	domain: z.string().optional(),
	fqdn: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalOrganizationsRequestsInput = z.infer<
	typeof TrafficReportsTotalOrganizationsRequestsInputSchema
>;

const TrafficReportsTotalOrganizationsRequestsResponseSchema = z.object({
	data: Models.TrafficReportsTotalOrganizationsRequestsSchema.optional(),
});
export type TrafficReportsTotalOrganizationsRequestsResponse = z.infer<
	typeof TrafficReportsTotalOrganizationsRequestsResponseSchema
>;

// Top Organizations Requests
const TrafficReportsTopOrganizationsRequestsInputSchema = z.object({
	bucket_size: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	page: Models.TrafficReportsPaginationRequestSchema.optional(),
	to: z.string().optional(),
});
export type TrafficReportsTopOrganizationsRequestsInput = z.infer<
	typeof TrafficReportsTopOrganizationsRequestsInputSchema
>;

const TrafficReportsTopOrganizationsRequestsResponseSchema = z.object({
	data: Models.TrafficReportsTopOrganizationsRequestsSchema.optional(),
});
export type TrafficReportsTopOrganizationsRequestsResponse = z.infer<
	typeof TrafficReportsTopOrganizationsRequestsResponseSchema
>;

// Total client stats
const TrafficReportsTotalClientStatsInputSchema = z.object({
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
	to: z.string().optional(),
});
export type TrafficReportsTotalClientStatsInput = z.infer<
	typeof TrafficReportsTotalClientStatsInputSchema
>;

const TrafficReportsTotalClientStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalClientStatsSchema.optional(),
});
export type TrafficReportsTotalClientStatsResponse = z.infer<
	typeof TrafficReportsTotalClientStatsResponseSchema
>;

// Deployments
const TrafficReportsTotalDeploymentsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	network_ids: z.string().optional(),
	organization_id: z.number().int().optional(),
});
export type TrafficReportsTotalDeploymentsInput = z.infer<
	typeof TrafficReportsTotalDeploymentsInputSchema
>;

const TrafficReportsTotalDeploymentsResponseSchema = z.object({
	data: Models.TrafficReportsTotalDeploymentsSchema.optional(),
});
export type TrafficReportsTotalDeploymentsResponse = z.infer<
	typeof TrafficReportsTotalDeploymentsResponseSchema
>;

// Roaming clients
const TrafficReportsTotalRoamingClientsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
});
export type TrafficReportsTotalRoamingClientsInput = z.infer<
	typeof TrafficReportsTotalRoamingClientsInputSchema
>;

const TrafficReportsTotalRoamingClientsResponseSchema = z.object({
	data: Models.TrafficReportsTotalRoamingClientsSchema.optional(),
});
export type TrafficReportsTotalRoamingClientsResponse = z.infer<
	typeof TrafficReportsTotalRoamingClientsResponseSchema
>;

// Application requests
const TrafficReportsTotalApplicationsStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalApplicationsStatsInput = z.infer<
	typeof TrafficReportsTotalApplicationsStatsInputSchema
>;

const TrafficReportsTotalApplicationsStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalApplicationsStatsSchema.optional(),
});
export type TrafficReportsTotalApplicationsStatsResponse = z.infer<
	typeof TrafficReportsTotalApplicationsStatsResponseSchema
>;

// Applications reqs networks
const TrafficReportsTotalApplicationsNetworksStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalApplicationsNetworksStatsInput = z.infer<
	typeof TrafficReportsTotalApplicationsNetworksStatsInputSchema
>;

const TrafficReportsTotalApplicationsNetworksStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalApplicationsNetworksStatsSchema.optional(),
});
export type TrafficReportsTotalApplicationsNetworksStatsResponse = z.infer<
	typeof TrafficReportsTotalApplicationsNetworksStatsResponseSchema
>;

// Application reqs clients
const TrafficReportsTotalApplicationsAgentsStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalApplicationsAgentsStatsInput = z.infer<
	typeof TrafficReportsTotalApplicationsAgentsStatsInputSchema
>;

const TrafficReportsTotalApplicationsAgentsStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalApplicationsAgentsStatsSchema.optional(),
});
export type TrafficReportsTotalApplicationsAgentsStatsResponse = z.infer<
	typeof TrafficReportsTotalApplicationsAgentsStatsResponseSchema
>;

// Application reqs users
const TrafficReportsTotalApplicationsUsersStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalApplicationsUsersStatsInput = z.infer<
	typeof TrafficReportsTotalApplicationsUsersStatsInputSchema
>;

const TrafficReportsTotalApplicationsUsersStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalApplicationsUsersStatsSchema.optional(),
});
export type TrafficReportsTotalApplicationsUsersStatsResponse = z.infer<
	typeof TrafficReportsTotalApplicationsUsersStatsResponseSchema
>;

// Application reqs collections
const TrafficReportsTotalApplicationsCollectionsStatsInputSchema = z.object({
	agent_ids: z.string().optional(),
	agent_types: z.string().optional(),
	application_category_ids: z.string().optional(),
	application_ids: z.string().optional(),
	collection_ids: z.string().optional(),
	from: z.string().optional(),
	name: z.string().optional(),
	network_ids: z.string().optional(),
	organization_ids: z.string().optional(),
	security_report: z.boolean().optional(),
	source: z
		.enum(['all', 'networks', 'agents', 'proxies', 'clientless'])
		.optional(),
	to: z.string().optional(),
	type: z.enum(['all', 'allowed', 'blocked']).optional(),
	user_ids: z.string().optional(),
});
export type TrafficReportsTotalApplicationsCollectionsStatsInput = z.infer<
	typeof TrafficReportsTotalApplicationsCollectionsStatsInputSchema
>;

const TrafficReportsTotalApplicationsCollectionsStatsResponseSchema = z.object({
	data: Models.TrafficReportsTotalApplicationsCollectionsStatsSchema.optional(),
});
export type TrafficReportsTotalApplicationsCollectionsStatsResponse = z.infer<
	typeof TrafficReportsTotalApplicationsCollectionsStatsResponseSchema
>;

// Create
const TrialsCreateInputSchema = z.object({
	organization_id: z.number().int().optional(),
	sku: z.string().optional(),
});
export type TrialsCreateInput = z.infer<typeof TrialsCreateInputSchema>;

const TrialsCreateResponseSchema = z.object({
	data: Models.TrialSpecSchema.optional(),
});
export type TrialsCreateResponse = z.infer<typeof TrialsCreateResponseSchema>;

// Create
const UserAgentBulkDeletesCreateInputSchema = z.object({
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	agent_version: z.string().optional(),
	block_page_id: z.number().int().optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	policy_id: z.number().int().optional(),
	policy_schedule: z.string().optional(),
	queue_uninstall: z.boolean().optional(),
	release_channels: z
		.object({
			value: z.string().optional(),
		})
		.optional(),
	scheduled_policy_id: z.number().int().optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
	ids: z.array(z.string()).optional(),
	exclude_ids: z.array(z.string()).optional(),
});
export type UserAgentBulkDeletesCreateInput = z.infer<
	typeof UserAgentBulkDeletesCreateInputSchema
>;

const UserAgentBulkDeletesCreateResponseSchema = z.object({
	data: Models.UserAgentBulkDeleteSchema.optional(),
});
export type UserAgentBulkDeletesCreateResponse = z.infer<
	typeof UserAgentBulkDeletesCreateResponseSchema
>;

// Show
const UserAgentBulkDeletesGetInputSchema = z.object({
	id: z.number().int(),
});
export type UserAgentBulkDeletesGetInput = z.infer<
	typeof UserAgentBulkDeletesGetInputSchema
>;

const UserAgentBulkDeletesGetResponseSchema = z.object({
	data: Models.UserAgentBulkDeleteSchema.optional(),
});
export type UserAgentBulkDeletesGetResponse = z.infer<
	typeof UserAgentBulkDeletesGetResponseSchema
>;

// Counts
const UserAgentBulkDeletesCountsInputSchema = z.object({
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
});
export type UserAgentBulkDeletesCountsInput = z.infer<
	typeof UserAgentBulkDeletesCountsInputSchema
>;

const UserAgentBulkDeletesCountsResponseSchema =
	Models.UserAgentBulkDeleteCountsSchema;
export type UserAgentBulkDeletesCountsResponse = z.infer<
	typeof UserAgentBulkDeletesCountsResponseSchema
>;

// Create
const UserAgentBulkUpdatesCreateInputSchema = z.object({
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	agent_version: z.string().optional(),
	block_page_id: z.number().int().optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	policy_id: z.number().int().optional(),
	policy_schedule: z.string().optional(),
	release_channels: z
		.object({
			value: z.string().optional(),
		})
		.optional(),
	scheduled_policy_id: z.number().int().optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
	ids: z.array(z.string()).optional(),
	exclude_ids: z.array(z.string()).optional(),
	changeset: Models.UserAgentBulkUpdateCreateChangesetSchema.optional(),
});
export type UserAgentBulkUpdatesCreateInput = z.infer<
	typeof UserAgentBulkUpdatesCreateInputSchema
>;

const UserAgentBulkUpdatesCreateResponseSchema = z.object({
	data: Models.UserAgentBulkUpdateSchema.optional(),
});
export type UserAgentBulkUpdatesCreateResponse = z.infer<
	typeof UserAgentBulkUpdatesCreateResponseSchema
>;

// Show
const UserAgentBulkUpdatesGetInputSchema = z.object({
	id: z.number().int(),
});
export type UserAgentBulkUpdatesGetInput = z.infer<
	typeof UserAgentBulkUpdatesGetInputSchema
>;

const UserAgentBulkUpdatesGetResponseSchema = z.object({
	data: Models.UserAgentBulkUpdateSchema.optional(),
});
export type UserAgentBulkUpdatesGetResponse = z.infer<
	typeof UserAgentBulkUpdatesGetResponseSchema
>;

// Check agent values
const UserAgentBulkUpdatesHasMixedInputSchema = z.object({
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_ids: z.array(z.number().int()).optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
	ids: z.array(z.string()).optional(),
});
export type UserAgentBulkUpdatesHasMixedInput = z.infer<
	typeof UserAgentBulkUpdatesHasMixedInputSchema
>;

const UserAgentBulkUpdatesHasMixedResponseSchema = z.object({
	data: Models.UserAgentBulkUpdateHasMixedSchema.optional(),
});
export type UserAgentBulkUpdatesHasMixedResponse = z.infer<
	typeof UserAgentBulkUpdatesHasMixedResponseSchema
>;

// Counts
const UserAgentBulkUpdatesCountsInputSchema = z.object({
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	block_page_id: z.number().int().optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
	policy_id: z.number().int().optional(),
	release_channels: z
		.object({
			value: z.string().optional(),
		})
		.optional(),
	scheduled_policy_id: z.number().int().optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
});
export type UserAgentBulkUpdatesCountsInput = z.infer<
	typeof UserAgentBulkUpdatesCountsInputSchema
>;

const UserAgentBulkUpdatesCountsResponseSchema =
	Models.UserAgentBulkDeleteCountsSchema;
export type UserAgentBulkUpdatesCountsResponse = z.infer<
	typeof UserAgentBulkUpdatesCountsResponseSchema
>;

// Create
const UserAgentCleanupsCreateInputSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()),
	inactive_for: z.number().int(),
});
export type UserAgentCleanupsCreateInput = z.infer<
	typeof UserAgentCleanupsCreateInputSchema
>;

const UserAgentCleanupsCreateResponseSchema = z.object({
	data: Models.UserAgentCleanupSchema.optional(),
});
export type UserAgentCleanupsCreateResponse = z.infer<
	typeof UserAgentCleanupsCreateResponseSchema
>;

// Show
const UserAgentCleanupsGetInputSchema = z.object({
	id: z.number().int(),
});
export type UserAgentCleanupsGetInput = z.infer<
	typeof UserAgentCleanupsGetInputSchema
>;

const UserAgentCleanupsGetResponseSchema = z.object({
	data: Models.UserAgentCleanupSchema.optional(),
});
export type UserAgentCleanupsGetResponse = z.infer<
	typeof UserAgentCleanupsGetResponseSchema
>;

// Update
const UserAgentCleanupsUpdateInputSchema = z.object({
	id: z.number().int(),
	start: z.boolean().optional(),
	inactive_for: z.number().int().optional(),
});
export type UserAgentCleanupsUpdateInput = z.infer<
	typeof UserAgentCleanupsUpdateInputSchema
>;

const UserAgentCleanupsUpdateResponseSchema = z.object({
	data: Models.UserAgentCleanupSchema.optional(),
});
export type UserAgentCleanupsUpdateResponse = z.infer<
	typeof UserAgentCleanupsUpdateResponseSchema
>;

// Get
const UserAgentReleasesListInputSchema = z.object({}).optional();
export type UserAgentReleasesListInput = z.infer<
	typeof UserAgentReleasesListInputSchema
>;

const UserAgentReleasesListResponseSchema = z.object({
	user_agent_releases: z.array(Models.UserAgentReleaseSchema).optional(),
});
export type UserAgentReleasesListResponse = z.infer<
	typeof UserAgentReleasesListResponseSchema
>;

// Get relay
const UserAgentReleasesRelayInputSchema = z.object({}).optional();
export type UserAgentReleasesRelayInput = z.infer<
	typeof UserAgentReleasesRelayInputSchema
>;

const UserAgentReleasesRelayResponseSchema = z.object({
	user_agent_releases: z.array(Models.UserAgentReleaseSchema).optional(),
});
export type UserAgentReleasesRelayResponse = z.infer<
	typeof UserAgentReleasesRelayResponseSchema
>;

// Get extant agents
const UserAgentsListInputSchema = z.object({
	agent_local_user_uuids: z.array(z.string()).optional(),
	agent_state: z
		.enum([
			'protected',
			'unprotected',
			'bypassed',
			'pending_uninstall',
			'uninstalled',
			'offline',
		])
		.optional(),
	agent_type: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	agent_version: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	auto_update: z.boolean().optional(),
	block_page_id: z.number().int().optional(),
	browser_extension_status: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	cybersight_enabled: z.boolean().optional(),
	cybersight_status: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	end_at: z.string().optional(),
	msp_id: z.number().int().optional(),
	name_search: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	network_ids: z.array(z.number().int()).optional(),
	new_agent_states: z.boolean().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	policy_id: z.number().int().optional(),
	policy_schedule: z.string().optional(),
	release_channels: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	scheduled_policy_id: z.number().int().optional(),
	search: z.string().optional(),
	sort: z.string().optional(),
	start_at: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	traffic_received_last_15_mins: z.boolean().optional(),
	type: z.enum(['proxy', 'agents']).optional(),
	vpn_mode: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	vpn_status: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
});
export type UserAgentsListInput = z.infer<typeof UserAgentsListInputSchema>;

const UserAgentsListResponseSchema = z.object({
	data: z.array(Models.UserAgentSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
	meta: z.record(z.string(), z.unknown()).optional(),
});
export type UserAgentsListResponse = z.infer<
	typeof UserAgentsListResponseSchema
>;

// Get all agents
const UserAgentsListAllInputSchema = z.object({
	agent_local_user_uuids: z.array(z.string()).optional(),
	cybersight_enabled: z.boolean().optional(),
	end_at: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_id: z.number().int().optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	search: z.string().optional(),
	sort: z.string().optional(),
	start_at: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	type: z.enum(['proxy', 'agents']).optional(),
});
export type UserAgentsListAllInput = z.infer<
	typeof UserAgentsListAllInputSchema
>;

const UserAgentsListAllResponseSchema = z.object({
	data: z.array(Models.UserAgentSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type UserAgentsListAllResponse = z.infer<
	typeof UserAgentsListAllResponseSchema
>;

// Counts
const UserAgentsCountsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	name_search: z.string().optional(),
	network_ids: z.array(z.number().int()).optional(),
	new_agent_states: z.boolean().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	release_channels: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	search: z.string().optional(),
	state: z.enum(['online', 'offline']).optional(),
	status: z.string().optional(),
	tags: z.array(z.string()).optional(),
	type: z.enum(['proxy', 'agents']).optional(),
});
export type UserAgentsCountsInput = z.infer<typeof UserAgentsCountsInputSchema>;

const UserAgentsCountsResponseSchema = Models.LegacyUserAgentCountsSchema;
export type UserAgentsCountsResponse = z.infer<
	typeof UserAgentsCountsResponseSchema
>;

// Show agent
const UserAgentsGetInputSchema = z.object({
	id: z.string(),
});
export type UserAgentsGetInput = z.infer<typeof UserAgentsGetInputSchema>;

const UserAgentsGetResponseSchema = z.object({
	data: Models.UserAgentSpecSchema.optional(),
});
export type UserAgentsGetResponse = z.infer<typeof UserAgentsGetResponseSchema>;

// Update
const UserAgentsUpdateInputSchema = z.object({
	id: z.string(),
	user_agent: Models.UserAgentPatchSchema,
});
export type UserAgentsUpdateInput = z.infer<typeof UserAgentsUpdateInputSchema>;

const UserAgentsUpdateResponseSchema = z.object({
	data: Models.UserAgentSpecSchema.optional(),
});
export type UserAgentsUpdateResponse = z.infer<
	typeof UserAgentsUpdateResponseSchema
>;

// Delete
const UserAgentsDeleteInputSchema = z.object({
	id: z.string(),
	clear_registry: z.boolean().optional(),
	queue_uninstall: z.boolean().optional(),
});
export type UserAgentsDeleteInput = z.infer<typeof UserAgentsDeleteInputSchema>;

const UserAgentsDeleteResponseSchema = z.undefined();
export type UserAgentsDeleteResponse = z.infer<
	typeof UserAgentsDeleteResponseSchema
>;

// Get tags
const UserAgentsTagsInputSchema = z.object({
	include_used_only: z.boolean().optional(),
	msp_id: z.number().int().optional(),
	network_ids: z.array(z.number().int()).optional(),
	organization_ids: z.array(z.number().int()).optional(),
});
export type UserAgentsTagsInput = z.infer<typeof UserAgentsTagsInputSchema>;

const UserAgentsTagsResponseSchema = z.object({
	data: z
		.object({
			tags: z.array(z.string()).optional(),
		})
		.optional(),
});
export type UserAgentsTagsResponse = z.infer<
	typeof UserAgentsTagsResponseSchema
>;

// Remove queue
const UserAgentsDequeueUninstallInputSchema = z.object({
	id: z.string().optional(),
});
export type UserAgentsDequeueUninstallInput = z.infer<
	typeof UserAgentsDequeueUninstallInputSchema
>;

const UserAgentsDequeueUninstallResponseSchema = z.object({
	success: z.boolean().optional(),
});
export type UserAgentsDequeueUninstallResponse = z.infer<
	typeof UserAgentsDequeueUninstallResponseSchema
>;

// PIN
const UserAgentsUninstallPinInputSchema = z.object({
	organization_id: z.number().int().optional(),
});
export type UserAgentsUninstallPinInput = z.infer<
	typeof UserAgentsUninstallPinInputSchema
>;

const UserAgentsUninstallPinResponseSchema = z.string();
export type UserAgentsUninstallPinResponse = z.infer<
	typeof UserAgentsUninstallPinResponseSchema
>;

// Get extant
const UsersListInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.object({
	data: z.array(Models.UserSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// Get all
const UsersListAllInputSchema = z.object({
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
});
export type UsersListAllInput = z.infer<typeof UsersListAllInputSchema>;

const UsersListAllResponseSchema = z.object({
	data: z.array(Models.UserSpecSchema).optional(),
	links: Models.LinksSchema.optional(),
});
export type UsersListAllResponse = z.infer<typeof UsersListAllResponseSchema>;

// Show user
const UsersGetInputSchema = z.object({
	id: z.union([z.number().int(), z.enum(['self'])]),
});
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = z.object({
	data: Models.UserSpecSchema.optional(),
});
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// Change password
const UsersChangePasswordInputSchema = z.object({
	new_password: z.string().optional(),
});
export type UsersChangePasswordInput = z.infer<
	typeof UsersChangePasswordInputSchema
>;

const UsersChangePasswordResponseSchema = z.object({
	message: z.string().optional(),
});
export type UsersChangePasswordResponse = z.infer<
	typeof UsersChangePasswordResponseSchema
>;

// Count users
const AgentLocalUsersV2CountsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	name: z.string().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	search: z.string().optional(),
});
export type AgentLocalUsersV2CountsInput = z.infer<
	typeof AgentLocalUsersV2CountsInputSchema
>;

const AgentLocalUsersV2CountsResponseSchema = z.object({
	all: z.number().int().optional(),
	user_policy_override: z.number().int().optional(),
	inherited_policy: z.number().int().optional(),
});
export type AgentLocalUsersV2CountsResponse = z.infer<
	typeof AgentLocalUsersV2CountsResponseSchema
>;

// Suppresses license warning
const CurrentUserOrgUiSettingsSuppressLicenseWarningInputSchema = z.object({
	body: z
		.object({
			organization_uuid: z.string().optional(),
		})
		.optional(),
});
export type CurrentUserOrgUiSettingsSuppressLicenseWarningInput = z.infer<
	typeof CurrentUserOrgUiSettingsSuppressLicenseWarningInputSchema
>;

const CurrentUserOrgUiSettingsSuppressLicenseWarningResponseSchema =
	Models.LicenseWarningSuppressionDataSchema;
export type CurrentUserOrgUiSettingsSuppressLicenseWarningResponse = z.infer<
	typeof CurrentUserOrgUiSettingsSuppressLicenseWarningResponseSchema
>;

// Get UI Settings
const CurrentUserUiSettingsGetInputSchema = z.object({}).optional();
export type CurrentUserUiSettingsGetInput = z.infer<
	typeof CurrentUserUiSettingsGetInputSchema
>;

const CurrentUserUiSettingsGetResponseSchema = Models.UserUiSettingSchema;
export type CurrentUserUiSettingsGetResponse = z.infer<
	typeof CurrentUserUiSettingsGetResponseSchema
>;

// Update UI Settings
const CurrentUserUiSettingsUpdateInputSchema = z.object({
	disable_license_warnings: z.boolean().optional(),
	user_uuid: z.string().optional(),
	theme_mode: z.string().optional(),
});
export type CurrentUserUiSettingsUpdateInput = z.infer<
	typeof CurrentUserUiSettingsUpdateInputSchema
>;

const CurrentUserUiSettingsUpdateResponseSchema = Models.UserUiSettingSchema;
export type CurrentUserUiSettingsUpdateResponse = z.infer<
	typeof CurrentUserUiSettingsUpdateResponseSchema
>;

// User's Dashboards
const DashboardsListInputSchema = z.object({}).optional();
export type DashboardsListInput = z.infer<typeof DashboardsListInputSchema>;

const DashboardsListResponseSchema = z.array(Models.DashboardSchema);
export type DashboardsListResponse = z.infer<
	typeof DashboardsListResponseSchema
>;

// Create
const DashboardsCreateInputSchema = z.object({
	dashboard: Models.DashboardCreateSchema,
});
export type DashboardsCreateInput = z.infer<typeof DashboardsCreateInputSchema>;

const DashboardsCreateResponseSchema = Models.DashboardSchema;
export type DashboardsCreateResponse = z.infer<
	typeof DashboardsCreateResponseSchema
>;

// Available Dashboards
const DashboardsAvailableInputSchema = z.object({}).optional();
export type DashboardsAvailableInput = z.infer<
	typeof DashboardsAvailableInputSchema
>;

const DashboardsAvailableResponseSchema = z.array(Models.DashboardSchema);
export type DashboardsAvailableResponse = z.infer<
	typeof DashboardsAvailableResponseSchema
>;

// Owned Dashboards
const DashboardsOwnedInputSchema = z.object({}).optional();
export type DashboardsOwnedInput = z.infer<typeof DashboardsOwnedInputSchema>;

const DashboardsOwnedResponseSchema = z.array(Models.DashboardSchema);
export type DashboardsOwnedResponse = z.infer<
	typeof DashboardsOwnedResponseSchema
>;

// Update
const DashboardsUpdateInputSchema = z.object({
	id: z.number().int(),
	dashboard: Models.DashboardUpdateSchema,
});
export type DashboardsUpdateInput = z.infer<typeof DashboardsUpdateInputSchema>;

const DashboardsUpdateResponseSchema = Models.DashboardSchema;
export type DashboardsUpdateResponse = z.infer<
	typeof DashboardsUpdateResponseSchema
>;

// Delete
const DashboardsDeleteInputSchema = z.object({
	id: z.number().int(),
});
export type DashboardsDeleteInput = z.infer<typeof DashboardsDeleteInputSchema>;

const DashboardsDeleteResponseSchema = z.undefined();
export type DashboardsDeleteResponse = z.infer<
	typeof DashboardsDeleteResponseSchema
>;

// Make Public
const DashboardsMakePublicInputSchema = z.object({
	id: z.number().int(),
});
export type DashboardsMakePublicInput = z.infer<
	typeof DashboardsMakePublicInputSchema
>;

const DashboardsMakePublicResponseSchema = z.undefined();
export type DashboardsMakePublicResponse = z.infer<
	typeof DashboardsMakePublicResponseSchema
>;

// Make Private
const DashboardsMakePrivateInputSchema = z.object({
	id: z.number().int(),
});
export type DashboardsMakePrivateInput = z.infer<
	typeof DashboardsMakePrivateInputSchema
>;

const DashboardsMakePrivateResponseSchema = z.undefined();
export type DashboardsMakePrivateResponse = z.infer<
	typeof DashboardsMakePrivateResponseSchema
>;

// Link
const DashboardsLinkInputSchema = z.object({
	id: z.number().int(),
});
export type DashboardsLinkInput = z.infer<typeof DashboardsLinkInputSchema>;

const DashboardsLinkResponseSchema = z.undefined();
export type DashboardsLinkResponse = z.infer<
	typeof DashboardsLinkResponseSchema
>;

// Unlink
const DashboardsUnlinkInputSchema = z.object({
	id: z.number().int(),
});
export type DashboardsUnlinkInput = z.infer<typeof DashboardsUnlinkInputSchema>;

const DashboardsUnlinkResponseSchema = z.undefined();
export type DashboardsUnlinkResponse = z.infer<
	typeof DashboardsUnlinkResponseSchema
>;

// AI Applications
const DictionaryV2AiApplicationsInputSchema = z.object({}).optional();
export type DictionaryV2AiApplicationsInput = z.infer<
	typeof DictionaryV2AiApplicationsInputSchema
>;

const DictionaryV2AiApplicationsResponseSchema = z.array(z.string());
export type DictionaryV2AiApplicationsResponse = z.infer<
	typeof DictionaryV2AiApplicationsResponseSchema
>;

// CyberSight Activity Types
const DictionaryV2CyberSightActivityTypesInputSchema = z.object({}).optional();
export type DictionaryV2CyberSightActivityTypesInput = z.infer<
	typeof DictionaryV2CyberSightActivityTypesInputSchema
>;

const DictionaryV2CyberSightActivityTypesResponseSchema = z.array(
	Models.CyberSightActivityTypeSchema,
);
export type DictionaryV2CyberSightActivityTypesResponse = z.infer<
	typeof DictionaryV2CyberSightActivityTypesResponseSchema
>;

// VPN Settings State Types
const DictionaryV2VpnSettingsStateTypesInputSchema = z.object({}).optional();
export type DictionaryV2VpnSettingsStateTypesInput = z.infer<
	typeof DictionaryV2VpnSettingsStateTypesInputSchema
>;

const DictionaryV2VpnSettingsStateTypesResponseSchema = z.array(
	Models.VpnSettingsStateTypeSchema,
);
export type DictionaryV2VpnSettingsStateTypesResponse = z.infer<
	typeof DictionaryV2VpnSettingsStateTypesResponseSchema
>;

// List scheduled reports
const ScheduledReportsV2ListInputSchema = z.object({
	active: z.string().optional(),
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	search: z.string().optional(),
	sort: z.string().optional(),
});
export type ScheduledReportsV2ListInput = z.infer<
	typeof ScheduledReportsV2ListInputSchema
>;

const ScheduledReportsV2ListResponseSchema = z.object({
	data: z.array(Models.ScheduledReportV2IndexSpecSchema).optional(),
	meta: Models.ScheduledReportsV2MetaSpecSchema.optional(),
});
export type ScheduledReportsV2ListResponse = z.infer<
	typeof ScheduledReportsV2ListResponseSchema
>;

// Create scheduled report
const ScheduledReportsV2CreateInputSchema = z.object({
	scheduled_report: Models.ScheduledReportV2WriteSchema.optional(),
});
export type ScheduledReportsV2CreateInput = z.infer<
	typeof ScheduledReportsV2CreateInputSchema
>;

const ScheduledReportsV2CreateResponseSchema = z.object({
	data: Models.ScheduledReportV2ShowSpecSchema.optional(),
});
export type ScheduledReportsV2CreateResponse = z.infer<
	typeof ScheduledReportsV2CreateResponseSchema
>;

// Get scheduled report
const ScheduledReportsV2GetInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledReportsV2GetInput = z.infer<
	typeof ScheduledReportsV2GetInputSchema
>;

const ScheduledReportsV2GetResponseSchema = z.object({
	data: Models.ScheduledReportV2ShowSpecSchema.optional(),
});
export type ScheduledReportsV2GetResponse = z.infer<
	typeof ScheduledReportsV2GetResponseSchema
>;

// Update scheduled report
const ScheduledReportsV2UpdateInputSchema = z.object({
	id: z.number().int(),
	scheduled_report: Models.ScheduledReportV2WriteSchema.optional(),
});
export type ScheduledReportsV2UpdateInput = z.infer<
	typeof ScheduledReportsV2UpdateInputSchema
>;

const ScheduledReportsV2UpdateResponseSchema = z.object({
	data: Models.ScheduledReportV2ShowSpecSchema.optional(),
});
export type ScheduledReportsV2UpdateResponse = z.infer<
	typeof ScheduledReportsV2UpdateResponseSchema
>;

// Delete scheduled report
const ScheduledReportsV2DeleteInputSchema = z.object({
	id: z.number().int(),
});
export type ScheduledReportsV2DeleteInput = z.infer<
	typeof ScheduledReportsV2DeleteInputSchema
>;

const ScheduledReportsV2DeleteResponseSchema = z.object({
	data: Models.ScheduledReportV2ShowSpecSchema.optional(),
});
export type ScheduledReportsV2DeleteResponse = z.infer<
	typeof ScheduledReportsV2DeleteResponseSchema
>;

// Bulk update scheduled reports
const ScheduledReportsV2BulkUpdateInputSchema = z.object({
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	search: z.string().optional(),
	status: z.string().optional(),
	ids: z.array(z.number().int()).optional(),
	all: z.boolean().optional(),
	exclude_ids: z.array(z.number().int()).optional(),
	active: z.boolean().optional(),
});
export type ScheduledReportsV2BulkUpdateInput = z.infer<
	typeof ScheduledReportsV2BulkUpdateInputSchema
>;

const ScheduledReportsV2BulkUpdateResponseSchema = z.array(
	z.object({
		id: z.number().int().optional(),
		success: z.boolean().optional(),
	}),
);
export type ScheduledReportsV2BulkUpdateResponse = z.infer<
	typeof ScheduledReportsV2BulkUpdateResponseSchema
>;

// List unblock requests
const UnblockRequestsListInputSchema = z.object({
	actioned_by: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	category: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	deployment: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	deployment_type: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	domain: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	email: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	logged_in_user: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	msp_id: z.number().int().optional(),
	organization: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	page: z
		.object({
			number: z.number().int().optional(),
			size: z.number().int().optional(),
		})
		.optional(),
	policy: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	request_reason: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	resolved_date: z
		.object({
			value: z.record(z.string(), z.unknown()).optional(),
			operator: z.string().optional(),
		})
		.optional(),
	search: z.string().optional(),
	site: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	sort: z.string().optional(),
	status: z
		.object({
			value: z.string().optional(),
			operator: z.string().optional(),
		})
		.optional(),
	tab: z.string().optional(),
	time_of_attempt: z
		.object({
			value: z.record(z.string(), z.unknown()).optional(),
			operator: z.string().optional(),
		})
		.optional(),
});
export type UnblockRequestsListInput = z.infer<
	typeof UnblockRequestsListInputSchema
>;

const UnblockRequestsListResponseSchema = z.object({
	data: z.array(Models.UnblockRequestIndexSpecSchema).optional(),
	meta: Models.UnblockRequestsMetaSpecSchema.optional(),
});
export type UnblockRequestsListResponse = z.infer<
	typeof UnblockRequestsListResponseSchema
>;

// Unblock request tab counts
const UnblockRequestsCountsInputSchema = z.object({
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
});
export type UnblockRequestsCountsInput = z.infer<
	typeof UnblockRequestsCountsInputSchema
>;

const UnblockRequestsCountsResponseSchema = z.object({
	active: z.number().int().optional(),
	history: z.number().int().optional(),
});
export type UnblockRequestsCountsResponse = z.infer<
	typeof UnblockRequestsCountsResponseSchema
>;

// Pending count
const UnblockRequestsPendingCountInputSchema = z.object({
	msp_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
});
export type UnblockRequestsPendingCountInput = z.infer<
	typeof UnblockRequestsPendingCountInputSchema
>;

const UnblockRequestsPendingCountResponseSchema = z.object({
	count: z.number().int().optional(),
});
export type UnblockRequestsPendingCountResponse = z.infer<
	typeof UnblockRequestsPendingCountResponseSchema
>;

// Action drawer
const UnblockRequestsGetInputSchema = z.object({
	id: z.string(),
});
export type UnblockRequestsGetInput = z.infer<
	typeof UnblockRequestsGetInputSchema
>;

const UnblockRequestsGetResponseSchema = z.object({
	data: Models.UnblockRequestShowSpecSchema.optional(),
});
export type UnblockRequestsGetResponse = z.infer<
	typeof UnblockRequestsGetResponseSchema
>;

// Action a request (admin decision)
const UnblockRequestsDecisionInputSchema = z.object({
	id: z.string(),
	decision: z.enum([
		'allow',
		'allow-universal',
		'deny',
		'deny-and-ignore',
		'resolve-already-allowed',
	]),
	domains: z.array(z.string()).optional(),
	message: z.string().optional(),
	internal_notes: z.string().optional(),
});
export type UnblockRequestsDecisionInput = z.infer<
	typeof UnblockRequestsDecisionInputSchema
>;

const UnblockRequestsDecisionResponseSchema = z.object({
	data: Models.UnblockRequestDecisionSpecSchema.optional(),
});
export type UnblockRequestsDecisionResponse = z.infer<
	typeof UnblockRequestsDecisionResponseSchema
>;

// Update settings
const UserAgentsV2UpdateSettingsInputSchema = z.object({
	id: z.string(),
	user_agent: Models.UserAgentSettingsBodySchema.optional(),
});
export type UserAgentsV2UpdateSettingsInput = z.infer<
	typeof UserAgentsV2UpdateSettingsInputSchema
>;

const UserAgentsV2UpdateSettingsResponseSchema = z.object({
	id: z.string().optional(),
});
export type UserAgentsV2UpdateSettingsResponse = z.infer<
	typeof UserAgentsV2UpdateSettingsResponseSchema
>;

export const DnsfilterEndpointInputSchemas = {
	agentLocalUserBulkDeletesCreate: AgentLocalUserBulkDeletesCreateInputSchema,
	agentLocalUserBulkDeletesGet: AgentLocalUserBulkDeletesGetInputSchema,
	agentLocalUserBulkDeletesCounts: AgentLocalUserBulkDeletesCountsInputSchema,
	agentLocalUsersList: AgentLocalUsersListInputSchema,
	agentLocalUsersListAll: AgentLocalUsersListAllInputSchema,
	agentLocalUsersGet: AgentLocalUsersGetInputSchema,
	agentLocalUsersUpdate: AgentLocalUsersUpdateInputSchema,
	agentLocalUsersDelete: AgentLocalUsersDeleteInputSchema,
	apiKeysCreate: ApiKeysCreateInputSchema,
	apiKeysList: ApiKeysListInputSchema,
	apiKeysGet: ApiKeysGetInputSchema,
	apiKeysDelete: ApiKeysDeleteInputSchema,
	apiKeysRevoke: ApiKeysRevokeInputSchema,
	applicationCategoriesList: ApplicationCategoriesListInputSchema,
	applicationCategoriesGet: ApplicationCategoriesGetInputSchema,
	applicationsList: ApplicationsListInputSchema,
	applicationsListAll: ApplicationsListAllInputSchema,
	applicationsGet: ApplicationsGetInputSchema,
	billingsGet: BillingsGetInputSchema,
	billingsCreate: BillingsCreateInputSchema,
	billingsAddressShow: BillingsAddressShowInputSchema,
	billingsAddressUpdate: BillingsAddressUpdateInputSchema,
	blockPagesList: BlockPagesListInputSchema,
	blockPagesCreate: BlockPagesCreateInputSchema,
	blockPagesListAll: BlockPagesListAllInputSchema,
	blockPagesGet: BlockPagesGetInputSchema,
	blockPagesUpdate: BlockPagesUpdateInputSchema,
	blockPagesDelete: BlockPagesDeleteInputSchema,
	categoriesList: CategoriesListInputSchema,
	categoriesListAll: CategoriesListAllInputSchema,
	categoriesGet: CategoriesGetInputSchema,
	collectionUsersList: CollectionUsersListInputSchema,
	collectionUsersCreate: CollectionUsersCreateInputSchema,
	collectionUsersGet: CollectionUsersGetInputSchema,
	collectionUsersDelete: CollectionUsersDeleteInputSchema,
	currentUsersGet: CurrentUsersGetInputSchema,
	currentUsersUpdate: CurrentUsersUpdateInputSchema,
	dictionaryQpMethods: DictionaryQpMethodsInputSchema,
	domainNotesGet: DomainNotesGetInputSchema,
	domainNotesUpdate: DomainNotesUpdateInputSchema,
	domainNotesBatchUpdate: DomainNotesBatchUpdateInputSchema,
	domainNotesDelete: DomainNotesDeleteInputSchema,
	domainNotesBatchDestroy: DomainNotesBatchDestroyInputSchema,
	domainsUserLookup: DomainsUserLookupInputSchema,
	domainsBulkLookup: DomainsBulkLookupInputSchema,
	domainsSuggestThreat: DomainsSuggestThreatInputSchema,
	enterpriseConnectionsList: EnterpriseConnectionsListInputSchema,
	enterpriseConnectionsCreate: EnterpriseConnectionsCreateInputSchema,
	enterpriseConnectionsGet: EnterpriseConnectionsGetInputSchema,
	enterpriseConnectionsUpdate: EnterpriseConnectionsUpdateInputSchema,
	enterpriseConnectionsDelete: EnterpriseConnectionsDeleteInputSchema,
	invoicesCurrent: InvoicesCurrentInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	ipAddressesList: IpAddressesListInputSchema,
	ipAddressesCreate: IpAddressesCreateInputSchema,
	ipAddressesListAll: IpAddressesListAllInputSchema,
	ipAddressesGet: IpAddressesGetInputSchema,
	ipAddressesUpdate: IpAddressesUpdateInputSchema,
	ipAddressesDelete: IpAddressesDeleteInputSchema,
	ipAddressesVerify: IpAddressesVerifyInputSchema,
	ipAddressesMyip: IpAddressesMyipInputSchema,
	macAddressesList: MacAddressesListInputSchema,
	macAddressesCreate: MacAddressesCreateInputSchema,
	macAddressesListAll: MacAddressesListAllInputSchema,
	macAddressesGet: MacAddressesGetInputSchema,
	macAddressesUpdate: MacAddressesUpdateInputSchema,
	macAddressesDelete: MacAddressesDeleteInputSchema,
	metricsOrganizationUsage: MetricsOrganizationUsageInputSchema,
	metricsOrganizationUsageDetailed: MetricsOrganizationUsageDetailedInputSchema,
	networkLanIpsList: NetworkLanIpsListInputSchema,
	networkLanIpsGet: NetworkLanIpsGetInputSchema,
	networkLanIpsUpdate: NetworkLanIpsUpdateInputSchema,
	networkSubnetsListAll: NetworkSubnetsListAllInputSchema,
	networkSubnetsList: NetworkSubnetsListInputSchema,
	networkSubnetsCreate: NetworkSubnetsCreateInputSchema,
	networkSubnetsGet: NetworkSubnetsGetInputSchema,
	networkSubnetsUpdate: NetworkSubnetsUpdateInputSchema,
	networkSubnetsDelete: NetworkSubnetsDeleteInputSchema,
	networksList: NetworksListInputSchema,
	networksCreate: NetworksCreateInputSchema,
	networksListAll: NetworksListAllInputSchema,
	networksCounts: NetworksCountsInputSchema,
	networksMsp: NetworksMspInputSchema,
	networksMspAll: NetworksMspAllInputSchema,
	networksGeo: NetworksGeoInputSchema,
	networksLookup: NetworksLookupInputSchema,
	networksGet: NetworksGetInputSchema,
	networksUpdate: NetworksUpdateInputSchema,
	networksDelete: NetworksDeleteInputSchema,
	networksBulkCreate: NetworksBulkCreateInputSchema,
	networksBulkCreateStatus: NetworksBulkCreateStatusInputSchema,
	networksBulkUpdate: NetworksBulkUpdateInputSchema,
	networksBulkUpdateStatus: NetworksBulkUpdateStatusInputSchema,
	networksBulkDestroy: NetworksBulkDestroyInputSchema,
	networksBulkDestroyStatus: NetworksBulkDestroyStatusInputSchema,
	networksGenerateSecretKey: NetworksGenerateSecretKeyInputSchema,
	networksRevokeSecretKey: NetworksRevokeSecretKeyInputSchema,
	networksRotateSecretKey: NetworksRotateSecretKeyInputSchema,
	organizationUsersList: OrganizationUsersListInputSchema,
	organizationUsersCreate: OrganizationUsersCreateInputSchema,
	organizationUsersGet: OrganizationUsersGetInputSchema,
	organizationUsersUpdate: OrganizationUsersUpdateInputSchema,
	organizationUsersDelete: OrganizationUsersDeleteInputSchema,
	organizationUsersResendInvite: OrganizationUsersResendInviteInputSchema,
	organizationsList: OrganizationsListInputSchema,
	organizationsCreate: OrganizationsCreateInputSchema,
	organizationsListAll: OrganizationsListAllInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsUpdate: OrganizationsUpdateInputSchema,
	organizationsDelete: OrganizationsDeleteInputSchema,
	organizationsSettings: OrganizationsSettingsInputSchema,
	organizationsBulkUpdate: OrganizationsBulkUpdateInputSchema,
	organizationsCancel: OrganizationsCancelInputSchema,
	organizationsPromoteToMsp: OrganizationsPromoteToMspInputSchema,
	policiesBulkActionsAddAllowlistDomains:
		PoliciesBulkActionsAddAllowlistDomainsInputSchema,
	policiesBulkActionsRemoveAllowlistDomains:
		PoliciesBulkActionsRemoveAllowlistDomainsInputSchema,
	policiesBulkActionsAddBlocklistDomains:
		PoliciesBulkActionsAddBlocklistDomainsInputSchema,
	policiesBulkActionsRemoveBlocklistDomains:
		PoliciesBulkActionsRemoveBlocklistDomainsInputSchema,
	policiesList: PoliciesListInputSchema,
	policiesCreate: PoliciesCreateInputSchema,
	policiesListAll: PoliciesListAllInputSchema,
	policiesGet: PoliciesGetInputSchema,
	policiesUpdate: PoliciesUpdateInputSchema,
	policiesDelete: PoliciesDeleteInputSchema,
	policiesApplication: PoliciesApplicationInputSchema,
	policiesApplicationUpdate: PoliciesApplicationUpdateInputSchema,
	policiesAddBlacklistDomain: PoliciesAddBlacklistDomainInputSchema,
	policiesRemoveBlacklistDomain: PoliciesRemoveBlacklistDomainInputSchema,
	policiesAddWhitelistDomain: PoliciesAddWhitelistDomainInputSchema,
	policiesRemoveWhitelistDomain: PoliciesRemoveWhitelistDomainInputSchema,
	policiesAddBlacklistCategory: PoliciesAddBlacklistCategoryInputSchema,
	policiesRemoveBlacklistCategory: PoliciesRemoveBlacklistCategoryInputSchema,
	policiesAddAllowedApplication: PoliciesAddAllowedApplicationInputSchema,
	policiesRemoveAllowedApplication: PoliciesRemoveAllowedApplicationInputSchema,
	policiesAddBlockedApplication: PoliciesAddBlockedApplicationInputSchema,
	policiesRemoveBlockedApplication: PoliciesRemoveBlockedApplicationInputSchema,
	policiesGetPermissiveMode: PoliciesGetPermissiveModeInputSchema,
	policiesUpdatePermissiveMode: PoliciesUpdatePermissiveModeInputSchema,
	policyIpsList: PolicyIpsListInputSchema,
	policyIpsGet: PolicyIpsGetInputSchema,
	psaIntegrationsRedirectLink: PsaIntegrationsRedirectLinkInputSchema,
	scheduledPoliciesList: ScheduledPoliciesListInputSchema,
	scheduledPoliciesCreate: ScheduledPoliciesCreateInputSchema,
	scheduledPoliciesListAll: ScheduledPoliciesListAllInputSchema,
	scheduledPoliciesGet: ScheduledPoliciesGetInputSchema,
	scheduledPoliciesUpdate: ScheduledPoliciesUpdateInputSchema,
	scheduledPoliciesDelete: ScheduledPoliciesDeleteInputSchema,
	scheduledReportPreviewsGet: ScheduledReportPreviewsGetInputSchema,
	scheduledReportPreviewsCreate: ScheduledReportPreviewsCreateInputSchema,
	scheduledReportsList: ScheduledReportsListInputSchema,
	scheduledReportsCreate: ScheduledReportsCreateInputSchema,
	scheduledReportsGet: ScheduledReportsGetInputSchema,
	scheduledReportsUpdate: ScheduledReportsUpdateInputSchema,
	scheduledReportsDelete: ScheduledReportsDeleteInputSchema,
	trafficReportsTotalRequests: TrafficReportsTotalRequestsInputSchema,
	trafficReportsTotalRequestsGeo: TrafficReportsTotalRequestsGeoInputSchema,
	trafficReportsTotalRequestsOrganizations:
		TrafficReportsTotalRequestsOrganizationsInputSchema,
	trafficReportsTotalRequestsAgents:
		TrafficReportsTotalRequestsAgentsInputSchema,
	trafficReportsTotalRequestsUsers: TrafficReportsTotalRequestsUsersInputSchema,
	trafficReportsTotalRequestsCollections:
		TrafficReportsTotalRequestsCollectionsInputSchema,
	trafficReportsTotalThreats: TrafficReportsTotalThreatsInputSchema,
	trafficReportsTotalThreatsOrganizations:
		TrafficReportsTotalThreatsOrganizationsInputSchema,
	trafficReportsTotalThreatsUsers: TrafficReportsTotalThreatsUsersInputSchema,
	trafficReportsTotalCategories: TrafficReportsTotalCategoriesInputSchema,
	trafficReportsTotalCategoriesOrganizations:
		TrafficReportsTotalCategoriesOrganizationsInputSchema,
	trafficReportsTotalDomains: TrafficReportsTotalDomainsInputSchema,
	trafficReportsTotalDomainsOrganizations:
		TrafficReportsTotalDomainsOrganizationsInputSchema,
	trafficReportsTotalDomainsUsers: TrafficReportsTotalDomainsUsersInputSchema,
	trafficReportsQps: TrafficReportsQpsInputSchema,
	trafficReportsQpsActiveOrganizations:
		TrafficReportsQpsActiveOrganizationsInputSchema,
	trafficReportsQpsActiveAgents: TrafficReportsQpsActiveAgentsInputSchema,
	trafficReportsTopDomains: TrafficReportsTopDomainsInputSchema,
	trafficReportsTopCategories: TrafficReportsTopCategoriesInputSchema,
	trafficReportsTopApplicationCategories:
		TrafficReportsTopApplicationCategoriesInputSchema,
	trafficReportsTopNetworks: TrafficReportsTopNetworksInputSchema,
	trafficReportsTopAgents: TrafficReportsTopAgentsInputSchema,
	trafficReportsTopUsers: TrafficReportsTopUsersInputSchema,
	trafficReportsTopCollections: TrafficReportsTopCollectionsInputSchema,
	trafficReportsQueryLogs: TrafficReportsQueryLogsInputSchema,
	trafficReportsTotalOrganizationsStats:
		TrafficReportsTotalOrganizationsStatsInputSchema,
	trafficReportsTotalDomainStats: TrafficReportsTotalDomainStatsInputSchema,
	trafficReportsTotalCategoryStats: TrafficReportsTotalCategoryStatsInputSchema,
	trafficReportsTotalOrganizationsRequests:
		TrafficReportsTotalOrganizationsRequestsInputSchema,
	trafficReportsTopOrganizationsRequests:
		TrafficReportsTopOrganizationsRequestsInputSchema,
	trafficReportsTotalClientStats: TrafficReportsTotalClientStatsInputSchema,
	trafficReportsTotalDeployments: TrafficReportsTotalDeploymentsInputSchema,
	trafficReportsTotalRoamingClients:
		TrafficReportsTotalRoamingClientsInputSchema,
	trafficReportsTotalApplicationsStats:
		TrafficReportsTotalApplicationsStatsInputSchema,
	trafficReportsTotalApplicationsNetworksStats:
		TrafficReportsTotalApplicationsNetworksStatsInputSchema,
	trafficReportsTotalApplicationsAgentsStats:
		TrafficReportsTotalApplicationsAgentsStatsInputSchema,
	trafficReportsTotalApplicationsUsersStats:
		TrafficReportsTotalApplicationsUsersStatsInputSchema,
	trafficReportsTotalApplicationsCollectionsStats:
		TrafficReportsTotalApplicationsCollectionsStatsInputSchema,
	trialsCreate: TrialsCreateInputSchema,
	userAgentBulkDeletesCreate: UserAgentBulkDeletesCreateInputSchema,
	userAgentBulkDeletesGet: UserAgentBulkDeletesGetInputSchema,
	userAgentBulkDeletesCounts: UserAgentBulkDeletesCountsInputSchema,
	userAgentBulkUpdatesCreate: UserAgentBulkUpdatesCreateInputSchema,
	userAgentBulkUpdatesGet: UserAgentBulkUpdatesGetInputSchema,
	userAgentBulkUpdatesHasMixed: UserAgentBulkUpdatesHasMixedInputSchema,
	userAgentBulkUpdatesCounts: UserAgentBulkUpdatesCountsInputSchema,
	userAgentCleanupsCreate: UserAgentCleanupsCreateInputSchema,
	userAgentCleanupsGet: UserAgentCleanupsGetInputSchema,
	userAgentCleanupsUpdate: UserAgentCleanupsUpdateInputSchema,
	userAgentReleasesList: UserAgentReleasesListInputSchema,
	userAgentReleasesRelay: UserAgentReleasesRelayInputSchema,
	userAgentsList: UserAgentsListInputSchema,
	userAgentsListAll: UserAgentsListAllInputSchema,
	userAgentsCounts: UserAgentsCountsInputSchema,
	userAgentsGet: UserAgentsGetInputSchema,
	userAgentsUpdate: UserAgentsUpdateInputSchema,
	userAgentsDelete: UserAgentsDeleteInputSchema,
	userAgentsTags: UserAgentsTagsInputSchema,
	userAgentsDequeueUninstall: UserAgentsDequeueUninstallInputSchema,
	userAgentsUninstallPin: UserAgentsUninstallPinInputSchema,
	usersList: UsersListInputSchema,
	usersListAll: UsersListAllInputSchema,
	usersGet: UsersGetInputSchema,
	usersChangePassword: UsersChangePasswordInputSchema,
	agentLocalUsersV2Counts: AgentLocalUsersV2CountsInputSchema,
	currentUserOrgUiSettingsSuppressLicenseWarning:
		CurrentUserOrgUiSettingsSuppressLicenseWarningInputSchema,
	currentUserUiSettingsGet: CurrentUserUiSettingsGetInputSchema,
	currentUserUiSettingsUpdate: CurrentUserUiSettingsUpdateInputSchema,
	dashboardsList: DashboardsListInputSchema,
	dashboardsCreate: DashboardsCreateInputSchema,
	dashboardsAvailable: DashboardsAvailableInputSchema,
	dashboardsOwned: DashboardsOwnedInputSchema,
	dashboardsUpdate: DashboardsUpdateInputSchema,
	dashboardsDelete: DashboardsDeleteInputSchema,
	dashboardsMakePublic: DashboardsMakePublicInputSchema,
	dashboardsMakePrivate: DashboardsMakePrivateInputSchema,
	dashboardsLink: DashboardsLinkInputSchema,
	dashboardsUnlink: DashboardsUnlinkInputSchema,
	dictionaryV2AiApplications: DictionaryV2AiApplicationsInputSchema,
	dictionaryV2CyberSightActivityTypes:
		DictionaryV2CyberSightActivityTypesInputSchema,
	dictionaryV2VpnSettingsStateTypes:
		DictionaryV2VpnSettingsStateTypesInputSchema,
	scheduledReportsV2List: ScheduledReportsV2ListInputSchema,
	scheduledReportsV2Create: ScheduledReportsV2CreateInputSchema,
	scheduledReportsV2Get: ScheduledReportsV2GetInputSchema,
	scheduledReportsV2Update: ScheduledReportsV2UpdateInputSchema,
	scheduledReportsV2Delete: ScheduledReportsV2DeleteInputSchema,
	scheduledReportsV2BulkUpdate: ScheduledReportsV2BulkUpdateInputSchema,
	unblockRequestsList: UnblockRequestsListInputSchema,
	unblockRequestsCounts: UnblockRequestsCountsInputSchema,
	unblockRequestsPendingCount: UnblockRequestsPendingCountInputSchema,
	unblockRequestsGet: UnblockRequestsGetInputSchema,
	unblockRequestsDecision: UnblockRequestsDecisionInputSchema,
	userAgentsV2UpdateSettings: UserAgentsV2UpdateSettingsInputSchema,
} as const;

export type DnsfilterEndpointInputs = {
	[K in keyof typeof DnsfilterEndpointInputSchemas]: z.infer<
		(typeof DnsfilterEndpointInputSchemas)[K]
	>;
};

export const DnsfilterEndpointOutputSchemas = {
	agentLocalUserBulkDeletesCreate:
		AgentLocalUserBulkDeletesCreateResponseSchema,
	agentLocalUserBulkDeletesGet: AgentLocalUserBulkDeletesGetResponseSchema,
	agentLocalUserBulkDeletesCounts:
		AgentLocalUserBulkDeletesCountsResponseSchema,
	agentLocalUsersList: AgentLocalUsersListResponseSchema,
	agentLocalUsersListAll: AgentLocalUsersListAllResponseSchema,
	agentLocalUsersGet: AgentLocalUsersGetResponseSchema,
	agentLocalUsersUpdate: AgentLocalUsersUpdateResponseSchema,
	agentLocalUsersDelete: AgentLocalUsersDeleteResponseSchema,
	apiKeysCreate: ApiKeysCreateResponseSchema,
	apiKeysList: ApiKeysListResponseSchema,
	apiKeysGet: ApiKeysGetResponseSchema,
	apiKeysDelete: ApiKeysDeleteResponseSchema,
	apiKeysRevoke: ApiKeysRevokeResponseSchema,
	applicationCategoriesList: ApplicationCategoriesListResponseSchema,
	applicationCategoriesGet: ApplicationCategoriesGetResponseSchema,
	applicationsList: ApplicationsListResponseSchema,
	applicationsListAll: ApplicationsListAllResponseSchema,
	applicationsGet: ApplicationsGetResponseSchema,
	billingsGet: BillingsGetResponseSchema,
	billingsCreate: BillingsCreateResponseSchema,
	billingsAddressShow: BillingsAddressShowResponseSchema,
	billingsAddressUpdate: BillingsAddressUpdateResponseSchema,
	blockPagesList: BlockPagesListResponseSchema,
	blockPagesCreate: BlockPagesCreateResponseSchema,
	blockPagesListAll: BlockPagesListAllResponseSchema,
	blockPagesGet: BlockPagesGetResponseSchema,
	blockPagesUpdate: BlockPagesUpdateResponseSchema,
	blockPagesDelete: BlockPagesDeleteResponseSchema,
	categoriesList: CategoriesListResponseSchema,
	categoriesListAll: CategoriesListAllResponseSchema,
	categoriesGet: CategoriesGetResponseSchema,
	collectionUsersList: CollectionUsersListResponseSchema,
	collectionUsersCreate: CollectionUsersCreateResponseSchema,
	collectionUsersGet: CollectionUsersGetResponseSchema,
	collectionUsersDelete: CollectionUsersDeleteResponseSchema,
	currentUsersGet: CurrentUsersGetResponseSchema,
	currentUsersUpdate: CurrentUsersUpdateResponseSchema,
	dictionaryQpMethods: DictionaryQpMethodsResponseSchema,
	domainNotesGet: DomainNotesGetResponseSchema,
	domainNotesUpdate: DomainNotesUpdateResponseSchema,
	domainNotesBatchUpdate: DomainNotesBatchUpdateResponseSchema,
	domainNotesDelete: DomainNotesDeleteResponseSchema,
	domainNotesBatchDestroy: DomainNotesBatchDestroyResponseSchema,
	domainsUserLookup: DomainsUserLookupResponseSchema,
	domainsBulkLookup: DomainsBulkLookupResponseSchema,
	domainsSuggestThreat: DomainsSuggestThreatResponseSchema,
	enterpriseConnectionsList: EnterpriseConnectionsListResponseSchema,
	enterpriseConnectionsCreate: EnterpriseConnectionsCreateResponseSchema,
	enterpriseConnectionsGet: EnterpriseConnectionsGetResponseSchema,
	enterpriseConnectionsUpdate: EnterpriseConnectionsUpdateResponseSchema,
	enterpriseConnectionsDelete: EnterpriseConnectionsDeleteResponseSchema,
	invoicesCurrent: InvoicesCurrentResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoicesGetResponseSchema,
	ipAddressesList: IpAddressesListResponseSchema,
	ipAddressesCreate: IpAddressesCreateResponseSchema,
	ipAddressesListAll: IpAddressesListAllResponseSchema,
	ipAddressesGet: IpAddressesGetResponseSchema,
	ipAddressesUpdate: IpAddressesUpdateResponseSchema,
	ipAddressesDelete: IpAddressesDeleteResponseSchema,
	ipAddressesVerify: IpAddressesVerifyResponseSchema,
	ipAddressesMyip: IpAddressesMyipResponseSchema,
	macAddressesList: MacAddressesListResponseSchema,
	macAddressesCreate: MacAddressesCreateResponseSchema,
	macAddressesListAll: MacAddressesListAllResponseSchema,
	macAddressesGet: MacAddressesGetResponseSchema,
	macAddressesUpdate: MacAddressesUpdateResponseSchema,
	macAddressesDelete: MacAddressesDeleteResponseSchema,
	metricsOrganizationUsage: MetricsOrganizationUsageResponseSchema,
	metricsOrganizationUsageDetailed:
		MetricsOrganizationUsageDetailedResponseSchema,
	networkLanIpsList: NetworkLanIpsListResponseSchema,
	networkLanIpsGet: NetworkLanIpsGetResponseSchema,
	networkLanIpsUpdate: NetworkLanIpsUpdateResponseSchema,
	networkSubnetsListAll: NetworkSubnetsListAllResponseSchema,
	networkSubnetsList: NetworkSubnetsListResponseSchema,
	networkSubnetsCreate: NetworkSubnetsCreateResponseSchema,
	networkSubnetsGet: NetworkSubnetsGetResponseSchema,
	networkSubnetsUpdate: NetworkSubnetsUpdateResponseSchema,
	networkSubnetsDelete: NetworkSubnetsDeleteResponseSchema,
	networksList: NetworksListResponseSchema,
	networksCreate: NetworksCreateResponseSchema,
	networksListAll: NetworksListAllResponseSchema,
	networksCounts: NetworksCountsResponseSchema,
	networksMsp: NetworksMspResponseSchema,
	networksMspAll: NetworksMspAllResponseSchema,
	networksGeo: NetworksGeoResponseSchema,
	networksLookup: NetworksLookupResponseSchema,
	networksGet: NetworksGetResponseSchema,
	networksUpdate: NetworksUpdateResponseSchema,
	networksDelete: NetworksDeleteResponseSchema,
	networksBulkCreate: NetworksBulkCreateResponseSchema,
	networksBulkCreateStatus: NetworksBulkCreateStatusResponseSchema,
	networksBulkUpdate: NetworksBulkUpdateResponseSchema,
	networksBulkUpdateStatus: NetworksBulkUpdateStatusResponseSchema,
	networksBulkDestroy: NetworksBulkDestroyResponseSchema,
	networksBulkDestroyStatus: NetworksBulkDestroyStatusResponseSchema,
	networksGenerateSecretKey: NetworksGenerateSecretKeyResponseSchema,
	networksRevokeSecretKey: NetworksRevokeSecretKeyResponseSchema,
	networksRotateSecretKey: NetworksRotateSecretKeyResponseSchema,
	organizationUsersList: OrganizationUsersListResponseSchema,
	organizationUsersCreate: OrganizationUsersCreateResponseSchema,
	organizationUsersGet: OrganizationUsersGetResponseSchema,
	organizationUsersUpdate: OrganizationUsersUpdateResponseSchema,
	organizationUsersDelete: OrganizationUsersDeleteResponseSchema,
	organizationUsersResendInvite: OrganizationUsersResendInviteResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	organizationsCreate: OrganizationsCreateResponseSchema,
	organizationsListAll: OrganizationsListAllResponseSchema,
	organizationsGet: OrganizationsGetResponseSchema,
	organizationsUpdate: OrganizationsUpdateResponseSchema,
	organizationsDelete: OrganizationsDeleteResponseSchema,
	organizationsSettings: OrganizationsSettingsResponseSchema,
	organizationsBulkUpdate: OrganizationsBulkUpdateResponseSchema,
	organizationsCancel: OrganizationsCancelResponseSchema,
	organizationsPromoteToMsp: OrganizationsPromoteToMspResponseSchema,
	policiesBulkActionsAddAllowlistDomains:
		PoliciesBulkActionsAddAllowlistDomainsResponseSchema,
	policiesBulkActionsRemoveAllowlistDomains:
		PoliciesBulkActionsRemoveAllowlistDomainsResponseSchema,
	policiesBulkActionsAddBlocklistDomains:
		PoliciesBulkActionsAddBlocklistDomainsResponseSchema,
	policiesBulkActionsRemoveBlocklistDomains:
		PoliciesBulkActionsRemoveBlocklistDomainsResponseSchema,
	policiesList: PoliciesListResponseSchema,
	policiesCreate: PoliciesCreateResponseSchema,
	policiesListAll: PoliciesListAllResponseSchema,
	policiesGet: PoliciesGetResponseSchema,
	policiesUpdate: PoliciesUpdateResponseSchema,
	policiesDelete: PoliciesDeleteResponseSchema,
	policiesApplication: PoliciesApplicationResponseSchema,
	policiesApplicationUpdate: PoliciesApplicationUpdateResponseSchema,
	policiesAddBlacklistDomain: PoliciesAddBlacklistDomainResponseSchema,
	policiesRemoveBlacklistDomain: PoliciesRemoveBlacklistDomainResponseSchema,
	policiesAddWhitelistDomain: PoliciesAddWhitelistDomainResponseSchema,
	policiesRemoveWhitelistDomain: PoliciesRemoveWhitelistDomainResponseSchema,
	policiesAddBlacklistCategory: PoliciesAddBlacklistCategoryResponseSchema,
	policiesRemoveBlacklistCategory:
		PoliciesRemoveBlacklistCategoryResponseSchema,
	policiesAddAllowedApplication: PoliciesAddAllowedApplicationResponseSchema,
	policiesRemoveAllowedApplication:
		PoliciesRemoveAllowedApplicationResponseSchema,
	policiesAddBlockedApplication: PoliciesAddBlockedApplicationResponseSchema,
	policiesRemoveBlockedApplication:
		PoliciesRemoveBlockedApplicationResponseSchema,
	policiesGetPermissiveMode: PoliciesGetPermissiveModeResponseSchema,
	policiesUpdatePermissiveMode: PoliciesUpdatePermissiveModeResponseSchema,
	policyIpsList: PolicyIpsListResponseSchema,
	policyIpsGet: PolicyIpsGetResponseSchema,
	psaIntegrationsRedirectLink: PsaIntegrationsRedirectLinkResponseSchema,
	scheduledPoliciesList: ScheduledPoliciesListResponseSchema,
	scheduledPoliciesCreate: ScheduledPoliciesCreateResponseSchema,
	scheduledPoliciesListAll: ScheduledPoliciesListAllResponseSchema,
	scheduledPoliciesGet: ScheduledPoliciesGetResponseSchema,
	scheduledPoliciesUpdate: ScheduledPoliciesUpdateResponseSchema,
	scheduledPoliciesDelete: ScheduledPoliciesDeleteResponseSchema,
	scheduledReportPreviewsGet: ScheduledReportPreviewsGetResponseSchema,
	scheduledReportPreviewsCreate: ScheduledReportPreviewsCreateResponseSchema,
	scheduledReportsList: ScheduledReportsListResponseSchema,
	scheduledReportsCreate: ScheduledReportsCreateResponseSchema,
	scheduledReportsGet: ScheduledReportsGetResponseSchema,
	scheduledReportsUpdate: ScheduledReportsUpdateResponseSchema,
	scheduledReportsDelete: ScheduledReportsDeleteResponseSchema,
	trafficReportsTotalRequests: TrafficReportsTotalRequestsResponseSchema,
	trafficReportsTotalRequestsGeo: TrafficReportsTotalRequestsGeoResponseSchema,
	trafficReportsTotalRequestsOrganizations:
		TrafficReportsTotalRequestsOrganizationsResponseSchema,
	trafficReportsTotalRequestsAgents:
		TrafficReportsTotalRequestsAgentsResponseSchema,
	trafficReportsTotalRequestsUsers:
		TrafficReportsTotalRequestsUsersResponseSchema,
	trafficReportsTotalRequestsCollections:
		TrafficReportsTotalRequestsCollectionsResponseSchema,
	trafficReportsTotalThreats: TrafficReportsTotalThreatsResponseSchema,
	trafficReportsTotalThreatsOrganizations:
		TrafficReportsTotalThreatsOrganizationsResponseSchema,
	trafficReportsTotalThreatsUsers:
		TrafficReportsTotalThreatsUsersResponseSchema,
	trafficReportsTotalCategories: TrafficReportsTotalCategoriesResponseSchema,
	trafficReportsTotalCategoriesOrganizations:
		TrafficReportsTotalCategoriesOrganizationsResponseSchema,
	trafficReportsTotalDomains: TrafficReportsTotalDomainsResponseSchema,
	trafficReportsTotalDomainsOrganizations:
		TrafficReportsTotalDomainsOrganizationsResponseSchema,
	trafficReportsTotalDomainsUsers:
		TrafficReportsTotalDomainsUsersResponseSchema,
	trafficReportsQps: TrafficReportsQpsResponseSchema,
	trafficReportsQpsActiveOrganizations:
		TrafficReportsQpsActiveOrganizationsResponseSchema,
	trafficReportsQpsActiveAgents: TrafficReportsQpsActiveAgentsResponseSchema,
	trafficReportsTopDomains: TrafficReportsTopDomainsResponseSchema,
	trafficReportsTopCategories: TrafficReportsTopCategoriesResponseSchema,
	trafficReportsTopApplicationCategories:
		TrafficReportsTopApplicationCategoriesResponseSchema,
	trafficReportsTopNetworks: TrafficReportsTopNetworksResponseSchema,
	trafficReportsTopAgents: TrafficReportsTopAgentsResponseSchema,
	trafficReportsTopUsers: TrafficReportsTopUsersResponseSchema,
	trafficReportsTopCollections: TrafficReportsTopCollectionsResponseSchema,
	trafficReportsQueryLogs: TrafficReportsQueryLogsResponseSchema,
	trafficReportsTotalOrganizationsStats:
		TrafficReportsTotalOrganizationsStatsResponseSchema,
	trafficReportsTotalDomainStats: TrafficReportsTotalDomainStatsResponseSchema,
	trafficReportsTotalCategoryStats:
		TrafficReportsTotalCategoryStatsResponseSchema,
	trafficReportsTotalOrganizationsRequests:
		TrafficReportsTotalOrganizationsRequestsResponseSchema,
	trafficReportsTopOrganizationsRequests:
		TrafficReportsTopOrganizationsRequestsResponseSchema,
	trafficReportsTotalClientStats: TrafficReportsTotalClientStatsResponseSchema,
	trafficReportsTotalDeployments: TrafficReportsTotalDeploymentsResponseSchema,
	trafficReportsTotalRoamingClients:
		TrafficReportsTotalRoamingClientsResponseSchema,
	trafficReportsTotalApplicationsStats:
		TrafficReportsTotalApplicationsStatsResponseSchema,
	trafficReportsTotalApplicationsNetworksStats:
		TrafficReportsTotalApplicationsNetworksStatsResponseSchema,
	trafficReportsTotalApplicationsAgentsStats:
		TrafficReportsTotalApplicationsAgentsStatsResponseSchema,
	trafficReportsTotalApplicationsUsersStats:
		TrafficReportsTotalApplicationsUsersStatsResponseSchema,
	trafficReportsTotalApplicationsCollectionsStats:
		TrafficReportsTotalApplicationsCollectionsStatsResponseSchema,
	trialsCreate: TrialsCreateResponseSchema,
	userAgentBulkDeletesCreate: UserAgentBulkDeletesCreateResponseSchema,
	userAgentBulkDeletesGet: UserAgentBulkDeletesGetResponseSchema,
	userAgentBulkDeletesCounts: UserAgentBulkDeletesCountsResponseSchema,
	userAgentBulkUpdatesCreate: UserAgentBulkUpdatesCreateResponseSchema,
	userAgentBulkUpdatesGet: UserAgentBulkUpdatesGetResponseSchema,
	userAgentBulkUpdatesHasMixed: UserAgentBulkUpdatesHasMixedResponseSchema,
	userAgentBulkUpdatesCounts: UserAgentBulkUpdatesCountsResponseSchema,
	userAgentCleanupsCreate: UserAgentCleanupsCreateResponseSchema,
	userAgentCleanupsGet: UserAgentCleanupsGetResponseSchema,
	userAgentCleanupsUpdate: UserAgentCleanupsUpdateResponseSchema,
	userAgentReleasesList: UserAgentReleasesListResponseSchema,
	userAgentReleasesRelay: UserAgentReleasesRelayResponseSchema,
	userAgentsList: UserAgentsListResponseSchema,
	userAgentsListAll: UserAgentsListAllResponseSchema,
	userAgentsCounts: UserAgentsCountsResponseSchema,
	userAgentsGet: UserAgentsGetResponseSchema,
	userAgentsUpdate: UserAgentsUpdateResponseSchema,
	userAgentsDelete: UserAgentsDeleteResponseSchema,
	userAgentsTags: UserAgentsTagsResponseSchema,
	userAgentsDequeueUninstall: UserAgentsDequeueUninstallResponseSchema,
	userAgentsUninstallPin: UserAgentsUninstallPinResponseSchema,
	usersList: UsersListResponseSchema,
	usersListAll: UsersListAllResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersChangePassword: UsersChangePasswordResponseSchema,
	agentLocalUsersV2Counts: AgentLocalUsersV2CountsResponseSchema,
	currentUserOrgUiSettingsSuppressLicenseWarning:
		CurrentUserOrgUiSettingsSuppressLicenseWarningResponseSchema,
	currentUserUiSettingsGet: CurrentUserUiSettingsGetResponseSchema,
	currentUserUiSettingsUpdate: CurrentUserUiSettingsUpdateResponseSchema,
	dashboardsList: DashboardsListResponseSchema,
	dashboardsCreate: DashboardsCreateResponseSchema,
	dashboardsAvailable: DashboardsAvailableResponseSchema,
	dashboardsOwned: DashboardsOwnedResponseSchema,
	dashboardsUpdate: DashboardsUpdateResponseSchema,
	dashboardsDelete: DashboardsDeleteResponseSchema,
	dashboardsMakePublic: DashboardsMakePublicResponseSchema,
	dashboardsMakePrivate: DashboardsMakePrivateResponseSchema,
	dashboardsLink: DashboardsLinkResponseSchema,
	dashboardsUnlink: DashboardsUnlinkResponseSchema,
	dictionaryV2AiApplications: DictionaryV2AiApplicationsResponseSchema,
	dictionaryV2CyberSightActivityTypes:
		DictionaryV2CyberSightActivityTypesResponseSchema,
	dictionaryV2VpnSettingsStateTypes:
		DictionaryV2VpnSettingsStateTypesResponseSchema,
	scheduledReportsV2List: ScheduledReportsV2ListResponseSchema,
	scheduledReportsV2Create: ScheduledReportsV2CreateResponseSchema,
	scheduledReportsV2Get: ScheduledReportsV2GetResponseSchema,
	scheduledReportsV2Update: ScheduledReportsV2UpdateResponseSchema,
	scheduledReportsV2Delete: ScheduledReportsV2DeleteResponseSchema,
	scheduledReportsV2BulkUpdate: ScheduledReportsV2BulkUpdateResponseSchema,
	unblockRequestsList: UnblockRequestsListResponseSchema,
	unblockRequestsCounts: UnblockRequestsCountsResponseSchema,
	unblockRequestsPendingCount: UnblockRequestsPendingCountResponseSchema,
	unblockRequestsGet: UnblockRequestsGetResponseSchema,
	unblockRequestsDecision: UnblockRequestsDecisionResponseSchema,
	userAgentsV2UpdateSettings: UserAgentsV2UpdateSettingsResponseSchema,
} as const;

export type DnsfilterEndpointOutputs = {
	[K in keyof typeof DnsfilterEndpointOutputSchemas]: z.infer<
		(typeof DnsfilterEndpointOutputSchemas)[K]
	>;
};
