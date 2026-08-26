import { z } from 'zod';

const UserBalanceInputSchema = z.object({}).loose();

const GenerateImageFromImageInputSchema = z
	.object({
		engine_id: z.string().min(1),
		init_image: z.instanceof(Blob),
		text_prompts: z
			.array(
				z
					.object({
						text: z.string().min(1),
						weight: z.number().optional(),
					})
					.loose(),
			)
			.min(1),
		init_image_mode: z
			.enum(['IMAGE_STRENGTH', 'STEP_SCHEDULE'])
			.optional(),
		image_strength: z.number().min(0).max(1).optional(),
		step_schedule_start: z.number().min(0).max(1).optional(),
		step_schedule_end: z.number().min(0).max(1).optional(),
		cfg_scale: z.number().min(0).max(35).optional(),
		clip_guidance_preset: z.string().optional(),
		sampler: z.string().optional(),
		samples: z.number().int().min(1).max(10).optional(),
		steps: z.number().int().min(10).max(150).optional(),
		width: z.number().int().positive().optional(),
		height: z.number().int().positive().optional(),
		seed: z.number().int().min(0).optional(),
		style_preset: z.string().optional(),
		extras: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

const ListEnginesInputSchema = z.object({}).loose();

const UserAccountInputSchema = z.object({}).loose();

export const DreamstudioEndpointInputSchemas = {
	userBalance: UserBalanceInputSchema,
	generateImageFromImage: GenerateImageFromImageInputSchema,
	listEngines: ListEnginesInputSchema,
	userAccount: UserAccountInputSchema,
} as const;

export type DreamstudioEndpointInputs = {
	[K in keyof typeof DreamstudioEndpointInputSchemas]: z.infer<
		(typeof DreamstudioEndpointInputSchemas)[K]
	>;
};

const UserBalanceResponseSchema = z
	.object({
		credits: z.number(),
	})
	.loose();

const GeneratedArtifactSchema = z
	.object({
		base64: z.string().optional(),
		finishReason: z.string().optional(),
		seed: z.number().optional(),
	})
	.loose();

const GenerateImageFromImageResponseSchema = z
	.object({
		artifacts: z.array(GeneratedArtifactSchema).optional(),
	})
	.loose();

const EngineSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().optional(),
		type: z.string().optional(),
	})
	.loose();

const ListEnginesResponseSchema = z.array(EngineSchema);

const OrganizationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		role: z.string().optional(),
		is_default: z.boolean().optional(),
	})
	.loose();

const UserAccountResponseSchema = z
	.object({
		email: z.string().optional(),
		id: z.string().optional(),
		organizations: z.array(OrganizationSchema).optional(),
		profile_picture: z.string().optional(),
	})
	.loose();

export const DreamstudioEndpointOutputSchemas = {
	userBalance: UserBalanceResponseSchema,
	generateImageFromImage: GenerateImageFromImageResponseSchema,
	listEngines: ListEnginesResponseSchema,
	userAccount: UserAccountResponseSchema,
} as const;

export type DreamstudioEndpointOutputs = {
	[K in keyof typeof DreamstudioEndpointOutputSchemas]: z.infer<
		(typeof DreamstudioEndpointOutputSchemas)[K]
	>;
};
