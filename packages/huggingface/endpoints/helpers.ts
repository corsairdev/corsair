import type { HuggingFaceRequestOptions } from '../client';
import { makeHuggingFaceRequest } from '../client';

/**
 * Shared request helper for endpoint modules (token from plugin keyBuilder).
 */
export async function req<T>(
	ctx: { key: string },
	endpoint: string,
	options: HuggingFaceRequestOptions = {},
): Promise<T> {
	return makeHuggingFaceRequest<T>(endpoint, ctx.key || undefined, options);
}

/**
 * Hub REST paths use plural repo-type segments: models | datasets | spaces.
 * Callers pass singular enum values (model | dataset | space).
 */
export function hubRepoTypeSegment(
	repoType: 'model' | 'dataset' | 'space' | string,
): string {
	if (repoType === 'model' || repoType === 'dataset' || repoType === 'space') {
		return `${repoType}s`;
	}
	// already plural or custom — pass through
	return repoType;
}

/**
 * Redact sensitive fields before logEventFromContext (secrets, chat, commit ops).
 * Keys are matched case-insensitively at every nesting level so a secret under
 * an arbitrary parent (e.g. `{ metadata: { apiKey: 'hf_…' } }`) never reaches logs.
 */
const REDACTED_KEYS = new Set([
	'value',
	'secret',
	'messages',
	'operations',
	'files',
	// free-form / PII-bearing fields (gated-repo answers, chat extras, comments)
	'fields',
	'extra',
	'settings',
	'content',
	'comment',
	'input',
	// nested credential-like keys
	'apikey',
	'api_key',
	'token',
	'accesstoken',
	'access_token',
	'authorization',
	'password',
	'passwd',
	'credential',
	'credentials',
]);

function redactValue(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map((item) => redactValue(item));
	}
	if (value && typeof value === 'object') {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			if (REDACTED_KEYS.has(k.toLowerCase())) {
				out[k] = '[redacted]';
			} else {
				out[k] = redactValue(v);
			}
		}
		return out;
	}
	return value;
}

export function summarize(
	// endpoint inputs vary per op; accept unknown and narrow for redaction
	input: unknown,
): Record<string, unknown> {
	if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
	// cast: object branch after typeof check — entries need a string-key record
	return redactValue(input) as Record<string, unknown>;
}
