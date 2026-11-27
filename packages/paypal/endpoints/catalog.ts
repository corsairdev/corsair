// Generated with endpoints/operation-types.ts from PayPal's OpenAPI specs:
// one entry per operation in paypal-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { paypalSchemaEntry } from './openapi-schema';
import { createPaypalOperation as op } from './operations';

export const paypalEndpointsNested = {
	balances: {
		get: op('balances.get'),
	},
	disputes: {
		acceptClaim: op('disputes.acceptClaim'),
		acceptOffer: op('disputes.acceptOffer'),
		acknowledgeReturnItem: op('disputes.acknowledgeReturnItem'),
		adjudicate: op('disputes.adjudicate'),
		appeal: op('disputes.appeal'),
		denyOffer: op('disputes.denyOffer'),
		escalate: op('disputes.escalate'),
		get: op('disputes.get'),
		list: op('disputes.list'),
		makeOffer: op('disputes.makeOffer'),
		provideEvidence: op('disputes.provideEvidence'),
		provideSupportingInfo: op('disputes.provideSupportingInfo'),
		requireEvidence: op('disputes.requireEvidence'),
		sendMessage: op('disputes.sendMessage'),
		update: op('disputes.update'),
	},
	invoices: {
		accountingConnections: op('invoices.accountingConnections'),
		accountingSync: op('invoices.accountingSync'),
		cancel: op('invoices.cancel'),
		create: op('invoices.create'),
		delete: op('invoices.delete'),
		deletePayment: op('invoices.deletePayment'),
		deleteRefund: op('invoices.deleteRefund'),
		generateQrCode: op('invoices.generateQrCode'),
		get: op('invoices.get'),
		list: op('invoices.list'),
		nextNumber: op('invoices.nextNumber'),
		recordPayment: op('invoices.recordPayment'),
		recordRefund: op('invoices.recordRefund'),
		remind: op('invoices.remind'),
		search: op('invoices.search'),
		send: op('invoices.send'),
		templates: {
			create: op('invoices.templates.create'),
			delete: op('invoices.templates.delete'),
			get: op('invoices.templates.get'),
			list: op('invoices.templates.list'),
			update: op('invoices.templates.update'),
		},
		update: op('invoices.update'),
	},
	orders: {
		authorize: op('orders.authorize'),
		capture: op('orders.capture'),
		confirmPaymentSource: op('orders.confirmPaymentSource'),
		create: op('orders.create'),
		get: op('orders.get'),
		trackers: {
			create: op('orders.trackers.create'),
			update: op('orders.trackers.update'),
		},
		update: op('orders.update'),
	},
	partnerReferrals: {
		create: op('partnerReferrals.create'),
		get: op('partnerReferrals.get'),
	},
	payments: {
		authorizations: {
			capture: op('payments.authorizations.capture'),
			get: op('payments.authorizations.get'),
			reauthorize: op('payments.authorizations.reauthorize'),
			void: op('payments.authorizations.void'),
		},
		captures: {
			get: op('payments.captures.get'),
			refund: op('payments.captures.refund'),
		},
		findEligibleMethods: op('payments.findEligibleMethods'),
		refunds: {
			get: op('payments.refunds.get'),
		},
	},
	payouts: {
		create: op('payouts.create'),
		get: op('payouts.get'),
		items: {
			cancel: op('payouts.items.cancel'),
			get: op('payouts.items.get'),
		},
	},
	plans: {
		activate: op('plans.activate'),
		create: op('plans.create'),
		deactivate: op('plans.deactivate'),
		get: op('plans.get'),
		list: op('plans.list'),
		update: op('plans.update'),
		updatePricing: op('plans.updatePricing'),
	},
	products: {
		create: op('products.create'),
		get: op('products.get'),
		list: op('products.list'),
		update: op('products.update'),
	},
	subscriptions: {
		activate: op('subscriptions.activate'),
		cancel: op('subscriptions.cancel'),
		capture: op('subscriptions.capture'),
		create: op('subscriptions.create'),
		get: op('subscriptions.get'),
		revise: op('subscriptions.revise'),
		suspend: op('subscriptions.suspend'),
		transactions: op('subscriptions.transactions'),
		update: op('subscriptions.update'),
	},
	trackers: {
		create: op('trackers.create'),
		createBatch: op('trackers.createBatch'),
		get: op('trackers.get'),
		list: op('trackers.list'),
		update: op('trackers.update'),
	},
	transactions: {
		list: op('transactions.list'),
	},
	vault: {
		paymentTokens: {
			create: op('vault.paymentTokens.create'),
			delete: op('vault.paymentTokens.delete'),
			get: op('vault.paymentTokens.get'),
			list: op('vault.paymentTokens.list'),
		},
		setupTokens: {
			create: op('vault.setupTokens.create'),
			get: op('vault.setupTokens.get'),
		},
	},
	webProfiles: {
		create: op('webProfiles.create'),
		delete: op('webProfiles.delete'),
		get: op('webProfiles.get'),
		list: op('webProfiles.list'),
		replace: op('webProfiles.replace'),
		update: op('webProfiles.update'),
	},
	webhooks: {
		availableEventTypes: op('webhooks.availableEventTypes'),
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		eventTypes: op('webhooks.eventTypes'),
		events: {
			get: op('webhooks.events.get'),
			list: op('webhooks.events.list'),
			resend: op('webhooks.events.resend'),
		},
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		lookups: {
			create: op('webhooks.lookups.create'),
			delete: op('webhooks.lookups.delete'),
			get: op('webhooks.lookups.get'),
			list: op('webhooks.lookups.list'),
		},
		simulateEvent: op('webhooks.simulateEvent'),
		update: op('webhooks.update'),
		verifySignature: op('webhooks.verifySignature'),
	},
} as const;

