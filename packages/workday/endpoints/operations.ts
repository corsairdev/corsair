import { createWorkdayEndpoint } from './factory';
import type { WorkdayRouteName } from './routes';
import { workdayRoutes } from './routes';

export const workdayOperations = Object.fromEntries(
	workdayRoutes.map((route) => [route.name, createWorkdayEndpoint(route.name)]),
) as { [K in WorkdayRouteName]: ReturnType<typeof createWorkdayEndpoint> };

export const workdayEndpointsNested = {
	business: {
		createBusinessTitleChange: workdayOperations.createBusinessTitleChange,
		getBusinessTitleChange: workdayOperations.getBusinessTitleChange,
		getBusinessTitleChangeForWorker:
			workdayOperations.getBusinessTitleChangeForWorker,
	},
	job: {
		createJobChange: workdayOperations.createJobChange,
		getJobById: workdayOperations.getJobById,
		getJobChangeFrequencies: workdayOperations.getJobChangeFrequencies,
		getJobChangeLocationInfo: workdayOperations.getJobChangeLocationInfo,
		getJobChangePosition: workdayOperations.getJobChangePosition,
		getJobChangeReasonInstance: workdayOperations.getJobChangeReasonInstance,
		getJobChangeReasonValues: workdayOperations.getJobChangeReasonValues,
		getJobChangeReasons: workdayOperations.getJobChangeReasons,
		getJobChangesGroupTemplates: workdayOperations.getJobChangesGroupTemplates,
		getJobChangesJobValues: workdayOperations.getJobChangesJobValues,
		getJobChangesWorkerValues: workdayOperations.getJobChangesWorkerValues,
		getJobClassifications: workdayOperations.getJobClassifications,
		getJobPosting: workdayOperations.getJobPosting,
		getJobPostingQuestionnaire: workdayOperations.getJobPostingQuestionnaire,
		getJobProfilesValues: workdayOperations.getJobProfilesValues,
		getJobRequisitionValues: workdayOperations.getJobRequisitionValues,
		getJobWorkspace: workdayOperations.getJobWorkspace,
		getJobWorkspaces: workdayOperations.getJobWorkspaces,
		listJobPostings: workdayOperations.listJobPostings,
		updateJobChangeBusinessTitle:
			workdayOperations.updateJobChangeBusinessTitle,
	},
	payroll: {
		createPayrollInputs: workdayOperations.createPayrollInputs,
		getPayrollInputInstance: workdayOperations.getPayrollInputInstance,
		updateAnExistingPayroll: workdayOperations.updateAnExistingPayroll,
	},
	collection: {
		getCollectionOfPayroll: workdayOperations.getCollectionOfPayroll,
		getCollectionOfJobs: workdayOperations.getCollectionOfJobs,
	},
	time: {
		createTimeOffRequest: workdayOperations.createTimeOffRequest,
		getTimeOffEntriesForWorker: workdayOperations.getTimeOffEntriesForWorker,
		getTimeOffPlansForWorker: workdayOperations.getTimeOffPlansForWorker,
		getTimeOffStatusValues: workdayOperations.getTimeOffStatusValues,
		getTimeTypes: workdayOperations.getTimeTypes,
	},
	absence: {
		getAbsenceBalance: workdayOperations.getAbsenceBalance,
	},
	balances: {
		listBalances: workdayOperations.listBalances,
	},
	assignment: {
		getAssignmentChangeGroupCostCenters:
			workdayOperations.getAssignmentChangeGroupCostCenters,
		getAssignmentChangeGroupJobs:
			workdayOperations.getAssignmentChangeGroupJobs,
		getAssignmentTypes: workdayOperations.getAssignmentTypes,
	},
	candidate: {
		getCandidateAvailabilityTemplate:
			workdayOperations.getCandidateAvailabilityTemplate,
	},
	company: {
		getCompanyInsiderTypes: workdayOperations.getCompanyInsiderTypes,
	},
	contingent: {
		getContingentWorkerTypes: workdayOperations.getContingentWorkerTypes,
	},
	country: {
		getCountryInfo: workdayOperations.getCountryInfo,
	},
	currencies: {
		getCurrencies: workdayOperations.getCurrencies,
	},
	current: {
		getCurrentUser: workdayOperations.getCurrentUser,
	},
	grants: {
		getGrants: workdayOperations.getGrants,
	},
	headcount: {
		getHeadcountOptions: workdayOperations.getHeadcountOptions,
	},
	history: {
		getHistoryInstanceForWorker: workdayOperations.getHistoryInstanceForWorker,
		getHistoryItemsForWorker: workdayOperations.getHistoryItemsForWorker,
	},
	holiday: {
		getHolidayEvents: workdayOperations.getHolidayEvents,
	},
	interview: {
		getInterview: workdayOperations.getInterview,
		getInterviewFeedback2: workdayOperations.getInterviewFeedback2,
	},
	leave: {
		getLeaveStatusValues: workdayOperations.getLeaveStatusValues,
	},
	my: {
		getMyJobPostings: workdayOperations.getMyJobPostings,
	},
	organization: {
		getOrganizationAssignmentBusinessUnits:
			workdayOperations.getOrganizationAssignmentBusinessUnits,
		getOrganizationAssignmentCustoms:
			workdayOperations.getOrganizationAssignmentCustoms,
		getOrganizationAssignmentFunds:
			workdayOperations.getOrganizationAssignmentFunds,
		getOrganizationAssignmentRegions:
			workdayOperations.getOrganizationAssignmentRegions,
		getOrganizationAssignmentWorkers:
			workdayOperations.getOrganizationAssignmentWorkers,
	},
	pay: {
		getPayGroupByJobId: workdayOperations.getPayGroupByJobId,
		getPaySlipInstancesForWorker:
			workdayOperations.getPaySlipInstancesForWorker,
		getPaySlipsForWorker: workdayOperations.getPaySlipsForWorker,
	},
	proposed: {
		getProposedPositionValues: workdayOperations.getProposedPositionValues,
	},
	prospect: {
		getProspect: workdayOperations.getProspect,
		getProspectEducations: workdayOperations.getProspectEducations,
		getProspectExperiences: workdayOperations.getProspectExperiences,
		getProspectResumeAttachments:
			workdayOperations.getProspectResumeAttachments,
		getProspectSkills: workdayOperations.getProspectSkills,
	},
	supervisory: {
		getSupervisoryOrgValues: workdayOperations.getSupervisoryOrgValues,
	},
	work: {
		getWorkStudyAwards: workdayOperations.getWorkStudyAwards,
	},
	worker: {
		getWorkerBusinessTitleChanges:
			workdayOperations.getWorkerBusinessTitleChanges,
		getWorkerEligibleAbsenceTypes:
			workdayOperations.getWorkerEligibleAbsenceTypes,
		getWorkerInfo: workdayOperations.getWorkerInfo,
		getWorkerLeavesOfAbsence: workdayOperations.getWorkerLeavesOfAbsence,
		getWorkerServiceDates: workdayOperations.getWorkerServiceDates,
		getWorkerStaffingInformation:
			workdayOperations.getWorkerStaffingInformation,
		getWorkerTimeOffDetails: workdayOperations.getWorkerTimeOffDetails,
		getWorkerTypes: workdayOperations.getWorkerTypes,
		getWorkerValidTimeOffDates: workdayOperations.getWorkerValidTimeOffDates,
		retrieveWorkerLeaveOfAbsenceSubresource:
			workdayOperations.retrieveWorkerLeaveOfAbsenceSubresource,
	},
	workers: {
		getWorkersCollectionStaffing:
			workdayOperations.getWorkersCollectionStaffing,
	},
	workspace: {
		getWorkspaceInstances: workdayOperations.getWorkspaceInstances,
	},
	countries: {
		listCountries: workdayOperations.listCountries,
	},
	interviews: {
		listInterviews: workdayOperations.listInterviews,
	},
	jobs: {
		listJobs: workdayOperations.listJobs,
	},
	message: {
		updateMessageTemplateById: workdayOperations.updateMessageTemplateById,
	},
} as const;

