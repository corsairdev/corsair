import { z } from 'zod';

// Models generated from the DNSFilter OpenAPI document (version 2026-10-13).
//
// DNSFilter leaves some payloads untyped in its document (free-form metadata,
// report rows, `additionalProperties` bags). Those nodes are emitted as
// `z.unknown()` because the provider contract does not constrain them; every
// documented field keeps its concrete type.

export const StringContainsOpSchema = z.object({
	operator: z.enum(['contains', 'doesnotcontain']).optional(),
	value: z.string().optional(),
});
export type StringContainsOp = z.infer<typeof StringContainsOpSchema>;

export const ArrayIntegerIsOpSchema = z.object({
	operator: z.enum(['is', 'isnot']).optional(),
	value: z.union([z.array(z.number().int()), z.string()]).optional(),
});
export type ArrayIntegerIsOp = z.infer<typeof ArrayIntegerIsOpSchema>;

export const AgentLocalUserBulkDeletesSchema = z.object({
	ids: z.array(z.number().int()).optional(),
	exclude_ids: z.array(z.number().int()).optional(),
});
export type AgentLocalUserBulkDeletes = z.infer<
	typeof AgentLocalUserBulkDeletesSchema
>;

export const ErrorSchema = z.object({
	error: z.string().optional(),
});
export type Error = z.infer<typeof ErrorSchema>;

export const AgentLocalUserBulkDeletesCountsSchema = z.object({
	count: z.number().int().optional(),
});
export type AgentLocalUserBulkDeletesCounts = z.infer<
	typeof AgentLocalUserBulkDeletesCountsSchema
>;

export const IdTypeSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
});
export type IdType = z.infer<typeof IdTypeSchema>;

export const AgentLocalUserSchema = z.object({
	friendly_name: z.string().optional(),
	user_login: z.string().optional(),
	user_name: z.string().optional(),
	user_remote_id: z.string().optional(),
	first_seen: z.string().optional(),
	last_seen: z.string().optional(),
});
export type AgentLocalUser = z.infer<typeof AgentLocalUserSchema>;

export const AgentLocalUserSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: AgentLocalUserSchema.optional(),
	relationships: z
		.object({
			organization: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type AgentLocalUserSpec = z.infer<typeof AgentLocalUserSpecSchema>;

export const LinksSchema = z.object({
	self: z.string().optional(),
});
export type Links = z.infer<typeof LinksSchema>;

export const AgentLocalUserUpdateSchema = z.object({
	friendly_name: z.string().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
});
export type AgentLocalUserUpdate = z.infer<typeof AgentLocalUserUpdateSchema>;

export const AgentLocalUserUpdateSpecSchema = z.object({
	agent_local_user: AgentLocalUserUpdateSchema,
});
export type AgentLocalUserUpdateSpec = z.infer<
	typeof AgentLocalUserUpdateSpecSchema
>;

export const ApiKeyCreateSpecSchema = z.object({
	name: z.string().optional(),
	expiry: z.string().optional(),
});
export type ApiKeyCreateSpec = z.infer<typeof ApiKeyCreateSpecSchema>;

export const ApiKeySchema = z.object({
	name: z.string().optional(),
	expiry: z.string().optional(),
	last_four: z.string().optional(),
	token: z.string().optional(),
	status: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	'user_id:': z.number().int().optional(),
});
export type ApiKey = z.infer<typeof ApiKeySchema>;

export const ApiKeySpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ApiKeySchema.optional(),
});
export type ApiKeySpec = z.infer<typeof ApiKeySpecSchema>;

export const ApplicationCategorySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
});
export type ApplicationCategory = z.infer<typeof ApplicationCategorySchema>;

export const ApplicationCategorySpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ApplicationCategorySchema.optional(),
});
export type ApplicationCategorySpec = z.infer<
	typeof ApplicationCategorySpecSchema
>;

export const ApplicationSchema = z.object({
	name: z.string().optional(),
	display_name: z.string().optional(),
	description: z.string().optional(),
	home_page_url: z.string().optional(),
	favicon: z.string().optional(),
	icon: z.string().optional(),
});
export type Application = z.infer<typeof ApplicationSchema>;

export const ApplicationSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ApplicationSchema.optional(),
	relationships: z
		.object({
			categories: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type ApplicationSpec = z.infer<typeof ApplicationSpecSchema>;

export const PaymentMethodSchema = z.object({
	object: z.string().optional(),
	address_city: z.string().optional(),
	address_country: z.string().optional(),
	address_line1: z.string().optional(),
	address_line2: z.string().optional(),
	address_state: z.string().optional(),
	address_zip: z.string().optional(),
	brand: z.string().optional(),
	country: z.string().optional(),
	exp_month: z.number().int().optional(),
	exp_year: z.number().int().optional(),
	last4: z.string().optional(),
});
export type PaymentMethod = z.infer<typeof PaymentMethodSchema>;

export const BillingCreateSchema = z.object({
	organization_id: z.number().int(),
	payment_token: z.string(),
});
export type BillingCreate = z.infer<typeof BillingCreateSchema>;

export const Billing_BillingAddressSchema = z.object({
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	email: z.string().optional(),
	company: z.string().optional(),
	phone: z.string().optional(),
	line1: z.string().optional(),
	line2: z.string().optional(),
	line3: z.string().optional(),
	city: z.string().optional(),
	state_code: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().optional(),
});
export type Billing_BillingAddress = z.infer<
	typeof Billing_BillingAddressSchema
>;

export const Billing_BillingAddressUpdateSpecSchema = z.object({
	billing_address: Billing_BillingAddressSchema,
});
export type Billing_BillingAddressUpdateSpec = z.infer<
	typeof Billing_BillingAddressUpdateSpecSchema
>;

export const BlockPageSchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	block_org_name: z.string().optional(),
	block_email_addr: z.string().optional(),
	block_logo_uuid: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type BlockPage = z.infer<typeof BlockPageSchema>;

export const CategorySchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	source: z.string().optional(),
	security: z.boolean().optional(),
	internal: z.boolean().optional(),
});
export type Category = z.infer<typeof CategorySchema>;

export const CategorySpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: CategorySchema.optional(),
	relationships: z
		.object({
			child_categories: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
			parent_categories: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type CategorySpec = z.infer<typeof CategorySpecSchema>;

export const CollectionUserCreateSpecSchema = z.object({
	collection_id: z.number().int(),
	id: z.number().int(),
});
export type CollectionUserCreateSpec = z.infer<
	typeof CollectionUserCreateSpecSchema
>;

export const CollectionUserSpecSchema = z.object({
	policy: CollectionUserCreateSpecSchema,
});
export type CollectionUserSpec = z.infer<typeof CollectionUserSpecSchema>;

export const UserSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	email_verified: z.boolean().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	has_agreements_to_sign: z.boolean().optional(),
	can_add_org_to_msps: z
		.array(
			z.object({
				id: z.number().int().optional(),
				name: z.string().optional(),
			}),
		)
		.optional(),
});
export type User = z.infer<typeof UserSchema>;

export const UserSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: UserSchema.optional(),
});
export type UserSpec = z.infer<typeof UserSpecSchema>;

export const DomainNotesSpecSchema = z.object({
	allow_notes: z.record(z.string(), z.unknown()).optional(),
	block_notes: z.record(z.string(), z.unknown()).optional(),
});
export type DomainNotesSpec = z.infer<typeof DomainNotesSpecSchema>;

export const DomainNotesCreateSpecSchema = z.object({
	type: z.enum(['allow', 'block']),
	domain: z.string(),
	note: z.string().optional(),
});
export type DomainNotesCreateSpec = z.infer<typeof DomainNotesCreateSpecSchema>;

export const ApplicationLookupSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	category: z.string().optional(),
});
export type ApplicationLookup = z.infer<typeof ApplicationLookupSchema>;

export const DomainSchema = z.object({
	host: z.string().optional(),
	name: z.string().optional(),
});
export type Domain = z.infer<typeof DomainSchema>;