export const paypalEndpointSchemas = {
	'balances.get': paypalSchemaEntry('balances.get'),
	'disputes.acceptClaim': paypalSchemaEntry('disputes.acceptClaim'),
	'disputes.acceptOffer': paypalSchemaEntry('disputes.acceptOffer'),
	'disputes.acknowledgeReturnItem': paypalSchemaEntry(
		'disputes.acknowledgeReturnItem',
	),
	'disputes.adjudicate': paypalSchemaEntry('disputes.adjudicate'),
	'disputes.appeal': paypalSchemaEntry('disputes.appeal'),
	'disputes.denyOffer': paypalSchemaEntry('disputes.denyOffer'),
	'disputes.escalate': paypalSchemaEntry('disputes.escalate'),
	'disputes.get': paypalSchemaEntry('disputes.get'),
	'disputes.list': paypalSchemaEntry('disputes.list'),
	'disputes.makeOffer': paypalSchemaEntry('disputes.makeOffer'),
	'disputes.provideEvidence': paypalSchemaEntry('disputes.provideEvidence'),
	'disputes.provideSupportingInfo': paypalSchemaEntry(
		'disputes.provideSupportingInfo',
	),
	'disputes.requireEvidence': paypalSchemaEntry('disputes.requireEvidence'),
	'disputes.sendMessage': paypalSchemaEntry('disputes.sendMessage'),
	'disputes.update': paypalSchemaEntry('disputes.update'),
	'invoices.accountingConnections': paypalSchemaEntry(
		'invoices.accountingConnections',
	),
	'invoices.accountingSync': paypalSchemaEntry('invoices.accountingSync'),
	'invoices.cancel': paypalSchemaEntry('invoices.cancel'),
	'invoices.create': paypalSchemaEntry('invoices.create'),
	'invoices.delete': paypalSchemaEntry('invoices.delete'),
	'invoices.deletePayment': paypalSchemaEntry('invoices.deletePayment'),
	'invoices.deleteRefund': paypalSchemaEntry('invoices.deleteRefund'),
	'invoices.generateQrCode': paypalSchemaEntry('invoices.generateQrCode'),
	'invoices.get': paypalSchemaEntry('invoices.get'),
	'invoices.list': paypalSchemaEntry('invoices.list'),
	'invoices.nextNumber': paypalSchemaEntry('invoices.nextNumber'),
	'invoices.recordPayment': paypalSchemaEntry('invoices.recordPayment'),
	'invoices.recordRefund': paypalSchemaEntry('invoices.recordRefund'),
	'invoices.remind': paypalSchemaEntry('invoices.remind'),
	'invoices.search': paypalSchemaEntry('invoices.search'),
	'invoices.send': paypalSchemaEntry('invoices.send'),
	'invoices.templates.create': paypalSchemaEntry('invoices.templates.create'),
	'invoices.templates.delete': paypalSchemaEntry('invoices.templates.delete'),
	'invoices.templates.get': paypalSchemaEntry('invoices.templates.get'),
	'invoices.templates.list': paypalSchemaEntry('invoices.templates.list'),
	'invoices.templates.update': paypalSchemaEntry('invoices.templates.update'),
	'invoices.update': paypalSchemaEntry('invoices.update'),
	'orders.authorize': paypalSchemaEntry('orders.authorize'),
	'orders.capture': paypalSchemaEntry('orders.capture'),
	'orders.confirmPaymentSource': paypalSchemaEntry(
		'orders.confirmPaymentSource',
	),
	'orders.create': paypalSchemaEntry('orders.create'),
	'orders.get': paypalSchemaEntry('orders.get'),
	'orders.trackers.create': paypalSchemaEntry('orders.trackers.create'),
	'orders.trackers.update': paypalSchemaEntry('orders.trackers.update'),
	'orders.update': paypalSchemaEntry('orders.update'),
	'partnerReferrals.create': paypalSchemaEntry('partnerReferrals.create'),
	'partnerReferrals.get': paypalSchemaEntry('partnerReferrals.get'),
	'payments.authorizations.capture': paypalSchemaEntry(
		'payments.authorizations.capture',
	),
	'payments.authorizations.get': paypalSchemaEntry(
		'payments.authorizations.get',
	),
	'payments.authorizations.reauthorize': paypalSchemaEntry(
		'payments.authorizations.reauthorize',
	),
	'payments.authorizations.void': paypalSchemaEntry(
		'payments.authorizations.void',
	),
	'payments.captures.get': paypalSchemaEntry('payments.captures.get'),
	'payments.captures.refund': paypalSchemaEntry('payments.captures.refund'),
	'payments.findEligibleMethods': paypalSchemaEntry(
		'payments.findEligibleMethods',
	),
	'payments.refunds.get': paypalSchemaEntry('payments.refunds.get'),
	'payouts.create': paypalSchemaEntry('payouts.create'),
	'payouts.get': paypalSchemaEntry('payouts.get'),
	'payouts.items.cancel': paypalSchemaEntry('payouts.items.cancel'),
	'payouts.items.get': paypalSchemaEntry('payouts.items.get'),
	'plans.activate': paypalSchemaEntry('plans.activate'),
	'plans.create': paypalSchemaEntry('plans.create'),
	'plans.deactivate': paypalSchemaEntry('plans.deactivate'),
	'plans.get': paypalSchemaEntry('plans.get'),
	'plans.list': paypalSchemaEntry('plans.list'),
	'plans.update': paypalSchemaEntry('plans.update'),
	'plans.updatePricing': paypalSchemaEntry('plans.updatePricing'),
	'products.create': paypalSchemaEntry('products.create'),
	'products.get': paypalSchemaEntry('products.get'),
	'products.list': paypalSchemaEntry('products.list'),
	'products.update': paypalSchemaEntry('products.update'),
	'subscriptions.activate': paypalSchemaEntry('subscriptions.activate'),
	'subscriptions.cancel': paypalSchemaEntry('subscriptions.cancel'),
	'subscriptions.capture': paypalSchemaEntry('subscriptions.capture'),
	'subscriptions.create': paypalSchemaEntry('subscriptions.create'),
	'subscriptions.get': paypalSchemaEntry('subscriptions.get'),
	'subscriptions.revise': paypalSchemaEntry('subscriptions.revise'),
	'subscriptions.suspend': paypalSchemaEntry('subscriptions.suspend'),
	'subscriptions.transactions': paypalSchemaEntry('subscriptions.transactions'),
	'subscriptions.update': paypalSchemaEntry('subscriptions.update'),
	'trackers.create': paypalSchemaEntry('trackers.create'),
	'trackers.createBatch': paypalSchemaEntry('trackers.createBatch'),
	'trackers.get': paypalSchemaEntry('trackers.get'),
	'trackers.list': paypalSchemaEntry('trackers.list'),
	'trackers.update': paypalSchemaEntry('trackers.update'),
	'transactions.list': paypalSchemaEntry('transactions.list'),
	'vault.paymentTokens.create': paypalSchemaEntry('vault.paymentTokens.create'),
	'vault.paymentTokens.delete': paypalSchemaEntry('vault.paymentTokens.delete'),
	'vault.paymentTokens.get': paypalSchemaEntry('vault.paymentTokens.get'),
	'vault.paymentTokens.list': paypalSchemaEntry('vault.paymentTokens.list'),
	'vault.setupTokens.create': paypalSchemaEntry('vault.setupTokens.create'),
	'vault.setupTokens.get': paypalSchemaEntry('vault.setupTokens.get'),
	'webProfiles.create': paypalSchemaEntry('webProfiles.create'),
	'webProfiles.delete': paypalSchemaEntry('webProfiles.delete'),
	'webProfiles.get': paypalSchemaEntry('webProfiles.get'),
	'webProfiles.list': paypalSchemaEntry('webProfiles.list'),
	'webProfiles.replace': paypalSchemaEntry('webProfiles.replace'),
	'webProfiles.update': paypalSchemaEntry('webProfiles.update'),
	'webhooks.availableEventTypes': paypalSchemaEntry(
		'webhooks.availableEventTypes',
	),
	'webhooks.create': paypalSchemaEntry('webhooks.create'),
	'webhooks.delete': paypalSchemaEntry('webhooks.delete'),
	'webhooks.eventTypes': paypalSchemaEntry('webhooks.eventTypes'),
	'webhooks.events.get': paypalSchemaEntry('webhooks.events.get'),
	'webhooks.events.list': paypalSchemaEntry('webhooks.events.list'),
	'webhooks.events.resend': paypalSchemaEntry('webhooks.events.resend'),
	'webhooks.get': paypalSchemaEntry('webhooks.get'),
	'webhooks.list': paypalSchemaEntry('webhooks.list'),
	'webhooks.lookups.create': paypalSchemaEntry('webhooks.lookups.create'),
	'webhooks.lookups.delete': paypalSchemaEntry('webhooks.lookups.delete'),
	'webhooks.lookups.get': paypalSchemaEntry('webhooks.lookups.get'),
	'webhooks.lookups.list': paypalSchemaEntry('webhooks.lookups.list'),
	'webhooks.simulateEvent': paypalSchemaEntry('webhooks.simulateEvent'),
	'webhooks.update': paypalSchemaEntry('webhooks.update'),
	'webhooks.verifySignature': paypalSchemaEntry('webhooks.verifySignature'),
} satisfies RequiredPluginEndpointSchemas<typeof paypalEndpointsNested>;

