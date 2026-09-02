import { z } from 'zod';

const FormFieldSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		fieldType: z.string().optional(),
	})
	.loose();

const SignerSchema = z
	.object({
		name: z.string().optional(),
		emailAddress: z.string().optional(),
		signerType: z.string().optional(),
		formFields: z.array(FormFieldSchema).optional(),
	})
	.loose();

const FileWithNameSchema = z.object({
	base64: z.string(),
	fileName: z.string(),
});

const CreateCustomFieldInputSchema = z
	.object({
		fieldName: z.string(),
		formField: FormFieldSchema,
		fieldDescription: z.string().optional(),
		fieldOrder: z.number().int().optional(),
		brandId: z.string().optional(),
		sharedField: z.boolean().optional(),
	})
	.loose();

const EditCustomFieldInputSchema = CreateCustomFieldInputSchema.extend({
	customFieldId: z.string(),
});

const GetBrandDetailsInputSchema = z.object({
	brandId: z.string(),
});

const ListBrandsInputSchema = z.object({}).optional().default({});

const CreateEmbeddedRequestLinkInputSchema = z
	.object({
		title: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(SignerSchema).optional(),
		files: z.array(z.union([z.string(), FileWithNameSchema])).optional(),
		fileUrls: z.array(z.string()).optional(),
		redirectUrl: z.string().optional(),
		showToolbar: z.boolean().optional(),
		showSendButton: z.boolean().optional(),
		showSaveButton: z.boolean().optional(),
		showPreviewButton: z.boolean().optional(),
		showNavigationButtons: z.boolean().optional(),
		sendViewOption: z.enum(['PreparePage', 'FillingPage']).optional(),
		locale: z.string().optional(),
		sendLinkValidTill: z.string().optional(),
		embeddedSendLinkValidTill: z.string().optional(),
		enableSigningOrder: z.boolean().optional(),
		onBehalfOf: z.string().optional(),
	})
	.loose();

const SendDocumentInputSchema = z
	.object({
		title: z.string(),
		message: z.string().optional(),
		signers: z.array(SignerSchema).optional(),
		files: z.array(z.union([z.string(), FileWithNameSchema])).optional(),
		fileUrls: z.array(z.string()).optional(),
		enableSigningOrder: z.boolean().optional(),
		expiryValue: z.number().optional(),
		expiryDateType: z.enum(['Days', 'DateTime']).optional(),
		reminderSettings: z.record(z.string(), z.unknown()).optional(),
		disableEmails: z.boolean().optional(),
		disableSMS: z.boolean().optional(),
		brandId: z.string().optional(),
		labels: z.array(z.string()).optional(),
		sendLinkValidTill: z.string().optional(),
		useTextTags: z.boolean().optional(),
		onBehalfOf: z.string().optional(),
	})
	.loose();

const EditDocumentBetaInputSchema = z
	.object({
		documentId: z.string(),
		title: z.string().optional(),
		message: z.string().optional(),
		signers: z.array(SignerSchema).optional(),
		cc: z.array(z.record(z.string(), z.unknown())).optional(),
		files: z.array(z.record(z.string(), z.unknown())).optional(),
		enableSigningOrder: z.boolean().optional(),
		disableEmails: z.boolean().optional(),
		disableSMS: z.boolean().optional(),
		onBehalfOf: z.string().optional(),
	})
	.loose();

const ExtendDocumentExpiryInputSchema = z
	.object({
		documentId: z.string(),
		newExpiryValue: z.string().optional(),
		newExpiryDate: z.string().optional(),
		warnPrior: z.boolean().optional(),
		onBehalfOf: z.string().optional(),
	})
	.refine(
		(input) => Boolean(input.newExpiryDate || input.newExpiryValue),
		'newExpiryValue or newExpiryDate is required',
	);

const RemoveDocumentAuthenticationInputSchema = z.object({
	documentId: z.string(),
	emailId: z.string(),
	zOrder: z.number().int().optional(),
	phoneNumber: z.record(z.string(), z.unknown()).optional(),
	onBehalfOf: z.string().optional(),
});

const ListDocumentsInputSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.array(z.string()).optional(),
	sentBy: z.array(z.string()).optional(),
	recipients: z.array(z.string()).optional(),
	transmitType: z.string().optional(),
	dateFilterType: z.string().optional(),
	searchKey: z.string().optional(),
	labels: z.array(z.string()).optional(),
	nextCursor: z.number().int().optional(),
	brandIds: z.array(z.string()).optional(),
});

const ListBehalfDocumentsInputSchema = z.object({
	page: z.number().int().positive(),
	pageType: z.string().optional(),
	pageSize: z.number().int().positive().optional(),
	emailAddress: z.array(z.string()).optional(),
	signers: z.array(z.string()).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.array(z.string()).optional(),
	searchKey: z.string().optional(),
	labels: z.array(z.string()).optional(),
	nextCursor: z.number().int().optional(),
	brandIds: z.array(z.string()).optional(),
});

const ListTeamDocumentsInputSchema = z.object({
	page: z.number().int().positive(),
	pageSize: z.number().int().positive().optional(),
	userId: z.array(z.string()).optional(),
	teamId: z.array(z.string()).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.array(z.string()).optional(),
	searchKey: z.string().optional(),
	labels: z.array(z.string()).optional(),
	transmitType: z.string().optional(),
	dateFilterType: z.string().optional(),
	nextCursor: z.number().int().optional(),
	brandIds: z.array(z.string()).optional(),
});

const GetApiCreditsCountInputSchema = z.object({}).optional().default({});

const UploadFileHelperInputSchema = z.object({
	fileName: z.string(),
	mimeType: z.string(),
	base64Content: z.string(),
});

const CustomFieldMessageSchema = z.object({
	customFieldId: z.string(),
	message: z.string(),
});

const BrandSchema = z
	.object({
		brandId: z.string(),
		brandName: z.string().optional(),
	})
	.loose();

const EmbeddedRequestLinkResponseSchema = z.object({
	documentId: z.string(),
	sendUrl: z.string(),
});

const SendDocumentResponseSchema = z.object({
	documentId: z.string(),
});

const EditDocumentResponseSchema = z
	.object({
		status: z.string(),
	})
	.loose();

const ExtendDocumentExpiryResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.loose();

const RemoveDocumentAuthenticationResponseSchema = z.object({
	success: z.boolean(),
});

const PageDetailsSchema = z
	.object({
		page: z.number().optional(),
		pageSize: z.number().optional(),
		totalRecordsCount: z.number().optional(),
		totalPages: z.number().optional(),
	})
	.loose();

const DocumentSummarySchema = z
	.object({
		documentId: z.string().optional(),
		status: z.string().optional(),
		title: z.string().optional(),
		nextCursor: z.number().optional(),
	})
	.loose();

const DocumentListResponseSchema = z.object({
	pageDetails: PageDetailsSchema,
	result: z.array(DocumentSummarySchema),
});

const ApiCreditsCountResponseSchema = z
	.object({
		BalanceCredits: z.number().optional(),
		balanceCredits: z.number().optional(),
	})
	.refine(
		(value) =>
			typeof value.BalanceCredits === 'number' ||
			typeof value.balanceCredits === 'number',
		'Balance credits count is missing',
	);

const UploadFileHelperResponseSchema = z.object({
	file: FileWithNameSchema,
});

export const BoldsignEndpointInputSchemas = {
	createCustomField: CreateCustomFieldInputSchema,
	editCustomField: EditCustomFieldInputSchema,
	getBrandDetails: GetBrandDetailsInputSchema,
	listBrands: ListBrandsInputSchema,
	createEmbeddedRequestLink: CreateEmbeddedRequestLinkInputSchema,
	sendDocument: SendDocumentInputSchema,
	editDocumentBeta: EditDocumentBetaInputSchema,
	extendDocumentExpiry: ExtendDocumentExpiryInputSchema,
	removeDocumentAuthentication: RemoveDocumentAuthenticationInputSchema,
	listDocuments: ListDocumentsInputSchema,
	listBehalfDocuments: ListBehalfDocumentsInputSchema,
	listTeamDocuments: ListTeamDocumentsInputSchema,
	getApiCreditsCount: GetApiCreditsCountInputSchema,
	uploadFileHelper: UploadFileHelperInputSchema,
} as const;

