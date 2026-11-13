import { z } from 'zod';
import {
	GoogleClassroomModelSchemas,
	GoogleClassroomResponseSchemas,
} from './models';

export const GOOGLE_CLASSROOM_ROUTES = {
	'courses.aliases.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/aliases',
		description:
			'Creates an alias for a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create the alias or for access errors. * `NOT_FOUND` if the course does not exist. * `ALREADY_EXISTS` if the alias already exists. * `FAILED_PRECONDITION` if the alias requested does not make sense for the requesting user or course (for example, if a user not in a domain attempts to access a domain-scoped alias).',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'write',
	},
	'courses.aliases.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/aliases/{alias}',
		description:
			'Deletes an alias of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to remove the alias or for access errors. * `NOT_FOUND` if the alias does not exist. * `FAILED_PRECONDITION` if the alias requested does not make sense for the requesting user or course (for example, if a user not in a domain attempts to delete a domain-scoped alias).',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'destructive',
	},
	'courses.aliases.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/aliases',
		description:
			'Returns a list of aliases for a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the course or for access errors. * `NOT_FOUND` if the course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.courses',
			'https://www.googleapis.com/auth/classroom.courses.readonly',
		],
		riskLevel: 'read',
	},
	'courses.announcements.addOnAttachments.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnAttachments',
		description:
			'Creates an add-on attachment under a post. Requires the add-on to have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.announcements.addOnAttachments.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Deletes an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'destructive',
	},
	'courses.announcements.addOnAttachments.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Returns an add-on attachment. Requires the add-on requesting the attachment to be the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.announcements.addOnAttachments.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnAttachments',
		description:
			'Returns all attachments created by an add-on under the post. Requires the add-on to have active attachments on the post or have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.announcements.addOnAttachments.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Updates an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.announcements.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/announcements',
		description:
			'Creates an announcement. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, create announcements in the requested course, share a Drive attachment, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist. * `FAILED_PRECONDITION` for the following request error: * AttachmentNotVisible',
		scopes: ['https://www.googleapis.com/auth/classroom.announcements'],
		riskLevel: 'destructive',
	},
	'courses.announcements.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/announcements/{id}',
		description:
			'Deletes an announcement. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding announcement item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding announcement, if the requesting user is not permitted to delete the requested course or for access errors. * `FAILED_PRECONDITION` if the requested announcement has already been deleted. * `NOT_FOUND` if no course exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.announcements'],
		riskLevel: 'destructive',
	},
	'courses.announcements.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/announcements/{id}',
		description:
			'Returns an announcement. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or announcement, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or announcement does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.announcements',
			'https://www.googleapis.com/auth/classroom.announcements.readonly',
		],
		riskLevel: 'read',
	},
	'courses.announcements.getAddOnContext': {
		method: 'GET',
		path: '/v1/courses/{courseId}/announcements/{itemId}/addOnContext',
		description:
			"Gets metadata for Classroom add-ons in the context of a specific post. To maintain the integrity of its own data and permissions model, an add-on should call this to validate query parameters and the requesting user's role whenever the add-on is opened in an [iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/iframes-overview). This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.announcements.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/announcements',
		description:
			'Returns a list of announcements that the requester is permitted to view. Course students may only view `PUBLISHED` announcements. Course teachers and domain administrators may view all announcements. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.announcements',
			'https://www.googleapis.com/auth/classroom.announcements.readonly',
		],
		riskLevel: 'read',
	},
	'courses.announcements.modifyAssignees': {
		method: 'POST',
		path: '/v1/courses/{courseId}/announcements/{id}:modifyAssignees',
		description:
			'Modifies assignee mode and options of an announcement. Only a teacher of the course that contains the announcement may call this method. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work does not exist. * `FAILED_PRECONDITION` for the following request error: * EmptyAssignees',
		scopes: ['https://www.googleapis.com/auth/classroom.announcements'],
		riskLevel: 'write',
	},
	'courses.announcements.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/announcements/{id}',
		description:
			'Updates one or more fields of an announcement. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding announcement or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `FAILED_PRECONDITION` if the requested announcement has already been deleted. * `NOT_FOUND` if the requested course or announcement does not exist',
		scopes: ['https://www.googleapis.com/auth/classroom.announcements'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.addOnAttachments.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments',
		description:
			'Creates an add-on attachment under a post. Requires the add-on to have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.courseWork.addOnAttachments.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Deletes an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.addOnAttachments.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Returns an add-on attachment. Requires the add-on requesting the attachment to be the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.addOnAttachments.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments',
		description:
			'Returns all attachments created by an add-on under the post. Requires the add-on to have active attachments on the post or have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.addOnAttachments.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Updates an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}',
		description:
			'Returns a student submission for an add-on attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions',
		description:
			'Returns a list of student submissions that the requester is permitted to view. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.addOnAttachments.studentSubmissions.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}',
		description:
			'Updates data associated with an add-on attachment submission. Requires the add-on to have been the original creator of the attachment and the attachment to have a positive `max_points` value set. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.courseWork.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork',
		description:
			'Creates course work. The resulting course work (and corresponding student submissions) are associated with the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to make the request. Classroom API requests to modify course work and student submissions must be made with an OAuth client ID from the associated Developer Console project. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, create course work in the requested course, share a Drive attachment, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist. * `FAILED_PRECONDITION` for the following request error: * AttachmentNotVisible',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'write',
	},
	'courses.courseWork.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/courseWork/{id}',
		description:
			'Deletes a course work. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work, if the requesting user is not permitted to delete the requested course or for access errors. * `FAILED_PRECONDITION` if the requested course work has already been deleted. * `NOT_FOUND` if no course exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{id}',
		description:
			'Returns course work. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.getAddOnContext': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{itemId}/addOnContext',
		description:
			"Gets metadata for Classroom add-ons in the context of a specific post. To maintain the integrity of its own data and permissions model, an add-on should call this to validate query parameters and the requesting user's role whenever the add-on is opened in an [iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/iframes-overview). This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork',
		description:
			'Returns a list of course work that the requester is permitted to view. Course students may only view `PUBLISHED` course work. Course teachers and domain administrators may view all course work. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.modifyAssignees': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{id}:modifyAssignees',
		description:
			'Modifies assignee mode and options of a coursework. Only a teacher of the course that contains the coursework may call this method. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work does not exist. * `FAILED_PRECONDITION` for the following request error: * EmptyAssignees',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'write',
	},
	'courses.courseWork.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWork/{id}',
		description:
			'Updates one or more fields of a course work. See google.classroom.v1.CourseWork for details of which fields may be updated and who may change them. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work or an add-on attachment on the corresponding course work, if the user is not permitted to make the requested modification to the student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `FAILED_PRECONDITION` if the requested course work has already been deleted. * `NOT_FOUND` if the requested course or course work does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.rubrics.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics',
		description:
			"Creates a rubric. The requesting user and course owner must have rubrics creation capabilities. For details, see [licensing requirements](https://developers.google.com/workspace/classroom/rubrics/limitations#license-requirements). For further details, see [Rubrics structure and known limitations](/classroom/rubrics/limitations). This request must be made by the Google Cloud console of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the parent course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user isn't permitted to create rubrics for course work in the requested course. * `INTERNAL` if the request has insufficient OAuth scopes. * `INVALID_ARGUMENT` if the request is malformed and for the following request error: * `RubricCriteriaInvalidFormat` * `NOT_FOUND` if the requested course or course work don't exist or the user doesn't have access to the course or course work. * `FAILED_PRECONDITION` for the following request error: * `AttachmentNotVisible`",
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'write',
	},
	'courses.courseWork.rubrics.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}',
		description:
			"Deletes a rubric. The requesting user and course owner must have rubrics creation capabilities. For details, see [licensing requirements](https://developers.google.com/workspace/classroom/rubrics/limitations#license-requirements). This request must be made by the Google Cloud console of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding rubric. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project didn't create the corresponding rubric, or if the requesting user isn't permitted to delete the requested rubric. * `NOT_FOUND` if no rubric exists with the requested ID or the user does not have access to the course, course work, or rubric. * `INVALID_ARGUMENT` if grading has already started on the rubric.",
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.rubrics.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}',
		description:
			"Returns a rubric. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or rubric doesn't exist or if the user doesn't have access to the corresponding course work.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.rubrics.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics',
		description:
			"Returns a list of rubrics that the requester is permitted to view. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work doesn't exist or if the user doesn't have access to the corresponding course work.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.rubrics.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/rubrics/{id}',
		description:
			"Updates a rubric. See google.classroom.v1.Rubric for details of which fields can be updated. Rubric update capabilities are [limited](/classroom/rubrics/limitations) once grading has started. The requesting user and course owner must have rubrics creation capabilities. For details, see [licensing requirements](https://developers.google.com/workspace/classroom/rubrics/limitations#license-requirements). This request must be made by the Google Cloud console of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the parent course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project didn't create the corresponding course work, if the user isn't permitted to make the requested modification to the rubric, or for access errors. This error code is also returned if grading has already started on the rubric. * `INVALID_ARGUMENT` if the request is malformed and for the following request error: * `RubricCriteriaInvalidFormat` * `NOT_FOUND` if the requested course, course work, or rubric doesn't exist or if the user doesn't have access to the corresponding course work. * `INTERNAL` if grading has already started on the rubric.",
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.studentSubmissions.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}',
		description:
			'Returns a student submission. * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, course work, or student submission or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.studentSubmissions.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions',
		description:
			'Returns a list of student submissions that the requester is permitted to view, factoring in the OAuth scopes of the request. A hyphen (`-`) may be specified as the `course_work_id` to include student submissions for multiple course work items. Course students may only view their own work. Course teachers and domain administrators may view all student submissions. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWork.studentSubmissions.modifyAttachments': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:modifyAttachments',
		description:
			'Modifies attachments of student submission. Attachments may only be added to student submissions belonging to course work objects with a `workType` of `ASSIGNMENT`. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, if the user is not permitted to modify attachments on the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.students',
		],
		riskLevel: 'destructive',
	},
	'courses.courseWork.studentSubmissions.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}',
		description:
			'Updates one or more fields of a student submission. See google.classroom.v1.StudentSubmission for details of which fields may be updated and who may change them. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment with Grade Sync enabled on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work or an add-on attachment on the corresponding course work with Grade Sync enabled, if the user is not permitted to make the requested modification to the student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.students',
		],
		riskLevel: 'destructive',
	},
	'courses.courseWork.studentSubmissions.reclaim': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:reclaim',
		description:
			'Reclaims a student submission on behalf of the student that owns it. Reclaiming a student submission transfers ownership of attached Drive files to the student and updates the submission state. Only the student that owns the requested student submission may call this method, and only for a student submission that has been turned in. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, unsubmit the requested student submission, or for access errors. * `FAILED_PRECONDITION` if the student submission has not been turned in. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.me'],
		riskLevel: 'write',
	},
	'courses.courseWork.studentSubmissions.return': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:return',
		description:
			'Returns a student submission. Returning a student submission transfers ownership of attached Drive files to the student and may also update the submission state. Unlike the Classroom application, returning a student submission does not set assignedGrade to the draftGrade value. Only a teacher of the course that contains the requested student submission may call this method. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, return the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.students'],
		riskLevel: 'destructive',
	},
	'courses.courseWork.studentSubmissions.turnIn': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWork/{courseWorkId}/studentSubmissions/{id}:turnIn',
		description:
			'Turns in a student submission. Turning in a student submission transfers ownership of attached Drive files to the teacher and may also update the submission state. This may only be called by the student that owns the specified student submission. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work item or an add-on attachment on the corresponding course work item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work, turn in the requested student submission, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course, course work, or student submission does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.coursework.me'],
		riskLevel: 'destructive',
	},
	'courses.courseWorkMaterials.addOnAttachments.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments',
		description:
			'Creates an add-on attachment under a post. Requires the add-on to have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.courseWorkMaterials.addOnAttachments.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Deletes an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'destructive',
	},
	'courses.courseWorkMaterials.addOnAttachments.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Returns an add-on attachment. Requires the add-on requesting the attachment to be the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWorkMaterials.addOnAttachments.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments',
		description:
			'Returns all attachments created by an add-on under the post. Requires the add-on to have active attachments on the post or have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWorkMaterials.addOnAttachments.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnAttachments/{attachmentId}',
		description:
			'Updates an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.courseWorkMaterials.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/courseWorkMaterials',
		description:
			'Creates a course work material. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, create course work material in the requested course, share a Drive attachment, or for access errors. * `INVALID_ARGUMENT` if the request is malformed or if more than 20 * materials are provided. * `NOT_FOUND` if the requested course does not exist. * `FAILED_PRECONDITION` for the following request error: * AttachmentNotVisible',
		scopes: ['https://www.googleapis.com/auth/classroom.courseworkmaterials'],
		riskLevel: 'write',
	},
	'courses.courseWorkMaterials.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{id}',
		description:
			'Deletes a course work material. This request must be made by the Developer Console project of the [OAuth client ID](https://support.google.com/cloud/answer/6158849) used to create the corresponding course work material item. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding course work material, if the requesting user is not permitted to delete the requested course or for access errors. * `FAILED_PRECONDITION` if the requested course work material has already been deleted. * `NOT_FOUND` if no course exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.courseworkmaterials'],
		riskLevel: 'destructive',
	},
	'courses.courseWorkMaterials.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{id}',
		description:
			'Returns a course work material. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or course work material, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or course work material does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.courseworkmaterials',
			'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWorkMaterials.getAddOnContext': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{itemId}/addOnContext',
		description:
			"Gets metadata for Classroom add-ons in the context of a specific post. To maintain the integrity of its own data and permissions model, an add-on should call this to validate query parameters and the requesting user's role whenever the add-on is opened in an [iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/iframes-overview). This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.courseWorkMaterials.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/courseWorkMaterials',
		description:
			'Returns a list of course work material that the requester is permitted to view. Course students may only view `PUBLISHED` course work material. Course teachers and domain administrators may view all course work material. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.courseworkmaterials',
			'https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly',
		],
		riskLevel: 'read',
	},
	'courses.courseWorkMaterials.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/courseWorkMaterials/{id}',
		description:
			'Updates one or more fields of a course work material. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `FAILED_PRECONDITION` if the requested course work material has already been deleted. * `NOT_FOUND` if the requested course or course work material does not exist',
		scopes: ['https://www.googleapis.com/auth/classroom.courseworkmaterials'],
		riskLevel: 'destructive',
	},
	'courses.create': {
		method: 'POST',
		path: '/v1/courses',
		description:
			"Creates a course. The user specified in `ownerId` is the owner of the created course and added as a teacher. A non-admin requesting user can only create a course with themselves as the owner. Domain admins can create courses owned by any user within their domain. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create courses or for access errors. * `NOT_FOUND` if the primary teacher is not a valid user. * `FAILED_PRECONDITION` if the course owner's account is disabled or for the following request errors: * UserCannotOwnCourse * UserGroupsMembershipLimitReached * CourseTitleCannotContainUrl * `ALREADY_EXISTS` if an alias was specified in the `id` and already exists.",
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'write',
	},
	'courses.delete': {
		method: 'DELETE',
		path: '/v1/courses/{id}',
		description:
			'Deletes a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'destructive',
	},
	'courses.get': {
		method: 'GET',
		path: '/v1/courses/{id}',
		description:
			'Returns a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.courses',
			'https://www.googleapis.com/auth/classroom.courses.readonly',
		],
		riskLevel: 'read',
	},
	'courses.getGradingPeriodSettings': {
		method: 'GET',
		path: '/v1/courses/{courseId}/gradingPeriodSettings',
		description:
			"Returns the grading period settings in a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user isn't permitted to access the grading period settings in the requested course or for access errors. * `NOT_FOUND` if the requested course does not exist.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.courses',
			'https://www.googleapis.com/auth/classroom.courses.readonly',
		],
		riskLevel: 'read',
	},
	'courses.list': {
		method: 'GET',
		path: '/v1/courses',
		description:
			'Returns a list of courses that the requesting user is permitted to view, restricted to those that match the request. Returned courses are ordered by creation time, with the most recently created coming first. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the query argument is malformed. * `NOT_FOUND` if any users specified in the query arguments do not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.courses',
			'https://www.googleapis.com/auth/classroom.courses.readonly',
		],
		riskLevel: 'read',
	},
	'courses.patch': {
		method: 'PATCH',
		path: '/v1/courses/{id}',
		description:
			'Updates one or more fields in a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID. * `INVALID_ARGUMENT` if invalid fields are specified in the update mask or if no update mask is supplied. * `FAILED_PRECONDITION` for the following request errors: * CourseNotModifiable * InactiveCourseOwner * IneligibleOwner * CourseTitleCannotContainUrl',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'destructive',
	},
	'courses.posts.addOnAttachments.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments',
		description:
			'Creates an add-on attachment under a post. Requires the add-on to have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.posts.addOnAttachments.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}',
		description:
			'Deletes an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'destructive',
	},
	'courses.posts.addOnAttachments.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}',
		description:
			'Returns an add-on attachment. Requires the add-on requesting the attachment to be the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.posts.addOnAttachments.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments',
		description:
			'Returns all attachments created by an add-on under the post. Requires the add-on to have active attachments on the post or have permission to create new attachments on the post. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.posts.addOnAttachments.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}',
		description:
			'Updates an add-on attachment. Requires the add-on to have been the original creator of the attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.posts.addOnAttachments.studentSubmissions.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}',
		description:
			'Returns a student submission for an add-on attachment. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
			'https://www.googleapis.com/auth/classroom.coursework.me',
			'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
			'https://www.googleapis.com/auth/classroom.coursework.students',
			'https://www.googleapis.com/auth/classroom.coursework.students.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
			'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly',
		],
		riskLevel: 'read',
	},
	'courses.posts.addOnAttachments.studentSubmissions.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnAttachments/{attachmentId}/studentSubmissions/{submissionId}',
		description:
			'Updates data associated with an add-on attachment submission. Requires the add-on to have been the original creator of the attachment and the attachment to have a positive `max_points` value set. This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.addons.teacher'],
		riskLevel: 'write',
	},
	'courses.posts.getAddOnContext': {
		method: 'GET',
		path: '/v1/courses/{courseId}/posts/{postId}/addOnContext',
		description:
			"Gets metadata for Classroom add-ons in the context of a specific post. To maintain the integrity of its own data and permissions model, an add-on should call this to validate query parameters and the requesting user's role whenever the add-on is opened in an [iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/iframes-overview). This method returns the following error codes: * `PERMISSION_DENIED` for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if one of the identified resources does not exist.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.addons.student',
			'https://www.googleapis.com/auth/classroom.addons.teacher',
		],
		riskLevel: 'read',
	},
	'courses.studentGroups.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/studentGroups',
		description:
			"Creates a student group for a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create the student group or for access errors. * `NOT_FOUND` if the course does not exist or the requesting user doesn't have access to the course. * `FAILED_PRECONDITION` if creating the student group would exceed the maximum number of student groups per course.",
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'write',
	},
	'courses.studentGroups.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/studentGroups/{id}',
		description:
			'Deletes a student group. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested student group or for access errors. * `NOT_FOUND` if the student group does not exist or the user does not have access to the student group.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'courses.studentGroups.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/studentGroups',
		description:
			'Returns a list of groups in a course. This method returns the following error codes: * `NOT_FOUND` if the course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.studentGroups.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/studentGroups/{id}',
		description:
			'Updates one or more fields in a student group. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the requested student group or for access errors. * `NOT_FOUND` if the student group does not exist or the user does not have access to the student group. * `INVALID_ARGUMENT` if invalid fields are specified in the update mask or if no update mask is supplied.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'write',
	},
	'courses.studentGroups.studentGroupMembers.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers',
		description:
			'Creates a student group member for a student group. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create the student group or member for access errors. * `NOT_FOUND` if the student group does not exist or the user does not have access to the student group. * `ALREADY_EXISTS` if the student group member already exists. * `FAILED_PRECONDITION` if attempting to add a member to a student group that has reached its member limit.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'write',
	},
	'courses.studentGroups.studentGroupMembers.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers/{userId}',
		description:
			'Deletes a student group member. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested student group member or for access errors. * `NOT_FOUND` if the student group member does not exist or the user does not have access to the student group.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'courses.studentGroups.studentGroupMembers.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/studentGroups/{studentGroupId}/studentGroupMembers',
		description:
			'Returns a list of students in a group. This method returns the following error codes: * `NOT_FOUND` if the course or student group does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.students.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/students',
		description:
			"Adds a user as a student of a course. Domain administrators are permitted to [directly add](https://developers.google.com/workspace/classroom/guides/manage-users) users within their domain as students to courses within their domain. Students are permitted to add themselves to a course using an enrollment code. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create students in this course or for access errors. * `NOT_FOUND` if the requested course ID does not exist. * `FAILED_PRECONDITION` if the requested user's account is disabled, for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * UserGroupsMembershipLimitReached * InactiveCourseOwner * `ALREADY_EXISTS` if the user is already a student or teacher in the course.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
		],
		riskLevel: 'write',
	},
	'courses.students.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/students/{userId}',
		description:
			'Deletes a student of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete students of this course or for access errors. * `NOT_FOUND` if no student of this course has the requested ID or if the course does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'courses.students.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/students/{userId}',
		description:
			'Returns a student of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view students of this course or for access errors. * `NOT_FOUND` if no student of this course has the requested ID or if the course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.students.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/students',
		description:
			'Returns a list of students of this course that the requester is permitted to view. This method returns the following error codes: * `NOT_FOUND` if the course does not exist. * `PERMISSION_DENIED` for access errors.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.teachers.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/teachers',
		description:
			"Creates a teacher of a course. Domain administrators are permitted to [directly add](https://developers.google.com/workspace/classroom/guides/manage-users) users within their domain as teachers to courses within their domain. Non-admin users should send an Invitation instead. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create teachers in this course or for access errors. * `NOT_FOUND` if the requested course ID does not exist. * `FAILED_PRECONDITION` if the requested user's account is disabled, for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * CourseTeacherLimitReached * UserGroupsMembershipLimitReached * InactiveCourseOwner * `ALREADY_EXISTS` if the user is already a teacher or student in the course.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
		],
		riskLevel: 'write',
	},
	'courses.teachers.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/teachers/{userId}',
		description:
			'Removes the specified teacher from the specified course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete teachers of this course or for access errors. * `NOT_FOUND` if no teacher of this course has the requested ID or if the course does not exist. * `FAILED_PRECONDITION` if the requested ID belongs to the primary teacher of this course. * `FAILED_PRECONDITION` if the requested ID belongs to the owner of the course Drive folder. * `FAILED_PRECONDITION` if the course no longer has an active owner.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'courses.teachers.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/teachers/{userId}',
		description:
			'Returns a teacher of a course. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view teachers of this course or for access errors. * `NOT_FOUND` if no teacher of this course has the requested ID or if the course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.teachers.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/teachers',
		description:
			'Returns a list of teachers of this course that the requester is permitted to view. This method returns the following error codes: * `NOT_FOUND` if the course does not exist. * `PERMISSION_DENIED` for access errors.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'courses.topics.create': {
		method: 'POST',
		path: '/v1/courses/{courseId}/topics',
		description:
			'Creates a topic. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course, create a topic in the requested course, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `ALREADY_EXISTS` if there exists a topic in the course with the same name. * `FAILED_PRECONDITION` for the following request error: * CourseTopicLimitReached * `NOT_FOUND` if the requested course does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.topics'],
		riskLevel: 'write',
	},
	'courses.topics.delete': {
		method: 'DELETE',
		path: '/v1/courses/{courseId}/topics/{id}',
		description:
			'Deletes a topic. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not allowed to delete the requested topic or for access errors. * `FAILED_PRECONDITION` if the requested topic has already been deleted. * `NOT_FOUND` if no course or topic exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.topics'],
		riskLevel: 'destructive',
	},
	'courses.topics.get': {
		method: 'GET',
		path: '/v1/courses/{courseId}/topics/{id}',
		description:
			'Returns a topic. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or topic, or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course or topic does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.topics',
			'https://www.googleapis.com/auth/classroom.topics.readonly',
		],
		riskLevel: 'read',
	},
	'courses.topics.list': {
		method: 'GET',
		path: '/v1/courses/{courseId}/topics',
		description:
			'Returns the list of topics that the requester is permitted to view. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access the requested course or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.topics',
			'https://www.googleapis.com/auth/classroom.topics.readonly',
		],
		riskLevel: 'read',
	},
	'courses.topics.patch': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/topics/{id}',
		description:
			'Updates one or more fields of a topic. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting developer project did not create the corresponding topic or for access errors. * `INVALID_ARGUMENT` if the request is malformed. * `FAILED_PRECONDITION` if there exists a topic in the course with the same name. * `NOT_FOUND` if the requested course or topic does not exist',
		scopes: ['https://www.googleapis.com/auth/classroom.topics'],
		riskLevel: 'write',
	},
	'courses.update': {
		method: 'PUT',
		path: '/v1/courses/{id}',
		description:
			'Updates a course. Note: Unlike other fields, `levels` is not cleared if omitted from the request. The `UpdateCourse` method only modifies `levels` if it is explicitly provided; otherwise, the existing value is preserved. Use the `PatchCourse` method to clear the `levels` field. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the requested course or for access errors. * `NOT_FOUND` if no course exists with the requested ID. * `FAILED_PRECONDITION` for the following request errors: * CourseNotModifiable * CourseTitleCannotContainUrl',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'write',
	},
	'courses.updateGradingPeriodSettings': {
		method: 'PATCH',
		path: '/v1/courses/{courseId}/gradingPeriodSettings',
		description:
			'Updates grading period settings of a course. Individual grading periods can be added, removed, or modified using this method. The requesting user and course owner must be eligible to modify Grading Periods. For details, see [licensing requirements](https://developers.google.com/workspace/classroom/grading-periods/manage-grading-periods#licensing_requirements). This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to modify the grading period settings in a course or for access errors: * UserIneligibleToUpdateGradingPeriodSettings * `INVALID_ARGUMENT` if the request is malformed. * `NOT_FOUND` if the requested course does not exist.',
		scopes: ['https://www.googleapis.com/auth/classroom.courses'],
		riskLevel: 'destructive',
	},
	'invitations.accept': {
		method: 'POST',
		path: '/v1/invitations/{id}:accept',
		description:
			'Accepts an invitation, removing it and adding the invited user to the teachers or students (as appropriate) of the specified course. Only the invited user may accept an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to accept the requested invitation or for access errors. * `FAILED_PRECONDITION` for the following request errors: * CourseMemberLimitReached * CourseNotModifiable * CourseTeacherLimitReached * UserGroupsMembershipLimitReached * `NOT_FOUND` if no invitation exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'write',
	},
	'invitations.create': {
		method: 'POST',
		path: '/v1/invitations',
		description:
			"Creates an invitation. Only one invitation for a user and course may exist at a time. Delete and re-create an invitation to make changes. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to create invitations for this course or for access errors. * `NOT_FOUND` if the course or the user does not exist. * `FAILED_PRECONDITION`: * if the requested user's account is disabled. * if the user already has this role or a role with greater permissions. * for the following request errors: * IneligibleOwner * `ALREADY_EXISTS` if an invitation for the specified user and course already exists.",
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'invitations.delete': {
		method: 'DELETE',
		path: '/v1/invitations/{id}',
		description:
			'Deletes an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to delete the requested invitation or for access errors. * `NOT_FOUND` if no invitation exists with the requested ID.',
		scopes: ['https://www.googleapis.com/auth/classroom.rosters'],
		riskLevel: 'destructive',
	},
	'invitations.get': {
		method: 'GET',
		path: '/v1/invitations/{id}',
		description:
			'Returns an invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view the requested invitation or for access errors. * `NOT_FOUND` if no invitation exists with the requested ID.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'invitations.list': {
		method: 'GET',
		path: '/v1/invitations',
		description:
			'Returns a list of invitations that the requesting user is permitted to view, restricted to those that match the list request. *Note:* At least one of `user_id` or `course_id` must be supplied. Both fields can be supplied. This method returns the following error codes: * `PERMISSION_DENIED` for access errors.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'registrations.create': {
		method: 'POST',
		path: '/v1/registrations',
		description:
			"Creates a `Registration`, causing Classroom to start sending notifications from the provided `feed` to the destination provided in `cloudPubSubTopic`. Returns the created `Registration`. Currently, this will be the same as the argument, but with server-assigned fields such as `expiry_time` and `id` filled in. Note that any value specified for the `expiry_time` or `id` fields will be ignored. While Classroom may validate the `cloudPubSubTopic` and return errors on a best effort basis, it is the caller's responsibility to ensure that it exists and that Classroom has permission to publish to it. This method may return the following error codes: * `PERMISSION_DENIED` if: * the authenticated user does not have permission to receive notifications from the requested field; or * the current user has not granted access to the current Cloud project with the appropriate scope for the requested feed. Note that domain-wide delegation of authority is not currently supported for this purpose. If the request has the appropriate scope, but no grant exists, a Request Errors is returned. * another access error is encountered. * `INVALID_ARGUMENT` if: * no `cloudPubsubTopic` is specified, or the specified `cloudPubsubTopic` is not valid; or * no `feed` is specified, or the specified `feed` is not valid. * `NOT_FOUND` if: * the specified `feed` cannot be located, or the requesting user does not have permission to determine whether or not it exists; or * the specified `cloudPubsubTopic` cannot be located, or Classroom has not been granted permission to publish to it.",
		scopes: ['https://www.googleapis.com/auth/classroom.push-notifications'],
		riskLevel: 'write',
	},
	'registrations.delete': {
		method: 'DELETE',
		path: '/v1/registrations/{registrationId}',
		description:
			'Deletes a `Registration`, causing Classroom to stop sending notifications for that `Registration`.',
		scopes: ['https://www.googleapis.com/auth/classroom.push-notifications'],
		riskLevel: 'destructive',
	},
	'userProfiles.get': {
		method: 'GET',
		path: '/v1/userProfiles/{userId}',
		description:
			'Returns a user profile. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to access this user profile, if no profile exists with the requested ID, or for access errors.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.profile.emails',
			'https://www.googleapis.com/auth/classroom.profile.photos',
			'https://www.googleapis.com/auth/classroom.rosters',
			'https://www.googleapis.com/auth/classroom.rosters.readonly',
		],
		riskLevel: 'read',
	},
	'userProfiles.guardianInvitations.create': {
		method: 'POST',
		path: '/v1/userProfiles/{studentId}/guardianInvitations',
		description:
			"Creates a guardian invitation, and sends an email to the guardian asking them to confirm that they are the student's guardian. Once the guardian accepts the invitation, their `state` will change to `COMPLETED` and they will start receiving guardian notifications. A `Guardian` resource will also be created to represent the active guardian. The request object must have the `student_id` and `invited_email_address` fields set. Failing to set these fields, or setting any other fields in the request, will result in an error. This method returns the following error codes: * `PERMISSION_DENIED` if the current user does not have permission to manage guardians, if the guardian in question has already rejected too many requests for that student, if guardians are not enabled for the domain in question, or for other access errors. * `RESOURCE_EXHAUSTED` if the student or guardian has exceeded the guardian link limit. * `INVALID_ARGUMENT` if the guardian email address is not valid (for example, if it is too long), or if the format of the student ID provided cannot be recognized (it is not an email address, nor a `user_id` from this API). This error will also be returned if read-only fields are set, or if the `state` field is set to to a value other than `PENDING`. * `NOT_FOUND` if the student ID provided is a valid student ID, but Classroom has no record of that student. * `ALREADY_EXISTS` if there is already a pending guardian invitation for the student and `invited_email_address` provided, or if the provided `invited_email_address` matches the Google account of an existing `Guardian` for this user.",
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
		],
		riskLevel: 'destructive',
	},
	'userProfiles.guardianInvitations.get': {
		method: 'GET',
		path: '/v1/userProfiles/{studentId}/guardianInvitations/{invitationId}',
		description:
			'Returns a specific guardian invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the requesting user is not permitted to view guardian invitations for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). * `NOT_FOUND` if Classroom cannot find any record of the given student or `invitation_id`. May also be returned if the student exists, but the requesting user does not have access to see that student.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
		],
		riskLevel: 'read',
	},
	'userProfiles.guardianInvitations.list': {
		method: 'GET',
		path: '/v1/userProfiles/{studentId}/guardianInvitations',
		description:
			'Returns a list of guardian invitations that the requesting user is permitted to view, filtered by the parameters provided. This method returns the following error codes: * `PERMISSION_DENIED` if a `student_id` is specified, and the requesting user is not permitted to view guardian invitations for that student, if `"-"` is specified as the `student_id` and the user is not a domain administrator, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). May also be returned if an invalid `page_token` or `state` is provided. * `NOT_FOUND` if a `student_id` is specified, and its format can be recognized, but Classroom has no record of that student.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
		],
		riskLevel: 'read',
	},
	'userProfiles.guardianInvitations.patch': {
		method: 'PATCH',
		path: '/v1/userProfiles/{studentId}/guardianInvitations/{invitationId}',
		description:
			'Modifies a guardian invitation. Currently, the only valid modification is to change the `state` from `PENDING` to `COMPLETE`. This has the effect of withdrawing the invitation. This method returns the following error codes: * `PERMISSION_DENIED` if the current user does not have permission to manage guardians, if guardians are not enabled for the domain in question or for other access errors. * `FAILED_PRECONDITION` if the guardian link is not in the `PENDING` state. * `INVALID_ARGUMENT` if the format of the student ID provided cannot be recognized (it is not an email address, nor a `user_id` from this API), or if the passed `GuardianInvitation` has a `state` other than `COMPLETE`, or if it modifies fields other than `state`. * `NOT_FOUND` if the student ID provided is a valid student ID, but Classroom has no record of that student, or if the `id` field does not refer to a guardian invitation known to Classroom.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
		],
		riskLevel: 'write',
	},
	'userProfiles.guardians.delete': {
		method: 'DELETE',
		path: '/v1/userProfiles/{studentId}/guardians/{guardianId}',
		description:
			'Deletes a guardian. The guardian will no longer receive guardian notifications and the guardian will no longer be accessible via the API. This method returns the following error codes: * `PERMISSION_DENIED` if no user that matches the provided `student_id` is visible to the requesting user, if the requesting user is not permitted to manage guardians for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API). * `NOT_FOUND` if the requesting user is permitted to modify guardians for the requested `student_id`, but no `Guardian` record exists for that student with the provided `guardian_id`.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
		],
		riskLevel: 'destructive',
	},
	'userProfiles.guardians.get': {
		method: 'GET',
		path: '/v1/userProfiles/{studentId}/guardians/{guardianId}',
		description:
			'Returns a specific guardian. This method returns the following error codes: * `PERMISSION_DENIED` if no user that matches the provided `student_id` is visible to the requesting user, if the requesting user is not permitted to view guardian information for the student identified by the `student_id`, if guardians are not enabled for the domain in question, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). * `NOT_FOUND` if the requesting user is permitted to view guardians for the requested `student_id`, but no `Guardian` record exists for that student that matches the provided `guardian_id`.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
		],
		riskLevel: 'read',
	},
	'userProfiles.guardians.list': {
		method: 'GET',
		path: '/v1/userProfiles/{studentId}/guardians',
		description:
			'Returns a list of guardians that the requesting user is permitted to view, restricted to those that match the request. To list guardians for any student that the requesting user may view guardians for, use the literal character `-` for the student ID. This method returns the following error codes: * `PERMISSION_DENIED` if a `student_id` is specified, and the requesting user is not permitted to view guardian information for that student, if `"-"` is specified as the `student_id` and the user is not a domain administrator, if guardians are not enabled for the domain in question, if the `invited_email_address` filter is set by a user who is not a domain administrator, or for other access errors. * `INVALID_ARGUMENT` if a `student_id` is specified, but its format cannot be recognized (it is not an email address, nor a `student_id` from the API, nor the literal string `me`). May also be returned if an invalid `page_token` is provided. * `NOT_FOUND` if a `student_id` is specified, and its format can be recognized, but Classroom has no record of that student.',
		scopes: [
			'https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students',
			'https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly',
		],
		riskLevel: 'read',
	},
} as const;

