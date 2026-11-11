import { z } from 'zod';

const RouteId = z.union([z.string(), z.number()]).refine((value) => {
	const text = String(value);
	return (
		text.length > 0 && !['.', '..'].includes(text) && !/[\\/'"]/u.test(text)
	);
}, 'Route identifiers must be safe path segments');

const NullableString = z.string().nullable();
const PageInput = z.object({ page: z.number().int().min(1).optional() });
// Nested financial payloads include provider-defined values whose fields vary by method.
const JsonObject = z.object({}).loose();
const WebhookEvent = z.enum([
	'campaign.created',
	'campaign.updated',
	'ticket.created',
	'transaction.succeeded',
	'contact.created',
	'plan.canceled',
	'plan.created',
	'plan.failed',
	'plan.paused',
	'plan.resumed',
	'plan.updated',
	'refund.created',
]);
const PaymentMethod = z.enum([
	'ach',
	'card',
	'cash',
	'check',
	'digital_wallet',
	'donor_advised_fund',
	'paypal',
	'venmo',
	'cashapp',
	'terminal',
	'stock',
	'in-kind',
	'property',
	'other',
	'none',
]);
const DedicationType = z.enum(['in_memory_of', 'in_honor_of']);

const TransactionResource = z
	.object({
		id: z.string(),
		amount: z.number().optional(),
		currency: z.string().optional(),
		status: z.string().optional(),
		method: z.string().optional(),
		transacted_at: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.loose();
const MessageResource = z
	.object({
		id: z.string(),
		status: z.string().optional(),
		channel: z.string().optional(),
	})
	.loose();
const PayoutResource = z
	.object({
		id: z.string(),
		amount: z.number().optional(),
		status: z.string().optional(),
	})
	.loose();
const PledgeResource = z
	.object({
		id: z.string(),
		status: z.string().optional(),
		amount: z.string().optional(),
	})
	.loose();
const WebhookResource = z
	.object({
		id: z.string(),
		url: z.string().optional(),
		enabled: z.boolean().optional(),
	})
	.loose();

const PageSchema = z.object({
	data: z.array(JsonObject),
	links: z.object({
		first: NullableString,
		last: NullableString,
		prev: NullableString,
		next: NullableString,
	}),
	meta: z.object({
		current_page: z.number().int().min(1),
		from: z.number().int().min(1).nullable(),
		last_page: z.number().int().min(1),
		links: z.array(
			z.object({ url: NullableString, label: z.string(), active: z.boolean() }),
		),
		path: NullableString,
		per_page: z.number().int().min(0),
		to: z.number().int().min(1).nullable(),
		total: z.number().int().min(0),
	}),
});

const TransactionFields = {
	campaign_code: NullableString.optional(),
	campaign_title: z.string().max(255).optional(),
	campaign_team_id: z.number().int().nullable().optional(),
	team_member_id: z.number().int().nullable().optional(),
	contact_id: z.number().int().nullable().optional(),
	contact_external_id: z.string().max(255).nullable().optional(),
	fund_code: z.string().max(255).nullable().optional(),
	mark_deposited: z.boolean().nullable().optional(),
	timezone: NullableString.optional(),
	acknowledged_at: NullableString.optional(),
	external_label: z.string().max(255).nullable().optional(),
	external_id: z.string().max(255).nullable().optional(),
	contact_contact_since: NullableString.optional(),
	fee_covered: NullableString.optional(),
	platform_fee: NullableString.optional(),
	processing_fee: NullableString.optional(),
	check_number: z.string().max(255).nullable().optional(),
	check_deposited_at: NullableString.optional(),
	company: z.string().max(255).nullable().optional(),
	internal_note: z.string().max(131070).nullable().optional(),
	first_name: z.string().max(255).nullable().optional(),
	last_name: z.string().max(255).nullable().optional(),
	email: z.string().max(255).nullable().optional(),
	phone: NullableString.optional(),
	address_1: z.string().max(255).nullable().optional(),
	address_2: z.string().max(255).nullable().optional(),
	city: z.string().max(255).nullable().optional(),
	state: z.string().max(255).nullable().optional(),
	zipcode: z.string().max(255).nullable().optional(),
	country: NullableString.optional(),
	dedication_type: DedicationType.optional(),
	dedication_name: z.string().max(255).nullable().optional(),
	dedication_recipient_name: z.string().max(255).nullable().optional(),
	dedication_recipient_email: NullableString.optional(),
	giving_space_message: z.string().max(65535).nullable().optional(),
	appeal_code: z.string().max(255).nullable().optional(),
	appeal_name: z.string().max(255).nullable().optional(),
	appeal_status: NullableString.optional(),
} as const;

const TransactionUpdateFields = {
	transaction_id: z.string().optional(),
	internal_note: z.string().max(131070).nullable().optional(),
	check_number: z.string().max(255).nullable().optional(),
	check_deposited_at: NullableString.optional(),
	custom_fields: z.array(z.string()).optional(),
	team_id: z.string().optional(),
	campaign_member_id: z.string().optional(),
	fund_id: z.string().optional(),
	campaign_id: z.string().optional(),
	method: z.string().optional(),
	transacted_at: z.string().optional(),
	appeal_id: z.string().optional(),
	offline_payment_received: z.string().optional(),
	dedication: z
		.object({
			type: DedicationType,
			name: z.string().max(255),
			recipient_name: z.string().max(255).nullable(),
			recipient_email: z.string().nullable(),
		})
		.optional(),
} as const;

const WebhookPathInputSchema = z.object({ webhook: RouteId });
const WebhookActivityPathInputSchema = z.object({
	webhook: RouteId,
	activity: RouteId,
});

export const GivebutterFinancialEndpointInputSchemas = {
	listMessages: z.object({}).extend(PageInput.shape),
	getMessage: z.object({ message: RouteId }),
	listPayouts: z.object({}).extend(PageInput.shape),
	getPayout: z.object({ payout: RouteId }),
	listPledges: z.object({}).extend(PageInput.shape),
	getPledge: z.object({ pledge: RouteId }),
	listPlans: z
		.object({ contacts: NullableString.optional() })
		.extend(PageInput.shape),
	getPlan: z.object({
		plan: RouteId,
		first_name: z.string().max(255).optional(),
		last_name: z.string().max(255).optional(),
		email: z.string().optional(),
		amount: z.string().optional(),
	}),
	listTransactions: z
		.object({
			transactedAfter: NullableString.optional(),
			transactedBefore: NullableString.optional(),
			createdAfter: NullableString.optional(),
			createdBefore: NullableString.optional(),
			updatedAfter: NullableString.optional(),
			updatedBefore: NullableString.optional(),
			checkDepositedAfter: NullableString.optional(),
			checkDepositedBefore: NullableString.optional(),
			contacts: NullableString.optional(),
			method: NullableString.optional(),
			scope: z.enum(['all', 'benefiting', 'chapters']).nullable().optional(),
			sortBy: z
				.enum(['amount', 'transacted_at', 'created_at', 'contact_name'])
				.nullable()
				.optional(),
			sortByDesc: z
				.enum(['amount', 'transacted_at', 'created_at', 'contact_name'])
				.nullable()
				.optional(),
		})
		.extend(PageInput.shape),
	createTransaction: z.object({
		...TransactionFields,
		method: PaymentMethod,
		transacted_at: z.string(),
		amount: z.string(),
	}),
	getTransaction: z.object({ transaction: RouteId }),
	updateTransaction: z.object({
		transaction: RouteId,
		...TransactionUpdateFields,
	}),
	listWebhooks: z.object({}).extend(PageInput.shape),
	createWebhook: z.object({
		url: z.string().url(),
		event: WebhookEvent.optional(),
		events: z.array(WebhookEvent).optional(),
		name: z.string().max(255).nullable().optional(),
		enabled: z.boolean().optional(),
	}),
	getWebhook: WebhookPathInputSchema,
	updateWebhook: z.object({
		webhook: RouteId,
		url: z.string().url(),
		events: z.array(WebhookEvent).min(1),
		name: z.string().max(255).nullable().optional(),
		enabled: z.boolean().optional(),
	}),
	deleteWebhook: WebhookPathInputSchema,
	listWebhookActivities: WebhookPathInputSchema.extend(PageInput.shape),
	getWebhookActivity: WebhookActivityPathInputSchema,
} as const;

export const GivebutterFinancialEndpointOutputSchemas = {
	listMessages: PageSchema.extend({ data: z.array(MessageResource) }),
	getMessage: MessageResource,
	listPayouts: PageSchema.extend({ data: z.array(PayoutResource) }),
	getPayout: PayoutResource,
	listPledges: PageSchema.extend({ data: z.array(PledgeResource) }),
	getPledge: PledgeResource,
	listPlans: PageSchema,
	getPlan: JsonObject,
	listTransactions: PageSchema.extend({
		data: z.array(TransactionResource),
		meta: PageSchema.shape.meta.extend({ unfiltered_total: z.number().int() }),
	}),
	createTransaction: TransactionResource,
	getTransaction: TransactionResource,
	updateTransaction: TransactionResource,
	listWebhooks: PageSchema.extend({ data: z.array(WebhookResource) }),
	createWebhook: WebhookResource,
	getWebhook: WebhookResource,
	updateWebhook: WebhookResource,
	deleteWebhook: z.void(),
	listWebhookActivities: PageSchema,
	getWebhookActivity: JsonObject,
} as const;

export type GivebutterFinancialEndpointInputs = {
	[K in keyof typeof GivebutterFinancialEndpointInputSchemas]: z.infer<
		(typeof GivebutterFinancialEndpointInputSchemas)[K]
	>;
};

export type GivebutterFinancialEndpointOutputs = {
	[K in keyof typeof GivebutterFinancialEndpointOutputSchemas]: z.infer<
		(typeof GivebutterFinancialEndpointOutputSchemas)[K]
	>;
};
