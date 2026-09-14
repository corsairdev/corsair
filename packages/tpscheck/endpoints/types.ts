import { z } from 'zod';

// ── Check Endpoint ──────────────────────────────────────────────────────────

export const LineInfoSchema = z
	.object({
		type: z.string().optional(),
		original_carrier: z.string().optional(),
		location: z.string().optional(),
		country: z.string().optional(),
		prefix: z.string().optional(),
	})
	.passthrough();

export const ReachabilitySchema = z
	.object({
		status: z.string().optional(),
		confidence: z.string().optional(),
	})
	.passthrough();

export const CheckInputSchema = z.object({
	phone: z.string().min(1, 'Phone number cannot be empty'),
});

export type CheckInput = z.infer<typeof CheckInputSchema>;

export const CheckResponseSchema = z
	.object({
		input: z.string(),
		e164: z.string().optional(),
		valid: z.boolean(),
		line: LineInfoSchema.optional(),
		reachability: ReachabilitySchema.optional(),
		tps: z.boolean().optional(),
		ctps: z.boolean().optional(),
	})
	.passthrough();

export type CheckResponse = z.infer<typeof CheckResponseSchema>;

// ── Batch Endpoint ──────────────────────────────────────────────────────────

export const BatchInputSchema = z.object({
	phones: z
		.array(z.string().min(1))
		.min(1, 'At least one phone number is required')
		.max(100, 'Batch size cannot exceed 100 phone numbers'),
});

export type BatchInput = z.infer<typeof BatchInputSchema>;

export const BatchResponseSchema = z
	.object({
		total: z.number().optional(),
		results: z.array(CheckResponseSchema),
	})
	.passthrough();

export type BatchResponse = z.infer<typeof BatchResponseSchema>;

// ── Credits Endpoint ────────────────────────────────────────────────────────

export const CreditsInputSchema = z.object({}).passthrough();

export type CreditsInput = z.infer<typeof CreditsInputSchema>;

export const CreditsResponseSchema = z
	.object({
		requests_used: z.number(),
		requests_remaining: z.number(),
		monthly_limit: z.number(),
		plan: z.string(),
		reset_date: z.string(),
	})
	.passthrough();

export type CreditsResponse = z.infer<typeof CreditsResponseSchema>;

// ── Status Endpoint ─────────────────────────────────────────────────────────

export const StatusInputSchema = z.object({}).passthrough();

export type StatusInput = z.infer<typeof StatusInputSchema>;

export const StatusResponseSchema = z
	.object({
		status: z.string(),
		version: z.string().optional(),
	})
	.passthrough();

export type StatusResponse = z.infer<typeof StatusResponseSchema>;

// ── Plugin Endpoint Input/Output Collections ────────────────────────────────

export type TpscheckEndpointInputs = {
	check: CheckInput;
	batch: BatchInput;
	credits: CreditsInput;
	status: StatusInput;
};

export type TpscheckEndpointOutputs = {
	check: CheckResponse;
	batch: BatchResponse;
	credits: CreditsResponse;
	status: StatusResponse;
};

export const TpscheckEndpointInputSchemas = {
	check: CheckInputSchema,
	batch: BatchInputSchema,
	credits: CreditsInputSchema,
	status: StatusInputSchema,
} as const;

export const TpscheckEndpointOutputSchemas = {
	check: CheckResponseSchema,
	batch: BatchResponseSchema,
	credits: CreditsResponseSchema,
	status: StatusResponseSchema,
} as const;
