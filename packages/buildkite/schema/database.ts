import { z } from 'zod';

/**
 * Access token used for the current request.
 * Official: GET /v2/access-token
 * https://buildkite.com/docs/apis/rest-api/access-token
 */
export const BuildkiteAccessToken = z
	.object({
		uuid: z.string(),
		scopes: z.array(z.string()),
		description: z.string().nullable().optional(),
		created_at: z.string().optional(),
		expires_at: z.string().nullable().optional(),
		user: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export type BuildkiteAccessToken = z.infer<typeof BuildkiteAccessToken>;

/**
 * Buildkite API metadata (webhook egress CIDRs).
 * Official: GET /v2/meta
 * https://buildkite.com/docs/apis/rest-api/meta
 */
export const BuildkiteMeta = z
	.object({
		webhook_ips: z.array(z.string()),
	})
	.loose();

export type BuildkiteMeta = z.infer<typeof BuildkiteMeta>;

/**
 * User account that owns the API token.
 * Official: GET /v2/user
 * https://buildkite.com/docs/apis/rest-api/user
 */
export const BuildkiteUser = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		name: z.string(),
		email: z.string(),
		avatar_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type BuildkiteUser = z.infer<typeof BuildkiteUser>;

/**
 * Organization accessible to the token.
 * Official: GET /v2/organizations
 * https://buildkite.com/docs/apis/rest-api/organizations
 */
export const BuildkiteOrganization = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		url: z.string().optional(),
		web_url: z.string().optional(),
		name: z.string(),
		slug: z.string(),
		pipelines_url: z.string().optional(),
		agents_url: z.string().optional(),
		emojis_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type BuildkiteOrganization = z.infer<typeof BuildkiteOrganization>;

/**
 * Agent creator is a user or the token that registered the agent.
 * Official: https://buildkite.com/docs/apis/rest-api/agents
 */
export const BuildkiteAgentCreator = z
	.object({
		id: z.string().optional(),
		graphql_id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		avatar_url: z.string().optional(),
		created_at: z.string().optional(),
	})
	.loose();

export type BuildkiteAgentCreator = z.infer<typeof BuildkiteAgentCreator>;

/**
 * Current job on a listed agent (fields from the official list-agents example).
 * Official: GET /v2/organizations/{org.slug}/agents
 * https://buildkite.com/docs/apis/rest-api/agents
 */
export const BuildkiteAgentJob = z
	.object({
		id: z.string().optional(),
		graphql_id: z.string().optional(),
		type: z.string().optional(),
		name: z.string().optional(),
		state: z.string().optional(),
		command: z.string().optional(),
	})
	.loose();

export type BuildkiteAgentJob = z.infer<typeof BuildkiteAgentJob>;

/**
 * Connected or stopping agent for an organization.
 * Official: GET /v2/organizations/{org.slug}/agents
 * https://buildkite.com/docs/apis/rest-api/agents
 *
 * connection_state: never_connected | connected | disconnected | stopping | stopped | lost
 */
export const BuildkiteAgent = z
	.object({
		id: z.string(),
		graphql_id: z.string().optional(),
		url: z.string().optional(),
		web_url: z.string().optional(),
		name: z.string(),
		connection_state: z.enum([
			'never_connected',
			'connected',
			'disconnected',
			'stopping',
			'stopped',
			'lost',
		]),
		hostname: z.string().optional(),
		ip_address: z.string().optional(),
		user_agent: z.string().optional(),
		version: z.string().optional(),
		os_id: z.string().optional(),
		arch: z.string().optional(),
		queue: z.string().optional(),
		creator: BuildkiteAgentCreator.nullable().optional(),
		created_at: z.string().optional(),
		connected_at: z.string().nullable().optional(),
		disconnected_at: z.string().nullable().optional(),
		lost_at: z.string().nullable().optional(),
		stopped_at: z.string().nullable().optional(),
		job: BuildkiteAgentJob.nullable().optional(),
		last_job_finished_at: z.string().nullable().optional(),
		priority: z.number().nullable().optional(),
		meta_data: z.array(z.string()).optional(),
	})
	.loose();

export type BuildkiteAgent = z.infer<typeof BuildkiteAgent>;
