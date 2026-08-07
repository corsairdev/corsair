import { z } from 'zod';
import type { AgencyZoomRoutes } from './routes';

type AgencyZoomRouteKey = AgencyZoomRoutes[number]['key'];

// AgencyZoom returns JSON objects or arrays; keep unknown fields via record/array unions.
const AgencyZoomResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.array(z.unknown()),
]);
// Optional raw JSON body passthrough for operations with complex or dynamic request payloads.
const AgencyZoomOptionalBodySchema = z.unknown().optional();

// OpenAPI: POST /auth/login, /auth/ssologin, /v4sso/sso-login
const AgencyZoomJwtAuthResponseSchema = z
	.object({
		jwt: z.string(),
		ownerAgent: z.boolean().optional(),
	})
	.loose();

// OpenAPI lead resource (GET /leads/{leadId}, list items)
const AgencyZoomLeadSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		firstname: z.string().optional(),
		middlename: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		leadSourceId: z.number().optional(),
		pipelineId: z.number().optional(),
		stageId: z.number().optional(),
	})
	.loose();

const AgencyZoomLeadListResponseSchema = z
	.object({
		totalCount: z.number().optional(),
		page: z.number().optional(),
		pageSize: z.number().optional(),
		leads: z.array(AgencyZoomLeadSchema).optional(),
	})
	.loose();

// OpenAPI customer resource (GET /customers/{customerId})
const AgencyZoomCustomerSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		businessName: z.string().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		customerType: z.string().optional(),
	})
	.loose();

// OpenAPI task resource (GET /tasks/{taskId})
const AgencyZoomTaskSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		title: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		dueDate: z.string().optional(),
		comments: z.string().optional(),
		customerId: z.number().optional(),
		leadId: z.number().optional(),
	})
	.loose();

// OpenAPI opportunity resource (GET /opportunities/{opportunityId})
const AgencyZoomOpportunitySchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		carrierId: z.number().optional(),
		productLineId: z.number().optional(),
		premium: z.number().optional(),
		items: z.number().optional(),
		status: z.number().optional(),
	})
	.loose();

// OpenAPI: GET /{leadId}/recycle-events
const AgencyZoomRecycleEventsResponseSchema = z
	.object({
		existingXDate: z.array(z.unknown()).optional(),
		newXDate: z.array(z.unknown()).optional(),
	})
	.loose();
// Optional query filters vary by endpoint; values are heterogeneous JSON filter objects.
const AgencyZoomQueryParamsSchema = z
	.record(z.string(), z.unknown())
	.optional();
// Batch item arrays contain heterogeneous lead/contact/task objects per AgencyZoom API docs.
const AgencyZoomBatchItemsSchema = z.array(z.unknown());
// Tag IDs may be numeric or string depending on tenant configuration.
const AgencyZoomTagIdsSchema = z.array(z.unknown()).optional();
// Custom field payloads are tenant-specific and not fully described in the OpenAPI spec.
const AgencyZoomCustomFieldsSchema = z.array(z.unknown()).optional();
// CSR/producer/invitee arrays are loosely typed assignment lists in AgencyZoom API docs.
const AgencyZoomAssignmentArraySchema = z.array(z.unknown()).optional();
// Sold product line items vary by policy type and are not fully schema-defined.
const AgencyZoomSoldProductsSchema = z.array(z.unknown());

