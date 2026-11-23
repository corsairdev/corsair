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
import { AuthMissingError } from 'corsair/core';
import { Account, Datasets, Deployments, Reports } from './endpoints';
import type {
	MopinionEndpointInputs,
	MopinionEndpointOutputs,
} from './endpoints/types';
import {
	MopinionEndpointInputSchemas,
	MopinionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MopinionSchema } from './schema';

export type MopinionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The public key identifying the API application. */
	publicKey?: string;
	/** The signature token used to sign each request. */
	signatureToken?: string;
	hooks?: InternalMopinionPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof mopinionEndpointsNested>;
};

export type MopinionContext = CorsairPluginContext<
	typeof MopinionSchema,
	MopinionPluginOptions,
	undefined,
	typeof mopinionAuthConfig
>;

export type MopinionKeyBuilderContext = KeyBuilderContext<
	MopinionPluginOptions,
	typeof mopinionAuthConfig
>;

export type MopinionBoundEndpoints = BindEndpoints<
	typeof mopinionEndpointsNested
>;

type MopinionEndpoint<K extends keyof MopinionEndpointOutputs> =
	CorsairEndpoint<
		MopinionContext,
		MopinionEndpointInputs[K],
		MopinionEndpointOutputs[K]
	>;

export type MopinionEndpoints = {
	accountGet: MopinionEndpoint<'accountGet'>;
	datasetsGet: MopinionEndpoint<'datasetsGet'>;
	datasetsFields: MopinionEndpoint<'datasetsFields'>;
	datasetsFeedback: MopinionEndpoint<'datasetsFeedback'>;
	datasetsFeedbackItem: MopinionEndpoint<'datasetsFeedbackItem'>;
	reportsGet: MopinionEndpoint<'reportsGet'>;
	reportsFields: MopinionEndpoint<'reportsFields'>;
	reportsFeedback: MopinionEndpoint<'reportsFeedback'>;
	reportsFeedbackItem: MopinionEndpoint<'reportsFeedbackItem'>;
	deploymentsList: MopinionEndpoint<'deploymentsList'>;
	deploymentsGet: MopinionEndpoint<'deploymentsGet'>;
};

const mopinionEndpointsNested = {
	account: {
		get: Account.get,
	},
	datasets: {
		get: Datasets.get,
		feedback: Datasets.feedback,
		feedbackItem: Datasets.feedbackItem,
		fields: Datasets.fields,
	},
	deployments: {
		list: Deployments.list,
		get: Deployments.get,
	},
	reports: {
		get: Reports.get,
		feedback: Reports.feedback,
		feedbackItem: Reports.feedbackItem,
		fields: Reports.fields,
	},
} as const;

