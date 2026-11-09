import { z } from 'zod';

// Inputs use CraftMyPDF's own parameter names, as the OpenAPI spec spells them
// (https://craftmypdf.com/docs). Outputs are `.loose()` and their documented
// fields nullish, so a field CraftMyPDF adds or omits cannot fail a call that
// has already happened.

/**
 * Template data is arbitrary JSON. CraftMyPDF accepts it as an object or as a
 * stringified JSON string, so both shapes pass through unchanged.
 */
export type CraftmypdfJson =
	| string
	| number
	| boolean
	| null
	| CraftmypdfJson[]
	| { [key: string]: CraftmypdfJson };

const CraftmypdfJsonSchema: z.ZodType<CraftmypdfJson> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(CraftmypdfJsonSchema),
		z.record(z.string(), CraftmypdfJsonSchema),
	]),
);

/** A template's data: a JSON object, or a stringified JSON string. */
const TemplateDataSchema = z
	.union([z.string(), z.record(z.string(), CraftmypdfJsonSchema)])
	.describe(
		'Template JSON data, either an object or a stringified JSON string.',
	);

/** The spec types every version as a string and its examples are integers. */
const VersionSchema = z
	.union([z.string().min(1), z.number().int().min(0)])
	.describe(
		'Template version. Omit to use the latest version of the template.',
	);

/** Documented range: 1 minute to 10080 (7 days); default 5 minutes. */
const ExpirationSchema = z
	.number()
	.int()
	.min(1)
	.max(10080)
	.optional()
	.describe(
		'Minutes the generated file stays on the CDN. 1 to 10080; CraftMyPDF defaults to 5.',
	);

const CloudStorageSchema = z
	.number()
	.int()
	.min(0)
	.max(1)
	.optional()
	.describe(
		'1 to keep the generated file on the CraftMyPDF CDN, 0 to skip it (for example when S3 post actions are configured). Defaults to 1.',
	);

const S3FileKeySchema = z
	.string()
	.min(1)
	.optional()
	.describe(
		'File name for the S3 post action, without an extension. It must be unique, and / works as a folder separator.',
	);

const S3BucketSchema = z
	.string()
	.min(1)
	.optional()
	.describe('Overrides the configured AWS bucket for the S3 post action.');

const OutputFileSchema = z
	.string()
	.min(1)
	.optional()
	.describe('Name of the generated file, for example output.pdf.');

const ImageResampleResSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		'Downsamples images in the PDF to this resolution in DPI to shrink the file. Suggested values are 1200, 600, 300, 150 and 72.',
	);

const PostActionSchema = {
	postaction_s3_filekey: S3FileKeySchema,
	postaction_s3_bucket: S3BucketSchema,
};

/**
 * The 14 fonts CraftMyPDF documents for watermarks and page text. Any other
 * name is not a base-14 PDF font and the request would fail.
 */
export const CRAFTMYPDF_FONT_FAMILIES = [
	'Courier',
	'Courier-Bold',
	'Courier-Oblique',
	'Courier-BoldOblique',
	'Helvetica',
	'Helvetica-Bold',
	'Helvetica-Oblique',
	'Helvetica-BoldOblique',
	'Times-Roman',
	'Times-Bold',
	'Times-Italic',
	'Times-BoldItalic',
	'Symbol',
	'ZapfDingbats',
] as const;

const FontFamilySchema = z.enum(CRAFTMYPDF_FONT_FAMILIES);

const HexColorSchema = z
	.string()
	.regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Expected #RGB or #RRGGBB')
	.describe('Hex colour, for example #FF0000.');

// ── pdf.create ────────────────────────────────────────────────────────────

/**
 * Fields shared by every generation call. `data` and `load_data_from` are
 * mutually redundant: CraftMyPDF overwrites `data` with the URL's contents, so
 * a caller may supply only one. The endpoint sends `data: {}` in that case,
 * because the API documents `data` as required.
 */
const CreateSharedShape = {
	version: VersionSchema.optional(),
	expiration: ExpirationSchema,
	output_file: OutputFileSchema,
	image_resample_res: ImageResampleResSchema,
	cloud_storage: CloudStorageSchema,
	...PostActionSchema,
};

const PagingSchema = z
	.enum(['continuous', 'reset'])
	.optional()
	.describe(
		'Page numbering when several templates are combined. continuous keeps counting across documents; reset restarts at 1 for each.',
	);

/** `password` is only read when `password_protected` is true. */
function requirePasswordWhenProtected<
	T extends {
		password_protected?: boolean | undefined;
		password?: string | undefined;
	},
