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
	activityTypesGet,
	activityTypesList,
	activityTypesListIcons,
	attachmentsGet,
	attachmentsUpload,
	boardsDelete,
	boardsGet,
	boardsList,
	boardsListStages,
	boardsRestore,
	boardsUpdate,
	categoriesCreate,
	categoriesDelete,
	categoriesGet,
	categoriesList,
	categoriesUpdate,
	countriesList,
	currenciesList,
	customFieldsCreate,
	customFieldsDelete,
	customFieldsGet,
	customFieldsList,
	customFieldsUpdate,
	entriesCreate,
	entriesDelete,
	entriesGet,
	entriesListByDate,
	entriesListForEntity,
	entriesUpdate,
	filtersRun,
	goalsList,
	lostReasonsCreate,
	lostReasonsDelete,
	lostReasonsGet,
	lostReasonsList,
	lostReasonsUpdate,
	milestonesCreate,
	milestonesDelete,
	milestonesGet,
	milestonesList,
	milestonesUpdate,
	opportunitiesAddParty,
	opportunitiesCreate,
	opportunitiesDelete,
	opportunitiesDeleteParty,
	opportunitiesGet,
	opportunitiesList,
	opportunitiesListDeleted,
	opportunitiesListParties,
	opportunitiesListProjects,
	opportunitiesSearch,
	opportunitiesUpdate,
	partiesCreate,
	partiesDelete,
	partiesGet,
	partiesList,
	partiesListDeleted,
	partiesListEmployees,
	partiesListOpportunities,
	partiesListProjects,
	partiesSearch,
	partiesUpdate,
	pipelinesGet,
	pipelinesList,
	pipelinesListMilestones,
	pipelinesUpdate,
	projectsAddParty,
	projectsCreate,
	projectsDelete,
	projectsDeleteParty,
	projectsGet,
	projectsList,
	projectsListDeleted,
	projectsListParties,
	projectsSearch,
	projectsUpdate,
	restHooksList,
	siteGet,
	stagesCreate,
	stagesDelete,
	stagesGet,
	stagesList,
	stagesUpdate,
	tagsDelete,
	tagsGet,
	tagsList,
	tagsUpdate,
	tasksCreate,
	tasksDelete,
	tasksGet,
	tasksList,
	tasksUpdate,
	teamsList,
	titlesCreate,
	titlesDelete,
	titlesList,
	trackDefinitionsCreate,
	trackDefinitionsDelete,
	trackDefinitionsGet,
	trackDefinitionsList,
	trackDefinitionsUpdate,
	tracksCreate,
	tracksDelete,
	tracksGet,
	tracksListForEntity,
	tracksUpdate,
	usersGet,
	usersGetCurrent,
	usersList,
	usersUpdate,
} from './endpoints';
import type {
	CapsuleCrmEndpointInputs,
	CapsuleCrmEndpointOutputs,
} from './endpoints/types';
import {
	CapsuleCrmEndpointInputSchemas,
	CapsuleCrmEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CapsuleCrmSchema } from './schema';

export type CapsuleCrmPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalCapsuleCrmPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof capsuleCrmEndpointsNested>;
};

export type CapsuleCrmContext = CorsairPluginContext<
	typeof CapsuleCrmSchema,
	CapsuleCrmPluginOptions
>;

export type CapsuleCrmKeyBuilderContext =
	KeyBuilderContext<CapsuleCrmPluginOptions>;

export type CapsuleCrmBoundEndpoints = BindEndpoints<
	typeof capsuleCrmEndpointsNested
>;

type CapsuleCrmEndpoint<K extends keyof CapsuleCrmEndpointOutputs> =
	CorsairEndpoint<
		CapsuleCrmContext,
		CapsuleCrmEndpointInputs[K],
		CapsuleCrmEndpointOutputs[K]
	>;

