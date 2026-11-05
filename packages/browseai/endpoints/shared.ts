import type { z } from 'zod';
import type { BrowseaiRequestOptions } from '../client';
import { makeBrowseaiRequest } from '../client';

type BrowseaiCallContext = {
	key: string;
};

export async function browseaiCall<T>(
	ctx: BrowseaiCallContext,
	endpoint: string,
	schema: z.ZodType<T>,
	options: Omit<BrowseaiRequestOptions<T>, 'schema'> = {},
): Promise<T> {
	return await makeBrowseaiRequest<T>(endpoint, ctx.key, {
		...options,
		schema,
	});
}

export function compactBody<T extends object>(body: T): Partial<T> {
	const compacted: Partial<T> = {};
	for (const key of Object.keys(body) as (keyof T)[]) {
		const value = body[key];
		if (value !== undefined) {
			compacted[key] = value;
		}
	}
	return compacted;
}

export function compactQuery<
	T extends Record<string, string | number | boolean | undefined>,
>(query: T): Partial<T> {
	const compacted: Partial<T> = {};
	for (const key of Object.keys(query) as (keyof T)[]) {
		const value = query[key];
		if (value !== undefined) {
			compacted[key] = value;
		}
	}
	return compacted;
}

export function robotPath(robotId: string, suffix = ''): string {
	return `robots/${encodeURIComponent(robotId)}${suffix}`;
}

export function auditPayload<T extends object>(
	input: T,
	identifierKeys: readonly (keyof T & string)[],
): Partial<T> & { fields?: string[] } {
	const payload: Partial<T> & { fields?: string[] } = {};
	for (const key of identifierKeys) {
		if (input[key] !== undefined) {
			payload[key] = input[key];
		}
	}
	const supplied = Object.keys(input).filter(
		(key) => input[key as keyof T] !== undefined,
	);
	if (supplied.length > 0) payload.fields = supplied;
	return payload;
}
