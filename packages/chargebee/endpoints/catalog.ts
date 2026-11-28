// Generated with endpoints/operation-types.ts from Chargebee's OpenAPI spec:
// one entry per operation in chargebee-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { chargebeeSchemaEntry } from './openapi-schema';
import { createChargebeeOperation as op } from './operations';

export const chargebeeEndpointsNested = {
	addons: {
		copy: op('addons.copy'),
		create: op('addons.create'),
		delete: op('addons.delete'),
		get: op('addons.get'),
		list: op('addons.list'),
		unarchive: op('addons.unarchive'),
		update: op('addons.update'),
	},
	addresses: {
		create: op('addresses.create'),
		list: op('addresses.list'),
	},
	alerts: {
		create: op('alerts.create'),
		delete: op('alerts.delete'),
		get: op('alerts.get'),
		list: op('alerts.list'),
		listStatuses: op('alerts.listStatuses'),
		update: op('alerts.update'),
	},
	attachedItems: {
		delete: op('attachedItems.delete'),
		get: op('attachedItems.get'),
		update: op('attachedItems.update'),
	},
	batch: {
		ingestUsages: op('batch.ingestUsages'),
	},
	businessEntities: {
		create: op('businessEntities.create'),
		get: op('businessEntities.get'),
		list: op('businessEntities.list'),
		listTransfers: op('businessEntities.listTransfers'),
		transfer: op('businessEntities.transfer'),
		update: op('businessEntities.update'),
	},
	businessRules: {
		activate: op('businessRules.activate'),
		apply: op('businessRules.apply'),
		create: op('businessRules.create'),
		deactivate: op('businessRules.deactivate'),
		delete: op('businessRules.delete'),
		deleteDraft: op('businessRules.deleteDraft'),
		get: op('businessRules.get'),
		getDraft: op('businessRules.getDraft'),
		list: op('businessRules.list'),
		release: op('businessRules.release'),
		updateDraft: op('businessRules.updateDraft'),
	},
	businessRulesets: {
		activate: op('businessRulesets.activate'),
		addRules: op('businessRulesets.addRules'),
		create: op('businessRulesets.create'),
		deactivate: op('businessRulesets.deactivate'),
		delete: op('businessRulesets.delete'),
		get: op('businessRulesets.get'),
		list: op('businessRulesets.list'),
		listRules: op('businessRulesets.listRules'),
		removeRules: op('businessRulesets.removeRules'),
		update: op('businessRulesets.update'),
	},
	cards: {
		get: op('cards.get'),
	},
	collectionsPaymentPromises: {
		cancel: op('collectionsPaymentPromises.cancel'),
		create: op('collectionsPaymentPromises.create'),
		get: op('collectionsPaymentPromises.get'),
		list: op('collectionsPaymentPromises.list'),
		update: op('collectionsPaymentPromises.update'),
	},
	comments: {
		create: op('comments.create'),
		delete: op('comments.delete'),
		get: op('comments.get'),
		list: op('comments.list'),
	},
	configurations: {
		list: op('configurations.list'),
	},
	couponCodes: {
		archive: op('couponCodes.archive'),
		get: op('couponCodes.get'),
		list: op('couponCodes.list'),
	},
	couponSets: {
		addCouponCodes: op('couponSets.addCouponCodes'),
		create: op('couponSets.create'),
		delete: op('couponSets.delete'),
		deleteUnusedCouponCodes: op('couponSets.deleteUnusedCouponCodes'),
		get: op('couponSets.get'),
		list: op('couponSets.list'),
		update: op('couponSets.update'),
	},
	coupons: {
		copy: op('coupons.copy'),
		create: op('coupons.create'),
		createForItems: op('coupons.createForItems'),
		delete: op('coupons.delete'),
		get: op('coupons.get'),
		list: op('coupons.list'),
		unarchive: op('coupons.unarchive'),
		update: op('coupons.update'),
		updateForItems: op('coupons.updateForItems'),
	},
	creditNotes: {
		create: op('creditNotes.create'),
		delete: op('creditNotes.delete'),
		downloadEinvoice: op('creditNotes.downloadEinvoice'),
		get: op('creditNotes.get'),
		getPdf: op('creditNotes.getPdf'),
		import: op('creditNotes.import'),
		list: op('creditNotes.list'),
		recordRefund: op('creditNotes.recordRefund'),
		refund: op('creditNotes.refund'),
		removeTaxWithheldRefund: op('creditNotes.removeTaxWithheldRefund'),
		resendEinvoice: op('creditNotes.resendEinvoice'),
		sendEinvoice: op('creditNotes.sendEinvoice'),
		sendEmail: op('creditNotes.sendEmail'),
		update: op('creditNotes.update'),
		void: op('creditNotes.void'),
	},
	creditUnits: {
		archive: op('creditUnits.archive'),
		create: op('creditUnits.create'),
		list: op('creditUnits.list'),
		reactivate: op('creditUnits.reactivate'),
		update: op('creditUnits.update'),
	},
	csvTaxRules: {
		create: op('csvTaxRules.create'),
	},
	currencies: {
		addSchedule: op('currencies.addSchedule'),
		create: op('currencies.create'),
		get: op('currencies.get'),
		getList: op('currencies.getList'),
		removeSchedule: op('currencies.removeSchedule'),
		update: op('currencies.update'),
	},
	customFieldConfigs: {
		getMetadata: op('customFieldConfigs.getMetadata'),
		list: op('customFieldConfigs.list'),
	},
	customers: {
		addContact: op('customers.addContact'),
		assignPaymentRole: op('customers.assignPaymentRole'),
		changeBillingDate: op('customers.changeBillingDate'),
		clearPersonalData: op('customers.clearPersonalData'),
		collectPayment: op('customers.collectPayment'),
		copyCard: op('customers.copyCard'),
		create: op('customers.create'),
		createSubscription: op('customers.createSubscription'),
		createSubscriptionEstimate: op('customers.createSubscriptionEstimate'),
		createSubscriptionForItems: op('customers.createSubscriptionForItems'),
		createSubscriptionForItemsEstimate: op(
			'customers.createSubscriptionForItemsEstimate',
		),
		createSubscriptionQuote: op('customers.createSubscriptionQuote'),
		createSubscriptionQuoteForItems: op(
			'customers.createSubscriptionQuoteForItems',
		),
		delete: op('customers.delete'),
		deleteCard: op('customers.deleteCard'),
		deleteContact: op('customers.deleteContact'),
		delink: op('customers.delink'),
		get: op('customers.get'),
		getHierarchy: op('customers.getHierarchy'),
		getUpcomingInvoicesEstimate: op('customers.getUpcomingInvoicesEstimate'),
		importSubscription: op('customers.importSubscription'),
		importSubscriptionForItems: op('customers.importSubscriptionForItems'),
		link: op('customers.link'),
		list: op('customers.list'),
		listContacts: op('customers.listContacts'),
		listEmailLogs: op('customers.listEmailLogs'),
		listEntitlements: op('customers.listEntitlements'),
		listHierarchyDetails: op('customers.listHierarchyDetails'),
		listPaymentVouchers: op('customers.listPaymentVouchers'),
		merge: op('customers.merge'),
		move: op('customers.move'),
		recordExcessPayment: op('customers.recordExcessPayment'),
		sendPaymentRequest: op('customers.sendPaymentRequest'),
		switchGateway: op('customers.switchGateway'),
		update: op('customers.update'),
		updateBillingInfo: op('customers.updateBillingInfo'),
		updateCard: op('customers.updateCard'),
		updateContact: op('customers.updateContact'),
		updateHierarchySettings: op('customers.updateHierarchySettings'),
		updatePaymentMethod: op('customers.updatePaymentMethod'),
	},
	differentialPrices: {
		delete: op('differentialPrices.delete'),
		get: op('differentialPrices.get'),
		list: op('differentialPrices.list'),
		update: op('differentialPrices.update'),
	},
	disputes: {
		get: op('disputes.get'),
		list: op('disputes.list'),
	},
	einvoices: {
		get: op('einvoices.get'),
		list: op('einvoices.list'),
	},
	entitlements: {
		create: op('entitlements.create'),
		list: op('entitlements.list'),
	},
	estimates: {
		createInvoice: op('estimates.createInvoice'),
		createInvoiceForItems: op('estimates.createInvoiceForItems'),
		createSubscription: op('estimates.createSubscription'),
		createSubscriptionForItems: op('estimates.createSubscriptionForItems'),
		giftSubscription: op('estimates.giftSubscription'),
		giftSubscriptionForItems: op('estimates.giftSubscriptionForItems'),
		paymentSchedules: op('estimates.paymentSchedules'),
		updateSubscription: op('estimates.updateSubscription'),
		updateSubscriptionForItems: op('estimates.updateSubscriptionForItems'),
	},
	events: {
		get: op('events.get'),
		list: op('events.list'),
	},
	exports: {
		addons: op('exports.addons'),
		attachedItems: op('exports.attachedItems'),
		coupons: op('exports.coupons'),
		creditNotes: op('exports.creditNotes'),
		customers: op('exports.customers'),
		deferredRevenue: op('exports.deferredRevenue'),
		differentialPrices: op('exports.differentialPrices'),
		get: op('exports.get'),
		invoices: op('exports.invoices'),
		itemFamilies: op('exports.itemFamilies'),
		itemPrices: op('exports.itemPrices'),
		items: op('exports.items'),
		orders: op('exports.orders'),
		plans: op('exports.plans'),
		priceVariants: op('exports.priceVariants'),
		ramps: op('exports.ramps'),
		revenueRecognition: op('exports.revenueRecognition'),
		subscriptions: op('exports.subscriptions'),
		transactions: op('exports.transactions'),
	},
	features: {
		activate: op('features.activate'),
		archive: op('features.archive'),
		create: op('features.create'),
		delete: op('features.delete'),
		get: op('features.get'),
		list: op('features.list'),
		listItemEntitlements: op('features.listItemEntitlements'),
		reactivate: op('features.reactivate'),
		update: op('features.update'),
		upsertItemEntitlements: op('features.upsertItemEntitlements'),
	},
	fullExports: {
		getStatus: op('fullExports.getStatus'),
	},
	gatewayRequestLogs: {
		get: op('gatewayRequestLogs.get'),
		list: op('gatewayRequestLogs.list'),
	},
	gatewayWebhookLogs: {
		get: op('gatewayWebhookLogs.get'),
		list: op('gatewayWebhookLogs.list'),
	},
	gifts: {
		cancel: op('gifts.cancel'),
		claim: op('gifts.claim'),
		create: op('gifts.create'),
		createForItems: op('gifts.createForItems'),
		get: op('gifts.get'),
		list: op('gifts.list'),
		update: op('gifts.update'),
	},
	grantBlocks: {
		list: op('grantBlocks.list'),
	},
	hostedPages: {
		acceptQuote: op('hostedPages.acceptQuote'),
		acknowledge: op('hostedPages.acknowledge'),
		checkoutExisting: op('hostedPages.checkoutExisting'),
		checkoutExistingForItems: op('hostedPages.checkoutExistingForItems'),
		checkoutGift: op('hostedPages.checkoutGift'),
		checkoutGiftForItems: op('hostedPages.checkoutGiftForItems'),
		checkoutNew: op('hostedPages.checkoutNew'),
		checkoutNewForItems: op('hostedPages.checkoutNewForItems'),
		checkoutOneTime: op('hostedPages.checkoutOneTime'),
		checkoutOneTimeForItems: op('hostedPages.checkoutOneTimeForItems'),
		claimGift: op('hostedPages.claimGift'),
		collectNow: op('hostedPages.collectNow'),
		extendSubscription: op('hostedPages.extendSubscription'),
		get: op('hostedPages.get'),
		list: op('hostedPages.list'),
		managePaymentSources: op('hostedPages.managePaymentSources'),
		notifyEvent: op('hostedPages.notifyEvent'),
		preCancel: op('hostedPages.preCancel'),
		retrieveAgreementPdf: op('hostedPages.retrieveAgreementPdf'),
		viewVoucher: op('hostedPages.viewVoucher'),
	},
	inAppSubscriptions: {
		importReceipt: op('inAppSubscriptions.importReceipt'),
		importSubscription: op('inAppSubscriptions.importSubscription'),
		processPurchase: op('inAppSubscriptions.processPurchase'),
		retrieveStoreSubscription: op(
			'inAppSubscriptions.retrieveStoreSubscription',
		),
	},
	invoices: {
		addAddonCharge: op('invoices.addAddonCharge'),
		addCharge: op('invoices.addCharge'),
		addChargeItem: op('invoices.addChargeItem'),
		applyCredits: op('invoices.applyCredits'),
		applyPaymentScheduleScheme: op('invoices.applyPaymentScheduleScheme'),
		applyPayments: op('invoices.applyPayments'),
		charge: op('invoices.charge'),
		chargeAddon: op('invoices.chargeAddon'),
		close: op('invoices.close'),
		collectPayment: op('invoices.collectPayment'),
		create: op('invoices.create'),
		createForChargeItemsAndCharges: op(
			'invoices.createForChargeItemsAndCharges',
		),
		delete: op('invoices.delete'),
		deleteLineItems: op('invoices.deleteLineItems'),
		downloadEinvoice: op('invoices.downloadEinvoice'),
		get: op('invoices.get'),
		getPaymentSchedules: op('invoices.getPaymentSchedules'),
		getPdf: op('invoices.getPdf'),
		import: op('invoices.import'),
		list: op('invoices.list'),
		listPaymentReferenceNumbers: op('invoices.listPaymentReferenceNumbers'),
		listPaymentVouchers: op('invoices.listPaymentVouchers'),
		listPayments: op('invoices.listPayments'),
		pauseDunning: op('invoices.pauseDunning'),
		recordPayment: op('invoices.recordPayment'),
		recordRefund: op('invoices.recordRefund'),
		recordTaxWithheld: op('invoices.recordTaxWithheld'),
		refund: op('invoices.refund'),
		removeCreditNote: op('invoices.removeCreditNote'),
		removePayment: op('invoices.removePayment'),
		removePaymentScheduleScheme: op('invoices.removePaymentScheduleScheme'),
		removeTaxWithheld: op('invoices.removeTaxWithheld'),
		resendEinvoice: op('invoices.resendEinvoice'),
		resumeDunning: op('invoices.resumeDunning'),
		sendEinvoice: op('invoices.sendEinvoice'),
		sendEmail: op('invoices.sendEmail'),
		stopDunning: op('invoices.stopDunning'),
		syncUsages: op('invoices.syncUsages'),
		updateDetails: op('invoices.updateDetails'),
		void: op('invoices.void'),
		voidBeforeCapture: op('invoices.voidBeforeCapture'),
		writeOff: op('invoices.writeOff'),
	},
	itemFamilies: {
		create: op('itemFamilies.create'),
		delete: op('itemFamilies.delete'),
		get: op('itemFamilies.get'),
		list: op('itemFamilies.list'),
		update: op('itemFamilies.update'),
	},
	itemPrices: {
		create: op('itemPrices.create'),
		createDifferentialPrice: op('itemPrices.createDifferentialPrice'),
		delete: op('itemPrices.delete'),
		get: op('itemPrices.get'),
		list: op('itemPrices.list'),
		listApplicableItemPrices: op('itemPrices.listApplicableItemPrices'),
		listApplicableItems: op('itemPrices.listApplicableItems'),
		update: op('itemPrices.update'),
	},
	items: {
		create: op('items.create'),
		createAttachedItem: op('items.createAttachedItem'),
		delete: op('items.delete'),
		get: op('items.get'),
		list: op('items.list'),
		listAttachedItems: op('items.listAttachedItems'),
		listItemEntitlements: op('items.listItemEntitlements'),
		update: op('items.update'),
		upsertItemEntitlements: op('items.upsertItemEntitlements'),
	},
	ledgerAccountBalances: {
		list: op('ledgerAccountBalances.list'),
		updateOverdraftLimit: op('ledgerAccountBalances.updateOverdraftLimit'),
	},
	ledgerOperations: {
		allocate: op('ledgerOperations.allocate'),
		authorize: op('ledgerOperations.authorize'),
		capture: op('ledgerOperations.capture'),
		captureAuthorization: op('ledgerOperations.captureAuthorization'),
		get: op('ledgerOperations.get'),
		list: op('ledgerOperations.list'),
		releaseAuthorization: op('ledgerOperations.releaseAuthorization'),
	},
	meteredFeatures: {
		archive: op('meteredFeatures.archive'),
		create: op('meteredFeatures.create'),
		delete: op('meteredFeatures.delete'),
		reactivate: op('meteredFeatures.reactivate'),
	},
	meters: {
		list: op('meters.list'),
	},
	nonSubscriptions: {
		oneTimePurchase: op('nonSubscriptions.oneTimePurchase'),
	},
	offerEvents: {
		create: op('offerEvents.create'),
	},
	offerFulfillments: {
		create: op('offerFulfillments.create'),
		get: op('offerFulfillments.get'),
		update: op('offerFulfillments.update'),
	},
	omnichannelOneTimeOrders: {
		get: op('omnichannelOneTimeOrders.get'),
		list: op('omnichannelOneTimeOrders.list'),
	},
	omnichannelSubscriptionItems: {
		listScheduledChanges: op(
			'omnichannelSubscriptionItems.listScheduledChanges',
		),
	},
	omnichannelSubscriptions: {
		get: op('omnichannelSubscriptions.get'),
		list: op('omnichannelSubscriptions.list'),
		listTransactions: op('omnichannelSubscriptions.listTransactions'),
		move: op('omnichannelSubscriptions.move'),
	},
	orders: {
		assignOrderNumber: op('orders.assignOrderNumber'),
		cancel: op('orders.cancel'),
		create: op('orders.create'),
		createRefundableCreditNote: op('orders.createRefundableCreditNote'),
		delete: op('orders.delete'),
		get: op('orders.get'),
		import: op('orders.import'),
		list: op('orders.list'),
		reopen: op('orders.reopen'),
		resend: op('orders.resend'),
		update: op('orders.update'),
	},
	organizationDetails: {
		create: op('organizationDetails.create'),
		get: op('organizationDetails.get'),
		list: op('organizationDetails.list'),
	},
	paymentIntents: {
		create: op('paymentIntents.create'),
		get: op('paymentIntents.get'),
		update: op('paymentIntents.update'),
	},
	paymentScheduleSchemes: {
		create: op('paymentScheduleSchemes.create'),
		delete: op('paymentScheduleSchemes.delete'),
		get: op('paymentScheduleSchemes.get'),
		list: op('paymentScheduleSchemes.list'),
	},
	paymentSchedules: {
		list: op('paymentSchedules.list'),
	},
	paymentSources: {
		createBankAccount: op('paymentSources.createBankAccount'),
		createCard: op('paymentSources.createCard'),
		createUsingPaymentIntent: op('paymentSources.createUsingPaymentIntent'),
		createUsingPermanentToken: op('paymentSources.createUsingPermanentToken'),
		createUsingTempToken: op('paymentSources.createUsingTempToken'),
		createUsingToken: op('paymentSources.createUsingToken'),
		createVoucherPaymentSource: op('paymentSources.createVoucherPaymentSource'),
		delete: op('paymentSources.delete'),
		deleteLocal: op('paymentSources.deleteLocal'),
		export: op('paymentSources.export'),
		get: op('paymentSources.get'),
		list: op('paymentSources.list'),
		listGatewayPaymentMethodTokens: op(
			'paymentSources.listGatewayPaymentMethodTokens',
		),
		switchGatewayAccount: op('paymentSources.switchGatewayAccount'),
		updateBankAccount: op('paymentSources.updateBankAccount'),
		updateCard: op('paymentSources.updateCard'),
		verifyBankAccount: op('paymentSources.verifyBankAccount'),
	},
	paymentVouchers: {
		create: op('paymentVouchers.create'),
		get: op('paymentVouchers.get'),
	},
	pc2MigrationItemFamilies: {
		create: op('pc2MigrationItemFamilies.create'),
		delete: op('pc2MigrationItemFamilies.delete'),
		get: op('pc2MigrationItemFamilies.get'),
		list: op('pc2MigrationItemFamilies.list'),
		update: op('pc2MigrationItemFamilies.update'),
	},
	pc2MigrationItemPrices: {
		delete: op('pc2MigrationItemPrices.delete'),
		get: op('pc2MigrationItemPrices.get'),
		list: op('pc2MigrationItemPrices.list'),
		update: op('pc2MigrationItemPrices.update'),
	},
	pc2MigrationItems: {
		create: op('pc2MigrationItems.create'),
		delete: op('pc2MigrationItems.delete'),
		get: op('pc2MigrationItems.get'),
		list: op('pc2MigrationItems.list'),
		listApplicableItems: op('pc2MigrationItems.listApplicableItems'),
		update: op('pc2MigrationItems.update'),
	},
	pc2Migrations: {
		contactSupport: op('pc2Migrations.contactSupport'),
		create: op('pc2Migrations.create'),
		get: op('pc2Migrations.get'),
		initiate: op('pc2Migrations.initiate'),
	},
	personalizedOffers: {
		create: op('personalizedOffers.create'),
	},
	plans: {
		copy: op('plans.copy'),
		create: op('plans.create'),
		delete: op('plans.delete'),
		get: op('plans.get'),
		list: op('plans.list'),
		unarchive: op('plans.unarchive'),
		update: op('plans.update'),
	},
	portalSessions: {
		activate: op('portalSessions.activate'),
		create: op('portalSessions.create'),
		get: op('portalSessions.get'),
		logout: op('portalSessions.logout'),
	},
	priceRamps: {
		create: op('priceRamps.create'),
		delete: op('priceRamps.delete'),
		get: op('priceRamps.get'),
		list: op('priceRamps.list'),
		update: op('priceRamps.update'),
	},
	priceVariants: {
		create: op('priceVariants.create'),
		delete: op('priceVariants.delete'),
		get: op('priceVariants.get'),
		list: op('priceVariants.list'),
		update: op('priceVariants.update'),
	},
	pricingPageSessions: {
		createForExistingSubscription: op(
			'pricingPageSessions.createForExistingSubscription',
		),
		createForNewSubscription: op(
			'pricingPageSessions.createForNewSubscription',
		),
	},
	products: {
		create: op('products.create'),
		createVariant: op('products.createVariant'),
		delete: op('products.delete'),
		get: op('products.get'),
		list: op('products.list'),
		listVariants: op('products.listVariants'),
		update: op('products.update'),
		updateOptions: op('products.updateOptions'),
	},
	promotionalCredits: {
		add: op('promotionalCredits.add'),
		deduct: op('promotionalCredits.deduct'),
		get: op('promotionalCredits.get'),
		list: op('promotionalCredits.list'),
		set: op('promotionalCredits.set'),
	},
	promotionalGrants: {
		create: op('promotionalGrants.create'),
	},
	purchases: {
		create: op('purchases.create'),
		estimate: op('purchases.estimate'),
	},
	quotes: {
		convert: op('quotes.convert'),
		createForChargeItemsAndCharges: op('quotes.createForChargeItemsAndCharges'),
		createForOnetimeCharges: op('quotes.createForOnetimeCharges'),
		delete: op('quotes.delete'),
		editCreateSubscriptionQuote: op('quotes.editCreateSubscriptionQuote'),
		editCreateSubscriptionQuoteForItems: op(
			'quotes.editCreateSubscriptionQuoteForItems',
		),
		editForChargeItemsAndCharges: op('quotes.editForChargeItemsAndCharges'),
		editOneTimeQuote: op('quotes.editOneTimeQuote'),
		editUpdateSubscriptionQuote: op('quotes.editUpdateSubscriptionQuote'),
		editUpdateSubscriptionQuoteForItems: op(
			'quotes.editUpdateSubscriptionQuoteForItems',
		),
		extendExpiryDate: op('quotes.extendExpiryDate'),
		get: op('quotes.get'),
		getPdf: op('quotes.getPdf'),
		list: op('quotes.list'),
		listEntitlements: op('quotes.listEntitlements'),
		listLineGroups: op('quotes.listLineGroups'),
		updateStatus: op('quotes.updateStatus'),
		updateSubscriptionQuote: op('quotes.updateSubscriptionQuote'),
		updateSubscriptionQuoteForItems: op(
			'quotes.updateSubscriptionQuoteForItems',
		),
	},
	ramps: {
		delete: op('ramps.delete'),
		get: op('ramps.get'),
		list: op('ramps.list'),
		update: op('ramps.update'),
	},
	recordedPurchases: {
		create: op('recordedPurchases.create'),
		get: op('recordedPurchases.get'),
	},
	resourceMigrations: {
		getLatest: op('resourceMigrations.getLatest'),
	},
	retrySegments: {
		get: op('retrySegments.get'),
	},
	rules: {
		get: op('rules.get'),
	},
	siteMigrationDetails: {
		list: op('siteMigrationDetails.list'),
	},
	sitePcMetaRecords: {
		list: op('sitePcMetaRecords.list'),
	},
	subscriptions: {
		addChargeAtTermEnd: op('subscriptions.addChargeAtTermEnd'),
		advanceInvoiceEstimate: op('subscriptions.advanceInvoiceEstimate'),
		cancel: op('subscriptions.cancel'),
		cancelForItems: op('subscriptions.cancelForItems'),
		cancelSubscriptionEstimate: op('subscriptions.cancelSubscriptionEstimate'),
		cancelSubscriptionForItemsEstimate: op(
			'subscriptions.cancelSubscriptionForItemsEstimate',
		),
		changeTermEnd: op('subscriptions.changeTermEnd'),
		changeTermEndEstimate: op('subscriptions.changeTermEndEstimate'),
		chargeAddonAtTermEnd: op('subscriptions.chargeAddonAtTermEnd'),
		chargeFutureRenewals: op('subscriptions.chargeFutureRenewals'),
		create: op('subscriptions.create'),
		createRamp: op('subscriptions.createRamp'),
		createUsage: op('subscriptions.createUsage'),
		delete: op('subscriptions.delete'),
		deleteUsage: op('subscriptions.deleteUsage'),
		editAdvanceInvoiceSchedule: op('subscriptions.editAdvanceInvoiceSchedule'),
		get: op('subscriptions.get'),
		getAdvanceInvoiceSchedule: op('subscriptions.getAdvanceInvoiceSchedule'),
		getScheduledChanges: op('subscriptions.getScheduledChanges'),
		getUsage: op('subscriptions.getUsage'),
		getUsageCharges: op('subscriptions.getUsageCharges'),
		getUsageSummary: op('subscriptions.getUsageSummary'),
		getWithScheduledChanges: op('subscriptions.getWithScheduledChanges'),
		importContractTerm: op('subscriptions.importContractTerm'),
		importSubscription: op('subscriptions.importSubscription'),
		importUnbilledCharges: op('subscriptions.importUnbilledCharges'),
		list: op('subscriptions.list'),
		listAlertStatuses: op('subscriptions.listAlertStatuses'),
		listApplicableAlerts: op('subscriptions.listApplicableAlerts'),
		listContractTerms: op('subscriptions.listContractTerms'),
		listDiscounts: op('subscriptions.listDiscounts'),
		listEntitlementOverrides: op('subscriptions.listEntitlementOverrides'),
		listEntitlements: op('subscriptions.listEntitlements'),
		move: op('subscriptions.move'),
		overrideBillingProfile: op('subscriptions.overrideBillingProfile'),
		pause: op('subscriptions.pause'),
		pauseSubscriptionEstimate: op('subscriptions.pauseSubscriptionEstimate'),
		reactivate: op('subscriptions.reactivate'),
		regenerateInvoice: op('subscriptions.regenerateInvoice'),
		regenerateInvoiceEstimate: op('subscriptions.regenerateInvoiceEstimate'),
		removeAdvanceInvoiceSchedule: op(
			'subscriptions.removeAdvanceInvoiceSchedule',
		),
		removeCoupons: op('subscriptions.removeCoupons'),
		removeScheduledCancellation: op(
			'subscriptions.removeScheduledCancellation',
		),
		removeScheduledChanges: op('subscriptions.removeScheduledChanges'),
		removeScheduledPause: op('subscriptions.removeScheduledPause'),
		removeScheduledResumption: op('subscriptions.removeScheduledResumption'),
		renewalEstimate: op('subscriptions.renewalEstimate'),
		resume: op('subscriptions.resume'),
		resumeSubscriptionEstimate: op('subscriptions.resumeSubscriptionEstimate'),
		setAvailability: op('subscriptions.setAvailability'),
		update: op('subscriptions.update'),
		updateForItems: op('subscriptions.updateForItems'),
		updateScheduledChanges: op('subscriptions.updateScheduledChanges'),
		upsertEntitlementOverrides: op('subscriptions.upsertEntitlementOverrides'),
	},
	timeMachines: {
		get: op('timeMachines.get'),
		startAfresh: op('timeMachines.startAfresh'),
		travelForward: op('timeMachines.travelForward'),
	},
	tokens: {
		createForCard: op('tokens.createForCard'),
		createUsingTempToken: op('tokens.createUsingTempToken'),
		get: op('tokens.get'),
	},
	transactions: {
		createAuthorization: op('transactions.createAuthorization'),
		deleteOfflineTransaction: op('transactions.deleteOfflineTransaction'),
		get: op('transactions.get'),
		list: op('transactions.list'),
		reconcile: op('transactions.reconcile'),
		recordRefund: op('transactions.recordRefund'),
		refund: op('transactions.refund'),
		void: op('transactions.void'),
	},
	unbilledCharges: {
		create: op('unbilledCharges.create'),
		createForItems: op('unbilledCharges.createForItems'),
		delete: op('unbilledCharges.delete'),
		invoiceNowEstimate: op('unbilledCharges.invoiceNowEstimate'),
		invoiceUnbilledCharges: op('unbilledCharges.invoiceUnbilledCharges'),
		list: op('unbilledCharges.list'),
	},
	usageEvents: {
		create: op('usageEvents.create'),
	},
	usageFiles: {
		getProcessingStatus: op('usageFiles.getProcessingStatus'),
		getUploadUrl: op('usageFiles.getUploadUrl'),
	},
	usages: {
		getPdf: op('usages.getPdf'),
		list: op('usages.list'),
	},
	variants: {
		delete: op('variants.delete'),
		get: op('variants.get'),
		update: op('variants.update'),
	},
	vaultedPaymentMethods: {
		get: op('vaultedPaymentMethods.get'),
	},
	virtualBankAccounts: {
		create: op('virtualBankAccounts.create'),
		createUsingPermanentToken: op(
			'virtualBankAccounts.createUsingPermanentToken',
		),
		delete: op('virtualBankAccounts.delete'),
		deleteLocal: op('virtualBankAccounts.deleteLocal'),
		get: op('virtualBankAccounts.get'),
		list: op('virtualBankAccounts.list'),
	},
	webhookEndpoints: {
		create: op('webhookEndpoints.create'),
		delete: op('webhookEndpoints.delete'),
		get: op('webhookEndpoints.get'),
		list: op('webhookEndpoints.list'),
		update: op('webhookEndpoints.update'),
	},
} as const;

