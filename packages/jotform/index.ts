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
	Folders,
	Forms,
	Labels,
	Reports,
	Submissions,
	System,
	User,
} from './endpoints';
import type {
	JotformEndpointInputs,
	JotformEndpointOutputs,
} from './endpoints/types';
import {
	JotformEndpointInputSchemas,
	JotformEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JotformSchema } from './schema';

export type JotformPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseUrl?: string;
	hooks?: InternalJotformPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof jotformEndpointsNested>;
};

export type JotformContext = CorsairPluginContext<
	typeof JotformSchema,
	JotformPluginOptions
>;

export type JotformKeyBuilderContext = KeyBuilderContext<JotformPluginOptions>;

export type JotformBoundEndpoints = BindEndpoints<
	typeof jotformEndpointsNested
>;

type JotformEndpoint<K extends keyof JotformEndpointOutputs> = CorsairEndpoint<
	JotformContext,
	JotformEndpointInputs[K],
	JotformEndpointOutputs[K]
>;

export type JotformEndpoints = {
	[K in keyof JotformEndpointOutputs]: JotformEndpoint<K>;
};

const jotformEndpointsNested = {
	user: {
		get: User.get,
		getForms: User.getForms,
		getSubmissions: User.getSubmissions,
		getFolders: User.getFolders,
		getHistory: User.getHistory,
		getSettings: User.getSettings,
		updateSettings: User.updateSettings,
		getSettingByKey: User.getSettingByKey,
		getSubusers: User.getSubusers,
		getUsage: User.getUsage,
		getReports: User.getReports,
		getInvoices: User.getInvoices,
		getLabels: User.getLabels,
	},
	forms: {
		get: Forms.get,
		create: Forms.create,
		createForms: Forms.createForms,
		delete: Forms.delete,
		clone: Forms.clone,
		getFiles: Forms.getFiles,
		getQuestions: Forms.getQuestions,
		getQuestion: Forms.getQuestion,
		createQuestion: Forms.createQuestion,
		createQuestions: Forms.createQuestions,
		updateQuestion: Forms.updateQuestion,
		deleteQuestion: Forms.deleteQuestion,
		getProperties: Forms.getProperties,
		getProperty: Forms.getProperty,
		setProperties: Forms.setProperties,
		getReports: Forms.getReports,
		createReport: Forms.createReport,
		getSubmissions: Forms.getSubmissions,
		createSubmission: Forms.createSubmission,
		createSubmissions: Forms.createSubmissions,
	},
	submissions: {
		get: Submissions.get,
		update: Submissions.update,
		delete: Submissions.delete,
	},
	reports: {
		get: Reports.get,
		delete: Reports.delete,
	},
	folders: {
		get: Folders.get,
		create: Folders.create,
		update: Folders.update,
		delete: Folders.delete,
	},
	labels: {
		get: Labels.get,
		create: Labels.create,
		update: Labels.update,
		delete: Labels.delete,
		getResources: Labels.getResources,
		addResources: Labels.addResources,
		removeResources: Labels.removeResources,
	},
	system: {
		getPlan: System.getPlan,
	},
} as const;

