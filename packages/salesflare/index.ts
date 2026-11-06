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
	addAccountContacts,
	addAccountUsers,
	createAccount,
	createContact,
	createCustomFieldSub,
	createMeeting,
	createOpportunity,
	createTag,
	createTask,
	createWorkflow,
	deleteAccount,
	deleteContact,
	deleteCustomField,
	deleteMeeting,
	deleteOpportunity,
	deleteTag,
	deleteTask,
	listAccountFeed,
	listAccountMessages,
	listAccounts,
	listContacts,
	listCustomFieldOptions,
	listCustomFields,
	listCustomFieldTypes,
	listOpportunities,
	listTags,
	listTagUsage,
	listTasks,
	listWorkflows,
	retrieveAccount,
	retrieveContact,
	retrieveCustomField,
	retrieveMeeting,
	retrieveOpportunity,
	retrieveTag,
	retrieveWorkflow,
	updateAccount,
	updateAccountContacts,
	updateAccountUsers,
	updateContact,
	updateCustomField,
	updateMeeting,
	updateOpportunity,
	updateTag,
	updateTask,
	updateWorkflow,
	updateWorkflowAudience,
} from './endpoints';
import type {
	SalesflareEndpointInputs,
	SalesflareEndpointOutputs,
} from './endpoints/types';
import {
	SalesflareEndpointInputSchemas,
	SalesflareEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SalesflareSchema } from './schema';

export type SalesflarePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSalesflarePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof salesflareEndpointsNested>;
};

export type SalesflareContext = CorsairPluginContext<
	typeof SalesflareSchema,
	SalesflarePluginOptions
>;

export type SalesflareKeyBuilderContext =
	KeyBuilderContext<SalesflarePluginOptions>;

export type SalesflareBoundEndpoints = BindEndpoints<
	typeof salesflareEndpointsNested
>;

type SalesflareEndpoint<K extends keyof SalesflareEndpointOutputs> =
	CorsairEndpoint<
		SalesflareContext,
		SalesflareEndpointInputs[K],
		SalesflareEndpointOutputs[K]
	>;

export type SalesflareEndpoints = {
	listAccounts: SalesflareEndpoint<'listAccounts'>;
	createAccount: SalesflareEndpoint<'createAccount'>;
	listContacts: SalesflareEndpoint<'listContacts'>;
	createContact: SalesflareEndpoint<'createContact'>;
	listOpportunities: SalesflareEndpoint<'listOpportunities'>;
	createOpportunity: SalesflareEndpoint<'createOpportunity'>;
	listTags: SalesflareEndpoint<'listTags'>;
	createTag: SalesflareEndpoint<'createTag'>;
	listTasks: SalesflareEndpoint<'listTasks'>;
	createTask: SalesflareEndpoint<'createTask'>;
	listWorkflows: SalesflareEndpoint<'listWorkflows'>;
	createWorkflow: SalesflareEndpoint<'createWorkflow'>;
	retrieveAccount: SalesflareEndpoint<'retrieveAccount'>;
	updateAccount: SalesflareEndpoint<'updateAccount'>;
	deleteAccount: SalesflareEndpoint<'deleteAccount'>;
	retrieveContact: SalesflareEndpoint<'retrieveContact'>;
	updateContact: SalesflareEndpoint<'updateContact'>;
	deleteContact: SalesflareEndpoint<'deleteContact'>;
	listCustomFieldTypes: SalesflareEndpoint<'listCustomFieldTypes'>;
	listCustomFields: SalesflareEndpoint<'listCustomFields'>;
	createCustomFieldSub: SalesflareEndpoint<'createCustomFieldSub'>;
	retrieveMeeting: SalesflareEndpoint<'retrieveMeeting'>;
	updateMeeting: SalesflareEndpoint<'updateMeeting'>;
	deleteMeeting: SalesflareEndpoint<'deleteMeeting'>;
	retrieveOpportunity: SalesflareEndpoint<'retrieveOpportunity'>;
	updateOpportunity: SalesflareEndpoint<'updateOpportunity'>;
	deleteOpportunity: SalesflareEndpoint<'deleteOpportunity'>;
	retrieveTag: SalesflareEndpoint<'retrieveTag'>;
	updateTag: SalesflareEndpoint<'updateTag'>;
	deleteTag: SalesflareEndpoint<'deleteTag'>;
	retrieveWorkflow: SalesflareEndpoint<'retrieveWorkflow'>;
	updateWorkflow: SalesflareEndpoint<'updateWorkflow'>;
	listAccountMessages: SalesflareEndpoint<'listAccountMessages'>;
	listAccountFeed: SalesflareEndpoint<'listAccountFeed'>;
	retrieveCustomField: SalesflareEndpoint<'retrieveCustomField'>;
	updateCustomField: SalesflareEndpoint<'updateCustomField'>;
	deleteCustomField: SalesflareEndpoint<'deleteCustomField'>;
	listTagUsage: SalesflareEndpoint<'listTagUsage'>;
	listCustomFieldOptions: SalesflareEndpoint<'listCustomFieldOptions'>;
	createMeeting: SalesflareEndpoint<'createMeeting'>;
	addAccountUsers: SalesflareEndpoint<'addAccountUsers'>;
	updateAccountUsers: SalesflareEndpoint<'updateAccountUsers'>;
	addAccountContacts: SalesflareEndpoint<'addAccountContacts'>;
	updateAccountContacts: SalesflareEndpoint<'updateAccountContacts'>;
	updateTask: SalesflareEndpoint<'updateTask'>;
	deleteTask: SalesflareEndpoint<'deleteTask'>;
	updateWorkflowAudience: SalesflareEndpoint<'updateWorkflowAudience'>;
};

