import { z } from 'zod';

export const AppEnvSchema = z.enum(['DEVELOPMENT', 'STAGING', 'PRODUCTION']);
export type AppEnv = z.infer<typeof AppEnvSchema>;

export const BinaryDataSchema = z.object({
	kind: z.literal('binary'),
	contentType: z.string(),
	base64: z.string(),
	size: z.number().optional(),
});
export type BinaryData = z.infer<typeof BinaryDataSchema>;

export const SignatureProofTypeSchema = z.enum([
	'PDF_WITH_SIGNATURES',
	'ADVANCED_LEGAL_KIT',
	'SIGNED_DATA',
	'C2PA',
]);
export type SignatureProofType = z.infer<typeof SignatureProofTypeSchema>;

export const SignatureLowLevelProofTypeSchema = z.enum([
	'CADES',
	'PKCS7',
	'PADES_ATTACHED',
	'JWSDET',
	'JWSATT',
	'JADESDET',
	'JADESATT',
	'XADESDET',
	'XADESATT',
	'XMLDSIGDET',
	'XMLDSIGATT',
]);
export type SignatureLowLevelProofType = z.infer<
	typeof SignatureLowLevelProofTypeSchema
>;

export const PaginationDataSchema = z.object({
	total: z.number(),
	page: z.number().optional(),
	nbEventsPerPage: z.number().optional(),
});
export type PaginationData = z.infer<typeof PaginationDataSchema>;

export const DocumentSchema = z.object({
	_id: z.string().optional(),
	appId: z.string().optional(),
	appEnv: z.string().optional(),
	documentNature: z.string().optional(),
	status: z.string().optional(),
	documentHash: z.string().optional(),
	signatureRequestId: z.string().optional(),
	externalId: z.string().optional(),
	label: z.string().optional(),
	description: z.string().optional(),
	fileName: z.string().optional(),
	fileSize: z.number().optional(),
	mimeType: z.string().optional(),
	dataJsonContent: z.string().optional(),
	templateDisplayerId: z.string().optional(),
	templateDisplayerVersion: z.number().optional(),
});
export type Document = z.infer<typeof DocumentSchema>;

export const DocumentContextSchema = DocumentSchema.extend({
	statements: z
		.array(
			z.object({
				_id: z.string().optional(),
				labelMd: z.string().optional(),
			}),
		)
		.optional(),
	signatureSummaries: z
		.array(
			z.object({
				signatureId: z.string().optional(),
				signerId: z.string().optional(),
				date: z.coerce.date().optional(),
			}),
		)
		.optional(),
});
export type DocumentContext = z.infer<typeof DocumentContextSchema>;

export const SignerSummarySchema = z.object({
	signerId: z.string().optional(),
	externalId: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	status: z.string().optional(),
	isRecurrent: z.boolean().optional(),
	signerProfileId: z.string().optional(),
});
export type SignerSummary = z.infer<typeof SignerSummarySchema>;

export const SignerContextSchema = SignerSummarySchema.extend({
	claims: z
		.array(
			z.object({
				claimRef: z.string(),
				status: z.string(),
			}),
		)
		.optional(),
	latestSignatureRequests: z
		.array(
			z.object({
				_id: z.string().optional(),
				title: z.string().optional(),
				status: z.string().optional(),
			}),
		)
		.optional(),
});
export type SignerContext = z.infer<typeof SignerContextSchema>;

export const SignerCreationResponseSchema = z.object({
	signerId: z.string(),
	entityType: z.string().optional(),
	success: z.boolean().optional(),
	alreadyExists: z.boolean().optional(),
	authSecret: z.string().optional(),
});
export type SignerCreationResponse = z.infer<
	typeof SignerCreationResponseSchema
>;

export const SignersSearchResultSchema = z.object({
	signers: z.array(SignerSummarySchema),
	total: z.number(),
});
export type SignersSearchResult = z.infer<typeof SignersSearchResultSchema>;

