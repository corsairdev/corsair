import { z } from 'zod';
import type { BaseMcpOptions } from '../core/adapters.js';
import { buildCorsairToolDefs } from '../core/tools.js';

type ToolFn<T> = (config: {
	name: string;
	description: string;
	parameters: z.ZodObject<z.ZodRawShape>;
	execute: (args: Record<string, unknown>) => Promise<string>;
}) => T;

export class OpenAIAgentsProvider {
	readonly name = 'openai-agents';

	// `toolFn` must be the `tool` function imported from `@openai/agents` in the
	// caller's context. Passing it explicitly avoids peer-dep version mismatches
	// that occur with dynamic imports inside the mcp package.
	build<T>(options: BaseMcpOptions, toolFn: ToolFn<T>): T[] {
		return buildCorsairToolDefs(options).map((def) => {
			// OpenAI structured outputs requires:
			// 1. All properties in 'required' — convert optional fields to
			//    nullable-with-default so they satisfy that constraint.
			// 2. additionalProperties: false on every object — z.record(z.unknown())
			//    produces an open object schema which OpenAI rejects. Replace those
			//    fields with z.string() (JSON-encoded) and parse them back before
			//    invoking the handler.
			const recordKeys = new Set<string>();

			const normalizeSchema = (schema: z.ZodTypeAny): z.ZodTypeAny => {
				if (schema instanceof z.ZodOptional) {
					return normalizeSchema(schema.unwrap()).nullable().default(null);
				}
				if (schema instanceof z.ZodDefault) {
					const inner = schema._def.innerType;
					if (inner instanceof z.ZodRecord) {
						return z.string().default('{}').describe('JSON-encoded arguments object');
					}
					return schema;
				}
				if (schema instanceof z.ZodRecord) {
					return z.string().describe('JSON-encoded arguments object');
				}
				return schema;
			};

			const shape = Object.fromEntries(
				Object.entries(def.shape).map(([key, schema]) => {
					const inner =
						schema instanceof z.ZodDefault ? schema._def.innerType : schema;
					if (inner instanceof z.ZodRecord) recordKeys.add(key);
					return [key, normalizeSchema(schema as z.ZodTypeAny)];
				}),
			);

			return toolFn({
				name: def.name,
				description: def.description,
				parameters: z.object(shape),
				execute: async (args) => {
					const handlerArgs = Object.fromEntries(
						Object.entries(args).map(([key, value]) => {
							if (recordKeys.has(key) && typeof value === 'string') {
								try {
									return [key, JSON.parse(value)];
								} catch {
									return [key, {}];
								}
							}
							return [key, value];
						}),
					);
					const result = await def.handler(handlerArgs);
					return result.content
						.filter((c) => c.type === 'text')
						.map((c) => ('text' in c ? c.text : ''))
						.join('\n');
				},
			});
		});
	}
}
