import { CloudflareAPIError } from './api-error';

export type CloudflareApiResponse<T> = {
	result: T;
	success: boolean;
	errors: Array<{ code: number; message: string }>;
	// Cloudflare may include diagnostic messages; shape varies by endpoint.
	messages: unknown[];
};

/** Runtime check for Cloudflare's `{ success, result, errors }` JSON envelope. */
export function isCloudflareEnvelope(
	response: unknown,
): response is CloudflareApiResponse<unknown> {
	return (
		response !== null &&
		typeof response === 'object' &&
		'success' in response &&
		'result' in response
	);
}

function isCloudflareErrorsBody(
	body: unknown,
): body is { errors: Array<{ code?: number; message: string }> } {
	return (
		body !== null &&
		typeof body === 'object' &&
		'errors' in body &&
		Array.isArray((body as { errors: unknown }).errors) &&
		(body as { errors: unknown[] }).errors.length > 0
	);
}

/**
 * Normalizes Cloudflare API responses. Most endpoints return a JSON envelope;
 * script download returns plain text; some DELETE paths return a bare object.
 */
export function unwrapCloudflareResponse<T>(
	// HTTP layer returns parsed JSON or text; shape depends on Content-Type.
	response: unknown,
): T {
	if (typeof response === 'string') {
		// GET /workers/scripts/{name} returns application/javascript, not JSON.
		return response as T;
	}

	if (isCloudflareEnvelope(response)) {
		if (!response.success) {
			const message =
				response.errors?.map((e) => e.message).join('; ') ||
				'Cloudflare API request failed';
			const code = response.errors?.[0]?.code;
			throw new CloudflareAPIError(message, code);
		}
		return response.result as T;
	}

	// Some successful responses (e.g. certain deletes) omit the envelope.
	return response as T;
}

export function cloudflareErrorFromApiErrorBody(
	body: unknown,
): CloudflareAPIError | null {
	if (isCloudflareEnvelope(body) && !body.success) {
		const message =
			body.errors?.map((e) => e.message).join('; ') ||
			'Cloudflare API request failed';
		return new CloudflareAPIError(message, body.errors?.[0]?.code);
	}
	if (isCloudflareErrorsBody(body)) {
		const message = body.errors.map((e) => e.message).join('; ');
		return new CloudflareAPIError(message, body.errors[0]?.code);
	}
	return null;
}
