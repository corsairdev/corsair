import { z } from 'zod';

// Approve Calibration Session
const ApproveCalibrationSessionInputSchema = z.object({
	session_id: z.string(),
});
export type ApproveCalibrationSessionInput = z.infer<
	typeof ApproveCalibrationSessionInputSchema
>;

const ApproveCalibrationSessionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type ApproveCalibrationSessionResponse = z.infer<
	typeof ApproveCalibrationSessionResponseSchema
>;

// Get Calibration Session By ID
const GetCalibrationSessionByIdInputSchema = z.object({
	session_id: z.string(),
	select: z.string().optional(),
	expand: z.string().optional(),
});
export type GetCalibrationSessionByIdInput = z.infer<
	typeof GetCalibrationSessionByIdInputSchema
>;

const GetCalibrationSessionByIdResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCalibrationSessionByIdResponse = z.infer<
	typeof GetCalibrationSessionByIdResponseSchema
>;

// Get Calibration Sessions
const GetCalibrationSessionsInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetCalibrationSessionsInput = z.infer<
	typeof GetCalibrationSessionsInputSchema
>;

const GetCalibrationSessionsResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCalibrationSessionsResponse = z.infer<
	typeof GetCalibrationSessionsResponseSchema
>;

// Get Calibration Session Metadata
const GetOdataMetadataCalibSessionServiceInputSchema = z.object({}).optional();
export type GetOdataMetadataCalibSessionServiceInput = z.infer<
	typeof GetOdataMetadataCalibSessionServiceInputSchema
>;

const GetOdataMetadataCalibSessionServiceResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOdataMetadataCalibSessionServiceResponse = z.infer<
	typeof GetOdataMetadataCalibSessionServiceResponseSchema
>;

// Get Calibration Subject By ID
const GetCalibrationSubjectByIdInputSchema = z.object({
	subject_id: z.string(),
	select: z.string().optional(),
	expand: z.string().optional(),
});
export type GetCalibrationSubjectByIdInput = z.infer<
	typeof GetCalibrationSubjectByIdInputSchema
>;

const GetCalibrationSubjectByIdResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCalibrationSubjectByIdResponse = z.infer<
	typeof GetCalibrationSubjectByIdResponseSchema
>;

// Get Calibration Subject Ratings
const GetCalibrationSubjectRatingsInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
	session_id: z.string(),
});
export type GetCalibrationSubjectRatingsInput = z.infer<
	typeof GetCalibrationSubjectRatingsInputSchema
>;

const GetCalibrationSubjectRatingsResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCalibrationSubjectRatingsResponse = z.infer<
	typeof GetCalibrationSubjectRatingsResponseSchema
>;

// Update Calibration Subject Ratings
const UpdateCalibrationSubjectRatingsInputSchema = z.object({
	subject_id: z.string(),
	body: z.record(z.string(), z.unknown()),
});
export type UpdateCalibrationSubjectRatingsInput = z.infer<
	typeof UpdateCalibrationSubjectRatingsInputSchema
>;

const UpdateCalibrationSubjectRatingsResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type UpdateCalibrationSubjectRatingsResponse = z.infer<
	typeof UpdateCalibrationSubjectRatingsResponseSchema
>;

// Create Onboardee
const CreateOnboardeeInputSchema = z.object({
	body: z.record(z.string(), z.unknown()),
});
export type CreateOnboardeeInput = z.infer<typeof CreateOnboardeeInputSchema>;

const CreateOnboardeeResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type CreateOnboardeeResponse = z.infer<
	typeof CreateOnboardeeResponseSchema
>;

// Get Onboarding 2.0 Processes
const GetOnb2ProcessInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetOnb2ProcessInput = z.infer<typeof GetOnb2ProcessInputSchema>;

const GetOnb2ProcessResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOnb2ProcessResponse = z.infer<
	typeof GetOnb2ProcessResponseSchema
>;

// Get Onboarding Additional Services Metadata
const GetOdataMetadataOnboardingAddlInputSchema = z.object({}).optional();
export type GetOdataMetadataOnboardingAddlInput = z.infer<
	typeof GetOdataMetadataOnboardingAddlInputSchema
>;

const GetOdataMetadataOnboardingAddlResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOdataMetadataOnboardingAddlResponse = z.infer<
	typeof GetOdataMetadataOnboardingAddlResponseSchema
