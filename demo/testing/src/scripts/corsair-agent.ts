/**
 * Corsair Agent Demo
 * Run: pnpm corsair-agent
 *
 * Interactive REPL that shows how to use @corsair-dev/agent on top of the
 * Corsair instance configured in src/server/corsair.ts.
 *
 * What this demonstrates:
 *   - createCorsairAgent() wiring
 *   - agent.chat() for conversational job creation and management
 *   - agent.jobs.list() / agent.jobs.get() for programmatic access
 *   - agent.handleWebhookEvent() for wiring into your webhook handler
 *   - agent.mcpTools for adding agent tools to your MCP server
 *
 * Environment variables required (add to .env):
 *   ANTHROPIC_API_KEY  — used for both system1 (haiku) and system2 (sonnet)
 *
 * You can use different API keys for each tier:
 *   CHEAP_API_KEY       → system1 (high volume, low cost)
 *   EXPENSIVE_API_KEY   → system2 (reasoning, low volume)
 */

import 'dotenv/config';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createCorsairAgent } from '@corsair-dev/agent';
import * as readline from 'readline';
import { corsair } from '@/server/corsair';

// ─────────────────────────────────────────────────────────────────────────────
// Setup
// ─────────────────────────────────────────────────────────────────────────────

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
	console.error('Error: ANTHROPIC_API_KEY is required in .env');
	process.exit(1);
}

const anthropic = createAnthropic({ apiKey });

const agent = createCorsairAgent(corsair, {
	// System 1: cheap, always-on gatekeeper for event filtering.
	// Runs on every incoming webhook event for jobs with llm-type filters.
	system1: anthropic('claude-haiku-4-5-20251001'),

	// System 2: reasoning engine for job creation, mutation, and self-healing.
	// Only invoked when something meaningful needs to happen.
	system2: anthropic('claude-sonnet-4-6'),

	// Optional: add tools that agent_node steps can use.
	// tools: {
	//   web_search: myWebSearchTool,
	// },
});

// ─────────────────────────────────────────────────────────────────────────────
// Wire webhook events (example — normally done in your actual webhook handler)
// ─────────────────────────────────────────────────────────────────────────────

// In your real server, call agent.handleWebhookEvent() from your webhook
// route after Corsair processes an incoming event:
//
//   app.post('/webhooks/slack', async (req, res) => {
//     const { path, event } = req.body;
//     await agent.handleWebhookEvent({ path, event });
//     res.json({ ok: true });
//   });
//
// The agent:
//   1. Checks for paused instances whose correlation_id matches the event
//      (e.g. user replied to a Slack message the agent sent)
//   2. Checks for competing register_trigger hooks (e.g. HubSpot deal opened)
//   3. Checks for job-level webhook hooks, runs any configured filters
//      (rule-based or LLM-based), then fires the workflow

// ─────────────────────────────────────────────────────────────────────────────
// Example: simulate a GitHub PR webhook to test a job without real webhooks
// ─────────────────────────────────────────────────────────────────────────────

async function simulateGitHubPR() {
	console.log('\n[simulate] Firing github.pull_request.opened event...');
	await agent.handleWebhookEvent({
		path: 'github.pull_request.opened',
		event: {
			title: 'Refactor payment processing pipeline',
			number: 42,
			author: 'alice',
			files_changed: ['src/payments/processor.ts', 'src/payments/validator.ts'],
			body: 'Rewrites the core payment processing logic for performance.',
			url: 'https://github.com/org/repo/pull/42',
		},
	});
	console.log(
		'[simulate] Done — check agent.instances.list() to see what ran\n',
	);
}

// ─────────────────────────────────────────────────────────────────────────────
// REPL
// ─────────────────────────────────────────────────────────────────────────────

const HELP = `
Commands:
  <prompt>         — Chat with the agent (create/modify/delete jobs)
  /jobs            — List all jobs
  /job <id>        — Show full job definition
  /instances       — List recent instances (running, paused, failed)
  /simulate-pr     — Fire a fake GitHub PR event to test a webhook job
  /help            — Show this menu
  /quit            — Exit

Example prompts:
  "Send me a Slack message when a PR is opened on our GitHub repo"
  "Every morning at 9am, post the 5 most recent GitHub issues to Slack"
  "Watch for any Slack message in #general that mentions 'urgent' and DM me"
  "Delete the daily issues job"
  "Change the morning digest to run at 8am instead"
`;

