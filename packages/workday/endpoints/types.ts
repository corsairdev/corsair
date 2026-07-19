import { z } from 'zod';

const CreateBusinessTitleChangeInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type CreateBusinessTitleChangeInput = z.infer<
	typeof CreateBusinessTitleChangeInputSchema
>;

const CreateBusinessTitleChangeResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type CreateBusinessTitleChangeResponse = z.infer<
	typeof CreateBusinessTitleChangeResponseSchema
>;

const CreateJobChangeInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type CreateJobChangeInput = z.infer<typeof CreateJobChangeInputSchema>;

const CreateJobChangeResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type CreateJobChangeResponse = z.infer<
	typeof CreateJobChangeResponseSchema
>;

const CreatePayrollInputsInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type CreatePayrollInputsInput = z.infer<
	typeof CreatePayrollInputsInputSchema
>;

const CreatePayrollInputsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type CreatePayrollInputsResponse = z.infer<
	typeof CreatePayrollInputsResponseSchema
>;

const CreateTimeOffRequestInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type CreateTimeOffRequestInput = z.infer<
	typeof CreateTimeOffRequestInputSchema
>;

const CreateTimeOffRequestResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type CreateTimeOffRequestResponse = z.infer<
	typeof CreateTimeOffRequestResponseSchema
>;

const GetAbsenceBalanceInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetAbsenceBalanceInput = z.infer<
	typeof GetAbsenceBalanceInputSchema
>;

const GetAbsenceBalanceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetAbsenceBalanceResponse = z.infer<
	typeof GetAbsenceBalanceResponseSchema
>;

const GetAssignmentChangeGroupCostCentersInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetAssignmentChangeGroupCostCentersInput = z.infer<
	typeof GetAssignmentChangeGroupCostCentersInputSchema
>;

const GetAssignmentChangeGroupCostCentersResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetAssignmentChangeGroupCostCentersResponse = z.infer<
	typeof GetAssignmentChangeGroupCostCentersResponseSchema
>;

const GetAssignmentChangeGroupJobsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetAssignmentChangeGroupJobsInput = z.infer<
	typeof GetAssignmentChangeGroupJobsInputSchema
>;

const GetAssignmentChangeGroupJobsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetAssignmentChangeGroupJobsResponse = z.infer<
	typeof GetAssignmentChangeGroupJobsResponseSchema
>;

const GetAssignmentTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetAssignmentTypesInput = z.infer<
	typeof GetAssignmentTypesInputSchema
>;

const GetAssignmentTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetAssignmentTypesResponse = z.infer<
	typeof GetAssignmentTypesResponseSchema
>;

const GetBusinessTitleChangeInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetBusinessTitleChangeInput = z.infer<
	typeof GetBusinessTitleChangeInputSchema
>;

const GetBusinessTitleChangeResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetBusinessTitleChangeResponse = z.infer<
	typeof GetBusinessTitleChangeResponseSchema
>;

const GetBusinessTitleChangeForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetBusinessTitleChangeForWorkerInput = z.infer<
	typeof GetBusinessTitleChangeForWorkerInputSchema
>;

const GetBusinessTitleChangeForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetBusinessTitleChangeForWorkerResponse = z.infer<
	typeof GetBusinessTitleChangeForWorkerResponseSchema
>;

const GetCandidateAvailabilityTemplateInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCandidateAvailabilityTemplateInput = z.infer<
	typeof GetCandidateAvailabilityTemplateInputSchema
>;

const GetCandidateAvailabilityTemplateResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCandidateAvailabilityTemplateResponse = z.infer<
	typeof GetCandidateAvailabilityTemplateResponseSchema
>;

const GetCollectionOfJobsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCollectionOfJobsInput = z.infer<
	typeof GetCollectionOfJobsInputSchema
>;

const GetCollectionOfJobsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCollectionOfJobsResponse = z.infer<
	typeof GetCollectionOfJobsResponseSchema
>;

const GetCollectionOfPayrollInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCollectionOfPayrollInput = z.infer<
	typeof GetCollectionOfPayrollInputSchema
>;

const GetCollectionOfPayrollResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCollectionOfPayrollResponse = z.infer<
	typeof GetCollectionOfPayrollResponseSchema
>;

const GetCompanyInsiderTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCompanyInsiderTypesInput = z.infer<
	typeof GetCompanyInsiderTypesInputSchema
>;

const GetCompanyInsiderTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCompanyInsiderTypesResponse = z.infer<
	typeof GetCompanyInsiderTypesResponseSchema
>;

const GetContingentWorkerTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetContingentWorkerTypesInput = z.infer<
	typeof GetContingentWorkerTypesInputSchema
>;

const GetContingentWorkerTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetContingentWorkerTypesResponse = z.infer<
	typeof GetContingentWorkerTypesResponseSchema
>;

const GetCountryInfoInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCountryInfoInput = z.infer<typeof GetCountryInfoInputSchema>;

const GetCountryInfoResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCountryInfoResponse = z.infer<
	typeof GetCountryInfoResponseSchema
>;

const GetCurrenciesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCurrenciesInput = z.infer<typeof GetCurrenciesInputSchema>;

const GetCurrenciesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCurrenciesResponse = z.infer<typeof GetCurrenciesResponseSchema>;

const GetCurrentUserInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;

const GetCurrentUserResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetCurrentUserResponse = z.infer<
	typeof GetCurrentUserResponseSchema
>;

const GetGrantsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetGrantsInput = z.infer<typeof GetGrantsInputSchema>;

const GetGrantsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetGrantsResponse = z.infer<typeof GetGrantsResponseSchema>;

const GetHeadcountOptionsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetHeadcountOptionsInput = z.infer<
	typeof GetHeadcountOptionsInputSchema
>;

const GetHeadcountOptionsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetHeadcountOptionsResponse = z.infer<
	typeof GetHeadcountOptionsResponseSchema
>;

const GetHistoryInstanceForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetHistoryInstanceForWorkerInput = z.infer<
	typeof GetHistoryInstanceForWorkerInputSchema
>;

const GetHistoryInstanceForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetHistoryInstanceForWorkerResponse = z.infer<
	typeof GetHistoryInstanceForWorkerResponseSchema
>;

const GetHistoryItemsForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetHistoryItemsForWorkerInput = z.infer<
	typeof GetHistoryItemsForWorkerInputSchema
>;

const GetHistoryItemsForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetHistoryItemsForWorkerResponse = z.infer<
	typeof GetHistoryItemsForWorkerResponseSchema
>;

const GetHolidayEventsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetHolidayEventsInput = z.infer<typeof GetHolidayEventsInputSchema>;

const GetHolidayEventsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetHolidayEventsResponse = z.infer<
	typeof GetHolidayEventsResponseSchema
>;

const GetInterviewInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetInterviewInput = z.infer<typeof GetInterviewInputSchema>;

const GetInterviewResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetInterviewResponse = z.infer<typeof GetInterviewResponseSchema>;

const GetInterviewFeedback2InputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetInterviewFeedback2Input = z.infer<
	typeof GetInterviewFeedback2InputSchema
>;

const GetInterviewFeedback2ResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetInterviewFeedback2Response = z.infer<
	typeof GetInterviewFeedback2ResponseSchema
>;

const GetJobByIdInputSchema = z.object({ id: z.string() });
export type GetJobByIdInput = z.infer<typeof GetJobByIdInputSchema>;

const GetJobByIdResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobByIdResponse = z.infer<typeof GetJobByIdResponseSchema>;

const GetJobChangeFrequenciesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangeFrequenciesInput = z.infer<
	typeof GetJobChangeFrequenciesInputSchema
>;

const GetJobChangeFrequenciesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangeFrequenciesResponse = z.infer<
	typeof GetJobChangeFrequenciesResponseSchema
>;

const GetJobChangeLocationInfoInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangeLocationInfoInput = z.infer<
	typeof GetJobChangeLocationInfoInputSchema
>;

const GetJobChangeLocationInfoResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangeLocationInfoResponse = z.infer<
	typeof GetJobChangeLocationInfoResponseSchema
>;

const GetJobChangePositionInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangePositionInput = z.infer<
	typeof GetJobChangePositionInputSchema
>;

const GetJobChangePositionResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangePositionResponse = z.infer<
	typeof GetJobChangePositionResponseSchema
>;

const GetJobChangeReasonInstanceInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangeReasonInstanceInput = z.infer<
	typeof GetJobChangeReasonInstanceInputSchema
>;

const GetJobChangeReasonInstanceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangeReasonInstanceResponse = z.infer<
	typeof GetJobChangeReasonInstanceResponseSchema
>;

const GetJobChangeReasonValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangeReasonValuesInput = z.infer<
	typeof GetJobChangeReasonValuesInputSchema
>;

const GetJobChangeReasonValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangeReasonValuesResponse = z.infer<
	typeof GetJobChangeReasonValuesResponseSchema
>;

const GetJobChangeReasonsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangeReasonsInput = z.infer<
	typeof GetJobChangeReasonsInputSchema
>;

const GetJobChangeReasonsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangeReasonsResponse = z.infer<
	typeof GetJobChangeReasonsResponseSchema
>;

const GetJobChangesGroupTemplatesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangesGroupTemplatesInput = z.infer<
	typeof GetJobChangesGroupTemplatesInputSchema
>;

const GetJobChangesGroupTemplatesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangesGroupTemplatesResponse = z.infer<
	typeof GetJobChangesGroupTemplatesResponseSchema
>;

const GetJobChangesJobValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangesJobValuesInput = z.infer<
	typeof GetJobChangesJobValuesInputSchema
>;

const GetJobChangesJobValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangesJobValuesResponse = z.infer<
	typeof GetJobChangesJobValuesResponseSchema
>;

const GetJobChangesWorkerValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobChangesWorkerValuesInput = z.infer<
	typeof GetJobChangesWorkerValuesInputSchema
>;

const GetJobChangesWorkerValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobChangesWorkerValuesResponse = z.infer<
	typeof GetJobChangesWorkerValuesResponseSchema
>;

const GetJobClassificationsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobClassificationsInput = z.infer<
	typeof GetJobClassificationsInputSchema
>;

const GetJobClassificationsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobClassificationsResponse = z.infer<
	typeof GetJobClassificationsResponseSchema
>;

const GetJobPostingInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobPostingInput = z.infer<typeof GetJobPostingInputSchema>;

const GetJobPostingResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobPostingResponse = z.infer<typeof GetJobPostingResponseSchema>;

const GetJobPostingQuestionnaireInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobPostingQuestionnaireInput = z.infer<
	typeof GetJobPostingQuestionnaireInputSchema
>;

const GetJobPostingQuestionnaireResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobPostingQuestionnaireResponse = z.infer<
	typeof GetJobPostingQuestionnaireResponseSchema
>;

const GetJobProfilesValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobProfilesValuesInput = z.infer<
	typeof GetJobProfilesValuesInputSchema
>;

const GetJobProfilesValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobProfilesValuesResponse = z.infer<
	typeof GetJobProfilesValuesResponseSchema
>;

const GetJobRequisitionValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobRequisitionValuesInput = z.infer<
	typeof GetJobRequisitionValuesInputSchema
>;

const GetJobRequisitionValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobRequisitionValuesResponse = z.infer<
	typeof GetJobRequisitionValuesResponseSchema
>;

const GetJobWorkspaceInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobWorkspaceInput = z.infer<typeof GetJobWorkspaceInputSchema>;

const GetJobWorkspaceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobWorkspaceResponse = z.infer<
	typeof GetJobWorkspaceResponseSchema
>;

const GetJobWorkspacesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetJobWorkspacesInput = z.infer<typeof GetJobWorkspacesInputSchema>;

const GetJobWorkspacesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetJobWorkspacesResponse = z.infer<
	typeof GetJobWorkspacesResponseSchema
>;

const GetLeaveStatusValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetLeaveStatusValuesInput = z.infer<
	typeof GetLeaveStatusValuesInputSchema
>;

const GetLeaveStatusValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetLeaveStatusValuesResponse = z.infer<
	typeof GetLeaveStatusValuesResponseSchema
>;

const GetMyJobPostingsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetMyJobPostingsInput = z.infer<typeof GetMyJobPostingsInputSchema>;

const GetMyJobPostingsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetMyJobPostingsResponse = z.infer<
	typeof GetMyJobPostingsResponseSchema
>;

const GetOrganizationAssignmentBusinessUnitsInputSchema = z
	.object({})
	.optional();
export type GetOrganizationAssignmentBusinessUnitsInput = z.infer<
	typeof GetOrganizationAssignmentBusinessUnitsInputSchema
>;

const GetOrganizationAssignmentBusinessUnitsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetOrganizationAssignmentBusinessUnitsResponse = z.infer<
	typeof GetOrganizationAssignmentBusinessUnitsResponseSchema
>;

const GetOrganizationAssignmentCustomsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetOrganizationAssignmentCustomsInput = z.infer<
	typeof GetOrganizationAssignmentCustomsInputSchema
>;

const GetOrganizationAssignmentCustomsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetOrganizationAssignmentCustomsResponse = z.infer<
	typeof GetOrganizationAssignmentCustomsResponseSchema
>;

const GetOrganizationAssignmentFundsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetOrganizationAssignmentFundsInput = z.infer<
	typeof GetOrganizationAssignmentFundsInputSchema
>;

const GetOrganizationAssignmentFundsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetOrganizationAssignmentFundsResponse = z.infer<
	typeof GetOrganizationAssignmentFundsResponseSchema
>;

const GetOrganizationAssignmentRegionsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetOrganizationAssignmentRegionsInput = z.infer<
	typeof GetOrganizationAssignmentRegionsInputSchema
>;

const GetOrganizationAssignmentRegionsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetOrganizationAssignmentRegionsResponse = z.infer<
	typeof GetOrganizationAssignmentRegionsResponseSchema
>;

const GetOrganizationAssignmentWorkersInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetOrganizationAssignmentWorkersInput = z.infer<
	typeof GetOrganizationAssignmentWorkersInputSchema
>;

const GetOrganizationAssignmentWorkersResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetOrganizationAssignmentWorkersResponse = z.infer<
	typeof GetOrganizationAssignmentWorkersResponseSchema
>;

const GetPayGroupByJobIdInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetPayGroupByJobIdInput = z.infer<
	typeof GetPayGroupByJobIdInputSchema
>;

const GetPayGroupByJobIdResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetPayGroupByJobIdResponse = z.infer<
	typeof GetPayGroupByJobIdResponseSchema
>;

const GetPaySlipInstancesForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetPaySlipInstancesForWorkerInput = z.infer<
	typeof GetPaySlipInstancesForWorkerInputSchema
>;

const GetPaySlipInstancesForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetPaySlipInstancesForWorkerResponse = z.infer<
	typeof GetPaySlipInstancesForWorkerResponseSchema
>;

const GetPaySlipsForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetPaySlipsForWorkerInput = z.infer<
	typeof GetPaySlipsForWorkerInputSchema
>;

const GetPaySlipsForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetPaySlipsForWorkerResponse = z.infer<
	typeof GetPaySlipsForWorkerResponseSchema
>;

const GetPayrollInputInstanceInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetPayrollInputInstanceInput = z.infer<
	typeof GetPayrollInputInstanceInputSchema
>;

const GetPayrollInputInstanceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetPayrollInputInstanceResponse = z.infer<
	typeof GetPayrollInputInstanceResponseSchema
>;

const GetProposedPositionValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProposedPositionValuesInput = z.infer<
	typeof GetProposedPositionValuesInputSchema
>;

const GetProposedPositionValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProposedPositionValuesResponse = z.infer<
	typeof GetProposedPositionValuesResponseSchema
>;

const GetProspectInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProspectInput = z.infer<typeof GetProspectInputSchema>;

const GetProspectResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProspectResponse = z.infer<typeof GetProspectResponseSchema>;

const GetProspectEducationsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProspectEducationsInput = z.infer<
	typeof GetProspectEducationsInputSchema
>;

const GetProspectEducationsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProspectEducationsResponse = z.infer<
	typeof GetProspectEducationsResponseSchema
>;

const GetProspectExperiencesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProspectExperiencesInput = z.infer<
	typeof GetProspectExperiencesInputSchema
>;

const GetProspectExperiencesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProspectExperiencesResponse = z.infer<
	typeof GetProspectExperiencesResponseSchema
>;

const GetProspectResumeAttachmentsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProspectResumeAttachmentsInput = z.infer<
	typeof GetProspectResumeAttachmentsInputSchema
>;

const GetProspectResumeAttachmentsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProspectResumeAttachmentsResponse = z.infer<
	typeof GetProspectResumeAttachmentsResponseSchema
>;

const GetProspectSkillsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetProspectSkillsInput = z.infer<
	typeof GetProspectSkillsInputSchema
>;

const GetProspectSkillsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetProspectSkillsResponse = z.infer<
	typeof GetProspectSkillsResponseSchema
>;

const GetSupervisoryOrgValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetSupervisoryOrgValuesInput = z.infer<
	typeof GetSupervisoryOrgValuesInputSchema
>;

const GetSupervisoryOrgValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetSupervisoryOrgValuesResponse = z.infer<
	typeof GetSupervisoryOrgValuesResponseSchema
>;

const GetTimeOffEntriesForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetTimeOffEntriesForWorkerInput = z.infer<
	typeof GetTimeOffEntriesForWorkerInputSchema
>;

const GetTimeOffEntriesForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetTimeOffEntriesForWorkerResponse = z.infer<
	typeof GetTimeOffEntriesForWorkerResponseSchema
>;

const GetTimeOffPlansForWorkerInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetTimeOffPlansForWorkerInput = z.infer<
	typeof GetTimeOffPlansForWorkerInputSchema
>;

const GetTimeOffPlansForWorkerResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetTimeOffPlansForWorkerResponse = z.infer<
	typeof GetTimeOffPlansForWorkerResponseSchema
>;

const GetTimeOffStatusValuesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetTimeOffStatusValuesInput = z.infer<
	typeof GetTimeOffStatusValuesInputSchema
>;

const GetTimeOffStatusValuesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetTimeOffStatusValuesResponse = z.infer<
	typeof GetTimeOffStatusValuesResponseSchema
>;

const GetTimeTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetTimeTypesInput = z.infer<typeof GetTimeTypesInputSchema>;

const GetTimeTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetTimeTypesResponse = z.infer<typeof GetTimeTypesResponseSchema>;

const GetWorkStudyAwardsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkStudyAwardsInput = z.infer<
	typeof GetWorkStudyAwardsInputSchema
>;

const GetWorkStudyAwardsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkStudyAwardsResponse = z.infer<
	typeof GetWorkStudyAwardsResponseSchema
>;

const GetWorkerBusinessTitleChangesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerBusinessTitleChangesInput = z.infer<
	typeof GetWorkerBusinessTitleChangesInputSchema
>;

const GetWorkerBusinessTitleChangesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerBusinessTitleChangesResponse = z.infer<
	typeof GetWorkerBusinessTitleChangesResponseSchema
>;

const GetWorkerEligibleAbsenceTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerEligibleAbsenceTypesInput = z.infer<
	typeof GetWorkerEligibleAbsenceTypesInputSchema
>;

const GetWorkerEligibleAbsenceTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerEligibleAbsenceTypesResponse = z.infer<
	typeof GetWorkerEligibleAbsenceTypesResponseSchema