export const SignatureRequestSchema = z.object({
	_id: z.string().optional(),
	appId: z.string().optional(),
	appEnv: z.string().optional(),
	title: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	documentIds: z.array(z.string()).optional(),
	signerIds: z.array(z.string()).optional(),
	signedBy: z.array(z.string()).optional(),
	externalId: z.string().optional(),
	expirationDate: z.coerce.date().optional(),
	closedAt: z.coerce.date().optional(),
});
export type SignatureRequest = z.infer<typeof SignatureRequestSchema>;

export const SignatureRequestContextSchema = SignatureRequestSchema.extend({
	signers: z.array(SignerSummarySchema).optional(),
	documents: z.array(DocumentContextSchema).optional(),
	statements: z
		.array(
			z.object({
				_id: z.string().optional(),
				labelMd: z.string().optional(),
			}),
		)
		.optional(),
	signatureProofsUrl: z.string().optional(),
	signatureProofStatus: z.string().optional(),
});
export type SignatureRequestContext = z.infer<
	typeof SignatureRequestContextSchema
>;

export const SignatureRequestsPaginateSchema = z.object({
	signatureRequests: z.array(SignatureRequestSchema),
	paginationData: PaginationDataSchema,
});
export type SignatureRequestsPaginate = z.infer<
	typeof SignatureRequestsPaginateSchema
>;

export const SignatureRequestPublishResponseSchema = z.object({
	signatureRequestId: z.string().optional(),
	signersBySide: z
		.array(
			z.object({
				signerId: z.string(),
				signerExternalId: z.string().optional(),
			}),
		)
		.optional(),
	signersEmbedded: z
		.array(
			z.object({
				signerId: z.string(),
				signerExternalId: z.string().optional(),
				token: z.string().optional(),
			}),
		)
		.optional(),
});
export type SignatureRequestPublishResponse = z.infer<
	typeof SignatureRequestPublishResponseSchema
>;

export const SignatureRequestsStatusContainerSchema = z.object({
	signatureRequests: z.array(
		z.object({
			signatureRequestId: z.string(),
			status: z.string(),
		}),
	),
});
export type SignatureRequestsStatusContainer = z.infer<
	typeof SignatureRequestsStatusContainerSchema
>;

export const SignatureSchema = z.object({
	_id: z.string().optional(),
	appId: z.string().optional(),
	appEnv: z.string().optional(),
	signerId: z.string().optional(),
	signerKeyId: z.string().optional(),
	sessionId: z.string().optional(),
	documentId: z.string().optional(),
	status: z.string().optional(),
	mode: z.string().optional(),
	signingIp: z.string().optional(),
	eidasLevel: z.string().optional(),
	signatures: z
		.array(
			z.object({
				type: z.string(),
				signatureFilePath: z.string().optional(),
				signingTime: z.coerce.date().optional(),
			}),
		)
		.optional(),
});
export type Signature = z.infer<typeof SignatureSchema>;

export const SignatureImagesSchema = z.object({
	documentId: z.string(),
	signatures: z.array(
		z.object({
			signerId: z.string(),
			imgB64: z.string(),
		}),
	),
});
export type SignatureImages = z.infer<typeof SignatureImagesSchema>;

export const SignerProfileSchema = z.object({
	_id: z.string().optional(),
	appId: z.string().optional(),
	appEnv: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	version: z.number().optional(),
	isRecurrent: z.boolean().optional(),
	integrationMode: z.string().optional(),
});
export type SignerProfile = z.infer<typeof SignerProfileSchema>;

export const ApplicationContextSchema = z.object({
	_createdAt: z.coerce.date().optional(),
	appId: z.string().optional(),
	orgId: z.string().optional(),
	appName: z.string().optional(),
	status: z.string().optional(),
	appType: z.string().optional(),
	ignisignApiVersion: z.string().optional(),
});
export type ApplicationContext = z.infer<typeof ApplicationContextSchema>;

