import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { BaseProvider } from '../core/provider.js';
import type { CorsairToolDef } from '../core/tools.js';



export type CorsairOllamaTool = {
    type: 'function';
    function: {
        name: string;
        description: string;
        parameters: Record<string, unknown>;
    };
    execute: (args: Record<string, unknown>) => Promise<string>;
};


// Represents a tool compatible with Ollama's OpenAI-style API.
// Includes an `execute` method to simplify runner implementations.

export class OllamaProvider extends BaseProvider<CorsairOllamaTool> {
    readonly name = 'ollama';

    wrapTool(def: CorsairToolDef): CorsairOllamaTool {
        const schema = zodToJsonSchema(z.object(def.shape));

        return {
            type: 'function',
            function: {
                name: def.name,
                description: def.description,
                parameters: schema as Record<string, unknown>,
            },
            /**
             * The `execute` helper provides a simplified execution interface for runners.
             * It handles:
             * 1. Parsing arguments (handles both object and JSON string inputs).
             * 2. Validation against the tool's Zod schema.
             * 3. Execution of the underlying Corsair tool handler.
             * 4. Extraction and concatenation of text results into a single string.
             * 5. Graceful error handling for robust integration.
             */
            execute: async (args) => {
                try {
                    const raw = (
                        typeof args === 'string' ? JSON.parse(args) : args
                    ) as Record<string, unknown>;
                    const validated = z.object(def.shape).parse(raw);
                    const result = await def.handler(validated);
                    return result.content
                        .filter((c) => c.type === 'text')
                        .map((c) => ('text' in c ? c.text : ''))
                        .join('\n');
                } catch (err) {
                    const message = err instanceof Error ? err.message : String(err);
                    return `Error: ${message}`;
                }
            },
        };
    }
}