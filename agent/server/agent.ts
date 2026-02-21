import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { generateText, stepCountIs, tool, zodSchema } from 'ai';
import type { ModelMessage } from 'ai';
import { z } from 'zod';
import {
	archiveWorkflow,
	executeScript,
	listWorkflows,
	updateWorkflowRecord,
} from './executor';
import type { PluginDbInfo } from './plugin-manager';
import {
	getAllPluginsStatus,
	getConfiguredPluginsFromDb,
} from './plugin-manager';
import { searchCodeExamples } from './search';
import { typecheck } from './typecheck';

// ─────────────────────────────────────────────────────────────────────────────
// Provider selection — use whichever key the user has set
// ─────────────────────────────────────────────────────────────────────────────

function getModel() {
	console.log('[agent:getModel] Checking for API keys...');
	if (process.env.ANTHROPIC_API_KEY) {
		console.log('[agent:getModel] Using Anthropic (claude-opus-4-5)');
		return anthropic('claude-opus-4-5');
	}
	// Default: OpenAI
	console.log('[agent:getModel] Using OpenAI (gpt-4.1)');
	return openai('gpt-4.1');
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema for final agent response
// ─────────────────────────────────────────────────────────────────────────────

export const AgentResultSchema = z.object({
	type: z.enum(['script', 'workflow']),
	workflowId: z.string().optional(),
	code: z.string(),
	description: z.string().optional(),
	cronSchedule: z.string().optional(), // Cron format: * * * * *
	/** For webhook-triggered workflows: which plugin + action fires this workflow */
	webhookTrigger: z
		.object({
			plugin: z.string(), // e.g. 'linear'
			action: z.string(), // e.g. 'issues.create'
		})
		.optional(),
	/** For scripts: output from the single execution (agent already ran it; server must not run again) */
	output: z.string().optional(),
	/** For scripts: error message if execution failed */
	error: z.string().optional(),
});

export type AgentResult = z.infer<typeof AgentResultSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Per-integration credential instructions
// ─────────────────────────────────────────────────────────────────────────────

const INTEGRATION_INSTRUCTIONS: Record<
	string,
	{ steps: string; docsUrl: string }
> = {
	slack: {
		steps:
			'Go to api.slack.com/apps → your app → OAuth & Permissions → install to workspace → copy the Bot User OAuth Token (xoxb-). For webhooks, copy the Signing Secret from Basic Information.',
		docsUrl: 'https://api.slack.com/apps',
	},
	linear: {
		steps:
			'Linear → Settings → Security & access → Personal API keys → Create key.',
		docsUrl: 'https://linear.app/settings/api',
	},
	resend: {
		steps: 'resend.com/api-keys → Create API Key.',
		docsUrl: 'https://resend.com/api-keys',
	},
	gmail: {
		steps:
			'Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application). Copy Client ID and Client Secret. Then add your Access Token from the OAuth flow.',
		docsUrl: 'https://console.cloud.google.com/apis/credentials',
	},
	googlecalendar: {
		steps:
			'Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application). Copy Client ID and Client Secret. Then add your Access Token from the OAuth flow.',
		docsUrl: 'https://console.cloud.google.com/apis/credentials',
	},
	googledrive: {
		steps:
			'Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application). Copy Client ID and Client Secret. Then add your Access Token from the OAuth flow.',
		docsUrl: 'https://console.cloud.google.com/apis/credentials',
	},
	googlesheets: {
		steps:
			'Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID (Web application). Copy Client ID and Client Secret. Then add your Access Token from the OAuth flow.',
		docsUrl: 'https://console.cloud.google.com/apis/credentials',
	},
	github: {
		steps:
			'GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token. Select the scopes your automation needs.',
		docsUrl: 'https://github.com/settings/tokens',
	},
	hubspot: {
		steps:
			'HubSpot → Settings → Integrations → Private Apps → Create private app → copy the access token.',
		docsUrl: 'https://app.hubspot.com/private-apps',
	},
	posthog: {
		steps: 'PostHog → Project Settings → API Keys → copy Project API Key.',
		docsUrl: 'https://app.posthog.com/project/settings',
	},
	tavily: {
		steps: 'Sign up at tavily.com → Dashboard → copy your API key.',
		docsUrl: 'https://app.tavily.com',
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// System prompt for the supervisor agent
// ─────────────────────────────────────────────────────────────────────────────

function buildSystemPrompt(plugins: PluginDbInfo[]): string {
	const ready = plugins.filter((p) => p.hasAccount).map((p) => p.name);
	const notReady = plugins.filter((p) => !p.hasAccount).map((p) => p.name);
	const noneReady = ready.length === 0;

	const pluginLines: string[] = [];
	if (ready.length > 0) {
		pluginLines.push(`Connected (account exists): ${ready.join(', ')}`);
	}
	if (notReady.length > 0) {
		pluginLines.push(
			`Registered but not configured (no account): ${notReady.join(', ')}`,
		);
	}
	if (pluginLines.length === 0) {
		pluginLines.push('No plugins registered yet.');
	}

	const firstRunHint = noneReady
		? `\n\u26a0\ufe0f  No plugins are configured yet. If the user says anything that implies using an integration \u2014 or just says hello / asks to get started \u2014 immediately call \`check_environment\` and walk them through setup one plugin at a time before attempting any automation.`
		: '';

	const integrationInstructionLines = Object.entries(INTEGRATION_INSTRUCTIONS)
		.map(([name, info]) => `- **${name}**: ${info.steps}`)
		.join('\n');

	return `You are a personal automation assistant that helps users build automations with Corsair: one-off scripts, scheduled (cron) workflows, and webhook-triggered workflows. The \`corsair\` client is available as a global in the execution environment \u2014 do NOT import it.
${firstRunHint}
## Plugins

${pluginLines.join('\n')}

Use only the plugins listed above. Do not reference unlisted plugins.

## Tools

- **check_environment**: Get the full setup state \u2014 which plugins are registered, which are ready, and which fields are missing. Call at the start of any setup flow or when the user asks "what's configured?" or "what's connected?". Also call after the user replies "done" to verify a plugin is ready before continuing.
- **get_setup_url**: Get the localhost URL for the user to enter credentials safely (submitted directly to the server, never through you). Always call this and give the user the URL \u2014 never tell them to go find the keys page themselves.
- **ask_human**: Pause the session and wait for one reply. REQUIRED whenever you need a response \u2014 do not ask as plain text. Use for setup: send one sentence + the URL, wait. Session resumes with full context when they reply.
- **search_code_examples**: Find code examples for Corsair APIs. Call before writing code to learn patterns.
- **write_and_execute_code**: Write TypeScript, typecheck it, and (for scripts) run it. Your main way to gather context and take action. Use it repeatedly in one run when needed.
- **manage_workflows**: List, update (code/schedule/status), or archive workflows. List first to get workflow names.

## Onboarding \u2014 setting up integrations

**When to run this flow:** Any time the user says "set up", "get started", "add [integration]", or their request implies a plugin that isn't configured yet.

**The flow \u2014 one integration at a time:**
1. Call \`check_environment\` to see what's ready and what's missing.
2. For the first unconfigured plugin the user needs: tell them in one sentence where to get the credential (see list below), then call \`get_setup_url\` for that plugin, then immediately call \`ask_human\` with one sentence + the URL. Example: "Paste your Slack Bot Token here: [URL] \u2014 reply 'done' when finished."
3. When the user replies "done": call \`check_environment\` again for that plugin. If ready, move to the next unconfigured one and repeat. If still not ready, call \`get_setup_url\` + \`ask_human\` again with a note to double-check the value.
4. Once all needed plugins are ready, confirm and proceed with the automation.

**Rules:**
- Never say "go to the keys page" without immediately providing the setup URL from \`get_setup_url\`.
- One integration at a time. Don't list all missing plugins and ask the user to fix them all at once.
- Credentials stay out of chat. Always use \`get_setup_url\` + \`ask_human\`. The user pastes in their browser, not here.
- One sentence + one URL per message. No multi-step instructions in a single ask.

**Where to get credentials \u2014 say this before sending the setup URL:**
${integrationInstructionLines}

## Auth errors during execution

When a script output looks like an auth or permission error (401, 403, token expired, invalid_grant, permission denied):
1. Call \`check_environment\` for the relevant plugin to see which fields are missing or stale.
2. Call \`get_setup_url\` for that plugin (and the specific field if you know it).
3. Call \`ask_human\` with one sentence + the URL (e.g. "Gmail access has expired \u2014 update it here: [URL] and reply 'done'.").
4. When they reply, call \`check_environment\` to confirm it's ready, then retry.

Keep user-facing messages short: one sentence plus the URL. No stack traces or raw JSON.

## Execution model

- **Batch when you don't need output**: If the next step doesn't depend on the previous result, do multiple actions in one script (e.g. post to Slack, then add a reaction).
- **REPL when you do**: Fetch or list something, read the returned output, then write the next script that acts on it. Use \`console.log\` to surface data you need to interpret.
- **No guessing**: Don't do everything in one execution if that would require guessing IDs, names, or skipping a reasoning step. Fetch first, then act.

Typical run: search examples \u2192 run code to gather context (lists, IDs) \u2192 run code to perform the action \u2192 repeat until done. Respond with a short summary at the end.

## When to ask vs assume

**Ask** when the destination or target of an action is unspecified and critical (which channel, which list, which recipient). Acting without a specified destination can send the wrong thing to the wrong place.

**Assume** when the missing piece is typically singular or inferable. If the service usually has one of something, or you can list options in code and find exactly one, resolve it in code and proceed.

**Don't ask** when the user already specified the value, when you can list/fetch options and infer from context, or when the value is only about content (e.g. message text) rather than routing. One question at a time.

## How to ask the user

**Always use the \`ask_human\` tool when you need a reply to continue.** Do not output a question as plain text \u2014 the reply will lose context. Before calling \`ask_human\`, include any options you already fetched (e.g. list of channels) so they can choose in one reply.

## Code shape

**Scripts (one-off):** One TypeScript module with a self-invoking \`main()\`. Call \`corsair.<plugin>.api.<resource>.<method>(...)\`. Use \`console.log\` or return values to inspect data.

**Workflows (recurring or webhook):** One module that \`export async function <name>() { ... }\`. The function name is the workflow id.
- **Cron:** Pass \`cronSchedule\` (e.g. \`0 9 * * *\` for 9am daily). Empty string = manual only.
- **Webhook:** Pass \`webhookTrigger: { plugin, action }\`. Event payload is in global \`__event\` (do not import it; cast as needed). Search for webhook action names; examples: linear \`issues.create\`, \`issues.update\`; slack \`messages.message\`, \`reactions.added\`; resend \`emails.received\`; github \`starCreated\`. Webhook workflows are typechecked but not run at write time \u2014 they run when the event fires.

Code examples from \`search_code_examples\` are for **patterns** (method names, shapes). Do not reuse example channel names, IDs, or team names as the user's real data.

## LLM inside scripts/workflows

Use the \`ai\` package (\`generateText\`) with the same provider logic as this agent: \`process.env.ANTHROPIC_API_KEY\` \u2192 anthropic, else openai. Do not import provider SDKs directly.

## manage_workflows

**list:** Optional \`triggerType\`: \`cron\` | \`webhook\` | \`manual\` | \`all\`. **update:** \`workflowId\` (name) plus any of \`code\`, \`description\`, \`cronSchedule\`, \`webhookTrigger\`, \`status\` (\`active\` | \`paused\` | \`archived\`). \`cronSchedule\` and \`webhookTrigger\` are mutually exclusive. **delete:** \`workflowId\` archives the workflow.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Schema for human-in-the-loop output
// ─────────────────────────────────────────────────────────────────────────────

export type AgentOutput =
	| AgentResult
	| {
			type: 'needs_input';
			question: string;
			/** Full conversation history to be stored and passed back on resume */
			pendingMessages: ModelMessage[];
			/** The tool call id of the pausing tool invocation, needed to inject the answer */
			toolCallId: string;
			/** The name of the pausing tool, needed to construct the ToolResultPart on resume */
			toolName: string;
	  }
	| {
			/** Conversational response — agent answered without needing to write or execute code */
			type: 'message';
			text: string;
	  };

// ─────────────────────────────────────────────────────────────────────────────
// Tools for the agent
// ─────────────────────────────────────────────────────────────────────────────

const SEARCH_EXAMPLES_LIMIT = 5;

const searchCodeExamplesTool = tool({
	description:
		'Search code examples for Corsair APIs. Use before writing code to learn patterns.',
	inputSchema: zodSchema(
		z.object({
			query: z
				.string()
				.describe(
					'What you want to do (e.g. "post Slack message", "create Linear issue")',
				),
		}),
	),
	execute: async ({ query }) => {
		console.log('[agent:tool] search_code_examples:', query);
		const examples = await searchCodeExamples(query, SEARCH_EXAMPLES_LIMIT);
		return {
			examples: examples.map((ex) => ({
				description: ex.description,
				code: ex.code,
				similarity: ex.similarity,
			})),
		};
	},
});

// No execute function — when the LLM calls this tool, generateText stops the
// multi-step loop and returns with finishReason: 'tool-calls'. The caller then
// surfaces the question to the human and resumes with their answer.
const askHumanTool = tool({
	description:
		'Ask the user one clarifying question when you need their input to continue. REQUIRED when you need a reply — do not ask in a normal message or the reply will lose context. Pauses the session so when they reply, the thread resumes. Include in the question any options you already fetched (e.g. list of channels) so they can choose easily.',
	inputSchema: zodSchema(
		z.object({
			question: z
				.string()
				.describe(
					'The question plus helpful context (e.g. "Which channel? Here are the ones I found: #general, #random. Reply with the channel name.")',
				),
		}),
	),
});

/** Extract the name of the exported async function from workflow code (used as workflowId). */
function getWorkflowFunctionName(code: string): string | null {
	const match = code.match(/export\s+async\s+function\s+(\w+)\s*\(/);
	return match ? match[1]! : null;
}

/** First N lines of stdout/stderr to return so the agent can interpret errors (e.g. auth) without brittle pattern matching. */
const OUTPUT_SNIPPET_LINES = 30;

/** Exported for unit tests. Trims, splits into lines, returns first OUTPUT_SNIPPET_LINES non-empty lines. */
export function snippetOutput(full: string): string {
	const lines = full
		.trim()
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l.length > 0);
	const take = lines.slice(0, OUTPUT_SNIPPET_LINES);
	return take.join('\n');
}

export const writeAndExecuteCodeTool = tool({
	description:
		'Write TypeScript, typecheck it, and run it (scripts only; workflows are stored). Returns build or runtime errors so you can fix and retry. Script output is returned as a snippet so you can interpret auth/errors yourself.',
	inputSchema: zodSchema(
		z.object({
			type: z
				.enum(['script', 'workflow'])
				.describe('One-off script or stored workflow'),
			code: z.string().describe('Complete TypeScript code'),
			description: z
				.string()
				.optional()
				.default('')
				.describe('Short description of what the code does'),
			cronSchedule: z
				.string()
				.optional()
				.default('')
				.describe('Workflows: cron (e.g. "0 9 * * *") or empty for manual only'),
			webhookTrigger: z
				.object({
					plugin: z.string().describe('Plugin name, e.g. "linear"'),
					action: z.string().describe('Action, e.g. "issues.create"'),
				})
				.optional()
				.describe(
					'Workflows: webhook trigger; mutually exclusive with cronSchedule',
				),
		}),
	),
	execute: async ({
		type,
		code,
		description,
		cronSchedule,
		webhookTrigger,
	}) => {
		console.log('[agent:tool] write_and_execute_code called, type:', type);

		// Typecheck the code
		console.log('[agent:tool] Running typecheck...');
		const { valid, errors } = await typecheck(code);
		if (!valid) {
			console.log('[agent:tool] Typecheck failed');
			return {
				success: false,
				error: 'TypeScript compilation failed',
				errors,
			};
		}

		console.log('[agent:tool] Typecheck passed, executing code...');

		try {
			if (type === 'script') {
				const result = await executeScript(code);
				if (result.success) {
					const outputSnippet = result.output
						? snippetOutput(result.output)
						: undefined;
					return {
						success: true,
						type: 'script',
						code,
						output: outputSnippet,
						description: description?.trim() || undefined,
						message:
							'Script finished. If output looks like an auth or permission error, use check_environment, get_setup_url, and ask_human so the user can fix and you can retry.',
					};
				}
				const errorSnippet = result.output
					? snippetOutput(result.output)
					: undefined;
				return {
					success: false,
					error: 'Script execution failed',
					errors: result.error,
					...(errorSnippet && { outputSnippet: errorSnippet }),
				};
			}

			// Workflow: validate shape and return metadata (no execution)
			const workflowId = getWorkflowFunctionName(code);
			if (!workflowId) {
				return {
					success: false,
					error:
						'Workflow code must export exactly one async function, e.g. "export async function myWorkflow() { ... }"',
				};
			}
			const desc = description?.trim() || undefined;
			if (webhookTrigger) {
				return {
					success: true,
					type: 'workflow',
					code,
					workflowId,
					description: desc,
					webhookTrigger,
					message: `Webhook workflow "${workflowId}" created — fires on ${webhookTrigger.plugin}.${webhookTrigger.action}`,
				};
			}
			const cron = cronSchedule?.trim() || undefined;
			return {
				success: true,
				type: 'workflow',
				code,
				workflowId,
				description: desc,
				cronSchedule: cron,
				message: cron
					? `Workflow "${workflowId}" created and will run on schedule: ${cron}`
					: `Workflow "${workflowId}" created (manual trigger)`,
			};
		} catch (error) {
			return {
				success: false,
				error: 'Execution failed',
				errors: error instanceof Error ? error.message : String(error),
			};
		}
	},
});

const manageWorkflowsTool = tool({
	description:
		'List, update, or archive workflows. List first to get workflow names.',
	inputSchema: zodSchema(
		z.object({
			action: z
				.enum(['list', 'update', 'delete'])
				.describe('list | update | delete (archive)'),
			triggerType: z
				.enum(['cron', 'webhook', 'manual', 'all'])
				.optional()
				.describe('For list: filter by type'),
			workflowId: z
				.string()
				.optional()
				.describe(
					'For update/delete: workflow name (exported function name) or UUID',
				),
			code: z
				.string()
				.optional()
				.describe('For update: new code (typechecked before save)'),
			description: z.string().optional().describe('For update: description'),
			cronSchedule: z
				.string()
				.optional()
				.describe('For update: cron; mutually exclusive with webhookTrigger'),
			webhookTrigger: z
				.object({ plugin: z.string(), action: z.string() })
				.optional()
				.describe(
					'For update: webhook trigger; mutually exclusive with cronSchedule',
				),
			status: z
				.enum(['active', 'paused', 'archived'])
				.optional()
				.describe('For update: e.g. paused to disable'),
		}),
	),
	execute: async ({
		action,
		triggerType,
		workflowId,
		code,
		description,
		cronSchedule,
		webhookTrigger,
		status,
	}) => {
		if (action === 'list') {
			console.log(
				'[agent:tool] manage_workflows list called, filter:',
				triggerType ?? 'all',
			);
			const results = await listWorkflows(triggerType);
			console.log(`[agent:tool] Found ${results.length} workflow(s)`);
			return { workflows: results };
		}

		if (action === 'update') {
			console.log('[agent:tool] manage_workflows update called:', workflowId);
			if (!workflowId) {
				return { success: false, error: 'workflowId is required for update' };
			}

			if (code) {
				console.log('[agent:tool] Typechecking updated workflow code...');
				const { valid, errors } = await typecheck(code);
				if (!valid) {
					console.log('[agent:tool] Typecheck failed');
					return {
						success: false,
						error: 'TypeScript compilation failed',
						errors,
					};
				}
				console.log('[agent:tool] Typecheck passed');
			}

			const updated = await updateWorkflowRecord(workflowId, {
				code,
				description,
				cronSchedule,
				webhookTrigger,
				status,
			});

			if (!updated) {
				return { success: false, error: `Workflow "${workflowId}" not found` };
			}

			return {
				success: true,
				workflow: {
					id: updated.id,
					name: updated.name,
					triggerType: updated.triggerType,
					triggerConfig: updated.triggerConfig,
					status: updated.status,
					nextRunAt: updated.nextRunAt,
				},
				message: `Workflow "${updated.name}" updated successfully`,
			};
		}

		// action === 'delete'
		console.log('[agent:tool] manage_workflows delete called:', workflowId);
		if (!workflowId) {
			return { success: false, error: 'workflowId is required for delete' };
		}
		const archived = await archiveWorkflow(workflowId);
		if (!archived) {
			return { success: false, error: `Workflow "${workflowId}" not found` };
		}
		return { success: true, message: `Workflow "${archived.name}" archived` };
	},
});

// ─────────────────────────────────────────────────────────────────────────────
// Environment + plugin status tool (replaces check_plugin_status)
// ─────────────────────────────────────────────────────────────────────────────

const checkEnvironmentTool = tool({
	description:
		'Get the full environment and plugin setup state: which plugins are registered, which are ready (all required fields set), and the field-level detail for any that are not. Also reports whether required env vars (LLM key, master key) are present. Call at the start of any setup flow, when the user asks "what\'s configured?", or after the user replies "done" to verify a plugin is now ready.',
	inputSchema: zodSchema(
		z.object({
			plugin: z
				.string()
				.optional()
				.describe(
					'Filter to a specific plugin (e.g. "slack") for targeted field-level detail; omit for a full overview of all plugins.',
				),
		}),
	),
	execute: async ({ plugin }) => {
		console.log('[agent:tool] check_environment:', plugin ?? 'all');

		const envOk = !!(
			process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY
		);
		const missingEnvVars: string[] = [];
		if (!process.env.OPENAI_API_KEY && !process.env.ANTHROPIC_API_KEY) {
			missingEnvVars.push('OPENAI_API_KEY or ANTHROPIC_API_KEY');
		}
		if (!process.env.CORSAIR_MASTER_KEY) {
			missingEnvVars.push('CORSAIR_MASTER_KEY');
		}

		// DB-level plugin info (hasAccount) + key-manager status (isReady, fields)
		const [pluginsDb, statuses] = await Promise.all([
			getConfiguredPluginsFromDb(),
			getAllPluginsStatus(),
		]);

		const dbByName = new Map(pluginsDb.map((p) => [p.name, p]));

		const filtered = plugin
			? statuses.filter((s) => s.name === plugin)
			: statuses;

		if (plugin && filtered.length === 0) {
			return {
				envOk,
				missingEnvVars,
				error: `Plugin "${plugin}" is not configured in this Corsair instance.`,
				configuredPlugins: statuses.map((s) => s.name),
			};
		}

		return {
			envOk,
			missingEnvVars,
			plugins: filtered.map((s) => ({
				name: s.name,
				hasAccount: dbByName.get(s.name)?.hasAccount ?? false,
				isReady: s.isReady,
				authType: s.authType,
				fields: s.fields.map((f) => ({
					field: f.field,
					label: f.label,
					required: f.required,
					isSet: f.isSet,
				})),
			})),
		};
	},
});

const getSetupUrlTool = tool({
	description:
		'Get the localhost URL for the user to enter plugin credentials (submitted to server, not through you). Optionally pass a field for a single-field form.',
	inputSchema: zodSchema(
		z.object({
			plugin: z.string().describe('Plugin name, e.g. "slack", "googlecalendar"'),
			field: z
				.string()
				.optional()
				.describe('Specific field, e.g. "access_token"; omit for all fields'),
		}),
	),
	execute: async ({ plugin, field }) => {
		console.log('[agent:tool] get_setup_url:', plugin, field ?? '');
		const PORT = process.env.PORT ?? '3001';
		const qs = field ? `?plugin=${plugin}&field=${field}` : `?plugin=${plugin}`;
		const url = `http://localhost:${PORT}/setup${qs}`;
		const what = field
			? `the "${field}" field for ${plugin}`
			: `all credentials for ${plugin}`;
		return {
			url,
			message: `Send this URL to the user so they can enter ${what} directly in their browser.`,
		};
	},
});

// ─────────────────────────────────────────────────────────────────────────────
// Type guards for tool results and tool calls
// ─────────────────────────────────────────────────────────────────────────────

/** Successful return shape from write_and_execute_code when success: true (matches tool execute return). */
type WriteAndExecuteCodeSuccessOutput =
	| {
			success: true;
			type: 'script';
			code: string;
			output?: string;
			description?: string;
			message: string;
	  }
	| {
			success: true;
			type: 'workflow';
			code: string;
			workflowId: string;
			description?: string;
			cronSchedule?: string;
			webhookTrigger?: { plugin: string; action: string };
			message: string;
	  };

/** Type guard: narrows an unknown value to a successful script/workflow output. */
function isSuccessOutput(
	out: unknown,
): out is WriteAndExecuteCodeSuccessOutput {
	if (out == null || typeof out !== 'object') return false;
	const o = out as Record<string, unknown>;
	return (
		o.success === true &&
		(o.type === 'script' || o.type === 'workflow') &&
		typeof o.code === 'string'
	);
}

/**
 * Type guard: narrows an unknown value (a tool result from the SDK step array)
 * to a successful write_and_execute_code result.
 *
 * The parameter is `unknown` rather than a structural type because
 * TypedToolResult<TOOLS> can include `undefined` in its union when the toolset
 * contains optional tools (e.g. web_search?: Tool | undefined), which makes it
 * incompatible with any non-nullable structural type.
 *
 * The `as Record<string, unknown>` cast after the null/typeof guard is the
 * standard TypeScript pattern for property access on a verified object —
 * the real safety comes from `isSuccessOutput` doing comprehensive field checks.
 */
function isSuccessfulCodeExecutionResult(r: unknown): r is {
	toolName: 'write_and_execute_code';
	output: WriteAndExecuteCodeSuccessOutput;
} {
	if (r == null || typeof r !== 'object') return false;
	const o = r as Record<string, unknown>;
	if (o['toolName'] !== 'write_and_execute_code') return false;
	return isSuccessOutput(o['output']);
}

/** Tool call for ask_human — mirrors the StaticToolCall shape produced by the AI SDK. */
type AskHumanToolCall = {
	type: 'tool-call';
	toolCallId: string;
	toolName: 'ask_human';
	input: { question: string };
};

function isAskHumanToolCall(tc: unknown): tc is AskHumanToolCall {
	if (tc == null || typeof tc !== 'object') return false;
	const o = tc as Record<string, unknown>;
	if (o.type !== 'tool-call' || o.toolName !== 'ask_human') return false;
	// Check input is an object before accessing .question to avoid a silent cast failure.
	const input = o.input;
	if (input == null || typeof input !== 'object') return false;
	return typeof (input as Record<string, unknown>).question === 'string';
}

// ─────────────────────────────────────────────────────────────────────────────
// Main agent function
// ─────────────────────────────────────────────────────────────────────────────

export async function runAgent(messages: ModelMessage[]): Promise<AgentOutput> {
	console.log('[agent] runAgent called', {
		messageCount: messages.length,
		firstMessage:
			typeof messages[0]?.content === 'string'
				? messages[0].content.substring(0, 100)
				: '[structured content]',
	});

	const model = getModel();

	// Fast DB read — just queries corsair_integrations + corsair_accounts row counts.
	// No decryption, no API calls, no tsx spawns. Used to tell the agent up front
	// which plugins exist and whether they have credentials, so it can make
	// smart decisions without any extra tool calls.
	let plugins: PluginDbInfo[] = [];
	try {
		plugins = await getConfiguredPluginsFromDb();
		console.log(`[agent] Loaded ${plugins.length} plugin(s) from DB`);
	} catch (err) {
		console.warn('[agent] Could not load plugins from DB:', err);
	}

	const systemPrompt = buildSystemPrompt(plugins);

	const webSearchTool =
		model.provider === 'openai' ? openai.tools.webSearchPreview({}) : undefined;

	const result = await generateText({
		model,
		system: systemPrompt,
		messages,
		tools: {
			check_environment: checkEnvironmentTool,
			get_setup_url: getSetupUrlTool,
			search_code_examples: searchCodeExamplesTool,
			write_and_execute_code: writeAndExecuteCodeTool,
			manage_workflows: manageWorkflowsTool,
			ask_human: askHumanTool,
			...(webSearchTool && { web_search: webSearchTool }),
		},
		stopWhen: stepCountIs(10),
	});

	console.log(
		`[agent] Generated response, steps: ${result.steps.length}, finishReason: ${result.finishReason}`,
	);

	// Check if the agent paused to ask the human a question.
	// When a tool has no execute function, generateText stops with finishReason
	// 'tool-calls' and surfaces the call in result.toolCalls.
	if (result.finishReason === 'tool-calls') {
		const askHumanCall = result.toolCalls.find(
			(tc): tc is AskHumanToolCall => isAskHumanToolCall(tc),
		);
		if (askHumanCall) {
			const { question } = askHumanCall.input;
			console.log('[agent] Agent asked a human question:', question);
			// Store the full conversation so far (input messages + generated messages)
			// so it can be resumed after the human replies.
			const pendingMessages = [...messages, ...result.response.messages];
			return {
				type: 'needs_input',
				question,
				pendingMessages,
				toolCallId: askHumanCall.toolCallId,
				toolName: askHumanCall.toolName,
			};
		}
	}

	// Collect tool results across ALL steps — generateText only surfaces the
	// last step's toolResults at the top level; we need all of them.
	const allToolResults = result.steps.flatMap((s) => s.toolResults);
	console.log(
		`[agent] Total tool results across all steps: ${allToolResults.length}`,
	);

	// Find the last successful code execution result (agent may have retried internally)
	const codeExecutionResults = allToolResults.filter(
		isSuccessfulCodeExecutionResult,
	);
	console.log(
		`[agent] Successful code execution results: ${codeExecutionResults.length}`,
	);
	const lastCodeResult =
		codeExecutionResults[codeExecutionResults.length - 1];

	if (lastCodeResult && isSuccessOutput(lastCodeResult.output)) {
		const execResult = lastCodeResult.output;

		if (execResult.type === 'script') {
			console.log('[agent] Script executed successfully');
			return {
				type: 'script',
				code: execResult.code,
				description: execResult.description,
				output: execResult.output,
			};
		}

		console.log('[agent] Workflow created successfully');
		return {
			type: 'workflow',
			workflowId: execResult.workflowId,
			code: execResult.code,
			description: execResult.description,
			cronSchedule: execResult.cronSchedule,
			webhookTrigger: execResult.webhookTrigger,
		};
	}

	// The agent answered conversationally (e.g. listed workflows, answered a question)
	// without needing to write or execute code. Surface its text directly.
	if (result.finishReason === 'stop' && result.text) {
		console.log('[agent] Agent responded conversationally (no code execution)');
		return { type: 'message', text: result.text };
	}

	throw new Error(
		`Agent did not produce a result. Finish reason: ${result.finishReason}. Response: ${result.text}`,
	);
}
