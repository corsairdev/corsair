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
import { packClassmarkerCredentials, tryGetStoredKey } from './client';
import {
	AccessLists,
	ApiKeys,
	Categories,
	Certificates,
	Groups,
	GroupsLinksExams,
	Questions,
	RecentResults,
	Tests,
	Users,
	Utility,
	Webhooks,
} from './endpoints';
import type {
	ClassmarkerEndpointInputs,
	ClassmarkerEndpointOutputs,
} from './endpoints/types';
import {
	ClassmarkerEndpointInputSchemas,
	ClassmarkerEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClassmarkerSchema } from './schema';

export type ClassmarkerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiSecret?: string;
	hooks?: InternalClassmarkerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof classmarkerEndpointsNested>;
};

export type ClassmarkerContext = CorsairPluginContext<
	typeof ClassmarkerSchema,
	ClassmarkerPluginOptions,
	undefined,
	typeof classmarkerAuthConfig
>;

export type ClassmarkerKeyBuilderContext = KeyBuilderContext<
	ClassmarkerPluginOptions,
	typeof classmarkerAuthConfig
>;

export type ClassmarkerBoundEndpoints = BindEndpoints<
	typeof classmarkerEndpointsNested
>;

type ClassmarkerEndpoint<K extends keyof ClassmarkerEndpointOutputs> =
	CorsairEndpoint<
		ClassmarkerContext,
		ClassmarkerEndpointInputs[K],
		ClassmarkerEndpointOutputs[K]
	>;

export type ClassmarkerEndpoints = {
	getAllGroupsLinksExams: ClassmarkerEndpoint<'getAllGroupsLinksExams'>;
	getRecentResultsForAllGroups: ClassmarkerEndpoint<'getRecentResultsForAllGroups'>;
	getRecentResultsForAllLinks: ClassmarkerEndpoint<'getRecentResultsForAllLinks'>;
	getRecentResultsForGroupExam: ClassmarkerEndpoint<'getRecentResultsForGroupExam'>;
	getRecentResultsForLinkExam: ClassmarkerEndpoint<'getRecentResultsForLinkExam'>;
	addAccessCodes: ClassmarkerEndpoint<'addAccessCodes'>;
	deleteAccessCodes: ClassmarkerEndpoint<'deleteAccessCodes'>;
	getAllCategories: ClassmarkerEndpoint<'getAllCategories'>;
	createParentCategory: ClassmarkerEndpoint<'createParentCategory'>;
	updateParentCategory: ClassmarkerEndpoint<'updateParentCategory'>;
	createCategory: ClassmarkerEndpoint<'createCategory'>;
	updateCategory: ClassmarkerEndpoint<'updateCategory'>;
	listQuestions: ClassmarkerEndpoint<'listQuestions'>;
	getQuestion: ClassmarkerEndpoint<'getQuestion'>;
	createQuestion: ClassmarkerEndpoint<'createQuestion'>;
	updateQuestion: ClassmarkerEndpoint<'updateQuestion'>;
	listUsers: ClassmarkerEndpoint<'listUsers'>;
	getUserDetails: ClassmarkerEndpoint<'getUserDetails'>;
	createUser: ClassmarkerEndpoint<'createUser'>;
	deleteUser: ClassmarkerEndpoint<'deleteUser'>;
	createGroup: ClassmarkerEndpoint<'createGroup'>;
	deleteGroup: ClassmarkerEndpoint<'deleteGroup'>;
	getGroupDetails: ClassmarkerEndpoint<'getGroupDetails'>;
	listTests: ClassmarkerEndpoint<'listTests'>;
	getTestDetails: ClassmarkerEndpoint<'getTestDetails'>;
	deleteTestLink: ClassmarkerEndpoint<'deleteTestLink'>;
	listCertificates: ClassmarkerEndpoint<'listCertificates'>;
	listWebhooks: ClassmarkerEndpoint<'listWebhooks'>;
	deleteWebhook: ClassmarkerEndpoint<'deleteWebhook'>;
	deleteApiKey: ClassmarkerEndpoint<'deleteApiKey'>;
	getInitialFinishedAfterTimestamp: ClassmarkerEndpoint<'getInitialFinishedAfterTimestamp'>;
};

