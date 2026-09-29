import { execFileSync } from 'node:child_process';

// Full-lane CI installs packages/** but turbo still builds adapter workspace
// deps via ^build. Install adapters when the root package prepare hook runs.
if (
	process.env.CI !== 'true' ||
	process.env.CORSAIR_ADAPTERS_INSTALLED === '1'
) {
	process.exit(0);
}

execFileSync(
	'pnpm',
	['install', '--frozen-lockfile', '--filter', './adapters/**'],
	{
		stdio: 'inherit',
		env: { ...process.env, CORSAIR_ADAPTERS_INSTALLED: '1' },
	},
);