export const BareSignatureProofSchema = z.object({
	appId: z.string().optional(),
	appEnv: z.string().optional(),
	signatureRequestId: z.string().optional(),
	signerId: z.string().optional(),
	proofs: z
		.array(
			z.object({
				documentId: z.string(),
				type: z.string().optional(),
				documentHash: z.string().optional(),
				proofB64: z.string().optional(),
				signingTime: z.coerce.date().optional(),
			}),
		)
		.optional(),
	signerInformation: z
		.object({
			fullName: z.string().optional(),
			lastName: z.string().optional(),
			firstName: z.string().optional(),
		})
		.optional(),
});
export type BareSignatureProof = z.infer<typeof BareSignatureProofSchema>;

export const IgnisignEndpointInputSchemas = {
	// signatureRequests
	'signatureRequests.createInOneCall': z
		.object({
			title: z.string(),
			signatureMethod: z.string(),
			signers: z
				.array(
					z
						.object({
							email: z.string().email(),
							firstName: z.string().optional(),
							lastName: z.string().optional(),
							signerProfileId: z.string().optional(),
						})
						.strict(),
				)
				.min(1),
			documents: z
				.array(
					z
						.object({
							originalName: z.string(),
							mimeType: z.string(),
							base64: z.string().optional(),
							url: z.string().optional(),
						})
						.strict(),
				)
				.min(1),
		})
		.strict(),

	'signatureRequests.init': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
		})
		.strict(),

	'signatureRequests.initSignerSetup': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
		})
		.strict(),

	'signatureRequests.list': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			page: z.number().int().positive().optional(),
		})
		.strict(),

	'signatureRequests.getContext': z
		.object({
			signatureRequestId: z.string(),
		})
		.strict(),

	'signatureRequests.update': z
		.object({
			signatureRequestId: z.string(),
			title: z.string().optional(),
			description: z.string().optional(),
			expirationDate: z.string().optional(),
			language: z.string().optional(),
			documentIds: z.array(z.string()).optional(),
			signerIds: z.array(z.string()).optional(),
			externalId: z.string().optional(),
		})
		.strict(),

	'signatureRequests.publish': z
		.object({
			signatureRequestId: z.string(),
		})
		.strict(),

	'signatureRequests.close': z
		.object({
			signatureRequestId: z.string(),
		})
		.strict(),

	'signatureRequests.getStatus': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signatureRequestIds: z.array(z.string()).min(1),
		})
		.strict(),

	// signers
	'signers.create': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().email().optional(),
			phoneNumber: z.string().optional(),
			nationality: z.string().optional(),
			birthDate: z.string().optional(),
			birthPlace: z.string().optional(),
			birthCountry: z.string().optional(),
			externalId: z.string().optional(),
			signerProfileId: z.string().optional(),
		})
		.strict(),

	'signers.getDetails': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerId: z.string(),
		})
		.strict(),

	'signers.getSummary': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerId: z.string(),
		})
		.strict(),

	'signers.update': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerId: z.string(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			email: z.string().email().optional(),
			phoneNumber: z.string().optional(),
			nationality: z.string().optional(),
			birthDate: z.string().optional(),
			birthPlace: z.string().optional(),
			birthCountry: z.string().optional(),
			externalId: z.string().optional(),
			signerProfileId: z.string().optional(),
		})
		.strict(),

	'signers.revoke': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerId: z.string(),
		})
		.strict(),

	'signers.regenerateAuthSecret': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerId: z.string(),
		})
		.strict(),

	'signers.search': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			filter: z.string(),
		})
		.strict(),

	'signers.list': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			page: z.number().int().positive().optional(),
		})
		.strict(),

	// documents
	'documents.initialize': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signatureRequestId: z.string(),
			externalId: z.string().optional(),
			label: z.string().optional(),
			description: z.string().optional(),
			templateDisplayerId: z.string().optional(),
			templateDisplayerVersion: z.number().optional(),
		})
		.strict(),

	'documents.get': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'documents.getContext': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'documents.update': z
		.object({
			documentId: z.string(),
			externalId: z.string().optional(),
			label: z.string().optional(),
			description: z.string().optional(),
			templateDisplayerId: z.string().optional(),
			templateDisplayerVersion: z.number().optional(),
		})
		.strict(),

	'documents.remove': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'documents.removeContent': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'documents.provideJsonContent': z
		.object({
			documentId: z.string(),
			// `unknown` because custom JSON documents may contain arbitrary valid JSON keys/values.
			jsonContent: z.record(z.string(), z.unknown()),
		})
		.strict(),

	'documents.providePrivateContent': z
		.object({
			documentId: z.string(),
			documentHash: z.string(),
		})
		.strict(),

	'documents.downloadOriginalDoc': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'documents.provideFileContent': z
		.object({
			documentId: z.string(),
			fileBase64: z.string().min(1),
			fileName: z.string().min(1),
			mimeType: z.string().default('application/pdf'),
		})
		.strict(),

	'documents.checkAuthenticity': z
		.object({
			documentId: z.string(),
			fileBase64: z.string().min(1),
			fileName: z.string().min(1),
			mimeType: z.string().default('application/pdf'),
		})
		.strict(),

	// signatures
	'signatures.list': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	'signatures.get': z
		.object({
			documentId: z.string(),
			signatureId: z.string(),
		})
		.strict(),

	'signatures.getImages': z
		.object({
			documentId: z.string(),
		})
		.strict(),

	// proofs
	'proofs.downloadSignatureByType': z
		.object({
			documentId: z.string(),
			signatureType: SignatureProofTypeSchema,
		})
		.strict(),

	'proofs.downloadLowLevelSignatureProof': z
		.object({
			documentId: z.string(),
			signatureType: SignatureLowLevelProofTypeSchema,
			signerId: z.string(),
		})
		.strict(),

	// signerProfiles
	'signerProfiles.list': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
		})
		.strict(),

	'signerProfiles.get': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerProfileId: z.string(),
		})
		.strict(),

	'signerProfiles.getInputsNeeded': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			signerProfileId: z.string(),
		})
		.strict(),

	// applications
	'applications.getContext': z
		.object({
			appId: z.string().optional(),
		})
		.strict(),

	// seal
	'seal.signM2M': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			m2mId: z.string(),
			title: z.string().optional(),
			externalId: z.string().optional(),
			documentHashSignedByM2MPrivateKey: z.string(),
			document: z
				.object({
					documentType: z.string(),
					documentHash: z.string(),
					label: z.string().optional(),
					mimeType: z.string().optional(),
					contentB64: z.string().optional(),
					xmlContent: z.string().optional(),
					// `unknown` because custom JSON documents may contain arbitrary valid JSON payload.
					jsonContent: z.record(z.string(), z.unknown()).optional(),
				})
				.strict(),
		})
		.strict(),

	// logCapsules
	'logCapsules.create': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			hashSha256_b64: z.string(),
		})
		.strict(),

	// bareSignatures
	'bareSignatures.getConfiguration': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
		})
		.strict(),

	'bareSignatures.getProofToken': z
		.object({
			appId: z.string().optional(),
			appEnv: AppEnvSchema.optional(),
			code_verifier: z.string(),
			redirect_uri: z.string(),
			code: z.string(),
		})
		.strict(),

	'bareSignatures.getProofs': z
		.object({
			appEnv: AppEnvSchema.optional(),
			proofToken: z.string(),
		})
		.strict(),
} as const;

