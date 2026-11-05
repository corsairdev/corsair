import { z } from 'zod';
import { ComposioToolkitMeta, JsonObjectSchema } from '../endpoints/types';

// Entities mirror the Composio v3.1 response objects, one per resource.
// Tools:              https://docs.composio.dev/reference/api-reference/tools/getTools
// Toolkits:           https://docs.composio.dev/reference/api-reference/toolkits/getToolkits
// Connected accounts: https://docs.composio.dev/reference/api-reference/connected-accounts/getConnectedAccounts
// Tool router:        https://docs.composio.dev/reference/api-reference/tool-router/postToolRouterSession
// Each `id` is the resource's own identifier (tool and toolkit slug, connected
// account id, tool router session_id).

export const ComposioTool = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	description: z.string(),
	toolkit: z.object({
		slug: z.string(),
		name: z.string(),
		logo: z.string().optional(),
	}),
	input_parameters: JsonObjectSchema,
	output_parameters: JsonObjectSchema,
	no_auth: z.boolean(),
	version: z.string(),
	available_versions: z.array(z.string()),
	scopes: z.array(z.string()).optional(),
	tags: z.array(z.string()),
	human_description: z.string().optional(),
	is_deprecated: z.boolean(),
});

export const ComposioToolkit = z.object({
	id: z.string(),
	slug: z.string(),
	name: z.string(),
	type: z.string(),
	auth_schemes: z.array(z.string()).optional(),
	composio_managed_auth_schemes: z.array(z.string()).optional(),
	is_local_toolkit: z.boolean().optional(),
	no_auth: z.boolean().optional(),
	auth_guide_url: z.string().nullable().optional(),
	meta: ComposioToolkitMeta,
});

// The API's `state` and `data` fields hold the account's OAuth tokens and API
// keys, so they are deliberately not part of this entity.
export const ComposioConnectedAccount = z.object({
	id: z.string(),
	status: z.string(),
	status_reason: z.string().nullable().optional(),
	user_id: z.string(),
	alias: z.string().nullable().optional(),
	word_id: z.string().nullable().optional(),
	authScheme: z.string().optional(),
	is_disabled: z.boolean(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date(),
	toolkit: z.object({ slug: z.string() }),
	auth_config: z.object({
		id: z.string(),
		auth_scheme: z.string().optional(),
		is_composio_managed: z.boolean().optional(),
		is_disabled: z.boolean().optional(),
	}),
});

export const ComposioSession = z.object({
	id: z.string(),
	session_id: z.string(),
	user_id: z.string(),
	mcp: z.object({ type: z.literal('http'), url: z.string() }),
	tool_router_tools: z.array(z.string()),
	config_version: z.number().optional(),
});
