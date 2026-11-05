import { createBasecampEndpoint } from './factory';

export const BasecampEndpoints = {
	projectsAndTemplates: {
		createProjectConstruction: createBasecampEndpoint(
			'createProjectConstruction',
		),
		getProject: createBasecampEndpoint('getProject'),
		getProjects: createBasecampEndpoint('getProjects'),
		getProjectsByProjectId: createBasecampEndpoint('getProjectsByProjectId'),
		getTemplates: createBasecampEndpoint('getTemplates'),
		getTemplatesByTemplateId: createBasecampEndpoint(
			'getTemplatesByTemplateId',
		),
		getTemplatesProjectConstructions: createBasecampEndpoint(
			'getTemplatesProjectConstructions',
		),
		postLineupMarkers: createBasecampEndpoint('postLineupMarkers'),
		postProjects: createBasecampEndpoint('postProjects'),
		postTemplates: createBasecampEndpoint('postTemplates'),
		putProjects: createBasecampEndpoint('putProjects'),
		putTemplates: createBasecampEndpoint('putTemplates'),
		trashProject: createBasecampEndpoint('trashProject'),
		trashTemplate: createBasecampEndpoint('trashTemplate'),
	},
	peopleAndAccess: {
		getCirclesPeople: createBasecampEndpoint('getCirclesPeople'),
		getMyProfile: createBasecampEndpoint('getMyProfile'),
		getPeople: createBasecampEndpoint('getPeople'),
		getPeopleByPersonId: createBasecampEndpoint('getPeopleByPersonId'),
		getPerson: createBasecampEndpoint('getPerson'),
		getProjectsPeople: createBasecampEndpoint('getProjectsPeople'),
		listProjectPeople: createBasecampEndpoint('listProjectPeople'),
		putProjectsPeopleUsers: createBasecampEndpoint('putProjectsPeopleUsers'),
	},
	todos: {
		completeTodo: createBasecampEndpoint('completeTodo'),
		createTodo: createBasecampEndpoint('createTodo'),
		createTodolistGroup: createBasecampEndpoint('createTodolistGroup'),
		getBucketsTodolists: createBasecampEndpoint('getBucketsTodolists'),
		getBucketsTodolistsGroups: createBasecampEndpoint(
			'getBucketsTodolistsGroups',
		),
		getBucketsTodolistsTodos: createBasecampEndpoint(
			'getBucketsTodolistsTodos',
		),
		getBucketsTodos: createBasecampEndpoint('getBucketsTodos'),
		getBucketsTodosets: createBasecampEndpoint('getBucketsTodosets'),
		getBucketsTodosetsTodolists: createBasecampEndpoint(
			'getBucketsTodosetsTodolists',
		),
		getTodo: createBasecampEndpoint('getTodo'),
		getTodolist: createBasecampEndpoint('getTodolist'),
		getTodolistGroups: createBasecampEndpoint('getTodolistGroups'),
		getTodoset: createBasecampEndpoint('getTodoset'),
		listTodolists: createBasecampEndpoint('listTodolists'),
		postBucketsTodolistsComments: createBasecampEndpoint(
			'postBucketsTodolistsComments',
		),
		postBucketsTodolistsTodos: createBasecampEndpoint(
			'postBucketsTodolistsTodos',
		),
		postBucketsTodosComments: createBasecampEndpoint(
			'postBucketsTodosComments',
		),
		postBucketsTodosetsTodolists: createBasecampEndpoint(
			'postBucketsTodosetsTodolists',
		),
		putBucketsTodolistsGroupsPosition: createBasecampEndpoint(
			'putBucketsTodolistsGroupsPosition',
		),
		putBucketsTodos: createBasecampEndpoint('putBucketsTodos'),
		putBucketsTodosPosition: createBasecampEndpoint('putBucketsTodosPosition'),
		uncompleteTodo: createBasecampEndpoint('uncompleteTodo'),
		updateTodo: createBasecampEndpoint('updateTodo'),
	},
	messages: {
		deleteMessageType: createBasecampEndpoint('deleteMessageType'),
		getBucketsCategories: createBasecampEndpoint('getBucketsCategories'),
		getBucketsMessageBoardsMessages: createBasecampEndpoint(
			'getBucketsMessageBoardsMessages',
		),
		getMessage: createBasecampEndpoint('getMessage'),
		getMessageBoard: createBasecampEndpoint('getMessageBoard'),
		getMessageType: createBasecampEndpoint('getMessageType'),
		listMessageTypes: createBasecampEndpoint('listMessageTypes'),
		pinMessage: createBasecampEndpoint('pinMessage'),
		postBucketsCategories: createBasecampEndpoint('postBucketsCategories'),
		postBucketsMessageBoardsMessages: createBasecampEndpoint(
			'postBucketsMessageBoardsMessages',
		),
		putBucketsCategories: createBasecampEndpoint('putBucketsCategories'),
		putBucketsMessages: createBasecampEndpoint('putBucketsMessages'),
		unpinMessage: createBasecampEndpoint('unpinMessage'),
		updateMessageType: createBasecampEndpoint('updateMessageType'),
	},
	documentsAndFiles: {
		createDocument: createBasecampEndpoint('createDocument'),
		createUpload: createBasecampEndpoint('createUpload'),
		createVault: createBasecampEndpoint('createVault'),
		getBucketsUploads: createBasecampEndpoint('getBucketsUploads'),
		getBucketsVaults: createBasecampEndpoint('getBucketsVaults'),
		getBucketsVaultsDocuments: createBasecampEndpoint(
			'getBucketsVaultsDocuments',
		),
		getBucketsVaultsUploads: createBasecampEndpoint('getBucketsVaultsUploads'),
		getBucketsVaultsVaults: createBasecampEndpoint('getBucketsVaultsVaults'),
		getDocument: createBasecampEndpoint('getDocument'),
		getUpload: createBasecampEndpoint('getUpload'),
		getVault: createBasecampEndpoint('getVault'),
		listUploads: createBasecampEndpoint('listUploads'),
		listVaults: createBasecampEndpoint('listVaults'),
		postAttachments: createBasecampEndpoint('postAttachments'),
		putBucketsDocuments: createBasecampEndpoint('putBucketsDocuments'),
		putBucketsUploads: createBasecampEndpoint('putBucketsUploads'),
		putBucketsVaults: createBasecampEndpoint('putBucketsVaults'),
		updateDocument: createBasecampEndpoint('updateDocument'),
		updateUpload: createBasecampEndpoint('updateUpload'),
		updateVault: createBasecampEndpoint('updateVault'),
	},
	campfireAndChatbots: {
		createChatbot: createBasecampEndpoint('createChatbot'),
		createChatbotLine: createBasecampEndpoint('createChatbotLine'),
		deleteCampfireLine: createBasecampEndpoint('deleteCampfireLine'),
		deleteChatbot: createBasecampEndpoint('deleteChatbot'),
		getBucketsChatsIntegrations: createBasecampEndpoint(
			'getBucketsChatsIntegrations',
		),
		getBucketsChatsLines: createBasecampEndpoint('getBucketsChatsLines'),
		getCampfire: createBasecampEndpoint('getCampfire'),
		getCampfireLine: createBasecampEndpoint('getCampfireLine'),
		getChatbot: createBasecampEndpoint('getChatbot'),
		getChats: createBasecampEndpoint('getChats'),
		listCampfireLines: createBasecampEndpoint('listCampfireLines'),
		listChatbots: createBasecampEndpoint('listChatbots'),
		postBucketsChatsLines: createBasecampEndpoint('postBucketsChatsLines'),
		postIntegrationsChatbotKeyBucketsChatsLines: createBasecampEndpoint(
			'postIntegrationsChatbotKeyBucketsChatsLines',
		),
		putBucketsChatsIntegrations: createBasecampEndpoint(
			'putBucketsChatsIntegrations',
		),
		updateChatbot: createBasecampEndpoint('updateChatbot'),
	},
	cardTables: {
		createCard: createBasecampEndpoint('createCard'),
		createCardStep: createBasecampEndpoint('createCardStep'),
		deleteBucketsCardTablesColumnsOnHold: createBasecampEndpoint(
			'deleteBucketsCardTablesColumnsOnHold',
		),
		getBucketsCardTablesListsCards: createBasecampEndpoint(
			'getBucketsCardTablesListsCards',
		),
		getCard: createBasecampEndpoint('getCard'),
		getCardTable: createBasecampEndpoint('getCardTable'),
		getCardTableColumn: createBasecampEndpoint('getCardTableColumn'),
		listCards: createBasecampEndpoint('listCards'),
		moveCard: createBasecampEndpoint('moveCard'),
		moveCardTableColumn: createBasecampEndpoint('moveCardTableColumn'),
		postBucketsCardTablesCardsMoves: createBasecampEndpoint(
			'postBucketsCardTablesCardsMoves',
		),
		postBucketsCardTablesCardsPositions: createBasecampEndpoint(
			'postBucketsCardTablesCardsPositions',
		),
		postBucketsCardTablesColumns: createBasecampEndpoint(
			'postBucketsCardTablesColumns',
		),
		postBucketsCardTablesColumnsOnHold: createBasecampEndpoint(
			'postBucketsCardTablesColumnsOnHold',
		),
		postBucketsCardTablesMoves: createBasecampEndpoint(
			'postBucketsCardTablesMoves',
		),
		putBucketsCardTablesCards: createBasecampEndpoint(
			'putBucketsCardTablesCards',
		),
		putBucketsCardTablesColumns: createBasecampEndpoint(
			'putBucketsCardTablesColumns',
		),
		putBucketsCardTablesColumnsColor: createBasecampEndpoint(
			'putBucketsCardTablesColumnsColor',
		),
		putBucketsCardTablesSteps: createBasecampEndpoint(
			'putBucketsCardTablesSteps',
		),
		putBucketsCardTablesStepsCompletions: createBasecampEndpoint(
			'putBucketsCardTablesStepsCompletions',
		),
		repositionCardStep: createBasecampEndpoint('repositionCardStep'),
		unwatchCardTableColumn: createBasecampEndpoint('unwatchCardTableColumn'),
		updateCard: createBasecampEndpoint('updateCard'),
		updateCardTableColumn: createBasecampEndpoint('updateCardTableColumn'),
		watchCardTableColumn: createBasecampEndpoint('watchCardTableColumn'),
	},
	schedulesAndReports: {
		getBucketsSchedulesEntries: createBasecampEndpoint(
			'getBucketsSchedulesEntries',
		),
		getReportsTimesheet: createBasecampEndpoint('getReportsTimesheet'),
		getSchedule: createBasecampEndpoint('getSchedule'),
		getScheduleEntry: createBasecampEndpoint('getScheduleEntry'),
		postBucketsSchedulesEntries: createBasecampEndpoint(
			'postBucketsSchedulesEntries',
		),
		putBucketsScheduleEntries: createBasecampEndpoint(
			'putBucketsScheduleEntries',
		),
		putBucketsSchedules: createBasecampEndpoint('putBucketsSchedules'),
		updateScheduleEntry: createBasecampEndpoint('updateScheduleEntry'),
	},
	automaticCheckIns: {
		getBucketsQuestionAnswers: createBasecampEndpoint(
			'getBucketsQuestionAnswers',
		),
		getBucketsQuestionnaires: createBasecampEndpoint(
			'getBucketsQuestionnaires',
		),
		getBucketsQuestionnairesQuestions: createBasecampEndpoint(
			'getBucketsQuestionnairesQuestions',
		),
		getBucketsQuestions: createBasecampEndpoint('getBucketsQuestions'),
		listQuestions: createBasecampEndpoint('listQuestions'),
	},
	inboxesAndForwards: {
		getBucketsInboxesForwards: createBasecampEndpoint(
			'getBucketsInboxesForwards',
		),
		getInbox: createBasecampEndpoint('getInbox'),
		listForwards: createBasecampEndpoint('listForwards'),
	},
	recordingsAndSubscriptions: {
		deleteBucketsRecordingsPin: createBasecampEndpoint(
			'deleteBucketsRecordingsPin',
		),
		getBucketsRecordingsComments: createBasecampEndpoint(
			'getBucketsRecordingsComments',
		),
		getBucketsRecordingsEvents: createBasecampEndpoint(
			'getBucketsRecordingsEvents',
		),
		getComment: createBasecampEndpoint('getComment'),
		getProjectsRecordings: createBasecampEndpoint('getProjectsRecordings'),
		getSubscription: createBasecampEndpoint('getSubscription'),
		listComments: createBasecampEndpoint('listComments'),
		listEvents: createBasecampEndpoint('listEvents'),
		postBucketsRecordingsComments: createBasecampEndpoint(
			'postBucketsRecordingsComments',
		),
		postBucketsRecordingsPin: createBasecampEndpoint(
			'postBucketsRecordingsPin',
		),
		postBucketsRecordingsSubscription: createBasecampEndpoint(
			'postBucketsRecordingsSubscription',
		),
		putBucketsComments: createBasecampEndpoint('putBucketsComments'),
		putBucketsRecordingsClientVisibility: createBasecampEndpoint(
			'putBucketsRecordingsClientVisibility',
		),
		putBucketsRecordingsStatusActive: createBasecampEndpoint(
			'putBucketsRecordingsStatusActive',
		),
		putBucketsRecordingsStatusArchived: createBasecampEndpoint(
			'putBucketsRecordingsStatusArchived',
		),
		putBucketsRecordingsStatusTrashed: createBasecampEndpoint(
			'putBucketsRecordingsStatusTrashed',
		),
		putBucketsRecordingsSubscription: createBasecampEndpoint(
			'putBucketsRecordingsSubscription',
		),
		subscribeCurrentUser: createBasecampEndpoint('subscribeCurrentUser'),
		toggleClientVisibility: createBasecampEndpoint('toggleClientVisibility'),
		unsubscribeCurrentUser: createBasecampEndpoint('unsubscribeCurrentUser'),
	},
	webhooks: {
		deleteWebhooks: createBasecampEndpoint('deleteWebhooks'),
		getBucketsWebhooks: createBasecampEndpoint('getBucketsWebhooks'),
		getWebhook: createBasecampEndpoint('getWebhook'),
		postBucketsWebhooks: createBasecampEndpoint('postBucketsWebhooks'),
		putBucketsWebhooks: createBasecampEndpoint('putBucketsWebhooks'),
	},
} as const;

export * from './operations';
export * from './types';
