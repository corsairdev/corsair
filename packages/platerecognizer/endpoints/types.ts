import { z } from 'zod';

export const GetStatisticsInputSchema = z.object({});

export const GetStatisticsResponseSchema = z
	.object({
		usage: z
			.object({
				month: z.number().optional(),
				calls: z.number().optional(),
				year: z.number().optional(),
				resets_on: z.string().optional(),
			})
			.loose()
			.optional(),
		total_calls: z.number().optional(),
	})
	.loose();

/**
 * One detection. In the default `detection_mode` `plate` is the plate text; with
 * `config: { detection_mode: 'vehicle' }` it is an object (`type`, `score`,
 * `box`, `props`) and can be null for a vehicle without a readable plate.
 */
const PlateResultSchema = z
	.object({
		plate: z
			.union([z.string(), z.object({}).loose()])
			.nullable()
			.optional(),
		score: z.number().optional(),
		dscore: z.number().optional(),
		region: z
			.object({
				code: z.string().optional(),
				score: z.number().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const ImageSourceShape = {
	upload: z
		.string()
		.min(1)
		.optional()
		.describe('Base64 image, sent as the upload form field. Or use uploadUrl.'),
	uploadUrl: z
		.string()
		.url()
		.optional()
		.describe('Public URL of the image, instead of upload.'),
	cameraId: z.string().min(1).optional().describe('Your camera identifier.'),
	timestamp: z
		.string()
		.min(1)
		.optional()
		.describe(
			'UTC ISO 8601 time the image was taken, e.g. 2019-08-19T13:11:25.',
		),
};

const ONE_IMAGE_SOURCE = 'Send exactly one of upload or uploadUrl.';

function oneImageSource(value: {
	upload?: string;
	uploadUrl?: string;
}): boolean {
	return (value.upload === undefined) !== (value.uploadUrl === undefined);
}

export const ReadPlateInputSchema = z
	.object({
		...ImageSourceShape,
		regions: z
			.array(z.string().min(1))
			.optional()
			.describe('Country or state codes to match, e.g. ["us-ca", "mx"].'),
		mmc: z
			.boolean()
			.optional()
			.describe(
				'Also predict make, model, color and orientation (paid add-on).',
			),
		direction: z
			.boolean()
			.optional()
			.describe('Predict the direction of travel. Needs mmc.'),
		config: z
			// `unknown` values: engine settings are free-form JSON documented by key.
			.record(z.string(), z.unknown())
			.optional()
			.describe(
				'Engine configuration, e.g. { detection_mode: "vehicle" } or { region: "strict" }.',
			),
	})
	.refine(oneImageSource, { message: ONE_IMAGE_SOURCE });

export const OCR_TYPES = [
	'vin',
	'trailer_id',
	'odometer',
	'shipping_container',
	'boat_reg_number',
	'seal_ctpat',
] as const;

export const ReadOcrInputSchema = z
	.object({
		...ImageSourceShape,
		type: z
			.enum(OCR_TYPES)
			.describe(
				'What to read: vin, trailer_id, odometer, shipping_container, boat_reg_number or seal_ctpat.',
			),
	})
	.refine(oneImageSource, { message: ONE_IMAGE_SOURCE });

const OcrValueSchema = z
	.object({ value: z.string().optional(), score: z.number().optional() })
	.loose();

/**
 * One OCR result. Identifier types (vin, trailer_id, odometer, shipping_container,
 * boat_reg_number) fill `identifier.props.code[].value`; `seal_ctpat` fills the
 * seal fields instead. Everything is optional so either shape parses.
 */
const OcrResultSchema = z
	.object({
		identifier: z
			.object({
				type: z.string().optional(),
				props: z
					.object({
						code: z.array(OcrValueSchema).optional(),
						orientation: z.array(OcrValueSchema).optional(),
						label: z.array(OcrValueSchema).optional(),
						confidence: z.number().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		seal_identification: z
			.object({
				carrier_or_brand: z.string().nullable().optional(),
				seal_type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		text_ocr: z
			.object({
				serial_number: z
					.object({
						code: z
							.object({
								value: z.string().optional(),
								confidence: z.number().optional(),
							})
							.loose()
							.optional(),
					})
					.loose()
					.optional(),
				additional_markings: z.array(z.string()).nullable().optional(),
			})
			.loose()
			.optional(),
		barcode_data: z
			.object({
				code_present: z.boolean().nullable().optional(),
				code_type: z.string().nullable().optional(),
				decoded_value: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export const ReadOcrResponseSchema = z
	.object({
		results: z.array(OcrResultSchema),
		processing_time: z.number().optional(),
		filename: z.string().nullable().optional(),
		camera_id: z.string().nullable().optional(),
		timestamp: z.string().optional(),
		version: z.number().optional(),
	})
	.loose();

export const ReadPlateResponseSchema = z
	.object({
		results: z.array(PlateResultSchema),
		processing_time: z.number().optional(),
		filename: z.string().optional(),
		camera_id: z.string().nullable().optional(),
		timestamp: z.string().optional(),
		version: z.number().optional(),
	})
	.loose();

export type GetStatisticsInput = z.infer<typeof GetStatisticsInputSchema>;
export type GetStatisticsResponse = z.infer<typeof GetStatisticsResponseSchema>;
export type ReadPlateInput = z.infer<typeof ReadPlateInputSchema>;
export type ReadPlateResponse = z.infer<typeof ReadPlateResponseSchema>;
export type ReadOcrInput = z.infer<typeof ReadOcrInputSchema>;
export type ReadOcrResponse = z.infer<typeof ReadOcrResponseSchema>;

export const PlateRecognizerEndpointInputSchemas = {
	'usage.get': GetStatisticsInputSchema,
	'plates.read': ReadPlateInputSchema,
	'ocr.read': ReadOcrInputSchema,
	'ocr.getUsage': GetStatisticsInputSchema,
};

export const PlateRecognizerEndpointOutputSchemas = {
	'usage.get': GetStatisticsResponseSchema,
	'plates.read': ReadPlateResponseSchema,
	'ocr.read': ReadOcrResponseSchema,
	'ocr.getUsage': GetStatisticsResponseSchema,
};
