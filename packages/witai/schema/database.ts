import { z } from 'zod';

/**
 * Wit.ai Database Entities Schema Definitions.
 *
 * Schemas mirror the official Wit.ai HTTP API resources for natural language understanding,
 * speech synthesis, and application management.
 *
 * @see https://wit.ai/docs/http/20240304
 */

/**
 * Wit.ai Entity Role reference.
 *
 * Roles differentiate multiple entities of the same type within utterances
 * (e.g. `location:from` vs `location:to`).
 */
export const WitAiRole = z
	.object({
		id: z.string().optional(),
		name: z.string(),
	})
	.catchall(z.unknown());
export type WitAiRole = z.infer<typeof WitAiRole>;

/**
 * Wit.ai Keyword with optional synonyms.
 *
 * Used for keyword lookup strategy on entities.
 */
export const WitAiKeyword = z
	.object({
		keyword: z.string(),
		synonyms: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());
export type WitAiKeyword = z.infer<typeof WitAiKeyword>;

/**
 * Wit.ai Entity Annotation Reference within utterances and message predictions.
 */
export const WitAiEntityRef = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		role: z.string().optional(),
		start: z.number().optional(),
		end: z.number().optional(),
		body: z.string().optional(),
		confidence: z.number().optional(),
		entities: z.array(z.unknown()).optional(),
		value: z.unknown().optional(),
		type: z.string().optional(),
	})
	.catchall(z.unknown());
export type WitAiEntityRef = z.infer<typeof WitAiEntityRef>;

/**
 * Wit.ai Trait Value definition.
 */
export const WitAiTraitValue = z
	.object({
		id: z.string().optional(),
		value: z.string(),
	})
	.catchall(z.unknown());
export type WitAiTraitValue = z.infer<typeof WitAiTraitValue>;

/**
 * Wit.ai Trait Reference within predictions and training samples.
 */
export const WitAiTraitRef = z
	.object({
		id: z.string().optional(),
		value: z.string(),
		confidence: z.number().optional(),
	})
	.catchall(z.unknown());
export type WitAiTraitRef = z.infer<typeof WitAiTraitRef>;

/**
 * Wit.ai Voice Style parameter definition for Text-to-Speech voices.
 */
export const WitAiVoiceStyle = z
	.object({
		name: z.string(),
		speed: z.array(z.string()).optional(),
		pitch: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());
export type WitAiVoiceStyle = z.infer<typeof WitAiVoiceStyle>;

/**
 * Wit.ai App Entity (`GET /apps`, `GET /apps/{app_id}`).
 *
 * Represents an NLP application containing trained models, intents, entities, and settings.
 *
 * @see https://wit.ai/docs/http/20240304#apps
 */
export const WitAiApp = z
	.object({
		id: z.string(),
		name: z.string(),
		lang: z.string().optional(),
		private: z.union([z.boolean(), z.string()]).optional(),
		timezone: z.string().optional(),
		desc: z.string().optional(),
		will_train_at: z.string().nullable().optional(),
		last_trained_at: z.string().nullable().optional(),
		last_training_duration_secs: z.number().optional(),
		training_status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.catchall(z.unknown());
export type WitAiApp = z.infer<typeof WitAiApp>;

/**
 * Wit.ai Intent Entity (`GET /intents`, `GET /intents/{intent}`).
 *
 * Represents a user goal or intention extracted from natural language utterances.
 *
 * @see https://wit.ai/docs/http/20240304#intents
 */
export const WitAiIntent = z
	.object({
		id: z.string(),
		name: z.string(),
		entities: z.array(WitAiEntityRef).optional(),
	})
	.catchall(z.unknown());
export type WitAiIntent = z.infer<typeof WitAiIntent>;

/**
 * Wit.ai Entity definition (`GET /entities`, `GET /entities/{entity}`).
 *
 * Represents a concept or data extracted from message text.
 *
 * @see https://wit.ai/docs/http/20240304#entities
 */
export const WitAiEntity = z
	.object({
		id: z.string(),
		name: z.string(),
		roles: z.array(WitAiRole).optional(),
		lookups: z.array(z.string()).optional(),
		keywords: z.array(WitAiKeyword).optional(),
	})
	.catchall(z.unknown());
export type WitAiEntity = z.infer<typeof WitAiEntity>;

/**
 * Wit.ai Trait definition (`GET /traits`, `GET /traits/{trait}`).
 *
 * Traits represent whole-message attributes (e.g. sentiment, politeness) rather than span-level entities.
 *
 * @see https://wit.ai/docs/http/20240304#traits
 */
export const WitAiTrait = z
	.object({
		id: z.string(),
		name: z.string(),
		values: z.array(WitAiTraitValue).optional(),
	})
	.catchall(z.unknown());
export type WitAiTrait = z.infer<typeof WitAiTrait>;

/**
 * Wit.ai Training Utterance Entity (`GET /utterances`).
 *
 * Labeled training samples with annotations (intents, entities, traits).
 *
 * @see https://wit.ai/docs/http/20240304#utterances
 */
export const WitAiUtterance = z
	.object({
		id: z.string().optional(),
		text: z.string(),
		intent: z
			.object({ id: z.string().optional(), name: z.string() })
			.nullable()
			.optional(),
		entities: z.array(WitAiEntityRef).optional(),
		traits: z.array(WitAiTraitRef).optional(),
	})
	.catchall(z.unknown());
export type WitAiUtterance = z.infer<typeof WitAiUtterance>;

/**
 * Wit.ai TTS Voice Entity (`GET /voices`, `GET /voices/{voice}`).
 *
 * Text-to-speech synthesized voice options and style controls.
 *
 * @see https://wit.ai/docs/http/20240304#voices
 */
export const WitAiVoice = z
	.object({
		name: z.string(),
		locale: z.string().optional(),
		gender: z.string().optional(),
		styles: z.array(WitAiVoiceStyle).optional(),
		supported_features: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());
export type WitAiVoice = z.infer<typeof WitAiVoice>;

/**
 * Wit.ai App Tag Entity (`GET /apps/{app_id}/tags`).
 *
 * Version snapshot of a Wit.ai application.
 *
 * @see https://wit.ai/docs/http/20240304#tags
 */
export const WitAiTag = z
	.object({
		id: z.string(),
		name: z.string(),
		desc: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.catchall(z.unknown());
export type WitAiTag = z.infer<typeof WitAiTag>;
