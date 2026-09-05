import type {
	AuthTypes,
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
import { AuthMissingError } from 'corsair/core';
import {
	CatalogEndpoints,
	ContactsEndpoints,
	MessagingEndpoints,
} from './endpoints';
import type {
	DripcelEndpointInputs,
	DripcelEndpointOutputs,
} from './endpoints/types';
import {
	DripcelEndpointInputSchemas,
	DripcelEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DripcelSchema } from './schema';

export type DripcelPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDripcelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dripcelEndpointsNested>;
};

export type DripcelContext = CorsairPluginContext<
	typeof DripcelSchema,
	DripcelPluginOptions
>;

export type DripcelKeyBuilderContext = KeyBuilderContext<DripcelPluginOptions>;

export type DripcelBoundEndpoints = BindEndpoints<
	typeof dripcelEndpointsNested
>;

type DripcelEndpoint<K extends keyof DripcelEndpointOutputs> = CorsairEndpoint<
	DripcelContext,
	DripcelEndpointInputs[K],
	DripcelEndpointOutputs[K]
>;

export type DripcelEndpoints = {
	getContact: DripcelEndpoint<'getContact'>;
	createContacts: DripcelEndpoint<'createContacts'>;
	upsertContacts: DripcelEndpoint<'upsertContacts'>;
	deleteContact: DripcelEndpoint<'deleteContact'>;
	addContactTags: DripcelEndpoint<'addContactTags'>;
	optOutContact: DripcelEndpoint<'optOutContact'>;
	checkCompliance: DripcelEndpoint<'checkCompliance'>;
	listDeliveries: DripcelEndpoint<'listDeliveries'>;
	listCampaigns: DripcelEndpoint<'listCampaigns'>;
	getBalance: DripcelEndpoint<'getBalance'>;
	listEmailTemplates: DripcelEndpoint<'listEmailTemplates'>;
	uploadSales: DripcelEndpoint<'uploadSales'>;
	listTags: DripcelEndpoint<'listTags'>;
	deleteTag: DripcelEndpoint<'deleteTag'>;
	searchReplies: DripcelEndpoint<'searchReplies'>;
	searchSendLogs: DripcelEndpoint<'searchSendLogs'>;
	sendSms: DripcelEndpoint<'sendSms'>;
	sendBulkEmail: DripcelEndpoint<'sendBulkEmail'>;
};

const dripcelEndpointsNested = {
	contacts: {
		get: ContactsEndpoints.get,
		create: ContactsEndpoints.create,
		upsert: ContactsEndpoints.upsert,
		delete: ContactsEndpoints.delete,
		addTags: ContactsEndpoints.addTags,
		optOut: ContactsEndpoints.optOut,
	},
	compliance: {
		checkSend: MessagingEndpoints.checkSend,
	},
	deliveries: {
		list: MessagingEndpoints.listDeliveries,
	},
	campaigns: {
		list: CatalogEndpoints.listCampaigns,
	},
	balance: {
		get: CatalogEndpoints.getBalance,
	},
	emailTemplates: {
		list: CatalogEndpoints.listEmailTemplates,
	},
	sales: {
		upload: CatalogEndpoints.uploadSales,
	},
	tags: {
		list: CatalogEndpoints.listTags,
		delete: CatalogEndpoints.deleteTag,
	},
	replies: {
		search: MessagingEndpoints.searchReplies,
	},
	sendLogs: {
		search: MessagingEndpoints.searchSendLogs,
	},
	send: {
		sms: MessagingEndpoints.sms,
		bulkEmail: MessagingEndpoints.bulkEmail,
	},
} as const;

