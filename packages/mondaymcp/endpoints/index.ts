import {
	agentsCatalog,
	agentsManage,
	agentsManageKnowledge,
	agentsManageSkills,
	agentsManageTriggers,
} from './agents';
import {
	boardsCreate,
	boardsGetActivity,
	boardsGetInfo,
	boardsGetItemsPage,
	boardsInsights,
	columnsCreate,
	columnsGetTypeInfo,
	groupsCreate,
	itemsChangeColumnValues,
	itemsCreate,
} from './boards';
import {
	dashboardsAllWidgetsSchema,
	dashboardsCreate,
	dashboardsCreateWidget,
	docsCreate,
	docsRead,
	docsUpdate,
	viewsCreate,
	viewsCreateTable,
	viewsUpdate,
	viewsUpdateTable,
} from './docs';
import {
	formsCreate,
	formsCreateSubmission,
	formsEditQuestions,
	formsGet,
	formsUpdate,
	usersGetContext,
	usersListAndTeams,
} from './forms';
import {
	apiExecuteQuery,
	apiGetGraphqlSchema,
	apiGetTypeDetails,
	sprintsGetBoards,
	sprintsGetMetadata,
	sprintsGetSummary,
} from './sprints';
import {
	assetsFinalizeUpload,
	assetsGet,
	assetsGetUploadUrl,
	meetingsGetNotetaker,
	notificationsCreate,
	searchQuery,
	updatesCreate,
	updatesList,
} from './updates';
import {
	automationsCreate,
	automationsList,
	automationsManage,
	workflowsCreate,
	workflowsPlan,
	workflowsPublish,
	workflowsUpdate,
} from './workflows';
import {
	foldersCreate,
	foldersMoveObject,
	foldersUpdate,
	workspacesCreate,
	workspacesGetInfo,
	workspacesList,
	workspacesUpdate,
} from './workspaces';

export const mondayMcpEndpointsNested = {
	boards: {
		create: boardsCreate,
		getInfo: boardsGetInfo,
		getItemsPage: boardsGetItemsPage,
		getActivity: boardsGetActivity,
		insights: boardsInsights,
	},
	groups: {
		create: groupsCreate,
	},
	columns: {
		create: columnsCreate,
		getTypeInfo: columnsGetTypeInfo,
	},
	items: {
		create: itemsCreate,
		changeColumnValues: itemsChangeColumnValues,
	},
	workspaces: {
		create: workspacesCreate,
		update: workspacesUpdate,
		list: workspacesList,
		getInfo: workspacesGetInfo,
	},
	folders: {
		create: foldersCreate,
		update: foldersUpdate,
		moveObject: foldersMoveObject,
	},
	docs: {
		create: docsCreate,
		update: docsUpdate,
		read: docsRead,
	},
	dashboards: {
		create: dashboardsCreate,
		createWidget: dashboardsCreateWidget,
		allWidgetsSchema: dashboardsAllWidgetsSchema,
	},
	views: {
		create: viewsCreate,
		update: viewsUpdate,
		createTable: viewsCreateTable,
		updateTable: viewsUpdateTable,
	},
	forms: {
		create: formsCreate,
		get: formsGet,
		update: formsUpdate,
		editQuestions: formsEditQuestions,
		createSubmission: formsCreateSubmission,
	},
	users: {
		getContext: usersGetContext,
		listAndTeams: usersListAndTeams,
	},
	updates: {
		create: updatesCreate,
		list: updatesList,
	},
	notifications: {
		create: notificationsCreate,
	},
	search: {
		query: searchQuery,
	},
	assets: {
		get: assetsGet,
		getUploadUrl: assetsGetUploadUrl,
		finalizeUpload: assetsFinalizeUpload,
	},
	meetings: {
		getNotetaker: meetingsGetNotetaker,
	},
	automations: {
		list: automationsList,
		manage: automationsManage,
		create: automationsCreate,
	},
	workflows: {
		plan: workflowsPlan,
		create: workflowsCreate,
		update: workflowsUpdate,
		publish: workflowsPublish,
	},
	agents: {
		manage: agentsManage,
		manageTriggers: agentsManageTriggers,
		manageSkills: agentsManageSkills,
		manageKnowledge: agentsManageKnowledge,
		catalog: agentsCatalog,
	},
	sprints: {
		getBoards: sprintsGetBoards,
		getMetadata: sprintsGetMetadata,
		getSummary: sprintsGetSummary,
	},
	schema: {
		executeQuery: apiExecuteQuery,
		getGraphqlSchema: apiGetGraphqlSchema,
		getTypeDetails: apiGetTypeDetails,
	},
} as const;

export * from './types';
