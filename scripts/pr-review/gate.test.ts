import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	countTestFilesByPlugin,
	MULTI_PLUGIN_LABEL,
	parsePrFileRows,
	renderScorecard,
	runGate,
} from './gate.ts';

const goodBody = `## Description
Adds the 1Password Connect plugin with vaults and items endpoints.

Fixes #123

## Checklist
- [x] I have run \`pnpm lint\` and all checks pass
- [x] I have run \`pnpm typecheck\` and there are no TypeScript errors
- [x] I have run \`pnpm build\` and all packages build successfully
- [x] I have run \`pnpm test\` and all tests pass
- [x] I have added or updated tests where applicable
- [x] I have added or updated necessary documentation

## Screenshots / Demos (if applicable)
https://github.com/user-attachments/assets/demo.mp4
`;

const goodFiles = [
	'packages/onepassword/index.ts',
	'packages/onepassword/api.test.ts',
	'packages/onepassword/README.md',
	'packages/corsair/core/constants.ts',
	'pnpm-lock.yaml',
];

const goodInput = {
	changedFiles: goodFiles,
	prBody: goodBody,
	isDraft: false,
	testFileCount: 2,
	assertionCount: 12,
};

test('clean plugin PR passes every check', () => {
	const r = runGate(goodInput);
	assert.equal(r.isPluginPr, true);
	assert.equal(r.plugin, 'onepassword');
	assert.deepEqual(r.failures, []);
	assert.ok(r.checks.length >= 5);
	assert.ok(r.checks.every((c) => c.status === 'pass'));
});

test('non-plugin PR is skipped', () => {
	const r = runGate({
		...goodInput,
		changedFiles: ['packages/cli/src/index.ts'],
	});
	assert.equal(r.isPluginPr, false);
});

test('framework adapters live outside packages/ and are not plugins', () => {
	const r = runGate({
		...goodInput,
		changedFiles: ['adapters/mastra/src/corsair-tool-provider.ts'],
	});
	assert.equal(r.isPluginPr, false);
});

test('draft plugin PR is skipped', () => {
	const r = runGate({ ...goodInput, isDraft: true });
	assert.equal(r.isPluginPr, false);
});

test('frpc binary-shim packages are not plugins', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [
			'packages/frpc-darwin-arm64/package.json',
			'packages/frpc-linux-x64/package.json',
		],
	});
	assert.equal(r.isPluginPr, false);
});

test('R1: out-of-scope file fails', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [...goodFiles, 'packages/corsair/core/client.ts'],
	});
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('R1: two plugins in one PR fails', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [...goodFiles, 'packages/slack/index.ts'],
	});
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('plugin-docs.yaml + generated docs skip the plugin gate', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [
			'packages/airtable/plugin-docs.yaml',
			'docs/plugins/airtable/overview.mdx',
			'docs/docs.json',
		],
	});
	assert.equal(r.isPluginPr, false);
	assert.deepEqual(r.failures, []);
});

test('plugin-docs.yaml only skips the plugin gate', () => {
	const r = runGate({
		...goodInput,
		changedFiles: ['packages/airtable/plugin-docs.yaml'],
	});
	assert.equal(r.isPluginPr, false);
});

test('R1: same-plugin generated docs pass', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [
			...goodFiles,
			'packages/onepassword/plugin-docs.yaml',
			'docs/plugins/onepassword/overview.mdx',
			'docs/docs.json',
		],
	});
	assert.ok(!r.failures.some((f) => f.rule === 'R1'));
});

