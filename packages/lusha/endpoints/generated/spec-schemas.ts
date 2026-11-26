// Generated from https://docs.lusha.com/openapi.json by the batch-O generator
// (corsair-brain kits/plugin-batch-g). Inputs keep the documented types, enums
// and limits and allow extra keys; outputs are lenient (every field nullish,
// objects loose, ids string or number) so a field Lusha adds, drops or retypes
// cannot fail a call that already spent credits.
import { z } from 'zod';

const V3CanRevealItemOut = z
	.object({
		field: z.string().nullish(),
		credits: z.number().nullish(),
		source: z.string().nullish(),
		availability: z.string().nullish(),
		vendors: z.array(z.string()).nullish(),
	})
	.loose();
const V3ItemErrorOut = z
	.object({
		code: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();
const V3ContactPreviewOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		jobTitle: z
			.object({
				title: z.string().nullish(),
				departments: z.array(z.string()).nullish(),
				seniority: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
				domain: z.string().nullish(),
				industry: z.string().nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				state: z.string().nullish(),
				city: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CanRevealItemOut).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3ProspectingContactsPaginationOut = z
	.object({
		page: z.number().nullish(),
		size: z.number().nullish(),
		total: z.number().nullish(),
		totalGuaranteed: z.boolean().nullish(),
		totalDescription: z.string().nullish(),
	})
	.loose();
const TableWriteOut = z
	.object({
		tableId: z.union([z.string(), z.number()]).nullish(),
		added: z.number().nullish(),
		alreadyPresent: z.number().nullish(),
		columnsCreated: z.number().nullish(),
		rowsProcessed: z.number().nullish(),
		rowsCharged: z.number().nullish(),
		rowsAlreadyPaidInTable: z.number().nullish(),
		creditsCharged: z.number().nullish(),
	})
	.loose();
const V3BillingOut = z
	.object({
		creditsCharged: z.number().nullish(),
		resultsReturned: z.number().nullish(),
		lowBalance: z.boolean().nullish(),
	})
	.loose();
const V3ProspectingContactsResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3ContactPreviewOut).nullish(),
		pagination: V3ProspectingContactsPaginationOut.nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3CompanyCanRevealItemOut = z
	.object({
		field: z.string().nullish(),
		credits: z.number().nullish(),
	})
	.loose();
const V3CompanyPreviewOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		employeeCount: z
			.object({
				exact: z.number().nullish(),
				min: z.number().nullish(),
				max: z.number().nullish(),
			})
			.loose()
			.nullish(),
		industry: z.string().nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				stateCode: z.string().nullish(),
				country: z.string().nullish(),
				countryIso2: z.string().nullish(),
				continent: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CompanyCanRevealItemOut).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3PaginationResponseOut = z
	.object({
		page: z.number().nullish(),
		size: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();
const V3ProspectingCompaniesResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3CompanyPreviewOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3LookAlikeContactResultOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
				domain: z.string().nullish(),
			})
			.loose()
			.nullish(),
		jobTitle: z
			.object({
				title: z.string().nullish(),
				departments: z.array(z.string()).nullish(),
				seniority: z.string().nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				state: z.string().nullish(),
				city: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
const ContactLookalikesMetaOut = z
	.object({
		returned: z.number().nullish(),
		hasMore: z.boolean().nullish(),
	})
	.loose();
const ContactLookalikesResponseOut = z
	.object({
		dedupeSessionId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3LookAlikeContactResultOut).nullish(),
		meta: ContactLookalikesMetaOut.nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3LookAlikeCompanyResultOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		employeeCount: z
			.object({
				exact: z.number().nullish(),
			})
			.loose()
			.nullish(),
		industry: z.string().nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				state: z.string().nullish(),
				city: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
const CompanyLookalikesMetaOut = z
	.object({
		returned: z.number().nullish(),
		hasMore: z.boolean().nullish(),
	})
	.loose();
const CompanyLookalikesResponseOut = z
	.object({
		dedupeSessionId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3LookAlikeCompanyResultOut).nullish(),
		meta: CompanyLookalikesMetaOut.nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3RecommendationTargetIcpOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
	})
	.loose();
const V3RecommendationOut = z
	.object({
		leadScore: z.number().nullish(),
		icpFitScore: z.number().nullish(),
		signalScore: z.number().nullish(),
		targetIcp: z.array(V3RecommendationTargetIcpOut).nullish(),
	})
	.loose();
const V3RecommendedContactOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		jobTitle: z
			.object({
				title: z.string().nullish(),
				departments: z.array(z.string()).nullish(),
				seniority: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
				domain: z.string().nullish(),
				industry: z.string().nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				state: z.string().nullish(),
				city: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CanRevealItemOut).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: V3ItemErrorOut.nullish(),
		recommendation: V3RecommendationOut.nullish(),
	})
	.loose();
const V3RecommendationsContactsResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		userRecommendationsId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3RecommendedContactOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		billing: V3BillingOut.nullish(),
		recommendationListIds: z.array(z.string()).nullish(),
	})
	.loose();
const V3CompanyRecommendationOut = z
	.object({
		leadScore: z.number().nullish(),
		icpFitScore: z.number().nullish(),
		signalScore: z.number().nullish(),
		targetIcp: z.array(V3RecommendationTargetIcpOut).nullish(),
		intentTopics: z.array(z.string()).nullish(),
	})
	.loose();
const V3RecommendedCompanyOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		employeeCount: z
			.object({
				exact: z.number().nullish(),
				min: z.number().nullish(),
				max: z.number().nullish(),
			})
			.loose()
			.nullish(),
		industry: z.string().nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				stateCode: z.string().nullish(),
				country: z.string().nullish(),
				countryIso2: z.string().nullish(),
				continent: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CompanyCanRevealItemOut).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: V3ItemErrorOut.nullish(),
		recommendation: V3CompanyRecommendationOut.nullish(),
	})
	.loose();
const V3RecommendationsCompaniesResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		userRecommendationsId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3RecommendedCompanyOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		billing: V3BillingOut.nullish(),
		recommendationListIds: z.array(z.string()).nullish(),
	})
	.loose();
const V3RecommendationsFiltersResponseOut = z
	.object({
		availableSignals: z.array(z.string()).nullish(),
		availableTargetIcps: z.array(V3RecommendationTargetIcpOut).nullish(),
	})
	.loose();
