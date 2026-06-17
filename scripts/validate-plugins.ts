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

function logError(plugin: string, message: string, fix?: string) {
	console.error(`[ERROR] [${plugin}] ${message}`);
	console.error(`  -> Fix/Reference: ${fix || 'See packages/slack for a compliant example'}`);
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
		if (!/from\s+['"]\.\/schema\/?['"]/.test(indexTsContent)) {
			logError(plugin, 'Missing database schema import in index.ts', 'Add `import ... from "./schema"`');
		}

		// 3.2 Check for RequiredPluginEndpointMeta validation
		if (!/satisfies\s+RequiredPluginEndpointMeta\s*</.test(indexTsContent)) {
			logError(
				plugin,
				'endpointMeta missing RequiredPluginEndpointMeta validation',
				'Add `satisfies RequiredPluginEndpointMeta<typeof yourEndpointsNested>` to endpointMeta'
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
				'Forbidden directory: endpoints/operation-groups',
				'Define endpoints as individual exported functions instead of operation-groups'
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
					if (/satisfies\s+(?:readonly\s+)?\w*Operation\[\]/.test(content)) {
						logError(
							plugin,
							`Invalid endpoint array syntax in ${item.name}`,
							'Export individual endpoint functions instead of an array of Operations'
						);
					}
				}
			}
		};
		checkEndpointFiles(endpointsPath);

		// 4.3 Check for types.ts and schemas
		const typesTsPath = path.join(endpointsPath, 'types.ts');
		if (!fs.existsSync(typesTsPath)) {
			logError(
				plugin,
				'Missing endpoints/types.ts file',
				'Create endpoints/types.ts to hold Zod schema definitions for this plugin'
			);
		} else {
			const typesContent = fs.readFileSync(typesTsPath, 'utf8');
			if (
				!/EndpointInputSchemas/.test(typesContent) ||
				!/EndpointOutputSchemas/.test(typesContent)
			) {
				logError(
					plugin,
					'Missing schema exports in endpoints/types.ts',
					'Export EndpointInputSchemas and EndpointOutputSchemas'
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
