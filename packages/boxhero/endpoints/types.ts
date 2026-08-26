import { z } from 'zod';

const IdSchema = z.number().int().min(0).max(2_147_483_647);
const CursorSchema = IdSchema.nullable();
const PageSizeSchema = z.number().int().min(0);
const PageInputSchema = z.object({
	cursor: IdSchema.optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
const IdFilterSchema = z.union([IdSchema, z.array(IdSchema).max(100)]);

const LocationsDeleteInputSchema = z.object({ location_id: IdSchema });
export type LocationsDeleteInput = z.infer<typeof LocationsDeleteInputSchema>;

const EmptyResponseSchema = z.object({});
export type LocationsDeleteResponse = z.infer<typeof EmptyResponseSchema>;

const LocationsListInputSchema = z.object({});
export type LocationsListInput = z.infer<typeof LocationsListInputSchema>;

const LocationSchema = z.object({
	id: IdSchema,
	name: z.string(),
	quantity: z.number(),
	memo: z.string(),
});
export type Location = z.infer<typeof LocationSchema>;

const LocationsListResponseSchema = z.object({
	items: z.array(LocationSchema),
	count: z.number().int().min(0),
});
export type LocationsListResponse = z.infer<typeof LocationsListResponseSchema>;

const LocationsGetInputSchema = z.object({ location_id: IdSchema });
export type LocationsGetInput = z.infer<typeof LocationsGetInputSchema>;

const LocationsGetResponseSchema = z.object({ item: LocationSchema });
export type LocationsGetResponse = z.infer<typeof LocationsGetResponseSchema>;

const TransactionTypeSchema = z.enum(['in', 'out', 'move', 'adjust']);
const TransactionsListInputSchema = PageInputSchema.extend({
	type: TransactionTypeSchema.optional(),
});
export type TransactionsListBasicInput = z.infer<
	typeof TransactionsListInputSchema
>;
export type TransactionsListLocationInput = TransactionsListBasicInput;

const EntitySchema = z.object({
	id: IdSchema,
	name: z.string(),
	deleted: z.boolean(),
});

const TransactionLineItemSchema = z.object({
	id: IdSchema,
	name: z.string(),
	sku: z.string(),
	barcode: z.string(),
	deleted: z.boolean(),
	item: EntitySchema,
	quantity: z.number(),
	from_location_new_stock_level: z.number().nullable(),
	to_location_new_stock_level: z.number().nullable(),
	new_stock_level: z.number().nullable(),
});

const SimpleTransactionBaseSchema = z.object({
	id: IdSchema,
	transaction_time: z.string(),
	created_at: z.string(),
	created_by: EntitySchema,
	count_of_items: z.number().int(),
	total_quantity: z.number(),
	url: z.string(),
	memo: z.string(),
	revision: z.number().int(),
	items: z.array(TransactionLineItemSchema).optional(),
});

const SimpleTransactionSchema = z.discriminatedUnion('type', [
	SimpleTransactionBaseSchema.extend({
		type: z.literal('in'),
		to_location: EntitySchema,
		partner: EntitySchema.nullable().optional(),
	}),
	SimpleTransactionBaseSchema.extend({
		type: z.literal('out'),
		to_location: EntitySchema,
		partner: EntitySchema.nullable().optional(),
	}),
	SimpleTransactionBaseSchema.extend({
		type: z.literal('move'),
		from_location: EntitySchema,
		to_location: EntitySchema,
	}),
	SimpleTransactionBaseSchema.extend({
		type: z.literal('adjust'),
		to_location: EntitySchema,
	}),
]);

const TransactionsListResponseSchema = z.object({
	items: z.array(SimpleTransactionSchema),
	count: PageSizeSchema,
	limit: PageSizeSchema,
	cursor: CursorSchema,
	has_more: z.boolean(),
});
export type TransactionsListBasicResponse = z.infer<
	typeof TransactionsListResponseSchema
>;
export type TransactionsListLocationResponse = TransactionsListBasicResponse;

const PartnersListInputSchema = z.object({
	type: z.union([z.literal(0), z.literal(1)]).optional(),
	cursor: IdSchema.optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type PartnersListInput = z.infer<typeof PartnersListInputSchema>;

const PartnerSchema = z.object({
	id: IdSchema,
	type: z.union([z.literal(0), z.literal(1)]),
	name: z.string(),
	phone: z.string(),
	email: z.string(),
	address: z.string(),
	memo: z.string(),
});
export type Partner = z.infer<typeof PartnerSchema>;

const PartnersListResponseSchema = z.object({
	items: z.array(PartnerSchema),
	count: PageSizeSchema,
	limit: PageSizeSchema,
	cursor: CursorSchema,
	has_more: z.boolean(),
});
export type PartnersListResponse = z.infer<typeof PartnersListResponseSchema>;

const ItemsListInputSchema = PageInputSchema.extend({
	item_ids: IdFilterSchema.optional(),
	location_ids: IdFilterSchema.optional(),
});
export type ItemsListInput = z.infer<typeof ItemsListInputSchema>;

const ItemsDeleteInputSchema = z.object({ item_id: IdSchema });
export type ItemsDeleteInput = z.infer<typeof ItemsDeleteInputSchema>;
export type ItemsDeleteResponse = z.infer<typeof EmptyResponseSchema>;

const ItemsGetInputSchema = z.object({
	item_id: IdSchema,
	location_ids: IdFilterSchema.optional(),
});
export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;

const ItemAttributeValueSchema = z.union([z.string().max(2000), z.number()]);
const ItemAttributeSchema = z.object({
	id: IdSchema,
	type: z.enum(['text', 'date', 'number', 'barcode']),
	name: z.string(),
	value: ItemAttributeValueSchema,
});
export type ItemAttribute = z.infer<typeof ItemAttributeSchema>;

const ItemSchema = z.object({
	id: IdSchema,
	name: z.string(),
	sku: z.string(),
	barcode: z.string(),
	photo_url: z.string().nullable(),
	attrs: z.array(ItemAttributeSchema),
	cost: z.string(),
	price: z.string(),
	quantity: z.number(),
	quantities: z.array(
		z.object({
			location_id: IdSchema,
			quantity: z.number(),
		}),
	),
});
export type Item = z.infer<typeof ItemSchema>;

const ItemsListResponseSchema = z.object({
	items: z.array(ItemSchema),
	count: PageSizeSchema,
	limit: PageSizeSchema,
	cursor: CursorSchema,
	has_more: z.boolean(),
});
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;
const ItemsGetResponseSchema = z.object({ item: ItemSchema });
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;

const ItemAttributesListInputSchema = z.object({});
export type ItemAttributesListInput = z.infer<
	typeof ItemAttributesListInputSchema
>;
const AttrSchema = z.object({
	id: IdSchema,
	attr_type: z.enum(['text', 'date', 'number', 'barcode']),
	attr_name: z.string(),
	rank: z.number(),
});
export type ItemAttributeDefinition = z.infer<typeof AttrSchema>;
const ItemAttributesListResponseSchema = z.object({
	items: z.array(AttrSchema),
	count: PageSizeSchema,
});
export type ItemAttributesListResponse = z.infer<
	typeof ItemAttributesListResponseSchema
>;
const ItemAttributeGetInputSchema = z.object({ attr_id: IdSchema });
export type ItemAttributeGetInput = z.infer<typeof ItemAttributeGetInputSchema>;
const ItemAttributeGetResponseSchema = z.object({ item: AttrSchema });
export type ItemAttributeGetResponse = z.infer<
	typeof ItemAttributeGetResponseSchema
>;

const TeamsGetInputSchema = z.object({});
export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;
const TeamSchema = z.object({
	id: IdSchema,
	name: z.string(),
	mode: z.union([z.literal(0), z.literal(1), z.literal(2)]),
	currency_symbol: z.string().nullable(),
	currency_code: z.string().nullable(),
	price_decimal_places: z.number().int().min(0).max(10),
	memo: z.string().nullable(),
});
export type Team = z.infer<typeof TeamSchema>;
export const TeamsGetResponseSchema = TeamSchema;
export type TeamsGetResponse = z.infer<typeof TeamsGetResponseSchema>;

const MembersListInputSchema = z.object({});
export type MembersListInput = z.infer<typeof MembersListInputSchema>;
const MemberSchema = z.object({
	id: IdSchema,
	name: z.string(),
	role: z.enum(['admin', 'member', 'viewer']),
});
export type Member = z.infer<typeof MemberSchema>;
const MembersListResponseSchema = z.object({
	items: z.array(MemberSchema),
	count: PageSizeSchema,
});
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;
const MembersGetInputSchema = z.object({ member_id: IdSchema });
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;
const MembersGetResponseSchema = z.object({ item: MemberSchema });
export type MembersGetResponse = z.infer<typeof MembersGetResponseSchema>;

export type BoxheroEndpointInputs = {
	locationsDelete: LocationsDeleteInput;
	locationsList: LocationsListInput;
	locationsGet: LocationsGetInput;
	transactionsListBasic: TransactionsListBasicInput;
	transactionsListLocation: TransactionsListLocationInput;
	partnersList: PartnersListInput;
	itemsDelete: ItemsDeleteInput;
	itemsGet: ItemsGetInput;
	itemsList: ItemsListInput;
	itemAttributesList: ItemAttributesListInput;
	itemAttributesGet: ItemAttributeGetInput;
	teamsGetInfo: TeamsGetInput;
	membersList: MembersListInput;
	membersGet: MembersGetInput;
};

export type BoxheroEndpointOutputs = {
	locationsDelete: LocationsDeleteResponse;
	locationsList: LocationsListResponse;
	locationsGet: LocationsGetResponse;
	transactionsListBasic: TransactionsListBasicResponse;
	transactionsListLocation: TransactionsListLocationResponse;
	partnersList: PartnersListResponse;
	itemsDelete: ItemsDeleteResponse;
	itemsGet: ItemsGetResponse;
	itemsList: ItemsListResponse;
	itemAttributesList: ItemAttributesListResponse;
	itemAttributesGet: ItemAttributeGetResponse;
	teamsGetInfo: TeamsGetResponse;
	membersList: MembersListResponse;
	membersGet: MembersGetResponse;
};

export const BoxheroEndpointInputSchemas = {
	locationsDelete: LocationsDeleteInputSchema,
	locationsList: LocationsListInputSchema,
	locationsGet: LocationsGetInputSchema,
	transactionsListBasic: TransactionsListInputSchema,
	transactionsListLocation: TransactionsListInputSchema,
	partnersList: PartnersListInputSchema,
	itemsDelete: ItemsDeleteInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsList: ItemsListInputSchema,
	itemAttributesList: ItemAttributesListInputSchema,
	itemAttributesGet: ItemAttributeGetInputSchema,
	teamsGetInfo: TeamsGetInputSchema,
	membersList: MembersListInputSchema,
	membersGet: MembersGetInputSchema,
} as const;

export const BoxheroEndpointOutputSchemas = {
	locationsDelete: EmptyResponseSchema,
	locationsList: LocationsListResponseSchema,
	locationsGet: LocationsGetResponseSchema,
	transactionsListBasic: TransactionsListResponseSchema,
	transactionsListLocation: TransactionsListResponseSchema,
	partnersList: PartnersListResponseSchema,
	itemsDelete: EmptyResponseSchema,
	itemsGet: ItemsGetResponseSchema,
	itemsList: ItemsListResponseSchema,
	itemAttributesList: ItemAttributesListResponseSchema,
	itemAttributesGet: ItemAttributeGetResponseSchema,
	teamsGetInfo: TeamsGetResponseSchema,
	membersList: MembersListResponseSchema,
	membersGet: MembersGetResponseSchema,
} as const;