export const IgnisignEndpointOutputSchemas = {
	// signatureRequests
	'signatureRequests.createInOneCall': SignatureRequestContextSchema,
	'signatureRequests.init': z.object({
		signatureRequestId: z.string().optional(),
	}),
	'signatureRequests.initSignerSetup': z.object({
		signatureRequestId: z.string().optional(),
	}),
	'signatureRequests.list': SignatureRequestsPaginateSchema,
	'signatureRequests.getContext': SignatureRequestContextSchema,
	'signatureRequests.update': SignatureRequestContextSchema,
	'signatureRequests.publish': SignatureRequestPublishResponseSchema,
	'signatureRequests.close': z.object({
		signatureRequestId: z.string().optional(),
	}),
	'signatureRequests.getStatus': SignatureRequestsStatusContainerSchema,

	// signers
	'signers.create': SignerCreationResponseSchema,
	'signers.getDetails': SignerContextSchema,
	'signers.getSummary': SignerSummarySchema,
	'signers.update': SignerCreationResponseSchema,
	'signers.revoke': z.object({
		signerId: z.string(),
	}),
	'signers.regenerateAuthSecret': z.object({
		authSecret: z.string(),
	}),
	'signers.search': SignersSearchResultSchema,
	'signers.list': SignersSearchResultSchema,

	// documents
	'documents.initialize': z.object({
		documentId: z.string(),
	}),
	'documents.get': DocumentSchema,
	'documents.getContext': DocumentContextSchema,
	'documents.update': DocumentSchema,
	'documents.remove': z.object({
		documentId: z.string(),
	}),
	'documents.removeContent': DocumentSchema,
	'documents.provideJsonContent': DocumentSchema,
	'documents.providePrivateContent': DocumentSchema,
	'documents.downloadOriginalDoc': BinaryDataSchema,
	'documents.provideFileContent': DocumentSchema,
	'documents.checkAuthenticity': z.object({
		documentId: z.string(),
		authenticityValidated: z.boolean(),
	}),

	// signatures
	'signatures.list': z.array(SignatureSchema),
	'signatures.get': SignatureSchema,
	'signatures.getImages': SignatureImagesSchema,

	// proofs
	'proofs.downloadSignatureByType': BinaryDataSchema,
	'proofs.downloadLowLevelSignatureProof': BinaryDataSchema,

	// signerProfiles
	'signerProfiles.list': z.array(SignerProfileSchema),
	'signerProfiles.get': SignerProfileSchema,
	'signerProfiles.getInputsNeeded': z.object({
		signerProfileId: z.string(),
		inputsNeeded: z.array(z.string()),
		optionalInputs: z.array(z.string()),
	}),

	// applications
	'applications.getContext': ApplicationContextSchema,

	// seal
	'seal.signM2M': z.object({
		signatureRequestId: z.string(),
		documentId: z.string(),
		documentHash: z.string(),
		proofBase64: z.string().optional(),
		proofType: z.string().optional(),
	}),

	// logCapsules
	'logCapsules.create': z.object({
		hashSha256_b64: z.string(),
		timestamp_b64: z.string(),
	}),

	// bareSignatures
	'bareSignatures.getConfiguration': z.object({
		appId: z.string(),
		appEnv: z.string(),
		redirectUris: z.array(z.string()),
		authorizedOrigins: z.array(z.string()),
		eidasLevel: z.string().optional(),
	}),
	'bareSignatures.getProofToken': z.object({
		access_token: z.string(),
		token_type: z.string(),
		expires_in: z.number(),
		scope: z.string().optional(),
	}),
	'bareSignatures.getProofs': BareSignatureProofSchema,
} as const;

export type IgnisignEndpointInputs = {
	[K in keyof typeof IgnisignEndpointInputSchemas]: z.input<
		(typeof IgnisignEndpointInputSchemas)[K]
	>;
};

export type IgnisignEndpointOutputs = {
	[K in keyof typeof IgnisignEndpointOutputSchemas]: z.infer<
		(typeof IgnisignEndpointOutputSchemas)[K]
	>;
};
