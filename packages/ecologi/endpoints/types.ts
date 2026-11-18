import { z } from 'zod';
import { EcologiImpactEntity, EcologiTotalEntity } from '../schema/database';

export const UsernameInputSchema = z.object({
	username: z
		.string()
		.min(1)
		.regex(/^[^/?#\s]+$/, 'username cannot contain spaces or URL separators'),
});

export const TotalResponseSchema = z.object({
	total: EcologiTotalEntity,
});

export const ImpactResponseSchema = z.object({
	impact: EcologiImpactEntity,
});

// ── Impact API purchases ────────────────────────────────────────────────────

const PurchaseShape = {
	name: z
		.string()
		.min(1)
		.optional()
		.describe(
			'"Funded by" label on the Ecologi profile. Public if the profile is public; never send a customer name without permission.',
		),
	test: z
		.boolean()
		.optional()
		.describe(
			'true returns the expected response without charging or adding it to the profile.',
		),
	recipientEmail: z
		.string()
		.email()
		.optional()
		.describe(
			'Sends this address a templated email about the purchase (not in test mode).',
		),
	idempotencyKey: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Sent as the Idempotency-Key header so a retried request is not bought twice.',
		),
};

export const PurchaseTreesInputSchema = z.object({
	number: z
		.number()
		.int()
		.min(1)
		.max(250_000)
		.describe('Trees to buy, 1 to 250,000.'),
	...PurchaseShape,
});

export const PurchaseLocalTreesInputSchema = z.object({
	number: z.number().int().min(1).describe('Trees to buy.'),
	country: z
		.enum(['UK', 'US', 'AU', 'BR'])
		.describe('Where the trees are planted.'),
	...PurchaseShape,
});

export const PurchaseCarbonInputSchema = z
	.object({
		number: z
			.number()
			.positive()
			.describe('Amount to buy, at least 1 kg (0.001 tonnes).'),
		units: z.enum(['KG', 'Tonnes']),
		...PurchaseShape,
	})
	.refine((value) => value.number >= (value.units === 'KG' ? 1 : 0.001), {
		message: 'The minimum is 1 kg (0.001 tonnes).',
		path: ['number'],
	});

export const PurchaseCarbonRemovalInputSchema = z.object({
	number: z
		.number()
		.min(1)
		.describe('Kilograms of carbon removal, at least 1.'),
	...PurchaseShape,
});

export const PurchaseHabitatInputSchema = z.object({
	number: z
		.number()
		.min(0.1)
		.refine((value) => Math.abs(value * 10 - Math.round(value * 10)) < 1e-9, {
			message: 'Use at most one decimal place, e.g. 5.5.',
		})
		.describe('Square metres to restore, at least 0.1, one decimal place.'),
	...PurchaseShape,
});

/** Responses differ a little by type (treeUrl vs tileUrl, split fields), so all are optional. */
export const PurchaseResponseSchema = z
	.object({
		amount: z.number().optional(),
		currency: z.string().optional(),
		number: z.number().optional(),
		units: z.string().optional(),
		numberInTonnes: z.number().optional(),
		treeUrl: z.string().optional(),
		tileUrl: z.string().optional(),
		name: z.string().nullable().optional(),
		recipientEmail: z.string().optional(),
		projectDetails: z
			.array(
				z
					.object({
						name: z.string().optional(),
						projectUrl: z.string().optional(),
						splitPercentage: z.number().optional(),
						splitAmountTrees: z.number().optional(),
						splitAmountTonnes: z.number().optional(),
						quantity: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

export type PurchaseTreesInput = z.infer<typeof PurchaseTreesInputSchema>;
export type PurchaseLocalTreesInput = z.infer<
	typeof PurchaseLocalTreesInputSchema
>;
export type PurchaseCarbonInput = z.infer<typeof PurchaseCarbonInputSchema>;
export type PurchaseCarbonRemovalInput = z.infer<
	typeof PurchaseCarbonRemovalInputSchema
>;
export type PurchaseHabitatInput = z.infer<typeof PurchaseHabitatInputSchema>;
export type PurchaseResponse = z.infer<typeof PurchaseResponseSchema>;

export type UsernameInput = z.infer<typeof UsernameInputSchema>;
export type TotalResponse = z.infer<typeof TotalResponseSchema>;
export type ImpactResponse = z.infer<typeof ImpactResponseSchema>;

export const EcologiEndpointInputSchemas = {
	'trees.get': UsernameInputSchema,
	'carbonOffsets.get': UsernameInputSchema,
	'carbonRemovals.get': UsernameInputSchema,
	'habitats.get': UsernameInputSchema,
	'impacts.get': UsernameInputSchema,
	'trees.purchase': PurchaseTreesInputSchema,
	'trees.purchaseLocal': PurchaseLocalTreesInputSchema,
	'carbonOffsets.purchase': PurchaseCarbonInputSchema,
	'carbonRemovals.purchase': PurchaseCarbonRemovalInputSchema,
	'habitats.purchase': PurchaseHabitatInputSchema,
};

export const EcologiEndpointOutputSchemas = {
	'trees.get': TotalResponseSchema,
	'carbonOffsets.get': TotalResponseSchema,
	'carbonRemovals.get': TotalResponseSchema,
	'habitats.get': TotalResponseSchema,
	'impacts.get': ImpactResponseSchema,
	'trees.purchase': PurchaseResponseSchema,
	'trees.purchaseLocal': PurchaseResponseSchema,
	'carbonOffsets.purchase': PurchaseResponseSchema,
	'carbonRemovals.purchase': PurchaseResponseSchema,
	'habitats.purchase': PurchaseResponseSchema,
};
