import { z } from 'zod';

/**
 * SignPath's own names are used throughout; this plugin does not rename fields.
 * Outputs are `.loose()` and their optional fields `.nullish()` so a field
 * SignPath starts or stops sending cannot fail a call that already happened.
 * Contract: https://app.signpath.io/Api/swagger/v1/swagger.json
 */

const Uuid = z.uuid();

/** Slugs are limited to these characters by every route that takes one. */
const Slug = z
	.string()
	.min(1)
	.max(100)
	.regex(/^[A-Za-z0-9._-]+$/, 'Letters, digits, dot, underscore and hyphen');

const Description = z.string().max(5000);

/** Cancelling is only possible within this window, counted from submission. */
const CancellationTimeout = z.number().int().min(1).max(31_536_000);

const SigningRequestStatusSchema = z.enum([
	'WaitingForArtifactUpload',
	'InProgress',
	'WaitingForApproval',
	'Completed',
	'Failed',
	'Denied',
	'Canceled',
]);

const SigningRequestWorkflowStatusSchema = z.enum([
	'Submitted',
	'RetrievingArtifact',
	'WaitingForArtifactUpload',
	'WaitingForApproval',
	'QueuedForMalwareScanning',
	'ScanningForMalware',
	'QueuedForProcessing',
	'Processing',
	'Completed',
	'ProcessingFailed',
	'MalwareScanFailed',
	'MalwareDetected',
	'ArtifactRetrievalFailed',
	'Denied',
	'Canceled',
]);

const MalwareScanningStatusSchema = z.enum([
	'Pending',
	'Completed',
	'Failed',
	'DetectedMalware',
	'NoMalwareScannerConfigured',
	'DisabledBySigningPolicy',
	'NotApplicableForFastSigningRequest',
	'NotApplicableDueToCancellation',
	'NotApplicableDueToArtifactRetrievalFailure',
	'NotApplicableDueToDenial',
]);

const CancellationReasonSchema = z.enum([
	'ManualRequest',
	'GarbageCollection',
	'Timeout',
]);

const ProjectStatusSchema = z.enum(['Valid', 'Inactive', 'Invalid']);

const SigningPolicyStatusSchema = z.enum(['Valid', 'Inactive', 'Invalid']);

const ArtifactConfigurationStatusSchema = z.enum([
	'Valid',
	'Pending',
	'Invalid',
	'Inactive',
]);

const CertificateStatusSchema = z.enum([
	'Valid',
	'CsrPending',
	'Inactive',
	'Expired',
	'PrivateKeyDeleted',
]);

const CertificateTypeSchema = z.enum(['X509', 'GpgKey']);

const KeyAlgorithmSchema = z.enum([
	'Rsa2048',
	'Rsa3072',
	'Rsa4096',
	'Rsa8192',
	'EcdsaNist256',
	'EcdsaNist384',
	'EcdsaNist521',
	'EcdsaBrainpoolP256r1',
	'EcdsaBrainpoolP384r1',
	'EcdsaBrainpoolP512r1',
	'Mldsa44',
	'Mldsa65',
	'Mldsa87',
]);

const KeyAlgorithmGroupSchema = z.enum(['Rsa', 'Ecdsa', 'Mldsa']);

const X509CertificateCreationMethodSchema = z.enum([
	'SelfSigned',
	'Csr',
	'PfxImport',
	'ImportedWithExistingKeyPair',
]);

const PurposeSchema = z.enum(['TestSigning', 'ReleaseSigning']);

const ParticipantTypeSchema = z.enum(['InteractiveUser', 'CIUser', 'Group']);

// ── Shared output pieces ──────────────────────────────────────────────────

const ParticipantReferenceSchema = z
	.object({
		id: Uuid,
		name: z.string(),
		identity: z.string().nullish(),
		type: ParticipantTypeSchema,
		isDirectorySynchronized: z.boolean(),
		link: z.string(),
	})
	.loose();

export type SignpathParticipantReference = z.infer<
	typeof ParticipantReferenceSchema
>;

const distinguishedNameParts = {
	commonName: z.string(),
	organization: z.string().nullish(),
	organizationalUnit: z.string().nullish(),
	countryCode: z.string().nullish(),
	stateOrProvince: z.string().nullish(),
	locality: z.string().nullish(),
	email: z.string().nullish(),
};

const DistinguishedNamePartsSchema = z.object(distinguishedNameParts).loose();

const X509CertificateDataSchema = z
	.object({
		creationMethod: X509CertificateCreationMethodSchema,
		subjectName: z.string(),
		validFrom: z.string().nullish(),
		validTo: z.string().nullish(),
		subjectNameParts: DistinguishedNamePartsSchema,
		x509CertificateLink: z.string(),
		x509CertificateChainLink: z.string().nullish(),
	})
	.loose();

const GpgKeyDataSchema = z
	.object({
		userId: z.string(),
		creationTime: z.string(),
		expirationTime: z.string().nullish(),
		fingerprint: z.string(),
		keyId: z.string(),
		keyVersion: z.number(),
		gpgPublicKeyLink: z.string(),
	})
	.loose();

/** A certificate as `certificates.get` returns it. */
const CertificateSchema = z
	.object({
		certificateId: Uuid,
		name: z.string(),
		slug: z.string(),
		description: z.string().nullish(),
		status: CertificateStatusSchema,
		type: CertificateTypeSchema,
		purpose: PurposeSchema.nullish(),
		keyStoreId: z.string(),
		keyStoreKeyId: z.string().nullish(),
		keyAlgorithm: KeyAlgorithmSchema.nullish(),
		keyAlgorithmGroup: KeyAlgorithmGroupSchema,
		x509CertificateData: X509CertificateDataSchema.nullish(),
		gpgKeyData: GpgKeyDataSchema.nullish(),
	})
	.loose();

export type SignpathCertificate = z.infer<typeof CertificateSchema>;

// ── organization.get ──────────────────────────────────────────────────────

