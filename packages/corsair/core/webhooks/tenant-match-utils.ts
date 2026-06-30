import type { RawWebhookRequest } from './index';

export function getHeader(
	headers: Record<string, string | string[] | undefined>,
	name: string,
): string | undefined {
	const normalizedName = name.toLowerCase();
	const value = headers[normalizedName] ?? headers[name];
	if (Array.isArray(value)) return value[0];
	return typeof value === 'string' ? value : undefined;
}

export function toExternalId(value: unknown): string | undefined {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed.length > 0 ? trimmed : undefined;
	}
	if (typeof value === 'number' && Number.isFinite(value)) {
		return String(value);
	}
	return undefined;
}

export function asRecord(value: unknown): Record<string, unknown> | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	return value as Record<string, unknown>;
}

export function readBodyRecord(request: RawWebhookRequest) {
	return asRecord(request.body);
}

export function readQueryParam(
	request: {
		query?: Record<string, string | string[] | undefined>;
	},
	name: string,
): string | undefined {
	const query = request.query;
	if (!query) return undefined;

	const value = query[name] ?? query[name.toLowerCase()];
	return firstString(Array.isArray(value) ? value : [value]);
}

type MicrosoftGraphValidationRequest = {
	headers?: Record<string, string | string[] | undefined>;
	body?: unknown;
	payload?: unknown;
	query?: Record<string, string | string[] | undefined>;
};

// Microsoft Graph and SharePoint subscription validation sends validationToken as a
// query param, header, forwarded URI, or JSON body field during registration.
export function extractMicrosoftGraphValidationToken(
	request: MicrosoftGraphValidationRequest,
): string | null {
	const headers = request.headers ?? {};
	const headerCandidates = [
		headers.validationtoken,
		headers.validationToken,
		headers['validation-token'],
		headers['ms-validation-token'],
	];
	for (const candidate of headerCandidates) {
		const value = firstString(
			Array.isArray(candidate) ? candidate : [candidate],
		);
		if (value) return decodeURIComponent(value);
	}

	const queryToken = readQueryParam(
		{ query: request.query },
		'validationToken',
	);
	if (queryToken) return queryToken;

	const pathLikeHeaderKeys = [
		'x-forwarded-uri',
		'x-original-uri',
		'x-rewrite-url',
		'x-envoy-original-path',
		'referer',
	];
	for (const key of pathLikeHeaderKeys) {
		const headerValue = headers[key];
		const asString = Array.isArray(headerValue) ? headerValue[0] : headerValue;
		if (!asString || typeof asString !== 'string') continue;
		try {
			const fullUrl = asString.startsWith('http')
				? new URL(asString)
				: new URL(
						`https://example.invalid${asString.startsWith('/') ? asString : `/${asString}`}`,
					);
			const uriToken = fullUrl.searchParams.get('validationToken');
			if (uriToken?.trim()) return uriToken.trim();
		} catch {
			continue;
		}
	}

	const bodySource =
		request.payload !== undefined
			? request.payload
			: request.body !== undefined
				? request.body
				: undefined;
	const body = asRecord(
		typeof bodySource === 'string'
			? (() => {
					try {
						return JSON.parse(bodySource) as unknown;
					} catch {
						return bodySource;
					}
				})()
			: bodySource,
	);
	const bodyToken = firstString([body?.validationToken]);
	return bodyToken ?? null;
}

export function isMicrosoftGraphValidationHandshake(
	request: MicrosoftGraphValidationRequest,
): boolean {
	if (extractMicrosoftGraphValidationToken(request)) return true;

	const body = asRecord(request.body ?? request.payload);
	const contentType = getHeader(request.headers ?? {}, 'content-type');
	if (contentType?.includes('text/plain')) {
		return !body || Object.keys(body).length === 0;
	}

	return false;
}

export function firstString(values: unknown[]): string | undefined {
	for (const value of values) {
		const externalId = toExternalId(value);
		if (externalId) return externalId;
	}
	return undefined;
}

export function decodePubSubData(body: Record<string, unknown>): unknown {
	const message = asRecord(body.message);
	const data = message?.data;
	if (typeof data !== 'string') return null;
	try {
		return JSON.parse(Buffer.from(data, 'base64').toString('utf8'));
	} catch {
		return null;
	}
}
