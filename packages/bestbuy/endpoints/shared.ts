import { makeBestBuyRequest } from '../client';

export type BestBuyCallContext = {
	key: string;
};

export async function bestbuyCall<T>(
	ctx: BestBuyCallContext,
	endpoint: string,
	query?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
	return await makeBestBuyRequest<T>(endpoint, ctx.key, { query });
}

export function quoteValue(value: string): string {
	if (/^[A-Za-z0-9._-]+$/.test(value)) return value;
	return `"${value.replaceAll('"', '\\"')}"`;
}

export function attrEquals(key: string, value: string | number): string {
	return `${key}=${quoteValue(String(value))}`;
}

/** Pipe or comma lists become Remix `in(...)`. */
export function attrIn(key: string, raw: string): string {
	const parts = raw
		.split(/[|,]/)
		.map((part) => part.trim())
		.filter(Boolean);
	if (parts.length <= 1) return attrEquals(key, parts[0] ?? raw);
	return `${key} in(${parts.map(quoteValue).join(',')})`;
}

export function salePriceFilter(raw: string): string {
	const trimmed = raw.trim();
	if (trimmed.startsWith('salePrice')) return trimmed;
	if (/^[<>!=]/.test(trimmed)) return `salePrice${trimmed}`;
	return attrEquals('salePrice', trimmed);
}

export function collectionPath(resource: string, filters: string[]): string {
	if (filters.length === 0) return resource;
	return `${resource}(${filters.join('&')})`;
}

export function pageQuery(input: {
	page?: number | undefined;
	pageSize?: number | undefined;
	show?: string | undefined;
	sort?: string | undefined;
}): Record<string, string | number | boolean | undefined> {
	return {
		page: input.page,
		pageSize: input.pageSize,
		show: input.show,
		sort: input.sort,
	};
}
