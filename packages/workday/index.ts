import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairContext,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	ProviderDisplayNames,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import {
	Absence,
	An,
	Assignment,
	Balances,
	Business,
	Candidate,
	Collection,
	Company,
	Contingent,
	Countries,
	Country,
	Currencies,
	Current,
	Grants,
	Headcount,
	History,
	Holiday,
	Interview,
	Interviews,
	Job,
	Jobs,
	Leave,
	Message,
	My,
	Organization,
	Pay,
	Payroll,
	Proposed,
	Prospect,
	Supervisory,
	Time,
	Work,
	Worker,
	Workers,
	Workspace,
} from './endpoints';
import type {
	WorkdayEndpointInputs,
	WorkdayEndpointOutputs,
} from './endpoints/types';
import {
	WorkdayEndpointInputSchemas,
	WorkdayEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WorkdaySchema } from './schema';
import { resolveWorkdayOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchWorkdayTenantWebhook } from './webhooks/tenant-matcher';
import type { WorkdayWebhookOutputs } from './webhooks/types';

export type WorkdayPluginOptions = {
	/** Workday integration for Corsair */
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalWorkdayPlugin['hooks'];
	webhookHooks?: InternalWorkdayPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof workdayEndpointsNested>;
};

export type WorkdayContext = CorsairPluginContext<
	typeof WorkdaySchema,
	WorkdayPluginOptions
>;
export type WorkdayKeyBuilderContext = KeyBuilderContext<WorkdayPluginOptions>;
export type WorkdayBoundEndpoints = BindEndpoints<
	typeof workdayEndpointsNested
>;

type WorkdayEndpoint<K extends keyof WorkdayEndpointOutputs> = CorsairEndpoint<
	WorkdayContext,
	WorkdayEndpointInputs[K],
	WorkdayEndpointOutputs[K]
>;

