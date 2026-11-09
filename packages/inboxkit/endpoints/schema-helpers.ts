import { z } from 'zod';

// Building blocks for the schemas in endpoints/schemas/. Every response field is
// nullish and every response object loose: InboxKit's docs describe its answers
// well but not exactly, and a field they get wrong must not cost a caller the
// answer. See endpoints/call.ts for what happens when one still doesn't fit.

export const str = z.string().nullish();
export const num = z.number().nullish();
/** The docs call these strings and the API sends numbers; both are accepted. */
export const numeric = z.union([z.number(), z.string()]).nullish();
export const bool = z.boolean().nullish();
// unknown: a nested object the docs don't type, or past the typed depth; passed through as returned.
export const obj = z.record(z.string(), z.unknown()).nullish();
// unknown: a nested list the docs don't type item by item; passed through as returned.
export const list = z.array(z.unknown()).nullish();
// unknown: a free-form object the API accepts as-is, such as request_data.
export const freeForm = () => z.record(z.string(), z.unknown());
// unknown: a value the docs leave untyped, or give several shapes.
export const untyped = z.unknown().optional();
// unknown: an input the docs leave untyped, passed to InboxKit as given.
export const anyValue = z.unknown();
/** For the few routes whose docs show no response fields. */
export const looseResult = z.object({}).loose();

/** Added by the plugin, sent as the X-Workspace-Id header. */
export const WorkspaceId = z
	.string()
	.min(1)
	.optional()
	.describe(
		"Which workspace, as a uid from workspaces.list. Leave out to use the plugin's workspaceId option or, failing that, the team's only workspace.",
	);
