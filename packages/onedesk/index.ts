import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Attachments, Crm, Records } from './endpoints';
import type {
	OnedeskEndpointInputs,
	OnedeskEndpointOutputs,
} from './endpoints/types';
import {
	OnedeskEndpointInputSchemas,
	OnedeskEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { OnedeskSchema } from './schema';

export type OnedeskPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The organization's own origin, for a self-hosted or white-label
	 * installation. Defaults to https://app.onedesk.com.
	 */
	host?: string;
	hooks?: InternalOnedeskPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof onedeskEndpointsNested>;
};

export type OnedeskContext = CorsairPluginContext<
	typeof OnedeskSchema,
	OnedeskPluginOptions
>;

export type OnedeskKeyBuilderContext = KeyBuilderContext<OnedeskPluginOptions>;

export type OnedeskBoundEndpoints = BindEndpoints<
	typeof onedeskEndpointsNested
>;

type OnedeskEndpoint<K extends keyof OnedeskEndpointOutputs> = CorsairEndpoint<
	OnedeskContext,
	OnedeskEndpointInputs[K],
	OnedeskEndpointOutputs[K]
>;

export type OnedeskEndpoints = {
	itemsFilter: OnedeskEndpoint<'itemsFilter'>;
	itemsFilterDetails: OnedeskEndpoint<'itemsFilterDetails'>;
	itemsGet: OnedeskEndpoint<'itemsGet'>;
	itemsCreate: OnedeskEndpoint<'itemsCreate'>;
	itemsUpdate: OnedeskEndpoint<'itemsUpdate'>;
	usersFilter: OnedeskEndpoint<'usersFilter'>;
	usersFilterDetails: OnedeskEndpoint<'usersFilterDetails'>;
	usersGet: OnedeskEndpoint<'usersGet'>;
	usersCreate: OnedeskEndpoint<'usersCreate'>;
	usersUpdate: OnedeskEndpoint<'usersUpdate'>;
	projectsFilter: OnedeskEndpoint<'projectsFilter'>;
	projectsFilterDetails: OnedeskEndpoint<'projectsFilterDetails'>;
	projectsGet: OnedeskEndpoint<'projectsGet'>;
	projectsCreate: OnedeskEndpoint<'projectsCreate'>;
	projectsUpdate: OnedeskEndpoint<'projectsUpdate'>;
	portfoliosFilter: OnedeskEndpoint<'portfoliosFilter'>;
	portfoliosFilterDetails: OnedeskEndpoint<'portfoliosFilterDetails'>;
	portfoliosGet: OnedeskEndpoint<'portfoliosGet'>;
	portfoliosCreate: OnedeskEndpoint<'portfoliosCreate'>;
	portfoliosUpdate: OnedeskEndpoint<'portfoliosUpdate'>;
	teamsFilter: OnedeskEndpoint<'teamsFilter'>;
	teamsFilterDetails: OnedeskEndpoint<'teamsFilterDetails'>;
	teamsGet: OnedeskEndpoint<'teamsGet'>;
	teamsCreate: OnedeskEndpoint<'teamsCreate'>;
	teamsUpdate: OnedeskEndpoint<'teamsUpdate'>;
	customersFilter: OnedeskEndpoint<'customersFilter'>;
	customersFilterDetails: OnedeskEndpoint<'customersFilterDetails'>;
	customersGet: OnedeskEndpoint<'customersGet'>;
	customersCreate: OnedeskEndpoint<'customersCreate'>;
	customersUpdate: OnedeskEndpoint<'customersUpdate'>;
	organizationsFilter: OnedeskEndpoint<'organizationsFilter'>;
	organizationsFilterDetails: OnedeskEndpoint<'organizationsFilterDetails'>;
	organizationsGet: OnedeskEndpoint<'organizationsGet'>;
	organizationsCreate: OnedeskEndpoint<'organizationsCreate'>;
	organizationsUpdate: OnedeskEndpoint<'organizationsUpdate'>;
	timesheetsFilter: OnedeskEndpoint<'timesheetsFilter'>;
	timesheetsFilterDetails: OnedeskEndpoint<'timesheetsFilterDetails'>;
	timesheetsGet: OnedeskEndpoint<'timesheetsGet'>;
	timesheetsCreate: OnedeskEndpoint<'timesheetsCreate'>;
	timesheetsUpdate: OnedeskEndpoint<'timesheetsUpdate'>;
	timersFilter: OnedeskEndpoint<'timersFilter'>;
	timersFilterDetails: OnedeskEndpoint<'timersFilterDetails'>;
	timersGet: OnedeskEndpoint<'timersGet'>;
	timersStart: OnedeskEndpoint<'timersStart'>;
	timersPause: OnedeskEndpoint<'timersPause'>;
	timersResume: OnedeskEndpoint<'timersResume'>;
	timersCancel: OnedeskEndpoint<'timersCancel'>;
	invoicesFilter: OnedeskEndpoint<'invoicesFilter'>;
	invoicesFilterDetails: OnedeskEndpoint<'invoicesFilterDetails'>;
	invoicesGet: OnedeskEndpoint<'invoicesGet'>;
	invoicesUpdate: OnedeskEndpoint<'invoicesUpdate'>;
	quotesFilter: OnedeskEndpoint<'quotesFilter'>;
	quotesFilterDetails: OnedeskEndpoint<'quotesFilterDetails'>;
	quotesGet: OnedeskEndpoint<'quotesGet'>;
	quotesUpdate: OnedeskEndpoint<'quotesUpdate'>;
	conversationsFilter: OnedeskEndpoint<'conversationsFilter'>;
	conversationsFilterDetails: OnedeskEndpoint<'conversationsFilterDetails'>;
	conversationsGet: OnedeskEndpoint<'conversationsGet'>;
	conversationsCreate: OnedeskEndpoint<'conversationsCreate'>;
	conversationsUpdate: OnedeskEndpoint<'conversationsUpdate'>;
	messagesFilter: OnedeskEndpoint<'messagesFilter'>;
	messagesFilterDetails: OnedeskEndpoint<'messagesFilterDetails'>;
	messagesGet: OnedeskEndpoint<'messagesGet'>;
	messagesCreate: OnedeskEndpoint<'messagesCreate'>;
	messagesUpdate: OnedeskEndpoint<'messagesUpdate'>;
	activitiesFilterDetails: OnedeskEndpoint<'activitiesFilterDetails'>;
	attachmentsFilter: OnedeskEndpoint<'attachmentsFilter'>;
	attachmentsFilterDetails: OnedeskEndpoint<'attachmentsFilterDetails'>;
	attachmentsGet: OnedeskEndpoint<'attachmentsGet'>;
	attachmentsUpload: OnedeskEndpoint<'attachmentsUpload'>;
	attachmentsAttachToItem: OnedeskEndpoint<'attachmentsAttachToItem'>;
	attachmentsAttachToProject: OnedeskEndpoint<'attachmentsAttachToProject'>;
	attachmentsAttachToPortfolio: OnedeskEndpoint<'attachmentsAttachToPortfolio'>;
	attachmentsAttachToOrganization: OnedeskEndpoint<'attachmentsAttachToOrganization'>;
	organizationItemTypes: OnedeskEndpoint<'organizationItemTypes'>;
	organizationContainerTypes: OnedeskEndpoint<'organizationContainerTypes'>;
	organizationUserTypes: OnedeskEndpoint<'organizationUserTypes'>;
	organizationLifecycleStatus: OnedeskEndpoint<'organizationLifecycleStatus'>;
	organizationProfile: OnedeskEndpoint<'organizationProfile'>;
};

