import { z } from 'zod';
import type { BaseMcpOptions } from '../core/adapters.js';
import { callToolResultToText } from '../core/tool-result.js';
import { buildCorsairToolDefs } from '../core/tools.js';

// Note: MastraProvider does not extend BaseProvider because build() must be async
// (@mastra/core is an optional peer dep requiring dynamic import).
export class MastraProvider {
	readonly name = 'mastra';

	async build(options: BaseMcpOptions) {
		const { createTool } = await import(
			/* webpackIgnore: true */ /* turbopackIgnore: true */ '@mastra/core/tools'
		);
		return buildCorsairToolDefs(options).map((def) =>
			createTool({
				id: def.name,
				description: def.description,
				inputSchema: z.object(def.shape),
				execute: async (inputData) => {
					const result = await def.handler(
						inputData as Record<string, unknown>,
					);
					const text = callToolResultToText(result);
					try {
						return JSON.parse(text);
					} catch {
						return text;
					}
				},
			}),
		);
	}
}