const OrganizationGetInputSchema = z.object({});

export type OrganizationGetInput = z.infer<typeof OrganizationGetInputSchema>;

const QuotaValuesSchema = z
	.object({
		currentlyUsed: z.number(),
		quota: z.number().nullish(),
	})
	.loose();

/**
 * `additionalProperties` in the spec is a map with no other constraints, so
 * this keeps the extra data rather than guessing at a shape.
 */
// Audit event payloads are provider-defined JSON objects whose keys vary per
// event type, so a stricter type would reject real responses.
const FreeFormObjectSchema = z.record(z.string(), z.unknown()); // unknown: any JSON

const OrganizationGetResponseSchema = z
	.object({
		name: z.string(),
		subscriptionType: z.string(),
		quotas: z
			.object({
				maxNumberOfActiveInteractiveUsers: QuotaValuesSchema,
				maxNumberOfActiveProjects: QuotaValuesSchema,
				maxNumberOfCertificates: z.record(z.string(), QuotaValuesSchema),
				yearlyMaxSizeOfArtifactsInBytes: QuotaValuesSchema,
				yearlyMaxNumberOfIndividualSignatures: QuotaValuesSchema,
				releaseArtifactRetentionTime: z.string().nullish(),
				testArtifactRetentionTime: z.string().nullish(),
				quotaPeriodStart: z.string(),
				quotaPeriodEnd: z.string(),
			})
			.loose(),
	})
	.loose();

export type OrganizationGetResponse = z.infer<
	typeof OrganizationGetResponseSchema
>;

// ── users.me ──────────────────────────────────────────────────────────────

const UsersMeInputSchema = z.object({});

export type UsersMeInput = z.infer<typeof UsersMeInputSchema>;

const UsersMeResponseSchema = z
	.object({
		userId: Uuid,
		name: z.string(),
		identity: z.string().nullish(),
		accountEmailAddress: z.string().nullish(),
		role: z.enum([
			'RegularUser',
			'GlobalReader',
			'UserAdministrator',
			'ProjectAdministrator',
			'CertificateAdministrator',
			'GlobalAdministrator',
			'Support',
			'DirectorySynchronizer',
		]),
		description: z.string().nullish(),
		notificationEmailAddress: z
			.object({
				unconfirmedEmail: z.string().nullish(),
				confirmedEmail: z.string().nullish(),
			})
			.loose(),
		status: z.enum(['Active', 'Inactive']),
		isInvitationPending: z.boolean().nullish(),
		isDirectorySynchronized: z.boolean(),
		userType: z.enum(['InteractiveUser', 'CIUser']),
	})
	.loose();

export type UsersMeResponse = z.infer<typeof UsersMeResponseSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({});

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectSigningPolicySummarySchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string().nullish(),
		status: SigningPolicyStatusSchema,
	})
	.loose();

const ProjectsListResponseSchema = z.object({
	projects: z
		.array(
			z
				.object({
					name: z.string(),
					slug: z.string(),
					description: z.string().nullish(),
					status: ProjectStatusSchema,
					signingPolicies: z.array(ProjectSigningPolicySummarySchema),
				})
				.loose(),
		)
		.describe('Every project in the organization; this route does not page.'),
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetInputSchema = z.object({
	projectSlug: Slug.describe('The project to read.'),
});

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string().nullish(),
		status: ProjectStatusSchema,
		repositoryUrls: z.array(z.string()).nullish(),
		artifactConfigurations: z.array(
			z
				.object({
					name: z.string(),
					slug: z.string(),
					description: z.string().nullish(),
					status: ArtifactConfigurationStatusSchema,
					isDefault: z.boolean(),
					artifactConfigurationXmlLink: z.string(),
				})
				.loose(),
		),
		signingPolicies: z.array(
			z
				.object({
					name: z.string(),
					slug: z.string(),
					description: z.string().nullish(),
					status: SigningPolicyStatusSchema,
					submitters: z.array(ParticipantReferenceSchema),
					approvers: z.array(ParticipantReferenceSchema),
					numberOfRequiredApprovals: z.number(),
					purpose: PurposeSchema.nullish(),
					certificateLink: z.string(),
					disableMalwareScanning: z.boolean(),
					verifiesTrustedBuildSystem: z.boolean(),
					verifiesOriginPolicy: z.boolean(),
					trustedBuildSystemVerification: z
						.object({
							requireTrustedBuildSystem: z.boolean().nullish(),
							originPolicyVerification: z
								.object({
									verifyOriginPolicy: z.boolean(),
									allowedBranchNames: z.array(z.string()).nullish(),
									allowedBuildDefinitions: z.array(z.string()).nullish(),
								})
								.loose()
								.nullish(),
						})
						.loose()
						.nullish(),
					pipelinePolicies: z.array(
						z
							.object({
								id: Uuid,
								slug: z.string(),
								name: z.string(),
								type: z.string(),
								status: z.string(),
								level: z.string(),
								link: z.string(),
							})
							.loose(),
					),
				})
				.loose(),
		),
		trustedBuildSystemLinks: z.array(
			z
				.object({
					name: z.string(),
					slug: z.string(),
					type: z.enum(['Custom', 'Predefined']),
					status: z.enum(['Active', 'Inactive']),
					link: z.string(),
				})
				.loose(),
		),
		readers: z.array(ParticipantReferenceSchema),
		configurators: z.array(ParticipantReferenceSchema),
	})
	.loose();

export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1).max(100),
	slug: Slug.describe(
		'Unique within the organization; used in every project path.',
	),
	description: Description.optional(),
	readerIds: z
		.array(Uuid)
		.optional()
		.describe(
			'Interactive users, CI users or groups allowed to read the project.',
		),
	configuratorIds: z
		.array(Uuid)
		.optional()
		.describe('Participants allowed to change the project.'),
	repositoryUrls: z.array(z.string()).optional(),
	artifactConfigurationXml: z
		.string()
		.min(1)
		.describe(
			'The artifact configuration itself, as XML. A project needs one.',
		),
});

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

