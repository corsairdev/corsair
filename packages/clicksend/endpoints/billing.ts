import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import { getClickSendCredentials, makeClickSendRequest } from '../client';
import type { ClickSendContext } from '../index';

// ── Shared ────────────────────────────────────────────────────────────────────

export const EmptyResultSchema = z.union([
	z.array(z.never()),
	z.record(z.string(), z.string()),
	z.boolean(),
	z.null(),
]);
export type EmptyResult = z.infer<typeof EmptyResultSchema>;

// ── recharge.transactions ─────────────────────────────────────────────────────

export const BillingRechargeTransactionObjectSchema = z
	.object({
		invoice_number: z.union([z.string(), z.number()]).optional(),
		amount: z.union([z.number(), z.string()]).optional(),
		currency: z.string().optional(),
		date: z.string().optional(),
	})
	.passthrough();
export type BillingRechargeTransactionObject = z.infer<
	typeof BillingRechargeTransactionObjectSchema
>;

export const BillingListRechargeTransactionsInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type BillingListRechargeTransactionsInput = z.infer<
	typeof BillingListRechargeTransactionsInputSchema
>;

export const BillingListRechargeTransactionsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(BillingRechargeTransactionObjectSchema).optional(),
	})
	.passthrough();
export type BillingListRechargeTransactionsResponse = z.infer<
	typeof BillingListRechargeTransactionsResponseSchema
>;

export const listRechargeTransactions: CorsairEndpoint<
	ClickSendContext,
	BillingListRechargeTransactionsInput,
	BillingListRechargeTransactionsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'recharge/transactions',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: BillingListRechargeTransactionsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.transactions',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

// ── recharge.transactionGet ───────────────────────────────────────────────────

export const BillingGetRechargeTransactionInputSchema = z
	.object({
		transaction_id: z.union([z.number().int(), z.string()]),
	})
	.strict();
export type BillingGetRechargeTransactionInput = z.infer<
	typeof BillingGetRechargeTransactionInputSchema
>;

export const BillingGetRechargeTransactionResponseSchema =
	BillingRechargeTransactionObjectSchema;
export type BillingGetRechargeTransactionResponse = z.infer<
	typeof BillingGetRechargeTransactionResponseSchema
>;

export const getRechargeTransaction: CorsairEndpoint<
	ClickSendContext,
	BillingGetRechargeTransactionInput,
	BillingGetRechargeTransactionResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`recharge/transactions/${input.transaction_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: BillingGetRechargeTransactionResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.transactionGet',
		{ transaction_id: input.transaction_id },
		'completed',
	);

	return response;
};

// ── recharge.packages ─────────────────────────────────────────────────────────

export const BillingListRechargePackagesInputSchema = z.object({}).strict();
export type BillingListRechargePackagesInput = z.infer<
	typeof BillingListRechargePackagesInputSchema
>;

export const BillingRechargePackageSchema = z
	.object({
		package_id: z.union([z.number(), z.string()]).optional(),
		package_price: z.union([z.number(), z.string()]).optional(),
		price_rate: z.union([z.number(), z.string()]).optional(),
		sms_price: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();
export type BillingRechargePackage = z.infer<
	typeof BillingRechargePackageSchema
>;

export const BillingListRechargePackagesResponseSchema = z
	.object({
		packages: z.array(BillingRechargePackageSchema).optional(),
		currency: z.string().optional(),
	})
	.passthrough();
export type BillingListRechargePackagesResponse = z.infer<
	typeof BillingListRechargePackagesResponseSchema
>;

export const listRechargePackages: CorsairEndpoint<
	ClickSendContext,
	BillingListRechargePackagesInput,
	BillingListRechargePackagesResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'recharge/packages',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: BillingListRechargePackagesResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.packages',
		{ ...input },
		'completed',
	);

	return response;
};

// ── recharge.purchase ─────────────────────────────────────────────────────────

export const BillingPurchaseRechargePackageInputSchema = z
	.object({
		package_id: z.union([z.number().int(), z.string()]),
	})
	.strict();
export type BillingPurchaseRechargePackageInput = z.infer<
	typeof BillingPurchaseRechargePackageInputSchema
>;

export const BillingPurchaseRechargePackageResponseSchema = z
	.object({
		user_id: z.union([z.number(), z.string()]).optional(),
		amount: z.union([z.number(), z.string()]).optional(),
		currency: z.string().optional(),
		amount_aud: z.union([z.number(), z.string()]).optional(),
		date: z.string().optional(),
	})
	.passthrough();
export type BillingPurchaseRechargePackageResponse = z.infer<
	typeof BillingPurchaseRechargePackageResponseSchema
>;

export const purchaseRechargePackage: CorsairEndpoint<
	ClickSendContext,
	BillingPurchaseRechargePackageInput,
	BillingPurchaseRechargePackageResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`recharge/purchase/${input.package_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: BillingPurchaseRechargePackageResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.purchase',
		{ package_id: input.package_id },
		'completed',
	);

	return response;
};

