import { makeGoogleClassroomRequest } from './client';
import { GoogleClassroomOperationFunctions } from './endpoints/api';

jest.mock('./client', () => ({
	makeGoogleClassroomRequest: jest.fn().mockResolvedValue({}),
}));

const mockRequest = jest.mocked(makeGoogleClassroomRequest);
const context = { key: 'unit-test-token', endpoints: {} };
const consoleInfo = jest
	.spyOn(console, 'info')
	.mockImplementation(() => undefined);

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
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { alias: 'p:biology' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', alias: 'alias-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.aliases.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.addOnAttachments.create'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {
				fields: 'id',
				postId: 'sample-query',
				addOnToken: 'sample-query',
			},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {
					fields: 'id',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { text: 'Class update' },
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id' },
				body: { text: 'Class update' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.create' },
		);
	});

	it('courses.announcements.delete', async () => {
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.getAddOnContext'
		](context, {
			pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
			query: {
				fields: 'id',
				attachmentId: 'sample-query',
				postId: 'sample-query',
				addOnToken: 'sample-query',
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/announcements/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.announcements.getAddOnContext' },
		);
	});

	it('courses.announcements.list', async () => {
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.announcements.patch'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { text: 'Class update' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.addOnAttachments.create'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				postId: 'sample-query',
				addOnToken: 'sample-query',
			},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {
					fields: 'id',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
			body: { pointsEarned: 1 },
		});
		expect(result).toEqual({});
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
				body: { pointsEarned: 1 },
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Assignment', workType: 'ASSIGNMENT' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.delete'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.getAddOnContext'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				postId: 'sample-query',
				attachmentId: 'sample-query',
				addOnToken: 'sample-query',
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWork/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					postId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWork.getAddOnContext' },
		);
	});

	it('courses.courseWork.list', async () => {
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Assignment', workType: 'ASSIGNMENT' },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWork.rubrics.list'
		](context, {
			pathParams: {
				courseWorkId: 'courseWorkId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.addOnAttachments.create'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				addOnToken: 'sample-query',
				postId: 'sample-query',
			},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {
					fields: 'id',
					addOnToken: 'sample-query',
					postId: 'sample-query',
				},
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Reading material' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.getAddOnContext'
		](context, {
			pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				attachmentId: 'sample-query',
				postId: 'sample-query',
				addOnToken: 'sample-query',
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/courseWorkMaterials/itemId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.courseWorkMaterials.getAddOnContext' },
		);
	});

	it('courses.courseWorkMaterials.list', async () => {
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.courseWorkMaterials.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Reading material' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['courses.create'](
			context,
			{
				pathParams: {},
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['courses.delete'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['courses.get'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.getGradingPeriodSettings'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['courses.patch'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id', updateMask: 'name' },
				body: { name: 'Biology' },
			},
		);
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.addOnAttachments.create'
		](context, {
			pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				itemId: 'sample-query',
				addOnToken: 'sample-query',
			},
			body: {
				title: 'Learning activity',
				teacherViewUri: { uri: 'https://corsair.dev/classroom' },
				studentViewUri: { uri: 'https://corsair.dev/classroom' },
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnAttachments',
			'unit-test-token',
			{
				method: 'POST',
				query: {
					fields: 'id',
					itemId: 'sample-query',
					addOnToken: 'sample-query',
				},
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
			body: { pointsEarned: 1 },
		});
		expect(result).toEqual({});
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
				body: { pointsEarned: 1 },
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.posts.getAddOnContext'
		](context, {
			pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
			query: {
				fields: 'id',
				itemId: 'sample-query',
				attachmentId: 'sample-query',
				addOnToken: 'sample-query',
			},
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/posts/postId-123/addOnContext',
			'unit-test-token',
			{
				method: 'GET',
				query: {
					fields: 'id',
					itemId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
				body: undefined,
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.posts.getAddOnContext' },
		);
	});

	it('courses.studentGroups.create', async () => {
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { title: 'Study group' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.patch'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { title: 'Study group' },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.studentGroups.studentGroupMembers.list'
		](context, {
			pathParams: {
				studentGroupId: 'studentGroupId-123',
				courseId: 'courseId-123',
			},
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual({});
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

	it('courses.students.create', async () => {
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', enrollmentCode: 'sample-query' },
			body: { userId: 'student-123' },
		});
		expect(result).toEqual({});
		expect(mockRequest).toHaveBeenLastCalledWith(
			'/v1/courses/courseId-123/students',
			'unit-test-token',
			{
				method: 'POST',
				query: { fields: 'id', enrollmentCode: 'sample-query' },
				body: { userId: 'student-123' },
			},
		);
		expect(consoleInfo).toHaveBeenLastCalledWith(
			'Google Classroom operation completed',
			{ operationId: 'courses.students.create' },
		);
	});

	it('courses.students.delete', async () => {
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.delete'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.get'
		](context, {
			pathParams: { courseId: 'courseId-123', userId: 'userId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.students.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { userId: 'teacher-123' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.delete'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.get'
		](context, {
			pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.teachers.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.create'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id' },
			body: { name: 'Unit 1' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.delete'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.get'
		](context, {
			pathParams: { id: 'id-123', courseId: 'courseId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.list'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.topics.patch'
		](context, {
			pathParams: { courseId: 'courseId-123', id: 'id-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: { name: 'Unit 1' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['courses.update'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			},
		);
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'courses.updateGradingPeriodSettings'
		](context, {
			pathParams: { courseId: 'courseId-123' },
			query: { fields: 'id', updateMask: 'title' },
			body: {},
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'invitations.accept'
		](context, {
			pathParams: { id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'invitations.create'
		](context, {
			pathParams: {},
			query: { fields: 'id' },
			body: { userId: 'student-123', courseId: 'course-123', role: 'STUDENT' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'invitations.delete'
		](context, {
			pathParams: { id: 'id-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['invitations.get'](
			context,
			{
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'registrations.delete'
		](context, {
			pathParams: { registrationId: 'registrationId-123' },
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions['userProfiles.get'](
			context,
			{
				pathParams: { userId: 'userId-123' },
				query: { fields: 'id' },
			},
		);
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardianInvitations.get'
		](context, {
			pathParams: {
				invitationId: 'invitationId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardians.delete'
		](context, {
			pathParams: {
				guardianId: 'guardianId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		const result = await GoogleClassroomOperationFunctions[
			'userProfiles.guardians.get'
		](context, {
			pathParams: {
				guardianId: 'guardianId-123',
				studentId: 'studentId-123',
			},
			query: { fields: 'id' },
		});
		expect(result).toEqual({});
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
		expect(result).toEqual({});
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
