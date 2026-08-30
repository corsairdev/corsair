import { z } from 'zod';

/**
 * Team API user.
 * Official: GET /v2/users/{id}
 * https://developer.brex.com/openapi/team_api/users/getuser
 */
export const BrexUser = z
	.object({
		id: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexUser = z.infer<typeof BrexUser>;

/**
 * Team API card.
 * Official: GET /v2/cards/{id}
 * https://developer.brex.com/openapi/team_api/cards/getcard
 */
export const BrexCard = z
	.object({
		id: z.string().optional(),
		owner: z.unknown().optional(),
		card_name: z.string().optional(),
		card_type: z.string().optional(),
		limit_type: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexCard = z.infer<typeof BrexCard>;

/**
 * Team API department.
 * Official: GET /v2/departments/{id}
 * https://developer.brex.com/openapi/team_api/departments/getdepartment
 */
export const BrexDepartment = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.loose();
export type BrexDepartment = z.infer<typeof BrexDepartment>;

/**
 * Team API location.
 * Official: GET /v2/locations/{id}
 * https://developer.brex.com/openapi/team_api/locations/getlocation
 */
export const BrexLocation = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
	})
	.loose();
export type BrexLocation = z.infer<typeof BrexLocation>;

/**
 * Team API job title.
 * Official: GET /v2/titles/{id}
 * https://developer.brex.com/openapi/team_api/titles/gettitle
 */
export const BrexTitle = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();
export type BrexTitle = z.infer<typeof BrexTitle>;

/**
 * Team API company.
 * Official: GET /v2/company
 * https://developer.brex.com/openapi/team_api/companies/getcompany
 */
export const BrexCompany = z
	.object({
		id: z.string().optional(),
		legal_name: z.string().optional(),
		account_type: z.string().optional(),
	})
	.loose();
export type BrexCompany = z.infer<typeof BrexCompany>;

/**
 * Team API legal entity.
 * Official: GET /v2/legal_entities/{id}
 * https://developer.brex.com/openapi/team_api/legal-entities/getlegalentity
 */
export const BrexLegalEntity = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();
export type BrexLegalEntity = z.infer<typeof BrexLegalEntity>;

/**
 * Expenses API expense.
 * Official: GET /v1/expenses/{id}
 * https://developer.brex.com/openapi/expenses_api/expenses/getexpense
 */
export const BrexExpense = z
	.object({
		id: z.string().optional(),
		memo: z.string().optional(),
		status: z.string().optional(),
		budget_id: z.string().optional(),
	})
	.loose();
export type BrexExpense = z.infer<typeof BrexExpense>;

/**
 * Transactions API card transaction.
 * Official: GET /v2/transactions/card/primary
 * https://developer.brex.com/openapi/transactions_api/transactions/listcardtransactions
 */
export const BrexTransaction = z
	.object({
		id: z.string().optional(),
		posted_at_date: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();
export type BrexTransaction = z.infer<typeof BrexTransaction>;

/**
 * Budgets API v2 budget.
 * Official: GET /v2/budgets/{id}
 * https://developer.brex.com/openapi/budgets_api/budgets/getspendbudgetbyid
 */
export const BrexBudget = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexBudget = z.infer<typeof BrexBudget>;

/**
 * Budgets API v2 spend limit.
 * Official: GET /v2/spend_limits/{id}
 * https://developer.brex.com/openapi/budgets_api/spend-limits-(v2)/getspendlimitbyid
 */
export const BrexSpendLimit = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		parent_budget_id: z.string().optional(),
	})
	.loose();
export type BrexSpendLimit = z.infer<typeof BrexSpendLimit>;

/**
 * Payments API vendor.
 * Official: GET /v1/vendors/{id}
 * https://developer.brex.com/openapi/payments_api/vendors/getvendor
 */
export const BrexVendor = z
	.object({
		id: z.string().optional(),
		company_name: z.string().optional(),
		email: z.string().optional(),
	})
	.loose();
export type BrexVendor = z.infer<typeof BrexVendor>;

/**
 * Payments API transfer.
 * Official: GET /v1/transfers/{id}
 * https://developer.brex.com/openapi/payments_api/transfers/gettransfersbyid
 */
export const BrexTransfer = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexTransfer = z.infer<typeof BrexTransfer>;

/**
 * Onboarding API referral.
 * Official: GET /v1/referrals/{id}
 * https://developer.brex.com/openapi/onboarding_api/referrals/getreferral
 */
export const BrexReferral = z
	.object({
		id: z.string().optional(),
		referral_signup_url: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexReferral = z.infer<typeof BrexReferral>;

/**
 * Webhooks API subscription.
 * Official: GET /v1/webhooks/{id}
 * https://developer.brex.com/openapi/webhooks_api/webhook-subscriptions/getwebhook
 */
export const BrexWebhookSubscription = z
	.object({
		id: z.string().optional(),
		url: z.string().optional(),
		status: z.string().optional(),
		event_types: z.array(z.string()).optional(),
	})
	.loose();
export type BrexWebhookSubscription = z.infer<typeof BrexWebhookSubscription>;

/**
 * Fields API custom field.
 * Official: GET /v1/fields/{id}
 * https://developer.brex.com/openapi/fields_api/fields/getcustomfield
 */
export const BrexField = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		group: z.string().optional(),
		disabled: z.boolean().optional(),
	})
	.loose();
export type BrexField = z.infer<typeof BrexField>;

/**
 * Travel API trip.
 * Official: GET /v1/trips
 * https://developer.brex.com/openapi/travel_api/trips/listtrips
 */
export const BrexTrip = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexTrip = z.infer<typeof BrexTrip>;

/**
 * Transactions API cash account.
 * Official: GET /v2/accounts/cash/{id}
 * https://developer.brex.com/openapi/transactions_api/accounts/getcashaccount
 */
export const BrexCashAccount = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();
export type BrexCashAccount = z.infer<typeof BrexCashAccount>;
