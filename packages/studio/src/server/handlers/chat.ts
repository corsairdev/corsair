import { buildCorsairToolDefs } from '@corsair-dev/mcp';
import type { CoreMessage, LanguageModel, ToolSet } from 'ai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { appendMessage, chatExists, getMessages } from '../chat-store.js';
import type { StoredMessage, StoredMsgBlock } from '../chat-store.js';
import { readJsonBody } from '../router.js';
import type { HandlerFn } from '../types.js';

type TextBlock = Extract<StoredMsgBlock, { type: 'text' }>;
type ToolBlock = Extract<StoredMsgBlock, { type: 'tool' }>;
type CompletedToolBlock = ToolBlock & { result: unknown };
type AssistantContentPart =
	| { type: 'text'; text: string }
	| {
			type: 'tool-call';
			toolCallId: string;
			toolName: string;
			args: Record<string, unknown>;
	  };
type ToolContentPart = {
	type: 'tool-result';
	toolCallId: string;
	toolName: string;
	result: unknown;
};

function isTextBlock(block: StoredMsgBlock): block is TextBlock {
	return block.type === 'text';
}

function isCompletedToolBlock(
	block: StoredMsgBlock,
): block is CompletedToolBlock {
	return block.type === 'tool' && block.result !== undefined;
}

function isPendingToolBlock(block: StoredMsgBlock): block is ToolBlock {
	return block.type === 'tool' && block.result === undefined;
}

function joinTextBlocks(blocks: TextBlock[]): string {
	return blocks.map((block) => block.content).join('');
}

function toToolArgs(args: unknown): Record<string, unknown> {
	if (args && typeof args === 'object') {
		const toolArgs: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(args)) {
			toolArgs[key] = value;
		}
		return toolArgs;
	}
	return {};
}

function makeTextPart(block: TextBlock): AssistantContentPart {
	return { type: 'text', text: block.content };
}

function makeToolCallPart(
	toolCallId: string,
	block: CompletedToolBlock,
): AssistantContentPart {
	return {
		type: 'tool-call',
		toolCallId,
		toolName: block.name,
		args: toToolArgs(block.args),
	};
}

function makeToolResultPart(
	toolCallId: string,
	block: CompletedToolBlock,
): ToolContentPart {
	return {
		type: 'tool-result',
		toolCallId,
		toolName: block.name,
		result: block.result,
	};
}

function findPendingToolBlockIndex(
	blocks: StoredMsgBlock[],
	toolName: string | undefined,
): number {
	return blocks.findLastIndex(
		(block) => isPendingToolBlock(block) && block.name === toolName,
	);
}

function toAiMessages(stored: StoredMessage[]): CoreMessage[] {
	const result: CoreMessage[] = [];
	for (const msg of stored) {
		const textBlocks = msg.blocks.filter(isTextBlock);
		const text = joinTextBlocks(textBlocks);

		if (msg.role === 'user') {
			result.push({ role: 'user', content: text });
			continue;
		}

		const toolBlocks = msg.blocks.filter(isCompletedToolBlock);
		if (toolBlocks.length === 0) {
			result.push({ role: 'assistant', content: text });
			continue;
		}

		const toolCallIds = toolBlocks.map(() => crypto.randomUUID());
		const assistantParts: AssistantContentPart[] = textBlocks.map(makeTextPart);
		const toolParts: ToolContentPart[] = [];

		for (const [index, block] of toolBlocks.entries()) {
			const toolCallId = toolCallIds[index];
			if (!toolCallId) {
				continue;
			}
			assistantParts.push(makeToolCallPart(toolCallId, block));
			toolParts.push(makeToolResultPart(toolCallId, block));
		}

		result.push({ role: 'assistant', content: assistantParts });
		result.push({ role: 'tool', content: toolParts });
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
				const result = await def.handler(args);
				const texts = result.content.filter((c) => c.type === 'text');
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

function errorMessage(err: unknown): string {
	return err instanceof Error ? err.message : String(err);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function parseStreamPart(raw: unknown): StreamPart | null {
	if (!isObject(raw) || typeof raw.type !== 'string') {
		return null;
	}

	const textDelta =
		typeof raw.textDelta === 'string' ? raw.textDelta : undefined;
	const toolName = typeof raw.toolName === 'string' ? raw.toolName : undefined;
	return {
		type: raw.type,
		textDelta,
		toolName,
		args: raw.args,
		result: raw.result,
	};
}

export const chatHandler: HandlerFn = async (ctx) => {
	console.log('[corsair:chat] request received');
	const body = await readJsonBody(ctx.req);
	const tenant = body.tenant ? String(body.tenant) : undefined;
	const chatId = body.chatId ? String(body.chatId) : undefined;
	const newUserText = body.message ? String(body.message) : undefined;

	// Load history from the store — don't trust the client to serialize tool calls
	const storedHistory =
		chatId && (await chatExists(chatId)) ? await getMessages(chatId) : [];
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
		const message = errorMessage(err);
		console.error('[corsair:chat] model resolution failed:', message);
		ctx.res.writeHead(400, { 'content-type': 'application/json' });
		ctx.res.end(JSON.stringify({ error: message }));
		return;
	}

	const handle = await ctx.getCorsair();
	const client = handle.resolveClient(tenant);
	const tools = buildAiTools(client);

	const userMsgId = crypto.randomUUID();
	if (chatId && (await chatExists(chatId)) && newUserText) {
		try {
			await appendMessage(chatId, userMsgId, 'user', [
				{ type: 'text', content: newUserText },
			]);
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
			const part = parseStreamPart(raw);
			if (!part) {
				continue;
			}

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
				const idx = findPendingToolBlockIndex(assistantBlocks, part.toolName);
				const block = idx >= 0 ? assistantBlocks[idx] : undefined;
				if (block && isPendingToolBlock(block)) {
					block.result = part.result;
				}
			} else if (part.type === 'finish') {
				send({ type: 'done' });
			}
		}
	} catch (err) {
		const message = errorMessage(err);
		console.error('[corsair:chat] stream error:', message);
		send({ type: 'error', message });
	} finally {
		// Persist the assistant response
		if (chatId && (await chatExists(chatId)) && assistantBlocks.length > 0) {
			try {
				await appendMessage(
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
