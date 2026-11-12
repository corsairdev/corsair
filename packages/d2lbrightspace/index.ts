import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { normalizeD2LBrightspaceBaseUrl } from './client';
import * as endpoints from './endpoints';
import type {
	D2LBrightspaceEndpointInputs,
	D2LBrightspaceEndpointOutputs,
} from './endpoints/types';
import {
	D2LBrightspaceEndpointInputSchemas as inputs,
	D2LBrightspaceEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { D2LBrightspaceSchema } from './schema';

export type D2LBrightspacePluginOptions = {
	baseUrl?: string;
	authType?: 'oauth_2';
	/** Scopes must be registered with the Brightspace OAuth application. */
	scopes?: readonly string[];
	key?: string;
	hooks?: InternalD2LBrightspacePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpointMap>;
};

export type D2LBrightspaceContext = CorsairPluginContext<
	typeof D2LBrightspaceSchema,
	D2LBrightspacePluginOptions
>;
export type D2LBrightspaceKeyBuilderContext =
	KeyBuilderContext<D2LBrightspacePluginOptions>;
export type D2LBrightspaceEndpoints = {
	[K in keyof D2LBrightspaceEndpointInputs]: CorsairEndpoint<
		D2LBrightspaceContext,
		D2LBrightspaceEndpointInputs[K],
		D2LBrightspaceEndpointOutputs[K]
	>;
};

const endpointMap = {
	users: {
		current: endpoints.currentUser,
		list: endpoints.listUsers,
		get: endpoints.getUser,
		create: endpoints.createUser,
		update: endpoints.updateUser,
		delete: endpoints.deleteUser,
	},
	roles: {
		list: endpoints.listRoles,
		get: endpoints.getRole,
		getEnrolled: endpoints.getEnrolledRoles,
		copy: endpoints.copyRole,
	},
	courses: {
		get: endpoints.getCourse,
		schema: endpoints.getCourseSchema,
		create: endpoints.createCourse,
		update: endpoints.updateCourse,
		delete: endpoints.deleteCourse,
	},
	templates: {
		get: endpoints.getTemplate,
		schema: endpoints.getTemplateSchema,
		create: endpoints.createTemplate,
		update: endpoints.updateTemplate,
		delete: endpoints.deleteTemplate,
	},
	demographics: {
		getOrgUnit: endpoints.getOrgUnitDemographics,
		deleteUser: endpoints.deleteUserDemographics,
	},
	grades: {
		list: endpoints.listGrades,
		get: endpoints.getGrade,
		create: endpoints.createGrade,
		update: endpoints.updateGrade,
		delete: endpoints.deleteGrade,
		access: endpoints.getGradeAccess,
		statistics: endpoints.getGradeStatistics,
		setup: endpoints.getGradeSetup,
		updateSetup: endpoints.updateGradeSetup,
	},
	quizzes: {
		list: endpoints.listQuizzes,
		get: endpoints.getQuiz,
		create: endpoints.createQuiz,
		update: endpoints.updateQuiz,
		delete: endpoints.deleteQuiz,
		access: endpoints.getQuizAccess,
		listAttempts: endpoints.listAttempts,
		getAttempt: endpoints.getAttempt,
		listQuestions: endpoints.listQuestions,
	},
	quizCategories: {
		list: endpoints.listQuizCategories,
		get: endpoints.getQuizCategory,
		create: endpoints.createQuizCategory,
		update: endpoints.updateQuizCategory,
		delete: endpoints.deleteQuizCategory,
	},
} as const;
const webhookMap = {} as const;

export const d2lbrightspaceEndpointSchemas = {
	'users.current': { input: inputs.currentUser, output: outputs.currentUser },
	'users.list': { input: inputs.listUsers, output: outputs.listUsers },
	'users.get': { input: inputs.getUser, output: outputs.getUser },
	'users.create': { input: inputs.createUser, output: outputs.createUser },
	'users.update': { input: inputs.updateUser, output: outputs.updateUser },
	'users.delete': { input: inputs.deleteUser, output: outputs.deleteUser },
	'roles.list': { input: inputs.listRoles, output: outputs.listRoles },
	'roles.get': { input: inputs.getRole, output: outputs.getRole },
	'roles.getEnrolled': {
		input: inputs.getEnrolledRoles,
		output: outputs.getEnrolledRoles,
	},
	'roles.copy': { input: inputs.copyRole, output: outputs.copyRole },
	'courses.get': { input: inputs.getCourse, output: outputs.getCourse },
	'courses.schema': {
		input: inputs.getCourseSchema,
		output: outputs.getCourseSchema,
	},
	'courses.create': {
		input: inputs.createCourse,
		output: outputs.createCourse,
	},
	'courses.update': {
		input: inputs.updateCourse,
		output: outputs.updateCourse,
	},
	'courses.delete': {
		input: inputs.deleteCourse,
		output: outputs.deleteCourse,
	},
	'templates.get': { input: inputs.getTemplate, output: outputs.getTemplate },
	'templates.schema': {
		input: inputs.getTemplateSchema,
		output: outputs.getTemplateSchema,
	},
	'templates.create': {
		input: inputs.createTemplate,
		output: outputs.createTemplate,
	},
	'templates.update': {
		input: inputs.updateTemplate,
		output: outputs.updateTemplate,
	},
	'templates.delete': {
		input: inputs.deleteTemplate,
		output: outputs.deleteTemplate,
	},
	'demographics.getOrgUnit': {
		input: inputs.getOrgUnitDemographics,
		output: outputs.getOrgUnitDemographics,
	},
	'demographics.deleteUser': {
		input: inputs.deleteUserDemographics,
		output: outputs.deleteUserDemographics,
	},
	'grades.list': { input: inputs.listGrades, output: outputs.listGrades },
	'grades.get': { input: inputs.getGrade, output: outputs.getGrade },
	'grades.create': { input: inputs.createGrade, output: outputs.createGrade },
	'grades.update': { input: inputs.updateGrade, output: outputs.updateGrade },
	'grades.delete': { input: inputs.deleteGrade, output: outputs.deleteGrade },
	'grades.access': {
		input: inputs.getGradeAccess,
		output: outputs.getGradeAccess,
	},
	'grades.statistics': {
		input: inputs.getGradeStatistics,
		output: outputs.getGradeStatistics,
	},
	'grades.setup': {
		input: inputs.getGradeSetup,
		output: outputs.getGradeSetup,
	},
	'grades.updateSetup': {
		input: inputs.updateGradeSetup,
		output: outputs.updateGradeSetup,
	},
	'quizzes.list': { input: inputs.listQuizzes, output: outputs.listQuizzes },
	'quizzes.get': { input: inputs.getQuiz, output: outputs.getQuiz },
	'quizzes.create': { input: inputs.createQuiz, output: outputs.createQuiz },
	'quizzes.update': { input: inputs.updateQuiz, output: outputs.updateQuiz },
	'quizzes.delete': { input: inputs.deleteQuiz, output: outputs.deleteQuiz },
	'quizzes.access': {
		input: inputs.getQuizAccess,
		output: outputs.getQuizAccess,
	},
	'quizzes.listAttempts': {
		input: inputs.listAttempts,
		output: outputs.listAttempts,
	},
	'quizzes.getAttempt': {
		input: inputs.getAttempt,
		output: outputs.getAttempt,
	},
	'quizzes.listQuestions': {
		input: inputs.listQuestions,
		output: outputs.listQuestions,
	},
	'quizCategories.list': {
		input: inputs.listQuizCategories,
		output: outputs.listQuizCategories,
	},
	'quizCategories.get': {
		input: inputs.getQuizCategory,
		output: outputs.getQuizCategory,
	},
	'quizCategories.create': {
		input: inputs.createQuizCategory,
		output: outputs.createQuizCategory,
	},
	'quizCategories.update': {
		input: inputs.updateQuizCategory,
		output: outputs.updateQuizCategory,
	},
	'quizCategories.delete': {
		input: inputs.deleteQuizCategory,
		output: outputs.deleteQuizCategory,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpointMap>;

const endpointMeta = {
	'users.current': { riskLevel: 'read', description: 'Get the current user' },
	'users.list': { riskLevel: 'read', description: 'List or search users' },
	'users.get': { riskLevel: 'read', description: 'Get a user by ID' },
	'users.create': { riskLevel: 'write', description: 'Create a user' },
	'users.update': { riskLevel: 'write', description: 'Update a user' },
	'users.delete': { riskLevel: 'destructive', description: 'Delete a user' },
	'roles.list': { riskLevel: 'read', description: 'List roles' },
	'roles.get': { riskLevel: 'read', description: 'Get a role by ID' },
	'roles.getEnrolled': {
		riskLevel: 'read',
		description: 'List enrolled roles in an org unit',
	},
	'roles.copy': {
		riskLevel: 'write',
		description: 'Copy a role using the unsupported unstable API',
	},
	'courses.get': { riskLevel: 'read', description: 'Get a course offering' },
	'courses.schema': {
		riskLevel: 'read',
		description: 'Get course parent constraints',
	},
	'courses.create': {
		riskLevel: 'write',
		description: 'Create a course offering',
	},
	'courses.update': {
		riskLevel: 'write',
		description: 'Update a course offering',
	},
	'courses.delete': {
		riskLevel: 'destructive',
		description: 'Archive a course offering',
	},
	'templates.get': { riskLevel: 'read', description: 'Get a course template' },
	'templates.schema': {
		riskLevel: 'read',
		description: 'Get course template parent constraints',
	},
	'templates.create': {
		riskLevel: 'write',
		description: 'Create a course template',
	},
	'templates.update': {
		riskLevel: 'write',
		description: 'Update a course template',
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: 'Archive a course template',
	},
	'demographics.getOrgUnit': {
		riskLevel: 'read',
		description: 'Get org unit demographics',
	},
	'demographics.deleteUser': {
		riskLevel: 'destructive',
		description: 'Delete user demographics',
	},
	'grades.list': { riskLevel: 'read', description: 'List grade objects' },
	'grades.get': { riskLevel: 'read', description: 'Get a grade object' },
	'grades.create': { riskLevel: 'write', description: 'Create a grade object' },
	'grades.update': { riskLevel: 'write', description: 'Update a grade object' },
	'grades.delete': {
		riskLevel: 'destructive',
		description: 'Delete a grade object',
	},
	'grades.access': {
		riskLevel: 'read',
		description: 'List users with access to a grade',
	},
	'grades.statistics': {
		riskLevel: 'read',
		description: 'Get grade statistics',
	},
	'grades.setup': { riskLevel: 'read', description: 'Get grade setup' },
	'grades.updateSetup': {
		riskLevel: 'write',
		description: 'Update grade setup',
	},
	'quizzes.list': { riskLevel: 'read', description: 'List quizzes' },
	'quizzes.get': { riskLevel: 'read', description: 'Get a quiz' },
	'quizzes.create': { riskLevel: 'write', description: 'Create a quiz' },
	'quizzes.update': { riskLevel: 'write', description: 'Update a quiz' },
	'quizzes.delete': { riskLevel: 'destructive', description: 'Delete a quiz' },
	'quizzes.access': {
		riskLevel: 'read',
		description: 'List users with quiz access',
	},
	'quizzes.listAttempts': {
		riskLevel: 'read',
		description: 'List quiz attempts',
	},
	'quizzes.getAttempt': {
		riskLevel: 'read',
		description: 'Get a quiz attempt',
	},
	'quizzes.listQuestions': {
		riskLevel: 'read',
		description: 'List quiz questions',
	},
	'quizCategories.list': {
		riskLevel: 'read',
		description: 'List quiz categories',
	},
	'quizCategories.get': {
		riskLevel: 'read',
		description: 'Get a quiz category',
	},
	'quizCategories.create': {
		riskLevel: 'write',
		description: 'Create a quiz category',
	},
	'quizCategories.update': {
		riskLevel: 'write',
		description: 'Update a quiz category',
	},
	'quizCategories.delete': {
		riskLevel: 'destructive',
		description: 'Delete a quiz category',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpointMap>;

export type D2LBrightspaceBoundEndpoints = BindEndpoints<typeof endpointMap>;
export type BaseD2LBrightspacePlugin<T extends D2LBrightspacePluginOptions> =
	CorsairPlugin<
		'd2lbrightspace',
		typeof D2LBrightspaceSchema,
		typeof endpointMap,
		typeof webhookMap,
		T,
		'oauth_2'
	>;
export type InternalD2LBrightspacePlugin =
	BaseD2LBrightspacePlugin<D2LBrightspacePluginOptions>;

export function d2lbrightspace<const T extends D2LBrightspacePluginOptions>(
	incomingOptions: T = {} as T,
): BaseD2LBrightspacePlugin<T> {
	const options = {
		...incomingOptions,
		baseUrl: incomingOptions.baseUrl
			? normalizeD2LBrightspaceBaseUrl(incomingOptions.baseUrl)
			: undefined,
		authType: 'oauth_2' as const,
	};
	return {
		id: 'd2lbrightspace',
		oauthConfig: {
			providerName: 'D2L Brightspace',
			authUrl: 'https://auth.brightspace.com/oauth2/auth',
			tokenUrl: 'https://auth.brightspace.com/core/connect/token',
			scopes: [...(options.scopes ?? ['users:own_profile:read'])],
			requiresRegisteredRedirect: true,
		},
		schema: D2LBrightspaceSchema,
		options,
		hooks: options.hooks,
		endpoints: endpointMap,
		webhooks: webhookMap,
		endpointSchemas: d2lbrightspaceEndpointSchemas,
		endpointMeta,
		webhookSchemas: {},
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: D2LBrightspaceKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('d2lbrightspace', 'oauth_2');
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('d2lbrightspace', 'oauth_2');
			return getOAuthAccessToken(ctx, {
				plugin: 'd2lbrightspace',
				tokenUrl: 'https://auth.brightspace.com/core/connect/token',
			});
		},
	} satisfies InternalD2LBrightspacePlugin;
}

export type {
	D2LBrightspaceEndpointInputs,
	D2LBrightspaceEndpointOutputs,
} from './endpoints/types';
