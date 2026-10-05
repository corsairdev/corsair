import { z } from 'zod';

// TinyPNG is a stateless image-compression API with no local persistence.
export const TinypngEntities = z.object({});

export type TinypngEntities = z.infer<typeof TinypngEntities>;
