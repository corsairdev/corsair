import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const WisepopsWebhookContactSchema = z.object({
	collected_at: z.string(),
	wisepop_id: z.number(),
	ip: z.string().optional(),
	country_code: z.string().optional(),
	form_session: z.string().optional(),
	fields: z.record(z.string(), z.unknown()).optional(),
});
export type WisepopsWebhookContact = z.infer<
	typeof WisepopsWebhookContactSchema
>;

export const WisepopsWebhookPayloadSchema = z.array(
	WisepopsWebhookContactSchema,
);
export type WisepopsWebhookPayload = z.infer<
	typeof WisepopsWebhookPayloadSchema
>;

export type WisepopsWebhookOutputs = {
	collected: WisepopsWebhookPayload;
	email: WisepopsWebhookPayload;
	phone: WisepopsWebhookPayload;
	survey: WisepopsWebhookPayload;
};

export function getHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const lower = name.toLowerCase();
	for (const [key, value] of Object.entries(headers)) {
		if (key.toLowerCase() === lower) {
			return Array.isArray(value) ? value[0] : value;
		}
	}
	return undefined;
}

export function parseBody(body: unknown): unknown {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body);
		} catch {
			return null;
		}
	}
	return body;
}

export function detectWisepopsEventType(
	request:
		| RawWebhookRequest
		| WebhookRequest<unknown>
		| {
				headers: Record<string, string | string[] | undefined>;
				body?: unknown;
				payload?: unknown;
				rawBody?: unknown;
				query?: Record<string, string | string[] | undefined>;
		  },
): 'email' | 'phone' | 'survey' | 'collected' | 'unknown' {
	// 1. Query parameter explicitly specifying event: ?event=...
	const queryEvent =
		typeof request.query?.event === 'string'
			? request.query.event.trim().toLowerCase()
			: undefined;
	if (queryEvent) {
		if (
			queryEvent === 'email' ||
			queryEvent === 'phone' ||
			queryEvent === 'survey' ||
			queryEvent === 'collected'
		) {
			return queryEvent;
		}
		return 'unknown';
	}

	// 2. Custom header specifying event: x-wisepops-event
	const headerEvent = getHeader(request.headers, 'x-wisepops-event')
		?.trim()
		.toLowerCase();
	if (headerEvent) {
		if (
			headerEvent === 'email' ||
			headerEvent === 'phone' ||
			headerEvent === 'survey' ||
			headerEvent === 'collected'
		) {
			return headerEvent;
		}
		return 'unknown';
	}

	// 3. Object body with explicit event or type property
	const bodyToParse =
		'payload' in request && request.payload !== undefined
			? request.payload
			: 'body' in request
				? request.body
				: undefined;
	const parsed = parseBody(bodyToParse);
	if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
		const obj = parsed as Record<string, unknown>;
		if (typeof obj.event === 'string') {
			const ev = obj.event.trim().toLowerCase();
			if (
				ev === 'email' ||
				ev === 'phone' ||
				ev === 'survey' ||
				ev === 'collected'
			) {
				return ev;
			}
			return 'unknown';
		}
		if (typeof obj.type === 'string') {
			const ev = obj.type.trim().toLowerCase();
			if (
				ev === 'email' ||
				ev === 'phone' ||
				ev === 'survey' ||
				ev === 'collected'
			) {
				return ev;
			}
			return 'unknown';
		}
	}

	// 4. Contact payload array
	let contacts: unknown[] | null = null;
	if (Array.isArray(parsed)) {
		contacts = parsed;
	} else if (
		parsed &&
		typeof parsed === 'object' &&
		'data' in parsed &&
		Array.isArray((parsed as Record<string, unknown>).data)
	) {
		contacts = (parsed as Record<string, unknown>).data as unknown[];
	}

	if (contacts && contacts.length > 0) {
		const first = contacts[0];
		if (first && typeof first === 'object') {
			const item = first as Record<string, unknown>;
			if (typeof item.event === 'string') {
				const ev = item.event.trim().toLowerCase();
				if (
					ev === 'email' ||
					ev === 'phone' ||
					ev === 'survey' ||
					ev === 'collected'
				) {
					return ev;
				}
				return 'unknown';
			}

			// Inspect fields map on contact
			const fields = item.fields as Record<string, unknown> | undefined;
			if (fields && typeof fields === 'object') {
				if ('email' in fields) return 'email';
				if ('phone' in fields) return 'phone';
				if ('survey' in fields || Object.keys(fields).length > 0)
					return 'survey';
			}

			if ('collected_at' in item && 'wisepop_id' in item) {
				return 'collected';
			}
			return 'unknown';
		}
	}

	if (contacts && contacts.length === 0) {
		return 'collected';
	}

	return 'unknown';
}

export function createWisepopsMatch(
	targetEvent: 'email' | 'phone' | 'survey' | 'collected',
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const sigHeader = getHeader(request.headers, 'x-wisepops-signature');
		if (!sigHeader) {
			return false;
		}

		const detected = detectWisepopsEventType(request);
		if (detected === 'unknown') {
			return false;
		}

		if (targetEvent === 'collected') {
			return true;
		}

		return detected === targetEvent;
	};
}

export function verifyWisepopsWebhookSignature(
	request:
		| WebhookRequest<unknown>
		| {
				rawBody?: string | Buffer;
				headers: Record<string, string | string[] | undefined>;
				hubVerified?: boolean;
		  },
	secret?: string,
): { valid: boolean; error?: string } {
	if ('hubVerified' in request && request.hubVerified === true) {
		return { valid: true };
	}

	if (!secret) {
		return { valid: false, error: 'Missing webhook secret' };
	}

	const rawBody = request.rawBody;
	if (rawBody === undefined || rawBody === null || rawBody === '') {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	const sigHeader = getHeader(request.headers, 'x-wisepops-signature');
	if (!sigHeader) {
		return { valid: false, error: 'Missing x-wisepops-signature header' };
	}

	// Wisepops signs using HMAC-SHA256 hex digest (64 hex characters)
	if (!/^[0-9a-fA-F]{64}$/.test(sigHeader.trim())) {
		return { valid: false, error: 'Malformed signature header' };
	}

	const isValid = verifyHmacSignature(
		rawBody,
		secret,
		sigHeader.trim(),
		'sha256',
	);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
