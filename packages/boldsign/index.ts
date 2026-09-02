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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Brands, CustomFields, Documents, Helpers, Plan } from './endpoints';
import type {
	BoldsignEndpointInputs,
	BoldsignEndpointOutputs,
} from './endpoints/types';
import {
	BoldsignEndpointInputSchemas,
	BoldsignEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BoldsignSchema } from './schema';

export type BoldsignPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalBoldsignPlugin['hooks'];
	webhookHooks?: InternalBoldsignPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof boldsignEndpointsNested>;
};

export type BoldsignContext = CorsairPluginContext<
	typeof BoldsignSchema,
	BoldsignPluginOptions
>;

export type BoldsignKeyBuilderContext =
	KeyBuilderContext<BoldsignPluginOptions>;

export type BoldsignBoundEndpoints = BindEndpoints<
	typeof boldsignEndpointsNested
>;

type BoldsignEndpoint<K extends keyof BoldsignEndpointOutputs> =
	CorsairEndpoint<
		BoldsignContext,
		BoldsignEndpointInputs[K],
		BoldsignEndpointOutputs[K]
	>;

export type BoldsignEndpoints = {
	createCustomField: BoldsignEndpoint<'createCustomField'>;
	editCustomField: BoldsignEndpoint<'editCustomField'>;
	getBrandDetails: BoldsignEndpoint<'getBrandDetails'>;
	listBrands: BoldsignEndpoint<'listBrands'>;
	createEmbeddedRequestLink: BoldsignEndpoint<'createEmbeddedRequestLink'>;
	sendDocument: BoldsignEndpoint<'sendDocument'>;
	editDocumentBeta: BoldsignEndpoint<'editDocumentBeta'>;
	extendDocumentExpiry: BoldsignEndpoint<'extendDocumentExpiry'>;
	removeDocumentAuthentication: BoldsignEndpoint<'removeDocumentAuthentication'>;
	listDocuments: BoldsignEndpoint<'listDocuments'>;
	listBehalfDocuments: BoldsignEndpoint<'listBehalfDocuments'>;
	listTeamDocuments: BoldsignEndpoint<'listTeamDocuments'>;
	getApiCreditsCount: BoldsignEndpoint<'getApiCreditsCount'>;
	uploadFileHelper: BoldsignEndpoint<'uploadFileHelper'>;
};

export type BoldsignWebhooks = Record<string, never>;
export type BoldsignBoundWebhooks = Record<string, never>;

const boldsignEndpointsNested = {
	customFields: {
		create: CustomFields.create,
		edit: CustomFields.edit,
	},
	brands: {
		get: Brands.get,
		list: Brands.list,
	},
	documents: {
		createEmbeddedRequestLink: Documents.createEmbeddedRequestLink,
		send: Documents.send,
		editBeta: Documents.editBeta,
		extendExpiry: Documents.extendExpiry,
		removeAuthentication: Documents.removeAuthentication,
		list: Documents.list,
		listBehalf: Documents.listBehalf,
		listTeam: Documents.listTeam,
	},
	plan: {
		getApiCreditsCount: Plan.getApiCreditsCount,
	},
	helpers: {
		uploadFile: Helpers.uploadFile,
	},
} as const;

const boldsignWebhooksNested = {} as const;