export type WorkdayEndpoints = {
	createBusinessTitleChange: WorkdayEndpoint<'createBusinessTitleChange'>;
	getBusinessTitleChange: WorkdayEndpoint<'getBusinessTitleChange'>;
	getBusinessTitleChangeForWorker: WorkdayEndpoint<'getBusinessTitleChangeForWorker'>;
	createJobChange: WorkdayEndpoint<'createJobChange'>;
	getJobById: WorkdayEndpoint<'getJobById'>;
	getJobChangeFrequencies: WorkdayEndpoint<'getJobChangeFrequencies'>;
	getJobChangeLocationInfo: WorkdayEndpoint<'getJobChangeLocationInfo'>;
	getJobChangePosition: WorkdayEndpoint<'getJobChangePosition'>;
	getJobChangeReasonInstance: WorkdayEndpoint<'getJobChangeReasonInstance'>;
	getJobChangeReasonValues: WorkdayEndpoint<'getJobChangeReasonValues'>;
	getJobChangeReasons: WorkdayEndpoint<'getJobChangeReasons'>;
	getJobChangesGroupTemplates: WorkdayEndpoint<'getJobChangesGroupTemplates'>;
	getJobChangesJobValues: WorkdayEndpoint<'getJobChangesJobValues'>;
	getJobChangesWorkerValues: WorkdayEndpoint<'getJobChangesWorkerValues'>;
	getJobClassifications: WorkdayEndpoint<'getJobClassifications'>;
	getJobPosting: WorkdayEndpoint<'getJobPosting'>;
	getJobPostingQuestionnaire: WorkdayEndpoint<'getJobPostingQuestionnaire'>;
	getJobProfilesValues: WorkdayEndpoint<'getJobProfilesValues'>;
	getJobRequisitionValues: WorkdayEndpoint<'getJobRequisitionValues'>;
	getJobWorkspace: WorkdayEndpoint<'getJobWorkspace'>;
	getJobWorkspaces: WorkdayEndpoint<'getJobWorkspaces'>;
	listJobPostings: WorkdayEndpoint<'listJobPostings'>;
	updateJobChangeBusinessTitle: WorkdayEndpoint<'updateJobChangeBusinessTitle'>;
	createPayrollInputs: WorkdayEndpoint<'createPayrollInputs'>;
	getPayrollInputInstance: WorkdayEndpoint<'getPayrollInputInstance'>;
	createTimeOffRequest: WorkdayEndpoint<'createTimeOffRequest'>;
	getTimeOffEntriesForWorker: WorkdayEndpoint<'getTimeOffEntriesForWorker'>;
	getTimeOffPlansForWorker: WorkdayEndpoint<'getTimeOffPlansForWorker'>;
	getTimeOffStatusValues: WorkdayEndpoint<'getTimeOffStatusValues'>;
	getTimeTypes: WorkdayEndpoint<'getTimeTypes'>;
	getAbsenceBalance: WorkdayEndpoint<'getAbsenceBalance'>;
	getAssignmentChangeGroupCostCenters: WorkdayEndpoint<'getAssignmentChangeGroupCostCenters'>;
	getAssignmentChangeGroupJobs: WorkdayEndpoint<'getAssignmentChangeGroupJobs'>;
	getAssignmentTypes: WorkdayEndpoint<'getAssignmentTypes'>;
	getCandidateAvailabilityTemplate: WorkdayEndpoint<'getCandidateAvailabilityTemplate'>;
	getCollectionOfJobs: WorkdayEndpoint<'getCollectionOfJobs'>;
	getCollectionOfPayroll: WorkdayEndpoint<'getCollectionOfPayroll'>;
	getCompanyInsiderTypes: WorkdayEndpoint<'getCompanyInsiderTypes'>;
	getContingentWorkerTypes: WorkdayEndpoint<'getContingentWorkerTypes'>;
	getCountryInfo: WorkdayEndpoint<'getCountryInfo'>;
	getCurrencies: WorkdayEndpoint<'getCurrencies'>;
	getCurrentUser: WorkdayEndpoint<'getCurrentUser'>;
	getGrants: WorkdayEndpoint<'getGrants'>;
	getHeadcountOptions: WorkdayEndpoint<'getHeadcountOptions'>;
	getHistoryInstanceForWorker: WorkdayEndpoint<'getHistoryInstanceForWorker'>;
	getHistoryItemsForWorker: WorkdayEndpoint<'getHistoryItemsForWorker'>;
	getHolidayEvents: WorkdayEndpoint<'getHolidayEvents'>;
	getInterview: WorkdayEndpoint<'getInterview'>;
	getInterviewFeedback2: WorkdayEndpoint<'getInterviewFeedback2'>;
	getLeaveStatusValues: WorkdayEndpoint<'getLeaveStatusValues'>;
	getMyJobPostings: WorkdayEndpoint<'getMyJobPostings'>;
	getOrganizationAssignmentBusinessUnits: WorkdayEndpoint<'getOrganizationAssignmentBusinessUnits'>;
	getOrganizationAssignmentCustoms: WorkdayEndpoint<'getOrganizationAssignmentCustoms'>;
	getOrganizationAssignmentFunds: WorkdayEndpoint<'getOrganizationAssignmentFunds'>;
	getOrganizationAssignmentRegions: WorkdayEndpoint<'getOrganizationAssignmentRegions'>;
	getOrganizationAssignmentWorkers: WorkdayEndpoint<'getOrganizationAssignmentWorkers'>;
	getPayGroupByJobId: WorkdayEndpoint<'getPayGroupByJobId'>;
	getPaySlipInstancesForWorker: WorkdayEndpoint<'getPaySlipInstancesForWorker'>;
	getPaySlipsForWorker: WorkdayEndpoint<'getPaySlipsForWorker'>;
	getProposedPositionValues: WorkdayEndpoint<'getProposedPositionValues'>;
	getProspect: WorkdayEndpoint<'getProspect'>;
	getProspectEducations: WorkdayEndpoint<'getProspectEducations'>;
	getProspectExperiences: WorkdayEndpoint<'getProspectExperiences'>;
	getProspectResumeAttachments: WorkdayEndpoint<'getProspectResumeAttachments'>;
	getProspectSkills: WorkdayEndpoint<'getProspectSkills'>;
	getSupervisoryOrgValues: WorkdayEndpoint<'getSupervisoryOrgValues'>;
	getWorkStudyAwards: WorkdayEndpoint<'getWorkStudyAwards'>;
	getWorkerBusinessTitleChanges: WorkdayEndpoint<'getWorkerBusinessTitleChanges'>;
	getWorkerEligibleAbsenceTypes: WorkdayEndpoint<'getWorkerEligibleAbsenceTypes'>;
	getWorkerInfo: WorkdayEndpoint<'getWorkerInfo'>;
	getWorkerLeavesOfAbsence: WorkdayEndpoint<'getWorkerLeavesOfAbsence'>;
	getWorkerServiceDates: WorkdayEndpoint<'getWorkerServiceDates'>;
	getWorkerStaffingInformation: WorkdayEndpoint<'getWorkerStaffingInformation'>;
	getWorkerTimeOffDetails: WorkdayEndpoint<'getWorkerTimeOffDetails'>;
	getWorkerTypes: WorkdayEndpoint<'getWorkerTypes'>;
	getWorkerValidTimeOffDates: WorkdayEndpoint<'getWorkerValidTimeOffDates'>;
	retrieveWorkerLeaveOfAbsenceSubresource: WorkdayEndpoint<'retrieveWorkerLeaveOfAbsenceSubresource'>;
	getWorkersCollectionStaffing: WorkdayEndpoint<'getWorkersCollectionStaffing'>;
	getWorkspaceInstances: WorkdayEndpoint<'getWorkspaceInstances'>;
	listBalances: WorkdayEndpoint<'listBalances'>;
	listCountries: WorkdayEndpoint<'listCountries'>;
	listInterviews: WorkdayEndpoint<'listInterviews'>;
	listJobs: WorkdayEndpoint<'listJobs'>;
	updateAnExistingPayroll: WorkdayEndpoint<'updateAnExistingPayroll'>;
	updateMessageTemplateById: WorkdayEndpoint<'updateMessageTemplateById'>;
};

export type WorkdayBoundWebhooks = BindWebhooks<{
	'worker.updated': CorsairWebhook<CorsairContext, unknown, unknown>;
}>;