>;

// Update Username Post Hiring
const UpdateInternalUsernameNewHiresAfterInputSchema = z.object({
	user_id: z.string(),
	new_username: z.string(),
});
export type UpdateInternalUsernameNewHiresAfterInput = z.infer<
	typeof UpdateInternalUsernameNewHiresAfterInputSchema
>;

const UpdateInternalUsernameNewHiresAfterResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type UpdateInternalUsernameNewHiresAfterResponse = z.infer<
	typeof UpdateInternalUsernameNewHiresAfterResponseSchema
>;

// Create a Feedback Request
const CreateAFeedbackRequestInputSchema = z.object({
	body: z.record(z.string(), z.unknown()),
});
export type CreateAFeedbackRequestInput = z.infer<
	typeof CreateAFeedbackRequestInputSchema
>;

const CreateAFeedbackRequestResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type CreateAFeedbackRequestResponse = z.infer<
	typeof CreateAFeedbackRequestResponseSchema
>;

// Get Feedback Records
const GetFeedbackRecordsServiceAvailableInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFeedbackRecordsServiceAvailableInput = z.infer<
	typeof GetFeedbackRecordsServiceAvailableInputSchema
>;

const GetFeedbackRecordsServiceAvailableResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFeedbackRecordsServiceAvailableResponse = z.infer<
	typeof GetFeedbackRecordsServiceAvailableResponseSchema
>;

// Get Pending Feedback Requests
const GetPendingFeedbackRequestsFeedbackInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetPendingFeedbackRequestsFeedbackInput = z.infer<
	typeof GetPendingFeedbackRequestsFeedbackInputSchema
>;

const GetPendingFeedbackRequestsFeedbackResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPendingFeedbackRequestsFeedbackResponse = z.infer<
	typeof GetPendingFeedbackRequestsFeedbackResponseSchema
>;

// Give Feedback or Respond to Feedback Request
const GiveFeedbackOrRespondToAFeedbackRequestInputSchema = z.object({
	body: z.record(z.string(), z.unknown()),
});
export type GiveFeedbackOrRespondToAFeedbackRequestInput = z.infer<
	typeof GiveFeedbackOrRespondToAFeedbackRequestInputSchema
>;

const GiveFeedbackOrRespondToAFeedbackRequestResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GiveFeedbackOrRespondToAFeedbackRequestResponse = z.infer<
	typeof GiveFeedbackOrRespondToAFeedbackRequestResponseSchema
>;

// Refresh Metadata for Continuous Feedback
const RefreshMetadataContFeedbackServiceInputSchema = z.object({}).optional();
export type RefreshMetadataContFeedbackServiceInput = z.infer<
	typeof RefreshMetadataContFeedbackServiceInputSchema
>;

const RefreshMetadataContFeedbackServiceResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type RefreshMetadataContFeedbackServiceResponse = z.infer<
	typeof RefreshMetadataContFeedbackServiceResponseSchema
>;

// Create or Update Successor Nomination
const CreateUpdateSuccessorNominationInputSchema = z.object({
	body: z.record(z.string(), z.unknown()),
});
export type CreateUpdateSuccessorNominationInput = z.infer<
	typeof CreateUpdateSuccessorNominationInputSchema
>;

const CreateUpdateSuccessorNominationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type CreateUpdateSuccessorNominationResponse = z.infer<
	typeof CreateUpdateSuccessorNominationResponseSchema
>;

// Delete Nomination
const DeleteNominationPositionTalentPoolInputSchema = z.object({
	nomination_id: z.string(),
});
export type DeleteNominationPositionTalentPoolInput = z.infer<
	typeof DeleteNominationPositionTalentPoolInputSchema
>;

const DeleteNominationPositionTalentPoolResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type DeleteNominationPositionTalentPoolResponse = z.infer<
	typeof DeleteNominationPositionTalentPoolResponseSchema
>;

// Get Nomination Service Metadata
const GetOdataMetadataForNominationServiceInputSchema = z.object({}).optional();
export type GetOdataMetadataForNominationServiceInput = z.infer<
	typeof GetOdataMetadataForNominationServiceInputSchema
>;

const GetOdataMetadataForNominationServiceResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOdataMetadataForNominationServiceResponse = z.infer<
	typeof GetOdataMetadataForNominationServiceResponseSchema
