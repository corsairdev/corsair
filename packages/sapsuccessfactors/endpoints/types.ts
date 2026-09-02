import { z } from 'zod';

const odataQuery = {
	filter: z.string().optional(),
	select: z.string().optional(),
	expand: z.string().optional(),
	top: z.number().int().min(1).optional(),
	skip: z.number().int().min(0).optional(),
	orderby: z.string().optional(),
};

const ODataQuery = z.object(odataQuery);
const Empty = z.object({}).optional();

/** OData V2 `{ d }` and V4 `{ value }` plus metadata XML/JSON. */
export const SapResponseSchema = z.union([
	z
		.object({
			d: z.unknown().optional(),
			value: z.array(z.unknown()).optional(),
		})
		.passthrough(),
	z.string(),
	z.record(z.string(), z.unknown()),
	z.null(),
	z.undefined(),
]);

const Body = z.record(z.string(), z.unknown()).optional();

const FeedbackQuestion = z.object({
	question: z.string().min(1),
	answer: z.string().max(4000).optional(),
});

export const SapsuccessfactorsEndpointInputSchemas = {
	approveCalibrationSession: z.object({ session_id: z.string().min(1) }),
	getCalibrationSessionById: z.object({
		session_id: z.string().min(1),
		select: odataQuery.select,
		expand: odataQuery.expand,
	}),
	getCalibrationSessions: ODataQuery,
	getOdataMetadataCalibSessionService: Empty,
	getCalibrationSubjectById: z.object({
		subject_id: z.string().min(1),
		select: odataQuery.select,
		expand: odataQuery.expand,
	}),
	getCalibrationSubjectRatings: ODataQuery.extend({
		session_id: z.string().min(1),
	}),
	updateCalibrationSubjectRatings: z.object({
		subject_id: z.string().min(1),
		body: Body,
	}),
	createOnboardee: z.object({
		userId: z.string().min(1).optional(),
		username: z.string().min(1).optional(),
		status: z.string().optional(),
		body: Body,
	}),
	getOnb2Process: ODataQuery,
	getOdataMetadataOnboardingAddl: Empty,
	updateInternalUsernameNewHiresAfter: z.object({
		userId: z.string().min(1).optional(),
		user_id: z.string().min(1).optional(),
		newUsername: z.string().min(1).optional(),
		new_username: z.string().min(1).optional(),
	}),
	createAFeedbackRequest: z
		.object({
			questions: z.array(FeedbackQuestion).min(1).max(3).optional(),
			body: Body,
		})
		.refine((v) => (v.questions?.length ?? 0) > 0 || v.body != null, {
			message: 'At least one question must be provided',
		}),
	getFeedbackRecordsServiceAvailable: ODataQuery,
	getPendingFeedbackRequestsFeedback: ODataQuery,
	giveFeedbackOrRespondToAFeedbackRequest: z.object({
		questions: z.array(FeedbackQuestion).max(3).optional(),
		body: Body,
	}),
	refreshMetadataContFeedbackService: Empty,
	createUpdateSuccessorNomination: z.object({
		userId: z.string().optional(),
		positionCode: z.string().optional(),
		isPoolNomination: z.boolean().optional(),
		body: Body,
	}),
	deleteNominationPositionTalentPool: z.object({
		nominationTargetId: z.string().min(1),
		userId: z.string().min(1),
		isPoolNomination: z.boolean().optional(),
	}),
	getOdataMetadataForNominationService: Empty,
	getTalentPool: ODataQuery,
	getApplicationInterview: z
		.object({
			applicationId: z.string().min(1).optional(),
			...odataQuery,
		})
		.refine((v) => Boolean(v.applicationId || v.filter), {
			message:
				'applicationId (or $filter including applicationId) is required; Interview Central only scans the first 1000 rows',
		}),
	getInterviewOverallAssessment: ODataQuery,
	getJobApplication: ODataQuery,
	getJobRequisition: ODataQuery,
	getJobReqScreeningQuestion: ODataQuery,
	listCandidates: ODataQuery,
	getFoBusinessUnit: ODataQuery,
	getFoCompany: ODataQuery,
	getFoCostCenter: ODataQuery,
	getFoDepartment: ODataQuery,
	getFoJobCode: ODataQuery,
	getFoJobFunction: ODataQuery,
	getFoLocation: ODataQuery,
	getFoPayGroup: ODataQuery,
	getPosition: ODataQuery,
	getCustomMdfObject: ODataQuery.extend({
		custom_object: z
			.string()
			.regex(
				/^cust_[A-Za-z0-9_]+$/,
				'custom_object must be a cust_* MDF entity name',
			),
	}),
	getPicklist: ODataQuery,
	getPicklistOption: ODataQuery,
	getCurrentUser: ODataQuery,
	getOdataUserMetadata: Empty,
	listUsers: ODataQuery,
	getPerPersonById: z.object({
		person_id_external: z.string().min(1),
		select: odataQuery.select,
		expand: odataQuery.expand,
	}),
	listPerPerson: ODataQuery,
	getPerPersonal: ODataQuery,
	getBackgroundEducation: ODataQuery,
	getBackgroundMobility: ODataQuery,
	listEmpEmployment: ODataQuery,
	getEmpEmploymentTermination: ODataQuery,
	getWorkOrder: ODataQuery,
	getEmpPayCompRecurring: ODataQuery,
	getEmpPayCompNonRecurring: ODataQuery,
	getGoalPlanTemplate: ODataQuery,
	getGoalsByPlan: ODataQuery.extend({
		goal_plan_id: z.string().min(1),
	}),
	getFormContent: ODataQuery,
	createLearningActivitiesBulk: z.object({ body: Body }),
	getCdpLearningMetadata: Empty,
	refreshCdpLearningMetadata: Empty,
	getEmployeeTime: ODataQuery,
	getEmployeeTimesheet: ODataQuery,
	getTemporaryTimeInformation: ODataQuery,
	getTimeAccountSnapshot: ODataQuery,
	getOdataMetadataClockInclockOut: Empty,
	queryAllAvailableClockClockOut: ODataQuery,
	queryClockClockOutGroupCodeTime: z.object({
		code: z.string().min(1),
		expand: odataQuery.expand,
		select: odataQuery.select,
	}),
} as const;

export type SapsuccessfactorsEndpointInputs = {
	[K in keyof typeof SapsuccessfactorsEndpointInputSchemas]: z.infer<
		(typeof SapsuccessfactorsEndpointInputSchemas)[K]
	>;
};

export const SapsuccessfactorsEndpointOutputSchemas = Object.fromEntries(
	Object.keys(SapsuccessfactorsEndpointInputSchemas).map((key) => [
		key,
		SapResponseSchema,
	]),
) as {
	[K in keyof typeof SapsuccessfactorsEndpointInputSchemas]: typeof SapResponseSchema;
};

export type SapsuccessfactorsEndpointOutputs = {
	[K in keyof typeof SapsuccessfactorsEndpointOutputSchemas]: z.infer<
		(typeof SapsuccessfactorsEndpointOutputSchemas)[K]
	>;
};

export type SapsuccessfactorsEndpointInput =
	SapsuccessfactorsEndpointInputs[keyof SapsuccessfactorsEndpointInputs] &
		Record<string, unknown>;
