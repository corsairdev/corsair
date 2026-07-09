import fs from 'node:fs';

const msgFile = process.argv[2];
const msg = fs.readFileSync(msgFile, 'utf8').split('\n')[0].trim();

// Merge commits and reverts pass through untouched.
if (/^(Merge|Revert)/.test(msg)) process.exit(0);

const pattern =
	/^(feat|fix|docs|chore|test|refactor|perf|ci|build|style)(\([a-z0-9-]+\))?!?: .{1,72}$/;

if (!pattern.test(msg)) {
	console.error(`Commit message does not follow the convention:

  <type>(<scope>): <short description>

  types: feat fix docs chore test refactor perf ci build style
  example: feat(slack): add channel history endpoint

  yours: ${msg}`);
	process.exit(1);
}
