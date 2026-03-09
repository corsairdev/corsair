import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';

export type ClaudeExtensionContext = {
  jid?: string;
};

export type CreateClaudeToolsOptions = BaseMcpOptions & {
  context?: ClaudeExtensionContext;
};

export async function createClaudeTools(
  options: CreateClaudeToolsOptions,
): Promise<unknown[]> {
  const { tool } = await import('@anthropic-ai/claude-agent-sdk');
  const { corsair, workflows, cron, permissions, basePermissionUrl, context } =
    options;
  const inspect = corsair;
  const notifyJid = context?.jid;

  const tools: unknown[] = [];

  tools.push(
    tool(
      'list_operations',
      "List available Corsair operations. Without options returns all API endpoints across every plugin. Filter by plugin (e.g. 'slack') and/or type ('api' | 'webhooks' | 'db').",
      {
        plugin: z.string().optional().describe("Plugin ID to filter by, e.g. 'slack' or 'github'"),
        type: z
          .enum(['api', 'webhooks', 'db'])
          .optional()
          .describe("Operation type: 'api' (default), 'webhooks', or 'db'"),
      },
      async ({ plugin, type }) => {
        const result = inspect.list_operations({ plugin, type });
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      },
    ),
  );

  tools.push(
    tool(
      'get_schema',
      "Get the schema and metadata for a Corsair operation path. Accepts API paths ('slack.api.channels.list'), webhook paths ('slack.webhooks.messages.message'), or DB paths ('slack.db.messages.search').",
      {
        path: z
          .string()
          .describe("Full dot-path from list_operations, e.g. 'slack.api.channels.list'"),
      },
      async ({ path }) => {
        const result = inspect.get_schema(path);
        return {
          content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
        };
      },
    ),
  );

  tools.push(
    tool(
      'corsair_run',
      "Execute any Corsair API endpoint by its dot-path. Use list_operations to discover paths and get_schema to understand required args. Example path: 'slack.api.channels.list'.",
      {
        path: z.string().describe("Full API dot-path, e.g. 'slack.api.messages.post'"),
        args: z.record(z.unknown()).default({}).describe('Arguments object for the operation'),
      },
      async ({ path, args }) => {
        const parts = path.split('.');
        if (parts.length < 3) {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Invalid path "${path}". Expected format: "plugin.api.group.method". Use list_operations to see valid paths.`,
              },
            ],
          };
        }
        let fn: unknown = corsair;
        for (const part of parts) {
          if (typeof fn !== 'object' || fn === null) {
            fn = undefined;
            break;
          }
          fn = (fn as Record<string, unknown>)[part];
        }
        if (typeof fn !== 'function') {
          return {
            content: [
              {
                type: 'text' as const,
                text: `Path "${path}" is not a callable operation. Use list_operations to see valid paths.`,
              },
            ],
          };
        }
        try {
          const result = await (fn as (args: unknown) => Promise<unknown>)(args);
          return {
            content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }],
          };
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const extra = err instanceof Error && err.cause ? `\nCause: ${String(err.cause)}` : '';
          return {
            content: [
              {
                type: 'text' as const,
                text: `Error running "${path}": ${message}${extra}`,
              },
            ],
          };
        }
      },
    ),
  );

  const manageWorkflowsSchema = {
    action: z.enum(['list', 'create', 'update', 'delete']).describe('Action to perform'),
    triggerType: z
      .enum(['cron', 'webhook', 'manual', 'all'])
      .optional()
      .describe('Filter by trigger type (list only)'),
    workflowId: z
      .string()
      .optional()
      .describe('Workflow function name — required for create/update/delete'),
    code: z.string().optional().describe('TypeScript workflow code — required for create'),
    description: z.string().optional().describe('Human-readable description'),
    cronSchedule: z.string().optional().describe('Cron expression, e.g. "0 9 * * 1-5"'),
    webhookTrigger: z
      .object({ plugin: z.string(), action: z.string() })
      .optional()
      .describe('Webhook trigger, e.g. { plugin: "slack", action: "messages.message" }'),
    status: z
      .enum(['active', 'paused', 'archived'])
      .optional()
      .describe('Workflow status (update only)'),
  };

  tools.push(
    tool(
      'manage_workflows',
      `List, create, update, or delete Corsair workflows. Use action="create" with webhookTrigger or cronSchedule. Workflow code receives ctx and payload; ctx.sdk is the corsair SDK.`,
      manageWorkflowsSchema,
      async ({
        action,
        triggerType,
        workflowId,
        code,
        description,
        cronSchedule,
        webhookTrigger,
        status,
      }) => {
        let result: unknown;
        if (action === 'list') {
          result = { workflows: await workflows.listWorkflows(triggerType) };
        } else if (action === 'create') {
          if (!workflowId || !code) {
            result = { success: false, error: 'workflowId and code are required for create' };
          } else {
            const stored = await workflows.storeWorkflow({
              type: 'workflow',
              workflowId,
              code,
              description: description?.trim() || undefined,
              cronSchedule: cronSchedule?.trim() || undefined,
              webhookTrigger,
              notifyJid,
            });
            if (stored && cronSchedule?.trim()) {
              const ok = cron.registerCronWorkflow(
                stored.id,
                workflowId,
                code,
                cronSchedule.trim(),
                notifyJid,
              );
              if (!ok) {
                result = { success: false, error: `Invalid cron expression: "${cronSchedule}"` };
                return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
              }
            }
            result = stored
              ? {
                  success: true,
                  workflow: {
                    id: stored.id,
                    name: stored.name,
                    triggerType: stored.triggerType,
                    status: stored.status,
                  },
                }
              : { success: false, error: 'Failed to store workflow' };
          }
        } else if (action === 'delete') {
          if (!workflowId) {
            result = { success: false, error: 'workflowId is required for delete' };
          } else {
            const archived = await workflows.archiveWorkflow(workflowId);
            if (!archived) {
              result = { success: false, error: `Workflow "${workflowId}" not found` };
            } else {
              cron.unregisterCronWorkflow(archived.id);
              result = { success: true, message: `Workflow "${archived.name}" archived` };
            }
          }
        } else {
          if (!workflowId) {
            result = { success: false, error: 'workflowId is required for update' };
          } else {
            const updated = await workflows.updateWorkflowRecord(workflowId, {
              code,
              description,
              cronSchedule,
              webhookTrigger,
              status,
            });
            if (!updated) {
              result = { success: false, error: `Workflow "${workflowId}" not found` };
            } else {
              if (updated.status === 'archived' || updated.status === 'paused') {
                cron.unregisterCronWorkflow(updated.id);
              } else if (updated.triggerType === 'cron') {
                const cronCfg = updated.triggerConfig as { cron?: string } | undefined;
                if (cronCfg?.cron && updated.code) {
                  cron.registerCronWorkflow(
                    updated.id,
                    updated.name,
                    updated.code,
                    cronCfg.cron,
                    notifyJid,
                  );
                }
              }
              result = {
                success: true,
                workflow: {
                  id: updated.id,
                  name: updated.name,
                  triggerType: updated.triggerType,
                  status: updated.status,
                },
              };
            }
          }
        }
        return { content: [{ type: 'text' as const, text: JSON.stringify(result, null, 2) }] };
      },
    ),
  );

  if (permissions && basePermissionUrl) {
    tools.push(
      tool(
        'request_permission',
        'Request permission from the user to execute a protected endpoint. Call when a script returns [PERMISSION_REQUIRED]. Returns an approval URL; then call ask_human with that URL.',
        {
          endpoint: z
            .string()
            .describe('Full endpoint path, e.g. "slack.messages.post"'),
          args: z.record(z.unknown()).describe('Arguments from the PERMISSION_REQUIRED message'),
          description: z
            .string()
            .describe('Short human-readable summary of what this action will do'),
        },
        async ({ endpoint, args, description }) => {
          const { permissionId, approvalUrl } = await permissions.createPermissionRequest({
            endpoint,
            args,
            description,
            jid: notifyJid,
          });
          const result = {
            permissionId,
            approvalUrl,
            message: `Permission request created. Ask the user to approve at: ${approvalUrl}`,
          };
          return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
        },
      ),
    );
  }

  return tools;
}
