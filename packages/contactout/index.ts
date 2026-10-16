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
import { Account, Company, Email, Linkedin, People } from './endpoints';
import type {
	ContactOutEndpointInputs,
	ContactOutEndpointOutputs,
} from './endpoints/types';
import {
	ContactOutEndpointInputSchemas,
	ContactOutEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ContactOutSchema } from './schema';

export type ContactOutPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Work-email API key. */
	key?: string;
	/** Personal-email API key; falls back to the account's stored personal_api_key. */
	personalKey?: string;
	hooks?: InternalContactOutPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof contactoutEndpointsNested>;
};

export type ContactOutContext = CorsairPluginContext<
	typeof ContactOutSchema,
	ContactOutPluginOptions,
	undefined,
	typeof contactoutAuthConfig
>;

export type ContactOutKeyBuilderContext = KeyBuilderContext<
	ContactOutPluginOptions,
	typeof contactoutAuthConfig
>;

export type ContactOutBoundEndpoints = BindEndpoints<
	typeof contactoutEndpointsNested
>;

type ContactOutEndpoint<K extends keyof ContactOutEndpointOutputs> =
	CorsairEndpoint<
		ContactOutContext,
		ContactOutEndpointInputs[K],
		ContactOutEndpointOutputs[K]
	>;

export type ContactOutEndpoints = {
	linkedinEnrich: ContactOutEndpoint<'linkedinEnrich'>;
	linkedinContactInfo: ContactOutEndpoint<'linkedinContactInfo'>;
	linkedinWorkEmailStatus: ContactOutEndpoint<'linkedinWorkEmailStatus'>;
	linkedinPersonalEmailStatus: ContactOutEndpoint<'linkedinPersonalEmailStatus'>;
	linkedinPhoneStatus: ContactOutEndpoint<'linkedinPhoneStatus'>;
	emailEnrich: ContactOutEndpoint<'emailEnrich'>;
	emailVerify: ContactOutEndpoint<'emailVerify'>;
	emailToLinkedin: ContactOutEndpoint<'emailToLinkedin'>;
	peopleEnrich: ContactOutEndpoint<'peopleEnrich'>;
	peopleSearch: ContactOutEndpoint<'peopleSearch'>;
	peopleCount: ContactOutEndpoint<'peopleCount'>;
	peopleDecisionMakers: ContactOutEndpoint<'peopleDecisionMakers'>;
	companySearch: ContactOutEndpoint<'companySearch'>;
	companyEnrichDomains: ContactOutEndpoint<'companyEnrichDomains'>;
	accountStats: ContactOutEndpoint<'accountStats'>;
};

const contactoutEndpointsNested = {
	linkedin: {
		enrich: Linkedin.enrich,
		contactInfo: Linkedin.contactInfo,
		workEmailStatus: Linkedin.workEmailStatus,
		personalEmailStatus: Linkedin.personalEmailStatus,
		phoneStatus: Linkedin.phoneStatus,
	},
	email: {
		enrich: Email.enrich,
		verify: Email.verify,
		toLinkedin: Email.toLinkedin,
	},
	people: {
		enrich: People.enrich,
		search: People.search,
		count: People.count,
		decisionMakers: People.decisionMakers,
	},
	company: {
		search: Company.search,
		enrichDomains: Company.enrichDomains,
	},
	account: {
		stats: Account.stats,
	},
} as const;

