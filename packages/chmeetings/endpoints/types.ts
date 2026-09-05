import { z } from 'zod';

export const PersonGetInputSchema = z.object({
	id: z.string(),
});

export type PersonGetInput = z.infer<typeof PersonGetInputSchema>;

/**
 * A ChMeetings person record, from GET /api/v1/people/{id}.
 *
 * The API returns snake_case fields (no `firstName`/`phone`): names are
 * `first_name`/`last_name`, and phone numbers live in `mobile` and
 * `telephone`. Everything except `id` is nullable per the OpenAPI spec, and
 * `.passthrough()` keeps custom member fields (e.g. `native_name`) present
 * in real responses but absent from the published DTO schema.
 */
export const PersonSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		first_name: z.string().nullable().optional(),
		middle_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		full_name: z.string().nullable().optional(),
		nick_name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		photo: z.string().nullable().optional(),
		birth_date: z.string().nullable().optional(),
		mobile: z.string().nullable().optional(),
		do_not_text: z.boolean().optional(),
		do_not_email: z.boolean().optional(),
		created_on: z.string().optional(),
		updated_on: z.string().optional(),
		facebook: z.string().nullable().optional(),
		gender: z.string().nullable().optional(),
		social_status: z.string().nullable().optional(),
		marriage_date: z.string().nullable().optional(),
		engagement_date: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		work_place: z.string().nullable().optional(),
		school: z.string().nullable().optional(),
		rank: z.string().nullable().optional(),
		family_role: z.string().nullable().optional(),
		family: z.array(z.unknown()).nullable().optional(),
		baptism_date: z.string().nullable().optional(),
		baptism_location: z.string().nullable().optional(),
		grade: z.string().nullable().optional(),
		graduation_year: z.string().nullable().optional(),
		telephone: z.string().nullable().optional(),
		is_archived: z.boolean().optional(),
		archived_at: z.string().optional(),
		address: z
			.object({
				country: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				addressLine: z.string().nullable().optional(),
				addressLine2: z.string().nullable().optional(),
				zipCode: z.string().nullable().optional(),
			})
			.nullable()
			.optional(),
		additional_fields: z.array(z.unknown()).nullable().optional(),
	})
	.passthrough();

export type Person = z.infer<typeof PersonSchema>;

export const PersonGetResponseSchema = PersonSchema;

export type PersonGetResponse = z.infer<typeof PersonGetResponseSchema>;

export type ChMeetingsEndpointInputs = {
	personGet: PersonGetInput;
};

export type ChMeetingsEndpointOutputs = {
	personGet: PersonGetResponse;
};

export const ChMeetingsEndpointInputSchemas = {
	personGet: PersonGetInputSchema,
} as const;

export const ChMeetingsEndpointOutputSchemas = {
	personGet: PersonGetResponseSchema,
} as const;