>(value: T, ctx: z.RefinementCtx): void {
	if (value.password_protected && !value.password) {
		ctx.addIssue({
			code: 'custom',
			path: ['password'],
			message: 'password is required when password_protected is true.',
		});
	}
}

/** `data` and `load_data_from` are interchangeable; one of them is required. */
function requireTemplateData<
	T extends {
		// unknown: the data is template JSON, whose shape is the template's own.
		data?: unknown;
		load_data_from?: string | undefined;
	},
>(value: T, ctx: z.RefinementCtx): void {
	if (value.data === undefined && value.load_data_from === undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['data'],
			message:
				'Pass data (the template JSON) or load_data_from (a URL to fetch it from).',
		});
	}
}

const PdfCreateInputSchema = z
	.object({
		template_id: z
			.string()
			.min(1)
			.describe(
				'Template to generate from. Several comma-separated IDs generate one PDF per template.',
			),
		data: TemplateDataSchema.optional(),
		load_data_from: z
			.string()
			.min(1)
			.optional()
			.describe(
				'URL to fetch the template JSON from. CraftMyPDF overwrites data with this content, so data can be omitted.',
			),
		...CreateSharedShape,
		password_protected: z
			.boolean()
			.optional()
			.describe('Encrypt the generated PDF with password.'),
		password: z
			.string()
			.min(1)
			.optional()
			.describe('Password for the generated PDF.'),
		paging: PagingSchema,
	})
	.superRefine((value, ctx) => {
		requireTemplateData(value, ctx);
		requirePasswordWhenProtected(value, ctx);
	});

export type PdfCreateInput = z.input<typeof PdfCreateInputSchema>;

const AnchorSchema = z
	.object({
		page: z.number().nullish(),
		text: z.string().nullish(),
		level: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

export type CraftmypdfAnchor = z.infer<typeof AnchorSchema>;

/** The shape every single-file generation call answers with. */
export const GeneratedFileSchema = z
	.object({
		status: z.string().nullish(),
		file: z.string().nullish(),
		transaction_ref: z.string().nullish(),
		anchors: z.array(AnchorSchema).nullish(),
	})
	.loose();

export type GeneratedFile = z.infer<typeof GeneratedFileSchema>;

const PdfCreateResponseSchema = GeneratedFileSchema;

export type PdfCreateResponse = z.infer<typeof PdfCreateResponseSchema>;

// ── pdf.createAsync ───────────────────────────────────────────────────────

const PdfCreateAsyncInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to generate from.'),
	data: TemplateDataSchema.optional(),
	version: VersionSchema.optional(),
	expiration: ExpirationSchema,
	webhook_url: z
		.string()
		.url()
		.optional()
		.describe(
			'CraftMyPDF calls this URL with a GET once the PDF is ready, adding file, transaction_ref, status, message and details as query parameters. Without it the result is only recorded in transactions.list.',
		),
	image_resample_res: ImageResampleResSchema,
	cloud_storage: CloudStorageSchema,
	...PostActionSchema,
});

export type PdfCreateAsyncInput = z.input<typeof PdfCreateAsyncInputSchema>;

const PdfCreateAsyncResponseSchema = z
	.object({
		status: z.string().nullish(),
		transaction_ref: z.string().nullish(),
		is_async: z.boolean().nullish(),
	})
	.loose();

export type PdfCreateAsyncResponse = z.infer<
	typeof PdfCreateAsyncResponseSchema
>;

// ── pdf.createImage ───────────────────────────────────────────────────────

const PdfCreateImageInputSchema = z
	.object({
		template_id: z.string().min(1).describe('Template to render.'),
		data: TemplateDataSchema.optional(),
		load_data_from: z
			.string()
			.min(1)
			.optional()
			.describe('URL to fetch the template JSON from.'),
		version: VersionSchema.optional(),
		expiration: ExpirationSchema,
		output_file: z
			.string()
			.min(1)
			.optional()
			.describe('Name of the generated image, for example output.jpg.'),
		output_type: z
			.enum(['jpeg', 'png'])
			.optional()
			.describe('Image format. CraftMyPDF defaults to jpeg.'),
		cloud_storage: CloudStorageSchema,
		...PostActionSchema,
	})
	.superRefine(requireTemplateData);

export type PdfCreateImageInput = z.input<typeof PdfCreateImageInputSchema>;

const PdfCreateImageResponseSchema = GeneratedFileSchema;

export type PdfCreateImageResponse = z.infer<
	typeof PdfCreateImageResponseSchema
>;

// ── pdf.createMerge ───────────────────────────────────────────────────────

