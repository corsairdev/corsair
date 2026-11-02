// Splits the full lane's packages across CI shards, whole packages at a time,
// for `build` or `test`. Jest's own --shard splits each package's test files,
// so every package still starts jest in every shard, and a package with one
// test file always lands in shard 1.
//
// Usage: node --experimental-strip-types scripts/pr-review/package-shards.ts <shard> <total> [build|test]
// Prints one turbo `--filter=<package>` flag per line for that shard.
import fs from 'node:fs';
import path from 'node:path';

// CI never runs these (pr-checks.yml --testPathIgnorePatterns).
const NOT_RUN_IN_CI = /(^|\/)(api|integration)\.test\.tsx?$/;
// What starting jest in a package costs, counted in test files. Against a
// full local run's per-package times (2026-11-02), 6 put the heaviest of four
// shards at 25.7% of the work; anything from 3 to 8 stayed under 27%.
const STARTUP_WEIGHT = 6;

export type Task = 'build' | 'test';
export type ShardPackage = { name: string; weight: number };

function countTestFiles(dir: string): number {
	let count = 0;
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		if (['node_modules', 'dist', '.turbo'].includes(entry.name)) continue;
		const file = path.join(dir, entry.name);
		if (entry.isDirectory()) count += countTestFiles(file);
		else if (/\.test\.tsx?$/.test(entry.name) && !NOT_RUN_IN_CI.test(file))
			count++;
	}
	return count;
}

/**
 * Workspace packages under packages/ and adapters/ that define the task's
 * script. A test package weighs its jest startup plus its test files; every
 * build weighs the same.
 */
export function shardPackages(rootDir: string, task: Task): ShardPackage[] {
	const found: ShardPackage[] = [];
	for (const root of ['packages', 'adapters']) {
		const base = path.join(rootDir, root);
		if (!fs.existsSync(base)) continue;
		for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const dir = path.join(base, entry.name);
			const manifest = path.join(dir, 'package.json');
			if (!fs.existsSync(manifest)) continue;
			const pkg = JSON.parse(fs.readFileSync(manifest, 'utf8'));
			if (typeof pkg.name !== 'string' || !pkg.scripts?.[task]) continue;
			found.push({
				name: pkg.name,
				weight: task === 'test' ? STARTUP_WEIGHT + countTestFiles(dir) : 1,
			});
		}
	}
	return found;
}

/**
 * Longest-processing-time-first: the heaviest package goes to the lightest
 * shard. Ties break on name so every shard computes the same split.
 */
export function assignShards(
	packages: ShardPackage[],
	total: number,
): string[][] {
	const shards = Array.from({ length: total }, () => ({
		load: 0,
		names: [] as string[],
	}));
	const ordered = [...packages].sort(
		(a, b) => b.weight - a.weight || a.name.localeCompare(b.name),
	);
	for (const pkg of ordered) {
		const lightest = shards.reduce((best, shard) =>
			shard.load < best.load ? shard : best,
		);
		lightest.load += pkg.weight;
		lightest.names.push(pkg.name);
	}
	return shards.map((shard) => shard.names.sort());
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const shard = Number(process.argv[2]);
	const total = Number(process.argv[3]);
	const task = process.argv[4] ?? 'test';
	if (
		!Number.isInteger(shard) ||
		!Number.isInteger(total) ||
		shard < 1 ||
		shard > total ||
		(task !== 'build' && task !== 'test')
	) {
		console.error(
			'usage: package-shards.ts <shard> <total> [build|test], 1 <= shard <= total',
		);
		process.exit(1);
	}
	const names =
		assignShards(shardPackages(process.cwd(), task), total)[shard - 1] ?? [];
	console.log(names.map((name) => `--filter=${name}`).join('\n'));
}
