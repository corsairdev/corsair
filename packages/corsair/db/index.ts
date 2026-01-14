import { z } from 'zod';

export const CorsairProvidersSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	name: z.string(),
	config: z.record(z.unknown()),
});

export const CorsairConnectionsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	tenant_id: z.string(),
	connection_id: z.string(),

	config: z.record(z.unknown()),
});

export const CorsairResourcesSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	tenant_id: z.string(),

	resource_id: z.string(),
	resource: z.string(),
	service: z.string(),

	version: z.string(),

	data: z.record(z.unknown()),
});

export const CorsairEventsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	tenant_id: z.string(),
	event_type: z.string(),

	payload: z.record(z.unknown()),

	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type CorsairProvider = z.infer<typeof CorsairProvidersSchema>;
export type CorsairResource = z.infer<typeof CorsairResourcesSchema>;
export type CorsairConnection = z.infer<typeof CorsairConnectionsSchema>;
export type CorsairEvent = z.infer<typeof CorsairEventsSchema>;
