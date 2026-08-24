import type {
	BindEndpoints,
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { BasecampEndpoints } from './endpoints';
import {
	BasecampEndpointInputSchemas,
	BasecampEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BasecampSchema } from './schema';

const basecampEndpointsNested = BasecampEndpoints;

export const basecampAuthConfig = {
	oauth_2: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasecampPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Access-token override for scripts and opt-in live tests. */
	key?: string;
	/** Required when an OAuth identity can access more than one account. */
	accountId?: string;
	/** Basecamp requires an identifying application name and contact. */
	userAgent?: string;
	hooks?: InternalBasecampPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof basecampEndpointsNested>;
};

export type BasecampContext = CorsairPluginContext<
	typeof BasecampSchema,
	BasecampPluginOptions,
	undefined,
	typeof basecampAuthConfig
>;
export type BasecampKeyBuilderContext =
	KeyBuilderContext<BasecampPluginOptions>;
export type BasecampBoundEndpoints = BindEndpoints<
	typeof basecampEndpointsNested
>;

export const basecampEndpointSchemas = {
	'projectsAndTemplates.createProjectConstruction': {
		input: BasecampEndpointInputSchemas.createProjectConstruction,
		output: BasecampEndpointOutputSchemas.createProjectConstruction,
	},
	'projectsAndTemplates.getProject': {
		input: BasecampEndpointInputSchemas.getProject,
		output: BasecampEndpointOutputSchemas.getProject,
	},
	'projectsAndTemplates.getProjects': {
		input: BasecampEndpointInputSchemas.getProjects,
		output: BasecampEndpointOutputSchemas.getProjects,
	},
	'projectsAndTemplates.getProjectsByProjectId': {
		input: BasecampEndpointInputSchemas.getProjectsByProjectId,
		output: BasecampEndpointOutputSchemas.getProjectsByProjectId,
	},
	'projectsAndTemplates.getTemplates': {
		input: BasecampEndpointInputSchemas.getTemplates,
		output: BasecampEndpointOutputSchemas.getTemplates,
	},
	'projectsAndTemplates.getTemplatesByTemplateId': {
		input: BasecampEndpointInputSchemas.getTemplatesByTemplateId,
		output: BasecampEndpointOutputSchemas.getTemplatesByTemplateId,
	},
	'projectsAndTemplates.getTemplatesProjectConstructions': {
		input: BasecampEndpointInputSchemas.getTemplatesProjectConstructions,
		output: BasecampEndpointOutputSchemas.getTemplatesProjectConstructions,
	},
	'projectsAndTemplates.postLineupMarkers': {
		input: BasecampEndpointInputSchemas.postLineupMarkers,
		output: BasecampEndpointOutputSchemas.postLineupMarkers,
	},
	'projectsAndTemplates.postProjects': {
		input: BasecampEndpointInputSchemas.postProjects,
		output: BasecampEndpointOutputSchemas.postProjects,
	},
	'projectsAndTemplates.postTemplates': {
		input: BasecampEndpointInputSchemas.postTemplates,
		output: BasecampEndpointOutputSchemas.postTemplates,
	},
	'projectsAndTemplates.putProjects': {
		input: BasecampEndpointInputSchemas.putProjects,
		output: BasecampEndpointOutputSchemas.putProjects,
	},
	'projectsAndTemplates.putTemplates': {
		input: BasecampEndpointInputSchemas.putTemplates,
		output: BasecampEndpointOutputSchemas.putTemplates,
	},
	'projectsAndTemplates.trashProject': {
		input: BasecampEndpointInputSchemas.trashProject,
		output: BasecampEndpointOutputSchemas.trashProject,
	},
	'projectsAndTemplates.trashTemplate': {
		input: BasecampEndpointInputSchemas.trashTemplate,
		output: BasecampEndpointOutputSchemas.trashTemplate,
	},
	'peopleAndAccess.getCirclesPeople': {
		input: BasecampEndpointInputSchemas.getCirclesPeople,
		output: BasecampEndpointOutputSchemas.getCirclesPeople,
	},
	'peopleAndAccess.getMyProfile': {
		input: BasecampEndpointInputSchemas.getMyProfile,
		output: BasecampEndpointOutputSchemas.getMyProfile,
	},
	'peopleAndAccess.getPeople': {
		input: BasecampEndpointInputSchemas.getPeople,
		output: BasecampEndpointOutputSchemas.getPeople,
	},
	'peopleAndAccess.getPeopleByPersonId': {
		input: BasecampEndpointInputSchemas.getPeopleByPersonId,
		output: BasecampEndpointOutputSchemas.getPeopleByPersonId,
	},
	'peopleAndAccess.getPerson': {
		input: BasecampEndpointInputSchemas.getPerson,
		output: BasecampEndpointOutputSchemas.getPerson,
	},
	'peopleAndAccess.getProjectsPeople': {
		input: BasecampEndpointInputSchemas.getProjectsPeople,
		output: BasecampEndpointOutputSchemas.getProjectsPeople,
	},
	'peopleAndAccess.listProjectPeople': {
		input: BasecampEndpointInputSchemas.listProjectPeople,
		output: BasecampEndpointOutputSchemas.listProjectPeople,
	},
	'peopleAndAccess.putProjectsPeopleUsers': {
		input: BasecampEndpointInputSchemas.putProjectsPeopleUsers,
		output: BasecampEndpointOutputSchemas.putProjectsPeopleUsers,
	},
	'todos.completeTodo': {
		input: BasecampEndpointInputSchemas.completeTodo,
		output: BasecampEndpointOutputSchemas.completeTodo,
	},
	'todos.createTodo': {
		input: BasecampEndpointInputSchemas.createTodo,
		output: BasecampEndpointOutputSchemas.createTodo,
	},
	'todos.createTodolistGroup': {
		input: BasecampEndpointInputSchemas.createTodolistGroup,
		output: BasecampEndpointOutputSchemas.createTodolistGroup,
	},
	'todos.getBucketsTodolists': {
		input: BasecampEndpointInputSchemas.getBucketsTodolists,
		output: BasecampEndpointOutputSchemas.getBucketsTodolists,
	},
	'todos.getBucketsTodolistsGroups': {
		input: BasecampEndpointInputSchemas.getBucketsTodolistsGroups,
		output: BasecampEndpointOutputSchemas.getBucketsTodolistsGroups,
	},
	'todos.getBucketsTodolistsTodos': {
		input: BasecampEndpointInputSchemas.getBucketsTodolistsTodos,
		output: BasecampEndpointOutputSchemas.getBucketsTodolistsTodos,
	},
	'todos.getBucketsTodos': {
		input: BasecampEndpointInputSchemas.getBucketsTodos,
		output: BasecampEndpointOutputSchemas.getBucketsTodos,
	},
	'todos.getBucketsTodosets': {
		input: BasecampEndpointInputSchemas.getBucketsTodosets,
		output: BasecampEndpointOutputSchemas.getBucketsTodosets,
	},
	'todos.getBucketsTodosetsTodolists': {
		input: BasecampEndpointInputSchemas.getBucketsTodosetsTodolists,
		output: BasecampEndpointOutputSchemas.getBucketsTodosetsTodolists,
	},
	'todos.getTodo': {
		input: BasecampEndpointInputSchemas.getTodo,
		output: BasecampEndpointOutputSchemas.getTodo,
	},
	'todos.getTodolist': {
		input: BasecampEndpointInputSchemas.getTodolist,
		output: BasecampEndpointOutputSchemas.getTodolist,
	},
	'todos.getTodolistGroups': {
		input: BasecampEndpointInputSchemas.getTodolistGroups,
		output: BasecampEndpointOutputSchemas.getTodolistGroups,
	},
	'todos.getTodoset': {
		input: BasecampEndpointInputSchemas.getTodoset,
		output: BasecampEndpointOutputSchemas.getTodoset,
	},
	'todos.listTodolists': {
		input: BasecampEndpointInputSchemas.listTodolists,
		output: BasecampEndpointOutputSchemas.listTodolists,
	},
	'todos.postBucketsTodolistsComments': {
		input: BasecampEndpointInputSchemas.postBucketsTodolistsComments,
		output: BasecampEndpointOutputSchemas.postBucketsTodolistsComments,
	},
	'todos.postBucketsTodolistsTodos': {
		input: BasecampEndpointInputSchemas.postBucketsTodolistsTodos,
		output: BasecampEndpointOutputSchemas.postBucketsTodolistsTodos,
	},
	'todos.postBucketsTodosComments': {
		input: BasecampEndpointInputSchemas.postBucketsTodosComments,
		output: BasecampEndpointOutputSchemas.postBucketsTodosComments,
	},
	'todos.postBucketsTodosetsTodolists': {
		input: BasecampEndpointInputSchemas.postBucketsTodosetsTodolists,
		output: BasecampEndpointOutputSchemas.postBucketsTodosetsTodolists,
	},
	'todos.putBucketsTodolistsGroupsPosition': {
		input: BasecampEndpointInputSchemas.putBucketsTodolistsGroupsPosition,
		output: BasecampEndpointOutputSchemas.putBucketsTodolistsGroupsPosition,
	},
	'todos.putBucketsTodos': {
		input: BasecampEndpointInputSchemas.putBucketsTodos,
		output: BasecampEndpointOutputSchemas.putBucketsTodos,
	},
	'todos.putBucketsTodosPosition': {
		input: BasecampEndpointInputSchemas.putBucketsTodosPosition,
		output: BasecampEndpointOutputSchemas.putBucketsTodosPosition,
	},
	'todos.uncompleteTodo': {
		input: BasecampEndpointInputSchemas.uncompleteTodo,
		output: BasecampEndpointOutputSchemas.uncompleteTodo,
	},
	'todos.updateTodo': {
		input: BasecampEndpointInputSchemas.updateTodo,
		output: BasecampEndpointOutputSchemas.updateTodo,
	},
	'messages.deleteMessageType': {
		input: BasecampEndpointInputSchemas.deleteMessageType,
		output: BasecampEndpointOutputSchemas.deleteMessageType,
	},
	'messages.getBucketsCategories': {
		input: BasecampEndpointInputSchemas.getBucketsCategories,
		output: BasecampEndpointOutputSchemas.getBucketsCategories,
	},
	'messages.getBucketsMessageBoardsMessages': {
		input: BasecampEndpointInputSchemas.getBucketsMessageBoardsMessages,
		output: BasecampEndpointOutputSchemas.getBucketsMessageBoardsMessages,
	},
	'messages.getMessage': {
		input: BasecampEndpointInputSchemas.getMessage,
		output: BasecampEndpointOutputSchemas.getMessage,
	},
	'messages.getMessageBoard': {
		input: BasecampEndpointInputSchemas.getMessageBoard,
		output: BasecampEndpointOutputSchemas.getMessageBoard,
	},
	'messages.getMessageType': {
		input: BasecampEndpointInputSchemas.getMessageType,
		output: BasecampEndpointOutputSchemas.getMessageType,
	},
	'messages.listMessageTypes': {
		input: BasecampEndpointInputSchemas.listMessageTypes,
		output: BasecampEndpointOutputSchemas.listMessageTypes,
	},
	'messages.pinMessage': {
		input: BasecampEndpointInputSchemas.pinMessage,
		output: BasecampEndpointOutputSchemas.pinMessage,
	},
	'messages.postBucketsCategories': {
		input: BasecampEndpointInputSchemas.postBucketsCategories,
		output: BasecampEndpointOutputSchemas.postBucketsCategories,
	},
	'messages.postBucketsMessageBoardsMessages': {
		input: BasecampEndpointInputSchemas.postBucketsMessageBoardsMessages,
		output: BasecampEndpointOutputSchemas.postBucketsMessageBoardsMessages,
	},
	'messages.putBucketsCategories': {
		input: BasecampEndpointInputSchemas.putBucketsCategories,
		output: BasecampEndpointOutputSchemas.putBucketsCategories,
	},
	'messages.putBucketsMessages': {
		input: BasecampEndpointInputSchemas.putBucketsMessages,
		output: BasecampEndpointOutputSchemas.putBucketsMessages,
	},
	'messages.unpinMessage': {
		input: BasecampEndpointInputSchemas.unpinMessage,
		output: BasecampEndpointOutputSchemas.unpinMessage,
	},
	'messages.updateMessageType': {
		input: BasecampEndpointInputSchemas.updateMessageType,
		output: BasecampEndpointOutputSchemas.updateMessageType,
	},
	'documentsAndFiles.createDocument': {
		input: BasecampEndpointInputSchemas.createDocument,
		output: BasecampEndpointOutputSchemas.createDocument,
	},
	'documentsAndFiles.createUpload': {
		input: BasecampEndpointInputSchemas.createUpload,
		output: BasecampEndpointOutputSchemas.createUpload,
	},
	'documentsAndFiles.createVault': {
		input: BasecampEndpointInputSchemas.createVault,
		output: BasecampEndpointOutputSchemas.createVault,
	},
	'documentsAndFiles.getBucketsUploads': {
		input: BasecampEndpointInputSchemas.getBucketsUploads,
		output: BasecampEndpointOutputSchemas.getBucketsUploads,
	},
	'documentsAndFiles.getBucketsVaults': {
		input: BasecampEndpointInputSchemas.getBucketsVaults,
		output: BasecampEndpointOutputSchemas.getBucketsVaults,
	},
	'documentsAndFiles.getBucketsVaultsDocuments': {
		input: BasecampEndpointInputSchemas.getBucketsVaultsDocuments,
		output: BasecampEndpointOutputSchemas.getBucketsVaultsDocuments,
	},
	'documentsAndFiles.getBucketsVaultsUploads': {
		input: BasecampEndpointInputSchemas.getBucketsVaultsUploads,
		output: BasecampEndpointOutputSchemas.getBucketsVaultsUploads,
	},
	'documentsAndFiles.getBucketsVaultsVaults': {
		input: BasecampEndpointInputSchemas.getBucketsVaultsVaults,
		output: BasecampEndpointOutputSchemas.getBucketsVaultsVaults,
	},
	'documentsAndFiles.getDocument': {
		input: BasecampEndpointInputSchemas.getDocument,
		output: BasecampEndpointOutputSchemas.getDocument,
	},
	'documentsAndFiles.getUpload': {
		input: BasecampEndpointInputSchemas.getUpload,
		output: BasecampEndpointOutputSchemas.getUpload,
	},
	'documentsAndFiles.getVault': {
		input: BasecampEndpointInputSchemas.getVault,
		output: BasecampEndpointOutputSchemas.getVault,
	},
	'documentsAndFiles.listUploads': {
		input: BasecampEndpointInputSchemas.listUploads,
		output: BasecampEndpointOutputSchemas.listUploads,
	},
	'documentsAndFiles.listVaults': {
		input: BasecampEndpointInputSchemas.listVaults,
		output: BasecampEndpointOutputSchemas.listVaults,
	},
	'documentsAndFiles.postAttachments': {
		input: BasecampEndpointInputSchemas.postAttachments,
		output: BasecampEndpointOutputSchemas.postAttachments,
	},
	'documentsAndFiles.putBucketsDocuments': {
		input: BasecampEndpointInputSchemas.putBucketsDocuments,
		output: BasecampEndpointOutputSchemas.putBucketsDocuments,
	},
	'documentsAndFiles.putBucketsUploads': {
		input: BasecampEndpointInputSchemas.putBucketsUploads,
		output: BasecampEndpointOutputSchemas.putBucketsUploads,
	},
	'documentsAndFiles.putBucketsVaults': {
		input: BasecampEndpointInputSchemas.putBucketsVaults,
		output: BasecampEndpointOutputSchemas.putBucketsVaults,
	},
	'documentsAndFiles.updateDocument': {
		input: BasecampEndpointInputSchemas.updateDocument,
		output: BasecampEndpointOutputSchemas.updateDocument,
	},
	'documentsAndFiles.updateUpload': {
		input: BasecampEndpointInputSchemas.updateUpload,
		output: BasecampEndpointOutputSchemas.updateUpload,
	},
	'documentsAndFiles.updateVault': {
		input: BasecampEndpointInputSchemas.updateVault,
		output: BasecampEndpointOutputSchemas.updateVault,
	},
	'campfireAndChatbots.createChatbot': {
		input: BasecampEndpointInputSchemas.createChatbot,
		output: BasecampEndpointOutputSchemas.createChatbot,
	},
	'campfireAndChatbots.createChatbotLine': {
		input: BasecampEndpointInputSchemas.createChatbotLine,
		output: BasecampEndpointOutputSchemas.createChatbotLine,
	},
	'campfireAndChatbots.deleteCampfireLine': {
		input: BasecampEndpointInputSchemas.deleteCampfireLine,
		output: BasecampEndpointOutputSchemas.deleteCampfireLine,
	},
	'campfireAndChatbots.deleteChatbot': {
		input: BasecampEndpointInputSchemas.deleteChatbot,
		output: BasecampEndpointOutputSchemas.deleteChatbot,
	},
	'campfireAndChatbots.getBucketsChatsIntegrations': {
		input: BasecampEndpointInputSchemas.getBucketsChatsIntegrations,
		output: BasecampEndpointOutputSchemas.getBucketsChatsIntegrations,
	},
	'campfireAndChatbots.getBucketsChatsLines': {
		input: BasecampEndpointInputSchemas.getBucketsChatsLines,
		output: BasecampEndpointOutputSchemas.getBucketsChatsLines,
	},
	'campfireAndChatbots.getCampfire': {
		input: BasecampEndpointInputSchemas.getCampfire,
		output: BasecampEndpointOutputSchemas.getCampfire,
	},
	'campfireAndChatbots.getCampfireLine': {
		input: BasecampEndpointInputSchemas.getCampfireLine,
		output: BasecampEndpointOutputSchemas.getCampfireLine,
	},
	'campfireAndChatbots.getChatbot': {
		input: BasecampEndpointInputSchemas.getChatbot,
		output: BasecampEndpointOutputSchemas.getChatbot,
	},
	'campfireAndChatbots.getChats': {
		input: BasecampEndpointInputSchemas.getChats,
		output: BasecampEndpointOutputSchemas.getChats,
	},
	'campfireAndChatbots.listCampfireLines': {
		input: BasecampEndpointInputSchemas.listCampfireLines,
		output: BasecampEndpointOutputSchemas.listCampfireLines,
	},
	'campfireAndChatbots.listChatbots': {
		input: BasecampEndpointInputSchemas.listChatbots,
		output: BasecampEndpointOutputSchemas.listChatbots,
	},
	'campfireAndChatbots.postBucketsChatsLines': {
		input: BasecampEndpointInputSchemas.postBucketsChatsLines,
		output: BasecampEndpointOutputSchemas.postBucketsChatsLines,
	},
	'campfireAndChatbots.postIntegrationsChatbotKeyBucketsChatsLines': {
		input:
			BasecampEndpointInputSchemas.postIntegrationsChatbotKeyBucketsChatsLines,
		output:
			BasecampEndpointOutputSchemas.postIntegrationsChatbotKeyBucketsChatsLines,
	},
	'campfireAndChatbots.putBucketsChatsIntegrations': {
		input: BasecampEndpointInputSchemas.putBucketsChatsIntegrations,
		output: BasecampEndpointOutputSchemas.putBucketsChatsIntegrations,
	},
	'campfireAndChatbots.updateChatbot': {
		input: BasecampEndpointInputSchemas.updateChatbot,
		output: BasecampEndpointOutputSchemas.updateChatbot,
	},
	'cardTables.createCard': {
		input: BasecampEndpointInputSchemas.createCard,
		output: BasecampEndpointOutputSchemas.createCard,
	},
	'cardTables.createCardStep': {
		input: BasecampEndpointInputSchemas.createCardStep,
		output: BasecampEndpointOutputSchemas.createCardStep,
	},
	'cardTables.deleteBucketsCardTablesColumnsOnHold': {
		input: BasecampEndpointInputSchemas.deleteBucketsCardTablesColumnsOnHold,
		output: BasecampEndpointOutputSchemas.deleteBucketsCardTablesColumnsOnHold,
	},
	'cardTables.getBucketsCardTablesListsCards': {
		input: BasecampEndpointInputSchemas.getBucketsCardTablesListsCards,
		output: BasecampEndpointOutputSchemas.getBucketsCardTablesListsCards,
	},
	'cardTables.getCard': {
		input: BasecampEndpointInputSchemas.getCard,
		output: BasecampEndpointOutputSchemas.getCard,
	},
	'cardTables.getCardTable': {
		input: BasecampEndpointInputSchemas.getCardTable,
		output: BasecampEndpointOutputSchemas.getCardTable,
	},
	'cardTables.getCardTableColumn': {
		input: BasecampEndpointInputSchemas.getCardTableColumn,
		output: BasecampEndpointOutputSchemas.getCardTableColumn,
	},
	'cardTables.listCards': {
		input: BasecampEndpointInputSchemas.listCards,
		output: BasecampEndpointOutputSchemas.listCards,
	},
	'cardTables.moveCard': {
		input: BasecampEndpointInputSchemas.moveCard,
		output: BasecampEndpointOutputSchemas.moveCard,
	},
	'cardTables.moveCardTableColumn': {
		input: BasecampEndpointInputSchemas.moveCardTableColumn,
		output: BasecampEndpointOutputSchemas.moveCardTableColumn,
	},
	'cardTables.postBucketsCardTablesCardsMoves': {
		input: BasecampEndpointInputSchemas.postBucketsCardTablesCardsMoves,
		output: BasecampEndpointOutputSchemas.postBucketsCardTablesCardsMoves,
	},
	'cardTables.postBucketsCardTablesCardsPositions': {
		input: BasecampEndpointInputSchemas.postBucketsCardTablesCardsPositions,
		output: BasecampEndpointOutputSchemas.postBucketsCardTablesCardsPositions,
	},
	'cardTables.postBucketsCardTablesColumns': {
		input: BasecampEndpointInputSchemas.postBucketsCardTablesColumns,
		output: BasecampEndpointOutputSchemas.postBucketsCardTablesColumns,
	},
	'cardTables.postBucketsCardTablesColumnsOnHold': {
		input: BasecampEndpointInputSchemas.postBucketsCardTablesColumnsOnHold,
		output: BasecampEndpointOutputSchemas.postBucketsCardTablesColumnsOnHold,
	},
	'cardTables.postBucketsCardTablesMoves': {
		input: BasecampEndpointInputSchemas.postBucketsCardTablesMoves,
		output: BasecampEndpointOutputSchemas.postBucketsCardTablesMoves,
	},
	'cardTables.putBucketsCardTablesCards': {
		input: BasecampEndpointInputSchemas.putBucketsCardTablesCards,
		output: BasecampEndpointOutputSchemas.putBucketsCardTablesCards,
	},
	'cardTables.putBucketsCardTablesColumns': {
		input: BasecampEndpointInputSchemas.putBucketsCardTablesColumns,
		output: BasecampEndpointOutputSchemas.putBucketsCardTablesColumns,
	},
	'cardTables.putBucketsCardTablesColumnsColor': {
		input: BasecampEndpointInputSchemas.putBucketsCardTablesColumnsColor,
		output: BasecampEndpointOutputSchemas.putBucketsCardTablesColumnsColor,
	},
	'cardTables.putBucketsCardTablesSteps': {
		input: BasecampEndpointInputSchemas.putBucketsCardTablesSteps,
		output: BasecampEndpointOutputSchemas.putBucketsCardTablesSteps,
	},
	'cardTables.putBucketsCardTablesStepsCompletions': {
		input: BasecampEndpointInputSchemas.putBucketsCardTablesStepsCompletions,
		output: BasecampEndpointOutputSchemas.putBucketsCardTablesStepsCompletions,
	},
	'cardTables.repositionCardStep': {
		input: BasecampEndpointInputSchemas.repositionCardStep,
		output: BasecampEndpointOutputSchemas.repositionCardStep,
	},
	'cardTables.unwatchCardTableColumn': {
		input: BasecampEndpointInputSchemas.unwatchCardTableColumn,
		output: BasecampEndpointOutputSchemas.unwatchCardTableColumn,
	},
	'cardTables.updateCard': {
		input: BasecampEndpointInputSchemas.updateCard,
		output: BasecampEndpointOutputSchemas.updateCard,
	},
	'cardTables.updateCardTableColumn': {
		input: BasecampEndpointInputSchemas.updateCardTableColumn,
		output: BasecampEndpointOutputSchemas.updateCardTableColumn,
	},
	'cardTables.watchCardTableColumn': {
		input: BasecampEndpointInputSchemas.watchCardTableColumn,
		output: BasecampEndpointOutputSchemas.watchCardTableColumn,
	},
	'schedulesAndReports.getBucketsSchedulesEntries': {
		input: BasecampEndpointInputSchemas.getBucketsSchedulesEntries,
		output: BasecampEndpointOutputSchemas.getBucketsSchedulesEntries,
	},
	'schedulesAndReports.getReportsTimesheet': {
		input: BasecampEndpointInputSchemas.getReportsTimesheet,
		output: BasecampEndpointOutputSchemas.getReportsTimesheet,
	},
	'schedulesAndReports.getSchedule': {
		input: BasecampEndpointInputSchemas.getSchedule,
		output: BasecampEndpointOutputSchemas.getSchedule,
	},
	'schedulesAndReports.getScheduleEntry': {
		input: BasecampEndpointInputSchemas.getScheduleEntry,
		output: BasecampEndpointOutputSchemas.getScheduleEntry,
	},
	'schedulesAndReports.postBucketsSchedulesEntries': {
		input: BasecampEndpointInputSchemas.postBucketsSchedulesEntries,
		output: BasecampEndpointOutputSchemas.postBucketsSchedulesEntries,
	},
	'schedulesAndReports.putBucketsScheduleEntries': {
		input: BasecampEndpointInputSchemas.putBucketsScheduleEntries,
		output: BasecampEndpointOutputSchemas.putBucketsScheduleEntries,
	},
	'schedulesAndReports.putBucketsSchedules': {
		input: BasecampEndpointInputSchemas.putBucketsSchedules,
		output: BasecampEndpointOutputSchemas.putBucketsSchedules,
	},
	'schedulesAndReports.updateScheduleEntry': {
		input: BasecampEndpointInputSchemas.updateScheduleEntry,
		output: BasecampEndpointOutputSchemas.updateScheduleEntry,
	},
	'automaticCheckIns.getBucketsQuestionAnswers': {
		input: BasecampEndpointInputSchemas.getBucketsQuestionAnswers,
		output: BasecampEndpointOutputSchemas.getBucketsQuestionAnswers,
	},
	'automaticCheckIns.getBucketsQuestionnaires': {
		input: BasecampEndpointInputSchemas.getBucketsQuestionnaires,
		output: BasecampEndpointOutputSchemas.getBucketsQuestionnaires,
	},
	'automaticCheckIns.getBucketsQuestionnairesQuestions': {
		input: BasecampEndpointInputSchemas.getBucketsQuestionnairesQuestions,
		output: BasecampEndpointOutputSchemas.getBucketsQuestionnairesQuestions,
	},
	'automaticCheckIns.getBucketsQuestions': {
		input: BasecampEndpointInputSchemas.getBucketsQuestions,
		output: BasecampEndpointOutputSchemas.getBucketsQuestions,
	},
	'automaticCheckIns.listQuestions': {
		input: BasecampEndpointInputSchemas.listQuestions,
		output: BasecampEndpointOutputSchemas.listQuestions,
	},
	'inboxesAndForwards.getBucketsInboxesForwards': {
		input: BasecampEndpointInputSchemas.getBucketsInboxesForwards,
		output: BasecampEndpointOutputSchemas.getBucketsInboxesForwards,
	},
	'inboxesAndForwards.getInbox': {
		input: BasecampEndpointInputSchemas.getInbox,
		output: BasecampEndpointOutputSchemas.getInbox,
	},
	'inboxesAndForwards.listForwards': {
		input: BasecampEndpointInputSchemas.listForwards,
		output: BasecampEndpointOutputSchemas.listForwards,
	},
	'recordingsAndSubscriptions.deleteBucketsRecordingsPin': {
		input: BasecampEndpointInputSchemas.deleteBucketsRecordingsPin,
		output: BasecampEndpointOutputSchemas.deleteBucketsRecordingsPin,
	},
	'recordingsAndSubscriptions.getBucketsRecordingsComments': {
		input: BasecampEndpointInputSchemas.getBucketsRecordingsComments,
		output: BasecampEndpointOutputSchemas.getBucketsRecordingsComments,
	},
	'recordingsAndSubscriptions.getBucketsRecordingsEvents': {
		input: BasecampEndpointInputSchemas.getBucketsRecordingsEvents,
		output: BasecampEndpointOutputSchemas.getBucketsRecordingsEvents,
	},
	'recordingsAndSubscriptions.getComment': {
		input: BasecampEndpointInputSchemas.getComment,
		output: BasecampEndpointOutputSchemas.getComment,
	},
	'recordingsAndSubscriptions.getProjectsRecordings': {
		input: BasecampEndpointInputSchemas.getProjectsRecordings,
		output: BasecampEndpointOutputSchemas.getProjectsRecordings,
	},
	'recordingsAndSubscriptions.getSubscription': {
		input: BasecampEndpointInputSchemas.getSubscription,
		output: BasecampEndpointOutputSchemas.getSubscription,
	},
	'recordingsAndSubscriptions.listComments': {
		input: BasecampEndpointInputSchemas.listComments,
		output: BasecampEndpointOutputSchemas.listComments,
	},
	'recordingsAndSubscriptions.listEvents': {
		input: BasecampEndpointInputSchemas.listEvents,
		output: BasecampEndpointOutputSchemas.listEvents,
	},
	'recordingsAndSubscriptions.postBucketsRecordingsComments': {
		input: BasecampEndpointInputSchemas.postBucketsRecordingsComments,
		output: BasecampEndpointOutputSchemas.postBucketsRecordingsComments,
	},
	'recordingsAndSubscriptions.postBucketsRecordingsPin': {
		input: BasecampEndpointInputSchemas.postBucketsRecordingsPin,
		output: BasecampEndpointOutputSchemas.postBucketsRecordingsPin,
	},
	'recordingsAndSubscriptions.postBucketsRecordingsSubscription': {
		input: BasecampEndpointInputSchemas.postBucketsRecordingsSubscription,
		output: BasecampEndpointOutputSchemas.postBucketsRecordingsSubscription,
	},
	'recordingsAndSubscriptions.putBucketsComments': {
		input: BasecampEndpointInputSchemas.putBucketsComments,
		output: BasecampEndpointOutputSchemas.putBucketsComments,
	},
	'recordingsAndSubscriptions.putBucketsRecordingsClientVisibility': {
		input: BasecampEndpointInputSchemas.putBucketsRecordingsClientVisibility,
		output: BasecampEndpointOutputSchemas.putBucketsRecordingsClientVisibility,
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusActive': {
		input: BasecampEndpointInputSchemas.putBucketsRecordingsStatusActive,
		output: BasecampEndpointOutputSchemas.putBucketsRecordingsStatusActive,
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusArchived': {
		input: BasecampEndpointInputSchemas.putBucketsRecordingsStatusArchived,
		output: BasecampEndpointOutputSchemas.putBucketsRecordingsStatusArchived,
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusTrashed': {
		input: BasecampEndpointInputSchemas.putBucketsRecordingsStatusTrashed,
		output: BasecampEndpointOutputSchemas.putBucketsRecordingsStatusTrashed,
	},
	'recordingsAndSubscriptions.putBucketsRecordingsSubscription': {
		input: BasecampEndpointInputSchemas.putBucketsRecordingsSubscription,
		output: BasecampEndpointOutputSchemas.putBucketsRecordingsSubscription,
	},
	'recordingsAndSubscriptions.subscribeCurrentUser': {
		input: BasecampEndpointInputSchemas.subscribeCurrentUser,
		output: BasecampEndpointOutputSchemas.subscribeCurrentUser,
	},
	'recordingsAndSubscriptions.toggleClientVisibility': {
		input: BasecampEndpointInputSchemas.toggleClientVisibility,
		output: BasecampEndpointOutputSchemas.toggleClientVisibility,
	},
	'recordingsAndSubscriptions.unsubscribeCurrentUser': {
		input: BasecampEndpointInputSchemas.unsubscribeCurrentUser,
		output: BasecampEndpointOutputSchemas.unsubscribeCurrentUser,
	},
	'webhooks.deleteWebhooks': {
		input: BasecampEndpointInputSchemas.deleteWebhooks,
		output: BasecampEndpointOutputSchemas.deleteWebhooks,
	},
	'webhooks.getBucketsWebhooks': {
		input: BasecampEndpointInputSchemas.getBucketsWebhooks,
		output: BasecampEndpointOutputSchemas.getBucketsWebhooks,
	},
	'webhooks.getWebhook': {
		input: BasecampEndpointInputSchemas.getWebhook,
		output: BasecampEndpointOutputSchemas.getWebhook,
	},
	'webhooks.postBucketsWebhooks': {
		input: BasecampEndpointInputSchemas.postBucketsWebhooks,
		output: BasecampEndpointOutputSchemas.postBucketsWebhooks,
	},
	'webhooks.putBucketsWebhooks': {
		input: BasecampEndpointInputSchemas.putBucketsWebhooks,
		output: BasecampEndpointOutputSchemas.putBucketsWebhooks,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof basecampEndpointsNested
>;

export const basecampEndpointMeta = {
	'projectsAndTemplates.createProjectConstruction': {
		riskLevel: 'write',
		description:
			"Tool to create a new project from a Basecamp template asynchronously. Use when you need to instantiate a project based on an existing template. Poll the returned URL to monitor construction progress until status becomes 'completed'.",
	},
	'projectsAndTemplates.getProject': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific project by its ID with complete details. Use when you need to get comprehensive information about a particular project including its status, metadata, and dock tools configuration.',
	},
	'projectsAndTemplates.getProjects': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of projects visible to the current user, sorted by most recently created first. Use when you need to list all projects, filter by status (active/archived/trashed), or access project details.',
	},
	'projectsAndTemplates.getProjectsByProjectId': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a single project by its ID with full details including dock tools. Use when you need to get information about a specific project that the user has access to.',
	},
	'projectsAndTemplates.getTemplates': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active templates visible to the current user, sorted by most recently created first. Use when you need to list templates or filter by status (active/archived/trashed).',
	},
	'projectsAndTemplates.getTemplatesByTemplateId': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a single template by its ID with full details including dock tools. Use when you need to get information about a specific template that the user has access to.',
	},
	'projectsAndTemplates.getTemplatesProjectConstructions': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the status of a project construction from a template. Use when you need to monitor the progress of a project being created from a template. Can be polled at intervals (no more than once per second) to track construction status.',
	},
	'projectsAndTemplates.postLineupMarkers': {
		riskLevel: 'write',
		description:
			'Tool to create an account-wide marker that shows up in the Lineup. Use when you need to add a visual marker to highlight important dates or milestones across all projects.',
	},
	'projectsAndTemplates.postProjects': {
		riskLevel: 'write',
		description:
			'Tool to create a new project in Basecamp with a name and optional description. Use when you need to set up a new project workspace for team collaboration.',
	},
	'projectsAndTemplates.postTemplates': {
		riskLevel: 'write',
		description:
			'Tool to create a new template in Basecamp with a name and optional description. Use when you need to set up a reusable project template for standardizing workflows.',
	},
	'projectsAndTemplates.putProjects': {
		riskLevel: 'write',
		description:
			"Tool to update an existing project's name, description, access policy, or schedule in Basecamp. Use when you need to modify project details or settings. Note: name parameter is required; schedule dates must be provided as pairs (both start_date and end_date).",
	},
	'projectsAndTemplates.putTemplates': {
		riskLevel: 'write',
		description:
			"Tool to update a template's name and description in Basecamp. Use when you need to modify template metadata. Omitted parameters remain unchanged.",
	},
	'projectsAndTemplates.trashProject': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to mark a Basecamp project as trashed. Use when you need to trash a project. Trashed projects will be permanently deleted after 30 days.',
	},
	'projectsAndTemplates.trashTemplate': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to mark a template as trashed in Basecamp. Use when you need to soft-delete a template; it will be permanently removed after 30 days.',
	},
	'peopleAndAccess.getCirclesPeople': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all people on this Basecamp account who can be pinged. Use when you need to get a list of all pingable users in the account.',
	},
	'peopleAndAccess.getMyProfile': {
		riskLevel: 'read',
		description:
			"Tool to retrieve the current user's personal info including profile details, permissions, and settings. Use when you need to get information about the authenticated user.",
	},
	'peopleAndAccess.getPeople': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all people visible to the current user in the Basecamp account. Use when you need to list users, check permissions, or get contact information for team members.',
	},
	'peopleAndAccess.getPeopleByPersonId': {
		riskLevel: 'read',
		description:
			'Tool to retrieve the profile for a specific user by their ID. Use when you need to get detailed information about a specific person in the Basecamp account.',
	},
	'peopleAndAccess.getPerson': {
		riskLevel: 'read',
		description:
			"Tool to retrieve a specific person's profile by their ID. Use when you need detailed information about a specific person in the Basecamp account.",
	},
	'peopleAndAccess.getProjectsPeople': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all active people assigned to a Basecamp project. Use when you need to list all members who have access to a specific project.',
	},
	'peopleAndAccess.listProjectPeople': {
		riskLevel: 'read',
		description:
			'Tool to get all people on a specific Basecamp project. Use when you need to retrieve the list of active members who have access to a particular project.',
	},
	'peopleAndAccess.putProjectsPeopleUsers': {
		riskLevel: 'write',
		description:
			'Tool to grant or revoke project access for users in Basecamp. Use when you need to add existing users to a project, create new users with access, or remove users from a project. At least one of grant, revoke, or create must be provided.',
	},
	'todos.completeTodo': {
		riskLevel: 'write',
		description:
			'Tool to mark a to-do as completed in Basecamp. Use when you need to complete a to-do item.',
	},
	'todos.createTodo': {
		riskLevel: 'write',
		description:
			'DEPRECATED: Use BASECAMP_POST_BUCKETS_TODOLISTS_TODOS instead. Tool to create a new to-do in a Basecamp to-do list. Use when you need to add a task with optional description, assignees, and due date.',
	},
	'todos.createTodolistGroup': {
		riskLevel: 'write',
		description:
			'Tool to create a new to-do group within a parent to-do list in Basecamp. Use when organizing todos into groups with optional color coding.',
	},
	'todos.getBucketsTodolists': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do list from a Basecamp project by its ID. Use when you need to get details about a to-do list including its title, description, completion status, and URLs for todos and groups.',
	},
	'todos.getBucketsTodolistsGroups': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active groups from a to-do list in a Basecamp project. Use when you need to list all groups within a specific to-do list for organizing tasks.',
	},
	'todos.getBucketsTodolistsTodos': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of to-dos from a specific to-do list in a Basecamp project. Use when you need to fetch to-do items from a to-do list, optionally filtering by status or completion state.',
	},
	'todos.getBucketsTodos': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do by ID from a Basecamp project. Use when you need to fetch a single to-do item including its content, title, assignees, completion status, and dates.',
	},
	'todos.getBucketsTodosets': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do set from a Basecamp project. Use when you need to get details about a to-do set, including its completion status, to-do lists count, and associated URLs.',
	},
	'todos.getBucketsTodosetsTodolists': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of to-do lists within a specific to-do set in a Basecamp project. Use when you need to fetch all to-do lists from a to-do set, optionally filtering by status.',
	},
	'todos.getTodo': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do by ID from a Basecamp project. Use when you need to fetch detailed information about a single to-do item including its content, title, assignees, completion status, dates, and parent relationships.',
	},
	'todos.getTodolist': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do list from a Basecamp project by its ID. Use when you need to get details about a to-do list including its title, description, completion status, and URLs for todos and groups.',
	},
	'todos.getTodolistGroups': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of groups from a to-do list in a Basecamp project. Use when you need to list groups (sub-sections) within a specific to-do list for organizing tasks.',
	},
	'todos.getTodoset': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific to-do set from a Basecamp project. Use when you need to get details about a to-do set, including its completion status and to-do lists count.',
	},
	'todos.listTodolists': {
		riskLevel: 'read',
		description:
			'Tool to get all to-do lists in a to-do set within a Basecamp project. Use when you need to retrieve all to-do lists from a specific to-do set, optionally filtering by status (archived or trashed).',
	},
	'todos.postBucketsTodolistsComments': {
		riskLevel: 'write',
		description:
			'Tool to add a comment to a to-do list in a Basecamp project. Use when you need to comment on a todolist with feedback, updates, or discussions. All subscribers to the to-do list will be notified.',
	},
	'todos.postBucketsTodolistsTodos': {
		riskLevel: 'write',
		description:
			'Tool to create a to-do in a Basecamp to-do list within a project. Use when you need to add a new to-do item with optional description, assignees, and due date.',
	},
	'todos.postBucketsTodosComments': {
		riskLevel: 'write',
		description:
			'Tool to add a comment to a to-do in a Basecamp project. Use when you need to add feedback, updates, or discussion to a specific to-do item.',
	},
	'todos.postBucketsTodosetsTodolists': {
		riskLevel: 'write',
		description:
			'Tool to create a new to-do list in a Basecamp to-do set within a project. Use when you need to add a new to-do list with optional HTML description.',
	},
	'todos.putBucketsTodolistsGroupsPosition': {
		riskLevel: 'write',
		description:
			'Tool to reposition a to-do list group within its parent to-do list in a Basecamp project. Use when you need to change the order of to-do list groups by moving a group to a specific position.',
	},
	'todos.putBucketsTodos': {
		riskLevel: 'write',
		description:
			"Tool to update an existing to-do in a Basecamp project. Use when you need to modify a to-do's content, description, assignees, dates, or notification settings. Note: Pass all existing parameters along with those being updated to prevent clearing values.",
	},
	'todos.putBucketsTodosPosition': {
		riskLevel: 'write',
		description:
			'Tool to change the position of a to-do within its list in a Basecamp project. Use when you need to reorder to-dos by moving a specific to-do to a new position.',
	},
	'todos.uncompleteTodo': {
		riskLevel: 'write',
		description:
			'Tool to mark a to-do as uncompleted in Basecamp. Use when you need to reverse the completion status of a completed to-do item.',
	},
	'todos.updateTodo': {
		riskLevel: 'write',
		description:
			"Tool to update a to-do's content, assignees, or due date in a Basecamp project. Use when you need to modify an existing to-do item. Pass all existing parameters along with those being updated to prevent clearing values.",
	},
	'messages.deleteMessageType': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a message type from a Basecamp project. Use when removing a custom message category. Permanently removes the specified message type.',
	},
	'messages.getBucketsCategories': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all message types (categories) from a Basecamp project. Use when you need to list all available message categories for organizing messages in a project.',
	},
	'messages.getBucketsMessageBoardsMessages': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active messages from a message board in a Basecamp project. Use when you need to fetch messages from a specific message board.',
	},
	'messages.getMessage': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific message by ID from a Basecamp project message board. Use when you need to fetch details of a single message including its content, author, and metadata.',
	},
	'messages.getMessageBoard': {
		riskLevel: 'read',
		description:
			'Tool to get the message board for a project. Use when you need to retrieve details about a specific message board including its title, creator, message count, and URLs.',
	},
	'messages.getMessageType': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific message type by ID from a Basecamp project. Use when you need details about a specific message type/category.',
	},
	'messages.listMessageTypes': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all message types in a Basecamp project. Use when you need to list all available message types for organizing messages in a project.',
	},
	'messages.pinMessage': {
		riskLevel: 'write',
		description:
			'Tool to pin a message to the top of the message board. Use when you need to feature a message prominently at the top of a message board in a project.',
	},
	'messages.postBucketsCategories': {
		riskLevel: 'write',
		description:
			'Tool to create a new message type (category) in a Basecamp project. Use when you need to create a custom message category for organizing different types of messages in a project.',
	},
	'messages.postBucketsMessageBoardsMessages': {
		riskLevel: 'write',
		description:
			'Tool to publish a message to a Basecamp message board within a project. Use when you need to create a new message with optional rich HTML content and subscriptions.',
	},
	'messages.putBucketsCategories': {
		riskLevel: 'write',
		description:
			'Tool to update an existing message type (category) in a Basecamp project. Use when you need to modify the name or icon of a message category.',
	},
	'messages.putBucketsMessages': {
		riskLevel: 'write',
		description:
			"Tool to update a message's subject, content, or category in a Basecamp project. Use when you need to modify an existing message's title, body text, or categorization.",
	},
	'messages.unpinMessage': {
		riskLevel: 'write',
		description:
			'Tool to unpin a message from the message board. Use when you need to remove the pinned status from a message that was previously pinned to the top of a message board.',
	},
	'messages.updateMessageType': {
		riskLevel: 'write',
		description:
			'Tool to update an existing message type in a Basecamp project. Use when you need to modify the name or icon of a message category.',
	},
	'documentsAndFiles.createDocument': {
		riskLevel: 'write',
		description:
			'Tool to create a new document in a Basecamp vault. Use when you need to publish a document in a specific project vault with title, HTML content, and optional publication status.',
	},
	'documentsAndFiles.createUpload': {
		riskLevel: 'write',
		description:
			'Tool to create a new upload (file) in a Basecamp vault. Use when you need to create an upload entry for a previously uploaded attachment in a specific project vault.',
	},
	'documentsAndFiles.createVault': {
		riskLevel: 'write',
		description:
			'Tool to create a new vault (folder) within an existing parent vault in a Basecamp project. Use when you need to organize documents and files hierarchically by creating nested vaults.',
	},
	'documentsAndFiles.getBucketsUploads': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific upload by ID from a Basecamp project vault. Use when you need to fetch details about an uploaded file including its metadata, download URL, and dimensions.',
	},
	'documentsAndFiles.getBucketsVaults': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific vault from a Basecamp project. Use when you need details about a vault including its documents, uploads, and nested vaults.',
	},
	'documentsAndFiles.getBucketsVaultsDocuments': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active documents from a vault in a Basecamp project. Use when you need to fetch all documents stored in a specific vault.',
	},
	'documentsAndFiles.getBucketsVaultsUploads': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active uploads from a vault in a Basecamp project. Use when you need to fetch all uploaded files stored in a specific vault.',
	},
	'documentsAndFiles.getBucketsVaultsVaults': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of vaults nested within a parent vault in a Basecamp project. Use when you need to fetch child vaults from a specific vault.',
	},
	'documentsAndFiles.getDocument': {
		riskLevel: 'read',
		description:
			'Tool to get a specific document by ID from a Basecamp project bucket. Use when you need to retrieve complete document details including title, content, creator, metadata, and comments count.',
	},
	'documentsAndFiles.getUpload': {
		riskLevel: 'read',
		description:
			'Tool to get a specific upload by ID from a Basecamp project. Use when you need to retrieve details about an uploaded file including metadata, download URL, and dimensions.',
	},
	'documentsAndFiles.getVault': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific vault by ID from a Basecamp project. Use when you need details about a vault including its documents, uploads, and nested vaults.',
	},
	'documentsAndFiles.listUploads': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all active uploads from a vault in a Basecamp project. Use when you need to list all uploaded files stored in a specific vault.',
	},
	'documentsAndFiles.listVaults': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all vaults (folders) nested within a parent vault in a Basecamp project. Use when you need to list child vaults from a specific vault.',
	},
	'documentsAndFiles.postAttachments': {
		riskLevel: 'write',
		description:
			'Tool to upload a file to Basecamp system. Use when you need to upload a file to get an attachable_sgid reference for use in other operations like creating messages or todos with attachments.',
	},
	'documentsAndFiles.putBucketsDocuments': {
		riskLevel: 'write',
		description:
			"Tool to update an existing document in a Basecamp project bucket. Use when you need to modify a document's title, content, or both. Omitted parameters remain unchanged.",
	},
	'documentsAndFiles.putBucketsUploads': {
		riskLevel: 'write',
		description:
			"Tool to update an existing upload in a Basecamp project bucket. Use when you need to modify an upload's description or filename. Omitted parameters remain unchanged.",
	},
	'documentsAndFiles.putBucketsVaults': {
		riskLevel: 'write',
		description:
			"Tool to update a vault's title in a Basecamp project. Use when you need to rename a vault within a specific project bucket.",
	},
	'documentsAndFiles.updateDocument': {
		riskLevel: 'write',
		description:
			"Tool to update an existing document's title or content in a Basecamp project. Use when you need to modify document title, content, or both.",
	},
	'documentsAndFiles.updateUpload': {
		riskLevel: 'write',
		description:
			"Tool to update an upload's description or filename in a Basecamp bucket. Use when you need to modify upload metadata without re-uploading the file.",
	},
	'documentsAndFiles.updateVault': {
		riskLevel: 'write',
		description:
			"Tool to update a vault's title in a Basecamp project. Use when you need to rename a vault within a specific project bucket.",
	},
	'campfireAndChatbots.createChatbot': {
		riskLevel: 'write',
		description:
			'Tool to create a new chatbot in a Basecamp Campfire chat. Use when you need to add an automated bot to a chat room for posting messages and responding to commands.',
	},
	'campfireAndChatbots.createChatbotLine': {
		riskLevel: 'write',
		description:
			'Tool to post a message as a chatbot to a Basecamp Campfire. Use when you need to post messages via a chatbot integration without OAuth authentication.',
	},
	'campfireAndChatbots.deleteCampfireLine': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a Campfire line from a chat conversation. Use when removing a specific message from a Basecamp Campfire chat.',
	},
	'campfireAndChatbots.deleteChatbot': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a chatbot from a Campfire chat. Use when removing a chatbot from the account. Note: Deletion is account-wide and only account administrators can delete chatbots.',
	},
	'campfireAndChatbots.getBucketsChatsIntegrations': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all chatbot integrations from a Campfire chat. Use when you need to get the list of chatbots accessible to the account with chat-specific line URLs for posting messages.',
	},
	'campfireAndChatbots.getBucketsChatsLines': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of Campfire lines from a specific chat. Use when you need to fetch messages from a Campfire conversation in a Basecamp project.',
	},
	'campfireAndChatbots.getCampfire': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific Campfire (chat room) by ID from a Basecamp project. Use when you need to get complete Campfire details including metadata, URLs, topic, and creator information.',
	},
	'campfireAndChatbots.getCampfireLine': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific Campfire line by ID from a Basecamp project. Use when you need to fetch a single message from a chat transcript.',
	},
	'campfireAndChatbots.getChatbot': {
		riskLevel: 'read',
		description:
			'Tool to get a specific chatbot by ID from a Basecamp Campfire chat. Use when you need to retrieve details about a chatbot, including its service name, command URL, and lines URL.',
	},
	'campfireAndChatbots.getChats': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of all active Campfires (chats) visible to the current user. Use when you need to list all available chat rooms in Basecamp.',
	},
	'campfireAndChatbots.listCampfireLines': {
		riskLevel: 'read',
		description:
			'Tool to get all lines (messages) in a Campfire chat. Use when you need to fetch paginated messages from a Campfire conversation in a Basecamp project.',
	},
	'campfireAndChatbots.listChatbots': {
		riskLevel: 'read',
		description:
			'Tool to get all chatbots for a chat/campfire. Use when you need to retrieve the list of chatbot integrations with their line URLs for posting messages.',
	},
	'campfireAndChatbots.postBucketsChatsLines': {
		riskLevel: 'write',
		description:
			'Tool to create a line in a Basecamp Campfire chat. Use when you need to post a message to a specific Campfire chat within a project.',
	},
	'campfireAndChatbots.postIntegrationsChatbotKeyBucketsChatsLines': {
		riskLevel: 'write',
		description:
			'Tool to create a line in a Basecamp Campfire chat using a chatbot key. Use when you need to post messages via a chatbot integration without OAuth authentication.',
	},
	'campfireAndChatbots.putBucketsChatsIntegrations': {
		riskLevel: 'write',
		description:
			'Tool to update an existing chatbot integration in a Basecamp Campfire chat. Use when you need to change the service name or command URL of a chatbot.',
	},
	'campfireAndChatbots.updateChatbot': {
		riskLevel: 'write',
		description:
			"Tool to update a chatbot's service name or command URL in a Basecamp Campfire chat. Use when you need to modify an existing chatbot integration.",
	},
	'cardTables.createCard': {
		riskLevel: 'write',
		description:
			'Tool to create a new card in a column of a Basecamp card table. Use when you need to add a card to a card table column with optional content and due date.',
	},
	'cardTables.createCardStep': {
		riskLevel: 'write',
		description:
			'Tool to create a step within a card in a Basecamp card table. Use when you need to add a subtask or checklist item to an existing card with optional due date and assignees.',
	},
	'cardTables.deleteBucketsCardTablesColumnsOnHold': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Tool to remove the on-hold section from a card table column. Use when you need to delete the on-hold section from a column in a Basecamp project's card table.",
	},
	'cardTables.getBucketsCardTablesListsCards': {
		riskLevel: 'read',
		description:
			"Tool to retrieve a paginated list of cards from a card table column. Use when you need to fetch cards from a specific list/column within a Basecamp project's card table.",
	},
	'cardTables.getCard': {
		riskLevel: 'read',
		description:
			'Tool to get a specific card by ID from a card table. Use when you need to retrieve complete card details including title, description, status, assignees, steps, and metadata.',
	},
	'cardTables.getCardTable': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a card table (Kanban board) for a project. Use when you need to fetch information about a specific card table including its columns, cards count, and subscribers.',
	},
	'cardTables.getCardTableColumn': {
		riskLevel: 'read',
		description:
			'Tool to get a specific column from a card table within a Basecamp project. Use when you need to fetch details about a card table column by its ID.',
	},
	'cardTables.listCards': {
		riskLevel: 'read',
		description:
			"Tool to get all cards in a column from a Basecamp card table. Use when you need to retrieve cards from a specific column/list within a project's card table.",
	},
	'cardTables.moveCard': {
		riskLevel: 'write',
		description:
			'Tool to move a card to a different column within a Basecamp card table. Use when you need to relocate a card from one column to another in a project.',
	},
	'cardTables.moveCardTableColumn': {
		riskLevel: 'write',
		description:
			'Tool to reorder columns within a Basecamp card table. Use when you need to change the position of a column in a card table by specifying the column to move and its new position.',
	},
	'cardTables.postBucketsCardTablesCardsMoves': {
		riskLevel: 'write',
		description:
			'Tool to move a card to a different column within a Basecamp card table. Use when you need to relocate a card from one column to another in a project.',
	},
	'cardTables.postBucketsCardTablesCardsPositions': {
		riskLevel: 'write',
		description:
			'Tool to reposition a step within a card in a Basecamp card table. Use when you need to change the order of steps/subtasks within a card by moving a step to a specific position.',
	},
	'cardTables.postBucketsCardTablesColumns': {
		riskLevel: 'write',
		description:
			'Tool to create a column within a Basecamp card table. Use when you need to add a new column to organize cards in a card table project.',
	},
	'cardTables.postBucketsCardTablesColumnsOnHold': {
		riskLevel: 'write',
		description:
			'Tool to create an on-hold section in a card table column. Use when you need to add an on-hold area to organize cards that are temporarily paused or waiting.',
	},
	'cardTables.postBucketsCardTablesMoves': {
		riskLevel: 'write',
		description:
			'Tool to reposition a column within a Basecamp card table. Use when you need to change the order of columns in a card table.',
	},
	'cardTables.putBucketsCardTablesCards': {
		riskLevel: 'write',
		description:
			"Tool to update an existing card in a Basecamp card table. Use when you need to modify a card's title, content, due date, or assignees. Omitted parameters remain unchanged.",
	},
	'cardTables.putBucketsCardTablesColumns': {
		riskLevel: 'write',
		description:
			"Tool to update a card table column in a Basecamp project. Use when you need to modify a column's title or description. Omitted parameters remain unchanged.",
	},
	'cardTables.putBucketsCardTablesColumnsColor': {
		riskLevel: 'write',
		description:
			"Tool to update a card table column's visual color designation in a Basecamp project. Use when you need to change the color of a specific column for better visual organization.",
	},
	'cardTables.putBucketsCardTablesSteps': {
		riskLevel: 'write',
		description:
			"Tool to update an existing card table step in Basecamp. Use when you need to modify a step's title, due date, or assignees. Omitted parameters remain unchanged.",
	},
	'cardTables.putBucketsCardTablesStepsCompletions': {
		riskLevel: 'write',
		description:
			'Tool to mark a card table step as completed or uncompleted in Basecamp. Use when you need to toggle the completion status of a step by setting completion to "on" or "off".',
	},
	'cardTables.repositionCardStep': {
		riskLevel: 'write',
		description:
			'Tool to change the position of a step within a card. Use when you need to reorder steps in a card table card by moving a step to a specific position.',
	},
	'cardTables.unwatchCardTableColumn': {
		riskLevel: 'write',
		description:
			'Tool to stop watching a card table column. Use when you want to unsubscribe from a specific column and no longer receive notifications about changes to it.',
	},
	'cardTables.updateCard': {
		riskLevel: 'write',
		description:
			"Tool to update a card's details in a Basecamp card table. Use when you need to modify a card's title, content, due date, or assignees.",
	},
	'cardTables.updateCardTableColumn': {
		riskLevel: 'write',
		description:
			"Tool to update a card table column's properties in a Basecamp project. Use when you need to modify a column's title or description.",
	},
	'cardTables.watchCardTableColumn': {
		riskLevel: 'write',
		description:
			'Tool to start watching a card table column in a Basecamp project. Use when you need to subscribe to a specific column to receive notifications about changes.',
	},
	'schedulesAndReports.getBucketsSchedulesEntries': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of schedule entries from a schedule. Use when you need to fetch entries from a specific schedule in a Basecamp project.',
	},
	'schedulesAndReports.getReportsTimesheet': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all timesheet entries across the Basecamp account within a given timeframe. Use when you need to generate time reports, track hours logged, or analyze time entries by person or project. Without date parameters, returns only the last month of entries.',
	},
	'schedulesAndReports.getSchedule': {
		riskLevel: 'read',
		description:
			'Tool to retrieve schedule details for a specific project. Use when you need information about a schedule including entries count and configuration.',
	},
	'schedulesAndReports.getScheduleEntry': {
		riskLevel: 'read',
		description:
			'Tool to get a specific schedule entry by ID from a Basecamp project. Use when you need to retrieve details about a scheduled event including its time, participants, and metadata.',
	},
	'schedulesAndReports.postBucketsSchedulesEntries': {
		riskLevel: 'write',
		description:
			'Tool to create a schedule entry in a Basecamp schedule within a project. Use when you need to add a new event with start/end times and optional participants.',
	},
	'schedulesAndReports.putBucketsScheduleEntries': {
		riskLevel: 'write',
		description:
			"Tool to update an existing schedule entry in a Basecamp schedule. Use when you need to modify an entry's title, times, description, or participants. Omitted parameters remain unchanged.",
	},
	'schedulesAndReports.putBucketsSchedules': {
		riskLevel: 'write',
		description:
			'Tool to update a schedule configuration in a Basecamp project. Use when you need to change whether the schedule includes due assignments from to-dos, cards and steps.',
	},
	'schedulesAndReports.updateScheduleEntry': {
		riskLevel: 'write',
		description:
			'Tool to update an existing schedule entry in a Basecamp project schedule. Use when you need to modify details like title, dates, description, or participants. Omitted parameters remain unchanged.',
	},
	'automaticCheckIns.getBucketsQuestionAnswers': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific question answer by ID from a Basecamp project. Use when you need to fetch details about an automatic check-in question answer including its content, creator, and associated comments.',
	},
	'automaticCheckIns.getBucketsQuestionnaires': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific questionnaire (automatic check-ins) from a Basecamp project. Use when you need to fetch details about a questionnaire including its questions count and metadata.',
	},
	'automaticCheckIns.getBucketsQuestionnairesQuestions': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of questions from a questionnaire in a Basecamp project. Use when you need to fetch questions from a specific questionnaire.',
	},
	'automaticCheckIns.getBucketsQuestions': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific check-in question by ID from a Basecamp project. Use when you already know the question ID and need its details without listing all questions from a questionnaire.',
	},
	'automaticCheckIns.listQuestions': {
		riskLevel: 'read',
		description:
			'Tool to get all questions in a questionnaire from a Basecamp project. Use when you need to fetch questions from a specific questionnaire.',
	},
	'inboxesAndForwards.getBucketsInboxesForwards': {
		riskLevel: 'read',
		description:
			"Tool to retrieve a paginated list of active email forwards from a project's inbox. Use when you need to fetch forwarded emails in a Basecamp inbox.",
	},
	'inboxesAndForwards.getInbox': {
		riskLevel: 'read',
		description:
			'Tool to get the inbox (email forwards) for a Basecamp project. Use when you need to retrieve details about a specific inbox including its forwards count and metadata.',
	},
	'inboxesAndForwards.listForwards': {
		riskLevel: 'read',
		description:
			'Tool to get all email forwards in an inbox. Use when you need to retrieve forwarded emails from a Basecamp project inbox.',
	},
	'recordingsAndSubscriptions.deleteBucketsRecordingsPin': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to unpin a recording (message) in a Basecamp project. Use when you need to remove the pinned status from a message on a message board or project.',
	},
	'recordingsAndSubscriptions.getBucketsRecordingsComments': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of active comments on a recording. Use when you need to fetch comments from a specific recording in a Basecamp project.',
	},
	'recordingsAndSubscriptions.getBucketsRecordingsEvents': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of events for a recording. Use when you need to fetch change history from a specific recording in a Basecamp project.',
	},
	'recordingsAndSubscriptions.getComment': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific comment by ID from a Basecamp project. Use when you need to fetch details about a particular comment including its content, creator, and parent resource.',
	},
	'recordingsAndSubscriptions.getProjectsRecordings': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a paginated list of records for a given type of recording across projects. Use when you need to list recordings of a specific type (Message, Document, Todo, etc.) with optional filtering by project, status, and sorting.',
	},
	'recordingsAndSubscriptions.getSubscription': {
		riskLevel: 'read',
		description:
			'Tool to get subscription information for a recording. Use when you need to check subscription status, view subscriber count, or get detailed information about all subscribers for a specific recording.',
	},
	'recordingsAndSubscriptions.listComments': {
		riskLevel: 'read',
		description:
			'Tool to get all comments on a recording in a Basecamp project. Use when you need to retrieve the list of active comments with their content, creators, and metadata.',
	},
	'recordingsAndSubscriptions.listEvents': {
		riskLevel: 'read',
		description:
			'Tool to get all events (history) for a recording. Use when you need to retrieve the complete modification history of a specific recording in a Basecamp project.',
	},
	'recordingsAndSubscriptions.postBucketsRecordingsComments': {
		riskLevel: 'write',
		description:
			'Tool to publish a comment on a recording within a Basecamp project. Use when you need to add a comment with rich text to any recording such as a todolist, message, or document.',
	},
	'recordingsAndSubscriptions.postBucketsRecordingsPin': {
		riskLevel: 'write',
		description:
			'Tool to pin a recording (message) in a Basecamp project. Use when you need to feature a message prominently at the top of a message board or project.',
	},
	'recordingsAndSubscriptions.postBucketsRecordingsSubscription': {
		riskLevel: 'write',
		description:
			'Tool to subscribe the current user to a recording for notifications. Use when you need to start watching/subscribing to a specific recording to receive notifications for new comments.',
	},
	'recordingsAndSubscriptions.putBucketsComments': {
		riskLevel: 'write',
		description:
			'Tool to update comment content in a Basecamp project. Use when you need to modify the content of an existing comment.',
	},
	'recordingsAndSubscriptions.putBucketsRecordingsClientVisibility': {
		riskLevel: 'write',
		description:
			'Tool to update client visibility for a recording in Basecamp. Use when you need to show or hide a recording from clients. Returns 403 if the recording inherits visibility from parent resource.',
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusActive': {
		riskLevel: 'write',
		description:
			'Tool to unarchive a recording in a Basecamp project by marking it as active. Use when you need to restore an archived recording to make it visible again in the project.',
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusArchived': {
		riskLevel: 'destructive',
		description:
			'Tool to mark a recording as archived in a Basecamp project. Use when you need to archive a recording to remove it from active view while preserving it for reference.',
	},
	'recordingsAndSubscriptions.putBucketsRecordingsStatusTrashed': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to mark a recording as trashed in a Basecamp project. Use when you need to move a recording to trash without permanently deleting it.',
	},
	'recordingsAndSubscriptions.putBucketsRecordingsSubscription': {
		riskLevel: 'write',
		description:
			'Tool to update recording subscriptions by adding or removing subscribers. Use when you need to manage who receives notifications for a specific recording. At least one of subscriptions or unsubscriptions must be provided.',
	},
	'recordingsAndSubscriptions.subscribeCurrentUser': {
		riskLevel: 'write',
		description:
			'Tool to subscribe the current authenticated user to a recording for notifications. Use when you need to add the current user to the subscriber list to receive updates about the recording.',
	},
	'recordingsAndSubscriptions.toggleClientVisibility': {
		riskLevel: 'write',
		description:
			"Tool to change client visibility for a recording in Basecamp. Use when you need to show or hide a recording from clients. Returns 403 error if the recording doesn't control its own visibility.",
	},
	'recordingsAndSubscriptions.unsubscribeCurrentUser': {
		riskLevel: 'write',
		description:
			"Tool to unsubscribe the current user from a recording. Use when you need to stop receiving notifications for a specific recording. This is an idempotent operation that returns success even if the user wasn't previously subscribed.",
	},
	'webhooks.deleteWebhooks': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a webhook from a Basecamp project. Use when you need to remove a webhook subscription from a project. Permanently deletes the specified webhook.',
	},
	'webhooks.getBucketsWebhooks': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all webhooks configured for a Basecamp project. Use when you need to list all webhook configurations including their payload URLs, event types, and active status.',
	},
	'webhooks.getWebhook': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific webhook by ID from a Basecamp project. Use when you need details about a webhook including its delivery history.',
	},
	'webhooks.postBucketsWebhooks': {
		riskLevel: 'write',
		description:
			'Tool to create a new webhook subscription for a Basecamp project. Use when you need to receive event notifications at a specified HTTPS endpoint for project activities.',
	},
	'webhooks.putBucketsWebhooks': {
		riskLevel: 'write',
		description:
			"Tool to update an existing webhook in a Basecamp project. Use when you need to modify the webhook's URL, event types, or active status.",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof basecampEndpointsNested>;

const defaultAuthType = 'oauth_2' as const;

export type BaseBasecampPlugin<T extends BasecampPluginOptions> = CorsairPlugin<
	'basecamp',
	typeof BasecampSchema,
	typeof basecampEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalBasecampPlugin = BaseBasecampPlugin<BasecampPluginOptions>;
export type ExternalBasecampPlugin<T extends BasecampPluginOptions> =
	BaseBasecampPlugin<T>;

export function basecamp<const T extends BasecampPluginOptions>(
	incomingOptions: BasecampPluginOptions & T = {} as BasecampPluginOptions & T,
): ExternalBasecampPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'basecamp',
		schema: BasecampSchema,
		options,
		authConfig: basecampAuthConfig,
		oauthConfig: {
			providerName: 'Basecamp',
			authUrl: 'https://launchpad.37signals.com/authorization/new',
			tokenUrl: 'https://launchpad.37signals.com/authorization/token',
			scopes: [],
		},
		hooks: options.hooks,
		endpoints: basecampEndpointsNested,
		webhooks: {},
		endpointMeta: basecampEndpointMeta,
		endpointSchemas: basecampEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: BasecampKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source !== 'endpoint' || ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('basecamp', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'basecamp',
				tokenUrl: 'https://launchpad.37signals.com/authorization/token',
			});
		},
	} satisfies InternalBasecampPlugin;
}

export { basecampEndpointsNested };
export type {
	BasecampEndpointInputs,
	BasecampEndpointOutputs,
} from './endpoints/types';
