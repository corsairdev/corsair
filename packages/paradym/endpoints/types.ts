import { z } from 'zod';
import type { ParadymQuery } from '../client';

// ── Shared building blocks ─────────────────────────────────────────────────

const ISO_DATETIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
const isoDatetime = z
	.string()
	.regex(
		ISO_DATETIME_REGEX,
		'Expected an ISO-8601 timestamp like 2025-11-20T10:00:00.000000Z',
	);

/** Cursor pagination parameters, as the API's `page[...]` query keys take them. */
const pageParams = {
	pageSize: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Results per page (sent as page[size]); the meta.page response carries maxSize',
		),
	pageAfter: z
		.string()
		.optional()
		.describe(
			'Cursor of the first record to return (sent as page[after]; take it from meta.page.after)',
		),
	pageBefore: z
		.string()
		.optional()
		.describe(
			'Cursor of the last record to return (sent as page[before]; take it from meta.page.before)',
		),
};

/** The pagination block every list response carries in meta.page. */
const MetaPageSchema = z
	.object({
		maxSize: z.string().nullish().describe('Largest page size the API allows'),
		size: z.string().nullish().describe('Size of the returned page'),
		after: z
			.string()
			.nullish()
			.describe('Cursor of the next page, when one exists'),
		before: z
			.string()
			.nullish()
			.describe('Cursor of the previous page, when one exists'),
	})
	.loose();

const ListMetaSchema = z
	.object({ page: MetaPageSchema.nullish() })
	.loose()
	.describe('Pagination metadata for the list');

// ── wallets ────────────────────────────────────────────────────────────────

export const WalletSchema = z
	.object({
		id: z.string().min(1).describe('Wallet id'),
		name: z.string().describe('Wallet name'),
		ownerId: z.string().describe('Id of the owning user'),
		verificationDataAccess: z
			.string()
			.nullish()
			.describe('Access mode for presented data: webhook, once or 15min'),
		createdAt: isoDatetime.describe('Creation timestamp'),
		updatedAt: isoDatetime.describe('Last modification timestamp'),
	})
	.loose()
	.describe('A Paradym wallet');
export type Wallet = z.infer<typeof WalletSchema>;

export const ListWalletsInputSchema = z
	.object({
		searchName: z
			.string()
			.optional()
			.describe('Search by name (sent as search[name])'),
		filterId: z
			.string()
			.optional()
			.describe('Filter by id (sent as filter[id])'),
		filterName: z
			.string()
			.optional()
			.describe('Filter by exact name (sent as filter[name])'),
		sort: z
			.enum(['id', '-id', 'createdAt', '-createdAt', 'updatedAt', '-updatedAt'])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
		...pageParams,
	})
	.describe('Query parameters for listing wallets');
export type ListWalletsInput = z.infer<typeof ListWalletsInputSchema>;

export const ListWalletsOutputSchema = z
	.object({
		data: z.array(WalletSchema).describe('Wallets on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of wallets');
export type ListWalletsOutput = z.infer<typeof ListWalletsOutputSchema>;

export const CreateWalletInputSchema = z
	.object({
		name: z.string().min(1).describe('Wallet name'),
		verificationDataAccess: z
			.enum(['webhook', 'once', '15min'])
			.optional()
			.describe(
				'How long presented credential data stays readable: webhook (only in the webhook), once (one read) or 15min',
			),
		openId4VcVersion: z
			.enum(['v1'])
			.optional()
			.describe('OpenID4VC version this wallet interoperates with'),
	})
	.describe('Create a wallet');
export type CreateWalletInput = z.infer<typeof CreateWalletInputSchema>;

export const CreateWalletOutputSchema = WalletSchema.describe(
	'The wallet as created',
);
export type CreateWalletOutput = z.infer<typeof CreateWalletOutputSchema>;

export const GetWalletInputSchema = z
	.object({ walletId: z.string().min(1).describe('Wallet id') })
	.describe('Input for reading one wallet');
export type GetWalletInput = z.infer<typeof GetWalletInputSchema>;

export const GetWalletOutputSchema = WalletSchema.describe('The wallet');
export type GetWalletOutput = z.infer<typeof GetWalletOutputSchema>;

export const UpdateWalletInputSchema = z
	.object({
		walletId: z.string().min(1).describe('Wallet id'),
		name: z.string().min(1).optional().describe('New wallet name'),
		verificationDataAccess: z
			.enum(['webhook', 'once', '15min'])
			.optional()
			.describe(
				'How long presented credential data stays readable: webhook (only in the webhook), once (one read) or 15min',
			),
	})
	.superRefine((input, ctx) => {
		if (
			input.name === undefined &&
			input.verificationDataAccess === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'Give at least one of name or verificationDataAccess',
			});
		}
	})
	.describe('Update a wallet');
export type UpdateWalletInput = z.infer<typeof UpdateWalletInputSchema>;

export const UpdateWalletOutputSchema = WalletSchema.describe(
	'The wallet as updated',
);
export type UpdateWalletOutput = z.infer<typeof UpdateWalletOutputSchema>;

// ── credentialTemplates (SD-JWT VC) ────────────────────────────────────────