>;

// Get Talent Pool
const GetTalentPoolInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetTalentPoolInput = z.infer<typeof GetTalentPoolInputSchema>;

const GetTalentPoolResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetTalentPoolResponse = z.infer<typeof GetTalentPoolResponseSchema>;

// Get Application Interview
const GetApplicationInterviewInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetApplicationInterviewInput = z.infer<
	typeof GetApplicationInterviewInputSchema
>;

const GetApplicationInterviewResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetApplicationInterviewResponse = z.infer<
	typeof GetApplicationInterviewResponseSchema
>;

// Get Interview Overall Assessment
const GetInterviewOverallAssessmentInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetInterviewOverallAssessmentInput = z.infer<
	typeof GetInterviewOverallAssessmentInputSchema
>;

const GetInterviewOverallAssessmentResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetInterviewOverallAssessmentResponse = z.infer<
	typeof GetInterviewOverallAssessmentResponseSchema
>;

// Get Job Application
const GetJobApplicationInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetJobApplicationInput = z.infer<
	typeof GetJobApplicationInputSchema
>;

const GetJobApplicationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetJobApplicationResponse = z.infer<
	typeof GetJobApplicationResponseSchema
>;

// Get Job Requisition
const GetJobRequisitionInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetJobRequisitionInput = z.infer<
	typeof GetJobRequisitionInputSchema
>;

const GetJobRequisitionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetJobRequisitionResponse = z.infer<
	typeof GetJobRequisitionResponseSchema
>;

// Get Job Requisition Screening Questions
const GetJobReqScreeningQuestionInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetJobReqScreeningQuestionInput = z.infer<
	typeof GetJobReqScreeningQuestionInputSchema
>;

const GetJobReqScreeningQuestionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetJobReqScreeningQuestionResponse = z.infer<
	typeof GetJobReqScreeningQuestionResponseSchema
>;

// List Candidates
const ListCandidatesInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type ListCandidatesInput = z.infer<typeof ListCandidatesInputSchema>;

const ListCandidatesResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type ListCandidatesResponse = z.infer<
	typeof ListCandidatesResponseSchema
>;

// Get FOBusinessUnit
const GetFoBusinessUnitInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoBusinessUnitInput = z.infer<
	typeof GetFoBusinessUnitInputSchema
>;

const GetFoBusinessUnitResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoBusinessUnitResponse = z.infer<
	typeof GetFoBusinessUnitResponseSchema
>;

// Get FOCompany Records
const GetFoCompanyInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoCompanyInput = z.infer<typeof GetFoCompanyInputSchema>;

const GetFoCompanyResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoCompanyResponse = z.infer<typeof GetFoCompanyResponseSchema>;

// Get Foundation Object Cost Centers
const GetFoCostCenterInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoCostCenterInput = z.infer<typeof GetFoCostCenterInputSchema>;

const GetFoCostCenterResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoCostCenterResponse = z.infer<
	typeof GetFoCostCenterResponseSchema
>;

// Get FODepartment Records
const GetFoDepartmentInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoDepartmentInput = z.infer<typeof GetFoDepartmentInputSchema>;

const GetFoDepartmentResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoDepartmentResponse = z.infer<
	typeof GetFoDepartmentResponseSchema
>;

// Get Foundation Object Job Codes
const GetFoJobCodeInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoJobCodeInput = z.infer<typeof GetFoJobCodeInputSchema>;

const GetFoJobCodeResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoJobCodeResponse = z.infer<typeof GetFoJobCodeResponseSchema>;

// Get Job Functions
const GetFoJobFunctionInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoJobFunctionInput = z.infer<typeof GetFoJobFunctionInputSchema>;

const GetFoJobFunctionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoJobFunctionResponse = z.infer<
	typeof GetFoJobFunctionResponseSchema
>;

// Get Foundation Object Location
const GetFoLocationInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoLocationInput = z.infer<typeof GetFoLocationInputSchema>;

const GetFoLocationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoLocationResponse = z.infer<typeof GetFoLocationResponseSchema>;

// Get FOPayGroup
const GetFoPayGroupInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFoPayGroupInput = z.infer<typeof GetFoPayGroupInputSchema>;

const GetFoPayGroupResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFoPayGroupResponse = z.infer<typeof GetFoPayGroupResponseSchema>;

// Get Position
const GetPositionInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetPositionInput = z.infer<typeof GetPositionInputSchema>;

const GetPositionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPositionResponse = z.infer<typeof GetPositionResponseSchema>;

// Get Custom MDF Object
const GetCustomMdfObjectInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
	custom_object: z.string(),
});
export type GetCustomMdfObjectInput = z.infer<
	typeof GetCustomMdfObjectInputSchema
>;

const GetCustomMdfObjectResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCustomMdfObjectResponse = z.infer<
	typeof GetCustomMdfObjectResponseSchema
>;

// Get Picklist
const GetPicklistInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetPicklistInput = z.infer<typeof GetPicklistInputSchema>;

const GetPicklistResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPicklistResponse = z.infer<typeof GetPicklistResponseSchema>;

// Get Picklist Option
const GetPicklistOptionInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetPicklistOptionInput = z.infer<
	typeof GetPicklistOptionInputSchema
>;

const GetPicklistOptionResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPicklistOptionResponse = z.infer<
	typeof GetPicklistOptionResponseSchema
>;

// Get Current User
const GetCurrentUserInputSchema = z.object({
	select: z.string().optional(),
	expand: z.string().optional(),
});
export type GetCurrentUserInput = z.infer<typeof GetCurrentUserInputSchema>;

const GetCurrentUserResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCurrentUserResponse = z.infer<
	typeof GetCurrentUserResponseSchema
>;

// Get User Entity Metadata
const GetOdataUserMetadataInputSchema = z.object({}).optional();
export type GetOdataUserMetadataInput = z.infer<
	typeof GetOdataUserMetadataInputSchema
>;

const GetOdataUserMetadataResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOdataUserMetadataResponse = z.infer<
	typeof GetOdataUserMetadataResponseSchema
>;

// List Users
const ListUsersInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;

const ListUsersResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

// Get Person by ID
const GetPerPersonByIdInputSchema = z.object({
	person_id_external: z.string(),
	select: z.string().optional(),
	expand: z.string().optional(),
});
export type GetPerPersonByIdInput = z.infer<typeof GetPerPersonByIdInputSchema>;

const GetPerPersonByIdResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPerPersonByIdResponse = z.infer<
	typeof GetPerPersonByIdResponseSchema
>;

// List Person Records
const ListPerPersonInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type ListPerPersonInput = z.infer<typeof ListPerPersonInputSchema>;

const ListPerPersonResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type ListPerPersonResponse = z.infer<typeof ListPerPersonResponseSchema>;

// Get Personal Information Records
const GetPerPersonalInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetPerPersonalInput = z.infer<typeof GetPerPersonalInputSchema>;

const GetPerPersonalResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetPerPersonalResponse = z.infer<
	typeof GetPerPersonalResponseSchema
>;

// Get Background Education
const GetBackgroundEducationInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetBackgroundEducationInput = z.infer<
	typeof GetBackgroundEducationInputSchema
>;

const GetBackgroundEducationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetBackgroundEducationResponse = z.infer<
	typeof GetBackgroundEducationResponseSchema
>;

// Get Background Mobility
const GetBackgroundMobilityInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetBackgroundMobilityInput = z.infer<
	typeof GetBackgroundMobilityInputSchema
>;

const GetBackgroundMobilityResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetBackgroundMobilityResponse = z.infer<
	typeof GetBackgroundMobilityResponseSchema
>;

// List Employee Employment Records
const ListEmpEmploymentInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type ListEmpEmploymentInput = z.infer<
	typeof ListEmpEmploymentInputSchema
>;

const ListEmpEmploymentResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type ListEmpEmploymentResponse = z.infer<
	typeof ListEmpEmploymentResponseSchema
>;

// Get Employee Employment Termination
const GetEmpEmploymentTerminationInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetEmpEmploymentTerminationInput = z.infer<
	typeof GetEmpEmploymentTerminationInputSchema
>;

const GetEmpEmploymentTerminationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetEmpEmploymentTerminationResponse = z.infer<
	typeof GetEmpEmploymentTerminationResponseSchema
>;

// Get Work Order
const GetWorkOrderInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetWorkOrderInput = z.infer<typeof GetWorkOrderInputSchema>;

const GetWorkOrderResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetWorkOrderResponse = z.infer<typeof GetWorkOrderResponseSchema>;

// Get Recurring Pay Components
const GetEmpPayCompRecurringInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetEmpPayCompRecurringInput = z.infer<
	typeof GetEmpPayCompRecurringInputSchema
>;

const GetEmpPayCompRecurringResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetEmpPayCompRecurringResponse = z.infer<
	typeof GetEmpPayCompRecurringResponseSchema
>;

// Get Non-Recurring Pay Components
const GetEmpPayCompNonRecurringInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetEmpPayCompNonRecurringInput = z.infer<
	typeof GetEmpPayCompNonRecurringInputSchema
>;

const GetEmpPayCompNonRecurringResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetEmpPayCompNonRecurringResponse = z.infer<
	typeof GetEmpPayCompNonRecurringResponseSchema
>;

// Get Goal Plan Template
const GetGoalPlanTemplateInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetGoalPlanTemplateInput = z.infer<
	typeof GetGoalPlanTemplateInputSchema
>;

const GetGoalPlanTemplateResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetGoalPlanTemplateResponse = z.infer<
	typeof GetGoalPlanTemplateResponseSchema
>;

// Get Goals By Plan
const GetGoalsByPlanInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
	goal_plan_id: z.string(),
});
export type GetGoalsByPlanInput = z.infer<typeof GetGoalsByPlanInputSchema>;

const GetGoalsByPlanResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetGoalsByPlanResponse = z.infer<
	typeof GetGoalsByPlanResponseSchema
>;

// Get Form Content
const GetFormContentInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetFormContentInput = z.infer<typeof GetFormContentInputSchema>;

const GetFormContentResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetFormContentResponse = z.infer<
	typeof GetFormContentResponseSchema
>;

// Create Learning Activities Bulk
const CreateLearningActivitiesBulkInputSchema = z.object({
	body: z.record(z.string(), z.unknown()),
});
export type CreateLearningActivitiesBulkInput = z.infer<
	typeof CreateLearningActivitiesBulkInputSchema
>;

const CreateLearningActivitiesBulkResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type CreateLearningActivitiesBulkResponse = z.infer<
	typeof CreateLearningActivitiesBulkResponseSchema
>;

// Get CDP Learning Metadata
const GetCdpLearningMetadataInputSchema = z.object({}).optional();
export type GetCdpLearningMetadataInput = z.infer<
	typeof GetCdpLearningMetadataInputSchema
>;

const GetCdpLearningMetadataResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetCdpLearningMetadataResponse = z.infer<
	typeof GetCdpLearningMetadataResponseSchema
>;

// Refresh CDP Learning Metadata
const RefreshCdpLearningMetadataInputSchema = z.object({}).optional();
export type RefreshCdpLearningMetadataInput = z.infer<
	typeof RefreshCdpLearningMetadataInputSchema
>;

const RefreshCdpLearningMetadataResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type RefreshCdpLearningMetadataResponse = z.infer<
	typeof RefreshCdpLearningMetadataResponseSchema
>;

// Get Employee Time
const GetEmployeeTimeInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetEmployeeTimeInput = z.infer<typeof GetEmployeeTimeInputSchema>;

const GetEmployeeTimeResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetEmployeeTimeResponse = z.infer<
	typeof GetEmployeeTimeResponseSchema
>;

// Get Employee Timesheet
const GetEmployeeTimesheetInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetEmployeeTimesheetInput = z.infer<
	typeof GetEmployeeTimesheetInputSchema
>;

const GetEmployeeTimesheetResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetEmployeeTimesheetResponse = z.infer<
	typeof GetEmployeeTimesheetResponseSchema
>;

// Get Temporary Time Information
const GetTemporaryTimeInformationInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetTemporaryTimeInformationInput = z.infer<
	typeof GetTemporaryTimeInformationInputSchema
>;

const GetTemporaryTimeInformationResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetTemporaryTimeInformationResponse = z.infer<
	typeof GetTemporaryTimeInformationResponseSchema
>;

// Get Time Account Snapshot
const GetTimeAccountSnapshotInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type GetTimeAccountSnapshotInput = z.infer<
	typeof GetTimeAccountSnapshotInputSchema
