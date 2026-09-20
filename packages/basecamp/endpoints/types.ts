import { z } from 'zod';

export const BasecampEndpointInputSchemas = {
	createProjectConstruction: z
		.object({
			templateId: z.number().int(),
			project: z
				.object({
					name: z.string(),
					description: z.string().nullable().optional(),
				})
				.loose(),
		})
		.loose(),
	getProject: z
		.object({
			projectId: z.number().int(),
		})
		.loose(),
	getProjects: z
		.object({
			status: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getProjectsByProjectId: z
		.object({
			projectId: z.number().int(),
		})
		.loose(),
	getTemplates: z
		.object({
			status: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getTemplatesByTemplateId: z
		.object({
			templateId: z.number().int(),
		})
		.loose(),
	getTemplatesProjectConstructions: z
		.object({
			templateId: z.number().int(),
			constructionId: z.number().int(),
		})
		.loose(),
	postLineupMarkers: z
		.object({
			name: z.string(),
			date: z.string(),
		})
		.loose(),
	postProjects: z
		.object({
			name: z.string(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	postTemplates: z
		.object({
			name: z.string(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	putProjects: z
		.object({
			projectId: z.number().int(),
			name: z.string(),
			description: z.string().nullable().optional(),
			admissions: z.string().optional(),
			schedule_attributes: z
				.object({
					start_date: z.string().optional(),
					end_date: z.string().nullable().optional(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	putTemplates: z
		.object({
			templateId: z.number().int(),
			name: z.string().optional(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	trashProject: z
		.object({
			projectId: z.number().int(),
		})
		.loose(),
	trashTemplate: z
		.object({
			templateId: z.number().int(),
		})
		.loose(),
	getCirclesPeople: z.object({}).loose(),
	getMyProfile: z.object({}).loose(),
	getPeople: z
		.object({
			page: z.number().int().optional(),
		})
		.loose(),
	getPeopleByPersonId: z
		.object({
			personId: z.number().int(),
		})
		.loose(),
	getPerson: z
		.object({
			personId: z.number().int(),
		})
		.loose(),
	getProjectsPeople: z
		.object({
			projectId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	listProjectPeople: z
		.object({
			projectId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	putProjectsPeopleUsers: z
		.object({
			projectId: z.number().int(),
			grant: z.array(z.number().int()).optional(),
			revoke: z.array(z.number().int()).optional(),
			create: z
				.array(
					z
						.object({
							name: z.string(),
							email_address: z.string().nullable(),
							title: z.string().nullable().optional(),
							company_name: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	completeTodo: z
		.object({
			todoId: z.number().int(),
		})
		.loose(),
	createTodo: z
		.object({
			todolistId: z.number().int(),
			content: z.string().nullable(),
			description: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
			completion_subscriber_ids: z.array(z.number().int()).optional(),
			notify: z.boolean().optional(),
			due_on: z.string().nullable().optional(),
			starts_on: z.string().nullable().optional(),
		})
		.loose(),
	createTodolistGroup: z
		.object({
			todolistId: z.number().int(),
			name: z.string(),
		})
		.loose(),
	getBucketsTodolists: z
		.object({
			id: z.number().int(),
		})
		.loose(),
	getBucketsTodolistsGroups: z
		.object({
			todolistId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsTodolistsTodos: z
		.object({
			todolistId: z.number().int(),
			status: z.string().optional(),
			completed: z.boolean().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsTodos: z
		.object({
			todoId: z.number().int(),
		})
		.loose(),
	getBucketsTodosets: z
		.object({
			todosetId: z.number().int(),
		})
		.loose(),
	getBucketsTodosetsTodolists: z
		.object({
			todosetId: z.number().int(),
			status: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getTodo: z
		.object({
			todoId: z.number().int(),
		})
		.loose(),
	getTodolist: z
		.object({
			id: z.number().int(),
		})
		.loose(),
	getTodolistGroups: z
		.object({
			todolistId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getTodoset: z
		.object({
			todosetId: z.number().int(),
		})
		.loose(),
	listTodolists: z
		.object({
			todosetId: z.number().int(),
			status: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	postBucketsTodolistsComments: z
		.object({
			recordingId: z.number().int(),
			content: z.string().nullable(),
		})
		.loose(),
	postBucketsTodolistsTodos: z
		.object({
			todolistId: z.number().int(),
			content: z.string().nullable(),
			description: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
			completion_subscriber_ids: z.array(z.number().int()).optional(),
			notify: z.boolean().optional(),
			due_on: z.string().nullable().optional(),
			starts_on: z.string().nullable().optional(),
		})
		.loose(),
	postBucketsTodosComments: z
		.object({
			recordingId: z.number().int(),
			content: z.string().nullable(),
		})
		.loose(),
	postBucketsTodosetsTodolists: z
		.object({
			todosetId: z.number().int(),
			name: z.string(),
			description: z.string().nullable().optional(),
			visible_to_clients: z.boolean().optional(),
		})
		.loose(),
	putBucketsTodolistsGroupsPosition: z
		.object({
			groupId: z.number().int(),
			position: z.number().int().nullable(),
		})
		.loose(),
	putBucketsTodos: z
		.object({
			todoId: z.number().int(),
			content: z.string().nullable(),
			description: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
			completion_subscriber_ids: z.array(z.number().int()).optional(),
			notify: z.boolean().optional(),
			due_on: z.string().nullable().optional(),
			starts_on: z.string().nullable().optional(),
		})
		.loose(),
	putBucketsTodosPosition: z
		.object({
			todoId: z.number().int(),
			position: z.number().int().nullable(),
			parent_id: z.number().int().optional(),
		})
		.loose(),
	uncompleteTodo: z
		.object({
			todoId: z.number().int(),
		})
		.loose(),
	updateTodo: z
		.object({
			todoId: z.number().int(),
			content: z.string().nullable(),
			description: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
			completion_subscriber_ids: z.array(z.number().int()).optional(),
			notify: z.boolean().optional(),
			due_on: z.string().nullable().optional(),
			starts_on: z.string().nullable().optional(),
		})
		.loose(),
	deleteMessageType: z
		.object({
			bucketId: z.number().int(),
			typeId: z.number().int(),
		})
		.loose(),
	getBucketsCategories: z
		.object({
			bucketId: z.number().int(),
		})
		.loose(),
	getBucketsMessageBoardsMessages: z
		.object({
			boardId: z.number().int(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getMessage: z
		.object({
			messageId: z.number().int(),
		})
		.loose(),
	getMessageBoard: z
		.object({
			boardId: z.number().int(),
		})
		.loose(),
	getMessageType: z
		.object({
			bucketId: z.number().int(),
			typeId: z.number().int(),
		})
		.loose(),
	listMessageTypes: z
		.object({
			bucketId: z.number().int(),
		})
		.loose(),
	pinMessage: z
		.object({
			messageId: z.number().int(),
		})
		.loose(),
	postBucketsCategories: z
		.object({
			bucketId: z.number().int(),
			name: z.string(),
			icon: z.string(),
		})
		.loose(),
	postBucketsMessageBoardsMessages: z
		.object({
			boardId: z.number().int(),
			subject: z.string(),
			content: z.string().nullable().optional(),
			status: z.string().optional(),
			category_id: z.number().int().optional(),
			subscriptions: z.array(z.number().int()).optional(),
			visible_to_clients: z.boolean().optional(),
		})
		.loose(),
	putBucketsCategories: z
		.object({
			bucketId: z.number().int(),
			typeId: z.number().int(),
			name: z.string().optional(),
			icon: z.string().optional(),
		})
		.loose(),
	putBucketsMessages: z
		.object({
			messageId: z.number().int(),
			subject: z.string().optional(),
			content: z.string().nullable().optional(),
			status: z.string().optional(),
			category_id: z.number().int().optional(),
		})
		.loose(),
	unpinMessage: z
		.object({
			messageId: z.number().int(),
		})
		.loose(),
	updateMessageType: z
		.object({
			bucketId: z.number().int(),
			typeId: z.number().int(),
			name: z.string().optional(),
			icon: z.string().optional(),
		})
		.loose(),
	createDocument: z
		.object({
			vaultId: z.number().int(),
			title: z.string().nullable(),
			content: z.string().nullable().optional(),
			status: z.string().optional(),
			subscriptions: z.array(z.number().int()).optional(),
			visible_to_clients: z.boolean().optional(),
		})
		.loose(),
	createUpload: z
		.object({
			vaultId: z.number().int(),
			attachable_sgid: z.string(),
			description: z.string().nullable().optional(),
			base_name: z.string().optional(),
			subscriptions: z.array(z.number().int()).optional(),
			visible_to_clients: z.boolean().optional(),
		})
		.loose(),
	createVault: z
		.object({
			vaultId: z.number().int(),
			title: z.string().nullable(),
		})
		.loose(),
	getBucketsUploads: z
		.object({
			uploadId: z.number().int(),
		})
		.loose(),
	getBucketsVaults: z
		.object({
			vaultId: z.number().int(),
		})
		.loose(),
	getBucketsVaultsDocuments: z
		.object({
			vaultId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsVaultsUploads: z
		.object({
			vaultId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsVaultsVaults: z
		.object({
			vaultId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getDocument: z
		.object({
			documentId: z.number().int(),
		})
		.loose(),
	getUpload: z
		.object({
			uploadId: z.number().int(),
		})
		.loose(),
	getVault: z
		.object({
			vaultId: z.number().int(),
		})
		.loose(),
	listUploads: z
		.object({
			vaultId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	listVaults: z
		.object({
			vaultId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	postAttachments: z
		.object({
			name: z.string(),
			contentBase64: z.string(),
		})
		.loose(),
	putBucketsDocuments: z
		.object({
			documentId: z.number().int(),
			title: z.string().nullable().optional(),
			content: z.string().nullable().optional(),
		})
		.loose(),
	putBucketsUploads: z
		.object({
			uploadId: z.number().int(),
			description: z.string().nullable().optional(),
			base_name: z.string().optional(),
		})
		.loose(),
	putBucketsVaults: z
		.object({
			vaultId: z.number().int(),
			title: z.string().nullable().optional(),
		})
		.loose(),
	updateDocument: z
		.object({
			documentId: z.number().int(),
			title: z.string().nullable().optional(),
			content: z.string().nullable().optional(),
		})
		.loose(),
	updateUpload: z
		.object({
			uploadId: z.number().int(),
			description: z.string().nullable().optional(),
			base_name: z.string().optional(),
		})
		.loose(),
	updateVault: z
		.object({
			vaultId: z.number().int(),
			title: z.string().nullable().optional(),
		})
		.loose(),
	createChatbot: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
		})
		.loose(),
	createChatbotLine: z
		.object({
			chatbotKey: z.string(),
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			content_param: z.string().optional(),
			content: z.string().nullable(),
		})
		.loose(),
	deleteCampfireLine: z
		.object({
			campfireId: z.number().int(),
			lineId: z.number().int(),
		})
		.loose(),
	deleteChatbot: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			chatbotId: z.number().int(),
		})
		.loose(),
	getBucketsChatsIntegrations: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
		})
		.loose(),
	getBucketsChatsLines: z
		.object({
			campfireId: z.number().int(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getCampfire: z
		.object({
			campfireId: z.number().int(),
		})
		.loose(),
	getCampfireLine: z
		.object({
			campfireId: z.number().int(),
			lineId: z.number().int(),
		})
		.loose(),
	getChatbot: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			chatbotId: z.number().int(),
		})
		.loose(),
	getChats: z
		.object({
			page: z.number().int().optional(),
		})
		.loose(),
	listCampfireLines: z
		.object({
			campfireId: z.number().int(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	listChatbots: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
		})
		.loose(),
	postBucketsChatsLines: z
		.object({
			campfireId: z.number().int(),
			content: z.string().nullable(),
			content_type: z.string().optional(),
		})
		.loose(),
	postIntegrationsChatbotKeyBucketsChatsLines: z
		.object({
			chatbotKey: z.string(),
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			content_param: z.string().optional(),
			content: z.string().nullable(),
		})
		.loose(),
	putBucketsChatsIntegrations: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			chatbotId: z.number().int(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
		})
		.loose(),
	updateChatbot: z
		.object({
			bucketId: z.number().int(),
			campfireId: z.number().int(),
			chatbotId: z.number().int(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
		})
		.loose(),
	createCard: z
		.object({
			columnId: z.number().int(),
			title: z.string().nullable(),
			content: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			notify: z.boolean().optional(),
		})
		.loose(),
	createCardStep: z
		.object({
			cardId: z.number().int(),
			title: z.string().nullable(),
			due_on: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
		})
		.loose(),
	deleteBucketsCardTablesColumnsOnHold: z
		.object({
			bucketId: z.number().int(),
			columnId: z.number().int(),
		})
		.loose(),
	getBucketsCardTablesListsCards: z
		.object({
			columnId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getCard: z
		.object({
			cardId: z.number().int(),
		})
		.loose(),
	getCardTable: z
		.object({
			cardTableId: z.number().int(),
		})
		.loose(),
	getCardTableColumn: z
		.object({
			columnId: z.number().int(),
		})
		.loose(),
	listCards: z
		.object({
			columnId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	moveCard: z
		.object({
			cardId: z.number().int(),
			column_id: z.number().int(),
			position: z.number().int().nullable().optional(),
		})
		.loose(),
	moveCardTableColumn: z
		.object({
			cardTableId: z.number().int(),
			source_id: z.number().int(),
			target_id: z.number().int(),
			position: z.number().int().nullable().optional(),
		})
		.loose(),
	postBucketsCardTablesCardsMoves: z
		.object({
			cardId: z.number().int(),
			column_id: z.number().int(),
			position: z.number().int().nullable().optional(),
		})
		.loose(),
	postBucketsCardTablesCardsPositions: z
		.object({
			cardId: z.number().int(),
			source_id: z.number().int(),
			position: z.number().int().nullable(),
		})
		.loose(),
	postBucketsCardTablesColumns: z
		.object({
			cardTableId: z.number().int(),
			title: z.string().nullable(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	postBucketsCardTablesColumnsOnHold: z
		.object({
			bucketId: z.number().int(),
			columnId: z.number().int(),
		})
		.loose(),
	postBucketsCardTablesMoves: z
		.object({
			cardTableId: z.number().int(),
			source_id: z.number().int(),
			target_id: z.number().int(),
			position: z.number().int().nullable().optional(),
		})
		.loose(),
	putBucketsCardTablesCards: z
		.object({
			cardId: z.number().int(),
			title: z.string().nullable().optional(),
			content: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
		})
		.loose(),
	putBucketsCardTablesColumns: z
		.object({
			columnId: z.number().int(),
			title: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	putBucketsCardTablesColumnsColor: z
		.object({
			bucketId: z.number().int(),
			columnId: z.number().int(),
			color: z.string().nullable(),
		})
		.loose(),
	putBucketsCardTablesSteps: z
		.object({
			stepId: z.number().int(),
			title: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
		})
		.loose(),
	putBucketsCardTablesStepsCompletions: z
		.object({
			stepId: z.number().int(),
			completion: z.string(),
		})
		.loose(),
	repositionCardStep: z
		.object({
			cardId: z.number().int(),
			source_id: z.number().int(),
			position: z.number().int().nullable(),
		})
		.loose(),
	unwatchCardTableColumn: z
		.object({
			columnId: z.number().int(),
		})
		.loose(),
	updateCard: z
		.object({
			cardId: z.number().int(),
			title: z.string().nullable().optional(),
			content: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignee_ids: z.array(z.number().int()).optional(),
		})
		.loose(),
	updateCardTableColumn: z
		.object({
			columnId: z.number().int(),
			title: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
		})
		.loose(),
	watchCardTableColumn: z
		.object({
			columnId: z.number().int(),
		})
		.loose(),
	getBucketsSchedulesEntries: z
		.object({
			scheduleId: z.number().int(),
			status: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getReportsTimesheet: z
		.object({
			from: z.string().nullable().optional(),
			to: z.string().optional(),
			person_id: z.number().int().optional(),
		})
		.loose(),
	getSchedule: z
		.object({
			scheduleId: z.number().int(),
		})
		.loose(),
	getScheduleEntry: z
		.object({
			entryId: z.number().int(),
		})
		.loose(),
	postBucketsSchedulesEntries: z
		.object({
			scheduleId: z.number().int(),
			summary: z.string(),
			starts_at: z.string(),
			ends_at: z.string(),
			description: z.string().nullable().optional(),
			participant_ids: z.array(z.number().int()).optional(),
			all_day: z.boolean().optional(),
			notify: z.boolean().optional(),
			url: z.string().optional(),
			highlighted: z.boolean().optional(),
			status: z.string().optional(),
			subscriptions: z.array(z.number().int()).optional(),
			visible_to_clients: z.boolean().optional(),
		})
		.loose(),
	putBucketsScheduleEntries: z
		.object({
			entryId: z.number().int(),
			summary: z.string().optional(),
			starts_at: z.string(),
			ends_at: z.string(),
			description: z.string().nullable().optional(),
			participant_ids: z.array(z.number().int()).optional(),
			all_day: z.boolean().optional(),
			notify: z.boolean().optional(),
			url: z.string().optional(),
			highlighted: z.boolean().optional(),
		})
		.loose(),
	putBucketsSchedules: z
		.object({
			scheduleId: z.number().int(),
			include_due_assignments: z.boolean(),
		})
		.loose(),
	updateScheduleEntry: z
		.object({
			entryId: z.number().int(),
			summary: z.string().optional(),
			starts_at: z.string(),
			ends_at: z.string(),
			description: z.string().nullable().optional(),
			participant_ids: z.array(z.number().int()).optional(),
			all_day: z.boolean().optional(),
			notify: z.boolean().optional(),
			url: z.string().optional(),
			highlighted: z.boolean().optional(),
		})
		.loose(),
	getBucketsQuestionAnswers: z
		.object({
			answerId: z.number().int(),
		})
		.loose(),
	getBucketsQuestionnaires: z
		.object({
			questionnaireId: z.number().int(),
		})
		.loose(),
	getBucketsQuestionnairesQuestions: z
		.object({
			questionnaireId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsQuestions: z
		.object({
			questionId: z.number().int(),
		})
		.loose(),
	listQuestions: z
		.object({
			questionnaireId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsInboxesForwards: z
		.object({
			inboxId: z.number().int(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getInbox: z
		.object({
			inboxId: z.number().int(),
		})
		.loose(),
	listForwards: z
		.object({
			inboxId: z.number().int(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	deleteBucketsRecordingsPin: z
		.object({
			messageId: z.number().int(),
		})
		.loose(),
	getBucketsRecordingsComments: z
		.object({
			recordingId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getBucketsRecordingsEvents: z
		.object({
			recordingId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	getComment: z
		.object({
			commentId: z.number().int(),
		})
		.loose(),
	getProjectsRecordings: z
		.object({
			type: z.string(),
			bucket: z.string().optional(),
			status: z.string().optional(),
			sort: z.string().optional(),
			direction: z.string().optional(),
			page: z.number().int().optional(),
		})
		.loose(),
	getSubscription: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	listComments: z
		.object({
			recordingId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	listEvents: z
		.object({
			recordingId: z.number().int(),
			page: z.number().int().optional(),
		})
		.loose(),
	postBucketsRecordingsComments: z
		.object({
			recordingId: z.number().int(),
			content: z.string().nullable(),
		})
		.loose(),
	postBucketsRecordingsPin: z
		.object({
			messageId: z.number().int(),
		})
		.loose(),
	postBucketsRecordingsSubscription: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	putBucketsComments: z
		.object({
			commentId: z.number().int(),
			content: z.string().nullable(),
		})
		.loose(),
	putBucketsRecordingsClientVisibility: z
		.object({
			recordingId: z.number().int(),
			visible_to_clients: z.boolean(),
		})
		.loose(),
	putBucketsRecordingsStatusActive: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	putBucketsRecordingsStatusArchived: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	putBucketsRecordingsStatusTrashed: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	putBucketsRecordingsSubscription: z
		.object({
			recordingId: z.number().int(),
			subscriptions: z.array(z.number().int()).optional(),
			unsubscriptions: z.array(z.number().int()).optional(),
		})
		.loose(),
	subscribeCurrentUser: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	toggleClientVisibility: z
		.object({
			recordingId: z.number().int(),
			visible_to_clients: z.boolean(),
		})
		.loose(),
	unsubscribeCurrentUser: z
		.object({
			recordingId: z.number().int(),
		})
		.loose(),
	deleteWebhooks: z
		.object({
			webhookId: z.number().int(),
		})
		.loose(),
	getBucketsWebhooks: z
		.object({
			bucketId: z.number().int(),
		})
		.loose(),
	getWebhook: z
		.object({
			webhookId: z.number().int(),
		})
		.loose(),
	postBucketsWebhooks: z
		.object({
			bucketId: z.number().int(),
			payload_url: z.string(),
			types: z.array(z.string()),
			active: z.boolean().optional(),
		})
		.loose(),
	putBucketsWebhooks: z
		.object({
			webhookId: z.number().int(),
			payload_url: z.string().optional(),
			types: z.array(z.string()).optional(),
			active: z.boolean().optional(),
		})
		.loose(),
} as const;

export const BasecampEndpointOutputSchemas = {
	createProjectConstruction: z
		.object({
			id: z.number().int(),
			status: z.string(),
			url: z.string().optional(),
			project: z
				.object({
					id: z.number().int(),
					status: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
					name: z.string(),
					description: z.string().nullable().optional(),
					purpose: z.string().optional(),
					start_date: z.string().optional(),
					end_date: z.string().nullable().optional(),
					clients_enabled: z.boolean().optional(),
					bookmark_url: z.string().optional(),
					url: z.string(),
					app_url: z.string(),
					dock: z
						.array(
							z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									name: z.string().nullable(),
									enabled: z.boolean().nullable(),
									position: z.number().nullable().optional(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
								})
								.loose(),
						)
						.optional(),
					bookmarked: z.boolean().optional(),
					client_company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					clientside: z
						.object({
							url: z.string().optional(),
							app_url: z.string().optional(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	getProject: z
		.object({
			id: z.number().int(),
			status: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			purpose: z.string().optional(),
			start_date: z.string().optional(),
			end_date: z.string().nullable().optional(),
			clients_enabled: z.boolean().optional(),
			bookmark_url: z.string().optional(),
			url: z.string(),
			app_url: z.string(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			bookmarked: z.boolean().optional(),
			client_company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			clientside: z
				.object({ url: z.string().optional(), app_url: z.string().optional() })
				.loose()
				.optional(),
		})
		.loose(),
	getProjects: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				created_at: z.string(),
				updated_at: z.string(),
				name: z.string(),
				description: z.string().nullable().optional(),
				purpose: z.string().optional(),
				start_date: z.string().optional(),
				end_date: z.string().nullable().optional(),
				clients_enabled: z.boolean().optional(),
				bookmark_url: z.string().optional(),
				url: z.string(),
				app_url: z.string(),
				dock: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								title: z.string().nullable(),
								name: z.string().nullable(),
								enabled: z.boolean().nullable(),
								position: z.number().nullable().optional(),
								url: z.string().nullable(),
								app_url: z.string().nullable(),
							})
							.loose(),
					)
					.optional(),
				bookmarked: z.boolean().optional(),
				client_company: z
					.object({ id: z.number().int(), name: z.string() })
					.loose()
					.optional(),
				clientside: z
					.object({
						url: z.string().optional(),
						app_url: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
	),
	getProjectsByProjectId: z
		.object({
			id: z.number().int(),
			status: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			purpose: z.string().optional(),
			start_date: z.string().optional(),
			end_date: z.string().nullable().optional(),
			clients_enabled: z.boolean().optional(),
			bookmark_url: z.string().optional(),
			url: z.string(),
			app_url: z.string(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			bookmarked: z.boolean().optional(),
			client_company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			clientside: z
				.object({ url: z.string().optional(), app_url: z.string().optional() })
				.loose()
				.optional(),
		})
		.loose(),
	getTemplates: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string().optional(),
				created_at: z.string(),
				updated_at: z.string(),
				name: z.string(),
				description: z.string().nullable().optional(),
				url: z.string().optional(),
				app_url: z.string().optional(),
				dock: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								title: z.string().nullable(),
								name: z.string().nullable(),
								enabled: z.boolean().nullable(),
								position: z.number().nullable().optional(),
								url: z.string().nullable(),
								app_url: z.string().nullable(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	),
	getTemplatesByTemplateId: z
		.object({
			id: z.number().int(),
			status: z.string().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	getTemplatesProjectConstructions: z
		.object({
			id: z.number().int(),
			status: z.string(),
			url: z.string().optional(),
			project: z
				.object({
					id: z.number().int(),
					status: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
					name: z.string(),
					description: z.string().nullable().optional(),
					purpose: z.string().optional(),
					start_date: z.string().optional(),
					end_date: z.string().nullable().optional(),
					clients_enabled: z.boolean().optional(),
					bookmark_url: z.string().optional(),
					url: z.string(),
					app_url: z.string(),
					dock: z
						.array(
							z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									name: z.string().nullable(),
									enabled: z.boolean().nullable(),
									position: z.number().nullable().optional(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
								})
								.loose(),
						)
						.optional(),
					bookmarked: z.boolean().optional(),
					client_company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					clientside: z
						.object({
							url: z.string().optional(),
							app_url: z.string().optional(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	postLineupMarkers: z.undefined(),
	postProjects: z
		.object({
			id: z.number().int(),
			status: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			purpose: z.string().optional(),
			start_date: z.string().optional(),
			end_date: z.string().nullable().optional(),
			clients_enabled: z.boolean().optional(),
			bookmark_url: z.string().optional(),
			url: z.string(),
			app_url: z.string(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			bookmarked: z.boolean().optional(),
			client_company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			clientside: z
				.object({ url: z.string().optional(), app_url: z.string().optional() })
				.loose()
				.optional(),
		})
		.loose(),
	postTemplates: z
		.object({
			id: z.number().int(),
			status: z.string().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	putProjects: z
		.object({
			id: z.number().int(),
			status: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			purpose: z.string().optional(),
			start_date: z.string().optional(),
			end_date: z.string().nullable().optional(),
			clients_enabled: z.boolean().optional(),
			bookmark_url: z.string().optional(),
			url: z.string(),
			app_url: z.string(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			bookmarked: z.boolean().optional(),
			client_company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			clientside: z
				.object({ url: z.string().optional(), app_url: z.string().optional() })
				.loose()
				.optional(),
		})
		.loose(),
	putTemplates: z
		.object({
			id: z.number().int(),
			status: z.string().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			name: z.string(),
			description: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			dock: z
				.array(
					z
						.object({
							id: z.number().int(),
							title: z.string().nullable(),
							name: z.string(),
							enabled: z.boolean(),
							position: z.number().int().nullable().optional(),
							url: z.string(),
							app_url: z.string(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	trashProject: z.undefined(),
	trashTemplate: z.undefined(),
	getCirclesPeople: z.array(
		z
			.object({
				id: z.number().int(),
				attachable_sgid: z.string().optional(),
				name: z.string(),
				email_address: z.string().nullable().optional(),
				personable_type: z.string().optional(),
				title: z.string().nullable().optional(),
				bio: z.string().nullable().optional(),
				tagline: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				admin: z.boolean().optional(),
				owner: z.boolean().optional(),
				client: z.boolean().optional(),
				employee: z.boolean().optional(),
				time_zone: z.string().optional(),
				avatar_url: z.string().optional(),
				company: z
					.object({ id: z.number().int(), name: z.string() })
					.loose()
					.optional(),
				can_manage_projects: z.boolean().optional(),
				can_manage_people: z.boolean().optional(),
				can_ping: z.boolean().optional(),
				can_access_timesheet: z.boolean().optional(),
				can_access_hill_charts: z.boolean().optional(),
			})
			.loose(),
	),
	getMyProfile: z
		.object({
			id: z.number().int(),
			attachable_sgid: z.string().optional(),
			name: z.string(),
			email_address: z.string().nullable().optional(),
			personable_type: z.string().optional(),
			title: z.string().nullable().optional(),
			bio: z.string().nullable().optional(),
			tagline: z.string().nullable().optional(),
			location: z.string().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			admin: z.boolean().optional(),
			owner: z.boolean().optional(),
			client: z.boolean().optional(),
			employee: z.boolean().optional(),
			time_zone: z.string().optional(),
			avatar_url: z.string().optional(),
			company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			can_manage_projects: z.boolean().optional(),
			can_manage_people: z.boolean().optional(),
			can_ping: z.boolean().optional(),
			can_access_timesheet: z.boolean().optional(),
			can_access_hill_charts: z.boolean().optional(),
		})
		.loose(),
	getPeople: z.array(
		z
			.object({
				id: z.number().int(),
				attachable_sgid: z.string().optional(),
				name: z.string(),
				email_address: z.string().nullable().optional(),
				personable_type: z.string().optional(),
				title: z.string().nullable().optional(),
				bio: z.string().nullable().optional(),
				tagline: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				admin: z.boolean().optional(),
				owner: z.boolean().optional(),
				client: z.boolean().optional(),
				employee: z.boolean().optional(),
				time_zone: z.string().optional(),
				avatar_url: z.string().optional(),
				company: z
					.object({ id: z.number().int(), name: z.string() })
					.loose()
					.optional(),
				can_manage_projects: z.boolean().optional(),
				can_manage_people: z.boolean().optional(),
				can_ping: z.boolean().optional(),
				can_access_timesheet: z.boolean().optional(),
				can_access_hill_charts: z.boolean().optional(),
			})
			.loose(),
	),
	getPeopleByPersonId: z
		.object({
			id: z.number().int(),
			attachable_sgid: z.string().optional(),
			name: z.string(),
			email_address: z.string().nullable().optional(),
			personable_type: z.string().optional(),
			title: z.string().nullable().optional(),
			bio: z.string().nullable().optional(),
			tagline: z.string().nullable().optional(),
			location: z.string().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			admin: z.boolean().optional(),
			owner: z.boolean().optional(),
			client: z.boolean().optional(),
			employee: z.boolean().optional(),
			time_zone: z.string().optional(),
			avatar_url: z.string().optional(),
			company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			can_manage_projects: z.boolean().optional(),
			can_manage_people: z.boolean().optional(),
			can_ping: z.boolean().optional(),
			can_access_timesheet: z.boolean().optional(),
			can_access_hill_charts: z.boolean().optional(),
		})
		.loose(),
	getPerson: z
		.object({
			id: z.number().int(),
			attachable_sgid: z.string().optional(),
			name: z.string(),
			email_address: z.string().nullable().optional(),
			personable_type: z.string().optional(),
			title: z.string().nullable().optional(),
			bio: z.string().nullable().optional(),
			tagline: z.string().nullable().optional(),
			location: z.string().nullable().optional(),
			created_at: z.string().optional(),
			updated_at: z.string().optional(),
			admin: z.boolean().optional(),
			owner: z.boolean().optional(),
			client: z.boolean().optional(),
			employee: z.boolean().optional(),
			time_zone: z.string().optional(),
			avatar_url: z.string().optional(),
			company: z
				.object({ id: z.number().int(), name: z.string() })
				.loose()
				.optional(),
			can_manage_projects: z.boolean().optional(),
			can_manage_people: z.boolean().optional(),
			can_ping: z.boolean().optional(),
			can_access_timesheet: z.boolean().optional(),
			can_access_hill_charts: z.boolean().optional(),
		})
		.loose(),
	getProjectsPeople: z.array(
		z
			.object({
				id: z.number().int(),
				attachable_sgid: z.string().optional(),
				name: z.string(),
				email_address: z.string().nullable().optional(),
				personable_type: z.string().optional(),
				title: z.string().nullable().optional(),
				bio: z.string().nullable().optional(),
				tagline: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				admin: z.boolean().optional(),
				owner: z.boolean().optional(),
				client: z.boolean().optional(),
				employee: z.boolean().optional(),
				time_zone: z.string().optional(),
				avatar_url: z.string().optional(),
				company: z
					.object({ id: z.number().int(), name: z.string() })
					.loose()
					.optional(),
				can_manage_projects: z.boolean().optional(),
				can_manage_people: z.boolean().optional(),
				can_ping: z.boolean().optional(),
				can_access_timesheet: z.boolean().optional(),
				can_access_hill_charts: z.boolean().optional(),
			})
			.loose(),
	),
	listProjectPeople: z.array(
		z
			.object({
				id: z.number().int(),
				attachable_sgid: z.string().optional(),
				name: z.string(),
				email_address: z.string().nullable().optional(),
				personable_type: z.string().optional(),
				title: z.string().nullable().optional(),
				bio: z.string().nullable().optional(),
				tagline: z.string().nullable().optional(),
				location: z.string().nullable().optional(),
				created_at: z.string().optional(),
				updated_at: z.string().optional(),
				admin: z.boolean().optional(),
				owner: z.boolean().optional(),
				client: z.boolean().optional(),
				employee: z.boolean().optional(),
				time_zone: z.string().optional(),
				avatar_url: z.string().optional(),
				company: z
					.object({ id: z.number().int(), name: z.string() })
					.loose()
					.optional(),
				can_manage_projects: z.boolean().optional(),
				can_manage_people: z.boolean().optional(),
				can_ping: z.boolean().optional(),
				can_access_timesheet: z.boolean().optional(),
				can_access_hill_charts: z.boolean().optional(),
			})
			.loose(),
	),
	putProjectsPeopleUsers: z
		.object({
			granted: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			revoked: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	completeTodo: z.undefined(),
	createTodo: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	createTodolistGroup: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			bubble_up_url: z.string(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			completed: z.boolean().optional(),
			completed_ratio: z.string().optional(),
			name: z.string(),
			todos_url: z.string().optional(),
			groups_url: z.string().optional(),
			group_position_url: z.string().optional(),
			app_todos_url: z.string().optional(),
			color: z.string().nullable(),
			comments_app_url: z.string(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getBucketsTodolists: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			bubble_up_url: z.string(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			completed: z.boolean().optional(),
			completed_ratio: z.string().optional(),
			name: z.string(),
			todos_url: z.string().optional(),
			groups_url: z.string().optional(),
			group_position_url: z.string().optional(),
			app_todos_url: z.string().optional(),
			color: z.string().nullable(),
			comments_app_url: z.string(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getBucketsTodolistsGroups: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				bubble_up_url: z.string(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				completed: z.boolean().optional(),
				completed_ratio: z.string().optional(),
				name: z.string(),
				todos_url: z.string().optional(),
				groups_url: z.string().optional(),
				group_position_url: z.string().optional(),
				app_todos_url: z.string().optional(),
				color: z.string().nullable(),
				comments_app_url: z.string(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsTodolistsTodos: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable().optional(),
				completed: z.boolean().optional(),
				content: z.string().nullable(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				starts_on: z.string().nullable().optional(),
				due_on: z.string().nullable().optional(),
				assignees: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				completion_subscribers: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				completion_url: z.string().optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
				steps: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								status: z.string().nullable(),
								visible_to_clients: z.boolean().nullable(),
								created_at: z.string().nullable(),
								updated_at: z.string().nullable(),
								title: z.string().nullable(),
								inherits_status: z.boolean().nullable(),
								type: z.string().nullable(),
								url: z.string().nullable(),
								app_url: z.string().nullable(),
								bookmark_url: z.string().nullable().optional(),
								position: z.number().nullable().optional(),
								due_on: z.string().nullable().optional(),
								completed: z.boolean().nullable().optional(),
								completed_at: z.unknown().optional(),
								parent: z.looseObject({}).nullable(),
								bucket: z.looseObject({}).nullable(),
								creator: z.looseObject({}).nullable(),
								completer: z.unknown().optional(),
								assignees: z.unknown().optional(),
								completion_url: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	),
	getBucketsTodos: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	getBucketsTodosets: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			name: z.string(),
			todolists_count: z.number().int().optional(),
			todolists_url: z.string().optional(),
			completed_ratio: z.string().optional(),
			completed: z.boolean().optional(),
			app_todolists_url: z.string().optional(),
			todos_count: z.number().int().optional(),
			completed_loose_todos_count: z.number().int().optional(),
			todos_url: z.string().optional(),
			app_todos_url: z.string().optional(),
		})
		.loose(),
	getBucketsTodosetsTodolists: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				bubble_up_url: z.string(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				completed: z.boolean().optional(),
				completed_ratio: z.string().optional(),
				name: z.string(),
				todos_url: z.string().optional(),
				groups_url: z.string().optional(),
				group_position_url: z.string().optional(),
				app_todos_url: z.string().optional(),
				color: z.string().nullable(),
				comments_app_url: z.string(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getTodo: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	getTodolist: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			bubble_up_url: z.string(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			completed: z.boolean().optional(),
			completed_ratio: z.string().optional(),
			name: z.string(),
			todos_url: z.string().optional(),
			groups_url: z.string().optional(),
			group_position_url: z.string().optional(),
			app_todos_url: z.string().optional(),
			color: z.string().nullable(),
			comments_app_url: z.string(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getTodolistGroups: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				bubble_up_url: z.string(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				completed: z.boolean().optional(),
				completed_ratio: z.string().optional(),
				name: z.string(),
				todos_url: z.string().optional(),
				groups_url: z.string().optional(),
				group_position_url: z.string().optional(),
				app_todos_url: z.string().optional(),
				color: z.string().nullable(),
				comments_app_url: z.string(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getTodoset: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			name: z.string(),
			todolists_count: z.number().int().optional(),
			todolists_url: z.string().optional(),
			completed_ratio: z.string().optional(),
			completed: z.boolean().optional(),
			app_todolists_url: z.string().optional(),
			todos_count: z.number().int().optional(),
			completed_loose_todos_count: z.number().int().optional(),
			todos_url: z.string().optional(),
			app_todos_url: z.string().optional(),
		})
		.loose(),
	listTodolists: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				bubble_up_url: z.string(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				completed: z.boolean().optional(),
				completed_ratio: z.string().optional(),
				name: z.string(),
				todos_url: z.string().optional(),
				groups_url: z.string().optional(),
				group_position_url: z.string().optional(),
				app_todos_url: z.string().optional(),
				color: z.string().nullable(),
				comments_app_url: z.string(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	postBucketsTodolistsComments: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	postBucketsTodolistsTodos: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	postBucketsTodosComments: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	postBucketsTodosetsTodolists: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			bubble_up_url: z.string(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			completed: z.boolean().optional(),
			completed_ratio: z.string().optional(),
			name: z.string(),
			todos_url: z.string().optional(),
			groups_url: z.string().optional(),
			group_position_url: z.string().optional(),
			app_todos_url: z.string().optional(),
			color: z.string().nullable(),
			comments_app_url: z.string(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsTodolistsGroupsPosition: z.undefined(),
	putBucketsTodos: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	putBucketsTodosPosition: z.undefined(),
	uncompleteTodo: z.undefined(),
	updateTodo: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			content: z.string().nullable(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			starts_on: z.string().nullable().optional(),
			due_on: z.string().nullable().optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	deleteMessageType: z.undefined(),
	getBucketsCategories: z.array(
		z
			.object({
				id: z.number().int(),
				name: z.string(),
				icon: z.string(),
				created_at: z.string(),
				updated_at: z.string(),
			})
			.loose(),
	),
	getBucketsMessageBoardsMessages: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				subject: z.string(),
				content: z.string().nullable(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				category: z
					.object({
						id: z.number().int(),
						name: z.string(),
						icon: z.string(),
						created_at: z.string(),
						updated_at: z.string(),
					})
					.loose()
					.optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getMessage: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subject: z.string(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			category: z
				.object({
					id: z.number().int(),
					name: z.string(),
					icon: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
				})
				.loose()
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getMessageBoard: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			messages_count: z.number().int().optional(),
			messages_url: z.string().optional(),
			app_messages_url: z.string().optional(),
		})
		.loose(),
	getMessageType: z
		.object({
			id: z.number().int(),
			name: z.string(),
			icon: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.loose(),
	listMessageTypes: z.array(
		z
			.object({
				id: z.number().int(),
				name: z.string(),
				icon: z.string(),
				created_at: z.string(),
				updated_at: z.string(),
			})
			.loose(),
	),
	pinMessage: z.undefined(),
	postBucketsCategories: z
		.object({
			id: z.number().int(),
			name: z.string(),
			icon: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.loose(),
	postBucketsMessageBoardsMessages: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subject: z.string(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			category: z
				.object({
					id: z.number().int(),
					name: z.string(),
					icon: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
				})
				.loose()
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsCategories: z
		.object({
			id: z.number().int(),
			name: z.string(),
			icon: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.loose(),
	putBucketsMessages: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subject: z.string(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			category: z
				.object({
					id: z.number().int(),
					name: z.string(),
					icon: z.string(),
					created_at: z.string(),
					updated_at: z.string(),
				})
				.loose()
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	unpinMessage: z.undefined(),
	updateMessageType: z
		.object({
			id: z.number().int(),
			name: z.string(),
			icon: z.string(),
			created_at: z.string(),
			updated_at: z.string(),
		})
		.loose(),
	createDocument: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable().optional(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	createUpload: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			content_type: z.string().optional(),
			byte_size: z.number().int().optional(),
			width: z.number().int().optional(),
			height: z.number().int().optional(),
			download_url: z.string().optional(),
			filename: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	createVault: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			documents_count: z.number().int().optional(),
			documents_url: z.string().optional(),
			uploads_count: z.number().int().optional(),
			uploads_url: z.string().optional(),
			vaults_count: z.number().int().optional(),
			vaults_url: z.string().optional(),
		})
		.loose(),
	getBucketsUploads: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			content_type: z.string().optional(),
			byte_size: z.number().int().optional(),
			width: z.number().int().optional(),
			height: z.number().int().optional(),
			download_url: z.string().optional(),
			filename: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getBucketsVaults: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			documents_count: z.number().int().optional(),
			documents_url: z.string().optional(),
			uploads_count: z.number().int().optional(),
			uploads_url: z.string().optional(),
			vaults_count: z.number().int().optional(),
			vaults_url: z.string().optional(),
		})
		.loose(),
	getBucketsVaultsDocuments: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				content: z.string().nullable().optional(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsVaultsUploads: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable().optional(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				content_type: z.string().optional(),
				byte_size: z.number().int().optional(),
				width: z.number().int().optional(),
				height: z.number().int().optional(),
				download_url: z.string().optional(),
				filename: z.string().optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsVaultsVaults: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				documents_count: z.number().int().optional(),
				documents_url: z.string().optional(),
				uploads_count: z.number().int().optional(),
				uploads_url: z.string().optional(),
				vaults_count: z.number().int().optional(),
				vaults_url: z.string().optional(),
			})
			.loose(),
	),
	getDocument: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable().optional(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getUpload: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			content_type: z.string().optional(),
			byte_size: z.number().int().optional(),
			width: z.number().int().optional(),
			height: z.number().int().optional(),
			download_url: z.string().optional(),
			filename: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getVault: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			documents_count: z.number().int().optional(),
			documents_url: z.string().optional(),
			uploads_count: z.number().int().optional(),
			uploads_url: z.string().optional(),
			vaults_count: z.number().int().optional(),
			vaults_url: z.string().optional(),
		})
		.loose(),
	listUploads: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				description: z.string().nullable().optional(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				content_type: z.string().optional(),
				byte_size: z.number().int().optional(),
				width: z.number().int().optional(),
				height: z.number().int().optional(),
				download_url: z.string().optional(),
				filename: z.string().optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	listVaults: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				documents_count: z.number().int().optional(),
				documents_url: z.string().optional(),
				uploads_count: z.number().int().optional(),
				uploads_url: z.string().optional(),
				vaults_count: z.number().int().optional(),
				vaults_url: z.string().optional(),
			})
			.loose(),
	),
	postAttachments: z.object({ attachable_sgid: z.string().optional() }).loose(),
	putBucketsDocuments: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable().optional(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsUploads: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			content_type: z.string().optional(),
			byte_size: z.number().int().optional(),
			width: z.number().int().optional(),
			height: z.number().int().optional(),
			download_url: z.string().optional(),
			filename: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsVaults: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			documents_count: z.number().int().optional(),
			documents_url: z.string().optional(),
			uploads_count: z.number().int().optional(),
			uploads_url: z.string().optional(),
			vaults_count: z.number().int().optional(),
			vaults_url: z.string().optional(),
		})
		.loose(),
	updateDocument: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable().optional(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	updateUpload: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			content_type: z.string().optional(),
			byte_size: z.number().int().optional(),
			width: z.number().int().optional(),
			height: z.number().int().optional(),
			download_url: z.string().optional(),
			filename: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	updateVault: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			documents_count: z.number().int().optional(),
			documents_url: z.string().optional(),
			uploads_count: z.number().int().optional(),
			uploads_url: z.string().optional(),
			vaults_count: z.number().int().optional(),
			vaults_url: z.string().optional(),
		})
		.loose(),
	createChatbot: z
		.object({
			id: z.number().int(),
			created_at: z.string(),
			updated_at: z.string(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			lines_url: z.string().optional(),
		})
		.loose(),
	createChatbotLine: z.undefined(),
	deleteCampfireLine: z.undefined(),
	deleteChatbot: z.undefined(),
	getBucketsChatsIntegrations: z.array(
		z
			.object({
				id: z.number().int(),
				created_at: z.string(),
				updated_at: z.string(),
				service_name: z.string(),
				command_url: z.string().nullable().optional(),
				url: z.string().optional(),
				app_url: z.string().optional(),
				lines_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsChatsLines: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				content: z.string().nullable().optional(),
				attachments: z
					.array(
						z
							.object({
								title: z.string().nullable().optional(),
								url: z.string().nullable().optional(),
								filename: z.string().nullable().optional(),
								content_type: z.string().nullable().optional(),
								byte_size: z.number().nullable().optional(),
								download_url: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getCampfire: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			topic: z.string().optional(),
			lines_url: z.string().optional(),
			files_url: z.string().optional(),
		})
		.loose(),
	getCampfireLine: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			content: z.string().nullable().optional(),
			attachments: z
				.array(
					z
						.object({
							title: z.string().nullable().optional(),
							url: z.string().optional(),
							filename: z.string().optional(),
							content_type: z.string().optional(),
							byte_size: z.number().int().optional(),
							download_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getChatbot: z
		.object({
			id: z.number().int(),
			created_at: z.string(),
			updated_at: z.string(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			lines_url: z.string().optional(),
		})
		.loose(),
	getChats: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				topic: z.string().optional(),
				lines_url: z.string().optional(),
				files_url: z.string().optional(),
			})
			.loose(),
	),
	listCampfireLines: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				content: z.string().nullable().optional(),
				attachments: z
					.array(
						z
							.object({
								title: z.string().nullable().optional(),
								url: z.string().nullable().optional(),
								filename: z.string().nullable().optional(),
								content_type: z.string().nullable().optional(),
								byte_size: z.number().nullable().optional(),
								download_url: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	listChatbots: z.array(
		z
			.object({
				id: z.number().int(),
				created_at: z.string(),
				updated_at: z.string(),
				service_name: z.string(),
				command_url: z.string().nullable().optional(),
				url: z.string().optional(),
				app_url: z.string().optional(),
				lines_url: z.string().optional(),
			})
			.loose(),
	),
	postBucketsChatsLines: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			content: z.string().nullable().optional(),
			attachments: z
				.array(
					z
						.object({
							title: z.string().nullable().optional(),
							url: z.string().optional(),
							filename: z.string().optional(),
							content_type: z.string().optional(),
							byte_size: z.number().int().optional(),
							download_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	postIntegrationsChatbotKeyBucketsChatsLines: z.undefined(),
	putBucketsChatsIntegrations: z
		.object({
			id: z.number().int(),
			created_at: z.string(),
			updated_at: z.string(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			lines_url: z.string().optional(),
		})
		.loose(),
	updateChatbot: z
		.object({
			id: z.number().int(),
			created_at: z.string(),
			updated_at: z.string(),
			service_name: z.string(),
			command_url: z.string().nullable().optional(),
			url: z.string().optional(),
			app_url: z.string().optional(),
			lines_url: z.string().optional(),
		})
		.loose(),
	createCard: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			content: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			completion_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	createCardStep: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
		})
		.loose(),
	deleteBucketsCardTablesColumnsOnHold: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	getBucketsCardTablesListsCards: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				content: z.string().nullable().optional(),
				description: z.string().nullable().optional(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				due_on: z.string().nullable().optional(),
				completed: z.boolean().optional(),
				completed_at: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				completion_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				completer: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose()
					.optional(),
				assignees: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				completion_subscribers: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				steps: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								status: z.string().nullable(),
								visible_to_clients: z.boolean().nullable(),
								created_at: z.string().nullable(),
								updated_at: z.string().nullable(),
								title: z.string().nullable(),
								inherits_status: z.boolean().nullable(),
								type: z.string().nullable(),
								url: z.string().nullable(),
								app_url: z.string().nullable(),
								bookmark_url: z.string().nullable().optional(),
								position: z.number().nullable().optional(),
								due_on: z.string().nullable().optional(),
								completed: z.boolean().nullable().optional(),
								completed_at: z.unknown().optional(),
								parent: z.looseObject({}).nullable(),
								bucket: z.looseObject({}).nullable(),
								creator: z.looseObject({}).nullable(),
								completer: z.unknown().optional(),
								assignees: z.unknown().optional(),
								completion_url: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getCard: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			content: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			completion_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getCardTable: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			lists: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							color: z.string().nullable().optional(),
							description: z.string().nullable().optional(),
							cards_count: z.number().int().optional(),
							comments_count: z.number().int().optional(),
							cards_url: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							subscribers: z.array(z.unknown()).optional(),
							on_hold: z
								.object({
									id: z.union([z.string(), z.number()]),
									status: z.string().nullable(),
									inherits_status: z.boolean().nullable(),
									title: z.string().nullable(),
									created_at: z.string().nullable(),
									updated_at: z.string().nullable(),
									cards_count: z.number().nullable(),
									cards_url: z.string().nullable(),
								})
								.loose()
								.optional(),
						})
						.loose(),
				)
				.optional(),
			wormholes: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							color: z.string().nullable(),
							linked: z.boolean(),
							destination_url: z.string().nullable(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	getCardTableColumn: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	listCards: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				content: z.string().nullable().optional(),
				description: z.string().nullable().optional(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				due_on: z.string().nullable().optional(),
				completed: z.boolean().optional(),
				completed_at: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				completion_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				completer: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose()
					.optional(),
				assignees: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				completion_subscribers: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				steps: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								status: z.string().nullable(),
								visible_to_clients: z.boolean().nullable(),
								created_at: z.string().nullable(),
								updated_at: z.string().nullable(),
								title: z.string().nullable(),
								inherits_status: z.boolean().nullable(),
								type: z.string().nullable(),
								url: z.string().nullable(),
								app_url: z.string().nullable(),
								bookmark_url: z.string().nullable().optional(),
								position: z.number().nullable().optional(),
								due_on: z.string().nullable().optional(),
								completed: z.boolean().nullable().optional(),
								completed_at: z.unknown().optional(),
								parent: z.looseObject({}).nullable(),
								bucket: z.looseObject({}).nullable(),
								creator: z.looseObject({}).nullable(),
								completer: z.unknown().optional(),
								assignees: z.unknown().optional(),
								completion_url: z.string().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	moveCard: z.undefined(),
	moveCardTableColumn: z.undefined(),
	postBucketsCardTablesCardsMoves: z.undefined(),
	postBucketsCardTablesCardsPositions: z.undefined(),
	postBucketsCardTablesColumns: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	postBucketsCardTablesColumnsOnHold: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	postBucketsCardTablesMoves: z.undefined(),
	putBucketsCardTablesCards: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			content: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			completion_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsCardTablesColumns: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	putBucketsCardTablesColumnsColor: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	putBucketsCardTablesSteps: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
		})
		.loose(),
	putBucketsCardTablesStepsCompletions: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_url: z.string().optional(),
		})
		.loose(),
	repositionCardStep: z.undefined(),
	unwatchCardTableColumn: z.undefined(),
	updateCard: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			content: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			due_on: z.string().nullable().optional(),
			completed: z.boolean().optional(),
			completed_at: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			completion_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			completer: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose()
				.optional(),
			assignees: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			completion_subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			steps: z
				.array(
					z
						.object({
							id: z.number().int(),
							status: z.string(),
							visible_to_clients: z.boolean(),
							created_at: z.string(),
							updated_at: z.string(),
							title: z.string().nullable(),
							inherits_status: z.boolean(),
							type: z.string(),
							url: z.string(),
							app_url: z.string(),
							bookmark_url: z.string().optional(),
							position: z.number().int().nullable().optional(),
							due_on: z.string().nullable().optional(),
							completed: z.boolean().optional(),
							completed_at: z.string().optional(),
							parent: z
								.object({
									id: z.union([z.string(), z.number()]),
									title: z.string().nullable(),
									type: z.string().nullable(),
									url: z.string().nullable(),
									app_url: z.string().nullable(),
									bucket: z.looseObject({}).nullable().optional(),
								})
								.loose(),
							bucket: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
									type: z.string().nullable(),
								})
								.loose(),
							creator: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose(),
							completer: z
								.object({
									id: z.union([z.string(), z.number()]),
									attachable_sgid: z.string().nullable().optional(),
									name: z.string().nullable(),
									email_address: z.string().nullable().optional(),
									personable_type: z.string().nullable().optional(),
									title: z.string().nullable().optional(),
									bio: z.string().nullable().optional(),
									tagline: z.string().nullable().optional(),
									location: z.string().nullable().optional(),
									created_at: z.string().nullable().optional(),
									updated_at: z.string().nullable().optional(),
									admin: z.boolean().nullable().optional(),
									owner: z.boolean().nullable().optional(),
									client: z.boolean().nullable().optional(),
									employee: z.boolean().nullable().optional(),
									time_zone: z.string().nullable().optional(),
									avatar_url: z.string().nullable().optional(),
									company: z.looseObject({}).nullable().optional(),
									can_manage_projects: z.boolean().nullable().optional(),
									can_manage_people: z.boolean().nullable().optional(),
									can_ping: z.boolean().nullable().optional(),
									can_access_timesheet: z.boolean().nullable().optional(),
									can_access_hill_charts: z.boolean().nullable().optional(),
								})
								.loose()
								.optional(),
							assignees: z.array(z.unknown()).optional(),
							completion_url: z.string().optional(),
						})
						.loose(),
				)
				.optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	updateCardTableColumn: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			color: z.string().nullable().optional(),
			description: z.string().nullable().optional(),
			cards_count: z.number().int().optional(),
			comments_count: z.number().int().optional(),
			cards_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			on_hold: z
				.object({
					id: z.number().int(),
					status: z.string(),
					inherits_status: z.boolean(),
					title: z.string().nullable(),
					created_at: z.string(),
					updated_at: z.string(),
					cards_count: z.number().int(),
					cards_url: z.string(),
				})
				.loose()
				.optional(),
		})
		.loose(),
	watchCardTableColumn: z.undefined(),
	getBucketsSchedulesEntries: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				summary: z.string(),
				description: z.string().nullable().optional(),
				description_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				all_day: z.boolean(),
				starts_at: z.string(),
				ends_at: z.string(),
				participants: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								attachable_sgid: z.string().nullable().optional(),
								name: z.string().nullable(),
								email_address: z.string().nullable().optional(),
								personable_type: z.string().nullable().optional(),
								title: z.string().nullable().optional(),
								bio: z.string().nullable().optional(),
								tagline: z.string().nullable().optional(),
								location: z.string().nullable().optional(),
								created_at: z.string().nullable().optional(),
								updated_at: z.string().nullable().optional(),
								admin: z.boolean().nullable().optional(),
								owner: z.boolean().nullable().optional(),
								client: z.boolean().nullable().optional(),
								employee: z.boolean().nullable().optional(),
								time_zone: z.string().nullable().optional(),
								avatar_url: z.string().nullable().optional(),
								company: z.looseObject({}).nullable().optional(),
								can_manage_projects: z.boolean().nullable().optional(),
								can_manage_people: z.boolean().nullable().optional(),
								can_ping: z.boolean().nullable().optional(),
								can_access_timesheet: z.boolean().nullable().optional(),
								can_access_hill_charts: z.boolean().nullable().optional(),
							})
							.loose(),
					)
					.optional(),
				join_url: z.string().nullable().optional(),
				highlighted: z.boolean().optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getReportsTimesheet: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				date: z.string().optional(),
				description: z.string().nullable().optional(),
				hours: z.string().optional(),
				person: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
	),
	getSchedule: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			include_due_assignments: z.boolean().optional(),
			entries_count: z.number().int().optional(),
			entries_url: z.string().optional(),
		})
		.loose(),
	getScheduleEntry: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			summary: z.string(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			all_day: z.boolean(),
			starts_at: z.string(),
			ends_at: z.string(),
			participants: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			join_url: z.string().nullable().optional(),
			highlighted: z.boolean().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	postBucketsSchedulesEntries: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			summary: z.string(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			all_day: z.boolean(),
			starts_at: z.string(),
			ends_at: z.string(),
			participants: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			join_url: z.string().nullable().optional(),
			highlighted: z.boolean().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsScheduleEntries: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			summary: z.string(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			all_day: z.boolean(),
			starts_at: z.string(),
			ends_at: z.string(),
			participants: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			join_url: z.string().nullable().optional(),
			highlighted: z.boolean().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsSchedules: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			include_due_assignments: z.boolean().optional(),
			entries_count: z.number().int().optional(),
			entries_url: z.string().optional(),
		})
		.loose(),
	updateScheduleEntry: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			summary: z.string(),
			description: z.string().nullable().optional(),
			description_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			all_day: z.boolean(),
			starts_at: z.string(),
			ends_at: z.string(),
			participants: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
			join_url: z.string().nullable().optional(),
			highlighted: z.boolean().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getBucketsQuestionAnswers: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			group_on: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getBucketsQuestionnaires: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			questions_url: z.string().optional(),
			questions_count: z.number().int().optional(),
			name: z.string(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
		})
		.loose(),
	getBucketsQuestionnairesQuestions: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				paused: z.boolean().optional(),
				schedule: z
					.object({
						frequency: z.string().optional(),
						days: z.array(z.unknown()).optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
						week_instance: z.number().int().nullable().optional(),
						week_interval: z.number().int().nullable().optional(),
						month_interval: z.number().int().nullable().optional(),
						start_date: z.string().optional(),
						end_date: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				answers_count: z.number().int().optional(),
				answers_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsQuestions: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			subscription_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			paused: z.boolean().optional(),
			schedule: z
				.object({
					frequency: z.string().optional(),
					days: z.array(z.number().int()).optional(),
					hour: z.number().int().optional(),
					minute: z.number().int().optional(),
					week_instance: z.number().int().nullable().optional(),
					week_interval: z.number().int().nullable().optional(),
					month_interval: z.number().int().nullable().optional(),
					start_date: z.string().optional(),
					end_date: z.string().nullable().optional(),
				})
				.loose()
				.optional(),
			answers_count: z.number().int().optional(),
			answers_url: z.string().optional(),
		})
		.loose(),
	listQuestions: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				paused: z.boolean().optional(),
				schedule: z
					.object({
						frequency: z.string().optional(),
						days: z.array(z.unknown()).optional(),
						hour: z.number().int().optional(),
						minute: z.number().int().optional(),
						week_instance: z.number().int().nullable().optional(),
						week_interval: z.number().int().nullable().optional(),
						month_interval: z.number().int().nullable().optional(),
						start_date: z.string().optional(),
						end_date: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				answers_count: z.number().int().optional(),
				answers_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsInboxesForwards: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				content: z.string().nullable().optional(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				subject: z.string(),
				from: z.string().nullable().optional(),
				replies_count: z.number().int().optional(),
				replies_url: z.string().optional(),
			})
			.loose(),
	),
	getInbox: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			forwards_count: z.number().int().optional(),
			forwards_url: z.string().optional(),
		})
		.loose(),
	listForwards: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				subscription_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				content: z.string().nullable().optional(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				subject: z.string(),
				from: z.string().nullable().optional(),
				replies_count: z.number().int().optional(),
				replies_url: z.string().optional(),
			})
			.loose(),
	),
	deleteBucketsRecordingsPin: z.undefined(),
	getBucketsRecordingsComments: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				content: z.string().nullable(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getBucketsRecordingsEvents: z.array(
		z
			.object({
				id: z.number().int(),
				recording_id: z.number().int(),
				action: z.string(),
				details: z
					.object({
						added_person_ids: z.array(z.unknown()).optional(),
						removed_person_ids: z.array(z.unknown()).optional(),
						notified_recipient_ids: z.array(z.unknown()).optional(),
					})
					.loose()
					.optional(),
				created_at: z.string(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	getComment: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	getProjectsRecordings: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				bubble_up_url: z.string().optional(),
				content: z.string().nullable().optional(),
				content_attachments: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								sgid: z.string().nullable(),
								filename: z.string().nullable(),
								content_type: z.string().nullable(),
								byte_size: z.number().nullable(),
								download_url: z.string().nullable(),
								width: z.number().nullable().optional(),
								height: z.number().nullable().optional(),
								previewable: z.boolean().nullable(),
								preview_url: z.string().nullable(),
								thumbnail_url: z.string().nullable(),
							})
							.loose(),
					)
					.optional(),
				description_attachments: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]),
								sgid: z.string().nullable(),
								filename: z.string().nullable(),
								content_type: z.string().nullable(),
								byte_size: z.number().nullable(),
								download_url: z.string().nullable(),
								width: z.number().nullable().optional(),
								height: z.number().nullable().optional(),
								previewable: z.boolean().nullable(),
								preview_url: z.string().nullable(),
								thumbnail_url: z.string().nullable(),
							})
							.loose(),
					)
					.optional(),
				comments_count: z.number().int().optional(),
				comments_url: z.string().optional(),
				subscription_url: z.string().optional(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
				subject: z.string().optional(),
				category: z
					.object({
						id: z.number().int(),
						name: z.string(),
						icon: z.string().optional(),
					})
					.loose()
					.optional(),
				group_on: z.string().optional(),
				from: z.string().nullable().optional(),
				replies_count: z.number().int().optional(),
				replies_url: z.string().optional(),
				position: z.number().int().nullable().optional(),
				description: z.string().nullable().optional(),
				service: z
					.object({
						name: z.string().optional(),
						example_url: z.string().optional(),
						code: z.string().optional(),
						valid_patterns: z.array(z.unknown()).optional(),
						supporting_text: z.string().optional(),
					})
					.loose()
					.optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
			})
			.loose(),
	),
	getSubscription: z
		.object({
			subscribed: z.boolean(),
			count: z.number().int(),
			url: z.string(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	listComments: z.array(
		z
			.object({
				id: z.number().int(),
				status: z.string(),
				visible_to_clients: z.boolean(),
				created_at: z.string(),
				updated_at: z.string(),
				title: z.string().nullable(),
				inherits_status: z.boolean(),
				type: z.string(),
				url: z.string(),
				app_url: z.string(),
				bookmark_url: z.string().optional(),
				parent: z
					.object({
						id: z.number().int(),
						title: z.string().nullable(),
						type: z.string(),
						url: z.string(),
						app_url: z.string(),
						bucket: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
								type: z.string().nullable(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				bucket: z
					.object({ id: z.number().int(), name: z.string(), type: z.string() })
					.loose(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				content: z.string().nullable(),
				content_attachments: z.array(
					z
						.object({
							id: z.union([z.string(), z.number()]),
							sgid: z.string().nullable(),
							filename: z.string().nullable(),
							content_type: z.string().nullable(),
							byte_size: z.number().nullable(),
							download_url: z.string().nullable(),
							width: z.number().nullable().optional(),
							height: z.number().nullable().optional(),
							previewable: z.boolean().nullable(),
							preview_url: z.string().nullable(),
							thumbnail_url: z.string().nullable(),
						})
						.loose(),
				),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	listEvents: z.array(
		z
			.object({
				id: z.number().int(),
				recording_id: z.number().int(),
				action: z.string(),
				details: z
					.object({
						added_person_ids: z.array(z.unknown()).optional(),
						removed_person_ids: z.array(z.unknown()).optional(),
						notified_recipient_ids: z.array(z.unknown()).optional(),
					})
					.loose()
					.optional(),
				created_at: z.string(),
				creator: z
					.object({
						id: z.number().int(),
						attachable_sgid: z.string().optional(),
						name: z.string(),
						email_address: z.string().nullable().optional(),
						personable_type: z.string().optional(),
						title: z.string().nullable().optional(),
						bio: z.string().nullable().optional(),
						tagline: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						created_at: z.string().optional(),
						updated_at: z.string().optional(),
						admin: z.boolean().optional(),
						owner: z.boolean().optional(),
						client: z.boolean().optional(),
						employee: z.boolean().optional(),
						time_zone: z.string().optional(),
						avatar_url: z.string().optional(),
						company: z
							.object({
								id: z.union([z.string(), z.number()]),
								name: z.string().nullable(),
							})
							.loose()
							.optional(),
						can_manage_projects: z.boolean().optional(),
						can_manage_people: z.boolean().optional(),
						can_ping: z.boolean().optional(),
						can_access_timesheet: z.boolean().optional(),
						can_access_hill_charts: z.boolean().optional(),
					})
					.loose(),
				boosts_count: z.number().int().optional(),
				boosts_url: z.string().optional(),
			})
			.loose(),
	),
	postBucketsRecordingsComments: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	postBucketsRecordingsPin: z.undefined(),
	postBucketsRecordingsSubscription: z
		.object({
			subscribed: z.boolean(),
			count: z.number().int(),
			url: z.string(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	putBucketsComments: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
			content: z.string().nullable(),
			content_attachments: z.array(
				z
					.object({
						id: z.number().int(),
						sgid: z.string(),
						filename: z.string(),
						content_type: z.string(),
						byte_size: z.number().int(),
						download_url: z.string(),
						width: z.number().int().nullable().optional(),
						height: z.number().int().nullable().optional(),
						previewable: z.boolean(),
						preview_url: z.string(),
						thumbnail_url: z.string(),
					})
					.loose(),
			),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
		})
		.loose(),
	putBucketsRecordingsClientVisibility: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			bubble_up_url: z.string().optional(),
			content: z.string().nullable().optional(),
			content_attachments: z
				.array(
					z
						.object({
							id: z.number().int(),
							sgid: z.string(),
							filename: z.string(),
							content_type: z.string(),
							byte_size: z.number().int(),
							download_url: z.string(),
							width: z.number().int().nullable().optional(),
							height: z.number().int().nullable().optional(),
							previewable: z.boolean(),
							preview_url: z.string(),
							thumbnail_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			description_attachments: z
				.array(
					z
						.object({
							id: z.number().int(),
							sgid: z.string(),
							filename: z.string(),
							content_type: z.string(),
							byte_size: z.number().int(),
							download_url: z.string(),
							width: z.number().int().nullable().optional(),
							height: z.number().int().nullable().optional(),
							previewable: z.boolean(),
							preview_url: z.string(),
							thumbnail_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			subscription_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			subject: z.string().optional(),
			category: z
				.object({
					id: z.number().int(),
					name: z.string(),
					icon: z.string().optional(),
				})
				.loose()
				.optional(),
			group_on: z.string().optional(),
			from: z.string().nullable().optional(),
			replies_count: z.number().int().optional(),
			replies_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			description: z.string().nullable().optional(),
			service: z
				.object({
					name: z.string().optional(),
					example_url: z.string().optional(),
					code: z.string().optional(),
					valid_patterns: z.array(z.string()).optional(),
					supporting_text: z.string().optional(),
				})
				.loose()
				.optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
		})
		.loose(),
	putBucketsRecordingsStatusActive: z.undefined(),
	putBucketsRecordingsStatusArchived: z.undefined(),
	putBucketsRecordingsStatusTrashed: z.undefined(),
	putBucketsRecordingsSubscription: z
		.object({
			subscribed: z.boolean(),
			count: z.number().int(),
			url: z.string(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	subscribeCurrentUser: z
		.object({
			subscribed: z.boolean(),
			count: z.number().int(),
			url: z.string(),
			subscribers: z
				.array(
					z
						.object({
							id: z.number().int(),
							attachable_sgid: z.string().optional(),
							name: z.string(),
							email_address: z.string().nullable().optional(),
							personable_type: z.string().optional(),
							title: z.string().nullable().optional(),
							bio: z.string().nullable().optional(),
							tagline: z.string().nullable().optional(),
							location: z.string().nullable().optional(),
							created_at: z.string().optional(),
							updated_at: z.string().optional(),
							admin: z.boolean().optional(),
							owner: z.boolean().optional(),
							client: z.boolean().optional(),
							employee: z.boolean().optional(),
							time_zone: z.string().optional(),
							avatar_url: z.string().optional(),
							company: z
								.object({
									id: z.union([z.string(), z.number()]),
									name: z.string().nullable(),
								})
								.loose()
								.optional(),
							can_manage_projects: z.boolean().optional(),
							can_manage_people: z.boolean().optional(),
							can_ping: z.boolean().optional(),
							can_access_timesheet: z.boolean().optional(),
							can_access_hill_charts: z.boolean().optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	toggleClientVisibility: z
		.object({
			id: z.number().int(),
			status: z.string(),
			visible_to_clients: z.boolean(),
			created_at: z.string(),
			updated_at: z.string(),
			title: z.string().nullable(),
			inherits_status: z.boolean(),
			type: z.string(),
			url: z.string(),
			app_url: z.string(),
			bookmark_url: z.string().optional(),
			bubble_up_url: z.string().optional(),
			content: z.string().nullable().optional(),
			content_attachments: z
				.array(
					z
						.object({
							id: z.number().int(),
							sgid: z.string(),
							filename: z.string(),
							content_type: z.string(),
							byte_size: z.number().int(),
							download_url: z.string(),
							width: z.number().int().nullable().optional(),
							height: z.number().int().nullable().optional(),
							previewable: z.boolean(),
							preview_url: z.string(),
							thumbnail_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			description_attachments: z
				.array(
					z
						.object({
							id: z.number().int(),
							sgid: z.string(),
							filename: z.string(),
							content_type: z.string(),
							byte_size: z.number().int(),
							download_url: z.string(),
							width: z.number().int().nullable().optional(),
							height: z.number().int().nullable().optional(),
							previewable: z.boolean(),
							preview_url: z.string(),
							thumbnail_url: z.string(),
						})
						.loose(),
				)
				.optional(),
			comments_count: z.number().int().optional(),
			comments_url: z.string().optional(),
			subscription_url: z.string().optional(),
			boosts_count: z.number().int().optional(),
			boosts_url: z.string().optional(),
			subject: z.string().optional(),
			category: z
				.object({
					id: z.number().int(),
					name: z.string(),
					icon: z.string().optional(),
				})
				.loose()
				.optional(),
			group_on: z.string().optional(),
			from: z.string().nullable().optional(),
			replies_count: z.number().int().optional(),
			replies_url: z.string().optional(),
			position: z.number().int().nullable().optional(),
			description: z.string().nullable().optional(),
			service: z
				.object({
					name: z.string().optional(),
					example_url: z.string().optional(),
					code: z.string().optional(),
					valid_patterns: z.array(z.string()).optional(),
					supporting_text: z.string().optional(),
				})
				.loose()
				.optional(),
			parent: z
				.object({
					id: z.number().int(),
					title: z.string().nullable(),
					type: z.string(),
					url: z.string(),
					app_url: z.string(),
					bucket: z
						.object({
							id: z.number().int(),
							name: z.string(),
							type: z.string(),
						})
						.loose()
						.optional(),
				})
				.loose()
				.optional(),
			bucket: z
				.object({ id: z.number().int(), name: z.string(), type: z.string() })
				.loose(),
			creator: z
				.object({
					id: z.number().int(),
					attachable_sgid: z.string().optional(),
					name: z.string(),
					email_address: z.string().nullable().optional(),
					personable_type: z.string().optional(),
					title: z.string().nullable().optional(),
					bio: z.string().nullable().optional(),
					tagline: z.string().nullable().optional(),
					location: z.string().nullable().optional(),
					created_at: z.string().optional(),
					updated_at: z.string().optional(),
					admin: z.boolean().optional(),
					owner: z.boolean().optional(),
					client: z.boolean().optional(),
					employee: z.boolean().optional(),
					time_zone: z.string().optional(),
					avatar_url: z.string().optional(),
					company: z
						.object({ id: z.number().int(), name: z.string() })
						.loose()
						.optional(),
					can_manage_projects: z.boolean().optional(),
					can_manage_people: z.boolean().optional(),
					can_ping: z.boolean().optional(),
					can_access_timesheet: z.boolean().optional(),
					can_access_hill_charts: z.boolean().optional(),
				})
				.loose(),
		})
		.loose(),
	unsubscribeCurrentUser: z.undefined(),
	deleteWebhooks: z.undefined(),
	getBucketsWebhooks: z.array(
		z
			.object({
				id: z.number().int(),
				active: z.boolean().optional(),
				created_at: z.string(),
				updated_at: z.string(),
				payload_url: z.string(),
				types: z.array(z.string()).optional(),
				url: z.string(),
				app_url: z.string(),
				recent_deliveries: z
					.array(
						z
							.object({
								id: z.union([z.string(), z.number()]).optional(),
								created_at: z.string().nullable().optional(),
								request: z.looseObject({}).nullable().optional(),
								response: z.looseObject({}).nullable().optional(),
							})
							.loose(),
					)
					.optional(),
			})
			.loose(),
	),
	getWebhook: z
		.object({
			id: z.number().int(),
			active: z.boolean().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			payload_url: z.string(),
			types: z.array(z.string()).optional(),
			url: z.string(),
			app_url: z.string(),
			recent_deliveries: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							created_at: z.string().optional(),
							request: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									body: z.unknown().optional(),
								})
								.loose()
								.optional(),
							response: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									code: z.unknown().optional(),
									message: z.string().nullable().optional(),
								})
								.loose()
								.optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	postBucketsWebhooks: z
		.object({
			id: z.number().int(),
			active: z.boolean().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			payload_url: z.string(),
			types: z.array(z.string()).optional(),
			url: z.string(),
			app_url: z.string(),
			recent_deliveries: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							created_at: z.string().optional(),
							request: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									body: z.unknown().optional(),
								})
								.loose()
								.optional(),
							response: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									code: z.unknown().optional(),
									message: z.string().nullable().optional(),
								})
								.loose()
								.optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
	putBucketsWebhooks: z
		.object({
			id: z.number().int(),
			active: z.boolean().optional(),
			created_at: z.string(),
			updated_at: z.string(),
			payload_url: z.string(),
			types: z.array(z.string()).optional(),
			url: z.string(),
			app_url: z.string(),
			recent_deliveries: z
				.array(
					z
						.object({
							id: z.number().int().optional(),
							created_at: z.string().optional(),
							request: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									body: z.unknown().optional(),
								})
								.loose()
								.optional(),
							response: z
								.object({
									headers: z.looseObject({}).nullable().optional(),
									code: z.unknown().optional(),
									message: z.string().nullable().optional(),
								})
								.loose()
								.optional(),
						})
						.loose(),
				)
				.optional(),
		})
		.loose(),
} as const;

export type BasecampEndpointInputs = {
	[K in keyof typeof BasecampEndpointInputSchemas]: z.infer<
		(typeof BasecampEndpointInputSchemas)[K]
	>;
};

export type BasecampEndpointOutputs = {
	[K in keyof typeof BasecampEndpointOutputSchemas]: z.infer<
		(typeof BasecampEndpointOutputSchemas)[K]
	>;
};