const salesflareEndpointsNested = {
	accounts: {
		listAccounts: listAccounts,
		createAccount: createAccount,
		retrieveAccount: retrieveAccount,
		updateAccount: updateAccount,
		deleteAccount: deleteAccount,
		listAccountMessages: listAccountMessages,
		listAccountFeed: listAccountFeed,
		addAccountUsers: addAccountUsers,
		updateAccountUsers: updateAccountUsers,
		addAccountContacts: addAccountContacts,
		updateAccountContacts: updateAccountContacts,
	},
	contacts: {
		listContacts: listContacts,
		createContact: createContact,
		retrieveContact: retrieveContact,
		updateContact: updateContact,
		deleteContact: deleteContact,
	},
	opportunities: {
		listOpportunities: listOpportunities,
		createOpportunity: createOpportunity,
		retrieveOpportunity: retrieveOpportunity,
		updateOpportunity: updateOpportunity,
		deleteOpportunity: deleteOpportunity,
	},
	tags: {
		listTags: listTags,
		createTag: createTag,
		retrieveTag: retrieveTag,
		updateTag: updateTag,
		deleteTag: deleteTag,
		listTagUsage: listTagUsage,
	},
	tasks: {
		listTasks: listTasks,
		createTask: createTask,
		updateTask: updateTask,
		deleteTask: deleteTask,
	},
	workflows: {
		listWorkflows: listWorkflows,
		createWorkflow: createWorkflow,
		retrieveWorkflow: retrieveWorkflow,
		updateWorkflow: updateWorkflow,
		updateWorkflowAudience: updateWorkflowAudience,
	},
	customfields: {
		listCustomFieldTypes: listCustomFieldTypes,
		listCustomFields: listCustomFields,
		createCustomFieldSub: createCustomFieldSub,
		retrieveCustomField: retrieveCustomField,
		updateCustomField: updateCustomField,
		deleteCustomField: deleteCustomField,
		listCustomFieldOptions: listCustomFieldOptions,
	},
	meetings: {
		retrieveMeeting: retrieveMeeting,
		updateMeeting: updateMeeting,
		deleteMeeting: deleteMeeting,
		createMeeting: createMeeting,
	},
} as const;

