import type { HexEndpointInputs, HexEndpointOutputs } from './endpoints/types';

export const validInputs = {
	adminListAgentUsage: {},
	cellsList: {
		projectId: 'sample_string',
	},
	cellsCreate: {
		projectId: '11111111-1111-4111-8111-111111111111',
		cellType: 'CODE',
		label: 'Check input data',
		contents: {
			codeCell: {
				source: "print('hello from Hex')",
			},
		},
	},
	cellsDelete: {
		cellId: '11111111-1111-4111-8111-111111111111',
	},
	cellsGet: {
		cellId: '11111111-1111-4111-8111-111111111111',
	},
	cellsUpdate: {
		cellId: 'sample_string',
		dataConnectionId: 'sample_string',
		contents: {
			codeCell: {
				source: 'sample_string',
			},
			sqlCell: {
				source: 'sample_string',
				outputDataframe: 'sample_string',
			},
			markdownCell: {
				source: 'sample_string',
			},
		},
	},
	cellsGetChartImage: {
		cellId: 'sample_string',
	},
	cellsGetOutput: {
		cellId: 'sample_string',
	},
	collectionsList: {},
	collectionsCreate: {
		sharing: {
			users: [],
			groups: [],
			workspace: {
				members: 'sample_string',
			},
		},
		description: 'sample_string',
		name: 'sample_string',
	},
	collectionsGet: {
		collectionId: '11111111-1111-4111-8111-111111111111',
	},
	collectionsUpdate: {
		collectionId: '11111111-1111-4111-8111-111111111111',
		sharing: {
			upsert: {
				users: [],
				groups: [],
				workspace: {
					members: 'sample_string',
				},
			},
		},
		description: 'sample_string',
		name: 'sample_string',
	},
	adminListTopics: {},
	adminListCreditGrants: {},
	dataConnectionsList: {},
	dataConnectionsCreate: {
		connectionDetails: {
			postgres: {
				hostname: 'warehouse.example.com',
				port: 5432,
				database: 'analytics',
				username: 'hex_service',
				password: 'test-password',
			},
		},
		type: 'postgres',
		name: 'Analytics warehouse',
	},
	dataConnectionsGet: {
		dataConnectionId: 'sample_string',
	},
	dataConnectionsUpdate: {
		dataConnectionId: '11111111-1111-4111-8111-111111111111',
		name: 'Renamed DB',
	},
	dataConnectionsUpdateSchema: {
		dataConnectionId: '11111111-1111-4111-8111-111111111111',
		updates: [
			{
				type: 'DATABASE',
				name: 'sample_string',
				status: 'sample_string',
			},
		],
	},
	embeddingCreatePresignedUrl: {
		projectId: '11111111-1111-4111-8111-111111111111',
		hexUserAttributes: { customerTier: 'enterprise' },
		scope: ['sample_string'],
		inputParameters: { region: 'US', cohort: ['returning', 'new'] },
		expiresIn: 1,
		displayOptions: {
			theme: 'light',
			showEmbeddedRunButton: true,
			noEmbedHeaderPadding: true,
			noEmbedBasePadding: true,
			noEmbedOutline: true,
			noEmbedFooter: true,
		},
		testMode: true,
	},
	groupsList: {},
	groupsCreate: {
		members: {
			users: [],
		},
		name: 'sample_string',
	},
	groupsDelete: {
		groupId: '11111111-1111-4111-8111-111111111111',
	},
	groupsGet: {
		groupId: '11111111-1111-4111-8111-111111111111',
	},
	groupsUpdate: {
		groupId: '11111111-1111-4111-8111-111111111111',
		members: {
			remove: {
				users: [],
			},
			add: {
				users: [],
			},
		},
		name: 'sample_string',
	},
	guidesUpsertDraft: {
		forceWrite: true,
		files: [
			{
				contents: 'sample_string',
				filePath: 'sample_string',
			},
		],
	},
	guidesDeleteDraft: {
		orgGuideFileId: '11111111-1111-4111-8111-111111111111',
	},
	guidesListDrafts: {},
	guidesPublish: {
		orgGuideFileIds: ['11111111-1111-4111-8111-111111111111'],
		publishAllDraftGuides: true,
	},
	projectsList: {
		limit: 20,
		after: 'projects-cursor-1',
		sortBy: 'CREATED_AT',
		sortDirection: 'DESC',
	},
	projectsCreate: {
		title: 'sample_string',
		description: 'sample_string',
	},
	projectsGet: {
		projectId: 'sample_string',
	},
	projectsUpdate: {
		projectId: 'sample_string',
		status: 'sample_string',
	},
	projectsGetQueriedTables: {
		projectId: '11111111-1111-4111-8111-111111111111',
	},
	projectRunsList: {
		projectId: '11111111-1111-4111-8111-111111111111',
		limit: 7,
		offset: 14,
		statusFilter: 'COMPLETED',
		runTriggerFilter: 'API',
	},
	projectRunsRun: {
		projectId: '11111111-1111-4111-8111-111111111111',
		inputParams: { region: 'west', includeArchived: false },
		dryRun: false,
		updateCache: true,
		notifications: [
			{
				type: 'SUCCESS',
				includeSuccessScreenshot: false,
				userIds: ['22222222-2222-4222-8222-222222222222'],
			},
		],
		updatePublishedResults: true,
		useCachedSqlResults: false,
		viewId: 'view-q3-west',
	},
	projectRunsCancel: {
		projectId: '11111111-1111-4111-8111-111111111111',
		runId: '11111111-1111-4111-8111-111111111111',
	},
	projectRunsGetStatus: {
		projectId: '11111111-1111-4111-8111-111111111111',
		runId: '22222222-2222-4222-8222-222222222222',
		enableExpandedStats: 'true',
	},
	projectRunsGetChartImage: {
		projectId: 'sample_string',
		runId: 'sample_string',
		staticId: 'sample_string',
	},
	projectsEditSharingCollections: {
		projectId: '11111111-1111-4111-8111-111111111111',
		sharing: {
			upsert: {
				collections: [],
			},
		},
	},
	projectsEditSharingGroups: {
		projectId: 'sample_string',
		sharing: {
			upsert: {
				groups: [],
			},
		},
	},
	projectsEditSharingUsers: {
		projectId: 'sample_string',
		sharing: {
			upsert: {
				users: [],
			},
		},
		includeUnlisted: true,
	},
	projectsEditSharingOrgAndPublic: {
		projectId: 'sample_string',
		sharing: {
			workspace: 'NONE',
			publicWeb: 'NONE',
		},
	},
	projectsBatchUpdateComputeProfile: {
		projectIds: ['sample_string'],
		kernelImage: 'sample_string',
		kernelSize: 'xsmall',
	},
	projectsExport: {
		projectId: 'sample_string',
		version: 1,
	},
	semanticUpdate: {
		semanticProjectId: '11111111-1111-4111-8111-111111111111',
		updates: [
			{
				type: 'DATASET',
				name: 'sample_string',
				status: 'sample_string',
			},
		],
	},
	suggestionsList: {},
	suggestionsGet: {
		suggestionId: 'sample_string',
	},
	suggestionsUpdate: {
		suggestionId: 'sample_string',
		status: 'OPEN',
		rejectionReason: 'sample_string',
	},
	suggestionsUpdateChange: {
		suggestionId: 'sample_string',
		changeId: 'sample_string',
		updateTarget: 'FILE_UPDATE',
		status: 'NEEDS_REVIEW',
		rejectionReason: 'sample_string',
	},
	suggestionsTriggerReview: {
		suggestionId: 'sample_string',
	},
	threadsList: {
		after: 'threads-cursor-1',
		limit: 12,
		source: 'PUBLIC_API',
	},
	threadsCreate: {
		prompt: 'Summarize monthly revenue by region.',
		attachments: {
			dataConnectionId: '33333333-3333-4333-8333-333333333333',
			tableIds: ['warehouse.public.monthly_revenue'],
			projectIds: ['11111111-1111-4111-8111-111111111111'],
		},
		projectId: '11111111-1111-4111-8111-111111111111',
		muted: false,
	},
	threadsGet: {
		id: 'sample_string',
	},
	threadsContinue: {
		id: '44444444-4444-4444-8444-444444444444',
		prompt: 'Now compare those regions with the previous month.',
		attachments: {
			projectIds: ['11111111-1111-4111-8111-111111111111'],
		},
	},
	threadsGetMessages: {
		threadId: '44444444-4444-4444-8444-444444444444',
		after: 'messages-cursor-1',
		limit: 20,
		full: true,
	},
	usersList: {},
	usersDeactivate: {
		userId: 'sample_string',
	},
	usersMe: {},
	suggestionsGetV2: {
		suggestionId: 'sample_string',
	},
} satisfies HexEndpointInputs;

