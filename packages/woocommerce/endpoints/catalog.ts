// Generated with endpoints/operation-types.ts from the WooCommerce REST index:
// one entry per operation in woocommerce-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { woocommerceSchemaEntry } from './openapi-schema';
import { createWoocommerceOperation as op } from './operations';

export const woocommerceEndpointsNested = {
	coupons: {
		batch: op('coupons.batch'),
		create: op('coupons.create'),
		delete: op('coupons.delete'),
		get: op('coupons.get'),
		list: op('coupons.list'),
		update: op('coupons.update'),
	},
	customers: {
		batch: op('customers.batch'),
		create: op('customers.create'),
		delete: op('customers.delete'),
		downloads: op('customers.downloads'),
		get: op('customers.get'),
		list: op('customers.list'),
		update: op('customers.update'),
	},
	data: {
		continents: {
			get: op('data.continents.get'),
			list: op('data.continents.list'),
		},
		countries: {
			get: op('data.countries.get'),
			list: op('data.countries.list'),
		},
		currencies: {
			current: op('data.currencies.current'),
			get: op('data.currencies.get'),
			list: op('data.currencies.list'),
		},
		index: op('data.index'),
	},
	orders: {
		batch: op('orders.batch'),
		create: op('orders.create'),
		delete: op('orders.delete'),
		emailTemplates: op('orders.emailTemplates'),
		get: op('orders.get'),
		list: op('orders.list'),
		notes: {
			create: op('orders.notes.create'),
			delete: op('orders.notes.delete'),
			get: op('orders.notes.get'),
			list: op('orders.notes.list'),
		},
		receipt: {
			create: op('orders.receipt.create'),
			get: op('orders.receipt.get'),
		},
		refunds: {
			create: op('orders.refunds.create'),
			delete: op('orders.refunds.delete'),
			get: op('orders.refunds.get'),
			list: op('orders.refunds.list'),
			preview: op('orders.refunds.preview'),
		},
		sendEmail: op('orders.sendEmail'),
		sendOrderDetails: op('orders.sendOrderDetails'),
		statuses: op('orders.statuses'),
		update: op('orders.update'),
	},
	paymentGateways: {
		get: op('paymentGateways.get'),
		list: op('paymentGateways.list'),
		update: op('paymentGateways.update'),
	},
	products: {
		attributes: {
			batch: op('products.attributes.batch'),
			create: op('products.attributes.create'),
			delete: op('products.attributes.delete'),
			get: op('products.attributes.get'),
			list: op('products.attributes.list'),
			terms: {
				batch: op('products.attributes.terms.batch'),
				create: op('products.attributes.terms.create'),
				delete: op('products.attributes.terms.delete'),
				get: op('products.attributes.terms.get'),
				list: op('products.attributes.terms.list'),
				update: op('products.attributes.terms.update'),
			},
			update: op('products.attributes.update'),
		},
		batch: op('products.batch'),
		brands: {
			batch: op('products.brands.batch'),
			create: op('products.brands.create'),
			delete: op('products.brands.delete'),
			get: op('products.brands.get'),
			list: op('products.brands.list'),
			update: op('products.brands.update'),
		},
		categories: {
			batch: op('products.categories.batch'),
			create: op('products.categories.create'),
			delete: op('products.categories.delete'),
			get: op('products.categories.get'),
			list: op('products.categories.list'),
			update: op('products.categories.update'),
		},
		create: op('products.create'),
		customFieldNames: op('products.customFieldNames'),
		delete: op('products.delete'),
		duplicate: op('products.duplicate'),
		get: op('products.get'),
		list: op('products.list'),
		related: op('products.related'),
		reviews: {
			batch: op('products.reviews.batch'),
			create: op('products.reviews.create'),
			delete: op('products.reviews.delete'),
			get: op('products.reviews.get'),
			list: op('products.reviews.list'),
			update: op('products.reviews.update'),
		},
		shippingClasses: {
			batch: op('products.shippingClasses.batch'),
			create: op('products.shippingClasses.create'),
			delete: op('products.shippingClasses.delete'),
			get: op('products.shippingClasses.get'),
			list: op('products.shippingClasses.list'),
			suggestSlug: op('products.shippingClasses.suggestSlug'),
			update: op('products.shippingClasses.update'),
		},
		suggested: op('products.suggested'),
		tags: {
			batch: op('products.tags.batch'),
			create: op('products.tags.create'),
			delete: op('products.tags.delete'),
			get: op('products.tags.get'),
			list: op('products.tags.list'),
			update: op('products.tags.update'),
		},
		update: op('products.update'),
		variations: {
			batch: op('products.variations.batch'),
			create: op('products.variations.create'),
			delete: op('products.variations.delete'),
			generate: op('products.variations.generate'),
			get: op('products.variations.get'),
			list: op('products.variations.list'),
			update: op('products.variations.update'),
		},
	},
	refunds: {
		list: op('refunds.list'),
	},
	reports: {
		couponTotals: op('reports.couponTotals'),
		customerTotals: op('reports.customerTotals'),
		list: op('reports.list'),
		orderTotals: op('reports.orderTotals'),
		productTotals: op('reports.productTotals'),
		reviewTotals: op('reports.reviewTotals'),
		sales: op('reports.sales'),
		topSellers: op('reports.topSellers'),
	},
	settings: {
		batch: op('settings.batch'),
		batchAll: op('settings.batchAll'),
		get: op('settings.get'),
		groups: op('settings.groups'),
		list: op('settings.list'),
		update: op('settings.update'),
	},
	shipping: {
		zones: {
			create: op('shipping.zones.create'),
			delete: op('shipping.zones.delete'),
			get: op('shipping.zones.get'),
			list: op('shipping.zones.list'),
			locations: {
				list: op('shipping.zones.locations.list'),
				replace: op('shipping.zones.locations.replace'),
			},
			methods: {
				create: op('shipping.zones.methods.create'),
				delete: op('shipping.zones.methods.delete'),
				get: op('shipping.zones.methods.get'),
				list: op('shipping.zones.methods.list'),
				update: op('shipping.zones.methods.update'),
			},
			update: op('shipping.zones.update'),
		},
	},
	shippingMethods: {
		get: op('shippingMethods.get'),
		list: op('shippingMethods.list'),
	},
	systemStatus: {
		get: op('systemStatus.get'),
		tools: {
			get: op('systemStatus.tools.get'),
			list: op('systemStatus.tools.list'),
			run: op('systemStatus.tools.run'),
		},
	},
	taxes: {
		batch: op('taxes.batch'),
		classes: {
			create: op('taxes.classes.create'),
			delete: op('taxes.classes.delete'),
			get: op('taxes.classes.get'),
			list: op('taxes.classes.list'),
		},
		create: op('taxes.create'),
		delete: op('taxes.delete'),
		get: op('taxes.get'),
		list: op('taxes.list'),
		update: op('taxes.update'),
	},
	variations: {
		list: op('variations.list'),
	},
	webhooks: {
		batch: op('webhooks.batch'),
		create: op('webhooks.create'),
		delete: op('webhooks.delete'),
		get: op('webhooks.get'),
		list: op('webhooks.list'),
		update: op('webhooks.update'),
	},
} as const;