const V3BuyingGroupContactOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		jobTitle: z
			.object({
				title: z.string().nullish(),
				departments: z.array(z.string()).nullish(),
				seniority: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
				domain: z.string().nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				state: z.string().nullish(),
				city: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CanRevealItemOut).nullish(),
		roles: z.array(z.string()).nullish(),
		score: z.number().nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3BuyingGroupCompanyResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		companyId: z.union([z.string(), z.number()]).nullish(),
		contacts: z.array(V3BuyingGroupContactOut).nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3BuyingGroupResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3BuyingGroupCompanyResultOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const OwnerInfoOut = z
	.object({
		id: z.number().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();
const CreatedByOut = z
	.object({
		surface: z.string().nullish(),
		createdByUserId: z.number().nullish(),
	})
	.loose();
const ColumnSummaryOut = z
	.object({
		columnId: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		key: z.string().nullish(),
		isDefault: z.boolean().nullish(),
		addedAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		rowsNotRun: z.number().nullish(),
		rowsProcessing: z.number().nullish(),
		rowsSuccess: z.number().nullish(),
		rowsNoData: z.number().nullish(),
		rowsFailed: z.number().nullish(),
	})
	.loose();
const TableStatusDataOut = z
	.object({
		tableId: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		entityType: z.string().nullish(),
		visibility: z.string().nullish(),
		status: z.string().nullish(),
		owner: OwnerInfoOut.nullish(),
		createdBy: CreatedByOut.nullish(),
		workspaceUrl: z.string().nullish(),
		entityCount: z.number().nullish(),
		isProcessing: z.boolean().nullish(),
		columns: z.array(ColumnSummaryOut).nullish(),
	})
	.loose();
const TableResponseOut = z
	.object({
		data: TableStatusDataOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const TableMetadataOut = z
	.object({
		tableId: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		entityType: z.string().nullish(),
		visibility: z.string().nullish(),
		status: z.string().nullish(),
		owner: OwnerInfoOut.nullish(),
		createdBy: CreatedByOut.nullish(),
		workspaceUrl: z.string().nullish(),
	})
	.loose();
const TableListResponseOut = z
	.object({
		data: z.array(TableMetadataOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const ColumnCatalogItemOut = z
	.object({
		category: z.string().nullish(),
		displayName: z.string().nullish(),
		columnKey: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();
const ColumnCatalogResponseOut = z
	.object({
		data: z.array(ColumnCatalogItemOut).nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const EntityColumnValueOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		sourceType: z.string().nullish(),
		value: z.unknown().nullish(),
		status: z.string().nullish(),
	})
	.loose();
const TableContactDatapointOut = z
	.object({
		datapointId: z.union([z.string(), z.number()]).nullish(),
		value: z.string().nullish(),
		type: z.string().nullish(),
		confidence: z.string().nullish(),
		dataSource: z.string().nullish(),
		isMasked: z.boolean().nullish(),
		isManuallyAdded: z.boolean().nullish(),
		isCorrectFeedback: z.boolean().nullish(),
	})
	.loose();
const TableEntityOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		columns: z.array(EntityColumnValueOut).nullish(),
		createdAt: z.string().nullish(),
		rowCreatedAt: z.string().nullish(),
		type: z.string().nullish(),
		tableContactId: z.union([z.string(), z.number()]).nullish(),
		dateAddedToList: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		job: z
			.object({
				title: z.string().nullish(),
				seniority: z.string().nullish(),
				departments: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				country: z.string().nullish(),
				countryIso2: z.string().nullish(),
				continent: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		datapoints: z
			.object({
				emails: z.array(TableContactDatapointOut).nullish(),
				phones: z.array(TableContactDatapointOut).nullish(),
			})
			.loose()
			.nullish(),
		isFullDNC: z.boolean().nullish(),
		tags: z.array(z.unknown()).nullish(),
	})
	.loose();
const EntitiesGetResponseOut = z
	.object({
		data: z.array(TableEntityOut).nullish(),
		pagination: V3PaginationResponseOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const AddedByOut = z
	.object({
		surface: z.string().nullish(),
	})
	.loose();
const EntitiesAddResponseOut = z
	.object({
		data: z
			.object({
				added: z.number().nullish(),
				alreadyPresent: z.number().nullish(),
				invalidIds: z.array(z.string()).nullish(),
				addedBy: AddedByOut.nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const EntitiesRemoveResponseOut = z
	.object({
		data: z
			.object({
				removed: z.number().nullish(),
				invalidIds: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const ColumnsListResponseOut = z
	.object({
		data: z.array(ColumnSummaryOut).nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const ColumnsAddItemErrorOut = z
	.object({
		code: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();
const ColumnsAddResultItemOut = z
	.object({
		status: z.string().nullish(),
		columnId: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		runStatus: z.string().nullish(),
		error: ColumnsAddItemErrorOut.nullish(),
	})
	.loose();
const ColumnsAddResponseOut = z
	.object({
		data: z
			.object({
				columns: z.array(ColumnsAddResultItemOut).nullish(),
				added: z.number().nullish(),
				failed: z.number().nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const ColumnsRunResponseOut = z
	.object({
		data: z
			.object({
				columnId: z.union([z.string(), z.number()]).nullish(),
				runScope: z.string().nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3ContactSignalsResponseOut = z
	.object({
		results: z
			.array(
				z
					.object({
						id: z.union([z.string(), z.number()]).nullish(),
						companyChange: z.array(z.record(z.string(), z.unknown())).nullish(),
						promotion: z.array(z.record(z.string(), z.unknown())).nullish(),
					})
					.loose(),
			)
			.nullish(),
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
		requestId: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();
const LinkedinActivityIntentTopicOut = z
	.object({
		topic: z.string().nullish(),
		category: z.string().nullish(),
	})
	.loose();
const LinkedinActivityIntentPersonOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		fullName: z.string().nullish(),
		linkedinUrl: z.string().nullish(),
	})
	.loose();
const LinkedinActivityIntentCompanyMentionOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		linkedinUrl: z.string().nullish(),
	})
	.loose();
const LinkedinActivityIntentItemOut = z
	.object({
		companyId: z.union([z.string(), z.number()]).nullish(),
		activityPublicationDate: z.string().nullish(),
		signalCategory: z.string().nullish(),
		intentTopics: z.array(LinkedinActivityIntentTopicOut).nullish(),
		author: LinkedinActivityIntentPersonOut.nullish(),
		contactsMentioned: z.array(LinkedinActivityIntentPersonOut).nullish(),
		companiesMentioned: z
			.array(LinkedinActivityIntentCompanyMentionOut)
			.nullish(),
		activityUrl: z.string().nullish(),
		activitySummary: z.string().nullish(),
		activityLikes: z.number().nullish(),
		activityComments: z.number().nullish(),
		activityShares: z.number().nullish(),
		activityType: z.string().nullish(),
	})
	.loose();
const IntentSignalItemOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		signalDate: z.string().nullish(),
		topic: z.string().nullish(),
		category: z.string().nullish(),
		score: z.number().nullish(),
		previousScore: z.number().nullish(),
		changeRatePercent: z.number().nullish(),
	})
	.loose();
const V3CompanySignalsResponseOut = z
	.object({
		results: z
			.array(
				z
					.object({
						id: z.union([z.string(), z.number()]).nullish(),
						companyName: z.string().nullish(),
						domain: z.string().nullish(),
						linkedinActivityIntent: z
							.array(LinkedinActivityIntentItemOut)
							.nullish(),
						newIntentTopic: z.array(IntentSignalItemOut).nullish(),
						intentScoreIncrease: z.array(IntentSignalItemOut).nullish(),
						intentScoreDecrease: z.array(IntentSignalItemOut).nullish(),
						intentTopicRemoved: z.array(IntentSignalItemOut).nullish(),
						error: V3ItemErrorOut.nullish(),
					})
					.loose(),
			)
			.nullish(),
		startDate: z.string().nullish(),
		endDate: z.string().nullish(),
		tableWrite: TableWriteOut.nullish(),
		billing: V3BillingOut.nullish(),
		requestId: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();
const ContactSignalTypesResponseOut = z
	.object({
		signalTypes: z.array(z.string()).nullish(),
	})
	.loose();
const CompanySignalTypesResponseOut = z
	.object({
		signalTypes: z.array(z.string()).nullish(),
	})
	.loose();
const FilterTypesDiscoveryResponseOut = z
	.object({
		availableFilters: z
			.array(
				z
					.object({
						filterType: z.string().nullish(),
						requiresQuery: z.boolean().nullish(),
						supportsQuery: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		filters: z
			.array(
				z
					.object({
						path: z.string().nullish(),
						type: z.string().nullish(),
						description: z.string().nullish(),
						valueSource: z.string().nullish(),
						values: z.array(z.string()).nullish(),
						lookup: z
							.object({
								filterType: z.string().nullish(),
								url: z.string().nullish(),
								requiresQuery: z.boolean().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		generatedAt: z.string().nullish(),
	})
	.loose();
const FilterValuesResponseOut = z
	.object({
		values: z.unknown().nullish(),
		total: z.number().nullish(),
		truncated: z.boolean().nullish(),
	})
	.loose();
const V3SignalScoreCompanyResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		signalScore: z.number().nullish(),
		signalTypes: z.array(z.string()).nullish(),
		noActiveSignals: z.boolean().nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3SignalScoreCompaniesResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3SignalScoreCompanyResultOut).nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3SignalScoreContactCompanyRefOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
	})
	.loose();
const V3SignalScoreContactResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		fullName: z.string().nullish(),
		company: V3SignalScoreContactCompanyRefOut.nullish(),
		signalScore: z.number().nullish(),
		signalTypes: z.array(z.string()).nullish(),
		noActiveSignals: z.boolean().nullish(),
		error: V3ItemErrorOut.nullish(),
		contactSignalTypes: z.array(z.string()).nullish(),
		companySignalTypes: z.array(z.string()).nullish(),
	})
	.loose();
const V3SignalScoreContactsResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3SignalScoreContactResultOut).nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const V3IcpProfileOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		access: z.string().nullish(),
		canEdit: z.boolean().nullish(),
		isOwner: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();
const V3IcpBillingOut = z
	.object({
		creditsCharged: z.number().nullish(),
		resultsReturned: z.number().nullish(),
		lowBalance: z.boolean().nullish(),
	})
	.loose();
const V3IcpProfilesResponseOut = z
	.object({
		profiles: z.array(V3IcpProfileOut).nullish(),
		billing: V3IcpBillingOut.nullish(),
	})
	.loose();
const V3IcpProfileScoreOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		score: z.number().nullish(),
	})
	.loose();
const V3IcpFitScoreCompanyResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		icpFitScore: z.number().nullish(),
		topProfile: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		profileScores: z.array(V3IcpProfileScoreOut).nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3IcpFitScoreCompaniesResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3IcpFitScoreCompanyResultOut).nullish(),
		billing: V3IcpBillingOut.nullish(),
	})
	.loose();
const V3IcpFitScoreContactResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		fullName: z.string().nullish(),
		company: V3SignalScoreContactCompanyRefOut.nullish(),
		icpFitScore: z.number().nullish(),
		topProfile: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		profileScores: z.array(V3IcpProfileScoreOut).nullish(),
		error: V3ItemErrorOut.nullish(),
	})
	.loose();
const V3IcpFitScoreContactsResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(V3IcpFitScoreContactResultOut).nullish(),
		billing: V3IcpBillingOut.nullish(),
	})
	.loose();
const WebsiteVisitsCompanyResultOut = z
	.object({
		clientReferenceId: z.union([z.string(), z.number()]).nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		employeeCount: z
			.object({
				exact: z.number().nullish(),
				min: z.number().nullish(),
				max: z.number().nullish(),
			})
			.loose()
			.nullish(),
		industry: z.string().nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				stateCode: z.string().nullish(),
				country: z.string().nullish(),
				countryIso2: z.string().nullish(),
				continent: z.string().nullish(),
			})
			.loose()
			.nullish(),
		socialLinks: z
			.object({
				linkedin: z.string().nullish(),
			})
			.loose()
			.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(V3CompanyCanRevealItemOut).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: V3ItemErrorOut.nullish(),
		score: z.number().nullish(),
		scoreBand: z.string().nullish(),
		totalSessions: z.number().nullish(),
		uniqueVisitors: z.number().nullish(),
		avgSessionMinutes: z.number().nullish(),
		daysVisited: z.number().nullish(),
		highIntentPageviews: z.number().nullish(),
		daysSinceLastVisit: z.number().nullish(),
		lastVisit: z.string().nullish(),
		visitorCountry: z.string().nullish(),
		siteId: z.union([z.string(), z.number()]).nullish(),
		trackedDomain: z.string().nullish(),
		visitorCountries: z.array(z.string()).nullish(),
		highIntentPages: z
			.array(
				z
					.object({
						label: z.string().nullish(),
						url: z.string().nullish(),
						views: z.number().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
const WebsiteVisitsPaginationOut = z
	.object({
		size: z.number().nullish(),
		page: z.number().nullish(),
		total: z.number().nullish(),
		hasMore: z.boolean().nullish(),
	})
	.loose();
const WebsiteVisitsResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		results: z.array(WebsiteVisitsCompanyResultOut).nullish(),
		pagination: WebsiteVisitsPaginationOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const SubscriptionWithoutSecretOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		entityType: z.string().nullish(),
		entityId: z.union([z.string(), z.number()]).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		isActive: z.boolean().nullish(),
		blockReason: z.string().nullish(),
		blockedAt: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();
const CreateSubscriptionSuccessResultOut = z
	.object({
		index: z.number().nullish(),
		success: z.boolean().nullish(),
		subscription: SubscriptionWithoutSecretOut.nullish(),
	})
	.loose();
const CreateSubscriptionErrorResultOut = z
	.object({
		index: z.number().nullish(),
		success: z.boolean().nullish(),
		error: z
			.object({
				code: z.string().nullish(),
				message: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
const CreateSubscriptionResponseOut = z
	.object({
		total: z.number().nullish(),
		successful: z.number().nullish(),
		failed: z.number().nullish(),
		results: z
			.array(
				z.union([
					CreateSubscriptionSuccessResultOut,
					CreateSubscriptionErrorResultOut,
				]),
			)
			.nullish(),
	})
	.loose();
const PaginationResponseOut = z
	.object({
		total: z.number().nullish(),
		limit: z.number().nullish(),
		offset: z.number().nullish(),
		hasMore: z.boolean().nullish(),
	})
	.loose();
const SubscriptionListResponseOut = z
	.object({
		data: z.array(SubscriptionWithoutSecretOut).nullish(),
		pagination: PaginationResponseOut.nullish(),
	})
	.loose();
const SubscriptionResponseOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		entityType: z.string().nullish(),
		entityId: z.union([z.string(), z.number()]).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		isActive: z.boolean().nullish(),
		secret: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();
const TestSubscriptionResponseOut = z
	.object({
		subscriptionId: z.union([z.string(), z.number()]).nullish(),
		subscriptionName: z.string().nullish(),
		url: z.string().nullish(),
		mode: z.string().nullish(),
		flowCheck: z
			.object({
				success: z.boolean().nullish(),
				statusCode: z.number().nullish(),
				durationMs: z.number().nullish(),
				error: z.string().nullish(),
			})
			.loose()
			.nullish(),
		testPayload: z
			.object({
				entityType: z.string().nullish(),
				signalType: z.string().nullish(),
				data: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
		isSuccess: z.boolean().nullish(),
		timestamp: z.string().nullish(),
	})
	.loose();
const DeleteSubscriptionSuccessResultOut = z
	.object({
		index: z.number().nullish(),
		success: z.boolean().nullish(),
		subscription: z
			.object({
				id: z.union([z.string(), z.number()]).nullish(),
				entityType: z.string().nullish(),
				entityId: z.union([z.string(), z.number()]).nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
const DeleteSubscriptionErrorResultOut = z
	.object({
		index: z.number().nullish(),
		success: z.boolean().nullish(),
		error: z
			.object({
				code: z.string().nullish(),
				message: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
const DeleteSubscriptionResponseOut = z
	.object({
		total: z.number().nullish(),
		successful: z.number().nullish(),
		failed: z.number().nullish(),
		results: z
			.array(
				z.union([
					DeleteSubscriptionSuccessResultOut,
					DeleteSubscriptionErrorResultOut,
				]),
			)
			.nullish(),
	})
	.loose();
const AuditLogEntryOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		subscriptionId: z.union([z.string(), z.number()]).nullish(),
		payloadId: z.union([z.string(), z.number()]).nullish(),
		status: z.string().nullish(),
		statusCode: z.number().nullish(),
		url: z.string().nullish(),
		deliveredAt: z.string().nullish(),
		durationMs: z.number().nullish(),
		error: z.string().nullish(),
	})
	.loose();
const AuditLogsResponseOut = z
	.object({
		data: z.array(AuditLogEntryOut).nullish(),
		pagination: PaginationResponseOut.nullish(),
	})
	.loose();
const AuditLogStatsResponseOut = z
	.object({
		total: z.number().nullish(),
		success: z.number().nullish(),
		failed: z.number().nullish(),
		permanentFailure: z.number().nullish(),
		totalCreditsConsumed: z.number().nullish(),
		successRate: z.string().nullish(),
	})
	.loose();
const OptOutSubscriptionResponseOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		entityType: z.string().nullish(),
		entityId: z.union([z.string(), z.number()]).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		url: z.string().nullish(),
		name: z.string().nullish(),
		isActive: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();
const ConversationCompanyOut = z
	.object({
		name: z.string().nullish(),
		domain: z.string().nullish(),
	})
	.loose();
const ConversationParticipantOut = z
	.object({
		name: z.string().nullish(),
		email: z.string().nullish(),
		role: z.string().nullish(),
		isInternal: z.boolean().nullish(),
	})
	.loose();
const ConversationActionItemOut = z
	.object({
		text: z.string().nullish(),
		owner: z.string().nullish(),
		dueDate: z.string().nullish(),
	})
	.loose();
const ConversationSeverityItemOut = z
	.object({
		text: z.string().nullish(),
		severity: z.string().nullish(),
	})
	.loose();
const ConversationCompetitorOut = z
	.object({
		name: z.string().nullish(),
		context: z.string().nullish(),
		sentiment: z.string().nullish(),
	})
	.loose();
const ConversationSummaryOut = z
	.object({
		text: z.string().nullish(),
		keyHighlights: z.array(z.string()).nullish(),
		actionItems: z.array(ConversationActionItemOut).nullish(),
		nextSteps: z.array(z.string()).nullish(),
		risks: z.array(ConversationSeverityItemOut).nullish(),
		objections: z.array(ConversationSeverityItemOut).nullish(),
		competition: z.array(ConversationCompetitorOut).nullish(),
	})
	.loose();
const ConversationCoachingSectionOut = z
	.object({
		section: z.string().nullish(),
		score: z.number().nullish(),
		whatHappened: z.string().nullish(),
		whatToKeep: z.array(z.string()).nullish(),
		whatToImprove: z.array(z.string()).nullish(),
	})
	.loose();
const ConversationCoachingOut = z
	.object({
		overallScore: z.number().nullish(),
		likelihoodOfSale: z.number().nullish(),
		sections: z.array(ConversationCoachingSectionOut).nullish(),
		notes: z.string().nullish(),
	})
	.loose();
const ConversationChapterOut = z
	.object({
		index: z.number().nullish(),
		title: z.string().nullish(),
		startTime: z.string().nullish(),
		endTime: z.string().nullish(),
		summary: z.string().nullish(),
	})
	.loose();
const ConversationOut = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		title: z.string().nullish(),
		date: z.string().nullish(),
		startTime: z.string().nullish(),
		durationSeconds: z.number().nullish(),
		durationFormatted: z.string().nullish(),
		meetingType: z.string().nullish(),
		isExternal: z.boolean().nullish(),
		company: ConversationCompanyOut.nullish(),
		participants: z.array(ConversationParticipantOut).nullish(),
		topicLabels: z.array(z.string()).nullish(),
		summary: ConversationSummaryOut.nullish(),
		coaching: ConversationCoachingOut.nullish(),
		chapters: z.array(ConversationChapterOut).nullish(),
	})
	.loose();
const ConversationPageOut = z
	.object({
		page: z.number().nullish(),
		pageSize: z.number().nullish(),
		totalItems: z.number().nullish(),
		totalPages: z.number().nullish(),
	})
	.loose();
const V3ConversationsSearchResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		conversations: z.array(ConversationOut).nullish(),
		page: ConversationPageOut.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const ConversationTranscriptSegmentOut = z
	.object({
		speaker: z.string().nullish(),
		side: z.string().nullish(),
		text: z.string().nullish(),
		startTime: z.string().nullish(),
		endTime: z.string().nullish(),
	})
	.loose();
const V3ConversationTranscriptResponseOut = z
	.object({
		requestId: z.union([z.string(), z.number()]).nullish(),
		conversationId: z.union([z.string(), z.number()]).nullish(),
		segments: z.array(ConversationTranscriptSegmentOut).nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();

const personProspectContactsInput = z
	.object({
		pagination: z
			.object({
				page: z.number().int().min(0).max(1000),
				size: z.number().int().min(10).max(100),
			})
			.loose(),
		filters: z
			.object({
				contacts: z
					.object({
						include: z
							.object({
								names: z.array(z.string()).optional(),
								jobTitles: z.array(z.string()).optional(),
								jobTitlesExactMatch: z.array(z.string()).optional(),
								normalizedJobTitles: z.array(z.string()).optional(),
								searchText: z.string().optional(),
								countries: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								seniorityIds: z.array(z.number().int()).optional(),
								departments: z.array(z.string()).optional(),
								linkedinUrls: z.array(z.string()).optional(),
								existingDataPoints: z.array(z.string()).optional(),
								signals: z
									.object({
										types: z
											.array(
												z.enum(['allSignals', 'promotion', 'companyChange']),
											)
											.optional(),
										startDate: z.string().optional(),
									})
									.loose()
									.optional(),
								emails: z
									.array(z.string())
									.describe('Personal data - no catalog.')
									.optional(),
								previousEmails: z
									.array(z.string())
									.describe('Personal data - no catalog.')
									.optional(),
								previousJobTitle: z.array(z.string()).optional(),
								skills: z.array(z.string()).optional(),
								certifications: z.array(z.string()).optional(),
								awards: z.array(z.string()).optional(),
								ids: z
									.array(z.string())
									.describe(
										"Encrypted contact id from a prior search's 'results[].id'.",
									)
									.optional(),
								existingDataPointsCondition: z
									.enum(['or', 'and'])
									.describe("Pairs with 'existingDataPoints'.")
									.optional(),
								jobChangedAfterDate: z
									.string()
									.describe(
										"Refinement-only - must be paired with a base filter (e.g. 'jobTitles').",
									)
									.optional(),
								jobChangedLastViewDate: z
									.string()
									.describe(
										'Refinement-only - must be paired with a base filter.',
									)
									.optional(),
								education: z
									.object({
										degrees: z.array(z.string()).optional(),
										fieldsOfStudy: z.array(z.string()).optional(),
										schools: z.array(z.string()).optional(),
										startYearGte: z.number().int().optional(),
										graduationYearLte: z.number().int().optional(),
									})
									.loose()
									.describe(
										'Refinement-only - must be paired with a base filter.',
									)
									.optional(),
								score: z
									.object({
										minScore: z.number().int().min(0).max(100).optional(),
										maxScore: z.number().int().min(0).max(100).optional(),
									})
									.loose()
									.describe(
										'Refinement-only - must be paired with a base filter. Raw 0\u2013100 contact score. Distinct from the \'confidence\' band ("A+"/"A") returned on enriched contacts, which is derived from this score (e.g. \'A+\' when score > 75).',
									)
									.optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.optional(),
						exclude: z
							.object({
								names: z.array(z.string()).optional(),
								jobTitles: z.array(z.string()).optional(),
								jobTitlesExactMatch: z.array(z.string()).optional(),
								normalizedJobTitles: z.array(z.string()).optional(),
								searchText: z.string().optional(),
								countries: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								seniorityIds: z.array(z.number().int()).optional(),
								departments: z.array(z.string()).optional(),
								linkedinUrls: z.array(z.string()).optional(),
								existingDataPoints: z.array(z.string()).optional(),
								signals: z
									.object({
										types: z
											.array(
												z.enum(['allSignals', 'promotion', 'companyChange']),
											)
											.optional(),
										startDate: z.string().optional(),
									})
									.loose()
									.optional(),
								emails: z
									.array(z.string())
									.describe('Personal data - no catalog.')
									.optional(),
								previousEmails: z
									.array(z.string())
									.describe('Personal data - no catalog.')
									.optional(),
								previousJobTitle: z.array(z.string()).optional(),
								skills: z.array(z.string()).optional(),
								certifications: z.array(z.string()).optional(),
								awards: z.array(z.string()).optional(),
								ids: z
									.array(z.string())
									.describe(
										"Encrypted contact id from a prior search's 'results[].id'.",
									)
									.optional(),
								existingDataPointsCondition: z
									.enum(['or', 'and'])
									.describe("Pairs with 'existingDataPoints'.")
									.optional(),
								jobChangedAfterDate: z
									.string()
									.describe(
										"Refinement-only - must be paired with a base filter (e.g. 'jobTitles').",
									)
									.optional(),
								jobChangedLastViewDate: z
									.string()
									.describe(
										'Refinement-only - must be paired with a base filter.',
									)
									.optional(),
								education: z
									.object({
										degrees: z.array(z.string()).optional(),
										fieldsOfStudy: z.array(z.string()).optional(),
										schools: z.array(z.string()).optional(),
										startYearGte: z.number().int().optional(),
										graduationYearLte: z.number().int().optional(),
									})
									.loose()
									.describe(
										'Refinement-only - must be paired with a base filter.',
									)
									.optional(),
								score: z
									.object({
										minScore: z.number().int().min(0).max(100).optional(),
										maxScore: z.number().int().min(0).max(100).optional(),
									})
									.loose()
									.describe(
										'Refinement-only - must be paired with a base filter. Raw 0\u2013100 contact score. Distinct from the \'confidence\' band ("A+"/"A") returned on enriched contacts, which is derived from this score (e.g. \'A+\' when score > 75).',
									)
									.optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
				companies: z
					.object({
						include: z
							.object({
								names: z.array(z.string()).optional(),
								domains: z.array(z.string()).optional(),
								ids: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								sizes: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								revenues: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								technologies: z.array(z.string()).optional(),
								technologiesCondition: z.enum(['or', 'and']).optional(),
								industriesLabels: z.array(z.string()).optional(),
								mainIndustriesIds: z.array(z.number().int()).optional(),
								subIndustriesIds: z.array(z.number().int()).optional(),
								sicCodes: z.array(z.string()).optional(),
								naicsCodes: z.array(z.string()).optional(),
								funding: z
									.object({
										isIpo: z.boolean().optional(),
										ranges: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														min: z.number().int().optional(),
														max: z.number().int().optional(),
													})
													.loose(),
											)
											.optional(),
										date: z
											.object({
												coverage: z
													.enum([
														'last_funding',
														'any_round',
														'total_funds',
														'last_round',
													])
													.optional(),
												date: z.string().optional(),
											})
											.loose()
											.optional(),
										rounds: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														round: z
															.enum([
																'pre_seed',
																'seed',
																'series_a',
																'series_b',
																'series_c',
																'series_d',
																'series_e',
																'series_f',
																'series_g',
																'series_h',
																'other',
															])
															.optional(),
													})
													.loose(),
											)
											.optional(),
										names: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														name: z
															.enum([
																'angel',
																'venture',
																'private_equity',
																'crowdfunding',
																'grant',
																'debt_financing',
																'other',
															])
															.optional(),
													})
													.loose(),
											)
											.optional(),
										investors: z
											.array(z.string())
											.describe(
												'Free text. Accepted but not currently applied downstream.',
											)
											.optional(),
										types: z
											.array(z.string())
											.describe(
												'Legacy free text. Accepted but not currently applied downstream.',
											)
											.optional(),
									})
									.loose()
									.describe(
										'All funding sub-filters live under this single object. Every field is optional; combine any subset.',
									)
									.optional(),
								foundedYear: z
									.array(
										z
											.object({
												min: z.number().int().optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.describe(
										"Filter by year the company was founded. Supports 'min' (greater than or equal) and 'max' (less than or equal) range operators.",
									)
									.optional(),
								businessModel: z
									.array(z.enum(['B2B', 'B2C', 'B2G']))
									.describe(
										'Filter by business model. Accepted values: B2B, B2C, B2G.',
									)
									.optional(),
								companyType: z
									.array(
										z.enum([
											'Government',
											'Private Company',
											'Public Company',
											'Educational',
											'Non Profit',
											'Self Employed',
										]),
									)
									.describe(
										'Filter by company type. Accepted values: Government, Private Company, Public Company, Educational, Non Profit, Self Employed.',
									)
									.optional(),
								linkedinUrls: z
									.array(z.string())
									.describe('Filter by company LinkedIn URLs.')
									.optional(),
								keywords: z
									.array(z.string())
									.describe('Filter by keywords associated with the company.')
									.optional(),
								specialities: z.array(z.string()).optional(),
								exactSpecialities: z.array(z.string()).optional(),
								exactKeywords: z.array(z.string()).optional(),
								keywordsSearchFields: z.array(z.string()).optional(),
								previousCompanyDomains: z.array(z.string()).optional(),
								previousCompanyNames: z.array(z.string()).optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
								locationsZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								headquarterZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.optional(),
						exclude: z
							.object({
								names: z.array(z.string()).optional(),
								domains: z.array(z.string()).optional(),
								ids: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								sizes: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								revenues: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								technologies: z.array(z.string()).optional(),
								technologiesCondition: z.enum(['or', 'and']).optional(),
								industriesLabels: z.array(z.string()).optional(),
								mainIndustriesIds: z.array(z.number().int()).optional(),
								subIndustriesIds: z.array(z.number().int()).optional(),
								sicCodes: z.array(z.string()).optional(),
								naicsCodes: z.array(z.string()).optional(),
								funding: z
									.object({
										isIpo: z.boolean().optional(),
										ranges: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														min: z.number().int().optional(),
														max: z.number().int().optional(),
													})
													.loose(),
											)
											.optional(),
										date: z
											.object({
												coverage: z
													.enum([
														'last_funding',
														'any_round',
														'total_funds',
														'last_round',
													])
													.optional(),
												date: z.string().optional(),
											})
											.loose()
											.optional(),
										rounds: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														round: z
															.enum([
																'pre_seed',
																'seed',
																'series_a',
																'series_b',
																'series_c',
																'series_d',
																'series_e',
																'series_f',
																'series_g',
																'series_h',
																'other',
															])
															.optional(),
													})
													.loose(),
											)
											.optional(),
										names: z
											.array(
												z
													.object({
														coverage: z
															.enum([
																'last_funding',
																'any_round',
																'total_funds',
																'last_round',
															])
															.optional(),
														name: z
															.enum([
																'angel',
																'venture',
																'private_equity',
																'crowdfunding',
																'grant',
																'debt_financing',
																'other',
															])
															.optional(),
													})
													.loose(),
											)
											.optional(),
										investors: z
											.array(z.string())
											.describe(
												'Free text. Accepted but not currently applied downstream.',
											)
											.optional(),
										types: z
											.array(z.string())
											.describe(
												'Legacy free text. Accepted but not currently applied downstream.',
											)
											.optional(),
									})
									.loose()
									.describe(
										'All funding sub-filters live under this single object. Every field is optional; combine any subset.',
									)
									.optional(),
								foundedYear: z
									.array(
										z
											.object({
												min: z.number().int().optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.describe(
										"Filter by year the company was founded. Supports 'min' (greater than or equal) and 'max' (less than or equal) range operators.",
									)
									.optional(),
								businessModel: z
									.array(z.enum(['B2B', 'B2C', 'B2G']))
									.describe(
										'Filter by business model. Accepted values: B2B, B2C, B2G.',
									)
									.optional(),
								companyType: z
									.array(
										z.enum([
											'Government',
											'Private Company',
											'Public Company',
											'Educational',
											'Non Profit',
											'Self Employed',
										]),
									)
									.describe(
										'Filter by company type. Accepted values: Government, Private Company, Public Company, Educational, Non Profit, Self Employed.',
									)
									.optional(),
								linkedinUrls: z
									.array(z.string())
									.describe('Filter by company LinkedIn URLs.')
									.optional(),
								keywords: z
									.array(z.string())
									.describe('Filter by keywords associated with the company.')
									.optional(),
								specialities: z.array(z.string()).optional(),
								exactSpecialities: z.array(z.string()).optional(),
								exactKeywords: z.array(z.string()).optional(),
								keywordsSearchFields: z.array(z.string()).optional(),
								previousCompanyDomains: z.array(z.string()).optional(),
								previousCompanyNames: z.array(z.string()).optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
								locationsZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								headquarterZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, results are also persisted to this table. See the Tables API.',
			)
			.optional(),
		options: z
			.object({
				includePartialProfiles: z.boolean().optional(),
				excludeDnc: z.boolean().optional(),
				maxContactsPerCompany: z
					.number()
					.int()
					.min(1)
					.max(20)
					.describe(
						"Caps how many contacts are returned per company - not the page size. 'pagination.size' still controls the page size. Accepts 1\u201320; omit for uncapped results.",
					)
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const personProspectContactsOutput = V3ProspectingContactsResponseOut;
const companyProspectCompaniesInput = z
	.object({
		pagination: z
			.object({
				page: z.number().int().min(0).max(1000),
				size: z.number().int().min(10).max(100),
			})
			.loose(),
		filters: z
			.object({
				companies: z
					.object({
						include: z
							.object({
								names: z.array(z.string()).optional(),
								domains: z.array(z.string()).optional(),
								ids: z.array(z.string()).optional(),
								searchText: z.string().optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								sizes: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								revenues: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								technologies: z.array(z.string()).optional(),
								technologiesCondition: z.enum(['or', 'and']).optional(),
								mainIndustriesIds: z.array(z.number().int()).optional(),
								subIndustriesIds: z.array(z.number().int()).optional(),
								sicCodes: z.array(z.string()).optional(),
								naicsCodes: z.array(z.string()).optional(),
								signals: z
									.object({
										types: z.array(z.string()).optional(),
										startDate: z.string().optional(),
										filterByLocation: z
											.array(
												z
													.object({
														country: z.string().optional(),
														state: z.string().optional(),
														startDate: z.string().optional(),
													})
													.loose(),
											)
											.optional(),
										filterByDepartment: z
											.array(
												z
													.object({
														department: z.string(),
														startDate: z.string().optional(),
													})
													.loose(),
											)
											.optional(),
										filterByIntentCategory: z
											.array(z.string())
											.describe(
												"Refines linkedinActivityIntent results by Bombora intent category. Applied only when linkedinActivityIntent is present in 'types' (or selected via allSignals). Omit to match all categories.",
											)
											.optional(),
									})
									.loose()
									.optional(),
								foundedYear: z
									.array(
										z
											.object({
												min: z.number().int().optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.describe(
										"Filter by year the company was founded. Supports 'min' (greater than or equal) and 'max' (less than or equal) range operators.",
									)
									.optional(),
								businessModel: z
									.array(z.enum(['B2B', 'B2C', 'B2G']))
									.describe(
										'Filter by business model. Accepted values: B2B, B2C, B2G.',
									)
									.optional(),
								companyType: z
									.array(
										z.enum([
											'Government',
											'Private Company',
											'Public Company',
											'Educational',
											'Non Profit',
											'Self Employed',
										]),
									)
									.describe(
										'Filter by company type. Accepted values: Government, Private Company, Public Company, Educational, Non Profit, Self Employed.',
									)
									.optional(),
								linkedinUrls: z
									.array(z.string())
									.describe('Filter by company LinkedIn URLs.')
									.optional(),
								keywords: z
									.array(z.string())
									.describe('Filter by keywords associated with the company.')
									.optional(),
								specialities: z.array(z.string()).optional(),
								exactSpecialities: z.array(z.string()).optional(),
								exactKeywords: z.array(z.string()).optional(),
								keywordsSearchFields: z.array(z.string()).optional(),
								previousCompanyDomains: z.array(z.string()).optional(),
								previousCompanyNames: z.array(z.string()).optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
								locationsZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								headquarterZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose(),
						exclude: z
							.object({
								names: z.array(z.string()).optional(),
								domains: z.array(z.string()).optional(),
								ids: z.array(z.string()).optional(),
								searchText: z.string().optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								sizes: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								revenues: z
									.array(
										z
											.object({
												min: z.number().int().min(0).optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.optional(),
								technologies: z.array(z.string()).optional(),
								technologiesCondition: z.enum(['or', 'and']).optional(),
								mainIndustriesIds: z.array(z.number().int()).optional(),
								subIndustriesIds: z.array(z.number().int()).optional(),
								sicCodes: z.array(z.string()).optional(),
								naicsCodes: z.array(z.string()).optional(),
								signals: z
									.object({
										types: z.array(z.string()).optional(),
										startDate: z.string().optional(),
										filterByLocation: z
											.array(
												z
													.object({
														country: z.string().optional(),
														state: z.string().optional(),
														startDate: z.string().optional(),
													})
													.loose(),
											)
											.optional(),
										filterByDepartment: z
											.array(
												z
													.object({
														department: z.string(),
														startDate: z.string().optional(),
													})
													.loose(),
											)
											.optional(),
										filterByIntentCategory: z
											.array(z.string())
											.describe(
												"Refines linkedinActivityIntent results by Bombora intent category. Applied only when linkedinActivityIntent is present in 'types' (or selected via allSignals). Omit to match all categories.",
											)
											.optional(),
									})
									.loose()
									.optional(),
								foundedYear: z
									.array(
										z
											.object({
												min: z.number().int().optional(),
												max: z.number().int().optional(),
											})
											.loose(),
									)
									.describe(
										"Filter by year the company was founded. Supports 'min' (greater than or equal) and 'max' (less than or equal) range operators.",
									)
									.optional(),
								businessModel: z
									.array(z.enum(['B2B', 'B2C', 'B2G']))
									.describe(
										'Filter by business model. Accepted values: B2B, B2C, B2G.',
									)
									.optional(),
								companyType: z
									.array(
										z.enum([
											'Government',
											'Private Company',
											'Public Company',
											'Educational',
											'Non Profit',
											'Self Employed',
										]),
									)
									.describe(
										'Filter by company type. Accepted values: Government, Private Company, Public Company, Educational, Non Profit, Self Employed.',
									)
									.optional(),
								linkedinUrls: z
									.array(z.string())
									.describe('Filter by company LinkedIn URLs.')
									.optional(),
								keywords: z
									.array(z.string())
									.describe('Filter by keywords associated with the company.')
									.optional(),
								specialities: z.array(z.string()).optional(),
								exactSpecialities: z.array(z.string()).optional(),
								exactKeywords: z.array(z.string()).optional(),
								keywordsSearchFields: z.array(z.string()).optional(),
								previousCompanyDomains: z.array(z.string()).optional(),
								previousCompanyNames: z.array(z.string()).optional(),
								geographicDetails: z
									.array(
										z
											.object({
												country: z.string().optional(),
												zipcode: z.string().optional(),
												distance: z
													.number()
													.int()
													.describe('Radius in miles.')
													.optional(),
											})
											.loose(),
									)
									.optional(),
								locationsZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								headquarterZipcodes: z
									.array(
										z
											.object({
												countryIso2: z.string().optional(),
												zipcode: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
							})
							.loose()
							.optional(),
					})
					.loose(),
				contacts: z
					.object({
						include: z
							.object({
								jobTitles: z.array(z.string()).optional(),
								departments: z.array(z.string()).optional(),
								seniorityIds: z.array(z.number().int()).optional(),
								skills: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								existingDataPoints: z.array(z.string()).optional(),
							})
							.loose()
							.describe(
								'Restricted contact-attribute filters usable within a company prospecting request.',
							)
							.optional(),
						exclude: z
							.object({
								jobTitles: z.array(z.string()).optional(),
								departments: z.array(z.string()).optional(),
								seniorityIds: z.array(z.number().int()).optional(),
								skills: z.array(z.string()).optional(),
								locations: z
									.array(
										z
											.object({
												city: z.string().optional(),
												state: z.string().optional(),
												country: z.string().optional(),
												continent: z.string().optional(),
												countryGrouping: z.string().optional(),
												region: z.string().optional(),
												countryIso2: z.string().optional(),
											})
											.loose(),
									)
									.optional(),
								existingDataPoints: z.array(z.string()).optional(),
							})
							.loose()
							.describe(
								'Restricted contact-attribute filters usable within a company prospecting request.',
							)
							.optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.describe(
				"'filters.contacts' cannot be combined with company 'searchText', 'signals', or 'technologies' on the same request - doing so returns '400' (contact filters are never silently ignored).",
			),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, results are also persisted to this table. See the Tables API.',
			)
			.optional(),
		options: z
			.object({
				includePartialProfiles: z.boolean().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const companyProspectCompaniesOutput = V3ProspectingCompaniesResponseOut;
const personGetContactLookalikesInput = z
	.object({
		dedupeSessionId: z.string().optional(),
		seeds: z
			.object({
				linkedinUrls: z.array(z.string()).max(100).optional(),
				contacts: z
					.array(
						z
							.object({
								firstName: z.string(),
								lastName: z.string(),
								companyDomain: z.string().optional(),
								companyName: z.string().optional(),
							})
							.loose(),
					)
					.max(100)
					.optional(),
				emails: z.array(z.string()).max(100).optional(),
				ids: z
					.array(z.string())
					.max(100)
					.describe('Lusha contact IDs as strings (preferred)')
					.optional(),
				contactIds: z
					.array(z.number().int())
					.max(100)
					.describe('Lusha contact IDs as numbers (legacy; prefer ids)')
					.optional(),
			})
			.loose()
			.describe(
				"**Required. Minimum 5, maximum 100 seed contacts in total**, counted across all identifier types combined ('linkedinUrls' + 'emails' + 'ids' + 'contactIds' + 'contacts'). Fewer than 5 total seeds is rejected with '400'.",
			),
		exclude: z
			.object({
				linkedinUrls: z.array(z.string()).max(100).optional(),
				contacts: z
					.array(
						z
							.object({
								firstName: z.string(),
								lastName: z.string(),
								companyDomain: z.string().optional(),
								companyName: z.string().optional(),
							})
							.loose(),
					)
					.max(100)
					.optional(),
				emails: z.array(z.string()).max(100).optional(),
				ids: z
					.array(z.string())
					.max(100)
					.describe('Lusha contact IDs as strings (preferred)')
					.optional(),
				contactIds: z
					.array(z.number().int())
					.max(100)
					.describe('Lusha contact IDs as numbers (legacy; prefer ids)')
					.optional(),
			})
			.loose()
			.describe(
				'Optional. Contacts to always filter out of the results (for example, existing customers). Omit the field entirely if you have nothing to exclude.',
			)
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, results are also persisted to this table. See the Tables API.',
			)
			.optional(),
	})
	.loose();
const personGetContactLookalikesOutput = ContactLookalikesResponseOut;
const companyGetCompanyLookalikesInput = z
	.object({
		dedupeSessionId: z.string().optional(),
		seeds: z
			.object({
				domains: z.array(z.string()).max(100).optional(),
				linkedinUrls: z.array(z.string()).max(100).optional(),
			})
			.loose()
			.describe(
				"**Required. Minimum 5, maximum 100 seed companies in total**, counted across all identifier types combined ('domains' + 'linkedinUrls'). Fewer than 5 total seeds is rejected with '400'.",
			),
		exclude: z
			.object({
				domains: z.array(z.string()).max(100).optional(),
				linkedinUrls: z.array(z.string()).max(100).optional(),
			})
			.loose()
			.describe(
				'Optional. Companies to always filter out of the results (for example, existing customers or competitors). Omit the field entirely if you have nothing to exclude.',
			)
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, results are also persisted to this table. See the Tables API.',
			)
			.optional(),
	})
	.loose();
const companyGetCompanyLookalikesOutput = CompanyLookalikesResponseOut;
const personGetContactRecommendationsInput = z
	.object({
		pagination: z
			.object({
				page: z.number().int().min(0).max(1000),
				size: z.number().int().min(10).max(100),
			})
			.loose()
			.optional(),
		sort: z
			.array(
				z
					.object({
						by: z
							.enum(['leadScore', 'signalScore', 'icpFitScore', 'targetIcp'])
							.describe(
								"Field to sort by. Score fields sort numerically; 'targetIcp' sorts alphabetically by the matched Target Profile name.",
							),
						order: z
							.enum(['asc', 'desc'])
							.describe(
								"Sort direction. Every entry in 'sort' must use the same direction.",
							)
							.optional(),
					})
					.loose(),
			)
			.max(4)
			.describe(
				"Sort keys, applied in order. Up to 4 entries, all with the same 'order'. Defaults to 'leadScore' descending.",
			)
			.optional(),
		filters: z
			.object({
				targetIcp: z
					.array(z.string())
					.max(50)
					.describe(
						'Target Profile ids to include (any-match). Get valid ids from the recommendation filters endpoint.',
					)
					.optional(),
				signals: z
					.array(z.string())
					.max(50)
					.describe(
						'Signal types to include (any-match). Get valid names from the recommendation filters endpoint.',
					)
					.optional(),
				leadScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
				signalScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
				icpFitScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const personGetContactRecommendationsOutput =
	V3RecommendationsContactsResponseOut;
const companyGetCompanyRecommendationsInput = z
	.object({
		pagination: z
			.object({
				page: z.number().int().min(0).max(1000),
				size: z.number().int().min(10).max(100),
			})
			.loose()
			.optional(),
		sort: z
			.array(
				z
					.object({
						by: z
							.enum(['leadScore', 'signalScore', 'icpFitScore', 'targetIcp'])
							.describe(
								"Field to sort by. Score fields sort numerically; 'targetIcp' sorts alphabetically by the matched Target Profile name.",
							),
						order: z
							.enum(['asc', 'desc'])
							.describe(
								"Sort direction. Every entry in 'sort' must use the same direction.",
							)
							.optional(),
					})
					.loose(),
			)
			.max(4)
			.describe(
				"Sort keys, applied in order. Up to 4 entries, all with the same 'order'. Defaults to 'leadScore' descending.",
			)
			.optional(),
		filters: z
			.object({
				targetIcp: z
					.array(z.string())
					.max(50)
					.describe(
						'Target Profile ids to include (any-match). Get valid ids from the recommendation filters endpoint.',
					)
					.optional(),
				signals: z
					.array(z.string())
					.max(50)
					.describe(
						'Signal types to include (any-match). Get valid names from the recommendation filters endpoint.',
					)
					.optional(),
				leadScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
				signalScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
				icpFitScore: z
					.object({
						min: z.number().min(0).max(1).optional(),
						max: z.number().min(0).max(1).optional(),
					})
					.loose()
					.describe(
						"Inclusive score range. Both bounds are between 0 and 1, and 'min' must not exceed 'max'.",
					)
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const companyGetCompanyRecommendationsOutput =
	V3RecommendationsCompaniesResponseOut;
const personGetContactRecommendationFiltersInput = z.object({}).loose();
const personGetContactRecommendationFiltersOutput =
	V3RecommendationsFiltersResponseOut;
const companyGetCompanyRecommendationFiltersInput = z.object({}).loose();
const companyGetCompanyRecommendationFiltersOutput =
	V3RecommendationsFiltersResponseOut;
const personGetBuyingGroupInput = z
	.object({
		companies: z
			.array(
				z
					.object({
						clientReferenceId: z
							.string()
							.describe(
								'Optional caller-supplied token, echoed back on the matching result.',
							)
							.optional(),
						domain: z.string().optional(),
						id: z.string().describe('Lusha company ID.').optional(),
					})
					.loose(),
			)
			.min(1)
			.max(25),
		personas: z
			.array(z.enum(['decision_maker', 'potential_champion', 'end_user']))
			.describe(
				'Filter results to specific persona roles. Omit to return all three.',
			)
			.optional(),
		contactsLimit: z
			.number()
			.int()
			.min(1)
			.describe('Maximum number of contacts returned per company.')
			.optional(),
		pagination: z
			.object({
				page: z.number().int().min(0).optional(),
				size: z.number().int().min(10).max(100).optional(),
			})
			.loose()
			.describe('Optional. If omitted, defaults to page 0, size 100.')
			.optional(),
	})
	.loose();
const personGetBuyingGroupOutput = V3BuyingGroupResponseOut;
const contactTablesCreateInput = z
	.object({
		name: z
			.string()
			.describe(
				"Table name, up to 250 characters. Allowed: letters in any language, digits, spaces, and '- _ . , ' & ( ) / # + : ! ? @'.",
			),
		visibility: z.enum(['private', 'shared']).optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
		ids: z
			.array(z.string())
			.describe('Optional initial entity IDs to seed the table with.')
			.optional(),
	})
	.loose();
const contactTablesCreateOutput = TableResponseOut;
const contactTablesListInput = z
	.object({
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
		page: z.number().int().min(0).max(100).optional(),
		size: z.number().int().optional(),
		name: z
			.string()
			.describe(
				'Optional filter - matches tables whose name contains this text.',
			)
			.optional(),
		status: z
			.enum(['active', 'archived'])
			.describe("'deleted' is not a filterable status.")
			.optional(),
	})
	.loose();
const contactTablesListOutput = TableListResponseOut;
const contactTablesGetColumnCatalogInput = z.object({}).loose();
const contactTablesGetColumnCatalogOutput = ColumnCatalogResponseOut;
const contactTablesGetInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const contactTablesGetOutput = TableResponseOut;
const contactTablesUpdateInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		name: z
			.string()
			.describe(
				"New name, up to 250 characters. Allowed: letters in any language, digits, spaces, and '- _ . , ' & ( ) / # + : ! ? @'.",
			)
			.optional(),
		visibility: z.enum(['private', 'shared']).optional(),
		archived: z
			.boolean()
			.describe(
				"Set 'true' to archive the table (hides it from default List Tables results), 'false' to restore it.",
			)
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const contactTablesUpdateOutput = TableResponseOut;
const contactTablesDeleteInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const contactTablesDeleteOutput = z
	.object({
		data: z
			.object({
				tableId: z.union([z.string(), z.number()]).nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const contactTablesListEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
		page: z.number().int().max(100).optional(),
		size: z.number().int().optional(),
	})
	.loose();
const contactTablesListEntitiesOutput = EntitiesGetResponseOut;
const contactTablesAddEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		entityIds: z
			.array(z.string())
			.max(500)
			.describe(
				"Lusha IDs as strings - 'personId' for contacts, 'lushaCompanyId' for companies. Accepts either the encrypted token ('v{N}.\u2026', as returned by Search/Enrich/Get Entities) or the legacy numeric ID.",
			),
		companyIds: z
			.array(z.string())
			.describe(
				"Contacts tables only. One 'lushaCompanyId' per contact (encrypted token or numeric), index-aligned with 'entityIds', to help pair company-level enrichment to the right company for each contact.",
			)
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const contactTablesAddEntitiesOutput = EntitiesAddResponseOut;
const contactTablesRemoveEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		entityIds: z
			.array(z.string())
			.describe(
				"Accepts either the encrypted token ('v{N}.\u2026', as returned by Get Entities) or the legacy numeric ID. Unresolved IDs are echoed back in 'invalidIds' in the exact form you sent them.",
			),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const contactTablesRemoveEntitiesOutput = EntitiesRemoveResponseOut;
const contactTablesListColumnsInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const contactTablesListColumnsOutput = ColumnsListResponseOut;
const contactTablesAddColumnsInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		columns: z
			.array(
				z
					.object({
						columnKey: z
							.string()
							.describe("A 'columnKey' from the column catalog endpoint."),
					})
					.loose(),
			)
			.min(1)
			.max(10)
			.describe('Up to 10 Lusha columns to add in one call.')
			.optional(),
		columnKey: z
			.string()
			.describe('Shorthand for adding exactly one column.')
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			)
			.optional(),
	})
	.loose();
const contactTablesAddColumnsOutput = ColumnsAddResponseOut;
const contactTablesRemoveColumnInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		columnId: z.string().min(1).describe("The column's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const contactTablesRemoveColumnOutput = z
	.object({
		data: z
			.object({
				columnId: z.union([z.string(), z.number()]).nullish(),
				removed: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const contactTablesRunColumnInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		columnId: z.string().min(1).describe("The column's ID."),
		runScope: z
			.enum(['all', 'missing', 'specific'])
			.describe(
				"Controls which rows a column operation applies to. 'all' re-runs every row, including already-processed ones. 'missing' only runs rows that don't have a value for this column yet. 'specific' requires 'entityIds'.",
			),
		entityIds: z
			.array(z.string())
			.describe("Required when 'runScope' is 'specific'.")
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const contactTablesRunColumnOutput = ColumnsRunResponseOut;
const companyTablesCreateInput = z
	.object({
		name: z
			.string()
			.describe(
				"Table name, up to 250 characters. Allowed: letters in any language, digits, spaces, and '- _ . , ' & ( ) / # + : ! ? @'.",
			),
		visibility: z.enum(['private', 'shared']).optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
		ids: z
			.array(z.string())
			.describe('Optional initial entity IDs to seed the table with.')
			.optional(),
	})
	.loose();
const companyTablesCreateOutput = TableResponseOut;
const companyTablesListInput = z
	.object({
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
		page: z.number().int().min(0).max(100).optional(),
		size: z.number().int().optional(),
		name: z
			.string()
			.describe(
				'Optional filter - matches tables whose name contains this text.',
			)
			.optional(),
		status: z
			.enum(['active', 'archived'])
			.describe("'deleted' is not a filterable status.")
			.optional(),
	})
	.loose();
const companyTablesListOutput = TableListResponseOut;
const companyTablesGetColumnCatalogInput = z.object({}).loose();
const companyTablesGetColumnCatalogOutput = ColumnCatalogResponseOut;
const companyTablesGetInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const companyTablesGetOutput = TableResponseOut;
const companyTablesUpdateInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		name: z
			.string()
			.describe(
				"New name, up to 250 characters. Allowed: letters in any language, digits, spaces, and '- _ . , ' & ( ) / # + : ! ? @'.",
			)
			.optional(),
		visibility: z.enum(['private', 'shared']).optional(),
		archived: z
			.boolean()
			.describe(
				"Set 'true' to archive the table (hides it from default List Tables results), 'false' to restore it.",
			)
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const companyTablesUpdateOutput = TableResponseOut;
const companyTablesDeleteInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const companyTablesDeleteOutput = z
	.object({
		data: z
			.object({
				tableId: z.union([z.string(), z.number()]).nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
		billing: V3BillingOut.nullish(),
	})
	.loose();
const companyTablesListEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
		page: z.number().int().max(100).optional(),
		size: z.number().int().optional(),
	})
	.loose();
const companyTablesListEntitiesOutput = EntitiesGetResponseOut;
const companyTablesAddEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		entityIds: z
			.array(z.string())
			.max(500)
			.describe(
				"Lusha IDs as strings - 'personId' for contacts, 'lushaCompanyId' for companies. Accepts either the encrypted token ('v{N}.\u2026', as returned by Search/Enrich/Get Entities) or the legacy numeric ID.",
			),
		companyIds: z
			.array(z.string())
			.describe(
				"Contacts tables only. One 'lushaCompanyId' per contact (encrypted token or numeric), index-aligned with 'entityIds', to help pair company-level enrichment to the right company for each contact.",
			)
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const companyTablesAddEntitiesOutput = EntitiesAddResponseOut;
const companyTablesRemoveEntitiesInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		entityIds: z
			.array(z.string())
			.describe(
				"Accepts either the encrypted token ('v{N}.\u2026', as returned by Get Entities) or the legacy numeric ID. Unresolved IDs are echoed back in 'invalidIds' in the exact form you sent them.",
			),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const companyTablesRemoveEntitiesOutput = EntitiesRemoveResponseOut;
const companyTablesRemoveColumnInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		columnId: z.string().min(1).describe("The column's ID."),
		ownerEmail: z
			.string()
			.describe(
				'Email of the user making the request. Used to scope ownership/visibility checks on GET/DELETE calls, which cannot carry a body.',
			)
			.optional(),
	})
	.loose();
const companyTablesRemoveColumnOutput = z
	.object({
		tableId: z.union([z.string(), z.number()]).nullish(),
		columnId: z.union([z.string(), z.number()]).nullish(),
		removed: z.boolean().nullish(),
	})
	.loose();
const companyTablesRunColumnInput = z
	.object({
		tableId: z.string().min(1).describe("The table's ID."),
		columnId: z.string().min(1).describe("The column's ID."),
		runScope: z
			.enum(['all', 'missing', 'specific'])
			.describe(
				"Controls which rows a column operation applies to. 'all' re-runs every row, including already-processed ones. 'missing' only runs rows that don't have a value for this column yet. 'specific' requires 'entityIds'.",
			),
		entityIds: z
			.array(z.string())
			.describe("Required when 'runScope' is 'specific'.")
			.optional(),
		owner: z
			.object({
				email: z
					.string()
					.describe(
						'Must resolve to an existing user on the account tied to your API key.',
					)
					.optional(),
			})
			.loose()
			.describe(
				"Identifies the user acting on the table, and resolves to a user on your account. Required on every table-route call when authenticating with an API key (there is no signed-in user) - omitting it returns '400'.",
			),
	})
	.loose();
const companyTablesRunColumnOutput = ColumnsRunResponseOut;
const personGetContactSignalsInput = z
	.object({
		ids: z.array(z.string()).min(1).max(100),
		signalTypes: z.array(z.enum(['allSignals', 'promotion', 'companyChange'])),
		startDate: z.string().optional(),
		maxResultsPerSignal: z.number().int().min(1).max(100).optional(),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, these contacts are also added to this table (if not already present) and the Signals column is populated. See the Tables API.',
			)
			.optional(),
	})
	.loose();
const personGetContactSignalsOutput = V3ContactSignalsResponseOut;
const companyGetCompanySignalsInput = z
	.object({
		ids: z.array(z.string()).min(1).max(100),
		signalTypes: z
			.array(
				z.enum([
					'allSignals',
					'linkedinActivityIntent',
					'newIntentTopic',
					'intentScoreIncrease',
					'intentScoreDecrease',
					'intentTopicRemoved',
					'websiteTrafficDecrease',
					'websiteTrafficIncrease',
					'itSpendIncrease',
					'itSpendDecrease',
					'linkedinFollowersIncrease',
					'linkedinFollowersDecrease',
					'surgeInHiring',
					'headcountIncrease1m',
					'headcountIncrease3m',
					'headcountIncrease6m',
					'headcountIncrease12m',
					'headcountDecrease1m',
					'headcountDecrease3m',
					'headcountDecrease6m',
					'headcountDecrease12m',
					'surgeInHiringByDepartment',
					'surgeInHiringByLocation',
					'riskNews',
					'commercialActivityNews',
					'corporateStrategyNews',
					'financialEventsNews',
					'peopleNews',
					'marketIntelligenceNews',
					'productActivityNews',
				]),
			)
			.describe(
				"Signal types to retrieve. 'allSignals' returns every company signal type except the four intent types ('newIntentTopic', 'intentScoreIncrease', 'intentScoreDecrease', 'intentTopicRemoved') - name those explicitly to get...",
			),
		startDate: z
			.string()
			.describe(
				'For linkedinActivityIntent, results are limited to a trailing 90-day window regardless of the value passed (legal requirement). Other signal types are unaffected.',
			)
			.optional(),
		maxResultsPerSignal: z
			.number()
			.int()
			.min(1)
			.max(100)
			.describe(
				'For linkedinActivityIntent, results are capped at 50 per company regardless of the value passed. Other signal types use the requested value as-is (1-100).',
			)
			.optional(),
		tableId: z
			.string()
			.describe(
				'Optional. If provided, these companies are also added to this table (if not already present) and the Signals column is populated. See the Tables API.',
			)
			.optional(),
		filters: z
			.object({
				include: z
					.object({
						intentCategories: z
							.array(z.string())
							.describe(
								"Narrows intent results by intent category. Applies to 'linkedinActivityIntent' and the four intent types ('newIntentTopic', 'intentScoreIncrease', 'intentScoreDecrease', 'intentTopicRemoved') - other signal types are una...",
							)
							.optional(),
						intentTopics: z
							.array(z.string())
							.describe(
								"Narrows the four intent types ('newIntentTopic', 'intentScoreIncrease', 'intentScoreDecrease', 'intentTopicRemoved') to these topics.",
							)
							.optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const companyGetCompanySignalsOutput = V3CompanySignalsResponseOut;
const personGetContactSignalTypesInput = z.object({}).loose();
const personGetContactSignalTypesOutput = ContactSignalTypesResponseOut;
const companyGetCompanySignalTypesInput = z.object({}).loose();
const companyGetCompanySignalTypesOutput = CompanySignalTypesResponseOut;
const companyGetCompanySignalFiltersInput = z.object({}).loose();
const companyGetCompanySignalFiltersOutput = FilterTypesDiscoveryResponseOut;
const companyGetCompanySignalFilterValuesInput = z
	.object({
		filterType: z.enum([
			'newsEventTypes',
			'hiringByDepartments',
			'hiringByLocations',
			'intentCategories',
			'intentTopics',
		]),
		query: z
			.string()
			.describe(
				"Text to match values against. Required for 'hiringByLocations' and 'intentTopics'.",
			)
			.optional(),
	})
	.loose();
const companyGetCompanySignalFilterValuesOutput = FilterValuesResponseOut;
const companyGetCompanySignalScoresInput = z
	.object({
		companies: z
			.array(
				z
					.object({
						clientReferenceId: z
							.string()
							.describe(
								'Caller-supplied token echoed back on the matching result.',
							)
							.optional(),
						id: z
							.string()
							.describe(
								'Encrypted Lusha company ID (vN.\u2026). Legacy numeric IDs accepted during the transition window.',
							)
							.optional(),
						domain: z.string().optional(),
						name: z.string().optional(),
						email: z
							.string()
							.describe(
								'Must be a valid email address; only the domain part is used for resolution. A malformed email is rejected with 400.',
							)
							.optional(),
					})
					.loose(),
			)
			.min(1)
			.max(100),
	})
	.loose();
const companyGetCompanySignalScoresOutput = V3SignalScoreCompaniesResponseOut;
const personGetContactSignalScoresInput = z
	.object({
		contacts: z
			.array(
				z
					.object({
						clientReferenceId: z.string().optional(),
						id: z
							.string()
							.describe('Encrypted Lusha contact ID (vN.\u2026).')
							.optional(),
						linkedinUrl: z.string().optional(),
						email: z.string().optional(),
						firstName: z.string().optional(),
						lastName: z.string().optional(),
						companyName: z.string().optional(),
						companyDomain: z.string().optional(),
					})
					.loose(),
			)
			.min(1)
			.max(100),
	})
	.loose();
const personGetContactSignalScoresOutput = V3SignalScoreContactsResponseOut;
const icpListProfilesInput = z
	.object({
		status: z
			.enum(['active', 'disabled'])
			.describe('Return only profiles with this status.')
			.optional(),
		access: z
			.enum(['private', 'shared'])
			.describe(
				'Return only private profiles, or only profiles shared with the account.',
			)
			.optional(),
	})
	.loose();
const icpListProfilesOutput = V3IcpProfilesResponseOut;
const companyGetCompanyIcpFitScoresInput = z
	.object({
		targetProfileIds: z
			.array(z.string())
			.min(1)
			.max(3)
			.describe(
				"1-3 Target Profile IDs to score against. Each must be an 'active' profile you own or that is shared with your account - get them from [List Target Profiles](#operation/listIcpProfiles).",
			),
		companies: z
			.array(
				z
					.object({
						clientReferenceId: z
							.string()
							.describe(
								'Caller-supplied token echoed back on the matching result.',
							)
							.optional(),
						id: z
							.string()
							.describe(
								'Encrypted Lusha company ID (vN.\u2026). Legacy numeric IDs accepted during the transition window.',
							)
							.optional(),
						domain: z.string().optional(),
						name: z.string().optional(),
						email: z
							.string()
							.describe(
								'Must be a valid email address; only the domain part is used for resolution. A malformed email is rejected with 400.',
							)
							.optional(),
					})
					.loose(),
			)
			.min(1)
			.max(100),
	})
	.loose();
const companyGetCompanyIcpFitScoresOutput = V3IcpFitScoreCompaniesResponseOut;
const personGetContactIcpFitScoresInput = z
	.object({
		targetProfileIds: z
			.array(z.string())
			.min(1)
			.max(3)
			.describe(
				"1-3 Target Profile IDs to score against. Each must be an 'active' profile you own or that is shared with your account - get them from [List Target Profiles](#operation/listIcpProfiles).",
			),
		contacts: z
			.array(
				z
					.object({
						clientReferenceId: z.string().optional(),
						id: z
							.string()
							.describe('Encrypted Lusha contact ID (vN.\u2026).')
							.optional(),
						linkedinUrl: z.string().optional(),
						email: z.string().optional(),
						firstName: z.string().optional(),
						lastName: z.string().optional(),
						companyName: z.string().optional(),
						companyDomain: z.string().optional(),
					})
					.loose(),
			)
			.min(1)
			.max(100),
	})
	.loose();
const personGetContactIcpFitScoresOutput = V3IcpFitScoreContactsResponseOut;
const companyGetWebsiteVisitsInput = z
	.object({
		domains: z
			.array(z.string())
			.min(1)
			.describe('Domains configured for tracking in the Lusha dashboard.'),
		startDate: z.string().describe('Window start date (YYYY-MM-DD).'),
		endDate: z
			.string()
			.describe('Window end date (YYYY-MM-DD). Range must be \u2264 3 months.'),
		pagination: z
			.object({
				size: z.number().int().min(1).max(150),
				page: z.number().int().min(0),
			})
			.loose(),
		sort: z
			.object({
				by: z.string().describe("Field to sort by (e.g. 'score').").optional(),
				order: z.enum(['asc', 'desc']).optional(),
			})
			.loose()
			.optional(),
		filters: z
			.object({
				scoreBands: z
					.array(z.enum(['cold', 'warm', 'hot']))
					.describe('Restrict to specific score bands.')
					.optional(),
				visitorCountries: z
					.object({
						include: z.array(z.string()).optional(),
						exclude: z.array(z.string()).optional(),
					})
					.loose()
					.describe('ISO 3166-1 alpha-2 country code filters.')
					.optional(),
				score: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Score range (1\u2013100).')
					.optional(),
				totalSessions: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Integer range filter (non-negative)')
					.optional(),
				avgSessionMinutes: z
					.object({
						min: z.number().min(0).optional(),
						max: z.number().min(0).optional(),
					})
					.loose()
					.describe('Float range filter (non-negative)')
					.optional(),
				uniqueVisitors: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Integer range filter (non-negative)')
					.optional(),
				daysVisited: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Integer range filter (non-negative)')
					.optional(),
				highIntentPageviews: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Integer range filter (non-negative)')
					.optional(),
				daysSinceLastVisit: z
					.object({
						min: z.number().int().min(0).optional(),
						max: z.number().int().min(0).optional(),
					})
					.loose()
					.describe('Integer range filter (non-negative)')
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();
const companyGetWebsiteVisitsOutput = WebsiteVisitsResponseOut;
const personGetContactFilterTypesInput = z.object({}).loose();
const personGetContactFilterTypesOutput = FilterTypesDiscoveryResponseOut;
const personGetContactFilterValuesInput = z
	.object({
		filterType: z.enum([
			'departments',
			'seniority',
			'existingDataPoints',
			'countries',
			'locations',
		]),
		query: z.string().optional(),
	})
	.loose();
const personGetContactFilterValuesOutput = FilterValuesResponseOut;
const companyGetCompanyFilterTypesInput = z.object({}).loose();
const companyGetCompanyFilterTypesOutput = FilterTypesDiscoveryResponseOut;
const companyGetCompanyFilterValuesInput = z
	.object({
		filterType: z.enum([
			'names',
			'sizes',
			'revenues',
			'locations',
			'sics',
			'naics',
			'industriesLabels',
			'technologies',
		]),
		query: z.string().optional(),
	})
	.loose();
const companyGetCompanyFilterValuesOutput = FilterValuesResponseOut;
const subscriptionsCreateInput = z
	.object({
		defaults: z
			.object({
				url: z.string().describe('Webhook URL (HTTPS required in production)'),
				entityType: z
					.enum(['contact', 'company'])
					.describe('Default entity type for all subscriptions')
					.optional(),
				signalTypes: z
					.array(z.string())
					.describe('Default signal types for all subscriptions')
					.optional(),
			})
			.loose(),
		name: z.string().describe('Default subscription name prefix').optional(),
		subscriptions: z
			.array(
				z
					.object({
						entityId: z
							.string()
							.describe('Entity ID (always required per item)'),
						entityType: z
							.enum(['contact', 'company'])
							.describe('Overrides default entityType')
							.optional(),
						signalTypes: z
							.array(z.string())
							.describe('Overrides default signalTypes')
							.optional(),
						name: z.string().describe('Overrides default name').optional(),
					})
					.loose(),
			)
			.min(1)
			.max(25)
			.describe('Array of subscriptions to create (max 25)'),
	})
	.loose();
const subscriptionsCreateOutput = CreateSubscriptionResponseOut;
const subscriptionsListInput = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.describe('Maximum number of results (1-100)')
			.optional(),
		offset: z
			.number()
			.int()
			.min(0)
			.describe('Number of results to skip')
			.optional(),
	})
	.loose();
const subscriptionsListOutput = SubscriptionListResponseOut;
const subscriptionsGetInput = z
	.object({
		id: z.string().min(1).describe('Subscription ID'),
	})
	.loose();
const subscriptionsGetOutput = SubscriptionWithoutSecretOut;
const subscriptionsUpdateInput = z
	.object({
		id: z.string().min(1).describe('Subscription ID'),
		signalTypes: z
			.array(z.string())
			.describe('New signal types to subscribe to')
			.optional(),
		url: z.string().describe('New webhook URL').optional(),
		name: z.string().describe('New subscription name').optional(),
		isActive: z.boolean().describe('Enable or disable subscription').optional(),
	})
	.loose();
const subscriptionsUpdateOutput = SubscriptionResponseOut;
const subscriptionsTestInput = z
	.object({
		id: z.string().min(1).describe('Subscription ID'),
		mode: z.enum(['direct', 'kafka', 'full']).describe('Test mode').optional(),
	})
	.loose();
const subscriptionsTestOutput = TestSubscriptionResponseOut;
const subscriptionsDeleteInput = z
	.object({
		ids: z
			.array(z.string())
			.min(1)
			.max(25)
			.describe('Array of subscription IDs to delete'),
	})
	.loose();
const subscriptionsDeleteOutput = DeleteSubscriptionResponseOut;
const auditLogsListInput = z
	.object({
		subscriptionId: z.string().describe('Filter by subscription ID').optional(),
		status: z
			.enum(['success', 'failed', 'permanent_failure'])
			.describe('Filter by delivery status')
			.optional(),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.describe('Maximum number of results (1-100)')
			.optional(),
		offset: z
			.number()
			.int()
			.min(0)
			.describe('Number of results to skip')
			.optional(),
	})
	.loose();
const auditLogsListOutput = AuditLogsResponseOut;
const auditLogsGetStatsInput = z
	.object({
		subscriptionId: z
			.string()
			.describe('Filter statistics by subscription ID')
			.optional(),
	})
	.loose();
const auditLogsGetStatsOutput = AuditLogStatsResponseOut;
const subscriptionsCreateOptOutInput = z
	.object({
		entityType: z
			.enum(['contact'])
			.describe(
				"Entity type for opt-out subscriptions. Currently only 'contact' is supported.",
			),
		url: z
			.string()
			.describe('Your webhook endpoint URL (HTTPS required in production)'),
		name: z
			.string()
			.describe('Descriptive name for this subscription')
			.optional(),
	})
	.loose();
const subscriptionsCreateOptOutOutput = OptOutSubscriptionResponseOut;
const conversationsSearchInput = z
	.object({
		query: z
			.string()
			.describe(
				'Free-text search over transcript content. When present, the structural filters below are ignored.',
			)
			.optional(),
		conversationIds: z
			.array(z.string())
			.min(1)
			.max(100)
			.describe(
				"Return only these conversations. IDs that don't exist, are still processing, or belong to another account are omitted from the response rather than erroring.",
			)
			.optional(),
		dateFrom: z
			.string()
			.describe('Earliest meeting date, inclusive (YYYY-MM-DD).')
			.optional(),
		dateTo: z
			.string()
			.describe('Latest meeting date, inclusive (YYYY-MM-DD).')
			.optional(),
		contactNames: z
			.array(z.string())
			.describe(
				'Partial, case-insensitive match on participant names. Multiple values are ORed.',
			)
			.optional(),
		companyDomains: z
			.array(z.string())
			.describe(
				'Company domains of the external participants (e.g. acme.com). Matches on domain, not display name. Multiple values are ORed.',
			)
			.optional(),
		meetingTitles: z
			.array(z.string())
			.describe(
				'Partial, case-insensitive match on the meeting title. Multiple values are ORed.',
			)
			.optional(),
		page: z
			.number()
			.int()
			.min(1)
			.describe('Page number, starting at 1.')
			.optional(),
		pageSize: z
			.number()
			.int()
			.min(1)
			.max(100)
			.describe(
				'Conversations per page. Values above 100 are rejected with 400 (not silently clamped).',
			)
			.optional(),
	})
	.loose();
const conversationsSearchOutput = V3ConversationsSearchResponseOut;
const conversationsGetTranscriptInput = z
	.object({
		conversationId: z
			.string()
			.min(1)
			.describe('Conversation identifier returned by Search Conversations.'),
	})
	.loose();
const conversationsGetTranscriptOutput = V3ConversationTranscriptResponseOut;

export const LushaSpecInputSchemas = {
	personProspectContacts: personProspectContactsInput,
	companyProspectCompanies: companyProspectCompaniesInput,
	personGetContactLookalikes: personGetContactLookalikesInput,
	companyGetCompanyLookalikes: companyGetCompanyLookalikesInput,
	personGetContactRecommendations: personGetContactRecommendationsInput,
	companyGetCompanyRecommendations: companyGetCompanyRecommendationsInput,
	personGetContactRecommendationFilters:
		personGetContactRecommendationFiltersInput,
	companyGetCompanyRecommendationFilters:
		companyGetCompanyRecommendationFiltersInput,
	personGetBuyingGroup: personGetBuyingGroupInput,
	contactTablesCreate: contactTablesCreateInput,
	contactTablesList: contactTablesListInput,
	contactTablesGetColumnCatalog: contactTablesGetColumnCatalogInput,
	contactTablesGet: contactTablesGetInput,
	contactTablesUpdate: contactTablesUpdateInput,
	contactTablesDelete: contactTablesDeleteInput,
	contactTablesListEntities: contactTablesListEntitiesInput,
	contactTablesAddEntities: contactTablesAddEntitiesInput,
	contactTablesRemoveEntities: contactTablesRemoveEntitiesInput,
	contactTablesListColumns: contactTablesListColumnsInput,
	contactTablesAddColumns: contactTablesAddColumnsInput,
	contactTablesRemoveColumn: contactTablesRemoveColumnInput,
	contactTablesRunColumn: contactTablesRunColumnInput,
	companyTablesCreate: companyTablesCreateInput,
	companyTablesList: companyTablesListInput,
	companyTablesGetColumnCatalog: companyTablesGetColumnCatalogInput,
	companyTablesGet: companyTablesGetInput,
	companyTablesUpdate: companyTablesUpdateInput,
	companyTablesDelete: companyTablesDeleteInput,
	companyTablesListEntities: companyTablesListEntitiesInput,
	companyTablesAddEntities: companyTablesAddEntitiesInput,
	companyTablesRemoveEntities: companyTablesRemoveEntitiesInput,
	companyTablesRemoveColumn: companyTablesRemoveColumnInput,
	companyTablesRunColumn: companyTablesRunColumnInput,
	personGetContactSignals: personGetContactSignalsInput,
	companyGetCompanySignals: companyGetCompanySignalsInput,
	personGetContactSignalTypes: personGetContactSignalTypesInput,
	companyGetCompanySignalTypes: companyGetCompanySignalTypesInput,
	companyGetCompanySignalFilters: companyGetCompanySignalFiltersInput,
	companyGetCompanySignalFilterValues: companyGetCompanySignalFilterValuesInput,
	companyGetCompanySignalScores: companyGetCompanySignalScoresInput,
	personGetContactSignalScores: personGetContactSignalScoresInput,
	icpListProfiles: icpListProfilesInput,
	companyGetCompanyIcpFitScores: companyGetCompanyIcpFitScoresInput,
	personGetContactIcpFitScores: personGetContactIcpFitScoresInput,
	companyGetWebsiteVisits: companyGetWebsiteVisitsInput,
	personGetContactFilterTypes: personGetContactFilterTypesInput,
	personGetContactFilterValues: personGetContactFilterValuesInput,
	companyGetCompanyFilterTypes: companyGetCompanyFilterTypesInput,
	companyGetCompanyFilterValues: companyGetCompanyFilterValuesInput,
	subscriptionsCreate: subscriptionsCreateInput,
	subscriptionsList: subscriptionsListInput,
	subscriptionsGet: subscriptionsGetInput,
	subscriptionsUpdate: subscriptionsUpdateInput,
	subscriptionsTest: subscriptionsTestInput,
	subscriptionsDelete: subscriptionsDeleteInput,
	auditLogsList: auditLogsListInput,
	auditLogsGetStats: auditLogsGetStatsInput,
	subscriptionsCreateOptOut: subscriptionsCreateOptOutInput,
	conversationsSearch: conversationsSearchInput,
	conversationsGetTranscript: conversationsGetTranscriptInput,
} as const;

export const LushaSpecOutputSchemas = {
	personProspectContacts: personProspectContactsOutput,
	companyProspectCompanies: companyProspectCompaniesOutput,
	personGetContactLookalikes: personGetContactLookalikesOutput,
	companyGetCompanyLookalikes: companyGetCompanyLookalikesOutput,
	personGetContactRecommendations: personGetContactRecommendationsOutput,
	companyGetCompanyRecommendations: companyGetCompanyRecommendationsOutput,
	personGetContactRecommendationFilters:
		personGetContactRecommendationFiltersOutput,
	companyGetCompanyRecommendationFilters:
		companyGetCompanyRecommendationFiltersOutput,
	personGetBuyingGroup: personGetBuyingGroupOutput,
	contactTablesCreate: contactTablesCreateOutput,
	contactTablesList: contactTablesListOutput,
	contactTablesGetColumnCatalog: contactTablesGetColumnCatalogOutput,
	contactTablesGet: contactTablesGetOutput,
	contactTablesUpdate: contactTablesUpdateOutput,
	contactTablesDelete: contactTablesDeleteOutput,
	contactTablesListEntities: contactTablesListEntitiesOutput,
	contactTablesAddEntities: contactTablesAddEntitiesOutput,
	contactTablesRemoveEntities: contactTablesRemoveEntitiesOutput,
	contactTablesListColumns: contactTablesListColumnsOutput,
	contactTablesAddColumns: contactTablesAddColumnsOutput,
	contactTablesRemoveColumn: contactTablesRemoveColumnOutput,
	contactTablesRunColumn: contactTablesRunColumnOutput,
	companyTablesCreate: companyTablesCreateOutput,
	companyTablesList: companyTablesListOutput,
	companyTablesGetColumnCatalog: companyTablesGetColumnCatalogOutput,
	companyTablesGet: companyTablesGetOutput,
	companyTablesUpdate: companyTablesUpdateOutput,
	companyTablesDelete: companyTablesDeleteOutput,
	companyTablesListEntities: companyTablesListEntitiesOutput,
	companyTablesAddEntities: companyTablesAddEntitiesOutput,
	companyTablesRemoveEntities: companyTablesRemoveEntitiesOutput,
	companyTablesRemoveColumn: companyTablesRemoveColumnOutput,
	companyTablesRunColumn: companyTablesRunColumnOutput,
	personGetContactSignals: personGetContactSignalsOutput,
	companyGetCompanySignals: companyGetCompanySignalsOutput,
	personGetContactSignalTypes: personGetContactSignalTypesOutput,
	companyGetCompanySignalTypes: companyGetCompanySignalTypesOutput,
	companyGetCompanySignalFilters: companyGetCompanySignalFiltersOutput,
	companyGetCompanySignalFilterValues:
		companyGetCompanySignalFilterValuesOutput,
	companyGetCompanySignalScores: companyGetCompanySignalScoresOutput,
	personGetContactSignalScores: personGetContactSignalScoresOutput,
	icpListProfiles: icpListProfilesOutput,
	companyGetCompanyIcpFitScores: companyGetCompanyIcpFitScoresOutput,
	personGetContactIcpFitScores: personGetContactIcpFitScoresOutput,
	companyGetWebsiteVisits: companyGetWebsiteVisitsOutput,
	personGetContactFilterTypes: personGetContactFilterTypesOutput,
	personGetContactFilterValues: personGetContactFilterValuesOutput,
	companyGetCompanyFilterTypes: companyGetCompanyFilterTypesOutput,
	companyGetCompanyFilterValues: companyGetCompanyFilterValuesOutput,
	subscriptionsCreate: subscriptionsCreateOutput,
	subscriptionsList: subscriptionsListOutput,
	subscriptionsGet: subscriptionsGetOutput,
	subscriptionsUpdate: subscriptionsUpdateOutput,
	subscriptionsTest: subscriptionsTestOutput,
	subscriptionsDelete: subscriptionsDeleteOutput,
	auditLogsList: auditLogsListOutput,
	auditLogsGetStats: auditLogsGetStatsOutput,
	subscriptionsCreateOptOut: subscriptionsCreateOptOutOutput,
	conversationsSearch: conversationsSearchOutput,
	conversationsGetTranscript: conversationsGetTranscriptOutput,
} as const;

export type LushaSpecInputs = {
	[K in keyof typeof LushaSpecInputSchemas]: z.input<
		(typeof LushaSpecInputSchemas)[K]
	>;
};

export type LushaSpecOutputs = {
	[K in keyof typeof LushaSpecOutputSchemas]: z.infer<
		(typeof LushaSpecOutputSchemas)[K]
	>;
};