export const boldsignEndpointSchemas = {
	'customFields.create': {
		input: BoldsignEndpointInputSchemas.createCustomField,
		output: BoldsignEndpointOutputSchemas.createCustomField,
	},
	'customFields.edit': {
		input: BoldsignEndpointInputSchemas.editCustomField,
		output: BoldsignEndpointOutputSchemas.editCustomField,
	},
	'brands.get': {
		input: BoldsignEndpointInputSchemas.getBrandDetails,
		output: BoldsignEndpointOutputSchemas.getBrandDetails,
	},
	'brands.list': {
		input: BoldsignEndpointInputSchemas.listBrands,
		output: BoldsignEndpointOutputSchemas.listBrands,
	},
	'documents.createEmbeddedRequestLink': {
		input: BoldsignEndpointInputSchemas.createEmbeddedRequestLink,
		output: BoldsignEndpointOutputSchemas.createEmbeddedRequestLink,
	},
	'documents.send': {
		input: BoldsignEndpointInputSchemas.sendDocument,
		output: BoldsignEndpointOutputSchemas.sendDocument,
	},
	'documents.editBeta': {
		input: BoldsignEndpointInputSchemas.editDocumentBeta,
		output: BoldsignEndpointOutputSchemas.editDocumentBeta,
	},
	'documents.extendExpiry': {
		input: BoldsignEndpointInputSchemas.extendDocumentExpiry,
		output: BoldsignEndpointOutputSchemas.extendDocumentExpiry,
	},
	'documents.removeAuthentication': {
		input: BoldsignEndpointInputSchemas.removeDocumentAuthentication,
		output: BoldsignEndpointOutputSchemas.removeDocumentAuthentication,
	},
	'documents.list': {
		input: BoldsignEndpointInputSchemas.listDocuments,
		output: BoldsignEndpointOutputSchemas.listDocuments,
	},
	'documents.listBehalf': {
		input: BoldsignEndpointInputSchemas.listBehalfDocuments,
		output: BoldsignEndpointOutputSchemas.listBehalfDocuments,
	},
	'documents.listTeam': {
		input: BoldsignEndpointInputSchemas.listTeamDocuments,
		output: BoldsignEndpointOutputSchemas.listTeamDocuments,
	},
	'plan.getApiCreditsCount': {
		input: BoldsignEndpointInputSchemas.getApiCreditsCount,
		output: BoldsignEndpointOutputSchemas.getApiCreditsCount,
	},
	'helpers.uploadFile': {
		input: BoldsignEndpointInputSchemas.uploadFileHelper,
		output: BoldsignEndpointOutputSchemas.uploadFileHelper,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof boldsignEndpointsNested
>;

const boldsignWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof boldsignWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const boldsignEndpointMeta = {
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a reusable custom field under a BoldSign brand.',
	},
	'customFields.edit': {
		riskLevel: 'write',
		description: 'Update a brand custom field by customFieldId.',
	},
	'brands.get': {
		riskLevel: 'read',
		description: 'Get details of one brand by brandId.',
	},
	'brands.list': {
		riskLevel: 'read',
		description: 'List all brands available to the account.',
	},
	'documents.createEmbeddedRequestLink': {
		riskLevel: 'write',
		description:
			'Create an embedded document request URL for draft/send flows.',
	},
	'documents.send': {
		riskLevel: 'write',
		description: 'Send a document for signature.',
	},
	'documents.editBeta': {
		riskLevel: 'write',
		description: 'Edit an existing document request (beta endpoint).',
	},
	'documents.extendExpiry': {
		riskLevel: 'write',
		description: 'Extend document expiry window for pending signers.',
	},
	'documents.removeAuthentication': {
		riskLevel: 'write',
		description: 'Remove signer authentication from a document recipient.',
	},
	'documents.list': {
		riskLevel: 'read',
		description: 'List documents with filters and pagination.',
	},
	'documents.listBehalf': {
		riskLevel: 'read',
		description: 'List documents sent on behalf of users.',
	},
	'documents.listTeam': {
		riskLevel: 'read',
		description: 'List documents across teams/users with filters.',
	},
	'plan.getApiCreditsCount': {
		riskLevel: 'read',
		description: 'Get remaining API credits count.',
	},
	'helpers.uploadFile': {
		riskLevel: 'read',
		description:
			'Prepare a file payload for BoldSign multipart/json send APIs using base64 data URI.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof boldsignEndpointsNested>;

export const boldsignAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseBoldsignPlugin<T extends BoldsignPluginOptions> = CorsairPlugin<
	'boldsign',
	typeof BoldsignSchema,
	typeof boldsignEndpointsNested,
	typeof boldsignWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBoldsignPlugin = BaseBoldsignPlugin<BoldsignPluginOptions>;

export type ExternalBoldsignPlugin<T extends BoldsignPluginOptions> =
	BaseBoldsignPlugin<T>;

export function boldsign<const T extends BoldsignPluginOptions>(
	incomingOptions: BoldsignPluginOptions & T = {} as BoldsignPluginOptions & T,
): ExternalBoldsignPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'boldsign',
		authConfig: boldsignAuthConfig,
		schema: BoldsignSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: boldsignEndpointsNested,
		webhooks: boldsignWebhooksNested,
		endpointMeta: boldsignEndpointMeta,
		endpointSchemas: boldsignEndpointSchemas,
		webhookSchemas: boldsignWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BoldsignKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				return '';
			}

			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					throw new AuthMissingError('boldsign', 'api_key');
				}
				return apiKey;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();
				if (!accessToken) {
					throw new AuthMissingError('boldsign', 'oauth_2');
				}
				return accessToken;
			}

			throw new AuthMissingError('boldsign', 'api_key');
		},
	} satisfies InternalBoldsignPlugin;
}

export type {
	BoldsignEndpointInputs,
	BoldsignEndpointOutputs,
} from './endpoints/types';