const workdayEndpointsNested = {
	business: {
		createBusinessTitleChange: Business.createBusinessTitleChange,
		getBusinessTitleChange: Business.getBusinessTitleChange,
		getBusinessTitleChangeForWorker: Business.getBusinessTitleChangeForWorker,
	},
	job: {
		createJobChange: Job.createJobChange,
		getJobById: Job.getJobById,
		getJobChangeFrequencies: Job.getJobChangeFrequencies,
		getJobChangeLocationInfo: Job.getJobChangeLocationInfo,
		getJobChangePosition: Job.getJobChangePosition,
		getJobChangeReasonInstance: Job.getJobChangeReasonInstance,
		getJobChangeReasonValues: Job.getJobChangeReasonValues,
		getJobChangeReasons: Job.getJobChangeReasons,
		getJobChangesGroupTemplates: Job.getJobChangesGroupTemplates,
		getJobChangesJobValues: Job.getJobChangesJobValues,
		getJobChangesWorkerValues: Job.getJobChangesWorkerValues,
		getJobClassifications: Job.getJobClassifications,
		getJobPosting: Job.getJobPosting,
		getJobPostingQuestionnaire: Job.getJobPostingQuestionnaire,
		getJobProfilesValues: Job.getJobProfilesValues,
		getJobRequisitionValues: Job.getJobRequisitionValues,
		getJobWorkspace: Job.getJobWorkspace,
		getJobWorkspaces: Job.getJobWorkspaces,
		listJobPostings: Job.listJobPostings,
		updateJobChangeBusinessTitle: Job.updateJobChangeBusinessTitle,
	},
	payroll: {
		createPayrollInputs: Payroll.createPayrollInputs,
		getPayrollInputInstance: Payroll.getPayrollInputInstance,
	},
	time: {
		createTimeOffRequest: Time.createTimeOffRequest,
		getTimeOffEntriesForWorker: Time.getTimeOffEntriesForWorker,
		getTimeOffPlansForWorker: Time.getTimeOffPlansForWorker,
		getTimeOffStatusValues: Time.getTimeOffStatusValues,
		getTimeTypes: Time.getTimeTypes,
	},
	absence: {
		getAbsenceBalance: Absence.getAbsenceBalance,
	},
	assignment: {
		getAssignmentChangeGroupCostCenters:
			Assignment.getAssignmentChangeGroupCostCenters,
		getAssignmentChangeGroupJobs: Assignment.getAssignmentChangeGroupJobs,
		getAssignmentTypes: Assignment.getAssignmentTypes,
	},
	candidate: {
		getCandidateAvailabilityTemplate:
			Candidate.getCandidateAvailabilityTemplate,
	},
	collection: {
		getCollectionOfJobs: Collection.getCollectionOfJobs,
		getCollectionOfPayroll: Collection.getCollectionOfPayroll,
	},
	company: {
		getCompanyInsiderTypes: Company.getCompanyInsiderTypes,
	},
	contingent: {
		getContingentWorkerTypes: Contingent.getContingentWorkerTypes,
	},
	country: {
		getCountryInfo: Country.getCountryInfo,
	},
	currencies: {
		getCurrencies: Currencies.getCurrencies,
	},
	current: {
		getCurrentUser: Current.getCurrentUser,
	},
	grants: {
		getGrants: Grants.getGrants,
	},
	headcount: {
		getHeadcountOptions: Headcount.getHeadcountOptions,
	},
	history: {
		getHistoryInstanceForWorker: History.getHistoryInstanceForWorker,
		getHistoryItemsForWorker: History.getHistoryItemsForWorker,
	},
	holiday: {
		getHolidayEvents: Holiday.getHolidayEvents,
	},
	interview: {
		getInterview: Interview.getInterview,
		getInterviewFeedback2: Interview.getInterviewFeedback2,
	},
	leave: {
		getLeaveStatusValues: Leave.getLeaveStatusValues,
	},
	my: {
		getMyJobPostings: My.getMyJobPostings,
	},
	organization: {
		getOrganizationAssignmentBusinessUnits:
			Organization.getOrganizationAssignmentBusinessUnits,
		getOrganizationAssignmentCustoms:
			Organization.getOrganizationAssignmentCustoms,
		getOrganizationAssignmentFunds: Organization.getOrganizationAssignmentFunds,
		getOrganizationAssignmentRegions:
			Organization.getOrganizationAssignmentRegions,
		getOrganizationAssignmentWorkers:
			Organization.getOrganizationAssignmentWorkers,
	},
	pay: {
		getPayGroupByJobId: Pay.getPayGroupByJobId,
		getPaySlipInstancesForWorker: Pay.getPaySlipInstancesForWorker,
		getPaySlipsForWorker: Pay.getPaySlipsForWorker,
	},
	proposed: {
		getProposedPositionValues: Proposed.getProposedPositionValues,
	},
	prospect: {
		getProspect: Prospect.getProspect,
		getProspectEducations: Prospect.getProspectEducations,
		getProspectExperiences: Prospect.getProspectExperiences,
		getProspectResumeAttachments: Prospect.getProspectResumeAttachments,
		getProspectSkills: Prospect.getProspectSkills,
	},
	supervisory: {
		getSupervisoryOrgValues: Supervisory.getSupervisoryOrgValues,
	},
	work: {
		getWorkStudyAwards: Work.getWorkStudyAwards,
	},
	worker: {
		getWorkerBusinessTitleChanges: Worker.getWorkerBusinessTitleChanges,
		getWorkerEligibleAbsenceTypes: Worker.getWorkerEligibleAbsenceTypes,
		getWorkerInfo: Worker.getWorkerInfo,
		getWorkerLeavesOfAbsence: Worker.getWorkerLeavesOfAbsence,
		getWorkerServiceDates: Worker.getWorkerServiceDates,
		getWorkerStaffingInformation: Worker.getWorkerStaffingInformation,
		getWorkerTimeOffDetails: Worker.getWorkerTimeOffDetails,
		getWorkerTypes: Worker.getWorkerTypes,
		getWorkerValidTimeOffDates: Worker.getWorkerValidTimeOffDates,
		retrieveWorkerLeaveOfAbsenceSubresource:
			Worker.retrieveWorkerLeaveOfAbsenceSubresource,
	},
	workers: {
		getWorkersCollectionStaffing: Workers.getWorkersCollectionStaffing,
	},
	workspace: {
		getWorkspaceInstances: Workspace.getWorkspaceInstances,
	},
	balances: {
		listBalances: Balances.listBalances,
	},
	countries: {
		listCountries: Countries.listCountries,
	},
	interviews: {
		listInterviews: Interviews.listInterviews,
	},
	jobs: {
		listJobs: Jobs.listJobs,
	},
	an: {
		updateAnExistingPayroll: An.updateAnExistingPayroll,
	},
	message: {
		updateMessageTemplateById: Message.updateMessageTemplateById,
	},
} as const;

const workdayWebhooksNested = {} as const;