>;

const GetTimeAccountSnapshotResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetTimeAccountSnapshotResponse = z.infer<
	typeof GetTimeAccountSnapshotResponseSchema
>;

// Get Clock In/Out Integration Metadata
const GetOdataMetadataClockInclockOutInputSchema = z.object({}).optional();
export type GetOdataMetadataClockInclockOutInput = z.infer<
	typeof GetOdataMetadataClockInclockOutInputSchema
>;

const GetOdataMetadataClockInclockOutResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type GetOdataMetadataClockInclockOutResponse = z.infer<
	typeof GetOdataMetadataClockInclockOutResponseSchema
>;

// Query All Available Clock In/Clock Out Groups
const QueryAllAvailableClockClockOutInputSchema = z.object({
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().optional(),
	skip: z.number().int().optional(),
	orderby: z.string().optional(),
});
export type QueryAllAvailableClockClockOutInput = z.infer<
	typeof QueryAllAvailableClockClockOutInputSchema
>;

const QueryAllAvailableClockClockOutResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type QueryAllAvailableClockClockOutResponse = z.infer<
	typeof QueryAllAvailableClockClockOutResponseSchema
>;

// Query Clock In/Clock Out Group By Code
const QueryClockClockOutGroupCodeTimeInputSchema = z.object({
	code: z.string(),
	select: z.string().optional(),
	expand: z.string().optional(),
});
export type QueryClockClockOutGroupCodeTimeInput = z.infer<
	typeof QueryClockClockOutGroupCodeTimeInputSchema
>;

const QueryClockClockOutGroupCodeTimeResponseSchema = z
	.object({
		d: z
			.object({
				results: z.array(z.unknown()).optional(),
				id: z.string().optional(),
				status: z.string().optional(),
			})
			.catchall(z.unknown())
			.optional(),
	})
	.passthrough();
export type QueryClockClockOutGroupCodeTimeResponse = z.infer<
	typeof QueryClockClockOutGroupCodeTimeResponseSchema
>;

