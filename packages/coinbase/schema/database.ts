import { z } from 'zod';

export const CoinbaseMoney = z
	.object({
		amount: z.string(),
		currency: z.string(),
	})
	.loose();
export type CoinbaseMoney = z.infer<typeof CoinbaseMoney>;

export const CoinbaseCurrency = z
	.object({
		id: z.string(),
		name: z.string(),
		min_size: z.string().optional(),
		status: z.string().optional(),
		message: z.string().nullable().optional(),
		convertible_to: z.array(z.string()).optional(),
	})
	.loose();
export type CoinbaseCurrency = z.infer<typeof CoinbaseCurrency>;

export const CoinbaseAccountCurrency = z
	.object({
		code: z.string(),
		name: z.string().optional(),
		type: z.string().optional(),
		asset_id: z.string().optional(),
		slug: z.string().optional(),
		color: z.string().optional(),
		exponent: z.number().optional(),
		sort_index: z.number().optional(),
		address_regex: z.string().optional(),
	})
	.loose();
export type CoinbaseAccountCurrency = z.infer<typeof CoinbaseAccountCurrency>;

export const CoinbaseAccount = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		primary: z.boolean().optional(),
		type: z.string().optional(),
		currency: z.union([z.string(), CoinbaseAccountCurrency]).optional(),
		balance: CoinbaseMoney.optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		resource: z.string().optional(),
		resource_path: z.string().optional(),
		ready: z.boolean().optional(),
	})
	.loose();
export type CoinbaseAccount = z.infer<typeof CoinbaseAccount>;

export const CoinbaseCountry = z
	.object({
		code: z.string(),
		name: z.string().optional(),
	})
	.loose();
export type CoinbaseCountry = z.infer<typeof CoinbaseCountry>;

export const CoinbaseUser = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		username: z.string().nullable().optional(),
		profile_location: z.string().nullable().optional(),
		profile_bio: z.string().nullable().optional(),
		profile_url: z.string().nullable().optional(),
		avatar_url: z.string().optional(),
		resource: z.string().optional(),
		resource_path: z.string().optional(),
		email: z.string().optional(),
		time_zone: z.string().optional(),
		native_currency: z.string().optional(),
		bitcoin_unit: z.string().optional(),
		country: CoinbaseCountry.optional(),
		created_at: z.string().nullable().optional(),
	})
	.loose();
export type CoinbaseUser = z.infer<typeof CoinbaseUser>;

export const CoinbaseNetwork = z
	.object({
		status: z.string().optional(),
		hash: z.string().nullable().optional(),
		name: z.string().optional(),
		transaction_url: z.string().nullable().optional(),
		status_description: z.string().nullable().optional(),
	})
	.loose();
export type CoinbaseNetwork = z.infer<typeof CoinbaseNetwork>;

export const CoinbaseTransaction = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		status: z.string().optional(),
		amount: CoinbaseMoney.optional(),
		native_amount: CoinbaseMoney.optional(),
		description: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		resource: z.string().optional(),
		resource_path: z.string().optional(),
		instant_exchange: z.boolean().optional(),
		network: CoinbaseNetwork.optional(),
		to: z.record(z.string(), z.unknown()).optional(),
		from: z.record(z.string(), z.unknown()).optional(),
		details: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();
export type CoinbaseTransaction = z.infer<typeof CoinbaseTransaction>;

export const CoinbasePrice = z
	.object({
		amount: z.string(),
		currency: z.string(),
		base: z.string().optional(),
	})
	.loose();
export type CoinbasePrice = z.infer<typeof CoinbasePrice>;

export const CoinbasePaymentMethod = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		name: z.string().optional(),
		currency: z.string().optional(),
		primary_buy: z.boolean().optional(),
		primary_sell: z.boolean().optional(),
		allow_buy: z.boolean().optional(),
		allow_sell: z.boolean().optional(),
		allow_deposit: z.boolean().optional(),
		allow_withdraw: z.boolean().optional(),
		instant_buy: z.boolean().optional(),
		instant_sell: z.boolean().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
		resource: z.string().optional(),
		resource_path: z.string().optional(),
	})
	.loose();
export type CoinbasePaymentMethod = z.infer<typeof CoinbasePaymentMethod>;

export const CoinbasePagination = z
	.object({
		ending_before: z.string().nullable().optional(),
		starting_after: z.string().nullable().optional(),
		limit: z.number().optional(),
		order: z.string().optional(),
		previous_uri: z.string().nullable().optional(),
		next_uri: z.string().nullable().optional(),
	})
	.loose();
export type CoinbasePagination = z.infer<typeof CoinbasePagination>;
