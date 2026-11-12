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
import * as Handlers from './endpoints/handlers';
import type {
	RocketlaneEndpointInputs,
	RocketlaneEndpointOutputs,
} from './endpoints/types';
import {
	RocketlaneEndpointInputSchemas,
	RocketlaneEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RocketlaneSchema } from './schema';

export type RocketlanePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRocketlanePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rocketlaneEndpointsNested>;
};
export type RocketlaneContext = CorsairPluginContext<
	typeof RocketlaneSchema,
	RocketlanePluginOptions
>;
export type RocketlaneKeyBuilderContext =
	KeyBuilderContext<RocketlanePluginOptions>;
type RocketlaneEndpoint<K extends keyof RocketlaneEndpointOutputs> =
	CorsairEndpoint<
		RocketlaneContext,
		RocketlaneEndpointInputs[K],
		RocketlaneEndpointOutputs[K]
	>;
export type RocketlaneEndpoints = {
	getInvoicePayments: RocketlaneEndpoint<'getInvoicePayments'>;
	getInvoiceLineItems: RocketlaneEndpoint<'getInvoiceLineItems'>;
	getInvoice: RocketlaneEndpoint<'getInvoice'>;
	searchInvoices: RocketlaneEndpoint<'searchInvoices'>;
	getCompany: RocketlaneEndpoint<'getCompany'>;
	updateCompany: RocketlaneEndpoint<'updateCompany'>;
	deleteCompany: RocketlaneEndpoint<'deleteCompany'>;
	createCompanyNote: RocketlaneEndpoint<'createCompanyNote'>;
	getAllCompanies: RocketlaneEndpoint<'getAllCompanies'>;
	createCompany: RocketlaneEndpoint<'createCompany'>;
	getAllResourceAllocations: RocketlaneEndpoint<'getAllResourceAllocations'>;
	getAllTimeoffs: RocketlaneEndpoint<'getAllTimeoffs'>;
	createTimeoff: RocketlaneEndpoint<'createTimeoff'>;
	getTimeoff: RocketlaneEndpoint<'getTimeoff'>;
	deleteTimeoff: RocketlaneEndpoint<'deleteTimeoff'>;
	getField: RocketlaneEndpoint<'getField'>;
	updateField: RocketlaneEndpoint<'updateField'>;
	deleteField: RocketlaneEndpoint<'deleteField'>;
	updateFieldOption: RocketlaneEndpoint<'updateFieldOption'>;
	addFieldOption: RocketlaneEndpoint<'addFieldOption'>;
	getAllFields: RocketlaneEndpoint<'getAllFields'>;
	createField: RocketlaneEndpoint<'createField'>;
	getTimeEntry: RocketlaneEndpoint<'getTimeEntry'>;
	updateTimeEntry: RocketlaneEndpoint<'updateTimeEntry'>;
	deleteTimeEntry: RocketlaneEndpoint<'deleteTimeEntry'>;
	getAllTimeEntries: RocketlaneEndpoint<'getAllTimeEntries'>;
	createTimeEntry: RocketlaneEndpoint<'createTimeEntry'>;
	searchTimeEntries: RocketlaneEndpoint<'searchTimeEntries'>;
	getTimeEntryCategories: RocketlaneEndpoint<'getTimeEntryCategories'>;
	getSpaceDocument: RocketlaneEndpoint<'getSpaceDocument'>;
	updateSpaceDocument: RocketlaneEndpoint<'updateSpaceDocument'>;
	deleteSpaceDocument: RocketlaneEndpoint<'deleteSpaceDocument'>;
	getAllSpaceDocuments: RocketlaneEndpoint<'getAllSpaceDocuments'>;
	createSpaceDocument: RocketlaneEndpoint<'createSpaceDocument'>;
	updateBudgetMilestoneRevenueRecognitionConfigs: RocketlaneEndpoint<'updateBudgetMilestoneRevenueRecognitionConfigs'>;
	updateBudgetManualRevenueRecognitionConfigs: RocketlaneEndpoint<'updateBudgetManualRevenueRecognitionConfigs'>;
	getBudget: RocketlaneEndpoint<'getBudget'>;
	updateBudget: RocketlaneEndpoint<'updateBudget'>;
	deleteBudget: RocketlaneEndpoint<'deleteBudget'>;
	searchBudgets: RocketlaneEndpoint<'searchBudgets'>;
	createBudget: RocketlaneEndpoint<'createBudget'>;
	getTask: RocketlaneEndpoint<'getTask'>;
	updateTask: RocketlaneEndpoint<'updateTask'>;
	deleteTask: RocketlaneEndpoint<'deleteTask'>;
	removeFollowersFromTask: RocketlaneEndpoint<'removeFollowersFromTask'>;
	removeDependenciesFromTask: RocketlaneEndpoint<'removeDependenciesFromTask'>;
	removeAssigneesFromTask: RocketlaneEndpoint<'removeAssigneesFromTask'>;
	moveTaskToGivenPhase: RocketlaneEndpoint<'moveTaskToGivenPhase'>;
	addFollowersToTask: RocketlaneEndpoint<'addFollowersToTask'>;
	addDependenciesToTask: RocketlaneEndpoint<'addDependenciesToTask'>;
	addAssigneeToTask: RocketlaneEndpoint<'addAssigneeToTask'>;
	getAllTasks: RocketlaneEndpoint<'getAllTasks'>;
	createTask: RocketlaneEndpoint<'createTask'>;
	getCustomRevenueRecognitionConfig: RocketlaneEndpoint<'getCustomRevenueRecognitionConfig'>;
	getAllCustomRevenueRecognitionConfigs: RocketlaneEndpoint<'getAllCustomRevenueRecognitionConfigs'>;
	getProject: RocketlaneEndpoint<'getProject'>;
	updateProject: RocketlaneEndpoint<'updateProject'>;
	deleteProject: RocketlaneEndpoint<'deleteProject'>;
	unassignPlaceholders: RocketlaneEndpoint<'unassignPlaceholders'>;
	removeMembers: RocketlaneEndpoint<'removeMembers'>;
	importTemplate: RocketlaneEndpoint<'importTemplate'>;
	assignPlaceholders: RocketlaneEndpoint<'assignPlaceholders'>;
	archiveProject: RocketlaneEndpoint<'archiveProject'>;
	addMembers: RocketlaneEndpoint<'addMembers'>;
	getAllProjects: RocketlaneEndpoint<'getAllProjects'>;
	createProject: RocketlaneEndpoint<'createProject'>;
	getPlaceholders: RocketlaneEndpoint<'getPlaceholders'>;
	getPhase: RocketlaneEndpoint<'getPhase'>;
	updatePhase: RocketlaneEndpoint<'updatePhase'>;
	deletePhase: RocketlaneEndpoint<'deletePhase'>;
	getAllPhases: RocketlaneEndpoint<'getAllPhases'>;
	createPhase: RocketlaneEndpoint<'createPhase'>;
	getUser: RocketlaneEndpoint<'getUser'>;
	getAllUsers: RocketlaneEndpoint<'getAllUsers'>;
	getSpace: RocketlaneEndpoint<'getSpace'>;
	updateSpace: RocketlaneEndpoint<'updateSpace'>;
	deleteSpace: RocketlaneEndpoint<'deleteSpace'>;
	getAllSpaces: RocketlaneEndpoint<'getAllSpaces'>;
	createSpace: RocketlaneEndpoint<'createSpace'>;
};

