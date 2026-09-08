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
	Companies,
	Currencies,
	DocumentTypes,
	Proposals,
	Quotes,
	Settings,
	Templates,
} from './endpoints';
import type {
	BetterProposalsEndpointInputs,
	BetterProposalsEndpointOutputs,
} from './endpoints/types';
import {
	BetterProposalsEndpointInputSchemas,
	BetterProposalsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BetterProposalsSchema } from './schema';

export type BetterProposalsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBetterProposalsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof betterProposalsEndpointsNested>;
};

export type BetterProposalsContext = CorsairPluginContext<
	typeof BetterProposalsSchema,
	BetterProposalsPluginOptions
>;

export type BetterProposalsKeyBuilderContext =
	KeyBuilderContext<BetterProposalsPluginOptions>;

export type BetterProposalsBoundEndpoints = BindEndpoints<
	typeof betterProposalsEndpointsNested
>;

type BetterProposalsEndpoint<K extends keyof BetterProposalsEndpointOutputs> =
	CorsairEndpoint<
		BetterProposalsContext,
		BetterProposalsEndpointInputs[K],
		BetterProposalsEndpointOutputs[K]
	>;

export type BetterProposalsEndpoints = {
	proposalsList: BetterProposalsEndpoint<'proposalsList'>;
	proposalsGetNew: BetterProposalsEndpoint<'proposalsGetNew'>;
	proposalsGetOpened: BetterProposalsEndpoint<'proposalsGetOpened'>;
	proposalsGetSent: BetterProposalsEndpoint<'proposalsGetSent'>;
	proposalsGetSigned: BetterProposalsEndpoint<'proposalsGetSigned'>;
	proposalsGetPaid: BetterProposalsEndpoint<'proposalsGetPaid'>;
	proposalsGet: BetterProposalsEndpoint<'proposalsGet'>;
	proposalsGetCount: BetterProposalsEndpoint<'proposalsGetCount'>;
	proposalsCreateCover: BetterProposalsEndpoint<'proposalsCreateCover'>;
	templatesList: BetterProposalsEndpoint<'templatesList'>;
	templatesGet: BetterProposalsEndpoint<'templatesGet'>;
	documentTypesList: BetterProposalsEndpoint<'documentTypesList'>;
	documentTypesCreate: BetterProposalsEndpoint<'documentTypesCreate'>;
	quotesList: BetterProposalsEndpoint<'quotesList'>;
	quotesGet: BetterProposalsEndpoint<'quotesGet'>;
	companiesList: BetterProposalsEndpoint<'companiesList'>;
	companiesGet: BetterProposalsEndpoint<'companiesGet'>;
	companiesCreate: BetterProposalsEndpoint<'companiesCreate'>;
	currenciesList: BetterProposalsEndpoint<'currenciesList'>;
	currenciesGet: BetterProposalsEndpoint<'currenciesGet'>;
	settingsGet: BetterProposalsEndpoint<'settingsGet'>;
	settingsGetBrand: BetterProposalsEndpoint<'settingsGetBrand'>;
	settingsListMergeTags: BetterProposalsEndpoint<'settingsListMergeTags'>;
};

const betterProposalsEndpointsNested = {
	proposals: {
		list: Proposals.list,
		getNew: Proposals.getNew,
		getOpened: Proposals.getOpened,
		getSent: Proposals.getSent,
		getSigned: Proposals.getSigned,
		getPaid: Proposals.getPaid,
		get: Proposals.get,
		getCount: Proposals.getCount,
		createCover: Proposals.createCover,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
	},
	documentTypes: {
		list: DocumentTypes.list,
		create: DocumentTypes.create,
	},
	quotes: {
		list: Quotes.list,
		get: Quotes.get,
	},
	companies: {
		list: Companies.list,
		get: Companies.get,
		create: Companies.create,
	},
	currencies: {
		list: Currencies.list,
		get: Currencies.get,
	},
	settings: {
		get: Settings.get,
		getBrand: Settings.getBrand,
		listMergeTags: Settings.listMergeTags,
	},
} as const;

