import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

// Every plugin needs packages/<plugin>/plugin-docs.yaml with a real display
// name and description. Without it the docs generator invents a name from the
// folder ("Bunnycdn", "Pdfco") and the catalog, corsair.dev and Hub show that.
// Nothing used to require the file, and 83 plugins merged without one.

export const PLUGIN_DOCS_FILE = 'plugin-docs.yaml';

/** Packages under packages/ that are not integrations. */
const NON_PLUGIN_PACKAGES = new Set([
	'corsair',
	'cli',
	'mcp',
	'studio',
	'ui',
	'app',
]);

/** The plugin folder names under `packagesDir`, the set validate:plugins checks. */
export function listPluginDirs(packagesDir: string): string[] {
	return fs
		.readdirSync(packagesDir, { withFileTypes: true })
		.filter(
			(dirent) =>
				dirent.isDirectory() &&
				!NON_PLUGIN_PACKAGES.has(dirent.name) &&
				// frpc-<platform>-<arch> are prebuilt binary shims, not integrations.
				!dirent.name.startsWith('frpc-'),
		)
		.map((dirent) => dirent.name);
}

/** Every problem with one plugin's plugin-docs.yaml, including a missing file. */
export function pluginDocsProblemsIn(pluginPath: string): string[] {
	const file = path.join(pluginPath, PLUGIN_DOCS_FILE);
	if (!fs.existsSync(file)) {
		return [`Missing ${PLUGIN_DOCS_FILE}`];
	}
	return pluginDocsYamlProblems(fs.readFileSync(file, 'utf8')).map(
		(problem) => `${PLUGIN_DOCS_FILE} ${problem}`,
	);
}

// Upper-case markers only, so a real description can still say "todo list".
const PLACEHOLDER = /\b(TODO|TBD|FIXME)\b|[Ll]orem ipsum/;
const MIN_DESCRIPTION_LENGTH = 30;

/** What is wrong with a plugin-docs.yaml, or [] when it is good enough to publish. */
export function pluginDocsYamlProblems(text: string): string[] {
	// The file is author-written YAML of any shape until checked below.
	let doc: unknown;
	try {
		doc = parseYaml(text);
	} catch (err) {
		return [`is not valid YAML (${(err as Error).message.split('\n')[0]})`];
	}
	if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
		return ['must be a YAML mapping'];
	}
	// Only displayName and description are read here; each is type-checked
	// before use, and the rest of the file belongs to the docs generator.
	const { displayName, description } = doc as Record<string, unknown>;
	const problems: string[] = [];

	if (typeof displayName !== 'string' || displayName.trim() === '') {
		problems.push('needs a displayName (the provider name as they write it)');
	} else if (PLACEHOLDER.test(displayName)) {
		problems.push('displayName is still a placeholder');
	}

	if (typeof description !== 'string' || description.trim() === '') {
		problems.push(
			'needs a description (one sentence on what the plugin covers)',
		);
	} else if (PLACEHOLDER.test(description)) {
		problems.push('description is still a placeholder');
	} else if (description.trim().length < MIN_DESCRIPTION_LENGTH) {
		problems.push(
			`description is too short to say what the plugin covers (under ${MIN_DESCRIPTION_LENGTH} characters)`,
		);
	}
	return problems;
}

/** The file a new plugin starts with. Its TODO fails validate:plugins until replaced. */
export function starterPluginDocsYaml(displayName: string): string {
	return [
		'# Display copy for the docs, the catalog, corsair.dev and Hub.',
		'# `pnpm validate:plugins` fails until the TODO is replaced.',
		// JSON strings are valid YAML, so names with `:` or `#` survive.
		`displayName: ${JSON.stringify(displayName)}`,
		'description: TODO one sentence on what the API is and what this plugin can do with it.',
		'',
	].join('\n');
}
