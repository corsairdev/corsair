import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	A,
	Application,
	Approve,
	Background,
	Calibration,
	Candidates,
	Cdp,
	Current,
	Custom,
	Emp,
	Employee,
	Feedback,
	Fo,
	Form,
	Give,
	Goal,
	Goals,
	Internal,
	Interview,
	Job,
	Learning,
	Metadata,
	Nomination,
	Odata,
	Onb2,
	Onboardee,
	Pending,
	Per,
	Picklist,
	Position,
	Query,
	Successor,
	Talent,
	Temporary,
	Time,
	Users,
	Work,
} from './endpoints';
import type {
	SapsuccessfactorsEndpointInputs,
	SapsuccessfactorsEndpointOutputs,
} from './endpoints/types';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './endpoints/types';
import { SapsuccessfactorsSchema } from './schema';

export type SapsuccessfactorsPluginOptions = {
	/** Cloud-based human capital management software covering Employee Central, Recruiting, Performance & Goals, Learning, Compensation, and more. */
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiBaseUrl?: string;
	webhookSecret?: string;
	hooks?: InternalSapsuccessfactorsPlugin['hooks'];
	webhookHooks?: InternalSapsuccessfactorsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof sapsuccessfactorsEndpointsNested
	>;
};

export type SapsuccessfactorsContext = CorsairPluginContext<
	typeof SapsuccessfactorsSchema,
	SapsuccessfactorsPluginOptions
>;
export type SapsuccessfactorsKeyBuilderContext =
	KeyBuilderContext<SapsuccessfactorsPluginOptions>;
export type SapsuccessfactorsBoundEndpoints = BindEndpoints<
	typeof sapsuccessfactorsEndpointsNested
>;

type SapsuccessfactorsEndpoint<
	K extends keyof SapsuccessfactorsEndpointOutputs,
> = CorsairEndpoint<
	SapsuccessfactorsContext,
	SapsuccessfactorsEndpointInputs[K],
	SapsuccessfactorsEndpointOutputs[K]
>;

