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
