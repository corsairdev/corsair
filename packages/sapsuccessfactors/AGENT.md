# SapSuccessfactors Plugin — Agent Completion Guide

> **Auto-generated from scraped API spec.** The Zod schemas, types, and plugin wiring
> are complete. Your job is to fill in the actual HTTP details and write tests.

## About this integration

Cloud-based human capital management software covering Employee Central, Recruiting, Performance & Goals, Learning, Compensation, and more.

- **Auth mode:** `API_KEY` → mapped to Corsair `api_key`
- **Key field:** `api_key` (API Key / Bearer Token)
- **Total operations:** 64

---

## Step 1 — Find the docs

Search for: **"SapSuccessfactors API documentation"** or **"SapSuccessfactors developer docs"**

You're looking for:
1. The **base API URL** (e.g., `https://api.sapsuccessfactors.com/v1`)
2. The **authentication format** — how the key is passed (header name, query param, Bearer prefix)
3. The **endpoint paths** for each operation below

---

## Step 2 — Fill in `client.ts`

Open `client.ts` and:

- [ ] Replace `https://api.TODO_sapsuccessfactors.com` with the real base URL
- [ ] Update the `HEADERS` block to use the correct auth format

Common patterns to look for in the docs:
```
Authorization: Bearer {api_key}       ← most common
X-Api-Key: {api_key}                  ← also common
?api_key={api_key}                    ← query param (add to query object instead)
Authorization: Basic base64(key:)     ← for BASIC auth
```

---

## Step 3 — Fill in each endpoint

The functions are in `endpoints/{group}.ts`. Each has a `TODO_PATH` and `TODO_METHOD` placeholder.
Replace them with the real path and method from the docs.

### All operations (64 total)

