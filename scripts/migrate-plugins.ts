import * as fs from 'node:fs';
import * as path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PLUGINS_DIR = path.join(ROOT, 'packages/corsair/plugins');
const PACKAGES_DIR = path.join(ROOT, 'packages');

const SKIP = new Set(['utils']);

const PLUGINS = fs
	.readdirSync(PLUGINS_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory() && !SKIP.has(d.name))
	.map((d) => d.name)
	.sort();

const IMPORT_REPLACEMENTS: [RegExp, string][] = [
	// 3-level: ../../../async-core/XXX → corsair/http
	[/from '\.\.\/\.\.\/\.\.\/async-core\/[^']+'/g, "from 'corsair/http'"],
	// 3-level: ../../../core/XXX (any submodule like webhooks, errors) → corsair/core
	[/from '\.\.\/\.\.\/\.\.\/core\/[^']+'/g, "from 'corsair/core'"],
	// 3-level: ../../../core → corsair/core
	[/from '\.\.\/\.\.\/\.\.\/core'/g, "from 'corsair/core'"],
	// 2-level: ../../async-core/XXX → corsair/http
	[/from '\.\.\/\.\.\/async-core\/[^']+'/g, "from 'corsair/http'"],
	// 2-level: ../../core/XXX (any submodule: constants, errors, utils, webhooks) → corsair/core
	[/from '\.\.\/\.\.\/core\/[^']+'/g, "from 'corsair/core'"],
	// 2-level: ../../core → corsair/core
	[/from '\.\.\/\.\.\/core'/g, "from 'corsair/core'"],
	// 2-level: ../../utils/events → corsair/core
	[/from '\.\.\/\.\.\/utils\/events'/g, "from 'corsair/core'"],
	// 2-level: ../../db/XXX → corsair/db (only in non-test files if it appears)
	[/from '\.\.\/\.\.\/db\/[^']+'/g, "from 'corsair/db'"],
];

const SATISFIES_REPLACEMENTS: [RegExp, string][] = [
	[/\} satisfies RequiredPluginEndpointSchemas<[^>]+>;/g, '} as const;'],
	[/\} satisfies RequiredPluginWebhookSchemas<[^>]+>;/g, '} as const;'],
];

function rewriteImports(content: string): string {
	let result = content;
	for (const [pattern, replacement] of IMPORT_REPLACEMENTS) {
		result = result.replace(pattern, replacement);
	}
	for (const [pattern, replacement] of SATISFIES_REPLACEMENTS) {
		result = result.replace(pattern, replacement);
	}

	return result;
}

function shouldSkipFile(filename: string): boolean {
	return (
		filename.endsWith('.test.ts') ||
		filename.endsWith('.md') ||
		filename === 'WEBHOOK_TESTING.md'
	);
}

function copyAndRewrite(srcDir: string, destDir: string): void {
	const entries = fs.readdirSync(srcDir, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);

		if (entry.isDirectory()) {
			fs.mkdirSync(destPath, { recursive: true });
			copyAndRewrite(srcPath, destPath);
		} else if (entry.isFile()) {
			if (shouldSkipFile(entry.name)) continue;

			if (entry.name.endsWith('.ts')) {
				const content = fs.readFileSync(srcPath, 'utf-8');
				fs.writeFileSync(destPath, rewriteImports(content));
			} else {
				fs.copyFileSync(srcPath, destPath);
			}
		}
	}
}

const EXTRA_DEPS: Record<
	string,
	{
		dependencies?: Record<string, string>;
		devDependencies?: Record<string, string>;
	}
> = {
	posthog: {
		dependencies: { uuid: '^11.1.0' },
		devDependencies: { '@types/uuid': '^10.0.0' },
	},
};

function createPackageJson(pluginName: string): string {
	const extra = EXTRA_DEPS[pluginName];
	const pkg = {
		name: `@corsair-dev/${pluginName}`,
		version: '0.1.0',
		description: `${pluginName.charAt(0).toUpperCase() + pluginName.slice(1)} plugin for Corsair`,
		type: 'module',
		main: './dist/index.js',
		module: './dist/index.js',
		types: './dist/index.d.ts',
		exports: {
			'.': {
				'dev-source': './index.ts',
				types: './dist/index.d.ts',
				default: './dist/index.js',
			},
		},
		scripts: {
			build: 'rm -rf dist && tsc --build --force && tsup',
			typecheck: 'tsc --noEmit',
		},
		...(extra?.dependencies ? { dependencies: extra.dependencies } : {}),
		peerDependencies: {
			corsair: '>=0.1.0',
			zod: '^3.0.0',
		},
		devDependencies: {
			...(extra?.devDependencies ?? {}),
			corsair: 'workspace:*',
			tsup: '^8.0.1',
			typescript: 'catalog:',
			zod: '^3.25.76',
		},
		keywords: ['corsair', pluginName, 'plugin'],
		author: '',
		license: 'Apache-2.0',
		files: ['dist'],
	};
	return JSON.stringify(pkg, null, 2) + '\n';
}

const TSCONFIG = `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["esnext"],
    "types": ["node"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "./dist",
    "rootDir": "./",
    "composite": true,
    "incremental": true,
    "emitDeclarationOnly": true,
    "declaration": true,
    "declarationMap": true,
    "skipLibCheck": true
  },
  "include": ["./**/*"],
  "exclude": ["dist", "node_modules"],
  "references": []
}
`;

const TSUP_CONFIG = `import { defineConfig } from 'tsup';

export default defineConfig({
\tclean: false,
\tdts: false,
\tformat: ['esm'],
\ttarget: 'esnext',
\tplatform: 'node',
\tbundle: true,
\tsplitting: true,
\tminify: true,
\toutDir: 'dist',
\texternal: ['corsair', 'zod'],
\tentry: ['index.ts'],
});
`;

let created = 0;
let skipped = 0;

for (const plugin of PLUGINS) {
	const destDir = path.join(PACKAGES_DIR, plugin);

	if (fs.existsSync(destDir)) {
		console.log(`SKIP: ${plugin} (already exists at packages/${plugin})`);
		skipped++;
		continue;
	}

	const srcDir = path.join(PLUGINS_DIR, plugin);

	fs.mkdirSync(destDir, { recursive: true });
	fs.writeFileSync(
		path.join(destDir, 'package.json'),
		createPackageJson(plugin),
	);
	fs.writeFileSync(path.join(destDir, 'tsconfig.json'), TSCONFIG);
	fs.writeFileSync(path.join(destDir, 'tsup.config.ts'), TSUP_CONFIG);

	copyAndRewrite(srcDir, destDir);

	console.log(`OK: ${plugin} → packages/${plugin}`);
	created++;
}

console.log(`\nDone: ${created} created, ${skipped} skipped`);
console.log('Plugins:', PLUGINS.join(', '));
