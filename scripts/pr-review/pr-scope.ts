import fs from 'node:fs';
import path from 'node:path';
import {
	ALLOWED_EXTRA,
	DOCS_NAV_FILE,
	detectPlugin,
	isPluginDocsManifestPr,
	isSamePluginDocs,
	pluginOf,
} from './gate.ts';

export type PrScope =
	| { lane: 'plugin'; plugin: string }
	| { lane: 'full'; includeWww: boolean }
	| { lane: 'www' }
	| { lane: 'skip-heavy' };

export type PrScopeFilters = {
	lane: PrScope['lane'];
	turboFilter: string;
	skipHeavy: boolean;
	includeWww: boolean;
	wwwInstallFilter: string;
	wwwTestFilter: string;
};

function isDocumentationOnlyFile(file: string): boolean {
	return (
		file.startsWith('explorer/') ||
		/^docs\/.*\.mdx?$/i.test(file) ||
		/^[^/]+\.mdx?$/i.test(file)
	);
}

function isWwwFile(file: string): boolean {
	return file === 'www' || file.startsWith('www/');
}

export function isGitZeroOid(oid: string): boolean {
	return oid.length > 0 && /^0+$/.test(oid);
}

export type PushChangeSet =
	| { kind: 'known'; files: string[] }
	| { kind: 'unknown'; reason: string };

export function pushRangeFromGithubEvent(
	event: unknown,
): { before: string; after: string } | null {
	if (typeof event !== 'object' || event === null) {
		return null;
	}
	if (!('before' in event) || !('after' in event)) {
		return null;
	}
	if (typeof event.before !== 'string' || typeof event.after !== 'string') {
		return null;
	}
	if (event.before.length === 0 || event.after.length === 0) {
		return null;
	}
	return { before: event.before, after: event.after };
}

export function changeSetForPush(options: {
	before: string;
	after: string;
	diff: (before: string, after: string) => string[];
}): PushChangeSet {
	if (isGitZeroOid(options.before)) {
		return { kind: 'unknown', reason: 'unborn revision' };
	}
	return { kind: 'known', files: options.diff(options.before, options.after) };
}

export function classifyPushChangeSet(changeSet: PushChangeSet): PrScope {
	if (changeSet.kind === 'unknown') {
		return { lane: 'full', includeWww: true };
	}
	return classifyPrScope(changeSet.files);
}

export function classifyPrScope(changedFiles: string[]): PrScope {
	const plugins = new Set(
		changedFiles
			.map(pluginOf)
			.filter((plugin): plugin is string => plugin !== null),
	);
	const plugin = detectPlugin(changedFiles);

	if (isPluginDocsManifestPr(changedFiles)) {
		return { lane: 'skip-heavy' };
	}

	if (
		plugin !== null &&
		plugins.size === 1 &&
		changedFiles.every(
			(file) =>
				pluginOf(file) === plugin ||
				ALLOWED_EXTRA.includes(file) ||
				file === DOCS_NAV_FILE ||
				isSamePluginDocs(file, plugin),
		)
	) {
		return { lane: 'plugin', plugin };
	}

	if (changedFiles.length > 0 && changedFiles.every(isDocumentationOnlyFile)) {
		return { lane: 'skip-heavy' };
	}

	const hasWww = changedFiles.some(isWwwFile);
	if (
		hasWww &&
		changedFiles.every(
			(file) => isWwwFile(file) || isDocumentationOnlyFile(file),
		)
	) {
		return { lane: 'www' };
	}

	return { lane: 'full', includeWww: hasWww };
}

export function packageNameForPlugin(
	plugin: string,
	rootDir = process.cwd(),
): string {
	const packageJson: unknown = JSON.parse(
		fs.readFileSync(
			path.join(rootDir, 'packages', plugin, 'package.json'),
			'utf8',
		),
	);
	if (
		typeof packageJson !== 'object' ||
		packageJson === null ||
		!('name' in packageJson) ||
		typeof packageJson.name !== 'string'
	) {
		throw new Error(`packages/${plugin}/package.json has no package name`);
	}
	return packageJson.name;
}

export function filtersForScope(
	scope: PrScope,
	rootDir = process.cwd(),
): PrScopeFilters {
	switch (scope.lane) {
		case 'plugin': {
			const name = packageNameForPlugin(scope.plugin, rootDir);
			return {
				lane: 'plugin',
				turboFilter: `${name}...`,
				skipHeavy: false,
				includeWww: false,
				wwwInstallFilter: '',
				wwwTestFilter: '',
			};
		}
		case 'www':
			return {
				lane: 'www',
				turboFilter: '@corsair/www',
				skipHeavy: false,
				includeWww: false,
				wwwInstallFilter: '',
				wwwTestFilter: '',
			};
		case 'full':
			return {
				lane: 'full',
				turboFilter: './packages/*',
				skipHeavy: false,
				includeWww: scope.includeWww,
				wwwInstallFilter: scope.includeWww ? '--filter=@corsair/www...' : '',
				wwwTestFilter: scope.includeWww ? '--filter=@corsair/www' : '',
			};
		case 'skip-heavy':
			return {
				lane: 'skip-heavy',
				turboFilter: '',
				skipHeavy: true,
				includeWww: false,
				wwwInstallFilter: '',
				wwwTestFilter: '',
			};
		default: {
			const _exhaustive: never = scope;
			return _exhaustive;
		}
	}
}
