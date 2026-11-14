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
	Bookings,
	Categories,
	CustomFields,
	Events,
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
	Milestones,
	Projects,
	Resources,
	TimeEntries,
} from './endpoints';
import type {
	HubPlannerEndpointInputs,
	HubPlannerEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HubPlannerSchema } from './schema';

export type HubPlannerPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHubPlannerPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof hubplannerEndpointsNested>;
};

export type HubPlannerContext = CorsairPluginContext<
	typeof HubPlannerSchema,
	HubPlannerPluginOptions
>;

export type HubPlannerKeyBuilderContext =
	KeyBuilderContext<HubPlannerPluginOptions>;

export type HubPlannerBoundEndpoints = BindEndpoints<
	typeof hubplannerEndpointsNested
>;

type HubPlannerEndpoint<K extends keyof HubPlannerEndpointOutputs> =
	CorsairEndpoint<
		HubPlannerContext,
		HubPlannerEndpointInputs[K],
		HubPlannerEndpointOutputs[K]
	>;

export type HubPlannerEndpoints = {
	[K in keyof HubPlannerEndpointOutputs]: HubPlannerEndpoint<K>;
};

const hubplannerEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
		deleteBulk: Projects.deleteBulk,
		search: Projects.search,
		addResources: Projects.addResources,
		removeResource: Projects.removeResource,
		addClients: Projects.addClients,
		removeClient: Projects.removeClient,
		setProjectManagers: Projects.setProjectManagers,
		getTags: Projects.getTags,
		addTags: Projects.addTags,
		removeTag: Projects.removeTag,
	},
	resources: {
		list: Resources.list,
		get: Resources.get,
		create: Resources.create,
		update: Resources.update,
		delete: Resources.delete,
		deleteBulk: Resources.deleteBulk,
		search: Resources.search,
		getTags: Resources.getTags,
		addTags: Resources.addTags,
		removeTag: Resources.removeTag,
	},
	bookings: {
		list: Bookings.list,
		get: Bookings.get,
		create: Bookings.create,
		update: Bookings.update,
		patch: Bookings.patch,
		search: Bookings.search,
		delete: Bookings.delete,
		deleteBulk: Bookings.deleteBulk,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		search: TimeEntries.search,
		update: TimeEntries.update,
		delete: TimeEntries.delete,
		deleteBulk: TimeEntries.deleteBulk,
	},
	categories: {
		list: Categories.list,
		get: Categories.get,
		create: Categories.create,
		update: Categories.update,
		search: Categories.search,
		listGroups: Categories.listGroups,
		listCostCategories: Categories.listCostCategories,
		getCostCategory: Categories.getCostCategory,
		createCostCategory: Categories.createCostCategory,
		updateCostCategory: Categories.updateCostCategory,
		searchCostCategories: Categories.searchCostCategories,
		deleteCostCategory: Categories.deleteCostCategory,
	},
	customFields: {
		list: CustomFields.list,
		get: CustomFields.get,
		create: CustomFields.create,
		update: CustomFields.update,
		delete: CustomFields.delete,
		search: CustomFields.search,
		addChoices: CustomFields.addChoices,
	},
	milestones: {
		list: Milestones.list,
		get: Milestones.get,
		create: Milestones.create,
		update: Milestones.update,
		delete: Milestones.delete,
		search: Milestones.search,
	},
	events: {
		list: Events.list,
		get: Events.get,
		create: Events.create,
		update: Events.update,
		delete: Events.delete,
		search: Events.search,
	},
} as const;

