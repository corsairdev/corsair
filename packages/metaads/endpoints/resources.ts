import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeMetaAdsRequest } from '../client';
import type { MetaAdsContext, MetaAdsEndpointInputs } from '../index';
import {
	AccountUsersListSchema,
	InsightsListSchema,
	MetaAdsDeleteSchema,
	MetaAdsEndpointInputSchemas,
	MetaAdsEndpointOutputSchemas,
	MetaAdsListSchema,
	MetaAdsMutationSchema,
	MetaAdsObjectSchema,
} from './types';

type Method = 'GET' | 'POST' | 'DELETE';
// `unknown` form values are endpoint-specific Graph JSON, validated before this transport boundary.
type RequestShape = {
	query?: Record<string, string | number | boolean | undefined>;
	body?: Record<string, unknown>;
	encodedBody?: string;
	idempotencyKey?: string;
	redactBodyOnError?: boolean;
	redactQueryOnError?: boolean;
	sensitiveValues?: string[];
};

function operation<Input, ParsedInput, Output>(config: {
	name: string;
	method: Method;
	path: (input: ParsedInput) => string;
	input: z.ZodType<ParsedInput, Input>;
	output: z.ZodType<Output>;
	request: (input: ParsedInput) => RequestShape;
}) {
	return async (ctx: MetaAdsContext, input: Input): Promise<Output> => {
		const parsedInput = config.input.parse(input);
		const shape = config.request(parsedInput);
		const response = await makeMetaAdsRequest(
			config.path(parsedInput),
			ctx.key,
			{
				method: config.method,
				query: shape.query,
				body: shape.body,
				encodedBody: shape.encodedBody,
				idempotencyKey: shape.idempotencyKey,
				redactBodyOnError: shape.redactBodyOnError,
				redactQueryOnError: shape.redactQueryOnError,
				sensitiveValues: shape.sensitiveValues,
			},
		);
		const parsed = config.output.parse(normalizePaging(response));
		await logEventFromContext(
			ctx,
			`metaads.${config.name}`,
			{ status: 'completed' },
			'completed',
		);
		return parsed;
	};
}

const emptyRequest = (): RequestShape => ({});
const accountPath = (accountId: string): string =>
	`/act_${encodeURIComponent(accountId.replace(/^act_/, ''))}`;
const idPath = (id: string | number): string =>
	`/${encodeURIComponent(String(id))}`;
const pageParams = (input: {
	fields?: string;
	limit?: number;
	after?: string;
	before?: string;
}) => ({
	fields: input.fields,
	limit: input.limit,
	after: input.after,
	before: input.before,
});
const cursorParams = (input: {
	limit?: number;
	after?: string;
	before?: string;
}) => ({
	limit: input.limit,
	after: input.after,
	before: input.before,
});

// `unknown` because Graph response values are untrusted until the output schema validates them.
function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// 'unknown' because raw Graph API JSON and nested edge objects are untrusted before output schema parsing.
function normalizePaging(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(normalizePaging);
	}
	if (!isRecord(value)) {
		return value;
	}
	const result: Record<string, unknown> = {};
	for (const [key, val] of Object.entries(value)) {
		if (key === 'paging' && isRecord(val)) {
			result.paging = {
				...(isRecord(val.cursors)
					? { cursors: normalizePaging(val.cursors) }
					: {}),
				hasNextPage: typeof val.next === 'string',
			};
		} else {
			result[key] = normalizePaging(val);
		}
	}
	return result;
}

// `unknown` is needed for documented nested JSON such as targeting and creative references.
const form = (value: Record<string, unknown>): RequestShape => ({
	body: value,
});
const previewRequest = (input: {
	adFormat: string;
	creativeFeature?: string;
	dynamicAssetLabel?: string;
	productItemIds?: string[];
	startDate?: string;
	endDate?: string;
	width?: number;
	height?: number;
	limit?: number;
	after?: string;
	before?: string;
}): RequestShape => ({
	redactQueryOnError: true,
	query: {
		ad_format: input.adFormat,
		creative_feature: input.creativeFeature,
		dynamic_asset_label: input.dynamicAssetLabel,
		product_item_ids: input.productItemIds
			? JSON.stringify(input.productItemIds)
			: undefined,
		start_date: input.startDate,
		end_date: input.endDate,
		width: input.width,
		height: input.height,
		...cursorParams(input),
	},
});
// `unknown` is needed for documented nested JSON such as targeting and creative references.
const keyedForm = (
	value: Record<string, unknown>,
	idempotencyKey?: string,
): RequestShape => ({
	body: value,
	idempotencyKey,
});

