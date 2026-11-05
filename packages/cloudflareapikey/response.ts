import { CloudflareApiKeyAPIError } from './api-error';

/**
 * Cloudflare HTTP JSON before runtime narrowing. The transport can return an
 * envelope, a string (DNSSEC delete), null (ruleset delete), or an error
 * object; `unknown` is required until those cases are discriminated.
 */
type CloudflareJson = unknown;

export type CloudflareApiResponse<T> = {
	result: T;
	success: boolean;
	errors: Array<{ code: number; message: string }>;
	messages: unknown[]; // unstructured Cloudflare diagnostics
};

export function isCloudflareEnvelope(
	response: CloudflareJson,
): response is CloudflareApiResponse<CloudflareJson> {
	return (
		response !== null &&
		typeof response === 'object' &&
		'success' in response &&
		'result' in response
	);
}

function isCloudflareErrorsBody(
	body: CloudflareJson,
): body is { errors: Array<{ code?: number; message: string }> } {
	return (
		body !== null &&
		typeof body === 'object' &&
		'errors' in body &&
		Array.isArray((body as { errors: CloudflareJson }).errors) &&
		(body as { errors: CloudflareJson[] }).errors.length > 0
	);
}

export function unwrapCloudflareResponse<T>(response: CloudflareJson): T {
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
	body: CloudflareJson,
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
