import assert from 'node:assert/strict';
import { isAlreadyPublished, waitUntilOnNpm } from './npm-publish-errors.mjs';

// The real E403 npm returns when the version already exists — must be skipped.
assert.equal(
	isAlreadyPublished(
		'npm error code E403\nnpm error 403 You cannot publish over the previously published versions: 0.1.0.',
	),
	true,
);
assert.equal(
	isAlreadyPublished('EPUBLISHCONFLICT: cannot modify pre-existing version'),
	true,
);
// The 409 npm returned when two deploy runs raced to publish the same new
// package (corsair 7d0035a90, 11-07).
assert.equal(
	isAlreadyPublished(
		'npm error code E409\nnpm error 409 Conflict - PUT https://registry.npmjs.org/@corsair-dev%2fsalesflare - Cannot publish over previously staged version "0.1.0".',
	),
	true,
);

// Real failures must NOT be swallowed — the deploy has to go red on these.
// A bare 409 is ambiguous (e.g. rate-limit), not proof of a duplicate.
assert.equal(
	isAlreadyPublished('npm error 409 Conflict - too many requests'),
	false,
);
assert.equal(
	isAlreadyPublished('npm error code E401\nnpm error 401 Unauthorized'),
	false,
);
assert.equal(isAlreadyPublished('npm error code ENEEDAUTH'), false);
assert.equal(
	isAlreadyPublished(
		'npm error 403 Forbidden - you do not have permission to publish',
	),
	false,
);
assert.equal(isAlreadyPublished('npm error network ETIMEDOUT'), false);
assert.equal(isAlreadyPublished(''), false);
assert.equal(isAlreadyPublished(undefined), false);

// waitUntilOnNpm: skip a duplicate only once npm serves that exact version.
{
	const sleeps = [];
	const answers = [null, null, '0.1.0'];
	const views = [];
	const ok = waitUntilOnNpm('@corsair-dev/x', '0.1.0', {
		view: (spec) => {
			views.push(spec);
			return answers.shift() ?? null;
		},
		sleep: (ms) => sleeps.push(ms),
		attempts: 5,
		delayMs: 7,
	});
	assert.equal(ok, true);
	assert.deepEqual(views, Array(3).fill('@corsair-dev/x@0.1.0'));
	assert.deepEqual(sleeps, [7, 7]);
}
{
	// Never served within the bound: not on npm, so the deploy must fail.
	const sleeps = [];
	const ok = waitUntilOnNpm('@corsair-dev/x', '0.1.0', {
		view: () => null,
		sleep: (ms) => sleeps.push(ms),
		attempts: 3,
		delayMs: 5,
	});
	assert.equal(ok, false);
	assert.deepEqual(sleeps, [5, 5]);
}
{
	// A different version being served doesn't count.
	const ok = waitUntilOnNpm('@corsair-dev/x', '0.1.0', {
		view: () => '0.0.9',
		sleep: () => {},
		attempts: 2,
	});
	assert.equal(ok, false);
}

console.log('npm-publish-errors: all assertions passed');
