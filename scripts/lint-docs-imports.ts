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
				dirent.isDirectory() &&
				!IGNORED_PACKAGES.includes(dirent.name) &&
				// frpc-<platform>-<arch> are prebuilt binary shims, not integrations.
				!dirent.name.startsWith('frpc-'),
		)
		.map((dirent) => dirent.name),
);

let hasErrors = false;

type CodeFence = {
	start: number;
	end: number;
	body: string;
	bodyStart: number;
};

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

function getCodeFences(content: string): CodeFence[] {
	const fences: CodeFence[] = [];
	const fenceRegex = /```[^\n]*\n([\s\S]*?)```/g;
	let match: RegExpExecArray | null;
	while ((match = fenceRegex.exec(content)) !== null) {
		const body = match[1];
		const openLength = match[0].length - body.length - 3;
		fences.push({
			start: match.index,
			end: match.index + match[0].length,
			body,
			bodyStart: match.index + openLength,
		});
	}
	return fences;
}

function fenceContaining(
	fences: CodeFence[],
	index: number,
): CodeFence | undefined {
	return fences.find((fence) => index >= fence.start && index < fence.end);
}

function normalizeImportedName(item: string): string {
	const withoutBlockComments = item.replace(
		/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g,
		'',
	);
	const beforeAlias = withoutBlockComments.split(/\s+as\s+/)[0] ?? '';
	return beforeAlias.trim().replace(/^type\s+/, '');
}

function lineAt(content: string, index: number): number {
	return content.substring(0, index).split('\n').length;
}

function reportInvalidNamedImport(
	relativePath: string,
	lineNumber: number,
	invalidImports: string[],
) {
	hasErrors = true;
	console.error(`[ERROR] ${relativePath}:${lineNumber}`);
	console.error(
		`  -> Invalid named import from 'corsair': ${invalidImports.join(', ')}`,
	);
	console.error(
		`  -> Fix: Import plugins directly from their respective packages (e.g., import { ${invalidImports[0]} } from '@corsair-dev/${invalidImports[0]}';)`,
	);
}

function reportInvalidBindingAccess(
	relativePath: string,
	lineNumber: number,
	bindingName: string,
	invalidAccesses: string[],
) {
	hasErrors = true;
	console.error(`[ERROR] ${relativePath}:${lineNumber}`);
	console.error(
		`  -> Import '${bindingName}' from 'corsair' accesses plugins: ${invalidAccesses.join(', ')}`,
	);
	console.error(
		`  -> Fix: Import plugins directly from their respective packages (e.g., import { ${invalidAccesses[0]} } from '@corsair-dev/${invalidAccesses[0]}';)`,
	);
}

function findPluginAccesses(scope: string, bindingName: string): string[] {
	const accessRegex = new RegExp(`\\b${bindingName}\\.(\\w+)\\b`, 'g');
	const invalidAccesses: string[] = [];
	let accessMatch: RegExpExecArray | null;
	while ((accessMatch = accessRegex.exec(scope)) !== null) {
		const member = accessMatch[1];
		if (plugins.has(member) && !invalidAccesses.includes(member)) {
			invalidAccesses.push(member);
		}
	}
	return invalidAccesses;
}

function lintNamedImports(content: string, relativePath: string) {
	const namedImportRegex =
		/import\s+(?:type\s+)?(?:[\w$]+\s*,\s*)?\{([^}]+)\}\s+from\s+['"]corsair['"]/g;

	let match: RegExpExecArray | null;
	while ((match = namedImportRegex.exec(content)) !== null) {
		const importedItems = match[1]
			.split(',')
			.map(normalizeImportedName)
			.filter(Boolean);
		const invalidImports = importedItems.filter((item) => plugins.has(item));
		if (invalidImports.length === 0) continue;
		reportInvalidNamedImport(
			relativePath,
			lineAt(content, match.index),
			invalidImports,
		);
	}
}

function lintBindingsInScope(
	scope: string,
	scopeAbsoluteStart: number,
	fullContent: string,
	relativePath: string,
) {
	const namespaceImportRegex =
		/import\s+\*\s+as\s+(\w+)\s+from\s+['"]corsair['"]/g;
	const defaultImportRegex =
		/import\s+(?!type\b)(\w+)\s+from\s+['"]corsair['"]/g;

	const checkBinding = (bindingName: string, matchIndex: number) => {
		const invalidAccesses = findPluginAccesses(scope, bindingName);
		if (invalidAccesses.length === 0) return;
		reportInvalidBindingAccess(
			relativePath,
			lineAt(fullContent, scopeAbsoluteStart + matchIndex),
			bindingName,
			invalidAccesses,
		);
	};

	let nsMatch: RegExpExecArray | null;
	while ((nsMatch = namespaceImportRegex.exec(scope)) !== null) {
		checkBinding(nsMatch[1], nsMatch.index);
	}

	let defaultMatch: RegExpExecArray | null;
	while ((defaultMatch = defaultImportRegex.exec(scope)) !== null) {
		checkBinding(defaultMatch[1], defaultMatch.index);
	}
}

function lintOutOfFenceBindings(
	content: string,
	fences: CodeFence[],
	relativePath: string,
) {
	const patterns = [
		/import\s+\*\s+as\s+(\w+)\s+from\s+['"]corsair['"]/g,
		/import\s+(?!type\b)(\w+)\s+from\s+['"]corsair['"]/g,
	];

	for (const regex of patterns) {
		let match: RegExpExecArray | null;
		while ((match = regex.exec(content)) !== null) {
			if (fenceContaining(fences, match.index)) continue;

			const nextFence = fences.find((fence) => fence.start > match!.index);
			const regionEnd = nextFence ? nextFence.start : content.length;
			const region = content.slice(match.index, regionEnd);
			const invalidAccesses = findPluginAccesses(region, match[1]);
			if (invalidAccesses.length === 0) continue;

			reportInvalidBindingAccess(
				relativePath,
				lineAt(content, match.index),
				match[1],
				invalidAccesses,
			);
		}
	}
}

function lintFile(filePath: string) {
	const content = fs.readFileSync(filePath, 'utf8');
	const relativePath = path.relative(process.cwd(), filePath);
	const fences = getCodeFences(content);

	lintNamedImports(content, relativePath);

	if (fences.length === 0) {
		lintBindingsInScope(content, 0, content, relativePath);
		return;
	}

	for (const fence of fences) {
		lintBindingsInScope(fence.body, fence.bodyStart, content, relativePath);
	}

	lintOutOfFenceBindings(content, fences, relativePath);
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
