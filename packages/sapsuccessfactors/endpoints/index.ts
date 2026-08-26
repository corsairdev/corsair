import { approveCalibrationSession } from './approve';
export const Approve = { approveCalibrationSession };

import {
	getCalibrationSessionById,
	getCalibrationSessions,
	getCalibrationSubjectById,
	getCalibrationSubjectRatings,
	updateCalibrationSubjectRatings,
} from './calibration';
export const Calibration = {
	getCalibrationSessionById,
	getCalibrationSessions,
	getCalibrationSubjectById,
	getCalibrationSubjectRatings,
	updateCalibrationSubjectRatings,
};

import {
	getOdataMetadataCalibSessionService,
	getOdataMetadataClockInclockOut,
	getOdataMetadataForNominationService,
	getOdataMetadataOnboardingAddl,
	getOdataUserMetadata,
} from './odata';
export const Odata = {
	getOdataMetadataCalibSessionService,
	getOdataMetadataOnboardingAddl,
	getOdataMetadataForNominationService,
	getOdataUserMetadata,
	getOdataMetadataClockInclockOut,
};

import { createOnboardee } from './onboardee';
export const Onboardee = { createOnboardee };

import { getOnb2Process } from './onb2';
export const Onb2 = { getOnb2Process };

import { updateInternalUsernameNewHiresAfter } from './internal';
export const Internal = { updateInternalUsernameNewHiresAfter };

import { createAFeedbackRequest } from './a';
export const A = { createAFeedbackRequest };

import { getFeedbackRecordsServiceAvailable } from './feedback';
export const Feedback = { getFeedbackRecordsServiceAvailable };

import { getPendingFeedbackRequestsFeedback } from './pending';
export const Pending = { getPendingFeedbackRequestsFeedback };

import { giveFeedbackOrRespondToAFeedbackRequest } from './give';
export const Give = { giveFeedbackOrRespondToAFeedbackRequest };

import { refreshMetadataContFeedbackService } from './metadata';
export const Metadata = { refreshMetadataContFeedbackService };

import { createUpdateSuccessorNomination } from './successor';
export const Successor = { createUpdateSuccessorNomination };

import { deleteNominationPositionTalentPool } from './nomination';
export const Nomination = { deleteNominationPositionTalentPool };

import { getTalentPool } from './talent';
export const Talent = { getTalentPool };

import { getApplicationInterview } from './application';
export const Application = { getApplicationInterview };

import { getInterviewOverallAssessment } from './interview';
export const Interview = { getInterviewOverallAssessment };

import {
	getJobApplication,
	getJobReqScreeningQuestion,
	getJobRequisition,
} from './job';
export const Job = {
	getJobApplication,
	getJobRequisition,
	getJobReqScreeningQuestion,
};

import { listCandidates } from './candidates';
export const Candidates = { listCandidates };

import {
	getFoBusinessUnit,
	getFoCompany,
	getFoCostCenter,
	getFoDepartment,
	getFoJobCode,
	getFoJobFunction,
	getFoLocation,
	getFoPayGroup,
} from './fo';
export const Fo = {
	getFoBusinessUnit,
	getFoCompany,
	getFoCostCenter,
	getFoDepartment,
	getFoJobCode,
	getFoJobFunction,
	getFoLocation,
	getFoPayGroup,
};

import { getPosition } from './position';
export const Position = { getPosition };

import { getCustomMdfObject } from './custom';
export const Custom = { getCustomMdfObject };

import { getPicklist, getPicklistOption } from './picklist';
export const Picklist = { getPicklist, getPicklistOption };

import { getCurrentUser } from './current';
export const Current = { getCurrentUser };

import { listUsers } from './users';
export const Users = { listUsers };

import { getPerPersonal, getPerPersonById, listPerPerson } from './per';
export const Per = { getPerPersonById, listPerPerson, getPerPersonal };

import { getBackgroundEducation, getBackgroundMobility } from './background';
export const Background = { getBackgroundEducation, getBackgroundMobility };

import {
	getEmpEmploymentTermination,
	getEmpPayCompNonRecurring,
	getEmpPayCompRecurring,
	listEmpEmployment,
} from './emp';
export const Emp = {
	listEmpEmployment,
	getEmpEmploymentTermination,
	getEmpPayCompRecurring,
	getEmpPayCompNonRecurring,
};

import { getWorkOrder } from './work';
export const Work = { getWorkOrder };

import { getGoalPlanTemplate } from './goal';
export const Goal = { getGoalPlanTemplate };

import { getGoalsByPlan } from './goals';
export const Goals = { getGoalsByPlan };

import { getFormContent } from './form';
export const Form = { getFormContent };

import { createLearningActivitiesBulk } from './learning';
export const Learning = { createLearningActivitiesBulk };

import { getCdpLearningMetadata, refreshCdpLearningMetadata } from './cdp';
export const Cdp = { getCdpLearningMetadata, refreshCdpLearningMetadata };

import { getEmployeeTime, getEmployeeTimesheet } from './employee';
export const Employee = { getEmployeeTime, getEmployeeTimesheet };

import { getTemporaryTimeInformation } from './temporary';
export const Temporary = { getTemporaryTimeInformation };

import { getTimeAccountSnapshot } from './time';
export const Time = { getTimeAccountSnapshot };

import {
	queryAllAvailableClockClockOut,
	queryClockClockOutGroupCodeTime,
} from './query';
export const Query = {
	queryAllAvailableClockClockOut,
	queryClockClockOutGroupCodeTime,
};

export * from './types';
