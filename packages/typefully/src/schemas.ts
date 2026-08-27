import { z } from '../../../node_modules/zod';

export const TypefullyAuthSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
});

export const CreateDraftSchema = z.object({
  text: z.string().min(1),
  threadify: z.boolean().optional(),
  schedule_date: z.string().optional(),
});
