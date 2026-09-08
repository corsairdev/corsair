import { z } from 'zod';
import {
	SapsuccessfactorsCandidateEntity,
	SapsuccessfactorsEmploymentEntity,
	SapsuccessfactorsJobApplicationEntity,
	SapsuccessfactorsJobRequisitionEntity,
	SapsuccessfactorsPersonalEntity,
	SapsuccessfactorsPersonEntity,
	SapsuccessfactorsPositionEntity,
	SapsuccessfactorsUserEntity,
} from '../schema/database';
import type { SapRouteName } from './routes';

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

const rec = (shape: z.ZodRawShape) => z.object(shape).catchall(z.unknown());
const Id = z.union([z.string(), z.number()]);

const CalibrationSessionOut = rec({ sessionId: z.string() });
const CalibrationSubjectOut = rec({ subjectId: z.string() });
const Onb2ProcessOut = rec({ userId: z.string() });
const FeedbackOut = rec({ id: Id });
const FeedbackRequestOut = rec({ id: Id });
const NominationOut = rec({ nominationTargetId: z.string() });
const TalentPoolOut = rec({ id: Id });
const ApplicationInterviewOut = rec({ applicationId: Id });
const InterviewAssessmentOut = rec({ applicationId: Id });
const ScreeningQuestionOut = rec({ jobReqId: Id });
const FoBusinessUnitOut = rec({ externalCode: z.string() });
const FoCompanyOut = rec({ externalCode: z.string() });
const FoCostCenterOut = rec({ externalCode: z.string() });
const FoDepartmentOut = rec({ externalCode: z.string() });
const FoJobCodeOut = rec({ externalCode: z.string() });
const FoJobFunctionOut = rec({ externalCode: z.string() });
const FoLocationOut = rec({ externalCode: z.string() });
const FoPayGroupOut = rec({ externalCode: z.string() });
const MdfOut = rec({ externalCode: z.string().optional() });
const PicklistOut = rec({ picklistId: Id });
const PicklistOptionOut = rec({ id: Id });
const GoalPlanOut = rec({ id: Id });
const GoalOut = rec({ id: Id });
const BackgroundEducationOut = rec({ userId: z.string() });
const BackgroundMobilityOut = rec({ userId: z.string() });
const EmploymentTerminationOut = rec({ userId: z.string() });
const PayCompOut = rec({ userId: z.string() });
const WorkOrderOut = rec({ userId: z.string() });
const FormContentOut = rec({ formContentId: Id });
const LearningActivityOut = rec({ userId: z.string() });
const ActionOut = rec({ message: z.string().optional() });
const EmployeeTimeOut = rec({ userId: z.string() });
const EmployeeTimeSheetOut = rec({ userId: z.string() });
const TemporaryTimeOut = rec({ userId: z.string() });
const TimeAccountSnapshotOut = rec({ userId: z.string() });
const ClockInClockOutGroupOut = rec({ code: z.string() });

function collectionOf<T extends z.ZodType>(item: T) {
	return z.union([
		z
			.object({
				d: z.object({ results: z.array(item) }).passthrough(),
			})
			.passthrough(),
		z.object({ value: z.array(item) }).passthrough(),
	]);
}

function entityOf<T extends z.ZodType>(item: T) {
	return z.union([
		z.object({ d: item }).passthrough(),
		z
			.object({ '@odata.context': z.string().min(1) })
			.passthrough()
			.and(item)
			.refine((v) => !Array.isArray((v as { value?: unknown }).value), {
				message: 'V4 entity must not be a collection',
			}),
	]);
}

function writeOf<T extends z.ZodType>(item: T) {
	return z.union([
		z.undefined(),
		z.null(),
		z.object({}).strict(),
		entityOf(item),
	]);
}

