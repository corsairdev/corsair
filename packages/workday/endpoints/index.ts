import {
	createBusinessTitleChange,
	getBusinessTitleChange,
	getBusinessTitleChangeForWorker,
} from './business';
export const Business = {
	createBusinessTitleChange,
	getBusinessTitleChange,
	getBusinessTitleChangeForWorker,
};

import {
	createJobChange,
	getJobById,
	getJobChangeFrequencies,
	getJobChangeLocationInfo,
	getJobChangePosition,
	getJobChangeReasonInstance,
	getJobChangeReasons,
	getJobChangeReasonValues,
	getJobChangesGroupTemplates,
	getJobChangesJobValues,
	getJobChangesWorkerValues,
	getJobClassifications,
	getJobPosting,
	getJobPostingQuestionnaire,
	getJobProfilesValues,
	getJobRequisitionValues,
	getJobWorkspace,
	getJobWorkspaces,
	listJobPostings,
	updateJobChangeBusinessTitle,
} from './job';
export const Job = {
	createJobChange,
	getJobById,
	getJobChangeFrequencies,
	getJobChangeLocationInfo,
	getJobChangePosition,
	getJobChangeReasonInstance,
	getJobChangeReasonValues,
	getJobChangeReasons,
	getJobChangesGroupTemplates,
	getJobChangesJobValues,
	getJobChangesWorkerValues,
	getJobClassifications,
	getJobPosting,
	getJobPostingQuestionnaire,
	getJobProfilesValues,
	getJobRequisitionValues,
	getJobWorkspace,
	getJobWorkspaces,
	listJobPostings,
	updateJobChangeBusinessTitle,
};

import { createPayrollInputs, getPayrollInputInstance } from './payroll';
export const Payroll = { createPayrollInputs, getPayrollInputInstance };

import {
	createTimeOffRequest,
	getTimeOffEntriesForWorker,
	getTimeOffPlansForWorker,
	getTimeOffStatusValues,
	getTimeTypes,
} from './time';
export const Time = {
	createTimeOffRequest,
	getTimeOffEntriesForWorker,
	getTimeOffPlansForWorker,
	getTimeOffStatusValues,
	getTimeTypes,
};

import { getAbsenceBalance } from './absence';
export const Absence = { getAbsenceBalance };

import {
	getAssignmentChangeGroupCostCenters,
	getAssignmentChangeGroupJobs,
	getAssignmentTypes,
} from './assignment';
export const Assignment = {
	getAssignmentChangeGroupCostCenters,
	getAssignmentChangeGroupJobs,
	getAssignmentTypes,
};

import { getCandidateAvailabilityTemplate } from './candidate';
export const Candidate = { getCandidateAvailabilityTemplate };

import { getCollectionOfJobs, getCollectionOfPayroll } from './collection';
export const Collection = { getCollectionOfJobs, getCollectionOfPayroll };

import { getCompanyInsiderTypes } from './company';
export const Company = { getCompanyInsiderTypes };

import { getContingentWorkerTypes } from './contingent';
export const Contingent = { getContingentWorkerTypes };

import { getCountryInfo } from './country';
export const Country = { getCountryInfo };

import { getCurrencies } from './currencies';
export const Currencies = { getCurrencies };

import { getCurrentUser } from './current';
export const Current = { getCurrentUser };

import { getGrants } from './grants';
export const Grants = { getGrants };

import { getHeadcountOptions } from './headcount';
export const Headcount = { getHeadcountOptions };

import {
	getHistoryInstanceForWorker,
	getHistoryItemsForWorker,
} from './history';
export const History = {
	getHistoryInstanceForWorker,
	getHistoryItemsForWorker,
};

import { getHolidayEvents } from './holiday';
export const Holiday = { getHolidayEvents };

import { getInterview, getInterviewFeedback2 } from './interview';
export const Interview = { getInterview, getInterviewFeedback2 };

import { getLeaveStatusValues } from './leave';
export const Leave = { getLeaveStatusValues };

import { getMyJobPostings } from './my';
export const My = { getMyJobPostings };

import {
	getOrganizationAssignmentBusinessUnits,
	getOrganizationAssignmentCustoms,
	getOrganizationAssignmentFunds,
	getOrganizationAssignmentRegions,
	getOrganizationAssignmentWorkers,
} from './organization';
export const Organization = {
	getOrganizationAssignmentBusinessUnits,
	getOrganizationAssignmentCustoms,
	getOrganizationAssignmentFunds,
	getOrganizationAssignmentRegions,
	getOrganizationAssignmentWorkers,
};

import {
	getPayGroupByJobId,
	getPaySlipInstancesForWorker,
	getPaySlipsForWorker,
} from './pay';
export const Pay = {
	getPayGroupByJobId,
	getPaySlipInstancesForWorker,
	getPaySlipsForWorker,
};

import { getProposedPositionValues } from './proposed';
export const Proposed = { getProposedPositionValues };

import {
	getProspect,
	getProspectEducations,
	getProspectExperiences,
	getProspectResumeAttachments,
	getProspectSkills,
} from './prospect';
export const Prospect = {
	getProspect,
	getProspectEducations,
	getProspectExperiences,
	getProspectResumeAttachments,
	getProspectSkills,
};

import { getSupervisoryOrgValues } from './supervisory';
export const Supervisory = { getSupervisoryOrgValues };

import { getWorkStudyAwards } from './work';
export const Work = { getWorkStudyAwards };

import {
	getWorkerBusinessTitleChanges,
	getWorkerEligibleAbsenceTypes,
	getWorkerInfo,
	getWorkerLeavesOfAbsence,
	getWorkerServiceDates,
	getWorkerStaffingInformation,
	getWorkerTimeOffDetails,
	getWorkerTypes,
	getWorkerValidTimeOffDates,
	retrieveWorkerLeaveOfAbsenceSubresource,
} from './worker';
export const Worker = {
	getWorkerBusinessTitleChanges,
	getWorkerEligibleAbsenceTypes,
	getWorkerInfo,
	getWorkerLeavesOfAbsence,
	getWorkerServiceDates,
	getWorkerStaffingInformation,
	getWorkerTimeOffDetails,
	getWorkerTypes,
	getWorkerValidTimeOffDates,
	retrieveWorkerLeaveOfAbsenceSubresource,
};

import { getWorkersCollectionStaffing } from './workers';
export const Workers = { getWorkersCollectionStaffing };

import { getWorkspaceInstances } from './workspace';
export const Workspace = { getWorkspaceInstances };

import { listBalances } from './balances';
export const Balances = { listBalances };

import { listCountries } from './countries';
export const Countries = { listCountries };

import { listInterviews } from './interviews';
export const Interviews = { listInterviews };

import { listJobs } from './jobs';
export const Jobs = { listJobs };

import { updateAnExistingPayroll } from './an';
export const An = { updateAnExistingPayroll };

import { updateMessageTemplateById } from './message';
export const Message = { updateMessageTemplateById };

export * from './types';
