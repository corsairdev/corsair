import { z } from 'zod';

// Users and user preferences (developer.mixmax.com/reference, Users section).

export const UsersGetMeInputSchema = z.object({});

export type UsersGetMeInput = z.infer<typeof UsersGetMeInputSchema>;

// GET /v1/users/me returns the full current user document; only the stable
// identifier is pinned by the official schema and the rest is provider-
// defined, so the envelope validates `_id` and keeps the rest extensible.
export const UsersGetMeOutputSchema = z
	.object({
		_id: z.string(),
	})
	.passthrough();

export type UsersGetMeOutput = z.infer<typeof UsersGetMeOutputSchema>;

export const UserPreferencesGetInputSchema = z.object({
	fields: z.string().optional(),
	includeFinalDefaultCalendarUrl: z.coerce.boolean().optional(),
});

export type UserPreferencesGetInput = z.infer<
	typeof UserPreferencesGetInputSchema
>;

// GET /v1/userpreferences/me returns the user preferences document. The
// provider declares dozens of documented fields plus `+[anything]`, so the
// envelope stays extensible (passthrough) while remaining an object.
export const UserPreferencesGetOutputSchema = z.object({}).passthrough();

export type UserPreferencesGetOutput = z.infer<
	typeof UserPreferencesGetOutputSchema
>;

export const UserPreferencesUpdateInputSchema = z.object({}).passthrough();

export type UserPreferencesUpdateInput = z.infer<
	typeof UserPreferencesUpdateInputSchema
>;

// PATCH /v1/userpreferences/me answers 200 with the updated document.
export const UserPreferencesUpdateOutputSchema = z.object({}).passthrough();

export type UserPreferencesUpdateOutput = z.infer<
	typeof UserPreferencesUpdateOutputSchema
>;

export const UserPreferencesAutoBccListInputSchema = z.object({
	email: z.string().min(1),
});

export type UserPreferencesAutoBccListInput = z.infer<
	typeof UserPreferencesAutoBccListInputSchema
>;

// GET /v1/userpreferences/me/autoBccExcludedEmails answers 200 with the
// plain-text body `OK` when the address is excluded (and 404 otherwise), so
// the parsed output is that string — or undefined when the response carries
// no body.
export const UserPreferencesAutoBccListOutputSchema = z.union([
	z.string(),
	z.undefined(),
]);

export type UserPreferencesAutoBccListOutput = z.infer<
	typeof UserPreferencesAutoBccListOutputSchema
>;

export const UserPreferencesAutoBccAddInputSchema = z.object({
	email: z.string().optional(),
	emails: z.array(z.string()).optional(),
});

export type UserPreferencesAutoBccAddInput = z.infer<
	typeof UserPreferencesAutoBccAddInputSchema
>;

export const UserPreferencesAutoBccAddOutputSchema = z.object({
	results: z.array(
		z.object({
			email: z.string().optional(),
			success: z.boolean(),
		}),
	),
});

export type UserPreferencesAutoBccAddOutput = z.infer<
	typeof UserPreferencesAutoBccAddOutputSchema
>;

export const UserPreferencesAutoBccExistsInputSchema = z.object({
	emails: z.array(z.string()),
});

export type UserPreferencesAutoBccExistsInput = z.infer<
	typeof UserPreferencesAutoBccExistsInputSchema
>;

export const UserPreferencesAutoBccExistsOutputSchema = z.array(
	z.object({
		email: z.string(),
		exists: z.boolean(),
	}),
);

export type UserPreferencesAutoBccExistsOutput = z.infer<
	typeof UserPreferencesAutoBccExistsOutputSchema
>;