export type GoogleClassroomOperationId = keyof typeof GOOGLE_CLASSROOM_ROUTES;

const CourseAliasCreateBodySchema = z
	.object({
		alias: z.string().min(1),
	})
	.strict();
const AnnouncementCreateBodySchema = z
	.object({
		text: z.string().min(1).max(30000),
		materials: z.array(GoogleClassroomModelSchemas.Material).max(20).optional(),
		state: z.enum(['PUBLISHED', 'DRAFT']).optional(),
		scheduledTime: z.string().optional(),
		assigneeMode: z.enum(['ALL_STUDENTS', 'INDIVIDUAL_STUDENTS']).optional(),
		individualStudentsOptions:
			GoogleClassroomModelSchemas.IndividualStudentsOptions.optional(),
	})
	.strict()
	.refine(
		(body) =>
			body.assigneeMode !== 'INDIVIDUAL_STUDENTS' ||
			(body.individualStudentsOptions?.studentIds?.length ?? 0) > 0,
		'Individual announcements require at least one student ID.',
	);
const CourseWorkCreateBodySchema =
	GoogleClassroomModelSchemas.CourseWork.extend({
		title: z.string().min(1),
		workType: z.enum([
			'ASSIGNMENT',
			'SHORT_ANSWER_QUESTION',
			'MULTIPLE_CHOICE_QUESTION',
		]),
	}).strict();