export const workdayEndpointSchemas = {
	'business.createBusinessTitleChange': {
		input: WorkdayEndpointInputSchemas.createBusinessTitleChange,
		output: WorkdayEndpointOutputSchemas.createBusinessTitleChange,
	},
	'business.getBusinessTitleChange': {
		input: WorkdayEndpointInputSchemas.getBusinessTitleChange,
		output: WorkdayEndpointOutputSchemas.getBusinessTitleChange,
	},
	'business.getBusinessTitleChangeForWorker': {
		input: WorkdayEndpointInputSchemas.getBusinessTitleChangeForWorker,
		output: WorkdayEndpointOutputSchemas.getBusinessTitleChangeForWorker,
	},
	'job.createJobChange': {
		input: WorkdayEndpointInputSchemas.createJobChange,
		output: WorkdayEndpointOutputSchemas.createJobChange,
	},
	'job.getJobById': {
		input: WorkdayEndpointInputSchemas.getJobById,
		output: WorkdayEndpointOutputSchemas.getJobById,
	},
	'job.getJobChangeFrequencies': {
		input: WorkdayEndpointInputSchemas.getJobChangeFrequencies,
		output: WorkdayEndpointOutputSchemas.getJobChangeFrequencies,
	},
	'job.getJobChangeLocationInfo': {
		input: WorkdayEndpointInputSchemas.getJobChangeLocationInfo,
		output: WorkdayEndpointOutputSchemas.getJobChangeLocationInfo,
	},
	'job.getJobChangePosition': {
		input: WorkdayEndpointInputSchemas.getJobChangePosition,
		output: WorkdayEndpointOutputSchemas.getJobChangePosition,
	},
	'job.getJobChangeReasonInstance': {
		input: WorkdayEndpointInputSchemas.getJobChangeReasonInstance,
		output: WorkdayEndpointOutputSchemas.getJobChangeReasonInstance,
	},
	'job.getJobChangeReasonValues': {
		input: WorkdayEndpointInputSchemas.getJobChangeReasonValues,
		output: WorkdayEndpointOutputSchemas.getJobChangeReasonValues,
	},
	'job.getJobChangeReasons': {
		input: WorkdayEndpointInputSchemas.getJobChangeReasons,
		output: WorkdayEndpointOutputSchemas.getJobChangeReasons,
	},
	'job.getJobChangesGroupTemplates': {
		input: WorkdayEndpointInputSchemas.getJobChangesGroupTemplates,
		output: WorkdayEndpointOutputSchemas.getJobChangesGroupTemplates,
	},
	'job.getJobChangesJobValues': {
		input: WorkdayEndpointInputSchemas.getJobChangesJobValues,
		output: WorkdayEndpointOutputSchemas.getJobChangesJobValues,
	},
	'job.getJobChangesWorkerValues': {
		input: WorkdayEndpointInputSchemas.getJobChangesWorkerValues,
		output: WorkdayEndpointOutputSchemas.getJobChangesWorkerValues,
	},
	'job.getJobClassifications': {
		input: WorkdayEndpointInputSchemas.getJobClassifications,
		output: WorkdayEndpointOutputSchemas.getJobClassifications,
	},
	'job.getJobPosting': {
		input: WorkdayEndpointInputSchemas.getJobPosting,
		output: WorkdayEndpointOutputSchemas.getJobPosting,
	},
	'job.getJobPostingQuestionnaire': {
		input: WorkdayEndpointInputSchemas.getJobPostingQuestionnaire,
		output: WorkdayEndpointOutputSchemas.getJobPostingQuestionnaire,
	},
	'job.getJobProfilesValues': {
		input: WorkdayEndpointInputSchemas.getJobProfilesValues,
		output: WorkdayEndpointOutputSchemas.getJobProfilesValues,
	},
	'job.getJobRequisitionValues': {
		input: WorkdayEndpointInputSchemas.getJobRequisitionValues,
		output: WorkdayEndpointOutputSchemas.getJobRequisitionValues,
	},
	'job.getJobWorkspace': {
		input: WorkdayEndpointInputSchemas.getJobWorkspace,
		output: WorkdayEndpointOutputSchemas.getJobWorkspace,
	},
	'job.getJobWorkspaces': {
		input: WorkdayEndpointInputSchemas.getJobWorkspaces,
		output: WorkdayEndpointOutputSchemas.getJobWorkspaces,
	},
	'job.listJobPostings': {
		input: WorkdayEndpointInputSchemas.listJobPostings,
		output: WorkdayEndpointOutputSchemas.listJobPostings,
	},
	'job.updateJobChangeBusinessTitle': {
		input: WorkdayEndpointInputSchemas.updateJobChangeBusinessTitle,
		output: WorkdayEndpointOutputSchemas.updateJobChangeBusinessTitle,
	},
	'payroll.createPayrollInputs': {
		input: WorkdayEndpointInputSchemas.createPayrollInputs,
		output: WorkdayEndpointOutputSchemas.createPayrollInputs,
	},
	'payroll.getPayrollInputInstance': {
		input: WorkdayEndpointInputSchemas.getPayrollInputInstance,
		output: WorkdayEndpointOutputSchemas.getPayrollInputInstance,
	},
	'time.createTimeOffRequest': {
		input: WorkdayEndpointInputSchemas.createTimeOffRequest,
		output: WorkdayEndpointOutputSchemas.createTimeOffRequest,
	},
	'time.getTimeOffEntriesForWorker': {
		input: WorkdayEndpointInputSchemas.getTimeOffEntriesForWorker,
		output: WorkdayEndpointOutputSchemas.getTimeOffEntriesForWorker,
	},
	'time.getTimeOffPlansForWorker': {
		input: WorkdayEndpointInputSchemas.getTimeOffPlansForWorker,
		output: WorkdayEndpointOutputSchemas.getTimeOffPlansForWorker,
	},
	'time.getTimeOffStatusValues': {
		input: WorkdayEndpointInputSchemas.getTimeOffStatusValues,
		output: WorkdayEndpointOutputSchemas.getTimeOffStatusValues,
	},
	'time.getTimeTypes': {
		input: WorkdayEndpointInputSchemas.getTimeTypes,
		output: WorkdayEndpointOutputSchemas.getTimeTypes,
	},
	'absence.getAbsenceBalance': {
		input: WorkdayEndpointInputSchemas.getAbsenceBalance,
		output: WorkdayEndpointOutputSchemas.getAbsenceBalance,
	},
	'assignment.getAssignmentChangeGroupCostCenters': {
		input: WorkdayEndpointInputSchemas.getAssignmentChangeGroupCostCenters,
		output: WorkdayEndpointOutputSchemas.getAssignmentChangeGroupCostCenters,
	},
	'assignment.getAssignmentChangeGroupJobs': {
		input: WorkdayEndpointInputSchemas.getAssignmentChangeGroupJobs,
		output: WorkdayEndpointOutputSchemas.getAssignmentChangeGroupJobs,
	},
	'assignment.getAssignmentTypes': {
		input: WorkdayEndpointInputSchemas.getAssignmentTypes,
		output: WorkdayEndpointOutputSchemas.getAssignmentTypes,
	},
	'candidate.getCandidateAvailabilityTemplate': {
		input: WorkdayEndpointInputSchemas.getCandidateAvailabilityTemplate,
		output: WorkdayEndpointOutputSchemas.getCandidateAvailabilityTemplate,
	},
	'collection.getCollectionOfJobs': {
		input: WorkdayEndpointInputSchemas.getCollectionOfJobs,
		output: WorkdayEndpointOutputSchemas.getCollectionOfJobs,
	},
	'collection.getCollectionOfPayroll': {
		input: WorkdayEndpointInputSchemas.getCollectionOfPayroll,
		output: WorkdayEndpointOutputSchemas.getCollectionOfPayroll,
	},
	'company.getCompanyInsiderTypes': {
		input: WorkdayEndpointInputSchemas.getCompanyInsiderTypes,
		output: WorkdayEndpointOutputSchemas.getCompanyInsiderTypes,
	},
	'contingent.getContingentWorkerTypes': {
		input: WorkdayEndpointInputSchemas.getContingentWorkerTypes,
		output: WorkdayEndpointOutputSchemas.getContingentWorkerTypes,
	},
	'country.getCountryInfo': {
		input: WorkdayEndpointInputSchemas.getCountryInfo,
		output: WorkdayEndpointOutputSchemas.getCountryInfo,
	},
	'currencies.getCurrencies': {
		input: WorkdayEndpointInputSchemas.getCurrencies,
		output: WorkdayEndpointOutputSchemas.getCurrencies,
	},
	'current.getCurrentUser': {
		input: WorkdayEndpointInputSchemas.getCurrentUser,
		output: WorkdayEndpointOutputSchemas.getCurrentUser,
	},
	'grants.getGrants': {
		input: WorkdayEndpointInputSchemas.getGrants,
		output: WorkdayEndpointOutputSchemas.getGrants,
	},
	'headcount.getHeadcountOptions': {
		input: WorkdayEndpointInputSchemas.getHeadcountOptions,
		output: WorkdayEndpointOutputSchemas.getHeadcountOptions,
	},
	'history.getHistoryInstanceForWorker': {
		input: WorkdayEndpointInputSchemas.getHistoryInstanceForWorker,
		output: WorkdayEndpointOutputSchemas.getHistoryInstanceForWorker,
	},
	'history.getHistoryItemsForWorker': {
		input: WorkdayEndpointInputSchemas.getHistoryItemsForWorker,
		output: WorkdayEndpointOutputSchemas.getHistoryItemsForWorker,
	},
	'holiday.getHolidayEvents': {
		input: WorkdayEndpointInputSchemas.getHolidayEvents,
		output: WorkdayEndpointOutputSchemas.getHolidayEvents,
	},
	'interview.getInterview': {
		input: WorkdayEndpointInputSchemas.getInterview,
		output: WorkdayEndpointOutputSchemas.getInterview,
	},
	'interview.getInterviewFeedback2': {
		input: WorkdayEndpointInputSchemas.getInterviewFeedback2,
		output: WorkdayEndpointOutputSchemas.getInterviewFeedback2,
	},
	'leave.getLeaveStatusValues': {
		input: WorkdayEndpointInputSchemas.getLeaveStatusValues,
		output: WorkdayEndpointOutputSchemas.getLeaveStatusValues,
	},
	'my.getMyJobPostings': {
		input: WorkdayEndpointInputSchemas.getMyJobPostings,
		output: WorkdayEndpointOutputSchemas.getMyJobPostings,
	},
	'organization.getOrganizationAssignmentBusinessUnits': {
		input: WorkdayEndpointInputSchemas.getOrganizationAssignmentBusinessUnits,
		output: WorkdayEndpointOutputSchemas.getOrganizationAssignmentBusinessUnits,
	},
	'organization.getOrganizationAssignmentCustoms': {
		input: WorkdayEndpointInputSchemas.getOrganizationAssignmentCustoms,
		output: WorkdayEndpointOutputSchemas.getOrganizationAssignmentCustoms,
	},
	'organization.getOrganizationAssignmentFunds': {
		input: WorkdayEndpointInputSchemas.getOrganizationAssignmentFunds,
		output: WorkdayEndpointOutputSchemas.getOrganizationAssignmentFunds,
	},
	'organization.getOrganizationAssignmentRegions': {
		input: WorkdayEndpointInputSchemas.getOrganizationAssignmentRegions,
		output: WorkdayEndpointOutputSchemas.getOrganizationAssignmentRegions,
	},
	'organization.getOrganizationAssignmentWorkers': {
		input: WorkdayEndpointInputSchemas.getOrganizationAssignmentWorkers,
		output: WorkdayEndpointOutputSchemas.getOrganizationAssignmentWorkers,
	},
	'pay.getPayGroupByJobId': {
		input: WorkdayEndpointInputSchemas.getPayGroupByJobId,
		output: WorkdayEndpointOutputSchemas.getPayGroupByJobId,
	},
	'pay.getPaySlipInstancesForWorker': {
		input: WorkdayEndpointInputSchemas.getPaySlipInstancesForWorker,
		output: WorkdayEndpointOutputSchemas.getPaySlipInstancesForWorker,
	},
	'pay.getPaySlipsForWorker': {
		input: WorkdayEndpointInputSchemas.getPaySlipsForWorker,
		output: WorkdayEndpointOutputSchemas.getPaySlipsForWorker,
	},
	'proposed.getProposedPositionValues': {
		input: WorkdayEndpointInputSchemas.getProposedPositionValues,
		output: WorkdayEndpointOutputSchemas.getProposedPositionValues,
	},
	'prospect.getProspect': {
		input: WorkdayEndpointInputSchemas.getProspect,
		output: WorkdayEndpointOutputSchemas.getProspect,
	},
	'prospect.getProspectEducations': {
		input: WorkdayEndpointInputSchemas.getProspectEducations,
		output: WorkdayEndpointOutputSchemas.getProspectEducations,
	},
	'prospect.getProspectExperiences': {
		input: WorkdayEndpointInputSchemas.getProspectExperiences,
		output: WorkdayEndpointOutputSchemas.getProspectExperiences,
	},
	'prospect.getProspectResumeAttachments': {
		input: WorkdayEndpointInputSchemas.getProspectResumeAttachments,
		output: WorkdayEndpointOutputSchemas.getProspectResumeAttachments,
	},
	'prospect.getProspectSkills': {
		input: WorkdayEndpointInputSchemas.getProspectSkills,
		output: WorkdayEndpointOutputSchemas.getProspectSkills,
	},
	'supervisory.getSupervisoryOrgValues': {
		input: WorkdayEndpointInputSchemas.getSupervisoryOrgValues,
		output: WorkdayEndpointOutputSchemas.getSupervisoryOrgValues,
	},
	'work.getWorkStudyAwards': {
		input: WorkdayEndpointInputSchemas.getWorkStudyAwards,
		output: WorkdayEndpointOutputSchemas.getWorkStudyAwards,
	},
	'worker.getWorkerBusinessTitleChanges': {
		input: WorkdayEndpointInputSchemas.getWorkerBusinessTitleChanges,
		output: WorkdayEndpointOutputSchemas.getWorkerBusinessTitleChanges,
	},
	'worker.getWorkerEligibleAbsenceTypes': {
		input: WorkdayEndpointInputSchemas.getWorkerEligibleAbsenceTypes,
		output: WorkdayEndpointOutputSchemas.getWorkerEligibleAbsenceTypes,
	},
	'worker.getWorkerInfo': {
		input: WorkdayEndpointInputSchemas.getWorkerInfo,
		output: WorkdayEndpointOutputSchemas.getWorkerInfo,
	},
	'worker.getWorkerLeavesOfAbsence': {
		input: WorkdayEndpointInputSchemas.getWorkerLeavesOfAbsence,
		output: WorkdayEndpointOutputSchemas.getWorkerLeavesOfAbsence,
	},
	'worker.getWorkerServiceDates': {
		input: WorkdayEndpointInputSchemas.getWorkerServiceDates,
		output: WorkdayEndpointOutputSchemas.getWorkerServiceDates,
	},
	'worker.getWorkerStaffingInformation': {
		input: WorkdayEndpointInputSchemas.getWorkerStaffingInformation,
		output: WorkdayEndpointOutputSchemas.getWorkerStaffingInformation,
	},
	'worker.getWorkerTimeOffDetails': {
		input: WorkdayEndpointInputSchemas.getWorkerTimeOffDetails,
		output: WorkdayEndpointOutputSchemas.getWorkerTimeOffDetails,
	},
	'worker.getWorkerTypes': {
		input: WorkdayEndpointInputSchemas.getWorkerTypes,
		output: WorkdayEndpointOutputSchemas.getWorkerTypes,
	},
	'worker.getWorkerValidTimeOffDates': {
		input: WorkdayEndpointInputSchemas.getWorkerValidTimeOffDates,
		output: WorkdayEndpointOutputSchemas.getWorkerValidTimeOffDates,
	},
	'worker.retrieveWorkerLeaveOfAbsenceSubresource': {
		input: WorkdayEndpointInputSchemas.retrieveWorkerLeaveOfAbsenceSubresource,
		output:
			WorkdayEndpointOutputSchemas.retrieveWorkerLeaveOfAbsenceSubresource,
	},
	'workers.getWorkersCollectionStaffing': {
		input: WorkdayEndpointInputSchemas.getWorkersCollectionStaffing,
		output: WorkdayEndpointOutputSchemas.getWorkersCollectionStaffing,
	},
	'workspace.getWorkspaceInstances': {
		input: WorkdayEndpointInputSchemas.getWorkspaceInstances,
		output: WorkdayEndpointOutputSchemas.getWorkspaceInstances,
	},
	'balances.listBalances': {
		input: WorkdayEndpointInputSchemas.listBalances,
		output: WorkdayEndpointOutputSchemas.listBalances,
	},
	'countries.listCountries': {
		input: WorkdayEndpointInputSchemas.listCountries,
		output: WorkdayEndpointOutputSchemas.listCountries,
	},
	'interviews.listInterviews': {
		input: WorkdayEndpointInputSchemas.listInterviews,
		output: WorkdayEndpointOutputSchemas.listInterviews,
	},
	'jobs.listJobs': {
		input: WorkdayEndpointInputSchemas.listJobs,
		output: WorkdayEndpointOutputSchemas.listJobs,
	},
	'an.updateAnExistingPayroll': {
		input: WorkdayEndpointInputSchemas.updateAnExistingPayroll,
		output: WorkdayEndpointOutputSchemas.updateAnExistingPayroll,
	},
	'message.updateMessageTemplateById': {
		input: WorkdayEndpointInputSchemas.updateMessageTemplateById,
		output: WorkdayEndpointOutputSchemas.updateMessageTemplateById,
	},
} as const;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const workdayEndpointMeta = {
	'business.createBusinessTitleChange': {
		riskLevel: 'write',
		description: 'Create Business Title Change',
	},
	'business.getBusinessTitleChange': {
		riskLevel: 'write',
		description: 'Get Business Title Change',
	},
	'business.getBusinessTitleChangeForWorker': {
		riskLevel: 'write',
		description: 'Get Business Title Change For Worker',
	},
	'job.createJobChange': {
		riskLevel: 'write',
		description: 'Create Job Change',
	},
	'job.getJobById': {
		riskLevel: 'write',
		description: 'Get Job By ID',
	},
	'job.getJobChangeFrequencies': {
		riskLevel: 'write',
		description: 'Get Job Change Frequencies',
	},
	'job.getJobChangeLocationInfo': {
		riskLevel: 'write',
		description: 'Get Job Change Location Info',
	},
	'job.getJobChangePosition': {
		riskLevel: 'write',
		description: 'Get Job Change Position',
	},
	'job.getJobChangeReasonInstance': {
		riskLevel: 'write',
		description: 'Get Job Change Reason Instance',
	},
	'job.getJobChangeReasonValues': {
		riskLevel: 'write',
		description: 'Get Job Change Reason Values',
	},
	'job.getJobChangeReasons': {
		riskLevel: 'write',
		description: 'Get Job Change Reasons',
	},
	'job.getJobChangesGroupTemplates': {
		riskLevel: 'write',
		description: 'Get Job Changes Group Templates',
	},
	'job.getJobChangesJobValues': {
		riskLevel: 'write',
		description: 'Get Job Changes Job Values',
	},
	'job.getJobChangesWorkerValues': {
		riskLevel: 'write',
		description: 'Get Job Changes Worker Values',
	},
	'job.getJobClassifications': {
		riskLevel: 'write',
		description: 'Get Job Classifications',
	},
	'job.getJobPosting': {
		riskLevel: 'write',
		description: 'Get Job Posting',
	},
	'job.getJobPostingQuestionnaire': {
		riskLevel: 'write',
		description: 'Get Job Posting Questionnaire',
	},
	'job.getJobProfilesValues': {
		riskLevel: 'write',
		description: 'Get Job Profiles Values',
	},
	'job.getJobRequisitionValues': {
		riskLevel: 'write',
		description: 'Get Job Requisition Values',
	},
	'job.getJobWorkspace': {
		riskLevel: 'write',
		description: 'Get Job Workspace',
	},
	'job.getJobWorkspaces': {
		riskLevel: 'write',
		description: 'Get Job Workspaces',
	},
	'job.listJobPostings': {
		riskLevel: 'write',
		description: 'List Job Postings',
	},
	'job.updateJobChangeBusinessTitle': {
		riskLevel: 'write',
		description: 'Update Job Change Business Title',
	},
	'payroll.createPayrollInputs': {
		riskLevel: 'write',
		description: 'Create Payroll Inputs',
	},
	'payroll.getPayrollInputInstance': {
		riskLevel: 'write',
		description: 'Get Payroll Input Instance',
	},
	'time.createTimeOffRequest': {
		riskLevel: 'write',
		description: 'Create Time Off Request',
	},
	'time.getTimeOffEntriesForWorker': {
		riskLevel: 'write',
		description: 'Get Time Off Entries for Worker',
	},
	'time.getTimeOffPlansForWorker': {
		riskLevel: 'write',
		description: 'Get Time Off Plans For Worker',
	},
	'time.getTimeOffStatusValues': {
		riskLevel: 'write',
		description: 'Get Time Off Status Values',
	},
	'time.getTimeTypes': {
		riskLevel: 'write',
		description: 'Get Time Types',
	},
	'absence.getAbsenceBalance': {
		riskLevel: 'write',
		description: 'Get Absence Balance',
	},
	'assignment.getAssignmentChangeGroupCostCenters': {
		riskLevel: 'write',
		description: 'Get Assignment Change Group Cost Centers',
	},
	'assignment.getAssignmentChangeGroupJobs': {
		riskLevel: 'write',
		description: 'Get Assignment Change Group Jobs',
	},
	'assignment.getAssignmentTypes': {
		riskLevel: 'write',
		description: 'Get Assignment Types',
	},
	'candidate.getCandidateAvailabilityTemplate': {
		riskLevel: 'write',
		description: 'Get Candidate Availability Template',
	},
	'collection.getCollectionOfJobs': {
		riskLevel: 'write',
		description: 'Get Collection of Jobs',
	},
	'collection.getCollectionOfPayroll': {
		riskLevel: 'write',
		description: 'Get Collection of Payroll',
	},
	'company.getCompanyInsiderTypes': {
		riskLevel: 'write',
		description: 'Get Company Insider Types',
	},
	'contingent.getContingentWorkerTypes': {
		riskLevel: 'write',
		description: 'Get Contingent Worker Types',
	},
	'country.getCountryInfo': {
		riskLevel: 'write',
		description: 'Get Country Info',
	},
	'currencies.getCurrencies': {
		riskLevel: 'write',
		description: 'Get Currencies',
	},
	'current.getCurrentUser': {
		riskLevel: 'write',
		description: 'Get Current User',
	},
	'grants.getGrants': {
		riskLevel: 'write',
		description: 'Get Grants',
	},
	'headcount.getHeadcountOptions': {
		riskLevel: 'write',
		description: 'Get Headcount Options',
	},
	'history.getHistoryInstanceForWorker': {
		riskLevel: 'write',
		description: 'Get History Instance for Worker',
	},
	'history.getHistoryItemsForWorker': {
		riskLevel: 'write',
		description: 'Get History Items for Worker',
	},
	'holiday.getHolidayEvents': {
		riskLevel: 'write',
		description: 'Get Holiday Events',
	},
	'interview.getInterview': {
		riskLevel: 'write',
		description: 'Get Interview',
	},
	'interview.getInterviewFeedback2': {
		riskLevel: 'write',
		description: 'Get Interview Feedback',
	},
	'leave.getLeaveStatusValues': {
		riskLevel: 'write',
		description: 'Get Leave Status Values',
	},
	'my.getMyJobPostings': {
		riskLevel: 'write',
		description: 'Get My Job Postings',
	},
	'organization.getOrganizationAssignmentBusinessUnits': {
		riskLevel: 'write',
		description: 'Get Organization Assignment Business Units',
	},
	'organization.getOrganizationAssignmentCustoms': {
		riskLevel: 'write',
		description: 'Get Organization Assignment Customs',
	},
	'organization.getOrganizationAssignmentFunds': {
		riskLevel: 'write',
		description: 'Get Organization Assignment Funds',
	},
	'organization.getOrganizationAssignmentRegions': {
		riskLevel: 'write',
		description: 'Get Organization Assignment Regions',
	},
	'organization.getOrganizationAssignmentWorkers': {
		riskLevel: 'write',
		description: 'Get Organization Assignment Workers',
	},
	'pay.getPayGroupByJobId': {
		riskLevel: 'write',
		description: 'Get Pay Group by Job ID',
	},
	'pay.getPaySlipInstancesForWorker': {
		riskLevel: 'write',
		description: 'Get Pay Slip Instance for Worker',
	},
	'pay.getPaySlipsForWorker': {
		riskLevel: 'write',
		description: 'Get Pay Slips for Worker',
	},
	'proposed.getProposedPositionValues': {
		riskLevel: 'write',
		description: 'Get Proposed Position Values',
	},
	'prospect.getProspect': {
		riskLevel: 'write',
		description: 'Get Prospect',
	},
	'prospect.getProspectEducations': {
		riskLevel: 'write',
		description: 'Get Prospect Educations',
	},
	'prospect.getProspectExperiences': {
		riskLevel: 'write',
		description: 'Get Prospect Experiences',
	},
	'prospect.getProspectResumeAttachments': {
		riskLevel: 'write',
		description: 'Get Prospect Resume Attachments',
	},
	'prospect.getProspectSkills': {
		riskLevel: 'write',
		description: 'Get Prospect Skills',
	},
	'supervisory.getSupervisoryOrgValues': {
		riskLevel: 'write',
		description: 'Get Supervisory Organization Values',
	},
	'work.getWorkStudyAwards': {
		riskLevel: 'write',
		description: 'Get Work Study Awards',
	},
	'worker.getWorkerBusinessTitleChanges': {
		riskLevel: 'write',
		description: 'Get Worker Business Title Changes',
	},
	'worker.getWorkerEligibleAbsenceTypes': {
		riskLevel: 'write',
		description: 'Get Worker Eligible Absence Types',
	},
	'worker.getWorkerInfo': {
		riskLevel: 'write',
		description: 'Get Worker Info',
	},
	'worker.getWorkerLeavesOfAbsence': {
		riskLevel: 'write',
		description: 'Get Worker Leaves of Absence',
	},
	'worker.getWorkerServiceDates': {
		riskLevel: 'write',
		description: 'Get Worker Service Dates',
	},
	'worker.getWorkerStaffingInformation': {
		riskLevel: 'write',
		description: 'Get Worker Staffing Information',
	},
	'worker.getWorkerTimeOffDetails': {
		riskLevel: 'write',
		description: 'Get Worker Time Off Details',
	},
	'worker.getWorkerTypes': {
		riskLevel: 'write',
		description: 'Get Worker Types',
	},
	'worker.getWorkerValidTimeOffDates': {
		riskLevel: 'write',
		description: 'Get Worker Valid Time Off Dates',
	},
	'worker.retrieveWorkerLeaveOfAbsenceSubresource': {
		riskLevel: 'write',
		description: 'Retrieve Worker Leave of Absence',
	},
	'workers.getWorkersCollectionStaffing': {
		riskLevel: 'write',
		description: 'Get Workers Collection Staffing',
	},
	'workspace.getWorkspaceInstances': {
		riskLevel: 'write',
		description: 'Get Workspace Instances',
	},
	'balances.listBalances': {
		riskLevel: 'write',
		description: 'List Balances',
	},
	'countries.listCountries': {
		riskLevel: 'write',
		description: 'List Countries',
	},
	'interviews.listInterviews': {
		riskLevel: 'write',
		description: 'List Interviews',
	},
	'jobs.listJobs': {
		riskLevel: 'write',
		description: 'List Jobs',
	},
	'an.updateAnExistingPayroll': {
		riskLevel: 'write',
		description: 'Update An Existing Payroll',
	},
	'message.updateMessageTemplateById': {
		riskLevel: 'write',
		description: 'Update Message Template By ID',
	},
} satisfies RequiredPluginEndpointMeta<typeof workdayEndpointsNested>;