export const chargebeeEndpointSchemas = {
	'addons.copy': chargebeeSchemaEntry('addons.copy'),
	'addons.create': chargebeeSchemaEntry('addons.create'),
	'addons.delete': chargebeeSchemaEntry('addons.delete'),
	'addons.get': chargebeeSchemaEntry('addons.get'),
	'addons.list': chargebeeSchemaEntry('addons.list'),
	'addons.unarchive': chargebeeSchemaEntry('addons.unarchive'),
	'addons.update': chargebeeSchemaEntry('addons.update'),
	'addresses.create': chargebeeSchemaEntry('addresses.create'),
	'addresses.list': chargebeeSchemaEntry('addresses.list'),
	'alerts.create': chargebeeSchemaEntry('alerts.create'),
	'alerts.delete': chargebeeSchemaEntry('alerts.delete'),
	'alerts.get': chargebeeSchemaEntry('alerts.get'),
	'alerts.list': chargebeeSchemaEntry('alerts.list'),
	'alerts.listStatuses': chargebeeSchemaEntry('alerts.listStatuses'),
	'alerts.update': chargebeeSchemaEntry('alerts.update'),
	'attachedItems.delete': chargebeeSchemaEntry('attachedItems.delete'),
	'attachedItems.get': chargebeeSchemaEntry('attachedItems.get'),
	'attachedItems.update': chargebeeSchemaEntry('attachedItems.update'),
	'batch.ingestUsages': chargebeeSchemaEntry('batch.ingestUsages'),
	'businessEntities.create': chargebeeSchemaEntry('businessEntities.create'),
	'businessEntities.get': chargebeeSchemaEntry('businessEntities.get'),
	'businessEntities.list': chargebeeSchemaEntry('businessEntities.list'),
	'businessEntities.listTransfers': chargebeeSchemaEntry(
		'businessEntities.listTransfers',
	),
	'businessEntities.transfer': chargebeeSchemaEntry(
		'businessEntities.transfer',
	),
	'businessEntities.update': chargebeeSchemaEntry('businessEntities.update'),
	'businessRules.activate': chargebeeSchemaEntry('businessRules.activate'),
	'businessRules.apply': chargebeeSchemaEntry('businessRules.apply'),
	'businessRules.create': chargebeeSchemaEntry('businessRules.create'),
	'businessRules.deactivate': chargebeeSchemaEntry('businessRules.deactivate'),
	'businessRules.delete': chargebeeSchemaEntry('businessRules.delete'),
	'businessRules.deleteDraft': chargebeeSchemaEntry(
		'businessRules.deleteDraft',
	),
	'businessRules.get': chargebeeSchemaEntry('businessRules.get'),
	'businessRules.getDraft': chargebeeSchemaEntry('businessRules.getDraft'),
	'businessRules.list': chargebeeSchemaEntry('businessRules.list'),
	'businessRules.release': chargebeeSchemaEntry('businessRules.release'),
	'businessRules.updateDraft': chargebeeSchemaEntry(
		'businessRules.updateDraft',
	),
	'businessRulesets.activate': chargebeeSchemaEntry(
		'businessRulesets.activate',
	),
	'businessRulesets.addRules': chargebeeSchemaEntry(
		'businessRulesets.addRules',
	),
	'businessRulesets.create': chargebeeSchemaEntry('businessRulesets.create'),
	'businessRulesets.deactivate': chargebeeSchemaEntry(
		'businessRulesets.deactivate',
	),
	'businessRulesets.delete': chargebeeSchemaEntry('businessRulesets.delete'),
	'businessRulesets.get': chargebeeSchemaEntry('businessRulesets.get'),
	'businessRulesets.list': chargebeeSchemaEntry('businessRulesets.list'),
	'businessRulesets.listRules': chargebeeSchemaEntry(
		'businessRulesets.listRules',
	),
	'businessRulesets.removeRules': chargebeeSchemaEntry(
		'businessRulesets.removeRules',
	),
	'businessRulesets.update': chargebeeSchemaEntry('businessRulesets.update'),
	'cards.get': chargebeeSchemaEntry('cards.get'),
	'collectionsPaymentPromises.cancel': chargebeeSchemaEntry(
		'collectionsPaymentPromises.cancel',
	),
	'collectionsPaymentPromises.create': chargebeeSchemaEntry(
		'collectionsPaymentPromises.create',
	),
	'collectionsPaymentPromises.get': chargebeeSchemaEntry(
		'collectionsPaymentPromises.get',
	),
	'collectionsPaymentPromises.list': chargebeeSchemaEntry(
		'collectionsPaymentPromises.list',
	),
	'collectionsPaymentPromises.update': chargebeeSchemaEntry(
		'collectionsPaymentPromises.update',
	),
	'comments.create': chargebeeSchemaEntry('comments.create'),
	'comments.delete': chargebeeSchemaEntry('comments.delete'),
	'comments.get': chargebeeSchemaEntry('comments.get'),
	'comments.list': chargebeeSchemaEntry('comments.list'),
	'configurations.list': chargebeeSchemaEntry('configurations.list'),
	'couponCodes.archive': chargebeeSchemaEntry('couponCodes.archive'),
	'couponCodes.get': chargebeeSchemaEntry('couponCodes.get'),
	'couponCodes.list': chargebeeSchemaEntry('couponCodes.list'),
	'couponSets.addCouponCodes': chargebeeSchemaEntry(
		'couponSets.addCouponCodes',
	),
	'couponSets.create': chargebeeSchemaEntry('couponSets.create'),
	'couponSets.delete': chargebeeSchemaEntry('couponSets.delete'),
	'couponSets.deleteUnusedCouponCodes': chargebeeSchemaEntry(
		'couponSets.deleteUnusedCouponCodes',
	),
	'couponSets.get': chargebeeSchemaEntry('couponSets.get'),
	'couponSets.list': chargebeeSchemaEntry('couponSets.list'),
	'couponSets.update': chargebeeSchemaEntry('couponSets.update'),
	'coupons.copy': chargebeeSchemaEntry('coupons.copy'),
	'coupons.create': chargebeeSchemaEntry('coupons.create'),
	'coupons.createForItems': chargebeeSchemaEntry('coupons.createForItems'),
	'coupons.delete': chargebeeSchemaEntry('coupons.delete'),
	'coupons.get': chargebeeSchemaEntry('coupons.get'),
	'coupons.list': chargebeeSchemaEntry('coupons.list'),
	'coupons.unarchive': chargebeeSchemaEntry('coupons.unarchive'),
	'coupons.update': chargebeeSchemaEntry('coupons.update'),
	'coupons.updateForItems': chargebeeSchemaEntry('coupons.updateForItems'),
	'creditNotes.create': chargebeeSchemaEntry('creditNotes.create'),
	'creditNotes.delete': chargebeeSchemaEntry('creditNotes.delete'),
	'creditNotes.downloadEinvoice': chargebeeSchemaEntry(
		'creditNotes.downloadEinvoice',
	),
	'creditNotes.get': chargebeeSchemaEntry('creditNotes.get'),
	'creditNotes.getPdf': chargebeeSchemaEntry('creditNotes.getPdf'),
	'creditNotes.import': chargebeeSchemaEntry('creditNotes.import'),
	'creditNotes.list': chargebeeSchemaEntry('creditNotes.list'),
	'creditNotes.recordRefund': chargebeeSchemaEntry('creditNotes.recordRefund'),
	'creditNotes.refund': chargebeeSchemaEntry('creditNotes.refund'),
	'creditNotes.removeTaxWithheldRefund': chargebeeSchemaEntry(
		'creditNotes.removeTaxWithheldRefund',
	),
	'creditNotes.resendEinvoice': chargebeeSchemaEntry(
		'creditNotes.resendEinvoice',
	),
	'creditNotes.sendEinvoice': chargebeeSchemaEntry('creditNotes.sendEinvoice'),
	'creditNotes.sendEmail': chargebeeSchemaEntry('creditNotes.sendEmail'),
	'creditNotes.update': chargebeeSchemaEntry('creditNotes.update'),
	'creditNotes.void': chargebeeSchemaEntry('creditNotes.void'),
	'creditUnits.archive': chargebeeSchemaEntry('creditUnits.archive'),
	'creditUnits.create': chargebeeSchemaEntry('creditUnits.create'),
	'creditUnits.list': chargebeeSchemaEntry('creditUnits.list'),
	'creditUnits.reactivate': chargebeeSchemaEntry('creditUnits.reactivate'),
	'creditUnits.update': chargebeeSchemaEntry('creditUnits.update'),
	'csvTaxRules.create': chargebeeSchemaEntry('csvTaxRules.create'),
	'currencies.addSchedule': chargebeeSchemaEntry('currencies.addSchedule'),
	'currencies.create': chargebeeSchemaEntry('currencies.create'),
	'currencies.get': chargebeeSchemaEntry('currencies.get'),
	'currencies.getList': chargebeeSchemaEntry('currencies.getList'),
	'currencies.removeSchedule': chargebeeSchemaEntry(
		'currencies.removeSchedule',
	),
	'currencies.update': chargebeeSchemaEntry('currencies.update'),
	'customFieldConfigs.getMetadata': chargebeeSchemaEntry(
		'customFieldConfigs.getMetadata',
	),
	'customFieldConfigs.list': chargebeeSchemaEntry('customFieldConfigs.list'),
	'customers.addContact': chargebeeSchemaEntry('customers.addContact'),
	'customers.assignPaymentRole': chargebeeSchemaEntry(
		'customers.assignPaymentRole',
	),
	'customers.changeBillingDate': chargebeeSchemaEntry(
		'customers.changeBillingDate',
	),
	'customers.clearPersonalData': chargebeeSchemaEntry(
		'customers.clearPersonalData',
	),
	'customers.collectPayment': chargebeeSchemaEntry('customers.collectPayment'),
	'customers.copyCard': chargebeeSchemaEntry('customers.copyCard'),
	'customers.create': chargebeeSchemaEntry('customers.create'),
	'customers.createSubscription': chargebeeSchemaEntry(
		'customers.createSubscription',
	),
	'customers.createSubscriptionEstimate': chargebeeSchemaEntry(
		'customers.createSubscriptionEstimate',
	),
	'customers.createSubscriptionForItems': chargebeeSchemaEntry(
		'customers.createSubscriptionForItems',
	),
	'customers.createSubscriptionForItemsEstimate': chargebeeSchemaEntry(
		'customers.createSubscriptionForItemsEstimate',
	),
	'customers.createSubscriptionQuote': chargebeeSchemaEntry(
		'customers.createSubscriptionQuote',
	),
	'customers.createSubscriptionQuoteForItems': chargebeeSchemaEntry(
		'customers.createSubscriptionQuoteForItems',
	),
	'customers.delete': chargebeeSchemaEntry('customers.delete'),
	'customers.deleteCard': chargebeeSchemaEntry('customers.deleteCard'),
	'customers.deleteContact': chargebeeSchemaEntry('customers.deleteContact'),
	'customers.delink': chargebeeSchemaEntry('customers.delink'),
	'customers.get': chargebeeSchemaEntry('customers.get'),
	'customers.getHierarchy': chargebeeSchemaEntry('customers.getHierarchy'),
	'customers.getUpcomingInvoicesEstimate': chargebeeSchemaEntry(
		'customers.getUpcomingInvoicesEstimate',
	),
	'customers.importSubscription': chargebeeSchemaEntry(
		'customers.importSubscription',
	),
	'customers.importSubscriptionForItems': chargebeeSchemaEntry(
		'customers.importSubscriptionForItems',
	),
	'customers.link': chargebeeSchemaEntry('customers.link'),
	'customers.list': chargebeeSchemaEntry('customers.list'),
	'customers.listContacts': chargebeeSchemaEntry('customers.listContacts'),
	'customers.listEmailLogs': chargebeeSchemaEntry('customers.listEmailLogs'),
	'customers.listEntitlements': chargebeeSchemaEntry(
		'customers.listEntitlements',
	),
	'customers.listHierarchyDetails': chargebeeSchemaEntry(
		'customers.listHierarchyDetails',
	),
	'customers.listPaymentVouchers': chargebeeSchemaEntry(
		'customers.listPaymentVouchers',
	),
	'customers.merge': chargebeeSchemaEntry('customers.merge'),
	'customers.move': chargebeeSchemaEntry('customers.move'),
	'customers.recordExcessPayment': chargebeeSchemaEntry(
		'customers.recordExcessPayment',
	),
	'customers.sendPaymentRequest': chargebeeSchemaEntry(
		'customers.sendPaymentRequest',
	),
	'customers.switchGateway': chargebeeSchemaEntry('customers.switchGateway'),
	'customers.update': chargebeeSchemaEntry('customers.update'),
	'customers.updateBillingInfo': chargebeeSchemaEntry(
		'customers.updateBillingInfo',
	),
	'customers.updateCard': chargebeeSchemaEntry('customers.updateCard'),
	'customers.updateContact': chargebeeSchemaEntry('customers.updateContact'),
	'customers.updateHierarchySettings': chargebeeSchemaEntry(
		'customers.updateHierarchySettings',
	),
	'customers.updatePaymentMethod': chargebeeSchemaEntry(
		'customers.updatePaymentMethod',
	),
	'differentialPrices.delete': chargebeeSchemaEntry(
		'differentialPrices.delete',
	),
	'differentialPrices.get': chargebeeSchemaEntry('differentialPrices.get'),
	'differentialPrices.list': chargebeeSchemaEntry('differentialPrices.list'),
	'differentialPrices.update': chargebeeSchemaEntry(
		'differentialPrices.update',
	),
	'disputes.get': chargebeeSchemaEntry('disputes.get'),
	'disputes.list': chargebeeSchemaEntry('disputes.list'),
	'einvoices.get': chargebeeSchemaEntry('einvoices.get'),
	'einvoices.list': chargebeeSchemaEntry('einvoices.list'),
	'entitlements.create': chargebeeSchemaEntry('entitlements.create'),
	'entitlements.list': chargebeeSchemaEntry('entitlements.list'),
	'estimates.createInvoice': chargebeeSchemaEntry('estimates.createInvoice'),
	'estimates.createInvoiceForItems': chargebeeSchemaEntry(
		'estimates.createInvoiceForItems',
	),
	'estimates.createSubscription': chargebeeSchemaEntry(
		'estimates.createSubscription',
	),
	'estimates.createSubscriptionForItems': chargebeeSchemaEntry(
		'estimates.createSubscriptionForItems',
	),
	'estimates.giftSubscription': chargebeeSchemaEntry(
		'estimates.giftSubscription',
	),
	'estimates.giftSubscriptionForItems': chargebeeSchemaEntry(
		'estimates.giftSubscriptionForItems',
	),
	'estimates.paymentSchedules': chargebeeSchemaEntry(
		'estimates.paymentSchedules',
	),
	'estimates.updateSubscription': chargebeeSchemaEntry(
		'estimates.updateSubscription',
	),
	'estimates.updateSubscriptionForItems': chargebeeSchemaEntry(
		'estimates.updateSubscriptionForItems',
	),
	'events.get': chargebeeSchemaEntry('events.get'),
	'events.list': chargebeeSchemaEntry('events.list'),
	'exports.addons': chargebeeSchemaEntry('exports.addons'),
	'exports.attachedItems': chargebeeSchemaEntry('exports.attachedItems'),
	'exports.coupons': chargebeeSchemaEntry('exports.coupons'),
	'exports.creditNotes': chargebeeSchemaEntry('exports.creditNotes'),
	'exports.customers': chargebeeSchemaEntry('exports.customers'),
	'exports.deferredRevenue': chargebeeSchemaEntry('exports.deferredRevenue'),
	'exports.differentialPrices': chargebeeSchemaEntry(
		'exports.differentialPrices',
	),
	'exports.get': chargebeeSchemaEntry('exports.get'),
	'exports.invoices': chargebeeSchemaEntry('exports.invoices'),
	'exports.itemFamilies': chargebeeSchemaEntry('exports.itemFamilies'),
	'exports.itemPrices': chargebeeSchemaEntry('exports.itemPrices'),
	'exports.items': chargebeeSchemaEntry('exports.items'),
	'exports.orders': chargebeeSchemaEntry('exports.orders'),
	'exports.plans': chargebeeSchemaEntry('exports.plans'),
	'exports.priceVariants': chargebeeSchemaEntry('exports.priceVariants'),
	'exports.ramps': chargebeeSchemaEntry('exports.ramps'),
	'exports.revenueRecognition': chargebeeSchemaEntry(
		'exports.revenueRecognition',
	),
	'exports.subscriptions': chargebeeSchemaEntry('exports.subscriptions'),
	'exports.transactions': chargebeeSchemaEntry('exports.transactions'),
	'features.activate': chargebeeSchemaEntry('features.activate'),
	'features.archive': chargebeeSchemaEntry('features.archive'),
	'features.create': chargebeeSchemaEntry('features.create'),
	'features.delete': chargebeeSchemaEntry('features.delete'),
	'features.get': chargebeeSchemaEntry('features.get'),
	'features.list': chargebeeSchemaEntry('features.list'),
	'features.listItemEntitlements': chargebeeSchemaEntry(
		'features.listItemEntitlements',
	),
	'features.reactivate': chargebeeSchemaEntry('features.reactivate'),
	'features.update': chargebeeSchemaEntry('features.update'),
	'features.upsertItemEntitlements': chargebeeSchemaEntry(
		'features.upsertItemEntitlements',
	),
	'fullExports.getStatus': chargebeeSchemaEntry('fullExports.getStatus'),
	'gatewayRequestLogs.get': chargebeeSchemaEntry('gatewayRequestLogs.get'),
	'gatewayRequestLogs.list': chargebeeSchemaEntry('gatewayRequestLogs.list'),
	'gatewayWebhookLogs.get': chargebeeSchemaEntry('gatewayWebhookLogs.get'),
	'gatewayWebhookLogs.list': chargebeeSchemaEntry('gatewayWebhookLogs.list'),
	'gifts.cancel': chargebeeSchemaEntry('gifts.cancel'),
	'gifts.claim': chargebeeSchemaEntry('gifts.claim'),
	'gifts.create': chargebeeSchemaEntry('gifts.create'),
	'gifts.createForItems': chargebeeSchemaEntry('gifts.createForItems'),
	'gifts.get': chargebeeSchemaEntry('gifts.get'),
	'gifts.list': chargebeeSchemaEntry('gifts.list'),
	'gifts.update': chargebeeSchemaEntry('gifts.update'),
	'grantBlocks.list': chargebeeSchemaEntry('grantBlocks.list'),
	'hostedPages.acceptQuote': chargebeeSchemaEntry('hostedPages.acceptQuote'),
	'hostedPages.acknowledge': chargebeeSchemaEntry('hostedPages.acknowledge'),
	'hostedPages.checkoutExisting': chargebeeSchemaEntry(
		'hostedPages.checkoutExisting',
	),
	'hostedPages.checkoutExistingForItems': chargebeeSchemaEntry(
		'hostedPages.checkoutExistingForItems',
	),
	'hostedPages.checkoutGift': chargebeeSchemaEntry('hostedPages.checkoutGift'),
	'hostedPages.checkoutGiftForItems': chargebeeSchemaEntry(
		'hostedPages.checkoutGiftForItems',
	),
	'hostedPages.checkoutNew': chargebeeSchemaEntry('hostedPages.checkoutNew'),
	'hostedPages.checkoutNewForItems': chargebeeSchemaEntry(
		'hostedPages.checkoutNewForItems',
	),
	'hostedPages.checkoutOneTime': chargebeeSchemaEntry(
		'hostedPages.checkoutOneTime',
	),
	'hostedPages.checkoutOneTimeForItems': chargebeeSchemaEntry(
		'hostedPages.checkoutOneTimeForItems',
	),
	'hostedPages.claimGift': chargebeeSchemaEntry('hostedPages.claimGift'),
	'hostedPages.collectNow': chargebeeSchemaEntry('hostedPages.collectNow'),
	'hostedPages.extendSubscription': chargebeeSchemaEntry(
		'hostedPages.extendSubscription',
	),
	'hostedPages.get': chargebeeSchemaEntry('hostedPages.get'),
	'hostedPages.list': chargebeeSchemaEntry('hostedPages.list'),
	'hostedPages.managePaymentSources': chargebeeSchemaEntry(
		'hostedPages.managePaymentSources',
	),
	'hostedPages.notifyEvent': chargebeeSchemaEntry('hostedPages.notifyEvent'),
	'hostedPages.preCancel': chargebeeSchemaEntry('hostedPages.preCancel'),
	'hostedPages.retrieveAgreementPdf': chargebeeSchemaEntry(
		'hostedPages.retrieveAgreementPdf',
	),
	'hostedPages.viewVoucher': chargebeeSchemaEntry('hostedPages.viewVoucher'),
	'inAppSubscriptions.importReceipt': chargebeeSchemaEntry(
		'inAppSubscriptions.importReceipt',
	),
	'inAppSubscriptions.importSubscription': chargebeeSchemaEntry(
		'inAppSubscriptions.importSubscription',
	),
	'inAppSubscriptions.processPurchase': chargebeeSchemaEntry(
		'inAppSubscriptions.processPurchase',
	),
	'inAppSubscriptions.retrieveStoreSubscription': chargebeeSchemaEntry(
		'inAppSubscriptions.retrieveStoreSubscription',
	),
	'invoices.addAddonCharge': chargebeeSchemaEntry('invoices.addAddonCharge'),
	'invoices.addCharge': chargebeeSchemaEntry('invoices.addCharge'),
	'invoices.addChargeItem': chargebeeSchemaEntry('invoices.addChargeItem'),
	'invoices.applyCredits': chargebeeSchemaEntry('invoices.applyCredits'),
	'invoices.applyPaymentScheduleScheme': chargebeeSchemaEntry(
		'invoices.applyPaymentScheduleScheme',
	),
	'invoices.applyPayments': chargebeeSchemaEntry('invoices.applyPayments'),
	'invoices.charge': chargebeeSchemaEntry('invoices.charge'),
	'invoices.chargeAddon': chargebeeSchemaEntry('invoices.chargeAddon'),
	'invoices.close': chargebeeSchemaEntry('invoices.close'),
	'invoices.collectPayment': chargebeeSchemaEntry('invoices.collectPayment'),
	'invoices.create': chargebeeSchemaEntry('invoices.create'),
	'invoices.createForChargeItemsAndCharges': chargebeeSchemaEntry(
		'invoices.createForChargeItemsAndCharges',
	),
	'invoices.delete': chargebeeSchemaEntry('invoices.delete'),
	'invoices.deleteLineItems': chargebeeSchemaEntry('invoices.deleteLineItems'),
	'invoices.downloadEinvoice': chargebeeSchemaEntry(
		'invoices.downloadEinvoice',
	),
	'invoices.get': chargebeeSchemaEntry('invoices.get'),
	'invoices.getPaymentSchedules': chargebeeSchemaEntry(
		'invoices.getPaymentSchedules',
	),
	'invoices.getPdf': chargebeeSchemaEntry('invoices.getPdf'),
	'invoices.import': chargebeeSchemaEntry('invoices.import'),
	'invoices.list': chargebeeSchemaEntry('invoices.list'),
	'invoices.listPaymentReferenceNumbers': chargebeeSchemaEntry(
		'invoices.listPaymentReferenceNumbers',
	),
	'invoices.listPaymentVouchers': chargebeeSchemaEntry(
		'invoices.listPaymentVouchers',
	),
	'invoices.listPayments': chargebeeSchemaEntry('invoices.listPayments'),
	'invoices.pauseDunning': chargebeeSchemaEntry('invoices.pauseDunning'),
	'invoices.recordPayment': chargebeeSchemaEntry('invoices.recordPayment'),
	'invoices.recordRefund': chargebeeSchemaEntry('invoices.recordRefund'),
	'invoices.recordTaxWithheld': chargebeeSchemaEntry(
		'invoices.recordTaxWithheld',
	),
	'invoices.refund': chargebeeSchemaEntry('invoices.refund'),
	'invoices.removeCreditNote': chargebeeSchemaEntry(
		'invoices.removeCreditNote',
	),
	'invoices.removePayment': chargebeeSchemaEntry('invoices.removePayment'),
	'invoices.removePaymentScheduleScheme': chargebeeSchemaEntry(
		'invoices.removePaymentScheduleScheme',
	),
	'invoices.removeTaxWithheld': chargebeeSchemaEntry(
		'invoices.removeTaxWithheld',
	),
	'invoices.resendEinvoice': chargebeeSchemaEntry('invoices.resendEinvoice'),
	'invoices.resumeDunning': chargebeeSchemaEntry('invoices.resumeDunning'),
	'invoices.sendEinvoice': chargebeeSchemaEntry('invoices.sendEinvoice'),
	'invoices.sendEmail': chargebeeSchemaEntry('invoices.sendEmail'),
	'invoices.stopDunning': chargebeeSchemaEntry('invoices.stopDunning'),
	'invoices.syncUsages': chargebeeSchemaEntry('invoices.syncUsages'),
	'invoices.updateDetails': chargebeeSchemaEntry('invoices.updateDetails'),
	'invoices.void': chargebeeSchemaEntry('invoices.void'),
	'invoices.voidBeforeCapture': chargebeeSchemaEntry(
		'invoices.voidBeforeCapture',
	),
	'invoices.writeOff': chargebeeSchemaEntry('invoices.writeOff'),
	'itemFamilies.create': chargebeeSchemaEntry('itemFamilies.create'),
	'itemFamilies.delete': chargebeeSchemaEntry('itemFamilies.delete'),
	'itemFamilies.get': chargebeeSchemaEntry('itemFamilies.get'),
	'itemFamilies.list': chargebeeSchemaEntry('itemFamilies.list'),
	'itemFamilies.update': chargebeeSchemaEntry('itemFamilies.update'),
	'itemPrices.create': chargebeeSchemaEntry('itemPrices.create'),
	'itemPrices.createDifferentialPrice': chargebeeSchemaEntry(
		'itemPrices.createDifferentialPrice',
	),
	'itemPrices.delete': chargebeeSchemaEntry('itemPrices.delete'),
	'itemPrices.get': chargebeeSchemaEntry('itemPrices.get'),
	'itemPrices.list': chargebeeSchemaEntry('itemPrices.list'),
	'itemPrices.listApplicableItemPrices': chargebeeSchemaEntry(
		'itemPrices.listApplicableItemPrices',
	),
	'itemPrices.listApplicableItems': chargebeeSchemaEntry(
		'itemPrices.listApplicableItems',
	),
	'itemPrices.update': chargebeeSchemaEntry('itemPrices.update'),
	'items.create': chargebeeSchemaEntry('items.create'),
	'items.createAttachedItem': chargebeeSchemaEntry('items.createAttachedItem'),
	'items.delete': chargebeeSchemaEntry('items.delete'),
	'items.get': chargebeeSchemaEntry('items.get'),
	'items.list': chargebeeSchemaEntry('items.list'),
	'items.listAttachedItems': chargebeeSchemaEntry('items.listAttachedItems'),
	'items.listItemEntitlements': chargebeeSchemaEntry(
		'items.listItemEntitlements',
	),
	'items.update': chargebeeSchemaEntry('items.update'),
	'items.upsertItemEntitlements': chargebeeSchemaEntry(
		'items.upsertItemEntitlements',
	),
	'ledgerAccountBalances.list': chargebeeSchemaEntry(
		'ledgerAccountBalances.list',
	),
	'ledgerAccountBalances.updateOverdraftLimit': chargebeeSchemaEntry(
		'ledgerAccountBalances.updateOverdraftLimit',
	),
	'ledgerOperations.allocate': chargebeeSchemaEntry(
		'ledgerOperations.allocate',
	),
	'ledgerOperations.authorize': chargebeeSchemaEntry(
		'ledgerOperations.authorize',
	),
	'ledgerOperations.capture': chargebeeSchemaEntry('ledgerOperations.capture'),
	'ledgerOperations.captureAuthorization': chargebeeSchemaEntry(
		'ledgerOperations.captureAuthorization',
	),
	'ledgerOperations.get': chargebeeSchemaEntry('ledgerOperations.get'),
	'ledgerOperations.list': chargebeeSchemaEntry('ledgerOperations.list'),
	'ledgerOperations.releaseAuthorization': chargebeeSchemaEntry(
		'ledgerOperations.releaseAuthorization',
	),
	'meteredFeatures.archive': chargebeeSchemaEntry('meteredFeatures.archive'),
	'meteredFeatures.create': chargebeeSchemaEntry('meteredFeatures.create'),
	'meteredFeatures.delete': chargebeeSchemaEntry('meteredFeatures.delete'),
	'meteredFeatures.reactivate': chargebeeSchemaEntry(
		'meteredFeatures.reactivate',
	),
	'meters.list': chargebeeSchemaEntry('meters.list'),
	'nonSubscriptions.oneTimePurchase': chargebeeSchemaEntry(
		'nonSubscriptions.oneTimePurchase',
	),
	'offerEvents.create': chargebeeSchemaEntry('offerEvents.create'),
	'offerFulfillments.create': chargebeeSchemaEntry('offerFulfillments.create'),
	'offerFulfillments.get': chargebeeSchemaEntry('offerFulfillments.get'),
	'offerFulfillments.update': chargebeeSchemaEntry('offerFulfillments.update'),
	'omnichannelOneTimeOrders.get': chargebeeSchemaEntry(
		'omnichannelOneTimeOrders.get',
	),
	'omnichannelOneTimeOrders.list': chargebeeSchemaEntry(
		'omnichannelOneTimeOrders.list',
	),
	'omnichannelSubscriptionItems.listScheduledChanges': chargebeeSchemaEntry(
		'omnichannelSubscriptionItems.listScheduledChanges',
	),
	'omnichannelSubscriptions.get': chargebeeSchemaEntry(
		'omnichannelSubscriptions.get',
	),
	'omnichannelSubscriptions.list': chargebeeSchemaEntry(
		'omnichannelSubscriptions.list',
	),
	'omnichannelSubscriptions.listTransactions': chargebeeSchemaEntry(
		'omnichannelSubscriptions.listTransactions',
	),
	'omnichannelSubscriptions.move': chargebeeSchemaEntry(
		'omnichannelSubscriptions.move',
	),
	'orders.assignOrderNumber': chargebeeSchemaEntry('orders.assignOrderNumber'),
	'orders.cancel': chargebeeSchemaEntry('orders.cancel'),
	'orders.create': chargebeeSchemaEntry('orders.create'),
	'orders.createRefundableCreditNote': chargebeeSchemaEntry(
		'orders.createRefundableCreditNote',
	),
	'orders.delete': chargebeeSchemaEntry('orders.delete'),
	'orders.get': chargebeeSchemaEntry('orders.get'),
	'orders.import': chargebeeSchemaEntry('orders.import'),
	'orders.list': chargebeeSchemaEntry('orders.list'),
	'orders.reopen': chargebeeSchemaEntry('orders.reopen'),
	'orders.resend': chargebeeSchemaEntry('orders.resend'),
	'orders.update': chargebeeSchemaEntry('orders.update'),
	'organizationDetails.create': chargebeeSchemaEntry(
		'organizationDetails.create',
	),
	'organizationDetails.get': chargebeeSchemaEntry('organizationDetails.get'),
	'organizationDetails.list': chargebeeSchemaEntry('organizationDetails.list'),
	'paymentIntents.create': chargebeeSchemaEntry('paymentIntents.create'),
	'paymentIntents.get': chargebeeSchemaEntry('paymentIntents.get'),
	'paymentIntents.update': chargebeeSchemaEntry('paymentIntents.update'),
	'paymentScheduleSchemes.create': chargebeeSchemaEntry(
		'paymentScheduleSchemes.create',
	),
	'paymentScheduleSchemes.delete': chargebeeSchemaEntry(
		'paymentScheduleSchemes.delete',
	),
	'paymentScheduleSchemes.get': chargebeeSchemaEntry(
		'paymentScheduleSchemes.get',
	),
	'paymentScheduleSchemes.list': chargebeeSchemaEntry(
		'paymentScheduleSchemes.list',
	),
	'paymentSchedules.list': chargebeeSchemaEntry('paymentSchedules.list'),
	'paymentSources.createBankAccount': chargebeeSchemaEntry(
		'paymentSources.createBankAccount',
	),
	'paymentSources.createCard': chargebeeSchemaEntry(
		'paymentSources.createCard',
	),
	'paymentSources.createUsingPaymentIntent': chargebeeSchemaEntry(
		'paymentSources.createUsingPaymentIntent',
	),
	'paymentSources.createUsingPermanentToken': chargebeeSchemaEntry(
		'paymentSources.createUsingPermanentToken',
	),
	'paymentSources.createUsingTempToken': chargebeeSchemaEntry(
		'paymentSources.createUsingTempToken',
	),
	'paymentSources.createUsingToken': chargebeeSchemaEntry(
		'paymentSources.createUsingToken',
	),
	'paymentSources.createVoucherPaymentSource': chargebeeSchemaEntry(
		'paymentSources.createVoucherPaymentSource',
	),
	'paymentSources.delete': chargebeeSchemaEntry('paymentSources.delete'),
	'paymentSources.deleteLocal': chargebeeSchemaEntry(
		'paymentSources.deleteLocal',
	),
	'paymentSources.export': chargebeeSchemaEntry('paymentSources.export'),
	'paymentSources.get': chargebeeSchemaEntry('paymentSources.get'),
	'paymentSources.list': chargebeeSchemaEntry('paymentSources.list'),
	'paymentSources.listGatewayPaymentMethodTokens': chargebeeSchemaEntry(
		'paymentSources.listGatewayPaymentMethodTokens',
	),
	'paymentSources.switchGatewayAccount': chargebeeSchemaEntry(
		'paymentSources.switchGatewayAccount',
	),
	'paymentSources.updateBankAccount': chargebeeSchemaEntry(
		'paymentSources.updateBankAccount',
	),
	'paymentSources.updateCard': chargebeeSchemaEntry(
		'paymentSources.updateCard',
	),
	'paymentSources.verifyBankAccount': chargebeeSchemaEntry(
		'paymentSources.verifyBankAccount',
	),
	'paymentVouchers.create': chargebeeSchemaEntry('paymentVouchers.create'),
	'paymentVouchers.get': chargebeeSchemaEntry('paymentVouchers.get'),
	'pc2MigrationItemFamilies.create': chargebeeSchemaEntry(
		'pc2MigrationItemFamilies.create',
	),
	'pc2MigrationItemFamilies.delete': chargebeeSchemaEntry(
		'pc2MigrationItemFamilies.delete',
	),
	'pc2MigrationItemFamilies.get': chargebeeSchemaEntry(
		'pc2MigrationItemFamilies.get',
	),
	'pc2MigrationItemFamilies.list': chargebeeSchemaEntry(
		'pc2MigrationItemFamilies.list',
	),
	'pc2MigrationItemFamilies.update': chargebeeSchemaEntry(
		'pc2MigrationItemFamilies.update',
	),
	'pc2MigrationItemPrices.delete': chargebeeSchemaEntry(
		'pc2MigrationItemPrices.delete',
	),
	'pc2MigrationItemPrices.get': chargebeeSchemaEntry(
		'pc2MigrationItemPrices.get',
	),
	'pc2MigrationItemPrices.list': chargebeeSchemaEntry(
		'pc2MigrationItemPrices.list',
	),
	'pc2MigrationItemPrices.update': chargebeeSchemaEntry(
		'pc2MigrationItemPrices.update',
	),
	'pc2MigrationItems.create': chargebeeSchemaEntry('pc2MigrationItems.create'),
	'pc2MigrationItems.delete': chargebeeSchemaEntry('pc2MigrationItems.delete'),
	'pc2MigrationItems.get': chargebeeSchemaEntry('pc2MigrationItems.get'),
	'pc2MigrationItems.list': chargebeeSchemaEntry('pc2MigrationItems.list'),
	'pc2MigrationItems.listApplicableItems': chargebeeSchemaEntry(
		'pc2MigrationItems.listApplicableItems',
	),
	'pc2MigrationItems.update': chargebeeSchemaEntry('pc2MigrationItems.update'),
	'pc2Migrations.contactSupport': chargebeeSchemaEntry(
		'pc2Migrations.contactSupport',
	),
	'pc2Migrations.create': chargebeeSchemaEntry('pc2Migrations.create'),
	'pc2Migrations.get': chargebeeSchemaEntry('pc2Migrations.get'),
	'pc2Migrations.initiate': chargebeeSchemaEntry('pc2Migrations.initiate'),
	'personalizedOffers.create': chargebeeSchemaEntry(
		'personalizedOffers.create',
	),
	'plans.copy': chargebeeSchemaEntry('plans.copy'),
	'plans.create': chargebeeSchemaEntry('plans.create'),
	'plans.delete': chargebeeSchemaEntry('plans.delete'),
	'plans.get': chargebeeSchemaEntry('plans.get'),
	'plans.list': chargebeeSchemaEntry('plans.list'),
	'plans.unarchive': chargebeeSchemaEntry('plans.unarchive'),
	'plans.update': chargebeeSchemaEntry('plans.update'),
	'portalSessions.activate': chargebeeSchemaEntry('portalSessions.activate'),
	'portalSessions.create': chargebeeSchemaEntry('portalSessions.create'),
	'portalSessions.get': chargebeeSchemaEntry('portalSessions.get'),
	'portalSessions.logout': chargebeeSchemaEntry('portalSessions.logout'),
	'priceRamps.create': chargebeeSchemaEntry('priceRamps.create'),
	'priceRamps.delete': chargebeeSchemaEntry('priceRamps.delete'),
	'priceRamps.get': chargebeeSchemaEntry('priceRamps.get'),
	'priceRamps.list': chargebeeSchemaEntry('priceRamps.list'),
	'priceRamps.update': chargebeeSchemaEntry('priceRamps.update'),
	'priceVariants.create': chargebeeSchemaEntry('priceVariants.create'),
	'priceVariants.delete': chargebeeSchemaEntry('priceVariants.delete'),
	'priceVariants.get': chargebeeSchemaEntry('priceVariants.get'),
	'priceVariants.list': chargebeeSchemaEntry('priceVariants.list'),
	'priceVariants.update': chargebeeSchemaEntry('priceVariants.update'),
	'pricingPageSessions.createForExistingSubscription': chargebeeSchemaEntry(
		'pricingPageSessions.createForExistingSubscription',
	),
	'pricingPageSessions.createForNewSubscription': chargebeeSchemaEntry(
		'pricingPageSessions.createForNewSubscription',
	),
	'products.create': chargebeeSchemaEntry('products.create'),
	'products.createVariant': chargebeeSchemaEntry('products.createVariant'),
	'products.delete': chargebeeSchemaEntry('products.delete'),
	'products.get': chargebeeSchemaEntry('products.get'),
	'products.list': chargebeeSchemaEntry('products.list'),
	'products.listVariants': chargebeeSchemaEntry('products.listVariants'),
	'products.update': chargebeeSchemaEntry('products.update'),
	'products.updateOptions': chargebeeSchemaEntry('products.updateOptions'),
	'promotionalCredits.add': chargebeeSchemaEntry('promotionalCredits.add'),
	'promotionalCredits.deduct': chargebeeSchemaEntry(
		'promotionalCredits.deduct',
	),
	'promotionalCredits.get': chargebeeSchemaEntry('promotionalCredits.get'),
	'promotionalCredits.list': chargebeeSchemaEntry('promotionalCredits.list'),
	'promotionalCredits.set': chargebeeSchemaEntry('promotionalCredits.set'),
	'promotionalGrants.create': chargebeeSchemaEntry('promotionalGrants.create'),
	'purchases.create': chargebeeSchemaEntry('purchases.create'),
	'purchases.estimate': chargebeeSchemaEntry('purchases.estimate'),
	'quotes.convert': chargebeeSchemaEntry('quotes.convert'),
	'quotes.createForChargeItemsAndCharges': chargebeeSchemaEntry(
		'quotes.createForChargeItemsAndCharges',
	),
	'quotes.createForOnetimeCharges': chargebeeSchemaEntry(
		'quotes.createForOnetimeCharges',
	),
	'quotes.delete': chargebeeSchemaEntry('quotes.delete'),
	'quotes.editCreateSubscriptionQuote': chargebeeSchemaEntry(
		'quotes.editCreateSubscriptionQuote',
	),
	'quotes.editCreateSubscriptionQuoteForItems': chargebeeSchemaEntry(
		'quotes.editCreateSubscriptionQuoteForItems',
	),
	'quotes.editForChargeItemsAndCharges': chargebeeSchemaEntry(
		'quotes.editForChargeItemsAndCharges',
	),
	'quotes.editOneTimeQuote': chargebeeSchemaEntry('quotes.editOneTimeQuote'),
	'quotes.editUpdateSubscriptionQuote': chargebeeSchemaEntry(
		'quotes.editUpdateSubscriptionQuote',
	),
	'quotes.editUpdateSubscriptionQuoteForItems': chargebeeSchemaEntry(
		'quotes.editUpdateSubscriptionQuoteForItems',
	),
	'quotes.extendExpiryDate': chargebeeSchemaEntry('quotes.extendExpiryDate'),
	'quotes.get': chargebeeSchemaEntry('quotes.get'),
	'quotes.getPdf': chargebeeSchemaEntry('quotes.getPdf'),
	'quotes.list': chargebeeSchemaEntry('quotes.list'),
	'quotes.listEntitlements': chargebeeSchemaEntry('quotes.listEntitlements'),
	'quotes.listLineGroups': chargebeeSchemaEntry('quotes.listLineGroups'),
	'quotes.updateStatus': chargebeeSchemaEntry('quotes.updateStatus'),
	'quotes.updateSubscriptionQuote': chargebeeSchemaEntry(
		'quotes.updateSubscriptionQuote',
	),
	'quotes.updateSubscriptionQuoteForItems': chargebeeSchemaEntry(
		'quotes.updateSubscriptionQuoteForItems',
	),
	'ramps.delete': chargebeeSchemaEntry('ramps.delete'),
	'ramps.get': chargebeeSchemaEntry('ramps.get'),
	'ramps.list': chargebeeSchemaEntry('ramps.list'),
	'ramps.update': chargebeeSchemaEntry('ramps.update'),
	'recordedPurchases.create': chargebeeSchemaEntry('recordedPurchases.create'),
	'recordedPurchases.get': chargebeeSchemaEntry('recordedPurchases.get'),
	'resourceMigrations.getLatest': chargebeeSchemaEntry(
		'resourceMigrations.getLatest',
	),
	'retrySegments.get': chargebeeSchemaEntry('retrySegments.get'),
	'rules.get': chargebeeSchemaEntry('rules.get'),
	'siteMigrationDetails.list': chargebeeSchemaEntry(
		'siteMigrationDetails.list',
	),
	'sitePcMetaRecords.list': chargebeeSchemaEntry('sitePcMetaRecords.list'),
	'subscriptions.addChargeAtTermEnd': chargebeeSchemaEntry(
		'subscriptions.addChargeAtTermEnd',
	),
	'subscriptions.advanceInvoiceEstimate': chargebeeSchemaEntry(
		'subscriptions.advanceInvoiceEstimate',
	),
	'subscriptions.cancel': chargebeeSchemaEntry('subscriptions.cancel'),
	'subscriptions.cancelForItems': chargebeeSchemaEntry(
		'subscriptions.cancelForItems',
	),
	'subscriptions.cancelSubscriptionEstimate': chargebeeSchemaEntry(
		'subscriptions.cancelSubscriptionEstimate',
	),
	'subscriptions.cancelSubscriptionForItemsEstimate': chargebeeSchemaEntry(
		'subscriptions.cancelSubscriptionForItemsEstimate',
	),
	'subscriptions.changeTermEnd': chargebeeSchemaEntry(
		'subscriptions.changeTermEnd',
	),
	'subscriptions.changeTermEndEstimate': chargebeeSchemaEntry(
		'subscriptions.changeTermEndEstimate',
	),
	'subscriptions.chargeAddonAtTermEnd': chargebeeSchemaEntry(
		'subscriptions.chargeAddonAtTermEnd',
	),
	'subscriptions.chargeFutureRenewals': chargebeeSchemaEntry(
		'subscriptions.chargeFutureRenewals',
	),
	'subscriptions.create': chargebeeSchemaEntry('subscriptions.create'),
	'subscriptions.createRamp': chargebeeSchemaEntry('subscriptions.createRamp'),
	'subscriptions.createUsage': chargebeeSchemaEntry(
		'subscriptions.createUsage',
	),
	'subscriptions.delete': chargebeeSchemaEntry('subscriptions.delete'),
	'subscriptions.deleteUsage': chargebeeSchemaEntry(
		'subscriptions.deleteUsage',
	),
	'subscriptions.editAdvanceInvoiceSchedule': chargebeeSchemaEntry(
		'subscriptions.editAdvanceInvoiceSchedule',
	),
	'subscriptions.get': chargebeeSchemaEntry('subscriptions.get'),
	'subscriptions.getAdvanceInvoiceSchedule': chargebeeSchemaEntry(
		'subscriptions.getAdvanceInvoiceSchedule',
	),
	'subscriptions.getScheduledChanges': chargebeeSchemaEntry(
		'subscriptions.getScheduledChanges',
	),
	'subscriptions.getUsage': chargebeeSchemaEntry('subscriptions.getUsage'),
	'subscriptions.getUsageCharges': chargebeeSchemaEntry(
		'subscriptions.getUsageCharges',
	),
	'subscriptions.getUsageSummary': chargebeeSchemaEntry(
		'subscriptions.getUsageSummary',
	),
	'subscriptions.getWithScheduledChanges': chargebeeSchemaEntry(
		'subscriptions.getWithScheduledChanges',
	),
	'subscriptions.importContractTerm': chargebeeSchemaEntry(
		'subscriptions.importContractTerm',
	),
	'subscriptions.importSubscription': chargebeeSchemaEntry(
		'subscriptions.importSubscription',
	),
	'subscriptions.importUnbilledCharges': chargebeeSchemaEntry(
		'subscriptions.importUnbilledCharges',
	),
	'subscriptions.list': chargebeeSchemaEntry('subscriptions.list'),
	'subscriptions.listAlertStatuses': chargebeeSchemaEntry(
		'subscriptions.listAlertStatuses',
	),
	'subscriptions.listApplicableAlerts': chargebeeSchemaEntry(
		'subscriptions.listApplicableAlerts',
	),
	'subscriptions.listContractTerms': chargebeeSchemaEntry(
		'subscriptions.listContractTerms',
	),
	'subscriptions.listDiscounts': chargebeeSchemaEntry(
		'subscriptions.listDiscounts',
	),
	'subscriptions.listEntitlementOverrides': chargebeeSchemaEntry(
		'subscriptions.listEntitlementOverrides',
	),
	'subscriptions.listEntitlements': chargebeeSchemaEntry(
		'subscriptions.listEntitlements',
	),
	'subscriptions.move': chargebeeSchemaEntry('subscriptions.move'),
	'subscriptions.overrideBillingProfile': chargebeeSchemaEntry(
		'subscriptions.overrideBillingProfile',
	),
	'subscriptions.pause': chargebeeSchemaEntry('subscriptions.pause'),
	'subscriptions.pauseSubscriptionEstimate': chargebeeSchemaEntry(
		'subscriptions.pauseSubscriptionEstimate',
	),
	'subscriptions.reactivate': chargebeeSchemaEntry('subscriptions.reactivate'),
	'subscriptions.regenerateInvoice': chargebeeSchemaEntry(
		'subscriptions.regenerateInvoice',
	),
	'subscriptions.regenerateInvoiceEstimate': chargebeeSchemaEntry(
		'subscriptions.regenerateInvoiceEstimate',
	),
	'subscriptions.removeAdvanceInvoiceSchedule': chargebeeSchemaEntry(
		'subscriptions.removeAdvanceInvoiceSchedule',
	),
	'subscriptions.removeCoupons': chargebeeSchemaEntry(
		'subscriptions.removeCoupons',
	),
	'subscriptions.removeScheduledCancellation': chargebeeSchemaEntry(
		'subscriptions.removeScheduledCancellation',
	),
	'subscriptions.removeScheduledChanges': chargebeeSchemaEntry(
		'subscriptions.removeScheduledChanges',
	),
	'subscriptions.removeScheduledPause': chargebeeSchemaEntry(
		'subscriptions.removeScheduledPause',
	),
	'subscriptions.removeScheduledResumption': chargebeeSchemaEntry(
		'subscriptions.removeScheduledResumption',
	),
	'subscriptions.renewalEstimate': chargebeeSchemaEntry(
		'subscriptions.renewalEstimate',
	),
	'subscriptions.resume': chargebeeSchemaEntry('subscriptions.resume'),
	'subscriptions.resumeSubscriptionEstimate': chargebeeSchemaEntry(
		'subscriptions.resumeSubscriptionEstimate',
	),
	'subscriptions.setAvailability': chargebeeSchemaEntry(
		'subscriptions.setAvailability',
	),
	'subscriptions.update': chargebeeSchemaEntry('subscriptions.update'),
	'subscriptions.updateForItems': chargebeeSchemaEntry(
		'subscriptions.updateForItems',
	),
	'subscriptions.updateScheduledChanges': chargebeeSchemaEntry(
		'subscriptions.updateScheduledChanges',
	),
	'subscriptions.upsertEntitlementOverrides': chargebeeSchemaEntry(
		'subscriptions.upsertEntitlementOverrides',
	),
	'timeMachines.get': chargebeeSchemaEntry('timeMachines.get'),
	'timeMachines.startAfresh': chargebeeSchemaEntry('timeMachines.startAfresh'),
	'timeMachines.travelForward': chargebeeSchemaEntry(
		'timeMachines.travelForward',
	),
	'tokens.createForCard': chargebeeSchemaEntry('tokens.createForCard'),
	'tokens.createUsingTempToken': chargebeeSchemaEntry(
		'tokens.createUsingTempToken',
	),
	'tokens.get': chargebeeSchemaEntry('tokens.get'),
	'transactions.createAuthorization': chargebeeSchemaEntry(
		'transactions.createAuthorization',
	),
	'transactions.deleteOfflineTransaction': chargebeeSchemaEntry(
		'transactions.deleteOfflineTransaction',
	),
	'transactions.get': chargebeeSchemaEntry('transactions.get'),
	'transactions.list': chargebeeSchemaEntry('transactions.list'),
	'transactions.reconcile': chargebeeSchemaEntry('transactions.reconcile'),
	'transactions.recordRefund': chargebeeSchemaEntry(
		'transactions.recordRefund',
	),
	'transactions.refund': chargebeeSchemaEntry('transactions.refund'),
	'transactions.void': chargebeeSchemaEntry('transactions.void'),
	'unbilledCharges.create': chargebeeSchemaEntry('unbilledCharges.create'),
	'unbilledCharges.createForItems': chargebeeSchemaEntry(
		'unbilledCharges.createForItems',
	),
	'unbilledCharges.delete': chargebeeSchemaEntry('unbilledCharges.delete'),
	'unbilledCharges.invoiceNowEstimate': chargebeeSchemaEntry(
		'unbilledCharges.invoiceNowEstimate',
	),
	'unbilledCharges.invoiceUnbilledCharges': chargebeeSchemaEntry(
		'unbilledCharges.invoiceUnbilledCharges',
	),
	'unbilledCharges.list': chargebeeSchemaEntry('unbilledCharges.list'),
	'usageEvents.create': chargebeeSchemaEntry('usageEvents.create'),
	'usageFiles.getProcessingStatus': chargebeeSchemaEntry(
		'usageFiles.getProcessingStatus',
	),
	'usageFiles.getUploadUrl': chargebeeSchemaEntry('usageFiles.getUploadUrl'),
	'usages.getPdf': chargebeeSchemaEntry('usages.getPdf'),
	'usages.list': chargebeeSchemaEntry('usages.list'),
	'variants.delete': chargebeeSchemaEntry('variants.delete'),
	'variants.get': chargebeeSchemaEntry('variants.get'),
	'variants.update': chargebeeSchemaEntry('variants.update'),
	'vaultedPaymentMethods.get': chargebeeSchemaEntry(
		'vaultedPaymentMethods.get',
	),
	'virtualBankAccounts.create': chargebeeSchemaEntry(
		'virtualBankAccounts.create',
	),
	'virtualBankAccounts.createUsingPermanentToken': chargebeeSchemaEntry(
		'virtualBankAccounts.createUsingPermanentToken',
	),
	'virtualBankAccounts.delete': chargebeeSchemaEntry(
		'virtualBankAccounts.delete',
	),
	'virtualBankAccounts.deleteLocal': chargebeeSchemaEntry(
		'virtualBankAccounts.deleteLocal',
	),
	'virtualBankAccounts.get': chargebeeSchemaEntry('virtualBankAccounts.get'),
	'virtualBankAccounts.list': chargebeeSchemaEntry('virtualBankAccounts.list'),
	'webhookEndpoints.create': chargebeeSchemaEntry('webhookEndpoints.create'),
	'webhookEndpoints.delete': chargebeeSchemaEntry('webhookEndpoints.delete'),
	'webhookEndpoints.get': chargebeeSchemaEntry('webhookEndpoints.get'),
	'webhookEndpoints.list': chargebeeSchemaEntry('webhookEndpoints.list'),
	'webhookEndpoints.update': chargebeeSchemaEntry('webhookEndpoints.update'),
} satisfies RequiredPluginEndpointSchemas<typeof chargebeeEndpointsNested>;

