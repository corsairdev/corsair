import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	batchesCreate,
	batchesGet,
	batchesList,
	batchesListItems,
	campaignsCancel,
	campaignsCopy,
	campaignsCreate,
	campaignsGet,
	campaignsGetUtm,
	campaignsList,
	campaignsRemove,
	campaignsRestoreToDraft,
	campaignsSend,
	campaignsSendTestEmail,
	campaignsSetUtm,
	campaignsUpdate,
	categoriesCreate,
	categoriesGet,
	categoriesList,
	categoriesRemove,
	categoriesUpdate,
	contactsAddTags,
	contactsGet,
	contactsList,
	contactsRemoveTags,
	contactsUpdate,
	contactsUpdateByEmail,
	contactsUpsert,
	emailContentGet,
	emailContentRender,
	emailContentReplace,
	eventsDefineSchema,
	eventsQueryMetadata,
	eventsSend,
	eventsUpdateSchema,
	productsCreate,
	productsGet,
	productsList,
	productsRemove,
	productsReplace,
	templatesCreate,
	templatesGet,
	templatesImportFromHtml,
	templatesList,
	templatesRemove,
	templatesRender,
	templatesReplace,
} from './endpoints';
import type {
	OmnisendEndpointInputs,
	OmnisendEndpointOutputs,
} from './endpoints/types';
import {
	OmnisendEndpointInputSchemas,
	OmnisendEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { OmnisendSchema } from './schema';

export type OmnisendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalOmnisendPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof omnisendEndpointsNested>;
};

export type OmnisendContext = CorsairPluginContext<
	typeof OmnisendSchema,
	OmnisendPluginOptions
>;

export type OmnisendKeyBuilderContext = KeyBuilderContext<OmnisendPluginOptions>;

export type OmnisendBoundEndpoints = BindEndpoints<
	typeof omnisendEndpointsNested
>;

type OmnisendEndpoint<K extends keyof OmnisendEndpointOutputs> = CorsairEndpoint<
	OmnisendContext,
	OmnisendEndpointInputs[K],
	OmnisendEndpointOutputs[K]
>;

export type OmnisendEndpoints = {
	contactsList: OmnisendEndpoint<'contactsList'>;
	contactsGet: OmnisendEndpoint<'contactsGet'>;
	contactsUpsert: OmnisendEndpoint<'contactsUpsert'>;
	contactsUpdate: OmnisendEndpoint<'contactsUpdate'>;
	contactsUpdateByEmail: OmnisendEndpoint<'contactsUpdateByEmail'>;
	contactsAddTags: OmnisendEndpoint<'contactsAddTags'>;
	contactsRemoveTags: OmnisendEndpoint<'contactsRemoveTags'>;
	campaignsList: OmnisendEndpoint<'campaignsList'>;
	campaignsGet: OmnisendEndpoint<'campaignsGet'>;
	campaignsCreate: OmnisendEndpoint<'campaignsCreate'>;
	campaignsUpdate: OmnisendEndpoint<'campaignsUpdate'>;
	campaignsRemove: OmnisendEndpoint<'campaignsRemove'>;
	campaignsSend: OmnisendEndpoint<'campaignsSend'>;
	campaignsCancel: OmnisendEndpoint<'campaignsCancel'>;
	campaignsCopy: OmnisendEndpoint<'campaignsCopy'>;
	campaignsRestoreToDraft: OmnisendEndpoint<'campaignsRestoreToDraft'>;
	campaignsSendTestEmail: OmnisendEndpoint<'campaignsSendTestEmail'>;
	campaignsGetUtm: OmnisendEndpoint<'campaignsGetUtm'>;
	campaignsSetUtm: OmnisendEndpoint<'campaignsSetUtm'>;
	eventsSend: OmnisendEndpoint<'eventsSend'>;
	eventsQueryMetadata: OmnisendEndpoint<'eventsQueryMetadata'>;
	eventsDefineSchema: OmnisendEndpoint<'eventsDefineSchema'>;
	eventsUpdateSchema: OmnisendEndpoint<'eventsUpdateSchema'>;
	productsList: OmnisendEndpoint<'productsList'>;
	productsGet: OmnisendEndpoint<'productsGet'>;
	productsCreate: OmnisendEndpoint<'productsCreate'>;
	productsReplace: OmnisendEndpoint<'productsReplace'>;
	productsRemove: OmnisendEndpoint<'productsRemove'>;
	categoriesList: OmnisendEndpoint<'categoriesList'>;
	categoriesGet: OmnisendEndpoint<'categoriesGet'>;
	categoriesCreate: OmnisendEndpoint<'categoriesCreate'>;
	categoriesUpdate: OmnisendEndpoint<'categoriesUpdate'>;
	categoriesRemove: OmnisendEndpoint<'categoriesRemove'>;
	templatesList: OmnisendEndpoint<'templatesList'>;
	templatesGet: OmnisendEndpoint<'templatesGet'>;
	templatesCreate: OmnisendEndpoint<'templatesCreate'>;
	templatesReplace: OmnisendEndpoint<'templatesReplace'>;
	templatesRemove: OmnisendEndpoint<'templatesRemove'>;
	templatesImportFromHtml: OmnisendEndpoint<'templatesImportFromHtml'>;
	templatesRender: OmnisendEndpoint<'templatesRender'>;
	emailContentGet: OmnisendEndpoint<'emailContentGet'>;
	emailContentReplace: OmnisendEndpoint<'emailContentReplace'>;
	emailContentRender: OmnisendEndpoint<'emailContentRender'>;
	batchesCreate: OmnisendEndpoint<'batchesCreate'>;
	batchesList: OmnisendEndpoint<'batchesList'>;
	batchesGet: OmnisendEndpoint<'batchesGet'>;
	batchesListItems: OmnisendEndpoint<'batchesListItems'>;
};

