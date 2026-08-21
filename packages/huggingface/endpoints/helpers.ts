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

/** Hub `/commit` file entry (application/json + NDJSON `file` line). */
export type HubCommitFile = {
	path: string;
	content?: string;
	encoding?: 'utf-8' | 'base64';
	oldPath?: string;
};

export type HubCommitDeletedEntry = { path: string };

export type HubCommitLfsFile = {
	path: string;
	oid?: string;
	algo?: 'sha256';
	size?: number;
	oldPath?: string;
};

export type HubCreateCommitInput = {
	summary: string;
	description?: string;
	parentCommit?: string;
	createPr?: boolean;
	hotReload?: boolean;
	/** Official default is NDJSON; JSON kept for small legacy payloads. */
	format?: 'json' | 'ndjson';
	files?: HubCommitFile[];
	deletedEntries?: HubCommitDeletedEntry[];
	lfsFiles?: HubCommitLfsFile[];
};

/**
 * Build Hub `/commit` request options from official OpenAPI shapes.
 * - `create_pr` / `hot_reload` are query params (not body).
 * - JSON body uses `files` / `deletedEntries` / `lfsFiles` (not Python `operations`).
 * - NDJSON (recommended) is `{key,value}` lines with Content-Type application/x-ndjson.
 */
export function hubCommitRequestOptions(
	input: HubCreateCommitInput,
): HuggingFaceRequestOptions {
	const query = {
		create_pr: input.createPr ? true : undefined,
		hot_reload: input.hotReload ? true : undefined,
	};
	const format = input.format ?? 'ndjson';
	if (format === 'json') {
		return {
			method: 'POST',
			query,
			body: {
				summary: input.summary,
				description: input.description ?? '',
				parentCommit: input.parentCommit,
				files: input.files,
				deletedEntries: input.deletedEntries,
				lfsFiles: input.lfsFiles,
			},
		};
	}
	const lines: Array<{ key: string; value: Record<string, unknown> }> = [
		{
			key: 'header',
			value: {
				summary: input.summary,
				description: input.description ?? '',
				...(input.parentCommit ? { parentCommit: input.parentCommit } : {}),
			},
		},
	];
	for (const file of input.files ?? []) {
		lines.push({ key: 'file', value: { ...file } });
	}
	for (const entry of input.deletedEntries ?? []) {
		lines.push({ key: 'deletedEntry', value: { ...entry } });
	}
	for (const file of input.lfsFiles ?? []) {
		lines.push({ key: 'lfsFile', value: { ...file } });
	}
	return {
		method: 'POST',
		query,
		rawText: true,
		headers: {
			'Content-Type': 'application/x-ndjson',
			Accept: 'application/json',
		},
		// NDJSON body as raw string — Hub rejects a JSON-wrapped operations array
		body: lines.map((line) => JSON.stringify(line)).join('\n') + '\n',
	};
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
	'files',
	'deletedentries',
	'lfsfiles',
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