export const DomainSpecSchema = z.object({
	id: z.number().int().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	name: z.string().optional(),
	category: z.string().optional(),
	attributes: DomainSchema.optional(),
	relationships: z
		.object({
			categories: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type DomainSpec = z.infer<typeof DomainSpecSchema>;

export const SuccessSchema = z.object({
	success: z.boolean().optional(),
});
export type Success = z.infer<typeof SuccessSchema>;

export const EnterpriseConnectionRoleMapSchema = z.object({
	role: z.string().optional(),
	group: z.string().optional(),
});
export type EnterpriseConnectionRoleMap = z.infer<
	typeof EnterpriseConnectionRoleMapSchema
>;

export const EnterpriseConnectionSchema = z.object({
	id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	default_organization_id: z.number().int().optional(),
	name: z.string().optional(),
	display_name: z.string().optional(),
	role_default: z.number().int().optional(),
	role_map: z.array(EnterpriseConnectionRoleMapSchema).optional(),
	sub_prefix: z.string().optional(),
	conn_id: z.string().optional(),
	idp: z.enum(['openid', 'okta', 'azure', 'google']).optional(),
	authorized_domains: z.array(z.string()).optional(),
});
export type EnterpriseConnection = z.infer<typeof EnterpriseConnectionSchema>;

export const EnterpriseConnectionOptionsSchema = z.object({
	client_id: z.string().optional(),
	client_secret: z.string().optional(),
	discovery_url: z.string().optional(),
});
export type EnterpriseConnectionOptions = z.infer<
	typeof EnterpriseConnectionOptionsSchema
>;

export const EnterpriseConnectionCreatePayloadSchema = z.object({
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
	role_map: z.array(EnterpriseConnectionRoleMapSchema).optional(),
	options: EnterpriseConnectionOptionsSchema,
	idp: z.enum(['openid', 'okta', 'azure', 'google']).optional(),
	authorized_domains: z.array(z.string()).optional(),
});
export type EnterpriseConnectionCreatePayload = z.infer<
	typeof EnterpriseConnectionCreatePayloadSchema
>;

export const EnterpriseConnectionUpdatePayloadSchema = z.object({
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
	role_map: z.array(EnterpriseConnectionRoleMapSchema).optional(),
	options: EnterpriseConnectionOptionsSchema,
	idp: z.enum(['openid', 'okta', 'azure', 'google']).optional(),
	authorized_domains: z.array(z.string()).optional(),
});
export type EnterpriseConnectionUpdatePayload = z.infer<
	typeof EnterpriseConnectionUpdatePayloadSchema
>;

export const InvoiceItemSchema = z.object({
	id: z.number().int().optional(),
	invoice_id: z.number().int().optional(),
	network_name: z.string().optional(),
	network_id: z.number().int().optional(),
	cents: z.number().int().optional(),
	requests: z.number().int().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	stripe_id: z.string().optional(),
	discounted: z.boolean().optional(),
	invoice_item_group_id: z.number().int().optional(),
});
export type InvoiceItem = z.infer<typeof InvoiceItemSchema>;

export const InvoiceItemGroupSchema = z.object({
	id: z.number().int().optional(),
	invoice_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	organization_id: z.number().int().optional(),
	subtotal_cents: z.number().int().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	invoice_items: z.array(InvoiceItemSchema).optional(),
});
export type InvoiceItemGroup = z.infer<typeof InvoiceItemGroupSchema>;

export const InvoiceSchema = z.object({
	id: z.number().int().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	organization_id: z.number().int().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	total_cents: z.number().int().optional(),
	stripe_id: z.string().optional(),
	requests: z.number().int().optional(),
	paid: z.boolean().optional(),
	closed: z.boolean().optional(),
	forgiven: z.boolean().optional(),
	payment_attempts: z.number().int().optional(),
	payment_first_attempt: z.string().optional(),
	payment_last_attempt: z.string().optional(),
	payment_date: z.string().optional(),
	payment_receipt_number: z.string().optional(),
	organization_name: z.string().optional(),
	invoice_item_groups: z.array(InvoiceItemGroupSchema).optional(),
	invoice_items: z.array(InvoiceItemSchema).optional(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

export const IpAddressSchema = z.object({
	ip: z.string().optional(),
	address: z.string().optional(),
	network_id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
});
export type IpAddress = z.infer<typeof IpAddressSchema>;

export const IpAddressSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: IpAddressSchema.optional(),
	relationships: z
		.object({
			network: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type IpAddressSpec = z.infer<typeof IpAddressSpecSchema>;

export const IpAddressCreateSchema = z.object({
	address: z.string(),
	organization_id: z.number().int(),
	network_id: z.number().int(),
	dynamic_hostname: z.string().optional(),
});
export type IpAddressCreate = z.infer<typeof IpAddressCreateSchema>;

export const IpAddressCreateSpecSchema = z.object({
	ip_address: IpAddressCreateSchema,
});
export type IpAddressCreateSpec = z.infer<typeof IpAddressCreateSpecSchema>;

export const MacAddressSchema = z.object({
	address: z.string().optional(),
	filter_value: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type MacAddress = z.infer<typeof MacAddressSchema>;

export const MacAddressSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: MacAddressSchema.optional(),
	relationships: z
		.object({
			organization: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			scheduled_policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			block_page: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type MacAddressSpec = z.infer<typeof MacAddressSpecSchema>;

export const MacAddressCreateSchema = z.object({
	organization_id: z.number().int(),
	address: z.string().optional(),
	filter_value: z.string().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
});
export type MacAddressCreate = z.infer<typeof MacAddressCreateSchema>;

export const MacAddressCreateSpecSchema = z.object({
	mac_address: MacAddressCreateSchema,
});
export type MacAddressCreateSpec = z.infer<typeof MacAddressCreateSpecSchema>;

export const NetworkLanIpSchema = z.object({
	version: z.number().int().optional(),
	address: z.string().optional(),
	name: z.string().optional(),
	first_seen: z.string().optional(),
	last_seen: z.string().optional(),
});
export type NetworkLanIp = z.infer<typeof NetworkLanIpSchema>;

export const NetworkLanIpSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: NetworkLanIpSchema.optional(),
	relationships: z
		.object({
			network: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type NetworkLanIpSpec = z.infer<typeof NetworkLanIpSpecSchema>;

export const NetworkLanIpUpdateSchema = z.object({
	name: z.string().optional(),
});
export type NetworkLanIpUpdate = z.infer<typeof NetworkLanIpUpdateSchema>;

export const NetworkLanIpUpdateSpecSchema = z.object({
	network_lan_ip: NetworkLanIpUpdateSchema,
});
export type NetworkLanIpUpdateSpec = z.infer<
	typeof NetworkLanIpUpdateSpecSchema
>;

export const NetworkSubnetSchema = z.object({
	version: z.number().int().optional(),
	name: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
});
export type NetworkSubnet = z.infer<typeof NetworkSubnetSchema>;

export const NetworkSubnetSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: NetworkSubnetSchema.optional(),
	relationships: z
		.object({
			network: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			scheduled_policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type NetworkSubnetSpec = z.infer<typeof NetworkSubnetSpecSchema>;

export const NetworkSubnetCreateSchema = z.object({
	name: z.string(),
	from: z.string(),
	to: z.string(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
});
export type NetworkSubnetCreate = z.infer<typeof NetworkSubnetCreateSchema>;

export const NetworkSubnetCreateSpecSchema = z.object({
	network_subnet: NetworkSubnetCreateSchema,
});
export type NetworkSubnetCreateSpec = z.infer<
	typeof NetworkSubnetCreateSpecSchema
>;

export const NetworkSchema = z.object({
	name: z.string().optional(),
	physical_address: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	block_default_appearance: z.boolean().optional(),
	block_org_name: z.string().optional(),
	block_email_addr: z.string().optional(),
	block_logo_uuid: z.string().optional(),
	allow_all_policies: z.boolean().optional(),
	billing_per_user: z.boolean().optional(),
	billing_user_count: z.number().int().optional(),
	network_type_units: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	secret_key: z.string().optional(),
	deleted_at: z.string().optional(),
	external_id: z.string().optional(),
	local_domains: z.array(z.string()).optional(),
	local_resolvers: z.array(z.string()).optional(),
});
export type Network = z.infer<typeof NetworkSchema>;

export const NetworkSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: NetworkSchema.optional(),
	relationships: z
		.object({
			organization: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			ip_addresses: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
			policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			scheduled_policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			block_page: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			policies: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type NetworkSpec = z.infer<typeof NetworkSpecSchema>;

export const NetworkCreateSchema = z.object({
	name: z.string(),
	organization_id: z.number().int(),
	block_page_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
	external_id: z.string().optional(),
	is_legacy_vpn_active: z.boolean().optional(),
	physical_address: z.string().optional(),
	ip_addresses_attributes: z
		.array(
			z.object({
				address: z.string().optional(),
				key: z.string().optional(),
			}),
		)
		.optional(),
	local_domains: z.array(z.string()).optional(),
	local_resolvers: z.array(z.string()).optional(),
});
export type NetworkCreate = z.infer<typeof NetworkCreateSchema>;

export const NetworkCreateSpecSchema = z.object({
	network: NetworkCreateSchema,
});
export type NetworkCreateSpec = z.infer<typeof NetworkCreateSpecSchema>;

export const NetworkCountsSchema = z.object({
	all: z.number().int().optional(),
	offline: z.number().int().optional(),
	protected: z
		.object({
			count: z.number().int().optional(),
			network_ids: z.array(z.number().int()).optional(),
		})
		.optional(),
	unprotected: z
		.object({
			count: z.number().int().optional(),
			network_ids: z.array(z.number().int()).optional(),
		})
		.optional(),
});
export type NetworkCounts = z.infer<typeof NetworkCountsSchema>;

export const NetworkGeoSchema = z.object({
	id: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	name: z.string().optional(),
	latitude: z.number().optional(),
	longitude: z.number().optional(),
	physical_address: z.string().optional(),
});
export type NetworkGeo = z.infer<typeof NetworkGeoSchema>;

export const NetworkLookupSchema = z.object({
	block_org_name: z.string().optional(),
	block_email_addr: z.string().optional(),
	block_logo_uuid: z.string().optional(),
	block_default_appearance: z.boolean().optional(),
});
export type NetworkLookup = z.infer<typeof NetworkLookupSchema>;

export const NetworkUpdateSchema = z.object({
	name: z.string(),
	organization_id: z.number().int(),
	block_page_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
	external_id: z.string().optional(),
	is_legacy_vpn_active: z.boolean().optional(),
	physical_address: z.string().optional(),
	ip_addresses_attributes: z
		.array(
			z.object({
				id: z.number().int().optional(),
				address: z.string().optional(),
				key: z.string().optional(),
			}),
		)
		.optional(),
	local_domains: z.array(z.string()).optional(),
	local_resolvers: z.array(z.string()).optional(),
});
export type NetworkUpdate = z.infer<typeof NetworkUpdateSchema>;

export const NetworkUpdateSpecSchema = z.object({
	network: NetworkUpdateSchema,
});
export type NetworkUpdateSpec = z.infer<typeof NetworkUpdateSpecSchema>;

export const NetworkBulkUpdateSpecSchema = z.object({
	ids: z.string(),
	organization_id: z.number().int().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
	is_legacy_vpn_active: z.boolean().optional(),
});
export type NetworkBulkUpdateSpec = z.infer<typeof NetworkBulkUpdateSpecSchema>;

export const NetworkBulkDestroySpecSchema = z.object({
	ids: z.string(),
	organization_id: z.number().int().optional(),
});
export type NetworkBulkDestroySpec = z.infer<
	typeof NetworkBulkDestroySpecSchema
>;

export const OrganizationUserSchema = z.object({
	id: z.number().int().optional(),
	email: z.string().optional(),
	auth0_sub: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
	email_verified: z.boolean().optional(),
	role: z.string().optional(),
	organization_permission_ids: z.array(z.number().int()).optional(),
	is_include_only_list: z.boolean().optional(),
	mfa_enabled: z.boolean().optional(),
});
export type OrganizationUser = z.infer<typeof OrganizationUserSchema>;

export const OrganizationUserCreateSchema = z.object({
	email: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	phone: z.string().optional(),
	role: z.string().optional(),
	organization_permission_ids: z.array(z.number().int()).optional(),
	is_include_only_list: z.boolean().optional(),
});
export type OrganizationUserCreate = z.infer<
	typeof OrganizationUserCreateSchema
>;

export const OrganizationUserCreateSpecSchema = z.object({
	user: OrganizationUserCreateSchema,
});
export type OrganizationUserCreateSpec = z.infer<
	typeof OrganizationUserCreateSpecSchema
>;

export const OrganizationSchema = z.object({
	id: z.number().int().optional(),
	address: z.string().optional(),
	allow_create_network: z.boolean().optional(),
	allowlist_updated_at: z.string().optional(),
	billing_address: z.string().optional(),
	billing_contact_email: z.string().optional(),
	billing_contact_name: z.string().optional(),
	billing_contact_phone: z.string().optional(),
	billing_manual: z.boolean().optional(),
	blocklist_updated_at: z.string().optional(),
	canceled: z.boolean().optional(),
	canceled_at: z.string().optional(),
	external_id: z.string().optional(),
	feature_flags: z.array(z.string()).optional(),
	fetched_onboard_details: z.boolean().optional(),
	first_traffic_sent: z.string().optional(),
	industry: z.string().optional(),
	managed_by_msp_id: z.number().int().optional(),
	metadata: z.string().optional(),
	msp_feature_flags: z.array(z.string()).optional(),
	name: z.string().optional(),
	owned_msp_id: z.number().int().optional(),
	plan_details: z.string().optional(),
	release_channel: z.string().optional(),
	role: z.string().optional(),
	send_uninstall_notifications_to_admin_users: z.boolean().optional(),
	sso_enabled: z.boolean().optional(),
	stripe_customer_id: z.string().optional(),
	summary_email_address: z.string().optional(),
	summary_email_enabled: z.boolean().optional(),
	sync_tools_auto_update: z.string().optional(),
	trial_days: z.number().int().optional(),
	unbounce_data: z.string().optional(),
	unique_id: z.string().optional(),
	update_payment: z.boolean().optional(),
	usage_alert_cents: z.string().optional(),
	user_agent_uninstall_notification: z.boolean().optional(),
	user_agent_uninstall_notification_recipient_emails: z
		.array(z.string())
		.optional(),
	user_agents_auto_update: z.boolean().optional(),
	will_cancel_at: z.string().optional(),
	active_psa_integration: z.boolean().optional(),
	segment: z.string().optional(),
	vpn_settings_organization: z
		.object({
			vpn_settings_state_type_id: z.number().int().optional(),
		})
		.optional(),
});
export type Organization = z.infer<typeof OrganizationSchema>;

export const OrganizationSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: OrganizationSchema.optional(),
	relationships: z
		.object({
			networks: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type OrganizationSpec = z.infer<typeof OrganizationSpecSchema>;

export const OrganizationCreateSchema = z.object({
	name: z.string(),
	billing_contact_name: z.string().optional(),
	billing_contact_phone: z.string().optional(),
	billing_contact_email: z.string().optional(),
	address: z.string().optional(),
	managed_by_msp_id: z.number().int(),
	unique_id: z.string().optional(),
	sku: z.string().optional(),
	quantity: z.number().int().optional(),
	vpn_settings_organization_attributes: z
		.object({
			id: z.number().int().optional(),
			vpn_settings_state_type_id: z.number().int().optional(),
			_destroy: z.boolean().optional(),
		})
		.optional(),
	privacy_mode: z
		.enum(['inherit', 'standard', 'identify_devices', 'maximum'])
		.optional(),
	enable_cybersight: z.boolean().optional(),
});
export type OrganizationCreate = z.infer<typeof OrganizationCreateSchema>;

export const OrganizationCreateSpecSchema = z.object({
	organization: OrganizationCreateSchema,
});
export type OrganizationCreateSpec = z.infer<
	typeof OrganizationCreateSpecSchema
>;

export const OrganizationBulkUpdateSchema = z.object({
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
export type OrganizationBulkUpdate = z.infer<
	typeof OrganizationBulkUpdateSchema
>;

export const PolicyBulkActionListDomainsSchema = z.object({
	domains: z.array(z.string()).optional(),
	notes: z
		.object({
			string: z.string().optional(),
		})
		.optional(),
	policy_ids: z.array(z.number().int()).optional(),
});
export type PolicyBulkActionListDomains = z.infer<
	typeof PolicyBulkActionListDomainsSchema
>;

export const PolicyBulkActionsListDomainsResponseSchema = z.object({
	success: z.array(z.number().int()).optional(),
	failure: z.array(z.number().int()).optional(),
	noop: z.array(z.number().int()).optional(),
});
export type PolicyBulkActionsListDomainsResponse = z.infer<
	typeof PolicyBulkActionsListDomainsResponseSchema
>;

export const PolicySchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	whitelist_domains: z.array(z.string()).optional(),
	blacklist_domains: z.array(z.string()).optional(),
	blacklist_categories: z.array(z.number().int()).optional(),
	allow_unknown_domains: z.boolean().optional(),
	google_safesearch: z.boolean().optional(),
	bing_safe_search: z.boolean().optional(),
	duck_duck_go_safe_search: z.boolean().optional(),
	ecosia_safesearch: z.boolean().optional(),
	yandex_safe_search: z.boolean().optional(),
	youtube_restricted: z.boolean().optional(),
	youtube_restricted_level: z.enum(['strict', 'none']).optional(),
	interstitial: z.boolean().optional(),
	is_global_policy: z.boolean().optional(),
	can_edit: z.boolean().optional(),
	lock_version: z.number().int().optional(),
	allow_list_only: z.boolean().optional(),
});
export type Policy = z.infer<typeof PolicySchema>;

export const PolicySpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: PolicySchema.optional(),
	relationships: z
		.object({
			organization: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			network_policies: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
			networks: z
				.object({
					data: z.array(IdTypeSchema).optional(),
				})
				.optional(),
		})
		.optional(),
});
export type PolicySpec = z.infer<typeof PolicySpecSchema>;

export const PolicyCreateSchema = z.object({
	name: z.string(),
	organization_id: z.number().int(),
	allow_unknown_domains: z.boolean().optional(),
	google_safesearch: z.boolean().optional(),
	bing_safe_search: z.boolean().optional(),
	duck_duck_go_safe_search: z.boolean().optional(),
	ecosia_safesearch: z.boolean().optional(),
	youtube_restricted: z.boolean().optional(),
	youtube_restricted_level: z.enum(['strict', 'none']).optional(),
	interstitial: z.boolean().optional(),
	policy_ip_id: z.number().int().optional(),
	whitelist_domains: z.array(z.string()).optional(),
	blacklist_domains: z.array(z.string()).optional(),
	blacklist_categories: z.array(z.number().int()).optional(),
	is_global_policy: z.boolean().optional(),
	allow_applications: z.array(z.string()).optional(),
	block_applications: z.array(z.string()).optional(),
	lock_version: z.number().int().optional(),
	yandex_safe_search: z.boolean().optional(),
	allow_list_only: z.boolean().optional(),
});
export type PolicyCreate = z.infer<typeof PolicyCreateSchema>;

export const PolicyCreateSpecSchema = z.object({
	policy: PolicyCreateSchema,
	include_relationships: z.boolean().optional(),
	append_domains: z.boolean().optional(),
});
export type PolicyCreateSpec = z.infer<typeof PolicyCreateSpecSchema>;

export const PolicyApplicationSpecSchema = z.object({
	application: ApplicationSchema.optional(),
	organization: OrganizationSchema.optional(),
	allow_policies: z.array(PolicySpecSchema).optional(),
	block_policies: z.array(PolicySpecSchema).optional(),
});
export type PolicyApplicationSpec = z.infer<typeof PolicyApplicationSpecSchema>;

export const PolicyUpdateSingleDomainSpecSchema = z.object({
	domain: z.string(),
	note: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PolicyUpdateSingleDomainSpec = z.infer<
	typeof PolicyUpdateSingleDomainSpecSchema
>;

export const PolicyUpdateSingleCategorySpecSchema = z.object({
	category_id: z.number().int(),
	include_relationships: z.boolean().optional(),
});
export type PolicyUpdateSingleCategorySpec = z.infer<
	typeof PolicyUpdateSingleCategorySpecSchema
>;

export const PolicyUpdateSingleApplicationSpecSchema = z.object({
	name: z.string(),
	include_relationships: z.boolean().optional(),
});
export type PolicyUpdateSingleApplicationSpec = z.infer<
	typeof PolicyUpdateSingleApplicationSpecSchema
>;

export const PolicyPermissiveModeSpecSchema = z.object({
	permissive_mode: z.boolean().optional(),
});
export type PolicyPermissiveModeSpec = z.infer<
	typeof PolicyPermissiveModeSpecSchema
>;

export const PolicyIpSchema = z.object({
	friendly_id: z.number().int().optional(),
	primary_address: z.string().optional(),
	secondary_address: z.string().optional(),
});
export type PolicyIp = z.infer<typeof PolicyIpSchema>;

export const PolicyIpSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: PolicyIpSchema.optional(),
});
export type PolicyIpSpec = z.infer<typeof PolicyIpSpecSchema>;

export const ScheduledPolicySchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	policy_ids: z.array(z.number().int()).optional(),
	timezone: z.string().optional(),
});
export type ScheduledPolicy = z.infer<typeof ScheduledPolicySchema>;

export const ScheduledReportPreviewCreateSchema = z.object({
	organization_id: z.number().int().optional(),
	include_threat_summary: z.boolean().optional(),
	include_content_category_summary: z.boolean().optional(),
	content_categories_show_count: z
		.enum(['all_categories', 'top5', 'top10', 'top15'])
		.optional(),
});
export type ScheduledReportPreviewCreate = z.infer<
	typeof ScheduledReportPreviewCreateSchema
>;

export const ScheduledReportPreviewSchema = z.object({
	organization_id: z.number().int().optional(),
	include_threat_summary: z.boolean().optional(),
	include_content_category_summary: z.boolean().optional(),
	content_categories_show_count: z
		.enum(['all_categories', 'top5', 'top10', 'top15'])
		.optional(),
	url: z.string().optional(),
});
export type ScheduledReportPreview = z.infer<
	typeof ScheduledReportPreviewSchema
>;

export const ScheduledReportPreviewSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ScheduledReportPreviewSchema.optional(),
});
export type ScheduledReportPreviewSpec = z.infer<
	typeof ScheduledReportPreviewSpecSchema
>;

export const ScheduledReportRecipientSchema = z.object({
	email: z.string().optional(),
	organization: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});
export type ScheduledReportRecipient = z.infer<
	typeof ScheduledReportRecipientSchema
>;

export const ScheduledReportSchema = z.object({
	organization_id: z.number().int().optional(),
	frequency: z.enum(['monthly', 'bi_weekly', 'weekly']).optional(),
	day_of_week: z
		.enum([
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		])
		.optional(),
	include_threat_summary: z.boolean().optional(),
	include_content_category_summary: z.boolean().optional(),
	content_categories_show_count: z
		.enum(['all_categories', 'top5', 'top10', 'top15'])
		.optional(),
	send_to_dashboard_users: z.boolean().optional(),
	scheduled_report_recipients: z
		.array(ScheduledReportRecipientSchema)
		.optional(),
	selected_sub_orgs: z.array(z.number().int()).optional(),
});
export type ScheduledReport = z.infer<typeof ScheduledReportSchema>;

export const ScheduledReportSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ScheduledReportSchema.optional(),
});
export type ScheduledReportSpec = z.infer<typeof ScheduledReportSpecSchema>;

export const TrafficReportsTotalRequestsResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsResult = z.infer<
	typeof TrafficReportsTotalRequestsResultSchema
>;

export const TrafficReportsTotalRequestsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalRequestsResultSchema).optional(),
});
export type TrafficReportsTotalRequests = z.infer<
	typeof TrafficReportsTotalRequestsSchema
>;

export const TrafficReportsTotalRequestsGeoResultSchema = z.object({
	network_id: z.number().int().optional(),
	total_requests: z.number().int().optional(),
	qps: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsGeoResult = z.infer<
	typeof TrafficReportsTotalRequestsGeoResultSchema
>;

export const TrafficReportsTotalRequestsGeoSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.string()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalRequestsGeoResultSchema).optional(),
});
export type TrafficReportsTotalRequestsGeo = z.infer<
	typeof TrafficReportsTotalRequestsGeoSchema
>;

export const TrafficReportsTotalRequestsOrganizationsResultSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsOrganizationsResult = z.infer<
	typeof TrafficReportsTotalRequestsOrganizationsResultSchema
>;

export const TrafficReportsTotalRequestsOrganizationsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z
		.array(TrafficReportsTotalRequestsOrganizationsResultSchema)
		.optional(),
});
export type TrafficReportsTotalRequestsOrganizations = z.infer<
	typeof TrafficReportsTotalRequestsOrganizationsSchema
>;

export const TrafficReportsTotalRequestsAgentsResultSchema = z.object({
	agent_id: z.string().optional(),
	agent_type: z.string().optional(),
	agent_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsAgentsResult = z.infer<
	typeof TrafficReportsTotalRequestsAgentsResultSchema
>;

export const TrafficReportsTotalRequestsAgentsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	agent_ids: z.array(z.string()).optional(),
	agent_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalRequestsAgentsResultSchema).optional(),
});
export type TrafficReportsTotalRequestsAgents = z.infer<
	typeof TrafficReportsTotalRequestsAgentsSchema
>;

export const TrafficReportsTotalRequestsUsersResultSchema = z.object({
	user_id: z.number().int().optional(),
	user_name: z.string().optional(),
	user_login: z.string().optional(),
	bucket: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsUsersResult = z.infer<
	typeof TrafficReportsTotalRequestsUsersResultSchema
>;

export const TrafficReportsTotalRequestsUsersSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalRequestsUsersResultSchema).optional(),
});
export type TrafficReportsTotalRequestsUsers = z.infer<
	typeof TrafficReportsTotalRequestsUsersSchema
>;

export const TrafficReportsTotalRequestsCollectionsResultSchema = z.object({
	collection_id: z.number().int().optional(),
	collection_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalRequestsCollectionsResult = z.infer<
	typeof TrafficReportsTotalRequestsCollectionsResultSchema
>;

export const TrafficReportsTotalThreatsResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalThreatsResult = z.infer<
	typeof TrafficReportsTotalThreatsResultSchema
>;

export const TrafficReportsTotalThreatsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalThreatsResultSchema).optional(),
});
export type TrafficReportsTotalThreats = z.infer<
	typeof TrafficReportsTotalThreatsSchema
>;

export const TrafficReportsTotalThreatsOrganizationsResultSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalThreatsOrganizationsResult = z.infer<
	typeof TrafficReportsTotalThreatsOrganizationsResultSchema
>;

export const TrafficReportsTotalThreatsOrganizationsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	agent_ids: z.array(z.string()).optional(),
	agent_names: z.array(z.string()).optional(),
	values: z
		.array(TrafficReportsTotalThreatsOrganizationsResultSchema)
		.optional(),
});
export type TrafficReportsTotalThreatsOrganizations = z.infer<
	typeof TrafficReportsTotalThreatsOrganizationsSchema
>;

export const TrafficReportsTotalThreatsUsersResultSchema = z.object({
	user_id: z.number().int().optional(),
	user_name: z.string().optional(),
	user_login: z.string().optional(),
	bucket: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalThreatsUsersResult = z.infer<
	typeof TrafficReportsTotalThreatsUsersResultSchema
>;

export const TrafficReportsTotalThreatsUsersSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalThreatsUsersResultSchema).optional(),
});
export type TrafficReportsTotalThreatsUsers = z.infer<
	typeof TrafficReportsTotalThreatsUsersSchema
>;

export const TrafficReportsTotalCategoriesResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	category_id: z.number().int().optional(),
	category_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalCategoriesResult = z.infer<
	typeof TrafficReportsTotalCategoriesResultSchema
>;

export const TrafficReportsTotalCategoriesSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	category_ids: z.array(z.number().int()).optional(),
	category_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalCategoriesResultSchema).optional(),
});
export type TrafficReportsTotalCategories = z.infer<
	typeof TrafficReportsTotalCategoriesSchema