/**
 * Create answers 201 with the new slug in `Location` and no body; core's
 * client cannot return a header alongside a body, so the response is the
 * project reference a caller already knows plus what they can act on next.
 */
const ProjectsCreateResponseSchema = z.object({
	slug: z.string(),
	created: z.literal(true),
	/** `GET Projects/{slug}/ArtifactConfigurations/{slug}/Xml` for verification. */
	artifactConfigurationXml: z.string().describe('Echoed back from the input.'),
});

export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

const ProjectsUpdateInputSchema = z.object({
	projectSlug: Slug.describe('The project to change.'),
	/** SignPath has no rename, so this is the name shown in the UI. */
	name: z.string().min(1).max(100),
	/**
	 * The body requires the slug. Pass the same value as `projectSlug` unless
	 * you mean to move the project to a new slug.
	 */
	slug: Slug,
	description: Description.nullish(),
	readerIds: z.array(Uuid).nullish(),
	configuratorIds: z.array(Uuid).nullish(),
	repositoryUrls: z.array(z.string()).nullish(),
});

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsStatusChangeResponseSchema = z.object({
	projectSlug: z.string(),
	success: z.literal(true),
});

export type ProjectsStatusChangeResponse = z.infer<
	typeof ProjectsStatusChangeResponseSchema
>;

const ProjectsSetDefaultArtifactConfigurationInputSchema = z.object({
	projectSlug: Slug,
	artifactConfigurationSlug: Slug,
});

export type ProjectsSetDefaultArtifactConfigurationInput = z.infer<
	typeof ProjectsSetDefaultArtifactConfigurationInputSchema
>;

const ProjectsSetDefaultArtifactConfigurationResponseSchema = z.object({
	projectSlug: z.string(),
	artifactConfigurationSlug: z.string(),
	success: z.literal(true),
});

export type ProjectsSetDefaultArtifactConfigurationResponse = z.infer<
	typeof ProjectsSetDefaultArtifactConfigurationResponseSchema
>;

// ── signingPolicies ───────────────────────────────────────────────────────

const SigningPoliciesGetInputSchema = z.object({
	projectSlug: Slug,
	signingPolicySlug: Slug,
});

export type SigningPoliciesGetInput = z.infer<
	typeof SigningPoliciesGetInputSchema
>;

