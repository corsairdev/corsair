import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	dts: false,
	clean: true,
	outDir: 'dist',
	external: ['@anthropic-ai/claude-agent-sdk', '@openai/agents'],
	noExternal: ['@ai-sdk/mcp'],
});
