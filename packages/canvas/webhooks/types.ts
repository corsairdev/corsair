import crypto from 'node:crypto';
import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { z } from 'zod';

/** Canvas Live Events / Data Services payload (plus a simple `type` form). */
export const CanvasWebhookPayloadSchema = z
	.object({
		type: z.string().optional(),
		created_at: z.string().optional(),
		data: z.record(z.string(), z.unknown()).optional(),
		metadata: z.record(z.string(), z.unknown()).optional(),
		body: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

export type CanvasWebhookPayload = z.infer<typeof CanvasWebhookPayloadSchema>;

export const AssignmentGradedEventSchema = CanvasWebhookPayloadSchema;
export const NewAssignmentSubmissionEventSchema = CanvasWebhookPayloadSchema;
export const NewDiscussionMessageEventSchema = CanvasWebhookPayloadSchema;
export const NewDiscussionTopicEventSchema = CanvasWebhookPayloadSchema;
export const NewFileUploadedEventSchema = CanvasWebhookPayloadSchema;
export const NewCourseCreatedEventSchema = CanvasWebhookPayloadSchema;

export type AssignmentGradedEvent = z.infer<typeof AssignmentGradedEventSchema>;
export type NewAssignmentSubmissionEvent = z.infer<
	typeof NewAssignmentSubmissionEventSchema
>;
export type NewDiscussionMessageEvent = z.infer<
	typeof NewDiscussionMessageEventSchema
>;
export type NewDiscussionTopicEvent = z.infer<
	typeof NewDiscussionTopicEventSchema
>;
export type NewFileUploadedEvent = z.infer<typeof NewFileUploadedEventSchema>;
export type NewCourseCreatedEvent = z.infer<typeof NewCourseCreatedEventSchema>;

export type CanvasWebhookOutputs = {
	assignmentGraded: AssignmentGradedEvent;
	newAssignmentSubmission: NewAssignmentSubmissionEvent;
	newDiscussionMessage: NewDiscussionMessageEvent;
	newDiscussionTopic: NewDiscussionTopicEvent;
	newFileUploaded: NewFileUploadedEvent;
	newCourseCreated: NewCourseCreatedEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			const parsed = JSON.parse(body);
			return parsed !== null &&
				typeof parsed === 'object' &&
				!Array.isArray(parsed)
				? (parsed as Record<string, unknown>)
				: null;
		} catch {
			return null;
		}
	}
	return body !== null && typeof body === 'object' && !Array.isArray(body)
		? (body as Record<string, unknown>)
		: null;
}

function eventNameFromBody(body: Record<string, unknown>): string | null {
	if (typeof body.type === 'string') return body.type;
	const metadata = body.metadata;
	if (
		metadata !== null &&
		typeof metadata === 'object' &&
		!Array.isArray(metadata) &&
		typeof (metadata as Record<string, unknown>).event_name === 'string'
	) {
		return (metadata as Record<string, unknown>).event_name as string;
	}
	return null;
}

export function createCanvasMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (parsedBody === null) return false;
		return eventNameFromBody(parsedBody) === eventType;
	};
}

export function verifyCanvasWebhookSignature(
	request: WebhookRequest<CanvasWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const header = request.headers['x-canvas-signature'];
	const signature = Array.isArray(header) ? header[0] : header;
	if (!signature) {
		return { valid: false, error: 'Missing x-canvas-signature header' };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	if (typeof request.rawBody !== 'string') {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	try {
		const digest = crypto
			.createHmac('sha256', secret)
			.update(request.rawBody)
			.digest('base64');

		const expected = Buffer.from(digest);
		const actual = Buffer.from(signature);
		if (
			expected.length !== actual.length ||
			!crypto.timingSafeEqual(expected, actual)
		) {
			return { valid: false, error: 'Invalid signature' };
		}
		return { valid: true };
	} catch {
		return { valid: false, error: 'Failed to verify signature' };
	}
}
