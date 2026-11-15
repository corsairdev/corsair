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
import {
	AccountEndpoints,
	CombinedEndpoints,
	CompanyEndpoints,
	DomainEndpoints,
	FinderEndpoints,
	PersonEndpoints,
	VerifierEndpoints,
} from './endpoints';
import type {
	TombaEndpointInputs,
	TombaEndpointOutputs,
} from './endpoints/types';
import {
	TombaEndpointInputSchemas,
	TombaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TombaSchema } from './schema';

export type TombaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The API secret. Tomba needs both this and the API key on every request,
	 * and only one of them reaches the endpoint as `ctx.key`.
	 */
	apiSecret?: string;
	hooks?: InternalTombaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tombaEndpointsNested>;
};

/**
 * Both credentials live on the account: `api_key` is the base field, and
 * `api_secret` gets a `get_api_secret` accessor from this declaration. Declaring
 * it under `integration` would not work, because an `api_key` account has no
 * `get_integration_credentials` accessor.
 */
export const tombaAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type TombaContext = CorsairPluginContext<
	typeof TombaSchema,
	TombaPluginOptions,
	undefined,
	typeof tombaAuthConfig
>;

export type TombaKeyBuilderContext = KeyBuilderContext<
	TombaPluginOptions,
	typeof tombaAuthConfig
>;

export type TombaBoundEndpoints = BindEndpoints<typeof tombaEndpointsNested>;

type TombaEndpoint<K extends keyof TombaEndpointOutputs> = CorsairEndpoint<
	TombaContext,
	TombaEndpointInputs[K],
	TombaEndpointOutputs[K]
>;

export type TombaEndpoints = {
	accountGet: TombaEndpoint<'getAccount'>;
	accountRateLimits: TombaEndpoint<'rateLimits'>;
	finderDomainSearch: TombaEndpoint<'domainSearch'>;
	finderEmail: TombaEndpoint<'emailFinder'>;
	finderLinkedin: TombaEndpoint<'linkedinFinder'>;
	finderAuthor: TombaEndpoint<'authorFinder'>;
	finderEnrich: TombaEndpoint<'emailEnrichment'>;
	finderPhone: TombaEndpoint<'phoneFinder'>;
	verifierEmail: TombaEndpoint<'emailVerifier'>;
	verifierPhone: TombaEndpoint<'phoneValidator'>;
	companyFind: TombaEndpoint<'companyFind'>;
	companySearch: TombaEndpoint<'searchCompanies'>;
	personFind: TombaEndpoint<'personFind'>;
	combinedFind: TombaEndpoint<'combinedFind'>;
	domainEmailCount: TombaEndpoint<'emailCount'>;
	domainEmailFormat: TombaEndpoint<'emailFormat'>;
	domainLocation: TombaEndpoint<'location'>;
	domainTechnology: TombaEndpoint<'technology'>;
	domainSimilar: TombaEndpoint<'similar'>;
	domainStatus: TombaEndpoint<'domainStatus'>;
	domainSuggestions: TombaEndpoint<'domainSuggestions'>;
	domainEmailSources: TombaEndpoint<'emailSources'>;
};

const tombaEndpointsNested = {
	account: {
		get: AccountEndpoints.get,
		rateLimits: AccountEndpoints.rateLimits,
	},
	finder: {
		domainSearch: FinderEndpoints.domainSearch,
		email: FinderEndpoints.email,
		linkedin: FinderEndpoints.linkedin,
		author: FinderEndpoints.author,
		enrich: FinderEndpoints.enrich,
		phone: FinderEndpoints.phone,
	},
	verifier: {
		email: VerifierEndpoints.email,
		phone: VerifierEndpoints.phone,
	},
	company: {
		find: CompanyEndpoints.find,
		search: CompanyEndpoints.search,
	},
	person: {
		find: PersonEndpoints.find,
	},
	combined: {
		find: CombinedEndpoints.find,
	},
	domain: {
		emailCount: DomainEndpoints.emailCount,
		emailFormat: DomainEndpoints.emailFormat,
		location: DomainEndpoints.location,
		technology: DomainEndpoints.technology,
		similar: DomainEndpoints.similar,
		status: DomainEndpoints.status,
		suggestions: DomainEndpoints.suggestions,
		emailSources: DomainEndpoints.emailSources,
	},
} as const;

