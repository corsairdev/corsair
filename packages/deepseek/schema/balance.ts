import { z } from 'zod';

export const GetUserBalanceInputSchema = z.object({});
export type GetUserBalanceInput = z.infer<typeof GetUserBalanceInputSchema>;

const BalanceInfoSchema = z.object({
	currency: z.enum(['CNY', 'USD']),
	total_balance: z.string(),
	granted_balance: z.string(),
	topped_up_balance: z.string(),
});
export type BalanceInfo = z.infer<typeof BalanceInfoSchema>;

export const GetUserBalanceResponseSchema = z.object({
	is_available: z.boolean(),
	balance_infos: z.array(BalanceInfoSchema),
});
export type GetUserBalanceResponse = z.infer<
	typeof GetUserBalanceResponseSchema
>;
