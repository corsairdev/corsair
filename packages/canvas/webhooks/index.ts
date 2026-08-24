import {
	assignmentGraded,
	newAssignmentSubmission,
	newCourseCreated,
	newDiscussionMessage,
	newDiscussionTopic,
	newFileUploaded,
} from './triggers';

export const CanvasWebhookHandlers = {
	assignmentGraded,
	newAssignmentSubmission,
	newDiscussionMessage,
	newDiscussionTopic,
	newFileUploaded,
	newCourseCreated,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