export type SapsuccessfactorsEndpoints = {
	approveCalibrationSession: SapsuccessfactorsEndpoint<'approveCalibrationSession'>;
	getCalibrationSessionById: SapsuccessfactorsEndpoint<'getCalibrationSessionById'>;
	getCalibrationSessions: SapsuccessfactorsEndpoint<'getCalibrationSessions'>;
	getCalibrationSubjectById: SapsuccessfactorsEndpoint<'getCalibrationSubjectById'>;
	getCalibrationSubjectRatings: SapsuccessfactorsEndpoint<'getCalibrationSubjectRatings'>;
	updateCalibrationSubjectRatings: SapsuccessfactorsEndpoint<'updateCalibrationSubjectRatings'>;
	getOdataMetadataCalibSessionService: SapsuccessfactorsEndpoint<'getOdataMetadataCalibSessionService'>;
	getOdataMetadataOnboardingAddl: SapsuccessfactorsEndpoint<'getOdataMetadataOnboardingAddl'>;
	getOdataMetadataForNominationService: SapsuccessfactorsEndpoint<'getOdataMetadataForNominationService'>;
	getOdataUserMetadata: SapsuccessfactorsEndpoint<'getOdataUserMetadata'>;
	getOdataMetadataClockInclockOut: SapsuccessfactorsEndpoint<'getOdataMetadataClockInclockOut'>;
	createOnboardee: SapsuccessfactorsEndpoint<'createOnboardee'>;
	getOnb2Process: SapsuccessfactorsEndpoint<'getOnb2Process'>;
	updateInternalUsernameNewHiresAfter: SapsuccessfactorsEndpoint<'updateInternalUsernameNewHiresAfter'>;
	createAFeedbackRequest: SapsuccessfactorsEndpoint<'createAFeedbackRequest'>;
	getFeedbackRecordsServiceAvailable: SapsuccessfactorsEndpoint<'getFeedbackRecordsServiceAvailable'>;
	getPendingFeedbackRequestsFeedback: SapsuccessfactorsEndpoint<'getPendingFeedbackRequestsFeedback'>;
	giveFeedbackOrRespondToAFeedbackRequest: SapsuccessfactorsEndpoint<'giveFeedbackOrRespondToAFeedbackRequest'>;
	refreshMetadataContFeedbackService: SapsuccessfactorsEndpoint<'refreshMetadataContFeedbackService'>;
	createUpdateSuccessorNomination: SapsuccessfactorsEndpoint<'createUpdateSuccessorNomination'>;
	deleteNominationPositionTalentPool: SapsuccessfactorsEndpoint<'deleteNominationPositionTalentPool'>;
	getTalentPool: SapsuccessfactorsEndpoint<'getTalentPool'>;
	getApplicationInterview: SapsuccessfactorsEndpoint<'getApplicationInterview'>;
	getInterviewOverallAssessment: SapsuccessfactorsEndpoint<'getInterviewOverallAssessment'>;
	getJobApplication: SapsuccessfactorsEndpoint<'getJobApplication'>;
	getJobRequisition: SapsuccessfactorsEndpoint<'getJobRequisition'>;
	getJobReqScreeningQuestion: SapsuccessfactorsEndpoint<'getJobReqScreeningQuestion'>;
	listCandidates: SapsuccessfactorsEndpoint<'listCandidates'>;
	getFoBusinessUnit: SapsuccessfactorsEndpoint<'getFoBusinessUnit'>;
	getFoCompany: SapsuccessfactorsEndpoint<'getFoCompany'>;
	getFoCostCenter: SapsuccessfactorsEndpoint<'getFoCostCenter'>;
	getFoDepartment: SapsuccessfactorsEndpoint<'getFoDepartment'>;
	getFoJobCode: SapsuccessfactorsEndpoint<'getFoJobCode'>;
	getFoJobFunction: SapsuccessfactorsEndpoint<'getFoJobFunction'>;
	getFoLocation: SapsuccessfactorsEndpoint<'getFoLocation'>;
	getFoPayGroup: SapsuccessfactorsEndpoint<'getFoPayGroup'>;
	getPosition: SapsuccessfactorsEndpoint<'getPosition'>;
	getCustomMdfObject: SapsuccessfactorsEndpoint<'getCustomMdfObject'>;
	getPicklist: SapsuccessfactorsEndpoint<'getPicklist'>;
	getPicklistOption: SapsuccessfactorsEndpoint<'getPicklistOption'>;
	getCurrentUser: SapsuccessfactorsEndpoint<'getCurrentUser'>;
	listUsers: SapsuccessfactorsEndpoint<'listUsers'>;
	getPerPersonById: SapsuccessfactorsEndpoint<'getPerPersonById'>;
	listPerPerson: SapsuccessfactorsEndpoint<'listPerPerson'>;
	getPerPersonal: SapsuccessfactorsEndpoint<'getPerPersonal'>;
	getBackgroundEducation: SapsuccessfactorsEndpoint<'getBackgroundEducation'>;
	getBackgroundMobility: SapsuccessfactorsEndpoint<'getBackgroundMobility'>;
	listEmpEmployment: SapsuccessfactorsEndpoint<'listEmpEmployment'>;
	getEmpEmploymentTermination: SapsuccessfactorsEndpoint<'getEmpEmploymentTermination'>;
	getEmpPayCompRecurring: SapsuccessfactorsEndpoint<'getEmpPayCompRecurring'>;
	getEmpPayCompNonRecurring: SapsuccessfactorsEndpoint<'getEmpPayCompNonRecurring'>;
	getWorkOrder: SapsuccessfactorsEndpoint<'getWorkOrder'>;
	getGoalPlanTemplate: SapsuccessfactorsEndpoint<'getGoalPlanTemplate'>;
	getGoalsByPlan: SapsuccessfactorsEndpoint<'getGoalsByPlan'>;
	getFormContent: SapsuccessfactorsEndpoint<'getFormContent'>;
	createLearningActivitiesBulk: SapsuccessfactorsEndpoint<'createLearningActivitiesBulk'>;
	getCdpLearningMetadata: SapsuccessfactorsEndpoint<'getCdpLearningMetadata'>;
	refreshCdpLearningMetadata: SapsuccessfactorsEndpoint<'refreshCdpLearningMetadata'>;
	getEmployeeTime: SapsuccessfactorsEndpoint<'getEmployeeTime'>;
	getEmployeeTimesheet: SapsuccessfactorsEndpoint<'getEmployeeTimesheet'>;
	getTemporaryTimeInformation: SapsuccessfactorsEndpoint<'getTemporaryTimeInformation'>;
	getTimeAccountSnapshot: SapsuccessfactorsEndpoint<'getTimeAccountSnapshot'>;
	queryAllAvailableClockClockOut: SapsuccessfactorsEndpoint<'queryAllAvailableClockClockOut'>;
	queryClockClockOutGroupCodeTime: SapsuccessfactorsEndpoint<'queryClockClockOutGroupCodeTime'>;
};

export type SapsuccessfactorsBoundWebhooks = BindWebhooks<
	Record<string, never>
>;

