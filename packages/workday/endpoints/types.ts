import { z } from 'zod';

const CreateBusinessTitleChangeInputSchema = z.object({}).optional();
export type CreateBusinessTitleChangeInput = z.infer<
	typeof CreateBusinessTitleChangeInputSchema
>;

const CreateBusinessTitleChangeResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type CreateBusinessTitleChangeResponse = z.infer<
	typeof CreateBusinessTitleChangeResponseSchema
>;

const CreateJobChangeInputSchema = z.object({}).optional();
export type CreateJobChangeInput = z.infer<typeof CreateJobChangeInputSchema>;

const CreateJobChangeResponseSchema = z.object({}).catchall(z.unknown());
export type CreateJobChangeResponse = z.infer<
	typeof CreateJobChangeResponseSchema
>;

const CreatePayrollInputsInputSchema = z.object({}).optional();
export type CreatePayrollInputsInput = z.infer<
	typeof CreatePayrollInputsInputSchema
>;

const CreatePayrollInputsResponseSchema = z.object({}).catchall(z.unknown());
export type CreatePayrollInputsResponse = z.infer<
	typeof CreatePayrollInputsResponseSchema
>;

const CreateTimeOffRequestInputSchema = z.object({}).optional();
export type CreateTimeOffRequestInput = z.infer<
	typeof CreateTimeOffRequestInputSchema
>;

const CreateTimeOffRequestResponseSchema = z.object({}).catchall(z.unknown());
export type CreateTimeOffRequestResponse = z.infer<
	typeof CreateTimeOffRequestResponseSchema
>;

const GetAbsenceBalanceInputSchema = z.object({}).optional();
export type GetAbsenceBalanceInput = z.infer<
	typeof GetAbsenceBalanceInputSchema
>;

const GetAbsenceBalanceResponseSchema = z.object({}).catchall(z.unknown());
export type GetAbsenceBalanceResponse = z.infer<
	typeof GetAbsenceBalanceResponseSchema
>;

const GetAssignmentChangeGroupCostCentersInputSchema = z.object({}).optional();
export type GetAssignmentChangeGroupCostCentersInput = z.infer<
	typeof GetAssignmentChangeGroupCostCentersInputSchema
>;

const GetAssignmentChangeGroupCostCentersResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetAssignmentChangeGroupCostCentersResponse = z.infer<
	typeof GetAssignmentChangeGroupCostCentersResponseSchema
>;

const GetAssignmentChangeGroupJobsInputSchema = z.object({}).optional();
export type GetAssignmentChangeGroupJobsInput = z.infer<
	typeof GetAssignmentChangeGroupJobsInputSchema
>;

const GetAssignmentChangeGroupJobsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetAssignmentChangeGroupJobsResponse = z.infer<
	typeof GetAssignmentChangeGroupJobsResponseSchema
>;

const GetAssignmentTypesInputSchema = z.object({}).optional();
export type GetAssignmentTypesInput = z.infer<
	typeof GetAssignmentTypesInputSchema
>;

const GetAssignmentTypesResponseSchema = z.object({}).catchall(z.unknown());
export type GetAssignmentTypesResponse = z.infer<
	typeof GetAssignmentTypesResponseSchema
>;

const GetBusinessTitleChangeInputSchema = z.object({}).optional();
export type GetBusinessTitleChangeInput = z.infer<
	typeof GetBusinessTitleChangeInputSchema
>;

const GetBusinessTitleChangeResponseSchema = z.object({}).catchall(z.unknown());
export type GetBusinessTitleChangeResponse = z.infer<
	typeof GetBusinessTitleChangeResponseSchema
>;

const GetBusinessTitleChangeForWorkerInputSchema = z.object({}).optional();
export type GetBusinessTitleChangeForWorkerInput = z.infer<
	typeof GetBusinessTitleChangeForWorkerInputSchema
>;

const GetBusinessTitleChangeForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetBusinessTitleChangeForWorkerResponse = z.infer<
	typeof GetBusinessTitleChangeForWorkerResponseSchema
>;

const GetCandidateAvailabilityTemplateInputSchema = z.object({}).optional();
export type GetCandidateAvailabilityTemplateInput = z.infer<
	typeof GetCandidateAvailabilityTemplateInputSchema
>;

const GetCandidateAvailabilityTemplateResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetCandidateAvailabilityTemplateResponse = z.infer<
	typeof GetCandidateAvailabilityTemplateResponseSchema
>;

const GetCollectionOfJobsInputSchema = z.object({}).optional();
export type GetCollectionOfJobsInput = z.infer<
	typeof GetCollectionOfJobsInputSchema
>;

const GetCollectionOfJobsResponseSchema = z.object({}).catchall(z.unknown());
export type GetCollectionOfJobsResponse = z.infer<
	typeof GetCollectionOfJobsResponseSchema
>;

const GetCollectionOfPayrollInputSchema = z.object({}).optional();
export type GetCollectionOfPayrollInput = z.infer<
	typeof GetCollectionOfPayrollInputSchema
>;

const GetCollectionOfPayrollResponseSchema = z.object({}).catchall(z.unknown());
export type GetCollectionOfPayrollResponse = z.infer<
	typeof GetCollectionOfPayrollResponseSchema
>;

const GetCompanyInsiderTypesInputSchema = z.object({}).optional();
export type GetCompanyInsiderTypesInput = z.infer<
	typeof GetCompanyInsiderTypesInputSchema
>;

const GetCompanyInsiderTypesResponseSchema = z.object({}).catchall(z.unknown());
export type GetCompanyInsiderTypesResponse = z.infer<
	typeof GetCompanyInsiderTypesResponseSchema
>;

const GetContingentWorkerTypesInputSchema = z.object({}).optional();
export type GetContingentWorkerTypesInput = z.infer<
	typeof GetContingentWorkerTypesInputSchema
>;

const GetContingentWorkerTypesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetContingentWorkerTypesResponse = z.infer<
	typeof GetContingentWorkerTypesResponseSchema
>;

const GetCountryInfoInputSchema = z.object({}).optional();
export type GetCountryInfoInput = z.infer<typeof GetCountryInfoInputSchema>;

const GetCountryInfoResponseSchema = z.object({}).catchall(z.unknown());
export type GetCountryInfoResponse = z.infer<
	typeof GetCountryInfoResponseSchema
>;

const GetCurrenciesInputSchema = z.object({}).optional();
export type GetCurrenciesInput = z.infer<typeof GetCurrenciesInputSchema>;

const GetCurrenciesResponseSchema = z.object({}).catchall(z.unknown());
export type GetCurrenciesResponse = z.infer<typeof GetCurrenciesResponseSchema>;

const GetCurrentUserInputSchema = z.object({}).optional();
export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;

const GetCurrentUserResponseSchema = z.object({}).catchall(z.unknown());
export type GetCurrentUserResponse = z.infer<
	typeof GetCurrentUserResponseSchema
>;

const GetGrantsInputSchema = z.object({}).optional();
export type GetGrantsInput = z.infer<typeof GetGrantsInputSchema>;

const GetGrantsResponseSchema = z.object({}).catchall(z.unknown());
export type GetGrantsResponse = z.infer<typeof GetGrantsResponseSchema>;

const GetHeadcountOptionsInputSchema = z.object({}).optional();
export type GetHeadcountOptionsInput = z.infer<
	typeof GetHeadcountOptionsInputSchema
>;

const GetHeadcountOptionsResponseSchema = z.object({}).catchall(z.unknown());
export type GetHeadcountOptionsResponse = z.infer<
	typeof GetHeadcountOptionsResponseSchema
>;

const GetHistoryInstanceForWorkerInputSchema = z.object({}).optional();
export type GetHistoryInstanceForWorkerInput = z.infer<
	typeof GetHistoryInstanceForWorkerInputSchema
