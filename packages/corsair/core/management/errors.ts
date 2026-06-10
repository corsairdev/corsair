// ─────────────────────────────────────────────────────────────────────────────
// Management API error type and JSON response helpers.
// Response body shape: { error, message?, ...extra }. Errors thrown from
// operations are caught by the handler and serialized via errorResponse().
// ─────────────────────────────────────────────────────────────────────────────

export class ManagementApiError extends Error {
	readonly status: number;
	readonly code: string;
	readonly extra: Record<string, unknown>;

	constructor(
		status: number,
		code: string,
		message?: string,
		extra: Record<string, unknown> = {},
	) {
		super(message ?? code);
		this.name = 'ManagementApiError';
		this.status = status;
		this.code = code;
		this.extra = extra;
	}
}

export function json(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

export function errorResponse(err: ManagementApiError): Response {
	const body = { error: err.code, message: err.message, ...err.extra };
	return json(err.status, body);
}

export function notFound(message: string): ManagementApiError {
	return new ManagementApiError(404, 'not_found', message);
}

export function badRequest(
	message: string,
	extra: Record<string, unknown> = {},
): ManagementApiError {
	return new ManagementApiError(400, 'bad_request', message, extra);
}
