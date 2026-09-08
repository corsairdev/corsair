/**
 * `@corsair-dev/langchain` — Corsair tools for LangChain.js / LangGraph. Turns a
 * Corsair instance's API operations into LangChain tools, backed by managed
 * OAuth and with credentials that stay in your own database.
 *
 * @packageDocumentation
 */

import type { DynamicStructuredTool } from '@langchain/core/tools';
import type { AnyCorsairInstance, BuildCorsairToolsOptions } from 'corsair';
import { buildCorsairTools } from 'corsair';

export interface CorsairToolsOptions extends BuildCorsairToolsOptions {
	/** The value returned by `createCorsair()` (or `corsair.withTenant(...)`). */
	corsair: AnyCorsairInstance;
}

/**
 * Builds LangChain tools for a Corsair instance's API operations — one tool per
 * operation — ready to hand to `createAgent({ tools })` or `model.bindTools(...)`.
 * Scope which operations with `plugin`, `operations`, and `tenantId`.
 *
 * @example
 * ```ts
 * import { createAgent } from 'langchain';
 * import { corsairTools } from '@corsair-dev/langchain';
 *
 * const tools = await corsairTools({ corsair, plugin: 'slack' });
 * const agent = createAgent({ model: 'openai:gpt-5.4-mini', tools });
 * ```
 */
export async function corsairTools(
	options: CorsairToolsOptions,
): Promise<DynamicStructuredTool[]> {
	const { corsair, ...build } = options;
	// Dynamic import keeps the optional peer out of the static graph, so this
	// package can be re-exported without forcing @langchain/core on every consumer.
	const { tool } = await import('@langchain/core/tools').catch((err) => {
		throw new Error(
			'@corsair-dev/langchain needs "@langchain/core" installed as a peer dependency.',
			{ cause: err },
		);
	});
	return buildCorsairTools(corsair, build).map((op) =>
		tool(
			// args: LangChain validates against op.schema before this callback;
			// Record<string,unknown> is as narrow as possible given ZodTypeAny.
			async (args: Record<string, unknown>) =>
				toContent(await op.execute(args)),
			{
				name: op.name,
				description: op.description,
				schema: op.schema,
			},
		),
	) as DynamicStructuredTool[]; // op.schema is ZodTypeAny; inference can't resolve DynamicStructuredTool
}

/**
 * LangChain tool content is model-visible text; non-string results are JSON-encoded.
 * `result` is `unknown` because Corsair operation return shapes vary per plugin.
 */
function toContent(result: unknown): string {
	if (typeof result === 'string') return result;
	return JSON.stringify(result) ?? String(result); // JSON.stringify(undefined) is undefined
}
