import { defineConfig } from 'tsup';

export default defineConfig({
	clean: false,
	dts: false,
	format: ['esm'],
	target: 'esnext',
	platform: 'node',
	bundle: true,
	splitting: true,
	minify: true,
	outDir: 'dist',
	// The Modal SDK (gRPC + protobuf, several MB) stays an external dependency
	// and is only imported when an operation runs (see client.ts).
	external: ['corsair', 'zod', 'modal'],
	entry: ['index.ts'],
});
