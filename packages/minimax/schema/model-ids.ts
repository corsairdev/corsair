import { z } from 'zod';

export const MiniMaxModelIdSchema = z.enum(['MiniMax-M3', 'MiniMax-M2.7']);
export type MiniMaxModelId = z.infer<typeof MiniMaxModelIdSchema>;