export const betterProposalsEndpointSchemas = {
	'proposals.list': {
		input: BetterProposalsEndpointInputSchemas.proposalsList,
		output: BetterProposalsEndpointOutputSchemas.proposalsList,
	},
	'proposals.getNew': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetNew,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetNew,
	},
	'proposals.getOpened': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetOpened,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetOpened,
	},
	'proposals.getSent': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetSent,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetSent,
	},
	'proposals.getSigned': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetSigned,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetSigned,
	},
	'proposals.getPaid': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetPaid,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetPaid,
	},
	'proposals.get': {
		input: BetterProposalsEndpointInputSchemas.proposalsGet,
		output: BetterProposalsEndpointOutputSchemas.proposalsGet,
	},
	'proposals.getCount': {
		input: BetterProposalsEndpointInputSchemas.proposalsGetCount,
		output: BetterProposalsEndpointOutputSchemas.proposalsGetCount,
	},
	'proposals.createCover': {
		input: BetterProposalsEndpointInputSchemas.proposalsCreateCover,
		output: BetterProposalsEndpointOutputSchemas.proposalsCreateCover,
	},
	'templates.list': {
		input: BetterProposalsEndpointInputSchemas.templatesList,
		output: BetterProposalsEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: BetterProposalsEndpointInputSchemas.templatesGet,
		output: BetterProposalsEndpointOutputSchemas.templatesGet,
	},
	'documentTypes.list': {
		input: BetterProposalsEndpointInputSchemas.documentTypesList,
		output: BetterProposalsEndpointOutputSchemas.documentTypesList,
	},
	'documentTypes.create': {
		input: BetterProposalsEndpointInputSchemas.documentTypesCreate,
		output: BetterProposalsEndpointOutputSchemas.documentTypesCreate,
	},
	'quotes.list': {
		input: BetterProposalsEndpointInputSchemas.quotesList,
		output: BetterProposalsEndpointOutputSchemas.quotesList,
	},
	'quotes.get': {
		input: BetterProposalsEndpointInputSchemas.quotesGet,
		output: BetterProposalsEndpointOutputSchemas.quotesGet,
	},
	'companies.list': {
		input: BetterProposalsEndpointInputSchemas.companiesList,
		output: BetterProposalsEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: BetterProposalsEndpointInputSchemas.companiesGet,
		output: BetterProposalsEndpointOutputSchemas.companiesGet,
	},
	'companies.create': {
		input: BetterProposalsEndpointInputSchemas.companiesCreate,
		output: BetterProposalsEndpointOutputSchemas.companiesCreate,
	},
	'currencies.list': {
		input: BetterProposalsEndpointInputSchemas.currenciesList,
		output: BetterProposalsEndpointOutputSchemas.currenciesList,
	},
	'currencies.get': {
		input: BetterProposalsEndpointInputSchemas.currenciesGet,
		output: BetterProposalsEndpointOutputSchemas.currenciesGet,
	},
	'settings.get': {
		input: BetterProposalsEndpointInputSchemas.settingsGet,
		output: BetterProposalsEndpointOutputSchemas.settingsGet,
	},
	'settings.getBrand': {
		input: BetterProposalsEndpointInputSchemas.settingsGetBrand,
		output: BetterProposalsEndpointOutputSchemas.settingsGetBrand,
	},
	'settings.listMergeTags': {
		input: BetterProposalsEndpointInputSchemas.settingsListMergeTags,
		output: BetterProposalsEndpointOutputSchemas.settingsListMergeTags,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof betterProposalsEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const betterProposalsEndpointMeta = {
	'proposals.list': {
		riskLevel: 'read',
		description:
			'Get all proposals with optional pagination and document type filtering',
	},
	'proposals.getNew': {
		riskLevel: 'read',
		description: 'Get new proposals that have not yet been sent',
	},
	'proposals.getOpened': {
		riskLevel: 'read',
		description: 'Get proposals that have been opened by recipients',
	},
	'proposals.getSent': {
		riskLevel: 'read',
		description: 'Get sent proposals',
	},
	'proposals.getSigned': {
		riskLevel: 'read',
		description: 'Get signed proposals',
	},
	'proposals.getPaid': {
		riskLevel: 'read',
		description: 'Get proposals that have been paid',
	},
	'proposals.get': {
		riskLevel: 'read',
		description: 'Get detailed information for a specific proposal by ID',
	},
	'proposals.getCount': {
		riskLevel: 'read',
		description: 'Get total proposal count across account',
	},
	'proposals.createCover': {
		riskLevel: 'write',
		description:
			'Create a proposal cover design with custom colours, headline, and button',
	},
	'templates.list': {
		riskLevel: 'read',
		description: 'Get all proposal templates with optional pagination',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Get details for a specific proposal template by ID',
	},
	'documentTypes.list': {
		riskLevel: 'read',
		description: 'Get all document types available in the account',
	},
	'documentTypes.create': {
		riskLevel: 'write',
		description: 'Create a new document type with name and colour',
	},
	'quotes.list': {
		riskLevel: 'read',
		description: 'Get all quotes with optional pagination',
	},
	'quotes.get': {
		riskLevel: 'read',
		description: 'Get details for a specific quote by ID',
	},
	'companies.list': {
		riskLevel: 'read',
		description: 'Get all companies in the account with optional pagination',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Get details for a specific company by ID',
	},
	'companies.create': {
		riskLevel: 'write',
		description: 'Create a new company record',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'Get all currencies supported in Better Proposals',
	},
	'currencies.get': {
		riskLevel: 'read',
		description: 'Get details for a specific currency by ID',
	},
	'settings.get': {
		riskLevel: 'read',
		description: 'Get account settings including tax and timezone information',
	},
	'settings.getBrand': {
		riskLevel: 'read',
		description:
			'Get brand settings including default currency, tax, and company styling',
	},
	'settings.listMergeTags': {
		riskLevel: 'read',
		description: 'List custom merge tags configured in the account',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof betterProposalsEndpointsNested
>;

export const betterProposalsAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBetterProposalsPlugin<T extends BetterProposalsPluginOptions> =
	CorsairPlugin<
		'betterproposals',
		typeof BetterProposalsSchema,
		typeof betterProposalsEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof betterProposalsAuthConfig
	>;

export type InternalBetterProposalsPlugin =
	BaseBetterProposalsPlugin<BetterProposalsPluginOptions>;

export type ExternalBetterProposalsPlugin<
	T extends BetterProposalsPluginOptions,
> = BaseBetterProposalsPlugin<T>;

export function betterproposals<const T extends BetterProposalsPluginOptions>(
	incomingOptions: BetterProposalsPluginOptions &
		T = {} as BetterProposalsPluginOptions & T,
): ExternalBetterProposalsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'betterproposals',
		schema: BetterProposalsSchema,
		options,
		hooks: options.hooks,
		endpoints: betterProposalsEndpointsNested,
		webhooks: {},
		endpointMeta: betterProposalsEndpointMeta,
		endpointSchemas: betterProposalsEndpointSchemas,
		authConfig: betterProposalsAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: BetterProposalsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('betterproposals', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('betterproposals', 'api_key');
		},
	} satisfies InternalBetterProposalsPlugin;
}

export type {
	BetterProposalsEndpointInputs,
	BetterProposalsEndpointOutputs,
	CompaniesCreateInput,
	CompaniesCreateResponse,
	CompaniesGetInput,
	CompaniesGetResponse,
	CompaniesListInput,
	CompaniesListResponse,
	CurrenciesGetInput,
	CurrenciesGetResponse,
	CurrenciesListInput,
	CurrenciesListResponse,
	DocumentTypesCreateInput,
	DocumentTypesCreateResponse,
	DocumentTypesListInput,
	DocumentTypesListResponse,
	ProposalsCreateCoverInput,
	ProposalsCreateCoverResponse,
	ProposalsGetCountInput,
	ProposalsGetCountResponse,
	ProposalsGetInput,
	ProposalsGetNewInput,
	ProposalsGetNewResponse,
	ProposalsGetOpenedInput,
	ProposalsGetOpenedResponse,
	ProposalsGetPaidInput,
	ProposalsGetPaidResponse,
	ProposalsGetResponse,
	ProposalsGetSentInput,
	ProposalsGetSentResponse,
	ProposalsGetSignedInput,
	ProposalsGetSignedResponse,
	ProposalsListInput,
	ProposalsListResponse,
	QuotesGetInput,
	QuotesGetResponse,
	QuotesListInput,
	QuotesListResponse,
	SettingsGetBrandInput,
	SettingsGetBrandResponse,
	SettingsGetInput,
	SettingsGetResponse,
	SettingsListMergeTagsInput,
	SettingsListMergeTagsResponse,
	TemplatesGetInput,
	TemplatesGetResponse,
	TemplatesListInput,
	TemplatesListResponse,
} from './endpoints/types';

export {
	BetterProposalsEndpointInputSchemas,
	BetterProposalsEndpointOutputSchemas,
	BrandSettingsSchema,
	CompanySchema,
	CurrencySchema,
	DocumentTypeSchema,
	MergeTagSchema,
	ProposalDetailSchema,
	ProposalSummarySchema,
	QuoteSchema,
	SettingsSchema,
	TemplateSchema,
} from './endpoints/types';
