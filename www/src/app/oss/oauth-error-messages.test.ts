import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { UNVERIFIED_EMAIL_MESSAGE } from '@/server/oss-connect/sign-up';

import {
	connectErrorMessage,
	signInErrorMessage,
} from './oauth-error-messages';

describe('signInErrorMessage', () => {
	it('shows nothing without an error code', () => {
		assert.equal(signInErrorMessage(undefined), null);
		assert.equal(signInErrorMessage(''), null);
	});

	it('explains each sign-in failure better-auth can send back', () => {
		assert.match(signInErrorMessage('access_denied') ?? '', /cancelled/);
		assert.match(
			signInErrorMessage('account_not_linked') ?? '',
			/already a corsair\.dev account/,
		);
		assert.match(signInErrorMessage('unverified_email') ?? '', /not verified/);
		assert.match(signInErrorMessage('email_not_found') ?? '', /email link/);
	});

	it('explains the code auth.ts sends when it refuses an unverified email', () => {
		// better-auth's callback joins the error message's words with underscores.
		const code = UNVERIFIED_EMAIL_MESSAGE.split(' ').join('_');
		assert.equal(
			signInErrorMessage(code),
			signInErrorMessage('unverified_email'),
		);
		assert.match(signInErrorMessage(code) ?? '', /not verified/);
	});

	it('falls back to a general message for an unknown code', () => {
		assert.match(signInErrorMessage('state_mismatch') ?? '', /Try again/);
	});
});

describe('connectErrorMessage', () => {
	it('names the provider that failed', () => {
		assert.equal(
			connectErrorMessage('access_denied', 'discord'),
			'Connecting Discord was cancelled.',
		);
		assert.match(
			connectErrorMessage(null, 'github'),
			/Couldn't connect GitHub/,
		);
		assert.match(connectErrorMessage(null, null), /that account/);
	});

	it('points a GitHub account held by another profile at support', () => {
		assert.match(
			connectErrorMessage('account_already_linked_to_different_user', 'github'),
			/#support/,
		);
		assert.match(
			connectErrorMessage(
				'account_already_linked_to_different_user',
				'discord',
			),
			/another corsair\.dev account/,
		);
	});

	it('blames an unverified email only for GitHub', () => {
		assert.match(
			connectErrorMessage('unable_to_link_account', 'github'),
			/GitHub email is verified/,
		);
		assert.doesNotMatch(
			connectErrorMessage('unable_to_link_account', 'discord'),
			/verified/,
		);
	});
});
