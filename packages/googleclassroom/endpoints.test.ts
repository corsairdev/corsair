import { makeGoogleClassroomRequest } from './client';
import { GoogleClassroomOperationFunctions } from './endpoints/api';
import { GoogleClassroomResponseSchemas } from './endpoints/models';
import type { GoogleClassroomResponseModelName } from './endpoints/registry';
import { GOOGLE_CLASSROOM_RESPONSE_MODELS } from './endpoints/registry';

jest.mock('./client', () => ({
	makeGoogleClassroomRequest: jest.fn().mockResolvedValue({}),
}));

const mockRequest = jest.mocked(makeGoogleClassroomRequest);
const context = { key: 'unit-test-token', endpoints: {} };
const consoleInfo = jest
	.spyOn(console, 'info')
	.mockImplementation(() => undefined);

const responseFixtures = {
	AddOnAttachment: {
		schema: GoogleClassroomResponseSchemas.AddOnAttachment,
		response: {
			id: 'attachment-123',
			title: 'Reading activity',
			teacherViewUri: { uri: 'https://corsair.dev/classroom' },
			studentViewUri: { uri: 'https://corsair.dev/classroom' },
		},
	},
	AddOnAttachmentStudentSubmission: {
		schema: GoogleClassroomResponseSchemas.AddOnAttachmentStudentSubmission,
		response: {
			id: 'attachment-submission-123',
			userId: 'student-123',
			pointsEarned: 9,
			postSubmissionState: 'TURNED_IN',
		},
	},
	AddOnContext: {
		schema: GoogleClassroomResponseSchemas.AddOnContext,
		response: {
			courseId: 'course-123',
			itemId: 'course-work-123',
			supportsStudentWork: true,
			teacherContext: {},
			studentContext: { submissionId: 'submission-123' },
		},
	},
	Announcement: {
		schema: GoogleClassroomResponseSchemas.Announcement,
		response: {
			id: 'announcement-123',
			courseId: 'course-123',
			text: 'Class update',
			state: 'PUBLISHED',
			materials: [
				{ link: { title: 'Reading', url: 'https://developers.google.com' } },
			],
		},
	},
	Course: {
		schema: GoogleClassroomResponseSchemas.Course,
		response: {
			id: 'course-123',
			name: 'Biology',
			courseState: 'ACTIVE',
			ownerId: 'teacher-123',
		},
	},
	CourseAlias: {
		schema: GoogleClassroomResponseSchemas.CourseAlias,
		response: { alias: 'p:biology' },
	},
	CourseWork: {
		schema: GoogleClassroomResponseSchemas.CourseWork,
		response: {
			id: 'course-work-123',
			courseId: 'course-123',
			title: 'Assignment',
			workType: 'ASSIGNMENT',
			state: 'PUBLISHED',
			materials: [
				{ link: { title: 'Reading', url: 'https://developers.google.com' } },
			],
		},
	},
	CourseWorkMaterial: {
		schema: GoogleClassroomResponseSchemas.CourseWorkMaterial,
		response: {
			id: 'material-123',
			courseId: 'course-123',
			title: 'Reading',
			state: 'PUBLISHED',
			materials: [
				{ link: { title: 'Reading', url: 'https://developers.google.com' } },
			],
		},
	},
	Empty: { schema: GoogleClassroomResponseSchemas.Empty, response: {} },
	GradingPeriodSettings: {
		schema: GoogleClassroomResponseSchemas.GradingPeriodSettings,
		response: {
			gradingPeriods: [
				{
					id: 'grading-period-123',
					title: 'Semester 1',
					startDate: { year: 2026, month: 8, day: 1 },
					endDate: { year: 2026, month: 12, day: 20 },
				},
			],
			applyToExistingCoursework: false,
		},
	},
	Guardian: {
		schema: GoogleClassroomResponseSchemas.Guardian,
		response: {
			studentId: 'student-123',
			guardianId: 'guardian-123',
			guardianProfile: {
				id: 'guardian-123',
				emailAddress: 'guardian@school.test',
				name: { givenName: 'Taylor', familyName: 'Guardian' },
			},
		},
	},
	GuardianInvitation: {
		schema: GoogleClassroomResponseSchemas.GuardianInvitation,
		response: {
			invitationId: 'guardian-invitation-123',
			studentId: 'student-123',
			invitedEmailAddress: 'guardian@school.test',
			state: 'PENDING',
		},
	},
	Invitation: {
		schema: GoogleClassroomResponseSchemas.Invitation,
		response: {
			id: 'invitation-123',
			courseId: 'course-123',
			userId: 'student-123',
			role: 'STUDENT',
		},
	},
	ListAddOnAttachmentsResponse: {
		schema: GoogleClassroomResponseSchemas.ListAddOnAttachmentsResponse,
		response: {
			addOnAttachments: [
				{
					id: 'attachment-123',
					title: 'Reading activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			],
			nextPageToken: 'next-attachments-page',
		},
	},
	ListAddOnAttachmentStudentSubmissionsResponse: {
		schema:
			GoogleClassroomResponseSchemas.ListAddOnAttachmentStudentSubmissionsResponse,
		response: {
			addOnAttachmentStudentSubmissions: [
				{
					id: 'attachment-submission-123',
					userId: 'student-123',
					pointsEarned: 9,
				},
			],
			nextPageToken: 'next-attachment-submissions-page',
		},
	},
	ListAnnouncementsResponse: {
		schema: GoogleClassroomResponseSchemas.ListAnnouncementsResponse,
		response: {
			announcements: [
				{
					id: 'announcement-123',
					courseId: 'course-123',
					text: 'Class update',
				},
			],
			nextPageToken: 'next-announcements-page',
		},
	},
	ListCourseAliasesResponse: {
		schema: GoogleClassroomResponseSchemas.ListCourseAliasesResponse,
		response: {
			aliases: [{ alias: 'p:biology' }],
			nextPageToken: 'next-aliases-page',
		},
	},
	ListCoursesResponse: {
		schema: GoogleClassroomResponseSchemas.ListCoursesResponse,
		response: {
			courses: [{ id: 'course-123', name: 'Biology', courseState: 'ACTIVE' }],
			nextPageToken: 'next-courses-page',
		},
	},
	ListCourseWorkMaterialResponse: {
		schema: GoogleClassroomResponseSchemas.ListCourseWorkMaterialResponse,
		response: {
			courseWorkMaterial: [
				{ id: 'material-123', title: 'Reading', courseId: 'course-123' },
			],
			nextPageToken: 'next-materials-page',
		},
	},
	ListCourseWorkResponse: {
		schema: GoogleClassroomResponseSchemas.ListCourseWorkResponse,
		response: {
			courseWork: [
				{ id: 'course-work-123', title: 'Assignment', workType: 'ASSIGNMENT' },
			],
			nextPageToken: 'next-course-work-page',
		},
	},
	ListGuardianInvitationsResponse: {
		schema: GoogleClassroomResponseSchemas.ListGuardianInvitationsResponse,
		response: {
			guardianInvitations: [
				{
					invitationId: 'guardian-invitation-123',
					studentId: 'student-123',
					state: 'PENDING',
				},
			],
			nextPageToken: 'next-guardian-invitations-page',
		},
	},
	ListGuardiansResponse: {
		schema: GoogleClassroomResponseSchemas.ListGuardiansResponse,
		response: {
			guardians: [{ studentId: 'student-123', guardianId: 'guardian-123' }],
			nextPageToken: 'next-guardians-page',
		},
	},
	ListInvitationsResponse: {
		schema: GoogleClassroomResponseSchemas.ListInvitationsResponse,
		response: {
			invitations: [
				{ id: 'invitation-123', courseId: 'course-123', role: 'STUDENT' },
			],
			nextPageToken: 'next-invitations-page',
		},
	},
	ListRubricsResponse: {
		schema: GoogleClassroomResponseSchemas.ListRubricsResponse,
		response: {
			rubrics: [
				{ id: 'rubric-123', courseWorkId: 'course-work-123', criteria: [] },
			],
			nextPageToken: 'next-rubrics-page',
		},
	},
	ListStudentGroupMembersResponse: {
		schema: GoogleClassroomResponseSchemas.ListStudentGroupMembersResponse,
		response: {
			studentGroupMembers: [
				{ userId: 'student-123', studentGroupId: 'group-123' },
			],
			nextPageToken: 'next-group-members-page',
		},
	},
	ListStudentGroupsResponse: {
		schema: GoogleClassroomResponseSchemas.ListStudentGroupsResponse,
		response: {
			studentGroups: [{ id: 'group-123', title: 'Study group' }],
			nextPageToken: 'next-groups-page',
		},
	},
	ListStudentsResponse: {
		schema: GoogleClassroomResponseSchemas.ListStudentsResponse,
		response: {
			students: [{ userId: 'student-123', profile: { id: 'student-123' } }],
			nextPageToken: 'next-students-page',
		},
	},
	ListStudentSubmissionsResponse: {
		schema: GoogleClassroomResponseSchemas.ListStudentSubmissionsResponse,
		response: {
			studentSubmissions: [
				{
					id: 'submission-123',
					userId: 'student-123',
					draftGrade: 9,
					state: 'TURNED_IN',
				},
			],
			nextPageToken: 'next-submissions-page',
		},
	},
	ListTeachersResponse: {
		schema: GoogleClassroomResponseSchemas.ListTeachersResponse,
		response: {
			teachers: [{ userId: 'teacher-123', profile: { id: 'teacher-123' } }],
			nextPageToken: 'next-teachers-page',
		},
	},
	ListTopicResponse: {
		schema: GoogleClassroomResponseSchemas.ListTopicResponse,
		response: {
			topic: [{ topicId: 'topic-123', name: 'Unit 1', courseId: 'course-123' }],
			nextPageToken: 'next-topics-page',
		},
	},
	Registration: {
		schema: GoogleClassroomResponseSchemas.Registration,
		response: {
			registrationId: 'registration-123',
			expiryTime: '2026-12-01T00:00:00Z',
			cloudPubsubTopic: { topicName: 'projects/classroom-demo/topics/updates' },
			feed: {
				feedType: 'COURSE_ROSTER_CHANGES',
				courseRosterChangesInfo: { courseId: 'course-123' },
			},
		},
	},
	Rubric: {
		schema: GoogleClassroomResponseSchemas.Rubric,
		response: {
			id: 'rubric-123',
			courseId: 'course-123',
			courseWorkId: 'course-work-123',
			criteria: [
				{
					id: 'criterion-123',
					title: 'Reasoning',
					levels: [{ id: 'level-123', title: 'Proficient', points: 3 }],
				},
			],
		},
	},
	Student: {
		schema: GoogleClassroomResponseSchemas.Student,
		response: {
			userId: 'student-123',
			courseId: 'course-123',
			profile: { id: 'student-123', name: { givenName: 'Sam' } },
		},
	},
	StudentGroup: {
		schema: GoogleClassroomResponseSchemas.StudentGroup,
		response: { id: 'group-123', courseId: 'course-123', title: 'Study group' },
	},
	StudentGroupMember: {
		schema: GoogleClassroomResponseSchemas.StudentGroupMember,
		response: {
			courseId: 'course-123',
			studentGroupId: 'group-123',
			userId: 'student-123',
		},
	},
	StudentSubmission: {
		schema: GoogleClassroomResponseSchemas.StudentSubmission,
		response: {
			id: 'submission-123',
			courseId: 'course-123',
			courseWorkId: 'course-work-123',
			userId: 'student-123',
			draftGrade: 9,
			state: 'TURNED_IN',
			assignmentSubmission: {
				attachments: [
					{ link: { title: 'Homework', url: 'https://developers.google.com' } },
				],
			},
		},
	},
	Teacher: {
		schema: GoogleClassroomResponseSchemas.Teacher,
		response: {
			userId: 'teacher-123',
			courseId: 'course-123',
			profile: { id: 'teacher-123', name: { givenName: 'Taylor' } },
		},
	},
	Topic: {
		schema: GoogleClassroomResponseSchemas.Topic,
		response: { topicId: 'topic-123', courseId: 'course-123', name: 'Unit 1' },
	},
	UserProfile: {
		schema: GoogleClassroomResponseSchemas.UserProfile,
		response: {
			id: 'user-123',
			emailAddress: 'student@school.test',
			name: { givenName: 'Sam', familyName: 'Student' },
		},
	},
} as const satisfies Record<GoogleClassroomResponseModelName, object>;

function responseFixtureFor(
	operationId: keyof typeof GOOGLE_CLASSROOM_RESPONSE_MODELS,
): object {
	return responseFixtures[GOOGLE_CLASSROOM_RESPONSE_MODELS[operationId]]
		.response;
}

describe('Google Classroom operations', () => {
	beforeEach(() => {
		mockRequest.mockClear();
		consoleInfo.mockClear();
	});

	it('rejects undocumented callback fields before making a network request', async () => {
		const input = {
			pathParams: {},
			query: { fields: 'id' },
			callback: 'https://corsair.dev/callback',
		};

		await expect(
			GoogleClassroomOperationFunctions['courses.list'](context, input),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('courses.aliases.create', async () => {
		const response = responseFixtureFor('courses.aliases.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { alias: 'p:biology' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/aliases',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: { alias: 'p:biology' } },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.aliases.create' },
		);
	});

	it('courses.aliases.delete', async () => {
		const response = responseFixtureFor('courses.aliases.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', alias: 'alias-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/aliases/alias-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.aliases.delete' },
		);
	});

	it('courses.aliases.list', async () => {
		const response = responseFixtureFor('courses.aliases.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/aliases',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.aliases.list' },
		);
	});

	it('courses.announcements.addOnAttachments.create', async () => {
		const response = responseFixtureFor(
			'courses.announcements.addOnAttachments.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.create'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {},
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.addOnAttachments.create' },
		);
	});

	it('courses.announcements.addOnAttachments.delete', async () => {
		const response = responseFixtureFor(
			'courses.announcements.addOnAttachments.delete',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.delete'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'DELETE',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.addOnAttachments.delete' },
		);
	});

	it('courses.announcements.addOnAttachments.get', async () => {
		const response = responseFixtureFor(
			'courses.announcements.addOnAttachments.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.get'
		](context, {
			pathParams: {
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
				itemId: 'itemId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.addOnAttachments.get' },
		);
	});

	it('courses.announcements.addOnAttachments.list', async () => {
		const response = responseFixtureFor(
			'courses.announcements.addOnAttachments.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.list'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {
				fields: 'id',
				pageToken: 'sample-query',
				pageSize: 1,
				postId: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					postId: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.addOnAttachments.list' },
		);
	});

	it('courses.announcements.addOnAttachments.patch', async () => {
		const response = responseFixtureFor(
			'courses.announcements.addOnAttachments.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.patch'
		](context, {
			pathParams: {
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
				itemId: 'itemId-123',
			},
			query: {
				fields: 'id',
				postId: 'postId-123',
				updateMask: 'title',
			},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', postId: 'postId-123', updateMask: 'title' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.addOnAttachments.patch' },
		);
	});

	it('courses.announcements.create', async () => {
		const response = responseFixtureFor('courses.announcements.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: {
				text: 'Class update',
				materials: [{ link: { url: 'https://corsair.dev/classroom' } }],
				state: 'DRAFT',
				scheduledTime: '2026-11-14T09:00:00Z',
				assigneeMode: 'INDIVIDUAL_STUDENTS',
				individualStudentsOptions: { studentIds: ['student-123'] },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					text: 'Class update',
					materials: [{ link: { url: 'https://corsair.dev/classroom' } }],
					state: 'DRAFT',
					scheduledTime: '2026-11-14T09:00:00Z',
					assigneeMode: 'INDIVIDUAL_STUDENTS',
					individualStudentsOptions: { studentIds: ['student-123'] },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.create' },
		);
	});

	it('courses.announcements.delete', async () => {
		const response = responseFixtureFor('courses.announcements.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.delete' },
		);
	});

	it('courses.announcements.get', async () => {
		const response = responseFixtureFor('courses.announcements.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.get' },
		);
	});

	it('courses.announcements.getAddOnContext', async () => {
		const response = responseFixtureFor(
			'courses.announcements.getAddOnContext',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.getAddOnContext'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.getAddOnContext' },
		);
	});

	it('courses.announcements.list', async () => {
		const response = responseFixtureFor('courses.announcements.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: {
				fields: 'id',
				pageSize: 1,
				pageToken: 'sample-query',
				announcementStates: ['ANNOUNCEMENT_STATE_UNSPECIFIED'],
				orderBy: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					announcementStates: ['ANNOUNCEMENT_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.list' },
		);
	});

	it('courses.announcements.modifyAssignees', async () => {
		const response = responseFixtureFor(
			'courses.announcements.modifyAssignees',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.modifyAssignees'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: {
				assigneeMode: 'ALL_STUDENTS',
				modifyIndividualStudentsOptions: {},
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/id-123:modifyAssignees',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.modifyAssignees' },
		);
	});

	it('courses.announcements.patch', async () => {
		const response = responseFixtureFor('courses.announcements.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.patch'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { text: 'Class update' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: { text: 'Class update' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.patch' },
		);
	});

	it('courses.courseWork.addOnAttachments.create', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.create'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {},
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.addOnAttachments.create' },
		);
	});

	it('courses.courseWork.addOnAttachments.delete', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.delete',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.delete'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'DELETE',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.addOnAttachments.delete' },
		);
	});

	it('courses.courseWork.addOnAttachments.get', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.get'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.addOnAttachments.get' },
		);
	});

	it('courses.courseWork.addOnAttachments.list', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.list'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {
				fields: 'id',
				postId: 'sample-query',
				pageToken: 'sample-query',
				pageSize: 1,
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					postId: 'sample-query',
					pageToken: 'sample-query',
					pageSize: 1,
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.addOnAttachments.list' },
		);
	});

	it('courses.courseWork.addOnAttachments.patch', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.patch'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
			},
			query: { fields: 'id', postId: 'sample-query', updateMask: 'title' },
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', postId: 'sample-query', updateMask: 'title' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.addOnAttachments.patch' },
		);
	});

	it('courses.courseWork.addOnAttachments.studentSubmissions.get', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.studentSubmissions.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.studentSubmissions.get'
		](context, {
			pathParams: {
				submissionId: 'submissionId-123',
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123/studentSubmissions/submissionId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{
				operationId:
					'courses.courseWork.addOnAttachments.studentSubmissions.get',
			},
		);
	});

	it('courses.courseWork.addOnAttachments.studentSubmissions.list', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.studentSubmissions.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.studentSubmissions.list'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123/studentSubmissions',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{
				operationId:
					'courses.courseWork.addOnAttachments.studentSubmissions.list',
			},
		);
	});

	it('courses.courseWork.addOnAttachments.studentSubmissions.patch', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.addOnAttachments.studentSubmissions.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.studentSubmissions.patch'
		](context, {
			pathParams: {
				submissionId: 'submissionId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
				itemId: 'itemId-123',
			},
			query: { fields: 'id', postId: 'postId-123', updateMask: 'pointsEarned' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments/attachmentId-123/studentSubmissions/submissionId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: {
					fields: 'id',
					postId: 'postId-123',
					updateMask: 'pointsEarned',
				},
				body: {},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{
				operationId:
					'courses.courseWork.addOnAttachments.studentSubmissions.patch',
			},
		);
	});

	it('courses.courseWork.create', async () => {
		const response = responseFixtureFor('courses.courseWork.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Assignment', workType: 'ASSIGNMENT' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { title: 'Assignment', workType: 'ASSIGNMENT' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.create' },
		);
	});

	it('courses.courseWork.delete', async () => {
		const response = responseFixtureFor('courses.courseWork.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.delete'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.delete' },
		);
	});

	it('courses.courseWork.get', async () => {
		const response = responseFixtureFor('courses.courseWork.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.get' },
		);
	});

	it('courses.courseWork.getAddOnContext', async () => {
		const response = responseFixtureFor('courses.courseWork.getAddOnContext');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.getAddOnContext'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.getAddOnContext' },
		);
	});

	it('courses.courseWork.list', async () => {
		const response = responseFixtureFor('courses.courseWork.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: {
				fields: 'id',
				pageToken: 'sample-query',
				pageSize: 1,
				courseWorkStates: ['COURSE_WORK_STATE_UNSPECIFIED'],
				orderBy: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					courseWorkStates: ['COURSE_WORK_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.list' },
		);
	});

	it('courses.courseWork.modifyAssignees', async () => {
		const response = responseFixtureFor('courses.courseWork.modifyAssignees');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.modifyAssignees'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
			body: {
				assigneeMode: 'ALL_STUDENTS',
				modifyIndividualStudentsOptions: {},
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/id-123:modifyAssignees',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.modifyAssignees' },
		);
	});

	it('courses.courseWork.patch', async () => {
		const response = responseFixtureFor('courses.courseWork.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Assignment', workType: 'ASSIGNMENT' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Assignment', workType: 'ASSIGNMENT' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.patch' },
		);
	});

	it('courses.courseWork.rubrics.create', async () => {
		const response = responseFixtureFor('courses.courseWork.rubrics.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.create'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id' },
			body: {
				criteria: [
					{ description: 'Criterion', levels: [{ title: 'Proficient' }] },
				],
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/rubrics',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					criteria: [
						{ description: 'Criterion', levels: [{ title: 'Proficient' }] },
					],
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.rubrics.create' },
		);
	});

	it('courses.courseWork.rubrics.delete', async () => {
		const response = responseFixtureFor('courses.courseWork.rubrics.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.delete'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				id: 'id-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/rubrics/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.rubrics.delete' },
		);
	});

	it('courses.courseWork.rubrics.get', async () => {
		const response = responseFixtureFor('courses.courseWork.rubrics.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.get'
		](context, {
			pathParams: {
				id: 'id-123',
				courseId: 'courseId-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/rubrics/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.rubrics.get' },
		);
	});

	it('courses.courseWork.rubrics.list', async () => {
		const response = responseFixtureFor('courses.courseWork.rubrics.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.list'
		](context, {
			pathParams: {
				courseWorkId: 'courseWorkId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/rubrics',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.rubrics.list' },
		);
	});

	it('courses.courseWork.rubrics.patch', async () => {
		const response = responseFixtureFor('courses.courseWork.rubrics.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.patch'
		](context, {
			pathParams: {
				courseWorkId: 'courseWorkId-123',
				id: 'id-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', updateMask: 'title' },
			body: {
				criteria: [
					{ description: 'Criterion', levels: [{ title: 'Proficient' }] },
				],
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/rubrics/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: {
					criteria: [
						{ description: 'Criterion', levels: [{ title: 'Proficient' }] },
					],
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.rubrics.patch' },
		);
	});

	it('courses.courseWork.studentSubmissions.get', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.get'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				courseWorkId: 'courseWorkId-123',
				id: 'id-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.get' },
		);
	});

	it('courses.courseWork.studentSubmissions.list', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.list'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: {
				fields: 'id',
				pageToken: 'sample-query',
				userId: 'sample-query',
				pageSize: 1,
				late: 'LATE_VALUES_UNSPECIFIED',
				states: ['SUBMISSION_STATE_UNSPECIFIED'],
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					userId: 'sample-query',
					pageSize: 1,
					late: 'LATE_VALUES_UNSPECIFIED',
					states: ['SUBMISSION_STATE_UNSPECIFIED'],
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.list' },
		);
	});

	it('courses.courseWork.studentSubmissions.modifyAttachments', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.modifyAttachments',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.modifyAttachments'
		](context, {
			pathParams: {
				id: 'id-123',
				courseWorkId: 'courseWorkId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id' },
			body: { addAttachments: [] },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123:modifyAttachments',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: { addAttachments: [] } },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{
				operationId: 'courses.courseWork.studentSubmissions.modifyAttachments',
			},
		);
	});

	it('courses.courseWork.studentSubmissions.patch', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.patch'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				id: 'id-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id', updateMask: 'draftGrade' },
			body: { draftGrade: 1 },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'draftGrade' },
				body: { draftGrade: 1 },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.patch' },
		);
	});

	it('courses.courseWork.studentSubmissions.reclaim', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.reclaim',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.reclaim'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				id: 'id-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123:reclaim',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: {} },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.reclaim' },
		);
	});

	it('courses.courseWork.studentSubmissions.return', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.return',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.return'
		](context, {
			pathParams: {
				id: 'id-123',
				courseId: 'courseId-123',
				courseWorkId: 'courseWorkId-123',
			},
			query: { fields: 'id' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123:return',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: {} },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.return' },
		);
	});

	it('courses.courseWork.studentSubmissions.turnIn', async () => {
		const response = responseFixtureFor(
			'courses.courseWork.studentSubmissions.turnIn',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.studentSubmissions.turnIn'
		](context, {
			pathParams: {
				courseWorkId: 'courseWorkId-123',
				courseId: 'courseId-123',
				id: 'id-123',
			},
			query: { fields: 'id' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/courseWorkId-123/studentSubmissions/id-123:turnIn',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: {} },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.studentSubmissions.turnIn' },
		);
	});

	it('courses.courseWorkMaterials.addOnAttachments.create', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.addOnAttachments.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.create'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {},
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.addOnAttachments.create' },
		);
	});

	it('courses.courseWorkMaterials.addOnAttachments.delete', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.addOnAttachments.delete',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.delete'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'DELETE',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.addOnAttachments.delete' },
		);
	});

	it('courses.courseWorkMaterials.addOnAttachments.get', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.addOnAttachments.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.get'
		](context, {
			pathParams: {
				itemId: 'itemId-123',
				attachmentId: 'attachmentId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', postId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', postId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.addOnAttachments.get' },
		);
	});

	it('courses.courseWorkMaterials.addOnAttachments.list', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.addOnAttachments.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.list'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				pageSize: 1,
				pageToken: 'sample-query',
				postId: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					postId: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.addOnAttachments.list' },
		);
	});

	it('courses.courseWorkMaterials.addOnAttachments.patch', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.addOnAttachments.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.patch'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				attachmentId: 'attachmentId-123',
				itemId: 'itemId-123',
			},
			query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.addOnAttachments.patch' },
		);
	});

	it('courses.courseWorkMaterials.create', async () => {
		const response = responseFixtureFor('courses.courseWorkMaterials.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Reading material' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { title: 'Reading material' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.create' },
		);
	});

	it('courses.courseWorkMaterials.delete', async () => {
		const response = responseFixtureFor('courses.courseWorkMaterials.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.delete' },
		);
	});

	it('courses.courseWorkMaterials.get', async () => {
		const response = responseFixtureFor('courses.courseWorkMaterials.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.get' },
		);
	});

	it('courses.courseWorkMaterials.getAddOnContext', async () => {
		const response = responseFixtureFor(
			'courses.courseWorkMaterials.getAddOnContext',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.getAddOnContext'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.getAddOnContext' },
		);
	});

	it('courses.courseWorkMaterials.list', async () => {
		const response = responseFixtureFor('courses.courseWorkMaterials.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: {
				fields: 'id',
				materialDriveId: 'sample-query',
				pageSize: 1,
				orderBy: 'sample-query',
				materialLink: 'sample-query',
				courseWorkMaterialStates: ['COURSEWORK_MATERIAL_STATE_UNSPECIFIED'],
				pageToken: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					materialDriveId: 'sample-query',
					pageSize: 1,
					orderBy: 'sample-query',
					materialLink: 'sample-query',
					courseWorkMaterialStates: ['COURSEWORK_MATERIAL_STATE_UNSPECIFIED'],
					pageToken: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.list' },
		);
	});

	it('courses.courseWorkMaterials.patch', async () => {
		const response = responseFixtureFor('courses.courseWorkMaterials.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Reading material' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Reading material' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.patch' },
		);
	});

	it('courses.create', async () => {
		const response = responseFixtureFor('courses.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.create'](
			context,
			{
				pathParams: {},
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.create' },
		);
	});

	it('courses.delete', async () => {
		const response = responseFixtureFor('courses.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.delete'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.delete' },
		);
	});

	it('courses.get', async () => {
		const response = responseFixtureFor('courses.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.get'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.get' },
		);
	});

	it('courses.getGradingPeriodSettings', async () => {
		const response = responseFixtureFor('courses.getGradingPeriodSettings');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.getGradingPeriodSettings'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/gradingPeriodSettings',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.getGradingPeriodSettings' },
		);
	});

	it('courses.list', async () => {
		const response = responseFixtureFor('courses.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.list'](
			context,
			{
				pathParams: {},
				query: {
					fields: 'id',
					courseStates: ['COURSE_STATE_UNSPECIFIED'],
					pageSize: 1,
					teacherId: 'sample-query',
					pageToken: 'sample-query',
					studentId: 'sample-query',
				},
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					courseStates: ['COURSE_STATE_UNSPECIFIED'],
					pageSize: 1,
					teacherId: 'sample-query',
					pageToken: 'sample-query',
					studentId: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.list' },
		);
	});

	it('courses.patch', async () => {
		const response = responseFixtureFor('courses.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.patch'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id', updateMask: 'name' },
				body: { name: 'Biology' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'name' },
				body: { name: 'Biology' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.patch' },
		);
	});

	it('courses.posts.addOnAttachments.create', async () => {
		const response = responseFixtureFor(
			'courses.posts.addOnAttachments.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.create'
		](context, {
			pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
			query: { itemId: 'itemId-123' },
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: { itemId: 'itemId-123' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.create' },
		);
	});

	it('courses.posts.addOnAttachments.delete', async () => {
		const response = responseFixtureFor(
			'courses.posts.addOnAttachments.delete',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.delete'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				postId: 'postId-123',
				attachmentId: 'attachmentId-123',
			},
			query: { fields: 'id', itemId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'DELETE',
				query: { fields: 'id', itemId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.delete' },
		);
	});

	it('courses.posts.addOnAttachments.get', async () => {
		const response = responseFixtureFor('courses.posts.addOnAttachments.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.get'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				postId: 'postId-123',
				attachmentId: 'attachmentId-123',
			},
			query: { fields: 'id', itemId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', itemId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.get' },
		);
	});

	it('courses.posts.addOnAttachments.list', async () => {
		const response = responseFixtureFor('courses.posts.addOnAttachments.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.list'
		](context, {
			pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				pageSize: 1,
				pageToken: 'sample-query',
				itemId: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					itemId: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.list' },
		);
	});

	it('courses.posts.addOnAttachments.patch', async () => {
		const response = responseFixtureFor('courses.posts.addOnAttachments.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.patch'
		](context, {
			pathParams: {
				postId: 'postId-123',
				courseId: 'courseId-123',
				attachmentId: 'attachmentId-123',
			},
			query: { fields: 'id', updateMask: 'title', itemId: 'sample-query' },
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments/attachmentId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title', itemId: 'sample-query' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.patch' },
		);
	});

	it('courses.posts.addOnAttachments.studentSubmissions.get', async () => {
		const response = responseFixtureFor(
			'courses.posts.addOnAttachments.studentSubmissions.get',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.studentSubmissions.get'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				submissionId: 'submissionId-123',
				postId: 'postId-123',
				attachmentId: 'attachmentId-123',
			},
			query: { fields: 'id', itemId: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments/attachmentId-123/studentSubmissions/submissionId-123',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', itemId: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.addOnAttachments.studentSubmissions.get' },
		);
	});

	it('courses.posts.addOnAttachments.studentSubmissions.patch', async () => {
		const response = responseFixtureFor(
			'courses.posts.addOnAttachments.studentSubmissions.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.studentSubmissions.patch'
		](context, {
			pathParams: {
				submissionId: 'submissionId-123',
				courseId: 'courseId-123',
				attachmentId: 'attachmentId-123',
				postId: 'postId-123',
			},
			query: { fields: 'id', itemId: 'itemId-123', updateMask: 'pointsEarned' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments/attachmentId-123/studentSubmissions/submissionId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: {
					fields: 'id',
					itemId: 'itemId-123',
					updateMask: 'pointsEarned',
				},
				body: {},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{
				operationId: 'courses.posts.addOnAttachments.studentSubmissions.patch',
			},
		);
	});

	it('courses.posts.getAddOnContext', async () => {
		const response = responseFixtureFor('courses.posts.getAddOnContext');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.getAddOnContext'
		](context, {
			pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
			query: { itemId: 'itemId-123' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: { itemId: 'itemId-123' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.getAddOnContext' },
		);
	});

	it('courses.studentGroups.create', async () => {
		const response = responseFixtureFor('courses.studentGroups.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Study group' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { title: 'Study group' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.create' },
		);
	});

	it('courses.studentGroups.delete', async () => {
		const response = responseFixtureFor('courses.studentGroups.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.delete' },
		);
	});

	it('courses.studentGroups.list', async () => {
		const response = responseFixtureFor('courses.studentGroups.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.list' },
		);
	});

	it('courses.studentGroups.patch', async () => {
		const response = responseFixtureFor('courses.studentGroups.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Study group' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Study group' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.patch' },
		);
	});

	it('courses.studentGroups.studentGroupMembers.create', async () => {
		const response = responseFixtureFor(
			'courses.studentGroups.studentGroupMembers.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.studentGroupMembers.create'
		](context, {
			pathParams: {
				courseId: 'courseId-123',
				studentGroupId: 'studentGroupId-123',
			},
			query: { fields: 'id' },
			body: { userId: 'student-123' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups/studentGroupId-123/studentGroupMembers',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { userId: 'student-123' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.studentGroupMembers.create' },
		);
	});

	it('courses.studentGroups.studentGroupMembers.delete', async () => {
		const response = responseFixtureFor(
			'courses.studentGroups.studentGroupMembers.delete',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.studentGroupMembers.delete'
		](context, {
			pathParams: {
				studentGroupId: 'studentGroupId-123',
				courseId: 'courseId-123',
				userId: 'userId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups/studentGroupId-123/studentGroupMembers/userId-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.studentGroupMembers.delete' },
		);
	});

	it('courses.studentGroups.studentGroupMembers.list', async () => {
		const response = responseFixtureFor(
			'courses.studentGroups.studentGroupMembers.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.studentGroupMembers.list'
		](context, {
			pathParams: {
				studentGroupId: 'studentGroupId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/studentGroups/studentGroupId-123/studentGroupMembers',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.studentGroups.studentGroupMembers.list' },
		);
	});

	it('courses.students.create allows administrators to omit enrollmentCode', async () => {
		const response = responseFixtureFor('courses.students.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { userId: 'student-123' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/students',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { userId: 'student-123' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.students.create' },
		);
	});

	it('courses.students.delete', async () => {
		const response = responseFixtureFor('courses.students.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.delete'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/students/userId-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.students.delete' },
		);
	});

	it('courses.students.get', async () => {
		const response = responseFixtureFor('courses.students.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.get'
		](context, {
			pathParams: { courseId: 'courseId-123', userId: 'userId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/students/userId-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.students.get' },
		);
	});

	it('courses.students.list', async () => {
		const response = responseFixtureFor('courses.students.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/students',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.students.list' },
		);
	});

	it('courses.teachers.create', async () => {
		const response = responseFixtureFor('courses.teachers.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { userId: 'teacher-123' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/teachers',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { userId: 'teacher-123' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.teachers.create' },
		);
	});

	it('courses.teachers.delete', async () => {
		const response = responseFixtureFor('courses.teachers.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.delete'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/teachers/userId-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.teachers.delete' },
		);
	});

	it('courses.teachers.get', async () => {
		const response = responseFixtureFor('courses.teachers.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.get'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/teachers/userId-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.teachers.get' },
		);
	});

	it('courses.teachers.list', async () => {
		const response = responseFixtureFor('courses.teachers.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/teachers',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.teachers.list' },
		);
	});

	it('courses.topics.create', async () => {
		const response = responseFixtureFor('courses.topics.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { name: 'Unit 1' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/topics',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: { name: 'Unit 1' } },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.topics.create' },
		);
	});

	it('courses.topics.delete', async () => {
		const response = responseFixtureFor('courses.topics.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/topics/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.topics.delete' },
		);
	});

	it('courses.topics.get', async () => {
		const response = responseFixtureFor('courses.topics.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/topics/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.topics.get' },
		);
	});

	it('courses.topics.list', async () => {
		const response = responseFixtureFor('courses.topics.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/topics',
			'unit-test-token',
			{
				method: 'GET',
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.topics.list' },
		);
	});

	it('courses.topics.patch', async () => {
		const response = responseFixtureFor('courses.topics.patch');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.patch'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { name: 'Unit 1' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/topics/id-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: { name: 'Unit 1' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.topics.patch' },
		);
	});

	it('courses.update', async () => {
		const response = responseFixtureFor('courses.update');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['courses.update'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/id-123',
			'unit-test-token',
			{
				method: 'PUT',
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.update' },
		);
	});

	it('courses.updateGradingPeriodSettings', async () => {
		const response = responseFixtureFor('courses.updateGradingPeriodSettings');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'courses.updateGradingPeriodSettings'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: {},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/gradingPeriodSettings',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'title' },
				body: {},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.updateGradingPeriodSettings' },
		);
	});

	it('invitations.accept', async () => {
		const response = responseFixtureFor('invitations.accept');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'invitations.accept'
		](context, {
			pathParams: { id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/invitations/id-123:accept',
			'unit-test-token',
			{ method: 'POST', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'invitations.accept' },
		);
	});

	it('invitations.create', async () => {
		const response = responseFixtureFor('invitations.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'invitations.create'
		](context, {
			pathParams: {},
			query: { fields: 'id' },
			body: { userId: 'student-123', courseId: 'course-123', role: 'STUDENT' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/invitations',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					userId: 'student-123',
					courseId: 'course-123',
					role: 'STUDENT',
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'invitations.create' },
		);
	});

	it('invitations.delete', async () => {
		const response = responseFixtureFor('invitations.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'invitations.delete'
		](context, {
			pathParams: { id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/invitations/id-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'invitations.delete' },
		);
	});

	it('invitations.get', async () => {
		const response = responseFixtureFor('invitations.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['invitations.get'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/invitations/id-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'invitations.get' },
		);
	});

	it('invitations.list', async () => {
		const response = responseFixtureFor('invitations.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['invitations.list'](
			context,
			{
				pathParams: {},
				query: {
					fields: 'id',
					userId: 'sample-query',
					pageToken: 'sample-query',
					courseId: 'sample-query',
					pageSize: 1,
				},
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/invitations',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					userId: 'sample-query',
					pageToken: 'sample-query',
					courseId: 'sample-query',
					pageSize: 1,
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'invitations.list' },
		);
	});

	it('registrations.create', async () => {
		const response = responseFixtureFor('registrations.create');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'registrations.create'
		](context, {
			pathParams: {},
			query: { fields: 'id' },
			body: {
				cloudPubsubTopic: {
					topicName: 'projects/classroom-demo/topics/updates',
				},
				feed: {
					feedType: 'COURSE_ROSTER_CHANGES',
					courseRosterChangesInfo: { courseId: 'course-123' },
				},
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/registrations',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					cloudPubsubTopic: {
						topicName: 'projects/classroom-demo/topics/updates',
					},
					feed: {
						feedType: 'COURSE_ROSTER_CHANGES',
						courseRosterChangesInfo: { courseId: 'course-123' },
					},
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'registrations.create' },
		);
	});

	it('registrations.delete', async () => {
		const response = responseFixtureFor('registrations.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'registrations.delete'
		](context, {
			pathParams: { registrationId: 'registrationId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/registrations/registrationId-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'registrations.delete' },
		);
	});

	it('userProfiles.get', async () => {
		const response = responseFixtureFor('userProfiles.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions['userProfiles.get'](
			context,
			{
				pathParams: { userId: 'userId-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/userId-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.get' },
		);
	});

	it('userProfiles.guardianInvitations.create', async () => {
		const response = responseFixtureFor(
			'userProfiles.guardianInvitations.create',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardianInvitations.create'
		](context, {
			pathParams: { studentId: 'studentId-123' },
			query: { fields: 'id' },
			body: {
				studentId: 'student-123',
				invitedEmailAddress: 'guardian@school.test',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardianInvitations',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: {
					studentId: 'student-123',
					invitedEmailAddress: 'guardian@school.test',
				},
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardianInvitations.create' },
		);
	});

	it('userProfiles.guardianInvitations.get', async () => {
		const response = responseFixtureFor('userProfiles.guardianInvitations.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardianInvitations.get'
		](context, {
			pathParams: {
				invitationId: 'invitationId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardianInvitations/invitationId-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardianInvitations.get' },
		);
	});

	it('userProfiles.guardianInvitations.list', async () => {
		const response = responseFixtureFor(
			'userProfiles.guardianInvitations.list',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardianInvitations.list'
		](context, {
			pathParams: { studentId: 'studentId-123' },
			query: {
				fields: 'id',
				pageToken: 'sample-query',
				invitedEmailAddress: 'sample-query',
				pageSize: 1,
				states: ['GUARDIAN_INVITATION_STATE_UNSPECIFIED'],
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardianInvitations',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
					pageSize: 1,
					states: ['GUARDIAN_INVITATION_STATE_UNSPECIFIED'],
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardianInvitations.list' },
		);
	});

	it('userProfiles.guardianInvitations.patch', async () => {
		const response = responseFixtureFor(
			'userProfiles.guardianInvitations.patch',
		);
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardianInvitations.patch'
		](context, {
			pathParams: {
				invitationId: 'invitationId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id', updateMask: 'state' },
			body: { state: 'PENDING' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardianInvitations/invitationId-123',
			'unit-test-token',
			{
				method: 'PATCH',
				query: { fields: 'id', updateMask: 'state' },
				body: { state: 'PENDING' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardianInvitations.patch' },
		);
	});

	it('userProfiles.guardians.delete', async () => {
		const response = responseFixtureFor('userProfiles.guardians.delete');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardians.delete'
		](context, {
			pathParams: {
				guardianId: 'guardianId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardians/guardianId-123',
			'unit-test-token',
			{ method: 'DELETE', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardians.delete' },
		);
	});

	it('userProfiles.guardians.get', async () => {
		const response = responseFixtureFor('userProfiles.guardians.get');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardians.get'
		](context, {
			pathParams: {
				guardianId: 'guardianId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardians/guardianId-123',
			'unit-test-token',
			{ method: 'GET', query: { fields: 'id' }, body: undefined },
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardians.get' },
		);
	});

	it('userProfiles.guardians.list', async () => {
		const response = responseFixtureFor('userProfiles.guardians.list');
		mockRequest.mockResolvedValue(response);
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardians.list'
		](context, {
			pathParams: { studentId: 'studentId-123' },
			query: {
				fields: 'id',
				pageSize: 1,
				pageToken: 'sample-query',
				invitedEmailAddress: 'sample-query',
			},
		});
		expect(result).toEqual(response);
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/userProfiles/studentId-123/guardians',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'userProfiles.guardians.list' },
		);
	});
});