export const hubplannerEndpointSchemas = {
	'projects.list': {
		input: HubPlannerEndpointInputSchemas['projects.list'],
		output: HubPlannerEndpointOutputSchemas['projects.list'],
	},
	'projects.get': {
		input: HubPlannerEndpointInputSchemas['projects.get'],
		output: HubPlannerEndpointOutputSchemas['projects.get'],
	},
	'projects.create': {
		input: HubPlannerEndpointInputSchemas['projects.create'],
		output: HubPlannerEndpointOutputSchemas['projects.create'],
	},
	'projects.update': {
		input: HubPlannerEndpointInputSchemas['projects.update'],
		output: HubPlannerEndpointOutputSchemas['projects.update'],
	},
	'projects.delete': {
		input: HubPlannerEndpointInputSchemas['projects.delete'],
		output: HubPlannerEndpointOutputSchemas['projects.delete'],
	},
	'projects.deleteBulk': {
		input: HubPlannerEndpointInputSchemas['projects.deleteBulk'],
		output: HubPlannerEndpointOutputSchemas['projects.deleteBulk'],
	},
	'projects.search': {
		input: HubPlannerEndpointInputSchemas['projects.search'],
		output: HubPlannerEndpointOutputSchemas['projects.search'],
	},
	'projects.addResources': {
		input: HubPlannerEndpointInputSchemas['projects.addResources'],
		output: HubPlannerEndpointOutputSchemas['projects.addResources'],
	},
	'projects.removeResource': {
		input: HubPlannerEndpointInputSchemas['projects.removeResource'],
		output: HubPlannerEndpointOutputSchemas['projects.removeResource'],
	},
	'projects.addClients': {
		input: HubPlannerEndpointInputSchemas['projects.addClients'],
		output: HubPlannerEndpointOutputSchemas['projects.addClients'],
	},
	'projects.removeClient': {
		input: HubPlannerEndpointInputSchemas['projects.removeClient'],
		output: HubPlannerEndpointOutputSchemas['projects.removeClient'],
	},
	'projects.setProjectManagers': {
		input: HubPlannerEndpointInputSchemas['projects.setProjectManagers'],
		output: HubPlannerEndpointOutputSchemas['projects.setProjectManagers'],
	},
	'projects.getTags': {
		input: HubPlannerEndpointInputSchemas['projects.getTags'],
		output: HubPlannerEndpointOutputSchemas['projects.getTags'],
	},
	'projects.addTags': {
		input: HubPlannerEndpointInputSchemas['projects.addTags'],
		output: HubPlannerEndpointOutputSchemas['projects.addTags'],
	},
	'projects.removeTag': {
		input: HubPlannerEndpointInputSchemas['projects.removeTag'],
		output: HubPlannerEndpointOutputSchemas['projects.removeTag'],
	},

	'resources.list': {
		input: HubPlannerEndpointInputSchemas['resources.list'],
		output: HubPlannerEndpointOutputSchemas['resources.list'],
	},
	'resources.get': {
		input: HubPlannerEndpointInputSchemas['resources.get'],
		output: HubPlannerEndpointOutputSchemas['resources.get'],
	},
	'resources.create': {
		input: HubPlannerEndpointInputSchemas['resources.create'],
		output: HubPlannerEndpointOutputSchemas['resources.create'],
	},
	'resources.update': {
		input: HubPlannerEndpointInputSchemas['resources.update'],
		output: HubPlannerEndpointOutputSchemas['resources.update'],
	},
	'resources.delete': {
		input: HubPlannerEndpointInputSchemas['resources.delete'],
		output: HubPlannerEndpointOutputSchemas['resources.delete'],
	},
	'resources.deleteBulk': {
		input: HubPlannerEndpointInputSchemas['resources.deleteBulk'],
		output: HubPlannerEndpointOutputSchemas['resources.deleteBulk'],
	},
	'resources.search': {
		input: HubPlannerEndpointInputSchemas['resources.search'],
		output: HubPlannerEndpointOutputSchemas['resources.search'],
	},
	'resources.getTags': {
		input: HubPlannerEndpointInputSchemas['resources.getTags'],
		output: HubPlannerEndpointOutputSchemas['resources.getTags'],
	},
	'resources.addTags': {
		input: HubPlannerEndpointInputSchemas['resources.addTags'],
		output: HubPlannerEndpointOutputSchemas['resources.addTags'],
	},
	'resources.removeTag': {
		input: HubPlannerEndpointInputSchemas['resources.removeTag'],
		output: HubPlannerEndpointOutputSchemas['resources.removeTag'],
	},

	'bookings.list': {
		input: HubPlannerEndpointInputSchemas['bookings.list'],
		output: HubPlannerEndpointOutputSchemas['bookings.list'],
	},
	'bookings.get': {
		input: HubPlannerEndpointInputSchemas['bookings.get'],
		output: HubPlannerEndpointOutputSchemas['bookings.get'],
	},
	'bookings.create': {
		input: HubPlannerEndpointInputSchemas['bookings.create'],
		output: HubPlannerEndpointOutputSchemas['bookings.create'],
	},
	'bookings.update': {
		input: HubPlannerEndpointInputSchemas['bookings.update'],
		output: HubPlannerEndpointOutputSchemas['bookings.update'],
	},
	'bookings.patch': {
		input: HubPlannerEndpointInputSchemas['bookings.patch'],
		output: HubPlannerEndpointOutputSchemas['bookings.patch'],
	},
	'bookings.search': {
		input: HubPlannerEndpointInputSchemas['bookings.search'],
		output: HubPlannerEndpointOutputSchemas['bookings.search'],
	},
	'bookings.delete': {
		input: HubPlannerEndpointInputSchemas['bookings.delete'],
		output: HubPlannerEndpointOutputSchemas['bookings.delete'],
	},
	'bookings.deleteBulk': {
		input: HubPlannerEndpointInputSchemas['bookings.deleteBulk'],
		output: HubPlannerEndpointOutputSchemas['bookings.deleteBulk'],
	},

	'timeEntries.list': {
		input: HubPlannerEndpointInputSchemas['timeEntries.list'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.list'],
	},
	'timeEntries.get': {
		input: HubPlannerEndpointInputSchemas['timeEntries.get'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.get'],
	},
	'timeEntries.create': {
		input: HubPlannerEndpointInputSchemas['timeEntries.create'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.create'],
	},
	'timeEntries.search': {
		input: HubPlannerEndpointInputSchemas['timeEntries.search'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.search'],
	},
	'timeEntries.update': {
		input: HubPlannerEndpointInputSchemas['timeEntries.update'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.update'],
	},
	'timeEntries.delete': {
		input: HubPlannerEndpointInputSchemas['timeEntries.delete'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.delete'],
	},
	'timeEntries.deleteBulk': {
		input: HubPlannerEndpointInputSchemas['timeEntries.deleteBulk'],
		output: HubPlannerEndpointOutputSchemas['timeEntries.deleteBulk'],
	},

	'categories.list': {
		input: HubPlannerEndpointInputSchemas['categories.list'],
		output: HubPlannerEndpointOutputSchemas['categories.list'],
	},
	'categories.get': {
		input: HubPlannerEndpointInputSchemas['categories.get'],
		output: HubPlannerEndpointOutputSchemas['categories.get'],
	},
	'categories.create': {
		input: HubPlannerEndpointInputSchemas['categories.create'],
		output: HubPlannerEndpointOutputSchemas['categories.create'],
	},
	'categories.update': {
		input: HubPlannerEndpointInputSchemas['categories.update'],
		output: HubPlannerEndpointOutputSchemas['categories.update'],
	},
	'categories.search': {
		input: HubPlannerEndpointInputSchemas['categories.search'],
		output: HubPlannerEndpointOutputSchemas['categories.search'],
	},
	'categories.listGroups': {
		input: HubPlannerEndpointInputSchemas['categories.listGroups'],
		output: HubPlannerEndpointOutputSchemas['categories.listGroups'],
	},
	'categories.listCostCategories': {
		input: HubPlannerEndpointInputSchemas['categories.listCostCategories'],
		output: HubPlannerEndpointOutputSchemas['categories.listCostCategories'],
	},
	'categories.getCostCategory': {
		input: HubPlannerEndpointInputSchemas['categories.getCostCategory'],
		output: HubPlannerEndpointOutputSchemas['categories.getCostCategory'],
	},
	'categories.createCostCategory': {
		input: HubPlannerEndpointInputSchemas['categories.createCostCategory'],
		output: HubPlannerEndpointOutputSchemas['categories.createCostCategory'],
	},
	'categories.updateCostCategory': {
		input: HubPlannerEndpointInputSchemas['categories.updateCostCategory'],
		output: HubPlannerEndpointOutputSchemas['categories.updateCostCategory'],
	},
	'categories.searchCostCategories': {
		input: HubPlannerEndpointInputSchemas['categories.searchCostCategories'],
		output: HubPlannerEndpointOutputSchemas['categories.searchCostCategories'],
	},
	'categories.deleteCostCategory': {
		input: HubPlannerEndpointInputSchemas['categories.deleteCostCategory'],
		output: HubPlannerEndpointOutputSchemas['categories.deleteCostCategory'],
	},

	'customFields.list': {
		input: HubPlannerEndpointInputSchemas['customFields.list'],
		output: HubPlannerEndpointOutputSchemas['customFields.list'],
	},
	'customFields.get': {
		input: HubPlannerEndpointInputSchemas['customFields.get'],
		output: HubPlannerEndpointOutputSchemas['customFields.get'],
	},
	'customFields.create': {
		input: HubPlannerEndpointInputSchemas['customFields.create'],
		output: HubPlannerEndpointOutputSchemas['customFields.create'],
	},
	'customFields.update': {
		input: HubPlannerEndpointInputSchemas['customFields.update'],
		output: HubPlannerEndpointOutputSchemas['customFields.update'],
	},
	'customFields.delete': {
		input: HubPlannerEndpointInputSchemas['customFields.delete'],
		output: HubPlannerEndpointOutputSchemas['customFields.delete'],
	},
	'customFields.search': {
		input: HubPlannerEndpointInputSchemas['customFields.search'],
		output: HubPlannerEndpointOutputSchemas['customFields.search'],
	},
	'customFields.addChoices': {
		input: HubPlannerEndpointInputSchemas['customFields.addChoices'],
		output: HubPlannerEndpointOutputSchemas['customFields.addChoices'],
	},

	'milestones.list': {
		input: HubPlannerEndpointInputSchemas['milestones.list'],
		output: HubPlannerEndpointOutputSchemas['milestones.list'],
	},
	'milestones.get': {
		input: HubPlannerEndpointInputSchemas['milestones.get'],
		output: HubPlannerEndpointOutputSchemas['milestones.get'],
	},
	'milestones.create': {
		input: HubPlannerEndpointInputSchemas['milestones.create'],
		output: HubPlannerEndpointOutputSchemas['milestones.create'],
	},
	'milestones.update': {
		input: HubPlannerEndpointInputSchemas['milestones.update'],
		output: HubPlannerEndpointOutputSchemas['milestones.update'],
	},
	'milestones.delete': {
		input: HubPlannerEndpointInputSchemas['milestones.delete'],
		output: HubPlannerEndpointOutputSchemas['milestones.delete'],
	},
	'milestones.search': {
		input: HubPlannerEndpointInputSchemas['milestones.search'],
		output: HubPlannerEndpointOutputSchemas['milestones.search'],
	},

	'events.list': {
		input: HubPlannerEndpointInputSchemas['events.list'],
		output: HubPlannerEndpointOutputSchemas['events.list'],
	},
	'events.get': {
		input: HubPlannerEndpointInputSchemas['events.get'],
		output: HubPlannerEndpointOutputSchemas['events.get'],
	},
	'events.create': {
		input: HubPlannerEndpointInputSchemas['events.create'],
		output: HubPlannerEndpointOutputSchemas['events.create'],
	},
	'events.update': {
		input: HubPlannerEndpointInputSchemas['events.update'],
		output: HubPlannerEndpointOutputSchemas['events.update'],
	},
	'events.delete': {
		input: HubPlannerEndpointInputSchemas['events.delete'],
		output: HubPlannerEndpointOutputSchemas['events.delete'],
	},
	'events.search': {
		input: HubPlannerEndpointInputSchemas['events.search'],
		output: HubPlannerEndpointOutputSchemas['events.search'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof hubplannerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const hubplannerEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List all projects with pagination and sorting',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get project details by project ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a new project',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Bulk update projects with modified attributes',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific project by ID',
	},
	'projects.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete multiple projects by their IDs',
	},
	'projects.search': {
		riskLevel: 'read',
		description: 'Search projects matching custom criteria',
	},
	'projects.addResources': {
		riskLevel: 'write',
		description: 'Assign resources to a project',
	},
	'projects.removeResource': {
		riskLevel: 'write',
		description: 'Remove a resource from multiple projects',
	},
	'projects.addClients': {
		riskLevel: 'write',
		description: 'Associate client organizations with a project',
	},
	'projects.removeClient': {
		riskLevel: 'write',
		description: 'Dissociate a client organization from projects',
	},
	'projects.setProjectManagers': {
		riskLevel: 'write',
		description: 'Set designated project managers for a project',
	},
	'projects.getTags': {
		riskLevel: 'read',
		description: 'List tags associated with a project',
	},
	'projects.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a project',
	},
	'projects.removeTag': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a project',
	},

	'resources.list': {
		riskLevel: 'read',
		description: 'List all resources with pagination and sorting',
	},
	'resources.get': {
		riskLevel: 'read',
		description: 'Get resource details by resource ID',
	},
	'resources.create': {
		riskLevel: 'write',
		description: 'Create a new resource member',
	},
	'resources.update': {
		riskLevel: 'write',
		description: 'Bulk update resources with modified attributes',
	},
	'resources.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific resource by ID',
	},
	'resources.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete multiple resources by their IDs',
	},
	'resources.search': {
		riskLevel: 'read',
		description: 'Search resources matching custom criteria',
	},
	'resources.getTags': {
		riskLevel: 'read',
		description: 'List tags associated with a resource',
	},
	'resources.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a resource',
	},
	'resources.removeTag': {
		riskLevel: 'destructive',
		description: 'Remove a tag from a resource',
	},

	'bookings.list': {
		riskLevel: 'read',
		description: 'List scheduled bookings with pagination and filters',
	},
	'bookings.get': {
		riskLevel: 'read',
		description: 'Get booking details by booking ID',
	},
	'bookings.create': {
		riskLevel: 'write',
		description: 'Create a new resource schedule booking',
	},
	'bookings.update': {
		riskLevel: 'write',
		description: 'Update all properties of an existing booking',
	},
	'bookings.patch': {
		riskLevel: 'write',
		description:
			'Patch specific properties of a booking or approve/reject booking requests',
	},
	'bookings.search': {
		riskLevel: 'read',
		description:
			'Search bookings matching criteria such as date range or project',
	},
	'bookings.delete': {
		riskLevel: 'destructive',
		description: 'Delete a specific booking by ID',
	},
	'bookings.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Bulk delete bookings by IDs or filter parameters',
	},

	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List recorded timesheet entries with pagination and filters',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get timesheet entry details by ID',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Log new time entry on a project for a resource',
	},
	'timeEntries.search': {
		riskLevel: 'read',
		description:
			'Search time entries matching date ranges and resource/project filters',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update an existing timesheet entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a timesheet entry by ID',
	},
	'timeEntries.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete multiple timesheet entries by their IDs',
	},

	'categories.list': {
		riskLevel: 'read',
		description: 'List all booking categories',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get booking category details by category ID',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a new booking category in a group',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Update an existing booking category',
	},
	'categories.search': {
		riskLevel: 'read',
		description: 'Search booking categories by name or group',
	},
	'categories.listGroups': {
		riskLevel: 'read',
		description: 'List booking category groups',
	},
	'categories.listCostCategories': {
		riskLevel: 'read',
		description: 'List all project cost categories',
	},
	'categories.getCostCategory': {
		riskLevel: 'read',
		description: 'Get project cost category by ID',
	},
	'categories.createCostCategory': {
		riskLevel: 'write',
		description: 'Create a new project cost category',
	},
	'categories.updateCostCategory': {
		riskLevel: 'write',
		description: 'Update an existing project cost category',
	},
	'categories.searchCostCategories': {
		riskLevel: 'read',
		description: 'Search project cost categories by name',
	},
	'categories.deleteCostCategory': {
		riskLevel: 'destructive',
		description: 'Delete a project cost category by ID',
	},

	'customFields.list': {
		riskLevel: 'read',
		description: 'List custom field templates for projects or resources',
	},
	'customFields.get': {
		riskLevel: 'read',
		description: 'Get custom field template details by ID',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a new custom field template for projects or resources',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: 'Update a custom field template and its configuration',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom field template by ID',
	},
	'customFields.search': {
		riskLevel: 'read',
		description: 'Search custom field templates matching filter parameters',
	},
	'customFields.addChoices': {
		riskLevel: 'write',
		description: 'Add options to dropdown or selection custom field templates',
	},

	'milestones.list': {
		riskLevel: 'read',
		description: 'List milestones with pagination and sorting',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Get milestone details by milestone ID',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a new project milestone date',
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update an existing project milestone',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		description: 'Delete a project milestone by ID',
	},
	'milestones.search': {
		riskLevel: 'read',
		description: 'Search milestones by project or date range',
	},

	'events.list': {
		riskLevel: 'read',
		description: 'List company events with pagination and sorting',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get company event details by event ID',
	},
	'events.create': {
		riskLevel: 'write',
		description: 'Create a new company event',
	},
	'events.update': {
		riskLevel: 'write',
		description: 'Update an existing company event',
	},
	'events.delete': {
		riskLevel: 'destructive',
		description: 'Delete a company event by ID',
	},
	'events.search': {
		riskLevel: 'read',
		description: 'Search events by name or event code',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof hubplannerEndpointsNested
>;

export const hubplannerAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseHubPlannerPlugin<T extends HubPlannerPluginOptions> =
	CorsairPlugin<
		'hubplanner',
		typeof HubPlannerSchema,
		typeof hubplannerEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalHubPlannerPlugin =
	BaseHubPlannerPlugin<HubPlannerPluginOptions>;

export type ExternalHubPlannerPlugin<T extends HubPlannerPluginOptions> =
	BaseHubPlannerPlugin<T>;

export function hubplanner<const T extends HubPlannerPluginOptions>(
	incomingOptions: HubPlannerPluginOptions & T = {} as HubPlannerPluginOptions &
		T,
): ExternalHubPlannerPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'hubplanner',
		authConfig: hubplannerAuthConfig,
		schema: HubPlannerSchema,
		options,
		hooks: options.hooks,
		endpoints: hubplannerEndpointsNested,
		webhooks: {},
		endpointMeta: hubplannerEndpointMeta,
		endpointSchemas: hubplannerEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HubPlannerKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('hubplanner', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('hubplanner', 'api_key');
			return apiKey;
		},
	} satisfies InternalHubPlannerPlugin;
}