const classmarkerEndpointsNested = {
	groupsLinksExams: {
		getAll: GroupsLinksExams.getAll,
	},
	recentResults: {
		forAllGroups: RecentResults.forAllGroups,
		forAllLinks: RecentResults.forAllLinks,
		forGroupExam: RecentResults.forGroupExam,
		forLinkExam: RecentResults.forLinkExam,
	},
	accessLists: {
		addCodes: AccessLists.addCodes,
		deleteCodes: AccessLists.deleteCodes,
	},
	categories: {
		list: Categories.list,
		createParent: Categories.createParent,
		updateParent: Categories.updateParent,
		create: Categories.create,
		update: Categories.update,
	},
	questions: {
		list: Questions.list,
		get: Questions.get,
		create: Questions.create,
		update: Questions.update,
	},
	users: {
		list: Users.list,
		get: Users.get,
		create: Users.create,
		delete: Users.delete,
	},
	groups: {
		create: Groups.create,
		delete: Groups.delete,
		get: Groups.get,
	},
	tests: {
		list: Tests.list,
		get: Tests.get,
		deleteLink: Tests.deleteLink,
	},
	certificates: {
		list: Certificates.list,
	},
	webhooks: {
		list: Webhooks.list,
		delete: Webhooks.delete,
	},
	apiKeys: {
		delete: ApiKeys.delete,
	},
	utility: {
		getInitialFinishedAfterTimestamp: Utility.getInitialFinishedAfterTimestamp,
	},
} as const;

const classmarkerWebhooksNested = {} as const;