>;

const GetWorkerInfoInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerInfoInput = z.infer<typeof GetWorkerInfoInputSchema>;

const GetWorkerInfoResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerInfoResponse = z.infer<typeof GetWorkerInfoResponseSchema>;

const GetWorkerLeavesOfAbsenceInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerLeavesOfAbsenceInput = z.infer<
	typeof GetWorkerLeavesOfAbsenceInputSchema
>;

const GetWorkerLeavesOfAbsenceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerLeavesOfAbsenceResponse = z.infer<
	typeof GetWorkerLeavesOfAbsenceResponseSchema
>;

const GetWorkerServiceDatesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerServiceDatesInput = z.infer<
	typeof GetWorkerServiceDatesInputSchema
>;

const GetWorkerServiceDatesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerServiceDatesResponse = z.infer<
	typeof GetWorkerServiceDatesResponseSchema
>;

const GetWorkerStaffingInformationInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerStaffingInformationInput = z.infer<
	typeof GetWorkerStaffingInformationInputSchema
>;

const GetWorkerStaffingInformationResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerStaffingInformationResponse = z.infer<
	typeof GetWorkerStaffingInformationResponseSchema
>;

const GetWorkerTimeOffDetailsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerTimeOffDetailsInput = z.infer<
	typeof GetWorkerTimeOffDetailsInputSchema
>;

const GetWorkerTimeOffDetailsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerTimeOffDetailsResponse = z.infer<
	typeof GetWorkerTimeOffDetailsResponseSchema
>;

const GetWorkerTypesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerTypesInput = z.infer<typeof GetWorkerTypesInputSchema>;

const GetWorkerTypesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerTypesResponse = z.infer<
	typeof GetWorkerTypesResponseSchema
>;

const GetWorkerValidTimeOffDatesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkerValidTimeOffDatesInput = z.infer<
	typeof GetWorkerValidTimeOffDatesInputSchema
>;

const GetWorkerValidTimeOffDatesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkerValidTimeOffDatesResponse = z.infer<
	typeof GetWorkerValidTimeOffDatesResponseSchema
>;

const GetWorkersCollectionStaffingInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkersCollectionStaffingInput = z.infer<
	typeof GetWorkersCollectionStaffingInputSchema
>;

const GetWorkersCollectionStaffingResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkersCollectionStaffingResponse = z.infer<
	typeof GetWorkersCollectionStaffingResponseSchema
>;

const GetWorkspaceInstancesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type GetWorkspaceInstancesInput = z.infer<
	typeof GetWorkspaceInstancesInputSchema
>;

const GetWorkspaceInstancesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type GetWorkspaceInstancesResponse = z.infer<
	typeof GetWorkspaceInstancesResponseSchema
>;

const ListBalancesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type ListBalancesInput = z.infer<typeof ListBalancesInputSchema>;

const ListBalancesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type ListBalancesResponse = z.infer<typeof ListBalancesResponseSchema>;

const ListCountriesInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type ListCountriesInput = z.infer<typeof ListCountriesInputSchema>;

const ListCountriesResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type ListCountriesResponse = z.infer<typeof ListCountriesResponseSchema>;

const ListInterviewsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type ListInterviewsInput = z.infer<typeof ListInterviewsInputSchema>;

const ListInterviewsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type ListInterviewsResponse = z.infer<
	typeof ListInterviewsResponseSchema
>;

const ListJobPostingsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type ListJobPostingsInput = z.infer<typeof ListJobPostingsInputSchema>;

const ListJobPostingsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type ListJobPostingsResponse = z.infer<
	typeof ListJobPostingsResponseSchema
>;

const ListJobsInputSchema = z
	.object({ cursor: z.string().optional(), limit: z.number().optional() })
	.passthrough();
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;

const ListJobsResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type ListJobsResponse = z.infer<typeof ListJobsResponseSchema>;

const RetrieveWorkerLeaveOfAbsenceSubresourceInputSchema = z
	.object({})
	.optional();
export type RetrieveWorkerLeaveOfAbsenceSubresourceInput = z.infer<
	typeof RetrieveWorkerLeaveOfAbsenceSubresourceInputSchema
>;

const RetrieveWorkerLeaveOfAbsenceSubresourceResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type RetrieveWorkerLeaveOfAbsenceSubresourceResponse = z.infer<
	typeof RetrieveWorkerLeaveOfAbsenceSubresourceResponseSchema
>;

const UpdateAnExistingPayrollInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type UpdateAnExistingPayrollInput = z.infer<
	typeof UpdateAnExistingPayrollInputSchema
>;

const UpdateAnExistingPayrollResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type UpdateAnExistingPayrollResponse = z.infer<
	typeof UpdateAnExistingPayrollResponseSchema
>;

const UpdateJobChangeBusinessTitleInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type UpdateJobChangeBusinessTitleInput = z.infer<
	typeof UpdateJobChangeBusinessTitleInputSchema
>;

const UpdateJobChangeBusinessTitleResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type UpdateJobChangeBusinessTitleResponse = z.infer<
	typeof UpdateJobChangeBusinessTitleResponseSchema
>;

const UpdateMessageTemplateByIdInputSchema = z
	.object({ id: z.string(), workerId: z.string().optional() })
	.passthrough()
	.optional();
export type UpdateMessageTemplateByIdInput = z.infer<
	typeof UpdateMessageTemplateByIdInputSchema
>;

const UpdateMessageTemplateByIdResponseSchema = z
	.object({})
	// Justification: Catching all unknown properties for forward-compatibility.
	.catchall(z.unknown());
export type UpdateMessageTemplateByIdResponse = z.infer<
	typeof UpdateMessageTemplateByIdResponseSchema
>;

export const WorkdayEndpointInputSchemas = {
	createBusinessTitleChange: CreateBusinessTitleChangeInputSchema,
	createJobChange: CreateJobChangeInputSchema,
	createPayrollInputs: CreatePayrollInputsInputSchema,
	createTimeOffRequest: CreateTimeOffRequestInputSchema,
	getAbsenceBalance: GetAbsenceBalanceInputSchema,
	getAssignmentChangeGroupCostCenters:
		GetAssignmentChangeGroupCostCentersInputSchema,
	getAssignmentChangeGroupJobs: GetAssignmentChangeGroupJobsInputSchema,
	getAssignmentTypes: GetAssignmentTypesInputSchema,
	getBusinessTitleChange: GetBusinessTitleChangeInputSchema,
	getBusinessTitleChangeForWorker: GetBusinessTitleChangeForWorkerInputSchema,
	getCandidateAvailabilityTemplate: GetCandidateAvailabilityTemplateInputSchema,
	getCollectionOfJobs: GetCollectionOfJobsInputSchema,
	getCollectionOfPayroll: GetCollectionOfPayrollInputSchema,
	getCompanyInsiderTypes: GetCompanyInsiderTypesInputSchema,
	getContingentWorkerTypes: GetContingentWorkerTypesInputSchema,
	getCountryInfo: GetCountryInfoInputSchema,
	getCurrencies: GetCurrenciesInputSchema,
	getCurrentUser: GetCurrentUserInputSchema,
	getGrants: GetGrantsInputSchema,
	getHeadcountOptions: GetHeadcountOptionsInputSchema,
	getHistoryInstanceForWorker: GetHistoryInstanceForWorkerInputSchema,
	getHistoryItemsForWorker: GetHistoryItemsForWorkerInputSchema,
	getHolidayEvents: GetHolidayEventsInputSchema,
	getInterview: GetInterviewInputSchema,
	getInterviewFeedback2: GetInterviewFeedback2InputSchema,
	getJobById: GetJobByIdInputSchema,
	getJobChangeFrequencies: GetJobChangeFrequenciesInputSchema,
	getJobChangeLocationInfo: GetJobChangeLocationInfoInputSchema,
	getJobChangePosition: GetJobChangePositionInputSchema,
	getJobChangeReasonInstance: GetJobChangeReasonInstanceInputSchema,
	getJobChangeReasonValues: GetJobChangeReasonValuesInputSchema,
	getJobChangeReasons: GetJobChangeReasonsInputSchema,
	getJobChangesGroupTemplates: GetJobChangesGroupTemplatesInputSchema,
	getJobChangesJobValues: GetJobChangesJobValuesInputSchema,
	getJobChangesWorkerValues: GetJobChangesWorkerValuesInputSchema,
	getJobClassifications: GetJobClassificationsInputSchema,
	getJobPosting: GetJobPostingInputSchema,
	getJobPostingQuestionnaire: GetJobPostingQuestionnaireInputSchema,
	getJobProfilesValues: GetJobProfilesValuesInputSchema,
	getJobRequisitionValues: GetJobRequisitionValuesInputSchema,
	getJobWorkspace: GetJobWorkspaceInputSchema,
	getJobWorkspaces: GetJobWorkspacesInputSchema,
	getLeaveStatusValues: GetLeaveStatusValuesInputSchema,
	getMyJobPostings: GetMyJobPostingsInputSchema,
	getOrganizationAssignmentBusinessUnits:
		GetOrganizationAssignmentBusinessUnitsInputSchema,
	getOrganizationAssignmentCustoms: GetOrganizationAssignmentCustomsInputSchema,
	getOrganizationAssignmentFunds: GetOrganizationAssignmentFundsInputSchema,
	getOrganizationAssignmentRegions: GetOrganizationAssignmentRegionsInputSchema,
	getOrganizationAssignmentWorkers: GetOrganizationAssignmentWorkersInputSchema,
	getPayGroupByJobId: GetPayGroupByJobIdInputSchema,
	getPaySlipInstancesForWorker: GetPaySlipInstancesForWorkerInputSchema,
	getPaySlipsForWorker: GetPaySlipsForWorkerInputSchema,
	getPayrollInputInstance: GetPayrollInputInstanceInputSchema,
	getProposedPositionValues: GetProposedPositionValuesInputSchema,
	getProspect: GetProspectInputSchema,
	getProspectEducations: GetProspectEducationsInputSchema,
	getProspectExperiences: GetProspectExperiencesInputSchema,
	getProspectResumeAttachments: GetProspectResumeAttachmentsInputSchema,
	getProspectSkills: GetProspectSkillsInputSchema,
	getSupervisoryOrgValues: GetSupervisoryOrgValuesInputSchema,
	getTimeOffEntriesForWorker: GetTimeOffEntriesForWorkerInputSchema,
	getTimeOffPlansForWorker: GetTimeOffPlansForWorkerInputSchema,
	getTimeOffStatusValues: GetTimeOffStatusValuesInputSchema,
	getTimeTypes: GetTimeTypesInputSchema,
	getWorkStudyAwards: GetWorkStudyAwardsInputSchema,
	getWorkerBusinessTitleChanges: GetWorkerBusinessTitleChangesInputSchema,
	getWorkerEligibleAbsenceTypes: GetWorkerEligibleAbsenceTypesInputSchema,
	getWorkerInfo: GetWorkerInfoInputSchema,
	getWorkerLeavesOfAbsence: GetWorkerLeavesOfAbsenceInputSchema,
	getWorkerServiceDates: GetWorkerServiceDatesInputSchema,
	getWorkerStaffingInformation: GetWorkerStaffingInformationInputSchema,
	getWorkerTimeOffDetails: GetWorkerTimeOffDetailsInputSchema,
	getWorkerTypes: GetWorkerTypesInputSchema,
	getWorkerValidTimeOffDates: GetWorkerValidTimeOffDatesInputSchema,
	getWorkersCollectionStaffing: GetWorkersCollectionStaffingInputSchema,
	getWorkspaceInstances: GetWorkspaceInstancesInputSchema,
	listBalances: ListBalancesInputSchema,
	listCountries: ListCountriesInputSchema,
	listInterviews: ListInterviewsInputSchema,
	listJobPostings: ListJobPostingsInputSchema,
	listJobs: ListJobsInputSchema,
	retrieveWorkerLeaveOfAbsenceSubresource:
		RetrieveWorkerLeaveOfAbsenceSubresourceInputSchema,
	updateAnExistingPayroll: UpdateAnExistingPayrollInputSchema,
	updateJobChangeBusinessTitle: UpdateJobChangeBusinessTitleInputSchema,
	updateMessageTemplateById: UpdateMessageTemplateByIdInputSchema,
} as const;

