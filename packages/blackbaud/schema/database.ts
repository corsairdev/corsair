import { z } from 'zod';

// Local persistence decision: all Blackbaud endpoints are live reads/writes
// against the SKY API (Raiser's Edge NXT gifts/membership, SKY Payments,
// OneRoster discovery). No entities are cached locally, so no tables are
// declared here. Revisit if offline access or sync is ever required.
export const BlackbaudStoredEntities = z.object({});

export type BlackbaudStoredEntities = z.infer<typeof BlackbaudStoredEntities>;