>;

export const TrafficReportsTotalCategoriesOrganizationsResultSchema = z.object({
	category_id: z.number().int().optional(),
	category_name: z.string().optional(),
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalCategoriesOrganizationsResult = z.infer<
	typeof TrafficReportsTotalCategoriesOrganizationsResultSchema
>;

export const TrafficReportsTotalCategoriesOrganizationsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	category_ids: z.array(z.number().int()).optional(),
	category_names: z.array(z.string()).optional(),
	values: z
		.array(TrafficReportsTotalCategoriesOrganizationsResultSchema)
		.optional(),
});
export type TrafficReportsTotalCategoriesOrganizations = z.infer<
	typeof TrafficReportsTotalCategoriesOrganizationsSchema
>;

export const TrafficReportsTotalDomainsResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	domain: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalDomainsResult = z.infer<
	typeof TrafficReportsTotalDomainsResultSchema
>;

export const TrafficReportsTotalDomainsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalDomainsResultSchema).optional(),
});
export type TrafficReportsTotalDomains = z.infer<
	typeof TrafficReportsTotalDomainsSchema
>;

export const TrafficReportsTotalDomainsOrganizationsResultSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	domain: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalDomainsOrganizationsResult = z.infer<
	typeof TrafficReportsTotalDomainsOrganizationsResultSchema
