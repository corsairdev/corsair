import { z } from 'zod';

// Algolia response payloads vary across 133 endpoints; per-route schemas are not yet mapped from API docs.
const AlgoliaResponseSchema = z.unknown();
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const AlgoliaOptionalBodySchema = z.unknown().optional();

// addAbTest
const AddAbTestInputSchema = z.object({
	name: z.string(),
	endAt: z.string(),
	region: z.string().optional(),
	variants: z.array(
		z.object({ indexName: z.string(), trafficPercentage: z.number() }).loose(),
	),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type AddAbTestInput = z.infer<typeof AddAbTestInputSchema>;
const AddAbTestResponseSchema = AlgoliaResponseSchema;
export type AddAbTestResponse = z.infer<typeof AddAbTestResponseSchema>;

// addOrReplaceRecord
const AddOrReplaceRecordInputSchema = z.object({
	record: z.record(z.string(), z.unknown()),
	object_id: z.string(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type AddOrReplaceRecordInput = z.infer<
	typeof AddOrReplaceRecordInputSchema
>;
const AddOrReplaceRecordResponseSchema = AlgoliaResponseSchema;
export type AddOrReplaceRecordResponse = z.infer<
	typeof AddOrReplaceRecordResponseSchema
>;

// addRecord
const AddRecordInputSchema = z.object({
	record: z.record(z.string(), z.unknown()),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type AddRecordInput = z.infer<typeof AddRecordInputSchema>;
const AddRecordResponseSchema = AlgoliaResponseSchema;
export type AddRecordResponse = z.infer<typeof AddRecordResponseSchema>;

// browseIndex
const BrowseIndexInputSchema = z.object({
	query: z.string().optional(),
	cursor: z.string().optional(),
	index_name: z.string(),
	browse_parameters: z.record(z.string(), z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type BrowseIndexInput = z.infer<typeof BrowseIndexInputSchema>;
const BrowseIndexResponseSchema = AlgoliaResponseSchema;
export type BrowseIndexResponse = z.infer<typeof BrowseIndexResponseSchema>;

// clearObjects
const ClearObjectsInputSchema = z.object({
	index_name: z.string(),
	request_options: z.record(z.string(), z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ClearObjectsInput = z.infer<typeof ClearObjectsInputSchema>;
const ClearObjectsResponseSchema = AlgoliaResponseSchema;
export type ClearObjectsResponse = z.infer<typeof ClearObjectsResponseSchema>;

// clearRules
const ClearRulesInputSchema = z.object({
	index_name: z.string(),
	forwardToReplicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ClearRulesInput = z.infer<typeof ClearRulesInputSchema>;
const ClearRulesResponseSchema = AlgoliaResponseSchema;
export type ClearRulesResponse = z.infer<typeof ClearRulesResponseSchema>;

// clearSynonyms
const ClearSynonymsInputSchema = z.object({
	index_name: z.string(),
	forwardToReplicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ClearSynonymsInput = z.infer<typeof ClearSynonymsInputSchema>;
const ClearSynonymsResponseSchema = AlgoliaResponseSchema;
export type ClearSynonymsResponse = z.infer<typeof ClearSynonymsResponseSchema>;

// clickedObjectIds
const ClickedObjectIdsInputSchema = z.object({
	eventName: z.string(),
	indexName: z.string(),
	objectIDs: z.array(z.string()),
	userToken: z.string(),
	authenticatedUserToken: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ClickedObjectIdsInput = z.infer<typeof ClickedObjectIdsInputSchema>;
const ClickedObjectIdsResponseSchema = AlgoliaResponseSchema;
export type ClickedObjectIdsResponse = z.infer<
	typeof ClickedObjectIdsResponseSchema
>;

// clickedObjectIdsAfterSearch
const ClickedObjectIdsAfterSearchInputSchema = z.object({
	index: z.string(),
	queryID: z.string(),
	eventName: z.string(),
	objectIDs: z.array(z.string()),
	positions: z.array(z.number()),
	timestamp: z.number().int().optional(),
	userToken: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ClickedObjectIdsAfterSearchInput = z.infer<
	typeof ClickedObjectIdsAfterSearchInputSchema
>;
const ClickedObjectIdsAfterSearchResponseSchema = AlgoliaResponseSchema;
export type ClickedObjectIdsAfterSearchResponse = z.infer<
	typeof ClickedObjectIdsAfterSearchResponseSchema
>;

// computeRealtimeUser
const ComputeRealtimeUserInputSchema = z.object({
	user_token: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ComputeRealtimeUserInput = z.infer<
	typeof ComputeRealtimeUserInputSchema
>;
const ComputeRealtimeUserResponseSchema = AlgoliaResponseSchema;
export type ComputeRealtimeUserResponse = z.infer<
	typeof ComputeRealtimeUserResponseSchema
>;

// convertedObjectIds
const ConvertedObjectIdsInputSchema = z.object({
	index: z.string(),
	eventName: z.string(),
	objectIDs: z.array(z.string()),
	timestamp: z.number().int().optional(),
	userToken: z.string(),
	authenticatedUserToken: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ConvertedObjectIdsInput = z.infer<
	typeof ConvertedObjectIdsInputSchema
>;
const ConvertedObjectIdsResponseSchema = AlgoliaResponseSchema;
export type ConvertedObjectIdsResponse = z.infer<
	typeof ConvertedObjectIdsResponseSchema
>;

// copyIndex
const CopyIndexInputSchema = z.object({
	scope: z.array(z.unknown()).optional(),
	index_name: z.string(),
	destination: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CopyIndexInput = z.infer<typeof CopyIndexInputSchema>;
const CopyIndexResponseSchema = AlgoliaResponseSchema;
export type CopyIndexResponse = z.infer<typeof CopyIndexResponseSchema>;

// createApiKey
const CreateApiKeyInputSchema = z.object({
	acl: z.array(z.string()),
	indexes: z.array(z.string()).optional(),
	referers: z.array(z.string()).optional(),
	validity: z.number().int().optional(),
	description: z.string().optional(),
	maxHitsPerQuery: z.number().int().optional(),
	queryParameters: z.string().optional(),
	maxQueriesPerIPPerHour: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateApiKeyInput = z.infer<typeof CreateApiKeyInputSchema>;
const CreateApiKeyResponseSchema = AlgoliaResponseSchema;
export type CreateApiKeyResponse = z.infer<typeof CreateApiKeyResponseSchema>;

// createAuthentication
const CreateAuthenticationInputSchema = z.object({
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()),
	platform: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateAuthenticationInput = z.infer<
	typeof CreateAuthenticationInputSchema
>;
const CreateAuthenticationResponseSchema = AlgoliaResponseSchema;
export type CreateAuthenticationResponse = z.infer<
	typeof CreateAuthenticationResponseSchema
>;

// createDestination
const CreateDestinationInputSchema = z.object({
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()),
	authenticationID: z.string(),
	transformationIDs: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateDestinationInput = z.infer<
	typeof CreateDestinationInputSchema
>;
const CreateDestinationResponseSchema = AlgoliaResponseSchema;
export type CreateDestinationResponse = z.infer<
	typeof CreateDestinationResponseSchema
>;

// createIngestionTask
const CreateIngestionTaskInputSchema = z.object({
	cron: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	action: z.string().optional(),
	cursor: z.string().optional(),
	enabled: z.boolean().optional(),
	policies: z.record(z.string(), z.unknown()).optional(),
	sourceID: z.string(),
	destinationID: z.string(),
	notifications: z.record(z.string(), z.unknown()).optional(),
	failureThreshold: z.number().int().optional(),
	subscriptionAction: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateIngestionTaskInput = z.infer<
	typeof CreateIngestionTaskInputSchema
>;
const CreateIngestionTaskResponseSchema = AlgoliaResponseSchema;
export type CreateIngestionTaskResponse = z.infer<
	typeof CreateIngestionTaskResponseSchema
>;

// createOrUpdateRecommendRules
const CreateOrUpdateRecommendRulesInputSchema = z.object({
	model: z.string().optional(),
	rules: z.array(z.object({ objectID: z.string() }).loose()),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateOrUpdateRecommendRulesInput = z.infer<
	typeof CreateOrUpdateRecommendRulesInputSchema
>;
const CreateOrUpdateRecommendRulesResponseSchema = AlgoliaResponseSchema;
export type CreateOrUpdateRecommendRulesResponse = z.infer<
	typeof CreateOrUpdateRecommendRulesResponseSchema
>;

// createQsConfig
const CreateQsConfigInputSchema = z.object({
	region: z.string().optional(),
	exclude: z.array(z.unknown()).optional(),
	indexName: z.string(),
	languages: z.string().optional(),
	sourceIndices: z.array(z.unknown()),
	enablePersonalization: z.boolean().optional(),
	allowSpecialCharacters: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type CreateQsConfigInput = z.infer<typeof CreateQsConfigInputSchema>;
const CreateQsConfigResponseSchema = AlgoliaResponseSchema;
export type CreateQsConfigResponse = z.infer<
	typeof CreateQsConfigResponseSchema
>;

// createSource
const CreateSourceInputSchema = z.object({
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	region: z.string().optional(),
	authenticationID: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type CreateSourceInput = z.infer<typeof CreateSourceInputSchema>;
const CreateSourceResponseSchema = AlgoliaResponseSchema;
export type CreateSourceResponse = z.infer<typeof CreateSourceResponseSchema>;

// createTransformation
const CreateTransformationInputSchema = z.object({
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()),
	description: z.string().optional(),
	authenticationIDs: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type CreateTransformationInput = z.infer<
	typeof CreateTransformationInputSchema
>;
const CreateTransformationResponseSchema = AlgoliaResponseSchema;
export type CreateTransformationResponse = z.infer<
	typeof CreateTransformationResponseSchema
>;

// deleteAbTest
const DeleteAbTestInputSchema = z.object({
	id: z.number().int(),
	region: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type DeleteAbTestInput = z.infer<typeof DeleteAbTestInputSchema>;
const DeleteAbTestResponseSchema = AlgoliaResponseSchema;
export type DeleteAbTestResponse = z.infer<typeof DeleteAbTestResponseSchema>;

// deleteApiKey
const DeleteApiKeyInputSchema = z.object({
	key: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteApiKeyInput = z.infer<typeof DeleteApiKeyInputSchema>;
const DeleteApiKeyResponseSchema = AlgoliaResponseSchema;
export type DeleteApiKeyResponse = z.infer<typeof DeleteApiKeyResponseSchema>;

// deleteAuthentication
const DeleteAuthenticationInputSchema = z.object({
	authenticationID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteAuthenticationInput = z.infer<
	typeof DeleteAuthenticationInputSchema
>;
const DeleteAuthenticationResponseSchema = AlgoliaResponseSchema;
export type DeleteAuthenticationResponse = z.infer<
	typeof DeleteAuthenticationResponseSchema
>;

// deleteConfig
const DeleteConfigInputSchema = z.object({
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteConfigInput = z.infer<typeof DeleteConfigInputSchema>;
const DeleteConfigResponseSchema = AlgoliaResponseSchema;
export type DeleteConfigResponse = z.infer<typeof DeleteConfigResponseSchema>;

// deleteDestination
const DeleteDestinationInputSchema = z.object({
	destination_id: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteDestinationInput = z.infer<
	typeof DeleteDestinationInputSchema
>;
const DeleteDestinationResponseSchema = AlgoliaResponseSchema;
export type DeleteDestinationResponse = z.infer<
	typeof DeleteDestinationResponseSchema
>;

// deleteIndex
const DeleteIndexInputSchema = z.object({
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteIndexInput = z.infer<typeof DeleteIndexInputSchema>;
const DeleteIndexResponseSchema = AlgoliaResponseSchema;
export type DeleteIndexResponse = z.infer<typeof DeleteIndexResponseSchema>;

// deleteObjects
const DeleteObjectsInputSchema = z.object({
	index_name: z.string(),
	object_ids: z.array(z.unknown()),
	request_options: z.record(z.string(), z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteObjectsInput = z.infer<typeof DeleteObjectsInputSchema>;
const DeleteObjectsResponseSchema = AlgoliaResponseSchema;
export type DeleteObjectsResponse = z.infer<typeof DeleteObjectsResponseSchema>;

// deleteRecommendRule
const DeleteRecommendRuleInputSchema = z.object({
	model: z.string().optional(),
	object_id: z.string(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteRecommendRuleInput = z.infer<
	typeof DeleteRecommendRuleInputSchema
>;
const DeleteRecommendRuleResponseSchema = AlgoliaResponseSchema;
export type DeleteRecommendRuleResponse = z.infer<
	typeof DeleteRecommendRuleResponseSchema
>;

// deleteRecordsByFilter
const DeleteRecordsByFilterInputSchema = z.object({
	filters: z.string().optional(),
	index_name: z.string(),
	tag_filters: z.string().optional(),
	around_radius: z.string().optional(),
	facet_filters: z.string().optional(),
	around_lat_lng: z.string().optional(),
	inside_polygon: z.array(z.unknown()).optional(),
	numeric_filters: z.string().optional(),
	request_options: z.record(z.string(), z.unknown()).optional(),
	inside_bounding_box: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteRecordsByFilterInput = z.infer<
	typeof DeleteRecordsByFilterInputSchema
>;
const DeleteRecordsByFilterResponseSchema = AlgoliaResponseSchema;
export type DeleteRecordsByFilterResponse = z.infer<
	typeof DeleteRecordsByFilterResponseSchema
>;

// deleteRule
const DeleteRuleInputSchema = z.object({
	object_id: z.string(),
	index_name: z.string(),
	forward_to_replicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteRuleInput = z.infer<typeof DeleteRuleInputSchema>;
const DeleteRuleResponseSchema = AlgoliaResponseSchema;
export type DeleteRuleResponse = z.infer<typeof DeleteRuleResponseSchema>;

// deleteSource
const DeleteSourceInputSchema = z.object({
	sourceID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteSourceInput = z.infer<typeof DeleteSourceInputSchema>;
const DeleteSourceResponseSchema = AlgoliaResponseSchema;
export type DeleteSourceResponse = z.infer<typeof DeleteSourceResponseSchema>;

// deleteSynonym
const DeleteSynonymInputSchema = z.object({
	object_id: z.string(),
	index_name: z.string(),
	forward_to_replicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteSynonymInput = z.infer<typeof DeleteSynonymInputSchema>;
const DeleteSynonymResponseSchema = AlgoliaResponseSchema;
export type DeleteSynonymResponse = z.infer<typeof DeleteSynonymResponseSchema>;

// deleteTransformation
const DeleteTransformationInputSchema = z.object({
	transformation_id: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteTransformationInput = z.infer<
	typeof DeleteTransformationInputSchema
>;
const DeleteTransformationResponseSchema = AlgoliaResponseSchema;
export type DeleteTransformationResponse = z.infer<
	typeof DeleteTransformationResponseSchema
>;

// deleteUserProfile
const DeleteUserProfileInputSchema = z.object({
	user_token: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteUserProfileInput = z.infer<
	typeof DeleteUserProfileInputSchema
>;
const DeleteUserProfileResponseSchema = AlgoliaResponseSchema;
export type DeleteUserProfileResponse = z.infer<
	typeof DeleteUserProfileResponseSchema
>;

// deleteUserToken
const DeleteUserTokenInputSchema = z.object({
	user_token: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type DeleteUserTokenInput = z.infer<typeof DeleteUserTokenInputSchema>;
const DeleteUserTokenResponseSchema = AlgoliaResponseSchema;
export type DeleteUserTokenResponse = z.infer<
	typeof DeleteUserTokenResponseSchema
>;

// disableTaskV1
const DisableTaskV1InputSchema = z.object({
	region: z.string().optional(),
	taskID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type DisableTaskV1Input = z.infer<typeof DisableTaskV1InputSchema>;
const DisableTaskV1ResponseSchema = AlgoliaResponseSchema;
export type DisableTaskV1Response = z.infer<typeof DisableTaskV1ResponseSchema>;

// enableTaskV1
const EnableTaskV1InputSchema = z.object({
	region: z.string().optional(),
	taskID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type EnableTaskV1Input = z.infer<typeof EnableTaskV1InputSchema>;
const EnableTaskV1ResponseSchema = AlgoliaResponseSchema;
export type EnableTaskV1Response = z.infer<typeof EnableTaskV1ResponseSchema>;

// executeBatchOnMultipleIndices
const ExecuteBatchOnMultipleIndicesInputSchema = z.object({
	requests: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ExecuteBatchOnMultipleIndicesInput = z.infer<
	typeof ExecuteBatchOnMultipleIndicesInputSchema
>;
const ExecuteBatchOnMultipleIndicesResponseSchema = AlgoliaResponseSchema;
export type ExecuteBatchOnMultipleIndicesResponse = z.infer<
	typeof ExecuteBatchOnMultipleIndicesResponseSchema
>;

// exportRules
const ExportRulesInputSchema = z.object({
	cursor: z.string().optional(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ExportRulesInput = z.infer<typeof ExportRulesInputSchema>;
const ExportRulesResponseSchema = AlgoliaResponseSchema;
export type ExportRulesResponse = z.infer<typeof ExportRulesResponseSchema>;

// findObject
const FindObjectInputSchema = z.object({
	query: z.string().optional(),
	filters: z.record(z.string(), z.unknown()).optional(),
	paginate: z.boolean().optional(),
	index_name: z.string(),
	attributesToRetrieve: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type FindObjectInput = z.infer<typeof FindObjectInputSchema>;
const FindObjectResponseSchema = AlgoliaResponseSchema;
export type FindObjectResponse = z.infer<typeof FindObjectResponseSchema>;

// getAbTest
const GetAbTestInputSchema = z.object({
	id: z.number().int(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetAbTestInput = z.infer<typeof GetAbTestInputSchema>;
const GetAbTestResponseSchema = AlgoliaResponseSchema;
export type GetAbTestResponse = z.infer<typeof GetAbTestResponseSchema>;

// getAddToCartRate
const GetAddToCartRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetAddToCartRateInput = z.infer<typeof GetAddToCartRateInputSchema>;
const GetAddToCartRateResponseSchema = AlgoliaResponseSchema;
export type GetAddToCartRateResponse = z.infer<
	typeof GetAddToCartRateResponseSchema
>;

// getApiKey
const GetApiKeyInputSchema = z.object({
	key: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetApiKeyInput = z.infer<typeof GetApiKeyInputSchema>;
const GetApiKeyResponseSchema = AlgoliaResponseSchema;
export type GetApiKeyResponse = z.infer<typeof GetApiKeyResponseSchema>;

// getAppTask
const GetAppTaskInputSchema = z.object({
	taskID: z.number().int(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetAppTaskInput = z.infer<typeof GetAppTaskInputSchema>;
const GetAppTaskResponseSchema = AlgoliaResponseSchema;
export type GetAppTaskResponse = z.infer<typeof GetAppTaskResponseSchema>;

// getAuthentication
const GetAuthenticationInputSchema = z.object({
	region: z.string().optional(),
	authentication_id: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type GetAuthenticationInput = z.infer<
	typeof GetAuthenticationInputSchema
>;
const GetAuthenticationResponseSchema = AlgoliaResponseSchema;
export type GetAuthenticationResponse = z.infer<
	typeof GetAuthenticationResponseSchema
>;

// getAverageClickPosition
const GetAverageClickPositionInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetAverageClickPositionInput = z.infer<
	typeof GetAverageClickPositionInputSchema
>;
const GetAverageClickPositionResponseSchema = AlgoliaResponseSchema;
export type GetAverageClickPositionResponse = z.infer<
	typeof GetAverageClickPositionResponseSchema
>;

// getClickPositions
const GetClickPositionsInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetClickPositionsInput = z.infer<
	typeof GetClickPositionsInputSchema
>;
const GetClickPositionsResponseSchema = AlgoliaResponseSchema;
export type GetClickPositionsResponse = z.infer<
	typeof GetClickPositionsResponseSchema
>;

// getClickThroughRate
const GetClickThroughRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetClickThroughRateInput = z.infer<
	typeof GetClickThroughRateInputSchema
>;
const GetClickThroughRateResponseSchema = AlgoliaResponseSchema;
export type GetClickThroughRateResponse = z.infer<
	typeof GetClickThroughRateResponseSchema
>;

// getConfig
const GetConfigInputSchema = z.object({
	region: z.string().optional(),
	indexName: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type GetConfigInput = z.infer<typeof GetConfigInputSchema>;
const GetConfigResponseSchema = AlgoliaResponseSchema;
export type GetConfigResponse = z.infer<typeof GetConfigResponseSchema>;

// getConfig2
const GetConfig2InputSchema = z.object({
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetConfig2Input = z.infer<typeof GetConfig2InputSchema>;
const GetConfig2ResponseSchema = AlgoliaResponseSchema;
export type GetConfig2Response = z.infer<typeof GetConfig2ResponseSchema>;

// getConversionRate
const GetConversionRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetConversionRateInput = z.infer<
	typeof GetConversionRateInputSchema
>;
const GetConversionRateResponseSchema = AlgoliaResponseSchema;
export type GetConversionRateResponse = z.infer<
	typeof GetConversionRateResponseSchema
>;

// getDestination
const GetDestinationInputSchema = z.object({
	destinationID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetDestinationInput = z.infer<typeof GetDestinationInputSchema>;
const GetDestinationResponseSchema = AlgoliaResponseSchema;
export type GetDestinationResponse = z.infer<
	typeof GetDestinationResponseSchema
>;

// getDictionaryLanguages
const GetDictionaryLanguagesInputSchema = z.object({
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetDictionaryLanguagesInput = z.infer<
	typeof GetDictionaryLanguagesInputSchema
>;
const GetDictionaryLanguagesResponseSchema = AlgoliaResponseSchema;
export type GetDictionaryLanguagesResponse = z.infer<
	typeof GetDictionaryLanguagesResponseSchema
>;

// getDictionarySettings
const GetDictionarySettingsInputSchema = z.object({
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetDictionarySettingsInput = z.infer<
	typeof GetDictionarySettingsInputSchema
>;
const GetDictionarySettingsResponseSchema = AlgoliaResponseSchema;
export type GetDictionarySettingsResponse = z.infer<
	typeof GetDictionarySettingsResponseSchema
>;

// getLogs
const GetLogsInputSchema = z.object({
	type: z.string().optional(),
	length: z.number().int().optional(),
	offset: z.number().int().optional(),
	indexName: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetLogsInput = z.infer<typeof GetLogsInputSchema>;
const GetLogsResponseSchema = AlgoliaResponseSchema;
export type GetLogsResponse = z.infer<typeof GetLogsResponseSchema>;

// getNoClickRate
const GetNoClickRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetNoClickRateInput = z.infer<typeof GetNoClickRateInputSchema>;
const GetNoClickRateResponseSchema = AlgoliaResponseSchema;
export type GetNoClickRateResponse = z.infer<
	typeof GetNoClickRateResponseSchema
>;

// getNoResultsRate
const GetNoResultsRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetNoResultsRateInput = z.infer<typeof GetNoResultsRateInputSchema>;
const GetNoResultsRateResponseSchema = AlgoliaResponseSchema;
export type GetNoResultsRateResponse = z.infer<
	typeof GetNoResultsRateResponseSchema
>;

// getNoResultsSearches
const GetNoResultsSearchesInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetNoResultsSearchesInput = z.infer<
	typeof GetNoResultsSearchesInputSchema
>;
const GetNoResultsSearchesResponseSchema = AlgoliaResponseSchema;
export type GetNoResultsSearchesResponse = z.infer<
	typeof GetNoResultsSearchesResponseSchema
>;

// getObjectPosition
const GetObjectPositionInputSchema = z.object({
	results: z.record(z.string(), z.unknown()),
	object_id: z.string(),
	indexName: z.union([z.string(), z.number()]).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetObjectPositionInput = z.infer<
	typeof GetObjectPositionInputSchema
>;
const GetObjectPositionResponseSchema = AlgoliaResponseSchema;
export type GetObjectPositionResponse = z.infer<
	typeof GetObjectPositionResponseSchema
>;

// getObjects
const GetObjectsInputSchema = z.object({
	requests: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetObjectsInput = z.infer<typeof GetObjectsInputSchema>;
const GetObjectsResponseSchema = AlgoliaResponseSchema;
export type GetObjectsResponse = z.infer<typeof GetObjectsResponseSchema>;

// getPurchaseRate
const GetPurchaseRateInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetPurchaseRateInput = z.infer<typeof GetPurchaseRateInputSchema>;
const GetPurchaseRateResponseSchema = AlgoliaResponseSchema;
export type GetPurchaseRateResponse = z.infer<
	typeof GetPurchaseRateResponseSchema
>;

// getRecommendRule
const GetRecommendRuleInputSchema = z.object({
	model: z.string().optional(),
	object_id: z.string(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetRecommendRuleInput = z.infer<typeof GetRecommendRuleInputSchema>;
const GetRecommendRuleResponseSchema = AlgoliaResponseSchema;
export type GetRecommendRuleResponse = z.infer<
	typeof GetRecommendRuleResponseSchema
>;

// getRecommendTaskStatus
const GetRecommendTaskStatusInputSchema = z.object({
	model: z.string().optional(),
	task_id: z.number().int(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetRecommendTaskStatusInput = z.infer<
	typeof GetRecommendTaskStatusInputSchema
>;
const GetRecommendTaskStatusResponseSchema = AlgoliaResponseSchema;
export type GetRecommendTaskStatusResponse = z.infer<
	typeof GetRecommendTaskStatusResponseSchema
>;

// getRecord
const GetRecordInputSchema = z.object({
	object_id: z.string(),
	index_name: z.string(),
	attributes_to_retrieve: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetRecordInput = z.infer<typeof GetRecordInputSchema>;
const GetRecordResponseSchema = AlgoliaResponseSchema;
export type GetRecordResponse = z.infer<typeof GetRecordResponseSchema>;

// getRevenue
const GetRevenueInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetRevenueInput = z.infer<typeof GetRevenueInputSchema>;
const GetRevenueResponseSchema = AlgoliaResponseSchema;
export type GetRevenueResponse = z.infer<typeof GetRevenueResponseSchema>;

// getRule
const GetRuleInputSchema = z.object({
	object_id: z.string(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetRuleInput = z.infer<typeof GetRuleInputSchema>;
const GetRuleResponseSchema = AlgoliaResponseSchema;
export type GetRuleResponse = z.infer<typeof GetRuleResponseSchema>;

// getSearchesCount
const GetSearchesCountInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetSearchesCountInput = z.infer<typeof GetSearchesCountInputSchema>;
const GetSearchesCountResponseSchema = AlgoliaResponseSchema;
export type GetSearchesCountResponse = z.infer<
	typeof GetSearchesCountResponseSchema
>;

// getSearchesNoClicks
const GetSearchesNoClicksInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetSearchesNoClicksInput = z.infer<
	typeof GetSearchesNoClicksInputSchema
>;
const GetSearchesNoClicksResponseSchema = AlgoliaResponseSchema;
export type GetSearchesNoClicksResponse = z.infer<
	typeof GetSearchesNoClicksResponseSchema
>;

// getSettings
const GetSettingsInputSchema = z.object({
	indexName: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetSettingsInput = z.infer<typeof GetSettingsInputSchema>;
const GetSettingsResponseSchema = AlgoliaResponseSchema;
export type GetSettingsResponse = z.infer<typeof GetSettingsResponseSchema>;

// getSource
const GetSourceInputSchema = z.object({
	region: z.string().optional(),
	sourceID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type GetSourceInput = z.infer<typeof GetSourceInputSchema>;
const GetSourceResponseSchema = AlgoliaResponseSchema;
export type GetSourceResponse = z.infer<typeof GetSourceResponseSchema>;

// getSynonym
const GetSynonymInputSchema = z.object({
	object_id: z.string(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetSynonymInput = z.infer<typeof GetSynonymInputSchema>;
const GetSynonymResponseSchema = AlgoliaResponseSchema;
export type GetSynonymResponse = z.infer<typeof GetSynonymResponseSchema>;

// getTaskStatus
const GetTaskStatusInputSchema = z.object({
	task_id: z.number().int(),
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTaskStatusInput = z.infer<typeof GetTaskStatusInputSchema>;
const GetTaskStatusResponseSchema = AlgoliaResponseSchema;
export type GetTaskStatusResponse = z.infer<typeof GetTaskStatusResponseSchema>;

// getTaskV1
const GetTaskV1InputSchema = z.object({
	taskID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTaskV1Input = z.infer<typeof GetTaskV1InputSchema>;
const GetTaskV1ResponseSchema = AlgoliaResponseSchema;
export type GetTaskV1Response = z.infer<typeof GetTaskV1ResponseSchema>;

// getTopCountries
const GetTopCountriesInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopCountriesInput = z.infer<typeof GetTopCountriesInputSchema>;
const GetTopCountriesResponseSchema = AlgoliaResponseSchema;
export type GetTopCountriesResponse = z.infer<
	typeof GetTopCountriesResponseSchema
>;

// getTopFilterAttributes
const GetTopFilterAttributesInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopFilterAttributesInput = z.infer<
	typeof GetTopFilterAttributesInputSchema
>;
const GetTopFilterAttributesResponseSchema = AlgoliaResponseSchema;
export type GetTopFilterAttributesResponse = z.infer<
	typeof GetTopFilterAttributesResponseSchema
>;

// getTopFilterForAttribute
const GetTopFilterForAttributeInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	endDate: z.string().optional(),
	attribute: z.string(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopFilterForAttributeInput = z.infer<
	typeof GetTopFilterForAttributeInputSchema
>;
const GetTopFilterForAttributeResponseSchema = AlgoliaResponseSchema;
export type GetTopFilterForAttributeResponse = z.infer<
	typeof GetTopFilterForAttributeResponseSchema
>;

// getTopFiltersNoResults
const GetTopFiltersNoResultsInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopFiltersNoResultsInput = z.infer<
	typeof GetTopFiltersNoResultsInputSchema
>;
const GetTopFiltersNoResultsResponseSchema = AlgoliaResponseSchema;
export type GetTopFiltersNoResultsResponse = z.infer<
	typeof GetTopFiltersNoResultsResponseSchema
>;

// getTopHits
const GetTopHitsInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	clickAnalytics: z.boolean().optional(),
	revenueAnalytics: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopHitsInput = z.infer<typeof GetTopHitsInputSchema>;
const GetTopHitsResponseSchema = AlgoliaResponseSchema;
export type GetTopHitsResponse = z.infer<typeof GetTopHitsResponseSchema>;

// getTopSearches
const GetTopSearchesInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	endDate: z.string().optional(),
	orderBy: z.string().optional(),
	direction: z.string().optional(),
	startDate: z.string().optional(),
	clickAnalytics: z.boolean().optional(),
	revenueAnalytics: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetTopSearchesInput = z.infer<typeof GetTopSearchesInputSchema>;
const GetTopSearchesResponseSchema = AlgoliaResponseSchema;
export type GetTopSearchesResponse = z.infer<
	typeof GetTopSearchesResponseSchema
>;

// getTransformation
const GetTransformationInputSchema = z.object({
	region: z.string().optional(),
	transformationID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type GetTransformationInput = z.infer<
	typeof GetTransformationInputSchema
>;
const GetTransformationResponseSchema = AlgoliaResponseSchema;
export type GetTransformationResponse = z.infer<
	typeof GetTransformationResponseSchema
>;

// getUsage
const GetUsageInputSchema = z.object({
	endDate: z.string(),
	startDate: z.string(),
	statistic: z.string(),
	granularity: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetUsageInput = z.infer<typeof GetUsageInputSchema>;
const GetUsageResponseSchema = AlgoliaResponseSchema;
export type GetUsageResponse = z.infer<typeof GetUsageResponseSchema>;

// getUsageForIndex
const GetUsageForIndexInputSchema = z.object({
	endDate: z.string(),
	indexName: z.string(),
	startDate: z.string(),
	statistic: z.string(),
	granularity: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetUsageForIndexInput = z.infer<typeof GetUsageForIndexInputSchema>;
const GetUsageForIndexResponseSchema = AlgoliaResponseSchema;
export type GetUsageForIndexResponse = z.infer<
	typeof GetUsageForIndexResponseSchema
>;

// getUsers
const GetUsersInputSchema = z.object({
	limit: z.number().int().optional(),
	endDate: z.string().optional(),
	indices: z.array(z.unknown()).optional(),
	affinity: z.array(z.unknown()).optional(),
	startDate: z.string().optional(),
	nextPageToken: z.string().optional(),
	previousPageToken: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetUsersInput = z.infer<typeof GetUsersInputSchema>;
const GetUsersResponseSchema = AlgoliaResponseSchema;
export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;

// getUsersCount
const GetUsersCountInputSchema = z.object({
	tags: z.string().optional(),
	index: z.string(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type GetUsersCountInput = z.infer<typeof GetUsersCountInputSchema>;
const GetUsersCountResponseSchema = AlgoliaResponseSchema;
export type GetUsersCountResponse = z.infer<typeof GetUsersCountResponseSchema>;

// indexExists
const IndexExistsInputSchema = z.object({
	index_name: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type IndexExistsInput = z.infer<typeof IndexExistsInputSchema>;
const IndexExistsResponseSchema = AlgoliaResponseSchema;
export type IndexExistsResponse = z.infer<typeof IndexExistsResponseSchema>;

// initInsights
const InitInsightsInputSchema = z.object({
	region: z.string().optional(),
	store_in_cookie: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type InitInsightsInput = z.infer<typeof InitInsightsInputSchema>;
const InitInsightsResponseSchema = AlgoliaResponseSchema;
export type InitInsightsResponse = z.infer<typeof InitInsightsResponseSchema>;

// listAbTests
const ListAbTestsInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	indexPrefix: z.string().optional(),
	indexSuffix: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListAbTestsInput = z.infer<typeof ListAbTestsInputSchema>;
const ListAbTestsResponseSchema = AlgoliaResponseSchema;
export type ListAbTestsResponse = z.infer<typeof ListAbTestsResponseSchema>;

// listApiKeys
const ListApiKeysInputSchema = z.object({
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListApiKeysInput = z.infer<typeof ListApiKeysInputSchema>;
const ListApiKeysResponseSchema = AlgoliaResponseSchema;
export type ListApiKeysResponse = z.infer<typeof ListApiKeysResponseSchema>;

// listAuthentications
const ListAuthenticationsInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.array(z.unknown()).optional(),
	order: z.string().optional(),
	platform: z.array(z.unknown()).optional(),
	itemsPerPage: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListAuthenticationsInput = z.infer<
	typeof ListAuthenticationsInputSchema
>;
const ListAuthenticationsResponseSchema = AlgoliaResponseSchema;
export type ListAuthenticationsResponse = z.infer<
	typeof ListAuthenticationsResponseSchema
>;

// listDestinations
const ListDestinationsInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.array(z.unknown()).optional(),
	order: z.string().optional(),
	itemsPerPage: z.number().int().optional(),
	authenticationID: z.array(z.unknown()).optional(),
	transformationID: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListDestinationsInput = z.infer<typeof ListDestinationsInputSchema>;
const ListDestinationsResponseSchema = AlgoliaResponseSchema;
export type ListDestinationsResponse = z.infer<
	typeof ListDestinationsResponseSchema
>;

// listIndices
const ListIndicesInputSchema = z.object({
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListIndicesInput = z.infer<typeof ListIndicesInputSchema>;
const ListIndicesResponseSchema = AlgoliaResponseSchema;
export type ListIndicesResponse = z.infer<typeof ListIndicesResponseSchema>;

// listIngestionTasks
const ListIngestionTasksInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	action: z.array(z.unknown()).optional(),
	enabled: z.boolean().optional(),
	sourceID: z.array(z.unknown()).optional(),
	sourceType: z.array(z.unknown()).optional(),
	triggerType: z.array(z.unknown()).optional(),
	itemsPerPage: z.number().int().optional(),
	destinationID: z.array(z.unknown()).optional(),
	withEmailNotifications: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListIngestionTasksInput = z.infer<
	typeof ListIngestionTasksInputSchema
>;
const ListIngestionTasksResponseSchema = AlgoliaResponseSchema;
export type ListIngestionTasksResponse = z.infer<
	typeof ListIngestionTasksResponseSchema
>;

// listQsConfigs
const ListQsConfigsInputSchema = z.object({
	region: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type ListQsConfigsInput = z.infer<typeof ListQsConfigsInputSchema>;
const ListQsConfigsResponseSchema = AlgoliaResponseSchema;
export type ListQsConfigsResponse = z.infer<typeof ListQsConfigsResponseSchema>;

// listRuns
const ListRunsInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.array(z.unknown()).optional(),
	order: z.string().optional(),
	status: z.array(z.unknown()).optional(),
	taskID: z.string().optional(),
	endDate: z.string().optional(),
	startDate: z.string().optional(),
	itemsPerPage: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListRunsInput = z.infer<typeof ListRunsInputSchema>;
const ListRunsResponseSchema = AlgoliaResponseSchema;
export type ListRunsResponse = z.infer<typeof ListRunsResponseSchema>;

// listSources
const ListSourcesInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.array(z.unknown()).optional(),
	order: z.string().optional(),
	region: z.string().optional(),
	itemsPerPage: z.number().int().optional(),
	authenticationID: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type ListSourcesInput = z.infer<typeof ListSourcesInputSchema>;
const ListSourcesResponseSchema = AlgoliaResponseSchema;
export type ListSourcesResponse = z.infer<typeof ListSourcesResponseSchema>;

// listTransformations
const ListTransformationsInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.string().optional(),
	order: z.string().optional(),
	itemsPerPage: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ListTransformationsInput = z.infer<
	typeof ListTransformationsInputSchema
>;
const ListTransformationsResponseSchema = AlgoliaResponseSchema;
export type ListTransformationsResponse = z.infer<
	typeof ListTransformationsResponseSchema
>;

// partialUpdateObjects
const PartialUpdateObjectsInputSchema = z.object({
	requests: z.array(z.unknown()),
	indexName: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type PartialUpdateObjectsInput = z.infer<
	typeof PartialUpdateObjectsInputSchema
>;
const PartialUpdateObjectsResponseSchema = AlgoliaResponseSchema;
export type PartialUpdateObjectsResponse = z.infer<
	typeof PartialUpdateObjectsResponseSchema
>;

// pushTask
const PushTaskInputSchema = z.object({
	watch: z.boolean().optional(),
	action: z.string().optional(),
	taskID: z.string(),
	records: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type PushTaskInput = z.infer<typeof PushTaskInputSchema>;
const PushTaskResponseSchema = AlgoliaResponseSchema;
export type PushTaskResponse = z.infer<typeof PushTaskResponseSchema>;

// replaceAllRules
const ReplaceAllRulesInputSchema = z.object({
	rules: z.array(z.object({ objectID: z.string() }).loose()),
	indexName: z.string(),
	requestOptions: z.record(z.string(), z.unknown()).optional(),
	forwardToReplicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ReplaceAllRulesInput = z.infer<typeof ReplaceAllRulesInputSchema>;
const ReplaceAllRulesResponseSchema = AlgoliaResponseSchema;
export type ReplaceAllRulesResponse = z.infer<
	typeof ReplaceAllRulesResponseSchema
>;

// replaceTask
const ReplaceTaskInputSchema = z.object({
	cron: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	action: z.string().optional(),
	cursor: z.string().optional(),
	taskID: z.string(),
	enabled: z.boolean().optional(),
	policies: z.record(z.string(), z.unknown()).optional(),
	destinationID: z.string(),
	notifications: z.record(z.string(), z.unknown()).optional(),
	failureThreshold: z.number().int().optional(),
	subscriptionAction: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type ReplaceTaskInput = z.infer<typeof ReplaceTaskInputSchema>;
const ReplaceTaskResponseSchema = AlgoliaResponseSchema;
export type ReplaceTaskResponse = z.infer<typeof ReplaceTaskResponseSchema>;

// restoreApiKey
const RestoreApiKeyInputSchema = z.object({
	key: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type RestoreApiKeyInput = z.infer<typeof RestoreApiKeyInputSchema>;
const RestoreApiKeyResponseSchema = AlgoliaResponseSchema;
export type RestoreApiKeyResponse = z.infer<typeof RestoreApiKeyResponseSchema>;

// runTaskV1
const RunTaskV1InputSchema = z.object({
	taskID: z.string(),
	runMetadata: z.record(z.string(), z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type RunTaskV1Input = z.infer<typeof RunTaskV1InputSchema>;
const RunTaskV1ResponseSchema = AlgoliaResponseSchema;
export type RunTaskV1Response = z.infer<typeof RunTaskV1ResponseSchema>;

// saveRule
const SaveRuleInputSchema = z.object({
	enabled: z.boolean().optional(),
	validity: z.array(z.unknown()).optional(),
	object_id: z.string(),
	conditions: z.array(z.unknown()).optional(),
	index_name: z.string(),
	consequence: z.record(z.string(), z.unknown()),
	description: z.string().optional(),
	forward_to_replicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SaveRuleInput = z.infer<typeof SaveRuleInputSchema>;
const SaveRuleResponseSchema = AlgoliaResponseSchema;
export type SaveRuleResponse = z.infer<typeof SaveRuleResponseSchema>;

// saveSynonym
const SaveSynonymInputSchema = z.object({
	synonym: z.record(z.string(), z.unknown()),
	objectID: z.string(),
	indexName: z.string(),
	forwardToReplicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SaveSynonymInput = z.infer<typeof SaveSynonymInputSchema>;
const SaveSynonymResponseSchema = AlgoliaResponseSchema;
export type SaveSynonymResponse = z.infer<typeof SaveSynonymResponseSchema>;

// saveSynonyms
const SaveSynonymsInputSchema = z.object({
	synonyms: z.array(z.unknown()),
	indexName: z.string(),
	forwardToReplicas: z.boolean().optional(),
	replaceExistingSynonyms: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SaveSynonymsInput = z.infer<typeof SaveSynonymsInputSchema>;
const SaveSynonymsResponseSchema = AlgoliaResponseSchema;
export type SaveSynonymsResponse = z.infer<typeof SaveSynonymsResponseSchema>;

// searchAuthentications
const SearchAuthenticationsInputSchema = z.object({
	authenticationIDs: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchAuthenticationsInput = z.infer<
	typeof SearchAuthenticationsInputSchema
>;
const SearchAuthenticationsResponseSchema = AlgoliaResponseSchema;
export type SearchAuthenticationsResponse = z.infer<
	typeof SearchAuthenticationsResponseSchema
>;

// searchDestinations
const SearchDestinationsInputSchema = z.object({
	destinationIDs: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchDestinationsInput = z.infer<
	typeof SearchDestinationsInputSchema
>;
const SearchDestinationsResponseSchema = AlgoliaResponseSchema;
export type SearchDestinationsResponse = z.infer<
	typeof SearchDestinationsResponseSchema
>;

// searchDictionaryEntries
const SearchDictionaryEntriesInputSchema = z.object({
	page: z.number().int().optional(),
	query: z.string().optional(),
	language: z.string().optional(),
	hitsPerPage: z.number().int().optional(),
	dictionary_name: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchDictionaryEntriesInput = z.infer<
	typeof SearchDictionaryEntriesInputSchema
>;
const SearchDictionaryEntriesResponseSchema = AlgoliaResponseSchema;
export type SearchDictionaryEntriesResponse = z.infer<
	typeof SearchDictionaryEntriesResponseSchema
>;

// searchFacetValues
const SearchFacetValuesInputSchema = z.object({
	params: z.string().optional(),
	facet_name: z.string(),
	index_name: z.string(),
	facet_query: z.string().optional(),
	max_facet_hits: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchFacetValuesInput = z.infer<
	typeof SearchFacetValuesInputSchema
>;
const SearchFacetValuesResponseSchema = AlgoliaResponseSchema;
export type SearchFacetValuesResponse = z.infer<
	typeof SearchFacetValuesResponseSchema
>;

// searchIndex
const SearchIndexInputSchema = z.object({
	query: z.string(),
	index_name: z.string(),
	search_params: z.record(z.string(), z.unknown()).optional(),
	request_options: z.record(z.string(), z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchIndexInput = z.infer<typeof SearchIndexInputSchema>;
const SearchIndexResponseSchema = AlgoliaResponseSchema;
export type SearchIndexResponse = z.infer<typeof SearchIndexResponseSchema>;

// searchMultipleIndices
const SearchMultipleIndicesInputSchema = z.object({
	requests: z.array(z.unknown()),
	strategy: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchMultipleIndicesInput = z.infer<
	typeof SearchMultipleIndicesInputSchema
>;
const SearchMultipleIndicesResponseSchema = AlgoliaResponseSchema;
export type SearchMultipleIndicesResponse = z.infer<
	typeof SearchMultipleIndicesResponseSchema
>;

// searchRecommendRules
const SearchRecommendRulesInputSchema = z.object({
	page: z.number().int().optional(),
	model: z.string().optional(),
	query: z.string().optional(),
	facets: z.array(z.unknown()).optional(),
	context: z.string().optional(),
	enabled: z.boolean().optional(),
	filters: z.string().optional(),
	index_name: z.string(),
	hitsPerPage: z.number().int().optional(),
	maxValuesPerFacet: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchRecommendRulesInput = z.infer<
	typeof SearchRecommendRulesInputSchema
>;
const SearchRecommendRulesResponseSchema = AlgoliaResponseSchema;
export type SearchRecommendRulesResponse = z.infer<
	typeof SearchRecommendRulesResponseSchema
>;

// searchSources
const SearchSourcesInputSchema = z.object({
	sourceIDs: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchSourcesInput = z.infer<typeof SearchSourcesInputSchema>;
const SearchSourcesResponseSchema = AlgoliaResponseSchema;
export type SearchSourcesResponse = z.infer<typeof SearchSourcesResponseSchema>;

// searchSynonyms
const SearchSynonymsInputSchema = z.object({
	page: z.number().int().optional(),
	type: z.string().optional(),
	query: z.string().optional(),
	index_name: z.string(),
	hitsPerPage: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchSynonymsInput = z.infer<typeof SearchSynonymsInputSchema>;
const SearchSynonymsResponseSchema = AlgoliaResponseSchema;
export type SearchSynonymsResponse = z.infer<
	typeof SearchSynonymsResponseSchema
>;

// searchTasksV1
const SearchTasksV1InputSchema = z.object({
	taskIDs: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchTasksV1Input = z.infer<typeof SearchTasksV1InputSchema>;
const SearchTasksV1ResponseSchema = AlgoliaResponseSchema;
export type SearchTasksV1Response = z.infer<typeof SearchTasksV1ResponseSchema>;

// searchTransformations
const SearchTransformationsInputSchema = z.object({
	transformationIDs: z.array(z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SearchTransformationsInput = z.infer<
	typeof SearchTransformationsInputSchema
>;
const SearchTransformationsResponseSchema = AlgoliaResponseSchema;
export type SearchTransformationsResponse = z.infer<
	typeof SearchTransformationsResponseSchema
>;

// setDictionarySettings
const SetDictionarySettingsInputSchema = z.object({
	disableStandardEntries: z.record(z.string(), z.unknown()),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SetDictionarySettingsInput = z.infer<
	typeof SetDictionarySettingsInputSchema
>;
const SetDictionarySettingsResponseSchema = AlgoliaResponseSchema;
export type SetDictionarySettingsResponse = z.infer<
	typeof SetDictionarySettingsResponseSchema
>;

// setPersonalizationStrategy
const SetPersonalizationStrategyInputSchema = z.object({
	region: z.string().optional(),
	eventsScoring: z.array(z.unknown()),
	facetsScoring: z.array(z.unknown()),
	personalizationImpact: z.number().int(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type SetPersonalizationStrategyInput = z.infer<
	typeof SetPersonalizationStrategyInputSchema
>;
const SetPersonalizationStrategyResponseSchema = AlgoliaResponseSchema;
export type SetPersonalizationStrategyResponse = z.infer<
	typeof SetPersonalizationStrategyResponseSchema
>;

// setSettings
const SetSettingsInputSchema = z.object({
	settings: z.record(z.string(), z.unknown()),
	index_name: z.string(),
	forward_to_replicas: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type SetSettingsInput = z.infer<typeof SetSettingsInputSchema>;
const SetSettingsResponseSchema = AlgoliaResponseSchema;
export type SetSettingsResponse = z.infer<typeof SetSettingsResponseSchema>;

// stopAbTest
const StopAbTestInputSchema = z.object({
	id: z.number().int(),
	region: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type StopAbTestInput = z.infer<typeof StopAbTestInputSchema>;
const StopAbTestResponseSchema = AlgoliaResponseSchema;
export type StopAbTestResponse = z.infer<typeof StopAbTestResponseSchema>;

// tryTransformation
const TryTransformationInputSchema = z.object({
	code: z.string().optional(),
	type: z.string().optional(),
	input: z.string().optional(),
	sampleRecord: z.record(z.string(), z.unknown()),
	authentications: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type TryTransformationInput = z.infer<
	typeof TryTransformationInputSchema
>;
const TryTransformationResponseSchema = AlgoliaResponseSchema;
export type TryTransformationResponse = z.infer<
	typeof TryTransformationResponseSchema
>;

// tryTransformationBeforeUpdate
const TryTransformationBeforeUpdateInputSchema = z.object({
	code: z.string().optional(),
	type: z.string().optional(),
	input: z.string().optional(),
	sample_record: z.record(z.string(), z.unknown()),
	authentications: z.array(z.unknown()).optional(),
	transformation_id: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type TryTransformationBeforeUpdateInput = z.infer<
	typeof TryTransformationBeforeUpdateInputSchema
>;
const TryTransformationBeforeUpdateResponseSchema = AlgoliaResponseSchema;
export type TryTransformationBeforeUpdateResponse = z.infer<
	typeof TryTransformationBeforeUpdateResponseSchema
>;

// updateApiKey
const UpdateApiKeyInputSchema = z.object({
	acl: z.array(z.string()),
	key: z.string(),
	indexes: z.array(z.string()).optional(),
	referers: z.array(z.string()).optional(),
	validity: z.number().int().optional(),
	description: z.string().optional(),
	maxHitsPerQuery: z.number().int().optional(),
	queryParameters: z.string().optional(),
	maxQueriesPerIPPerHour: z.number().int().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateApiKeyInput = z.infer<typeof UpdateApiKeyInputSchema>;
const UpdateApiKeyResponseSchema = AlgoliaResponseSchema;
export type UpdateApiKeyResponse = z.infer<typeof UpdateApiKeyResponseSchema>;

// updateAuthentication
const UpdateAuthenticationInputSchema = z.object({
	name: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	authenticationID: z.string(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateAuthenticationInput = z.infer<
	typeof UpdateAuthenticationInputSchema
>;
const UpdateAuthenticationResponseSchema = AlgoliaResponseSchema;
export type UpdateAuthenticationResponse = z.infer<
	typeof UpdateAuthenticationResponseSchema
>;

// updateConfig
const UpdateConfigInputSchema = z.object({
	region: z.string().optional(),
	exclude: z.array(z.unknown()).optional(),
	indexName: z.string(),
	languages: z.string().optional(),
	sourceIndices: z.array(z.unknown()),
	enablePersonalization: z.boolean().optional(),
	allowSpecialCharacters: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type UpdateConfigInput = z.infer<typeof UpdateConfigInputSchema>;
const UpdateConfigResponseSchema = AlgoliaResponseSchema;
export type UpdateConfigResponse = z.infer<typeof UpdateConfigResponseSchema>;

// updateDestination
const UpdateDestinationInputSchema = z.object({
	name: z.string().optional(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	destinationID: z.string(),
	authenticationID: z.string().optional(),
	transformationIDs: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateDestinationInput = z.infer<
	typeof UpdateDestinationInputSchema
>;
const UpdateDestinationResponseSchema = AlgoliaResponseSchema;
export type UpdateDestinationResponse = z.infer<
	typeof UpdateDestinationResponseSchema
>;

// updateDictionaryEntries
const UpdateDictionaryEntriesInputSchema = z.object({
	requests: z.array(z.unknown()),
	dictionary_name: z.string().optional(),
	clearExistingDictionaryEntries: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateDictionaryEntriesInput = z.infer<
	typeof UpdateDictionaryEntriesInputSchema
>;
const UpdateDictionaryEntriesResponseSchema = AlgoliaResponseSchema;
export type UpdateDictionaryEntriesResponse = z.infer<
	typeof UpdateDictionaryEntriesResponseSchema
>;

// updateRecordPartially
const UpdateRecordPartiallyInputSchema = z.object({
	object_id: z.string(),
	attributes: z.record(z.string(), z.unknown()),
	index_name: z.string(),
	create_if_not_exists: z.boolean().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateRecordPartiallyInput = z.infer<
	typeof UpdateRecordPartiallyInputSchema
>;
const UpdateRecordPartiallyResponseSchema = AlgoliaResponseSchema;
export type UpdateRecordPartiallyResponse = z.infer<
	typeof UpdateRecordPartiallyResponseSchema
>;

// updateSource
const UpdateSourceInputSchema = z.object({
	name: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	region: z.string().optional(),
	sourceID: z.string(),
	authenticationID: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type UpdateSourceInput = z.infer<typeof UpdateSourceInputSchema>;
const UpdateSourceResponseSchema = AlgoliaResponseSchema;
export type UpdateSourceResponse = z.infer<typeof UpdateSourceResponseSchema>;

// updateTask
const UpdateTaskInputSchema = z.object({
	cron: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	taskID: z.string(),
	enabled: z.boolean().optional(),
	policies: z.record(z.string(), z.unknown()).optional(),
	destinationID: z.string().optional(),
	notifications: z.record(z.string(), z.unknown()).optional(),
	failureThreshold: z.number().int().optional(),
	subscriptionAction: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
const UpdateTaskResponseSchema = AlgoliaResponseSchema;
export type UpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

// updateTransformation
const UpdateTransformationInputSchema = z.object({
	code: z.string().optional(),
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	description: z.string().optional(),
	transformationID: z.string(),
	authenticationIDs: z.array(z.unknown()).optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	region: z.string().optional(),
	baseUrl: z.string().optional(),
});
export type UpdateTransformationInput = z.infer<
	typeof UpdateTransformationInputSchema
>;
const UpdateTransformationResponseSchema = AlgoliaResponseSchema;
export type UpdateTransformationResponse = z.infer<
	typeof UpdateTransformationResponseSchema
>;

// validateSource
const ValidateSourceInputSchema = z.object({
	name: z.string(),
	type: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	region: z.string().optional(),
	authenticationID: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type ValidateSourceInput = z.infer<typeof ValidateSourceInputSchema>;
const ValidateSourceResponseSchema = AlgoliaResponseSchema;
export type ValidateSourceResponse = z.infer<
	typeof ValidateSourceResponseSchema
>;

// validateSourceBeforeUpdate
const ValidateSourceBeforeUpdateInputSchema = z.object({
	name: z.string().optional(),
	input: z.record(z.string(), z.unknown()).optional(),
	region: z.string().optional(),
	sourceID: z.string(),
	authenticationID: z.string().optional(),
	body: AlgoliaOptionalBodySchema,
	query: z.record(z.string(), z.unknown()).optional(),
	headers: z.record(z.string(), z.string()).optional(),
	baseUrl: z.string().optional(),
});
export type ValidateSourceBeforeUpdateInput = z.infer<
	typeof ValidateSourceBeforeUpdateInputSchema
>;
const ValidateSourceBeforeUpdateResponseSchema = AlgoliaResponseSchema;
export type ValidateSourceBeforeUpdateResponse = z.infer<
	typeof ValidateSourceBeforeUpdateResponseSchema
>;

export const AlgoliaEndpointInputSchemas = {
	addAbTest: AddAbTestInputSchema,
	addOrReplaceRecord: AddOrReplaceRecordInputSchema,
	addRecord: AddRecordInputSchema,
	browseIndex: BrowseIndexInputSchema,
	clearObjects: ClearObjectsInputSchema,
	clearRules: ClearRulesInputSchema,
	clearSynonyms: ClearSynonymsInputSchema,
	clickedObjectIds: ClickedObjectIdsInputSchema,
	clickedObjectIdsAfterSearch: ClickedObjectIdsAfterSearchInputSchema,
	computeRealtimeUser: ComputeRealtimeUserInputSchema,
	convertedObjectIds: ConvertedObjectIdsInputSchema,
	copyIndex: CopyIndexInputSchema,
	createApiKey: CreateApiKeyInputSchema,
	createAuthentication: CreateAuthenticationInputSchema,
	createDestination: CreateDestinationInputSchema,
	createIngestionTask: CreateIngestionTaskInputSchema,
	createOrUpdateRecommendRules: CreateOrUpdateRecommendRulesInputSchema,
	createQsConfig: CreateQsConfigInputSchema,
	createSource: CreateSourceInputSchema,
	createTransformation: CreateTransformationInputSchema,
	deleteAbTest: DeleteAbTestInputSchema,
	deleteApiKey: DeleteApiKeyInputSchema,
	deleteAuthentication: DeleteAuthenticationInputSchema,
	deleteConfig: DeleteConfigInputSchema,
	deleteDestination: DeleteDestinationInputSchema,
	deleteIndex: DeleteIndexInputSchema,
	deleteObjects: DeleteObjectsInputSchema,
	deleteRecommendRule: DeleteRecommendRuleInputSchema,
	deleteRecordsByFilter: DeleteRecordsByFilterInputSchema,
	deleteRule: DeleteRuleInputSchema,
	deleteSource: DeleteSourceInputSchema,
	deleteSynonym: DeleteSynonymInputSchema,
	deleteTransformation: DeleteTransformationInputSchema,
	deleteUserProfile: DeleteUserProfileInputSchema,
	deleteUserToken: DeleteUserTokenInputSchema,
	disableTaskV1: DisableTaskV1InputSchema,
	enableTaskV1: EnableTaskV1InputSchema,
	executeBatchOnMultipleIndices: ExecuteBatchOnMultipleIndicesInputSchema,
	exportRules: ExportRulesInputSchema,
	findObject: FindObjectInputSchema,
	getAbTest: GetAbTestInputSchema,
	getAddToCartRate: GetAddToCartRateInputSchema,
	getApiKey: GetApiKeyInputSchema,
	getAppTask: GetAppTaskInputSchema,
	getAuthentication: GetAuthenticationInputSchema,
	getAverageClickPosition: GetAverageClickPositionInputSchema,
	getClickPositions: GetClickPositionsInputSchema,
	getClickThroughRate: GetClickThroughRateInputSchema,
	getConfig: GetConfigInputSchema,
	getConfig2: GetConfig2InputSchema,
	getConversionRate: GetConversionRateInputSchema,
	getDestination: GetDestinationInputSchema,
	getDictionaryLanguages: GetDictionaryLanguagesInputSchema,
	getDictionarySettings: GetDictionarySettingsInputSchema,
	getLogs: GetLogsInputSchema,
	getNoClickRate: GetNoClickRateInputSchema,
	getNoResultsRate: GetNoResultsRateInputSchema,
	getNoResultsSearches: GetNoResultsSearchesInputSchema,
	getObjectPosition: GetObjectPositionInputSchema,
	getObjects: GetObjectsInputSchema,
	getPurchaseRate: GetPurchaseRateInputSchema,
	getRecommendRule: GetRecommendRuleInputSchema,
	getRecommendTaskStatus: GetRecommendTaskStatusInputSchema,
	getRecord: GetRecordInputSchema,
	getRevenue: GetRevenueInputSchema,
	getRule: GetRuleInputSchema,
	getSearchesCount: GetSearchesCountInputSchema,
	getSearchesNoClicks: GetSearchesNoClicksInputSchema,
	getSettings: GetSettingsInputSchema,
	getSource: GetSourceInputSchema,
	getSynonym: GetSynonymInputSchema,
	getTaskStatus: GetTaskStatusInputSchema,
	getTaskV1: GetTaskV1InputSchema,
	getTopCountries: GetTopCountriesInputSchema,
	getTopFilterAttributes: GetTopFilterAttributesInputSchema,
	getTopFilterForAttribute: GetTopFilterForAttributeInputSchema,
	getTopFiltersNoResults: GetTopFiltersNoResultsInputSchema,
	getTopHits: GetTopHitsInputSchema,
	getTopSearches: GetTopSearchesInputSchema,
	getTransformation: GetTransformationInputSchema,
	getUsage: GetUsageInputSchema,
	getUsageForIndex: GetUsageForIndexInputSchema,
	getUsers: GetUsersInputSchema,
	getUsersCount: GetUsersCountInputSchema,
	indexExists: IndexExistsInputSchema,
	initInsights: InitInsightsInputSchema,
	listAbTests: ListAbTestsInputSchema,
	listApiKeys: ListApiKeysInputSchema,
	listAuthentications: ListAuthenticationsInputSchema,
	listDestinations: ListDestinationsInputSchema,
	listIndices: ListIndicesInputSchema,
	listIngestionTasks: ListIngestionTasksInputSchema,
	listQsConfigs: ListQsConfigsInputSchema,
	listRuns: ListRunsInputSchema,
	listSources: ListSourcesInputSchema,
	listTransformations: ListTransformationsInputSchema,
	partialUpdateObjects: PartialUpdateObjectsInputSchema,
	pushTask: PushTaskInputSchema,
	replaceAllRules: ReplaceAllRulesInputSchema,
	replaceTask: ReplaceTaskInputSchema,
	restoreApiKey: RestoreApiKeyInputSchema,
	runTaskV1: RunTaskV1InputSchema,
	saveRule: SaveRuleInputSchema,
	saveSynonym: SaveSynonymInputSchema,
	saveSynonyms: SaveSynonymsInputSchema,
	searchAuthentications: SearchAuthenticationsInputSchema,
	searchDestinations: SearchDestinationsInputSchema,
	searchDictionaryEntries: SearchDictionaryEntriesInputSchema,
	searchFacetValues: SearchFacetValuesInputSchema,
	searchIndex: SearchIndexInputSchema,
	searchMultipleIndices: SearchMultipleIndicesInputSchema,
	searchRecommendRules: SearchRecommendRulesInputSchema,
	searchSources: SearchSourcesInputSchema,
	searchSynonyms: SearchSynonymsInputSchema,
	searchTasksV1: SearchTasksV1InputSchema,
	searchTransformations: SearchTransformationsInputSchema,
	setDictionarySettings: SetDictionarySettingsInputSchema,
	setPersonalizationStrategy: SetPersonalizationStrategyInputSchema,
	setSettings: SetSettingsInputSchema,
	stopAbTest: StopAbTestInputSchema,
	tryTransformation: TryTransformationInputSchema,
	tryTransformationBeforeUpdate: TryTransformationBeforeUpdateInputSchema,
	updateApiKey: UpdateApiKeyInputSchema,
	updateAuthentication: UpdateAuthenticationInputSchema,
	updateConfig: UpdateConfigInputSchema,
	updateDestination: UpdateDestinationInputSchema,
	updateDictionaryEntries: UpdateDictionaryEntriesInputSchema,
	updateRecordPartially: UpdateRecordPartiallyInputSchema,
	updateSource: UpdateSourceInputSchema,
	updateTask: UpdateTaskInputSchema,
	updateTransformation: UpdateTransformationInputSchema,
	validateSource: ValidateSourceInputSchema,
	validateSourceBeforeUpdate: ValidateSourceBeforeUpdateInputSchema,
} as const;

export type AlgoliaEndpointInputs = {
	[K in keyof typeof AlgoliaEndpointInputSchemas]: z.infer<
		(typeof AlgoliaEndpointInputSchemas)[K]
	>;
};

export const AlgoliaEndpointOutputSchemas = {
	addAbTest: AddAbTestResponseSchema,
	addOrReplaceRecord: AddOrReplaceRecordResponseSchema,
	addRecord: AddRecordResponseSchema,
	browseIndex: BrowseIndexResponseSchema,
	clearObjects: ClearObjectsResponseSchema,
	clearRules: ClearRulesResponseSchema,
	clearSynonyms: ClearSynonymsResponseSchema,
	clickedObjectIds: ClickedObjectIdsResponseSchema,
	clickedObjectIdsAfterSearch: ClickedObjectIdsAfterSearchResponseSchema,
	computeRealtimeUser: ComputeRealtimeUserResponseSchema,
	convertedObjectIds: ConvertedObjectIdsResponseSchema,
	copyIndex: CopyIndexResponseSchema,
	createApiKey: CreateApiKeyResponseSchema,
	createAuthentication: CreateAuthenticationResponseSchema,
	createDestination: CreateDestinationResponseSchema,
	createIngestionTask: CreateIngestionTaskResponseSchema,
	createOrUpdateRecommendRules: CreateOrUpdateRecommendRulesResponseSchema,
	createQsConfig: CreateQsConfigResponseSchema,
	createSource: CreateSourceResponseSchema,
	createTransformation: CreateTransformationResponseSchema,
	deleteAbTest: DeleteAbTestResponseSchema,
	deleteApiKey: DeleteApiKeyResponseSchema,
	deleteAuthentication: DeleteAuthenticationResponseSchema,
	deleteConfig: DeleteConfigResponseSchema,
	deleteDestination: DeleteDestinationResponseSchema,
	deleteIndex: DeleteIndexResponseSchema,
	deleteObjects: DeleteObjectsResponseSchema,
	deleteRecommendRule: DeleteRecommendRuleResponseSchema,
	deleteRecordsByFilter: DeleteRecordsByFilterResponseSchema,
	deleteRule: DeleteRuleResponseSchema,
	deleteSource: DeleteSourceResponseSchema,
	deleteSynonym: DeleteSynonymResponseSchema,
	deleteTransformation: DeleteTransformationResponseSchema,
	deleteUserProfile: DeleteUserProfileResponseSchema,
	deleteUserToken: DeleteUserTokenResponseSchema,
	disableTaskV1: DisableTaskV1ResponseSchema,
	enableTaskV1: EnableTaskV1ResponseSchema,
	executeBatchOnMultipleIndices: ExecuteBatchOnMultipleIndicesResponseSchema,
	exportRules: ExportRulesResponseSchema,
	findObject: FindObjectResponseSchema,
	getAbTest: GetAbTestResponseSchema,
	getAddToCartRate: GetAddToCartRateResponseSchema,
	getApiKey: GetApiKeyResponseSchema,
	getAppTask: GetAppTaskResponseSchema,
	getAuthentication: GetAuthenticationResponseSchema,
	getAverageClickPosition: GetAverageClickPositionResponseSchema,
	getClickPositions: GetClickPositionsResponseSchema,
	getClickThroughRate: GetClickThroughRateResponseSchema,
	getConfig: GetConfigResponseSchema,
	getConfig2: GetConfig2ResponseSchema,
	getConversionRate: GetConversionRateResponseSchema,
	getDestination: GetDestinationResponseSchema,
	getDictionaryLanguages: GetDictionaryLanguagesResponseSchema,
	getDictionarySettings: GetDictionarySettingsResponseSchema,
	getLogs: GetLogsResponseSchema,
	getNoClickRate: GetNoClickRateResponseSchema,
	getNoResultsRate: GetNoResultsRateResponseSchema,
	getNoResultsSearches: GetNoResultsSearchesResponseSchema,
	getObjectPosition: GetObjectPositionResponseSchema,
	getObjects: GetObjectsResponseSchema,
	getPurchaseRate: GetPurchaseRateResponseSchema,
	getRecommendRule: GetRecommendRuleResponseSchema,
	getRecommendTaskStatus: GetRecommendTaskStatusResponseSchema,
	getRecord: GetRecordResponseSchema,
	getRevenue: GetRevenueResponseSchema,
	getRule: GetRuleResponseSchema,
	getSearchesCount: GetSearchesCountResponseSchema,
	getSearchesNoClicks: GetSearchesNoClicksResponseSchema,
	getSettings: GetSettingsResponseSchema,
	getSource: GetSourceResponseSchema,
	getSynonym: GetSynonymResponseSchema,
	getTaskStatus: GetTaskStatusResponseSchema,
	getTaskV1: GetTaskV1ResponseSchema,
	getTopCountries: GetTopCountriesResponseSchema,
	getTopFilterAttributes: GetTopFilterAttributesResponseSchema,
	getTopFilterForAttribute: GetTopFilterForAttributeResponseSchema,
	getTopFiltersNoResults: GetTopFiltersNoResultsResponseSchema,
	getTopHits: GetTopHitsResponseSchema,
	getTopSearches: GetTopSearchesResponseSchema,
	getTransformation: GetTransformationResponseSchema,
	getUsage: GetUsageResponseSchema,
	getUsageForIndex: GetUsageForIndexResponseSchema,
	getUsers: GetUsersResponseSchema,
	getUsersCount: GetUsersCountResponseSchema,
	indexExists: IndexExistsResponseSchema,
	initInsights: InitInsightsResponseSchema,
	listAbTests: ListAbTestsResponseSchema,
	listApiKeys: ListApiKeysResponseSchema,
	listAuthentications: ListAuthenticationsResponseSchema,
	listDestinations: ListDestinationsResponseSchema,
	listIndices: ListIndicesResponseSchema,
	listIngestionTasks: ListIngestionTasksResponseSchema,
	listQsConfigs: ListQsConfigsResponseSchema,
	listRuns: ListRunsResponseSchema,
	listSources: ListSourcesResponseSchema,
	listTransformations: ListTransformationsResponseSchema,
	partialUpdateObjects: PartialUpdateObjectsResponseSchema,
	pushTask: PushTaskResponseSchema,
	replaceAllRules: ReplaceAllRulesResponseSchema,
	replaceTask: ReplaceTaskResponseSchema,
	restoreApiKey: RestoreApiKeyResponseSchema,
	runTaskV1: RunTaskV1ResponseSchema,
	saveRule: SaveRuleResponseSchema,
	saveSynonym: SaveSynonymResponseSchema,
	saveSynonyms: SaveSynonymsResponseSchema,
	searchAuthentications: SearchAuthenticationsResponseSchema,
	searchDestinations: SearchDestinationsResponseSchema,
	searchDictionaryEntries: SearchDictionaryEntriesResponseSchema,
	searchFacetValues: SearchFacetValuesResponseSchema,
	searchIndex: SearchIndexResponseSchema,
	searchMultipleIndices: SearchMultipleIndicesResponseSchema,
	searchRecommendRules: SearchRecommendRulesResponseSchema,
	searchSources: SearchSourcesResponseSchema,
	searchSynonyms: SearchSynonymsResponseSchema,
	searchTasksV1: SearchTasksV1ResponseSchema,
	searchTransformations: SearchTransformationsResponseSchema,
	setDictionarySettings: SetDictionarySettingsResponseSchema,
	setPersonalizationStrategy: SetPersonalizationStrategyResponseSchema,
	setSettings: SetSettingsResponseSchema,
	stopAbTest: StopAbTestResponseSchema,
	tryTransformation: TryTransformationResponseSchema,
	tryTransformationBeforeUpdate: TryTransformationBeforeUpdateResponseSchema,
	updateApiKey: UpdateApiKeyResponseSchema,
	updateAuthentication: UpdateAuthenticationResponseSchema,
	updateConfig: UpdateConfigResponseSchema,
	updateDestination: UpdateDestinationResponseSchema,
	updateDictionaryEntries: UpdateDictionaryEntriesResponseSchema,
	updateRecordPartially: UpdateRecordPartiallyResponseSchema,
	updateSource: UpdateSourceResponseSchema,
	updateTask: UpdateTaskResponseSchema,
	updateTransformation: UpdateTransformationResponseSchema,
	validateSource: ValidateSourceResponseSchema,
	validateSourceBeforeUpdate: ValidateSourceBeforeUpdateResponseSchema,
} as const;

export type AlgoliaEndpointOutputs = {
	[K in keyof typeof AlgoliaEndpointOutputSchemas]: z.infer<
		(typeof AlgoliaEndpointOutputSchemas)[K]
	>;
};

export type AlgoliaEndpointInput =
	AlgoliaEndpointInputs[keyof AlgoliaEndpointInputs] & {
		[key: string]: unknown;
	};
