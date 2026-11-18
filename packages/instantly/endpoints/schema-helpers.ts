import { z } from 'zod';

// Building blocks shared by types.ts and types-extended.ts.

export const str = z.string().nullish();
export const num = z.number().nullish();
export const bool = z.boolean().nullish();
// unknown: nested settings objects are passed through as returned.
export const obj = z.record(z.string(), z.unknown()).nullish();
// unknown: a nested list the spec does not type item by item; passed
// through as returned.
export const list = z.array(z.unknown()).nullish();
// unknown: a free-form object the API accepts or returns as-is (lead filter
// values, automation rules, schedule entries past the typed depth).
export const freeForm = () => z.record(z.string(), z.unknown());
// unknown: a value the spec leaves untyped, or whose live type varies.
export const untyped = z.unknown().optional();

export const Id = (what: string) =>
	z.string().min(1).describe(`${what} ID (UUID)`);

export const Limit = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Items per page, 1 to 100');

export const StartingAfter = z
	.string()
	.min(1)
	.optional()
	.describe('Cursor: `next_starting_after` from the previous page');

export const Paging = { limit: Limit, starting_after: StartingAfter };

export function page<T extends z.ZodType>(item: T) {
	return z
		.object({
			items: z.array(item),
			next_starting_after: str.describe(
				'Pass as starting_after to get the next page; absent on the last page',
			),
		})
		.loose();
}

export const IsoDate = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}/, 'Expected YYYY-MM-DD or an ISO 8601 timestamp')
	.describe('YYYY-MM-DD (UTC midnight) or an ISO 8601 timestamp');

/**
 * What a write or delete returns when Instantly accepted it but answered in
 * a shape the plugin did not expect: the raw body plus parse_warning. The
 * change already happened, so the call must not fail (an agent would repeat
 * an upload that already counted toward the contact limit, or a reply).
 */
export const UnverifiedWriteResultSchema = z
	.object({
		parse_warning: z
			.string()
			.describe(
				'Instantly accepted the request but its response had an unexpected shape; the change was made, do not repeat it',
			),
	})
	.loose();

export type UnverifiedWriteResult = z.infer<typeof UnverifiedWriteResultSchema>;

export function write<T extends z.ZodType>(schema: T) {
	return z.union([schema, UnverifiedWriteResultSchema]);
}
