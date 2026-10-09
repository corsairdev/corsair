import { createHash } from 'node:crypto';

import type { AgentQLQueryDataInput, AgentQLQueryDocumentInput } from './types';

function canonicalizeParams(value: unknown): unknown {
	if (Array.isArray(value)) {
		return value.map(canonicalizeParams);
	}
	if (value === null || typeof value !== 'object') {
		return value;
	}

	return Object.fromEntries(
		Object.entries(value)
			.sort(([leftKey], [rightKey]) =>
				leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0,
			)
			.map(([key, nestedValue]) => [key, canonicalizeParams(nestedValue)]),
	);
}

export async function hashFileContent(file: Blob): Promise<string> {
	const buffer = Buffer.from(await file.arrayBuffer());
	return createHash('sha256').update(buffer).digest('hex');
}

export function buildQueryDataCacheKey(input: AgentQLQueryDataInput): string {
	const normalized = {
		query: input.query,
		prompt: input.prompt,
		url: input.url,
		htmlHash: input.html
			? createHash('sha256').update(input.html).digest('hex')
			: undefined,
		params: canonicalizeParams(input.params),
	};

	return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

export function buildQueryDocumentCacheKey(
	input: AgentQLQueryDocumentInput,
	fileHash: string,
): string {
	const normalized = {
		fileHash,
		fileName: input.fileName,
		query: input.query,
		prompt: input.prompt,
		params: canonicalizeParams(input.params),
	};

	return createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}