const CourseWorkMaterialCreateBodySchema =
	GoogleClassroomModelSchemas.CourseWorkMaterial.extend({
		title: z.string().min(1),
	}).strict();
const AddOnAttachmentCreateBodySchema =
	GoogleClassroomModelSchemas.AddOnAttachment.extend({
		title: z.string().min(1),
		teacherViewUri: z.object({ uri: z.string().url() }).strict(),
	}).strict();
const RubricCreateBodySchema = GoogleClassroomModelSchemas.Rubric.refine(
	(body) =>
		Boolean(body.criteria?.length) !== Boolean(body.sourceSpreadsheetId),
	'Provide exactly one of criteria or sourceSpreadsheetId.',
);
const StudentCreateBodySchema = z
	.object({
		userId: z.string().min(1),
	})
	.strict();
const TeacherCreateBodySchema = z
	.object({
		userId: z.string().min(1),
	})
	.strict();
const StudentGroupCreateBodySchema = z
	.object({
		title: z.string().min(1),
	})
	.strict();
const StudentGroupMemberCreateBodySchema = z
	.object({
		userId: z.string().min(1),
	})
	.strict();
const TopicCreateBodySchema = z
	.object({
		name: z.string().min(1),
	})
	.strict();
const InvitationCreateBodySchema = z
	.object({
		userId: z.string().min(1),
		courseId: z.string().min(1),
		role: z.enum(['STUDENT', 'TEACHER']),
	})
	.strict();
