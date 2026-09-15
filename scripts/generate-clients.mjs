#!/usr/bin/env node
// Generates the Python/Go/Swift cloud clients from the OpenAPI contract via
// @openapitools/openapi-generator-cli. Requires a JVM (Java 11+) at runtime;
// generated output is gitignored and not committed (see clients/.gitignore).
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));
const configPath = new URL(
	'../clients/openapi-generator-config.json',
	import.meta.url,
);
const config = JSON.parse(readFileSync(configPath, 'utf8'));

function checkJava() {
	try {
		execFileSync('java', ['-version'], { stdio: 'ignore' });
	} catch {
		console.error(
			'openapi-generator requires Java 11+ at runtime; install a JDK or run in CI.',
		);
		process.exit(1);
	}
}

// Pinned as a devDependency (see root package.json) so this resolves the
// exact same generator-cli build in CI and locally instead of "latest".
function generate(name, { generatorName, output, packageName }) {
	console.log(`generating ${name} client -> ${output}`);
	execFileSync(
		'pnpm',
		[
			'exec',
			'openapi-generator-cli',
			'generate',
			'-i',
			config.inputSpec,
			'-g',
			generatorName,
			'-o',
			output,
			'--additional-properties',
			`packageName=${packageName}`,
		],
		{ cwd: rootDir, stdio: 'inherit' },
	);
}

checkJava();
for (const [name, generatorConfig] of Object.entries(config.generators)) {
	generate(name, generatorConfig);
}
