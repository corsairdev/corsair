import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assignShards, shardPackages } from './package-shards.ts';

test('every package lands in exactly one shard', () => {
	const packages = Array.from({ length: 23 }, (_, i) => ({
		name: `pkg-${i}`,
		weight: (i % 5) + 1,
	}));
	const shards = assignShards(packages, 4);
	const all = shards.flat();
	assert.equal(all.length, packages.length);
	assert.deepEqual(new Set(all), new Set(packages.map((p) => p.name)));
});

test('puts the heaviest packages on different shards', () => {
	const shards = assignShards(
		[
			{ name: 'core', weight: 110 },
			{ name: 'big', weight: 12 },
			{ name: 'a', weight: 2 },
			{ name: 'b', weight: 2 },
		],
		2,
	);
	assert.deepEqual(shards, [['core'], ['a', 'b', 'big']]);
});

test('gives the same split regardless of input order', () => {
	const packages = [
		{ name: 'x', weight: 3 },
		{ name: 'y', weight: 3 },
		{ name: 'z', weight: 1 },
	];
	assert.deepEqual(
		assignShards(packages, 2),
		assignShards([...packages].reverse(), 2),
	);
});

test('the real repo splits its tests into four shards within 10% of each other', () => {
	const packages = shardPackages(process.cwd(), 'test');
	assert.ok(packages.length > 100);
	const byName = new Map(packages.map((p) => [p.name, p.weight]));
	const loads = assignShards(packages, 4).map((names) =>
		names.reduce((sum, name) => sum + (byName.get(name) ?? 0), 0),
	);
	const max = Math.max(...loads);
	const min = Math.min(...loads);
	assert.ok((max - min) / max < 0.1, `shard loads ${loads.join(', ')}`);
});

test('build shards cover packages without tests, like app and ui', () => {
	const builds = shardPackages(process.cwd(), 'build').map((p) => p.name);
	const tests = new Set(
		shardPackages(process.cwd(), 'test').map((p) => p.name),
	);
	assert.ok(builds.includes('@corsair-dev/ui'));
	assert.ok(!tests.has('@corsair-dev/ui'));
});