const GuardianInvitationCreateBodySchema = z
	.object({
		studentId: z.string().min(1),
		invitedEmailAddress: z.email(),
	})
	.strict();
const GuardianInvitationUpdateBodySchema = z
	.object({
		state: z.enum(['PENDING', 'COMPLETE']),
	})
	.strict();
const RegistrationCreateBodySchema = z
	.object({
		cloudPubsubTopic: GoogleClassroomModelSchemas.CloudPubsubTopic,
		feed: GoogleClassroomModelSchemas.Feed,
	})
	.strict()
	.refine((body) => {
		if (body.feed.feedType === 'COURSE_ROSTER_CHANGES') {
			return Boolean(body.feed.courseRosterChangesInfo?.courseId);
		}
		if (body.feed.feedType === 'COURSE_WORK_CHANGES') {
			return Boolean(body.feed.courseWorkChangesInfo?.courseId);
		}
		return body.feed.feedType === 'DOMAIN_ROSTER_CHANGES';
	}, 'The feed type must match its corresponding feed information.');
const StudentSubmissionUpdateBodySchema = z
	.object({
		draftGrade: z.number().optional(),
		assignedGrade: z.number().optional(),
	})
	.strict()
	.refine(
		(body) => body.draftGrade !== undefined || body.assignedGrade !== undefined,
		'Provide draftGrade or assignedGrade.',
	);
