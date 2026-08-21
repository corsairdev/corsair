import { z } from 'zod';

// Affinda response payloads vary across 119 endpoints; per-route schemas are not yet mapped from API docs.
const AffindaResponseSchema = z.unknown();
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const AffindaOptionalBodySchema = z.unknown().optional();
// Optional query filters vary by endpoint; values are heterogeneous JSON filter objects.
const AffindaQueryParamsSchema = z.record(z.string(), z.unknown()).optional();
// Row/item arrays contain heterogeneous objects per Affinda list and batch APIs.
const AffindaBatchItemsSchema = z.array(z.unknown());
const AffindaBatchItemsOptionalSchema = z.array(z.unknown()).optional();
// Config/metadata objects are loosely typed in Affinda API docs.
const AffindaLooseRecordSchema = z.record(z.string(), z.unknown());
const AffindaLooseRecordOptionalSchema = z
	.record(z.string(), z.unknown())
	.optional();

// addTagToDocuments
const AddTagToDocumentsInputSchema = z.object({
	tag: z.number().int(),
	identifiers: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AddTagToDocumentsInput = z.infer<
	typeof AddTagToDocumentsInputSchema
>;
const AddTagToDocumentsResponseSchema = AffindaResponseSchema;
export type AddTagToDocumentsResponse = z.infer<
	typeof AddTagToDocumentsResponseSchema
>;

// batchUpdateAnnotations
const BatchUpdateAnnotationsInputSchema = z.object({
	annotations: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type BatchUpdateAnnotationsInput = z.infer<
	typeof BatchUpdateAnnotationsInputSchema
>;
const BatchUpdateAnnotationsResponseSchema = AffindaResponseSchema;
export type BatchUpdateAnnotationsResponse = z.infer<
	typeof BatchUpdateAnnotationsResponseSchema
>;

// createApiUser
const CreateApiUserInputSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
	avatar: z.string().optional(),
	username: z.string().optional(),
	organization: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateApiUserInput = z.infer<typeof CreateApiUserInputSchema>;
const CreateApiUserResponseSchema = AffindaResponseSchema;
export type CreateApiUserResponse = z.infer<typeof CreateApiUserResponseSchema>;

// createBatchAnnotations
const CreateBatchAnnotationsInputSchema = z.object({
	annotations: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateBatchAnnotationsInput = z.infer<
	typeof CreateBatchAnnotationsInputSchema
>;
const CreateBatchAnnotationsResponseSchema = AffindaResponseSchema;
export type CreateBatchAnnotationsResponse = z.infer<
	typeof CreateBatchAnnotationsResponseSchema
>;

// createCollection
const CreateCollectionInputSchema = z.object({
	name: z.string(),
	extractor: z.string(),
	workspace: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateCollectionInput = z.infer<typeof CreateCollectionInputSchema>;
const CreateCollectionResponseSchema = AffindaResponseSchema;
export type CreateCollectionResponse = z.infer<
	typeof CreateCollectionResponseSchema
>;

// createDataFieldForCollection
const CreateDataFieldForCollectionInputSchema = z.object({
	field: AffindaLooseRecordSchema,
	dataPoint: AffindaLooseRecordSchema,
	identifier: z.string(),
	categoryLabel: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDataFieldForCollectionInput = z.infer<
	typeof CreateDataFieldForCollectionInputSchema
>;
const CreateDataFieldForCollectionResponseSchema = AffindaResponseSchema;
export type CreateDataFieldForCollectionResponse = z.infer<
	typeof CreateDataFieldForCollectionResponseSchema
>;

// createDataPoint
const CreateDataPointInputSchema = z.object({
	name: z.string(),
	slug: z.string(),
	noRect: z.boolean().optional(),
	parent: z.string().optional(),
	multiple: z.boolean().optional(),
	extractor: z.string(),
	description: z.string().optional(),
	manualEntry: z.boolean().optional(),
	organization: z.string(),
	mappingDataSource: z.string().optional(),
	annotationContentType: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDataPointInput = z.infer<typeof CreateDataPointInputSchema>;
const CreateDataPointResponseSchema = AffindaResponseSchema;
export type CreateDataPointResponse = z.infer<
	typeof CreateDataPointResponseSchema
>;

// createDataPointChoice
const CreateDataPointChoiceInputSchema = z.object({
	label: z.string(),
	value: z.string(),
	synonyms: AffindaBatchItemsOptionalSchema,
	dataPoint: z.string(),
	collection: z.string().optional(),
	description: z.string().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDataPointChoiceInput = z.infer<
	typeof CreateDataPointChoiceInputSchema
>;
const CreateDataPointChoiceResponseSchema = AffindaResponseSchema;
export type CreateDataPointChoiceResponse = z.infer<
	typeof CreateDataPointChoiceResponseSchema
>;

// createDataSource
const CreateDataSourceInputSchema = z.object({
	name: z.string().optional(),
	schema: AffindaLooseRecordOptionalSchema,
	values: AffindaBatchItemsOptionalSchema,
	workspace: z.string().optional(),
	identifier: z.string(),
	keyProperty: z.string().optional(),
	organization: z.string().optional(),
	displayProperty: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDataSourceInput = z.infer<typeof CreateDataSourceInputSchema>;
const CreateDataSourceResponseSchema = AffindaResponseSchema;
export type CreateDataSourceResponse = z.infer<
	typeof CreateDataSourceResponseSchema
>;

// createDataSourceValue
const CreateDataSourceValueInputSchema = z.object({
	label: z.string().optional(),
	value: z.string(),
	identifier: z.string(),
	description: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDataSourceValueInput = z.infer<
	typeof CreateDataSourceValueInputSchema
>;
const CreateDataSourceValueResponseSchema = AffindaResponseSchema;
export type CreateDataSourceValueResponse = z.infer<
	typeof CreateDataSourceValueResponseSchema
>;

// createDocument
const CreateDocumentInputSchema = z.object({
	url: z.string().optional(),
	file: AffindaLooseRecordOptionalSchema,
	wait: z.boolean().optional(),
	compact: z.boolean().optional(),
	fileName: z.string().optional(),
	language: z.string().optional(),
	workspace: z.string().optional(),
	collection: z.string().optional(),
	expiryTime: z.string().optional(),
	identifier: z.string().optional(),
	rejectDuplicates: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDocumentInput = z.infer<typeof CreateDocumentInputSchema>;
const CreateDocumentResponseSchema = AffindaResponseSchema;
export type CreateDocumentResponse = z.infer<
	typeof CreateDocumentResponseSchema
>;

// createDocumentType
const CreateDocumentTypeInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	organization: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateDocumentTypeInput = z.infer<
	typeof CreateDocumentTypeInputSchema
>;
const CreateDocumentTypeResponseSchema = AffindaResponseSchema;
export type CreateDocumentTypeResponse = z.infer<
	typeof CreateDocumentTypeResponseSchema
>;

// createExtractor
const CreateExtractorInputSchema = z.object({
	name: z.string(),
	category: z.string().optional(),
	namePlural: z.string().optional(),
	fieldGroups: AffindaBatchItemsOptionalSchema,
	validatable: z.boolean().optional(),
	organization: z.string(),
	baseExtractor: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateExtractorInput = z.infer<typeof CreateExtractorInputSchema>;
const CreateExtractorResponseSchema = AffindaResponseSchema;
export type CreateExtractorResponse = z.infer<
	typeof CreateExtractorResponseSchema
>;

// createFromDataDocuments
const CreateFromDataDocumentsInputSchema = z.object({
	data: z.string(),
	wait: z.boolean().optional(),
	language: z.string().optional(),
	file_name: z.string().optional(),
	workspace: z.string().optional(),
	collection: z.string().optional(),
	identifier: z.string().optional(),
	snake_case: z.boolean().optional(),
	expiry_time: z.string().optional(),
	document_type: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateFromDataDocumentsInput = z.infer<
	typeof CreateFromDataDocumentsInputSchema
>;
const CreateFromDataDocumentsResponseSchema = AffindaResponseSchema;
export type CreateFromDataDocumentsResponse = z.infer<
	typeof CreateFromDataDocumentsResponseSchema
>;

// createIndex
const CreateIndexInputSchema = z.object({
	name: z.string(),
	docType: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateIndexInput = z.infer<typeof CreateIndexInputSchema>;
const CreateIndexResponseSchema = AffindaResponseSchema;
export type CreateIndexResponse = z.infer<typeof CreateIndexResponseSchema>;

// createInvitation
const CreateInvitationInputSchema = z.object({
	role: z.string().optional(),
	email: z.string(),
	organization: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateInvitationInput = z.infer<typeof CreateInvitationInputSchema>;
const CreateInvitationResponseSchema = AffindaResponseSchema;
export type CreateInvitationResponse = z.infer<
	typeof CreateInvitationResponseSchema
>;

// createJobDescriptionSearch
const CreateJobDescriptionSearchInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	resume: z.string().optional(),
	skills: AffindaBatchItemsOptionalSchema,
	degrees: AffindaBatchItemsOptionalSchema,
	indices: AffindaBatchItemsSchema,
	socCodes: AffindaBatchItemsOptionalSchema,
	jobTitles: AffindaBatchItemsOptionalSchema,
	languages: AffindaBatchItemsOptionalSchema,
	locations: AffindaBatchItemsOptionalSchema,
	customData: AffindaBatchItemsOptionalSchema,
	degreeTypes: AffindaBatchItemsOptionalSchema,
	skillsWeight: z.number().optional(),
	socCodesWeight: z.number().optional(),
	degreesRequired: z.boolean().optional(),
	educationWeight: z.number().optional(),
	jobTitlesWeight: z.number().optional(),
	languagesWeight: z.number().optional(),
	locationsWeight: z.number().optional(),
	managementLevel: z.string().optional(),
	searchExpression: z.string().optional(),
	socCodesRequired: z.boolean().optional(),
	jobTitlesRequired: z.boolean().optional(),
	locationsRequired: z.boolean().optional(),
	degreeTypesRequired: z.boolean().optional(),
	totalYearsExperience: z.number().optional(),
	managementLevelWeight: z.number().optional(),
	yearsExperienceWeight: z.number().optional(),
	searchExpressionWeight: z.number().optional(),
	managementLevelRequired: z.boolean().optional(),
	yearsExperienceRequired: z.boolean().optional(),
	searchExpressionRequired: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateJobDescriptionSearchInput = z.infer<
	typeof CreateJobDescriptionSearchInputSchema
>;
const CreateJobDescriptionSearchResponseSchema = AffindaResponseSchema;
export type CreateJobDescriptionSearchResponse = z.infer<
	typeof CreateJobDescriptionSearchResponseSchema
>;

// createJobDescriptionSearchEmbedUrl
const CreateJobDescriptionSearchEmbedUrlInputSchema = z.object({
	configOverride: AffindaLooseRecordOptionalSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateJobDescriptionSearchEmbedUrlInput = z.infer<
	typeof CreateJobDescriptionSearchEmbedUrlInputSchema
>;
const CreateJobDescriptionSearchEmbedUrlResponseSchema = AffindaResponseSchema;
export type CreateJobDescriptionSearchEmbedUrlResponse = z.infer<
	typeof CreateJobDescriptionSearchEmbedUrlResponseSchema
>;

// createMapping
const CreateMappingInputSchema = z.object({
	orderBy: z.string().optional(),
	dataSource: z.string(),
	scoreCutoff: z.number().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateMappingInput = z.infer<typeof CreateMappingInputSchema>;
const CreateMappingResponseSchema = AffindaResponseSchema;
export type CreateMappingResponse = z.infer<typeof CreateMappingResponseSchema>;

// createOrganization
const CreateOrganizationInputSchema = z.object({
	name: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateOrganizationInput = z.infer<
	typeof CreateOrganizationInputSchema
>;
const CreateOrganizationResponseSchema = AffindaResponseSchema;
export type CreateOrganizationResponse = z.infer<
	typeof CreateOrganizationResponseSchema
>;

// createResthookSubscription
const CreateResthookSubscriptionInputSchema = z.object({
	event: z.string().optional(),
	targetUrl: z.string(),
	organization: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateResthookSubscriptionInput = z.infer<
	typeof CreateResthookSubscriptionInputSchema
>;
const CreateResthookSubscriptionResponseSchema = AffindaResponseSchema;
export type CreateResthookSubscriptionResponse = z.infer<
	typeof CreateResthookSubscriptionResponseSchema
>;

// createResumeSearch
const CreateResumeSearchInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	resume: z.string().optional(),
	skills: AffindaBatchItemsOptionalSchema,
	degrees: AffindaBatchItemsOptionalSchema,
	indices: AffindaBatchItemsSchema,
	socCodes: AffindaBatchItemsOptionalSchema,
	jobTitles: AffindaBatchItemsOptionalSchema,
	languages: AffindaBatchItemsOptionalSchema,
	locations: AffindaBatchItemsOptionalSchema,
	customData: AffindaBatchItemsOptionalSchema,
	institutions: AffindaBatchItemsOptionalSchema,
	skillsWeight: z.number().optional(),
	jobDescription: z.string().optional(),
	socCodesWeight: z.number().optional(),
	degreesRequired: z.boolean().optional(),
	educationWeight: z.number().optional(),
	jobTitlesWeight: z.number().optional(),
	languagesWeight: z.number().optional(),
	locationsWeight: z.number().optional(),
	managementLevel: z.string().optional(),
	isCurrentStudent: z.boolean().optional(),
	isRecentGraduate: z.boolean().optional(),
	searchExpression: z.string().optional(),
	socCodesRequired: z.boolean().optional(),
	jobTitlesRequired: z.boolean().optional(),
	locationsRequired: z.boolean().optional(),
	highestDegreeTypes: AffindaBatchItemsOptionalSchema,
	yearsExperienceMax: z.number().int().optional(),
	yearsExperienceMin: z.number().int().optional(),
	institutionsRequired: z.boolean().optional(),
	jobTitlesCurrentOnly: z.boolean().optional(),
	managementLevelWeight: z.number().optional(),
	yearsExperienceWeight: z.number().optional(),
	searchExpressionWeight: z.number().optional(),
	managementLevelRequired: z.boolean().optional(),
	yearsExperienceRequired: z.boolean().optional(),
	isCurrentStudentRequired: z.boolean().optional(),
	isRecentGraduateRequired: z.boolean().optional(),
	searchExpressionRequired: z.boolean().optional(),
	highestDegreeTypesRequired: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateResumeSearchInput = z.infer<
	typeof CreateResumeSearchInputSchema
>;
const CreateResumeSearchResponseSchema = AffindaResponseSchema;
export type CreateResumeSearchResponse = z.infer<
	typeof CreateResumeSearchResponseSchema
>;

// createResumeSearchEmbedUrl
const CreateResumeSearchEmbedUrlInputSchema = z.object({
	configOverride: AffindaLooseRecordOptionalSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateResumeSearchEmbedUrlInput = z.infer<
	typeof CreateResumeSearchEmbedUrlInputSchema
>;
const CreateResumeSearchEmbedUrlResponseSchema = AffindaResponseSchema;
export type CreateResumeSearchEmbedUrlResponse = z.infer<
	typeof CreateResumeSearchEmbedUrlResponseSchema
>;

// createTag
const CreateTagInputSchema = z.object({
	name: z.string(),
	workspace: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateTagInput = z.infer<typeof CreateTagInputSchema>;
const CreateTagResponseSchema = AffindaResponseSchema;
export type CreateTagResponse = z.infer<typeof CreateTagResponseSchema>;

// createValidationResult
const CreateValidationResultInputSchema = z.object({
	passed: z.boolean().optional(),
	message: z.string(),
	document: z.string(),
	ruleSlug: z.string(),
	annotations: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateValidationResultInput = z.infer<
	typeof CreateValidationResultInputSchema
>;
const CreateValidationResultResponseSchema = AffindaResponseSchema;
export type CreateValidationResultResponse = z.infer<
	typeof CreateValidationResultResponseSchema
>;

// createValidationResultsBatch
const CreateValidationResultsBatchInputSchema = z.object({
	validation_results: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateValidationResultsBatchInput = z.infer<
	typeof CreateValidationResultsBatchInputSchema
>;
const CreateValidationResultsBatchResponseSchema = AffindaResponseSchema;
export type CreateValidationResultsBatchResponse = z.infer<
	typeof CreateValidationResultsBatchResponseSchema
>;

// createWorkspace
const CreateWorkspaceInputSchema = z.object({
	name: z.string(),
	visibility: z.string().optional(),
	organization: z.string(),
	rejectInvalidDocuments: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateWorkspaceInput = z.infer<typeof CreateWorkspaceInputSchema>;
const CreateWorkspaceResponseSchema = AffindaResponseSchema;
export type CreateWorkspaceResponse = z.infer<
	typeof CreateWorkspaceResponseSchema
>;

// createWorkspaceMembership
const CreateWorkspaceMembershipInputSchema = z.object({
	user: z.number().int(),
	workspace: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateWorkspaceMembershipInput = z.infer<
	typeof CreateWorkspaceMembershipInputSchema
>;
const CreateWorkspaceMembershipResponseSchema = AffindaResponseSchema;
export type CreateWorkspaceMembershipResponse = z.infer<
	typeof CreateWorkspaceMembershipResponseSchema
>;

// deleteAnnotationsBatch
const DeleteAnnotationsBatchInputSchema = z.object({
	annotation_ids: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteAnnotationsBatchInput = z.infer<
	typeof DeleteAnnotationsBatchInputSchema
>;
const DeleteAnnotationsBatchResponseSchema = AffindaResponseSchema;
export type DeleteAnnotationsBatchResponse = z.infer<
	typeof DeleteAnnotationsBatchResponseSchema
>;

// deleteCollection
const DeleteCollectionInputSchema = z.object({
	collection_id: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteCollectionInput = z.infer<typeof DeleteCollectionInputSchema>;
const DeleteCollectionResponseSchema = AffindaResponseSchema;
export type DeleteCollectionResponse = z.infer<
	typeof DeleteCollectionResponseSchema
>;

// deleteDataPoint
const DeleteDataPointInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDataPointInput = z.infer<typeof DeleteDataPointInputSchema>;
const DeleteDataPointResponseSchema = AffindaResponseSchema;
export type DeleteDataPointResponse = z.infer<
	typeof DeleteDataPointResponseSchema
>;

// deleteDataSource
const DeleteDataSourceInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDataSourceInput = z.infer<typeof DeleteDataSourceInputSchema>;
const DeleteDataSourceResponseSchema = AffindaResponseSchema;
export type DeleteDataSourceResponse = z.infer<
	typeof DeleteDataSourceResponseSchema
>;

// deleteDataSourceValue
const DeleteDataSourceValueInputSchema = z.object({
	value: z.string(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDataSourceValueInput = z.infer<
	typeof DeleteDataSourceValueInputSchema
>;
const DeleteDataSourceValueResponseSchema = AffindaResponseSchema;
export type DeleteDataSourceValueResponse = z.infer<
	typeof DeleteDataSourceValueResponseSchema
>;

// deleteDocument
const DeleteDocumentInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDocumentInput = z.infer<typeof DeleteDocumentInputSchema>;
const DeleteDocumentResponseSchema = AffindaResponseSchema;
export type DeleteDocumentResponse = z.infer<
	typeof DeleteDocumentResponseSchema
>;

// deleteDocumentType
const DeleteDocumentTypeInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteDocumentTypeInput = z.infer<
	typeof DeleteDocumentTypeInputSchema
>;
const DeleteDocumentTypeResponseSchema = AffindaResponseSchema;
export type DeleteDocumentTypeResponse = z.infer<
	typeof DeleteDocumentTypeResponseSchema
>;

// deleteExtractor
const DeleteExtractorInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteExtractorInput = z.infer<typeof DeleteExtractorInputSchema>;
const DeleteExtractorResponseSchema = AffindaResponseSchema;
export type DeleteExtractorResponse = z.infer<
	typeof DeleteExtractorResponseSchema
>;

// deleteIndex
const DeleteIndexInputSchema = z.object({
	name: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteIndexInput = z.infer<typeof DeleteIndexInputSchema>;
const DeleteIndexResponseSchema = AffindaResponseSchema;
export type DeleteIndexResponse = z.infer<typeof DeleteIndexResponseSchema>;

// deleteInvitation
const DeleteInvitationInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteInvitationInput = z.infer<typeof DeleteInvitationInputSchema>;
const DeleteInvitationResponseSchema = AffindaResponseSchema;
export type DeleteInvitationResponse = z.infer<
	typeof DeleteInvitationResponseSchema
>;

// deleteMapping
const DeleteMappingInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteMappingInput = z.infer<typeof DeleteMappingInputSchema>;
const DeleteMappingResponseSchema = AffindaResponseSchema;
export type DeleteMappingResponse = z.infer<typeof DeleteMappingResponseSchema>;

// deleteOrganization
const DeleteOrganizationInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteOrganizationInput = z.infer<
	typeof DeleteOrganizationInputSchema
>;
const DeleteOrganizationResponseSchema = AffindaResponseSchema;
export type DeleteOrganizationResponse = z.infer<
	typeof DeleteOrganizationResponseSchema
>;

// deleteResthookSubscription
const DeleteResthookSubscriptionInputSchema = z.object({
	identifier: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteResthookSubscriptionInput = z.infer<
	typeof DeleteResthookSubscriptionInputSchema
>;
const DeleteResthookSubscriptionResponseSchema = AffindaResponseSchema;
export type DeleteResthookSubscriptionResponse = z.infer<
	typeof DeleteResthookSubscriptionResponseSchema
>;

// deleteTag
const DeleteTagInputSchema = z.object({
	id: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteTagInput = z.infer<typeof DeleteTagInputSchema>;
const DeleteTagResponseSchema = AffindaResponseSchema;
export type DeleteTagResponse = z.infer<typeof DeleteTagResponseSchema>;

// deleteValidationResults
const DeleteValidationResultsInputSchema = z.object({
	ids: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteValidationResultsInput = z.infer<
	typeof DeleteValidationResultsInputSchema
>;
const DeleteValidationResultsResponseSchema = AffindaResponseSchema;
export type DeleteValidationResultsResponse = z.infer<
	typeof DeleteValidationResultsResponseSchema
>;

// deleteWorkspace
const DeleteWorkspaceInputSchema = z.object({
	workspace_id: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteWorkspaceInput = z.infer<typeof DeleteWorkspaceInputSchema>;
const DeleteWorkspaceResponseSchema = AffindaResponseSchema;
export type DeleteWorkspaceResponse = z.infer<
	typeof DeleteWorkspaceResponseSchema
>;

// deleteWorkspaceMembership
const DeleteWorkspaceMembershipInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteWorkspaceMembershipInput = z.infer<
	typeof DeleteWorkspaceMembershipInputSchema
>;
const DeleteWorkspaceMembershipResponseSchema = AffindaResponseSchema;
export type DeleteWorkspaceMembershipResponse = z.infer<
	typeof DeleteWorkspaceMembershipResponseSchema
>;

// getAllApiUsers
const GetAllApiUsersInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllApiUsersInput = z.infer<typeof GetAllApiUsersInputSchema>;
const GetAllApiUsersResponseSchema = AffindaResponseSchema;
export type GetAllApiUsersResponse = z.infer<
	typeof GetAllApiUsersResponseSchema
>;

// getAllDocumentSplitters
const GetAllDocumentSplittersInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	organization: z.string().optional(),
	includePublic: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllDocumentSplittersInput = z.infer<
	typeof GetAllDocumentSplittersInputSchema
>;
const GetAllDocumentSplittersResponseSchema = AffindaResponseSchema;
export type GetAllDocumentSplittersResponse = z.infer<
	typeof GetAllDocumentSplittersResponseSchema
>;

// getAllInvitations
const GetAllInvitationsInputSchema = z.object({
	role: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	status: z.string().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllInvitationsInput = z.infer<
	typeof GetAllInvitationsInputSchema
>;
const GetAllInvitationsResponseSchema = AffindaResponseSchema;
export type GetAllInvitationsResponse = z.infer<
	typeof GetAllInvitationsResponseSchema
>;

// getAllOrganizationMemberships
const GetAllOrganizationMembershipsInputSchema = z.object({
	role: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllOrganizationMembershipsInput = z.infer<
	typeof GetAllOrganizationMembershipsInputSchema
>;
const GetAllOrganizationMembershipsResponseSchema = AffindaResponseSchema;
export type GetAllOrganizationMembershipsResponse = z.infer<
	typeof GetAllOrganizationMembershipsResponseSchema
>;

// getAllTags
const GetAllTagsInputSchema = z.object({
	name: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	workspace: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllTagsInput = z.infer<typeof GetAllTagsInputSchema>;
const GetAllTagsResponseSchema = AffindaResponseSchema;
export type GetAllTagsResponse = z.infer<typeof GetAllTagsResponseSchema>;

// getAllValidationResults
const GetAllValidationResultsInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	document: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllValidationResultsInput = z.infer<
	typeof GetAllValidationResultsInputSchema
>;
const GetAllValidationResultsResponseSchema = AffindaResponseSchema;
export type GetAllValidationResultsResponse = z.infer<
	typeof GetAllValidationResultsResponseSchema
>;

// getAllWorkspaceMemberships
const GetAllWorkspaceMembershipsInputSchema = z.object({
	user: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	workspace: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAllWorkspaceMembershipsInput = z.infer<
	typeof GetAllWorkspaceMembershipsInputSchema
>;
const GetAllWorkspaceMembershipsResponseSchema = AffindaResponseSchema;
export type GetAllWorkspaceMembershipsResponse = z.infer<
	typeof GetAllWorkspaceMembershipsResponseSchema
>;

// getAnnotations
const GetAnnotationsInputSchema = z.object({
	document: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAnnotationsInput = z.infer<typeof GetAnnotationsInputSchema>;
const GetAnnotationsResponseSchema = AffindaResponseSchema;
export type GetAnnotationsResponse = z.infer<
	typeof GetAnnotationsResponseSchema
>;

// getCollection
const GetCollectionInputSchema = z.object({
	collection_id: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetCollectionInput = z.infer<typeof GetCollectionInputSchema>;
const GetCollectionResponseSchema = AffindaResponseSchema;
export type GetCollectionResponse = z.infer<typeof GetCollectionResponseSchema>;

// getCollectionFields
const GetCollectionFieldsInputSchema = z.object({
	identifier: z.string(),
	datapoint_identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetCollectionFieldsInput = z.infer<
	typeof GetCollectionFieldsInputSchema
>;
const GetCollectionFieldsResponseSchema = AffindaResponseSchema;
export type GetCollectionFieldsResponse = z.infer<
	typeof GetCollectionFieldsResponseSchema
>;

// getCollections
const GetCollectionsInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	workspace: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetCollectionsInput = z.infer<typeof GetCollectionsInputSchema>;
const GetCollectionsResponseSchema = AffindaResponseSchema;
export type GetCollectionsResponse = z.infer<
	typeof GetCollectionsResponseSchema
>;

// getCollectionUsage
const GetCollectionUsageInputSchema = z.object({
	end: z.string().optional(),
	start: z.string().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetCollectionUsageInput = z.infer<
	typeof GetCollectionUsageInputSchema
>;
const GetCollectionUsageResponseSchema = AffindaResponseSchema;
export type GetCollectionUsageResponse = z.infer<
	typeof GetCollectionUsageResponseSchema
>;

// getDataPoint
const GetDataPointInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDataPointInput = z.infer<typeof GetDataPointInputSchema>;
const GetDataPointResponseSchema = AffindaResponseSchema;
export type GetDataPointResponse = z.infer<typeof GetDataPointResponseSchema>;

// getDataPointChoice
const GetDataPointChoiceInputSchema = z.object({
	id: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDataPointChoiceInput = z.infer<
	typeof GetDataPointChoiceInputSchema
>;
const GetDataPointChoiceResponseSchema = AffindaResponseSchema;
export type GetDataPointChoiceResponse = z.infer<
	typeof GetDataPointChoiceResponseSchema
>;

// getDataSource
const GetDataSourceInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDataSourceInput = z.infer<typeof GetDataSourceInputSchema>;
const GetDataSourceResponseSchema = AffindaResponseSchema;
export type GetDataSourceResponse = z.infer<typeof GetDataSourceResponseSchema>;

// getDataSourceValue
const GetDataSourceValueInputSchema = z.object({
	value: z.string(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDataSourceValueInput = z.infer<
	typeof GetDataSourceValueInputSchema
>;
const GetDataSourceValueResponseSchema = AffindaResponseSchema;
export type GetDataSourceValueResponse = z.infer<
	typeof GetDataSourceValueResponseSchema
>;

// getDataSourceValues
const GetDataSourceValuesInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	document: z.string().optional(),
	annotation: z.number().int().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDataSourceValuesInput = z.infer<
	typeof GetDataSourceValuesInputSchema
>;
const GetDataSourceValuesResponseSchema = AffindaResponseSchema;
export type GetDataSourceValuesResponse = z.infer<
	typeof GetDataSourceValuesResponseSchema
>;

// getDocument
const GetDocumentInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;
const GetDocumentResponseSchema = AffindaResponseSchema;
export type GetDocumentResponse = z.infer<typeof GetDocumentResponseSchema>;

// getDocumentRedacted
const GetDocumentRedactedInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentRedactedInput = z.infer<
	typeof GetDocumentRedactedInputSchema
>;
const GetDocumentRedactedResponseSchema = AffindaResponseSchema;
export type GetDocumentRedactedResponse = z.infer<
	typeof GetDocumentRedactedResponseSchema
>;

// getDocuments
const GetDocumentsInputSchema = z.object({
	count: z.boolean().optional(),
	limit: z.number().int().optional(),
	ready: z.boolean().optional(),
	state: z.string().optional(),
	failed: z.boolean().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	compact: z.boolean().optional(),
	ordering: z.string().optional(),
	workspace: z.string().optional(),
	collection: z.string().optional(),
	include_data: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentsInput = z.infer<typeof GetDocumentsInputSchema>;
const GetDocumentsResponseSchema = AffindaResponseSchema;
export type GetDocumentsResponse = z.infer<typeof GetDocumentsResponseSchema>;

// getDocumentSplitter
const GetDocumentSplitterInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentSplitterInput = z.infer<
	typeof GetDocumentSplitterInputSchema
>;
const GetDocumentSplitterResponseSchema = AffindaResponseSchema;
export type GetDocumentSplitterResponse = z.infer<
	typeof GetDocumentSplitterResponseSchema
>;

// getDocumentType
const GetDocumentTypeInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentTypeInput = z.infer<typeof GetDocumentTypeInputSchema>;
const GetDocumentTypeResponseSchema = AffindaResponseSchema;
export type GetDocumentTypeResponse = z.infer<
	typeof GetDocumentTypeResponseSchema
>;

// getDocumentTypeJsonSchema
const GetDocumentTypeJsonSchemaInputSchema = z.object({
	title: z.string().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentTypeJsonSchemaInput = z.infer<
	typeof GetDocumentTypeJsonSchemaInputSchema
>;
const GetDocumentTypeJsonSchemaResponseSchema = AffindaResponseSchema;
export type GetDocumentTypeJsonSchemaResponse = z.infer<
	typeof GetDocumentTypeJsonSchemaResponseSchema
>;

// getDocumentTypePydanticModels
const GetDocumentTypePydanticModelsInputSchema = z.object({
	identifier: z.string(),
	model_name: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentTypePydanticModelsInput = z.infer<
	typeof GetDocumentTypePydanticModelsInputSchema
>;
const GetDocumentTypePydanticModelsResponseSchema = AffindaResponseSchema;
export type GetDocumentTypePydanticModelsResponse = z.infer<
	typeof GetDocumentTypePydanticModelsResponseSchema
>;

// getDocumentTypes
const GetDocumentTypesInputSchema = z.object({
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDocumentTypesInput = z.infer<typeof GetDocumentTypesInputSchema>;
const GetDocumentTypesResponseSchema = AffindaResponseSchema;
export type GetDocumentTypesResponse = z.infer<
	typeof GetDocumentTypesResponseSchema
>;

// getExtractor
const GetExtractorInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetExtractorInput = z.infer<typeof GetExtractorInputSchema>;
const GetExtractorResponseSchema = AffindaResponseSchema;
export type GetExtractorResponse = z.infer<typeof GetExtractorResponseSchema>;

// getExtractors
const GetExtractorsInputSchema = z.object({
	organization: z.string(),
	include_public_extractors: z.boolean().optional(),
	name: z.string().optional(),
	validatable: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetExtractorsInput = z.infer<typeof GetExtractorsInputSchema>;
const GetExtractorsResponseSchema = AffindaResponseSchema;
export type GetExtractorsResponse = z.infer<typeof GetExtractorsResponseSchema>;

// getIndexDocuments
const GetIndexDocumentsInputSchema = z.object({
	name: z.string(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetIndexDocumentsInput = z.infer<
	typeof GetIndexDocumentsInputSchema
>;
const GetIndexDocumentsResponseSchema = AffindaResponseSchema;
export type GetIndexDocumentsResponse = z.infer<
	typeof GetIndexDocumentsResponseSchema
>;

// getInvitation
const GetInvitationInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetInvitationInput = z.infer<typeof GetInvitationInputSchema>;
const GetInvitationResponseSchema = AffindaResponseSchema;
export type GetInvitationResponse = z.infer<typeof GetInvitationResponseSchema>;

// getJobDescriptionSearchConfig
const GetJobDescriptionSearchConfigInputSchema = z.object({
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetJobDescriptionSearchConfigInput = z.infer<
	typeof GetJobDescriptionSearchConfigInputSchema
>;
const GetJobDescriptionSearchConfigResponseSchema = AffindaResponseSchema;
export type GetJobDescriptionSearchConfigResponse = z.infer<
	typeof GetJobDescriptionSearchConfigResponseSchema
>;

// getMapping
const GetMappingInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetMappingInput = z.infer<typeof GetMappingInputSchema>;
const GetMappingResponseSchema = AffindaResponseSchema;
export type GetMappingResponse = z.infer<typeof GetMappingResponseSchema>;

// getOrganization
const GetOrganizationInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetOrganizationInput = z.infer<typeof GetOrganizationInputSchema>;
const GetOrganizationResponseSchema = AffindaResponseSchema;
export type GetOrganizationResponse = z.infer<
	typeof GetOrganizationResponseSchema
>;

// getOrganizationMembership
const GetOrganizationMembershipInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetOrganizationMembershipInput = z.infer<
	typeof GetOrganizationMembershipInputSchema
>;
const GetOrganizationMembershipResponseSchema = AffindaResponseSchema;
export type GetOrganizationMembershipResponse = z.infer<
	typeof GetOrganizationMembershipResponseSchema
>;

// getOrganizations
const GetOrganizationsInputSchema = z.object({
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetOrganizationsInput = z.infer<typeof GetOrganizationsInputSchema>;
const GetOrganizationsResponseSchema = AffindaResponseSchema;
export type GetOrganizationsResponse = z.infer<
	typeof GetOrganizationsResponseSchema
>;

// getResthookSubscription
const GetResthookSubscriptionInputSchema = z.object({
	identifier: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetResthookSubscriptionInput = z.infer<
	typeof GetResthookSubscriptionInputSchema
>;
const GetResthookSubscriptionResponseSchema = AffindaResponseSchema;
export type GetResthookSubscriptionResponse = z.infer<
	typeof GetResthookSubscriptionResponseSchema
>;

// getResthookSubscriptions
const GetResthookSubscriptionsInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetResthookSubscriptionsInput = z.infer<
	typeof GetResthookSubscriptionsInputSchema
>;
const GetResthookSubscriptionsResponseSchema = AffindaResponseSchema;
export type GetResthookSubscriptionsResponse = z.infer<
	typeof GetResthookSubscriptionsResponseSchema
>;

// getTag
const GetTagInputSchema = z.object({
	tag_id: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTagInput = z.infer<typeof GetTagInputSchema>;
const GetTagResponseSchema = AffindaResponseSchema;
export type GetTagResponse = z.infer<typeof GetTagResponseSchema>;

// getUsageByWorkspace
const GetUsageByWorkspaceInputSchema = z.object({
	end: z.string().optional(),
	start: z.string().optional(),
	workspace_id: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetUsageByWorkspaceInput = z.infer<
	typeof GetUsageByWorkspaceInputSchema
>;
const GetUsageByWorkspaceResponseSchema = AffindaResponseSchema;
export type GetUsageByWorkspaceResponse = z.infer<
	typeof GetUsageByWorkspaceResponseSchema
>;

// getWorkspace
const GetWorkspaceInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetWorkspaceInput = z.infer<typeof GetWorkspaceInputSchema>;
const GetWorkspaceResponseSchema = AffindaResponseSchema;
export type GetWorkspaceResponse = z.infer<typeof GetWorkspaceResponseSchema>;

// getWorkspaceMembership
const GetWorkspaceMembershipInputSchema = z.object({
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetWorkspaceMembershipInput = z.infer<
	typeof GetWorkspaceMembershipInputSchema
>;
const GetWorkspaceMembershipResponseSchema = AffindaResponseSchema;
export type GetWorkspaceMembershipResponse = z.infer<
	typeof GetWorkspaceMembershipResponseSchema
>;

// getWorkspaces
const GetWorkspacesInputSchema = z.object({
	name: z.string().optional(),
	organization: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetWorkspacesInput = z.infer<typeof GetWorkspacesInputSchema>;
const GetWorkspacesResponseSchema = AffindaResponseSchema;
export type GetWorkspacesResponse = z.infer<typeof GetWorkspacesResponseSchema>;

// listDataPointChoices
const ListDataPointChoicesInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	search: z.string().optional(),
	collection: z.string(),
	data_point: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDataPointChoicesInput = z.infer<
	typeof ListDataPointChoicesInputSchema
>;
const ListDataPointChoicesResponseSchema = AffindaResponseSchema;
export type ListDataPointChoicesResponse = z.infer<
	typeof ListDataPointChoicesResponseSchema
>;

// listDataPoints
const ListDataPointsInputSchema = z.object({
	slug: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	extractor: z.string().optional(),
	identifier: AffindaBatchItemsOptionalSchema,
	description: z.string().optional(),
	organization: z.string().optional(),
	include_public: z.boolean().optional(),
	annotation_content_type: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDataPointsInput = z.infer<typeof ListDataPointsInputSchema>;
const ListDataPointsResponseSchema = AffindaResponseSchema;
export type ListDataPointsResponse = z.infer<
	typeof ListDataPointsResponseSchema
>;

// listDataSources
const ListDataSourcesInputSchema = z.object({
	name: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	workspace: z.string().optional(),
	identifier: z.string().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListDataSourcesInput = z.infer<typeof ListDataSourcesInputSchema>;
const ListDataSourcesResponseSchema = AffindaResponseSchema;
export type ListDataSourcesResponse = z.infer<
	typeof ListDataSourcesResponseSchema
>;

// listIndexes
const ListIndexesInputSchema = z.object({
	name: z.string().optional(),
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	document_type: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListIndexesInput = z.infer<typeof ListIndexesInputSchema>;
const ListIndexesResponseSchema = AffindaResponseSchema;
export type ListIndexesResponse = z.infer<typeof ListIndexesResponseSchema>;

// listMappings
const ListMappingsInputSchema = z.object({
	limit: z.number().int().optional(),
	offset: z.number().int().optional(),
	mappingDataSource: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListMappingsInput = z.infer<typeof ListMappingsInputSchema>;
const ListMappingsResponseSchema = AffindaResponseSchema;
export type ListMappingsResponse = z.infer<typeof ListMappingsResponseSchema>;

// listOccupationGroups
const ListOccupationGroupsInputSchema = z.object({
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListOccupationGroupsInput = z.infer<
	typeof ListOccupationGroupsInputSchema
>;
const ListOccupationGroupsResponseSchema = AffindaResponseSchema;
export type ListOccupationGroupsResponse = z.infer<
	typeof ListOccupationGroupsResponseSchema
>;

// listResumeSearchConfig
const ListResumeSearchConfigInputSchema = z.object({
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListResumeSearchConfigInput = z.infer<
	typeof ListResumeSearchConfigInputSchema
>;
const ListResumeSearchConfigResponseSchema = AffindaResponseSchema;
export type ListResumeSearchConfigResponse = z.infer<
	typeof ListResumeSearchConfigResponseSchema
>;

// listResumeSearchJobTitleSuggestions
const ListResumeSearchJobTitleSuggestionsInputSchema = z.object({
	job_titles: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListResumeSearchJobTitleSuggestionsInput = z.infer<
	typeof ListResumeSearchJobTitleSuggestionsInputSchema
>;
const ListResumeSearchJobTitleSuggestionsResponseSchema = AffindaResponseSchema;
export type ListResumeSearchJobTitleSuggestionsResponse = z.infer<
	typeof ListResumeSearchJobTitleSuggestionsResponseSchema
>;

// listResumeSearchSkillSuggestions
const ListResumeSearchSkillSuggestionsInputSchema = z.object({
	skills: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListResumeSearchSkillSuggestionsInput = z.infer<
	typeof ListResumeSearchSkillSuggestionsInputSchema
>;
const ListResumeSearchSkillSuggestionsResponseSchema = AffindaResponseSchema;
export type ListResumeSearchSkillSuggestionsResponse = z.infer<
	typeof ListResumeSearchSkillSuggestionsResponseSchema
>;

// removeTagFromDocuments
const RemoveTagFromDocumentsInputSchema = z.object({
	tag: z.number().int(),
	identifiers: AffindaBatchItemsSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type RemoveTagFromDocumentsInput = z.infer<
	typeof RemoveTagFromDocumentsInputSchema
>;
const RemoveTagFromDocumentsResponseSchema = AffindaResponseSchema;
export type RemoveTagFromDocumentsResponse = z.infer<
	typeof RemoveTagFromDocumentsResponseSchema
>;

// replaceDataPointChoices
const ReplaceDataPointChoicesInputSchema = z.object({
	choices: AffindaBatchItemsSchema,
	dataPoint: z.string(),
	collection: z.string().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ReplaceDataPointChoicesInput = z.infer<
	typeof ReplaceDataPointChoicesInputSchema
>;
const ReplaceDataPointChoicesResponseSchema = AffindaResponseSchema;
export type ReplaceDataPointChoicesResponse = z.infer<
	typeof ReplaceDataPointChoicesResponseSchema
>;

// replaceDataSourceValues
const ReplaceDataSourceValuesInputSchema = z.object({
	values: AffindaBatchItemsSchema,
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ReplaceDataSourceValuesInput = z.infer<
	typeof ReplaceDataSourceValuesInputSchema
>;
const ReplaceDataSourceValuesResponseSchema = AffindaResponseSchema;
export type ReplaceDataSourceValuesResponse = z.infer<
	typeof ReplaceDataSourceValuesResponseSchema
>;

// splitDocumentPages
const SplitDocumentPagesInputSchema = z.object({
	splits: AffindaBatchItemsSchema,
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type SplitDocumentPagesInput = z.infer<
	typeof SplitDocumentPagesInputSchema
>;
const SplitDocumentPagesResponseSchema = AffindaResponseSchema;
export type SplitDocumentPagesResponse = z.infer<
	typeof SplitDocumentPagesResponseSchema
>;

// updateAnnotation
const UpdateAnnotationInputSchema = z.object({
	id: z.number().int(),
	raw: z.string().optional(),
	field: z.string().optional(),
	parent: z.number().int().optional(),
	parsed: z.string().optional(),
	document: z.string().optional(),
	dataPoint: z.string().optional(),
	pageIndex: z.number().int().optional(),
	rectangles: AffindaBatchItemsOptionalSchema,
	isClientVerified: z.boolean().optional(),
	validationResults: AffindaBatchItemsOptionalSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateAnnotationInput = z.infer<typeof UpdateAnnotationInputSchema>;
const UpdateAnnotationResponseSchema = AffindaResponseSchema;
export type UpdateAnnotationResponse = z.infer<
	typeof UpdateAnnotationResponseSchema
>;

// updateCollection
const UpdateCollectionInputSchema = z.object({
	name: z.string().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateCollectionInput = z.infer<typeof UpdateCollectionInputSchema>;
const UpdateCollectionResponseSchema = AffindaResponseSchema;
export type UpdateCollectionResponse = z.infer<
	typeof UpdateCollectionResponseSchema
>;

// updateDataFieldForCollection
const UpdateDataFieldForCollectionInputSchema = z.object({
	label: z.string().optional(),
	mapping: z.string().optional(),
	fieldType: z.string().optional(),
	mandatory: z.boolean().optional(),
	dataSource: z.string().optional(),
	identifier: z.string(),
	showDropdown: z.boolean().optional(),
	displayRawText: z.string().optional(),
	displayEnumValue: z.boolean().optional(),
	datapoint_identifier: z.string(),
	autoValidationThreshold: z.number().optional(),
	enableAutoValidationThreshold: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDataFieldForCollectionInput = z.infer<
	typeof UpdateDataFieldForCollectionInputSchema
>;
const UpdateDataFieldForCollectionResponseSchema = AffindaResponseSchema;
export type UpdateDataFieldForCollectionResponse = z.infer<
	typeof UpdateDataFieldForCollectionResponseSchema
>;

// updateDataPoint
const UpdateDataPointInputSchema = z.object({
	name: z.string().optional(),
	slug: z.string().optional(),
	parent: z.string().optional(),
	identifier: z.string(),
	description: z.string().optional(),
	mappingDataSource: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDataPointInput = z.infer<typeof UpdateDataPointInputSchema>;
const UpdateDataPointResponseSchema = AffindaResponseSchema;
export type UpdateDataPointResponse = z.infer<
	typeof UpdateDataPointResponseSchema
>;

// updateDataPointChoice
const UpdateDataPointChoiceInputSchema = z.object({
	id: z.number().int(),
	label: z.string().optional(),
	value: z.string().optional(),
	synonyms: AffindaBatchItemsOptionalSchema,
	dataPoint: z.string().optional(),
	collection: z.string().optional(),
	description: z.string().optional(),
	organization: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDataPointChoiceInput = z.infer<
	typeof UpdateDataPointChoiceInputSchema
>;
const UpdateDataPointChoiceResponseSchema = AffindaResponseSchema;
export type UpdateDataPointChoiceResponse = z.infer<
	typeof UpdateDataPointChoiceResponseSchema
>;

// updateDataSourceValue
const UpdateDataSourceValueInputSchema = z.object({
	label: z.string().optional(),
	value: z.string(),
	identifier: z.string(),
	description: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDataSourceValueInput = z.infer<
	typeof UpdateDataSourceValueInputSchema
>;
const UpdateDataSourceValueResponseSchema = AffindaResponseSchema;
export type UpdateDataSourceValueResponse = z.infer<
	typeof UpdateDataSourceValueResponseSchema
>;

// updateDocument
const UpdateDocumentInputSchema = z.object({
	fileName: z.string().optional(),
	language: z.string().optional(),
	workspace: z.string().optional(),
	collection: z.string().optional(),
	expiryTime: z.string().optional(),
	identifier: z.string(),
	regionBias: AffindaLooseRecordOptionalSchema,
	customIdentifier: z.string().optional(),
	deleteAfterParse: z.boolean().optional(),
	enableValidationTool: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDocumentInput = z.infer<typeof UpdateDocumentInputSchema>;
const UpdateDocumentResponseSchema = AffindaResponseSchema;
export type UpdateDocumentResponse = z.infer<
	typeof UpdateDocumentResponseSchema
>;

// updateDocumentData
const UpdateDocumentDataInputSchema = z.object({
	data: AffindaLooseRecordSchema,
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDocumentDataInput = z.infer<
	typeof UpdateDocumentDataInputSchema
>;
const UpdateDocumentDataResponseSchema = AffindaResponseSchema;
export type UpdateDocumentDataResponse = z.infer<
	typeof UpdateDocumentDataResponseSchema
>;

// updateDocumentType
const UpdateDocumentTypeInputSchema = z.object({
	name: z.string().optional(),
	identifier: z.string(),
	description: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateDocumentTypeInput = z.infer<
	typeof UpdateDocumentTypeInputSchema
>;
const UpdateDocumentTypeResponseSchema = AffindaResponseSchema;
export type UpdateDocumentTypeResponse = z.infer<
	typeof UpdateDocumentTypeResponseSchema
>;

// updateExtractor
const UpdateExtractorInputSchema = z.object({
	name: z.string().optional(),
	category: z.string().optional(),
	identifier: z.string(),
	namePlural: z.string().optional(),
	fieldGroups: AffindaBatchItemsOptionalSchema,
	validatable: z.boolean().optional(),
	baseExtractor: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateExtractorInput = z.infer<typeof UpdateExtractorInputSchema>;
const UpdateExtractorResponseSchema = AffindaResponseSchema;
export type UpdateExtractorResponse = z.infer<
	typeof UpdateExtractorResponseSchema
>;

// updateIndex
const UpdateIndexInputSchema = z.object({
	name: z.string(),
	new_name: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateIndexInput = z.infer<typeof UpdateIndexInputSchema>;
const UpdateIndexResponseSchema = AffindaResponseSchema;
export type UpdateIndexResponse = z.infer<typeof UpdateIndexResponseSchema>;

// updateInvitation
const UpdateInvitationInputSchema = z.object({
	role: z.string().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateInvitationInput = z.infer<typeof UpdateInvitationInputSchema>;
const UpdateInvitationResponseSchema = AffindaResponseSchema;
export type UpdateInvitationResponse = z.infer<
	typeof UpdateInvitationResponseSchema
>;

// updateJobDescriptionSearchConfig
const UpdateJobDescriptionSearchConfigInputSchema = z.object({
	userId: z.number().int().optional(),
	actions: AffindaBatchItemsOptionalSchema,
	indices: AffindaBatchItemsOptionalSchema,
	username: z.string().optional(),
	maxResults: z.number().int().optional(),
	hideToolbar: z.boolean().optional(),
	distanceUnit: z.string().optional(),
	weightSkills: z.number().optional(),
	displaySkills: z.boolean().optional(),
	hideSidePanel: z.boolean().optional(),
	weightJobTitle: z.number().optional(),
	weightKeywords: z.number().optional(),
	weightLocation: z.number().optional(),
	displayJobTitle: z.boolean().optional(),
	displayKeywords: z.boolean().optional(),
	displayLocation: z.boolean().optional(),
	searchToolTheme: AffindaLooseRecordOptionalSchema,
	weightEducation: z.number().optional(),
	weightLanguages: z.number().optional(),
	allowPdfDownload: z.boolean().optional(),
	displayEducation: z.boolean().optional(),
	displayLanguages: z.boolean().optional(),
	showIndexDropdown: z.boolean().optional(),
	customFieldsConfig: AffindaBatchItemsOptionalSchema,
	weightManagementLevel: z.number().optional(),
	weightOccupationGroup: z.number().optional(),
	weightYearsExperience: z.number().optional(),
	displayManagementLevel: z.boolean().optional(),
	displayOccupationGroup: z.boolean().optional(),
	displayYearsExperience: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateJobDescriptionSearchConfigInput = z.infer<
	typeof UpdateJobDescriptionSearchConfigInputSchema
>;
const UpdateJobDescriptionSearchConfigResponseSchema = AffindaResponseSchema;
export type UpdateJobDescriptionSearchConfigResponse = z.infer<
	typeof UpdateJobDescriptionSearchConfigResponseSchema
>;

// updateMapping
const UpdateMappingInputSchema = z.object({
	orderBy: z.string().optional(),
	identifier: z.string(),
	scoreCutoff: z.number().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateMappingInput = z.infer<typeof UpdateMappingInputSchema>;
const UpdateMappingResponseSchema = AffindaResponseSchema;
export type UpdateMappingResponse = z.infer<typeof UpdateMappingResponseSchema>;

// updateOrganization
const UpdateOrganizationInputSchema = z.object({
	name: z.string().optional(),
	avatar: z.string().optional(),
	identifier: z.string(),
	resthook_signature_key: z.string().optional(),
	validation_tool_config: AffindaLooseRecordOptionalSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateOrganizationInput = z.infer<
	typeof UpdateOrganizationInputSchema
>;
const UpdateOrganizationResponseSchema = AffindaResponseSchema;
export type UpdateOrganizationResponse = z.infer<
	typeof UpdateOrganizationResponseSchema
>;

// updateOrganizationMembership
const UpdateOrganizationMembershipInputSchema = z.object({
	role: z.string().optional(),
	identifier: z.string(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateOrganizationMembershipInput = z.infer<
	typeof UpdateOrganizationMembershipInputSchema
>;
const UpdateOrganizationMembershipResponseSchema = AffindaResponseSchema;
export type UpdateOrganizationMembershipResponse = z.infer<
	typeof UpdateOrganizationMembershipResponseSchema
>;

// updateResthookSubscription
const UpdateResthookSubscriptionInputSchema = z.object({
	event: z.string().optional(),
	active: z.boolean().optional(),
	targetUrl: z.string().optional(),
	identifier: z.number().int(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateResthookSubscriptionInput = z.infer<
	typeof UpdateResthookSubscriptionInputSchema
>;
const UpdateResthookSubscriptionResponseSchema = AffindaResponseSchema;
export type UpdateResthookSubscriptionResponse = z.infer<
	typeof UpdateResthookSubscriptionResponseSchema
>;

// updateResumeSearchConfig
const UpdateResumeSearchConfigInputSchema = z.object({
	userId: z.number().int().optional(),
	actions: AffindaBatchItemsOptionalSchema,
	indices: AffindaBatchItemsOptionalSchema,
	username: z.string().optional(),
	maxResults: z.number().int().optional(),
	hideToolbar: z.boolean().optional(),
	distanceUnit: z.string().optional(),
	weightSkills: z.number().optional(),
	displaySkills: z.boolean().optional(),
	hideSidePanel: z.boolean().optional(),
	weightJobTitle: z.number().optional(),
	weightKeywords: z.number().optional(),
	weightLocation: z.number().optional(),
	displayJobTitle: z.boolean().optional(),
	displayKeywords: z.boolean().optional(),
	displayLocation: z.boolean().optional(),
	searchToolTheme: AffindaLooseRecordOptionalSchema,
	weightEducation: z.number().optional(),
	weightLanguages: z.number().optional(),
	allowPdfDownload: z.boolean().optional(),
	displayEducation: z.boolean().optional(),
	displayLanguages: z.boolean().optional(),
	showIndexDropdown: z.boolean().optional(),
	customFieldsConfig: AffindaBatchItemsOptionalSchema,
	weightManagementLevel: z.number().optional(),
	weightOccupationGroup: z.number().optional(),
	weightYearsExperience: z.number().optional(),
	displayManagementLevel: z.boolean().optional(),
	displayOccupationGroup: z.boolean().optional(),
	displayYearsExperience: z.boolean().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateResumeSearchConfigInput = z.infer<
	typeof UpdateResumeSearchConfigInputSchema
>;
const UpdateResumeSearchConfigResponseSchema = AffindaResponseSchema;
export type UpdateResumeSearchConfigResponse = z.infer<
	typeof UpdateResumeSearchConfigResponseSchema
>;

// updateTag
const UpdateTagInputSchema = z.object({
	id: z.number().int(),
	name: z.string().optional(),
	workspace: z.string().optional(),
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateTagInput = z.infer<typeof UpdateTagInputSchema>;
const UpdateTagResponseSchema = AffindaResponseSchema;
export type UpdateTagResponse = z.infer<typeof UpdateTagResponseSchema>;

// updateWorkspace
const UpdateWorkspaceInputSchema = z.object({
	name: z.string().optional(),
	visibility: z.string().optional(),
	workspace_id: z.string(),
	documentTypes: AffindaBatchItemsOptionalSchema,
	documentSplitter: z.string().optional(),
	rejectDuplicates: z.boolean().optional(),
	rejectInvalidDocuments: z.boolean().optional(),
	whitelistIngestAddresses: AffindaBatchItemsOptionalSchema,
	body: AffindaOptionalBodySchema,
	query: AffindaQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateWorkspaceInput = z.infer<typeof UpdateWorkspaceInputSchema>;
const UpdateWorkspaceResponseSchema = AffindaResponseSchema;
export type UpdateWorkspaceResponse = z.infer<
	typeof UpdateWorkspaceResponseSchema
>;

export const AffindaEndpointInputSchemas = {
	addTagToDocuments: AddTagToDocumentsInputSchema,
	batchUpdateAnnotations: BatchUpdateAnnotationsInputSchema,
	createApiUser: CreateApiUserInputSchema,
	createBatchAnnotations: CreateBatchAnnotationsInputSchema,
	createCollection: CreateCollectionInputSchema,
	createDataFieldForCollection: CreateDataFieldForCollectionInputSchema,
	createDataPoint: CreateDataPointInputSchema,
	createDataPointChoice: CreateDataPointChoiceInputSchema,
	createDataSource: CreateDataSourceInputSchema,
	createDataSourceValue: CreateDataSourceValueInputSchema,
	createDocument: CreateDocumentInputSchema,
	createDocumentType: CreateDocumentTypeInputSchema,
	createExtractor: CreateExtractorInputSchema,
	createFromDataDocuments: CreateFromDataDocumentsInputSchema,
	createIndex: CreateIndexInputSchema,
	createInvitation: CreateInvitationInputSchema,
	createJobDescriptionSearch: CreateJobDescriptionSearchInputSchema,
	createJobDescriptionSearchEmbedUrl:
		CreateJobDescriptionSearchEmbedUrlInputSchema,
	createMapping: CreateMappingInputSchema,
	createOrganization: CreateOrganizationInputSchema,
	createResthookSubscription: CreateResthookSubscriptionInputSchema,
	createResumeSearch: CreateResumeSearchInputSchema,
	createResumeSearchEmbedUrl: CreateResumeSearchEmbedUrlInputSchema,
	createTag: CreateTagInputSchema,
	createValidationResult: CreateValidationResultInputSchema,
	createValidationResultsBatch: CreateValidationResultsBatchInputSchema,
	createWorkspace: CreateWorkspaceInputSchema,
	createWorkspaceMembership: CreateWorkspaceMembershipInputSchema,
	deleteAnnotationsBatch: DeleteAnnotationsBatchInputSchema,
	deleteCollection: DeleteCollectionInputSchema,
	deleteDataPoint: DeleteDataPointInputSchema,
	deleteDataSource: DeleteDataSourceInputSchema,
	deleteDataSourceValue: DeleteDataSourceValueInputSchema,
	deleteDocument: DeleteDocumentInputSchema,
	deleteDocumentType: DeleteDocumentTypeInputSchema,
	deleteExtractor: DeleteExtractorInputSchema,
	deleteIndex: DeleteIndexInputSchema,
	deleteInvitation: DeleteInvitationInputSchema,
	deleteMapping: DeleteMappingInputSchema,
	deleteOrganization: DeleteOrganizationInputSchema,
	deleteResthookSubscription: DeleteResthookSubscriptionInputSchema,
	deleteTag: DeleteTagInputSchema,
	deleteValidationResults: DeleteValidationResultsInputSchema,
	deleteWorkspace: DeleteWorkspaceInputSchema,
	deleteWorkspaceMembership: DeleteWorkspaceMembershipInputSchema,
	getAllApiUsers: GetAllApiUsersInputSchema,
	getAllDocumentSplitters: GetAllDocumentSplittersInputSchema,
	getAllInvitations: GetAllInvitationsInputSchema,
	getAllOrganizationMemberships: GetAllOrganizationMembershipsInputSchema,
	getAllTags: GetAllTagsInputSchema,
	getAllValidationResults: GetAllValidationResultsInputSchema,
	getAllWorkspaceMemberships: GetAllWorkspaceMembershipsInputSchema,
	getAnnotations: GetAnnotationsInputSchema,
	getCollection: GetCollectionInputSchema,
	getCollectionFields: GetCollectionFieldsInputSchema,
	getCollections: GetCollectionsInputSchema,
	getCollectionUsage: GetCollectionUsageInputSchema,
	getDataPoint: GetDataPointInputSchema,
	getDataPointChoice: GetDataPointChoiceInputSchema,
	getDataSource: GetDataSourceInputSchema,
	getDataSourceValue: GetDataSourceValueInputSchema,
	getDataSourceValues: GetDataSourceValuesInputSchema,
	getDocument: GetDocumentInputSchema,
	getDocumentRedacted: GetDocumentRedactedInputSchema,
	getDocuments: GetDocumentsInputSchema,
	getDocumentSplitter: GetDocumentSplitterInputSchema,
	getDocumentType: GetDocumentTypeInputSchema,
	getDocumentTypeJsonSchema: GetDocumentTypeJsonSchemaInputSchema,
	getDocumentTypePydanticModels: GetDocumentTypePydanticModelsInputSchema,
	getDocumentTypes: GetDocumentTypesInputSchema,
	getExtractor: GetExtractorInputSchema,
	getExtractors: GetExtractorsInputSchema,
	getIndexDocuments: GetIndexDocumentsInputSchema,
	getInvitation: GetInvitationInputSchema,
	getJobDescriptionSearchConfig: GetJobDescriptionSearchConfigInputSchema,
	getMapping: GetMappingInputSchema,
	getOrganization: GetOrganizationInputSchema,
	getOrganizationMembership: GetOrganizationMembershipInputSchema,
	getOrganizations: GetOrganizationsInputSchema,
	getResthookSubscription: GetResthookSubscriptionInputSchema,
	getResthookSubscriptions: GetResthookSubscriptionsInputSchema,
	getTag: GetTagInputSchema,
	getUsageByWorkspace: GetUsageByWorkspaceInputSchema,
	getWorkspace: GetWorkspaceInputSchema,
	getWorkspaceMembership: GetWorkspaceMembershipInputSchema,
	getWorkspaces: GetWorkspacesInputSchema,
	listDataPointChoices: ListDataPointChoicesInputSchema,
	listDataPoints: ListDataPointsInputSchema,
	listDataSources: ListDataSourcesInputSchema,
	listIndexes: ListIndexesInputSchema,
	listMappings: ListMappingsInputSchema,
	listOccupationGroups: ListOccupationGroupsInputSchema,
	listResumeSearchConfig: ListResumeSearchConfigInputSchema,
	listResumeSearchJobTitleSuggestions:
		ListResumeSearchJobTitleSuggestionsInputSchema,
	listResumeSearchSkillSuggestions: ListResumeSearchSkillSuggestionsInputSchema,
	removeTagFromDocuments: RemoveTagFromDocumentsInputSchema,
	replaceDataPointChoices: ReplaceDataPointChoicesInputSchema,
	replaceDataSourceValues: ReplaceDataSourceValuesInputSchema,
	splitDocumentPages: SplitDocumentPagesInputSchema,
	updateAnnotation: UpdateAnnotationInputSchema,
	updateCollection: UpdateCollectionInputSchema,
	updateDataFieldForCollection: UpdateDataFieldForCollectionInputSchema,
	updateDataPoint: UpdateDataPointInputSchema,
	updateDataPointChoice: UpdateDataPointChoiceInputSchema,
	updateDataSourceValue: UpdateDataSourceValueInputSchema,
	updateDocument: UpdateDocumentInputSchema,
	updateDocumentData: UpdateDocumentDataInputSchema,
	updateDocumentType: UpdateDocumentTypeInputSchema,
	updateExtractor: UpdateExtractorInputSchema,
	updateIndex: UpdateIndexInputSchema,
	updateInvitation: UpdateInvitationInputSchema,
	updateJobDescriptionSearchConfig: UpdateJobDescriptionSearchConfigInputSchema,
	updateMapping: UpdateMappingInputSchema,
	updateOrganization: UpdateOrganizationInputSchema,
	updateOrganizationMembership: UpdateOrganizationMembershipInputSchema,
	updateResthookSubscription: UpdateResthookSubscriptionInputSchema,
	updateResumeSearchConfig: UpdateResumeSearchConfigInputSchema,
	updateTag: UpdateTagInputSchema,
	updateWorkspace: UpdateWorkspaceInputSchema,
} as const;

export type AffindaEndpointInputs = {
	[K in keyof typeof AffindaEndpointInputSchemas]: z.infer<
		(typeof AffindaEndpointInputSchemas)[K]
	>;
};

export const AffindaEndpointOutputSchemas = {
	addTagToDocuments: AddTagToDocumentsResponseSchema,
	batchUpdateAnnotations: BatchUpdateAnnotationsResponseSchema,
	createApiUser: CreateApiUserResponseSchema,
	createBatchAnnotations: CreateBatchAnnotationsResponseSchema,
	createCollection: CreateCollectionResponseSchema,
	createDataFieldForCollection: CreateDataFieldForCollectionResponseSchema,
	createDataPoint: CreateDataPointResponseSchema,
	createDataPointChoice: CreateDataPointChoiceResponseSchema,
	createDataSource: CreateDataSourceResponseSchema,
	createDataSourceValue: CreateDataSourceValueResponseSchema,
	createDocument: CreateDocumentResponseSchema,
	createDocumentType: CreateDocumentTypeResponseSchema,
	createExtractor: CreateExtractorResponseSchema,
	createFromDataDocuments: CreateFromDataDocumentsResponseSchema,
	createIndex: CreateIndexResponseSchema,
	createInvitation: CreateInvitationResponseSchema,
	createJobDescriptionSearch: CreateJobDescriptionSearchResponseSchema,
	createJobDescriptionSearchEmbedUrl:
		CreateJobDescriptionSearchEmbedUrlResponseSchema,
	createMapping: CreateMappingResponseSchema,
	createOrganization: CreateOrganizationResponseSchema,
	createResthookSubscription: CreateResthookSubscriptionResponseSchema,
	createResumeSearch: CreateResumeSearchResponseSchema,
	createResumeSearchEmbedUrl: CreateResumeSearchEmbedUrlResponseSchema,
	createTag: CreateTagResponseSchema,
	createValidationResult: CreateValidationResultResponseSchema,
	createValidationResultsBatch: CreateValidationResultsBatchResponseSchema,
	createWorkspace: CreateWorkspaceResponseSchema,
	createWorkspaceMembership: CreateWorkspaceMembershipResponseSchema,
	deleteAnnotationsBatch: DeleteAnnotationsBatchResponseSchema,
	deleteCollection: DeleteCollectionResponseSchema,
	deleteDataPoint: DeleteDataPointResponseSchema,
	deleteDataSource: DeleteDataSourceResponseSchema,
	deleteDataSourceValue: DeleteDataSourceValueResponseSchema,
	deleteDocument: DeleteDocumentResponseSchema,
	deleteDocumentType: DeleteDocumentTypeResponseSchema,
	deleteExtractor: DeleteExtractorResponseSchema,
	deleteIndex: DeleteIndexResponseSchema,
	deleteInvitation: DeleteInvitationResponseSchema,
	deleteMapping: DeleteMappingResponseSchema,
	deleteOrganization: DeleteOrganizationResponseSchema,
	deleteResthookSubscription: DeleteResthookSubscriptionResponseSchema,
	deleteTag: DeleteTagResponseSchema,
	deleteValidationResults: DeleteValidationResultsResponseSchema,
	deleteWorkspace: DeleteWorkspaceResponseSchema,
	deleteWorkspaceMembership: DeleteWorkspaceMembershipResponseSchema,
	getAllApiUsers: GetAllApiUsersResponseSchema,
	getAllDocumentSplitters: GetAllDocumentSplittersResponseSchema,
	getAllInvitations: GetAllInvitationsResponseSchema,
	getAllOrganizationMemberships: GetAllOrganizationMembershipsResponseSchema,
	getAllTags: GetAllTagsResponseSchema,
	getAllValidationResults: GetAllValidationResultsResponseSchema,
	getAllWorkspaceMemberships: GetAllWorkspaceMembershipsResponseSchema,
	getAnnotations: GetAnnotationsResponseSchema,
	getCollection: GetCollectionResponseSchema,
	getCollectionFields: GetCollectionFieldsResponseSchema,
	getCollections: GetCollectionsResponseSchema,
	getCollectionUsage: GetCollectionUsageResponseSchema,
	getDataPoint: GetDataPointResponseSchema,
	getDataPointChoice: GetDataPointChoiceResponseSchema,
	getDataSource: GetDataSourceResponseSchema,
	getDataSourceValue: GetDataSourceValueResponseSchema,
	getDataSourceValues: GetDataSourceValuesResponseSchema,
	getDocument: GetDocumentResponseSchema,
	getDocumentRedacted: GetDocumentRedactedResponseSchema,
	getDocuments: GetDocumentsResponseSchema,
	getDocumentSplitter: GetDocumentSplitterResponseSchema,
	getDocumentType: GetDocumentTypeResponseSchema,
	getDocumentTypeJsonSchema: GetDocumentTypeJsonSchemaResponseSchema,
	getDocumentTypePydanticModels: GetDocumentTypePydanticModelsResponseSchema,
	getDocumentTypes: GetDocumentTypesResponseSchema,
	getExtractor: GetExtractorResponseSchema,
	getExtractors: GetExtractorsResponseSchema,
	getIndexDocuments: GetIndexDocumentsResponseSchema,
	getInvitation: GetInvitationResponseSchema,
	getJobDescriptionSearchConfig: GetJobDescriptionSearchConfigResponseSchema,
	getMapping: GetMappingResponseSchema,
	getOrganization: GetOrganizationResponseSchema,
	getOrganizationMembership: GetOrganizationMembershipResponseSchema,
	getOrganizations: GetOrganizationsResponseSchema,
	getResthookSubscription: GetResthookSubscriptionResponseSchema,
	getResthookSubscriptions: GetResthookSubscriptionsResponseSchema,
	getTag: GetTagResponseSchema,
	getUsageByWorkspace: GetUsageByWorkspaceResponseSchema,
	getWorkspace: GetWorkspaceResponseSchema,
	getWorkspaceMembership: GetWorkspaceMembershipResponseSchema,
	getWorkspaces: GetWorkspacesResponseSchema,
	listDataPointChoices: ListDataPointChoicesResponseSchema,
	listDataPoints: ListDataPointsResponseSchema,
	listDataSources: ListDataSourcesResponseSchema,
	listIndexes: ListIndexesResponseSchema,
	listMappings: ListMappingsResponseSchema,
	listOccupationGroups: ListOccupationGroupsResponseSchema,
	listResumeSearchConfig: ListResumeSearchConfigResponseSchema,
	listResumeSearchJobTitleSuggestions:
		ListResumeSearchJobTitleSuggestionsResponseSchema,
	listResumeSearchSkillSuggestions:
		ListResumeSearchSkillSuggestionsResponseSchema,
	removeTagFromDocuments: RemoveTagFromDocumentsResponseSchema,
	replaceDataPointChoices: ReplaceDataPointChoicesResponseSchema,
	replaceDataSourceValues: ReplaceDataSourceValuesResponseSchema,
	splitDocumentPages: SplitDocumentPagesResponseSchema,
	updateAnnotation: UpdateAnnotationResponseSchema,
	updateCollection: UpdateCollectionResponseSchema,
	updateDataFieldForCollection: UpdateDataFieldForCollectionResponseSchema,
	updateDataPoint: UpdateDataPointResponseSchema,
	updateDataPointChoice: UpdateDataPointChoiceResponseSchema,
	updateDataSourceValue: UpdateDataSourceValueResponseSchema,
	updateDocument: UpdateDocumentResponseSchema,
	updateDocumentData: UpdateDocumentDataResponseSchema,
	updateDocumentType: UpdateDocumentTypeResponseSchema,
	updateExtractor: UpdateExtractorResponseSchema,
	updateIndex: UpdateIndexResponseSchema,
	updateInvitation: UpdateInvitationResponseSchema,
	updateJobDescriptionSearchConfig:
		UpdateJobDescriptionSearchConfigResponseSchema,
	updateMapping: UpdateMappingResponseSchema,
	updateOrganization: UpdateOrganizationResponseSchema,
	updateOrganizationMembership: UpdateOrganizationMembershipResponseSchema,
	updateResthookSubscription: UpdateResthookSubscriptionResponseSchema,
	updateResumeSearchConfig: UpdateResumeSearchConfigResponseSchema,
	updateTag: UpdateTagResponseSchema,
	updateWorkspace: UpdateWorkspaceResponseSchema,
} as const;

export type AffindaEndpointOutputs = {
	[K in keyof typeof AffindaEndpointOutputSchemas]: z.infer<
		(typeof AffindaEndpointOutputSchemas)[K]
	>;
};

export type AffindaEndpointInput =
	AffindaEndpointInputs[keyof AffindaEndpointInputs] & {
		// Passthrough for extra fields not yet mapped from Affinda OpenAPI definitions.
		[key: string]: unknown;
	};
