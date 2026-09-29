import { z } from 'zod';

// The Customer.io plugin is a live-read/write API wrapper with no local
// persistence: every endpoint calls the App, Track or CDP API directly and
// returns the provider response. There are intentionally no database entities.
export const CustomerioDatabaseEntities = z.object({});

export type CustomerioDatabaseEntities = z.infer<
	typeof CustomerioDatabaseEntities
>;
