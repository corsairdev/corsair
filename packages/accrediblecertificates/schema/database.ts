import { z } from 'zod';

/**
 * Local mirror of a credential.
 *
 * Fields are taken from the `credential` object of `GET /v1/credentials/{id}`
 * in Accredible's official OpenAPI document (`openapi.json` in
 * `github.com/accredible/api-documentation`).
 *
 * Scalars and the small related objects that identify a credential are
 * mirrored. The bulk collections — `evidence_items`, `references` and `skills`
 * — are not: they are separately addressable resources in the API, and a flat
 * cache row is the wrong place for them.
 */
export const AccredibleCredentialEntity = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		group_name: z.string().nullish(),
		group_id: z.union([z.string(), z.number()]).nullish(),
		issued_on: z.string().nullish(),
		expired_on: z.string().nullish(),
		complete: z.boolean().nullish(),
		approve: z.boolean().nullish(),
		private: z.boolean().nullish(),
		grade: z.unknown().nullish(),
		url: z.string().nullish(),
		encoded_id: z.string().nullish(),
		course_link: z.string().nullish(),
		seo_image: z.string().nullish(),
		custom_attributes: z.record(z.string(), z.unknown()).nullish(),
		recipient_id: z.union([z.string(), z.number()]).nullish(),
		recipient_name: z.string().nullish(),
		recipient_email: z.string().nullish(),
		issuer_id: z.union([z.string(), z.number()]).nullish(),
		issuer_name: z.string().nullish(),
	})
	.loose();

export type AccredibleCredentialEntity = z.infer<
	typeof AccredibleCredentialEntity
>;
