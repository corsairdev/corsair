import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
import type {
	CreateAliasArgs,
	CreateAliasResponse,
	CreateEventArgs,
	CreateEventResponse,
	CreateIdentityArgs,
	CreateIdentityResponse,
	TrackPageArgs,
	TrackPageResponse,
	TrackScreenArgs,
	TrackScreenResponse,
} from '../models/posthog';

export class AliasService {
	public static createAlias(
		args: CreateAliasArgs,
	): CancelablePromise<CreateAliasResponse> {
		const { distinct_id, alias, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.POSTHOG_API_KEY;
		
		if (!apiKey) {
			throw new Error('PostHog API key is required. Set POSTHOG_API_KEY or pass token parameter.');
		}

		// PostHog alias is created using $create_alias event
		// API key goes in body (PostHog capture endpoint expects it in body)
		const payload = {
			api_key: apiKey,
			event: '$create_alias',
			properties: {
				distinct_id: distinct_id,
				alias: alias,
			},
			distinct_id: distinct_id,
		};

		return __request(OpenAPI, {
			method: 'POST',
			url: '/capture/',
			body: payload,
		});
	}
}

export class EventService {
	public static createEvent(
		args: CreateEventArgs,
	): CancelablePromise<CreateEventResponse> {
		const { distinct_id, event, properties, timestamp, uuid, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.POSTHOG_API_KEY;
		
		if (!apiKey) {
			throw new Error('PostHog API key is required. Set POSTHOG_API_KEY or pass token parameter.');
		}

		// API key goes in body (PostHog capture endpoint expects it in body)
		const payload: any = {
			api_key: apiKey,
			event: event,
			properties: {
				...properties,
				distinct_id: distinct_id,
			},
			distinct_id: distinct_id,
		};

		if (timestamp) {
			payload.timestamp = timestamp;
		}

		if (uuid) {
			payload.uuid = uuid;
		}

		return __request(OpenAPI, {
			method: 'POST',
			url: '/capture/',
			body: payload,
		});
	}
}

export class IdentityService {
	public static createIdentity(
		args: CreateIdentityArgs,
	): CancelablePromise<CreateIdentityResponse> {
		const { distinct_id, properties, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.POSTHOG_API_KEY;
		
		if (!apiKey) {
			throw new Error('PostHog API key is required. Set POSTHOG_API_KEY or pass token parameter.');
		}

		// PostHog identify is created using $identify event
		// API key goes in body (PostHog capture endpoint expects it in body)
		const payload = {
			api_key: apiKey,
			event: '$identify',
			properties: {
				...properties,
				distinct_id: distinct_id,
			},
			distinct_id: distinct_id,
		};

		return __request(OpenAPI, {
			method: 'POST',
			url: '/capture/',
			body: payload,
		});
	}
}

export class TrackService {
	public static trackPage(
		args: TrackPageArgs,
	): CancelablePromise<TrackPageResponse> {
		const { distinct_id, url, properties, timestamp, uuid, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.POSTHOG_API_KEY;
		
		if (!apiKey) {
			throw new Error('PostHog API key is required. Set POSTHOG_API_KEY or pass token parameter.');
		}

		// API key goes in body (PostHog capture endpoint expects it in body)
		const payload: any = {
			api_key: apiKey,
			event: '$pageview',
			properties: {
				...properties,
				$current_url: url,
				distinct_id: distinct_id,
			},
			distinct_id: distinct_id,
		};

		if (timestamp) {
			payload.timestamp = timestamp;
		}

		if (uuid) {
			payload.uuid = uuid;
		}

		return __request(OpenAPI, {
			method: 'POST',
			url: '/capture/',
			body: payload,
		});
	}

	public static trackScreen(
		args: TrackScreenArgs,
	): CancelablePromise<TrackScreenResponse> {
		const { distinct_id, screen_name, properties, timestamp, uuid, token } = args;
		const apiKey = token || OpenAPI.TOKEN || process.env.POSTHOG_API_KEY;
		
		if (!apiKey) {
			throw new Error('PostHog API key is required. Set POSTHOG_API_KEY or pass token parameter.');
		}

		// API key goes in body (PostHog capture endpoint expects it in body)
		const payload: any = {
			api_key: apiKey,
			event: '$screen',
			properties: {
				...properties,
				$screen_name: screen_name,
				distinct_id: distinct_id,
			},
			distinct_id: distinct_id,
		};

		if (timestamp) {
			payload.timestamp = timestamp;
		}

		if (uuid) {
			payload.uuid = uuid;
		}

		return __request(OpenAPI, {
			method: 'POST',
			url: '/capture/',
			body: payload,
		});
	}
}

