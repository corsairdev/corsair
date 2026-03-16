import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { BaseProvider } from '../core/provider.js';
import type { CorsairToolDef } from '../core/tools.js';

type AnthropicTool = {
	type: 'custom';
	name: string;
	description: string;
	input_schema: { type: 'object'; [key: string]: unknown };
	run: (args: Record<string, unknown>) => Promise<string>;
	parse: (content: unknown) => Record<string, unknown>;
};

export class AnthropicProvider extends BaseProvider<AnthropicTool> {
	readonly name = 'anthropic';

	wrapTool(def: CorsairToolDef): AnthropicTool {
		const schema = zodToJsonSchema(z.object(def.shape), { target: 'openApi3' });
		return {
			type: 'custom',
			name: def.name,
			description: def.description,
			input_schema: schema as { type: 'object'; [key: string]: unknown },
			run: async (args) => {
				const result = await def.handler(args);
				return result.content
					.filter((c) => c.type === 'text')
					.map((c) => ('text' in c ? c.text : ''))
					.join('\n');
			},
			parse: (content) =>
				z.object(def.shape).parse(content) as Record<string, unknown>,
		};
	}
}
