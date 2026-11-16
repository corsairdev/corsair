import { z } from 'zod';

/**
 * Truvera's shapes come from its published OpenAPI document, which the Swagger
 * UI serves at `https://swagger-api.truvera.io/openapi.yaml`. The schemas below
 * mirror the fields the plugin exposes, and every response object is `.loose()`
 * because Truvera sends many more fields than a caller reads.
 */

/** A DID is a `did:` URI, up to 512 characters. */
const DidSchema = z
	.string()
	.min(8)
	.max(512)
	.describe('A fully qualified DID, such as did:cheqd:mainnet:abc');

/**
 * A DID document array holds identifiers, which are strings, or embedded method
 * and service objects. The union documents both without falling back to
 * `unknown`, which the reference page would print as `any`.
 */
const DidDocumentEntrySchema = z.union([z.string(), z.object({}).loose()]);

const DidDocumentSchema = z
	.object({
		id: z.string().nullish(),
		controller: z.union([z.string(), z.array(z.string())]).nullish(),
		alsoKnownAs: z.array(DidDocumentEntrySchema).nullish(),
		verificationMethod: z.array(DidDocumentEntrySchema).nullish(),
		authentication: z.array(DidDocumentEntrySchema).nullish(),
		assertionMethod: z.array(DidDocumentEntrySchema).nullish(),
		keyAgreement: z.array(DidDocumentEntrySchema).nullish(),
		capabilityInvocation: z.array(DidDocumentEntrySchema).nullish(),
		capabilityDelegation: z.array(DidDocumentEntrySchema).nullish(),
		service: z.array(DidDocumentEntrySchema).nullish(),
	})
	.loose();
export type DidDocumentOutput = z.output<typeof DidDocumentSchema>;

const DidMetadataSchema = z
	.object({
		did: z.string().nullish(),
		controller: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		deactivated: z.boolean().nullish(),
		versionId: z.string().nullish(),
	})
	.loose();

/** A profile is a DID plus the display information for it. */
const ProfileSchema = z
	.object({
		did: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		logo: z.string().nullish(),
		website: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();
export type ProfileOutput = z.output<typeof ProfileSchema>;

/**
 * Credential metadata, as the list and get routes return it. `credential` holds
 * the signed document only when it was persisted and requested with a password.
 */
const CredentialMetadataSchema = z
	.object({
		id: z.string().nullish(),
		issuerKey: z.string().nullish(),
		issuerName: z.string().nullish(),
		type: z.string().nullish(),
		revocationRegistry: z.string().nullish(),
		revoked: z.boolean().nullish(),
		createdAt: z.string().nullish(),
		expiryDate: z.string().nullish(),
		expirationDate: z.string().nullish(),
		issuanceDate: z.string().nullish(),
		byteSize: z.number().nullish(),
		persist: z.boolean().nullish(),
		index: z.string().nullish(),
		subjectRef: z.string().nullish(),
		subjectId: z.string().nullish(),
		whitelabel: z.number().nullish(),
		algorithm: z.string().nullish(),
		credential: z.object({}).loose().nullish(),
		warning: z.string().nullish(),
	})
	.loose();
export type CredentialMetadataOutput = z.output<
	typeof CredentialMetadataSchema
>;

/** A signed verifiable credential, as the issue route returns it. */
const VerifiableCredentialSchema = z
	.object({
		'@context': z
			.union([z.string(), z.array(DidDocumentEntrySchema)])
			.nullish(),
		id: z.string().nullish(),
		type: z.array(z.string()).nullish(),
		credentialSubject: z
			.union([z.object({}).loose(), z.array(z.object({}).loose())])
			.nullish(),
		issuer: z.union([z.string(), z.object({}).loose()]).nullish(),
		issuanceDate: z.string().nullish(),
		expirationDate: z.string().nullish(),
		credentialStatus: z.union([z.string(), z.object({}).loose()]).nullish(),
		proof: z
			.union([z.object({}).loose(), z.array(z.object({}).loose())])
			.nullish(),
	})
	.loose();
export type VerifiableCredentialOutput = z.output<
	typeof VerifiableCredentialSchema
>;

/**
 * A JSON Schema property can itself be a schema, so this type refers to itself.
 * Zod needs `z.lazy` for a recursive shape; the result is still a plain object
 * and the reference page renders it as an object rather than `any`.
 */
type JsonSchemaNode =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JsonSchemaNode }
	| JsonSchemaNode[];

const JsonSchemaValueSchema: z.ZodType<JsonSchemaNode> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonSchemaValueSchema),
		z.record(z.string(), JsonSchemaValueSchema),
	]),
);

