import { z } from 'zod';

/**
 * Vestaboard character grid: 6 rows × 22 columns.
 * Official: https://docs.vestaboard.com/docs/characterCodes
 * Codes 0–71 (0 blank … 71 filled).
 */
export const VestaboardCharacters = z
	.array(z.array(z.number().int().min(0).max(71)).length(22))
	.length(6);

export type VestaboardCharacters = z.infer<typeof VestaboardCharacters>;

/**
 * Subscription API list item.
 * Official: GET https://subscriptions.vestaboard.com/subscriptions
 * https://docs.vestaboard.com/docs/subscription-api/endpoints
 */
export const VestaboardSubscription = z
	.object({
		id: z.string(),
		boardId: z.string(),
	})
	.loose();

export type VestaboardSubscription = z.infer<typeof VestaboardSubscription>;

/**
 * Subscription API send-message response.
 * Official: POST /subscriptions/{id}/message
 * https://docs.vestaboard.com/docs/subscription-api/endpoints
 */
export const VestaboardMessage = z
	.object({
		id: z.string(),
		text: z.string(),
		created: z.string(),
		muted: z.boolean(),
	})
	.loose();

export type VestaboardMessage = z.infer<typeof VestaboardMessage>;