export type CapsuleCrmEndpoints = {
	partiesList: CapsuleCrmEndpoint<'partiesList'>;
	partiesGet: CapsuleCrmEndpoint<'partiesGet'>;
	partiesCreate: CapsuleCrmEndpoint<'partiesCreate'>;
	partiesUpdate: CapsuleCrmEndpoint<'partiesUpdate'>;
	partiesDelete: CapsuleCrmEndpoint<'partiesDelete'>;
	partiesSearch: CapsuleCrmEndpoint<'partiesSearch'>;
	partiesListDeleted: CapsuleCrmEndpoint<'partiesListDeleted'>;
	partiesListEmployees: CapsuleCrmEndpoint<'partiesListEmployees'>;
	partiesListOpportunities: CapsuleCrmEndpoint<'partiesListOpportunities'>;
	partiesListProjects: CapsuleCrmEndpoint<'partiesListProjects'>;
	opportunitiesList: CapsuleCrmEndpoint<'opportunitiesList'>;
	opportunitiesGet: CapsuleCrmEndpoint<'opportunitiesGet'>;
	opportunitiesCreate: CapsuleCrmEndpoint<'opportunitiesCreate'>;
	opportunitiesUpdate: CapsuleCrmEndpoint<'opportunitiesUpdate'>;
	opportunitiesDelete: CapsuleCrmEndpoint<'opportunitiesDelete'>;
	opportunitiesSearch: CapsuleCrmEndpoint<'opportunitiesSearch'>;
	opportunitiesListDeleted: CapsuleCrmEndpoint<'opportunitiesListDeleted'>;
	opportunitiesListParties: CapsuleCrmEndpoint<'opportunitiesListParties'>;
	opportunitiesAddParty: CapsuleCrmEndpoint<'opportunitiesAddParty'>;
	opportunitiesDeleteParty: CapsuleCrmEndpoint<'opportunitiesDeleteParty'>;
	opportunitiesListProjects: CapsuleCrmEndpoint<'opportunitiesListProjects'>;
	projectsList: CapsuleCrmEndpoint<'projectsList'>;
	projectsGet: CapsuleCrmEndpoint<'projectsGet'>;
	projectsCreate: CapsuleCrmEndpoint<'projectsCreate'>;
	projectsUpdate: CapsuleCrmEndpoint<'projectsUpdate'>;
	projectsDelete: CapsuleCrmEndpoint<'projectsDelete'>;
	projectsSearch: CapsuleCrmEndpoint<'projectsSearch'>;
	projectsListDeleted: CapsuleCrmEndpoint<'projectsListDeleted'>;
	projectsListParties: CapsuleCrmEndpoint<'projectsListParties'>;
	projectsAddParty: CapsuleCrmEndpoint<'projectsAddParty'>;
	projectsDeleteParty: CapsuleCrmEndpoint<'projectsDeleteParty'>;
	tasksList: CapsuleCrmEndpoint<'tasksList'>;
	tasksGet: CapsuleCrmEndpoint<'tasksGet'>;
	tasksCreate: CapsuleCrmEndpoint<'tasksCreate'>;
	tasksUpdate: CapsuleCrmEndpoint<'tasksUpdate'>;
	tasksDelete: CapsuleCrmEndpoint<'tasksDelete'>;
	entriesListByDate: CapsuleCrmEndpoint<'entriesListByDate'>;
	entriesListForEntity: CapsuleCrmEndpoint<'entriesListForEntity'>;
	entriesGet: CapsuleCrmEndpoint<'entriesGet'>;
	entriesCreate: CapsuleCrmEndpoint<'entriesCreate'>;
	entriesUpdate: CapsuleCrmEndpoint<'entriesUpdate'>;
	entriesDelete: CapsuleCrmEndpoint<'entriesDelete'>;
	categoriesList: CapsuleCrmEndpoint<'categoriesList'>;
	categoriesGet: CapsuleCrmEndpoint<'categoriesGet'>;
	categoriesCreate: CapsuleCrmEndpoint<'categoriesCreate'>;
	categoriesUpdate: CapsuleCrmEndpoint<'categoriesUpdate'>;
	categoriesDelete: CapsuleCrmEndpoint<'categoriesDelete'>;
	milestonesList: CapsuleCrmEndpoint<'milestonesList'>;
	milestonesGet: CapsuleCrmEndpoint<'milestonesGet'>;
	milestonesCreate: CapsuleCrmEndpoint<'milestonesCreate'>;
	milestonesUpdate: CapsuleCrmEndpoint<'milestonesUpdate'>;
	milestonesDelete: CapsuleCrmEndpoint<'milestonesDelete'>;
	titlesList: CapsuleCrmEndpoint<'titlesList'>;
	titlesCreate: CapsuleCrmEndpoint<'titlesCreate'>;
	titlesDelete: CapsuleCrmEndpoint<'titlesDelete'>;
	customFieldsList: CapsuleCrmEndpoint<'customFieldsList'>;
	customFieldsGet: CapsuleCrmEndpoint<'customFieldsGet'>;
	customFieldsCreate: CapsuleCrmEndpoint<'customFieldsCreate'>;
	customFieldsUpdate: CapsuleCrmEndpoint<'customFieldsUpdate'>;
	customFieldsDelete: CapsuleCrmEndpoint<'customFieldsDelete'>;
	lostReasonsList: CapsuleCrmEndpoint<'lostReasonsList'>;
	lostReasonsGet: CapsuleCrmEndpoint<'lostReasonsGet'>;
	lostReasonsCreate: CapsuleCrmEndpoint<'lostReasonsCreate'>;
	lostReasonsUpdate: CapsuleCrmEndpoint<'lostReasonsUpdate'>;
	lostReasonsDelete: CapsuleCrmEndpoint<'lostReasonsDelete'>;
	stagesList: CapsuleCrmEndpoint<'stagesList'>;
	stagesGet: CapsuleCrmEndpoint<'stagesGet'>;
	stagesCreate: CapsuleCrmEndpoint<'stagesCreate'>;
	stagesUpdate: CapsuleCrmEndpoint<'stagesUpdate'>;
	stagesDelete: CapsuleCrmEndpoint<'stagesDelete'>;
	tracksGet: CapsuleCrmEndpoint<'tracksGet'>;
	tracksCreate: CapsuleCrmEndpoint<'tracksCreate'>;
	tracksUpdate: CapsuleCrmEndpoint<'tracksUpdate'>;
	tracksDelete: CapsuleCrmEndpoint<'tracksDelete'>;
	tracksListForEntity: CapsuleCrmEndpoint<'tracksListForEntity'>;
	trackDefinitionsList: CapsuleCrmEndpoint<'trackDefinitionsList'>;
	trackDefinitionsGet: CapsuleCrmEndpoint<'trackDefinitionsGet'>;
	trackDefinitionsCreate: CapsuleCrmEndpoint<'trackDefinitionsCreate'>;
	trackDefinitionsUpdate: CapsuleCrmEndpoint<'trackDefinitionsUpdate'>;
	trackDefinitionsDelete: CapsuleCrmEndpoint<'trackDefinitionsDelete'>;
	boardsList: CapsuleCrmEndpoint<'boardsList'>;
	boardsGet: CapsuleCrmEndpoint<'boardsGet'>;
	boardsUpdate: CapsuleCrmEndpoint<'boardsUpdate'>;
	boardsDelete: CapsuleCrmEndpoint<'boardsDelete'>;
	boardsRestore: CapsuleCrmEndpoint<'boardsRestore'>;
	boardsListStages: CapsuleCrmEndpoint<'boardsListStages'>;
	pipelinesList: CapsuleCrmEndpoint<'pipelinesList'>;
	pipelinesGet: CapsuleCrmEndpoint<'pipelinesGet'>;
	pipelinesUpdate: CapsuleCrmEndpoint<'pipelinesUpdate'>;
	pipelinesListMilestones: CapsuleCrmEndpoint<'pipelinesListMilestones'>;
	usersList: CapsuleCrmEndpoint<'usersList'>;
	usersGetCurrent: CapsuleCrmEndpoint<'usersGetCurrent'>;
	usersGet: CapsuleCrmEndpoint<'usersGet'>;
	usersUpdate: CapsuleCrmEndpoint<'usersUpdate'>;
	teamsList: CapsuleCrmEndpoint<'teamsList'>;
	siteGet: CapsuleCrmEndpoint<'siteGet'>;
	restHooksList: CapsuleCrmEndpoint<'restHooksList'>;
	attachmentsGet: CapsuleCrmEndpoint<'attachmentsGet'>;
	attachmentsUpload: CapsuleCrmEndpoint<'attachmentsUpload'>;
	activityTypesList: CapsuleCrmEndpoint<'activityTypesList'>;
	activityTypesGet: CapsuleCrmEndpoint<'activityTypesGet'>;
	activityTypesListIcons: CapsuleCrmEndpoint<'activityTypesListIcons'>;
	countriesList: CapsuleCrmEndpoint<'countriesList'>;
	currenciesList: CapsuleCrmEndpoint<'currenciesList'>;
	goalsList: CapsuleCrmEndpoint<'goalsList'>;
	tagsList: CapsuleCrmEndpoint<'tagsList'>;
	tagsGet: CapsuleCrmEndpoint<'tagsGet'>;
	tagsUpdate: CapsuleCrmEndpoint<'tagsUpdate'>;
	tagsDelete: CapsuleCrmEndpoint<'tagsDelete'>;
	filtersRun: CapsuleCrmEndpoint<'filtersRun'>;
};