const SchemaSchema = z
	.object({
		id: z.string().nullish(),
		$schema: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		type: z.string().nullish(),
		properties: z.record(z.string(), JsonSchemaValueSchema).nullish(),
		required: z.array(z.string()).nullish(),
		additionalProperties: z.boolean().nullish(),
		$metadata: z.object({}).loose().nullish(),
	})
	.loose();
export type SchemaOutput = z.output<typeof SchemaSchema>;

const RegistrySchema = z
	.object({
		id: z.string().nullish(),
		addOnly: z.boolean().nullish(),
		policy: z.array(z.union([z.string(), z.object({}).loose()])).nullish(),
		type: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();
export type RegistryOutput = z.output<typeof RegistrySchema>;

const RevocationStatusSchema = z
	.object({
		status: z.string().nullish().describe('Revoked, unrevoked, or suspended'),
		type: z.string().nullish(),
		revoked: z.boolean().nullish(),
	})
	.loose();
export type RevocationStatusOutput = z.output<typeof RevocationStatusSchema>;

const VerificationResultSchema = z
	.object({
		verified: z.boolean().nullish(),
		results: z.array(z.object({}).loose()).nullish(),
		errors: z.array(z.object({}).loose()).nullish(),
	})
	.loose();
export type VerificationResultOutput = z.output<
	typeof VerificationResultSchema
>;

const JobSchema = z
	.object({
		id: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('queued, running, succeeded, or failed'),
		result: z.object({}).loose().nullish(),
		error: z.object({}).loose().nullish(),
	})
	.loose();
export type JobOutput = z.output<typeof JobSchema>;

/** A delete answers 200 with an empty object. */
const DeleteResultSchema = z.object({}).loose();

// The spec documents a profile delete as a 200 with no body, which core hands
// back as undefined; any body that does arrive must still be an object.
const DeleteProfileResultSchema = z.union([
	z.object({}).loose(),
	z.undefined(),
]);

/** Truvera pages its lists with offset and limit (64 by default). */
const PagingShape = {
	offset: z.number().int().min(0).optional().describe('Default 0'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(64)
		.optional()
		.describe('Default and maximum 64'),
} as const;

// ---------------------------------------------------------------------------
// dids
// ---------------------------------------------------------------------------

const ListDidsInputSchema = z.object({ ...PagingShape });
export type ListDidsInput = z.input<typeof ListDidsInputSchema>;

const DidListSchema = z.array(z.union([z.string(), DidDocumentSchema]));
export type DidListOutput = z.output<typeof DidListSchema>;

const CreateDidInputSchema = z.object({
	type: z
		.string()
		.optional()
		.describe('DID method, such as cheqd, key, or dock'),
	key_type: z
		.string()
		.optional()
		.describe('Signing key type, such as ed25519 or secp256k1'),
	controller: z
		.string()
		.optional()
		.describe('Controller DID, when it is not the DID itself'),
	didcomm_service_url: z
		.string()
		.optional()
		.describe('DIDComm endpoint to add to the document'),
	include_didcomm_service: z.boolean().optional(),
});
export type CreateDidInput = z.input<typeof CreateDidInputSchema>;

const CreateDidOutputSchema = z
	.object({
		did: z.string().nullish(),
		controller: z.string().nullish(),
		didDocument: DidDocumentSchema.nullish(),
		keyId: z.string().nullish(),
	})
	.loose();
export type CreateDidOutput = z.output<typeof CreateDidOutputSchema>;

const DidInputSchema = z.object({ did: DidSchema });
export type DidInput = z.input<typeof DidInputSchema>;

const GetDidOutputSchema = z
	.object({
		didDocument: DidDocumentSchema.nullish(),
		didDocumentMetadata: DidMetadataSchema.nullish(),
	})
	.loose();
export type GetDidOutput = z.output<typeof GetDidOutputSchema>;

const DidMetadataOutputSchema = DidMetadataSchema;
export type DidMetadataOutput = z.output<typeof DidMetadataOutputSchema>;

// ---------------------------------------------------------------------------
// profiles
// ---------------------------------------------------------------------------

const ListProfilesInputSchema = z.object({ ...PagingShape });
export type ListProfilesInput = z.input<typeof ListProfilesInputSchema>;

const ProfileListSchema = z.array(ProfileSchema);

const CreateProfileInputSchema = z.object({
	did: DidSchema,
});
export type CreateProfileInput = z.input<typeof CreateProfileInputSchema>;

const UpdateProfileInputSchema = z.object({
	did: DidSchema,
	name: z.string().optional(),
	description: z.string().optional(),
	logo: z.string().optional(),
	website: z.string().optional().describe('A URL for the profile'),
	email: z.email().optional(),
});
export type UpdateProfileInput = z.input<typeof UpdateProfileInputSchema>;

// ---------------------------------------------------------------------------
// credentials
// ---------------------------------------------------------------------------

const IssueCredentialInputSchema = z
	.object({
		credential: z
			.object({
				id: z.string().optional().describe('Ideal as a URI or UUID'),
				name: z.string().optional(),
				description: z.string().optional(),
				schema: z
					.string()
					.optional()
					.describe('Schema URI that the type and subject follow'),
				context: z
					.union([z.string(), z.array(DidDocumentEntrySchema)])
					.optional()
					.describe(
						'JSON-LD context; generated from the properties when omitted',
					),
				type: z.array(z.string()).optional(),
				// Claim values are any JSON value, arrays included.
				subject: z
					.union([
						z.record(z.string(), JsonSchemaValueSchema),
						z.array(z.record(z.string(), JsonSchemaValueSchema)),
					])
					.optional()
					.describe('One subject, or an array for several'),
				issuer: z.string().min(8).describe('A DID the account controls'),
				issuanceDate: z.iso.datetime().optional(),
				expirationDate: z.iso.datetime().optional(),
				status: z
					.union([z.string(), z.object({}).loose()])
					.nullish()
					.describe(
						'A revocation registry id, to make the credential revocable',
					),
			})
			.describe('The credential to sign'),
		persist: z
			.boolean()
			.optional()
			.describe('Store an encrypted copy; requires `password`'),
		password: z
			.string()
			.min(4)
			.max(32)
			.optional()
			.describe('Encrypts a persisted credential; never stored by the plugin'),
		recipient_did: z
			.string()
			.max(512)
			.optional()
			.describe("The holder's DID for DID distribution"),
		recipient_email: z
			.email()
			.max(256)
			.optional()
			.describe("The holder's email for email distribution"),
		algorithm: z
			.string()
			.optional()
			.describe('Signing algorithm; dockbbs enables zero-knowledge proofs'),
		distribute: z.boolean().optional(),
		format: z
			.enum(['jsonld', 'jwt', 'sdjwt'])
			.optional()
			.describe('Default jsonld'),
		revocable: z
			.boolean()
			.optional()
			.describe('Provision a revocation registry automatically'),
	})
	.superRefine((value, ctx) => {
		// Truvera persists only when a password is supplied, and refuses the
		// request otherwise. Catching it here saves a call.
		if (value.persist === true && value.password === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: '`password` is required when `persist` is true',
				path: ['password'],
			});
		}
		// Distribution needs somewhere to send it: an email, a DID, or the
		// holder DID in `credentialSubject.id`, which Truvera documents for DID
		// distribution.
		const subjects = value.credential.subject;
		const subjectHasDid = (
			Array.isArray(subjects) ? subjects : subjects ? [subjects] : []
		).some((entry) => typeof entry.id === 'string' && entry.id.length > 0);
		if (
			value.distribute === true &&
			value.recipient_email === undefined &&
			value.recipient_did === undefined &&
			!subjectHasDid
		) {
			ctx.addIssue({
				code: 'custom',
				message:
					'`distribute` needs `recipient_email`, `recipient_did` or a holder DID in `credential.subject.id`',
				path: ['recipient_email'],
			});
		}
	});
export type IssueCredentialInput = z.input<typeof IssueCredentialInputSchema>;

const ListCredentialsInputSchema = z.object({
	offset: z.number().int().min(0).optional().describe('Default 0'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Default 64, max 100'),
	filter: z
		.string()
		.max(512)
		.optional()
		.describe('Filter by id, subject, issuer or date'),
	subject_id: z.string().max(512).optional().describe('Filter by holder DID'),
});
export type ListCredentialsInput = z.input<typeof ListCredentialsInputSchema>;

const CredentialListSchema = z.array(CredentialMetadataSchema);

const CredentialIdInputSchema = z.object({
	credential_id: z
		.string()
		.min(8)
		.max(2048)
		.describe('The credential URI, as the issue or list route returned it'),
});
export type CredentialIdInput = z.input<typeof CredentialIdInputSchema>;

const DeleteCredentialInputSchema = z.object({
	credential_id: z.string().min(8).max(2048),
	password: z
		.string()
		.min(4)
		.max(64)
		.optional()
		.describe('Deprecated: only for retrieving a persisted credential body'),
});
export type DeleteCredentialInput = z.input<typeof DeleteCredentialInputSchema>;

// ---------------------------------------------------------------------------
// schemas
// ---------------------------------------------------------------------------

const CreateSchemaInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	type: z.string().optional().describe('JSON Schema type, usually object'),
	properties: z
		.record(z.string(), JsonSchemaValueSchema)
		.describe('JSON Schema properties that a credential may set'),
	required: z.array(z.string()).optional(),
	additional_properties: z.boolean().optional(),
});
export type CreateSchemaInput = z.input<typeof CreateSchemaInputSchema>;