export const mopinionEndpointSchemas = {
	'account.get': {
		input: MopinionEndpointInputSchemas.accountGet,
		output: MopinionEndpointOutputSchemas.accountGet,
	},
	'datasets.get': {
		input: MopinionEndpointInputSchemas.datasetsGet,
		output: MopinionEndpointOutputSchemas.datasetsGet,
	},
	'datasets.fields': {
		input: MopinionEndpointInputSchemas.datasetsFields,
		output: MopinionEndpointOutputSchemas.datasetsFields,
	},
	'datasets.feedback': {
		input: MopinionEndpointInputSchemas.datasetsFeedback,
		output: MopinionEndpointOutputSchemas.datasetsFeedback,
	},
	'datasets.feedbackItem': {
		input: MopinionEndpointInputSchemas.datasetsFeedbackItem,
		output: MopinionEndpointOutputSchemas.datasetsFeedbackItem,
	},
	'deployments.list': {
		input: MopinionEndpointInputSchemas.deploymentsList,
		output: MopinionEndpointOutputSchemas.deploymentsList,
	},
	'deployments.get': {
		input: MopinionEndpointInputSchemas.deploymentsGet,
		output: MopinionEndpointOutputSchemas.deploymentsGet,
	},
	'reports.get': {
		input: MopinionEndpointInputSchemas.reportsGet,
		output: MopinionEndpointOutputSchemas.reportsGet,
	},
	'reports.fields': {
		input: MopinionEndpointInputSchemas.reportsFields,
		output: MopinionEndpointOutputSchemas.reportsFields,
	},
	'reports.feedback': {
		input: MopinionEndpointInputSchemas.reportsFeedback,
		output: MopinionEndpointOutputSchemas.reportsFeedback,
	},
	'reports.feedbackItem': {
		input: MopinionEndpointInputSchemas.reportsFeedbackItem,
		output: MopinionEndpointOutputSchemas.reportsFeedbackItem,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof mopinionEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const mopinionEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Read the account data behind the signed credentials',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Read basic info on one feedback dataset',
	},
	'datasets.fields': {
		riskLevel: 'read',
		description: 'Read the field definitions of a dataset',
	},
	'datasets.feedback': {
		riskLevel: 'read',
		description:
			'List the feedback items of a dataset, one page at a time, with Mopinion filter expressions for date, rating, NPS, CES, GCR and tags',
	},
	'datasets.feedbackItem': {
		riskLevel: 'read',
		description: 'Read one feedback item of a dataset',
	},
	'deployments.list': {
		riskLevel: 'read',
		description: 'List the deployments (feedback collection forms)',
	},
	'deployments.get': {
		riskLevel: 'read',
		description: 'Read one deployment',
	},
	'reports.get': {
		riskLevel: 'read',
		description: 'Read basic info on one report',
	},
	'reports.fields': {
		riskLevel: 'read',
		description: 'Read the field definitions of a report',
	},
	'reports.feedback': {
		riskLevel: 'read',
		description:
			'List the feedback items behind a report, one page at a time, with Mopinion filter expressions for date, rating, NPS, CES, GCR and tags',
	},
	'reports.feedbackItem': {
		riskLevel: 'read',
		description: 'Read one feedback item of a report',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof mopinionEndpointsNested>;

/**
 * Mopinion signs every request with an HMAC over the request path and body,
 * so the account stores the public key and the signature token. The private
 * key used to mint signature tokens via GET /token is not wrapped.
 */
export const mopinionAuthConfig = {
	api_key: {
		account: ['public_key', 'signature_token'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseMopinionPlugin<T extends MopinionPluginOptions> = CorsairPlugin<
	'mopinion',
	typeof MopinionSchema,
	typeof mopinionEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof mopinionAuthConfig
>;

export type InternalMopinionPlugin = BaseMopinionPlugin<MopinionPluginOptions>;

export type ExternalMopinionPlugin<T extends MopinionPluginOptions> =
	BaseMopinionPlugin<T>;

export function mopinion<const T extends MopinionPluginOptions>(
	incomingOptions: MopinionPluginOptions & T = {} as MopinionPluginOptions & T,
): ExternalMopinionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'mopinion',
		schema: MopinionSchema,
		options: options,
		hooks: options.hooks,
		endpoints: mopinionEndpointsNested,
		webhooks: {},
		authConfig: mopinionAuthConfig,
		endpointMeta: mopinionEndpointMeta,
		endpointSchemas: mopinionEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MopinionKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('mopinion', ctx.authType ?? 'api_key');
			}

			const publicKey = options.publicKey ?? (await ctx.keys.get_public_key());
			const signatureToken =
				options.signatureToken ?? (await ctx.keys.get_signature_token());
			if (!publicKey || !signatureToken) {
				throw new AuthMissingError('mopinion', ctx.authType ?? 'api_key');
			}

			// The client splits this composite back apart on the first colon;
			// Mopinion public keys contain no colon.
			return `${publicKey}:${signatureToken}`;
		},
	} satisfies InternalMopinionPlugin;
}

export { MopinionAPIError } from './client';

export type {
	MopinionEndpointInputs,
	MopinionEndpointOutputs,
	MopinionMeta,
	MopinionResponse,
} from './endpoints/types';