export const SapsuccessfactorsEndpointInputSchemas = {
	approveCalibrationSession: ApproveCalibrationSessionInputSchema,
	getCalibrationSessionById: GetCalibrationSessionByIdInputSchema,
	getCalibrationSessions: GetCalibrationSessionsInputSchema,
	getOdataMetadataCalibSessionService:
		GetOdataMetadataCalibSessionServiceInputSchema,
	getCalibrationSubjectById: GetCalibrationSubjectByIdInputSchema,
	getCalibrationSubjectRatings: GetCalibrationSubjectRatingsInputSchema,
	updateCalibrationSubjectRatings: UpdateCalibrationSubjectRatingsInputSchema,
	createOnboardee: CreateOnboardeeInputSchema,
	getOnb2Process: GetOnb2ProcessInputSchema,
	getOdataMetadataOnboardingAddl: GetOdataMetadataOnboardingAddlInputSchema,
	updateInternalUsernameNewHiresAfter:
		UpdateInternalUsernameNewHiresAfterInputSchema,
	createAFeedbackRequest: CreateAFeedbackRequestInputSchema,
	getFeedbackRecordsServiceAvailable:
		GetFeedbackRecordsServiceAvailableInputSchema,
	getPendingFeedbackRequestsFeedback:
		GetPendingFeedbackRequestsFeedbackInputSchema,
	giveFeedbackOrRespondToAFeedbackRequest:
		GiveFeedbackOrRespondToAFeedbackRequestInputSchema,
	refreshMetadataContFeedbackService:
		RefreshMetadataContFeedbackServiceInputSchema,
	createUpdateSuccessorNomination: CreateUpdateSuccessorNominationInputSchema,
	deleteNominationPositionTalentPool:
		DeleteNominationPositionTalentPoolInputSchema,
	getOdataMetadataForNominationService:
		GetOdataMetadataForNominationServiceInputSchema,
	getTalentPool: GetTalentPoolInputSchema,
	getApplicationInterview: GetApplicationInterviewInputSchema,
	getInterviewOverallAssessment: GetInterviewOverallAssessmentInputSchema,
	getJobApplication: GetJobApplicationInputSchema,
	getJobRequisition: GetJobRequisitionInputSchema,
	getJobReqScreeningQuestion: GetJobReqScreeningQuestionInputSchema,
	listCandidates: ListCandidatesInputSchema,
	getFoBusinessUnit: GetFoBusinessUnitInputSchema,
	getFoCompany: GetFoCompanyInputSchema,
	getFoCostCenter: GetFoCostCenterInputSchema,
	getFoDepartment: GetFoDepartmentInputSchema,
	getFoJobCode: GetFoJobCodeInputSchema,
	getFoJobFunction: GetFoJobFunctionInputSchema,
	getFoLocation: GetFoLocationInputSchema,
	getFoPayGroup: GetFoPayGroupInputSchema,
	getPosition: GetPositionInputSchema,
	getCustomMdfObject: GetCustomMdfObjectInputSchema,
	getPicklist: GetPicklistInputSchema,
	getPicklistOption: GetPicklistOptionInputSchema,
	getCurrentUser: GetCurrentUserInputSchema,
	getOdataUserMetadata: GetOdataUserMetadataInputSchema,
	listUsers: ListUsersInputSchema,
	getPerPersonById: GetPerPersonByIdInputSchema,
	listPerPerson: ListPerPersonInputSchema,
	getPerPersonal: GetPerPersonalInputSchema,
	getBackgroundEducation: GetBackgroundEducationInputSchema,
	getBackgroundMobility: GetBackgroundMobilityInputSchema,
	listEmpEmployment: ListEmpEmploymentInputSchema,
	getEmpEmploymentTermination: GetEmpEmploymentTerminationInputSchema,
	getWorkOrder: GetWorkOrderInputSchema,
	getEmpPayCompRecurring: GetEmpPayCompRecurringInputSchema,
	getEmpPayCompNonRecurring: GetEmpPayCompNonRecurringInputSchema,
	getGoalPlanTemplate: GetGoalPlanTemplateInputSchema,
	getGoalsByPlan: GetGoalsByPlanInputSchema,
	getFormContent: GetFormContentInputSchema,
	createLearningActivitiesBulk: CreateLearningActivitiesBulkInputSchema,
	getCdpLearningMetadata: GetCdpLearningMetadataInputSchema,
	refreshCdpLearningMetadata: RefreshCdpLearningMetadataInputSchema,
	getEmployeeTime: GetEmployeeTimeInputSchema,
	getEmployeeTimesheet: GetEmployeeTimesheetInputSchema,
	getTemporaryTimeInformation: GetTemporaryTimeInformationInputSchema,
	getTimeAccountSnapshot: GetTimeAccountSnapshotInputSchema,
	getOdataMetadataClockInclockOut: GetOdataMetadataClockInclockOutInputSchema,
	queryAllAvailableClockClockOut: QueryAllAvailableClockClockOutInputSchema,
	queryClockClockOutGroupCodeTime: QueryClockClockOutGroupCodeTimeInputSchema,
} as const;

export type SapsuccessfactorsEndpointInputs = {
	[K in keyof typeof SapsuccessfactorsEndpointInputSchemas]: z.infer<
		(typeof SapsuccessfactorsEndpointInputSchemas)[K]
	>;
};

