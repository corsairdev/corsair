import { z } from 'zod';

export const ZohoInventoryOrganizationEntity = z
	.object({
		id: z.string(),
		organization_id: z.string(),
		name: z.string(),
		is_default_org: z.boolean().optional(),
		created_at: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export type ZohoInventoryOrganizationEntity = z.infer<
	typeof ZohoInventoryOrganizationEntity
>;