const sapsuccessfactorsEndpointsNested = {
	approve: {
		approveCalibrationSession: Approve.approveCalibrationSession,
	},
	calibration: {
		getCalibrationSessionById: Calibration.getCalibrationSessionById,
		getCalibrationSessions: Calibration.getCalibrationSessions,
		getCalibrationSubjectById: Calibration.getCalibrationSubjectById,
		getCalibrationSubjectRatings: Calibration.getCalibrationSubjectRatings,
		updateCalibrationSubjectRatings:
			Calibration.updateCalibrationSubjectRatings,
	},
	odata: {
		getOdataMetadataCalibSessionService:
			Odata.getOdataMetadataCalibSessionService,
		getOdataMetadataOnboardingAddl: Odata.getOdataMetadataOnboardingAddl,
		getOdataMetadataForNominationService:
			Odata.getOdataMetadataForNominationService,
		getOdataUserMetadata: Odata.getOdataUserMetadata,
		getOdataMetadataClockInclockOut: Odata.getOdataMetadataClockInclockOut,
	},
	onboardee: {
		createOnboardee: Onboardee.createOnboardee,
	},
	onb2: {
		getOnb2Process: Onb2.getOnb2Process,
	},
	internal: {
		updateInternalUsernameNewHiresAfter:
			Internal.updateInternalUsernameNewHiresAfter,
	},
	a: {
		createAFeedbackRequest: A.createAFeedbackRequest,
	},
	feedback: {
		getFeedbackRecordsServiceAvailable:
			Feedback.getFeedbackRecordsServiceAvailable,
	},
	pending: {
		getPendingFeedbackRequestsFeedback:
			Pending.getPendingFeedbackRequestsFeedback,
	},
	give: {
		giveFeedbackOrRespondToAFeedbackRequest:
			Give.giveFeedbackOrRespondToAFeedbackRequest,
	},
	metadata: {
		refreshMetadataContFeedbackService:
			Metadata.refreshMetadataContFeedbackService,
	},
	successor: {
		createUpdateSuccessorNomination: Successor.createUpdateSuccessorNomination,
	},
	nomination: {
		deleteNominationPositionTalentPool:
			Nomination.deleteNominationPositionTalentPool,
	},
	talent: {
		getTalentPool: Talent.getTalentPool,
	},
	application: {
		getApplicationInterview: Application.getApplicationInterview,
	},
	interview: {
		getInterviewOverallAssessment: Interview.getInterviewOverallAssessment,
	},
	job: {
		getJobApplication: Job.getJobApplication,
		getJobRequisition: Job.getJobRequisition,
		getJobReqScreeningQuestion: Job.getJobReqScreeningQuestion,
	},
	candidates: {
		listCandidates: Candidates.listCandidates,
	},
	fo: {
		getFoBusinessUnit: Fo.getFoBusinessUnit,
		getFoCompany: Fo.getFoCompany,
		getFoCostCenter: Fo.getFoCostCenter,
		getFoDepartment: Fo.getFoDepartment,
		getFoJobCode: Fo.getFoJobCode,
		getFoJobFunction: Fo.getFoJobFunction,
		getFoLocation: Fo.getFoLocation,
		getFoPayGroup: Fo.getFoPayGroup,
	},
	position: {
		getPosition: Position.getPosition,
	},
	custom: {
		getCustomMdfObject: Custom.getCustomMdfObject,
	},
	picklist: {
		getPicklist: Picklist.getPicklist,
		getPicklistOption: Picklist.getPicklistOption,
	},
	current: {
		getCurrentUser: Current.getCurrentUser,
	},
	users: {
		listUsers: Users.listUsers,
	},
	per: {
		getPerPersonById: Per.getPerPersonById,
		listPerPerson: Per.listPerPerson,
		getPerPersonal: Per.getPerPersonal,
	},
	background: {
		getBackgroundEducation: Background.getBackgroundEducation,
		getBackgroundMobility: Background.getBackgroundMobility,
	},
	emp: {
		listEmpEmployment: Emp.listEmpEmployment,
		getEmpEmploymentTermination: Emp.getEmpEmploymentTermination,
		getEmpPayCompRecurring: Emp.getEmpPayCompRecurring,
		getEmpPayCompNonRecurring: Emp.getEmpPayCompNonRecurring,
	},
	work: {
		getWorkOrder: Work.getWorkOrder,
	},
	goal: {
		getGoalPlanTemplate: Goal.getGoalPlanTemplate,
	},
	goals: {
		getGoalsByPlan: Goals.getGoalsByPlan,
	},
	form: {
		getFormContent: Form.getFormContent,
	},
	learning: {
		createLearningActivitiesBulk: Learning.createLearningActivitiesBulk,
	},
	cdp: {
		getCdpLearningMetadata: Cdp.getCdpLearningMetadata,
		refreshCdpLearningMetadata: Cdp.refreshCdpLearningMetadata,
	},
	employee: {
		getEmployeeTime: Employee.getEmployeeTime,
		getEmployeeTimesheet: Employee.getEmployeeTimesheet,
	},
	temporary: {
		getTemporaryTimeInformation: Temporary.getTemporaryTimeInformation,
	},
	time: {
		getTimeAccountSnapshot: Time.getTimeAccountSnapshot,
	},
	query: {
		queryAllAvailableClockClockOut: Query.queryAllAvailableClockClockOut,
		queryClockClockOutGroupCodeTime: Query.queryClockClockOutGroupCodeTime,
	},
} as const;