export const jotformEndpointSchemas = {
	'user.get': {
		input: JotformEndpointInputSchemas['user.get'],
		output: JotformEndpointOutputSchemas['user.get'],
	},
	'user.getForms': {
		input: JotformEndpointInputSchemas['user.getForms'],
		output: JotformEndpointOutputSchemas['user.getForms'],
	},
	'user.getSubmissions': {
		input: JotformEndpointInputSchemas['user.getSubmissions'],
		output: JotformEndpointOutputSchemas['user.getSubmissions'],
	},
	'user.getFolders': {
		input: JotformEndpointInputSchemas['user.getFolders'],
		output: JotformEndpointOutputSchemas['user.getFolders'],
	},
	'user.getHistory': {
		input: JotformEndpointInputSchemas['user.getHistory'],
		output: JotformEndpointOutputSchemas['user.getHistory'],
	},
	'user.getSettings': {
		input: JotformEndpointInputSchemas['user.getSettings'],
		output: JotformEndpointOutputSchemas['user.getSettings'],
	},
	'user.updateSettings': {
		input: JotformEndpointInputSchemas['user.updateSettings'],
		output: JotformEndpointOutputSchemas['user.updateSettings'],
	},
	'user.getSettingByKey': {
		input: JotformEndpointInputSchemas['user.getSettingByKey'],
		output: JotformEndpointOutputSchemas['user.getSettingByKey'],
	},
	'user.getSubusers': {
		input: JotformEndpointInputSchemas['user.getSubusers'],
		output: JotformEndpointOutputSchemas['user.getSubusers'],
	},
	'user.getUsage': {
		input: JotformEndpointInputSchemas['user.getUsage'],
		output: JotformEndpointOutputSchemas['user.getUsage'],
	},
	'user.getReports': {
		input: JotformEndpointInputSchemas['user.getReports'],
		output: JotformEndpointOutputSchemas['user.getReports'],
	},
	'user.getInvoices': {
		input: JotformEndpointInputSchemas['user.getInvoices'],
		output: JotformEndpointOutputSchemas['user.getInvoices'],
	},
	'user.getLabels': {
		input: JotformEndpointInputSchemas['user.getLabels'],
		output: JotformEndpointOutputSchemas['user.getLabels'],
	},
	'forms.get': {
		input: JotformEndpointInputSchemas['forms.get'],
		output: JotformEndpointOutputSchemas['forms.get'],
	},
	'forms.create': {
		input: JotformEndpointInputSchemas['forms.create'],
		output: JotformEndpointOutputSchemas['forms.create'],
	},
	'forms.createForms': {
		input: JotformEndpointInputSchemas['forms.createForms'],
		output: JotformEndpointOutputSchemas['forms.createForms'],
	},
	'forms.delete': {
		input: JotformEndpointInputSchemas['forms.delete'],
		output: JotformEndpointOutputSchemas['forms.delete'],
	},
	'forms.clone': {
		input: JotformEndpointInputSchemas['forms.clone'],
		output: JotformEndpointOutputSchemas['forms.clone'],
	},
	'forms.getFiles': {
		input: JotformEndpointInputSchemas['forms.getFiles'],
		output: JotformEndpointOutputSchemas['forms.getFiles'],
	},
	'forms.getQuestions': {
		input: JotformEndpointInputSchemas['forms.getQuestions'],
		output: JotformEndpointOutputSchemas['forms.getQuestions'],
	},
	'forms.getQuestion': {
		input: JotformEndpointInputSchemas['forms.getQuestion'],
		output: JotformEndpointOutputSchemas['forms.getQuestion'],
	},
	'forms.createQuestion': {
		input: JotformEndpointInputSchemas['forms.createQuestion'],
		output: JotformEndpointOutputSchemas['forms.createQuestion'],
	},
	'forms.createQuestions': {
		input: JotformEndpointInputSchemas['forms.createQuestions'],
		output: JotformEndpointOutputSchemas['forms.createQuestions'],
	},
	'forms.updateQuestion': {
		input: JotformEndpointInputSchemas['forms.updateQuestion'],
		output: JotformEndpointOutputSchemas['forms.updateQuestion'],
	},
	'forms.deleteQuestion': {
		input: JotformEndpointInputSchemas['forms.deleteQuestion'],
		output: JotformEndpointOutputSchemas['forms.deleteQuestion'],
	},
	'forms.getProperties': {
		input: JotformEndpointInputSchemas['forms.getProperties'],
		output: JotformEndpointOutputSchemas['forms.getProperties'],
	},
	'forms.getProperty': {
		input: JotformEndpointInputSchemas['forms.getProperty'],
		output: JotformEndpointOutputSchemas['forms.getProperty'],
	},
	'forms.setProperties': {
		input: JotformEndpointInputSchemas['forms.setProperties'],
		output: JotformEndpointOutputSchemas['forms.setProperties'],
	},
	'forms.getReports': {
		input: JotformEndpointInputSchemas['forms.getReports'],
		output: JotformEndpointOutputSchemas['forms.getReports'],
	},
	'forms.createReport': {
		input: JotformEndpointInputSchemas['forms.createReport'],
		output: JotformEndpointOutputSchemas['forms.createReport'],
	},
	'forms.getSubmissions': {
		input: JotformEndpointInputSchemas['forms.getSubmissions'],
		output: JotformEndpointOutputSchemas['forms.getSubmissions'],
	},
	'forms.createSubmission': {
		input: JotformEndpointInputSchemas['forms.createSubmission'],
		output: JotformEndpointOutputSchemas['forms.createSubmission'],
	},
	'forms.createSubmissions': {
		input: JotformEndpointInputSchemas['forms.createSubmissions'],
		output: JotformEndpointOutputSchemas['forms.createSubmissions'],
	},
	'submissions.get': {
		input: JotformEndpointInputSchemas['submissions.get'],
		output: JotformEndpointOutputSchemas['submissions.get'],
	},
	'submissions.update': {
		input: JotformEndpointInputSchemas['submissions.update'],
		output: JotformEndpointOutputSchemas['submissions.update'],
	},
	'submissions.delete': {
		input: JotformEndpointInputSchemas['submissions.delete'],
		output: JotformEndpointOutputSchemas['submissions.delete'],
	},
	'reports.get': {
		input: JotformEndpointInputSchemas['reports.get'],
		output: JotformEndpointOutputSchemas['reports.get'],
	},
	'reports.delete': {
		input: JotformEndpointInputSchemas['reports.delete'],
		output: JotformEndpointOutputSchemas['reports.delete'],
	},
	'folders.get': {
		input: JotformEndpointInputSchemas['folders.get'],
		output: JotformEndpointOutputSchemas['folders.get'],
	},
	'folders.create': {
		input: JotformEndpointInputSchemas['folders.create'],
		output: JotformEndpointOutputSchemas['folders.create'],
	},
	'folders.update': {
		input: JotformEndpointInputSchemas['folders.update'],
		output: JotformEndpointOutputSchemas['folders.update'],
	},
	'folders.delete': {
		input: JotformEndpointInputSchemas['folders.delete'],
		output: JotformEndpointOutputSchemas['folders.delete'],
	},
	'labels.get': {
		input: JotformEndpointInputSchemas['labels.get'],
		output: JotformEndpointOutputSchemas['labels.get'],
	},
	'labels.create': {
		input: JotformEndpointInputSchemas['labels.create'],
		output: JotformEndpointOutputSchemas['labels.create'],
	},
	'labels.update': {
		input: JotformEndpointInputSchemas['labels.update'],
		output: JotformEndpointOutputSchemas['labels.update'],
	},
	'labels.delete': {
		input: JotformEndpointInputSchemas['labels.delete'],
		output: JotformEndpointOutputSchemas['labels.delete'],
	},
	'labels.getResources': {
		input: JotformEndpointInputSchemas['labels.getResources'],
		output: JotformEndpointOutputSchemas['labels.getResources'],
	},
	'labels.addResources': {
		input: JotformEndpointInputSchemas['labels.addResources'],
		output: JotformEndpointOutputSchemas['labels.addResources'],
	},
	'labels.removeResources': {
		input: JotformEndpointInputSchemas['labels.removeResources'],
		output: JotformEndpointOutputSchemas['labels.removeResources'],
	},
	'system.getPlan': {
		input: JotformEndpointInputSchemas['system.getPlan'],
		output: JotformEndpointOutputSchemas['system.getPlan'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof jotformEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const jotformEndpointMeta = {
	'user.get': {
		riskLevel: 'read',
		description:
			'Get user account details, including account type, email, website and usage link',
	},
	'user.getForms': {
		riskLevel: 'read',
		description:
			'Get list of forms for this account with pagination, ordering and filtering',
	},
	'user.getSubmissions': {
		riskLevel: 'read',
		description: 'Get list of submissions for all forms in this account',
	},
	'user.getFolders': {
		riskLevel: 'read',
		description: 'Get folders structure and layout for this account',
	},
	'user.getHistory': {
		riskLevel: 'read',
		description: 'Get user activity log history records',
	},
	'user.getSettings': {
		riskLevel: 'read',
		description:
			'Get user account settings including company, timezone and industry',
	},
	'user.updateSettings': {
		riskLevel: 'write',
		description:
			'Update user account settings including name, email, website and timezone',
	},
	'user.getSettingByKey': {
		riskLevel: 'read',
		description: 'Get a specific user setting by key name',
	},
	'user.getSubusers': {
		riskLevel: 'read',
		description: 'Get sub-user accounts list and permissions for this account',
	},
	'user.getUsage': {
		riskLevel: 'read',
		description:
			'Get monthly user usage statistics such as submissions, payments and views',
	},
	'user.getReports': {
		riskLevel: 'read',
		description:
			'Get list of reports generated across all forms in this account',
	},
	'user.getInvoices': {
		riskLevel: 'read',
		description: 'Get list of invoices and payment receipts for this account',
	},
	'user.getLabels': {
		riskLevel: 'read',
		description:
			'Get all labels created by the user for organizing form assets',
	},
	'forms.get': {
		riskLevel: 'read',
		description: 'Get basic information and status for a specific form',
	},
	'forms.create': {
		riskLevel: 'write',
		description:
			'Create a new form with questions, properties and email settings',
	},
	'forms.createForms': {
		riskLevel: 'write',
		description:
			'Create new forms using a complete JSON form content structure',
	},
	'forms.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific form by ID from the account',
	},
	'forms.clone': {
		riskLevel: 'write',
		description:
			'Clone an existing form by duplicating its questions and settings',
	},
	'forms.getFiles': {
		riskLevel: 'read',
		description:
			'Get list of all uploaded files across submissions for a specific form',
	},
	'forms.getQuestions': {
		riskLevel: 'read',
		description:
			'Get full list of questions and form fields for a specific form',
	},
	'forms.getQuestion': {
		riskLevel: 'read',
		description:
			'Get configuration and properties for a specific question on a form',
	},
	'forms.createQuestion': {
		riskLevel: 'write',
		description: 'Add a new question field to a specific form',
	},
	'forms.createQuestions': {
		riskLevel: 'write',
		description: 'Add multiple questions in batch to a specific form',
	},
	'forms.updateQuestion': {
		riskLevel: 'write',
		description: 'Update properties or label of a specific question on a form',
	},
	'forms.deleteQuestion': {
		riskLevel: 'destructive',
		description: 'Delete a specific question field from a form',
	},
	'forms.getProperties': {
		riskLevel: 'read',
		description: 'Get all form properties such as width, height and redirects',
	},
	'forms.getProperty': {
		riskLevel: 'read',
		description: 'Get a specific form property by its configuration key',
	},
	'forms.setProperties': {
		riskLevel: 'write',
		description: 'Update or set configuration properties on a specific form',
	},
	'forms.getReports': {
		riskLevel: 'read',
		description: 'Get all reports created for a specific form',
	},
	'forms.createReport': {
		riskLevel: 'write',
		description:
			'Create a new report (grid, excel, csv, etc.) for a specific form',
	},
	'forms.getSubmissions': {
		riskLevel: 'read',
		description:
			'Get submissions list for a specific form with pagination and filtering',
	},
	'forms.createSubmission': {
		riskLevel: 'destructive',
		description:
			'Submit a new entry with field answers to a specific form. Jotform runs the form notifications and autoresponder emails as for a real submission',
	},
	'forms.createSubmissions': {
		riskLevel: 'destructive',
		description:
			'Add multiple submission entries in batch to a specific form. Each one can trigger the form notification and autoresponder emails',
	},
	'submissions.get': {
		riskLevel: 'read',
		description:
			'Get complete submission data and answer records for a specific submission',
	},
	'submissions.update': {
		riskLevel: 'write',
		description: 'Edit answers or read/flag status of an existing submission',
	},
	'submissions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific submission record from a form',
	},
	'reports.get': {
		riskLevel: 'read',
		description: 'Get configuration and URL for a specific report by report ID',
	},
	'reports.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific report by report ID',
	},
	'folders.get': {
		riskLevel: 'read',
		description: 'Get details, subfolders and form IDs for a specific folder',
	},
	'folders.create': {
		riskLevel: 'write',
		description: 'Create a new folder to organize forms',
	},
	'folders.update': {
		riskLevel: 'write',
		description:
			'Update folder properties such as name, color or contained forms',
	},
	'folders.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific folder by ID',
	},
	'labels.get': {
		riskLevel: 'read',
		description: 'Get details and metadata of a specific label',
	},
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a new label for organizing forms and assets',
	},
	'labels.update': {
		riskLevel: 'write',
		description: 'Update name, color or parent of an existing label',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a label and all its sublabels',
	},
	'labels.getResources': {
		riskLevel: 'read',
		description: 'Get list of assets (forms) grouped under a specific label',
	},
	'labels.addResources': {
		riskLevel: 'write',
		description: 'Add form resources to a specific label',
	},
	'labels.removeResources': {
		riskLevel: 'write',
		description: 'Remove form resources from a specific label',
	},
	'system.getPlan': {
		riskLevel: 'read',
		description: 'Get limits and details for a specific Jotform system plan',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof jotformEndpointsNested>;

export const jotformAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export const PUBLIC_ENDPOINTS = new Set<string>(['system.getPlan']);

export type BaseJotformPlugin<T extends JotformPluginOptions> = CorsairPlugin<
	'jotform',
	typeof JotformSchema,
	typeof jotformEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalJotformPlugin = BaseJotformPlugin<JotformPluginOptions>;

export type ExternalJotformPlugin<T extends JotformPluginOptions> =
	BaseJotformPlugin<T>;

export function jotform<const T extends JotformPluginOptions>(
	incomingOptions: JotformPluginOptions & T = {} as JotformPluginOptions & T,
): ExternalJotformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'jotform',
		authConfig: jotformAuthConfig,
		schema: JotformSchema,
		options,
		hooks: options.hooks,
		endpoints: jotformEndpointsNested,
		webhooks: {},
		endpointMeta: jotformEndpointMeta,
		endpointSchemas: jotformEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: JotformKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (PUBLIC_ENDPOINTS.has(ctx.meteredOperationId ?? '')) return '';
			if (!ctx.keys) throw new AuthMissingError('jotform', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('jotform', 'api_key');
			return apiKey;
		},
	} satisfies InternalJotformPlugin;
}

export type {
	JotformEndpointInputs,
	JotformEndpointOutputs,
} from './endpoints/types';
