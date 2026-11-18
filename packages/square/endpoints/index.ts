import * as bookingsOps from './bookings';
import * as cardsOps from './cards';
import * as catalogOps from './catalog';
import * as channelsOps from './channels';
import * as checkoutOps from './checkout';
import * as customAttributeDefinitionsOps from './custom-attribute-definitions';
import * as customAttributesOps from './custom-attributes';
import * as customerGroupsOps from './customer-groups';
import * as customerSegmentsOps from './customer-segments';
import * as customersOps from './customers';
import * as disputesOps from './disputes';
import * as inventoryOps from './inventory';
import * as invoicesOps from './invoices';
import * as locationsOps from './locations';
import * as merchantsOps from './merchants';
import * as oauthOps from './oauth';
import * as ordersOps from './orders';
import * as paymentLinksOps from './payment-links';
import * as paymentsOps from './payments';
import * as refundsOps from './refunds';
import * as webhookEventTypesOps from './webhook-event-types';
import * as webhookSubscriptionsOps from './webhook-subscriptions';

export const Disputes = {
	accept: disputesOps.accept,
	createEvidenceFile: disputesOps.createEvidenceFile,
	createEvidenceText: disputesOps.createEvidenceText,
	deleteEvidence: disputesOps.deleteEvidence,
	getEvidence: disputesOps.getEvidence,
	listEvidence: disputesOps.listEvidence,
	get: disputesOps.get,
	submitEvidence: disputesOps.submitEvidence,
	list: disputesOps.list,
};

export const Customers = {
	addGroup: customersOps.addGroup,
	bulkDelete: customersOps.bulkDelete,
	bulkUpdate: customersOps.bulkUpdate,
	bulkCreate: customersOps.bulkCreate,
	create: customersOps.create,
	delete: customersOps.remove,
	list: customersOps.list,
	removeGroup: customersOps.removeGroup,
	bulkGet: customersOps.bulkGet,
	get: customersOps.get,
	search: customersOps.search,
	update: customersOps.update,
};

export const CustomAttributes = {
	customer: {
		bulkUpsert: customAttributesOps.customerBulkUpsert,
		delete: customAttributesOps.customerRemove,
		get: customAttributesOps.customerGet,
		list: customAttributesOps.customerList,
		upsert: customAttributesOps.customerUpsert,
	},
	location: {
		bulkUpsert: customAttributesOps.locationBulkUpsert,
		delete: customAttributesOps.locationRemove,
		bulkDelete: customAttributesOps.locationBulkDelete,
		list: customAttributesOps.locationList,
		get: customAttributesOps.locationGet,
		upsert: customAttributesOps.locationUpsert,
	},
	merchant: {
		bulkUpsert: customAttributesOps.merchantBulkUpsert,
		delete: customAttributesOps.merchantRemove,
		bulkDelete: customAttributesOps.merchantBulkDelete,
		list: customAttributesOps.merchantList,
		get: customAttributesOps.merchantGet,
		upsert: customAttributesOps.merchantUpsert,
	},
};

export const Channels = {
	bulkGet: channelsOps.bulkGet,
	list: channelsOps.list,
	get: channelsOps.get,
};

export const Orders = {
	calculate: ordersOps.calculate,
	get: ordersOps.get,
	search: ordersOps.search,
	update: ordersOps.update,
	create: ordersOps.create,
	pay: ordersOps.pay,
};

export const Invoices = {
	cancel: invoicesOps.cancel,
	createAttachment: invoicesOps.createAttachment,
	delete: invoicesOps.remove,
	deleteAttachment: invoicesOps.deleteAttachment,
	get: invoicesOps.get,
	list: invoicesOps.list,
	create: invoicesOps.create,
	publish: invoicesOps.publish,
	update: invoicesOps.update,
	search: invoicesOps.search,
};

export const Payments = {
	cancel: paymentsOps.cancel,
	list: paymentsOps.list,
	create: paymentsOps.create,
	get: paymentsOps.get,
	update: paymentsOps.update,
	complete: paymentsOps.complete,
	refund: paymentsOps.refund,
	cancelByIdempotencyKey: paymentsOps.cancelByIdempotencyKey,
};

export const Cards = {
	create: cardsOps.create,
	list: cardsOps.list,
	get: cardsOps.get,
	disable: cardsOps.disable,
};

export const CustomAttributeDefinitions = {
	customer: {
		create: customAttributeDefinitionsOps.customerCreate,
		delete: customAttributeDefinitionsOps.customerRemove,
		get: customAttributeDefinitionsOps.customerGet,
		list: customAttributeDefinitionsOps.customerList,
		update: customAttributeDefinitionsOps.customerUpdate,
	},
	location: {
		create: customAttributeDefinitionsOps.locationCreate,
		delete: customAttributeDefinitionsOps.locationRemove,
		list: customAttributeDefinitionsOps.locationList,
		get: customAttributeDefinitionsOps.locationGet,
		update: customAttributeDefinitionsOps.locationUpdate,
	},
	merchant: {
		delete: customAttributeDefinitionsOps.merchantRemove,
		list: customAttributeDefinitionsOps.merchantList,
		get: customAttributeDefinitionsOps.merchantGet,
		update: customAttributeDefinitionsOps.merchantUpdate,
		create: customAttributeDefinitionsOps.merchantCreate,
	},
};

export const CustomerGroups = {
	create: customerGroupsOps.create,
	delete: customerGroupsOps.remove,
	list: customerGroupsOps.list,
	get: customerGroupsOps.get,
	update: customerGroupsOps.update,
};

export const Locations = {
	create: locationsOps.create,
	list: locationsOps.list,
	get: locationsOps.get,
	update: locationsOps.update,
};

export const WebhookSubscriptions = {
	delete: webhookSubscriptionsOps.remove,
	list: webhookSubscriptionsOps.list,
	get: webhookSubscriptionsOps.get,
	test: webhookSubscriptionsOps.test,
	update: webhookSubscriptionsOps.update,
	updateSignatureKey: webhookSubscriptionsOps.updateSignatureKey,
	create: webhookSubscriptionsOps.create,
};

export const Bookings = {
	getBusinessProfile: bookingsOps.getBusinessProfile,
};

export const Merchants = {
	get: merchantsOps.get,
	list: merchantsOps.list,
};

export const Checkout = {
	getLocationSettings: checkoutOps.getLocationSettings,
	updateLocationSettings: checkoutOps.updateLocationSettings,
};

export const CustomerSegments = {
	list: customerSegmentsOps.list,
	get: customerSegmentsOps.get,
};

export const WebhookEventTypes = {
	list: webhookEventTypesOps.list,
};

export const PaymentLinks = {
	get: paymentLinksOps.get,
	create: paymentLinksOps.create,
	list: paymentLinksOps.list,
	delete: paymentLinksOps.remove,
	update: paymentLinksOps.update,
};

export const Oauth = {
	getTokenStatus: oauthOps.getTokenStatus,
};

export const Refunds = {
	get: refundsOps.get,
	list: refundsOps.list,
};

export const Catalog = {
	list: catalogOps.list,
	search: catalogOps.search,
	get: catalogOps.get,
	upsert: catalogOps.upsert,
	delete: catalogOps.remove,
};

export const Inventory = {
	batchGet: inventoryOps.batchGet,
	get: inventoryOps.get,
};

export * from './types';
