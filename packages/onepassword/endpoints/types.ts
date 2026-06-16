import { z } from 'zod';

// ── Vault Schemas ────────────────────────────────────────────────────────────

export const VaultSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	attributeVersion: z.number().optional(),
	contentVersion: z.number().optional(),
	type: z.string().optional(),
});

export type Vault = z.infer<typeof VaultSchema>;

export const VaultsListInputSchema = z.object({});
export type VaultsListInput = z.infer<typeof VaultsListInputSchema>;

export const VaultsListResponseSchema = z.array(VaultSchema);
export type VaultsListResponse = z.infer<typeof VaultsListResponseSchema>;

export const VaultsGetInputSchema = z.object({
	id: z.string(),
});
export type VaultsGetInput = z.infer<typeof VaultsGetInputSchema>;

export const VaultsGetResponseSchema = VaultSchema;
export type VaultsGetResponse = z.infer<typeof VaultsGetResponseSchema>;

// ── Item Schemas ─────────────────────────────────────────────────────────────

export const ItemFieldSchema = z.object({
	id: z.string().optional(),
	label: z.string().optional(),
	type: z.string(),
	value: z.string().optional(),
	section: z.object({ id: z.string() }).optional(),
});

export const ItemUrlSchema = z.object({
	primary: z.boolean().optional(),
	href: z.string(),
});

export const VaultItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	vault: z.object({
		id: z.string(),
	}),
	category: z.string(),
	urls: z.array(ItemUrlSchema).optional(),
	fields: z.array(ItemFieldSchema).optional(),
});

export type VaultItem = z.infer<typeof VaultItemSchema>;

export const ItemsListInputSchema = z.object({
	vaultId: z.string(),
});
export type ItemsListInput = z.infer<typeof ItemsListInputSchema>;

export const ItemsListResponseSchema = z.array(VaultItemSchema);
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

export const ItemsGetInputSchema = z.object({
	vaultId: z.string(),
	id: z.string(),
});
export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;

export const ItemsGetResponseSchema = VaultItemSchema;
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;

export const ItemsCreateInputSchema = z.object({
	vaultId: z.string(),
	title: z.string(),
	category: z.enum([
		'LOGIN',
		'PASSWORD',
		'SECURE_NOTE',
		'DATABASE',
		'CREDIT_CARD',
		'MEMBERSHIP',
		'PASSPORT',
		'SOFTWARE_LICENSE',
		'OUTDOOR_LICENSE',
		'API_CREDENTIAL',
	]),
	urls: z.array(ItemUrlSchema).optional(),
	fields: z.array(ItemFieldSchema).optional(),
});
export type ItemsCreateInput = z.infer<typeof ItemsCreateInputSchema>;

export const ItemsCreateResponseSchema = VaultItemSchema;
export type ItemsCreateResponse = z.infer<typeof ItemsCreateResponseSchema>;

export const ItemsUpdateInputSchema = z.object({
	vaultId: z.string(),
	id: z.string(),
	title: z.string().optional(),
	category: z.enum([
		'LOGIN',
		'PASSWORD',
		'SECURE_NOTE',
		'DATABASE',
		'CREDIT_CARD',
		'MEMBERSHIP',
		'PASSPORT',
		'SOFTWARE_LICENSE',
		'OUTDOOR_LICENSE',
		'API_CREDENTIAL',
	]).optional(),
	urls: z.array(ItemUrlSchema).optional(),
	fields: z.array(ItemFieldSchema).optional(),
});
export type ItemsUpdateInput = z.infer<typeof ItemsUpdateInputSchema>;

export const ItemsUpdateResponseSchema = VaultItemSchema;
export type ItemsUpdateResponse = z.infer<typeof ItemsUpdateResponseSchema>;

export const ItemsDeleteInputSchema = z.object({
	vaultId: z.string(),
	id: z.string(),
});
export type ItemsDeleteInput = z.infer<typeof ItemsDeleteInputSchema>;

export const ItemsDeleteResponseSchema = z.object({
	success: z.boolean(),
});
export type ItemsDeleteResponse = z.infer<typeof ItemsDeleteResponseSchema>;

// ── Plugin Mapping Types ──────────────────────────────────────────────────────

export type OnePasswordEndpointInputs = {
	vaultsList: VaultsListInput;
	vaultsGet: VaultsGetInput;
	itemsList: ItemsListInput;
	itemsGet: ItemsGetInput;
	itemsCreate: ItemsCreateInput;
	itemsUpdate: ItemsUpdateInput;
	itemsDelete: ItemsDeleteInput;
};

export type OnePasswordEndpointOutputs = {
	vaultsList: VaultsListResponse;
	vaultsGet: VaultsGetResponse;
	itemsList: ItemsListResponse;
	itemsGet: ItemsGetResponse;
	itemsCreate: ItemsCreateResponse;
	itemsUpdate: ItemsUpdateResponse;
	itemsDelete: ItemsDeleteResponse;
};

export const OnePasswordEndpointInputSchemas = {
	vaultsList: VaultsListInputSchema,
	vaultsGet: VaultsGetInputSchema,
	itemsList: ItemsListInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsCreate: ItemsCreateInputSchema,
	itemsUpdate: ItemsUpdateInputSchema,
	itemsDelete: ItemsDeleteInputSchema,
} as const;

export const OnePasswordEndpointOutputSchemas = {
	vaultsList: VaultsListResponseSchema,
	vaultsGet: VaultsGetResponseSchema,
	itemsList: ItemsListResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsCreate: ItemsCreateResponseSchema,
	itemsUpdate: ItemsUpdateResponseSchema,
	itemsDelete: ItemsDeleteResponseSchema,
} as const;