test('R1: other plugin docs fail', () => {
	const r = runGate({
		...goodInput,
		changedFiles: [...goodFiles, 'docs/plugins/slack/overview.mdx'],
	});
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('R2: plugin with no test files fails', () => {
	const r = runGate({ ...goodInput, testFileCount: 0 });
	assert.ok(r.failures.some((f) => f.rule === 'R2'));
});

test('R2: update PR not touching tests passes when tests exist on disk', () => {
	const r = runGate({
		...goodInput,
		changedFiles: goodFiles.filter((f) => !f.endsWith('.test.ts')),
	});
	assert.ok(!r.failures.some((f) => f.rule === 'R2'));
});

test('R2: tests without assertions fail', () => {
	const r = runGate({ ...goodInput, assertionCount: 0 });
	assert.ok(r.failures.some((f) => f.rule === 'R2'));
});

test('R2: thin assertions warn but do not fail', () => {
	const r = runGate({ ...goodInput, assertionCount: 2 });
	assert.ok(!r.failures.some((f) => f.rule === 'R2'));
	assert.ok(r.checks.some((c) => c.rule === 'R2' && c.status === 'warn'));
});

test('R3: unchecked checklist box fails', () => {
	const body = goodBody.replace(
		'- [x] I have run `pnpm lint`',
		'- [ ] I have run `pnpm lint`',
	);
	const r = runGate({ ...goodInput, prBody: body });
	assert.ok(r.failures.some((f) => f.rule === 'R3'));
});

test('R3: empty description fails', () => {
	const body = goodBody.replace(
		'Adds the 1Password Connect plugin with vaults and items endpoints.',
		'<!-- Briefly describe the changes -->',
	);
	const r = runGate({ ...goodInput, prBody: body });
	assert.ok(r.failures.some((f) => f.rule === 'R3'));
});

test('R3: missing issue link warns but does not fail', () => {
	const body = goodBody.replace('Fixes #123', '');
	const r = runGate({ ...goodInput, prBody: body });
	assert.ok(!r.failures.some((f) => f.rule === 'R3'));
	assert.ok(r.checks.some((c) => c.rule === 'R3' && c.status === 'warn'));
});

test('R4: missing demo link fails', () => {
	const body = goodBody.replace(
		'https://github.com/user-attachments/assets/demo.mp4',
		'',
	);
	const r = runGate({ ...goodInput, prBody: body });
	assert.ok(r.failures.some((f) => f.rule === 'R4'));
});

test('nested comment markers cannot survive stripping (CodeQL js/incomplete-multi-character-sanitization)', () => {
	const body = goodBody.replace(
		'Adds the 1Password Connect plugin with vaults and items endpoints.',
		'<!<!-- inner -->-- sneaky payload -->',
	);
	const r = runGate({ ...goodInput, prBody: body });
	// After full stripping the description is empty → R3 must fail.
	assert.ok(r.failures.some((f) => f.rule === 'R3'));
});

// Team multi-plugin PRs (risk levels, version bumps across several plugins).
const batchFiles = [
	'packages/gumroad/index.ts',
	'packages/gumroad/package.json',
	'packages/snowflake/index.ts',
	'packages/snowflake/package.json',
	'docs/plugins/snowflake/api.mdx',
	'docs/docs.json',
	'pnpm-lock.yaml',
];
const batchInput = {
	changedFiles: batchFiles,
	prBody: 'Risk levels for destructive operations.',
	isDraft: false,
	testFileCount: 0,
	assertionCount: 0,
	labels: [MULTI_PLUGIN_LABEL],
	authorAssociation: 'MEMBER',
	addedFiles: [],
	testFileCounts: { gumroad: 3, snowflake: 2 },
};

test('team PR with the multi-plugin label may change several plugins', () => {
	const r = runGate(batchInput);
	assert.equal(r.isPluginPr, true);
	assert.deepEqual(r.failures, []);
	assert.deepEqual(r.batchPlugins, ['gumroad', 'snowflake']);
	assert.ok(r.checks.some((c) => c.rule === 'R2' && c.status === 'pass'));
	assert.ok(r.checks.some((c) => c.rule === 'R3–R4' && c.status === 'pass'));
	assert.match(renderScorecard(r), /team multi-plugin PR \(2 plugins\)/);
});

test('the label does nothing for authors outside the team', () => {
	for (const authorAssociation of [
		'CONTRIBUTOR',
		'FIRST_TIME_CONTRIBUTOR',
		'NONE',
	]) {
		const r = runGate({ ...batchInput, authorAssociation });
		assert.equal(r.batchPlugins, undefined);
		assert.ok(
			r.failures.some((f) => f.rule === 'R1'),
			`${authorAssociation} should still hit the one-plugin rule`,
		);
	}
});

test('a team PR without the label still needs one plugin per PR', () => {
	const r = runGate({ ...batchInput, labels: [] });
	assert.equal(r.batchPlugins, undefined);
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('a team multi-plugin PR still fails on files outside the plugins', () => {
	const r = runGate({
		...batchInput,
		changedFiles: [...batchFiles, 'www/src/app/page.tsx'],
	});
	assert.deepEqual(
		r.failures.map((f) => f.rule),
		['R1'],
	);
	assert.match(r.failures[0]?.message ?? '', /www\/src\/app\/page\.tsx/);
});

test('docs of a plugin the PR does not touch are out of scope', () => {
	const r = runGate({
		...batchInput,
		changedFiles: [...batchFiles, 'docs/plugins/slack/api.mdx'],
	});
	assert.match(r.failures[0]?.message ?? '', /docs\/plugins\/slack/);
});

test('a brand-new plugin cannot ride along in a team multi-plugin PR', () => {
	const r = runGate({
		...batchInput,
		changedFiles: [...batchFiles, 'packages/newthing/package.json'],
		addedFiles: ['packages/newthing/package.json'],
	});
	assert.ok(
		r.failures.some(
			(f) =>
				f.rule === 'R1' &&
				/New plugins need their own PR: newthing/.test(f.message),
		),
	);
});

test('the label alone does not relax the rules for a single-plugin PR', () => {
	const r = runGate({
		...batchInput,
		changedFiles: ['packages/gumroad/index.ts', 'pnpm-lock.yaml'],
	});
	assert.equal(r.batchPlugins, undefined);
	assert.ok(r.failures.some((f) => f.rule === 'R4'));
});

test('without the added-file list a multi-plugin PR gets the normal gate', () => {
	const r = runGate({ ...batchInput, addedFiles: undefined });
	assert.equal(r.batchPlugins, undefined);
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('a renamed or copied package.json counts as a new plugin', () => {
	const { changedFiles, addedFiles } = parsePrFileRows(
		[
			'modified\tpackages/gumroad/index.ts',
			'modified\tpackages/snowflake/index.ts',
			'renamed\tpackages/newthing/package.json',
			'copied\tpackages/other/README.md',
		].join('\n'),
	);
	assert.deepEqual(addedFiles, [
		'packages/newthing/package.json',
		'packages/other/README.md',
	]);
	const r = runGate({ ...batchInput, changedFiles, addedFiles });
	assert.match(
		r.failures[0]?.message ?? '',
		/New plugins need their own PR: newthing/,
	);
});

test('every plugin in a team multi-plugin PR still needs tests', () => {
	const r = runGate({
		...batchInput,
		testFileCounts: { gumroad: 3, snowflake: 0 },
	});
	assert.deepEqual(
		r.failures.map((f) => f.rule),
		['R2'],
	);
	assert.match(r.failures[0]?.message ?? '', /packages\/snowflake\//);
});

test('without per-plugin test counts the normal gate applies', () => {
	const r = runGate({ ...batchInput, testFileCounts: undefined });
	assert.equal(r.batchPlugins, undefined);
});

test('test files are counted per plugin from tree paths', () => {
	assert.deepEqual(
		countTestFilesByPlugin(
			[
				'packages/gumroad/client.test.ts',
				'packages/gumroad/tests/sales.test.ts',
				'packages/gumroad/node_modules/x/a.test.ts',
				'packages/gumroadx/a.test.ts',
				'packages/snowflake/README.md',
			],
			['gumroad', 'snowflake'],
		),
		{ gumroad: 2, snowflake: 0 },
	);
});
