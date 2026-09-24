import { z } from 'zod';

const ItemSchema = z.object({}).loose();
const PaginatedSchema = z.object({
	items: z.array(ItemSchema),
	meta: z.object({ count: z.number(), page: z.number(), last: z.number() }),
});
const PageInputSchema = z.object({
	page: z.number().int().positive().optional(),
});

export const DaffyEndpointInputSchemas = {
	createGift: z.object({
		name: z.string().trim().min(1),
		amount: z.number().min(18),
	}),
	getBalance: z.object({}),
	getContributions: PageInputSchema,
	getDonations: PageInputSchema,
	getGiftByCode: z.object({ code: z.string().uuid() }),
	getGifts: PageInputSchema,
	getNonProfitByEin2: z.object({ ein: z.string().trim().min(1) }),
	getUserCauses: z.object({ userId: z.number().int().positive() }),
	getUserDonations: PageInputSchema.extend({
		userId: z.number().int().positive(),
	}),
	getUserProfile: z.object({}),
	getUserByUsername: z.object({ username: z.string().trim().min(1) }),
	searchNonProfits: PageInputSchema.extend({
		causeId: z.number().int().positive().optional(),
		query: z.string().trim().min(1).optional(),
	}),
} as const;

export const DaffyEndpointOutputSchemas = {
	createGift: ItemSchema,
	getBalance: z.object({
		amount: z.number(),
		pending_deposit_balance: z.number(),
		portfolio_balance: z.number(),
		available_balance: z.number(),
	}),
	getContributions: PaginatedSchema,
	getDonations: PaginatedSchema,
	getGiftByCode: ItemSchema,
	getGifts: PaginatedSchema,
	getNonProfitByEin2: ItemSchema,
	getUserCauses: z.array(ItemSchema),
	getUserDonations: PaginatedSchema,
	getUserProfile: ItemSchema,
	getUserByUsername: ItemSchema,
	searchNonProfits: PaginatedSchema,
} as const;

export type DaffyEndpointInputs = {
	[K in keyof typeof DaffyEndpointInputSchemas]: z.infer<
		(typeof DaffyEndpointInputSchemas)[K]
	>;
};
export type DaffyEndpointOutputs = {
	[K in keyof typeof DaffyEndpointOutputSchemas]: z.infer<
		(typeof DaffyEndpointOutputSchemas)[K]
	>;
};