const onedeskEndpointsNested = {
	items: {
		filter: Records.itemsFilter,
		filterDetails: Records.itemsFilterDetails,
		get: Records.itemsGet,
		create: Records.itemsCreate,
		update: Records.itemsUpdate,
	},
	users: {
		filter: Records.usersFilter,
		filterDetails: Records.usersFilterDetails,
		get: Records.usersGet,
		create: Records.usersCreate,
		update: Records.usersUpdate,
	},
	projects: {
		filter: Records.projectsFilter,
		filterDetails: Records.projectsFilterDetails,
		get: Records.projectsGet,
		create: Records.projectsCreate,
		update: Records.projectsUpdate,
	},
	portfolios: {
		filter: Records.portfoliosFilter,
		filterDetails: Records.portfoliosFilterDetails,
		get: Records.portfoliosGet,
		create: Records.portfoliosCreate,
		update: Records.portfoliosUpdate,
	},
	teams: {
		filter: Records.teamsFilter,
		filterDetails: Records.teamsFilterDetails,
		get: Records.teamsGet,
		create: Records.teamsCreate,
		update: Records.teamsUpdate,
	},
	invoices: {
		filter: Records.invoicesFilter,
		filterDetails: Records.invoicesFilterDetails,
		get: Records.invoicesGet,
		update: Records.invoicesUpdate,
	},
	quotes: {
		filter: Records.quotesFilter,
		filterDetails: Records.quotesFilterDetails,
		get: Records.quotesGet,
		update: Records.quotesUpdate,
	},
	customers: {
		filter: Crm.customersFilter,
		filterDetails: Crm.customersFilterDetails,
		get: Crm.customersGet,
		create: Crm.customersCreate,
		update: Crm.customersUpdate,
	},
	organizations: {
		filter: Crm.organizationsFilter,
		filterDetails: Crm.organizationsFilterDetails,
		get: Crm.organizationsGet,
		create: Crm.organizationsCreate,
		update: Crm.organizationsUpdate,
	},
	timesheets: {
		filter: Crm.timesheetsFilter,
		filterDetails: Crm.timesheetsFilterDetails,
		get: Crm.timesheetsGet,
		create: Crm.timesheetsCreate,
		update: Crm.timesheetsUpdate,
	},
	timers: {
		filter: Crm.timersFilter,
		filterDetails: Crm.timersFilterDetails,
		get: Crm.timersGet,
		start: Crm.timersStart,
		pause: Crm.timersPause,
		resume: Crm.timersResume,
		cancel: Crm.timersCancel,
	},
	conversations: {
		filter: Crm.conversationsFilter,
		filterDetails: Crm.conversationsFilterDetails,
		get: Crm.conversationsGet,
		create: Crm.conversationsCreate,
		update: Crm.conversationsUpdate,
	},
	messages: {
		filter: Crm.messagesFilter,
		filterDetails: Crm.messagesFilterDetails,
		get: Crm.messagesGet,
		create: Crm.messagesCreate,
		update: Crm.messagesUpdate,
	},
	activities: {
		filterDetails: Crm.activitiesFilterDetails,
	},
	attachments: {
		filter: Attachments.attachmentsFilter,
		filterDetails: Attachments.attachmentsFilterDetails,
		get: Attachments.attachmentsGet,
		upload: Attachments.attachmentsUpload,
		attachToItem: Attachments.attachmentsAttachToItem,
		attachToProject: Attachments.attachmentsAttachToProject,
		attachToPortfolio: Attachments.attachmentsAttachToPortfolio,
		attachToOrganization: Attachments.attachmentsAttachToOrganization,
	},
	organization: {
		itemTypes: Crm.organizationItemTypes,
		containerTypes: Crm.organizationContainerTypes,
		userTypes: Crm.organizationUserTypes,
		lifecycleStatus: Crm.organizationLifecycleStatus,
		profile: Crm.organizationProfile,
	},
} as const;