>;

const GetHistoryInstanceForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetHistoryInstanceForWorkerResponse = z.infer<
	typeof GetHistoryInstanceForWorkerResponseSchema
>;

const GetHistoryItemsForWorkerInputSchema = z.object({}).optional();
export type GetHistoryItemsForWorkerInput = z.infer<
	typeof GetHistoryItemsForWorkerInputSchema
>;

const GetHistoryItemsForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetHistoryItemsForWorkerResponse = z.infer<
	typeof GetHistoryItemsForWorkerResponseSchema
>;

const GetHolidayEventsInputSchema = z.object({}).optional();
export type GetHolidayEventsInput = z.infer<typeof GetHolidayEventsInputSchema>;

const GetHolidayEventsResponseSchema = z.object({}).catchall(z.unknown());
export type GetHolidayEventsResponse = z.infer<
	typeof GetHolidayEventsResponseSchema
>;

const GetInterviewInputSchema = z.object({}).optional();
export type GetInterviewInput = z.infer<typeof GetInterviewInputSchema>;

const GetInterviewResponseSchema = z.object({}).catchall(z.unknown());
export type GetInterviewResponse = z.infer<typeof GetInterviewResponseSchema>;

const GetInterviewFeedback2InputSchema = z.object({}).optional();
export type GetInterviewFeedback2Input = z.infer<
	typeof GetInterviewFeedback2InputSchema
>;

const GetInterviewFeedback2ResponseSchema = z.object({}).catchall(z.unknown());
export type GetInterviewFeedback2Response = z.infer<
	typeof GetInterviewFeedback2ResponseSchema
>;

const GetJobByIdInputSchema = z.object({}).optional();
export type GetJobByIdInput = z.infer<typeof GetJobByIdInputSchema>;

const GetJobByIdResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobByIdResponse = z.infer<typeof GetJobByIdResponseSchema>;

const GetJobChangeFrequenciesInputSchema = z.object({}).optional();
export type GetJobChangeFrequenciesInput = z.infer<
	typeof GetJobChangeFrequenciesInputSchema
>;

const GetJobChangeFrequenciesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangeFrequenciesResponse = z.infer<
	typeof GetJobChangeFrequenciesResponseSchema
>;

const GetJobChangeLocationInfoInputSchema = z.object({}).optional();
export type GetJobChangeLocationInfoInput = z.infer<
	typeof GetJobChangeLocationInfoInputSchema
>;

const GetJobChangeLocationInfoResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangeLocationInfoResponse = z.infer<
	typeof GetJobChangeLocationInfoResponseSchema
>;

const GetJobChangePositionInputSchema = z.object({}).optional();
export type GetJobChangePositionInput = z.infer<
	typeof GetJobChangePositionInputSchema
>;

const GetJobChangePositionResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobChangePositionResponse = z.infer<
	typeof GetJobChangePositionResponseSchema
>;

const GetJobChangeReasonInstanceInputSchema = z.object({}).optional();
export type GetJobChangeReasonInstanceInput = z.infer<
	typeof GetJobChangeReasonInstanceInputSchema
>;

const GetJobChangeReasonInstanceResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangeReasonInstanceResponse = z.infer<
	typeof GetJobChangeReasonInstanceResponseSchema
>;

const GetJobChangeReasonValuesInputSchema = z.object({}).optional();
export type GetJobChangeReasonValuesInput = z.infer<
	typeof GetJobChangeReasonValuesInputSchema
>;

const GetJobChangeReasonValuesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangeReasonValuesResponse = z.infer<
	typeof GetJobChangeReasonValuesResponseSchema
>;

const GetJobChangeReasonsInputSchema = z.object({}).optional();
export type GetJobChangeReasonsInput = z.infer<
	typeof GetJobChangeReasonsInputSchema
>;

const GetJobChangeReasonsResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobChangeReasonsResponse = z.infer<
	typeof GetJobChangeReasonsResponseSchema
