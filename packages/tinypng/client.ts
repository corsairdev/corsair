import { z } from 'zod';

// https://tinify.com/developers/reference: HTTP Basic auth with user `api`.
export const TINIFY_API_BASE = 'https://api.tinify.com';

export class TinypngAPIError extends Error {
	constructor(
		message: string,
		public readonly status?: number,
		// Tinify's machine-readable error name, e.g. `Unauthorized`, `TooManyRequests`.
		public readonly code?: string,
		// Set when the image was already compressed, so retrying the whole operation would bill it again.
		public readonly compressed = false,
	) {
		super(message);
		this.name = 'TinypngAPIError';
	}
}

// Azure rejections are kept apart so a 401/403 from a bad SAS URL is not
// reported as an invalid Tinify key, and the compression is not retried.
export class AzureBlobError extends Error {
	constructor(
		message: string,
		public readonly status: number,
	) {
		super(message);
		this.name = 'AzureBlobError';
	}
}

export type TinifyResponse = {
	headers: Headers;
	body: ArrayBuffer;
};

export type TinifyRequest = {
	method: 'GET' | 'POST';
	path: string;
	// object: validated endpoint input. Uint8Array: raw image upload.
	body?: object | Uint8Array;
	// Statuses returned instead of thrown. Used by the compression count probe.
	acceptStatuses?: number[];
};

// https://tinify.com/developers/reference#errors
const TinifyErrorBodySchema = z.object({
	error: z.string().optional(),
	message: z.string().optional(),
});

function errorFromBody(status: number, body: ArrayBuffer): TinypngAPIError {
	const text = new TextDecoder().decode(body);
	try {
		const parsed = TinifyErrorBodySchema.parse(JSON.parse(text));
		return new TinypngAPIError(
			parsed.message ?? text ?? `Tinify API request failed (${status})`,
			status,
			parsed.error,
		);
	} catch {
		return new TinypngAPIError(
			text || `Tinify API request failed (${status})`,
			status,
		);
	}
}

export async function tinifyRequest(
	apiKey: string,
	{ method, path, body, acceptStatuses = [] }: TinifyRequest,
): Promise<TinifyResponse & { status: number }> {
	const headers: Record<string, string> = {
		Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`,
	};
	let payload: string | Uint8Array | undefined;
	if (body instanceof Uint8Array) {
		payload = body;
	} else if (body !== undefined) {
		headers['Content-Type'] = 'application/json';
		payload = JSON.stringify(body);
	}

	const response = await fetch(`${TINIFY_API_BASE}${path}`, {
		method,
		headers,
		body: payload,
	});
	const responseBody = await response.arrayBuffer();

	if (!response.ok && !acceptStatuses.includes(response.status)) {
		throw errorFromBody(response.status, responseBody);
	}
	return {
		status: response.status,
		headers: response.headers,
		body: responseBody,
	};
}

// unknown: this is raw provider JSON, safe because every caller parses it with a zod schema;
// a concrete type here would be an unchecked claim about the response shape.
export function readJson(response: TinifyResponse): unknown {
	return JSON.parse(new TextDecoder().decode(response.body));
}

export function numberHeader(
	headers: Headers,
	name: string,
): number | undefined {
	const value = headers.get(name);
	if (value === null) return undefined;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : undefined;
}

// Location is `https://api.tinify.com/output/<id>`.
export function imageIdFromLocation(location: string | null): string {
	const match = location?.match(/\/output\/([A-Za-z0-9]+)\/?$/);
	if (!match?.[1]) {
		throw new TinypngAPIError(
			`Tinify did not return an output Location header (got ${location ?? 'none'})`,
		);
	}
	return match[1];
}

export async function putAzureBlockBlob(
	blobUrl: string,
	data: ArrayBuffer,
	contentType: string,
	cacheControl?: string,
): Promise<{ etag?: string }> {
	// https://learn.microsoft.com/en-us/rest/api/storageservices/put-blob
	const headers: Record<string, string> = {
		'x-ms-blob-type': 'BlockBlob',
		'x-ms-version': '2021-08-06',
		'Content-Type': contentType,
	};
	if (cacheControl) headers['x-ms-blob-cache-control'] = cacheControl;

	const response = await fetch(blobUrl, {
		method: 'PUT',
		headers,
		body: new Uint8Array(data),
		// The host was checked against Azure Blob domains; never follow elsewhere.
		redirect: 'error',
	});
	if (!response.ok) {
		const detail = await response.text();
		throw new AzureBlobError(
			`Azure Blob upload failed (${response.status}): ${detail}`,
			response.status,
		);
	}
	return { etag: response.headers.get('etag') ?? undefined };
}