export const salesflareEndpointSchemas = {
	'accounts.listAccounts': {
		input: SalesflareEndpointInputSchemas.listAccounts,
		output: SalesflareEndpointOutputSchemas.listAccounts,
	},
	'accounts.createAccount': {
		input: SalesflareEndpointInputSchemas.createAccount,
		output: SalesflareEndpointOutputSchemas.createAccount,
	},
	'contacts.listContacts': {
		input: SalesflareEndpointInputSchemas.listContacts,
		output: SalesflareEndpointOutputSchemas.listContacts,
	},
	'contacts.createContact': {
		input: SalesflareEndpointInputSchemas.createContact,
		output: SalesflareEndpointOutputSchemas.createContact,
	},
	'opportunities.listOpportunities': {
		input: SalesflareEndpointInputSchemas.listOpportunities,
		output: SalesflareEndpointOutputSchemas.listOpportunities,
	},
	'opportunities.createOpportunity': {
		input: SalesflareEndpointInputSchemas.createOpportunity,
		output: SalesflareEndpointOutputSchemas.createOpportunity,
	},
	'tags.listTags': {
		input: SalesflareEndpointInputSchemas.listTags,
		output: SalesflareEndpointOutputSchemas.listTags,
	},
	'tags.createTag': {
		input: SalesflareEndpointInputSchemas.createTag,
		output: SalesflareEndpointOutputSchemas.createTag,
	},
	'tasks.listTasks': {
		input: SalesflareEndpointInputSchemas.listTasks,
		output: SalesflareEndpointOutputSchemas.listTasks,
	},
	'tasks.createTask': {
		input: SalesflareEndpointInputSchemas.createTask,
		output: SalesflareEndpointOutputSchemas.createTask,
	},
	'workflows.listWorkflows': {
		input: SalesflareEndpointInputSchemas.listWorkflows,
		output: SalesflareEndpointOutputSchemas.listWorkflows,
	},
	'workflows.createWorkflow': {
		input: SalesflareEndpointInputSchemas.createWorkflow,
		output: SalesflareEndpointOutputSchemas.createWorkflow,
	},
	'accounts.retrieveAccount': {
		input: SalesflareEndpointInputSchemas.retrieveAccount,
		output: SalesflareEndpointOutputSchemas.retrieveAccount,
	},
	'accounts.updateAccount': {
		input: SalesflareEndpointInputSchemas.updateAccount,
		output: SalesflareEndpointOutputSchemas.updateAccount,
	},
	'accounts.deleteAccount': {
		input: SalesflareEndpointInputSchemas.deleteAccount,
		output: SalesflareEndpointOutputSchemas.deleteAccount,
	},
	'contacts.retrieveContact': {
		input: SalesflareEndpointInputSchemas.retrieveContact,
		output: SalesflareEndpointOutputSchemas.retrieveContact,
	},
	'contacts.updateContact': {
		input: SalesflareEndpointInputSchemas.updateContact,
		output: SalesflareEndpointOutputSchemas.updateContact,
	},
	'contacts.deleteContact': {
		input: SalesflareEndpointInputSchemas.deleteContact,
		output: SalesflareEndpointOutputSchemas.deleteContact,
	},
	'customfields.listCustomFieldTypes': {
		input: SalesflareEndpointInputSchemas.listCustomFieldTypes,
		output: SalesflareEndpointOutputSchemas.listCustomFieldTypes,
	},
	'customfields.listCustomFields': {
		input: SalesflareEndpointInputSchemas.listCustomFields,
		output: SalesflareEndpointOutputSchemas.listCustomFields,
	},
	'customfields.createCustomFieldSub': {
		input: SalesflareEndpointInputSchemas.createCustomFieldSub,
		output: SalesflareEndpointOutputSchemas.createCustomFieldSub,
	},
	'meetings.retrieveMeeting': {
		input: SalesflareEndpointInputSchemas.retrieveMeeting,
		output: SalesflareEndpointOutputSchemas.retrieveMeeting,
	},
	'meetings.updateMeeting': {
		input: SalesflareEndpointInputSchemas.updateMeeting,
		output: SalesflareEndpointOutputSchemas.updateMeeting,
	},
	'meetings.deleteMeeting': {
		input: SalesflareEndpointInputSchemas.deleteMeeting,
		output: SalesflareEndpointOutputSchemas.deleteMeeting,
	},
	'opportunities.retrieveOpportunity': {
		input: SalesflareEndpointInputSchemas.retrieveOpportunity,
		output: SalesflareEndpointOutputSchemas.retrieveOpportunity,
	},
	'opportunities.updateOpportunity': {
		input: SalesflareEndpointInputSchemas.updateOpportunity,
		output: SalesflareEndpointOutputSchemas.updateOpportunity,
	},
	'opportunities.deleteOpportunity': {
		input: SalesflareEndpointInputSchemas.deleteOpportunity,
		output: SalesflareEndpointOutputSchemas.deleteOpportunity,
	},
	'tags.retrieveTag': {
		input: SalesflareEndpointInputSchemas.retrieveTag,
		output: SalesflareEndpointOutputSchemas.retrieveTag,
	},
	'tags.updateTag': {
		input: SalesflareEndpointInputSchemas.updateTag,
		output: SalesflareEndpointOutputSchemas.updateTag,
	},
	'tags.deleteTag': {
		input: SalesflareEndpointInputSchemas.deleteTag,
		output: SalesflareEndpointOutputSchemas.deleteTag,
	},
	'workflows.retrieveWorkflow': {
		input: SalesflareEndpointInputSchemas.retrieveWorkflow,
		output: SalesflareEndpointOutputSchemas.retrieveWorkflow,
	},
	'workflows.updateWorkflow': {
		input: SalesflareEndpointInputSchemas.updateWorkflow,
		output: SalesflareEndpointOutputSchemas.updateWorkflow,
	},
	'accounts.listAccountMessages': {
		input: SalesflareEndpointInputSchemas.listAccountMessages,
		output: SalesflareEndpointOutputSchemas.listAccountMessages,
	},
	'accounts.listAccountFeed': {
		input: SalesflareEndpointInputSchemas.listAccountFeed,
		output: SalesflareEndpointOutputSchemas.listAccountFeed,
	},
	'customfields.retrieveCustomField': {
		input: SalesflareEndpointInputSchemas.retrieveCustomField,
		output: SalesflareEndpointOutputSchemas.retrieveCustomField,
	},
	'customfields.updateCustomField': {
		input: SalesflareEndpointInputSchemas.updateCustomField,
		output: SalesflareEndpointOutputSchemas.updateCustomField,
	},
	'customfields.deleteCustomField': {
		input: SalesflareEndpointInputSchemas.deleteCustomField,
		output: SalesflareEndpointOutputSchemas.deleteCustomField,
	},
	'tags.listTagUsage': {
		input: SalesflareEndpointInputSchemas.listTagUsage,
		output: SalesflareEndpointOutputSchemas.listTagUsage,
	},
	'customfields.listCustomFieldOptions': {
		input: SalesflareEndpointInputSchemas.listCustomFieldOptions,
		output: SalesflareEndpointOutputSchemas.listCustomFieldOptions,
	},
	'meetings.createMeeting': {
		input: SalesflareEndpointInputSchemas.createMeeting,
		output: SalesflareEndpointOutputSchemas.createMeeting,
	},
	'accounts.addAccountUsers': {
		input: SalesflareEndpointInputSchemas.addAccountUsers,
		output: SalesflareEndpointOutputSchemas.addAccountUsers,
	},
	'accounts.updateAccountUsers': {
		input: SalesflareEndpointInputSchemas.updateAccountUsers,
		output: SalesflareEndpointOutputSchemas.updateAccountUsers,
	},
	'accounts.addAccountContacts': {
		input: SalesflareEndpointInputSchemas.addAccountContacts,
		output: SalesflareEndpointOutputSchemas.addAccountContacts,
	},
	'accounts.updateAccountContacts': {
		input: SalesflareEndpointInputSchemas.updateAccountContacts,
		output: SalesflareEndpointOutputSchemas.updateAccountContacts,
	},
	'tasks.updateTask': {
		input: SalesflareEndpointInputSchemas.updateTask,
		output: SalesflareEndpointOutputSchemas.updateTask,
	},
	'tasks.deleteTask': {
		input: SalesflareEndpointInputSchemas.deleteTask,
		output: SalesflareEndpointOutputSchemas.deleteTask,
	},
	'workflows.updateWorkflowAudience': {
		input: SalesflareEndpointInputSchemas.updateWorkflowAudience,
		output: SalesflareEndpointOutputSchemas.updateWorkflowAudience,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof salesflareEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const salesflareEndpointMeta = {
	'accounts.listAccounts': {
		riskLevel: 'read',
		description: 'List Accounts',
	},
	'accounts.createAccount': {
		riskLevel: 'write',
		description: 'Create a new account',
	},
	'contacts.listContacts': {
		riskLevel: 'read',
		description: 'List Contacts',
	},
	'contacts.createContact': {
		riskLevel: 'write',
		description: 'Create a new contact',
	},
	'opportunities.listOpportunities': {
		riskLevel: 'read',
		description: 'List Opportunities',
	},
	'opportunities.createOpportunity': {
		riskLevel: 'write',
		description: 'Create a new opportunity',
	},
	'tags.listTags': {
		riskLevel: 'read',
		description: 'List Tags',
	},
	'tags.createTag': {
		riskLevel: 'write',
		description: 'Create a new tag',
	},
	'tasks.listTasks': {
		riskLevel: 'read',
		description: 'List Tasks',
	},
	'tasks.createTask': {
		riskLevel: 'write',
		description: 'Create a new task',
	},
	'workflows.listWorkflows': {
		riskLevel: 'read',
		description: 'List Workflows',
	},
	'workflows.createWorkflow': {
		riskLevel: 'write',
		description: 'Create a new workflow',
	},
	'accounts.retrieveAccount': {
		riskLevel: 'read',
		description: 'Retrieve a single account by ID',
	},
	'accounts.updateAccount': {
		riskLevel: 'write',
		description: 'Update a account',
	},
	'accounts.deleteAccount': {
		riskLevel: 'destructive',
		description: 'Delete a account',
	},
	'contacts.retrieveContact': {
		riskLevel: 'read',
		description: 'Retrieve a single contact by ID',
	},
	'contacts.updateContact': {
		riskLevel: 'write',
		description: 'Update a contact',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		description: 'Delete a contact',
	},
	'customfields.listCustomFieldTypes': {
		riskLevel: 'read',
		description: 'List the custom field types supported by Salesflare',
	},
	'customfields.listCustomFields': {
		riskLevel: 'read',
		description: 'List the custom fields of an item class',
	},
	'customfields.createCustomFieldSub': {
		riskLevel: 'write',
		description: 'Create a new customField sub-resource',
	},
	'meetings.retrieveMeeting': {
		riskLevel: 'read',
		description: 'Retrieve a single meeting by ID',
	},
	'meetings.updateMeeting': {
		riskLevel: 'write',
		description: 'Update a meeting',
	},
	'meetings.deleteMeeting': {
		riskLevel: 'destructive',
		description: 'Delete a meeting',
	},
	'opportunities.retrieveOpportunity': {
		riskLevel: 'read',
		description: 'Retrieve a single opportunity by ID',
	},
	'opportunities.updateOpportunity': {
		riskLevel: 'write',
		description: 'Update a opportunity',
	},
	'opportunities.deleteOpportunity': {
		riskLevel: 'destructive',
		description: 'Delete a opportunity',
	},
	'tags.retrieveTag': {
		riskLevel: 'read',
		description: 'Retrieve a single tag by ID',
	},
	'tags.updateTag': {
		riskLevel: 'write',
		description: 'Update a tag',
	},
	'tags.deleteTag': {
		riskLevel: 'destructive',
		description: 'Delete a tag',
	},
	'workflows.retrieveWorkflow': {
		riskLevel: 'read',
		description: 'Retrieve a single workflow by ID',
	},
	'workflows.updateWorkflow': {
		riskLevel: 'write',
		description: 'Update a workflow',
	},
	'accounts.listAccountMessages': {
		riskLevel: 'read',
		description: 'List messages on an account',
	},
	'accounts.listAccountFeed': {
		riskLevel: 'read',
		description: 'List the activity feed of an account',
	},
	'customfields.retrieveCustomField': {
		riskLevel: 'read',
		description: 'Retrieve a single customField by ID',
	},
	'customfields.updateCustomField': {
		riskLevel: 'write',
		description: 'Update a customField',
	},
	'customfields.deleteCustomField': {
		riskLevel: 'destructive',
		description: 'Delete a customField',
	},
	'tags.listTagUsage': {
		riskLevel: 'read',
		description: 'List the usage statistics of a tag',
	},
	'customfields.listCustomFieldOptions': {
		riskLevel: 'read',
		description: 'List the options of a custom field',
	},
	'meetings.createMeeting': {
		riskLevel: 'write',
		description: 'Create a new meeting',
	},
	'accounts.addAccountUsers': {
		riskLevel: 'write',
		description: 'Add users to an account',
	},
	'accounts.updateAccountUsers': {
		riskLevel: 'write',
		description: 'Update the users assigned to an account',
	},
	'accounts.addAccountContacts': {
		riskLevel: 'write',
		description: 'Link contacts to an account',
	},
	'accounts.updateAccountContacts': {
		riskLevel: 'write',
		description: 'Update the contact links of an account',
	},
	'tasks.updateTask': {
		riskLevel: 'write',
		description: 'Update a task',
	},
	'tasks.deleteTask': {
		riskLevel: 'destructive',
		description: 'Delete a task',
	},
	'workflows.updateWorkflowAudience': {
		riskLevel: 'write',
		description: 'Update the audience record of a workflow',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof salesflareEndpointsNested
>;

export const salesflareAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSalesflarePlugin<T extends SalesflarePluginOptions> =
	CorsairPlugin<
		'salesflare',
		typeof SalesflareSchema,
		typeof salesflareEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalSalesflarePlugin =
	BaseSalesflarePlugin<SalesflarePluginOptions>;

export type ExternalSalesflarePlugin<T extends SalesflarePluginOptions> =
	BaseSalesflarePlugin<T>;

// Binds every Salesflare endpoint to its declared input and output schemas.
// Calls use this validated tree at runtime; the schemas registry stays as
// introspection metadata.
function withSalesflareSchemas<T extends Record<string, unknown>>(
	tree: T,
	prefix = '',
): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				salesflareEndpointSchemas[
					operation as keyof typeof salesflareEndpointSchemas
				];
			if (!schema) {
				throw new Error(`Missing Salesflare endpoint schema for ${operation}`);
			}
			const endpoint = value as (
				ctx: unknown,
				input: unknown,
			) => Promise<unknown>;
			const validated = async (ctx: unknown, input: unknown) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [
				key,
				withSalesflareSchemas(value as Record<string, unknown>, operation),
			];
		}
		return [key, value];
	});
	return Object.fromEntries(validatedEntries) as T;
}

const validatedSalesflareEndpointsNested = withSalesflareSchemas(
	salesflareEndpointsNested,
);

export function salesflare<const T extends SalesflarePluginOptions>(
	incomingOptions: SalesflarePluginOptions & T = {} as SalesflarePluginOptions &
		T,
): ExternalSalesflarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'salesflare',
		authConfig: salesflareAuthConfig,
		schema: SalesflareSchema,
		options,
		hooks: options.hooks,
		endpoints: validatedSalesflareEndpointsNested,
		webhooks: {},
		endpointMeta: salesflareEndpointMeta,
		endpointSchemas: salesflareEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SalesflareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}
			throw new AuthMissingError('salesflare', 'api_key');
		},
	} satisfies InternalSalesflarePlugin;
}

export type {
	SalesflareEndpointInputs,
	SalesflareEndpointOutputs,
} from './endpoints/types';
