import {
	ApplicationInfoResponseSchema,
	ApplicationListResponseSchema,
	CandidateInfoResponseSchema,
	CandidateListResponseSchema,
	DepartmentInfoResponseSchema,
	InterviewScheduleInfoResponseSchema,
	JobInfoResponseSchema,
	JobListResponseSchema,
	JobPostingInfoResponseSchema,
	LocationInfoResponseSchema,
	OfferInfoResponseSchema,
	UserInfoResponseSchema,
} from './endpoints/types';
import { AshbySchema } from './schema';
import {
	ApplicationSubmitEventSchema,
	CandidateHireEventSchema,
	CandidateStageChangeEventSchema,
	InterviewScheduleCreateEventSchema,
	OfferCreateEventSchema,
} from './webhooks/types';

describe('Ashby Schema & Entity Definitions', () => {
	it('declares a valid semver version and entities map', () => {
		expect(AshbySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(AshbySchema.entities).length).toBeGreaterThanOrEqual(7);

		for (const entity of Object.values(AshbySchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates candidate info wire response payload', () => {
		const payload = {
			success: true,
			results: {
				id: 'cand_123',
				name: 'Jane Doe',
				primaryEmailAddress: {
					value: 'jane.doe@example.com',
					type: 'Personal',
					isPrimary: true,
				},
				emailAddresses: [
					{ value: 'jane.doe@example.com', type: 'Personal', isPrimary: true },
					{ value: 'jane.work@example.com', type: 'Work', isPrimary: false },
				],
				primaryPhoneNumber: {
					value: '+15551234567',
					type: 'Mobile',
					isPrimary: true,
				},
				socialLinks: [
					{ url: 'https://linkedin.com/in/janedoe', type: 'LinkedIn' },
				],
				tags: ['Engineering', 'Senior'],
				customFields: [
					{
						value: 'San Francisco',
						customFieldDefinitionId: 'cf_123',
						title: 'Preferred Location',
					},
				],
				applicationIds: ['app_123'],
				createdAt: '2026-08-01T12:00:00.000Z',
				updatedAt: '2026-08-02T15:30:00.000Z',
			},
		};

		const parsed = CandidateInfoResponseSchema.parse(payload);
		expect(parsed.success).toBe(true);
		expect(parsed.results.id).toBe('cand_123');
		expect(parsed.results.name).toBe('Jane Doe');
		expect(parsed.results.primaryEmailAddress?.value).toBe(
			'jane.doe@example.com',
		);
	});

	it('validates candidate list wire response payload with cursor', () => {
		const payload = {
			success: true,
			results: [
				{
					id: 'cand_1',
					name: 'Alice',
				},
				{
					id: 'cand_2',
					name: 'Bob',
				},
			],
			moreDataAvailable: true,
			nextCursor: 'cursor_xyz_next',
		};

		const parsed = CandidateListResponseSchema.parse(payload);
		expect(parsed.success).toBe(true);
		expect(parsed.results).toHaveLength(2);
		expect(parsed.moreDataAvailable).toBe(true);
		expect(parsed.nextCursor).toBe('cursor_xyz_next');
	});

	it('validates application info wire response payload', () => {
		const payload = {
			success: true,
			results: {
				id: 'app_123',
				candidateId: 'cand_123',
				jobId: 'job_456',
				status: 'Active',
				currentInterviewStageId: 'stage_789',
				hiringTeam: [
					{
						userId: 'user_1',
						role: 'Recruiter',
						email: 'recruiter@example.com',
					},
				],
				createdAt: '2026-08-01T10:00:00.000Z',
			},
		};

		const parsed = ApplicationInfoResponseSchema.parse(payload);
		expect(parsed.results.id).toBe('app_123');
		expect(parsed.results.candidateId).toBe('cand_123');
		expect(parsed.results.hiringTeam?.[0]?.role).toBe('Recruiter');
	});

	it('validates application list wire response payload', () => {
		const payload = {
			success: true,
			results: [
				{
					id: 'app_1',
					candidateId: 'cand_1',
					jobId: 'job_1',
					status: 'Active',
				},
			],
			moreDataAvailable: false,
		};

		const parsed = ApplicationListResponseSchema.parse(payload);
		expect(parsed.results).toHaveLength(1);
	});

	it('validates job info and job list response payloads', () => {
		const jobPayload = {
			success: true,
			results: {
				id: 'job_123',
				title: 'Senior Software Engineer',
				status: 'Open',
				departmentId: 'dept_1',
				locationId: 'loc_1',
				openings: [
					{
						id: 'op_1',
						identifier: 'OPEN-001',
						isArchived: false,
					},
				],
			},
		};

		const parsed = JobInfoResponseSchema.parse(jobPayload);
		expect(parsed.results.title).toBe('Senior Software Engineer');
		expect(parsed.results.openings?.[0]?.identifier).toBe('OPEN-001');

		const listPayload = {
			success: true,
			results: [jobPayload.results],
		};
		const parsedList = JobListResponseSchema.parse(listPayload);
		expect(parsedList.results).toHaveLength(1);
	});

	it('validates job posting info response payload', () => {
		const payload = {
			success: true,
			results: {
				id: 'jp_123',
				title: 'Frontend Engineer',
				jobId: 'job_123',
				isListed: true,
				teamNameHierarchy: ['Engineering', 'Web'],
			},
		};

		const parsed = JobPostingInfoResponseSchema.parse(payload);
		expect(parsed.results.isListed).toBe(true);
		expect(parsed.results.teamNameHierarchy).toEqual(['Engineering', 'Web']);
	});

	it('validates interview schedule response payload', () => {
		const payload = {
			success: true,
			results: {
				id: 'sched_123',
				applicationId: 'app_123',
				scheduledStartTime: '2026-08-25T14:00:00Z',
				scheduledEndTime: '2026-08-25T15:00:00Z',
				status: 'Scheduled',
				interviewers: [{ userId: 'user_10' }],
			},
		};

		const parsed = InterviewScheduleInfoResponseSchema.parse(payload);
		expect(parsed.results.id).toBe('sched_123');
		expect(parsed.results.interviewers?.[0]?.userId).toBe('user_10');
	});

	it('validates offer info response payload', () => {
		const payload = {
			success: true,
			results: {
				id: 'off_123',
				applicationId: 'app_123',
				status: 'Accepted',
				salary: 180000,
				currency: 'USD',
				startDate: '2026-09-15',
			},
		};

		const parsed = OfferInfoResponseSchema.parse(payload);
		expect(parsed.results.salary).toBe(180000);
		expect(parsed.results.currency).toBe('USD');
	});

	it('validates department and location response payloads', () => {
		const deptPayload = {
			success: true,
			results: {
				id: 'dept_1',
				name: 'Product Design',
				isArchived: false,
			},
		};
		expect(DepartmentInfoResponseSchema.parse(deptPayload).results.name).toBe(
			'Product Design',
		);

		const locPayload = {
			success: true,
			results: {
				id: 'loc_1',
				name: 'San Francisco, CA',
				isArchived: false,
			},
		};
		expect(LocationInfoResponseSchema.parse(locPayload).results.name).toBe(
			'San Francisco, CA',
		);
	});

	it('validates user info response payload', () => {
		const userPayload = {
			success: true,
			results: {
				id: 'usr_1',
				name: 'Alice Admin',
				email: 'alice@example.com',
				globalRole: 'Admin',
				isEnabled: true,
			},
		};
		expect(UserInfoResponseSchema.parse(userPayload).results.email).toBe(
			'alice@example.com',
		);
	});

	it('validates Ashby webhook event schemas', () => {
		const stageChangePayload = {
			webhookActionId: 'wh_act_1',
			action: 'candidateStageChange',
			data: {
				candidateId: 'cand_1',
				applicationId: 'app_1',
				currentInterviewStageId: 'stage_2',
			},
		};
		expect(
			CandidateStageChangeEventSchema.parse(stageChangePayload).action,
		).toBe('candidateStageChange');

		const appSubmitPayload = {
			webhookActionId: 'wh_act_2',
			action: 'applicationSubmit',
			data: {
				applicationId: 'app_2',
				candidateId: 'cand_2',
				jobId: 'job_2',
			},
		};
		expect(ApplicationSubmitEventSchema.parse(appSubmitPayload).action).toBe(
			'applicationSubmit',
		);

		const hirePayload = {
			webhookActionId: 'wh_act_3',
			action: 'candidateHire',
			data: {
				candidateId: 'cand_3',
				applicationId: 'app_3',
				offerId: 'off_3',
			},
		};
		expect(CandidateHireEventSchema.parse(hirePayload).action).toBe(
			'candidateHire',
		);

		const offerCreatePayload = {
			webhookActionId: 'wh_act_4',
			action: 'offerCreate',
			data: {
				offerId: 'off_4',
				applicationId: 'app_4',
			},
		};
		expect(OfferCreateEventSchema.parse(offerCreatePayload).action).toBe(
			'offerCreate',
		);

		const schedulePayload = {
			webhookActionId: 'wh_act_5',
			action: 'interviewScheduleCreate',
			data: {
				interviewScheduleId: 'sched_5',
				applicationId: 'app_5',
			},
		};
		expect(
			InterviewScheduleCreateEventSchema.parse(schedulePayload).action,
		).toBe('interviewScheduleCreate');
	});
});
