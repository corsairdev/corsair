import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runGate } from './gate.ts';

const goodBody = `## Description
Adds the 1Password Connect plugin with vaults and items endpoints.

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
	'packages/corsair/core/constants.ts',
	'pnpm-lock.yaml',
];

test('clean plugin PR passes', () => {
	const r = runGate({
		changedFiles: goodFiles,
		prBody: goodBody,
		isDraft: false,
	});
	assert.equal(r.isPluginPr, true);
	assert.equal(r.plugin, 'onepassword');
	assert.deepEqual(r.failures, []);
});

test('non-plugin PR is skipped', () => {
	const r = runGate({
		changedFiles: ['packages/cli/src/index.ts'],
		prBody: goodBody,
		isDraft: false,
	});
	assert.equal(r.isPluginPr, false);
});

test('draft plugin PR is skipped', () => {
	const r = runGate({
		changedFiles: goodFiles,
		prBody: goodBody,
		isDraft: true,
	});
	assert.equal(r.isPluginPr, false);
});

test('R1: out-of-scope file fails', () => {
	const r = runGate({
		changedFiles: [...goodFiles, 'packages/corsair/core/client.ts'],
		prBody: goodBody,
		isDraft: false,
	});
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('R1: two plugins in one PR fails', () => {
	const r = runGate({
		changedFiles: [...goodFiles, 'packages/slack/index.ts'],
		prBody: goodBody,
		isDraft: false,
	});
	assert.ok(r.failures.some((f) => f.rule === 'R1'));
});

test('R2: no test file fails', () => {
	const files = goodFiles.filter((f) => !f.endsWith('.test.ts'));
	const r = runGate({ changedFiles: files, prBody: goodBody, isDraft: false });
	assert.ok(r.failures.some((f) => f.rule === 'R2'));
});

test('R3: unchecked checklist box fails', () => {
	const body = goodBody.replace(
		'- [x] I have run `pnpm lint`',
		'- [ ] I have run `pnpm lint`',
	);
	const r = runGate({ changedFiles: goodFiles, prBody: body, isDraft: false });
	assert.ok(r.failures.some((f) => f.rule === 'R3'));
});

test('R3: empty description fails', () => {
	const body = goodBody.replace(
		'Adds the 1Password Connect plugin with vaults and items endpoints.',
		'<!-- Briefly describe the changes -->',
	);
	const r = runGate({ changedFiles: goodFiles, prBody: body, isDraft: false });
	assert.ok(r.failures.some((f) => f.rule === 'R3'));
});

test('R4: missing demo link fails', () => {
	const body = goodBody.replace(
		'https://github.com/user-attachments/assets/demo.mp4',
		'',
	);
	const r = runGate({ changedFiles: goodFiles, prBody: body, isDraft: false });
	assert.ok(r.failures.some((f) => f.rule === 'R4'));
});
