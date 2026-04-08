import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	corsair_integrations: defineTable({
		id: v.string(),
		created_at: v.float64(),
		updated_at: v.float64(),
		name: v.string(),
		config: v.any(),
		dek: v.optional(v.union(v.string(), v.null())),
	})
		.index('by_id', ['id'])
		.index('by_name', ['name']),

	corsair_accounts: defineTable({
		id: v.string(),
		created_at: v.float64(),
		updated_at: v.float64(),
		tenant_id: v.string(),
		integration_id: v.string(),
		config: v.any(),
		dek: v.optional(v.union(v.string(), v.null())),
	})
		.index('by_id', ['id'])
		.index('by_tenant_integration', ['tenant_id', 'integration_id']),

	corsair_entities: defineTable({
		id: v.string(),
		created_at: v.float64(),
		updated_at: v.float64(),
		account_id: v.string(),
		entity_id: v.string(),
		entity_type: v.string(),
		version: v.string(),
		data: v.any(),
	})
		.index('by_id', ['id'])
		.index('by_account_type_entity', ['account_id', 'entity_type', 'entity_id'])
		.index('by_account_type', ['account_id', 'entity_type']),

	corsair_events: defineTable({
		id: v.string(),
		created_at: v.float64(),
		updated_at: v.float64(),
		account_id: v.string(),
		event_type: v.string(),
		payload: v.any(),
		status: v.optional(v.string()),
	})
		.index('by_id', ['id'])
		.index('by_account', ['account_id'])
		.index('by_status', ['status']),

	corsair_permissions: defineTable({
		id: v.string(),
		created_at: v.float64(),
		updated_at: v.float64(),
		token: v.string(),
		plugin: v.string(),
		endpoint: v.string(),
		args: v.string(),
		tenant_id: v.string(),
		status: v.string(),
		expires_at: v.string(),
		error: v.optional(v.union(v.string(), v.null())),
	})
		.index('by_id', ['id'])
		.index('by_token', ['token'])
		.index('by_plugin_endpoint_tenant', ['plugin', 'endpoint', 'tenant_id']),
});
