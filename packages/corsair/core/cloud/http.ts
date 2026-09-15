import { ManagementApiError } from '../management/errors';

export type CloudTransport = {
	baseUrl: string;
	apiKey: string;
	fetch?: typeof fetch;
};

type CloudErrorEnvelope = {
	error?: string;
	message?: string;
	reason?: string;
	providerStatus?: number;
	[key: string]: unknown;
};

function joinUrl(baseUrl: string, path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// The runtime envelope is exactly ManagementApiError's serialized shape
// (`{ error: code, message, ...extra }`), so reconstructing that same class
// keeps client and server on one error type instead of a parallel hierarchy.
export function mapCloudError(
	status: number,
	body: unknown,
): ManagementApiError {
	const envelope = (body ?? {}) as CloudErrorEnvelope;
	const { error, message, ...extra } = envelope;
	if (typeof error !== 'string') {
		return new ManagementApiError(status, 'internal_error', 'Internal error');
	}
	return new ManagementApiError(status, error, message, extra);
}

export async function cloudRequest<T>(
	transport: CloudTransport,
	method: string,
	path: string,
	body?: unknown,
): Promise<T> {
	const doFetch = transport.fetch ?? globalThis.fetch;
	const res = await doFetch(joinUrl(transport.baseUrl, path), {
		method,
		headers: {
			authorization: `Bearer ${transport.apiKey}`,
			'content-type': 'application/json',
		},
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	const text = await res.text();
	let parsed: unknown;
	try {
		parsed = text ? JSON.parse(text) : undefined;
	} catch {
		parsed = undefined;
	}

	if (!res.ok) throw mapCloudError(res.status, parsed);
	return parsed as T;
}
