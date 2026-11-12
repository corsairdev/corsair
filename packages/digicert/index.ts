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
import { endpoints } from './endpoints';
import type {
	DigicertEndpointInputs,
	DigicertEndpointOutputs,
} from './endpoints/types';
import {
	DigicertEndpointInputSchemas,
	DigicertEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DigicertSchema } from './schema';

export type DigicertPluginOptions = {
	authType?: PickAuth<'api_key'>;
	certCentralRegion?: 'us' | 'eu';
	reportRegion?: 'us' | 'eu';
	digicertOneRegion?: 'us' | 'jp' | 'ch' | 'nl' | 'au';
	hooks?: InternalDigicertPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof digicertEndpointsNested>;
};

export type DigicertContext = CorsairPluginContext<
	typeof DigicertSchema,
	DigicertPluginOptions,
	undefined,
	typeof digicertAuthConfig
>;
export type DigicertKeyBuilderContext = KeyBuilderContext<
	DigicertPluginOptions,
	typeof digicertAuthConfig
>;
export type DigicertBoundEndpoints = BindEndpoints<
	typeof digicertEndpointsNested
>;

type Endpoint<K extends keyof DigicertEndpointOutputs> = CorsairEndpoint<
	DigicertContext,
	DigicertEndpointInputs[K],
	DigicertEndpointOutputs[K]
>;

export type DigicertEndpoints = {
	users: { list: Endpoint<'usersList'> };
	orders: { list: Endpoint<'ordersList'> };
	organizations: { list: Endpoint<'organizationsList'> };
	certificates: { listIntermediates: Endpoint<'intermediatesList'> };
	accountManager: { locales: Endpoint<'accountManagerLocales'> };
	privateCA: {
		helper: Endpoint<'privateCAHelper'>;
		verifyTemplate: Endpoint<'verifyTemplate'>;
	};
	trustLifecycle: {
		version: Endpoint<'trustLifecycleVersion'>;
		addCertificateTags: Endpoint<'certificateTags'>;
	};
	contentTrust: {
		infoV0: Endpoint<'contentTrustInfoV0'>;
		infoV1: Endpoint<'contentTrustInfoV1'>;
	};
	reportLibrary: {
		names: Endpoint<'reportNames'>;
		types: Endpoint<'reportTypes'>;
		history: Endpoint<'reportHistory'>;
		details: Endpoint<'reportDetails'>;
	};
	customReports: {
		orders: Endpoint<'customReportQuery'>;
		orderById: Endpoint<'customReportById'>;
	};
};

const digicertEndpointsNested = {
	users: { list: endpoints.usersList },
	orders: { list: endpoints.ordersList },
	organizations: { list: endpoints.organizationsList },
	certificates: { listIntermediates: endpoints.intermediatesList },
	accountManager: { locales: endpoints.accountManagerLocales },
	privateCA: {
		helper: endpoints.privateCAHelper,
		verifyTemplate: endpoints.verifyTemplate,
	},
	trustLifecycle: {
		version: endpoints.trustLifecycleVersion,
		addCertificateTags: endpoints.certificateTags,
	},
	contentTrust: {
		infoV0: endpoints.contentTrustInfoV0,
		infoV1: endpoints.contentTrustInfoV1,
	},
	reportLibrary: {
		names: endpoints.reportNames,
		types: endpoints.reportTypes,
		history: endpoints.reportHistory,
		details: endpoints.reportDetails,
	},
	customReports: {
		orders: endpoints.customReportOrders,
		orderById: endpoints.customReportOrderById,
	},
} as const;

