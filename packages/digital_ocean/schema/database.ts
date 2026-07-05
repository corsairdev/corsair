import { z } from 'zod';

export const DigitalOceanDroplet = z.object({
	id: z.union([z.string(), z.number()]).optional(),
	name: z.string().optional(),
	status: z.string().optional(),
	region: z.unknown().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const DigitalOceanVolume = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	size_gigabytes: z.number().optional(),
	region: z.unknown().optional(),
});

export const DigitalOceanDatabaseCluster = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	engine: z.string().optional(),
	status: z.string().optional(),
});

export type DigitalOceanDroplet = z.infer<typeof DigitalOceanDroplet>;
export type DigitalOceanVolume = z.infer<typeof DigitalOceanVolume>;
export type DigitalOceanDatabaseCluster = z.infer<typeof DigitalOceanDatabaseCluster>;
