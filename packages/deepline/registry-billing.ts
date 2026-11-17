import * as contracts from './endpoints/types-billing';

/** Billing reads and writes beyond entitlements/balance/usage/ledger. */
export const billingSchemas = {
	'billing.catalog': {
		input: contracts.GetBillingCatalogInputSchema,
		output: contracts.GetBillingCatalogOutputSchema,
	},
	'billing.plans': {
		input: contracts.GetBillingPlansInputSchema,
		output: contracts.GetBillingPlansOutputSchema,
	},
	'billing.status': {
		input: contracts.GetBillingStatusInputSchema,
		output: contracts.GetBillingStatusOutputSchema,
	},
	'billing.subscription.status': {
		input: contracts.GetBillingSubscriptionStatusInputSchema,
		output: contracts.GetBillingSubscriptionStatusOutputSchema,
	},
	'billing.invoices': {
		input: contracts.ListBillingInvoicesInputSchema,
		output: contracts.ListBillingInvoicesOutputSchema,
	},
	'billing.autoRecharge.get': {
		input: contracts.GetBillingAutoRechargeInputSchema,
		output: contracts.GetBillingAutoRechargeOutputSchema,
	},
	'billing.usageEvents': {
		input: contracts.ListBillingUsageEventsInputSchema,
		output: contracts.ListBillingUsageEventsOutputSchema,
	},
	'billing.includedCompute': {
		input: contracts.GetBillingIncludedComputeInputSchema,
		output: contracts.GetBillingIncludedComputeOutputSchema,
	},
	'billing.quote': {
		input: contracts.GetBillingQuoteInputSchema,
		output: contracts.GetBillingQuoteOutputSchema,
	},
	'billing.subscription.cancel': {
		input: contracts.CancelBillingSubscriptionInputSchema,
		output: contracts.CancelBillingSubscriptionOutputSchema,
	},
	'billing.autoRecharge.update': {
		input: contracts.UpdateBillingAutoRechargeInputSchema,
		output: contracts.UpdateBillingAutoRechargeOutputSchema,
	},
	'billing.topUp': {
		input: contracts.TopUpBillingInputSchema,
		output: contracts.TopUpBillingOutputSchema,
	},
	'billing.creditPurchases.create': {
		input: contracts.CreateBillingCreditPurchaseInputSchema,
		output: contracts.CreateBillingCreditPurchaseOutputSchema,
	},
	'billing.creditPurchases.recover': {
		input: contracts.RecoverBillingCreditPurchaseInputSchema,
		output: contracts.RecoverBillingCreditPurchaseOutputSchema,
	},
	'billing.planTransitions.create': {
		input: contracts.CreateBillingPlanTransitionInputSchema,
		output: contracts.CreateBillingPlanTransitionOutputSchema,
	},
	'billing.portalSessions.create': {
		input: contracts.CreateBillingPortalSessionInputSchema,
		output: contracts.CreateBillingPortalSessionOutputSchema,
	},
} as const;

export const billingMeta = {
	'billing.catalog': {
		riskLevel: 'read',
		description:
			'Read the published plan catalog, meters and the plan the workspace is on',
	},
	'billing.plans': {
		riskLevel: 'read',
		description:
			'List plans that can be started or changed to, and check a promo code without redeeming it',
	},
	'billing.status': {
		riskLevel: 'read',
		description: 'Read plan, payment, recharge and invoice state',
	},
	'billing.subscription.status': {
		riskLevel: 'read',
		description:
			'Read subscription state, renewal and cancellation facts, and remaining credit pools',
	},
	'billing.invoices': {
		riskLevel: 'read',
		description:
			'List subscription invoices and credit purchase receipts, newest first',
	},
	'billing.autoRecharge.get': {
		riskLevel: 'read',
		description: 'Read the automatic credit recharge settings',
	},
	'billing.usageEvents': {
		riskLevel: 'read',
		description:
			'Page raw per-request usage events, or look up one by request_id (not a final charge)',
	},
	'billing.includedCompute': {
		riskLevel: 'read',
		description:
			'Read Play compute pricing, included minutes and minutes used this period',
	},
	'billing.quote': {
		riskLevel: 'read',
		description:
			'Estimate the maximum credits for Play sandbox sessions (quote only, spends nothing)',
	},
	'billing.subscription.cancel': {
		riskLevel: 'destructive',
		description:
			'Cancel the subscription at period end, or undo a pending cancellation (changes the subscription)',
	},
	'billing.autoRecharge.update': {
		riskLevel: 'destructive',
		description:
			'Turn automatic recharge on or off or change its limits (lets Deepline charge the saved card automatically)',
	},
	'billing.topUp': {
		riskLevel: 'destructive',
		description:
			'Charge the saved payment method and add credits (spends money)',
	},
	'billing.creditPurchases.create': {
		riskLevel: 'destructive',
		description: 'Buy credits through a payment-gated purchase (spends money)',
	},
	'billing.creditPurchases.recover': {
		riskLevel: 'write',
		description:
			'Check or retire an uncertain credit purchase by its original key (never charges)',
	},
	'billing.planTransitions.create': {
		riskLevel: 'destructive',
		description:
			'Start, change, cancel or restore the billing plan (changes what the workspace pays)',
	},
	'billing.portalSessions.create': {
		riskLevel: 'write',
		description:
			'Create a Stripe billing portal link for payment details and invoices (the link grants billing access)',
	},
} as const;
