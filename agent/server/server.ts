import 'dotenv/config';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import type { ModelMessage, ToolModelMessage } from 'ai';
import { processWebhook } from 'corsair';
import { eq } from 'drizzle-orm';
import type { Response } from 'express';
import express from 'express';
import cron from 'node-cron';
import type { AgentResult } from './agent';
import { runAgent } from './agent';
import { corsair } from './corsair';
import { db, pendingSessions, workflows } from './db';
import {
	createExecution,
	executeWorkflow,
	getWebhookWorkflows,
	getWorkflowsToRun,
	storeWorkflow,
	updateExecution,
	updateWorkflowNextRun,
} from './executor';
import {
	getAllPluginsStatus,
	getPluginStatus,
	setPluginField,
} from './plugin-manager';
import { getSetupPageHtml } from './setup-page';
import { appRouter } from './trpc/router';

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

async function handleAgentResult(
	result: AgentResult | { type: 'message'; text: string },
	res: Response,
) {
	if (result.type === 'message') {
		return res.json({ type: 'message', text: result.text });
	}

	if (result.type === 'script') {
		// Script was already executed by the agent tool; do not run again.
		if (result.error) {
			return res
				.status(500)
				.json({ type: 'script', success: false, error: result.error });
		}
		return res.json({
			type: 'script',
			success: true,
			output: result.output ?? '',
		});
	}

	// Workflow
	console.log(`[server] Storing workflow: ${result.workflowId}`);
	const workflow = await storeWorkflow(result);

	let message: string;
	if (result.webhookTrigger) {
		message = `Webhook workflow "${result.workflowId}" registered — fires on ${result.webhookTrigger.plugin}.${result.webhookTrigger.action}`;
	} else if (result.cronSchedule) {
		message = `Workflow scheduled with cron: ${result.cronSchedule}`;
	} else {
		message = 'Workflow stored (manual trigger)';
	}

	return res.json({
		type: 'workflow',
		workflowId: result.workflowId,
		id: workflow.id,
		cronSchedule: result.cronSchedule,
		webhookTrigger: result.webhookTrigger,
		message,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook workflow dispatcher
// ─────────────────────────────────────────────────────────────────────────────

async function dispatchWebhookWorkflows(
	plugin: string,
	action: string,
	eventPayload: unknown,
) {
	const matchingWorkflows = await getWebhookWorkflows(plugin, action);

	if (matchingWorkflows.length === 0) return;

	console.log(
		`[webhook] Dispatching ${matchingWorkflows.length} workflow(s) for ${plugin}.${action}`,
	);

	for (const workflow of matchingWorkflows) {
		console.log(`[webhook] Executing webhook workflow: ${workflow.workflowId}`);

		const execution = await createExecution(workflow.id, 'webhook', 'running');

		try {
			const result = await executeWorkflow(
				workflow.name,
				workflow.code,
				eventPayload,
			);

			if (result.success) {
				await updateExecution(execution.id, 'success', {
					output: result.output,
				});
				console.log(
					`[webhook] Workflow ${workflow.workflowId} executed successfully`,
				);
			} else {
				await updateExecution(execution.id, 'failed', undefined, result.error);
				console.error(
					`[webhook] Workflow ${workflow.workflowId} failed:`,
					result.error,
				);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			await updateExecution(execution.id, 'failed', undefined, errorMessage);
			console.error(
				`[webhook] Error executing workflow ${workflow.workflowId}:`,
				error,
			);
		}
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// App bootstrap
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
	const app = express();

	app.use(express.json());

	// ── CORS (for UI on port 3000) ──────────────────────────────────────────
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader(
			'Access-Control-Allow-Methods',
			'GET, POST, PUT, PATCH, DELETE, OPTIONS',
		);
		res.setHeader(
			'Access-Control-Allow-Headers',
			'Content-Type, Authorization',
		);
		if (req.method === 'OPTIONS') {
			res.sendStatus(200);
			return;
		}
		next();
	});

	app.post('/api/webhook', async (req, res) => {
		const webhookResponse = await processWebhook(
			corsair,
			req.headers,
			req.body,
		);

		// Respond immediately — webhook senders expect a fast 200 OK
		res.json(webhookResponse.response);

		// Dispatch to any stored webhook-triggered workflows (fire and forget)
		if (webhookResponse.plugin && webhookResponse.action) {
			dispatchWebhookWorkflows(
				webhookResponse.plugin,
				webhookResponse.action,
				webhookResponse.body,
			).catch((err) => console.error('[webhook] Dispatch error:', err));
		}
	});

	// ── Agent trigger endpoint ──────────────────────────────────────────────
	app.post('/trigger', async (req, res) => {
		console.log('[server] /trigger endpoint called');
		console.log('[server] Request body keys:', Object.keys(req.body || {}));

		try {
			const { prompt } = req.body;
			console.log(
				'[server] Extracted prompt:',
				prompt ? `"${prompt.substring(0, 50)}..."` : 'undefined',
			);

			if (!prompt || typeof prompt !== 'string') {
				console.log('[server] Invalid prompt, returning 400');
				return res.status(400).json({ error: 'Missing or invalid prompt' });
			}

			console.log(`[server] Received prompt: ${prompt}`);
			console.log('[server] Calling runAgent...');
			const agentStartTime = Date.now();

			const initialMessages: ModelMessage[] = [
				{ role: 'user', content: prompt },
			];

			const agentOutput = await runAgent(initialMessages);
			const agentDuration = Date.now() - agentStartTime;
			console.log(
				`[server] runAgent completed in ${agentDuration}ms, result type:`,
				agentOutput.type,
			);

			// Agent needs a human answer before it can proceed
			if (agentOutput.type === 'needs_input') {
				const [session] = await db
					.insert(pendingSessions)
					.values({
						messages: agentOutput.pendingMessages as object[],
						toolCallId: agentOutput.toolCallId,
						toolName: agentOutput.toolName,
					})
					.returning({ id: pendingSessions.id });

				return res.json({
					type: 'needs_input',
					question: agentOutput.question,
					sessionId: session!.id,
				});
			}

			return handleAgentResult(agentOutput, res);
		} catch (error) {
			console.error('[server] Error processing request:', error);
			return res.status(500).json({
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	});

	// ── Resume endpoint (human answered the agent's question) ──────────────
	app.post('/trigger/resume', async (req, res) => {
		console.log('[server] /trigger/resume endpoint called');

		try {
			const { sessionId, answer } = req.body;

			if (!sessionId || typeof sessionId !== 'string') {
				return res.status(400).json({ error: 'Missing or invalid sessionId' });
			}
			if (!answer || typeof answer !== 'string') {
				return res.status(400).json({ error: 'Missing or invalid answer' });
			}

			const [session] = await db
				.select()
				.from(pendingSessions)
				.where(eq(pendingSessions.id, sessionId))
				.limit(1);

			if (!session) {
				return res.status(404).json({ error: 'Session not found' });
			}

			const resumeMessages = [
				...(session.messages as ModelMessage[]),
				{
					role: 'tool',
					content: [
						{
							type: 'tool-result',
							toolCallId: session.toolCallId,
							toolName: session.toolName,
							output: { type: 'text', value: answer },
						},
					],
				} satisfies ToolModelMessage,
			];

			console.log(
				`[server] Resuming session ${sessionId} with answer: "${answer.substring(0, 80)}"`,
			);

			const agentOutput = await runAgent(resumeMessages);

			// Clean up the session regardless of outcome
			await db.delete(pendingSessions).where(eq(pendingSessions.id, sessionId));

			// The agent might need another clarification
			if (agentOutput.type === 'needs_input') {
				const [newSession] = await db
					.insert(pendingSessions)
					.values({
						messages: agentOutput.pendingMessages as object[],
						toolCallId: agentOutput.toolCallId,
						toolName: agentOutput.toolName,
					})
					.returning({ id: pendingSessions.id });

				return res.json({
					type: 'needs_input',
					question: agentOutput.question,
					sessionId: newSession!.id,
				});
			}

			return handleAgentResult(agentOutput, res);
		} catch (error) {
			console.error('[server] Error resuming session:', error);
			return res.status(500).json({
				error: error instanceof Error ? error.message : 'Unknown error',
			});
		}
	});

	// ── Plugin status API ─────────────────────────────────────────────────────

	/** Return status for every configured plugin */
	app.get('/api/plugins', async (_req, res) => {
		try {
			const statuses = await getAllPluginsStatus();
			return res.json(statuses);
		} catch (e) {
			return res
				.status(500)
				.json({ error: e instanceof Error ? e.message : String(e) });
		}
	});

	/** Return status for a single plugin */
	app.get('/api/plugins/:plugin', async (req, res) => {
		try {
			const status = await getPluginStatus(req.params.plugin!);
			if (!status) {
				return res.status(404).json({
					error: `Plugin "${req.params.plugin}" not found or not configured`,
				});
			}
			return res.json(status);
		} catch (e) {
			return res
				.status(500)
				.json({ error: e instanceof Error ? e.message : String(e) });
		}
	});

	/**
	 * Set a single field for a plugin.
	 * Body: { field: string, value: string, level: 'account' | 'integration' }
	 * The raw value is submitted directly by the user's browser and never
	 * passes through the agent's context.
	 */
	app.post('/api/plugins/:plugin/fields', async (req, res) => {
		try {
			const { field, value, level } = req.body as {
				field?: string;
				value?: string;
				level?: 'account' | 'integration';
			};

			if (!field || typeof field !== 'string') {
				return res.status(400).json({ error: 'Missing or invalid "field"' });
			}
			if (!value || typeof value !== 'string') {
				return res.status(400).json({ error: 'Missing or invalid "value"' });
			}
			if (level !== 'account' && level !== 'integration') {
				return res
					.status(400)
					.json({ error: '"level" must be "account" or "integration"' });
			}

			const result = await setPluginField(
				req.params.plugin!,
				field,
				value,
				level,
			);
			if (!result.success) {
				return res.status(400).json({ success: false, error: result.error });
			}
			return res.json({ success: true });
		} catch (e) {
			return res
				.status(500)
				.json({ error: e instanceof Error ? e.message : String(e) });
		}
	});

	// ── Plugin setup UI ───────────────────────────────────────────────────────

	/**
	 * Single setup page.
	 * Optional query params: ?plugin=slack  or  ?plugin=slack&field=api_key
	 * All rendering is done client-side; the server just returns the HTML shell.
	 */
	app.get('/setup', (_req, res) => {
		res.setHeader('Content-Type', 'text/html; charset=utf-8');
		res.send(getSetupPageHtml());
	});

	// ── tRPC router ───────────────────────────────────────────────────────────
	app.use(
		'/trpc',
		createExpressMiddleware({
			router: appRouter,
			createContext: () => ({}),
		}),
	);

	// ── Cron scheduler (runs every minute) ────────────────────────────────────
	cron.schedule('* * * * *', async () => {
		try {
			const workflowsToRun = await getWorkflowsToRun();

			for (const workflow of workflowsToRun) {
				console.log(`[cron] Executing workflow: ${workflow.workflowId}`);

				// Create execution record
				const execution = await createExecution(workflow.id, 'cron', 'running');

				try {
					// Execute the workflow
					const result = await executeWorkflow(workflow.name, workflow.code);

					if (result.success) {
						await updateExecution(execution.id, 'success', {
							output: result.output,
						});
						console.log(
							`[cron] Workflow ${workflow.workflowId} executed successfully`,
						);
					} else {
						await updateExecution(
							execution.id,
							'failed',
							undefined,
							result.error,
						);
						console.error(
							`[cron] Workflow ${workflow.workflowId} failed:`,
							result.error,
						);
					}

					// Update next run time
					const workflowRecord = await db
						.select()
						.from(workflows)
						.where(eq(workflows.id, workflow.id))
						.limit(1);

					if (
						workflowRecord[0]?.triggerConfig &&
						typeof workflowRecord[0].triggerConfig === 'object'
					) {
						const triggerConfig = workflowRecord[0].triggerConfig as {
							cron?: string;
						};
						if (triggerConfig.cron) {
							await updateWorkflowNextRun(workflow.id, triggerConfig.cron);
						}
					}
				} catch (error) {
					const errorMessage =
						error instanceof Error ? error.message : String(error);
					await updateExecution(
						execution.id,
						'failed',
						undefined,
						errorMessage,
					);
					console.error(
						`[cron] Error executing workflow ${workflow.workflowId}:`,
						error,
					);
				}
			}
		} catch (error) {
			console.error('[cron] Error in cron scheduler:', error);
		}
	});

	// ─────────────────────────────────────────────────────────────────────────
	const PORT = Number(process.env.PORT ?? 3001);
	app.listen(PORT, () => {
		console.log(`[server] Listening on http://localhost:${PORT}`);
		console.log(
			`[server] Trigger agent with: curl -X POST http://localhost:${PORT}/trigger -H "Content-Type: application/json" -d '{"prompt":"your prompt here"}'`,
		);
	});
}

main().catch((e) => {
	console.error('[server] Fatal:', e);
	process.exit(1);
});
