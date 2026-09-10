import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { getOAuthAccessToken } from 'corsair/core';
import { attachManagedRefreshAuth, getManagedAccessToken } from 'corsair/hub';
import type { ZohoInventoryRegion } from './client';
import {
	zohoInventoryOAuthAuthUrl,
	zohoInventoryOAuthTokenUrl,
} from './client';
import {
	BillsEndpoints,
	CompositeItemsEndpoints,
	ContactsEndpoints,
	CreditNotesEndpoints,
	CurrenciesEndpoints,
	CustomerPaymentsEndpoints,
	InvoicesEndpoints,
	ItemGroupsEndpoints,
	ItemsEndpoints,
	OrganizationsEndpoints,
	PackagesEndpoints,
	PurchaseOrdersEndpoints,
	SalesOrdersEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	ZohoInventoryEndpointInputs,
	ZohoInventoryEndpointOutputs,
} from './endpoints/types';
import {
	ZohoInventoryEndpointInputSchemas,
	ZohoInventoryEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { resolveZohoInventoryOAuthWebhookTenantLink } from './oauth-tenant-link';
import type { ZohoInventoryCredentials } from './schema';
import { ZohoInventorySchema } from './schema';

export const zohoInventoryAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
	managed: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ZohoInventoryPluginOptions = {
	authType?: PickAuth<'oauth_2' | 'managed'>;
	/** Zoho datacenter. Default 'us'. Canada OAuth uses accounts.zohocloud.ca. */
	region?: ZohoInventoryRegion;
	/** HTTPS zohoapis.* origin only, e.g. https://www.zohoapis.eu */
	apiDomain?: string;
	key?: string;
	credentials?: ZohoInventoryCredentials;
	hooks?: InternalZohoInventoryPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof zohoInventoryEndpointsNested>;
};

export type ZohoInventoryContext = CorsairPluginContext<
	typeof ZohoInventorySchema,
	ZohoInventoryPluginOptions,
	undefined,
	typeof zohoInventoryAuthConfig
>;

export type ZohoInventoryKeyBuilderContext = KeyBuilderContext<
	ZohoInventoryPluginOptions,
	typeof zohoInventoryAuthConfig
>;

type ZohoInventoryEndpoint<K extends keyof ZohoInventoryEndpointOutputs> =
	CorsairEndpoint<
		ZohoInventoryContext,
		ZohoInventoryEndpointInputs[K],
		ZohoInventoryEndpointOutputs[K]
	>;

export type ZohoInventoryEndpoints = {
	[K in keyof ZohoInventoryEndpointOutputs]: ZohoInventoryEndpoint<K>;
};

export const zohoInventoryEndpointsNested = {
	organizations: { list: OrganizationsEndpoints.list },
	items: {
		list: ItemsEndpoints.list,
		create: ItemsEndpoints.create,
		deactivate: ItemsEndpoints.deactivate,
		delete: ItemsEndpoints.delete,
		deleteImage: ItemsEndpoints.deleteImage,
	},
	itemGroups: {
		list: ItemGroupsEndpoints.list,
		create: ItemGroupsEndpoints.create,
		deactivate: ItemGroupsEndpoints.deactivate,
		delete: ItemGroupsEndpoints.delete,
	},
	compositeItems: { delete: CompositeItemsEndpoints.delete },
	contacts: {
		list: ContactsEndpoints.list,
		create: ContactsEndpoints.create,
		get: ContactsEndpoints.get,
		getAddress: ContactsEndpoints.getAddress,
		deactivate: ContactsEndpoints.deactivate,
		delete: ContactsEndpoints.delete,
		email: ContactsEndpoints.email,
		emailStatement: ContactsEndpoints.emailStatement,
		createPerson: ContactsEndpoints.createPerson,
		deletePerson: ContactsEndpoints.deletePerson,
	},
	currencies: { list: CurrenciesEndpoints.list },
	users: { getCurrent: UsersEndpoints.getCurrent },
	salesOrders: {
		list: SalesOrdersEndpoints.list,
		get: SalesOrdersEndpoints.get,
		create: SalesOrdersEndpoints.create,
		delete: SalesOrdersEndpoints.delete,
		bulkDelete: SalesOrdersEndpoints.bulkDelete,
	},
	invoices: {
		list: InvoicesEndpoints.list,
		create: InvoicesEndpoints.create,
		delete: InvoicesEndpoints.delete,
		addComment: InvoicesEndpoints.addComment,
		deleteComment: InvoicesEndpoints.deleteComment,
		addAttachment: InvoicesEndpoints.addAttachment,
		deleteAttachment: InvoicesEndpoints.deleteAttachment,
		email: InvoicesEndpoints.email,
		bulkEmail: InvoicesEndpoints.bulkEmail,
		bulkExport: InvoicesEndpoints.bulkExport,
		bulkPrint: InvoicesEndpoints.bulkPrint,
		cancelWriteOff: InvoicesEndpoints.cancelWriteOff,
		disablePaymentReminder: InvoicesEndpoints.disablePaymentReminder,
		enablePaymentReminder: InvoicesEndpoints.enablePaymentReminder,
		listPayments: InvoicesEndpoints.listPayments,
	},
	creditNotes: {
		list: CreditNotesEndpoints.list,
		get: CreditNotesEndpoints.get,
		create: CreditNotesEndpoints.create,
		addComment: CreditNotesEndpoints.addComment,
		email: CreditNotesEndpoints.email,
		getEmailContent: CreditNotesEndpoints.getEmailContent,
		applyCredits: CreditNotesEndpoints.applyCredits,
	},
	packages: {
		create: PackagesEndpoints.create,
		delete: PackagesEndpoints.delete,
		bulkPrint: PackagesEndpoints.bulkPrint,
	},
	purchaseOrders: {
		list: PurchaseOrdersEndpoints.list,
		create: PurchaseOrdersEndpoints.create,
	},
	bills: { list: BillsEndpoints.list, create: BillsEndpoints.create },
	customerPayments: { create: CustomerPaymentsEndpoints.create },
} as const;

export type ZohoInventoryBoundEndpoints = BindEndpoints<
	typeof zohoInventoryEndpointsNested
>;

const zohoInventoryWebhooksNested = {} as const;

const schema = <K extends keyof typeof ZohoInventoryEndpointInputSchemas>(
	key: K,
) => ({
	input: ZohoInventoryEndpointInputSchemas[key],
	output: ZohoInventoryEndpointOutputSchemas[key],
});

export const zohoInventoryEndpointSchemas = {
	'organizations.list': schema('organizationsList'),
	'items.list': schema('itemsList'),
	'items.create': schema('itemsCreate'),
	'items.deactivate': schema('itemsDeactivate'),
	'items.delete': schema('itemsDelete'),
	'items.deleteImage': schema('itemsDeleteImage'),
	'itemGroups.list': schema('itemGroupsList'),
	'itemGroups.create': schema('itemGroupsCreate'),
	'itemGroups.deactivate': schema('itemGroupsDeactivate'),
	'itemGroups.delete': schema('itemGroupsDelete'),
	'compositeItems.delete': schema('compositeItemsDelete'),
	'contacts.list': schema('contactsList'),
	'contacts.create': schema('contactsCreate'),
	'contacts.get': schema('contactsGet'),
	'contacts.getAddress': schema('contactsGetAddress'),
	'contacts.deactivate': schema('contactsDeactivate'),
	'contacts.delete': schema('contactsDelete'),
	'contacts.email': schema('contactsEmail'),
	'contacts.emailStatement': schema('contactsEmailStatement'),
	'contacts.createPerson': schema('contactsCreatePerson'),
	'contacts.deletePerson': schema('contactsDeletePerson'),
	'currencies.list': schema('currenciesList'),
	'users.getCurrent': schema('usersGetCurrent'),
	'salesOrders.list': schema('salesOrdersList'),
	'salesOrders.get': schema('salesOrdersGet'),
	'salesOrders.create': schema('salesOrdersCreate'),
	'salesOrders.delete': schema('salesOrdersDelete'),
	'salesOrders.bulkDelete': schema('salesOrdersBulkDelete'),
	'invoices.list': schema('invoicesList'),
	'invoices.create': schema('invoicesCreate'),
	'invoices.delete': schema('invoicesDelete'),
	'invoices.addComment': schema('invoicesAddComment'),
	'invoices.deleteComment': schema('invoicesDeleteComment'),
	'invoices.addAttachment': schema('invoicesAddAttachment'),
	'invoices.deleteAttachment': schema('invoicesDeleteAttachment'),
	'invoices.email': schema('invoicesEmail'),
	'invoices.bulkEmail': schema('invoicesBulkEmail'),
	'invoices.bulkExport': schema('invoicesBulkExport'),
	'invoices.bulkPrint': schema('invoicesBulkPrint'),
	'invoices.cancelWriteOff': schema('invoicesCancelWriteOff'),
	'invoices.disablePaymentReminder': schema('invoicesDisablePaymentReminder'),
	'invoices.enablePaymentReminder': schema('invoicesEnablePaymentReminder'),
	'invoices.listPayments': schema('invoicesListPayments'),
	'creditNotes.list': schema('creditNotesList'),
	'creditNotes.get': schema('creditNotesGet'),
	'creditNotes.create': schema('creditNotesCreate'),
	'creditNotes.addComment': schema('creditNotesAddComment'),
	'creditNotes.email': schema('creditNotesEmail'),
	'creditNotes.getEmailContent': schema('creditNotesGetEmailContent'),
	'creditNotes.applyCredits': schema('creditNotesApplyCredits'),
	'packages.create': schema('packagesCreate'),
	'packages.delete': schema('packagesDelete'),
	'packages.bulkPrint': schema('packagesBulkPrint'),
	'purchaseOrders.list': schema('purchaseOrdersList'),
	'purchaseOrders.create': schema('purchaseOrdersCreate'),
	'bills.list': schema('billsList'),
	'bills.create': schema('billsCreate'),
	'customerPayments.create': schema('customerPaymentsCreate'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof zohoInventoryEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const write = (description: string) =>
	({ riskLevel: 'write', description }) as const;
const destroy = (description: string) =>
	({
		riskLevel: 'destructive',
		irreversible: true,
		description: `${description} [DESTRUCTIVE · IRREVERSIBLE]`,
	}) as const;

const zohoInventoryEndpointMeta = {
	'organizations.list': read('List organizations the user can access'),
	'items.list': read('List inventory items'),
	'items.create': write('Create an inventory item'),
	'items.deactivate': write('Mark an item inactive'),
	'items.delete': destroy('Delete an item'),
	'items.deleteImage': destroy('Delete an item image'),
	'itemGroups.list': read('List item groups'),
	'itemGroups.create': write('Create an item group'),
	'itemGroups.deactivate': write('Mark an item group inactive'),
	'itemGroups.delete': destroy('Delete an item group'),
	'compositeItems.delete': destroy('Delete a composite item'),
	'contacts.list': read('List contacts'),
	'contacts.create': write('Create a contact'),
	'contacts.get': read('Get a contact'),
	'contacts.getAddress': read('Get a contact address'),
	'contacts.deactivate': write('Mark a contact inactive'),
	'contacts.delete': destroy('Delete a contact'),
	'contacts.email': write('Email a contact'),
	'contacts.emailStatement': write('Email a contact statement'),
	'contacts.createPerson': write('Create a contact person'),
	'contacts.deletePerson': destroy('Delete a contact person'),
	'currencies.list': read('List currencies'),
	'users.getCurrent': read('Get the current authenticated user'),
	'salesOrders.list': read('List sales orders'),
	'salesOrders.get': read('Get a sales order'),
	'salesOrders.create': write('Create a sales order'),
	'salesOrders.delete': destroy('Delete a sales order'),
	'salesOrders.bulkDelete': destroy('Bulk delete sales orders'),
	'invoices.list': read('List invoices'),
	'invoices.create': write('Create an invoice'),
	'invoices.delete': destroy('Delete an invoice'),
	'invoices.addComment': write('Add an invoice comment'),
	'invoices.deleteComment': destroy('Delete an invoice comment'),
	'invoices.addAttachment': write('Upload an invoice attachment'),
	'invoices.deleteAttachment': destroy('Delete an invoice attachment'),
	'invoices.email': write('Email an invoice'),
	'invoices.bulkEmail': write('Bulk email invoices'),
	'invoices.bulkExport': read('Bulk export invoices as PDF'),
	'invoices.bulkPrint': read('Bulk print invoices as PDF'),
	'invoices.cancelWriteOff': write('Cancel an invoice write-off'),
	'invoices.disablePaymentReminder': write('Disable invoice payment reminders'),
	'invoices.enablePaymentReminder': write('Enable invoice payment reminders'),
	'invoices.listPayments': read('List payments on an invoice'),
	'creditNotes.list': read('List credit notes'),
	'creditNotes.get': read('Get a credit note'),
	'creditNotes.create': write('Create a credit note'),
	'creditNotes.addComment': write('Add a credit note comment'),
	'creditNotes.email': write('Email a credit note'),
	'creditNotes.getEmailContent': read('Get credit note email content'),
	'creditNotes.applyCredits': write('Apply credit note credits to invoices'),
	'packages.create': write('Create a package for a sales order'),
	'packages.delete': destroy('Delete a package'),
	'packages.bulkPrint': read('Bulk print package slips as PDF'),
	'purchaseOrders.list': read('List purchase orders'),
	'purchaseOrders.create': write('Create a purchase order'),
	'bills.list': read('List bills'),
	'bills.create': write('Create a bill'),
	'customerPayments.create': write('Create a customer payment'),
} as const satisfies RequiredPluginEndpointMeta<
	typeof zohoInventoryEndpointsNested
>;

export type BaseZohoInventoryPlugin<T extends ZohoInventoryPluginOptions> =
	CorsairPlugin<
		'zohoinventory',
		typeof ZohoInventorySchema,
		typeof zohoInventoryEndpointsNested,
		typeof zohoInventoryWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof zohoInventoryAuthConfig
	>;

export type InternalZohoInventoryPlugin =
	BaseZohoInventoryPlugin<ZohoInventoryPluginOptions>;

export type ExternalZohoInventoryPlugin<T extends ZohoInventoryPluginOptions> =
	BaseZohoInventoryPlugin<T>;

export function zohoinventory<const T extends ZohoInventoryPluginOptions>(
	incomingOptions: ZohoInventoryPluginOptions &
		T = {} as ZohoInventoryPluginOptions & T,
): ExternalZohoInventoryPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const region = options.region;

	return {
		id: 'zohoinventory',
		schema: ZohoInventorySchema,
		options: options,
		authConfig: zohoInventoryAuthConfig,
		oauthConfig: {
			providerName: 'Zoho',
			authUrl: zohoInventoryOAuthAuthUrl(region),
			tokenUrl: zohoInventoryOAuthTokenUrl(region),
			scopes: ['ZohoInventory.FullAccess.all'],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: zohoInventoryEndpointsNested,
		webhooks: zohoInventoryWebhooksNested,
		endpointMeta: zohoInventoryEndpointMeta,
		endpointSchemas: zohoInventoryEndpointSchemas,
		webhookSchemas: undefined,
		pluginWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: resolveZohoInventoryOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ZohoInventoryKeyBuilderContext, source) => {
			const authType = ctx.authType;

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'zohoinventory',
					tokenUrl: zohoInventoryOAuthTokenUrl(ctx.options.region),
					tokenAuthMethod: 'body',
				});
			}

			if (ctx.authType === 'managed') {
				if (!ctx.hub) {
					throw new Error(
						'[auth-missing:zohoinventory:managed]: Hub config is required for managed auth. Pass hub: { ... } to createCorsair().',
					);
				}

				const managedContext = {
					keys: ctx.keys,
					hub: ctx.hub,
					plugin: 'zohoinventory',
					tenantId: ctx.tenantId,
				};

				const result = await getManagedAccessToken(managedContext);
				await attachManagedRefreshAuth(ctx, managedContext);
				return result.accessToken;
			}

			throw new Error(
				`[auth-missing:zohoinventory:${authType}]: Zoho Inventory key is missing`,
			);
		},
	} satisfies InternalZohoInventoryPlugin;
}

export type { ZohoInventoryRegion } from './client';
export type {
	ZohoInventoryEndpointInputs,
	ZohoInventoryEndpointOutputs,
} from './endpoints/types';
export { resolveZohoInventoryOAuthWebhookTenantLink } from './oauth-tenant-link';
export type { ZohoInventoryCredentials } from './schema';
export { ZohoInventorySchema } from './schema';
export type * from './types';