const MergeTemplateSchema = z.object({
	template_id: z.string().min(1).describe('Template to render.'),
	data: TemplateDataSchema.optional().describe(
		'Data for this template. Falls back to the top-level data.',
	),
	version: VersionSchema.optional(),
});

const PdfCreateMergeInputSchema = z
	.object({
		templates: z
			.array(MergeTemplateSchema)
			.min(1)
			.describe('Templates to render, in order, into one PDF.'),
		data: TemplateDataSchema.optional().describe(
			'Data used by every template that does not carry its own.',
		),
		expiration: ExpirationSchema,
		output_file: OutputFileSchema,
		paging: z
			.enum(['continuous', 'reset'])
			.optional()
			.describe(
				'Page numbering across the merged documents. CraftMyPDF defaults to reset here, unlike pdf.create.',
			),
		cloud_storage: CloudStorageSchema,
		image_resample_res: ImageResampleResSchema,
		...PostActionSchema,
	})
	.superRefine((value, ctx) => {
		const missing = value.templates.filter(
			(template) => template.data === undefined,
		);
		if (missing.length > 0 && value.data === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['data'],
				message: `${missing.length} template(s) have no data, so the top-level data is required.`,
			});
		}
	});

export type PdfCreateMergeInput = z.input<typeof PdfCreateMergeInputSchema>;

const PdfCreateMergeResponseSchema = GeneratedFileSchema;

export type PdfCreateMergeResponse = z.infer<
	typeof PdfCreateMergeResponseSchema
>;

// ── pdf.createParallel ────────────────────────────────────────────────────

const ParallelRequestSchema = z.object({
	template_id: z.string().min(1).describe('Template to generate from.'),
	data: TemplateDataSchema.optional(),
	version: VersionSchema.optional(),
	output_file: OutputFileSchema,
	meta: z
		.string()
		.describe(
			'Your own reference for this request. It is echoed back in the result so a batch can be matched up.',
		)
		.optional(),
});

const PdfCreateParallelInputSchema = z
	.object({
		requests: z
			.array(ParallelRequestSchema)
			.min(1)
			.describe('One generation request per PDF, run in parallel.'),
		merge: z
			.boolean()
			.optional()
			.describe(
				'Also merge every generated PDF into one file, returned as merge_result. Defaults to false.',
			),
		merge_expiration: ExpirationSchema.describe(
			'Minutes the merged file stays available. Only used when merge is true.',
		),
	})
	.superRefine((value, ctx) => {
		const missing = value.requests.filter(
			(request) => request.data === undefined,
		);
		if (missing.length > 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['requests'],
				message: `${missing.length} request(s) have no data; pdf.create-parallel takes the template data per request.`,
			});
		}
	});

export type PdfCreateParallelInput = z.input<
	typeof PdfCreateParallelInputSchema
>;