const ListSchemasInputSchema = z.object({ ...PagingShape });
export type ListSchemasInput = z.input<typeof ListSchemasInputSchema>;

const SchemaListSchema = z.array(SchemaSchema);

const SchemaIdInputSchema = z.object({
	schema_id: z.string().min(1).describe('The schema URI or id'),
});
export type SchemaIdInput = z.input<typeof SchemaIdInputSchema>;

// ---------------------------------------------------------------------------
// registries
// ---------------------------------------------------------------------------

const CreateRegistryInputSchema = z.object({
	type: z.string().optional().describe('Registry type, such as dock or cheqd'),
	add_only: z
		.boolean()
		.optional()
		.describe('Once true, entries can never be removed'),
	policy: z.array(z.union([z.string(), z.object({}).loose()])).optional(),
});
export type CreateRegistryInput = z.input<typeof CreateRegistryInputSchema>;

const ListRegistriesInputSchema = z.object({ ...PagingShape });
export type ListRegistriesInput = z.input<typeof ListRegistriesInputSchema>;

const RegistryListSchema = z.array(RegistrySchema);

const RegistryIdInputSchema = z.object({
	registry_id: z.string().min(1),
});
export type RegistryIdInput = z.input<typeof RegistryIdInputSchema>;

const RevokeInRegistryInputSchema = z.object({
	registry_id: z.string().min(1),
	credential_ids: z
		.array(z.string())
		.min(1)
		.describe('Credentials to revoke or unrevoke in this registry'),
	action: z.enum(['revoke', 'unrevoke']).describe('Which direction to apply'),
});
export type RevokeInRegistryInput = z.input<typeof RevokeInRegistryInputSchema>;