export const workdayAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWorkdayPlugin<T extends WorkdayPluginOptions> = CorsairPlugin<
	'workday',
	typeof WorkdaySchema,
	typeof workdayEndpointsNested,
	typeof workdayWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalWorkdayPlugin = BaseWorkdayPlugin<WorkdayPluginOptions>;
export type ExternalWorkdayPlugin<T extends WorkdayPluginOptions> =
	BaseWorkdayPlugin<T>;

export function workday<const T extends WorkdayPluginOptions>(
	incomingOptions: WorkdayPluginOptions & T = {} as WorkdayPluginOptions & T,
): ExternalWorkdayPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'workday',
		authConfig: workdayAuthConfig,
		schema: WorkdaySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: workdayEndpointsNested,
		webhooks: workdayWebhooksNested,
		endpointMeta: workdayEndpointMeta,
		endpointSchemas: workdayEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			return 'x-workday-signature' in request.headers;
		},
		pluginTenantWebhookMatcher: matchWorkdayTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveWorkdayOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WorkdayKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret)
				return options.webhookSecret;
			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}
			if (source === 'endpoint' && options.key) return options.key;

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalWorkdayPlugin;
}

export type {
	WorkdayEndpointInputs,
	WorkdayEndpointOutputs,
} from './endpoints/types';
export type { WorkdayWebhookOutputs } from './webhooks/types';
