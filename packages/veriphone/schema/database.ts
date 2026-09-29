import { z } from 'zod';

// Veriphone is a pull-based phone-validation API with no local persistence:
// verification results are fetched live (GET /v3/verify) and account state
// (credits, coverage) is read live. No database entities are stored.
export const VeriphoneEntities = z.object({});

export type VeriphoneEntities = z.infer<typeof VeriphoneEntities>;
