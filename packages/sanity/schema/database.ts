// Sanity content lives in the Content Lake, where documents.query reads it with
// GROQ (filters, joins, ordering) better than a local copy could, so nothing is
// mirrored locally.
export const sanityEntities = {} as const;