const AddOnSubmissionUpdateBodySchema = z
	.object({
		pointsEarned: z.number().optional(),
	})
	.strict();
const ModifyCourseWorkAssigneesBodySchema =
	GoogleClassroomModelSchemas.ModifyCourseWorkAssigneesRequest.extend({
		assigneeMode: z.enum(['ALL_STUDENTS', 'INDIVIDUAL_STUDENTS']),
	}).refine(
		(body) =>
			body.assigneeMode !== 'INDIVIDUAL_STUDENTS' ||
			(body.modifyIndividualStudentsOptions?.addStudentIds?.length ?? 0) +
				(body.modifyIndividualStudentsOptions?.removeStudentIds?.length ?? 0) >
				0,
		'Individual assignment requires at least one student ID.',
	);
const ModifyAnnouncementAssigneesBodySchema =
	GoogleClassroomModelSchemas.ModifyAnnouncementAssigneesRequest.extend({
		assigneeMode: z.enum(['ALL_STUDENTS', 'INDIVIDUAL_STUDENTS']),
	}).refine(
		(body) =>
			body.assigneeMode !== 'INDIVIDUAL_STUDENTS' ||
			(body.modifyIndividualStudentsOptions?.addStudentIds?.length ?? 0) +
				(body.modifyIndividualStudentsOptions?.removeStudentIds?.length ?? 0) >
				0,
		'Individual assignment requires at least one student ID.',
	);

