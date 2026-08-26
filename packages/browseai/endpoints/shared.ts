import type { BrowseaiRequestOptions } from '../client';
import { makeBrowseaiRequest } from '../client';

type BrowseaiCallContext = {
	key: string;
};

export async function browseaiCall<T>(
	ctx: BrowseaiCallContext,
	endpoint: string,
	options: BrowseaiRequestOptions = {},
): Promise<T> {
	return await makeBrowseaiRequest<T>(endpoint, ctx.key, options);
}

export function compactBody(
	body: Record<string, unknown>,
): Record<string, unknown> {
	const compacted: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(body)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

export function compactQuery(
	query: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	const compacted: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(query)) {
		if (value !== undefined) compacted[key] = value;
	}
	return compacted;
}

export function robotPath(robotId: string, suffix = ''): string {
	return `robots/${encodeURIComponent(robotId)}${suffix}`;
}

export function auditPayload<T extends Record<string, unknown>>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) payload[key] = input[key];
	}
	const supplied = Object.keys(input).filter((key) => input[key] !== undefined);
	if (supplied.length > 0) payload.fields = supplied;
	return payload;
}
