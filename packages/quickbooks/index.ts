import type {
	BindEndpoints,
	CorsairContext,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import type { QuickBooksEnvironment } from './client';
import { AccountsEndpoints, CompanyEndpoints } from './endpoints';
import type {
	QuickBooksEndpointInputs,
	QuickBooksEndpointOutputs,
} from './endpoints/types';
import {
	QuickBooksEndpointInputSchemas,
	QuickBooksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { QuickBooksSchema } from './schema';

const quickBooksEndpointsNested = {
	accounts: AccountsEndpoints,
	company: CompanyEndpoints,
} as const;

export const quickbooksEndpointSchemas = {
	'accounts.create': {
		input: QuickBooksEndpointInputSchemas.accountsCreate,
		output: QuickBooksEndpointOutputSchemas.accountsCreate,
	},
	'accounts.get': {
		input: QuickBooksEndpointInputSchemas.accountsGet,
		output: QuickBooksEndpointOutputSchemas.accountsGet,
	},
	'accounts.list': {
		input: QuickBooksEndpointInputSchemas.accountsList,
		output: QuickBooksEndpointOutputSchemas.accountsList,
	},
	'company.get': {
		input: QuickBooksEndpointInputSchemas.companyGet,
		output: QuickBooksEndpointOutputSchemas.companyGet,
	},
	'company.list': {
		input: QuickBooksEndpointInputSchemas.companyList,
		output: QuickBooksEndpointOutputSchemas.companyList,
	},
} as const;

export type QuickBooksContext = CorsairPluginContext<
	typeof QuickBooksSchema,
	QuickBooksPluginOptions,
	typeof quickBooksEndpointsNested
>;

type QuickBooksEndpoint<K extends keyof QuickBooksEndpointInputs> =
	CorsairEndpoint<
		CorsairContext &
			Pick<QuickBooksContext, 'key' | 'options'> & {
				_refreshAuth?: () => Promise<string>;
			},
		QuickBooksEndpointInputs[K],
		QuickBooksEndpointOutputs[K]
	>;

export type QuickBooksEndpoints = {
	accountsCreate: QuickBooksEndpoint<'accountsCreate'>;
	accountsGet: QuickBooksEndpoint<'accountsGet'>;
	accountsList: QuickBooksEndpoint<'accountsList'>;
	companyGet: QuickBooksEndpoint<'companyGet'>;
	companyList: QuickBooksEndpoint<'companyList'>;
};

export type QuickBooksBoundEndpoints = BindEndpoints<
	typeof quickBooksEndpointsNested
>;

export type QuickBooksPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	environment?: QuickBooksEnvironment;
	hooks?: InternalQuickBooksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof quickBooksEndpointsNested>;
};

export type QuickBooksKeyBuilderContext =
	KeyBuilderContext<QuickBooksPluginOptions>;

const defaultAuthType = 'oauth_2' as const;

const quickBooksEndpointMeta = {
	'accounts.create': {
		riskLevel: 'write',
		description: 'Create a QuickBooks account in the company chart of accounts',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Read one account by its QuickBooks account ID',
	},
	'accounts.list': {
		riskLevel: 'read',
		description: 'List accounts with QuickBooks query pagination',
	},
	'company.get': {
		riskLevel: 'read',
		description: 'Read basic company information for a realm',
	},
	'company.list': {
		riskLevel: 'read',
		description: 'Query the CompanyInfo resource for a realm',
	},
} satisfies RequiredPluginEndpointMeta<typeof quickBooksEndpointsNested>;

export type BaseQuickBooksPlugin<T extends QuickBooksPluginOptions> =
	CorsairPlugin<
		'quickbooks',
		typeof QuickBooksSchema,
		typeof quickBooksEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalQuickBooksPlugin =
	BaseQuickBooksPlugin<QuickBooksPluginOptions>;

export function quickbooks(
	incomingOptions: QuickBooksPluginOptions = {},
): InternalQuickBooksPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'quickbooks',
		authConfig: { oauth_2: { account: [] as const } },
		oauthConfig: {
			providerName: 'QuickBooks Online',
			authUrl: 'https://appcenter.intuit.com/connect/oauth2',
			tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
			scopes: ['com.intuit.quickbooks.accounting'],
			tokenAuthMethod: 'basic',
		},
		schema: QuickBooksSchema,
		options,
		hooks: options.hooks,
		endpoints: quickBooksEndpointsNested,
		webhooks: {},
		endpointMeta: quickBooksEndpointMeta,
		endpointSchemas: quickbooksEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: QuickBooksKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'quickbooks',
					tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
					tokenAuthMethod: 'basic',
				});
			}
			throw new AuthMissingError('quickbooks', 'oauth_2');
		},
	} satisfies InternalQuickBooksPlugin;
}

export type {
	QuickBooksEndpointInputs,
	QuickBooksEndpointOutputs,
} from './endpoints/types';
