import { z } from 'zod';
import { bool, list, looseResult, num, obj, str } from '../schema-helpers';

export const BillingInputSchemas = {
	billingGetWallet: z.object({}).strict(),
	billingAddCredits: z
		.object({
			credits: z
				.number()
				.min(0.01)
				.describe('Amount in USD to add to the wallet. $1 = 1 credit.'),
			direct_charge: z
				.boolean()
				.optional()
				.describe(
					"When `true`, charges the team's default payment method immediately (off-session) and applies credits synchronously. Returns Stripe decline details with HTTP 402 on failure.",
				),
			guest_mode: z
				.boolean()
				.optional()
				.describe(
					"When `true`, returns a white-label Checkout link suitable for sharing with an end user. The team's email is hidden on the Checkout page and the payer's card is not saved. Requires `success_url`. Default false.",
				),
			success_url: z
				.string()
				.optional()
				.describe(
					'Required when `guest_mode` is `true`. Full URL the payer is redirected to after successful payment. Ignored in other modes.',
				),
			cancel_url: z
				.string()
				.optional()
				.describe(
					'Full URL the payer is redirected to if they cancel the Checkout. Defaults to `success_url` when omitted. Only used in `guest_mode`.',
				),
			redirect_url: z
				.string()
				.optional()
				.describe(
					'Internal redirect path appended to the default hosted-checkout return URL. Hosted-checkout mode only; ignored in `guest_mode` and `direct_charge`.',
				),
		})
		.strict(),
	billingGetWalletLogs: z
		.object({
			page: z.number().int().optional().describe('Page number'),
			limit: z.number().int().optional().describe('Results per page (max 200)'),
			type: z
				.string()
				.optional()
				.describe(
					'Filter by transaction type: credit, debit, refund, adjustment, reserve, release',
				),
			kind: z
				.string()
				.optional()
				.describe(
					'Filter by transaction kind: renewal, purchase, overage, adjustment',
				),
			status: z
				.string()
				.optional()
				.describe('Filter by status: pending, completed, failed, cancelled'),
			related_model: z
				.string()
				.optional()
				.describe(
					'Filter by related resource type: mailbox, payment, subscription, domain',
				),
			uid: z
				.string()
				.optional()
				.describe('Filter by related resource UID. Use with related_model.'),
			workspace: z.string().optional().describe('Filter by workspace ID'),
			start_date: z
				.string()
				.optional()
				.describe(
					'Return transactions created on or after this date (ISO 8601)',
				),
			end_date: z
				.string()
				.optional()
				.describe(
					'Return transactions created on or before this date (ISO 8601)',
				),
		})
		.strict(),
	billingGetPaymentStatus: z
		.object({
			session_id: z
				.string()
				.describe(
					'Stripe Checkout session ID returned from `POST /v1/api/billing/wallet` (hosted-checkout or guest mode).',
				),
		})
		.strict(),
	billingListTransactions: z
		.object({
			limit: z
				.number()
				.int()
				.optional()
				.describe('Transactions per page, 1 to 100. Default 50'),
			cursor: z
				.string()
				.optional()
				.describe('The next_cursor from the previous page'),
			start_date: z
				.string()
				.optional()
				.describe(
					'Only transactions on or after this time (ISO 8601). Times are in UTC. Include Z or an offset.',
				),
			end_date: z
				.string()
				.optional()
				.describe(
					'Only transactions before this time (ISO 8601). The time itself is not included. Times are in UTC. Include Z or an offset.',
				),
			type: z
				.string()
				.optional()
				.describe(
					'One or more types, comma separated: refund, credit_grant, adjustment, card_payment, top_up, placement_test, warmup, renewal, purchase, other',
				),
			direction: z.string().optional().describe('debit or credit'),
			workspace_uid: z
				.string()
				.optional()
				.describe(
					'Only transactions recorded for this workspace. The balance stays your whole wallet',
				),
			resource_uid: z
				.string()
				.optional()
				.describe(
					'Only transactions for this mailbox, domain, test, subscription or order ID',
				),
			status: z
				.string()
				.optional()
				.describe(
					'completed (default) or pending. pending lists top ups waiting for their payment',
				),
			include_zero_amount: z
				.boolean()
				.optional()
				.describe('Also list free transactions. Default false'),
		})
		.strict(),
	billingUpdateAutoTopup: z
		.object({
			auto_topup_enabled: z.boolean().describe('Enable or disable auto top-up'),
			auto_topup_trigger_drops_below: z
				.number()
				.int()
				.min(0)
				.describe('Credit threshold to trigger auto top-up'),
			auto_topup_add_credits: z
				.number()
				.int()
				.min(1)
				.describe('Number of credits to add during auto top-up'),
		})
		.strict(),
	billingGetPortalLink: z.object({}).strict(),
	billingGetPricingPlans: z.object({}).strict(),
	billingGetSubscription: z.object({}).strict(),
	billingChangeSubscription: z
		.object({
			uid: z.string().describe('Pricing plan unique identifier'),
		})
		.strict(),
	billingCancelSubscription: z.object({}).strict(),
} as const;

