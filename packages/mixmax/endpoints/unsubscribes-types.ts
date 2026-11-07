import { z } from 'zod';

// Unsubscribes (developer.mixmax.com/reference, Unsubscribes section). Field
// names, types and limits mirror the official Unsubscribe / UnsubscribePage
// schemas and the documented POST and DELETE request bodies.

export const UnsubscribeSchema = z
	.object({
		_id: z.string().optional(),
		// The unsubscribed address, in lowercase.
		email: z.string().optional(),
		// The contact's name, if one was given.
		name: z.string().optional(),
		userId: z.string().optional(),
		orgId: z.string().optional(),
		messageId: z.string().optional(),
		sequenceId: z.string().optional(),
		// Present with `expand=sequence` when the record came from a sequence
		// unsubscribe; the provider declares only `_id` and `name` on it.
		sequence: z
			.object({
				_id: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
		// When the record was added, as an ISO 8601 date-time string. The
		// official schema declares no required fields on this document.
		createdAt: z.string().optional(),
	})
	.passthrough();

export type Unsubscribe = z.infer<typeof UnsubscribeSchema>;

export const UnsubscribesListInputSchema = z.object({
	// Returns only this address (case-insensitive exact match).
	email: z.string().optional(),
	// Field to sort by, for example `createdAt` or `email`; defaults to `_id`.
	sort: z.string().optional(),
	// Set to true to sort ascending; defaults to descending.
	sortAscending: z.coerce.boolean().optional(),
	// Number of records to return. Values above 300 return 300.
	limit: z.coerce.number().int().max(300).optional(),
	// The `next` token from a previous page.
	next: z.string().optional(),
	// The `previous` token from a previous page.
	previous: z.string().optional(),
	// Set to `sequence` to add a `sequence` object to matching records.
	expand: z.enum(['sequence']).optional(),
});

export type UnsubscribesListInput = z.infer<typeof UnsubscribesListInputSchema>;

export const UnsubscribesListOutputSchema = z.object({
	results: z.array(UnsubscribeSchema),
	hasNext: z.boolean().optional(),
	// Token for the next page.
	next: z.string().optional(),
	hasPrevious: z.boolean().optional(),
	// Token for the previous page.
	previous: z.string().optional(),
});

export type UnsubscribesListOutput = z.infer<
	typeof UnsubscribesListOutputSchema
>;

export const UnsubscribesCreateInputSchema = z.object({
	// The address to add. Required unless you send `emails`.
	email: z.string().optional(),
	// The contact's name, stored with `email`. Not used with `emails`.
	name: z.string().optional(),
	// Several addresses to add. Used only when `email` is not set.
	emails: z.array(z.string()).optional(),
});

export type UnsubscribesCreateInput = z.infer<
	typeof UnsubscribesCreateInputSchema
>;

// POST /v1/unsubscribes answers 204 with no body.
export const UnsubscribesCreateOutputSchema = z.undefined();

export type UnsubscribesCreateOutput = z.infer<
	typeof UnsubscribesCreateOutputSchema
>;

// The documented DELETE contract carries the address in a JSON body rather
// than the query string, so the input is that body shape itself.
export const UnsubscribesRemoveInputSchema = z.object({
	// The address to remove (case-insensitive).
	email: z.string(),
});

export type UnsubscribesRemoveInput = z.infer<
	typeof UnsubscribesRemoveInputSchema
>;

// DELETE /v1/unsubscribes answers 204 with no body, whether or not the
// address was on the list.
export const UnsubscribesRemoveOutputSchema = z.undefined();

export type UnsubscribesRemoveOutput = z.infer<
	typeof UnsubscribesRemoveOutputSchema
>;
