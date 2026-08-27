import { z } from 'zod';

/**
 * Vestaboard grid dimensions: 6 rows x 22 columns of character codes.
 */
export const VestaboardCharactersSchema = z.array(z.array(z.number().int().min(0).max(70)));

/**
 * Message Entity Schema
 */
export const VestaboardMessageEntity = z
	.object({
		id: z.string().optional(),
		text: z.string().optional(),
		layout: z.string().optional(),
		characters: VestaboardCharactersSchema.optional(),
		created: z.number().optional(),
		updated_at: z.number().optional(),
	})
	.loose();

export type VestaboardMessageEntity = z.infer<typeof VestaboardMessageEntity>;

/**
 * Subscription Entity Schema
 */
export const VestaboardSubscriptionEntity = z
	.object({
		_id: z.string(),
		_created: z.number().optional(),
		_user: z
			.object({
				_id: z.string(),
				username: z.string().optional(),
			})
			.loose()
			.optional(),
		installation: z
			.object({
				_id: z.string(),
				installable: z
					.object({
						_id: z.string().optional(),
						name: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type VestaboardSubscriptionEntity = z.infer<typeof VestaboardSubscriptionEntity>;

/**
 * Viewer Entity Schema
 */
export const VestaboardViewerEntity = z
	.object({
		_id: z.string(),
		type: z.string().optional(),
		installation: z
			.object({
				_id: z.string().optional(),
				installable: z
					.object({
						_id: z.string().optional(),
						name: z.string().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

export type VestaboardViewerEntity = z.infer<typeof VestaboardViewerEntity>;
