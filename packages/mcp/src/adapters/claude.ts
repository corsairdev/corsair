import type { SdkMcpToolDefinition } from '@anthropic-ai/claude-agent-sdk';
import type { z } from 'zod';
import type { BaseMcpOptions } from '../core/adapters.js';
import { buildCorsairToolDefs } from '../core/tools.js';

// Note: ClaudeProvider does not extend BaseProvider because build() must be async
// (the Claude SDK's tool() function requires a dynamic import of an optional peer dep).
export class ClaudeProvider {
	readonly name = 'claude';

	async build(
		options: BaseMcpOptions,
	): Promise<SdkMcpToolDefinition<z.ZodRawShape>[]> {
		const { tool } = await import(
			/* webpackIgnore: true */ /* turbopackIgnore: true */ '@anthropic-ai/claude-agent-sdk'
		);
		return buildCorsairToolDefs(options).map((def) =>
			tool(def.name, def.description, def.shape, def.handler),
		);
	}
}
