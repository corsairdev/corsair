import { z } from 'zod';

/**
 * Schemas transcribed from Accredible's official OpenAPI 3.0.3 document
 * (`openapi.json` in `github.com/accredible/api-documentation`), operation
 * `GET /v1/credentials/{id}` — "View a Credential".
 *
 * Every object is `.loose()` and every field optional: the document describes
 * a single example response rather than a strict contract, and responses are
 * parsed at the client, so an undeclared or absent field must degrade to a
 * missing value rather than failing the call.
 */

/** `credential.recipient` */
const RecipientSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone_number: z.string().nullish(),
		meta_data: z.unknown().nullish(),
	})
	.loose();

/** `credential.issuer` */
const IssuerSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

/** One entry of `credential.evidence_items` */
const EvidenceItemSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		description: z.string().nullish(),
		preview_image_url: z.string().nullish(),
		link_url: z.string().nullish(),
		type: z.string().nullish(),
		string_object: z.unknown().nullish(),
		supplemental: z.boolean().nullish(),
		position: z.number().nullish(),
	})
	.loose();

/** One entry of `credential.references` */
const ReferenceSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		description: z.string().nullish(),
		relationship: z.string().nullish(),
		supplemental: z.boolean().nullish(),
		approve: z.boolean().nullish(),
		referee: z
			.object({
				name: z.string().nullish(),
				email: z.string().nullish(),
				avatar: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** One entry of `credential.skills` */
const SkillSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		identifier: z.string().nullish(),
		description: z.string().nullish(),
		url: z.string().nullish(),
		breadcrumbs: z.unknown().nullish(),
	})
	.loose();

/** `credential.certificate` and `credential.badge` share this shape. */
const ArtworkSchema = z
	.object({
		image: z.object({ preview: z.string().nullish() }).loose().nullish(),
	})
	.loose();

/** The `credential` object returned by `GET /v1/credentials/{id}`. */
export const CredentialSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().nullish(),
		description: z.string().nullish(),
		approve: z.boolean().nullish(),
		grade: z.unknown().nullish(),
		complete: z.boolean().nullish(),
		issued_on: z.string().nullish(),
		expired_on: z.string().nullish(),
		course_link: z.string().nullish(),
		custom_attributes: z.record(z.string(), z.unknown()).nullish(),
		group_name: z.string().nullish(),
		group_id: z.union([z.string(), z.number()]).nullish(),
		url: z.string().nullish(),
		encoded_id: z.string().nullish(),
		private: z.boolean().nullish(),
		seo_image: z.string().nullish(),
		certificate: ArtworkSchema.nullish(),
		badge: ArtworkSchema.nullish(),
		evidence_items: z.array(EvidenceItemSchema).nullish(),
		references: z.array(ReferenceSchema).nullish(),
		recipient: RecipientSchema.nullish(),
		issuer: IssuerSchema.nullish(),
		meta_data: z.unknown().nullish(),
		skills: z.array(SkillSchema).nullish(),
	})
	.loose();

export type Credential = z.infer<typeof CredentialSchema>;

/**
 * `id` is a path segment, so it must be a non-empty scalar. It is encoded at
 * the call site; rejecting blank values here keeps `/credentials/` — which
 * would hit the collection route — from being requested by accident.
 */
const GetCredentialInputSchema = z.object({
	id: z.union([z.string().trim().min(1), z.number()]),
});

export type GetCredentialInput = z.infer<typeof GetCredentialInputSchema>;

const GetCredentialResponseSchema = z
	.object({
		credential: CredentialSchema,
	})
	.loose();

export type GetCredentialResponse = z.infer<typeof GetCredentialResponseSchema>;

export type AccredibleCertificatesEndpointInputs = {
	getCredential: GetCredentialInput;
};

export type AccredibleCertificatesEndpointOutputs = {
	getCredential: GetCredentialResponse;
};

export const AccredibleCertificatesEndpointInputSchemas = {
	getCredential: GetCredentialInputSchema,
} as const;

export const AccredibleCertificatesEndpointOutputSchemas = {
	getCredential: GetCredentialResponseSchema,
} as const;