>;

const GetJobChangesGroupTemplatesInputSchema = z.object({}).optional();
export type GetJobChangesGroupTemplatesInput = z.infer<
	typeof GetJobChangesGroupTemplatesInputSchema
>;

const GetJobChangesGroupTemplatesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangesGroupTemplatesResponse = z.infer<
	typeof GetJobChangesGroupTemplatesResponseSchema
>;

const GetJobChangesJobValuesInputSchema = z.object({}).optional();
export type GetJobChangesJobValuesInput = z.infer<
	typeof GetJobChangesJobValuesInputSchema
>;

const GetJobChangesJobValuesResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobChangesJobValuesResponse = z.infer<
	typeof GetJobChangesJobValuesResponseSchema
>;

const GetJobChangesWorkerValuesInputSchema = z.object({}).optional();
export type GetJobChangesWorkerValuesInput = z.infer<
	typeof GetJobChangesWorkerValuesInputSchema
>;

const GetJobChangesWorkerValuesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobChangesWorkerValuesResponse = z.infer<
	typeof GetJobChangesWorkerValuesResponseSchema
>;

const GetJobClassificationsInputSchema = z.object({}).optional();
export type GetJobClassificationsInput = z.infer<
	typeof GetJobClassificationsInputSchema
>;

const GetJobClassificationsResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobClassificationsResponse = z.infer<
	typeof GetJobClassificationsResponseSchema
>;

const GetJobPostingInputSchema = z.object({}).optional();
export type GetJobPostingInput = z.infer<typeof GetJobPostingInputSchema>;

const GetJobPostingResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobPostingResponse = z.infer<typeof GetJobPostingResponseSchema>;

const GetJobPostingQuestionnaireInputSchema = z.object({}).optional();
export type GetJobPostingQuestionnaireInput = z.infer<
	typeof GetJobPostingQuestionnaireInputSchema
>;

const GetJobPostingQuestionnaireResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobPostingQuestionnaireResponse = z.infer<
	typeof GetJobPostingQuestionnaireResponseSchema
>;

const GetJobProfilesValuesInputSchema = z.object({}).optional();
export type GetJobProfilesValuesInput = z.infer<
	typeof GetJobProfilesValuesInputSchema
>;

const GetJobProfilesValuesResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobProfilesValuesResponse = z.infer<
	typeof GetJobProfilesValuesResponseSchema
>;

const GetJobRequisitionValuesInputSchema = z.object({}).optional();
export type GetJobRequisitionValuesInput = z.infer<
	typeof GetJobRequisitionValuesInputSchema
>;

const GetJobRequisitionValuesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetJobRequisitionValuesResponse = z.infer<
	typeof GetJobRequisitionValuesResponseSchema
>;

const GetJobWorkspaceInputSchema = z.object({}).optional();
export type GetJobWorkspaceInput = z.infer<typeof GetJobWorkspaceInputSchema>;

const GetJobWorkspaceResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobWorkspaceResponse = z.infer<
	typeof GetJobWorkspaceResponseSchema
>;

const GetJobWorkspacesInputSchema = z.object({}).optional();
export type GetJobWorkspacesInput = z.infer<typeof GetJobWorkspacesInputSchema>;

const GetJobWorkspacesResponseSchema = z.object({}).catchall(z.unknown());
export type GetJobWorkspacesResponse = z.infer<
	typeof GetJobWorkspacesResponseSchema
>;

const GetLeaveStatusValuesInputSchema = z.object({}).optional();
export type GetLeaveStatusValuesInput = z.infer<
	typeof GetLeaveStatusValuesInputSchema
>;

const GetLeaveStatusValuesResponseSchema = z.object({}).catchall(z.unknown());
export type GetLeaveStatusValuesResponse = z.infer<
	typeof GetLeaveStatusValuesResponseSchema
>;