export const chargebeeEndpointMeta = {
	'addons.copy': {
		riskLevel: 'write',
		description:
			'Copy an addon. Creates an addon in this site by copying its configurations from another site. Copying of archived addons is not supported. Note: The attribute *tax_profile_id* is not copied. In effect, if the plan is taxable, it will be mapped to the *Primary* tax profile. Product Catalog 1.0 sites only.',
	},
	'addons.create': {
		riskLevel: 'write',
		description:
			'Create an addon. Create a new addon. Product Catalog 1.0 sites only.',
	},
	'addons.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an addon. When an addon that already has subscriptions/invoices linked to it is deleted, it does not get completely purged but is instead moved to "Archived" state. No other subscriptions can use this addon but subscriptions already on it will continue to renew. Product Catalog 1.0 sites only.',
	},
	'addons.get': {
		riskLevel: 'read',
		description:
			'Retrieve an addon. Retrieve a specific addon using the ID. Product Catalog 1.0 sites only.',
	},
	'addons.list': {
		riskLevel: 'read',
		description:
			'List addons. List the addons. This returns all your current active and archived addons. Product Catalog 1.0 sites only.',
	},
	'addons.unarchive': {
		riskLevel: 'write',
		description:
			'Unarchive an addon. Unarchives a specific addon using the id. Product Catalog 1.0 sites only.',
	},
	'addons.update': {
		riskLevel: 'write',
		description:
			'Update an addon. When updating addons that already have an invoice or a subscription linked to it, you can only update the following parameters: * name * invoice_name * price * included_in_mrr * meta_data. Product Catalog 1.0 sites only.',
	},
	'addresses.create': {
		riskLevel: 'write',
		description:
			'Update an address. Adds or replaces the address for a subscription. If an address is already present for the specified label, it will be replaced otherwise new address is added with that label.',
	},
	'addresses.list': {
		riskLevel: 'read',
		description:
			'Retrieve an address. Retrieves an address resource for a subscription and the specified label.',
	},
	'alerts.create': {
		riskLevel: 'write',
		description:
			'Create an alert. Creates a new alert configuration. Depending on type, the alert can monitor usage, spend, or credit balance, and it can be global or subscription-scoped depending on whether subscription_id is provided. Note: Creating an alert defines the threshold rule only.',
	},
	'alerts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an alert. Deletes an alert configuration. Only subscription-scoped alerts can be deleted using this endpoint. Important This operation cannot delete global alerts. To stop a global alert from firing, update the alert and set status to disabled instead.',
	},
	'alerts.get': {
		riskLevel: 'read',
		description:
			'Retrieve an alert. Retrieves a single alert configuration by alert_id. This returns the rule definition only and does not include runtime evaluation state. Note: To check whether a subscription is currently within_limit or in_alarm for this alert, use List alert statuses for an alert.',
	},
	'alerts.list': {
		riskLevel: 'read',
		description:
			'List alerts. Returns a list of alert configurations meeting all the conditions specified in the filter parameters below. Results include both global and subscription-scoped alerts.',
	},
	'alerts.listStatuses': {
		riskLevel: 'read',
		description:
			'List alert statuses for an alert. Returns the runtime state of a specific alert across all impacted subscriptions. Each entry indicates whether a subscription is within_limit or in_alarm for the given alert.',
	},
	'alerts.update': {
		riskLevel: 'write',
		description:
			'Update an alert. Updates an existing alert configuration. Use this to change the threshold values or toggle the status between enabled and disabled. ### Impacts Alert status on threshold change When the threshold is updated for an alert, the alarm_status for all impacted subscriptions is reset to within_limit.',
	},
	'attachedItems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an attached item. Deletes an attached addon or a charge item.',
	},
	'attachedItems.get': {
		riskLevel: 'read',
		description:
			'Retrieve an attached item. Retrieves details of an attached addon or a charge item.',
	},
	'attachedItems.update': {
		riskLevel: 'write',
		description:
			'Update an attached item. Updates an attached addon or a charge item for a plan.',
	},
	'batch.ingestUsages': {
		riskLevel: 'write',
		description:
			'Ingest usage events in batch. This endpoint ingests a batch of usage events into Chargebee. Note : - You can ingest 500 events in a batch ingestion. See also * Limits for Usage-based Billing in Chargebee.',
	},
	'businessEntities.create': {
		riskLevel: 'write',
		description:
			'Create a business entity. Creates a business_entity resource for the site. Use this endpoint to set up an additional business unit or brand under your organization, each with its own configuration and data. Note This endpoint is available only when multiple business entities are enabled for your site.',
	},
	'businessEntities.get': {
		riskLevel: 'read',
		description:
			'Retrieve a business entity. Retrieves the business_entity resource identified by the specified unique identifier.',
	},
	'businessEntities.list': {
		riskLevel: 'read',
		description:
			'List business entities. Returns a list of business_entity resources configured for the site, meeting all the conditions specified in the filter parameters below. By default, this list is sorted by id in ascending order.',
	},
	'businessEntities.listTransfers': {
		riskLevel: 'read',
		description:
			'List business entity transfers. Returns a list of business_entity_transfer resources meeting all the conditions specified in the filter parameters below. By default, this list is sorted by created_at in descending order (latest first).',
	},
	'businessEntities.transfer': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Transfer a customer to another business entity. Important This API will not work if you have specified a business entity in the custom HTTP header. Transfers one or more customer resources from one business entity to another. The transfer is executed by creating a copy of the customer resource.',
	},
	'businessEntities.update': {
		riskLevel: 'write',
		description:
			'Update business entity. Updates the business_entity resource identified by the specified unique identifier. You can change the name and the status of the business entity.',
	},
	'businessRules.activate': {
		riskLevel: 'write',
		description:
			'Activate a business rule. Activates a business rule by setting its active attribute to true, so that Chargebee evaluates it. Every rule is created inactive, so this is the operation that puts a new rule into effect. ### Impacts Business rule The rule active attribute is set to true.',
	},
	'businessRules.apply': {
		riskLevel: 'write',
		description:
			'Apply business rules. Evaluates business rules against a context that you supply. You can evaluate a single rule using rule_id, every rule in a ruleset using ruleset_id, or an ad hoc expression using structured_expression.',
	},
	'businessRules.create': {
		riskLevel: 'write',
		description:
			'Create a business rule. Creates a business rule and releases its first version, so the new rule has latest_version set to 1 and released_at set. The rule is created inactive: Chargebee does not evaluate it until you call Activate a business rule.',
	},
	'businessRules.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a business rule. Deactivates a business rule by setting its active attribute to false. The rule is retained along with its versions and ruleset memberships, but Chargebee stops evaluating it. Use this operation to switch a rule off temporarily.',
	},
	'businessRules.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a business rule. Deletes a business rule and removes it from every business ruleset it belongs to. This is a soft delete: the rule is no longer returned by the API or evaluated by Chargebee, but its id cannot be reused.',
	},
	'businessRules.deleteDraft': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a business rule draft. Deletes the draft version of a business rule, permanently discarding every change that has not been released. The released version of the rule is not affected. Use this operation to abandon a revision you no longer want to release, and to leave the rule serving its released version unchanged.',
	},
	'businessRules.get': {
		riskLevel: 'read',
		description:
			'Retrieve a business rule. Retrieves the released version of the business rule with the specified id, which is the version Chargebee evaluates. The response describes the version in latest_version.',
	},
	'businessRules.getDraft': {
		riskLevel: 'read',
		description:
			'Retrieve a business rule draft. Retrieves the draft version of a business rule. The draft holds changes that have not been released yet, so it can differ from the released version returned by Retrieve a business rule. Use this operation to review a staged change before releasing it.',
	},
	'businessRules.list': {
		riskLevel: 'read',
		description:
			'List business rules. Returns a list of business rules satisfying all the conditions specified in the filter parameters. Each rule is returned as its released version. Deleted rules are not returned.',
	},
	'businessRules.release': {
		riskLevel: 'write',
		description:
			'Release a business rule. Releases the draft version of a business rule. The draft is promoted to the next version number and becomes the released version that Chargebee evaluates, so latest_version is incremented and released_at is set. Until you release it, the previously released version stays in effect.',
	},
	'businessRules.updateDraft': {
		riskLevel: 'write',
		description:
			'Update a business rule draft. Updates the draft version of a business rule. The first edit creates a draft from the released version, and every later edit updates that same draft. Changes made to a draft do not affect rule evaluation until the draft is released.',
	},
	'businessRulesets.activate': {
		riskLevel: 'write',
		description:
			'Activate a business ruleset. Activates a business ruleset by setting its active attribute to true, so that Chargebee evaluates the rules it contains. ### Impacts Business ruleset The ruleset active attribute is set to true.',
	},
	'businessRulesets.addRules': {
		riskLevel: 'write',
		description:
			"Add business rules to a ruleset. Adds one or more business rules to a ruleset without changing any of its other attributes. The rules are appended to the end of the ruleset's evaluation order, so you cannot choose their priorities here. Use this operation to extend a ruleset that is already in use.",
	},
	'businessRulesets.create': {
		riskLevel: 'write',
		description:
			'Create a business ruleset. Creates a business ruleset. A ruleset groups business rules so that they can be evaluated together, in the priority order you assign, using the strategy set in execute_mode.',
	},
	'businessRulesets.deactivate': {
		riskLevel: 'write',
		description:
			'Deactivate a business ruleset. Deactivates a business ruleset by setting its active attribute to false. The ruleset and its rule memberships are retained, but Chargebee stops evaluating it. Use this operation to switch off a whole group of rules in one call, without changing the rules themselves.',
	},
	'businessRulesets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a business ruleset. Permanently deletes a business ruleset. ### Prerequisites \\& Constraints * The business ruleset must not contain any business rules. If it does, remove the business rules from the ruleset before deleting it. ### Impacts Business ruleset Chargebee permanently deletes the business ruleset.',
	},
	'businessRulesets.get': {
		riskLevel: 'read',
		description:
			'Retrieve a business ruleset. Retrieves the business ruleset with the specified id. To fetch the rules it contains, use List rules in a business ruleset.',
	},
	'businessRulesets.list': {
		riskLevel: 'read',
		description:
			'List business rulesets. Returns a list of business rulesets satisfying all the conditions specified in the filter parameters. The response describes each ruleset but does not carry its membership; use List rules in a business ruleset to page through the rules of a particular ruleset.',
	},
	'businessRulesets.listRules': {
		riskLevel: 'read',
		description:
			'List rules in a business ruleset. Returns the business rules that belong to a ruleset, along with the priority that determines their evaluation order. The results can be filtered by active status and are paginated. Each entry carries the rule_id of the rule and its priority within this ruleset.',
	},
	'businessRulesets.removeRules': {
		riskLevel: 'write',
		description:
			'Remove business rules from a ruleset. Removes one or more business rules from a ruleset without changing any of its other attributes. The rules themselves are not deleted and remain available to other rulesets.',
	},
	'businessRulesets.update': {
		riskLevel: 'write',
		description:
			'Update a business ruleset. Updates a business ruleset. Passing rules replaces the entire membership of the ruleset. To change membership incrementally, use Add business rules to a ruleset or Remove business rules from a ruleset instead.',
	},
	'cards.get': {
		riskLevel: 'read',
		description:
			'Retrieve card for a customer. #### Deprecated This operation is obsoleted by the Retrieve a payment source API . Retrieves the credit card for the customer id.',
	},
	'collectionsPaymentPromises.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Cancel a collections payment promise. Cancels an active collections payment promise. Cancelling does not resume the invoice's reminder sequence. A promise can also end automatically. When the invoice is paid, the promise becomes fulfilled or broken. When the invoice is voided, written off, or deleted, the promise becomes cancelled.",
	},
	'collectionsPaymentPromises.create': {
		riskLevel: 'write',
		description:
			"Create a collections payment promise. Creates a collections payment promise that records a customer's commitment to pay by promised_on. The response is a list with one promise for each covered invoice. To cover one invoice, pass invoice_id and an amount equal to that invoice's amount due.",
	},
	'collectionsPaymentPromises.get': {
		riskLevel: 'read',
		description:
			'Retrieve a payment promise. Retrieves a collections payment promise by ID.',
	},
	'collectionsPaymentPromises.list': {
		riskLevel: 'read',
		description:
			'List collections payment promises. Lists collections payment promises. All filters are optional; without filters, promises are returned newest first.',
	},
	'collectionsPaymentPromises.update': {
		riskLevel: 'write',
		description:
			'Update a collections payment promise. Updates an active collections payment promise. You can change promised_on, reason, or promised_by; omitted parameters remain unchanged.',
	},
	'comments.create': {
		riskLevel: 'write',
		description:
			'Create a comment. Create a new comment for an entity. The newly added comment will be shown in the web interface as well.',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a comment. for an entity identified by comment ID. Only the comments that are added via Admin console and API can be deleted. Chargebee generated "System" comments cannot be deleted.',
	},
	'comments.get': {
		riskLevel: 'read',
		description: 'Retrieve a comment. for an entity identified by comment ID.',
	},
	'comments.list': {
		riskLevel: 'read',
		description:
			'List comments. Retrieve the list of comments sorted by the recent ones on the top. If you want to retrieve the list of comments for an entity, for example, subscription you can filter them by passing the entity type and unique identifier for that entity, for example, subscription ID.',
	},
	'configurations.list': {
		riskLevel: 'read',
		description:
			'List site configurations. Returns a list of your domain and product catalog version details.',
	},
	'couponCodes.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive a coupon code. Archives a coupon code thereby making it inactive. The archived coupon code cannot be applied to any subscription.',
	},
	'couponCodes.get': {
		riskLevel: 'read',
		description:
			'Retrieve a coupon code. Retrieves a specific coupon code details.',
	},
	'couponCodes.list': {
		riskLevel: 'read',
		description: 'List coupon codes. List the available coupon codes.',
	},
	'couponSets.addCouponCodes': {
		riskLevel: 'write',
		description:
			'Add coupon codes to coupon set. This API add coupon codes to an existing coupon set.',
	},
	'couponSets.create': {
		riskLevel: 'write',
		description:
			'Create a coupon set. with a coupon code compatible to your product offers and promotional discounts.',
	},
	'couponSets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a coupon set. Use this endpoint to delete a specific coupon set.',
	},
	'couponSets.deleteUnusedCouponCodes': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete unused coupon codes. Use this API to delete all the unutilised coupon codes from a specific coupon set.',
	},
	'couponSets.get': {
		riskLevel: 'read',
		description:
			'Retrieve a coupon set. Use this API to retrieve a specific coupon set.',
	},
	'couponSets.list': {
		riskLevel: 'read',
		description:
			'List coupon sets. Use this API to get the list of all the coupon sets.',
	},
	'couponSets.update': {
		riskLevel: 'write',
		description:
			'Update a coupon set. Use this API to update a specific coupon set by updating its name and the meta_data.',
	},
	'coupons.copy': {
		riskLevel: 'write',
		description:
			'Copy a coupon. Copies a coupon over from one site to another. Copying of archived coupons is not supported. The item prices that are linked to the coupon in the source site are also linked to the coupon in the destination site.',
	},
	'coupons.create': {
		riskLevel: 'write',
		description:
			'Create a coupon. This API creates a new coupon for a specific promotion or offers. Product Catalog 1.0 sites only.',
	},
	'coupons.createForItems': {
		riskLevel: 'write',
		description:
			'Create a coupon for items. This API creates a new coupon for a specific promotion or offers.',
	},
	'coupons.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a coupon. If no Subscriptions/Invoices are linked to this Coupon, the Coupon will be deleted from your Chargebee site. This action cannot be undone. To ensure that existing Subscriptions/Invoices are not affected, Coupons associated with them will not be deleted, but moved to "Archived" state.',
	},
	'coupons.get': {
		riskLevel: 'read',
		description:
			'Retrieve a coupon. This API retrieves a specific coupon using the coupon ID.',
	},
	'coupons.list': {
		riskLevel: 'read',
		description:
			'List coupons. List all the available coupons that are created for a specific promotion or offers. You can find list of coupon codes that are currently active, expired, archived or deleted.',
	},
	'coupons.unarchive': {
		riskLevel: 'write',
		description:
			'Unarchive a coupon. This API unarchives a specific coupon using the coupon ID.',
	},
	'coupons.update': {
		riskLevel: 'write',
		description:
			'Update a coupon. When updating coupons that are already linked to an invoice or subscription you can only update the following parameters: * name * invoice name * plan_constraint - Applicable when apply_on is set as each_specified_item. Allows change from none to all, none to specific, and specific to all. Product Catalog 1.0 sites only.',
	},
	'coupons.updateForItems': {
		riskLevel: 'write',
		description:
			'Update a coupon for items. This API updates a coupon that is created for a specific promotion or offers.',
	},
	'creditNotes.create': {
		riskLevel: 'destructive',
		description:
			'Create credit note. Creates a credit note for the specified invoice. ### Impacts Invoice See Impact on reference invoice. Credit note * A new credit note of the specified type is created. * If the credit note type is adjustment: * total and amount_allocated are set to the adjusted amount. * status is set to adjusted.',
	},
	'creditNotes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a credit note. This API deletes a credit note. A credit note once deleted, is deleted permanently. You cannot delete a credit which has already been deleted or refunded. If you try to delete a refunded or deleted credit note, an error message will be displayed.',
	},
	'creditNotes.downloadEinvoice': {
		riskLevel: 'read',
		description:
			'Download e-invoice for credit note. Download the e-invoice for the credit note in both XML and PDF formats. The response consists of a download object for each format. The XML format follows the structure as per Peppol BIS Billing v3.0. Note * You can only download e-invoices when their status is success or registered.',
	},
	'creditNotes.get': {
		riskLevel: 'read',
		description:
			'Retrieve a credit note. Retrieves the Credit Note identified by the specified Credit Note number.',
	},
	'creditNotes.getPdf': {
		riskLevel: 'read',
		description:
			'Retrieve credit note as PDF. Gets the credit note as PDF. The returned URL is secure and allows download. The URL will expire in 60 minutes.',
	},
	'creditNotes.import': {
		riskLevel: 'destructive',
		description:
			'Import credit note. Imports a credit note into Chargebee Billing. This endpoint allows you to import a credit note from external systems, such as accounting software, into Chargebee. Use this operation during data migration or reconciliation to ensure historical credits are represented in the system.',
	},
	'creditNotes.list': {
		riskLevel: 'read',
		description: 'List credit notes. Lists all the Credit Notes.',
	},
	'creditNotes.recordRefund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Record refund for a credit note. Records a refund for a refundable credit note. This API does not process an actual refund for online payments by returning money to customers.',
	},
	'creditNotes.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Refund a credit note. Refunds a specified amount from a refundable credit note back to the customer's payment source. This operation supports only refunds against online payments. The refund amount is returned to the customer through the payment_source associated with the transaction.",
	},
	'creditNotes.removeTaxWithheldRefund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove tax withheld refunds from a credit note. Removes a linked_tax_withheld_refunds record from the credit_note .',
	},
	'creditNotes.resendEinvoice': {
		riskLevel: 'destructive',
		description:
			'Resend failed einvoice in credit notes. (POST /credit_notes/{credit-note-id}/resend_einvoice)',
	},
	'creditNotes.sendEinvoice': {
		riskLevel: 'destructive',
		description:
			'Send an einvoice for credit notes. This endpoint is used to send an e-invoice for invoice. To support cases like TDS and invoice edits, we need to stop auto e-invoice sending and be able to send e-invoices manually. This endpoint schedules e-invoices manually.',
	},
	'creditNotes.sendEmail': {
		riskLevel: 'destructive',
		description:
			"Send Credit Note Email. Sends the credit note email to the customer using the site's published Send Credit Note Email Engage notification template. Use this operation to resend or manually trigger the credit note email for a customer outside the normal notification schedule. Async-only This operation is asynchronous only.",
	},
	'creditNotes.update': {
		riskLevel: 'destructive',
		description:
			'Update Credit Note Details. Updates the custom fields and comment of a credit note. Use this operation to add or change custom field values, or to attach an internal comment, without modifying other credit note attributes. Pass at least one credit note custom field or comment; otherwise the credit note is returned unchanged.',
	},
	'creditNotes.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Void a credit note. Void or invalidate the specified credit note. Use this operation for incorrectly generated credit notes, such as those with wrong details or created by mistake.',
	},
	'creditUnits.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive a credit unit. Archives an active credit unit. Once archived, the credit unit can no longer be used to create grant configurations for items and grant configuration overrides for subscriptions. Any grants that were already configured for this credit unit will continue to be effective.',
	},
	'creditUnits.create': {
		riskLevel: 'write',
		description:
			'Create a credit unit. Creates a new credit unit in the active status.',
	},
	'creditUnits.list': {
		riskLevel: 'read',
		description:
			'List credit units. Retrieves a paginated list of credit units meeting all the conditions specified in the filter parameters.',
	},
	'creditUnits.reactivate': {
		riskLevel: 'destructive',
		description:
			'Reactivate a credit unit. Reactivates an archived credit unit. Once reactivated, the credit unit can be used to configure grants for plans, add-ons, and charges, as well as grant configuration overrides for subscriptions.',
	},
	'creditUnits.update': {
		riskLevel: 'write',
		description: 'Update a credit unit. Updates an existing credit unit.',
	},
	'csvTaxRules.create': {
		riskLevel: 'write',
		description: 'Taxes Csv import. (POST /csv_tax_rules)',
	},
	'currencies.addSchedule': {
		riskLevel: 'write',
		description:
			'Add schedule. This API is used to schedule exchange rate modification for a manual forex_type currency.',
	},
	'currencies.create': {
		riskLevel: 'write',
		description:
			'Add a new currency. This API is used to add a new currency to your Chargebee site. Prior to using this API, ensure that the multi-currency feature is enabled. If the forex_type is set to manual , you can specify the manual_exchange_rate .',
	},
	'currencies.get': {
		riskLevel: 'read',
		description:
			'Retrieve a currency. This API is used to retrieve an individual currency object configured within this site.',
	},
	'currencies.getList': {
		riskLevel: 'read',
		description:
			'List currencies. This API is used to retrieve the list of all currencies currently configured within the site.',
	},
	'currencies.removeSchedule': {
		riskLevel: 'write',
		description:
			'Remove schedule. This API allows you to remove a scheduled exchange rate from a currency.',
	},
	'currencies.update': {
		riskLevel: 'write',
		description:
			'Update a currency. This API is used to update the configured currencies within your Chargebee site. Additionally, If the forex_type is set to manual , you can specify the manual_exchange_rate .',
	},
	'customFieldConfigs.getMetadata': {
		riskLevel: 'read',
		description:
			'Retrieve a custom field configuration. Retrieves the configuration for the custom field that matches the specified entity type and API name.',
	},
	'customFieldConfigs.list': {
		riskLevel: 'read',
		description:
			'List custom field configurations. Lists the configurations for all custom fields defined for the specified entity type.',
	},
	'customers.addContact': {
		riskLevel: 'write',
		description:
			'Add contacts to a customer. Add a contact to a customer resource. ### Prerequisites \\& Constraints * The customer must have fewer than 10 contacts already added. ### Impacts Email notifications * If you set contact[send_billing_email] to true, the contact receives billing emails.',
	},
	'customers.assignPaymentRole': {
		riskLevel: 'write',
		description:
			'Assign payment role. Assign or unassign the primary or backup payment role for a payment source.',
	},
	'customers.changeBillingDate': {
		riskLevel: 'write',
		description:
			"Change billing date. Applicable when *calendar billing* (with customer specific billing date support) is enabled. Changes the customer's *billing_date* and/or *billing_day_of_week*. During this operation the upcoming renewal dates are not updated to align immediately with the new date.",
	},
	'customers.clearPersonalData': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Clear personal data of a customer. Clear personal details of a customer using this API. Erases the customer's personal data (GDPR); it cannot be restored.",
	},
	'customers.collectPayment': {
		riskLevel: 'destructive',
		description:
			"Collect payment for customer. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. This API can be used to collect the payments for customer's payment_due and not_paid invoices. Charges the customer's payment method.",
	},
	'customers.copyCard': {
		riskLevel: 'write',
		description:
			"Copy card. #### deprecated The Payment Sources API , with its additional options and improvements, obsoletes the Cards APIs. This request is obsoleted by the Export payment source API . Copies the customer's card information to another payment gateway.",
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create a customer. Creates a customer resource. Optionally, creates a payment source for the customer.',
	},
	'customers.createSubscription': {
		riskLevel: 'destructive',
		description:
			'Create subscription for customer. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. Creates a new subscription for an existing customer. Product Catalog 1.0 sites only.',
	},
	'customers.createSubscriptionEstimate': {
		riskLevel: 'read',
		description:
			'Create subscription for a customer estimate. Create a subscription for the existing estimate of a customer. Product Catalog 1.0 sites only.',
	},
	'customers.createSubscriptionForItems': {
		riskLevel: 'destructive',
		description:
			'Create a subscription. Note: This endpoint optionally supports 3DS. To use it create a payment_intent and provide it via this endpoint. Creates a new subscription for an existing customer in Chargebee. Any available credits and excess payments for the customer are automatically applied on the invoice. Creates the subscription and, unless it starts in trial or later, invoices and charges the customer at once.',
	},
	'customers.createSubscriptionForItemsEstimate': {
		riskLevel: 'read',
		description:
			'Estimate for creating a subscription. Generates an estimate without creating a subscription. This endpoint can be called when you want to preview details of a new subscription before actually creating one. The following conditions must be met or tax calculation is ignored: * The taxability attribute for the customer is true.',
	},
	'customers.createSubscriptionQuote': {
		riskLevel: 'destructive',
		description:
			'Create quote for a new subscription. Creates a quote for a new subscription under the customer specified. To send this quote, use "Send Email" quote action in the Chargebee application. Product Catalog 1.0 sites only.',
	},
	'customers.createSubscriptionQuoteForItems': {
		riskLevel: 'destructive',
		description:
			'Create a quote for subscription creation. Create a quote for new subscription line items of a customer.',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a customer. Deletes a specified customer. This operation schedules the customer resource for deletion, and it is permanently deleted after a few minutes. If you wish to retain the customer data but stop further subscription renewals, consider canceling or pausing the subscriptions instead.',
	},
	'customers.deleteCard': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete card for a customer. #### deprecated The Payment Sources API , with its additional options and improvements, obsoletes the Cards APIs. This request is obsoleted by the Delete a payment source API . Deletes the card for a customer.',
	},
	'customers.deleteContact': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete contacts for a customer. Deletes a particular contact for a customer. You can delete a contact by giving the Contact ID as the input parameter.',
	},
	'customers.delink': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Unlink a customer from its parent account. When a customer belongs to an account hierarchy , this operation detaches the customer from its parent. The hierarchy, if any, beneath the customer remains unchanged.',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Retrieve a customer. Retrieves the details of the desired customer. You can use the unique identifier for a particular customer to retrieve the desired details.',
	},
	'customers.getHierarchy': {
		riskLevel: 'read',
		description:
			'Get account hierarchy for a customer. Retrieves the full or partial account hierarchy for a customer.',
	},
	'customers.getUpcomingInvoicesEstimate': {
		riskLevel: 'read',
		description:
			'Upcoming invoices estimate. Estimate of the upcoming scheduled invoices (subscription activations, renewals etc) of a customer. For now preview of the invoices generated on the immediate upcoming date is supported.',
	},
	'customers.importSubscription': {
		riskLevel: 'destructive',
		description:
			'Import subscription for customer. Import the subscription details of a customer. Product Catalog 1.0 sites only.',
	},
	'customers.importSubscriptionForItems': {
		riskLevel: 'destructive',
		description:
			'Import a subscription. Imports a subscription for an existing customer. Use this operation when migrating subscriptions from another billing system.',
	},
	'customers.link': {
		riskLevel: 'write',
		description:
			'Link a customer to an account hierarchy. Creates a hierarchical relationship between two customers. The path parameter customer_id identifies the child in this relationship, and parent_id identifies the parent.',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers. Retrieves a list of customers added to your Chargebee site. The list contains the necessary customer details such as First Name, Last Name and the Customer ID.',
	},
	'customers.listContacts': {
		riskLevel: 'read',
		description:
			'List of contacts for a customer. This API retrieves all the contacts for a customer.',
	},
	'customers.listEmailLogs': {
		riskLevel: 'read',
		description:
			'List email logs for a customer. Retrieves the emails sent for a customer, newest first. Use this operation to inspect delivery status, recipient, and template for emails Chargebee sent to a customer, including those triggered by send invoice email, send credit note email, and send payment request email.',
	},
	'customers.listEntitlements': {
		riskLevel: 'read',
		description:
			'List customer entitlements. Tip To retrieve subscription entitlements for a specific subscription, use the List subscription entitlements API. Returns a list of customer_entitlement objects for the specified customer. The entitlements returned are for *active* subscriptions only.',
	},
	'customers.listHierarchyDetails': {
		riskLevel: 'read',
		description:
			'Get paginated account hierarchy for a customer. Retrieves the account hierarchy tree for the customer.',
	},
	'customers.listPaymentVouchers': {
		riskLevel: 'read',
		description:
			'List vouchers for a customer. Retrieves vouchers for a customer in reverse chronological order.',
	},
	'customers.merge': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Merge customers. This API moves a customer's payment methods, subscriptions, invoices, credit notes, transactions, unbilled charges, and orders to another customer. Events and email logs will not be moved. The API execution is asynchronous.",
	},
	'customers.move': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Move a customer. This API copies a customer object from one site to another. The destination site (the site to which the customer is copied) is specified by the path parameter {site}; whereas, the source site (the site from which the customer is copied) is specified by the query parameter from_site.',
	},
	'customers.recordExcessPayment': {
		riskLevel: 'destructive',
		description:
			"Record an excess payment for a customer. Records an offline payment for a customer and adds it to the customer's excess payments balance. ### Impacts Invoices * Chargebee automatically applies excess payments to future invoices, subject to limits set at the site level or overridden for subscriptions via subscription.billing_override.",
	},
	'customers.sendPaymentRequest': {
		riskLevel: 'destructive',
		description:
			"Send Payment Request Email. Sends a request payment email to the customer using the site's published Collect Payment Email Engage notification template. Use this operation to manually trigger a payment request email when you want the customer to pay outstanding invoices. Async-only This operation is asynchronous only.",
	},
	'customers.switchGateway': {
		riskLevel: 'write',
		description:
			"Switch gateway. #### Deprecated This request is obsoleted by the Switch gateway account API for Payment Sources. Switches the gateway in which customer's card information is stored. This is applicable only if the payment method is card.",
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update a customer. Updates the details of the specified customer. Use this API to modify customer information, including standard attributes and any configured custom attributes. * To update the billing address or VAT number, use the Update billing info for a customer API instead.',
	},
	'customers.updateBillingInfo': {
		riskLevel: 'write',
		description:
			"Update billing info for a customer. Updates a customer's billing information, including billing address and tax-related details such as VAT number. Note See Related APIs for other customer attributes that can be updated.",
	},
	'customers.updateCard': {
		riskLevel: 'write',
		description:
			'Update card for a customer. #### Deprecated The Payment Sources API , with its additional options and improvements, obsoletes the Cards APIs . This operation is obsoleted by the following: * Create using temporary token * Create using permanent token * Create a card payment source Adds or replaces card details of a customer.',
	},
	'customers.updateContact': {
		riskLevel: 'write',
		description:
			'Update contacts for a customer. Updates the details of a contact for a customer. You can give the field data to be updated as input parameters along with the Contact ID to update it.',
	},
	'customers.updateHierarchySettings': {
		riskLevel: 'write',
		description:
			'Update account hierarchy access settings for a customer. When the customer is part of an account hierarchy, this operation updates the access privileges that both the customer and its parent have to the customer\'s data. Terminology The term "parent" usually refers to the customer with the ID payment_owner_id.',
	},
	'customers.updatePaymentMethod': {
		riskLevel: 'write',
		description:
			'Update payment method for a customer. Payment Sources comes with additional options and improvements to the Card APIs . For this operation, use the Create using temporary token API or Create using permanent token API under Payment Sources to update payment method for the customer. Updates payment method details for a customer.',
	},
	'differentialPrices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a differential price. using a differential_price_id and item_price_id .',
	},
	'differentialPrices.get': {
		riskLevel: 'read',
		description:
			'Retrieve a differential price. using a differential_price_id and item_price_id .',
	},
	'differentialPrices.list': {
		riskLevel: 'read',
		description:
			'List differential prices. Returns a list of differential prices satisfying all the conditions specified in the filter parameters below. The list is sorted by the date of creation in descending order (latest first).',
	},
	'differentialPrices.update': {
		riskLevel: 'write',
		description:
			'Update a differential price. using a differential_price_id and item_price_id .',
	},
	'disputes.get': {
		riskLevel: 'read',
		description:
			"Retrieve A Dispute. Retrieves a dispute identified by its unique id. Use this operation to check the current status of a dispute, the amount under dispute, and the transaction and customer it relates to. To find disputes when you don't have the dispute id, use the List disputes operation.",
	},
	'disputes.list': {
		riskLevel: 'read',
		description:
			'List Disputes. Lists the disputes raised against the transactions on your site, with the most recently created dispute first. Use the filter parameters to narrow the list to the disputes you want to act on.',
	},
	'einvoices.get': {
		riskLevel: 'read',
		description:
			'Retrieve an e-invoice. Retrieve the e-invoice for the specified e-invoice id (einvoice_id).',
	},
	'einvoices.list': {
		riskLevel: 'read',
		description:
			'List e-invoices. Returns a list of e-invoices. You can filter by id, reference id, updated at, invoice id, or credit note id.',
	},
	'entitlements.create': {
		riskLevel: 'write',
		description:
			'Manage entitlements for a feature. Create, update, or remove a set of entitlements for a feature. The behavior depends on the specified action. It tries to create, update, or delete entitlement objects. If any of the entitlement objects fail to process, the entire operation stops with an error, and no entitlements are processed.',
	},
	'entitlements.list': {
		riskLevel: 'read',
		description:
			'List entitlements. Retrieves a list of all the entitlements associated with the specified feature.',
	},
	'estimates.createInvoice': {
		riskLevel: 'read',
		description:
			"Create invoice estimate. Generates an estimate for the 'create an invoice' operation. This is similar to the Create an invoice API, but the invoice will not be generated. Only an estimate for this operation is created. Product Catalog 1.0 sites only.",
	},
	'estimates.createInvoiceForItems': {
		riskLevel: 'read',
		description:
			'Create invoice for items estimate. This endpoint creates an invoice estimate for non-recurring items. You can optionally override the line item name and description displayed on the invoice for charge-item prices and one-time charges. These overrides are reflected in the returned invoice estimate.',
	},
	'estimates.createSubscription': {
		riskLevel: 'read',
		description:
			"Create subscription estimate. Generates an estimate for the 'create subscription' operation. This is similar to the Create Subscription API but no subscription will be created, only an estimate for this operation is created. Product Catalog 1.0 sites only.",
	},
	'estimates.createSubscriptionForItems': {
		riskLevel: 'read',
		description:
			'Estimate for creating a customer and subscription. Generates an estimate for creating a subscription when the customer does not exist in Chargebee. This estimate API can be called when the customer has not yet signed up and you want to preview how a new subscription would look like for them.',
	},
	'estimates.giftSubscription': {
		riskLevel: 'read',
		description:
			"Gift subscription estimate. Generates an estimate for the 'create a gift' operation. This is similar to the Create a gift API, but the gift subscription will not be created. Only an estimate for this operation is created. In the response, * estimate.subscription_estimate has the gift subscription details. Product Catalog 1.0 sites only.",
	},
	'estimates.giftSubscriptionForItems': {
		riskLevel: 'read',
		description:
			'Gift subscription estimate for items. This endpoint generates an estimate for a subscription that is intended to be a gift. The estimate provides details about the gift sender, gift recipient, address details of the recipient, and the type and details of subscription items included in the gift.',
	},
	'estimates.paymentSchedules': {
		riskLevel: 'read',
		description:
			'Create a payment schedule estimate. Generates an estimate without creating a payment schedule. This endpoint can be called when you want to preview details of a new payment schedule before actually creating one.',
	},
	'estimates.updateSubscription': {
		riskLevel: 'read',
		description:
			"Update subscription estimate. Generates an estimate for the 'update subscription' operation. The input will be similar to the Update Subscription API but subscription will not be updated, only an estimate will be created. Product Catalog 1.0 sites only.",
	},
	'estimates.updateSubscriptionForItems': {
		riskLevel: 'read',
		description:
			'Estimate for updating a subscription. Returns an estimate for updating a subscription. In the response, * subscription_estimate: The details of the changed subscription such as status, next billing date, and so on. * invoice_estimate:The details of the immediate invoice, if it is generated.',
	},
	'events.get': {
		riskLevel: 'read',
		description:
			'Retrieve an event. Retrieves a specific event identified by a unique event identifier. Note: Only events that are less than 90 days old will be retrieved.',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events. Retrieves list of events. (GET /events)',
	},
	'exports.addons': {
		riskLevel: 'read',
		description:
			'Export addons. This API triggers export of addon data. The exported zip file contains CSV files with addon-related data. Product Catalog 1.0 sites only.',
	},
	'exports.attachedItems': {
		riskLevel: 'read',
		description:
			'Export attached items. This API triggers export of attached item data. The exported zip file contains CSV files with attached item-related data.',
	},
	'exports.coupons': {
		riskLevel: 'read',
		description:
			'Export coupons. This API triggers export of coupon data. The exported zip file contains CSV files with coupon-related data.',
	},
	'exports.creditNotes': {
		riskLevel: 'read',
		description:
			'Export credit notes. This API triggers export of credit note data. The exported zip file contains CSV files with credit note-related data.',
	},
	'exports.customers': {
		riskLevel: 'read',
		description:
			'Export customers. This API triggers export of customer data. The exported zip file contains CSV files with customer-related data. Starts an export job; read exports.get until its download URL is ready.',
	},
	'exports.deferredRevenue': {
		riskLevel: 'read',
		description:
			'Export deferred revenue reports. Important: This report is deprecated. Therefore, the endpoint is also deprecated. This API triggers export for the Deferred Revenue Report. Note: This API call is asynchronous. You need to check if this operation has completed by checking if the export status is completed .',
	},
	'exports.differentialPrices': {
		riskLevel: 'read',
		description:
			'Export differential price. This API triggers export of differential price data. The exported zip file contains CSV files with differential price-related data.',
	},
	'exports.get': {
		riskLevel: 'read',
		description:
			'Retrieve an export. This API gets the status of the export job initiated by the Exports API. If the export job is completed, the downloads resource will also be obtained in the API response. The returned URL in the downloads resource is secure and can be downloaded. The URL expires after 4 hours.',
	},
	'exports.invoices': {
		riskLevel: 'read',
		description:
			'Export invoices. This API triggers export of invoice data. The exported zip file contains CSV files with invoice-related data. ### Invoice Export Best Practice For a full export, Chargebee recommends exporting data in batches by using date filters.',
	},
	'exports.itemFamilies': {
		riskLevel: 'read',
		description:
			'Export item families. This API triggers export of item family data. The exported zip file contains CSV files with item family-related data.',
	},
	'exports.itemPrices': {
		riskLevel: 'read',
		description:
			'Export item prices. This API triggers export of item price data. The exported zip file contains CSV files with item price-related data.',
	},
	'exports.items': {
		riskLevel: 'read',
		description:
			'Export items. This API triggers export of item data. The exported zip file contains CSV files with item-related data.',
	},
	'exports.orders': {
		riskLevel: 'read',
		description:
			'Export orders. This API triggers export of order data. The exported zip file contains CSV files with order-related data.',
	},
	'exports.plans': {
		riskLevel: 'read',
		description:
			'Export plans. This API triggers export of plan data. The exported zip file contains CSV files with plan-related data. Product Catalog 1.0 sites only.',
	},
	'exports.priceVariants': {
		riskLevel: 'read',
		description:
			'Export price variants. This API triggers export of price variant data. The exported zip file contains CSV files with price variant-related data.',
	},
	'exports.ramps': {
		riskLevel: 'read',
		description:
			'Export Subscription Ramps. Starts an export job for subscription ramps data. The exported zip file contains CSV files with ramp-related data. ### Best practice For a full data export, use filters to export in batches, as suggested in the samples below.',
	},
	'exports.revenueRecognition': {
		riskLevel: 'read',
		description:
			'Export revenue recognition reports. Important: This report is deprecated. Therefore, the endpoint is also deprecated. This API triggers export for the revenue recognition report. Note: This API call is asynchronous. You need to check if this operation has completed by checking if the export status is completed .',
	},
	'exports.subscriptions': {
		riskLevel: 'read',
		description:
			'Export subscriptions. This API triggers export of subscription data. The exported zip file contains CSV files with subscription-related data.',
	},
	'exports.transactions': {
		riskLevel: 'read',
		description:
			'Export transactions. This API triggers export of transaction data. The exported zip file contains CSV files with transaction-related data.',
	},
	'features.activate': {
		riskLevel: 'write',
		description:
			'Activate a feature. Activates a draft feature so that any entitlements or subscription entitlements defined towards it take effect immediately. This operation changes the status of the feature to active. ### Prerequisites \\& Constraints * Only a feature in draft status can be activated.',
	},
	'features.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive a feature. Archives an active feature so that no new entitlements or subscription entitlements can be created towards the feature. Any pre-existing item or subscription entitlements from the time that the feature was active remain effective. This operation changes the status of the feature to archived.',
	},
	'features.create': {
		riskLevel: 'write',
		description:
			'Create a feature. Creates a new feature. Note: This operation creates non-metered features only. To create a metered feature, use the Create a metered feature operation.',
	},
	'features.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a feature. Deletes a feature. Any entitlements and subscription entitlements defined for the feature are also removed. This action is not permissible when the status of the feature is active .',
	},
	'features.get': {
		riskLevel: 'read',
		description:
			'Retrieve a feature. Retrieve a specific feature using its ID.',
	},
	'features.list': {
		riskLevel: 'read',
		description:
			'List features. Retrieves a list of features meeting all the conditions specified in the filter parameters.',
	},
	'features.listItemEntitlements': {
		riskLevel: 'read',
		description:
			'List item entitlements for a feature. Deprecated This operation is deprecated and no longer maintained. Migrate your integration to List entitlements. Retrieves a list of all the item_entitlement s for the feature specified.',
	},
	'features.reactivate': {
		riskLevel: 'destructive',
		description:
			'Reactivate a feature. Reactivates an archived feature so that new entitlements or subscription entitlements can be created towards the feature. This operation changes the status of the feature to active. ### Prerequisites \\& Constraints * Only a feature in archived status can be reactivated.',
	},
	'features.update': {
		riskLevel: 'write',
		description:
			'Update a feature. Updates a specific feature. Note The list of objects levels[] provided as part of this operation fully replaces the existing list of objects [levels[]](/docs/api/features/feature-object#levels) of the feature.',
	},
	'features.upsertItemEntitlements': {
		riskLevel: 'write',
		description:
			'Upsert or remove item entitlements for a feature. Deprecated This operation is deprecated and no longer maintained. Migrate your integration to Manage entitlements. Warning This operation is not supported when grandfathering is enabled. Upserts or removes a set of item_entitlements for an feature depending on the action specified.',
	},
	'fullExports.getStatus': {
		riskLevel: 'read',
		description:
			'Retrieve full export status. This endpoint retrieves the status of your data export request.',
	},
	'gatewayRequestLogs.get': {
		riskLevel: 'read',
		description:
			'Retrieve a gateway request log. (GET /gateway_request_logs/{gateway-request-log-log-id})',
	},
	'gatewayRequestLogs.list': {
		riskLevel: 'read',
		description: 'List gateway request logs. (GET /gateway_request_logs)',
	},
	'gatewayWebhookLogs.get': {
		riskLevel: 'read',
		description:
			'Retrieve a gateway webhook log. (GET /gateway_webhook_logs/{gateway-webhook-log-webhook-id})',
	},
	'gatewayWebhookLogs.list': {
		riskLevel: 'read',
		description: 'List gateway webhook logs. (GET /gateway_webhook_logs)',
	},
	'gifts.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Cancel a gift. This API allows to cancel gifts. Only gift in 'scheduled' and 'unclaimed' states can be cancelled.",
	},
	'gifts.claim': {
		riskLevel: 'destructive',
		description:
			"Claim a gift. Claiming a gift will move the status to 'claimed'. Only gifts in 'unclaimed' state can be claimed.",
	},
	'gifts.create': {
		riskLevel: 'destructive',
		description:
			'Create a gift. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. Creates a gift subscription with the gifter and receiver. Only plans marked as gift plans can be used to create gift subscription. Product Catalog 1.0 sites only.',
	},
	'gifts.createForItems': {
		riskLevel: 'destructive',
		description:
			'Create a gift subscription for items. Create a gift subscription with items like plans, addons, or charges and gift it to an existing customer.',
	},
	'gifts.get': {
		riskLevel: 'read',
		description:
			"Retrieve a gift. Retrieves a gift subscription. This API accepts the gift 'id' and returns the gift along with the subscription.",
	},
	'gifts.list': {
		riskLevel: 'read',
		description: 'List gifts. Retrieves the list of gifts.',
	},
	'gifts.update': {
		riskLevel: 'destructive',
		description:
			'Update a gift. Updates the attributes of a gift. ### Prerequisites \\& Constraints * The gift must be in the scheduled status.',
	},
	'grantBlocks.list': {
		riskLevel: 'read',
		description:
			'List grant blocks. Returns a list of grant blocks meeting all the conditions specified in the filter parameters below.',
	},
	'hostedPages.acceptQuote': {
		riskLevel: 'write',
		description:
			'Accept a quote. This API generates a hosted page URL for the customer to accept a quote. If the hosted page URL has expired, a new URL will be generated automatically. * Customers with existing subscriptions can generate a quote for new subscriptions.',
	},
	'hostedPages.acknowledge': {
		riskLevel: 'write',
		description:
			'Acknowledge a hosted page. When a hosted page is successfully completed by the user and processed by Chargebee, its state is automatically changed to succeeded . Acknowledging a hosted page confirms that you have moved the customer details from Chargebee into your system and are ready to fulfill it.',
	},
	'hostedPages.checkoutExisting': {
		riskLevel: 'write',
		description:
			'Checkout existing subscription. You can checkout an existing subscription(typically in the trial state) by passing in the plan, quantity and addon details(like Update a Subscription) When the redirect URL is notified of the result, we would advise you to retrieve the subscription and verify the details. Product Catalog 1.0 sites only.',
	},
	'hostedPages.checkoutExistingForItems': {
		riskLevel: 'write',
		description:
			'Create checkout to update a subscription. Create a Chargebee hosted page to accept payment details from a customer and checkout to update the subscription.',
	},
	'hostedPages.checkoutGift': {
		riskLevel: 'write',
		description:
			'Checkout gift subscription. Creates a hosted page for a customer (called the gifter) to gift a subscription to another customer (called the receiver). Product Catalog 1.0 sites only.',
	},
	'hostedPages.checkoutGiftForItems': {
		riskLevel: 'write',
		description:
			'Checkout gift subscription for items. Creates a hosted page for a customer (called the gifter) to gift a subscription to another customer (called the receiver).',
	},
	'hostedPages.checkoutNew': {
		riskLevel: 'write',
		description:
			'Checkout new subscription. Hosted page to accept card details from the subscriber and create a new subscription. This is similar to our server to server API Create a Subscription. When the redirect URL is notified of the result, we would advise you to retrieve the subscription and verify the details. Product Catalog 1.0 sites only.',
	},
	'hostedPages.checkoutNewForItems': {
		riskLevel: 'write',
		description:
			'Create checkout for a new subscription. Create a Chargebee hosted page to accept payment details from a customer and checkout a new subscription.',
	},
	'hostedPages.checkoutOneTime': {
		riskLevel: 'write',
		description:
			'Checkout one-time payments. Create a Chargebee hosted page to accept payment from a customer and checkout non-recurring addons and one-time charges. The following steps describe how best to use this API: 1. Product Catalog 1.0 sites only.',
	},
	'hostedPages.checkoutOneTimeForItems': {
		riskLevel: 'write',
		description:
			'Checkout charge-items and one-time charges. Create a Chargebee hosted page to accept payment details from a customer and checkout charge-items and one-time charges. The following steps describe how best to use this API: 1.',
	},
	'hostedPages.claimGift': {
		riskLevel: 'write',
		description:
			'Claim a gift subscription. This API generates a hosted page URL to claim a gifted subscription.',
	},
	'hostedPages.collectNow': {
		riskLevel: 'destructive',
		description:
			"Collect now. This API generates a hosted page URL to collect due payments for the customer. Open the hosted page in a new browser tab or window using the url from this API's response. Do not embed it in your own iframe.",
	},
	'hostedPages.extendSubscription': {
		riskLevel: 'destructive',
		description:
			'Extend subscription. This API generates a hosted page URL to extend the billing cycle of a subscription. Use one of the following methods to open the hosted page: * In-app modal : Use Chargebee.js openCheckout() to open the hosted page in a modal popup in your website or application.',
	},
	'hostedPages.get': {
		riskLevel: 'read',
		description:
			'Retrieve a hosted page. When you retrieve a hosted page whose status is successful, the content attribute has the following objects based on the type of the hosted page.',
	},
	'hostedPages.list': {
		riskLevel: 'read',
		description:
			'List hosted pages. This API retrieves the list of hosted page resources.',
	},
	'hostedPages.managePaymentSources': {
		riskLevel: 'write',
		description:
			'Manage payment sources. This API generates a hosted page URL to add new or update existing payment sources for the customer. Use one of the following methods to open the hosted page: * In-app modal : Use Chargebee.js openCheckout() to open the hosted page in a modal popup in your website or application.',
	},
	'hostedPages.notifyEvent': {
		riskLevel: 'write',
		description:
			'Notify an event. Use this API to notify Chargebee about important events that occur on your web pages, such as subscription cancellations. An event contains data about affected resources and additional details such as when the change occurred.',
	},
	'hostedPages.preCancel': {
		riskLevel: 'write',
		description:
			'Create a pre-cancel hosted page. Creates a hosted_page resource of type pre_cancel . Route canceling users to this page to provide them a retention experience and start saving revenue.',
	},
	'hostedPages.retrieveAgreementPdf': {
		riskLevel: 'read',
		description:
			'Retrieve direct debit agreement PDF. This is applicable only for Direct Debit via SEPA, Bacs, Bg Autogiro, BECS (for both Australia and New Zealand) and PAD. For Direct Debit, the customer needs to accept an agreement that allows the merchant to debit their bank account.',
	},
	'hostedPages.viewVoucher': {
		riskLevel: 'write',
		description:
			'Create a hosted page to view Boleto vouchers. Creates a hosted_page resource of type, view_voucher . When your end customers choose the Boleto payment method, you can generate a voucher for their pending invoice. Using this API, you can create a voucher_detail hosted page for your customers and email them a link to this hosted page.',
	},
	'inAppSubscriptions.importReceipt': {
		riskLevel: 'destructive',
		description:
			'Import receipt. Verifies an Apple App Store or Google Play Store in-app purchase receipt and imports subscriptions for all historical purchases made by the customer. Tip An in_app_subscription is created for every unique original_transaction_id .',
	},
	'inAppSubscriptions.importSubscription': {
		riskLevel: 'write',
		description:
			'Import subscription without receipt. The Import Subscriptions endpoint is a Chargebee API that allows you to import historic In-App Subscriptions without using a valid Apple App Store receipt. This endpoint is useful if you do not have access to the receipt data which is required for the Import Receipt API.',
	},
	'inAppSubscriptions.processPurchase': {
		riskLevel: 'destructive',
		description:
			'Process purchase command. Verifies an in-app purchase made by your customer and creates a subscription in Chargebee. Note: If App Store or Play Store products have not been imported to Chargebee and this API is invoked, Chargebee will automatically create plans that correspond to the store product IDs.',
	},
	'inAppSubscriptions.retrieveStoreSubscription': {
		riskLevel: 'read',
		description:
			'Retrieve store subscription. This API verifies the application id {in_app_subscription_app_id} and receipt then returns the subscription details associated with the purchase. #### Path Parameter in_app_subscription_app_id required, string The handle is created by Chargebee for your Apple App Store or Google Play Store app.',
	},
	'invoices.addAddonCharge': {
		riskLevel: 'destructive',
		description:
			'Add non-recurring addon to a pending invoice. Product Catalog 1.0 sites only.',
	},
	'invoices.addCharge': {
		riskLevel: 'destructive',
		description:
			'Add one-time charge to a pending invoice. Adds a one-time charge to a pending invoice. A one-time charge is a charge that is added ad hoc to the invoice and does not represent a predefined item price. It appears in the invoice as a line_item of entity_type adhoc.',
	},
	'invoices.addChargeItem': {
		riskLevel: 'destructive',
		description:
			'Add a charge-item to a pending invoice. This endpoint is used when metered billing is enabled and it adds a charge-item price to a pending invoice. To collect the accumulated charges by closing the invoice, call Close a pending invoice.',
	},
	'invoices.applyCredits': {
		riskLevel: 'destructive',
		description:
			"Apply credits for an invoice. Applies a customer's refundable credits to a specified invoice. You can either specify the credit notes to be applied, or let Chargebee apply the available credit notes automatically. ### Prerequisites \\& Constraints * The customer must have refundable credits available.",
	},
	'invoices.applyPaymentScheduleScheme': {
		riskLevel: 'write',
		description:
			'Apply payment schedule scheme to an invoice. Applying a payment schedule scheme to an invoice creates payment schedules, enabling the invoice to be paid in multiple, scheduled payments. Note: The invoice must be in payment_due .',
	},
	'invoices.applyPayments': {
		riskLevel: 'destructive',
		description:
			'Apply payments for an invoice. Applies payment to a single invoice. You can either specify individual payment transactions as parameters, or Chargebee applies any available excess payments for that customer. If you specify individual transactions then any un-applied amount in those transactions will be used.',
	},
	'invoices.charge': {
		riskLevel: 'destructive',
		description:
			'Create invoice for a one-time charge. Generate invoices for a one-time charge using this API. Product Catalog 1.0 sites only.',
	},
	'invoices.chargeAddon': {
		riskLevel: 'destructive',
		description:
			'Create invoice for a non-recurring addon. Generate invoices for a non-recurring addon using this API. Product Catalog 1.0 sites only.',
	},
	'invoices.close': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Close a pending invoice. Invoices for a subscription are created with a pending status when the subscription has create_pending_invoices attribute set to true. This API call finalizes a pending invoice.',
	},
	'invoices.collectPayment': {
		riskLevel: 'destructive',
		description:
			"Collect payment for an invoice. Collects a specified amount of payment for an invoice, via a specified online payment method. #### Offline payments When there is no payment method available, and if you wish to record an offline payment, use the Record an offline payment API instead. Charges the customer's payment method for the invoice.",
	},
	'invoices.create': {
		riskLevel: 'destructive',
		description:
			"Create an invoice. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. Creates a one-off invoice for multiple 'Non Recurring' add-on \\& ad-hoc charges for a customer. Product Catalog 1.0 sites only.",
	},
	'invoices.createForChargeItemsAndCharges': {
		riskLevel: 'destructive',
		description:
			'Create invoice for items and one-time charges. Creates an invoice for charge-items and one-time charges. The item prices must belong to items of type charge. You can optionally override the line item name and description displayed on the invoice for charge-item prices and one-time charges.',
	},
	'invoices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an invoice. Deletes the specified invoice. #### Void the invoice If the invoice was generated incorrectly, void it instead of deleting it. Voiding preserves the audit trail and allows for future reference and compliance without removing the original record.',
	},
	'invoices.deleteLineItems': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete line items. This endpoint is used to delete line items from "Pending" invoice.',
	},
	'invoices.downloadEinvoice': {
		riskLevel: 'read',
		description:
			'Download e-invoice. Download the e-invoice in both XML and PDF formats. The response consists of a download object for each format. The XML format follows the structure as per Peppol BIS Billing v3.0. Note * You can only download e-invoices when their status is success.',
	},
	'invoices.get': {
		riskLevel: 'read',
		description:
			'Retrieve an invoice. Retrieve the invoice for the specified invoice id.',
	},
	'invoices.getPaymentSchedules': {
		riskLevel: 'read',
		description:
			'Retrieve payment schedules for an invoice. This endpoint retrieves payment schedules created for an invoice.',
	},
	'invoices.getPdf': {
		riskLevel: 'read',
		description:
			'Retrieve invoice as PDF. Gets the invoice as PDF. The returned URL is secure and allows download. The URL will expire in 60 minutes. #### Related Tutorial * Check out customer portal tutorial on how to download invoice as PDF.',
	},
	'invoices.import': {
		riskLevel: 'destructive',
		description:
			'Import invoice. Imports an invoice into Chargebee Billing. Use this API to import invoices from your other billing or accounting system into Chargebee Billing. You can import both current-term and historical invoices.',
	},
	'invoices.list': {
		riskLevel: 'read',
		description: 'List invoices. Lists all the Invoices. (GET /invoices)',
	},
	'invoices.listPaymentReferenceNumbers': {
		riskLevel: 'read',
		description:
			'List payment reference numbers. This API endpoint allows users to retrieve the payment reference numbers (PRNs) associated with an invoice. Only one PRN is allowed per payment type. You can use the invoice_id or the payment_reference_number[number] to retrieve the PRN.',
	},
	'invoices.listPaymentVouchers': {
		riskLevel: 'read',
		description:
			'List vouchers for an invoice. Retrieves vouchers for an invoice in reverse chronological order.',
	},
	'invoices.listPayments': {
		riskLevel: 'read',
		description:
			'List payments for an invoice. Retrieves the payments for an invoice with the recent ones on top. This returns all the payment attempts(manual \\& automatic) made for this invoice.',
	},
	'invoices.pauseDunning': {
		riskLevel: 'write',
		description:
			'Pause dunning for invoice. Pause dunning for the specified invoice until expected_payment_date. Chargebee cancels all configured payment collection retry attempts and dunning email notifications for the invoice until expected_payment_date.',
	},
	'invoices.recordPayment': {
		riskLevel: 'destructive',
		description:
			'Record an invoice payment. Records an offline payment for an invoice. Use this API to record payments that you receive outside Chargebee, such as bank transfers or checks, so that you can reconcile them against invoices. ### Prerequisites \\& Constraints * The invoice status must be payment_due, posted, or not_paid.',
	},
	'invoices.recordRefund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Record refund for an invoice. Record a full or partial offline refund for an invoice. Use this API to record refunds processed outside Chargebee (for example, directly through a payment gateway or via offline methods such as bank transfers or checks) so you can reconcile them in Chargebee.',
	},
	'invoices.recordTaxWithheld': {
		riskLevel: 'write',
		description:
			'Record tax withheld for an invoice. Records tax_withheld by the customer against the invoice specified. This operation is allowed only when all of the following conditions are true: * Tax Amount Withheld is enabled. * The invoice does not have a linked_taxes_withheld record associated with it already.',
	},
	'invoices.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refund an invoice. Refunds online payments or online refundable credit notes applied to an invoice. If multiple transactions or credit note allocations are associated with the invoice, the refund can be processed only for one transaction or allocation at a time.',
	},
	'invoices.removeCreditNote': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove credit note from an invoice. Removes the specified adjustment credit or refundable credit allocation applied to the invoice. ### Prerequisites \\& Constraints * The invoice status must not be voided or pending. * The credit note status must not be voided. * The credit note type must be adjustment or refundable.',
	},
	'invoices.removePayment': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Remove payment from an invoice. Removes a payment transaction that was applied to an invoice and moves the amount to the customer's excess payments balance. This API does not refund the payment to the customer. To refund a payment transaction, use one of the following APIs: * For online payments, use Refund a payment.",
	},
	'invoices.removePaymentScheduleScheme': {
		riskLevel: 'write',
		description:
			'Remove payment schedule scheme from an invoice. Cancels remaining unpaid schedule entries on an invoice. Use this when a payment schedule was applied in error or is no longer required. Unpaid schedule entries are set to voided; paid entries and their payments are preserved.',
	},
	'invoices.removeTaxWithheld': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove tax withheld for an invoice. Removes a linked_taxes_withheld record from the invoice specified. This operation is allowed only when all of the following conditions are true: * invoice.status is one of the following: payment_due, not_paid, or posted. * There are no adjustment_credit_notes associated with the invoice.',
	},
	'invoices.resendEinvoice': {
		riskLevel: 'destructive',
		description:
			'Resend failed einvoice in invoices. Resend failed einvoice of an invoice to the customer using this API.',
	},
	'invoices.resumeDunning': {
		riskLevel: 'write',
		description:
			'Resume dunning for invoice. Immediately resumes dunning for the specified invoice. * If the current time is within the dunning period for the invoice, Chargebee resumes any dunning retries and email notifications that remain after the pause period, and not attempt the retries or notifications that were canceled during the…',
	},
	'invoices.sendEinvoice': {
		riskLevel: 'destructive',
		description:
			'Send an einvoice for invoices. This endpoint is used to send an e-invoice for invoice. To support cases like TDS and invoice edits, we need to stop auto e-invoice sending and be able to send e-invoices manually. This endpoint schedules e-invoices manually.',
	},
	'invoices.sendEmail': {
		riskLevel: 'destructive',
		description:
			"Send Invoice Email. Sends the invoice email to the customer using the site's published Send Invoice Email Engage notification template. Use this operation to resend or manually trigger the invoice email for a customer outside the normal notification schedule. Async-only This operation is asynchronous only.",
	},
	'invoices.stopDunning': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Stop dunning for invoice. This API is used to stop dunning for "Payment Due" invoices that have been enabled for Auto Collection. When dunning is stopped, the status of the invoice will be changed to "Not Paid".',
	},
	'invoices.syncUsages': {
		riskLevel: 'destructive',
		description:
			'Sync usages. Updates the quantity for metered line_items of an invoice to reflect the latest usage data. Note: This operation is done automatically while closing the invoice.',
	},
	'invoices.updateDetails': {
		riskLevel: 'write',
		description:
			'Update invoice details. This API allows you to update the invoice Billing/Shipping address, VAT, custom fields, and PO number. During this operation if Billing Info (Billing Address, vat_number), Shipping info and PO number are not already present in the system the data will be added.',
	},
	'invoices.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Void an invoice. Voids the specified invoice. Use this operation when: * The invoice was generated in error. * The invoice amount is incorrect. * The customer requests a change to the invoice. * The customer cancels the order.',
	},
	'invoices.voidBeforeCapture': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Void authorizations before capture. Voids all outstanding scheduled-capture authorizations linked to an invoice before capture, then voids or writes off the invoice. Use this operation when an invoice has an outstanding delayed-capture authorization that must be released before the invoice is either voided or written off.',
	},
	'invoices.writeOff': {
		riskLevel: 'destructive',
		description:
			'Write off an invoice. Write off the specified invoice. Use this operation to mark invoices as settled when they remain unpaid after multiple attempts to collect payment. #### Reverse a write-off You can reverse the write-off by removing the linked credit note.',
	},
	'itemFamilies.create': {
		riskLevel: 'write',
		description:
			'Create an item family. This endpoint creates an item family for your product line or service.',
	},
	'itemFamilies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an item family. Deletes an item family, marking its status as deleted . This is not allowed if there are active items under the item family. Once deleted, the id and name of the item family can be reused to create a new item family.',
	},
	'itemFamilies.get': {
		riskLevel: 'read',
		description:
			'Retrieve an item family. This endpoint retrieves an item family based on the item family id.',
	},
	'itemFamilies.list': {
		riskLevel: 'read',
		description:
			'List item families. Returns a list of item families satisfying all the conditions specified in the filter parameters below. The list is sorted by date of creation, in descending order.',
	},
	'itemFamilies.update': {
		riskLevel: 'write',
		description:
			'Update an item family. This endpoint updates the name and/or description of the item family.',
	},
	'itemPrices.create': {
		riskLevel: 'write',
		description:
			'Create an item price. This API creates an item price (a price point) for an item.',
	},
	'itemPrices.createDifferentialPrice': {
		riskLevel: 'write',
		description:
			'Create a differential price. for addon item price, addon item price with tiered pricing, or charge item price.',
	},
	'itemPrices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an item price. Deletes an item price, marking its status as deleted. If it is part of a subscription or invoice, the item price status is marked archived instead. Once deleted, the id and name of the item price can be reused to create a new item price.',
	},
	'itemPrices.get': {
		riskLevel: 'read',
		description:
			'Retrieve an item price. This API retrieves a specific item price using the id.',
	},
	'itemPrices.list': {
		riskLevel: 'read',
		description:
			'List item prices. Returns a list of item prices satisfying all the conditions specified in the filter parameters below. The list is sorted by the date of creation in descending order. ### Use Cases ##### Filter by custom fields Note: Custom field filters are turned off by default.',
	},
	'itemPrices.listApplicableItemPrices': {
		riskLevel: 'read',
		description:
			'List applicable item prices for a plan-item price. Returns the set of all applicable addon-item prices for a specific plan-item price. This set consists of all the addon-item prices that can be applied to a subscription having the plan-item price.',
	},
	'itemPrices.listApplicableItems': {
		riskLevel: 'read',
		description:
			'List applicable items for a plan-item price. Returns the set of all applicable addon-items for a specific plan-item price . This set consists of all addon-items whose item prices can be applied to a subscription having the plan-item price in it.',
	},
	'itemPrices.update': {
		riskLevel: 'write',
		description:
			'Update an item price. Updates an item price with the changes specified. Unspecified item price attributes are not modified.',
	},
	'items.create': {
		riskLevel: 'write',
		description: 'Create an item. Creates a new item. (POST /items)',
	},
	'items.createAttachedItem': {
		riskLevel: 'write',
		description:
			'Create an attached item. Creates an attached addon or a charge item for a plan.',
	},
	'items.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an item. Deletes an item, marking its status as deleted. This is not allowed if there are active or archived item prices under the item. Once deleted, the id and name of the item can be reused.',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Retrieve an item. resource. (GET /items/{item-id})',
	},
	'items.list': {
		riskLevel: 'read',
		description:
			'List items. Returns a list of items satisfying all the conditions specified in the filter parameters below. The list is sorted by date of creation, in descending order. ### Use Cases ##### Filter by custom fields Note: Custom field filters are turned off by default.',
	},
	'items.listAttachedItems': {
		riskLevel: 'read',
		description:
			'List attached items. Returns a list of attached items satisfying all the conditions specified in the filter parameters below. The list is sorted by the date of creation in descending order (latest first).',
	},
	'items.listItemEntitlements': {
		riskLevel: 'read',
		description:
			'List item entitlements for an item. Deprecated This operation is deprecated and no longer maintained. Migrate your integration to List entitlements. Retrieves a list of all the item_entitlements for the item specified.',
	},
	'items.update': {
		riskLevel: 'write',
		description:
			'Update an item. Updates an item with the changes specified. Unspecified item parameters are not modified.',
	},
	'items.upsertItemEntitlements': {
		riskLevel: 'write',
		description:
			'Upsert or remove item entitlements for an item. Deprecated This operation is deprecated and no longer maintained. Migrate your integration to Manage entitlements. Warning This operation is not supported when grandfathering is enabled. Upserts or removes a set of item_entitlements for an item depending on the action specified.',
	},
	'ledgerAccountBalances.list': {
		riskLevel: 'read',
		description:
			'List ledger account balances. Returns a paginated list of real-time credit balance snapshots for a subscription. Each item in the list is a ledger_account_balance object, identified by a unique combination of subscription_id, unit_id, unit_type.',
	},
	'ledgerAccountBalances.updateOverdraftLimit': {
		riskLevel: 'write',
		description:
			'Update the overdraft limit. Updates the overdraft limit for a subscription and credit unit. By default, the overdraft limit for a credit unit is a single, site-wide value applied to every subscription.',
	},
	'ledgerOperations.allocate': {
		riskLevel: 'destructive',
		description:
			"Allocate. The allocate operation allocates credit grants to a subscription's provisioned balance. Behavior * Allocates the specified amount to the subscription's provisioned balance for the given unit_id.",
	},
	'ledgerOperations.authorize': {
		riskLevel: 'destructive',
		description:
			'Authorize. Reserves credit grants at the time of request for later finalization via capture_authorization or release_authorization. Use this operation when the final amount is unknown while a job is in progress, or when multiple concurrent operations or users draw from the same credit pool.',
	},
	'ledgerOperations.capture': {
		riskLevel: 'destructive',
		description:
			'Capture. The capture operation immediately consumes credits for a completed action. Behavior * Credits are directly moved from usable → consumed. * No intermediate hold or reservation is created.',
	},
	'ledgerOperations.captureAuthorization': {
		riskLevel: 'destructive',
		description:
			'Capture authorization. The capture_authorization operation finalizes a previously created hold by converting reserved credits into consumed credits. API Behavior * Completes an earlier authorize operation. * Moves credits from held (reserved) → consumed (debited).',
	},
	'ledgerOperations.get': {
		riskLevel: 'read',
		description:
			'Retrieve ledger operation. Returns the details of a specific ledger operation by its unique identifier.',
	},
	'ledgerOperations.list': {
		riskLevel: 'read',
		description:
			'List ledger operations. Returns a list of operations meeting all the conditions specified in the filter parameters below.',
	},
	'ledgerOperations.releaseAuthorization': {
		riskLevel: 'write',
		description:
			'Release authorization. The release_authorization operation releases previously held credits back to the usable balance, effectively canceling an existing authorization (hold). API Behavior * Reverses an earlier authorize operation. * Moves credits from held (reserved) → usable balance.',
	},
	'meteredFeatures.archive': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Archive a metered feature. Archives a metered feature and its associated meter. The sample responses show metered features with and without group-by attributes. ### Prerequisites \\& Constraints * The metered feature must be active.',
	},
	'meteredFeatures.create': {
		riskLevel: 'write',
		description:
			'Create a metered feature. Creates a metered feature. Use query to define how Chargebee measures usage for the metered feature. The result is a single aggregate across all matching usage events. To report grouped usage, include attributes in a GROUP BY clause. Each distinct set of values forms one usage group.',
	},
	'meteredFeatures.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a metered feature. Permanently deletes a metered feature. The sample responses show metered features with and without group-by attributes. ### Prerequisites \\& Constraints * The metered feature status must not be active.',
	},
	'meteredFeatures.reactivate': {
		riskLevel: 'destructive',
		description:
			'Reactivate a metered feature. Restores a previously archived metered feature status back to active. The sample responses show metered features with and without group-by attributes. ### Prerequisites \\& Constraints * The metered feature status must be archived.',
	},
	'meters.list': {
		riskLevel: 'read',
		description:
			'List all available meters. Retrieves the list of meters configured for the site. The sample responses show meters with and without group-by attributes.',
	},
	'nonSubscriptions.oneTimePurchase': {
		riskLevel: 'destructive',
		description:
			'One time purchase. This API is used to sync consumable, non-consumable, and non-renewing product payments in Chargebee.',
	},
	'offerEvents.create': {
		riskLevel: 'write',
		description:
			'Create an offer event. The Create Offer Event API records user interactions with an offer for tracking and analytics purposes. Use this API to log user-triggered engagement events such as: * viewed - when an offer is displayed to the user. * dismissed - when the user closes or ignores the offer.',
	},
	'offerFulfillments.create': {
		riskLevel: 'write',
		description:
			"Create an offer fulfillment. This API notifies that a user has accepted an offer, logs an accepted event immediately for reporting, and triggers a backend processing depending on the offer's processing_type. You can call this API when a user accepts an offer (e.g., the user clicked Accept Offer or a similar confirmation).",
	},
	'offerFulfillments.get': {
		riskLevel: 'read',
		description:
			'Retrieve an offer fulfillment. This API is used to retrieve the fulfillment record. This is typically used to check the latest status of an asynchronous offer fulfillment. You can use this after creating an offer fulfillment (billing update or checkout).',
	},
	'offerFulfillments.update': {
		riskLevel: 'write',
		description:
			'Update an offer fulfillment. This API is used to update the status of offer fulfillment for the processing types url_redirect, webhook and email as Chargebee cannot automatically fulfill these offers. If status = failed, you must include a failure_reason to explain why the fulfillment did not succeed.',
	},
	'omnichannelOneTimeOrders.get': {
		riskLevel: 'read',
		description:
			'Retrieve a one time order. Retrieves an omnichannel_one_time_order by its Chargebee id. You can obtain the ID from: * A successful record a purchase response (linked_omnichannel_one_time_orders) * The list omnichannel one-time orders API * Omnichannel webhook events such as omnichannel_one_time_order_created.',
	},
	'omnichannelOneTimeOrders.list': {
		riskLevel: 'read',
		description:
			'List omnichannel one time orders. Returns a list of omnichannel_one_time_order objects. Filter by customer_id or source (apple_app_store / google_play_store). Use this together with record a purchase and webhook events such as omnichannel_one_time_order_created to reconcile one-time purchases.',
	},
	'omnichannelSubscriptionItems.listScheduledChanges': {
		riskLevel: 'read',
		description:
			'List scheduled changes for omnichannel subscription item. Returns scheduled changes for the specified omnichannel_subscription_item. Scheduled changes are created when the store will apply a product or pause change later (typically at term end), for example: * Apple App Store : Scheduled downgrade within the same subscription group.',
	},
	'omnichannelSubscriptions.get': {
		riskLevel: 'read',
		description:
			'Retrieve an omnichannel subscription. Retrieves an omnichannel_subscription by its Chargebee id. You can obtain the ID from: * A successful record a purchase response (linked_omnichannel_subscriptions) * The list omnichannel subscriptions API * Omnichannel webhook events such as omnichannel_subscription_created.',
	},
	'omnichannelSubscriptions.list': {
		riskLevel: 'read',
		description:
			'List omnichannel subscriptions. Returns a list of omnichannel_subscription objects. Filter by Chargebee id, store-native id_at_source, customer_id, source, purchase/update timestamps, or nested item attributes. Apple App Store : Filter id_at_source with the original purchase Transaction ID.',
	},
	'omnichannelSubscriptions.listTransactions': {
		riskLevel: 'read',
		description:
			"List omnichannel transactions of an omnichannel subscription. Returns the list of omnichannel_transaction objects associated with the specified omnichannel_subscription, including the initial purchase and subsequent renewals when available. Apple App Store : Each transaction's id_at_source is the App Store Transaction ID .",
	},
	'omnichannelSubscriptions.move': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Move an omnichannel subscription. Moves an omnichannel_subscription to another customer in Chargebee. ### Prerequisites * The target customer must already exist in Chargebee (or be creatable via your usual customer APIs before calling this operation). * The omnichannel subscription must already be recorded in Chargebee.',
	},
	'orders.assignOrderNumber': {
		riskLevel: 'write',
		description:
			'Assign order number. Assigns order number to the order based on the settings, if not already assigned.',
	},
	'orders.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel an order. Cancel order and create a refundable credit note for the order.',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create an order. #### Deprecated Chargebee no longer supports this endpoint, see here for more information. Contact Support for additional assistance or if you have concerns about this update.',
	},
	'orders.createRefundableCreditNote': {
		riskLevel: 'write',
		description:
			'Create a refundable credit note. This API is used to create a refundable credit note for the order.',
	},
	'orders.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an imported order. Deletes only Imported Order .Delete does not happen if the order was refunded. It goes through if order refund was initiated and is in "refund_due" state.',
	},
	'orders.get': {
		riskLevel: 'read',
		description:
			'Retrieve an order. Retrieves an order corresponding to the order id passed.',
	},
	'orders.import': {
		riskLevel: 'write',
		description:
			'Import an order. for an invoice with one or more line items. The import order bulk operation is to be applied on an imported invoice.',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List orders. This API is used to retrieve a list of all the available orders.',
	},
	'orders.reopen': {
		riskLevel: 'write',
		description:
			'Reopen a cancelled order. This API is used to re-open a cancelled order.',
	},
	'orders.resend': {
		riskLevel: 'destructive',
		description:
			'Resend an order. Resend an existing order. This will help in resending an existing order in full or partial. Upto 5 resend operations are allowed per . When resent fully, the original order is canceled.',
	},
	'orders.update': {
		riskLevel: 'write',
		description:
			'Update an order. Updates an order. If the status of an order is changed while updating the order, the status_update_at attribute is set with the current time.',
	},
	'organizationDetails.create': {
		riskLevel: 'write',
		description: 'Update organization details. (POST /organization_details)',
	},
	'organizationDetails.get': {
		riskLevel: 'read',
		description:
			'Retrieve organization details. (GET /organization_details/{organization-detail-id})',
	},
	'organizationDetails.list': {
		riskLevel: 'read',
		description: 'List organization details. (GET /organization_details)',
	},
	'paymentIntents.create': {
		riskLevel: 'write',
		description:
			'Create a payment intent. Creates a PaymentIntent object. This is to be used with Chargebee.js API to complete the 3DS flow for new or stored cards. While creating, specify the appropriate gateway account and amount. Exact amount can be estimated using our Estimate API.',
	},
	'paymentIntents.get': {
		riskLevel: 'read',
		description:
			'Retrieve a payment intent. Retrieves the PaymentIntent resource.',
	},
	'paymentIntents.update': {
		riskLevel: 'write',
		description:
			'Update a payment intent. Updating properties on a PaymentIntent object. All the subsequent 3DS transaction attempts will have the updated values.',
	},
	'paymentScheduleSchemes.create': {
		riskLevel: 'write',
		description:
			'Create a payment schedule scheme. Creates a payment schedule scheme. After creating a payment schedule scheme, you can use it to generate payment schedules for multiple invoices.',
	},
	'paymentScheduleSchemes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a payment schedule scheme. This endpoint deletes a payment schedules created for an invoice.',
	},
	'paymentScheduleSchemes.get': {
		riskLevel: 'read',
		description:
			'Retrieve a payment schedule scheme. This endpoint retrieves an existing payment schedule.',
	},
	'paymentScheduleSchemes.list': {
		riskLevel: 'read',
		description:
			'List payment schedule schemes. Returns a list of payment schedule schemes that match all the specified filter conditions. The list is sorted by id in descending order. Use limit and offset to paginate through the results.',
	},
	'paymentSchedules.list': {
		riskLevel: 'read',
		description:
			'List payment schedules. Returns a list of payment schedules that match all the specified filter conditions. The list is sorted by updated_at in descending order. Use limit and offset to paginate through the results. Use invoice_id to restrict results to one or more invoices.',
	},
	'paymentSources.createBankAccount': {
		riskLevel: 'write',
		description:
			'Create a bank account payment source. This API adds a Direct Debit payment source for a customer. The bank account details collected from your customer are passed as input to this API. #### Automated Clearing House (ACH) Network ACH is an electronic network for passing financial transactions in the US.',
	},
	'paymentSources.createCard': {
		riskLevel: 'write',
		description:
			'Create a card payment source. Storing card after successful 3DS completion is not supported in this API. Use create using Payment Intent API under Payment source to store the card after successful 3DS flow completion.',
	},
	'paymentSources.createUsingPaymentIntent': {
		riskLevel: 'write',
		description:
			'Create using payment intent. Used to attach the card to the customer after 3DS completion. Learn more on the 3DS implementation via Chargebee APIs.',
	},
	'paymentSources.createUsingPermanentToken': {
		riskLevel: 'write',
		description:
			'Create using permanent token. Creates a payment source for a customer using a permanent token obtained from the payment gateway. Use this API to add a payment method that has already been vaulted in your gateway account. The permanent token enables Chargebee to securely link the payment method to the customer.',
	},
	'paymentSources.createUsingTempToken': {
		riskLevel: 'write',
		description:
			'Create using gateway temporary token. This API offers an alternative way to create a payment source using a single-use gateway temporary token, which is generally provided by your payment gateway. In the case of Stripe, this temporary token is generated according to the instruction detailed in Stripe documentation.',
	},
	'paymentSources.createUsingToken': {
		riskLevel: 'write',
		description:
			'Create using Chargebee token. Storing card after successful 3DS completion is not supported in this API. Use create using Payment Intent API under Payment source to store the card after successful 3DS flow completion.',
	},
	'paymentSources.createVoucherPaymentSource': {
		riskLevel: 'write',
		description: 'Create a voucher payment method. for the payment source.',
	},
	'paymentSources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a payment source. Deletes a payment source. Once the payment source is deleted, if * Deleted payment source is Primary, and Backup is available * The Backup payment source will become the Primary payment source.',
	},
	'paymentSources.deleteLocal': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Local delete a payment source. Delete a payment source reference from a Chargebee customer without deleting or altering payment source data stored at the payment gateway. ### Impacts Payment Source Sets deleted = true on the specified payment_source and detaches it from the customer.',
	},
	'paymentSources.export': {
		riskLevel: 'write',
		description:
			"Export payment source. Copies this payment source information to the gateway specified in the API. This is useful if you want to port your customer's card details into another gateway. This operation does not support copying of cards from Stripe and Braintree gateways.",
	},
	'paymentSources.get': {
		riskLevel: 'read',
		description:
			'Retrieve a payment source. Retrieves the payment source identified by the unique identifier.',
	},
	'paymentSources.list': {
		riskLevel: 'read',
		description: 'List payment sources. Lists all the payment sources.',
	},
	'paymentSources.listGatewayPaymentMethodTokens': {
		riskLevel: 'read',
		description:
			'List Gateway Payment Method Tokens For A Payment Source. Lists gateway payment method token mappings stored for this payment source. A payment source can have multiple gateway tokens when vaulting and backup gateway merchant-initiated transactions (MIT) are enabled.',
	},
	'paymentSources.switchGatewayAccount': {
		riskLevel: 'write',
		description:
			'Switch gateway account. Moves a card payment source from one gateway account to another.',
	},
	'paymentSources.updateBankAccount': {
		riskLevel: 'write',
		description:
			'Update a bank account payment source. This API is used to update the payment source details of a customer. Information related to bank account payment source such as email, first name, and last name can be updated. * For GoCardless, Chargebee supports (ACH,BACS,SEPA,AUTOGIRO,BECS,BECS_NZ,PAD).',
	},
	'paymentSources.updateCard': {
		riskLevel: 'write',
		description:
			'Update a card payment source. Merchants look to update card details when: * The billing address of a customer has changed. In such a case, modify the billing address in the Chargebee and the payment gateway. * The expiration date of the card has been extended by the bank.',
	},
	'paymentSources.verifyBankAccount': {
		riskLevel: 'write',
		description:
			'Verify bank account payment source. This API can be used to verify bank accounts which have been added as payment source. This is applicable for Stripe ACH with micro-deposit mode bank accounts only. Stripe handles verification in two ways - via Plaid, and micro-deposit.',
	},
	'paymentVouchers.create': {
		riskLevel: 'write',
		description:
			'Create a voucher for the customer to initiate payment. Creates a voucher type payment source. If you create this voucher type payment source using customer details, like tax ID, you can then generate a voucher with that payment source.',
	},
	'paymentVouchers.get': {
		riskLevel: 'read',
		description:
			'Retrieve voucher data. Retrieves a voucher using the unique payment_voucher_id .',
	},
	'pc2MigrationItemFamilies.create': {
		riskLevel: 'write',
		description:
			'Create a pc2_migration_item_family. (POST /pc2_migration_item_families)',
	},
	'pc2MigrationItemFamilies.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete draft family. (POST /pc2_migration_item_families/{pc2-migration-item-family-id}/delete)',
	},
	'pc2MigrationItemFamilies.get': {
		riskLevel: 'read',
		description:
			'Retrieve a pc2 migration item family. (GET /pc2_migration_item_families/{pc2-migration-item-family-id})',
	},
	'pc2MigrationItemFamilies.list': {
		riskLevel: 'read',
		description:
			'List pc2 migration item families. (GET /pc2_migration_item_families)',
	},
	'pc2MigrationItemFamilies.update': {
		riskLevel: 'write',
		description:
			'Update a pc2_migration_item_family. (POST /pc2_migration_item_families/{pc2-migration-item-family-id})',
	},
	'pc2MigrationItemPrices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete draft item price. (POST /pc2_migration_item_prices/{pc2-migration-item-price-id}/delete)',
	},
	'pc2MigrationItemPrices.get': {
		riskLevel: 'read',
		description:
			'Retrieve a pc2 migration item price. (GET /pc2_migration_item_prices/{pc2-migration-item-price-id})',
	},
	'pc2MigrationItemPrices.list': {
		riskLevel: 'read',
		description:
			'List pc2 migration item prices. (GET /pc2_migration_item_prices)',
	},
	'pc2MigrationItemPrices.update': {
		riskLevel: 'write',
		description:
			'Update a pc2_migration_item_price. (POST /pc2_migration_item_prices/{pc2-migration-item-price-id})',
	},
	'pc2MigrationItems.create': {
		riskLevel: 'write',
		description: 'Create a pc2_migration_item. (POST /pc2_migration_items)',
	},
	'pc2MigrationItems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete draft item. (POST /pc2_migration_items/{pc2-migration-item-id}/delete)',
	},
	'pc2MigrationItems.get': {
		riskLevel: 'read',
		description:
			'Retrieve a pc2 migration item. (GET /pc2_migration_items/{pc2-migration-item-id})',
	},
	'pc2MigrationItems.list': {
		riskLevel: 'read',
		description: 'List pc2 migration items. (GET /pc2_migration_items)',
	},
	'pc2MigrationItems.listApplicableItems': {
		riskLevel: 'read',
		description:
			'Applicable_items a pc2_migration_item. (GET /pc2_migration_items/applicable_items)',
	},
	'pc2MigrationItems.update': {
		riskLevel: 'write',
		description:
			'Update a pc2_migration_item. (POST /pc2_migration_items/{pc2-migration-item-id})',
	},
	'pc2Migrations.contactSupport': {
		riskLevel: 'write',
		description:
			'Contact_support a pc2_migration. (POST /pc2_migrations/{pc2-migration-id}/contact_support)',
	},
	'pc2Migrations.create': {
		riskLevel: 'write',
		description: 'Create a pc2_migration. (POST /pc2_migrations)',
	},
	'pc2Migrations.get': {
		riskLevel: 'read',
		description:
			'Retrieve a pc2 migration. (GET /pc2_migrations/{pc2-migration-id})',
	},
	'pc2Migrations.initiate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Initiate a pc2_migration. (POST /pc2_migrations/{pc2-migration-id}/initiate)',
	},
	'personalizedOffers.create': {
		riskLevel: 'write',
		description:
			'List personalized offers. This API is used to retrieve a list of personalized offer(s) for a customer based on the context (such as customer or subscription details and end-user attributes). This allows you to retrieve any active offers targeted to the user.',
	},
	'plans.copy': {
		riskLevel: 'write',
		description:
			'Copy a plan. Creates a plan in this site by copying its configurations from another site. Copying of archived plans is not supported. Note: The attribute *tax_profile_id* is not copied. In effect, if the plan is taxable, it will be mapped to the *Primary* tax profile. Product Catalog 1.0 sites only.',
	},
	'plans.create': {
		riskLevel: 'write',
		description:
			'Create a plan. This endpoint creates a new plan based on the plan Id and plan name. Product Catalog 1.0 sites only.',
	},
	'plans.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a plan. Deletes or archives a plan. This endpoint behaves differently based on the scenarios listed below: * When the plan has subscriptions/invoices linked, it is not deleted. Instead, it is moved to the archived state. Subscriptions already on it continue to renew. Product Catalog 1.0 sites only.',
	},
	'plans.get': {
		riskLevel: 'read',
		description:
			'Retrieve a plan. This endpoint retrieves a specific plan using the plan ID. Product Catalog 1.0 sites only.',
	},
	'plans.list': {
		riskLevel: 'read',
		description:
			'List plans. This API fetches all the active and archived plans. If the limit parameter is not set, it will return upto 10 plans. Product Catalog 1.0 sites only.',
	},
	'plans.unarchive': {
		riskLevel: 'write',
		description:
			'Unarchive a plan. This endpoint unarchives a specific plan which was archived earlier. Product Catalog 1.0 sites only.',
	},
	'plans.update': {
		riskLevel: 'write',
		description:
			'Update a plan. When updating plans that are already linked to an invoice or a subscription, you can only update the following parameters: * name * invoice_name * setup_cost * price * trial_period * trial_period_unit * redirect_url * enabled_in_hosted_pages * meta_data. Product Catalog 1.0 sites only.',
	},
	'portalSessions.activate': {
		riskLevel: 'write',
		description:
			'Activate a portal session. When an user is sent back to your return URL with session details, you should validate that information by calling this API. The details passed to the return_url should be sent as below: * auth_session_id - this should be sent as part of the endpoint.',
	},
	'portalSessions.create': {
		riskLevel: 'write',
		description:
			'Create a portal session. Creates a portal session for a customer. The session resource in the response contains the access URL. Forward the customer to that access URL. If you would like to logout the customer later via API call, you need to store the id of the portal session resource returned by this API.',
	},
	'portalSessions.get': {
		riskLevel: 'read',
		description:
			'Retrieve a portal session. This API retrieves a portal session using portal_session_id as a path parameter.',
	},
	'portalSessions.logout': {
		riskLevel: 'write',
		description:
			'Logout a portal session. Logs out the portal session. Typically this should be called when customers logout of your application. If this API is called for a Portal Session that currently is in : * "created" status, the session status will be marked as "logged_out" and the access URL will become invalid.',
	},
	'priceRamps.create': {
		riskLevel: 'write',
		description:
			"Create a price ramp. Creates a price ramp for an item price. Use this operation to schedule how the item price changes across a subscription's billing cycles by defining an ordered set of ramp_intervals.",
	},
	'priceRamps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Delete a price ramp. Deletes a price ramp. Its status is set to deleted and the linked item price's price_ramp_id is cleared, so new subscriptions no longer inherit the ramp and a new ramp can be created for the item price. Subscriptions that already captured the ramp keep that schedule.",
	},
	'priceRamps.get': {
		riskLevel: 'read',
		description:
			'Retrieve a price ramp. Retrieves a price ramp using its unique ID, including its status and the ordered list of ramp_intervals. ### Prerequisites \\& Constraints * Price Ramps must be enabled for the site. Contact Chargebee Support to enable them. Until they are enabled, this operation returns API_RESTRICTED.',
	},
	'priceRamps.list': {
		riskLevel: 'read',
		description:
			'List price ramps. Retrieves a list of price ramps for your site. You can filter the results by attributes such as id, item_price_id, status, and updated_at, and sort them using sort_by. Only active and archived price ramps are returned by this operation. deleted price ramps are not listed.',
	},
	'priceRamps.update': {
		riskLevel: 'write',
		description:
			'Update a price ramp. Updates a price ramp. You can either change its status (to activate or archive it) or replace its ramp_intervals. These two changes are mutually exclusive within a single request. When ramp_intervals is provided, the existing intervals are replaced in full with the new ordered set.',
	},
	'priceVariants.create': {
		riskLevel: 'write',
		description:
			'Create a price variant. This endpoint allows the creation of a new price variant that can be attached to item prices.',
	},
	'priceVariants.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a price variant. Deletes the price variant. This is not allowed if price variant is attached to any item price. Once deleted, the id and name of the price variant can be reused.',
	},
	'priceVariants.get': {
		riskLevel: 'read',
		description:
			'Retrieve a price variant. This endpoint retrieves the details of a specific price variant using its unique identifier.',
	},
	'priceVariants.list': {
		riskLevel: 'read',
		description:
			'List price variants. This endpoint is used to retrieve a list of price variants.',
	},
	'priceVariants.update': {
		riskLevel: 'write',
		description:
			'Update a price variant. This endpoint modifies the details of an existing price variant.',
	},
	'pricingPageSessions.createForExistingSubscription': {
		riskLevel: 'write',
		description:
			"Create pricing page for existing subscription. This endpoint streamlines the generation of a pricing page session to enable subscription upgrade , and downgrade workflows using Chargebee's hosted pricing pages (Atomic Pricing ). By providing a subscription ID as a parameter, you will obtain a hosted pricing page session URL.",
	},
	'pricingPageSessions.createForNewSubscription': {
		riskLevel: 'write',
		description:
			"Create pricing page for new subscription. This endpoint streamlines the generation of a pricing page session to enable new subscription creation workflows using Chargebee's hosted pricing pages (Atomic Pricing ). By providing a subscription ID and/or customer ID as a parameter, you'll obtain a pricing page session URL.",
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product. This API creates a new product.',
	},
	'products.createVariant': {
		riskLevel: 'write',
		description:
			'Create a product variant. This API is used for creating a new product variant. The following table will help you to understand the state of the variant status after passing status value during variant creation. * Parameter Value column holds possible inputs to the variant.status.',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a product. This API deletes a product and changes the delete attribute value to true . Deletion of a product is not allowed if there are active or archived variants under the product or if there are items mapped to the product. Once deleted, the name of the product can be reused.',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Retrieve a product. using product_id . (GET /products/{product-id})',
	},
	'products.list': {
		riskLevel: 'read',
		description:
			'List products. This API retrieves the list of products that are active or inactive . Use include_deleted parameter to include deleted products with active and inactive products.',
	},
	'products.listVariants': {
		riskLevel: 'read',
		description:
			'List product variants. This API retrieves the list of product variants.',
	},
	'products.update': {
		riskLevel: 'write',
		description:
			'Update a product. This API allows you to update specific product details. The following table will help you to understand the status of the mapped item and item_price after passing product status value during product updation.',
	},
	'products.updateOptions': {
		riskLevel: 'write',
		description:
			'Add remove or update options for the product. This API allows you to add, remove, or update product options.',
	},
	'promotionalCredits.add': {
		riskLevel: 'write',
		description:
			"Add promotional credits. This API call can be used to add promotional credits to a customer. Learn more about Promotional Credits. For example, if a customer has credits of $10, if you pass the amount as $10, then the customer's credit balance would become $20.",
	},
	'promotionalCredits.deduct': {
		riskLevel: 'destructive',
		description:
			"Deduct promotional credits. This API call can be used to deduct promotional credits for a customer. Learn more about Promotional Credits. For example, if a customer has a credit balance of $20, if you pass the amount as $5, then the customer's credit balance would become $15.",
	},
	'promotionalCredits.get': {
		riskLevel: 'read',
		description:
			'Retrieve a promotional credit. This endpoint retrieves the promotional credit based on the promotional credit id.',
	},
	'promotionalCredits.list': {
		riskLevel: 'read',
		description:
			'List promotional credits. This endpoint lists the promotional credits set for a customer.',
	},
	'promotionalCredits.set': {
		riskLevel: 'write',
		description:
			'Set promotional credits. This API call can be used to set the promotional credits balance of a customer. Learn more about Promotional Credits. For example, * If a customer has a credit balance of $10 and if you would like to set the balance to $100, you could pass the amount as $100.',
	},
	'promotionalGrants.create': {
		riskLevel: 'write',
		description: 'Create Promotional Grant. (POST /promotional_grants)',
	},
	'purchases.create': {
		riskLevel: 'destructive',
		description:
			'Create a purchase. Creates a purchase resource. A purchase can contain one or more of the following: * subscriptions (a subscription resource consists of item prices such that at least one of the item prices belongs to an item of type plan.) * group of one-time charges (aka charge item prices) When you call this API,…',
	},
	'purchases.estimate': {
		riskLevel: 'read',
		description:
			'Estimates for purchase. Returns an estimate for creating a purchase resource. The operation works exactly like Create a purchase, except that only an estimate resource is returned without an actual purchase resource being created.',
	},
	'quotes.convert': {
		riskLevel: 'destructive',
		description:
			'Convert a quote. This API is to convert a quote to an invoice.',
	},
	'quotes.createForChargeItemsAndCharges': {
		riskLevel: 'write',
		description:
			'Create a quote for charges and charge items. Creates a quote using charge-items and one-time charges.',
	},
	'quotes.createForOnetimeCharges': {
		riskLevel: 'write',
		description:
			'Create quote for one-time charges. Creates a quote for one-time charges and non-recurring addons. This is applicable only for one-time payment. Recurring charges are not permitted in this quote; use Create quote for a new subscription or Create quote for updating a subscription instead. Product Catalog 1.0 sites only.',
	},
	'quotes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a quote. using this API. (POST /quotes/{quote-id}/delete)',
	},
	'quotes.editCreateSubscriptionQuote': {
		riskLevel: 'write',
		description:
			'Edit quote for a new subscription. Edits a quote. This endpoint is for quotes that are for new subscriptions. To edit a quote that is for updating a subscription, use Edit quote for updating a subscription. Product Catalog 1.0 sites only.',
	},
	'quotes.editCreateSubscriptionQuoteForItems': {
		riskLevel: 'write',
		description:
			'Edit a quote for subscription creation. Changes the quote produced for creating a new subscription items.',
	},
	'quotes.editForChargeItemsAndCharges': {
		riskLevel: 'write',
		description:
			'Edit a quote for charges and charge items. Changes the quote produced for adding one-time charges and charge items.',
	},
	'quotes.editOneTimeQuote': {
		riskLevel: 'write',
		description:
			'Edit quote for one-time charges. Edits a quote. The quote must be for one-time charges or non-recurring addons. To edit quotes created for subscriptions, use: * ​​Edit quote for new subscription. * Edit quote for updating a subscription. Product Catalog 1.0 sites only.',
	},
	'quotes.editUpdateSubscriptionQuote': {
		riskLevel: 'write',
		description:
			'Edit quote for updating a subscription. Edits a quote. This endpoint is for editing quotes that are for updating a subscription. To edit a quote for a new subscription, use Edit quote for a new subscription. Product Catalog 1.0 sites only.',
	},
	'quotes.editUpdateSubscriptionQuoteForItems': {
		riskLevel: 'write',
		description:
			'Edit a quote for subscription update. Edits a quote for updating a subscription. ### Impacts #### Quote and related resources If the quote is for a scheduled change, then the following resources are updated: * When Ramps are disabled, the quote and the quoted_subscription are updated.',
	},
	'quotes.extendExpiryDate': {
		riskLevel: 'write',
		description:
			'Extend expiry date. Can be used to extend the expiry date of a quote.',
	},
	'quotes.get': {
		riskLevel: 'read',
		description:
			"Retrieve a quote. Retrieves the quotes identified by the 'number' specified in the url.",
	},
	'quotes.getPdf': {
		riskLevel: 'read',
		description:
			'Retrieve a quote as PDF. Retrieves the quote as a PDF. The returned URL is secure, allows download and expires in 60 minutes.',
	},
	'quotes.list': {
		riskLevel: 'read',
		description: 'List quotes. List all quotes. (GET /quotes)',
	},
	'quotes.listEntitlements': {
		riskLevel: 'read',
		description:
			'List Quote Entitlements. Retrieves the list of quote_entitlements for the quote.',
	},
	'quotes.listLineGroups': {
		riskLevel: 'read',
		description:
			'List quote line groups. This API retrieves all the quote line groups and lineitems for a quote.',
	},
	'quotes.updateStatus': {
		riskLevel: 'write',
		description: 'Update quote status. Updates the status of the quote.',
	},
	'quotes.updateSubscriptionQuote': {
		riskLevel: 'write',
		description:
			'Create quote for updating a subscription. Creates a quote for updating a subscription under the customer specified. To send this quote, use "Send Email" quote action in the Chargebee application. Product Catalog 1.0 sites only.',
	},
	'quotes.updateSubscriptionQuoteForItems': {
		riskLevel: 'write',
		description:
			'Create a quote for subscription update. Creates a quote for updating a subscription. Use this endpoint for amendments, and for renewals when Chargebee CPQ is enabled. * Amendment: Changes the subscription within its current term, for example adding items or changing quantities or prices.',
	},
	'ramps.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a subscription ramp. Deletes the specified subscription ramp. However, Chargebee only allows deleting a ramp if it does not conflict with future ramps on the subscription.',
	},
	'ramps.get': {
		riskLevel: 'read',
		description:
			'Retrieve a subscription ramp. Retrieves a specific subscription ramp.',
	},
	'ramps.list': {
		riskLevel: 'read',
		description:
			'List subscription ramps. Lists the subscription ramps that match the criteria provided in the filter parameters. Note By default, the ramps are returned sorted in descending order (latest first) by updated_at.',
	},
	'ramps.update': {
		riskLevel: 'write',
		description:
			"Update a subscription ramp. Updates an existing subscription ramp by replacing its current attribute values with the new parameters provided. When using this API to modify a ramp, make sure to include all the ramp's attributes as you would do during creation of the ramp with the necessary values updated.",
	},
	'recordedPurchases.create': {
		riskLevel: 'write',
		description:
			'Record a purchase. Records an in-app purchase from Apple App Store or Google Play Store in Chargebee. The API starts an asynchronous verification job and returns a recorded_purchase resource. Track progress with status: in_process, completed, failed, or ignored. Handle the synchronous API response first.',
	},
	'recordedPurchases.get': {
		riskLevel: 'read',
		description:
			'Retrieve a recorded purchase. Retrieves a recorded_purchase object using the recorded_purchase.id returned by the Record a Purchase API.',
	},
	'resourceMigrations.getLatest': {
		riskLevel: 'read',
		description:
			'Retrieve latest migration details. Gets the last migration details.',
	},
	'retrySegments.get': {
		riskLevel: 'read',
		description:
			'Retrieve a retry segment. (GET /retry_segments/{retry-segment-id})',
	},
	'rules.get': {
		riskLevel: 'read',
		description: 'Retrieve rule data. (GET /rules/{rule-id})',
	},
	'siteMigrationDetails.list': {
		riskLevel: 'read',
		description:
			'List site migration details. This endpoint lists the site migration details.',
	},
	'sitePcMetaRecords.list': {
		riskLevel: 'read',
		description: 'List site pc meta records. (GET /site_pc_meta_records)',
	},
	'subscriptions.addChargeAtTermEnd': {
		riskLevel: 'destructive',
		description:
			'Add charge at term end. Adds a one time charge to the subscription which will be added to the invoice generated at the end of the current term. If there are any applicable coupons in the subscription, an appropriate discount will be applied. To collect a charge immediately, use this API.',
	},
	'subscriptions.advanceInvoiceEstimate': {
		riskLevel: 'read',
		description:
			'Advance invoice estimate. This API is used to generate an invoice estimate for preview. Estimate details include the number of billing cycles to be invoiced in advance, the number of billing cycles in one interval, advance invoicing schedules, and so on.',
	},
	'subscriptions.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a subscription. Cancelling a subscription will move the subscription from its current state to Cancelled, and will stop all recurring actions. You could schedule the cancellation by passing end_of_term parameter as true . Product Catalog 1.0 sites only.',
	},
	'subscriptions.cancelForItems': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a subscription. Cancels the specified subscription. ### Prerequisites \\& Constraints * The subscription status must not be cancelled or transferred. * If the subscription has a contract term, specify contract_term_cancel_option instead of cancel_option.',
	},
	'subscriptions.cancelSubscriptionEstimate': {
		riskLevel: 'read',
		description:
			"Cancel subscription estimate. Generates an estimate for the 'cancel subscription' operation. This is similar to the Cancel a subscription API, but the subscription will not be cancelled. Only an estimate for this operation is created. In the response, * estimate.subscription_estimate has the subscription details. Product Catalog 1.0 sites only.",
	},
	'subscriptions.cancelSubscriptionForItemsEstimate': {
		riskLevel: 'read',
		description:
			'Cancel subscription for items estimate. Creates an estimate for canceling the specified subscription.',
	},
	'subscriptions.changeTermEnd': {
		riskLevel: 'destructive',
		description:
			"Change term end. Use this endpoint to adjust when a subscription's current term or trial ends without altering the plan or billing frequency. It is helpful when you need to align renewals to a specific calendar date or extend a trial.",
	},
	'subscriptions.changeTermEndEstimate': {
		riskLevel: 'read',
		description:
			"Subscription change term end estimate. Generates an estimate for the 'change term end' operation. This is similar to the Change term end API but the subscription's term end will not be changed, only an estimate for this operation is created. This is applicable only for subscriptions in 'in-trial', 'active' and 'non-renewing' states.",
	},
	'subscriptions.chargeAddonAtTermEnd': {
		riskLevel: 'destructive',
		description:
			'Charge addon at term end. Adds a "non-recurring addon" charge to a subscription which will be added to the invoice generated at the end of the current term. If there are any applicable coupons in the subscription, an appropriate discount will be applied. Product Catalog 1.0 sites only.',
	},
	'subscriptions.chargeFutureRenewals': {
		riskLevel: 'destructive',
		description:
			'Charge future renewals. Creates a single advance invoice or an advance invoicing schedule for a subscription. Use this operation to bill future renewals in advance, enabling customers to prepay for upcoming billing cycles. ### Prerequisites \\& Constraints * The Advance Invoicing feature must be enabled on the site.',
	},
	'subscriptions.create': {
		riskLevel: 'destructive',
		description:
			'Create a subscription. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. Creates a new subscription along with the customer. Product Catalog 1.0 sites only.',
	},
	'subscriptions.createRamp': {
		riskLevel: 'destructive',
		description:
			'Create a subscription ramp. Creates a ramp for a subscription. Note * Subscription status : You cannot create ramps for subscriptions in the paused or cancelled status. * Advance invoice : You cannot create ramps for subscriptions that have an advance invoice schedule.',
	},
	'subscriptions.createUsage': {
		riskLevel: 'destructive',
		description:
			'Advanced Usage-Based Billing For high-scale usage ingestion, use Advanced Usage-Based Billing with the Usage Events API. The Usage Events API supports schemaless event ingestion at scale, including individual events, batch ingestion, and usage file ingestion.',
	},
	'subscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a subscription. Deletes a specified subscription. This operation schedules the subscription resource for deletion, and it is permanently deleted after a few minutes. If you wish to retain the subscription data but stop further renewals, consider canceling or pausing the subscription instead.',
	},
	'subscriptions.deleteUsage': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Advanced Usage-Based Billing For high-scale usage ingestion, use Advanced Usage-Based Billing with the Usage Events API. The Usage Events API supports schemaless event ingestion at scale, including individual events, batch ingestion, and usage file ingestion. Deletes a usage record.',
	},
	'subscriptions.editAdvanceInvoiceSchedule': {
		riskLevel: 'write',
		description:
			'Edit advance invoice schedule. Caution This API will return an error when multi-frequency billing is enabled. Modifies the advance invoicing schedule for a subscription.',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description: 'Retrieve a subscription. Retrieves a subscription.',
	},
	'subscriptions.getAdvanceInvoiceSchedule': {
		riskLevel: 'read',
		description:
			'Retrieve advance invoice. Caution * This API will return an error when multi-frequency billing is enabled. Retrieves the *advance_invoice_schedule* for a subscription. Note that this endpoint is only applicable for *schedule_type = specific_dates* or fixed_intervals.',
	},
	'subscriptions.getScheduledChanges': {
		riskLevel: 'read',
		description: 'Scheduled_changes a subscription_scheduled_change.',
	},
	'subscriptions.getUsage': {
		riskLevel: 'read',
		description:
			'Advanced Usage-Based Billing For high-scale usage ingestion, use Advanced Usage-Based Billing with the Usage Events API. The Usage Events API supports schemaless event ingestion at scale, including individual events, batch ingestion, and usage file ingestion.',
	},
	'subscriptions.getUsageCharges': {
		riskLevel: 'read',
		description:
			"Retrieve usage charges for a subscription. Returns the current, unbilled usage charges for the metered features on a subscription. This endpoint returns usage for each feature's current usage period.",
	},
	'subscriptions.getUsageSummary': {
		riskLevel: 'read',
		description:
			'Retrieve usage summary for a subscription. Retrieves aggregated usage data for a metered feature in a subscription over a specified reporting window.',
	},
	'subscriptions.getWithScheduledChanges': {
		riskLevel: 'read',
		description:
			'Retrieve a subscription with scheduled changes. Note If the ramps feature is enabled and there is more than one ramp on a subscription, this API will return the subscription with the upcoming ramp applied. Retrieves a subscription with the scheduled changes applied.',
	},
	'subscriptions.importContractTerm': {
		riskLevel: 'destructive',
		description:
			'Import contract term. Imports an active or historical contract term for a subscription. Use this operation to import contract terms when migrating subscriptions from another billing system, or to add historical contract term data for existing subscriptions.',
	},
	'subscriptions.importSubscription': {
		riskLevel: 'destructive',
		description:
			'Import a subscription. Imports a subscription into Chargebee. Product Catalog 1.0 sites only.',
	},
	'subscriptions.importUnbilledCharges': {
		riskLevel: 'destructive',
		description:
			'Import unbilled charges. Imports one or more unbilled charges into an existing subscription. Use this operation to add usage-based or other unbilled charges recorded in external systems to the subscription.',
	},
	'subscriptions.list': {
		riskLevel: 'read',
		description:
			'List subscriptions. Returns a list of subscriptions meeting all the conditions specified in the filter parameters below.',
	},
	'subscriptions.listAlertStatuses': {
		riskLevel: 'read',
		description:
			'List alert statuses for a subscription. Returns the runtime state of all alerts for a given subscription. Each entry in the response indicates whether the subscription is within_limit or in_alarm for a specific alert. Use this endpoint to build a subscription-level dashboard showing which thresholds have been breached and when.',
	},
	'subscriptions.listApplicableAlerts': {
		riskLevel: 'read',
		description:
			"List applicable alerts for a subscription. Returns the effective set of alert configurations for a given subscription. This includes global alerts (filtered by the subscription's plan) and any subscription-scoped alerts, giving you a single view of all threshold rules in force.",
	},
	'subscriptions.listContractTerms': {
		riskLevel: 'read',
		description:
			'List contract terms for a subscription. Retrieves a list of contract term resources for the subscription specified in the path. Warning This API will return an error when multi-frequency billing is enabled.',
	},
	'subscriptions.listDiscounts': {
		riskLevel: 'read',
		description:
			'List discounts for a subscription. Retrieves a list of discount resources currently attached to a specific subscription. The list is sorted in descending order based on the created_at timestamp. Note This endpoint does not return coupon or coupon_code resources.',
	},
	'subscriptions.listEntitlementOverrides': {
		riskLevel: 'read',
		description:
			'List entitlement overrides for a subscription. Retrieve the list of entitlement overrides for a subscription.',
	},
	'subscriptions.listEntitlements': {
		riskLevel: 'read',
		description:
			'List subscription entitlements. Retrieves the list of subscription_entitlements for the subscription. Note: The components attribute is not returned for any of the subscription_entitlements. Use the retrieve operation(coming soon) to obtain the components.',
	},
	'subscriptions.move': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Move a subscription. Moves a subscription from one customer to another asynchronously. All related resources such as unbilled_charge, invoice, credit_note, and transaction are also moved to the new customer.',
	},
	'subscriptions.overrideBillingProfile': {
		riskLevel: 'write',
		description:
			"Override billing profile. Assigns the payment source and sets auto collection state for the subscription. When you don't pass any input param for this API, payment source and auto collection for the subscription will be the same as the customer's default settings.",
	},
	'subscriptions.pause': {
		riskLevel: 'destructive',
		description:
			"Pause a subscription. Use this API to pause an active or non-renewing subscription. When a subscription is paused, it does not renew, and Chargebee does not generate renewal invoices for it. This allows you to temporarily suspend a customer's service without canceling the subscription.",
	},
	'subscriptions.pauseSubscriptionEstimate': {
		riskLevel: 'read',
		description:
			'Pause subscription estimate. This API provides an estimate of the details pertaining to the pause_subscription operation. It returns attributes such as pause_date and resume_date. This is similar to the Pause a subscription API with the exception that the subscription is not paused.',
	},
	'subscriptions.reactivate': {
		riskLevel: 'destructive',
		description:
			'Reactivate a subscription. Reactivates a canceled subscription. Use this operation to restore a canceled subscription to an active or in-trial state. #### Extend non-renewing subscriptions To extend the billing cycles of a non_renewing subscription, use the Remove scheduled cancellation API.',
	},
	'subscriptions.regenerateInvoice': {
		riskLevel: 'destructive',
		description:
			'Regenerate an invoice. Use this API to regenerate the current-term invoice for a subscription. The new invoice will contain non-metered charges from the current term and metered charges from the previous term.',
	},
	'subscriptions.regenerateInvoiceEstimate': {
		riskLevel: 'read',
		description:
			'Regenerate invoice estimate. Regenerates the invoice for the current term of the subscription. The subscription must have status as active or non_renewing. This operation is not allowed when any of the following conditions hold true for the subscription: * An invoice exists for the current term and its status is not voided.',
	},
	'subscriptions.removeAdvanceInvoiceSchedule': {
		riskLevel: 'write',
		description:
			'Remove an advance invoice schedule. Caution * This API will return an error when multi-frequency billing is enabled. Deletes an advance invoicing schedule. When *schedule_type = specific_dates*, you also have the option of deleting a part of the schedule.',
	},
	'subscriptions.removeCoupons': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove coupons. Caution If there are scheduled ramps for the subscription, this operation can move the ramps to the draft status when it conflicts with any upcoming ramps. Removes coupons associated with the subscription.',
	},
	'subscriptions.removeScheduledCancellation': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove scheduled cancellation. Removes a scheduled cancellation from a subscription so that it continues billing for the specified number of billing cycles. Use this operation when a customer changes their mind about canceling their subscription.',
	},
	'subscriptions.removeScheduledChanges': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove scheduled changes from a subscription. Removes a scheduled change from a subscription. ##### Review the changes before removing them To review the scheduled subscription change before removing it, call Retrieve with scheduled changes before calling this API to retrieve the subscription resource with the scheduled change applied.',
	},
	'subscriptions.removeScheduledPause': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove scheduled pause. If the subscription is in Active or Non Renewing state and is also scheduled to pause at the end_of_term/specific_date, this API can be used to remove the scheduled pause. Warning This API will return an error when multi-frequency billing is enabled.',
	},
	'subscriptions.removeScheduledResumption': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove scheduled resumption. If the subscription is in Paused state and is scheduled to resume on a specific_date, this API can be used to remove the scheduled resumption. When the scheduled resumption is removed, the subscription will remain Paused. Warning This API will return an error when multi-frequency billing is enabled.',
	},
	'subscriptions.renewalEstimate': {
		riskLevel: 'read',
		description:
			'Subscription renewal estimate. This returns an estimate of the amount that will be charged when the subscription is billed next. The estimate is calculated based on the current recurring items of the subscription - plan, addons, and coupons.',
	},
	'subscriptions.resume': {
		riskLevel: 'destructive',
		description:
			'Resume a subscription. Note: This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. This API is used to resume a paused subscription. On resumption the subscription will be activated and any applicable charges will be initiated.',
	},
	'subscriptions.resumeSubscriptionEstimate': {
		riskLevel: 'read',
		description:
			"Resume subscription estimate. Generates an estimate for the 'resume subscription' operation. This is similar to the Resume a subscription API, but the subscription will not be resumed. Only an estimate for this operation is created. In the response, * estimate.subscription_estimate has the subscription details.",
	},
	'subscriptions.setAvailability': {
		riskLevel: 'write',
		description:
			'Enable or disable subscription entitlements. Enables or disables specific subscription_entitlements for a subscription.',
	},
	'subscriptions.update': {
		riskLevel: 'destructive',
		description:
			'Update a subscription. Note: * This operation optionally supports 3DS verification flow. To achieve the same, create the Payment Intent and pass it as input parameter to this API. Product Catalog 1.0 sites only.',
	},
	'subscriptions.updateForItems': {
		riskLevel: 'destructive',
		description:
			'Update a subscription. Updates a subscription by modifying its item prices, coupons, billing configuration, payment method, and other attributes. Any parameters not provided remain unchanged. The changes can be applied immediately, scheduled for a future date, or even backdated to a past date.',
	},
	'subscriptions.updateScheduledChanges': {
		riskLevel: 'write',
		description: 'Update_scheduled_changes a subscription_scheduled_change.',
	},
	'subscriptions.upsertEntitlementOverrides': {
		riskLevel: 'write',
		description:
			'Upsert or remove entitlement overrides for a subscription. Upserts or removes a set of entitlement_overrides for a subscription depending on the action specified. The API returns the upserted or deleted entitlement_overrides after successfully completing the operation.',
	},
	'timeMachines.get': {
		riskLevel: 'read',
		description:
			"Retrieve a time machine. Retrieves the time machine. Currently only one time machine is available per site and is named 'delorean'.",
	},
	'timeMachines.startAfresh': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Start afresh. Restart the time machine. This will clear the "customer" data like customer details, subscriptions, invoices, transactions. Also a time travel is initiated to travel back to specified genesis time. Note: This API call is asynchronous. Test sites only: deletes all test data on the site and resets the clock.',
	},
	'timeMachines.travelForward': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Travel forward. in time. This operation is asynchronous . You need to check if the "start afresh" operation has completed by checking if the time travel status is successful by retrieving the time machine in a loop with a minimum delay of 3 secs between two retrieve requests. Test sites only: moves the site\'s clock forward and runs every billing event in between.',
	},
	'tokens.createForCard': {
		riskLevel: 'write',
		description:
			'Create a card payment method token. Generate a token that holds card related information.',
	},
	'tokens.createUsingTempToken': {
		riskLevel: 'write',
		description:
			'Create using vault temp token. Generate a token using the one time token created by payment gateways for any specific payment method.',
	},
	'tokens.get': {
		riskLevel: 'read',
		description:
			'Retrieve a token. using token ID. (GET /tokens/{cb-token-id})',
	},
	'transactions.createAuthorization': {
		riskLevel: 'destructive',
		description:
			"Create an authorization payment. Authorizes a specific amount in customer's Credit card, which can be collected within a span of time. Read more on authorization and capture here. * Supported only for Card payments. * Currently supported only for Stripe.",
	},
	'transactions.deleteOfflineTransaction': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an offline transaction. This API deletes an offline transaction. However, to delete an offline transaction all payment allocations associated with the transaction must be removed.',
	},
	'transactions.get': {
		riskLevel: 'read',
		description: 'Retrieve a transaction. identified by its unique id.',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List transactions. Lists all the transactions. Note: For better query performance, we recommend using a date filter (for example, date[after] or date[between]) when listing transactions. If you are already filtering by updated_at, you do not need to also filter by date.',
	},
	'transactions.reconcile': {
		riskLevel: 'write',
		description:
			'Reconcile transaction. Update selected attributes of the transaction resource: status, id_at_gateway, and customer_id. Use this API for reconciliation purposes where the status of a transaction is in needs_attention that can be updated to either success or failure status.',
	},
	'transactions.recordRefund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Record an offline refund. Records a refund made offline. Applicable only for transactions of type = payment.',
	},
	'transactions.refund': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Refund a payment. Refunds an online payment. Applicable only for transactions of type = payment. You can only refund a transaction whose status is success. * Not supported for ach_credit, sepa_credit, cash, check, bank_transfer, other. * Contact Chargebee Support to enable this endpoint.',
	},
	'transactions.void': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Void an authorization transaction. This API voids the specific authorization transaction in order to release the blocked funds from the customer's card. Voiding an already captured or voided transaction is not possible.",
	},
	'unbilledCharges.create': {
		riskLevel: 'destructive',
		description:
			'Create unbilled charges for a subscription. using this API. Product Catalog 1.0 sites only.',
	},
	'unbilledCharges.createForItems': {
		riskLevel: 'destructive',
		description:
			'Create unbilled charges for item subscription. This endpoint creates unbilled charges for a subscription.',
	},
	'unbilledCharges.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an unbilled charge. Use this API to delete an unbilled charge by specifying the id of the charge.',
	},
	'unbilledCharges.invoiceNowEstimate': {
		riskLevel: 'read',
		description:
			'Create an estimate for unbilled charges. This is similar to the "Create an invoice for unbilled charges" API but no invoice will be created, only an estimate for this operation is created. In the estimate response, * estimate.invoice_estimates is an array of estimate.invoice_estimate.',
	},
	'unbilledCharges.invoiceUnbilledCharges': {
		riskLevel: 'destructive',
		description:
			'Create an invoice for unbilled charges. Use this API to bill the unbilled charges. Available Credits and Excess Payments will automatically be applied while creating the invoice.',
	},
	'unbilledCharges.list': {
		riskLevel: 'read',
		description:
			'List unbilled charges. This endpoint lists all the unbilled charges.',
	},
	'usageEvents.create': {
		riskLevel: 'write',
		description:
			'Ingest a usage event. This endpoint ingests a usage event into Chargebee. See also * Limits for Usage-based Billing in Chargebee.',
	},
	'usageFiles.getProcessingStatus': {
		riskLevel: 'read',
		description:
			'Retrieve file processing status. Use this endpoint to get the current status and details of a usage events file.',
	},
	'usageFiles.getUploadUrl': {
		riskLevel: 'write',
		description:
			'Retrieve usage file upload URL. This endpoint returns an upload URL for uploading usage events files, allowing you to upload files in supported formats. The file is processed asynchronously, and its status can be tracked using the retrieve_file_processing_status endpoint.',
	},
	'usages.getPdf': {
		riskLevel: 'read',
		description:
			'Retrieve usages for an invoice as PDF. Advanced Usage-Based Billing For high-scale usage ingestion, use Advanced Usage-Based Billing with the Usage Events API. The Usage Events API supports schemaless event ingestion at scale, including individual events, batch ingestion, and usage file ingestion.',
	},
	'usages.list': {
		riskLevel: 'read',
		description:
			'Advanced Usage-Based Billing For high-scale usage ingestion, use Advanced Usage-Based Billing with the Usage Events API. The Usage Events API supports schemaless event ingestion at scale, including individual events, batch ingestion, and usage file ingestion. Retrieves the list of usages.',
	},
	'variants.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a product variant. This API deletes a product variant and returns the delete attribute value as true . Deletion of a product variant is not allowed if there are active or archived item_price_id under the variant. Once the variant is deleted, the id and name of the product variant can be reused.',
	},
	'variants.get': {
		riskLevel: 'read',
		description:
			'Retrieve a product variant. This API is used to retrieve a product variant using variant_id .',
	},
	'variants.update': {
		riskLevel: 'write',
		description:
			'Update a product variant. This API is used to modify a product variant.',
	},
	'vaultedPaymentMethods.get': {
		riskLevel: 'read',
		description:
			'Retrieve vaulted payment method. (GET /vaulted_payment_methods/{vaulted-payment-method-id})',
	},
	'virtualBankAccounts.create': {
		riskLevel: 'write',
		description:
			"Create a virtual bank account. Creates a virtual bank account for a customer. Email address is mandatory for virtual bank account creation. All notifications related to this virtual bank account will be sent to the email address you specify. Customer's email and virtual bank accounts will always be in sync.",
	},
	'virtualBankAccounts.createUsingPermanentToken': {
		riskLevel: 'write',
		description:
			'Create a virtual bank account using permanent token. Creates a virtual bank account (VBA) for a customer using a permanent token obtained from a payment gateway. Use this operation when you have already created a payment source at the gateway and obtained a permanent token (reference ID) for it.',
	},
	'virtualBankAccounts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a virtual bank account. Deletes a virtual bank account. If there is no virtual bank account present in the gateway for the customer, this API will return successfully without throwing an error.',
	},
	'virtualBankAccounts.deleteLocal': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Local delete a virtual bank account. Deletes virtual bank accounts from Chargebee. Payment method in the payment gateway, and Auto Collection settings in Chargebee are not affected.',
	},
	'virtualBankAccounts.get': {
		riskLevel: 'read',
		description:
			'Retrieve a virtual bank account. Retrieves the virtual bank account identified by the unique identifier.',
	},
	'virtualBankAccounts.list': {
		riskLevel: 'read',
		description:
			'List virtual bank accounts. Lists all the virtual bank accounts.',
	},
	'webhookEndpoints.create': {
		riskLevel: 'write',
		description:
			'Create a webhook endpoint. Create a new webhook API endpoint on your Chargebee Site.',
	},
	'webhookEndpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook endpoint. Deletes a webhook endpoint using its unique identifier. Use this API to remove obsolete or inactive webhook endpoints from your Chargebee site. Deleting an endpoint ensures it no longer receives event notifications.',
	},
	'webhookEndpoints.get': {
		riskLevel: 'read',
		description:
			"Retrieve a webhook endpoint. Retrieves the details of a specific webhook endpoint using its unique identifier. Use this API to inspect an endpoint's configuration, such as the target URL, subscribed events, and authentication settings.",
	},
	'webhookEndpoints.list': {
		riskLevel: 'read',
		description:
			"List webhook endpoints. Retrieves all webhook endpoints configured on your Chargebee site. The response includes each endpoint's ID, name, and target URL. Use this API to view, audit, or manage the list of webhook endpoints currently active or configured in your site.",
	},
	'webhookEndpoints.update': {
		riskLevel: 'write',
		description:
			'Update webhook endpoint. Updates the configuration of an existing webhook endpoint using its unique identifier. You can use this API to change properties such as the name, URL, subscribed events, authentication credentials, or API version.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof chargebeeEndpointsNested
>;