const sapsuccessfactorsWebhooksNested = {} as const;

export const sapsuccessfactorsEndpointSchemas = {
	'approve.approveCalibrationSession': {
		input: SapsuccessfactorsEndpointInputSchemas.approveCalibrationSession,
		output: SapsuccessfactorsEndpointOutputSchemas.approveCalibrationSession,
	},
	'calibration.getCalibrationSessionById': {
		input: SapsuccessfactorsEndpointInputSchemas.getCalibrationSessionById,
		output: SapsuccessfactorsEndpointOutputSchemas.getCalibrationSessionById,
	},
	'calibration.getCalibrationSessions': {
		input: SapsuccessfactorsEndpointInputSchemas.getCalibrationSessions,
		output: SapsuccessfactorsEndpointOutputSchemas.getCalibrationSessions,
	},
	'calibration.getCalibrationSubjectById': {
		input: SapsuccessfactorsEndpointInputSchemas.getCalibrationSubjectById,
		output: SapsuccessfactorsEndpointOutputSchemas.getCalibrationSubjectById,
	},
	'calibration.getCalibrationSubjectRatings': {
		input: SapsuccessfactorsEndpointInputSchemas.getCalibrationSubjectRatings,
		output: SapsuccessfactorsEndpointOutputSchemas.getCalibrationSubjectRatings,
	},
	'calibration.updateCalibrationSubjectRatings': {
		input:
			SapsuccessfactorsEndpointInputSchemas.updateCalibrationSubjectRatings,
		output:
			SapsuccessfactorsEndpointOutputSchemas.updateCalibrationSubjectRatings,
	},
	'odata.getOdataMetadataCalibSessionService': {
		input:
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataCalibSessionService,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataCalibSessionService,
	},
	'odata.getOdataMetadataOnboardingAddl': {
		input: SapsuccessfactorsEndpointInputSchemas.getOdataMetadataOnboardingAddl,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataOnboardingAddl,
	},
	'odata.getOdataMetadataForNominationService': {
		input:
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataForNominationService,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataForNominationService,
	},
	'odata.getOdataUserMetadata': {
		input: SapsuccessfactorsEndpointInputSchemas.getOdataUserMetadata,
		output: SapsuccessfactorsEndpointOutputSchemas.getOdataUserMetadata,
	},
	'odata.getOdataMetadataClockInclockOut': {
		input:
			SapsuccessfactorsEndpointInputSchemas.getOdataMetadataClockInclockOut,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getOdataMetadataClockInclockOut,
	},
	'onboardee.createOnboardee': {
		input: SapsuccessfactorsEndpointInputSchemas.createOnboardee,
		output: SapsuccessfactorsEndpointOutputSchemas.createOnboardee,
	},
	'onb2.getOnb2Process': {
		input: SapsuccessfactorsEndpointInputSchemas.getOnb2Process,
		output: SapsuccessfactorsEndpointOutputSchemas.getOnb2Process,
	},
	'internal.updateInternalUsernameNewHiresAfter': {
		input:
			SapsuccessfactorsEndpointInputSchemas.updateInternalUsernameNewHiresAfter,
		output:
			SapsuccessfactorsEndpointOutputSchemas.updateInternalUsernameNewHiresAfter,
	},
	'a.createAFeedbackRequest': {
		input: SapsuccessfactorsEndpointInputSchemas.createAFeedbackRequest,
		output: SapsuccessfactorsEndpointOutputSchemas.createAFeedbackRequest,
	},
	'feedback.getFeedbackRecordsServiceAvailable': {
		input:
			SapsuccessfactorsEndpointInputSchemas.getFeedbackRecordsServiceAvailable,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getFeedbackRecordsServiceAvailable,
	},
	'pending.getPendingFeedbackRequestsFeedback': {
		input:
			SapsuccessfactorsEndpointInputSchemas.getPendingFeedbackRequestsFeedback,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getPendingFeedbackRequestsFeedback,
	},
	'give.giveFeedbackOrRespondToAFeedbackRequest': {
		input:
			SapsuccessfactorsEndpointInputSchemas.giveFeedbackOrRespondToAFeedbackRequest,
		output:
			SapsuccessfactorsEndpointOutputSchemas.giveFeedbackOrRespondToAFeedbackRequest,
	},
	'metadata.refreshMetadataContFeedbackService': {
		input:
			SapsuccessfactorsEndpointInputSchemas.refreshMetadataContFeedbackService,
		output:
			SapsuccessfactorsEndpointOutputSchemas.refreshMetadataContFeedbackService,
	},
	'successor.createUpdateSuccessorNomination': {
		input:
			SapsuccessfactorsEndpointInputSchemas.createUpdateSuccessorNomination,
		output:
			SapsuccessfactorsEndpointOutputSchemas.createUpdateSuccessorNomination,
	},
	'nomination.deleteNominationPositionTalentPool': {
		input:
			SapsuccessfactorsEndpointInputSchemas.deleteNominationPositionTalentPool,
		output:
			SapsuccessfactorsEndpointOutputSchemas.deleteNominationPositionTalentPool,
	},
	'talent.getTalentPool': {
		input: SapsuccessfactorsEndpointInputSchemas.getTalentPool,
		output: SapsuccessfactorsEndpointOutputSchemas.getTalentPool,
	},
	'application.getApplicationInterview': {
		input: SapsuccessfactorsEndpointInputSchemas.getApplicationInterview,
		output: SapsuccessfactorsEndpointOutputSchemas.getApplicationInterview,
	},
	'interview.getInterviewOverallAssessment': {
		input: SapsuccessfactorsEndpointInputSchemas.getInterviewOverallAssessment,
		output:
			SapsuccessfactorsEndpointOutputSchemas.getInterviewOverallAssessment,
	},
	'job.getJobApplication': {
		input: SapsuccessfactorsEndpointInputSchemas.getJobApplication,
		output: SapsuccessfactorsEndpointOutputSchemas.getJobApplication,
	},
	'job.getJobRequisition': {
		input: SapsuccessfactorsEndpointInputSchemas.getJobRequisition,
		output: SapsuccessfactorsEndpointOutputSchemas.getJobRequisition,
	},
	'job.getJobReqScreeningQuestion': {
		input: SapsuccessfactorsEndpointInputSchemas.getJobReqScreeningQuestion,
		output: SapsuccessfactorsEndpointOutputSchemas.getJobReqScreeningQuestion,
	},
	'candidates.listCandidates': {
		input: SapsuccessfactorsEndpointInputSchemas.listCandidates,
		output: SapsuccessfactorsEndpointOutputSchemas.listCandidates,
	},
	'fo.getFoBusinessUnit': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoBusinessUnit,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoBusinessUnit,
	},
	'fo.getFoCompany': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoCompany,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoCompany,
	},
	'fo.getFoCostCenter': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoCostCenter,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoCostCenter,
	},
	'fo.getFoDepartment': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoDepartment,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoDepartment,
	},
	'fo.getFoJobCode': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoJobCode,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoJobCode,
	},
	'fo.getFoJobFunction': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoJobFunction,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoJobFunction,
	},
	'fo.getFoLocation': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoLocation,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoLocation,
	},
	'fo.getFoPayGroup': {
		input: SapsuccessfactorsEndpointInputSchemas.getFoPayGroup,
		output: SapsuccessfactorsEndpointOutputSchemas.getFoPayGroup,
	},
	'position.getPosition': {
		input: SapsuccessfactorsEndpointInputSchemas.getPosition,
		output: SapsuccessfactorsEndpointOutputSchemas.getPosition,
	},
	'custom.getCustomMdfObject': {
		input: SapsuccessfactorsEndpointInputSchemas.getCustomMdfObject,
		output: SapsuccessfactorsEndpointOutputSchemas.getCustomMdfObject,
	},
	'picklist.getPicklist': {
		input: SapsuccessfactorsEndpointInputSchemas.getPicklist,
		output: SapsuccessfactorsEndpointOutputSchemas.getPicklist,
	},
	'picklist.getPicklistOption': {
		input: SapsuccessfactorsEndpointInputSchemas.getPicklistOption,
		output: SapsuccessfactorsEndpointOutputSchemas.getPicklistOption,
	},
	'current.getCurrentUser': {
		input: SapsuccessfactorsEndpointInputSchemas.getCurrentUser,
		output: SapsuccessfactorsEndpointOutputSchemas.getCurrentUser,
	},
	'users.listUsers': {
		input: SapsuccessfactorsEndpointInputSchemas.listUsers,
		output: SapsuccessfactorsEndpointOutputSchemas.listUsers,
	},
	'per.getPerPersonById': {
		input: SapsuccessfactorsEndpointInputSchemas.getPerPersonById,
		output: SapsuccessfactorsEndpointOutputSchemas.getPerPersonById,
	},
	'per.listPerPerson': {
		input: SapsuccessfactorsEndpointInputSchemas.listPerPerson,
		output: SapsuccessfactorsEndpointOutputSchemas.listPerPerson,
	},
	'per.getPerPersonal': {
		input: SapsuccessfactorsEndpointInputSchemas.getPerPersonal,
		output: SapsuccessfactorsEndpointOutputSchemas.getPerPersonal,
	},
	'background.getBackgroundEducation': {
		input: SapsuccessfactorsEndpointInputSchemas.getBackgroundEducation,
		output: SapsuccessfactorsEndpointOutputSchemas.getBackgroundEducation,
	},
	'background.getBackgroundMobility': {
		input: SapsuccessfactorsEndpointInputSchemas.getBackgroundMobility,
		output: SapsuccessfactorsEndpointOutputSchemas.getBackgroundMobility,
	},
	'emp.listEmpEmployment': {
		input: SapsuccessfactorsEndpointInputSchemas.listEmpEmployment,
		output: SapsuccessfactorsEndpointOutputSchemas.listEmpEmployment,
	},
	'emp.getEmpEmploymentTermination': {
		input: SapsuccessfactorsEndpointInputSchemas.getEmpEmploymentTermination,
		output: SapsuccessfactorsEndpointOutputSchemas.getEmpEmploymentTermination,
	},
	'emp.getEmpPayCompRecurring': {
		input: SapsuccessfactorsEndpointInputSchemas.getEmpPayCompRecurring,
		output: SapsuccessfactorsEndpointOutputSchemas.getEmpPayCompRecurring,
	},
	'emp.getEmpPayCompNonRecurring': {
		input: SapsuccessfactorsEndpointInputSchemas.getEmpPayCompNonRecurring,
		output: SapsuccessfactorsEndpointOutputSchemas.getEmpPayCompNonRecurring,
	},
	'work.getWorkOrder': {
		input: SapsuccessfactorsEndpointInputSchemas.getWorkOrder,
		output: SapsuccessfactorsEndpointOutputSchemas.getWorkOrder,
	},
	'goal.getGoalPlanTemplate': {
		input: SapsuccessfactorsEndpointInputSchemas.getGoalPlanTemplate,
		output: SapsuccessfactorsEndpointOutputSchemas.getGoalPlanTemplate,
	},
	'goals.getGoalsByPlan': {
		input: SapsuccessfactorsEndpointInputSchemas.getGoalsByPlan,
		output: SapsuccessfactorsEndpointOutputSchemas.getGoalsByPlan,
	},
	'form.getFormContent': {
		input: SapsuccessfactorsEndpointInputSchemas.getFormContent,
		output: SapsuccessfactorsEndpointOutputSchemas.getFormContent,
	},
	'learning.createLearningActivitiesBulk': {
		input: SapsuccessfactorsEndpointInputSchemas.createLearningActivitiesBulk,
		output: SapsuccessfactorsEndpointOutputSchemas.createLearningActivitiesBulk,
	},
	'cdp.getCdpLearningMetadata': {
		input: SapsuccessfactorsEndpointInputSchemas.getCdpLearningMetadata,
		output: SapsuccessfactorsEndpointOutputSchemas.getCdpLearningMetadata,
	},
	'cdp.refreshCdpLearningMetadata': {
		input: SapsuccessfactorsEndpointInputSchemas.refreshCdpLearningMetadata,
		output: SapsuccessfactorsEndpointOutputSchemas.refreshCdpLearningMetadata,
	},
	'employee.getEmployeeTime': {
		input: SapsuccessfactorsEndpointInputSchemas.getEmployeeTime,
		output: SapsuccessfactorsEndpointOutputSchemas.getEmployeeTime,
	},
	'employee.getEmployeeTimesheet': {
		input: SapsuccessfactorsEndpointInputSchemas.getEmployeeTimesheet,
		output: SapsuccessfactorsEndpointOutputSchemas.getEmployeeTimesheet,
	},
	'temporary.getTemporaryTimeInformation': {
		input: SapsuccessfactorsEndpointInputSchemas.getTemporaryTimeInformation,
		output: SapsuccessfactorsEndpointOutputSchemas.getTemporaryTimeInformation,
	},
	'time.getTimeAccountSnapshot': {
		input: SapsuccessfactorsEndpointInputSchemas.getTimeAccountSnapshot,
		output: SapsuccessfactorsEndpointOutputSchemas.getTimeAccountSnapshot,
	},
	'query.queryAllAvailableClockClockOut': {
		input: SapsuccessfactorsEndpointInputSchemas.queryAllAvailableClockClockOut,
		output:
			SapsuccessfactorsEndpointOutputSchemas.queryAllAvailableClockClockOut,
	},
	'query.queryClockClockOutGroupCodeTime': {
		input:
			SapsuccessfactorsEndpointInputSchemas.queryClockClockOutGroupCodeTime,
		output:
			SapsuccessfactorsEndpointOutputSchemas.queryClockClockOutGroupCodeTime,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const sapsuccessfactorsEndpointMeta = {
	'approve.approveCalibrationSession': {
		riskLevel: 'write',
		description: 'Approve Calibration Session',
	},
	'calibration.getCalibrationSessionById': {
		riskLevel: 'read',
		description: 'Get Calibration Session By ID',
	},
	'calibration.getCalibrationSessions': {
		riskLevel: 'read',
		description: 'Get Calibration Sessions',
	},
	'calibration.getCalibrationSubjectById': {
		riskLevel: 'read',
		description: 'Get Calibration Subject By ID',
	},
	'calibration.getCalibrationSubjectRatings': {
		riskLevel: 'read',
		description: 'Get Calibration Subject Ratings',
	},
	'calibration.updateCalibrationSubjectRatings': {
		riskLevel: 'write',
		description: 'Update Calibration Subject Ratings',
	},
	'odata.getOdataMetadataCalibSessionService': {
		riskLevel: 'read',
		description: 'Get Calibration Session Metadata',
	},
	'odata.getOdataMetadataOnboardingAddl': {
		riskLevel: 'read',
		description: 'Get Onboarding Additional Services Metadata',
	},
	'odata.getOdataMetadataForNominationService': {
		riskLevel: 'read',
		description: 'Get Nomination Service Metadata',
	},
	'odata.getOdataUserMetadata': {
		riskLevel: 'read',
		description: 'Get User Entity Metadata',
	},
	'odata.getOdataMetadataClockInclockOut': {
		riskLevel: 'read',
		description: 'Get Clock In/Out Integration Metadata',
	},
	'onboardee.createOnboardee': {
		riskLevel: 'write',
		description: 'Create Onboardee',
	},
	'onb2.getOnb2Process': {
		riskLevel: 'read',
		description: 'Get Onboarding 2.0 Processes',
	},
	'internal.updateInternalUsernameNewHiresAfter': {
		riskLevel: 'write',
		description: 'Update Username Post Hiring',
	},
	'a.createAFeedbackRequest': {
		riskLevel: 'write',
		description: 'Create a Feedback Request',
	},
	'feedback.getFeedbackRecordsServiceAvailable': {
		riskLevel: 'read',
		description: 'Get Feedback Records',
	},
	'pending.getPendingFeedbackRequestsFeedback': {
		riskLevel: 'read',
		description: 'Get Pending Feedback Requests',
	},
	'give.giveFeedbackOrRespondToAFeedbackRequest': {
		riskLevel: 'write',
		description: 'Give Feedback or Respond to Feedback Request',
	},
	'metadata.refreshMetadataContFeedbackService': {
		riskLevel: 'write',
		description: 'Refresh Metadata for Continuous Feedback',
	},
	'successor.createUpdateSuccessorNomination': {
		riskLevel: 'write',
		description: 'Create or Update Successor Nomination',
	},
	'nomination.deleteNominationPositionTalentPool': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Nomination',
	},
	'talent.getTalentPool': {
		riskLevel: 'read',
		description: 'Get Talent Pool',
	},
	'application.getApplicationInterview': {
		riskLevel: 'read',
		description: 'Get Application Interview',
	},
	'interview.getInterviewOverallAssessment': {
		riskLevel: 'read',
		description: 'Get Interview Overall Assessment',
	},
	'job.getJobApplication': {
		riskLevel: 'read',
		description: 'Get Job Application',
	},
	'job.getJobRequisition': {
		riskLevel: 'read',
		description: 'Get Job Requisition',
	},
	'job.getJobReqScreeningQuestion': {
		riskLevel: 'read',
		description: 'Get Job Requisition Screening Questions',
	},
	'candidates.listCandidates': {
		riskLevel: 'read',
		description: 'List Candidates',
	},
	'fo.getFoBusinessUnit': {
		riskLevel: 'read',
		description: 'Get FOBusinessUnit',
	},
	'fo.getFoCompany': {
		riskLevel: 'read',
		description: 'Get FOCompany Records',
	},
	'fo.getFoCostCenter': {
		riskLevel: 'read',
		description: 'Get Foundation Object Cost Centers',
	},
	'fo.getFoDepartment': {
		riskLevel: 'read',
		description: 'Get FODepartment Records',
	},
	'fo.getFoJobCode': {
		riskLevel: 'read',
		description: 'Get Foundation Object Job Codes',
	},
	'fo.getFoJobFunction': {
		riskLevel: 'read',
		description: 'Get Job Functions',
	},
	'fo.getFoLocation': {
		riskLevel: 'read',
		description: 'Get Foundation Object Location',
	},
	'fo.getFoPayGroup': {
		riskLevel: 'read',
		description: 'Get FOPayGroup',
	},
	'position.getPosition': {
		riskLevel: 'read',
		description: 'Get Position',
	},
	'custom.getCustomMdfObject': {
		riskLevel: 'read',
		description: 'Get Custom MDF Object',
	},
	'picklist.getPicklist': {
		riskLevel: 'read',
		description: 'Get Picklist',
	},
	'picklist.getPicklistOption': {
		riskLevel: 'read',
		description: 'Get Picklist Option',
	},
	'current.getCurrentUser': {
		riskLevel: 'read',
		description: 'Get Current User',
	},
	'users.listUsers': {
		riskLevel: 'read',
		description: 'List Users',
	},
	'per.getPerPersonById': {
		riskLevel: 'read',
		description: 'Get Person by ID',
	},
	'per.listPerPerson': {
		riskLevel: 'read',
		description: 'List Person Records',
	},
	'per.getPerPersonal': {
		riskLevel: 'read',
		description: 'Get Personal Information Records',
	},
	'background.getBackgroundEducation': {
		riskLevel: 'read',
		description: 'Get Background Education',
	},
	'background.getBackgroundMobility': {
		riskLevel: 'read',
		description: 'Get Background Mobility',
	},
	'emp.listEmpEmployment': {
		riskLevel: 'read',
		description: 'List Employee Employment Records',
	},
	'emp.getEmpEmploymentTermination': {
		riskLevel: 'read',
		description: 'Get Employee Employment Termination',
	},
	'emp.getEmpPayCompRecurring': {
		riskLevel: 'read',
		description: 'Get Recurring Pay Components',
	},
	'emp.getEmpPayCompNonRecurring': {
		riskLevel: 'read',
		description: 'Get Non-Recurring Pay Components',
	},
	'work.getWorkOrder': {
		riskLevel: 'read',
		description: 'Get Work Order',
	},
	'goal.getGoalPlanTemplate': {
		riskLevel: 'read',
		description: 'Get Goal Plan Template',
	},
	'goals.getGoalsByPlan': {
		riskLevel: 'read',
		description: 'Get Goals By Plan',
	},
	'form.getFormContent': {
		riskLevel: 'read',
		description: 'Get Form Content',
	},
	'learning.createLearningActivitiesBulk': {
		riskLevel: 'write',
		description: 'Create Learning Activities Bulk',
	},
	'cdp.getCdpLearningMetadata': {
		riskLevel: 'read',
		description: 'Get CDP Learning Metadata',
	},
	'cdp.refreshCdpLearningMetadata': {
		riskLevel: 'write',
		description: 'Refresh CDP Learning Metadata',
	},
	'employee.getEmployeeTime': {
		riskLevel: 'read',
		description: 'Get Employee Time',
	},
	'employee.getEmployeeTimesheet': {
		riskLevel: 'read',
		description: 'Get Employee Timesheet',
	},
	'temporary.getTemporaryTimeInformation': {
		riskLevel: 'read',
		description: 'Get Temporary Time Information',
	},
	'time.getTimeAccountSnapshot': {
		riskLevel: 'read',
		description: 'Get Time Account Snapshot',
	},
	'query.queryAllAvailableClockClockOut': {
		riskLevel: 'read',
		description: 'Query All Available Clock In/Clock Out Groups',
	},
	'query.queryClockClockOutGroupCodeTime': {
		riskLevel: 'read',
		description: 'Query Clock In/Clock Out Group By Code',
	},
} satisfies RequiredPluginEndpointMeta<typeof sapsuccessfactorsEndpointsNested>;