export const tombaEndpointSchemas = {
	'account.get': {
		input: TombaEndpointInputSchemas.getAccount,
		output: TombaEndpointOutputSchemas.getAccount,
	},
	'account.rateLimits': {
		input: TombaEndpointInputSchemas.rateLimits,
		output: TombaEndpointOutputSchemas.rateLimits,
	},
	'finder.domainSearch': {
		input: TombaEndpointInputSchemas.domainSearch,
		output: TombaEndpointOutputSchemas.domainSearch,
	},
	'finder.email': {
		input: TombaEndpointInputSchemas.emailFinder,
		output: TombaEndpointOutputSchemas.emailFinder,
	},
	'finder.linkedin': {
		input: TombaEndpointInputSchemas.linkedinFinder,
		output: TombaEndpointOutputSchemas.linkedinFinder,
	},
	'finder.author': {
		input: TombaEndpointInputSchemas.authorFinder,
		output: TombaEndpointOutputSchemas.authorFinder,
	},
	'finder.enrich': {
		input: TombaEndpointInputSchemas.emailEnrichment,
		output: TombaEndpointOutputSchemas.emailEnrichment,
	},
	'finder.phone': {
		input: TombaEndpointInputSchemas.phoneFinder,
		output: TombaEndpointOutputSchemas.phoneFinder,
	},
	'verifier.email': {
		input: TombaEndpointInputSchemas.emailVerifier,
		output: TombaEndpointOutputSchemas.emailVerifier,
	},
	'verifier.phone': {
		input: TombaEndpointInputSchemas.phoneValidator,
		output: TombaEndpointOutputSchemas.phoneValidator,
	},
	'company.find': {
		input: TombaEndpointInputSchemas.companyFind,
		output: TombaEndpointOutputSchemas.companyFind,
	},
	'company.search': {
		input: TombaEndpointInputSchemas.searchCompanies,
		output: TombaEndpointOutputSchemas.searchCompanies,
	},
	'person.find': {
		input: TombaEndpointInputSchemas.personFind,
		output: TombaEndpointOutputSchemas.personFind,
	},
	'combined.find': {
		input: TombaEndpointInputSchemas.combinedFind,
		output: TombaEndpointOutputSchemas.combinedFind,
	},
	'domain.emailCount': {
		input: TombaEndpointInputSchemas.emailCount,
		output: TombaEndpointOutputSchemas.emailCount,
	},
	'domain.emailFormat': {
		input: TombaEndpointInputSchemas.emailFormat,
		output: TombaEndpointOutputSchemas.emailFormat,
	},
	'domain.location': {
		input: TombaEndpointInputSchemas.location,
		output: TombaEndpointOutputSchemas.location,
	},
	'domain.technology': {
		input: TombaEndpointInputSchemas.technology,
		output: TombaEndpointOutputSchemas.technology,
	},
	'domain.similar': {
		input: TombaEndpointInputSchemas.similar,
		output: TombaEndpointOutputSchemas.similar,
	},
	'domain.status': {
		input: TombaEndpointInputSchemas.domainStatus,
		output: TombaEndpointOutputSchemas.domainStatus,
	},
	'domain.suggestions': {
		input: TombaEndpointInputSchemas.domainSuggestions,
		output: TombaEndpointOutputSchemas.domainSuggestions,
	},
	'domain.emailSources': {
		input: TombaEndpointInputSchemas.emailSources,
		output: TombaEndpointOutputSchemas.emailSources,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tombaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const tombaEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account plan and the remaining search, verification and count credits for this usage window',
	},
	'account.rateLimits': {
		riskLevel: 'read',
		description: 'Read the per-route request limits on the current plan',
	},
	'finder.domainSearch': {
		riskLevel: 'read',
		description:
			"List a company's known email addresses with each person's role, department and verification status",
	},
	'finder.email': {
		riskLevel: 'read',
		description:
			"Find one person's work email from their name and the company domain or name",
	},
	'finder.linkedin': {
		riskLevel: 'read',
		description: 'Find the work email behind a LinkedIn profile URL',
	},
	'finder.author': {
		riskLevel: 'read',
		description: 'Find the email of the person who wrote an article',
	},
	'finder.enrich': {
		riskLevel: 'read',
		description:
			'Turn an email address into a profile: name, role, company and social links',
	},
	'finder.phone': {
		riskLevel: 'read',
		description:
			'Find phone numbers from an email address, a domain or a LinkedIn URL',
	},
	'verifier.email': {
		riskLevel: 'read',
		description:
			'Check whether an address can receive mail, with format, MX, SMTP and catch-all results',
	},
	'verifier.phone': {
		riskLevel: 'read',
		description: 'Check a phone number and report its line type and carrier',
	},
	'company.find': {
		riskLevel: 'read',
		description: 'Read a company profile from its domain',
	},
	'company.search': {
		riskLevel: 'read',
		description:
			'Search the company database with a plain-language query or structured filters, 50 per page',
	},
	'person.find': {
		riskLevel: 'read',
		description: 'Read a person profile from their work email',
	},
	'combined.find': {
		riskLevel: 'read',
		description: 'Read the person and their company from one email address',
	},
	'domain.emailCount': {
		riskLevel: 'read',
		description:
			'How many addresses Tomba holds for a domain, by department and seniority',
	},
	'domain.emailFormat': {
		riskLevel: 'read',
		description: 'Read the address patterns a company uses and their share',
	},
	'domain.location': {
		riskLevel: 'read',
		description: "Where a company's people are, by country",
	},
	'domain.technology': {
		riskLevel: 'read',
		description: 'Read the technologies a website runs, by category',
	},
	'domain.similar': {
		riskLevel: 'read',
		description: 'Find companies similar to a domain, with their industry',
	},
	'domain.status': {
		riskLevel: 'read',
		description: "Read Tomba's reachability verdict for a domain",
	},
	'domain.suggestions': {
		riskLevel: 'read',
		description: 'Suggest alternative domains related to a company',
	},
	'domain.emailSources': {
		riskLevel: 'read',
		description: 'Read the public pages Tomba took a domain addresses from',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tombaEndpointsNested>;

export type BaseTombaPlugin<T extends TombaPluginOptions> = CorsairPlugin<
	'tomba',
	typeof TombaSchema,
	typeof tombaEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof tombaAuthConfig
>;

export type InternalTombaPlugin = BaseTombaPlugin<TombaPluginOptions>;

export type ExternalTombaPlugin<T extends TombaPluginOptions> =
	BaseTombaPlugin<T>;

export function tomba<const T extends TombaPluginOptions>(
	incomingOptions: TombaPluginOptions & T = {} as TombaPluginOptions & T,
): ExternalTombaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tomba',
		authConfig: tombaAuthConfig,
		schema: TombaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: tombaEndpointsNested,
		webhooks: {},
		endpointMeta: tombaEndpointMeta,
		endpointSchemas: tombaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TombaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('tomba', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTombaPlugin;
}

export { TombaAPIError } from './client';
export type {
	AccountOutput,
	CompanyOutput,
	DomainSearchInput,
	EmailFinderInput,
	EmailVerifierInput,
	EmailVerifierOutput,
	PersonOutput,
	PhoneValidatorInput,
	PhoneValidatorOutput,
	SearchCompaniesInput,
	TombaEndpointInputs,
	TombaEndpointOutputs,
} from './endpoints/types';
export { TombaOperationError } from './error-handlers';