const rocketlaneEndpointsNested = {
	invoices: {
		getInvoicePayments: Handlers.getInvoicePayments,
		getInvoiceLineItems: Handlers.getInvoiceLineItems,
		getInvoice: Handlers.getInvoice,
		searchInvoices: Handlers.searchInvoices,
	},
	companies: {
		getCompany: Handlers.getCompany,
		updateCompany: Handlers.updateCompany,
		deleteCompany: Handlers.deleteCompany,
		createCompanyNote: Handlers.createCompanyNote,
		getAllCompanies: Handlers.getAllCompanies,
		createCompany: Handlers.createCompany,
	},
	resource_allocations: {
		getAllResourceAllocations: Handlers.getAllResourceAllocations,
	},
	time_offs: {
		getAllTimeoffs: Handlers.getAllTimeoffs,
		createTimeoff: Handlers.createTimeoff,
		getTimeoff: Handlers.getTimeoff,
		deleteTimeoff: Handlers.deleteTimeoff,
	},
	fields: {
		getField: Handlers.getField,
		updateField: Handlers.updateField,
		deleteField: Handlers.deleteField,
		updateFieldOption: Handlers.updateFieldOption,
		addFieldOption: Handlers.addFieldOption,
		getAllFields: Handlers.getAllFields,
		createField: Handlers.createField,
	},
	time_entries: {
		getTimeEntry: Handlers.getTimeEntry,
		updateTimeEntry: Handlers.updateTimeEntry,
		deleteTimeEntry: Handlers.deleteTimeEntry,
		getAllTimeEntries: Handlers.getAllTimeEntries,
		createTimeEntry: Handlers.createTimeEntry,
		searchTimeEntries: Handlers.searchTimeEntries,
		getTimeEntryCategories: Handlers.getTimeEntryCategories,
	},
	space_documents: {
		getSpaceDocument: Handlers.getSpaceDocument,
		updateSpaceDocument: Handlers.updateSpaceDocument,
		deleteSpaceDocument: Handlers.deleteSpaceDocument,
		getAllSpaceDocuments: Handlers.getAllSpaceDocuments,
		createSpaceDocument: Handlers.createSpaceDocument,
	},
	budgets: {
		updateBudgetMilestoneRevenueRecognitionConfigs:
			Handlers.updateBudgetMilestoneRevenueRecognitionConfigs,
		updateBudgetManualRevenueRecognitionConfigs:
			Handlers.updateBudgetManualRevenueRecognitionConfigs,
		getBudget: Handlers.getBudget,
		updateBudget: Handlers.updateBudget,
		deleteBudget: Handlers.deleteBudget,
		searchBudgets: Handlers.searchBudgets,
		createBudget: Handlers.createBudget,
	},
	tasks: {
		getTask: Handlers.getTask,
		updateTask: Handlers.updateTask,
		deleteTask: Handlers.deleteTask,
		removeFollowersFromTask: Handlers.removeFollowersFromTask,
		removeDependenciesFromTask: Handlers.removeDependenciesFromTask,
		removeAssigneesFromTask: Handlers.removeAssigneesFromTask,
		moveTaskToGivenPhase: Handlers.moveTaskToGivenPhase,
		addFollowersToTask: Handlers.addFollowersToTask,
		addDependenciesToTask: Handlers.addDependenciesToTask,
		addAssigneeToTask: Handlers.addAssigneeToTask,
		getAllTasks: Handlers.getAllTasks,
		createTask: Handlers.createTask,
	},
	custom_revenue_recognition_configs: {
		getCustomRevenueRecognitionConfig:
			Handlers.getCustomRevenueRecognitionConfig,
		getAllCustomRevenueRecognitionConfigs:
			Handlers.getAllCustomRevenueRecognitionConfigs,
	},
	projects: {
		getProject: Handlers.getProject,
		updateProject: Handlers.updateProject,
		deleteProject: Handlers.deleteProject,
		unassignPlaceholders: Handlers.unassignPlaceholders,
		removeMembers: Handlers.removeMembers,
		importTemplate: Handlers.importTemplate,
		assignPlaceholders: Handlers.assignPlaceholders,
		archiveProject: Handlers.archiveProject,
		addMembers: Handlers.addMembers,
		getAllProjects: Handlers.getAllProjects,
		createProject: Handlers.createProject,
		getPlaceholders: Handlers.getPlaceholders,
	},
	phases: {
		getPhase: Handlers.getPhase,
		updatePhase: Handlers.updatePhase,
		deletePhase: Handlers.deletePhase,
		getAllPhases: Handlers.getAllPhases,
		createPhase: Handlers.createPhase,
	},
	users: { getUser: Handlers.getUser, getAllUsers: Handlers.getAllUsers },
	spaces: {
		getSpace: Handlers.getSpace,
		updateSpace: Handlers.updateSpace,
		deleteSpace: Handlers.deleteSpace,
		getAllSpaces: Handlers.getAllSpaces,
		createSpace: Handlers.createSpace,
	},
} as const;
export type RocketlaneBoundEndpoints = BindEndpoints<
	typeof rocketlaneEndpointsNested
