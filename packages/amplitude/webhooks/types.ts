import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-schemas
// ─────────────────────────────────────────────────────────────────────────────

const AmplitudeUserContextSchema = z.object({
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	// User properties are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	country: z.string().optional(),
	city: z.string().optional(),
	region: z.string().optional(),
	language: z.string().optional(),
	platform: z.string().optional(),
	os: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// events.track webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeTrackEventSchema = z.object({
	type: z.literal('event.track'),
	event_id: z.string(),
	event_type: z.string(),
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	time: z.number(),
	// Event properties are open-ended key-value pairs
	event_properties: z.record(z.string(), z.unknown()).optional(),
	// User properties are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	app_version: z.string().optional(),
	platform: z.string().optional(),
	session_id: z.number().optional(),
	insert_id: z.string().optional(),
});

export type AmplitudeTrackEvent = z.infer<typeof AmplitudeTrackEventSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// events.identify webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeIdentifyEventSchema = z.object({
	type: z.literal('event.identify'),
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	time: z.number(),
	// User property operations are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	app_version: z.string().optional(),
	platform: z.string().optional(),
	insert_id: z.string().optional(),
});

export type AmplitudeIdentifyEvent = z.infer<
	typeof AmplitudeIdentifyEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// annotations.created webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeAnnotationCreatedEventSchema = z.object({
	type: z.literal('annotation.created'),
	annotation_id: z.number(),
	date: z.string(),
	label: z.string(),
	details: z.string().optional(),
	app_id: z.number().optional(),
	source: z.string().optional(),
	created_at: z.string(),
});

export type AmplitudeAnnotationCreatedEvent = z.infer<
	typeof AmplitudeAnnotationCreatedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// annotations.updated webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeAnnotationUpdatedEventSchema = z.object({
	type: z.literal('annotation.updated'),
	annotation_id: z.number(),
	date: z.string(),
	label: z.string(),
	details: z.string().optional(),
	app_id: z.number().optional(),
	source: z.string().optional(),
	updated_at: z.string(),
});

export type AmplitudeAnnotationUpdatedEvent = z.infer<
	typeof AmplitudeAnnotationUpdatedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// monitors.alert webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeMonitorAlertEventSchema = z.object({
	type: z.literal('monitor.alert'),
	monitor_id: z.string(),
	monitor_name: z.string(),
	alert_type: z.string(),
	condition: z.string().optional(),
	// Alert metric value at time of trigger
	value: z.number().optional(),
	threshold: z.number().optional(),
	triggered_at: z.string(),
	chart_id: z.string().optional(),
	dashboard_id: z.number().optional(),
	recipients: z.array(z.string()).optional(),
});

export type AmplitudeMonitorAlertEvent = z.infer<
	typeof AmplitudeMonitorAlertEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// cohorts.computed webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeCohortComputedEventSchema = z.object({
	type: z.literal('cohort.computed'),
	cohort_id: z.string(),
	cohort_name: z.string(),
	app_id: z.number().optional(),
	size: z.number(),
	computed_at: z.string(),
	published: z.boolean().optional(),
});

export type AmplitudeCohortComputedEvent = z.infer<
	typeof AmplitudeCohortComputedEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// experiments.exposure webhook
// ─────────────────────────────────────────────────────────────────────────────

export const AmplitudeExperimentExposureEventSchema = z.object({
	type: z.literal('experiment.exposure'),
	flag_key: z.string(),
	variant: z.string(),
	user: AmplitudeUserContextSchema,
	time: z.number(),
	experiment_key: z.string().optional(),
	metadata: z
		.object({
			deployment_name: z.string().optional(),
			flag_version: z.number().optional(),
		})
		.optional(),
});

export type AmplitudeExperimentExposureEvent = z.infer<
	typeof AmplitudeExperimentExposureEventSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Payload wrapper — Amplitude sends events inside a top-level envelope
// ─────────────────────────────────────────────────────────────────────────────

export type AmplitudeWebhookPayload<TEvent> = {
	type: string;
	created_at: string;
	data: TEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Output map
// ─────────────────────────────────────────────────────────────────────────────

export type AmplitudeWebhookOutputs = {
	eventsTrack: AmplitudeTrackEvent;
	eventsIdentify: AmplitudeIdentifyEvent;
	annotationsCreated: AmplitudeAnnotationCreatedEvent;
	annotationsUpdated: AmplitudeAnnotationUpdatedEvent;
	monitorsAlert: AmplitudeMonitorAlertEvent;
	cohortsComputed: AmplitudeCohortComputedEvent;
	experimentsExposure: AmplitudeExperimentExposureEvent;
};

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

// body can be either a raw string (from HTTP) or an already-parsed object; unknown
// is required here because the structure cannot be known before parsing.
function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createAmplitudeMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// Req body is unknown
		const parsedBody = parseBody(request.body) as Record<string, unknown>;
		return parsedBody.type === eventType;
	};
}

export function verifyAmplitudeWebhookSignature(
	request: WebhookRequest,
	secret?: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-amplitude-signature'])
		? headers['x-amplitude-signature'][0]
		: headers['x-amplitude-signature'];

	if (!signature) {
		return { valid: false, error: 'Missing x-amplitude-signature header' };
	}

	const isValid = verifyHmacSignature(rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
