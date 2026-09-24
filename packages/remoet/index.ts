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
	Education,
	JobContext,
	Jobs,
	LinkTrees,
	Profile,
	Projects,
	SavedJobs,
	StarredJobs,
	Stars,
	WorkExperience,
} from './endpoints';
import type {
	RemoetEndpointInputs,
	RemoetEndpointOutputs,
} from './endpoints/types';
import {
	RemoetEndpointInputSchemas,
	RemoetEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RemoetSchema } from './schema';

export type RemoetPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRemoetPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof remoetEndpointsNested>;
};

export type RemoetContext = CorsairPluginContext<
	typeof RemoetSchema,
	RemoetPluginOptions
>;

export type RemoetKeyBuilderContext = KeyBuilderContext<RemoetPluginOptions>;

export type RemoetBoundEndpoints = BindEndpoints<typeof remoetEndpointsNested>;

type RemoetEndpoint<K extends keyof RemoetEndpointOutputs> = CorsairEndpoint<
	RemoetContext,
	RemoetEndpointInputs[K],
	RemoetEndpointOutputs[K]
>;

export type RemoetEndpoints = {
	profileGet: RemoetEndpoint<'profileGet'>;
	profileGetLinks: RemoetEndpoint<'profileGetLinks'>;
	profileUpdate: RemoetEndpoint<'profileUpdate'>;
	workExperienceList: RemoetEndpoint<'workExperienceList'>;
	projectsList: RemoetEndpoint<'projectsList'>;
	educationList: RemoetEndpoint<'educationList'>;
	linkTreesList: RemoetEndpoint<'linkTreesList'>;
	linkTreesGet: RemoetEndpoint<'linkTreesGet'>;
	jobContextGet: RemoetEndpoint<'jobContextGet'>;
	starsCreate: RemoetEndpoint<'starsCreate'>;
	jobsSearch: RemoetEndpoint<'jobsSearch'>;
	companiesSearch: RemoetEndpoint<'companiesSearch'>;
	companiesGet: RemoetEndpoint<'companiesGet'>;
	starredJobsList: RemoetEndpoint<'starredJobsList'>;
	savedJobsList: RemoetEndpoint<'savedJobsList'>;
	savedJobsCreate: RemoetEndpoint<'savedJobsCreate'>;
	savedJobsUpdate: RemoetEndpoint<'savedJobsUpdate'>;
	savedJobsDelete: RemoetEndpoint<'savedJobsDelete'>;
	starsDelete: RemoetEndpoint<'starsDelete'>;
};

const remoetEndpointsNested = {
	profile: {
		get: Profile.get,
		getLinks: Profile.getLinks,
		update: Profile.update,
	},
	workExperience: {
		list: WorkExperience.list,
	},
	projects: {
		list: Projects.list,
	},
	education: {
		list: Education.list,
	},
	linkTrees: {
		list: LinkTrees.list,
		get: LinkTrees.get,
	},
	jobContext: {
		get: JobContext.get,
	},
	stars: {
		create: Stars.create,
		delete: Stars.delete,
	},
	jobs: {
		search: Jobs.search,
	},
	companies: {
		search: Companies.search,
		get: Companies.get,
	},
	starredJobs: {
		list: StarredJobs.list,
	},
	savedJobs: {
		list: SavedJobs.list,
		create: SavedJobs.create,
		update: SavedJobs.update,
		delete: SavedJobs.delete,
	},
} as const;

const remoetWebhooksNested = {} as const;