const capsuleCrmEndpointsNested = {
	parties: {
		list: partiesList,
		get: partiesGet,
		create: partiesCreate,
		update: partiesUpdate,
		delete: partiesDelete,
		search: partiesSearch,
		listDeleted: partiesListDeleted,
		listEmployees: partiesListEmployees,
		listOpportunities: partiesListOpportunities,
		listProjects: partiesListProjects,
	},
	opportunities: {
		list: opportunitiesList,
		get: opportunitiesGet,
		create: opportunitiesCreate,
		update: opportunitiesUpdate,
		delete: opportunitiesDelete,
		search: opportunitiesSearch,
		listDeleted: opportunitiesListDeleted,
		listParties: opportunitiesListParties,
		addParty: opportunitiesAddParty,
		deleteParty: opportunitiesDeleteParty,
		listProjects: opportunitiesListProjects,
	},
	projects: {
		list: projectsList,
		get: projectsGet,
		create: projectsCreate,
		update: projectsUpdate,
		delete: projectsDelete,
		search: projectsSearch,
		listDeleted: projectsListDeleted,
		listParties: projectsListParties,
		addParty: projectsAddParty,
		deleteParty: projectsDeleteParty,
	},
	tasks: {
		list: tasksList,
		get: tasksGet,
		create: tasksCreate,
		update: tasksUpdate,
		delete: tasksDelete,
	},
	entries: {
		listByDate: entriesListByDate,
		listForEntity: entriesListForEntity,
		get: entriesGet,
		create: entriesCreate,
		update: entriesUpdate,
		delete: entriesDelete,
	},
	categories: {
		list: categoriesList,
		get: categoriesGet,
		create: categoriesCreate,
		update: categoriesUpdate,
		delete: categoriesDelete,
	},
	milestones: {
		list: milestonesList,
		get: milestonesGet,
		create: milestonesCreate,
		update: milestonesUpdate,
		delete: milestonesDelete,
	},
	titles: {
		list: titlesList,
		create: titlesCreate,
		delete: titlesDelete,
	},
	customFields: {
		list: customFieldsList,
		get: customFieldsGet,
		create: customFieldsCreate,
		update: customFieldsUpdate,
		delete: customFieldsDelete,
	},
	lostReasons: {
		list: lostReasonsList,
		get: lostReasonsGet,
		create: lostReasonsCreate,
		update: lostReasonsUpdate,
		delete: lostReasonsDelete,
	},
	stages: {
		list: stagesList,
		get: stagesGet,
		create: stagesCreate,
		update: stagesUpdate,
		delete: stagesDelete,
	},
	tracks: {
		get: tracksGet,
		create: tracksCreate,
		update: tracksUpdate,
		delete: tracksDelete,
		listForEntity: tracksListForEntity,
	},
	trackDefinitions: {
		list: trackDefinitionsList,
		get: trackDefinitionsGet,
		create: trackDefinitionsCreate,
		update: trackDefinitionsUpdate,
		delete: trackDefinitionsDelete,
	},
	boards: {
		list: boardsList,
		get: boardsGet,
		update: boardsUpdate,
		delete: boardsDelete,
		restore: boardsRestore,
		listStages: boardsListStages,
	},
	pipelines: {
		list: pipelinesList,
		get: pipelinesGet,
		update: pipelinesUpdate,
		listMilestones: pipelinesListMilestones,
	},
	users: {
		list: usersList,
		getCurrent: usersGetCurrent,
		get: usersGet,
		update: usersUpdate,
	},
	teams: {
		list: teamsList,
	},
	site: {
		get: siteGet,
	},
	restHooks: {
		list: restHooksList,
	},
	attachments: {
		get: attachmentsGet,
		upload: attachmentsUpload,
	},
	activityTypes: {
		list: activityTypesList,
		get: activityTypesGet,
		listIcons: activityTypesListIcons,
	},
	countries: {
		list: countriesList,
	},
	currencies: {
		list: currenciesList,
	},
	goals: {
		list: goalsList,
	},
	tags: {
		list: tagsList,
		get: tagsGet,
		update: tagsUpdate,
		delete: tagsDelete,
	},
	filters: {
		run: filtersRun,
	},
} as const;

const capsuleCrmWebhooksNested = {} as const;

