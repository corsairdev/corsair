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
            execute: async (args) => {
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
        };
    }
}