const GetMyJobPostingsInputSchema = z.object({}).optional();
export type GetMyJobPostingsInput = z.infer<typeof GetMyJobPostingsInputSchema>;

const GetMyJobPostingsResponseSchema = z.object({}).catchall(z.unknown());
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
	.catchall(z.unknown());
export type GetOrganizationAssignmentBusinessUnitsResponse = z.infer<
	typeof GetOrganizationAssignmentBusinessUnitsResponseSchema
>;

const GetOrganizationAssignmentCustomsInputSchema = z.object({}).optional();
export type GetOrganizationAssignmentCustomsInput = z.infer<
	typeof GetOrganizationAssignmentCustomsInputSchema
>;

const GetOrganizationAssignmentCustomsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetOrganizationAssignmentCustomsResponse = z.infer<
	typeof GetOrganizationAssignmentCustomsResponseSchema
>;

const GetOrganizationAssignmentFundsInputSchema = z.object({}).optional();
export type GetOrganizationAssignmentFundsInput = z.infer<
	typeof GetOrganizationAssignmentFundsInputSchema
>;

const GetOrganizationAssignmentFundsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetOrganizationAssignmentFundsResponse = z.infer<
	typeof GetOrganizationAssignmentFundsResponseSchema
>;

const GetOrganizationAssignmentRegionsInputSchema = z.object({}).optional();
export type GetOrganizationAssignmentRegionsInput = z.infer<
	typeof GetOrganizationAssignmentRegionsInputSchema
>;

const GetOrganizationAssignmentRegionsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetOrganizationAssignmentRegionsResponse = z.infer<
	typeof GetOrganizationAssignmentRegionsResponseSchema
>;

const GetOrganizationAssignmentWorkersInputSchema = z.object({}).optional();
export type GetOrganizationAssignmentWorkersInput = z.infer<
	typeof GetOrganizationAssignmentWorkersInputSchema
>;

const GetOrganizationAssignmentWorkersResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetOrganizationAssignmentWorkersResponse = z.infer<
	typeof GetOrganizationAssignmentWorkersResponseSchema
>;

const GetPayGroupByJobIdInputSchema = z.object({}).optional();
export type GetPayGroupByJobIdInput = z.infer<
	typeof GetPayGroupByJobIdInputSchema
>;

const GetPayGroupByJobIdResponseSchema = z.object({}).catchall(z.unknown());
export type GetPayGroupByJobIdResponse = z.infer<
	typeof GetPayGroupByJobIdResponseSchema
>;

const GetPaySlipInstancesForWorkerInputSchema = z.object({}).optional();
export type GetPaySlipInstancesForWorkerInput = z.infer<
	typeof GetPaySlipInstancesForWorkerInputSchema
>;

const GetPaySlipInstancesForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetPaySlipInstancesForWorkerResponse = z.infer<
	typeof GetPaySlipInstancesForWorkerResponseSchema
>;

const GetPaySlipsForWorkerInputSchema = z.object({}).optional();
export type GetPaySlipsForWorkerInput = z.infer<
	typeof GetPaySlipsForWorkerInputSchema
>;

const GetPaySlipsForWorkerResponseSchema = z.object({}).catchall(z.unknown());
export type GetPaySlipsForWorkerResponse = z.infer<
	typeof GetPaySlipsForWorkerResponseSchema
>;

const GetPayrollInputInstanceInputSchema = z.object({}).optional();
export type GetPayrollInputInstanceInput = z.infer<
	typeof GetPayrollInputInstanceInputSchema
>;

const GetPayrollInputInstanceResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetPayrollInputInstanceResponse = z.infer<
	typeof GetPayrollInputInstanceResponseSchema
>;

const GetProposedPositionValuesInputSchema = z.object({}).optional();
export type GetProposedPositionValuesInput = z.infer<
	typeof GetProposedPositionValuesInputSchema
>;

const GetProposedPositionValuesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetProposedPositionValuesResponse = z.infer<
	typeof GetProposedPositionValuesResponseSchema
