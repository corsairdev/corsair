import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { Tool } from '@anthropic-ai/sdk/resources';
import { BaseProvider } from '../core/provider.js';
import type { CorsairToolDef } from '../core/tools.js';

// Extends the SDK's Tool type with helpers for use in a manual agent loop:
// - run: executes the tool and returns a plain string result
// - parse: validates raw model input against the tool's schema
type CorsairAnthropicTool = Tool & {
	run: (args: Record<string, unknown>) => Promise<string>;
	parse: (content: unknown) => Record<string, unknown>;
};

export class AnthropicProvider extends BaseProvider<CorsairAnthropicTool> {
	readonly name = 'anthropic';

	wrapTool(def: CorsairToolDef): CorsairAnthropicTool {
		const schema = zodToJsonSchema(z.object(def.shape), { target: 'openApi3' });
		return {
			type: 'custom',
			name: def.name,
			description: def.description,
			input_schema: schema as Tool.InputSchema,
			run: async (args) => {
				try {
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
			parse: (content) =>
				z.object(def.shape).parse(content) as Record<string, unknown>,
		};
	}
}