const SigningPoliciesGetResponseSchema = z
	.object({
		name: z.string(),
		slug: z.string(),
		description: z.string().nullish(),
		status: SigningPolicyStatusSchema,
		purpose: PurposeSchema.nullish(),
		submitters: z.array(ParticipantReferenceSchema),
		approvers: z.array(ParticipantReferenceSchema),
		numberOfRequiredApprovals: z.number(),
		certificateLink: z.string(),
		disableMalwareScanning: z.boolean(),
		/** Deprecated by SignPath in favour of `trustedBuildSystemVerification`. */
		verifiesTrustedBuildSystem: z.boolean().optional(),
		/** Deprecated by SignPath in favour of `trustedBuildSystemVerification`. */
		verifiesOriginPolicy: z.boolean().optional(),
		trustedBuildSystemVerification: z
			.object({
				requireTrustedBuildSystem: z.boolean().nullish(),
				originPolicyVerification: z
					.object({
						verifyOriginPolicy: z.boolean(),
						allowedBranchNames: z.array(z.string()).nullish(),
						allowedBuildDefinitions: z.array(z.string()).nullish(),
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		pipelinePolicies: z.array(
			z
				.object({
					id: Uuid,
					slug: z.string(),
					name: z.string(),
					type: z.string(),
					status: z.string(),
					level: z.string(),
					link: z.string(),
				})
				.loose(),
		),
	})
	.loose();

export type SigningPoliciesGetResponse = z.infer<
	typeof SigningPoliciesGetResponseSchema
>;

const SigningPolicyApprovalInputSchema = z.object({
	approverIds: z.array(Uuid).min(1),
	numberOfRequiredApprovals: z.number().int().min(1).max(50),
});

const OriginPolicyVerificationInputSchema = z.object({
	verifyOriginPolicy: z.boolean(),
	allowedBranchNames: z.array(z.string()).nullish(),
	allowedBuildDefinitions: z.array(z.string()).nullish(),
});

const TrustedBuildSystemVerificationInputSchema = z.object({
	requireTrustedBuildSystem: z.boolean(),
	originPolicyVerification: OriginPolicyVerificationInputSchema.optional(),
});

/** Both the create and the edit body, which SignPath declares identically. */
const signingPolicyBody = {
	name: z.string().min(1).max(100),
	slug: Slug,
	description: Description.nullish(),
	certificateSlug: Slug.describe('The certificate this policy signs with.'),
	submitterIds: z
		.array(Uuid)
		.min(1)
		.describe(
			'Participants who may submit signing requests under this policy.',
		),
	disableMalwareScanning: z
		.boolean()
		.describe(
			'SignPath requires this field, so pass false to keep scanning on.',
		),
	purpose: PurposeSchema.optional().describe(
		'Whether the resulting signatures are test or release signatures. SignPath defaults it when omitted.',
	),
	approval: SigningPolicyApprovalInputSchema.optional(),
	trustedBuildSystemVerification:
		TrustedBuildSystemVerificationInputSchema.optional(),
};

const SigningPoliciesCreateInputSchema = z
	.object({
		projectSlug: Slug,
		...signingPolicyBody,
	})
	.describe(
		'Adds a signing policy. The policy is created inactive; activate it to accept submissions.',
	);

export type SigningPoliciesCreateInput = z.infer<
	typeof SigningPoliciesCreateInputSchema
>;

const SigningPoliciesCreateResponseSchema = z.object({
	projectSlug: z.string(),
	signingPolicySlug: z.string(),
	created: z.literal(true),
});

export type SigningPoliciesCreateResponse = z.infer<
	typeof SigningPoliciesCreateResponseSchema
>;

const SigningPoliciesUpdateInputSchema = z.object({
	projectSlug: Slug,
	signingPolicySlug: Slug.describe('The policy to change.'),
	...signingPolicyBody,
});

export type SigningPoliciesUpdateInput = z.infer<
	typeof SigningPoliciesUpdateInputSchema
>;

const SigningPoliciesStatusChangeInputSchema = z.object({
	projectSlug: Slug,
	signingPolicySlug: Slug,
});

export type SigningPoliciesStatusChangeInput = z.infer<
	typeof SigningPoliciesStatusChangeInputSchema
>;

const SigningPoliciesStatusChangeResponseSchema = z.object({
	projectSlug: z.string(),
	signingPolicySlug: z.string(),
	success: z.literal(true),
});

export type SigningPoliciesStatusChangeResponse = z.infer<
	typeof SigningPoliciesStatusChangeResponseSchema
>;

// ── artifactConfigurations ────────────────────────────────────────────────

const ArtifactConfigurationTargetSchema = z.object({
	projectSlug: Slug,
	artifactConfigurationSlug: Slug,
});

const ArtifactConfigurationsGetXmlInputSchema =
	ArtifactConfigurationTargetSchema;

export type ArtifactConfigurationsGetXmlInput = z.infer<
	typeof ArtifactConfigurationsGetXmlInputSchema
>;

const ArtifactConfigurationsGetXmlResponseSchema = z.object({
	projectSlug: z.string(),
	artifactConfigurationSlug: z.string(),
	/** The document exactly as SignPath stored it, as text. */
	xml: z.string(),
});

export type ArtifactConfigurationsGetXmlResponse = z.infer<
	typeof ArtifactConfigurationsGetXmlResponseSchema
>;

const ArtifactConfigurationsUpdateXmlInputSchema = z.object({
	projectSlug: Slug,
	artifactConfigurationSlug: Slug,
	artifactConfigurationXml: z
		.string()
		.min(1)
		.describe('The complete replacement document. SignPath does not merge it.'),
});

export type ArtifactConfigurationsUpdateXmlInput = z.infer<
	typeof ArtifactConfigurationsUpdateXmlInputSchema
>;

const ArtifactConfigurationsUpdateXmlResponseSchema = z.object({
	projectSlug: z.string(),
	artifactConfigurationSlug: z.string(),
	success: z.literal(true),
});

export type ArtifactConfigurationsUpdateXmlResponse = z.infer<
	typeof ArtifactConfigurationsUpdateXmlResponseSchema
>;

const ArtifactConfigurationsStatusChangeResponseSchema = z.object({
	projectSlug: z.string(),
	artifactConfigurationSlug: z.string(),
	success: z.literal(true),
});

export type ArtifactConfigurationsStatusChangeResponse = z.infer<
	typeof ArtifactConfigurationsStatusChangeResponseSchema
>;

// ── certificates ──────────────────────────────────────────────────────────

const CertificatesListInputSchema = z.object({});

export type CertificatesListInput = z.infer<typeof CertificatesListInputSchema>;

const CertificatesListResponseSchema = z.object({
	certificates: z
		.array(
			z
				.object({
					certificateId: Uuid,
					name: z.string(),
					slug: z.string(),
					description: z.string().nullish(),
					status: CertificateStatusSchema,
					type: CertificateTypeSchema,
					purpose: PurposeSchema.nullish(),
					keyStoreId: z.string(),
					keyStoreKeyId: z.string().nullish(),
					keyAlgorithm: KeyAlgorithmSchema.nullish(),
					keyAlgorithmGroup: KeyAlgorithmGroupSchema,
					x509CertificateData: X509CertificateDataSchema.nullish(),
					gpgKeyData: GpgKeyDataSchema.nullish(),
				})
				.loose(),
		)
		.describe(
			'Every certificate in the organization; this route does not page.',
		),
});

export type CertificatesListResponse = z.infer<
	typeof CertificatesListResponseSchema
>;

const CertificatesGetInputSchema = z.object({
	certificateSlug: Slug,
});

export type CertificatesGetInput = z.infer<typeof CertificatesGetInputSchema>;

const CertificatesGetResponseSchema = CertificateSchema;

export type CertificatesGetResponse = z.infer<
	typeof CertificatesGetResponseSchema
>;

// ── signingRequests ───────────────────────────────────────────────────────

const SigningRequestOriginSchema = z
	.object({
		repositoryData: z
			.object({
				sourceControlManagementType: z.string(),
				url: z.string(),
				isPublicRepository: z.boolean().nullish(),
				branchName: z.string(),
				commitId: z.string(),
				webUrl: z.string().nullish(),
				commitWebUrl: z.string().nullish(),
			})
			.loose()
			.nullish(),
		buildData: z
			.object({
				url: z.string().nullish(),
				buildSettingsFile: z
					.object({ fileName: z.string(), downloadLink: z.string() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

/** A signing request as `signingRequests.get` returns it. */
const SigningRequestSchema = z
	.object({
		signingRequestId: Uuid,
		status: SigningRequestStatusSchema,
		workflowStatus: SigningRequestWorkflowStatusSchema,
		malwareScanningStatus: MalwareScanningStatusSchema.optional(),
		isFinalStatus: z.boolean(),
		description: z.string().nullish(),
		projectId: Uuid,
		projectSlug: z.string(),
		projectName: z.string(),
		artifactConfigurationId: Uuid,
		artifactConfigurationSlug: z.string(),
		artifactConfigurationName: z.string(),
		signingPolicyId: Uuid,
		signingPolicySlug: z.string(),
		signingPolicyName: z.string(),
		unsignedArtifactLink: z.string().nullish(),
		signedArtifactLink: z.string().nullish(),
		origin: SigningRequestOriginSchema.nullish(),
		parameters: z.record(z.string(), z.string()).nullish(),
		originalSigningRequestLink: z.string().nullish(),
		artifactDescriptionXmlLink: z.string().nullish(),
		cancellationTimeoutInSeconds: z.number().nullish(),
		cancellationReason: CancellationReasonSchema.nullish(),
		webLink: z.string(),
	})
	.loose();

export type SignpathSigningRequest = z.infer<typeof SigningRequestSchema>;

/** The fields that identify the project, policy and configuration to sign with. */
const signingTarget = {
	projectSlug: Slug,
	artifactConfigurationSlug: Slug.optional().describe(
		"Defaults to the project's default artifact configuration.",
	),
	signingPolicySlug: Slug.describe(
		'The policy whose certificate and approval rules apply.',
	),
	description: Description.optional(),
	cancellationTimeoutInSeconds: CancellationTimeout.optional().describe(
		'How long the request may wait before SignPath cancels it.',
	),
};

const SigningRequestsListInputSchema = z.object({
	submittedAfter: z
		.string()
		.optional()
		.describe('ISO 8601 timestamp; only requests submitted at or after it.'),
	submittedBefore: z
		.string()
		.optional()
		.describe('ISO 8601 timestamp; only requests submitted before it.'),
	projectSlug: Slug.optional(),
	artifactConfigurationSlug: Slug.optional(),
	signingPolicySlug: Slug.optional(),
	certificateSlug: Slug.optional(),
	signingRequestStatus: z.array(SigningRequestStatusSchema).optional(),
	nextLink: z
		.string()
		.optional()
		.describe(
			'Pass `pagination.nextLink` from the previous page to read the next one. The other filters are already encoded in it.',
		),
});

export type SigningRequestsListInput = z.infer<
	typeof SigningRequestsListInputSchema
>;

const SigningRequestsListResponseSchema = z.object({
	signingRequests: z.array(
		z
			.object({
				signingRequestId: Uuid,
				status: SigningRequestStatusSchema,
				projectId: Uuid,
				projectSlug: z.string(),
				projectName: z.string(),
				artifactConfigurationId: Uuid,
				artifactConfigurationSlug: z.string(),
				artifactConfigurationName: z.string(),
				signingPolicyId: Uuid,
				signingPolicySlug: z.string(),
				signingPolicyName: z.string(),
				certificateId: Uuid,
				certificateSlug: z.string(),
				certificateName: z.string(),
				submittedAt: z.string(),
				submittedById: Uuid,
				submittedByIdentity: z.string().nullish(),
				submittedByName: z.string(),
				signingRequestDetailsLink: z.string(),
				cancellationTimeoutInSeconds: z.number().nullish(),
				cancellationReason: CancellationReasonSchema.nullish(),
			})
			.loose(),
	),
	pagination: z
		.object({
			nextLink: z
				.string()
				.nullish()
				.describe(
					'Null on the last page; otherwise pass it back as `nextLink`.',
				),
		})
		.loose(),
});

export type SigningRequestsListResponse = z.infer<
	typeof SigningRequestsListResponseSchema
>;

const SigningRequestTargetSchema = z.object({
	signingRequestId: Uuid,
});

export type SigningRequestTargetInput = z.infer<
	typeof SigningRequestTargetSchema
>;

const SigningRequestsGetResponseSchema = SigningRequestSchema;

export type SigningRequestsGetResponse = z.infer<
	typeof SigningRequestsGetResponseSchema
>;

const SigningRequestsGetStatusResponseSchema = z
	.object({
		signingRequestId: Uuid,
		status: SigningRequestStatusSchema,
		workflowStatus: SigningRequestWorkflowStatusSchema,
		isFinalStatus: z
			.boolean()
			.describe('True once the request reached a status it cannot leave.'),
	})
	.loose();

export type SigningRequestsGetStatusResponse = z.infer<
	typeof SigningRequestsGetStatusResponseSchema
>;

const parametersField = z
	.record(z.string(), z.string())
	.optional()
	.describe(
		"Values for the artifact configuration's user-defined parameters, sent as `parameters.<name>` form fields.",
	);

const SigningRequestsSubmitWithArtifactInputSchema = z.object({
	...signingTarget,
	artifactBase64: z
		.string()
		.min(1)
		.describe('The unsigned artifact, base64 encoded.'),
	artifactFileName: z
		.string()
		.min(1)
		.max(5000)
		.describe(
			'SignPath uses the extension to pick the signing tool, so keep it accurate.',
		),
	artifactContentType: z
		.string()
		.optional()
		.describe('Defaults to `application/octet-stream`.'),
	parameters: parametersField,
});

export type SigningRequestsSubmitWithArtifactInput = z.infer<
	typeof SigningRequestsSubmitWithArtifactInputSchema
>;

const SigningRequestsSubmitWithArtifactResponseSchema = SigningRequestSchema;

export type SigningRequestsSubmitWithArtifactResponse = z.infer<
	typeof SigningRequestsSubmitWithArtifactResponseSchema
>;

const SigningRequestsSubmitWithArtifactRetrievalLinkInputSchema = z.object({
	...signingTarget,
	artifactUrl: z
		.string()
		.describe('An HTTPS URL SignPath downloads the artifact from.'),
	artifactFileName: z.string().min(1).max(5000),
	artifactSha256: z
		.string()
		.length(64)
		.optional()
		.describe('Verified after the download; lowercase hex.'),
	httpHeaders: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Extra headers for the download, sent as `artifactRetrievalLink.httpHeaders.<name>` form fields. Values are visible in the SignPath UI.',
		),
	parameters: parametersField,
});

export type SigningRequestsSubmitWithArtifactRetrievalLinkInput = z.infer<
	typeof SigningRequestsSubmitWithArtifactRetrievalLinkInputSchema
>;

const SigningRequestsSubmitWithArtifactRetrievalLinkResponseSchema =
	SigningRequestSchema;

export type SigningRequestsSubmitWithArtifactRetrievalLinkResponse = z.infer<
	typeof SigningRequestsSubmitWithArtifactRetrievalLinkResponseSchema
>;

const SigningRequestsSubmitWithoutArtifactInputSchema = z.object({
	...signingTarget,
	artifactId: z
		.string()
		.min(1)
		.max(5000)
		.describe(
			'A name for the artifact SignPath will receive later through `signingRequests.uploadUnsignedArtifact`.',
		),
	artifactSha256: z
		.string()
		.length(64)
		.describe('Lowercase hex SHA-256 of the artifact that will be uploaded.'),
	parameters: parametersField,
});

export type SigningRequestsSubmitWithoutArtifactInput = z.infer<
	typeof SigningRequestsSubmitWithoutArtifactInputSchema
>;

/**
 * This route answers with the signing request plus an `uploadLink`, which is
 * the only way to deliver the artifact afterwards.
 */
const SigningRequestsSubmitWithoutArtifactResponseSchema =
	SigningRequestSchema.extend({
		uploadLink: z
			.string()
			.describe(
				'The URL the artifact must be uploaded to. SignPath returns it only here.',
			),
	});

export type SigningRequestsSubmitWithoutArtifactResponse = z.infer<
	typeof SigningRequestsSubmitWithoutArtifactResponseSchema
>;

const RsaOptionsSchema = z
	.object({
		paddingMode: z.enum(['Pkcs1', 'Pss']),
		hashAlgorithmOid: z.string().max(100).nullish(),
		hashAlgorithmName: z.enum(['Sha1', 'Sha256', 'Sha384', 'Sha512']).nullish(),
	})
	.loose();

const EcdsaOptionsSchema = z
	.object({ signatureFormat: z.enum(['Ieee', 'Asn1']) })
	.loose();

const MldsaOptionsSchema = z
	.object({
		preHashAlgorithmOid: z.string().max(100).nullish(),
		preHashAlgorithmName: z.enum(['Sha256', 'Sha384', 'Sha512']).nullish(),
	})
	.loose();

const SignMetadataSchema = z
	.object({
		sourceProcess: z
			.object({
				commandLine: z.string().max(5000).nullish(),
				user: z.string().max(100).nullish(),
			})
			.loose()
			.optional(),
	})
	.loose();

const SigningRequestsSignHashInputSchema = z
	.object({
		...signingTarget,
		hash: z.string().min(1).describe('The hash to sign, base64 encoded.'),
		signatureAlgorithm: z.enum(['Rsa', 'Ecdsa', 'HashMldsa']),
		rsaOptions: RsaOptionsSchema.optional(),
		ecdsaOptions: EcdsaOptionsSchema.optional(),
		mldsaOptions: MldsaOptionsSchema.optional(),
		metadata: SignMetadataSchema.optional(),
	})
	.superRefine((value, ctx) => {
		// Each algorithm reads its own options object, and the padding mode or
		// signature format inside it is required, so a call without the matching
		// object cannot be signed. Failing here saves a round trip that would
		// otherwise sign nothing.
		const required = {
			Rsa: ['rsaOptions'],
			Ecdsa: ['ecdsaOptions'],
			HashMldsa: ['mldsaOptions'],
		} as const;
		for (const field of required[value.signatureAlgorithm]) {
			if (value[field] === undefined) {
				ctx.addIssue({
					code: 'custom',
					path: [field],
					message: `${field} is required when signatureAlgorithm is ${value.signatureAlgorithm}.`,
				});
			}
		}
	});

export type SigningRequestsSignHashInput = z.infer<
	typeof SigningRequestsSignHashInputSchema
>;

const SigningResultSchema = z
	.object({
		signature: z.string().describe('The signature, base64 encoded.'),
	})
	.loose();

const SigningRequestsSignHashResponseSchema = z.object({
	signingRequestId: Uuid,
	hashSigningData: z
		.object({ hash: z.string() })
		.loose()
		.describe('The hash SignPath signed, base64 encoded.'),
	hashSigningResult: SigningResultSchema,
	webLink: z.string(),
});

export type SigningRequestsSignHashResponse = z.infer<
	typeof SigningRequestsSignHashResponseSchema
>;

const SigningRequestsSignMessageInputSchema = z.object({
	...signingTarget,
	message: z.string().min(1).describe('The message to sign, base64 encoded.'),
	signatureAlgorithm: z
		.enum(['PureMldsa'])
		.describe('The only message signing algorithm SignPath supports.'),
	metadata: SignMetadataSchema.optional(),
});

export type SigningRequestsSignMessageInput = z.infer<
	typeof SigningRequestsSignMessageInputSchema
>;

const SigningRequestsSignMessageResponseSchema = z.object({
	signingRequestId: Uuid,
	signingData: z
		.object({ message: z.string() })
		.loose()
		.describe('The message SignPath signed, base64 encoded.'),
	signingResult: SigningResultSchema,
	webLink: z.string(),
});

export type SigningRequestsSignMessageResponse = z.infer<
	typeof SigningRequestsSignMessageResponseSchema
>;

const SigningRequestsResubmitInputSchema = z.object({
	originalSigningRequestId: Uuid,
	signingPolicySlug: Slug.describe(
		'Usually a different policy, for example a release policy after test signing.',
	),
	description: Description.optional(),
	keepSnapshottedArtifactConfiguration: z
		.boolean()
		.optional()
		.describe(
			'Use the artifact configuration captured when the original request was submitted, not the current one.',
		),
	cancellationTimeoutInSeconds: CancellationTimeout.optional(),
});

export type SigningRequestsResubmitInput = z.infer<
	typeof SigningRequestsResubmitInputSchema
>;

/**
 * Resubmit answers 201 and puts the new request in `Location` with no body;
 * `signingRequests.list` filtered by project finds it, so this reports what
 * was asked for rather than inventing an id.
 */
const SigningRequestsResubmitResponseSchema = z.object({
	originalSigningRequestId: Uuid,
	signingPolicySlug: z.string(),
	resubmitted: z.literal(true),
});

export type SigningRequestsResubmitResponse = z.infer<
	typeof SigningRequestsResubmitResponseSchema
>;

const SigningRequestsDenyInputSchema = z.object({
	signingRequestId: Uuid,
	denyReason: Description.optional(),
});

export type SigningRequestsDenyInput = z.infer<
	typeof SigningRequestsDenyInputSchema
>;

const SigningRequestActionResponseSchema = z.object({
	signingRequestId: z.string(),
	success: z.literal(true),
});

export type SigningRequestActionResponse = z.infer<
	typeof SigningRequestActionResponseSchema
>;

// ── auditLog ──────────────────────────────────────────────────────────────

const AuditLogQuerySchema = z.object({
	cursor: z
		.string()
		.max(5000)
		.optional()
		.describe('Pass `pagination.nextCursor` from the previous page.'),
	startTime: z
		.string()
		.optional()
		.describe('ISO 8601 timestamp to read from, when you have no cursor.'),
});

const AuditLogEventsInputSchema = AuditLogQuerySchema;

export type AuditLogEventsInput = z.infer<typeof AuditLogEventsInputSchema>;

const AuditLogSigningRequestEventsInputSchema = AuditLogQuerySchema;

export type AuditLogSigningRequestEventsInput = z.infer<
	typeof AuditLogSigningRequestEventsInputSchema
>;

const AuditLogEventSchema = z
	.object({
		metadata: z
			.object({
				eventName: z.string(),
				eventVersion: z.number(),
				organizationId: z.string(),
				entityId: z.string(),
				timestamp: z.string(),
				actor: z
					.object({
						id: Uuid.nullish(),
						type: z.string(),
						identity: z.string().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			})
			.loose(),
		entityMetadata: FreeFormObjectSchema.describe(
			'Fields of the entity the event concerns; the shape depends on eventName.',
		),
		data: FreeFormObjectSchema.describe(
			'What changed; the shape depends on eventName.',
		),
	})
	.loose();

export type SignpathAuditLogEvent = z.infer<typeof AuditLogEventSchema>;

const AuditLogResponseSchema = z.object({
	auditLogEvents: z.array(AuditLogEventSchema),
	pagination: z
		.object({
			nextCursor: z
				.string()
				.nullish()
				.describe(
					'Null when there is nothing newer; otherwise pass it back as `cursor`.',
				),
			nextLink: z.string().nullish(),
		})
		.loose(),
});

export type AuditLogResponse = z.infer<typeof AuditLogResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SignpathEndpointInputs = {
	organizationGet: OrganizationGetInput;
	usersMe: UsersMeInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsActivate: ProjectsGetInput;
	projectsDeactivate: ProjectsGetInput;
	projectsSetDefaultArtifactConfiguration: ProjectsSetDefaultArtifactConfigurationInput;
	signingPoliciesGet: SigningPoliciesGetInput;
	signingPoliciesCreate: SigningPoliciesCreateInput;
	signingPoliciesUpdate: SigningPoliciesUpdateInput;
	signingPoliciesActivate: SigningPoliciesStatusChangeInput;
	signingPoliciesDeactivate: SigningPoliciesStatusChangeInput;
	artifactConfigurationsGetXml: ArtifactConfigurationsGetXmlInput;
	artifactConfigurationsUpdateXml: ArtifactConfigurationsUpdateXmlInput;
	artifactConfigurationsActivate: ArtifactConfigurationsGetXmlInput;
	artifactConfigurationsDeactivate: ArtifactConfigurationsGetXmlInput;
	certificatesList: CertificatesListInput;
	certificatesGet: CertificatesGetInput;
	signingRequestsList: SigningRequestsListInput;
	signingRequestsGet: SigningRequestTargetInput;
	signingRequestsGetStatus: SigningRequestTargetInput;
	signingRequestsSubmitWithArtifact: SigningRequestsSubmitWithArtifactInput;
	signingRequestsSubmitWithArtifactRetrievalLink: SigningRequestsSubmitWithArtifactRetrievalLinkInput;
	signingRequestsSubmitWithoutArtifact: SigningRequestsSubmitWithoutArtifactInput;
	signingRequestsSignHash: SigningRequestsSignHashInput;
	signingRequestsSignMessage: SigningRequestsSignMessageInput;
	signingRequestsResubmit: SigningRequestsResubmitInput;
	signingRequestsCancel: SigningRequestTargetInput;
	signingRequestsApprove: SigningRequestTargetInput;
	signingRequestsDeny: SigningRequestsDenyInput;
	auditLogListEvents: AuditLogEventsInput;
	auditLogListSigningRequestEvents: AuditLogSigningRequestEventsInput;
};

export type SignpathEndpointOutputs = {
	organizationGet: OrganizationGetResponse;
	usersMe: UsersMeResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsStatusChangeResponse;
	projectsActivate: ProjectsStatusChangeResponse;
	projectsDeactivate: ProjectsStatusChangeResponse;
	projectsSetDefaultArtifactConfiguration: ProjectsSetDefaultArtifactConfigurationResponse;
	signingPoliciesGet: SigningPoliciesGetResponse;
	signingPoliciesCreate: SigningPoliciesCreateResponse;
	signingPoliciesUpdate: SigningPoliciesStatusChangeResponse;
	signingPoliciesActivate: SigningPoliciesStatusChangeResponse;
	signingPoliciesDeactivate: SigningPoliciesStatusChangeResponse;
	artifactConfigurationsGetXml: ArtifactConfigurationsGetXmlResponse;
	artifactConfigurationsUpdateXml: ArtifactConfigurationsUpdateXmlResponse;
	artifactConfigurationsActivate: ArtifactConfigurationsStatusChangeResponse;
	artifactConfigurationsDeactivate: ArtifactConfigurationsStatusChangeResponse;
	certificatesList: CertificatesListResponse;
	certificatesGet: CertificatesGetResponse;
	signingRequestsList: SigningRequestsListResponse;
	signingRequestsGet: SigningRequestsGetResponse;
	signingRequestsGetStatus: SigningRequestsGetStatusResponse;
	signingRequestsSubmitWithArtifact: SigningRequestsSubmitWithArtifactResponse;
	signingRequestsSubmitWithArtifactRetrievalLink: SigningRequestsSubmitWithArtifactRetrievalLinkResponse;
	signingRequestsSubmitWithoutArtifact: SigningRequestsSubmitWithoutArtifactResponse;
	signingRequestsSignHash: SigningRequestsSignHashResponse;
	signingRequestsSignMessage: SigningRequestsSignMessageResponse;
	signingRequestsResubmit: SigningRequestsResubmitResponse;
	signingRequestsCancel: SigningRequestActionResponse;
	signingRequestsApprove: SigningRequestActionResponse;
	signingRequestsDeny: SigningRequestActionResponse;
	auditLogListEvents: AuditLogResponse;
	auditLogListSigningRequestEvents: AuditLogResponse;
};

export const SignpathEndpointInputSchemas = {
	organizationGet: OrganizationGetInputSchema,
	usersMe: UsersMeInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsActivate: ProjectsGetInputSchema,
	projectsDeactivate: ProjectsGetInputSchema,
	projectsSetDefaultArtifactConfiguration:
		ProjectsSetDefaultArtifactConfigurationInputSchema,
	signingPoliciesGet: SigningPoliciesGetInputSchema,
	signingPoliciesCreate: SigningPoliciesCreateInputSchema,
	signingPoliciesUpdate: SigningPoliciesUpdateInputSchema,
	signingPoliciesActivate: SigningPoliciesStatusChangeInputSchema,
	signingPoliciesDeactivate: SigningPoliciesStatusChangeInputSchema,
	artifactConfigurationsGetXml: ArtifactConfigurationsGetXmlInputSchema,
	artifactConfigurationsUpdateXml: ArtifactConfigurationsUpdateXmlInputSchema,
	artifactConfigurationsActivate: ArtifactConfigurationTargetSchema,
	artifactConfigurationsDeactivate: ArtifactConfigurationTargetSchema,
	certificatesList: CertificatesListInputSchema,
	certificatesGet: CertificatesGetInputSchema,
	signingRequestsList: SigningRequestsListInputSchema,
	signingRequestsGet: SigningRequestTargetSchema,
	signingRequestsGetStatus: SigningRequestTargetSchema,
	signingRequestsSubmitWithArtifact:
		SigningRequestsSubmitWithArtifactInputSchema,
	signingRequestsSubmitWithArtifactRetrievalLink:
		SigningRequestsSubmitWithArtifactRetrievalLinkInputSchema,
	signingRequestsSubmitWithoutArtifact:
		SigningRequestsSubmitWithoutArtifactInputSchema,
	signingRequestsSignHash: SigningRequestsSignHashInputSchema,
	signingRequestsSignMessage: SigningRequestsSignMessageInputSchema,
	signingRequestsResubmit: SigningRequestsResubmitInputSchema,
	signingRequestsCancel: SigningRequestTargetSchema,
	signingRequestsApprove: SigningRequestTargetSchema,
	signingRequestsDeny: SigningRequestsDenyInputSchema,
	auditLogListEvents: AuditLogEventsInputSchema,
	auditLogListSigningRequestEvents: AuditLogSigningRequestEventsInputSchema,
} as const;

export const SignpathEndpointOutputSchemas = {
	organizationGet: OrganizationGetResponseSchema,
	usersMe: UsersMeResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsStatusChangeResponseSchema,
	projectsActivate: ProjectsStatusChangeResponseSchema,
	projectsDeactivate: ProjectsStatusChangeResponseSchema,
	projectsSetDefaultArtifactConfiguration:
		ProjectsSetDefaultArtifactConfigurationResponseSchema,
	signingPoliciesGet: SigningPoliciesGetResponseSchema,
	signingPoliciesCreate: SigningPoliciesCreateResponseSchema,
	signingPoliciesUpdate: SigningPoliciesStatusChangeResponseSchema,
	signingPoliciesActivate: SigningPoliciesStatusChangeResponseSchema,
	signingPoliciesDeactivate: SigningPoliciesStatusChangeResponseSchema,
	artifactConfigurationsGetXml: ArtifactConfigurationsGetXmlResponseSchema,
	artifactConfigurationsUpdateXml:
		ArtifactConfigurationsUpdateXmlResponseSchema,
	artifactConfigurationsActivate:
		ArtifactConfigurationsStatusChangeResponseSchema,
	artifactConfigurationsDeactivate:
		ArtifactConfigurationsStatusChangeResponseSchema,
	certificatesList: CertificatesListResponseSchema,
	certificatesGet: CertificatesGetResponseSchema,
	signingRequestsList: SigningRequestsListResponseSchema,
	signingRequestsGet: SigningRequestsGetResponseSchema,
	signingRequestsGetStatus: SigningRequestsGetStatusResponseSchema,
	signingRequestsSubmitWithArtifact:
		SigningRequestsSubmitWithArtifactResponseSchema,
	signingRequestsSubmitWithArtifactRetrievalLink:
		SigningRequestsSubmitWithArtifactRetrievalLinkResponseSchema,
	signingRequestsSubmitWithoutArtifact:
		SigningRequestsSubmitWithoutArtifactResponseSchema,
	signingRequestsSignHash: SigningRequestsSignHashResponseSchema,
	signingRequestsSignMessage: SigningRequestsSignMessageResponseSchema,
	signingRequestsResubmit: SigningRequestsResubmitResponseSchema,
	signingRequestsCancel: SigningRequestActionResponseSchema,
	signingRequestsApprove: SigningRequestActionResponseSchema,
	signingRequestsDeny: SigningRequestActionResponseSchema,
	auditLogListEvents: AuditLogResponseSchema,
	auditLogListSigningRequestEvents: AuditLogResponseSchema,
} as const;