export const capsuleCrmEndpointSchemas = {
	'parties.list': {
		input: CapsuleCrmEndpointInputSchemas.partiesList,
		output: CapsuleCrmEndpointOutputSchemas.partiesList,
	},
	'parties.get': {
		input: CapsuleCrmEndpointInputSchemas.partiesGet,
		output: CapsuleCrmEndpointOutputSchemas.partiesGet,
	},
	'parties.create': {
		input: CapsuleCrmEndpointInputSchemas.partiesCreate,
		output: CapsuleCrmEndpointOutputSchemas.partiesCreate,
	},
	'parties.update': {
		input: CapsuleCrmEndpointInputSchemas.partiesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.partiesUpdate,
	},
	'parties.delete': {
		input: CapsuleCrmEndpointInputSchemas.partiesDelete,
		output: CapsuleCrmEndpointOutputSchemas.partiesDelete,
	},
	'parties.search': {
		input: CapsuleCrmEndpointInputSchemas.partiesSearch,
		output: CapsuleCrmEndpointOutputSchemas.partiesSearch,
	},
	'parties.listDeleted': {
		input: CapsuleCrmEndpointInputSchemas.partiesListDeleted,
		output: CapsuleCrmEndpointOutputSchemas.partiesListDeleted,
	},
	'parties.listEmployees': {
		input: CapsuleCrmEndpointInputSchemas.partiesListEmployees,
		output: CapsuleCrmEndpointOutputSchemas.partiesListEmployees,
	},
	'parties.listOpportunities': {
		input: CapsuleCrmEndpointInputSchemas.partiesListOpportunities,
		output: CapsuleCrmEndpointOutputSchemas.partiesListOpportunities,
	},
	'parties.listProjects': {
		input: CapsuleCrmEndpointInputSchemas.partiesListProjects,
		output: CapsuleCrmEndpointOutputSchemas.partiesListProjects,
	},
	'opportunities.list': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesList,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesList,
	},
	'opportunities.get': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesGet,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesGet,
	},
	'opportunities.create': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesCreate,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesCreate,
	},
	'opportunities.update': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesUpdate,
	},
	'opportunities.delete': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesDelete,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesDelete,
	},
	'opportunities.search': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesSearch,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesSearch,
	},
	'opportunities.listDeleted': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesListDeleted,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesListDeleted,
	},
	'opportunities.listParties': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesListParties,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesListParties,
	},
	'opportunities.addParty': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesAddParty,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesAddParty,
	},
	'opportunities.deleteParty': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesDeleteParty,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesDeleteParty,
	},
	'opportunities.listProjects': {
		input: CapsuleCrmEndpointInputSchemas.opportunitiesListProjects,
		output: CapsuleCrmEndpointOutputSchemas.opportunitiesListProjects,
	},
	'projects.list': {
		input: CapsuleCrmEndpointInputSchemas.projectsList,
		output: CapsuleCrmEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: CapsuleCrmEndpointInputSchemas.projectsGet,
		output: CapsuleCrmEndpointOutputSchemas.projectsGet,
	},
	'projects.create': {
		input: CapsuleCrmEndpointInputSchemas.projectsCreate,
		output: CapsuleCrmEndpointOutputSchemas.projectsCreate,
	},
	'projects.update': {
		input: CapsuleCrmEndpointInputSchemas.projectsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.projectsUpdate,
	},
	'projects.delete': {
		input: CapsuleCrmEndpointInputSchemas.projectsDelete,
		output: CapsuleCrmEndpointOutputSchemas.projectsDelete,
	},
	'projects.search': {
		input: CapsuleCrmEndpointInputSchemas.projectsSearch,
		output: CapsuleCrmEndpointOutputSchemas.projectsSearch,
	},
	'projects.listDeleted': {
		input: CapsuleCrmEndpointInputSchemas.projectsListDeleted,
		output: CapsuleCrmEndpointOutputSchemas.projectsListDeleted,
	},
	'projects.listParties': {
		input: CapsuleCrmEndpointInputSchemas.projectsListParties,
		output: CapsuleCrmEndpointOutputSchemas.projectsListParties,
	},
	'projects.addParty': {
		input: CapsuleCrmEndpointInputSchemas.projectsAddParty,
		output: CapsuleCrmEndpointOutputSchemas.projectsAddParty,
	},
	'projects.deleteParty': {
		input: CapsuleCrmEndpointInputSchemas.projectsDeleteParty,
		output: CapsuleCrmEndpointOutputSchemas.projectsDeleteParty,
	},
	'tasks.list': {
		input: CapsuleCrmEndpointInputSchemas.tasksList,
		output: CapsuleCrmEndpointOutputSchemas.tasksList,
	},
	'tasks.get': {
		input: CapsuleCrmEndpointInputSchemas.tasksGet,
		output: CapsuleCrmEndpointOutputSchemas.tasksGet,
	},
	'tasks.create': {
		input: CapsuleCrmEndpointInputSchemas.tasksCreate,
		output: CapsuleCrmEndpointOutputSchemas.tasksCreate,
	},
	'tasks.update': {
		input: CapsuleCrmEndpointInputSchemas.tasksUpdate,
		output: CapsuleCrmEndpointOutputSchemas.tasksUpdate,
	},
	'tasks.delete': {
		input: CapsuleCrmEndpointInputSchemas.tasksDelete,
		output: CapsuleCrmEndpointOutputSchemas.tasksDelete,
	},
	'entries.listByDate': {
		input: CapsuleCrmEndpointInputSchemas.entriesListByDate,
		output: CapsuleCrmEndpointOutputSchemas.entriesListByDate,
	},
	'entries.listForEntity': {
		input: CapsuleCrmEndpointInputSchemas.entriesListForEntity,
		output: CapsuleCrmEndpointOutputSchemas.entriesListForEntity,
	},
	'entries.get': {
		input: CapsuleCrmEndpointInputSchemas.entriesGet,
		output: CapsuleCrmEndpointOutputSchemas.entriesGet,
	},
	'entries.create': {
		input: CapsuleCrmEndpointInputSchemas.entriesCreate,
		output: CapsuleCrmEndpointOutputSchemas.entriesCreate,
	},
	'entries.update': {
		input: CapsuleCrmEndpointInputSchemas.entriesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.entriesUpdate,
	},
	'entries.delete': {
		input: CapsuleCrmEndpointInputSchemas.entriesDelete,
		output: CapsuleCrmEndpointOutputSchemas.entriesDelete,
	},
	'categories.list': {
		input: CapsuleCrmEndpointInputSchemas.categoriesList,
		output: CapsuleCrmEndpointOutputSchemas.categoriesList,
	},
	'categories.get': {
		input: CapsuleCrmEndpointInputSchemas.categoriesGet,
		output: CapsuleCrmEndpointOutputSchemas.categoriesGet,
	},
	'categories.create': {
		input: CapsuleCrmEndpointInputSchemas.categoriesCreate,
		output: CapsuleCrmEndpointOutputSchemas.categoriesCreate,
	},
	'categories.update': {
		input: CapsuleCrmEndpointInputSchemas.categoriesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.categoriesUpdate,
	},
	'categories.delete': {
		input: CapsuleCrmEndpointInputSchemas.categoriesDelete,
		output: CapsuleCrmEndpointOutputSchemas.categoriesDelete,
	},
	'milestones.list': {
		input: CapsuleCrmEndpointInputSchemas.milestonesList,
		output: CapsuleCrmEndpointOutputSchemas.milestonesList,
	},
	'milestones.get': {
		input: CapsuleCrmEndpointInputSchemas.milestonesGet,
		output: CapsuleCrmEndpointOutputSchemas.milestonesGet,
	},
	'milestones.create': {
		input: CapsuleCrmEndpointInputSchemas.milestonesCreate,
		output: CapsuleCrmEndpointOutputSchemas.milestonesCreate,
	},
	'milestones.update': {
		input: CapsuleCrmEndpointInputSchemas.milestonesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.milestonesUpdate,
	},
	'milestones.delete': {
		input: CapsuleCrmEndpointInputSchemas.milestonesDelete,
		output: CapsuleCrmEndpointOutputSchemas.milestonesDelete,
	},
	'titles.list': {
		input: CapsuleCrmEndpointInputSchemas.titlesList,
		output: CapsuleCrmEndpointOutputSchemas.titlesList,
	},
	'titles.create': {
		input: CapsuleCrmEndpointInputSchemas.titlesCreate,
		output: CapsuleCrmEndpointOutputSchemas.titlesCreate,
	},
	'titles.delete': {
		input: CapsuleCrmEndpointInputSchemas.titlesDelete,
		output: CapsuleCrmEndpointOutputSchemas.titlesDelete,
	},
	'customFields.list': {
		input: CapsuleCrmEndpointInputSchemas.customFieldsList,
		output: CapsuleCrmEndpointOutputSchemas.customFieldsList,
	},
	'customFields.get': {
		input: CapsuleCrmEndpointInputSchemas.customFieldsGet,
		output: CapsuleCrmEndpointOutputSchemas.customFieldsGet,
	},
	'customFields.create': {
		input: CapsuleCrmEndpointInputSchemas.customFieldsCreate,
		output: CapsuleCrmEndpointOutputSchemas.customFieldsCreate,
	},
	'customFields.update': {
		input: CapsuleCrmEndpointInputSchemas.customFieldsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.customFieldsUpdate,
	},
	'customFields.delete': {
		input: CapsuleCrmEndpointInputSchemas.customFieldsDelete,
		output: CapsuleCrmEndpointOutputSchemas.customFieldsDelete,
	},
	'lostReasons.list': {
		input: CapsuleCrmEndpointInputSchemas.lostReasonsList,
		output: CapsuleCrmEndpointOutputSchemas.lostReasonsList,
	},
	'lostReasons.get': {
		input: CapsuleCrmEndpointInputSchemas.lostReasonsGet,
		output: CapsuleCrmEndpointOutputSchemas.lostReasonsGet,
	},
	'lostReasons.create': {
		input: CapsuleCrmEndpointInputSchemas.lostReasonsCreate,
		output: CapsuleCrmEndpointOutputSchemas.lostReasonsCreate,
	},
	'lostReasons.update': {
		input: CapsuleCrmEndpointInputSchemas.lostReasonsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.lostReasonsUpdate,
	},
	'lostReasons.delete': {
		input: CapsuleCrmEndpointInputSchemas.lostReasonsDelete,
		output: CapsuleCrmEndpointOutputSchemas.lostReasonsDelete,
	},
	'stages.list': {
		input: CapsuleCrmEndpointInputSchemas.stagesList,
		output: CapsuleCrmEndpointOutputSchemas.stagesList,
	},
	'stages.get': {
		input: CapsuleCrmEndpointInputSchemas.stagesGet,
		output: CapsuleCrmEndpointOutputSchemas.stagesGet,
	},
	'stages.create': {
		input: CapsuleCrmEndpointInputSchemas.stagesCreate,
		output: CapsuleCrmEndpointOutputSchemas.stagesCreate,
	},
	'stages.update': {
		input: CapsuleCrmEndpointInputSchemas.stagesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.stagesUpdate,
	},
	'stages.delete': {
		input: CapsuleCrmEndpointInputSchemas.stagesDelete,
		output: CapsuleCrmEndpointOutputSchemas.stagesDelete,
	},
	'tracks.get': {
		input: CapsuleCrmEndpointInputSchemas.tracksGet,
		output: CapsuleCrmEndpointOutputSchemas.tracksGet,
	},
	'tracks.create': {
		input: CapsuleCrmEndpointInputSchemas.tracksCreate,
		output: CapsuleCrmEndpointOutputSchemas.tracksCreate,
	},
	'tracks.update': {
		input: CapsuleCrmEndpointInputSchemas.tracksUpdate,
		output: CapsuleCrmEndpointOutputSchemas.tracksUpdate,
	},
	'tracks.delete': {
		input: CapsuleCrmEndpointInputSchemas.tracksDelete,
		output: CapsuleCrmEndpointOutputSchemas.tracksDelete,
	},
	'tracks.listForEntity': {
		input: CapsuleCrmEndpointInputSchemas.tracksListForEntity,
		output: CapsuleCrmEndpointOutputSchemas.tracksListForEntity,
	},
	'trackDefinitions.list': {
		input: CapsuleCrmEndpointInputSchemas.trackDefinitionsList,
		output: CapsuleCrmEndpointOutputSchemas.trackDefinitionsList,
	},
	'trackDefinitions.get': {
		input: CapsuleCrmEndpointInputSchemas.trackDefinitionsGet,
		output: CapsuleCrmEndpointOutputSchemas.trackDefinitionsGet,
	},
	'trackDefinitions.create': {
		input: CapsuleCrmEndpointInputSchemas.trackDefinitionsCreate,
		output: CapsuleCrmEndpointOutputSchemas.trackDefinitionsCreate,
	},
	'trackDefinitions.update': {
		input: CapsuleCrmEndpointInputSchemas.trackDefinitionsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.trackDefinitionsUpdate,
	},
	'trackDefinitions.delete': {
		input: CapsuleCrmEndpointInputSchemas.trackDefinitionsDelete,
		output: CapsuleCrmEndpointOutputSchemas.trackDefinitionsDelete,
	},
	'boards.list': {
		input: CapsuleCrmEndpointInputSchemas.boardsList,
		output: CapsuleCrmEndpointOutputSchemas.boardsList,
	},
	'boards.get': {
		input: CapsuleCrmEndpointInputSchemas.boardsGet,
		output: CapsuleCrmEndpointOutputSchemas.boardsGet,
	},
	'boards.update': {
		input: CapsuleCrmEndpointInputSchemas.boardsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.boardsUpdate,
	},
	'boards.delete': {
		input: CapsuleCrmEndpointInputSchemas.boardsDelete,
		output: CapsuleCrmEndpointOutputSchemas.boardsDelete,
	},
	'boards.restore': {
		input: CapsuleCrmEndpointInputSchemas.boardsRestore,
		output: CapsuleCrmEndpointOutputSchemas.boardsRestore,
	},
	'boards.listStages': {
		input: CapsuleCrmEndpointInputSchemas.boardsListStages,
		output: CapsuleCrmEndpointOutputSchemas.boardsListStages,
	},
	'pipelines.list': {
		input: CapsuleCrmEndpointInputSchemas.pipelinesList,
		output: CapsuleCrmEndpointOutputSchemas.pipelinesList,
	},
	'pipelines.get': {
		input: CapsuleCrmEndpointInputSchemas.pipelinesGet,
		output: CapsuleCrmEndpointOutputSchemas.pipelinesGet,
	},
	'pipelines.update': {
		input: CapsuleCrmEndpointInputSchemas.pipelinesUpdate,
		output: CapsuleCrmEndpointOutputSchemas.pipelinesUpdate,
	},
	'pipelines.listMilestones': {
		input: CapsuleCrmEndpointInputSchemas.pipelinesListMilestones,
		output: CapsuleCrmEndpointOutputSchemas.pipelinesListMilestones,
	},
	'users.list': {
		input: CapsuleCrmEndpointInputSchemas.usersList,
		output: CapsuleCrmEndpointOutputSchemas.usersList,
	},
	'users.getCurrent': {
		input: CapsuleCrmEndpointInputSchemas.usersGetCurrent,
		output: CapsuleCrmEndpointOutputSchemas.usersGetCurrent,
	},
	'users.get': {
		input: CapsuleCrmEndpointInputSchemas.usersGet,
		output: CapsuleCrmEndpointOutputSchemas.usersGet,
	},
	'users.update': {
		input: CapsuleCrmEndpointInputSchemas.usersUpdate,
		output: CapsuleCrmEndpointOutputSchemas.usersUpdate,
	},
	'teams.list': {
		input: CapsuleCrmEndpointInputSchemas.teamsList,
		output: CapsuleCrmEndpointOutputSchemas.teamsList,
	},
	'site.get': {
		input: CapsuleCrmEndpointInputSchemas.siteGet,
		output: CapsuleCrmEndpointOutputSchemas.siteGet,
	},
	'restHooks.list': {
		input: CapsuleCrmEndpointInputSchemas.restHooksList,
		output: CapsuleCrmEndpointOutputSchemas.restHooksList,
	},
	'attachments.get': {
		input: CapsuleCrmEndpointInputSchemas.attachmentsGet,
		output: CapsuleCrmEndpointOutputSchemas.attachmentsGet,
	},
	'attachments.upload': {
		input: CapsuleCrmEndpointInputSchemas.attachmentsUpload,
		output: CapsuleCrmEndpointOutputSchemas.attachmentsUpload,
	},
	'activityTypes.list': {
		input: CapsuleCrmEndpointInputSchemas.activityTypesList,
		output: CapsuleCrmEndpointOutputSchemas.activityTypesList,
	},
	'activityTypes.get': {
		input: CapsuleCrmEndpointInputSchemas.activityTypesGet,
		output: CapsuleCrmEndpointOutputSchemas.activityTypesGet,
	},
	'activityTypes.listIcons': {
		input: CapsuleCrmEndpointInputSchemas.activityTypesListIcons,
		output: CapsuleCrmEndpointOutputSchemas.activityTypesListIcons,
	},
	'countries.list': {
		input: CapsuleCrmEndpointInputSchemas.countriesList,
		output: CapsuleCrmEndpointOutputSchemas.countriesList,
	},
	'currencies.list': {
		input: CapsuleCrmEndpointInputSchemas.currenciesList,
		output: CapsuleCrmEndpointOutputSchemas.currenciesList,
	},
	'goals.list': {
		input: CapsuleCrmEndpointInputSchemas.goalsList,
		output: CapsuleCrmEndpointOutputSchemas.goalsList,
	},
	'tags.list': {
		input: CapsuleCrmEndpointInputSchemas.tagsList,
		output: CapsuleCrmEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: CapsuleCrmEndpointInputSchemas.tagsGet,
		output: CapsuleCrmEndpointOutputSchemas.tagsGet,
	},
	'tags.update': {
		input: CapsuleCrmEndpointInputSchemas.tagsUpdate,
		output: CapsuleCrmEndpointOutputSchemas.tagsUpdate,
	},
	'tags.delete': {
		input: CapsuleCrmEndpointInputSchemas.tagsDelete,
		output: CapsuleCrmEndpointOutputSchemas.tagsDelete,
	},
	'filters.run': {
		input: CapsuleCrmEndpointInputSchemas.filtersRun,
		output: CapsuleCrmEndpointOutputSchemas.filtersRun,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof capsuleCrmEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const capsuleCrmEndpointMeta = {
	'parties.list': {
		riskLevel: 'read',
		description: 'List parties (people and organisations)',
	},
	'parties.get': {
		riskLevel: 'read',
		description: 'Get a party by ID',
	},
	'parties.create': {
		riskLevel: 'write',
		description: 'Create a person or organisation',
	},
	'parties.update': {
		riskLevel: 'write',
		description: 'Update a party',
	},
	'parties.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a party',
	},
	'parties.search': {
		riskLevel: 'read',
		description: 'Search parties by query string',
	},
	'parties.listDeleted': {
		riskLevel: 'read',
		description: 'List parties deleted since a date',
	},
	'parties.listEmployees': {
		riskLevel: 'read',
		description: 'List employees of an organisation',
	},
	'parties.listOpportunities': {
		riskLevel: 'read',
		description: 'List opportunities for a party',
	},
	'parties.listProjects': {
		riskLevel: 'read',
		description: 'List projects for a party',
	},
	'opportunities.list': {
		riskLevel: 'read',
		description: 'List opportunities',
	},
	'opportunities.get': {
		riskLevel: 'read',
		description: 'Get an opportunity by ID',
	},
	'opportunities.create': {
		riskLevel: 'write',
		description: 'Create an opportunity',
	},
	'opportunities.update': {
		riskLevel: 'write',
		description: 'Update an opportunity',
	},
	'opportunities.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an opportunity',
	},
	'opportunities.search': {
		riskLevel: 'read',
		description: 'Search opportunities by query string',
	},
	'opportunities.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted or restricted opportunities',
	},
	'opportunities.listParties': {
		riskLevel: 'read',
		description: 'List additional parties on an opportunity',
	},
	'opportunities.addParty': {
		riskLevel: 'write',
		description: 'Add a party to an opportunity',
	},
	'opportunities.deleteParty': {
		riskLevel: 'write',
		description: 'Remove a party from an opportunity',
	},
	'opportunities.listProjects': {
		riskLevel: 'read',
		description: 'List projects linked to an opportunity',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects (kases)',
	},
	'projects.get': {
		riskLevel: 'read',
		description: 'Get a project by ID',
	},
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project (case)',
	},
	'projects.update': {
		riskLevel: 'write',
		description: 'Update a project',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project',
	},
	'projects.search': {
		riskLevel: 'read',
		description: 'Search projects by query string',
	},
	'projects.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted or restricted projects',
	},
	'projects.listParties': {
		riskLevel: 'read',
		description: 'List parties on a project',
	},
	'projects.addParty': {
		riskLevel: 'write',
		description: 'Add a party to a project',
	},
	'projects.deleteParty': {
		riskLevel: 'write',
		description: 'Remove a party from a project',
	},
	'tasks.list': {
		riskLevel: 'read',
		description: 'List tasks',
	},
	'tasks.get': {
		riskLevel: 'read',
		description: 'Get a task by ID',
	},
	'tasks.create': {
		riskLevel: 'write',
		description: 'Create a task',
	},
	'tasks.update': {
		riskLevel: 'write',
		description: 'Update a task',
	},
	'tasks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a task',
	},
	'entries.listByDate': {
		riskLevel: 'read',
		description: 'List notes, emails, and completed tasks by date',
	},
	'entries.listForEntity': {
		riskLevel: 'read',
		description: 'List entries for a party, opportunity, or project',
	},
	'entries.get': {
		riskLevel: 'read',
		description: 'Get an entry by ID',
	},
	'entries.create': {
		riskLevel: 'write',
		description: 'Create a note entry',
	},
	'entries.update': {
		riskLevel: 'write',
		description: 'Update a note or email entry',
	},
	'entries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an entry',
	},
	'categories.list': {
		riskLevel: 'read',
		description: 'List task categories',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'Get a category by ID',
	},
	'categories.create': {
		riskLevel: 'write',
		description: 'Create a task category',
	},
	'categories.update': {
		riskLevel: 'write',
		description: 'Update a category',
	},
	'categories.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a category',
	},
	'milestones.list': {
		riskLevel: 'read',
		description: 'List milestones',
	},
	'milestones.get': {
		riskLevel: 'read',
		description: 'Get a milestone by ID',
	},
	'milestones.create': {
		riskLevel: 'write',
		description: 'Create a milestone',
	},
	'milestones.update': {
		riskLevel: 'write',
		description: 'Update a milestone',
	},
	'milestones.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a milestone',
	},
	'titles.list': {
		riskLevel: 'read',
		description: 'List custom person titles',
	},
	'titles.create': {
		riskLevel: 'write',
		description: 'Create a custom person title',
	},
	'titles.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a title',
	},
	'customFields.list': {
		riskLevel: 'read',
		description: 'List custom field definitions for an entity type',
	},
	'customFields.get': {
		riskLevel: 'read',
		description: 'Get a custom field definition',
	},
	'customFields.create': {
		riskLevel: 'write',
		description: 'Create a custom field definition',
	},
	'customFields.update': {
		riskLevel: 'write',
		description: 'Update a custom field definition',
	},
	'customFields.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom field definition',
	},
	'lostReasons.list': {
		riskLevel: 'read',
		description: 'List lost reasons',
	},
	'lostReasons.get': {
		riskLevel: 'read',
		description: 'Get a lost reason by ID',
	},
	'lostReasons.create': {
		riskLevel: 'write',
		description: 'Create a lost reason',
	},
	'lostReasons.update': {
		riskLevel: 'write',
		description: 'Update a lost reason',
	},
	'lostReasons.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a lost reason',
	},
	'stages.list': {
		riskLevel: 'read',
		description: 'List stages across boards',
	},
	'stages.get': {
		riskLevel: 'read',
		description: 'Get a stage by ID',
	},
	'stages.create': {
		riskLevel: 'write',
		description: 'Create a board stage',
	},
	'stages.update': {
		riskLevel: 'write',
		description: 'Update a stage',
	},
	'stages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a stage',
	},
	'tracks.get': {
		riskLevel: 'read',
		description: 'Get a track by ID',
	},
	'tracks.create': {
		riskLevel: 'write',
		description: 'Apply a track definition to an entity',
	},
	'tracks.update': {
		riskLevel: 'write',
		description: 'Update a track description or date',
	},
	'tracks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a track',
	},
	'tracks.listForEntity': {
		riskLevel: 'read',
		description: 'List tracks on an opportunity or project',
	},
	'trackDefinitions.list': {
		riskLevel: 'read',
		description: 'List track definitions',
	},
	'trackDefinitions.get': {
		riskLevel: 'read',
		description: 'Get a track definition by ID',
	},
	'trackDefinitions.create': {
		riskLevel: 'write',
		description: 'Create a track definition',
	},
	'trackDefinitions.update': {
		riskLevel: 'write',
		description: 'Update a track definition',
	},
	'trackDefinitions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a track definition',
	},
	'boards.list': {
		riskLevel: 'read',
		description: 'List boards',
	},
	'boards.get': {
		riskLevel: 'read',
		description: 'Get a board by ID',
	},
	'boards.update': {
		riskLevel: 'write',
		description: 'Update a board',
	},
	'boards.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete (archive) a board',
	},
	'boards.restore': {
		riskLevel: 'write',
		description: 'Restore a deleted board',
	},
	'boards.listStages': {
		riskLevel: 'read',
		description: 'List stages on a board',
	},
	'pipelines.list': {
		riskLevel: 'read',
		description: 'List sales pipelines',
	},
	'pipelines.get': {
		riskLevel: 'read',
		description: 'Get a pipeline by ID',
	},
	'pipelines.update': {
		riskLevel: 'write',
		description: 'Update a pipeline',
	},
	'pipelines.listMilestones': {
		riskLevel: 'read',
		description: 'List milestones on a pipeline',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List users',
	},
	'users.getCurrent': {
		riskLevel: 'read',
		description: 'Get the current authenticated user',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Get a user by ID',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update user preferences',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List teams',
	},
	'site.get': {
		riskLevel: 'read',
		description: 'Get Capsule site (account) details',
	},
	'restHooks.list': {
		riskLevel: 'read',
		description: 'List REST hook subscriptions',
	},
	'attachments.get': {
		riskLevel: 'read',
		description: 'Download an attachment by ID',
	},
	'attachments.upload': {
		riskLevel: 'write',
		description: 'Upload an attachment and receive a token',
	},
	'activityTypes.list': {
		riskLevel: 'read',
		description: 'List activity types',
	},
	'activityTypes.get': {
		riskLevel: 'read',
		description: 'Get an activity type by ID',
	},
	'activityTypes.listIcons': {
		riskLevel: 'read',
		description: 'List activity type icons',
	},
	'countries.list': {
		riskLevel: 'read',
		description: 'List countries',
	},
	'currencies.list': {
		riskLevel: 'read',
		description: 'List currencies',
	},
	'goals.list': {
		riskLevel: 'read',
		description: 'List goals',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List tags for an entity type',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Get a tag by ID',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Update a tag name',
	},
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a tag',
	},
	'filters.run': {
		riskLevel: 'read',
		description: 'Run a structured filter query',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof capsuleCrmEndpointsNested
>;

export const capsuleCrmAuthConfig = {
	api_key: { account: ['subdomain'] as const },
	oauth_2: { account: ['subdomain'] as const },
} as const satisfies PluginAuthConfig;

export type BaseCapsuleCrmPlugin<T extends CapsuleCrmPluginOptions> =
	CorsairPlugin<
		'capsulecrm',
		typeof CapsuleCrmSchema,
		typeof capsuleCrmEndpointsNested,
		typeof capsuleCrmWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCapsuleCrmPlugin =
	BaseCapsuleCrmPlugin<CapsuleCrmPluginOptions>;
export type ExternalCapsuleCrmPlugin<T extends CapsuleCrmPluginOptions> =
	BaseCapsuleCrmPlugin<T>;

export function capsulecrm<const T extends CapsuleCrmPluginOptions>(
	incomingOptions: CapsuleCrmPluginOptions & T = {} as CapsuleCrmPluginOptions &
		T,
): ExternalCapsuleCrmPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'capsulecrm',
		authConfig: capsuleCrmAuthConfig,
		oauthConfig: {
			providerName: 'Capsule CRM',
			authUrl: 'https://api.capsulecrm.com/oauth/authorise',
			tokenUrl: 'https://api.capsulecrm.com/oauth/token',
			scopes: ['read write user_preference'],
		},
		schema: CapsuleCrmSchema,
		options,
		hooks: options.hooks,
		endpoints: capsuleCrmEndpointsNested,
		webhooks: capsuleCrmWebhooksNested,
		endpointMeta: capsuleCrmEndpointMeta,
		endpointSchemas: capsuleCrmEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CapsuleCrmKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) throw new AuthMissingError('capsulecrm', 'api_key');
				return res;
			}
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) throw new AuthMissingError('capsulecrm', 'oauth_2');
				return res;
			}
			throw new AuthMissingError('capsulecrm', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCapsuleCrmPlugin;
}

export {
	CapsuleCrmAPIError,
	CapsuleCrmRateLimitError,
	makeCapsuleCrmRequest,
} from './client';
export type {
	CapsuleCrmEndpointInputs,
	CapsuleCrmEndpointOutputs,
} from './endpoints/types';
export {
	CapsuleCrmEndpointInputSchemas,
	CapsuleCrmEndpointOutputSchemas,
} from './endpoints/types';