>;

export const TrafficReportsTotalDomainsOrganizationsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z
		.array(TrafficReportsTotalDomainsOrganizationsResultSchema)
		.optional(),
});
export type TrafficReportsTotalDomainsOrganizations = z.infer<
	typeof TrafficReportsTotalDomainsOrganizationsSchema
>;

export const TrafficReportsTotalDomainsUsersResultSchema = z.object({
	user_id: z.number().int().optional(),
	user_name: z.string().optional(),
	user_login: z.string().optional(),
	domain: z.string().optional(),
	bucket: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTotalDomainsUsersResult = z.infer<
	typeof TrafficReportsTotalDomainsUsersResultSchema
>;

export const TrafficReportsTotalDomainsUsersSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	user_ids: z.array(z.number().int()).optional(),
	user_names: z.array(z.string()).optional(),
	user_logins: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalDomainsUsersResultSchema).optional(),
});
export type TrafficReportsTotalDomainsUsers = z.infer<
	typeof TrafficReportsTotalDomainsUsersSchema
>;

export const TrafficReportsQpsResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	bucket: z.string().optional(),
	qps: z.number().optional(),
	qps_networks: z.number().optional(),
	qps_proxies: z.number().optional(),
	qps_agents: z.number().optional(),
});
export type TrafficReportsQpsResult = z.infer<
	typeof TrafficReportsQpsResultSchema
>;

export const TrafficReportsQpsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsQpsResultSchema).optional(),
});
export type TrafficReportsQps = z.infer<typeof TrafficReportsQpsSchema>;

export const TrafficReportsQpsActiveOrganizationsResultSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	bucket: z.string().optional(),
	qps: z.number().optional(),
	qps_networks: z.number().optional(),
	qps_proxies: z.number().optional(),
	qps_agents: z.number().optional(),
});
export type TrafficReportsQpsActiveOrganizationsResult = z.infer<
	typeof TrafficReportsQpsActiveOrganizationsResultSchema
>;

export const TrafficReportsQpsActiveOrganizationsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsQpsActiveOrganizationsResultSchema).optional(),
});
export type TrafficReportsQpsActiveOrganizations = z.infer<
	typeof TrafficReportsQpsActiveOrganizationsSchema
>;

export const TrafficReportsQpsActiveAgentsResultSchema = z.object({
	agent_id: z.string().optional(),
	agent_name: z.string().optional(),
	bucket: z.string().optional(),
	qps: z.number().optional(),
	qps_networks: z.number().optional(),
	qps_proxies: z.number().optional(),
	qps_agents: z.number().optional(),
});
export type TrafficReportsQpsActiveAgentsResult = z.infer<
	typeof TrafficReportsQpsActiveAgentsResultSchema
>;

export const TrafficReportsQpsActiveAgentsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	agent_ids: z.array(z.string()).optional(),
	agent_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsQpsActiveAgentsResultSchema).optional(),
});
export type TrafficReportsQpsActiveAgents = z.infer<
	typeof TrafficReportsQpsActiveAgentsSchema
>;

export const TrafficReportsPaginationRequestSchema = z.object({
	number: z.number().int().optional(),
	size: z.number().int().optional(),
});
export type TrafficReportsPaginationRequest = z.infer<
	typeof TrafficReportsPaginationRequestSchema
>;

export const TrafficReportsTopDomainsResultSchema = z.object({
	domain: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
	allowed: z.array(z.number().int()).optional(),
	allowed_names: z.array(z.string()).optional(),
	blocked: z.array(z.number().int()).optional(),
	blocked_names: z.array(z.string()).optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	organizations: z.array(z.number().int()).optional(),
	networks: z.array(z.number().int()).optional(),
	agents: z.array(z.string()).optional(),
	collections: z.array(z.number().int()).optional(),
	users: z.array(z.number().int()).optional(),
});
export type TrafficReportsTopDomainsResult = z.infer<
	typeof TrafficReportsTopDomainsResultSchema
>;

export const TrafficReportsPaginationResponseSchema = z.object({
	size: z.number().int().optional(),
	total: z.number().int().optional(),
	first: z.number().int().optional(),
	last: z.number().int().optional(),
	self: z.number().int().optional(),
	prev: z.number().int().optional(),
	next: z.number().int().optional(),
});
export type TrafficReportsPaginationResponse = z.infer<
	typeof TrafficReportsPaginationResponseSchema
