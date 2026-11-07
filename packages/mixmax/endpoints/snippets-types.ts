import { z } from 'zod';

// Templates and their folders (developer.mixmax.com/reference, Templates
// section). In the backend templates are called snippets and their folders
// snippet tags, matching the /v1/snippets and /v1/snippettags paths. Field
// names, types, and limits mirror the official Snippet / SnippetPage /
// SnippetTag / SnippetTagPage / SnippetWrite / SnippetNameOptions schemas.

export const SnippetEmailRecipientSchema = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
});

export type SnippetEmailRecipient = z.infer<typeof SnippetEmailRecipientSchema>;

export const SnippetNameOptionsSchema = z.object({
	enforceNameUniqueness: z.boolean().optional(),
});

export type SnippetNameOptions = z.infer<typeof SnippetNameOptionsSchema>;

// Who an item is shared with. Each key holds the shares of one kind, each
// entry an object whose shape the provider leaves open
// (additionalProperties: true), and an empty object means not shared.
const SnippetSharedSchema = z
	.object({
		users: z.array(z.object({}).passthrough()).optional(),
		teams: z.array(z.object({}).passthrough()).optional(),
		orgs: z.array(z.object({}).passthrough()).optional(),
	})
	.passthrough();

// A template, or a snippet when `isInline` is true. Times are Unix
// milliseconds.
export const SnippetSchema = z
	.object({
		// The provider declares the id without a fixed type; the documents
		// carry string ids in practice, so the union keeps the id loosely
		// typed instead of pinning one shape.
		_id: z.union([z.string(), z.number()]).optional(),
		// The owner; not always the caller, since templates can be shared.
		userId: z.string().optional(),
		// The name shown in Mixmax; it is not inserted into emails.
		name: z.string().optional(),
		// The subject of emails written from this template.
		title: z.string().optional(),
		// The template's HTML.
		source: z.string().optional(),
		cc: z.array(SnippetEmailRecipientSchema).optional(),
		bcc: z.array(SnippetEmailRecipientSchema).optional(),
		// Attachment documents are provider-defined objects.
		attachments: z.array(z.object({}).passthrough()).optional(),
		shared: SnippetSharedSchema.optional(),
		// True for a snippet, which has no subject and cannot be sent alone.
		isInline: z.boolean().optional(),
		createdAt: z.number().optional(),
		savedAt: z.number().optional(),
		// Set when the template is in the trash.
		deletedAt: z.number().optional(),
		// Set when the template is archived.
		archivedAt: z.number().optional(),
		// provider declares savedBy as an opaque value; no narrower contract
		// is documented
		savedBy: z.unknown().optional(),
	})
	.passthrough();

export type Snippet = z.infer<typeof SnippetSchema>;

