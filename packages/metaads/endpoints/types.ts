import { z } from 'zod';

const id = z.string().min(1);
const fields = z.string().min(1).optional();
const cursor = z.string().min(1).optional();
const pageSize = z.number().int().positive().optional();
const listOptions = {
	fields,
	limit: pageSize,
	after: cursor,
	before: cursor,
};
const cursorOptions = { limit: pageSize, after: cursor, before: cursor };
const status = z.enum(['ACTIVE', 'PAUSED', 'DELETED', 'ARCHIVED']);
const budget = z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);

// Meta objects have a large, versioned set of optional fields. `passthrough`
// keeps documented forward-compatible response fields while validating IDs.
export const MetaAdsObjectSchema = z
	.object({
		id: z.string(),
		account_id: z.string().optional(),
		name: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		configured_status: z.string().nullable().optional(),
		effective_status: z.string().nullable().optional(),
	})
	.passthrough();

const MetaAdsPagingSchema = z.object({
	cursors: z
		.object({ before: z.string().optional(), after: z.string().optional() })
		.optional(),
	hasNextPage: z.boolean(),
});

export const MetaAdsListSchema = z.object({
	data: z.array(MetaAdsObjectSchema),
	paging: MetaAdsPagingSchema.optional(),
});

const StudyActorSchema = z
	.object({ id: z.string(), name: z.string().optional() })
	.passthrough();
const AdRuleSchema = z
	.object({
		id: z.string(),
		account_id: z.string().optional(),
		created_by: StudyActorSchema.optional(),
		created_time: z.string().optional(),
		disable_error_code: z.number().int().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		updated_time: z.string().optional(),
	})
	.passthrough();
