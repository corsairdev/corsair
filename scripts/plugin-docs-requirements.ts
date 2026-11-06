import { parse as parseYaml } from 'yaml';

// Every plugin needs packages/<plugin>/plugin-docs.yaml with a real display
// name and description. Without it the docs generator invents a name from the
// folder ("Bunnycdn", "Pdfco") and the catalog, corsair.dev and Hub show that.
// Nothing used to require the file, and 83 plugins merged without one.

export const PLUGIN_DOCS_FILE = 'plugin-docs.yaml';

const PLACEHOLDER = /\b(TODO|TBD|FIXME)\b|lorem ipsum/i;
const MIN_DESCRIPTION_LENGTH = 30;

/** What is wrong with a plugin-docs.yaml, or [] when it is good enough to publish. */
export function pluginDocsYamlProblems(text: string): string[] {
	let doc: unknown;
	try {
		doc = parseYaml(text);
	} catch (err) {
		return [`is not valid YAML (${(err as Error).message.split('\n')[0]})`];
	}
	if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
		return ['must be a YAML mapping'];
	}
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
		`displayName: ${displayName}`,
		'description: TODO one sentence on what the API is and what this plugin can do with it.',
		'',
	].join('\n');
}
