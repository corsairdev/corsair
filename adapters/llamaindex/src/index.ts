/**
 * `@corsair-dev/llamaindex` — Corsair tools for LlamaIndex.TS. Turns a Corsair
 * instance's API operations into LlamaIndex tools, backed by managed OAuth and
 * with credentials that stay in your own database.
 *
 * @packageDocumentation
 */

import type { BaseToolWithCall } from '@llamaindex/core/llms';
import type { AnyCorsairInstance, BuildCorsairToolsOptions } from 'corsair';
import { buildCorsairTools } from 'corsair';

export interface CorsairToolsOptions extends BuildCorsairToolsOptions {
	/** The value returned by `createCorsair()` (or `corsair.withTenant(...)`). */
	corsair: AnyCorsairInstance;
}

/**
 * Builds LlamaIndex tools for a Corsair instance's API operations — one tool per
 * operation — ready to hand to `agent({ tools })`. Scope which operations with
 * `plugin`, `operations`, and `tenantId`.
 *
 * @example
 * ```ts
 * import { agent } from '@llamaindex/workflow';
 * import { openai } from '@llamaindex/openai';
 * import { corsairTools } from '@corsair-dev/llamaindex';
 *
 * const tools = await corsairTools({ corsair, plugin: 'slack' });
 * const slackAgent = agent({ tools, llm: openai({ model: 'gpt-4.1-mini' }) });
 * ```
 */
export async function corsairTools(
	options: CorsairToolsOptions,
): Promise<BaseToolWithCall[]> {
	const { corsair, ...build } = options;
	// Dynamic import keeps the optional peer out of the static graph, so this
	// package can be re-exported without forcing @llamaindex/core on every consumer.
	const { tool } = await import('@llamaindex/core/tools').catch((err) => {
		throw new Error(
			'@corsair-dev/llamaindex needs "@llamaindex/core" installed as a peer dependency.',
			{ cause: err },
		);
	});
	return buildCorsairTools(corsair, build).map((op) =>
		tool({
			name: op.name,
			description: op.description,
			// Corsair is on Zod v4, which @llamaindex/core accepts directly.
			parameters: op.schema,
			// args is typed as unknown by the LlamaIndex tool callback signature;
			// parse through op.schema so invalid model-generated inputs are rejected
			// before reaching the Corsair operation.
			execute: async (args: unknown) => {
				const parsed = op.schema.parse(args ?? {}) as Record<string, unknown>;
				return toContent(await op.execute(parsed));
			},
		}),
	);
}

/**
 * LlamaIndex tool output is model-visible; non-string results are JSON-encoded.
 * `result` is `unknown` because Corsair operation return shapes vary per plugin.
 */
function toContent(result: unknown): string {
	if (typeof result === 'string') return result;
	return JSON.stringify(result) ?? String(result); // JSON.stringify(undefined) is undefined
}