export const SapsuccessfactorsEndpointOutputSchemas = {
	approveCalibrationSession: ApproveCalibrationSessionResponseSchema,
	getCalibrationSessionById: GetCalibrationSessionByIdResponseSchema,
	getCalibrationSessions: GetCalibrationSessionsResponseSchema,
	getOdataMetadataCalibSessionService:
		GetOdataMetadataCalibSessionServiceResponseSchema,
	getCalibrationSubjectById: GetCalibrationSubjectByIdResponseSchema,
	getCalibrationSubjectRatings: GetCalibrationSubjectRatingsResponseSchema,
	updateCalibrationSubjectRatings:
		UpdateCalibrationSubjectRatingsResponseSchema,
	createOnboardee: CreateOnboardeeResponseSchema,
	getOnb2Process: GetOnb2ProcessResponseSchema,
	getOdataMetadataOnboardingAddl: GetOdataMetadataOnboardingAddlResponseSchema,
	updateInternalUsernameNewHiresAfter:
		UpdateInternalUsernameNewHiresAfterResponseSchema,
	createAFeedbackRequest: CreateAFeedbackRequestResponseSchema,
	getFeedbackRecordsServiceAvailable:
		GetFeedbackRecordsServiceAvailableResponseSchema,
	getPendingFeedbackRequestsFeedback:
		GetPendingFeedbackRequestsFeedbackResponseSchema,
	giveFeedbackOrRespondToAFeedbackRequest:
		GiveFeedbackOrRespondToAFeedbackRequestResponseSchema,
	refreshMetadataContFeedbackService:
		RefreshMetadataContFeedbackServiceResponseSchema,
	createUpdateSuccessorNomination:
		CreateUpdateSuccessorNominationResponseSchema,
	deleteNominationPositionTalentPool:
		DeleteNominationPositionTalentPoolResponseSchema,
	getOdataMetadataForNominationService:
		GetOdataMetadataForNominationServiceResponseSchema,
	getTalentPool: GetTalentPoolResponseSchema,
	getApplicationInterview: GetApplicationInterviewResponseSchema,
	getInterviewOverallAssessment: GetInterviewOverallAssessmentResponseSchema,
	getJobApplication: GetJobApplicationResponseSchema,
	getJobRequisition: GetJobRequisitionResponseSchema,
	getJobReqScreeningQuestion: GetJobReqScreeningQuestionResponseSchema,
	listCandidates: ListCandidatesResponseSchema,
	getFoBusinessUnit: GetFoBusinessUnitResponseSchema,
	getFoCompany: GetFoCompanyResponseSchema,
	getFoCostCenter: GetFoCostCenterResponseSchema,
	getFoDepartment: GetFoDepartmentResponseSchema,
	getFoJobCode: GetFoJobCodeResponseSchema,
	getFoJobFunction: GetFoJobFunctionResponseSchema,
	getFoLocation: GetFoLocationResponseSchema,
	getFoPayGroup: GetFoPayGroupResponseSchema,
	getPosition: GetPositionResponseSchema,
	getCustomMdfObject: GetCustomMdfObjectResponseSchema,
	getPicklist: GetPicklistResponseSchema,
	getPicklistOption: GetPicklistOptionResponseSchema,
	getCurrentUser: GetCurrentUserResponseSchema,
	getOdataUserMetadata: GetOdataUserMetadataResponseSchema,
	listUsers: ListUsersResponseSchema,
	getPerPersonById: GetPerPersonByIdResponseSchema,
	listPerPerson: ListPerPersonResponseSchema,
	getPerPersonal: GetPerPersonalResponseSchema,
	getBackgroundEducation: GetBackgroundEducationResponseSchema,
	getBackgroundMobility: GetBackgroundMobilityResponseSchema,
	listEmpEmployment: ListEmpEmploymentResponseSchema,
	getEmpEmploymentTermination: GetEmpEmploymentTerminationResponseSchema,
	getWorkOrder: GetWorkOrderResponseSchema,
	getEmpPayCompRecurring: GetEmpPayCompRecurringResponseSchema,
	getEmpPayCompNonRecurring: GetEmpPayCompNonRecurringResponseSchema,
	getGoalPlanTemplate: GetGoalPlanTemplateResponseSchema,
	getGoalsByPlan: GetGoalsByPlanResponseSchema,
	getFormContent: GetFormContentResponseSchema,
	createLearningActivitiesBulk: CreateLearningActivitiesBulkResponseSchema,
	getCdpLearningMetadata: GetCdpLearningMetadataResponseSchema,
	refreshCdpLearningMetadata: RefreshCdpLearningMetadataResponseSchema,
	getEmployeeTime: GetEmployeeTimeResponseSchema,
	getEmployeeTimesheet: GetEmployeeTimesheetResponseSchema,
	getTemporaryTimeInformation: GetTemporaryTimeInformationResponseSchema,
	getTimeAccountSnapshot: GetTimeAccountSnapshotResponseSchema,
	getOdataMetadataClockInclockOut:
		GetOdataMetadataClockInclockOutResponseSchema,
	queryAllAvailableClockClockOut: QueryAllAvailableClockClockOutResponseSchema,
	queryClockClockOutGroupCodeTime:
		QueryClockClockOutGroupCodeTimeResponseSchema,
} as const;

export type SapsuccessfactorsEndpointOutputs = {
	[K in keyof typeof SapsuccessfactorsEndpointOutputSchemas]: z.infer<
		(typeof SapsuccessfactorsEndpointOutputSchemas)[K]
	>;
};
