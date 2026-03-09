import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { BaseMcpOptions } from './adapters.js';

export function createBaseMcpServer(options: BaseMcpOptions): McpServer {
  const { corsair, workflows, cron, permissions, basePermissionUrl } = options;
  const inspect = corsair;

  const server = new McpServer({
    name: 'corsair',
    version: '1.0.0',
    description:
      'Use this to interact with the Corsair API. Corsair helps you integrate with dozens of tools and services. You can setup cron jobs and webhooks triggered jobs.',
  });

  server.tool(
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
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
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
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.tool(
    'corsair_run',
    "Execute any Corsair API endpoint by its dot-path. Use list_operations to discover paths and get_schema to understand required args. Example path: 'slack.api.channels.list'.",
    {
      path: z
        .string()
        .describe("Full API dot-path, e.g. 'slack.api.messages.post'"),
      args: z
        .record(z.unknown())
        .default({})
        .describe('Arguments object for the operation'),
    },
    async ({ path, args }) => {
      const parts = path.split('.');

      if (parts.length < 3) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
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
          isError: true,
          content: [
            {
              type: 'text',
              text: `Path "${path}" is not a callable operation. Use list_operations to see valid paths.`,
            },
          ],
        };
      }

      try {
        const result = await (fn as (args: unknown) => Promise<unknown>)(args);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        const extra =
          err instanceof Error && err.cause ? `\nCause: ${String(err.cause)}` : '';
        const full = JSON.stringify(err, Object.getOwnPropertyNames(err));
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Error running "${path}": ${message}${extra}\n${full}`,
            },
          ],
        };
      }
    },
  );

  server.tool(
    'manage_workflows',
    `List, create, update, or delete Corsair workflows. Use action="create" with webhookTrigger to register a webhook-triggered workflow, or cronSchedule for a cron workflow.

WORKFLOW CODE CONTRACT:
- The workflow function receives two arguments: ctx and payload.
  - ctx.sdk is the full corsair SDK (same as the corsair import), e.g. ctx.sdk.slack.api.messages.post(...)
  - payload is the raw webhook event payload (for webhook-triggered workflows) or undefined (for cron/manual).
- Function signature: async function <workflowId>(ctx: { sdk: CorsairInstance }, payload?: unknown)
- Example:
  async function myWorkflow(ctx, payload) {
    await ctx.sdk.slack.api.messages.post({ channel: 'C12345', text: 'hello' });
  }`,
    {
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
    },
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
          });
          if (stored && cronSchedule?.trim()) {
            const ok = cron.registerCronWorkflow(
              stored.id,
              workflowId,
              code,
              cronSchedule.trim(),
            );
            if (!ok) {
              result = { success: false, error: `Invalid cron expression: "${cronSchedule}"` };
              return { content: [{ type: 'text', text: JSON.stringify(result) }] };
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

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    },
  );

  if (permissions && basePermissionUrl) {
    server.tool(
      'request_permission',
      'Request permission from the user to execute a protected endpoint. Call this when a script returns a [PERMISSION_REQUIRED] message. Returns an approval URL. After calling this, call ask_human with the approval URL so the user can review and approve.',
      {
        endpoint: z
          .string()
          .describe(
            'Full endpoint path from the PERMISSION_REQUIRED message, e.g. "slack.messages.post"',
          ),
        args: z
          .record(z.unknown())
          .describe('The arguments object from the PERMISSION_REQUIRED message'),
        description: z
          .string()
          .describe(
            'Short human-readable summary of what this action will do, e.g. "Post a message to #general in Slack"',
          ),
        jid: z.string().optional().describe('Optional chat/conversation ID for resuming after approval'),
      },
      async ({ endpoint, args, description, jid }) => {
        const { permissionId, approvalUrl } = await permissions.createPermissionRequest({
          endpoint,
          args,
          description,
          jid,
        });
        const result = {
          permissionId,
          approvalUrl,
          message: `Permission request created. Ask the user to approve at: ${approvalUrl}`,
        };
        return {
          content: [{ type: 'text', text: JSON.stringify(result) }],
        };
      },
    );
  }

  return server;
}