// authenticateForJwtviaV4Sso
const AuthenticateForJwtviaV4SsoInputSchema = z.object({
	code: z.string(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type AuthenticateForJwtviaV4SsoInput = z.infer<
	typeof AuthenticateForJwtviaV4SsoInputSchema
>;
const AuthenticateForJwtviaV4SsoResponseSchema =
	AgencyZoomJwtAuthResponseSchema;
export type AuthenticateForJwtviaV4SsoResponse = z.infer<
	typeof AuthenticateForJwtviaV4SsoResponseSchema
>;

// batchCreateContact
const BatchCreateContactInputSchema = z.object({
	contactDataRequests: AgencyZoomBatchItemsSchema,
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type BatchCreateContactInput = z.infer<
	typeof BatchCreateContactInputSchema
>;
const BatchCreateContactResponseSchema = AgencyZoomResponseSchema;
export type BatchCreateContactResponse = z.infer<
	typeof BatchCreateContactResponseSchema
>;

// batchCreateLead
const BatchCreateLeadInputSchema = z.object({
	leadDataRequests: AgencyZoomBatchItemsSchema,
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type BatchCreateLeadInput = z.infer<typeof BatchCreateLeadInputSchema>;
const BatchCreateLeadResponseSchema = AgencyZoomResponseSchema;
export type BatchCreateLeadResponse = z.infer<
	typeof BatchCreateLeadResponseSchema
>;

// batchDeleteTask
const BatchDeleteTaskInputSchema = z.object({
	taskIds: AgencyZoomBatchItemsSchema,
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type BatchDeleteTaskInput = z.infer<typeof BatchDeleteTaskInputSchema>;
const BatchDeleteTaskResponseSchema = AgencyZoomResponseSchema;
export type BatchDeleteTaskResponse = z.infer<
	typeof BatchDeleteTaskResponseSchema
>;

// changeStatusForLead
const ChangeStatusForLeadInputSchema = z.object({
	date: z.string().optional(),
	leadId: z.number().int(),
	status: z.number().int(),
	tagIds: AgencyZoomTagIdsSchema,
	toStageId: z.number().int().optional(),
	xDateType: z.string().optional(),
	workflowId: z.number().int().optional(),
	lossReasonId: z.number().int().optional(),
	recycleToStage: z.number().int().optional(),
	workflowStageId: z.number().int().optional(),
	recycleToPipeline: z.number().int().optional(),
	changeLeadSourceTo: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ChangeStatusForLeadInput = z.infer<
	typeof ChangeStatusForLeadInputSchema
>;
const ChangeStatusForLeadResponseSchema = AgencyZoomResponseSchema;
export type ChangeStatusForLeadResponse = z.infer<
	typeof ChangeStatusForLeadResponseSchema
>;

// completeTask
const CompleteTaskInputSchema = z.object({
	taskId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CompleteTaskInput = z.infer<typeof CompleteTaskInputSchema>;
const CompleteTaskResponseSchema = AgencyZoomResponseSchema;
export type CompleteTaskResponse = z.infer<typeof CompleteTaskResponseSchema>;

// createACustomerNote
const CreateACustomerNoteInputSchema = z.object({
	note: z.string(),
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateACustomerNoteInput = z.infer<
	typeof CreateACustomerNoteInputSchema
>;
const CreateACustomerNoteResponseSchema = AgencyZoomResponseSchema;
export type CreateACustomerNoteResponse = z.infer<
	typeof CreateACustomerNoteResponseSchema
>;

// createADriverForAnOpportunity
const CreateADriverForAnOpportunityInputSchema = z.object({
	gender: z.string().optional(),
	birthday: z.string().optional(),
	lastName: z.string(),
	firstName: z.string(),
	middleName: z.string().optional(),
	relationship: z.string().optional(),
	licenseNumber: z.string().optional(),
	maritalStatus: z.number().int().optional(),
	opportunityId: z.number().int(),
	stateLicensed: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateADriverForAnOpportunityInput = z.infer<
	typeof CreateADriverForAnOpportunityInputSchema
>;
const CreateADriverForAnOpportunityResponseSchema = AgencyZoomResponseSchema;
export type CreateADriverForAnOpportunityResponse = z.infer<
	typeof CreateADriverForAnOpportunityResponseSchema
>;

// createALeadNote
const CreateALeadNoteInputSchema = z.object({
	note: z.string(),
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateALeadNoteInput = z.infer<typeof CreateALeadNoteInputSchema>;
const CreateALeadNoteResponseSchema = AgencyZoomResponseSchema;
export type CreateALeadNoteResponse = z.infer<
	typeof CreateALeadNoteResponseSchema
>;

// createALeadOpportunity
const CreateALeadOpportunityInputSchema = z.object({
	items: z.number().int().optional(),
	leadId: z.number().int(),
	premium: z.number().int(),
	carrierId: z.number().int(),
	customFields: AgencyZoomCustomFieldsSchema,
	productLineId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateALeadOpportunityInput = z.infer<
	typeof CreateALeadOpportunityInputSchema
>;
const CreateALeadOpportunityResponseSchema = AgencyZoomResponseSchema;
export type CreateALeadOpportunityResponse = z.infer<
	typeof CreateALeadOpportunityResponseSchema
>;

// createALeadQuote
const CreateALeadQuoteInputSchema = z.object({
	items: z.number().int(),
	leadId: z.number().int(),
	premium: z.number().int(),
	carrierId: z.number().int(),
	customFields: AgencyZoomCustomFieldsSchema,
	productLineId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateALeadQuoteInput = z.infer<typeof CreateALeadQuoteInputSchema>;
const CreateALeadQuoteResponseSchema = AgencyZoomResponseSchema;
export type CreateALeadQuoteResponse = z.infer<
	typeof CreateALeadQuoteResponseSchema
>;

// createAnOpportunity
const CreateAnOpportunityInputSchema = z.object({
	items: z.number().int().optional(),
	premium: z.number().int().optional(),
	carrierId: z.number().int().optional(),
	expiryDate: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	productLineId: z.number().int(),
	property__zip: z.string().optional(),
	property__city: z.string().optional(),
	property__state: z.string().optional(),
	property__country: z.string().optional(),
	customerReferralId: z.number().int(),
	property__address1: z.string().optional(),
	property__address2: z.string().optional(),
	property__useMailingAddressAsLocation: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateAnOpportunityInput = z.infer<
	typeof CreateAnOpportunityInputSchema
>;
const CreateAnOpportunityResponseSchema = AgencyZoomOpportunitySchema;
export type CreateAnOpportunityResponse = z.infer<
	typeof CreateAnOpportunityResponseSchema
>;

// createAVehicleForAnOpportunity
const CreateAVehicleForAnOpportunityInputSchema = z.object({
	vin: z.string().optional(),
	make: z.string(),
	year: z.number().int().optional(),
	model: z.string().optional(),
	ownership: z.string().optional(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateAVehicleForAnOpportunityInput = z.infer<
	typeof CreateAVehicleForAnOpportunityInputSchema
>;
const CreateAVehicleForAnOpportunityResponseSchema = AgencyZoomResponseSchema;
export type CreateAVehicleForAnOpportunityResponse = z.infer<
	typeof CreateAVehicleForAnOpportunityResponseSchema
>;

// createBizLead
const CreateBizLeadInputSchema = z.object({
	dba: z.string().optional(),
	fax: z.string().optional(),
	zip: z.string().optional(),
	city: z.string().optional(),
	fein: z.string().optional(),
	name: z.string(),
	csrId: z.number().int().optional(),
	email: z.string(),
	notes: z.string().optional(),
	phone: z.string().optional(),
	state: z.string().optional(),
	xDate: z.string().optional(),
	country: z.string(),
	payroll: z.string().optional(),
	stageId: z.number().int(),
	assignTo: z.string(),
	lastname: z.string().optional(),
	soldDate: z.string().optional(),
	tagNames: z.string().optional(),
	firstname: z.string(),
	groupCode: z.string().optional(),
	otherCsrs: AgencyZoomAssignmentArraySchema,
	quoteDate: z.string().optional(),
	middlename: z.string().optional(),
	pipelineId: z.number().int(),
	contactDate: z.string().optional(),
	agencyNumber: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	leadSourceId: z.number().int(),
	annualRevenue: z.string().optional(),
	streetAddress: z.string().optional(),
	departmentCode: z.string().optional(),
	otherProducers: AgencyZoomAssignmentArraySchema,
	secondaryEmail: z.string().optional(),
	secondaryPhone: z.string().optional(),
	assignmentGroupId: z.number().int().optional(),
	numberOfEmployees: z.number().int().optional(),
	nextExpirationDate: z.string().optional(),
	streetAddressLine2: z.string().optional(),
	yearBusinessStarted: z.string().optional(),
	businessClassification: z.number().int().optional(),
	yearsOfManagementExperience: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateBizLeadInput = z.infer<typeof CreateBizLeadInputSchema>;
const CreateBizLeadResponseSchema = AgencyZoomResponseSchema;
export type CreateBizLeadResponse = z.infer<typeof CreateBizLeadResponseSchema>;

// createLead
const CreateLeadInputSchema = z.object({
	zip: z.string().optional(),
	city: z.string().optional(),
	name: z.string().optional(),
	csrId: z.number().int().optional(),
	email: z.string(),
	notes: z.string().optional(),
	phone: z.string().optional(),
	state: z.string().optional(),
	xDate: z.string().optional(),
	country: z.string(),
	stageId: z.number().int(),
	assignTo: z.string(),
	birthday: z.string().optional(),
	lastname: z.string().optional(),
	nickname: z.string().optional(),
	soldDate: z.string().optional(),
	tagNames: z.string().optional(),
	firstname: z.string(),
	groupCode: z.string().optional(),
	otherCsrs: AgencyZoomAssignmentArraySchema,
	quoteDate: z.string().optional(),
	isBusiness: z.boolean().optional(),
	middlename: z.string().optional(),
	pipelineId: z.number().int(),
	contactDate: z.string().optional(),
	agencyNumber: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	leadSourceId: z.number().int(),
	maritalStatus: z.number().int().optional(),
	streetAddress: z.string().optional(),
	departmentCode: z.string().optional(),
	otherProducers: AgencyZoomAssignmentArraySchema,
	secondaryEmail: z.string().optional(),
	secondaryPhone: z.string().optional(),
	assignmentGroupId: z.number().int().optional(),
	nextExpirationDate: z.string().optional(),
	streetAddressLine2: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
const CreateLeadResponseSchema = AgencyZoomLeadSchema;
export type CreateLeadResponse = z.infer<typeof CreateLeadResponseSchema>;

// createTask
const CreateTaskInputSchema = z.object({
	type: z.string().optional(),
	title: z.string().optional(),
	leadId: z.number().int().optional(),
	comments: z.string().optional(),
	duration: z.number().int().optional(),
	invitees: AgencyZoomAssignmentArraySchema,
	assigneeId: z.number().int().optional(),
	customerId: z.number().int().optional(),
	dueDatetime: z.string().optional(),
	contactEmail: z.string().optional(),
	timeSpecific: z.boolean().optional(),
	lifeProfessionalId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;
const CreateTaskResponseSchema = AgencyZoomTaskSchema;
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

// deleteACustomer
const DeleteACustomerInputSchema = z.object({
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteACustomerInput = z.infer<typeof DeleteACustomerInputSchema>;
const DeleteACustomerResponseSchema = AgencyZoomResponseSchema;
export type DeleteACustomerResponse = z.infer<
	typeof DeleteACustomerResponseSchema
>;

// deleteACustomerFile
const DeleteACustomerFileInputSchema = z.object({
	fileId: z.number().int(),
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteACustomerFileInput = z.infer<
	typeof DeleteACustomerFileInputSchema
>;
const DeleteACustomerFileResponseSchema = AgencyZoomResponseSchema;
export type DeleteACustomerFileResponse = z.infer<
	typeof DeleteACustomerFileResponseSchema
>;

// deleteACustomerPolicy
const DeleteACustomerPolicyInputSchema = z.object({
	policyId: z.number().int(),
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteACustomerPolicyInput = z.infer<
	typeof DeleteACustomerPolicyInputSchema
>;
const DeleteACustomerPolicyResponseSchema = AgencyZoomResponseSchema;
export type DeleteACustomerPolicyResponse = z.infer<
	typeof DeleteACustomerPolicyResponseSchema
>;

// deleteADriver
const DeleteADriverInputSchema = z.object({
	driverId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteADriverInput = z.infer<typeof DeleteADriverInputSchema>;
const DeleteADriverResponseSchema = AgencyZoomResponseSchema;
export type DeleteADriverResponse = z.infer<typeof DeleteADriverResponseSchema>;

// deleteALeadFile
const DeleteALeadFileInputSchema = z.object({
	fileId: z.number().int(),
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteALeadFileInput = z.infer<typeof DeleteALeadFileInputSchema>;
const DeleteALeadFileResponseSchema = AgencyZoomResponseSchema;
export type DeleteALeadFileResponse = z.infer<
	typeof DeleteALeadFileResponseSchema
>;

// deleteALeadOpportunity
const DeleteALeadOpportunityInputSchema = z.object({
	leadId: z.number().int(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteALeadOpportunityInput = z.infer<
	typeof DeleteALeadOpportunityInputSchema
>;
const DeleteALeadOpportunityResponseSchema = AgencyZoomResponseSchema;
export type DeleteALeadOpportunityResponse = z.infer<
	typeof DeleteALeadOpportunityResponseSchema
>;

// deleteALeadQuote
const DeleteALeadQuoteInputSchema = z.object({
	leadId: z.number().int(),
	quoteId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteALeadQuoteInput = z.infer<typeof DeleteALeadQuoteInputSchema>;
const DeleteALeadQuoteResponseSchema = AgencyZoomResponseSchema;
export type DeleteALeadQuoteResponse = z.infer<
	typeof DeleteALeadQuoteResponseSchema
>;

// deleteAnOpportunity
const DeleteAnOpportunityInputSchema = z.object({
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteAnOpportunityInput = z.infer<
	typeof DeleteAnOpportunityInputSchema
>;
const DeleteAnOpportunityResponseSchema = AgencyZoomResponseSchema;
export type DeleteAnOpportunityResponse = z.infer<
	typeof DeleteAnOpportunityResponseSchema
>;

// deleteATask
const DeleteATaskInputSchema = z.object({
	taskId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteATaskInput = z.infer<typeof DeleteATaskInputSchema>;
const DeleteATaskResponseSchema = AgencyZoomResponseSchema;
export type DeleteATaskResponse = z.infer<typeof DeleteATaskResponseSchema>;

// deleteAVehicle
const DeleteAVehicleInputSchema = z.object({
	vehicleId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteAVehicleInput = z.infer<typeof DeleteAVehicleInputSchema>;
const DeleteAVehicleResponseSchema = AgencyZoomResponseSchema;
export type DeleteAVehicleResponse = z.infer<
	typeof DeleteAVehicleResponseSchema
>;

// deleteMessage
const DeleteMessageInputSchema = z.object({
	// OpenAPI: POST /email-thread/delete-message — messageId (string).
	messageId: z.string(),
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteMessageInput = z.infer<typeof DeleteMessageInputSchema>;
const DeleteMessageResponseSchema = AgencyZoomResponseSchema;
export type DeleteMessageResponse = z.infer<typeof DeleteMessageResponseSchema>;

// deleteThread
const DeleteThreadInputSchema = z.object({
	// OpenAPI: POST /email-thread/delete-thread
	threadId: z.string(),
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type DeleteThreadInput = z.infer<typeof DeleteThreadInputSchema>;
const DeleteThreadResponseSchema = AgencyZoomResponseSchema;
export type DeleteThreadResponse = z.infer<typeof DeleteThreadResponseSchema>;

// getAListOfAssignGroups
const GetAListOfAssignGroupsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfAssignGroupsInput = z.infer<
	typeof GetAListOfAssignGroupsInputSchema
>;
const GetAListOfAssignGroupsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfAssignGroupsResponse = z.infer<
	typeof GetAListOfAssignGroupsResponseSchema
>;

// getAListOfCarriers
const GetAListOfCarriersInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfCarriersInput = z.infer<
	typeof GetAListOfCarriersInputSchema
>;
const GetAListOfCarriersResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfCarriersResponse = z.infer<
	typeof GetAListOfCarriersResponseSchema
>;

// getAListOfCsrs
const GetAListOfCsrsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfCsrsInput = z.infer<typeof GetAListOfCsrsInputSchema>;
const GetAListOfCsrsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfCsrsResponse = z.infer<
	typeof GetAListOfCsrsResponseSchema
>;

// getAListOfCustomFields
const GetAListOfCustomFieldsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfCustomFieldsInput = z.infer<
	typeof GetAListOfCustomFieldsInputSchema
>;
const GetAListOfCustomFieldsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfCustomFieldsResponse = z.infer<
	typeof GetAListOfCustomFieldsResponseSchema
>;

// getAListOfDriversForAnOpportunity
const GetAListOfDriversForAnOpportunityInputSchema = z.object({
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfDriversForAnOpportunityInput = z.infer<
	typeof GetAListOfDriversForAnOpportunityInputSchema
>;
const GetAListOfDriversForAnOpportunityResponseSchema =
	AgencyZoomResponseSchema;
export type GetAListOfDriversForAnOpportunityResponse = z.infer<
	typeof GetAListOfDriversForAnOpportunityResponseSchema
>;

// getAListOfEmployees
const GetAListOfEmployeesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfEmployeesInput = z.infer<
	typeof GetAListOfEmployeesInputSchema
>;
const GetAListOfEmployeesResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfEmployeesResponse = z.infer<
	typeof GetAListOfEmployeesResponseSchema
>;

// getAListOfLeadSourceCategories
const GetAListOfLeadSourceCategoriesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfLeadSourceCategoriesInput = z.infer<
	typeof GetAListOfLeadSourceCategoriesInputSchema
>;
const GetAListOfLeadSourceCategoriesResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfLeadSourceCategoriesResponse = z.infer<
	typeof GetAListOfLeadSourceCategoriesResponseSchema
>;

// getAListOfLeadSources
const GetAListOfLeadSourcesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfLeadSourcesInput = z.infer<
	typeof GetAListOfLeadSourcesInputSchema
>;
const GetAListOfLeadSourcesResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfLeadSourcesResponse = z.infer<
	typeof GetAListOfLeadSourcesResponseSchema
>;

// getAListOfLifeProfessionals
const GetAListOfLifeProfessionalsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfLifeProfessionalsInput = z.infer<
	typeof GetAListOfLifeProfessionalsInputSchema
>;
const GetAListOfLifeProfessionalsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfLifeProfessionalsResponse = z.infer<
	typeof GetAListOfLifeProfessionalsResponseSchema
>;

// getAListOfLocations
const GetAListOfLocationsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfLocationsInput = z.infer<
	typeof GetAListOfLocationsInputSchema
>;
const GetAListOfLocationsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfLocationsResponse = z.infer<
	typeof GetAListOfLocationsResponseSchema
>;

// getAListOfLossReasons
const GetAListOfLossReasonsInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfLossReasonsInput = z.infer<
	typeof GetAListOfLossReasonsInputSchema
>;
const GetAListOfLossReasonsResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfLossReasonsResponse = z.infer<
	typeof GetAListOfLossReasonsResponseSchema
>;

// getAListOfPipelines
const GetAListOfPipelinesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfPipelinesInput = z.infer<
	typeof GetAListOfPipelinesInputSchema
>;
const GetAListOfPipelinesResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfPipelinesResponse = z.infer<
	typeof GetAListOfPipelinesResponseSchema
>;

// getAListOfProducer
const GetAListOfProducerInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfProducerInput = z.infer<
	typeof GetAListOfProducerInputSchema
>;
const GetAListOfProducerResponseSchema = AgencyZoomResponseSchema;
export type GetAListOfProducerResponse = z.infer<
	typeof GetAListOfProducerResponseSchema
>;

// getAListOfProductLinesPolicyTypes
const GetAListOfProductLinesPolicyTypesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfProductLinesPolicyTypesInput = z.infer<
	typeof GetAListOfProductLinesPolicyTypesInputSchema
>;
const GetAListOfProductLinesPolicyTypesResponseSchema =
	AgencyZoomResponseSchema;
export type GetAListOfProductLinesPolicyTypesResponse = z.infer<
	typeof GetAListOfProductLinesPolicyTypesResponseSchema
>;

// getAListOfRecycleEvents
const GetAListOfRecycleEventsInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfRecycleEventsInput = z.infer<
	typeof GetAListOfRecycleEventsInputSchema
>;
const GetAListOfRecycleEventsResponseSchema =
	AgencyZoomRecycleEventsResponseSchema;
export type GetAListOfRecycleEventsResponse = z.infer<
	typeof GetAListOfRecycleEventsResponseSchema
>;

// getAListOfVehiclesForAnOpportunity
const GetAListOfVehiclesForAnOpportunityInputSchema = z.object({
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAListOfVehiclesForAnOpportunityInput = z.infer<
	typeof GetAListOfVehiclesForAnOpportunityInputSchema
>;
const GetAListOfVehiclesForAnOpportunityResponseSchema =
	AgencyZoomResponseSchema;
export type GetAListOfVehiclesForAnOpportunityResponse = z.infer<
	typeof GetAListOfVehiclesForAnOpportunityResponseSchema
>;

// getAmsPoliciesForACustomer
const GetAmsPoliciesForACustomerInputSchema = z.object({
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAmsPoliciesForACustomerInput = z.infer<
	typeof GetAmsPoliciesForACustomerInputSchema
>;
const GetAmsPoliciesForACustomerResponseSchema = AgencyZoomResponseSchema;
export type GetAmsPoliciesForACustomerResponse = z.infer<
	typeof GetAmsPoliciesForACustomerResponseSchema
>;

// getAuthUrlForV4Sso
const GetAuthUrlForV4SsoInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetAuthUrlForV4SsoInput = z.infer<
	typeof GetAuthUrlForV4SsoInputSchema
>;
const GetAuthUrlForV4SsoResponseSchema = AgencyZoomResponseSchema;
export type GetAuthUrlForV4SsoResponse = z.infer<
	typeof GetAuthUrlForV4SsoResponseSchema
>;

// getDepartmentsGroups
const GetDepartmentsGroupsInputSchema = z.object({
	agencyNumber: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetDepartmentsGroupsInput = z.infer<
	typeof GetDepartmentsGroupsInputSchema
>;
const GetDepartmentsGroupsResponseSchema = AgencyZoomResponseSchema;
export type GetDepartmentsGroupsResponse = z.infer<
	typeof GetDepartmentsGroupsResponseSchema
>;

// getLeadFiles
const GetLeadFilesInputSchema = z.object({
	// OpenAPI: POST /leads/files
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	leadId: z.number().int().optional(),
	fileType: z.number().int().optional(),
	customerReferralId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetLeadFilesInput = z.infer<typeof GetLeadFilesInputSchema>;
const GetLeadFilesResponseSchema = AgencyZoomResponseSchema;
export type GetLeadFilesResponse = z.infer<typeof GetLeadFilesResponseSchema>;

// getLeadNotes
const GetLeadNotesInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetLeadNotesInput = z.infer<typeof GetLeadNotesInputSchema>;
const GetLeadNotesResponseSchema = AgencyZoomResponseSchema;
export type GetLeadNotesResponse = z.infer<typeof GetLeadNotesResponseSchema>;

// getLeadQuotes
const GetLeadQuotesInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetLeadQuotesInput = z.infer<typeof GetLeadQuotesInputSchema>;
const GetLeadQuotesResponseSchema = AgencyZoomResponseSchema;
export type GetLeadQuotesResponse = z.infer<typeof GetLeadQuotesResponseSchema>;

// getLeadTasks
const GetLeadTasksInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetLeadTasksInput = z.infer<typeof GetLeadTasksInputSchema>;
const GetLeadTasksResponseSchema = AgencyZoomResponseSchema;
export type GetLeadTasksResponse = z.infer<typeof GetLeadTasksResponseSchema>;

// getListOfEndStages
const GetListOfEndStagesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetListOfEndStagesInput = z.infer<
	typeof GetListOfEndStagesInputSchema
>;
const GetListOfEndStagesResponseSchema = AgencyZoomResponseSchema;
export type GetListOfEndStagesResponse = z.infer<
	typeof GetListOfEndStagesResponseSchema
>;

// getPoliciesForACustomer
const GetPoliciesForACustomerInputSchema = z.object({
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetPoliciesForACustomerInput = z.infer<
	typeof GetPoliciesForACustomerInputSchema
>;
const GetPoliciesForACustomerResponseSchema = AgencyZoomResponseSchema;
export type GetPoliciesForACustomerResponse = z.infer<
	typeof GetPoliciesForACustomerResponseSchema
>;

// getTheCustomerDetails
const GetTheCustomerDetailsInputSchema = z.object({
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheCustomerDetailsInput = z.infer<
	typeof GetTheCustomerDetailsInputSchema
>;
const GetTheCustomerDetailsResponseSchema = AgencyZoomCustomerSchema;
export type GetTheCustomerDetailsResponse = z.infer<
	typeof GetTheCustomerDetailsResponseSchema
>;

// getTheCustomerTasks
const GetTheCustomerTasksInputSchema = z.object({
	customerId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheCustomerTasksInput = z.infer<
	typeof GetTheCustomerTasksInputSchema
>;
const GetTheCustomerTasksResponseSchema = AgencyZoomResponseSchema;
export type GetTheCustomerTasksResponse = z.infer<
	typeof GetTheCustomerTasksResponseSchema
>;

// getTheDriverDetails
const GetTheDriverDetailsInputSchema = z.object({
	driverId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheDriverDetailsInput = z.infer<
	typeof GetTheDriverDetailsInputSchema
>;
const GetTheDriverDetailsResponseSchema = AgencyZoomResponseSchema;
export type GetTheDriverDetailsResponse = z.infer<
	typeof GetTheDriverDetailsResponseSchema
>;

// getTheLeadDetails
const GetTheLeadDetailsInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheLeadDetailsInput = z.infer<
	typeof GetTheLeadDetailsInputSchema
>;
const GetTheLeadDetailsResponseSchema = AgencyZoomLeadSchema;
export type GetTheLeadDetailsResponse = z.infer<
	typeof GetTheLeadDetailsResponseSchema
>;

// getTheOpportunitiesForALead
const GetTheOpportunitiesForALeadInputSchema = z.object({
	leadId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheOpportunitiesForALeadInput = z.infer<
	typeof GetTheOpportunitiesForALeadInputSchema
>;
const GetTheOpportunitiesForALeadResponseSchema = AgencyZoomResponseSchema;
export type GetTheOpportunitiesForALeadResponse = z.infer<
	typeof GetTheOpportunitiesForALeadResponseSchema
>;

// getTheOpportunityDetails
const GetTheOpportunityDetailsInputSchema = z.object({
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheOpportunityDetailsInput = z.infer<
	typeof GetTheOpportunityDetailsInputSchema
>;
const GetTheOpportunityDetailsResponseSchema = AgencyZoomOpportunitySchema;
export type GetTheOpportunityDetailsResponse = z.infer<
	typeof GetTheOpportunityDetailsResponseSchema
>;

// getTheTaskDetails
const GetTheTaskDetailsInputSchema = z.object({
	taskId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheTaskDetailsInput = z.infer<
	typeof GetTheTaskDetailsInputSchema
>;
const GetTheTaskDetailsResponseSchema = AgencyZoomTaskSchema;
export type GetTheTaskDetailsResponse = z.infer<
	typeof GetTheTaskDetailsResponseSchema
>;

// getTheVehicleDetails
const GetTheVehicleDetailsInputSchema = z.object({
	vehicleId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetTheVehicleDetailsInput = z.infer<
	typeof GetTheVehicleDetailsInputSchema
>;
const GetTheVehicleDetailsResponseSchema = AgencyZoomResponseSchema;
export type GetTheVehicleDetailsResponse = z.infer<
	typeof GetTheVehicleDetailsResponseSchema
>;

// getThreadDetails
const GetThreadDetailsInputSchema = z.object({
	// OpenAPI: POST /email-thread/email-thread-detail
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	threadId: z.string().optional(),
	searchTerm: z.string().optional(),
	status: z.number().int().optional(),
	lastDateUTC: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type GetThreadDetailsInput = z.infer<typeof GetThreadDetailsInputSchema>;
const GetThreadDetailsResponseSchema = AgencyZoomResponseSchema;
export type GetThreadDetailsResponse = z.infer<
	typeof GetThreadDetailsResponseSchema
>;

// linkADriverToOpportunity
const LinkADriverToOpportunityInputSchema = z.object({
	driverId: z.number().int(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type LinkADriverToOpportunityInput = z.infer<
	typeof LinkADriverToOpportunityInputSchema
>;
const LinkADriverToOpportunityResponseSchema = AgencyZoomResponseSchema;
export type LinkADriverToOpportunityResponse = z.infer<
	typeof LinkADriverToOpportunityResponseSchema
>;

// linkAVehicleToOpportunity
const LinkAVehicleToOpportunityInputSchema = z.object({
	vehicleId: z.number().int(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type LinkAVehicleToOpportunityInput = z.infer<
	typeof LinkAVehicleToOpportunityInputSchema
>;
const LinkAVehicleToOpportunityResponseSchema = AgencyZoomResponseSchema;
export type LinkAVehicleToOpportunityResponse = z.infer<
	typeof LinkAVehicleToOpportunityResponseSchema
>;

// listProductCategories
const ListProductCategoriesInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ListProductCategoriesInput = z.infer<
	typeof ListProductCategoriesInputSchema
>;
const ListProductCategoriesResponseSchema = AgencyZoomResponseSchema;
export type ListProductCategoriesResponse = z.infer<
	typeof ListProductCategoriesResponseSchema
>;

// logTheUserIn
const LogTheUserInInputSchema = z.object({
	password: z.string(),
	username: z.string(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type LogTheUserInInput = z.infer<typeof LogTheUserInInputSchema>;
const LogTheUserInResponseSchema = AgencyZoomJwtAuthResponseSchema;
export type LogTheUserInResponse = z.infer<typeof LogTheUserInResponseSchema>;

// logTheUserOut
const LogTheUserOutInputSchema = z.object({
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type LogTheUserOutInput = z.infer<typeof LogTheUserOutInputSchema>;
const LogTheUserOutResponseSchema = AgencyZoomResponseSchema;
export type LogTheUserOutResponse = z.infer<typeof LogTheUserOutResponseSchema>;

// markThreadAsUnreadApiEndpoint
const MarkThreadAsUnreadApiEndpointInputSchema = z.object({
	threadId: z.string(),
	markUnread: z.boolean(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type MarkThreadAsUnreadApiEndpointInput = z.infer<
	typeof MarkThreadAsUnreadApiEndpointInputSchema
>;
const MarkThreadAsUnreadApiEndpointResponseSchema = AgencyZoomResponseSchema;
export type MarkThreadAsUnreadApiEndpointResponse = z.infer<
	typeof MarkThreadAsUnreadApiEndpointResponseSchema
>;

// moveLeadToSold
const MoveLeadToSoldInputSchema = z.object({
	leadId: z.number().int(),
	keepOpen: z.boolean().optional(),
	soldProducts: AgencyZoomSoldProductsSchema,
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type MoveLeadToSoldInput = z.infer<typeof MoveLeadToSoldInputSchema>;
const MoveLeadToSoldResponseSchema = AgencyZoomResponseSchema;
export type MoveLeadToSoldResponse = z.infer<
	typeof MoveLeadToSoldResponseSchema
>;

// removeTextThreadEndpoint
const RemoveTextThreadEndpointInputSchema = z.object({
	// OpenAPI: POST /text-thread/delete-thread
	threadId: z.string(),
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type RemoveTextThreadEndpointInput = z.infer<
	typeof RemoveTextThreadEndpointInputSchema
>;
const RemoveTextThreadEndpointResponseSchema = AgencyZoomResponseSchema;
export type RemoveTextThreadEndpointResponse = z.infer<
	typeof RemoveTextThreadEndpointResponseSchema
>;

// reopenATask
const ReopenATaskInputSchema = z.object({
	taskId: z.number().int(),
	comments: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ReopenATaskInput = z.infer<typeof ReopenATaskInputSchema>;
const ReopenATaskResponseSchema = AgencyZoomResponseSchema;
export type ReopenATaskResponse = z.infer<typeof ReopenATaskResponseSchema>;

// OpenAPI search/list bodies share pagination/sort; .loose() keeps endpoint-specific filters.
const AgencyZoomSearchInputSchema = z
	.object({
		page: z.number().int().optional(),
		pageSize: z.number().int().optional(),
		sort: z.string().optional(),
		order: z.string().optional(),
		location: z.string().optional(),
		body: AgencyZoomOptionalBodySchema,
		query: AgencyZoomQueryParamsSchema,
		headers: z.record(z.string(), z.string()).optional(),
	})
	.loose();

// searchBusinessClassifications
const SearchBusinessClassificationsInputSchema = AgencyZoomSearchInputSchema;
export type SearchBusinessClassificationsInput = z.infer<
	typeof SearchBusinessClassificationsInputSchema
>;
const SearchBusinessClassificationsResponseSchema = AgencyZoomResponseSchema;
export type SearchBusinessClassificationsResponse = z.infer<
	typeof SearchBusinessClassificationsResponseSchema
>;

// searchCustomers
const SearchCustomersInputSchema = AgencyZoomSearchInputSchema;
export type SearchCustomersInput = z.infer<typeof SearchCustomersInputSchema>;
const SearchCustomersResponseSchema = AgencyZoomResponseSchema;
export type SearchCustomersResponse = z.infer<
	typeof SearchCustomersResponseSchema
>;

// searchEmailThreads
const SearchEmailThreadsInputSchema = AgencyZoomSearchInputSchema;
export type SearchEmailThreadsInput = z.infer<
	typeof SearchEmailThreadsInputSchema
>;
const SearchEmailThreadsResponseSchema = AgencyZoomResponseSchema;
export type SearchEmailThreadsResponse = z.infer<
	typeof SearchEmailThreadsResponseSchema
>;

// searchLeads
const SearchLeadsInputSchema = AgencyZoomSearchInputSchema;
export type SearchLeadsInput = z.infer<typeof SearchLeadsInputSchema>;
const SearchLeadsResponseSchema = AgencyZoomLeadListResponseSchema;
export type SearchLeadsResponse = z.infer<typeof SearchLeadsResponseSchema>;

// searchLeadsCount
const SearchLeadsCountInputSchema = AgencyZoomSearchInputSchema;
export type SearchLeadsCountInput = z.infer<typeof SearchLeadsCountInputSchema>;
const SearchLeadsCountResponseSchema = AgencyZoomResponseSchema;
export type SearchLeadsCountResponse = z.infer<
	typeof SearchLeadsCountResponseSchema
>;

// searchLifeAndHealthLeads
const SearchLifeAndHealthLeadsInputSchema = AgencyZoomSearchInputSchema;
export type SearchLifeAndHealthLeadsInput = z.infer<
	typeof SearchLifeAndHealthLeadsInputSchema
>;
const SearchLifeAndHealthLeadsResponseSchema = AgencyZoomResponseSchema;
export type SearchLifeAndHealthLeadsResponse = z.infer<
	typeof SearchLifeAndHealthLeadsResponseSchema
>;

// searchSmsThreads
const SearchSmsThreadsInputSchema = AgencyZoomSearchInputSchema;
export type SearchSmsThreadsInput = z.infer<typeof SearchSmsThreadsInputSchema>;
const SearchSmsThreadsResponseSchema = AgencyZoomResponseSchema;
export type SearchSmsThreadsResponse = z.infer<
	typeof SearchSmsThreadsResponseSchema
>;

// searchTasks
const SearchTasksInputSchema = z.object({
	page: z.number().int().optional(),
	sort: z.string().optional(),
	type: z.string().optional(),
	order: z.string().optional(),
	period: z.string().optional(),
	status: z.number().int().optional(),
	endDate: z.string().optional(),
	location: z.string().optional(),
	pageSize: z.number().int().optional(),
	startDate: z.string().optional(),
	assigneeId: z.number().int().optional(),
	leadSourceId: z.number().int().optional(),
	lifeProfessionalId: z.number().int().optional(),
	leadSourceCategoryId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type SearchTasksInput = z.infer<typeof SearchTasksInputSchema>;
const SearchTasksResponseSchema = AgencyZoomResponseSchema;
export type SearchTasksResponse = z.infer<typeof SearchTasksResponseSchema>;

// serviceTicketList
const ServiceTicketListInputSchema = z.object({
	page: z.number().int().optional(),
	status: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	categoryId: z.number().int().optional(),
	priorityId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type ServiceTicketListInput = z.infer<
	typeof ServiceTicketListInputSchema
>;
const ServiceTicketListResponseSchema = AgencyZoomResponseSchema;
export type ServiceTicketListResponse = z.infer<
	typeof ServiceTicketListResponseSchema
>;

// textDetailThread
const TextDetailThreadInputSchema = z.object({
	// OpenAPI: POST /text-thread/text-thread-detail
	threadId: z.string(),
	page: z.number().int().optional(),
	pageSize: z.number().int().optional(),
	sort: z.string().optional(),
	order: z.string().optional(),
	location: z.string().optional(),
	searchTerm: z.string().optional(),
	status: z.number().int().optional(),
	lastDateUTC: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type TextDetailThreadInput = z.infer<typeof TextDetailThreadInputSchema>;
const TextDetailThreadResponseSchema = AgencyZoomResponseSchema;
export type TextDetailThreadResponse = z.infer<
	typeof TextDetailThreadResponseSchema
>;

// unlinkADriverFromOpportunity
const UnlinkADriverFromOpportunityInputSchema = z.object({
	driverId: z.number().int(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UnlinkADriverFromOpportunityInput = z.infer<
	typeof UnlinkADriverFromOpportunityInputSchema
>;
const UnlinkADriverFromOpportunityResponseSchema = AgencyZoomResponseSchema;
export type UnlinkADriverFromOpportunityResponse = z.infer<
	typeof UnlinkADriverFromOpportunityResponseSchema
>;

// unlinkAVehicleFromOpportunity
const UnlinkAVehicleFromOpportunityInputSchema = z.object({
	vehicleId: z.number().int(),
	opportunityId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UnlinkAVehicleFromOpportunityInput = z.infer<
	typeof UnlinkAVehicleFromOpportunityInputSchema
>;
const UnlinkAVehicleFromOpportunityResponseSchema = AgencyZoomResponseSchema;
export type UnlinkAVehicleFromOpportunityResponse = z.infer<
	typeof UnlinkAVehicleFromOpportunityResponseSchema
>;

// unreadThread
const UnreadThreadInputSchema = z.object({
	threadId: z.string(),
	markUnread: z.boolean(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UnreadThreadInput = z.infer<typeof UnreadThreadInputSchema>;
const UnreadThreadResponseSchema = AgencyZoomResponseSchema;
export type UnreadThreadResponse = z.infer<typeof UnreadThreadResponseSchema>;

// updateADriverSDetails
const UpdateADriverSDetailsInputSchema = z.object({
	gender: z.string().optional(),
	birthday: z.string().optional(),
	driverId: z.number().int(),
	lastName: z.string(),
	firstName: z.string(),
	middleName: z.string().optional(),
	relationship: z.string().optional(),
	licenseNumber: z.string().optional(),
	maritalStatus: z.number().int().optional(),
	stateLicensed: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateADriverSDetailsInput = z.infer<
	typeof UpdateADriverSDetailsInputSchema
>;
const UpdateADriverSDetailsResponseSchema = AgencyZoomResponseSchema;
export type UpdateADriverSDetailsResponse = z.infer<
	typeof UpdateADriverSDetailsResponseSchema
>;

// updateALeadFileName
const UpdateALeadFileNameInputSchema = z.object({
	fileId: z.number().int(),
	leadId: z.number().int(),
	newFileName: z.string(),
	customerReferralId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateALeadFileNameInput = z.infer<
	typeof UpdateALeadFileNameInputSchema
>;
const UpdateALeadFileNameResponseSchema = AgencyZoomResponseSchema;
export type UpdateALeadFileNameResponse = z.infer<
	typeof UpdateALeadFileNameResponseSchema
>;

// updateALeadOpportunity
const UpdateALeadOpportunityInputSchema = z.object({
	id: z.number().int(),
	items: z.number().int().optional(),
	leadId: z.number().int(),
	premium: z.number().int(),
	carrierId: z.number().int(),
	customFields: AgencyZoomCustomFieldsSchema,
	productLineId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateALeadOpportunityInput = z.infer<
	typeof UpdateALeadOpportunityInputSchema
>;
const UpdateALeadOpportunityResponseSchema = AgencyZoomResponseSchema;
export type UpdateALeadOpportunityResponse = z.infer<
	typeof UpdateALeadOpportunityResponseSchema
>;

// updateALeadQuote
const UpdateALeadQuoteInputSchema = z.object({
	id: z.number().int(),
	items: z.number().int(),
	leadId: z.number().int(),
	premium: z.number().int(),
	carrierId: z.number().int(),
	customFields: AgencyZoomCustomFieldsSchema,
	productLineId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateALeadQuoteInput = z.infer<typeof UpdateALeadQuoteInputSchema>;
const UpdateALeadQuoteResponseSchema = AgencyZoomResponseSchema;
export type UpdateALeadQuoteResponse = z.infer<
	typeof UpdateALeadQuoteResponseSchema
>;

// updateAnOpportunity
const UpdateAnOpportunityInputSchema = z.object({
	items: z.number().int().optional(),
	premium: z.number().int().optional(),
	carrierId: z.number().int().optional(),
	expiryDate: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	opportunityId: z.number().int(),
	productLineId: z.number().int().optional(),
	property__zip: z.string().optional(),
	property__city: z.string().optional(),
	property__state: z.string().optional(),
	property__country: z.string().optional(),
	property__address1: z.string().optional(),
	property__address2: z.string().optional(),
	property__useMailingAddressAsLocation: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateAnOpportunityInput = z.infer<
	typeof UpdateAnOpportunityInputSchema
>;
const UpdateAnOpportunityResponseSchema = AgencyZoomOpportunitySchema;
export type UpdateAnOpportunityResponse = z.infer<
	typeof UpdateAnOpportunityResponseSchema
>;

// updateAPolicy
const UpdateAPolicyInputSchema = z.object({
	items: z.number().int().optional(),
	agentId: z.number().int().optional(),
	premium: z.number().int().optional(),
	policyId: z.number().int(),
	soldDate: z.string().optional(),
	brokerFee: z.number().int().optional(),
	carrierId: z.number().int().optional(),
	groupCode: z.string().optional(),
	expiryDate: z.string().optional(),
	policyType: z.number().int().optional(),
	insuredName: z.string().optional(),
	agencyNumber: z.string().optional(),
	leadSourceId: z.number().int().optional(),
	policyNumber: z.string().optional(),
	effectiveDate: z.string().optional(),
	departmentCode: z.string().optional(),
	priorExpiryDate: z.string().optional(),
	priorCarrierName: z.string().optional(),
	priorPolicyNumber: z.string().optional(),
	productCategoryId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateAPolicyInput = z.infer<typeof UpdateAPolicyInputSchema>;
const UpdateAPolicyResponseSchema = AgencyZoomResponseSchema;
export type UpdateAPolicyResponse = z.infer<typeof UpdateAPolicyResponseSchema>;

// updateAVehicleSDetails
const UpdateAVehicleSDetailsInputSchema = z.object({
	vin: z.string().optional(),
	make: z.string().optional(),
	year: z.number().int().optional(),
	model: z.string().optional(),
	ownership: z.string().optional(),
	vehicleId: z.number().int(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateAVehicleSDetailsInput = z.infer<
	typeof UpdateAVehicleSDetailsInputSchema
>;
const UpdateAVehicleSDetailsResponseSchema = AgencyZoomResponseSchema;
export type UpdateAVehicleSDetailsResponse = z.infer<
	typeof UpdateAVehicleSDetailsResponseSchema
>;

// updateBusinessLead
const UpdateBusinessLeadInputSchema = z.object({
	dba: z.string().optional(),
	fax: z.string().optional(),
	zip: z.string().optional(),
	city: z.string().optional(),
	fein: z.string().optional(),
	name: z.string(),
	csrId: z.number().int().optional(),
	email: z.string(),
	notes: z.string().optional(),
	phone: z.string().optional(),
	state: z.string().optional(),
	xDate: z.string().optional(),
	leadId: z.number().int(),
	country: z.string(),
	payroll: z.string().optional(),
	stageId: z.number().int(),
	assignTo: z.string(),
	lastname: z.string().optional(),
	soldDate: z.string().optional(),
	tagNames: z.string().optional(),
	firstname: z.string(),
	groupCode: z.string().optional(),
	otherCsrs: AgencyZoomAssignmentArraySchema,
	quoteDate: z.string().optional(),
	middlename: z.string().optional(),
	pipelineId: z.number().int(),
	contactDate: z.string().optional(),
	agencyNumber: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	leadSourceId: z.number().int(),
	annualRevenue: z.string().optional(),
	streetAddress: z.string().optional(),
	departmentCode: z.string().optional(),
	otherProducers: AgencyZoomAssignmentArraySchema,
	secondaryEmail: z.string().optional(),
	secondaryPhone: z.string().optional(),
	assignmentGroupId: z.number().int().optional(),
	numberOfEmployees: z.number().int().optional(),
	nextExpirationDate: z.string().optional(),
	streetAddressLine2: z.string().optional(),
	yearBusinessStarted: z.string().optional(),
	businessClassification: z.number().int().optional(),
	yearsOfManagementExperience: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateBusinessLeadInput = z.infer<
	typeof UpdateBusinessLeadInputSchema
>;
const UpdateBusinessLeadResponseSchema = AgencyZoomResponseSchema;
export type UpdateBusinessLeadResponse = z.infer<
	typeof UpdateBusinessLeadResponseSchema
>;

// updateCustomer
const UpdateCustomerInputSchema = z.object({
	zip: z.string().optional(),
	city: z.string().optional(),
	csrId: z.number().int().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	state: z.string().optional(),
	agentId: z.number().int().optional(),
	country: z.string().optional(),
	birthday: z.string().optional(),
	lastname: z.string().optional(),
	tagNames: z.string().optional(),
	firstname: z.string().optional(),
	createDate: z.string().optional(),
	customerId: z.number().int(),
	bizCustomer: z.number().int().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	totalPayroll: z.number().int().optional(),
	annualRevenue: z.number().int().optional(),
	streetAddress: z.string().optional(),
	secondaryEmail: z.string().optional(),
	secondaryPhone: z.string().optional(),
	contactLastname: z.string().optional(),
	contactFirstname: z.string().optional(),
	contactMiddlename: z.string().optional(),
	numberOfEmployees: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;
const UpdateCustomerResponseSchema = AgencyZoomCustomerSchema;
export type UpdateCustomerResponse = z.infer<
	typeof UpdateCustomerResponseSchema
>;

// updateLead
const UpdateLeadInputSchema = z.object({
	zip: z.string().optional(),
	city: z.string().optional(),
	name: z.string().optional(),
	csrId: z.number().int().optional(),
	email: z.string(),
	notes: z.string().optional(),
	phone: z.string().optional(),
	state: z.string().optional(),
	xDate: z.string().optional(),
	leadId: z.number().int(),
	country: z.string(),
	stageId: z.number().int(),
	assignTo: z.string(),
	birthday: z.string().optional(),
	lastname: z.string().optional(),
	nickname: z.string().optional(),
	soldDate: z.string().optional(),
	tagNames: z.string().optional(),
	firstname: z.string(),
	groupCode: z.string().optional(),
	otherCsrs: AgencyZoomAssignmentArraySchema,
	quoteDate: z.string().optional(),
	isBusiness: z.boolean().optional(),
	middlename: z.string().optional(),
	pipelineId: z.number().int(),
	contactDate: z.string().optional(),
	agencyNumber: z.string().optional(),
	customFields: AgencyZoomCustomFieldsSchema,
	leadSourceId: z.number().int(),
	maritalStatus: z.number().int().optional(),
	streetAddress: z.string().optional(),
	departmentCode: z.string().optional(),
	otherProducers: AgencyZoomAssignmentArraySchema,
	secondaryEmail: z.string().optional(),
	secondaryPhone: z.string().optional(),
	assignmentGroupId: z.number().int().optional(),
	nextExpirationDate: z.string().optional(),
	streetAddressLine2: z.string().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateLeadInput = z.infer<typeof UpdateLeadInputSchema>;
const UpdateLeadResponseSchema = AgencyZoomLeadSchema;
export type UpdateLeadResponse = z.infer<typeof UpdateLeadResponseSchema>;

// updateLeadStatusById
const UpdateLeadStatusByIdInputSchema = z.object({
	date: z.string().optional(),
	leadId: z.number().int(),
	status: z.number().int(),
	tagIds: AgencyZoomTagIdsSchema,
	toStageId: z.number().int().optional(),
	xDateType: z.string().optional(),
	workflowId: z.number().int().optional(),
	lossReasonId: z.number().int().optional(),
	recycleToStage: z.number().int().optional(),
	workflowStageId: z.number().int().optional(),
	recycleToPipeline: z.number().int().optional(),
	changeLeadSourceTo: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateLeadStatusByIdInput = z.infer<
	typeof UpdateLeadStatusByIdInputSchema
>;
const UpdateLeadStatusByIdResponseSchema = AgencyZoomResponseSchema;
export type UpdateLeadStatusByIdResponse = z.infer<
	typeof UpdateLeadStatusByIdResponseSchema
>;

// updateMyProfile
const UpdateMyProfileInputSchema = z.object({
	email: z.string(),
	phone: z.string().optional(),
	lastname: z.string(),
	firstname: z.string(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateMyProfileInput = z.infer<typeof UpdateMyProfileInputSchema>;
const UpdateMyProfileResponseSchema = AgencyZoomResponseSchema;
export type UpdateMyProfileResponse = z.infer<
	typeof UpdateMyProfileResponseSchema
>;

// updateTagsForAPolicy — OpenAPI needs tagNames + policyId or amsPolicyId.
const UpdateTagsForAPolicyInputSchema = z
	.object({
		policyId: z.number().int().optional(),
		tagNames: z.string(),
		amsPolicyId: z.number().int().optional(),
		body: AgencyZoomOptionalBodySchema,
		query: AgencyZoomQueryParamsSchema,
		headers: z.record(z.string(), z.string()).optional(),
	})
	.refine(
		(value) => value.policyId !== undefined || value.amsPolicyId !== undefined,
		{ message: 'Either policyId or amsPolicyId is required' },
	);
export type UpdateTagsForAPolicyInput = z.infer<
	typeof UpdateTagsForAPolicyInputSchema
>;
const UpdateTagsForAPolicyResponseSchema = AgencyZoomResponseSchema;
export type UpdateTagsForAPolicyResponse = z.infer<
	typeof UpdateTagsForAPolicyResponseSchema
>;

// updateTask — taskId is a path param and must also appear in the JSON body.
// Kept via route.bodyPathParams (see routes.ts + factory.requestBody).
const UpdateTaskInputSchema = z.object({
	type: z.string().optional(),
	title: z.string().optional(),
	leadId: z.number().int().optional(),
	taskId: z.number().int(),
	comments: z.string().optional(),
	duration: z.number().int().optional(),
	invitees: AgencyZoomAssignmentArraySchema,
	assigneeId: z.number().int().optional(),
	customerId: z.number().int().optional(),
	dueDatetime: z.string().optional(),
	contactEmail: z.string().optional(),
	timeSpecific: z.boolean().optional(),
	lifeProfessionalId: z.number().int().optional(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;
const UpdateTaskResponseSchema = AgencyZoomTaskSchema;
export type UpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

// v4SsoLogTheUserIn
const V4SsoLogTheUserInInputSchema = z.object({
	password: z.string(),
	username: z.string(),
	body: AgencyZoomOptionalBodySchema,
	query: AgencyZoomQueryParamsSchema,
	headers: z.record(z.string(), z.string()).optional(),
});
export type V4SsoLogTheUserInInput = z.infer<
	typeof V4SsoLogTheUserInInputSchema
>;
const V4SsoLogTheUserInResponseSchema = AgencyZoomJwtAuthResponseSchema;
export type V4SsoLogTheUserInResponse = z.infer<
	typeof V4SsoLogTheUserInResponseSchema
>;

export const AgencyZoomEndpointInputSchemas = {
	authenticateForJwtviaV4Sso: AuthenticateForJwtviaV4SsoInputSchema,
	batchCreateContact: BatchCreateContactInputSchema,
	batchCreateLead: BatchCreateLeadInputSchema,
	batchDeleteTask: BatchDeleteTaskInputSchema,
	changeStatusForLead: ChangeStatusForLeadInputSchema,
	completeTask: CompleteTaskInputSchema,
	createACustomerNote: CreateACustomerNoteInputSchema,
	createADriverForAnOpportunity: CreateADriverForAnOpportunityInputSchema,
	createALeadNote: CreateALeadNoteInputSchema,
	createALeadOpportunity: CreateALeadOpportunityInputSchema,
	createALeadQuote: CreateALeadQuoteInputSchema,
	createAnOpportunity: CreateAnOpportunityInputSchema,
	createAVehicleForAnOpportunity: CreateAVehicleForAnOpportunityInputSchema,
	createBizLead: CreateBizLeadInputSchema,
	createLead: CreateLeadInputSchema,
	createTask: CreateTaskInputSchema,
	deleteACustomer: DeleteACustomerInputSchema,
	deleteACustomerFile: DeleteACustomerFileInputSchema,
	deleteACustomerPolicy: DeleteACustomerPolicyInputSchema,
	deleteADriver: DeleteADriverInputSchema,
	deleteALeadFile: DeleteALeadFileInputSchema,
	deleteALeadOpportunity: DeleteALeadOpportunityInputSchema,
	deleteALeadQuote: DeleteALeadQuoteInputSchema,
	deleteAnOpportunity: DeleteAnOpportunityInputSchema,
	deleteATask: DeleteATaskInputSchema,
	deleteAVehicle: DeleteAVehicleInputSchema,
	deleteMessage: DeleteMessageInputSchema,
	deleteThread: DeleteThreadInputSchema,
	getAListOfAssignGroups: GetAListOfAssignGroupsInputSchema,
	getAListOfCarriers: GetAListOfCarriersInputSchema,
	getAListOfCsrs: GetAListOfCsrsInputSchema,
	getAListOfCustomFields: GetAListOfCustomFieldsInputSchema,
	getAListOfDriversForAnOpportunity:
		GetAListOfDriversForAnOpportunityInputSchema,
	getAListOfEmployees: GetAListOfEmployeesInputSchema,
	getAListOfLeadSourceCategories: GetAListOfLeadSourceCategoriesInputSchema,
	getAListOfLeadSources: GetAListOfLeadSourcesInputSchema,
	getAListOfLifeProfessionals: GetAListOfLifeProfessionalsInputSchema,
	getAListOfLocations: GetAListOfLocationsInputSchema,
	getAListOfLossReasons: GetAListOfLossReasonsInputSchema,
	getAListOfPipelines: GetAListOfPipelinesInputSchema,
	getAListOfProducer: GetAListOfProducerInputSchema,
	getAListOfProductLinesPolicyTypes:
		GetAListOfProductLinesPolicyTypesInputSchema,
	getAListOfRecycleEvents: GetAListOfRecycleEventsInputSchema,
	getAListOfVehiclesForAnOpportunity:
		GetAListOfVehiclesForAnOpportunityInputSchema,
	getAmsPoliciesForACustomer: GetAmsPoliciesForACustomerInputSchema,
	getAuthUrlForV4Sso: GetAuthUrlForV4SsoInputSchema,
	getDepartmentsGroups: GetDepartmentsGroupsInputSchema,
	getLeadFiles: GetLeadFilesInputSchema,
	getLeadNotes: GetLeadNotesInputSchema,
	getLeadQuotes: GetLeadQuotesInputSchema,
	getLeadTasks: GetLeadTasksInputSchema,
	getListOfEndStages: GetListOfEndStagesInputSchema,
	getPoliciesForACustomer: GetPoliciesForACustomerInputSchema,
	getTheCustomerDetails: GetTheCustomerDetailsInputSchema,
	getTheCustomerTasks: GetTheCustomerTasksInputSchema,
	getTheDriverDetails: GetTheDriverDetailsInputSchema,
	getTheLeadDetails: GetTheLeadDetailsInputSchema,
	getTheOpportunitiesForALead: GetTheOpportunitiesForALeadInputSchema,
	getTheOpportunityDetails: GetTheOpportunityDetailsInputSchema,
	getTheTaskDetails: GetTheTaskDetailsInputSchema,
	getTheVehicleDetails: GetTheVehicleDetailsInputSchema,
	getThreadDetails: GetThreadDetailsInputSchema,
	linkADriverToOpportunity: LinkADriverToOpportunityInputSchema,
	linkAVehicleToOpportunity: LinkAVehicleToOpportunityInputSchema,
	listProductCategories: ListProductCategoriesInputSchema,
	logTheUserIn: LogTheUserInInputSchema,
	logTheUserOut: LogTheUserOutInputSchema,
	markThreadAsUnreadApiEndpoint: MarkThreadAsUnreadApiEndpointInputSchema,
	moveLeadToSold: MoveLeadToSoldInputSchema,
	removeTextThreadEndpoint: RemoveTextThreadEndpointInputSchema,
	reopenATask: ReopenATaskInputSchema,
	searchBusinessClassifications: SearchBusinessClassificationsInputSchema,
	searchCustomers: SearchCustomersInputSchema,
	searchEmailThreads: SearchEmailThreadsInputSchema,
	searchLeads: SearchLeadsInputSchema,
	searchLeadsCount: SearchLeadsCountInputSchema,
	searchLifeAndHealthLeads: SearchLifeAndHealthLeadsInputSchema,
	searchSmsThreads: SearchSmsThreadsInputSchema,
	searchTasks: SearchTasksInputSchema,
	serviceTicketList: ServiceTicketListInputSchema,
	textDetailThread: TextDetailThreadInputSchema,
	unlinkADriverFromOpportunity: UnlinkADriverFromOpportunityInputSchema,
	unlinkAVehicleFromOpportunity: UnlinkAVehicleFromOpportunityInputSchema,
	unreadThread: UnreadThreadInputSchema,
	updateADriverSDetails: UpdateADriverSDetailsInputSchema,
	updateALeadFileName: UpdateALeadFileNameInputSchema,
	updateALeadOpportunity: UpdateALeadOpportunityInputSchema,
	updateALeadQuote: UpdateALeadQuoteInputSchema,
	updateAnOpportunity: UpdateAnOpportunityInputSchema,
	updateAPolicy: UpdateAPolicyInputSchema,
	updateAVehicleSDetails: UpdateAVehicleSDetailsInputSchema,
	updateBusinessLead: UpdateBusinessLeadInputSchema,
	updateCustomer: UpdateCustomerInputSchema,
	updateLead: UpdateLeadInputSchema,
	updateLeadStatusById: UpdateLeadStatusByIdInputSchema,
	updateMyProfile: UpdateMyProfileInputSchema,
	updateTagsForAPolicy: UpdateTagsForAPolicyInputSchema,
	updateTask: UpdateTaskInputSchema,
	v4SsoLogTheUserIn: V4SsoLogTheUserInInputSchema,
} as const satisfies Record<AgencyZoomRouteKey, z.ZodType>;

export type AgencyZoomEndpointInputs = {
	[K in keyof typeof AgencyZoomEndpointInputSchemas]: z.infer<
		(typeof AgencyZoomEndpointInputSchemas)[K]
	>;
};

export const AgencyZoomEndpointOutputSchemas = {
	authenticateForJwtviaV4Sso: AuthenticateForJwtviaV4SsoResponseSchema,
	batchCreateContact: BatchCreateContactResponseSchema,
	batchCreateLead: BatchCreateLeadResponseSchema,
	batchDeleteTask: BatchDeleteTaskResponseSchema,
	changeStatusForLead: ChangeStatusForLeadResponseSchema,
	completeTask: CompleteTaskResponseSchema,
	createACustomerNote: CreateACustomerNoteResponseSchema,
	createADriverForAnOpportunity: CreateADriverForAnOpportunityResponseSchema,
	createALeadNote: CreateALeadNoteResponseSchema,
	createALeadOpportunity: CreateALeadOpportunityResponseSchema,
	createALeadQuote: CreateALeadQuoteResponseSchema,
	createAnOpportunity: CreateAnOpportunityResponseSchema,
	createAVehicleForAnOpportunity: CreateAVehicleForAnOpportunityResponseSchema,
	createBizLead: CreateBizLeadResponseSchema,
	createLead: CreateLeadResponseSchema,
	createTask: CreateTaskResponseSchema,
	deleteACustomer: DeleteACustomerResponseSchema,
	deleteACustomerFile: DeleteACustomerFileResponseSchema,
	deleteACustomerPolicy: DeleteACustomerPolicyResponseSchema,
	deleteADriver: DeleteADriverResponseSchema,
	deleteALeadFile: DeleteALeadFileResponseSchema,
	deleteALeadOpportunity: DeleteALeadOpportunityResponseSchema,
	deleteALeadQuote: DeleteALeadQuoteResponseSchema,
	deleteAnOpportunity: DeleteAnOpportunityResponseSchema,
	deleteATask: DeleteATaskResponseSchema,
	deleteAVehicle: DeleteAVehicleResponseSchema,
	deleteMessage: DeleteMessageResponseSchema,
	deleteThread: DeleteThreadResponseSchema,
	getAListOfAssignGroups: GetAListOfAssignGroupsResponseSchema,
	getAListOfCarriers: GetAListOfCarriersResponseSchema,
	getAListOfCsrs: GetAListOfCsrsResponseSchema,
	getAListOfCustomFields: GetAListOfCustomFieldsResponseSchema,
	getAListOfDriversForAnOpportunity:
		GetAListOfDriversForAnOpportunityResponseSchema,
	getAListOfEmployees: GetAListOfEmployeesResponseSchema,
	getAListOfLeadSourceCategories: GetAListOfLeadSourceCategoriesResponseSchema,
	getAListOfLeadSources: GetAListOfLeadSourcesResponseSchema,
	getAListOfLifeProfessionals: GetAListOfLifeProfessionalsResponseSchema,
	getAListOfLocations: GetAListOfLocationsResponseSchema,
	getAListOfLossReasons: GetAListOfLossReasonsResponseSchema,
	getAListOfPipelines: GetAListOfPipelinesResponseSchema,
	getAListOfProducer: GetAListOfProducerResponseSchema,
	getAListOfProductLinesPolicyTypes:
		GetAListOfProductLinesPolicyTypesResponseSchema,
	getAListOfRecycleEvents: GetAListOfRecycleEventsResponseSchema,
	getAListOfVehiclesForAnOpportunity:
		GetAListOfVehiclesForAnOpportunityResponseSchema,
	getAmsPoliciesForACustomer: GetAmsPoliciesForACustomerResponseSchema,
	getAuthUrlForV4Sso: GetAuthUrlForV4SsoResponseSchema,
	getDepartmentsGroups: GetDepartmentsGroupsResponseSchema,
	getLeadFiles: GetLeadFilesResponseSchema,
	getLeadNotes: GetLeadNotesResponseSchema,
	getLeadQuotes: GetLeadQuotesResponseSchema,
	getLeadTasks: GetLeadTasksResponseSchema,
	getListOfEndStages: GetListOfEndStagesResponseSchema,
	getPoliciesForACustomer: GetPoliciesForACustomerResponseSchema,
	getTheCustomerDetails: GetTheCustomerDetailsResponseSchema,
	getTheCustomerTasks: GetTheCustomerTasksResponseSchema,
	getTheDriverDetails: GetTheDriverDetailsResponseSchema,
	getTheLeadDetails: GetTheLeadDetailsResponseSchema,
	getTheOpportunitiesForALead: GetTheOpportunitiesForALeadResponseSchema,
	getTheOpportunityDetails: GetTheOpportunityDetailsResponseSchema,
	getTheTaskDetails: GetTheTaskDetailsResponseSchema,
	getTheVehicleDetails: GetTheVehicleDetailsResponseSchema,
	getThreadDetails: GetThreadDetailsResponseSchema,
	linkADriverToOpportunity: LinkADriverToOpportunityResponseSchema,
	linkAVehicleToOpportunity: LinkAVehicleToOpportunityResponseSchema,
	listProductCategories: ListProductCategoriesResponseSchema,
	logTheUserIn: LogTheUserInResponseSchema,
	logTheUserOut: LogTheUserOutResponseSchema,
	markThreadAsUnreadApiEndpoint: MarkThreadAsUnreadApiEndpointResponseSchema,
	moveLeadToSold: MoveLeadToSoldResponseSchema,
	removeTextThreadEndpoint: RemoveTextThreadEndpointResponseSchema,
	reopenATask: ReopenATaskResponseSchema,
	searchBusinessClassifications: SearchBusinessClassificationsResponseSchema,
	searchCustomers: SearchCustomersResponseSchema,
	searchEmailThreads: SearchEmailThreadsResponseSchema,
	searchLeads: SearchLeadsResponseSchema,
	searchLeadsCount: SearchLeadsCountResponseSchema,
	searchLifeAndHealthLeads: SearchLifeAndHealthLeadsResponseSchema,
	searchSmsThreads: SearchSmsThreadsResponseSchema,
	searchTasks: SearchTasksResponseSchema,
	serviceTicketList: ServiceTicketListResponseSchema,
	textDetailThread: TextDetailThreadResponseSchema,
	unlinkADriverFromOpportunity: UnlinkADriverFromOpportunityResponseSchema,
	unlinkAVehicleFromOpportunity: UnlinkAVehicleFromOpportunityResponseSchema,
	unreadThread: UnreadThreadResponseSchema,
	updateADriverSDetails: UpdateADriverSDetailsResponseSchema,
	updateALeadFileName: UpdateALeadFileNameResponseSchema,
	updateALeadOpportunity: UpdateALeadOpportunityResponseSchema,
	updateALeadQuote: UpdateALeadQuoteResponseSchema,
	updateAnOpportunity: UpdateAnOpportunityResponseSchema,
	updateAPolicy: UpdateAPolicyResponseSchema,
	updateAVehicleSDetails: UpdateAVehicleSDetailsResponseSchema,
	updateBusinessLead: UpdateBusinessLeadResponseSchema,
	updateCustomer: UpdateCustomerResponseSchema,
	updateLead: UpdateLeadResponseSchema,
	updateLeadStatusById: UpdateLeadStatusByIdResponseSchema,
	updateMyProfile: UpdateMyProfileResponseSchema,
	updateTagsForAPolicy: UpdateTagsForAPolicyResponseSchema,
	updateTask: UpdateTaskResponseSchema,
	v4SsoLogTheUserIn: V4SsoLogTheUserInResponseSchema,
} as const satisfies Record<AgencyZoomRouteKey, z.ZodType>;

export type AgencyZoomEndpointOutputs = {
	[K in keyof typeof AgencyZoomEndpointOutputSchemas]: z.infer<
		(typeof AgencyZoomEndpointOutputSchemas)[K]
	>;
};

export type AgencyZoomEndpointInput =
	AgencyZoomEndpointInputs[keyof AgencyZoomEndpointInputs] & {
		// Index signature required: factory helpers (resolvePath, buildQuery, requestBody) access
		// fields by dynamic string keys; stricter per-key typing is not feasible across all 99 ops.
		[key: string]: unknown;
	};
