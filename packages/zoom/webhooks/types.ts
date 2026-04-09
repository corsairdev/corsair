import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSha256Signature } from 'corsair/http';
import { z } from 'zod';

const ZoomMeetingObjectSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.string().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		start_time: z.string().optional(),
		duration: z.number().optional(),
		timezone: z.string().optional(),
	})
	.passthrough();

const ZoomParticipantObjectSchema = z
	.object({
		user_id: z.string().optional(),
		user_name: z.string().optional(),
		id: z.string().optional(),
		join_time: z.string().optional(),
		leave_time: z.string().optional(),
		leave_reason: z.string().optional(),
	})
	.passthrough();

const ZoomWebinarObjectSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.string().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		start_time: z.string().optional(),
		duration: z.number().optional(),
		timezone: z.string().optional(),
	})
	.passthrough();

const ZoomRecordingObjectSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.number().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		start_time: z.string().optional(),
		timezone: z.string().optional(),
		duration: z.number().optional(),
		total_size: z.number().optional(),
		recording_count: z.number().optional(),
		share_url: z.string().optional(),
		password: z.string().optional(),
		recording_files: z
			.array(
				z
					.object({
						id: z.string().optional(),
						meeting_id: z.string().optional(),
						recording_start: z.string().optional(),
						recording_end: z.string().optional(),
						file_type: z.string().optional(),
						file_size: z.number().optional(),
						play_url: z.string().optional(),
						download_url: z.string().optional(),
						status: z.string().optional(),
						recording_type: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const ZoomPayloadBaseSchema = z.object({
	account_id: z.string().optional(),
	// Use unknown for the object to allow for any properties
	object: z.record(z.unknown()),
});

export const MeetingCreatedPayloadSchema = z.object({
	event: z.literal('meeting.created'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		operator: z.string().optional(),
		operator_id: z.string().optional(),
		object: ZoomMeetingObjectSchema,
	}),
});
export type MeetingCreatedEvent = z.infer<typeof MeetingCreatedPayloadSchema>;

export const MeetingCancelledPayloadSchema = z.object({
	event: z.literal('meeting.deleted'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		operator: z.string().optional(),
		operator_id: z.string().optional(),
		object: ZoomMeetingObjectSchema,
	}),
});
export type MeetingCancelledEvent = z.infer<
	typeof MeetingCancelledPayloadSchema
>;

export const MeetingStartedPayloadSchema = z.object({
	event: z.literal('meeting.started'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomMeetingObjectSchema,
	}),
});
export type MeetingStartedEvent = z.infer<typeof MeetingStartedPayloadSchema>;

export const MeetingEndedPayloadSchema = z.object({
	event: z.literal('meeting.ended'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomMeetingObjectSchema,
	}),
});
export type MeetingEndedEvent = z.infer<typeof MeetingEndedPayloadSchema>;

export const MeetingParticipantJoinedPayloadSchema = z.object({
	event: z.literal('meeting.participant_joined'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomMeetingObjectSchema.extend({
			participant: ZoomParticipantObjectSchema.optional(),
		}),
	}),
});
export type MeetingParticipantJoinedEvent = z.infer<
	typeof MeetingParticipantJoinedPayloadSchema
>;

export const MeetingParticipantLeftPayloadSchema = z.object({
	event: z.literal('meeting.participant_left'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomMeetingObjectSchema.extend({
			participant: ZoomParticipantObjectSchema.optional(),
		}),
	}),
});
export type MeetingParticipantLeftEvent = z.infer<
	typeof MeetingParticipantLeftPayloadSchema
>;

export const RecordingCompletedPayloadSchema = z.object({
	event: z.literal('recording.completed'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomRecordingObjectSchema,
	}),
});
export type RecordingCompletedEvent = z.infer<
	typeof RecordingCompletedPayloadSchema
>;

export const WebinarStartedPayloadSchema = z.object({
	event: z.literal('webinar.started'),
	event_ts: z.number().optional(),
	payload: ZoomPayloadBaseSchema.extend({
		object: ZoomWebinarObjectSchema,
	}),
});
export type WebinarStartedEvent = z.infer<typeof WebinarStartedPayloadSchema>;

export type ZoomWebhookOutputs = {
	meetingCreated: MeetingCreatedEvent;
	meetingCancelled: MeetingCancelledEvent;
	meetingStarted: MeetingStartedEvent;
	meetingEnded: MeetingEndedEvent;
	meetingParticipantJoined: MeetingParticipantJoinedEvent;
	meetingParticipantLeft: MeetingParticipantLeftEvent;
	recordingCompleted: RecordingCompletedEvent;
	webinarStarted: WebinarStartedEvent;
};

function parseBody(body: unknown): unknown {
	if (typeof body !== 'string') return body;
	try {
		return JSON.parse(body);
	} catch {
		return null;
	}
}

export function createZoomEventMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Type assertion needed because parseBody returns unknown
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody != null && parsedBody.event === eventType;
	};
}

export function verifyZoomWebhookSignature(
	request: WebhookRequest<unknown>,
	signingSecret?: string,
): { valid: boolean; error?: string } {
	if (!signingSecret) {
		return { valid: false };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-zm-signature'])
		? headers['x-zm-signature'][0]
		: headers['x-zm-signature'];
	const timestamp = Array.isArray(headers['x-zm-request-timestamp'])
		? headers['x-zm-request-timestamp'][0]
		: headers['x-zm-request-timestamp'];

	if (!signature || !timestamp) {
		return {
			valid: false,
			error: 'Missing x-zm-signature or x-zm-request-timestamp header',
		};
	}

	// Zoom recommends a 30-second replay window; the utility default of 5 minutes is too wide
	const isValid = verifyHmacSha256Signature(
		rawBody,
		signingSecret,
		timestamp,
		signature,
		30,
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