>;

const GetProspectInputSchema = z.object({}).optional();
export type GetProspectInput = z.infer<typeof GetProspectInputSchema>;

const GetProspectResponseSchema = z.object({}).catchall(z.unknown());
export type GetProspectResponse = z.infer<typeof GetProspectResponseSchema>;

const GetProspectEducationsInputSchema = z.object({}).optional();
export type GetProspectEducationsInput = z.infer<
	typeof GetProspectEducationsInputSchema
>;

const GetProspectEducationsResponseSchema = z.object({}).catchall(z.unknown());
export type GetProspectEducationsResponse = z.infer<
	typeof GetProspectEducationsResponseSchema
>;

const GetProspectExperiencesInputSchema = z.object({}).optional();
export type GetProspectExperiencesInput = z.infer<
	typeof GetProspectExperiencesInputSchema
>;

const GetProspectExperiencesResponseSchema = z.object({}).catchall(z.unknown());
export type GetProspectExperiencesResponse = z.infer<
	typeof GetProspectExperiencesResponseSchema
>;

const GetProspectResumeAttachmentsInputSchema = z.object({}).optional();
export type GetProspectResumeAttachmentsInput = z.infer<
	typeof GetProspectResumeAttachmentsInputSchema
>;

const GetProspectResumeAttachmentsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetProspectResumeAttachmentsResponse = z.infer<
	typeof GetProspectResumeAttachmentsResponseSchema
>;

const GetProspectSkillsInputSchema = z.object({}).optional();
export type GetProspectSkillsInput = z.infer<
	typeof GetProspectSkillsInputSchema
>;

const GetProspectSkillsResponseSchema = z.object({}).catchall(z.unknown());
export type GetProspectSkillsResponse = z.infer<
	typeof GetProspectSkillsResponseSchema
>;

const GetSupervisoryOrgValuesInputSchema = z.object({}).optional();
export type GetSupervisoryOrgValuesInput = z.infer<
	typeof GetSupervisoryOrgValuesInputSchema
>;

const GetSupervisoryOrgValuesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetSupervisoryOrgValuesResponse = z.infer<
	typeof GetSupervisoryOrgValuesResponseSchema
>;

const GetTimeOffEntriesForWorkerInputSchema = z.object({}).optional();
export type GetTimeOffEntriesForWorkerInput = z.infer<
	typeof GetTimeOffEntriesForWorkerInputSchema
>;

const GetTimeOffEntriesForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetTimeOffEntriesForWorkerResponse = z.infer<
	typeof GetTimeOffEntriesForWorkerResponseSchema
>;

const GetTimeOffPlansForWorkerInputSchema = z.object({}).optional();
export type GetTimeOffPlansForWorkerInput = z.infer<
	typeof GetTimeOffPlansForWorkerInputSchema
>;

const GetTimeOffPlansForWorkerResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetTimeOffPlansForWorkerResponse = z.infer<
	typeof GetTimeOffPlansForWorkerResponseSchema
>;

const GetTimeOffStatusValuesInputSchema = z.object({}).optional();
export type GetTimeOffStatusValuesInput = z.infer<
	typeof GetTimeOffStatusValuesInputSchema
>;

const GetTimeOffStatusValuesResponseSchema = z.object({}).catchall(z.unknown());
export type GetTimeOffStatusValuesResponse = z.infer<
	typeof GetTimeOffStatusValuesResponseSchema
>;

const GetTimeTypesInputSchema = z.object({}).optional();
export type GetTimeTypesInput = z.infer<typeof GetTimeTypesInputSchema>;

const GetTimeTypesResponseSchema = z.object({}).catchall(z.unknown());
export type GetTimeTypesResponse = z.infer<typeof GetTimeTypesResponseSchema>;

const GetWorkStudyAwardsInputSchema = z.object({}).optional();
export type GetWorkStudyAwardsInput = z.infer<
	typeof GetWorkStudyAwardsInputSchema