const RevocationStatusInputSchema = z.object({
	registry_id: z.string().min(1),
	revocation_id: z
		.string()
		.min(1)
		.describe('The credential index within the registry'),
});
export type RevocationStatusInput = z.input<typeof RevocationStatusInputSchema>;

// ---------------------------------------------------------------------------
// verification and jobs
// ---------------------------------------------------------------------------

const VerifyInputSchema = z.object({
	credential: z
		.record(z.string(), JsonSchemaValueSchema)
		.describe('A verifiable credential or presentation, as JSON'),
});
export type VerifyInput = z.input<typeof VerifyInputSchema>;

const JobIdInputSchema = z.object({ job_id: z.string().min(1) });
export type JobIdInput = z.input<typeof JobIdInputSchema>;

export type TruveraEndpointInputs = {
	listDids: ListDidsInput;
	createDid: CreateDidInput;
	getDid: DidInput;
	getDidMetadata: DidInput;
	deleteDid: DidInput;
	listProfiles: ListProfilesInput;
	createProfile: CreateProfileInput;
	getProfile: DidInput;
	updateProfile: UpdateProfileInput;
	deleteProfile: DidInput;
	issueCredential: IssueCredentialInput;
	listCredentials: ListCredentialsInput;
	getCredential: CredentialIdInput;
	deleteCredential: DeleteCredentialInput;
	revokeCredential: CredentialIdInput;
	unrevokeCredential: CredentialIdInput;
	createSchema: CreateSchemaInput;
	listSchemas: ListSchemasInput;
	getSchema: SchemaIdInput;
	deleteSchema: SchemaIdInput;
	createRegistry: CreateRegistryInput;
	listRegistries: ListRegistriesInput;
	getRegistry: RegistryIdInput;
	deleteRegistry: RegistryIdInput;
	revokeInRegistry: RevokeInRegistryInput;
	getRevocationStatus: RevocationStatusInput;
	verify: VerifyInput;
	getJob: JobIdInput;
};

