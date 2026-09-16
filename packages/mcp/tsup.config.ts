import { defineConfig } from 'tsup';

export default defineConfig({
	entry: [
		'src/index.ts',
		'src/mastra.ts',
		'src/langchain.ts',
		'src/llamaindex.ts',
		'src/bin.ts',
	],
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	dts: false,
	clean: true,
	outDir: 'dist',
	external: [
		'corsair',
		'@corsair-dev/mastra',
		'@corsair-dev/langchain',
		'@corsair-dev/llamaindex',
		'@modelcontextprotocol/sdk',
		'better-sqlite3',
	],
	noExternal: ['@ai-sdk/mcp'],
});