export const classmarkerEndpointSchemas = {
	'groupsLinksExams.getAll': {
		input: ClassmarkerEndpointInputSchemas.getAllGroupsLinksExams,
		output: ClassmarkerEndpointOutputSchemas.getAllGroupsLinksExams,
	},
	'recentResults.forAllGroups': {
		input: ClassmarkerEndpointInputSchemas.getRecentResultsForAllGroups,
		output: ClassmarkerEndpointOutputSchemas.getRecentResultsForAllGroups,
	},
	'recentResults.forAllLinks': {
		input: ClassmarkerEndpointInputSchemas.getRecentResultsForAllLinks,
		output: ClassmarkerEndpointOutputSchemas.getRecentResultsForAllLinks,
	},
	'recentResults.forGroupExam': {
		input: ClassmarkerEndpointInputSchemas.getRecentResultsForGroupExam,
		output: ClassmarkerEndpointOutputSchemas.getRecentResultsForGroupExam,
	},
	'recentResults.forLinkExam': {
		input: ClassmarkerEndpointInputSchemas.getRecentResultsForLinkExam,
		output: ClassmarkerEndpointOutputSchemas.getRecentResultsForLinkExam,
	},
	'accessLists.addCodes': {
		input: ClassmarkerEndpointInputSchemas.addAccessCodes,
		output: ClassmarkerEndpointOutputSchemas.addAccessCodes,
	},
	'accessLists.deleteCodes': {
		input: ClassmarkerEndpointInputSchemas.deleteAccessCodes,
		output: ClassmarkerEndpointOutputSchemas.deleteAccessCodes,
	},
	'categories.list': {
		input: ClassmarkerEndpointInputSchemas.getAllCategories,
		output: ClassmarkerEndpointOutputSchemas.getAllCategories,
	},
	'categories.createParent': {
		input: ClassmarkerEndpointInputSchemas.createParentCategory,
		output: ClassmarkerEndpointOutputSchemas.createParentCategory,
	},
	'categories.updateParent': {
		input: ClassmarkerEndpointInputSchemas.updateParentCategory,
		output: ClassmarkerEndpointOutputSchemas.updateParentCategory,
	},
	'categories.create': {
		input: ClassmarkerEndpointInputSchemas.createCategory,
		output: ClassmarkerEndpointOutputSchemas.createCategory,
	},
	'categories.update': {
		input: ClassmarkerEndpointInputSchemas.updateCategory,
		output: ClassmarkerEndpointOutputSchemas.updateCategory,
	},
	'questions.list': {
		input: ClassmarkerEndpointInputSchemas.listQuestions,
		output: ClassmarkerEndpointOutputSchemas.listQuestions,
	},
	'questions.get': {
		input: ClassmarkerEndpointInputSchemas.getQuestion,
		output: ClassmarkerEndpointOutputSchemas.getQuestion,
	},
	'questions.create': {
		input: ClassmarkerEndpointInputSchemas.createQuestion,
		output: ClassmarkerEndpointOutputSchemas.createQuestion,
	},
	'questions.update': {
		input: ClassmarkerEndpointInputSchemas.updateQuestion,
		output: ClassmarkerEndpointOutputSchemas.updateQuestion,
	},
	'users.list': {
		input: ClassmarkerEndpointInputSchemas.listUsers,
		output: ClassmarkerEndpointOutputSchemas.listUsers,
	},
	'users.get': {
		input: ClassmarkerEndpointInputSchemas.getUserDetails,
		output: ClassmarkerEndpointOutputSchemas.getUserDetails,
	},
	'users.create': {
		input: ClassmarkerEndpointInputSchemas.createUser,
		output: ClassmarkerEndpointOutputSchemas.createUser,
	},
	'users.delete': {
		input: ClassmarkerEndpointInputSchemas.deleteUser,
		output: ClassmarkerEndpointOutputSchemas.deleteUser,
	},
	'groups.create': {
		input: ClassmarkerEndpointInputSchemas.createGroup,
		output: ClassmarkerEndpointOutputSchemas.createGroup,
	},
	'groups.delete': {
		input: ClassmarkerEndpointInputSchemas.deleteGroup,
		output: ClassmarkerEndpointOutputSchemas.deleteGroup,
	},
	'groups.get': {
		input: ClassmarkerEndpointInputSchemas.getGroupDetails,
		output: ClassmarkerEndpointOutputSchemas.getGroupDetails,
	},
	'tests.list': {
		input: ClassmarkerEndpointInputSchemas.listTests,
		output: ClassmarkerEndpointOutputSchemas.listTests,
	},
	'tests.get': {
		input: ClassmarkerEndpointInputSchemas.getTestDetails,
		output: ClassmarkerEndpointOutputSchemas.getTestDetails,
	},
	'tests.deleteLink': {
		input: ClassmarkerEndpointInputSchemas.deleteTestLink,
		output: ClassmarkerEndpointOutputSchemas.deleteTestLink,
	},
	'certificates.list': {
		input: ClassmarkerEndpointInputSchemas.listCertificates,
		output: ClassmarkerEndpointOutputSchemas.listCertificates,
	},
	'webhooks.list': {
		input: ClassmarkerEndpointInputSchemas.listWebhooks,
		output: ClassmarkerEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.delete': {
		input: ClassmarkerEndpointInputSchemas.deleteWebhook,
		output: ClassmarkerEndpointOutputSchemas.deleteWebhook,
	},
	'apiKeys.delete': {
		input: ClassmarkerEndpointInputSchemas.deleteApiKey,
		output: ClassmarkerEndpointOutputSchemas.deleteApiKey,
	},
	'utility.getInitialFinishedAfterTimestamp': {
		input: ClassmarkerEndpointInputSchemas.getInitialFinishedAfterTimestamp,
		output: ClassmarkerEndpointOutputSchemas.getInitialFinishedAfterTimestamp,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof classmarkerEndpointsNested
>;

const classmarkerEndpointMeta = {
	'groupsLinksExams.getAll': {
		riskLevel: 'read',
		description:
			'List all groups, links, and assigned tests visible to the API key.',
	},
	'recentResults.forAllGroups': {
		riskLevel: 'read',
		description:
			'Fetch recent results across all groups with timestamp pagination.',
	},
	'recentResults.forAllLinks': {
		riskLevel: 'read',
		description:
			'Fetch recent results across all links with timestamp pagination.',
	},
	'recentResults.forGroupExam': {
		riskLevel: 'read',
		description: 'Fetch recent results for one group/test pair.',
	},
	'recentResults.forLinkExam': {
		riskLevel: 'read',
		description: 'Fetch recent results for one link/test pair.',
	},
	'accessLists.addCodes': {
		riskLevel: 'write',
		description: 'Add access-list codes for a link exam.',
	},
	'accessLists.deleteCodes': {
		riskLevel: 'destructive',
		description: 'Delete access-list codes for a link exam.',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List parent categories and sub-categories.',
	},
	'categories.createParent': {
		riskLevel: 'write',
		description: 'Create a parent category in the question bank.',
	},
	'categories.updateParent': {
		riskLevel: 'write',
		description: 'Update a parent category in the question bank.',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a category under a parent category.',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Update a category and optionally re-parent it.',
	},
	'questions.list': {
		riskLevel: 'read',
		description: 'List question-bank questions (200 per page).',
	},
	'questions.get': {
		riskLevel: 'read',
		description: 'Get one question from the question bank.',
	},
	'questions.create': {
		riskLevel: 'write',
		description: 'Create a new question in the question bank.',
	},
	'questions.update': {
		riskLevel: 'write',
		description: 'Update an existing question in the question bank.',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users in your ClassMarker account.',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get details for one ClassMarker user.',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a new ClassMarker user.',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description: 'Delete an existing ClassMarker user.',
	},
	'groups.create': {
		riskLevel: 'write',
		description: 'Create a new ClassMarker group.',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ClassMarker group.',
	},
	'groups.get': {
		riskLevel: 'read',
		description: 'Get details for a specific ClassMarker group.',
	},
	'tests.list': {
		riskLevel: 'read',
		description: 'List all tests available to the API key.',
	},
	'tests.get': {
		riskLevel: 'read',
		description: 'Get details for a specific ClassMarker test.',
	},
	'tests.deleteLink': {
		riskLevel: 'destructive',
		description: 'Delete one link assignment from a test.',
	},
	'certificates.list': {
		riskLevel: 'read',
		description: 'List all ClassMarker certificates.',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List configured ClassMarker webhooks.',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ClassMarker webhook.',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		description: 'Delete a ClassMarker API key by id.',
	},
	'utility.getInitialFinishedAfterTimestamp': {
		riskLevel: 'read',
		description:
			'Compute the initial finishedAfterTimestamp cursor for recent-results pagination.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof classmarkerEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const classmarkerAuthConfig = {
	api_key: {
		account: ['api_key_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClassmarkerPlugin<T extends ClassmarkerPluginOptions> =
	CorsairPlugin<
		'classmarker',
		typeof ClassmarkerSchema,
		typeof classmarkerEndpointsNested,
		typeof classmarkerWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof classmarkerAuthConfig
	>;

export type InternalClassmarkerPlugin =
	BaseClassmarkerPlugin<ClassmarkerPluginOptions>;

export type ExternalClassmarkerPlugin<T extends ClassmarkerPluginOptions> =
	BaseClassmarkerPlugin<T>;

export function classmarker<const T extends ClassmarkerPluginOptions>(
	incomingOptions: ClassmarkerPluginOptions &
		T = {} as ClassmarkerPluginOptions & T,
): ExternalClassmarkerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'classmarker',
		authConfig: classmarkerAuthConfig,
		schema: ClassmarkerSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: classmarkerEndpointsNested,
		webhooks: classmarkerWebhooksNested,
		endpointMeta: classmarkerEndpointMeta,
		endpointSchemas: classmarkerEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClassmarkerKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				return '';
			}

			const apiKey =
				options.key ?? (await tryGetStoredKey(() => ctx.keys.get_api_key()));
			const apiSecret =
				options.apiSecret ??
				(await tryGetStoredKey(() => ctx.keys.get_api_key_secret()));

			if (!apiKey || !apiSecret) {
				throw new AuthMissingError('classmarker', 'api_key');
			}

			return packClassmarkerCredentials(apiKey, apiSecret);
		},
	} satisfies InternalClassmarkerPlugin;
}

export type {
	AccessCodesResponseOutput,
	AddAccessCodesInput,
	CategoryMutationOutput,
	ClassmarkerEndpointInputs,
	ClassmarkerEndpointOutputs,
	CreateCategoryInput,
	CreateGroupInput,
	CreateGroupOutput,
	CreateParentCategoryInput,
	CreateQuestionInput,
	CreateUserInput,
	CreateUserOutput,
	DeleteApiKeyInput,
	DeleteApiKeyOutput,
	DeleteGroupInput,
	DeleteGroupOutput,
	DeleteTestLinkInput,
	DeleteTestLinkOutput,
	DeleteUserInput,
	DeleteUserOutput,
	DeleteWebhookInput,
	DeleteWebhookOutput,
	GetAllCategoriesInput,
	GetAllCategoriesOutput,
	GetAllGroupsLinksExamsInput,
	GetAllGroupsLinksExamsOutput,
	GetGroupDetailsInput,
	GetGroupDetailsOutput,
	GetInitialFinishedAfterTimestampInput,
	GetInitialFinishedAfterTimestampOutput,
	GetQuestionInput,
	GetQuestionOutput,
	GetRecentResultsForAllGroupsInput,
	GetRecentResultsForAllGroupsOutput,
	GetRecentResultsForAllLinksInput,
	GetRecentResultsForAllLinksOutput,
	GetRecentResultsForGroupExamInput,
	GetRecentResultsForGroupExamOutput,
	GetRecentResultsForLinkExamInput,
	GetRecentResultsForLinkExamOutput,
	GetTestDetailsInput,
	GetTestDetailsOutput,
	GetUserDetailsInput,
	GetUserDetailsOutput,
	ListCertificatesInput,
	ListCertificatesOutput,
	ListQuestionsInput,
	ListQuestionsOutput,
	ListTestsInput,
	ListTestsOutput,
	ListUsersInput,
	ListUsersOutput,
	ListWebhooksInput,
	ListWebhooksOutput,
	ParentCategoryMutationOutput,
	QuestionMutationOutput,
	UpdateCategoryInput,
	UpdateParentCategoryInput,
	UpdateQuestionInput,
} from './endpoints/types';