// ── recharge.creditCardGet ────────────────────────────────────────────────────

export const BillingGetRechargeCreditCardInputSchema = z.object({}).strict();
export type BillingGetRechargeCreditCardInput = z.infer<
	typeof BillingGetRechargeCreditCardInputSchema
>;

export const BillingGetRechargeCreditCardResponseSchema = z
	.object({
		display_number: z.string().optional(),
		expiry_month: z.union([z.number(), z.string()]).optional(),
		expiry_year: z.union([z.number(), z.string()]).optional(),
		name: z.string().optional(),
	})
	.passthrough();
export type BillingGetRechargeCreditCardResponse = z.infer<
	typeof BillingGetRechargeCreditCardResponseSchema
>;

export const getRechargeCreditCard: CorsairEndpoint<
	ClickSendContext,
	BillingGetRechargeCreditCardInput,
	BillingGetRechargeCreditCardResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'recharge/credit-card',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: BillingGetRechargeCreditCardResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.creditCardGet',
		{ ...input },
		'completed',
	);

	return response;
};

// ── recharge.creditCardUpdate ─────────────────────────────────────────────────

export const BillingUpdateRechargeCreditCardInputSchema = z
	.object({
		number: z.string().min(1),
		expiry_month: z.union([z.number(), z.string()]),
		expiry_year: z.union([z.number(), z.string()]),
		cvc: z.union([z.number(), z.string()]),
		name: z.string().min(1),
		bank_name: z.string().optional(),
	})
	.strict();
export type BillingUpdateRechargeCreditCardInput = z.infer<
	typeof BillingUpdateRechargeCreditCardInputSchema
>;

export const BillingUpdateRechargeCreditCardResponseSchema = z
	.object({
		token: z.string().optional(),
	})
	.passthrough();
export type BillingUpdateRechargeCreditCardResponse = z.infer<
	typeof BillingUpdateRechargeCreditCardResponseSchema
>;

export const updateRechargeCreditCard: CorsairEndpoint<
	ClickSendContext,
	BillingUpdateRechargeCreditCardInput,
	BillingUpdateRechargeCreditCardResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'recharge/credit-card',
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				number: input.number,
				expiry_month: input.expiry_month,
				expiry_year: input.expiry_year,
				cvc: input.cvc,
				name: input.name,
				bank_name: input.bank_name,
			},
			responseSchema: BillingUpdateRechargeCreditCardResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.recharge.creditCardUpdate',
		{ name: input.name },
		'completed',
	);

	return response;
};

// ── subaccounts ───────────────────────────────────────────────────────────────

export const BillingSubaccountObjectSchema = z
	.object({
		subaccount_id: z.union([z.number(), z.string()]).optional(),
		api_username: z.string().optional(),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		api_key: z.string().optional(),
	})
	.passthrough();
export type BillingSubaccountObject = z.infer<
	typeof BillingSubaccountObjectSchema
>;

export const BillingListSubaccountsInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type BillingListSubaccountsInput = z.infer<
	typeof BillingListSubaccountsInputSchema
>;

export const BillingListSubaccountsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(BillingSubaccountObjectSchema).optional(),
	})
	.passthrough();
export type BillingListSubaccountsResponse = z.infer<
	typeof BillingListSubaccountsResponseSchema
>;

export const listSubaccounts: CorsairEndpoint<
	ClickSendContext,
	BillingListSubaccountsInput,
	BillingListSubaccountsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('subaccounts', username, apiKey, {
		method: 'GET',
		query: {
			page: input.page,
			limit: input.limit,
		},
		responseSchema: BillingListSubaccountsResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.list',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const BillingGetSubaccountInputSchema = z
	.object({
		subaccount_id: z.union([z.number().int(), z.string()]),
	})
	.strict();
export type BillingGetSubaccountInput = z.infer<
	typeof BillingGetSubaccountInputSchema
>;

export const BillingGetSubaccountResponseSchema = BillingSubaccountObjectSchema;
export type BillingGetSubaccountResponse = z.infer<
	typeof BillingGetSubaccountResponseSchema
>;

export const getSubaccount: CorsairEndpoint<
	ClickSendContext,
	BillingGetSubaccountInput,
	BillingGetSubaccountResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`subaccounts/${input.subaccount_id}`,
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: BillingGetSubaccountResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.get',
		{ subaccount_id: input.subaccount_id },
		'completed',
	);

	return response;
};

