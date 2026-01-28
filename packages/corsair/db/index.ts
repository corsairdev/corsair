import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Integrations
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairIntegrationsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	name: z.string(),
	config: z.record(z.unknown()),
	dek: z.string().optional(),
});

export type CorsairIntegration = z.infer<typeof CorsairIntegrationsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Accounts
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairAccountsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	tenant_id: z.string(),
	// references integrations.id
	integration_id: z.string(),

	config: z.record(z.unknown()),
	dek: z.string().optional(),
});

export type CorsairAccount = z.infer<typeof CorsairAccountsSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Entities
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEntitiesSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),

	entity_id: z.string(),
	entity_type: z.string(),

	version: z.string(),

	data: z.record(z.unknown()),
});

export type CorsairEntity = z.infer<typeof CorsairEntitiesSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Corsair Events
// ─────────────────────────────────────────────────────────────────────────────

export const CorsairEventsSchema = z.object({
	id: z.string(),
	created_at: z.date(),
	updated_at: z.date(),

	// references accounts.id (which provides tenant scoping)
	account_id: z.string(),
	event_type: z.string(),

	payload: z.record(z.unknown()),

	status: z.enum(['pending', 'processing', 'completed', 'failed']).optional(),
});

export type CorsairEvent = z.infer<typeof CorsairEventsSchema>;
