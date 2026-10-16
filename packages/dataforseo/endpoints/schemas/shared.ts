import { z } from 'zod';

// Shared shapes from the DataForSEO OpenAPI description:
// https://github.com/dataforseo/OpenApiDocumentation (openapi_specification.yaml)
// The description marks every response field nullable.

export const Text = z.string().nullish();
export const Num = z.number().nullish();
export const Bool = z.boolean().nullish();
export const Strings = z.array(z.string()).nullish();

// Count maps such as referring_links_tld: keyed by the values found, e.g. { com: 120 }.
export const CountMap = z.record(z.string(), z.number().nullable()).nullish();

/** One DataForSEO task; `result` is the operation's own result array. */
export function taskEnvelope<T extends z.ZodType>(result: T) {
	return z.object({
		version: Text,
		status_code: z.number(),
		status_message: Text,
		time: Text,
		cost: Num,
		tasks_count: Num,
		tasks_error: Num,
		tasks: z
			.array(
				z.object({
					id: z.string(),
					status_code: z.number(),
					status_message: Text,
					time: Text,
					cost: Num,
					result_count: Num,
					path: Strings,
					// unknown: echoes the request parameters exactly as they were sent.
					data: z.record(z.string(), z.unknown()).nullish(),
					result: z.array(result).nullish(),
				}),
			)
			.nullish(),
	});
}

export const MonthlySearches = z
	.array(z.object({ year: z.number(), month: z.number(), search_volume: Num }))
	.nullish();

export const RatingInfo = z
	.object({
		rating_type: Text,
		value: Num,
		votes_count: Num,
		rating_max: Num,
	})
	.nullish();

export const PriceInfo = z
	.object({
		current: Num,
		regular: Num,
		max_value: Num,
		currency: Text,
		is_price_range: Bool,
		displayed_price: Text,
	})
	.nullish();

export const ImageElement = z.object({
	type: Text,
	alt: Text,
	url: Text,
	image_url: Text,
});

export const VideoElement = z.object({
	type: Text,
	source: Text,
	preview: Text,
	title: Text,
	timestamp: Text,
	url: Text,
});

export const Spell = z.object({ keyword: Text, type: Text }).nullish();

// Inputs

export const Location = {
	location_name: z.string().min(1).optional(),
	location_code: z.number().int().optional(),
	language_name: z.string().min(1).optional(),
	language_code: z.string().min(1).optional(),
};

export const Coordinate = {
	location_coordinate: z
		.string()
		.regex(
			/^-?\d+(\.\d{1,7})?,-?\d+(\.\d{1,7})?(,\d+)?$/,
			'Expected "latitude,longitude" or "latitude,longitude,radius"',
		)
		.optional(),
};

export const Tag = { tag: z.string().max(255).optional() };

export const Keyword = z.string().min(1).max(700);

export const RankScale = z.enum(['one_hundred', 'one_thousand']);

export const BacklinksStatus = z.enum(['all', 'live', 'lost']);

const FilterOperator = z.enum([
	'=',
	'<>',
	'<',
	'<=',
	'>',
	'>=',
	'in',
	'not_in',
	'like',
	'not_like',
	'ilike',
	'not_ilike',
	'regex',
	'not_regex',
	'match',
	'not_match',
]);

const FilterValue = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.number()])),
]);

const FilterCondition = z.tuple([z.string(), FilterOperator, FilterValue]);

export type Filter =
	| z.infer<typeof FilterCondition>
	| (z.infer<typeof FilterCondition> | 'and' | 'or' | Filter)[];

/**
 * A condition `["rank", ">", 80]`, or conditions joined by "and" / "or",
 * nested as needed: `[["rank", ">", 80], "and", ["dofollow", "=", true]]`.
 * The API accepts up to 8 conditions.
 */
const FilterTree: z.ZodType<Filter> = z.lazy(() =>
	z.union([
		FilterCondition,
		z.array(z.union([FilterCondition, z.enum(['and', 'or']), FilterTree])),
	]),
);

const MAX_FILTER_CONDITIONS = 8;

// A condition starts with its field name; a group starts with a condition or group.
function isCondition(
	filter: Filter,
): filter is z.infer<typeof FilterCondition> {
	const [first] = filter;
	return typeof first === 'string' && first !== 'and' && first !== 'or';
}

/** Counts conditions, or returns why the filter isn't condition, join, condition, …. */
function countConditions(filter: Filter): number | string {
	if (isCondition(filter)) return 1;
	if (filter.length % 2 === 0) {
		return 'Join filters as condition, "and" / "or", condition, …';
	}
	let count = 0;
	for (const [index, part] of filter.entries()) {
		const isJoin = part === 'and' || part === 'or';
		if (isJoin !== (index % 2 === 1)) {
			return 'Join filters as condition, "and" / "or", condition, …';
		}
		if (isJoin) continue;
		const nested = countConditions(part as Filter);
		if (typeof nested === 'string') return nested;
		count += nested;
	}
	return count;
}

export const Filters: z.ZodType<Filter> = FilterTree.superRefine(
	(filter, ctx) => {
		const count = countConditions(filter);
		if (typeof count === 'string') {
			ctx.addIssue({ code: 'custom', message: count });
		} else if (count > MAX_FILTER_CONDITIONS) {
			ctx.addIssue({
				code: 'custom',
				message: `At most ${MAX_FILTER_CONDITIONS} filter conditions`,
			});
		}
	},
);

/** Sorting rules like "rank,desc"; up to 3. */
export const OrderBy = z
	.array(z.string().regex(/^[\w.]+,(asc|desc)$/, 'Expected "field,asc|desc"'))
	.max(3);

export function hasLocation(input: {
	location_name?: string;
	location_code?: number;
	location_coordinate?: string;
}) {
	return (
		input.location_name !== undefined ||
		input.location_code !== undefined ||
		input.location_coordinate !== undefined
	);
}

export function hasLanguage(input: {
	language_name?: string;
	language_code?: string;
}) {
	return input.language_name !== undefined || input.language_code !== undefined;
}

export const locationMessage = {
	message: 'Provide location_name, location_code, or location_coordinate',
};

export const languageMessage = {
	message: 'Provide language_name or language_code',
};
