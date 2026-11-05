import { z } from 'zod';

export const WriterEntities = z.object({});

export type WriterEntities = z.infer<typeof WriterEntities>;