async function repl() {
	console.log('\n╔══════════════════════════════════════════╗');
	console.log('║       Corsair Agent — Interactive REPL   ║');
	console.log('╚══════════════════════════════════════════╝');
	console.log(HELP);

	console.log('Starting agent (running DB migrations, starting schedulers)...');
	await agent.start();
	console.log('Agent started. Type a prompt or /help.\n');

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		prompt: 'agent> ',
	});

	rl.prompt();

	rl.on('line', async (line: string) => {
		const input = line.trim();
		if (!input) {
			rl.prompt();
			return;
		}

		try {
			if (input === '/quit' || input === '/exit') {
				console.log('Stopping agent...');
				agent.stop();
				rl.close();
				process.exit(0);
			}

			if (input === '/help') {
				console.log(HELP);
				rl.prompt();
				return;
			}

			if (input === '/jobs') {
				const jobs = await agent.jobs.list();
				if (jobs.length === 0) {
					console.log(
						'No jobs yet. Try: "Send me a Slack message when a PR is opened"',
					);
				} else {
					console.log(`\n${jobs.length} job(s):\n`);
					for (const job of jobs) {
						const trigger =
							job.trigger.type === 'cron'
								? `cron: ${job.trigger.schedule}`
								: job.trigger.type === 'heartbeat'
									? `heartbeat: every ${job.trigger.interval}`
									: `webhook: ${job.trigger.plugin}.${job.trigger.event}`;
						console.log(`  ${job.id}  [${job.status}]  ${job.name}`);
						console.log(`           trigger: ${trigger}`);
					}
				}
				console.log();
				rl.prompt();
				return;
			}

			if (input.startsWith('/job ')) {
				const jobId = input.slice(5).trim();
				const job = await agent.jobs.get(jobId);
				if (!job) {
					console.log(`Job "${jobId}" not found.`);
				} else {
					console.log('\nJob definition:');
					console.log(JSON.stringify(job, null, 2));
				}
				console.log();
				rl.prompt();
				return;
			}

			if (input === '/instances') {
				const instances = await agent.instances.list();
				if (instances.length === 0) {
					console.log('No instances yet. Create a job and trigger it.');
				} else {
					console.log(
						`\n${instances.length} instance(s) (most recent first):\n`,
					);
					for (const inst of instances.slice(0, 10)) {
						const elapsed = inst.status === 'completed' || inst.status === 'failed'
							? `${Math.round((inst.updated_at.getTime() - inst.started_at.getTime()) / 1000)}s`
							: 'running';
						console.log(
							`  ${inst.id}  [${inst.status.padEnd(9)}]  job: ${inst.job_id}  msgs: ${inst.messages.length}  (${elapsed})`,
						);
					}
				}
				console.log();
				rl.prompt();
				return;
			}

			if (input === '/simulate-pr') {
				await simulateGitHubPR();
				rl.prompt();
				return;
			}

			// Everything else goes to agent.chat()
			console.log();
			const result = await agent.chat(input);
			switch (result.type) {
				case 'job_created':
					console.log(`✅ ${result.message}`);
					console.log(`   ID: ${result.job.id}`);
					break;
				case 'job_updated':
					console.log(`✏️  ${result.message}`);
					break;
				case 'job_deleted':
					console.log(`🗑️  ${result.message}`);
					break;
				case 'message':
					console.log(result.text);
					break;
			}
			console.log();
		} catch (err) {
			console.error(
				`\nError: ${err instanceof Error ? err.message : String(err)}\n`,
			);
		}

		rl.prompt();
	});

	rl.on('close', () => {
		agent.stop();
		process.exit(0);
	});
}

repl().catch((err: unknown) => {
	console.error('Fatal:', err);
	process.exit(1);
});