export const BillingCreateSubaccountInputSchema = z
	.object({
		api_username: z.string().min(1),
		password: z.string().min(1),
		email: z.string().min(1),
		phone_number: z.string().min(1),
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		notes: z.string().optional(),
	})
	.strict();
export type BillingCreateSubaccountInput = z.infer<
	typeof BillingCreateSubaccountInputSchema
>;

export const BillingCreateSubaccountResponseSchema =
	BillingSubaccountObjectSchema;
export type BillingCreateSubaccountResponse = z.infer<
	typeof BillingCreateSubaccountResponseSchema
>;

export const createSubaccount: CorsairEndpoint<
	ClickSendContext,
	BillingCreateSubaccountInput,
	BillingCreateSubaccountResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('subaccounts', username, apiKey, {
		method: 'POST',
		body: {
			api_username: input.api_username,
			password: input.password,
			email: input.email,
			phone_number: input.phone_number,
			first_name: input.first_name,
			last_name: input.last_name,
			notes: input.notes,
		},
		responseSchema: BillingCreateSubaccountResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.create',
		{ api_username: input.api_username },
		'completed',
	);

	return response;
};

export const BillingUpdateSubaccountInputSchema = z
	.object({
		subaccount_id: z.union([z.number().int(), z.string()]),
		email: z.string().optional(),
		phone_number: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		notes: z.string().optional(),
	})
	.strict();
export type BillingUpdateSubaccountInput = z.infer<
	typeof BillingUpdateSubaccountInputSchema
>;

export const BillingUpdateSubaccountResponseSchema =
	BillingSubaccountObjectSchema;
export type BillingUpdateSubaccountResponse = z.infer<
	typeof BillingUpdateSubaccountResponseSchema
>;

export const updateSubaccount: CorsairEndpoint<
	ClickSendContext,
	BillingUpdateSubaccountInput,
	BillingUpdateSubaccountResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`subaccounts/${input.subaccount_id}`,
		username,
		apiKey,
		{
			method: 'PUT',
			body: {
				email: input.email,
				phone_number: input.phone_number,
				first_name: input.first_name,
				last_name: input.last_name,
				notes: input.notes,
			},
			responseSchema: BillingUpdateSubaccountResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.update',
		{ subaccount_id: input.subaccount_id },
		'completed',
	);

	return response;
};

export const BillingDeleteSubaccountInputSchema = z
	.object({
		subaccount_id: z.union([z.number().int(), z.string()]),
	})
	.strict();
export type BillingDeleteSubaccountInput = z.infer<
	typeof BillingDeleteSubaccountInputSchema
>;

export const BillingDeleteSubaccountResponseSchema = EmptyResultSchema;
export type BillingDeleteSubaccountResponse = z.infer<
	typeof BillingDeleteSubaccountResponseSchema
>;

export const deleteSubaccount: CorsairEndpoint<
	ClickSendContext,
	BillingDeleteSubaccountInput,
	BillingDeleteSubaccountResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`subaccounts/${input.subaccount_id}`,
		username,
		apiKey,
		{
			method: 'DELETE',
			responseSchema: BillingDeleteSubaccountResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.delete',
		{ subaccount_id: input.subaccount_id },
		'completed',
	);

	return response;
};

export const BillingRegenSubaccountApiKeyInputSchema = z
	.object({
		subaccount_id: z.union([z.number().int(), z.string()]),
	})
	.strict();
export type BillingRegenSubaccountApiKeyInput = z.infer<
	typeof BillingRegenSubaccountApiKeyInputSchema
>;

export const BillingRegenSubaccountApiKeyResponseSchema = z
	.object({
		api_key: z.string().optional(),
	})
	.passthrough();
export type BillingRegenSubaccountApiKeyResponse = z.infer<
	typeof BillingRegenSubaccountApiKeyResponseSchema
>;

export const regenSubaccountApiKey: CorsairEndpoint<
	ClickSendContext,
	BillingRegenSubaccountApiKeyInput,
	BillingRegenSubaccountApiKeyResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		`subaccounts/${input.subaccount_id}/regen-api-key`,
		username,
		apiKey,
		{
			method: 'PUT',
			responseSchema: BillingRegenSubaccountApiKeyResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.subaccounts.regenKey',
		{ subaccount_id: input.subaccount_id },
		'completed',
	);

	return response;
};

// ── reseller ──────────────────────────────────────────────────────────────────

export const BillingResellerAccountSchema = z.object({}).passthrough();
export type BillingResellerAccount = z.infer<
	typeof BillingResellerAccountSchema