export type {
	Booking,
	BookingCategory,
	BookingsCreateInput,
	BookingsCreateResponse,
	BookingsDeleteBulkInput,
	BookingsDeleteBulkResponse,
	BookingsDeleteInput,
	BookingsDeleteResponse,
	BookingsGetInput,
	BookingsGetResponse,
	BookingsListInput,
	BookingsListResponse,
	BookingsPatchInput,
	BookingsPatchResponse,
	BookingsSearchInput,
	BookingsSearchResponse,
	BookingsUpdateInput,
	BookingsUpdateResponse,
	CategoriesCreateCostCategoryInput,
	CategoriesCreateCostCategoryResponse,
	CategoriesCreateInput,
	CategoriesCreateResponse,
	CategoriesDeleteCostCategoryInput,
	CategoriesDeleteCostCategoryResponse,
	CategoriesGetCostCategoryInput,
	CategoriesGetCostCategoryResponse,
	CategoriesGetInput,
	CategoriesGetResponse,
	CategoriesListCostCategoriesInput,
	CategoriesListCostCategoriesResponse,
	CategoriesListGroupsInput,
	CategoriesListGroupsResponse,
	CategoriesListInput,
	CategoriesListResponse,
	CategoriesSearchCostCategoriesInput,
	CategoriesSearchCostCategoriesResponse,
	CategoriesSearchInput,
	CategoriesSearchResponse,
	CategoriesUpdateCostCategoryInput,
	CategoriesUpdateCostCategoryResponse,
	CategoriesUpdateInput,
	CategoriesUpdateResponse,
	CategoryGroup,
	CostCategory,
	CustomFieldChoice,
	CustomFieldsAddChoicesInput,
	CustomFieldsAddChoicesResponse,
	CustomFieldsCreateInput,
	CustomFieldsCreateResponse,
	CustomFieldsDeleteInput,
	CustomFieldsDeleteResponse,
	CustomFieldsGetInput,
	CustomFieldsGetResponse,
	CustomFieldsListInput,
	CustomFieldsListResponse,
	CustomFieldsSearchInput,
	CustomFieldsSearchResponse,
	CustomFieldsUpdateInput,
	CustomFieldsUpdateResponse,
	CustomFieldTemplate,
	Event,
	EventsCreateInput,
	EventsCreateResponse,
	EventsDeleteInput,
	EventsDeleteResponse,
	EventsGetInput,
	EventsGetResponse,
	EventsListInput,
	EventsListResponse,
	EventsSearchInput,
	EventsSearchResponse,
	EventsUpdateInput,
	EventsUpdateResponse,
	HubPlannerEndpointInputs,
	HubPlannerEndpointOutputs,
	Milestone,
	MilestonesCreateInput,
	MilestonesCreateResponse,
	MilestonesDeleteInput,
	MilestonesDeleteResponse,
	MilestonesGetInput,
	MilestonesGetResponse,
	MilestonesListInput,
	MilestonesListResponse,
	MilestonesSearchInput,
	MilestonesSearchResponse,
	MilestonesUpdateInput,
	MilestonesUpdateResponse,
	Project,
	ProjectsAddClientsInput,
	ProjectsAddClientsResponse,
	ProjectsAddResourcesInput,
	ProjectsAddResourcesResponse,
	ProjectsAddTagsInput,
	ProjectsAddTagsResponse,
	ProjectsCreateInput,
	ProjectsCreateResponse,
	ProjectsDeleteBulkInput,
	ProjectsDeleteBulkResponse,
	ProjectsDeleteInput,
	ProjectsDeleteResponse,
	ProjectsGetInput,
	ProjectsGetResponse,
	ProjectsGetTagsInput,
	ProjectsGetTagsResponse,
	ProjectsListInput,
	ProjectsListResponse,
	ProjectsRemoveClientInput,
	ProjectsRemoveClientResponse,
	ProjectsRemoveResourceInput,
	ProjectsRemoveResourceResponse,
	ProjectsRemoveTagInput,
	ProjectsRemoveTagResponse,
	ProjectsSearchInput,
	ProjectsSearchResponse,
	ProjectsSetProjectManagersInput,
	ProjectsSetProjectManagersResponse,
	ProjectsUpdateInput,
	ProjectsUpdateResponse,
	Resource,
	ResourcesAddTagsInput,
	ResourcesAddTagsResponse,
	ResourcesCreateInput,
	ResourcesCreateResponse,
	ResourcesDeleteBulkInput,
	ResourcesDeleteBulkResponse,
	ResourcesDeleteInput,
	ResourcesDeleteResponse,
	ResourcesGetInput,
	ResourcesGetResponse,
	ResourcesGetTagsInput,
	ResourcesGetTagsResponse,
	ResourcesListInput,
	ResourcesListResponse,
	ResourcesRemoveTagInput,
	ResourcesRemoveTagResponse,
	ResourcesSearchInput,
	ResourcesSearchResponse,
	ResourcesUpdateInput,
	ResourcesUpdateResponse,
	SuccessResponse,
	Tag,
	TimeEntriesCreateInput,
	TimeEntriesCreateResponse,
	TimeEntriesDeleteBulkInput,
	TimeEntriesDeleteBulkResponse,
	TimeEntriesDeleteInput,
	TimeEntriesDeleteResponse,
	TimeEntriesGetInput,
	TimeEntriesGetResponse,
	TimeEntriesListInput,
	TimeEntriesListResponse,
	TimeEntriesSearchInput,
	TimeEntriesSearchResponse,
	TimeEntriesUpdateInput,
	TimeEntriesUpdateResponse,
	TimeEntry,
} from './endpoints/types';