| Endpoint | Name | Risk | Description |
|---|---|---|---|
| `approve.approveCalibrationSession` | Approve Calibration Session | `write` | Finalize a calibration session that is In Progress or Approving |
| `calibration.getCalibrationSessionById` | Get Calibration Session By ID | `read` | Get a specific calibration session by session ID |
| `calibration.getCalibrationSessions` | Get Calibration Sessions | `read` | Query all calibration sessions the current user can access |
| `calibration.getCalibrationSubjectById` | Get Calibration Subject By ID | `read` | Query a subject's competency ratings within a calibration session |
| `calibration.getCalibrationSubjectRatings` | Get Calibration Subject Ratings | `read` | Query a subject's ratings/competency ratings/comments by session ID |
| `calibration.updateCalibrationSubjectRatings` | Update Calibration Subject Ratings | `write` | Update a subject's competency ratings in a calibration session |
| `odata.getOdataMetadataCalibSessionService` | Get Calibration Session Metadata | `read` | Get OData metadata / available entity sets for CalSession |
| `odata.getOdataMetadataOnboardingAddl` | Get Onboarding Additional Services Metadata | `read` | Get metadata for Onboarding Additional Services (incl |
| `odata.getOdataMetadataForNominationService` | Get Nomination Service Metadata | `read` | Get OData metadata for the Nomination service |
| `odata.getOdataUserMetadata` | Get User Entity Metadata | `read` | Retrieve OData metadata for the User entity |
| `odata.getOdataMetadataClockInclockOut` | Get Clock In/Out Integration Metadata | `read` | Get OData metadata for the Clock In/Clock Out Integration service |
| `onboardee.createOnboardee` | Create Onboardee | `write` | Create a new onboardee in Onboarding 2 |
| `onb2.getOnb2Process` | Get Onboarding 2.0 Processes | `read` | Retrieve Onboarding 2 |
| `internal.updateInternalUsernameNewHiresAfter` | Update Username Post Hiring | `write` | Update a new hire's internal username after MPH submit, pre day-1 |
| `a.createAFeedbackRequest` | Create a Feedback Request | `write` | Request performance feedback from one employee about another |
| `feedback.getFeedbackRecordsServiceAvailable` | Get Feedback Records | `read` | Query continuous feedback records (OData v4) |
| `pending.getPendingFeedbackRequestsFeedback` | Get Pending Feedback Requests | `read` | Query pending feedback requests |
| `give.giveFeedbackOrRespondToAFeedbackRequest` | Give Feedback or Respond to Feedback Request | `write` | Give feedback or respond to a feedback request (up to 3 Q&A pairs) |
| `metadata.refreshMetadataContFeedbackService` | Refresh Metadata for Continuous Feedback | `write` | Refresh the metadata cache for the Continuous Feedback service |
| `successor.createUpdateSuccessorNomination` | Create or Update Successor Nomination | `write` | Create/update a successor nomination for a position or talent pool |
| `nomination.deleteNominationPositionTalentPool` | Delete Nomination | `destructive` | Remove a nominee from a position or talent pool nomination |
| `talent.getTalentPool` | Get Talent Pool | `read` | Retrieve talent pool records including members and nominations |
| `application.getApplicationInterview` | Get Application Interview | `read` | Retrieve interview info from Interview Central (first 1000 records; filter by applicationId) |
| `interview.getInterviewOverallAssessment` | Get Interview Overall Assessment | `read` | Retrieve overall interview ratings, recommendations, and comments |
| `job.getJobApplication` | Get Job Application | `read` | Retrieve job application records linking candidates to requisitions |
| `job.getJobRequisition` | Get Job Requisition | `read` | Retrieve job requisition records from Recruiting Management |
| `job.getJobReqScreeningQuestion` | Get Job Requisition Screening Questions | `read` | Retrieve screening questions for a job requisition |
| `candidates.listCandidates` | List Candidates | `read` | Retrieve a list of candidates |
| `fo.getFoBusinessUnit` | Get FOBusinessUnit | `read` | Retrieve business unit records for org structure hierarchy |
| `fo.getFoCompany` | Get FOCompany Records | `read` | Retrieve company records (display_name, legal_name, entityOID) |
| `fo.getFoCostCenter` | Get Foundation Object Cost Centers | `read` | Retrieve cost center records for org structure |
| `fo.getFoDepartment` | Get FODepartment Records | `read` | Retrieve department records (team/group org structure) |
| `fo.getFoJobCode` | Get Foundation Object Job Codes | `read` | Retrieve job code records with associated position metadata |
| `fo.getFoJobFunction` | Get Job Functions | `read` | Retrieve job function records for categorizing job roles |
| `fo.getFoLocation` | Get Foundation Object Location | `read` | Retrieve work location records (names, status, timezones, address) |
| `fo.getFoPayGroup` | Get FOPayGroup | `read` | Retrieve pay group records for compensation/payroll groupings |
| `position.getPosition` | Get Position | `read` | Retrieve position management records (structure and hierarchy) |
| `custom.getCustomMdfObject` | Get Custom MDF Object | `read` | Retrieve custom MDF objects (names begin with cust_) |
| `picklist.getPicklist` | Get Picklist | `read` | Retrieve picklist definitions (selectable value lists) |
| `picklist.getPicklistOption` | Get Picklist Option | `read` | Retrieve picklist option values with localized labels |
| `current.getCurrentUser` | Get Current User | `read` | Retrieve the currently authenticated user's information |
| `users.listUsers` | List Users | `read` | Retrieve a list of all employee users |
| `per.getPerPersonById` | Get Person by ID | `read` | Retrieve core person info for an employee by external person ID |
| `per.listPerPerson` | List Person Records | `read` | Retrieve person records (latest active record per person) |
| `per.getPerPersonal` | Get Personal Information Records | `read` | Retrieve biographical info, emergency contacts, social/email data |
| `background.getBackgroundEducation` | Get Background Education | `read` | Retrieve background education records (key: backgroundElementId) |
| `background.getBackgroundMobility` | Get Background Mobility | `read` | Retrieve relocation willingness / geographic mobility preferences |
| `emp.listEmpEmployment` | List Employee Employment Records | `read` | Retrieve employment records (start dates, types, assignment classes) |
| `emp.getEmpEmploymentTermination` | Get Employee Employment Termination | `read` | Retrieve termination records (date, reason) |
| `emp.getEmpPayCompRecurring` | Get Recurring Pay Components | `read` | Retrieve recurring pay components (salary, allowances, benefits) |
| `emp.getEmpPayCompNonRecurring` | Get Non-Recurring Pay Components | `read` | Retrieve non-recurring pay components (bonuses, one-time payments) |
| `work.getWorkOrder` | Get Work Order | `read` | Retrieve work order records for contingent worker management |
| `goal.getGoalPlanTemplate` | Get Goal Plan Template | `read` | Retrieve goal plan template configuration (structure via DTD file) |
| `goals.getGoalsByPlan` | Get Goals By Plan | `read` | Retrieve goals for a specific plan (e |
| `form.getFormContent` | Get Form Content | `read` | Retrieve performance form content (filter by template ID, modified date) |
| `learning.createLearningActivitiesBulk` | Create Learning Activities Bulk | `write` | Create learning activities linked to dev goals in bulk (3rd-party LMS) |
| `cdp.getCdpLearningMetadata` | Get CDP Learning Metadata | `read` | Get metadata for the Career Development Planning Learning service |
| `cdp.refreshCdpLearningMetadata` | Refresh CDP Learning Metadata | `write` | Refresh metadata for the CDP Learning service |
| `employee.getEmployeeTime` | Get Employee Time | `read` | Retrieve employee time entries incl |
| `employee.getEmployeeTimesheet` | Get Employee Timesheet | `read` | Retrieve timesheet records: attendance, overtime, on-call, allowances |
| `temporary.getTemporaryTimeInformation` | Get Temporary Time Information | `read` | Retrieve temporary work schedules assigned to employees |
| `time.getTimeAccountSnapshot` | Get Time Account Snapshot | `read` | Retrieve time account balances for leave liability / payroll as-of a date |
| `query.queryAllAvailableClockClockOut` | Query All Available Clock In/Clock Out Groups | `read` | Retrieve all configured clock in/clock out groups |
| `query.queryClockClockOutGroupCodeTime` | Query Clock In/Clock Out Group By Code | `read` | Retrieve one clock in/out group by code, optionally with time event types |

---

### `approve.approveCalibrationSession` — Approve Calibration Session
- **Description:** Finalize a calibration session that is In Progress or Approving.
- **File:** `endpoints/approve.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/approves` or `/approve/approveCalibrationSession`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `calibration.getCalibrationSessionById` — Get Calibration Session By ID
- **Description:** Get a specific calibration session by session ID.
- **File:** `endpoints/calibration.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/calibrations` or `/calibration/getCalibrationSessionById`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `calibration.getCalibrationSessions` — Get Calibration Sessions
- **Description:** Query all calibration sessions the current user can access.
- **File:** `endpoints/calibration.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/calibrations` or `/calibration/getCalibrationSessions`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `calibration.getCalibrationSubjectById` — Get Calibration Subject By ID
- **Description:** Query a subject's competency ratings within a calibration session.
- **File:** `endpoints/calibration.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/calibrations` or `/calibration/getCalibrationSubjectById`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `calibration.getCalibrationSubjectRatings` — Get Calibration Subject Ratings
- **Description:** Query a subject's ratings/competency ratings/comments by session ID.
- **File:** `endpoints/calibration.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/calibrations` or `/calibration/getCalibrationSubjectRatings`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `calibration.updateCalibrationSubjectRatings` — Update Calibration Subject Ratings
- **Description:** Update a subject's competency ratings in a calibration session.
- **File:** `endpoints/calibration.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/calibrations` or `/calibration/updateCalibrationSubjectRatings`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `odata.getOdataMetadataCalibSessionService` — Get Calibration Session Metadata
- **Description:** Get OData metadata / available entity sets for CalSession.svc.
- **File:** `endpoints/odata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/odatas` or `/odata/getOdataMetadataCalibSessionService`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `odata.getOdataMetadataOnboardingAddl` — Get Onboarding Additional Services Metadata
- **Description:** Get metadata for Onboarding Additional Services (incl. username update ops).
- **File:** `endpoints/odata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/odatas` or `/odata/getOdataMetadataOnboardingAddl`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `odata.getOdataMetadataForNominationService` — Get Nomination Service Metadata
- **Description:** Get OData metadata for the Nomination service.
- **File:** `endpoints/odata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/odatas` or `/odata/getOdataMetadataForNominationService`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `odata.getOdataUserMetadata` — Get User Entity Metadata
- **Description:** Retrieve OData metadata for the User entity.
- **File:** `endpoints/odata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/odatas` or `/odata/getOdataUserMetadata`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `odata.getOdataMetadataClockInclockOut` — Get Clock In/Out Integration Metadata
- **Description:** Get OData metadata for the Clock In/Clock Out Integration service.
- **File:** `endpoints/odata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/odatas` or `/odata/getOdataMetadataClockInclockOut`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `onboardee.createOnboardee` — Create Onboardee
- **Description:** Create a new onboardee in Onboarding 2.0 (new hire or rehire).
- **File:** `endpoints/onboardee.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/onboardees` or `/onboardee/createOnboardee`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `onb2.getOnb2Process` — Get Onboarding 2.0 Processes
- **Description:** Retrieve Onboarding 2.0 process records for new hires.
- **File:** `endpoints/onb2.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/onb2s` or `/onb2/getOnb2Process`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `internal.updateInternalUsernameNewHiresAfter` — Update Username Post Hiring
- **Description:** Update a new hire's internal username after MPH submit, pre day-1.
- **File:** `endpoints/internal.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/internals` or `/internal/updateInternalUsernameNewHiresAfter`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `a.createAFeedbackRequest` — Create a Feedback Request
- **Description:** Request performance feedback from one employee about another.
- **File:** `endpoints/a.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/as` or `/a/createAFeedbackRequest`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `feedback.getFeedbackRecordsServiceAvailable` — Get Feedback Records
- **Description:** Query continuous feedback records (OData v4).
- **File:** `endpoints/feedback.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/feedbacks` or `/feedback/getFeedbackRecordsServiceAvailable`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `pending.getPendingFeedbackRequestsFeedback` — Get Pending Feedback Requests
- **Description:** Query pending feedback requests.
- **File:** `endpoints/pending.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/pendings` or `/pending/getPendingFeedbackRequestsFeedback`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `give.giveFeedbackOrRespondToAFeedbackRequest` — Give Feedback or Respond to Feedback Request
- **Description:** Give feedback or respond to a feedback request (up to 3 Q&A pairs).
- **File:** `endpoints/give.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/gives` or `/give/giveFeedbackOrRespondToAFeedbackRequest`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `metadata.refreshMetadataContFeedbackService` — Refresh Metadata for Continuous Feedback
- **Description:** Refresh the metadata cache for the Continuous Feedback service.
- **File:** `endpoints/metadata.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/metadatas` or `/metadata/refreshMetadataContFeedbackService`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `successor.createUpdateSuccessorNomination` — Create or Update Successor Nomination
- **Description:** Create/update a successor nomination for a position or talent pool.
- **File:** `endpoints/successor.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/successors` or `/successor/createUpdateSuccessorNomination`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `nomination.deleteNominationPositionTalentPool` — Delete Nomination
- **Description:** Remove a nominee from a position or talent pool nomination.
- **File:** `endpoints/nomination.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/nominations` or `/nomination/deleteNominationPositionTalentPool`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `talent.getTalentPool` — Get Talent Pool
- **Description:** Retrieve talent pool records including members and nominations.
- **File:** `endpoints/talent.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/talents` or `/talent/getTalentPool`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `application.getApplicationInterview` — Get Application Interview
- **Description:** Retrieve interview info from Interview Central (first 1000 records; filter by applicationId).
- **File:** `endpoints/application.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/applications` or `/application/getApplicationInterview`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `interview.getInterviewOverallAssessment` — Get Interview Overall Assessment
- **Description:** Retrieve overall interview ratings, recommendations, and comments.
- **File:** `endpoints/interview.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/interviews` or `/interview/getInterviewOverallAssessment`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `job.getJobApplication` — Get Job Application
- **Description:** Retrieve job application records linking candidates to requisitions.
- **File:** `endpoints/job.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/jobs` or `/job/getJobApplication`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `job.getJobRequisition` — Get Job Requisition
- **Description:** Retrieve job requisition records from Recruiting Management.
- **File:** `endpoints/job.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/jobs` or `/job/getJobRequisition`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `job.getJobReqScreeningQuestion` — Get Job Requisition Screening Questions
- **Description:** Retrieve screening questions for a job requisition.
- **File:** `endpoints/job.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/jobs` or `/job/getJobReqScreeningQuestion`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `candidates.listCandidates` — List Candidates
- **Description:** Retrieve a list of candidates.
- **File:** `endpoints/candidates.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/candidatess` or `/candidates/listCandidates`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoBusinessUnit` — Get FOBusinessUnit
- **Description:** Retrieve business unit records for org structure hierarchy.
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoBusinessUnit`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoCompany` — Get FOCompany Records
- **Description:** Retrieve company records (display_name, legal_name, entityOID).
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoCompany`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoCostCenter` — Get Foundation Object Cost Centers
- **Description:** Retrieve cost center records for org structure.
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoCostCenter`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoDepartment` — Get FODepartment Records
- **Description:** Retrieve department records (team/group org structure).
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoDepartment`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoJobCode` — Get Foundation Object Job Codes
- **Description:** Retrieve job code records with associated position metadata.
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoJobCode`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoJobFunction` — Get Job Functions
- **Description:** Retrieve job function records for categorizing job roles.
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoJobFunction`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoLocation` — Get Foundation Object Location
- **Description:** Retrieve work location records (names, status, timezones, address).
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoLocation`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `fo.getFoPayGroup` — Get FOPayGroup
- **Description:** Retrieve pay group records for compensation/payroll groupings.
- **File:** `endpoints/fo.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/fos` or `/fo/getFoPayGroup`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `position.getPosition` — Get Position
- **Description:** Retrieve position management records (structure and hierarchy).
- **File:** `endpoints/position.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/positions` or `/position/getPosition`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `custom.getCustomMdfObject` — Get Custom MDF Object
- **Description:** Retrieve custom MDF objects (names begin with cust_).
- **File:** `endpoints/custom.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/customs` or `/custom/getCustomMdfObject`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `picklist.getPicklist` — Get Picklist
- **Description:** Retrieve picklist definitions (selectable value lists).
- **File:** `endpoints/picklist.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/picklists` or `/picklist/getPicklist`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `picklist.getPicklistOption` — Get Picklist Option
- **Description:** Retrieve picklist option values with localized labels.
- **File:** `endpoints/picklist.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/picklists` or `/picklist/getPicklistOption`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `current.getCurrentUser` — Get Current User
- **Description:** Retrieve the currently authenticated user's information.
- **File:** `endpoints/current.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/currents` or `/current/getCurrentUser`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `users.listUsers` — List Users
- **Description:** Retrieve a list of all employee users.
- **File:** `endpoints/users.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/userss` or `/users/listUsers`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `per.getPerPersonById` — Get Person by ID
- **Description:** Retrieve core person info for an employee by external person ID.
- **File:** `endpoints/per.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/pers` or `/per/getPerPersonById`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `per.listPerPerson` — List Person Records
- **Description:** Retrieve person records (latest active record per person).
- **File:** `endpoints/per.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/pers` or `/per/listPerPerson`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `per.getPerPersonal` — Get Personal Information Records
- **Description:** Retrieve biographical info, emergency contacts, social/email data.
- **File:** `endpoints/per.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/pers` or `/per/getPerPersonal`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `background.getBackgroundEducation` — Get Background Education
- **Description:** Retrieve background education records (key: backgroundElementId).
- **File:** `endpoints/background.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/backgrounds` or `/background/getBackgroundEducation`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `background.getBackgroundMobility` — Get Background Mobility
- **Description:** Retrieve relocation willingness / geographic mobility preferences.
- **File:** `endpoints/background.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/backgrounds` or `/background/getBackgroundMobility`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `emp.listEmpEmployment` — List Employee Employment Records
- **Description:** Retrieve employment records (start dates, types, assignment classes).
- **File:** `endpoints/emp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/emps` or `/emp/listEmpEmployment`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `emp.getEmpEmploymentTermination` — Get Employee Employment Termination
- **Description:** Retrieve termination records (date, reason).
- **File:** `endpoints/emp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/emps` or `/emp/getEmpEmploymentTermination`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `emp.getEmpPayCompRecurring` — Get Recurring Pay Components
- **Description:** Retrieve recurring pay components (salary, allowances, benefits).
- **File:** `endpoints/emp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/emps` or `/emp/getEmpPayCompRecurring`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `emp.getEmpPayCompNonRecurring` — Get Non-Recurring Pay Components
- **Description:** Retrieve non-recurring pay components (bonuses, one-time payments).
- **File:** `endpoints/emp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/emps` or `/emp/getEmpPayCompNonRecurring`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `work.getWorkOrder` — Get Work Order
- **Description:** Retrieve work order records for contingent worker management.
- **File:** `endpoints/work.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/works` or `/work/getWorkOrder`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `goal.getGoalPlanTemplate` — Get Goal Plan Template
- **Description:** Retrieve goal plan template configuration (structure via DTD file).
- **File:** `endpoints/goal.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/goals` or `/goal/getGoalPlanTemplate`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `goals.getGoalsByPlan` — Get Goals By Plan
- **Description:** Retrieve goals for a specific plan (e.g. Goal_11), optionally by userId.
- **File:** `endpoints/goals.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/goalss` or `/goals/getGoalsByPlan`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `form.getFormContent` — Get Form Content
- **Description:** Retrieve performance form content (filter by template ID, modified date).
- **File:** `endpoints/form.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/forms` or `/form/getFormContent`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `learning.createLearningActivitiesBulk` — Create Learning Activities Bulk
- **Description:** Create learning activities linked to dev goals in bulk (3rd-party LMS).
- **File:** `endpoints/learning.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/learnings` or `/learning/createLearningActivitiesBulk`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `cdp.getCdpLearningMetadata` — Get CDP Learning Metadata
- **Description:** Get metadata for the Career Development Planning Learning service.
- **File:** `endpoints/cdp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/cdps` or `/cdp/getCdpLearningMetadata`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `cdp.refreshCdpLearningMetadata` — Refresh CDP Learning Metadata
- **Description:** Refresh metadata for the CDP Learning service.
- **File:** `endpoints/cdp.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/cdps` or `/cdp/refreshCdpLearningMetadata`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **body**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `employee.getEmployeeTime` — Get Employee Time
- **Description:** Retrieve employee time entries incl. time off (filter by userId/status/type/date).
- **File:** `endpoints/employee.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/employees` or `/employee/getEmployeeTime`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `employee.getEmployeeTimesheet` — Get Employee Timesheet
- **Description:** Retrieve timesheet records: attendance, overtime, on-call, allowances.
- **File:** `endpoints/employee.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/employees` or `/employee/getEmployeeTimesheet`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `temporary.getTemporaryTimeInformation` — Get Temporary Time Information
- **Description:** Retrieve temporary work schedules assigned to employees.
- **File:** `endpoints/temporary.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/temporarys` or `/temporary/getTemporaryTimeInformation`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `time.getTimeAccountSnapshot` — Get Time Account Snapshot
- **Description:** Retrieve time account balances for leave liability / payroll as-of a date.
- **File:** `endpoints/time.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/times` or `/time/getTimeAccountSnapshot`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `query.queryAllAvailableClockClockOut` — Query All Available Clock In/Clock Out Groups
- **Description:** Retrieve all configured clock in/clock out groups.
- **File:** `endpoints/query.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/querys` or `/query/queryAllAvailableClockClockOut`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

### `query.queryClockClockOutGroupCodeTime` — Query Clock In/Clock Out Group By Code
- **Description:** Retrieve one clock in/out group by code, optionally with time event types.
- **File:** `endpoints/query.ts`
- [ ] Set the correct HTTP method (`GET`/`POST`/`PUT`/`DELETE`/`PATCH`)
- [ ] Set the correct endpoint path (e.g., `/v1/querys` or `/query/queryClockClockOutGroupCodeTime`)
- [ ] Confirm params go in `query` (GET) or `body` (POST/PUT) — currently defaulted to **query**
- [ ] Verify the input schema in `endpoints/types.ts` matches actual API docs

---

## Step 4 — Webhooks


This integration does not have documented webhook triggers in the scraped spec.

Check the docs to confirm:
- [ ] Does SapSuccessfactors support webhooks? If yes, add them following the Resend plugin as a reference (`packages/resend/webhooks/`).
- [ ] If no webhooks, the empty `webhooksNested` in `index.ts` is correct.

## Webhook tenant routing

Corsair routes multi-tenant webhooks using three linked pieces. **linkType must match across all three:**

| Piece | File | Purpose |
|---|---|---|
| `pluginTenantWebhookMatcher` | `webhooks/tenant-matcher.ts` | Extract id from incoming webhook |
| `authConfig.{authType}.account` | `index.ts` | Field name stored on `corsair_accounts.config` |
| `oauthWebhookTenantLinkResolver` | `webhooks/oauth-tenant-link.ts` | Populate field after OAuth (if applicable) |

- [ ] Rename `tenant_external_id` to the provider's real field (e.g. `team_id`, `installation_id`)
- [ ] Update `match{Plugin}TenantWebhook` to parse the webhook payload (return `null` for handshakes)
- [ ] Update `{plugin}AuthConfig` account fields to use the same linkType
- [ ] If OAuth: implement `resolve{Plugin}OAuthWebhookTenantLink` (token response and/or post-OAuth API call)
- [ ] Wire `pluginTenantWebhookMatcher` and `oauthWebhookTenantLinkResolver` on the plugin return object
- [ ] Reference: `packages/slack/webhooks/tenant-matcher.ts` and `packages/slack/webhooks/oauth-tenant-link.ts`



---

## Step 5 — Typecheck

```bash
cd packages/sapsuccessfactors && pnpm typecheck
# or from the root:
pnpm typecheck
```

Fix any TypeScript errors before moving on.

---

## Step 6 — Write tests

Create a `tests/` directory in this package. Write at minimum:

1. **Schema validation tests** — confirm the Zod schemas accept valid payloads and reject invalid ones
2. **Endpoint stub tests** — mock `makeSapsuccessfactorsRequest` and verify the correct path/method/params are passed
3. **At least one happy-path integration test** if you have access to a SapSuccessfactors sandbox/test account

Reference: look at existing test files in `packages/resend/` or `packages/slack/` for patterns.

---

## Step 7 — Register in your corsair instance

After the plugin is complete, add it to your app's `corsair.ts`:

```ts
import { sapsuccessfactors } from '@corsair-dev/sapsuccessfactors';

export const corsair = createCorsair({
  plugins: [
    sapsuccessfactors({ key: process.env.SAPSUCCESSFACTORS_API_KEY }),
    // ... other plugins
  ],
});
```
