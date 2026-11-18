import { z } from 'zod';

// Code snippets, the Formatted Code enhancement (developer.mixmax.com,
// Code Snippets section). Field names and types mirror the official
// CodeSnippet / CodeSnippetWrite schemas for /v1/codesnippets. The official
// `PATCH /v1/codesnippets/{id}` operation is not supported by the provider
// and is deliberately not implemented.

// The writable fields of a snippet. No field is required and values are
// stored as sent, without validation; fields other than these are ignored.
export const CodeSnippetWriteSchema = z.object({
	// The title shown when you pick the snippet with the `/code` command.
	title: z.string().optional(),
	// The highlighted HTML that is inserted into the email.
	html: z.string().optional(),
	// The plain source code.
	code: z.string().optional(),
	// The background color, for example `rgb(255, 255, 255)`.
	background: z.string().optional(),
	// The editor theme used for highlighting, for example `xcode`.
	theme: z.string().optional(),
	// The language used for highlighting, for example `javascript`.
	language: z.string().optional(),
});

export type CodeSnippetWrite = z.infer<typeof CodeSnippetWriteSchema>;

// A snippet as returned by the list and get endpoints: the read-only
// envelope plus the writable fields. Documented fields stay optional and the
// object stays passthrough: the provider may add detail it does not pin
// down.
export const CodeSnippetSchema = z
	.object({
		// The snippet id.
		_id: z.string().optional(),
		// The id of the user who created the snippet.
		userId: z.string().optional(),
		// ISO 8601 date-time string.
		createdAt: z.string().optional(),
		title: z.string().optional(),
		html: z.string().optional(),
		code: z.string().optional(),
		background: z.string().optional(),
		theme: z.string().optional(),
		language: z.string().optional(),
	})
	.passthrough();

export type CodeSnippet = z.infer<typeof CodeSnippetSchema>;

export const CodeSnippetPageSchema = z.object({
	results: z.array(CodeSnippetSchema),
	// Pass as `next` to get the following page.
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	// Pass as `previous` to get the page before this one.
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type CodeSnippetPage = z.infer<typeof CodeSnippetPageSchema>;

export const CodeSnippetsListInputSchema = z.object({
	// How many snippets per page; the provider defaults it to 50, at most
	// 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` value from the previous page.
	next: z.string().optional(),
	// The `previous` value from the following page.
	previous: z.string().optional(),
	// Comma-separated fields to return, for example `title,code`. Leave out
	// to return all fields.
	fields: z.string().optional(),
});

export type CodeSnippetsListInput = z.infer<typeof CodeSnippetsListInputSchema>;

export const CodeSnippetsListOutputSchema = CodeSnippetPageSchema;

export type CodeSnippetsListOutput = z.infer<
	typeof CodeSnippetsListOutputSchema
>;

// POST /v1/codesnippets body. Every field is optional: an empty body still
// creates an empty snippet.
export const CodeSnippetsCreateInputSchema = CodeSnippetWriteSchema;

export type CodeSnippetsCreateInput = z.infer<
	typeof CodeSnippetsCreateInputSchema
>;

// POST /v1/codesnippets answers 200 with only the new id; there is no API to
// update or delete a snippet afterwards.
export const CodeSnippetsCreateOutputSchema = z.object({
	// The id of the new snippet.
	id: z.string().optional(),
});

export type CodeSnippetsCreateOutput = z.infer<
	typeof CodeSnippetsCreateOutputSchema
>;

export const CodeSnippetsGetInputSchema = z.object({
	// The id of the code snippet.
	id: z.string().min(1),
});

export type CodeSnippetsGetInput = z.infer<typeof CodeSnippetsGetInputSchema>;

// GET /v1/codesnippets/{id} answers 200 with the snippet; a snippet that
// does not exist, or that belongs to someone else, answers 404 with an empty
// body.
export const CodeSnippetsGetOutputSchema = CodeSnippetSchema;

export type CodeSnippetsGetOutput = z.infer<typeof CodeSnippetsGetOutputSchema>;
