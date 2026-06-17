import fs from 'fs';
import path from 'path';

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const IGNORED_PACKAGES = ['corsair', 'cli', 'mcp', 'studio', 'ui', 'app'];

const plugins = fs
	.readdirSync(PACKAGES_DIR, { withFileTypes: true })
	.filter(
		(dirent) => dirent.isDirectory() && !IGNORED_PACKAGES.includes(dirent.name),
	)
	.map((dirent) => dirent.name);

let hasErrors = false;

function logError(plugin: string, message: string) {
	console.error(`[ERROR] [${plugin}] ${message}`);
	hasErrors = true;
}

for (const plugin of plugins) {
	const pluginPath = path.join(PACKAGES_DIR, plugin);

	// 1. Check package.json
	const packageJsonPath = path.join(pluginPath, 'package.json');
	if (!fs.existsSync(packageJsonPath)) {
		logError(plugin, 'Missing package.json');
		continue;
	}

	// Using `any` because package.json has no guaranteed schema and we intentionally
	// perform duck-typing checks on arbitrary fields below.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let pkg: any;
	try {
		pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	} catch (e) {
		logError(plugin, 'Invalid package.json JSON');
		continue;
	}

	// 2. Validate package.json contents
	if (!pkg.name?.startsWith('@corsair-dev/')) {
		logError(plugin, 'Package name must start with @corsair-dev/');
	}

	if (!pkg.scripts?.test?.startsWith('jest')) {
		logError(plugin, 'Must have a "test" script using jest in package.json');
	}

	if (!pkg.devDependencies?.jest) {
		logError(plugin, 'Must have "jest" in devDependencies');
	}

	if (!pkg.devDependencies?.['@types/jest']) {
		logError(plugin, 'Must have "@types/jest" in devDependencies');
	}

	// 3. Check for index.ts and its contents
	const indexTsPath = path.join(pluginPath, 'index.ts');
	if (!fs.existsSync(indexTsPath)) {
		logError(plugin, 'Missing index.ts');
	} else {
		const indexTsContent = fs.readFileSync(indexTsPath, 'utf8');

		// 3.1 Check for database schema import
		if (
			!indexTsContent.includes("from './schema'") &&
			!indexTsContent.includes("from './schema/'")
		) {
			logError(plugin, 'index.ts must import database schema from ./schema');
		}

		// 3.2 Check for RequiredPluginEndpointMeta validation
		if (!indexTsContent.includes('satisfies RequiredPluginEndpointMeta<')) {
			logError(
				plugin,
				'endpointMeta must strictly validate the risk-level metadata by using "satisfies RequiredPluginEndpointMeta<...>"',
			);
		}
	}

	// 4. Check for endpoints directory or endpoints.ts file
	const hasEndpointsDir =
		fs.existsSync(path.join(pluginPath, 'endpoints')) &&
		fs.statSync(path.join(pluginPath, 'endpoints')).isDirectory();
	const hasEndpointsFile = fs.existsSync(path.join(pluginPath, 'endpoints.ts'));

	if (!hasEndpointsDir && !hasEndpointsFile) {
		logError(plugin, 'Missing endpoints/ directory or endpoints.ts file');
	}

	if (hasEndpointsDir) {
		const endpointsPath = path.join(pluginPath, 'endpoints');

		// 4.1 Check for operation-groups directory (not allowed)
		if (fs.existsSync(path.join(endpointsPath, 'operation-groups'))) {
			logError(
				plugin,
				'endpoints/operation-groups directory is forbidden. Endpoints must be defined as proper functions, not raw JSON configurations.',
			);
		}

		// 4.2 Recursively check all files in endpoints/
		const checkEndpointFiles = (dir: string) => {
			const items = fs.readdirSync(dir, { withFileTypes: true });
			for (const item of items) {
				const fullPath = path.join(dir, item.name);
				if (item.isDirectory()) {
					checkEndpointFiles(fullPath);
				} else if (item.isFile() && fullPath.endsWith('.ts')) {
					const content = fs.readFileSync(fullPath, 'utf8');
					if (
						/satisfies\s+readonly\s+\w*Operation\[\]/.test(content) ||
						/satisfies\s+\w*Operation\[\]/.test(content)
					) {
						logError(
							plugin,
							`File ${item.name} uses an array of Operations which violates standard Corsair endpoint syntax. Endpoints must be defined as explicitly exported functions.`,
						);
					}
				}
			}
		};
		checkEndpointFiles(endpointsPath);

		// 4.3 Check for types.ts and schemas
		const typesTsPath = path.join(endpointsPath, 'types.ts');
		if (fs.existsSync(typesTsPath)) {
			const typesContent = fs.readFileSync(typesTsPath, 'utf8');
			if (
				!/EndpointInputSchemas/.test(typesContent) ||
				!/EndpointOutputSchemas/.test(typesContent)
			) {
				logError(
					plugin,
					'endpoints/types.ts must export ...EndpointInputSchemas and ...EndpointOutputSchemas',
				);
			}
		} else {
			// Some plugins like MCP or older ones might just have index.ts, but standard is types.ts. We'll make it a requirement if endpoints/ exists and has multiple files.
			const files = fs.readdirSync(endpointsPath);
			if (files.length > 2 && !fs.existsSync(typesTsPath)) {
				logError(
					plugin,
					'Missing endpoints/types.ts for Zod schema definitions',
				);
			}
		}
	}

	// 5. Check for test files (must have api.test.ts, integration.test.ts, or be inside a tests/ dir)
	const files = fs.readdirSync(pluginPath);
	const hasTestFile = files.some((f) => f.endsWith('.test.ts'));
	const hasTestsDir = fs.existsSync(path.join(pluginPath, 'tests'));

	if (!hasTestFile && !hasTestsDir) {
		logError(
			plugin,
			'Must have at least one test file (*.test.ts) or a tests/ directory',
		);
	}

	// Ensure no forbidden manual test scripts
	if (pkg.scripts?.['test:manual']) {
		logError(
			plugin,
			'test:manual script is forbidden. All tests should be automated and run via the standard "test" script.',
		);
	}
}

if (hasErrors) {
	console.error(
		'\n[FAILED] Plugin validation failed. Please fix the errors above.',
	);
	process.exit(1);
} else {
	console.log('\n[SUCCESS] All plugins passed structural validation!');
}