export const SapMetadataSchema = z.union([
	z.string().refine((s) => s.includes('<?xml') || s.includes('edmx'), {
		message: 'OData metadata must be EDMX XML',
	}),
	collectionOf(ActionOut),
	entityOf(ActionOut),
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

export const SapsuccessfactorsEndpointOutputSchemas = {
	approveCalibrationSession: writeOf(CalibrationSessionOut),
	getCalibrationSessionById: entityOf(CalibrationSessionOut),
	getCalibrationSessions: collectionOf(CalibrationSessionOut),
	getOdataMetadataCalibSessionService: SapMetadataSchema,
	getCalibrationSubjectById: entityOf(CalibrationSubjectOut),
	getCalibrationSubjectRatings: collectionOf(CalibrationSubjectOut),
	updateCalibrationSubjectRatings: writeOf(CalibrationSubjectOut),
	createOnboardee: writeOf(SapsuccessfactorsUserEntity),
	getOnb2Process: collectionOf(Onb2ProcessOut),
	getOdataMetadataOnboardingAddl: SapMetadataSchema,
	updateInternalUsernameNewHiresAfter: writeOf(SapsuccessfactorsUserEntity),
	createAFeedbackRequest: writeOf(FeedbackRequestOut),
	getFeedbackRecordsServiceAvailable: collectionOf(FeedbackOut),
	getPendingFeedbackRequestsFeedback: collectionOf(FeedbackRequestOut),
	giveFeedbackOrRespondToAFeedbackRequest: writeOf(FeedbackOut),
	refreshMetadataContFeedbackService: writeOf(ActionOut),
	createUpdateSuccessorNomination: writeOf(NominationOut),
	deleteNominationPositionTalentPool: writeOf(NominationOut),
	getOdataMetadataForNominationService: SapMetadataSchema,
	getTalentPool: collectionOf(TalentPoolOut),
	getApplicationInterview: collectionOf(ApplicationInterviewOut),
	getInterviewOverallAssessment: collectionOf(InterviewAssessmentOut),
	getJobApplication: collectionOf(SapsuccessfactorsJobApplicationEntity),
	getJobRequisition: collectionOf(SapsuccessfactorsJobRequisitionEntity),
	getJobReqScreeningQuestion: collectionOf(ScreeningQuestionOut),
	listCandidates: collectionOf(SapsuccessfactorsCandidateEntity),
	getFoBusinessUnit: collectionOf(FoBusinessUnitOut),
	getFoCompany: collectionOf(FoCompanyOut),
	getFoCostCenter: collectionOf(FoCostCenterOut),
	getFoDepartment: collectionOf(FoDepartmentOut),
	getFoJobCode: collectionOf(FoJobCodeOut),
	getFoJobFunction: collectionOf(FoJobFunctionOut),
	getFoLocation: collectionOf(FoLocationOut),
	getFoPayGroup: collectionOf(FoPayGroupOut),
	getPosition: collectionOf(SapsuccessfactorsPositionEntity),
	getCustomMdfObject: collectionOf(MdfOut),
	getPicklist: collectionOf(PicklistOut),
	getPicklistOption: collectionOf(PicklistOptionOut),
	getCurrentUser: collectionOf(SapsuccessfactorsUserEntity),
	getOdataUserMetadata: SapMetadataSchema,
	listUsers: collectionOf(SapsuccessfactorsUserEntity),
	getPerPersonById: entityOf(SapsuccessfactorsPersonEntity),
	listPerPerson: collectionOf(SapsuccessfactorsPersonEntity),
	getPerPersonal: collectionOf(SapsuccessfactorsPersonalEntity),
	getBackgroundEducation: collectionOf(BackgroundEducationOut),
	getBackgroundMobility: collectionOf(BackgroundMobilityOut),
	listEmpEmployment: collectionOf(SapsuccessfactorsEmploymentEntity),
	getEmpEmploymentTermination: collectionOf(EmploymentTerminationOut),
	getWorkOrder: collectionOf(WorkOrderOut),
	getEmpPayCompRecurring: collectionOf(PayCompOut),
	getEmpPayCompNonRecurring: collectionOf(PayCompOut),
	getGoalPlanTemplate: collectionOf(GoalPlanOut),
	getGoalsByPlan: collectionOf(GoalOut),
	getFormContent: collectionOf(FormContentOut),
	createLearningActivitiesBulk: writeOf(LearningActivityOut),
	getCdpLearningMetadata: SapMetadataSchema,
	refreshCdpLearningMetadata: writeOf(ActionOut),
	getEmployeeTime: collectionOf(EmployeeTimeOut),
	getEmployeeTimesheet: collectionOf(EmployeeTimeSheetOut),
	getTemporaryTimeInformation: collectionOf(TemporaryTimeOut),
	getTimeAccountSnapshot: collectionOf(TimeAccountSnapshotOut),
	getOdataMetadataClockInclockOut: SapMetadataSchema,
	queryAllAvailableClockClockOut: collectionOf(ClockInClockOutGroupOut),
	queryClockClockOutGroupCodeTime: entityOf(ClockInClockOutGroupOut),
} as const satisfies Record<SapRouteName, z.ZodType>;

export type SapsuccessfactorsEndpointOutputs = {
	[K in keyof typeof SapsuccessfactorsEndpointOutputSchemas]: z.infer<
		(typeof SapsuccessfactorsEndpointOutputSchemas)[K]
	>;
};

export type SapsuccessfactorsEndpointInput =
	SapsuccessfactorsEndpointInputs[keyof SapsuccessfactorsEndpointInputs] &
		Record<string, unknown>;