export const SnippetPageSchema = z.object({
	results: z.array(SnippetSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type SnippetPage = z.infer<typeof SnippetPageSchema>;

// A template or snippet folder. Times are Unix milliseconds.
export const SnippetTagSchema = z
	.object({
		_id: z.string().optional(),
		userId: z.string().optional(),
		name: z.string().optional(),
		shared: SnippetSharedSchema.optional(),
		// True for a snippet folder.
		isInline: z.boolean().optional(),
		// How many templates the folder holds; only present with
		// `expand=count`.
		count: z.number().optional(),
		createdAt: z.number().optional(),
		savedAt: z.number().optional(),
	})
	.passthrough();

export type SnippetTag = z.infer<typeof SnippetTagSchema>;

export const SnippetTagPageSchema = z.object({
	results: z.array(SnippetTagSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type SnippetTagPage = z.infer<typeof SnippetTagPageSchema>;

export const SnippetsListInputSchema = z.object({
	// Text or operators such as `name:"sales intro"` to filter by.
	search: z.string().optional(),
	// False for templates only, true for snippets only.
	isInline: z.coerce.boolean().optional(),
	// Any value, even false, lists only templates in the trash; leave it out
	// otherwise.
	deletedOnly: z.coerce.boolean().optional(),
	// Any value, even false, lists only archived templates; leave it out
	// otherwise.
	archivedOnly: z.coerce.boolean().optional(),
	// `name` (the default), `createdAt`, `savedAt`, or an `analytics` field.
	sort: z.string().optional(),
	// True to sort ascending.
	sortAscending: z.coerce.boolean().optional(),
	// Comma-separated: `analytics`, `userId`, or `snippetId`.
	expand: z.string().optional(),
	// How many templates per page.
	limit: z.coerce.number().int().optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type SnippetsListInput = z.infer<typeof SnippetsListInputSchema>;

export const SnippetsListOutputSchema = SnippetPageSchema;

export type SnippetsListOutput = z.infer<typeof SnippetsListOutputSchema>;

export const SnippetsGetInputSchema = z.object({
	id: z.string().min(1),
	// Any value, even false, also finds templates in the trash.
	includeDeleted: z.coerce.boolean().optional(),
	// `snippetId` turns `_id` into {_id, tagId}; `savedBy` adds who last
	// saved it.
	expand: z.string().optional(),
	// Comma-separated fields to return, a subset of the usual ones.
	fields: z.string().optional(),
});

export type SnippetsGetInput = z.infer<typeof SnippetsGetInputSchema>;

export const SnippetsGetOutputSchema = SnippetSchema;

export type SnippetsGetOutput = z.infer<typeof SnippetsGetOutputSchema>;

export const SnippetsUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z.string().optional(),
	// The subject. If the template has no name, setting it also sets the
	// name.
	title: z.string().optional(),
	// The template's HTML.
	source: z.string().optional(),
	cc: z.array(SnippetEmailRecipientSchema).optional(),
	bcc: z.array(SnippetEmailRecipientSchema).optional(),
	attachments: z.array(z.object({}).passthrough()).optional(),
	options: SnippetNameOptionsSchema.optional(),
	// Read from the query string, not the body: `savedBy` adds the id, name
	// and email of whoever last saved it.
	expand: z.string().optional(),
});

export type SnippetsUpdateInput = z.infer<typeof SnippetsUpdateInputSchema>;

// PATCH /v1/snippets/{id} answers 200 with the updated template.
export const SnippetsUpdateOutputSchema = SnippetSchema;

export type SnippetsUpdateOutput = z.infer<typeof SnippetsUpdateOutputSchema>;

export const SnippetsDeleteInputSchema = z.object({
	id: z.string().min(1),
	// Any value, even false, archives instead of trashing; leave it out to
	// trash.
	archive: z.coerce.boolean().optional(),
});

export type SnippetsDeleteInput = z.infer<typeof SnippetsDeleteInputSchema>;

// DELETE /v1/snippets/{id} answers 204 with no body.
export const SnippetsDeleteOutputSchema = z.undefined();

export type SnippetsDeleteOutput = z.infer<typeof SnippetsDeleteOutputSchema>;

export const SnippetsSendInputSchema = z.object({
	id: z.string().min(1),
	// The recipients. Send an array; a single object is rejected with 400.
	to: z.array(SnippetEmailRecipientSchema),
	// At least one recipient if sent; left out, the template's own cc is
	// used.
	cc: z.array(SnippetEmailRecipientSchema).optional(),
	// At least one recipient if sent; left out, the template's own bcc is
	// used.
	bcc: z.array(SnippetEmailRecipientSchema).optional(),
	// Defaults to the template's subject.
	subject: z.string().optional(),
	// Values for template variables by name; these win over the automatic
	// values filled from the first recipient's contact.
	variables: z.object({}).passthrough().optional(),
	// When to send, in Unix milliseconds; leave out to send right away.
	scheduledAt: z.coerce.number().int().optional(),
	trackingEnabled: z.coerce.boolean().optional(),
	linkTrackingEnabled: z.coerce.boolean().optional(),
	fileTrackingEnabled: z.coerce.boolean().optional(),
	notificationsEnabled: z.coerce.boolean().optional(),
});

export type SnippetsSendInput = z.infer<typeof SnippetsSendInputSchema>;

// POST /v1/snippets/{id}/send answers 204 with no body; it does not return
// the new message's id.
export const SnippetsSendOutputSchema = z.undefined();

export type SnippetsSendOutput = z.infer<typeof SnippetsSendOutputSchema>;

export const SnippetTagsListInputSchema = z.object({
	// Matches folders with a word in the name that starts with this text.
	search: z.string().optional(),
	// False for template folders only, true for snippet folders only.
	isInline: z.coerce.boolean().optional(),
	// Only `name` is supported; otherwise folders sort by creation date.
	sort: z.string().optional(),
	// True to sort ascending.
	sortAscending: z.coerce.boolean().optional(),
	// Comma-separated: `count` adds template counts, `userId` adds the
	// owner's email.
	expand: z.string().optional(),
	// How many folders per page, at most 200.
	limit: z.coerce.number().int().max(200).optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type SnippetTagsListInput = z.infer<typeof SnippetTagsListInputSchema>;

export const SnippetTagsListOutputSchema = SnippetTagPageSchema;

export type SnippetTagsListOutput = z.infer<typeof SnippetTagsListOutputSchema>;

export const SnippetTagsCreateInputSchema = z.object({
	// The folder name.
	name: z.string().min(1),
	options: SnippetNameOptionsSchema.optional(),
	// Read from the query string, not the body: pass true to create a
	// snippet folder.
	isInline: z.coerce.boolean().optional(),
});

export type SnippetTagsCreateInput = z.infer<
	typeof SnippetTagsCreateInputSchema
>;

// POST /v1/snippettags answers 200 with the new folder.
export const SnippetTagsCreateOutputSchema = SnippetTagSchema;

export type SnippetTagsCreateOutput = z.infer<
	typeof SnippetTagsCreateOutputSchema
>;

export const SnippetTagsGetInputSchema = z.object({
	id: z.string().min(1),
	// Comma-separated: `count` adds how many templates it has; `userId` adds
	// the owner's email.
	expand: z.string().optional(),
});

export type SnippetTagsGetInput = z.infer<typeof SnippetTagsGetInputSchema>;

export const SnippetTagsGetOutputSchema = SnippetTagSchema;

export type SnippetTagsGetOutput = z.infer<typeof SnippetTagsGetOutputSchema>;

export const SnippetTagsUpdateInputSchema = z.object({
	id: z.string().min(1),
	// Always send the name: a request without it clears the folder's name.
	name: z.string().min(1),
	options: SnippetNameOptionsSchema.optional(),
});

export type SnippetTagsUpdateInput = z.infer<
	typeof SnippetTagsUpdateInputSchema
>;

// PATCH /v1/snippettags/{id} answers 200 with the updated folder.
export const SnippetTagsUpdateOutputSchema = SnippetTagSchema;

export type SnippetTagsUpdateOutput = z.infer<
	typeof SnippetTagsUpdateOutputSchema
>;

export const SnippetTagsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type SnippetTagsDeleteInput = z.infer<
	typeof SnippetTagsDeleteInputSchema
>;

// DELETE /v1/snippettags/{id} answers 204 with no body; the folder's
// templates move to the trash.
export const SnippetTagsDeleteOutputSchema = z.undefined();

export type SnippetTagsDeleteOutput = z.infer<
	typeof SnippetTagsDeleteOutputSchema
>;

export const SnippetTagsListSnippetsInputSchema = z.object({
	id: z.string().min(1),
	// Same syntax as `search` on GET /v1/snippets.
	search: z.string().optional(),
	// `name` (the default), `createdAt`, `savedAt`, or an `analytics` field.
	sort: z.string().optional(),
	// True to sort ascending.
	sortAscending: z.coerce.boolean().optional(),
	// Comma-separated: `analytics` adds usage counts, `userId` adds the
	// owner's email.
	expand: z.string().optional(),
	// How many templates per page.
	limit: z.coerce.number().int().optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type SnippetTagsListSnippetsInput = z.infer<
	typeof SnippetTagsListSnippetsInputSchema
>;

export const SnippetTagsListSnippetsOutputSchema = SnippetPageSchema;

export type SnippetTagsListSnippetsOutput = z.infer<
	typeof SnippetTagsListSnippetsOutputSchema
>;

// POST /v1/snippettags/{id}/snippets either creates a template in the folder
// (send its fields without `_id`) or moves an existing one into it (send
// `_id`), so the body is the SnippetWrite fields plus the `_id` and
// `isInline` flags the official spec documents on this endpoint.
export const SnippetTagsAddSnippetsInputSchema = z.object({
	id: z.string().min(1),
	// An existing template to move into this folder instead of creating one;
	// moving it also restores a trashed or archived template.
	_id: z.string().optional(),
	// The string 'true' creates a snippet instead of a template.
	isInline: z.string().optional(),
	name: z.string().optional(),
	// The subject. If the template has no name, setting it also sets the
	// name.
	title: z.string().optional(),
	// The template's HTML.
	source: z.string().optional(),
	cc: z.array(SnippetEmailRecipientSchema).optional(),
	bcc: z.array(SnippetEmailRecipientSchema).optional(),
	attachments: z.array(z.object({}).passthrough()).optional(),
	options: SnippetNameOptionsSchema.optional(),
});

export type SnippetTagsAddSnippetsInput = z.infer<
	typeof SnippetTagsAddSnippetsInputSchema
>;

// POST /v1/snippettags/{id}/snippets answers 200 with the created or moved
// template.
export const SnippetTagsAddSnippetsOutputSchema = SnippetSchema;

export type SnippetTagsAddSnippetsOutput = z.infer<
	typeof SnippetTagsAddSnippetsOutputSchema
>;