export const digicertEndpointSchemas = {
	'users.list': {
		input: DigicertEndpointInputSchemas.usersList,
		output: DigicertEndpointOutputSchemas.usersList,
	},
	'orders.list': {
		input: DigicertEndpointInputSchemas.ordersList,
		output: DigicertEndpointOutputSchemas.ordersList,
	},
	'organizations.list': {
		input: DigicertEndpointInputSchemas.organizationsList,
		output: DigicertEndpointOutputSchemas.organizationsList,
	},
	'certificates.listIntermediates': {
		input: DigicertEndpointInputSchemas.intermediatesList,
		output: DigicertEndpointOutputSchemas.intermediatesList,
	},
	'accountManager.locales': {
		input: DigicertEndpointInputSchemas.accountManagerLocales,
		output: DigicertEndpointOutputSchemas.accountManagerLocales,
	},
	'privateCA.helper': {
		input: DigicertEndpointInputSchemas.privateCAHelper,
		output: DigicertEndpointOutputSchemas.privateCAHelper,
	},
	'privateCA.verifyTemplate': {
		input: DigicertEndpointInputSchemas.verifyTemplate,
		output: DigicertEndpointOutputSchemas.verifyTemplate,
	},
	'trustLifecycle.version': {
		input: DigicertEndpointInputSchemas.trustLifecycleVersion,
		output: DigicertEndpointOutputSchemas.trustLifecycleVersion,
	},
	'trustLifecycle.addCertificateTags': {
		input: DigicertEndpointInputSchemas.certificateTags,
		output: DigicertEndpointOutputSchemas.certificateTags,
	},
	'contentTrust.infoV0': {
		input: DigicertEndpointInputSchemas.contentTrustInfoV0,
		output: DigicertEndpointOutputSchemas.contentTrustInfoV0,
	},
	'contentTrust.infoV1': {
		input: DigicertEndpointInputSchemas.contentTrustInfoV1,
		output: DigicertEndpointOutputSchemas.contentTrustInfoV1,
	},
	'reportLibrary.names': {
		input: DigicertEndpointInputSchemas.reportNames,
		output: DigicertEndpointOutputSchemas.reportNames,
	},
	'reportLibrary.types': {
		input: DigicertEndpointInputSchemas.reportTypes,
		output: DigicertEndpointOutputSchemas.reportTypes,
	},
	'reportLibrary.history': {
		input: DigicertEndpointInputSchemas.reportHistory,
		output: DigicertEndpointOutputSchemas.reportHistory,
	},
	'reportLibrary.details': {
		input: DigicertEndpointInputSchemas.reportDetails,
		output: DigicertEndpointOutputSchemas.reportDetails,
	},
	'customReports.orders': {
		input: DigicertEndpointInputSchemas.customReportQuery,
		output: DigicertEndpointOutputSchemas.customReportQuery,
	},
	'customReports.orderById': {
		input: DigicertEndpointInputSchemas.customReportById,
		output: DigicertEndpointOutputSchemas.customReportById,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof digicertEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const digicertEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description: 'List CertCentral account users.',
	},
	'orders.list': {
		riskLevel: 'read',
		description: 'List CertCentral certificate orders.',
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List CertCentral organizations.',
	},
	'certificates.listIntermediates': {
		riskLevel: 'read',
		description: 'List account intermediate certificates.',
	},
	'accountManager.locales': {
		riskLevel: 'read',
		description: 'List locales supported by DigiCert ONE Account Manager.',
	},
	'privateCA.helper': {
		riskLevel: 'read',
		description:
			'Read DigiCert Private CA application helper version information.',
	},
	'privateCA.verifyTemplate': {
		riskLevel: 'read',
		description:
			'Validate a DigiCert Private CA template payload without creating it.',
	},
	'trustLifecycle.version': {
		riskLevel: 'read',
		description: 'Read the unauthenticated Trust Lifecycle Manager version.',
	},
	'trustLifecycle.addCertificateTags': {
		riskLevel: 'write',
		description: 'Add custom tags to a Trust Lifecycle Manager certificate.',
	},
	'contentTrust.infoV0': {
		riskLevel: 'read',
		description: 'Read public Content Trust CSC v0 service information.',
	},
	'contentTrust.infoV1': {
		riskLevel: 'read',
		description: 'Read public Content Trust CSC v1 service information.',
	},
	'reportLibrary.names': {
		riskLevel: 'read',
		description: 'List Report Library report names.',
	},
	'reportLibrary.types': {
		riskLevel: 'read',
		description: 'List Report Library report types and supported formats.',
	},
	'reportLibrary.history': {
		riskLevel: 'read',
		description: 'List scheduled reports and individual report runs.',
	},
	'reportLibrary.details': {
		riskLevel: 'read',
		description: 'Read a Report Library report configuration.',
	},
	'customReports.orders': {
		riskLevel: 'read',
		description:
			'Query CertCentral certificate order details through Custom Reports GraphQL.',
	},
	'customReports.orderById': {
		riskLevel: 'read',
		description:
			'Query one CertCentral certificate order by ID through Custom Reports GraphQL.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof digicertEndpointsNested>;

export const digicertAuthConfig = {
	api_key: { account: ['digicert_one_api_key'] as const },
} as const satisfies PluginAuthConfig;

const PUBLIC_OPERATIONS = new Set([
	'trustLifecycle.version',
	'contentTrust.infoV0',
	'contentTrust.infoV1',
]);
const DIGICERT_ONE_AUTH_OPERATIONS = new Set([
	'accountManager.locales',
	'privateCA.helper',
	'privateCA.verifyTemplate',
	'trustLifecycle.addCertificateTags',
]);

export type BaseDigicertPlugin<T extends DigicertPluginOptions> = CorsairPlugin<
	'digicert',
	typeof DigicertSchema,
	typeof digicertEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof digicertAuthConfig
>;

export type InternalDigicertPlugin = BaseDigicertPlugin<DigicertPluginOptions>;
export type ExternalDigicertPlugin<T extends DigicertPluginOptions> =
	BaseDigicertPlugin<T>;

export function digicert<const T extends DigicertPluginOptions>(
	incomingOptions: DigicertPluginOptions & T = {} as DigicertPluginOptions & T,
): ExternalDigicertPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'digicert',
		authConfig: digicertAuthConfig,
		schema: DigicertSchema,
		options,
		hooks: options.hooks,
		endpoints: digicertEndpointsNested,
		webhooks: {},
		endpointMeta: digicertEndpointMeta,
		endpointSchemas: digicertEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DigicertKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (PUBLIC_OPERATIONS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('digicert', 'api_key');
			if (DIGICERT_ONE_AUTH_OPERATIONS.has(ctx.meteredOperationId ?? '')) {
				const oneKey = await ctx.keys.get_digicert_one_api_key();
				if (!oneKey) throw new AuthMissingError('digicert', 'api_key');
				return oneKey;
			}
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('digicert', 'api_key');
			return apiKey;
		},
	} satisfies InternalDigicertPlugin;
}

export type {
	AccountManagerLocalesInput,
	AccountManagerLocalesResponse,
	CertificateTagsInput,
	ContentTrustInfoInput,
	ContentTrustInfoResponse,
	CustomReportByIdInput,
	CustomReportByIdResponse,
	CustomReportOrdersResponse,
	CustomReportQueryInput,
	DigicertEndpointInputs,
	DigicertEndpointOutputs,
	IntermediatesListInput,
	IntermediatesListResponse,
	OrdersListInput,
	OrdersListResponse,
	OrganizationsListInput,
	OrganizationsListResponse,
	PrivateCAHelperInput,
	PrivateCAHelperResponse,
	ReportDetailsInput,
	ReportDetailsResponse,
	ReportHistoryInput,
	ReportHistoryResponse,
	ReportNamesInput,
	ReportNamesResponse,
	ReportTypesInput,
	ReportTypesResponse,
	TrustLifecycleVersionResponse,
	UsersListInput,
	UsersListResponse,
	VerifyTemplateInput,
} from './endpoints/types';