export const woocommerceEndpointSchemas = {
	'coupons.batch': woocommerceSchemaEntry('coupons.batch'),
	'coupons.create': woocommerceSchemaEntry('coupons.create'),
	'coupons.delete': woocommerceSchemaEntry('coupons.delete'),
	'coupons.get': woocommerceSchemaEntry('coupons.get'),
	'coupons.list': woocommerceSchemaEntry('coupons.list'),
	'coupons.update': woocommerceSchemaEntry('coupons.update'),
	'customers.batch': woocommerceSchemaEntry('customers.batch'),
	'customers.create': woocommerceSchemaEntry('customers.create'),
	'customers.delete': woocommerceSchemaEntry('customers.delete'),
	'customers.downloads': woocommerceSchemaEntry('customers.downloads'),
	'customers.get': woocommerceSchemaEntry('customers.get'),
	'customers.list': woocommerceSchemaEntry('customers.list'),
	'customers.update': woocommerceSchemaEntry('customers.update'),
	'data.continents.get': woocommerceSchemaEntry('data.continents.get'),
	'data.continents.list': woocommerceSchemaEntry('data.continents.list'),
	'data.countries.get': woocommerceSchemaEntry('data.countries.get'),
	'data.countries.list': woocommerceSchemaEntry('data.countries.list'),
	'data.currencies.current': woocommerceSchemaEntry('data.currencies.current'),
	'data.currencies.get': woocommerceSchemaEntry('data.currencies.get'),
	'data.currencies.list': woocommerceSchemaEntry('data.currencies.list'),
	'data.index': woocommerceSchemaEntry('data.index'),
	'orders.batch': woocommerceSchemaEntry('orders.batch'),
	'orders.create': woocommerceSchemaEntry('orders.create'),
	'orders.delete': woocommerceSchemaEntry('orders.delete'),
	'orders.emailTemplates': woocommerceSchemaEntry('orders.emailTemplates'),
	'orders.get': woocommerceSchemaEntry('orders.get'),
	'orders.list': woocommerceSchemaEntry('orders.list'),
	'orders.notes.create': woocommerceSchemaEntry('orders.notes.create'),
	'orders.notes.delete': woocommerceSchemaEntry('orders.notes.delete'),
	'orders.notes.get': woocommerceSchemaEntry('orders.notes.get'),
	'orders.notes.list': woocommerceSchemaEntry('orders.notes.list'),
	'orders.receipt.create': woocommerceSchemaEntry('orders.receipt.create'),
	'orders.receipt.get': woocommerceSchemaEntry('orders.receipt.get'),
	'orders.refunds.create': woocommerceSchemaEntry('orders.refunds.create'),
	'orders.refunds.delete': woocommerceSchemaEntry('orders.refunds.delete'),
	'orders.refunds.get': woocommerceSchemaEntry('orders.refunds.get'),
	'orders.refunds.list': woocommerceSchemaEntry('orders.refunds.list'),
	'orders.refunds.preview': woocommerceSchemaEntry('orders.refunds.preview'),
	'orders.sendEmail': woocommerceSchemaEntry('orders.sendEmail'),
	'orders.sendOrderDetails': woocommerceSchemaEntry('orders.sendOrderDetails'),
	'orders.statuses': woocommerceSchemaEntry('orders.statuses'),
	'orders.update': woocommerceSchemaEntry('orders.update'),
	'paymentGateways.get': woocommerceSchemaEntry('paymentGateways.get'),
	'paymentGateways.list': woocommerceSchemaEntry('paymentGateways.list'),
	'paymentGateways.update': woocommerceSchemaEntry('paymentGateways.update'),
	'products.attributes.batch': woocommerceSchemaEntry(
		'products.attributes.batch',
	),
	'products.attributes.create': woocommerceSchemaEntry(
		'products.attributes.create',
	),
	'products.attributes.delete': woocommerceSchemaEntry(
		'products.attributes.delete',
	),
	'products.attributes.get': woocommerceSchemaEntry('products.attributes.get'),
	'products.attributes.list': woocommerceSchemaEntry(
		'products.attributes.list',
	),
	'products.attributes.terms.batch': woocommerceSchemaEntry(
		'products.attributes.terms.batch',
	),
	'products.attributes.terms.create': woocommerceSchemaEntry(
		'products.attributes.terms.create',
	),
	'products.attributes.terms.delete': woocommerceSchemaEntry(
		'products.attributes.terms.delete',
	),
	'products.attributes.terms.get': woocommerceSchemaEntry(
		'products.attributes.terms.get',
	),
	'products.attributes.terms.list': woocommerceSchemaEntry(
		'products.attributes.terms.list',
	),
	'products.attributes.terms.update': woocommerceSchemaEntry(
		'products.attributes.terms.update',
	),
	'products.attributes.update': woocommerceSchemaEntry(
		'products.attributes.update',
	),
	'products.batch': woocommerceSchemaEntry('products.batch'),
	'products.brands.batch': woocommerceSchemaEntry('products.brands.batch'),
	'products.brands.create': woocommerceSchemaEntry('products.brands.create'),
	'products.brands.delete': woocommerceSchemaEntry('products.brands.delete'),
	'products.brands.get': woocommerceSchemaEntry('products.brands.get'),
	'products.brands.list': woocommerceSchemaEntry('products.brands.list'),
	'products.brands.update': woocommerceSchemaEntry('products.brands.update'),
	'products.categories.batch': woocommerceSchemaEntry(
		'products.categories.batch',
	),
	'products.categories.create': woocommerceSchemaEntry(
		'products.categories.create',
	),
	'products.categories.delete': woocommerceSchemaEntry(
		'products.categories.delete',
	),
	'products.categories.get': woocommerceSchemaEntry('products.categories.get'),
	'products.categories.list': woocommerceSchemaEntry(
		'products.categories.list',
	),
	'products.categories.update': woocommerceSchemaEntry(
		'products.categories.update',
	),
	'products.create': woocommerceSchemaEntry('products.create'),
	'products.customFieldNames': woocommerceSchemaEntry(
		'products.customFieldNames',
	),
	'products.delete': woocommerceSchemaEntry('products.delete'),
	'products.duplicate': woocommerceSchemaEntry('products.duplicate'),
	'products.get': woocommerceSchemaEntry('products.get'),
	'products.list': woocommerceSchemaEntry('products.list'),
	'products.related': woocommerceSchemaEntry('products.related'),
	'products.reviews.batch': woocommerceSchemaEntry('products.reviews.batch'),
	'products.reviews.create': woocommerceSchemaEntry('products.reviews.create'),
	'products.reviews.delete': woocommerceSchemaEntry('products.reviews.delete'),
	'products.reviews.get': woocommerceSchemaEntry('products.reviews.get'),
	'products.reviews.list': woocommerceSchemaEntry('products.reviews.list'),
	'products.reviews.update': woocommerceSchemaEntry('products.reviews.update'),
	'products.shippingClasses.batch': woocommerceSchemaEntry(
		'products.shippingClasses.batch',
	),
	'products.shippingClasses.create': woocommerceSchemaEntry(
		'products.shippingClasses.create',
	),
	'products.shippingClasses.delete': woocommerceSchemaEntry(
		'products.shippingClasses.delete',
	),
	'products.shippingClasses.get': woocommerceSchemaEntry(
		'products.shippingClasses.get',
	),
	'products.shippingClasses.list': woocommerceSchemaEntry(
		'products.shippingClasses.list',
	),
	'products.shippingClasses.suggestSlug': woocommerceSchemaEntry(
		'products.shippingClasses.suggestSlug',
	),
	'products.shippingClasses.update': woocommerceSchemaEntry(
		'products.shippingClasses.update',
	),
	'products.suggested': woocommerceSchemaEntry('products.suggested'),
	'products.tags.batch': woocommerceSchemaEntry('products.tags.batch'),
	'products.tags.create': woocommerceSchemaEntry('products.tags.create'),
	'products.tags.delete': woocommerceSchemaEntry('products.tags.delete'),
	'products.tags.get': woocommerceSchemaEntry('products.tags.get'),
	'products.tags.list': woocommerceSchemaEntry('products.tags.list'),
	'products.tags.update': woocommerceSchemaEntry('products.tags.update'),
	'products.update': woocommerceSchemaEntry('products.update'),
	'products.variations.batch': woocommerceSchemaEntry(
		'products.variations.batch',
	),
	'products.variations.create': woocommerceSchemaEntry(
		'products.variations.create',
	),
	'products.variations.delete': woocommerceSchemaEntry(
		'products.variations.delete',
	),
	'products.variations.generate': woocommerceSchemaEntry(
		'products.variations.generate',
	),
	'products.variations.get': woocommerceSchemaEntry('products.variations.get'),
	'products.variations.list': woocommerceSchemaEntry(
		'products.variations.list',
	),
	'products.variations.update': woocommerceSchemaEntry(
		'products.variations.update',
	),
	'refunds.list': woocommerceSchemaEntry('refunds.list'),
	'reports.couponTotals': woocommerceSchemaEntry('reports.couponTotals'),
	'reports.customerTotals': woocommerceSchemaEntry('reports.customerTotals'),
	'reports.list': woocommerceSchemaEntry('reports.list'),
	'reports.orderTotals': woocommerceSchemaEntry('reports.orderTotals'),
	'reports.productTotals': woocommerceSchemaEntry('reports.productTotals'),
	'reports.reviewTotals': woocommerceSchemaEntry('reports.reviewTotals'),
	'reports.sales': woocommerceSchemaEntry('reports.sales'),
	'reports.topSellers': woocommerceSchemaEntry('reports.topSellers'),
	'settings.batch': woocommerceSchemaEntry('settings.batch'),
	'settings.batchAll': woocommerceSchemaEntry('settings.batchAll'),
	'settings.get': woocommerceSchemaEntry('settings.get'),
	'settings.groups': woocommerceSchemaEntry('settings.groups'),
	'settings.list': woocommerceSchemaEntry('settings.list'),
	'settings.update': woocommerceSchemaEntry('settings.update'),
	'shipping.zones.create': woocommerceSchemaEntry('shipping.zones.create'),
	'shipping.zones.delete': woocommerceSchemaEntry('shipping.zones.delete'),
	'shipping.zones.get': woocommerceSchemaEntry('shipping.zones.get'),
	'shipping.zones.list': woocommerceSchemaEntry('shipping.zones.list'),
	'shipping.zones.locations.list': woocommerceSchemaEntry(
		'shipping.zones.locations.list',
	),
	'shipping.zones.locations.replace': woocommerceSchemaEntry(
		'shipping.zones.locations.replace',
	),
	'shipping.zones.methods.create': woocommerceSchemaEntry(
		'shipping.zones.methods.create',
	),
	'shipping.zones.methods.delete': woocommerceSchemaEntry(
		'shipping.zones.methods.delete',
	),
	'shipping.zones.methods.get': woocommerceSchemaEntry(
		'shipping.zones.methods.get',
	),
	'shipping.zones.methods.list': woocommerceSchemaEntry(
		'shipping.zones.methods.list',
	),
	'shipping.zones.methods.update': woocommerceSchemaEntry(
		'shipping.zones.methods.update',
	),
	'shipping.zones.update': woocommerceSchemaEntry('shipping.zones.update'),
	'shippingMethods.get': woocommerceSchemaEntry('shippingMethods.get'),
	'shippingMethods.list': woocommerceSchemaEntry('shippingMethods.list'),
	'systemStatus.get': woocommerceSchemaEntry('systemStatus.get'),
	'systemStatus.tools.get': woocommerceSchemaEntry('systemStatus.tools.get'),
	'systemStatus.tools.list': woocommerceSchemaEntry('systemStatus.tools.list'),
	'systemStatus.tools.run': woocommerceSchemaEntry('systemStatus.tools.run'),
	'taxes.batch': woocommerceSchemaEntry('taxes.batch'),
	'taxes.classes.create': woocommerceSchemaEntry('taxes.classes.create'),
	'taxes.classes.delete': woocommerceSchemaEntry('taxes.classes.delete'),
	'taxes.classes.get': woocommerceSchemaEntry('taxes.classes.get'),
	'taxes.classes.list': woocommerceSchemaEntry('taxes.classes.list'),
	'taxes.create': woocommerceSchemaEntry('taxes.create'),
	'taxes.delete': woocommerceSchemaEntry('taxes.delete'),
	'taxes.get': woocommerceSchemaEntry('taxes.get'),
	'taxes.list': woocommerceSchemaEntry('taxes.list'),
	'taxes.update': woocommerceSchemaEntry('taxes.update'),
	'variations.list': woocommerceSchemaEntry('variations.list'),
	'webhooks.batch': woocommerceSchemaEntry('webhooks.batch'),
	'webhooks.create': woocommerceSchemaEntry('webhooks.create'),
	'webhooks.delete': woocommerceSchemaEntry('webhooks.delete'),
	'webhooks.get': woocommerceSchemaEntry('webhooks.get'),
	'webhooks.list': woocommerceSchemaEntry('webhooks.list'),
	'webhooks.update': woocommerceSchemaEntry('webhooks.update'),
} satisfies RequiredPluginEndpointSchemas<typeof woocommerceEndpointsNested>;