export const SdJwtCredentialTemplateSchema = z
	.object({
		id: z.string().min(1).describe('Template id'),
		walletId: z.string().nullish().describe('Wallet the template belongs to'),
		name: z.string().nullish().describe('Template name'),
		description: z.string().nullish().describe('Template description'),
		format: z.string().nullish().describe('Credential format'),
		revocable: z
			.boolean()
			.nullish()
			.describe('Whether credentials from this template can be revoked'),
		archived: z
			.boolean()
			.nullish()
			.describe('Whether the template is archived'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('An SD-JWT VC credential template');
export type SdJwtCredentialTemplate = z.infer<
	typeof SdJwtCredentialTemplateSchema
>;

/** The attribute map every credential template carries, keyed by attribute name. */
/** A date string, or a duration in the future relative to issuance. */
const ValidFromSchema = z
	.union([
		z.string().min(1),
		z.object({
			future: z
				.object({
					days: z.number().int().optional(),
					months: z.number().int().optional(),
					years: z.number().int().optional(),
				})
				.describe('Offset from issuance'),
		}),
	])
	.describe('A date, e.g. 2026-11-21, or { future: { days, months, years } }');

const ValidUntilSchema = z
	.union([
		z.string().min(1),
		z.object({
			start: z
				.enum(['issuance', 'validFrom'])
				.describe('What the offset counts from'),
			future: z
				.object({
					days: z.number().int().optional(),
					months: z.number().int().optional(),
					years: z.number().int().optional(),
				})
				.describe('Offset from start'),
		}),
	])
	.describe(
		'A date, or { start: issuance | validFrom, future: { days, months, years } }',
	);

const TemplateAttributesSchema = z
	// unknown: attribute definitions are provider-defined (nested name,
	// schema and flag objects), so the record cannot be stricter.
	.record(z.string(), z.object({}).loose())
	.describe(
		'Credential attributes, keyed by attribute name, as the API reference documents them',
	);

export const ListCredentialTemplatesInputSchema = z
	.object({
		...pageParams,
		sort: z
			.enum([
				'id',
				'-id',
				'name',
				'-name',
				'createdAt',
				'-createdAt',
				'updatedAt',
				'-updatedAt',
			])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
	})
	.describe('Query parameters for listing SD-JWT VC credential templates');
export type ListCredentialTemplatesInput = z.infer<
	typeof ListCredentialTemplatesInputSchema
>;

export const ListCredentialTemplatesOutputSchema = z
	.object({
		data: z
			.array(SdJwtCredentialTemplateSchema)
			.describe('Templates on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of SD-JWT VC credential templates');
export type ListCredentialTemplatesOutput = z.infer<
	typeof ListCredentialTemplatesOutputSchema
>;

export const CreateCredentialTemplateInputSchema = z
	.object({
		type: z
			.string()
			.min(1)
			.describe('Credential type identifier, e.g. urn:eudi:pid:1'),
		name: z.string().min(1).describe('Template name'),
		attributes: TemplateAttributesSchema.describe(
			'Credential attributes keyed by attribute name',
		),
		revocable: z
			.boolean()
			.optional()
			.describe('Enable revocation for credentials from this template'),
		validFrom: ValidFromSchema.optional(),
		validUntil: ValidUntilSchema.optional(),
	})
	.describe('Create an SD-JWT VC credential template');
export type CreateCredentialTemplateInput = z.infer<
	typeof CreateCredentialTemplateInputSchema
>;

export const CreateCredentialTemplateOutputSchema =
	SdJwtCredentialTemplateSchema.describe('The template as created');
export type CreateCredentialTemplateOutput = z.infer<
	typeof CreateCredentialTemplateOutputSchema
>;

export const GetCredentialTemplateInputSchema = z
	.object({ credentialTemplateId: z.string().min(1).describe('Template id') })
	.describe('Input for reading one SD-JWT VC credential template');
export type GetCredentialTemplateInput = z.infer<
	typeof GetCredentialTemplateInputSchema
>;

export const GetCredentialTemplateOutputSchema =
	SdJwtCredentialTemplateSchema.describe('The full credential template');
export type GetCredentialTemplateOutput = z.infer<
	typeof GetCredentialTemplateOutputSchema
>;

export const UpdateCredentialTemplateInputSchema = z
	.object({
		credentialTemplateId: z.string().min(1).describe('Template id'),
		name: z.string().min(1).describe('Template name'),
		attributes: TemplateAttributesSchema.describe(
			'Credential attributes keyed by attribute name',
		),
		validFrom: ValidFromSchema.optional(),
		validUntil: ValidUntilSchema.optional(),
	})
	.describe(
		'Replace an SD-JWT VC credential template: name and attributes are required, and type and revocable cannot change',
	);
export type UpdateCredentialTemplateInput = z.infer<
	typeof UpdateCredentialTemplateInputSchema
>;

export const UpdateCredentialTemplateOutputSchema =
	SdJwtCredentialTemplateSchema.describe('The template as updated');
export type UpdateCredentialTemplateOutput = z.infer<
	typeof UpdateCredentialTemplateOutputSchema
>;

export const ArchiveCredentialTemplateInputSchema = z
	.object({ credentialTemplateId: z.string().min(1).describe('Template id') })
	.describe('Archive an SD-JWT VC credential template');
export type ArchiveCredentialTemplateInput = z.infer<
	typeof ArchiveCredentialTemplateInputSchema
>;

export const ArchiveCredentialTemplateOutputSchema = z
	.object({
		id: z.string().describe('Archived template id'),
		success: z.boolean().describe('Whether the archive succeeded'),
	})
	.describe('The template was archived (the API answers 204 with no body)');
export type ArchiveCredentialTemplateOutput = z.infer<
	typeof ArchiveCredentialTemplateOutputSchema
>;

export const UnarchiveCredentialTemplateInputSchema = z
	.object({ credentialTemplateId: z.string().min(1).describe('Template id') })
	.describe('Unarchive an SD-JWT VC credential template');
export type UnarchiveCredentialTemplateInput = z.infer<
	typeof UnarchiveCredentialTemplateInputSchema
>;

export const UnarchiveCredentialTemplateOutputSchema = z
	.object({
		credentialTemplateId: z.string().describe('Unarchived template id'),
		success: z.boolean().describe('Whether the unarchive succeeded'),
	})
	.describe('The template was unarchived (the API answers 204 with no body)');
export type UnarchiveCredentialTemplateOutput = z.infer<
	typeof UnarchiveCredentialTemplateOutputSchema
>;

// ── presentationTemplates ──────────────────────────────────────────────────

export const PresentationTemplateSchema = z
	.object({
		id: z.string().min(1).describe('Template id'),
		name: z.string().describe('Template name'),
		description: z.string().nullish().describe('Template description'),
		credentials: z
			.array(z.object({}).loose())
			.nullish()
			.describe('The credentials the holder must present'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('A Paradym presentation template');
export type PresentationTemplate = z.infer<typeof PresentationTemplateSchema>;

export const ListPresentationTemplatesInputSchema = z
	.object({
		...pageParams,
		sort: z
			.enum([
				'id',
				'-id',
				'name',
				'-name',
				'createdAt',
				'-createdAt',
				'updatedAt',
				'-updatedAt',
			])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
	})
	.describe('Query parameters for listing presentation templates');
export type ListPresentationTemplatesInput = z.infer<
	typeof ListPresentationTemplatesInputSchema
>;

export const ListPresentationTemplatesOutputSchema = z
	.object({
		data: z
			.array(PresentationTemplateSchema)
			.describe('Templates on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of presentation templates');
export type ListPresentationTemplatesOutput = z.infer<
	typeof ListPresentationTemplatesOutputSchema
>;

const PresentationCredentialSchema = z
	.object({
		format: z
			.enum(['sd-jwt-vc', 'mdoc', 'anoncreds'])
			.describe('Credential format of the presented credential'),
		type: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Credential type the holder must present, e.g. urn:eudi:pid:1 (sd-jwt-vc and mdoc)',
			),
		schema: z
			.string()
			.min(1)
			.optional()
			.describe('AnonCreds schema id (anoncreds only)'),
		attributes: z
			// unknown: attribute definitions are provider-defined, so the
			// record cannot be stricter.
			.record(z.string(), z.object({}).loose())
			.describe('Requested attributes keyed by attribute name'),
		name: z.string().optional().describe('Name shown to the holder'),
	})
	.loose()
	.superRefine((credential, ctx) => {
		if (credential.format === 'anoncreds' && !credential.schema) {
			ctx.addIssue({
				code: 'custom',
				path: ['schema'],
				message: 'AnonCreds credentials need a schema',
			});
		}
		if (credential.format !== 'anoncreds' && !credential.type) {
			ctx.addIssue({
				code: 'custom',
				path: ['type'],
				message: 'sd-jwt-vc and mdoc credentials need a type',
			});
		}
	})
	.describe('One credential definition the presentation template asks for');

export const CreatePresentationTemplateInputSchema = z
	.object({
		name: z.string().min(1).describe('Template name'),
		credentials: z
			.array(PresentationCredentialSchema)
			.min(1)
			.describe('The credentials the holder must present'),
	})
	.describe('Create a presentation template');
export type CreatePresentationTemplateInput = z.infer<
	typeof CreatePresentationTemplateInputSchema
>;

export const CreatePresentationTemplateOutputSchema =
	PresentationTemplateSchema.describe('The presentation template as created');
export type CreatePresentationTemplateOutput = z.infer<
	typeof CreatePresentationTemplateOutputSchema
>;

export const GetPresentationTemplateInputSchema = z
	.object({ presentationTemplateId: z.string().min(1).describe('Template id') })
	.describe('Input for reading one presentation template');
export type GetPresentationTemplateInput = z.infer<
	typeof GetPresentationTemplateInputSchema
>;

export const GetPresentationTemplateOutputSchema =
	PresentationTemplateSchema.describe('The full presentation template');
export type GetPresentationTemplateOutput = z.infer<
	typeof GetPresentationTemplateOutputSchema
>;

export const UpdatePresentationTemplateInputSchema = z
	.object({
		presentationTemplateId: z.string().min(1).describe('Template id'),
		name: z.string().min(1).describe('Template name'),
		credentials: z
			.array(PresentationCredentialSchema)
			.min(1)
			.describe('The credentials to present'),
	})
	.describe(
		'Replace a presentation template: name and credentials are required',
	);
export type UpdatePresentationTemplateInput = z.infer<
	typeof UpdatePresentationTemplateInputSchema
>;

export const UpdatePresentationTemplateOutputSchema =
	PresentationTemplateSchema.describe('The presentation template as updated');
export type UpdatePresentationTemplateOutput = z.infer<
	typeof UpdatePresentationTemplateOutputSchema
>;

export const ArchivePresentationTemplateInputSchema = z
	.object({ presentationTemplateId: z.string().min(1).describe('Template id') })
	.describe('Archive a presentation template');
export type ArchivePresentationTemplateInput = z.infer<
	typeof ArchivePresentationTemplateInputSchema
>;

export const ArchivePresentationTemplateOutputSchema = z
	.object({
		id: z.string().describe('Archived template id'),
		success: z.boolean().describe('Whether the archive succeeded'),
	})
	.describe('The template was archived (the API answers 204 with no body)');
export type ArchivePresentationTemplateOutput = z.infer<
	typeof ArchivePresentationTemplateOutputSchema
>;

// ── issuance (OpenID4VC) ───────────────────────────────────────────────────

export const OpenId4VcIssuanceSchema = z
	.object({
		id: z.string().min(1).describe('Issuance session id'),
		status: z
			.string()
			.describe('Session status, e.g. offered, completed, failed, expired'),
		offerUri: z
			.string()
			.nullish()
			.describe('Credential offer URI a wallet opens'),
		offerQrUri: z.string().nullish().describe('QR image of the offer'),
		offerDeeplinkUri: z.string().nullish().describe('Deep link of the offer'),
		offerDeeplinkQrUri: z
			.string()
			.nullish()
			.describe('QR image of the deep link'),
		expiresAt: isoDatetime.nullish().describe('When the offer expires'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('An OpenID4VC issuance session');
export type OpenId4VcIssuance = z.infer<typeof OpenId4VcIssuanceSchema>;

export const ListIssuanceSessionsInputSchema = z
	.object({
		filterStatus: z
			.string()
			.optional()
			.describe('Filter by session status (sent as filter[status])'),
		filterId: z
			.string()
			.optional()
			.describe('Filter by id (sent as filter[id])'),
		sort: z
			.enum(['id', '-id', 'createdAt', '-createdAt', 'updatedAt', '-updatedAt'])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
		...pageParams,
	})
	.describe('Query parameters for listing OpenID4VC issuance sessions');
export type ListIssuanceSessionsInput = z.infer<
	typeof ListIssuanceSessionsInputSchema
>;

export const ListIssuanceSessionsOutputSchema = z
	.object({
		data: z
			.array(OpenId4VcIssuanceSchema)
			.describe('Issuance sessions on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of OpenID4VC issuance sessions');
export type ListIssuanceSessionsOutput = z.infer<
	typeof ListIssuanceSessionsOutputSchema
>;

const IssuanceOfferCredentialSchema = z
	.object({
		credentialTemplateId: z
			.string()
			.min(1)
			.describe('Template the credential is issued from'),
		attributes: z
			// unknown: claim values follow the template's own attributes.
			.record(z.string(), z.unknown())
			.optional()
			.describe('Claim values keyed by the template attribute names'),
	})
	.describe('One credential to issue: its template id and claim values');

export const CreateIssuanceOfferInputSchema = z
	.object({
		credentials: z
			.array(IssuanceOfferCredentialSchema)
			.min(1)
			.describe('The credentials to be issued in this offer'),
		expirationInMinutes: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Minutes until the offer expires'),
	})
	.describe('Create an OpenID4VC credential offer');
export type CreateIssuanceOfferInput = z.infer<
	typeof CreateIssuanceOfferInputSchema
>;

export const CreateIssuanceOfferOutputSchema = OpenId4VcIssuanceSchema.describe(
	'The issuance session with the offer URIs a wallet opens',
);
export type CreateIssuanceOfferOutput = z.infer<
	typeof CreateIssuanceOfferOutputSchema
>;

export const GetIssuanceSessionInputSchema = z
	.object({ issuanceId: z.string().min(1).describe('Issuance session id') })
	.describe('Input for reading one OpenID4VC issuance session');
export type GetIssuanceSessionInput = z.infer<
	typeof GetIssuanceSessionInputSchema
>;

export const GetIssuanceSessionOutputSchema = OpenId4VcIssuanceSchema.describe(
	'The issuance session',
);
export type GetIssuanceSessionOutput = z.infer<
	typeof GetIssuanceSessionOutputSchema
>;

// ── verification (OpenID4VC) ───────────────────────────────────────────────

export const OpenId4VcVerificationSchema = z
	.object({
		id: z.string().min(1).describe('Verification session id'),
		status: z
			.string()
			.describe('Session status, e.g. requested, verified, failed, expired'),
		presentationTemplateId: z
			.string()
			.describe('Presentation template the session verifies against'),
		authorizationRequestUri: z
			.string()
			.nullish()
			.describe('Authorization request URI a wallet opens'),
		authorizationRequestQrUri: z
			.string()
			.nullish()
			.describe('QR image of the request'),
		authorizationRequestDeeplinkUri: z
			.string()
			.nullish()
			.describe('Deep link of the request'),
		authorizationRequestDeeplinkQrUri: z
			.string()
			.nullish()
			.describe('QR image of the deep link'),
		expiresAt: isoDatetime.nullish().describe('When the session expires'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('An OpenID4VC verification session');
export type OpenId4VcVerification = z.infer<typeof OpenId4VcVerificationSchema>;

export const ListVerificationSessionsInputSchema = z
	.object({
		filterStatus: z
			.string()
			.optional()
			.describe('Filter by session status (sent as filter[status])'),
		filterId: z
			.string()
			.optional()
			.describe('Filter by id (sent as filter[id])'),
		sort: z
			.enum(['id', '-id', 'createdAt', '-createdAt', 'updatedAt', '-updatedAt'])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
		...pageParams,
	})
	.describe('Query parameters for listing OpenID4VC verification sessions');
export type ListVerificationSessionsInput = z.infer<
	typeof ListVerificationSessionsInputSchema
>;

export const ListVerificationSessionsOutputSchema = z
	.object({
		data: z
			.array(OpenId4VcVerificationSchema)
			.describe('Verification sessions on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of OpenID4VC verification sessions');
export type ListVerificationSessionsOutput = z.infer<
	typeof ListVerificationSessionsOutputSchema
>;

export const CreateVerificationRequestInputSchema = z
	.object({
		presentationTemplateId: z
			.string()
			.min(1)
			.describe('Presentation template defining what the holder must present'),
		expirationInMinutes: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Minutes until the session expires'),
		challenge: z
			.string()
			.optional()
			.describe('Challenge bound into the authorization request'),
		redirectUri: z
			.string()
			.url()
			.optional()
			.describe('Where the wallet redirects after presenting'),
		requireResponseEncryption: z
			.boolean()
			.optional()
			.describe('Require the wallet to encrypt the presentation response'),
	})
	.describe('Create an OpenID4VC verification session');
export type CreateVerificationRequestInput = z.infer<
	typeof CreateVerificationRequestInputSchema
>;

export const CreateVerificationRequestOutputSchema =
	OpenId4VcVerificationSchema.describe(
		'The verification session with the authorization request URIs',
	);
export type CreateVerificationRequestOutput = z.infer<
	typeof CreateVerificationRequestOutputSchema
>;

export const GetVerificationSessionInputSchema = z
	.object({
		verificationId: z.string().min(1).describe('Verification session id'),
	})
	.describe('Input for reading one OpenID4VC verification session');
export type GetVerificationSessionInput = z.infer<
	typeof GetVerificationSessionInputSchema
>;

export const GetVerificationSessionOutputSchema =
	OpenId4VcVerificationSchema.describe(
		'The verification session, including presented credentials once the holder responded',
	);
export type GetVerificationSessionOutput = z.infer<
	typeof GetVerificationSessionOutputSchema
>;

export const CompleteVerificationInputSchema = z
	.object({
		verificationId: z.string().min(1).describe('Verification session id'),
		challenge: z
			.string()
			.min(1)
			.describe('The challenge the verification request was created with'),
		responseCode: z
			.string()
			.min(1)
			.describe('The response_code the wallet redirect returned'),
	})
	.describe('Complete an OpenID4VC verification session in the redirect flow');
export type CompleteVerificationInput = z.infer<
	typeof CompleteVerificationInputSchema
>;

export const CompleteVerificationOutputSchema =
	OpenId4VcVerificationSchema.describe('The verification session as completed');
export type CompleteVerificationOutput = z.infer<
	typeof CompleteVerificationOutputSchema
>;

// ── revocation ─────────────────────────────────────────────────────────────

export const BatchRevokeInputSchema = z
	.object({
		issuedCredentialIds: z
			.array(z.string().min(1))
			.min(1)
			.describe('Issued credential ids to revoke'),
		notifyWallet: z
			.boolean()
			.optional()
			.describe('Notify the holder wallet about the revocation'),
	})
	.describe('Revoke issued credentials in one batch');
export type BatchRevokeInput = z.infer<typeof BatchRevokeInputSchema>;

export const BatchRevokeOutputSchema = z
	.object({
		revokedCredentials: z
			.array(z.object({}).loose())
			.describe('The credentials the batch revoked'),
	})
	.loose()
	.describe('The result of the batch revocation');
export type BatchRevokeOutput = z.infer<typeof BatchRevokeOutputSchema>;

// ── trustedEntities ────────────────────────────────────────────────────────

export const TrustedEntitySchema = z
	.object({
		id: z.string().min(1).describe('Trusted entity id'),
		name: z.string().describe('Trusted entity name'),
		dids: z
			.array(z.object({}).loose())
			.describe('DIDs trusted from this entity'),
		certificates: z
			.array(z.object({}).loose())
			.describe('X.509 certificates trusted from this entity'),
		etsiLotes: z
			.array(z.object({}).loose())
			.describe('ETSI trusted lists linked to this entity'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('A trusted entity (an issuer or wallet you trust)');
export type TrustedEntity = z.infer<typeof TrustedEntitySchema>;

export const ListTrustedEntitiesInputSchema = z
	.object({
		...pageParams,
		sort: z
			.enum([
				'id',
				'-id',
				'name',
				'-name',
				'createdAt',
				'-createdAt',
				'updatedAt',
				'-updatedAt',
			])
			.optional()
			.describe('Sort field; "-" prefix sorts descending'),
	})
	.describe('Query parameters for listing trusted entities');
export type ListTrustedEntitiesInput = z.infer<
	typeof ListTrustedEntitiesInputSchema
>;

export const ListTrustedEntitiesOutputSchema = z
	.object({
		data: z
			.array(TrustedEntitySchema)
			.describe('Trusted entities on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of trusted entities');
export type ListTrustedEntitiesOutput = z.infer<
	typeof ListTrustedEntitiesOutputSchema
>;

const TrustedEntityDidSchema = z
	.object({
		did: z.string().min(1).describe('The DID to trust'),
	})
	.loose()
	.describe('A DID trusted from this entity');

const TrustedEntityCertificateSchema = z
	.object({
		certificate: z
			.string()
			.min(1)
			.describe('The X.509 certificate, in PEM format'),
	})
	.loose()
	.describe('An X.509 certificate trusted from this entity');

export const CreateTrustedEntityInputSchema = z
	.object({
		name: z.string().min(1).describe('Name that identifies the trusted entity'),
		dids: z
			.array(TrustedEntityDidSchema)
			.optional()
			.describe('DIDs to trust from this entity'),
		certificates: z
			.array(TrustedEntityCertificateSchema)
			.optional()
			.describe('X.509 certificates to trust from this entity'),
	})
	.superRefine((input, ctx) => {
		if (!input.dids?.length && !input.certificates?.length) {
			ctx.addIssue({
				code: 'custom',
				path: ['dids'],
				message: 'Trust at least one DID or one certificate',
			});
		}
	})
	.describe('Create a trusted entity');
export type CreateTrustedEntityInput = z.infer<
	typeof CreateTrustedEntityInputSchema
>;

export const CreateTrustedEntityOutputSchema = TrustedEntitySchema.describe(
	'The trusted entity as created',
);
export type CreateTrustedEntityOutput = z.infer<
	typeof CreateTrustedEntityOutputSchema
>;

export const GetTrustedEntityInputSchema = z
	.object({ trustedEntityId: z.string().min(1).describe('Trusted entity id') })
	.describe('Input for reading one trusted entity');
export type GetTrustedEntityInput = z.infer<typeof GetTrustedEntityInputSchema>;

export const GetTrustedEntityOutputSchema =
	TrustedEntitySchema.describe('The trusted entity');
export type GetTrustedEntityOutput = z.infer<
	typeof GetTrustedEntityOutputSchema
>;

export const DeleteTrustedEntityInputSchema = z
	.object({ trustedEntityId: z.string().min(1).describe('Trusted entity id') })
	.describe('Delete a trusted entity');
export type DeleteTrustedEntityInput = z.infer<
	typeof DeleteTrustedEntityInputSchema
>;

export const DeleteTrustedEntityOutputSchema = z
	.object({
		id: z.string().describe('Deleted trusted entity id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe(
		'The trusted entity was deleted (the API answers 204 with no body)',
	);
export type DeleteTrustedEntityOutput = z.infer<
	typeof DeleteTrustedEntityOutputSchema
>;

// ── webhooks ───────────────────────────────────────────────────────────────

export const WebhookSubscriptionSchema = z
	.object({
		id: z.string().min(1).describe('Subscription id'),
		name: z.string().describe('Subscription name'),
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		walletId: z.string().describe('Wallet the subscription belongs to'),
		eventTypes: z
			.array(z.string())
			.describe('Event types the subscription delivers'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
	})
	.loose()
	.describe('A Paradym webhook subscription');
export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

export const ListWebhookSubscriptionsInputSchema = z
	.object({ ...pageParams })
	.describe('Query parameters for listing webhook subscriptions');
export type ListWebhookSubscriptionsInput = z.infer<
	typeof ListWebhookSubscriptionsInputSchema
>;

export const ListWebhookSubscriptionsOutputSchema = z
	.object({
		data: z
			.array(WebhookSubscriptionSchema)
			.describe('Subscriptions in the wallet'),
	})
	.loose()
	.describe('The webhook subscriptions in the wallet');
export type ListWebhookSubscriptionsOutput = z.infer<
	typeof ListWebhookSubscriptionsOutputSchema
>;

export const CreateWebhookSubscriptionInputSchema = z
	.object({
		name: z.string().min(1).describe('Subscription name'),
		url: z.string().url().describe('Endpoint deliveries are posted to'),
		eventTypes: z
			.array(z.string().min(1))
			.min(1)
			.describe(
				'Event types to subscribe to, e.g. openid4vc.issuance.completed, openid4vc.verification.verified, didcomm.connection.created, certificate.renewal.required',
			),
	})
	.describe(
		'Create a webhook subscription; the response carries the signatureSecret used to verify deliveries',
	);
export type CreateWebhookSubscriptionInput = z.infer<
	typeof CreateWebhookSubscriptionInputSchema
>;

export const CreateWebhookSubscriptionOutputSchema =
	WebhookSubscriptionSchema.extend({
		signatureSecret: z
			.string()
			.describe(
				'Secret used to verify delivery signatures (HMAC-SHA256 over the raw body, hex, in the X-Paradym-HMAC-SHA-256 header)',
			),
	}).describe('The subscription as created, including its signing secret');
export type CreateWebhookSubscriptionOutput = z.infer<
	typeof CreateWebhookSubscriptionOutputSchema
>;

export const DeleteWebhookSubscriptionInputSchema = z
	.object({
		webhookSubscriptionId: z.string().min(1).describe('Subscription id'),
	})
	.describe('Delete a webhook subscription');
export type DeleteWebhookSubscriptionInput = z.infer<
	typeof DeleteWebhookSubscriptionInputSchema
>;

export const DeleteWebhookSubscriptionOutputSchema = z
	.object({
		id: z.string().describe('Deleted subscription id'),
		success: z.boolean().describe('Whether the delete succeeded'),
	})
	.describe('The subscription was deleted (the API answers 204 with no body)');
export type DeleteWebhookSubscriptionOutput = z.infer<
	typeof DeleteWebhookSubscriptionOutputSchema
>;

export const WebhookDeliverySchema = z
	.object({
		id: z.string().min(1).describe('Delivery id'),
		status: z
			.string()
			.describe('Delivery status, e.g. pending, delivered, failed'),
		eventType: z.string().describe('Event type that was delivered'),
		webhookSubscriptionId: z
			.string()
			.describe('Subscription the delivery belongs to'),
		attemptCount: z
			.number()
			.nullish()
			.describe('Delivery attempts made so far'),
		createdAt: isoDatetime.nullish().describe('Creation timestamp'),
		updatedAt: isoDatetime.nullish().describe('Last modification timestamp'),
		completedAt: isoDatetime.nullish().describe('When the delivery succeeded'),
		lastAttemptAt: isoDatetime.nullish().describe('When the last attempt ran'),
		nextAttemptAt: isoDatetime.nullish().describe('When the next retry runs'),
	})
	.loose()
	.describe('A webhook delivery record');
export type WebhookDelivery = z.infer<typeof WebhookDeliverySchema>;

export const ListWebhookDeliveriesInputSchema = z
	.object({
		...pageParams,
		filterStatus: z
			.string()
			.optional()
			.describe('Filter by delivery status (sent as filter[status])'),
	})
	.describe('Query parameters for listing webhook deliveries');
export type ListWebhookDeliveriesInput = z.infer<
	typeof ListWebhookDeliveriesInputSchema
>;

export const ListWebhookDeliveriesOutputSchema = z
	.object({
		data: z.array(WebhookDeliverySchema).describe('Deliveries on this page'),
		meta: ListMetaSchema,
	})
	.loose()
	.describe('A page of webhook deliveries');
export type ListWebhookDeliveriesOutput = z.infer<
	typeof ListWebhookDeliveriesOutputSchema
>;

export const GetWebhookDeliveryInputSchema = z
	.object({ deliveryId: z.string().min(1).describe('Delivery id') })
	.describe('Input for reading one webhook delivery');
export type GetWebhookDeliveryInput = z.infer<
	typeof GetWebhookDeliveryInputSchema
>;

export const GetWebhookDeliveryOutputSchema = WebhookDeliverySchema.describe(
	'The webhook delivery, including its attempts',
);
export type GetWebhookDeliveryOutput = z.infer<
	typeof GetWebhookDeliveryOutputSchema
>;

export const RedeliverWebhookDeliveryInputSchema = z
	.object({ deliveryId: z.string().min(1).describe('Delivery id') })
	.describe('Redeliver a pending or failed webhook delivery');
export type RedeliverWebhookDeliveryInput = z.infer<
	typeof RedeliverWebhookDeliveryInputSchema
>;

export const RedeliverWebhookDeliveryOutputSchema =
	WebhookDeliverySchema.describe('The delivery as scheduled for redelivery');
export type RedeliverWebhookDeliveryOutput = z.infer<
	typeof RedeliverWebhookDeliveryOutputSchema
>;

// ── Operation registry ─────────────────────────────────────────────────────

export const ParadymEndpointInputSchemas = {
	walletsList: ListWalletsInputSchema,
	walletsCreate: CreateWalletInputSchema,
	walletsGet: GetWalletInputSchema,
	walletsUpdate: UpdateWalletInputSchema,
	credentialTemplatesList: ListCredentialTemplatesInputSchema,
	credentialTemplatesCreate: CreateCredentialTemplateInputSchema,
	credentialTemplatesGet: GetCredentialTemplateInputSchema,
	credentialTemplatesUpdate: UpdateCredentialTemplateInputSchema,
	credentialTemplatesArchive: ArchiveCredentialTemplateInputSchema,
	credentialTemplatesUnarchive: UnarchiveCredentialTemplateInputSchema,
	presentationTemplatesList: ListPresentationTemplatesInputSchema,
	presentationTemplatesCreate: CreatePresentationTemplateInputSchema,
	presentationTemplatesGet: GetPresentationTemplateInputSchema,
	presentationTemplatesUpdate: UpdatePresentationTemplateInputSchema,
	presentationTemplatesArchive: ArchivePresentationTemplateInputSchema,
	issuanceListSessions: ListIssuanceSessionsInputSchema,
	issuanceCreateOffer: CreateIssuanceOfferInputSchema,
	issuanceGetSession: GetIssuanceSessionInputSchema,
	verificationListSessions: ListVerificationSessionsInputSchema,
	verificationCreateRequest: CreateVerificationRequestInputSchema,
	verificationGetSession: GetVerificationSessionInputSchema,
	verificationComplete: CompleteVerificationInputSchema,
	revocationBatch: BatchRevokeInputSchema,
	trustedEntitiesList: ListTrustedEntitiesInputSchema,
	trustedEntitiesCreate: CreateTrustedEntityInputSchema,
	trustedEntitiesGet: GetTrustedEntityInputSchema,
	trustedEntitiesDelete: DeleteTrustedEntityInputSchema,
	webhooksListSubscriptions: ListWebhookSubscriptionsInputSchema,
	webhooksCreateSubscription: CreateWebhookSubscriptionInputSchema,
	webhooksDeleteSubscription: DeleteWebhookSubscriptionInputSchema,
	webhooksListDeliveries: ListWebhookDeliveriesInputSchema,
	webhooksGetDelivery: GetWebhookDeliveryInputSchema,
	webhooksRedeliverDelivery: RedeliverWebhookDeliveryInputSchema,
};

export const ParadymEndpointOutputSchemas = {
	walletsList: ListWalletsOutputSchema,
	walletsCreate: CreateWalletOutputSchema,
	walletsGet: GetWalletOutputSchema,
	walletsUpdate: UpdateWalletOutputSchema,
	credentialTemplatesList: ListCredentialTemplatesOutputSchema,
	credentialTemplatesCreate: CreateCredentialTemplateOutputSchema,
	credentialTemplatesGet: GetCredentialTemplateOutputSchema,
	credentialTemplatesUpdate: UpdateCredentialTemplateOutputSchema,
	credentialTemplatesArchive: ArchiveCredentialTemplateOutputSchema,
	credentialTemplatesUnarchive: UnarchiveCredentialTemplateOutputSchema,
	presentationTemplatesList: ListPresentationTemplatesOutputSchema,
	presentationTemplatesCreate: CreatePresentationTemplateOutputSchema,
	presentationTemplatesGet: GetPresentationTemplateOutputSchema,
	presentationTemplatesUpdate: UpdatePresentationTemplateOutputSchema,
	presentationTemplatesArchive: ArchivePresentationTemplateOutputSchema,
	issuanceListSessions: ListIssuanceSessionsOutputSchema,
	issuanceCreateOffer: CreateIssuanceOfferOutputSchema,
	issuanceGetSession: GetIssuanceSessionOutputSchema,
	verificationListSessions: ListVerificationSessionsOutputSchema,
	verificationCreateRequest: CreateVerificationRequestOutputSchema,
	verificationGetSession: GetVerificationSessionOutputSchema,
	verificationComplete: CompleteVerificationOutputSchema,
	revocationBatch: BatchRevokeOutputSchema,
	trustedEntitiesList: ListTrustedEntitiesOutputSchema,
	trustedEntitiesCreate: CreateTrustedEntityOutputSchema,
	trustedEntitiesGet: GetTrustedEntityOutputSchema,
	trustedEntitiesDelete: DeleteTrustedEntityOutputSchema,
	webhooksListSubscriptions: ListWebhookSubscriptionsOutputSchema,
	webhooksCreateSubscription: CreateWebhookSubscriptionOutputSchema,
	webhooksDeleteSubscription: DeleteWebhookSubscriptionOutputSchema,
	webhooksListDeliveries: ListWebhookDeliveriesOutputSchema,
	webhooksGetDelivery: GetWebhookDeliveryOutputSchema,
	webhooksRedeliverDelivery: RedeliverWebhookDeliveryOutputSchema,
};

export type ParadymEndpointInputs = {
	[K in keyof typeof ParadymEndpointInputSchemas]: z.input<
		(typeof ParadymEndpointInputSchemas)[K]
	>;
};

export type ParadymEndpointOutputs = {
	[K in keyof typeof ParadymEndpointOutputSchemas]: z.infer<
		(typeof ParadymEndpointOutputSchemas)[K]
	>;
};

/** The pagination query keys the API's list routes take, from an input schema. */
export function pageQuery(input: {
	pageSize?: number;
	pageAfter?: string;
	pageBefore?: string;
}): ParadymQuery {
	return {
		'page[size]': input.pageSize,
		'page[after]': input.pageAfter,
		'page[before]': input.pageBefore,
	};
}