export const remoetEndpointSchemas = {
	'profile.get': {
		input: RemoetEndpointInputSchemas.profileGet,
		output: RemoetEndpointOutputSchemas.profileGet,
	},
	'profile.getLinks': {
		input: RemoetEndpointInputSchemas.profileGetLinks,
		output: RemoetEndpointOutputSchemas.profileGetLinks,
	},
	'profile.update': {
		input: RemoetEndpointInputSchemas.profileUpdate,
		output: RemoetEndpointOutputSchemas.profileUpdate,
	},
	'workExperience.list': {
		input: RemoetEndpointInputSchemas.workExperienceList,
		output: RemoetEndpointOutputSchemas.workExperienceList,
	},
	'projects.list': {
		input: RemoetEndpointInputSchemas.projectsList,
		output: RemoetEndpointOutputSchemas.projectsList,
	},
	'education.list': {
		input: RemoetEndpointInputSchemas.educationList,
		output: RemoetEndpointOutputSchemas.educationList,
	},
	'linkTrees.list': {
		input: RemoetEndpointInputSchemas.linkTreesList,
		output: RemoetEndpointOutputSchemas.linkTreesList,
	},
	'linkTrees.get': {
		input: RemoetEndpointInputSchemas.linkTreesGet,
		output: RemoetEndpointOutputSchemas.linkTreesGet,
	},
	'jobContext.get': {
		input: RemoetEndpointInputSchemas.jobContextGet,
		output: RemoetEndpointOutputSchemas.jobContextGet,
	},
	'stars.create': {
		input: RemoetEndpointInputSchemas.starsCreate,
		output: RemoetEndpointOutputSchemas.starsCreate,
	},
	'jobs.search': {
		input: RemoetEndpointInputSchemas.jobsSearch,
		output: RemoetEndpointOutputSchemas.jobsSearch,
	},
	'companies.search': {
		input: RemoetEndpointInputSchemas.companiesSearch,
		output: RemoetEndpointOutputSchemas.companiesSearch,
	},
	'companies.get': {
		input: RemoetEndpointInputSchemas.companiesGet,
		output: RemoetEndpointOutputSchemas.companiesGet,
	},
	'starredJobs.list': {
		input: RemoetEndpointInputSchemas.starredJobsList,
		output: RemoetEndpointOutputSchemas.starredJobsList,
	},
	'savedJobs.list': {
		input: RemoetEndpointInputSchemas.savedJobsList,
		output: RemoetEndpointOutputSchemas.savedJobsList,
	},
	'savedJobs.create': {
		input: RemoetEndpointInputSchemas.savedJobsCreate,
		output: RemoetEndpointOutputSchemas.savedJobsCreate,
	},
	'savedJobs.update': {
		input: RemoetEndpointInputSchemas.savedJobsUpdate,
		output: RemoetEndpointOutputSchemas.savedJobsUpdate,
	},
	'savedJobs.delete': {
		input: RemoetEndpointInputSchemas.savedJobsDelete,
		output: RemoetEndpointOutputSchemas.savedJobsDelete,
	},
	'stars.delete': {
		input: RemoetEndpointInputSchemas.starsDelete,
		output: RemoetEndpointOutputSchemas.starsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof remoetEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const remoetEndpointMeta = {
	'profile.get': {
		riskLevel: 'read',
		description:
			"Get the signed-in user's whole Remoet profile: contact fields, work experience, projects, education and link trees",
	},
	'profile.getLinks': {
		riskLevel: 'read',
		description:
			"Get the user's public profile links (website, GitHub, LinkedIn and more); private links come back null",
	},
	'profile.update': {
		riskLevel: 'write',
		description:
			"Update the user's phone, url, location, githubUrl or linkedinUrl on their Remoet profile (500 characters max each)",
	},
	'workExperience.list': {
		riskLevel: 'read',
		description:
			"List the user's work experience (their employment history, not job postings)",
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects on the user profile',
	},
	'education.list': {
		riskLevel: 'read',
		description: 'List the education entries on the user profile',
	},
	'linkTrees.list': {
		riskLevel: 'read',
		description: "List the user's shareable link tree pages",
	},
	'linkTrees.get': {
		riskLevel: 'read',
		description: "Get one of the user's link tree pages by slug",
	},
	'jobContext.get': {
		riskLevel: 'read',
		description:
			'Look up what Remoet knows about a job page URL: company, tech stack, salary, remote policy, reposts and how long ago Remoet first saw it (at least that old, not a posting date). Returns match null for untracked pages',
	},
	'stars.create': {
		riskLevel: 'write',
		description:
			'Star a company on Remoet by its slug so its jobs reach the user feed. Stars are capped per user and removing one uses a limited budget, so confirm before starring',
	},
	'jobs.search': {
		riskLevel: 'read',
		description:
			"Search Remoet's public tech job catalogue by keywords, tech stack, company, location, remote policy, seniority and salary floor. Each job's firstSeenAt is when Remoet first saw it, not when it was posted. Paginated with page and pageSize (max 50)",
	},
	'companies.search': {
		riskLevel: 'read',
		description:
			"Search Remoet's tech companies by name, description, tech stack or seniority, or set starred to list the companies the user has starred. Paginated with page and pageSize (max 100)",
	},
	'companies.get': {
		riskLevel: 'read',
		description:
			'Get one Remoet company by slug, including its tech stack, perks and open-role counts; pass checkTechStack to see which technologies it uses',
	},
	'starredJobs.list': {
		riskLevel: 'read',
		description:
			'List jobs at the companies the user has starred, filtered by keywords, location, tech stack, remote policy, seniority and salary floor. createdAt is when Remoet first saw a job, not when it was posted. Paginated with page and pageSize (max 50)',
	},
	'savedJobs.list': {
		riskLevel: 'read',
		description:
			"List the user's saved jobs with their notes. A locked entry has job null and a lockedReason saying how to unlock it, usually: star the company to see it again. Paginated with page and pageSize (max 50)",
	},
	'savedJobs.create': {
		riskLevel: 'write',
		description:
			"Save a job to the user's saved jobs by its id, with an optional note (500 characters max)",
	},
	'savedJobs.update': {
		riskLevel: 'write',
		description:
			'Replace the note on a saved-job entry by its saved-job id (not the job id); null clears it',
	},
	'savedJobs.delete': {
		riskLevel: 'destructive',
		description:
			'Remove a saved-job entry by its saved-job id (not the job id)',
	},
	'stars.delete': {
		riskLevel: 'destructive',
		description:
			'Unstar a company by its slug. Each unstar spends from a limited budget that resets every 30 days, so confirm with the user first',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof remoetEndpointsNested>;

export const remoetAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseRemoetPlugin<T extends RemoetPluginOptions> = CorsairPlugin<
	'remoet',
	typeof RemoetSchema,
	typeof remoetEndpointsNested,
	typeof remoetWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalRemoetPlugin = BaseRemoetPlugin<RemoetPluginOptions>;

export type ExternalRemoetPlugin<T extends RemoetPluginOptions> =
	BaseRemoetPlugin<T>;

/** Creates a Remoet plugin configured for API-key authentication. */
export function remoet<const T extends RemoetPluginOptions>(
	incomingOptions: RemoetPluginOptions & T = {} as RemoetPluginOptions & T,
): ExternalRemoetPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'remoet',
		authConfig: remoetAuthConfig,
		schema: RemoetSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: remoetEndpointsNested,
		webhooks: remoetWebhooksNested,
		endpointMeta: remoetEndpointMeta,
		endpointSchemas: remoetEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RemoetKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('remoet', 'api_key');
		},
	} satisfies InternalRemoetPlugin;
}

export type {
	CompaniesGetInput,
	CompaniesGetResponse,
	CompaniesSearchInput,
	CompaniesSearchResponse,
	EducationListInput,
	EducationListResponse,
	JobContextGetInput,
	JobContextGetResponse,
	JobsSearchInput,
	JobsSearchResponse,
	LinkTreesGetInput,
	LinkTreesGetResponse,
	LinkTreesListInput,
	LinkTreesListResponse,
	ProfileGetInput,
	ProfileGetLinksInput,
	ProfileGetLinksResponse,
	ProfileGetResponse,
	ProfileUpdateInput,
	ProfileUpdateResponse,
	ProjectsListInput,
	ProjectsListResponse,
	RemoetCompanySummary,
	RemoetDataField,
	RemoetEducation,
	RemoetEndpointInputs,
	RemoetEndpointOutputs,
	RemoetJobContextMatch,
	RemoetJobPosting,
	RemoetLinkTree,
	RemoetProfile,
	RemoetProject,
	RemoetSavedJob,
	RemoetStarredJob,
	RemoetWorkExperience,
	SavedJobsCreateInput,
	SavedJobsCreateResponse,
	SavedJobsDeleteInput,
	SavedJobsDeleteResponse,
	SavedJobsListInput,
	SavedJobsListResponse,
	SavedJobsUpdateInput,
	SavedJobsUpdateResponse,
	StarredJobsListInput,
	StarredJobsListResponse,
	StarsCreateInput,
	StarsCreateResponse,
	StarsDeleteInput,
	StarsDeleteResponse,
	WorkExperienceListInput,
	WorkExperienceListResponse,
} from './endpoints/types';
