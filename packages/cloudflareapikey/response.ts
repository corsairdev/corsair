import { CloudflareApiKeyAPIError } from './api-error';

export type CloudflareApiResponse<T> = {
	result: T;
	success: boolean;
	errors: Array<{ code: number; message: string }>;
	// Cloudflare's messages array is unstructured diagnostic JSON.
	messages: unknown[];
};

export function isCloudflareEnvelope(
	// Transport JSON before the Cloudflare {success, result} envelope is unwrapped.
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

export function unwrapCloudflareResponse<T>(
	// Parsed HTTP JSON or a raw string result (DNSSEC delete).
	response: unknown,
): T {
	if (typeof response === 'string') {
		return response as T;
	}

	if (isCloudflareEnvelope(response)) {
		if (!response.success) {
			const message =
				response.errors?.map((e) => e.message).join('; ') ||
				'Cloudflare API request failed';
			throw new CloudflareApiKeyAPIError(message, response.errors?.[0]?.code);
		}
		return response.result as T;
	}

	return response as T;
}

export function cloudflareErrorFromApiErrorBody(
	body: unknown,
): CloudflareApiKeyAPIError | null {
	if (isCloudflareEnvelope(body) && !body.success) {
		const message =
			body.errors?.map((e) => e.message).join('; ') ||
			'Cloudflare API request failed';
		return new CloudflareApiKeyAPIError(message, body.errors?.[0]?.code);
	}
	if (isCloudflareErrorsBody(body)) {
		const message = body.errors.map((e) => e.message).join('; ');
		return new CloudflareApiKeyAPIError(message, body.errors[0]?.code);
	}
	return null;
}