>;
export const rocketlaneEndpointSchemas = {
	'invoices.getInvoicePayments': {
		input: RocketlaneEndpointInputSchemas.getInvoicePayments,
		output: RocketlaneEndpointOutputSchemas.getInvoicePayments,
	},
	'invoices.getInvoiceLineItems': {
		input: RocketlaneEndpointInputSchemas.getInvoiceLineItems,
		output: RocketlaneEndpointOutputSchemas.getInvoiceLineItems,
	},
	'invoices.getInvoice': {
		input: RocketlaneEndpointInputSchemas.getInvoice,
		output: RocketlaneEndpointOutputSchemas.getInvoice,
	},
	'invoices.searchInvoices': {
		input: RocketlaneEndpointInputSchemas.searchInvoices,
		output: RocketlaneEndpointOutputSchemas.searchInvoices,
	},
	'companies.getCompany': {
		input: RocketlaneEndpointInputSchemas.getCompany,
		output: RocketlaneEndpointOutputSchemas.getCompany,
	},
	'companies.updateCompany': {
		input: RocketlaneEndpointInputSchemas.updateCompany,
		output: RocketlaneEndpointOutputSchemas.updateCompany,
	},
	'companies.deleteCompany': {
		input: RocketlaneEndpointInputSchemas.deleteCompany,
		output: RocketlaneEndpointOutputSchemas.deleteCompany,
	},
	'companies.createCompanyNote': {
		input: RocketlaneEndpointInputSchemas.createCompanyNote,
		output: RocketlaneEndpointOutputSchemas.createCompanyNote,
	},
	'companies.getAllCompanies': {
		input: RocketlaneEndpointInputSchemas.getAllCompanies,
		output: RocketlaneEndpointOutputSchemas.getAllCompanies,
	},
	'companies.createCompany': {
		input: RocketlaneEndpointInputSchemas.createCompany,
		output: RocketlaneEndpointOutputSchemas.createCompany,
	},
	'resource_allocations.getAllResourceAllocations': {
		input: RocketlaneEndpointInputSchemas.getAllResourceAllocations,
		output: RocketlaneEndpointOutputSchemas.getAllResourceAllocations,
	},
	'time_offs.getAllTimeoffs': {
		input: RocketlaneEndpointInputSchemas.getAllTimeoffs,
		output: RocketlaneEndpointOutputSchemas.getAllTimeoffs,
	},
	'time_offs.createTimeoff': {
		input: RocketlaneEndpointInputSchemas.createTimeoff,
		output: RocketlaneEndpointOutputSchemas.createTimeoff,
	},
	'time_offs.getTimeoff': {
		input: RocketlaneEndpointInputSchemas.getTimeoff,
		output: RocketlaneEndpointOutputSchemas.getTimeoff,
	},
	'time_offs.deleteTimeoff': {
		input: RocketlaneEndpointInputSchemas.deleteTimeoff,
		output: RocketlaneEndpointOutputSchemas.deleteTimeoff,
	},
	'fields.getField': {
		input: RocketlaneEndpointInputSchemas.getField,
		output: RocketlaneEndpointOutputSchemas.getField,
	},
	'fields.updateField': {
		input: RocketlaneEndpointInputSchemas.updateField,
		output: RocketlaneEndpointOutputSchemas.updateField,
	},
	'fields.deleteField': {
		input: RocketlaneEndpointInputSchemas.deleteField,
		output: RocketlaneEndpointOutputSchemas.deleteField,
	},
	'fields.updateFieldOption': {
		input: RocketlaneEndpointInputSchemas.updateFieldOption,
		output: RocketlaneEndpointOutputSchemas.updateFieldOption,
	},
	'fields.addFieldOption': {
		input: RocketlaneEndpointInputSchemas.addFieldOption,
		output: RocketlaneEndpointOutputSchemas.addFieldOption,
	},
	'fields.getAllFields': {
		input: RocketlaneEndpointInputSchemas.getAllFields,
		output: RocketlaneEndpointOutputSchemas.getAllFields,
	},
	'fields.createField': {
		input: RocketlaneEndpointInputSchemas.createField,
		output: RocketlaneEndpointOutputSchemas.createField,
	},
	'time_entries.getTimeEntry': {
		input: RocketlaneEndpointInputSchemas.getTimeEntry,
		output: RocketlaneEndpointOutputSchemas.getTimeEntry,
	},
	'time_entries.updateTimeEntry': {
		input: RocketlaneEndpointInputSchemas.updateTimeEntry,
		output: RocketlaneEndpointOutputSchemas.updateTimeEntry,
	},
	'time_entries.deleteTimeEntry': {
		input: RocketlaneEndpointInputSchemas.deleteTimeEntry,
		output: RocketlaneEndpointOutputSchemas.deleteTimeEntry,
	},
	'time_entries.getAllTimeEntries': {
		input: RocketlaneEndpointInputSchemas.getAllTimeEntries,
		output: RocketlaneEndpointOutputSchemas.getAllTimeEntries,
	},
	'time_entries.createTimeEntry': {
		input: RocketlaneEndpointInputSchemas.createTimeEntry,
		output: RocketlaneEndpointOutputSchemas.createTimeEntry,
	},
	'time_entries.searchTimeEntries': {
		input: RocketlaneEndpointInputSchemas.searchTimeEntries,
		output: RocketlaneEndpointOutputSchemas.searchTimeEntries,
	},
	'time_entries.getTimeEntryCategories': {
		input: RocketlaneEndpointInputSchemas.getTimeEntryCategories,
		output: RocketlaneEndpointOutputSchemas.getTimeEntryCategories,
	},
	'space_documents.getSpaceDocument': {
		input: RocketlaneEndpointInputSchemas.getSpaceDocument,
		output: RocketlaneEndpointOutputSchemas.getSpaceDocument,
	},
	'space_documents.updateSpaceDocument': {
		input: RocketlaneEndpointInputSchemas.updateSpaceDocument,
		output: RocketlaneEndpointOutputSchemas.updateSpaceDocument,
	},
	'space_documents.deleteSpaceDocument': {
		input: RocketlaneEndpointInputSchemas.deleteSpaceDocument,
		output: RocketlaneEndpointOutputSchemas.deleteSpaceDocument,
	},
	'space_documents.getAllSpaceDocuments': {
		input: RocketlaneEndpointInputSchemas.getAllSpaceDocuments,
		output: RocketlaneEndpointOutputSchemas.getAllSpaceDocuments,
	},
	'space_documents.createSpaceDocument': {
		input: RocketlaneEndpointInputSchemas.createSpaceDocument,
		output: RocketlaneEndpointOutputSchemas.createSpaceDocument,
	},
	'budgets.updateBudgetMilestoneRevenueRecognitionConfigs': {
		input:
			RocketlaneEndpointInputSchemas.updateBudgetMilestoneRevenueRecognitionConfigs,
		output:
			RocketlaneEndpointOutputSchemas.updateBudgetMilestoneRevenueRecognitionConfigs,
	},
	'budgets.updateBudgetManualRevenueRecognitionConfigs': {
		input:
			RocketlaneEndpointInputSchemas.updateBudgetManualRevenueRecognitionConfigs,
		output:
			RocketlaneEndpointOutputSchemas.updateBudgetManualRevenueRecognitionConfigs,
	},
	'budgets.getBudget': {
		input: RocketlaneEndpointInputSchemas.getBudget,
		output: RocketlaneEndpointOutputSchemas.getBudget,
	},
	'budgets.updateBudget': {
		input: RocketlaneEndpointInputSchemas.updateBudget,
		output: RocketlaneEndpointOutputSchemas.updateBudget,
	},
	'budgets.deleteBudget': {
		input: RocketlaneEndpointInputSchemas.deleteBudget,
		output: RocketlaneEndpointOutputSchemas.deleteBudget,
	},
	'budgets.searchBudgets': {
		input: RocketlaneEndpointInputSchemas.searchBudgets,
		output: RocketlaneEndpointOutputSchemas.searchBudgets,
	},
	'budgets.createBudget': {
		input: RocketlaneEndpointInputSchemas.createBudget,
		output: RocketlaneEndpointOutputSchemas.createBudget,
	},
	'tasks.getTask': {
		input: RocketlaneEndpointInputSchemas.getTask,
		output: RocketlaneEndpointOutputSchemas.getTask,
	},
	'tasks.updateTask': {
		input: RocketlaneEndpointInputSchemas.updateTask,
		output: RocketlaneEndpointOutputSchemas.updateTask,
	},
	'tasks.deleteTask': {
		input: RocketlaneEndpointInputSchemas.deleteTask,
		output: RocketlaneEndpointOutputSchemas.deleteTask,
	},
	'tasks.removeFollowersFromTask': {
		input: RocketlaneEndpointInputSchemas.removeFollowersFromTask,
		output: RocketlaneEndpointOutputSchemas.removeFollowersFromTask,
	},
	'tasks.removeDependenciesFromTask': {
		input: RocketlaneEndpointInputSchemas.removeDependenciesFromTask,
		output: RocketlaneEndpointOutputSchemas.removeDependenciesFromTask,
	},
	'tasks.removeAssigneesFromTask': {
		input: RocketlaneEndpointInputSchemas.removeAssigneesFromTask,
		output: RocketlaneEndpointOutputSchemas.removeAssigneesFromTask,
	},
	'tasks.moveTaskToGivenPhase': {
		input: RocketlaneEndpointInputSchemas.moveTaskToGivenPhase,
		output: RocketlaneEndpointOutputSchemas.moveTaskToGivenPhase,
	},
	'tasks.addFollowersToTask': {
		input: RocketlaneEndpointInputSchemas.addFollowersToTask,
		output: RocketlaneEndpointOutputSchemas.addFollowersToTask,
	},
	'tasks.addDependenciesToTask': {
		input: RocketlaneEndpointInputSchemas.addDependenciesToTask,
		output: RocketlaneEndpointOutputSchemas.addDependenciesToTask,
	},
	'tasks.addAssigneeToTask': {
		input: RocketlaneEndpointInputSchemas.addAssigneeToTask,
		output: RocketlaneEndpointOutputSchemas.addAssigneeToTask,
	},
	'tasks.getAllTasks': {
		input: RocketlaneEndpointInputSchemas.getAllTasks,
		output: RocketlaneEndpointOutputSchemas.getAllTasks,
	},
	'tasks.createTask': {
		input: RocketlaneEndpointInputSchemas.createTask,
		output: RocketlaneEndpointOutputSchemas.createTask,
	},
	'custom_revenue_recognition_configs.getCustomRevenueRecognitionConfig': {
		input: RocketlaneEndpointInputSchemas.getCustomRevenueRecognitionConfig,
		output: RocketlaneEndpointOutputSchemas.getCustomRevenueRecognitionConfig,
	},
	'custom_revenue_recognition_configs.getAllCustomRevenueRecognitionConfigs': {
		input: RocketlaneEndpointInputSchemas.getAllCustomRevenueRecognitionConfigs,
		output:
			RocketlaneEndpointOutputSchemas.getAllCustomRevenueRecognitionConfigs,
	},
	'projects.getProject': {
		input: RocketlaneEndpointInputSchemas.getProject,
		output: RocketlaneEndpointOutputSchemas.getProject,
	},
	'projects.updateProject': {
		input: RocketlaneEndpointInputSchemas.updateProject,
		output: RocketlaneEndpointOutputSchemas.updateProject,
	},
	'projects.deleteProject': {
		input: RocketlaneEndpointInputSchemas.deleteProject,
		output: RocketlaneEndpointOutputSchemas.deleteProject,
	},
	'projects.unassignPlaceholders': {
		input: RocketlaneEndpointInputSchemas.unassignPlaceholders,
		output: RocketlaneEndpointOutputSchemas.unassignPlaceholders,
	},
	'projects.removeMembers': {
		input: RocketlaneEndpointInputSchemas.removeMembers,
		output: RocketlaneEndpointOutputSchemas.removeMembers,
	},
	'projects.importTemplate': {
		input: RocketlaneEndpointInputSchemas.importTemplate,
		output: RocketlaneEndpointOutputSchemas.importTemplate,
	},
	'projects.assignPlaceholders': {
		input: RocketlaneEndpointInputSchemas.assignPlaceholders,
		output: RocketlaneEndpointOutputSchemas.assignPlaceholders,
	},
	'projects.archiveProject': {
		input: RocketlaneEndpointInputSchemas.archiveProject,
		output: RocketlaneEndpointOutputSchemas.archiveProject,
	},
	'projects.addMembers': {
		input: RocketlaneEndpointInputSchemas.addMembers,
		output: RocketlaneEndpointOutputSchemas.addMembers,
	},
	'projects.getAllProjects': {
		input: RocketlaneEndpointInputSchemas.getAllProjects,
		output: RocketlaneEndpointOutputSchemas.getAllProjects,
	},
	'projects.createProject': {
		input: RocketlaneEndpointInputSchemas.createProject,
		output: RocketlaneEndpointOutputSchemas.createProject,
	},
	'projects.getPlaceholders': {
		input: RocketlaneEndpointInputSchemas.getPlaceholders,
		output: RocketlaneEndpointOutputSchemas.getPlaceholders,
	},
	'phases.getPhase': {
		input: RocketlaneEndpointInputSchemas.getPhase,
		output: RocketlaneEndpointOutputSchemas.getPhase,
	},
	'phases.updatePhase': {
		input: RocketlaneEndpointInputSchemas.updatePhase,
		output: RocketlaneEndpointOutputSchemas.updatePhase,
	},
	'phases.deletePhase': {
		input: RocketlaneEndpointInputSchemas.deletePhase,
		output: RocketlaneEndpointOutputSchemas.deletePhase,
	},
	'phases.getAllPhases': {
		input: RocketlaneEndpointInputSchemas.getAllPhases,
		output: RocketlaneEndpointOutputSchemas.getAllPhases,
	},
	'phases.createPhase': {
		input: RocketlaneEndpointInputSchemas.createPhase,
		output: RocketlaneEndpointOutputSchemas.createPhase,
	},
	'users.getUser': {
		input: RocketlaneEndpointInputSchemas.getUser,
		output: RocketlaneEndpointOutputSchemas.getUser,
	},
	'users.getAllUsers': {
		input: RocketlaneEndpointInputSchemas.getAllUsers,
		output: RocketlaneEndpointOutputSchemas.getAllUsers,
	},
	'spaces.getSpace': {
		input: RocketlaneEndpointInputSchemas.getSpace,
		output: RocketlaneEndpointOutputSchemas.getSpace,
	},
	'spaces.updateSpace': {
		input: RocketlaneEndpointInputSchemas.updateSpace,
		output: RocketlaneEndpointOutputSchemas.updateSpace,
	},
	'spaces.deleteSpace': {
		input: RocketlaneEndpointInputSchemas.deleteSpace,
		output: RocketlaneEndpointOutputSchemas.deleteSpace,
	},
	'spaces.getAllSpaces': {
		input: RocketlaneEndpointInputSchemas.getAllSpaces,
		output: RocketlaneEndpointOutputSchemas.getAllSpaces,
	},
	'spaces.createSpace': {
		input: RocketlaneEndpointInputSchemas.createSpace,
		output: RocketlaneEndpointOutputSchemas.createSpace,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rocketlaneEndpointsNested
>;
const rocketlaneEndpointMeta = {
	'invoices.getInvoicePayments': {
		riskLevel: 'read',
		description: 'Get invoice payments by invoice Id',
	},
	'invoices.getInvoiceLineItems': {
		riskLevel: 'read',
		description: 'Get invoice line items by invoice Id',
	},
	'invoices.getInvoice': {
		riskLevel: 'read',
		description: 'Get invoice by Id',
	},
	'invoices.searchInvoices': {
		riskLevel: 'read',
		description: 'Get all invoices',
	},
	'companies.getCompany': {
		riskLevel: 'read',
		description: 'Get company by Id',
	},
	'companies.updateCompany': {
		riskLevel: 'write',
		description: 'Update company by Id',
	},
	'companies.deleteCompany': {
		riskLevel: 'write',
		description: 'Delete company by Id',
	},
	'companies.createCompanyNote': {
		riskLevel: 'write',
		description: 'Create a note for a company',
	},
	'companies.getAllCompanies': {
		riskLevel: 'read',
		description: 'Get all companies',
	},
	'companies.createCompany': {
		riskLevel: 'write',
		description: 'Create a company',
	},
	'resource_allocations.getAllResourceAllocations': {
		riskLevel: 'read',
		description: 'Get all Resource allocations',
	},
	'time_offs.getAllTimeoffs': {
		riskLevel: 'read',
		description: 'Get all time-offs',
	},
	'time_offs.createTimeoff': {
		riskLevel: 'write',
		description: 'Create a time-off',
	},
	'time_offs.getTimeoff': {
		riskLevel: 'read',
		description: 'Get time-off by Id',
	},
	'time_offs.deleteTimeoff': {
		riskLevel: 'write',
		description: 'Delete a time-off',
	},
	'fields.getField': { riskLevel: 'read', description: 'Get field by Id' },
	'fields.updateField': {
		riskLevel: 'write',
		description: 'Update field by Id',
	},
	'fields.deleteField': {
		riskLevel: 'write',
		description: 'Delete field by Id',
	},
	'fields.updateFieldOption': {
		riskLevel: 'write',
		description: 'Update field Option',
	},
	'fields.addFieldOption': {
		riskLevel: 'write',
		description: 'Add field Option',
	},
	'fields.getAllFields': { riskLevel: 'read', description: 'Get all fields' },
	'fields.createField': { riskLevel: 'write', description: 'Create a Field' },
	'time_entries.getTimeEntry': {
		riskLevel: 'read',
		description: 'Get a time entry',
	},
	'time_entries.updateTimeEntry': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'time_entries.deleteTimeEntry': {
		riskLevel: 'write',
		description: 'Delete a time entry',
	},
	'time_entries.getAllTimeEntries': {
		riskLevel: 'read',
		description: 'Get all time entries',
	},
	'time_entries.createTimeEntry': {
		riskLevel: 'write',
		description: 'Create a time entry',
	},
	'time_entries.searchTimeEntries': {
		riskLevel: 'read',
		description: 'Search time entries',
	},
	'time_entries.getTimeEntryCategories': {
		riskLevel: 'read',
		description: 'Get time entry categories',
	},
	'space_documents.getSpaceDocument': {
		riskLevel: 'read',
		description: 'Get space document by Id',
	},
	'space_documents.updateSpaceDocument': {
		riskLevel: 'write',
		description: 'Update space document by Id',
	},
	'space_documents.deleteSpaceDocument': {
		riskLevel: 'write',
		description: 'Delete space document by Id',
	},
	'space_documents.getAllSpaceDocuments': {
		riskLevel: 'read',
		description: 'Get all space documents',
	},
	'space_documents.createSpaceDocument': {
		riskLevel: 'write',
		description: 'Create a space document',
	},
	'budgets.updateBudgetMilestoneRevenueRecognitionConfigs': {
		riskLevel: 'write',
		description: 'Update milestone revenue recognition configs for a budget',
	},
	'budgets.updateBudgetManualRevenueRecognitionConfigs': {
		riskLevel: 'write',
		description: 'Update manual revenue recognition configs for a budget',
	},
	'budgets.getBudget': { riskLevel: 'read', description: 'Get budget by Id' },
	'budgets.updateBudget': {
		riskLevel: 'write',
		description: 'Update budget by Id',
	},
	'budgets.deleteBudget': {
		riskLevel: 'write',
		description: 'Delete budget by Id',
	},
	'budgets.searchBudgets': {
		riskLevel: 'read',
		description: 'Get all budgets',
	},
	'budgets.createBudget': { riskLevel: 'write', description: 'Create budget' },
	'tasks.getTask': { riskLevel: 'read', description: 'Get task by Id' },
	'tasks.updateTask': { riskLevel: 'write', description: 'Update task by Id' },
	'tasks.deleteTask': { riskLevel: 'write', description: 'Delete task by Id' },
	'tasks.removeFollowersFromTask': {
		riskLevel: 'write',
		description: 'Remove followers from a task by Id',
	},
	'tasks.removeDependenciesFromTask': {
		riskLevel: 'write',
		description: 'Remove dependencies from a task by Id',
	},
	'tasks.removeAssigneesFromTask': {
		riskLevel: 'write',
		description: 'Remove assignees from a task by Id',
	},
	'tasks.moveTaskToGivenPhase': {
		riskLevel: 'write',
		description: 'Move a task to the phase by Id',
	},
	'tasks.addFollowersToTask': {
		riskLevel: 'write',
		description: 'Add followers to a task by Id',
	},
	'tasks.addDependenciesToTask': {
		riskLevel: 'write',
		description: 'Add dependencies to a task by Id',
	},
	'tasks.addAssigneeToTask': {
		riskLevel: 'write',
		description: 'Add assignees to a task by Id',
	},
	'tasks.getAllTasks': { riskLevel: 'read', description: 'Get all tasks' },
	'tasks.createTask': { riskLevel: 'write', description: 'Create a task' },
	'custom_revenue_recognition_configs.getCustomRevenueRecognitionConfig': {
		riskLevel: 'read',
		description: 'Get custom revenue recognition config by Id',
	},
	'custom_revenue_recognition_configs.getAllCustomRevenueRecognitionConfigs': {
		riskLevel: 'read',
		description: 'Get all custom revenue recognition configs',
	},
	'projects.getProject': {
		riskLevel: 'read',
		description: 'Get project by Id',
	},
	'projects.updateProject': {
		riskLevel: 'write',
		description: 'Update project by Id',
	},
	'projects.deleteProject': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete project by Id',
	},
	'projects.unassignPlaceholders': {
		riskLevel: 'write',
		description: 'Un assign placeholders from an user in a project',
	},
	'projects.removeMembers': {
		riskLevel: 'write',
		description: 'Remove members from a project',
	},
	'projects.importTemplate': {
		riskLevel: 'write',
		description: 'Import a template to a project',
	},
	'projects.assignPlaceholders': {
		riskLevel: 'write',
		description: 'Assign placeholders to an user in a project',
	},
	'projects.archiveProject': {
		riskLevel: 'write',
		description: 'Archive project by Id',
	},
	'projects.addMembers': {
		riskLevel: 'write',
		description: 'Add members to a project',
	},
	'projects.getAllProjects': {
		riskLevel: 'read',
		description: 'Get all projects',
	},
	'projects.createProject': {
		riskLevel: 'write',
		description: 'Create a project',
	},
	'projects.getPlaceholders': {
		riskLevel: 'read',
		description: 'Get placeholders',
	},
	'phases.getPhase': { riskLevel: 'read', description: 'Get phase by Id' },
	'phases.updatePhase': {
		riskLevel: 'write',
		description: 'Update phase by Id',
	},
	'phases.deletePhase': {
		riskLevel: 'write',
		description: 'Delete phase by Id',
	},
	'phases.getAllPhases': { riskLevel: 'read', description: 'Get all phases' },
	'phases.createPhase': { riskLevel: 'write', description: 'Create a phase' },
	'users.getUser': { riskLevel: 'read', description: 'Get user by Id' },
	'users.getAllUsers': { riskLevel: 'read', description: 'Get all users' },
	'spaces.getSpace': { riskLevel: 'read', description: 'Get space by Id' },
	'spaces.updateSpace': {
		riskLevel: 'write',
		description: 'Update space by Id',
	},
	'spaces.deleteSpace': {
		riskLevel: 'write',
		description: 'Delete space by Id',
	},
	'spaces.getAllSpaces': { riskLevel: 'read', description: 'Get all spaces' },
	'spaces.createSpace': { riskLevel: 'write', description: 'Create a space' },
} as const satisfies RequiredPluginEndpointMeta<
	typeof rocketlaneEndpointsNested
>;
const defaultAuthType = 'api_key' as const;
export const rocketlaneAuthConfig = {
	api_key: { account: ['tenant_external_id'] as const },
} as const satisfies PluginAuthConfig;
export type BaseRocketlanePlugin<T extends RocketlanePluginOptions> =
	CorsairPlugin<
		'rocketlane',
		typeof RocketlaneSchema,
		typeof rocketlaneEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;
export type InternalRocketlanePlugin =
	BaseRocketlanePlugin<RocketlanePluginOptions>;
export type ExternalRocketlanePlugin<T extends RocketlanePluginOptions> =
	BaseRocketlanePlugin<T>;
export function rocketlane<const T extends RocketlanePluginOptions>(
	incomingOptions: RocketlanePluginOptions & T = {} as RocketlanePluginOptions &
		T,
): ExternalRocketlanePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rocketlane',
		authConfig: rocketlaneAuthConfig,
		schema: RocketlaneSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: rocketlaneEndpointsNested,
		webhooks: {},
		endpointMeta: rocketlaneEndpointMeta,
		endpointSchemas: rocketlaneEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: RocketlaneKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('rocketlane', 'api_key');
			if (options.key) return options.key;
			const key = await ctx.keys?.get_api_key();
			if (!key) throw new AuthMissingError('rocketlane', 'api_key');
			return key;
		},
	} satisfies InternalRocketlanePlugin;
}
export { ROCKETLANE_API_BASE, RocketlaneAPIError } from './client';
export * from './endpoints/types';