>;

export const BillingListResellerAccountsInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.strict();
export type BillingListResellerAccountsInput = z.infer<
	typeof BillingListResellerAccountsInputSchema
>;

export const BillingListResellerAccountsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(BillingResellerAccountSchema).optional(),
	})
	.passthrough();
export type BillingListResellerAccountsResponse = z.infer<
	typeof BillingListResellerAccountsResponseSchema
>;

export const listResellerAccounts: CorsairEndpoint<
	ClickSendContext,
	BillingListResellerAccountsInput,
	BillingListResellerAccountsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'reseller/accounts',
		username,
		apiKey,
		{
			method: 'GET',
			query: {
				page: input.page,
				limit: input.limit,
			},
			responseSchema: BillingListResellerAccountsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.reseller.accountsList',
		{ page: input.page, limit: input.limit },
		'completed',
	);

	return response;
};

export const BillingGetResellerSettingsInputSchema = z.object({}).strict();
export type BillingGetResellerSettingsInput = z.infer<
	typeof BillingGetResellerSettingsInputSchema
>;

export const BillingGetResellerSettingsResponseSchema = z
	.object({})
	.passthrough();
export type BillingGetResellerSettingsResponse = z.infer<
	typeof BillingGetResellerSettingsResponseSchema
>;

export const getResellerSettings: CorsairEndpoint<
	ClickSendContext,
	BillingGetResellerSettingsInput,
	BillingGetResellerSettingsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('reseller', username, apiKey, {
		method: 'GET',
		responseSchema: BillingGetResellerSettingsResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.reseller.settingsGet',
		{ ...input },
		'completed',
	);

	return response;
};

export const BillingUpdateResellerSettingsInputSchema = z
	.object({
		allow_public_signups: z.boolean().optional(),
		company_name: z.string().optional(),
		default_margin: z.number().optional(),
		subdomain: z.string().optional(),
		trial_balance: z.union([z.number(), z.string()]).optional(),
	})
	.strict();
export type BillingUpdateResellerSettingsInput = z.infer<
	typeof BillingUpdateResellerSettingsInputSchema
>;

export const BillingUpdateResellerSettingsResponseSchema = z
	.object({})
	.passthrough();
export type BillingUpdateResellerSettingsResponse = z.infer<
	typeof BillingUpdateResellerSettingsResponseSchema
>;

export const updateResellerSettings: CorsairEndpoint<
	ClickSendContext,
	BillingUpdateResellerSettingsInput,
	BillingUpdateResellerSettingsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest('reseller', username, apiKey, {
		method: 'PUT',
		body: {
			allow_public_signups: input.allow_public_signups,
			company_name: input.company_name,
			default_margin: input.default_margin,
			subdomain: input.subdomain,
			trial_balance: input.trial_balance,
		},
		responseSchema: BillingUpdateResellerSettingsResponseSchema,
	});

	await logEventFromContext(
		ctx,
		'clicksend.reseller.settingsUpdate',
		{ ...input },
		'completed',
	);

	return response;
};

// ── referral ──────────────────────────────────────────────────────────────────

export const BillingListReferralAccountsInputSchema = z.object({}).strict();
export type BillingListReferralAccountsInput = z.infer<
	typeof BillingListReferralAccountsInputSchema
>;

export const BillingReferralAccountSchema = z
	.object({
		referral_rule_id: z.union([z.number(), z.string()]).optional(),
		refered_user_id: z.union([z.number(), z.string()]).optional(),
		date_referred: z.string().optional(),
		percentage_referral: z.union([z.number(), z.string()]).optional(),
	})
	.passthrough();
export type BillingReferralAccount = z.infer<
	typeof BillingReferralAccountSchema
>;

export const BillingListReferralAccountsResponseSchema = z
	.object({
		total: z.number().optional(),
		per_page: z.number().optional(),
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		data: z.array(BillingReferralAccountSchema).optional(),
	})
	.passthrough();
export type BillingListReferralAccountsResponse = z.infer<
	typeof BillingListReferralAccountsResponseSchema
>;

export const listReferralAccounts: CorsairEndpoint<
	ClickSendContext,
	BillingListReferralAccountsInput,
	BillingListReferralAccountsResponse
> = async (ctx, input) => {
	const { username, apiKey } = await getClickSendCredentials(ctx);

	const response = await makeClickSendRequest(
		'referral/accounts',
		username,
		apiKey,
		{
			method: 'GET',
			responseSchema: BillingListReferralAccountsResponseSchema,
		},
	);

	await logEventFromContext(
		ctx,
		'clicksend.referral.accountsList',
		{ ...input },
		'completed',
	);

	return response;
};
