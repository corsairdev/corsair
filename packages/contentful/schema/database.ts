import { z } from 'zod';

export const ContentfulSpace = z.object({
	id: z.string(),
	name: z.string(),
	organization_id: z.string().optional(),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});
export type ContentfulSpace = z.infer<typeof ContentfulSpace>;
