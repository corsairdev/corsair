import { z } from 'zod';

/** One reporting total. https://docs.ecologi.com/ trees, carbon-offset, carbon-removal, habitat-restoration */
export const EcologiTotalEntity = z.object({
	id: z.string().min(1),
	total: z.number(),
	pending: z.number(),
});

/** Combined impact. https://docs.ecologi.com/ GET /users/{username}/impact */
export const EcologiImpactEntity = z.object({
	id: z.string().min(1),
	trees: z.number(),
	carbonOffset: z.number(),
	carbonRemoval: z.number(),
	habitatRestoration: z.number(),
	pendingTrees: z.number(),
	pendingCarbonOffset: z.number(),
	pendingCarbonRemoval: z.number(),
	pendingHabitatRestoration: z.number(),
});

export type EcologiTotalEntity = z.infer<typeof EcologiTotalEntity>;
export type EcologiImpactEntity = z.infer<typeof EcologiImpactEntity>;
