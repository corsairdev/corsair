import type { tool as AgentsTool, Tool } from '@openai/agents';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { BaseMcpOptions } from '../core/adapters.js';
import { buildCorsairToolDefs } from '../core/tools.js';

export type OpenAIAgentsProviderOptions = BaseMcpOptions & {
	tool: typeof AgentsTool;
};

export class OpenAIAgentsProvider {
	readonly name = 'openai-agents';

	build(options: OpenAIAgentsProviderOptions): Tool<unknown>[] {
		const { tool, ...mcpOptions } = options;
		return buildCorsairToolDefs(mcpOptions).map((def) => {
			const jsonSchema = zodToJsonSchema(z.object(def.shape));
			const shapeKeys = new Set(Object.keys(def.shape));

			// zodToJsonSchema produces a structurally valid JsonObjectSchemaNonStrict at
			// runtime, but its static type is broader than what the SDK expects. Cast needed.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return tool({
				name: def.name,
				description: def.description,
				parameters: jsonSchema as any,
				strict: false,
				execute: async (input) => {
					try {
						const raw = (
							typeof input === 'string' ? JSON.parse(input) : input
						) as Record<string, unknown>;

						// Models sometimes flatten nested args to top-level.
						// Collect unknown keys and merge them into `args` if the shape has one.
						if (shapeKeys.has('args') && typeof raw.args !== 'object') {
							const extra: Record<string, unknown> = {};
							for (const [k, v] of Object.entries(raw)) {
								if (!shapeKeys.has(k)) extra[k] = v;
							}
							if (Object.keys(extra).length > 0) raw.args = extra;
						}

						const args = z.object(def.shape).parse(raw);
						const result = await def.handler(args);
						return result.content
							.filter((c) => c.type === 'text')
							.map((c) => ('text' in c ? c.text : ''))
							.join('\n');
					} catch (err) {
						const message = err instanceof Error ? err.message : String(err);
						return `Error: ${message}`;
					}
				},
			});
		});
	}
}
