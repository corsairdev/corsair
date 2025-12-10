#!/usr/bin/env tsx
/**
 * Script to sync corsair package versions from the actual package.json files
 * to both dependencyVersionMap.ts and the template package.json
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths relative to this script
const ROOT = path.resolve(__dirname, '../../..');
const CLI_PKG_PATH = path.join(ROOT, 'packages/cli/package.json');
const CORE_PKG_PATH = path.join(ROOT, 'packages/corsair/package.json');
const DEPENDENCY_VERSION_MAP_PATH = path.join(
	__dirname,
	'../src/installers/dependencyVersionMap.ts',
);
const TEMPLATE_PKG_PATH = path.join(__dirname, '../template/base/package.json');

async function getPackageVersion(pkgPath: string): Promise<string> {
	const pkg = await fs.readJSON(pkgPath);
	const version = pkg.version;
	if (!version) {
		throw new Error(`No version found in ${pkgPath}`);
	}
	// Return with caret prefix for semver range
	return `^${version}`;
}

async function updateDependencyVersionMap(
	cliVersion: string,
	coreVersion: string,
) {
	const content = await fs.readFile(DEPENDENCY_VERSION_MAP_PATH, 'utf-8');

	// Update @corsair-ai/core version
	const updatedContent = content
		.replace(/('@corsair-ai\/core':\s*)'[^']+'/, `$1'${coreVersion}'`)
		.replace(/('@corsair-ai\/cli':\s*)'[^']+'/, `$1'${cliVersion}'`);

	await fs.writeFile(DEPENDENCY_VERSION_MAP_PATH, updatedContent, 'utf-8');
	console.log(`✅ Updated dependencyVersionMap.ts`);
	console.log(`   @corsair-ai/core: ${coreVersion}`);
	console.log(`   @corsair-ai/cli: ${cliVersion}`);
}

async function updateTemplatePackageJson(
	cliVersion: string,
	coreVersion: string,
) {
	const pkg = await fs.readJSON(TEMPLATE_PKG_PATH);

	if (pkg.dependencies && pkg.dependencies['@corsair-ai/core']) {
		pkg.dependencies['@corsair-ai/core'] = coreVersion;
	}

	if (pkg.devDependencies && pkg.devDependencies['@corsair-ai/cli']) {
		pkg.devDependencies['@corsair-ai/cli'] = cliVersion;
	}

	await fs.writeJSON(TEMPLATE_PKG_PATH, pkg, { spaces: 2 });
	console.log(`✅ Updated template/base/package.json`);
	console.log(`   @corsair-ai/core: ${coreVersion}`);
	console.log(`   @corsair-ai/cli: ${cliVersion}`);
}

async function main() {
	console.log('🔄 Syncing corsair package versions...\n');

	try {
		// Read versions from actual package.json files
		const cliVersion = await getPackageVersion(CLI_PKG_PATH);
		const coreVersion = await getPackageVersion(CORE_PKG_PATH);

		console.log(`📦 Found versions:`);
		console.log(`   @corsair-ai/cli: ${cliVersion}`);
		console.log(`   @corsair-ai/core: ${coreVersion}\n`);

		// Update both files
		await updateDependencyVersionMap(cliVersion, coreVersion);
		console.log('');
		await updateTemplatePackageJson(cliVersion, coreVersion);

		console.log('\n✨ Sync complete!');
	} catch (error) {
		console.error('❌ Error syncing versions:', error);
		process.exit(1);
	}
}

await main();
