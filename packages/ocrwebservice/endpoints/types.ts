import { z } from 'zod';

export const OCRWEBSERVICE_OUTPUT_FORMATS = [
	'pdf',
	'doc',
	'xls',
	'rtf',
	'txt',
	'pdfimg',
	'docx',
	'xlsx',
] as const;

const outputFormatSchema = z.string().refine(
	(value) => {
		const formats = value.split(',');

		if (formats.length < 1 || formats.length > 2) {
			return false;
		}

		return formats.every((format) =>
			(OCRWEBSERVICE_OUTPUT_FORMATS as readonly string[]).includes(format),
		);
	},
	{
		message:
			'Output format must contain one or two supported comma-separated formats.',
	},
);

const ProcessDocumentInputSchema = z
	.object({
		file: z.instanceof(Blob),

		language: z.string().min(1).default('english'),

		pagerange: z.string().min(1).optional(),

		tobw: z.boolean().optional(),

		zone: z.string().min(1).optional(),

		outputformat: outputFormatSchema.optional(),

		gettext: z.boolean().optional(),

		getwords: z.boolean().optional(),

		newline: z.boolean().optional(),

		description: z.string().optional(),
	})
	.strict()
	.refine(
		(input) => input.gettext === true || input.outputformat !== undefined,
		{
			message: 'At least one of gettext or outputformat must be specified.',
		},
	);

export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ProcessDocumentResponseSchema = z
	.object({
		ErrorMessage: z.string().nullable().optional(),

		AvailablePages: z.number().nullable().optional(),

		ProcessedPages: z.number().nullable().optional(),

		OCRText: z.array(z.array(z.string())).nullable().optional(),

		OutputFileUrl: z.string().nullable().optional(),

		TaskDescription: z.string().nullable().optional(),

		Reserved: z.array(z.unknown()).nullable().optional(),
	})
	.loose();

export type ProcessDocumentResponse = z.infer<
	typeof ProcessDocumentResponseSchema
>;

export type OcrWebServiceEndpointInputs = {
	processDocument: ProcessDocumentInput;
};

export type OcrWebServiceEndpointOutputs = {
	processDocument: ProcessDocumentResponse;
};

export const OcrWebServiceEndpointInputSchemas = {
	processDocument: ProcessDocumentInputSchema,
} as const;

export const OcrWebServiceEndpointOutputSchemas = {
	processDocument: ProcessDocumentResponseSchema,
} as const;

export { ProcessDocumentInputSchema, ProcessDocumentResponseSchema };