>;

export const TrafficReportsTopDomainsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopDomainsResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopDomains = z.infer<
	typeof TrafficReportsTopDomainsSchema
>;

export const TrafficReportsTopCategoriesResultSchema = z.object({
	categoryid: z.number().int().optional(),
	category_id: z.number().int().optional(),
	category_name: z.string().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
	organizations: z.array(z.number().int()).optional(),
	networks: z.array(z.number().int()).optional(),
	agents: z.array(z.string()).optional(),
	collections: z.array(z.number().int()).optional(),
	users: z.array(z.number().int()).optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
});
export type TrafficReportsTopCategoriesResult = z.infer<
	typeof TrafficReportsTopCategoriesResultSchema
>;

export const TrafficReportsTopCategoriesSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopCategoriesResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopCategories = z.infer<
	typeof TrafficReportsTopCategoriesSchema
>;

export const TrafficReportsTopNetworksResultSchema = z.object({
	network_id: z.number().int().optional(),
	network_name: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
});
export type TrafficReportsTopNetworksResult = z.infer<
	typeof TrafficReportsTopNetworksResultSchema
>;

export const TrafficReportsTopNetworksSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	network_ids: z.array(z.number().int()).optional(),
	network_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopNetworksResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopNetworks = z.infer<
	typeof TrafficReportsTopNetworksSchema
>;

export const TrafficReportsTopAgentsResultSchema = z.object({
	agent_id: z.string().optional(),
	agent_type: z.string().optional(),
	agent_name: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
});
export type TrafficReportsTopAgentsResult = z.infer<
	typeof TrafficReportsTopAgentsResultSchema
>;

export const TrafficReportsTopAgentsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	agent_ids: z.array(z.string()).optional(),
	agent_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopAgentsResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopAgents = z.infer<
	typeof TrafficReportsTopAgentsSchema
>;

export const TrafficReportsTopUsersResultSchema = z.object({
	user_id: z.number().int().optional(),
	user_name: z.string().optional(),
	user_login: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
});
export type TrafficReportsTopUsersResult = z.infer<
	typeof TrafficReportsTopUsersResultSchema
>;

export const TrafficReportsTopUsersSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	user_ids: z.array(z.number().int()).optional(),
	user_names: z.array(z.string()).optional(),
	user_logins: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopUsersResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopUsers = z.infer<
	typeof TrafficReportsTopUsersSchema
>;

export const TrafficReportsTopCollectionsResultSchema = z.object({
	collection_id: z.number().int().optional(),
	collection_name: z.string().optional(),
	total: z.number().int().optional(),
	total_networks: z.number().int().optional(),
	total_proxies: z.number().int().optional(),
	total_agents: z.number().int().optional(),
	policies: z.array(z.number().int()).optional(),
	policies_names: z.array(z.string()).optional(),
	scheduled_policies: z.array(z.number().int()).optional(),
	scheduled_policies_names: z.array(z.string()).optional(),
});
export type TrafficReportsTopCollectionsResult = z.infer<
	typeof TrafficReportsTopCollectionsResultSchema
>;

export const TrafficReportsTopCollectionsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	collection_ids: z.array(z.number().int()).optional(),
	collection_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTopCollectionsResultSchema).optional(),
	page: TrafficReportsPaginationResponseSchema.optional(),
});
export type TrafficReportsTopCollections = z.infer<
	typeof TrafficReportsTopCollectionsSchema
>;

export const TrafficReportsCursorPaginationRequestSchema = z.object({
	size: z.number().int().optional(),
	cursor: z.string().optional(),
	cursor_offset: z.number().int().optional(),
});
export type TrafficReportsCursorPaginationRequest = z.infer<
	typeof TrafficReportsCursorPaginationRequestSchema
>;

export const TrafficReportsQueryLogsPageRequestSchema = z.object({
	number: z.number().int().optional(),
	size: z.number().int().optional(),
	cursor: z.string().optional(),
	cursor_offset: z.number().int().optional(),
});
export type TrafficReportsQueryLogsPageRequest = z.infer<
	typeof TrafficReportsQueryLogsPageRequestSchema
>;

export const TrafficReportsQueryLogsResultSchema = z.object({
	time: z.string().optional(),
	fqdn: z.string().optional(),
	networkid: z.number().int().optional(),
	request_address: z.string().optional(),
	domain: z.string().optional(),
	result: z.enum(['allowed', 'blocked']).optional(),
	threat: z.boolean().optional(),
	categories: z.array(z.number().int()).optional(),
	server_id: z.number().int().optional(),
	server_address: z.string().optional(),
	method: z.number().int().optional(),
	responsetime: z.number().int().optional(),
	agentid: z.string().optional(),
	agentname: z.string().optional(),
	agenttype: z.enum(['proxy', 'agent', 'clientless']).optional(),
	agent_type_raw: z.string().optional(),
	local_ipv4_address: z.string().optional(),
	local_ipv6_address: z.string().optional(),
	local_user_id: z.number().int().optional(),
	local_user_remote_id: z.string().optional(),
	local_user_login: z.string().optional(),
	local_user_name: z.string().optional(),
	lan_device_name: z.string().optional(),
	network_name: z.string().optional(),
	server_name: z.string().optional(),
	method_name: z.string().optional(),
	categories_names: z.array(z.string()).optional(),
	policy_id: z.number().int().optional(),
	policy_name: z.string().optional(),
	scheduled_policy_id: z.number().int().optional(),
	scheduled_policy_name: z.string().optional(),
	collection_id: z.number().int().optional(),
	collection_name: z.string().optional(),
	collections: z.array(z.number().int()).optional(),
	collections_names: z.array(z.string()).optional(),
	mac_address: z.string().optional(),
	application_id: z.number().int().optional(),
	application_name: z.string().optional(),
	application_category_id: z.number().int().optional(),
	application_category_name: z.string().optional(),
	protocol: z.string().optional(),
	question_type: z.string().optional(),
	response_ips: z.array(z.string()).optional(),
	region: z.string().optional(),
});
export type TrafficReportsQueryLogsResult = z.infer<
	typeof TrafficReportsQueryLogsResultSchema
>;

export const TrafficReportsCursorPaginationResponseSchema = z.object({
	size: z.number().int().optional(),
	total: z.number().int().optional(),
	cursor: z.string().optional(),
	cursor_offset: z.number().int().optional(),
});
export type TrafficReportsCursorPaginationResponse = z.infer<
	typeof TrafficReportsCursorPaginationResponseSchema
>;

export const TrafficReportsQueryLogsPageResponseSchema = z.object({
	size: z.number().int().optional(),
	total: z.number().int().optional(),
	first: z.number().int().optional(),
	last: z.number().int().optional(),
	self: z.number().int().optional(),
	prev: z.number().int().optional(),
	next: z.number().int().optional(),
	cursor: z.string().optional(),
	cursor_offset: z.number().int().optional(),
});
export type TrafficReportsQueryLogsPageResponse = z.infer<
	typeof TrafficReportsQueryLogsPageResponseSchema
>;

export const TrafficReportsQueryLogsSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.string()).optional(),
	organization_name: z.string().optional(),
	organization_names: z.array(z.string()).optional(),
	network_id: z.number().int().optional(),
	network_ids: z.array(z.string()).optional(),
	client_id: z.string().optional(),
	client_ids: z.array(z.string()).optional(),
	user_id: z.number().int().optional(),
	user_ids: z.array(z.string()).optional(),
	collection_id: z.number().int().optional(),
	collection_ids: z.array(z.string()).optional(),
	values: z.array(TrafficReportsQueryLogsResultSchema).optional(),
	page: TrafficReportsQueryLogsPageResponseSchema.optional(),
});
export type TrafficReportsQueryLogs = z.infer<
	typeof TrafficReportsQueryLogsSchema
>;

export const TrafficReportsTotalOrganizationsStatsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	threat_requests: z.number().int().optional(),
});
export type TrafficReportsTotalOrganizationsStats = z.infer<
	typeof TrafficReportsTotalOrganizationsStatsSchema
>;

export const TrafficReportsTotalDomainStatsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	threat_requests: z.number().int().optional(),
});
export type TrafficReportsTotalDomainStats = z.infer<
	typeof TrafficReportsTotalDomainStatsSchema
>;

export const TrafficReportsTotalCategoryStatsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	threat_requests: z.number().int().optional(),
});
export type TrafficReportsTotalCategoryStats = z.infer<
	typeof TrafficReportsTotalCategoryStatsSchema
>;

export const TrafficReportsTotalOrganizationsRequestsResultSchema = z.object({
	bucket: z.string().optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	threat_requests: z.number().int().optional(),
});
export type TrafficReportsTotalOrganizationsRequestsResult = z.infer<
	typeof TrafficReportsTotalOrganizationsRequestsResultSchema
>;

export const TrafficReportsTotalOrganizationsRequestsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z
		.array(TrafficReportsTotalOrganizationsRequestsResultSchema)
		.optional(),
});
export type TrafficReportsTotalOrganizationsRequests = z.infer<
	typeof TrafficReportsTotalOrganizationsRequestsSchema
>;

export const TrafficReportsTopOrganizationsRequestsResultSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	total_requests: z.number().int().optional(),
});
export type TrafficReportsTopOrganizationsRequestsResult = z.infer<
	typeof TrafficReportsTopOrganizationsRequestsResultSchema
>;

export const TrafficReportsTopOrganizationsRequestsSchema = z.object({
	values: z
		.array(TrafficReportsTopOrganizationsRequestsResultSchema)
		.optional(),
});
export type TrafficReportsTopOrganizationsRequests = z.infer<
	typeof TrafficReportsTopOrganizationsRequestsSchema
>;

export const TrafficReportsTotalClientStatsSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	total_users: z.number().int().optional(),
	active_users: z.number().int().optional(),
	total_sites: z.number().int().optional(),
	active_sites: z.number().int().optional(),
	total_roaming_clients: z.number().int().optional(),
	active_roaming_clients: z.number().int().optional(),
	total_relays: z.number().int().optional(),
	active_relays: z.number().int().optional(),
});
export type TrafficReportsTotalClientStats = z.infer<
	typeof TrafficReportsTotalClientStatsSchema
>;

export const TrafficReportsTotalDeploymentsSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_name: z.string().optional(),
	collections: z.number().int().optional(),
	user_agents: z.number().int().optional(),
	sync_tools: z.number().int().optional(),
	relays: z.number().int().optional(),
	users: z.number().int().optional(),
});
export type TrafficReportsTotalDeployments = z.infer<
	typeof TrafficReportsTotalDeploymentsSchema
