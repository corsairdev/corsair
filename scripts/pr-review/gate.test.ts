import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runGate } from './gate.ts';

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

test('draft plugin PR is skipped', () => {
	const r = runGate({ ...goodInput, isDraft: true });
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
