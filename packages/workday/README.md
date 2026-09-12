# @corsair-dev/workday

Workday plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/workday
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `absence.getAbsenceBalance` | `workday.api.absence.getAbsenceBalance` | `read` | Retrieves an absence balance by ID (Absence Management v5). |
| `assignment.getAssignmentChangeGroupCostCenters` | `workday.api.assignment.getAssignmentChangeGroupCostCenters` | `read` | Retrieves cost center prompt values for org assignment changes (Staffing v6). |
| `assignment.getAssignmentChangeGroupJobs` | `workday.api.assignment.getAssignmentChangeGroupJobs` | `read` | Retrieves job prompt values for org assignment changes (Staffing v6). |
| `assignment.getAssignmentTypes` | `workday.api.assignment.getAssignmentTypes` | `read` | Retrieves assignment type prompt values (Staffing v6). |
| `balances.listBalances` | `workday.api.balances.listBalances` | `read` | Lists absence balances (Absence Management v5). |
| `business.createBusinessTitleChange` | `workday.api.business.createBusinessTitleChange` | `write` | Creates a business title change for a worker (Common API v1). |
| `business.getBusinessTitleChange` | `workday.api.business.getBusinessTitleChange` | `read` | Retrieves a business title change instance by ID (Common API v1). |
| `business.getBusinessTitleChangeForWorker` | `workday.api.business.getBusinessTitleChangeForWorker` | `read` | Retrieves a business title change for a specific worker (Common API v1). |
| `candidate.getCandidateAvailabilityTemplate` | `workday.api.candidate.getCandidateAvailabilityTemplate` | `read` | Retrieves candidate availability template for a job posting (Recruiting v4). |
| `collection.getCollectionOfJobs` | `workday.api.collection.getCollectionOfJobs` | `read` | Retrieves a paginated collection of jobs (Staffing v6). |
| `collection.getCollectionOfPayroll` | `workday.api.collection.getCollectionOfPayroll` | `read` | Retrieves a collection of payroll inputs (Payroll v1). |
| `company.getCompanyInsiderTypes` | `workday.api.company.getCompanyInsiderTypes` | `read` | Retrieves company insider type prompt values (Staffing v6). |
| `contingent.getContingentWorkerTypes` | `workday.api.contingent.getContingentWorkerTypes` | `read` | Retrieves contingent worker type prompt values (Staffing v6). |
| `countries.listCountries` | `workday.api.countries.listCountries` | `read` | Retrieves country values for recruiting (Recruiting v4). |
| `country.getCountryInfo` | `workday.api.country.getCountryInfo` | `read` | Retrieves country info (Common API v1). |
| `currencies.getCurrencies` | `workday.api.currencies.getCurrencies` | `read` | Retrieves currency prompt values for job changes (Staffing v6). |
| `current.getCurrentUser` | `workday.api.current.getCurrentUser` | `read` | Retrieves the authenticated worker profile (Staffing v6). |
| `grants.getGrants` | `workday.api.grants.getGrants` | `read` | Retrieves grant prompt values for org assignment changes (Staffing v6). |
| `headcount.getHeadcountOptions` | `workday.api.headcount.getHeadcountOptions` | `read` | Retrieves headcount option prompt values (Staffing v6). |
| `history.getHistoryInstanceForWorker` | `workday.api.history.getHistoryInstanceForWorker` | `read` | Retrieves a history instance for a worker (Common API v1). |
| `history.getHistoryItemsForWorker` | `workday.api.history.getHistoryItemsForWorker` | `read` | Retrieves history items for a worker (Common API v1). |
| `holiday.getHolidayEvents` | `workday.api.holiday.getHolidayEvents` | `read` | Retrieves holiday events for workers/time period (Person v4). |
| `interview.getInterview` | `workday.api.interview.getInterview` | `read` | Retrieves an interview by ID (Recruiting v4). |
| `interview.getInterviewFeedback2` | `workday.api.interview.getInterviewFeedback2` | `read` | Retrieves interview feedback (Recruiting v4). |
| `interviews.listInterviews` | `workday.api.interviews.listInterviews` | `read` | Lists interviews (Recruiting v4). |
| `job.createJobChange` | `workday.api.job.createJobChange` | `write` | Initiates a job change for a worker (Staffing v6). |
| `job.getJobById` | `workday.api.job.getJobById` | `read` | Retrieves a single job instance by ID (Staffing v6). |
| `job.getJobChangeFrequencies` | `workday.api.job.getJobChangeFrequencies` | `read` | Retrieves frequency prompt values for job changes (Staffing v6). |
| `job.getJobChangeLocationInfo` | `workday.api.job.getJobChangeLocationInfo` | `read` | Retrieves location info for a job change (Staffing v6). |
| `job.getJobChangePosition` | `workday.api.job.getJobChangePosition` | `read` | Retrieves position details for a job change (Staffing v6). |
| `job.getJobChangeReasonInstance` | `workday.api.job.getJobChangeReasonInstance` | `read` | Retrieves a job change reason instance (Staffing v6). |
| `job.getJobChangeReasons` | `workday.api.job.getJobChangeReasons` | `read` | Retrieves job change reasons collection (Staffing v6). |
| `job.getJobChangeReasonValues` | `workday.api.job.getJobChangeReasonValues` | `read` | Retrieves job change reason prompt values (Staffing v6). |
| `job.getJobChangesGroupTemplates` | `workday.api.job.getJobChangesGroupTemplates` | `read` | Retrieves job change templates (Staffing v6). |
| `job.getJobChangesJobValues` | `workday.api.job.getJobChangesJobValues` | `read` | Retrieves job prompt values for job changes (Staffing v6). |
| `job.getJobChangesWorkerValues` | `workday.api.job.getJobChangesWorkerValues` | `read` | Retrieves worker prompt values for job changes (Staffing v6). |
| `job.getJobClassifications` | `workday.api.job.getJobClassifications` | `read` | Retrieves job classification prompt values (Staffing v6). |
| `job.getJobPosting` | `workday.api.job.getJobPosting` | `read` | Retrieves a job posting including description (Recruiting v4). |
| `job.getJobPostingQuestionnaire` | `workday.api.job.getJobPostingQuestionnaire` | `read` | Retrieves questionnaires for a job posting (Recruiting v4). |
| `job.getJobProfilesValues` | `workday.api.job.getJobProfilesValues` | `read` | Retrieves job profile prompt values (Staffing v6). |
| `job.getJobRequisitionValues` | `workday.api.job.getJobRequisitionValues` | `read` | Retrieves job requisition prompt values (Staffing v6). |
| `job.getJobWorkspace` | `workday.api.job.getJobWorkspace` | `read` | Retrieves a workspace for a job (Staffing v6). |
| `job.getJobWorkspaces` | `workday.api.job.getJobWorkspaces` | `read` | Retrieves workspaces for a job (Staffing v6). |
| `job.listJobPostings` | `workday.api.job.listJobPostings` | `read` | Lists job postings (Recruiting v4). |
| `job.updateJobChangeBusinessTitle` | `workday.api.job.updateJobChangeBusinessTitle` | `write` | Partially updates business title on a job change (Staffing v6). |
| `jobs.listJobs` | `workday.api.jobs.listJobs` | `read` | Lists jobs (Staffing v6). |
| `leave.getLeaveStatusValues` | `workday.api.leave.getLeaveStatusValues` | `read` | Retrieves leave status prompt values (Absence Management v5). |
| `message.updateMessageTemplateById` | `workday.api.message.updateMessageTemplateById` | `write` | Updates a message template by ID (Recruiting v4). |
| `my.getMyJobPostings` | `workday.api.my.getMyJobPostings` | `read` | Retrieves job postings for the authenticated recruiter (Recruiting v4). |
| `organization.getOrganizationAssignmentBusinessUnits` | `workday.api.organization.getOrganizationAssignmentBusinessUnits` | `read` | Retrieves business unit prompt values for org assignment changes (Staffing v6). |
| `organization.getOrganizationAssignmentCustoms` | `workday.api.organization.getOrganizationAssignmentCustoms` | `read` | Retrieves custom org assignment prompt values (Staffing v6). |
| `organization.getOrganizationAssignmentFunds` | `workday.api.organization.getOrganizationAssignmentFunds` | `read` | Retrieves fund prompt values for org assignment changes (Staffing v6). |
| `organization.getOrganizationAssignmentRegions` | `workday.api.organization.getOrganizationAssignmentRegions` | `read` | Retrieves region prompt values for org assignment changes (Staffing v6). |
| `organization.getOrganizationAssignmentWorkers` | `workday.api.organization.getOrganizationAssignmentWorkers` | `read` | Retrieves worker prompt values for org assignment changes (Staffing v6). |
| `pay.getPayGroupByJobId` | `workday.api.pay.getPayGroupByJobId` | `read` | Retrieves the pay group for a job (Staffing v6). |
| `pay.getPaySlipInstancesForWorker` | `workday.api.pay.getPaySlipInstancesForWorker` | `read` | Retrieves a pay slip instance for a worker (Common API v1). |
| `pay.getPaySlipsForWorker` | `workday.api.pay.getPaySlipsForWorker` | `read` | Retrieves pay slips for a worker (Common API v1). |
| `payroll.createPayrollInputs` | `workday.api.payroll.createPayrollInputs` | `write` | Creates payroll inputs (Payroll v1). |
| `payroll.getPayrollInputInstance` | `workday.api.payroll.getPayrollInputInstance` | `read` | Retrieves a payroll input by ID (Payroll v1). |
| `payroll.updateAnExistingPayroll` | `workday.api.payroll.updateAnExistingPayroll` | `write` | Partially updates a payroll input (Payroll v1). |
| `proposed.getProposedPositionValues` | `workday.api.proposed.getProposedPositionValues` | `read` | Retrieves proposed position prompt values (Staffing v6). |
| `prospect.getProspect` | `workday.api.prospect.getProspect` | `read` | Retrieves a prospect (Recruiting v4). |
| `prospect.getProspectEducations` | `workday.api.prospect.getProspectEducations` | `read` | Retrieves prospect educations (Recruiting v4). |
| `prospect.getProspectExperiences` | `workday.api.prospect.getProspectExperiences` | `read` | Retrieves prospect experiences (Recruiting v4). |
| `prospect.getProspectResumeAttachments` | `workday.api.prospect.getProspectResumeAttachments` | `read` | Retrieves prospect resume attachments (Recruiting v4). |
| `prospect.getProspectSkills` | `workday.api.prospect.getProspectSkills` | `read` | Retrieves prospect skills (Recruiting v4). |
| `supervisory.getSupervisoryOrgValues` | `workday.api.supervisory.getSupervisoryOrgValues` | `read` | Retrieves supervisory organization prompt values (Staffing v6). |
| `time.createTimeOffRequest` | `workday.api.time.createTimeOffRequest` | `write` | Creates a time off request (Absence Management v5). |
| `time.getTimeOffEntriesForWorker` | `workday.api.time.getTimeOffEntriesForWorker` | `read` | Retrieves time off entries for a worker (Common API v1). |
| `time.getTimeOffPlansForWorker` | `workday.api.time.getTimeOffPlansForWorker` | `read` | Retrieves time off plans for a worker (Common API v1). |
| `time.getTimeOffStatusValues` | `workday.api.time.getTimeOffStatusValues` | `read` | Retrieves time off status prompt values (Absence Management v5). |
| `time.getTimeTypes` | `workday.api.time.getTimeTypes` | `read` | Retrieves time type prompt values (Staffing v6). |
| `work.getWorkStudyAwards` | `workday.api.work.getWorkStudyAwards` | `read` | Retrieves work study award prompt values (Staffing v6). |
| `worker.getWorkerBusinessTitleChanges` | `workday.api.worker.getWorkerBusinessTitleChanges` | `read` | Retrieves business title changes for a worker (Common API v1). |
| `worker.getWorkerEligibleAbsenceTypes` | `workday.api.worker.getWorkerEligibleAbsenceTypes` | `read` | Retrieves eligible absence types for a worker (Absence Management v5). |
| `worker.getWorkerInfo` | `workday.api.worker.getWorkerInfo` | `read` | Retrieves worker staffing information (Staffing v6). |
| `worker.getWorkerLeavesOfAbsence` | `workday.api.worker.getWorkerLeavesOfAbsence` | `read` | Retrieves leaves of absence for a worker (Absence Management v5). |
| `worker.getWorkerServiceDates` | `workday.api.worker.getWorkerServiceDates` | `read` | Retrieves service dates for a worker (Staffing v6). |
| `worker.getWorkerStaffingInformation` | `workday.api.worker.getWorkerStaffingInformation` | `read` | Retrieves current staffing information for a worker (Staffing v6). |
| `worker.getWorkerTimeOffDetails` | `workday.api.worker.getWorkerTimeOffDetails` | `read` | Retrieves time off details for a worker (Absence Management v5). |
| `worker.getWorkerTypes` | `workday.api.worker.getWorkerTypes` | `read` | Retrieves worker type prompt values (Staffing v6). |
| `worker.getWorkerValidTimeOffDates` | `workday.api.worker.getWorkerValidTimeOffDates` | `read` | Retrieves valid time off dates for a worker (Absence Management v5). |
| `worker.retrieveWorkerLeaveOfAbsenceSubresource` | `workday.api.worker.retrieveWorkerLeaveOfAbsenceSubresource` | `read` | Retrieves a leave of absence subresource (Absence Management v5). |
| `workers.getWorkersCollectionStaffing` | `workday.api.workers.getWorkersCollectionStaffing` | `read` | Retrieves workers with staffing information (Staffing v6). |
| `workspace.getWorkspaceInstances` | `workday.api.workspace.getWorkspaceInstances` | `read` | Retrieves workspace prompt values (Staffing v6). |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/workday

## License

Apache-2.0
