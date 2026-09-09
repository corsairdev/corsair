import { z } from 'zod';
import {
	DreamstudioAccount,
	DreamstudioBalance,
	DreamstudioEngine,
	DreamstudioImage,
} from '../schema';

export const UserBalanceInputSchema = z.object({});
export type UserBalanceInput = z.infer<typeof UserBalanceInputSchema>;

export const UserBalanceOutputSchema = DreamstudioBalance;
export type UserBalanceOutput = z.infer<typeof UserBalanceOutputSchema>;

export const UserAccountInputSchema = z.object({});
export type UserAccountInput = z.infer<typeof UserAccountInputSchema>;

export const UserAccountOutputSchema = DreamstudioAccount;
export type UserAccountOutput = z.infer<typeof UserAccountOutputSchema>;

export const ListEnginesInputSchema = z.object({});
export type ListEnginesInput = z.infer<typeof ListEnginesInputSchema>;

export const ListEnginesOutputSchema = z.object({
	engines: z.array(DreamstudioEngine),
});
export type ListEnginesOutput = z.infer<typeof ListEnginesOutputSchema>;

export const TextPromptSchema = z.object({
	text: z.string().min(1).max(2000),
	weight: z.number().optional(),
});

export const GenerateImageFromImageInputSchema = z.object({
	engine_id: z.string().min(1).describe('Engine id from GET /v1/engines/list'),
	init_image: z.string().min(1).describe('Init image as base64 or a data URL'),
	text_prompts: z.array(TextPromptSchema).min(1),
	init_image_mode: z
		.enum(['IMAGE_STRENGTH', 'STEP_SCHEDULE'])
		.default('IMAGE_STRENGTH'),
	image_strength: z.number().min(0).max(1).optional(),
	step_schedule_start: z.number().min(0).max(1).optional(),
	step_schedule_end: z.number().min(0).max(1).optional(),
	cfg_scale: z.number().min(0).max(35).optional(),
	clip_guidance_preset: z
		.enum([
			'FAST_BLUE',
			'FAST_GREEN',
			'NONE',
			'SIMPLE',
			'SLOW',
			'SLOWER',
			'SLOWEST',
		])
		.optional(),
	sampler: z
		.enum([
			'DDIM',
			'DDPM',
			'K_DPMPP_2M',
			'K_DPMPP_2S_ANCESTRAL',
			'K_DPM_2',
			'K_DPM_2_ANCESTRAL',
			'K_EULER',
			'K_EULER_ANCESTRAL',
			'K_HEUN',
			'K_LMS',
		])
		.optional(),
	samples: z.number().int().min(1).max(10).optional(),
	steps: z.number().int().min(10).max(50).optional(),
	seed: z.number().int().min(0).max(4294967295).optional(),
	style_preset: z
		.enum([
			'3d-model',
			'analog-film',
			'anime',
			'cinematic',
			'comic-book',
			'digital-art',
			'enhance',
			'fantasy-art',
			'isometric',
			'line-art',
			'low-poly',
			'modeling-compound',
			'neon-punk',
			'origami',
			'photographic',
			'pixel-art',
			'tile-texture',
		])
		.optional(),
});
export type GenerateImageFromImageInput = z.infer<
	typeof GenerateImageFromImageInputSchema
>;

export const GenerateImageFromImageOutputSchema = z.object({
	artifacts: z.array(DreamstudioImage),
});
export type GenerateImageFromImageOutput = z.infer<
	typeof GenerateImageFromImageOutputSchema
>;

export const DreamstudioEndpointInputSchemas = {
	userBalance: UserBalanceInputSchema,
	userAccount: UserAccountInputSchema,
	listEngines: ListEnginesInputSchema,
	generateImageFromImage: GenerateImageFromImageInputSchema,
} as const;

export const DreamstudioEndpointOutputSchemas = {
	userBalance: UserBalanceOutputSchema,
	userAccount: UserAccountOutputSchema,
	listEngines: ListEnginesOutputSchema,
	generateImageFromImage: GenerateImageFromImageOutputSchema,
} as const;

export type DreamstudioEndpointInputs = {
	[K in keyof typeof DreamstudioEndpointInputSchemas]: z.infer<
		(typeof DreamstudioEndpointInputSchemas)[K]
	>;
};

export type DreamstudioEndpointOutputs = {
	[K in keyof typeof DreamstudioEndpointOutputSchemas]: z.infer<
		(typeof DreamstudioEndpointOutputSchemas)[K]
	>;
};
