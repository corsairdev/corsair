import { z } from 'zod';

// ── 1. Verify Email ─────────────────────────────────────────────────────────
export const VerifyEmailInputSchema = z.object({
	email: z.string().email().or(z.string()),
	timeout: z.number().int().positive().optional(),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailInputSchema>;

export const VerifyEmailResponseSchema = z
	.object({
		email: z.string(),
		status: z.string(),
		reason: z.string().optional(),
		domain: z
			.object({
				name: z.string().optional(),
				acceptAll: z.string().optional(),
				disposable: z.string().optional(),
				free: z.string().optional(),
			})
			.passthrough()
			.optional(),
		account: z
			.object({
				role: z.string().optional(),
				disabled: z.string().optional(),
				fullMailbox: z.string().optional(),
			})
			.passthrough()
			.optional(),
		dns: z
			.object({
				type: z.string().optional(),
				record: z.string().optional(),
			})
			.passthrough()
			.optional(),
		provider: z.string().optional(),
		score: z.number().optional(),
		toxic: z.string().optional(),
		toxicity: z.number().optional(),
	})
	.passthrough();
export type VerifyEmailResponse = z.infer<typeof VerifyEmailResponseSchema>;

// ── 2. Verify Domain ────────────────────────────────────────────────────────
export const VerifyDomainInputSchema = z.object({
	domain: z.string(),
	timeout: z.number().int().positive().optional(),
});
export type VerifyDomainInput = z.infer<typeof VerifyDomainInputSchema>;

export const VerifyDomainResponseSchema = z
	.object({
		domain: z.string().optional(),
		status: z.union([z.string(), z.number()]).optional(),
		acceptAll: z.string().optional(),
		disposable: z.string().optional(),
		free: z.string().optional(),
		dns: z
			.object({
				type: z.string().optional(),
				record: z.string().optional(),
			})
			.passthrough()
			.optional(),
		error: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type VerifyDomainResponse = z.infer<typeof VerifyDomainResponseSchema>;

// ── 3. Create Batch Request ────────────────────────────────────────────────
export const BatchRecipientSchema = z.object({
	email: z.string(),
	custom: z.string().optional(),
});
export type BatchRecipient = z.infer<typeof BatchRecipientSchema>;

export const CreateBatchRequestInputSchema = z.object({
	recipients: z.array(BatchRecipientSchema.or(z.string())),
	callback: z.string().url().optional(),
});
export type CreateBatchRequestInput = z.infer<
	typeof CreateBatchRequestInputSchema
>;

export const CreateBatchRequestResponseSchema = z
	.object({
		batchId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		quantity: z.number().optional(),
	})
	.passthrough();
export type CreateBatchRequestResponse = z.infer<
	typeof CreateBatchRequestResponseSchema
>;

// ── 4. Get Batch Results ───────────────────────────────────────────────────
export const GetBatchResultsInputSchema = z.object({
	batchId: z.string(),
	download: z
		.enum(['all', 'undeliverable', 'deliverable', 'unknown', 'risky'])
		.optional(),
});
export type GetBatchResultsInput = z.infer<typeof GetBatchResultsInputSchema>;

export const GetBatchResultsResponseSchema = z
	.object({
		batchId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		data: z.unknown().optional(),
	})
	.passthrough();
export type GetBatchResultsResponse = z.infer<
	typeof GetBatchResultsResponseSchema
>;

// ── 5. Finish Batch ────────────────────────────────────────────────────────
export const FinishBatchInputSchema = z.object({
	batchId: z.string(),
});
export type FinishBatchInput = z.infer<typeof FinishBatchInputSchema>;

export const FinishBatchResponseSchema = z
	.object({
		batchId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type FinishBatchResponse = z.infer<typeof FinishBatchResponseSchema>;

// ── 6. Delete Batch Request ────────────────────────────────────────────────
export const DeleteBatchRequestInputSchema = z.object({
	batchId: z.string(),
});
export type DeleteBatchRequestInput = z.infer<
	typeof DeleteBatchRequestInputSchema
>;

export const DeleteBatchRequestResponseSchema = z
	.object({
		batchId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		deleted: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type DeleteBatchRequestResponse = z.infer<
	typeof DeleteBatchRequestResponseSchema
>;

// ── 7. Create Toxicity List Job ────────────────────────────────────────────
export const CreateToxicityListJobInputSchema = z.object({
	emails: z.array(z.union([z.string(), z.object({ email: z.string() })])),
	callback: z.string().url().optional(),
});
export type CreateToxicityListJobInput = z.infer<
	typeof CreateToxicityListJobInputSchema
>;

export const CreateToxicityListJobResponseSchema = z
	.object({
		jobId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
	})
	.passthrough();
export type CreateToxicityListJobResponse = z.infer<
	typeof CreateToxicityListJobResponseSchema
>;

// ── 8. Check Toxicity List Job Status ──────────────────────────────────────
export const CheckToxicityListJobStatusInputSchema = z.object({
	jobId: z.string(),
});
export type CheckToxicityListJobStatusInput = z.infer<
	typeof CheckToxicityListJobStatusInputSchema
>;

export const CheckToxicityListJobStatusResponseSchema = z
	.object({
		jobId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		processed: z.number().optional(),
		results: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();
export type CheckToxicityListJobStatusResponse = z.infer<
	typeof CheckToxicityListJobStatusResponseSchema
>;

// ── 9. Delete Toxicity List Job ────────────────────────────────────────────
export const DeleteToxicityListJobInputSchema = z.object({
	jobId: z.string(),
});
export type DeleteToxicityListJobInput = z.infer<
	typeof DeleteToxicityListJobInputSchema
>;

export const DeleteToxicityListJobResponseSchema = z
	.object({
		jobId: z.string().optional(),
		id: z.string().optional(),
		status: z.string().optional(),
		deleted: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();
export type DeleteToxicityListJobResponse = z.infer<
	typeof DeleteToxicityListJobResponseSchema
>;

// ── 10. Get Credits ────────────────────────────────────────────────────────
export const GetCreditsInputSchema = z.object({}).optional();
export type GetCreditsInput = z.infer<typeof GetCreditsInputSchema>;

export const GetCreditsResponseSchema = z
	.object({
		credits: z.number(),
	})
	.passthrough();
export type GetCreditsResponse = z.infer<typeof GetCreditsResponseSchema>;

// ── Schema Maps ────────────────────────────────────────────────────────────
export const BouncerEndpointInputSchemas = {
	verifyEmail: VerifyEmailInputSchema,
	verifyDomain: VerifyDomainInputSchema,
	createBatchRequest: CreateBatchRequestInputSchema,
	getBatchResults: GetBatchResultsInputSchema,
	finishBatch: FinishBatchInputSchema,
	deleteBatchRequest: DeleteBatchRequestInputSchema,
	createToxicityListJob: CreateToxicityListJobInputSchema,
	checkToxicityListJobStatus: CheckToxicityListJobStatusInputSchema,
	deleteToxicityListJob: DeleteToxicityListJobInputSchema,
	getCredits: GetCreditsInputSchema,
} as const;

export type BouncerEndpointInputs = {
	[K in keyof typeof BouncerEndpointInputSchemas]: z.infer<
		(typeof BouncerEndpointInputSchemas)[K]
	>;
};

export const BouncerEndpointOutputSchemas = {
	verifyEmail: VerifyEmailResponseSchema,
	verifyDomain: VerifyDomainResponseSchema,
	createBatchRequest: CreateBatchRequestResponseSchema,
	getBatchResults: GetBatchResultsResponseSchema,
	finishBatch: FinishBatchResponseSchema,
	deleteBatchRequest: DeleteBatchRequestResponseSchema,
	createToxicityListJob: CreateToxicityListJobResponseSchema,
	checkToxicityListJobStatus: CheckToxicityListJobStatusResponseSchema,
	deleteToxicityListJob: DeleteToxicityListJobResponseSchema,
	getCredits: GetCreditsResponseSchema,
} as const;

export type BouncerEndpointOutputs = {
	[K in keyof typeof BouncerEndpointOutputSchemas]: z.infer<
		(typeof BouncerEndpointOutputSchemas)[K]
	>;
};
