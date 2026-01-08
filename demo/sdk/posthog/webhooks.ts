// PostHog Webhook Event Types

export interface PostHogWebhookPayload {
	event: string;
	distinct_id: string;
	timestamp?: string;
	uuid?: string;
	properties?: Record<string, any>;
	person?: {
		distinct_id: string;
		properties?: Record<string, any>;
	};
	groups?: Record<string, any>;
	$set?: Record<string, any>;
	$set_once?: Record<string, any>;
	$unset?: string[];
}

// Event webhook - when an event is captured
export interface EventCapturedEvent extends PostHogWebhookPayload {
	event: string;
	distinct_id: string;
	properties?: Record<string, any>;
}

// Union of all webhook events
export type PostHogWebhookEvent = EventCapturedEvent;

// Event type names
export type PostHogEventName = 'event.captured';

export interface PostHogEventMap {
	'event.captured': EventCapturedEvent;
}