export const BillingOutputSchemas = {
	billingGetWallet: z
		.object({
			error: bool,
			message: str,
			total_credits: num.describe('Total credits available'),
			credits_used: num.describe('Credits consumed'),
			credits_remaining: num.describe('Remaining credits'),
			auto_topup_enabled: bool.describe('Whether auto top-up is enabled'),
			auto_topup_trigger_drops_below: num.describe(
				'Credit threshold for auto top-up',
			),
			auto_topup_add_credits: num.describe('Credits to add during auto top-up'),
			auto_topup_mode: str,
		})
		.loose(),
	billingAddCredits: z
		.object({
			error: bool.describe('Always `false` on success.'),
			message: str,
			payment_link: str.describe('Stripe Checkout URL. Valid for 24 hours.'),
			session_id: str.describe(
				'Stripe Checkout session ID. Pass to `GET /v1/api/billing/wallet/status` to poll payment status.',
			),
		})
		.loose(),
	billingGetWalletLogs: z
		.object({
			error: bool,
			page: num.describe('Current page number'),
			pageSize: num.describe('Results per page'),
			totalPages: num.describe('Total number of pages'),
			totalDocs: num.describe('Total matching transactions'),
			totals: z
				.object({
					total_debit: num.describe('Sum of all debit amounts'),
					total_credit: num.describe('Sum of all credit and refund amounts'),
					count: num.describe('Total matching transactions'),
				})
				.loose()
				.nullish()
				.describe('Aggregated totals for the current filter'),
			logs: z
				.array(
					z
						.object({
							uid: str,
							type: str,
							kind: str,
							amount: num,
							currency: str,
							balance_before: num,
							balance_after: num,
							description: str,
							status: str,
							references: z
								.array(
									z
										.object({
											model: str,
											uids: list,
										})
										.loose(),
								)
								.nullish(),
							created_at: str,
						})
						.loose(),
				)
				.nullish()
				.describe('Array of wallet log entries'),
		})
		.loose(),
	billingGetPaymentStatus: z
		.object({
			error: bool,
			session_id: str.describe('Stripe Checkout session ID (echoed).'),
			payment_status: str.describe(
				'`paid` — payment completed, credits may still be landing. `unpaid` — Checkout link not yet paid.',
			),
			amount: num.describe(
				'Payment amount in USD. `null` before payment completes.',
			),
			currency: str.describe('Payment currency (always `usd`).'),
			credits_applied: bool.describe(
				'`true` once the Stripe webhook has run and credits have landed in the wallet. Can briefly lag `payment_status: paid` by a few seconds.',
			),
		})
		.loose(),
	billingListTransactions: z
		.object({
			error: bool.describe('Always false on success'),
			balance: z
				.object({
					available: num.describe('Your current wallet balance in USD'),
					currency: str.describe('Always USD'),
					as_of: str.describe('When the balance was read (UTC)'),
				})
				.loose()
				.nullish()
				.describe('Your wallet right now'),
			data: z
				.array(
					z
						.object({
							uid: str,
							created_at: str,
							type: str,
							product: str,
							direction: str,
							amount: num,
							signed_amount: num,
							currency: str,
							balance_after: num,
							status: str,
							description: str,
							workspace_uid: str,
							related: z
								.object({
									mailbox_uids: z.array(str).nullish(),
									domain_uids: z.array(str).nullish(),
									domain_names: z.array(str).nullish(),
									placement_test_codes: z.array(str).nullish(),
									subscription_uids: z.array(str).nullish(),
									order_uids: z.array(str).nullish(),
									payment_uid: str,
								})
								.loose()
								.nullish(),
						})
						.loose(),
				)
				.nullish()
				.describe('Transactions, newest first'),
			pagination: z
				.object({
					limit: num.describe('Page size used'),
					has_more: bool.describe(
						'True when there may be more transactions. Keep paging until it is false',
					),
					next_cursor: str.describe(
						'Send as cursor to get the next page. Null on the last page',
					),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	billingUpdateAutoTopup: z
		.object({
			error: bool,
			message: str,
		})
		.loose(),
	billingGetPortalLink: z
		.object({
			error: bool,
			message: str,
			url: str.describe('Stripe billing portal URL'),
		})
		.loose(),
	billingGetPricingPlans: z
		.object({
			plans: z
				.array(
					z
						.object({
							uid: str,
							name: str,
							cycle: str,
							pricing: num,
							features: z.array(str).nullish(),
							active: bool,
							current: bool,
							upgrade: bool,
							downgrade: bool,
							mailbox_slots_azure: num,
							cost_per_add_on_azure_mailbox: num,
						})
						.loose(),
				)
				.nullish()
				.describe('List of available pricing plans'),
			activePlan: z
				.object({
					uid: str,
					name: str,
					cycle: str,
					pricing: num,
				})
				.loose()
				.nullish()
				.describe('Currently active plan details'),
		})
		.loose(),
	billingGetSubscription: z
		.object({
			team: str.describe('Team name'),
			email: str.describe('Admin email address'),
			current_subscription: z
				.object({
					_id: str.describe('Plan database ID'),
					uid: str.describe('Plan unique identifier'),
					name: str.describe('Plan name'),
					cycle: str,
					pricing: num.describe('Plan price in USD'),
					features: z.array(str).nullish(),
					mailbox_slots_azure: num.describe(
						'Legacy field, not used. Azure has no subscription slots.',
					),
					cost_per_add_on_azure_mailbox: num.describe(
						'Legacy field, not used for billing. Azure is charged per domain, not per mailbox. Your Azure price is `credits_per_azure_domain` on Get account details.',
					),
				})
				.loose()
				.nullish()
				.describe('Current active subscription'),
			purchased_on: str.describe('Subscription purchase date'),
			renews_on: str.describe('Next renewal date'),
			pricing_plans: z
				.array(
					z
						.object({
							mailbox_slots_azure: num,
							cost_per_add_on_azure_mailbox: num,
						})
						.loose(),
				)
				.nullish()
				.describe('All available pricing plans'),
		})
		.loose(),
	billingChangeSubscription: looseResult,
	billingCancelSubscription: z
		.object({
			error: bool,
			message: str,
			subscriptions: z
				.array(obj)
				.nullish()
				.describe('Remaining active subscriptions'),
		})
		.loose(),
} as const;
