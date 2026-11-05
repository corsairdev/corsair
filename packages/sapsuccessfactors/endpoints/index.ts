import { createSapEndpoint } from './factory';
import type { SapRouteName } from './routes';
import { sapRoutes } from './routes';

export const sapOperations = Object.fromEntries(
	sapRoutes.map((route) => [route.name, createSapEndpoint(route.name)]),
) as { [K in SapRouteName]: ReturnType<typeof createSapEndpoint> };

export const sapsuccessfactorsEndpointsNested = {
	approve: {
		approveCalibrationSession: sapOperations.approveCalibrationSession,
	},
	calibration: {
		getCalibrationSessionById: sapOperations.getCalibrationSessionById,
		getCalibrationSessions: sapOperations.getCalibrationSessions,
		getCalibrationSubjectById: sapOperations.getCalibrationSubjectById,
		getCalibrationSubjectRatings: sapOperations.getCalibrationSubjectRatings,
		updateCalibrationSubjectRatings:
			sapOperations.updateCalibrationSubjectRatings,
	},
	odata: {
		getOdataMetadataCalibSessionService:
			sapOperations.getOdataMetadataCalibSessionService,
		getOdataMetadataOnboardingAddl:
			sapOperations.getOdataMetadataOnboardingAddl,
		getOdataMetadataForNominationService:
			sapOperations.getOdataMetadataForNominationService,
		getOdataUserMetadata: sapOperations.getOdataUserMetadata,
		getOdataMetadataClockInclockOut:
			sapOperations.getOdataMetadataClockInclockOut,
	},
	onboardee: { createOnboardee: sapOperations.createOnboardee },
	onb2: { getOnb2Process: sapOperations.getOnb2Process },
	internal: {
		updateInternalUsernameNewHiresAfter:
			sapOperations.updateInternalUsernameNewHiresAfter,
	},
	a: { createAFeedbackRequest: sapOperations.createAFeedbackRequest },
	feedback: {
		getFeedbackRecordsServiceAvailable:
			sapOperations.getFeedbackRecordsServiceAvailable,
	},
	pending: {
		getPendingFeedbackRequestsFeedback:
			sapOperations.getPendingFeedbackRequestsFeedback,
	},
	give: {
		giveFeedbackOrRespondToAFeedbackRequest:
			sapOperations.giveFeedbackOrRespondToAFeedbackRequest,
	},
	metadata: {
		refreshMetadataContFeedbackService:
			sapOperations.refreshMetadataContFeedbackService,
	},
	successor: {
		createUpdateSuccessorNomination:
			sapOperations.createUpdateSuccessorNomination,
	},
	nomination: {
		deleteNominationPositionTalentPool:
			sapOperations.deleteNominationPositionTalentPool,
	},
	talent: { getTalentPool: sapOperations.getTalentPool },
	application: {
		getApplicationInterview: sapOperations.getApplicationInterview,
	},
	interview: {
		getInterviewOverallAssessment: sapOperations.getInterviewOverallAssessment,
	},
	job: {
		getJobApplication: sapOperations.getJobApplication,
		getJobRequisition: sapOperations.getJobRequisition,
		getJobReqScreeningQuestion: sapOperations.getJobReqScreeningQuestion,
	},
	candidates: { listCandidates: sapOperations.listCandidates },
	fo: {
		getFoBusinessUnit: sapOperations.getFoBusinessUnit,
		getFoCompany: sapOperations.getFoCompany,
		getFoCostCenter: sapOperations.getFoCostCenter,
		getFoDepartment: sapOperations.getFoDepartment,
		getFoJobCode: sapOperations.getFoJobCode,
		getFoJobFunction: sapOperations.getFoJobFunction,
		getFoLocation: sapOperations.getFoLocation,
		getFoPayGroup: sapOperations.getFoPayGroup,
	},
	position: { getPosition: sapOperations.getPosition },
	custom: { getCustomMdfObject: sapOperations.getCustomMdfObject },
	picklist: {
		getPicklist: sapOperations.getPicklist,
		getPicklistOption: sapOperations.getPicklistOption,
	},
	current: { getCurrentUser: sapOperations.getCurrentUser },
	users: { listUsers: sapOperations.listUsers },
	per: {
		getPerPersonById: sapOperations.getPerPersonById,
		listPerPerson: sapOperations.listPerPerson,
		getPerPersonal: sapOperations.getPerPersonal,
	},
	background: {
		getBackgroundEducation: sapOperations.getBackgroundEducation,
		getBackgroundMobility: sapOperations.getBackgroundMobility,
	},
	emp: {
		listEmpEmployment: sapOperations.listEmpEmployment,
		getEmpEmploymentTermination: sapOperations.getEmpEmploymentTermination,
		getEmpPayCompRecurring: sapOperations.getEmpPayCompRecurring,
		getEmpPayCompNonRecurring: sapOperations.getEmpPayCompNonRecurring,
	},
	work: { getWorkOrder: sapOperations.getWorkOrder },
	goal: { getGoalPlanTemplate: sapOperations.getGoalPlanTemplate },
	goals: { getGoalsByPlan: sapOperations.getGoalsByPlan },
	form: { getFormContent: sapOperations.getFormContent },
	learning: {
		createLearningActivitiesBulk: sapOperations.createLearningActivitiesBulk,
	},
	cdp: {
		getCdpLearningMetadata: sapOperations.getCdpLearningMetadata,
		refreshCdpLearningMetadata: sapOperations.refreshCdpLearningMetadata,
	},
	employee: {
		getEmployeeTime: sapOperations.getEmployeeTime,
		getEmployeeTimesheet: sapOperations.getEmployeeTimesheet,
	},
	temporary: {
		getTemporaryTimeInformation: sapOperations.getTemporaryTimeInformation,
	},
	time: { getTimeAccountSnapshot: sapOperations.getTimeAccountSnapshot },
	query: {
		queryAllAvailableClockClockOut:
			sapOperations.queryAllAvailableClockClockOut,
		queryClockClockOutGroupCodeTime:
			sapOperations.queryClockClockOutGroupCodeTime,
	},
} as const;

export { createSapEndpoint, executeSapOperation } from './factory';
export type { SapRoute, SapRouteName } from './routes';
export { getSapRoute, sapRouteByName, sapRoutes } from './routes';
export type {
	SapsuccessfactorsEndpointInputs,
	SapsuccessfactorsEndpointOutputs,
} from './types';
export {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
} from './types';