export const dripcelEndpointSchemas = {
	'contacts.get': {
		input: DripcelEndpointInputSchemas.getContact,
		output: DripcelEndpointOutputSchemas.getContact,
	},
	'contacts.create': {
		input: DripcelEndpointInputSchemas.createContacts,
		output: DripcelEndpointOutputSchemas.createContacts,
	},
	'contacts.upsert': {
		input: DripcelEndpointInputSchemas.upsertContacts,
		output: DripcelEndpointOutputSchemas.upsertContacts,
	},
	'contacts.delete': {
		input: DripcelEndpointInputSchemas.deleteContact,
		output: DripcelEndpointOutputSchemas.deleteContact,
	},
	'contacts.addTags': {
		input: DripcelEndpointInputSchemas.addContactTags,
		output: DripcelEndpointOutputSchemas.addContactTags,
	},
	'contacts.optOut': {
		input: DripcelEndpointInputSchemas.optOutContact,
		output: DripcelEndpointOutputSchemas.optOutContact,
	},
	'compliance.checkSend': {
		input: DripcelEndpointInputSchemas.checkCompliance,
		output: DripcelEndpointOutputSchemas.checkCompliance,
	},
	'deliveries.list': {
		input: DripcelEndpointInputSchemas.listDeliveries,
		output: DripcelEndpointOutputSchemas.listDeliveries,
	},
	'campaigns.list': {
		input: DripcelEndpointInputSchemas.listCampaigns,
		output: DripcelEndpointOutputSchemas.listCampaigns,
	},
	'balance.get': {
		input: DripcelEndpointInputSchemas.getBalance,
		output: DripcelEndpointOutputSchemas.getBalance,
	},
	'emailTemplates.list': {
		input: DripcelEndpointInputSchemas.listEmailTemplates,
		output: DripcelEndpointOutputSchemas.listEmailTemplates,
	},
	'sales.upload': {
		input: DripcelEndpointInputSchemas.uploadSales,
		output: DripcelEndpointOutputSchemas.uploadSales,
	},
	'tags.list': {
		input: DripcelEndpointInputSchemas.listTags,
		output: DripcelEndpointOutputSchemas.listTags,
	},
	'tags.delete': {
		input: DripcelEndpointInputSchemas.deleteTag,
		output: DripcelEndpointOutputSchemas.deleteTag,
	},
	'replies.search': {
		input: DripcelEndpointInputSchemas.searchReplies,
		output: DripcelEndpointOutputSchemas.searchReplies,
	},
	'sendLogs.search': {
		input: DripcelEndpointInputSchemas.searchSendLogs,
		output: DripcelEndpointOutputSchemas.searchSendLogs,
	},
	'send.sms': {
		input: DripcelEndpointInputSchemas.sendSms,
		output: DripcelEndpointOutputSchemas.sendSms,
	},
	'send.bulkEmail': {
		input: DripcelEndpointInputSchemas.sendBulkEmail,
		output: DripcelEndpointOutputSchemas.sendBulkEmail,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof dripcelEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const dripcelEndpointMeta = {
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a Dripcel contact by cell number (MSISDN)',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create new Dripcel contacts in bulk (POST /contacts)',
	},
	'contacts.upsert': {
		riskLevel: 'write',
		description: 'Create or update Dripcel contacts in bulk (PUT /contacts)',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Dripcel contact by cell number',
	},
	'contacts.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a Dripcel contact by cell number',
	},
	'contacts.optOut': {
		riskLevel: 'write',
		description: 'Opt a Dripcel contact out of campaigns',
	},
	'compliance.checkSend': {
		riskLevel: 'read',
		description: 'Check whether phone numbers may receive SMS',
	},
	'deliveries.list': {
		riskLevel: 'read',
		description: 'List Dripcel deliveries by cell or send customerId',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List Dripcel campaigns',
	},
	'balance.get': {
		riskLevel: 'read',
		description: 'Get the current Dripcel credit balance',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description: 'List Dripcel email templates',
	},
	'sales.upload': {
		riskLevel: 'write',
		description: 'Upload sales to Dripcel (POST /sales)',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List all Dripcel tags',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: 'Delete a Dripcel tag by ID',
	},
	'replies.search': {
		riskLevel: 'read',
		description: 'Search Dripcel message replies',
	},
	'sendLogs.search': {
		riskLevel: 'read',
		description: 'Search Dripcel send logs',
	},
	'send.sms': {
		riskLevel: 'write',
		description: 'Send a single SMS via Dripcel',
	},
	'send.bulkEmail': {
		riskLevel: 'write',
		description: 'Send bulk email via a Dripcel template',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dripcelEndpointsNested>;

export const dripcelAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDripcelPlugin<T extends DripcelPluginOptions> = CorsairPlugin<
	'dripcel',
	typeof DripcelSchema,
	typeof dripcelEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalDripcelPlugin = BaseDripcelPlugin<DripcelPluginOptions>;

export type ExternalDripcelPlugin<T extends DripcelPluginOptions> =
	BaseDripcelPlugin<T>;

export function dripcel<const T extends DripcelPluginOptions>(
	incomingOptions: DripcelPluginOptions & T = {} as DripcelPluginOptions & T,
): ExternalDripcelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'dripcel',
		authConfig: dripcelAuthConfig,
		schema: DripcelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: dripcelEndpointsNested,
		webhooks: {},
		endpointMeta: dripcelEndpointMeta,
		endpointSchemas: dripcelEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: DripcelKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('dripcel', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('dripcel', 'api_key');
		},
	} satisfies InternalDripcelPlugin;
}

export {
	DripcelAPIError,
	DripcelRateLimitError,
	makeDripcelRequest,
} from './client';
export type {
	DripcelEndpointInputs,
	DripcelEndpointOutputs,
} from './endpoints/types';
