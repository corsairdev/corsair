import {
	boardsCreate,
	boardsGetInfo,
	boardsGetItemsPage,
	boardsGetActivity,
	boardsInsights,
	groupsCreate,
	columnsCreate,
	columnsGetTypeInfo,
	itemsCreate,
	itemsChangeColumnValues,
} from './boards';
import {
	workspacesCreate,
	workspacesUpdate,
	workspacesList,
	workspacesGetInfo,
	foldersCreate,
	foldersUpdate,
	foldersMoveObject,
} from './workspaces';
import {
	docsCreate,
	docsUpdate,
	docsRead,
	dashboardsCreate,
	dashboardsCreateWidget,
	dashboardsAllWidgetsSchema,
	viewsCreate,
	viewsUpdate,
	viewsCreateTable,
	viewsUpdateTable,
} from './docs';
import {
	formsCreate,
	formsGet,
	formsUpdate,
	formsEditQuestions,
	formsCreateSubmission,
	usersGetContext,
	usersListAndTeams,
} from './forms';
import {
	updatesCreate,
	updatesList,
	notificationsCreate,
	searchQuery,
	assetsGet,
	assetsGetUploadUrl,
	assetsFinalizeUpload,
	meetingsGetNotetaker,
} from './updates';
import {
	automationsList,
	automationsManage,
	automationsCreate,
	workflowsPlan,
	workflowsCreate,
	workflowsUpdate,
	workflowsPublish,
} from './workflows';
import {
	agentsManage,
	agentsManageTriggers,
	agentsManageSkills,
	agentsManageKnowledge,
	agentsCatalog,
} from './agents';
import {
	sprintsGetBoards,
	sprintsGetMetadata,
	sprintsGetSummary,
	apiExecuteQuery,
	apiGetGraphqlSchema,
	apiGetTypeDetails,
} from './sprints';

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