>;

export const TrafficReportsTotalRoamingClientsResultSchema = z.object({
	os: z.string().optional(),
	value: z.number().int().optional(),
});
export type TrafficReportsTotalRoamingClientsResult = z.infer<
	typeof TrafficReportsTotalRoamingClientsResultSchema
>;

export const TrafficReportsTotalRoamingClientsSchema = z.object({
	organization_ids: z.array(z.number().int()).optional(),
	organization_names: z.array(z.string()).optional(),
	values: z.array(TrafficReportsTotalRoamingClientsResultSchema).optional(),
});
export type TrafficReportsTotalRoamingClients = z.infer<
	typeof TrafficReportsTotalRoamingClientsSchema
>;

export const TrafficReportsTotalApplicationsStatsResultSchema = z.object({
	application_id: z.number().int().optional(),
	application_name: z.string().optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	previous_total_requests: z.number().int().optional(),
	most_recent_bucket: z.string().optional(),
	application_category_id: z.number().int().optional(),
	application_category_name: z.string().optional(),
});
export type TrafficReportsTotalApplicationsStatsResult = z.infer<
	typeof TrafficReportsTotalApplicationsStatsResultSchema
>;

export const TrafficReportsTotalApplicationsStatsSchema = z.object({
	values: z.array(TrafficReportsTotalApplicationsStatsResultSchema).optional(),
});
export type TrafficReportsTotalApplicationsStats = z.infer<
	typeof TrafficReportsTotalApplicationsStatsSchema
>;

export const TrafficReportsTotalApplicationsNetworksStatsResultSchema =
	z.object({
		network_id: z.number().int().optional(),
		network_name: z.string().optional(),
		total_requests: z.number().int().optional(),
		allowed_requests: z.number().int().optional(),
		blocked_requests: z.number().int().optional(),
		previous_total_requests: z.number().int().optional(),
		most_recent_bucket: z.string().optional(),
	});
export type TrafficReportsTotalApplicationsNetworksStatsResult = z.infer<
	typeof TrafficReportsTotalApplicationsNetworksStatsResultSchema
>;

export const TrafficReportsTotalApplicationsNetworksStatsSchema = z.object({
	values: z
		.array(TrafficReportsTotalApplicationsNetworksStatsResultSchema)
		.optional(),
});
export type TrafficReportsTotalApplicationsNetworksStats = z.infer<
	typeof TrafficReportsTotalApplicationsNetworksStatsSchema
>;

export const TrafficReportsTotalApplicationsAgentsStatsResultSchema = z.object({
	agent_id: z.string().optional(),
	agent_type: z.string().optional(),
	agent_name: z.string().optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	previous_total_requests: z.number().int().optional(),
	most_recent_bucket: z.string().optional(),
});
export type TrafficReportsTotalApplicationsAgentsStatsResult = z.infer<
	typeof TrafficReportsTotalApplicationsAgentsStatsResultSchema
>;

export const TrafficReportsTotalApplicationsAgentsStatsSchema = z.object({
	values: z
		.array(TrafficReportsTotalApplicationsAgentsStatsResultSchema)
		.optional(),
});
export type TrafficReportsTotalApplicationsAgentsStats = z.infer<
	typeof TrafficReportsTotalApplicationsAgentsStatsSchema
>;

export const TrafficReportsTotalApplicationsUsersStatsResultSchema = z.object({
	user_id: z.number().int().optional(),
	user_name: z.string().optional(),
	user_login: z.string().optional(),
	total_requests: z.number().int().optional(),
	allowed_requests: z.number().int().optional(),
	blocked_requests: z.number().int().optional(),
	previous_total_requests: z.number().int().optional(),
	most_recent_bucket: z.string().optional(),
});
export type TrafficReportsTotalApplicationsUsersStatsResult = z.infer<
	typeof TrafficReportsTotalApplicationsUsersStatsResultSchema
>;

export const TrafficReportsTotalApplicationsUsersStatsSchema = z.object({
	values: z
		.array(TrafficReportsTotalApplicationsUsersStatsResultSchema)
		.optional(),
});
export type TrafficReportsTotalApplicationsUsersStats = z.infer<
	typeof TrafficReportsTotalApplicationsUsersStatsSchema
>;

export const TrafficReportsTotalApplicationsCollectionsStatsResultSchema =
	z.object({
		collection_id: z.number().int().optional(),
		collection_name: z.string().optional(),
		total_requests: z.number().int().optional(),
		allowed_requests: z.number().int().optional(),
		blocked_requests: z.number().int().optional(),
		previous_total_requests: z.number().int().optional(),
		most_recent_bucket: z.string().optional(),
	});
export type TrafficReportsTotalApplicationsCollectionsStatsResult = z.infer<
	typeof TrafficReportsTotalApplicationsCollectionsStatsResultSchema
>;

export const TrafficReportsTotalApplicationsCollectionsStatsSchema = z.object({
	values: z
		.array(TrafficReportsTotalApplicationsCollectionsStatsResultSchema)
		.optional(),
});
export type TrafficReportsTotalApplicationsCollectionsStats = z.infer<
	typeof TrafficReportsTotalApplicationsCollectionsStatsSchema
>;

export const TrialCreateSchema = z.object({
	organization_id: z.number().int().optional(),
	sku: z.string().optional(),
});
export type TrialCreate = z.infer<typeof TrialCreateSchema>;

export const TrialSpecSchema = z.object({
	entitlement_key: z.string().optional(),
	entitlement_name: z.string().optional(),
	skus: z.array(z.string()).optional(),
	addon: z.string().optional(),
	addon_sku: z.string().optional(),
	in_use: z.boolean().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	grace_period: z.string().optional(),
	active: z.boolean().optional(),
});
export type TrialSpec = z.infer<typeof TrialSpecSchema>;

export const UserAgentBulkDeleteCreateSchema = z.object({
	ids: z.array(z.string()).optional(),
	exclude_ids: z.array(z.string()).optional(),
});
export type UserAgentBulkDeleteCreate = z.infer<
	typeof UserAgentBulkDeleteCreateSchema
>;

export const UserAgentBulkDeleteSchema = z.object({
	organization_id: z.number().int().optional(),
	completed: z.boolean().optional(),
	count: z.number().int().optional(),
	queue_uninstall: z.boolean().optional(),
});
export type UserAgentBulkDelete = z.infer<typeof UserAgentBulkDeleteSchema>;

export const UserAgentBulkDeleteCountsSchema = z.object({
	uninstall_and_delete: z.number().int().optional(),
	delete: z.number().int().optional(),
});
export type UserAgentBulkDeleteCounts = z.infer<
	typeof UserAgentBulkDeleteCountsSchema
>;

export const DeviceSettingBulkAttributesSchema = z.object({
	enable_cyber_sight: z.boolean().optional(),
	enable_filtering_client: z.boolean().optional(),
	diagnostics_level: z
		.enum([
			'unknown',
			'trace',
			'debug',
			'information',
			'warning',
			'error',
			'critical',
		])
		.optional(),
});
export type DeviceSettingBulkAttributes = z.infer<
	typeof DeviceSettingBulkAttributesSchema
>;

export const FilteringClientSettingBulkAttributesSchema = z.object({
	connection_method: z
		.enum(['unknown', 'transparent_proxy', 'loopback'])
		.optional(),
	filtering_method: z.enum(['unknown', 'precheck', 'dns_filtering']).optional(),
	fail_over_method: z.enum(['unknown', 'fail_open', 'fail_close']).optional(),
});
export type FilteringClientSettingBulkAttributes = z.infer<
	typeof FilteringClientSettingBulkAttributesSchema
>;

export const VpnSettingsUserAgentAttributesSchema = z.object({
	_destroy: z.boolean().optional(),
	vpn_settings_state_type_id: z.number().int().optional(),
});
export type VpnSettingsUserAgentAttributes = z.infer<
	typeof VpnSettingsUserAgentAttributesSchema
>;

export const UserAgentBulkUpdateCreateChangesetSchema = z.object({
	network_id: z.number().int().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
	friendly_name: z.string().optional(),
	tags: z.array(z.string()).optional(),
	release_channels: z.array(z.string()).optional(),
	device_setting_attributes: DeviceSettingBulkAttributesSchema.optional(),
	filtering_client_setting_attributes:
		FilteringClientSettingBulkAttributesSchema.optional(),
	vpn_settings_user_agent: VpnSettingsUserAgentAttributesSchema.optional(),
});
export type UserAgentBulkUpdateCreateChangeset = z.infer<
	typeof UserAgentBulkUpdateCreateChangesetSchema
>;

export const UserAgentBulkUpdateCreateSchema = z.object({
	ids: z.array(z.string()).optional(),
	exclude_ids: z.array(z.string()).optional(),
	changeset: UserAgentBulkUpdateCreateChangesetSchema.optional(),
});
export type UserAgentBulkUpdateCreate = z.infer<
	typeof UserAgentBulkUpdateCreateSchema
>;

export const UserAgentBulkUpdateSchema = z.object({
	organization_id: z.number().int().optional(),
	completed: z.boolean().optional(),
	count: z.number().int().optional(),
});
export type UserAgentBulkUpdate = z.infer<typeof UserAgentBulkUpdateSchema>;

export const UserAgentBulkUpdateHasMixedRequestSchema = z.object({
	ids: z.array(z.string()).optional(),
});
export type UserAgentBulkUpdateHasMixedRequest = z.infer<
	typeof UserAgentBulkUpdateHasMixedRequestSchema
>;

export const UserAgentBulkUpdateHasMixedSchema = z.object({
	siteMixed: z.boolean().optional(),
	tagsMixed: z.boolean().optional(),
	policyMixed: z.boolean().optional(),
	blockPageMixed: z.boolean().optional(),
});
export type UserAgentBulkUpdateHasMixed = z.infer<
	typeof UserAgentBulkUpdateHasMixedSchema
>;

export const UserAgentCleanupCreateSchema = z.object({
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()),
	inactive_for: z.number().int(),
});
export type UserAgentCleanupCreate = z.infer<
	typeof UserAgentCleanupCreateSchema
>;

export const UserAgentCleanupSchema = z.object({
	inactive_for: z.number().int().optional(),
	organization_id: z.number().int().optional(),
	organization_ids: z.array(z.number().int()).optional(),
	query_completed: z.boolean().optional(),
	started: z.boolean().optional(),
	completed: z.boolean().optional(),
	to_delete: z.array(z.string()).optional(),
	agents_to_delete: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().optional(),
				organization_name: z.string().optional(),
			}),
		)
		.optional(),
});
export type UserAgentCleanup = z.infer<typeof UserAgentCleanupSchema>;

