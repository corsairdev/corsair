import { z } from 'zod';

const FacesSchema = z.union([
	z.literal(200_000),
	z.literal(500_000),
	z.literal(1_000_000),
	z.literal(2_000_000),
]);

const OutputFormatSchema = z.enum(['glb', 'obj', 'stl', 'fbx']);

export const ParamsSchema = z.strictObject({
	faces: FacesSchema.optional(),
	pbr: z.boolean().optional(),
	quad: z.boolean().optional(),
	texture_quality: z.enum(['standard', 'detailed']).optional(),
});

export const OutputsSchema = z.array(OutputFormatSchema).min(1).max(4);

export const TextTo3dInputSchema = z.strictObject({
	model: z.enum(['sculptor', 'atelier']),
	prompt: z.string().min(1).max(4000),
	params: ParamsSchema.optional(),
	outputs: OutputsSchema.optional(),
	idempotencyKey: z.string().min(1).optional(),
});

const UploadIdsSchema = z.strictObject({
	front: z.string().min(1),
	back: z.string().min(1).optional(),
	left: z.string().min(1).optional(),
	right: z.string().min(1).optional(),
});

export const PhotoTo3dInputSchema = z
	.strictObject({
		model: z.enum(['sculptor', 'atelier', 'capture']),
		images_upload_ids: UploadIdsSchema.optional(),
		images_inline: z.strictObject({ front: z.string().min(1) }).optional(),
		params: ParamsSchema.optional(),
		outputs: OutputsSchema.optional(),
		idempotencyKey: z.string().min(1).optional(),
	})
	.superRefine((value, ctx) => {
		const hasUploads = value.images_upload_ids !== undefined;
		const hasInline = value.images_inline !== undefined;
		if (hasUploads === hasInline) {
			ctx.addIssue({
				code: 'custom',
				message: 'Send exactly one of images_upload_ids or images_inline',
			});
		}
		if (value.model === 'capture') {
			const ids = value.images_upload_ids;
			if (!ids?.front || !ids.back || !ids.left || !ids.right || hasInline) {
				ctx.addIssue({
					code: 'custom',
					message: 'capture requires front, back, left, and right upload ids',
				});
			}
		}
		if (value.model === 'atelier' && value.images_upload_ids) {
			const ids = value.images_upload_ids;
			if (ids.back || ids.left || ids.right) {
				ctx.addIssue({
					code: 'custom',
					message: 'atelier accepts a single front photo',
				});
			}
		}
	});

export const CreateUploadInputSchema = z.object({});

export const JobIdInputSchema = z.strictObject({
	job_id: z.string().min(1),
});

export const DownloadInputSchema = z.strictObject({
	job_id: z.string().min(1),
	format: OutputFormatSchema,
});

export const AcceptedJobSchema = z.looseObject({
	job_id: z.string(),
	status: z.string(),
	created_at: z.string(),
	billable_amount_cents: z.number(),
});

export const JobErrorSchema = z.looseObject({
	code: z.string(),
	message: z.string(),
});

export const JobSchema = z.looseObject({
	job_id: z.string(),
	status: z.string(),
	model: z.string().optional(),
	created_at: z.string(),
	updated_at: z.string().optional(),
	completed_at: z.string().nullable().optional(),
	outputs: z
		.array(
			z.looseObject({
				format: z.string(),
				download_url: z.string(),
			}),
		)
		.optional(),
	error: JobErrorSchema.nullable().optional(),
});

export const UploadSchema = z.looseObject({
	upload_id: z.string(),
	upload_url: z.string(),
	expires_at: z.string(),
});

export const CancelJobSchema = z.looseObject({
	job_id: z.string(),
	status: z.string(),
	already_terminal: z.boolean(),
});

export const DownloadSchema = z.looseObject({
	url: z.string().min(1),
});

export type TextTo3dInput = z.infer<typeof TextTo3dInputSchema>;
export type PhotoTo3dInput = z.infer<typeof PhotoTo3dInputSchema>;
export type CreateUploadInput = z.infer<typeof CreateUploadInputSchema>;
export type JobIdInput = z.infer<typeof JobIdInputSchema>;
export type DownloadInput = z.infer<typeof DownloadInputSchema>;
export type AcceptedJob = z.infer<typeof AcceptedJobSchema>;
export type SuzanneJob = z.infer<typeof JobSchema>;
export type Upload = z.infer<typeof UploadSchema>;
export type CancelJob = z.infer<typeof CancelJobSchema>;
export type Download = z.infer<typeof DownloadSchema>;

export type SuzanneEndpointInputs = {
	textTo3d: TextTo3dInput;
	photoTo3d: PhotoTo3dInput;
	createUpload: CreateUploadInput;
	getJob: JobIdInput;
	cancelJob: JobIdInput;
	downloadModel: DownloadInput;
};

export type SuzanneEndpointOutputs = {
	textTo3d: AcceptedJob;
	photoTo3d: AcceptedJob;
	createUpload: Upload;
	getJob: SuzanneJob;
	cancelJob: CancelJob;
	downloadModel: Download;
};

export const SuzanneEndpointInputSchemas = {
	textTo3d: TextTo3dInputSchema,
	photoTo3d: PhotoTo3dInputSchema,
	createUpload: CreateUploadInputSchema,
	getJob: JobIdInputSchema,
	cancelJob: JobIdInputSchema,
	downloadModel: DownloadInputSchema,
} as const;

export const SuzanneEndpointOutputSchemas = {
	textTo3d: AcceptedJobSchema,
	photoTo3d: AcceptedJobSchema,
	createUpload: UploadSchema,
	getJob: JobSchema,
	cancelJob: CancelJobSchema,
	downloadModel: DownloadSchema,
} as const;