export const paypalEndpointMeta = {
	'balances.get': {
		riskLevel: 'read',
		description:
			'Get the account balances per currency, optionally as of a date',
	},
	'disputes.acceptClaim': {
		riskLevel: 'destructive',
		description: 'Accept claim',
	},
	'disputes.acceptOffer': {
		riskLevel: 'destructive',
		description: 'Accept offer to resolve dispute',
	},
	'disputes.acknowledgeReturnItem': {
		riskLevel: 'destructive',
		description: 'Acknowledge returned item',
	},
	'disputes.adjudicate': {
		riskLevel: 'destructive',
		description: 'Settle dispute',
	},
	'disputes.appeal': {
		riskLevel: 'destructive',
		description: 'Appeal dispute',
	},
	'disputes.denyOffer': {
		riskLevel: 'destructive',
		description: 'Deny offer to resolve dispute',
	},
	'disputes.escalate': {
		riskLevel: 'destructive',
		description: 'Escalate dispute to claim',
	},
	'disputes.get': {
		riskLevel: 'read',
		description: 'Show dispute details',
	},
	'disputes.list': {
		riskLevel: 'read',
		description: 'List disputes',
	},
	'disputes.makeOffer': {
		riskLevel: 'destructive',
		description: 'Make offer to resolve dispute',
	},
	'disputes.provideEvidence': {
		riskLevel: 'destructive',
		description: 'Provide evidence',
	},
	'disputes.provideSupportingInfo': {
		riskLevel: 'destructive',
		description: 'Provide supporting information for dispute',
	},
	'disputes.requireEvidence': {
		riskLevel: 'destructive',
		description: 'Update dispute status',
	},
	'disputes.sendMessage': {
		riskLevel: 'destructive',
		description: 'Send message about dispute to other party',
	},
	'disputes.update': {
		riskLevel: 'write',
		description: 'Partially update dispute',
	},
	'invoices.accountingConnections': {
		riskLevel: 'read',
		description: 'List Connections',
	},
	'invoices.accountingSync': {
		riskLevel: 'read',
		description: 'List Connection Status for an Invoice',
	},
	'invoices.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel sent invoice',
	},
	'invoices.create': {
		riskLevel: 'write',
		description: 'Create draft invoice',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		description: 'Delete invoice',
	},
	'invoices.deletePayment': {
		riskLevel: 'destructive',
		description: 'Delete external payment',
	},
	'invoices.deleteRefund': {
		riskLevel: 'destructive',
		description: 'Delete external refund',
	},
	'invoices.generateQrCode': {
		riskLevel: 'read',
		description: 'Generate QR code',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Show invoice details',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices',
	},
	'invoices.nextNumber': {
		riskLevel: 'write',
		description: 'Generate invoice number',
	},
	'invoices.recordPayment': {
		riskLevel: 'destructive',
		description:
			'Record a payment received outside PayPal (cash, check, bank transfer) against an invoice',
	},
	'invoices.recordRefund': {
		riskLevel: 'destructive',
		description: 'Record a refund made outside PayPal against an invoice',
	},
	'invoices.remind': {
		riskLevel: 'destructive',
		description: 'Send a payment reminder for an invoice by email',
	},
	'invoices.search': {
		riskLevel: 'read',
		description: 'Search for invoices',
	},
	'invoices.send': {
		riskLevel: 'destructive',
		description:
			'Send an invoice to its recipients by email (or mark it sent without emailing with send_to_recipient false)',
	},
	'invoices.templates.create': {
		riskLevel: 'write',
		description: 'Create template',
	},
	'invoices.templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete template',
	},
	'invoices.templates.get': {
		riskLevel: 'read',
		description: 'Show template details',
	},
	'invoices.templates.list': {
		riskLevel: 'read',
		description: 'List templates',
	},
	'invoices.templates.update': {
		riskLevel: 'write',
		description: 'Fully update template',
	},
	'invoices.update': {
		riskLevel: 'destructive',
		description: 'Fully update invoice',
	},
	'orders.authorize': {
		riskLevel: 'destructive',
		description:
			'Authorize the payment of an approved order (capture it later with payments.authorizations.capture)',
	},
	'orders.capture': {
		riskLevel: 'destructive',
		description:
			'Capture the payment of an approved order: money moves from the buyer to you',
	},
	'orders.confirmPaymentSource': {
		riskLevel: 'write',
		description: 'Confirm the Order',
	},
	'orders.create': {
		riskLevel: 'destructive',
		description:
			'Create a Checkout order (intent CAPTURE or AUTHORIZE) with purchase units, amounts and an optional payment source; the buyer approves it through the payer-action link',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Show order details',
	},
	'orders.trackers.create': {
		riskLevel: 'destructive',
		description: 'Add tracking information for an Order',
	},
	'orders.trackers.update': {
		riskLevel: 'write',
		description: 'Update or cancel tracking information for an order',
	},
	'orders.update': {
		riskLevel: 'write',
		description: 'Update order',
	},
	'partnerReferrals.create': {
		riskLevel: 'write',
		description: 'Create partner referral',
	},
	'partnerReferrals.get': {
		riskLevel: 'read',
		description: 'Show referral data',
	},
	'payments.authorizations.capture': {
		riskLevel: 'destructive',
		description: 'Capture an authorized payment, in full or for an amount',
	},
	'payments.authorizations.get': {
		riskLevel: 'read',
		description: 'Show details for authorized payment',
	},
	'payments.authorizations.reauthorize': {
		riskLevel: 'destructive',
		description: 'Reauthorize authorized payment',
	},
	'payments.authorizations.void': {
		riskLevel: 'destructive',
		description: 'Void an authorization so it can no longer be captured',
	},
	'payments.captures.get': {
		riskLevel: 'read',
		description: 'Show captured payment details',
	},
	'payments.captures.refund': {
		riskLevel: 'destructive',
		description:
			'Refund a captured payment, in full or for an amount: the money goes back to the buyer',
	},
	'payments.findEligibleMethods': {
		riskLevel: 'read',
		description: 'Find a list of eligible payment methods',
	},
	'payments.refunds.get': {
		riskLevel: 'read',
		description: 'Show refund details',
	},
	'payouts.create': {
		riskLevel: 'destructive',
		description:
			'Send money to up to 15,000 recipients (email, phone or PayPal id) in one batch payout',
	},
	'payouts.get': {
		riskLevel: 'read',
		description: 'Show payout batch details',
	},
	'payouts.items.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel unclaimed payout item',
	},
	'payouts.items.get': {
		riskLevel: 'read',
		description: 'Show payout item details',
	},
	'plans.activate': {
		riskLevel: 'write',
		description: 'Activate plan',
	},
	'plans.create': {
		riskLevel: 'write',
		description: 'Create plan',
	},
	'plans.deactivate': {
		riskLevel: 'write',
		description: 'Deactivate plan',
	},
	'plans.get': {
		riskLevel: 'read',
		description: 'Show plan details',
	},
	'plans.list': {
		riskLevel: 'read',
		description: 'List plans',
	},
	'plans.update': {
		riskLevel: 'write',
		description: 'Update plan',
	},
	'plans.updatePricing': {
		riskLevel: 'destructive',
		description: 'Update pricing',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create product',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Show product details',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List products',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update product',
	},
	'subscriptions.activate': {
		riskLevel: 'write',
		description: 'Activate subscription',
	},
	'subscriptions.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a subscription: it stops for good',
	},
	'subscriptions.capture': {
		riskLevel: 'destructive',
		description: 'Capture authorized payment on subscription',
	},
	'subscriptions.create': {
		riskLevel: 'write',
		description: 'Create subscription',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Show subscription details',
	},
	'subscriptions.revise': {
		riskLevel: 'destructive',
		description: 'Revise plan or quantity of subscription',
	},
	'subscriptions.suspend': {
		riskLevel: 'destructive',
		description: 'Suspend subscription',
	},
	'subscriptions.transactions': {
		riskLevel: 'read',
		description: 'List transactions for subscription',
	},
	'subscriptions.update': {
		riskLevel: 'write',
		description: 'Update subscription',
	},
	'trackers.create': {
		riskLevel: 'destructive',
		description: 'Add tracking information for PayPal transaction',
	},
	'trackers.createBatch': {
		riskLevel: 'destructive',
		description: 'Add tracking information for multiple PayPal transactions',
	},
	'trackers.get': {
		riskLevel: 'read',
		description: 'Show tracking information',
	},
	'trackers.list': {
		riskLevel: 'read',
		description: 'List tracking information',
	},
	'trackers.update': {
		riskLevel: 'destructive',
		description: 'Update or cancel tracking information for PayPal transaction',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List transactions for up to 31 days, with filters (transaction id or type, status, amount, currency, dates)',
	},
	'vault.paymentTokens.create': {
		riskLevel: 'write',
		description: 'Create payment token for a given payment source',
	},
	'vault.paymentTokens.delete': {
		riskLevel: 'destructive',
		description: 'Delete payment token',
	},
	'vault.paymentTokens.get': {
		riskLevel: 'read',
		description: 'Retrieve a payment token',
	},
	'vault.paymentTokens.list': {
		riskLevel: 'read',
		description: 'List all payment tokens',
	},
	'vault.setupTokens.create': {
		riskLevel: 'write',
		description: 'Create a setup token',
	},
	'vault.setupTokens.get': {
		riskLevel: 'read',
		description: 'Retrieve a setup token',
	},
	'webProfiles.create': {
		riskLevel: 'write',
		description: 'Create web experience profile',
	},
	'webProfiles.delete': {
		riskLevel: 'destructive',
		description: 'Delete web experience profile',
	},
	'webProfiles.get': {
		riskLevel: 'read',
		description: 'Show web experience profile details by ID',
	},
	'webProfiles.list': {
		riskLevel: 'read',
		description: 'List web experience profiles',
	},
	'webProfiles.replace': {
		riskLevel: 'write',
		description: 'Update web experience profile',
	},
	'webProfiles.update': {
		riskLevel: 'write',
		description: 'Partially update web experience profile',
	},
	'webhooks.availableEventTypes': {
		riskLevel: 'read',
		description: 'List available events',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete webhook',
	},
	'webhooks.eventTypes': {
		riskLevel: 'read',
		description: 'List event subscriptions for webhook',
	},
	'webhooks.events.get': {
		riskLevel: 'read',
		description: 'Show event notification details',
	},
	'webhooks.events.list': {
		riskLevel: 'read',
		description: 'List event notifications',
	},
	'webhooks.events.resend': {
		riskLevel: 'destructive',
		description: 'Resend event notification',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Show webhook details',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhooks',
	},
	'webhooks.lookups.create': {
		riskLevel: 'write',
		description: 'Create webhook lookup',
	},
	'webhooks.lookups.delete': {
		riskLevel: 'destructive',
		description: 'Delete webhook lookup',
	},
	'webhooks.lookups.get': {
		riskLevel: 'read',
		description: 'Show webhook lookup details',
	},
	'webhooks.lookups.list': {
		riskLevel: 'read',
		description: 'List webhook lookups',
	},
	'webhooks.simulateEvent': {
		riskLevel: 'write',
		description:
			'Send a sample event of a type to a webhook (sandbox and live)',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update webhook',
	},
	'webhooks.verifySignature': {
		riskLevel: 'read',
		description:
			"Verify a webhook delivery's signature with PayPal (the plugin's webhooks verify offline with PayPal's certificate)",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof paypalEndpointsNested>;
