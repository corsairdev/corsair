import { buildCorsairToolDefs } from '@corsair-dev/mcp';
import type { CoreMessage, LanguageModel, ToolSet } from 'ai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { appendMessage, chatExists, getMessages } from '../chat-store.js';
import type { StoredMessage, StoredMsgBlock } from '../chat-store.js';
import { readJsonBody } from '../router.js';
import type { HandlerFn } from '../types.js';

function toAiMessages(stored: StoredMessage[]): CoreMessage[] {
	const result: CoreMessage[] = [];
	for (const msg of stored) {
		if (msg.role === 'user') {
			const text = msg.blocks
				.filter((b): b is { type: 'text'; content: string } => b.type === 'text')
				.map((b) => b.content)
				.join('');
			result.push({ role: 'user', content: text });
		} else {
			const textBlocks = msg.blocks.filter(
				(b): b is { type: 'text'; content: string } => b.type === 'text',
			);
			const toolBlocks = msg.blocks.filter(
				(b): b is { type: 'tool'; name: string; args: unknown; result: unknown } =>
					b.type === 'tool' && (b as { result?: unknown }).result !== undefined,
			);

			if (toolBlocks.length === 0) {
				result.push({
					role: 'assistant',
					content: textBlocks.map((b) => b.content).join(''),
				});
			} else {
				const ids = toolBlocks.map(() => crypto.randomUUID());
				result.push({
					role: 'assistant',
					content: [
						...textBlocks.map((b) => ({ type: 'text' as const, text: b.content })),
						...toolBlocks.map((b, i) => ({
							type: 'tool-call' as const,
							toolCallId: ids[i]!,
							toolName: b.name,
							args: b.args as Record<string, unknown>,
						})),
					],
				});
				result.push({
					role: 'tool',
					content: toolBlocks.map((b, i) => ({
						type: 'tool-result' as const,
						toolCallId: ids[i]!,
						toolName: b.name,
						result: b.result,
					})),
				});
			}
		}
	}
	return result;
}

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
	console.log(
		'[corsair:chat] resolving model — OPENAI_API_KEY:',
		!!process.env.OPENAI_API_KEY,
		'| ANTHROPIC_API_KEY:',
		!!process.env.ANTHROPIC_API_KEY,
		'| CORSAIR_CHAT_MODEL:',
		model ?? '(default)',
	);

	if (process.env.OPENAI_API_KEY) {
		const { openai } = await import('@ai-sdk/openai');
		console.log('[corsair:chat] using openai:', model ?? 'gpt-4o-mini');
		return openai(model ?? 'gpt-4o-mini');
	}

	if (process.env.ANTHROPIC_API_KEY) {
		const { anthropic } = await import('@ai-sdk/anthropic');
		console.log(
			'[corsair:chat] using anthropic:',
			model ?? 'claude-sonnet-4-6',
		);
		return anthropic(model ?? 'claude-sonnet-4-6');
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
	console.log('[corsair:chat] request received');
	const body = await readJsonBody(ctx.req);
	const tenant = body.tenant ? String(body.tenant) : undefined;
	const chatId = body.chatId ? String(body.chatId) : undefined;
	const newUserText = body.message ? String(body.message) : undefined;

	// Load history from the store — don't trust the client to serialize tool calls
	const storedHistory = chatId && chatExists(chatId) ? getMessages(chatId) : [];
	const messages: CoreMessage[] = toAiMessages(storedHistory);
	if (newUserText) {
		messages.push({ role: 'user', content: newUserText });
	}

	console.log(
		'[corsair:chat] history:',
		storedHistory.length,
		'stored msgs →',
		messages.length,
		'AI msgs | tenant:',
		tenant ?? '(none)',
		'| chatId:',
		chatId ?? '(none)',
	);

	let model: LanguageModel;
	try {
		model = await resolveModel();
	} catch (err) {
		console.error(
			'[corsair:chat] model resolution failed:',
			(err as Error).message,
		);
		ctx.res.writeHead(400, { 'content-type': 'application/json' });
		ctx.res.end(JSON.stringify({ error: (err as Error).message }));
		return;
	}

	const handle = await ctx.getCorsair();
	const client = handle.resolveClient(tenant);
	const tools = buildAiTools(client);

	const userMsgId = crypto.randomUUID();
	if (chatId && chatExists(chatId) && newUserText) {
		try {
			appendMessage(chatId, userMsgId, 'user', [{ type: 'text', content: newUserText }]);
		} catch (err) {
			console.error('[corsair:chat] failed to save user message:', err);
		}
	}

	ctx.res.writeHead(200, {
		'content-type': 'text/event-stream',
		'cache-control': 'no-cache',
		connection: 'keep-alive',
	});

	const send = (data: unknown) => {
		ctx.res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	const assistantBlocks: StoredMsgBlock[] = [];

	console.log('[corsair:chat] starting stream');
	try {
		const result = streamText({
			model,
			system:
				"You are a helpful assistant with access to Corsair tools. Use the tools to answer questions about the user's integrations and data. Use list_operations to get the exact endpoint names.",
			messages,
			tools,
			maxSteps: 10,
		});

		for await (const raw of result.fullStream) {
			const part = raw as StreamPart;
			if (part.type === 'text-delta') {
				send({ type: 'text', text: part.textDelta });
				const last = assistantBlocks[assistantBlocks.length - 1];
				if (last?.type === 'text') {
					last.content += part.textDelta ?? '';
				} else {
					assistantBlocks.push({ type: 'text', content: part.textDelta ?? '' });
				}
			} else if (part.type === 'tool-call') {
				send({ type: 'tool-start', name: part.toolName, args: part.args });
				assistantBlocks.push({
					type: 'tool',
					name: part.toolName ?? '',
					args: part.args,
				});
			} else if (part.type === 'tool-result') {
				send({ type: 'tool-end', name: part.toolName, result: part.result });
				const idx = assistantBlocks.findLastIndex(
					(b): b is Extract<StoredMsgBlock, { type: 'tool' }> =>
						b.type === 'tool' &&
						(b as Extract<StoredMsgBlock, { type: 'tool' }>).name ===
							part.toolName &&
						(b as Extract<StoredMsgBlock, { type: 'tool' }>).result ===
							undefined,
				);
				if (idx >= 0) {
					(
						assistantBlocks[idx] as Extract<StoredMsgBlock, { type: 'tool' }>
					).result = part.result;
				}
			} else if (part.type === 'finish') {
				send({ type: 'done' });
			}
		}
	} catch (err) {
		console.error('[corsair:chat] stream error:', (err as Error).message);
		send({ type: 'error', message: (err as Error).message });
	} finally {
		// Persist the assistant response
		if (chatId && chatExists(chatId) && assistantBlocks.length > 0) {
			try {
				appendMessage(
					chatId,
					crypto.randomUUID(),
					'assistant',
					assistantBlocks,
				);
			} catch (err) {
				console.error('[corsair:chat] failed to save assistant message:', err);
			}
		}
		console.log('[corsair:chat] done');
		ctx.res.end();
	}
};
