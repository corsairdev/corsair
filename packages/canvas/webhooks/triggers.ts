import { logEventFromContext } from 'corsair/core';
import type { CanvasWebhooks } from '../index';
import { createCanvasMatch, verifyCanvasWebhookSignature } from './types';

function createTriggerHandler<K extends keyof CanvasWebhooks>(
	eventType: string,
	eventPath: string,
): CanvasWebhooks[K] {
	return {
		match: createCanvasMatch(eventType),
		handler: async (ctx, request) => {
			const verification = verifyCanvasWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}

			const event = request.payload;
			await logEventFromContext(ctx, eventPath, { ...event }, 'completed');

			return { success: true, data: event };
		},
	} as CanvasWebhooks[K];
}

export const assignmentGraded = createTriggerHandler<'assignmentGraded'>(
	'grade_change',
	'canvas.webhook.assignmentGraded',
);

export const newAssignmentSubmission =
	createTriggerHandler<'newAssignmentSubmission'>(
		'submission_created',
		'canvas.webhook.newAssignmentSubmission',
	);

export const newDiscussionMessage =
	createTriggerHandler<'newDiscussionMessage'>(
		'discussion_entry_created',
		'canvas.webhook.newDiscussionMessage',
	);

export const newDiscussionTopic = createTriggerHandler<'newDiscussionTopic'>(
	'discussion_topic_created',
	'canvas.webhook.newDiscussionTopic',
);

export const newFileUploaded = createTriggerHandler<'newFileUploaded'>(
	'attachment_created',
	'canvas.webhook.newFileUploaded',
);

export const newCourseCreated = createTriggerHandler<'newCourseCreated'>(
	'course_created',
	'canvas.webhook.newCourseCreated',
);
