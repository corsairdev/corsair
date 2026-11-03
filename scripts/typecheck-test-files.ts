// Type-checks the test files that no package build checks.
//
// tsconfig.base.json sets isolatedModules, so ts-jest only transpiles: a
// test's types are checked when its package builds, because most package
// tsconfigs include their tests. Some exclude them (`**/*.test.ts`). For those
// packages this runs the check ts-jest used to run on every test: the package
// tsconfig plus the overrides its jest config hands to ts-jest.
//
// Usage: node --experimental-strip-types scripts/typecheck-test-files.ts [package dir...]
// With no arguments it checks every package under packages/ and adapters/.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);

// CI never runs these (pr-checks.yml --testPathIgnorePatterns), so ts-jest
// never checked them either.
const NOT_RUN_IN_CI = /(^|\/)(api|integration)\.test\.tsx?$/;
// ts-jest's default diagnostics.ignoreCodes.
const TS_JEST_IGNORED_CODES = [6059, 18002, 18003];

// Every jest config format in packages/ and adapters/ (400 .cjs, 11 .json).
const JEST_CONFIG_FILES = [
	'jest.config.cjs',
	'jest.config.js',
	'jest.config.json',
];

type TsJestOptions = {
	diagnostics?: boolean | { ignoreCodes?: number[] };
	isolatedModules?: boolean;
	// Raw compilerOptions JSON from a jest config, read as untyped data;
	// ts.convertCompilerOptionsFromJson validates it below, so a stricter
	// type here would only restate TypeScript's own option list.
	tsconfig?: string | Record<string, unknown>;
};

/**
 * The ts-jest options a package's jest config passes for .ts files: null when
 * its tests don't go through ts-jest, undefined when it has no jest config
 * file this script can read.
 */
function tsJestOptions(dir: string): TsJestOptions | null | undefined {
	const configFile = JEST_CONFIG_FILES.map((name) => path.join(dir, name)).find(
		(file) => fs.existsSync(file),
	);
	if (!configFile) return undefined;
	const config = require(path.resolve(configFile));
	for (const [pattern, transformer] of Object.entries(config.transform ?? {})) {
		if (!new RegExp(pattern).test('x.ts')) continue;
		if (transformer === 'ts-jest') return {};
		if (Array.isArray(transformer) && transformer[0] === 'ts-jest') {
			return (transformer[1] ?? {}) as TsJestOptions;
		}
		return null;
	}
	return config.preset === 'ts-jest' ? {} : null;
}

function testFiles(dir: string): string[] {
	const found: string[] = [];
	const walk = (current: string) => {
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			if (['node_modules', 'dist', '.turbo'].includes(entry.name)) continue;
			const file = path.join(current, entry.name);
			if (entry.isDirectory()) walk(file);
			else if (/\.test\.tsx?$/.test(entry.name) && !NOT_RUN_IN_CI.test(file))
				found.push(path.resolve(file));
		}
	};
	walk(dir);
	return found;
}

function checkPackage(dir: string): ts.Diagnostic[] | null {
	const tsconfigFile = path.resolve(dir, 'tsconfig.json');
	if (!fs.existsSync(tsconfigFile)) return null;
	const raw = ts.readConfigFile(tsconfigFile, ts.sys.readFile);
	const parsed = ts.parseJsonConfigFileContent(
		raw.config,
		ts.sys,
		path.resolve(dir),
		undefined,
		tsconfigFile,
	);
	const covered = new Set(parsed.fileNames.map((file) => path.resolve(file)));
	const unchecked = testFiles(dir).filter((file) => !covered.has(file));
	if (unchecked.length === 0) return null;

	const options = tsJestOptions(dir);
	if (options === undefined) {
		// Fail rather than skip: this package's tests would otherwise go
		// unchecked without anyone noticing.
		return [
			{
				category: ts.DiagnosticCategory.Error,
				code: 0,
				file: undefined,
				start: undefined,
				length: undefined,
				messageText: `${dir}: its tsconfig leaves out ${unchecked.length} test file(s) and it has no ${JEST_CONFIG_FILES.join('/')} to read ts-jest's options from.`,
			},
		];
	}
	if (options === null) return null;
	if (options.diagnostics === false || options.isolatedModules === true)
		return null;
	const inline = typeof options.tsconfig === 'object' ? options.tsconfig : {};
	if (inline.isolatedModules === true) return null;

	const overrides = ts.convertCompilerOptionsFromJson(
		inline,
		path.resolve(dir),
	).options;
	const program = ts.createProgram(unchecked, {
		...parsed.options,
		...overrides,
		noEmit: true,
		composite: false,
		incremental: false,
		declaration: false,
		declarationMap: false,
		emitDeclarationOnly: false,
		tsBuildInfoFile: undefined,
	});
	const ignored =
		typeof options.diagnostics === 'object' && options.diagnostics.ignoreCodes
			? options.diagnostics.ignoreCodes
			: TS_JEST_IGNORED_CODES;
	return ts
		.getPreEmitDiagnostics(program)
		.filter((diagnostic) => !ignored.includes(diagnostic.code));
}

const dirs =
	process.argv.length > 2
		? process.argv.slice(2)
		: ['packages', 'adapters'].flatMap((root) =>
				fs
					.readdirSync(root, { withFileTypes: true })
					.filter((entry) => entry.isDirectory())
					.map((entry) => path.join(root, entry.name)),
			);

const host: ts.FormatDiagnosticsHost = {
	getCanonicalFileName: (file) => file,
	getCurrentDirectory: () => process.cwd(),
	getNewLine: () => '\n',
};
let checked = 0;
let failed = 0;
for (const dir of dirs) {
	const diagnostics = checkPackage(dir);
	if (diagnostics === null) continue;
	checked++;
	if (diagnostics.length === 0) continue;
	failed++;
	console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics, host));
}
console.log(
	`Type-checked the test files of ${checked} package(s) whose build skips them; ${failed} with errors.`,
);
process.exit(failed > 0 ? 1 : 0);
