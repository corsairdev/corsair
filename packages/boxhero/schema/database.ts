import { z } from 'zod';

/**
 * Field names match official JSON keys.
 * https://rest.boxhero-app.com/docs/api
 * OpenAPI: https://rest.boxhero-app.com/docs/spec
 */

const Id = z.number().int().min(0).max(2_147_483_647);
const S = z.string();
const N = z.number();
const B = z.boolean();

export const BoxheroEntity = z
	.object({
		id: Id,
		name: S,
		deleted: B,
	})
	.loose();
export type BoxheroEntity = z.infer<typeof BoxheroEntity>;

export const BoxheroLocationEntity = z
	.object({
		id: Id,
		name: S,
		quantity: N,
		memo: S,
	})
	.loose();
export type BoxheroLocationEntity = z.infer<typeof BoxheroLocationEntity>;

/** `0` = supplier, `1` = customer. */
export const BoxheroPartnerEntity = z
	.object({
		id: Id,
		type: z.union([z.literal(0), z.literal(1)]),
		name: S,
		phone: S,
		email: S,
		address: S,
		memo: S,
	})
	.loose();
export type BoxheroPartnerEntity = z.infer<typeof BoxheroPartnerEntity>;

export const BoxheroMemberEntity = z
	.object({
		id: Id,
		name: S,
		role: z.enum(['admin', 'member', 'viewer']),
	})
	.loose();
export type BoxheroMemberEntity = z.infer<typeof BoxheroMemberEntity>;

/** `0` = BASIC, `1` = ADVANCED/Unit, `2` = LOCATION. Open API requires `2`. */
export const BoxheroTeamEntity = z
	.object({
		id: Id,
		name: S,
		mode: z.union([z.literal(0), z.literal(1), z.literal(2)]),
		currency_symbol: z.string().nullable(),
		currency_code: z.string().nullable(),
		price_decimal_places: z.number().int().min(0).max(10),
		memo: z.string().nullable(),
	})
	.loose();
export type BoxheroTeamEntity = z.infer<typeof BoxheroTeamEntity>;

export const BoxheroAttrEntity = z
	.object({
		id: Id,
		attr_type: z.enum(['text', 'date', 'number', 'barcode']),
		attr_name: S,
		rank: N,
	})
	.loose();
export type BoxheroAttrEntity = z.infer<typeof BoxheroAttrEntity>;

export const BoxheroItemAttrEntity = z
	.object({
		id: Id,
		type: z.enum(['text', 'date', 'number', 'barcode']),
		name: S,
		value: z.union([z.string().max(2000), z.number()]),
	})
	.loose();
export type BoxheroItemAttrEntity = z.infer<typeof BoxheroItemAttrEntity>;

export const BoxheroItemEntity = z
	.object({
		id: Id,
		name: S,
		sku: S,
		barcode: S,
		photo_url: z.string().nullable(),
		attrs: z.array(BoxheroItemAttrEntity),
		cost: S,
		price: S,
		quantity: N,
		quantities: z.array(
			z.object({
				location_id: Id,
				quantity: N,
			}),
		),
	})
	.loose();
export type BoxheroItemEntity = z.infer<typeof BoxheroItemEntity>;

const SimpleTxBase = z.object({
	id: Id,
	transaction_time: S,
	created_at: S,
	created_by: BoxheroEntity,
	count_of_items: z.number().int(),
	total_quantity: N,
	url: S,
	memo: S,
	revision: z.number().int(),
});

export const BoxheroSimpleLocationTransactionEntity = z.discriminatedUnion(
	'type',
	[
		SimpleTxBase.extend({
			type: z.literal('in'),
			to_location: BoxheroEntity,
			partner: BoxheroEntity.nullable().optional(),
		}).loose(),
		SimpleTxBase.extend({
			type: z.literal('out'),
			to_location: BoxheroEntity,
			partner: BoxheroEntity.nullable().optional(),
		}).loose(),
		SimpleTxBase.extend({
			type: z.literal('move'),
			from_location: BoxheroEntity,
			to_location: BoxheroEntity,
		}).loose(),
		SimpleTxBase.extend({
			type: z.literal('adjust'),
			to_location: BoxheroEntity,
		}).loose(),
	],
);
export type BoxheroSimpleLocationTransactionEntity = z.infer<
	typeof BoxheroSimpleLocationTransactionEntity
>;
