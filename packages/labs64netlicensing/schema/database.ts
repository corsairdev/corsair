import { z } from 'zod';

/** License list item. https://netlicensing.io/wiki/license-services number and active. */
export const NetLicensingLicenseEntity = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
});

export type NetLicensingLicenseEntity = z.infer<
	typeof NetLicensingLicenseEntity
>;

/** Product list item. https://netlicensing.io/wiki/product-services */
export const NetLicensingProductEntity = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
	name: z.string().optional(),
	version: z.string().optional(),
});

export type NetLicensingProductEntity = z.infer<
	typeof NetLicensingProductEntity
>;
