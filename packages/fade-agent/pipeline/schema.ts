import { z } from 'zod';

export const EffectConfigSchema = z.object({
	name: z.string(),
	params: z.record(z.string(), z.unknown()).default({}),
	fromFrame: z.number().int().default(0),
	toFrame: z.number().int().default(30),
});

export const BrollConfigSchema = z.object({
	type: z.enum(['video', 'image', 'none']),
	searchQuery: z.string().default(''),
	generatePrompt: z.string().default(''),
	fromFrame: z.number().int().default(0),
	toFrame: z.number().int().default(150),
	track: z.number().int().default(0),
	effects: z.array(EffectConfigSchema).default([]),
});

export const TitleConfigSchema = z.object({
	textContent: z.string(),
	fontSize: z.number().default(52),
	dropShadow: z.boolean().default(true),
	bold: z.boolean().default(true),
	color: z.string().default('#FFFFFF'),
	backgroundEnabled: z.boolean().default(true),
	backgroundColor: z.string().default('#00000088'),
	fromFrame: z.number().int().default(0),
	toFrame: z.number().int().default(150),
	track: z.number().int().default(1),
});

export const LowerThirdConfigSchema = z.object({
	textContent: z.string(),
	fontSize: z.number().default(28),
	color: z.string().default('#FFDD00'),
	backgroundEnabled: z.boolean().default(true),
	backgroundColor: z.string().default('#000000CC'),
	fromFrame: z.number().int().default(0),
	toFrame: z.number().int().default(90),
	track: z.number().int().default(2),
});

export const SceneSchema = z.object({
	id: z.number().int(),
	headline: z.string(),
	summary: z.string(),
	fromFrame: z.number().int(),
	toFrame: z.number().int(),
	broll: BrollConfigSchema,
	title: TitleConfigSchema,
	lowerThird: LowerThirdConfigSchema.nullable().default(null),
});

export const ScenePlanSchema = z.object({
	query: z.string(),
	totalScenes: z.number().int(),
	fps: z.number().default(30),
	totalFrames: z.number().int(),
	scenes: z.array(SceneSchema),
});

export type EffectConfig = z.infer<typeof EffectConfigSchema>;
export type BrollConfig = z.infer<typeof BrollConfigSchema>;
export type TitleConfig = z.infer<typeof TitleConfigSchema>;
export type LowerThirdConfig = z.infer<typeof LowerThirdConfigSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type ScenePlan = z.infer<typeof ScenePlanSchema>;
