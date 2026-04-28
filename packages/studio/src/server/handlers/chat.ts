import { buildCorsairToolDefs } from '@corsair-dev/mcp';
import type { CoreMessage, LanguageModel, ToolSet } from 'ai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { readJsonBody } from '../router.js';
import type { HandlerFn } from '../types.js';

function buildAiTools(corsairClient: Record<string, unknown>): ToolSet {
	const defs = buildCorsairToolDefs({ corsair: corsairClient, setup: false });
	const tools: ToolSet = {};
	for (const def of defs) {
		tools[def.name] = tool({
			description: def.description,
			parameters: z.object(def.shape),
			execute: async (args) => {
				const result = await def.handler(
					args as unknown as Record<string, unknown>,
				);
				const texts = result.content.filter(
					(c): c is { type: 'text'; text: string } => c.type === 'text',
				);
				if (result.isError) {
					throw new Error(texts.map((c) => c.text).join('\n'));
				}
				const text = texts[0]?.text ?? '';
				try {
					return JSON.parse(text);
				} catch {
					return text;
				}
			},
		});
	}
	return tools;
}

async function resolveModel(): Promise<LanguageModel> {
	const model = process.env.CORSAIR_CHAT_MODEL;

	if (process.env.OPENAI_API_KEY) {
		const { openai } = await import('@ai-sdk/openai');
		return openai(model ?? 'gpt-4o-mini');
	}

	if (process.env.ANTHROPIC_API_KEY) {
		const { anthropic } = await import('@ai-sdk/anthropic');
		return anthropic(model ?? 'claude-3-5-sonnet-20241022');
	}

	if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
		const { google } = await import('@ai-sdk/google');
		return google(model ?? 'gemini-2.0-flash');
	}

	if (process.env.GROQ_API_KEY) {
		const { createGroq } = await import('@ai-sdk/groq');
		return createGroq()(model ?? 'llama-3.3-70b-versatile');
	}

	throw new Error(
		'No AI provider configured. Set one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or GROQ_API_KEY.',
	);
}

type StreamPart = {
	type: string;
	textDelta?: string;
	toolName?: string;
	args?: unknown;
	result?: unknown;
};

export const chatHandler: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const messages = (body.messages ?? []) as CoreMessage[];
	const tenant = body.tenant ? String(body.tenant) : undefined;

	let model: LanguageModel;
	try {
		model = await resolveModel();
	} catch (err) {
		ctx.res.writeHead(400, { 'content-type': 'application/json' });
		ctx.res.end(JSON.stringify({ error: (err as Error).message }));
		return;
	}

	const handle = await ctx.getCorsair();
	const client = handle.resolveClient(tenant);
	const tools = buildAiTools(client);

	ctx.res.writeHead(200, {
		'content-type': 'text/event-stream',
		'cache-control': 'no-cache',
		connection: 'keep-alive',
	});

	const send = (data: unknown) => {
		ctx.res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	try {
		const result = streamText({
			model,
			system:
				"You are a helpful assistant with access to Corsair tools. Use the tools to answer questions about the user's integrations and data.",
			messages,
			tools,
			maxSteps: 10,
		});

		for await (const raw of result.fullStream) {
			const part = raw as StreamPart;
			if (part.type === 'text-delta') {
				send({ type: 'text', text: part.textDelta });
			} else if (part.type === 'tool-call') {
				send({ type: 'tool-start', name: part.toolName, args: part.args });
			} else if (part.type === 'tool-result') {
				send({ type: 'tool-end', name: part.toolName, result: part.result });
			} else if (part.type === 'finish') {
				send({ type: 'done' });
			}
		}
	} catch (err) {
		send({ type: 'error', message: (err as Error).message });
	} finally {
		ctx.res.end();
	}
};