export const GoogleClassroomEndpointInputSchemas = {
	'courses.aliases.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course to alias. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: CourseAliasCreateBodySchema,
		})
		.strict(),
	'courses.aliases.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course whose alias should be deleted. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					alias: z
						.string()
						.describe(
							'Alias to delete. This may not be the Classroom-assigned identifier.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.aliases.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'The identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.addOnAttachments.create': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which to create the attachment. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. This authorization token is required for in-Classroom attachment creation but optional for partner-first attachment creation. Returns an error if not provided for partner-first attachment creation and the developer projects that created the attachment and its parent stream item do not match.",
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnAttachmentCreateBodySchema,
		})
		.strict(),
	'courses.announcements.addOnAttachments.delete': z
		.object({
			pathParams: z
				.object({
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.addOnAttachments.get': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.addOnAttachments.list': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` whose attachments should be enumerated. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					pageToken: z
						.string()
						.optional()
						.describe(
							'A page token, received from a previous `ListAddOnAttachments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAddOnAttachments` must match the call that provided the page token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'The maximum number of attachments to return. The service may return fewer than this value. If unspecified, at most 20 attachments will be returned. The maximum value is 20; values above 20 will be coerced to 20.',
						),
					postId: z
						.string()
						.optional()
						.describe(
							'Optional. Identifier of the post under the course whose attachments to enumerate. Deprecated, use `item_id` instead.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.addOnAttachments.patch': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the post under which the attachment is attached.',
						),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.describe(
							'Required. Identifier of the post under which the attachment is attached.',
						),
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachment` object. If a field that does not support empty values is included in the update mask and not set in the `AddOnAttachment` object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `teacher_view_uri` * `student_view_uri` * `student_work_review_uri` * `due_date` * `due_time` * `max_points`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.AddOnAttachment.partial(),
		})
		.strict(),
	'courses.announcements.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AnnouncementCreateBodySchema,
		})
		.strict(),
	'courses.announcements.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z
						.string()
						.describe(
							'Identifier of the announcement to delete. This identifier is a Classroom-assigned identifier.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.get': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the announcement.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.getAddOnContext': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					attachmentId: z
						.string()
						.optional()
						.describe(
							'Optional. The identifier of the attachment. This field is required for all requests except when the user is in the [Attachment Discovery iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/attachment-discovery-iframe).',
						),
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. The authorization token is required when neither of the following is true: * The add-on has attachments on the post. * The developer project issuing the request is the same project that created the post.",
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					orderBy: z
						.string()
						.optional()
						.describe(
							'Optional sort ordering for results. A comma-separated list of fields with an optional sort direction keyword. Supported field is `updateTime`. Supported direction keywords are `asc` and `desc`. If not specified, `updateTime desc` is the default behavior. Examples: `updateTime asc`, `updateTime`',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					announcementStates: z
						.array(
							z.enum([
								'ANNOUNCEMENT_STATE_UNSPECIFIED',
								'PUBLISHED',
								'DRAFT',
								'DELETED',
							]),
						)
						.optional()
						.describe(
							'Restriction on the `state` of announcements returned. If this argument is left unspecified, the default value is `PUBLISHED`.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.announcements.modifyAssignees': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the announcement.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: ModifyAnnouncementAssigneesBodySchema,
		})
		.strict(),
	'courses.announcements.patch': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the announcement.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the announcement to update. This field is required to do an update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the Announcement object. If a field that does not support empty values is included in the update mask and not set in the Announcement object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `text` * `state` * `scheduled_time`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Announcement.partial(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.create': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which to create the attachment. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. This authorization token is required for in-Classroom attachment creation but optional for partner-first attachment creation. Returns an error if not provided for partner-first attachment creation and the developer projects that created the attachment and its parent stream item do not match.",
						),
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnAttachmentCreateBodySchema,
		})
		.strict(),
	'courses.courseWork.addOnAttachments.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.get': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.list': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` whose attachments should be enumerated. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'The maximum number of attachments to return. The service may return fewer than this value. If unspecified, at most 20 attachments will be returned. The maximum value is 20; values above 20 will be coerced to 20.',
						),
					postId: z
						.string()
						.optional()
						.describe(
							'Optional. Identifier of the post under the course whose attachments to enumerate. Deprecated, use `item_id` instead.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'A page token, received from a previous `ListAddOnAttachments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAddOnAttachments` must match the call that provided the page token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.patch': z
		.object({
			pathParams: z
				.object({
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the post under which the attachment is attached.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachment` object. If a field that does not support empty values is included in the update mask and not set in the `AddOnAttachment` object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `teacher_view_uri` * `student_view_uri` * `student_work_review_uri` * `due_date` * `due_time` * `max_points`',
						),
					postId: z
						.string()
						.describe(
							'Required. Identifier of the post under which the attachment is attached.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.AddOnAttachment.partial(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.studentSubmissions.get': z
		.object({
			pathParams: z
				.object({
					submissionId: z
						.string()
						.describe('Required. Identifier of the student’s submission.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.studentSubmissions.list': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Required. Identifier of the `CourseWork` under which the attachment is attached.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the add-on attachment.'),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Optional. Maximum number of submissions to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'Optional. A page token, received from a previous `ListAddOnAttachmentStudentSubmissions` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAddOnAttachmentStudentSubmissions` must match the call that provided the page token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.addOnAttachments.studentSubmissions.patch': z
		.object({
			pathParams: z
				.object({
					submissionId: z
						.string()
						.describe("Required. Identifier of the student's submission."),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachmentStudentSubmission` object. The following fields may be specified by teachers: * `points_earned`',
						),
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnSubmissionUpdateBodySchema,
		})
		.strict(),
	'courses.courseWork.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: CourseWorkCreateBodySchema,
		})
		.strict(),
	'courses.courseWork.delete': z
		.object({
			pathParams: z
				.object({
					id: z
						.string()
						.describe(
							'Identifier of the course work to delete. This identifier is a Classroom-assigned identifier.',
						),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.get': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the course work.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.getAddOnContext': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					attachmentId: z
						.string()
						.optional()
						.describe(
							'Optional. The identifier of the attachment. This field is required for all requests except when the user is in the [Attachment Discovery iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/attachment-discovery-iframe).',
						),
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. The authorization token is required when neither of the following is true: * The add-on has attachments on the post. * The developer project issuing the request is the same project that created the post.",
						),
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					orderBy: z
						.string()
						.optional()
						.describe(
							'Optional sort ordering for results. A comma-separated list of fields with an optional sort direction keyword. Supported fields are `updateTime` and `dueDate`. Supported direction keywords are `asc` and `desc`. If not specified, `updateTime desc` is the default behavior. Examples: `dueDate asc,updateTime desc`, `updateTime,dueDate desc`',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					courseWorkStates: z
						.array(
							z.enum([
								'COURSE_WORK_STATE_UNSPECIFIED',
								'PUBLISHED',
								'DRAFT',
								'DELETED',
							]),
						)
						.optional()
						.describe(
							'Restriction on the work status to return. Only courseWork that matches is returned. If unspecified, items with a work status of `PUBLISHED` is returned.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.modifyAssignees': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the coursework.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: ModifyCourseWorkAssigneesBodySchema,
		})
		.strict(),
	'courses.courseWork.patch': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the course work.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the course work to update. This field is required to do an update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `CourseWork` object. If a field that does not support empty values is included in the update mask and not set in the `CourseWork` object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `description` * `state` * `due_date` * `due_time` * `max_points` * `scheduled_time` * `submission_modification_mode` * `topic_id` * `grading_period_id` * `learning_goals`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.CourseWork.partial(),
		})
		.strict(),
	'courses.courseWork.rubrics.create': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					courseWorkId: z
						.string()
						.describe('Required. Identifier of the course work.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: RubricCreateBodySchema,
		})
		.strict(),
	'courses.courseWork.rubrics.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					courseWorkId: z
						.string()
						.describe('Required. Identifier of the course work.'),
					id: z.string().describe('Required. Identifier of the rubric.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.rubrics.get': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Required. Identifier of the rubric.'),
					courseWorkId: z
						.string()
						.describe('Required. Identifier of the course work.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.rubrics.list': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					courseWorkId: z
						.string()
						.describe('Required. Identifier of the course work.'),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'The maximum number of rubrics to return. If unspecified, at most 1 rubric is returned. The maximum value is 1; values above 1 are coerced to 1.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.rubrics.patch': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Optional. Identifier of the rubric.'),
					courseWorkId: z
						.string()
						.describe('Required. Identifier of the course work.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Optional. Mask that identifies which fields on the rubric to update. This field is required to do an update. The update fails if invalid fields are specified. There are multiple options to define the criteria of a rubric: the `source_spreadsheet_id` and the `criteria` list. Only one of these can be used at a time to define a rubric. The rubric `criteria` list is fully replaced by the rubric criteria specified in the update request. For example, if a criterion or level is missing from the request, it is deleted. New criteria and levels are added and an ID is assigned. Existing criteria and levels retain the previously assigned ID if the ID is specified in the request. The following fields can be specified by teachers: * `criteria` * `source_spreadsheet_id`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Rubric.partial(),
		})
		.strict(),
	'courses.courseWork.studentSubmissions.get': z
		.object({
			pathParams: z
				.object({
					courseWorkId: z.string().describe('Identifier of the course work.'),
					id: z.string().describe('Identifier of the student submission.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.studentSubmissions.list': z
		.object({
			pathParams: z
				.object({
					courseWorkId: z
						.string()
						.describe(
							'Identifier of the student work to request. This may be set to the string literal `"-"` to request student work for all course work in the specified course.',
						),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					states: z
						.array(
							z.enum([
								'SUBMISSION_STATE_UNSPECIFIED',
								'NEW',
								'CREATED',
								'TURNED_IN',
								'RETURNED',
								'RECLAIMED_BY_STUDENT',
							]),
						)
						.optional()
						.describe(
							'Requested submission states. If specified, returned student submissions match one of the specified submission states.',
						),
					late: z
						.enum(['LATE_VALUES_UNSPECIFIED', 'LATE_ONLY', 'NOT_LATE_ONLY'])
						.optional()
						.describe(
							'Requested lateness value. If specified, returned student submissions are restricted by the requested value. If unspecified, submissions are returned regardless of `late` value.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					userId: z
						.string()
						.optional()
						.describe(
							'Optional argument to restrict returned student work to those owned by the student with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWork.studentSubmissions.modifyAttachments': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the student submission.'),
					courseWorkId: z.string().describe('Identifier of the course work.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.ModifyAttachmentsRequest,
		})
		.strict(),
	'courses.courseWork.studentSubmissions.patch': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the student submission.'),
					courseWorkId: z.string().describe('Identifier of the course work.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the student submission to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields may be specified by teachers: * `draft_grade` * `assigned_grade`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: StudentSubmissionUpdateBodySchema,
		})
		.strict(),
	'courses.courseWork.studentSubmissions.reclaim': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the student submission.'),
					courseWorkId: z.string().describe('Identifier of the course work.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.ReclaimStudentSubmissionRequest,
		})
		.strict(),
	'courses.courseWork.studentSubmissions.return': z
		.object({
			pathParams: z
				.object({
					courseWorkId: z.string().describe('Identifier of the course work.'),
					id: z.string().describe('Identifier of the student submission.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.ReturnStudentSubmissionRequest,
		})
		.strict(),
	'courses.courseWork.studentSubmissions.turnIn': z
		.object({
			pathParams: z
				.object({
					courseWorkId: z.string().describe('Identifier of the course work.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the student submission.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.TurnInStudentSubmissionRequest,
		})
		.strict(),
	'courses.courseWorkMaterials.addOnAttachments.create': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which to create the attachment. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. This authorization token is required for in-Classroom attachment creation but optional for partner-first attachment creation. Returns an error if not provided for partner-first attachment creation and the developer projects that created the attachment and its parent stream item do not match.",
						),
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnAttachmentCreateBodySchema,
		})
		.strict(),
	'courses.courseWorkMaterials.addOnAttachments.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.addOnAttachments.get': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.addOnAttachments.list': z
		.object({
			pathParams: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` whose attachments should be enumerated. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					pageToken: z
						.string()
						.optional()
						.describe(
							'A page token, received from a previous `ListAddOnAttachments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAddOnAttachments` must match the call that provided the page token.',
						),
					postId: z
						.string()
						.optional()
						.describe(
							'Optional. Identifier of the post under the course whose attachments to enumerate. Deprecated, use `item_id` instead.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'The maximum number of attachments to return. The service may return fewer than this value. If unspecified, at most 20 attachments will be returned. The maximum value is 20; values above 20 will be coerced to 20.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.addOnAttachments.patch': z
		.object({
			pathParams: z
				.object({
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the post under which the attachment is attached.',
						),
				})
				.strict(),
			query: z
				.object({
					postId: z
						.string()
						.describe(
							'Required. Identifier of the post under which the attachment is attached.',
						),
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachment` object. If a field that does not support empty values is included in the update mask and not set in the `AddOnAttachment` object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `teacher_view_uri` * `student_view_uri` * `student_work_review_uri` * `due_date` * `due_time` * `max_points`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.AddOnAttachment.partial(),
		})
		.strict(),
	'courses.courseWorkMaterials.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: CourseWorkMaterialCreateBodySchema,
		})
		.strict(),
	'courses.courseWorkMaterials.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z
						.string()
						.describe(
							'Identifier of the course work material to delete. This identifier is a Classroom-assigned identifier.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.get': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the course work material.'),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.getAddOnContext': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
				})
				.strict(),
			query: z
				.object({
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. The authorization token is required when neither of the following is true: * The add-on has attachments on the post. * The developer project issuing the request is the same project that created the post.",
						),
					postId: z
						.string()
						.optional()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					attachmentId: z
						.string()
						.optional()
						.describe(
							'Optional. The identifier of the attachment. This field is required for all requests except when the user is in the [Attachment Discovery iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/attachment-discovery-iframe).',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					materialLink: z
						.string()
						.optional()
						.describe(
							'Optional filtering for course work material with at least one link material whose URL partially matches the provided string.',
						),
					orderBy: z
						.string()
						.optional()
						.describe(
							'Optional sort ordering for results. A comma-separated list of fields with an optional sort direction keyword. Supported field is `updateTime`. Supported direction keywords are `asc` and `desc`. If not specified, `updateTime desc` is the default behavior. Examples: `updateTime asc`, `updateTime`',
						),
					materialDriveId: z
						.string()
						.optional()
						.describe(
							'Optional filtering for course work material with at least one Drive material whose ID matches the provided string. If `material_link` is also specified, course work material must have materials matching both filters.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					courseWorkMaterialStates: z
						.array(
							z.enum([
								'COURSEWORK_MATERIAL_STATE_UNSPECIFIED',
								'PUBLISHED',
								'DRAFT',
								'DELETED',
							]),
						)
						.optional()
						.describe(
							'Restriction on the work status to return. Only course work material that matches is returned. If unspecified, items with a work status of `PUBLISHED` is returned.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.courseWorkMaterials.patch': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the course work material.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the course work material to update. This field is required to do an update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the course work material object. If a field that does not support empty values is included in the update mask and not set in the course work material object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `description` * `state` * `scheduled_time` * `topic_id` * `learning_goals`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.CourseWorkMaterial.partial(),
		})
		.strict(),
	'courses.create': z
		.object({
			pathParams: z.object({}).strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Course,
		})
		.strict(),
	'courses.delete': z
		.object({
			pathParams: z
				.object({
					id: z
						.string()
						.describe(
							'Identifier of the course to delete. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.get': z
		.object({
			pathParams: z
				.object({
					id: z
						.string()
						.describe(
							'Identifier of the course to return. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.getGradingPeriodSettings': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.list': z
		.object({
			pathParams: z.object({}).strict(),
			query: z
				.object({
					teacherId: z
						.string()
						.optional()
						.describe(
							'Restricts returned courses to those having a teacher with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user If specified, `student_id` must be empty.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					courseStates: z
						.array(
							z.enum([
								'COURSE_STATE_UNSPECIFIED',
								'ACTIVE',
								'ARCHIVED',
								'PROVISIONED',
								'DECLINED',
								'SUSPENDED',
							]),
						)
						.optional()
						.describe(
							'Restricts returned courses to those in one of the specified states. If unspecified, Courses in any state are returned.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					studentId: z
						.string()
						.optional()
						.describe(
							'Restricts returned courses to those having a student with the specified identifier. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user If specified, `teacher_id` must be empty.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.patch': z
		.object({
			pathParams: z
				.object({
					id: z
						.string()
						.describe(
							'Identifier of the course to update. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the course to update. This field is required to do an update. The update will fail if invalid fields are specified. The following fields are valid: * `courseState` * `description` * `descriptionHeading` * `name` * `ownerId` * `room` * `section` * `subject` * `learningStandardSettings` * `levels` Note: patches to ownerId are treated as being effective immediately, but in practice it may take some time for the ownership transfer of all affected resources to complete. When set in a query parameter, this field should be specified as `updateMask=,,...`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Course.partial(),
		})
		.strict(),
	'courses.posts.addOnAttachments.create': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
				})
				.strict(),
			query: z
				.object({
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. This authorization token is required for in-Classroom attachment creation but optional for partner-first attachment creation. Returns an error if not provided for partner-first attachment creation and the developer projects that created the attachment and its parent stream item do not match.",
						),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which to create the attachment. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnAttachmentCreateBodySchema,
		})
		.strict(),
	'courses.posts.addOnAttachments.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
				})
				.strict(),
			query: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.posts.addOnAttachments.get': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.posts.addOnAttachments.list': z
		.object({
			pathParams: z
				.object({
					postId: z
						.string()
						.describe(
							'Optional. Identifier of the post under the course whose attachments to enumerate. Deprecated, use `item_id` instead.',
						),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'The maximum number of attachments to return. The service may return fewer than this value. If unspecified, at most 20 attachments will be returned. The maximum value is 20; values above 20 will be coerced to 20.',
						),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` whose attachments should be enumerated. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'A page token, received from a previous `ListAddOnAttachments` call. Provide this to retrieve the subsequent page. When paginating, all other parameters provided to `ListAddOnAttachments` must match the call that provided the page token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.posts.addOnAttachments.patch': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					postId: z
						.string()
						.describe(
							'Required. Identifier of the post under which the attachment is attached.',
						),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					itemId: z
						.string()
						.optional()
						.describe(
							'Identifier of the post under which the attachment is attached.',
						),
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachment` object. If a field that does not support empty values is included in the update mask and not set in the `AddOnAttachment` object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified by teachers: * `title` * `teacher_view_uri` * `student_view_uri` * `student_work_review_uri` * `due_date` * `due_time` * `max_points`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.AddOnAttachment.partial(),
		})
		.strict(),
	'courses.posts.addOnAttachments.studentSubmissions.get': z
		.object({
			pathParams: z
				.object({
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
					submissionId: z
						.string()
						.describe('Required. Identifier of the student’s submission.'),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.posts.addOnAttachments.studentSubmissions.patch': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					submissionId: z
						.string()
						.describe("Required. Identifier of the student's submission."),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
					attachmentId: z
						.string()
						.describe('Required. Identifier of the attachment.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the attachment to update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the `AddOnAttachmentStudentSubmission` object. The following fields may be specified by teachers: * `points_earned`',
						),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: AddOnSubmissionUpdateBodySchema,
		})
		.strict(),
	'courses.posts.getAddOnContext': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Required. Identifier of the course.'),
					postId: z
						.string()
						.describe('Optional. Deprecated, use `item_id` instead.'),
				})
				.strict(),
			query: z
				.object({
					addOnToken: z
						.string()
						.optional()
						.describe(
							"Optional. Token that authorizes the request. The token is passed as a query parameter when the user is redirected from Classroom to the add-on's URL. The authorization token is required when neither of the following is true: * The add-on has attachments on the post. * The developer project issuing the request is the same project that created the post.",
						),
					itemId: z
						.string()
						.describe(
							'Identifier of the `Announcement`, `CourseWork`, or `CourseWorkMaterial` under which the attachment is attached. This field is required, but is not marked as such while we are migrating from post_id.',
						),
					attachmentId: z
						.string()
						.optional()
						.describe(
							'Optional. The identifier of the attachment. This field is required for all requests except when the user is in the [Attachment Discovery iframe](https://developers.google.com/workspace/classroom/add-ons/get-started/iframes/attachment-discovery-iframe).',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.studentGroups.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: StudentGroupCreateBodySchema,
		})
		.strict(),
	'courses.studentGroups.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Required. The identifier of the course containing the student group to delete.',
						),
					id: z
						.string()
						.describe(
							'Required. The identifier of the student group to delete.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.studentGroups.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum, which is currently set to 75 items. The server may return fewer than the specified number of results.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.studentGroups.patch': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Required. Identifier of the student group.'),
					courseId: z.string().describe('Required. Identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Required. Mask that identifies which fields on the student group to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields can be specified by teachers: * `title`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.StudentGroup.partial(),
		})
		.strict(),
	'courses.studentGroups.studentGroupMembers.create': z
		.object({
			pathParams: z
				.object({
					studentGroupId: z
						.string()
						.describe('Required. The identifier of the student group.'),
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: StudentGroupMemberCreateBodySchema,
		})
		.strict(),
	'courses.studentGroups.studentGroupMembers.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Required. The identifier of the course containing the relevant student group.',
						),
					studentGroupId: z
						.string()
						.describe(
							'Required. The identifier of the student group containing the student group member to delete.',
						),
					userId: z
						.string()
						.describe(
							'Required. The identifier of the student group member to delete.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.studentGroups.studentGroupMembers.list': z
		.object({
			pathParams: z
				.object({
					studentGroupId: z
						.string()
						.describe('Required. The identifier of the student group.'),
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.students.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course to create the student in. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					enrollmentCode: z
						.string()
						.optional()
						.describe(
							'Enrollment code of the course to create the student in. This code is required if userId corresponds to the requesting user; it may be omitted if the requesting user has administrative permissions to create students for any user.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: StudentCreateBodySchema,
		})
		.strict(),
	'courses.students.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					userId: z
						.string()
						.describe(
							'Identifier of the student to delete. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.students.get': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					userId: z
						.string()
						.describe(
							'Identifier of the student to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.students.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. The default is 30 if unspecified or `0`. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.teachers.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: TeacherCreateBodySchema,
		})
		.strict(),
	'courses.teachers.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					userId: z
						.string()
						.describe(
							'Identifier of the teacher to delete. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.teachers.get': z
		.object({
			pathParams: z
				.object({
					userId: z
						.string()
						.describe(
							'Identifier of the teacher to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.teachers.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. The default is 30 if unspecified or `0`. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.topics.create': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: TopicCreateBodySchema,
		})
		.strict(),
	'courses.topics.delete': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the topic to delete.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.topics.get': z
		.object({
			pathParams: z
				.object({
					courseId: z.string().describe('Identifier of the course.'),
					id: z.string().describe('Identifier of the topic.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.topics.list': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'courses.topics.patch': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe(
							'Identifier of the course. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
					id: z.string().describe('Identifier of the topic.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the topic to update. This field is required to do an update. The update fails if invalid fields are specified. If a field supports empty values, it can be cleared by specifying it in the update mask and not in the Topic object. If a field that does not support empty values is included in the update mask and not set in the Topic object, an `INVALID_ARGUMENT` error is returned. The following fields may be specified: * `name`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Topic.partial(),
		})
		.strict(),
	'courses.update': z
		.object({
			pathParams: z
				.object({
					id: z
						.string()
						.describe(
							'Identifier of the course to update. This identifier can be either the Classroom-assigned identifier or an alias.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.Course,
		})
		.strict(),
	'courses.updateGradingPeriodSettings': z
		.object({
			pathParams: z
				.object({
					courseId: z
						.string()
						.describe('Required. The identifier of the course.'),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.optional()
						.describe(
							'Mask that identifies which fields in the GradingPeriodSettings to update. The GradingPeriodSettings `grading_periods` list will be fully replaced by the grading periods specified in the update request. For example: * Grading periods included in the list without an ID are considered additions, and a new ID will be assigned when the request is made. * Grading periods that currently exist, but are missing from the request will be considered deletions. * Grading periods with an existing ID and modified data are considered edits. Unmodified data will be left as is. * Grading periods included with an unknown ID will result in an error. The following fields may be specified: * `grading_periods` * `apply_to_existing_coursework`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GoogleClassroomModelSchemas.GradingPeriodSettings.partial(),
		})
		.strict(),
	'invitations.accept': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the invitation to accept.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'invitations.create': z
		.object({
			pathParams: z.object({}).strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: InvitationCreateBodySchema,
		})
		.strict(),
	'invitations.delete': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the invitation to delete.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'invitations.get': z
		.object({
			pathParams: z
				.object({
					id: z.string().describe('Identifier of the invitation to return.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'invitations.list': z
		.object({
			pathParams: z.object({}).strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. The default is 500 if unspecified or `0`. The server may return fewer than the specified number of results.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					userId: z
						.string()
						.optional()
						.describe(
							'Restricts returned invitations to those for a specific user. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
					courseId: z
						.string()
						.optional()
						.describe(
							'Restricts returned invitations to those for a course with the specified identifier.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'registrations.create': z
		.object({
			pathParams: z.object({}).strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: RegistrationCreateBodySchema,
		})
		.strict(),
	'registrations.delete': z
		.object({
			pathParams: z
				.object({
					registrationId: z
						.string()
						.describe(
							'The `registration_id` of the `Registration` to be deleted.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.get': z
		.object({
			pathParams: z
				.object({
					userId: z
						.string()
						.describe(
							'Identifier of the profile to return. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.guardianInvitations.create': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe('ID of the student (in standard format)'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GuardianInvitationCreateBodySchema,
		})
		.strict(),
	'userProfiles.guardianInvitations.get': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe(
							'The ID of the student whose guardian invitation is being requested.',
						),
					invitationId: z
						.string()
						.describe(
							'The `id` field of the `GuardianInvitation` being requested.',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.guardianInvitations.list': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe(
							'The ID of the student whose guardian invitations are to be returned. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user * the string literal `"-"`, indicating that results should be returned for all students that the requesting user is permitted to view guardian invitations.',
						),
				})
				.strict(),
			query: z
				.object({
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					states: z
						.array(
							z.enum([
								'GUARDIAN_INVITATION_STATE_UNSPECIFIED',
								'PENDING',
								'COMPLETE',
							]),
						)
						.optional()
						.describe(
							'If specified, only results with the specified `state` values are returned. Otherwise, results with a `state` of `PENDING` are returned.',
						),
					invitedEmailAddress: z
						.string()
						.optional()
						.describe(
							'If specified, only results with the specified `invited_email_address` are returned.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.guardianInvitations.patch': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe(
							'The ID of the student whose guardian invitation is to be modified.',
						),
					invitationId: z
						.string()
						.describe(
							'The `id` field of the `GuardianInvitation` to be modified.',
						),
				})
				.strict(),
			query: z
				.object({
					updateMask: z
						.string()
						.describe(
							'Mask that identifies which fields on the course to update. This field is required to do an update. The update fails if invalid fields are specified. The following fields are valid: * `state` When set in a query parameter, this field should be specified as `updateMask=,,...`',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: GuardianInvitationUpdateBodySchema,
		})
		.strict(),
	'userProfiles.guardians.delete': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe(
							'The student whose guardian is to be deleted. One of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
					guardianId: z.string().describe('The `id` field from a `Guardian`.'),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.guardians.get': z
		.object({
			pathParams: z
				.object({
					guardianId: z.string().describe('The `id` field from a `Guardian`.'),
					studentId: z
						.string()
						.describe(
							'The student whose guardian is being requested. One of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user',
						),
				})
				.strict(),
			query: z
				.object({
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
	'userProfiles.guardians.list': z
		.object({
			pathParams: z
				.object({
					studentId: z
						.string()
						.describe(
							'Filter results by the student who the guardian is linked to. The identifier can be one of the following: * the numeric identifier for the user * the email address of the user * the string literal `"me"`, indicating the requesting user * the string literal `"-"`, indicating that results should be returned for all students that the requesting user has access to view.',
						),
				})
				.strict(),
			query: z
				.object({
					invitedEmailAddress: z
						.string()
						.optional()
						.describe(
							'Filter results by the email address that the original invitation was sent to, resulting in this guardian link. This filter can only be used by domain administrators.',
						),
					pageToken: z
						.string()
						.optional()
						.describe(
							'nextPageToken value returned from a previous list call, indicating that the subsequent page of results should be returned. The list request must be otherwise identical to the one that resulted in this token.',
						),
					pageSize: z
						.number()
						.int()
						.optional()
						.describe(
							'Maximum number of items to return. Zero or unspecified indicates that the server may assign a maximum. The server may return fewer than the specified number of results.',
						),
					fields: z
						.string()
						.optional()
						.describe('Field mask for partial responses.'),
					prettyPrint: z
						.boolean()
						.optional()
						.describe('Whether the response uses pretty-printed JSON.'),
					quotaUser: z
						.string()
						.max(40)
						.optional()
						.describe(
							'Opaque per-user quota identifier (maximum 40 characters).',
						),
					alt: z
						.literal('json')
						.optional()
						.describe(
							'JSON response format; media and protobuf formats are not supported.',
						),
				})
				.strict(),
			body: z.never().optional(),
		})
		.strict(),
} as const;

export const GoogleClassroomEndpointOutputSchemas = {
	'courses.aliases.create': GoogleClassroomResponseSchemas.CourseAlias,
	'courses.aliases.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.aliases.list':
		GoogleClassroomResponseSchemas.ListCourseAliasesResponse,
	'courses.announcements.addOnAttachments.create':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.announcements.addOnAttachments.delete':
		GoogleClassroomResponseSchemas.Empty,
	'courses.announcements.addOnAttachments.get':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.announcements.addOnAttachments.list':
		GoogleClassroomResponseSchemas.ListAddOnAttachmentsResponse,
	'courses.announcements.addOnAttachments.patch':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.announcements.create': GoogleClassroomResponseSchemas.Announcement,
	'courses.announcements.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.announcements.get': GoogleClassroomResponseSchemas.Announcement,
	'courses.announcements.getAddOnContext':
		GoogleClassroomResponseSchemas.AddOnContext,
	'courses.announcements.list':
		GoogleClassroomResponseSchemas.ListAnnouncementsResponse,
	'courses.announcements.modifyAssignees':
		GoogleClassroomResponseSchemas.Announcement,
	'courses.announcements.patch': GoogleClassroomResponseSchemas.Announcement,
	'courses.courseWork.addOnAttachments.create':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWork.addOnAttachments.delete':
		GoogleClassroomResponseSchemas.Empty,
	'courses.courseWork.addOnAttachments.get':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWork.addOnAttachments.list':
		GoogleClassroomResponseSchemas.ListAddOnAttachmentsResponse,
	'courses.courseWork.addOnAttachments.patch':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWork.addOnAttachments.studentSubmissions.get':
		GoogleClassroomResponseSchemas.AddOnAttachmentStudentSubmission,
	'courses.courseWork.addOnAttachments.studentSubmissions.list':
		GoogleClassroomResponseSchemas.ListAddOnAttachmentStudentSubmissionsResponse,
	'courses.courseWork.addOnAttachments.studentSubmissions.patch':
		GoogleClassroomResponseSchemas.AddOnAttachmentStudentSubmission,
	'courses.courseWork.create': GoogleClassroomResponseSchemas.CourseWork,
	'courses.courseWork.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.courseWork.get': GoogleClassroomResponseSchemas.CourseWork,
	'courses.courseWork.getAddOnContext':
		GoogleClassroomResponseSchemas.AddOnContext,
	'courses.courseWork.list':
		GoogleClassroomResponseSchemas.ListCourseWorkResponse,
	'courses.courseWork.modifyAssignees':
		GoogleClassroomResponseSchemas.CourseWork,
	'courses.courseWork.patch': GoogleClassroomResponseSchemas.CourseWork,
	'courses.courseWork.rubrics.create': GoogleClassroomResponseSchemas.Rubric,
	'courses.courseWork.rubrics.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.courseWork.rubrics.get': GoogleClassroomResponseSchemas.Rubric,
	'courses.courseWork.rubrics.list':
		GoogleClassroomResponseSchemas.ListRubricsResponse,
	'courses.courseWork.rubrics.patch': GoogleClassroomResponseSchemas.Rubric,
	'courses.courseWork.studentSubmissions.get':
		GoogleClassroomResponseSchemas.StudentSubmission,
	'courses.courseWork.studentSubmissions.list':
		GoogleClassroomResponseSchemas.ListStudentSubmissionsResponse,
	'courses.courseWork.studentSubmissions.modifyAttachments':
		GoogleClassroomResponseSchemas.StudentSubmission,
	'courses.courseWork.studentSubmissions.patch':
		GoogleClassroomResponseSchemas.StudentSubmission,
	'courses.courseWork.studentSubmissions.reclaim':
		GoogleClassroomResponseSchemas.Empty,
	'courses.courseWork.studentSubmissions.return':
		GoogleClassroomResponseSchemas.Empty,
	'courses.courseWork.studentSubmissions.turnIn':
		GoogleClassroomResponseSchemas.Empty,
	'courses.courseWorkMaterials.addOnAttachments.create':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWorkMaterials.addOnAttachments.delete':
		GoogleClassroomResponseSchemas.Empty,
	'courses.courseWorkMaterials.addOnAttachments.get':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWorkMaterials.addOnAttachments.list':
		GoogleClassroomResponseSchemas.ListAddOnAttachmentsResponse,
	'courses.courseWorkMaterials.addOnAttachments.patch':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.courseWorkMaterials.create':
		GoogleClassroomResponseSchemas.CourseWorkMaterial,
	'courses.courseWorkMaterials.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.courseWorkMaterials.get':
		GoogleClassroomResponseSchemas.CourseWorkMaterial,
	'courses.courseWorkMaterials.getAddOnContext':
		GoogleClassroomResponseSchemas.AddOnContext,
	'courses.courseWorkMaterials.list':
		GoogleClassroomResponseSchemas.ListCourseWorkMaterialResponse,
	'courses.courseWorkMaterials.patch':
		GoogleClassroomResponseSchemas.CourseWorkMaterial,
	'courses.create': GoogleClassroomResponseSchemas.Course,
	'courses.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.get': GoogleClassroomResponseSchemas.Course,
	'courses.getGradingPeriodSettings':
		GoogleClassroomResponseSchemas.GradingPeriodSettings,
	'courses.list': GoogleClassroomResponseSchemas.ListCoursesResponse,
	'courses.patch': GoogleClassroomResponseSchemas.Course,
	'courses.posts.addOnAttachments.create':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.posts.addOnAttachments.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.posts.addOnAttachments.get':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.posts.addOnAttachments.list':
		GoogleClassroomResponseSchemas.ListAddOnAttachmentsResponse,
	'courses.posts.addOnAttachments.patch':
		GoogleClassroomResponseSchemas.AddOnAttachment,
	'courses.posts.addOnAttachments.studentSubmissions.get':
		GoogleClassroomResponseSchemas.AddOnAttachmentStudentSubmission,
	'courses.posts.addOnAttachments.studentSubmissions.patch':
		GoogleClassroomResponseSchemas.AddOnAttachmentStudentSubmission,
	'courses.posts.getAddOnContext': GoogleClassroomResponseSchemas.AddOnContext,
	'courses.studentGroups.create': GoogleClassroomResponseSchemas.StudentGroup,
	'courses.studentGroups.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.studentGroups.list':
		GoogleClassroomResponseSchemas.ListStudentGroupsResponse,
	'courses.studentGroups.patch': GoogleClassroomResponseSchemas.StudentGroup,
	'courses.studentGroups.studentGroupMembers.create':
		GoogleClassroomResponseSchemas.StudentGroupMember,
	'courses.studentGroups.studentGroupMembers.delete':
		GoogleClassroomResponseSchemas.Empty,
	'courses.studentGroups.studentGroupMembers.list':
		GoogleClassroomResponseSchemas.ListStudentGroupMembersResponse,
	'courses.students.create': GoogleClassroomResponseSchemas.Student,
	'courses.students.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.students.get': GoogleClassroomResponseSchemas.Student,
	'courses.students.list': GoogleClassroomResponseSchemas.ListStudentsResponse,
	'courses.teachers.create': GoogleClassroomResponseSchemas.Teacher,
	'courses.teachers.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.teachers.get': GoogleClassroomResponseSchemas.Teacher,
	'courses.teachers.list': GoogleClassroomResponseSchemas.ListTeachersResponse,
	'courses.topics.create': GoogleClassroomResponseSchemas.Topic,
	'courses.topics.delete': GoogleClassroomResponseSchemas.Empty,
	'courses.topics.get': GoogleClassroomResponseSchemas.Topic,
	'courses.topics.list': GoogleClassroomResponseSchemas.ListTopicResponse,
	'courses.topics.patch': GoogleClassroomResponseSchemas.Topic,
	'courses.update': GoogleClassroomResponseSchemas.Course,
	'courses.updateGradingPeriodSettings':
		GoogleClassroomResponseSchemas.GradingPeriodSettings,
	'invitations.accept': GoogleClassroomResponseSchemas.Empty,
	'invitations.create': GoogleClassroomResponseSchemas.Invitation,
	'invitations.delete': GoogleClassroomResponseSchemas.Empty,
	'invitations.get': GoogleClassroomResponseSchemas.Invitation,
	'invitations.list': GoogleClassroomResponseSchemas.ListInvitationsResponse,
	'registrations.create': GoogleClassroomResponseSchemas.Registration,
	'registrations.delete': GoogleClassroomResponseSchemas.Empty,
	'userProfiles.get': GoogleClassroomResponseSchemas.UserProfile,
	'userProfiles.guardianInvitations.create':
		GoogleClassroomResponseSchemas.GuardianInvitation,
	'userProfiles.guardianInvitations.get':
		GoogleClassroomResponseSchemas.GuardianInvitation,
	'userProfiles.guardianInvitations.list':
		GoogleClassroomResponseSchemas.ListGuardianInvitationsResponse,
	'userProfiles.guardianInvitations.patch':
		GoogleClassroomResponseSchemas.GuardianInvitation,
	'userProfiles.guardians.delete': GoogleClassroomResponseSchemas.Empty,
	'userProfiles.guardians.get': GoogleClassroomResponseSchemas.Guardian,
	'userProfiles.guardians.list':
		GoogleClassroomResponseSchemas.ListGuardiansResponse,
} as const;

export type GoogleClassroomEndpointInputs = {
	[K in GoogleClassroomOperationId]: z.infer<
		(typeof GoogleClassroomEndpointInputSchemas)[K]
	>;
};
export type GoogleClassroomEndpointOutputs = {
	[K in GoogleClassroomOperationId]: z.infer<
		(typeof GoogleClassroomEndpointOutputSchemas)[K]
	>;
};