export type WorkdayEndpointInputs = {
	[K in keyof typeof WorkdayEndpointInputSchemas]: z.infer<
		(typeof WorkdayEndpointInputSchemas)[K]
	>;
};

export const WorkdayEndpointOutputSchemas = {
	createBusinessTitleChange: CreateBusinessTitleChangeResponseSchema,
	createJobChange: CreateJobChangeResponseSchema,
	createPayrollInputs: CreatePayrollInputsResponseSchema,
	createTimeOffRequest: CreateTimeOffRequestResponseSchema,
	getAbsenceBalance: GetAbsenceBalanceResponseSchema,
	getAssignmentChangeGroupCostCenters:
		GetAssignmentChangeGroupCostCentersResponseSchema,
	getAssignmentChangeGroupJobs: GetAssignmentChangeGroupJobsResponseSchema,
	getAssignmentTypes: GetAssignmentTypesResponseSchema,
	getBusinessTitleChange: GetBusinessTitleChangeResponseSchema,
	getBusinessTitleChangeForWorker:
		GetBusinessTitleChangeForWorkerResponseSchema,
	getCandidateAvailabilityTemplate:
		GetCandidateAvailabilityTemplateResponseSchema,
	getCollectionOfJobs: GetCollectionOfJobsResponseSchema,
	getCollectionOfPayroll: GetCollectionOfPayrollResponseSchema,
	getCompanyInsiderTypes: GetCompanyInsiderTypesResponseSchema,
	getContingentWorkerTypes: GetContingentWorkerTypesResponseSchema,
	getCountryInfo: GetCountryInfoResponseSchema,
	getCurrencies: GetCurrenciesResponseSchema,
	getCurrentUser: GetCurrentUserResponseSchema,
	getGrants: GetGrantsResponseSchema,
	getHeadcountOptions: GetHeadcountOptionsResponseSchema,
	getHistoryInstanceForWorker: GetHistoryInstanceForWorkerResponseSchema,
	getHistoryItemsForWorker: GetHistoryItemsForWorkerResponseSchema,
	getHolidayEvents: GetHolidayEventsResponseSchema,
	getInterview: GetInterviewResponseSchema,
	getInterviewFeedback2: GetInterviewFeedback2ResponseSchema,
	getJobById: GetJobByIdResponseSchema,
	getJobChangeFrequencies: GetJobChangeFrequenciesResponseSchema,
	getJobChangeLocationInfo: GetJobChangeLocationInfoResponseSchema,
	getJobChangePosition: GetJobChangePositionResponseSchema,
	getJobChangeReasonInstance: GetJobChangeReasonInstanceResponseSchema,
	getJobChangeReasonValues: GetJobChangeReasonValuesResponseSchema,
	getJobChangeReasons: GetJobChangeReasonsResponseSchema,
	getJobChangesGroupTemplates: GetJobChangesGroupTemplatesResponseSchema,
	getJobChangesJobValues: GetJobChangesJobValuesResponseSchema,
	getJobChangesWorkerValues: GetJobChangesWorkerValuesResponseSchema,
	getJobClassifications: GetJobClassificationsResponseSchema,
	getJobPosting: GetJobPostingResponseSchema,
	getJobPostingQuestionnaire: GetJobPostingQuestionnaireResponseSchema,
	getJobProfilesValues: GetJobProfilesValuesResponseSchema,
	getJobRequisitionValues: GetJobRequisitionValuesResponseSchema,
	getJobWorkspace: GetJobWorkspaceResponseSchema,
	getJobWorkspaces: GetJobWorkspacesResponseSchema,
	getLeaveStatusValues: GetLeaveStatusValuesResponseSchema,
	getMyJobPostings: GetMyJobPostingsResponseSchema,
	getOrganizationAssignmentBusinessUnits:
		GetOrganizationAssignmentBusinessUnitsResponseSchema,
	getOrganizationAssignmentCustoms:
		GetOrganizationAssignmentCustomsResponseSchema,
	getOrganizationAssignmentFunds: GetOrganizationAssignmentFundsResponseSchema,
	getOrganizationAssignmentRegions:
		GetOrganizationAssignmentRegionsResponseSchema,
	getOrganizationAssignmentWorkers:
		GetOrganizationAssignmentWorkersResponseSchema,
	getPayGroupByJobId: GetPayGroupByJobIdResponseSchema,
	getPaySlipInstancesForWorker: GetPaySlipInstancesForWorkerResponseSchema,
	getPaySlipsForWorker: GetPaySlipsForWorkerResponseSchema,
	getPayrollInputInstance: GetPayrollInputInstanceResponseSchema,
	getProposedPositionValues: GetProposedPositionValuesResponseSchema,
	getProspect: GetProspectResponseSchema,
	getProspectEducations: GetProspectEducationsResponseSchema,
	getProspectExperiences: GetProspectExperiencesResponseSchema,
	getProspectResumeAttachments: GetProspectResumeAttachmentsResponseSchema,
	getProspectSkills: GetProspectSkillsResponseSchema,
	getSupervisoryOrgValues: GetSupervisoryOrgValuesResponseSchema,
	getTimeOffEntriesForWorker: GetTimeOffEntriesForWorkerResponseSchema,
	getTimeOffPlansForWorker: GetTimeOffPlansForWorkerResponseSchema,
	getTimeOffStatusValues: GetTimeOffStatusValuesResponseSchema,
	getTimeTypes: GetTimeTypesResponseSchema,
	getWorkStudyAwards: GetWorkStudyAwardsResponseSchema,
	getWorkerBusinessTitleChanges: GetWorkerBusinessTitleChangesResponseSchema,
	getWorkerEligibleAbsenceTypes: GetWorkerEligibleAbsenceTypesResponseSchema,
	getWorkerInfo: GetWorkerInfoResponseSchema,
	getWorkerLeavesOfAbsence: GetWorkerLeavesOfAbsenceResponseSchema,
	getWorkerServiceDates: GetWorkerServiceDatesResponseSchema,
	getWorkerStaffingInformation: GetWorkerStaffingInformationResponseSchema,
	getWorkerTimeOffDetails: GetWorkerTimeOffDetailsResponseSchema,
	getWorkerTypes: GetWorkerTypesResponseSchema,
	getWorkerValidTimeOffDates: GetWorkerValidTimeOffDatesResponseSchema,
	getWorkersCollectionStaffing: GetWorkersCollectionStaffingResponseSchema,
	getWorkspaceInstances: GetWorkspaceInstancesResponseSchema,
	listBalances: ListBalancesResponseSchema,
	listCountries: ListCountriesResponseSchema,
	listInterviews: ListInterviewsResponseSchema,
	listJobPostings: ListJobPostingsResponseSchema,
	listJobs: ListJobsResponseSchema,
	retrieveWorkerLeaveOfAbsenceSubresource:
		RetrieveWorkerLeaveOfAbsenceSubresourceResponseSchema,
	updateAnExistingPayroll: UpdateAnExistingPayrollResponseSchema,
	updateJobChangeBusinessTitle: UpdateJobChangeBusinessTitleResponseSchema,
	updateMessageTemplateById: UpdateMessageTemplateByIdResponseSchema,
} as const;

export type WorkdayEndpointOutputs = {
	[K in keyof typeof WorkdayEndpointOutputSchemas]: z.infer<
		(typeof WorkdayEndpointOutputSchemas)[K]
	>;
};
