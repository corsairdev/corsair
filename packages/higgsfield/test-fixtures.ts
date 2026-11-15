import crypto from 'node:crypto';

export const REQUEST_ID = '01a1ba6f-8564-7838-b5fb-1e861bcd22e8';
export const API_KEY = 'test-key-id:test-key-secret';

/** A whsec_ secret made here, the way the Console shows one. */
export const WEBHOOK_SECRET = `whsec_${Buffer.from('a-local-test-signing-key-32-byte').toString('base64')}`;
export const OTHER_WEBHOOK_SECRET = `whsec_${Buffer.from('another-local-key-for-rotation!!').toString('base64')}`;

/**
 * A real delivery's body as Higgsfield sent it on 2026-11-08 (ids swapped),
 * with Python's `", "` and `": "` separators: JSON.stringify of the parsed
 * object does not give these bytes back, which is why only the raw body verifies.
 */
export const COMPLETED_RAW_BODY = `{"request_id": "${REQUEST_ID}", "status": "completed", "error": null, "payload": {"images": [{"url": "https://cdn.example.com/boat.png", "content_type": "image/png"}]}, "expires_at": "2026-11-15T09:14:09.786024+00:00"}`;

export const FAILED_RAW_BODY = `{"request_id": "${REQUEST_ID}", "status": "failed", "error": "Generation failed", "payload": null}`;

export const NSFW_RAW_BODY = `{"request_id": "${REQUEST_ID}", "status": "nsfw", "error": null, "payload": null}`;

export function signature(secret: string, signedContent: string): string {
	const key = Buffer.from(secret.slice('whsec_'.length), 'base64');
	return `v1,${crypto.createHmac('sha256', key).update(signedContent).digest('base64')}`;
}

/** The headers Higgsfield sends with a delivery signed by `secret`. */
export function signedHeaders(
	rawBody: string,
	options: {
		secret?: string;
		id?: string;
		timestampSeconds?: number;
		extraSignature?: string;
	} = {},
): Record<string, string> {
	const id = options.id ?? 'msg_01TESTDELIVERY';
	const timestamp = String(
		options.timestampSeconds ?? Math.floor(Date.now() / 1000),
	);
	const signed = signature(
		options.secret ?? WEBHOOK_SECRET,
		`${id}.${timestamp}.${rawBody}`,
	);
	return {
		'content-type': 'application/json',
		'webhook-id': id,
		'webhook-timestamp': timestamp,
		'webhook-signature': options.extraSignature
			? `${options.extraSignature} ${signed}`
			: signed,
	};
}

/** A fetch answer with a JSON body and any headers. */
export function jsonResponse(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
): Response {
	return new Response(body === undefined ? null : JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}

export const acceptedBody = {
	status: 'queued',
	request_id: REQUEST_ID,
	status_url: `https://api.higgsfield.ai/requests/${REQUEST_ID}/status`,
	cancel_url: `https://api.higgsfield.ai/requests/${REQUEST_ID}/cancel`,
	expires_after: 604800,
};

export const completedStatusBody = {
	status: 'completed',
	request_id: REQUEST_ID,
	status_url: `https://api.higgsfield.ai/requests/${REQUEST_ID}/status`,
	cancel_url: `https://api.higgsfield.ai/requests/${REQUEST_ID}/cancel`,
	expires_at: '2026-11-15T09:14:09.786024+00:00',
	images: [{ url: 'https://cdn.example.com/boat.png' }],
};
