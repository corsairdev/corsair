import { z } from 'zod';
import type { BoxheroItemAttrEntity } from '../schema/database';
import {
	BoxheroAttrEntity,
	BoxheroItemEntity,
	BoxheroLocationEntity,
	BoxheroMemberEntity,
	BoxheroPartnerEntity,
	BoxheroSimpleLocationTransactionEntity,
	BoxheroTeamEntity,
} from '../schema/database';

const IdSchema = z.number().int().min(0).max(2_147_483_647);
const PageSizeSchema = z.number().int().min(0);
const CursorSchema = IdSchema.nullable();
const PageInputSchema = z.object({
	cursor: IdSchema.optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
const IdFilterSchema = z.union([IdSchema, z.array(IdSchema).max(100)]);
const EmptyResponseSchema = z.object({});

const LocationsDeleteInputSchema = z.object({ location_id: IdSchema });
export type LocationsDeleteInput = z.infer<typeof LocationsDeleteInputSchema>;
export type LocationsDeleteResponse = z.infer<typeof EmptyResponseSchema>;

const LocationsListInputSchema = z.object({});
export type LocationsListInput = z.infer<typeof LocationsListInputSchema>;

const LocationsListResponseSchema = z.object({
	items: z.array(BoxheroLocationEntity),
	count: z.number().int().min(0),
});
export type LocationsListResponse = z.infer<typeof LocationsListResponseSchema>;

const LocationsGetInputSchema = z.object({ location_id: IdSchema });
export type LocationsGetInput = z.infer<typeof LocationsGetInputSchema>;
const LocationsGetResponseSchema = z.object({ item: BoxheroLocationEntity });
export type LocationsGetResponse = z.infer<typeof LocationsGetResponseSchema>;

const TransactionTypeSchema = z.enum(['in', 'out', 'move', 'adjust']);
const TransactionsListBasicInputSchema = PageInputSchema.extend({
	type: TransactionTypeSchema.optional(),
});
const TransactionsListLocationInputSchema = PageInputSchema.extend({
	type: TransactionTypeSchema.optional(),
});
export type TransactionsListBasicInput = z.infer<
	typeof TransactionsListBasicInputSchema
>;
export type TransactionsListLocationInput = z.infer<
	typeof TransactionsListLocationInputSchema
>;

export const TransactionsListResponseSchema = z.object({
	items: z.array(BoxheroSimpleLocationTransactionEntity),
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

const PartnersListResponseSchema = z.object({
	items: z.array(BoxheroPartnerEntity),
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

const ItemsListResponseSchema = z.object({
	items: z.array(BoxheroItemEntity),
	count: PageSizeSchema,
	limit: PageSizeSchema,
	cursor: CursorSchema,
	has_more: z.boolean(),
});
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;
const ItemsGetResponseSchema = z.object({ item: BoxheroItemEntity });
export type ItemsGetResponse = z.infer<typeof ItemsGetResponseSchema>;

const ItemAttributesListInputSchema = z.object({});
export type ItemAttributesListInput = z.infer<
	typeof ItemAttributesListInputSchema
>;
const ItemAttributesListResponseSchema = z.object({
	items: z.array(BoxheroAttrEntity),
	count: PageSizeSchema,
});
export type ItemAttributesListResponse = z.infer<
	typeof ItemAttributesListResponseSchema
>;
const ItemAttributeGetInputSchema = z.object({ attr_id: IdSchema });
export type ItemAttributeGetInput = z.infer<typeof ItemAttributeGetInputSchema>;
const ItemAttributeGetResponseSchema = z.object({ item: BoxheroAttrEntity });
export type ItemAttributeGetResponse = z.infer<
	typeof ItemAttributeGetResponseSchema
>;

const TeamsGetInputSchema = z.object({});
export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;
export const TeamsGetResponseSchema = BoxheroTeamEntity;
export type TeamsGetResponse = z.infer<typeof TeamsGetResponseSchema>;

const MembersListInputSchema = z.object({});
export type MembersListInput = z.infer<typeof MembersListInputSchema>;
const MembersListResponseSchema = z.object({
	items: z.array(BoxheroMemberEntity),
	count: PageSizeSchema,
});
export type MembersListResponse = z.infer<typeof MembersListResponseSchema>;
const MembersGetInputSchema = z.object({ member_id: IdSchema });
export type MembersGetInput = z.infer<typeof MembersGetInputSchema>;
const MembersGetResponseSchema = z.object({ item: BoxheroMemberEntity });
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
	transactionsListBasic: TransactionsListBasicInputSchema,
	transactionsListLocation: TransactionsListLocationInputSchema,
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

export type {
	BoxheroAttrEntity as ItemAttributeDefinition,
	BoxheroItemAttrEntity as ItemAttribute,
	BoxheroItemEntity as Item,
	BoxheroLocationEntity as Location,
	BoxheroMemberEntity as Member,
	BoxheroPartnerEntity as Partner,
	BoxheroTeamEntity as Team,
};