export const accountsList = operation({
	name: 'accounts.list',
	method: 'GET',
	path: () => '/me/adaccounts',
	input: MetaAdsEndpointInputSchemas.accountsList,
	output: MetaAdsEndpointOutputSchemas.accountsList,
	request: (input) => ({ query: pageParams(input) }),
});
export const accountsGet = operation({
	name: 'accounts.get',
	method: 'GET',
	path: (input) => accountPath(input.accountId),
	input: MetaAdsEndpointInputSchemas.accountsGet,
	output: MetaAdsEndpointOutputSchemas.accountsGet,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const accountsUsersList = operation({
	name: 'accounts.usersList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/users`,
	input: MetaAdsEndpointInputSchemas.accountsUsersList,
	output: AccountUsersListSchema,
	request: (input) => ({
		query: { limit: input.limit, after: input.after, before: input.before },
	}),
});
export const accountsAssignedUsersList = operation({
	name: 'accounts.assignedUsersList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/assigned_users`,
	input: MetaAdsEndpointInputSchemas.accountsAssignedUsersList,
	output: MetaAdsEndpointOutputSchemas.accountsAssignedUsersList,
	request: (input) => ({
		query: { business: input.businessId, ...cursorParams(input) },
	}),
});
export const accountsAssignUser = operation({
	name: 'accounts.assignUser',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/assigned_users`,
	input: MetaAdsEndpointInputSchemas.accountsAssignUser,
	output: MetaAdsEndpointOutputSchemas.accountsAssignUser,
	request: (input) =>
		form({
			user: input.userId,
			tasks: input.tasks ? JSON.stringify(input.tasks) : undefined,
		}),
});
export const accountsRemoveUser = operation({
	name: 'accounts.removeUser',
	method: 'DELETE',
	path: (input) => `${accountPath(input.accountId)}/assigned_users`,
	input: MetaAdsEndpointInputSchemas.accountsRemoveUser,
	output: MetaAdsEndpointOutputSchemas.accountsRemoveUser,
	request: (input) => ({
		encodedBody: new URLSearchParams({ user: input.userId }).toString(),
	}),
});
export const accountsControlsCreate = operation({
	name: 'accounts.controlsCreate',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/account_controls`,
	input: MetaAdsEndpointInputSchemas.accountsControlsCreate,
	output: MetaAdsEndpointOutputSchemas.accountsControlsCreate,
	request: (input) => ({
		body: {
			audience_controls: JSON.stringify({
				age_min: input.audienceControls.ageMin,
				geo_locations: input.audienceControls.geoLocations,
				excluded_geo_locations: input.audienceControls.excludedGeoLocations,
				exclusions: input.audienceControls.exclusions,
			}),
			placement_controls: input.placementControls
				? JSON.stringify({
						placement_exclusions: input.placementControls.placementExclusions,
						campaign_ids_to_set_ap: input.placementControls.campaignIdsToSetAp,
					})
				: undefined,
		},
		redactBodyOnError: true,
	}),
});
export const accountsAgenciesList = operation({
	name: 'accounts.agenciesList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/agencies`,
	input: MetaAdsEndpointInputSchemas.accountsAgenciesList,
	output: MetaAdsEndpointOutputSchemas.accountsAgenciesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const accountsAgencyRemove = operation({
	name: 'accounts.agencyRemove',
	method: 'DELETE',
	path: (input) => `${accountPath(input.accountId)}/agencies`,
	input: MetaAdsEndpointInputSchemas.accountsAgencyRemove,
	output: MetaAdsEndpointOutputSchemas.accountsAgencyRemove,
	request: (input) => ({
		encodedBody: new URLSearchParams({ business: input.businessId }).toString(),
	}),
});
export const accountsSubscribedAppUpdate = operation({
	name: 'accounts.subscribedAppUpdate',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/subscribed_apps`,
	input: MetaAdsEndpointInputSchemas.accountsSubscribedAppUpdate,
	output: MetaAdsEndpointOutputSchemas.accountsSubscribedAppUpdate,
	request: (input) => form({ app_id: input.appId }),
});
export const accountsSubscribedAppRemove = operation({
	name: 'accounts.subscribedAppRemove',
	method: 'DELETE',
	path: (input) => `${accountPath(input.accountId)}/subscribed_apps`,
	input: MetaAdsEndpointInputSchemas.accountsSubscribedAppRemove,
	output: MetaAdsEndpointOutputSchemas.accountsSubscribedAppRemove,
	request: (input) => ({
		encodedBody: new URLSearchParams(
			input.appId ? { app_id: input.appId } : {},
		).toString(),
	}),
});
export const accountsTrackingCreate = operation({
	name: 'accounts.trackingCreate',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/tracking`,
	input: MetaAdsEndpointInputSchemas.accountsTrackingCreate,
	output: MetaAdsEndpointOutputSchemas.accountsTrackingCreate,
	request: (input) => ({
		body: { tracking_specs: JSON.stringify(input.trackingSpecs) },
		redactBodyOnError: true,
	}),
});
export const accountsPixelsList = operation({
	name: 'accounts.pixelsList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adspixels`,
	input: MetaAdsEndpointInputSchemas.accountsPixelsList,
	output: MetaAdsEndpointOutputSchemas.accountsPixelsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const pixelsCreate = operation({
	name: 'pixels.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adspixels`,
	input: MetaAdsEndpointInputSchemas.pixelsCreate,
	output: MetaAdsEndpointOutputSchemas.pixelsCreate,
	request: (input) => form({ name: input.name }),
});
export const pixelsGet = operation({
	name: 'pixels.get',
	method: 'GET',
	path: (input) => idPath(input.pixelId),
	input: MetaAdsEndpointInputSchemas.pixelsGet,
	output: MetaAdsEndpointOutputSchemas.pixelsGet,
	request: (input) => ({ query: { fields: input.fields?.join(',') } }),
});
export const pixelsUpdate = operation({
	name: 'pixels.update',
	method: 'POST',
	path: (input) => idPath(input.pixelId),
	input: MetaAdsEndpointInputSchemas.pixelsUpdate,
	output: MetaAdsEndpointOutputSchemas.pixelsUpdate,
	request: (input) => ({
		...form({
			automatic_matching_fields: input.automaticMatchingFields
				? JSON.stringify(input.automaticMatchingFields)
				: undefined,
			data_use_setting: input.dataUseSetting,
			enable_automatic_matching: input.enableAutomaticMatching,
			first_party_cookie_status: input.firstPartyCookieStatus,
			name: input.name,
			server_events_business_ids: input.serverEventsBusinessIds
				? JSON.stringify(input.serverEventsBusinessIds)
				: undefined,
			server_events_business_ids_add: input.serverEventsBusinessIdsAdd
				? JSON.stringify(input.serverEventsBusinessIdsAdd)
				: undefined,
			server_events_business_ids_remove: input.serverEventsBusinessIdsRemove
				? JSON.stringify(input.serverEventsBusinessIdsRemove)
				: undefined,
		}),
		redactBodyOnError: true,
	}),
});
export const publisherBlockListsCreate = operation({
	name: 'publisherBlockLists.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/publisher_block_lists`,
	input: MetaAdsEndpointInputSchemas.publisherBlockListsCreate,
	output: MetaAdsEndpointOutputSchemas.publisherBlockListsCreate,
	request: (input) => form({ name: input.name }),
});
export const accountsActivitiesList = operation({
	name: 'accounts.activitiesList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/activities`,
	input: MetaAdsEndpointInputSchemas.accountsActivitiesList,
	output: MetaAdsEndpointOutputSchemas.accountsActivitiesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const accountsImpactingAdStudiesList = operation({
	name: 'accounts.impactingAdStudiesList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/impacting_ad_studies`,
	input: MetaAdsEndpointInputSchemas.accountsImpactingAdStudiesList,
	output: MetaAdsEndpointOutputSchemas.accountsImpactingAdStudiesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const accountsAdRulesLibraryList = operation({
	name: 'accounts.adRulesLibraryList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adrules_library`,
	input: MetaAdsEndpointInputSchemas.accountsAdRulesLibraryList,
	output: MetaAdsEndpointOutputSchemas.accountsAdRulesLibraryList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const accountsAdRulesLibraryCreate = operation({
	name: 'accounts.adRulesLibraryCreate',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adrules_library`,
	input: MetaAdsEndpointInputSchemas.accountsAdRulesLibraryCreate,
	output: MetaAdsEndpointOutputSchemas.accountsAdRulesLibraryCreate,
	request: (input) => ({
		...form({
			name: input.name,
			evaluation_spec: JSON.stringify({
				evaluation_type: input.evaluationSpec.evaluationType,
				filters: input.evaluationSpec.filters.map((filter) => ({
					field: filter.field,
					value: filter.value,
					operator: filter.operator,
				})),
				trigger: input.evaluationSpec.trigger
					? {
							type: input.evaluationSpec.trigger.type,
							field: input.evaluationSpec.trigger.field,
							value: input.evaluationSpec.trigger.value,
							operator: input.evaluationSpec.trigger.operator,
						}
					: undefined,
			}),
			execution_spec: JSON.stringify({
				execution_type: input.executionSpec.executionType,
				is_once_off: input.executionSpec.isOnceOff,
				execution_options: input.executionSpec.executionOptions?.map(
					(option) => ({
						field: option.field,
						value: option.value,
						operator: option.operator,
					}),
				),
			}),
			schedule_spec: input.scheduleSpec
				? JSON.stringify({
						schedule_type: input.scheduleSpec.scheduleType,
						schedule: input.scheduleSpec.schedule?.map((range) => ({
							start_minute: range.startMinute,
							end_minute: range.endMinute,
							days: range.days,
						})),
					})
				: undefined,
			status: input.status ?? 'DISABLED',
		}),
		redactBodyOnError: true,
	}),
});
export const accountsActiveAdRulesList = operation({
	name: 'accounts.activeAdRulesList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/active_adrules`,
	input: MetaAdsEndpointInputSchemas.accountsActiveAdRulesList,
	output: MetaAdsEndpointOutputSchemas.accountsActiveAdRulesList,
	request: (input) => ({
		query: {
			selected_ids: JSON.stringify(input.selectedIds),
			pass_evaluation: input.passEvaluation,
			...cursorParams(input),
		},
	}),
});
export const accountsGeneratePreviews = operation({
	name: 'accounts.generatePreviews',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/generatepreviews`,
	input: MetaAdsEndpointInputSchemas.accountsGeneratePreviews,
	output: MetaAdsEndpointOutputSchemas.accountsGeneratePreviews,
	request: (input) => ({
		redactQueryOnError: true,
		query: {
			ad_format: input.adFormat,
			creative: JSON.stringify({
				object_story_spec: input.creativeSpec.objectStorySpec,
			}),
			...cursorParams(input),
		},
	}),
});
export const accountsBroadTargetingCategoriesList = operation({
	name: 'accounts.broadTargetingCategoriesList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/broadtargetingcategories`,
	input: MetaAdsEndpointInputSchemas.accountsBroadTargetingCategoriesList,
	output: MetaAdsEndpointOutputSchemas.accountsBroadTargetingCategoriesList,
	request: (input) => ({
		query: {
			custom_categories_only: input.customCategoriesOnly,
			...cursorParams(input),
		},
	}),
});
export const accountsSmartSuggestedAdsList = operation({
	name: 'accounts.smartSuggestedAdsList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/smart_suggested_ads`,
	input: MetaAdsEndpointInputSchemas.accountsSmartSuggestedAdsList,
	output: MetaAdsEndpointOutputSchemas.accountsSmartSuggestedAdsList,
	request: (input) => ({
		query: {
			objective: input.objective,
			optimization_goal: input.optimizationGoal,
			pixel_id: input.pixelId,
			product_set_id: input.productSetId,
			...cursorParams(input),
		},
	}),
});
export const accountsSuggestedAdsList = operation({
	name: 'accounts.suggestedAdsList',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/suggested_ads`,
	input: MetaAdsEndpointInputSchemas.accountsSuggestedAdsList,
	output: MetaAdsEndpointOutputSchemas.accountsSuggestedAdsList,
	request: (input) => ({
		query: {
			application_id: input.applicationId,
			cms_id: input.cmsId,
			countries: input.countries?.join(','),
			objective: input.objective,
			optimization_goal: input.optimizationGoal,
			pixel_id: input.pixelId,
			promoted_object_page_id: input.promotedObjectPageId,
			promoted_object_product_set_id: input.promotedObjectProductSetId,
			rank_by: input.rankBy,
			use_case: input.useCase,
			...cursorParams(input),
		},
	}),
});
export const accountsPlacePageSetsCreate = operation({
	name: 'accounts.placePageSetsCreate',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/ad_place_page_sets`,
	input: MetaAdsEndpointInputSchemas.accountsPlacePageSetsCreate,
	output: MetaAdsEndpointOutputSchemas.accountsPlacePageSetsCreate,
	request: (input) =>
		form({
			name: input.name,
			parent_page: input.parentPageId,
			location_types: input.locationTypes
				? JSON.stringify(input.locationTypes)
				: undefined,
		}),
});
export const accountsReachEstimate = operation({
	name: 'accounts.reachEstimate',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/reachestimate`,
	input: MetaAdsEndpointInputSchemas.accountsReachEstimate,
	output: MetaAdsEndpointOutputSchemas.accountsReachEstimate,
	request: (input) => ({
		redactQueryOnError: true,
		query: {
			object_store_url: input.objectStoreUrl,
			targeting_spec: JSON.stringify(input.targetingSpec),
		},
	}),
});
export const reachFrequencyPredictionGet = operation({
	name: 'reachFrequencyPredictions.get',
	method: 'GET',
	path: (input) => idPath(input.predictionId),
	input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsGet,
	output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsGet,
	request: (input) => ({ query: { fields: input.fields?.join(',') } }),
});
export const reachFrequencyPredictionsList = operation({
	name: 'reachFrequencyPredictions.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/reachfrequencypredictions`,
	input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsList,
	output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsList,
	request: (input) => ({
		query: {
			fields: input.fields?.join(','),
			...cursorParams(input),
		},
	}),
});
export const reachFrequencyPredictionCreate = operation({
	name: 'reachFrequencyPredictions.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/reachfrequencypredictions`,
	input: MetaAdsEndpointInputSchemas.reachFrequencyPredictionsCreate,
	output: MetaAdsEndpointOutputSchemas.reachFrequencyPredictionsCreate,
	request: (input) => ({
		...form({
			budget: input.budget,
			campaign_group_id: input.campaignGroupId,
			day_parting_schedule: input.dayPartingSchedule
				? JSON.stringify(
						input.dayPartingSchedule.map((item) => ({
							start_minute: item.startMinute,
							end_minute: item.endMinute,
							days: item.days,
							timezone_type: item.timezoneType,
						})),
					)
				: undefined,
			deal_id: input.dealId,
			destination_id: input.destinationId,
			destination_ids: input.destinationIds
				? JSON.stringify(input.destinationIds)
				: undefined,
			end_time: input.endTime,
			frequency_cap: input.frequencyCap,
			instream_packages: input.instreamPackages
				? JSON.stringify(input.instreamPackages)
				: undefined,
			interval_frequency_cap_reset_period:
				input.intervalFrequencyCapResetPeriod,
			meta_moment_maker_spec: input.metaMomentMakerSpec
				? JSON.stringify(input.metaMomentMakerSpec)
				: undefined,
			num_curve_points: input.numCurvePoints,
			objective: input.objective,
			optimization_goal: input.optimizationGoal,
			prediction_mode: input.predictionMode,
			reach: input.reach,
			rf_prediction_id_to_share: input.rfPredictionIdToShare,
			start_time: input.startTime,
			stop_time: input.stopTime,
			story_event_type: input.storyEventType,
			target_spec: input.targetSpec
				? JSON.stringify(input.targetSpec)
				: undefined,
			trending_topics_spec: input.trendingTopicsSpec
				? JSON.stringify({
						is_all_trending: input.trendingTopicsSpec.isAllTrending,
						is_special_budget_alloc:
							input.trendingTopicsSpec.isSpecialBudgetAlloc,
						trending_topics: input.trendingTopicsSpec.trendingTopics,
					})
				: undefined,
		}),
		redactBodyOnError: true,
	}),
});

export const labelsList = operation({
	name: 'labels.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adlabels`,
	input: MetaAdsEndpointInputSchemas.labelsList,
	output: MetaAdsEndpointOutputSchemas.labelsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const labelsGet = operation({
	name: 'labels.get',
	method: 'GET',
	path: (input) => idPath(input.labelId),
	input: MetaAdsEndpointInputSchemas.labelsGet,
	output: MetaAdsEndpointOutputSchemas.labelsGet,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const labelsCreate = operation({
	name: 'labels.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adlabels`,
	input: MetaAdsEndpointInputSchemas.labelsCreate,
	output: MetaAdsEndpointOutputSchemas.labelsCreate,
	request: (input) => form({ name: input.name }),
});
export const labelsUpdate = operation({
	name: 'labels.update',
	method: 'POST',
	path: (input) => idPath(input.labelId),
	input: MetaAdsEndpointInputSchemas.labelsUpdate,
	output: MetaAdsEndpointOutputSchemas.labelsUpdate,
	request: (input) => form({ name: input.name }),
});
export const labelsDelete = operation({
	name: 'labels.delete',
	method: 'DELETE',
	path: (input) => idPath(input.labelId),
	input: MetaAdsEndpointInputSchemas.labelsDelete,
	output: MetaAdsEndpointOutputSchemas.labelsDelete,
	request: emptyRequest,
});
export const labelsAdsList = operation({
	name: 'labels.adsList',
	method: 'GET',
	path: (input) => `${idPath(input.labelId)}/ads`,
	input: MetaAdsEndpointInputSchemas.labelsAdsList,
	output: MetaAdsEndpointOutputSchemas.labelsAdsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const labelsAdSetsList = operation({
	name: 'labels.adSetsList',
	method: 'GET',
	path: (input) => `${idPath(input.labelId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.labelsAdSetsList,
	output: MetaAdsEndpointOutputSchemas.labelsAdSetsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const labelsCampaignsList = operation({
	name: 'labels.campaignsList',
	method: 'GET',
	path: (input) => `${idPath(input.labelId)}/campaigns`,
	input: MetaAdsEndpointInputSchemas.labelsCampaignsList,
	output: MetaAdsEndpointOutputSchemas.labelsCampaignsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const labelsCreativesList = operation({
	name: 'labels.creativesList',
	method: 'GET',
	path: (input) => `${idPath(input.labelId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.labelsCreativesList,
	output: MetaAdsEndpointOutputSchemas.labelsCreativesList,
	request: (input) => ({ query: cursorParams(input) }),
});

const labelAssociationRequest = (input: {
	adlabels: MetaAdsEndpointInputs['campaignsLabelsAdd']['adlabels'];
	executionOptions?: 'validate_only'[];
}): RequestShape => ({
	body: {
		adlabels: JSON.stringify(input.adlabels),
		execution_options: input.executionOptions
			? JSON.stringify(input.executionOptions)
			: undefined,
	},
});
export const campaignsLabelsAdd = operation({
	name: 'campaigns.labelsAdd',
	method: 'POST',
	path: (input) => `${idPath(input.campaignId)}/adlabels`,
	input: MetaAdsEndpointInputSchemas.campaignsLabelsAdd,
	output: MetaAdsEndpointOutputSchemas.campaignsLabelsAdd,
	request: labelAssociationRequest,
});
export const adsLabelsAdd = operation({
	name: 'ads.labelsAdd',
	method: 'POST',
	path: (input) => `${idPath(input.adId)}/adlabels`,
	input: MetaAdsEndpointInputSchemas.adsLabelsAdd,
	output: MetaAdsEndpointOutputSchemas.adsLabelsAdd,
	request: labelAssociationRequest,
});
export const creativesLabelsAdd = operation({
	name: 'creatives.labelsAdd',
	method: 'POST',
	path: (input) => `${idPath(input.creativeId)}/adlabels`,
	input: MetaAdsEndpointInputSchemas.creativesLabelsAdd,
	output: MetaAdsEndpointOutputSchemas.creativesLabelsAdd,
	request: labelAssociationRequest,
});

export const videosDelete = operation({
	name: 'videos.delete',
	method: 'DELETE',
	path: (input) => `${accountPath(input.accountId)}/advideos`,
	input: MetaAdsEndpointInputSchemas.videosDelete,
	output: MetaAdsEndpointOutputSchemas.videosDelete,
	request: (input) => ({ query: { video_id: input.videoId } }),
});
export const asyncCreativesList = operation({
	name: 'asyncCreatives.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/asyncadcreatives`,
	input: MetaAdsEndpointInputSchemas.asyncCreativesList,
	output: MetaAdsEndpointOutputSchemas.asyncCreativesList,
	request: (input) => ({
		query: { is_completed: input.isCompleted, ...cursorParams(input) },
	}),
});
export const asyncCreativesCreate = operation({
	name: 'asyncCreatives.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/asyncadcreatives`,
	input: MetaAdsEndpointInputSchemas.asyncCreativesCreate,
	output: MetaAdsEndpointOutputSchemas.asyncCreativesCreate,
	request: (input) => ({
		...form({
			name: input.name,
			creative_spec: JSON.stringify({
				name: input.creativeSpec.name,
				object_story_id: input.creativeSpec.objectStoryId,
				object_story_spec: input.creativeSpec.objectStorySpec,
				authorization_category: input.creativeSpec.authorizationCategory,
			}),
			notification_mode: 'OFF',
		}),
		redactBodyOnError: true,
	}),
});
export const customConversionsCreate = operation({
	name: 'customConversions.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/customconversions`,
	input: MetaAdsEndpointInputSchemas.customConversionsCreate,
	output: MetaAdsEndpointOutputSchemas.customConversionsCreate,
	request: (input) => ({
		...form({
			action_source_type: input.actionSourceType,
			advanced_rule: input.advancedRule,
			custom_event_type: input.customEventType,
			default_conversion_value: input.defaultConversionValue,
			description: input.description,
			event_source_id: input.eventSourceId,
			name: input.name,
			rule: input.rule,
		}),
		redactBodyOnError: true,
	}),
});
export const asyncRequestSetsList = operation({
	name: 'asyncRequestSets.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/asyncadrequestsets`,
	input: MetaAdsEndpointInputSchemas.asyncRequestSetsList,
	output: MetaAdsEndpointOutputSchemas.asyncRequestSetsList,
	request: (input) => ({
		query: { is_completed: input.isCompleted, ...cursorParams(input) },
	}),
});
export const asyncRequestSetsCreate = operation({
	name: 'asyncRequestSets.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/asyncadrequestsets`,
	input: MetaAdsEndpointInputSchemas.asyncRequestSetsCreate,
	output: MetaAdsEndpointOutputSchemas.asyncRequestSetsCreate,
	request: (input) => ({
		...form({
			name: input.name,
			ad_specs: JSON.stringify(input.adSpecs),
			notification_mode: 'OFF',
		}),
		redactBodyOnError: true,
	}),
});
export const asyncRequestSetsGet = operation({
	name: 'asyncRequestSets.get',
	method: 'GET',
	path: (input) => idPath(input.requestSetId),
	input: MetaAdsEndpointInputSchemas.asyncRequestSetsGet,
	output: MetaAdsEndpointOutputSchemas.asyncRequestSetsGet,
	request: (input) => ({ query: { fields: input.fields?.join(',') } }),
});
export const asyncRequestSetsUpdate = operation({
	name: 'asyncRequestSets.update',
	method: 'POST',
	path: (input) => idPath(input.requestSetId),
	input: MetaAdsEndpointInputSchemas.asyncRequestSetsUpdate,
	output: MetaAdsEndpointOutputSchemas.asyncRequestSetsUpdate,
	request: (input) => form({ name: input.name }),
});
export const asyncRequestSetsCancel = operation({
	name: 'asyncRequestSets.cancel',
	method: 'DELETE',
	path: (input) => idPath(input.requestSetId),
	input: MetaAdsEndpointInputSchemas.asyncRequestSetsCancel,
	output: MetaAdsEndpointOutputSchemas.asyncRequestSetsCancel,
	request: emptyRequest,
});
export const asyncRequestsListForSet = operation({
	name: 'asyncRequests.listForSet',
	method: 'GET',
	path: (input) => `${idPath(input.requestSetId)}/requests`,
	input: MetaAdsEndpointInputSchemas.asyncRequestsListForSet,
	output: MetaAdsEndpointOutputSchemas.asyncRequestsListForSet,
	request: (input) => ({
		query: {
			status: input.status?.join(','),
			fields: input.fields?.join(','),
			...cursorParams(input),
		},
	}),
});
export const asyncRequestsListForAdSet = operation({
	name: 'asyncRequests.listForAdSet',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/asyncadrequests`,
	input: MetaAdsEndpointInputSchemas.asyncRequestsListForAdSet,
	output: MetaAdsEndpointOutputSchemas.asyncRequestsListForAdSet,
	request: (input) => ({
		query: {
			statuses: input.status?.join(','),
			fields: input.fields?.join(','),
			...cursorParams(input),
		},
	}),
});
export const asyncRequestsCancel = operation({
	name: 'asyncRequests.cancel',
	method: 'DELETE',
	path: (input) => idPath(input.requestId),
	input: MetaAdsEndpointInputSchemas.asyncRequestsCancel,
	output: MetaAdsEndpointOutputSchemas.asyncRequestsCancel,
	request: emptyRequest,
});
export const imagesList = operation({
	name: 'images.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adimages`,
	input: MetaAdsEndpointInputSchemas.imagesList,
	output: MetaAdsEndpointOutputSchemas.imagesList,
	request: (input) => ({
		query: {
			name: input.name,
			hashes: input.hashes?.join(','),
			minheight: input.minHeight,
			minwidth: input.minWidth,
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const imagesUpload = operation({
	name: 'images.upload',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adimages`,
	input: MetaAdsEndpointInputSchemas.imagesUpload,
	output: MetaAdsEndpointOutputSchemas.imagesUpload,
	request: (input) => ({
		body:
			'bytes' in input
				? { bytes: input.bytes }
				: {
						copy_from: {
							source_account_id: input.copyFrom.sourceAccountId,
							hash: input.copyFrom.hash,
						},
					},
		redactBodyOnError: true,
		sensitiveValues: 'bytes' in input ? [input.bytes] : [],
	}),
});
export const imagesDelete = operation({
	name: 'images.delete',
	method: 'DELETE',
	path: (input) => `${accountPath(input.accountId)}/adimages`,
	input: MetaAdsEndpointInputSchemas.imagesDelete,
	output: MetaAdsDeleteSchema,
	request: (input) => ({
		query: { hash: input.hash, image_id: input.imageId },
	}),
});

export const campaignsList = operation({
	name: 'campaigns.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/campaigns`,
	input: MetaAdsEndpointInputSchemas.campaignsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const campaignsAdSetsList = operation({
	name: 'campaigns.adSetsList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.campaignsAdSetsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const campaignsAdsList = operation({
	name: 'campaigns.adsList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/ads`,
	input: MetaAdsEndpointInputSchemas.campaignsAdsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const campaignsCopiesList = operation({
	name: 'campaigns.copiesList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/copies`,
	input: MetaAdsEndpointInputSchemas.campaignsCopiesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const campaignsCopy = operation({
	name: 'campaigns.copy',
	method: 'POST',
	path: (input) => `${idPath(input.campaignId)}/copies`,
	input: MetaAdsEndpointInputSchemas.campaignsCopy,
	output: MetaAdsEndpointOutputSchemas.campaignsCopy,
	request: (input) => ({
		body: {
			status_option: 'PAUSED',
			...(input.renameOptions
				? {
						rename_options: {
							rename_strategy: input.renameOptions.renameStrategy,
							rename_prefix: input.renameOptions.renamePrefix,
							rename_suffix: input.renameOptions.renameSuffix,
						},
					}
				: {}),
		},
	}),
});
export const campaignsBudgetSchedulesList = operation({
	name: 'campaigns.budgetSchedulesList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/budget_schedules`,
	input: MetaAdsEndpointInputSchemas.campaignsBudgetSchedulesList,
	output: MetaAdsEndpointOutputSchemas.campaignsBudgetSchedulesList,
	request: (input) => ({
		query: {
			...pageParams(input),
			time_start: input.timeStart,
			time_stop: input.timeStop,
		},
	}),
});
export const campaignsBudgetScheduleCreate = operation({
	name: 'campaigns.budgetScheduleCreate',
	method: 'POST',
	path: (input) => `${idPath(input.campaignId)}/budget_schedules`,
	input: MetaAdsEndpointInputSchemas.campaignsBudgetScheduleCreate,
	output: MetaAdsEndpointOutputSchemas.campaignsBudgetScheduleCreate,
	request: (input) => ({
		body: {
			budget_value: input.budgetValue,
			budget_value_type: input.budgetValueType,
			time_start: input.timeStart,
			time_end: input.timeEnd,
		},
	}),
});
export const campaignsAdStudiesList = operation({
	name: 'campaigns.adStudiesList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/ad_studies`,
	input: MetaAdsEndpointInputSchemas.campaignsAdStudiesList,
	output: MetaAdsEndpointOutputSchemas.campaignsAdStudiesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const campaignsAdRulesGovernedList = operation({
	name: 'campaigns.adRulesGovernedList',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/adrules_governed`,
	input: MetaAdsEndpointInputSchemas.campaignsAdRulesGovernedList,
	output: MetaAdsEndpointOutputSchemas.campaignsAdRulesGovernedList,
	request: (input) => ({
		query: {
			pass_evaluation: input.passEvaluation,
			...cursorParams(input),
		},
	}),
});
export const highDemandPeriodsGet = operation({
	name: 'highDemandPeriods.get',
	method: 'GET',
	path: (input) => idPath(input.periodId),
	input: MetaAdsEndpointInputSchemas.highDemandPeriodsGet,
	output: MetaAdsEndpointOutputSchemas.highDemandPeriodsGet,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const campaignsGet = operation({
	name: 'campaigns.get',
	method: 'GET',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const campaignsCreate = operation({
	name: 'campaigns.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/campaigns`,
	input: MetaAdsEndpointInputSchemas.campaignsCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{
				name: input.name,
				objective: input.objective,
				// Preserve required [] in form encoding instead of dropping an empty array.
				special_ad_categories: JSON.stringify(input.specialAdCategories),
				status: input.status ?? 'PAUSED',
				daily_budget: input.dailyBudget,
				lifetime_budget: input.lifetimeBudget,
			},
			input.idempotencyKey,
		),
});
export const campaignsUpdate = operation({
	name: 'campaigns.update',
	method: 'POST',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({
			name: input.name,
			status: input.status,
			daily_budget: input.dailyBudget,
			lifetime_budget: input.lifetimeBudget,
			spend_cap: input.spendCap,
		}),
});
export const campaignsDelete = operation({
	name: 'campaigns.delete',
	method: 'DELETE',
	path: (input) => idPath(input.campaignId),
	input: MetaAdsEndpointInputSchemas.campaignsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const adSetsList = operation({
	name: 'adSets.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.adSetsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adSetsAdsList = operation({
	name: 'adSets.adsList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/ads`,
	input: MetaAdsEndpointInputSchemas.adSetsAdsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adSetsAdCreativesList = operation({
	name: 'adSets.adCreativesList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.adSetsAdCreativesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: cursorParams(input) }),
});
export const adSetsCopiesList = operation({
	name: 'adSets.copiesList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/copies`,
	input: MetaAdsEndpointInputSchemas.adSetsCopiesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adSetsCopy = operation({
	name: 'adSets.copy',
	method: 'POST',
	path: (input) => `${idPath(input.adSetId)}/copies`,
	input: MetaAdsEndpointInputSchemas.adSetsCopy,
	output: MetaAdsEndpointOutputSchemas.adSetsCopy,
	request: (input) => ({
		body: {
			status_option: 'PAUSED',
			...(input.campaignId !== undefined
				? { campaign_id: input.campaignId }
				: {}),
			...(input.renameOptions
				? {
						rename_options: {
							rename_strategy: input.renameOptions.renameStrategy,
							rename_prefix: input.renameOptions.renamePrefix,
							rename_suffix: input.renameOptions.renameSuffix,
						},
					}
				: {}),
		},
	}),
});
export const adSetsBudgetSchedulesList = operation({
	name: 'adSets.budgetSchedulesList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/budget_schedules`,
	input: MetaAdsEndpointInputSchemas.adSetsBudgetSchedulesList,
	output: MetaAdsEndpointOutputSchemas.adSetsBudgetSchedulesList,
	request: (input) => ({
		query: {
			...pageParams(input),
			time_start: input.timeStart,
			time_stop: input.timeStop,
		},
	}),
});
export const adSetsBudgetScheduleCreate = operation({
	name: 'adSets.budgetScheduleCreate',
	method: 'POST',
	path: (input) => `${idPath(input.adSetId)}/budget_schedules`,
	input: MetaAdsEndpointInputSchemas.adSetsBudgetScheduleCreate,
	output: MetaAdsEndpointOutputSchemas.adSetsBudgetScheduleCreate,
	request: (input) => ({
		body: {
			budget_value: input.budgetValue,
			budget_value_type: input.budgetValueType,
			time_start: input.timeStart,
			time_end: input.timeEnd,
		},
	}),
});
export const adSetsActivitiesList = operation({
	name: 'adSets.activitiesList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/activities`,
	input: MetaAdsEndpointInputSchemas.adSetsActivitiesList,
	output: MetaAdsEndpointOutputSchemas.adSetsActivitiesList,
	request: (input) => ({
		query: {
			after: input.after,
			business_id: input.businessId,
			category: input.category,
			limit: input.limit,
			since: input.since,
			uid: input.uid,
			until: input.until,
		},
	}),
});
export const adSetsAdStudiesList = operation({
	name: 'adSets.adStudiesList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/ad_studies`,
	input: MetaAdsEndpointInputSchemas.adSetsAdStudiesList,
	output: MetaAdsEndpointOutputSchemas.adSetsAdStudiesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const adSetsAdRulesGovernedList = operation({
	name: 'adSets.adRulesGovernedList',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/adrules_governed`,
	input: MetaAdsEndpointInputSchemas.adSetsAdRulesGovernedList,
	output: MetaAdsEndpointOutputSchemas.adSetsAdRulesGovernedList,
	request: (input) => ({
		query: {
			pass_evaluation: input.passEvaluation,
			...cursorParams(input),
		},
	}),
});
export const adSetsGet = operation({
	name: 'adSets.get',
	method: 'GET',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const adSetsCreate = operation({
	name: 'adSets.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adsets`,
	input: MetaAdsEndpointInputSchemas.adSetsCreate,
	output: MetaAdsMutationSchema,
	request: (input) => ({
		...keyedForm(
			{
				campaign_id: input.campaignId,
				name: input.name,
				optimization_goal: input.optimizationGoal,
				billing_event: input.billingEvent,
				targeting: input.targeting,
				status: input.status ?? 'PAUSED',
				daily_budget: input.dailyBudget,
				lifetime_budget: input.lifetimeBudget,
				start_time: input.startTime,
				end_time: input.endTime,
			},
			input.idempotencyKey,
		),
		redactBodyOnError: true,
	}),
});
export const adSetsUpdate = operation({
	name: 'adSets.update',
	method: 'POST',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({
			name: input.name,
			status: input.status,
			daily_budget: input.dailyBudget,
			lifetime_budget: input.lifetimeBudget,
			end_time: input.endTime,
		}),
});
export const adSetsDelete = operation({
	name: 'adSets.delete',
	method: 'DELETE',
	path: (input) => idPath(input.adSetId),
	input: MetaAdsEndpointInputSchemas.adSetsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const adsList = operation({
	name: 'ads.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/ads`,
	input: MetaAdsEndpointInputSchemas.adsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adsAdCreativesList = operation({
	name: 'ads.adCreativesList',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.adsAdCreativesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: cursorParams(input) }),
});
export const adsAdStudiesList = operation({
	name: 'ads.adStudiesList',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/ad_studies`,
	input: MetaAdsEndpointInputSchemas.adsAdStudiesList,
	output: MetaAdsEndpointOutputSchemas.adsAdStudiesList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const adsAdRulesGovernedList = operation({
	name: 'ads.adRulesGovernedList',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/adrules_governed`,
	input: MetaAdsEndpointInputSchemas.adsAdRulesGovernedList,
	output: MetaAdsEndpointOutputSchemas.adsAdRulesGovernedList,
	request: (input) => ({
		query: {
			pass_evaluation: input.passEvaluation,
			...cursorParams(input),
		},
	}),
});
export const adsPreviewsList = operation({
	name: 'ads.previewsList',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/previews`,
	input: MetaAdsEndpointInputSchemas.adsPreviewsList,
	output: MetaAdsEndpointOutputSchemas.adsPreviewsList,
	request: previewRequest,
});
export const adsCopiesList = operation({
	name: 'ads.copiesList',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/copies`,
	input: MetaAdsEndpointInputSchemas.adsCopiesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const adsCopy = operation({
	name: 'ads.copy',
	method: 'POST',
	path: (input) => `${idPath(input.adId)}/copies`,
	input: MetaAdsEndpointInputSchemas.adsCopy,
	output: MetaAdsEndpointOutputSchemas.adsCopy,
	request: (input) => ({
		body: {
			status_option: 'PAUSED',
			...(input.adSetId !== undefined ? { adset_id: input.adSetId } : {}),
			...(input.renameOptions
				? {
						rename_options: {
							rename_strategy: input.renameOptions.renameStrategy,
							rename_prefix: input.renameOptions.renamePrefix,
							rename_suffix: input.renameOptions.renameSuffix,
						},
					}
				: {}),
		},
	}),
});
export const adsGet = operation({
	name: 'ads.get',
	method: 'GET',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const adsCreate = operation({
	name: 'ads.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/ads`,
	input: MetaAdsEndpointInputSchemas.adsCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			{
				name: input.name,
				adset_id: input.adSetId,
				conversion_domain: input.conversionDomain,
				// Meta's Ad Account ads edge requires this AdCreative envelope for inline specs.
				creative:
					input.creativeId !== undefined
						? { creative_id: input.creativeId }
						: {
								creative: {
									name: input.creativeSpec?.name,
									object_story_spec: input.creativeSpec?.objectStorySpec,
									authorization_category:
										input.creativeSpec?.authorizationCategory,
								},
							},
				status: input.status ?? 'PAUSED',
			},
			input.idempotencyKey,
		),
});
export const adsUpdate = operation({
	name: 'ads.update',
	method: 'POST',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) => form({ name: input.name, status: input.status }),
});
export const adsDelete = operation({
	name: 'ads.delete',
	method: 'DELETE',
	path: (input) => idPath(input.adId),
	input: MetaAdsEndpointInputSchemas.adsDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});

export const creativesList = operation({
	name: 'creatives.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.creativesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const creativesGet = operation({
	name: 'creatives.get',
	method: 'GET',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const creativesCreate = operation({
	name: 'creatives.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/adcreatives`,
	input: MetaAdsEndpointInputSchemas.creativesCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		keyedForm(
			input.objectStoryId !== undefined
				? {
						name: input.name,
						object_story_id: input.objectStoryId,
						authorization_category: input.authorizationCategory,
					}
				: {
						name: input.name,
						object_story_spec: input.objectStorySpec,
						authorization_category: input.authorizationCategory,
					},
			input.idempotencyKey,
		),
});
export const creativesUpdate = operation({
	name: 'creatives.update',
	method: 'POST',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) => form({ name: input.name }),
});
export const creativesDelete = operation({
	name: 'creatives.delete',
	method: 'DELETE',
	path: (input) => idPath(input.creativeId),
	input: MetaAdsEndpointInputSchemas.creativesDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});
export const creativesInsightsList = operation({
	name: 'creatives.insightsList',
	method: 'GET',
	path: (input) => `${idPath(input.creativeId)}/creative_insights`,
	input: MetaAdsEndpointInputSchemas.creativesInsightsList,
	output: MetaAdsEndpointOutputSchemas.creativesInsightsList,
	request: (input) => ({ query: cursorParams(input) }),
});
export const creativesPreviewsList = operation({
	name: 'creatives.previewsList',
	method: 'GET',
	path: (input) => `${idPath(input.creativeId)}/previews`,
	input: MetaAdsEndpointInputSchemas.creativesPreviewsList,
	output: MetaAdsEndpointOutputSchemas.creativesPreviewsList,
	request: previewRequest,
});

export const audiencesList = operation({
	name: 'audiences.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/customaudiences`,
	input: MetaAdsEndpointInputSchemas.audiencesList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const audiencesAdsList = operation({
	name: 'audiences.adsList',
	method: 'GET',
	path: (input) => `${idPath(input.audienceId)}/ads`,
	input: MetaAdsEndpointInputSchemas.audiencesAdsList,
	output: MetaAdsListSchema,
	request: (input) => ({ query: pageParams(input) }),
});
export const audiencesAdAccountsList = operation({
	name: 'audiences.adAccountsList',
	method: 'GET',
	path: (input) => `${idPath(input.audienceId)}/adaccounts`,
	input: MetaAdsEndpointInputSchemas.audiencesAdAccountsList,
	output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsList,
	request: (input) => ({
		query: {
			permissions: input.permissions,
			...pageParams(input),
		},
	}),
});
export const audiencesGet = operation({
	name: 'audiences.get',
	method: 'GET',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesGet,
	output: MetaAdsObjectSchema,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const audiencesCreate = operation({
	name: 'audiences.create',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/customaudiences`,
	input: MetaAdsEndpointInputSchemas.audiencesCreate,
	output: MetaAdsMutationSchema,
	request: (input) =>
		form({
			name: input.name,
			description: input.description,
			customer_file_source: input.customerFileSource,
			subtype: input.subtype,
		}),
});
export const audiencesAcceptTerms = operation({
	name: 'audiences.acceptTerms',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/customaudiencestos`,
	input: MetaAdsEndpointInputSchemas.audiencesAcceptTerms,
	output: MetaAdsEndpointOutputSchemas.audiencesAcceptTerms,
	request: (input) =>
		form({ tos_id: input.termsId, business_id: input.businessId }),
});
export const audiencesUpdate = operation({
	name: 'audiences.update',
	method: 'POST',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesUpdate,
	output: MetaAdsDeleteSchema,
	request: (input) =>
		form({ name: input.name, description: input.description }),
});
export const audiencesDelete = operation({
	name: 'audiences.delete',
	method: 'DELETE',
	path: (input) => idPath(input.audienceId),
	input: MetaAdsEndpointInputSchemas.audiencesDelete,
	output: MetaAdsDeleteSchema,
	request: emptyRequest,
});
export const audiencesSessionsList = operation({
	name: 'audiences.sessionsList',
	method: 'GET',
	path: (input) => `${idPath(input.audienceId)}/sessions`,
	input: MetaAdsEndpointInputSchemas.audiencesSessionsList,
	output: MetaAdsEndpointOutputSchemas.audiencesSessionsList,
	request: (input) => ({
		query: {
			session_id: input.sessionId,
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const audiencesUsersAdd = operation({
	name: 'audiences.usersAdd',
	method: 'POST',
	path: (input) => `${idPath(input.audienceId)}/users`,
	input: MetaAdsEndpointInputSchemas.audiencesUsersAdd,
	output: MetaAdsEndpointOutputSchemas.audiencesUsersAdd,
	request: (input) => ({
		body: {
			session: {
				session_id: input.sessionId,
				batch_seq: input.batchSequence,
				last_batch_flag: input.lastBatch,
				estimated_num_total: input.estimatedTotal,
			},
			payload: {
				schema: input.schema,
				data: input.hashes.map((hash) => [hash]),
			},
		},
		redactBodyOnError: true,
		sensitiveValues: input.hashes,
	}),
});
export const audiencesUsersRemove = operation({
	name: 'audiences.usersRemove',
	method: 'DELETE',
	path: (input) => `${idPath(input.audienceId)}/users`,
	input: MetaAdsEndpointInputSchemas.audiencesUsersRemove,
	output: MetaAdsEndpointOutputSchemas.audiencesUsersRemove,
	request: (input) => ({
		encodedBody: new URLSearchParams({
			payload: JSON.stringify({ schema: input.schema, data: input.hashes }),
		}).toString(),
		redactBodyOnError: true,
		sensitiveValues: input.hashes,
	}),
});
export const audiencesUsersReplace = operation({
	name: 'audiences.usersReplace',
	method: 'POST',
	path: (input) => `${idPath(input.audienceId)}/usersreplace`,
	input: MetaAdsEndpointInputSchemas.audiencesUsersReplace,
	output: MetaAdsEndpointOutputSchemas.audiencesUsersReplace,
	request: (input) => ({
		body: {
			session: {
				session_id: input.sessionId,
				batch_seq: input.batchSequence,
				last_batch_flag: input.lastBatch,
				estimated_num_total: input.estimatedTotal,
			},
			payload: {
				schema: input.schema,
				data: input.hashes.map((hash) => [hash]),
			},
		},
		redactBodyOnError: true,
		sensitiveValues: input.hashes,
	}),
});
export const audiencesAdAccountsShare = operation({
	name: 'audiences.adAccountsShare',
	method: 'POST',
	path: (input) => `${idPath(input.audienceId)}/ad_accounts`,
	input: MetaAdsEndpointInputSchemas.audiencesAdAccountsShare,
	output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsShare,
	request: (input) => ({
		body: {
			adaccounts: JSON.stringify(input.adAccountIds),
			permissions: input.permissions,
			replace: input.replace,
		},
	}),
});
export const audiencesAdAccountsUnshare = operation({
	name: 'audiences.adAccountsUnshare',
	method: 'DELETE',
	path: (input) => `${idPath(input.audienceId)}/ad_accounts`,
	input: MetaAdsEndpointInputSchemas.audiencesAdAccountsUnshare,
	output: MetaAdsEndpointOutputSchemas.audiencesAdAccountsUnshare,
	request: (input) => ({
		encodedBody: new URLSearchParams({
			adaccounts: JSON.stringify(input.adAccountIds),
		}).toString(),
	}),
});
export const studiesGet = operation({
	name: 'studies.get',
	method: 'GET',
	path: (input) => idPath(input.studyId),
	input: MetaAdsEndpointInputSchemas.studiesGet,
	output: MetaAdsEndpointOutputSchemas.studiesGet,
	request: (input) => ({ query: { fields: input.fields } }),
});
export const studiesCreate = operation({
	name: 'studies.create',
	method: 'POST',
	path: (input) => `${idPath(input.businessId)}/ad_studies`,
	input: MetaAdsEndpointInputSchemas.studiesCreate,
	output: MetaAdsEndpointOutputSchemas.studiesCreate,
	request: (input) => ({
		body: {
			name: input.name,
			description: input.description,
			start_time: input.startTime,
			end_time: input.endTime,
			type: input.type,
			cells: JSON.stringify(
				input.cells.map((cell) => ({
					name: cell.name,
					treatment_percentage: cell.treatmentPercentage,
					control_percentage: cell.controlPercentage,
					adsets: cell.adSetIds,
				})),
			),
		},
	}),
});
export const studiesUpdate = operation({
	name: 'studies.update',
	method: 'POST',
	path: (input) => idPath(input.studyId),
	input: MetaAdsEndpointInputSchemas.studiesUpdate,
	output: MetaAdsEndpointOutputSchemas.studiesUpdate,
	request: (input) => ({
		body: {
			name: input.name,
			description: input.description,
			end_time: input.endTime,
		},
	}),
});
export const studiesRelatedAccountsList = operation({
	name: 'studies.relatedAccountsList',
	method: 'GET',
	path: (input) => `${idPath(input.studyId)}/related_ad_accounts`,
	input: MetaAdsEndpointInputSchemas.studiesRelatedAccountsList,
	output: MetaAdsEndpointOutputSchemas.studiesRelatedAccountsList,
	request: emptyRequest,
});
export const studiesViewersList = operation({
	name: 'studies.viewersList',
	method: 'GET',
	path: (input) => `${idPath(input.studyId)}/viewers`,
	input: MetaAdsEndpointInputSchemas.studiesViewersList,
	output: MetaAdsEndpointOutputSchemas.studiesViewersList,
	request: emptyRequest,
});

type InsightParamsInput = Omit<
	MetaAdsEndpointInputs['insightsList'],
	'accountId' | 'limit' | 'after' | 'before'
>;

function insightsParams(input: InsightParamsInput) {
	return {
		fields: input.fields.join(','),
		date_preset: input.datePreset,
		time_range:
			input.since || input.until
				? JSON.stringify({ since: input.since, until: input.until })
				: undefined,
		level: input.level,
		breakdowns: input.breakdowns?.join(','),
		action_breakdowns: input.actionBreakdowns?.join(','),
		action_attribution_windows: input.actionAttributionWindows?.join(','),
		filtering: input.filtering ? JSON.stringify(input.filtering) : undefined,
		time_increment: input.timeIncrement,
		sort: input.sort?.join(','),
		summary: input.summary?.join(','),
		summary_action_breakdowns: input.summaryActionBreakdowns?.join(','),
		default_summary: input.defaultSummary,
		product_id_limit: input.productIdLimit,
	};
}

export const insightsList = operation({
	name: 'insights.list',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsList,
	output: InsightsListSchema,
	request: (input) => ({
		query: {
			...insightsParams(input),
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const insightsListForCampaign = operation({
	name: 'insights.listForCampaign',
	method: 'GET',
	path: (input) => `${idPath(input.campaignId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsListForCampaign,
	output: InsightsListSchema,
	request: (input) => ({
		query: {
			...insightsParams(input),
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const insightsListForAdSet = operation({
	name: 'insights.listForAdSet',
	method: 'GET',
	path: (input) => `${idPath(input.adSetId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsListForAdSet,
	output: InsightsListSchema,
	request: (input) => ({
		query: {
			...insightsParams(input),
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const insightsListForAd = operation({
	name: 'insights.listForAd',
	method: 'GET',
	path: (input) => `${idPath(input.adId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsListForAd,
	output: InsightsListSchema,
	request: (input) => ({
		query: {
			...insightsParams(input),
			limit: input.limit,
			after: input.after,
			before: input.before,
		},
	}),
});
export const insightsCreateAsync = operation({
	name: 'insights.createAsync',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsCreateAsync,
	output: MetaAdsEndpointOutputSchemas.insightsCreateAsync,
	request: (input) => ({ body: insightsParams(input) }),
});
export const insightsGetAsyncReport = operation({
	name: 'insights.getAsyncReport',
	method: 'GET',
	path: (input) => idPath(input.reportRunId),
	input: MetaAdsEndpointInputSchemas.insightsGetAsyncReport,
	output: MetaAdsEndpointOutputSchemas.insightsGetAsyncReport,
	request: (input) => ({ query: { fields: input.fields?.join(',') } }),
});
export const insightsGetAsyncResults = operation({
	name: 'insights.getAsyncResults',
	method: 'GET',
	path: (input) => `${idPath(input.reportRunId)}/insights`,
	input: MetaAdsEndpointInputSchemas.insightsGetAsyncResults,
	output: MetaAdsEndpointOutputSchemas.insightsGetAsyncResults,
	request: (input) => ({
		query: { limit: input.limit, after: input.after, before: input.before },
	}),
});
export const insightsListFeatures = operation({
	name: 'insights.listFeatures',
	method: 'GET',
	path: (input) =>
		`${accountPath(input.accountId)}/insights/feature-settings/list-features`,
	input: MetaAdsEndpointInputSchemas.insightsListFeatures,
	output: MetaAdsEndpointOutputSchemas.insightsListFeatures,
	request: (input) => ({ query: cursorParams(input) }),
});
export const insightsListEnabledFeatures = operation({
	name: 'insights.listEnabledFeatures',
	method: 'GET',
	path: (input) => `${accountPath(input.accountId)}/insights/feature-settings`,
	input: MetaAdsEndpointInputSchemas.insightsListEnabledFeatures,
	output: MetaAdsEndpointOutputSchemas.insightsListEnabledFeatures,
	request: (input) => ({ query: cursorParams(input) }),
});
export const insightsEnableFeature = operation({
	name: 'insights.enableFeature',
	method: 'POST',
	path: (input) => `${accountPath(input.accountId)}/insights/feature-settings`,
	input: MetaAdsEndpointInputSchemas.insightsEnableFeature,
	output: MetaAdsEndpointOutputSchemas.insightsEnableFeature,
	request: (input) => ({ body: { feature_name: input.featureName } }),
});

export const Accounts = {
	list: accountsList,
	get: accountsGet,
	usersList: accountsUsersList,
	assignedUsersList: accountsAssignedUsersList,
	assignUser: accountsAssignUser,
	removeUser: accountsRemoveUser,
	controlsCreate: accountsControlsCreate,
	agenciesList: accountsAgenciesList,
	agencyRemove: accountsAgencyRemove,
	subscribedAppUpdate: accountsSubscribedAppUpdate,
	subscribedAppRemove: accountsSubscribedAppRemove,
	trackingCreate: accountsTrackingCreate,
	pixelsList: accountsPixelsList,
	activitiesList: accountsActivitiesList,
	impactingAdStudiesList: accountsImpactingAdStudiesList,
	adRulesLibraryList: accountsAdRulesLibraryList,
	adRulesLibraryCreate: accountsAdRulesLibraryCreate,
	activeAdRulesList: accountsActiveAdRulesList,
	generatePreviews: accountsGeneratePreviews,
	broadTargetingCategoriesList: accountsBroadTargetingCategoriesList,
	smartSuggestedAdsList: accountsSmartSuggestedAdsList,
	suggestedAdsList: accountsSuggestedAdsList,
	placePageSetsCreate: accountsPlacePageSetsCreate,
	reachEstimate: accountsReachEstimate,
};
export const Labels = {
	list: labelsList,
	get: labelsGet,
	create: labelsCreate,
	update: labelsUpdate,
	delete: labelsDelete,
	adsList: labelsAdsList,
	adSetsList: labelsAdSetsList,
	campaignsList: labelsCampaignsList,
	creativesList: labelsCreativesList,
};
export const Images = {
	list: imagesList,
	upload: imagesUpload,
	delete: imagesDelete,
};
export const Pixels = {
	create: pixelsCreate,
	get: pixelsGet,
	update: pixelsUpdate,
};
export const PublisherBlockLists = { create: publisherBlockListsCreate };
export const ReachFrequencyPredictions = {
	get: reachFrequencyPredictionGet,
	list: reachFrequencyPredictionsList,
	create: reachFrequencyPredictionCreate,
};
export const CustomConversions = { create: customConversionsCreate };
export const Campaigns = {
	list: campaignsList,
	adSetsList: campaignsAdSetsList,
	adsList: campaignsAdsList,
	copiesList: campaignsCopiesList,
	copy: campaignsCopy,
	labelsAdd: campaignsLabelsAdd,
	budgetSchedulesList: campaignsBudgetSchedulesList,
	budgetScheduleCreate: campaignsBudgetScheduleCreate,
	adStudiesList: campaignsAdStudiesList,
	adRulesGovernedList: campaignsAdRulesGovernedList,
	get: campaignsGet,
	create: campaignsCreate,
	update: campaignsUpdate,
	delete: campaignsDelete,
};
export const HighDemandPeriods = { get: highDemandPeriodsGet };
export const AdSets = {
	list: adSetsList,
	adsList: adSetsAdsList,
	adCreativesList: adSetsAdCreativesList,
	copiesList: adSetsCopiesList,
	copy: adSetsCopy,
	budgetSchedulesList: adSetsBudgetSchedulesList,
	budgetScheduleCreate: adSetsBudgetScheduleCreate,
	activitiesList: adSetsActivitiesList,
	adStudiesList: adSetsAdStudiesList,
	adRulesGovernedList: adSetsAdRulesGovernedList,
	get: adSetsGet,
	create: adSetsCreate,
	update: adSetsUpdate,
	delete: adSetsDelete,
};
export const Ads = {
	list: adsList,
	adCreativesList: adsAdCreativesList,
	adStudiesList: adsAdStudiesList,
	adRulesGovernedList: adsAdRulesGovernedList,
	previewsList: adsPreviewsList,
	copiesList: adsCopiesList,
	copy: adsCopy,
	labelsAdd: adsLabelsAdd,
	get: adsGet,
	create: adsCreate,
	update: adsUpdate,
	delete: adsDelete,
};
export const Creatives = {
	list: creativesList,
	get: creativesGet,
	create: creativesCreate,
	update: creativesUpdate,
	delete: creativesDelete,
	labelsAdd: creativesLabelsAdd,
	insightsList: creativesInsightsList,
	previewsList: creativesPreviewsList,
};
export const Audiences = {
	list: audiencesList,
	adsList: audiencesAdsList,
	adAccountsList: audiencesAdAccountsList,
	get: audiencesGet,
	create: audiencesCreate,
	acceptTerms: audiencesAcceptTerms,
	update: audiencesUpdate,
	delete: audiencesDelete,
	sessionsList: audiencesSessionsList,
	usersAdd: audiencesUsersAdd,
	usersRemove: audiencesUsersRemove,
	usersReplace: audiencesUsersReplace,
	adAccountsShare: audiencesAdAccountsShare,
	adAccountsUnshare: audiencesAdAccountsUnshare,
};
export const Studies = {
	get: studiesGet,
	create: studiesCreate,
	update: studiesUpdate,
	relatedAccountsList: studiesRelatedAccountsList,
	viewersList: studiesViewersList,
};
export const Videos = { delete: videosDelete };
export const AsyncCreatives = {
	list: asyncCreativesList,
	create: asyncCreativesCreate,
};
export const AsyncRequestSets = {
	list: asyncRequestSetsList,
	create: asyncRequestSetsCreate,
	get: asyncRequestSetsGet,
	update: asyncRequestSetsUpdate,
	cancel: asyncRequestSetsCancel,
};
export const AsyncRequests = {
	listForSet: asyncRequestsListForSet,
	listForAdSet: asyncRequestsListForAdSet,
	cancel: asyncRequestsCancel,
};
export const Insights = {
	list: insightsList,
	listForCampaign: insightsListForCampaign,
	listForAdSet: insightsListForAdSet,
	listForAd: insightsListForAd,
	createAsync: insightsCreateAsync,
	getAsyncReport: insightsGetAsyncReport,
	getAsyncResults: insightsGetAsyncResults,
	listFeatures: insightsListFeatures,
	listEnabledFeatures: insightsListEnabledFeatures,
	enableFeature: insightsEnableFeature,
};
