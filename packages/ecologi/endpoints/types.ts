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

export type UsernameInput = z.infer<typeof UsernameInputSchema>;
export type TotalResponse = z.infer<typeof TotalResponseSchema>;
export type ImpactResponse = z.infer<typeof ImpactResponseSchema>;

export const EcologiEndpointInputSchemas = {
	'trees.get': UsernameInputSchema,
	'carbonOffsets.get': UsernameInputSchema,
	'carbonRemovals.get': UsernameInputSchema,
	'habitats.get': UsernameInputSchema,
	'impacts.get': UsernameInputSchema,
};

export const EcologiEndpointOutputSchemas = {
	'trees.get': TotalResponseSchema,
	'carbonOffsets.get': TotalResponseSchema,
	'carbonRemovals.get': TotalResponseSchema,
	'habitats.get': TotalResponseSchema,
	'impacts.get': ImpactResponseSchema,
};
