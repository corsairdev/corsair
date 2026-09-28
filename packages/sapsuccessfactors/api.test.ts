import { request } from 'corsair/http';
import { makeSapsuccessfactorsRequest } from './client';
import { executeSapOperation } from './endpoints/factory';
import { getSapRoute, sapRoutes } from './endpoints/routes';
import { SapsuccessfactorsEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { SapsuccessfactorsContext } from './index';
import { sapsuccessfactors } from './index';

jest.mock('corsair/http', () => ({
	request: jest.fn().mockResolvedValue({
		d: {
			results: [
				{
					userId: 'cgrant',
					personIdExternal: 'p1',
					jobReqId: 1,
					candidateId: 1,
					applicationId: 1,
					code: 'POS-1',
					sessionId: 's1',
					subjectId: 'sub1',
					externalCode: '1000',
					id: '1',
					nominationTargetId: 'nt-1',
					picklistId: 'pk1',
					formContentId: 'fc1',
				},
			],
		},
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

const mockedRequest = request as jest.MockedFunction<typeof request>;

const plugin = sapsuccessfactors({
	authType: 'api_key',
	key: 'test-token',
	host: 'api10.successfactors.com',
	companyId: 'ACME',
});

const mockCtx = {
	key: 'test-token',
	options: { host: 'api10.successfactors.com' },
	$getAccountId: async () => 'acc_test',
	log: jest.fn(),
} as unknown as SapsuccessfactorsContext;

function run(name: Parameters<typeof getSapRoute>[0], input: unknown) {
	return executeSapOperation(mockCtx, input as never, getSapRoute(name));
}

function lastCall() {
	expect(mockedRequest).toHaveBeenCalled();
	const [, opts] = mockedRequest.mock.calls.at(-1) ?? [];
	return opts as {
		method?: string;
		url?: string;
		query?: Record<string, unknown>;
	};
}

const fixtures: Record<string, Record<string, unknown>> = {
	approveCalibrationSession: { session_id: 's1' },
	getCalibrationSessionById: { session_id: 's1' },
	getCalibrationSessions: { top: 10 },
	getOdataMetadataCalibSessionService: {},
	getCalibrationSubjectById: { subject_id: 'sub1' },
	getCalibrationSubjectRatings: { session_id: 's1' },
	updateCalibrationSubjectRatings: { subject_id: 'sub1', body: { rating: 3 } },
	createOnboardee: { userId: 'nhire1', username: 'nhire1' },
	getOnb2Process: { top: 5 },
	getOdataMetadataOnboardingAddl: {},
	updateInternalUsernameNewHiresAfter: {
		userId: 'nhire1',
		newUsername: 'nhire1.int',
	},
	createAFeedbackRequest: {
		questions: [{ question: 'What should they start doing?' }],
	},
	getFeedbackRecordsServiceAvailable: { top: 5 },
	getPendingFeedbackRequestsFeedback: { top: 5 },
	giveFeedbackOrRespondToAFeedbackRequest: {
		questions: [{ question: 'Strengths', answer: 'Clear communicator' }],
	},
	refreshMetadataContFeedbackService: {},
	createUpdateSuccessorNomination: { userId: 'cgrant', positionCode: 'POS-1' },
	deleteNominationPositionTalentPool: {
		nominationTargetId: 'nt-1',
		userId: 'cgrant',
		isPoolNomination: true,
	},
	getOdataMetadataForNominationService: {},
	getTalentPool: { top: 5 },
	getApplicationInterview: { applicationId: '1001' },
	getInterviewOverallAssessment: { top: 5 },
	getJobApplication: { top: 5 },
	getJobRequisition: { top: 5 },
	getJobReqScreeningQuestion: { top: 5 },
	listCandidates: { top: 5 },
	getFoBusinessUnit: { top: 5 },
	getFoCompany: { top: 5 },
	getFoCostCenter: { top: 5 },
	getFoDepartment: { top: 5 },
	getFoJobCode: { top: 5 },
	getFoJobFunction: { top: 5 },
	getFoLocation: { top: 5 },
	getFoPayGroup: { top: 5 },
	getPosition: { top: 5 },
	getCustomMdfObject: { custom_object: 'cust_TeamGoal' },
	getPicklist: { top: 5 },
	getPicklistOption: { top: 5 },
	getCurrentUser: {},
	getOdataUserMetadata: {},
	listUsers: { top: 10, filter: "status eq 't'" },
	getPerPersonById: { person_id_external: 'p1' },
	listPerPerson: { top: 5 },
	getPerPersonal: { top: 5 },
	getBackgroundEducation: { top: 5 },
	getBackgroundMobility: { top: 5 },
	listEmpEmployment: { top: 5 },
	getEmpEmploymentTermination: { top: 5 },
	getWorkOrder: { top: 5 },
	getEmpPayCompRecurring: { top: 5 },
	getEmpPayCompNonRecurring: { top: 5 },
	getGoalPlanTemplate: { top: 5 },
	getGoalsByPlan: { goal_plan_id: '11' },
	getFormContent: { top: 5 },
	createLearningActivitiesBulk: { body: { activities: [] } },
	getCdpLearningMetadata: {},
	refreshCdpLearningMetadata: {},
	getEmployeeTime: { top: 5 },
	getEmployeeTimesheet: { top: 5 },
	getTemporaryTimeInformation: { top: 5 },
	getTimeAccountSnapshot: { top: 5 },
	getOdataMetadataClockInclockOut: {},
	queryAllAvailableClockClockOut: { top: 5 },
	queryClockClockOutGroupCodeTime: { code: 'CICO1' },
};

describe('SAP SuccessFactors plugin', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('registers oauth_2 and api_key auth', () => {
		expect(plugin.id).toBe('sapsuccessfactors');
		expect(plugin.authConfig).toEqual(
			expect.objectContaining({
				oauth_2: expect.anything(),
				api_key: expect.anything(),
			}),
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://api10.successfactors.com/oauth/token',
		);
		expect(plugin.errorHandlers?.RATE_LIMIT_ERROR).toBeDefined();
	});

	it('maps OData query keys and sends query on GET', async () => {
		await makeSapsuccessfactorsRequest('odata/v2/User', 'k', {
			method: 'GET',
			query: { top: 10, filter: "status eq 't'" },
			host: 'api10.successfactors.com',
		});
		expect(lastCall().query).toEqual(
			expect.objectContaining({
				$format: 'json',
				$top: 10,
				$filter: "status eq 't'",
			}),
		);
	});

	it('uses APIKey header on SAP API Business Hub sandbox', async () => {
		await makeSapsuccessfactorsRequest('odata/v2/User', 'hub-key', {
			host: 'sandbox.api.sap.com',
		});
		const [config, opts] = mockedRequest.mock.calls.at(-1) ?? [];
		expect(config).toEqual(
			expect.objectContaining({
				BASE: 'https://sandbox.api.sap.com',
				HEADERS: expect.objectContaining({ APIKey: 'hub-key' }),
			}),
		);
		expect(opts).toEqual(expect.objectContaining({ url: '/odata/v2/User' }));
	});

	it('rejects non-numeric paging before the HTTP call', async () => {
		await expect(run('listUsers', { top: 'nope' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that is not an OData envelope', async () => {
		mockedRequest.mockResolvedValueOnce({ garbage: true } as never);
		await expect(run('listUsers', { top: 1 })).rejects.toThrow();
	});

	it('treats 204 writes as success', async () => {
		mockedRequest.mockResolvedValueOnce(undefined as never);
		await expect(
			run('updateCalibrationSubjectRatings', {
				subject_id: 'sub1',
				body: { rating: 3 },
			}),
		).resolves.toBeUndefined();
	});

	it('rejects User as a custom MDF entity', async () => {
		await expect(
			run('getCustomMdfObject', { custom_object: 'User' }),
		).rejects.toThrow(/cust_/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('encodes cust_* MDF names into the OData path', async () => {
		await run('getCustomMdfObject', { custom_object: 'cust_TeamGoal' });
		expect(lastCall().url).toBe('/odata/v2/cust_TeamGoal');
	});

	it('deletes NominationTarget with userId and isPoolNomination', async () => {
		mockedRequest.mockResolvedValueOnce(undefined as never);
		await run('deleteNominationPositionTalentPool', {
			nominationTargetId: 'nt-1',
			userId: 'cgrant',
			isPoolNomination: true,
		});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'DELETE',
				url: "/odata/v4/NominationService.svc/NominationTarget('nt-1')",
				query: expect.objectContaining({
					userId: 'cgrant',
					isPoolNomination: true,
				}),
			}),
		);
	});

	it('requires applicationId for Interview Central', async () => {
		await expect(run('getApplicationInterview', {})).rejects.toThrow(
			/applicationId/,
		);
		await run('getApplicationInterview', { applicationId: '1001' });
		expect(lastCall().query).toEqual(
			expect.objectContaining({
				$filter: "applicationId eq '1001'",
			}),
		);
	});

	it('maps Goal_11 plan ids to the Goal_11 entity set', async () => {
		await run('getGoalsByPlan', { goal_plan_id: 'Goal_11' });
		expect(lastCall().url).toBe('/odata/v2/Goal_11');
	});

	it('filters current user with $loggedInUser', async () => {
		await run('getCurrentUser', {});
		expect(lastCall()).toEqual(
			expect.objectContaining({
				method: 'GET',
				url: '/odata/v2/User',
				query: expect.objectContaining({
					$filter: "userId eq '$loggedInUser'",
				}),
			}),
		);
	});

	it('matches rate-limit errors', async () => {
		expect(errorHandlers.RATE_LIMIT_ERROR.match(new Error('429'))).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(new Error('429'));
		expect(res.maxRetries).toBe(3);
	});

	it.each(sapRoutes.map((route) => [route.name, route.method] as const))(
		'%s sends %s',
		async (name, method) => {
			const input = fixtures[name];
			expect(input).toBeDefined();
			SapsuccessfactorsEndpointInputSchemas[name].parse(input);
			const route = getSapRoute(name);
			const record = {
				userId: 'cgrant',
				personIdExternal: 'p1',
				jobReqId: 1,
				candidateId: 1,
				applicationId: 1,
				code: 'CICO1',
				sessionId: 's1',
				subjectId: 'sub1',
				externalCode: '1000',
				id: '1',
				nominationTargetId: 'nt-1',
				picklistId: 'pk1',
				formContentId: 'fc1',
			};
			mockedRequest.mockResolvedValueOnce(
				(route.path.includes('$metadata')
					? '<?xml version="1.0"?><edmx:Edmx/>'
					: route.method === 'GET' && route.path.includes('({')
						? { d: record }
						: route.method === 'GET'
							? { d: { results: [record] } }
							: { d: record }) as never,
			);
			await run(name, input);
			expect(lastCall().method).toBe(method);
			expect(lastCall().url).toMatch(/^\//);
		},
	);
});