export const onedeskEndpointSchemas = {
	'items.filter': {
		input: OnedeskEndpointInputSchemas.itemsFilter,
		output: OnedeskEndpointOutputSchemas.itemsFilter,
	},
	'items.filterDetails': {
		input: OnedeskEndpointInputSchemas.itemsFilterDetails,
		output: OnedeskEndpointOutputSchemas.itemsFilterDetails,
	},
	'items.get': {
		input: OnedeskEndpointInputSchemas.itemsGet,
		output: OnedeskEndpointOutputSchemas.itemsGet,
	},
	'items.create': {
		input: OnedeskEndpointInputSchemas.itemsCreate,
		output: OnedeskEndpointOutputSchemas.itemsCreate,
	},
	'items.update': {
		input: OnedeskEndpointInputSchemas.itemsUpdate,
		output: OnedeskEndpointOutputSchemas.itemsUpdate,
	},
	'users.filter': {
		input: OnedeskEndpointInputSchemas.usersFilter,
		output: OnedeskEndpointOutputSchemas.usersFilter,
	},
	'users.filterDetails': {
		input: OnedeskEndpointInputSchemas.usersFilterDetails,
		output: OnedeskEndpointOutputSchemas.usersFilterDetails,
	},
	'users.get': {
		input: OnedeskEndpointInputSchemas.usersGet,
		output: OnedeskEndpointOutputSchemas.usersGet,
	},
	'users.create': {
		input: OnedeskEndpointInputSchemas.usersCreate,
		output: OnedeskEndpointOutputSchemas.usersCreate,
	},
	'users.update': {
		input: OnedeskEndpointInputSchemas.usersUpdate,
		output: OnedeskEndpointOutputSchemas.usersUpdate,
	},
	'projects.filter': {
		input: OnedeskEndpointInputSchemas.projectsFilter,
		output: OnedeskEndpointOutputSchemas.projectsFilter,
	},
	'projects.filterDetails': {
		input: OnedeskEndpointInputSchemas.projectsFilterDetails,
		output: OnedeskEndpointOutputSchemas.projectsFilterDetails,
	},
	'projects.get': {
		input: OnedeskEndpointInputSchemas.projectsGet,
		output: OnedeskEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: OnedeskEndpointInputSchemas.projectsCreate,
		output: OnedeskEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: OnedeskEndpointInputSchemas.projectsUpdate,
		output: OnedeskEndpointOutputSchemas.projectsUpdate,
	},
	'portfolios.filter': {
		input: OnedeskEndpointInputSchemas.portfoliosFilter,
		output: OnedeskEndpointOutputSchemas.portfoliosFilter,
	},
	'portfolios.filterDetails': {
		input: OnedeskEndpointInputSchemas.portfoliosFilterDetails,
		output: OnedeskEndpointOutputSchemas.portfoliosFilterDetails,
	},
	'portfolios.get': {
		input: OnedeskEndpointInputSchemas.portfoliosGet,
		output: OnedeskEndpointOutputSchemas.portfoliosGet,
	},
	'portfolios.create': {
		input: OnedeskEndpointInputSchemas.portfoliosCreate,
		output: OnedeskEndpointOutputSchemas.portfoliosCreate,
	},
	'portfolios.update': {
		input: OnedeskEndpointInputSchemas.portfoliosUpdate,
		output: OnedeskEndpointOutputSchemas.portfoliosUpdate,
	},
	'teams.filter': {
		input: OnedeskEndpointInputSchemas.teamsFilter,
		output: OnedeskEndpointOutputSchemas.teamsFilter,
	},
	'teams.filterDetails': {
		input: OnedeskEndpointInputSchemas.teamsFilterDetails,
		output: OnedeskEndpointOutputSchemas.teamsFilterDetails,
	},
	'teams.get': {
		input: OnedeskEndpointInputSchemas.teamsGet,
		output: OnedeskEndpointOutputSchemas.teamsGet,
	},
	'teams.create': {
		input: OnedeskEndpointInputSchemas.teamsCreate,
		output: OnedeskEndpointOutputSchemas.teamsCreate,
	},
	'teams.update': {
		input: OnedeskEndpointInputSchemas.teamsUpdate,
		output: OnedeskEndpointOutputSchemas.teamsUpdate,
	},
	'customers.filter': {
		input: OnedeskEndpointInputSchemas.customersFilter,
		output: OnedeskEndpointOutputSchemas.customersFilter,
	},
	'customers.filterDetails': {
		input: OnedeskEndpointInputSchemas.customersFilterDetails,
		output: OnedeskEndpointOutputSchemas.customersFilterDetails,
	},
	'customers.get': {
		input: OnedeskEndpointInputSchemas.customersGet,
		output: OnedeskEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: OnedeskEndpointInputSchemas.customersCreate,
		output: OnedeskEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: OnedeskEndpointInputSchemas.customersUpdate,
		output: OnedeskEndpointOutputSchemas.customersUpdate,
	},
	'organizations.filter': {
		input: OnedeskEndpointInputSchemas.organizationsFilter,
		output: OnedeskEndpointOutputSchemas.organizationsFilter,
	},
	'organizations.filterDetails': {
		input: OnedeskEndpointInputSchemas.organizationsFilterDetails,
		output: OnedeskEndpointOutputSchemas.organizationsFilterDetails,
	},
	'organizations.get': {
		input: OnedeskEndpointInputSchemas.organizationsGet,
		output: OnedeskEndpointOutputSchemas.organizationsGet,
	},
	'organizations.create': {
		input: OnedeskEndpointInputSchemas.organizationsCreate,
		output: OnedeskEndpointOutputSchemas.organizationsCreate,
	},
	'organizations.update': {
		input: OnedeskEndpointInputSchemas.organizationsUpdate,
		output: OnedeskEndpointOutputSchemas.organizationsUpdate,
	},
	'timesheets.filter': {
		input: OnedeskEndpointInputSchemas.timesheetsFilter,
		output: OnedeskEndpointOutputSchemas.timesheetsFilter,
	},
	'timesheets.filterDetails': {
		input: OnedeskEndpointInputSchemas.timesheetsFilterDetails,
		output: OnedeskEndpointOutputSchemas.timesheetsFilterDetails,
	},
	'timesheets.get': {
		input: OnedeskEndpointInputSchemas.timesheetsGet,
		output: OnedeskEndpointOutputSchemas.timesheetsGet,
	},
	'timesheets.create': {
		input: OnedeskEndpointInputSchemas.timesheetsCreate,
		output: OnedeskEndpointOutputSchemas.timesheetsCreate,
	},
	'timesheets.update': {
		input: OnedeskEndpointInputSchemas.timesheetsUpdate,
		output: OnedeskEndpointOutputSchemas.timesheetsUpdate,
	},
	'timers.filter': {
		input: OnedeskEndpointInputSchemas.timersFilter,
		output: OnedeskEndpointOutputSchemas.timersFilter,
	},
	'timers.filterDetails': {
		input: OnedeskEndpointInputSchemas.timersFilterDetails,
		output: OnedeskEndpointOutputSchemas.timersFilterDetails,
	},
	'timers.get': {
		input: OnedeskEndpointInputSchemas.timersGet,
		output: OnedeskEndpointOutputSchemas.timersGet,
	},
	'timers.start': {
		input: OnedeskEndpointInputSchemas.timersStart,
		output: OnedeskEndpointOutputSchemas.timersStart,
	},
	'timers.pause': {
		input: OnedeskEndpointInputSchemas.timersPause,
		output: OnedeskEndpointOutputSchemas.timersPause,
	},
	'timers.resume': {
		input: OnedeskEndpointInputSchemas.timersResume,
		output: OnedeskEndpointOutputSchemas.timersResume,
	},
	'timers.cancel': {
		input: OnedeskEndpointInputSchemas.timersCancel,
		output: OnedeskEndpointOutputSchemas.timersCancel,
	},
	'invoices.filter': {
		input: OnedeskEndpointInputSchemas.invoicesFilter,
		output: OnedeskEndpointOutputSchemas.invoicesFilter,
	},
	'invoices.filterDetails': {
		input: OnedeskEndpointInputSchemas.invoicesFilterDetails,
		output: OnedeskEndpointOutputSchemas.invoicesFilterDetails,
	},
	'invoices.get': {
		input: OnedeskEndpointInputSchemas.invoicesGet,
		output: OnedeskEndpointOutputSchemas.invoicesGet,
	},
	'invoices.update': {
		input: OnedeskEndpointInputSchemas.invoicesUpdate,
		output: OnedeskEndpointOutputSchemas.invoicesUpdate,
	},
	'quotes.filter': {
		input: OnedeskEndpointInputSchemas.quotesFilter,
		output: OnedeskEndpointOutputSchemas.quotesFilter,
	},
	'quotes.filterDetails': {
		input: OnedeskEndpointInputSchemas.quotesFilterDetails,
		output: OnedeskEndpointOutputSchemas.quotesFilterDetails,
	},
	'quotes.get': {
		input: OnedeskEndpointInputSchemas.quotesGet,
		output: OnedeskEndpointOutputSchemas.quotesGet,
	},
	'quotes.update': {
		input: OnedeskEndpointInputSchemas.quotesUpdate,
		output: OnedeskEndpointOutputSchemas.quotesUpdate,
	},
	'conversations.filter': {
		input: OnedeskEndpointInputSchemas.conversationsFilter,
		output: OnedeskEndpointOutputSchemas.conversationsFilter,
	},
	'conversations.filterDetails': {
		input: OnedeskEndpointInputSchemas.conversationsFilterDetails,
		output: OnedeskEndpointOutputSchemas.conversationsFilterDetails,
	},
	'conversations.get': {
		input: OnedeskEndpointInputSchemas.conversationsGet,
		output: OnedeskEndpointOutputSchemas.conversationsGet,
	},
	'conversations.create': {
		input: OnedeskEndpointInputSchemas.conversationsCreate,
		output: OnedeskEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.update': {
		input: OnedeskEndpointInputSchemas.conversationsUpdate,
		output: OnedeskEndpointOutputSchemas.conversationsUpdate,
	},
	'messages.filter': {
		input: OnedeskEndpointInputSchemas.messagesFilter,
		output: OnedeskEndpointOutputSchemas.messagesFilter,
	},
	'messages.filterDetails': {
		input: OnedeskEndpointInputSchemas.messagesFilterDetails,
		output: OnedeskEndpointOutputSchemas.messagesFilterDetails,
	},
	'messages.get': {
		input: OnedeskEndpointInputSchemas.messagesGet,
		output: OnedeskEndpointOutputSchemas.messagesGet,
	},
	'messages.create': {
		input: OnedeskEndpointInputSchemas.messagesCreate,
		output: OnedeskEndpointOutputSchemas.messagesCreate,
	},
	'messages.update': {
		input: OnedeskEndpointInputSchemas.messagesUpdate,
		output: OnedeskEndpointOutputSchemas.messagesUpdate,
	},
	'activities.filterDetails': {
		input: OnedeskEndpointInputSchemas.activitiesFilterDetails,
		output: OnedeskEndpointOutputSchemas.activitiesFilterDetails,
	},
	'attachments.filter': {
		input: OnedeskEndpointInputSchemas.attachmentsFilter,
		output: OnedeskEndpointOutputSchemas.attachmentsFilter,
	},
	'attachments.filterDetails': {
		input: OnedeskEndpointInputSchemas.attachmentsFilterDetails,
		output: OnedeskEndpointOutputSchemas.attachmentsFilterDetails,
	},
	'attachments.get': {
		input: OnedeskEndpointInputSchemas.attachmentsGet,
		output: OnedeskEndpointOutputSchemas.attachmentsGet,
	},
	'attachments.upload': {
		input: OnedeskEndpointInputSchemas.attachmentsUpload,
		output: OnedeskEndpointOutputSchemas.attachmentsUpload,
	},
	'attachments.attachToItem': {
		input: OnedeskEndpointInputSchemas.attachmentsAttachToItem,
		output: OnedeskEndpointOutputSchemas.attachmentsAttachToItem,
	},
	'attachments.attachToProject': {
		input: OnedeskEndpointInputSchemas.attachmentsAttachToProject,
		output: OnedeskEndpointOutputSchemas.attachmentsAttachToProject,
	},
	'attachments.attachToPortfolio': {
		input: OnedeskEndpointInputSchemas.attachmentsAttachToPortfolio,
		output: OnedeskEndpointOutputSchemas.attachmentsAttachToPortfolio,
	},
	'attachments.attachToOrganization': {
		input: OnedeskEndpointInputSchemas.attachmentsAttachToOrganization,
		output: OnedeskEndpointOutputSchemas.attachmentsAttachToOrganization,
	},
	'organization.itemTypes': {
		input: OnedeskEndpointInputSchemas.organizationItemTypes,
		output: OnedeskEndpointOutputSchemas.organizationItemTypes,
	},
	'organization.containerTypes': {
		input: OnedeskEndpointInputSchemas.organizationContainerTypes,
		output: OnedeskEndpointOutputSchemas.organizationContainerTypes,
	},
	'organization.userTypes': {
		input: OnedeskEndpointInputSchemas.organizationUserTypes,
		output: OnedeskEndpointOutputSchemas.organizationUserTypes,
	},
	'organization.lifecycleStatus': {
		input: OnedeskEndpointInputSchemas.organizationLifecycleStatus,
		output: OnedeskEndpointOutputSchemas.organizationLifecycleStatus,
	},
	'organization.profile': {
		input: OnedeskEndpointInputSchemas.organizationProfile,
		output: OnedeskEndpointOutputSchemas.organizationProfile,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof onedeskEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const onedeskEndpointMeta = {
	'items.filter': {
		riskLevel: 'read',
		description:
			'List work item external ids by type and filter, with paging and a total count',
	},
	'items.filterDetails': {
		riskLevel: 'read',
		description:
			'List work items with their details by type and filter, including assignees and lifecycle status',
	},
	'items.get': {
		riskLevel: 'read',
		description: 'Read one work item by external id or numeric id',
	},
	'items.create': {
		riskLevel: 'write',
		description:
			'Create a work item such as a ticket or task, optionally with requesters, followers, a project and custom fields',
	},
	'items.update': {
		riskLevel: 'write',
		description:
			'Change a work item: name, status, assignment, priority, dates, links and custom fields',
	},
	'users.filter': {
		riskLevel: 'read',
		description: 'List user external ids by filter',
	},
	'users.filterDetails': {
		riskLevel: 'read',
		description: 'List users with their profile, address and teams',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user by external id or numeric id',
	},
	'users.create': {
		riskLevel: 'write',
		description: 'Create a user, which sends them an invitation to the account',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Change a user profile, teams or custom fields',
	},
	'projects.filter': {
		riskLevel: 'read',
		description: 'List project external ids by filter',
	},
	'projects.filterDetails': {
		riskLevel: 'read',
		description: 'List projects with their lifecycle status and invoice type',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project by external id or numeric id',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project, optionally under portfolios',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Change a project: name, lifecycle status, portfolios and custom fields',
	},
	'portfolios.filter': {
		riskLevel: 'read',
		description: 'List portfolio external ids by filter',
	},
	'portfolios.filterDetails': {
		riskLevel: 'read',
		description: 'List portfolios with their details',
	},
	'portfolios.get': {
		riskLevel: 'read',
		description: 'Read one portfolio by external id',
	},
	'portfolios.create': {
		riskLevel: 'write',
		description: 'Create a portfolio, optionally nested under others',
	},
	'portfolios.update': {
		riskLevel: 'write',
		description: 'Change a portfolio name, parents or attachments',
	},
	'teams.filter': {
		riskLevel: 'read',
		description: 'List team external ids by filter',
	},
	'teams.filterDetails': {
		riskLevel: 'read',
		description: 'List teams with their members',
	},
	'teams.get': {
		riskLevel: 'read',
		description: 'Read one team by external id',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a team with an initial set of members',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Rename a team or change its members',
	},
	'customers.filter': {
		riskLevel: 'read',
		description: 'List customer external ids by filter',
	},
	'customers.filterDetails': {
		riskLevel: 'read',
		description: 'List customers with their contact details and organization',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer by external id or numeric id',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a customer, optionally inside a customer organization',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Change a customer, including deactivating them so they can no longer sign in',
	},
	'organizations.filter': {
		riskLevel: 'read',
		description: 'List customer organization external ids by filter',
	},
	'organizations.filterDetails': {
		riskLevel: 'read',
		description: 'List customer organizations with their domains and customers',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Read one customer organization by external id',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create a customer organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Change a customer organization, its domains or its customers',
	},
	'timesheets.filter': {
		riskLevel: 'read',
		description: 'List timesheet external ids by filter',
	},
	'timesheets.filterDetails': {
		riskLevel: 'read',
		description: 'List timesheets with their hours, dates and approval status',
	},
	'timesheets.get': {
		riskLevel: 'read',
		description: 'Read one timesheet by external id or numeric id',
	},
	'timesheets.create': {
		riskLevel: 'write',
		description: 'Book work against a work item for a user',
	},
	'timesheets.update': {
		riskLevel: 'write',
		description:
			'Change a timesheet, including approving or declining it and marking it billable',
	},
	'timers.filter': {
		riskLevel: 'read',
		description: 'List timer external ids by filter',
	},
	'timers.filterDetails': {
		riskLevel: 'read',
		description: 'List timers with their status and accumulated work',
	},
	'timers.get': {
		riskLevel: 'read',
		description: 'Read one timer by external id',
	},
	'timers.start': {
		riskLevel: 'write',
		description: 'Start a work timer on a work item',
	},
	'timers.pause': {
		riskLevel: 'write',
		description: 'Pause a running work timer',
	},
	'timers.resume': {
		riskLevel: 'write',
		description: 'Resume a paused work timer',
	},
	'timers.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel a work timer, discarding the work recorded in that run',
	},
	'invoices.filter': {
		riskLevel: 'read',
		description: 'List invoice external ids by filter',
	},
	'invoices.filterDetails': {
		riskLevel: 'read',
		description: 'List invoices with their status and totals',
	},
	'invoices.get': {
		riskLevel: 'read',
		description: 'Read one invoice by external id or numeric id',
	},
	'invoices.update': {
		// Setting status to 'void' cannot be undone, and the operation accepts
		// that value, so it is classified by its worst case rather than its
		// common one.
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Change an invoice: its status, due date and line items. Setting the status to 'void' cannot be undone",
	},
	'quotes.filter': {
		riskLevel: 'read',
		description: 'List quote external ids by filter',
	},
	'quotes.filterDetails': {
		riskLevel: 'read',
		description: 'List quotes with their status and totals',
	},
	'quotes.get': {
		riskLevel: 'read',
		description: 'Read one quote by external id or numeric id',
	},
	'quotes.update': {
		riskLevel: 'write',
		description: 'Change a quote: its status, expiration date and line items',
	},
	'conversations.filter': {
		riskLevel: 'read',
		description: 'List conversation external ids by filter',
	},
	'conversations.filterDetails': {
		riskLevel: 'read',
		description: 'List conversations with their open and lock state',
	},
	'conversations.get': {
		riskLevel: 'read',
		description: 'Read one conversation by external id',
	},
	'conversations.create': {
		riskLevel: 'write',
		description:
			'Open a conversation on a work item or project, optionally with its first messages',
	},
	'conversations.update': {
		riskLevel: 'write',
		description: 'Close, reopen or lock a conversation',
	},
	'messages.filter': {
		riskLevel: 'read',
		description: 'List conversation message external ids by filter',
	},
	'messages.filterDetails': {
		riskLevel: 'read',
		description: 'List conversation messages with their content and author',
	},
	'messages.get': {
		riskLevel: 'read',
		description: 'Read one conversation message by external id',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Post a message into a conversation',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Change a message body or its attachments',
	},
	'activities.filterDetails': {
		riskLevel: 'read',
		description: 'List activity log entries by filter',
	},
	'attachments.filter': {
		riskLevel: 'read',
		description: 'List attachment external ids by filter',
	},
	'attachments.filterDetails': {
		riskLevel: 'read',
		description: 'List attachments with their names',
	},
	'attachments.get': {
		riskLevel: 'read',
		description: 'Read one attachment record by external id',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description:
			'Upload a file to the account and get its external id for attaching later',
	},
	'attachments.attachToItem': {
		riskLevel: 'write',
		description: 'Upload a file and attach it to a work item',
	},
	'attachments.attachToProject': {
		riskLevel: 'write',
		description: 'Upload a file and attach it to a project',
	},
	'attachments.attachToPortfolio': {
		riskLevel: 'write',
		description: 'Upload a file and attach it to a portfolio',
	},
	'attachments.attachToOrganization': {
		riskLevel: 'write',
		description: 'Upload a file and attach it to a customer organization',
	},
	'organization.itemTypes': {
		riskLevel: 'read',
		description:
			'List the organization work item type names that create and filter calls require',
	},
	'organization.containerTypes': {
		riskLevel: 'read',
		description: 'List the organization container type names',
	},
	'organization.userTypes': {
		riskLevel: 'read',
		description:
			'List the organization user type names that user create calls accept',
	},
	'organization.lifecycleStatus': {
		riskLevel: 'read',
		description:
			'List the lifecycle status names an item or project can be moved to',
	},
	'organization.profile': {
		riskLevel: 'read',
		description: 'Read the organization profile and its policy settings',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof onedeskEndpointsNested>;

export type BaseOnedeskPlugin<T extends OnedeskPluginOptions> = CorsairPlugin<
	'onedesk',
	typeof OnedeskSchema,
	typeof onedeskEndpointsNested,
	// OneDesk can post updates to a configured URL; it signs nothing this
	// plugin could verify, so the inbound surface stays closed.
	{},
	T,
	typeof defaultAuthType
>;

export type InternalOnedeskPlugin = BaseOnedeskPlugin<OnedeskPluginOptions>;

export type ExternalOnedeskPlugin<T extends OnedeskPluginOptions> =
	BaseOnedeskPlugin<T>;

export function onedesk<const T extends OnedeskPluginOptions>(
	incomingOptions: OnedeskPluginOptions & T = {} as OnedeskPluginOptions & T,
): ExternalOnedeskPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'onedesk',
		schema: OnedeskSchema,
		options: options,
		hooks: options.hooks,
		endpoints: onedeskEndpointsNested,
		webhooks: {},
		endpointMeta: onedeskEndpointMeta,
		endpointSchemas: onedeskEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: OnedeskKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('onedesk', ctx.authType ?? 'api_key');
		},
	} satisfies InternalOnedeskPlugin;
}

export { OnedeskAPIError, OnedeskTransportError } from './client';

export type {
	OnedeskActivity,
	OnedeskAttachment,
	OnedeskConversation,
	OnedeskConversationMessage,
	OnedeskCustomer,
	OnedeskCustomerOrganization,
	OnedeskEndpointInputs,
	OnedeskEndpointOutputs,
	OnedeskInvoice,
	OnedeskItem,
	OnedeskPortfolio,
	OnedeskProject,
	OnedeskQuote,
	OnedeskTeam,
	OnedeskTimer,
	OnedeskTimesheet,
	OnedeskUser,
} from './endpoints/types';