export const UserAgentCleanupUpdateSchema = z.object({
	start: z.boolean().optional(),
	inactive_for: z.number().int().optional(),
});
export type UserAgentCleanupUpdate = z.infer<
	typeof UserAgentCleanupUpdateSchema
>;

export const UserAgentReleaseSchema = z.object({
	agent_type: z.enum(['windows', 'macos']).optional(),
	architecture: z.enum(['x86', 'x86_64']).optional(),
	agent_version: z.string().optional(),
	white_label: z.boolean().optional(),
	release_channels: z
		.array(
			z.object({
				label: z.string().optional(),
				value: z.string().optional(),
				visible: z.boolean().optional(),
			}),
		)
		.optional(),
	url: z.string().optional(),
});
export type UserAgentRelease = z.infer<typeof UserAgentReleaseSchema>;

export const UserAgentFilteringClientSettingSchema = z.object({
	auto_updates: z.boolean().optional(),
	connection_method: z
		.enum(['inherit', 'transparent_prox', 'loopback'])
		.optional(),
	filtering_method: z.enum(['inherit', 'precheck', 'dns_filtering']).optional(),
	fail_over_method: z.enum(['inherit', 'fail_open', 'fail_close']).optional(),
});
export type UserAgentFilteringClientSetting = z.infer<
	typeof UserAgentFilteringClientSettingSchema
>;

export const UserAgentSchema = z.object({
	agent_type: z
		.enum([
			'proxy',
			'windows',
			'macos',
			'linux',
			'android',
			'ios',
			'embedded',
			'dnsmasq',
			'fingbox',
		])
		.optional(),
	agent_version: z.string().optional(),
	client_id: z.string().optional(),
	hostname: z.string().optional(),
	status: z
		.enum([
			'active',
			'disabled',
			'uninstalled',
			'uninstalled_from_client',
			'created',
		])
		.optional(),
	os_version: z.string().optional(),
	os_name: z.string().optional(),
	friendly_name: z.string().optional(),
	tags: z.array(z.string()).optional(),
	meta: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	uninstalled_at: z.string().optional(),
	id_hex: z.string().optional(),
	id_binary: z.array(z.number().int()).optional(),
	last_sync: z.string().optional(),
	agent_state: z
		.enum(['protected', 'unprotected', 'bypassed', 'uninstalled'])
		.optional(),
	cyber_sight_client: z
		.object({
			service_state: z
				.enum(['not_installed', 'operational', 'disabled', 'error'])
				.optional(),
			chrome_extension_status: z
				.enum([
					'not_installed',
					'operational',
					'disabled',
					'error',
					'outdated',
					'install_disabled',
					'browser_not_installed',
					'not_communicating',
				])
				.optional(),
			edge_extension_status: z
				.enum([
					'not_installed',
					'operational',
					'disabled',
					'error',
					'outdated',
					'install_disabled',
					'browser_not_installed',
					'not_communicating',
				])
				.optional(),
		})
		.optional(),
	cyber_sight_client_setting: z
		.object({
			enable_browser_extension: z.boolean().optional(),
		})
		.optional(),
	device_setting: z
		.object({
			auto_updates: z.boolean().optional(),
			enable_cyber_sight: z.boolean().optional(),
		})
		.optional(),
	filtering_client_setting: UserAgentFilteringClientSettingSchema.optional(),
});
export type UserAgent = z.infer<typeof UserAgentSchema>;

export const UserAgentSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: UserAgentSchema.optional(),
	relationships: z
		.object({
			network: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
			scheduled_policy: z
				.object({
					data: IdTypeSchema.optional(),
				})
				.optional(),
		})
		.optional(),
});
export type UserAgentSpec = z.infer<typeof UserAgentSpecSchema>;

export const UserAgentCountSchema = z.object({
	count: z.number().int().optional(),
});
export type UserAgentCount = z.infer<typeof UserAgentCountSchema>;

export const LegacyUserAgentCountsSchema = z.object({
	all: z.number().int().optional(),
	protected: z.number().int().optional(),
	unprotected: z.number().int().optional(),
	bypassed: z.number().int().optional(),
	pending_uninstall: z.number().int().optional(),
	uninstalled: z.number().int().optional(),
});
export type LegacyUserAgentCounts = z.infer<typeof LegacyUserAgentCountsSchema>;

export const UserAgentPatchSchema = z.object({
	friendly_name: z.string().optional(),
	status: z.enum(['active', 'disabled', 'uninstalled']).optional(),
	network_id: z.number().int().optional(),
	policy_id: z.number().int().optional(),
	scheduled_policy_id: z.number().int().optional(),
	block_page_id: z.number().int().optional(),
	tags: z.array(z.string()).optional(),
	vpn_settings_user_agent_attributes:
		VpnSettingsUserAgentAttributesSchema.optional(),
});
export type UserAgentPatch = z.infer<typeof UserAgentPatchSchema>;

export const UserAgentPatchSpecSchema = z.object({
	user_agent: UserAgentPatchSchema,
});
export type UserAgentPatchSpec = z.infer<typeof UserAgentPatchSpecSchema>;

export const LicenseWarningSuppressionDataSchema = z.object({
	warning_suppress_date: z.string().optional(),
	organization_uuid: z.string().optional(),
	user_uuid: z.string().optional(),
});
export type LicenseWarningSuppressionData = z.infer<
	typeof LicenseWarningSuppressionDataSchema
>;

export const UserUiSettingSchema = z.object({
	disable_license_warnings: z.boolean().optional(),
	user_uuid: z.string().optional(),
	theme_mode: z.string().optional(),
});
export type UserUiSetting = z.infer<typeof UserUiSettingSchema>;

export const DashboardSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
	is_public: z.boolean().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	user: z
		.object({
			id: z.number().int().optional(),
			name: z.string().optional(),
		})
		.optional(),
});
export type Dashboard = z.infer<typeof DashboardSchema>;

export const DashboardCreateSchema = z.object({
	name: z.string(),
	data: z.record(z.string(), z.unknown()),
	is_public: z.boolean().optional(),
});
export type DashboardCreate = z.infer<typeof DashboardCreateSchema>;

export const DashboardCreateSpecSchema = z.object({
	dashboard: DashboardCreateSchema,
});
export type DashboardCreateSpec = z.infer<typeof DashboardCreateSpecSchema>;

export const DashboardUpdateSchema = z.object({
	name: z.string().optional(),
	data: z.record(z.string(), z.unknown()).optional(),
	is_public: z.boolean().optional(),
});
export type DashboardUpdate = z.infer<typeof DashboardUpdateSchema>;

export const DashboardUpdateSpecSchema = z.object({
	dashboard: DashboardUpdateSchema,
});
export type DashboardUpdateSpec = z.infer<typeof DashboardUpdateSpecSchema>;

export const CyberSightActivityTypeSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	friendly_name: z.string().optional(),
	description: z.string().optional(),
});
export type CyberSightActivityType = z.infer<
	typeof CyberSightActivityTypeSchema
>;

export const VpnSettingsStateTypeSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	friendly_name: z.string().optional(),
	description: z.string().optional(),
});
export type VpnSettingsStateType = z.infer<typeof VpnSettingsStateTypeSchema>;

export const ScheduledReportV2OrganizationSpecSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
});
export type ScheduledReportV2OrganizationSpec = z.infer<
	typeof ScheduledReportV2OrganizationSpecSchema
>;

export const ScheduledReportV2RecipientSpecSchema = z.object({
	id: z.number().int().optional(),
	email: z.string().optional(),
	external: z.boolean().optional(),
	organization: ScheduledReportV2OrganizationSpecSchema.optional(),
});
export type ScheduledReportV2RecipientSpec = z.infer<
	typeof ScheduledReportV2RecipientSpecSchema
>;

export const ScheduledReportV2IndexAttributesSpecSchema = z.object({
	name: z.string().optional(),
	organization: ScheduledReportV2OrganizationSpecSchema.optional(),
	report_type: z
		.enum([
			'legacy_protection_summary_report',
			'filter_protection_overview',
			'cyber_sight_activity_overview',
			'cyber_sight_timeline',
			'cyber_sight_ai_usage',
			'cyber_sight_threat_trends',
		])
		.optional(),
	recipients: z.array(ScheduledReportV2RecipientSpecSchema).optional(),
	recipient_count: z.number().int().optional(),
	send_to_dashboard_users: z.boolean().optional(),
	frequency: z
		.enum(['monthly', 'bi_weekly', 'weekly', 'daily', 'quarterly'])
		.optional(),
	day_of_week: z
		.enum([
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		])
		.optional(),
	day_of_month: z.number().int().optional(),
	next_delivery: z.string().optional(),
	last_delivery: z.string().optional(),
	active: z.boolean().optional(),
});
export type ScheduledReportV2IndexAttributesSpec = z.infer<
	typeof ScheduledReportV2IndexAttributesSpecSchema
>;

export const ScheduledReportV2IndexSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ScheduledReportV2IndexAttributesSpecSchema.optional(),
});
export type ScheduledReportV2IndexSpec = z.infer<
	typeof ScheduledReportV2IndexSpecSchema
>;

export const ScheduledReportsV2MetaSpecSchema = z.object({
	total_count: z.number().int().optional(),
	total_pages: z.number().int().optional(),
	current_page: z.number().int().optional(),
});
export type ScheduledReportsV2MetaSpec = z.infer<
	typeof ScheduledReportsV2MetaSpecSchema
>;

export const ScheduledReportV2RecipientWriteSchema = z.object({
	email: z.string().optional(),
	external: z.boolean().optional(),
	organization: z
		.object({
			id: z.number().int().optional(),
		})
		.optional(),
});
export type ScheduledReportV2RecipientWrite = z.infer<
	typeof ScheduledReportV2RecipientWriteSchema
>;