const omnisendEndpointsNested = {
	contacts: {
		list: contactsList,
		get: contactsGet,
		upsert: contactsUpsert,
		update: contactsUpdate,
		updateByEmail: contactsUpdateByEmail,
		addTags: contactsAddTags,
		removeTags: contactsRemoveTags,
	},
	campaigns: {
		list: campaignsList,
		get: campaignsGet,
		create: campaignsCreate,
		update: campaignsUpdate,
		delete: campaignsRemove,
		send: campaignsSend,
		cancel: campaignsCancel,
		copy: campaignsCopy,
		restoreToDraft: campaignsRestoreToDraft,
		sendTestEmail: campaignsSendTestEmail,
		getUtm: campaignsGetUtm,
		setUtm: campaignsSetUtm,
	},
	events: {
		send: eventsSend,
		queryMetadata: eventsQueryMetadata,
		defineSchema: eventsDefineSchema,
		updateSchema: eventsUpdateSchema,
	},
	products: {
		list: productsList,
		get: productsGet,
		create: productsCreate,
		replace: productsReplace,
		delete: productsRemove,
	},
	categories: {
		list: categoriesList,
		get: categoriesGet,
		create: categoriesCreate,
		update: categoriesUpdate,
		delete: categoriesRemove,
	},
	templates: {
		list: templatesList,
		get: templatesGet,
		create: templatesCreate,
		replace: templatesReplace,
		delete: templatesRemove,
		importFromHtml: templatesImportFromHtml,
		render: templatesRender,
	},
	emailContent: {
		get: emailContentGet,
		replace: emailContentReplace,
		render: emailContentRender,
	},
	batches: {
		create: batchesCreate,
		list: batchesList,
		get: batchesGet,
		listItems: batchesListItems,
	},
} as const;