export const Business = workdayEndpointsNested.business;
export const Job = workdayEndpointsNested.job;
export const Payroll = workdayEndpointsNested.payroll;
export const Collection = workdayEndpointsNested.collection;
export const Time = workdayEndpointsNested.time;
export const Absence = workdayEndpointsNested.absence;
export const Balances = workdayEndpointsNested.balances;
export const Assignment = workdayEndpointsNested.assignment;
export const Candidate = workdayEndpointsNested.candidate;
export const Company = workdayEndpointsNested.company;
export const Contingent = workdayEndpointsNested.contingent;
export const Country = workdayEndpointsNested.country;
export const Currencies = workdayEndpointsNested.currencies;
export const Current = workdayEndpointsNested.current;
export const Grants = workdayEndpointsNested.grants;
export const Headcount = workdayEndpointsNested.headcount;
export const History = workdayEndpointsNested.history;
export const Holiday = workdayEndpointsNested.holiday;
export const Interview = workdayEndpointsNested.interview;
export const Leave = workdayEndpointsNested.leave;
export const My = workdayEndpointsNested.my;
export const Organization = workdayEndpointsNested.organization;
export const Pay = workdayEndpointsNested.pay;
export const Proposed = workdayEndpointsNested.proposed;
export const Prospect = workdayEndpointsNested.prospect;
export const Supervisory = workdayEndpointsNested.supervisory;
export const Work = workdayEndpointsNested.work;
export const Worker = workdayEndpointsNested.worker;
export const Workers = workdayEndpointsNested.workers;
export const Workspace = workdayEndpointsNested.workspace;
export const Countries = workdayEndpointsNested.countries;
export const Interviews = workdayEndpointsNested.interviews;
export const Jobs = workdayEndpointsNested.jobs;
export const Message = workdayEndpointsNested.message;