>;

const GetWorkStudyAwardsResponseSchema = z.object({}).catchall(z.unknown());
export type GetWorkStudyAwardsResponse = z.infer<
	typeof GetWorkStudyAwardsResponseSchema
>;

const GetWorkerBusinessTitleChangesInputSchema = z.object({}).optional();
export type GetWorkerBusinessTitleChangesInput = z.infer<
	typeof GetWorkerBusinessTitleChangesInputSchema
>;

const GetWorkerBusinessTitleChangesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerBusinessTitleChangesResponse = z.infer<
	typeof GetWorkerBusinessTitleChangesResponseSchema
>;

const GetWorkerEligibleAbsenceTypesInputSchema = z.object({}).optional();
export type GetWorkerEligibleAbsenceTypesInput = z.infer<
	typeof GetWorkerEligibleAbsenceTypesInputSchema
>;

const GetWorkerEligibleAbsenceTypesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerEligibleAbsenceTypesResponse = z.infer<
	typeof GetWorkerEligibleAbsenceTypesResponseSchema
>;

const GetWorkerInfoInputSchema = z.object({}).optional();
export type GetWorkerInfoInput = z.infer<typeof GetWorkerInfoInputSchema>;

const GetWorkerInfoResponseSchema = z.object({}).catchall(z.unknown());
export type GetWorkerInfoResponse = z.infer<typeof GetWorkerInfoResponseSchema>;

const GetWorkerLeavesOfAbsenceInputSchema = z.object({}).optional();
export type GetWorkerLeavesOfAbsenceInput = z.infer<
	typeof GetWorkerLeavesOfAbsenceInputSchema
>;

const GetWorkerLeavesOfAbsenceResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerLeavesOfAbsenceResponse = z.infer<
	typeof GetWorkerLeavesOfAbsenceResponseSchema
>;

const GetWorkerServiceDatesInputSchema = z.object({}).optional();
export type GetWorkerServiceDatesInput = z.infer<
	typeof GetWorkerServiceDatesInputSchema
>;

const GetWorkerServiceDatesResponseSchema = z.object({}).catchall(z.unknown());
export type GetWorkerServiceDatesResponse = z.infer<
	typeof GetWorkerServiceDatesResponseSchema
>;

const GetWorkerStaffingInformationInputSchema = z.object({}).optional();
export type GetWorkerStaffingInformationInput = z.infer<
	typeof GetWorkerStaffingInformationInputSchema
>;

const GetWorkerStaffingInformationResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerStaffingInformationResponse = z.infer<
	typeof GetWorkerStaffingInformationResponseSchema
>;

const GetWorkerTimeOffDetailsInputSchema = z.object({}).optional();
export type GetWorkerTimeOffDetailsInput = z.infer<
	typeof GetWorkerTimeOffDetailsInputSchema
>;

const GetWorkerTimeOffDetailsResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerTimeOffDetailsResponse = z.infer<
	typeof GetWorkerTimeOffDetailsResponseSchema
>;

const GetWorkerTypesInputSchema = z.object({}).optional();
export type GetWorkerTypesInput = z.infer<typeof GetWorkerTypesInputSchema>;

const GetWorkerTypesResponseSchema = z.object({}).catchall(z.unknown());
export type GetWorkerTypesResponse = z.infer<
	typeof GetWorkerTypesResponseSchema
>;

const GetWorkerValidTimeOffDatesInputSchema = z.object({}).optional();
export type GetWorkerValidTimeOffDatesInput = z.infer<
	typeof GetWorkerValidTimeOffDatesInputSchema
>;

const GetWorkerValidTimeOffDatesResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkerValidTimeOffDatesResponse = z.infer<
	typeof GetWorkerValidTimeOffDatesResponseSchema
>;

const GetWorkersCollectionStaffingInputSchema = z.object({}).optional();
export type GetWorkersCollectionStaffingInput = z.infer<
	typeof GetWorkersCollectionStaffingInputSchema
