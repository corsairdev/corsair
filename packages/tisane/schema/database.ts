import { z } from 'zod';

export const TisaneSentimentAspect = z.object({
	aspect: z.string().optional(),
	polarity: z.enum(['positive', 'negative', 'neutral', 'mixed']).optional(),
	score: z.number().optional(),
	text_index: z.array(z.number()).optional(),
	text: z.string().optional(),
});
export type TisaneSentimentAspect = z.infer<typeof TisaneSentimentAspect>;

export const TisaneAbuseDetection = z.object({
	type: z.string(),
	severity: z.string().optional(),
	text: z.string().optional(),
	confidence: z.number().optional(),
});
export type TisaneAbuseDetection = z.infer<typeof TisaneAbuseDetection>;

export const TisaneEntity = z.object({
	name: z.string(),
	type: z.string().optional(),
	score: z.number().optional(),
	salience: z.number().optional(),
});
export type TisaneEntity = z.infer<typeof TisaneEntity>;

export const TisaneTopic = z.object({
	topic: z.string(),
	score: z.number().optional(),
});
export type TisaneTopic = z.infer<typeof TisaneTopic>;

export const TisaneParseResult = z.object({
	text: z.string().optional(),
	language: z.string().optional(),
	sentiment: z.array(TisaneSentimentAspect).optional(),
	abuse: z.array(TisaneAbuseDetection).optional(),
	entities: z.array(TisaneEntity).optional(),
	topics: z.array(TisaneTopic).optional(),
});
export type TisaneParseResult = z.infer<typeof TisaneParseResult>;