export const sapsuccessfactorsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSapsuccessfactorsPlugin<
	T extends SapsuccessfactorsPluginOptions,
> = CorsairPlugin<
	'sapsuccessfactors',
	typeof SapsuccessfactorsSchema,
	typeof sapsuccessfactorsEndpointsNested,
	typeof sapsuccessfactorsWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSapsuccessfactorsPlugin =
	BaseSapsuccessfactorsPlugin<SapsuccessfactorsPluginOptions>;
export type ExternalSapsuccessfactorsPlugin<
	T extends SapsuccessfactorsPluginOptions,
> = BaseSapsuccessfactorsPlugin<T>;

export function sapsuccessfactors<
	const T extends SapsuccessfactorsPluginOptions,
>(
	incomingOptions: SapsuccessfactorsPluginOptions &
		T = {} as SapsuccessfactorsPluginOptions & T,
): ExternalSapsuccessfactorsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'sapsuccessfactors',
		authConfig: sapsuccessfactorsAuthConfig,
		schema: SapsuccessfactorsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: sapsuccessfactorsEndpointsNested,
		webhooks: sapsuccessfactorsWebhooksNested,
		endpointMeta: sapsuccessfactorsEndpointMeta,
		endpointSchemas: sapsuccessfactorsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		keyBuilder: async (ctx: SapsuccessfactorsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			throw new AuthMissingError('sapsuccessfactors', 'api_key');
		},
	} satisfies InternalSapsuccessfactorsPlugin;
}

export type {
	SapsuccessfactorsEndpointInputs,
	SapsuccessfactorsEndpointOutputs,
} from './endpoints/types';