>;

const GetWorkersCollectionStaffingResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type GetWorkersCollectionStaffingResponse = z.infer<
	typeof GetWorkersCollectionStaffingResponseSchema
>;

const GetWorkspaceInstancesInputSchema = z.object({}).optional();
export type GetWorkspaceInstancesInput = z.infer<
	typeof GetWorkspaceInstancesInputSchema
>;

const GetWorkspaceInstancesResponseSchema = z.object({}).catchall(z.unknown());
export type GetWorkspaceInstancesResponse = z.infer<
	typeof GetWorkspaceInstancesResponseSchema
>;

const ListBalancesInputSchema = z.object({}).optional();
export type ListBalancesInput = z.infer<typeof ListBalancesInputSchema>;

const ListBalancesResponseSchema = z.object({}).catchall(z.unknown());
export type ListBalancesResponse = z.infer<typeof ListBalancesResponseSchema>;

const ListCountriesInputSchema = z.object({}).optional();
export type ListCountriesInput = z.infer<typeof ListCountriesInputSchema>;

const ListCountriesResponseSchema = z.object({}).catchall(z.unknown());
export type ListCountriesResponse = z.infer<typeof ListCountriesResponseSchema>;

const ListInterviewsInputSchema = z.object({}).optional();
export type ListInterviewsInput = z.infer<typeof ListInterviewsInputSchema>;

const ListInterviewsResponseSchema = z.object({}).catchall(z.unknown());
export type ListInterviewsResponse = z.infer<
	typeof ListInterviewsResponseSchema
>;

const ListJobPostingsInputSchema = z.object({}).optional();
export type ListJobPostingsInput = z.infer<typeof ListJobPostingsInputSchema>;

const ListJobPostingsResponseSchema = z.object({}).catchall(z.unknown());
export type ListJobPostingsResponse = z.infer<
	typeof ListJobPostingsResponseSchema
>;

const ListJobsInputSchema = z.object({}).optional();
export type ListJobsInput = z.infer<typeof ListJobsInputSchema>;

const ListJobsResponseSchema = z.object({}).catchall(z.unknown());
export type ListJobsResponse = z.infer<typeof ListJobsResponseSchema>;

const RetrieveWorkerLeaveOfAbsenceSubresourceInputSchema = z
	.object({})
	.optional();
export type RetrieveWorkerLeaveOfAbsenceSubresourceInput = z.infer<
	typeof RetrieveWorkerLeaveOfAbsenceSubresourceInputSchema
>;

const RetrieveWorkerLeaveOfAbsenceSubresourceResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type RetrieveWorkerLeaveOfAbsenceSubresourceResponse = z.infer<
	typeof RetrieveWorkerLeaveOfAbsenceSubresourceResponseSchema
>;

const UpdateAnExistingPayrollInputSchema = z.object({}).optional();
export type UpdateAnExistingPayrollInput = z.infer<
	typeof UpdateAnExistingPayrollInputSchema
>;

const UpdateAnExistingPayrollResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type UpdateAnExistingPayrollResponse = z.infer<
	typeof UpdateAnExistingPayrollResponseSchema
>;

const UpdateJobChangeBusinessTitleInputSchema = z.object({}).optional();
export type UpdateJobChangeBusinessTitleInput = z.infer<
	typeof UpdateJobChangeBusinessTitleInputSchema
>;

const UpdateJobChangeBusinessTitleResponseSchema = z
	.object({})
	.catchall(z.unknown());
export type UpdateJobChangeBusinessTitleResponse = z.infer<
	typeof UpdateJobChangeBusinessTitleResponseSchema
>;

const UpdateMessageTemplateByIdInputSchema = z.object({}).optional();
export type UpdateMessageTemplateByIdInput = z.infer<
	typeof UpdateMessageTemplateByIdInputSchema
>;

const UpdateMessageTemplateByIdResponseSchema = z
	.object({})
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
