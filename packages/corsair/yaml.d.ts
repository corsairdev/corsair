// Allows TypeScript to accept `import config from './foo.yaml'`.
// The actual value is inlined at build time by the esbuild YAML plugin
// in tsup.config.ts — no runtime YAML parser is needed.
declare module '*.yaml' {
	const content: Record<string, unknown>;
	export default content;
}