const ParallelResultSchema = z
	.object({
		file: z.string().nullish(),
		transaction_ref: z.string().nullish(),
		status: z.string().nullish(),
		total_pages: z.number().nullish(),
		template_id: z.string().nullish(),
		index: z.number().nullish(),
		meta: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

const PdfCreateParallelResponseSchema = z
	.object({
		status: z.string().nullish(),
		results: z.array(ParallelResultSchema).nullish(),
		merge_result: z
			.object({
				file: z.string().nullish(),
				transaction_ref: z.string().nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type PdfCreateParallelResponse = z.infer<
	typeof PdfCreateParallelResponseSchema
>;

// ── pdf.addWatermark ──────────────────────────────────────────────────────

const PdfAddWatermarkInputSchema = z.object({
	url: z.url().describe('URL of the source PDF.'),
	text: z.string().min(1).describe('Watermark text.'),
	font_size: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Font size in points. CraftMyPDF defaults to 40.'),
	opacity: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe('0 is transparent and 1 is opaque. Defaults to 0.5.'),
	rotation: z
		.number()
		.optional()
		.describe('Rotation in degrees. CraftMyPDF defaults to 45.'),
	hex_color: HexColorSchema.optional(),
	font_family: FontFamilySchema.optional().describe(
		'Base-14 PDF font. Defaults to Helvetica.',
	),
	expiration: ExpirationSchema,
	output_file: OutputFileSchema,
	cloud_storage: CloudStorageSchema,
	...PostActionSchema,
});

export type PdfAddWatermarkInput = z.input<typeof PdfAddWatermarkInputSchema>;

const PdfAddWatermarkResponseSchema = GeneratedFileSchema;

export type PdfAddWatermarkResponse = z.infer<
	typeof PdfAddWatermarkResponseSchema
>;

// ── pdf.addText ───────────────────────────────────────────────────────────

const TextSettingSchema = z.object({
	page_selector: z
		.string()
		.regex(/^[0-9*,-]+$/, 'Expected pages or ranges, for example 1,3-*,5-8')
		.describe(
			'Pages to draw on: a page number, a range such as 5-8, or * for the last page. Comma-separated, for example 1,2-*,5-8.',
		),
	text: z
		.string()
		.min(1)
		.describe(
			'Text to draw. {{pageNumber}}, {{totalPages}} and {{currentIndex}} are substituted.',
		),
	position: z
		.enum([
			'top-left',
			'top-center',
			'top-right',
			'middle-left',
			'center',
			'middle-right',
			'bottom-left',
			'bottom-center',
			'bottom-right',
		])
		.describe('Where on the page the text goes.'),
	offset_x: z.number().optional().describe('Horizontal offset from position.'),
	offset_y: z.number().optional().describe('Vertical offset from position.'),
	font_size: z.number().positive().optional().describe('Font size.'),
	hex_color: HexColorSchema.optional(),
	font_family: FontFamilySchema.optional(),
	opacity: z
		.number()
		.min(0)
		.max(1)
		.optional()
		.describe('0 is transparent and 1 is opaque.'),
	rotation: z.number().optional().describe('Rotation in degrees.'),
});

const PdfAddTextInputSchema = z.object({
	url: z.url().describe('URL of the source PDF.'),
	textSettings: z
		.array(TextSettingSchema)
		.min(1)
		.describe(
			'Text to draw on the PDF. One entry can cover many pages; several entries stack.',
		),
	expiration: ExpirationSchema,
	output_file: OutputFileSchema,
	cloud_storage: CloudStorageSchema,
});

export type PdfAddTextInput = z.input<typeof PdfAddTextInputSchema>;

const PdfAddTextResponseSchema = GeneratedFileSchema;

export type PdfAddTextResponse = z.infer<typeof PdfAddTextResponseSchema>;

// ── pdf.updateFields ──────────────────────────────────────────────────────

const PdfFieldUpdateSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe(
			'Field id from the PDF, readable with https://craftmypdf.com/tools/pdf-fillable-field-reader/.',
		),
	value: z.string().describe('Value to fill in.').optional(),
	readOnly: z
		.boolean()
		.optional()
		.describe('Make the field read-only after filling it.'),
	fontSize: z.number().int().positive().optional().describe('Font size.'),
});

const PdfUpdateFieldsInputSchema = z.object({
	url: z.url().describe('URL of the PDF whose form fields to fill.'),
	fields: z
		.array(PdfFieldUpdateSchema)
		.min(1)
		.describe('Field values to apply.'),
	expiration: ExpirationSchema,
	output_file: OutputFileSchema,
	cloud_storage: CloudStorageSchema,
});

export type PdfUpdateFieldsInput = z.input<typeof PdfUpdateFieldsInputSchema>;

const FieldStatusSchema = z
	.object({
		id: z.string().nullish(),
		status: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

const PdfUpdateFieldsResponseSchema = z
	.object({
		status: z.string().nullish(),
		message: z.string().nullish(),
		file: z.string().nullish(),
		transaction_ref: z.string().nullish(),
		field_statuses: z.array(FieldStatusSchema).nullish(),
	})
	.loose();

export type PdfUpdateFieldsResponse = z.infer<
	typeof PdfUpdateFieldsResponseSchema
>;

// ── pdf.merge ─────────────────────────────────────────────────────────────

const PdfMergeInputSchema = z.object({
	urls: z.array(z.url()).min(1).describe('PDF URLs to merge, in order.'),
	expiration: ExpirationSchema,
	output_file: OutputFileSchema,
	cloud_storage: CloudStorageSchema,
	...PostActionSchema,
});

export type PdfMergeInput = z.input<typeof PdfMergeInputSchema>;

const PdfMergeResponseSchema = GeneratedFileSchema;

export type PdfMergeResponse = z.infer<typeof PdfMergeResponseSchema>;

// ── pdf.getInfo ───────────────────────────────────────────────────────────

const PdfGetInfoInputSchema = z.object({
	url: z.url().describe('URL of the PDF to inspect.'),
});

export type PdfGetInfoInput = z.input<typeof PdfGetInfoInputSchema>;

// The field names here are camelCase while the rest of the API is snake_case;
// they are CraftMyPDF's own and are not normalised.
const PdfGetInfoResponseSchema = z
	.object({
		status: z.string().nullish(),
		totalPages: z.number().nullish(),
		url: z.string().nullish(),
		title: z.string().nullish(),
		author: z.string().nullish(),
		subject: z.string().nullish(),
		creator: z.string().nullish(),
		keywords: z.string().nullish(),
		producer: z.string().nullish(),
		creationDate: z.string().nullish(),
		modificationDate: z.string().nullish(),
	})
	.loose();

export type PdfGetInfoResponse = z.infer<typeof PdfGetInfoResponseSchema>;

// ── templates.list ────────────────────────────────────────────────────────

// Unknown: CraftMyPDF sends both numbers and numeric strings for counters.
const CountSchema = z.union([z.number(), z.string()]);

export const CraftmypdfTemplateSchema = z
	.object({
		template_id: z.string().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		group_name: z.string().nullish(),
	})
	.loose();

export type CraftmypdfTemplate = z.infer<typeof CraftmypdfTemplateSchema>;

const PageLimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('How many records to return.');
const PageOffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('How many records to skip. Defaults to 0.');

export const CRAFTMYPDF_DEFAULT_PAGE_SIZE = 300;

const TemplatesListInputSchema = z.object({
	limit: PageLimitSchema.describe(
		'How many templates to return. CraftMyPDF defaults to 300.',
	),
	offset: PageOffsetSchema,
	group_name: z
		.string()
		.min(1)
		.optional()
		.describe('Only templates in this group.'),
});

export type TemplatesListInput = z.input<typeof TemplatesListInputSchema>;

const TemplatesListResponseSchema = z.object({
	status: z.string().nullish(),
	templates: z.array(CraftmypdfTemplateSchema),
	// Derived by the endpoint: CraftMyPDF answers no cursor of its own.
	next_offset: z.number().nullish(),
});

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

/**
 * CraftMyPDF reports no total, so the only reliable signal is the page size:
 * a full page may have more behind it, a short page is the end.
 */
export function nextOffsetFor(
	returned: number,
	limit: number,
	offset: number,
): number | undefined {
	return returned === limit ? offset + returned : undefined;
}

// ── templates.get ─────────────────────────────────────────────────────────

const TemplatesGetInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to read.'),
	version: VersionSchema.optional(),
});

export type TemplatesGetInput = z.input<typeof TemplatesGetInputSchema>;

const TemplatesGetResponseSchema = z
	.object({
		status: z.string().nullish(),
		name: z.string().nullish(),
		body: z.string().nullish(),
		json: z.string().nullish(),
	})
	.loose();

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

// ── templates.update ──────────────────────────────────────────────────────

const TemplatesUpdateInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to update.'),
	name: z.string().min(1).optional().describe('New template name.'),
	json: z
		.string()
		.min(1)
		.optional()
		.describe('New sample JSON data, as a stringified JSON document.'),
	body: z
		.string()
		.min(1)
		.optional()
		.describe(
			'New template body. CraftMyPDF warns to change this only when you know the template format.',
		),
});

export type TemplatesUpdateInput = z.input<typeof TemplatesUpdateInputSchema>;

const TemplatesUpdateResponseSchema = z
	.object({ status: z.string().nullish() })
	.loose();

export type TemplatesUpdateResponse = z.infer<
	typeof TemplatesUpdateResponseSchema
>;

// ── templates.delete ──────────────────────────────────────────────────────

const TemplatesDeleteInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to delete.'),
});