export const woocommerceEndpointMeta = {
	'coupons.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 coupons in one call',
	},
	'coupons.create': {
		riskLevel: 'write',
		description: 'Create a coupon',
	},
	'coupons.delete': {
		riskLevel: 'destructive',
		description: 'Delete a coupon; without force true it goes to the trash',
	},
	'coupons.get': {
		riskLevel: 'read',
		description: 'Get one coupon',
	},
	'coupons.list': {
		riskLevel: 'read',
		description: 'List coupons, one page at a time, with search and filters',
	},
	'coupons.update': {
		riskLevel: 'write',
		description: 'Update a coupon: only the fields you pass change',
	},
	'customers.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 customers in one call',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a customer',
	},
	'customers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a customer (WooCommerce needs force true)',
	},
	'customers.downloads': {
		riskLevel: 'read',
		description: 'List the downloadable files a customer has access to',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Get one customer',
	},
	'customers.list': {
		riskLevel: 'read',
		description: 'List customers, one page at a time, with search and filters',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a customer: only the fields you pass change',
	},
	'data.continents.get': {
		riskLevel: 'read',
		description: 'Get one continent',
	},
	'data.continents.list': {
		riskLevel: 'read',
		description: 'List continents',
	},
	'data.countries.get': {
		riskLevel: 'read',
		description: 'Get one country',
	},
	'data.countries.list': {
		riskLevel: 'read',
		description: 'List countries',
	},
	'data.currencies.current': {
		riskLevel: 'read',
		description: "Get the store's currency",
	},
	'data.currencies.get': {
		riskLevel: 'read',
		description: 'Get one currency',
	},
	'data.currencies.list': {
		riskLevel: 'read',
		description: 'List currencies',
	},
	'data.index': {
		riskLevel: 'read',
		description:
			'List the reference data routes (continents, countries, currencies)',
	},
	'orders.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 orders in one call',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create an order with line items, billing and shipping addresses, shipping lines, fees, coupons and a status (no payment is taken; set_paid marks it paid)',
	},
	'orders.delete': {
		riskLevel: 'destructive',
		description: 'Delete an order; without force true it goes to the trash',
	},
	'orders.emailTemplates': {
		riskLevel: 'read',
		description: 'List the emails that can be sent for an order',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Get one order',
	},
	'orders.list': {
		riskLevel: 'read',
		description: 'List orders, one page at a time, with search and filters',
	},
	'orders.notes.create': {
		riskLevel: 'destructive',
		description:
			'Add a note to an order; with customer_note true WooCommerce emails it to the customer',
	},
	'orders.notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a order note (WooCommerce needs force true)',
	},
	'orders.notes.get': {
		riskLevel: 'read',
		description: 'Get one order note',
	},
	'orders.notes.list': {
		riskLevel: 'read',
		description: 'List the order notes of a order',
	},
	'orders.receipt.create': {
		riskLevel: 'write',
		description: 'Generate the receipt of an order',
	},
	'orders.receipt.get': {
		riskLevel: 'read',
		description: 'Get the receipt of an order (a link to the rendered receipt)',
	},
	'orders.refunds.create': {
		riskLevel: 'destructive',
		description:
			'Refund an order, in full or by line item; with api_refund true (the default) the payment gateway sends the money back',
	},
	'orders.refunds.delete': {
		riskLevel: 'destructive',
		description: 'Delete a refund (WooCommerce needs force true)',
	},
	'orders.refunds.get': {
		riskLevel: 'read',
		description: 'Get one refund',
	},
	'orders.refunds.list': {
		riskLevel: 'read',
		description:
			'List the refunds of a order, one page at a time, with search and filters',
	},
	'orders.refunds.preview': {
		riskLevel: 'read',
		description:
			'Work out a refund (amounts, taxes, line items) without creating it',
	},
	'orders.sendEmail': {
		riskLevel: 'destructive',
		description:
			'Send one of the order emails (an invoice, a status email) to the customer or another address',
	},
	'orders.sendOrderDetails': {
		riskLevel: 'destructive',
		description: 'Email the order details (invoice) to the customer',
	},
	'orders.statuses': {
		riskLevel: 'read',
		description: 'List the order statuses the store uses, core and custom',
	},
	'orders.update': {
		riskLevel: 'write',
		description:
			'Update an order: status (processing, completed, cancelled ...), addresses, line items, notes and meta; only the fields you pass change',
	},
	'paymentGateways.get': {
		riskLevel: 'read',
		description: 'Get one payment gateway',
	},
	'paymentGateways.list': {
		riskLevel: 'read',
		description: 'List payment gateways',
	},
	'paymentGateways.update': {
		riskLevel: 'destructive',
		description:
			'Enable, disable or reconfigure a payment gateway (title, description, settings)',
	},
	'products.attributes.batch': {
		riskLevel: 'destructive',
		description:
			'Create, update and delete up to 100 product attributes in one call',
	},
	'products.attributes.create': {
		riskLevel: 'write',
		description: 'Create a product attribute for a product',
	},
	'products.attributes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product attribute (WooCommerce needs force true)',
	},
	'products.attributes.get': {
		riskLevel: 'read',
		description: 'Get one product attribute',
	},
	'products.attributes.list': {
		riskLevel: 'read',
		description: 'List the product attributes of a product',
	},
	'products.attributes.terms.batch': {
		riskLevel: 'destructive',
		description:
			'Create, update and delete up to 100 attribute terms in one call',
	},
	'products.attributes.terms.create': {
		riskLevel: 'write',
		description: 'Create a attribute term for a product attribute',
	},
	'products.attributes.terms.delete': {
		riskLevel: 'destructive',
		description: 'Delete a attribute term (WooCommerce needs force true)',
	},
	'products.attributes.terms.get': {
		riskLevel: 'read',
		description: 'Get one attribute term',
	},
	'products.attributes.terms.list': {
		riskLevel: 'read',
		description:
			'List the attribute terms of a product attribute, one page at a time, with search and filters',
	},
	'products.attributes.terms.update': {
		riskLevel: 'write',
		description: 'Update a attribute term: only the fields you pass change',
	},
	'products.attributes.update': {
		riskLevel: 'write',
		description: 'Update a product attribute: only the fields you pass change',
	},
	'products.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 products in one call',
	},
	'products.brands.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 brands in one call',
	},
	'products.brands.create': {
		riskLevel: 'write',
		description: 'Create a brand for a product',
	},
	'products.brands.delete': {
		riskLevel: 'destructive',
		description: 'Delete a brand (WooCommerce needs force true)',
	},
	'products.brands.get': {
		riskLevel: 'read',
		description: 'Get one brand',
	},
	'products.brands.list': {
		riskLevel: 'read',
		description:
			'List the brands of a product, one page at a time, with search and filters',
	},
	'products.brands.update': {
		riskLevel: 'write',
		description: 'Update a brand: only the fields you pass change',
	},
	'products.categories.batch': {
		riskLevel: 'destructive',
		description:
			'Create, update and delete up to 100 product categories in one call',
	},
	'products.categories.create': {
		riskLevel: 'write',
		description: 'Create a product category for a product',
	},
	'products.categories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product category (WooCommerce needs force true)',
	},
	'products.categories.get': {
		riskLevel: 'read',
		description: 'Get one product category',
	},
	'products.categories.list': {
		riskLevel: 'read',
		description:
			'List the product categories of a product, one page at a time, with search and filters',
	},
	'products.categories.update': {
		riskLevel: 'write',
		description: 'Update a product category: only the fields you pass change',
	},
	'products.create': {
		riskLevel: 'write',
		description: 'Create a product',
	},
	'products.customFieldNames': {
		riskLevel: 'read',
		description:
			'List the custom field (meta) names used on products, one page at a time',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product; without force true it goes to the trash',
	},
	'products.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a product (as a draft copy)',
	},
	'products.get': {
		riskLevel: 'read',
		description: 'Get one product',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'List products, one page at a time, with search and filters',
	},
	'products.related': {
		riskLevel: 'read',
		description: 'List the ids of products related to a product',
	},
	'products.reviews.batch': {
		riskLevel: 'destructive',
		description:
			'Create, update and delete up to 100 product reviews in one call',
	},
	'products.reviews.create': {
		riskLevel: 'write',
		description: 'Create a product review for a product',
	},
	'products.reviews.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a product review; without force true it goes to the trash',
	},
	'products.reviews.get': {
		riskLevel: 'read',
		description: 'Get one product review',
	},
	'products.reviews.list': {
		riskLevel: 'read',
		description:
			'List the product reviews of a product, one page at a time, with search and filters',
	},
	'products.reviews.update': {
		riskLevel: 'write',
		description: 'Update a product review: only the fields you pass change',
	},
	'products.shippingClasses.batch': {
		riskLevel: 'destructive',
		description:
			'Create, update and delete up to 100 shipping classes in one call',
	},
	'products.shippingClasses.create': {
		riskLevel: 'write',
		description: 'Create a shipping class for a product',
	},
	'products.shippingClasses.delete': {
		riskLevel: 'destructive',
		description: 'Delete a shipping class (WooCommerce needs force true)',
	},
	'products.shippingClasses.get': {
		riskLevel: 'read',
		description: 'Get one shipping class',
	},
	'products.shippingClasses.list': {
		riskLevel: 'read',
		description:
			'List the shipping classes of a product, one page at a time, with search and filters',
	},
	'products.shippingClasses.suggestSlug': {
		riskLevel: 'read',
		description: 'Suggest a unique slug for a new shipping class name',
	},
	'products.shippingClasses.update': {
		riskLevel: 'write',
		description: 'Update a shipping class: only the fields you pass change',
	},
	'products.suggested': {
		riskLevel: 'read',
		description:
			'List products suggested for a product by shared categories and tags',
	},
	'products.tags.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 product tags in one call',
	},
	'products.tags.create': {
		riskLevel: 'write',
		description: 'Create a product tag for a product',
	},
	'products.tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product tag (WooCommerce needs force true)',
	},
	'products.tags.get': {
		riskLevel: 'read',
		description: 'Get one product tag',
	},
	'products.tags.list': {
		riskLevel: 'read',
		description:
			'List the product tags of a product, one page at a time, with search and filters',
	},
	'products.tags.update': {
		riskLevel: 'write',
		description: 'Update a product tag: only the fields you pass change',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a product: only the fields you pass change',
	},
	'products.variations.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 variations in one call',
	},
	'products.variations.create': {
		riskLevel: 'write',
		description: 'Create a variation for a product',
	},
	'products.variations.delete': {
		riskLevel: 'destructive',
		description: 'Delete a variation; without force true it goes to the trash',
	},
	'products.variations.generate': {
		riskLevel: 'destructive',
		description:
			"Create every missing variation from a variable product's attributes; with delete true it also permanently deletes variations that no longer match",
	},
	'products.variations.get': {
		riskLevel: 'read',
		description: 'Get one variation',
	},
	'products.variations.list': {
		riskLevel: 'read',
		description:
			'List the variations of a product, one page at a time, with search and filters',
	},
	'products.variations.update': {
		riskLevel: 'write',
		description: 'Update a variation: only the fields you pass change',
	},
	'refunds.list': {
		riskLevel: 'read',
		description: 'List refunds across all orders, one page at a time',
	},
	'reports.couponTotals': {
		riskLevel: 'read',
		description: 'Get coupon totals by type',
	},
	'reports.customerTotals': {
		riskLevel: 'read',
		description: 'Get customer totals (paying and non-paying)',
	},
	'reports.list': {
		riskLevel: 'read',
		description: 'List the available reports',
	},
	'reports.orderTotals': {
		riskLevel: 'read',
		description: 'Get order totals by status',
	},
	'reports.productTotals': {
		riskLevel: 'read',
		description: 'Get product totals by type',
	},
	'reports.reviewTotals': {
		riskLevel: 'read',
		description: 'Get review totals by rating',
	},
	'reports.sales': {
		riskLevel: 'read',
		description:
			'Get the sales report (gross and net sales, orders, items, tax, shipping, discounts) for a period or date range',
	},
	'reports.topSellers': {
		riskLevel: 'read',
		description: 'Get the top-selling products for a period or date range',
	},
	'settings.batch': {
		riskLevel: 'destructive',
		description: 'Update several settings of a group in one call',
	},
	'settings.batchAll': {
		riskLevel: 'destructive',
		description: 'Update settings across groups in one call',
	},
	'settings.get': {
		riskLevel: 'read',
		description: 'Get one setting',
	},
	'settings.groups': {
		riskLevel: 'read',
		description:
			'List the settings groups (general, products, tax, shipping, checkout, account, email, advanced ...)',
	},
	'settings.list': {
		riskLevel: 'read',
		description:
			'List every setting in a group with its value, type and options',
	},
	'settings.update': {
		riskLevel: 'write',
		description: 'Update one setting value',
	},
	'shipping.zones.create': {
		riskLevel: 'write',
		description: 'Create a shipping zone',
	},
	'shipping.zones.delete': {
		riskLevel: 'destructive',
		description: 'Delete a shipping zone (WooCommerce needs force true)',
	},
	'shipping.zones.get': {
		riskLevel: 'read',
		description: 'Get one shipping zone',
	},
	'shipping.zones.list': {
		riskLevel: 'read',
		description: 'List shipping zones',
	},
	'shipping.zones.locations.list': {
		riskLevel: 'read',
		description: 'List zone locations',
	},
	'shipping.zones.locations.replace': {
		riskLevel: 'destructive',
		description:
			'Replace every location (country, state, postcode) of a shipping zone',
	},
	'shipping.zones.methods.create': {
		riskLevel: 'write',
		description: 'Create a shipping method',
	},
	'shipping.zones.methods.delete': {
		riskLevel: 'destructive',
		description: 'Delete a shipping method (WooCommerce needs force true)',
	},
	'shipping.zones.methods.get': {
		riskLevel: 'read',
		description: 'Get one shipping method',
	},
	'shipping.zones.methods.list': {
		riskLevel: 'read',
		description: 'List shipping methods',
	},
	'shipping.zones.methods.update': {
		riskLevel: 'write',
		description: 'Update a shipping method: only the fields you pass change',
	},
	'shipping.zones.update': {
		riskLevel: 'write',
		description: 'Update a shipping zone: only the fields you pass change',
	},
	'shippingMethods.get': {
		riskLevel: 'read',
		description: 'Get one shipping method type',
	},
	'shippingMethods.list': {
		riskLevel: 'read',
		description: 'List shipping method types',
	},
	'systemStatus.get': {
		riskLevel: 'read',
		description:
			'Get the system status report: environment, database, active plugins, theme, settings, pages and security',
	},
	'systemStatus.tools.get': {
		riskLevel: 'read',
		description: 'Get one system status tool',
	},
	'systemStatus.tools.list': {
		riskLevel: 'read',
		description: 'List system status tools',
	},
	'systemStatus.tools.run': {
		riskLevel: 'destructive',
		description:
			'Run a system status tool (clear transients, regenerate product lookup tables, delete orphaned variations ...)',
	},
	'taxes.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 tax rates in one call',
	},
	'taxes.classes.create': {
		riskLevel: 'write',
		description: 'Create a tax class for a tax rate',
	},
	'taxes.classes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tax class (WooCommerce needs force true)',
	},
	'taxes.classes.get': {
		riskLevel: 'read',
		description: 'Get one tax class',
	},
	'taxes.classes.list': {
		riskLevel: 'read',
		description: 'List the tax classes of a tax rate',
	},
	'taxes.create': {
		riskLevel: 'write',
		description: 'Create a tax rate',
	},
	'taxes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a tax rate (WooCommerce needs force true)',
	},
	'taxes.get': {
		riskLevel: 'read',
		description: 'Get one tax rate',
	},
	'taxes.list': {
		riskLevel: 'read',
		description: 'List tax rates, one page at a time',
	},
	'taxes.update': {
		riskLevel: 'write',
		description: 'Update a tax rate: only the fields you pass change',
	},
	'variations.list': {
		riskLevel: 'read',
		description:
			'List variations across all products, one page at a time, with search and filters',
	},
	'webhooks.batch': {
		riskLevel: 'destructive',
		description: 'Create, update and delete up to 100 webhooks in one call',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			"Create a webhook: a topic (order.created, product.updated, customer.deleted, coupon.restored or action.<hook>), a delivery URL and a secret. With a secret, the plugin's webhooks verify the deliveries",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook (WooCommerce needs force true)',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Get one webhook',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List webhooks, one page at a time, with search and filters',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a webhook: only the fields you pass change',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof woocommerceEndpointsNested
>;