export type TruveraEndpointOutputs = {
	listDids: DidListOutput;
	createDid: CreateDidOutput;
	getDid: GetDidOutput;
	getDidMetadata: DidMetadataOutput;
	deleteDid: z.output<typeof DeleteResultSchema>;
	listProfiles: z.output<typeof ProfileListSchema>;
	createProfile: ProfileOutput;
	getProfile: ProfileOutput;
	updateProfile: ProfileOutput;
	deleteProfile: z.output<typeof DeleteProfileResultSchema>;
	issueCredential: VerifiableCredentialOutput;
	listCredentials: z.output<typeof CredentialListSchema>;
	getCredential: CredentialMetadataOutput;
	deleteCredential: z.output<typeof DeleteResultSchema>;
	revokeCredential: z.output<typeof DeleteResultSchema>;
	unrevokeCredential: z.output<typeof DeleteResultSchema>;
	createSchema: SchemaOutput;
	listSchemas: z.output<typeof SchemaListSchema>;
	getSchema: SchemaOutput;
	deleteSchema: z.output<typeof DeleteResultSchema>;
	createRegistry: RegistryOutput;
	listRegistries: z.output<typeof RegistryListSchema>;
	getRegistry: RegistryOutput;
	deleteRegistry: z.output<typeof DeleteResultSchema>;
	revokeInRegistry: z.output<typeof DeleteResultSchema>;
	getRevocationStatus: RevocationStatusOutput;
	verify: VerificationResultOutput;
	getJob: JobOutput;
};

export const TruveraEndpointInputSchemas = {
	listDids: ListDidsInputSchema,
	createDid: CreateDidInputSchema,
	getDid: DidInputSchema,
	getDidMetadata: DidInputSchema,
	deleteDid: DidInputSchema,
	listProfiles: ListProfilesInputSchema,
	createProfile: CreateProfileInputSchema,
	getProfile: DidInputSchema,
	updateProfile: UpdateProfileInputSchema,
	deleteProfile: DidInputSchema,
	issueCredential: IssueCredentialInputSchema,
	listCredentials: ListCredentialsInputSchema,
	getCredential: CredentialIdInputSchema,
	deleteCredential: DeleteCredentialInputSchema,
	revokeCredential: CredentialIdInputSchema,
	unrevokeCredential: CredentialIdInputSchema,
	createSchema: CreateSchemaInputSchema,
	listSchemas: ListSchemasInputSchema,
	getSchema: SchemaIdInputSchema,
	deleteSchema: SchemaIdInputSchema,
	createRegistry: CreateRegistryInputSchema,
	listRegistries: ListRegistriesInputSchema,
	getRegistry: RegistryIdInputSchema,
	deleteRegistry: RegistryIdInputSchema,
	revokeInRegistry: RevokeInRegistryInputSchema,
	getRevocationStatus: RevocationStatusInputSchema,
	verify: VerifyInputSchema,
	getJob: JobIdInputSchema,
} as const;

export const TruveraEndpointOutputSchemas = {
	listDids: DidListSchema,
	createDid: CreateDidOutputSchema,
	getDid: GetDidOutputSchema,
	getDidMetadata: DidMetadataSchema,
	deleteDid: DeleteResultSchema,
	listProfiles: ProfileListSchema,
	createProfile: ProfileSchema,
	getProfile: ProfileSchema,
	updateProfile: ProfileSchema,
	deleteProfile: DeleteProfileResultSchema,
	issueCredential: VerifiableCredentialSchema,
	listCredentials: CredentialListSchema,
	getCredential: CredentialMetadataSchema,
	deleteCredential: DeleteResultSchema,
	revokeCredential: DeleteResultSchema,
	unrevokeCredential: DeleteResultSchema,
	createSchema: SchemaSchema,
	listSchemas: SchemaListSchema,
	getSchema: SchemaSchema,
	deleteSchema: DeleteResultSchema,
	createRegistry: RegistrySchema,
	listRegistries: RegistryListSchema,
	getRegistry: RegistrySchema,
	deleteRegistry: DeleteResultSchema,
	revokeInRegistry: DeleteResultSchema,
	getRevocationStatus: RevocationStatusSchema,
	verify: VerificationResultSchema,
	getJob: JobSchema,
} as const;
