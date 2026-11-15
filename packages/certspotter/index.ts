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
import { FirehoseEndpoints, IssuancesEndpoints } from './endpoints';
import type {
	CertSpotterEndpointInputs,
	CertSpotterEndpointOutputs,
} from './endpoints/types';
import {
	CertSpotterEndpointInputSchemas,
	CertSpotterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CertSpotterSchema } from './schema';

export type CertSpotterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCertSpotterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof certspotterEndpointsNested>;
};

export type CertSpotterContext = CorsairPluginContext<
	typeof CertSpotterSchema,
	CertSpotterPluginOptions
>;

export type CertSpotterKeyBuilderContext =
	KeyBuilderContext<CertSpotterPluginOptions>;

export type CertSpotterBoundEndpoints = BindEndpoints<
	typeof certspotterEndpointsNested
>;

type CertSpotterEndpoint<K extends keyof CertSpotterEndpointOutputs> =
	CorsairEndpoint<
		CertSpotterContext,
		CertSpotterEndpointInputs[K],
		CertSpotterEndpointOutputs[K]
	>;

export type CertSpotterEndpoints = {
	issuancesList: CertSpotterEndpoint<'listIssuances'>;
	firehoseList: CertSpotterEndpoint<'firehose'>;
};

const certspotterEndpointsNested = {
	issuances: {
		list: IssuancesEndpoints.list,
	},
	firehose: {
		list: FirehoseEndpoints.list,
	},
} as const;

export const certspotterEndpointSchemas = {
	'issuances.list': {
		input: CertSpotterEndpointInputSchemas.listIssuances,
		output: CertSpotterEndpointOutputSchemas.listIssuances,
	},
	'firehose.list': {
		input: CertSpotterEndpointInputSchemas.firehose,
		output: CertSpotterEndpointOutputSchemas.firehose,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof certspotterEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const certspotterEndpointMeta = {
	'issuances.list': {
		riskLevel: 'read',
		description:
			'List the unexpired certificate issuances for a domain, newest last, with an `after` cursor for paging',
	},
	'firehose.list': {
		riskLevel: 'read',
		description:
			'Read the continuous stream of new issuances across every log; requires a Firehose subscription and a cursor to continue from',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof certspotterEndpointsNested
>;

export type BaseCertSpotterPlugin<T extends CertSpotterPluginOptions> =
	CorsairPlugin<
		'certspotter',
		typeof CertSpotterSchema,
		typeof certspotterEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCertSpotterPlugin =
	BaseCertSpotterPlugin<CertSpotterPluginOptions>;

export type ExternalCertSpotterPlugin<T extends CertSpotterPluginOptions> =
	BaseCertSpotterPlugin<T>;

export function certspotter<const T extends CertSpotterPluginOptions>(
	incomingOptions: CertSpotterPluginOptions &
		T = {} as CertSpotterPluginOptions & T,
): ExternalCertSpotterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'certspotter',
		schema: CertSpotterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: certspotterEndpointsNested,
		webhooks: {},
		endpointMeta: certspotterEndpointMeta,
		endpointSchemas: certspotterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CertSpotterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('certspotter', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCertSpotterPlugin;
}

export { certSpotterErrorCode } from './client';

export type {
	CertSpotterEndpointInputs,
	CertSpotterEndpointOutputs,
	FirehoseInput,
	IssuanceOutput,
	IssuancesOutput,
	ListIssuancesInput,
} from './endpoints/types';
