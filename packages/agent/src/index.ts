// ─────────────────────────────────────────────────────────────────────────────
// @corsair-dev/agent — Public API
// ─────────────────────────────────────────────────────────────────────────────

export type { CorsairAgent } from './agent.js';
// Main factory
export { createCorsairAgent } from './agent.js';
// Executor utilities
export { resumeInstance, startJobInstance } from './executor/run-instance.js';
// MCP server (runs a complete stdio server with corsair + agent_chat tools)
export { runAgentStdioMcpServer } from './mcp/server.js';
// MCP tool builder (for wiring into an existing MCP server)
export { buildAgentMcpTools } from './mcp/tools.js';
// Core types
export type {
	AgentHook,
	// DB entities
	AgentJob,
	AgentJobInstance,
	AgentToolRegistry,
	// Chat
	ChatResult,
	// Config
	CorsairAgentOptions,
	CronTrigger,
	HeartbeatTrigger,
	// Status enums
	HookStatus,
	InstanceStatus,
	JobStatus,
	// Triggers
	JobTrigger,
	LLMTierConfig,
	LLMTriggerFilter,
	RuleTriggerFilter,
	TriggerFilter,
	WebhookEventPayload,
	WebhookTrigger,
} from './types.js';
// Zod schemas (for consumers who want runtime validation)
export {
	CronTriggerSchema,
	HeartbeatTriggerSchema,
	JobTriggerSchema,
	LLMTriggerFilterSchema,
	RuleTriggerFilterSchema,
	TriggerFilterSchema,
	WebhookTriggerSchema,
} from './types.js';
