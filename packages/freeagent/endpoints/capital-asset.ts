import { z } from 'zod';

/**
 * Write form of `capital_asset` on a bill item, expense or bank explanation
 * that records an asset purchase: a depreciation profile. Reads return the
 * asset's URL instead. The legacy `depreciation_schedule`/`asset_life_years`
 * fields only cover straight-line depreciation over 2-7 years.
 */
export const CapitalAssetWrite = z
	.object({
		depreciation_profile: z
			.object({
				method: z.enum([
					'straight_line',
					'reducing_balance',
					'no_depreciation',
				]),
				frequency: z.string().optional(),
				asset_life_years: z.number().int().min(2).max(25).optional(),
				annual_depreciation_percentage: z.number().min(1).max(99).optional(),
			})
			.strict()
			.superRefine((profile, context) => {
				if (
					profile.method === 'straight_line' &&
					profile.asset_life_years === undefined
				) {
					context.addIssue({
						code: 'custom',
						message: 'straight_line depreciation needs asset_life_years (2-25)',
						path: ['asset_life_years'],
					});
				}
				if (
					profile.method === 'reducing_balance' &&
					profile.annual_depreciation_percentage === undefined
				) {
					context.addIssue({
						code: 'custom',
						message:
							'reducing_balance depreciation needs annual_depreciation_percentage (1-99)',
						path: ['annual_depreciation_percentage'],
					});
				}
			}),
	})
	.strict();
