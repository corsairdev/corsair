import { request } from 'corsair/http';
import { makeSapsuccessfactorsRequest } from './client';
import { errorHandlers } from './error-handlers';
import { sapsuccessfactors } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn().mockResolvedValue({
		d: { results: [{ id: 'test-123' }], id: 'test-123', status: 'OK' },
	}),
	ApiError: class ApiError extends Error {
		constructor(
			public status: number,
			message: string,
			public retryAfter?: number,
		) {
			super(message);
			this.name = 'ApiError';
		}
	},
}));

const mockedRequest = request as any;

describe('SapSuccessfactors Plugin', () => {
	const plugin = sapsuccessfactors({
		key: 'test-api-token',
		apiBaseUrl: 'https://api10.successfactors.com',
	});
	const mockCtx = {
		key: 'test-api-token',
		options: { apiBaseUrl: 'https://api10.successfactors.com' },
		database: undefined,
		$getAccountId: async () => 'acc_test_123',
		log: jest.fn(),
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes plugin with correct id and configuration', () => {
		expect(plugin.id).toBe('sapsuccessfactors');
		expect(plugin.authConfig).toBeUndefined();
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.schema).toBeDefined();
	});

	it('handles rate limit error matching in errorHandlers', async () => {
		const handler = errorHandlers.RATE_LIMIT_ERROR;
		expect(handler.match(new Error('Rate limit 429'))).toBe(true);
		const res = await handler.handler(new Error('429'));
		expect(res.maxRetries).toBe(3);
	});

	it('translates query parameters into OData v2 format ($top, $filter)', async () => {
		await makeSapsuccessfactorsRequest('odata/v2/User', 'test-key', {
			method: 'GET',
			query: { top: 10, filter: "status eq 'ACTIVE'" },
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				query: expect.objectContaining({
					$format: 'json',
					$top: 10,
					$filter: "status eq 'ACTIVE'",
				}),
			}),
			expect.anything(),
		);
	});

	it('normalizes sandbox and production base URLs properly', async () => {
		await makeSapsuccessfactorsRequest('odata/v2/User', 'test-key', {
			apiBaseUrl: 'https://sandbox.api.sap.com/odata/v2',
		});
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				BASE: 'https://sandbox.api.sap.com',
				TOKEN: undefined,
				HEADERS: expect.objectContaining({
					APIKey: 'test-key',
				}),
			}),
			expect.objectContaining({
				url: '/odata/v2/User',
			}),
			expect.anything(),
		);

		await makeSapsuccessfactorsRequest('odata/v2/User', 'test-key', {
			apiBaseUrl:
				'https://sandbox.api.sap.com/successfactorsfoundation/odata/v2',
		});
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				BASE: 'https://sandbox.api.sap.com/successfactorsfoundation',
				TOKEN: undefined,
			}),
			expect.objectContaining({
				url: '/odata/v2/User',
			}),
			expect.anything(),
		);

		await makeSapsuccessfactorsRequest('odata/v2/User', 'test-key', {
			apiBaseUrl: 'api10.successfactors.com/odata/v2',
		});
		expect(mockedRequest).toHaveBeenLastCalledWith(
			expect.objectContaining({
				BASE: 'https://api10.successfactors.com',
				TOKEN: 'test-key',
			}),
			expect.objectContaining({
				url: '/odata/v2/User',
			}),
			expect.anything(),
		);
	});

	it('calls approve.approveCalibrationSession endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.approve
			?.approveCalibrationSession;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { session_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls calibration.getCalibrationSessionById endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.calibration
			?.getCalibrationSessionById;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { session_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls calibration.getCalibrationSessions endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.calibration
			?.getCalibrationSessions;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls calibration.getCalibrationSubjectById endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.calibration
			?.getCalibrationSubjectById;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { subject_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls calibration.getCalibrationSubjectRatings endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.calibration
			?.getCalibrationSubjectRatings;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { session_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls calibration.updateCalibrationSubjectRatings endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.calibration
			?.updateCalibrationSubjectRatings;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {
			subject_id: 'test_value',
			body: { test: 'data' },
		} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls odata.getOdataMetadataCalibSessionService endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.odata
			?.getOdataMetadataCalibSessionService;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls odata.getOdataMetadataOnboardingAddl endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.odata
			?.getOdataMetadataOnboardingAddl;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls odata.getOdataMetadataForNominationService endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.odata
			?.getOdataMetadataForNominationService;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls odata.getOdataUserMetadata endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.odata?.getOdataUserMetadata;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls odata.getOdataMetadataClockInclockOut endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.odata
			?.getOdataMetadataClockInclockOut;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls onboardee.createOnboardee endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.onboardee?.createOnboardee;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { body: { test: 'data' } } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls onb2.getOnb2Process endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.onb2?.getOnb2Process;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls internal.updateInternalUsernameNewHiresAfter endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.internal
			?.updateInternalUsernameNewHiresAfter;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {
			user_id: 'test_value',
			new_username: 'test_value',
		} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls a.createAFeedbackRequest endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.a?.createAFeedbackRequest;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { body: { test: 'data' } } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls feedback.getFeedbackRecordsServiceAvailable endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.feedback
			?.getFeedbackRecordsServiceAvailable;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls pending.getPendingFeedbackRequestsFeedback endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.pending
			?.getPendingFeedbackRequestsFeedback;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls give.giveFeedbackOrRespondToAFeedbackRequest endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.give
			?.giveFeedbackOrRespondToAFeedbackRequest;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { body: { test: 'data' } } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls metadata.refreshMetadataContFeedbackService endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.metadata
			?.refreshMetadataContFeedbackService;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls successor.createUpdateSuccessorNomination endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.successor
			?.createUpdateSuccessorNomination;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { body: { test: 'data' } } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls nomination.deleteNominationPositionTalentPool endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.nomination
			?.deleteNominationPositionTalentPool;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { nomination_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls talent.getTalentPool endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.talent?.getTalentPool;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls application.getApplicationInterview endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.application
			?.getApplicationInterview;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls interview.getInterviewOverallAssessment endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.interview
			?.getInterviewOverallAssessment;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls job.getJobApplication endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.job?.getJobApplication;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls job.getJobRequisition endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.job?.getJobRequisition;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls job.getJobReqScreeningQuestion endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.job?.getJobReqScreeningQuestion;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls candidates.listCandidates endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.candidates?.listCandidates;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoBusinessUnit endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoBusinessUnit;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoCompany endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoCompany;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoCostCenter endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoCostCenter;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoDepartment endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoDepartment;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoJobCode endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoJobCode;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoJobFunction endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoJobFunction;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoLocation endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoLocation;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls fo.getFoPayGroup endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.fo?.getFoPayGroup;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls position.getPosition endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.position?.getPosition;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls custom.getCustomMdfObject endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.custom?.getCustomMdfObject;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { custom_object: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls picklist.getPicklist endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.picklist?.getPicklist;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls picklist.getPicklistOption endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.picklist?.getPicklistOption;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls current.getCurrentUser endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.current?.getCurrentUser;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls users.listUsers endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.users?.listUsers;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls per.getPerPersonById endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.per?.getPerPersonById;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {
			person_id_external: 'test_value',
		} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls per.listPerPerson endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.per?.listPerPerson;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls per.getPerPersonal endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.per?.getPerPersonal;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls background.getBackgroundEducation endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.background
			?.getBackgroundEducation;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls background.getBackgroundMobility endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.background
			?.getBackgroundMobility;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls emp.listEmpEmployment endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.emp?.listEmpEmployment;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls emp.getEmpEmploymentTermination endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.emp
			?.getEmpEmploymentTermination;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls emp.getEmpPayCompRecurring endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.emp?.getEmpPayCompRecurring;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls emp.getEmpPayCompNonRecurring endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.emp?.getEmpPayCompNonRecurring;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls work.getWorkOrder endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.work?.getWorkOrder;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls goal.getGoalPlanTemplate endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.goal?.getGoalPlanTemplate;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls goals.getGoalsByPlan endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.goals?.getGoalsByPlan;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { goal_plan_id: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls form.getFormContent endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.form?.getFormContent;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls learning.createLearningActivitiesBulk endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.learning
			?.createLearningActivitiesBulk;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { body: { test: 'data' } } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls cdp.getCdpLearningMetadata endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.cdp?.getCdpLearningMetadata;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls cdp.refreshCdpLearningMetadata endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.cdp?.refreshCdpLearningMetadata;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls employee.getEmployeeTime endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.employee?.getEmployeeTime;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls employee.getEmployeeTimesheet endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.employee?.getEmployeeTimesheet;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls temporary.getTemporaryTimeInformation endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.temporary
			?.getTemporaryTimeInformation;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls time.getTimeAccountSnapshot endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.time?.getTimeAccountSnapshot;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls query.queryAllAvailableClockClockOut endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.query
			?.queryAllAvailableClockClockOut;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, {} as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});

	it('calls query.queryClockClockOutGroupCodeTime endpoint correctly', async () => {
		const endpoint = (plugin.endpoints as any)?.query
			?.queryClockClockOutGroupCodeTime;
		expect(endpoint).toBeDefined();
		const res = await endpoint(mockCtx, { code: 'test_value' } as any);
		expect(res).toBeDefined();
		expect(mockedRequest).toHaveBeenCalled();
	});
});
