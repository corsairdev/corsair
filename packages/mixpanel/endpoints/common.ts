import { z } from 'zod';

// Inputs use Mixpanel's own parameter names, so a parameter maps one to one.
// Outputs are `.loose()` with nullish fields, so a field Mixpanel adds or
// omits cannot fail a call that has already happened. Shapes come from
// Mixpanel's OpenAPI files (github.com/mixpanel/docs, openapi/) and from live
// calls on a free project.

/** Mixpanel dates are `yyyy-mm-dd`, inclusive on both ends. */
export const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date');

export const IdSchema = z.number().int().positive();

export const WorkspaceIdSchema = IdSchema.optional().describe(
	'The workspace (data view) to run in; omit for the project default.',
);

export const RequiredWorkspaceIdSchema = IdSchema.describe(
	'The workspace (data view) id, from the project URL (/project/<id>/view/<workspace>).',
);

export const OrganizationIdSchema = IdSchema.describe(
	'The organization id (Organization Settings, Overview).',
);

// unknown: free-form property bags (event properties, profile properties,
// report series) carry whatever the project tracked.
export const PropertiesSchema = z.record(z.string(), z.unknown());

// unknown: an open object passed through as Mixpanel sends it.
export const LooseObject = z.object({}).loose();

/** `{ status: "ok", results }` as the app API wraps most answers. */
export function okEnvelope<T extends z.ZodType>(results: T) {
	return z
		.object({
			status: z.string().nullish(),
			results: results.nullish(),
		})
		.loose();
}

/** The verbose ingestion answer: `{ status: 1, error: null }`. */
export const IngestionResultSchema = z
	.object({
		status: z.union([z.number(), z.string()]).nullish(),
		error: z.string().nullish(),
	})
	.loose();

/** Query parameters that take a JSON-encoded list on the wire. */
export function jsonList(
	values: readonly string[] | undefined,
): string | undefined {
	return values ? JSON.stringify(values) : undefined;
}

/** Builds a form body, skipping undefined values and JSON-encoding objects. */
export function form(
	// unknown: validated input values, scalars, lists or objects.
	fields: Record<string, unknown>,
): string {
	const body = new URLSearchParams();
	for (const [key, value] of Object.entries(fields)) {
		if (value === undefined || value === null) continue;
		body.set(
			key,
			typeof value === 'object' ? JSON.stringify(value) : String(value),
		);
	}
	return body.toString();
}

export const FORM = 'application/x-www-form-urlencoded';

export function checkDateRange(
	value: { from_date: string; to_date: string },
	ctx: z.RefinementCtx,
) {
	if (value.from_date > value.to_date) {
		ctx.addIssue({
			code: 'custom',
			message: 'from_date must not be after to_date',
		});
	}
}

/** Wraps a bare array answer so callers read a named field. */
// unknown: the raw body before the output schema parses it.
export function wrapArray(key: string) {
	return (raw: unknown) => ({ [key]: raw });
}
