import type {
	AuthTypes,
	BindEndpoints,
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
	normalizeWorkdayHost,
	normalizeWorkdayTenant,
	workdayOAuthUrls,
} from './client';
import { workdayEndpointsNested } from './endpoints';
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
import { workdayWebhooksNested } from './webhooks/triggers';

export const workdayAuthConfig = {
	oauth_2: {
		account: ['tenant', 'host', 'tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WorkdayPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Bearer token override (tests / BYO). */
	key?: string;
	/** Workday API host, e.g. wd2-impl-services1.workday.com */
	host?: string;
	/** Workday tenant name (required for OAuth + REST base URLs). */
	tenant?: string;
	webhookSecret?: string;
	hooks?: InternalWorkdayPlugin['hooks'];
	webhookHooks?: InternalWorkdayPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof workdayEndpointsNested>;
};

export type WorkdayContext = CorsairPluginContext<
	typeof WorkdaySchema,
	WorkdayPluginOptions,
	undefined,
	typeof workdayAuthConfig
>;
export type WorkdayKeyBuilderContext = KeyBuilderContext<
	WorkdayPluginOptions,
	typeof workdayAuthConfig
>;
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
	updateAnExistingPayroll: WorkdayEndpoint<'updateAnExistingPayroll'>;
	getCollectionOfPayroll: WorkdayEndpoint<'getCollectionOfPayroll'>;
	createTimeOffRequest: WorkdayEndpoint<'createTimeOffRequest'>;
	getTimeOffEntriesForWorker: WorkdayEndpoint<'getTimeOffEntriesForWorker'>;
	getTimeOffPlansForWorker: WorkdayEndpoint<'getTimeOffPlansForWorker'>;
	getTimeOffStatusValues: WorkdayEndpoint<'getTimeOffStatusValues'>;
	getTimeTypes: WorkdayEndpoint<'getTimeTypes'>;
	getAbsenceBalance: WorkdayEndpoint<'getAbsenceBalance'>;
	listBalances: WorkdayEndpoint<'listBalances'>;
	getAssignmentChangeGroupCostCenters: WorkdayEndpoint<'getAssignmentChangeGroupCostCenters'>;
	getAssignmentChangeGroupJobs: WorkdayEndpoint<'getAssignmentChangeGroupJobs'>;
	getAssignmentTypes: WorkdayEndpoint<'getAssignmentTypes'>;
	getCandidateAvailabilityTemplate: WorkdayEndpoint<'getCandidateAvailabilityTemplate'>;
	getCollectionOfJobs: WorkdayEndpoint<'getCollectionOfJobs'>;
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
	listCountries: WorkdayEndpoint<'listCountries'>;
	listInterviews: WorkdayEndpoint<'listInterviews'>;
	listJobs: WorkdayEndpoint<'listJobs'>;
	updateMessageTemplateById: WorkdayEndpoint<'updateMessageTemplateById'>;
};

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const workdayEndpointSchemas = {
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
	'payroll.updateAnExistingPayroll': {
		input: WorkdayEndpointInputSchemas.updateAnExistingPayroll,
		output: WorkdayEndpointOutputSchemas.updateAnExistingPayroll,
	},
	'collection.getCollectionOfPayroll': {
		input: WorkdayEndpointInputSchemas.getCollectionOfPayroll,
		output: WorkdayEndpointOutputSchemas.getCollectionOfPayroll,
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
	'balances.listBalances': {
		input: WorkdayEndpointInputSchemas.listBalances,
		output: WorkdayEndpointOutputSchemas.listBalances,
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
	'message.updateMessageTemplateById': {
		input: WorkdayEndpointInputSchemas.updateMessageTemplateById,
		output: WorkdayEndpointOutputSchemas.updateMessageTemplateById,
	},
} as const;

const workdayEndpointMeta = {
	'business.createBusinessTitleChange': {
		riskLevel: 'write',
		description:
			'Creates a business title change for a worker (Common API v1).',
	},
	'business.getBusinessTitleChange': {
		riskLevel: 'read',
		description:
			'Retrieves a business title change instance by ID (Common API v1).',
	},
	'business.getBusinessTitleChangeForWorker': {
		riskLevel: 'read',
		description:
			'Retrieves a business title change for a specific worker (Common API v1).',
	},
	'job.createJobChange': {
		riskLevel: 'write',
		description: 'Initiates a job change for a worker (Staffing v6).',
	},
	'job.getJobById': {
		riskLevel: 'read',
		description: 'Retrieves a single job instance by ID (Staffing v6).',
	},
	'job.getJobChangeFrequencies': {
		riskLevel: 'read',
		description:
			'Retrieves frequency prompt values for job changes (Staffing v6).',
	},
	'job.getJobChangeLocationInfo': {
		riskLevel: 'read',
		description: 'Retrieves location info for a job change (Staffing v6).',
	},
	'job.getJobChangePosition': {
		riskLevel: 'read',
		description: 'Retrieves position details for a job change (Staffing v6).',
	},
	'job.getJobChangeReasonInstance': {
		riskLevel: 'read',
		description: 'Retrieves a job change reason instance (Staffing v6).',
	},
	'job.getJobChangeReasonValues': {
		riskLevel: 'read',
		description: 'Retrieves job change reason prompt values (Staffing v6).',
	},
	'job.getJobChangeReasons': {
		riskLevel: 'read',
		description: 'Retrieves job change reasons collection (Staffing v6).',
	},
	'job.getJobChangesGroupTemplates': {
		riskLevel: 'read',
		description: 'Retrieves job change templates (Staffing v6).',
	},
	'job.getJobChangesJobValues': {
		riskLevel: 'read',
		description: 'Retrieves job prompt values for job changes (Staffing v6).',
	},
	'job.getJobChangesWorkerValues': {
		riskLevel: 'read',
		description:
			'Retrieves worker prompt values for job changes (Staffing v6).',
	},
	'job.getJobClassifications': {
		riskLevel: 'read',
		description: 'Retrieves job classification prompt values (Staffing v6).',
	},
	'job.getJobPosting': {
		riskLevel: 'read',
		description:
			'Retrieves a job posting including description (Recruiting v4).',
	},
	'job.getJobPostingQuestionnaire': {
		riskLevel: 'read',
		description: 'Retrieves questionnaires for a job posting (Recruiting v4).',
	},
	'job.getJobProfilesValues': {
		riskLevel: 'read',
		description: 'Retrieves job profile prompt values (Staffing v6).',
	},
	'job.getJobRequisitionValues': {
		riskLevel: 'read',
		description: 'Retrieves job requisition prompt values (Staffing v6).',
	},
	'job.getJobWorkspace': {
		riskLevel: 'read',
		description: 'Retrieves a workspace for a job (Staffing v6).',
	},
	'job.getJobWorkspaces': {
		riskLevel: 'read',
		description: 'Retrieves workspaces for a job (Staffing v6).',
	},
	'job.listJobPostings': {
		riskLevel: 'read',
		description: 'Lists job postings (Recruiting v4).',
	},
	'job.updateJobChangeBusinessTitle': {
		riskLevel: 'write',
		description:
			'Partially updates business title on a job change (Staffing v6).',
	},
	'payroll.createPayrollInputs': {
		riskLevel: 'write',
		description: 'Creates payroll inputs (Payroll v1).',
	},
	'payroll.getPayrollInputInstance': {
		riskLevel: 'read',
		description: 'Retrieves a payroll input by ID (Payroll v1).',
	},
	'payroll.updateAnExistingPayroll': {
		riskLevel: 'write',
		description: 'Partially updates a payroll input (Payroll v1).',
	},
	'collection.getCollectionOfPayroll': {
		riskLevel: 'read',
		description: 'Retrieves a collection of payroll inputs (Payroll v1).',
	},
	'time.createTimeOffRequest': {
		riskLevel: 'write',
		description: 'Creates a time off request (Absence Management v5).',
	},
	'time.getTimeOffEntriesForWorker': {
		riskLevel: 'read',
		description: 'Retrieves time off entries for a worker (Common API v1).',
	},
	'time.getTimeOffPlansForWorker': {
		riskLevel: 'read',
		description: 'Retrieves time off plans for a worker (Common API v1).',
	},
	'time.getTimeOffStatusValues': {
		riskLevel: 'read',
		description:
			'Retrieves time off status prompt values (Absence Management v5).',
	},
	'time.getTimeTypes': {
		riskLevel: 'read',
		description: 'Retrieves time type prompt values (Staffing v6).',
	},
	'absence.getAbsenceBalance': {
		riskLevel: 'read',
		description: 'Retrieves an absence balance by ID (Absence Management v5).',
	},
	'balances.listBalances': {
		riskLevel: 'read',
		description: 'Lists absence balances (Absence Management v5).',
	},
	'assignment.getAssignmentChangeGroupCostCenters': {
		riskLevel: 'read',
		description:
			'Retrieves cost center prompt values for org assignment changes (Staffing v6).',
	},
	'assignment.getAssignmentChangeGroupJobs': {
		riskLevel: 'read',
		description:
			'Retrieves job prompt values for org assignment changes (Staffing v6).',
	},
	'assignment.getAssignmentTypes': {
		riskLevel: 'read',
		description: 'Retrieves assignment type prompt values (Staffing v6).',
	},
	'candidate.getCandidateAvailabilityTemplate': {
		riskLevel: 'read',
		description:
			'Retrieves candidate availability template for a job posting (Recruiting v4).',
	},
	'collection.getCollectionOfJobs': {
		riskLevel: 'read',
		description: 'Retrieves a paginated collection of jobs (Staffing v6).',
	},
	'company.getCompanyInsiderTypes': {
		riskLevel: 'read',
		description: 'Retrieves company insider type prompt values (Staffing v6).',
	},
	'contingent.getContingentWorkerTypes': {
		riskLevel: 'read',
		description:
			'Retrieves contingent worker type prompt values (Staffing v6).',
	},
	'country.getCountryInfo': {
		riskLevel: 'read',
		description: 'Retrieves country info (Common API v1).',
	},
	'currencies.getCurrencies': {
		riskLevel: 'read',
		description:
			'Retrieves currency prompt values for job changes (Staffing v6).',
	},
	'current.getCurrentUser': {
		riskLevel: 'read',
		description: 'Retrieves the authenticated worker profile (Staffing v6).',
	},
	'grants.getGrants': {
		riskLevel: 'read',
		description:
			'Retrieves grant prompt values for org assignment changes (Staffing v6).',
	},
	'headcount.getHeadcountOptions': {
		riskLevel: 'read',
		description: 'Retrieves headcount option prompt values (Staffing v6).',
	},
	'history.getHistoryInstanceForWorker': {
		riskLevel: 'read',
		description: 'Retrieves a history instance for a worker (Common API v1).',
	},
	'history.getHistoryItemsForWorker': {
		riskLevel: 'read',
		description: 'Retrieves history items for a worker (Common API v1).',
	},
	'holiday.getHolidayEvents': {
		riskLevel: 'read',
		description:
			'Retrieves holiday events for workers/time period (Person v4).',
	},
	'interview.getInterview': {
		riskLevel: 'read',
		description: 'Retrieves an interview by ID (Recruiting v4).',
	},
	'interview.getInterviewFeedback2': {
		riskLevel: 'read',
		description: 'Retrieves interview feedback (Recruiting v4).',
	},
	'leave.getLeaveStatusValues': {
		riskLevel: 'read',
		description:
			'Retrieves leave status prompt values (Absence Management v5).',
	},
	'my.getMyJobPostings': {
		riskLevel: 'read',
		description:
			'Retrieves job postings for the authenticated recruiter (Recruiting v4).',
	},
	'organization.getOrganizationAssignmentBusinessUnits': {
		riskLevel: 'read',
		description:
			'Retrieves business unit prompt values for org assignment changes (Staffing v6).',
	},
	'organization.getOrganizationAssignmentCustoms': {
		riskLevel: 'read',
		description: 'Retrieves custom org assignment prompt values (Staffing v6).',
	},
	'organization.getOrganizationAssignmentFunds': {
		riskLevel: 'read',
		description:
			'Retrieves fund prompt values for org assignment changes (Staffing v6).',
	},
	'organization.getOrganizationAssignmentRegions': {
		riskLevel: 'read',
		description:
			'Retrieves region prompt values for org assignment changes (Staffing v6).',
	},
	'organization.getOrganizationAssignmentWorkers': {
		riskLevel: 'read',
		description:
			'Retrieves worker prompt values for org assignment changes (Staffing v6).',
	},
	'pay.getPayGroupByJobId': {
		riskLevel: 'read',
		description: 'Retrieves the pay group for a job (Staffing v6).',
	},
	'pay.getPaySlipInstancesForWorker': {
		riskLevel: 'read',
		description: 'Retrieves a pay slip instance for a worker (Common API v1).',
	},
	'pay.getPaySlipsForWorker': {
		riskLevel: 'read',
		description: 'Retrieves pay slips for a worker (Common API v1).',
	},
	'proposed.getProposedPositionValues': {
		riskLevel: 'read',
		description: 'Retrieves proposed position prompt values (Staffing v6).',
	},
	'prospect.getProspect': {
		riskLevel: 'read',
		description: 'Retrieves a prospect (Recruiting v4).',
	},
	'prospect.getProspectEducations': {
		riskLevel: 'read',
		description: 'Retrieves prospect educations (Recruiting v4).',
	},
	'prospect.getProspectExperiences': {
		riskLevel: 'read',
		description: 'Retrieves prospect experiences (Recruiting v4).',
	},
	'prospect.getProspectResumeAttachments': {
		riskLevel: 'read',
		description: 'Retrieves prospect resume attachments (Recruiting v4).',
	},
	'prospect.getProspectSkills': {
		riskLevel: 'read',
		description: 'Retrieves prospect skills (Recruiting v4).',
	},
	'supervisory.getSupervisoryOrgValues': {
		riskLevel: 'read',
		description:
			'Retrieves supervisory organization prompt values (Staffing v6).',
	},
	'work.getWorkStudyAwards': {
		riskLevel: 'read',
		description: 'Retrieves work study award prompt values (Staffing v6).',
	},
	'worker.getWorkerBusinessTitleChanges': {
		riskLevel: 'read',
		description:
			'Retrieves business title changes for a worker (Common API v1).',
	},
	'worker.getWorkerEligibleAbsenceTypes': {
		riskLevel: 'read',
		description:
			'Retrieves eligible absence types for a worker (Absence Management v5).',
	},
	'worker.getWorkerInfo': {
		riskLevel: 'read',
		description: 'Retrieves worker staffing information (Staffing v6).',
	},
	'worker.getWorkerLeavesOfAbsence': {
		riskLevel: 'read',
		description:
			'Retrieves leaves of absence for a worker (Absence Management v5).',
	},
	'worker.getWorkerServiceDates': {
		riskLevel: 'read',
		description: 'Retrieves service dates for a worker (Staffing v6).',
	},
	'worker.getWorkerStaffingInformation': {
		riskLevel: 'read',
		description:
			'Retrieves current staffing information for a worker (Staffing v6).',
	},
	'worker.getWorkerTimeOffDetails': {
		riskLevel: 'read',
		description:
			'Retrieves time off details for a worker (Absence Management v5).',
	},
	'worker.getWorkerTypes': {
		riskLevel: 'read',
		description: 'Retrieves worker type prompt values (Staffing v6).',
	},
	'worker.getWorkerValidTimeOffDates': {
		riskLevel: 'read',
		description:
			'Retrieves valid time off dates for a worker (Absence Management v5).',
	},
	'worker.retrieveWorkerLeaveOfAbsenceSubresource': {
		riskLevel: 'read',
		description:
			'Retrieves a leave of absence subresource (Absence Management v5).',
	},
	'workers.getWorkersCollectionStaffing': {
		riskLevel: 'read',
		description: 'Retrieves workers with staffing information (Staffing v6).',
	},
	'workspace.getWorkspaceInstances': {
		riskLevel: 'read',
		description: 'Retrieves workspace prompt values (Staffing v6).',
	},
	'countries.listCountries': {
		riskLevel: 'read',
		description: 'Retrieves country values for recruiting (Recruiting v4).',
	},
	'interviews.listInterviews': {
		riskLevel: 'read',
		description: 'Lists interviews (Recruiting v4).',
	},
	'jobs.listJobs': {
		riskLevel: 'read',
		description: 'Lists jobs (Staffing v6).',
	},
	'message.updateMessageTemplateById': {
		riskLevel: 'write',
		description: 'Updates a message template by ID (Recruiting v4).',
	},
} satisfies RequiredPluginEndpointMeta<typeof workdayEndpointsNested>;

export type BaseWorkdayPlugin<T extends WorkdayPluginOptions> = CorsairPlugin<
	'workday',
	typeof WorkdaySchema,
	typeof workdayEndpointsNested,
	typeof workdayWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof workdayAuthConfig
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
	const tenant = options.tenant?.trim()
		? normalizeWorkdayTenant(options.tenant)
		: undefined;
	const host = options.host?.trim()
		? normalizeWorkdayHost(options.host)
		: undefined;

	const oauthUrls =
		tenant != null && host != null ? workdayOAuthUrls({ host, tenant }) : null;

	return {
		id: 'workday',
		authConfig: workdayAuthConfig,
		...(oauthUrls
			? {
					oauthConfig: {
						providerName: 'Workday',
						authUrl: oauthUrls.authUrl,
						tokenUrl: oauthUrls.tokenUrl,
						scopes: [
							'staffing',
							'absenceManagement',
							'recruiting',
							'payroll',
							'common',
							'person',
						],
						tokenAuthMethod: 'body' as const,
						requiresRegisteredRedirect: true,
					},
				}
			: {}),
		schema: WorkdaySchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: workdayEndpointsNested,
		webhooks: workdayWebhooksNested,
		endpointMeta: workdayEndpointMeta,
		endpointSchemas: workdayEndpointSchemas,
		pluginWebhookMatcher: (request) => {
			const keys = Object.keys(request.headers).map((k) => k.toLowerCase());
			return (
				keys.includes('x-workday-signature') || keys.includes('x-workday-event')
			);
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
				if (!res) throw new AuthMissingError('workday', 'webhook_signature');
				return res;
			}
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) throw new AuthMissingError('workday', 'oauth_2');
				return res;
			}
			return '';
		},
	} satisfies InternalWorkdayPlugin;
}

export { workdayRoutes } from './endpoints/routes';
export type {
	WorkdayEndpointInputs,
	WorkdayEndpointOutputs,
} from './endpoints/types';
export type { WorkdayWebhookOutputs } from './webhooks/types';