export const ScheduledReportV2WriteSchema = z.object({
	name: z.string().optional(),
	organization_id: z.number().int().optional(),
	report_type: z
		.enum([
			'legacy_protection_summary_report',
			'filter_protection_overview',
			'cyber_sight_activity_overview',
			'cyber_sight_timeline',
			'cyber_sight_ai_usage',
			'cyber_sight_threat_trends',
		])
		.optional(),
	frequency: z
		.enum(['monthly', 'bi_weekly', 'weekly', 'daily', 'quarterly'])
		.optional(),
	day_of_week: z
		.enum([
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		])
		.optional(),
	day_of_month: z.number().int().optional(),
	active: z.boolean().optional(),
	send_to_dashboard_users: z.boolean().optional(),
	selected_sub_orgs: z.array(z.number().int()).optional(),
	include_threat_summary: z.boolean().optional(),
	include_content_category_summary: z.boolean().optional(),
	content_categories_show_count: z
		.enum(['all_categories', 'top5', 'top10', 'top15'])
		.optional(),
	scheduled_report_recipients: z
		.array(ScheduledReportV2RecipientWriteSchema)
		.optional(),
});
export type ScheduledReportV2Write = z.infer<
	typeof ScheduledReportV2WriteSchema
>;

export const ScheduledReportV2ShowAttributesSpecSchema = z.object({
	name: z.string().optional(),
	organization: ScheduledReportV2OrganizationSpecSchema.optional(),
	report_type: z
		.enum([
			'legacy_protection_summary_report',
			'filter_protection_overview',
			'cyber_sight_activity_overview',
			'cyber_sight_timeline',
			'cyber_sight_ai_usage',
			'cyber_sight_threat_trends',
		])
		.optional(),
	internal_recipients: z.array(ScheduledReportV2RecipientSpecSchema).optional(),
	external_recipients: z.array(ScheduledReportV2RecipientSpecSchema).optional(),
	recipients: z.array(ScheduledReportV2RecipientSpecSchema).optional(),
	send_to_dashboard_users: z.boolean().optional(),
	selected_sub_orgs: z.array(z.number().int()).optional(),
	frequency: z
		.enum(['monthly', 'bi_weekly', 'weekly', 'daily', 'quarterly'])
		.optional(),
	day_of_week: z
		.enum([
			'sunday',
			'monday',
			'tuesday',
			'wednesday',
			'thursday',
			'friday',
			'saturday',
		])
		.optional(),
	day_of_month: z.number().int().optional(),
	next_delivery: z.string().optional(),
	last_delivery: z.string().optional(),
	active: z.boolean().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
});
export type ScheduledReportV2ShowAttributesSpec = z.infer<
	typeof ScheduledReportV2ShowAttributesSpecSchema
>;

export const ScheduledReportV2ShowSpecSchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	uuid: z.string().optional(),
	attributes: ScheduledReportV2ShowAttributesSpecSchema.optional(),
});
export type ScheduledReportV2ShowSpec = z.infer<
	typeof ScheduledReportV2ShowSpecSchema
>;

export const ScheduledReportV2BulkUpdateSpecSchema = z.object({
	ids: z.array(z.number().int()).optional(),
	all: z.boolean().optional(),
	exclude_ids: z.array(z.number().int()).optional(),
	active: z.boolean().optional(),
});
export type ScheduledReportV2BulkUpdateSpec = z.infer<
	typeof ScheduledReportV2BulkUpdateSpecSchema
>;

export const UnblockRequestLinkedResourceSpecSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
});
export type UnblockRequestLinkedResourceSpec = z.infer<
	typeof UnblockRequestLinkedResourceSpecSchema
>;

export const UnblockRequestPolicyResourceSpecSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	is_global_policy: z.boolean().optional(),
});
export type UnblockRequestPolicyResourceSpec = z.infer<
	typeof UnblockRequestPolicyResourceSpecSchema
>;

export const UnblockRequestCategorySpecSchema = z.object({
	ids: z.array(z.number().int()).optional(),
	names: z.array(z.string()).optional(),
	is_threat: z.boolean().optional(),
});
export type UnblockRequestCategorySpec = z.infer<
	typeof UnblockRequestCategorySpecSchema
>;

export const UnblockRequestActionerSpecSchema = z.object({
	id: z.number().int().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
});
export type UnblockRequestActionerSpec = z.infer<
	typeof UnblockRequestActionerSpecSchema
>;

export const UnblockRequestAttributesSpecSchema = z.object({
	domain: z.string().optional(),
	organization: UnblockRequestLinkedResourceSpecSchema.optional(),
	site: UnblockRequestLinkedResourceSpecSchema.optional(),
	deployment: z.string().optional(),
	deployment_type: z
		.enum(['site', 'roaming_client', 'relay', 'clientless'])
		.optional(),
	policy: UnblockRequestPolicyResourceSpecSchema.optional(),
	category: UnblockRequestCategorySpecSchema.optional(),
	blocked_by: z
		.enum(['blocklist', 'appaware', 'category', 'security', 'unknown'])
		.optional(),
	time_of_attempt: z.string().optional(),
	user_agent_id: z.string().optional(),
	agent_local_user_id: z.number().int().optional(),
	logged_in_user: z.string().optional(),
	email: z.string().optional(),
	request_reason: z.string().optional(),
	can_action: z.boolean().optional(),
	actioned_by: UnblockRequestActionerSpecSchema.optional(),
	resolved_date: z.string().optional(),
	action: z
		.enum([
			'allowed',
			'denied',
			'ignored',
			'resolved_already_allowed',
			'expired',
		])
		.optional(),
	response_message: z.string().optional(),
	internal_notes: z.string().optional(),
});
export type UnblockRequestAttributesSpec = z.infer<
	typeof UnblockRequestAttributesSpecSchema
>;

export const UnblockRequestIndexSpecSchema = z.object({
	id: z.string().optional(),
	attributes: UnblockRequestAttributesSpecSchema.optional(),
});
export type UnblockRequestIndexSpec = z.infer<
	typeof UnblockRequestIndexSpecSchema
>;

export const UnblockRequestsMetaSpecSchema = z.object({
	total_count: z.number().int().optional(),
	total_pages: z.number().int().optional(),
	current_page: z.number().int().optional(),
});
export type UnblockRequestsMetaSpec = z.infer<
	typeof UnblockRequestsMetaSpecSchema
>;

export const UnblockRequestCoverageSpecSchema = z.object({
	covered: z.boolean().optional(),
	list: z.enum(['policy', 'universal_org', 'universal_msp']).optional(),
	date_added: z.string().optional(),
});
export type UnblockRequestCoverageSpec = z.infer<
	typeof UnblockRequestCoverageSpecSchema
>;

export const UnblockRequestBlastRadiusSpecSchema = z.object({
	sites: z.number().int().optional(),
	users: z.number().int().optional(),
});
export type UnblockRequestBlastRadiusSpec = z.infer<
	typeof UnblockRequestBlastRadiusSpecSchema
>;

export const UnblockRequestAllowListTargetSpecSchema = z.object({
	type: z.enum(['policy', 'universal']).optional(),
	id: z.number().int().optional(),
	name: z.string().optional(),
	affects_all: z.boolean().optional(),
	blast_radius: UnblockRequestBlastRadiusSpecSchema.optional(),
	already_on_list: z.boolean().optional(),
	date_added: z.string().optional(),
});
export type UnblockRequestAllowListTargetSpec = z.infer<
	typeof UnblockRequestAllowListTargetSpecSchema
>;

export const UnblockRequestShowAttributesSpecSchema = z.object({
	domain: z.string().optional(),
	requester_name: z.string().optional(),
	requester_email: z.string().optional(),
	request_reason: z.string().optional(),
	organization: UnblockRequestLinkedResourceSpecSchema.optional(),
	site: UnblockRequestLinkedResourceSpecSchema.optional(),
	policy: UnblockRequestLinkedResourceSpecSchema.optional(),
	logged_in_user: z.string().optional(),
	category: UnblockRequestCategorySpecSchema.optional(),
	time_of_attempt: z.string().optional(),
	already_covered: UnblockRequestCoverageSpecSchema.optional(),
	allow_list_targets: z
		.array(UnblockRequestAllowListTargetSpecSchema)
		.optional(),
});
export type UnblockRequestShowAttributesSpec = z.infer<
	typeof UnblockRequestShowAttributesSpecSchema
>;

export const UnblockRequestShowSpecSchema = z.object({
	id: z.string().optional(),
	attributes: UnblockRequestShowAttributesSpecSchema.optional(),
});
export type UnblockRequestShowSpec = z.infer<
	typeof UnblockRequestShowSpecSchema
>;

export const UnblockRequestDecisionRequestSpecSchema = z.object({
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
export type UnblockRequestDecisionRequestSpec = z.infer<
	typeof UnblockRequestDecisionRequestSpecSchema
>;

export const UnblockRequestDecisionAttributesSpecSchema = z.object({
	domain: z.string().optional(),
	status: z
		.enum([
			'allowed',
			'denied',
			'ignored',
			'resolved_already_allowed',
			'expired',
		])
		.optional(),
	decided_at: z.string().optional(),
	decided_by: UnblockRequestActionerSpecSchema.optional(),
	response_message: z.string().optional(),
	internal_notes: z.string().optional(),
});
export type UnblockRequestDecisionAttributesSpec = z.infer<
	typeof UnblockRequestDecisionAttributesSpecSchema
>;

export const UnblockRequestDecisionSpecSchema = z.object({
	id: z.string().optional(),
	attributes: UnblockRequestDecisionAttributesSpecSchema.optional(),
});
export type UnblockRequestDecisionSpec = z.infer<
	typeof UnblockRequestDecisionSpecSchema
>;

export const DeviceSettingAttributesSchema = z.object({
	id: z.string().optional(),
	enable_cyber_sight: z.boolean().optional(),
	enable_filtering_client: z.boolean().optional(),
	diagnostics_level: z
		.enum([
			'unknown',
			'trace',
			'debug',
			'information',
			'warning',
			'error',
			'critical',
		])
		.optional(),
});
export type DeviceSettingAttributes = z.infer<
	typeof DeviceSettingAttributesSchema
>;

export const FilteringClientSettingAttributesSchema = z.object({
	id: z.string().optional(),
	connection_method: z
		.enum(['unknown', 'transparent_proxy', 'loopback'])
		.optional(),
	filtering_method: z.enum(['unknown', 'precheck', 'dns_filtering']).optional(),
	fail_over_method: z.enum(['unknown', 'fail_open', 'fail_close']).optional(),
});
export type FilteringClientSettingAttributes = z.infer<
	typeof FilteringClientSettingAttributesSchema
>;

export const UserAgentSettingsBodySchema = z.object({
	device_setting_attributes: DeviceSettingAttributesSchema.optional(),
	filtering_client_setting_attributes:
		FilteringClientSettingAttributesSchema.optional(),
});
export type UserAgentSettingsBody = z.infer<typeof UserAgentSettingsBodySchema>;
