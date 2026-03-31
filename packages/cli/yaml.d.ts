// YAML files are inlined at build time by the esbuild YAML plugin in tsup.config.ts.
declare module '*.yaml' {
	const content: Record<string, unknown>;
	export default content;
}
