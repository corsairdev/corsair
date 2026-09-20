import assert from 'node:assert/strict';
import { isAlreadyPublished } from './npm-publish-errors.mjs';

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

console.log('npm-publish-errors: all assertions passed');
