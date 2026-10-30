# @corsair-dev/sapsuccessfactors

SAP SuccessFactors plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/sapsuccessfactors
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `a.createAFeedbackRequest` | `sapsuccessfactors.api.a.createAFeedbackRequest` | `write` | Create a continuous feedback request |
| `application.getApplicationInterview` | `sapsuccessfactors.api.application.getApplicationInterview` | `read` | Retrieve interview information for job applications |
| `approve.approveCalibrationSession` | `sapsuccessfactors.api.approve.approveCalibrationSession` | `write` | Finalize a calibration session that is In Progress or Approving |
| `background.getBackgroundEducation` | `sapsuccessfactors.api.background.getBackgroundEducation` | `read` | Retrieve Background_Education records |
| `background.getBackgroundMobility` | `sapsuccessfactors.api.background.getBackgroundMobility` | `read` | Retrieve Background_Mobility records |
| `calibration.getCalibrationSessionById` | `sapsuccessfactors.api.calibration.getCalibrationSessionById` | `read` | Get a specific calibration session by session ID |
| `calibration.getCalibrationSessions` | `sapsuccessfactors.api.calibration.getCalibrationSessions` | `read` | Query all calibration sessions the current user can access |
| `calibration.getCalibrationSubjectById` | `sapsuccessfactors.api.calibration.getCalibrationSubjectById` | `read` | Query a subject's competency ratings within a calibration session |
| `calibration.getCalibrationSubjectRatings` | `sapsuccessfactors.api.calibration.getCalibrationSubjectRatings` | `read` | Query a subject's ratings by session ID |
| `calibration.updateCalibrationSubjectRatings` | `sapsuccessfactors.api.calibration.updateCalibrationSubjectRatings` | `write` | Update a subject's competency ratings in a calibration session |
| `candidates.listCandidates` | `sapsuccessfactors.api.candidates.listCandidates` | `read` | Retrieve candidates |
| `cdp.getCdpLearningMetadata` | `sapsuccessfactors.api.cdp.getCdpLearningMetadata` | `read` | Get metadata for Career Development Planning Learning |
| `cdp.refreshCdpLearningMetadata` | `sapsuccessfactors.api.cdp.refreshCdpLearningMetadata` | `write` | Refresh CDP Learning metadata |
| `current.getCurrentUser` | `sapsuccessfactors.api.current.getCurrentUser` | `read` | Retrieve the currently authenticated user |
| `custom.getCustomMdfObject` | `sapsuccessfactors.api.custom.getCustomMdfObject` | `read` | Retrieve custom MDF objects (cust_* entities) |
| `emp.getEmpEmploymentTermination` | `sapsuccessfactors.api.emp.getEmpEmploymentTermination` | `read` | Retrieve EmpEmploymentTermination records |
| `emp.getEmpPayCompNonRecurring` | `sapsuccessfactors.api.emp.getEmpPayCompNonRecurring` | `read` | Retrieve EmpPayCompNonRecurring records |
| `emp.getEmpPayCompRecurring` | `sapsuccessfactors.api.emp.getEmpPayCompRecurring` | `read` | Retrieve EmpPayCompRecurring records |
| `emp.listEmpEmployment` | `sapsuccessfactors.api.emp.listEmpEmployment` | `read` | List EmpEmployment records |
| `employee.getEmployeeTime` | `sapsuccessfactors.api.employee.getEmployeeTime` | `read` | Retrieve EmployeeTime records |
| `employee.getEmployeeTimesheet` | `sapsuccessfactors.api.employee.getEmployeeTimesheet` | `read` | Retrieve EmployeeTimeSheet records |
| `feedback.getFeedbackRecordsServiceAvailable` | `sapsuccessfactors.api.feedback.getFeedbackRecordsServiceAvailable` | `read` | Retrieve continuous feedback records (OData V4) |
| `fo.getFoBusinessUnit` | `sapsuccessfactors.api.fo.getFoBusinessUnit` | `read` | Retrieve FOBusinessUnit records |
| `fo.getFoCompany` | `sapsuccessfactors.api.fo.getFoCompany` | `read` | Retrieve FOCompany records |
| `fo.getFoCostCenter` | `sapsuccessfactors.api.fo.getFoCostCenter` | `read` | Retrieve FOCostCenter records |
| `fo.getFoDepartment` | `sapsuccessfactors.api.fo.getFoDepartment` | `read` | Retrieve FODepartment records |
| `fo.getFoJobCode` | `sapsuccessfactors.api.fo.getFoJobCode` | `read` | Retrieve FOJobCode records |
| `fo.getFoJobFunction` | `sapsuccessfactors.api.fo.getFoJobFunction` | `read` | Retrieve FOJobFunction records |
| `fo.getFoLocation` | `sapsuccessfactors.api.fo.getFoLocation` | `read` | Retrieve FOLocation records |
| `fo.getFoPayGroup` | `sapsuccessfactors.api.fo.getFoPayGroup` | `read` | Retrieve FOPayGroup records |
| `form.getFormContent` | `sapsuccessfactors.api.form.getFormContent` | `read` | Retrieve performance form content |
| `give.giveFeedbackOrRespondToAFeedbackRequest` | `sapsuccessfactors.api.give.giveFeedbackOrRespondToAFeedbackRequest` | `write` | Give feedback or respond to a feedback request |
| `goal.getGoalPlanTemplate` | `sapsuccessfactors.api.goal.getGoalPlanTemplate` | `read` | Retrieve goal plan template records |
| `goals.getGoalsByPlan` | `sapsuccessfactors.api.goals.getGoalsByPlan` | `read` | Retrieve goals for a Goal_<planId> entity |
| `internal.updateInternalUsernameNewHiresAfter` | `sapsuccessfactors.api.internal.updateInternalUsernameNewHiresAfter` | `write` | Update internal username of new hires after MPH submit |
| `interview.getInterviewOverallAssessment` | `sapsuccessfactors.api.interview.getInterviewOverallAssessment` | `read` | Retrieve overall interview ratings |
| `job.getJobApplication` | `sapsuccessfactors.api.job.getJobApplication` | `read` | Retrieve job application records |
| `job.getJobReqScreeningQuestion` | `sapsuccessfactors.api.job.getJobReqScreeningQuestion` | `read` | Retrieve screening questions for job requisitions |
| `job.getJobRequisition` | `sapsuccessfactors.api.job.getJobRequisition` | `read` | Retrieve job requisition records |
| `learning.createLearningActivitiesBulk` | `sapsuccessfactors.api.learning.createLearningActivitiesBulk` | `write` | Create learning activities in bulk |
| `metadata.refreshMetadataContFeedbackService` | `sapsuccessfactors.api.metadata.refreshMetadataContFeedbackService` | `write` | Refresh metadata cache for Continuous Feedback |
| `nomination.deleteNominationPositionTalentPool` | `sapsuccessfactors.api.nomination.deleteNominationPositionTalentPool` | `destructive` | Delete a nomination for a position or talent pool |
| `odata.getOdataMetadataCalibSessionService` | `sapsuccessfactors.api.odata.getOdataMetadataCalibSessionService` | `read` | Get OData metadata for Calibration Session service |
| `odata.getOdataMetadataClockInclockOut` | `sapsuccessfactors.api.odata.getOdataMetadataClockInclockOut` | `read` | Get OData metadata for Clock In/Clock Out Integration |
| `odata.getOdataMetadataForNominationService` | `sapsuccessfactors.api.odata.getOdataMetadataForNominationService` | `read` | Get OData metadata for Nomination service |
| `odata.getOdataMetadataOnboardingAddl` | `sapsuccessfactors.api.odata.getOdataMetadataOnboardingAddl` | `read` | Get OData metadata for Onboarding Additional Services |
| `odata.getOdataUserMetadata` | `sapsuccessfactors.api.odata.getOdataUserMetadata` | `read` | Get OData metadata for the User entity |
| `onb2.getOnb2Process` | `sapsuccessfactors.api.onb2.getOnb2Process` | `read` | Retrieve Onboarding 2.0 process records |
| `onboardee.createOnboardee` | `sapsuccessfactors.api.onboardee.createOnboardee` | `write` | Create a new onboardee (User) for Onboarding 2.0 |
| `pending.getPendingFeedbackRequestsFeedback` | `sapsuccessfactors.api.pending.getPendingFeedbackRequestsFeedback` | `read` | Retrieve pending feedback requests |
| `per.getPerPersonal` | `sapsuccessfactors.api.per.getPerPersonal` | `read` | Retrieve PerPersonal biographical records |
| `per.getPerPersonById` | `sapsuccessfactors.api.per.getPerPersonById` | `read` | Retrieve PerPerson by personIdExternal |
| `per.listPerPerson` | `sapsuccessfactors.api.per.listPerPerson` | `read` | List PerPerson records |
| `picklist.getPicklist` | `sapsuccessfactors.api.picklist.getPicklist` | `read` | Retrieve picklist definitions |
| `picklist.getPicklistOption` | `sapsuccessfactors.api.picklist.getPicklistOption` | `read` | Retrieve picklist option values |
| `position.getPosition` | `sapsuccessfactors.api.position.getPosition` | `read` | Retrieve position management records |
| `query.queryAllAvailableClockClockOut` | `sapsuccessfactors.api.query.queryAllAvailableClockClockOut` | `read` | Query all clock in/out groups |
| `query.queryClockClockOutGroupCodeTime` | `sapsuccessfactors.api.query.queryClockClockOutGroupCodeTime` | `read` | Query a clock in/out group by code |
| `successor.createUpdateSuccessorNomination` | `sapsuccessfactors.api.successor.createUpdateSuccessorNomination` | `write` | Create or update a successor nomination |
| `talent.getTalentPool` | `sapsuccessfactors.api.talent.getTalentPool` | `read` | Retrieve talent pool records |
| `temporary.getTemporaryTimeInformation` | `sapsuccessfactors.api.temporary.getTemporaryTimeInformation` | `read` | Retrieve TemporaryTimeInformation records |
| `time.getTimeAccountSnapshot` | `sapsuccessfactors.api.time.getTimeAccountSnapshot` | `read` | Retrieve TimeAccountSnapshot records |
| `users.listUsers` | `sapsuccessfactors.api.users.listUsers` | `read` | List User entity records |
| `work.getWorkOrder` | `sapsuccessfactors.api.work.getWorkOrder` | `read` | Retrieve WorkOrder records for contingent workers |

## Auth

Auth: API key, OAuth 2.0 (default OAuth 2.0). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sapsuccessfactors

## License

Apache-2.0