export const omnisendEndpointSchemas = {
	'contacts.list': {
		input: OmnisendEndpointInputSchemas.contactsList,
		output: OmnisendEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: OmnisendEndpointInputSchemas.contactsGet,
		output: OmnisendEndpointOutputSchemas.contactsGet,
	},
	'contacts.upsert': {
		input: OmnisendEndpointInputSchemas.contactsUpsert,
		output: OmnisendEndpointOutputSchemas.contactsUpsert,
	},
	'contacts.update': {
		input: OmnisendEndpointInputSchemas.contactsUpdate,
		output: OmnisendEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.updateByEmail': {
		input: OmnisendEndpointInputSchemas.contactsUpdateByEmail,
		output: OmnisendEndpointOutputSchemas.contactsUpdateByEmail,
	},
	'contacts.addTags': {
		input: OmnisendEndpointInputSchemas.contactsAddTags,
		output: OmnisendEndpointOutputSchemas.contactsAddTags,
	},
	'contacts.removeTags': {
		input: OmnisendEndpointInputSchemas.contactsRemoveTags,
		output: OmnisendEndpointOutputSchemas.contactsRemoveTags,
	},
	'campaigns.list': {
		input: OmnisendEndpointInputSchemas.campaignsList,
		output: OmnisendEndpointOutputSchemas.campaignsList,
	},
	'campaigns.get': {
		input: OmnisendEndpointInputSchemas.campaignsGet,
		output: OmnisendEndpointOutputSchemas.campaignsGet,
	},
	'campaigns.create': {
		input: OmnisendEndpointInputSchemas.campaignsCreate,
		output: OmnisendEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: OmnisendEndpointInputSchemas.campaignsUpdate,
		output: OmnisendEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.delete': {
		input: OmnisendEndpointInputSchemas.campaignsRemove,
		output: OmnisendEndpointOutputSchemas.campaignsRemove,
	},
	'campaigns.send': {
		input: OmnisendEndpointInputSchemas.campaignsSend,
		output: OmnisendEndpointOutputSchemas.campaignsSend,
	},
	'campaigns.cancel': {
		input: OmnisendEndpointInputSchemas.campaignsCancel,
		output: OmnisendEndpointOutputSchemas.campaignsCancel,
	},
	'campaigns.copy': {
		input: OmnisendEndpointInputSchemas.campaignsCopy,
		output: OmnisendEndpointOutputSchemas.campaignsCopy,
	},
	'campaigns.restoreToDraft': {
		input: OmnisendEndpointInputSchemas.campaignsRestoreToDraft,
		output: OmnisendEndpointOutputSchemas.campaignsRestoreToDraft,
	},
	'campaigns.sendTestEmail': {
		input: OmnisendEndpointInputSchemas.campaignsSendTestEmail,
		output: OmnisendEndpointOutputSchemas.campaignsSendTestEmail,
	},
	'campaigns.getUtm': {
		input: OmnisendEndpointInputSchemas.campaignsGetUtm,
		output: OmnisendEndpointOutputSchemas.campaignsGetUtm,
	},
	'campaigns.setUtm': {
		input: OmnisendEndpointInputSchemas.campaignsSetUtm,
		output: OmnisendEndpointOutputSchemas.campaignsSetUtm,
	},
	'events.send': {
		input: OmnisendEndpointInputSchemas.eventsSend,
		output: OmnisendEndpointOutputSchemas.eventsSend,
	},
	'events.queryMetadata': {
		input: OmnisendEndpointInputSchemas.eventsQueryMetadata,
		output: OmnisendEndpointOutputSchemas.eventsQueryMetadata,
	},
	'events.defineSchema': {
		input: OmnisendEndpointInputSchemas.eventsDefineSchema,
		output: OmnisendEndpointOutputSchemas.eventsDefineSchema,
	},
	'events.updateSchema': {
		input: OmnisendEndpointInputSchemas.eventsUpdateSchema,
		output: OmnisendEndpointOutputSchemas.eventsUpdateSchema,
	},
	'products.list': {
		input: OmnisendEndpointInputSchemas.productsList,
		output: OmnisendEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: OmnisendEndpointInputSchemas.productsGet,
		output: OmnisendEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: OmnisendEndpointInputSchemas.productsCreate,
		output: OmnisendEndpointOutputSchemas.productsCreate,
	},
	'products.replace': {
		input: OmnisendEndpointInputSchemas.productsReplace,
		output: OmnisendEndpointOutputSchemas.productsReplace,
	},
	'products.delete': {
		input: OmnisendEndpointInputSchemas.productsRemove,
		output: OmnisendEndpointOutputSchemas.productsRemove,
	},
	'categories.list': {
		input: OmnisendEndpointInputSchemas.categoriesList,
		output: OmnisendEndpointOutputSchemas.categoriesList,
	},
	'categories.get': {
		input: OmnisendEndpointInputSchemas.categoriesGet,
		output: OmnisendEndpointOutputSchemas.categoriesGet,
	},
	'categories.create': {
		input: OmnisendEndpointInputSchemas.categoriesCreate,
		output: OmnisendEndpointOutputSchemas.categoriesCreate,
	},
	'categories.update': {
		input: OmnisendEndpointInputSchemas.categoriesUpdate,
		output: OmnisendEndpointOutputSchemas.categoriesUpdate,
	},
	'categories.delete': {
		input: OmnisendEndpointInputSchemas.categoriesRemove,
		output: OmnisendEndpointOutputSchemas.categoriesRemove,
	},
	'templates.list': {
		input: OmnisendEndpointInputSchemas.templatesList,
		output: OmnisendEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: OmnisendEndpointInputSchemas.templatesGet,
		output: OmnisendEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: OmnisendEndpointInputSchemas.templatesCreate,
		output: OmnisendEndpointOutputSchemas.templatesCreate,
	},
	'templates.replace': {
		input: OmnisendEndpointInputSchemas.templatesReplace,
		output: OmnisendEndpointOutputSchemas.templatesReplace,
	},
	'templates.delete': {
		input: OmnisendEndpointInputSchemas.templatesRemove,
		output: OmnisendEndpointOutputSchemas.templatesRemove,
	},
	'templates.importFromHtml': {
		input: OmnisendEndpointInputSchemas.templatesImportFromHtml,
		output: OmnisendEndpointOutputSchemas.templatesImportFromHtml,
	},
	'templates.render': {
		input: OmnisendEndpointInputSchemas.templatesRender,
		output: OmnisendEndpointOutputSchemas.templatesRender,
	},
	'emailContent.get': {
		input: OmnisendEndpointInputSchemas.emailContentGet,
		output: OmnisendEndpointOutputSchemas.emailContentGet,
	},
	'emailContent.replace': {
		input: OmnisendEndpointInputSchemas.emailContentReplace,
		output: OmnisendEndpointOutputSchemas.emailContentReplace,
	},
	'emailContent.render': {
		input: OmnisendEndpointInputSchemas.emailContentRender,
		output: OmnisendEndpointOutputSchemas.emailContentRender,
	},
	'batches.create': {
		input: OmnisendEndpointInputSchemas.batchesCreate,
		output: OmnisendEndpointOutputSchemas.batchesCreate,
	},
	'batches.list': {
		input: OmnisendEndpointInputSchemas.batchesList,
		output: OmnisendEndpointOutputSchemas.batchesList,
	},
	'batches.get': {
		input: OmnisendEndpointInputSchemas.batchesGet,
		output: OmnisendEndpointOutputSchemas.batchesGet,
	},
	'batches.listItems': {
		input: OmnisendEndpointInputSchemas.batchesListItems,
		output: OmnisendEndpointOutputSchemas.batchesListItems,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof omnisendEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const omnisendEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description:
			'Page the brand contacts, filtered by email, phone, status, segment or tag',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by id, with its identifiers and consents',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description:
			'Create a contact, or update the one an identifier already matches; sent tags replace the existing ones',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Change a contact by id; sent tags replace the existing ones, so removing one tag means sending the rest',
	},
	'contacts.updateByEmail': {
		riskLevel: 'write',
		description:
			'Change the contact an email address matches; sent tags replace the existing ones',
	},
	'contacts.addTags': {
		riskLevel: 'write',
		description:
			'Queue tags onto up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags appear shortly after',
	},
	'contacts.removeTags': {
		riskLevel: 'write',
		description:
			'Queue tag removal for up to 250 contacts by id, email or phone, or every contact in a segment; the route answers 202 and the tags disappear shortly after',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description:
			'Page the campaigns, filtered by status, channel, type, name or dates',
	},
	'campaigns.get': {
		riskLevel: 'read',
		description:
			'Read one campaign by id, with its content and sending settings',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description:
			'Create a campaign; a regular email campaign needs a template id, and creating with no verified sender answers 422',
	},
	'campaigns.update': {
		riskLevel: 'write',
		description:
			'Change a draft campaign; started or scheduled campaigns answer 409',
	},
	'campaigns.delete': {
		riskLevel: 'destructive',
		description: 'Delete a campaign; it cannot be restored',
		irreversible: true,
	},
	'campaigns.send': {
		riskLevel: 'write',
		description:
			'Send a draft campaign to its audience. This cannot be undone, and it answers 402 when the audience exceeds the billing tier',
		irreversible: true,
	},
	'campaigns.cancel': {
		riskLevel: 'write',
		description:
			'Cancel a scheduled, paused or started-email campaign; sent campaigns cannot be canceled',
	},
	'campaigns.copy': {
		riskLevel: 'write',
		description: 'Duplicate a campaign as a new draft',
	},
	'campaigns.restoreToDraft': {
		riskLevel: 'write',
		description: 'Move a scheduled campaign back to draft',
	},
	'campaigns.sendTestEmail': {
		riskLevel: 'write',
		description:
			'Render a campaign and email it to 1-5 addresses, so no customer receives it',
	},
	'campaigns.getUtm': {
		riskLevel: 'read',
		description: 'Read the UTM tags stamped on a campaign links',
	},
	'campaigns.setUtm': {
		riskLevel: 'write',
		description: 'Set the UTM tags stamped on a campaign links',
	},
	'events.send': {
		riskLevel: 'write',
		description:
			'Record an event for a contact, which creates or updates that contact and can trigger automations that email real customers. The event is queued (202) and append-only: it cannot be edited, read back or deleted',
		irreversible: true,
	},
	'events.queryMetadata': {
		riskLevel: 'read',
		description:
			'List the event schemas the brand knows, per category, with their declared property types',
	},
	'events.defineSchema': {
		riskLevel: 'write',
		description:
			'Declare a custom event schema and its property types; a type, once declared, cannot change',
	},
	'events.updateSchema': {
		riskLevel: 'write',
		description:
			'Merge changes into an event schema; the properties present change and none are deleted, and a declared type cannot change',
	},
	'products.list': {
		riskLevel: 'read',
		description: 'Page the catalog products, filtered by title or dates',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Read one product by your own product ID, with its variants and prices',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a catalog product with at least one variant; prices are floats in the store currency',
	},
	'products.replace': {
		riskLevel: 'write',
		description:
			'Replace a product in full; omitted fields drop to their defaults',
	},
	'products.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product from the catalog',
		irreversible: true,
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'Page the product categories',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Read one product category by your own category ID',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a product category under your own category ID',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Rename a product category',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a product category',
		irreversible: true,
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'Page the email templates, filtered by name',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Read one email template by id, with its sections and styles',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create an email template with a name and editor sections',
	},
	'templates.replace': {
		riskLevel: 'write',
		description:
			'Replace an email template in full; omitted fields drop to their defaults',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Delete an email template',
		irreversible: true,
	},
	'templates.importFromHtml': {
		riskLevel: 'write',
		description:
			'Import raw HTML, up to 1 MB, as a new email template Omnisend converts to editor sections',
	},
	'templates.render': {
		riskLevel: 'read',
		description:
			'Render a template to its HTML for preview; nothing is sent and no state changes',
	},
	'emailContent.get': {
		riskLevel: 'read',
		description: 'Read the content of a campaign email by id',
	},
	'emailContent.replace': {
		riskLevel: 'write',
		description:
			'Replace a campaign email content in full; omitted fields drop to their defaults',
	},
	'emailContent.render': {
		riskLevel: 'read',
		description:
			'Render a campaign email to its HTML for preview; nothing is sent and no state changes',
	},
	'batches.create': {
		riskLevel: 'write',
		description:
			'Queue up to 100 contact, product, category or event writes that Omnisend applies one by one, and read the batch back with batches.get until it is finished or stopped',
		job: {
			idPath: 'batchID',
			status: {
				op: 'batches.get',
				idArg: 'id',
				statusPath: 'status',
				done: ['finished'],
				failed: ['stopped'],
			},
		},
	},
	'batches.list': {
		riskLevel: 'read',
		description:
			'Page the batches for one endpoint; categories batches cannot be listed',
	},
	'batches.get': {
		riskLevel: 'read',
		description:
			'Read a batch status and counts; pending and inProgress mean it still runs, finished and stopped mean it ended',
	},
	'batches.listItems': {
		riskLevel: 'read',
		description:
			'Read the per-item requests, responses and errors of a batch',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof omnisendEndpointsNested>;

export type BaseOmnisendPlugin<T extends OmnisendPluginOptions> = CorsairPlugin<
	'omnisend',
	typeof OmnisendSchema,
	typeof omnisendEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalOmnisendPlugin = BaseOmnisendPlugin<OmnisendPluginOptions>;

export type ExternalOmnisendPlugin<T extends OmnisendPluginOptions> =
	BaseOmnisendPlugin<T>;

export function omnisend<const T extends OmnisendPluginOptions>(
	incomingOptions: OmnisendPluginOptions & T = {} as OmnisendPluginOptions & T,
): ExternalOmnisendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'omnisend',
		schema: OmnisendSchema,
		options: options,
		hooks: options.hooks,
		endpoints: omnisendEndpointsNested,
		// Omnisend sends no inbound webhooks, and the REST API exposes no
		// webhook registrations to manage.
		webhooks: {},
		endpointMeta: omnisendEndpointMeta,
		endpointSchemas: omnisendEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: OmnisendKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('omnisend', ctx.authType ?? 'api_key');
		},
	} satisfies InternalOmnisendPlugin;
}

export { OmnisendAPIError } from './client';

export type {
	OmnisendEndpointInputs,
	OmnisendEndpointOutputs,
} from './endpoints/types';