export type TemplatesDeleteInput = z.input<typeof TemplatesDeleteInputSchema>;

const TemplatesDeleteResponseSchema = z
	.object({ status: z.string().nullish() })
	.loose();

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── templates.createFrom ──────────────────────────────────────────────────

const TemplatesCreateFromInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to copy.'),
	name: z.string().min(1).optional().describe('Name of the new template.'),
	version: VersionSchema.optional(),
	group_name: z
		.string()
		.min(1)
		.optional()
		.describe('Group for the new template, for example a customer name.'),
});

export type TemplatesCreateFromInput = z.input<
	typeof TemplatesCreateFromInputSchema
>;

const TemplatesCreateFromResponseSchema = z
	.object({
		status: z.string().nullish(),
		template_id: z.string().nullish(),
		from_template_id: z.string().nullish(),
		from_template_version: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();

export type TemplatesCreateFromResponse = z.infer<
	typeof TemplatesCreateFromResponseSchema
>;

// ── templates.transfer ────────────────────────────────────────────────────

const TemplatesTransferInputSchema = z.object({
	template_id: z.string().min(1).describe('Template to transfer.'),
	team_id: z.string().min(1).describe('Team to transfer it to.'),
});

export type TemplatesTransferInput = z.input<
	typeof TemplatesTransferInputSchema
>;

const TemplatesTransferResponseSchema = z
	.object({ status: z.string().nullish() })
	.loose();

export type TemplatesTransferResponse = z.infer<
	typeof TemplatesTransferResponseSchema
>;

// ── templates.listVersions ────────────────────────────────────────────────

const TemplatesListVersionsInputSchema = z.object({
	template_id: z.string().min(1).describe('Template whose versions to list.'),
});

export type TemplatesListVersionsInput = z.input<
	typeof TemplatesListVersionsInputSchema
>;

export const CraftmypdfTemplateVersionSchema = z
	.object({
		version: z.number().nullish(),
		keep: z.boolean().nullish(),
		description: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type CraftmypdfTemplateVersion = z.infer<
	typeof CraftmypdfTemplateVersionSchema
>;

const TemplatesListVersionsResponseSchema = z
	.object({
		status: z.string().nullish(),
		template_id: z.string().nullish(),
		versions: z.array(CraftmypdfTemplateVersionSchema),
	})
	.loose();

export type TemplatesListVersionsResponse = z.infer<
	typeof TemplatesListVersionsResponseSchema
>;

// ── templates.retainVersions ──────────────────────────────────────────────

const TemplatesRetainVersionsInputSchema = z.object({
	template_id: z.string().min(1).describe('Template whose versions to mark.'),
	versions: z
		.array(z.number().int().min(0))
		.min(1)
		.describe('Version numbers to mark.'),
	keep: z
		.boolean()
		.describe(
			'True protects these versions from the automatic cleanup; false releases them.',
		),
});

export type TemplatesRetainVersionsInput = z.input<
	typeof TemplatesRetainVersionsInputSchema
>;

const TemplatesRetainVersionsResponseSchema = z
	.object({
		status: z.string().nullish(),
		template_id: z.string().nullish(),
		versions: z.array(CraftmypdfTemplateVersionSchema),
	})
	.loose();

export type TemplatesRetainVersionsResponse = z.infer<
	typeof TemplatesRetainVersionsResponseSchema
>;

// ── templates.queryUsage ──────────────────────────────────────────────────

const TemplatesQueryUsageInputSchema = z.object({
	template_ids: z
		.array(z.string().min(1))
		.min(1)
		.describe('Templates to report on.'),
	start_date: z.iso
		.datetime({ offset: true })
		.optional()
		.describe(
			'Start of the window, ISO 8601 in UTC, for example 2025-01-30T00:00:00Z.',
		),
	end_date: z.iso
		.datetime({ offset: true })
		.optional()
		.describe('End of the window, ISO 8601 in UTC.'),
});

export type TemplatesQueryUsageInput = z.input<
	typeof TemplatesQueryUsageInputSchema
>;

const TemplateUsageSchema = z
	.object({
		template_id: z.string().nullish(),
		total_credit: CountSchema.nullish(),
		total_count: CountSchema.nullish(),
	})
	.loose();

const TemplatesQueryUsageResponseSchema = z
	.object({
		status: z.string().nullish(),
		template_ids: z.array(z.string()).nullish(),
		start_date: z.string().nullish(),
		end_date: z.string().nullish(),
		results: z.array(TemplateUsageSchema).nullish(),
	})
	.loose();

export type TemplatesQueryUsageResponse = z.infer<
	typeof TemplatesQueryUsageResponseSchema
>;

// ── editor.createSession ──────────────────────────────────────────────────

const EditorCreateSessionInputSchema = z.object({
	template_id: z.string().min(1).describe('Template the session edits.'),
	expiration: z
		.number()
		.int()
		.min(1)
		.describe('Minutes until the session expires, for example 1440 for a day.'),
	canSave: z.boolean().optional().describe('Allow saving changes.'),
	canCreatePDF: z.boolean().optional().describe('Allow generating a PDF.'),
	canViewSettings: z.boolean().optional().describe('Show the settings panel.'),
	canPreview: z.boolean().optional().describe('Allow the preview.'),
	canEditJSON: z.boolean().optional().describe('Allow editing the JSON data.'),
	canShowHeader: z.boolean().optional().describe('Show the CraftMyPDF header.'),
	canShowLayers: z.boolean().optional().describe('Show the layers panel.'),
	canShowPropertyPanel: z
		.boolean()
		.optional()
		.describe('Show the property panel.'),
	canShowHelp: z.boolean().optional().describe('Show the help tab.'),
	canShowData: z.boolean().optional().describe('Show the data tab.'),
	canShowExpressionDoc: z
		.boolean()
		.optional()
		.describe('Show the expression documentation tab.'),
	canShowPropertyBinding: z
		.boolean()
		.optional()
		.describe('Show property binding for elements.'),
	canShowBackURL: z.boolean().optional().describe('Show the back button.'),
	jsonMode: z
		.union([z.literal(1), z.literal(2)])
		.optional()
		.describe('1 makes the JSON editor editable, 2 makes it read-only.'),
	backURL: z.url().optional().describe('Where the back button goes.'),
});

export type EditorCreateSessionInput = z.input<
	typeof EditorCreateSessionInputSchema
>;

const EditorCreateSessionResponseSchema = z
	.object({
		status: z.string().nullish(),
		url: z.string().nullish(),
		expire_after_unix_timestamp: z.number().nullish(),
		// The spec types this integer but describes it as an ISO date string.
		expire_after: z.union([z.string(), z.number()]).nullish(),
		token_uuid: z.string().nullish(),
	})
	.loose();

export type EditorCreateSessionResponse = z.infer<
	typeof EditorCreateSessionResponseSchema
>;

// ── editor.deactivateSession ──────────────────────────────────────────────

const EditorDeactivateSessionInputSchema = z.object({
	token_uuid: z
		.string()
		.min(1)
		.describe('The token_uuid that editor.createSession returned.'),
});

export type EditorDeactivateSessionInput = z.input<
	typeof EditorDeactivateSessionInputSchema
>;

const EditorDeactivateSessionResponseSchema = z
	.object({ status: z.string().nullish() })
	.loose();

export type EditorDeactivateSessionResponse = z.infer<
	typeof EditorDeactivateSessionResponseSchema
>;

// ── account.getInfo ───────────────────────────────────────────────────────

const AccountGetInfoInputSchema = z.object({});

export type AccountGetInfoInput = z.input<typeof AccountGetInfoInputSchema>;

const AccountGetInfoResponseSchema = z
	.object({
		status: z.string().nullish(),
		username: z.string().nullish(),
		quota_counter: CountSchema.nullish(),
		quota_max: CountSchema.nullish(),
		template_counter: CountSchema.nullish(),
		template_max: CountSchema.nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type AccountGetInfoResponse = z.infer<
	typeof AccountGetInfoResponseSchema
>;

// ── transactions.list ─────────────────────────────────────────────────────

const TransactionsListInputSchema = z.object({
	limit: PageLimitSchema.describe(
		'How many transactions to return. CraftMyPDF defaults to 300.',
	),
	offset: PageOffsetSchema,
});

export type TransactionsListInput = z.input<typeof TransactionsListInputSchema>;

export const CraftmypdfTransactionSchema = z
	.object({
		transaction_ref: z.string().nullish(),
		transaction_type: z.string().nullish(),
		exec_tm: z.number().nullish(),
		credit: CountSchema.nullish(),
		created_at: z.string().nullish(),
		resp_file_size: z.number().nullish(),
		resp_status: z.string().nullish(),
	})
	.loose();

export type CraftmypdfTransaction = z.infer<typeof CraftmypdfTransactionSchema>;

const TransactionsListResponseSchema = z.object({
	status: z.string().nullish(),
	transactions: z.array(CraftmypdfTransactionSchema),
	// Derived by the endpoint: CraftMyPDF answers no cursor of its own.
	next_offset: z.number().nullish(),
});

export type TransactionsListResponse = z.infer<
	typeof TransactionsListResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type CraftmypdfEndpointInputs = {
	pdfCreate: PdfCreateInput;
	pdfCreateAsync: PdfCreateAsyncInput;
	pdfCreateImage: PdfCreateImageInput;
	pdfCreateMerge: PdfCreateMergeInput;
	pdfCreateParallel: PdfCreateParallelInput;
	pdfAddWatermark: PdfAddWatermarkInput;
	pdfAddText: PdfAddTextInput;
	pdfUpdateFields: PdfUpdateFieldsInput;
	pdfMerge: PdfMergeInput;
	pdfGetInfo: PdfGetInfoInput;
	templatesList: TemplatesListInput;
	templatesGet: TemplatesGetInput;
	templatesUpdate: TemplatesUpdateInput;
	templatesDelete: TemplatesDeleteInput;
	templatesCreateFrom: TemplatesCreateFromInput;
	templatesTransfer: TemplatesTransferInput;
	templatesListVersions: TemplatesListVersionsInput;
	templatesRetainVersions: TemplatesRetainVersionsInput;
	templatesQueryUsage: TemplatesQueryUsageInput;
	editorCreateSession: EditorCreateSessionInput;
	editorDeactivateSession: EditorDeactivateSessionInput;
	accountGetInfo: AccountGetInfoInput;
	transactionsList: TransactionsListInput;
};

export type CraftmypdfEndpointOutputs = {
	pdfCreate: PdfCreateResponse;
	pdfCreateAsync: PdfCreateAsyncResponse;
	pdfCreateImage: PdfCreateImageResponse;
	pdfCreateMerge: PdfCreateMergeResponse;
	pdfCreateParallel: PdfCreateParallelResponse;
	pdfAddWatermark: PdfAddWatermarkResponse;
	pdfAddText: PdfAddTextResponse;
	pdfUpdateFields: PdfUpdateFieldsResponse;
	pdfMerge: PdfMergeResponse;
	pdfGetInfo: PdfGetInfoResponse;
	templatesList: TemplatesListResponse;
	templatesGet: TemplatesGetResponse;
	templatesUpdate: TemplatesUpdateResponse;
	templatesDelete: TemplatesDeleteResponse;
	templatesCreateFrom: TemplatesCreateFromResponse;
	templatesTransfer: TemplatesTransferResponse;
	templatesListVersions: TemplatesListVersionsResponse;
	templatesRetainVersions: TemplatesRetainVersionsResponse;
	templatesQueryUsage: TemplatesQueryUsageResponse;
	editorCreateSession: EditorCreateSessionResponse;
	editorDeactivateSession: EditorDeactivateSessionResponse;
	accountGetInfo: AccountGetInfoResponse;
	transactionsList: TransactionsListResponse;
};

export const CraftmypdfEndpointInputSchemas = {
	pdfCreate: PdfCreateInputSchema,
	pdfCreateAsync: PdfCreateAsyncInputSchema,
	pdfCreateImage: PdfCreateImageInputSchema,
	pdfCreateMerge: PdfCreateMergeInputSchema,
	pdfCreateParallel: PdfCreateParallelInputSchema,
	pdfAddWatermark: PdfAddWatermarkInputSchema,
	pdfAddText: PdfAddTextInputSchema,
	pdfUpdateFields: PdfUpdateFieldsInputSchema,
	pdfMerge: PdfMergeInputSchema,
	pdfGetInfo: PdfGetInfoInputSchema,
	templatesList: TemplatesListInputSchema,
	templatesGet: TemplatesGetInputSchema,
	templatesUpdate: TemplatesUpdateInputSchema,
	templatesDelete: TemplatesDeleteInputSchema,
	templatesCreateFrom: TemplatesCreateFromInputSchema,
	templatesTransfer: TemplatesTransferInputSchema,
	templatesListVersions: TemplatesListVersionsInputSchema,
	templatesRetainVersions: TemplatesRetainVersionsInputSchema,
	templatesQueryUsage: TemplatesQueryUsageInputSchema,
	editorCreateSession: EditorCreateSessionInputSchema,
	editorDeactivateSession: EditorDeactivateSessionInputSchema,
	accountGetInfo: AccountGetInfoInputSchema,
	transactionsList: TransactionsListInputSchema,
} as const;

export const CraftmypdfEndpointOutputSchemas = {
	pdfCreate: PdfCreateResponseSchema,
	pdfCreateAsync: PdfCreateAsyncResponseSchema,
	pdfCreateImage: PdfCreateImageResponseSchema,
	pdfCreateMerge: PdfCreateMergeResponseSchema,
	pdfCreateParallel: PdfCreateParallelResponseSchema,
	pdfAddWatermark: PdfAddWatermarkResponseSchema,
	pdfAddText: PdfAddTextResponseSchema,
	pdfUpdateFields: PdfUpdateFieldsResponseSchema,
	pdfMerge: PdfMergeResponseSchema,
	pdfGetInfo: PdfGetInfoResponseSchema,
	templatesList: TemplatesListResponseSchema,
	templatesGet: TemplatesGetResponseSchema,
	templatesUpdate: TemplatesUpdateResponseSchema,
	templatesDelete: TemplatesDeleteResponseSchema,
	templatesCreateFrom: TemplatesCreateFromResponseSchema,
	templatesTransfer: TemplatesTransferResponseSchema,
	templatesListVersions: TemplatesListVersionsResponseSchema,
	templatesRetainVersions: TemplatesRetainVersionsResponseSchema,
	templatesQueryUsage: TemplatesQueryUsageResponseSchema,
	editorCreateSession: EditorCreateSessionResponseSchema,
	editorDeactivateSession: EditorDeactivateSessionResponseSchema,
	accountGetInfo: AccountGetInfoResponseSchema,
	transactionsList: TransactionsListResponseSchema,
} as const;
