import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const PACKAGES_DIR = 'packages';

function getPublishedVersion(name) {
	try {
		return (
			execSync(`npm view ${name} version 2>/dev/null`, {
				encoding: 'utf-8',
			}).trim() || null
		);
	} catch {
		return null;
	}
}

const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

const toPublish = [];

for (const dir of dirs) {
	const pkgPath = join(PACKAGES_DIR, dir, 'package.json');
	if (!existsSync(pkgPath)) continue;

	const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
	if (pkg.private) continue;

	const published = getPublishedVersion(pkg.name);
	if (published === pkg.version) {
		console.log(`SKIP ${pkg.name}@${pkg.version} (already published)`);
		continue;
	}

	console.log(
		`QUEUE ${pkg.name}@${pkg.version} (npm has ${published ?? 'nothing'})`,
	);
	toPublish.push({ dir, name: pkg.name, version: pkg.version });
}

if (toPublish.length === 0) {
	console.log('\nNo packages to publish.');
	process.exit(0);
}

console.log(`\nBuilding ${toPublish.length} package(s)...`);
for (const { name } of toPublish) {
	console.log(`  Building ${name}...`);
	execSync(`pnpm --filter ${name} build`, { stdio: 'inherit' });
}

console.log(`\nPublishing ${toPublish.length} package(s)...`);

const npmToken = process.env.NPM_TOKEN;
const corsairDevToken = process.env.NPM_CORSAIR_DEV_TOKEN;

for (const { name } of toPublish) {
	const token = name === 'corsair' ? npmToken : corsairDevToken;
	if (!token) {
		console.error(
			`  SKIP ${name} — missing token (${name === 'corsair' ? 'NPM_TOKEN' : 'NPM_CORSAIR_DEV_TOKEN'})`,
		);
		continue;
	}

	console.log(`  Publishing ${name}...`);
	execSync(
		`pnpm --filter ${name} publish --provenance --access public --no-git-checks`,
		{
			stdio: 'inherit',
			env: { ...process.env, NODE_AUTH_TOKEN: token },
		},
	);
}

console.log(`\nDone. Published ${toPublish.length} package(s).`);
