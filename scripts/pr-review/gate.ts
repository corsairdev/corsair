const IGNORED_PACKAGES = ['corsair', 'cli', 'mcp', 'studio', 'ui', 'app'];
const ALLOWED_EXTRA = ['packages/corsair/core/constants.ts', 'pnpm-lock.yaml'];

export interface GateInput {
	changedFiles: string[];
	prBody: string;
	isDraft: boolean;
}

export interface GateFailure {
	rule: string;
	message: string;
}

export interface GateResult {
	isPluginPr: boolean;
	plugin: string | null;
	failures: GateFailure[];
}

function pluginOf(file: string): string | null {
	const m = file.match(/^packages\/([^/]+)\//);
	if (!m) return null;
	return IGNORED_PACKAGES.includes(m[1]) ? null : m[1];
}

function section(body: string, heading: string): string {
	const escaped = heading.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
	const re = new RegExp(`##\\s*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
	return body.match(re)?.[1] ?? '';
}

function stripComments(s: string): string {
	return s.replace(/<!--[\s\S]*?-->/g, '');
}

export function runGate(input: GateInput): GateResult {
	const plugins = new Set(
		input.changedFiles.map(pluginOf).filter((p): p is string => p !== null),
	);
	if (plugins.size === 0 || input.isDraft) {
		return { isPluginPr: false, plugin: null, failures: [] };
	}

	const failures: GateFailure[] = [];
	const plugin = [...plugins][0];

	if (plugins.size > 1) {
		failures.push({
			rule: 'R1',
			message: `One plugin per PR — this PR touches: ${[...plugins].join(', ')}`,
		});
	}
	const outOfScope = input.changedFiles.filter(
		(f) => pluginOf(f) === null && !ALLOWED_EXTRA.includes(f),
	);
	if (outOfScope.length > 0) {
		failures.push({
			rule: 'R1',
			message: `Files outside the plugin scope: ${outOfScope.join(', ')}`,
		});
	}

	const hasTest = input.changedFiles.some(
		(f) => pluginOf(f) !== null && f.endsWith('.test.ts'),
	);
	if (!hasTest) {
		failures.push({
			rule: 'R2',
			message: `No *.test.ts under packages/${plugin}/ — see packages/slack for examples`,
		});
	}

	if (/-\s\[\s\]/.test(input.prBody)) {
		failures.push({
			rule: 'R3',
			message: 'PR template checklist has unchecked boxes',
		});
	}
	const description = section(input.prBody, 'Description');
	if (stripComments(description).trim().length < 20) {
		failures.push({
			rule: 'R3',
			message: 'Description section is empty or placeholder',
		});
	}

	const demos = section(input.prBody, 'Screenshots / Demos');
	if (!/https?:\/\/\S+/.test(stripComments(demos))) {
		failures.push({
			rule: 'R4',
			message:
				'No demo video/recording link in "Screenshots / Demos" — required for plugin PRs',
		});
	}

	return { isPluginPr: true, plugin, failures };
}
