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
import { Endpoints } from './endpoints';
import type {
	RecruiteeEndpointInputs,
	RecruiteeEndpointOutputs,
} from './endpoints/types';
import {
	RecruiteeEndpointInputSchemas,
	RecruiteeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RecruiteeSchema } from './schema';

export type RecruiteePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The company id from the API tokens page. Every ATS route sits under
	 * `/c/{company_id}`, so this travels with the token.
	 */
	company_id?: string;
	hooks?: InternalRecruiteePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof recruiteeEndpointsNested>;
};

/**
 * A Recruitee token is bound to one company, and the company id is part of every
 * path, so both are account-level fields: `get_integration_credentials` is only
 * installed for `oauth_2`.
 */
export const recruiteeAuthConfig = {
	api_key: {
		account: ['company_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type RecruiteeContext = CorsairPluginContext<
	typeof RecruiteeSchema,
	RecruiteePluginOptions,
	undefined,
	typeof recruiteeAuthConfig
>;

export type RecruiteeKeyBuilderContext = KeyBuilderContext<
	RecruiteePluginOptions,
	typeof recruiteeAuthConfig
>;

export type RecruiteeBoundEndpoints = BindEndpoints<
	typeof recruiteeEndpointsNested
>;

type RecruiteeEndpoint<K extends keyof RecruiteeEndpointOutputs> =
	CorsairEndpoint<
		RecruiteeContext,
		RecruiteeEndpointInputs[K],
		RecruiteeEndpointOutputs[K]
	>;

export type RecruiteeEndpoints = {
	candidatesList: RecruiteeEndpoint<'candidatesList'>;
	candidatesGet: RecruiteeEndpoint<'candidatesGet'>;
	candidatesCreate: RecruiteeEndpoint<'candidatesCreate'>;
	candidatesUpdate: RecruiteeEndpoint<'candidatesUpdate'>;
	candidatesDelete: RecruiteeEndpoint<'candidatesDelete'>;
	offersList: RecruiteeEndpoint<'offersList'>;
	offersGet: RecruiteeEndpoint<'offersGet'>;
	offersCreate: RecruiteeEndpoint<'offersCreate'>;
	offersUpdate: RecruiteeEndpoint<'offersUpdate'>;
	departmentsList: RecruiteeEndpoint<'departmentsList'>;
	locationsList: RecruiteeEndpoint<'locationsList'>;
};

const recruiteeEndpointsNested = {
	candidates: {
		list: Endpoints.candidatesList,
		get: Endpoints.candidatesGet,
		create: Endpoints.candidatesCreate,
		update: Endpoints.candidatesUpdate,
		delete: Endpoints.candidatesDelete,
	},
	offers: {
		list: Endpoints.offersList,
		get: Endpoints.offersGet,
		create: Endpoints.offersCreate,
		update: Endpoints.offersUpdate,
	},
	departments: {
		list: Endpoints.departmentsList,
	},
	locations: {
		list: Endpoints.locationsList,
	},
} as const;

export const recruiteeEndpointSchemas = {
	'candidates.list': {
		input: RecruiteeEndpointInputSchemas.candidatesList,
		output: RecruiteeEndpointOutputSchemas.candidatesList,
	},
	'candidates.get': {
		input: RecruiteeEndpointInputSchemas.candidatesGet,
		output: RecruiteeEndpointOutputSchemas.candidatesGet,
	},
	'candidates.create': {
		input: RecruiteeEndpointInputSchemas.candidatesCreate,
		output: RecruiteeEndpointOutputSchemas.candidatesCreate,
	},
	'candidates.update': {
		input: RecruiteeEndpointInputSchemas.candidatesUpdate,
		output: RecruiteeEndpointOutputSchemas.candidatesUpdate,
	},
	'candidates.delete': {
		input: RecruiteeEndpointInputSchemas.candidatesDelete,
		output: RecruiteeEndpointOutputSchemas.candidatesDelete,
	},
	'offers.list': {
		input: RecruiteeEndpointInputSchemas.offersList,
		output: RecruiteeEndpointOutputSchemas.offersList,
	},
	'offers.get': {
		input: RecruiteeEndpointInputSchemas.offersGet,
		output: RecruiteeEndpointOutputSchemas.offersGet,
	},
	'offers.create': {
		input: RecruiteeEndpointInputSchemas.offersCreate,
		output: RecruiteeEndpointOutputSchemas.offersCreate,
	},
	'offers.update': {
		input: RecruiteeEndpointInputSchemas.offersUpdate,
		output: RecruiteeEndpointOutputSchemas.offersUpdate,
	},
	'departments.list': {
		input: RecruiteeEndpointInputSchemas.departmentsList,
		output: RecruiteeEndpointOutputSchemas.departmentsList,
	},
	'locations.list': {
		input: RecruiteeEndpointInputSchemas.locationsList,
		output: RecruiteeEndpointOutputSchemas.locationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof recruiteeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const recruiteeEndpointMeta = {
	'candidates.list': {
		riskLevel: 'read',
		description:
			'Search candidates by text, offer, stage, status, department or location, a page at a time',
	},
	'candidates.get': {
		riskLevel: 'read',
		description:
			'Fetch one candidate with their contact details, stage, status and placements',
	},
	'candidates.create': {
		riskLevel: 'write',
		description:
			'Add a candidate manually and assign them to an offer at its default stage',
	},
	'candidates.update': {
		riskLevel: 'write',
		description:
			'Update a candidate profile: their name, emails, phones or cover letter',
	},
	'candidates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a candidate permanently',
	},
	'offers.list': {
		riskLevel: 'read',
		description:
			'List offers with status, department, location and kind filters, a page at a time',
	},
	'offers.get': {
		riskLevel: 'read',
		description:
			'Fetch one offer with its title, slug, description, requirements and state',
	},
	'offers.create': {
		riskLevel: 'write',
		description:
			'Create an offer as a draft job or talent pool; publishing is done in Recruitee',
	},
	'offers.update': {
		riskLevel: 'write',
		description:
			'Update an offer: its title, description, requirements, department or locations',
	},
	'departments.list': {
		riskLevel: 'read',
		description: 'List the company departments with how many offers each has',
	},
	'locations.list': {
		riskLevel: 'read',
		description:
			'List the company locations with their city, country and address',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof recruiteeEndpointsNested
>;

export type BaseRecruiteePlugin<T extends RecruiteePluginOptions> =
	CorsairPlugin<
		'recruitee',
		typeof RecruiteeSchema,
		typeof recruiteeEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof recruiteeAuthConfig
	>;

export type InternalRecruiteePlugin =
	BaseRecruiteePlugin<RecruiteePluginOptions>;

export type ExternalRecruiteePlugin<T extends RecruiteePluginOptions> =
	BaseRecruiteePlugin<T>;

export function recruitee<const T extends RecruiteePluginOptions>(
	incomingOptions: RecruiteePluginOptions & T = {} as RecruiteePluginOptions &
		T,
): ExternalRecruiteePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'recruitee',
		authConfig: recruiteeAuthConfig,
		schema: RecruiteeSchema,
		options: options,
		hooks: options.hooks,
		endpoints: recruiteeEndpointsNested,
		webhooks: {},
		endpointMeta: recruiteeEndpointMeta,
		endpointSchemas: recruiteeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RecruiteeKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('recruitee', ctx.authType ?? 'api_key');
			}

			const key =
				options.key ??
				(ctx.authType === 'api_key' ? await ctx.keys.get_api_key() : null);
			if (!key) {
				throw new AuthMissingError('recruitee', ctx.authType ?? 'api_key');
			}

			// Every route sits under `/c/{company_id}`, so a token without its
			// company id cannot make a call. Checking it here sends a missing id
			// down the same connect-link path as a missing token.
			const companyId = options.company_id ?? (await ctx.keys.get_company_id());
			if (!companyId || companyId.trim().length === 0) {
				throw new AuthMissingError('recruitee', 'api_key');
			}

			return key;
		},
	} satisfies InternalRecruiteePlugin;
}

export { RecruiteeAPIError } from './client';

export type {
	CandidatesCreateInput,
	CandidatesCreateResponse,
	CandidatesDeleteInput,
	CandidatesDeleteResponse,
	CandidatesGetInput,
	CandidatesGetResponse,
	CandidatesListInput,
	CandidatesListResponse,
	CandidatesUpdateInput,
	CandidatesUpdateResponse,
	DepartmentsListInput,
	DepartmentsListResponse,
	LocationsListInput,
	LocationsListResponse,
	OffersCreateInput,
	OffersCreateResponse,
	OffersGetInput,
	OffersGetResponse,
	OffersListInput,
	OffersListResponse,
	OffersUpdateInput,
	OffersUpdateResponse,
	RecruiteeCandidate,
	RecruiteeDepartment,
	RecruiteeEndpointInputs,
	RecruiteeEndpointOutputs,
	RecruiteeLocation,
	RecruiteeOffer,
} from './endpoints/types';
