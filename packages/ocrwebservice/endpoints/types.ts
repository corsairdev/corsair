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

const GetAccountCredentialsInputSchema = z.object({}).strict();

const GetAccountCredentialsResponseSchema = z
	.object({
		user_name: z.string(),
	})
	.strict();

const GetAccountInformationInputSchema = z.object({}).strict();

const GetAccountInformationResponseSchema = z
	.object({
		ErrorMessage: z.string().nullable().optional(),
		AvailablePages: z.number().nullable().optional(),
		MaxPages: z.number().nullable().optional(),
		LastProcessingTime: z.string().nullable().optional(),
		SubcriptionPlan: z.string().nullable().optional(),
		ExpirationDate: z.string().nullable().optional(),
	})
	.loose();

const dateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, {
		message: 'Date must be YYYY-MM-DD',
	})
	.refine(
		(value) => {
			const year = Number(value.slice(0, 4));
			const month = Number(value.slice(5, 7));
			const day = Number(value.slice(8, 10));
			const date = new Date(Date.UTC(year, month - 1, day));
			return (
				date.getUTCFullYear() === year &&
				date.getUTCMonth() === month - 1 &&
				date.getUTCDate() === day
			);
		},
		{ message: 'Date must be a real calendar day' },
	);

const LogInputSchema = z
	.object({
		from_date: dateSchema,
		to_date: dateSchema,
		reserved: z.array(z.string()).optional(),
	})
	.strict();

const LogResponseSchema = z
	.object({
		data: z.string(),
	})
	.strict();

const RecognizeInputSchema = z
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

const RecognizeResponseSchema = z
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

export type GetAccountCredentialsInput = z.infer<
	typeof GetAccountCredentialsInputSchema
>;
export type GetAccountCredentialsResponse = z.infer<
	typeof GetAccountCredentialsResponseSchema
>;
export type GetAccountInformationInput = z.infer<
	typeof GetAccountInformationInputSchema
>;
export type GetAccountInformationResponse = z.infer<
	typeof GetAccountInformationResponseSchema
>;
export type LogInput = z.infer<typeof LogInputSchema>;
export type LogResponse = z.infer<typeof LogResponseSchema>;
export type RecognizeInput = z.infer<typeof RecognizeInputSchema>;
export type RecognizeResponse = z.infer<typeof RecognizeResponseSchema>;

/** @deprecated Use RecognizeInput */
export type ProcessDocumentInput = RecognizeInput;
/** @deprecated Use RecognizeResponse */
export type ProcessDocumentResponse = RecognizeResponse;

export type OcrWebServiceEndpointInputs = {
	getAccountCredentials: GetAccountCredentialsInput;
	getAccountInformation: GetAccountInformationInput;
	log: LogInput;
	recognize: RecognizeInput;
};

export type OcrWebServiceEndpointOutputs = {
	getAccountCredentials: GetAccountCredentialsResponse;
	getAccountInformation: GetAccountInformationResponse;
	log: LogResponse;
	recognize: RecognizeResponse;
};

export const OcrWebServiceEndpointInputSchemas = {
	getAccountCredentials: GetAccountCredentialsInputSchema,
	getAccountInformation: GetAccountInformationInputSchema,
	log: LogInputSchema,
	recognize: RecognizeInputSchema,
} as const;

export const OcrWebServiceEndpointOutputSchemas = {
	getAccountCredentials: GetAccountCredentialsResponseSchema,
	getAccountInformation: GetAccountInformationResponseSchema,
	log: LogResponseSchema,
	recognize: RecognizeResponseSchema,
} as const;

export {
	GetAccountCredentialsInputSchema,
	GetAccountCredentialsResponseSchema,
	GetAccountInformationInputSchema,
	GetAccountInformationResponseSchema,
	LogInputSchema,
	LogResponseSchema,
	RecognizeInputSchema,
	RecognizeResponseSchema,
	RecognizeInputSchema as ProcessDocumentInputSchema,
	RecognizeResponseSchema as ProcessDocumentResponseSchema,
};
