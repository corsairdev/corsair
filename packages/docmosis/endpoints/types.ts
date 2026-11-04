import { z } from 'zod';

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export type TemplateStructureElement = {
	type?: string;
	text?: string;
	dataRefs?: string[];
	fieldIdx?: number;
	repeatIdx?: number;
	conditionIdx?: number;
	contains?: TemplateStructureElement[];
	[key: string]: JsonValue | TemplateStructureElement[] | undefined;
};

const BooleanLikeSchema = z.union([
	z.boolean(),
	z.enum(['y', 'yes', 'true', 'n', 'no', 'false']),
]);

const StringOrArraySchema = z.union([
	z.string().min(1),
	z.array(z.string().min(1)).min(1),
]);

const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const DocmosisBaseResponseSchema = z.object({
	succeeded: z.boolean(),
	shortMsg: z.string().optional(),
	longMsg: z.string().optional(),
});

const AuditInfoSchema = z.object({
	lastUpdatedByUser: z.string().optional(),
	lastUpdatedTime: z.number().optional(),
});

const AccountEnvironmentDetailsSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	isActivated: z.union([z.boolean(), z.string()]).optional(),
	isDisabled: z.union([z.boolean(), z.string()]).optional(),
	isDeleted: z.union([z.boolean(), z.string()]).optional(),
	auditInfo: AuditInfoSchema.optional(),
});

const PageQuotaSchema = z.object({
	used: z.union([z.number(), z.string()]).optional(),
	quota: z.union([z.number(), z.string()]).optional(),
	pctUsed: z.union([z.number(), z.string()]).optional(),
	pctUsedStr: z.string().optional(),
	isHardLimited: z.union([z.boolean(), z.string()]).optional(),
});

const PlanSchema = z.object({
	name: z.string().optional(),
});

const AccountEnvironmentSummarySchema = z.object({
	ready: z.union([z.boolean(), z.string()]).optional(),
	accountEnvDetails: AccountEnvironmentDetailsSchema.optional(),
	pageQuota: PageQuotaSchema.optional(),
	plan: PlanSchema.optional(),
});

const TemplateDetailsSchema = z.object({
	name: z.string().optional(),
	lastModifiedMillisSinceEpoch: z.number().optional(),
	lastModifiedISO8601: z.string().optional(),
	sizeBytes: z.number().optional(),
	md5: z.string().optional(),
	templatePlainTextFieldPrefix: z.string().optional(),
	templatePlainTextFieldSuffix: z.string().optional(),
	templateHasErrors: z.boolean().optional(),
	templateDevMode: z.boolean().optional(),
	templateDescription: z.string().optional(),
});

const ImageDetailsSchema = z.object({
	name: z.string().optional(),
	lastModifiedMillisSinceEpoch: z.number().optional(),
	lastModifiedISO8601: z.string().optional(),
	sizeBytes: z.number().optional(),
	md5: z.string().optional(),
});

const UploadTemplateBatchJobResultSchema = z.object({
	errorsDetected: z.boolean().optional(),
	uploadedIntoFolder: z.string().optional(),
	devMode: z.boolean().optional(),
	uploadedTotalCount: z.number().optional(),
	processedWithErrorsCount: z.number().optional(),
	processedWithoutErrorsCount: z.number().optional(),
});

const JobStatusSchema = z.object({
	userJobId: z.string().optional(),
	isEnded: z.boolean().optional(),
	status: z.string().optional(),
	type: z.string().optional(),
	processingMsg: z.string().optional(),
	startedTime: z.number().optional(),
	finishedTime: z.number().optional(),
	duration: z.number().optional(),
	pctComplete: z.number().optional(),
	jobResult: UploadTemplateBatchJobResultSchema.optional(),
});

const RenderQueueSchema = z.object({
	rejected: z.boolean().optional(),
	availablePct: z.number().optional(),
	delaySeconds: z.number().optional(),
});

const NumberLikeSchema = z.union([z.number(), z.string()]);

const RenderTagStatsSchema = z.object({
	name: z.string().optional(),
	countPages: NumberLikeSchema.optional(),
	countDocuments: NumberLikeSchema.optional(),
});

const RenderTagsSchema = z.object({
	year: NumberLikeSchema.optional(),
	month: NumberLikeSchema.optional(),
	tags: z.array(RenderTagStatsSchema).optional(),
});

const TemplateStructureElementSchema: z.ZodType<TemplateStructureElement> = z
	.object({
		type: z.string().optional(),
		text: z.string().optional(),
		dataRefs: z.array(z.string()).optional(),
		fieldIdx: z.number().optional(),
		repeatIdx: z.number().optional(),
		conditionIdx: z.number().optional(),
		contains: z.lazy(() => z.array(TemplateStructureElementSchema)).optional(),
	})
	.catchall(JsonValueSchema);

const DocmosisPingSchema = z.object({});

const TemplateSampleDataRecordSchema: z.ZodType<Record<string, JsonValue>> =
	z.record(z.string(), JsonValueSchema);

const GetSampleDataTemplateDetailsSchema = z.object({
	templateHasErrors: z.boolean().optional(),
	templateFirstError: z.string().optional(),
});