const AdRuleListSchema = z.object({
	data: z.array(AdRuleSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AdStudySchema = z
	.object({
		id: z.string(),
		business: StudyActorSchema.nullable().optional(),
		canceled_time: z.string().nullable().optional(),
		cooldown_start_time: z.string().nullable().optional(),
		created_by: StudyActorSchema.nullable().optional(),
		created_time: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		end_time: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		observation_end_time: z.string().nullable().optional(),
		results_first_available_date: z.string().nullable().optional(),
		start_time: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		updated_by: StudyActorSchema.nullable().optional(),
		updated_time: z.string().nullable().optional(),
	})
	.passthrough();
const AdStudyListSchema = z.object({
	data: z.array(AdStudySchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const StudyViewersListSchema = z.object({
	data: z.array(StudyActorSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AdPreviewSchema = z.object({ body: z.string() }).strict();
const AdPreviewsListSchema = z.object({
	data: z.array(AdPreviewSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const CreativeInsightValueSchema = z
	.object({ key: z.string(), value: z.string() })
	.passthrough();
const CreativeInsightsSchema = z
	.object({ aesthetics: z.array(CreativeInsightValueSchema).optional() })
	.passthrough();
const CreativeInsightsListSchema = z.object({
	data: z.array(CreativeInsightsSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const AudienceAdAccountSchema = z.object({ id: z.string() }).strict();
const AudienceAdAccountsListSchema = z.object({
	data: z.array(AudienceAdAccountSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const StudyCreateSchema = z
	.object({
		id: z.string(),
		cell_ids: z.array(z.string()).optional(),
		objective_ids: z.array(z.string()).optional(),
	})
	.passthrough();
const StudyUpdateSchema = z
	.object({
		success: z.boolean(),
		cell_ids: z.array(z.string()).optional(),
		objective_ids: z.array(z.string()).optional(),
	})
	.passthrough();

export const MetaAdsMutationSchema = z
	.object({ id: z.string().optional(), success: z.boolean().optional() })
	.refine((value) => value.id !== undefined || value.success !== undefined);

export const MetaAdsDeleteSchema = z.object({ success: z.boolean() });

export const AccountListInputSchema = z
	.object({
		fields,
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
export const AccountGetInputSchema = z
	.object({ accountId: id, fields })
	.strict();
export const AccountSchema = MetaAdsObjectSchema;

export const AccountUsersListSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			name: z.string().optional(),
			tasks: z.array(z.string()).optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging,
});

// AdImage adds documented fields over time; validate known fields and pass through the rest.
const AdImageSchema = z
	.object({
		hash: z.string(),
		id: z.string().optional(),
		account_id: z.string().optional(),
		created_time: z.string().optional(),
		creatives: z.array(z.string()).optional(),
		height: z.number().int().optional(),
		name: z.string().optional(),
		original_height: z.number().int().optional(),
		original_width: z.number().int().optional(),
		permalink_url: z.string().optional(),
		status: z.enum(['ACTIVE', 'INTERNAL', 'DELETED']).optional(),
		updated_time: z.string().optional(),
		url: z.string().optional(),
		url_128: z.string().optional(),
		width: z.number().int().optional(),
	})
	.passthrough();
const AdImagesListSchema = z.object({
	data: z.array(AdImageSchema),
	paging: MetaAdsListSchema.shape.paging,
	summary: z.object({ total_count: z.number().int().optional() }).optional(),
});
const AdImageListInput = z
	.object({
		accountId: id,
		name: z.string().min(1).optional(),
		hashes: z.array(z.string().min(1)).min(1).optional(),
		minHeight: z.number().int().positive().optional(),
		minWidth: z.number().int().positive().optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const AdImageBase64 = z
	.string()
	.min(4)
	.regex(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/);
const AdImageUploadInput = z.union([
	z.object({ accountId: id, bytes: AdImageBase64 }).strict(),
	z
		.object({
			accountId: id,
			copyFrom: z
				.object({ sourceAccountId: id, hash: z.string().min(1) })
				.strict(),
		})
		.strict(),
]);
const AdImageUploadSchema = z.object({
	images: z.record(
		z.string(),
		z.object({
			hash: z.string(),
			url: z.string().optional(),
			url_128: z.string().optional(),
			url_256: z.string().optional(),
			url_256_height: z.number().int().optional(),
			url_256_width: z.number().int().optional(),
			height: z.number().int().optional(),
			width: z.number().int().optional(),
			name: z.string().optional(),
		}),
	),
});
const AdImageDeleteInput = z
	.object({ accountId: id, hash: z.string().min(1), imageId: id.optional() })
	.strict();

const accountListInput = AccountListInputSchema;
const accountListOutput = MetaAdsListSchema;
const accountGetInput = AccountGetInputSchema;
const accountGetOutput = AccountSchema;
const accountUsersListInput = z
	.object({ accountId: id, limit: pageSize, after: cursor, before: cursor })
	.strict();
const accountActivitiesListInput = z.object({ accountId: id }).strict();
// Meta documents an evolving event_type catalog; event records retain only documented fields plus forward-compatible JSON.
const AccountActivitySchema = z
	.object({
		actor_id: z.string().optional(),
		actor_name: z.string().optional(),
		application_id: z.string().optional(),
		application_name: z.string().optional(),
		date_time_in_timezone: z.string().optional(),
		event_time: z.string().optional(),
		event_type: z.string(),
		extra_data: z.string().optional(),
		object_id: z.string().optional(),
		object_name: z.string().optional(),
		object_type: z.string().optional(),
		translated_event_type: z.string().optional(),
	})
	.passthrough();
export const AccountActivitiesListSchema = z.object({
	data: z.array(AccountActivitySchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const BroadTargetingCategoriesListSchema = z.object({
	data: z.array(
		z.object({
			id: z.union([z.string(), z.number().int()]),
			name: z.string(),
			parent_category: z.string().optional(),
			size_lower_bound: z.number().int().optional(),
			size_upper_bound: z.number().int().optional(),
			type: z.number().int().optional(),
			type_name: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const videosDeleteInput = z.object({ accountId: id, videoId: id }).strict();

const adLabelListInput = z.object({ accountId: id, ...cursorOptions }).strict();
const adLabelGetInput = z.object({ labelId: id, fields }).strict();
const adLabelCreateInput = z
	.object({ accountId: id, name: z.string().min(1) })
	.strict();
const adLabelUpdateInput = z
	.object({ labelId: id, name: z.string().min(1) })
	.strict();
const adLabelDeleteInput = z.object({ labelId: id }).strict();
const adLabelReferenceInput = z.union([
	z.object({ id }).strict(),
	z.object({ name: z.string().min(1) }).strict(),
]);
const labelAssociationFields = {
	adlabels: z.array(adLabelReferenceInput).min(1).max(50),
	executionOptions: z.array(z.literal('validate_only')).optional(),
};
const campaignLabelsAddInput = z
	.object({ campaignId: id, ...labelAssociationFields })
	.strict();
const adLabelsAddInput = z
	.object({ adId: id, ...labelAssociationFields })
	.strict();
const creativeLabelsAddInput = z
	.object({ creativeId: id, adlabels: labelAssociationFields.adlabels })
	.strict();
const adLabelCampaignsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelAdSetsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelAdsListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const adLabelCreativesListInput = z
	.object({ labelId: id, ...cursorOptions })
	.strict();
const AdLabelAssociationSchema = z.object({ success: z.boolean() });
const AdLabelSchema = z
	.object({
		id: id,
		name: z.string().optional(),
		created_time: z.string().optional(),
		updated_time: z.string().optional(),
	})
	.passthrough();
const AdLabelsListSchema = z.object({
	data: z.array(AdLabelSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
	summary: z.object({ total_count: z.number().int().optional() }).optional(),
});

const campaignListInput = z.object({ accountId: id, ...listOptions }).strict();
const campaignAdSetsListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const campaignAdsListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const campaignCopiesListInput = z
	.object({ campaignId: id, ...listOptions })
	.strict();
const renameOptionsInput = z
	.object({
		renameStrategy: z
			.enum(['DEEP_RENAME', 'ONLY_TOP_LEVEL_RENAME', 'NO_RENAME'])
			.optional(),
		renamePrefix: z.string().max(100).optional(),
		renameSuffix: z.string().max(100).optional(),
	})
	.strict();
const campaignCopyInput = z
	.object({ campaignId: id, renameOptions: renameOptionsInput.optional() })
	.strict();
const budgetScheduleRange = z.union([
	z.number().int().positive(),
	z.string().min(1),
]);
const campaignBudgetSchedulesListInput = z
	.object({
		campaignId: id,
		timeStart: budgetScheduleRange.optional(),
		timeStop: budgetScheduleRange.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const campaignBudgetScheduleCreateInput = z
	.object({
		campaignId: id,
		budgetValue: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		budgetValueType: z.enum(['ABSOLUTE', 'MULTIPLIER']),
		timeStart: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		timeEnd: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	})
	.strict()
	.refine((value) => value.timeEnd > value.timeStart)
	.refine((value) => value.timeEnd - value.timeStart >= 10_800);
const campaignGetInput = z.object({ campaignId: id, fields }).strict();
const campaignAdStudiesListInput = z
	.object({ campaignId: id, ...cursorOptions })
	.strict();
const accountImpactingAdStudiesListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountAdRulesLibraryListInput = z
	.object({ accountId: id, ...cursorOptions })
	.strict();
const accountActiveAdRulesListInput = z
	.object({
		accountId: id,
		selectedIds: z.array(id).min(1),
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const accountBroadTargetingCategoriesListInput = z
	.object({ accountId: id, customCategoriesOnly: z.boolean().optional() })
	.strict();
const campaignAdRulesGovernedListInput = z
	.object({
		campaignId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const adSetAdRulesGovernedListInput = z
	.object({
		adSetId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
const studyGetInput = z.object({ studyId: id, fields }).strict();
const studyRelatedAccountsListInput = z.object({ studyId: id }).strict();
const studyViewersListInput = z.object({ studyId: id }).strict();
const studyCellInput = z
	.object({
		name: z.string().min(1),
		treatmentPercentage: z.number().min(10).max(100),
		controlPercentage: z.number().min(0).max(100).optional(),
		adSetIds: z.array(id).min(1),
	})
	.strict();
const studyCreateInput = z
	.object({
		businessId: id,
		name: z.string().min(1),
		description: z.string().optional(),
		startTime: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		endTime: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		type: z.literal('SPLIT_TEST'),
		cells: z.array(studyCellInput).min(2),
	})
	.strict()
	.refine((value) => value.endTime > value.startTime)
	.refine(
		(value) =>
			value.cells.reduce(
				(total, cell) => total + cell.treatmentPercentage,
				0,
			) <= 100,
	);
const studyUpdateInput = z
	.object({
		studyId: id,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		endTime: z
			.number()
			.int()
			.positive()
			.max(Number.MAX_SAFE_INTEGER)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			value.name !== undefined ||
			value.description !== undefined ||
			value.endTime !== undefined,
	);
const budgetScheduleGetInput = z.object({ periodId: id, fields }).strict();
const campaignCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		objective: z.enum([
			'OUTCOME_AWARENESS',
			'OUTCOME_ENGAGEMENT',
			'OUTCOME_LEADS',
			'OUTCOME_SALES',
			'OUTCOME_TRAFFIC',
			'OUTCOME_APP_PROMOTION',
			'APP_INSTALLS',
			'BRAND_AWARENESS',
			'CONVERSIONS',
			'LEAD_GENERATION',
			'LINK_CLICKS',
			'REACH',
			'VIDEO_VIEWS',
		]),
		specialAdCategories: z.array(
			z.enum([
				'NONE',
				'EMPLOYMENT',
				'HOUSING',
				'CREDIT',
				'ISSUES_ELECTIONS_POLITICS',
				'ONLINE_GAMBLING_AND_GAMING',
				'FINANCIAL_PRODUCTS_SERVICES',
			]),
		),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	);
const campaignUpdateInput = z
	.object({
		campaignId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		spendCap: budget.optional(),
	})
	.strict()
	.refine((value) => Object.keys(value).some((key) => key !== 'campaignId'));

const adSetListInput = z.object({ accountId: id, ...listOptions }).strict();
const adSetAdsListInput = z.object({ adSetId: id, ...listOptions }).strict();
const adSetAdCreativesListInput = z.object({ adSetId: id }).strict();
const adSetCopiesListInput = z.object({ adSetId: id, ...listOptions }).strict();
const adSetCopyInput = z
	.object({
		adSetId: id,
		campaignId: id.optional(),
		renameOptions: renameOptionsInput.optional(),
	})
	.strict();
const adSetBudgetSchedulesListInput = z
	.object({
		adSetId: id,
		timeStart: budgetScheduleRange.optional(),
		timeStop: budgetScheduleRange.optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const adSetBudgetScheduleCreateInput = z
	.object({
		adSetId: id,
		budgetValue: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		budgetValueType: z.enum(['ABSOLUTE', 'MULTIPLIER']),
		timeStart: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		timeEnd: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
	})
	.strict()
	.refine((value) => value.timeEnd > value.timeStart)
	.refine((value) => value.timeEnd - value.timeStart >= 10_800);
const adSetGetInput = z.object({ adSetId: id, fields }).strict();
const adSetActivitiesListInput = z
	.object({
		adSetId: id,
		after: cursor,
		businessId: id.optional(),
		category: z
			.enum([
				'ACCOUNT',
				'AD',
				'AD_KEYWORDS',
				'AD_SET',
				'AUDIENCE',
				'BID',
				'BUDGET',
				'CAMPAIGN',
				'DATE',
				'STATUS',
				'TARGETING',
			])
			.optional(),
		limit: pageSize,
		since: z.string().min(1).optional(),
		uid: z.number().int().positive().optional(),
		until: z.string().min(1).optional(),
	})
	.strict();
const adSetAdStudiesListInput = z
	.object({ adSetId: id, ...cursorOptions })
	.strict();
// `unknown` is necessary because targeting contains provider-defined nested, versioned JSON keys.
const targeting = z.record(z.string(), z.unknown());
const adSetCreateInput = z
	.object({
		accountId: id,
		campaignId: id,
		name: z.string().min(1),
		optimizationGoal: z.enum([
			'NONE',
			'APP_INSTALLS',
			'AD_RECALL_LIFT',
			'ENGAGED_USERS',
			'EVENT_RESPONSES',
			'IMPRESSIONS',
			'LEAD_GENERATION',
			'QUALITY_LEAD',
			'LINK_CLICKS',
			'OFFSITE_CONVERSIONS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'QUALITY_CALL',
			'REACH',
			'LANDING_PAGE_VIEWS',
			'VISIT_INSTAGRAM_PROFILE',
			'ENGAGED_PAGE_VIEWS',
			'VALUE',
			'THRUPLAY',
			'DERIVED_EVENTS',
			'APP_INSTALLS_AND_OFFSITE_CONVERSIONS',
			'CONVERSATIONS',
			'IN_APP_VALUE',
			'MESSAGING_PURCHASE_CONVERSION',
			'MESSAGING_DEEP_CONVERSATION_AND_FOLLOW',
			'SUBSCRIBERS',
			'REMINDERS_SET',
			'MEANINGFUL_CALL_ATTEMPT',
			'PROFILE_VISIT',
			'PROFILE_AND_PAGE_ENGAGEMENT',
			'ADVERTISER_SILOED_VALUE',
			'AUTOMATIC_OBJECTIVE',
			'MESSAGING_APPOINTMENT_CONVERSION',
		]),
		billingEvent: z.enum([
			'APP_INSTALLS',
			'CLICKS',
			'IMPRESSIONS',
			'LINK_CLICKS',
			'NONE',
			'OFFER_CLAIMS',
			'PAGE_LIKES',
			'POST_ENGAGEMENT',
			'THRUPLAY',
			'PURCHASE',
			'LISTING_INTERACTION',
		]),
		targeting,
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			!(value.dailyBudget !== undefined && value.lifetimeBudget !== undefined),
	)
	.refine(
		(value) =>
			value.lifetimeBudget === undefined || value.endTime !== undefined,
	);
const adSetUpdateInput = z
	.object({
		adSetId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
		dailyBudget: budget.optional(),
		lifetimeBudget: budget.optional(),
		endTime: z.string().optional(),
	})
	.strict()
	.refine((value) => Object.keys(value).some((key) => key !== 'adSetId'));

const adListInput = z.object({ accountId: id, ...listOptions }).strict();
const adAdCreativesListInput = z.object({ adId: id }).strict();
const adCopiesListInput = z.object({ adId: id, ...listOptions }).strict();
const adCopyInput = z
	.object({
		adId: id,
		adSetId: id.optional(),
		renameOptions: renameOptionsInput.optional(),
	})
	.strict();
const adGetInput = z.object({ adId: id, fields }).strict();
const adAdStudiesListInput = z.object({ adId: id, ...cursorOptions }).strict();
const adAdRulesGovernedListInput = z
	.object({
		adId: id,
		passEvaluation: z.boolean().optional(),
		...cursorOptions,
	})
	.strict();
// Nested content fields are provider-defined JSON objects with versioned documented subfields.
const creativeStoryContent = z.record(z.string(), z.unknown());
const creativeObjectStorySpec = z
	.object({
		page_id: id,
		link_data: creativeStoryContent.optional(),
		photo_data: creativeStoryContent.optional(),
		video_data: creativeStoryContent.optional(),
		text_data: creativeStoryContent.optional(),
		template_data: creativeStoryContent.optional(),
	})
	.strict()
	.refine(
		(value) =>
			[
				value.link_data,
				value.photo_data,
				value.video_data,
				value.text_data,
				value.template_data,
			].filter((spec) => spec !== undefined).length === 1,
	);
const creativeAuthorizationCategory = z.enum([
	'POLITICAL',
	'POLITICAL_WITH_DIGITALLY_CREATED_MEDIA',
]);
const adCreateInput = z
	.object({
		accountId: id,
		adSetId: id,
		name: z.string().min(1),
		creativeId: id.optional(),
		creativeSpec: z
			.object({
				name: z.string().min(1).max(100),
				objectStorySpec: creativeObjectStorySpec,
				authorizationCategory: creativeAuthorizationCategory.optional(),
			})
			.strict()
			.optional(),
		status: z.enum(['ACTIVE', 'PAUSED']).optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.creativeId === undefined) !== (value.creativeSpec === undefined),
	);
const adUpdateInput = z
	.object({
		adId: id,
		name: z.string().min(1).optional(),
		status: status.optional(),
	})
	.strict()
	.refine((value) => value.name !== undefined || value.status !== undefined);

const creativeListInput = z.object({ accountId: id, ...listOptions }).strict();
const creativeGetInput = z.object({ creativeId: id, fields }).strict();
const creativeCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1).max(100),
		objectStoryId: id.optional(),
		objectStorySpec: creativeObjectStorySpec.optional(),
		authorizationCategory: creativeAuthorizationCategory.optional(),
		idempotencyKey: z
			.string()
			.regex(/^[A-Za-z0-9_-]{1,128}$/)
			.optional(),
	})
	.strict()
	.refine(
		(value) =>
			(value.objectStoryId === undefined) !==
			(value.objectStorySpec === undefined),
	);
const creativeUpdateInput = z
	.object({ creativeId: id, name: z.string().min(1).max(100) })
	.strict();
const creativeDeleteInput = z.object({ creativeId: id }).strict();
const creativeInsightsListInput = z.object({ creativeId: id }).strict();
const previewAdFormat = z.enum([
	'DESKTOP_FEED_STANDARD',
	'MOBILE_FEED_STANDARD',
	'RIGHT_COLUMN_STANDARD',
	'INSTAGRAM_STANDARD',
	'INSTAGRAM_STORY',
	'FACEBOOK_STORY_MOBILE',
	'INSTAGRAM_REELS',
]);
const accountGeneratePreviewsInput = z
	.object({
		accountId: id,
		adFormat: previewAdFormat,
		creativeSpec: z
			.object({ objectStorySpec: creativeObjectStorySpec })
			.strict(),
	})
	.strict();
const creativePreviewsListInput = z
	.object({
		creativeId: id,
		adFormat: previewAdFormat,
		creativeFeature: z
			.enum([
				'ig_video_native_subtitle',
				'image_animation',
				'product_browsing',
				'product_metadata_automation',
				'profile_card',
				'standard_enhancements_catalog',
				'text_overlay_translation',
			])
			.optional(),
		dynamicAssetLabel: z.string().min(1).optional(),
		productItemIds: z.array(id).min(1).optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
	})
	.strict();
const adsPreviewsListInput = z
	.object({
		adId: id,
		adFormat: previewAdFormat,
		creativeFeature: z
			.enum([
				'ig_video_native_subtitle',
				'image_animation',
				'product_browsing',
				'product_metadata_automation',
				'profile_card',
				'standard_enhancements_catalog',
				'text_overlay_translation',
			])
			.optional(),
		dynamicAssetLabel: z.string().min(1).optional(),
		productItemIds: z.array(id).min(1).optional(),
		startDate: z.string().datetime().optional(),
		endDate: z.string().datetime().optional(),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
	})
	.strict();

const audienceListInput = z.object({ accountId: id, ...listOptions }).strict();
const audienceAdAccountsListInput = z
	.object({
		audienceId: id,
		permissions: z.enum(['targeting', 'targeting_and_insights']).optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const audienceAdsListInput = z
	.object({ audienceId: id, ...listOptions })
	.strict();
const audienceGetInput = z.object({ audienceId: id, fields }).strict();
const audienceCreateInput = z
	.object({
		accountId: id,
		name: z.string().min(1),
		description: z.string().optional(),
		customerFileSource: z
			.enum([
				'USER_PROVIDED_ONLY',
				'PARTNER_PROVIDED_ONLY',
				'BOTH_USER_AND_PARTNER_PROVIDED',
			])
			.optional(),
		subtype: z.literal('CUSTOM').default('CUSTOM'),
	})
	.strict();
const audienceUpdateInput = z
	.object({
		audienceId: id,
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	})
	.strict()
	.refine(
		(value) => value.name !== undefined || value.description !== undefined,
	);
const audienceDeleteInput = z.object({ audienceId: id }).strict();
const audienceAccountsShareInput = z
	.object({
		audienceId: id,
		adAccountIds: z.array(id).min(1),
		permissions: z.enum(['targeting', 'targeting_and_insights']),
		replace: z.boolean().optional(),
	})
	.strict();
const audienceAccountsUnshareInput = z
	.object({ audienceId: id, adAccountIds: z.array(id).min(1) })
	.strict();
const AudienceSharingSchema = z.object({
	success: z.boolean(),
	sharing_data: z.array(
		z.object({
			ad_acct_id: z.string(),
			business_id: z.union([z.string(), z.number().int()]).optional(),
			audience_share_status: z.string().optional(),
			errors: z.array(z.string()).optional(),
		}),
	),
});
const audienceSessionsListInput = z
	.object({
		audienceId: id,
		sessionId: z.number().int().positive().optional(),
		limit: pageSize,
		after: cursor,
		before: cursor,
	})
	.strict();
const audienceSessionsListOutput = z.object({
	data: z.array(
		z.object({
			end_time: z.string().optional(),
			num_invalid_entries: z.string().optional(),
			num_matched: z.string().optional(),
			num_received: z.string().optional(),
			progress: z.string().optional(),
			session_id: z.string().optional(),
			stage: z.string().optional(),
			start_time: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging,
});
const audienceMemberSchema = z.enum(['EMAIL_SHA256', 'PHONE_SHA256']);
const sha256Hash = z.string().regex(/^[a-f0-9]{64}$/);
const audienceUsersAddInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
		sessionId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		batchSequence: z.number().int().positive(),
		lastBatch: z.boolean(),
		estimatedTotal: z.number().int().nonnegative().optional(),
	})
	.strict();
const audienceUsersReplaceInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
		sessionId: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
		batchSequence: z.number().int().positive(),
		lastBatch: z.boolean(),
		estimatedTotal: z.number().int().nonnegative().optional(),
	})
	.strict();
const audienceUsersRemoveInput = z
	.object({
		audienceId: id,
		schema: audienceMemberSchema,
		hashes: z.array(sha256Hash).min(1).max(10_000),
	})
	.strict();
const audienceUsersResultSchema = z.object({
	audience_id: z.string(),
	session_id: z.union([z.string(), z.number().int()]),
	num_received: z.number().int(),
	num_invalid_entries: z.number().int(),
	// invalid_entry_samples can echo submitted identifiers, so it is intentionally stripped.
});

const insightFields = z
	.array(
		z.enum([
			'impressions',
			'reach',
			'frequency',
			'spend',
			'clicks',
			'inline_link_clicks',
			'cpc',
			'cpm',
			'ctr',
			'inline_link_click_ctr',
			'outbound_clicks',
			'unique_clicks',
			'unique_impressions',
			'actions',
			'action_values',
			'cost_per_action_type',
			'ad_name',
			'campaign_name',
			'adset_name',
			'objective',
			'optimization_goal',
			'publisher_platform',
			'platform_position',
			'device_platform',
			'age',
			'gender',
			'country',
			'region',
			'hourly_stats_aggregated_by_advertiser_time_zone',
			'hourly_stats_aggregated_by_audience_time_zone',
			'date_start',
			'date_stop',
			'account_id',
			'campaign_id',
			'adset_id',
			'ad_id',
		]),
	)
	.min(1);
const insightBreakdown = z.enum([
	'action_device',
	'action_canvas_component_name',
	'action_carousel_card_id',
	'action_carousel_card_name',
	'action_destination',
	'action_reaction',
	'action_target_id',
	'action_type',
	'action_video_sound',
	'action_video_type',
	'ad_format_asset',
	'age',
	'app_id',
	'body_asset',
	'call_to_action_asset',
	'country',
	'creative_automation_asset_id',
	'description_asset',
	'device_platform',
	'dma',
	'frequency_value',
	'gender',
	'hourly_stats_aggregated_by_advertiser_time_zone',
	'hourly_stats_aggregated_by_audience_time_zone',
	'image_asset',
	'impression_device',
	'link_url_asset',
	'pa_creator_ig_handle',
	'place_page_id',
	'platform_position',
	'product_id',
	'publisher_platform',
	'region',
	'skan_campaign_id',
	'skan_conversion_id',
	'title_asset',
	'user_segment_key',
	'video_asset',
]);
const insightActionBreakdown = z.enum([
	'action_device',
	'action_canvas_component_name',
	'action_carousel_card_id',
	'action_carousel_card_name',
	'action_destination',
	'action_reaction',
	'action_target_id',
	'action_type',
	'action_video_sound',
	'action_video_type',
]);
const insightAttributionWindow = z.enum([
	'1d_view',
	'7d_view',
	'28d_view',
	'1d_click',
	'7d_click',
	'28d_click',
	'1d_ev',
	'dda',
	'default',
	'7d_view_first_conversion',
	'28d_view_first_conversion',
	'7d_view_all_conversions',
	'28d_view_all_conversions',
	'skan_view',
	'skan_click',
	'skan_click_second_postback',
	'skan_view_second_postback',
	'skan_click_third_postback',
	'skan_view_third_postback',
	'incrementality',
	'custom',
	'1d_sequenced',
	'7d_sequenced',
	'28d_sequenced',
]);
const insightFilter = z
	.object({
		field: z.string().min(1),
		operator: z.enum([
			'EQUAL',
			'NOT_EQUAL',
			'GREATER_THAN',
			'GREATER_THAN_OR_EQUAL',
			'LESS_THAN',
			'LESS_THAN_OR_EQUAL',
			'IN_RANGE',
			'NOT_IN_RANGE',
			'CONTAIN',
			'NOT_CONTAIN',
			'CONTAINS_ANY',
			'CONTAINS_ALL',
			'NOT_CONTAINS_ANY',
			'STEM_MATCH',
			'IN',
			'NOT_IN',
			'STARTS_WITH',
			'ENDS_WITH',
			'ANY',
			'ALL',
			'AFTER',
			'BEFORE',
			'ON_OR_AFTER',
			'ON_OR_BEFORE',
			'NONE',
			'TOP',
		]),
		value: z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.array(z.union([z.string(), z.number(), z.boolean()])),
		]),
	})
	.strict();
const insightTimeIncrement = z.union([
	z.enum(['monthly', 'all_days']),
	z.number().int().min(1).max(90),
]);
const datePreset = z.enum([
	'today',
	'yesterday',
	'this_month',
	'last_month',
	'this_quarter',
	'maximum',
	'data_maximum',
	'last_3d',
	'last_7d',
	'last_14d',
	'last_28d',
	'last_30d',
	'last_90d',
	'last_week_mon_sun',
	'last_week_sun_sat',
	'last_quarter',
	'last_year',
	'this_week_mon_today',
	'this_week_sun_today',
	'this_year',
]);
const insightParamsShape = {
	fields: insightFields,
	datePreset: datePreset.optional(),
	since: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	until: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/)
		.optional(),
	level: z.enum(['account', 'campaign', 'adset', 'ad']).optional(),
	breakdowns: z.array(insightBreakdown).min(1).optional(),
	actionBreakdowns: z.array(insightActionBreakdown).min(1).optional(),
	actionAttributionWindows: z.array(insightAttributionWindow).min(1).optional(),
	filtering: z.array(insightFilter).min(1).optional(),
	timeIncrement: insightTimeIncrement.optional(),
	sort: z.array(z.string().min(1)).max(1).optional(),
	summary: z.array(insightFields.element).min(1).optional(),
	summaryActionBreakdowns: z.array(insightActionBreakdown).min(1).optional(),
	defaultSummary: z.boolean().optional(),
	productIdLimit: z.number().int().positive().optional(),
};
const insightRequestShape = { accountId: id, ...insightParamsShape };
const validateInsightsParameters = <
	T extends {
		datePreset?: string;
		since?: string;
		until?: string;
		actionBreakdowns?: string[];
		fields: string[];
		summaryActionBreakdowns?: string[];
		summary?: string[];
		defaultSummary?: boolean;
	},
>(
	schema: z.ZodType<T>,
) =>
	schema
		.refine((value) => !(value.datePreset && (value.since || value.until)))
		.refine(
			(value) => (value.since === undefined) === (value.until === undefined),
		)
		.refine(
			(value) =>
				value.actionBreakdowns === undefined ||
				value.fields.includes('actions'),
		)
		.refine(
			(value) =>
				value.summaryActionBreakdowns === undefined ||
				value.summary !== undefined ||
				value.defaultSummary === true,
		);
const insightsInput = validateInsightsParameters(
	z
		.object({
			...insightRequestShape,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForCampaignInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			campaignId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForAdSetInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			adSetId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsForAdInput = validateInsightsParameters(
	z
		.object({
			...insightParamsShape,
			adId: id,
			limit: pageSize,
			after: cursor,
			before: cursor,
		})
		.strict(),
);
const insightsAsyncCreateInput = validateInsightsParameters(
	z.object(insightRequestShape).strict(),
);
const insightsAsyncReportInput = z
	.object({
		reportRunId: id,
		fields: z
			.array(
				z.enum([
					'id',
					'account_id',
					'time_ref',
					'time_completed',
					'async_status',
					'async_percent_completion',
					'error_code',
					'error_message',
					'error_subcode',
					'error_user_title',
					'error_user_msg',
				]),
			)
			.min(1)
			.optional(),
	})
	.strict();
const insightsAsyncResultsInput = z
	.object({ reportRunId: id, limit: pageSize, after: cursor, before: cursor })
	.strict();
// Ad report-run nodes expose additional provider-documented status fields not selected by this schema.
const AsyncReportSchema = z
	.object({
		id: z.string().optional(),
		account_id: z.string().optional(),
		time_ref: z.number().optional(),
		time_completed: z.number().optional(),
		async_status: z.string().optional(),
		async_percent_completion: z.number().optional(),
		error_code: z.number().optional(),
		error_message: z.string().optional(),
		error_subcode: z.number().optional(),
		error_user_title: z.string().optional(),
		error_user_msg: z.string().optional(),
	})
	.passthrough();
const InsightsAsyncCreateSchema = z.object({
	report_run_id: z.union([z.string().min(1), z.number().int().positive()]),
});
const copiedObjectIdsSchema = z.array(
	z.object({
		ad_object_type: z.enum([
			'unique_adcreative',
			'ad',
			'ad_set',
			'campaign',
			'opportunities',
			'privacy_info_center',
			'topline',
			'ad_account',
			'product',
		]),
		source_id: id,
		copied_id: id,
	}),
);
const campaignCopyOutputSchema = z
	.object({
		copied_campaign_id: id,
		ad_object_ids: copiedObjectIdsSchema.optional(),
	})
	.passthrough();
const adSetCopyOutputSchema = z
	.object({
		copied_adset_id: id,
		ad_object_ids: copiedObjectIdsSchema.optional(),
	})
	.passthrough();
const adCopyOutputSchema = z.object({ copied_ad_id: id }).passthrough();
const HighDemandPeriodSchema = z
	.object({
		id: z.string(),
		budget_value: z.union([z.number(), z.string()]).optional(),
		budget_value_type: z.enum(['ABSOLUTE', 'MULTIPLIER']).optional(),
		recurrence_type: z.string().optional(),
		time_end: z.union([z.string(), z.number()]).optional(),
		time_start: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough();
const HighDemandPeriodsListSchema = z.object({
	data: z.array(HighDemandPeriodSchema),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const HighDemandPeriodCreateSchema = z.object({ id });
const InsightsFeatureName = z.enum([
	'comscore',
	'impression_device',
	'time_of_day_viewer_tz',
	'frequency_value',
]);
const InsightsFeaturesListInput = z.object({ accountId: id }).strict();
const InsightsEnabledFeaturesListInput = z.object({ accountId: id }).strict();
const InsightsFeaturesListSchema = z.object({
	data: z.array(
		z.object({
			feature_name: InsightsFeatureName,
			feature_type: z.literal('breakdown'),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const InsightsEnabledFeaturesListSchema = z.object({
	data: z.array(
		z.object({
			feature_name: InsightsFeatureName,
			status: z.literal('enabled'),
			insights_effective_date: z.string().optional(),
		}),
	),
	paging: MetaAdsListSchema.shape.paging.optional(),
});
const InsightsFeatureEnableInput = z
	.object({ accountId: id, featureName: InsightsFeatureName })
	.strict();
const InsightsFeatureEnableSchema = z.object({ id: z.string() });
// Action statistic fields vary by metric and attribution window in Meta's documented response.
const InsightActionStatSchema = z
	.object({ action_type: z.string().optional(), value: z.string().optional() })
	.passthrough();
export const InsightsListSchema = z.object({
	data: z.array(
		z
			.object({
				account_id: z.string().optional(),
				campaign_id: z.string().optional(),
				adset_id: z.string().optional(),
				ad_id: z.string().optional(),
				date_start: z.string().optional(),
				date_stop: z.string().optional(),
				impressions: z.string().optional(),
				reach: z.string().optional(),
				frequency: z.string().optional(),
				spend: z.string().optional(),
				clicks: z.string().optional(),
				inline_link_clicks: z.string().optional(),
				cpc: z.string().optional(),
				cpm: z.string().optional(),
				ctr: z.string().optional(),
				inline_link_click_ctr: z.string().optional(),
				outbound_clicks: z.array(InsightActionStatSchema).optional(),
				unique_clicks: z.string().optional(),
				unique_impressions: z.string().optional(),
				actions: z.array(InsightActionStatSchema).optional(),
				action_values: z.array(InsightActionStatSchema).optional(),
				ad_name: z.string().optional(),
				campaign_name: z.string().optional(),
				adset_name: z.string().optional(),
				age: z.string().optional(),
				gender: z.string().optional(),
				country: z.string().optional(),
				region: z.string().optional(),
			})
			// Insights metrics depend on the requested field set and are extensible in Meta's docs.
			.passthrough(),
	),
	paging: MetaAdsListSchema.shape.paging,
	// Summary metrics vary with the requested field set and are validated as an object.
	summary: z.record(z.string(), z.unknown()).optional(),
});

export type MetaAdsEndpointInputs = {
	accountsList: z.infer<typeof accountListInput>;
	accountsGet: z.infer<typeof accountGetInput>;
	accountsUsersList: z.infer<typeof accountUsersListInput>;
	accountsActivitiesList: z.infer<typeof accountActivitiesListInput>;
	accountsImpactingAdStudiesList: z.infer<
		typeof accountImpactingAdStudiesListInput
	>;
	accountsAdRulesLibraryList: z.infer<typeof accountAdRulesLibraryListInput>;
	accountsActiveAdRulesList: z.infer<typeof accountActiveAdRulesListInput>;
	accountsGeneratePreviews: z.infer<typeof accountGeneratePreviewsInput>;
	accountsBroadTargetingCategoriesList: z.infer<
		typeof accountBroadTargetingCategoriesListInput
	>;
	labelsList: z.infer<typeof adLabelListInput>;
	labelsGet: z.infer<typeof adLabelGetInput>;
	labelsCreate: z.infer<typeof adLabelCreateInput>;
	labelsUpdate: z.infer<typeof adLabelUpdateInput>;
	labelsDelete: z.infer<typeof adLabelDeleteInput>;
	labelsAdsList: z.infer<typeof adLabelAdsListInput>;
	labelsAdSetsList: z.infer<typeof adLabelAdSetsListInput>;
	labelsCampaignsList: z.infer<typeof adLabelCampaignsListInput>;
	labelsCreativesList: z.infer<typeof adLabelCreativesListInput>;
	imagesList: z.infer<typeof AdImageListInput>;
	imagesUpload: z.infer<typeof AdImageUploadInput>;
	imagesDelete: z.infer<typeof AdImageDeleteInput>;
	campaignsList: z.infer<typeof campaignListInput>;
	campaignsAdSetsList: z.infer<typeof campaignAdSetsListInput>;
	campaignsAdsList: z.infer<typeof campaignAdsListInput>;
	campaignsCopiesList: z.infer<typeof campaignCopiesListInput>;
	campaignsCopy: z.infer<typeof campaignCopyInput>;
	campaignsLabelsAdd: z.infer<typeof campaignLabelsAddInput>;
	campaignsBudgetSchedulesList: z.infer<
		typeof campaignBudgetSchedulesListInput
	>;
	campaignsBudgetScheduleCreate: z.infer<
		typeof campaignBudgetScheduleCreateInput
	>;
	campaignsAdStudiesList: z.infer<typeof campaignAdStudiesListInput>;
	campaignsAdRulesGovernedList: z.infer<
		typeof campaignAdRulesGovernedListInput
	>;
	highDemandPeriodsGet: z.infer<typeof budgetScheduleGetInput>;
	campaignsGet: z.infer<typeof campaignGetInput>;
	campaignsCreate: z.infer<typeof campaignCreateInput>;
	campaignsUpdate: z.infer<typeof campaignUpdateInput>;
	campaignsDelete: { campaignId: string };
	adSetsList: z.infer<typeof adSetListInput>;
	adSetsAdsList: z.infer<typeof adSetAdsListInput>;
	adSetsAdCreativesList: z.infer<typeof adSetAdCreativesListInput>;
	adSetsCopiesList: z.infer<typeof adSetCopiesListInput>;
	adSetsCopy: z.infer<typeof adSetCopyInput>;
	adSetsBudgetSchedulesList: z.infer<typeof adSetBudgetSchedulesListInput>;
	adSetsBudgetScheduleCreate: z.infer<typeof adSetBudgetScheduleCreateInput>;
	adSetsActivitiesList: z.infer<typeof adSetActivitiesListInput>;
	adSetsAdStudiesList: z.infer<typeof adSetAdStudiesListInput>;
	adSetsAdRulesGovernedList: z.infer<typeof adSetAdRulesGovernedListInput>;
	adSetsGet: z.infer<typeof adSetGetInput>;
	adSetsCreate: z.infer<typeof adSetCreateInput>;
	adSetsUpdate: z.infer<typeof adSetUpdateInput>;
	adSetsDelete: { adSetId: string };
	adsList: z.infer<typeof adListInput>;
	adsAdCreativesList: z.infer<typeof adAdCreativesListInput>;
	adsCopiesList: z.infer<typeof adCopiesListInput>;
	adsCopy: z.infer<typeof adCopyInput>;
	adsLabelsAdd: z.infer<typeof adLabelsAddInput>;
	adsAdStudiesList: z.infer<typeof adAdStudiesListInput>;
	adsAdRulesGovernedList: z.infer<typeof adAdRulesGovernedListInput>;
	adsPreviewsList: z.infer<typeof adsPreviewsListInput>;
	adsGet: z.infer<typeof adGetInput>;
	adsCreate: z.infer<typeof adCreateInput>;
	adsUpdate: z.infer<typeof adUpdateInput>;
	adsDelete: { adId: string };
	creativesList: z.infer<typeof creativeListInput>;
	creativesGet: z.infer<typeof creativeGetInput>;
	creativesCreate: z.infer<typeof creativeCreateInput>;
	creativesUpdate: z.infer<typeof creativeUpdateInput>;
	creativesDelete: z.infer<typeof creativeDeleteInput>;
	creativesLabelsAdd: z.infer<typeof creativeLabelsAddInput>;
	creativesInsightsList: z.infer<typeof creativeInsightsListInput>;
	creativesPreviewsList: z.infer<typeof creativePreviewsListInput>;
	audiencesList: z.infer<typeof audienceListInput>;
	audiencesAdAccountsList: z.infer<typeof audienceAdAccountsListInput>;
	audiencesAdsList: z.infer<typeof audienceAdsListInput>;
	audiencesGet: z.infer<typeof audienceGetInput>;
	audiencesCreate: z.input<typeof audienceCreateInput>;
	audiencesUpdate: z.infer<typeof audienceUpdateInput>;
	audiencesDelete: z.infer<typeof audienceDeleteInput>;
	audiencesSessionsList: z.infer<typeof audienceSessionsListInput>;
	audiencesUsersAdd: z.infer<typeof audienceUsersAddInput>;
	audiencesUsersRemove: z.infer<typeof audienceUsersRemoveInput>;
	audiencesUsersReplace: z.infer<typeof audienceUsersReplaceInput>;
	audiencesAdAccountsShare: z.infer<typeof audienceAccountsShareInput>;
	audiencesAdAccountsUnshare: z.infer<typeof audienceAccountsUnshareInput>;
	studiesGet: z.infer<typeof studyGetInput>;
	studiesCreate: z.infer<typeof studyCreateInput>;
	studiesUpdate: z.infer<typeof studyUpdateInput>;
	studiesRelatedAccountsList: z.infer<typeof studyRelatedAccountsListInput>;
	studiesViewersList: z.infer<typeof studyViewersListInput>;
	videosDelete: z.infer<typeof videosDeleteInput>;
	insightsList: z.infer<typeof insightsInput>;
	insightsListForCampaign: z.infer<typeof insightsForCampaignInput>;
	insightsListForAdSet: z.infer<typeof insightsForAdSetInput>;
	insightsListForAd: z.infer<typeof insightsForAdInput>;
	insightsCreateAsync: z.infer<typeof insightsAsyncCreateInput>;
	insightsGetAsyncReport: z.infer<typeof insightsAsyncReportInput>;
	insightsGetAsyncResults: z.infer<typeof insightsAsyncResultsInput>;
	insightsListFeatures: z.infer<typeof InsightsFeaturesListInput>;
	insightsListEnabledFeatures: z.infer<typeof InsightsEnabledFeaturesListInput>;
	insightsEnableFeature: z.infer<typeof InsightsFeatureEnableInput>;
};

export type MetaAdsEndpointOutputs = {
	accountsList: z.infer<typeof accountListOutput>;
	accountsGet: z.infer<typeof accountGetOutput>;
	accountsUsersList: z.infer<typeof AccountUsersListSchema>;
	accountsActivitiesList: z.infer<typeof AccountActivitiesListSchema>;
	accountsImpactingAdStudiesList: z.infer<typeof AdStudyListSchema>;
	accountsAdRulesLibraryList: z.infer<typeof AdRuleListSchema>;
	accountsActiveAdRulesList: z.infer<typeof AdRuleListSchema>;
	accountsGeneratePreviews: z.infer<typeof AdPreviewsListSchema>;
	accountsBroadTargetingCategoriesList: z.infer<
		typeof BroadTargetingCategoriesListSchema
	>;
	labelsList: z.infer<typeof AdLabelsListSchema>;
	labelsGet: z.infer<typeof AdLabelSchema>;
	labelsCreate: z.infer<typeof MetaAdsMutationSchema>;
	labelsUpdate: z.infer<typeof AdLabelAssociationSchema>;
	labelsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	labelsAdsList: z.infer<typeof MetaAdsListSchema>;
	labelsAdSetsList: z.infer<typeof MetaAdsListSchema>;
	labelsCampaignsList: z.infer<typeof MetaAdsListSchema>;
	labelsCreativesList: z.infer<typeof MetaAdsListSchema>;
	imagesList: z.infer<typeof AdImagesListSchema>;
	imagesUpload: z.infer<typeof AdImageUploadSchema>;
	imagesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	campaignsList: z.infer<typeof MetaAdsListSchema>;
	campaignsAdSetsList: z.infer<typeof MetaAdsListSchema>;
	campaignsAdsList: z.infer<typeof MetaAdsListSchema>;
	campaignsCopiesList: z.infer<typeof MetaAdsListSchema>;
	campaignsCopy: z.infer<typeof campaignCopyOutputSchema>;
	campaignsLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	campaignsBudgetSchedulesList: z.infer<typeof HighDemandPeriodsListSchema>;
	campaignsBudgetScheduleCreate: z.infer<typeof HighDemandPeriodCreateSchema>;
	campaignsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	campaignsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	highDemandPeriodsGet: z.infer<typeof HighDemandPeriodSchema>;
	campaignsGet: z.infer<typeof MetaAdsObjectSchema>;
	campaignsCreate: z.infer<typeof MetaAdsMutationSchema>;
	campaignsUpdate: { success: boolean };
	campaignsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adSetsList: z.infer<typeof MetaAdsListSchema>;
	adSetsAdsList: z.infer<typeof MetaAdsListSchema>;
	adSetsAdCreativesList: z.infer<typeof MetaAdsListSchema>;
	adSetsCopiesList: z.infer<typeof MetaAdsListSchema>;
	adSetsCopy: z.infer<typeof adSetCopyOutputSchema>;
	adSetsBudgetSchedulesList: z.infer<typeof HighDemandPeriodsListSchema>;
	adSetsBudgetScheduleCreate: z.infer<typeof HighDemandPeriodCreateSchema>;
	adSetsActivitiesList: z.infer<typeof AccountActivitiesListSchema>;
	adSetsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	adSetsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	adSetsGet: z.infer<typeof MetaAdsObjectSchema>;
	adSetsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adSetsUpdate: { success: boolean };
	adSetsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	adsList: z.infer<typeof MetaAdsListSchema>;
	adsAdCreativesList: z.infer<typeof MetaAdsListSchema>;
	adsCopiesList: z.infer<typeof MetaAdsListSchema>;
	adsCopy: z.infer<typeof adCopyOutputSchema>;
	adsLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	adsAdStudiesList: z.infer<typeof AdStudyListSchema>;
	adsAdRulesGovernedList: z.infer<typeof AdRuleListSchema>;
	adsPreviewsList: z.infer<typeof AdPreviewsListSchema>;
	adsGet: z.infer<typeof MetaAdsObjectSchema>;
	adsCreate: z.infer<typeof MetaAdsMutationSchema>;
	adsUpdate: { success: boolean };
	adsDelete: z.infer<typeof MetaAdsDeleteSchema>;
	creativesList: z.infer<typeof MetaAdsListSchema>;
	creativesGet: z.infer<typeof MetaAdsObjectSchema>;
	creativesCreate: z.infer<typeof MetaAdsMutationSchema>;
	creativesUpdate: z.infer<typeof MetaAdsDeleteSchema>;
	creativesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	creativesLabelsAdd: z.infer<typeof AdLabelAssociationSchema>;
	creativesInsightsList: z.infer<typeof CreativeInsightsListSchema>;
	creativesPreviewsList: z.infer<typeof AdPreviewsListSchema>;
	audiencesList: z.infer<typeof MetaAdsListSchema>;
	audiencesAdAccountsList: z.infer<typeof AudienceAdAccountsListSchema>;
	audiencesAdsList: z.infer<typeof MetaAdsListSchema>;
	audiencesGet: z.infer<typeof MetaAdsObjectSchema>;
	audiencesCreate: z.infer<typeof MetaAdsMutationSchema>;
	audiencesUpdate: { success: boolean };
	audiencesDelete: z.infer<typeof MetaAdsDeleteSchema>;
	audiencesSessionsList: z.infer<typeof audienceSessionsListOutput>;
	audiencesUsersAdd: z.infer<typeof audienceUsersResultSchema>;
	audiencesUsersRemove: z.infer<typeof audienceUsersResultSchema>;
	audiencesUsersReplace: z.infer<typeof audienceUsersResultSchema>;
	audiencesAdAccountsShare: z.infer<typeof AudienceSharingSchema>;
	audiencesAdAccountsUnshare: z.infer<typeof MetaAdsDeleteSchema>;
	studiesGet: z.infer<typeof AdStudySchema>;
	studiesCreate: z.infer<typeof StudyCreateSchema>;
	studiesUpdate: z.infer<typeof StudyUpdateSchema>;
	studiesRelatedAccountsList: z.infer<typeof MetaAdsListSchema>;
	studiesViewersList: z.infer<typeof StudyViewersListSchema>;
	videosDelete: z.infer<typeof MetaAdsDeleteSchema>;
	insightsList: z.infer<typeof InsightsListSchema>;
	insightsListForCampaign: z.infer<typeof InsightsListSchema>;
	insightsListForAdSet: z.infer<typeof InsightsListSchema>;
	insightsListForAd: z.infer<typeof InsightsListSchema>;
	insightsCreateAsync: z.infer<typeof InsightsAsyncCreateSchema>;
	insightsGetAsyncReport: z.infer<typeof AsyncReportSchema>;
	insightsGetAsyncResults: z.infer<typeof InsightsListSchema>;
	insightsListFeatures: z.infer<typeof InsightsFeaturesListSchema>;
	insightsListEnabledFeatures: z.infer<
		typeof InsightsEnabledFeaturesListSchema
	>;
	insightsEnableFeature: z.infer<typeof InsightsFeatureEnableSchema>;
};

export const MetaAdsEndpointInputSchemas = {
	accountsList: accountListInput,
	accountsGet: accountGetInput,
	accountsUsersList: accountUsersListInput,
	accountsActivitiesList: accountActivitiesListInput,
	accountsImpactingAdStudiesList: accountImpactingAdStudiesListInput,
	accountsAdRulesLibraryList: accountAdRulesLibraryListInput,
	accountsActiveAdRulesList: accountActiveAdRulesListInput,
	accountsGeneratePreviews: accountGeneratePreviewsInput,
	accountsBroadTargetingCategoriesList:
		accountBroadTargetingCategoriesListInput,
	labelsList: adLabelListInput,
	labelsGet: adLabelGetInput,
	labelsCreate: adLabelCreateInput,
	labelsUpdate: adLabelUpdateInput,
	labelsDelete: adLabelDeleteInput,
	labelsAdsList: adLabelAdsListInput,
	labelsAdSetsList: adLabelAdSetsListInput,
	labelsCampaignsList: adLabelCampaignsListInput,
	labelsCreativesList: adLabelCreativesListInput,
	imagesList: AdImageListInput,
	imagesUpload: AdImageUploadInput,
	imagesDelete: AdImageDeleteInput,
	campaignsList: campaignListInput,
	campaignsAdSetsList: campaignAdSetsListInput,
	campaignsAdsList: campaignAdsListInput,
	campaignsCopiesList: campaignCopiesListInput,
	campaignsCopy: campaignCopyInput,
	campaignsLabelsAdd: campaignLabelsAddInput,
	campaignsBudgetSchedulesList: campaignBudgetSchedulesListInput,
	campaignsBudgetScheduleCreate: campaignBudgetScheduleCreateInput,
	campaignsAdStudiesList: campaignAdStudiesListInput,
	campaignsAdRulesGovernedList: campaignAdRulesGovernedListInput,
	highDemandPeriodsGet: budgetScheduleGetInput,
	campaignsGet: campaignGetInput,
	campaignsCreate: campaignCreateInput,
	campaignsUpdate: campaignUpdateInput,
	campaignsDelete: z.object({ campaignId: id }).strict(),
	adSetsList: adSetListInput,
	adSetsAdsList: adSetAdsListInput,
	adSetsAdCreativesList: adSetAdCreativesListInput,
	adSetsCopiesList: adSetCopiesListInput,
	adSetsCopy: adSetCopyInput,
	adSetsBudgetSchedulesList: adSetBudgetSchedulesListInput,
	adSetsBudgetScheduleCreate: adSetBudgetScheduleCreateInput,
	adSetsActivitiesList: adSetActivitiesListInput,
	adSetsAdStudiesList: adSetAdStudiesListInput,
	adSetsAdRulesGovernedList: adSetAdRulesGovernedListInput,
	adSetsGet: adSetGetInput,
	adSetsCreate: adSetCreateInput,
	adSetsUpdate: adSetUpdateInput,
	adSetsDelete: z.object({ adSetId: id }).strict(),
	adsList: adListInput,
	adsAdCreativesList: adAdCreativesListInput,
	adsCopiesList: adCopiesListInput,
	adsCopy: adCopyInput,
	adsLabelsAdd: adLabelsAddInput,
	adsAdStudiesList: adAdStudiesListInput,
	adsAdRulesGovernedList: adAdRulesGovernedListInput,
	adsPreviewsList: adsPreviewsListInput,
	adsGet: adGetInput,
	adsCreate: adCreateInput,
	adsUpdate: adUpdateInput,
	adsDelete: z.object({ adId: id }).strict(),
	creativesList: creativeListInput,
	creativesGet: creativeGetInput,
	creativesCreate: creativeCreateInput,
	creativesUpdate: creativeUpdateInput,
	creativesDelete: creativeDeleteInput,
	creativesLabelsAdd: creativeLabelsAddInput,
	creativesInsightsList: creativeInsightsListInput,
	creativesPreviewsList: creativePreviewsListInput,
	audiencesList: audienceListInput,
	audiencesAdAccountsList: audienceAdAccountsListInput,
	audiencesAdsList: audienceAdsListInput,
	audiencesGet: audienceGetInput,
	audiencesCreate: audienceCreateInput,
	audiencesUpdate: audienceUpdateInput,
	audiencesDelete: audienceDeleteInput,
	audiencesSessionsList: audienceSessionsListInput,
	audiencesUsersAdd: audienceUsersAddInput,
	audiencesUsersRemove: audienceUsersRemoveInput,
	audiencesUsersReplace: audienceUsersReplaceInput,
	audiencesAdAccountsShare: audienceAccountsShareInput,
	audiencesAdAccountsUnshare: audienceAccountsUnshareInput,
	studiesGet: studyGetInput,
	studiesCreate: studyCreateInput,
	studiesUpdate: studyUpdateInput,
	studiesRelatedAccountsList: studyRelatedAccountsListInput,
	studiesViewersList: studyViewersListInput,
	videosDelete: videosDeleteInput,
	insightsList: insightsInput,
	insightsListForCampaign: insightsForCampaignInput,
	insightsListForAdSet: insightsForAdSetInput,
	insightsListForAd: insightsForAdInput,
	insightsCreateAsync: insightsAsyncCreateInput,
	insightsGetAsyncReport: insightsAsyncReportInput,
	insightsGetAsyncResults: insightsAsyncResultsInput,
	insightsListFeatures: InsightsFeaturesListInput,
	insightsListEnabledFeatures: InsightsEnabledFeaturesListInput,
	insightsEnableFeature: InsightsFeatureEnableInput,
} as const;

export const MetaAdsEndpointOutputSchemas = {
	accountsList: accountListOutput,
	accountsGet: accountGetOutput,
	accountsUsersList: AccountUsersListSchema,
	accountsActivitiesList: AccountActivitiesListSchema,
	accountsImpactingAdStudiesList: AdStudyListSchema,
	accountsAdRulesLibraryList: AdRuleListSchema,
	accountsActiveAdRulesList: AdRuleListSchema,
	accountsGeneratePreviews: AdPreviewsListSchema,
	accountsBroadTargetingCategoriesList: BroadTargetingCategoriesListSchema,
	labelsList: AdLabelsListSchema,
	labelsGet: AdLabelSchema,
	labelsCreate: MetaAdsMutationSchema,
	labelsUpdate: AdLabelAssociationSchema,
	labelsDelete: MetaAdsDeleteSchema,
	labelsAdsList: MetaAdsListSchema,
	labelsAdSetsList: MetaAdsListSchema,
	labelsCampaignsList: MetaAdsListSchema,
	labelsCreativesList: MetaAdsListSchema,
	imagesList: AdImagesListSchema,
	imagesUpload: AdImageUploadSchema,
	imagesDelete: MetaAdsDeleteSchema,
	campaignsList: MetaAdsListSchema,
	campaignsAdSetsList: MetaAdsListSchema,
	campaignsAdsList: MetaAdsListSchema,
	campaignsCopiesList: MetaAdsListSchema,
	campaignsCopy: campaignCopyOutputSchema,
	campaignsLabelsAdd: AdLabelAssociationSchema,
	campaignsBudgetSchedulesList: HighDemandPeriodsListSchema,
	campaignsBudgetScheduleCreate: HighDemandPeriodCreateSchema,
	campaignsAdStudiesList: AdStudyListSchema,
	campaignsAdRulesGovernedList: AdRuleListSchema,
	highDemandPeriodsGet: HighDemandPeriodSchema,
	campaignsGet: MetaAdsObjectSchema,
	campaignsCreate: MetaAdsMutationSchema,
	campaignsUpdate: MetaAdsDeleteSchema,
	campaignsDelete: MetaAdsDeleteSchema,
	adSetsList: MetaAdsListSchema,
	adSetsAdsList: MetaAdsListSchema,
	adSetsAdCreativesList: MetaAdsListSchema,
	adSetsCopiesList: MetaAdsListSchema,
	adSetsCopy: adSetCopyOutputSchema,
	adSetsBudgetSchedulesList: HighDemandPeriodsListSchema,
	adSetsBudgetScheduleCreate: HighDemandPeriodCreateSchema,
	adSetsActivitiesList: AccountActivitiesListSchema,
	adSetsAdStudiesList: AdStudyListSchema,
	adSetsAdRulesGovernedList: AdRuleListSchema,
	adSetsGet: MetaAdsObjectSchema,
	adSetsCreate: MetaAdsMutationSchema,
	adSetsUpdate: MetaAdsDeleteSchema,
	adSetsDelete: MetaAdsDeleteSchema,
	adsList: MetaAdsListSchema,
	adsAdCreativesList: MetaAdsListSchema,
	adsCopiesList: MetaAdsListSchema,
	adsCopy: adCopyOutputSchema,
	adsLabelsAdd: AdLabelAssociationSchema,
	adsAdStudiesList: AdStudyListSchema,
	adsAdRulesGovernedList: AdRuleListSchema,
	adsPreviewsList: AdPreviewsListSchema,
	adsGet: MetaAdsObjectSchema,
	adsCreate: MetaAdsMutationSchema,
	adsUpdate: MetaAdsDeleteSchema,
	adsDelete: MetaAdsDeleteSchema,
	creativesList: MetaAdsListSchema,
	creativesGet: MetaAdsObjectSchema,
	creativesCreate: MetaAdsMutationSchema,
	creativesUpdate: MetaAdsDeleteSchema,
	creativesDelete: MetaAdsDeleteSchema,
	creativesLabelsAdd: AdLabelAssociationSchema,
	creativesInsightsList: CreativeInsightsListSchema,
	creativesPreviewsList: AdPreviewsListSchema,
	audiencesList: MetaAdsListSchema,
	audiencesAdAccountsList: AudienceAdAccountsListSchema,
	audiencesAdsList: MetaAdsListSchema,
	audiencesGet: MetaAdsObjectSchema,
	audiencesCreate: MetaAdsMutationSchema,
	audiencesUpdate: MetaAdsDeleteSchema,
	audiencesDelete: MetaAdsDeleteSchema,
	audiencesSessionsList: audienceSessionsListOutput,
	audiencesUsersAdd: audienceUsersResultSchema,
	audiencesUsersRemove: audienceUsersResultSchema,
	audiencesUsersReplace: audienceUsersResultSchema,
	audiencesAdAccountsShare: AudienceSharingSchema,
	audiencesAdAccountsUnshare: MetaAdsDeleteSchema,
	studiesGet: AdStudySchema,
	studiesCreate: StudyCreateSchema,
	studiesUpdate: StudyUpdateSchema,
	studiesRelatedAccountsList: MetaAdsListSchema,
	studiesViewersList: StudyViewersListSchema,
	videosDelete: MetaAdsDeleteSchema,
	insightsList: InsightsListSchema,
	insightsListForCampaign: InsightsListSchema,
	insightsListForAdSet: InsightsListSchema,
	insightsListForAd: InsightsListSchema,
	insightsCreateAsync: InsightsAsyncCreateSchema,
	insightsGetAsyncReport: AsyncReportSchema,
	insightsGetAsyncResults: InsightsListSchema,
	insightsListFeatures: InsightsFeaturesListSchema,
	insightsListEnabledFeatures: InsightsEnabledFeaturesListSchema,
	insightsEnableFeature: InsightsFeatureEnableSchema,
} as const;

type Assert<T extends true> = T;
type SameKeys<Left, Right> = [
	Exclude<keyof Left, keyof Right>,
	Exclude<keyof Right, keyof Left>,
] extends [never, never]
	? true
	: false;
type MetaAdsOutputSchemaKeysMatch = Assert<
	SameKeys<MetaAdsEndpointOutputs, typeof MetaAdsEndpointOutputSchemas>
>;
