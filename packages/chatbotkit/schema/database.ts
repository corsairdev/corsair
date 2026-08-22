// This plugin doesn't mirror API responses into ctx.db (Bots list/get are
// read-only lookups); add entities here if a future endpoint needs caching.
// export const ChatbotkitExample = z.object({
// 	id: z.string(),
// 	name: z.string(),
// 	created_at: z.coerce.date().nullable().optional(),
// });
// export type ChatbotkitExample = z.infer<typeof ChatbotkitExample>;