export const contactoutEndpointSchemas = {
	'linkedin.enrich': {
		input: ContactOutEndpointInputSchemas.linkedinEnrich,
		output: ContactOutEndpointOutputSchemas.linkedinEnrich,
	},
	'linkedin.contactInfo': {
		input: ContactOutEndpointInputSchemas.linkedinContactInfo,
		output: ContactOutEndpointOutputSchemas.linkedinContactInfo,
	},
	'linkedin.workEmailStatus': {
		input: ContactOutEndpointInputSchemas.linkedinWorkEmailStatus,
		output: ContactOutEndpointOutputSchemas.linkedinWorkEmailStatus,
	},
	'linkedin.personalEmailStatus': {
		input: ContactOutEndpointInputSchemas.linkedinPersonalEmailStatus,
		output: ContactOutEndpointOutputSchemas.linkedinPersonalEmailStatus,
	},
	'linkedin.phoneStatus': {
		input: ContactOutEndpointInputSchemas.linkedinPhoneStatus,
		output: ContactOutEndpointOutputSchemas.linkedinPhoneStatus,
	},
	'email.enrich': {
		input: ContactOutEndpointInputSchemas.emailEnrich,
		output: ContactOutEndpointOutputSchemas.emailEnrich,
	},
	'email.verify': {
		input: ContactOutEndpointInputSchemas.emailVerify,
		output: ContactOutEndpointOutputSchemas.emailVerify,
	},
	'email.toLinkedin': {
		input: ContactOutEndpointInputSchemas.emailToLinkedin,
		output: ContactOutEndpointOutputSchemas.emailToLinkedin,
	},
	'people.enrich': {
		input: ContactOutEndpointInputSchemas.peopleEnrich,
		output: ContactOutEndpointOutputSchemas.peopleEnrich,
	},
	'people.search': {
		input: ContactOutEndpointInputSchemas.peopleSearch,
		output: ContactOutEndpointOutputSchemas.peopleSearch,
	},
	'people.count': {
		input: ContactOutEndpointInputSchemas.peopleCount,
		output: ContactOutEndpointOutputSchemas.peopleCount,
	},
	'people.decisionMakers': {
		input: ContactOutEndpointInputSchemas.peopleDecisionMakers,
		output: ContactOutEndpointOutputSchemas.peopleDecisionMakers,
	},
	'company.search': {
		input: ContactOutEndpointInputSchemas.companySearch,
		output: ContactOutEndpointOutputSchemas.companySearch,
	},
	'company.enrichDomains': {
		input: ContactOutEndpointInputSchemas.companyEnrichDomains,
		output: ContactOutEndpointOutputSchemas.companyEnrichDomains,
	},
	'account.stats': {
		input: ContactOutEndpointInputSchemas.accountStats,
		output: ContactOutEndpointOutputSchemas.accountStats,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof contactoutEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contactoutEndpointMeta = {
	'linkedin.enrich': {
		riskLevel: 'read',
		description:
			'Get a full LinkedIn profile with emails and phones; emailType picks the work or personal key',
	},
	'linkedin.contactInfo': {
		riskLevel: 'read',
		description: 'Get only the emails and phones for a LinkedIn profile',
	},
	'linkedin.workEmailStatus': {
		riskLevel: 'read',
		description: 'Check whether a LinkedIn profile has a work email (free)',
	},
	'linkedin.personalEmailStatus': {
		riskLevel: 'read',
		description: 'Check whether a LinkedIn profile has a personal email (free)',
	},
	'linkedin.phoneStatus': {
		riskLevel: 'read',
		description: 'Check whether a LinkedIn profile has a phone number (free)',
	},
	'email.enrich': {
		riskLevel: 'read',
		description: 'Get the profile behind an email address',
	},
	'email.verify': {
		riskLevel: 'read',
		description: 'Verify whether an email address is deliverable',
	},
	'email.toLinkedin': {
		riskLevel: 'read',
		description: 'Get the LinkedIn profile URL for an email address',
	},
	'people.enrich': {
		riskLevel: 'read',
		description:
			'Find a profile from a LinkedIn URL, email, phone, or name plus company, school, or location',
	},
	'people.search': {
		riskLevel: 'read',
		description:
			'Search profiles by title, company, location, skills, and more, 25 per page',
	},
	'people.count': {
		riskLevel: 'read',
		description: 'Count profiles matching search filters (free)',
	},
	'people.decisionMakers': {
		riskLevel: 'read',
		description:
			"List a company's decision makers by domain, name, or LinkedIn URL",
	},
	'company.search': {
		riskLevel: 'read',
		description:
			'Search companies by name, domain, size, location, industry, technology, revenue, or founding year',
	},
	'company.enrichDomains': {
		riskLevel: 'read',
		description: 'Get company details for up to 30 domains',
	},
	'account.stats': {
		riskLevel: 'read',
		description: 'Get email, phone, and search credit usage for a month',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof contactoutEndpointsNested
>;

// The plugin's API key is the work-email key. The personal-email key is a
// separate ContactOut key with its own credit pool, stored per account.
export const contactoutAuthConfig = {
	api_key: {
		account: ['tenant_external_id', 'personal_api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseContactOutPlugin<T extends ContactOutPluginOptions> =
	CorsairPlugin<
		'contactout',
		typeof ContactOutSchema,
		typeof contactoutEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof contactoutAuthConfig
	>;

export type InternalContactOutPlugin =
	BaseContactOutPlugin<ContactOutPluginOptions>;

export type ExternalContactOutPlugin<T extends ContactOutPluginOptions> =
	BaseContactOutPlugin<T>;

export function contactout<const T extends ContactOutPluginOptions>(
	incomingOptions: ContactOutPluginOptions & T = {} as ContactOutPluginOptions &
		T,
): ExternalContactOutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contactout',
		authConfig: contactoutAuthConfig,
		schema: ContactOutSchema,
		options: options,
		hooks: options.hooks,
		endpoints: contactoutEndpointsNested,
		webhooks: {},
		endpointMeta: contactoutEndpointMeta,
		endpointSchemas: contactoutEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// Personal-email endpoints resolve their own key, so a missing work key is
		// only an error once a work-email call needs it (see endpoints/call.ts).
		keyBuilder: async (ctx: ContactOutKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('contactout', 'api_key');
			}
			if (options.key) return options.key;
			if (ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}
			throw new AuthMissingError('contactout', 'api_key');
		},
	} satisfies InternalContactOutPlugin;
}

export type {
	Company,
	CompanySearchInput,
	CompanySearchResponse,
	ContactInfoInput,
	ContactInfoResponse,
	ContactOutEndpointInputs,
	ContactOutEndpointOutputs,
	DecisionMakersInput,
	DecisionMakersResponse,
	EmailEnrichInput,
	EmailEnrichResponse,
	EmailInput,
	EmailProfile,
	EmailToLinkedinResponse,
	EmailType,
	EmailVerifyResponse,
	EnrichDomainsInput,
	EnrichDomainsResponse,
	LinkedinEnrichInput,
	LinkedinEnrichResponse,
	LinkedinProfile,
	PeopleCountInput,
	PeopleCountResponse,
	PeopleEnrichInput,
	PeopleEnrichResponse,
	PeopleSearchInput,
	PeopleSearchResponse,
	PersonalEmailStatusResponse,
	PhoneStatusResponse,
	ProfileCheckInput,
	SearchProfile,
	StatsInput,
	StatsResponse,
	WorkEmailStatusResponse,
} from './endpoints/types';
