import { GoogleClassroomResponseSchemas } from './endpoints/models';
import {
	GOOGLE_CLASSROOM_OAUTH_SCOPES,
	GOOGLE_CLASSROOM_SUPPORTED_SCOPES,
	GoogleClassroomEndpointMetadata,
	GoogleClassroomEndpointSchemas,
} from './endpoints/registry';
import {
	GOOGLE_CLASSROOM_ROUTES,
	GoogleClassroomEndpointInputSchemas,
	GoogleClassroomEndpointOutputSchemas,
} from './endpoints/types';

describe('Google Classroom endpoint schemas', () => {
	it('keeps operations, endpoint schemas, and risk metadata in sync', () => {
		const routeIds = Object.keys(GOOGLE_CLASSROOM_ROUTES).sort();
		expect(Object.keys(GoogleClassroomEndpointInputSchemas).sort()).toEqual(
			routeIds,
		);
		expect(Object.keys(GoogleClassroomEndpointOutputSchemas).sort()).toEqual(
			routeIds,
		);
		expect(Object.keys(GoogleClassroomEndpointSchemas).sort()).toEqual(
			routeIds,
		);
		expect(Object.keys(GoogleClassroomEndpointMetadata).sort()).toEqual(
			routeIds,
		);
	});

	it('uses a minimal default OAuth scope set that covers all stable operations', () => {
		const defaultScopes = new Set<string>(GOOGLE_CLASSROOM_OAUTH_SCOPES);
		for (const route of Object.values(GOOGLE_CLASSROOM_ROUTES)) {
			expect(route.scopes.some((scope) => defaultScopes.has(scope))).toBe(true);
		}
		expect(GOOGLE_CLASSROOM_OAUTH_SCOPES.length).toBeLessThan(
			GOOGLE_CLASSROOM_SUPPORTED_SCOPES.length,
		);
	});

	it('validates every documented input and response envelope while rejecting undocumented callback fields', () => {
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { alias: 'p:biology' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { alias: 'p:biology' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.aliases.create'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.delete'].safeParse({
				pathParams: { courseId: 'courseId-123', alias: 'alias-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.delete'].safeParse({
				pathParams: { courseId: 'courseId-123', alias: 'alias-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.aliases.delete'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.aliases.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.aliases.list'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.create'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.create'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.get'
			].safeParse({
				pathParams: {
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.get'
			].safeParse({
				pathParams: {
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					postId: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					postId: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.patch'
			].safeParse({
				pathParams: {
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.addOnAttachments.patch'
			].safeParse({
				pathParams: {
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
				body: {
					title: 'Learning activity',
					teacherViewUri: { uri: 'https://corsair.dev/classroom' },
					studentViewUri: { uri: 'https://corsair.dev/classroom' },
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.addOnAttachments.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { text: 'Class update' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { text: 'Class update' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.get'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.get'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.getAddOnContext'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.getAddOnContext'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.getAddOnContext'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					announcementStates: ['ANNOUNCEMENT_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					announcementStates: ['ANNOUNCEMENT_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.modifyAssignees'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.modifyAssignees'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.modifyAssignees'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.patch'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { text: 'Class update' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.announcements.patch'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { text: 'Class update' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.announcements.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.create'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.create'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.get'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.get'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					postId: 'sample-query',
					pageToken: 'sample-query',
					pageSize: 1,
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123', itemId: 'itemId-123' },
				query: {
					fields: 'id',
					postId: 'sample-query',
					pageToken: 'sample-query',
					pageSize: 1,
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.patch'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.patch'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
				body: { pointsEarned: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
					itemId: 'itemId-123',
				},
				query: { fields: 'id', updateMask: 'title', postId: 'sample-query' },
				body: { pointsEarned: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.addOnAttachments.studentSubmissions.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Assignment', workType: 'ASSIGNMENT' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Assignment', workType: 'ASSIGNMENT' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.delete'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.delete'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.get'].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.get'].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.get'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.getAddOnContext'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					postId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.getAddOnContext'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					postId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.getAddOnContext'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					courseWorkStates: ['COURSE_WORK_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					pageSize: 1,
					courseWorkStates: ['COURSE_WORK_STATE_UNSPECIFIED'],
					orderBy: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.courseWork.list'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.modifyAssignees'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.modifyAssignees'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				body: {
					assigneeMode: 'ALL_STUDENTS',
					modifyIndividualStudentsOptions: {},
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.modifyAssignees'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.patch'].safeParse(
				{
					pathParams: { id: 'id-123', courseId: 'courseId-123' },
					query: { fields: 'id', updateMask: 'title' },
					body: { title: 'Assignment', workType: 'ASSIGNMENT' },
				},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.courseWork.patch'].safeParse(
				{
					pathParams: { id: 'id-123', courseId: 'courseId-123' },
					query: { fields: 'id', updateMask: 'title' },
					body: { title: 'Assignment', workType: 'ASSIGNMENT' },
					unlistedCallback: 'https://corsair.dev/callback',
				},
			).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.create'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.create'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.rubrics.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.delete'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.delete'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.rubrics.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.get'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.get'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.rubrics.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.list'
			].safeParse({
				pathParams: {
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.list'
			].safeParse({
				pathParams: {
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.rubrics.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.patch'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.rubrics.patch'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.rubrics.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
					id: 'id-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
					id: 'id-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.list'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.list'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id' },
				body: { addAttachments: [] },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id' },
				body: { addAttachments: [] },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.modifyAttachments'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id', updateMask: 'draftGrade' },
				body: { draftGrade: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id', updateMask: 'draftGrade' },
				body: { draftGrade: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.reclaim'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				body: {},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.reclaim'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					id: 'id-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				body: {},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.reclaim'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.return'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				body: {},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.return'
			].safeParse({
				pathParams: {
					id: 'id-123',
					courseId: 'courseId-123',
					courseWorkId: 'courseWorkId-123',
				},
				query: { fields: 'id' },
				body: {},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.return'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.turnIn'
			].safeParse({
				pathParams: {
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
					id: 'id-123',
				},
				query: { fields: 'id' },
				body: {},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWork.studentSubmissions.turnIn'
			].safeParse({
				pathParams: {
					courseWorkId: 'courseWorkId-123',
					courseId: 'courseId-123',
					id: 'id-123',
				},
				query: { fields: 'id' },
				body: {},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWork.studentSubmissions.turnIn'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.create'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.create'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.get'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.get'
			].safeParse({
				pathParams: {
					itemId: 'itemId-123',
					attachmentId: 'attachmentId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', postId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.list'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					postId: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.list'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					postId: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.addOnAttachments.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Reading material' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Reading material' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.get'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.get'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.getAddOnContext'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.getAddOnContext'
			].safeParse({
				pathParams: { itemId: 'itemId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					attachmentId: 'sample-query',
					postId: 'sample-query',
					addOnToken: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.getAddOnContext'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.list'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.list'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.patch'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Reading material' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.courseWorkMaterials.patch'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Reading material' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.courseWorkMaterials.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.create'].safeParse({
				pathParams: {},
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.create'].safeParse({
				pathParams: {},
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.create'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.delete'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.delete'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.delete'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.get'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.get'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.get'].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.getGradingPeriodSettings'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.getGradingPeriodSettings'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.getGradingPeriodSettings'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.list'].safeParse({
				pathParams: {},
				query: {
					fields: 'id',
					courseStates: ['COURSE_STATE_UNSPECIFIED'],
					pageSize: 1,
					teacherId: 'sample-query',
					pageToken: 'sample-query',
					studentId: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.list'].safeParse({
				pathParams: {},
				query: {
					fields: 'id',
					courseStates: ['COURSE_STATE_UNSPECIFIED'],
					pageSize: 1,
					teacherId: 'sample-query',
					pageToken: 'sample-query',
					studentId: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.list'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.patch'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id', updateMask: 'name' },
				body: { name: 'Biology' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.patch'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id', updateMask: 'name' },
				body: { name: 'Biology' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.patch'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.create'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.create'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.delete'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.list'
			].safeParse({
				pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					itemId: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.list'
			].safeParse({
				pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					itemId: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.patch'
			].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.patch'
			].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					submissionId: 'submissionId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					submissionId: 'submissionId-123',
					postId: 'postId-123',
					attachmentId: 'attachmentId-123',
				},
				query: { fields: 'id', itemId: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					courseId: 'courseId-123',
					attachmentId: 'attachmentId-123',
					postId: 'postId-123',
				},
				query: {
					fields: 'id',
					updateMask: 'pointsEarned',
					itemId: 'itemId-123',
				},
				body: { pointsEarned: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			].safeParse({
				pathParams: {
					submissionId: 'submissionId-123',
					courseId: 'courseId-123',
					attachmentId: 'attachmentId-123',
					postId: 'postId-123',
				},
				query: {
					fields: 'id',
					updateMask: 'pointsEarned',
					itemId: 'itemId-123',
				},
				body: { pointsEarned: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.addOnAttachments.studentSubmissions.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.getAddOnContext'
			].safeParse({
				pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					itemId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.posts.getAddOnContext'
			].safeParse({
				pathParams: { postId: 'postId-123', courseId: 'courseId-123' },
				query: {
					fields: 'id',
					itemId: 'sample-query',
					attachmentId: 'sample-query',
					addOnToken: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.posts.getAddOnContext'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Study group' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.create'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { title: 'Study group' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.delete'
			].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.list'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.patch'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Study group' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.patch'
			].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { title: 'Study group' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.create'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					studentGroupId: 'studentGroupId-123',
				},
				query: { fields: 'id' },
				body: { userId: 'student-123' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.create'
			].safeParse({
				pathParams: {
					courseId: 'courseId-123',
					studentGroupId: 'studentGroupId-123',
				},
				query: { fields: 'id' },
				body: { userId: 'student-123' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.delete'
			].safeParse({
				pathParams: {
					studentGroupId: 'studentGroupId-123',
					courseId: 'courseId-123',
					userId: 'userId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.delete'
			].safeParse({
				pathParams: {
					studentGroupId: 'studentGroupId-123',
					courseId: 'courseId-123',
					userId: 'userId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.list'
			].safeParse({
				pathParams: {
					studentGroupId: 'studentGroupId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.studentGroups.studentGroupMembers.list'
			].safeParse({
				pathParams: {
					studentGroupId: 'studentGroupId-123',
					courseId: 'courseId-123',
				},
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.studentGroups.studentGroupMembers.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', enrollmentCode: 'sample-query' },
				body: { userId: 'student-123' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', enrollmentCode: 'sample-query' },
				body: { userId: 'student-123' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.students.create'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.delete'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.delete'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.students.delete'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.get'].safeParse({
				pathParams: { courseId: 'courseId-123', userId: 'userId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.get'].safeParse({
				pathParams: { courseId: 'courseId-123', userId: 'userId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.students.get'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.students.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.students.list'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { userId: 'teacher-123' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { userId: 'teacher-123' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.teachers.create'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.delete'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.delete'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.teachers.delete'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.get'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.get'].safeParse({
				pathParams: { userId: 'userId-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.teachers.get'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.teachers.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageSize: 1, pageToken: 'sample-query' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.teachers.list'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { name: 'Unit 1' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.create'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id' },
				body: { name: 'Unit 1' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.topics.create'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.delete'].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.delete'].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.topics.delete'].safeParse(
				{},
			).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.get'].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.get'].safeParse({
				pathParams: { id: 'id-123', courseId: 'courseId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.topics.get'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.list'].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', pageToken: 'sample-query', pageSize: 1 },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.topics.list'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.patch'].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { name: 'Unit 1' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.topics.patch'].safeParse({
				pathParams: { courseId: 'courseId-123', id: 'id-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: { name: 'Unit 1' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.topics.patch'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.update'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['courses.update'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				body: { name: 'Biology', ownerId: 'me' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['courses.update'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.updateGradingPeriodSettings'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: {},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'courses.updateGradingPeriodSettings'
			].safeParse({
				pathParams: { courseId: 'courseId-123' },
				query: { fields: 'id', updateMask: 'title' },
				body: {},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'courses.updateGradingPeriodSettings'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.accept'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.accept'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['invitations.accept'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.create'].safeParse({
				pathParams: {},
				query: { fields: 'id' },
				body: {
					userId: 'student-123',
					courseId: 'course-123',
					role: 'STUDENT',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.create'].safeParse({
				pathParams: {},
				query: { fields: 'id' },
				body: {
					userId: 'student-123',
					courseId: 'course-123',
					role: 'STUDENT',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['invitations.create'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.delete'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.delete'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['invitations.delete'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.get'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.get'].safeParse({
				pathParams: { id: 'id-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['invitations.get'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.list'].safeParse({
				pathParams: {},
				query: {
					fields: 'id',
					userId: 'sample-query',
					pageToken: 'sample-query',
					courseId: 'sample-query',
					pageSize: 1,
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['invitations.list'].safeParse({
				pathParams: {},
				query: {
					fields: 'id',
					userId: 'sample-query',
					pageToken: 'sample-query',
					courseId: 'sample-query',
					pageSize: 1,
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['invitations.list'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['registrations.create'].safeParse({
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
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['registrations.create'].safeParse({
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
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['registrations.create'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['registrations.delete'].safeParse({
				pathParams: { registrationId: 'registrationId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['registrations.delete'].safeParse({
				pathParams: { registrationId: 'registrationId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['registrations.delete'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['userProfiles.get'].safeParse({
				pathParams: { userId: 'userId-123' },
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas['userProfiles.get'].safeParse({
				pathParams: { userId: 'userId-123' },
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas['userProfiles.get'].safeParse({})
				.success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.create'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: { fields: 'id' },
				body: {
					studentId: 'student-123',
					invitedEmailAddress: 'guardian@school.test',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.create'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: { fields: 'id' },
				body: {
					studentId: 'student-123',
					invitedEmailAddress: 'guardian@school.test',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.create'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.get'
			].safeParse({
				pathParams: {
					invitationId: 'invitationId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.get'
			].safeParse({
				pathParams: {
					invitationId: 'invitationId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.list'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
					pageSize: 1,
					states: ['GUARDIAN_INVITATION_STATE_UNSPECIFIED'],
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.list'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: {
					fields: 'id',
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
					pageSize: 1,
					states: ['GUARDIAN_INVITATION_STATE_UNSPECIFIED'],
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.list'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.patch'
			].safeParse({
				pathParams: {
					invitationId: 'invitationId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id', updateMask: 'state' },
				body: { state: 'PENDING' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardianInvitations.patch'
			].safeParse({
				pathParams: {
					invitationId: 'invitationId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id', updateMask: 'state' },
				body: { state: 'PENDING' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardianInvitations.patch'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.delete'
			].safeParse({
				pathParams: {
					guardianId: 'guardianId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.delete'
			].safeParse({
				pathParams: {
					guardianId: 'guardianId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardians.delete'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.get'
			].safeParse({
				pathParams: {
					guardianId: 'guardianId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.get'
			].safeParse({
				pathParams: {
					guardianId: 'guardianId-123',
					studentId: 'studentId-123',
				},
				query: { fields: 'id' },
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardians.get'
			].safeParse({}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.list'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
				},
			}).success,
		).toBe(true);
		expect(
			GoogleClassroomEndpointInputSchemas[
				'userProfiles.guardians.list'
			].safeParse({
				pathParams: { studentId: 'studentId-123' },
				query: {
					fields: 'id',
					pageSize: 1,
					pageToken: 'sample-query',
					invitedEmailAddress: 'sample-query',
				},
				unlistedCallback: 'https://corsair.dev/callback',
			}).success,
		).toBe(false);
		expect(
			GoogleClassroomEndpointOutputSchemas[
				'userProfiles.guardians.list'
			].safeParse({}).success,
		).toBe(true);
	});

	it('rejects malformed documented response fields', () => {
		expect(
			GoogleClassroomResponseSchemas.Course.safeParse({ id: 17 }).success,
		).toBe(false);
		expect(
			GoogleClassroomResponseSchemas.CourseWork.safeParse({ maxPoints: 'many' })
				.success,
		).toBe(false);
	});
});