export type BoldsignEndpointInputs = {
	[K in keyof typeof BoldsignEndpointInputSchemas]: z.infer<
		(typeof BoldsignEndpointInputSchemas)[K]
	>;
};

export const BoldsignEndpointOutputSchemas = {
	createCustomField: CustomFieldMessageSchema,
	editCustomField: CustomFieldMessageSchema,
	getBrandDetails: BrandSchema,
	listBrands: z.object({ result: z.array(BrandSchema) }),
	createEmbeddedRequestLink: EmbeddedRequestLinkResponseSchema,
	sendDocument: SendDocumentResponseSchema,
	editDocumentBeta: EditDocumentResponseSchema,
	extendDocumentExpiry: ExtendDocumentExpiryResponseSchema,
	removeDocumentAuthentication: RemoveDocumentAuthenticationResponseSchema,
	listDocuments: DocumentListResponseSchema,
	listBehalfDocuments: DocumentListResponseSchema,
	listTeamDocuments: DocumentListResponseSchema,
	getApiCreditsCount: ApiCreditsCountResponseSchema,
	uploadFileHelper: UploadFileHelperResponseSchema,
} as const;

export type BoldsignEndpointOutputs = {
	[K in keyof typeof BoldsignEndpointOutputSchemas]: z.infer<
		(typeof BoldsignEndpointOutputSchemas)[K]
	>;
};

export type CreateCustomFieldInput = z.infer<
	typeof CreateCustomFieldInputSchema
>;
export type EditCustomFieldInput = z.infer<typeof EditCustomFieldInputSchema>;
export type GetBrandDetailsInput = z.infer<typeof GetBrandDetailsInputSchema>;
export type ListBrandsInput = z.infer<typeof ListBrandsInputSchema>;
export type CreateEmbeddedRequestLinkInput = z.infer<
	typeof CreateEmbeddedRequestLinkInputSchema
>;
export type SendDocumentInput = z.infer<typeof SendDocumentInputSchema>;
export type EditDocumentBetaInput = z.infer<typeof EditDocumentBetaInputSchema>;
export type ExtendDocumentExpiryInput = z.infer<
	typeof ExtendDocumentExpiryInputSchema
>;
export type RemoveDocumentAuthenticationInput = z.infer<
	typeof RemoveDocumentAuthenticationInputSchema
>;
export type ListDocumentsInput = z.infer<typeof ListDocumentsInputSchema>;
export type ListBehalfDocumentsInput = z.infer<
	typeof ListBehalfDocumentsInputSchema
>;
export type ListTeamDocumentsInput = z.infer<
	typeof ListTeamDocumentsInputSchema
>;
export type GetApiCreditsCountInput = z.infer<
	typeof GetApiCreditsCountInputSchema
>;
export type UploadFileHelperInput = z.infer<typeof UploadFileHelperInputSchema>;

export type CustomFieldMessage = z.infer<typeof CustomFieldMessageSchema>;
export type GetBrandDetailsResponse = z.infer<typeof BrandSchema>;
export type ListBrandsResponse = z.infer<
	typeof BoldsignEndpointOutputSchemas.listBrands
>;
export type CreateEmbeddedRequestLinkResponse = z.infer<
	typeof EmbeddedRequestLinkResponseSchema
>;
export type SendDocumentResponse = z.infer<typeof SendDocumentResponseSchema>;
export type EditDocumentResponse = z.infer<typeof EditDocumentResponseSchema>;
export type ExtendDocumentExpiryResponse = z.infer<
	typeof ExtendDocumentExpiryResponseSchema
>;
export type RemoveDocumentAuthenticationResponse = z.infer<
	typeof RemoveDocumentAuthenticationResponseSchema
>;
export type DocumentListResponse = z.infer<typeof DocumentListResponseSchema>;
export type ApiCreditsCountResponse = z.infer<
	typeof ApiCreditsCountResponseSchema
>;
export type UploadFileHelperResponse = z.infer<
	typeof UploadFileHelperResponseSchema
>;