export const validOutputs = {
	adminListAgentUsage: {
		runs: [
			{
				runId: 'sample_string',
				runTimestamp: 'sample_string',
				userId: 'sample_string',
				model: 'sample_string',
				creditsChargedToUser: 1,
				creditsChargedToWorkspace: 1,
				totalCreditsCharged: 1,
				billingCycleStart: 'sample_string',
				billingCycleEnd: 'sample_string',
				threadId: 'sample_string',
				evalCaseRunId: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	cellsList: {
		values: [
			{
				id: 'sample_string',
				staticId: 'sample_string',
				cellType: 'CODE',
				label: 'sample_string',
				dataConnectionId: 'sample_string',
				contents: {
					codeCell: {
						source: 'sample_string',
					},
					sqlCell: {
						source: 'sample_string',
						outputDataframe: 'sample_string',
					},
					markdownCell: {
						source: 'sample_string',
					},
				},
				projectId: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	cellsCreate: {
		id: 'sample_string',
		staticId: 'sample_string',
		cellType: 'CODE',
		label: 'sample_string',
		dataConnectionId: 'sample_string',
		contents: {
			codeCell: {
				source: 'sample_string',
			},
			sqlCell: {
				source: 'sample_string',
				outputDataframe: 'sample_string',
			},
			markdownCell: {
				source: 'sample_string',
			},
		},
		projectId: 'sample_string',
	},
	cellsDelete: {
		cellId: 'sample_string',
	},
	cellsGet: {
		id: 'sample_string',
		staticId: 'sample_string',
		cellType: 'CODE',
		label: 'sample_string',
		dataConnectionId: 'sample_string',
		contents: {
			codeCell: {
				source: 'sample_string',
			},
			sqlCell: {
				source: 'sample_string',
				outputDataframe: 'sample_string',
			},
			markdownCell: {
				source: 'sample_string',
			},
		},
		projectId: 'sample_string',
	},
	cellsUpdate: {
		id: 'sample_string',
		staticId: 'sample_string',
		cellType: 'CODE',
		label: 'sample_string',
		dataConnectionId: 'sample_string',
		contents: {
			codeCell: {
				source: 'sample_string',
			},
			sqlCell: {
				source: 'sample_string',
				outputDataframe: 'sample_string',
			},
			markdownCell: {
				source: 'sample_string',
			},
		},
		projectId: 'sample_string',
	},
	cellsGetChartImage: {
		cellId: 'sample_string',
		imageBase64: 'sample_string',
		mimeType: 'sample_string',
	},
	cellsGetOutput: {
		projectId: 'sample_string',
		runId: 'sample_string',
		cell: {
			id: 'sample_string',
			staticId: 'sample_string',
			cellType: 'CODE',
		},
		result: {
			type: 'table',
			rowLimit: 1,
			rowsReturned: 1,
			totalRows: 1,
			totalRowsKind: 'EXACT',
			truncated: true,
			columns: [
				{
					name: 'sample_string',
					type: 'sample_string',
				},
			],
			rows: [{}],
		},
	},
	collectionsList: {
		values: [
			{
				id: '11111111-1111-4111-8111-111111111111',
				name: 'sample_string',
				description: 'sample_string',
				creator: {
					email: 'sample_string',
					id: '11111111-1111-4111-8111-111111111111',
				},
				sharing: {
					users: [],
					groups: [],
					workspace: {},
				},
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	collectionsCreate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		description: 'sample_string',
		creator: {
			email: 'sample_string',
			id: '11111111-1111-4111-8111-111111111111',
		},
		sharing: {
			users: [],
			groups: [],
			workspace: {
				members: 'sample_string',
			},
		},
	},
	collectionsGet: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		description: 'sample_string',
		creator: {
			email: 'sample_string',
			id: '11111111-1111-4111-8111-111111111111',
		},
		sharing: {
			users: [],
			groups: [],
			workspace: {
				members: 'sample_string',
			},
		},
	},
	collectionsUpdate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		description: 'sample_string',
		creator: {
			email: 'sample_string',
			id: '11111111-1111-4111-8111-111111111111',
		},
		sharing: {
			users: [],
			groups: [],
			workspace: {
				members: 'sample_string',
			},
		},
	},
	adminListTopics: {
		topics: [
			{
				id: 'sample_string',
				name: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	adminListCreditGrants: {
		creditGrants: [
			{
				id: 'sample_string',
				transactionDate: 'sample_string',
				transactionAmountCents: 1,
				unitPriceCents: 1,
				quantity: 1,
				grantType: 'sample_string',
				expirationDate: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	dataConnectionsList: {
		values: [
			{
				id: 'sample_string',
				name: 'sample_string',
				type: 'alloydb',
				description: 'sample_string',
				sensitivity: {
					configured: true,
					effective: true,
					overrideReason: 'USER_SCOPED_OAUTH_RESULTS',
				},
				connectionDetails: {
					athena: {
						hostname: 'sample_string',
						port: 1,
						s3OutputPath: 'sample_string',
						catalog: 'sample_string',
						workgroup: 'sample_string',
						accessKeyId: 'sample_string',
					},
				},
				connectViaSsh: true,
				includeMagic: true,
				allowWritebackCells: true,
				schemaFilters: {
					databases: {
						include: {
							matchType: 'EXACT',
							values: [null],
						},
						exclude: {
							matchType: 'EXACT',
							values: [null],
						},
					},
					schemas: {
						include: {
							matchType: 'EXACT',
							values: [null],
						},
						exclude: {
							matchType: 'EXACT',
							values: [null],
						},
					},
					tables: {
						include: {
							matchType: 'EXACT',
							values: [null],
						},
						exclude: {
							matchType: 'EXACT',
							values: [null],
						},
					},
				},
				schemaRefreshSchedule: {
					cadence: 'HOURLY',
					enabled: true,
					daily: {
						hour: 1,
						minute: 1,
						timezoneString: 'sample_string',
					},
					weekly: {
						dayOfWeek: 'SUNDAY',
						hour: 1,
						minute: 1,
						timezoneString: 'sample_string',
					},
					monthly: {
						day: 1,
						hour: 1,
						minute: 1,
						timezoneString: 'sample_string',
					},
					custom: {
						cron: 'sample_string',
						timezoneString: 'sample_string',
					},
				},
				schemaRefreshAccess: 'ADMINS',
				sharing: {
					groups: [],
					workspace: {
						members: 'NONE',
						guests: 'NONE',
						public: 'NONE',
					},
				},
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	dataConnectionsCreate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		type: 'alloydb',
		description: 'sample_string',
		sensitivity: {
			configured: true,
			effective: true,
			overrideReason: 'USER_SCOPED_OAUTH_RESULTS',
		},
		connectionDetails: {
			athena: {
				accessKeyId: 'sample_string',
				workgroup: 'sample_string',
				catalog: 'sample_string',
				s3OutputPath: 'sample_string',
				port: 1,
				hostname: 'sample_string',
			},
		},
		connectViaSsh: true,
		includeMagic: true,
		allowWritebackCells: true,
		schemaFilters: {
			tables: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
			schemas: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
			databases: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
		},
		schemaRefreshSchedule: {
			cadence: 'HOURLY',
			enabled: true,
			daily: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
			},
			weekly: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
				dayOfWeek: 'SUNDAY',
			},
			monthly: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
				day: 1,
			},
			custom: {
				timezoneString: 'sample_string',
				cron: 'sample_string',
			},
		},
		schemaRefreshAccess: 'ADMINS',
		sharing: {
			workspace: {
				public: 'NONE',
				guests: 'NONE',
				members: 'NONE',
			},
			groups: [],
		},
	},
	dataConnectionsGet: {
		id: 'sample_string',
		name: 'sample_string',
		type: 'alloydb',
		description: 'sample_string',
		sensitivity: {
			configured: true,
			effective: true,
			overrideReason: 'USER_SCOPED_OAUTH_RESULTS',
		},
		connectionDetails: {
			athena: {
				hostname: 'sample_string',
				port: 1,
				s3OutputPath: 'sample_string',
				catalog: 'sample_string',
				workgroup: 'sample_string',
				accessKeyId: 'sample_string',
			},
		},
		connectViaSsh: true,
		includeMagic: true,
		allowWritebackCells: true,
		schemaFilters: {
			databases: {
				include: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
				exclude: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
			},
			schemas: {
				include: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
				exclude: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
			},
			tables: {
				include: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
				exclude: {
					matchType: 'EXACT',
					values: ['sample_string'],
				},
			},
		},
		schemaRefreshSchedule: {
			cadence: 'HOURLY',
			enabled: true,
			daily: {
				hour: 1,
				minute: 1,
				timezoneString: 'sample_string',
			},
			weekly: {
				dayOfWeek: 'SUNDAY',
				hour: 1,
				minute: 1,
				timezoneString: 'sample_string',
			},
			monthly: {
				day: 1,
				hour: 1,
				minute: 1,
				timezoneString: 'sample_string',
			},
			custom: {
				cron: 'sample_string',
				timezoneString: 'sample_string',
			},
		},
		schemaRefreshAccess: 'ADMINS',
		sharing: {
			groups: [],
			workspace: {
				members: 'NONE',
				guests: 'NONE',
				public: 'NONE',
			},
		},
	},
	dataConnectionsUpdate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		type: 'alloydb',
		description: 'sample_string',
		sensitivity: {
			configured: true,
			effective: true,
			overrideReason: 'USER_SCOPED_OAUTH_RESULTS',
		},
		connectionDetails: {
			athena: {
				accessKeyId: 'sample_string',
				workgroup: 'sample_string',
				catalog: 'sample_string',
				s3OutputPath: 'sample_string',
				port: 1,
				hostname: 'sample_string',
			},
		},
		connectViaSsh: true,
		includeMagic: true,
		allowWritebackCells: true,
		schemaFilters: {
			tables: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
			schemas: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
			databases: {
				exclude: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
				include: {
					values: ['sample_string'],
					matchType: 'EXACT',
				},
			},
		},
		schemaRefreshSchedule: {
			cadence: 'HOURLY',
			enabled: true,
			daily: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
			},
			weekly: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
				dayOfWeek: 'SUNDAY',
			},
			monthly: {
				timezoneString: 'sample_string',
				minute: 0,
				hour: 0,
				day: 1,
			},
			custom: {
				timezoneString: 'sample_string',
				cron: 'sample_string',
			},
		},
		schemaRefreshAccess: 'ADMINS',
		sharing: {
			workspace: {
				public: 'NONE',
				guests: 'NONE',
				members: 'NONE',
			},
			groups: [],
		},
	},
	dataConnectionsUpdateSchema: {
		updated: {
			tables: [
				{
					status: 'sample_string',
					name: 'sample_string',
				},
			],
			schemas: [
				{
					status: 'sample_string',
					name: 'sample_string',
				},
			],
			databases: [
				{
					status: 'sample_string',
					name: 'sample_string',
				},
			],
		},
	},
	embeddingCreatePresignedUrl: {
		url: 'sample_string',
	},
	groupsList: {
		values: [
			{
				id: '11111111-1111-4111-8111-111111111111',
				name: 'sample_string',
				createdAt: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	groupsCreate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		members: {
			users: [],
		},
	},
	groupsDelete: undefined,
	groupsGet: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		createdAt: 'sample_string',
	},
	groupsUpdate: {
		id: '11111111-1111-4111-8111-111111111111',
		name: 'sample_string',
		createdAt: 'sample_string',
	},
	guidesUpsertDraft: {
		files: [
			{
				id: '11111111-1111-4111-8111-111111111111',
				filePath: 'sample_string',
			},
		],
		warnings: [
			{
				message: 'sample_string',
				filePath: 'sample_string',
			},
		],
		traceId: 'sample_string',
	},
	guidesDeleteDraft: undefined,
	guidesListDrafts: {
		values: [
			{
				id: 'sample_string',
				filePath: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	guidesPublish: {
		message: 'sample_string',
		publishedGuides: [
			{
				id: '11111111-1111-4111-8111-111111111111',
				filePath: 'sample_string',
			},
		],
		traceId: 'sample_string',
	},
	projectsList: {
		values: [
			{
				id: '11111111-1111-4111-8111-111111111111',
				title: 'sample_string',
				description: 'sample_string',
				type: 'PROJECT',
				computeProfile: {
					PUBLISHED: {
						kernelImage: 'sample_string',
						kernelSize: 'sample_string',
					},
					LOGIC: {
						kernelImage: 'sample_string',
						kernelSize: 'sample_string',
					},
				},
				creator: {
					email: 'sample_string',
				},
				owner: {
					email: 'sample_string',
				},
				status: {
					name: 'sample_string',
				},
				categories: [],
				reviews: {
					required: true,
				},
				analytics: {
					publishedResultsUpdatedAt: null,
					lastViewedAt: null,
					appViews: {
						lastThirtyDays: 1,
						lastFourteenDays: 1,
						lastSevenDays: 1,
						allTime: 1,
					},
				},
				lastEditedAt: 'sample_string',
				lastPublishedAt: null,
				createdAt: 'sample_string',
				archivedAt: null,
				trashedAt: null,
				schedules: [],
				sharing: {
					users: [],
					collections: [],
					groups: [],
					workspace: {
						access: 'CAN_VIEW',
					},
					publicWeb: {
						access: 'CAN_VIEW',
					},
					support: {
						access: 'CAN_VIEW',
					},
				},
				folderEntryId: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	projectsCreate: {
		id: 'sample_string',
		title: 'sample_string',
		description: 'sample_string',
		type: 'PROJECT',
		computeProfile: {
			LOGIC: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
			PUBLISHED: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
		},
		creator: {
			email: 'sample_string',
		},
		owner: {
			email: 'sample_string',
		},
		status: {
			name: 'sample_string',
		},
		categories: [],
		reviews: {
			required: true,
		},
		analytics: {
			appViews: {
				allTime: 1,
				lastSevenDays: 1,
				lastFourteenDays: 1,
				lastThirtyDays: 1,
			},
			lastViewedAt: null,
			publishedResultsUpdatedAt: null,
		},
		lastEditedAt: 'sample_string',
		lastPublishedAt: null,
		createdAt: 'sample_string',
		archivedAt: null,
		trashedAt: null,
		schedules: [],
		sharing: {
			users: [],
			collections: [],
			groups: [],
			workspace: {
				access: 'CAN_VIEW',
			},
			publicWeb: {
				access: 'CAN_VIEW',
			},
			support: {
				access: 'CAN_VIEW',
			},
		},
		folderEntryId: 'sample_string',
	},
	projectsGet: {
		id: 'sample_string',
		title: 'sample_string',
		description: 'sample_string',
		type: 'PROJECT',
		computeProfile: {
			LOGIC: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
			PUBLISHED: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
		},
		creator: {
			email: 'sample_string',
		},
		owner: {
			email: 'sample_string',
		},
		status: {
			name: 'sample_string',
		},
		categories: [],
		reviews: {
			required: true,
		},
		analytics: {
			appViews: {
				allTime: 1,
				lastSevenDays: 1,
				lastFourteenDays: 1,
				lastThirtyDays: 1,
			},
			lastViewedAt: null,
			publishedResultsUpdatedAt: null,
		},
		lastEditedAt: 'sample_string',
		lastPublishedAt: null,
		createdAt: 'sample_string',
		archivedAt: null,
		trashedAt: null,
		schedules: [],
		sharing: {
			users: [],
			collections: [],
			groups: [],
			workspace: {
				access: 'CAN_VIEW',
			},
			publicWeb: {
				access: 'CAN_VIEW',
			},
			support: {
				access: 'CAN_VIEW',
			},
		},
		folderEntryId: 'sample_string',
	},
	projectsUpdate: {
		id: 'sample_string',
		title: 'sample_string',
		description: 'sample_string',
		type: 'PROJECT',
		computeProfile: {
			LOGIC: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
			PUBLISHED: {
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
		},
		creator: {
			email: 'sample_string',
		},
		owner: {
			email: 'sample_string',
		},
		status: {
			name: 'sample_string',
		},
		categories: [],
		reviews: {
			required: true,
		},
		analytics: {
			appViews: {
				allTime: 1,
				lastSevenDays: 1,
				lastFourteenDays: 1,
				lastThirtyDays: 1,
			},
			lastViewedAt: null,
			publishedResultsUpdatedAt: null,
		},
		lastEditedAt: 'sample_string',
		lastPublishedAt: null,
		createdAt: 'sample_string',
		archivedAt: null,
		trashedAt: null,
		schedules: [],
		sharing: {
			users: [],
			collections: [],
			groups: [],
			workspace: {
				access: 'CAN_VIEW',
			},
			publicWeb: {
				access: 'CAN_VIEW',
			},
			support: {
				access: 'CAN_VIEW',
			},
		},
		folderEntryId: 'sample_string',
	},
	projectsGetQueriedTables: {
		values: [
			{
				dataConnectionId: '11111111-1111-4111-8111-111111111111',
				dataConnectionName: 'sample_string',
				tableName: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
		traceId: 'sample_string',
	},
	projectRunsList: {
		runs: [
			{
				projectId: 'sample_string',
				projectVersion: 'sample_string',
				runId: 'sample_string',
				runUrl: 'sample_string',
				status: 'PENDING',
				runTrigger: 'API',
				startTime: 'sample_string',
				endTime: 'sample_string',
				elapsedTime: 1,
				flagConfigOverride: 'sample_string',
				traceId: 'sample_string',
				notifications: [],
				stateEvents: [
					{
						type: 'sample_string',
						value: 'sample_string',
						timestamp: 'sample_string',
					},
				],
			},
		],
		nextPage: 'sample_string',
		previousPage: 'sample_string',
		traceId: 'sample_string',
	},
	projectRunsRun: {
		projectId: 'sample_string',
		runId: 'sample_string',
		runUrl: 'sample_string',
		runStatusUrl: 'sample_string',
		traceId: 'sample_string',
		projectVersion: 1,
		notifications: [],
	},
	projectRunsCancel: undefined,
	projectRunsGetStatus: {
		projectId: 'sample_string',
		projectVersion: 'sample_string',
		runId: 'sample_string',
		runUrl: 'sample_string',
		status: 'PENDING',
		runTrigger: 'API',
		startTime: 'sample_string',
		endTime: 'sample_string',
		elapsedTime: 1,
		flagConfigOverride: 'sample_string',
		traceId: 'sample_string',
		notifications: [],
		stateEvents: [
			{
				type: 'sample_string',
				value: 'sample_string',
				timestamp: 'sample_string',
			},
		],
	},
	projectRunsGetChartImage: {
		projectId: 'sample_string',
		runId: 'sample_string',
		staticId: 'sample_string',
		imageBase64: 'sample_string',
		mimeType: 'sample_string',
	},
	projectsEditSharingCollections: {
		project: {
			id: '11111111-1111-4111-8111-111111111111',
			title: 'sample_string',
			description: 'sample_string',
			type: 'PROJECT',
			computeProfile: {
				PUBLISHED: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
				LOGIC: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
			},
			creator: {
				email: 'sample_string',
			},
			owner: {
				email: 'sample_string',
			},
			status: {
				name: 'sample_string',
			},
			categories: [],
			reviews: {
				required: true,
			},
			analytics: {
				publishedResultsUpdatedAt: null,
				lastViewedAt: null,
				appViews: {
					lastThirtyDays: 1,
					lastFourteenDays: 1,
					lastSevenDays: 1,
					allTime: 1,
				},
			},
			lastEditedAt: 'sample_string',
			lastPublishedAt: null,
			createdAt: 'sample_string',
			archivedAt: null,
			trashedAt: null,
			schedules: [],
			sharing: {
				users: [],
				collections: [],
				groups: [],
				workspace: {
					access: 'CAN_VIEW',
				},
				publicWeb: {
					access: 'CAN_VIEW',
				},
				support: {
					access: 'CAN_VIEW',
				},
			},
			folderEntryId: 'sample_string',
		},
		errors: [
			{
				collectionIds: ['11111111-1111-4111-8111-111111111111'],
				reason: 'sample_string',
			},
		],
	},
	projectsEditSharingGroups: {
		project: {
			id: 'sample_string',
			title: 'sample_string',
			description: 'sample_string',
			type: 'PROJECT',
			computeProfile: {
				LOGIC: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
				PUBLISHED: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
			},
			creator: {
				email: 'sample_string',
			},
			owner: {
				email: 'sample_string',
			},
			status: {
				name: 'sample_string',
			},
			categories: [],
			reviews: {
				required: true,
			},
			analytics: {
				appViews: {
					allTime: 1,
					lastSevenDays: 1,
					lastFourteenDays: 1,
					lastThirtyDays: 1,
				},
				lastViewedAt: null,
				publishedResultsUpdatedAt: null,
			},
			lastEditedAt: 'sample_string',
			lastPublishedAt: null,
			createdAt: 'sample_string',
			archivedAt: null,
			trashedAt: null,
			schedules: [],
			sharing: {
				users: [],
				collections: [],
				groups: [],
				workspace: {
					access: 'CAN_VIEW',
				},
				publicWeb: {
					access: 'CAN_VIEW',
				},
				support: {
					access: 'CAN_VIEW',
				},
			},
			folderEntryId: 'sample_string',
		},
		errors: [
			{
				groupIds: ['sample_string'],
				reason: 'sample_string',
			},
		],
	},
	projectsEditSharingUsers: {
		project: {
			id: 'sample_string',
			title: 'sample_string',
			description: 'sample_string',
			type: 'PROJECT',
			computeProfile: {
				LOGIC: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
				PUBLISHED: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
			},
			creator: {
				email: 'sample_string',
			},
			owner: {
				email: 'sample_string',
			},
			status: {
				name: 'sample_string',
			},
			categories: [],
			reviews: {
				required: true,
			},
			analytics: {
				appViews: {
					allTime: 1,
					lastSevenDays: 1,
					lastFourteenDays: 1,
					lastThirtyDays: 1,
				},
				lastViewedAt: null,
				publishedResultsUpdatedAt: null,
			},
			lastEditedAt: 'sample_string',
			lastPublishedAt: null,
			createdAt: 'sample_string',
			archivedAt: null,
			trashedAt: null,
			schedules: [],
			sharing: {
				users: [],
				collections: [],
				groups: [],
				workspace: {
					access: 'CAN_VIEW',
				},
				publicWeb: {
					access: 'CAN_VIEW',
				},
				support: {
					access: 'CAN_VIEW',
				},
			},
			folderEntryId: 'sample_string',
		},
		errors: [
			{
				userIds: ['sample_string'],
				reason: 'sample_string',
			},
		],
	},
	projectsEditSharingOrgAndPublic: {
		project: {
			id: 'sample_string',
			title: 'sample_string',
			description: 'sample_string',
			type: 'PROJECT',
			computeProfile: {
				LOGIC: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
				PUBLISHED: {
					kernelImage: 'sample_string',
					kernelSize: 'sample_string',
				},
			},
			creator: {
				email: 'sample_string',
			},
			owner: {
				email: 'sample_string',
			},
			status: {
				name: 'sample_string',
			},
			categories: [],
			reviews: {
				required: true,
			},
			analytics: {
				appViews: {
					allTime: 1,
					lastSevenDays: 1,
					lastFourteenDays: 1,
					lastThirtyDays: 1,
				},
				lastViewedAt: null,
				publishedResultsUpdatedAt: null,
			},
			lastEditedAt: 'sample_string',
			lastPublishedAt: null,
			createdAt: 'sample_string',
			archivedAt: null,
			trashedAt: null,
			schedules: [],
			sharing: {
				users: [],
				collections: [],
				groups: [],
				workspace: {
					access: 'CAN_VIEW',
				},
				publicWeb: {
					access: 'CAN_VIEW',
				},
				support: {
					access: 'CAN_VIEW',
				},
			},
			folderEntryId: 'sample_string',
		},
		errors: [
			{
				type: 'workspace',
				reason: 'sample_string',
			},
		],
	},
	projectsBatchUpdateComputeProfile: {
		projects: [
			{
				projectId: 'sample_string',
				kernelImage: 'sample_string',
				kernelSize: 'sample_string',
			},
		],
	},
	projectsExport: {
		filename: 'sample_string',
		content: 'sample_string',
	},
	semanticUpdate: {
		updated: {
			views: [
				{
					status: 'sample_string',
					name: 'sample_string',
				},
			],
			datasets: [
				{
					status: 'sample_string',
					name: 'sample_string',
				},
			],
		},
	},
	suggestionsList: {
		values: [
			{
				id: 'sample_string',
				title: 'sample_string',
				summary: 'sample_string',
				status: 'OPEN',
				createdDate: 'sample_string',
				lastSourceAddedDate: 'sample_string',
				reviewAgentStatus: 'COMPLETED',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	suggestionsGet: {
		id: 'sample_string',
		title: 'sample_string',
		summary: 'sample_string',
		status: 'OPEN',
		createdDate: 'sample_string',
		lastSourceAddedDate: 'sample_string',
		reviewAgentStatus: 'COMPLETED',
		sources: [
			{
				warning: {
					warningType: 'sample_string',
					summary: 'sample_string',
				},
				agentChatThread: {
					id: 'sample_string',
					title: 'sample_string',
					user: {
						id: 'sample_string',
						name: 'sample_string',
					},
					intent: 'sample_string',
				},
			},
		],
		proposedChanges: [
			{
				id: 'sample_string',
				status: 'NEEDS_REVIEW',
				updateType: 'FILE_UPDATE',
				payload: {
					updateType: 'CREATE_ORG_GUIDE_FILE',
					filePath: 'sample_string',
					diff: 'sample_string',
					dataConnectionName: 'sample_string',
					databaseName: 'sample_string',
					schemaName: 'sample_string',
					tableName: 'sample_string',
					columnName: 'sample_string',
					descriptionUpdate: {
						currentDescriptions: {
							hexDescription: 'sample_string',
							warehouseComment: 'sample_string',
							dbtDescription: 'sample_string',
						},
						newDescription: 'sample_string',
					},
					statusUpdate: {
						currentStatusName: 'sample_string',
						newStatusName: 'sample_string',
					},
				},
			},
		],
	},
	suggestionsUpdate: {
		suggestion: {
			id: 'sample_string',
			title: 'sample_string',
			summary: 'sample_string',
			status: 'OPEN',
			createdDate: 'sample_string',
			lastSourceAddedDate: 'sample_string',
			reviewAgentStatus: 'COMPLETED',
		},
	},
	suggestionsUpdateChange: {
		suggestionUpdate: {
			id: 'sample_string',
			status: 'NEEDS_REVIEW',
			rejectionReason: 'sample_string',
		},
	},
	suggestionsTriggerReview: {
		suggestion: {
			id: 'sample_string',
			title: 'sample_string',
			summary: 'sample_string',
			status: 'OPEN',
			createdDate: 'sample_string',
			lastSourceAddedDate: 'sample_string',
			reviewAgentStatus: 'COMPLETED',
		},
	},
	threadsList: {
		threads: [
			{
				title: 'sample_string',
				creditsUsed: 1,
				topics: [
					{
						id: 'sample_string',
						name: 'sample_string',
					},
				],
				warnings: [
					{
						id: 'sample_string',
						type: 'sample_string',
						summary: 'sample_string',
					},
				],
				feedback: [
					{
						id: 'sample_string',
						userFeedback: 'sample_string',
						type: 'THUMBS',
						selectedReason: 'sample_string',
						userLiked: true,
					},
				],
				warningsGeneratedAt: 'sample_string',
				threadSummary: 'sample_string',
				threadIntent: 'sample_string',
				model: 'sample_string',
				auto: true,
				effectiveModel: 'sample_string',
				effortLevel: 'sample_string',
				governedMode: true,
				userId: 'sample_string',
				type: 'sample_string',
				classification: 'sample_string',
				source: 'sample_string',
				createdAt: 'sample_string',
				updatedAt: 'sample_string',
				sensitive: true,
				id: 'sample_string',
				orgId: 'sample_string',
				url: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	threadsCreate: {
		threadId: 'sample_string',
		url: 'sample_string',
		createdAt: 'sample_string',
		projectId: 'sample_string',
	},
	threadsGet: {
		title: 'sample_string',
		creditsUsed: 1,
		topics: [
			{
				id: 'sample_string',
				name: 'sample_string',
			},
		],
		warnings: [
			{
				id: 'sample_string',
				type: 'sample_string',
				summary: 'sample_string',
			},
		],
		feedback: [
			{
				id: 'sample_string',
				userFeedback: 'sample_string',
				type: 'THUMBS',
				selectedReason: 'sample_string',
				userLiked: true,
			},
		],
		warningsGeneratedAt: 'sample_string',
		threadSummary: 'sample_string',
		threadIntent: 'sample_string',
		model: 'sample_string',
		auto: true,
		effectiveModel: 'sample_string',
		effortLevel: 'sample_string',
		governedMode: true,
		userId: 'sample_string',
		type: 'sample_string',
		classification: 'sample_string',
		source: 'sample_string',
		createdAt: 'sample_string',
		updatedAt: 'sample_string',
		sensitive: true,
		threadId: 'sample_string',
		status: 'IDLE',
		url: 'sample_string',
		error: {
			type: 'NO_CONTEXT',
			message: 'sample_string',
		},
		resources: [
			{
				id: 'sample_string',
				resourceType: 'sample_string',
				name: 'sample_string',
			},
		],
		response: [
			{
				type: 'text',
				text: 'sample_string',
			},
		],
	},
	threadsContinue: {
		threadId: 'sample_string',
		url: 'sample_string',
	},
	threadsGetMessages: {
		content: [
			{
				type: 'text',
				text: 'sample_string',
				createdAt: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	usersList: {
		values: [
			{
				id: 'sample_string',
				name: 'sample_string',
				email: 'sample_string',
				role: 'ADMIN',
				lastLoginDate: 'sample_string',
			},
		],
		pagination: {
			after: null,
			before: null,
		},
	},
	usersDeactivate: {
		user: {
			id: 'sample_string',
			name: 'sample_string',
			email: 'sample_string',
			role: 'ADMIN',
			lastLoginDate: 'sample_string',
		},
	},
	usersMe: {
		id: 'sample_string',
		name: 'sample_string',
		email: 'sample_string',
		role: 'ADMIN',
		lastLoginDate: 'sample_string',
		org: {
			id: 'sample_string',
		},
		token: {
			exp: 1,
		},
	},
	suggestionsGetV2: {
		id: 'sample_string',
		title: 'sample_string',
		summary: 'sample_string',
		status: 'OPEN',
		createdDate: 'sample_string',
		lastSourceAddedDate: 'sample_string',
		reviewAgentStatus: 'COMPLETED',
		latestReview: {
			id: 'sample_string',
			status: 'RUNNING',
			startedAt: 'sample_string',
		},
		sources: [
			{
				id: 'sample_string',
				sourceType: 'THREAD_WARNING',
				threadId: 'sample_string',
				agentChatThread: {
					id: 'sample_string',
					title: 'sample_string',
					user: {
						id: 'sample_string',
						name: 'sample_string',
					},
					intent: 'sample_string',
				},
				threadTitle: 'sample_string',
				threadUrl: 'sample_string',
				createdAt: 'sample_string',
				agentChatMessageId: 'sample_string',
				warning: {
					id: 'sample_string',
					type: 'agent_caveat',
					summary: 'sample_string',
					reasoning: 'sample_string',
					suggestedContext: 'sample_string',
				},
				userReport: {
					selectedReason: 'sample_string',
					userComment: 'sample_string',
				},
				verifiedUserContext: ['sample_string'],
			},
		],
		unavailableSourceCount: 0,
		nextCursor: 'sample_string',
		proposedChanges: [
			{
				updateType: 'FILE_UPDATE',
			},
		],
		reviewCoverage: 'sample_string',
	},
} satisfies HexEndpointOutputs;
