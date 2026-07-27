import fs from 'fs';
import path from 'path';

const PACKAGES_DIR = path.join(process.cwd(), 'packages');
const DOCS_DIR = path.join(process.cwd(), 'docs');
const IGNORED_PACKAGES = ['corsair', 'cli', 'mcp', 'studio', 'ui', 'app'];

const plugins = new Set(
	fs
		.readdirSync(PACKAGES_DIR, { withFileTypes: true })
		.filter(
			(dirent) =>
				dirent.isDirectory() && !IGNORED_PACKAGES.includes(dirent.name),
		)
		.map((dirent) => dirent.name),
);

let hasErrors = false;

function lintDocsInDir(dir: string) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			lintDocsInDir(fullPath);
		} else if (
			entry.isFile() &&
			(fullPath.endsWith('.md') || fullPath.endsWith('.mdx'))
		) {
			lintFile(fullPath);
		}
	}
}

function lintFile(filePath: string) {
	const content = fs.readFileSync(filePath, 'utf8');
	const relativePath = path.relative(process.cwd(), filePath);

	// --- Fix 1: Named imports with block-comment stripping ---
	// Handles: import { a, b /* comment */ as alias, c } from 'corsair';
	const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]corsair['"]/g;

	let match: RegExpExecArray | null;
	while ((match = namedImportRegex.exec(content)) !== null) {
		const importedItems = match[1]
			.split(',')
			.map((item) => {
				// Strip block comments (e.g. /* provider */) before alias splitting
				const stripped = item.replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, '');
				return stripped.split(/\s+as\s+/)[0].trim();
			})
			.filter(Boolean);

		const invalidImports = importedItems.filter((item) => plugins.has(item));

		if (invalidImports.length > 0) {
			hasErrors = true;
			const lineNumber = content.substring(0, match.index).split('\n').length;

			console.error(`[ERROR] ${relativePath}:${lineNumber}`);
			console.error(
				`  -> Invalid named import from 'corsair': ${invalidImports.join(', ')}`,
			);
			console.error(
				`  -> Fix: Import plugins directly from their respective packages (e.g., import { ${invalidImports[0]} } from '@corsair-dev/${invalidImports[0]}';)`,
			);
		}
	}

	// --- Fix 2: Namespace imports (import * as ns from 'corsair') ---
	// Handles: import * as corsair from 'corsair'; corsair.github(...)
	const namespaceImportRegex =
		/import\s+\*\s+as\s+(\w+)\s+from\s+['"]corsair['"]/g;

	let nsMatch: RegExpExecArray | null;
	while ((nsMatch = namespaceImportRegex.exec(content)) !== null) {
		const nsName = nsMatch[1];
		const lineNumber = content.substring(0, nsMatch.index).split('\n').length;

		// Scan entire file body for accesses: ns.<pluginName>( or ns.<pluginName>.
		const accessRegex = new RegExp(`\\b${nsName}\\.(\\w+)\\b`, 'g');
		let accessMatch: RegExpExecArray | null;
		const invalidAccesses: string[] = [];
		while ((accessMatch = accessRegex.exec(content)) !== null) {
			const member = accessMatch[1];
			if (plugins.has(member) && !invalidAccesses.includes(member)) {
				invalidAccesses.push(member);
			}
		}

		if (invalidAccesses.length > 0) {
			hasErrors = true;
			console.error(`[ERROR] ${relativePath}:${lineNumber}`);
			console.error(
				`  -> Namespace import 'import * as ${nsName} from \'corsair\'' accesses plugins: ${invalidAccesses.join(', ')}`,
			);
			console.error(
				`  -> Fix: Import plugins directly from their respective packages (e.g., import { ${invalidAccesses[0]} } from '@corsair-dev/${invalidAccesses[0]}';)`,
			);
		}
	}
}

console.log('Linting docs for invalid plugin imports...');
if (fs.existsSync(DOCS_DIR)) {
	lintDocsInDir(DOCS_DIR);
}

if (hasErrors) {
	console.error(
		'\n[FAILED] Docs validation failed. Please fix the imports above.',
	);
	process.exit(1);
} else {
	console.log(
		'\n[SUCCESS] Docs validation passed! No invalid plugin imports found.',
	);
}