const DocmosisBinaryResponseSchema = z.object({
	contentType: z.string().min(1),
	dataBase64: z.base64().min(1),
	byteLength: z.number().int().nonnegative(),
});

export const DocmosisEndpointInputSchemas = {
	getApiKey: z.object({}),
	environmentReady: z.object({}),
	environmentSummary: z.object({}),
	ping: z.object({}),
	pingService: z.object({}),
	deleteImage: z.object({ imageName: StringOrArraySchema }),
	deleteTemplate: z.object({ templateName: StringOrArraySchema }),
	listImages: z.object({
		folder: z.string().optional(),
		includeSubFolders: BooleanLikeSchema.optional(),
	}),
	listTemplates: z.object({
		includeDetail: BooleanLikeSchema.optional(),
		folder: z.string().optional(),
		includeSubFolders: BooleanLikeSchema.optional(),
		paging: BooleanLikeSchema.optional(),
		pageToken: z.string().optional(),
		pageSize: z.union([z.number().int().positive(), z.string()]).optional(),
	}),
	getImage: z.object({ imageName: StringOrArraySchema }),
	getTemplate: z.object({ templateName: StringOrArraySchema }),
	getBatchUploadStatus: z.object({ userJobId: z.string().min(1) }),
	getRenderQueue: z.object({}),
	getTemplateDetails: z.object({
		templateName: z.string().min(1),
		stringify: BooleanLikeSchema.optional(),
	}),
	getTemplateStructure: z.object({
		templateName: z.string().min(1),
		stringify: BooleanLikeSchema.optional(),
	}),
	getRenderTags: z.object({
		tags: z.string().min(1),
		year: z.union([z.number().int(), z.string()]).optional(),
		month: z.union([z.number().int(), z.string()]).optional(),
		nMonths: z.union([z.number().int().positive(), z.string()]).optional(),
		padBlanks: BooleanLikeSchema.optional(),
	}),
	getSampleData: z.object({
		templateName: z.string().min(1),
		stringify: BooleanLikeSchema.optional(),
		format: z.enum(['json', 'xml']).optional(),
	}),
	render: z.object({
		templateName: z.string().min(1),
		data: z.union([z.string().min(1), z.record(z.string(), JsonValueSchema)]),
		outputName: z.string().min(1),
		outputFormat: z.string().min(1).optional(),
		devMode: BooleanLikeSchema.optional(),
		tags: z.string().min(1).optional(),
	}),
} as const;

export const DocmosisEndpointOutputSchemas = {
	getApiKey: z.object({
		configured: z
			.boolean()
			.describe('Whether a Docmosis access key is configured'),
		keyPreview: z
			.string()
			.describe('Last 4 characters of the configured access key'),
	}),
	environmentReady: DocmosisBaseResponseSchema,
	environmentSummary: DocmosisBaseResponseSchema.extend({
		accountEnvironmentSummary: AccountEnvironmentSummarySchema.optional(),
	}),
	ping: DocmosisPingSchema,
	pingService: DocmosisPingSchema,
	deleteImage: DocmosisBaseResponseSchema,
	deleteTemplate: DocmosisBaseResponseSchema,
	listImages: DocmosisBaseResponseSchema.extend({
		imageListStale: z.boolean().optional(),
		imageList: z.array(ImageDetailsSchema).optional(),
	}),
	listTemplates: DocmosisBaseResponseSchema.extend({
		templateListStale: z.boolean().optional(),
		nextPageToken: z.string().optional(),
		pageSize: z.number().optional(),
		templateList: z.array(TemplateDetailsSchema).optional(),
	}),
	getImage: DocmosisBinaryResponseSchema,
	getTemplate: DocmosisBinaryResponseSchema,
	getBatchUploadStatus: DocmosisBaseResponseSchema.extend({
		jobStatus: JobStatusSchema.optional(),
	}),
	getRenderQueue: DocmosisBaseResponseSchema.extend({
		queue: RenderQueueSchema.optional(),
	}),
	getTemplateDetails: DocmosisBaseResponseSchema.extend({
		templateDetails: TemplateDetailsSchema.optional(),
	}),
	getTemplateStructure: DocmosisBaseResponseSchema.extend({
		templateHasErrors: z.boolean().optional(),
		templateErrorMessage: z.string().optional(),
		templateStructure: z
			.union([z.array(TemplateStructureElementSchema), z.string()])
			.optional(),
	}),
	getRenderTags: DocmosisBaseResponseSchema.extend({
		renderTags: z.array(RenderTagsSchema).optional(),
	}),
	getSampleData: DocmosisBaseResponseSchema.extend({
		templateSampleData: z
			.union([TemplateSampleDataRecordSchema, z.string()])
			.optional(),
		templateDetails: GetSampleDataTemplateDetailsSchema.optional(),
	}),
	render: DocmosisBinaryResponseSchema,
} as const;

export type DocmosisEndpointInputs = {
	[K in keyof typeof DocmosisEndpointInputSchemas]: z.infer<
		(typeof DocmosisEndpointInputSchemas)[K]
	>;
};

export type DocmosisEndpointOutputs = {
	[K in keyof typeof DocmosisEndpointOutputSchemas]: z.infer<
		(typeof DocmosisEndpointOutputSchemas)[K]
	>;
};
