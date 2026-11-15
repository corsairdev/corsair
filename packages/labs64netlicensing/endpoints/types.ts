import { z } from 'zod';

export const ListInputSchema = z.object({
	filter: z.string().min(1).optional(),
});

export const LicenseSchema = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
});

export const ProductSchema = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
	name: z.string().optional(),
	version: z.string().optional(),
});

export const ListLicensesResponseSchema = z.object({
	licenses: z.array(LicenseSchema),
});

export const ListProductsResponseSchema = z.object({
	products: z.array(ProductSchema),
});

export type ListInput = z.infer<typeof ListInputSchema>;
export type ListLicensesResponse = z.infer<typeof ListLicensesResponseSchema>;
export type ListProductsResponse = z.infer<typeof ListProductsResponseSchema>;

export const NetLicensingEndpointInputSchemas = {
	'licenses.list': ListInputSchema,
	'products.list': ListInputSchema,
};

export const NetLicensingEndpointOutputSchemas = {
	'licenses.list': ListLicensesResponseSchema,
	'products.list': ListProductsResponseSchema,
};
